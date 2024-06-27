<template>
  <el-dialog
    width="60%"
    title="操作日志"
    :model-value="showLogDialog"
    destroy-on-close
    :close-on-click-modal="false"
    @close="submitCloseDialog"
  >
    <vxe-table :data="logList">
      <vxe-column title="Asin" field="asin"></vxe-column>
      <vxe-column title="创建时间" width="200">
        <template #default="{ row }">
          <div>{{ transferDate(row.createTime) }}</div>
        </template>
      </vxe-column>
      <vxe-column title="创建人" field="createName"></vxe-column>
      <vxe-column title="原始状态" field="oldProcessStatus"></vxe-column>
      <vxe-column title="新状态" field="newProcessStatus"></vxe-column>
      <vxe-column title="操作结果" field="operResult" width="250"></vxe-column>
      <vxe-column title="操作人" field="operPerson" width="100"></vxe-column>
    </vxe-table>
  </el-dialog>
</template>
<script setup>
  import {
    defineProps,
    ref,
    defineEmits,
    computed,
    onMounted,
    reactive
  } from 'vue';
  import { getOperateLogs } from '@/api/product/work/amazongatherhot.js';
  import { transferDate } from '@/utils/common';

  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    productId: {
      type: Number,
      default: 0
    }
  });
  const emits = defineEmits(['close']);
  const showLogDialog = computed(() => {
    return props.isVisible;
  });

  onMounted(() => {
    getLogData();
  });

  const formData = reactive({
    productId: ''
  });

  // 操作日志
  const logList = ref([]);
  // 获取操作日志
  const getLogData = async () => {
    formData.productId = props.productId;
    try {
      const { code, data } = await getOperateLogs(formData);
      if (code === '0000') {
        logList.value = data || [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitCloseDialog = () => {
    emits('close');
  };
</script>

<style lang="scss" scoped>
  .dialog_title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  .large_title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .small_title {
    color: #666;
    font-size: 14px;
    font-weight: bold;
  }
</style>
