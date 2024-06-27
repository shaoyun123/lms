<!-- 美科多在线商品页面 -->
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
          <el-select
            v-model="form.siteList"
            placeholder="请选择"
            :class="form.siteList.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
            @change="radioSearch('site')"
          >
            <template #prefix>
              <el-tag v-if="form.siteList.length > 1" type="info"
                >已选{{ form.siteList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.sites"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
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
          <el-button :loading="false" type="primary" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in initTab.tabs"
          :key="item"
          :label="`${item}(${initTab.tabsCount[item] || 0})`"
          :name="item"
        >
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
            <vxe-column field="status" title="状态" width="70"
              ><template #default="{ row, rowIndex }">
                <div @click="handleStatusChange(row, rowIndex)">
                  <el-switch
                    :value="row.status"
                    :active-value="true"
                    :inactive-value="false"
                  />
                </div>
              </template>
            </vxe-column>
            <vxe-column field="autoReplyType" title="自动回复类型" width="130">
              <template #default="{ row }">
                {{ initTab.tabsKey[row.autoReplyType] }}
              </template>
            </vxe-column>
            <vxe-column field="salesSite" title="站点" width="70"
              ><template #default="{ row }">
                {{ site[row.salesSite] }}
              </template>
            </vxe-column>
            <vxe-column field="storeCount" title="应用店铺数" width="100">
              <template #default="{ row }">
                <a @click="tableStore(row.id)">{{ row.storeCount || 0 }}</a>
              </template>
            </vxe-column>
            <!-- 00000 -->
            <vxe-column
              v-if="activeName == '换货'"
              field="delayDays"
              title="延迟天数≥"
              width="100"
            >
            </vxe-column>
            <vxe-column
              v-if="activeName == '换货'"
              field="deadlineDays"
              title="截止天数≤"
              width="100"
            >
            </vxe-column>
            <vxe-column
              v-if="activeName == '差评' || activeName == 'reply好评'"
              field="ratingStar"
              title="评论星星数"
              width="100"
            >
            </vxe-column>
            <vxe-column
              :field="
                activeName == '换货' ? 'orderProcessStatus' : 'platOrderStatus'
              "
              :title="activeName == '换货' ? '仓库订单状态' : '平台订单状态'"
              width="180"
            >
              <template #default="{ row }">
                {{
                  activeName == '换货'
                    ? getOrderProcessStatus(row.orderProcessStatusList)
                    : row.platOrderStatus
                }}
              </template>
            </vxe-column>
            <vxe-column
              v-if="activeName == 'COD订单签收提醒'"
              field="logisticsTitle"
              title="物流信息title"
              width="100"
            >
            </vxe-column>
            <vxe-column field="verbalTrick" title="话术"> </vxe-column>
            <vxe-column field="creator" title="创建人" width="100">
            </vxe-column>
            <vxe-column title="操作" width="150">
              <template #default="{ row }">
                <div style="display: flex">
                  <el-button type="primary" @click="tableEdit(row)"
                    >修改</el-button
                  >
                  <el-button type="danger" @click="getProdDel(row.id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </vxe-column>
          </vxe-table>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="currentPage"
              v-model:page-size="pageSize"
              background
              :page-sizes="[100, 500, 1000]"
              layout="prev, pager, next,sizes, total"
              :total="total"
              :small="true"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn" style="display: flex">
        <el-select v-model="batchOp" style="width: 120px">
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
        <el-button type="primary" @click="tableEdit"> 新增</el-button>
      </div>
    </el-card>
    <!-- 新增&修改 -->
    <Detail
      v-if="showDetail"
      :is-visible="showDetail"
      :detail-data="detailData"
      :sales-site="initFormData.sites"
      :reply-type="initTab.tabsValue"
      :order-type="initFormData.orderType"
      :lazada-order-type="initFormData.lazadaOrderType"
      @close="showDetailCloseLog"
    />
    <!-- 店铺 -->
    <Store
      v-if="showStore"
      :is-visible="showStore"
      :rule-id="ruleId"
      @close="showStoreCloseLog"
    />
  </div>
</template>
<script setup name="lazadacustomerlazadaautoreply">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';

  import {
    listAutoReplyRule,
    getAllSite,
    listStoreForRenderHpStoreCommonComponent,
    getCreators,
    listAutoReplyType,
    getWarehouseOrderStatus,
    getLazadaPlatOrderStatus,
    batchUpdateStatus,
    removeAutoReplyRule
  } from '@/api/lazada/autoreply';
  import Detail from './components/detail.vue';
  import Store from './components/store.vue';

  const activeName = ref('换货');
  let site = {
    SG: '新加坡',
    MY: '马来西亚',
    ID: '印尼',
    TH: '泰国',
    PH: '菲律宾',
    VN: '越南'
  };
  // 仓库订单状态
  let orderProcessStatus = {};
  const initTab = ref({
    tabs: [
      '换货',
      '差评',
      '要好评',
      'reply好评',
      'COD订单发货确认',
      'COD订单签收提醒'
    ],
    tabsValue: {},
    tabsKey: {},
    tabsCount: {}
  });

  // 查询条件
  const form = reactive({
    siteList: [],
    storeAcctIdList: []
  });
  // 初始化查询条件
  const initFormData = reactive({
    sites: [],
    storeData: [],
    creators: [],
    orderType: [],
    lazadaOrderType: []
  });

  const currentPage = ref(1);
  const pageSize = ref(100);
  const total = ref({});
  const batchOp = ref('');

  onMounted(async () => {
    Promise.all([
      getAllSite(),
      getCreators(),
      listAutoReplyType(),
      getWarehouseOrderStatus(),
      getLazadaPlatOrderStatus(),
      listStoreForRenderHpStoreCommonComponent({
        roleNames: 'lazada专员',
        platCode: 'lazada'
      })
    ])
      .then((res) => {
        // 站点
        initFormData.sites = res[0].data;
        // 店铺
        initFormData.storeData = res[5].data.map((item) => ({
          value: item.id,
          label: item.storeAcct
        }));
        // 创建人
        initFormData.creators = res[1].data;
        // 回复类型
        initTab.value.tabsValue = res[2].data;
        for (let key in initTab.value.tabsValue) {
          initTab.value.tabsKey[initTab.value.tabsValue[key]] = key;
        }
        // 仓库订单状态
        initFormData.orderType = res[3].data;
        for (let key in res[3].data) {
          orderProcessStatus[res[3].data[key]] = key;
        }
        // 平台订单状态
        initFormData.lazadaOrderType = res[4].data;
      })
      .catch((err) => ElMessage.error(err));
  });

  function getOrderProcessStatus(list) {
    let str = list.map((item) => orderProcessStatus[item]);
    return str.join(',');
  }

  const radioSearch = (type) => {
    if (type == 'site' && form.siteList.length != 0) {
      form.storeAcctIdList = [];
    } else if (type == 'store' && form.storeAcctIdList.length != 0) {
      form.siteList = [];
    }
  };

  const tableDataRef = ref();
  const tableData = ref(null);
  const tableDataLoading = ref(false);
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
    form.autoReplyType = initTab.value.tabsValue[activeName.value];
    let { code, count, data } = await listAutoReplyRule(form);
    if (code == '0000') {
      tableData.value = data;
    }
    initTab.value.tabsCount[activeName.value] = count;
    total.value = count;
    tableDataLoading.value = false;
  };
  const handleClick = (tab) => {
    activeName.value = tab.paneName;
    currentPage.value = 1;
    onSubmit();
  };

  // 设置店铺
  const showStore = ref(false);
  const ruleId = ref();
  // 设置店铺
  const tableStore = async (ids) => {
    ruleId.value = ids;
    showStore.value = true;
  };
  const showStoreCloseLog = () => {
    showStore.value = false;
    onSubmit();
  };

  // 批量操作
  // 开启&关闭任务
  const handleStatusChange = async (row, rowIndex) => {
    let { code, msg } = await batchUpdateStatus({
      ids: row.id,
      status: !row.status
    });
    if (code == '0000') {
      tableData.value[rowIndex].status = !row.status;
      ElMessage.success(msg);
    }
  };
  const handleStatusBatchChange = async (status) => {
    let tabIndex = initTab.value.tabs.indexOf(activeName.value);
    let checkedData = tableDataRef.value[tabIndex].getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    ElMessageBox.confirm(`确认要批量${status ? '开启' : '关闭'}?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'Warning'
    }).then(async () => {
      const { code, data, msg } = await batchUpdateStatus({
        ids: ids.join(','),
        status
      });
      if (code === '0000') {
        if (data && data.length != 0) {
          let str = '部分操作成功；';
          str = str + '\n' + msg + '  规则id为: ' + data.join(',');

          ElMessageBox.alert(`<div>${str}</div>`, '操作结果', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '取消'
          });
        } else {
          ElMessage.success(msg);
        }
        onSubmit();
      }
    });
  };
  // 商品删除--start--
  const getProdBatchDel = () => {
    let tabIndex = initTab.value.tabs.indexOf(activeName.value);
    let checkedData = tableDataRef.value[tabIndex].getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    ElMessageBox.confirm(
      `本次需要删除${checkedData.length}条，请确认是否全部删除?`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'Warning'
      }
    ).then(async () => {
      const { code, msg } = await removeAutoReplyRule(ids.join(','));
      if (code === '0000') {
        ElMessage.success(msg);
        onSubmit();
      }
    });
  };
  const getProdDel = (id) => {
    ElMessageBox.confirm(`请再次确认是否删除?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'Warning'
    }).then(async () => {
      const { code, msg } = await removeAutoReplyRule(id);
      if (code === '0000') {
        ElMessage.success(msg);
        onSubmit();
      }
    });
  };
  // 商品删除--end--

  // 选中的当前行数据
  const showDetail = ref(false);
  const detailData = ref({});
  // 编辑
  const tableEdit = async (row) => {
    showDetail.value = true;
    detailData.value = row;
  };
  const showDetailCloseLog = (val) => {
    showDetail.value = false;
    if (val == true) {
      onSubmit();
    }
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
  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 220;
  });
</script>
<style scoped lang="scss">
  .mt-10 {
    margin-top: 10px;
  }
  //   查询条件--listing状态框
  :deep(.el-select__tags) {
    max-width: 100px !important;
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

  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }
</style>
