<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="操作日志"
      width="55%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div v-loading="tableDataLoading">
        <vxe-grid ref="tableRef" v-bind="gridOptions">
          <template #createTime_default="{ row }">
            {{ transferDate(row.createTime) }}
          </template>
          <template #handle_log="{ row }">
            {{ row.operTypeName }}: {{ row.origData }} ->
            {{ row.newData }}
          </template>

          <template #handle_result="{ row }">
            <div>
              <span :class="getOperResultClass(row.operResult)" class="mr-4">{{
                getOperResult(row.operResult)
              }}</span>
              <span v-if="row.operDesc">原因: {{ row.operDesc }}</span>
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
              :page-sizes="[50, 100, 200]"
              :total="totalCount"
              @page-change="handlePageChange"
            >
            </vxe-pager>
          </template>
        </vxe-grid>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, reactive, watch } from 'vue';
  import { transferDate } from '@/utils/common';
  import { getBySellerSkuApi } from '@/api/multiplatform/temuprod';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    currentSellerSku: {
      type: String,
      default: () => ''
    }
  });

  const emits = defineEmits(['update:modelValue']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        getLogList();
      }
    }
  );

  const formData = reactive({
    page: 1,
    limit: 50
  });

  const tableRef = ref();
  const totalCount = ref(0);

  const tableDataLoading = ref(false);

  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    showOverflow: true,
    keepSource: true,
    height: 600,
    rowConfig: {
      keyField: 'id',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    toolbarConfig: {
      custom: true // 显示自定义列按钮
    },
    columns: [
      {
        field: 'createTime',
        title: '时间',
        sortable: true,
        width: 145,
        slots: { default: 'createTime_default' }
      },
      {
        field: 'creator',
        title: '操作人'
      },
      {
        field: 'productId',
        title: 'SKCID'
      },
      {
        field: 'storePSku',
        title: 'SKC货号'
      },
      {
        field: 'skuId',
        title: 'SKUID'
      },
      {
        field: 'storeSSku',
        title: '店铺子SKU'
      },
      {
        field: 'newData',
        title: '日志',
        width: 150,
        slots: { default: 'handle_log' }
      },
      {
        field: 'operDesc',
        title: '结果',
        width: 160,
        slots: { default: 'handle_result' }
      }
    ],
    data: []
  });

  const getLogList = async () => {
    const { data } = await getBySellerSkuApi({
      sellerSku: props.currentSellerSku,
      pageNum: formData.page,
      pageSize: formData.limit
    });
    gridOptions.data = data.list.map((item) => {
      return {
        ...item,
        origData: item.origData?.replace(/<br>/g, '\n'),
        newData: item.newData?.replace(/<br>/g, '\n')
      };
    });
    totalCount.value = data.total;
  };

  // 表格分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    formData.page = currentPage;
    formData.limit = pageSize;
    getLogList();
  };

  const getOperResult = (res) => {
    if (res === 1) {
      return '初始化';
    }
    if (res === 2) {
      return '执行中';
    }
    if (res === 3) {
      return '成功';
    }
    if (res === 4) {
      return '失败';
    }
  };

  const getOperResultClass = (res) => {
    if (res === 1) {
      return '';
    }
    if (res === 2) {
      return '';
    }
    if (res === 3) {
      return 'success';
    }
    if (res === 4) {
      return 'fail';
    }
  };
</script>

<style lang="scss" scoped>
  .mr-4 {
    margin-right: 4px;
  }

  .success {
    color: #67c23a;
  }
  .fail {
    color: #f56c6c;
  }
</style>
