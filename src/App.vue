<template>
  <header class="main"/>

  <main class="layout">
    <router-view/>
  </main>

  <div id="modals" style="z-index: 1000"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style lang="scss">
@import "styles/main";
</style>
