<template>
  <div class="fullDialog">
    <el-dialog
      width="800px"
      title="日志"
      :model-value="showDialog"
      :close-on-click-modal="false"
      destroy-on-close
      align-center
      @close="closeDialog"
    >
      <el-table :data="logTableData" border>
        <el-table-column label="时间">
          <template #default="scope">
            {{
              scope.row.createTime
                ? parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}')
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="creator" />
        <el-table-column label="规则id/名称">
          <template #default="scope">
            <div>{{ scope.row.ruleId }}</div>
            <div>{{ scope.row.ruleName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="日志" width="400">
          <template #default="scope">
            <span v-for="(log, j) in scope.row.logs" :key="j">
              [{{ log.modifyField }}变更]：[{{ log.oldData }}] =>
              {{ log.newData }}；<br />
            </span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="closeDialog">关闭</el-button>
      </template>
    </el-dialog>
  </div>
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
    emit('closeDialog', { isShow: false });
  };
</script>
<style scoped lang="scss">
  .fullDialog {
    :deep(.el-dialog__body) {
      overflow-y: auto;
      max-height: calc(100vh - 260px);
    }
  }
</style>
