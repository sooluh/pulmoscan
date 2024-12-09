<script lang="ts">
  export let variant: 'default' | 'outline' | 'ghost' = 'default';
  export let size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
  let className = '';
  export { className as class };
</script>

<button
  on:click
  class={`focus-visible:ring-ring ring-offset-background inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variant === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''} ${variant === 'outline' ? 'border-input hover:bg-accent hover:text-accent-foreground border' : ''} ${variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : ''} ${size === 'default' ? 'h-10 px-4 py-2' : ''} ${size === 'sm' ? 'h-9 rounded-md px-3' : ''} ${size === 'lg' ? 'h-11 rounded-md px-8' : ''} ${size === 'icon' ? 'h-10 w-10' : ''} ${className}`}
  {...$$restProps}
>
  <slot />
</button>
