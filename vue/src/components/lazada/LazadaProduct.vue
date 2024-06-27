<template>
  <div
    class="lzd-message-item card-product"
    :style="lazadaProductData.fromAccountType === 1 ? '' : style"
  >
    <div
      class="card-product message-card"
      @click="goHtml(JSON.parse(lazadaProductData.content).actionUrl)"
    >
      <div class="card-header">Product Information</div>
      <div class="card-content">
        <div
          class="background-default lzd-pro-img"
          :style="{
            'background-image':
              'url(' + JSON.parse(lazadaProductData.content).iconUrl + ')'
          }"
        ></div>
        <div class="lzd-pro-desc">
          <div class="lzd-pro-title text-two-lines">
            {{ JSON.parse(lazadaProductData.content).title }}
          </div>
          <div class="lzd-pro-price text-overflow" title="">
            {{ JSON.parse(lazadaProductData.content).price }}
          </div>
          <div class="lzd-pro-old-price-content">
            <span class="lzd-pro-old-price text-overflow" title="">
              {{ JSON.parse(lazadaProductData.content).oldPrice }}</span
            ><span class="lzd-pro-discount">{{
              JSON.parse(lazadaProductData.content).discount
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      lazadaProductData: {
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
    methods: {
      goHtml(url) {
        window.open(url, '_blank');
      }
    }
  };
</script>
<style scoped lang="scss">
  @import url('@/components/lazada/css/common.css');
</style>
