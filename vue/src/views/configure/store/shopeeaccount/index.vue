<template>
  <!-- shopee店铺页面 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <page-form
        ref="pageFormRef"
        :init-list="initList"
        @handle-search="handleSearch"
      ></page-form>
    </el-card>

    <el-card class="list_card">
      <div class="flex_between" style="margin-bottom: 8px">
        <div>
          <el-tag style="height: 24px">数量({{ paginationData.total }})</el-tag>
          <ExcelDropdown
            :select-records="selectRecords"
            @get-selected-list="getSelectedList"
            @search="handleSearch"
            @update-store-list="updateStoreList"
          />
        </div>
        <div class="common_batch_btns">
          <el-button
            v-if="isTestEnv"
            type="primary"
            class="ml12"
            @click="getTestEnvToken"
            >复制亿品token</el-button
          >
          <el-button
            type="primary"
            class="ml12"
            :loading="StoreAddressInfoLoading"
            @click="handlegetStoreAddressInfo"
            >获取店铺地址</el-button
          >
          <el-button
            v-permission="['shopeeaccountChatAuth']"
            type="primary"
            @click="handleAuth({}, 'chat')"
            >chat授权</el-button
          >
          <el-button
            v-permission="['shopeeaccountAdsAuth']"
            type="primary"
            @click="handleAuth({}, 'ads')"
            >广告账户授权</el-button
          >
          <el-button type="success" @click="handleSyncListing()"
            >同步listing</el-button
          >
          <el-dropdown class="ml12">
            <el-button type="primary">
              批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <template v-for="item in batchList" :key="item.value">
                  <template v-if="item.permission">
                    <div v-permission="[item.permission]">
                      <el-dropdown-item @click="handleBatch(item)"
                        >{{ item.label }}
                      </el-dropdown-item>
                    </div>
                  </template>
                  <el-dropdown-item v-else @click="handleBatch(item)"
                    >{{ item.label }}
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
            v-permission="['shopeeaccountEditAndAdd']"
            type="primary"
            class="ml12"
            @click="handlePlatAcctount('add')"
            >添加shopee账号基本信息</el-button
          >
        </div>
      </div>
      <vxe-grid ref="tableRef" v-bind="gridOptions">
        <template #storeAcct_default="{ row }">
          <div>{{ row.storeAcct }}</div>
          <div>{{ row.siteId }}</div>
          <el-tag v-for="v in row.storeTagList || []" :key="v">{{ v }}</el-tag>
        </template>
        <template #merchant_default="{ row }">
          <div>{{ row.merchantName || '' }}</div>
          <div>{{ row.merchantId || '' }}</div>
        </template>
        <template #shopIsMall_default="{ row }">
          <div v-if="row.shopIsMall">已开启</div>
          <el-button type="primary" @click="handleSetMallStore(row)"
            >设置</el-button
          >
        </template>
        <template #personInfo_default="{ row }">
          <div>销售:{{ row.salesperson }}</div>
          <div>客服:{{ row.customServicer }}</div>
          <div>组长:{{ row.leaderName }}</div>
          <div>主管:{{ row.sellLeaderName }}</div>
        </template>
        <template #status_default="{ row }">
          <el-text :type="!row.status ? 'danger' : ''">{{
            row.status ? '已启用' : '已停用'
          }}</el-text>
        </template>
        <template #authTime_default="{ row }">
          <div>店铺:<br />{{ transferDate(row.authTime) }}</div>
          <div>chat:<br />{{ transferDate(row.chatAuthExpiredTime) }}</div>
        </template>
        <template #listingLimit_default="{ row }">
          <!-- ？0需不需要展示 -->
          <div>Listing总额度：{{ row.listingQuotaLimit || '-' }}</div>
          <div>Listing已使用：{{ row.listingQuotaUsed || '-' }}</div>
          <div>预售额度：{{ row.shopeePreOrderItemLimit || '-' }}</div>
          <div>预售已使用：{{ row.shopeePreOrderItemNum || '-' }}</div>
          <div>预售占比：{{ row.shopeePreOrderItemRatio || '-' }}</div>
        </template>
        <template #shopeePreOrderConfigStatus_default="{ row }">
          <div v-if="row.shopeePreOrderConfigStatus === 1">已开启</div>
          <div v-else-if="row.shopeePreOrderConfigStatus === 0">已取消</div>
          <div v-else-if="row.shopeePreOrderConfigStatus === 2">已暂停</div>
          <el-button type="primary" @click="handleSetPreSale(row)"
            >设置</el-button
          >
        </template>
        <template #autoPublishCateIds_default="{ row }">
          <div>{{ row.autoDelete ? '已开启' : '已关闭' }}</div>
          <el-button type="primary" @click="handleAutoDelSet(false, row)"
            >设置</el-button
          >
        </template>
        <template #autoUploadVideo_default="{ row }">
          <div>{{ row.autoUploadVideo ? '已开启' : '已关闭' }}</div>
          <el-button type="primary" @click="handleAutoUploadVideoSet(row)"
            >设置</el-button
          >
        </template>
        <template #sexyImgFilter_default="{ row }">
          <el-button type="primary" @click="handleSexyImgFilterSet(row)"
            >设置</el-button
          ></template
        >
        <template #syncStatus_default="{ row }">
          <el-text v-if="[1, 2].includes(row.syncStatus)" type="primary"
            >同步中</el-text
          >
          <el-text v-else-if="row.syncStatus === 3" type="success"
            >同步成功</el-text
          >
          <el-text v-else-if="row.syncStatus === 4" type="info"
            >同步失败</el-text
          >
          <el-text v-else type="danger">未同步</el-text>
          <div>{{ transferDate(row.lastSyncTime) }}</div>
        </template>
        <template #syncDesc_default="{ row }">
          <ExpandText :text="row.syncDesc" />
        </template>
        <template #tool_default="{ row }">
          <div v-permission="['shopeeaccountEditAndAdd']">
            <div>
              <el-link
                :underline="false"
                type="primary"
                @click="handleAuth(row, 'store')"
                >重新授权</el-link
              >
            </div>
            <div>
              <el-link
                :underline="false"
                type="primary"
                @click="handlePlatAcctount('update', row)"
                >编辑</el-link
              >
            </div>
            <div>
              <el-link
                :underline="false"
                type="primary"
                @click="handleStoreTag(false, row)"
                >店铺标签</el-link
              >
            </div>
          </div>
          <el-link
            :underline="false"
            type="success"
            @click="handleSyncDiscount(row.id)"
            >同步促销</el-link
          >
          <div v-permission="['shopeeaccountCheckAccessToken']">
            <el-link
              :underline="false"
              type="primary"
              @click="handleAuthManage(row)"
              >查看授权</el-link
            >
          </div>
        </template>
      </vxe-grid>

      <div class="pagination">
        <el-pagination
          v-model:currentPage="paginationData.page"
          v-model:page-size="paginationData.limit"
          background
          :page-sizes="[300, 500, 1000]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="paginationData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 组件 -->
    <div>
      <!-- mall店铺 -->
      <MallStoreDialog
        v-if="showMallDialog"
        v-model="showMallDialog"
        :edit-info="editInfo"
        @search="handleSearch"
      />

      <!-- 预售 -->
      <PreSaleDialog
        v-if="showPreSaleDialog"
        v-model="showPreSaleDialog"
        :edit-info="editInfo"
        @search="handleSearch"
      />

      <!-- 自动删除设置 -->
      <AutoDelDialog
        v-if="showAutoDelDialog"
        v-model="showAutoDelDialog"
        :edit-info="editInfo"
        :select-records="selectRecords"
        @search="handleSearch"
      />

      <!-- 自动上传视频设置 -->
      <UploadVideoDialog
        v-if="showUploadVideoDialog"
        v-model="showUploadVideoDialog"
        :edit-info="editInfo"
        :select-records="selectRecords"
        @search="handleSearch"
      />

      <!-- 性感图片过滤设置 -->
      <SexyImgFilter
        v-if="showSexyImgDialog"
        v-model="showSexyImgDialog"
        :edit-info="editInfo"
        @search="handleSearch"
      />

      <!-- 批量修改信息 -->
      <UpdatePersonDialog
        v-if="showUpdatePersonDialog"
        v-model="showUpdatePersonDialog"
        :select-records="selectRecords"
        @search="handleSearch"
      />

      <!-- 增加/修改 店铺信息 -->
      <PlatAccountDialog
        v-if="showPlatAccountDialog"
        v-model="showPlatAccountDialog"
        :action="action"
        :edit-info="editInfo"
        :user-data="{}"
        @search="handleSearch"
        @get-shopee-warehouse-list="getShopeeWarehouseList"
        @update-store-list="updateStoreList"
      />

      <!-- 授权弹窗 -->
      <AuthInfoDialog
        v-if="showAuthDialog"
        :show-auth-dialog="showAuthDialog"
        :auth-type="authType"
        :edit-info="editInfo"
        @close="closeAuthDialog"
      />
      <!-- 查看授权弹框 -->
      <AuthManage
        v-if="showAuthManage"
        :is-visible="showAuthManage"
        :auth-info="authInfo"
        @close="closeAuthManageDialog"
      />

      <!-- 店铺标签 -->
      <StoreTagDialog
        v-if="showStoreTagDialog"
        v-model="showStoreTagDialog"
        :edit-info="editInfo"
        :select-records="selectRecords"
        @search="handleSearch"
      />

      <!-- 同步listing的进度条 -->
      <SyncListingDialog
        v-if="showSyncListingDialog"
        v-model="showSyncListingDialog"
        :select-records="selectRecords"
      />
    </div>
  </div>
