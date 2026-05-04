# Advanced Usage & AI Strategies

This guide delves into the technical details of the AI difficulty levels and advanced gameplay strategies.

## 1. AI Difficulty Levels

The single-player mode features an AI that scales in complexity.

### Easy
- **Logic**: Pure random targeting.
- **Behavior**: The AI does not remember hits or attempt to sink ships it has found. It simply picks an un-attacked cell at random.

### Medium
- **Logic**: "Hunt & Target" mode.
- **Behavior**: 
  - **Hunt Mode**: Randomly targets cells until a hit is registered.
  - **Target Mode**: Once a hit is found, it targets the immediate neighbors (Up, Down, Left, Right). If another hit is found, it continues along that axis until the ship is sunk.

### Hard
- **Logic**: Probability Density Map (PDM).
- **Behavior**: 
  - The AI calculates a "probability score" for every cell on the board based on how many ways a ship could fit in that cell given previous misses.
  - It prioritizes attacking cells with the highest density.
  - It uses a "parity" strategy (attacking every other cell) to find ships more efficiently.

### Expert
- **Logic**: Predictive PDM + Ship Tracking.
- **Behavior**: 
  - Combines Hard logic with advanced heuristics.
  - It tracks which ships are still alive and optimizes its search patterns for the specific lengths remaining (e.g., if only the Destroyer is left, it targets gaps of size 2).

---

## 2. Pro Strategies

### The "Checkerboard" Search
To minimize the number of turns needed to find any ship, attack in a checkerboard pattern. Since the smallest ship (Destroyer) is 2 units long, it *must* occupy at least one "color" of the checkerboard.

### Edge Buffering
Avoid placing all your ships against the edges. Many players search the edges first. Placing ships in the center-right or center-left can often disrupt common search patterns.

### Ship Touching
While ships cannot overlap, they *can* touch. Placing a small ship (like a Submarine) directly adjacent to a large one (like a Carrier) can sometimes confuse opponents into thinking they are still attacking the larger ship.
