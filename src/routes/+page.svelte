<script lang="ts">
	import Upload from '../components/Upload.svelte';

	function handleUpload(event: CustomEvent<{ file: File }>) {
		const file = event.detail.file;
		console.log(file);
	}
</script>

<main class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
	<div class="w-full max-w-md space-y-8 text-center">
		<h1 class="text-4xl font-bold text-gray-900">Pulmoscan</h1>
		<p class="text-gray-600">
			Deteksi penyakit paru-paru dengan gambar x-ray. Apakah normal, penumonia, tuberculosis atau
			covid-19?
		</p>

		<Upload on:upload={handleUpload} />

		<div class="rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-2 text-2xl font-semibold text-gray-800">COVID-19</h2>
			<p class="text-gray-600">
				Gambar yang Anda unggah adalah x-ray dari paru-paru pengidap COVID-19.
			</p>
		</div>
	</div>
</main>
