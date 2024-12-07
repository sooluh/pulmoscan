import { json } from '@sveltejs/kit';
import { mkdtemp, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		await new Promise((resolve) => setTimeout(resolve, 5_000));

		const formData = await request.formData();
		const file = formData.get('image') as File;

		if (!file || !(file instanceof File)) {
			return json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
		}

		const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

		if (!allowed.includes(file.type)) {
			return json({ error: 'Tipe file tidak diizinkan' }, { status: 400 });
		}

		const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

		if (file.size > MAX_FILE_SIZE) {
			return json({ error: 'Ukuran file terlalu besar (maks 10MB)' }, { status: 400 });
		}

		const tempDir = await mkdtemp(join(tmpdir(), 'pulmoscan-'));
		const filePath = join(tempDir, `${Date.now()}-${file.name}`);

		// konversi file ke buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		await writeFile(filePath, buffer);

		return json({
			message: 'Upload berhasil',
			path: filePath,
			filename: file.name,
			size: file.size,
			type: file.type
		});
	} catch (error) {
		console.error('Error upload:', error);
		return json({ error: 'Gagal mengunggah file' }, { status: 500 });
	}
};
