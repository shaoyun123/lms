<template>
  <div
    class="lzd-message-item card-product"
    :style="lazadaOrderData.fromAccountType === 1 ? '' : style"
  >
    <div
      class="card-product message-card"
      @click="goHtml(JSON.parse(lazadaOrderData.content).actionUrl)"
    >
      <div class="card-header">
        Order #{{ JSON.parse(lazadaOrderData.content).orderId }}
      </div>
      <div class="card-content">
        <div
          class="background-default lzd-pro-img"
          :style="{
            'background-image':
              'url(' + JSON.parse(lazadaOrderData.content).iconUrl + ')'
          }"
        ></div>
        <div class="lzd-pro-desc">
          <div class="lzd-pro-title text-two-lines">
            {{ JSON.parse(lazadaOrderData.content).productName }}
          </div>
          <div class="lzd-pro-title text-two-lines">
            {{ JSON.parse(lazadaOrderData.content).content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      lazadaOrderData: {
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
