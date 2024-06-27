<template>
  <div>
    <el-card class="box-card" style="margin: 5px">
      <template #header>
        <div class="clearfix">
          <div class="flex_between">
            <div class="flex-center">
              <img src="/src/components/lazada/images/dingdan.png" width="14" />
              <b>{{ orderData.platOrderStatus }}</b>
            </div>
            <span class="color_9B fr" style="padding: 0 4px; margin-left: 4px">
              {{ orderData.allRootStatus }}
            </span>
          </div>
          <div class="flex_between mt08">
            <span
              >{{ orderData.platOrderId
              }}<el-icon
                alt="复制"
                title="复制"
                @click="copy(orderData.platOrderId)"
                ><CopyDocument /></el-icon
            ></span>
            <div style="font-size: 11px">
              订单时间:{{ transferDate(orderData.orderTimeCn) }}
            </div>
          </div>
        </div>
      </template>
      <div>
        <template
          v-for="(item, index) in orderData.detailInfoDtoList"
          :key="index"
        >
          <el-row
            v-show="index < toggleLen ? true : false"
            style="margin-bottom: 10px"
          >
            <el-col :span="4"
              ><el-image :src="item.img" width="50" alt="" loading="lazy" />
            </el-col>
            <el-col :span="14" style="padding-left: 8px">
              <div class="detail_title">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="item.itemTitle"
                  placement="top-start"
                >
                  <b>{{ item.itemTitle }}</b>
                </el-tooltip>
              </div>
              <div class="detail_title">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="item.itemAttr"
                  placement="left"
                >
                  <div>订单子sku属性：{{ item.itemAttr }}</div>
                </el-tooltip>
              </div>
              <div class="detail_title">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="item.storeSubSKu"
                  placement="left"
                >
                  <div>商品sku：{{ item.storeSubSKu }}</div>
                </el-tooltip>
              </div>
            </el-col>
            <el-col :span="6" class="text_right"
              >{{ item.detailOrderAmt }}<br />* {{ item.quantity }}</el-col
            >
          </el-row>
        </template>
        <el-row v-if="showAllBtn()">
          <el-button
            type="primary"
            :icon="CaretBottom"
            link
            @click="toggleOrder(orderData.detailInfoDtoList.length)"
            >查看全部</el-button
          >
        </el-row>
        <el-row v-if="showUpBtn()">
          <el-button
            type="primary"
            :icon="CaretTop"
            link
            @click="toggleOrder(2)"
            >收起</el-button
          >
        </el-row>
        <el-row class="text_right mt_5 flex-end">
          <el-popover placement="right" width="800" @show="popFunc(orderData)">
            <h4 style="color: #000">物流详情</h4>
            <div v-if="packageDetailInfoList.length">
              <div class="ml20">
                <span>订单ID：{{ orderData.platOrderId }}</span>
              </div>
              <div
                :span="12"
                class="mt_10"
                style="
                  padding-left: 20px;
                  min-height: 200px;
                  height: 300px;
                  overflow: auto;
                "
              >
                <el-timeline>
                  <el-timeline-item
                    v-for="(activity, indexDetail) in packageDetailInfoList"
                    :key="indexDetail"
                    :timestamp="transferDate(activity.updateTime)"
                    ><span :class="{ 'main-color': indexDetail === 0 }">{{
                      activity.description
                    }}</span>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
            <template #reference>
              <el-button size="small" type="danger">查看物流</el-button>
            </template>
          </el-popover>
          <el-button
            size="small"
            type="danger"
            @click="orderInfo(orderData.platOrderId)"
            >查看订单</el-button
          >
          <el-button size="small" type="danger" @click="sendOrder(orderData)"
            >发送订单</el-button
          >
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { transferDate } from '@/utils/common';
  import { getTkLogisticsStatus } from '@/api/tiktok/chat';
  import { CopyDocument, CaretTop, CaretBottom } from '@element-plus/icons-vue';
  import { copy } from '@/utils/common';
  import useTikTokChatStore from '@/store/modules/tiktokChat';
  const tikTokChatStore = useTikTokChatStore();
  const { sendMessage } = tikTokChatStore;

  const props = defineProps({
    orderData: {
      type: Object,
      default: () => ({})
    }
  });

  const toggleLen = ref(2); // 子订单显示的条数，默认两条
  const toggleOrder = (len) => {
    toggleLen.value = len;
  };

  // 查看全部
  const showAllBtn = () => {
    const detailSkuLength = props.orderData.detailInfoDtoList.length;
    if (detailSkuLength > 2 && detailSkuLength !== toggleLen.value) {
      return true;
    }
    return false;
  };

  // 点击收起
  const showUpBtn = () => {
    const detailSkuLength = props.orderData.detailInfoDtoList.length;
    if (detailSkuLength > 2 && detailSkuLength === toggleLen.value) {
      return true;
    }
    return false;
  };

  // 点击查看物流
  const packageDetailInfoList = ref([]);
  const popFunc = async (item) => {
    const params = {
      storeAcctId: item.storeAcctId,
      platOrderId: item.platOrderId
    };
    try {
      const { data } = await getTkLogisticsStatus(params);
      packageDetailInfoList.value = (
        data.trackingInfoList[0].trackingInfo || []
      ).map((item, index) => ({
        ...item,
        color: index === 0 ? '#d9001b' : ''
      }));
    } catch (err) {
      packageDetailInfoList.value = [];
      console.log('err :>> ', err);
    }
  };

  // 查看订单--点击跳转到订单-直邮订单-全部订单 并且根据订单号进行搜索
  const orderInfo = (platOrderId) => {
    const url = window.location.href.split('#')[0];
    window.open(
      `${url}#/order/auditDespathOrder/allStatusOrder?platOrderId=${platOrderId}`,
      '_blank'
    );
  };

  // 发送订单
  const sendOrder = (item) => {
    let message = {
      messageType: 'order_card',
      params: {
        orderId: item.platOrderId
      },
      showData: {
        tiktokChatMsgItemDto: {
          ...item
        }
      }
    };
    sendMessage(message);
  };
</script>

<style lang="scss" scoped>
  .detail_title {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .text_right {
    text-align: right;
  }
  .mt_5 {
    margin-top: 5px;
  }
  .mt_10 {
    margin-top: 10px;
  }
  .flex-end {
    display: flex;
    justify-content: flex-end;
  }
  .main_color {
    color: var(--chat-primary);
  }
  .color_9B {
    color: #9b9b9b;
  }
  .order_amount {
    text-align: right;
    color: --chat-primary;
    font-weight: bold;
  }
  .mt08 {
    margin-top: 8px;
  }
  .ml20 {
    margin-left: 20px;
  }
  .flex_between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .flex-center {
    display: flex;
    align-items: center;
  }
</style>
