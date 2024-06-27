<template>
  <div :class="getClass">
    <div
      v-if="curSrc"
      class="background-default card-img message-emoji msg_size"
    >
      <el-image :src="curSrc" loading="lazy" />
    </div>
    <div v-else>[表情包]</div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  const props = defineProps({
    emojiData: {
      type: Object,
      default: () => ({})
    },
    storeInfo: {
      type: Object,
      default: () => ({})
    }
  });
  const getClass = () => {
    let classArr = ['lzd-message-item', 'card-emoji'];
    if (props.emojiData.buyerOrSeller !== 2) {
      classArr.push('msg_right');
    }
    return classArr;
  };
  const curSrc = ref('');
  onMounted(() => {
    const stickerPrefixUrl = 'https://deo.shopeemobile.com/shopee';
    if (props.emojiData.stickerId && props.emojiData.stickerPackageId) {
      curSrc.value = `${stickerPrefixUrl}/shopee-sticker-live-${props.storeInfo.salesSite.toLowerCase()}/packs/${
        props.emojiData.stickerPackageId
      }/${props.emojiData.stickerId}@1x.png`;
    } else {
      curSrc.value = '';
    }
  });
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .msg_right {
    border: 0.5px solid rgb(165, 203, 233);
    background-color: rgb(201, 231, 255);
  }
  .msg_size {
    height: 160px;
    width: 160px;
  }
</style>
