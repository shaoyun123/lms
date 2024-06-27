<template>
  <el-dialog
    v-model="dialogVisible"
    width="20%"
    align-center
    center
    @close="handleClose"
  >
    <template #header>
      <div class="tipsTitle">
        <el-icon class="mr-2"><WarningFilled /></el-icon>
        <span>以下商品下架失败</span>
      </div>
    </template>

    <div class="failStrBox" @click="copy(batchSetResultMsg)">
      <el-tooltip content="点击复制" placement="left">
        <span style="word-break: break-all">{{ batchSetResultMsg }}</span>
      </el-tooltip>
    </div>
    <div class="exportBox" @click="exportFailReason">导出失败原因</div>
  </el-dialog>
</template>

<script setup>
  import { computed, watch } from 'vue';
  import { copy } from '@/utils/common';
  import { transBlob } from '@/utils/downloadFile';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    batchNo: {
      type: String,
      default: ''
    },
    batchSetResultMsg: {
      type: String,
      default: ''
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
      if (!val) {
        handleClose();
      }
    }
  );

  // 导出失败原因
  const exportFailReason = async () => {
    transBlob({
      url: `/lms/miraviaOnlineProduct/exportFailLogByBatchNo?batchNo=${props.batchNo}`,
      contentType: 'application/json',
      fileName: '错误原因' + Date.now() + '.xls'
    });
  };

  const handleClose = () => {
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }
  .mr-2 {
    margin-right: 8px;
  }
  .exportBox {
    cursor: pointer;
    margin-top: 8px;
    color: rgb(58, 147, 219);
  }
  .failStrBox {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    color: rgb(58, 147, 219);
    font-size: 14px;
    cursor: pointer;
  }
  .tipsTitle {
    display: flex;
    align-items: center;
    font-size: 16px;
  }
</style>
