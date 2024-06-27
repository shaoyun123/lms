<template>
  <div class="message-row row-card-system">
    <div class="avatar-holder"></div>
    <div class="message-contain">
      <div class="lzd-message-item card-system">
        <div
          v-if="
            sysTextData.msgType === 'notification' ||
            sysTextData.msgType === 'allocated_service'
          "
          class="lzd-system-text"
        >
          <span data-spm-anchor-id="a1zawi.15103027.0.i6.45844edfmxLWfi">{{
            getMsgContent(sysTextData.content)
          }}</span>
        </div>
        <!-- 商品 -->
        <MsgProduct
          v-if="
            sysTextData.msgType === 'goods_card' ||
            sysTextData.msgType === 'user_enter_from_goods'
          "
          :product-data="sysTextData"
        ></MsgProduct>
        <!-- 订单 -->
        <MsgOrder
          v-if="
            sysTextData.msgType === 'order_card' ||
            sysTextData.msgType === 'user_enter_from_order'
          "
          :order-data="sysTextData"
        ></MsgOrder>
      </div>
    </div>
    <div class="avatar-holder"></div>
  </div>
</template>

<script setup>
  import MsgProduct from '../middleComponents/MsgSysProduct.vue';
  import MsgOrder from '../middleComponents/MsgSysOrder.vue';
  defineProps({
    sysTextData: {
      type: Object,
      default: () => ({})
    }
  });

  const getMsgContent = (content) => {
    if (content) {
      const temp = JSON.parse(content);
      return temp.content ? temp.content : '';
    }
    return '';
  };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .message-contain {
    display: flex;
    align-items: center;
  }
</style>
