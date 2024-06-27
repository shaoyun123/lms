<template>
  <div :class="getClass">
    <div v-if="shopeeChatMsgOrderDto" class="card-product message-card">
      <div v-if="shopeeChatMsgOrderDto" class="card-header">
        订单
        <span
          >{{ shopeeChatMsgOrderDto.platOrderId }}
          <el-icon
            alt="复制"
            title="复制"
            @click="copy(shopeeChatMsgOrderDto.platOrderId)"
            ><CopyDocument
          /></el-icon>
        </span>
      </div>
      <div v-if="shopeeChatMsgOrderDto" class="card-content">
        <div
          v-if="shopeeChatMsgOrderDto.imageUrl"
          class="background-default lzd-pro-img"
        >
          <el-image :src="shopeeChatMsgOrderDto.imageUrl" loading="lazy" />
        </div>
        <div class="lzd-pro-desc">
          <div class="lzd-pro-title text-two-lines">
            {{ shopeeChatMsgOrderDto.title }}
          </div>
          <div class="order-info">
            <div class="order-info-title">数量</div>
            <div class="order-info-text">
              {{ shopeeChatMsgOrderDto.platQuantity }}
            </div>
          </div>
          <div class="order-info">
            <div class="order-info-title">价格</div>
            <div class="order-info-text">
              {{ shopeeChatMsgOrderDto.currency
              }}{{ shopeeChatMsgOrderDto.platOrderAmt }}
            </div>
          </div>
          <div class="order-info">
            <div class="order-info-title">订单状态</div>
            <div class="order-info-text">
              {{ shopeeChatMsgOrderDto.platOrderStatus }}
            </div>
          </div>
          <div class="order-info">
            <div class="order-info-title">下单时间</div>
            <div class="order-info-text">
              {{ transferDate(shopeeChatMsgOrderDto.orderTimePlat) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, computed, ref } from 'vue';
  import { transferDate } from '@/utils/common';
  import { CopyDocument } from '@element-plus/icons-vue';
  import { copy } from '@/utils/common';

  const props = defineProps({
    orderData: {
      type: Object,
      default: () => ({})
    }
  });
  const shopeeChatMsgOrderDto = computed(
    () => props.orderData.shopeeChatMsgOrderDto
  );
  const getClass = () => {
    let classArr = ['lzd-message-item', 'card-text'];
    if (props.shopeeChatMsgOrderDto.buyerOrSeller !== 2) {
      classArr.push('msg_right');
    }
    return classArr;
  };
  const url = ref();
  onMounted(() => {
    url.value = props.orderData.url || props.orderData.imageUrl;
  });
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .msg_right {
    border: 0.5px solid rgb(165, 203, 233);
    background-color: rgb(201, 231, 255);
  }
  .card-product {
    height: 150px;
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .order-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .order-info-title {
      color: #999;
    }
    .order-info-text {
      color: #333;
    }
  }
</style>
