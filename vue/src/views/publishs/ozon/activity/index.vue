<template>
  <!-- ozon 刊登规则 -->
  <div class="publishrules_wrapper app-container" :loading="pageLoading">
    <el-card>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="ozon活动" name="first">
          <el-card ref="searchCard" class="search_card">
            <el-form
              ref="formRef"
              :model="formData"
              :inline="true"
              class="search_form"
            >
              <el-form-item
                label="店铺"
                prop="storeAcctIdList"
                class="search_item_cascader"
              >
                <z-cascader
                  v-model="formData.storeAcctIdList"
                  placeholder="全部店铺"
                  :data="initList.storeList"
                ></z-cascader>
              </el-form-item>
              <el-form-item label="活动状态" prop="actionStatus">
                <el-select
                  v-model="formData.actionStatus"
                  multiple
                  filterable
                  clearable
                >
                  <el-option label="未参加" :value="0" />
                  <el-option label="正在参加" :value="1" />
                  <el-option label="已结束" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="活动暂停" prop="freezed">
                <el-select v-model="formData.freezed" filterable clearable>
                  <el-option label="是" :value="true" />
                  <el-option label="否" :value="false" />
                </el-select>
              </el-form-item>
              <el-form-item prop="dateType">
                <el-select
                  v-model="formData.dateType"
                  filterable
                  class="form_left"
                >
                  <el-option label="开始日期" :value="1" />
                  <el-option label="结束日期" :value="2" />
                </el-select>
                <!-- leftDate /rightDate -->
                <el-date-picker
                  v-model="formData.time"
                  value-format="YYYY-MM-DD"
                  :shortcuts="shortcuts"
                  type="daterange"
                  unlink-panels
                  style="width: 200px"
                  class="form_right"
                />
              </el-form-item>
              <el-form-item label="活动名称" prop="title">
                <el-input v-model="formData.title" clearable />
              </el-form-item>
              <el-form-item>
                <el-button
                  :loading="tableDataLoading"
                  type="primary"
                  @click="handleSearch(formRef)"
                  >查询</el-button
                ><el-button @click="handleResetForm(formRef)"
                  >清空</el-button
                ></el-form-item
              >
            </el-form>
          </el-card>
          <el-card v-loading="tableDataLoading" class="list_card">
            <vxe-grid ref="tableRef" v-bind="gridOptions">
              <template #actionStatus_default="{ row }">
                <span v-if="row.actionStatus == 0">未参加</span>
                <span v-else-if="row.actionStatus == 1">正在参加</span>
                <span v-else-if="row.actionStatus == 2">已结束</span>
              </template>
              <template #storeAcct_default="{ row }">
                <div>{{ row.storeAcct }}</div>
                <div>{{ row.salesperson }}</div>
              </template>
              <template #freezeDate_header>
                暂停日期
                <el-tooltip
                  effect="dark"
                  content="活动暂停，卖家不能提高价格，改变商品清单或减少促销活动的单位数量。可以降低价格，增加促销的单位数量。"
                  placement="bottom-end"
                >
                  <img src="./tips.png" width="18" />
                </el-tooltip>
              </template>
              <template #execution_week_time_default="{ row }">
                <div>{{ row.dateStart }}</div>
                <div>{{ row.dateEnd }}</div>
              </template>
              <template #freezeDate_default="{ row }">
                <div>{{ row.freezeDate }}</div>
              </template>
              <template #participatingProductsCount_default="{ row }">
                <el-link type="primary" @click="handleDetail(row, 'first')">{{
                  row.participatingProductsCount
                }}</el-link>
              </template>
              <template #potentialProductsCount_default="{ row }">
                <el-link type="primary" @click="handleDetail(row, 'second')">{{
                  row.potentialProductsCount
                }}</el-link>
              </template>
              <template #toolbar_default="{ row }">
                <el-link type="primary" @click="handleDetail(row, 'first')"
                  >管理活动</el-link
                >
              </template>
            </vxe-grid>
            <div class="pagination">
              <el-pagination
                v-model:currentPage="paginationData.page"
                v-model:page-size="paginationData.limit"
                background
                :page-sizes="[200, 300, 500]"
                :small="true"
                layout="total, sizes, prev, pager, next"
                :total="paginationData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <DetailDialog
      v-if="detailVisible"
      v-model="detailVisible"
      :tab-name="tabName"
      :check-row="checkRow"
      @handle-search="handleSearch"
    />
  </div>
</template>

<script setup name="publishsozonactivity">
  import { reactive, ref, onMounted } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { getStoreList } from '@/api/common';
  import DetailDialog from './components/DetailDialog.vue';
  import { queryListApi } from '@/api/publishs/ozonactivity';
  import { MAIN_COLS } from './config';
  import { shortcuts } from '@/api/common';

  const activeName = ref('first');

  const formData = reactive({
    actionStatus: [1],
    dateType: 1,
    storeAcctIdList: []
  });
  const formRef = ref();
  const initList = ref({});
  const pageLoading = ref(false);
  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    height: '400',
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    scrollY: { enabled: false },
    columns: MAIN_COLS,
    data: []
    // toolbarConfig: {
    //   custom: true
    // }
  });
  onMounted(async () => {
    pageLoading.value = true;

    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      900;
    const searchCardHeight = searchCard?.value?.$el?.clientHeight;
    gridOptions.height = clientHeight - 220 - searchCardHeight;
    Promise.all([getStoreList('ozon')])
      .then((res) => {
        initList.value.storeList = res[0]?.data?.children || [];
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        pageLoading.value = false;
      });
  });

  const tableDataLoading = ref(false);
  const tableRef = ref();
  const searchCard = ref();
  const paginationData = reactive({
    total: 0,
    limit: 200,
    page: 1
  });

  const handleSearch = async () => {
    tableDataLoading.value = true;
    try {
      const obj = filterSearchParams();
      const { data, count } = await queryListApi(obj);
      // 11111111111111111111111111111
      gridOptions.data = data;
      // gridOptions.data = data.filter((item) => item.actionId == 1177169);
      paginationData.total = count;
    } catch (err) {
      gridOptions.data = [];
      paginationData.total = 0;
    } finally {
      tableDataLoading.value = false;
    }
  };
  const filterSearchParams = () => {
    const { limit, page } = paginationData;
    const obj = {};
    // 店铺
    if (formData.storeAcctIdList) {
      // 11111111111111111111111111111
      obj.storeAcctIdList = formData.storeAcctIdList || [];
      // obj.storeAcctIdList = [45673];
    }
    // 时间
    let leftDate, rightDate;
    if (formData.time && formData.time.length != 0) {
      leftDate = formData.time[0] + ' 00:00:00';
      rightDate = formData.time[1] + ' 23:59:59';
    } else {
      leftDate = '';
      rightDate = '';
    }
    let params = {
      ...formData,
      ...obj,
      leftDate,
      rightDate,
      limit,
      page
    };

    return params;
  };

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.time = [];
  };

  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleSearch();
  };

  const tabName = ref();
  const checkRow = ref();
  const detailVisible = ref(false);
  const handleDetail = (row, name) => {
    detailVisible.value = true;
    tabName.value = name;
    checkRow.value = row;
  };
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
