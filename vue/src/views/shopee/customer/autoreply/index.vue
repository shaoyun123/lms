<template>
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="form"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item label="站点" prop="siteList">
          <MultiSelect
            v-model="form.siteList"
            :option-obj="{
              optionList: initFormData.sites,
              label: 'name',
              value: 'code'
            }"
          />
        </el-form-item>
        <el-form-item label="店铺" prop="storeAcctIdList">
          <el-select-v2
            v-model="form.storeAcctIdList"
            placeholder="请选择"
            :options="initFormData.storeData"
            style="width: 240px"
            multiple
            collapse-tags
            clearable
            filterable
            @change="radioSearch('store')"
          >
          </el-select-v2>
        </el-form-item>
        <el-form-item label="创建人" prop="creatorId">
          <el-select
            v-model="form.creatorId"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="item in initFormData.creators"
              :key="item.creatorId"
              :label="item.creator"
              :value="item.creatorId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <!-- 已启用、已关闭 -->
          <el-select v-model="form.status" placeholder="请选择" clearable>
            <el-option label="已启用" :value="true" />
            <el-option label="已关闭" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="tableDataLoading"
            type="primary"
            @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs
        v-model="activeName"
        v-loading="tableDataLoading"
        type="card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="item in autoReplyTypeList"
          :key="item.code"
          :label="`${item.type}(${item.count === undefined ? '' : item.count})`"
          :name="item.code"
        >
          <vxe-grid ref="tableRef" v-bind="gridOptions">
            <template #status_default="{ row, rowIndex }">
              <div @click="handleStatusChange(row, rowIndex)">
                <el-switch
                  v-model="row.status"
                  :active-value="true"
                  :inactive-value="false"
                />
              </div>
            </template>
            <template #autoReplyType_default="{ row }">
              <div>
                {{ autoReplyTypeObj[row.autoReplyType] }}
              </div>
            </template>
            <template #salesSite_default="{ row }">
              <div>
                {{ siteObj[row.salesSite] }}
              </div>
            </template>
            <template #storeCount_default="{ row }">
              <div class="primary_color" @click="tableStore(row)">
                {{ row.storeCount }}
              </div>
            </template>
            <template #sendVoucher_default="{ row }">
              <el-switch
                v-model="row.sendVoucher"
                :active-value="true"
                :inactive-value="false"
                @change="handleChangeSendVoucher(row)"
              />
            </template>
            <template #verbalTrick_default="{ row }">
              <ExpandText :text="row.verbalTrick" />
            </template>
            <template #verbalTrick_cod_default="{ row }">
              <div>
                <ExpandText
                  :text="`COD：${row.verbalTrick}`"
                  :default-line="2"
                />
              </div>
              <div>
                <ExpandText
                  :text="`非COD：${row.notCodVerbalTrick}`"
                  :default-line="2"
                />
              </div>
            </template>

            <template #operator_default="{ row }">
              <div v-if="row.creator">创建人:{{ row.creator }}</div>
              <div v-if="row.modifier">修改人:{{ row.modifier }}</div>
            </template>
            <template #toolbar_default="{ row }">
              <div style="display: flex">
                <el-button type="primary" @click="tableEdit(row)"
                  >修改</el-button
                >
                <el-button type="danger" @click="getProdDel(row)"
                  >删除</el-button
                >
              </div>
            </template>
          </vxe-grid>
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              background
              :page-sizes="[50, 100, 300]"
              :small="true"
              layout="total, sizes, prev, pager, next"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn" style="display: flex">
        <div class="w150">
          <el-select v-model="batchOption">
            <el-option value="" label="批量操作" />
            <el-option
              v-permission="['lazadaAutoReplyBathDelBtn']"
              value="1"
              label="批量删除"
              @click="getProdBatchDel"
            />
            <el-option
              v-permission="['lazadaAutoReplyBathOpenBtn']"
              value="2"
              label="批量开启"
              @click="handleStatusBatchChange(true)"
            />
            <el-option
              v-permission="['lazadaAutoReplyBathCloseBtn']"
              value="3"
              label="批量关闭"
              @click="handleStatusBatchChange(false)"
            />
          </el-select>
        </div>
        <div class="ml10 w150">
          <el-select v-model="downLoadTpl">
            <el-option
              v-for="item in downLoadTplList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click="handleDownLoadTpl(item)"
            ></el-option>
          </el-select>
        </div>
        <el-upload
          v-model:file-list="fileList"
          class="upload-demo"
          accept="xlsx,xls"
          :show-file-list="false"
          action="/api/chat/shopee/autoReplyRule/batchAddRulesByImportExcel"
          :before-upload="handleExportBefore"
          :on-success="handleExportResult"
          :on-error="handleExportError"
        >
          <el-button type="primary" class="ml10">导入</el-button>
        </el-upload>
        <el-button type="primary" class="ml10" @click="tableEdit">
          新增</el-button
        >
        <el-button type="primary" class="ml10" @click="handleSetReplyRule">
          回复规则</el-button
        >
      </div>
    </el-card>
    <!-- 新增&修改 -->
    <Detail
      v-if="showDetail"
      v-model="showDetail"
      :detail-data="detailData"
      :init-form-data="initFormData"
      :auto-reply-type-list="autoReplyTypeList"
      @get-creator-list="getCreatorList"
      @search="onSubmit"
    />
    <!-- 店铺 -->
    <Store
      v-if="showStore"
      :is-visible="showStore"
      :rule-id="ruleId"
      :sales-site="salesSite"
      @close="showStoreCloseLog"
      @save="changeStoreNum"
    />
    <ReplyRuleSettting v-if="replyRuleVisible" v-model="replyRuleVisible" />
  </div>
