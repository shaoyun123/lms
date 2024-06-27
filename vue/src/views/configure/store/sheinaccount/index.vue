<template>
  <div class="app-container">
    <el-card ref="searchCardRef" class="search_card">
      <el-form
        ref="formDataRef"
        :model="formData"
        class="search_form"
        :inline="true"
      >
        <el-row>
          <el-form-item label="店铺名称" prop="storeAcct">
            <el-input
              v-model="formData.storeAcct"
              placeholder="逗号分隔查询多个"
              style="width: 215px"
            >
              <template #append>
                <el-select
                  v-model="formData.acctQueryFlag"
                  class="acctQueryFlag"
                >
                  <el-option label="精确" value="1" />
                  <el-option label="模糊" value="0" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="部门" prop="orgId">
            <el-select
              v-model="formData.orgId"
              placeholder="请选择"
              clearable
              filterable
              @change="handleChangeRoleList"
            >
              <el-option
                v-for="item in state.orgIdList"
                :key="item.id"
                bus
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="orgUserId">
            <el-select
              v-model="formData.roleName"
              class="form_left"
              filterable
              @change="handleChangeRoleList"
            >
              <el-option label="销售员" value="销售员"></el-option>
              <el-option label="销售组长" value="销售组长"></el-option>
              <el-option label="主管" value="主管"></el-option>
            </el-select>
            <el-select
              v-model="formData.orgUserId"
              placeholder="请选择"
              class="form_right"
              clearable
              filterable
            >
              <el-option
                v-for="item in state.curRoleIdList"
                :key="item.id"
                :label="item.userName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="下载订单" prop="orderDownloadStatus">
          <el-select
            v-model="formData.orderDownloadStatus"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="已关闭" value="false"></el-option>
            <el-option label="已开启" value="true"></el-option>
          </el-select>
        </el-form-item> -->
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="formData.remark"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="同步异常备注" prop="syncDesc">
            <el-input
              v-model="formData.syncDesc"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button
            ><el-button @click="resetQuery">清空</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="list_card">
      <div class="card-tool">
        <div>数量（{{ paginationData.total }}）</div>
        <div>
          <el-button type="primary" @click="handleAcct('add')"
            >添加店铺</el-button
          >
        </div>
      </div>
      <!-- 数据列表展示 -->
      <vxe-table
        ref="tableDataRef"
        :height="height"
        :data="tableData"
        :scroll-y="{ gt: 10 }"
        show-overflow
        border
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column field="storeAcct" title="店铺名称"></vxe-column>
        <!-- <vxe-column field="sheinPlatSellerIdStr" title="平台店铺id">
        <template #default="{ row }">
          <div v-if="row.sheinPlatSellerIdStr != undefined">
            <div
              v-for="item in row.sheinPlatSellerIdStr.split(',')"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
        </template></vxe-column
      > -->
        <vxe-column field="sellerId" title="oa店铺id"></vxe-column>
        <!-- <vxe-column field="allrootAliasName" title="普源别名"></vxe-column>
      <vxe-column field="brand" title="品牌"></vxe-column>
      <vxe-column title="access_token到期">
        <template #default="{ row }">
          <span v-if="row.accessTokenExpiryTime">{{
            parseTime(
              row.accessTokenExpiryTime || '',
              '{y}-{m}-{d} {h}:{i}:{s}'
            )
          }}</span>
        </template></vxe-column
      > -->
        <!-- <vxe-column title="订单下载">
        <template #default="{ row }">
          <el-switch
            v-model="row.orderDownloadStatus"
            active-text="开"
            inactive-text="关"
            inline-prompt
            @change="orderDownload($event, row.id)"
          />
        </template>
      </vxe-column> -->
        <vxe-column title="制造商" field="manufacturer"></vxe-column>
        <vxe-column title="人员信息">
          <template #default="{ row }">
            <div>销售：{{ row.salesperson }}</div>
            <div>组长：{{ row.leaderName }}</div>
            <div>主管：{{ row.sellLeaderName }}</div>
          </template>
        </vxe-column>
        <vxe-column field="safeStock" title="上次同步时间">
          <template #default="{ row }">
            <span v-if="row.syncStatus == 1 || row.syncStatus == 2"
              >同步中</span
            >
            <!-- {{d.syncDesc}} -->
            <span v-else-if="row.syncStatus == 3">同步成功</span>
            <!-- {{d.syncDesc}} -->
            <span v-else-if="row.syncStatus == 4">同步失败</span>
            <span v-else>未同步</span>
            <div v-if="row.lastSyncTime">
              {{ parseTime(row.lastSyncTime || '', '{y}-{m}-{d} {h}:{i}:{s}') }}
            </div>
          </template></vxe-column
        >
        <vxe-column field="syncDesc" title="同步异常备注"> </vxe-column>
        <vxe-column field="remark" title="备注"> </vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <el-button
              v-permission="['sheinaccountAuthBtn']"
              type="success"
              @click="getAuth(row)"
              >授权</el-button
            >
            <el-button
              v-permission="['sheinaccountEditBtn']"
              type="success"
              @click="handleAcct('edit', row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['sheinCheckAccessToken']"
              type="success"
              @click="handleAuthManage(row)"
              >查看授权</el-button
            >
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
  </div>

  <!-- 店铺授权 弹窗 -->
  <el-dialog
    v-model="handleAcctAuth"
    title="店铺授权"
    width="20%"
    :close-on-click-modal="false"
  >
    <!-- <el-form
      class="dialog_form"
      :model="formDataEdit"
      :inline="true"
      :label-width="100"
    >
      <el-form-item label="client id" prop="clientId">
        <el-input v-model="formDataEdit.clientId" />
      </el-form-item>
      <el-form-item label="client secret" prop="clientSecret">
        <el-input v-model="formDataEdit.clientSecret" />
      </el-form-item>
    </el-form> -->

    <el-input
      type="textarea"
      class="handleAcctAuth_input"
      disabled
      placeholder="步骤一：点击‘进入链接’，登录shein自营店铺主账号，登录成功后点击‘确认授权’复制网页地址栏中的tempToken参数"
    /><br />
    <el-input class="handleAcctAuth_input" disabled :value="acctAuthUrl">
      <template #append>
        <a :href="acctAuthUrl" target="_blank">进入链接</a>
      </template> </el-input
    ><br />
    <el-input
      class="handleAcctAuth_input"
      disabled
      placeholder="步骤二：填写获取的tempToken，点击保存，即可成功授权"
    /><br />
    <el-input
      v-model="formDataEdit.code"
      class="handleAcctAuth_input"
      placeholder="请输入tempToken"
    />
    <template #footer>
      <span>
        <el-button type="primary" @click="getAuthSave()">保存</el-button>
        <el-button @click="handleAcctAuth = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 新增&编辑 弹窗 -->
  <el-dialog
    v-model="handleAcctVisiable"
    :title="title"
    width="500"
    :close-on-click-modal="false"
    :before-close="handleAcctClose"
  >
    <el-form
      ref="formEl"
      class="dialog_form"
      :model="handleAcctData"
      :label-width="100"
      :rules="formRules"
    >
      <el-form-item label="店铺名称" prop="storeAcct">
        <el-input v-model="handleAcctData.storeAcct" clearable />
      </el-form-item>
      <el-form-item label="制造商" prop="manufacturer">
        <el-input v-model="handleAcctData.manufacturer" clearable />
      </el-form-item>
      <el-form-item label="销售员" prop="salespersonId">
        <el-select
          v-model="handleAcctData.salespersonId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in state.salespersonIdList"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售组长" prop="leaderId">
        <el-select
          v-model="handleAcctData.leaderId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in state.leaderIdList"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主管" prop="sellLeaderId">
        <el-select
          v-model="handleAcctData.sellLeaderId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in state.sellLeaderIdList"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺账号" prop="storeName">
        <el-input v-model="handleAcctData.storeName" clearable />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="handleAcctData.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleAcctSave(formEl)"
          >保存</el-button
        >
        <el-button @click="handleAcctClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 查看授权弹框 -->
  <AuthManage
    v-if="showAuthManage"
    :is-visible="showAuthManage"
    :auth-info="authInfo"
    @close="closeAuthManageDialog"
  />
