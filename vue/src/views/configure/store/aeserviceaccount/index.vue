<template>
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
          prop="storeAcct"
          class="store_manage_item_cascader"
        >
          <el-cascader
            ref="storeAcct"
            v-model="formData.storeAcct"
            :options="storeList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true, value: 'label' }"
            @change="changeOrg"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="searchPersonIdList">
          <el-select
            v-model="formData.searchPersonType"
            class="form_left"
            @change="changeRole"
          >
            <el-option
              v-for="item in [
                { name: '客服', id: 2 },
                { name: '组长', id: 4 }
              ]"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <MultiSelect
            v-model="formData.searchPersonIdList"
            :option-obj="{
              optionList: userData.filterData,
              value: 'id',
              label: 'userName'
            }"
          />
        </el-form-item>
        <!-- <el-form-item label="客服" prop="customServicerIds">
          <el-select
            v-model="formData.customServicerIds"
            :class="formData.customServicerIds.length > 1 ? 'hide_tag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.customServicerIds.length > 1" type="info"
                >已选{{ formData.customServicerIds.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in userData.customServicerData"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="订单下载" prop="orderDownloadStatus">
          <el-select v-model="formData.orderDownloadStatus" clearable>
            <el-option label="已关闭" :value="false"></el-option>
            <el-option label="已开启" :value="true"></el-option>
          </el-select>
        </el-form-item> -->
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
        <el-form-item label="排序" prop="orderByType">
          <el-select v-model="formData.orderByType" filterable>
            <el-option
              v-for="item in STORE_ORDER"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
            style="margin-right: 20px; width: 150px"
            @change="changeOperation"
          >
            <el-option
              v-permission="['aeServiceStoreBatchEditBtn']"
              :value="0"
              label="批量修改店铺"
            ></el-option>
            <!-- <el-option
              v-permission="['aeServiceStoreBatchOpenDownBtn']"
              :value="1"
              label="批量开启订单下载"
            ></el-option>
            <el-option
              v-permission="['aeServiceStoreBatchCloseDownBtn']"
              :value="2"
              label="批量关闭订单下载"
            ></el-option> -->
            <el-option :value="3" label="批量导出"></el-option>
          </el-select>
        </div>
      </div>
      <vxe-table
        ref="storeRef"
        v-loading="tableLoading"
        :data="tableData"
        :height="height"
        :scroll-y="{ gt: 15 }"
        border
      >
        <vxe-column type="checkbox" width="60" />
        <vxe-column title="店铺名称" field="storeAcct"></vxe-column>
        <vxe-column title="店铺状态" field="status">
          <template #default="{ row }">
            <el-tag v-if="row.status" type="success">启用中</el-tag>
            <el-tag v-else type="danger">已停用</el-tag>
          </template>
        </vxe-column>
        <vxe-column title="品牌" field="brand"></vxe-column>
        <vxe-column title="商家编码" field="sellerId"></vxe-column>
        <vxe-column title="人员信息">
          <template #default="{ row }">
            <div>销售：{{ row.salesperson }}</div>
            <div>客服：{{ row.customServicer }}</div>
            <div>主管：{{ row.sellLeaderName }}</div>
            <div>组长：{{ row.leaderName }}</div>
          </template>
        </vxe-column>
        <!-- <vxe-column title="订单下载">
          <template #default="{ row }">
            <el-switch
              v-model="row.orderDownloadStatus"
              size="default"
              inline-prompt
              active-text="开启"
              inactive-text="关闭"
              @change="changeSwitch(row)"
            />
          </template>
        </vxe-column> -->
        <vxe-column title="授权到期时间">
          <template #default="{ row }">
            <div>
              refresh:{{ transferDate(row.refreshTokenExpiryTime * 1000) }}
            </div>
            <div>
              access:{{ transferDate(row.accessTokenExpiryTime * 1000) }}
            </div>
          </template>
        </vxe-column>
        <vxe-column title="创建人" field="creator"></vxe-column>
        <vxe-column title="创建时间">
          <template #default="{ row }">
            {{ transferDate(row.createTime) }}
          </template>
        </vxe-column>
        <vxe-column title="同步备注" field="syncDesc"></vxe-column>
        <vxe-column title="备注" field="remark"></vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <!-- <el-button type="primary" @click="handleAuth(row)">授权</el-button> -->
            <el-button
              v-permission="['aeServiceStoreEditBtn']"
              type="primary"
              @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['aeServiceCheckAccessToken']"
              type="primary"
              @click="handleAuthManage(row)"
              >查看授权</el-button
            >
            <el-popconfirm
              :title="`确定要${row.status ? '停用' : '启用'}店铺吗？`"
              @confirm="handleToggleStore(!row.status, row)"
            >
              <template #reference>
                <el-button
                  v-if="row.status"
                  v-permission="['aeServiceStartStore']"
                  type="danger"
                  >停用</el-button
                >
                <el-button
                  v-if="!row.status"
                  v-permission="['aeServiceStopStore']"
                  type="success"
                  >启用</el-button
                >
              </template>
            </el-popconfirm>
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
      plat-code="AE全托管"
      :select-records="selectRecords"
      @close="closeUpdateDialog"
    />

    <!-- 增加/修改 店铺信息 -->
    <Edidialog
      v-if="showEditDialog"
      :user-data="userData"
      :show-edit-dialog="showEditDialog"
      :action="action"
      :edit-info="editInfo"
      @edit="getStoreData"
      @fresh-creator="getCreatorList"
      @close="closeEditDialog"
    />

    <!-- 授权弹窗 -->
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

    <!-- 批量导出 -->
    <ExportConfirmDialog
      v-model="exportConfirmVisible"
      :goods-info-list-copy="goodsHeaderInfoList"
      :title="exportTitle"
      :require-checked-field="requireCheckedField"
      @checked-export-info="checkedExportInfo"
      @close="closeExportConfirmDialog"
    />
  </div>
</template>

<script setup name="configurestoreaeserviceaccount">
  import { reactive, ref, onMounted, computed } from 'vue';
  import { getStoreList } from '@/api/common';
  import { ElMessage } from 'element-plus';
  import Updatedialog from '@/views/publishs/temu/store/components/Updatedialog.vue';
  import Edidialog from './components/Editdialog.vue';
  import Authdialog from './components/Authdialog.vue';
  // import useUserStore from '@/store/modules/user';
  import { getCreator } from '@/api/publishs/tiktokstoremanage';
  import { getExportAeFullManageStoreHeaderApi } from '@/api/publishs/aefullystoremanage';
  import {
    salesPlatAccountDtoPage,
    getAcctRoleUserMap,
    toggleStoreApi
  } from '@/api/configure/aeserviceaccount';
  import AuthManage from '@/components/AuthManage/index.vue';
  import {
    querySalersData,
    queryLeadersData
    // switchOrder
  } from '@/api/publishs/temustoremanage';
  import { transferDate } from '@/utils/common';
  import { STORE_ORDER } from './config.js';
  import ExportConfirmDialog from '@/components/ExportConfirmDialog/index.vue';
  import { transBlob } from '@/utils/downloadFile';
  // import { getPersonAndOrgApi } from '@/api/configure/storeconf.js';
  import { getCustomerListApi } from '@/api/common';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  const formData = reactive({
    page: 1,
    limit: 50,
    storeAcct: [],
    searchPersonType: 2,
    searchPersonIdList: '',
    // storeAcctId: '',
    orderDownloadStatus: '',
    creators: [],
    remark: '',
    status: true,
    orderByType: '' // 默认创建时间正序
  });
  // 店铺级联数据
  const storeList = ref([]);

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
      const { data: storeData } = await getStoreList('AE全托管');
      storeList.value = storeData.children;
    } catch (err) {
      console.log('err :>> ', err);
    }
    getCreatorList();

    getSalerData();
    getServicerData();
    getLeadersData();
    getGroupLeadersData();
    getStoreHeaderList();
  });

  const tableLoading = ref(false);
  const formRef = ref(null);

  const filterStore = (node, keyword) => {
    const label = node?.label?.trim();
    const text = node?.text?.trim();
    const _keyword = keyword.trim().replaceAll('，', ',').split(',');
    const hasLabel = _keyword.some((item) => label.includes(item));
    const hasText = _keyword.some((item) => text.includes(item));
    if (hasLabel || hasText) {
      return node;
    }
  };

  const createList = ref([]);
  // 获取创建人
  const getCreatorList = async () => {
    try {
      const { code, data } = await getCreator({ platCode: 'AE全托管' });
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

  // 获取列表数据
  const getStoreData = async () => {
    try {
      tableLoading.value = true;
      let searchPersonIdListStr = formData.searchPersonIdList.join(',');
      let creators = '';
      if (formData.creators && typeof formData.creators !== 'string') {
        creators = formData.creators.join(',');
      }
      let _storeAcctId = '';
      if (formData.storeAcct) {
        _storeAcctId = formData.storeAcct
          .map((item) => item[item.length - 1])
          .filter((item) => !!item);
      } else {
        _storeAcctId = [];
      }
      const { data, count } = await salesPlatAccountDtoPage({
        ...formData,
        searchPersonIdListStr,
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

  // 获取导出店铺表头信息
  const goodsHeaderInfoList = ref([]);
  const getStoreHeaderList = async () => {
    const { data } = await getExportAeFullManageStoreHeaderApi();
    goodsHeaderInfoList.value = data;
  };

  // 获取用户名
  // const { userInfo } = useUserStore();
  // let userName = computed(() => userInfo.userName);
  const showUpdateDialog = ref(false);
  const changeOperation = (val) => {
    // 批量导出
    if (val === 3) {
      exportConfirmVisible.value = true;
      return;
    }
    // val 0 批量修改店铺 1 开启订单下载 2 关闭订单下载 3 批量导出
    if (getSelectedList()) {
      if (val === 0) {
        showUpdateDialog.value = true;
      }
      // if (val === 1 || val === 2) {
      //   let msg = val === 1 ? '开启' : '关闭';
      //   let value = val === 1 ? true : false;
      //   ElMessageBox.confirm(`确定批量${msg}订单下载吗？`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   })
      //     .then(async () => {
      //       let params = {
      //         idListStr: selectRecords.value.map((item) => item.id).join(','),
      //         orderDownStatus: value,
      //         lmsAppUserName: userName.value
      //       };
      //       const { code } = await switchOrder(params);
      //       if (code === '0000') {
      //         ElMessage.success(`批量${msg}成功！`);
      //       }
      //       operationType.value = '';
      //       getStoreData();
      //     })
      //     .catch((err) => {
      //       if (err === 'cancel') {
      //         operationType.value = '';
      //       }
      //     });
      // }
    }
  };

  // 切换订单是否下载
  // const changeSwitch = async (row) => {
  //   let status = row.orderDownloadStatus;
  //   row.orderDownloadStatus = !status;
  //   let params = {
  //     idListStr: row.id,
  //     orderDownStatus: status,
  //     lmsAppUserName: userName.value
  //   };
  //   try {
  //     const { code } = await switchOrder(params);
  //     if (code === '0000') {
  //       ElMessage.success(`设置成功！`);
  //       status
  //         ? (row.orderDownloadStatus = true)
  //         : (row.orderDownloadStatus = false);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
  // const handleAuth = (row) => {
  //   showAuthDialog.value = true;
  //   editInfo.value = row;
  // };
  // const addStore = () => {
  //   action.value = 'add';
  //   showEditDialog.value = true;
  // };
  const closeEditDialog = () => {
    showEditDialog.value = false;
  };
  const closeAuthDialog = () => {
    showAuthDialog.value = false;
  };

  const userData = reactive({
    customServicerData: [],
    salesPersonData: [],
    groupLeaderData: [],
    filterData: [],
    saleLeaderData: []
  });
  // 获取编辑的 销售员数据
  const getSalerData = async () => {
    try {
      const { data } = await querySalersData({ role: 'AE全托管专员' });
      userData.salesPersonData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取编辑的 客服专员数据
  const getServicerData = async () => {
    try {
      const { data } = await querySalersData({ role: 'AE全托管客服' });
      userData.customServicerData = data;
      userData.filterData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取 销售主管
  const getLeadersData = async () => {
    try {
      const { data } = await queryLeadersData({ roleNames: 'AE全托管主管' });
      userData.saleLeaderData = data.userList;
    } catch (err) {
      console.log(err);
    }
  };

  const storeAcct = ref();
  // 获取 组长所有数据
  const getGroupLeadersData = async () => {
    try {
      const { code, data } = await getCustomerListApi({ role: 'AE全托管组长' });
      if (code === '0000') {
        userData.groupLeaderData = data || [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取 店铺-组长联动
  const getFilterGroupLeadersData = async () => {
    if (formData.storeAcct && formData.storeAcct.length != 0) {
      // 组长
      const checkNode = storeAcct.value.getCheckedNodes();
      let cateId = checkNode
        .filter((item) => item.isLeaf)
        .map((item) => item.data.value);
      // 获取店铺-组长数据
      try {
        const { code, data } = await getAcctRoleUserMap({
          storeAcctIdList: cateId.join(',')
        });
        if (code === '0000') {
          userData.filterData = data.组长 || [];
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      userData.filterData = userData.groupLeaderData;
    }
  };

  // 切换店铺
  const changeOrg = async () => {
    if (formData.searchPersonType == 4) {
      formData.searchPersonIdList = '';
      getFilterGroupLeadersData();
    }
  };

  // 切换角色
  const changeRole = async () => {
    formData.searchPersonIdList = '';
    if (formData.searchPersonType == 4) {
      // 4-->'组长'
      getFilterGroupLeadersData();
    } else if (formData.searchPersonType == 2) {
      // 客服
      userData.filterData = userData.customServicerData;
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
  // 停用/启用 店铺
  const handleToggleStore = async (flag, row) => {
    let msg = row.flag ? '启用' : '停用';
    try {
      let params = {
        acctIdStr: row.id,
        flag
      };
      const { code } = await toggleStoreApi(params);
      if (code === '0000') {
        ElMessage.success(msg + '店铺成功');
        getStoreData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 格式化导出传参
  const formatFormData = () => {
    const obj = JSON.parse(JSON.stringify(formData));

    if (obj.storeAcct.length) {
      obj.storeAcct = formData.storeAcct
        .map((item) => item[item.length - 1])
        .filter((item) => !!item)
        .join(',');
    } else {
      obj.storeAcct = '';
    }
    return obj;
  };

  const exportConfirmVisible = ref(false);
  const exportTitle = '导出店铺信息';
  const requireCheckedField = ['storeAcct'];

  // 返回的导出确认框勾选信息
  const checkedList = ref([]);
  const checkedIdList = ref([]);
  const checkedExportInfo = async (info) => {
    checkedList.value = storeRef.value.getCheckboxRecords();
    if (info.type === 1 && !checkedList.value.length) {
      return ElMessage.warning('导出失败，当前列表未选择数据！');
    }
    tableLoading.value = true;
    const newFormData = formatFormData();

    // 选择导出列表选中数据
    if (info.type === 1 && checkedList.value.length) {
      checkedIdList.value = checkedList.value.map((item) => item.id);
    }

    let params = {};
    if (info.type === 1) {
      params = {
        ids: checkedIdList.value,
        aeFullManageExportFields: info.selectedExportFieldList,
        platCode: 'AE全托管'
      };
    }
    if (info.type === 2) {
      params = {
        aeFullManageExportFields: info.selectedExportFieldList,
        ...newFormData,
        platCode: 'AE全托管'
      };
    }

    transBlob({
      url: '/lms/salesplat/exportAeFullManageStore.html?platCode=AE%E5%85%A8%E6%89%98%E7%AE%A1',
      data: params,
      fileName: '店铺信息' + transferDate(new Date().getTime()) + '.xls'
    }).finally(() => {
      tableLoading.value = false;
      ElMessage.success('下载成功');
    });
  };

  const closeExportConfirmDialog = () => {
    operationType.value = '';
    exportConfirmVisible.value = false;
  };
</script>

<style lang="scss" scoped>
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
