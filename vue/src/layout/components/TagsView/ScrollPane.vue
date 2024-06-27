<template>
  <div class="scroll-container">
    <el-icon class="arrow left" @click="scrollTo('left')">
      <ArrowLeft />
    </el-icon>
    <el-scrollbar ref="scrollbarRef" @scroll="scroll">
      <div ref="scrollbarContentRef" class="scrollbar-content">
        <slot />
      </div>
    </el-scrollbar>
    <el-icon class="arrow right" @click="scrollTo('right')">
      <ArrowRight />
    </el-icon>
    <div class="scroll-btn" @click="handleOPenNewPage">
      <el-tooltip effect="dark" content="BI报表" placement="bottom-end">
        <el-icon :size="18"><DataLine /></el-icon>
      </el-tooltip>
    </div>
    <Userinfo class="scroll-userinfo" />
    <div
      v-permission="['scrollPaneOrderPane']"
      style="width: 120px; display: flex; align-items: center"
    >
      <el-button type="primary" @click="changeIsShow">
        排名数据 &nbsp;<el-icon v-if="isShow"><ArrowUpBold /></el-icon>
        <el-icon v-else><ArrowDownBold /></el-icon>
      </el-button>
      <div v-if="isShow" class="orderRanking" :style="isNone">
        <template v-for="item in orderInitData" :key="item.name">
          <div
            v-if="JSON.stringify(orderApiData[item.value]) != '{}'"
            class="orderRankingCon"
            :style="[
              item.name == '已投蓝sku数' || item.label == 'shopee交接'
                ? 'background-color: rgba(210, 170, 110, 0.5)'
                : ''
            ]"
          >
            <div class="orderRankingConDiv">
              <span class="wh1"
                >{{ item.name }}<br /><span
                  v-if="item.label"
                  style="font-weight: 100; font-size: 14px"
                  >({{ item.label }})</span
                ></span
              ><span class="wh2">前一名</span><span class="wh2">后一名</span>
            </div>
            <div class="orderRankingConDiv">
              <span class="wh1" style="color: red"
                >{{ orderApiData[item.value]?.currentOperatedQuantity
                }}<span
                  v-if="orderApiData[item.value]?.currentOperatedSkuQuantity"
                >
                  /
                  {{
                    orderApiData[item.value]?.currentOperatedSkuQuantity
                  }}</span
                ></span
              >
              <span class="wh2">{{ orderApiData[item.value]?.preUser }}</span
              ><span class="wh2">{{ orderApiData[item.value]?.nextUser }}</span>
            </div>
            <div class="orderRankingConDiv">
              <span class="wh1">当前排名</span
              ><span class="wh"
                >{{
                  item.name == '已交接订单数' || item.name == '已包装订单数'
                    ? '数量'
                    : 'sku数'
                }}
                ：
                {{ orderApiData[item.value]?.preOperatedQuantity }}</span
              ><span class="wh"
                >sku数：{{
                  orderApiData[item.value]?.nextOperatedQuantity
                }}</span
              >
            </div>
            <div class="orderRankingConDiv">
              <span class="wh1" style="color: red">{{
                orderApiData[item.value]?.currentRanking
              }}</span
              ><span class="wh"
                >排名：{{ orderApiData[item.value]?.preRanking }}</span
              ><span class="wh"
                >排名：{{ orderApiData[item.value]?.nextRanking }}</span
              >
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { ElScrollbar } from 'element-plus';
  import { ArrowLeft, ArrowRight, DataLine } from '@element-plus/icons-vue';
  import Userinfo from './Userinfo.vue';
  import axios from 'axios';
  import usePermissionStore from '@/store/modules/permission';
  // import { getRankingData } from '@/api/user';

  const scrollbarRef = ref(null);
  const scrollbarContentRef = ref(null);
  /** 当前滚动条距离左边的距离 */
  let currentScrollLeft = 0;
  /** 每次滚动距离 */
  const translateDistance = 200;

  const scroll = ({ scrollLeft }) => {
    currentScrollLeft = scrollLeft;
  };

  let isShow = ref(true);
  let scrollPaneInterval;

  let orderInitData = [
    {
      name: '已入库sku数/数量',
      value: 'scanOrderRanking'
    },
    {
      name: '已投蓝sku数',
      value: 'multipleOrderRanking'
    },
    {
      name: '已包装订单数',
      value: 'packagedQuantityRanking'
    },
    {
      name: '已交接订单数',
      label: 'shopee交接',
      value: 'shopeeQuantityRanking'
    },
    {
      name: '已交接订单数',
      label: 'AE全托管',
      value: 'AEFullQuantityRanking'
    },
    {
      name: '已交接订单数',
      label: 'AE半托管',
      value: 'AEHalfQuantityRanking'
    }
  ];
  let orderApiData = ref({});
  let isNone = ref({ display: 'none' });

  // 包装等环节展示个人及排名数据接口，错误数据不提示
  function getRankingDataApi() {
    axios({
      method: 'get',
      url: '/api/lms/platorder/getRankingData'
    })
      .then((res) => {
        if (res.data.code == '0000') {
          orderApiData.value = res.data.data;
        } else {
          console.log('包装等环节展示个人及排名数据err :>> ', res.data.msg);
        }
        isNone.value = '';
      })
      .catch((err) => {
        console.log('包装等环节展示个人及排名数据err :>> ', err);
      });
  }

  onMounted(() => {
    const { permissionBtns } = usePermissionStore();
    let authVals = Object.values(permissionBtns);
    // console.log(authVals);
    // 已经授权的账号才会调用
    if (authVals.includes('scrollPaneOrderPane')) {
      getRankingDataFunc();
    }
  });

  // 每分钟调用一次排名接口
  const getRankingDataFunc = () => {
    getRankingDataApi();
    scrollPaneInterval = setInterval(() => {
      setTimeout(() => {
        getRankingDataApi();
      }, 0);
    }, 60000);
  };

  // 收起面板不调用接口
  const changeIsShow = () => {
    isShow.value = !isShow.value;
    if (isShow.value == false) {
      clearInterval(scrollPaneInterval);
    } else {
      getRankingDataFunc();
    }
  };
  // 组件销毁时，销毁编辑器
  onBeforeUnmount(() => {
    clearInterval(scrollPaneInterval);
  });

  /** 点击滚动 */
  const scrollTo = (direction) => {
    let scrollLeft = 0;
    /** 可滚动内容的长度 */
    const scrollbarContentRefWidth = scrollbarContentRef.value.clientWidth;
    /** 滚动可视区宽度 */
    const scrollbarRefWidth = scrollbarRef.value.wrapRef.clientWidth;
    /** 最后剩余可滚动的宽度 */
    const lastDistance =
      scrollbarContentRefWidth - scrollbarRefWidth - currentScrollLeft;
    // 没有横向滚动条，直接结束
    if (scrollbarRefWidth > scrollbarContentRefWidth) return;
    if (direction === 'left') {
      scrollLeft = Math.max(0, currentScrollLeft - translateDistance);
    } else {
      scrollLeft = Math.min(
        currentScrollLeft + translateDistance,
        currentScrollLeft + lastDistance
      );
    }
    scrollbarRef.value.setScrollLeft(scrollLeft);
  };

  const handleOPenNewPage = () => {
    const origin = window.location.origin;
    window.open(origin + '/lms/finebi');
  };
