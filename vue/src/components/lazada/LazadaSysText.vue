<template>
  <div class="message-row row-card-system">
    <div class="avatar-holder"></div>
    <div
      class="message-contain"
      style="text-align: center; width: -webkit-fill-available; color: #aaa"
    >
      <div class="lzd-message-item card-system">
        <div class="lzd-system-text">
          <span data-spm-anchor-id="a1zawi.15103027.0.i6.45844edfmxLWfi">{{
            JSON.parse(lazadaSysTextData.content).txt
          }}</span>
        </div>
      </div>
      <div class="message-read-type"></div>
    </div>
    <div class="avatar-holder"></div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  export default defineComponent({
    props: {
      lazadaSysTextData: {
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
  });
</script>
<style scoped lang="scss">
  @import url('@/components/lazada/css/common.css');
</style>
