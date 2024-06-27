<template>
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item label="销售员" prop="salesPersonId">
          <el-select
            v-model="formData.salesPersonId"
            placeholder="请选择"
            clearable
            filterable
            @change="getAcctList"
          >
            <el-option
              v-for="item in init.campaignType"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="storeAcctIds" label="店铺">
          <ZSelect
            v-model="formData.storeAcctIds"
            style="width: 270px"
            :items="init.storeData"
            :num="1"
          />
        </el-form-item>
        <el-form-item prop="statDate" label="统计时间">
          <el-date-picker
            v-model="formData.statDate"
            type="date"
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="排序" prop="orderType">
          <el-select
            v-model="formData.orderType"
            placeholder="请选择"
            clearable
            filterable
          >
            <el-option label="当日刊登通过率正序" :value="1"></el-option>
            <el-option label="当日刊登通过率倒序" :value="2"></el-option>
            <el-option label="当日刊登未通过率正序" :value="3"></el-option>
            <el-option label="当日刊登未通过率倒序" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="getSearchData"
            >查询</el-button
          ><el-button @click="resetQuery">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs v-model="activeKey" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.status"
          :label="
            item.count !== '' && activeKey == item.status
              ? `${item.name}(${item.count})`
              : item.name
          "
          :name="item.status"
        >
          <vxe-table
            ref="tableDataRef"
            v-loading="tableDataLoading"
            :data="tableData"
            :height="height"
            :edit-config="{
              trigger: 'click',
              mode: 'cell'
            }"
            :align="'left'"
            border
          >
            <vxe-column title="店铺" field="storeAcct" />
            <vxe-column
              field="storeCreateDate"
              title="店铺创建时间"
              :formatter="formatterDate"
              sortable
            ></vxe-column>
            <vxe-column title="销售" field="salesPerson" width="120" />
            <vxe-column title="当日刊登数量" field="dayListingNum" sortable>
              <template #default="{ row }">
                <div>{{ row.dayListingNum }}</div>
              </template>
            </vxe-column>
            <vxe-column title="当日刊登类目统计" field="dayListingCateNumStr">
              <template #default="{ row }">
                <el-tooltip effect="dark" raw-content placement="right">
                  <template #content>
                    <div
                      v-for="item in row.dayListingCateNumStr.split(',')"
                      :key="item"
                    >
                      {{ item }}
                    </div>
                  </template>
                  <div class="showThreeLine">
                    <div
                      v-for="item in row.dayListingCateNumStr.split(',')"
                      :key="item"
                    >
                      {{ item }}
                    </div>
                  </div>
                </el-tooltip>
              </template>
            </vxe-column>
            <vxe-column field="approvedListingNum" sortable width="180">
              <template #header>
                <div>
                  <div>已通过审核数量</div>
                  <div>(通过/当日刊登)</div>
                </div>
              </template>
              <template #default="{ row }">
                <div>
                  <div>{{ row.approvedListingNum || '-' }}</div>
                  <div>
                    (<span>{{ row.approvedRate || '-' }}%</span>)
                  </div>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="unApprovedListingNum" sortable>
              <template #header>
                <div>暂未通过审核数量</div>
                <div>(未通过/当日刊登)</div>
              </template>
              <template #default="{ row }">
                <div>
                  <div>{{ row.unApprovedListingNum || '-' }}</div>
                  <div>
                    (<span>{{ row.unApprovedRate || '-' }}%</span>)
                  </div>
                </div>
              </template>
            </vxe-column>
            <vxe-column
              width="200"
              title="当日新增在线listing销量"
              field="dayNewOnlineNum"
              sortable
            />
            <vxe-column title="在线listing数量" field="onlineNum" sortable />
            <vxe-column title="7日销量" field="sevenDaySaleCount" sortable />
            <vxe-column title="30日销量" field="thirtyDaySaleCount" sortable />
          </vxe-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script setup name="publishstemuaccountshow">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { transferDate } from '@/utils/common';
  import dayjs from 'dayjs';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import { getManifestApi } from '@/api/publishs/temuaccountshow';
  import ZSelect from '@/components/ZSelect/index.vue';
  import useUserStore from '@/store/modules/user';

  const formatterDate = ({ cellValue }) => {
    return cellValue ? transferDate(cellValue, false) : '';
  };

  //日期快捷选项
  const shortcuts = [
    {
      text: '今天',
      value: new Date()
    },
    {
      text: '昨天',
      value: () => {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        return date;
      }
    },
    {
      text: '一周前',
      value: () => {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        return date;
      }
    }
  ];

  const init = reactive({
    storeData: [], // 店铺
    customersList: [] // 销售员
  });

  // tab名称
  let tabList = ref([{ name: '账号表现', status: 0, count: 0 }]);
  const activeKey = ref(0);
  const formData = ref({
    salesPersonId: '', // 销售
    storeAcctIds: [], // 店铺
    statDate: '', // 统计时间
    orderType: null // 排序
  });

  onMounted(async () => {
    // 获取销售员
    getCustomersList();
    getStoreList();
    // 日期搜素 默认展示今天
    formData.value.statDate = dayjs().format('YYYY-MM-DD');
  });

  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  const salersDataCopy = ref([]);
  // 获取销售
  const getCustomersList = async () => {
    let params = {
      roleNames: 'temu专员'
    };
    try {
      const { data } = await getDepartData(params);
      init.campaignType = data.userList;
      salersDataCopy.value = data.userList;
    } catch (err) {
      console.log(err);
    }
  };

  // 获取店铺信息
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'temu专员',
        orgId: '',
        salePersonId: formData.value.salesPersonId,
        platCode: 'temu',
        lmsAppUserName: userName.value
      };
      const { data } = await getStoreInfo(params);
      init.storeData = data.map((item) => {
        item['name'] = item.storeAcct;
        return item;
      });
    } catch (err) {
      console.log(err);
    }
  };

  // 根据销售员获取店铺
  const getAcctList = async () => {
    formData.value.storeAcctIds = [];
    getStoreList();
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (item.status === activeKey.value) {
        item.count = totalCount;
      }
    });
  };

  const total = ref(0);

  const tableData = ref([]);
  let tableDataRef = ref();
  const tableDataLoading = ref(false);
  // 查询条件表单ref
  const formRef = ref(null);

  // 查询条件提交查询
  const getSearchData = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    try {
      const { code, data, count } = await getManifestApi(formData.value);
      if (code === '0000') {
        tableData.value = data || [];
        tabList.value[0].count = count;
        total.value = data.length;
        getTabCount(total.value);
      }
      tableDataLoading.value = false;
    } catch (err) {
      console.log(err);
      tableDataLoading.value = false;
    }
  };

  const handleClick = () => {
    getSearchData();
  };

  // 清空查询
  const resetQuery = () => {
    formRef.value.resetFields();
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 180;
  });
</script>
<style scoped lang="scss">
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }

  .z-select {
    :deep(.el-input) {
      width: 270px;
    }
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-y {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .showThreeLine {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  :deep(.col_7 .vxe-cell) {
    display: flex !important;
  }
  :deep(.col_8 .vxe-cell) {
    display: flex !important;
  }
</style>
