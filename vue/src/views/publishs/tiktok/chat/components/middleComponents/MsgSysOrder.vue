<template>
  <div v-if="tiktokChatMsgItemDto" :class="getOrderClass">
    <div class="card-product message-card border-r-10">
      <div v-if="tiktokChatMsgOrderDto" class="card-header flex">
        <el-icon color="#20b2aa" size="18" class="mr-4"><Tickets /></el-icon
        >订单
        <span
          >{{ tiktokChatMsgOrderDto.platOrderId }}
          <el-icon
            alt="复制"
            title="复制"
            @click="copy(tiktokChatMsgOrderDto.platOrderId)"
            ><CopyDocument
          /></el-icon>
        </span>
      </div>
      <div v-if="tiktokChatMsgOrderDto" class="card-content">
        <div
          v-if="tiktokChatMsgOrderDto.imageUrl"
          class="background-default lzd-pro-img"
        >
          <el-image :src="tiktokChatMsgOrderDto.imageUrl" loading="lazy" />
        </div>
        <div class="lzd-pro-desc">
          <div class="lzd-pro-title text-two-lines">
            {{ tiktokChatMsgOrderDto.productName }}
          </div>
          <div class="order-info">
            <div class="order-info-title">数量</div>
            <div class="order-info-text">
              {{ tiktokChatMsgOrderDto.platQuantity }}
            </div>
          </div>
          <div class="order-info">
            <div class="order-info-title">价格</div>
            <div class="order-info-text">
              {{ tiktokChatMsgOrderDto.currency
              }}{{ tiktokChatMsgOrderDto.platOrderAmt }}
            </div>
          </div>
          <div class="order-info">
            <div class="order-info-title">订单状态</div>
            <div class="order-info-text">
              {{ tiktokChatMsgOrderDto.platOrderStatus }}
            </div>
          </div>
          <div class="order-info">
            <div class="order-info-title">下单时间</div>
            <div class="order-info-text">
              {{ transferDate(tiktokChatMsgOrderDto.orderTimePlat) }}
            </div>
          </div>
          <hr />
          <div class="bg-bbb">用户正在查看订单</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else :class="getTextClass()">
    <div class="message-text-box">
      <div class="lzd-message-text">
        <span class="emoji-face has-text"
          >订单号：{{ getMsgContent(orderData.content) }}</span
        >
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
  const tiktokChatMsgItemDto = computed(
    () => props.orderData.tiktokChatMsgItemDto
  );

  const getMsgContent = (content) => {
    if (content) {
      const temp = JSON.parse(content);
      return temp.order_id ? temp.order_id : '';
    }
    return '';
  };
  const getTextClass = () => {
    let classArr = ['lzd-message-item', 'card-text'];
    if (props.orderData.senderRole === 1) {
      classArr.push('msg_right');
    }
    return classArr;
  };
  const getOrderClass = () => {
    let classArr = ['lzd-message-item', 'card-text'];
    if (props.orderData.senderRole === 1) {
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
  .bg-bbb {
    color: #bbb;
  }
  .border-r-10 {
    border-radius: 10px;
  }
  .mr-4 {
    margin-right: 4px;
  }
</style>
