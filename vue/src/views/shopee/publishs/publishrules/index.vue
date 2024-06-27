<template>
  <!-- shopee 刊登规则 -->
  <div class="publishrules_wrapper app-container" :loading="pageLoading">
    <el-card ref="searchCard" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item
          label="店铺"
          prop="storeAcctIdList"
          class="search_item_cascader"
        >
          <ZCascader
            v-model="formData.storeAcctIdList"
            :data="initList.storeList"
          />
        </el-form-item>
        <el-form-item label="规则名称" prop="ruleName">
          <el-select
            v-model="formData.queryRuleNameInclude"
            filterable
            clearable
            class="form_left"
          >
            <el-option label="包含" :value="true" />
            <el-option label="不包含" :value="false" />
          </el-select>
          <el-input v-model="formData.ruleName" clearable class="form_right" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" filterable clearable>
            <el-option label="已开启" :value="1" />
            <el-option label="已关闭" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="creatorId" label="创建人">
          <el-select v-model="formData.creatorId" filterable clearable>
            <el-option
              v-for="item in initList.creatorList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="刊登方式" prop="ruleType">
          <el-select v-model="formData.ruleType" filterable clearable>
            <el-option label="按店铺刊登" :value="1" />
            <el-option label="按模板刊登" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" prop="siteIdList">
          <MultiSelect
            v-model="formData.siteIdList"
            :option-obj="{
              optionList: initList.siteList,
              value: 'code',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item label="规则ID" prop="ruleIds">
          <el-input
            v-model="formData.ruleIds"
            clearable
            placeholder="多个用英文逗号隔开"
            @blur="commonDivideCommaNum($event)"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="false"
          label="OA类目"
          prop="cateIds"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="formData.cateIds"
            :options="initList.oaCateList"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'title',
              children: 'data'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="CNSC类目"
          prop="cateIdsCNSC"
          class="search_item_cascader"
          ><el-cascader
            v-model="formData.cateIdsCNSC"
            :options="initList.cnscCateLsit"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true, label: 'tag' }"
          ></el-cascader
        ></el-form-item>
        <el-form-item label="刊登月份" prop="executionMonthList">
          <el-select
            v-model="formData.queryExecutionMonthInclude"
            filterable
            clearable
            class="form_left"
          >
            <el-option label="包含" :value="true" />
            <el-option label="不包含" :value="false" />
          </el-select>
          <MultiSelect
            v-model="formData.executionMonthList"
            class="form_right"
            :option-obj="{
              optionList: PUBLISH_MONTH_ENUM,
              label: 'label',
              value: 'value'
            }"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(formRef)"
            >查询</el-button
          ><el-button type="primary" @click="handleResetForm(formRef)"
            >重置</el-button
          ></el-form-item
        >
        <!-- <div style="float: right"> -->
        <el-form-item>
          <el-popover
            placement="bottom"
            :width="400"
            :visible="moreQueryVisible"
          >
            <template #reference>
              <el-button
                :active="moreQueryVisible"
                style="margin-right: 16px"
                @click="moreQueryVisible = !moreQueryVisible"
                >更多查询条件</el-button
              >
            </template>
            <el-form
              ref="formRef_pop"
              :model="formData_pop"
              class="formRef_pop"
              :label-width="110"
            >
              <el-form-item label="刊登商品标签" prop="prodAttrQueryList">
                <el-select
                  v-model="formData_pop.queryProdAttrInclude"
                  filterable
                  clearable
                  class="form_left"
                >
                  <el-option label="包含" :value="true" />
                  <el-option label="不包含" :value="false" />
                </el-select>
                <MultiSelect
                  v-model="formData_pop.prodAttrQueryList"
                  :option-obj="{
                    optionList: initList.prodTagMap,
                    value: 'name',
                    label: 'name'
                  }"
                  class="form_right"
                />
                <!-- :need-option-disabled="true"
                  :option-disabled-param="formData_pop.prodAttrList || []"
                  @option-disabled="optionDisabled" -->
              </el-form-item>
              <el-form-item
                label="不刊登商品标签"
                prop="filterProdAttrQueryList"
              >
                <el-select
                  v-model="formData_pop.queryFilterProdAttrInclude"
                  filterable
                  clearable
                  class="form_left"
                >
                  <el-option label="包含" :value="true" />
                  <el-option label="不包含" :value="false" />
                </el-select>
                <MultiSelect
                  v-model="formData_pop.filterProdAttrQueryList"
                  :option-obj="{
                    optionList: initList.prodTagMap,
                    value: 'name',
                    label: 'name'
                  }"
                  class="form_right"
                /> </el-form-item
              ><el-form-item label="备注" prop="remark">
                <el-input v-model="formData_pop.remark" clearable />
              </el-form-item>
              <el-form-item label="刊登日期" prop="executeDayQueryList">
                <el-select
                  v-model="formData_pop.queryExecuteDayInclude"
                  filterable
                  clearable
                  class="form_left"
                >
                  <el-option label="包含" :value="true" />
                  <el-option label="不包含" :value="false" />
                </el-select>
                <MultiSelect
                  v-model="formData_pop.executeDayQueryList"
                  class="form_right"
                  :option-obj="{
                    optionList: PUBLISH_WEEK_TIME,
                    label: 'label',
                    value: 'value'
                  }"
                />
              </el-form-item>
              <el-form-item label="开发类型" prop="devTypeQueryList">
                <MultiSelect
                  v-model="formData_pop.devTypeQueryList"
                  style="width: 100%"
                  :option-obj="{
                    optionList: initList.devTypeEnums
                  }"
                />
              </el-form-item>
              <el-form-item label="物流属性" prop="logisticAttrQueryList">
                <MultiSelect
                  v-model="formData_pop.logisticAttrQueryList"
                  style="width: 100%"
                  :option-obj="{
                    optionList: initList.logisAttrEnums
                  }" /></el-form-item
              ><el-form-item label="商品归属人" prop="bizzOwerQueryList">
                <MultiSelect
                  v-model="formData_pop.bizzOwerQueryList"
                  style="width: 100%"
                  :option-obj="{
                    optionList: initList.bizzOwerList,
                    value: 'user_name',
                    label: 'user_name'
                  }"
              /></el-form-item>
              <el-form-item label="发货仓库" prop="shippingWarehouseId">
                <el-select
                  v-model="formData_pop.shippingWarehouseId"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in initList.warehouseList"
                    :key="index"
                    :value="item.id"
                    :label="item.warehouseName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-popover>
          <!-- </div> -->
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list_card">
      <div class="page-header">
        <el-tabs
          v-model="activeKey"
          type="card"
          class="demo-tabs"
          @tab-click="handleTab"
        >
          <el-tab-pane
            v-for="item in tabList"
            :key="item.label"
            :label="`${item.label}(${item.count})`"
            :name="item.status"
          ></el-tab-pane
        ></el-tabs>
        <div class="common_batch_btns">
          <right-tool
            :active-key="activeKey"
            @handle-search="handleSearch"
            @handle-batch-status="handleBatchStatus"
            @handle-batch-edit="handleBatchEdit"
            @handle-detail="handleDetail"
          >
          </right-tool>
        </div>
      </div>

      <vxe-grid ref="tableRef" v-bind="gridOptions">
        <template #status_default="{ row }">
          <el-popconfirm
            v-if="row.status !== 2"
            title="确定要修改此规则状态吗？"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleChangeStatus(row)"
            @cancel="handleKeepStatus(row)"
          >
            <template #reference>
              <el-switch
                v-model="row.status"
                size="default"
                :inactive-value="0"
                :active-value="1"
                inline-prompt
                active-text="开启"
                inactive-text="关闭"
                :loading="row.autoRenewLoading"
              ></el-switch>
            </template>
          </el-popconfirm>
          <el-switch
            v-else
            :model="false"
            size="default"
            :inactive-value="0"
            :active-value="1"
            :disabled="activeKey === '2'"
          ></el-switch>
        </template>
        <template #store_nums_default="{ row }">
          <el-link type="primary" @click="handleOpenStoreInfo(row)">{{
            row.storeNums
          }}</el-link>
        </template>
        <template #executionWeekTime_default="{ row }">
          <div>
            刊登月份:{{ row.executionMonths
            }}{{ row.executionMonths ? '月' : '' }}
          </div>
          <div>刊登日期(每周):{{ row.executionWeekTime }}</div>
        </template>
        <template #category_level_and_category_id_default="{ row }">
          <div style="padding: 5px 0">
            <ExpandText :text="row.categoryLevelAndCategoryIdCnsc" />
          </div>
        </template>
        <!-- <template #category_level_name_default="{ row }">
          <div>{{ row.categoryLevelAndName }}</div>
        </template> -->
        <template #category_level_name_cnsc_default="{ row }">
          <!-- <div v-if="row.categoryLevelAndNameCnsc && row.categoryLevelAndName">
            {{ row.cateAndOr ? 'and' : 'or' }}
          </div> -->
          <ExpandText :text="row.categoryLevelAndNameCnsc" />
        </template>
        <template #remark_default="{ row }">
          <ExpandText :default-line="DEFAULT_TEXT_LINE" :text="row.remark" />
        </template>
        <template #toolbar_default="{ row }">
          <div class="toolbar-btn">
            <div>
              <el-tooltip effect="dark" content="查看" placement="left"
                ><el-button
                  type="info"
                  :icon="View"
                  @click="handleDetail(row, 'view')"
                ></el-button
              ></el-tooltip>
            </div>
            <div v-permission="['shopeeRules_addCopyBtn']">
              <el-tooltip effect="dark" content="复制" placement="left">
                <el-button
                  type="warning"
                  :icon="DocumentCopy"
                  @click="handleOpenCopyDialog(row)"
                />
              </el-tooltip>
            </div>
            <div>
              <el-button type="info" @click="handleViewLog(row)"
                >日志</el-button
              >
            </div>
            <template v-if="row.status !== 2">
              <div v-permission="['shopee_rules_list_edit']">
                <el-tooltip effect="dark" content="编辑" placement="left">
                  <el-button
                    type="primary"
                    :icon="Edit"
                    @click="handleDetail(row, 'edit')"
                  />
                </el-tooltip>
              </div>

              <div v-permission="['shopee_rules_list_edit']">
                <el-popconfirm
                  title="确定要删除此规则吗？"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="handleDelRule(row)"
                >
                  <template #reference>
                    <div>
                      <el-tooltip
                        v-if="row.status === 0"
                        effect="dark"
                        content="删除"
                        placement="left"
                      >
                        <el-button type="danger" :icon="Delete" />
                      </el-tooltip>
                    </div>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </div>
        </template>
      </vxe-grid>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[1000, 2000, 5000]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <DetailDialog
      v-model="detailVisible"
      :checked-row="checkedRow"
      :init-list="initList"
      @handle-search="handleSearch"
      @refresh-creator="getCreatorList"
    />
    <SetDetailDialog
      v-model="setDetailVisible"
      :checked-row="checkedRow"
      :init-list="initList"
      @handle-search="handleSearch"
      @refresh-creator="getCreatorList"
    />
    <RuleStore
      v-model="storeInfoVisible"
      :checked-row="checkedRow"
      @handle-search="handleSearch"
    />
    <PublishRulesLog
      v-if="mercadoPublishRulesLogDialog"
      :show-dialog="mercadoPublishRulesLogDialog"
      :log-table-data="logTableData"
      @close-dialog="handleLogRuleClose($event)"
    />
    <!-- 复制新增 -->
    <el-dialog
      v-model="copyAddVisible"
      title="复制新增"
      :width="600"
      :close-on-click-modal="false"
      :align-center="true"
    >
      <el-form
        ref="copyAddFormRef"
        :model="copyAddFormData"
        :label-width="150"
        :rules="copyAddFormRule"
        size="default"
      >
        <el-form-item label="站点" prop="salesSites">
          <MultiSelect
            v-model="copyAddFormData.salesSites"
            :option-obj="{
              optionList: initList.siteList,
              value: 'code',
              label: 'name'
            }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          :loading="copyAddLoading"
          @click="handleCopyAdd(copyAddFormRef)"
          >新增</el-button
        >
        <el-button @click="copyAddVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="shopeepublishspublishrules">
  import { reactive, ref, onMounted } from 'vue';
  import { getStoreList, queryOaCategory, getCustomers } from '@/api/common';
  import { getSiteListApi } from '@/api/shopee/common';
  import { ElMessage } from 'element-plus';
  import { commonDivideCommaNum } from '@/utils/divide';
  import DetailDialog from './components/DetailDialog.vue';
  import SetDetailDialog from './components/SetDetailDialog.vue';

  import MultiSelect from '@/components/MultiSelect/index.vue';
  import ExpandText from '@/components/ExpandText.vue';
  import RuleStore from './components/RuleStore.vue';
  import PublishRulesLog from '@/components/PublishRulesLog/index.vue';
  import {
    queryCnscCategoryApi,
    queryPageApi,
    getUserListApi,
    updateStatusApi,
    manageListApi,
    batchUpdateStatusApi,
    copyAddApi,
    delRuleApi,
    queryModifyLogsApi,
    getShopeeShippingWarehouses
  } from '@/api/shopee/publishrules';
  import {
    MAIN_COLS,
    DEL_COLS,
    DEFAULT_TEXT_LINE,
    PUBLISH_WEEK_TIME,
    PUBLISH_MONTH_ENUM
  } from './config';
  import { View, DocumentCopy, Edit, Delete } from '@element-plus/icons-vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import RightTool from './components/RightTool.vue';

  let moreQueryVisible = ref(false);

  const formData = reactive({
    status: 1,
    queryRuleNameInclude: true,
    queryExecutionMonthInclude: true
  });
  const formData_pop = reactive({
    queryProdAttrInclude: true,
    queryFilterProdAttrInclude: true,
    queryExecuteDayInclude: true
  });
  const formRef_pop = ref();
  const formRef = ref();
  const initList = ref({});
  const activeKey = ref('0,1');
  const tabList = ref([
    { label: '数量', count: 0, status: '0,1' },
    { label: '已删除规则', count: 0, status: '2' }
  ]);
  const pageLoading = ref(false);
  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    height: '400',
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    scrollY: { enabled: false },
    columns: MAIN_COLS,
    data: [],
    toolbarConfig: {
      custom: true
    }
  });
  onMounted(async () => {
    pageLoading.value = true;

    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCard?.value?.$el?.clientHeight;
    gridOptions.height = clientHeight - 120 - searchCardHeight;
    Promise.all([
      getStoreList('shopee'),
      getSiteListApi(),
      queryOaCategory(),
      queryCnscCategoryApi(),
      manageListApi(),
      getCustomers(),
      getShopeeShippingWarehouses()
    ])
      .then((res) => {
        initList.value = res[4].data || {};
        initList.value.bizzOwerList = res[5].data?.userList || [];
        initList.value.storeList = res[0]?.data?.children || [];
        initList.value.siteList = res[1]?.data?.siteList || [];
        initList.value.oaCateList = res[2]?.data || [];
        initList.value.cnscCateLsit = res[3]?.data || [];
        initList.value.warehouseList = res[6]?.data || [];
        getCreatorList();
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        pageLoading.value = false;
      });
  });
  // 创建人
  const getCreatorList = async () => {
    try {
      const { data } = await getUserListApi();
      initList.value.creatorList = data;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const tableRef = ref();
  const searchCard = ref();
  const paginationData = reactive({
    total: 0,
    limit: 1000,
    page: 1
  });

  const handleSearch = async () => {
    try {
      const obj = filterSearchParams();
      const { data, count } = await queryPageApi(obj);
      gridOptions.data = data;
      paginationData.total = count;
      getTabCount(count);
    } catch (err) {
      paginationData.total = 0;
      gridOptions.data = [];
    }
  };
  const filterSearchParams = () => {
    const { limit, page } = paginationData;
    const obj = {};
    // OA类目
    if (formData.cateIds) {
      obj.cateIds = (formData.cateIds || []).map(
        (item) => item[item.length - 1]
      );
    }
    // CNSC类目
    if (formData.cateIdsCNSC) {
      obj.cateIdsCNSC = (formData.cateIdsCNSC || []).map(
        (item) => item[item.length - 1]
      );
    }
    if (activeKey.value === '2') {
      obj.status = 2;
    }

    // 规则id
    obj.ruleIds = formData.ruleIds ? formData.ruleIds.split(',') : [];

    let params = {
      ...formData_pop, // 更多查询条件
      ...formData,
      ...obj,
      limit,
      page
    };

    return params;
  };

  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (item.status === activeKey.value) {
        item.count = totalCount;
      }
    });
  };

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.queryRuleNameInclude = true;
    formData.queryExecutionMonthInclude = true;
    formRef_pop.value.resetFields();
    formData_pop.queryProdAttrInclude = true;
    formData_pop.queryFilterProdAttrInclude = true;
    formData_pop.queryExecuteDayInclude = true;
  };
  const handleTab = ({ paneName }) => {
    activeKey.value = paneName;
    if (paneName === '2') {
      gridOptions.columns = DEL_COLS;
    } else {
      gridOptions.columns = MAIN_COLS;
    }
    handleSearch();
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

  //#region 修改状态start
  const statusLoading = ref(false);
  const handleChangeStatus = async (row) => {
    try {
      statusLoading.value = false;
      const { msg } = await updateStatusApi({
        id: row.id,
        status: row.status
      });
      ElMessage.success(msg);
      handleSearch();
    } catch (err) {
      row.status = !row.status;
      console.log('err :>> ', err);
    } finally {
      statusLoading.value = false;
    }
  };
  const handleKeepStatus = (row) => {
    row.status = row.status ? 0 : 1;
  };
  //#endregion 修改状态end

  // 店铺设置
  const storeInfoVisible = ref(false);
  const handleOpenStoreInfo = (row) => {
    storeInfoVisible.value = true;
    checkedRow.value = { ...row };
  };
  //#region 批量操作start
  const handleBatchStatus = async (newStatus) => {
    // 获取数据
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    const checkedLen = checkedList.length;
    if (!checkedLen) return ElMessage.warning('请选择数据');
    try {
      let params = {
        ids: checkedList.map((item) => item.id).join(),
        status: newStatus
      };
      const { msg } = await batchUpdateStatusApi(params);
      ElMessage.success(msg || '操作成功');
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const setDetailVisible = ref(false);
  const handleBatchEdit = () => {
    // 获取数据
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    const checkedLen = checkedList.length;
    if (!checkedLen) return ElMessage.warning('请选择数据');
    checkedRow.value = checkedList.map((item) => item.id);
    setDetailVisible.value = true;
  };
  //#endregion 批量操作end

  const checkedRow = ref();
  const detailVisible = ref(false);
  const handleDetail = (row, operationType) => {
    detailVisible.value = true;
    let executionWeekTime = [];
    if (operationType === 'new') {
      executionWeekTime = [1, 2, 3, 4, 5, 6, 0];
      row.executionMonthSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      // 发货仓库，义乌仓设置为默认仓
      const warehouseName = '义乌仓';
      const obj = (initList.value.warehouseList || []).find(
        (v) => v.warehouseName == warehouseName
      );
      if (obj) {
        row.shippingWarehouseId = obj.id;
      }
    } else {
      if (row?.executionWeekTime) {
        let _executionWeekTime = row?.executionWeekTime.replace('日', '0');
        executionWeekTime = _executionWeekTime.split(',').map(Number);
      }
    }
    checkedRow.value = {
      ...row,
      operationType,
      executionWeekTime
    };
  };
  // 删除
  const handleDelRule = async (row) => {
    try {
      const { msg } = await delRuleApi(row.id);
      ElMessage.success(msg);
      tableRef.value.remove(row);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  //#region 复制新增start
  const copyAddVisible = ref(false);
  const copyAddFormRule = ref({
    salesSites: { required: true, trigger: 'change', message: '请选择站点' }
  });
  const copyAddFormData = ref({});
  const copyAddFormRef = ref();
  const handleOpenCopyDialog = (row) => {
    copyAddVisible.value = true;
    copyAddFormData.value = {};
    copyAddFormData.value.id = row.id;
  };
  const copyAddLoading = ref(false);
  const handleCopyAdd = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        copyAddLoading.value = true;
        try {
          let salesSitesObj = {};
          initList.value.siteList.forEach((item) => {
            salesSitesObj[item.code] = item.name;
          });
          await copyAddApi({
            id: copyAddFormData.value.id,
            salesSites: copyAddFormData.value.salesSites.map((e) => ({
              saleSite: e,
              siteName: salesSitesObj[e]
            }))
          });
          ElMessage.success('新增成功');
          copyAddVisible.value = false;
          copyAddFormData.value = {};
          handleSearch();
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          copyAddLoading.value = false;
        }
      } else {
        console.log('error submit!', fields);
      }
    });
  };
  //#endregion 复制新增end

  // #region 日志
  const mercadoPublishRulesLogDialog = ref(false);
  const logTableData = ref([]);
  const handleViewLog = async (row) => {
    const { data } = await queryModifyLogsApi({
      platCode: 'shopee',
      ruleId: row.id
    });
    logTableData.value = data.map((item) => ({
      ...item,
      ruleName: row.ruleName
    }));
    mercadoPublishRulesLogDialog.value = true;
  };

  const handleLogRuleClose = () => {
    mercadoPublishRulesLogDialog.value = false;
  };
  // #endregion日志
</script>

<style lang="scss" scoped>
  @import './index.scss';
  .formRef_pop {
    .el-form-item__content .el-select {
      width: 120px;
    }
  }
</style>
