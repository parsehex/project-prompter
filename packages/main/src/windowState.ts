import type { BrowserWindow} from 'electron';
import {app} from 'electron';
import * as fs from 'fs';
import * as path from 'path';

const stateFilePath = path.join(app.getPath('userData'), 'window-state.json');

interface WindowState {
  width: number;
  height: number;
  x: number;
  y: number;
  maximized?: boolean;
}

function getWindowState(): WindowState | undefined {
  try {
    const data = fs.readFileSync(stateFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return undefined;
  }
}

function saveWindowState(window: BrowserWindow) {
  if (!window) return;
  const bounds = window.getBounds();
  const state: WindowState = {
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    maximized: window.isMaximized(),
  };
  fs.writeFileSync(stateFilePath, JSON.stringify(state));
}

export {getWindowState, saveWindowState};
