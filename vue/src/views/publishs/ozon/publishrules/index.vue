<template>
  <!-- ozon 刊登规则 -->
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
          <z-cascader
            v-model="formData.storeAcctIdList"
            :data="initList.storeList"
          ></z-cascader>
          <!-- <el-cascader
            v-model="formData.storeAcctIdList"
            :options="initList.storeList"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true }"
          ></el-cascader> -->
        </el-form-item>
        <el-form-item label="规则名称" prop="queryRuleName">
          <el-select
            v-model="formData.queryRuleNameInclude"
            filterable
            class="form_left"
          >
            <el-option label="包含" :value="true" />
            <el-option label="不包含" :value="false" />
          </el-select>
          <el-input
            v-model="formData.queryRuleName"
            clearable
            class="form_right"
          />
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
        <!-- <el-form-item label="站点" prop="salesSiteList">
          <MultiSelect
            v-model="formData.salesSiteList"
            :option-obj="{
              optionList: initList.siteList,
              value: 'code',
              label: 'name'
            }"
          />
        </el-form-item> -->

        <el-form-item>
          <el-button
            :loading="tableDataLoading"
            type="primary"
            @click="handleSearch(formRef)"
            >查询</el-button
          ><el-button type="primary" @click="handleResetForm(formRef)"
            >重置</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
    <el-card v-loading="tableDataLoading" class="list_card">
      <div class="page-header">
        <!-- v-permission="['ozon_rules_bacthOnRule', 'ozon_rules_bacthOffRule']" -->
        <el-dropdown class="ml12">
          <el-button type="primary">
            批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <div v-permission="['ozon_rules_bacthOnRule']">
                <el-dropdown-item @click="handleBatchStatus(1)"
                  >批量开启</el-dropdown-item
                >
              </div>
              <div v-permission="['ozon_rules_bacthOffRule']">
                <el-dropdown-item @click="handleBatchStatus(0)"
                  >批量关闭</el-dropdown-item
                >
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="common_batch_btns">
          <div v-permission="['ozon_rules_list_edit']">
            <el-button
              class="ml12"
              type="primary"
              @click="handleDetail({}, 'new')"
              >添加规则</el-button
            >
          </div>
          <!-- <el-button type="primary" @click="handledownloadTpl">
            下载模板
          </el-button>
          <el-button type="primary"
            ><el-upload
              :action="'/api/lms/shopee/shopeeAutoListingRuleController/rule/importEdit'"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :show-file-list="false"
            >
              导入修改
            </el-upload></el-button
          > -->
        </div>
      </div>

      <vxe-grid ref="tableRef" v-bind="gridOptions">
        <template #status_default="{ row }">
          <el-popconfirm
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
                :inactive-value="false"
                :active-value="true"
                inline-prompt
                active-text="开启"
                inactive-text="关闭"
                :loading="row.autoRenewLoading"
              ></el-switch>
            </template>
          </el-popconfirm>
        </template>
        <template #store_nums_default="{ row }">
          <el-link type="primary" @click="handleOpenStoreInfo(row)">{{
            row.storeNums
          }}</el-link>
        </template>
        <template #execution_week_time_default="{ row }">
          <div>{{ getExecutionWeekTime(row.executionWeekTime) }}</div>
        </template>
        <template #remark_default="{ row }">
          <ExpandText :default-line="DEFAULT_TEXT_LINE" :text="row.remark" />
        </template>
        <template #operator_default="{ row }">
          <div>创建人:{{ row.creator }}</div>
          <div v-if="row.modifier">修改人:{{ row.modifier }}</div>
        </template>
        <template #toolbar_default="{ row }">
          <div class="toolbar-btn">
            <div>
              <el-button type="info" @click="handleDetail(row, 'view')"
                >查看</el-button
              >
            </div>
            <!-- <div v-permission="['ozon_rules_addCopyBtn']">
              <el-button type="success" @click="handleOpenCopyDialog(row)"
                >复制</el-button
              >
            </div> -->
            <div v-permission="['ozon_rules_list_edit']">
              <el-button type="primary" @click="handleDetail(row, 'edit')"
                >修改</el-button
              >
            </div>
            <!-- <div>
              <el-button type="primary" @click="handleLogRule(row)"
                >日志</el-button
              >
            </div> -->
            <div v-permission="['ozon_rules_list_edit']">
              <el-popconfirm
                title="是否确认删除当前规则，删除后无法恢复！"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelRule(row)"
              >
                <template #reference>
                  <div>
                    <el-button type="danger">删除</el-button>
                  </div>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </template>
      </vxe-grid>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[50, 100, 300]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <DetailDialog
      v-if="detailVisible"
      v-model="detailVisible"
      :checked-row="checkedRow"
      :init-list="initList"
      @handle-search="handleSearch"
      @get-creator-list="getCreatorList"
    />
    <RuleStore
      v-if="storeInfoVisible"
      v-model="storeInfoVisible"
      :checked-row="checkedRow"
      @handle-search="handleSearch"
    />
    <!-- 复制新增 -->
    <!-- <el-dialog
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
        <el-form-item label="站点" prop="salesSiteList">
          <MultiSelect
            v-model="copyAddFormData.salesSiteList"
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
    </el-dialog> -->
    <PublishRulesLog
      v-if="ozonPublishRulesLogDialog"
      :show-dialog="ozonPublishRulesLogDialog"
      :log-table-data="ozonLogTableData"
      @close-dialog="handleLogRuleClose($event)"
    />
  </div>
