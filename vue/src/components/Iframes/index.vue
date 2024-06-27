<template>
  <div v-show="iframeBoxShow" class="iframe-box">
    <iframe
      v-for="value in iframesStore.iframesArr"
      v-show="value.show"
      :key="value.name"
      :src="value.src + value.params"
      :name="value.name"
      frameborder="0"
      width="100%"
      height="100%"
    />
  </div>
</template>

<script setup>
  import useIframesStore from '@/store/modules/iframes';
  import { computed } from 'vue';

  const iframesStore = useIframesStore();

  let iframesObj = computed(() => iframesStore.iframesObj);

  //如果iframe-box内没有元素或者元素都是隐藏的，那么就隐藏iframe-box
  let iframeBoxShow = computed(() => {
    let show = false;
    for (let key in iframesObj.value) {
      if (iframesObj.value[key].enable && iframesObj.value[key].show) {
        show = true;
        break;
      }
    }
    return show;
  });
</script>

<style lang="scss" scoped>
  .iframe-box {
    width: calc(100vw - 60px);
    z-index: 100;
    height: calc(100vh - var(--v3-tagsview-height));
    overflow-x: visible;
    overflow-y: visible;
  }
</style>
