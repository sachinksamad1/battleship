<script lang="ts">
  import { settingsStore, toggleSound, toggleAnimations } from '../../stores/settingsStore';

  let { show = false, onclose } = $props<{
    show: boolean;
    onclose: () => void;
  }>();

  let settings = $derived($settingsStore);
</script>

{#if show}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
    onclick={onclose}
  >
    <div 
      class="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-black text-white uppercase tracking-tight">System Settings</h2>
        <button 
          class="p-2 text-slate-400 hover:text-white transition-colors"
          onclick={onclose}
          aria-label="Close Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-6">
        <!-- Sound Toggle -->
        <div class="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div>
            <h3 class="font-bold text-white">Audio Effects</h3>
            <p class="text-xs text-slate-400 mt-0.5">Toggle sound effects and themes</p>
          </div>
          <button 
            class="w-14 h-8 rounded-full transition-colors relative {settings.soundEnabled ? 'bg-blue-600' : 'bg-slate-700'}"
            onclick={toggleSound}
            aria-label="Toggle Sound"
          >
            <div class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform {settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}"></div>
          </button>
        </div>

        <!-- Animations Toggle -->
        <div class="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div>
            <h3 class="font-bold text-white">Visual Effects</h3>
            <p class="text-xs text-slate-400 mt-0.5">Explosions, splashes, and transitions</p>
          </div>
          <button 
            class="w-14 h-8 rounded-full transition-colors relative {settings.animationsEnabled ? 'bg-blue-600' : 'bg-slate-700'}"
            onclick={toggleAnimations}
            aria-label="Toggle Animations"
          >
            <div class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform {settings.animationsEnabled ? 'translate-x-6' : 'translate-x-0'}"></div>
          </button>
        </div>
      </div>

      <div class="mt-10">
        <button 
          class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          onclick={onclose}
        >
          Return to Combat
        </button>
      </div>
    </div>
  </div>
{/if}
