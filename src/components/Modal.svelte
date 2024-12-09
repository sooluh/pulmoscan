<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { X } from 'lucide-svelte';

  export let isOpen = false;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex overflow-auto bg-black bg-opacity-50 p-4"
    on:click|self={close}
    transition:fade
  >
    <div
      class="relative m-auto flex w-full max-w-xl flex-col rounded-lg bg-white p-8"
      transition:fly={{ y: 100, duration: 300 }}
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-bold">
          <slot name="header" />
        </h2>
        <button on:click={close} class="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div class="overflow-auto">
        <slot name="content" />
      </div>
    </div>
  </div>
{/if}
