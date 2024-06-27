<template>
  <el-dialog
    :model-value="showDialog"
    title="调拨采购"
    width="90%"
    align-center
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <div>
      <div class="query_header">
        <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="仓库名称" prop="warehouseName">
            <el-select
              v-model="form.warehouseName"
              filterable
              clearable
              @change="changeWarehouseName"
            >
              <el-option
                v-for="item in platStoreList"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="tool_btn">
          <el-button type="primary" @click="handleSubmit">调拨采购</el-button>
        </div>
      </div>
      <vxe-table
        ref="tableDataRef"
        border
        show-overflow
        keep-source
        :data="tableData"
        :edit-rules="validRules"
        :edit-config="{ trigger: 'dblclick', mode: 'cell', showStatus: true }"
        height="550"
        :column-config="{ resizable: true }"
        :scroll-y="{ enabled: false }"
        :cell-style="cellStyle"
      >
        <vxe-column type="checkbox" width="50"></vxe-column>
        <vxe-column field="ssku" title="商品sku">
          <template #default="{ row }">
            {{ row.ssku }}
          </template>
        </vxe-column>
        <vxe-column field="platCode" title="平台">
          <template #default="{ row }">
            <div>
              {{ row.platCode?.split(',')?.join(' ') || '' }}
            </div>
          </template>
        </vxe-column>
        <vxe-column
          field="defaultWareHouseAvailableStock"
          title="义乌仓可用"
          width="100"
          sortable
        ></vxe-column>
        <vxe-column
          field="defaultWareHousePreAvailableStock"
          title="义乌仓可用(含在途)"
          width="110"
          sortable
        ></vxe-column>
        <vxe-column
          field="unAuditItemsNum"
          title="义乌仓未审核采购单商品数量"
          sortable
        ></vxe-column>
        <vxe-column title="义乌仓7/15/30天销量" field="sales7th" sortable>
          <template #default="{ row }">
            {{ row.sales7th || 0 }} / {{ row.sales15th || 0 }} /
            {{ row.sales30th || 0 }}
          </template>
        </vxe-column>
        <vxe-column title="jit7/15/30天销量" field="jit7" sortable>
          <template #default="{ row }">
            {{ row.jit7 || 0 }} / {{ row.jit15 || 0 }} /
            {{ row.jit30 || 0 }}
          </template>
        </vxe-column>
        <vxe-column
          field="transitDay"
          title="义乌仓周转天数"
          sortable
        ></vxe-column>
        <vxe-column
          field="transitDayWithOutJit"
          title="义乌仓周转天数(排除jit)"
          sortable
        ></vxe-column>
        <vxe-column
          field="platWhStock"
          title="目的仓可用"
          sortable
        ></vxe-column>
        <vxe-column
          field="platOnwayStock"
          title="目的仓在途"
          sortable
        ></vxe-column>
        <vxe-column
          field="platWhPreAvailableStock"
          title="目的仓预计可用(含在途)"
          sortable
        ></vxe-column>
        <vxe-column
          field="platWhUnAuditItemsNum"
          title="目的仓未审核采购单商品数量"
          sortable
        ></vxe-column>
        <vxe-column field="totalPlanQuantity" title="需要备货数"></vxe-column>
        <vxe-column
          field="needBorrow"
          title="需要调拨数"
          width="110"
          sortable
          :edit-render="{ name: 'input' }"
          :filters="[{}]"
          :filter-method="filterRange"
          :filter-reset-method="filterResetRange"
        >
          <template #filter="{ column, $panel }">
            <div
              v-for="(option, index) in column.filters"
              :key="index"
              class="flex_between m-10"
            >
              <ZInputNumber
                v-model="option.min"
                :precision="2"
                placeholder=">="
                class="w-80"
                @input="$panel.changeOption($event, true, option)"
              /><span class="m-10">-</span>
              <ZInputNumber
                v-model="option.max"
                :precision="2"
                placeholder="<="
                class="w-80"
                @input="$panel.changeOption($event, true, option)"
              />
            </div>
          </template>
        </vxe-column>
        <vxe-column
          field="needPurchase"
          width="110"
          title="需要采购数"
          sortable
          :edit-render="{ name: 'input' }"
          :filters="[{}]"
          :filter-method="filterRange"
          :filter-reset-method="filterResetRange"
        >
          <template #filter="{ column, $panel }">
            <div
              v-for="(option, index) in column.filters"
              :key="index"
              class="flex_between m-10"
            >
              <ZInputNumber
                v-model="option.min"
                :precision="2"
                placeholder=">="
                class="w-80"
                @input="$panel.changeOption($event, true, option)"
              /><span class="m-10">-</span>
              <ZInputNumber
                v-model="option.max"
                :precision="2"
                placeholder="<="
                class="w-80"
                @input="$panel.changeOption($event, true, option)"
              />
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <template #footer>
      <span>
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { defineProps, defineEmits, ref, reactive, onMounted } from 'vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { getRepoName } from '@/api/multiplatform/shipmentaccess';
  import {
    searchTransferAndPurOrderApi,
    transferAndPurOrderApi
  } from '@/api/multiplatform/platformstockup';
  import { ElMessage } from 'element-plus';

  const emit = defineEmits(['close', 'done']);

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    checkedAllotIdList: {
      type: Array,
      default: () => []
    },
    checkedStockWarehouse: {
      type: String,
      default: ''
    }
  });

  const rules = reactive({
    warehouseName: [
      { required: true, message: '请选择仓库名称', trigger: 'blur' }
    ]
  });

  // 校验调拨数和采购数
  const validRules = ref({
    needBorrow: [
      { required: true, message: '请输入需要调拨数' },
      {
        validator({ cellValue, row }) {
          return new Promise((resolve, reject) => {
            if (
              Number(cellValue || 0) + Number(row.needPurchase || 0) !==
              Number(row.totalPlanQuantity)
            ) {
              reject(new Error('数量错误！'));
            } else if (
              Number(cellValue || 0) >
              Number(row.defaultWareHouseAvailableStock || 0)
            ) {
              reject(new Error('数量错误！'));
            } else {
              resolve();
            }
          });
        }
      }
    ],
    needPurchase: [
      { required: true, message: '请输入需要采购数' },
      {
        validator({ cellValue, row }) {
          return new Promise((resolve, reject) => {
            if (
              Number(cellValue || 0) + Number(row.needBorrow || 0) !==
              Number(row.totalPlanQuantity)
            ) {
              reject(new Error('数量错误！'));
            } else {
              resolve();
            }
          });
        }
      }
    ]
  });

  onMounted(() => {
    form.warehouseName = props.checkedStockWarehouse;
    getRepoNameList();
  });

  const form = reactive({
    warehouseName: ''
  });

  const tableDataRef = ref(null);

  const cellStyle = ({ column }) => {
    if (
      column.field === 'defaultWareHouseAvailableStock' ||
      column.field === 'platWhStock'
    ) {
      return {
        backgroundColor: 'rgb(255, 247, 228)'
      };
    }
    if (
      column.field === 'defaultWareHousePreAvailableStock' ||
      column.field === 'platWhPreAvailableStock'
    ) {
      return {
        backgroundColor: 'rgb(231, 244, 255)'
      };
    }
    if (
      column.field === 'unAuditItemsNum' ||
      column.field === 'platWhUnAuditItemsNum'
    ) {
      return {
        backgroundColor: 'rgb(255, 228, 228)'
      };
    }
    if (column.field === 'totalPlanQuantity') {
      return {
        backgroundColor: 'rgb(255, 184, 0)'
      };
    }
  };

  // 需要采购/调拨数筛选
  const filterRange = ({ option, cellValue }) => {
    const { min, max } = option;
    if ([null, undefined].includes(min)) {
      if (cellValue <= max) {
        return true;
      }
    } else if ([null, undefined].includes(max)) {
      if (cellValue >= min) {
        return true;
      }
    } else if (
      ![null, undefined].includes(min) &&
      ![null, undefined].includes(max)
    ) {
      if (cellValue <= max && cellValue >= min) {
        return true;
      }
    }
    return false;
  };
  const filterResetRange = ({ options }) => {
    options[0].min = null;
    options[0].max = null;
  };

  // 获取仓库名称枚举
  const platStoreList = ref([]);
  const getRepoNameList = async () => {
    try {
      const { code, data } = await getRepoName();
      if (code === '0000') {
        platStoreList.value = data || [];
        if (props.checkedStockWarehouse) {
          getTableList();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取查询列表
  const tableData = ref([]);
  const getTableList = async () => {
    try {
      const { code, data } = await searchTransferAndPurOrderApi({
        orderIds: props.checkedAllotIdList,
        ...form
      });
      if (code === '0000') {
        tableData.value = data || [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 改变仓库下拉框选择
  const changeWarehouseName = (val) => {
    if (val) {
      getTableList();
    } else {
      tableData.value = [];
    }
  };

  // 提交调拨
  const handleSubmit = async () => {
    const $table = tableDataRef.value;
    const selectRecords = $table.getCheckboxRecords();

    if ($table) {
      if (!selectRecords.length) {
        return ElMessage.warning('请选择数据！');
      } else {
        const errMap = await $table.validate(selectRecords);
        if (errMap) {
          // 如果存在某一行不符合调拨+采购等于备货数
          const isAllsatisfySum = selectRecords.every(
            (item) =>
              Number(item.totalPlanQuantity) ===
              Number(item.needPurchase || 0) + Number(item.needBorrow || 0)
          );
          if (!isAllsatisfySum) {
            ElMessage.warning('调拨和采购之和不等于需要备货数，请重新检查！');
          }

          // 如果存在调拨数量大于义乌仓可用库存
          const isAllsatisfyMorethan = selectRecords.every(
            (item) =>
              Number(item.defaultWareHouseAvailableStock) >=
              Number(item.needBorrow || 0)
          );
          if (!isAllsatisfyMorethan) {
            ElMessage.warning('调拨数量大于义乌仓可用库存，请重新填写！');
          }
        } else {
          // 校验通过
          const { code, msg } = await transferAndPurOrderApi(selectRecords);
          if (code === '0000') {
            ElMessage.success(msg);
            emit('done');
          }
        }
      }
    }
  };

  const closeDialog = () => {
    emit('close');
  };
</script>
<style scoped lang="scss">
  .query_header {
    display: flex;
    justify-content: center;
    position: relative;
    align-items: center;
  }
  .tool_btn {
    position: absolute;
    top: 0;
    right: 0;
  }
  .flex_between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .m-10 {
    margin: 10px;
  }
  .ml-10 {
    margin-left: 10px;
  }
  .w-80 {
    width: 80px;
  }
  :deep(.vxe-table--body .vxe-body--column .vxe-cell--valid) {
    width: 100px !important;
  }
</style>