</template>

<script setup name="configurestoresheinaccount">
  import { ref, reactive, onMounted, computed } from 'vue';
  import {
    salesPlatAccountDtoPage,
    getPersonAndOrgsByRole,
    listuserbyrole,
    // batchUpdateOrderStatus,
    addSalesPlatAccountBaseAndDetailInfo,
    getSheinAuthorizedURL,
    sheinSelfStoreAuth
  } from '@/api/configure/sheinaccount';
  import AuthManage from '@/components/AuthManage/index.vue';
  import { ElMessage } from 'element-plus';
  import { parseTime, comGetTableHeight } from '@/utils/common';

  const formData = reactive({
    storeAcct: '', //店铺
    acctQueryFlag: '1', // 精确&模糊
    orgId: '', //部门
    roleName: '销售员', // 角色种类
    orgUserId: '', // 角色Id
    // orderDownloadStatus: '', // 下载订单
    remark: '', // 备注
    syncDesc: '', // 同步异常备注
    syncStatus: ''
  });

  const formDataEdit = reactive({
    salespersonId: '', // 销售员
    sellLeaderId: '', // 销售主管
    customServicerId: '', // 客服专员
    code: ''
    // clientId: '', // 店铺授权id
    // clientSecret: '' // 店铺授权secret
  });

  const state = reactive({
    orgIdList: [], // 部门
    curRoleIdList: [],
    salespersonIdList: '', // 销售员
    sellLeaderIdList: '', // 销售主管
    leaderIdList: '' // 销售组长
  });

  const formDataRef = ref();
  const resetQuery = () => {
    formDataRef.value.resetFields();
    formData.acctQueryFlag = '1';
    formData.roleName = '销售员';
  };

  //   店铺授权
  const handleAcctAuth = ref(false);
  const currentRow = ref();
  const acctAuthUrl = ref('');
  const getAuth = async (row) => {
    let urlRes = await getSheinAuthorizedURL();
    acctAuthUrl.value = (urlRes && urlRes.data) || '';
    formDataEdit.code = '';
    handleAcctData['id'] = row.acctDetailId;
    handleAcctData['salesAcctId'] = row.id;
    currentRow.value = row;
    handleAcctAuth.value = true;
  };
  //
  //   店铺授权 -- 保存
  const getAuthSave = async () => {
    if (formDataEdit.code == '' || formDataEdit.code == undefined) {
      ElMessage.warning('必填项不能为空');
      return;
    }
    // let newFormData = new FormData();
    // newFormData.append('acctDetailId', handleAcctData.acctDetailId);
    // newFormData.append('id', handleAcctData.id);
    // newFormData.append('acctBaseId', handleAcctData.id);
    // newFormData.append('platCode', 'shein自营');
    // const { code } = await addSalesPlatAccountBaseAndDetailInfo(newFormData);

    handleAcctData['accessToken'] = formDataEdit.code;
    const { code } = await sheinSelfStoreAuth(handleAcctData);
    if (code == '0000') {
      ElMessage.success('保存成功');
      handleAcctAuth.value = false;
      handleQuery();
    }
  };
  // 批量--开启&关闭订单下载
  // const orderDownloadBatch = (type) => {
  //   const checkedData = tableDataRef.value.getCheckboxRecords();
  //   if (checkedData.length == 0) {
  //     ElMessage.warning('请选择店铺');
  //     return;
  //   }
  //   let ids = checkedData.map((item) => item.id).join(',');
  //   orderDownload(type, ids);
  // };
  // 单个--开启&关闭订单下载
  // const orderDownload = async (val, id) => {
  //   let formData = new FormData();
  //   formData.append('idListStr', id);
  //   formData.append('orderDownStatus', val);
  //   const { code } = await batchUpdateOrderStatus(formData);
  //   if (code === '0000') {
  //     ElMessage.success('操作成功');
  //     getCancelOrderList();
  //   }
  // };
  // 新增&编辑店铺
  const formRules = reactive({
    storeAcct: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
    manufacturer: [
      { required: true, message: '请输入制造商', trigger: 'blur' }
    ],
    storeName: [{ required: true, message: '请输入店铺账号', trigger: 'blur' }],
    salespersonId: [
      { required: true, message: '请选择销售员', trigger: 'blur' }
    ]
  });
  const handleAcctVisiable = ref(false);
  const formEl = ref();
  const handleAcctData = reactive({
    storeAcct: '',
    manufacturer: '',
    storeName: '',
    salespersonId: '',
    remark: ''
  });
  const titleType = {
    add: '添加店铺账号',
    edit: '设置店铺账号'
  };
  const title = ref();
  const handleAcctClose = () => {
    formEl.value.clearValidate();
    for (let key in handleAcctData) {
      handleAcctData[key] = '';
    }
    handleAcctVisiable.value = false;
  };
  const handleAcct = (type, row) => {
    title.value = titleType[type];
    if (type == 'edit') {
      for (let key in handleAcctData) {
        handleAcctData[key] = row[key];
      }

      handleAcctData['acctDetailId'] = row.acctDetailId;
      handleAcctData['id'] = row.id;
      handleAcctData['acctBaseId'] = row.id;
      handleAcctData['leaderName'] = row.leaderName;
      handleAcctData['leaderId'] = row.leaderId;
      handleAcctData['sellLeaderName'] = row.sellLeaderName;
      handleAcctData['sellLeaderId'] = row.sellLeaderId;

      if (row.leaderId == -1) {
        handleAcctData.leaderId = null;
        handleAcctData.leaderName = '';
      }
    }
    handleAcctVisiable.value = true;
  };
  const handleAcctSave = async (formRef) => {
    // 校验
    if (!formRef) return;
    await formRef.validate(async (valid) => {
      if (valid) {
        let newFormData = new FormData();
        const _handleAcctData = JSON.parse(JSON.stringify(handleAcctData));
        _handleAcctData.salesperson = state.salespersonIdList.filter(
          (item) => item.id == _handleAcctData.salespersonId
        )[0]?.userName;
        if (_handleAcctData.sellLeaderId) {
          _handleAcctData.sellLeaderName = state.sellLeaderIdList.filter(
            (item) => item.id == _handleAcctData.sellLeaderId
          )[0]?.userName;
        } else {
          _handleAcctData.sellLeaderName = '';
        }

        if (_handleAcctData.leaderId) {
          _handleAcctData.leaderName =
            state.leaderIdList.filter(
              (item) => item.id == _handleAcctData.leaderId
            )[0]?.userName || '';
        } else {
          _handleAcctData.leaderId = -1;
          _handleAcctData.leaderName = '';
        }
        _handleAcctData['acctBaseRemark'] =
          _handleAcctData.remark == '' || _handleAcctData.remark == undefined
            ? ''
            : _handleAcctData.remark;
        for (let key in _handleAcctData) {
          newFormData.append(key, _handleAcctData[key]);
        }
        newFormData.append('platCode', 'shein自营');
        const { code } = await addSalesPlatAccountBaseAndDetailInfo(
          newFormData
        );
        if (code == '0000') {
          ElMessage.success('保存成功');
          handleAcctClose();
          getCancelOrderList();
        }
      }
    });
  };

  const paginationData = reactive({
    page: 1,
    limit: 50,
    total: 0
  });
  const tableData = ref([]);
  const tableDataRef = ref(null);

  onMounted(() => {
    getPersonAndOrgsByRoleFunc();
    listuserbyroleFunc();
  });

  // 获取部门&销售员
  const getPersonAndOrgsByRoleFunc = async () => {
    let formData = new FormData();
    formData.append('roleNames', 'shein自营专员');
    const { code, data } = await getPersonAndOrgsByRole(formData);
    if (code === '0000') {
      state.orgIdList = data.orgTree;
    }
  };
  // 获取销售员&销售主管&客服专员
  const listuserbyroleFunc = async () => {
    {
      let formData = new FormData();
      formData.append('role', 'shein自营专员');
      const { code, data } = await listuserbyrole(formData);
      if (code === '0000') {
        state.salespersonIdList = data;
        state.curRoleIdList = data;
      }
    }
    {
      let formData = new FormData();
      formData.append('role', 'shein自营主管');
      const { code, data } = await listuserbyrole(formData);
      if (code === '0000') {
        state.sellLeaderIdList = data;
      }
    }
    {
      let formData = new FormData();
      formData.append('role', 'shein自营组长');
      const { code, data } = await listuserbyrole(formData);
      if (code === '0000') {
        state.leaderIdList = data;
      }
    }
  };

  // 选择部门或者角色种类，更新人员数据
  const handleChangeRoleList = () => {
    const { orgId, roleName } = formData;
    formData.orgUserId = '';
    const roleObj = {
      销售员: state.salespersonIdList,
      销售组长: state.leaderIdList,
      主管: state.sellLeaderIdList
    };
    if (orgId != '') {
      state.curRoleIdList = roleObj[roleName].filter(
        (item) => item.orgId == orgId
      );
    } else {
      state.curRoleIdList = roleObj[roleName];
    }
  };

  // 查询
  const getCancelOrderList = async () => {
    formData.page = paginationData.page;
    formData.limit = paginationData.limit;
    let newFormData = new FormData();
    for (let key in formData) {
      newFormData.append(key, formData[key]);
    }
    const { code, data, count } = await salesPlatAccountDtoPage(newFormData);
    if (code === '0000') {
      tableData.value = data;
      paginationData.total = count;
    }
  };

  // 查询列表
  const handleQuery = () => {
    getCancelOrderList();
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    getCancelOrderList();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    getCancelOrderList();
  };

  // 高度
  const searchCardRef = ref();
  const height = computed(
    () => comGetTableHeight(searchCardRef, true, true) + 5
  );
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
</script>

<style lang="scss" scoped>
  .acctQueryFlag,
  :deep(.acctQueryFlag .el-input) {
    width: 70px !important;
  }

  .dialog_form {
    .el-input {
      width: 100%;
    }
    .el-form-item__content .el-select {
      width: 100%;
    }
    :deep(.el-input__wrapper) {
      width: 100%;
    }
    .el-textarea {
      width: 100%;
    }
  }
  .card-tool {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    span {
      padding: 0 10px;
      font-size: 12px;
    }
    .el-button {
      margin-left: 10px;
    }
  }
  .handleAcctAuth_input {
    width: 100% !important;
    margin-bottom: 10px;
  }

  :deep(.hide_tag) {
    .el-select-tags-wrapper {
      display: none;
    }
    :deep(.el-select__selected-item) {
      display: none;
    }
  }

  :deep(.search_form .el-form-item .el-form-item__label) {
    width: 100px !important;
  }
</style>
