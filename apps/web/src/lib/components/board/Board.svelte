<script lang="ts">
	import type { Board } from '../../game/types';
	import Cell from './Cell.svelte';

	let {
		board,
		isEnemy = false,
		canAttack = false,
		onattack
	} = $props<{
		board: Board;
		isEnemy?: boolean;
		canAttack?: boolean;
		onattack?: (coord: { x: number; y: number }) => void;
	}>();

	function handleCellClick(x: number, y: number) {
		if (canAttack && onattack) {
			onattack({ x, y });
		}
	}
</script>

<div
	class="grid grid-cols-10 gap-0 overflow-hidden rounded-lg border-2 border-blue-900 bg-blue-900 shadow-xl"
>
	{#each board as row, y (y)}
		{#each row as cell, x (x)}
			<Cell
				{x}
				{y}
				hit={cell.hit}
				occupied={cell.occupied}
				shipId={cell.shipId}
				{isEnemy}
				{canAttack}
				onclick={() => handleCellClick(x, y)}
			/>
		{/each}
	{/each}
</div>

<style>
	div {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}
</style>
