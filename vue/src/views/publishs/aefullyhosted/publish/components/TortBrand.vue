<template>
  <div class="">
    <el-dialog
      v-model="dialogVisible"
      width="600px"
      title="侵权品牌提示"
      :close-on-click-modal="false"
    >
      <vxe-grid ref="tortBrandTableRef" v-bind="gridOptions"></vxe-grid>
      <template #footer>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSaveUrl()"
          >继续刊登</el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { computed, reactive, ref, watch } from 'vue';
  import { publishNowApi } from '@/api/publishs/aefullyhostedpublish';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const tortBrandTableRef = ref();
  const gridOptions = reactive({
    border: true,
    showOverflow: true,
    keepSource: true,
    loading: false,
    height: 500,
    rowConfig: {
      isHoverRow: true
    },
    columnConfig: {
      resizable: true
    },
    toolbarConfig: {
      custom: false
    },
    editConfig: {
      trigger: 'click',
      mode: 'row',
      showStatus: true
    },
    columns: [
      { type: 'checkbox', width: 50 },
      { field: 'sku', title: '商品父SKU' },
      { field: 'brandWord', title: '侵权品牌词' }
    ],
    data: []
  });

  watch(
    () => dialogVisible.value,
    (val) => {
      if (val) {
        gridOptions.data = props.rowList;
      }
    }
  );

  const saveLoading = ref(false);
  const handleSaveUrl = async () => {
    const checkedList = tortBrandTableRef.value.getCheckboxRecords();
    if (!checkedList.length) {
      return ElMessage.warning('请选择数据');
    }
    try {
      saveLoading.value = true;
      const ids = checkedList.map((item) => item.id);
      const { msg } = await publishNowApi({
        ids,
        isContinueListing: 1
      });
      ElMessage.success(msg);
      dialogVisible.value = false;
      emits('handleSearch');
    } catch (err) {
      console.log('err :>> ', err);
    }
    saveLoading.value = false;
  };
</script>

<style lang="scss" scoped></style>
