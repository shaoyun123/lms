<template>
  <!-- 缓存管理 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :inline="true"
        class="search_form redis-form"
      >
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="Key" prop="key">
              <el-input
                v-model="formData.key"
                clearable
                placeholder="支持redis通配符：*, ? ,[]"
              /> </el-form-item
          ></el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button
              ><el-button @click="handleResetForm(ruleFormRef)"
                >清空</el-button
              ></el-form-item
            ></el-col
          >
        </el-row>
      </el-form>
    </el-card>
    <el-card class="list_card">
      <vxe-grid ref="tableDataRef" v-bind="gridOptions">
        <template #toolbar_default="{ row }">
          <el-popconfirm
            title="确定删除key吗？?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDel(row)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" class="ml10" @click="handleEdit(row)"
            >编辑</el-button
          >
        </template>
      </vxe-grid>
    </el-card>
    <EditDialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :detail-info="detailInfo"
    />
  </div>
</template>

<script setup name="configuretechredis">
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import { delKeyApi, searchkeyListApi } from '@/api/configure/redis';
  import { comGetTableHeight } from '@/utils/common';
  import EditDialog from './components/EditDialog.vue';

  const formData = ref({
    key: ''
  });
  const ruleFormRef = ref();

  const searchCardRef = ref();
  const gridOptions = reactive({
    border: true,
    showFooter: true,
    height: 200,
    columnConfig: {
      resizable: true
    },
    showOverflow: true,
    scrollY: { gt: 15 },
    rowConfig: { isCurrent: true, isHover: true, keyField: 'id' },
    editConfig: {
      trigger: 'click',
      mode: 'cell'
    },
    data: [],
    columns: [
      {
        type: 'seq',
        title: '序号',
        width: 150
      },
      { field: 'key', title: 'key' },
      { field: 'type', title: '类型' },

      {
        field: 'toolbar',
        title: '操作',
        width: 150,
        slots: { default: 'toolbar_default' }
      }
    ],
    footerMethod() {}
  });
  const tableDataRef = ref();

  onMounted(() => {
    gridOptions.height = comGetTableHeight(searchCardRef);
  });

  const handleSearch = async () => {
    const { key } = formData.value;
    if (key === undefined || key === '') {
      return ElMessage.warning('请输入key');
    }
    try {
      const { data = [] } = await searchkeyListApi(formData.value.key);
      gridOptions.data = data;
    } catch (err) {
      gridOptions.data = [];
    }
  };
  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };

  const handleDel = async (row) => {
    const { key } = row;
    if (key === undefined || key === '') {
      return ElMessage.warning('key不正确');
    }
    await delKeyApi({ key });
    ElMessage.success('删除成功');
    tableDataRef.value.remove(row);
  };

  const dialogVisible = ref(false);
  const detailInfo = ref({});
  const handleEdit = async (row) => {
    dialogVisible.value = true;
    detailInfo.value = row;
  };
</script>

<style lang="scss" scoped>
  .redis-form {
    :deep(.el-form-item) {
      width: 100%;
    }
    :deep(.el-input) {
      width: 100%;
    }
  }
  .list_card {
    .ml10 {
      margin-left: 10px;
    }
  }
</style>
