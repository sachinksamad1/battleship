<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { gameStore } from '$lib/stores/gameStore';
	import { playerStore, enemyStore } from '$lib/stores/playerStore';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { socketStore } from '$lib/socket/client';
	import { rotateShip } from '$lib/stores/placementStore';
	import { handleAttack, setupEnemyFleet } from '$lib/game/gameController';
	import Board from '$lib/components/board/Board.svelte';
	import PlacementView from '$lib/components/board/PlacementView.svelte';
	import StatusBar from '$lib/components/ui/StatusBar.svelte';
	import GameMenu from '$lib/components/ui/GameMenu.svelte';
	import Matchmaking from '$lib/components/ui/Matchmaking.svelte';

	let animationsEnabled = $derived($settingsStore.animationsEnabled);

	onMount(() => {
		// Listen for 'R' key to rotate ship
		window.addEventListener('keydown', (e) => {
			if (e.key.toLowerCase() === 'r') {
				rotateShip();
			}
		});
	});

	// When phase changes to battle, make sure AI is ready (Single Player only)
	$effect(() => {
		const isMultiplayer = $socketStore !== null;
		if ($gameStore.phase === 'battle' && !$enemyStore.ready && !isMultiplayer) {
			setupEnemyFleet();
		}
	});

	function onAttack(coord: { x: number; y: number }) {
		handleAttack('enemy', coord);
	}
</script>

<div class="flex flex-col items-center p-8">
	<header class="mb-12 text-center">
		<h1
			class="bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-6xl font-black tracking-tighter text-transparent uppercase italic"
		>
			Battleship
		</h1>
		<p class="mt-2 font-medium text-slate-400">Strategic Naval Warfare</p>
	</header>

	<div class="w-full max-w-6xl">
		{#if $gameStore.phase === 'menu'}
			<div
				transition:slide={animationsEnabled ? {} : { duration: 0 }}
				class="flex items-center justify-center py-20"
			>
				<GameMenu />
			</div>
		{:else if $gameStore.phase === 'matchmaking'}
			<div
				transition:slide={animationsEnabled ? {} : { duration: 0 }}
				class="flex items-center justify-center py-20"
			>
				<Matchmaking />
			</div>
		{:else}
			<div transition:slide={animationsEnabled ? {} : { duration: 0 }}>
				<StatusBar />

				{#if $gameStore.phase === 'placement'}
					<div class="mt-12">
						<PlacementView />
					</div>
				{:else}
					<div class="mt-12 grid grid-cols-1 items-start gap-16 md:grid-cols-2">
						<section class="flex flex-col items-center">
							<h2 class="mb-6 flex items-center gap-2 text-2xl font-bold text-blue-400">
								<span class="h-6 w-2 rounded-full bg-blue-500"></span>
								{$playerStore.name} Waters
							</h2>
							<Board board={$playerStore.board} />
						</section>

						<section class="flex flex-col items-center">
							<h2 class="mb-6 flex items-center gap-2 text-2xl font-bold text-red-400">
								<span class="h-6 w-2 rounded-full bg-red-500"></span>
								{$enemyStore.name} Territory
							</h2>
							<Board
								board={$enemyStore.board}
								isEnemy={true}
								canAttack={$gameStore.phase === 'battle' && $gameStore.turn === 'player'}
								onattack={onAttack}
							/>
						</section>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if $gameStore.phase === 'result'}
		<div
			transition:slide={animationsEnabled ? {} : { duration: 0 }}
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		>
			<div
				class="w-full max-w-lg rounded-3xl border-2 border-slate-700 bg-slate-800 p-12 text-center shadow-2xl"
			>
				<h2 class="mb-6 text-5xl font-black tracking-tighter uppercase">
					{$gameStore.winner === 'player' ? 'Mission Success' : 'Mission Failure'}
				</h2>
				<p class="mb-10 text-xl font-medium text-slate-300">
					{$gameStore.winner === 'player'
						? 'You have successfully eliminated the enemy fleet.'
						: 'Your fleet has been completely destroyed.'}
				</p>
				<button
					class="w-full rounded-xl bg-blue-600 py-4 text-xl font-bold text-white shadow-lg shadow-blue-900/40 transition-all hover:bg-blue-500 active:scale-95"
					onclick={() => location.reload()}
				>
					New Match
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
