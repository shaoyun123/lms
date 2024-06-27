<template>
  <div></div>
</template>

<script setup name="publishsJoomonlineproduct">
  import iframeHook from '@/hooks/iframes';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  console.log(route);
  iframeHook(route.meta.iframeId.toLocaleUpperCase());
</script>

<style lang="scss" scoped></style>
