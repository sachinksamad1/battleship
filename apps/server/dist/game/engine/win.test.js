import { describe, it, expect } from 'vitest';
import { isGameOver } from './win.js';
describe('Win Condition Engine', () => {
    const mockShip = (sunk) => ({
        id: '1',
        definitionId: 'destroyer',
        coordinates: [],
        hits: 0,
        sunk,
    });
    it('should return false if at least one ship is not sunk', () => {
        const ships = [mockShip(true), mockShip(false)];
        expect(isGameOver(ships)).toBe(false);
    });
    it('should return true when all ships in the fleet are sunk', () => {
        const ships = [mockShip(true), mockShip(true)];
        expect(isGameOver(ships)).toBe(true);
    });
    it('should return false for an empty fleet', () => {
        expect(isGameOver([])).toBe(false);
    });
});
