<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import SettingsPanel from '$lib/components/ui/SettingsPanel.svelte';

	let { children } = $props();
	let showSettings = $state(false);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
	<!-- Global Header -->
	<header
		class="fixed top-0 left-0 z-40 flex h-20 w-full items-center justify-between border-b border-white/5 bg-slate-950/80 px-8 backdrop-blur-md"
	>
		<div class="flex items-center gap-3">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/40"
			>
				<span class="text-xl font-black text-white">B</span>
			</div>
			<div>
				<h1 class="text-xl leading-none font-black tracking-tighter text-white uppercase">
					Battleship
				</h1>
				<span class="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase"
					>Tactical Command</span
				>
			</div>
		</div>

		<div class="flex items-center gap-4">
			<button
				class="rounded-xl p-3 text-slate-400 transition-all hover:bg-white/5 hover:text-white"
				onclick={() => (showSettings = true)}
				aria-label="Settings"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			</button>
		</div>
	</header>

	<main class="pt-20">
		{@render children()}
	</main>

	<SettingsPanel show={showSettings} onclose={() => (showSettings = false)} />
</div>
