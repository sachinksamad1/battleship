<script lang="ts">
	import { joinCodeStore } from '../../socket/client';

	let code = $derived($joinCodeStore);

	function copyCode() {
		if (code) {
			navigator.clipboard.writeText(code);
		}
	}
</script>

<div
	class="animate-fade-in w-full max-w-md rounded-3xl border-2 border-slate-700 bg-slate-800 p-12 text-center shadow-2xl"
>
	<div class="mb-8">
		<div
			class="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600/20"
		>
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
		</div>
		<h2 class="mb-2 text-3xl font-black tracking-tight text-white uppercase">Establishing Link</h2>
		<p class="font-medium text-slate-400">Waiting for an opponent to join the frequency.</p>
	</div>

	<div class="mb-8 rounded-2xl border-2 border-slate-700 bg-slate-900 p-6">
		<span class="mb-3 block text-xs font-bold tracking-widest text-slate-500 uppercase"
			>Your Join Code</span
		>
		<div class="flex items-center justify-between gap-4">
			<span class="font-mono text-4xl font-black tracking-widest text-blue-400 uppercase"
				>{code || '----'}</span
			>
			<button
				class="rounded-xl bg-slate-800 p-3 text-slate-300 transition-colors hover:bg-slate-700 active:scale-95"
				onclick={copyCode}
				title="Copy Code"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
				</svg>
			</button>
		</div>
	</div>

	<p class="text-sm font-medium text-slate-500">
		Share this code with a friend to start the engagement.
	</p>
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
