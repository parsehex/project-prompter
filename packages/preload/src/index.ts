import {ipcRenderer} from 'electron';

interface IPCAPI {
	openDirectoryPicker: () => Promise<string | undefined>;
	selectProject: (project: string) => Promise<boolean>;
	addProject: (path: string) => Promise<boolean>;
	listProjectFiles: (project: string) => Promise<string[]>;
	pickProjectsDirectory: () => Promise<string | undefined>;
	listProjects: () => Promise<string[]>;
	getAppSettings: () => Promise<AppSettings>;
}

export const api: IPCAPI = {
	openDirectoryPicker: () => ipcRenderer.invoke('open-directory-picker'),
	selectProject: project => ipcRenderer.invoke('select-project', project),
	addProject: path => ipcRenderer.invoke('add-project', path),
	listProjectFiles: project => ipcRenderer.invoke('list-project-files', project),
	pickProjectsDirectory: () => ipcRenderer.invoke('pick-projects-directory'),
	listProjects: () => ipcRenderer.invoke('list-projects'),
	getAppSettings: () => ipcRenderer.invoke('get-app-settings'),
};

export const appSettings = {} as AppSettings;
export const projectsSettings = {} as ProjectsSettings;

ipcRenderer.on('appSettingsChanged', (_, settings) => {
	Object.assign(appSettings, settings);
});
ipcRenderer.on('projectsSettingsChanged', (_, settings) => {
	Object.assign(projectsSettings, settings);
});

export const listen = {
	appSettingsChanged: (listener: (settings: AppSettings) => void) => {
		ipcRenderer.on('appSettingsChanged', (_, settings) => listener(settings));
	},
	projectsSettingsChanged: (listener: (settings: ProjectsSettings) => void) => {
		ipcRenderer.on('projectsSettingsChanged', (_, settings) => listener(settings));
	},
};

// eventual plan is to break this into like `export const appSettings, projectsSettings, projects, etc`
// and use like `import * as api from '#preload'` in the stores
