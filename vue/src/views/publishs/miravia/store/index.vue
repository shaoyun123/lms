<template>
  <!-- miravia店铺页面 -->
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
          <el-button
            v-show="false"
            type="primary"
            style="margin-right: 10px"
            @click="handleSyncStore()"
            >同步</el-button
          >
          <el-select
            v-model="operationType"
            placeholder="批量操作"
            style="margin-right: 20px; width: 150px"
            @change="changeOperation"
          >
            <el-option
              v-permission="['miraviaStoreBatchEditBtn']"
              :value="0"
              label="批量修改店铺"
            ></el-option>
            <!-- <el-option
              v-permission="['miraviaStoreBatchOpenDownBtn']"
              :value="1"
              label="批量开启订单下载"
            ></el-option>
            <el-option
              v-permission="['miraviaStoreBatchCloseDownBtn']"
              :value="2"
              label="批量关闭订单下载"
            ></el-option> -->
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
        <vxe-column title="人员信息">
          <template #default="{ row }">
            <div>销售：{{ row.salesperson }}</div>
            <div>客服：{{ row.customServicer }}</div>
            <div>主管：{{ row.sellLeaderName }}</div>
          </template>
        </vxe-column>
        <!-- <vxe-column title="订单下载" width="100">
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
        <vxe-column title="备注" field="remark"></vxe-column>
        <vxe-column title="操作" width="200">
          <template #default="{ row }">
            <!-- <el-button type="primary" @click="handleAuth(row)">授权</el-button> -->
            <el-button
              v-permission="['miraviaStoreEditBtn']"
              type="primary"
              @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              v-permission="['miraviaCheckAccessToken']"
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
                  v-permission="['miraviaStartStore']"
                  type="danger"
                  >停用</el-button
                >
                <el-button
                  v-if="!row.status"
                  v-permission="['miraviaStopStore']"
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
  </div>
</template>

<script setup>
  import { reactive, ref, onMounted, computed } from 'vue';
  import { getStoreList, getSiteListApi } from '@/api/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import Updatedialog from '../../temu/store/components/Updatedialog.vue';
  import Edidialog from './components/Editdialog.vue';
  import Authdialog from './components/Authdialog.vue';
  import AuthManage from '@/components/AuthManage/index.vue';
  // import useUserStore from '@/store/modules/user';
  import { getCreator } from '@/api/publishs/tiktokstoremanage';
  import {
    salesPlatAccountDtoPage,
    syncStore,
    toggleStore
  } from '@/api/publishs/miraviastoremanage';
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
    status: true, // 店铺启用状态
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
      const { data: storeData } = await getStoreList('miravia');
      const { data: siteList } = await getSiteListApi('miravia');
      storeList.value = storeData.children;
      userData.siteData = siteList;
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
      const { code, data } = await getCreator({ platCode: 'miravia' });
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

  // 同步店铺
  const handleSyncStore = async () => {
    try {
      ElMessageBox.confirm('确定要同步店铺吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          tableLoading.value = true;
          const { code, msg } = await syncStore();
          if (code === '0000') {
            ElMessageBox.alert(msg, '同步结果', {
              confirmButtonText: '确定'
            });
            tableLoading.value = false;
            getStoreData();
          }
        })
        .catch((err) => {
          tableLoading.value = false;
          console.log(err);
        });
    } catch (err) {
      console.log(err);
      tableLoading.value = false;
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
    saleLeaderData: [],
    siteData: []
  });
  // 获取编辑的 销售员数据
  const getSalerData = async () => {
    try {
      const { data } = await querySalersData({ role: 'miravia专员' });
      userData.salesPersonData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取编辑的 客服专员数据
  const getServicerData = async () => {
    try {
      const { data } = await querySalersData({ role: 'miravia客服' });
      userData.customServicerData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取 销售主管
  const getLeadersData = async () => {
    try {
      const { data } = await queryLeadersData({ roleNames: 'miravia主管' });
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

  // 停用/启用 店铺
  const handleToggleStore = async (flag, row) => {
    let msg = row.flag ? '启用' : '停用';
    try {
      let params = {
        acctIdStr: row.id,
        flag
      };
      const { code } = await toggleStore(params);
      if (code === '0000') {
        ElMessage.success(msg + '店铺成功');
        getStoreData();
      }
    } catch (err) {
      console.log(err);
    }
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