</template>

<script setup name="publishsozonpublishrules">
  import { reactive, ref, onMounted } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { getStoreList, getPlatCategoryTreeApi } from '@/api/common';
  import { ElMessage } from 'element-plus';
  import DetailDialog from './components/DetailDialog.vue';
  // import MultiSelect from '@/components/MultiSelect/index.vue';
  import ExpandText from '@/components/ExpandText.vue';
  import RuleStore from './components/RuleStore.vue';
  import { manageListApi } from '@/api/shopee/publishrules';
  import PublishRulesLog from '@/components/PublishRulesLog/index.vue';
  import {
    queryListApi,
    deleteRuleApi,
    getCreatorListApi,
    batchUpdateStatusApi
    // getRuleModifyLogs
  } from '@/api/publishs/ozonpublishrules';
  import { MAIN_COLS, DEFAULT_TEXT_LINE } from './config';
  //   import { View, DocumentCopy, Edit, Delete } from '@element-plus/icons-vue';

  const formData = reactive({
    status: 1,
    queryRuleNameInclude: true,
    storeAcctIdList: []
  });
  const formRef = ref();
  const initList = ref({});
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
      getStoreList('ozon'),
      // getSiteListApi('ozon'),
      manageListApi(),
      getPlatCategoryTreeApi('ozon')
    ])
      .then((res) => {
        initList.value = res[1].data || {};
        initList.value.storeList = res[0]?.data?.children || [];
        // initList.value.siteList = res[1]?.data || [];
        initList.value.ozonCateList = res[2]?.data || [];
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
      const { data } = await getCreatorListApi();
      initList.value.creatorList = data;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const tableDataLoading = ref(false);
  const tableRef = ref();
  const searchCard = ref();
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });

  const handleSearch = async () => {
    tableDataLoading.value = true;
    try {
      const obj = filterSearchParams();
      const { data, count } = await queryListApi(obj);
      gridOptions.data = data;
      paginationData.total = count;
    } catch (err) {
      gridOptions.data = [];
      paginationData.total = 0;
    } finally {
      tableDataLoading.value = false;
    }
  };
  const filterSearchParams = () => {
    const { limit, page } = paginationData;
    const obj = {};
    // 店铺
    if (formData.storeAcctIdList) {
      obj.storeAcctIdList = formData.storeAcctIdList || [];
    }
    let params = {
      ...formData,
      ...obj,
      limit,
      page
    };

    return params;
  };

  // 执行日期（每周）
  const getExecutionWeekTime = (executionWeekTime) => {
    let str = executionWeekTime;
    if (executionWeekTime?.includes('0')) {
      str = executionWeekTime
        .split(',')
        .filter((item) => item !== '0')
        .join();

      str = str.length ? str + ',日' : str + '日';
    }
    return str;
  };

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.queryRuleNameInclude = true;
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
    let curStatus = row.status;
    try {
      statusLoading.value = false;
      const { msg } = await batchUpdateStatusApi({
        id: row.id,
        status: curStatus
      });
      ElMessage.success(msg);
      handleSearch();
    } catch (err) {
      // 将状态改为原值
      row.status = curStatus === false ? true : false;
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
      tableDataLoading.value = true;
      let status = [false, true];
      let params = {
        id: checkedList.map((item) => item.id).join(','),
        status: status[newStatus]
      };
      const { msg } = await batchUpdateStatusApi(params);
      ElMessage.success(msg || '操作成功');
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };

  //   // 下载
  //   const handledownloadTpl = () => {
  //     window.open(DOWNLOAD_TPL_URL);
  //   };

  //   // 导入修改
  //   const uploadSuccess = (res) => {
  //     if (res.code === '0000') {
  //       ElMessageBox.alert(
  //         `<div style="white-space: break-spaces;">${res.msg}</div>`,
  //         '导入结果',
  //         {
  //           confirmButtonText: '确认',
  //           dangerouslyUseHTMLString: true,
  //           type: 'success',
  //           closeOnClickModal: false,
  //           closeOnPressEscape: false,
  //           center: true
  //         }
  //       );
  //       handleSearch();
  //     } else {
  //       uploadError(res);
  //     }
  //   };
  //   const uploadError = (res) => {
  //     ElMessageBox.alert(
  //       `<div style="white-space: break-spaces;">${res.msg}</div>`,
  //       '导入结果',
  //       {
  //         confirmButtonText: '确认',
  //         dangerouslyUseHTMLString: true,
  //         type: 'error',
  //         closeOnClickModal: false,
  //         closeOnPressEscape: false,
  //         center: true
  //       }
  //     );
  //   };
  //#endregion 批量操作end

  const checkedRow = ref();
  const detailVisible = ref(false);
  const handleDetail = (row, operationType) => {
    detailVisible.value = true;
    let executionWeekTime = [];
    let status = 1;
    if (operationType !== 'new') {
      if (row?.executionWeekTime) {
        executionWeekTime = row.executionWeekTime.split(',').map(Number);
      }
      status = row.status;
    } else {
      // 新增默认刊登日期全选
      executionWeekTime = [1, 2, 3, 4, 5, 6, 0];
    }
    checkedRow.value = {
      ...row,
      operationType,
      executionWeekTime,
      status
    };
  };
  // 删除
  const handleDelRule = async (row) => {
    try {
      const { msg } = await deleteRuleApi(row.id);
      ElMessage.success(msg);
      tableRef.value.remove(row);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  // 日志弹窗--start
  // const ozonPublishRulesLogDialog = ref(false);
  // const ozonLogTableData = ref();
  // const handleLogRule = async (row) => {
  //   try {
  //     let params = {
  //       ruleId: row.id,
  //       platCode: 'ozon'
  //     };
  //     const { data } = await getRuleModifyLogs(params);
  //     ozonLogTableData.value = data.map((item) => ({
  //       ...item,
  //       ruleName: row.ruleName
  //     }));
  //     ozonPublishRulesLogDialog.value = true;
  //   } catch (err) {
  //     console.log('err :>> ', err);
  //   }
  // };
  // const handleLogRuleClose = (e) => {
  //   ozonLogTableData.value = [];
  //   ozonPublishRulesLogDialog.value = e.isShow;
  // };
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
