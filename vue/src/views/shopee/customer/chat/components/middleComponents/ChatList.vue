<template>
  <template v-if="!messageList.length">
    <el-empty description="暂无历史消息" />
  </template>
  <template v-else>
    <div v-for="(item, index) in messageList" :key="index">
      <div
        v-if="item.messageType !== 'notification'"
        class="message-row row-card-emoji"
        :class="item.buyerOrSeller === 1 ? 'user-type-1' : 'user-type-2'"
      >
        <div class="simple-avatar circle">
          <el-image
            :src="
              item.buyerOrSeller === 1
                ? userInfo.toAvatar
                : 'https://sg-live.slatic.net/original/0f460c08eaf10eaaada4bd51ef2af6ea.png'
            "
            loading="lazy"
          />
        </div>
        <div class="message-contain">
          <div :class="item.buyerOrSeller === 1 ? '' : 'message-read-type'">
            <span style="color: #999">{{ transferDate(item.createTime) }}</span>
          </div>
          <MsgText v-if="getIsTextType(item)" :text-data="item" />
          <!-- 图片 -->
          <MsgImg
            v-if="item.messageType === 'image'"
            :img-data="item"
            @scan-img-func="scanImgFunc"
          ></MsgImg>
          <!-- 表情 -->
          <MsgEmoji
            v-if="item.messageType === 'sticker'"
            :emoji-data="item"
            :store-info="userInfo"
          ></MsgEmoji>
          <!-- 商品 -->
          <MsgProduct
            v-if="item.messageType === 'item' && item.shopeeChatMsgItemDto"
            :product-data="item"
          ></MsgProduct>
          <!-- 订单 -->
          <MsgOrder
            v-if="item.messageType === 'order' && item.shopeeChatMsgOrderDto"
            :order-data="item"
          ></MsgOrder>
          <!-- 优惠券 -->
          <MsgVoucher
            v-if="item.messageType === 'coupon' && item.shopeeChatMsgCouponDto"
            :coupon-data="item"
          ></MsgVoucher>
          <!-- 议价 -->
          <MsgOffer
            v-if="item.messageType === 'offer' && item.offer"
            :offer-data="item"
            @change-offer-count="changeOfferCount"
            @change-offer-status="changeOfferStatus"
          ></MsgOffer>
          <!-- 关注卡片 -->
          <!-- <lazada-card
                v-if="item.messageType === 10010"
                :lazadaCardData="item"
              >
              </lazada-card> -->
          <div class="message-read-type">
            <span v-if="!item.readStatus" class="read-type unread-type"
              >未读</span
            >
            <span v-else class="read-type">读取</span>
          </div>
          <!-- end -->
        </div>
        <div v-if="item.msgStatus === 'sending'" class="msg-status">
          <el-icon :size="20"><Loading /></el-icon>
          <i class="el-icon-loading"></i>
        </div>
        <div v-if="item.msgStatus === 'fail'" class="msg-status">
          <el-icon :color="chatPrimary" :size="20"><Warning /></el-icon>
        </div>
      </div>
      <!-- 系統消息 -->
      <MsgSysText
        v-if="item.messageType === 'notification' || item.messageStatus === 0"
        :sys-text-data="item"
      />
    </div>
  </template>
</template>

<script setup>
  import {} from 'vue';
  import MsgText from '../middleComponents/MsgText.vue';
  import MsgSysText from '../middleComponents/MsgSysText.vue';
  import MsgProduct from '../middleComponents/MsgProduct.vue';
  import MsgEmoji from '../middleComponents/MsgEmoji.vue';
  import MsgImg from '../middleComponents/MsgImg.vue';
  import MsgOrder from '../middleComponents/MsgOrder.vue';
  import MsgVoucher from '../middleComponents/MsgVoucher.vue';
  import MsgOffer from '../middleComponents/MsgOffer.vue';
  import { transferDate } from '@/utils/common';
  import { Loading, Warning } from '@element-plus/icons-vue';
  import { chatPrimary } from '@/styles/vars.module.scss';
  import useShopeeChatStore from '@/store/modules/shopeeChat';
  import { storeToRefs } from 'pinia';

  const shopeeChatStore = useShopeeChatStore();
  const { messageList, userInfo } = storeToRefs(shopeeChatStore);

  const emits = defineEmits([
    'scanImgFunc',
    'changeOfferCount',
    'changeOfferStatus'
  ]);

  const getIsTextType = (item) => {
    const isOrderType =
      item.messageType === 'order' && !item.shopeeChatMsgOrderDto;
    const isItemType =
      item.messageType === 'item' && !item.shopeeChatMsgItemDto;
    return item.messageType === 'text' || isOrderType || isItemType;
  };
  const scanImgFunc = (url) => {
    emits('scanImgFunc', url);
  };
  const changeOfferCount = () => {
    emits('changeOfferCount');
  };
  const changeOfferStatus = () => {
    emits('changeOfferStatus');
  };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .msg-status {
    display: flex;
    align-items: center;
    padding: 10px;
  }
</style>
