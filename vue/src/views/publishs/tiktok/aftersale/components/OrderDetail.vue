<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="dialog_wrapper"
      title="售后详情"
      :align-center="true"
      :width="1000"
      :close-on-click-modal="false"
    >
      <div>
        <el-descriptions class="margin-top" :column="4" border size="default">
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">售后申请号</div>
            </template>
            {{ rowData.reverseOrderId }}</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">售后状态</div>
            </template>
            {{ rowData.reverseStatusValueCn }}</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">退款金额</div>
            </template>
            {{ rowData.refundTotal }}{{ rowData.currency }} ({{
              rowData.refundTotalCny
            }}&yen;)</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">售后类型</div>
            </template>
            {{ rowData.reverseTypeCn }}</el-descriptions-item
          >
          <el-descriptions-item v-if="queryType !== '0'"
            ><template #label>
              <div class="cell-item">截止时间</div>
            </template>
            {{
              transferDate(rowData.deadlineTime, false)
            }}</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">订单号</div>
            </template>
            {{ rowData.orderId }}</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">订单金额</div>
            </template>
            {{ rowData.platOrderAmt }}{{ rowData.currency }} ({{
              rowData.platOrderAmtCny
            }}&yen;)</el-descriptions-item
          >
        </el-descriptions>
        <el-divider content-position="left">退款记录</el-divider>
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in rowData.recordList"
            :key="item.updateTime"
            :color="index === 0 ? '#0bbd87' : ''"
            :timestamp="transferDate(item.updateTime)"
            placement="top"
          >
            <template
              v-if="
                item.reasonText ||
                item.additionalMessage ||
                item.additionalImageList?.length
              "
            >
              <el-collapse v-model="item.updateTimeKey">
                <el-collapse-item name="1" :title="item.description">
                  <!--  -->
                  <template v-if="item.reasonText">
                    <div class="detaill_record_title">Reason</div>
                    <div>{{ item.reasonText }}</div>
                  </template>
                  <template v-if="item.additionalMessage">
                    <div class="detaill_record_title">Additional message</div>
                    <div>{{ item.additionalMessage }}</div>
                  </template>
                  <!-- 图片 -->
                  <template v-if="item.additionalImageList?.length">
                    <ImagePop
                      v-for="(elem, elemIndex) in item.additionalImageList"
                      :key="elem + elemIndex"
                      :src="elem"
                    />
                  </template>
                </el-collapse-item>
              </el-collapse>
            </template>
            <div v-else>{{ item.description }}</div>
          </el-timeline-item>
        </el-timeline>

        <template
          v-if="
            rowData.reverseOrderItemList && rowData.reverseOrderItemList.length
          "
        >
          <el-divider content-position="left">退款商品</el-divider>
          <template
            v-for="item in rowData.reverseOrderItemList"
            :key="item.returnProductId"
          >
            <div class="refund_info">
              <ImagePop :src="item.productImages" />
              <el-descriptions :column="1" size="default"
                ><el-descriptions-item label="商品标题：">{{
                  item.returnProductName
                }}</el-descriptions-item>
                <el-descriptions-item label="product_id：">{{
                  item.returnProductId
                }}</el-descriptions-item>
                <el-descriptions-item label="seller_sku：">{{
                  item.sellerSku
                }}</el-descriptions-item>
                <el-descriptions-item label="售后数量：">{{
                  item.returnQuantity
                }}</el-descriptions-item></el-descriptions
              >
            </div>
          </template>
        </template>
      </div>
      <template #footer>
        <!-- 根据状态显示按钮-->
        <!-- 待处理/待收货/已拒绝 -->
        <el-button
          v-if="[1, 2, 4].includes(rowData.reverseStatusValue)"
          :loading="agreeLoading"
          type="primary"
          @click="handleAgree"
          >同意</el-button
        >
        <!-- 待处理/待收货 -->
        <el-button
          v-if="[1, 4].includes(rowData.reverseStatusValue)"
          @click="handleRefuse"
          >拒绝</el-button
        >
        <el-button @click="handleClose">关闭</el-button>
      </template>
    </el-dialog>
    <RefuseRefund
      v-model="refuseVisible"
      :row-data="rowData"
      :query-type="queryType"
      @fresh-data="freshData"
    />
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import RefuseRefund from './RefuseRefund.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import { confirmReverseApi } from '@/api/publishs/tiktokaftersale';
  import { transferDate } from '@/utils/common';
  import { ElMessage } from 'element-plus';
  // eslint-disable-next-line
  const props = defineProps({
    rowData: {
      type: Object,
      default: () => {}
    },
    modelValue: {
      type: Boolean,
      default: true
    },
    queryType: {
      type: String || Number,
      default: '0'
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleSearch']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  // 同意
  const agreeLoading = ref(false);
  const handleAgree = async () => {
    const { reverseOrderId, storeAcctId } = props.rowData;
    agreeLoading.value = true;
    try {
      const { msg } = await confirmReverseApi({ reverseOrderId, storeAcctId });
      agreeLoading.value = false;
      ElMessage.success(msg || '操作成功');
      freshData();
    } catch (err) {
      agreeLoading.value = false;
      console.log('err :>> ', err);
    }
  };

  // 申诉
  const refuseVisible = ref(false);
  const handleRefuse = () => {
    console.log('object :>> ', props.queryType);
    refuseVisible.value = true;
  };

  const handleClose = () => {
    dialogVisible.value = false;
  };
  const freshData = () => {
    dialogVisible.value = false;
    emits('handleSearch');
  };
</script>

<style lang="scss" scoped>
  // 弹窗
  .dialog_wrapper {
    :deep(.el-overlay-dialog) {
      overflow-y: hidden;
      height: calc(100% - 50px);
    }
    :deep(.el-dialog) {
      height: calc(100% - 50px);
    }
    :deep(.el-dialog__body) {
      overflow-y: scroll;
      height: calc(100% - 168px);
    }
  }
  .refund_info {
    display: flex;
    :deep(.el-image) {
      width: 100px;
      margin-right: 20px;
    }
  }
  .refund_info + .refund_info {
    margin-top: 10px;
  }
  .detaill_record_title {
    margin: 10px 0 5px 0;
    color: #909399;
    line-height: 1;
    font-size: 13px;
  }
</style>
