import { Howl } from 'howler';
import { settingsStore } from '../stores/settingsStore';
import { get } from 'svelte/store';

class AudioManager {
	private sounds: Record<string, Howl> = {};

	constructor() {
		this.sounds = {
			thud: new Howl({ src: ['/audio/thud.mp3'] }),
			cannon: new Howl({ src: ['/audio/cannon.mp3'] }),
			explosion: new Howl({ src: ['/audio/explosion.mp3'] }),
			splash: new Howl({ src: ['/audio/splash.mp3'] }),
			victory: new Howl({ src: ['/audio/victory.mp3'] }),
			defeat: new Howl({ src: ['/audio/defeat.mp3'] }),
			engage: new Howl({ src: ['/audio/cannon.mp3'] })
		};
	}

	play(name: keyof typeof this.sounds) {
		const { soundEnabled } = get(settingsStore);
		if (soundEnabled && this.sounds[name]) {
			this.sounds[name].play();
		}
	}
}

export const audioManager = new AudioManager();
