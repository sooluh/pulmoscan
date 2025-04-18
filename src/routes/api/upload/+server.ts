import { tmpdir } from 'os';
import { join } from 'path';
import { rm } from 'fs/promises';
import { json } from '@sveltejs/kit';
import { spawn } from 'child_process';
import type { RequestHandler } from './$types';
import { mkdtemp, writeFile } from 'fs/promises';

const spawnPromise = (command: string, args: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);

    let result = '';
    let error = '';

    process.stdout.on('data', (data) => {
      const output = data.toString();

      if (output.startsWith('PULMOSCAN: ')) {
        result += output;
      }
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        console.error(error);
        reject(new Error(`Process exited with code ${code}: ${error}`));
      } else {
        resolve(result.trim());
      }
    });
  });
};

export const POST: RequestHandler = async ({ request }) => {
  const tmpDir = await mkdtemp(join(tmpdir(), 'pulmoscan-'));

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file || !(file instanceof File)) {
      return json({ error: 'Tidak ada berkas yang diunggah' }, { status: 400 });
    }

    const allowed = ['image/jpeg', 'image/png'];

    if (!allowed.includes(file.type)) {
      return json({ error: 'Tipe berkas tidak diizinkan' }, { status: 400 });
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    if (file.size > MAX_FILE_SIZE) {
      return json({ error: 'Ukuran berkas terlalu besar (maks 10MB)' }, { status: 400 });
    }

    const filePath = join(tmpDir, `${Date.now()}-${file.name}`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    const isxray = await spawnPromise('python3', ['./interpreter/isxray.py', filePath]);
    console.log(`[isxray] ${isxray.trim()}`);

    if (isxray.trim() === 'PULMOSCAN: panic') {
      throw new Error('is xray panic');
    }

    if (isxray.trim() === 'PULMOSCAN: false') {
      return json({ error: 'Berkas yang diunggah bukan gambar X-Ray' }, { status: 400 });
    }

    const scan = await spawnPromise('python3', ['./interpreter/pulmoscan.py', filePath]);
    console.log(`[scan] ${scan.trim()}`);

    if (scan.trim() === 'PULMOSCAN: panic') {
      throw new Error('pulmoscan panic');
    }

    const parsed = JSON.parse(scan.replace('PULMOSCAN: ', ''));

    return json({
      message: 'Berhasil melakukan klasifikasi pada gambar X-Ray',
      class: parsed.class,
      scores: parsed.scores,
    });
  } catch (error) {
    console.error('Error upload:', error);
    return json({ error: 'Terjadi kesalahan pada sisi server' }, { status: 500 });
  } finally {
    try {
      await rm(tmpDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Temporary directory cleanup error:', cleanupError);
    }
  }
};
