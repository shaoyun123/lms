<template>
  <!-- 美科多 禁售类目-->
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="form"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item label="站点" prop="salesSite">
          <el-select
            v-model="form.salesSite"
            placeholder="请选择"
            :class="form.salesSite.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.salesSite.length > 1" type="info"
                >已选{{ form.salesSite.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="(val, key) in initFormData.sites"
              :key="key"
              :label="val"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建人" prop="creatorIds">
          <el-select
            v-model="form.creatorIds"
            placeholder="请选择"
            :class="form.creatorIds.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.creatorIds.length > 1" type="info"
                >已选{{ form.creatorIds.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.creatorIdsList"
              :key="item.id"
              :label="item.creator"
              :value="item.creatorId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="平台类目"
          prop="mercateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="form.mercateName"
            :options="initFormData.merList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'name',
              value: 'categoryId',
              children: 'childList'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="false" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-button
            v-permission="['mercadosalesprohibitioncateDelBtn']"
            type="danger"
            @click="batchDel"
            >批量删除</el-button
          >
        </div>
        <div style="display: flex">
          <el-button type="primary" style="margin-right: 12px">
            <a
              style="color: #fff; text-decoration: none"
              href="/api/lms/static/templet/importProdCateMercadoProhibit.xlsx"
              target="_blank"
              >下载模板</a
            >
          </el-button>
          <el-upload
            :action="'/api/lms/prodCateProhibit/importExcel'"
            :on-success="importSuccess"
            :on-error="importError"
            :show-file-list="false"
          >
            <el-button
              v-permission="['mercadosalesprohibitioncateImportBtn']"
              type="primary"
              >新增导入</el-button
            >
          </el-upload>
        </div>
      </div>
      <vxe-table
        ref="tableDataRef"
        v-loading="tableDataLoading"
        :data="tableData"
        :scroll-y="{ gt: 10 }"
        :height="height"
        :align="'center'"
        border
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="salesSite" title="禁售站点" />
        <vxe-column field="categoryId" title="禁售类目ID" />
        <vxe-column field="fullCateName" title="禁售类目" />
        <vxe-column field="createTime" title="创建时间">
          <template #default="{ row }">
            {{ row.createTime ? parseTime(row.createTime, '{y}-{m}-{d}') : '' }}
          </template>
        </vxe-column>
        <vxe-column field="creator" title="创建人" />
        <vxe-column title="操作"
          ><template #default="{ row }"
            ><el-button type="danger" width="120" @click="merDel(row.id)"
              >删除</el-button
            ></template
          >
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          background
          :page-sizes="[50, 100, 200]"
          layout="prev, pager, next,sizes, total"
          :total="total"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 类目组件 -->
    <CateDialog
      v-if="showCateDialog"
      :show-dialog="showCateDialog"
      :handle-cate-dialog-type="handleCateDialogType"
      :prod-p-id="prodPId"
      @close-dialog="handleCateDialogClose($event)"
    />
  </div>
</template>
<script setup name="publishsmercadomercadosalesprohibitioncate">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { parseTime } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getCateTree } from '@/api/common';

  import CateDialog from '@/components/CateDialog.vue';
  import {
    queryList,
    merDelete,
    getCreatorList
  } from '@/api/publishs/mercadosalesprohibitioncate';

  const currentPage = ref(1);
  const pageSize = ref(50);
  const total = ref(0);

  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
    onSubmit();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    onSubmit();
  };
  // 查询条件
  const form = reactive({
    creatorIds: [],
    salesSite: [],
    mercateName: '',
    categoryIds: []
  });
  // 初始化查询条件
  const initFormData = reactive({
    sites: {
      MLB: '巴西',
      MLM: '墨西哥',
      MCO: '哥伦比亚',
      MLC: '智利'
    },
    creatorIdsList: [],
    merList: [] // 美客多类目
  });
  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 查询条件表单ref
  const formRef = ref();
  // 查询条件表单清空
  const resetForm = function () {
    formRef.value.resetFields();
    form.categoryIds = [];
    form.mercateName = [];
  };
  // 查询条件提交查询
  const onSubmit = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    form.page = currentPage.value;
    form.limit = pageSize.value;
    if (form.mercateName.length && form.mercateName.length != 0) {
      form.categoryIds = [];
      form.mercateName.forEach((item) => {
        form.categoryIds.push(item[item.length - 1]);
      });
    } else {
      form.categoryIds = [];
    }

    let { code, count, data } = await queryList(form);
    if (code == '0000') {
      tableData.value = data;
      total.value = count;
    }
    tableDataLoading.value = false;
  };
  // 批量删除
  const batchDel = async () => {
    let checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    let { code } = await merDelete({ ids });
    if (code == '0000') {
      ElMessage.success('删除成功');
      onSubmit();
    }
  };
  // 单个删除
  const merDel = async (ids) => {
    let { code } = await merDelete({ ids: [ids] });
    if (code == '0000') {
      ElMessage.success('删除成功');
      onSubmit();
    }
  };
  // 导入新增
  const importSuccess = (res) => {
    if (res.code == '0000') {
      let str = '';
      str += `成功${res.data.successCount}条，失败${
        res.data.errorCount
      }条，失败原因：${res.data.failList.join('--')}`;
      ElMessageBox.confirm(str, '导入成功', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      });
    } else {
      ElMessageBox.confirm(res.msg || '导入新增失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
  };
  const importError = () => {
    ElMessage.error('导入新增失败！');
  };
  // 类目组件 start
  const showCateDialog = ref(false);
  const prodPId = ref();
  const handleCateDialogType = ref('');
  const handleCateDialogClose = (e) => {
    if (!e.cate) {
      showCateDialog.value = e.isShow;
      return;
    }
    showCateDialog.value = e.isShow;
  };
  // 类目组件 end
  onMounted(async () => {
    // 美客多类目
    {
      const { data } = await getCateTree();
      initFormData.merList = data;
    }
    // 创建人查询
    {
      const { data } = await getCreatorList();
      initFormData.creatorIdsList = data;
    }
  });
  let tableDataRef = ref();

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 220;
  });
  // 级联多选
  const filterCascader = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };
</script>
<style scoped lang="scss">
  .mt-10 {
    margin-top: 10px;
  }
  // 平台多选框
  .search_item_cascader {
    :deep(.el-input) {
      height: 24px;
    }
    :deep(.el-cascader__tags .el-tag) {
      margin: 0 0 0 5px;
    }
    :deep(.el-tag--small) {
      padding: 0 2px;
    }
    :deep(.el-cascader__tags) {
      flex-wrap: nowrap;

      span:first-child {
        max-width: 40px;
      }
      span:last-child {
        width: 30px;
      }
      input {
        min-width: 10px;
        height: auto;
        margin: 0;
      }
    }
  }
</style>
