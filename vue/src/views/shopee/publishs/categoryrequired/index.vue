<template>
  <!--shopee-类目必填项 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item label="默认值" prop="defaultValue">
          <el-select v-model="formData.defaultValue" filterable>
            <el-option label="无" :value="0" />
            <el-option label="有" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="属性名" prop="displayAttributeName">
          <el-input
            v-model="formData.displayAttributeName"
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
                修改
              </el-button>
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
    </el-card>
    <!-- 详情 -->
    <Detail
      v-if="detailVisible"
      v-model="detailVisible"
      :detail="detailRow"
      @handle-search="queryPage"
    />
  </div>
</template>

<script setup name="shopeepublishscategoryrequired">
  import { onMounted, ref, reactive } from 'vue';
  import { comGetTableHeight } from '@/utils/common';
  import { queryPageApi } from '@/api/shopee/categoryrequired';
  import { getSiteListApi } from '@/api/shopee/common';
  import Detail from './components/Detail.vue';
  const initList = reactive({});

  onMounted(async () => {
    const { data = {} } = await getSiteListApi();
    initList.siteList = data.siteList || [];
    gridOptions.height = comGetTableHeight(searchCardRef, true, true);
  });

  //   #region 查询
  const formData = reactive({ displayAttributeName: '', defaultValue: 0 });
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
    rowConfig: { isCurrent: true, isHover: true },
    editConfig: {
      trigger: 'click',
      mode: 'cell'
    },
    data: [],
    columns: [
      {
        field: 'attributeId',
        title: 'attribute_id'
      },
      {
        field: 'displayAttributeName',
        title: '属性名'
      },
      {
        field: 'defaultValue',
        title: '默认值'
      },
      {
        field: 'defaultValueId',
        title: '默认值id'
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
  const handleEdit = (row) => {
    detailVisible.value = true;
    detailRow.value = row;
  };
  //   #endregion 详情弹窗
  //   删除
</script>

<style lang="scss" scoped>
  :deep(.vxe-table--render-default .vxe-cell) {
    padding: 5px 10px;
  }
</style>
