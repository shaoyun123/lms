<template>
  <div v-for="(item, index) in messageList" :key="index">
    <div
      v-if="!middleNumList.includes(Number(item.senderRole))"
      class="message-row row-card-emoji"
      :class="{
        'user-type-1': leftNumList.includes(Number(item.senderRole)),
        'user-type-2': rightNumList.includes(Number(item.senderRole))
      }"
    >
      <div class="simple-avatar circle">
        <el-image
          v-if="item.senderAvatar"
          :src="item.senderAvatar"
          loading="lazy"
        />
        <el-image
          v-else
          :src="getSenderAvatar(userInfo.participantList) || ''"
          loading="lazy"
        />
      </div>
      <div class="message-contain flex">
        <div :class="item.senderRole === 1 ? '' : 'message-read-type'">
          <div class="format_time">
            {{ formatTimestampInChat(item.msgCreateTime) }}
          </div>
        </div>
        <MsgText v-if="item.msgType === 'text'" :text-data="item" />
        <!-- 图片 -->
        <MsgImg
          v-if="item.msgType === 'file_image'"
          :img-data="JSON.parse(item.content)"
          @scan-img-func="scanImgFunc"
        ></MsgImg>
        <!-- 商品 -->
        <MsgProduct
          v-if="item.msgType === 'goods_card'"
          :product-data="item"
        ></MsgProduct>
        <!-- 订单 -->
        <MsgOrder
          v-if="item.msgType === 'order_card'"
          :order-data="item"
        ></MsgOrder>
      </div>
      <div v-if="item?.msgStatus === 'sending'" class="msg-status">
        <el-icon :size="20"><Loading /></el-icon>
        <i class="el-icon-loading"></i>
      </div>
      <div v-if="item?.msgStatus === 'fail'" class="msg-status">
        <el-icon :color="chatPrimary" :size="20"><Warning /></el-icon>
      </div>
    </div>
    <!-- 系統消息 -->
    <MsgSysText v-else :sys-text-data="item" />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { formatTimestampInChat } from '@/utils/showChatTime';
  import MsgText from '../middleComponents/MsgText.vue';
  import MsgSysText from '../middleComponents/MsgSysText.vue';
  import MsgProduct from '../middleComponents/MsgProduct.vue';
  import MsgImg from '../middleComponents/MsgImg.vue';
  import MsgOrder from '../middleComponents/MsgOrder.vue';
  import { Loading, Warning } from '@element-plus/icons-vue';
  import { chatPrimary } from '@/styles/vars.module.scss';
  import useTikTokChatStore from '@/store/modules/tiktokChat';
  import { storeToRefs } from 'pinia';

  const tikTokChatStore = useTikTokChatStore();
  const { messageList, userInfo } = storeToRefs(tikTokChatStore);
  const leftNumList = ref([1]);
  const rightNumList = ref([3, 6]);
  const middleNumList = ref([5]);

  const emits = defineEmits([
    'scanImgFunc',
    'changeOfferCount',
    'changeOfferStatus'
  ]);

  const scanImgFunc = (url) => {
    emits('scanImgFunc', url);
  };

  // 获取发送头像
  const getSenderAvatar = (avatarList) => {
    if (!avatarList || !avatarList.length) return false;
    let list = [];
    if (avatarList.length) {
      list = avatarList.filter((item) => {
        return item.role !== 1;
      });
    }
    return list[0].avatar;
  };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .msg-status {
    display: flex;
    align-items: center;
    padding: 10px;
  }
  .format_time {
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 5px;
    color: #999;
  }
  .flex {
    display: flex;
    flex-direction: column;
  }
</style>
