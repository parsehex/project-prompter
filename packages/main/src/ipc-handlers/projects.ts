import {ipcMain, dialog} from 'electron';
import fs from 'fs/promises';
import path from 'path';
import {settings} from '/@/app-settings';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

async function getProjects() {
  const projectsDirectory = await settings.get('projectsDirectory', '');
  if (!projectsDirectory) {
    return [];
  }

  try {
    const files = await fs.readdir(projectsDirectory);
    return files;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getProjectFiles(project: string): Promise<FileNode[]> {
  const projectsDirectory = await settings.get('projectsDirectory', '');
  if (!projectsDirectory) {
    return [];
  }

  const projectPath = path.join(projectsDirectory, project);

  async function buildTree(dirPath: string): Promise<FileNode[]> {
    const entries = await fs.readdir(dirPath, {withFileTypes: true});
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      // if (entry.name.startsWith('.')) continue; // Skip hidden files/directories

      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        nodes.push({
          name: entry.name,
          type: 'directory',
          children: await buildTree(fullPath),
        });
      } else {
        nodes.push({
          name: entry.name,
          type: 'file',
        });
      }
    }

    return nodes;
  }

  try {
    return await buildTree(projectPath);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function setupProjectsIPC() {
  ipcMain.handle('select-project', async (_, project) => {
    const projects = await getProjects();
    if (!projects.includes(project)) {
      return false;
    }

    await settings.set('activeProject', project);
    return true;
  });

  ipcMain.handle('pick-projects-directory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (result.canceled) {
      return false;
    }

    await settings.set('projectsDirectory', result.filePaths[0]);
  });

  ipcMain.handle('list-projects', async () => {
    return await getProjects();
  });

  ipcMain.handle('list-project-files', async () => {
    const project = await settings.get('activeProject', '');
    if (!project) {
      return [];
    }

    return await getProjectFiles(project);
  });
}
