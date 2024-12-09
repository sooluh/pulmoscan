<script lang="ts">
  let className = '';
  export { className as class };
</script>

<div class="w-full overflow-auto">
  <table class={`w-full caption-bottom text-sm ${className}`}>
    <slot />
  </table>
</div>

<style>
  table {
    @apply border;
  }

  table :global(thead) {
    @apply border-b;
  }

  table :global(tbody tr) {
    @apply border-b transition-colors;
  }

  table :global(tbody tr:last-child) {
    @apply border-0;
  }

  table :global(th) {
    @apply h-12 px-4 text-left align-middle font-medium;
  }

  table :global(td) {
    @apply p-4 align-middle;
  }
</style>
