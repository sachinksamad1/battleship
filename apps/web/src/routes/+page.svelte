<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { gameStore } from '$lib/stores/gameStore';
  import { playerStore, enemyStore } from '$lib/stores/playerStore';
  import { settingsStore } from '$lib/stores/settingsStore';
  import { socketStore } from '$lib/socket/client';
  import { rotateShip } from '$lib/stores/placementStore';
  import { startSinglePlayerGame, handleAttack, startBattle, setupEnemyFleet } from '$lib/game/gameController';
  import Board from '$lib/components/board/Board.svelte';
  import PlacementView from '$lib/components/board/PlacementView.svelte';
  import StatusBar from '$lib/components/ui/StatusBar.svelte';
  import GameMenu from '$lib/components/ui/GameMenu.svelte';
  import Matchmaking from '$lib/components/ui/Matchmaking.svelte';
  import { FLEET_CONFIG } from '$lib/game/types';

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

  function onAttack(coord: { x: number, y: number }) {
    handleAttack('enemy', coord);
  }
</script>

<div class="flex flex-col items-center p-8">
  <header class="mb-12 text-center">
    <h1 class="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-600 uppercase">
      Battleship
    </h1>
    <p class="text-slate-400 mt-2 font-medium">Strategic Naval Warfare</p>
  </header>

  <div class="w-full max-w-6xl">
    {#if $gameStore.phase === 'menu'}
      <div transition:slide={animationsEnabled ? {} : { duration: 0 }} class="flex justify-center items-center py-20">
        <GameMenu />
      </div>
    {:else if $gameStore.phase === 'matchmaking'}
      <div transition:slide={animationsEnabled ? {} : { duration: 0 }} class="flex justify-center items-center py-20">
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
          <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <section class="flex flex-col items-center">
              <h2 class="mb-6 text-2xl font-bold text-blue-400 flex items-center gap-2">
                <span class="w-2 h-6 bg-blue-500 rounded-full"></span>
                {$playerStore.name} Waters
              </h2>
              <Board board={$playerStore.board} />
            </section>

            <section class="flex flex-col items-center">
              <h2 class="mb-6 text-2xl font-bold text-red-400 flex items-center gap-2">
                <span class="w-2 h-6 bg-red-500 rounded-full"></span>
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
    <div transition:slide={animationsEnabled ? {} : { duration: 0 }} class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 border-2 border-slate-700 p-12 rounded-3xl text-center shadow-2xl max-w-lg w-full">
        <h2 class="text-5xl font-black mb-6 uppercase tracking-tighter">
          {$gameStore.winner === 'player' ? 'Mission Success' : 'Mission Failure'}
        </h2>
        <p class="text-xl text-slate-300 mb-10 font-medium">
          {$gameStore.winner === 'player' ? 'You have successfully eliminated the enemy fleet.' : 'Your fleet has been completely destroyed.'}
        </p>
        <button 
          class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/40"
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
