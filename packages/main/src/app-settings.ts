import path from 'path';
import SettingsStore from './SettingsStore';
import {app} from 'electron';

const settingsPath = path.join(app.getPath('userData'), 'settings.json');
console.log('Settings path:', settingsPath);
export const settings = new SettingsStore<AppSettings>(settingsPath);
