<template>
  <div class="app-container">
    <el-card class="list_card">
      <vxe-table
        ref="tableDataRef"
        v-loading="tableDataLoading"
        :data="tableData"
        :height="height"
        border
      >
        <vxe-column title="站点">
          <template #default="{ row }">
            {{ getSiteName(row.siteId) }}
          </template>
        </vxe-column>
        <vxe-column title="费用类型">
          <template #default="{ row }">
            {{ getFeeType(row.feeType) }}
          </template>
        </vxe-column>
        <vxe-column title="修改时间">
          <template #default="{ row }">
            {{ transferDate(row.modifyTime) }}
          </template>
        </vxe-column>
        <vxe-column title="修改人" field="modifier"></vxe-column>
        <vxe-column title="操作">
          <template #default="{ row }">
            <div style="display: flex">
              <!-- 当前只支持 4 个站点编辑 -->
              <el-button
                type="primary"
                :disabled="!['US', 'JP', 'GB', 'DE'].includes(row.siteId)"
                @click="updateSetPrice(row)"
                >编辑</el-button
              >
              <el-button type="primary" @click="handleExeLog(row)"
                >日志</el-button
              >
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </el-card>
    <Setpricelog
      v-if="fbaSetPriceLogDialog"
      :show-dialog="fbaSetPriceLogDialog"
      :log-table-data="logTableData"
      @close-dialog="handleLogClose($event)"
    />

    <Editsetprice
      v-if="fbaEditSetPriceDialog"
      :show-dialog="fbaEditSetPriceDialog"
      :edit-site="editSite"
      :site-id="siteId"
      :currency-sign="currencySign"
      @close-dialog="handleEditClose"
    />
  </div>
</template>
<script name="fbaproductInfosetpriceparam" setup>
  import { ref, computed, onMounted } from 'vue';
  import { transferDate } from '@/utils/common';
  import Setpricelog from './components/setpricelog.vue';
  import Editsetprice from './components/editsetprice.vue';
  import {
    getFbaPriceConfigHomePage,
    listFbaPriceConfigTypeEnum,
    getAllAmazonSite,
    getOperLog
  } from '@/api/fba/setpriceparams.js';

  const tableDataLoading = ref(false);
  const tableData = ref([]);

  onMounted(() => {
    queryTableData();
    feeTypeMap();
    getAllAmazonSiteList();
  });

  const queryTableData = async () => {
    try {
      const { data } = await getFbaPriceConfigHomePage();
      tableData.value = data || [];
    } catch (err) {
      console.log(err);
    }
  };

  const feeTypeMapList = ref([]); // 费用类型映射
  const feeTypeMap = async () => {
    try {
      const { data } = await listFbaPriceConfigTypeEnum();
      feeTypeMapList.value = data || [];
    } catch (err) {
      console.log(err);
    }
  };

  const getFeeType = (type) => {
    let configTypeName = '';
    feeTypeMapList.value?.forEach((item) => {
      if (item.configTypeId == type) {
        configTypeName = item.configTypeName;
      }
    });
    return configTypeName;
  };

  const siteList = ref([]); // 站点列表
  const getAllAmazonSiteList = async () => {
    try {
      const { data } = await getAllAmazonSite();
      siteList.value = data.amzonSiteList || [];
    } catch (err) {
      console.log(err);
    }
  };

  const getSiteName = (siteId) => {
    let siteName = '';
    siteList.value?.forEach((item) => {
      if (item.siteId == siteId) {
        siteName = item.siteName;
      }
    });
    return siteName;
  };

  const fbaSetPriceLogDialog = ref(false); // 日志弹窗
  const logTableData = ref([]); // 日志表格数据

  const handleLogClose = () => {
    fbaSetPriceLogDialog.value = false;
  };

  const fbaEditSetPriceDialog = ref(false); // 编辑定价弹窗
  const editSite = ref(''); // 站点
  const siteId = ref(''); // 站点ID
  const currencySign = ref(''); // 货币符号
  // 编辑定价
  const updateSetPrice = (row) => {
    fbaEditSetPriceDialog.value = true;
    editSite.value = getSiteName(row.siteId);
    siteId.value = row.siteId;
    currencySign.value = row.currencySign;
  };

  // 日志
  const handleExeLog = async (row) => {
    fbaSetPriceLogDialog.value = true;
    try {
      let params = {
        siteId: row.siteId,
        feeType: row.feeType
      };
      const { data } = await getOperLog(params);
      logTableData.value = data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditClose = (val) => {
    fbaEditSetPriceDialog.value = false;
    if (val === 'update') {
      queryTableData();
    }
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 100;
  });
</script>
<style lang="scss"></style>
