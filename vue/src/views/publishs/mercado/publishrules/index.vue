<template>
  <!-- 美客多 刊登规则 -->
  <div class="publishrules_wrapper app-container" :loading="pageLoading">
    <el-card ref="searchCard" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="formData.ruleName" clearable class="form_right" />
        </el-form-item>
        <el-form-item label="店铺" prop="storeIdList">
          <el-select
            v-model="formData.storeIdList"
            placeholder="请选择"
            :class="formData.storeIdList.length > 1 ? 'hideTag' : ''"
            clearable
            filterable
            collapse-tags
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.storeIdList.length > 1" type="info"
                >已选{{ formData.storeIdList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initList.storeList"
              :key="item.id"
              :label="item.storeAcct"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" filterable clearable>
            <el-option label="已开启" :value="true" />
            <el-option label="已关闭" :value="false" />
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
      <div style="display: flex; justify-content: flex-end">
        <el-dropdown>
          <el-button type="primary">
            批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleBatchStatus(true)"
                >批量开启</el-dropdown-item
              >

              <el-dropdown-item @click="handleBatchStatus(false)"
                >批量关闭</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          style="margin-left: 20px"
          type="primary"
          @click="handleDetail({}, 'new')"
          >添加规则</el-button
        >
      </div>
      <vxe-table
        ref="tableRef"
        v-loading="tableDataLoading"
        :data="tableData"
        :height="height"
        :align="'center'"
        border
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="status" title="状态">
          <template #default="{ row }">
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
              </template> </el-popconfirm></template
        ></vxe-column>
        <vxe-column field="ruleName" title="规则名称" />
        <vxe-column field="storeNums" title="应用店铺数量">
          <template #default="{ row }">
            <el-link type="primary" @click="handleOpenStoreInfo(row)">{{
              row.storeNums
            }}</el-link>
          </template></vxe-column
        >
        <vxe-column field="executionWeekTime" title="执行日期（每周）">
          <template #default="{ row }">
            {{ row.executionWeekTime.replaceAll('0', '日') }}
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注" />
        <vxe-column field="creator" title="创建人" />
        <vxe-column field="modifier" title="修改人" />
        <vxe-column title="操作" width="170"
          ><template #default="{ row }"
            ><div style="display: flex">
              <el-tooltip effect="dark" content="编辑" placement="left">
                <el-button
                  type="primary"
                  :icon="Edit"
                  @click="handleDetail(row, 'edit')"
                />
              </el-tooltip>

              <el-popconfirm
                title="确定要删除此规则吗？"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelRule(row)"
              >
                <template #reference>
                  <div>
                    <el-tooltip effect="dark" content="删除" placement="left">
                      <el-button type="danger" :icon="Delete" />
                    </el-tooltip>
                  </div>
                </template>
              </el-popconfirm>
              <el-tooltip effect="dark" content="日志" placement="left">
                <el-button type="primary" @click="handleLogRule(row)"
                  >日志</el-button
                >
              </el-tooltip>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
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
      v-model="detailVisible"
      :checked-row="checkedRow"
      :init-list="initList"
      @handle-search="handleSearch"
    />
    <RuleStore
      v-model="storeInfoVisible"
      :checked-row="checkedRow"
      @handle-search="handleSearch"
    />
    <PublishRulesLog
      v-if="mercadoPublishRulesLogDialog"
      :show-dialog="mercadoPublishRulesLogDialog"
      :log-table-data="mercadoLogTableData"
      @close-dialog="handleLogRuleClose($event)"
    />
  </div>
</template>

<script setup name="publishsmercadopublishrules">
  import { reactive, ref, onMounted, computed } from 'vue';
  import { ElMessage } from 'element-plus';
  // import { ElMessage, ElMessageBox } from 'element-plus';
  import DetailDialog from './components/DetailDialog.vue';
  import RuleStore from './components/RuleStore.vue';
  import useUserStore from '@/store/modules/user';
  import {
    searchMercadoAutoListingRuleList,
    updateMercadoAutoListingRuleStatus,
    deleteMercadoAutoListingRuleById,
    getRuleModifyLogs,
    listAllUser
  } from '@/api/publishs/mercadopublishrules';
  import { getStoreInfo } from '@/api/eBay/payments';
  import { Edit, Delete } from '@element-plus/icons-vue';
  import {
    getCateTree,
    getLogisListApi,
    getProdTagListApi,
    getDevTypeListApi
  } from '@/api/common';
  import PublishRulesLog from '@/components/PublishRulesLog/index.vue';

  const formData = ref({
    storeIdList: []
  });
  const formRef = ref();
  const initList = ref({});
  const pageLoading = ref(false);
  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);
  onMounted(async () => {
    pageLoading.value = true;
    let params = {
      roleNames: 'mercado专员',
      // orgId: mercadoData.formData.orgId,
      // salePersonId: mercadoData.formData.salePersonId,
      platCode: 'mercado',
      lmsAppUserName: userName.value
    };
    Promise.all([
      listAllUser(),
      getStoreInfo(params),
      getCateTree(),
      getProdTagListApi(),
      getLogisListApi(),
      getDevTypeListApi()
    ])
      .then((res) => {
        initList.value.creatorList = res[0].data;
        initList.value.storeList = res[1].data;
        // 美客多类目
        initList.value.merList = res[2].data;
        //商品标签
        initList.value.prodTagMap = res[3].data;
        //物流属性
        initList.value.logisAttrEnums = res[4].data;
        //开发类型
        initList.value.devTypeEnums = res[5].data;
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        pageLoading.value = false;
      });
  });

  const tableDataLoading = ref(false);
  const tableRef = ref();
  const searchCard = ref();
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });

  const tableData = ref([]);

  const handleSearch = async () => {
    tableDataLoading.value = true;
    formData.value.limit = paginationData.limit;
    formData.value.page = paginationData.page;
    formData.value.creatorId && formData.value.creatorId != ''
      ? (formData.value.creatorIdList = [formData.value.creatorId])
      : (formData.value.creatorIdList = []);
    formData.value.concat = true;
    try {
      const { data, count } = await searchMercadoAutoListingRuleList(
        formData.value
      );
      tableData.value = data;
      paginationData.total = count;
    } catch (err) {
      console.log('err :>> ', err);
      tableData.value.data = [];
    } finally {
      tableDataLoading.value = false;
    }
  };

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.value.queryRuleNameInclude = true;
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
      const { msg } = await updateMercadoAutoListingRuleStatus({
        ids: row.id,
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
    row.status = row.status ? false : true;
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
      let params = {
        ids: checkedList.map((item) => item.id).join(),
        status: newStatus
      };
      const { msg } = await updateMercadoAutoListingRuleStatus(params);
      ElMessage.success(msg || '操作成功');
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };

  const checkedRow = ref();
  const detailVisible = ref(false);
  const handleDetail = (row, operationType) => {
    detailVisible.value = true;
    let executionWeekTime = [];
    if (operationType === 'new') {
      executionWeekTime = [1, 2, 3, 4, 5, 6, 0];
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
      const { msg } = await deleteMercadoAutoListingRuleById(row.id);
      ElMessage.success(msg);
      tableRef.value.remove(row);
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  // 日志弹窗--start
  const mercadoPublishRulesLogDialog = ref(false);
  const mercadoLogTableData = ref();
  const handleLogRule = async (row) => {
    try {
      const { data } = await getRuleModifyLogs(row.id);
      mercadoLogTableData.value = data.map((item) => ({
        ...item,
        ruleName: row.ruleName
      }));
      mercadoPublishRulesLogDialog.value = true;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const handleLogRuleClose = (e) => {
    mercadoLogTableData.value = [];
    mercadoPublishRulesLogDialog.value = e.isShow;
  };
  // 日志弹窗--end
  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 200;
  });
</script>

<style lang="scss" scoped></style>
