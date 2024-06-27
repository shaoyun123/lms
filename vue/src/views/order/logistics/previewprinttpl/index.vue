<template>
  <!-- <div v-loading="initLoading" v-html="printHtml"></div> -->
  <div style="overflow: hidden; width: 100%; height: 100vh">
    <iframe
      :srcdoc="printHtml"
      frameborder="0"
      height="100%"
      scrolling="no"
      style="min-width: 100%"
    ></iframe>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  import { getTplInfoApi } from '@/api/order/printtemplate';
  import { getItem } from '@/utils/storage';
  const initLoading = ref(false);
  const printHtml = ref('');

  const route = useRoute();

  onMounted(async () => {
    const { id } = route.query;
    initLoading.value = false;
    // 未保存的预览
    if (id != '999999') {
      try {
        const { data } = await getTplInfoApi(id);
        printHtml.value = data.templateHtml;
      } catch (err) {
        console.log('err :>> ', err);
      }
    } else {
      const bodyHtml = getItem('bodyHtml');
      printHtml.value = bodyHtml;
    }
    initLoading.value = false;
  });
</script>
