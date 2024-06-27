<template>
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formDataRef"
        :model="formData"
        class="search_form"
        :inline="true"
      >
        <el-form-item prop="storeAcct">
          <el-select
            v-model="formData.status"
            placeholder="请选择"
            class="form_left"
            clearable
            filterable
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="已启用" :value="true"></el-option>
            <el-option label="已停用" :value="false"></el-option>
          </el-select>
          <el-input
            v-model="formData.storeAcct"
            placeholder="店铺名称,多个逗号分隔"
            style="width: 215px"
          >
            <template #append>
              <el-select v-model="formData.acctQueryFlag" class="acctQueryFlag">
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
            @change="handleOrgId"
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
        <el-form-item label="销售员" prop="salespersonId">
          <el-select
            v-model="formData.salespersonId"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option
              v-for="item in state.salespersonIdList"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="listingQuotaRemainMin" class="form_range">
          <el-select
            v-model="formData.mercadoSite"
            placeholder="请选择"
            class="form_left"
            clearable
            filterable
          >
            <el-option label="巴西已使用额度" value="MLB"></el-option>
            <el-option label="墨西哥已使用额度" value="MLM"></el-option>
            <el-option label="智利已使用额度" value="MLC"></el-option>
            <el-option label="哥伦比亚已使用额度" value="MCO"></el-option>
          </el-select>
          <el-input
            v-model="formData.listingQuotaRemainMin"
            placeholder=">="
            clearable
            class="form_right"
          ></el-input>
          <div class="range_link">-</div>
          <el-input
            v-model="formData.listingQuotaRemainMax"
            placeholder="<="
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            style="width: 215px"
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
        <el-form-item label="同步listing状态" prop="syncStatus">
          <el-select
            v-model="formData.syncStatus"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="同步中" value="2"></el-option>
            <el-option label="同步成功" value="3"></el-option>
            <el-option label="同步失败" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="searchLoading"
            @click="getCancelOrderList"
            >搜索</el-button
          ><el-button @click="resetQuery">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list_card">
      <div class="card-tool">
        <div>数量（{{ paginationData.total }}）</div>
        <div>
          <el-button
            v-permission="['mercadoaccountListingBtn']"
            type="success"
            @click="syncListing"
            >同步Listing</el-button
          >
          <el-dropdown style="margin: 0 10px">
            <el-button type="primary">
              批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-permission="['mercadoaccountEditInfoBtn']"
                  @click="handleInfo()"
                  >修改信息</el-dropdown-item
                >
                <el-dropdown-item @click="handleStoreStatus('启用')"
                  >批量启用店铺</el-dropdown-item
                >
                <el-dropdown-item @click="handleStoreStatus('停用')"
                  >批量停用店铺</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
        border
      >
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column field="storeAcct" title="店铺名称"></vxe-column>
        <vxe-column field="mercadoPlatSellerIdStr" title="平台店铺id">
          <template #default="{ row }">
            <div v-if="row.mercadoPlatSellerIdStr != undefined">
              <div
                v-for="item in row.mercadoPlatSellerIdStr.split(',')"
                :key="item"
              >
                {{ item }}
              </div>
            </div>
          </template></vxe-column
        >
        <vxe-column field="sellerId" title="oa店铺id"></vxe-column>
        <vxe-column field="status" title="店铺状态" width="100">
          <template #default="{ row }">
            <div v-if="row.status == true">已启用</div>
            <div v-if="row.status == false">已停用</div>
          </template></vxe-column
        ><vxe-column field="brand" title="品牌"></vxe-column>
        <vxe-column title="access_token到期">
          <template #default="{ row }">
            <span v-if="row.accessTokenExpiryTime">{{
              parseTime(
                row.accessTokenExpiryTime || '',
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }}</span>
          </template></vxe-column
        >
        <vxe-column title="人员信息" width="100">
          <template #default="{ row }">
            <div>销售：{{ row.salesperson }}</div>
            <div>客服：{{ row.customServicer }}</div>
            <div>主管：{{ row.sellLeaderName }}</div>
          </template>
        </vxe-column>
        <vxe-column title="Listing总额度">
          <template #default="{ row }">
            <div v-for="item in row.mercadoQuota" :key="item.id">
              <div>
                {{ item.salesSite == 'MCO' ? `哥伦比亚：` + item.quota : '' }}
              </div>
              <div>
                {{ item.salesSite == 'MLM' ? `墨西哥：` + item.quota : '' }}
              </div>
              <div>
                {{ item.salesSite == 'MLB' ? `巴西：` + item.quota : '' }}
              </div>
              <div>
                {{ item.salesSite == 'MLC' ? `智利：` + item.quota : '' }}
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="Listing已使用额度">
          <template #default="{ row }">
            <div v-for="item in row.mercadoQuota" :key="item.id">
              <div>
                {{
                  item.salesSite == 'MCO' ? `哥伦比亚：` + item.totalItems : ''
                }}
              </div>
              <div>
                {{
                  item.salesSite == 'MLM' ? `墨西哥：` + item.totalItems : ''
                }}
              </div>
              <div>
                {{ item.salesSite == 'MLB' ? `巴西：` + item.totalItems : '' }}
              </div>
              <div>
                {{ item.salesSite == 'MLC' ? `智利：` + item.totalItems : '' }}
              </div>
            </div>
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
              v-permission="['mercadoaccountAuthBtn']"
              type="success"
              @click="getAuth(row)"
              >授权
            </el-button>
            <el-button
              v-permission="['mercadoaccountEditBtn']"
              type="success"
              @click="handleAcct('edit', row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['mercadoCheckAccessToken']"
              type="success"
              @click="handleAuthManage(row)"
              >查看授权
            </el-button>
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
  <!-- 修改信息 弹窗 -->
  <el-dialog
    v-model="handleInfoVisiable"
    title="修改信息"
    width="20%"
    :close-on-click-modal="false"
    @close="
      formDataEdit.salespersonId =
        formDataEdit.sellLeaderId =
        formDataEdit.customServicerId =
          ''
    "
  >
    <el-form :model="formDataEdit" :label-width="100">
      <el-form-item label="销售员" prop="salespersonId">
        <el-select
          v-model="formDataEdit.salespersonId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in state.salespersonIdEdit"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售主管" prop="sellLeaderId">
        <el-select
          v-model="formDataEdit.sellLeaderId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in state.sellLeaderIdEdit"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客服专员" prop="customServicerId">
        <el-select
          v-model="formDataEdit.customServicerId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in state.salespersonIdEdit"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleInfoSave">保存</el-button>
        <el-button @click="handleInfoVisiable = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 店铺授权 弹窗 -->
  <el-dialog
    v-model="handleAcctAuth"
    title="店铺授权"
    width="30%"
    :close-on-click-modal="false"
  >
    <el-input
      class="handleAcctAuth_input"
      disabled
      placeholder="步骤一：点击进入链接，登录美客多账号，成功后复制网页地址栏中的code参数"
    /><br />
    <el-input class="handleAcctAuth_input" disabled :value="acctAuthUrl">
      <template #append>
        <a :href="acctAuthUrl" target="_blank">进入链接</a>
      </template> </el-input
    ><br />
    <el-input
      class="handleAcctAuth_input"
      disabled
      placeholder="步骤二：填写获取的code，点击保存，即可成功授权"
    /><br />
    <el-input
      v-model="formDataEdit.code"
      class="handleAcctAuth_input"
      placeholder="请输入code"
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
    width="35%"
    :close-on-click-modal="false"
    :before-close="handleAcctClose"
  >
    <el-button
      v-if="handleAcctData.status == true"
      type="danger"
      style="float: right"
      @click="handleStoreStatus('停用', handleAcctData.id)"
      >停用店铺</el-button
    >
    <el-button
      v-if="handleAcctData.status == false"
      type="primary"
      style="float: right"
      @click="handleStoreStatus('启用', handleAcctData.id)"
      >启用店铺</el-button
    >
    <el-form
      ref="formEl"
      class="dialog_form"
      :model="handleAcctData"
      :inline="true"
      :label-width="100"
      :rules="formRules"
    >
      <el-form-item label="店铺名称" prop="storeAcct">
        <el-input v-model="handleAcctData.storeAcct" />
      </el-form-item>
      <el-form-item label="站点" prop="salesSite">
        <el-select
          v-model="handleAcctData.salesSite"
          placeholder="请选择"
          :class="handleAcctData.salesSite.length > 1 ? 'hide_tag' : ''"
          filterable
          collapse-tags
          collapse-tags-tooltip
          clearable
          multiple
        >
          <template #prefix>
            <el-tag v-if="handleAcctData.salesSite.length > 1" type="info"
              >已选{{ handleAcctData.salesSite.length }}项</el-tag
            >
          </template>
          <el-option
            v-for="item in sites"
            :key="item"
            :label="sitesName[item]"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺账号" prop="storeName">
        <el-input v-model="handleAcctData.storeName" />
      </el-form-item>
      <el-form-item label="注册邮箱" prop="registerEmail">
        <el-input v-model="handleAcctData.registerEmail" />
      </el-form-item>
      <el-form-item label="销售员" prop="salespersonId">
        <el-select
          v-model="handleAcctData.salespersonId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in state.salespersonIdEdit"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售主管" prop="sellLeaderId">
        <el-select
          v-model="handleAcctData.sellLeaderId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in state.sellLeaderIdEdit"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客服专员" prop="customServicerId">
        <el-select
          v-model="handleAcctData.customServicerId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in state.salespersonIdEdit"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="handleAcctData.brand" />
      </el-form-item>
      <!-- <el-form-item label="普源别名" prop="allrootAliasName">
        <el-input v-model="handleAcctData.allrootAliasName" />
      </el-form-item> -->
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

<script setup name="configurestoremercadoaccount">
  import { ref, reactive, onMounted, computed } from 'vue';
  import {
    salesPlatAccountDtoPage,
    getPersonAndOrgsByRole,
    listuserbyrole,
    editSalesPerson,
    // updateOrderStatusById,
    batchUpdateAcctStatus,
    saveAuthInfo,
    addSalesPlatAccountBaseAndDetailInfo,
    SyncMercadoProduct,
    getMercadoAuthLink
  } from '@/api/configure/mercadoaccount';
  import AuthManage from '@/components/AuthManage/index.vue';

  import { ElMessage, ElMessageBox } from 'element-plus';
  import { parseTime } from '@/utils/common';

  const formData = reactive({
    storeAcct: '', //店铺
    acctQueryFlag: '1', // 精确&模糊
    orgId: '', //部门
    salespersonId: '', // 销售员
    listingQuotaRemainMin: '', // 已使用额度
    listingQuotaRemainMax: '', // 已使用额度
    remark: '', // 备注
    syncDesc: '', // 同步异常备注
    syncStatus: '',
    status: true,
    mercadoSite: 'MLB'
  });

  const formDataEdit = reactive({
    salespersonId: '', // 销售员
    sellLeaderId: '', // 销售主管
    customServicerId: '', // 客服专员
    code: ''
  });

  const state = reactive({
    orgIdList: [], // 部门
    salespersonIdList: [], // 销售员
    allSalespersonIdList: [],
    salespersonIdEdit: '', // 销售员
    sellLeaderIdEdit: '' // 销售主管
  });

  const formDataRef = ref();
  const resetQuery = () => {
    formDataRef.value.resetFields();
    formData.acctQueryFlag = '1';
    formData.listingQuotaRemainMax = '';
    formData.mercadoSite = 'MLB';
    formData.status = true;
  };

  // 同步Listing
  const syncListing = async () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择店铺');
      return;
    }
    let ids = checkedData.map((item) => item.id).join(',');
    let formData = new FormData();
    formData.append('acctIds', ids);
    formData.append('batchNo', new Date().getTime());
    formData.append('platCode', 'mercado');

    const { code } = await SyncMercadoProduct(formData);
    if (code == '0000') {
      ElMessage.success('操作完成');
      getCancelOrderList();
    }
  };
  // 编辑信息
  const handleInfoVisiable = ref(false);
  const handleInfo = () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择店铺');
      return;
    }
    handleInfoVisiable.value = true;
  };
  // 编辑信息--保存
  const handleInfoSave = async () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    const ids = checkedData.map((item) => item.id);
    let salesperson = '', // 销售员
      sellLeader = '', // 销售主管
      customServicer = ''; // 客服专员
    formDataEdit.salespersonId == ''
      ? ''
      : (salesperson = state.salespersonIdEdit.filter(
          (item) => item.id == formDataEdit.salespersonId
        )[0].userName);
    formDataEdit.sellLeaderId == ''
      ? ''
      : (sellLeader = state.sellLeaderIdEdit.filter(
          (item) => item.id == formDataEdit.sellLeaderId
        )[0].userName);
    formDataEdit.customServicerId == ''
      ? ''
      : (customServicer = state.salespersonIdEdit.filter(
          (item) => item.id == formDataEdit.customServicerId
        )[0].userName);
    let formData = new FormData();
    formData.append('ids', ids);
    formData.append('salesperson', salesperson);
    formData.append('sellLeaderName', sellLeader);
    formData.append('customServicer', customServicer);
    formData.append('salespersonId', formDataEdit.salespersonId);
    formData.append('sellLeaderId', formDataEdit.sellLeaderId);
    formData.append('customServicerId', formDataEdit.customServicerId);
    const { code, data } = await editSalesPerson(formData);
    if (code == '0000') {
      ElMessage.success(data);
      handleInfoVisiable.value = false;
      getCancelOrderList();
    }
  };
  //   店铺授权
  const handleAcctAuth = ref(false);
  const currentRow = ref();
  const acctAuthUrl = ref('');
  const getAuth = async (row) => {
    let urlRes = await getMercadoAuthLink();
    acctAuthUrl.value = (urlRes && urlRes.data) || '';
    formDataEdit.code = '';
    currentRow.value = row;
    handleAcctAuth.value = true;
  };
  //   店铺授权 -- 保存
  const getAuthSave = async () => {
    if (formDataEdit.code == '') {
      ElMessage.warning('请输入code');
      return;
    }
    let formData = new FormData();
    formData.append('salesAcctId', currentRow.value.id);
    formData.append('platCode', 'mercado');
    formData.append('clientId', currentRow.value.clientId);
    formData.append('clientSecret', currentRow.value.clientSecret);
    formData.append('code', formDataEdit.code);

    const { code, msg } = await saveAuthInfo(formData);
    if (code == '0000') {
      ElMessage.success(msg);
      handleAcctAuth.value = false;
      acctAuthUrl.value = '';
    }
  };

  // 批量--开启&关闭店铺状态
  const handleStoreStatus = (type, id) => {
    let ids = '';
    if (id) {
      ids = id;
    } else {
      const checkedData = tableDataRef.value.getCheckboxRecords();
      if (checkedData.length == 0) {
        ElMessage.warning('请选择店铺');
        return;
      }
      ids = checkedData.map((item) => item.id).join(',');
    }
    ElMessageBox.confirm(`确定${id ? '' : '批量'}${type}店铺吗`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        handleStoreStatusApi(type, ids);
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
  };
  // 批量--开启&关闭店铺状态API
  const handleStoreStatusApi = async (val, ids) => {
    const { code } = await batchUpdateAcctStatus({
      acctIdStr: ids,
      flag: val == '启用' ? true : false
    });
    if (code === '0000') {
      ElMessage.success('操作成功');
      getCancelOrderList();
    }
  };

  // 新增&编辑店铺
  const formRules = reactive({
    storeAcct: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
    // allrootAliasName: [
    //   { required: true, message: '请输入普源别名', trigger: 'blur' }
    // ],
    storeName: [{ required: true, message: '请输入店铺账号', trigger: 'blur' }],
    salesSite: [{ required: true, message: '请选择站点', trigger: 'change' }],
    registerEmail: [
      { required: true, message: '请输入注册邮箱', trigger: 'blur' }
    ],
    salespersonId: [
      { required: true, message: '请选择销售员', trigger: 'blur' }
    ],
    sellLeaderId: [
      { required: true, message: '请选择销售主管', trigger: 'blur' }
    ],
    customServicerId: [
      { required: true, message: '请选择客服专员', trigger: 'blur' }
    ]
  });
  const handleAcctVisiable = ref(false);
  const formEl = ref();
  const handleAcctData = reactive({
    storeAcct: '',
    storeName: '',
    salesSite: [],
    brand: '',
    allrootAliasName: '',
    registerEmail: '',
    salespersonId: '',
    sellLeaderId: '',
    customServicerId: '',
    remark: '',
    acctDetailId: '',
    id: '',
    status: ''
  });
  const sites = ['MLM', 'MLB', 'MLC', 'MCO'];
  const sitesName = {
    MLB: '巴西',
    MLM: '墨西哥',
    MCO: '哥伦比亚',
    MLC: '智利'
  };
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
        key == 'salesSite'
          ? (handleAcctData[key] = row[key].split(','))
          : (handleAcctData[key] = row[key]);
      }
      handleAcctData['acctBaseId'] = handleAcctData.id;
    }
    handleAcctVisiable.value = true;
  };
  const handleAcctSave = async (formRef) => {
    // 校验
    if (!formRef) return;
    await formRef.validate(async (valid) => {
      if (valid) {
        let newFormData = new FormData();
        handleAcctData.customServicer = state.salespersonIdEdit.filter(
          (item) => item.id == handleAcctData.customServicerId
        )[0].userName;
        handleAcctData.salesperson = state.salespersonIdEdit.filter(
          (item) => item.id == handleAcctData.salespersonId
        )[0].userName;
        handleAcctData.sellLeaderName = state.sellLeaderIdEdit.filter(
          (item) => item.id == handleAcctData.sellLeaderId
        )[0].userName;
        handleAcctData['acctBaseRemark'] =
          handleAcctData.remark == '' || handleAcctData.remark == undefined
            ? ''
            : handleAcctData.remark;
        for (let key in handleAcctData) {
          newFormData.append(key, handleAcctData[key]);
        }
        newFormData.append('platCode', 'mercado');
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

  // 按钮 loading
  const searchLoading = ref(false);

  onMounted(() => {
    getPersonAndOrgsByRoleFunc();
    listuserbyroleFunc();
  });

  // 获取部门&销售员
  const getPersonAndOrgsByRoleFunc = async () => {
    let formData = new FormData();
    formData.append('roleNames', 'mercado专员');
    const { code, data } = await getPersonAndOrgsByRole(formData);
    if (code === '0000') {
      state.orgIdList = data.orgTree;
      state.salespersonIdList = data.userList;
      state.allSalespersonIdList = data.userList;
    }
  };
  // 获取销售员&销售主管&客服专员
  const listuserbyroleFunc = async () => {
    {
      let formData = new FormData();
      formData.append('role', 'mercado专员');
      const { code, data } = await listuserbyrole(formData);
      if (code === '0000') {
        state.salespersonIdEdit = data;
      }
    }
    {
      let formData = new FormData();
      formData.append('role', 'mercado主管');
      const { code, data } = await listuserbyrole(formData);
      if (code === '0000') {
        state.sellLeaderIdEdit = data;
      }
    }
  };

  const handleOrgId = (val) => {
    if (val != '') {
      formData.salespersonId = '';
      state.salespersonIdList = state.allSalespersonIdList.filter(
        (item) => item.org_id == val
      );
    } else {
      formData.salespersonId = '';
      state.salespersonIdList = state.allSalespersonIdList;
    }
  };

  // 查询
  const getCancelOrderList = async () => {
    searchLoading.value = true;
    formData.page = paginationData.page;
    formData.limit = paginationData.limit;
    if (
      formData.listingQuotaRemainMax == '' &&
      formData.listingQuotaRemainMin == ''
    ) {
      formData.mercadoSite = '';
    }
    let newFormData = new FormData();
    for (let key in formData) {
      newFormData.append(key, formData[key]);
    }
    const { code, data, count } = await salesPlatAccountDtoPage(newFormData);
    if (code === '0000') {
      tableData.value = data;
      paginationData.total = count;
    }
    searchLoading.value = false;
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
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 280;
  });
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
      width: 180px;
      // height: 24px;
    }
    .el-form-item__content .el-select {
      width: 180px;
      // height: 24px;
    }
    :deep(.el-input__wrapper) {
      width: 166px;
    }
    .el-textarea {
      width: 470px;
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

  .hide_tag {
    :deep(.el-select__selected-item) {
      display: none;
    }
  }

  :deep(.search_form .el-form-item .el-form-item__label) {
    width: 100px !important;
  }
</style>
