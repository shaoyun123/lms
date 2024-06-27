<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="操作日志"
      width="50%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div v-loading="tableDataLoading">
        <vxe-grid ref="tableRef" v-bind="gridOptions">
          <template #createTime_default="{ row }">
            {{ transferDate(row.createTime) }}
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
  import { showLogApi } from '@/api/publishs/tiktokonlineproduct';
  import { transferDate } from '@/utils/common';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    logId: {
      type: Number || String,
      default: () => null
    }
  });

  const emits = defineEmits(['update:modelValue']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(newVal) {
      emits('update:modelValue', newVal);
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
        title: '修改人'
      },
      {
        field: 'operTypeDesc',
        title: '操作类型名称'
      },
      {
        field: 'operDesc',
        title: '操作描述'
      }
    ],
    data: []
  });

  // 查询日志列表
  const getLogList = async () => {
    const { data } = await showLogApi({
      id: props.logId,
      ...formData
    });
    gridOptions.data = data;
    totalCount.value = data.length;
  };

  // 表格分页
  const handlePageChange = ({ currentPage, pageSize }) => {
    formData.page = currentPage;
    formData.limit = pageSize;
    getLogList();
  };
</script>

<style lang="scss" scoped></style>
