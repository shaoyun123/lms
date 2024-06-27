<template>
  <div class="app-container" :loading="pageLoading">
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
          <ZCascader
            v-model="formData.storeAcctIdList"
            :data="initList.storeList"
          />
        </el-form-item>
        <el-form-item label="站点" prop="salesSite">
          <MultiSelect
            v-model="formData.salesSite"
            :option-obj="{
              optionList: initList.siteList,
              value: 'code',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item label="数据统计时间" prop="date">
          <el-date-picker
            v-model="formData.date"
            value-format="YYYY-MM-DD"
            type="daterange"
            :shortcuts="shortcuts"
            unlink-panels
          />
        </el-form-item>
        <el-form-item label="统计值" prop="statisticsType">
          <el-select v-model="formData.statisticsType" filterable>
            <el-option label="平均值" :value="0" />
            <el-option label="求和值" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="币种" prop="currencyType">
          <el-select v-model="formData.currencyType" filterable>
            <el-option
              v-for="(v, k) in currencyTypeObj"
              :key="k"
              :label="v"
              :value="k"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="GP" prop="merchantNameList">
          <MultiSelect
            v-model="formData.merchantNameList"
            :option-obj="{
              optionList: initList.merchantNameList
            }"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(formRef)"
            >查询</el-button
          ><el-button @click="handleResetForm(formRef)">重置</el-button>
          <el-button type="primary" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="list_card">
      <el-checkbox v-model="lastCycle" :label="true" size="large"
        >显示上一周期数值</el-checkbox
      >
      <vxe-grid ref="tableRef" v-bind="gridOptions">
        <template #store_info_default="{ row }">
          <div>{{ row.storeAcct }}</div>
          <a
            :href="`https://seller.shopee.cn/portal/marketing/pas/assembly?type=search&cnsc_shop_id=${row.shopId}`"
            target="_blank"
            >{{ row.shopId }}</a
          >
          <div>{{ row.salesSite }}</div>
          <div v-if="row?.storeTagList?.length">
            <el-tag v-for="item in row.storeTagList" :key="item">{{
              item
            }}</el-tag>
          </div>
        </template>
        <template #merchant_default="{ row }">
          <div>{{ row.merchantName || '' }}</div>
          <div>{{ row.merchantId || '' }}</div>
        </template>
        <template #person_info_default="{ row }">
          <div>主管：{{ row.sellLeader }}</div>
          <div>销售：{{ row.salesperson }}</div>
        </template>
        <template #balance_header>
          <div>广告余额({{ curCurrencyType }})</div>
        </template>
        <template #expense_header>
          <div>广告花费({{ curCurrencyType }})</div>
        </template>
        <template #expense_default="{ row }">
          <div>{{ row.expense }}</div>
          <div v-if="lastCycle">{{ row.lastCycleExpense }}</div>
        </template>
        <template #shop_order_count_default="{ row }">
          <div>{{ row.shopOrderCount }}</div>
          <div v-if="lastCycle">{{ row.lastCycleShopOrderCount }}</div>
        </template>
        <template #direct_order_default="{ row }">
          <div>{{ row.directOrder }}</div>
          <div v-if="lastCycle">{{ row.lastCycleDirectOrder }}</div>
        </template>

        <template #broad_order_default="{ row }">
          <div>{{ row.broadOrder }}</div>
          <div v-if="lastCycle">{{ row.lastCycleBroadOrder }}</div>
        </template>
        <template #expense_per_order_header>
          <div>广告均单花费({{ curCurrencyType }})</div>
        </template>
        <template #expense_per_order_default="{ row }">
          <div>{{ row.expensePerOrder }}</div>
          <div v-if="lastCycle">{{ row.lastCycleExpensePerOrder }}</div>
        </template>
        <template #clicks_default="{ row }">
          <div>{{ row.clicks }}</div>
          <div v-if="lastCycle">{{ row.lastCycleClicks }}</div>
        </template>
        <template #impression_default="{ row }">
          <div>{{ row.impression }}</div>
          <div v-if="lastCycle">{{ row.lastCycleImpression }}</div>
        </template>
        <template #ctr_default="{ row }">
          <div>{{ row.ctr }}</div>
          <div v-if="lastCycle">{{ row.lastCycleCtr }}</div>
        </template>
        <template #shop_sales_volume_header>
          <div>GMV店铺销售金额({{ curCurrencyType }})</div>
        </template>
        <template #shop_sales_volume_default="{ row }">
          <div>{{ row.shopSalesVolume }}</div>
          <div v-if="lastCycle">{{ row.lastCycleShopSalesVolume }}</div>
        </template>
        <template #direct_gmv_header>
          <div>GMV广告销售金额({{ curCurrencyType }})</div>
        </template>
        <template #direct_gmv_default="{ row }">
          <div>{{ row.directGmv }}</div>
          <div v-if="lastCycle">{{ row.lastCycleDirectGmv }}</div>
        </template>
        <template #cost_per_conversion_default="{ row }">
          <div>{{ row.costPerConversion }}</div>
          <div v-if="lastCycle">{{ row.lastCycleCostPerConversion }}</div>
        </template>
        <template #shop_profit_header>
          <div>店铺利润({{ curCurrencyType }})</div>
        </template>
        <template #shop_profit_default="{ row }">
          <div>{{ row.shopProfit }}</div>
          <div v-if="lastCycle">{{ row.lastCycleShopProfit }}</div>
        </template>
        <template #profit_expense_rate_default="{ row }">
          <div>{{ row.profitExpenseRate }}</div>
          <div v-if="lastCycle">{{ row.lastCycleProfitExpenseRate }}</div>
        </template>
      </vxe-grid>
    </el-card>
    <!-- 导出配置 -->
    <ExportConfig
      v-if="adsConfigDialog"
      :show-dialog="adsConfigDialog"
      config-type="SHOPEE_OPERATE_ADSINFO_EXPORT"
      :checkbox-data="adsExportConfigList"
      title="导出字段配置"
      :checked-row-list="checkedRowList"
      :loading="adsExportLoading"
      :use-default-value="true"
      @close-dialog="handleLogRuleClose($event)"
      @export-dialog="exportDialog"
    />
  </div>
