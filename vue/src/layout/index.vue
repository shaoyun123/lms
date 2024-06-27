<template>
  <div class="app-wrapper">
    <Sidebar class="sidebar-wrapper" />
    <div class="main-wrapper hasTagsView">
      <div class="fixed-header">
        <TagsView />
      </div>
      <AppMain />
    </div>
  </div>
</template>

<script setup>
  import { AppMain, Sidebar, TagsView } from './components';
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins.scss';

  .app-wrapper {
    @include clearfix;
    position: relative;
    width: 100%;
  }

  .main-wrapper {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: var(--v3-sidebar-hide-width);
    position: relative;
  }

  .sidebar-wrapper {
    width: var(--v3-sidebar-hide-width) !important;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: #20222a;
    z-index: 20;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 20231023;
    width: calc(100% - var(--v3-sidebar-hide-width));
    transition: width 0.28s;
  }
  .withoutAnimation {
    .main-wrapper,
    .sidebar-wrapper {
      transition: none;
    }
  }
</style>
