<template>
  <div class="fullDialog">
    <el-dialog
      v-model="dialogVisible"
      width="800px"
      title="执行日志"
      :close-on-click-modal="false"
      destroy-on-close
      align-center
      @close="closeDialog"
    >
      <div>
        <div class="flex-end mb-10">
          <el-button type="primary" @click="handleBatchExportFailList({}, 0)"
            >批量导出失败数据</el-button
          >
        </div>
        <el-table
          :data="tableData"
          :loading="tableLoading"
          border
          :height="500"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column label="执行日期">
            <template #default="{ row }">
              {{ row.executeDay }}
            </template>
          </el-table-column>
          <el-table-column label="刊登成功数量" prop="successCount" />
          <el-table-column label="刊登失败数量" prop="failCount" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                :disabled="!row.failCount"
                type="primary"
                @click="handleBatchExportFailList(row, 1)"
                >导出失败数据</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="paginationData.page"
            v-model:page-size="paginationData.limit"
            :page-sizes="[50, 100, 300]"
            :small="true"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
  import {
    defineProps,
    defineEmits,
    reactive,
    ref,
    watch,
    computed
  } from 'vue';
  import { ElMessage } from 'element-plus';
  import { transBlob } from '@/utils/downloadFile';
  import { listExecuteLogApi } from '@/api/publishs/tiktokpublishrules';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    logInfo: {
      type: Object,
      default: () => {}
    }
  });
  const emit = defineEmits(['update:modelValue']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emit('update:modelValue', val);
    }
  });

  watch(
    () => dialogVisible.value,
    (val) => {
      if (val) {
        getOperationLogList();
      }
    }
  );

  const total = ref(0);
  const paginationData = reactive({
    page: 1,
    limit: 50
  });

  // 获取日志列表
  const tableData = ref([]);
  const tableLoading = ref(false);
  const getOperationLogList = async () => {
    try {
      const { data } = await listExecuteLogApi({
        id: props.logInfo.id,
        ...paginationData
      });
      tableData.value = data;
      total.value = data.length;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  //获取选中数据
  const checkedList = ref([]);
  const handleSelectionChange = (selection) => {
    checkedList.value = selection;
  };

  // 导出失败数据
  const handleBatchExportFailList = async (row = {}, type) => {
    if (!type && !checkedList.value.length) {
      return ElMessage.warning('请选择数据！');
    }
    // type 1单个 0批量
    let checkedIdList = [];
    if (type) {
      checkedIdList = [row.id];
    } else {
      checkedIdList = checkedList.value.map((item) => item.id);
    }

    tableLoading.value = true;
    const ruleName = props.logInfo.ruleName;
    transBlob({
      url: '/lms/tiktok/autoListingRule/exportExecuteLog',
      data: checkedIdList,
      fileName: type
        ? `${ruleName + ' ' + row.executeDay}`
        : `${ruleName} ` + '.xls'
    }).finally(() => {
      tableLoading.value = false;
      ElMessage.success('下载成功');
    });
  };

  // 分页
  const handleSizeChange = (val) => {
    paginationData.limit = val;
    getOperationLogList();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    getOperationLogList();
  };

  const closeDialog = () => {
    dialogVisible.value = false;
  };
</script>
<style scoped lang="scss">
  .fullDialog {
    :deep(.el-dialog__body) {
      overflow-y: auto;
      max-height: calc(100vh - 260px);
    }
  }
  .flex-end {
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
</style>
