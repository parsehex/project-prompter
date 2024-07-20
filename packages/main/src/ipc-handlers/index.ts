import {setupProjectsIPC} from './projects';
import {setupAppSettingsIPC} from './app-settings';

export async function setupIPC() {
  setupAppSettingsIPC();
  setupProjectsIPC();
}
