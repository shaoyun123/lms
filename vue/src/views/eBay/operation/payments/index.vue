<template>
  <!-- payments -->
  <div class="payments app-container">
    <el-card class="common_split_bottom search_card">
      <el-form :model="formData" :inline="true" class="search_form">
        <el-form-item label="部门">
          <el-tree-select
            v-model="formData.orgId"
            placeholder="请选择"
            :data="selectData.departData"
            check-strictly
            :props="defaultProps"
            :render-after-expand="false"
            :empty-text="'No matching Data'"
            clearable
            filterable
            @clear="clearDepart"
            @node-click="handleNodeClick"
          />
        </el-form-item>
        <el-form-item label="销售人员">
          <el-select
            v-model="formData.salePersonId"
            placeholder="请选择"
            filterable
            clearable
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
        <el-form-item label="店铺">
          <el-select
            v-model="formData.storeAcctId"
            class="mul-input"
            :class="formData.storeAcctId.length > 1 ? 'hideTag' : ''"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
            filterable
          >
            <template #prefix>
              <el-tag v-if="formData.storeAcctId.length > 1" type="info"
                >已选{{ formData.storeAcctId.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in selectData.storeData"
              :key="item.id"
              :label="item.storeAcct"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型">
          <el-select
            v-model="formData.acctTypeList"
            class="mul-input"
            :class="formData.acctTypeList.length > 1 ? 'hideTag' : ''"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            clearable
            filterable
          >
            <template #prefix>
              <el-tag v-if="formData.acctTypeList.length > 1" type="info"
                >已选{{ formData.acctTypeList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in acctTypeEnum"
              :key="item.name"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPaymentsList()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据列表展示 -->
    <el-card class="list_card">
      <vxe-table
        v-loading="loading"
        :data="paymentsList"
        :height="height"
        :align="'center'"
        :show-overflow="true"
        border
      >
        <vxe-column field="storeAcct" title="账号"></vxe-column>
        <vxe-column field="currency" title="币种"></vxe-column>
        <vxe-column field="totalFunds" title="total funds"></vxe-column>
        <vxe-column field="availableFunds" title="available funds"></vxe-column>
        <vxe-column field="processingFunds" title="Processing"></vxe-column>
        <vxe-column field="onHoldFunds" title="On hold"></vxe-column>
        <vxe-column
          field="lastPaymentTime"
          title="最新一次放款日期"
          :formatter="formatterDate"
          sortable
        ></vxe-column>
        <vxe-column
          field="lastSyncTime"
          title="同步更新时间"
          :formatter="formatterTime"
          sortable
        ></vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleSyncStore(row)"
              >同步</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </el-card>
  </div>
</template>

<script setup name="eBayoperationpayments">
  import { nextTick, onMounted, reactive, ref, computed } from 'vue';
  import {
    getPaymentsData,
    getDepartData,
    syncStore,
    getStoreInfo
  } from '@/api/eBay/payments';
  import { getAcctTypeData } from '@/api/eBay/common';
  import { ElMessage } from 'element-plus';
  import { transferDate } from '@/utils/common';
  import useUserStore from '@/store/modules/user';

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 137;
  });

  const formData = reactive({
    orgId: '',
    salePersonId: '',
    storeAcctId: [],
    acctTypeList: []
  });
  const loading = ref(true);

  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  // 列表数据
  const paymentsList = ref([]);
  // 部门和销售人员数据
  const selectData = reactive({
    departData: [],
    salersData: [],
    storeData: []
  });
  const salersDataCopy = ref([]);
  // 账号类型
  const acctTypeEnum = ref([]);

  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };

  onMounted(() => {
    getPaymentsList();
    getDepartmentList();
    getStoreList();
    getAcctTypeEnum();
  });

  const formatterTime = ({ cellValue }) => {
    return transferDate(cellValue);
  };

  const formatterDate = ({ cellValue }) => {
    return cellValue ? transferDate(cellValue, false) : '';
  };

  // 获取 payments 列表数据
  const getPaymentsList = async () => {
    try {
      loading.value = true;
      let storeAcctIdList = [];
      // 部门 销售人员 店铺没有筛选
      if (
        !formData.orgId &&
        !formData.salePersonId &&
        formData.storeAcctId.length === 0
      ) {
        storeAcctIdList = [];
      }

      // 选择部门或者销售人员 没有选择店铺
      if (
        (formData.orgId || formData.salePersonId) &&
        formData.storeAcctId.length === 0
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
          formData.storeAcctId.length > 0
            ? formData.storeAcctId
            : storeAcctIdList,
        acctTypeList: formData.acctTypeList
      };
      const { data } = await getPaymentsData(params);
      paymentsList.value = data.map((item) => ({
        lastPaymentTime: 0,
        ...item
      }));
      loading.value = false;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    try {
      let params = {
        roleNames: 'ebay专员'
      };
      const { data } = await getDepartData(params);
      selectData.departData = data.orgTree;
      selectData.salersData = data.userList;
      salersDataCopy.value = data.userList;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取店铺信息
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'ebay专员',
        orgId: formData.orgId,
        salePersonId: formData.salePersonId,
        platCode: 'ebay',
        lmsAppUserName: userName.value
      };
      const { data } = await getStoreInfo(params);
      selectData.storeData = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取账号类型
  const getAcctTypeEnum = async () => {
    try {
      const { data } = await getAcctTypeData();
      acctTypeEnum.value = data.map((item) => ({
        value: item.name,
        label: item.name
      }));
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const handleNodeClick = (data) => {
    let selectId = data.id;
    selectData.salersData = salersDataCopy.value.filter(
      (item) => item.org_id === selectId
    );
    resetSearch();
    nextTick(() => {
      getStoreList();
    });
  };

  const changeSalers = () => {
    formData.storeAcctId = [];
    getStoreList();
  };

  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    formData.orgId = '';
    resetSearch();
  };

  // 清空销售人员以及店铺
  const resetSearch = () => {
    formData.salePersonId = '';
    formData.storeAcctId = '';
    getStoreList();
  };

  // 进行店铺同步
  const handleSyncStore = async (row) => {
    let params = {
      storeAcctId: row.storeAcctId
    };
    const { code } = await syncStore(params);
    if (code === '0000') {
      ElMessage.success('同步成功！');
      getPaymentsList();
    }
  };
</script>
<style lang="scss" scoped></style>
