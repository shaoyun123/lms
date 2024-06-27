<template>
  <div v-if="userList.length">
    <div class="inifinite_list_wrapper">
      <div
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        class="list"
      >
        <div
          v-for="(item, index) in userList"
          :key="item.id"
          :class="getCardClass(item)"
          @click="handleChat(item, index)"
        >
          <div
            v-if="item.isCheckedStatus"
            class="check_icon"
            @click.stop="handleCheckUser(index)"
          >
            <el-icon v-if="item.checked" :size="15" :color="chatPrimary"
              ><Check
            /></el-icon>
          </div>
          <div v-if="item.pinned" class="position">
            <el-icon :size="20" class="collect_star"><StarFilled /></el-icon>
          </div>
          <div class="buyer_info">
            <div>
              <el-badge
                v-if="item.unreadCount"
                style="margin-left: 15px"
                :value="item.unreadCount"
                :max="99"
              >
              </el-badge>
              <div v-if="showDot(item)">
                <el-badge style="margin-left: 15px" is-dot></el-badge>
              </div>
            </div>
            <div class="buyer_row">
              <div class="buyer_left">
                <div class="buyer_img">
                  <el-image
                    v-if="item.buyerAvatar"
                    class="image"
                    fit="contain"
                    :src="item.buyerAvatar"
                    loading="lazy"
                  />
                  <el-avatar
                    v-else
                    fit="contain"
                    :src="item.buyerAvatar"
                  ></el-avatar>
                </div>
                <div class="buyer_name">
                  {{ item.buyerNick }}
                </div>
              </div>
              <div class="buyer_store">
                <el-icon :color="chatPrimary"><Shop /></el-icon>
                {{ item.storeAcct }}
              </div>
              <div class="buyer_time">
                {{ getTime(item?.latestMsgCreateTime) }}
              </div>
            </div>
            <div class="buyer_row">
              <div class="last_msg">{{ getInfoType(item) }}</div>
              <DotPopover
                v-model="visibles[index]"
                :visibles="visibles"
                :item="item"
                :index="index"
                :active="activeUserId"
                :card-type="cardTypePopover"
              />
            </div>
          </div>
        </div>
        <p v-if="loadingBuyerList" class="footer">加载中...</p>
        <div v-if="noMore" class="footer">---- 已经到底啦 ----</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { formatTimestampByIsToday } from '@/utils/common';
  import DotPopover from './DotPopover.vue';
  import { readConversationItemApi } from '@/api/tiktok/chat';
  import { Check, Shop } from '@element-plus/icons-vue';
  import useTikTokChatStore from '@/store/modules/tiktokChat';
  import { storeToRefs } from 'pinia';
  import { chatPrimary } from '@/styles/vars.module.scss';
  const tikTokChatStore = useTikTokChatStore();
  const { isLoadUserList, userList, activeUserId, userPage, loadingBuyerList } =
    storeToRefs(tikTokChatStore);
  const {
    getUserList,
    handleCheckUser,
    fetchMessage,
    changeUserListKey,
    setUserPage,
    setLoadingBuyerList
  } = tikTokChatStore;
  const props = defineProps({
    storeAcctIdList: {
      type: Array,
      default: () => []
    },
    conversationStatusList: {
      type: Array,
      default: () => []
    }
  });

  const cardTypePopover = 'userListCard';

  // 根据状态获取卡片的样式
  const getCardClass = (item) => {
    let cardClass = ['info'];
    if (activeUserId.value === item.id) {
      cardClass.push('info--active');
    }
    const yellowBgStatus = ['UN_HANDLED', 'UN_ANSWERED'];
    if (yellowBgStatus.includes(item.conversationStatus)) {
      cardClass.push('info--yellow-bg');
    }
    return cardClass;
  };

  // 获取每个会话时间的展示
  const getTime = (lastMessageTimestamp) => {
    const time = formatTimestampByIsToday(lastMessageTimestamp);
    return time;
  };

  // 获取每个会话聊天内容的展示
  const getInfoType = (item) => {
    const { latestMsgType } = item;
    switch (latestMsgType) {
      case 'text':
        return item.lastMessageShow || '';
      case 'notification':
        return item.lastMessageShow || '系统消息';
      case 'goods_card':
        return item.lastMessageShow || '[商品]';
      case 'emoticons':
        return item.lastMessageShow || '[表情]';
      case 'order_card':
        return item.lastMessageShow || '[订单]';
      case 'file_image':
        return item.lastMessageShow || '[图片]';
      default:
        return '----';
    }
  };

  // 是否展示未读标记
  const showDot = (item) => {
    return item.conversationStatus === 'UNREAD' && !item.unreadCount;
  };

  const visibles = ref([]);

  // 滚动加载
  const noMore = computed(() => !isLoadUserList.value);
  const disabled = computed(() => loadingBuyerList.value || noMore.value);
  const load = () => {
    if (noMore.value) return;
    setTimeout(async () => {
      setLoadingBuyerList(true);
      setUserPage();
      const { storeAcctIdList, conversationStatusList } = props;
      getUserList({
        page: userPage.value,
        storeAcctIdList,
        conversationStatusList
      });
    }, 2000);
  };

  // 点击会话
  const handleChat = async (item, index) => {
    if (activeUserId.value === item.id) return;
    tikTokChatStore.$patch({
      activeUserId: item.id
    });
    try {
      const { storeAcctId, convShortId } = item;
      // 若存在聊天，就不掉接口
      if (!item.messageList?.length) {
        await fetchMessage(item, 'userCard', index);
      } else {
        tikTokChatStore.$patch({
          messageList: item.messageList,
          userInfo: item
        });
      }
      const { data } = await readConversationItemApi({
        storeAcctId,
        convShortId
      });
      changeUserListKey({ conversationStatus: data, unreadCount: 0 }, index);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins.scss';
  .info {
    position: relative;
    min-height: 50px;
    display: flex;
    padding: 10px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
    &:hover {
      background-color: rgb(237, 245, 254);
    }
    &--yellow-bg {
      background-color: rgb(250, 205, 145);
    }
    &--active {
      background-color: rgb(237, 245, 254);
    }
    .check_icon {
      height: 15px;
      width: 15px;
      border: 1px solid var(--chat-primary);
      margin-right: 15px;
    }
  }
  .buyer_info {
    flex: 1;
    overflow: hidden;
    padding-top: 15px;
  }
  .buyer_row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .buyer_left {
      display: flex;
      flex: auto;
      align-items: center;
      overflow: hidden;
      .buyer_name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .buyer_img {
      flex: none;
      width: 30px;
      .image {
        height: 25px;
        width: 25px;
        border-radius: 50%;
      }
      :deep(.el-avatar) {
        height: 25px;
        width: 25px;
      }
    }
    .buyer_name {
      color: #333;
      line-height: 22px;
      font-size: 16px;
      font-weight: 600;
      height: 22px;
    }
    .buyer_store {
      margin: 0 5px;
      flex: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .buyer_time {
      font-size: 12px;
    }
  }
  .position {
    position: absolute;
    top: 0;
    left: 0;
  }
  .middle_content {
    flex: 1;
    overflow: hidden;
  }
  .title {
    color: #333;
    line-height: 22px;
    font-size: 16px;
    font-weight: 600;
    height: 22px;
    @include ellipsis;
  }
  .last_msg {
    padding: 5px;
    @include ellipsis;
    font-size: 13px;
  }
  .right_content {
    flex: none;
    margin-left: 5px;
    text-align: right;
  }
  .disflex {
    display: flex;
  }
  .operation-btn {
    text-align: center;
    padding: 10px 0;
    &:hover {
      background: #f5f7fa;
    }
  }
  .operation-btn-bom {
    border-bottom: 1px solid #f1f1f1;
  }
  .three-dots {
    background: transparent;
    border: unset;
  }
  .footer {
    text-align: center;
    padding: 20px 0 30px 0;
    color: #999;
  }
  .collect_star {
    color: rgb(251, 191, 0);
  }
</style>
