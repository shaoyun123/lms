<template>
  <el-dialog
    :model-value="showDialog"
    width="85%"
    align-center
    title="采购确认"
    @close="closeDialog"
  >
    <div class="content">
      <div class="flex-end">
        <el-form size="default" status-icon :model="mulSetting" :inline="true">
          <b class="mr-8">批量填写</b>
          <el-form-item label="压价后价格(￥)">
            <ZInputNumber
              v-model="mulSetting.forcePrice"
              :precision="2"
              clearable
              style="width: 80px"
              :min="0"
              size="small"
            />
          </el-form-item>
          <el-form-item label="是否包邮" style="margin-left: 25px">
            <el-select
              v-model="mulSetting.freeShip"
              class="m-2"
              style="width: 100px"
              size="small"
            >
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="预计到货时间" prop="predictAogTime">
            <el-date-picker
              v-model="mulSetting.predictAogTime"
              type="date"
              value-format="YYYY-MM-DD"
              range-separator="-"
              :disabled-date="predictAogTimeDisableDate"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="mulSetting.buyerRemark"
              maxlength="200"
              :rows="1"
              type="textarea"
              clearable
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
        <vxe-column field="warehouseName" title="备货仓库">
          <template #default="{ row }">
            <div>{{ row.warehouseName }}</div>
          </template>
        </vxe-column>
        <vxe-column field="prodSSku" title="商品SKU">
          <template #default="{ row }">
            <div>{{ row.prodSSku }}</div>
          </template>
        </vxe-column>
        <vxe-column field="inventoryQuantity" title="需要采购数量" />
        <vxe-column field="purchaseCostPrice" title="商品成本(￥)" />
        <vxe-column field="targetPrice" title="目标价格(￥)" />
        <vxe-column field="forcePrice" width="150">
          <template #header>
            <span class="text-red">*</span>压价后价格(￥)
          </template>
          <template #default="{ row }">
            <ZInputNumber v-model="row.forcePrice" :precision="2" :min="0" />
          </template>
        </vxe-column>
        <vxe-column field="freeShip">
          <template #header> <span class="text-red">*</span>是否包邮 </template>
          <template #default="{ row }">
            <el-select v-model="row.freeShip" class="m-2" size="small">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </template>
        </vxe-column>
        <vxe-column field="predictAogTime">
          <template #header>
            <span class="text-red">*</span>预计到货时间
          </template>
          <template #default="{ row }">
            <el-date-picker
              v-model="row.predictAogTime"
              style="width: 100%"
              type="date"
              value-format="YYYY-MM-DD"
              range-separator="-"
              :disabled-date="predictAogTimeDisableDate"
            />
          </template>
        </vxe-column>
        <vxe-column field="buyerRemark" title="采购备注" width="180">
          <template #default="{ row }">
            <el-input
              v-model="row.buyerRemark"
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
        <el-button type="primary" @click="handleSubmit">确认</el-button>
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
  import { buyerConfirmApi } from '@/api/multiplatform/platformstockup';
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
    tableData.value = cloneDeep(props.checkedList);
  });

  // 预计到货时间 今天以及将来
  const predictAogTimeDisableDate = (time) => {
    return time.getTime() < Date.now() - 8.64e7;
  };

  const mulSetting = reactive({
    forcePrice: '', // 压价后价格
    freeShip: '', // 是否包邮
    predictAogTime: '', // 时间
    buyerRemark: '' // 备注
  });

  // 一键应用
  const handleSet = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请至少选择一条数据！');
    }

    let obj = {
      forcePrice: '', // 压价后价格
      freeShip: '', // 是否包邮
      predictAogTime: '', // 时间
      buyerRemark: '' // 备注
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
      forcePrice: '', // 压价后价格
      freeShip: '', // 是否包邮
      predictAogTime: '', // 时间
      buyerRemark: '' // 备注
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
    const resultKey = ['forcePrice', 'freeShip', 'predictAogTime'];

    const isRequiredFieldFilled = (item) => {
      return resultKey.every((key) => {
        if (key === 'freeShip' && item[key] === 0) {
          return true;
        }
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
    // 压价后价格 必须大于0
    const isPositiveNumber = checkedList.every((item) => {
      return Number(item.forcePrice) > 0;
    });
    if (!isPositiveNumber) {
      return ElMessage.warning('压价后价格必须是正数！');
    }

    // 验证其他必填项
    if (!verifyForm()) {
      return ElMessage.warning('必填项请填写完整！');
    }

    const paramsList = checkedList.map((item) => {
      return {
        orderIds: item.detailList.map((detail) => detail.id).flat(),
        salespersonRemark: item.salespersonRemark,
        forcePrice: item.forcePrice,
        freeShip: item.freeShip,
        predictAogTime: item.predictAogTime,
        buyerRemark: item.buyerRemark
      };
    });
    const { code, msg } = await buyerConfirmApi(paramsList);
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
