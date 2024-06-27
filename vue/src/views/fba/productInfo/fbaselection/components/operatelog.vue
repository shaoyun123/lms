<template>
  <el-dialog
    width="60%"
    :model-value="showLogDialog"
    destroy-on-close
    :close-on-click-modal="false"
    @close="submitCloseDialog"
  >
    <template #header>
      <div class="dialog_title">
        <div class="large_title">操作日志</div>
        <div class="small_title">{{ itemName }} &nbsp;&nbsp;{{ pSku }}</div>
      </div>
    </template>
    <vxe-table :data="logList">
      <vxe-column title="操作时间" width="200">
        <template #default="{ row }">
          <div>{{ transferDate(row.createTime) }}</div>
        </template>
      </vxe-column>
      <vxe-column title="操作人" field="creator" width="200"></vxe-column>
      <vxe-column title="操作内容" field="operDesc"></vxe-column>
    </vxe-table>
    <div class="pagination">
      <el-pagination
        v-model:currentPage="formData.page"
        v-model:page-size="formData.limit"
        background
        :page-sizes="[20, 50, 100]"
        layout="prev, pager, next, sizes, total"
        :total="total"
        :small="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
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
  import { getOperateLogs } from '@/api/fba/fbaselection.js';
  import { transferDate } from '@/utils/common';

  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    chooseId: {
      type: Number,
      default: 0
    },
    itemName: {
      type: String,
      default: ''
    },
    pSku: {
      type: String,
      default: ''
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
    page: 1,
    limit: 20,
    chooseId: ''
  });

  // 操作日志
  const logList = ref([]);
  const total = ref(0);
  // 获取操作日志
  const getLogData = async () => {
    formData.chooseId = props.chooseId;
    try {
      const { code, data } = await getOperateLogs(formData);
      if (code === '0000') {
        logList.value = data?.list || [];
        total.value = data?.total || 0;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSizeChange = (val) => {
    formData.limit = val;
    getLogData();
  };

  const handleCurrentChange = (val) => {
    formData.page = val;
    getLogData();
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
