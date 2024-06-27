<template>
  <!-- 美科多 禁售类目-->
  <div class="app-container">
    <el-card class="search_card">
      <el-form ref="formRef" :model="form" :inline="true" class="search_form">
        <el-form-item
          label="TikTok类目"
          prop="tiktokName"
          class="search_item_cascader"
        >
          <z-cascader
            v-model="form.tiktokName"
            :data="initFormData.merList"
            :props="{
              label: 'cnName',
              children: 'children',
              value: 'categoryId'
            }"
          ></z-cascader>
          <!-- <el-cascader
            v-model="form.tiktokName"
            :options="initFormData.merList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'cnName',
              value: 'categoryId'
            }"
          ></el-cascader> -->
        </el-form-item>
        <el-form-item label="创建人" prop="creators">
          <el-select
            v-model="form.creators"
            placeholder="请选择"
            :class="form.creators.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="form.creators.length > 1" type="info"
                >已选{{ form.creators.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.creatorIdsList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
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
          <el-button type="primary" @click="add">新增</el-button>
          <el-button type="primary" @click="managementWhitelist"
            >白名单管理</el-button
          >
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
        :edit-config="{
          trigger: 'dblclick',
          mode: 'cell'
        }"
        @edit-closed="editClosed"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="categoryId" title="禁售类目ID" />
        <vxe-column field="fullCateNameChinese" title="禁售类目" />
        <vxe-column
          title="备注"
          field="remark"
          :edit-render="{ name: 'input' }"
        >
        </vxe-column>
        <vxe-column field="createTime" title="创建时间">
          <template #default="{ row }">
            {{ row.createTime ? parseTime(row.createTime, '{y}-{m}-{d}') : '' }}
          </template>
        </vxe-column>
        <vxe-column field="creator" title="创建人" />
        <vxe-column title="操作"
          ><template #default="{ row }"
            ><el-button type="danger" width="120" @click="Del(row.id)"
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

    <!-- 新增&修改 -->
    <Whitelist
      v-if="showWhitelist"
      :is-visible="showWhitelist"
      :detail-data="whitelistData"
      :init-form-data="initFormData"
      @close="managementWhitelistClose"
    />
    <!-- 新增类目 -->
    <el-dialog
      v-model="cateVisible"
      width="500"
      title="选择类目"
      destroy-on-close
      :close-on-click-modal="false"
      @close="cateVisible = false"
    >
      <div class="cate_cascader">
        <z-cascader
          v-model="cate"
          :data="initFormData.merList"
          :props="{
            label: 'cnName',
            children: 'children',
            value: 'categoryId'
          }"
        ></z-cascader>
        <!-- <el-cascader
          ref="cateRef"
          v-model="cate"
          :options="initFormData.merList"
          :filter-method="filterCascader"
          filterable
          clearable
          collapse-tags
          :props="{
            multiple: true,
            label: 'cnName',
            value: 'categoryId'
          }"
        ></el-cascader> -->
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSaveCate"> 保存 </el-button>
          <el-button @click="cateVisible = false"> 关闭 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="publishstiktoksalesProhibitionCate">
  import { ref, reactive, onMounted, computed } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { parseTime } from '@/utils/common';
  // import { ElMessage, ElMessageBox } from 'element-plus';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getPlatCategoryTreeApi } from '@/api/common';

  import Whitelist from './components/whitelist.vue';
  import CateDialog from '@/components/CateDialog.vue';
  import {
    queryPage,
    addProhibitCate,
    batchRemoveProhibitCate,
    getAllCreators,
    getAllCreatorsWhitelist,
    updateRemarkById
  } from '@/api/publishs/tiktoksalesprohibitioncate';

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
    creators: [],
    tiktokName: []
  });
  // 初始化查询条件
  const initFormData = reactive({
    creatorIdsList: [],
    creatorIds: [],
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
  };
  // 查询条件提交查询
  const onSubmit = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    form.page = currentPage.value;
    form.limit = pageSize.value;
    if (form.tiktokName.length && form.tiktokName.length != 0) {
      // form.tiktokName.forEach((item) => {
      //   form.categoryIds.push(item[item.length - 1]);
      // });
      form.categoryIds = form.tiktokName;
    } else {
      form.categoryIds = [];
    }
    let { code, data } = await queryPage(form);
    if (code == '0000') {
      tableData.value = data.list;
      total.value = data.total;
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
    Del(ids.join(','));
  };
  // 单个删除
  const Del = (ids) => {
    ElMessageBox.confirm('确认要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      let { code } = await batchRemoveProhibitCate({ ids });
      if (code == '0000') {
        ElMessage.success('删除成功');
        onSubmit();
      }
    });
  };
  // 新增
  const cate = ref([]);
  // const cateRef = ref();
  const cateVisible = ref(false);
  const add = async () => {
    cate.value = [];
    cateVisible.value = true;
  };
  const handleSaveCate = async () => {
    // const checkNode = cateRef.value.getCheckedNodes();
    if (!cate.value.length) return ElMessage.warning('请选择类目');
    // let cateId = checkNode.map((item) => item);
    const { code, msg } = await addProhibitCate({
      categoryIds: cate.value.join(',')
    });
    if (code == '0000') {
      ElMessage.success(msg);
      onSubmit();
    }
    cateVisible.value = false;
  };
  // 选中的当前行数据
  const showWhitelist = ref(false);
  const whitelistData = ref({});
  // 编辑
  const managementWhitelist = async (row) => {
    showWhitelist.value = true;
    whitelistData.value = row;
  };
  const managementWhitelistClose = (val) => {
    showWhitelist.value = false;
    if (val == true) {
      onSubmit();
    }
  };
  // 编辑单元格更新
  const editClosed = async (table) => {
    const { code } = await updateRemarkById({
      id: table.row.id,
      remark: table.row.remark
    });
    // 成功不用更新，失败刷新表格
    if (code != '0000') {
      onSubmit();
    } else {
      ElMessage.success('修改成功');
    }
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
      const { data } = await getPlatCategoryTreeApi('tiktok');
      initFormData.merList = data;
    }
    // 创建人查询
    {
      const { data } = await getAllCreators();
      initFormData.creatorIdsList = data;
    }
    // 白名单创建人
    {
      const { data } = await getAllCreatorsWhitelist();
      initFormData.creatorIds = data;
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
  // const filterCascader = (node, keyword) => {
  //   if (
  //     node.label.trim().includes(keyword.trim()) ||
  //     node.text.trim().includes(keyword.trim())
  //   ) {
  //     return node;
  //   }
  // };
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
