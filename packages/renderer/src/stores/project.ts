import {api} from '#preload';
import {defineStore} from 'pinia';
import {ref, watch} from 'vue';
import {useAppSettingsStore} from './app-settings';

export const useProjectStore = defineStore('project', () => {
	const appSettings = useAppSettingsStore();

	const projectFiles = ref<string[]>([]);

	watch(
		() => [appSettings.activeProject, appSettings.projectsDirectory],
		async ([activeProject, projectsDirectory]) => {
			if (!projectsDirectory || !activeProject) {
				projectFiles.value = [];
				return;
			}

			try {
				const files = await api.listProjectFiles(activeProject);
				projectFiles.value = files;
			} catch (error) {
				console.error(error);
			}
		},
	);

	return {
		projectFiles,
	};
});
