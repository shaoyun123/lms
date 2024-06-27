<template>
  <div class="app-container">
    <el-card ref="searchCardRef" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item prop="orgUserId">
          <el-select
            v-model="formData.roleName"
            filterable
            class="form_left"
            @change="handleChangeRoleType"
          >
            <el-option label="销售员" value="shein自营专员"></el-option>
            <el-option label="销售组长" value="shein自营组长"></el-option>
            <el-option label="主管" value="shein自营主管"></el-option>
          </el-select>
          <el-select
            v-model="formData.orgUserId"
            placeholder="请选择"
            clearable
            filterable
            class="form_right"
            @change="getAcctList"
          >
            <el-option
              v-for="item in init.roleList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="storeAcctIdList" label="店铺">
          <!-- <el-select-v2
            v-model="formData.storeAcctIdList"
            placeholder="请选择"
            :options="init.storeData"
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
            v-model="formData.storeAcctIdList"
            style="width: 270px"
            :items="init.storeData"
            :num="1"
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="getSearchData"
            >查询</el-button
          ><el-button @click="resetQuery">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs v-model="activeKey" type="card" @tab-click="getSearchData">
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
            <!-- <vxe-column type="checkbox" width="40" /> -->
            <vxe-column title="店铺" field="storeAcctName" />
            <vxe-column
              field="createTime"
              title="店铺创建时间"
              :formatter="formatterDate"
              sortable
            ></vxe-column>
            <vxe-column
              title="店铺近7天销量"
              width="150"
              field="sevenSale"
              sortable
            />
            <vxe-column title="人员信息" field="salePerson" width="120">
              <template #default="{ row }">
                <div>销售员:{{ row.salePerson }}</div>
                <div>组长:{{ row.leaderName }}</div>
                <div>主管:{{ row.sellLeaderName }}</div>
              </template>
            </vxe-column>
            <vxe-column
              title="当前可用额度"
              field="listingLimit"
              width="150"
              :edit-render="{ name: 'input' }"
              :slots="{ edit: 'edit' }"
              ><template #edit="{ row }">
                <el-input
                  v-model="row.listingLimit"
                  @focus="getListingLimit(row)"
                  @blur="handleListingLimit(row)"
                ></el-input> </template
            ></vxe-column>
            <vxe-column title="今日刊登量" field="todayListingCount" />
            <vxe-column title="在线商品数量" field="onlineCount" sortable />
            <vxe-column title="待审核商品数量" field="auditingNum" />
            <vxe-column title="审核失败商品数量" field="auditFailNum" />
            <vxe-column title="审核成功商品数量" field="auditSuccessNum" />
          </vxe-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script setup name="publishssheinaccperformance">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { transferDate, comGetTableHeight } from '@/utils/common';
  import { ElMessage } from 'element-plus';
  import { getCustomerListApi } from '@/api/common';
  import {
    getShenAccountPerList,
    listStoreForRenderHpStoreCommonComponent,
    updateSheinAcctPerData
  } from '@/api/publishs/sheinaccperformance';
  import ZSelect from '@/components/ZSelect/index.vue';

  const formatterDate = ({ cellValue }) => {
    return cellValue ? transferDate(cellValue, false) : '';
  };

  const init = reactive({
    storeData: [], // 店铺
    salePersonIdList: [], // 销售员
    leaderIdList: [], // 销售组长
    sellLeaderIdList: [], // 主管,
    roleList: [] // 展示人员
  });
  // // 获取用户名
  // const { userInfo } = useUserStore();
  // let userName = computed(() => userInfo.userName);
  const total = ref(0);
  // tab名称
  let tabList = ref([{ name: '账号表现', status: 0, count: 0 }]);
  const activeKey = ref(0);
  const formData = ref({
    storeAcctIdList: [], // 店铺
    roleName: 'shein自营专员' // 角色种类
  });

  const tableData = ref([]);
  let tableDataRef = ref();
  const tableDataLoading = ref(false);
  // 查询条件表单ref
  const formRef = ref(null);
  // 清空查询
  const resetQuery = () => {
    formRef.value.resetFields();
    formData.value.roleName = 'shein自营专员';
  };
  // 查询条件提交查询
  const getSearchData = async () => {
    tableDataLoading.value = true;
    tableData.value = null;
    formData.value.storeAcctIdStr = formData.value.storeAcctIdList.join(',');
    try {
      const { code, data, count } = await getShenAccountPerList(formData.value);
      if (code === '0000') {
        tableData.value = data || [];
        tabList.value[0].count = count;
        total.value = count;
      }
      tableDataLoading.value = false;
    } catch (err) {
      console.log(err);
      tableDataLoading.value = false;
    }
  };

  const listingLimit = ref('');
  const getListingLimit = (row) => {
    listingLimit.value = row.listingLimit;
  };
  const handleListingLimit = async (row) => {
    if (row.listingLimit == '') {
      ElMessage.warning('提交的数据为空，保存失败');
      row.listingLimit = listingLimit.value;
      return;
    }
    listingLimit.value = '';
    const { code, msg } = await updateSheinAcctPerData({
      storeAcctId: row.storeAcctId,
      listingLimit: row.listingLimit
    });
    if (code == '0000') {
      ElMessage.success(msg);
    }
  };

  onMounted(async () => {
    // 获取销售员
    Promise.all([
      getCustomerListApi({ role: 'shein自营专员' }),
      getCustomerListApi({ role: 'shein自营组长' }),
      getCustomerListApi({ role: 'shein自营主管' })
    ]).then((res) => {
      init.salePersonIdList = res[0].data || [];
      init.leaderIdList = res[1].data || [];
      init.sellLeaderIdList = res[2].data || [];
      init.roleList = res[0].data || [];
      getAcctList();
    });
  });
  // 根据销售员获取店铺
  const getAcctList = async () => {
    const { orgUserId, roleName } = formData.value;

    const { data } = await listStoreForRenderHpStoreCommonComponent({
      roleNames: roleName,
      salepersonId: orgUserId,
      platCode: 'shein自营'
    });
    init.storeData = data.map((item) => {
      item['name'] = item.storeAcct;
      return item;
    });
    if (orgUserId == '') {
      formData.value.storeAcctIdList = [];
    }
  };

  // 改变角色
  const handleChangeRoleType = () => {
    formData.value.orgUserId = '';
    const roleObj = {
      shein自营专员: init.salePersonIdList,
      shein自营组长: init.leaderIdList,
      shein自营主管: init.sellLeaderIdList
    };
    init.roleList = roleObj[formData.value.roleName] || [];
    getAcctList();
  };

  // 高度
  const searchCardRef = ref();
  const height = computed(
    () => comGetTableHeight(searchCardRef, false, true) - 1
  );
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
</style>
