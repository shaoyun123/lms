<template>
  <el-dialog
    v-model="dialogVisible"
    width="800"
    title="授权"
    destroy-on-close
    :close-on-click-modal="false"
    @close="dialogVisible = false"
  >
    <el-row :gutter="10">
      <el-col :span="12">
        <ZSelect v-model="selectUser" :items="allUserList"
      /></el-col>
      <el-col :span="8"
        ><el-button type="primary" @click="handleAdd"
          >新增授权</el-button
        ></el-col
      >
    </el-row>
    <vxe-grid ref="tableRef" v-bind="gridOptions" class="mt10">
      <template #tool_default="{ row }">
        <el-popconfirm title="确定取消授权吗?" @confirm="handleCancel(row)">
          <template #reference>
            <el-button type="danger"> 取消授权 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </vxe-grid>
  </el-dialog>
</template>

<script setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import {
    getPermissionListApi,
    addPermissionApi,
    cancelPermissionApi
  } from '@/api/order/printtemplate';
  import { allUserPermissionListApi } from '@/api/common/index';
  import ZSelect from '@/components/ZSelect/index.vue';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    tplInfo: {
      type: Object,
      default: () => ({})
    }
  });

  const emits = defineEmits(['update:modelValue', 'search']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const allUserList = ref([]);
  onMounted(async () => {
    getAllUserList();
    searchTable();
  });

  const searchTable = async () => {
    const { data } = await getPermissionListApi({
      masterType: 1, //用户，固定1
      resourceType: 'PRINT_TEMPLATE', //固定
      resourceVal: props.tplInfo.templateType
    });
    gridOptions.data = data;
  };
  const getAllUserList = async () => {
    const { data } = await allUserPermissionListApi();
    allUserList.value = (data || []).map((v) => ({
      id: v.userId,
      name: v.userName + '(' + v.name + ')'
    }));
  };

  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    height: 400,
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    columns: [
      { field: 'userName', title: '登录名' },
      { field: 'name', title: '部门' },
      {
        field: 'tool',
        title: '操作',
        slots: {
          default: 'tool_default'
        }
      }
    ],
    data: []
  });
  const handleCancel = async (row) => {
    const { msg } = await cancelPermissionApi({
      masterType: 1, //用户，固定1
      resourceType: 'PRINT_TEMPLATE', //固定
      masterVal: row.userId, //用户id
      resourceVal: props.tplInfo.templateType //列表中的templateType字段
    });
    ElMessage.success(msg);
    tableRef.value.remove(row);
  };

  // 新增
  const selectUser = ref([]);
  const handleAdd = async () => {
    if (!selectUser.value.length) {
      return ElMessage.warning('请先选择需要新增的数据');
    }
    const masterValStr = selectUser.value.join();
    const { msg } = await addPermissionApi({
      masterType: 1,
      masterValStr,
      resourceType: 'PRINT_TEMPLATE',
      resourceVal: props.tplInfo.templateType
    });
    ElMessage.success(msg);
    selectUser.value = [];
    searchTable();
  };
</script>

<style lang="scss" scoped>
  .mt10 {
    margin-top: 10px;
  }
</style>
