<script lang="ts">
	import { FLEET_CONFIG, type ShipDefinition } from '../../game/types';
	import { placementStore, selectShip, rotateShip } from '../../stores/placementStore';
	import Ship from '../ship/Ship.svelte';

	let selectedId = $derived($placementStore.selectedShip?.id);
	let placedIds = $derived($placementStore.placedShips.map((ps) => ps.definition.id));

	function handleShipClick(ship: ShipDefinition) {
		if (placedIds.includes(ship.id)) return;
		selectShip(ship);
	}
</script>

<div
	class="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl"
>
	<div class="flex items-center justify-between">
		<h3 class="text-xl font-bold tracking-tight text-white uppercase">Your Fleet</h3>
		<button
			class="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-slate-200 transition-colors hover:bg-slate-600"
			onclick={rotateShip}
		>
			Rotate (R)
		</button>
	</div>

	<div class="flex flex-col gap-4">
		{#each FLEET_CONFIG as ship (ship.id)}
			{@const isPlaced = placedIds.includes(ship.id)}
			{@const isSelected = selectedId === ship.id}

			<button
				class="group relative flex items-center justify-between rounded-xl border-2 p-4 transition-all
               {isPlaced
					? 'cursor-not-allowed border-slate-700 bg-slate-800/50 opacity-40'
					: isSelected
						? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-900/20'
						: 'border-slate-700 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'}"
				onclick={() => handleShipClick(ship)}
				disabled={isPlaced}
			>
				<div class="flex flex-col items-start">
					<span
						class="text-sm font-bold {isSelected
							? 'text-blue-400'
							: 'text-slate-300'} transition-colors group-hover:text-white"
					>
						{ship.name}
					</span>
					<span class="text-xs text-slate-500">{ship.length} Units</span>
				</div>

				<div class="origin-right scale-75">
					<Ship {ship} orientation="H" />
				</div>

				{#if isPlaced}
					<div class="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/20">
						<span
							class="rounded bg-slate-700 px-2 py-0.5 text-[10px] font-black text-white uppercase"
							>Deployed</span
						>
					</div>
				{/if}
			</button>
		{/each}
	</div>

	<div class="mt-2 rounded-lg border border-slate-700 bg-slate-900/50 p-3">
		<p class="text-xs leading-relaxed text-slate-400 italic">
			Select a ship and click on the board to deploy. Use double-click or the 'R' key to rotate.
		</p>
	</div>
</div>