</template>

<script setup name="shopeeoperateadsinfo">
  import { reactive, ref, onMounted } from 'vue';
  import { getStoreList, shortcuts } from '@/api/common';
  import { getSiteListApi, listAllMerchantNameApi } from '@/api/shopee/common';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import ExportConfig from '@/components/ExportConfig/index.vue';
  import { getAdsListApi, getAdsExportFieldsApi } from '@/api/shopee/adsinfo';
  import { ADS_COLS } from './config';
  import {
    transferDate,
    getAllLeafValues,
    comGetTableHeight
  } from '@/utils/common';
  import { ElMessage } from 'element-plus';
  import { transBlob } from '@/utils/downloadFile';
  import { cloneDeep } from 'lodash-es';

  const lastCycle = ref(false);

  const formData = reactive({
    date: '',
    currencyType: '1',
    statisticsType: 0
  });
  const currencyTypeObj = {
    0: ' 当地币种',
    1: '人民币',
    2: '美元'
  };
  const formRef = ref();
  const initList = ref({});
  const pageLoading = ref(false);
  //   首字母大写
  // function capitalizeFirstLetter(str) {
  //   return str
  //     .toLowerCase()
  //     .split(' ')
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ');
  // }
  // 全局排序 数据为空的 不参与排序
  const customSort = ({ data, sortList }) => {
    const sortItem = sortList[0];
    // 取出第一个排序的列
    const { field, order } = sortItem;
    let list = [];
    let sortLists = [];
    let notSortList = [];
    if (order === 'asc' || order === 'desc') {
      sortLists = data.filter((item) => item[field] >= 0);
      notSortList = data.filter((item) => !item[field] && item[field] !== 0);
      sortLists.sort((a, b) => {
        return (
          (a[field] === b[field] ? 0 : a[field] > b[field] ? 1 : -1) *
          (order === 'desc' ? -1 : 1)
        );
      });
    }
    list = sortLists.concat(notSortList);
    return list;
  };
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
    // scrollY: { enabled: false },
    columns: ADS_COLS,
    data: [],
    sortConfig: {
      sortMethod: customSort
    }
  });
  onMounted(async () => {
    // 获取table高度
    gridOptions.height = comGetTableHeight(searchCard, false, true);

    setDateToday();
    pageLoading.value = true;
    Promise.all([
      getStoreList('shopee'),
      getSiteListApi(),
      listAllMerchantNameApi()
    ])
      .then((res) => {
        initList.value.storeList = res[0]?.data?.children || [];
        initList.value.siteList = res[1]?.data?.siteList || [];
        initList.value.merchantNameList = res[2]?.data || [];
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        pageLoading.value = false;
      });
  });

  const tableRef = ref();
  const searchCard = ref();
  const curCurrencyType = ref('人民币');
  const getFormData = () => {
    let storeAcctIdList = [];
    if (formData.storeAcctIdList?.length) {
      storeAcctIdList = formData.storeAcctIdList;
    } else {
      storeAcctIdList = getAllLeafValues(initList.value.storeList);
    }
    const startDate = formData.date[0];
    const endDate = formData.date[1];
    return {
      ...formData,
      storeAcctIdList,
      startDate,
      endDate
    };
  };
  const handleSearch = async () => {
    try {
      const params = getFormData();
      const { data } = await getAdsListApi(params);
      gridOptions.data = data;
      curCurrencyType.value = currencyTypeObj[formData.currencyType];
    } catch (err) {
      gridOptions.data = [];
    }
  };

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    setDateToday();
  };
  const setDateToday = () => {
    const nowDate = new Date().getTime();
    const todayStr = transferDate(nowDate, false);
    formData.date = [todayStr, todayStr];
  };
  const checkedRowList = ref([]);
  // #region广告导出
  const adsConfigDialog = ref(false);
  const adsExportLoading = ref(false);
  const adsExportConfigList = ref([]);
  const handleExport = async () => {
    const { data } = await getAdsExportFieldsApi();
    adsExportConfigList.value = data;
    const checkedList = tableRef.value.getCheckboxRecords();
    checkedRowList.value = cloneDeep(checkedList);
    adsConfigDialog.value = true;
  };
  const handleLogRuleClose = (e) => {
    adsExportConfigList.value = [];
    adsConfigDialog.value = e.isShow;
  };
  const exportDialog = async (e) => {
    let obj = {};
    if (e.checkedType == '导出列表选中数据') {
      if (checkedRowList.value.length == 0) {
        ElMessage.warning('没有在列表中选中数据，请检查后提交！');
        return false;
      }
      obj.storeAcctIdList = checkedRowList.value.map(
        (item) => item.storeAcctId
      );
      obj.startDate = formData.date[0];
      obj.endDate = formData.date[1];
    } else if (e.checkedType == '导出查询条件中的数据') {
      obj = getFormData();
    }
    let exportFieldList = [];
    e.data.forEach((v) => {
      if (v.checkedData) {
        exportFieldList = exportFieldList.concat(v.checkedData);
      }
    });
    obj.exportFieldList = exportFieldList;
    adsExportLoading.value = true;
    transBlob({
      url: '/lms/shopee/ads/export',
      fileName: 'shopee广告数据导出文件.xlsx',
      data: obj,
      contentType: 'application/json'
    }).then(() => {
      adsExportLoading.value = false;
      ElMessage.success('操作成功');
    });
  };
  // #endregion广告导出
</script>

<style lang="scss" scoped></style>
