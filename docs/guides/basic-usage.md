# Basic Usage & Game Rules

Welcome to Battleship! This guide covers the rules of the classic pen-and-paper strategy game and how they are implemented in this web version.

## 1. Game Objective

The goal of Battleship is to locate and sink all five of your opponent's ships before they sink yours. It is a game of deduction, logic, and spatial awareness.

## 2. Setting Up Your Fleet

Each player has two 10x10 grids:
- **My Board**: Where you place your own ships.
- **Opponent's Board**: Where you track your attacks against the enemy.

The grids use a coordinate system with letters **A-J** on the horizontal axis and numbers **1-10** on the vertical axis (e.g., "D7").

### The Fleet
You have five ships of varying lengths:
| Ship | Length |
| :--- | :--- |
| **Carrier** | 5 squares |
| **Battleship** | 4 squares |
| **Cruiser** | 3 squares |
| **Submarine** | 3 squares |
| **Destroyer** | 2 squares |

### Placement Rules
- Ships must be placed **horizontally** or **vertically**. No diagonal placements.
- Ships must occupy consecutive squares without gaps or bends.
- Ships **cannot overlap**, though they may touch edges.
- Once the game starts, your ship positions remain hidden from your opponent.

## 3. How to Play

### Taking Turns
Players alternate turns firing a single shot at a coordinate on the opponent's grid.

### Firing a Shot
When you call out a coordinate (e.g., "F2"):
- **Hit**: If the coordinate contains part of an enemy ship, it is a "Hit". An **X** is marked on the grid.
- **Miss**: If the coordinate is empty, it is a "Miss". An **O** is marked on the grid.

### Sinking a Ship
A ship is considered "Sunk" when every square it occupies has been hit. In this digital version, the game will automatically announce when a ship has been sunk.

## 4. Winning the Game

The first player to sink all five of their opponent's ships (17 total hits) is declared the winner.

## 5. Tips for Success
- **Avoid Patterns**: Don't place your ships in predictable rows or corners.
- **Targeting Strategy**: When you get a hit, target the surrounding squares (Up, Down, Left, Right) to find the rest of the ship.
- **Deduction**: Use the gaps between your misses to narrow down where a ship might be large enough to fit.
