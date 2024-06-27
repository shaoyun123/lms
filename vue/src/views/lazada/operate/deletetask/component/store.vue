<template>
  <div class="lazadaDeleteTaskStore">
    <el-dialog
      v-model="showExport"
      title="删除任务店铺设置"
      width="50%"
      class="roll-dialog"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div style="display: flex; justify-content: space-between">
        <el-form-item label="店铺" prop="storeAcctIds">
          <ZSelect v-model="storeAcctIds" :items="storeList" :num="1" />
        </el-form-item>
        <div>
          <el-button type="danger" size="small" @click="batchDel()"
            >批量移除店铺</el-button
          ><el-button type="primary" size="small" @click="addStore"
            >添加店铺</el-button
          >
        </div>
      </div>
      <vxe-table
        ref="tableDataRef"
        v-loading="tableDataLoading"
        style="margin-top: 10px"
        :data="tableData"
        :height="height"
        :align="'center'"
        border
        :edit-config="{
          trigger: 'dblclick',
          mode: 'cell'
        }"
        @edit-closed="editClosed"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺名称" />
        <vxe-column field="listingLimit" title="listing总额度" />
        <vxe-column field="listingRemainingLimit" title="listing可用额度" />
        <vxe-column
          field="listingCount"
          title="删除数量限制"
          :slots="{ edit: 'edit' }"
          :edit-render="{ name: 'input' }"
        >
          <template #header>
            删除数量限制
            <el-input v-model="listingCount" @blur="listingCountBlur" />
          </template>
        </vxe-column>
        <vxe-column title="操作"
          ><template #default="{ row }"
            ><el-button type="danger" size="small" @click="del(row.id)"
              >删除</el-button
            ></template
          >
        </vxe-column>
      </vxe-table>
      <!-- <div class="pagination">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        background
        :page-sizes="[50, 100, 200]"
        layout="prev, pager, next,sizes, total"
        :total="total"
        :small="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->
    </el-dialog>

    <el-dialog
      v-model="addStoreDialog"
      title="添加店铺"
      width="20%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addStoreDialogFormRef"
        v-model="addStoreDialogForm"
        :label-width="100"
      >
        <el-form-item label="部门" prop="orgId">
          <el-tree-select
            v-model="addStoreDialogForm.orgId"
            placeholder="请选择"
            :data="selectData.departData"
            check-strictly
            :props="defaultProps"
            :render-after-expand="false"
            :empty-text="'No matching Data'"
            clearable
            filterable
            @node-click="handleNodeClick"
            @clear="clearDepart"
          />
        </el-form-item>
        <el-form-item label="销售员" prop="salePersonId">
          <el-select
            v-model="addStoreDialogForm.salePersonId"
            placeholder="请选择"
            clearable
            filterable
            @change="changeSalers"
            @clear="resetSearch"
          >
            <el-option
              v-for="item in selectData.salersData"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺" required>
          <!-- <el-select-v2
            v-model="addStoreDialogForm.storeAcctId"
            placeholder="请选择"
            :options="selectData.storeData"
            style="width: 240px"
            multiple
            collapse-tags
            clearable
            filterable
            remote
            :remote-method="handleStoreAcct"
            @visible-change="changeStoreAcct"
          >
          </el-select-v2> -->
          <ZSelect
            v-model="addStoreDialogForm.storeAcctId"
            :items="selectData.storeData"
            :num="1"
          />
        </el-form-item>
        <el-form-item label="删除数量限制" prop="listingCount">
          <el-input v-model="addStoreDialogForm.listingCount" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="addStoreSave">保存</el-button>
          <el-button @click="closeAddStoreDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import {
    ref,
    reactive,
    computed,
    watch,
    nextTick,
    onMounted,
    toRefs
  } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  // import { debounce } from 'lodash-es';
  import useUserStore from '@/store/modules/user';
  import ZSelect from '@/components/ZSelect/index.vue';
  import {
    getPaymentsData,
    getDepartData,
    getStoreInfo
  } from '@/api/eBay/payments';
  import {
    addStores,
    getStores,
    removeRuleStore,
    modifyDeleteLimit
  } from '@/api/lazada/deletetask';

  // const handleStoreAcct = debounce((node) => {
  //   console.log(node);
  //   if (node.includes(',')) {
  //     let filterList = node.split(',');
  //     selectData.storeData = selectData.allStoreData.filter((item) =>
  //       filterList.includes(item.label)
  //     );
  //   } else {
  //     selectData.storeData = selectData.allStoreData.filter((item) =>
  //       item.label.includes(node)
  //     );
  //   }
  // });

  // const changeStoreAcct = (val) => {
  //   if (val) {
  //     selectData.storeData = selectData.allStoreData;
  //   }
  // };

  const tableDataRef = ref();
  // 批量修改删除数量限制
  const listingCount = ref();
  const listingCountBlur = async () => {
    if (listingCount.value != '' && listingCount.value <= 0) {
      return ElMessage.warning('请输入大于0的整数');
    }
    tableData.value.forEach((item) => {
      item.listingCount = listingCount.value;
    });
    let ids = tableData.value.map((item) => item.id).join(',');
    // 成功不刷新，失败刷新
    try {
      let { code, msg } = await modifyDeleteLimit({
        ids: ids,
        listingCount: listingCount.value
      });
      if (code == '0000') {
        ElMessage.success(msg);
      } else {
        onSubmit();
      }
    } catch (err) {
      onSubmit();
    }
  };

  const editClosed = async (table) => {
    if (table.row.listingCount != '' && table.row.listingCount <= 0) {
      onSubmit();
      return ElMessage.warning('请输入大于0的整数');
    }
    try {
      let { code, msg } = await modifyDeleteLimit({
        ids: table.row.id,
        listingCount: table.row.listingCount
      });
      if (code == '0000') {
        ElMessage.success(msg);
      } else {
        onSubmit();
      }
    } catch (err) {
      onSubmit();
    }
  };
  // 批量删除
  const batchDel = async () => {
    let checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    del(ids.join());
  };
  // 单个删除
  const del = async (ids) => {
    ElMessageBox.confirm(`确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        let { code } = await removeRuleStore({ ids });
        if (code == '0000') {
          ElMessage.success('删除成功');
          onSubmit();
        }
      })
      .catch(() => {});
  };

  let addStoreDialog = ref(false);
  let addStoreDialogForm = ref({ storeAcctId: [] });
  let addStoreDialogFormRef = ref();
  // 添加店铺
  const addStore = async () => {
    addStoreDialog.value = true;
  };
  // 保存店铺
  const addStoreSave = async () => {
    if (addStoreDialogForm.value.storeAcctId.length == 0) {
      ElMessage.warning('请选择店铺');
      return false;
    }
    addStoreDialogForm.value.storeIds =
      addStoreDialogForm.value.storeAcctId.join(',');
    addStoreDialogForm.value.ruleId = ruleId;
    delete addStoreDialogForm.value.storeAcctId;
    // const formData = new FormData();
    // formData.append('storeIds', addStoreDialogForm.value.storeAcctId.join(','));
    // formData.append('ruleId', ruleId);
    let { code } = await addStores(addStoreDialogForm.value);
    if (code == '0000') {
      ElMessage.success('添加成功');
      onSubmit();
    }
    closeAddStoreDialog();
  };
  // 关闭店铺
  const closeAddStoreDialog = async () => {
    addStoreDialogForm.value.listingCount = '';
    addStoreDialogForm.value.salePersonId = '';
    addStoreDialogForm.value.orgId = '';
    addStoreDialogForm.value.storeAcctId = [];
    clearDepart();
    addStoreDialogFormRef.value.resetFields();
    addStoreDialog.value = false;
  };

  const props = defineProps({
    // 是否显示弹窗
    isVisible: {
      type: Boolean,
      default: false
    },
    ruleId: {
      type: Number,
      default: -1
    }
  });
  const { ruleId } = toRefs(props);
  const showExport = computed(() => {
    return props.isVisible;
  });

  const emits = defineEmits(['close', 'submit']);
  const handleClose = () => {
    emits('close');
  };
  // 店铺级联数据
  const storeAcctIds = ref([]);
  const storeList = ref([]);
  onMounted(async () => {
    // 部门
    getPaymentsList();
    // 销售员
    getDepartmentList();
    // 店铺
    getStoreLists(true);
    // 查询
    onSubmit();
  });
  const allTableData = ref([]);
  watch(
    () => storeAcctIds.value,
    async (val) => {
      if (val.length != 0) {
        tableData.value = allTableData.value.filter((item) =>
          storeAcctIds.value.includes(item.storeAcct)
        );
      } else {
        tableData.value = allTableData.value;
      }
    }
  );
  // 查询
  const tableData = ref(null);
  const tableDataLoading = ref(false);
  const onSubmit = async () => {
    tableDataLoading.value = true;
    allTableData.value = null;
    // form.page = currentPage.value;
    // form.limit = pageSize.value;
    let { code, data } = await getStores(ruleId.value);
    if (code == '0000') {
      data.forEach((item) =>
        item.listingCount == -1 ? (item.listingCount = '') : ''
      );
      allTableData.value = tableData.value = data;
      // total.value = data.total;
    }
    tableDataLoading.value = false;
    storeAcctIds.value = [];
  };

  // const currentPage = ref(1);
  // const pageSize = ref(50);
  // const total = ref(0);

  // // 设置每页count
  // const handleSizeChange = (val) => {
  //   pageSize.value = val;
  //   onSubmit();
  // };
  // // 上一页下一页
  // const handleCurrentChange = (val) => {
  //   currentPage.value = val;
  //   onSubmit();
  // };

  //  部门-销售员-店铺联动 -- start
  // 列表数据
  const lazadaPaymentsList = ref([]);
  // 部门和销售人员数据
  const selectData = reactive({
    departData: [],
    salersData: [],
    allStoreData: [],
    storeData: []
  });
  const salersDataCopy = ref([]);
  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };
  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);
  // 获取 payments 列表数据
  const getPaymentsList = async () => {
    let storeAcctIdList = [];
    // 部门 销售人员 店铺没有筛选
    if (
      !addStoreDialogForm.value.orgId &&
      !addStoreDialogForm.value.salePersonId &&
      addStoreDialogForm.value.storeAcctId.length === 0
    ) {
      storeAcctIdList = [];
    }
    // 选择部门或者销售人员 没有选择店铺
    if (
      (addStoreDialogForm.value.orgId ||
        addStoreDialogForm.value.salePersonId) &&
      addStoreDialogForm.value.storeAcctId.length === 0
    ) {
      if (selectData.storeData.length) {
        storeAcctIdList = selectData.storeData.map((item) => item.id);
      } else {
        // 如果销售人员下没有数据的话 传 -1
        storeAcctIdList = [-1];
      }
    }
    let params = {
      storeAcctIdList:
        addStoreDialogForm.value.storeAcctId.length > 0
          ? addStoreDialogForm.value.storeAcctId
          : storeAcctIdList
    };
    const { data } = await getPaymentsData(params);
    lazadaPaymentsList.value = data;
  };
  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    let params = {
      roleNames: 'lazada专员'
    };
    const { data } = await getDepartData(params);
    selectData.departData = data.orgTree;
    selectData.salersData = data.userList;
    salersDataCopy.value = data.userList;
  };
  // 获取店铺信息
  const getStoreLists = async (isAll) => {
    let params = {
      roleNames: 'lazada专员',
      orgId: addStoreDialogForm.value.orgId,
      salePersonId: addStoreDialogForm.value.salePersonId,
      platCode: 'lazada',
      lmsAppUserName: userName.value
    };
    const { data } = await getStoreInfo(params);
    selectData.allStoreData = selectData.storeData = data.map((item) => ({
      id: item.id,
      name: item.storeAcct
    }));
    if (isAll) {
      storeList.value = data.map((item) => ({
        id: item.storeAcct,
        name: item.storeAcct
      }));
    }
  };
  const handleNodeClick = (data) => {
    let selectId = data.id;
    selectData.salersData = salersDataCopy.value.filter(
      (item) => item.org_id === selectId
    );
    resetSearch();
    nextTick(() => {
      getStoreLists();
    });
  };
  const changeSalers = () => {
    addStoreDialogForm.value.storeAcctId = [];
    getStoreLists();
  };
  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    addStoreDialogForm.value.orgId = '';
    resetSearch();
  };
  // 清空销售人员以及店铺
  const resetSearch = () => {
    addStoreDialogForm.value.salePersonId = '';
    addStoreDialogForm.value.storeAcctId = [];
    getStoreLists();
  };
  //  部门-销售员-店铺联动 -- end
</script>
<style lang="scss" scoped>
  .lazadaDeleteTaskStore {
    :deep(.el-dialog__body) {
      padding-top: 0px !important;
    }
    :deep(.el-select) {
      width: 100%;
    }
    :deep(.el-select-v2) {
      width: 100%;
    }
  }
</style>
