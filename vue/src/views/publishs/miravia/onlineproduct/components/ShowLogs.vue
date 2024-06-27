<template>
  <el-dialog
    v-model="dialogVisible"
    title="操作日志"
    width="50%"
    style="height: 80%"
    :align-center="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <vxe-grid
      ref="tableRef"
      v-bind="gridOptions"
      :show-overflow="true"
      :scroll-y="{ gt: 10 }"
      :sort-config="{ remote: true }"
      @sort-change="sortChange"
    >
      <template #default_logEvent="{ row }">
        <div>{{ operateType[row.operType] }}</div>
      </template>
      <template #createTime_default="{ row }">
        {{ transferDate(row.createTime) }}
      </template>
      <template #default_result="{ row }">
        <div :class="row.operResult === 1 ? 'success_color' : 'fail_color'">
          {{ row.operResult === 1 ? '执行成功' : '执行失败' }}
        </div>
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
  import { getProdListingOperTypeEnum } from '@/api/common';
  import { ref, reactive, computed, watch } from 'vue';
  import { listListingOperationLog } from '@/api/publishs/miraviaonline';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedId: {
      type: String,
      default: () => ''
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
    productId: '',
    orderType: 1, // 默认倒序 1倒序 2 正序
    page: 1,
    limit: 50
  });

  const totalCount = ref(0);
  const loading = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        formData.productId = props.checkedId;
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
    height: 650,
    rowConfig: {
      isHoverRow: true
    },
    columnConfig: {
      resizable: true
    },
    toolbarConfig: {
      custom: true
    },
    columns: [
      {
        width: '150',
        field: 'createTime',
        title: '时间',
        sortable: true,
        slots: {
          default: 'createTime_default'
        }
      },
      {
        field: 'creator',
        title: '操作人'
      },
      {
        field: 'productId',
        title: '商品ID'
      },
      {
        field: 'storeSSku',
        title: '子SKU'
      },
      {
        title: '事件',
        slots: {
          default: 'default_logEvent'
        }
      },
      {
        field: 'origData',
        title: '原值'
      },
      {
        field: 'newData',
        title: '期望值'
      },
      {
        field: 'operResult',
        title: '结果',
        slots: {
          default: 'default_result'
        }
      },
      {
        field: 'operDesc',
        title: '备注'
      }
    ],
    data: []
  });

  // 查询表格列表数据
  const getLogList = async () => {
    loading.value = true;
    const { data } = await listListingOperationLog({
      ...formData
    }).finally(() => {
      loading.value = false;
    });
    gridOptions.data = (data.list || []).map((v) => ({
      ...v,
      operDesc: getOperDesc(v)
    }));
    totalCount.value = data.total;
    if (data.list.length > 0) {
      getLogsOptionType();
    }
  };

  const getOperDesc = (item) => {
    let result = '';
    if (item.operDesc) {
      if (item.operDesc.includes('<br>')) {
        result = item.operDesc.replaceAll('<br>', '\n');
      } else {
        result = item.operDesc;
      }
    } else {
      result = '';
    }
    return result;
  };

  // 操作类型
  const operateType = ref({});
  const getLogsOptionType = async () => {
    const { data } = await getProdListingOperTypeEnum('miravia');
    operateType.value = data;
  };

  // 排序
  const sortChange = ({ order }) => {
    formData.orderType = order === 'desc' ? 1 : 2;
    getLogList();
  };

  // 表格分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    formData.page = currentPage;
    formData.limit = pageSize;
    getLogList();
  };

  const handleClose = () => {
    dialogVisible.value = false;
    gridOptions.data = [];
  };
</script>

<style lang="scss" scoped>
  .success_color {
    color: #67c23a;
  }
  .fail_color {
    color: #f56c6c;
  }
</style>
