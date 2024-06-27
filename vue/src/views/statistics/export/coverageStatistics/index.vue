<template>
  <div></div>
</template>

<script setup name="statisticsexportcoverageStatistics">
  import iframeHook from '@/hooks/iframes';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  iframeHook(route.meta.iframeId.toLocaleUpperCase());
</script>

<style lang="scss" scoped></style>
