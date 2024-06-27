<template>
  <el-dialog
    :model-value="showDialog"
    width="88%"
    align-center
    title="申请采购备货"
    @close="closeDialog"
  >
    <div class="content">
      <div class="flex-end">
        <el-form size="default" status-icon :model="mulSetting" :inline="true">
          <el-form-item label="目标价">
            <ZInputNumber
              v-model="mulSetting.targetPrice"
              :precision="2"
              clearable
              style="width: 80px"
              :min="0"
              size="small"
            />
          </el-form-item>
          <el-form-item label="备货天数">
            <ZInputNumber
              v-model="mulSetting.inventoryDay"
              clearable
              style="width: 80px"
              :min="0"
              :precision="1"
              size="small"
            />
          </el-form-item>
          <el-form-item label="备货数量">
            <ZInputNumber
              v-model="mulSetting.inventoryQuantity"
              clearable
              style="width: 80px"
              :min="1"
              size="small"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-left: 10px"
              type="primary"
              size="small"
              @click="handleSet()"
              >一键应用</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <vxe-table
        ref="tableRef"
        height="550"
        show-overflow
        :data="tableData"
        :row-config="{ keyField: 'id+prodSSku' }"
        border
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺"> </vxe-column>
        <vxe-column field="salesperson" title="销售"> </vxe-column>
        <vxe-column field="sellerSkuCode" title="店铺子SKU"> </vxe-column>
        <vxe-column field="prodSSku" title="商品子sku" width="100" />
        <vxe-column title="建议备货" />
        <vxe-column field="shipmentWaitNum" title="货件计划">
          <template #default="{ row }">
            <div>
              <div>待发: {{ row.shipmentWaitNum }}</div>
              <div>缺货: {{ row.shipmentOutOfNum }}</div>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="availableStock" title="中转仓可用/在途/未派">
          <template #default="{ row }">
            <div>
              {{ row.availableStock }}/{{ row.orderNotInNum }}/{{
                row.lackUnPaiNum
              }}
            </div>
          </template>
        </vxe-column>
        <vxe-column field="orderStateName" title="已申请采购备货" width="140">
          <template #default="{ row }">
            <div
              v-if="
                row.stockUpSkuGroupDtoList && row.stockUpSkuGroupDtoList.length
              "
            >
              <div
                v-for="(item, index) in row.stockUpSkuGroupDtoList"
                :key="index"
              >
                {{ item.orderStateName }}:{{ item.detailCount }}
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="todaySaleVolume" title="今日/7天/30天销量">
          <template #default="{ row }">
            <div
              v-if="
                row.todaySaleVolume !== undefined &&
                row.lastSevenDaysSaleVolume !== undefined &&
                row.lastThirtyDaysSaleVolume !== undefined
              "
            >
              {{ row.todaySaleVolume }}/{{ row.lastSevenDaysSaleVolume }}/{{
                row.lastThirtyDaysSaleVolume
              }}
            </div>
          </template>
        </vxe-column>
        <vxe-column field="onSalesDurationOffline" title="加入站点时长">
          <template #default="{ row }">
            <div v-if="row.onSalesDurationOffline !== undefined">
              {{ row.onSalesDurationOffline }}天
            </div>
          </template>
        </vxe-column>
        <vxe-column field="mark" title="评分">
          <template #default="{ row }">
            <div v-if="row.mark !== undefined">{{ row.mark }}分</div>
          </template>
        </vxe-column>
        <vxe-column field="afsScore" title="品质分">
          <template #default="{ row }">
            <div>{{ row.afsScore }}</div>
          </template>
        </vxe-column>
        <vxe-column field="purchaseCostPrice" title="采购价(￥)" />
        <vxe-column field="targetPrice" title="目标价(￥)">
          <template #default="{ row }">
            <ZInputNumber v-model="row.targetPrice" :min="1" :precision="2" />
          </template>
        </vxe-column>
        <vxe-column field="inventoryDay" title="备货天数">
          <template #default="{ row }">
            <ZInputNumber v-model="row.inventoryDay" :min="0" :precision="1" />
          </template>
        </vxe-column>
        <vxe-column field="inventoryQuantity" title="备货数量">
          <template #header> <span class="text-red">*</span>备货数量 </template>
          <template #default="{ row }">
            <ZInputNumber v-model="row.inventoryQuantity" :min="1" />
          </template>
        </vxe-column>
        <vxe-column field="salespersonRemark" title="销售备注" width="180">
          <template #default="{ row }">
            <el-input
              v-model="row.salespersonRemark"
              type="textarea"
              clearable
              :rows="1"
              size="small"
              maxlength="200"
              show-word-limit
            />
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { onMounted, ref, reactive } from 'vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { ElMessage } from 'element-plus';
  import { listByStockUpApi, saveOrderApi } from '@/api/multiplatform/temuprod';
  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    checkedIdList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['close', 'success']);

  const tableData = ref([]);
  const tableRef = ref(null);

  onMounted(() => {
    getTableList();
  });

  const mulSetting = reactive({
    targetPrice: '', // 目标价
    inventoryDay: '', // 备货天数
    inventoryQuantity: '' // 备货数量
  });

  // 获取列表
  const getTableList = async () => {
    const { data } = await listByStockUpApi(props.checkedIdList);
    tableData.value = data;
  };

  // 一键应用
  const handleSet = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请至少选择一条数据！');
    }

    let obj = {
      targetPrice: '', // 目标价
      inventoryDay: '', // 备货天数
      inventoryQuantity: '' // 备货数量
    };

    Object.keys(obj).forEach((key) => {
      checkedList.forEach((cItem) => {
        // 给表单中有值的赋值
        if (
          mulSetting[key] !== '' &&
          mulSetting[key] !== null &&
          mulSetting[key] !== undefined
        ) {
          cItem[key] = mulSetting[key];
        }
      });
    });
  };

  // 清空表单
  const resetForm = () => {
    let obj = {
      targetPrice: '', // 目标价
      inventoryDay: '', // 备货天数
      inventoryQuantity: '' // 备货数量
    };
    Object.keys(obj).forEach((key) => {
      Object.keys(mulSetting).forEach((mulKey) => {
        if (key === mulKey) {
          mulSetting[mulKey] = obj[key];
        }
      });
    });
  };

  // 验证必填
  const verifyForm = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    const resultKey = ['inventoryQuantity'];

    const isRequiredFieldFilled = (item) => {
      return resultKey.every((key) => {
        return item[key];
      });
    };
    return checkedList.every(isRequiredFieldFilled);
  };

  // 点击确认
  const handleSubmit = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请至少选择一条数据！');
    }
    // 备货天数非必填 填了得要校验大于0
    const allGreaterThanZero = checkedList
      .filter(
        (item) => item.inventoryDay !== undefined && item.inventoryDay !== ''
      )
      .every((item) => item.inventoryDay > 0);
    if (!allGreaterThanZero) {
      return ElMessage.warning('填写的备货天数必须>0！');
    }

    // 备货数量必填
    if (!verifyForm()) {
      return ElMessage.warning('请填写备货数量！');
    }

    const params = checkedList.map((item) => {
      return {
        ...item,
        platCode: 'temu'
      };
    });

    const { code, msg } = await saveOrderApi(params);
    if (code === '0000') {
      ElMessage.success(msg);
      emits('success');
    } else {
      ElMessage.warning(msg);
    }
  };

  const closeDialog = () => {
    emits('close');
    resetForm();
  };
</script>

<style lang="scss" scoped>
  .flex-end {
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .text-red {
    color: #f56c6c;
  }
</style>
