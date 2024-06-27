<template>
  <!-- tiktok 售后 -->
  <div class="aftersale_wrapper app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :inline="true"
        label-width="80"
        class="search_form"
      >
        <el-form-item
          label="店铺"
          prop="storeAcctIdList"
          class="search_item_cascader"
        >
          <z-cascader
            v-model="formData.storeAcctIdList"
            :data="enumList.storeList"
          ></z-cascader>
          <!-- <el-cascader
            v-model="formData.storeAcctIdList"
            :options="enumList.storeList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true }"
          ></el-cascader> -->
        </el-form-item>
        <el-form-item label="店铺单号" prop="orderIdList">
          <el-input
            v-model="formData.orderIdList"
            clearable
            placeholder="支持多个精确查询"
            @blur="commonDivideCommaNum($event)"
          />
        </el-form-item>
        <el-form-item label="售后申请号" prop="reverseOrderIdList">
          <el-input
            v-model="formData.reverseOrderIdList"
            clearable
            placeholder="支持多个精确查询"
            @blur="commonDivideCommaNum($event)"
          />
        </el-form-item>
        <el-form-item label-width="80" prop="time">
          <div class="form_left">
            <el-select v-model="formData.timeType">
              <el-option
                v-for="item in enumList.timeTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <el-date-picker
            v-model="formData.time"
            type="daterange"
            unlink-panels
            range-separator="-"
            value-format="YYYY-MM-DD"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts"
            class="form_right"
          />
        </el-form-item>
        <el-form-item label="OA订单状态" prop="orderProcessStatusList">
          <MultiSelect
            v-model="formData.orderProcessStatusList"
            :option-obj="{
              optionList: enumList.orderProcessStatusList,
              value: 'name',
              label: 'value'
            }"
          />
        </el-form-item>
        <el-form-item label="售后状态" prop="reverseStatusList">
          <MultiSelect
            v-model="formData.reverseStatusList"
            :option-obj="{
              optionList: enumList.reverseStatusList,
              value: 'reverseStatus',
              label: 'statusOa'
            }"
          />
        </el-form-item>
        <el-form-item label="售后类型" prop="reverseTypeList">
          <MultiSelect
            v-model="formData.reverseTypeList"
            :option-obj="{
              optionList: enumList.reverseTypeList,
              value: 'oaStatus',
              label: 'desc'
            }"
          />
        </el-form-item>
        <el-form-item label="客服备注" prop="haveRemark">
          <el-select
            v-model="formData.haveRemark"
            clearable
            filterable
            :fit-input-width="true"
          >
            <el-option :value="true" label="有客服备注" />
            <el-option :value="false" label="无客服备注" />
          </el-select>
          <el-input v-if="formData?.haveRemark" v-model="formData.remark" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(ruleFormRef)"
            >查询</el-button
          ><el-button type="primary" @click="handleResetForm(ruleFormRef)"
            >清空</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
    <el-card class="common_split_bottom list_card">
      <el-tabs
        v-model="queryType"
        v-loading="configOptions.tableLoading"
        type="card"
        @tab-click="handleTab"
      >
        <el-tab-pane
          v-for="item in enumList.queryTypeList"
          :key="item.label"
          :name="item.value"
          :label="item.label + '(' + item.count + ')'"
        >
          <vxe-grid ref="tableDataRef" v-bind="gridOptions">
            <template #refundAmount_default="{ row }">
              <div class="msg_table_amount">
                <span>{{ row.platOrderAmt }}{{ row.currency }}</span>
                <span> ({{ row.platOrderAmtCny }}&yen;)</span>
              </div>
              <div class="msg_table_amount">
                <span> {{ row.refundTotal }}{{ row.currency }}</span>
                <span> ({{ row.refundTotalCny }}&yen;)</span>
              </div>
            </template>
            <template #return_reason_default="{ row }">
              <ExpandText
                :default-line="DEFAULT_TEXT_LINE"
                :text="row.returnReason"
              />
            </template>
            <template #reverse_status_default="{ row }">
              <div>{{ row.reverseStatusValueCn }}</div>
              <!-- 部分标签栏展示 -->
              <template v-if="['1', '2'].includes(queryType)">
                <div v-if="row.deadlineTime" class="aftersale_text_danger">
                  {{ transferDate(row.deadlineTime) }}
                </div>
                <el-tag v-if="row.deadlineDaysIn" type="danger"
                  >{{ row.deadlineDaysIn }}天内回应</el-tag
                >
              </template>
            </template>
            <template #buyer_info="{ row }">
              <el-button link type="primary" @click="handleConnect(row)"
                >联系买家</el-button
              >
            </template>

            <template #remark_default="{ row }">
              <ExpandText
                :default-line="DEFAULT_TEXT_LINE"
                :text="row.remark"
              />
            </template>
            <template #time_default="{ row }">
              <div>申请:{{ transferDate(row.reverseRequestTime) }}</div>
              <div>更新:{{ transferDate(row.reverseUpdateTime) }}</div>
            </template>
            <template #toolbar_default="{ row }">
              <el-button type="primary" @click="handleDetail(row)"
                >详情</el-button
              >
              <el-button
                :loading="row.syncLoading"
                type="primary"
                @click="handleSync(row)"
                >同步</el-button
              >
              <el-button type="primary" @click="handleCustomRemark(row)"
                >客服备注</el-button
              >
            </template>
          </vxe-grid>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="paginationData.page"
              v-model:page-size="paginationData.limit"
              :page-sizes="[50, 100, 300]"
              :small="true"
              layout="total, sizes, prev, pager, next"
              :total="paginationData.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 批量操作 -->
      <div class="common_batch_btns">
        <el-button :loading="exportLoading" type="primary" @click="handleExport"
          >导出</el-button
        >
        <el-button type="primary" @click="handleSendMsg">发送消息</el-button>
        <el-dropdown trigger="click" style="margin: 0 10px">
          <el-button type="primary">
            批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleBatchSync"
                ><span>批量同步</span></el-dropdown-item
              >
              <el-dropdown-item @click="handleBatchAgree"
                ><span v-permission="['tkHandleBatchAgree']"
                  >批量同意</span
                ></el-dropdown-item
              >
              <el-dropdown-item @click="handleBatchReject"
                ><span v-permission="['tkHandleBatchReject']"
                  >批量拒绝</span
                ></el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-card>
    <OrderDetail
      v-model="configOptions.showDetail"
      :row-data="configOptions.selectRow"
      :query-type="queryType"
      @handle-search="handleSearch"
    />
    <RemarkDialog
      v-model="configOptions.remarkVisible"
      :row-data="configOptions.selectRow"
      @change-data="changeData"
    />
    <MsgDialog
      v-if="msgVisible"
      v-model="msgVisible"
      :row-checked-list="rowCheckedTkList"
    />
    <RefuseRefund
      v-model="refuseVisible"
      :checked-list="checkedList"
      :query-type="queryType"
      :is-handle-batch="isHandleBatch"
      @fresh-data="refuseSuccess"
    />
  </div>
