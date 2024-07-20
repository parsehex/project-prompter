<script lang="ts" setup>
import '../assets/style.css';

import ProjectsListCard from './components/ProjectsListCard.vue';
import ProjectFilesCard from './components/ProjectFilesCard.vue';
</script>

<template>
  <div>
    <ProjectsListCard />
    <ProjectFilesCard />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 700px;
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
