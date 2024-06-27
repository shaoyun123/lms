<!-- 账单管理 -->
<template>
  <div style="padding: 10px">
    <el-card class="search_card common_split_bottom">
      <el-form :model="formData" :inline="true" class="search_form">
        <el-form-item label="账单时间">
          <el-date-picker
            v-model="formData.time"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            :shortcuts="shortcuts"
            range-separator="-"
            :default-time="defaultTime"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="账号">
          <el-select
            v-model="formData.accountIdList"
            :class="formData.accountIdList.length > 1 ? 'hide_tag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.accountIdList.length > 1" type="info"
                >已选{{ formData.accountIdList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initSelect.accountList"
              :key="item.id"
              :label="item.acctName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="币种">
          <el-select
            v-model="formData.currencyList"
            :class="formData.currencyList.length > 1 ? 'hide_tag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.currencyList.length > 1" type="info"
                >已选{{ formData.currencyList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initSelect.currencyList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select
            v-model="formData.transactionTypeList"
            :class="formData.transactionTypeList.length > 1 ? 'hide_tag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.transactionTypeList.length > 1" type="info"
                >已选{{ formData.transactionTypeList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initSelect.transactionTypeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易状态">
          <el-select
            v-model="formData.transactionStatusList"
            :class="formData.transactionStatusList.length > 1 ? 'hide_tag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag
                v-if="formData.transactionStatusList.length > 1"
                type="info"
                >已选{{ formData.transactionStatusList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initSelect.transactionStatusList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易号">
          <el-input
            v-model="formData.transactionIdListStr"
            clearable
            placeholder="多个使用逗号隔开"
          ></el-input>
        </el-form-item>
        <el-form-item label="收款账号">
          <el-input v-model="formData.beneficiaryName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card
      v-loading="tableDataLoading"
      class="card_position list_card common_split_bottom"
    >
      <div style="margin-bottom: 10px">
        <el-button
          type="primary"
          :loading="exportLoading"
          @click="handleExport()"
          >导出</el-button
        >
      </div>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="height"
        border
        show-overflow
        :column-config="{ resizable: true }"
        :scroll-y="{ gt: 10 }"
      >
        <vxe-column type="checkbox" width="5%" />
        <vxe-column title="账号" field="accountName" width="10%"></vxe-column>
        <vxe-column title="账单时间" field="transactionTime" width="10%">
          <template #default="{ row }">
            {{
              row.transactionTime
                ? parseTime(row.transactionTime, '{y}-{m}-{d} {h}:{i}:{s}')
                : ''
            }}
          </template>
        </vxe-column>
        <vxe-column
          title="交易类型"
          field="transactionType"
          width="10%"
        ></vxe-column>
        <vxe-column title="详情" width="30%">
          <template #default="{ row }">
            <div
              v-if="row.beneficiaryName"
              style="
                font-size: 14px;
                color: black;
                font-weight: 500;
                padding-top: 10px;
              "
            >
              {{ row.beneficiaryName }}
            </div>
            <div style="font-size: 14px; color: black; font-weight: 500">
              {{ row.payerName
              }}<span
                v-if="
                  row.beneficiaryStoreName &&
                  row.beneficiaryStoreName !== 'Same Name Collection'
                "
                >- {{ row.beneficiaryStoreName }}</span
              >
            </div>
            <div v-if="row.transactionId">交易号：{{ row.transactionId }}</div>
            <div v-if="row.extTransactionId">
              <span>商家订单号：{{ row.extTransactionId }}</span>
            </div>
            <el-popover
              placement="right"
              :width="450"
              trigger="click"
              @show="queryRelationTransaction(row)"
            >
              <template #reference>
                <div
                  style="
                    color: rgb(47, 50, 241);
                    cursor: pointer;
                    padding-bottom: 10px;
                  "
                >
                  <span>查看关联交易 ></span>
                </div>
              </template>
              <div class="pop_table_wrap">
                <div
                  v-for="(item, index) in relationList"
                  :key="index"
                  class="pop_table"
                >
                  <div style="flex: 1">
                    {{
                      row.transactionTime
                        ? parseTime(
                            row.transactionTime,
                            '{y}-{m}-{d} {h}:{i}:{s}'
                          )
                        : ''
                    }}
                  </div>
                  <div class="pop_td">{{ item.transactionType }}</div>
                  <div class="pop_td">
                    <span style="font-weight: bold"
                      ><span v-if="item.transactionAmount > 0">+</span
                      >{{ item.transactionAmount }}</span
                    >
                    {{ row.transactionCurrency }}
                  </div>
                </div>
              </div>
            </el-popover>
          </template>
        </vxe-column>
        <vxe-column title="流入金额" width="10%">
          <template #default="{ row }">
            <div
              v-if="row.transactionAmount && row.transactionAmount > 0"
              class="acount_align"
            >
              <div>
                <span style="font-weight: bold; font-size: 14px">{{
                  addThousandSeparator(row.transactionAmount)
                }}</span>
                {{ row.transactionCurrency }}
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="流出金额" width="10%">
          <template #default="{ row }">
            <div
              v-if="row.transactionAmount && row.transactionAmount < 0"
              class="acount_align"
            >
              <div>
                <span style="font-weight: bold; font-size: 14px">{{
                  addThousandSeparator(row.transactionAmount)
                }}</span>
                {{ row.transactionCurrency }}
              </div>
              <div v-if="row.transactionType === '兑换'">
                汇率：<span>{{
                  addThousandSeparator(row.transferQuotePrice)
                }}</span>
              </div>
              <div v-if="row.transactionType === '兑换'">
                兑换：<span>{{
                  addThousandSeparator(row.exchangeAmount)
                }}</span>
                {{ row.receiveCurrency }}
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="余额" width="10%">
          <template #default="{ row }">
            <span style="font-size: 14px; font-weight: bold">{{
              addThousandSeparator(row.accountAmount)
            }}</span>
            {{ row.accountCurrency }}
          </template>
        </vxe-column>
        <vxe-column
          title="状态"
          width="5%"
          field="transactionStatus"
        ></vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="formData.page"
          v-model:page-size="formData.limit"
          background
          :page-sizes="[100, 300, 500]"
          :small="true"
          layout="total, sizes, prev, pager, next"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>
<script setup name="financialworldfirstbillmanage">
  import { reactive, ref, computed, onMounted } from 'vue';
  import { shortcuts } from '@/api/common';
  import { parseTime } from '@/utils/common';
  import {
    wfTransactionConfig,
    wfTransactionQuery,
    queryRelationTransactionApi
  } from '@/api/financial/worldfirst.js';
  import { transBlob } from '@/utils/downloadFile';
  import { ElMessage } from 'element-plus';

  const formData = reactive({
    page: 1,
    limit: 100,
    time: [],
    transactionBeginTime: '',
    transactionEndTime: '',
    accountIdList: [],
    currencyList: [],
    transactionTypeList: [],
    transactionStatusList: [],

    transactionIdListStr: '',
    transactionIdList: [],
    beneficiaryName: '',
    idList: []
  });

  const tableDataLoading = ref(false);
  const tableData = ref([]);
  const tableRef = ref(null);

  const getOneMonthAgo = () => {
    const today = new Date();
    let oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      today.getDate(),
      0,
      0,
      0
    );
    oneMonthAgo = parseTime(oneMonthAgo, '{y}-{m}-{d} {h}:{i}:{s}');
    return oneMonthAgo;
  };

  const getTodayDate = () => {
    const today = new Date();
    let todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );
    todayDate = parseTime(todayDate, '{y}-{m}-{d} {h}:{i}:{s}');
    return todayDate;
  };

  const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59)
  ];

  onMounted(() => {
    // 默认账单时间为最近三个月
    formData.time = [getOneMonthAgo(), getTodayDate()];
    getInitConfig();
  });

  const initSelect = reactive({
    accountList: [],
    currencyList: [],
    transactionTypeList: [],
    transactionStatusList: []
  });

  // 获取页面初始化配置
  const getInitConfig = async () => {
    const { data } = await wfTransactionConfig();
    Object.keys(initSelect).forEach((key) => {
      initSelect[key] = data[key] || [];
    });
  };
  const totalCount = ref(0);
  const handleQuery = async () => {
    try {
      if (formData.time?.length === 0 || !formData.time) {
        return ElMessage.warning('请选择账单时间');
      }
      formData.transactionBeginTime = formData.time ? formData.time[0] : '';
      formData.transactionEndTime = formData.time ? formData.time[1] : '';

      formData.transactionIdList = formData.transactionIdListStr
        ? formData.transactionIdListStr.split(',')
        : [];
      tableDataLoading.value = true;
      const { code, data } = await wfTransactionQuery(formData);
      if (code === '0000') {
        tableData.value = data.list || [];
        totalCount.value = data.total;
        tableData.value?.forEach((item) => {
          if (item.transactionCurrency === 'JPY') {
            item.transactionAmount = item.transactionAmount / 100;
            item.accountAmount = item.accountAmount / 100;
          }
          if (item.transactionType !== '退款') {
            item.exchangeAmount =
              (item.transferQuotePrice * 10000 * item.transactionAmount) /
              10000;
          } else {
            item.exchangeAmount =
              (item.refundQuotePrice * 10000 * item.transactionAmount) / 10000;
          }
        });
      }
      tableDataLoading.value = false;
    } catch (err) {
      console.log(err);
      tableDataLoading.value = false;
    }
  };

  // 数字添加 千分符
  const addThousandSeparator = (number) => {
    // 检查是否为小数
    const isDecimal = Number.isInteger(number) === false;
    // 格式化数字
    const formattedNumber = number.toLocaleString(undefined, {
      maximumFractionDigits: isDecimal ? 4 : 0
    });
    // 如果是小数，添加小数点
    if (isDecimal) {
      return formattedNumber.replace('.', '.');
    }
    return formattedNumber;
  };

  // 查看关联交易
  const relationList = ref([]);
  const queryRelationTransaction = async (row) => {
    relationList.value = [];
    if (!row.extTransactionId) {
      return ElMessage.warning('缺少商家订单号，不能查看关联交易！');
    }
    try {
      const { data } = await queryRelationTransactionApi(row.extTransactionId);
      relationList.value = data || [];
    } catch (err) {
      console.log(err);
    }
  };

  // 分页
  const handleSizeChange = (val) => {
    formData.limit = val;
    handleQuery();
  };

  const handleCurrentChange = (val) => {
    formData.page = val;
    handleQuery();
  };

  // 导出
  const selectRecords = ref([]);
  const exportLoading = ref(false);
  const handleExport = async () => {
    selectRecords.value = tableRef.value.getCheckboxRecords();
    formData.idList = selectRecords.value.map((item) => item.id);
    exportLoading.value = true;
    try {
      transBlob({
        url: '/lms/wfTransaction/exportTransaction',
        contentType: 'application/json',
        data: formData,
        fileName: '账单关联交易' + Date.now() + '.xls'
      }).finally(() => {
        exportLoading.value = false;
      });
    } catch (err) {
      console.log(err);
      exportLoading.value = false;
    }
  };

  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 255;
  });
</script>
<style lang="scss" scoped>
  .hide_tag {
    :deep(.el-select__selected-item) {
      display: none;
    }
  }
  .acount_align {
    // display: inline-block;
    // text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .pop_table {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    .pop_td {
      width: 120px;
    }
  }
  .pop_table_wrap {
    padding: 20px 0;
    color: #000;
    font-size: 14px;
    font-weight: 400;
  }
</style>