</template>

<script setup name="publishstiktokaftersale">
  import { onMounted, reactive, ref } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { transferDate } from '@/utils/common';
  import { getStoreList, shortcuts, getListEnum } from '@/api/common';
  import {
    queryListApi,
    initEnumApi,
    syncApi,
    batchConfirmReverseApi
  } from '@/api/publishs/tiktokaftersale';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { transBlob } from '@/utils/downloadFile';
  import { commonDivideCommaNum } from '@/utils/divide';
  import OrderDetail from './components/OrderDetail.vue';
  import RemarkDialog from './components/RemarkDialog.vue';
  import ExpandText from '@/components/ExpandText.vue';
  import MsgDialog from './components/MsgDialog.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import RefuseRefund from './components/RefuseRefund.vue';
  import { setItem } from '@/utils/storage';
  import { useRouter } from 'vue-router';
  const DEFAULT_TEXT_LINE = 4;
  // 枚举
  const enumList = reactive({
    timeTypeList: [
      { value: 1, label: '申请时间' },
      { value: 2, label: '更新时间' },
      { value: 3, label: '截止时间' }
    ],
    queryTypeList: [
      { value: '1', label: '待处理', count: 0 },
      { value: '2', label: '待收货', count: 0 },
      { value: '0', label: '全部', count: 0 }
    ],
    reverseStatusList: []
  });
  const searchCardRef = ref(null);
  const formData = ref({
    platCode: 'tiktok',
    timeType: 1
  });
  const ruleFormRef = ref();
  const queryType = ref('1');
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });
  const configOptions = reactive({
    tableLoading: false,
    showDetail: false,
    remarkVisible: false,
    selectRow: {}
  });
  const gridOptions = reactive({
    border: true,
    showFooter: true,
    height: 200,
    columnConfig: {
      resizable: true
    },
    showOverflow: true,
    scrollY: { gt: 15 },
    rowConfig: { isCurrent: true, isHover: true, keyField: 'id' },
    editConfig: {
      trigger: 'click',
      mode: 'cell'
    },
    data: [],
    columns: [
      { type: 'checkbox', width: 60 },
      { field: 'storeAcct', title: '店铺名称' },
      { field: 'orderId', title: '店铺单号' },
      { field: 'reverseOrderId', title: '售后申请号' },
      {
        field: 'refundAmount',
        title: '订单/退款金额',
        slots: { default: 'refundAmount_default' }
      },
      { field: 'reverseTypeCn', title: '售后类型' },
      {
        field: 'returnReason',
        title: '申请原因',
        slots: { default: 'return_reason_default' }
      },
      { field: 'reverseQuantity', title: '售后商品数量' },
      { field: 'orderProcessStatusName', title: 'OA订单状态' },
      {
        field: 'reverseStatus',
        title: '售后状态',
        slots: { default: 'reverse_status_default' }
      },
      {
        field: 'buyerInfo',
        title: '卖家信息',
        slots: { default: 'buyer_info' }
      },
      {
        field: 'remark',
        title: '客服备注',
        slots: { default: 'remark_default' }
      },
      { field: 'time', title: '时间', slots: { default: 'time_default' } },
      {
        field: 'toolbar',
        title: '操作',
        width: 100,
        slots: { default: 'toolbar_default' }
      }
    ],
    footerMethod() {}
  });
  const tableDataRef = ref();
  // 获取枚举值，将默认值选中
  onMounted(() => {
    configOptions.tableLoading = true;

    Promise.all([getStoreList('tiktok'), initEnumApi(), getListEnum()])
      .then((res) => {
        enumList.storeList = res[0].data?.children;
        enumList.reverseTypeList = res[1].data.reverseTypeEnum;
        enumList.orderByList = res[1].data.orderByEnum;

        res[1].data.reverseStatusEnum.forEach((item) => {
          // statusOa相等的，将reverseStatus整合到一起
          let statusIndex = enumList.reverseStatusList.findIndex(
            (val) => val.statusOa === item.statusOa
          );
          if (statusIndex > -1) {
            let reverseStatus =
              enumList.reverseStatusList[statusIndex].reverseStatus;
            enumList.reverseStatusList[statusIndex].reverseStatus =
              reverseStatus + ',' + item.reverseStatus;
          } else {
            enumList.reverseStatusList.push({
              ...item,
              reverseStatus: item.reverseStatus.toString()
            });
          }
        });
        // 默认全选
        formData.value.reverseTypeList = enumList.reverseTypeList.map(
          (item) => item.oaStatus
        );
        formData.value.reverseStatusList = enumList.reverseStatusList.map(
          (item) => item.reverseStatus
        );
        enumList.orderProcessStatusList = res[2].data.orderProcessStatus;
        // 全选
        formData.value.orderProcessStatusList =
          enumList.orderProcessStatusList.map((item) => item.name);
      })
      .catch((err) => {
        console.log('err :>> ', err);
      })
      .finally(() => {
        configOptions.tableLoading = false;
      });
  });

  // 获取table高度
  onMounted(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCardRef?.value?.$el?.clientHeight;
    gridOptions.height = clientHeight - 166 - searchCardHeight;
  });

  // 联系买家
  const router = useRouter();
  const handleConnect = (row) => {
    let params = {
      storeAcctId: row.storeAcctId,
      orderId: row.orderId
    };
    setItem('publishstiktokchat', JSON.stringify(params));
    router.push('/publishs/tiktok/chat');
  };

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formData.value.remark = null;
    formEl.resetFields();
    formData.value.timeType = 1;
  };

  const handleSearch = async () => {
    configOptions.tableLoading = true;
    try {
      const params = getParamsData();
      const { data, count } = await queryListApi(params);
      gridOptions.data = (data || []).map((item) => ({
        ...item,
        syncLoading: false,
        textReasonline: DEFAULT_TEXT_LINE,
        remarkLine: DEFAULT_TEXT_LINE
      }));
      paginationData.total = count;
      getTabCount(count);
    } catch (err) {
      gridOptions.data = [];
      paginationData.total = 0;
    } finally {
      configOptions.tableLoading = false;
    }
  };
  const getParamsData = () => {
    const { limit, page } = paginationData;
    let _storeAcctIdList = '';
    if (formData.value?.storeAcctIdList?.length) {
      _storeAcctIdList = formData.value.storeAcctIdList;
    } else {
      // 没选店铺，传全部
      _storeAcctIdList = findAllStore(enumList.storeList);
    }
    const time = {
      startTime: formData.value.time?.length
        ? new Date(formData.value.time[0] + ' 00:00:00').getTime()
        : null,
      endTime: formData.value.time?.length
        ? new Date(formData.value.time[1] + ' 23:59:59').getTime()
        : null
    };
    return {
      ...formData.value,
      storeAcctIdList: _storeAcctIdList,
      orderIdList: formData.value.orderIdList?.length
        ? formData.value.orderIdList.split(',')
        : [],
      reverseOrderIdList: formData.value.reverseOrderIdList?.length
        ? formData.value.reverseOrderIdList.split(',')
        : [],
      reverseStatusList:
        formData.value.reverseStatusList?.length && queryType.value === '0'
          ? formData.value.reverseStatusList?.join()?.split(',')
          : [],
      ...time,
      remark: formData.value.haveRemark ? formData.value.remark : null,
      limit,
      page,
      orderBy:
        queryType.value !== '0'
          ? 'reverse_update_time ASC'
          : 'reverse_request_time DESC', // 待处理&待收货界面，默认按照操作截止时间正序排列。全部界面，默认按照申请时间倒序排列
      queryType: queryType.value
    };
  };
  const findAllStore = (storeList) => {
    let arr = [];
    storeList.forEach((item) => {
      if (item.tag === 'shop') {
        arr.push(item.value);
      } else if (item.tag !== 'shop' && item.children.length > 0) {
        arr = arr.concat(findAllStore(item.children));
      }
    });
    return arr;
  };
  // const filterStore = (node, keyword) => {
  //   const label = node?.label?.trim();
  //   const text = node?.text?.trim();
  //   const _keyword = keyword.trim().replaceAll('，', ',').split(',');
  //   const hasLabel = _keyword.some((item) => label.includes(item));
  //   const hasText = _keyword.some((item) => text.includes(item));
  //   if (hasLabel || hasText) {
  //     return node;
  //   }
  // };

  const findTable = () => {
    const $table = tableDataRef.value;
    const tableIndex = enumList.queryTypeList.findIndex(
      (item) => queryType.value === item.value
    );
    return $table[tableIndex];
  };

  // 获取各个页签的数量
  const getTabCount = (totalCount) => {
    enumList.queryTypeList.forEach((item) => {
      if (queryType.value === item.value) {
        item.count = totalCount;
      }
    });
  };
  const handleTab = ({ paneName }) => {
    queryType.value = paneName;
    handleSearch();
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

  // 导出
  const exportLoading = ref(false);
  const handleExport = () => {
    exportLoading.value = true;
    transBlob({
      url: '/lms/tiktok/reserve/export',
      contentType: 'application/json',
      data: getParamsData(),
      fileName: 'tiktok售后' + transferDate(new Date().getTime()) + '.xlsx'
    }).finally(() => {
      exportLoading.value = false;
    });
  };

  const rowCheckedTkList = ref([]);
  // 发送消息
  const msgVisible = ref(false);
  const handleSendMsg = () => {
    const curTable = findTable();
    const curTableData = curTable.getCheckboxRecords();
    rowCheckedTkList.value = curTableData;
    if (!curTableData.length) return ElMessage.warning('请选择数据');
    msgVisible.value = true;
  };

  // 批量同意
  const handleBatchAgree = async () => {
    const curTable = findTable();
    const curTableData = curTable.getCheckboxRecords();
    if (!curTableData.length) return ElMessage.warning('请选择数据');
    const arr = curTableData.map((item) => item.reverseOrderId);

    try {
      const { code, data } = await batchConfirmReverseApi(arr);
      if (code == '0000') {
        ElMessage.success('操作成功！');
      } else {
        let str = '';
        data?.forEach((item) => {
          str =
            str +
            item.errorMsg +
            ':' +
            item.errorOrderIdStr +
            '<br/>' +
            '<p></p>';
        });

        ElMessageBox.alert(str || '请求失败', '错误信息', {
          confirmButtonText: '确认',
          type: 'error',
          dangerouslyUseHTMLString: true,
          customClass: 'tipErrorWidth'
        });
      }
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  // 批量拒绝
  const refuseVisible = ref(false);
  const isHandleBatch = ref(false);
  const checkedList = ref([]);
  const handleBatchReject = () => {
    const curTable = findTable();
    const curTableData = curTable.getCheckboxRecords();
    if (!curTableData.length) return ElMessage.warning('请选择数据');

    // 勾选店铺限制同一个
    const uniqueStoreAccIds = [
      ...new Set(curTableData.map((item) => item.storeAcctId))
    ];
    if (uniqueStoreAccIds.length !== 1) {
      return ElMessage.warning('仅支持批量拒绝同一个店铺的售后订单！');
    }

    // 勾选状态限制
    const hasInvalidStatus = curTableData.some((item) => {
      return (
        item.reverseStatusValueCn !== '待处理' &&
        item.reverseStatusValueCn !== '待收货'
      );
    });
    if (hasInvalidStatus) {
      return ElMessage.warning('仅支持处理待处理&待收货状态的售后订单！');
    }
    checkedList.value = curTableData;
    refuseVisible.value = true;
    isHandleBatch.value = true;
  };

  // 批量拒绝成功
  const refuseSuccess = () => {
    refuseVisible.value = false;
    handleSearch();
  };

  // 批量同步
  const handleBatchSync = async () => {
    const curTable = findTable();
    const curTableData = curTable.getCheckboxRecords();
    if (!curTableData.length) return ElMessage.warning('请选择数据');

    try {
      const params = curTableData.map((item) => ({
        storeAcctId: item.storeAcctId,
        reverseOrderId: item.reverseOrderId,
        id: item.id
      }));
      const { msg } = await syncApi(params);
      ElMessage.success(msg || '同步成功');
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const handleSync = async (row) => {
    row.syncLoading = true;
    try {
      const params = [
        {
          storeAcctId: row.storeAcctId,
          reverseOrderId: row.reverseOrderId,
          id: row.id
        }
      ];
      const { msg } = await syncApi(params);
      row.syncLoading = false;
      ElMessage.success(msg || '同步成功');
      handleSearch();
    } catch (err) {
      row.syncLoading = false;
      console.log('err :>> ', err);
    }
  };

  // 详情
  const handleDetail = async (row) => {
    let recordList = row.recordList.map((item, index) => ({
      ...item,
      updateTimeKey:
        index === 0 &&
        (item.reasonText ||
          item.additionalMessage ||
          item.additionalImageList?.length)
          ? ['1']
          : []
    }));
    configOptions.selectRow = { ...row, recordList };
    configOptions.showDetail = true;
  };

  // 客服备注
  const handleCustomRemark = (row) => {
    configOptions.remarkVisible = true;
    configOptions.selectRow = row;
  };
  const changeData = (obj = {}) => {
    obj.row[obj.key] = obj.value;
  };
</script>

<style lang="scss" scoped>
  // @import './index.scss';
  .aftersale_text_danger {
    color: #f56c6c;
    background: #fef0f0;
    border: 1px solid #fde2e2;
    border-radius: 4px;
    padding: 0 7px;
  }
  .msg_table_amount {
    display: flex;
    justify-content: space-between;
  }
</style>
<style lang="scss">
  .tipErrorWidth {
    .el-message-box__container {
      word-break: break-all;
    }
  }
</style>
