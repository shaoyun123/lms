<template>
  <div class="app-container">
    <el-card class="common_split_bottom search_card">
      <el-form :model="formData" :inline="true" class="search_form">
        <el-form-item label="销售" prop="saler" class="search_item_cascader">
          <el-cascader
            v-model="formData.salespersonIdList"
            :options="selectData.chooseDepart"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'name',
              children: 'childOrgList',
              value: 'id'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="站点">
          <MultiSelect
            v-model="formData.saleSiteList"
            class="form_right"
            :option-obj="{
              optionList: selectData.siteList,
              value: 'code',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item label="统计时间(周)">
          <el-date-picker
            v-model="formData.firstDayOfWeek"
            type="week"
            format="YYYY [Week] ww"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()">查询</el-button>
          <el-button type="primary" @click="handleExport()">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="common_split_bottom card_position list_card">
      <vxe-table
        ref="orderTable"
        v-loading="loading"
        :data="salesList"
        :height="height"
        :show-overflow="true"
        :scroll-y="{ gt: 10 }"
        border
        :sort-config="{ remote: true }"
        @sort-change="sortChange"
      >
        <vxe-column title="销售" field="salesperson" sortable></vxe-column>
        <vxe-column title="站点" field="siteName" sortable></vxe-column>
        <vxe-column title="总销量" field="saleNums"></vxe-column>
        <vxe-column title="销量环比" field="saleNumWeekOnWeekRatio">
          <template #default="{ row }">
            <span>{{ row.salesNumWeekOnWeekRatio || 0 }}%</span>
          </template>
        </vxe-column>
        <vxe-column title="销售额" field="salesAmtUSD">
          <template #default="{ row }">
            <span>{{ '$' + row.salesAmtUSD || '0' }}</span>
          </template>
        </vxe-column>
        <vxe-column title="销售额环比">
          <template #default="{ row }">
            <span>{{ row.salesAmtWeekOnWeekRatio || 0 }}%</span>
          </template>
        </vxe-column>
        <vxe-column title="广告费" field="advertisingCostUSD">
          <template #default="{ row }">
            <span>{{ '$' + row.advertisingCostUSD || '0' }}</span>
          </template>
        </vxe-column>
        <vxe-column title="广告费占比">
          <template #default="{ row }">
            <span>{{ row.advertisingCostRate || 0 }}%</span>
          </template>
        </vxe-column>
        <vxe-column title="退款总额" field="refundAmtUSD">
          <template #default="{ row }">
            <span>{{ '$' + row.refundAmtUSD || '0' }}</span>
          </template>
        </vxe-column>
        <vxe-column title="退款占比">
          <template #default="{ row }">
            <span>{{ row.refundAmtRate || 0 }}%</span>
          </template>
        </vxe-column>
        <vxe-column title="预估毛利" field="estimatedGrossProfitUSD">
          <template #default="{ row }">
            <span>{{ '$' + row.estimatedGrossProfitUSD || '0' }}</span>
          </template>
        </vxe-column>
        <vxe-column title="预估毛利率">
          <template #default="{ row }">
            <span>{{ row.estimatedGrossMargin || 0 }}%</span>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="formData.page"
          v-model:page-size="formData.limit"
          background
          :page-sizes="[100, 300, 500]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>
