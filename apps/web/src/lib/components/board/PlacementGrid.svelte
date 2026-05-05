<script lang="ts">
  import { BOARD_SIZE } from '../../game/types';
  import { placementStore, addPlacedShip, removePlacedShip } from '../../stores/placementStore';
  import { validatePlacement } from '../../game/engine/placement';
  import { createBoard } from '../../game/engine/board';

  let hoveredCoord = $state<{ x: number, y: number } | null>(null);
  
  let currentBoard = $derived.by(() => {
    let board = createBoard();
    $placementStore.placedShips.forEach(ps => {
      const { x, y } = ps.coord;
      for (let i = 0; i < ps.definition.length; i++) {
        const cx = ps.orientation === 'H' ? x + i : x;
        const cy = ps.orientation === 'V' ? y + i : y;
        if (board[cy]?.[cx]) {
          board[cy][cx].occupied = true;
          board[cy][cx].shipId = ps.definition.id;
        }
      }
    });
    return board;
  });

  let isValidPlacement = $derived.by(() => {
    if (!hoveredCoord || !$placementStore.selectedShip) return false;
    return validatePlacement(
      currentBoard, 
      $placementStore.selectedShip, 
      hoveredCoord, 
      $placementStore.currentOrientation
    );
  });

  function handleCellClick(x: number, y: number) {
    if (!$placementStore.selectedShip) {
      // If clicking an occupied cell, maybe remove it?
      const shipAt = currentBoard[y][x].shipId;
      if (shipAt) removePlacedShip(shipAt);
      return;
    }

    if (isValidPlacement && hoveredCoord) {
      addPlacedShip({
        definition: $placementStore.selectedShip,
        coord: hoveredCoord,
        orientation: $placementStore.currentOrientation
      });
    }
  }

  function onMouseEnter(x: number, y: number) {
    hoveredCoord = { x, y };
  }

  function onMouseLeave() {
    hoveredCoord = null;
  }
</script>

<div class="grid grid-cols-10 gap-0 border-2 border-blue-900 bg-blue-900 shadow-2xl overflow-hidden rounded-xl w-full max-w-[500px]">
  {#each Array(BOARD_SIZE) as _, y}
    {#each Array(BOARD_SIZE) as _, x}
      {@const cell = currentBoard[y][x]}
      {@const isPreview = $placementStore.selectedShip && hoveredCoord && (
        $placementStore.currentOrientation === 'H' 
          ? (y === hoveredCoord.y && x >= hoveredCoord.x && x < hoveredCoord.x + $placementStore.selectedShip.length)
          : (x === hoveredCoord.x && y >= hoveredCoord.y && y < hoveredCoord.y + $placementStore.selectedShip.length)
      )}
      
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div 
        class="aspect-square border border-blue-800/30 transition-all duration-150
               {cell.occupied ? 'bg-slate-600' : 'bg-blue-950/40'}
               {isPreview ? (isValidPlacement ? 'bg-green-500/60' : 'bg-red-500/60') : ''}
               hover:bg-blue-800/20 cursor-crosshair"
        onclick={() => handleCellClick(x, y)}
        onmouseenter={() => onMouseEnter(x, y)}
        onmouseleave={onMouseLeave}
      >
        {#if cell.occupied}
          <div class="w-full h-full bg-slate-500/20 shadow-inner border border-white/10"></div>
        {/if}
      </div>
    {/each}
  {/each}
</div>
