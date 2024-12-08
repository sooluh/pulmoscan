<script lang="ts">
	import { ImageIcon, X, FileUp } from 'lucide-svelte';

	let fileInput: HTMLInputElement;
	let dragOver = false;
	let file: File | null = null;
	let previewUrl: string | null = null;
	let uploadProgress = 0;
	let isUploading = false;
	let uploadError: string | null = null;

	const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
	const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

	function createPreview(selectedFile: File) {
		if (!ALLOWED_TYPES.includes(selectedFile.type)) {
			uploadError = 'Tipe file tidak diizinkan. Pilih JPEG, PNG, GIF, atau WEBP.';
			return false;
		}

		if (selectedFile.size > MAX_FILE_SIZE) {
			uploadError = 'Ukuran file terlalu besar. Maks 10MB.';
			return false;
		}

		previewUrl = URL.createObjectURL(selectedFile);
		file = selectedFile;
		uploadError = null;

		return true;
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;

		if (input.files && input.files.length > 0) {
			createPreview(input.files[0]);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;

		if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
			createPreview(event.dataTransfer.files[0]);
		}
	}

	function uploadFile() {
		if (!file) return;

		isUploading = true;
		uploadProgress = 0;
		uploadError = null;

		const xhr = new XMLHttpRequest();
		const formData = new FormData();

		formData.append('image', file);

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) {
				uploadProgress = Math.round((event.loaded / event.total) * 100);
			}
		};

		xhr.onload = () => {
			isUploading = false;

			if (xhr.status === 200) {
				const result = JSON.parse(xhr.responseText);
				console.log('Upload berhasil:', result);
			} else {
				const errorResponse = JSON.parse(xhr.responseText);
				uploadError = errorResponse.error || 'Upload gagal';
			}
		};

		xhr.onerror = () => {
			isUploading = false;
			uploadError = 'Gagal terhubung ke server';
		};

		xhr.onloadend = () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}

			file = null;
			previewUrl = null;
			uploadProgress = 0;

			if (fileInput) fileInput.value = '';
		};

		xhr.open('POST', '/api/upload', true);
		xhr.send(formData);
	}

	function clearFile() {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}

		file = null;
		previewUrl = null;
		uploadProgress = 0;
		uploadError = null;

		if (fileInput) fileInput.value = '';
	}

	function triggerFileInput() {
		fileInput.click();
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}
</script>

<input
	type="file"
	bind:this={fileInput}
	on:change={handleFileSelect}
	accept="image/jpeg,image/png,image/gif,image/webp"
	class="hidden"
/>

{#if uploadError}
	<div class="mb-4 rounded bg-red-100 p-3 text-red-700">
		{uploadError}
	</div>
{/if}

{#if previewUrl}
	<div class="mb-4 w-full max-w-md">
		<div class="relative">
			<img
				src={previewUrl}
				alt="Pratinjau gambar"
				class="w-full rounded-lg object-cover shadow-md"
			/>
			<button
				on:click={clearFile}
				class="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white"
			>
				<X class="h-5 w-5" />
			</button>
		</div>

		{#if isUploading}
			<div class="mt-4 w-full">
				<div class="mb-2 flex justify-between text-sm text-gray-600">
					<span>{uploadProgress < 100 ? 'Mengunggah' : 'Sedang Memproses'}</span>
					<span>{uploadProgress}%</span>
				</div>
				<div class="h-2 w-full rounded-full bg-gray-200">
					<div
						class="h-2 rounded-full bg-blue-500 transition-all duration-300"
						style="width: {uploadProgress}%"
					></div>
				</div>
			</div>
		{:else}
			<button
				on:click={uploadFile}
				class="mt-4 flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			>
				<FileUp class="h-5 w-5" />
				<span>Unggah Gambar</span>
			</button>
		{/if}
	</div>
{:else}
	<div
		role="button"
		tabindex="0"
		on:click={triggerFileInput}
		on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
		class="flex cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg border-2 {dragOver
			? 'border-blue-500 bg-blue-50'
			: 'border-dashed border-gray-300'} p-8 transition-colors hover:border-gray-400"
	>
		<ImageIcon class="h-12 w-12 text-gray-400" />
		<p class="text-sm text-gray-500">
			{#if dragOver}
				Lepaskan gambar di sini
			{:else}
				Tekan atau lepaskan gambar di sini
			{/if}
		</p>
	</div>
{/if}
