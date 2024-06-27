<template>
  <!-- tiktok店铺页面 -->
  <div class="store_manage app-container">
    <el-card class="common_split_bottom search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        label-width="80"
        class="search_form"
      >
        <el-form-item
          label="店铺"
          prop="storeAcct"
          class="store_manage_item_cascader"
        >
          <z-cascader
            v-model="formData.storeAcct"
            :data="storeList"
            :props="{
              label: 'label',
              children: 'children',
              value: 'label'
            }"
          ></z-cascader>
          <!-- <el-cascader
            v-model="formData.storeAcct"
            :options="storeList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true, value: 'label' }"
          ></el-cascader> -->
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="formData.searchPersonType"
            class="form_left"
            @change="changePersonType"
          >
            <el-option label="客服" :value="2"></el-option>
            <el-option label="组长" :value="4"></el-option>
          </el-select>
          <el-select
            v-model="formData.searchPersonIdList"
            class="form_right"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            clearable
          >
            <el-option
              v-if="formData.searchPersonType === 4"
              label="无"
              :value="0"
            ></el-option>
            <el-option
              v-for="item in userData.personList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人" prop="creators">
          <el-select
            v-model="formData.creators"
            :class="formData.creators.length > 1 ? 'hide_tag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.creators.length > 1" type="info"
                >已选{{ formData.creators.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in createList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" clearable></el-input>
        </el-form-item>
        <el-form-item label="店铺启用状态" prop="status">
          <el-select v-model="formData.status" clearable>
            <el-option label="启用中" :value="true"></el-option>
            <el-option label="已停用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="授权状态" prop="tiktokAuthStatus">
          <el-select v-model="formData.tiktokAuthStatus" clearable>
            <el-option label="已授权" value="已授权"></el-option>
            <el-option label="未授权" value="未授权"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="chat授权" prop="tiktokChatAuthStatus ">
          <el-select v-model="formData.tiktokChatAuthStatus" clearable>
            <el-option label="已授权" value="已授权"></el-option>
            <el-option label="未授权" value="未授权"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="itemLimitQueryType" class="form_range">
          <el-select
            v-model="formData.itemLimitQueryType"
            clearable
            class="form_left"
          >
            <el-option label="总额度" value="0"></el-option>
            <el-option label="已用额度" value="1"></el-option>
            <el-option label="剩余额度" value="2"></el-option>
          </el-select>
          <el-input v-model="formData.itemLimitMin" type="number"></el-input>
          <div class="range_link">-</div>
          <el-input v-model="formData.itemLimitMax" type="number"></el-input>
        </el-form-item>
        <el-form-item
          label="电商浏览器店铺名"
          prop="haveAllrootAliasName"
          class="form_widther_label"
        >
          <el-select v-model="formData.haveAllrootAliasName" clearable>
            <el-option label="已维护" value="true"></el-option>
            <el-option label="未维护" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同步listing状态" prop="syncStatusList">
          <el-select
            v-model="formData.syncStatusList"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            clearable
          >
            <el-option label="未同步" :value="0"></el-option>
            <el-option label="同步中" :value="2"></el-option>
            <el-option label="同步成功" :value="3"></el-option>
            <el-option label="同步失败" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同步异常备注" prop="syncDesc">
          <el-input v-model="formData.syncDesc" clearable></el-input>
        </el-form-item>

        <el-button type="primary" @click="getStoreData()">搜索</el-button>
        <el-button @click="resetSearchForm()">清空</el-button>
      </el-form>
    </el-card>

    <el-card class="list_card">
      <div class="flex_between" style="margin-bottom: 8px">
        <div>
          <el-tag style="height: 24px">数量({{ totalCount }})</el-tag>
        </div>
        <div class="flex_between search_form">
          <el-button type="primary" @click="handleExportStores">导出</el-button>
          <el-button
            :loading="downloadTplLoading"
            type="primary"
            @click="handleDownLoadTpl"
            >下载模板</el-button
          >
          <el-dropdown class="ml10">
            <el-button type="primary" :loading="importLoading">
              导入<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in importSettingList"
                  :key="item.id"
                >
                  <el-upload
                    v-model:file-list="item.file"
                    class="upload-demo"
                    accept="xlsx,xls"
                    :show-file-list="false"
                    :action="item.url"
                    :before-upload="(event) => handleExportBefore(event, item)"
                    :on-success="(event) => handleExportResult(event, item)"
                    :on-error="(event) => handleExportError(event, item)"
                  >
                    <div v-loading="item.loading">{{ item.name }}</div>
                  </el-upload>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-select
            v-model="operationType"
            placeholder="批量操作"
            class="ml10"
            style="width: 150px"
            @change="changeOperation"
          >
            <el-option
              v-permission="['tiktokStoreBatchEditBtn']"
              :value="0"
              label="批量修改店铺"
            ></el-option>
            <el-option
              v-permission="['tiktokStoreBatchOpenStoreBtn']"
              :value="3"
              label="批量启用店铺"
            ></el-option>
            <el-option
              v-permission="['tiktokStoreBatchCloseStoreBtn']"
              :value="4"
              label="批量停用店铺"
            ></el-option>
            <el-option
              v-permission="['tiktokStoreBatchAddSexyImgBtn']"
              :value="5"
              label="批量新增性感图片类目"
            ></el-option>
          </el-select>
          <el-button
            v-permission="['tiktokStoreAddBtn']"
            type="primary"
            class="ml10"
            @click="addStore()"
            >添加店铺</el-button
          >
        </div>
      </div>
      <vxe-table
        ref="storeRef"
        v-loading="tableLoading"
        :data="tableData"
        :height="height"
        :scroll-y="{ gt: 15 }"
        :show-overflow="true"
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
        border
      >
        <vxe-column type="checkbox" width="60" />
        <vxe-column title="店铺名称" field="storeAcct"></vxe-column>
        <vxe-column title="品牌" field="brand"></vxe-column>
        <vxe-column title="毛利率/优惠幅度" field="grossRate" width="120">
          <template #default="{ row }">
            <div>毛利率：{{ row.grossRate }}</div>
            <div>优惠幅度：{{ row.discountRate * 100 }}%</div>
          </template>
        </vxe-column>
        <vxe-column title="人员信息" width="100">
          <template #default="{ row }">
            <div>销售：{{ row.salesperson }}</div>
            <div>客服：{{ row.customServicer }}</div>
            <div>组长：{{ row.leaderName }}</div>
            <div>主管：{{ row.sellLeaderName }}</div>
          </template>
        </vxe-column>
        <vxe-column title="店铺状态" width="80">
          <template #default="{ row }">
            {{ row.status == true ? '已开启' : '已关闭' }}
          </template>
        </vxe-column>
        <vxe-column title="授权到期时间" width="190">
          <template #default="{ row }">
            <div class="common_ta_center">
              <el-tooltip
                v-if="row.tiktokAuthStatus === '已授权'"
                effect="dark"
                content="店铺已授权"
                placement="top-start"
              >
                <el-icon :size="20" :color="successColor">
                  <CircleCheckFilled />
                </el-icon>
              </el-tooltip>
              <el-tooltip
                v-else-if="row.tiktokAuthStatus === '未授权'"
                effect="dark"
                content="店铺未授权"
                placement="top-start"
              >
                <el-icon :size="20" :color="dangerColor">
                  <CircleCloseFilled />
                </el-icon>
              </el-tooltip>
            </div>
            <div>refresh: {{ transferDate(row.accessTokenExpireInShop) }}</div>
            <div>access: {{ transferDate(row.refreshTokenExpireInShop) }}</div>
          </template>
        </vxe-column>
        <vxe-column title="创建人" width="70" field="creator"></vxe-column>
        <vxe-column title="listing同步" field="sync" width="200">
          <template #default="{ row }">
            <div>
              <p>同步状态: {{ row.syncStatusStr }}</p>
              <p>同步时间: {{ transferDate(row.lastSyncTime) }}</p>
              <p>异常备注: {{ row.syncErrorDesc }}</p>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="Listing额度" field="sync" width="200">
          <template #default="{ row }">
            <div>
              <p>总额度: {{ row.listingQuotaLimit || '-' }}</p>
              <p>已用额度: {{ row.listingQuotaUsed }}</p>
              <p>
                剩余额度:
                {{
                  row.remainingQuota || row.remainingQuota === 0
                    ? row.remainingQuota
                    : '-'
                }}
              </p>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="创建时间">
          <template #default="{ row }">
            {{ transferDate(row.createTime) }}
          </template>
        </vxe-column>
        <vxe-column title="备注" field="remark"></vxe-column>
        <vxe-column title="性感图片过滤" width="120">
          <template #default="{ row }">
            <el-button type="primary" @click="handleSetSexyImg(row)"
              >设置</el-button
            >
          </template>
        </vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="handleAuth(row, 'store')"
              >授权</el-button
            >
            <el-button
              v-permission="['publishstiktokstoreChatAuth']"
              type="primary"
              @click="handleAuth(row, 'chat')"
              >chat授权</el-button
            >
            <el-button
              v-permission="['tiktokStoreEditBtn']"
              type="primary"
              @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['tiktokCheckAccessToken']"
              type="primary"
              @click="handleAuthManage(row)"
            >
              查看授权
            </el-button>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="formData.page"
          v-model:page-size="formData.limit"
          background
          :page-sizes="[50, 100, 300]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 批量修改店铺信息 -->
    <Updatedialog
      v-if="showUpdateDialog"
      :user-data="userData"
      :show-dialog="showUpdateDialog"
      :select-records="selectRecords"
      :plat-code="'tiktok'"
      :sale-leader-list="dialogSaleLeaderList"
      @close="closeUpdateDialog"
    />

    <!-- 增加/修改 店铺信息 -->
    <Edidialog
      v-if="showEditDialog"
      :user-data="userData"
      :show-edit-dialog="showEditDialog"
      :action="action"
      :edit-info="editInfo"
      :sale-leader-list="dialogSaleLeaderList"
      @edit="getStoreData"
      @fresh-creator="getCreatorList"
      @close="closeEditDialog"
    />

    <!-- 授权弹窗 -->
    <Authdialog
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
    <!-- 性感图片过滤设置 -->
    <SexyImgFilter
      v-if="showSexyImgDialog"
      v-model="showSexyImgDialog"
      :edit-info="editInfo"
      @close="closeSexyImgDialog"
    />
  </div>
</template>

<script setup name="publishstiktokstore">
  import { reactive, ref, onMounted, computed } from 'vue';
  import {
    getStoreList,
    getSiteListApi,
    getCustomerListApi
  } from '@/api/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import Updatedialog from '../../temu/store/components/Updatedialog.vue';
  import Edidialog from './components/Editdialog.vue';
  import Authdialog from './components/Authdialog.vue';
  import AuthManage from '@/components/AuthManage/index.vue';
  import SexyImgFilter from './components/SexyImgFilter.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import {
    salesPlatAccountDtoPage,
    getCreator,
    exportStore,
    listValidUserByRoleApi
  } from '@/api/publishs/tiktokstoremanage';
  import {
    querySalersData,
    queryLeadersData,
    switchStore
  } from '@/api/publishs/temustoremanage';
  import { transferDate } from '@/utils/common';
  import { successColor, dangerColor } from '@/styles/vars.module.scss';
  import { transBlob } from '@/utils/downloadFile';

  const formData = reactive({
    page: 1,
    limit: 50,
    storeAcct: [],
    customServicerIds: [],
    itemLimitQueryType: '0',
    // storeAcctId: '',
    creators: '',
    remark: '',
    syncStatusList: [],
    syncDesc: '',
    itemLimitMin: '',
    itemLimitMax: '',
    searchPersonType: 2, // 默认选择客服
    searchPersonIdList: [],
    searchPersonIdListStr: ''
  });
  // 店铺级联数据
  const storeList = ref([]);

  // 获取组长
  const saleLeaderList = ref([]);

  // 店铺列表数据
  const tableData = ref([]);
  const totalCount = ref(0);
  // 操作类型
  const operationType = ref('');
  const storeRef = ref(null);
  const selectRecords = ref([]); // 列表选中的数据

  // 获取枚举值，将默认值选中
  onMounted(async () => {
    getStoreData();
    try {
      const { data: storeData } = await getStoreList('tiktok');
      const { data: siteList } = await getSiteListApi('tiktok');
      storeList.value = storeData.children;
      userData.siteData = siteList;
    } catch (err) {
      console.log('err :>> ', err);
    }
    getCreatorList();

    getSalerData();
    getServicerData();
    getLeadersData();
    getSaleLeaderList();
    getDialogSaleLeaderList();
  });

  const tableLoading = ref(false);
  const formRef = ref(null);

  // const filterStore = (node, keyword) => {
  //   const label = node?.label?.trim();
  //   const text = node?.text?.trim();
  //   const _keyword = keyword.trim().replaceAll('，', ',').split(',');
  //   const hasLabel = _keyword.some((item) => label.includes(item));
  //   const hasText = _keyword.some((item) => text.includes(item));
  //   if (hasLabel || hasText) {
  //     return node;
  //   }
  // };

  const createList = ref([]);
  // 获取创建人
  const getCreatorList = async () => {
    try {
      const { code, data } = await getCreator({ platCode: 'tiktok' });
      if (code === '0000') {
        data &&
          data.forEach((item) => {
            let params = {
              label: '',
              value: ''
            };
            params.label = item;
            params.value = item;
            createList.value.push(params);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取列表销售组长
  const getSaleLeaderList = async () => {
    try {
      const { code, data } = await listValidUserByRoleApi({
        role: 'tiktok组长',
        platCode: 'tiktok'
      });
      if (code === '0000') {
        saleLeaderList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取弹窗销售组长
  const dialogSaleLeaderList = ref([]);
  const getDialogSaleLeaderList = async () => {
    try {
      const { code, data } = await getCustomerListApi({
        role: 'TikTok组长'
      });
      if (code === '0000') {
        dialogSaleLeaderList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 切换客服和组长下拉
  const changePersonType = (val) => {
    formData.searchPersonIdList = [];
    formData.searchPersonIdListStr = '';
    if (val) {
      // 2客服 4组长
      if (val === 2) {
        userData.personList = userData.customServicerData;
      } else {
        userData.personList = saleLeaderList.value;
      }
    }
  };

  // 获取列表数据
  const getStoreData = async () => {
    try {
      tableLoading.value = true;
      let creators = '';

      if (formData.creators && typeof formData.creators !== 'string') {
        creators = formData.creators.join(',');
      }
      if (formData.searchPersonIdList.length) {
        formData.searchPersonIdListStr = formData.searchPersonIdList.join(',');
      } else {
        formData.searchPersonIdListStr = '';
      }
      let _storeAcctId = '';
      if (formData.storeAcct) {
        _storeAcctId = formData.storeAcct;
      } else {
        _storeAcctId = [];
      }
      const { data, count } = await salesPlatAccountDtoPage({
        ...formData,
        creators,
        storeAcct: _storeAcctId.join(',')
      });
      tableData.value = data;
      totalCount.value = count;
      tableLoading.value = false;
    } catch (err) {
      console.log(err);
      tableLoading.value = false;
    }
  };

  // 清空筛选表单
  const resetSearchForm = () => {
    formRef.value.resetFields();
    formData.itemLimitMin = '';
    formData.itemLimitMax = '';
  };

  // 获取复选框选中的数据
  const getSelectedList = (showMsg = true) => {
    // 获取表格多选数据
    const $table = storeRef.value;
    selectRecords.value = $table.getCheckboxRecords();
    if (selectRecords.value.length === 0) {
      if (showMsg) {
        ElMessage.warning('请选择要处理的数据！');
      }
      operationType.value = '';
      return false;
    } else {
      return true;
    }
  };

  // 获取用户名
  const showUpdateDialog = ref(false);
  const changeOperation = (val) => {
    // val 0 批量修改店铺 1 开启订单下载 2 关闭订单下载 3 批量启用店铺 4 批量停用店铺 5 批量新增性感图片类目
    if (getSelectedList()) {
      if (val === 0) {
        showUpdateDialog.value = true;
      }
      // 批量启用/停用店铺
      if (val === 3 || val === 4) {
        let msg = val === 3 ? '开启' : '关闭';
        let status = val === 3 ? true : false;
        ElMessageBox.confirm(`确定批量${msg}店铺吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            let params = {
              acctIdStr: selectRecords.value.map((item) => item.id).join(','),
              flag: status
            };
            const { code } = await switchStore(params);
            if (code === '0000') {
              ElMessage.success(`批量${msg}成功！`);
            }
            operationType.value = '';
            getStoreData();
          })
          .catch((err) => {
            if (err === 'cancel') {
              operationType.value = '';
            }
          });
      }
      // 批量新增性感图片类目
      if (val === 5) {
        handleSetSexyImg({
          ids: selectRecords.value.map((item) => item.id)
        });
        operationType.value = '';
      }
    }
  };

  const closeUpdateDialog = (val) => {
    showUpdateDialog.value = false;
    operationType.value = '';
    if (val === 'update') {
      getStoreData();
    }
  };

  const showEditDialog = ref(false); // 添加/修改店铺
  const action = ref('');
  const editInfo = ref({});
  const showAuthDialog = ref(false);

  const handleEdit = (row) => {
    action.value = 'update';
    showEditDialog.value = true;
    editInfo.value = row;
  };

  const showSexyImgDialog = ref(false);
  const handleSetSexyImg = async (row) => {
    showSexyImgDialog.value = true;
    editInfo.value = row;
  };
  const closeSexyImgDialog = () => {
    showSexyImgDialog.value = false;
    getStoreData();
  };

  const authType = ref('store');
  const handleAuth = (row, type) => {
    authType.value = type;
    showAuthDialog.value = true;
    editInfo.value = row;
  };
  const addStore = () => {
    action.value = 'add';
    showEditDialog.value = true;
  };
  const closeEditDialog = () => {
    showEditDialog.value = false;
  };
  const closeAuthDialog = () => {
    showAuthDialog.value = false;
  };

  const userData = reactive({
    customServicerData: [],
    salesPersonData: [],
    saleLeaderData: [],
    siteData: [],
    personList: []
  });
  // 获取编辑的 销售员数据
  const getSalerData = async () => {
    try {
      const { data } = await querySalersData({ role: 'tiktok专员' });
      userData.salesPersonData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取编辑的 客服专员数据
  const getServicerData = async () => {
    try {
      const { data } = await querySalersData({ role: 'tiktok客服' });
      userData.customServicerData = data;
      // 初始先获取客服对应的人员列表
      userData.personList = userData.customServicerData;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取 销售主管
  const getLeadersData = async () => {
    try {
      const { data } = await queryLeadersData({ roleNames: 'tiktok主管' });
      userData.saleLeaderData = data.userList;
    } catch (err) {
      console.log(err);
    }
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 240;
  });

  // 分页
  const handleSizeChange = (val) => {
    formData.limit = val;
    getStoreData();
  };

  const handleCurrentChange = (val) => {
    formData.page = val;
    getStoreData();
  };
  //查看授权处理
  const showAuthManage = ref(false); // 添加/修改店铺
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
  // #region 模板下载，导入
  const downloadTplLoading = ref(false);
  const handleDownLoadTpl = () => {
    downloadTplLoading.value = true;
    transBlob(
      {
        url: '/lms/salesplat/downTiktokTemplate',
        fileName: 'tiktok店铺模板.xlsx'
      },
      'get'
    )
      .then((res) => {
        ElMessage.success(res);
        downloadTplLoading.value = false;
      })
      .catch((res) => {
        ElMessage.error(res);
        downloadTplLoading.value = false;
      });
  };
  const importSettingList = ref([
    {
      url: '/api/lms/salesplat/importExcelSaveTiktokStore',
      name: '导入新增',
      loading: false,
      file: [],
      id: 1
    },
    {
      url: '/api/lms/salesplat/importExcelUpdateTiktokStore',
      name: '导入修改',
      loading: false,
      file: [],
      id: 2
    }
  ]);
  const importLoading = ref(false);
  const handleExportBefore = (_, option) => {
    importLoading.value = true;
    option.loading = true;
  };
  const handleExportResult = (result, option) => {
    const { code, msg, data } = result;
    importLoading.value = false;
    option.loading = false;
    if (code === '0000') {
      if (data.length) {
        const str = data
          .map((v) => v.storeAcct + '：' + v.operationResult)
          .join('<br>');
        ElMessageBox.alert(
          `<div style="max-height:500px;overflow-y:auto">${str}</div>`,
          '操作结果',
          {
            dangerouslyUseHTMLString: true,
            type: 'warning',
            callback: () => {
              getStoreData();
            }
          }
        );
      } else {
        ElMessage.success(msg);
        getStoreData();
      }
    } else {
      ElMessageBox.alert(msg || '请求失败', '错误信息', {
        confirmButtonText: '确认',
        type: 'error',
        dangerouslyUseHTMLString: true
      });
    }
  };
  const handleExportError = (_, option) => {
    importLoading.value = false;
    option.loading = false;
    // 展示错误信息
  };
  // #endregion 模板下载，导入

  //ztt20231206导出功能
  const handleExportStores = () => {
    if (getSelectedList(false)) {
      let params = {
        ids: selectRecords.value.map((item) => item.id),
        platCode: 'tiktok'
      };
      exportStore(params).then((res) => {
        const xlsx = 'application/vnd.ms-excel';
        const blob = new Blob([res], { type: xlsx }); //转换数据类型
        const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
        let title = `TikTok店铺数据${transferDate(Date.now(), true)}.xlsx`;
        a.download = title;
        a.href = window.URL.createObjectURL(blob);
        a.click();
        a.remove();
      });
    } else {
      //搜索条件展开
      let _storeAcctId = '';
      if (formData.storeAcct) {
        _storeAcctId = formData.storeAcct;
      } else {
        _storeAcctId = [];
      }
      let params = { ...formData, platCode: 'tiktok' };
      params.storeAcct = _storeAcctId.join(',');
      exportStore(params).then((res) => {
        const xlsx = 'application/vnd.ms-excel';
        const blob = new Blob([res], { type: xlsx }); //转换数据类型
        const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
        let title = `TikTok店铺数据${transferDate(Date.now(), true)}.xlsx`;
        a.download = title;
        a.href = window.URL.createObjectURL(blob);
        a.click();
        a.remove();
      });
    }
  };
</script>

<style lang="scss" scoped>
  .app-container .search_card .search_form .form_widther_label {
    :deep(.el-form-item__label) {
      width: 120px !important;
    }
    :deep(.el-input) {
      width: 100px;
    }
  }
  .hide_tag {
    :deep(.el-select__selected-item) {
      display: none;
    }
  }
  .store_manage_item_cascader {
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
  .flex_between {
    display: flex;
    justify-content: space-between;
  }
  .ml10 {
    margin-left: 10px;
  }
</style>
