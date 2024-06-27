<template>
  <div>
    <div
      class="lzd-message-item card-text"
      :style="lazadaImgData.fromAccountType === 1 ? '' : style"
    >
      <div
        class="background-default card-img"
        style="height: 200px; width: 200px"
        :style="{
          'background-image':
            'url(' + JSON.parse(lazadaImgData.content).imgUrl + ')'
        }"
        @click="scanImgFunc(JSON.parse(lazadaImgData.content).imgUrl)"
      ></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      lazadaImgData: {
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
