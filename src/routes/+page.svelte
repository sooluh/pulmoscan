<script lang="ts">
	import Pulmoscan from '../components/Pulmoscan.svelte';

	const classes: Record<string, string> = {
		NORMAL: 'Normal',
		PNEUMONIA: 'Pneumonia',
		COVID19: 'Covid-19',
		TUBERCULOSIS: 'Tuberculosis'
	};

	let result: { class: string; scores: number } | null = null;
</script>

<main class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
	<div class="w-full max-w-md space-y-8 text-center">
		<div class="space-y-2">
			<h1 class="text-4xl font-bold text-gray-900">Pulmoscan</h1>
			<p class="text-gray-600">Deteksi penyakit paru-paru dari gambar X-Ray Anda.</p>
		</div>

		<Pulmoscan bind:result />

		{#if result}
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-2 text-2xl font-semibold text-gray-800">
					{classes[result.class] || 'Tidak Diketahui'}
				</h2>

				<p class="text-gray-600">
					Hasil analisis menunjukkan bahwa gambar X-Ray diklasifikasikan sebagai
					<strong>{classes[result.class] || 'Tidak Diketahui'}</strong> dengan tingkat keyakinan
					sebesar <strong>{result.scores}%</strong>.
				</p>
			</div>
		{/if}
	</div>
</main>
