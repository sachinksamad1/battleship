<script lang="ts">
  import { playerStore } from '../../stores/playerStore';
  import { startSinglePlayerGame } from '../../game/gameController';
  import { connectSocket, createRoom, joinRoom } from '../../socket/client';
  import { setPhase } from '../../stores/gameStore';

  let playerName = $state('Admiral');
  let joinCode = $state('');
  let mode = $state<'main' | 'multiplayer'>('main');

  function handleSinglePlayer() {
    playerStore.update(s => ({ ...s, name: playerName }));
    startSinglePlayerGame();
  }

  function handleMultiplayer() {
    mode = 'multiplayer';
    connectSocket();
  }

  function handleCreateRoom() {
    playerStore.update(s => ({ ...s, name: playerName }));
    createRoom(playerName);
  }

  function handleJoinRoom() {
    if (!joinCode) return;
    playerStore.update(s => ({ ...s, name: playerName }));
    joinRoom(joinCode, playerName);
  }
</script>

<div class="max-w-md w-full bg-slate-800 border-2 border-slate-700 p-10 rounded-3xl shadow-2xl animate-fade-in">
  <h2 class="text-4xl font-black text-white mb-8 text-center uppercase tracking-tighter italic">
    Prepare for Battle
  </h2>

  <div class="space-y-6">
    <div>
      <label for="playerName" class="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2 ml-1">
        Your Callsign
      </label>
      <input 
        id="playerName"
        type="text" 
        bind:value={playerName}
        placeholder="Enter name..."
        class="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:border-blue-500 outline-none transition-colors"
      />
    </div>

    {#if mode === 'main'}
      <div class="grid grid-cols-1 gap-4 pt-4">
        <button 
          class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/40"
          onclick={handleSinglePlayer}
        >
          Single Player
        </button>
        <button 
          class="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xl font-bold transition-all active:scale-95 border border-slate-600"
          onclick={handleMultiplayer}
        >
          Multiplayer
        </button>
      </div>
    {:else}
      <div class="space-y-6 pt-4 animate-slide-up">
        <button 
          class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/40"
          onclick={handleCreateRoom}
        >
          Create New Room
        </button>

        <div class="relative py-2 flex items-center">
          <div class="flex-grow border-t border-slate-700"></div>
          <span class="flex-shrink mx-4 text-slate-500 text-xs font-bold uppercase tracking-widest">or</span>
          <div class="flex-grow border-t border-slate-700"></div>
        </div>

        <div class="space-y-3">
          <input 
            type="text" 
            bind:value={joinCode}
            placeholder="Enter Room Code"
            class="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-white font-bold text-center tracking-widest focus:border-red-500 outline-none transition-colors uppercase"
          />
          <button 
            class="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-900/40"
            onclick={handleJoinRoom}
          >
            Join Room
          </button>
        </div>

        <button 
          class="w-full text-slate-400 hover:text-white text-sm font-bold transition-colors pt-2"
          onclick={() => mode = 'main'}
        >
          ← Back to Main Menu
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
  .animate-slide-up {
    animation: slideUp 0.3s ease-out forwards;
  }
</style>
