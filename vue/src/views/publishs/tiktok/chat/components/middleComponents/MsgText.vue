<template>
  <div :class="getClass()">
    <div class="message-text-box">
      <div class="lzd-message-text">
        <span class="emoji-face has-text">{{ getTextContent(textData) }}</span>
        <div class="emoji-face has-text relative">
          <div v-if="showContent || textData.traslateContent">
            <div class="line"></div>
            <div v-loading="transLoading">
              {{ textData.traslateContent || translateText }}
            </div>
          </div>
          <el-tooltip content="点击翻译" raw-content placement="right">
            <el-icon
              color="#20b2aa"
              size="20"
              class="translate-icon"
              @click="handleTranslate"
              ><MagicStick
            /></el-icon>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { getTranslateFromBaiduOrGoogleApi } from '@/api/tiktok/chat';
  const props = defineProps({
    textData: {
      type: Object,
      default: () => ({})
    }
  });
  const getClass = () => {
    let classArr = ['lzd-message-item', 'card-text'];
    if (props.textData.senderRole === 1) {
      classArr.push('msg_right');
    }
    return classArr;
  };

  const getTextContent = (textData) => {
    if (textData.content) {
      return (
        JSON.parse(textData.content).content ||
        JSON.parse(textData.content).text
      );
    }
    return '';
  };

  const translateText = ref('');
  const transLoading = ref(false);

  // 展示隐藏
  const showContent = ref(false);
  const handleTranslate = async () => {
    showContent.value = !showContent.value;
    if (!showContent.value) {
      return;
    }
    transLoading.value = true;
    const { code, msg } = await getTranslateFromBaiduOrGoogleApi({
      query: getTextContent(props.textData),
      storeAcctId: props.textData.storeAcctId,
      msgId: props.textData.msgId
    }).finally(() => {
      transLoading.value = false;
    });

    if (code === '0000') {
      translateText.value = msg;
    }
  };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .lzd-message-item.card-text {
    align-self: flex-start !important;
  }
  .msg_right {
    border: 0.5px solid rgb(165, 203, 233);
    background-color: rgb(201, 231, 255);
  }
  .line {
    height: 4px;
    border-bottom: 1px dashed #ccc;
    padding: 4px;
    margin-bottom: 8px;
  }
  .relative {
    position: reactive;
  }
  .translate-icon {
    cursor: pointer;
    margin-top: 10px;
    position: absolute;
    right: -4px;
    bottom: -6px;
  }
</style>
