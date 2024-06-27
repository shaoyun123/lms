<template>
  <!--temu店铺页面  -->
  <div class="store_manage app-container">
    <el-card class="common_split_bottom search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        label-width="80"
        class="search_form"
      >
        <el-form-item label="店铺状态" prop="status">
          <el-select v-model="formData.status" clearable>
            <el-option label="启用中" :value="true"></el-option>
            <el-option label="已停用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="店铺"
          prop="storeAcctIdList"
          class="store_manage_item_cascader"
        >
          <el-cascader
            v-model="formData.storeAcctIdList"
            :options="storeList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="店铺id" prop="sellerIdStr">
          <el-input v-model="formData.sellerIdStr" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" clearable></el-input>
        </el-form-item>
        <el-form-item label="开发者账号" prop="devAccount">
          <el-select v-model="formData.devAccount" clearable>
            <el-option
              v-for="item in accountList"
              :key="item"
              :label="item.devAccount"
              :value="item.devAccount"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="formData.searchPersonType"
            class="form_left"
            @change="changePersonType"
          >
            <el-option
              v-for="(item, type) in roleList"
              :key="type"
              :label="item.roleName"
              :value="item.type"
            ></el-option>
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
              v-for="(item, id) in personList"
              :key="id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
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
          <el-select
            v-model="operationType"
            placeholder="批量操作"
            style="width: 150px"
            @change="changeOperation"
          >
            <el-option
              v-permission="['temuStoreBatchEditBtn']"
              :value="0"
              label="批量修改店铺"
            ></el-option>
            <el-option :value="1" label="批量启用店铺"></el-option>
            <el-option :value="2" label="批量停用店铺"></el-option>
          </el-select>
          <el-button
            v-permission="['temuAddStoreBtn']"
            type="primary"
            style="margin-left: 10px"
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
        :scroll-y="{ gt: 10 }"
        border
      >
        <vxe-column type="checkbox" width="60" />
        <vxe-column title="店铺名称" field="storeAcct"></vxe-column>
        <vxe-column title="店铺id" field="sellerId"></vxe-column>
        <vxe-column title="店铺状态">
          <template #default="{ row }">
            {{
              row.status == true
                ? '启用中'
                : row.status == false
                ? '已停用'
                : ''
            }}
          </template>
        </vxe-column>
        <vxe-column title="制造商" field="manufacturer"></vxe-column>
        <vxe-column title="品牌" field="brand"></vxe-column>
        <vxe-column title="access_token到期">
          <template #default="{ row }">
            {{ transferDate(row.accessTokenExpiryTime) }}
          </template>
        </vxe-column>
        <vxe-column title="人员信息">
          <template #default="{ row }">
            <div>销售：{{ row.salesperson }}</div>
            <div>客服：{{ row.customServicer }}</div>
            <div>主管：{{ row.sellLeaderName }}</div>
            <div>组长：{{ row.leaderName }}</div>
          </template>
        </vxe-column>
        <vxe-column title="备注" field="remark"></vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <el-button
              v-permission="['temuStoreAuthBtn']"
              type="primary"
              @click="handleAuth(row)"
              >授权</el-button
            >
            <el-button
              v-permission="['temuStoreEditBtn']"
              type="primary"
              @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['temuCheckAccessToken']"
              type="success"
              @click="handleAuthManage(row)"
              >查看授权</el-button
            >
            <el-button
              v-if="row.status"
              type="danger"
              @click="switchStoreStatus(row, 1)"
              >停用</el-button
            >
            <el-button v-else type="success" @click="switchStoreStatus(row, 1)"
              >启用</el-button
            >
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
      :plat-code="platCode"
      :show-dialog="showUpdateDialog"
      :select-records="selectRecords"
      @close="closeUpdateDialog"
    />

    <!-- 增加/修改 店铺信息 -->
    <Edidialog
      v-if="showEditDialog"
      :user-data="userData"
      :show-edit-dialog="showEditDialog"
      :action="action"
      :account-list="accountList"
      :edit-info="editInfo"
      @edit="getStoreData"
      @close="closeEditDialog"
    />

    <Authdialog
      v-if="showAuthDialog"
      :show-auth-dialog="showAuthDialog"
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
  </div>
