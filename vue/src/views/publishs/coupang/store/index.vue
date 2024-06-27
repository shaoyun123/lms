<template>
  <!-- coupang店铺页面 -->
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
          <el-cascader
            v-model="formData.storeAcct"
            :options="storeList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true, value: 'label' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="客服" prop="customServicerIds">
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
        </el-form-item>
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
            style="width: 120px"
            @change="changeOperation"
          >
            <el-option
              v-permission="['coupangStoreBatchEditBtn']"
              :value="0"
              label="批量修改店铺"
            ></el-option>
            <!-- <el-option
              v-permission="['coupangStoreBatchOpenDownBtn']"
              :value="1"
              label="批量开启订单下载"
            ></el-option>
            <el-option
              v-permission="['coupangStoreBatchCloseDownBtn']"
              :value="2"
              label="批量关闭订单下载"
            ></el-option> -->
          </el-select>
          <el-button
            v-permission="['coupangStoreAddBtn']"
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
        :scroll-y="{ gt: 15 }"
        border
      >
        <vxe-column type="checkbox" width="60" />
        <vxe-column title="店铺名称" field="storeAcct"></vxe-column>
        <!-- <vxe-column title="普源别名" field="allrootAliasName"></vxe-column> -->
        <vxe-column title="品牌" field="brand"></vxe-column>
        <vxe-column title="人员信息">
          <template #default="{ row }">
            <div>销售：{{ row.salesperson }}</div>
            <div>客服：{{ row.customServicer }}</div>
            <div>主管：{{ row.sellLeaderName }}</div>
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
        <vxe-column title="创建人" field="creator"></vxe-column>
        <vxe-column title="创建时间">
          <template #default="{ row }">
            {{ transferDate(row.createTime, false) }}
          </template>
        </vxe-column>
        <vxe-column title="备注" field="remark"></vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="handleAuth(row)">授权</el-button>
            <el-button
              v-permission="['coupangStoreEditBtn']"
              type="primary"
              @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['coupangCheckAccessToken']"
              type="success"
              @click="handleAuthManage(row)"
              >查看授权</el-button
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
      :edit-info="editInfo"
      @edit="getStoreData"
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
  </div>
</template>

<script setup>
  import { reactive, ref, onMounted, computed } from 'vue';
  import { getStoreList } from '@/api/common';
  import { ElMessage } from 'element-plus';
  import Updatedialog from '../../temu/store/components/Updatedialog.vue';
  import Edidialog from './components/Editdialog.vue';
  import Authdialog from './components/Authdialog.vue';
  import AuthManage from '@/components/AuthManage/index.vue';
  // import useUserStore from '@/store/modules/user';
  import {
    salesPlatAccountDtoPage,
    getCreator
  } from '@/api/publishs/coupangstoremanage';
  import {
    querySalersData,
    queryLeadersData
    // switchOrder
  } from '@/api/publishs/temustoremanage';
  import { transferDate } from '@/utils/common';
  const formData = reactive({
    page: 1,
    limit: 50,
    storeAcct: [],
    customServicerIds: '',
    // storeAcctId: '',
    orderDownloadStatus: '',
    creators: '',
    remark: ''
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
      const { data: storeData } = await getStoreList('coupang');
      storeList.value = storeData.children;
    } catch (err) {
      console.log('err :>> ', err);
    }
    getCreatorList();

    getSalerData();
    getServicerData();
    getLeadersData();
  });

  const tableLoading = ref(false);
  const formRef = ref(null);

  const filterStore = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };

  const createList = ref([]);
  // 获取创建人
  const getCreatorList = async () => {
    try {
      const { code, data } = await getCreator({ platCode: 'coupang' });
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
      let customServicerIds = '';
      let creators = '';

      if (
        formData.customServicerIds &&
        typeof formData.customServicerIds !== 'string'
      ) {
        customServicerIds = formData.customServicerIds.join(',');
      }
      if (formData.creators && typeof formData.creators !== 'string') {
        creators = formData.creators.join(',');
      }
      let _storeAcctId = '';
      if (formData.storeAcct) {
        _storeAcctId = formData.storeAcct
          .map((item) => item[3] || item[2])
          .filter((item) => !!item);
      } else {
        _storeAcctId = [];
      }
      const { data, count } = await salesPlatAccountDtoPage({
        ...formData,
        customServicerIds,
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

  // 获取用户名
  // const { userInfo } = useUserStore();
  // let userName = computed(() => userInfo.userName);
  const showUpdateDialog = ref(false);
  const changeOperation = (val) => {
    // val 0 批量修改店铺 1 开启订单下载 2 关闭订单下载
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
  };
  const closeAuthDialog = () => {
    showAuthDialog.value = false;
  };

  const userData = reactive({
    customServicerData: [],
    salesPersonData: [],
    saleLeaderData: []
  });
  // 获取编辑的 销售员数据
  const getSalerData = async () => {
    try {
      const { data } = await querySalersData({ role: 'coupang专员' });
      userData.salesPersonData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取编辑的 客服专员数据
  const getServicerData = async () => {
    try {
      const { data } = await querySalersData({ role: 'coupang客服' });
      userData.customServicerData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取 销售主管
  const getLeadersData = async () => {
    try {
      const { data } = await queryLeadersData({ roleNames: 'coupang主管' });
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
</script>

<style lang="scss" scoped>
  .hide_tag {
    :deep(.el-select-tags-wrapper) {
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
