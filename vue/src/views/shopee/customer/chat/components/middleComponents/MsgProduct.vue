<template>
  <div :class="getClass">
    <div
      class="card-product message-card"
      @click="goHtml(shopeeChatMsgItemDto.itemIdSrc)"
    >
      <div class="card-header">Product Information</div>
      <div class="card-content">
        <div class="background-default lzd-pro-img">
          <el-image :src="shopeeChatMsgItemDto.imgs" loading="lazy" />
        </div>
        <div class="lzd-pro-desc">
          <div class="lzd-pro-title text-two-lines">
            {{ shopeeChatMsgItemDto.title }}
          </div>
          <div class="lzd-pro-price text-overflow product-price">
            {{ shopeeChatMsgItemDto.showCurrPrice }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    productData: {
      type: Object,
      default: () => ({})
    }
  });
  const shopeeChatMsgItemDto = computed(
    () => props.productData.shopeeChatMsgItemDto
  );
  const getClass = () => {
    let classArr = ['lzd-message-item', 'card-text'];
    if (props.shopeeChatMsgOrderDto.buyerOrSeller !== 2) {
      classArr.push('msg_right');
    }
    return classArr;
  };
  const goHtml = (url) => {
    window.open(url, '_blank');
  };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .msg_right {
    border: 0.5px solid rgb(165, 203, 233);
    background-color: rgb(201, 231, 255);
  }
</style>
