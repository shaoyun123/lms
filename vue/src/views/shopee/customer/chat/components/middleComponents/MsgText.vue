<template>
  <div :class="getClass()">
    <div class="message-text-box">
      <div class="lzd-message-text">
        <span class="emoji-face has-text">{{
          textData.text || textData.orderSn || textData.itemId
        }}</span>
        <span v-if="textData.translationText" class="emoji-face has-text">
          <hr />
          {{ textData.translationText }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    textData: {
      type: Object,
      default: () => ({})
    }
  });
  const getClass = () => {
    let classArr = ['lzd-message-item', 'card-text'];
    if (props.textData.buyerOrSeller !== 2) {
      classArr.push('msg_right');
    }
    return classArr;
  };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .msg_right {
    border: 0.5px solid rgb(165, 203, 233);
    background-color: rgb(201, 231, 255);
  }
</style>
