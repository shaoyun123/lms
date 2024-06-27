<template>
  <div
    class="lzd-message-item card-emoji"
    :style="lazadaEmojiData.fromAccountType === 1 ? '' : style"
  >
    <div
      class="background-default card-img message-emoji"
      :title="JSON.parse(lazadaEmojiData.content).txt"
      style="height: 160px; width: 160px"
      :style="{
        'background-image':
          'url(' + JSON.parse(lazadaEmojiData.content).imgUrl + ')'
      }"
    ></div>
  </div>
</template>

<script>
  export default {
    props: {
      lazadaEmojiData: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        style: {
          border: '0.5px solid rgb(165, 203, 233)',
          'background-color': 'rgb(201, 231, 255)'
        }
      };
    }
  };
</script>
<style scoped lang="scss">
  @import url('@/components/lazada/css/common.css');
</style>
