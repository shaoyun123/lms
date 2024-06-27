<template>
  <el-dialog
    width="46%"
    title="日志"
    :model-value="showDialog"
    destroy-on-close
    @close="closeDialog"
  >
    <el-table :data="logTableData" border :max-height="500">
      <el-table-column label="时间">
        <template #default="{ row }">
          {{ transferDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="creator" width="120" />
      <el-table-column label="平台" prop="platCode" />
      <el-table-column label="店铺" prop="storeAcct" />
      <el-table-column label="商品sku" prop="prodSSKU" />
      <el-table-column label="日志" min-width="120">
        <template #default="{ row }">
          <div class="editor_text">{{ row.operDesc }}</div>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
  import { toRefs, defineProps, defineEmits } from 'vue';
  import { transferDate } from '@/utils/common';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    logTableData: {
      type: Array,
      default: () => []
    }
  });

  const { logTableData } = toRefs(props);
  const emit = defineEmits(['close']);

  const closeDialog = () => {
    emit('close');
  };
</script>
<style scoped lang="scss">
  .editor_text {
    white-space: pre-line;
  }
</style>
