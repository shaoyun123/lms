<template>
  <div
    class="lzd-message-item card-text"
    :style="lazadaTextData.fromAccountType === 1 ? '' : style"
  >
    <div class="message-text-box">
      <div class="lzd-message-text">
        <span class="emoji-face has-text">{{
          JSON.parse(lazadaTextData.content).txt
        }}</span>
        <span
          v-if="JSON.parse(lazadaTextData.content).translateTxt"
          class="emoji-face has-text"
        >
          <hr />
          {{ JSON.parse(lazadaTextData.content).translateTxt }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      lazadaTextData: {
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
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {}
  };
</script>
<style scoped lang="scss">
  @import url('@/components/lazada/css/common.css');
</style>