</script>

<style lang="scss" scoped>
  .scroll-container {
    height: 100%;
    user-select: none;
    display: flex;
    justify-content: space-between;
    .arrow {
      width: 40px;
      height: 100%;
      cursor: pointer;
      &.left {
        box-shadow: 5px 0 5px -6px #ccc;
        &:hover {
          background-color: #f6f6f6;
        }
      }
      &.right {
        box-shadow: -5px 0 5px -6px #ccc;
        &:hover {
          background-color: #f6f6f6;
        }
      }
    }
    .el-scrollbar {
      flex: 1;
      height: 100%;
      line-height: 100%;
      // 横向超出窗口长度时，显示滚动条
      white-space: nowrap;
      .scrollbar-content {
        display: inline-block;
        line-height: var(--v3-tagsview-height);
      }
    }
    .scroll-userinfo {
      width: 120px;
      display: flex;
      align-items: center;
      margin-left: 20px;
    }
    .scroll-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }
  // [v-cloak] {
  //   display: none;
  // }
  .orderRanking {
    width: 300px;
    position: absolute;
    right: 50px;
    top: 50px;
    .orderRankingCon {
      border-bottom: 1px solid #aaa;
      padding: 5px 0;
      background-color: rgba(200, 200, 200, 0.5);
      .orderRankingConDiv {
        display: flex;
        margin-bottom: 4px;
        .wh1 {
          font-weight: bold;
          font-size: 16px;
          width: 160px;
          text-align: center;
        }
        .wh2 {
          font-weight: bold;
          font-size: 16px;
          width: 65px;
          text-align: center;
        }
        .wh {
          width: 65px;
        }
      }
    }
  }
</style>
