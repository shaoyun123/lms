<template>
  <!-- shopee 售后 -->
  <div class="aftersale_wrapper app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :inline="true"
        label-width="80"
        class="search_form"
      >
        <!-- <el-row> -->
        <el-form-item
          label="店铺"
          prop="storeAcctId"
          class="aftersale_item_cascader"
        >
          <ZCascader v-model="formData.storeAcctId" :data="storeList" />
        </el-form-item>
        <el-form-item label="店铺单号" prop="orderId">
          <el-input
            v-model="formData.orderId"
            clearable
            placeholder="支持多个精确查询"
          />
        </el-form-item>
        <el-form-item label="售后申请号" prop="returnSn">
          <el-input
            v-model="formData.returnSn"
            clearable
            placeholder="支持多个精确查询"
          />
        </el-form-item>
        <el-form-item label-width="80" prop="time">
          <div class="form_left">
            <el-select v-model="formData.timeType">
              <el-option
                v-for="item in enumList.timeType"
                :key="item.desc"
                :label="item.desc"
                :value="item.code"
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
            class="aftersale_item_date form_right"
          />
        </el-form-item>
        <el-form-item
          v-if="pageType == '999'"
          label="退款状态"
          prop="statusList"
        >
          <MultiSelect
            v-model="formData.statusList"
            :option-obj="{
              optionList: enumList.status,
              value: 'code',
              label: 'meaning'
            }"
          />
        </el-form-item>
        <el-form-item label="退款类型" prop="reason">
          <el-select v-model="formData.reason" clearable filterable>
            <el-option
              v-for="item in enumList.returnReason"
              :key="item.code"
              :label="item.desc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-row> -->
        <el-form-item label="客服" prop="customServicers">
          <MultiSelect
            v-model="formData.customServicers"
            :option-obj="{
              optionList: enumList.customerList,
              value: 'userName',
              label: 'userName'
            }"
          />
        </el-form-item>
        <el-form-item label="客服备注" prop="haveRemark">
          <el-select v-model="formData.haveRemark" clearable filterable>
            <el-option :value="true" label="有客服备注" />
            <el-option :value="false" label="无客服备注" />
          </el-select>
          <el-input v-if="formData?.haveRemark" v-model="formData.remark" />
        </el-form-item>
        <el-form-item label="退款差额" prop="refundDiff" class="form_range">
          <ZInputNumber
            v-model="formData.refundDifferenceAmountCNYMin"
            clearable
            :precision="2"
          />
          <div class="range_link">-</div>
          <ZInputNumber
            v-model="formData.refundDifferenceAmountCNYMax"
            clearable
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="排序" prop="orderBy">
          <el-select v-model="formData.orderBy" clearable filterable>
            <el-option
              v-for="item in enumList.orderBy"
              :key="item.code"
              :label="item.desc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站点" prop="siteIdList">
          <MultiSelect
            v-model="formData.siteIdList"
            :option-obj="{
              optionList: enumList.siteList,
              value: 'code',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item label="是否换货" prop="orderTagSign">
          <el-select v-model="formData.orderTagSign" clearable filterable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="少发组合品" prop="lessIssuedCombinationProduct">
          <el-select
            v-model="formData.lessIssuedCombinationProduct"
            clearable
            filterable
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="GP" prop="merchantNameList">
          <!-- <ZSelect
            v-model="formData.merchantNameList"
            :items="enumList.merchantNameList"
          /> -->
          <MultiSelect
            v-model="formData.merchantNameList"
            :option-obj="{
              optionList: enumList.merchantNameList
            }"
          />
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
    <el-card class="common_split_bottom aftersale_table_wrapper list_card">
      <el-tabs
        v-model="pageType"
        v-loading="tableDataLoading"
        type="card"
        @tab-click="handleTab"
      >
        <el-tab-pane
          v-for="item in enumList.pageType"
          :key="item.meaning"
          :name="item.code"
          :label="item.meaning"
        >
          <el-checkbox-group
            v-if="pageType === '0'"
            v-model="toBeRespondedCheckList"
            class="checkbox_margin"
            @change="changeStatus"
          >
            <el-checkbox
              v-for="cItem in toBeRespondedTagStatusList"
              :key="cItem.code"
              :label="cItem.code"
              >{{ cItem.meaning }}</el-checkbox
            >
          </el-checkbox-group>
          <el-checkbox-group
            v-if="pageType === '1'"
            v-model="processTagCheckList"
            class="checkbox_margin"
            @change="changeStatus"
          >
            <el-checkbox
              v-for="cItem in processTagStatusList"
              :key="cItem.code"
              :label="cItem.code"
              >{{ cItem.meaning }}</el-checkbox
            >
          </el-checkbox-group>
          <vxe-table
            ref="tableDataRef"
            :data="tableData"
            :height="height"
            :show-overflow="true"
            :scroll-y="{ gt: 10 }"
            border
            :row-config="{ isCurrent: true, isHover: true, keyField: 'id' }"
            :column-config="{ resizable: true }"
          >
            <vxe-column type="checkbox" width="30"></vxe-column>
            <vxe-column field="shopId" title="店铺名称(shopId)">
              <template #default="{ row }">
                {{ row.storeAcct }}
                <br />
                ({{ row.shopId }})
                <br />
                客服：{{ row.customServicer }}
              </template>
            </vxe-column>
            <vxe-column
              field="merchant"
              title="GP"
              :title-prefix="{
                message: '店铺所属营业执照'
              }"
            >
              <template #default="{ row }">
                <div>{{ row.merchantName || '' }}</div>
                <div>{{ row.merchantId || '' }}</div>
              </template>
            </vxe-column>
            <vxe-column field="orderId" title="店铺单号">
              <template #default="{ row }">
                <div>{{ row.orderId }}</div>
                <el-icon
                  :color="primaryColor"
                  :size="16"
                  @click="handleJumpOrderDetail(row)"
                  ><Link
                /></el-icon>
                <el-tag
                  v-for="v in row.orderTagDtoList"
                  :key="v.tagName"
                  :color="v.color"
                  effect="dark"
                  >{{ v.tagName }}</el-tag
                >
                <el-tag v-if="row.lessIssuedCombinationProduct" type="primary"
                  >组</el-tag
                >
              </template>
            </vxe-column>
            <vxe-column field="returnSn" title="售后申请号"></vxe-column>
            <vxe-column
              field="refundAmount"
              title="金额"
              :width="200"
              :title-prefix="{
                message: `订单金额：销售订单金额
退款金额：客户申请退款金额
少发金额=（子订单销售金额/平台数量）*实际少发数量-优惠券分摊金额
退款差额：退款差额=退款金额-少发金额
*当订单不存在少发商品，或少发商品为组合品时，不计算少发金额`
              }"
            >
              <template #default="{ row }">
                <div class="msg_table_amount">
                  <span>订单金额：</span>
                  <span>{{ row.amountBeforeDiscount }}{{ row.currency }}</span>
                  <span> ({{ row.amountBeforeDiscountCNY }}&yen;)</span>
                </div>
                <div class="msg_table_amount">
                  <span>退款金额：</span>
                  <span> {{ row.refundAmount }}{{ row.currency }}</span>
                  <span> ({{ row.refundAmountCNY }}&yen;)</span>
                </div>
                <div class="msg_table_amount">
                  <span>少发金额：</span>
                  <span> {{ row.refundableAmount }}{{ row.currency }}</span>
                  <span> ({{ row.refundableAmountCNY }}&yen;)</span>
                </div>
                <div class="msg_table_amount">
                  <span>退款差额：</span>
                  <span>
                    {{ row.refundDifferenceAmount }}{{ row.currency }}</span
                  >
                  <span> ({{ row.refundDifferenceAmountCNY }}&yen;)</span>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="weight" title="重量">
              <template #default="{ row }">
                <div v-if="row.preWeight !== undefined">
                  商品重量:{{ row.preWeight }}g
                </div>
                <div v-if="row.realWeight !== undefined">
                  发货重量:{{ row.realWeight }}g
                </div>
                <div v-if="row.weightDifference !== undefined">
                  重量差:{{ row.weightDifference }}g
                </div>
                <div v-if="row.logisticsCompanyRealWeight !== undefined">
                  物流重量:{{ row.logisticsCompanyRealWeight }}g
                </div>
                <div v-if="row.logisticsWeightDifference !== undefined">
                  物流重量差:{{ row.logisticsWeightDifference }}g
                </div>
              </template>
            </vxe-column>
            <vxe-column field="reasonCn" title="退款类型"></vxe-column>
            <vxe-column field="textReaso" title="退款原因">
              <template #default="{ row }">
                <ExpandText
                  :default-line="DEFAULT_TEXT_LINE"
                  :text="row.textReason"
                />
              </template>
            </vxe-column>
            <vxe-column field="amount" title="退款商品数量"></vxe-column>
            <vxe-column field="statusCn" title="退款状态">
              <template #default="{ row }">
                <div>{{ row.statusCn }}</div>
                <template v-if="showresponseDue(row)">
                  <div v-if="row.responseDueTime" class="aftersale_text_danger">
                    {{ transferDate(row.responseDueTime) }}
                  </div>
                  <el-tag
                    v-if="row.responseDueDaysIn !== undefined"
                    type="danger"
                    >{{ row.responseDueDaysIn }}天内回应</el-tag
                  >
                </template>
              </template>
            </vxe-column>
            <vxe-column field="buyerInfo" title="买家信息">
              <template #default="{ row }">
                <div>{{ row.buyerName }}/{{ row.buyerUserId }}</div>
                <el-button link type="primary" @click="handleConnect(row)"
                  >联系买家</el-button
                >
              </template>
            </vxe-column>
            <vxe-column field="remark" title="备注">
              <template #default="{ row }">
                <ExpandText
                  v-if="row.remark"
                  :default-line="2"
                  :text="`客服备注：${row.remark}`"
                />
                <template v-if="row.orderRemarkList?.length">
                  <div>
                    订单备注： {{ row.orderRemarkList[0] }}
                    <el-popover
                      v-if="row.orderRemarkList?.length > 1"
                      placement="top-start"
                      :width="200"
                      trigger="hover"
                    >
                      <div
                        v-for="remarkItem in row.orderRemarkList"
                        :key="remarkItem"
                      >
                        {{ remarkItem }}
                      </div>
                      <template #reference>
                        <el-tag>多</el-tag>
                      </template>
                    </el-popover>
                  </div>
                </template>
              </template>
            </vxe-column>
            <vxe-column field="time" title="时间" :width="170">
              <template #default="{ row }">
                <div>申请:{{ transferDate(row.returnCreateTime) }}</div>
                <div>更新:{{ transferDate(row.returnUpdateTime) }}</div>
                <div>截止:{{ transferDate(row.returnDueTime) }}</div>
              </template>
            </vxe-column>
            <vxe-column title="操作" width="90">
              <template #default="{ row }">
                <el-button
                  :loading="rowData.detailLoading"
                  type="primary"
                  @click="handleDetail(row)"
                  >详情</el-button
                >
                <el-button
                  :loading="row.syncLoading"
                  type="success"
                  @click="handleSync(row)"
                  >同步</el-button
                >
                <el-button type="info" @click="handleRemark(row)"
                  >客服备注</el-button
                >
                <!-- status == 8 可争议状态 -->
                <el-button
                  v-if="showCompletedBtn(row)"
                  type="success"
                  @click="handleCompleted(row)"
                  >已完成</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="paginationData.page"
              v-model:page-size="paginationData.limit"
              background
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
      <div class="batch_btns_wrapper">
        <el-button type="primary" @click="handleExport">导出</el-button>
        <!-- <el-button type="primary" @click="handleSendMsg">发送消息</el-button>
        <el-button type="success" @click="handleBatchSync">批量同步</el-button>
        <el-button
          v-if="pageType == 0 || pageType == 1"
          type="success"
          @click="handleBatchCompleted"
          >已完成</el-button
        > -->
        <el-select
          v-model="batchOperateType"
          style="width: 150px"
          class="ml20"
          placeholder="批量操作"
          filterable
          clearable
          ><template v-for="item in batchList" :key="item.value">
            <template v-if="item.pageTypeList.includes(pageType)">
              <template v-if="item.permission">
                <el-option
                  v-permission="[item.permission]"
                  :value="item.value"
                  :label="item.label"
                  @click="handleBatch(item)"
                />
              </template>
              <template v-else>
                <el-option
                  :value="item.value"
                  :label="item.label"
                  @click="handleBatch(item)"
                />
              </template>
            </template>
          </template>
        </el-select>
      </div>
    </el-card>
    <OrderDetail
      v-model="detailVisible"
      :row-data="rowData"
      :page-type="pageType"
      :dispute-reason-list="enumList.disputeReason"
      @del-data="delData"
      @handle-search="handleSearch"
    />
    <MsgDialog
      v-if="batchVisible.batchSendMsg"
      v-model="batchVisible.batchSendMsg"
      :row-checked-list="rowCheckedList"
    />
    <RemarkDialog
      v-if="batchVisible.remarkVisible"
      v-model="batchVisible.remarkVisible"
      :row-checked-list="rowCheckedList"
      :row-data="rowData"
      @change-data="changeData"
      @handle-search="handleSearch"
    />
  </div>
