<template>
  <div>
    <el-card class="box-card" style="margin: 5px">
      <template #header>
        <div class="clearfix">
          <img src="/src/components/lazada/images/dingdan.png" width="18" />
          <span style="font-size: 15px"
            ><b>{{ orderData.platOrderStatus }}</b></span
          >
          <span class="color_9B fr" style="padding: 3px 0">
            {{ orderData.allRootStatus }}
          </span>
          <br />
          <span
            >{{ orderData.platOrderId
            }}<el-icon
              alt="复制"
              title="复制"
              @click="copy(orderData.platOrderId)"
              ><CopyDocument /></el-icon
          ></span>
        </div>
      </template>
      <div>
        <template
          v-for="(item, index) in orderData.detailsInfoDto"
          :key="index"
        >
          <el-row
            v-show="index < toggleLen ? true : false"
            style="margin-bottom: 10px"
          >
            <el-col :span="4"
              ><el-image :src="item.img" width="50" alt="" loading="lazy" />
            </el-col>
            <el-col :span="14">
              <el-row>
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
                <div class="color_9B">子sku属性：{{ item.itemAttr }}</div>
                <div class="color_9B">
                  店铺子SKU：{{ item.storeSubSKu }}
                  <el-icon
                    alt="复制"
                    title="复制"
                    @click="copy(item.storeSubSKu)"
                    ><CopyDocument
                  /></el-icon>
                </div>
              </el-row>
            </el-col>
            <el-col :span="6" class="text_right"
              >{{ orderData.currency }} {{ item.detailOrderAmt }}<br />x
              {{ item.quantity }}</el-col
            >
          </el-row>
        </template>
        <el-row v-if="showAllBtn()">
          <el-button
            type="primary"
            :icon="CaretBottom"
            link
            @click="toggleOrder(orderData.detailsInfoDto.length)"
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
        <hr />
        <el-row class="mt08">
          <el-col :span="12" class="color_9B vertical-center"
            ><el-icon><Money /></el-icon>订单金额</el-col
          >
          <el-col :span="12" class="order_amount"
            >{{ orderData.currency }} {{ orderData.amt }}</el-col
          >
        </el-row>
        <el-row class="mt08">
          <el-col :span="12" class="color_9B vertical-center"
            ><el-icon><Van /></el-icon>物流信息</el-col
          >
          <el-col :span="12" class="text_right">
            <el-popover
              placement="right"
              width="800"
              @show="popFunc(orderData)"
            >
              <h4 style="color: #000">物流详情</h4>
              <div v-if="packageDetailInfoList.length">
                <div class="ml20">
                  <span>订单ID：{{ orderData.platOrderId }}</span>
                  <span class="ml20">物流状态：{{ logisticsStatus }}</span>
                </div>
                <div
                  :span="12"
                  style="padding-left: 20px; height: 300px; overflow: auto"
                >
                  <el-timeline>
                    <el-timeline-item
                      v-for="(activity, indexDetail) in packageDetailInfoList"
                      :key="indexDetail"
                      :timestamp="transferDate(activity.updateTime * 1000)"
                      ><span :class="{ 'main-color': indexDetail === 0 }">{{
                        activity.description
                      }}</span>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </div>
              <template #reference>
                <el-button size="small" type="danger" plain>查看物流</el-button>
              </template>
            </el-popover>
          </el-col>
        </el-row>
        <el-row class="mt08">
          <el-col :span="12" class="color_9B vertical-center"
            ><el-icon><Calendar /></el-icon>订单时间</el-col
          >
          <el-col :span="12" class="text_right">
            {{ transferDate(orderData.orderTime) }}
          </el-col>
        </el-row>
        <el-row class="mt08">
          <el-col :span="12" class="color_9B vertical-center"
            ><el-icon><Calendar /></el-icon>发货时间</el-col
          >
          <el-col
            v-if="
              orderData.allRootStatus == '已发货' ||
              orderData.allRootStatus == '已归档'
            "
            :span="12"
            class="text_right"
            >{{ orderData.allRootShipTime }}</el-col
          >
        </el-row>
        <el-row class="text_right">
          <el-button type="danger" size="small" @click="sendOrder(orderData)"
            >发送</el-button
          >
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { listOrderTraceApi } from '@/api/shopee/chat';
  import { transferDate } from '@/utils/common';
  import {
    CopyDocument,
    Money,
    Van,
    CaretTop,
    CaretBottom,
    Calendar
  } from '@element-plus/icons-vue';
  import { copy } from '@/utils/common';
  import useShopeeChatStore from '@/store/modules/shopeeChat';
  const shopeeChatStore = useShopeeChatStore();
  const { sendMessage } = shopeeChatStore;

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
  const showAllBtn = () => {
    const detailSkuLength = props.orderData.detailsInfoDto.length;
    if (detailSkuLength > 2 && detailSkuLength !== toggleLen.value) {
      return true;
    }
    return false;
  };
  const showUpBtn = () => {
    const detailSkuLength = props.orderData.detailsInfoDto.length;
    if (detailSkuLength > 2 && detailSkuLength === toggleLen.value) {
      return true;
    }
    return false;
  };

  const packageDetailInfoList = ref([]);
  const logisticsStatus = ref();
  const popFunc = async (item) => {
    try {
      const { data } = await listOrderTraceApi(item);
      packageDetailInfoList.value = (data.trackingInfo || []).map(
        (item, index) => ({
          ...item,
          color: index === 0 ? '#d9001b' : ''
        })
      );
      logisticsStatus.value = data.logisticsStatus;
    } catch (err) {
      packageDetailInfoList.value = [];
      logisticsStatus.value = '';
      console.log('err :>> ', err);
    }
  };

  const sendOrder = (item) => {
    let message = {
      messageType: 'order',
      params: {
        orderSn: item.platOrderId
      },
      showData: {
        ...item,
        buyerOrSeller: 2,
        shopeeChatMsgOrderDto: {
          ...item,
          imgs: item.images,
          title: item.detailsInfoDto[0].itemTitle,
          platQuantity: item.amt,
          platOrderAmt: item.detailsInfoDto[0].detailOrderAmt,
          orderTimePlat: item.orderTime
        }
      }
    };
    sendMessage(message);
  };
</script>

<style lang="scss" scoped>
  // @import url('@/styles/variables.scss');
  .detail_title {
    font-size: 16px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .text_right {
    text-align: right;
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
  .vertical_center {
    display: flex;
    align-items: center;
  }
  .mt08 {
    margin-top: 8px;
  }
  .ml20 {
    margin-left: 20px;
  }
</style>
