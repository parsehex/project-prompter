type SettingsValue = string | number | boolean | null;

interface AppSettings {
	projectsDirectory: string;
	activeProject: string;

	[key: string]: SettingsValue;
}

interface ProjectsSettings {
	projects: {
		[project: string]: {
			includedPatterns: string[];
		};
	};
}
