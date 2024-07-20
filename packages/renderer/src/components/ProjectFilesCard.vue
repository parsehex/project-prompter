<script lang="ts" setup>
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useProjectStore} from '@/stores/project';

const project = useProjectStore();
</script>

<template>
  <Card class="">
    <CardHeader>
      <CardTitle>Project Files</CardTitle>
    </CardHeader>
    <CardContent>
      <ul>
        <li
          v-for="file in project.projectFiles"
          :key="file"
        >
          {{ file }}
        </li>
      </ul>
    </CardContent>
  </Card>
</template>

<style></style>
