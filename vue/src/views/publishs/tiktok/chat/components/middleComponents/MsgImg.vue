<template>
  <div :class="getClass">
    <el-image
      style="height: auto; width: 200px"
      class="image"
      :src="url"
      loading="lazy"
      :preview-src-list="[url]"
      :initial-index="0"
    />
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  const props = defineProps({
    imgData: {
      type: Object,
      default: () => ({})
    }
  });
  const getClass = () => {
    let classArr = ['lzd-message-item', 'card-text'];
    if (props.imgData.senderRole === 1) {
      classArr.push('msg_right');
    }
    return classArr;
  };
  const url = ref();

  onMounted(() => {
    url.value = props.imgData.imageUrl;
  });

  // const emits = defineEmits(['scanImgFunc']);
  // const scanImgFunc = (url) => {
  //   emits('scanImgFunc', url);
  // };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .msg_right {
    border: 0.5px solid rgb(165, 203, 233);
    background-color: rgb(201, 231, 255);
  }
</style>
