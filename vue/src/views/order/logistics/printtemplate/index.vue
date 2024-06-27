<template>
  <div class="app-container">
    <el-card class="common_split_bottom search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        label-width="80"
        class="search_form"
      >
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="formData.templateName" clearable />
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType">
          <el-select v-model="formData.templateType" filterable clearable>
            <el-option
              v-for="item in templateTypeList"
              :key="item.code"
              :label="item.cnName"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" filterable clearable>
            <el-option label="全部" value="" />
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

        <el-button
          :loading="tableLoading"
          type="primary"
          @click="handleSearch()"
          >搜索</el-button
        >
        <el-button @click="handleReset()">清空</el-button>
      </el-form>
    </el-card>

    <el-card class="list_card">
      <div class="card_header">
        <div>数量({{ totalCount }})</div>
        <div>
          <el-button type="primary" @click="handleCreate">新建</el-button>
        </div>
      </div>
      <vxe-table
        ref="tableRef"
        v-loading="tableLoading"
        :data="tableData"
        :height="height"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
        border
        show-overflow
      >
        <vxe-column title="模板名称" field="templateName" :edit-render="{}">
          <template #edit="{ row, rowIndex }">
            <vxe-textarea
              v-model="row.templateName"
              :autosize="{ minRows: 1, maxRows: 4 }"
              :maxlength="100"
              show-word-count
              @blur="handleChangeName(row.templateName, row, rowIndex)"
              @focus="previousName = row.templateName"
            ></vxe-textarea>
          </template>
        </vxe-column>
        <vxe-column title="模板类型" field="templateType">
          <template #default="{ row }">
            {{ getTemplateType(row.templateType) }}
          </template>
        </vxe-column>
        <vxe-column title="模版规格" field="templateSize" />
        <vxe-column title="备注" field="remark" :edit-render="{}">
          <template #default="{ row }">
            <div v-loading="row?.remarkLoading">
              {{ row.remark }}
            </div>
          </template>
          <template #edit="{ row }">
            <vxe-textarea
              v-model="row.remark"
              v-loading="row?.remarkLoading"
              :autosize="{ minRows: 1, maxRows: 4 }"
              :maxlength="100"
              show-word-count
              @blur="handleChangeRemark(row.remark, row)"
            ></vxe-textarea>
          </template>
        </vxe-column>
        <vxe-column title="操作人" field="modifier" width="150" />
        <vxe-column title="操作时间" field="modifyTime">
          <template #default="{ row }">
            {{ transferDate(row.modifyTime) }}
          </template>
        </vxe-column>
        <vxe-column title="状态" field="status" width="150">
          <template #default="{ row }">
            <vxe-switch
              v-model="row.status"
              v-loading="row?.statusLoading"
              size="medium"
              open-label="是"
              close-label="否"
              @change="handleChangeStatus(row.status, row)"
            ></vxe-switch>
          </template>
        </vxe-column>
        <vxe-column title="打印/下载" field="EUAPTITUDE" width="150">
          <template #default="{ row }">
            <el-button
              v-if="row.templateType === 'EU_APTITUDE'"
              type="success"
              @click="handlePrint(row)"
              >打印</el-button
            >
            <el-button
              v-if="row.templateType === 'EU_APTITUDE'"
              type="success"
              :loading="row.downloadPdfLoading"
              @click="handleDownloadPdf(row)"
              >下载</el-button
            >
          </template>
        </vxe-column>
        <vxe-column title="操作" width="300">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row)"
              >编辑面单</el-button
            >
            <el-button
              type="primary"
              :loading="row.previewLoading"
              @click="handlePreview(row)"
              >预览</el-button
            >
            <el-button type="primary" @click="handleCopy(row)"
              >复制模板</el-button
            >
            <el-button
              v-permission="['orderlogisticsprinttemplateAuth']"
              type="success"
              @click="handlePermit(row)"
              >授权</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[30, 50, 100]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <CreateTplDialog
      v-model="showEditDialog"
      :tpl-info="tplInfo"
      :template-type-list="templateTypeList"
      @search="handleSearch"
    />
    <PermitDialog
      v-if="showPermitDialog"
      v-model="showPermitDialog"
      :tpl-info="tplInfo"
    />
  </div>
</template>

