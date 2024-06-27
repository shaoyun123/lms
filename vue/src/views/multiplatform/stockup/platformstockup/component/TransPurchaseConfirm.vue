<template>
  <el-dialog
    :model-value="showDialog"
    width="55%"
    align-center
    title="转待采购确认"
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
              :precision="1"
              clearable
              style="width: 80px"
              :min="0"
              size="small"
            />
          </el-form-item>
          <el-form-item label="备货数量">
            <ZInputNumber
              v-model="mulSetting.inventoryQuantity"
              :precision="0"
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
        :row-config="{ keyField: 'id' }"
        border
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺"> </vxe-column>
        <vxe-column field="salesperson" title="销售"> </vxe-column>
        <vxe-column field="prodSSku" title="商品子sku" />
        <vxe-column field="purchaseCostPrice" title="采购价(￥)" />
        <vxe-column field="targetPrice" title="目标价(￥)">
          <template #default="{ row }">
            <ZInputNumber
              v-model="row.targetPrice"
              :precision="2"
              clearable
              style="width: 80px"
              :min="0"
              size="small"
            />
          </template>
        </vxe-column>
        <vxe-column field="inventoryDay" title="备货天数">
          <template #default="{ row }">
            <ZInputNumber v-model="row.inventoryDay" :precision="1" :min="0" />
          </template>
        </vxe-column>
        <vxe-column field="inventoryQuantity" title="备货数量">
          <template #header> <span class="text-red">*</span>备货数量 </template>
          <template #default="{ row }">
            <ZInputNumber
              v-model="row.inventoryQuantity"
              :precision="2"
              :min="1"
            />
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
  import { cloneDeep } from 'lodash-es';
  import { cancelToBuyerConfirm } from '@/api/multiplatform/platformstockup';
  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    checkedList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['close', 'success']);

  const tableData = ref([]);
  const tableRef = ref(null);

  onMounted(() => {
    // 销售备注初始为空
    tableData.value = cloneDeep(props.checkedList).map((item) => {
      item.salespersonRemark = '';
      return item;
    });
  });

  const mulSetting = reactive({
    targetPrice: '', // 目标价
    inventoryDay: '', // 备货天数
    inventoryQuantity: '' // 备货数量
  });

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

    // 备货天数、目标价格 非必填可以为空 但填了得要校验大于0
    const allGreaterThanZeroInventoryDay = checkedList
      .filter(
        (item) => item.inventoryDay !== undefined && item.inventoryDay !== ''
      )
      .every((item) => item.inventoryDay > 0);
    if (!allGreaterThanZeroInventoryDay) {
      return ElMessage.warning('填写的备货天数必须>0！');
    }

    const allGreaterThanZeroTargetPrice = checkedList
      .filter(
        (item) => item.targetPrice !== undefined && item.targetPrice !== ''
      )
      .every((item) => item.targetPrice > 0);
    if (!allGreaterThanZeroTargetPrice) {
      return ElMessage.warning('填写的目标价必须>0！');
    }

    // 验证其他必填项
    if (!verifyForm()) {
      return ElMessage.warning('请填写备货数量！');
    }

    const { code, msg } = await cancelToBuyerConfirm(checkedList);
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
  b {
    font-weight: bold;
  }
  .flex-end {
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .mr-8 {
    margin-right: 8px;
  }
  .text-red {
    color: #f56c6c;
  }
</style>
