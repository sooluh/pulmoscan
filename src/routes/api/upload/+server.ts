import { tmpdir } from 'os';
import { join } from 'path';
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
			const output = data.toString();

			if (output.startsWith('PULMOSCAN: ')) {
				error += output;
			}
		});

		process.on('close', (code) => {
			if (code !== 0) {
				reject(new Error(`Process exited with code ${code}: ${error}`));
			} else {
				resolve(result.trim());
			}
		});
	});
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('image') as File;

		if (!file || !(file instanceof File)) {
			return json({ error: 'Tidak ada berkas yang diunggah' }, { status: 400 });
		}

		const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

		if (!allowed.includes(file.type)) {
			return json({ error: 'Tipe berkas tidak diizinkan' }, { status: 400 });
		}

		const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

		if (file.size > MAX_FILE_SIZE) {
			return json({ error: 'Ukuran berkas terlalu besar (maks 10MB)' }, { status: 400 });
		}

		const tempDir = await mkdtemp(join(tmpdir(), 'pulmoscan-'));
		const filePath = join(tempDir, `${Date.now()}-${file.name}`);

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		await writeFile(filePath, buffer);

		const isxray = await spawnPromise('python3', ['./interpreter/isxray.py', filePath]);

		if (isxray.trim() === 'PULMOSCAN: panic') {
			throw new Error('is xray panic');
		}

		if (isxray.trim() === 'PULMOSCAN: false') {
			return json({ error: 'Berkas yang diunggah bukan gambar X-ray' }, { status: 400 });
		}

		const clasify = await spawnPromise('python3', ['./interpreter/pulmoscan.py', filePath]);

		if (clasify.trim() === 'PULMOSCAN: panic') {
			throw new Error('pulmoscan panic');
		}

		const parsed = JSON.parse(clasify.replace('PULMOSCAN: ', ''));
		return json({ message: 'Upload berhasil', class: parsed.class, scores: parsed.scores });
	} catch (error) {
		console.error('Error upload:', error);
		return json({ error: 'Terjadi kesalahan pada sisi server' }, { status: 500 });
	}
};
