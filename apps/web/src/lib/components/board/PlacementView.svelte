<script lang="ts">
	import { placementStore, resetPlacement } from '../../stores/placementStore';
	import { playerStore } from '../../stores/playerStore';
	import { aiStore, setAIDifficulty } from '../../stores/aiStore';
	import { socketStore, emitShipsPlaced } from '../../socket/client';
	import { startBattle } from '../../game/gameController';
	import { audioManager } from '../../audio/audioManager';
	import PlacementGrid from './PlacementGrid.svelte';
	import ShipPlacementPanel from './ShipPlacementPanel.svelte';
	import { FLEET_CONFIG } from '../../game/types';
	import { createBoard } from '../../game/engine/board';

	let isComplete = $derived($placementStore.placedShips.length === FLEET_CONFIG.length);
	let currentDifficulty = $derived($aiStore.difficulty);
	let isMultiplayer = $derived($socketStore !== null);
	let isReady = $derived($playerStore.ready);

	const difficulties = [
		{ id: 'easy', label: 'Easy' },
		{ id: 'medium', label: 'Medium' },
		{ id: 'hard', label: 'Hard' },
		{ id: 'expert', label: 'Pro' }
	] as const;

	function handleStart() {
		if (!isComplete) return;

		// Convert placementStore to playerStore
		let board = createBoard();
		const ships = $placementStore.placedShips.map((ps) => {
			const { x, y } = ps.coord;
			const coords = [];
			for (let i = 0; i < ps.definition.length; i++) {
				const cx = ps.orientation === 'H' ? x + i : x;
				const cy = ps.orientation === 'V' ? y + i : y;
				board[cy][cx] = { occupied: true, hit: false, shipId: ps.definition.id };
				coords.push({ x: cx, y: cy });
			}
			return {
				id: ps.definition.id,
				definitionId: ps.definition.id,
				coordinates: coords,
				hits: 0,
				sunk: false
			};
		});

		playerStore.updateBoard(board);
		playerStore.setShips(ships);
		playerStore.setReady(true);

		if (isMultiplayer) {
			emitShipsPlaced(ships);
		} else {
			startBattle();
		}

		audioManager.play('engage');
	}
</script>

<div
	class="animate-fade-in flex w-full max-w-6xl flex-col items-center justify-center gap-12 lg:flex-row lg:items-start"
>
	<div class="flex w-full max-w-[500px] flex-col gap-8">
		<div class="text-center lg:text-left">
			<h2 class="text-3xl font-black tracking-tight text-white uppercase">Deploy Your Fleet</h2>
			<p class="mt-1 font-medium text-slate-400">Position your ships for the upcoming battle.</p>
		</div>

		<PlacementGrid />

		{#if !isMultiplayer}
			<fieldset class="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4">
				<legend class="mb-3 block text-xs font-bold tracking-widest text-slate-500 uppercase"
					>Combat Difficulty</legend
				>
				<div class="grid grid-cols-4 gap-2">
					{#each difficulties as diff (diff.id)}
						<button
							class="rounded-lg border px-1 py-2 text-xs font-bold transition-all {currentDifficulty ===
							diff.id
								? 'border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-900/20'
								: 'border-slate-600 bg-slate-700 text-slate-400 hover:bg-slate-600'}"
							onclick={() => setAIDifficulty(diff.id)}
						>
							{diff.label}
						</button>
					{/each}
				</div>
			</fieldset>
		{/if}

		<div class="flex gap-4">
			<button
				class="flex-1 rounded-xl border border-slate-600 bg-slate-700 py-4 font-bold text-white transition-all hover:bg-slate-600 active:scale-95"
				onclick={resetPlacement}
			>
				Reset Layout
			</button>
			<button
				class="flex-[2] rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 active:scale-95 disabled:bg-slate-800 disabled:text-slate-600"
				disabled={!isComplete || isReady}
				onclick={handleStart}
			>
				{isReady ? 'Awaiting Opponent...' : 'Engage Target'}
			</button>
		</div>
	</div>

	<ShipPlacementPanel />
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fadeIn 0.4s ease-out forwards;
	}
</style>
