<template>
  <el-dialog
    v-model="dialogVisible"
    title="在线商品导出"
    :width="500"
    :destroy-on-close="true"
    :close-on-click-modal="false"
  >
    <el-form :inline="false">
      <el-form-item label="导出数据范围">
        <el-radio-group v-model="form.type">
          <el-radio value="1">导出列表选中数据</el-radio>
          <el-radio value="2">导出查询条件中的数据</el-radio>
        </el-radio-group>
      </el-form-item></el-form
    >
    <template #footer>
      <el-button
        type="primary"
        :loading="exportLoading"
        @click="handleExport()"
      >
        导出
      </el-button>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, reactive, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { transBlob } from '@/utils/downloadFile';
  import util from '@/components/lazada/js/util.js';

  const props = defineProps({
    selectRecords: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => ({})
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

  const form = reactive({
    type: ''
  });
  const exportLoading = ref(false);
  const handleExport = () => {
    if (!form.type) {
      return ElMessage.warning('请选择导出数范围');
    }
    let params = {};
    const { formData, selectRecords } = props;
    if (form.type == 1) {
      if (!selectRecords.length) {
        return ElMessage.warning('请选择列表导出数据');
      }
      params.pidList = selectRecords.map((item) => item.id);
    } else {
      params = {
        ...formData,
        storeAcctIdList:
          typeof formData.storeAcctIdList === 'number'
            ? [formData.storeAcctIdList]
            : formData.storeAcctIdList
      };
      delete params.page;
      delete params.limit;
    }

    const timeStr = util.formatDate.format(new Date(), 'yyyy月MM年dd日');
    exportLoading.value = true;
    transBlob({
      url: '/lms/daraz/product/exportOnlineProducts',
      contentType: 'application/json',
      data: params,
      fileName: `daraz在线商品_${timeStr}导出表格.xlsx`
    })
      .then(() => {
        ElMessage.success('导出成功');
        exportLoading.value = false;
      })
      .catch(() => {
        exportLoading.value = false;
      });
  };
</script>

<style lang="scss" scoped></style>