<script setup name="orderlogisticsprinttemplate">
  import { reactive, ref, computed, onMounted } from 'vue';
  import {
    getTplListApi,
    updateApi,
    getTemplateTypeApi,
    updateNameApi
  } from '@/api/order/printtemplate';
  import { ElMessage } from 'element-plus';
  import CreateTplDialog from './components/CreateTplDialog.vue';
  import PermitDialog from './components/PermitDialog.vue';
  // import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { setItem } from '@/utils/storage';
  import { transferDate } from '@/utils/common';
  import { commonExecutePrintJobs } from '@/utils/print';
  import { transBlob } from '@/utils/downloadFile';

  const formRef = ref(null);
  let formData = reactive({
    templateName: '',
    templateType: '',
    status: 1
  });
  const templateTypeList = ref([]);
  onMounted(async () => {
    const { data } = await getTemplateTypeApi();
    templateTypeList.value = data;
    handleSearch();
  });

  // 店铺列表数据
  const tableData = ref();
  const tableRef = ref();
  const tableLoading = ref(false);
  const totalCount = ref(0);
  const paginationData = reactive({
    total: 0,
    limit: 30,
    page: 1
  });

  // 获取列表数据
  const handleSearch = async () => {
    try {
      tableLoading.value = true;
      const { limit, page } = paginationData;
      const { data, count } = await getTplListApi({ ...formData, limit, page });
      tableData.value = (data || [])
        .map((item) => ({
          ...item,
          remarkLoading: false,
          statusLoading: false,
          previewLoading: false,
          lastRemark: item.remark,
          templateSize: item.width + 'mm x ' + item.height + 'mm'
        }))
        .sort((a, b) => b.modifyTime - a.modifyTime);
      totalCount.value = count;
      paginationData.total = count;
    } catch (err) {
      console.log(err);
    }
    tableLoading.value = false;
  };

  // 清空筛选表单
  const handleReset = () => {
    formRef.value.resetFields();
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleSearch();
  };

  //
  const showEditDialog = ref(false);
  const tplInfo = ref();
  const handleCreate = () => {
    showEditDialog.value = true;
    tplInfo.value = {};
  };

  const getTemplateType = (templateType) => {
    return templateTypeList.value.filter(
      (item) => item.code === templateType
    )[0]?.cnName;
  };

  const handleChangeStatus = async (value, row) => {
    row.statusLoading = true;
    try {
      const { msg } = await updateApi({ status: value, id: row.id });
      ElMessage.success(msg);
    } catch (err) {
      row.status = !value;
      console.log('err :>> ', err);
    }
    row.statusLoading = false;
  };
  const handleChangeRemark = async (value, row) => {
    if (value !== row.lastRemark) {
      row.remarkLoading = true;
      try {
        const { msg } = await updateApi({ remark: value, id: row.id });
        ElMessage.success(msg);
        row.lastRemark = value;
      } catch (err) {
        console.log('err :>> ', err);
      }
      row.remarkLoading = false;
    }
  };
  //修改标题
  const previousName = ref('');
  const handleChangeName = async (value, row, rowIndex) => {
    try {
      if (previousName.value == value) {
        return;
      }
      const { msg } = await updateNameApi({ templateName: value, id: row.id });
      ElMessage.success(msg);
      handleSearch();
    } catch (err) {
      tableData.value[rowIndex]['templateName'] = previousName.value;
      previousName.value = '';
      console.log('err :>> ', err);
    }
  };

  // const router = useRouter();
  const handleEdit = (row) => {
    const { id, templateType } = row;
    // router.push(
    //   `/order/logistics/editor?id=${id}&templateType=${templateType}`
    // );
    sessionStorage.setItem(
      'route_link_logistic_editor', // 和 routeRefeash 中配置相同
      `/order/logistics/editor?id=${id}&templateType=${templateType}`
    );
    window.open(
      `/trade-web/#/order/logistics/editor?id=${id}&templateType=${templateType}`
    );
  };
  const handlePreview = async (row) => {
    if (!row.templateHtml) {
      return ElMessage.warning('请先编辑面单');
    }
    row.previewLoading = true;
    axios({
      url: `/lms/printTemplate/unLogin/preview?id=${row.id}`
    })
      .then(({ data, status, statusText }) => {
        if (status === 200) {
          setItem('bodyHtml', data);
          row.previewLoading = false;
          var newWin = window.open('', '_blank');
          newWin.document.write(localStorage.getItem('bodyHtml'));
        } else {
          ElMessage.error(statusText);
          throw statusText;
        }
      })
      .catch(() => {
        row.previewLoading = false;
        ElMessage.error('请求失败');
      })
      .finally(() => {});
  };
  const handleCopy = (row) => {
    showEditDialog.value = true;
    tplInfo.value = row;
  };

  const handlePrint = async (row) => {
    if (!row.templateHtml) {
      return ElMessage.warning('请先编辑面单');
    }
    const url = `/lms/printTemplate/unLogin/preview?id=${row.id}`;
    commonExecutePrintJobs([
      {
        printType: 19,
        labelUrl: window.location.origin + url,
        width: row.width,
        height: row.height,
        printName: row.width.toString() + row.height.toString()
      }
    ]);
  };

  const handleDownloadPdf = async (row) => {
    row.downloadPdfLoading = true;
    transBlob(
      {
        url: `/lms/printTemplate/downloadPdf?id=${row.id}`,
        fileName: `${row.templateName}${transferDate(new Date())}.pdf`
      },
      'get'
    )
      .then(() => {
        ElMessage.success('操作成功');
        row.downloadPdfLoading = false;
      })
      .catch(() => {
        row.downloadPdfLoading = false;
      });
  };

  const showPermitDialog = ref(false);
  const handlePermit = (row) => {
    showPermitDialog.value = true;
    tplInfo.value = row;
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 195;
  });
</script>

<style lang="scss" scoped>
  .card_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
</style>
