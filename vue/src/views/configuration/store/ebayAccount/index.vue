<template>
  <div></div>
</template>

<script setup name="configurationstoreebayAccount">
  import iframeHook from '@/hooks/iframes';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  iframeHook(route.meta.iframeId.toLocaleUpperCase());
  setTimeout(() => {
    //获取wish店铺的iframe对象
    const iframe = document.querySelector(
      `iframe[name=${route.meta.iframeId}]`
    );
    const iframeWindow = iframe.contentWindow;
    /**
     * 获取iframe的document对象iframeWindow.document,但是这个对象会报错,因为iframe的document对象是跨域的
     * 所以需要换个方式,在iframe中监听message事件,然后在这里发送数据,iframe中接收数据
     * iframe接收到数据后,再操作iframe的document对象,就不会报错了
     */
    iframeWindow.postMessage(route.query, '*');
  }, 3500);
</script>

<style lang="scss" scoped></style>
