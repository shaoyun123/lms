<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="操作日志"
      :width="900"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div v-loading="tableDataLoading">
        <vxe-grid ref="tableRef" v-bind="gridOptions">
          <template #createTime_default="{ row }">
            {{ transferDate(row.createTime) }}
          </template>
          <template #operDesc_default="{ row }">
            <ExpandText :text="row.operDesc" />
          </template>
        </vxe-grid>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watch, computed, reactive } from 'vue';
  import { getLogApi } from '@/api/publishs/tiktokonlineproduct';
  import { transferDate } from '@/utils/common';
  import ExpandText from '@/components/ExpandText.vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedRow: {
      type: Object,
      default: () => {}
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
  const tableRef = ref();

  const tableDataLoading = ref(false);

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        handleSearch();
      } else {
        gridOptions.data = [];
      }
    }
  );

  const handleSearch = async () => {
    try {
      tableDataLoading.value = true;
      const { data } = await getLogApi(props.checkedRow.productId);
      gridOptions.data = data;
    } catch (err) {
      gridOptions.data = [];
    } finally {
      tableDataLoading.value = false;
    }
  };

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
        slots: { default: 'createTime_default' }
      },
      {
        field: 'creator',
        title: '操作人'
      },
      {
        field: 'prodSSku',
        title: '子sku'
      },
      {
        field: 'skuId',
        title: 'sku_id'
      },
      {
        field: 'operTypeStr',
        title: '事件'
      },
      {
        field: 'origData',
        title: '原值'
      },
      {
        field: 'newData',
        title: '调整值'
      },
      {
        field: 'operDesc',
        title: '结果',
        width: 200,
        slots: { default: 'operDesc_default' }
      }
    ],
    data: []
  });
</script>

<style lang="scss" scoped>
  .operatelog_wrapper {
    .operatelog_text_success {
      color: #67c23a;
    }
    .operatelog_text_error {
      color: #f56c6c;
    }
  }
</style>
