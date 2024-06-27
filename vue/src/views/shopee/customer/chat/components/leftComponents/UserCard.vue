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
            @click="handleCheckUser(index)"
          >
            <el-icon v-if="item.checked" :size="15" :color="chatPrimary"
              ><Check
            /></el-icon>
          </div>
          <div v-if="item.pinned">
            <img src="/src/components/lazada/images/pinned.png" width="15" />
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
                <el-badge is-dot></el-badge>
              </div>
            </div>
            <div class="buyer_row">
              <div class="buyer_left">
                <div class="buyer_img">
                  <el-image
                    v-if="item.toAvatar"
                    class="image"
                    fit="contain"
                    :src="item.toAvatar"
                    loading="lazy"
                  />
                  <el-avatar
                    v-else
                    fit="contain"
                    :src="item.toAvatar"
                  ></el-avatar>
                </div>
                <div class="buyer_name">
                  {{ item.toName }}
                </div>
              </div>
              <div class="buyer_store">
                <el-icon :color="chatPrimary"><Shop /></el-icon>
                {{ item.storeAcct }}
              </div>
              <div class="buyer_time">
                {{ getTime(item?.lastMessageTimestamp) }}
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
  import DotPopover from './DotPopover.vue';
  import { readConversationApi } from '@/api/shopee/chat';
  import { Check, Shop } from '@element-plus/icons-vue';
  import useShopeeChatStore from '@/store/modules/shopeeChat';
  import { storeToRefs } from 'pinia';
  import { chatPrimary } from '@/styles/vars.module.scss';
  const shopeeChatStore = useShopeeChatStore();
  const { isLoadUserList, userList, activeUserId, userPage, loadingBuyerList } =
    storeToRefs(shopeeChatStore);
  const {
    getUserList,
    handleCheckUser,
    fetchMessage,
    changeUserListKey,
    setUserPage,
    setLoadingBuyerList
  } = shopeeChatStore;
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
  const getTime = (lastMessageTimestamp) => {
    const time = new Date(Number(lastMessageTimestamp));
    const hour = time.getHours();
    const minute = time.getMinutes();
    return hour + ':' + minute;
  };
  const getInfoType = (item) => {
    const { latestMessageType } = item;
    switch (latestMessageType) {
      case 'text':
        return item.latestMessageContent || '';
      case 'notification':
        return item.latestMessageContent || '系统消息';
      case 'product':
        return item.latestMessageContent || '[商品]';
      case 'sticker':
        return '[表情]';
      case 'order':
        return '[订单]';
      case 'image':
        return '[图片]';
      case 'coupon':
        return '[优惠券]';
      default:
        return '----';
    }
  };
  const showDot = (item) => {
    return item.conversationStatus === 'UNREAD' && !item.unreadCount;
  };

  const visibles = ref([]);

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
  const handleChat = async (item, index) => {
    if (activeUserId.value === item.id) return;
    shopeeChatStore.$patch({
      activeUserId: item.id
    });
    try {
      const { storeAcctId, latestMessageId, conversationId } = item;
      // 若存在聊天，就不掉接口
      if (!item.messageList?.length) {
        await fetchMessage(item, 'userCard', index);
      } else {
        shopeeChatStore.$patch({
          messageList: item.messageList,
          userInfo: item
        });
      }
      const { data } = await readConversationApi({
        storeAcctId,
        latestMessageId,
        conversationId
      });
      changeUserListKey({ conversationStatus: data, unreadCount: 0 }, index);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins.scss';
  // @import '@/styles/variables.scss';
  .info {
    min-height: 50px;
    display: flex;
    padding: 10px 0;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
    &:hover {
      background-color: #ecf5ff;
    }
    &--yellow-bg {
      background-color: rgb(250, 205, 145);
    }
    &--active {
      background-color: #ecf5ff;
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
  }
  .buyer_row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .buyer_left {
      display: flex;
      flex: none;
      align-items: center;
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
</style>
