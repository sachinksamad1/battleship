<script lang="ts">
  import { FLEET_CONFIG } from '../../game/types';
  import { placementStore, selectShip, rotateShip } from '../../stores/placementStore';
  import Ship from '../ship/Ship.svelte';

  let selectedId = $derived($placementStore.selectedShip?.id);
  let orientation = $derived($placementStore.currentOrientation);
  let placedIds = $derived($placementStore.placedShips.map(ps => ps.definition.id));

  function handleShipClick(ship: any) {
    if (placedIds.includes(ship.id)) return;
    selectShip(ship);
  }
</script>

<div class="flex flex-col gap-6 p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl w-full max-w-sm">
  <div class="flex justify-between items-center">
    <h3 class="text-xl font-bold text-white uppercase tracking-tight">Your Fleet</h3>
    <button 
      class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-bold transition-colors"
      onclick={rotateShip}
    >
      Rotate (R)
    </button>
  </div>

  <div class="flex flex-col gap-4">
    {#each FLEET_CONFIG as ship}
      {@const isPlaced = placedIds.includes(ship.id)}
      {@const isSelected = selectedId === ship.id}
      
      <button 
        class="group relative flex items-center justify-between p-4 rounded-xl border-2 transition-all
               {isPlaced ? 'border-slate-700 bg-slate-800/50 opacity-40 cursor-not-allowed' : 
                isSelected ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-900/20' : 
                'border-slate-700 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'}"
        onclick={() => handleShipClick(ship)}
        disabled={isPlaced}
      >
        <div class="flex flex-col items-start">
          <span class="text-sm font-bold {isSelected ? 'text-blue-400' : 'text-slate-300'} group-hover:text-white transition-colors">
            {ship.name}
          </span>
          <span class="text-xs text-slate-500">{ship.length} Units</span>
        </div>

        <div class="scale-75 origin-right">
          <Ship {ship} orientation="H" />
        </div>

        {#if isPlaced}
          <div class="absolute inset-0 flex items-center justify-center bg-slate-900/20 rounded-lg">
            <span class="bg-slate-700 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">Deployed</span>
          </div>
        {/if}
      </button>
    {/each}
  </div>

  <div class="mt-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
    <p class="text-xs text-slate-400 leading-relaxed italic">
      Select a ship and click on the board to deploy. Use double-click or the 'R' key to rotate.
    </p>
  </div>
</div>
