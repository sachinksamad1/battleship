<script lang="ts">
  import type { ShipDefinition } from '../../game/types';
  import { settingsStore } from '../../stores/settingsStore';

  let { 
    ship, 
    orientation = 'H', 
    isDragging = false,
    sunk = false,
    ondoubleclick
  } = $props<{
    ship: ShipDefinition;
    orientation?: 'H' | 'V';
    isDragging?: boolean;
    sunk?: boolean;
    ondoubleclick?: () => void;
  }>();

  let lengthCells = $derived(Array(ship.length).fill(0));

  // Determine ship color based on type
  const shipColors: Record<string, string> = {
    carrier: 'from-slate-600 to-slate-800',
    battleship: 'from-blue-700 to-blue-900',
    cruiser: 'from-emerald-700 to-emerald-900',
    submarine: 'from-amber-700 to-amber-900',
    destroyer: 'from-rose-700 to-rose-900'
  };

  let gradient = $derived(shipColors[ship.id] || 'from-slate-500 to-slate-700');
  let animationsEnabled = $derived($settingsStore.animationsEnabled);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="ship flex {orientation === 'V' ? 'flex-col' : 'flex-row'} gap-0 cursor-grab active:cursor-grabbing {isDragging ? 'opacity-50' : ''} drop-shadow-lg"
  class:animate-sink={sunk && animationsEnabled}
  class:opacity-40={sunk}
  class:grayscale={sunk}
  ondblclick={ondoubleclick}
>
  {#each lengthCells as _, i}
    <div 
      class="w-10 h-10 border border-white/10 bg-gradient-to-br {gradient} relative overflow-hidden transition-all duration-500"
      class:rounded-l-2xl={orientation === 'H' && i === 0}
      class:rounded-r-2xl={orientation === 'H' && i === ship.length - 1}
      class:rounded-t-2xl={orientation === 'V' && i === 0}
      class:rounded-b-2xl={orientation === 'V' && i === ship.length - 1}
    >
      <!-- Top shine -->
      <div class="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
      
      <!-- Ship Details (Hull details) -->
      <div class="absolute inset-0 flex items-center justify-center opacity-30">
        {#if (orientation === 'H' && (i > 0 && i < ship.length - 1)) || (orientation === 'V' && (i > 0 && i < ship.length - 1))}
           <div class="w-1/2 h-1/2 border-2 border-white rounded-sm"></div>
        {/if}
      </div>

      <!-- Pointy bow for first cell -->
      {#if i === 0}
        <div class="absolute inset-0 bg-white/5" 
             style="clip-path: {orientation === 'H' ? 'polygon(100% 0, 0 50%, 100% 100%)' : 'polygon(0 100%, 50% 0, 100% 100%)'}">
        </div>
      {/if}

      <!-- Stern detail for last cell -->
      {#if i === ship.length - 1}
        <div class="absolute inset-0 bg-black/10"
             style="clip-path: {orientation === 'H' ? 'polygon(0 0, 10% 0, 10% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 100% 10%, 0 10%)'}">
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .ship {
    width: max-content;
    height: max-content;
    transition: opacity 1s ease, filter 1s ease;
  }

  @keyframes sink {
    0% { transform: translate(0, 0) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, 10px) rotate(-2deg); opacity: 0.4; }
  }

  .animate-sink {
    animation: sink 1.5s ease-in-out forwards;
  }
</style>
