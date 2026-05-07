<script lang="ts">
	import { gameStore } from '../../stores/gameStore';
	import { playerStore, enemyStore } from '../../stores/playerStore';

	import { socketStore } from '../../socket/client';

	let phase = $derived($gameStore.phase);
	let turn = $derived($gameStore.turn);
	let winner = $derived($gameStore.winner);
	let isMultiplayer = $derived($socketStore !== null);

	function getMessage() {
		if (winner) {
			if (winner === 'player') return 'Victory! You sank the enemy fleet!';
			return `Defeat! ${$enemyStore.name} destroyed your fleet.`;
		}
		if (phase === 'matchmaking') return 'Waiting for opponent...';
		if (phase === 'placement') return 'Deploy your fleet to the grid.';
		if (phase === 'battle') {
			if (turn === 'player') return 'Your turn! Select a target.';
			return isMultiplayer ? `${$enemyStore.name} is choosing a target...` : 'AI is calculating...';
		}
		return 'Welcome to Battleship.';
	}
</script>

<div
	class="flex w-full items-center justify-between rounded-b-xl border-t border-slate-700 bg-slate-800 px-6 py-4 text-white shadow-md"
>
	<div class="flex flex-col">
		<span class="text-sm font-semibold tracking-widest text-slate-400 uppercase">Game Status</span>
		<span class="text-xl font-bold tracking-tight">{getMessage()}</span>
	</div>

	<div class="flex gap-8">
		<div class="flex flex-col items-center">
			<span class="text-xs text-slate-400 uppercase">Your Ships</span>
			<span class="font-mono text-2xl text-green-400">
				{$playerStore.ships.filter((s) => !s.sunk).length} / 5
			</span>
		</div>
		<div class="flex flex-col items-center">
			<span class="text-xs text-slate-400 uppercase">Enemy Ships</span>
			<span class="font-mono text-2xl text-red-400">
				{$enemyStore.ships.filter((s) => !s.sunk).length} / 5
			</span>
		</div>
	</div>
</div>
