<template>
  <section v-if="lens">
    <div class="part-title">
      共<span class="part-num">{{ total }}</span
      >条
    </div>
    <div>
      <div v-for="(elem, key) of searchList" :key="key">
        <div
          v-for="(item, index) in elem"
          :key="item.id"
          :class="getCardClass(key, index, item)"
          :index="key + '_' + index"
          @click="onClick(item, key, index)"
        >
          <header class="header">{{ getTitle(item, key) }}</header>
          <!-- 头像 -->
          <div class="main-content">
            <div v-if="item.pinned">
              <img src="/src/components/lazada/images/pinned.png" width="15" />
            </div>
            <div v-if="item.toAvatar" class="buyer-img">
              <el-image
                class="image"
                fit="contain"
                :src="item.toAvatar"
                loading="lazy"
              />
            </div>
            <!-- content -->
            <div class="info-content">
              <!-- 卖家昵称 -->
              <div class="info-content-title flex-between">
                <div class="title">{{ item.toName }}</div>
                <div>
                  <div v-if="showDot(item)">
                    <el-badge is-dot></el-badge>
                  </div>
                  <DotPopover
                    v-model="visibles[`${key}_${index}`]"
                    :item="item"
                    :index="`${key}_${index}`"
                  ></DotPopover>
                </div>
              </div>
              <div v-if="!!item.orderSn" class="last-msg">
                [订单]<span class="match-color">{{ item.orderSn }}</span>
              </div>
              <div v-else class="last-msg">
                {{ getText(item.messageTextContent) }}
              </div>
            </div>
          </div>
          <div class="bottom-line"></div>
        </div>
        <div v-if="key === 0" class="part-interval"></div>
      </div>
    </div>
    <slot />
  </section>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import DotPopover from './DotPopover.vue';
  import { readConversationApi } from '@/api/shopee/chat';
  import useShopeeChatStore from '@/store/modules/shopeeChat';
  import { storeToRefs } from 'pinia';
  const shopeeChatStore = useShopeeChatStore();
  const { activeSearchIndex } = storeToRefs(shopeeChatStore);
  const { fetchMessage } = shopeeChatStore;

  const props = defineProps({
    searchList: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    }
  });

  const visibles = ref({});
  const lens = computed(() => props.searchList.flat(Infinity).length);

  const getCardClass = (key, index, item) => {
    let cardClass = ['info'];
    if (activeSearchIndex.value === `${key}_${index}`) {
      cardClass.push('info--active');
    }
    const yellowBgStatus = ['UN_HANDLED', 'UN_ANSWERED'];
    if (yellowBgStatus.includes(item.conversationStatus)) {
      cardClass.push('info--yellow-bg');
    }
    return cardClass;
  };
  const showDot = (item) => {
    return item.conversationStatus === 'UNREAD' && !item.unreadCount;
  };

  const getTitle = (item, key) => {
    const titleObj = {
      0: '用户',
      1: '聊天内容',
      2: '订单'
    };
    return titleObj[key];
  };
  const getText = (messageText) => {
    return messageText;
  };

  const onClick = async (item, key, index) => {
    shopeeChatStore.$patch({
      activeSearchIndex: key + '_' + index
    });
    // if (item.conversationId) {
    const { storeAcctId, latestMessageId, conversationId } = item;

    // 若存在聊天，就不掉接口
    if (!item.messageList?.length) {
      await fetchMessage(item, 'searchCard', index, key);
    } else {
      shopeeChatStore.$patch({
        messageList: item.messageList,
        userInfo: item
      });
    }
    if (conversationId) {
      try {
        await readConversationApi({
          storeAcctId,
          latestMessageId,
          conversationId
        });
      } catch (err) {
        console.log('err :>> ', err);
      }
    }
    // 若存在聊天，就不掉接口
    if (!item.messageList?.length) {
      fetchMessage(item, 'searchCard', index, key);
    } else {
      shopeeChatStore.$patch({
        messageList: item.messageList,
        userInfo: item
      });
    }
    // } else {
    //   const { data } = await createNewChatApi(item);
    //   item.conversationId = data.conversationId;
    //   fetchMessage(item);
    // }
  };
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins.scss';
  .part-title {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    color: #999;
    .part-num {
      margin: 10px;
    }
  }
  .info {
    width: 100%;
    border-bottom: 1px solid #f1f1f1;
    &:hover {
      background-color: #ecf5ff;
    }
    &--active {
      background-color: #ecf5ff;
    }
    &--yellow-bg {
      background-color: rgb(250, 205, 145);
    }
    .header {
      border-bottom: 1px solid #f1f1f1;
      color: #999;
      padding: 5px 10px;
    }
    .main-content {
      display: flex;
      overflow: hidden;
      padding: 5px 10px 10px 10px;
    }
  }

  .buyer-img {
    flex: none;
    width: 60px;
    .image {
      height: 40px;
      width: 40px;
      border-radius: 50%;
    }
  }
  .info-content {
    flex: 1;
    overflow: hidden;
    .match-color {
      color: var(--chat-primary);
    }
  }
  .title {
    color: #333;
    line-height: 22px;
    font-size: 16px;
    font-weight: 600;
    height: 22px;
    @include ellipsis;
  }
  .last-msg {
    padding: 5px;
    @include ellipsis;
    font-size: 13px;
  }
  .orderColor {
    color: var(--chat-primary);
  }
  .bottom-line {
    background-color: #f4f5f5;
    width: 100%;
    height: 3px;
  }
  .load-more {
    text-align: center;
    padding: 10px 0;
    color: #409eff;
    width: 100%;
  }
  .info-list-footer {
    text-align: center;
    padding: 10px 0;
    color: #999;
  }
  .part-interval {
    background-color: #f4f5f5;
    width: 100%;
    height: 10px;
  }
</style>
