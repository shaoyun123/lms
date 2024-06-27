<template>
  <div class="flex">
    <img
      v-if="item.conversationStatus === 'UN_HANDLED'"
      width="15"
      height="15"
      src="@/components/lazada/images/marked.png"
    />
    <el-popover
      v-model="visible"
      width="100"
      trigger="click"
      placement="bottom"
      :teleported="cardType === 'userListCard' ? false : true"
      popper-class="no-padding"
    >
      <div class="operation_btn operation_btn_bom" @click="handlePinned(item)">
        {{ item.pinned ? '取消星标' : '星标聊天' }}
      </div>
      <div
        v-if="isUnreadStatus(item)"
        class="operation_btn operation_btn_bom"
        @click="updateChatStatus(item, 'UNREAD')"
      >
        标为未读
      </div>
      <div
        v-if="item.conversationStatus !== 'HANDLED'"
        class="operation_btn operation_btn_bom"
        @click="updateChatStatus(item, 'HANDLED')"
      >
        标为已处理
      </div>
      <div
        v-if="item.conversationStatus === 'HANDLED'"
        class="operation_btn operation_btn_bom"
        @click="updateChatStatus(item, 'UN_HANDLED')"
      >
        标为未处理
      </div>
      <div
        class="operation_btn operation_btn_bom"
        @click="handleDelSession(item)"
      >
        删除对话
      </div>
      <template #reference>
        <el-button class="three-dots" @click.stop="visiblePopover"
          >...</el-button
        >
      </template>
    </el-popover>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import {
    deleteConversationItem,
    batchUpdateConversationStatusApi,
    setConversationPinned
  } from '@/api/tiktok/chat';
  import useTikTokChatStore from '@/store/modules/tiktokChat';

  const tikTokChatStore = useTikTokChatStore();
  const { delConverSation } = tikTokChatStore;
  const props = defineProps({
    item: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    visibles: {
      type: Array,
      default: () => []
    },
    index: { type: [Number, String], default: -1 },
    active: {
      type: Number,
      default: null
    },
    cardType: {
      type: String,
      default: () => ''
    }
  });
  const emits = defineEmits(['update:modelValue', 'changeStatus']);

  const cardItem = computed(() => props.item);

  const visible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  // 单项标为未读
  const isUnreadStatus = (item) => {
    const conversationStatusList = ['UN_ANSWERED', 'HANDLED'];
    const { conversationStatus } = item;
    return conversationStatusList.includes(conversationStatus);
  };

  const visibles = computed(() => props.visibles);
  const visiblePopover = () => {
    if (visibles.value && Array.isArray(visibles.value)) {
      const len = visibles.value.length;
      if (len) {
        for (let i = 0; i < len; i++) {
          if (i !== props.index.value) {
            visibles.value.splice(i, 1, false);
          }
        }
      }
    } else {
      Object.keys(visible.value).forEach((key) => {
        if (key !== props.index.value) {
          visibles.value[key] = false;
        }
      });
    }
  };
  // 修改状态
  const handlePinned = async (item) => {
    const { convShortId, storeAcctId, pinned } = item;
    const status = pinned ? 0 : 1;
    try {
      await setConversationPinned({
        convShortId,
        storeAcctId,
        pinStatus: status
      });
      cardItem.value.pinned = !pinned;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  // 删除会话
  const handleDelSession = async (item) => {
    const { storeAcctId, convShortId } = item;
    try {
      await deleteConversationItem(storeAcctId, [convShortId]);
      delConverSation({ item, needDel: true, active: props.active });
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  // 单个改变会话状态
  const updateChatStatus = async (item, conversationStatus) => {
    const { convShortId, storeAcctId } = item;
    try {
      await batchUpdateConversationStatusApi({
        conversationList: [
          {
            storeAcctId,
            convShortId
          }
        ],
        conversationStatusEnum: conversationStatus
      });
      cardItem.value.conversationStatus = conversationStatus;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
</script>

<style lang="scss" scoped>
  .three-dots {
    background: transparent;
    border: unset;
    font-weight: bolder;
  }
  .operation_btn {
    text-align: center;
    padding: 10px 0;
    &:hover {
      background: #f5f7fa;
    }
  }
  .operation_btn_bom {
    border-bottom: 1px solid #f1f1f1;
  }
  .flex {
    display: flex;
    align-items: center;
  }
</style>
