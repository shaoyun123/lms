<template>
  <div
    class="lzd-message-item card-voucher"
    :style="lazadaVoucherData.fromAccountType === 1 ? '' : style"
  >
    <div class="card-voucher message-card">
      <div class="row top">
        <div class="voucher-type">
          <div
            class="background-default voucher-img"
            :style="{
              'background-image':
                'url(' + JSON.parse(lazadaVoucherData.content).iconUrl + ')'
            }"
          ></div>
          <span class="type-name">{{
            JSON.parse(JSON.parse(lazadaVoucherData.content).voucherType).en
          }}</span>
        </div>
        <div class="title text-two-lines">
          {{ JSON.parse(lazadaVoucherData.content).desc }}
        </div>
        <div class="promotion">
          <div class="discount">
            <span class="amount"
              >{{ JSON.parse(lazadaVoucherData.content).discount }}
              {{ JSON.parse(lazadaVoucherData.content).currency }}</span
            ><span class="unit"></span>
          </div>
          <div class="btn">
            {{ JSON.parse(lazadaVoucherData.content).cardType }}
          </div>
        </div>
      </div>
      <div class="row bottom">
        <div class="period">
          {{ JSON.parse(lazadaVoucherData.content).period }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      lazadaVoucherData: {
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
