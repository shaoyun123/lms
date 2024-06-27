<template>
  <div class="app-container">
    <div class="el-card">
      <div class="main">
        <store-menu-list ref="storeMenuRef" />
        <MiddlePart ref="middleComponentsRef" />
        <RightPart
          v-if="userInfo?.convShortId"
          ref="rightRef"
          v-leftMove="300"
        />
      </div>
    </div>
  </div>
</template>

<script setup name="publishstiktokchat">
  import { onMounted, onUnmounted, ref, provide } from 'vue';
  import { initWebSocket, closeWebsocket } from '@/utils/websocket';
  import StoreMenuList from './components/leftComponents/StoreMenuList.vue';
  import RightPart from './components/rightComponents/index.vue';
  import MiddlePart from './components/middleComponents/index.vue';
  import useTikTokChatStore from '@/store/modules/tiktokChat';
  import { storeToRefs } from 'pinia';
  const tikTokChatStore = useTikTokChatStore();
  const { userInfo, middleComponentsRef } = storeToRefs(tikTokChatStore);

  // #region 店铺搜索区域 start

  onMounted(() => {
    const baseURL = import.meta.env.VITE_APP_WSS_LMS;
    // let { host, protocol } = window.location;
    // const _protocol = protocol === 'https:' ? 'wss' : 'ws';
    // initWebSocket(`${_protocol}://${host}/chatApi/tiktokChatNetty/webSocket`);

    initWebSocket(`${baseURL}/tiktokChatNetty/webSocket`);
    // initWebSocket(`${baseURL}/chatApi/tiktokChatNetty/webSocket`);
  });

  onUnmounted(() => {
    closeWebsocket();
  });

  // 从中间对话框 点击商品卡片复制pSku 自动填充商品productId至右侧商品查询
  const rightRef = ref(null);
  const productMsgListPId = (pId) => {
    rightRef.value.searchProductListByMiddlePart(pId);
  };

  provide('productMsgListPId', productMsgListPId);
</script>

<style lang="scss" scoped>
  .mt10 {
    margin-top: 10px;
  }

  .infinite-list-wrapper {
    height: 80%;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .main {
    display: flex;
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 58px);

    aside {
      width: 230px;

      .el-menu {
        height: 100%;
      }
    }

    .aside_header {
      height: 80px;
      background-color: #d9001b;
      color: #fff;
      font-size: 20px;
      text-align: center;
      line-height: 80px;
    }

    .menu-expanded {
      width: 330px;
    }

    .content-container {
      flex: 1;
      border-style: none solid none solid;
      border-width: 1px;
      border-color: #e6e6e6;
    }
  }

  .last {
    background-color: aquamarine;
  }
  .menu-expanded-right {
    width: 430px !important;
  }
</style>
