<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useAppSettingsStore} from '@/stores/app-settings';
import {useProjectsSettingsStore} from '@/stores/projects-settings';

const appSettings = useAppSettingsStore();
const {activeProject} = storeToRefs(appSettings);
const projectsSettings = useProjectsSettingsStore();
const {projects} = storeToRefs(projectsSettings);
</script>

<template>
  <Card class="">
    <CardHeader>
      <CardTitle>Projects Directory</CardTitle>
      <CardDescription> The directory where your projects are stored. </CardDescription>
      <div class="flex items-center justify-center gap-4">
        {{ appSettings.projectsDirectory }}
        <Button @click="appSettings.pickProjectsDirectory"> Pick a directory </Button>
      </div>
    </CardHeader>
    <CardContent>
      <ul>
        <li
          v-for="project in projects"
          :key="project"
          :class="{'bg-gray-200': project === activeProject}"
        >
          <a @click="appSettings.selectProject(project)">{{ project }}</a>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>

<style></style>
