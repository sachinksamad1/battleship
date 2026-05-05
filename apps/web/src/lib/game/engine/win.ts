import type { ShipState } from '../types';

/**
 * Checks if the game is over by determining if all ships are sunk.
 * @param ships The current state of all ships in a fleet.
 * @returns True if all ships are sunk, false otherwise.
 */
export function isGameOver(ships: ShipState[]): boolean {
  if (ships.length === 0) return false;
  return ships.every((ship) => ship.sunk);
}