<script setup name="fbastatissaledataeveryweek">
  import { getSiteListApi, getCustomers } from '@/api/common/index';
  import { reactive, onMounted, ref, computed } from 'vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import moment from 'moment';
  import { ElMessage } from 'element-plus';
  import {
    queryWeekSaleData,
    exportWeekSaleData
  } from '@/api/fba/saledataweek';

  const formData = reactive({
    page: 1,
    limit: 100,
    salespersonIdList: [],
    saleSiteList: [],
    orderBy: 'sales_site DESC',
    firstDayOfWeek: ''
  });

  onMounted(() => {
    getDepartSaler();
    getSiteData();
  });

  const selectData = reactive({
    siteList: [],
    chooseDepart: []
  });
  // 获取站点
  const getSiteData = async () => {
    try {
      const { code, data } = await getSiteListApi('amazon');
      if (code === '0000') {
        selectData.siteList = data || [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 获取部门和销售
  const getDepartSaler = async () => {
    try {
      const { code, data } = await getCustomers({ roleNames: 'amazon专员' });
      if (code === '0000') {
        // 删除子节点,因为这是获取平台的店铺
        let arr = [];
        mapChooseDepart(arr, data.orgTree, data.userList);
        selectData.chooseDepart = arr;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const mapChooseDepart = (arr, orgTree, userList) => {
    orgTree.forEach((item, index) => {
      arr.push({
        ...item,
        name: item.org_name || item.name,
        childOrgList: []
      });
      if (item.childOrgList?.length) {
        mapChooseDepart(arr[index].childOrgList, item.childOrgList, userList);
      }
      const curSale = userList.filter((v) => item.id === v.org_id);
      if (curSale.length) {
        curSale.forEach((v) => {
          item.childOrgList.push({ ...v, name: v.user_name });
        });
        arr[index].childOrgList = item.childOrgList;
      }
    });
  };

  // 级联多选
  const filterCascader = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };

  const date = reactive({
    startOfWeek: '',
    endOfWeek: ''
  });
  const handleChange = (val) => {
    if (val) {
      var startOfWeek = moment(val, 'YYYY-WW').startOf('week'); // 获取周的开始日期
      formData.firstDayOfWeek = date.startOfWeek =
        startOfWeek.format('YYYY-MM-DD');
      var endOfWeek = moment(val, 'YYYY-WW').endOf('week'); // 获取周的结束日期
      date.endOfWeek = endOfWeek.format('YYYY-MM-DD');
    }
  };

  // 查询列表数据
  const salesList = ref([]);
  const loading = ref(false);
  const total = ref(0);
  const handleQuery = async () => {
    // 销售 站点 统计时间 必填
    if (
      formData.saleSiteList?.length === 0 ||
      formData.salespersonIdList?.length === 0 ||
      !formData.firstDayOfWeek
    ) {
      return ElMessage.warning('请选择销售、站点和统计时间！');
    }
    let salespersonIdList = formData.salespersonIdList?.map(
      (item) => item[item?.length - 1]
    );

    try {
      const { code, data, count } = await queryWeekSaleData({
        ...formData,
        salespersonIdList
      });
      if (code === '0000') {
        salesList.value = data;
        total.value = count;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 排序
  const sortChange = ({ property, order }) => {
    let objMap = {
      siteName: 'site_name',
      salesperson: 'salesperson'
    };
    formData.orderBy = objMap[property] + ' ' + order;
    handleQuery();
  };

  // 分页
  const handleSizeChange = (val) => {
    formData.pageSize = val;
    formData.page = 1;
    handleQuery();
  };

  const handleCurrentChange = (val) => {
    formData.page = val;
    handleQuery();
  };

  // 导出列表数据
  const handleExport = async () => {
    // 销售 站点 统计时间 必填
    if (
      !formData.saleSiteList ||
      !formData.salespersonIdList ||
      !formData.firstDayOfWeek
    ) {
      return ElMessage.warning('请选择销售、站点和统计时间！');
    }
    formData.salespersonIdList = formData.salespersonIdList?.map(
      (item) => item[item.length - 1]
    );

    const res = await exportWeekSaleData(formData);
    const xlsx = 'application/vnd.ms-excel';
    const blob = new Blob([res], { type: xlsx }); //转换数据类型
    const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
    a.download =
      '每周销售数据' + date.startOfWeek + ' - ' + date.endOfWeek + '.xlsx';
    a.href = window.URL.createObjectURL(blob);
    a.click();
    a.remove();
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 150;
  });
</script>
<style lang="scss" scoped></style>
