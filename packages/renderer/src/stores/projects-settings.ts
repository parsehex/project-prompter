import {api} from '#preload';
import {defineStore} from 'pinia';
import {ref, watch} from 'vue';
import {useAppSettingsStore} from './app-settings';

export const useProjectsSettingsStore = defineStore('projectsSettings', () => {
	const appSettings = useAppSettingsStore();

	const projects = ref<string[]>([]);

	const refreshProjects = async (projectsDirectory: string) => {
		if (!projectsDirectory) {
			projects.value = [];
			return;
		}

		try {
			const projectsList = await api.listProjects();
			projects.value = projectsList;
		} catch (error) {
			console.error(error);
		}
	};

	watch(() => appSettings.projectsDirectory, refreshProjects);

	(async () => {
		await refreshProjects(appSettings.projectsDirectory);
	})();

	return {
		projects,
	};
});
