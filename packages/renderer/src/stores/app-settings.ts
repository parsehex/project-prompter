import {api, listen} from '#preload';
import {defineStore} from 'pinia';
import {ref} from 'vue';

export const useAppSettingsStore = defineStore('appSettings', () => {
  const projectsDirectory = ref('');
  const activeProject = ref('');

  listen.appSettingsChanged(settings => {
    projectsDirectory.value = settings.projectsDirectory;
    activeProject.value = settings.activeProject;
  });

  async function pickProjectsDirectory() {
    await api.pickProjectsDirectory();
  }
  async function selectProject(project: string) {
    const result = await api.selectProject(project);
    if (result) {
      activeProject.value = project;
    }
  }

  (async () => {
    const settings = await api.getAppSettings();
    projectsDirectory.value = settings.projectsDirectory;
    activeProject.value = settings.activeProject;
  })();

  return {
    projectsDirectory,
    activeProject,
    pickProjectsDirectory,
    selectProject,
  };
});
