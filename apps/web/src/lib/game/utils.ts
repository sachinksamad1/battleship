/**
 * Generates a random nautical-themed callsign for the player.
 */
export function generateRandomName(): string {
	const ranks = ['Admiral', 'Captain', 'Commander', 'Commodore', 'Lieutenant', 'Ensign'];
	const adjectives = [
		'Brave',
		'Bold',
		'Swift',
		'Iron',
		'Silent',
		'Fierce',
		'Valiant',
		'Mighty',
		'Grim',
		'Noble'
	];
	const nouns = [
		'Kraken',
		'Shark',
		'Wave',
		'Storm',
		'Anchor',
		'Trident',
		'Falcon',
		'Ghost',
		'Reaper',
		'Vanguard'
	];

	const rank = ranks[Math.floor(Math.random() * ranks.length)];
	const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
	const noun = nouns[Math.floor(Math.random() * nouns.length)];

	// Pattern: Rank [Adjective] [Noun] or Rank [Noun]
	return Math.random() > 0.5 ? `${rank} ${adj} ${noun}` : `${rank} ${noun}`;
}
