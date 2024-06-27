<script setup name="orderrulesblackbuyer">
  import iframeHook from '@/hooks/iframes';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  iframeHook(route.meta.iframeId.toLocaleUpperCase());
</script>

<template>
  <div />
</template>

<style lang="scss" scoped></style>
