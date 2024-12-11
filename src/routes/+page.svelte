<script lang="ts">
  import { InfoIcon } from 'lucide-svelte';
  import Modal from '../components/Modal.svelte';
  import Table from '../components/Table.svelte';
  import Button from '../components/Button.svelte';
  import Pulmoscan from '../components/Pulmoscan.svelte';

  const classes: Record<string, string> = {
    NORMAL: 'Normal',
    PNEUMONIA: 'Pneumonia',
    COVID19: 'Covid-19',
    TUBERCULOSIS: 'Tuberculosis',
  };

  let isModalOpen = false;
  let result: { class: string; scores: number } | null = null;

  const toggleModal = () => {
    isModalOpen = !isModalOpen;
  };

  const datasetInfo = [
    { class: 'Normal', total: 2013 },
    { class: 'Pneumonia', total: 4273 },
    { class: 'Covid-19', total: 2031 },
    { class: 'Tuberculosis', total: 2031 },
  ];

  const developers = [
    { github: 'sooluh', name: 'Suluh Sulistiawan', role: '211351143' },
    { github: 'irgiys', name: 'Irgiyansyah', role: '211351068' },
    { github: 'nitaan', name: 'Nita Andriani', role: '211351104' },
  ];
</script>

<svelte:head>
  <title>Pulmoscan</title>
</svelte:head>

<main class="relative flex min-h-screen flex-col bg-gray-100">
  <div class="absolute right-4 top-4">
    <Button on:click={toggleModal} variant="outline" size="icon">
      <InfoIcon class="h-4 w-4" />
    </Button>
  </div>

  <div class="flex flex-grow items-center justify-center">
    <div class="w-full max-w-md space-y-8 p-4 text-center">
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-gray-900">Pulmoscan</h1>
        <p class="text-gray-600">Deteksi penyakit paru-paru dari gambar X-Ray Anda</p>
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
  </div>

  <footer class="p-4 text-center text-sm text-gray-500">
    <a
      href="https://github.com/sooluh/pulmoscan"
      class="text-blue-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub
    </a>
    <span class="mx-2">&bullet;</span>
    <span>Pulmoscan is an open-source project</span>
  </footer>
</main>

<Modal bind:isOpen={isModalOpen} on:close={toggleModal}>
  <h2 slot="header">Informasi Dataset</h2>

  <div slot="content">
    <Table>
      <thead>
        <tr>
          <th>Kelas</th>
          <th>Total Dataset</th>
        </tr>
      </thead>
      <tbody>
        {#each datasetInfo as info}
          <tr>
            <td>{info.class}</td>
            <td>{info.total}</td>
          </tr>
        {/each}
      </tbody>
    </Table>

    <h2 class="my-4 text-xl font-bold">Pengembang</h2>

    <Table>
      <tbody>
        <tr>
          {#each developers as dev}
            <td>
              <div class="flex flex-col items-center">
                <img
                  src="https://github.com/{dev.github}.png"
                  alt={dev.name}
                  width={50}
                  height={50}
                  class="mb-2 rounded-full"
                />
                <p class="mb-0 text-center font-semibold">{dev.name}</p>
                <p class="mb-0 text-center text-gray-500">{dev.role}</p>
              </div>
            </td>
          {/each}
        </tr>
      </tbody>
    </Table>
  </div>
</Modal>
