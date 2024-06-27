<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改欧盟责任人"
      width="50%"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <div class="flex">
        <div>
          <el-select
            v-model="msrEuId"
            filterable
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in EUResponseOption"
              :key="item.msrEuId"
              :label="item.msrEuName"
              :value="item.msrEuId"
            />
          </el-select>
          <el-button type="primary" class="ml-8" @click="handleAsyncEU"
            >同步</el-button
          >
        </div>
        <el-button
          type="primary"
          :loading="batchAdjustLoading"
          @click="handleBatchAdjust"
          >提交修改</el-button
        >
      </div>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="600"
        border
        :loading="tableDataLoading"
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺" width="150" />
        <vxe-column field="productId" title="商品编号" width="150" />
        <vxe-column field="msrEuName" title="原欧盟责任人" />
        <vxe-column field="result" title="操作结果" width="180">
          <template #default="{ row }">
            <div :class="getResultClass(row.result)">
              {{ getResultMsg(row) }}
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, watch, computed } from 'vue';
  import {
    getBatchResult,
    getEUCategory,
    synchronizationEU,
    batchGetMsrEuList,
    batchEditMsrEu
  } from '@/api/multiplatform/aesupportprod';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedPIdList: {
      type: Array,
      default: () => []
    },
    responseParams: {
      type: Object,
      default: () => {}
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
  const tableData = ref([]);
  const tableRef = ref();

  const needFresh = ref(false); // 关闭弹窗页面是否需要查询列表

  const tableDataLoading = ref(false);
  const msrEuId = ref('');

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        msrEuId.value = '';
        getEUResponseOption();
        handleSearch();
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
        needFresh.value = false;
        clearTimeout(timerId.value);
      }
    }
  );

  // 获取欧盟责任人枚举
  const EUResponseOption = ref([]);
  const getEUResponseOption = async () => {
    const { data } = await getEUCategory({
      storeAcctId: props.responseParams.storeAcctId
    });

    EUResponseOption.value = data;
  };

  // 点击同步
  const handleAsyncEU = async () => {
    const leafCategoryIdList = props.responseParams.leafCategoryIdList;
    const res = await synchronizationEU({
      storeAcctId: props.responseParams.storeAcctId,
      leafCategoryIdList
    });
    ElMessage.success(res.msg);
  };

  // 获取列表
  const handleSearch = async () => {
    tableDataLoading.value = true;
    const { data } = await batchGetMsrEuList({
      productIds: props.checkedPIdList,
      ...props.responseParams
    }).finally(() => (tableDataLoading.value = false));
    tableData.value = data;
  };

  // 提交修改
  const timerId = ref(null);
  const batchAdjustLoading = ref(false);
  const handleBatchAdjust = async () => {
    if (msrEuId.value === '') {
      return ElMessage.warning('请选择欧盟责任人!');
    }
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据!');

    let params = [];
    checkedList.forEach((item) => {
      params.push({
        productId: item.productId,
        storeAcctId: item.storeAcctId,
        msrEuId: msrEuId.value
      });
    });
    try {
      batchAdjustLoading.value = true;
      const { data, msg } = await batchEditMsrEu(params);
      needFresh.value = true;
      ElMessage.warning(msg);
      timerId.value = setInterval(() => {
        getOperateResult(data);
      }, 1000);
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batchAdjustLoading.value = false;
    }
  };

  // 查询操作结果
  const getOperateResult = async (batchNo) => {
    const { data } = await getBatchResult({
      type: 8,
      batchNo: batchNo
    });
    data.forEach((item) => {
      const index = tableData.value.findIndex(
        (el) => el.productId === item.productId
      );
      if (index > -1) {
        tableData.value[index].result = item.result;
        tableData.value[index].errorMsg = item.errorMsg || '';
      }
    });
    const isEnd = data.every((item) => {
      return item.result === -1 || item.result === 1;
    });
    if (isEnd) {
      clearTimeout(timerId.value);
    }
  };

  const getResultMsg = (row) => {
    if (row.result === 0) return '修改中...';
    if (row.result === 1) return '修改成功';
    if (row.result === -1) return `修改失败 ${row.errorMsg}`;
  };

  const getResultClass = (result) => {
    if (result === 0) return '';
    if (result === 1) return 'color_success';
    if (result === -1) return 'color_error';
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .ml-8 {
    margin-left: 8px;
  }
  .color_success {
    color: #67c23a;
  }
  .color_error {
    color: #f56c6c;
  }
</style>