</template>

<script setup name="publishstemustore">
  import { reactive, ref, onMounted, computed } from 'vue';
  import { getStoreList } from '@/api/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import Updatedialog from './components/Updatedialog.vue';
  import Edidialog from './components/Editdialog.vue';
  import Authdialog from './components/Authdialog.vue';
  import AuthManage from '@/components/AuthManage/index.vue';
  import { transferDate } from '@/utils/common';
  import useUserStore from '@/store/modules/user';
  import {
    queryStoreData,
    querySalersData,
    queryLeadersData,
    getDevAccount,
    switchStore
  } from '@/api/publishs/temustoremanage';
  import { useRouter } from 'vue-router';
  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  const platCode = 'temu';

  const roleList = [
    {
      roleName: '销售',
      type: 1
    },
    {
      roleName: '客服',
      type: 2
    },
    {
      roleName: '主管',
      type: 3
    },
    {
      roleName: '组长',
      type: 4
    }
  ];

  const roleNameObj = {
    1: 'temu专员',
    2: 'temu客服专员',
    3: 'temu主管',
    4: 'temu组长'
  };
  const formData = reactive({
    page: 1,
    limit: 50,
    status: '',
    storeAcctIdList: [],
    // storeAcctId: '',
    sellerIdStr: '',
    remark: '',
    devAccount: '',
    searchPersonType: 1, // 默认选销售
    searchPersonIdList: ''
  });
  // 店铺级联数据
  const storeList = ref([]);
  // 开发者账号数据
  const accountList = ref([]);

  // 店铺列表数据
  const tableData = ref([]);
  const totalCount = ref(0);
  // 操作类型
  const operationType = ref('');
  const storeRef = ref(null);
  const selectRecords = ref([]); // 列表选中的数据

  const router = useRouter();
  // 获取枚举值，将默认值选中
  let time = router.currentRoute.value.query.time || '';
  let sevenDayTime = router.currentRoute.value.query.sevenDayTime || '';
  // let temuStatus = router.currentRoute.value.query.status || '';

  onMounted(async () => {
    getStoreData();
    try {
      const { data: storeData } = await getStoreList('temu');
      storeList.value = storeData.children;
    } catch (err) {
      console.log('err :>> ', err);
    }
    getAccountList();
    getSalerData();
    getServicerData();
    getLeadersData();
    getGroupLeadersData();
    getPersonListByRole();
  });

  const filterStore = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };
  const tableLoading = ref(false);
  const formRef = ref(null);

  // 获取开发者账号的数据
  const getAccountList = async () => {
    try {
      const { code, data } = await getDevAccount();
      if (code === '0000') {
        accountList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取各角色对应的人员
  const personList = ref([]);
  const getPersonListByRole = async () => {
    const { code, data } = await querySalersData({
      role: roleNameObj[formData.searchPersonType]
    });
    if (code === '0000') {
      personList.value = data;
    }
  };

  // 切换人员
  const changePersonType = () => {
    formData.searchPersonIdList = [];
    getPersonListByRole();
  };

  // 获取列表数据
  const getStoreData = async () => {
    try {
      let _storeAcctId = '';
      if (formData.storeAcctIdList) {
        _storeAcctId = formData.storeAcctIdList
          .map((item) => item[3] || item[2])
          .filter((item) => !!item);
      } else {
        _storeAcctId = [];
      }
      tableLoading.value = true;
      const { data, count } = await queryStoreData({
        ...formData,
        storeAcctIdList: _storeAcctId,
        accessTokenExpiryTime:
          String(time).length === 10 ? parseInt(time) * 1000 : time,
        accessTokenSevenExpiryTime:
          String(sevenDayTime).length === 10
            ? parseInt(sevenDayTime) * 1000
            : sevenDayTime
        // status: temuStatus == 1 ? true : false
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
  };

  // 获取复选框选中的数据
  const getSelectedList = () => {
    // 获取表格多选数据
    const $table = storeRef.value;
    selectRecords.value = $table.getCheckboxRecords();
    if (selectRecords.value.length === 0) {
      ElMessage.warning('请选择要处理的数据！');
      operationType.value = '';
      return false;
    } else {
      return true;
    }
  };

  // 获取用户名
  const showUpdateDialog = ref(false);

  // 批量操作
  const changeOperation = (val) => {
    // val 0 批量修改店铺 1 启用店铺 2 停用店铺
    if (getSelectedList()) {
      if (val === 0) {
        showUpdateDialog.value = true;
      } else if (val === 1) {
        switchStoreStatus(true, 0);
      } else if (val === 2) {
        switchStoreStatus(false, 0);
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

  const handleEdit = (row) => {
    action.value = 'update';
    showEditDialog.value = true;
    editInfo.value = row;
  };
  const showAuthDialog = ref(false);
  const handleAuth = (row) => {
    showAuthDialog.value = true;
    editInfo.value = row;
  };
  const addStore = () => {
    action.value = 'add';
    showEditDialog.value = true;
  };

  const closeEditDialog = () => {
    showEditDialog.value = false;
    // getStoreData();
  };

  const closeAuthDialog = (val) => {
    showAuthDialog.value = false;
    if (val === 'update') {
      getStoreData();
    }
  };

  const userData = reactive({
    customServicerData: [],
    salesPersonData: [],
    saleLeaderData: [],
    groupLeaderData: []
  });
  // 获取编辑的 销售员数据
  const getSalerData = async () => {
    try {
      const { data } = await querySalersData({ role: 'temu专员' });
      userData.salesPersonData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取编辑的 客服专员数据
  const getServicerData = async () => {
    try {
      const { data } = await querySalersData({ role: 'temu客服专员' });
      userData.customServicerData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取 销售主管
  const getLeadersData = async () => {
    try {
      const { data } = await queryLeadersData({ roleNames: 'temu主管' });
      userData.saleLeaderData = data.userList;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取 组长
  const getGroupLeadersData = async () => {
    try {
      const { data } = await querySalersData({ role: 'temu组长' });
      userData.groupLeaderData = data;
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
    return clientHeight - 200;
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

  // 停用 启用店铺
  const switchStoreStatus = async (row, type) => {
    let acctIdStr = '';
    let flag = false;

    // type 1 单个 0 批量
    if (type) {
      flag = !row.status;
      acctIdStr = row.id;
    } else {
      flag = row;
      const checkedList = storeRef.value.getCheckboxRecords();
      acctIdStr = checkedList.map((item) => item.id).join(',');
    }

    let msg = flag ? '启用' : '停用';
    // 停用(需二次确认)
    if (!flag) {
      await ElMessageBox.confirm(`确认停用店铺?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).finally(() => {
        operationType.value = '';
      });
    }
    try {
      let params = {
        acctIdStr,
        flag,
        lmsAppUserName: userName.value
      };
      const { code } = await switchStore(params).finally(() => {
        operationType.value = '';
      });
      if (code === '0000') {
        ElMessage.success(`店铺已${msg}！`);
        getStoreData();
      }
    } catch (err) {
      console.log(err);
    }
  };
</script>

<style lang="scss" scoped>
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
  /*vxe-table 自定义行高 */
  :deep(
      .vxe-table--render-default.size--mini
        .vxe-body--column.col--ellipsis
        > .vxe-cell
    ) {
    padding: 7px 0;
    max-height: fit-content;
    text-overflow: ellipsis;
    white-space: break-spaces;
  }
</style>
