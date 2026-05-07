<script lang="ts">
	import { settingsStore } from '../../stores/settingsStore';

	let {
		x,
		y,
		hit = false,
		occupied = false,
		shipId = '',
		isEnemy = false,
		canAttack = false,
		onclick
	} = $props<{
		x: number;
		y: number;
		hit?: boolean;
		occupied?: boolean;
		shipId?: string;
		isEnemy?: boolean;
		canAttack?: boolean;
		onclick?: () => void;
	}>();

	const shipColors: Record<string, string> = {
		carrier: 'from-slate-500 to-slate-700',
		battleship: 'from-blue-600 to-blue-800',
		cruiser: 'from-emerald-600 to-emerald-800',
		submarine: 'from-amber-600 to-amber-800',
		destroyer: 'from-rose-600 to-rose-800'
	};

	// Extract base ship type from ID (e.g., 'p-carrier' -> 'carrier')
	let shipType = $derived(shipId.split('-').pop() || '');
	let gradient = $derived(shipColors[shipType] || 'from-slate-400 to-slate-600');

	let statusClass = $derived.by(() => {
		if (hit) {
			return occupied ? 'bg-red-500' : 'bg-blue-300';
		}
		if (occupied && !isEnemy) {
			return `bg-gradient-to-br ${gradient}`;
		}
		return 'bg-blue-950/20';
	});

	let hoverClass = $derived(canAttack && !hit ? 'hover:bg-blue-400/40 cursor-pointer' : '');

	// Svelte 5: Stores can be accessed with $ prefix
	let animationsEnabled = $derived($settingsStore.animationsEnabled);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="relative aspect-square w-full border border-blue-900/30 transition-all duration-200 {statusClass} {hoverClass}"
	{onclick}
	aria-label="Cell {String.fromCharCode(65 + x)}{y + 1}"
>
	<!-- Decorative Hull Detail (for friendly ships) -->
	{#if occupied && !isEnemy && !hit}
		<div class="absolute inset-0 flex items-center justify-center opacity-20">
			<div class="h-2/3 w-2/3 rounded-sm border border-white"></div>
		</div>
		<div class="absolute top-0 left-0 h-0.5 w-full bg-white/10"></div>
	{/if}

	{#if hit}
		<div
			class="absolute inset-0 flex items-center justify-center {animationsEnabled
				? 'animate-in zoom-in-50 duration-300'
				: ''}"
		>
			{#if occupied}
				<div class="relative flex h-full w-full items-center justify-center">
					<!-- Explosion effect -->
					{#if animationsEnabled}
						<div
							class="absolute h-4/5 w-4/5 animate-pulse rounded-full bg-orange-500/20 blur-sm"
						></div>
					{/if}
					<span class="text-xl font-black text-white drop-shadow-md">✕</span>
				</div>
			{:else}
				<!-- Splash effect -->
				<div
					class="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] {animationsEnabled
						? 'animate-bounce'
						: ''}"
				></div>
			{/if}
		</div>
	{/if}
</div>

<style>
	div {
		min-width: 30px;
	}
</style>