</template>
<script setup name="shopeecustomerautoreply">
  // /* eslint-disable */
  import { ref, reactive, computed, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getSiteListApi, getStoreListApi } from '@/api/shopee/common.js';
  import {
    queryPageApi,
    getCreatorApi,
    listAutoReplyTypeApi,
    listDelayShipOrderStatusApi,
    listChangeProductOrderStatusApi,
    listOAOrderStatusApi,
    listPlatLogisticsStatusApi,
    listPlatOrderStatusApi,
    updateRuleApi,
    updateRuleStatusApi,
    deleteApi,
    initApi
  } from '@/api/shopee/autoreply';
  import Detail from './components/Detail.vue';
  import Store from './components/Store.vue';
  import ReplyRuleSettting from './components/ReplyRuleSetting.vue';
  import { BasicColObj } from './config';
  import ExpandText from '@/components/ExpandText.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import { uniqBy } from 'lodash-es';

  const activeName = ref(1);

  // 仓库订单状态
  let orderProcessStatus = {};

  // 查询条件
  const form = reactive({
    siteList: [],
    storeAcctIdList: [],
    status: null,
    creatorId: 1217
  });
  // 初始化查询条件
  const initFormData = reactive({
    sites: [],
    storeData: [],
    creators: [],
    orderType: []
  });

  const autoReplyTypeList = ref([]);

  const currentPage = ref(1);
  const pageSize = ref(100);
  const total = ref(0);
  const batchOption = ref('');
  const autoReplyTypeObj = reactive({});
  const siteObj = reactive({});

  onMounted(async () => {
    Promise.all([
      getStoreListApi(),
      getSiteListApi(),
      getCreatorApi(),
      listAutoReplyTypeApi(),
      listDelayShipOrderStatusApi(),
      listChangeProductOrderStatusApi(),
      listOAOrderStatusApi(),
      listPlatLogisticsStatusApi(),
      listPlatOrderStatusApi(),
      initApi()
    ])
      .then((res) => {
        // 店铺
        initFormData.storeData = res[0].data.map((item) => ({
          value: item.id,
          label: item.storeAcct
        }));
        // 站点
        initFormData.sites = res[1]?.data?.siteList || [];
        (res[1]?.data?.siteList || []).forEach((item) => {
          siteObj[item.code] = item.name;
        });
        // 创建人
        initFormData.creators = res[2].data;
        // 回复类型
        res[3].data.forEach((item) => {
          autoReplyTypeObj[item.code] = item.type;
        });
        autoReplyTypeList.value = res[3].data.filter((item) => item.code !== 4);

        // 仓库订单状态
        initFormData.orderType = res[3].data;
        for (let key in res[3].data) {
          orderProcessStatus[res[3].data[key]] = key;
        }
        // 延长发货-仓库订单状态
        initFormData.delayShipOrderStatusList = uniqBy(res[4].data, 'code');
        // 换货-仓库订单状态
        initFormData.changeProductOrderStatusList = uniqBy(res[5].data, 'code');
        // 取消订单确认-OA 订单状态
        initFormData.orderProcessStatus = res[6].data.orderProcessStatus;
        // COD订单发货确认-平台订单状态
        initFormData.platOrderStatus = res[8].data;
        // COD签收提醒/关税提醒-平台订单物流状态
        initFormData.platLogisticsStatusList = res[7].data;
        // 时间单位
        initFormData.timeValueTypeEnum = res[9].data.timeValueTypeEnum;
      })
      .catch((err) => ElMessage.error(err));
  });
  const getCreatorList = async () => {
    const { data } = await getCreatorApi();
    initFormData.creators = data;
  };

  const radioSearch = (type) => {
    if (type == 'site' && form.siteList.length != 0) {
      form.storeAcctIdList = [];
    } else if (type == 'store' && form.storeAcctIdList.length != 0) {
      form.siteList = [];
    }
  };

  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 220;
  });
  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    height,
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
    columns: BasicColObj[1],
    data: []
  });

  // 查询条件表单ref
  const formRef = ref();
  // 查询条件表单清空
  const resetForm = function () {
    formRef.value.resetFields();
  };
  // 查询条件提交查询
  const onSubmit = async () => {
    // if (form.siteList.length != 0 && form.storeAcctIdList.length != 0) {
    //   return ElMessage.warning('站点店铺请选其一');
    // }
    tableDataLoading.value = true;
    tableData.value = null;
    form.page = currentPage.value;
    form.limit = pageSize.value;
    gridOptions.data = [];
    const tabIndex = autoReplyTypeList.value.findIndex(
      (item) => item.code === activeName.value
    );
    total.value = 0;
    try {
      let { count, data } = await queryPageApi({
        ...form,
        autoReplyType: activeName.value
      });

      gridOptions.data = data;
      total.value = count;
    } catch (err) {
      total.value = 0;
    }
    autoReplyTypeList.value[tabIndex].count = total.value;
    tableDataLoading.value = false;
  };
  const tabIndex = ref(0);
  const handleClick = (tab) => {
    tabIndex.value = tab.index;
    activeName.value = tab.paneName;
    currentPage.value = 1;
    gridOptions.columns = BasicColObj[activeName.value];
    onSubmit();
  };

  // #region 设置店铺
  const showStore = ref(false);
  const ruleId = ref();
  const salesSite = ref();
  let _curRow = null;
  // 设置店铺
  const tableStore = async (row) => {
    ruleId.value = row.id;
    _curRow = row;
    salesSite.value = row.salesSite;
    showStore.value = true;
  };
  const changeStoreNum = (storeCount) => {
    _curRow.storeCount = storeCount;
  };
  const showStoreCloseLog = () => {
    showStore.value = false;
  };
  // #endregion 设置店铺

  // #region批量操作
  // #region 开启&关闭任务
  const handleStatusChange = async (row) => {
    try {
      const { msg } = await updateRuleStatusApi({
        ruleIdList: row.id,
        status: row.status
      });
      ElMessage.success(msg);
    } catch (err) {
      row.status = !row.status;
    }
  };
  const handleStatusBatchChange = async (status) => {
    let checkedData = tableRef.value[tabIndex.value].getCheckboxRecords();
    if (!checkedData.length) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    ElMessageBox.confirm(`确认要批量${status ? '开启' : '关闭'}?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'Warning'
    }).then(async () => {
      try {
        const { msg } = await updateRuleStatusApi({
          ruleIdList: ids.join(','),
          status
        });
        checkedData.forEach((item) => {
          item.status = status;
        });
        ElMessage.success(msg);
      } catch (err) {
        console.log('err :>> ', err);
      }
    });
  };
  // #endregion 开启&关闭任务
  // #region 商品删除--start--
  const getProdBatchDel = () => {
    let checkedData = tableRef.value[tabIndex.value].getCheckboxRecords();
    if (!checkedData.length) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let idList = checkedData.map((item) => item.id);
    ElMessageBox.confirm(
      `本次需要删除${checkedData.length}条，请确认是否全部删除?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'Warning'
      }
    ).then(async () => {
      const { code, msg } = await deleteApi(idList);
      if (code === '0000') {
        ElMessage.success(msg);
        tableRef.value[tabIndex.value].removeCheckboxRow();
        changeCount(checkedData.length);
      }
    });
  };
  const getProdDel = (row) => {
    console.log('row.id :>> ', row.id);
    ElMessageBox.confirm(`请再次确认是否删除?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'Warning'
    }).then(async () => {
      const { code, msg } = await deleteApi([row.id]);
      if (code === '0000') {
        ElMessage.success(msg);
        tableRef.value[tabIndex.value].remove([row]);
        changeCount(1);
      }
    });
  };
  const changeCount = (delCountTotal) => {
    const count = total.value - delCountTotal;
    autoReplyTypeList.value[tabIndex.value].count = count;
    total.value = count;
  };
  // #endregion 商品删除--end--

  // #region 优惠券
  const handleChangeSendVoucher = async (row) => {
    try {
      const params = { ...row };
      if (row.orderStatusList) {
        params.orderStatusList = row.orderStatusList.map(
          (item) => item.code || item
        );
      }
      const { msg } = await updateRuleApi(params);
      ElMessage.success(msg);
    } catch (err) {
      row.sendVoucher = !row.sendVoucher;
    }
  };
  // #endregion 优惠券

  // 选中的当前行数据
  const showDetail = ref(false);
  const detailData = ref({});
  // 编辑
  const tableEdit = async (row) => {
    showDetail.value = true;
    detailData.value = { ...row };
  };
  // const showDetailCloseLog = (val) => {
  //   showDetail.value = false;
  //   if (val == true) {
  //     onSubmit();
  //   }
  // };
  // #region 上传下载
  const downLoadTpl = ref();
  const downLoadTplList = [
    {
      value: 1,
      fileName: '延迟发货导入模板.xlsx',
      url: '/api/lms/static/templet/ShopeeChatAutoReplyDelayShipTemplate.xlsx',
      label: '延长发货模板'
    },
    {
      value: 2,
      fileName: '换货导入模板.xlsx',
      url: '/api/lms/static/templet/ShopeeChatAutoReplyChangeProductTemplate.xlsx',
      label: '换货模板'
    },
    {
      value: 3,
      fileName: '差评导入模板.xlsx',
      url: '/api/lms/static/templet/ShopeeChatAutoReplyNegativeCommentTemplate.xlsx',
      label: '差评模板'
    },
    {
      value: 5,
      fileName: '乐言自动回复导入模板.xlsx',
      url: '/api/lms/static/templet/ShopeeChatAutoReplyLeyanTemplate.xlsx',
      label: '乐言自动回复'
    }
  ];
  const uploadLoading = ref(false);
  const handleDownLoadTpl = (tplInfo) => {
    ElMessage.success('开始下载');
    window.location.href = tplInfo.url;
  };
  const fileList = ref();
  const handleExportBefore = () => {
    uploadLoading.value = true;
  };
  const handleExportResult = (result) => {
    const { code, msg, data } = result;
    uploadLoading.value = false;
    if (code === '0000') {
      ElMessage.success(msg);
    } else {
      ElMessage.warning(msg);
    }
    if (data?.downloadId) {
      const { ruleType, errCount, downloadId } = data;
      const typeObj = {
        1: '延长发货',
        2: '换货',
        3: '差评',
        4: '店铺优惠券',
        5: '乐言自动回复'
      };
      const str = `导入模板类型:${
        typeObj[ruleType] || ''
      }<br>失败数量:${errCount}<span class="ztt-a ml10" onclick="shopAutoReply_DownloadFail('${ruleType}','${downloadId}')">失败原因</span>`;
      ElMessageBox.alert(str, '操作结果', {
        dangerouslyUseHTMLString: true
      });
    }
  };
  const handleExportError = () => {
    uploadLoading.value = false;
    // 展示错误信息
  };
  // #endregion 上传下载
  // 自动回复规则配置
  const replyRuleVisible = ref(false);
  const handleSetReplyRule = () => {
    replyRuleVisible.value = true;
  };

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
</script>
<style scoped lang="scss">
  .mt-10 {
    margin-top: 10px;
  }
  .primary_color {
    color: var(--primary-color);
  }
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }
  :deep(.el-tabs__item) {
    padding: 0 10px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .w150 {
    width: 150px;
  }
</style>
