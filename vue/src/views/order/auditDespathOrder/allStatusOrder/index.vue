<template>
  <div></div>
</template>

<script setup name="orderauditDespathOrderallStatusOrder">
  import iframeHook from '@/hooks/iframes';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  iframeHook(route.meta.iframeId.toLocaleUpperCase());
  setTimeout(() => {
    let iframeContent = document.querySelector(
      'iframe[name=orderauditDespathOrderallStatusOrder]'
    );
    // 获取 iframe 内部的窗口对象
    let iframeWindow = iframeContent.contentWindow;
    iframeWindow.postMessage(route.query, '*');
  }, 3500);
</script>

<style lang="scss" scoped></style>
