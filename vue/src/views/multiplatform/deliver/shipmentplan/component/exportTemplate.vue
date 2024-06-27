<template>
  <el-dialog
    v-model="showExportDialog"
    title="导出模板选择"
    width="70%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <vxe-table
      ref="exportTable"
      :data="templateList"
      height="500"
      :loading="loading"
      border
    >
      <vxe-column type="checkbox" width="50"></vxe-column>
      <vxe-column field="name" title="模板名称" width="200"></vxe-column>
      <vxe-column title="导出字段内容">
        <template #default="{ row }">
          {{ getContent(row.titleJson) }}
        </template>
      </vxe-column>
      <vxe-column field="remark" title="备注" width="250"></vxe-column>
    </vxe-table>
    <div class="pagination">
      <el-pagination
        v-model:currentPage="formData.page"
        v-model:page-size="formData.limit"
        background
        :small="true"
        :page-sizes="[50, 100, 300]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleExport()">导出</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import {
    defineProps,
    defineEmits,
    computed,
    reactive,
    ref,
    onMounted
  } from 'vue';
  import { getExportTemplate } from '@/api/multiplatform/shipmentplan';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { transBlob } from '@/utils/downloadFile';

  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    selectedData: {
      type: Array,
      default: () => []
    },
    // 是否全部导出
    isExportAll: {
      type: Boolean,
      default: false
    },
    // 查询参数
    queryParams: {
      type: Object,
      default: () => {}
    }
  });

  onMounted(() => {
    getTemplateData();
  });

  const emits = defineEmits(['close']);
  const templateList = ref([]);
  const formData = reactive({
    page: 1,
    limit: 50,
    templateType: '4'
  });
  const total = ref(0);
  const exportTable = ref(null);

  const selectedTemp = ref([]);

  const getSelectData = () => {
    const $table = exportTable.value;
    selectedTemp.value = $table.getCheckboxRecords();
    if (selectedTemp.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      return false;
    } else if (selectedTemp.value.length > 1) {
      ElMessage.warning('只能选择一条模板数据！');
      return false;
    } else {
      return true;
    }
  };

  // 获取模板
  const getTemplateData = async () => {
    try {
      const { code, data, count } = await getExportTemplate(formData);
      if (code === '0000') {
        templateList.value = data;
        total.value = count;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getContent = (title) => {
    const titleJson = JSON.parse(title);
    let content = [];
    titleJson.forEach((item) => {
      content = content.concat(item.titleList);
    });
    return content
      .map((item) => {
        return item.excelField;
      })
      .join(',');
  };

  const showExportDialog = computed(() => {
    return props.isVisible;
  });

  const loading = ref(false);
  const handleExport = async () => {
    if (getSelectData()) {
      let paramsBase = {
        templateId: Number(selectedTemp.value.map((item) => item.id).join('')),
        ids: props.selectedData.map((item) => item.id)
      };
      let params;
      if (props.isExportAll) {
        params = { ...paramsBase, ...props.queryParams };
        ElMessageBox.confirm('确定导出全部数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            exportData(params);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        params = paramsBase;
        exportData(params);
      }
    }
  };

  const exportData = async (params) => {
    try {
      loading.value = true;
      transBlob({
        url: '/lms/PlatWh/PlatWhShipment/exportByTemplate',
        contentType: 'application/json',
        data: params,
        fileName: '货件信息' + Date.now() + '.xls'
      }).finally(() => {
        loading.value = false;
        ElMessage.success('下载成功');
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    emits('close');
  };

  // 分页
  const handleSizeChange = (val) => {
    formData.limit = val;
    formData.page = 1;
    getTemplateData();
  };

  const handleCurrentChange = (val) => {
    formData.page = val;
    getTemplateData();
  };
</script>

<style lang="scss" scoped></style>
