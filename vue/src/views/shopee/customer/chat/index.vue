<template>
  <div class="app-container">
    <div class="el-card">
      <div class="main">
        <store-menu-list ref="storeMenuRef" />
        <MiddlePart ref="middleComponentsRef" />
        <RightPart v-if="!isEmpty(userInfo)" v-leftMove="300" />
      </div>
    </div>
  </div>
</template>

<script setup name="shopeecustomerchat">
  import { onMounted, onUnmounted } from 'vue';
  import { initWebSocket, closeWebsocket } from '@/utils/websocket';
  import StoreMenuList from './components/leftComponents/StoreMenuList.vue';
  import RightPart from './components/rightComponents/index.vue';
  import MiddlePart from './components/middleComponents/index.vue';
  import useShopeeChatStore from '@/store/modules/shopeeChat';
  import { isEmpty } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  const shopeeChatStore = useShopeeChatStore();
  const { userInfo, middleComponentsRef } = storeToRefs(shopeeChatStore);

  // #region 店铺搜索区域 start

  onMounted(() => {
    // initWebSocket(`ws://localhost:8051/chatNetty/webSocket`);
    const baseURL = import.meta.env.VITE_APP_WSS_LMS;
    initWebSocket(`${baseURL}/chatNetty/webSocket`);
  });

  onUnmounted(() => {
    closeWebsocket();
  });
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
