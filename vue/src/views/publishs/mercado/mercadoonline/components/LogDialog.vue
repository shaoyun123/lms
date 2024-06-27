<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="操作日志"
      :width="1000"
      :close-on-click-modal="false"
    >
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="600"
        border
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
      >
        <vxe-column field="createTime" title="时间" width="90"
          ><template #default="{ row }">
            {{ transferDate(row.createTime) }}
          </template></vxe-column
        >
        <vxe-column field="creator" title="操作人"></vxe-column>
        <vxe-column field="prodSSku" title="子sku" width="95"></vxe-column>
        <vxe-column field="itemId" title="itemId" width="120"></vxe-column>
        <vxe-column field="operTypeDesc" title="事件" width="145"></vxe-column>
        <vxe-column field="origData" title="原值"> </vxe-column>
        <vxe-column field="newData" title="调整值"> </vxe-column>
        <vxe-column field="operDesc" title="结果" width="330"></vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script setup>
  /* eslint-disable */
  import { ref, watch, computed, reactive } from 'vue';
  import { getProductLogs } from '@/api/publishs/mercadoonline';
  import { transferDate } from '@/utils/common';
  import { transBlob } from '@/utils/downloadFile';
  import ExpandText from '@/components/ExpandText.vue';

  // eslint-disable-next-line
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

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue']);

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

  const tableDataLoading = ref(false);

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        handleSearch();
      }
    }
  );

  const handleSearch = async () => {
    try {
      tableDataLoading.value = true;
      console.log({
        storeAcctId: props.checkedRow.storeAcctId,
        itemId: props.checkedRow.itemId,
        globalItemId: props.checkedRow.globalItemId
      });
      const { data } = await getProductLogs({
        storeAcctId: props.checkedRow.storeAcctId,
        itemId: props.checkedRow.itemId,
        globalItemId: props.checkedRow.globalItemId
      });
      tableData.value = data;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };
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
