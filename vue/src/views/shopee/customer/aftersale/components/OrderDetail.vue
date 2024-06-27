<template>
  <div v-loading="loading">
    <el-dialog
      v-model="dialogVisible"
      title="售后详情"
      :close-on-click-modal="false"
      :width="1000"
    >
      <div>
        <el-descriptions class="margin-top" :column="4" border size="default">
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">售后申请号</div>
            </template>
            {{ rowData.returnSn }}</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">退款状态</div>
            </template>
            {{ rowData.statusCn }}</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">退款金额</div>
            </template>
            {{ rowData.refundAmount }}{{ rowData.currency }}({{
              rowData.refundAmountCNY
            }}&yen;)</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">少发金额</div>
            </template>
            {{ rowData.refundableAmount }}{{ rowData.currency }}({{
              rowData.refundableAmountCNY
            }}&yen;)</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">退款类型</div>
            </template>
            {{ rowData.reasonCn }}</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">退款差额</div>
            </template>
            {{ rowData.refundDifferenceAmount }}{{ rowData.currency }}({{
              rowData.refundDifferenceAmountCNY
            }}&yen;)</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">申请时间</div>
            </template>
            {{ rowData.returnCreateTime }}</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">截止时间</div>
            </template>
            {{ rowData.returnDueTime }}</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">订单号</div>
            </template>
            {{ rowData.orderId }}</el-descriptions-item
          >
          <el-descriptions-item
            ><template #label>
              <div class="cell-item">订单金额(&yen;)</div>
            </template>
            {{ rowData.amountBeforeDiscount }}{{ rowData.currency }}({{
              rowData.amountBeforeDiscountCNY
            }}&yen;)</el-descriptions-item
          >
        </el-descriptions>
        <el-divider content-position="left">买家退款理由</el-divider>
        <div class="refund_info">
          <el-popover
            placement="right"
            width="500px"
            :hide-after="0"
            trigger="hover"
          >
            <template #default>
              <el-image :src="rowData.returnImages || ''" />
            </template>
            <template #reference>
              <el-image
                v-if="rowData.returnImages"
                loading="lazy"
                :src="rowData.returnImages || ''"
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div> </template
              ></el-image>
            </template>
          </el-popover>
          <el-descriptions :column="1" size="default"
            ><el-descriptions-item label="退款原因：">{{
              rowData.textReason
            }}</el-descriptions-item></el-descriptions
          >
        </div>
        <template v-if="rowData.sub && rowData.sub.length">
          <el-divider content-position="left">退款商品</el-divider>
          <template v-for="item in rowData.sub" :key="item.id">
            <div class="refund_info">
              <el-popover
                placement="right"
                width="500px"
                :hide-after="0"
                trigger="hover"
              >
                <template #default>
                  <el-image :src="item.itemImages || ''">
                    <template #error>
                      <div class="image-slot">
                        <el-icon><icon-picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </template>
                <template #reference>
                  <el-image
                    v-if="item.itemImages"
                    loading="lazy"
                    :src="item.itemImages || ''"
                  />
                </template>
              </el-popover>
              <el-descriptions :column="1" size="default"
                ><el-descriptions-item label="店铺子SKU：">{{
                  item.variationSku
                }}</el-descriptions-item>
                <el-descriptions-item label="商品单价*订单数量："
                  >{{ rowData.currency }} {{ item.price }}*{{
                    item.amount
                  }}</el-descriptions-item
                >
                <el-descriptions-item label="商品标题：">{{
                  item.title
                }}</el-descriptions-item></el-descriptions
              >
            </div>
          </template>
        </template>
      </div>
      <template #footer>
        <!-- status为0表示待响应 -->
        <template v-if="!rowData.status && rowData.canDisputeOrAccept">
          <el-button type="primary" :loading="agreeLoading" @click="handleAgree"
            >同意退款</el-button
          >

          <el-button @click="handleAppeal">申诉</el-button>
        </template>
        <el-button @click="handleClose">关闭</el-button>
      </template>
    </el-dialog>
    <AppleDialog
      v-model="appealVisible"
      :dispute-reason-list="disputeReasonList"
      :row-data="rowData"
      :page-type="pageType"
    />
  </div>
</template>

<script setup>
  import { computed, watch, ref } from 'vue';
  import AppleDialog from './AppealDialog.vue';
  import { confirmRefund } from '@/api/shopee/aftersale';
  import { Picture as IconPicture } from '@element-plus/icons-vue';
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
    disputeReasonList: {
      type: Array,
      default: () => []
    },
    pageType: {
      type: String || Number,
      default: 0
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'delData', 'handleSearch']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const loading = ref(false);
  watch(
    () => props.modelValue,
    async (val) => {
      if (!val) appealVisible.value = val;
    }
  );

  const handleClose = () => {
    dialogVisible.value = false;
  };

  const agreeLoading = ref(false);
  const handleAgree = async () => {
    const { id, returnSn, storeAcctId } = props.rowData;
    agreeLoading.value = true;
    try {
      const { msg } = await confirmRefund({ id, returnSn, storeAcctId });
      agreeLoading.value = false;
      ElMessage.success(msg || '操作成功');
      dialogVisible.value = false;
      props.pageType === 0 ? emits('delData') : emits('handleSearch');
    } catch (err) {
      agreeLoading.value = false;
      console.log('err :>> ', err);
    }
  };

  // 申诉
  const appealVisible = ref(false);
  const handleAppeal = () => {
    appealVisible.value = true;
  };
</script>

<style lang="scss" scoped>
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
</style>
