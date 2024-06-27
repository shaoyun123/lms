<template>
  <!--shopee-描述过滤词 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item label="站点" prop="salesSite">
          <el-select v-model="formData.salesSite" clearable filterable>
            <el-option
              v-for="item in initList.siteList"
              :key="item"
              :label="item.name"
              :value="item.code"
          /></el-select>
        </el-form-item>
        <el-form-item label="过滤词中文" prop="prohibitWord">
          <el-input
            v-model="formData.prohibitWord"
            placeholder="模糊搜索"
            clearable
          />
        </el-form-item>
        <el-form-item label="过滤词英文" prop="prohibitWordEn">
          <el-input
            v-model="formData.prohibitWordEn"
            placeholder="模糊搜索"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button
          ><el-button @click="handleResetForm(formRef)"
            >重置</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
    <el-card class="list_card">
      <el-tabs
        v-model="activeKey"
        type="card"
        class="demo-tabs"
        @tab-click="handleTab"
      >
        <el-tab-pane :label="`数量(${paginationData.total})`" name="total">
          <vxe-grid ref="tableRef" v-bind="gridOptions">
            <template #toolbar_default="{ row }">
              <el-button type="primary" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-popconfirm
                title="确定删除吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDel(row)"
              >
                <template #reference>
                  <el-button type="danger"> 删除 </el-button>
                </template>
              </el-popconfirm>
            </template>
          </vxe-grid>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="paginationData.page"
              v-model:page-size="paginationData.limit"
              background
              :page-sizes="[100, 200, 500]"
              :small="true"
              layout="total, sizes, prev, pager, next"
              :total="paginationData.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="common_batch_btns">
        <el-button type="danger" @click="handleBatchDel">批量删除</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </el-card>
    <!-- 详情 -->
    <Detail
      v-if="detailVisible"
      v-model="detailVisible"
      :detail="detailRow"
      :init-list="initList"
      @handle-search="queryPage"
    />
  </div>
</template>

<script setup name="shopeepublishsdescprohibitword">
  import { onMounted, ref, reactive } from 'vue';
  import { comGetTableHeight } from '@/utils/common';
  import { queryPageApi, delApi } from '@/api/shopee/descprohibitword';
  import { getSiteListApi } from '@/api/shopee/common';
  import Detail from './components/Detail.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  const initList = reactive({});

  onMounted(async () => {
    const { data = {} } = await getSiteListApi();
    initList.siteList = data.siteList || [];
    gridOptions.height = comGetTableHeight(searchCardRef, true, true);
  });

  //   #region 查询
  const formData = reactive({});
  const formRef = ref();
  const searchCardRef = ref(null);
  const paginationData = reactive({
    total: 0,
    limit: 100,
    page: 1
  });
  const handleSearch = async () => {
    paginationData.page = 1;
    queryPage();
  };
  const queryPage = async () => {
    const { limit, page } = paginationData;
    try {
      const { data = [], count } = await queryPageApi({
        limit,
        page,
        ...formData
      });
      gridOptions.data = data;
      paginationData.total = count;
    } catch (err) {
      gridOptions.data = [];
      paginationData.total = 0;
      console.log('err :>> ', err);
    }
  };
  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };
  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    queryPage();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    queryPage();
  };

  const activeKey = ref('total');
  const handleTab = ({ paneName }) => {
    activeKey.value = paneName;
    handleSearch();
  };
  // #endregion 查询

  //   #region 表格
  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showFooter: true,
    height: 200,
    columnConfig: {
      resizable: true
    },
    showOverflow: true,
    scrollY: { enable: false },
    rowConfig: { isCurrent: true, isHover: true, keyField: 'id' },
    editConfig: {
      trigger: 'click',
      mode: 'cell'
    },
    data: [],
    columns: [
      { type: 'checkbox', width: 60 },
      {
        field: 'salesSite',
        title: '站点',
        formatter: ({ cellValue }) =>
          initList.siteList.find((v) => v.code === cellValue).name +
          `(${cellValue})`
      },
      {
        field: 'prohibitWord',
        title: '过滤词中文'
      },
      {
        field: 'prohibitWordEn',
        title: '过滤词英文'
      },
      {
        field: 'toolbar',
        title: '操作',
        width: 200,
        slots: { default: 'toolbar_default' }
      }
    ],
    footerMethod() {}
  });
  //   #endregion 表格

  //   #region 详情弹窗
  const detailVisible = ref(false);
  const detailRow = ref({});
  const handleAdd = () => {
    detailVisible.value = true;
    detailRow.value = {};
  };
  const handleEdit = (row) => {
    detailVisible.value = true;
    detailRow.value = row;
  };
  //   #endregion 详情弹窗
  //   删除
  const handleBatchDel = () => {
    // 获取选中数据
    const checkedRowList = tableRef.value.getCheckboxRecords();
    if (!checkedRowList.length) {
      return ElMessage.warning('请选择数据！');
    }
    ElMessageBox.confirm('确定要删除吗？', '提示', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      handleDel(checkedRowList, true);
    });
  };
  const handleDel = async (checkedRows, isBatch = false) => {
    const _checkedRows = isBatch ? checkedRows : [checkedRows];
    const idList = _checkedRows.map((v) => v.id);
    await delApi(idList);
    tableRef.value.remove(checkedRows);
    paginationData.total = paginationData.total - idList.length;
    ElMessage.success('操作成功');
  };
</script>

<style lang="scss" scoped>
  :deep(.vxe-table--render-default .vxe-cell) {
    padding: 5px 10px;
  }
</style>
