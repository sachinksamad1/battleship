import { BOARD_SIZE } from '../types.js';
/**
 * Creates a new empty board of the given size.
 * @param size The size of the board (width and height).
 * @returns A new Board initialized with empty cells.
 */
export function createBoard(size = BOARD_SIZE) {
    const board = [];
    for (let y = 0; y < size; y++) {
        const row = [];
        for (let x = 0; x < size; x++) {
            row.push({
                occupied: false,
                hit: false
            });
        }
        board.push(row);
    }
    return board;
}
/**
 * Gets a cell from the board at the specified coordinate.
 * @param board The board to search.
 * @param coord The coordinate to look up.
 * @returns The Cell at the coordinate, or null if out of bounds.
 */
export function getCell(board, coord) {
    const { x, y } = coord;
    if (y < 0 || y >= board.length || x < 0 || x >= board[y].length) {
        return null;
    }
    return board[y][x];
}
