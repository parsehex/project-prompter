import {ipcMain, BrowserWindow} from 'electron';
import {settings} from '/@/app-settings';

export async function setupAppSettingsIPC() {
  ipcMain.handle('get-app-settings', async () => {
    return await settings.getAll();
  });

  settings.on('saved', async () => {
    console.log('Settings saved');
    const mainWindow = BrowserWindow.getAllWindows()[0];
    mainWindow.webContents.send('appSettingsChanged', await settings.getAll());
  });
}
