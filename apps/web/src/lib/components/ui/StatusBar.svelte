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

<div class="w-full py-4 px-6 bg-slate-800 text-white flex justify-between items-center rounded-b-xl shadow-md border-t border-slate-700">
  <div class="flex flex-col">
    <span class="text-sm uppercase tracking-widest text-slate-400 font-semibold">Game Status</span>
    <span class="text-xl font-bold tracking-tight">{getMessage()}</span>
  </div>
  
  <div class="flex gap-8">
    <div class="flex flex-col items-center">
      <span class="text-xs uppercase text-slate-400">Your Ships</span>
      <span class="text-2xl font-mono text-green-400">
        {$playerStore.ships.filter(s => !s.sunk).length} / 5
      </span>
    </div>
    <div class="flex flex-col items-center">
      <span class="text-xs uppercase text-slate-400">Enemy Ships</span>
      <span class="text-2xl font-mono text-red-400">
        {$enemyStore.ships.filter(s => !s.sunk).length} / 5
      </span>
    </div>
  </div>
</div>
