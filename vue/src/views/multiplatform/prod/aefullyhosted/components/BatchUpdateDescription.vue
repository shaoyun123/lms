<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改描述"
      width="70%"
      style="height: 80%"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <div class="content">
        <div class="content_left">
          <div class="flex">
            <el-button
              type="primary"
              :loading="batchAdjustLoading"
              @click="handleBatchAdjust"
              >提交修改</el-button
            >
            <div class="submit_tips">
              (提交时自动同步至电脑描述, 无需其他操作)
            </div>
          </div>
          <vxe-table
            ref="tableRef"
            :data="tableData"
            border
            :row-config="{ isCurrent: true, isHover: true }"
            :column-config="{ resizable: true }"
            @cell-click="handleRowClick"
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column field="storeAcct" title="店铺" width="90" />
            <vxe-column field="productId" title="商品编号" width="90" />
            <vxe-column field="result" title="操作结果" width="180">
              <template #default="{ row }">
                <div :class="getResultClass(row.result)">
                  {{ getResultMsg(row) }}
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
        <div class="content_right">
          <DescInfo
            v-if="dialogVisible && descObj.mobileDesc"
            ref="descRef"
            :desc-obj="descObj"
            :full-table-data="fullTableData"
            @get-table-data="getTableData"
            @change-desc="changeDesc"
          />
          <div v-else class="tips">请选择数据</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, watch, computed } from 'vue';
  import DescInfo from './DescInfo.vue';
  import {
    batchGetTitleAndDetail,
    batchEditTDetail,
    getBatchResult
  } from '@/api/multiplatform/aesupportprod';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedPIdList: {
      type: Array,
      default: () => []
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
  const tableRef = ref(null);
  const newDesc = ref();
  const originDesc = ref();
  const needFresh = ref(false); // 关闭弹窗页面是否需要查询列表

  const tableDataLoading = ref(false);

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        handleSearch();
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
        needFresh.value = false;
        currentRow.value = {};
        currentIndex.value = -1;
        originDesc.value = null;
        descObj.value = {};
        newDesc.value = '';
        clearTimeout(timerId.value);
      }
    },
    { deep: true }
  );
  const currentRow = ref({}); // 当前行数据
  const currentIndex = ref(-1);

  // 点击表格行
  const handleRowClick = ({ row, column, rowIndex }) => {
    let selection = window.getSelection() || {};
    if (selection.type === 'Range') {
      return false;
    }

    if (descObj.value.mobileDesc) {
      const mobileDetail = currentRow.value.mobileDetail
        ? JSON.parse(currentRow.value.mobileDetail)
        : {};
      mobileDetail.moduleList = descObj.value.mobileDesc;
      currentRow.value.mobileDetail = JSON.stringify(mobileDetail);
      const webDetail = currentRow.value.webDetail
        ? JSON.parse(currentRow.value.webDetail)
        : {};
      webDetail.moduleList = descObj.value.pcDesc;
      currentRow.value.webDetail = JSON.stringify(webDetail);
    }

    if (column.type !== 'checkbox') {
      currentRow.value = row;
      currentIndex.value = rowIndex;

      descObj.value = {
        mobileDesc: row.mobileDetail
          ? JSON.parse(row.mobileDetail).moduleList
          : [],
        pcDesc: row.webDetail ? JSON.parse(row.webDetail).moduleList : []
      };
    }
  };

  // 查询详情
  const handleSearch = async () => {
    tableDataLoading.value = true;
    const { data } = await batchGetTitleAndDetail(props.checkedPIdList).finally(
      () => {
        tableDataLoading.value = false;
      }
    );
    tableData.value = data;
  };

  const descObj = ref({});

  // 获取table数据
  const fullTableData = ref([]);
  const getTableData = () => {
    const { fullData } = tableRef.value.getTableData();
    fullTableData.value = fullData;
  };

  // 改变描述
  const changeDesc = ({ type, val }) => {
    descObj.value[type] = val;
    const mobileDetail = JSON.parse(currentRow.value.mobileDetail);
    mobileDetail.moduleList = descObj.value.mobileDesc;
    currentRow.value.mobileDetail = JSON.stringify(mobileDetail);
  };

  // 批量调整
  const timerId = ref(null);
  const batchAdjustLoading = ref(false);
  const handleBatchAdjust = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据！');

    const list = JSON.parse(JSON.stringify(checkedList));

    let params = [];
    list.forEach((item) => {
      params.push({
        productId: item.productId,
        mobileDetail: item.mobileDetail,
        storeAcctId: item.storeAcctId
      });
    });

    try {
      batchAdjustLoading.value = true;
      const { data, msg } = await batchEditTDetail(params);
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
      type: 7,
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
  :deep(.el-dialog__body) {
    height: calc(100% - 54px);
    box-sizing: border-box;
    padding: 10px 20px 30px;
    overflow: hidden;
  }
  .content {
    height: 100%;
    overflow-y: auto;
    display: flex;
  }
  .content_right {
    max-width: 66%;
    flex: 1;
    margin-top: 10px;
    margin-left: 10px;
  }
  .tips {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 25px);
    margin-top: 25px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .flex {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .submit_tips {
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .color_success {
    color: #67c23a;
  }
  .color_error {
    color: #f56c6c;
  }
</style>
