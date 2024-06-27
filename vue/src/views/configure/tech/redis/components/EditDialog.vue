<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="信息"
      :width="800"
      :close-on-click-modal="false"
      :align-center="true"
    >
      <vxe-grid
        v-if="detailInfo.type === 'hash'"
        ref="tableFieldRef"
        v-bind="gridOptions"
      >
        <template #value_default="{ row }">
          <div class="mt05 mb05">
            <el-input v-model="row.value" clearable type="textarea" rows="4" />
          </div>
        </template>
        <template #toolbar_default="{ row }">
          <el-popconfirm
            title="确定删除field吗？?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDel(row)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </vxe-grid>
      <el-input v-else v-model="keyValue" clearable type="textarea" rows="3" />

      <template #footer>
        <el-button type="primary" @click="handleSave"> 确定</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, reactive, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    getHashRedisApi,
    getStringredisApi,
    removeFiledApi,
    saveHashRedisApi,
    saveStringredisApi
  } from '@/api/configure/redis';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    detailInfo: {
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

  const keyValue = ref();

  const gridOptions = reactive({
    border: true,
    showFooter: true,
    maxHeight: 600,
    columnConfig: {
      resizable: true
    },
    showOverflow: true,
    scrollY: { gt: 15, enabled: true },
    rowConfig: { isCurrent: true, isHover: true, keyField: 'id' },
    editConfig: {
      trigger: 'click',
      mode: 'cell'
    },
    data: [],
    columns: [
      { field: 'field', title: 'field', width: 150 },
      { field: 'value', title: 'value', slots: { default: 'value_default' } },

      {
        field: 'toolbar',
        title: '操作',
        width: 100,
        slots: { default: 'toolbar_default' }
      }
    ],
    footerMethod() {
      return [];
    }
  });
  const tableFieldRef = ref();
  onMounted(async () => {
    const { key, type } = props.detailInfo;
    if (type === 'hash') {
      const { data = [] } = await getHashRedisApi({ key });
      gridOptions.data = data;
    } else {
      const { data = '' } = await getStringredisApi({ key });
      keyValue.value = data;
    }
  });
  const handleDel = async (row) => {
    await removeFiledApi({ key: props.detailInfo.key, field: row.field });
    ElMessage.success('删除成功');
    tableFieldRef.value.remove(row);
  };

  // 保存
  const handleSave = async () => {
    const { type, key } = props.detailInfo;
    let params;
    if (type === 'hash') {
      const { fullData } = tableFieldRef.value.getTableData();
      params = fullData.map((v) => ({
        field: v.field,
        key,
        value: v.value
      }));
    } else {
      params = {
        key,
        value: keyValue.value
      };
    }
    const saveApi = type === 'hash' ? saveHashRedisApi : saveStringredisApi;
    await saveApi(params);
    ElMessage.success('操作成功');
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  .mb05 {
    margin-bottom: 5px;
  }
  .mt05 {
    margin-top: 5px;
  }
</style>