</template>

<script setup name="configurestoreshopeeaccount">
  import { reactive, ref, onMounted, computed, onActivated } from 'vue';
  import {
    getStoreList,
    getStoreTagListApi,
    getCustomerListApi
  } from '@/api/common';
  import {
    queryPageApi,
    batchUpdateAcctStatusApi,
    batchSyncItemBoostApi,
    getTokenFromEpProdApi,
    syncItemShopeeDiscountApi
  } from '@/api/configure/shopeeaccount';
  import {
    listAllMerchantNameApi,
    getShopeeShippingWarehousesApi
  } from '@/api/shopee/common';
  import { transferDate, comGetTableHeight } from '@/utils/common';
  import { transBlob } from '@/utils/downloadFile';
  import { Columns } from './config.js';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import PlatAccountDialog from './components/PlatAccountDialog.vue';
  import AuthInfoDialog from './components/AuthInfoDialog.vue';
  import AuthManage from '@/components/AuthManage/index.vue';
  import SexyImgFilter from './components/SexyImgFilter.vue';
  import ExpandText from '@/components/ExpandText.vue';
  import MallStoreDialog from './components/MallStoreDiaLog.vue';
  import PreSaleDialog from './components/PreSaleDialog.vue';
  import AutoDelDialog from './components/AutoDelDialog.vue';
  import UploadVideoDialog from './components/UploadVideoDialog.vue';
  import UpdatePersonDialog from './components/UpdatePersonDialog.vue';
  import StoreTagDialog from './components/StoreTagDialog.vue';
  import SyncListingDialog from '@/components/AccountSyncListing/index.vue';
  import ExcelDropdown from './components/ExcelDropdown.vue';
  import { throttle, isEmpty } from 'lodash-es';
  import { getItem, removeItem } from '@/utils/storage';
  import PageForm from './components/PageForm.vue';
  import { refreshStoreCascaderoApi } from '@/api/configure/common';

  const pageFormRef = ref();

  const initList = reactive({
    customServiceList: [], // 客服
    merchantNameList: [],
    storeList: [],
    storeTagList: []
  });

  // 店铺列表数据
  const paginationData = reactive({
    limit: 500,
    page: 1,
    total: 0
  });
  const tableRef = ref(null);
  const selectRecords = ref([]); // 列表选中的数据

  const searchCardRef = ref();

  // 获取枚举值，将默认值选中
  onMounted(async () => {
    Promise.all([
      getStoreList('shopee'),
      getStoreTagListApi('shopee'),
      listAllMerchantNameApi(),
      getCustomerListApi({ role: 'shopee客服' }),
      getShopeeShippingWarehousesApi()
    ]).then((res) => {
      initList.storeList = res[0].data.children || [];
      initList.storeTagList = (res[1].data || []).map((v) => ({
        ...v,
        id: v.name
      }));
      initList.merchantNameList = (res[2]?.data || []).map((v) => ({
        name: v,
        id: v
      }));
      initList.customServiceList = res[3]?.data || [];
    });
    getShopeeWarehouseList();
    gridOptions.height = comGetTableHeight(searchCardRef, true, true) + 8;
  });

  // 首页跳转当前页
  onActivated(() => {
    getJumpParams();
  });

  const getJumpParams = throttle(async () => {
    let detail = getItem('configurestoreshopeeaccount');
    if (!isEmpty(detail)) {
      const syncStatus = Number(detail.syncStatus) || null;
      pageFormRef.value.setFormDataValue('syncStatus', syncStatus);
      removeItem('configurestoreshopeeaccount');
      handleSearch(true);
    }
  }, 100);

  const gridOptions = reactive({
    border: true,
    showOverflow: true,
    rowConfig: {
      keyField: 'id'
    },
    columnConfig: {
      resizable: true
    },
    columns: Columns
  });

  // 获取列表数据
  const getSeachData = () => {
    const formData = pageFormRef.value.formData;
    let storeAcct = '';
    if (formData.storeAcct?.length) {
      storeAcct = formData.storeAcct.join();
    }
    return { ...formData, storeAcct, acctQueryFlag: 1 };
  };
  const handleSearch = async (initPage) => {
    if (initPage) {
      paginationData.page = 1;
    }
    try {
      const params = getSeachData();
      const { data, count } = await queryPageApi({
        ...params,
        limit: paginationData.limit,
        page: paginationData.page
      });
      paginationData.total = count;
      gridOptions.data = data;
    } catch (err) {
      console.log(err);
      paginationData.total = 0;
      gridOptions.data = [];
    }
  };

  // 分页
  const handleSizeChange = (val) => {
    paginationData.limit = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleSearch();
  };

  // 获取复选框选中的数据
  const getSelectedList = (showMsg = true) => {
    // 获取表格多选数据
    const $table = tableRef.value;
    selectRecords.value = $table.getCheckboxRecords();
    if (selectRecords.value.length === 0) {
      if (showMsg) {
        ElMessage.warning('请选择要处理的数据！');
      }
      return false;
    } else {
      return true;
    }
  };

  const action = ref('');
  const editInfo = ref({});

  // 添加/修改店铺信息
  const showPlatAccountDialog = ref(false);
  const handlePlatAcctount = (type, row) => {
    action.value = type;
    showPlatAccountDialog.value = true;
    if (type === 'update') {
      editInfo.value = row;
    } else {
      editInfo.value = {};
    }
  };

  const isTestEnv = computed(() => {
    const textEnvList = ['localhost', 'test.epean.cn'];
    const { hostname } = document.location;
    return textEnvList.includes(hostname);
  });
  const getTestEnvToken = async () => {
    if (getSelectedList()) {
      if (selectRecords.value.length > 1) return ElMessage.warning('');
      const { msg } = await getTokenFromEpProdApi(selectRecords.value[0].id);
      const title = selectRecords.value[0].storeAcct + '的token';
      ElMessageBox.alert(msg, title, {
        confirmButtonText: '确定',
        type: 'success'
      });
    }
  };

  // 获取店铺地址
  const StoreAddressInfoLoading = ref(false);
  const handlegetStoreAddressInfo = () => {
    StoreAddressInfoLoading.value = true;
    transBlob(
      {
        url: '/lms/shopee/logistic/downloadLogisticShopAddressInfo',
        fileName:
          'shopee店铺地址报表' +
          transferDate(new Date().getTime(), 'yyyy年MM月dd日') +
          '.xlsx'
      },
      'get'
    )
      .then(function () {
        StoreAddressInfoLoading.value = false;
        ElMessage.success('导出成功');
      })
      .catch((res) => {
        StoreAddressInfoLoading.value = false;
        ElMessage.error(res);
      });
  };

  // 重新授权
  const showAuthDialog = ref(false);
  const authType = ref('');
  const handleAuth = (row, type) => {
    editInfo.value = row;
    authType.value = type;
    showAuthDialog.value = true;
  };
  const closeAuthDialog = () => {
    showAuthDialog.value = false;
  };

  // 同步listing
  const showSyncListingDialog = ref(false);
  const handleSyncListing = async () => {
    if (getSelectedList()) {
      showSyncListingDialog.value = true;
    }
  };

  // 店铺标签
  const showStoreTagDialog = ref(false);
  const handleStoreTag = (isBatch = true, row) => {
    showStoreTagDialog.value = true;
    if (isBatch) {
      editInfo.value = {};
    } else {
      selectRecords.value = [];
      editInfo.value = row;
    }
  };

  //查看授权处理
  const showAuthManage = ref(false);
  const authInfo = ref({});
  const closeAuthManageDialog = () => {
    showAuthManage.value = false;
  };
  const handleAuthManage = (row) => {
    showAuthManage.value = true;
    authInfo.value = {
      id: row.id,
      platCode: row.platCode
    };
  };

  // 设置mall店铺
  const showMallDialog = ref(false);
  const handleSetMallStore = (row) => {
    showMallDialog.value = true;
    editInfo.value = row;
  };

  // 设置预售
  const showPreSaleDialog = ref(false);
  const handleSetPreSale = (row) => {
    showPreSaleDialog.value = true;
    editInfo.value = row;
  };

  // 设置自动删除
  const showAutoDelDialog = ref(false);
  const handleAutoDelSet = (isBatch = true, row) => {
    showAutoDelDialog.value = true;
    if (isBatch) {
      editInfo.value = {};
    } else {
      selectRecords.value = [];
      editInfo.value = row;
    }
  };

  // 设置自动上传视频
  const showUploadVideoDialog = ref(false);
  const handleAutoUploadVideoSet = (row) => {
    showUploadVideoDialog.value = true;
    editInfo.value = row;
  };

  // 设置性感图片过滤
  const showSexyImgDialog = ref(false);
  const handleSexyImgFilterSet = (row) => {
    showSexyImgDialog.value = true;
    editInfo.value = row;
  };

  // 批量 修改信息
  const showUpdatePersonDialog = ref(false);
  const handleBatchUpdatePerson = () => {
    showUpdatePersonDialog.value = true;
  };

  // 批量启用店铺 批量停用店铺
  const batchUpdateAcctStatus = (option) => {
    const obj = {
      batchAcctStatusOn: '确定批量启用店铺吗？',
      batchAcctStatusOff: '确定批量停用店铺吗？'
    };
    const title = obj[option.value];
    ElMessageBox.confirm(title, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const params = {
        acctIdStr: selectRecords.value.map((v) => v.id).join(),
        flag: option.value === 'batchAcctStatusOn' ? true : false
      };
      try {
        const { msg } = await batchUpdateAcctStatusApi(params);
        ElMessage.success(msg || '操作成功');
        handleSearch();
      } catch (err) {
        console.log('err :>> ', err);
      }
    });
  };

  // 批量 同步boost
  const batchUpdateItemListBoost = async () => {
    let acctIdsData = new FormData();
    selectRecords.value.forEach((v) => {
      acctIdsData.append('acctIds', v.id);
    });
    try {
      const { msg } = await batchSyncItemBoostApi(acctIdsData);
      ElMessage.success(msg || '操作成功');
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const handleSyncDiscount = async (id) => {
    try {
      const { data } = await syncItemShopeeDiscountApi([id]);
      ElMessage.success(data || '操作成功');
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  // #region 批量操作
  const batchList = [
    {
      label: '修改信息',
      value: 'batchUpdatePerson',
      clickFc: handleBatchUpdatePerson
    },
    {
      label: '批量自动删除',
      value: 'batchAutoDelSetting',
      clickFc: handleAutoDelSet
    },
    {
      permission: 'shopeeaccountBatchSyncItemBoost',
      label: '同步boost',
      value: 'batchUpdateBoost',
      clickFc: batchUpdateItemListBoost
    },
    {
      permission: 'shopeeaccountBatchUpdateStatusOn',
      label: '批量启用店铺',
      value: 'batchAcctStatusOn',
      clickFc: batchUpdateAcctStatus
    },
    {
      permission: 'shopeeaccountBatchUpdateStatusOff',
      label: '批量停用店铺',
      value: 'batchAcctStatusOff',
      clickFc: batchUpdateAcctStatus
    },
    {
      permission: 'shopeeaccountBatchUpdateStoreTags',
      label: '批量修改店铺标签',
      value: 'batchUpdateStoreTag',
      clickFc: handleStoreTag
    }
  ];
  // 操作类型
  const handleBatch = (curObj) => {
    if (getSelectedList()) {
      curObj.clickFc(curObj);
    }
  };
  // #endregion 批量操作
  // 发货仓库
  const getShopeeWarehouseList = async () => {
    const { data } = await getShopeeShippingWarehousesApi();
    initList.warehouseList = data;
  };

  // 更新店铺
  const updateStoreList = async () => {
    await refreshStoreCascaderoApi('shopee');
    const { data } = await getStoreList('shopee');
    initList.storeList = data?.children || [];
  };
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
