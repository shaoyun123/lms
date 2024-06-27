<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </router-view>
    <Iframes />
  </section>
</template>

<script setup>
  import Iframes from '@/components/Iframes/index.vue';
  import { computed } from 'vue';
  import useTagsViewStore from '@/store/modules/tags-view';

  const tagsViewStore = useTagsViewStore();
  const cachedViews = computed(() => tagsViewStore.cachedViews);
</script>

<style lang="scss" scoped>
  .app-main {
    min-height: calc(100vh - var(--v3-tagsview-height));
    padding-top: var(--v3-tagsview-height);
    width: 100%;
    position: relative;
    overflow: hidden;
    background-color: var(--v3-body-bg-color);
    /* 滚动条宽度 */
    &::-webkit-scrollbar {
      width: 8px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #e6e6e6;
    }
  }
</style>
