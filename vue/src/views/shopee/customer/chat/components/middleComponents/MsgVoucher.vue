<template>
  <div :class="getClass()">
    <div class="card-voucher message-card">
      <div class="row top">
        <div class="voucher-type">
          <div class="background-default voucher-img">
            <el-image
              :src="couponData.shopeeChatMsgCouponDto.iconUrl"
              loading="lazy"
            />
          </div>
          <span class="type-name">{{
            couponData.shopeeChatMsgCouponDto.voucherType.en
          }}</span>
        </div>
        <div class="title text-two-lines">
          {{ couponData.shopeeChatMsgCouponDto.desc }}
        </div>
        <div class="promotion">
          <div class="discount">
            <span class="amount"
              >{{ couponData.shopeeChatMsgCouponDto.discount }}
              {{ couponData.shopeeChatMsgCouponDto.currency }}</span
            ><span class="unit"></span>
          </div>
          <div class="btn">
            {{ couponData.shopeeChatMsgCouponDto.cardType }}
          </div>
        </div>
      </div>
      <div class="row bottom">
        <div class="period">{{ couponData.shopeeChatMsgCouponDto.period }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {} from 'vue';
  const props = defineProps({
    couponData: {
      type: Object,
      default: () => ({})
    }
  });
  const getClass = () => {
    let classArr = ['lzd-message-item', 'card-text'];
    if (props.couponData.buyerOrSeller !== 2) {
      classArr.push('msg_right');
    }
    return classArr;
  };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
</style>
