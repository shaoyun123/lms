<template>
  <el-dialog
    v-model="dialogVisible"
    title="执行日志"
    width="850px"
    :align-center="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <vxe-grid ref="tableRef" v-bind="gridOptions" :scroll-y="{ gt: 10 }">
      <template #header_condition_title>
        <div>{{ props.operType == 1 ? '下架条件' : '删除条件' }}</div>
      </template>
      <template #delete_condition="{ row }">
        <rowTooltips :info="row.ruleDetail"></rowTooltips>
      </template>

      <template #exe_time="{ row }">
        {{ transferDate(row.createTime) }}
      </template>
      <template #header_success_title>
        <div>{{ props.operType === 1 ? '下架成功数量' : '删除成功数量' }}</div>
      </template>
      <template #header_fail_title>
        <div>{{ props.operType === 1 ? '下架失败数量' : '删除失败数量' }}</div>
      </template>

      <template #operator="{ row }">
        <el-button type="primary" @click="exportLog(row)">导出</el-button>
      </template>
      <template #toolbar_tools>
        <el-button type="primary" @click="exportAllLogs">全部导出</el-button>
      </template>
      <template #pager>
        <vxe-pager
          v-model:current-page="formData.page"
          v-model:page-size="formData.limit"
          :layouts="[
            'Sizes',
            'PrevPage',
            'Number',
            'NextPage',
            'FullJump',
            'Total'
          ]"
          :page-sizes="[50, 100, 150]"
          :total="totalCount"
          @page-change="handlePageChange"
        >
        </vxe-pager>
      </template>
    </vxe-grid>
  </el-dialog>
</template>

<script setup>
  import { transferDate } from '@/utils/common';
  import rowTooltips from '@/components/RowTooltips/index.vue';
  import { ref, reactive, computed, watch } from 'vue';
  import { searchRuleLog } from '@/api/publishs/fbmdeletelisting';
  import { transBlob } from '@/utils/downloadFile';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: () => null
    },
    operType: {
      type: Number,
      default: () => null
    }
  });
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const formData = reactive({
    ruleId: props.id,
    page: 1,
    limit: 50
  });

  const totalCount = ref(0);
  const loading = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        formData.ruleId = props.id;
        getLogList();
      } else {
        handleClose();
      }
    }
  );

  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showOverflow: true,
    loading: false,
    height: 600,
    rowConfig: {
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    toolbarConfig: {
      slots: {
        tools: 'toolbar_tools'
      }
    },
    columns: [
      {
        field: 'creator',
        title: '创建人',
        width: 80
      },
      {
        field: 'ruleName',
        title: '任务名称',
        width: 100
      },
      {
        slots: {
          header: 'header_condition_title',
          default: 'delete_condition'
        }
      },
      {
        title: '执行时间',
        width: 140,
        slots: {
          default: 'exe_time'
        }
      },
      {
        field: 'successCount',
        width: 100,
        slots: {
          header: 'header_success_title'
        }
      },
      {
        field: 'failCount',
        width: 100,
        slots: {
          header: 'header_fail_title'
        }
      },
      {
        title: '操作',
        width: 80,
        slots: {
          default: 'operator'
        }
      }
    ],
    data: []
  });

  // 查询表格列表数据
  const getLogList = async () => {
    loading.value = true;
    const { data, count } = await searchRuleLog({
      ...formData
    }).finally(() => {
      loading.value = false;
    });
    gridOptions.data = data || [];
    totalCount.value = count;
  };

  // 表格分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    formData.page = currentPage;
    formData.limit = pageSize;
    getLogList();
  };

  // 单个导出
  const exportLog = async (row) => {
    let form = new FormData();
    form.append('ruleId', Number(row.ruleId));
    form.append('batchNo', row.batchNo);

    transBlob({
      url: '/lms/amazon/autoEndListingRule/exportLogByBatchNo',
      data: form,
      fileName: '执行日志' + Date.now() + '.xls'
    });
  };

  // 全部导出
  const exportAllLogs = async () => {
    const { fullData } = tableRef.value.getTableData();
    const ruleId = fullData[0].ruleId;

    let form = new FormData();
    form.append('ruleId', ruleId);

    transBlob({
      url: '/lms/amazon/autoEndListingRule/exportLogByBatchNo',
      data: form,
      fileName: '执行日志' + Date.now() + '.xls'
    });
  };

  const handleClose = () => {
    dialogVisible.value = false;
    gridOptions.data = [];
  };
</script>

<style lang="scss" scoped></style>