</template>

<script setup name="shopeecustomeraftersale">
  import { computed, onMounted, reactive, ref } from 'vue';
  import { join } from 'lodash-es';
  import { transferDate, comGetTableHeight } from '@/utils/common';
  import {
    querypage,
    queryInitList,
    syncOrder,
    queryDetail,
    mark2CompletedApi,
    batchConfirmRefund
  } from '@/api/shopee/aftersale';
  import { getStoreList, shortcuts, getCustomerListApi } from '@/api/common';
  import { getSiteListApi, listAllMerchantNameApi } from '@/api/shopee/common';
  import MsgDialog from './components/MsgDialog.vue';
  import OrderDetail from './components/OrderDetail.vue';
  import RemarkDialog from './components/RemarkDialog.vue';
  import ExpandText from '@/components/ExpandText.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { setItem } from '@/utils/storage';
  import { transBlob } from '@/utils/downloadFile';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import { useRouter } from 'vue-router';
  import { Link } from '@element-plus/icons-vue';
  import { primaryColor } from '@/styles/vars.module.scss';
  import { copy } from '@/utils/common';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';

  // import ZSelect from '@/components/ZSelect/index.vue';
  const DEFAULT_TEXT_LINE = 4;
  // 枚举
  const enumList = ref({ merchantNameList: [] });
  const storeList = ref([]);
  const toBeRespondedTagStatusList = ref([]);
  const processTagStatusList = ref([]);

  const searchCardRef = ref(null);
  // 获取枚举值，将默认值选中
  onMounted(() => {
    tableDataLoading.value = true;
    Promise.all([
      queryInitList(),
      getStoreList('shopee'),
      getSiteListApi(),
      getCustomerListApi({
        role: 'shopee客服'
      }),
      listAllMerchantNameApi()
    ])
      .then((res) => {
        enumList.value = res[0]?.data;
        storeList.value = res[1]?.data?.children;
        enumList.value.siteList = res[2]?.data?.siteList;
        enumList.value.customerList = res[3]?.data;
        enumList.value.pageType = enumList.value.pageType.map((item) => ({
          ...item,
          code: item.code === undefined ? '999' : item.code.toString()
        }));
        enumList.value.merchantNameList = res[4]?.data || [];
        // 赋初始值
        formData.statusList = res[0]?.data?.status.map((item) => item.code);
        formData.orderBy = res[0]?.data?.orderBy[0].code;
        formData.timeType = res[0]?.data?.timeType[0].code;

        toBeRespondedTagStatusList.value =
          res[0]?.data?.toBeRespondedTagStatus || [];
        processTagStatusList.value = res[0]?.data?.processTagStatus || [];
      })
      .finally(() => {
        tableDataLoading.value = false;
      });
  });
  const formData = reactive({
    platCode: 'shopee',
    statusList: [],
    time: [],
    merchantNameList: []
  });
  const ruleFormRef = ref();
  const pageType = ref('0');
  const toBeRespondedCheckList = ref([]);
  const processTagCheckList = ref([]);

  const changeStatus = () => {
    handleSearch();
  };

  const height = computed(
    () => comGetTableHeight(searchCardRef, true, true) - 33
  );

  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });
  const tableData = ref([]);
  const tableDataRef = ref();
  const tableDataLoading = ref(false);
  const handleResetForm = (formEl) => {
    if (!formEl) return;
    // formData.remark = null;
    formData.refundDifferenceAmountCNYMin = null;
    formData.refundDifferenceAmountCNYMax = null;
    formData.orderTagList = null;
    formEl.resetFields();
  };
  const handleSearch = async () => {
    tableDataLoading.value = true;
    try {
      const params = getParamsData();
      const { data, count } = await querypage(params);

      tableData.value = data.map((item) => ({
        ...item,
        syncLoading: false,
        detailLoading: false,
        textReasonline: DEFAULT_TEXT_LINE,
        remarkLine: DEFAULT_TEXT_LINE
      }));
      paginationData.total = count;
      tableDataLoading.value = false;
    } catch (err) {
      tableDataLoading.value = false;
      console.log('err :>> ', err);
    }
  };
  const getParamsData = () => {
    const { limit, page } = paginationData;
    const type = 'customservicer';
    let _storeAcctId = '';
    if (!formData?.storeAcctId?.length) {
      // 没选店铺，传全部
      _storeAcctId = findAllStore(storeList.value);
    } else {
      _storeAcctId = formData.storeAcctId.join(',');
    }
    let statusList = [];
    if (pageType.value === '999') {
      statusList = join(formData.statusList, ',');
    } else if (pageType.value === '0') {
      statusList = join(toBeRespondedCheckList.value, ',');
    } else if (pageType.value === '1') {
      statusList = join(processTagCheckList.value, ',');
    } else {
      statusList = join([], ',');
    }
    const siteIdList = join(formData.siteIdList, ',');
    const customServicers = join(formData.customServicers, ',');
    const time = formData.time || [];
    // 是否换货
    if (formData.orderTagSign) {
      formData.orderTagList = '修改SKU';
    } else if (formData.orderTagSign === false) {
      formData.orderTagList = '修改SKU';
    } else {
      formData.orderTagList = null;
    }
    // GP
    const merchantNameList = join(formData.merchantNameList, ',');
    return {
      ...formData,
      storeAcctId: _storeAcctId,
      statusList,
      siteIdList,
      customServicers,
      remark: formData.haveRemark ? formData.remark : null,
      startTime: time[0],
      endTime: time[1],
      merchantNameList,
      limit,
      page,
      type,
      pageType: pageType.value === '999' ? '' : pageType.value
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
    return arr.join();
  };
  const handleTab = ({ paneName }) => {
    pageType.value = paneName;
    handleSearch();
    // 判断批量选中值在当前tab下是否可以有值
    const curBatchList = batchList.filter((v) =>
      v.pageTypeList.includes(paneName)
    );
    const isExist = curBatchList.some(
      (v) => v.value === batchOperateType.value
    );
    if (!isExist) {
      batchOperateType.value = null;
    }
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

  //
  const showresponseDue = (row) => {
    if (pageType.value == 0) {
      if (
        row.status === 0 ||
        row.status === 6 ||
        row.status === 7 ||
        row.status === 8
      ) {
        return true;
      }
    }
    return false;
  };

  // 导出
  const handleExport = () => {
    transBlob({
      url: '/lms/shopee/returns/export.html',
      contentType: 'application/x-www-form-urlencoded',
      data: getParamsData(),
      fileName: 'shopee售后' + transferDate(new Date().getTime()) + '.xlsx'
    });
  };
  // #region 批量操作
  const rowCheckedList = ref([]);
  const getTable = () => {
    const tabIndex = enumList.value.pageType.findIndex(
      (item) => item.code === pageType.value
    );
    const $table = tableDataRef.value[tabIndex];
    return $table;
  };
  // 批量同步
  const handleBatchSync = async () => {
    tableDataLoading.value = true;
    try {
      let ids = rowCheckedList.value.map((item) => item.id).join();
      const { msg } = await syncOrder(ids);
      tableDataLoading.value = false;
      ElMessage.success(msg || '同步成功');
      handleSearch();
    } catch (err) {
      tableDataLoading.value = false;
      console.log('err :>> ', err);
    }
  };

  // #region 已完成
  const showCompletedBtn = (row) => {
    const nowDate = new Date().getTime();
    if (pageType.value == 1 && row.status == 8) {
      //	处理中页面仅可争议状态数据
      return true;
    } else if (
      pageType.value == 0 &&
      row.status === 0 &&
      (row.responseDueTime < nowDate || row.responseDueDaysIn === undefined)
    ) {
      //待响应页面中所有状态
      return true;
    } else if (
      pageType.value == 0 &&
      row.status === 7 &&
      row.responseDueTime < nowDate
    ) {
      return true;
    }
    return false;
  };
  const completedMsgObj = {
    0: '超出截止时间数据修改为已完成,操作成功！',
    1: '可争议数据修改为已完成,操作成功！'
  };
  const handleBatchCompleted = async () => {
    const params = rowCheckedList.value.map((v) => ({
      id: v.id,
      status: v.status,
      remark: v.remark,
      responseDueTime: v.responseDueTime
    }));
    await mark2CompletedApi(params);
    ElMessage.success(completedMsgObj[pageType.value]);
    handleSearch();
  };
  const handleCompleted = async (row) => {
    const $table = getTable();
    await mark2CompletedApi([
      {
        id: row.id,
        status: row.status,
        remark: row.remark,
        responseDueTime: row.responseDueTime
      }
    ]);
    ElMessage.success(completedMsgObj[pageType.value]);
    $table.remove(row);
  };
  // #endregion 已完成

  // 批量退款
  const handleBatchConfirmRefund = async () => {
    ElMessageBox.confirm(
      `确认对所选${rowCheckedList.value.length}个售后订单进行批量退款操作？`,
      '客服批量退款',
      {
        confirmButtonText: '同意退款',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      const { data, msg } = await batchConfirmRefund(rowCheckedList.value);
      const failList = data.filter((v) => !v.success);
      // 展示失败数据
      if (failList.length) {
        const orderIdListStr = failList.map((v) => v.orderId).join(',');
        const orderIdListInfoStr = failList
          .map((v) => v.orderId + '：' + v.errorMsg)
          .join(';');
        ElMessageBox.alert(
          `<div style="max-height: 500px;overflow-y: auto;"><div style="word-wrap: break-word">退款失败：${orderIdListStr}</div><div>退款失败原因：${orderIdListInfoStr}</div></div>`,
          '退款操作结果',
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确认',
            callback: () => {
              handleSearch();
            }
          }
        );
      } else {
        ElMessage.success(msg || '操作成功');
        handleSearch();
      }
    });
  };
  const batchOperateType = ref();
  const batchVisible = reactive({});
  // 仔细对照pageType定义的code 全部对应的是999
  const batchList = [
    {
      label: '发送信息',
      value: 'batchSendMsg',
      pageTypeList: ['0', '2', '1', '999']
    },
    {
      label: '批量同步',
      value: 'batchSync',
      pageTypeList: ['0', '2', '1', '999'],
      clickEvent: handleBatchSync
    },
    {
      label: '批量备注',
      value: 'remarkVisible',
      pageTypeList: ['0', '2', '1', '999']
    },
    {
      label: '批量退款',
      value: 'batchConfirmRefund',
      clickEvent: handleBatchConfirmRefund,
      pageTypeList: ['0']
    },
    {
      label: '已完成',
      value: 'batchComplete',
      pageTypeList: ['0', '1'],
      clickEvent: handleBatchCompleted
    }
  ];
  const handleBatch = (curBatchObj) => {
    // 不需要选择数据的
    const noValidCheckedList = [];

    if (!noValidCheckedList.includes(batchOperateType.value)) {
      // 选择数据
      const $table = getTable();
      rowCheckedList.value = $table.getCheckboxRecords();
      const notNeetModelList = [
        'batchSync',
        'batchComplete',
        'batchConfirmRefund'
      ];
      if (!rowCheckedList.value.length) return ElMessage.warning('请选择数据');

      if (notNeetModelList.includes(batchOperateType.value)) {
        curBatchObj.clickEvent();
      } else {
        // 打开对应弹窗
        batchVisible[batchOperateType.value] = true;
      }
    }
  };
  // #endregion 批量操作
  const rowData = ref({});
  // 备注
  const handleRemark = (row) => {
    batchVisible.remarkVisible = true;
    rowCheckedList.value = [];
    rowData.value = row;
  };
  const changeData = (updateObj) => {
    Object.assign(rowData.value, updateObj);
  };

  const handleSync = async (row) => {
    row.syncLoading = true;
    try {
      const { msg } = await syncOrder(row.id);
      row.syncLoading = false;
      ElMessage.success(msg || '同步成功');
      handleSearch();
    } catch (err) {
      row.syncLoading = false;
      console.log('err :>> ', err);
    }
  };

  // 联系买家
  const router = useRouter();
  const handleConnect = (row) => {
    let params = {
      storeAcctId: row.storeAcctId,
      orderId: row.orderId
    };
    setItem('shopeecustomerchat', JSON.stringify(params));
    router.push('/shopee/customer/chat');
    // window.open('/chatui/#/shopeeChat');
  };

  // 跳转到shopee后台订单
  const handleJumpOrderDetail = (row) => {
    const { orderId } = row;
    copy(row.orderId);
    window.open(
      `https://seller.shopee.cn/portal/sale/order?cnsc_shop_id=${row.shopId}&keyword=${orderId}`
    );
  };

  // 详情
  const detailVisible = ref(false);
  const handleDetail = async (row) => {
    row.detailLoading = true;
    try {
      const { data } = await queryDetail(row.id);
      rowData.value = {
        ...data,
        returnUpdateTime: transferDate(data.returnUpdateTime, false),
        returnDueTime: transferDate(data.returnDueTime, false),
        returnCreateTime: transferDate(data.returnCreateTime, false)
      };
      row.detailLoading = false;
      detailVisible.value = true;
    } catch (err) {
      row.detailLoading = false;
      console.log('err :>> ', err);
    }
  };
  const delData = (rowData) => {
    rowData.removeCheckboxRow();
  };
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
