<template>
  <el-dialog
    v-model="dialogVisible"
    title="操作日志"
    :width="1100"
    :destroy-on-close="true"
    :close-on-click-modal="false"
  >
    <vxe-grid ref="tableRef" v-bind="gridOptions">
      <template #createTime_default="{ row }">
        {{ transferDate(row.createTime) }}
      </template>
      <template #operDesc_default="{ row }">
        <ExpandText :text="row.operDesc" />
      </template>
    </vxe-grid>
  </el-dialog>
</template>

<script setup>
  import { onMounted, ref, reactive, computed } from 'vue';
  import { getLogApi } from '@/api/publishs/darazonlineproduct';
  import { transferDate } from '@/utils/common';
  import ExpandText from '@/components/ExpandText.vue';

  const props = defineProps({
    checkedRow: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: Boolean,
      default: false
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

  onMounted(async () => {
    const { data = [] } = await getLogApi(props.checkedRow);
    gridOptions.data = data;
  });

  const tableRef = ref();
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
        title: '操作时间',
        sortable: true,
        width: 140,
        slots: { default: 'createTime_default' }
      },
      {
        field: 'creator',
        width: 90,
        title: '操作人'
      },
      {
        field: 'prodSSku',
        width: 110,
        title: '子sku'
      },
      {
        field: 'operTypeDesc',
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

<style lang="scss" scoped></style>
