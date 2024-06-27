<template>
  <el-dialog
    width="800px"
    title="日志"
    :model-value="showDialog"
    :close-on-click-modal="false"
    destroy-on-close
    @close="closeDialog"
  >
    <el-table :data="logTableData" border>
      <el-table-column label="时间">
        <template #default="scope">
          {{
            scope.row.modifyTime
              ? parseTime(scope.row.modifyTime, '{y}-{m}-{d} {h}:{i}:{s}')
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="modifier" width="100" />
      <el-table-column label="id/配置名称">
        <template #default="scope">
          <div>{{ scope.row.subConfigId }}</div>
          <div>{{ scope.row.subConfigName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="日志" prop="operDesc" width="400">
        <template #default="scope">
          <div v-html="scope.row.operDesc"></div>
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
  import { parseTime } from '@/utils/common';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    logTableData: {
      type: Array,
      default: null
    }
  });
  const { logTableData } = toRefs(props);
  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    emit('closeDialog');
  };
</script>
<style scoped lang="scss"></style>
