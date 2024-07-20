import fs from 'fs/promises';
import {watch} from 'fs';
import {EventEmitter} from 'events';

type SettingsSchema = Record<string, SettingsValue>;

class SettingsStore<T extends SettingsSchema> extends EventEmitter {
	private settingsPath: string;
	private settings: T;
	private isLoaded: boolean = false;

	constructor(settingsFilePath: string) {
		super();
		this.settingsPath = settingsFilePath;
		this.settings = {} as T;
		this.loadSettings();
		this.watchSettings();
	}

	private async loadSettings(): Promise<void> {
		try {
			const data = await fs.readFile(this.settingsPath, 'utf-8');
			this.settings = JSON.parse(data) as T;
			this.isLoaded = true;
			this.emit('loaded', this.settings);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
				console.error('Error loading settings:', error);
			}
			this.settings = {} as T;
			this.isLoaded = true;
			this.emit('loaded', this.settings);
		}
	}

	private watchSettings(): void {
		watch(this.settingsPath, eventType => {
			if (eventType === 'change') {
				this.loadSettings();
			}
		});
	}

	private async ensureLoaded(): Promise<void> {
		if (!this.isLoaded) {
			await new Promise<void>(resolve => {
				this.once('loaded', () => resolve());
			});
		}
	}

	async get<K extends keyof T>(key: K, defaultValue: T[K]): Promise<T[K]> {
		await this.ensureLoaded();
		return key in this.settings ? this.settings[key] : defaultValue;
	}

	async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
		await this.ensureLoaded();
		this.settings[key] = value;
		await this.saveSettings();
	}

	async delete<K extends keyof T>(key: K): Promise<void> {
		await this.ensureLoaded();
		delete this.settings[key];
		await this.saveSettings();
	}

	async clear(): Promise<void> {
		this.settings = {} as T;
		await this.saveSettings();
	}

	async getAll(): Promise<T> {
		await this.ensureLoaded();
		return {...this.settings};
	}

	private async saveSettings(): Promise<void> {
		try {
			await fs.writeFile(this.settingsPath, JSON.stringify(this.settings, null, 2));
			this.emit('saved', this.settings);
		} catch (error) {
			console.error('Error saving settings:', error);
			this.emit('error', error);
		}
	}
}

export default SettingsStore;
