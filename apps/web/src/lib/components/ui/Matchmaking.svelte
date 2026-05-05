<script lang="ts">
  import { joinCodeStore } from '../../socket/client';
  
  let code = $derived($joinCodeStore);

  function copyCode() {
    if (code) {
      navigator.clipboard.writeText(code);
    }
  }
</script>

<div class="max-w-md w-full bg-slate-800 border-2 border-slate-700 p-12 rounded-3xl shadow-2xl text-center animate-fade-in">
  <div class="mb-8">
    <div class="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <h2 class="text-3xl font-black text-white uppercase tracking-tight mb-2">Establishing Link</h2>
    <p class="text-slate-400 font-medium">Waiting for an opponent to join the frequency.</p>
  </div>

  <div class="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 mb-8">
    <span class="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Your Join Code</span>
    <div class="flex items-center justify-between gap-4">
      <span class="text-4xl font-mono font-black text-blue-400 tracking-widest uppercase">{code || '----'}</span>
      <button 
        class="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors active:scale-95"
        onclick={copyCode}
        title="Copy Code"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
    </div>
  </div>

  <p class="text-sm text-slate-500 font-medium">
    Share this code with a friend to start the engagement.
  </p>
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
</style>
