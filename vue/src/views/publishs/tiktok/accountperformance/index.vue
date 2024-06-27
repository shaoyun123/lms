<template>
  <!-- tiktok账号表现 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :inline="true"
        label-width="80"
        class="search_form"
      >
        <el-form-item
          v-if="activeKey === '1'"
          label="店铺"
          prop="storeAcctIdList"
          class="search_item_cascader"
        >
          <!-- <z-cascader
            v-model="formData.storeAcctIdList"
            :data="enumList.storeList"
          ></z-cascader> -->
          <el-cascader
            v-model="formData.storeScoreAcctId"
            :options="enumList.storeList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              emitPath: false
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item v-if="activeKey === '1'" label="销售组长">
          <el-select
            v-model="formData.leaderIdList"
            style="width: 140px"
            class="saleLeader"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            clearable
          >
            <el-option label="无" :value="0"></el-option>
            <el-option
              v-for="item in saleLeaderList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey === '1'"
          label="同步状态"
          prop="syncStatus"
        >
          <el-select v-model="formData.syncStatus" filterable clearable>
            <el-option :value="true" label="同步成功"></el-option>
            <el-option :value="false" label="同步失败"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeKey === '1'"
          label="店铺总罚分"
          class="form_range"
          prop="totalViolationScoreMin"
        >
          <ZInputNumber
            v-model="formData.totalViolationScoreMin"
            :precision="2"
            class="form_right"
            clearable
          />
          <div class="range_link">-</div>
          <ZInputNumber
            v-model="formData.totalViolationScoreMax"
            :precision="2"
            clearable
          />
        </el-form-item>
        <template v-if="activeKey === '0'">
          <el-form-item
            label="店铺"
            prop="storeAcctIdList"
            class="search_item_cascader"
          >
            <el-cascader
              v-model="formData.storeRecordAcctId"
              :options="enumList.storeList"
              :filter-method="filterCascader"
              filterable
              clearable
              collapse-tags
              :props="{
                multiple: true,
                emitPath: false
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item v-if="activeKey === '0'" label="销售组长">
            <el-select
              v-model="formData.leaderIdList"
              style="width: 140px"
              class="form_multi"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
              clearable
            >
              <el-option label="无" :value="0"></el-option>
              <el-option
                v-for="item in saleLeaderList"
                :key="item.id"
                :label="item.userName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="罚单ID" prop="recordIdStr">
            <el-input v-model="formData.recordIdStr" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <!-- <el-date-picker
              v-model="formData.createTime"
              value-format="YYYY-MM-DD hh:mm:ss"
              type="daterange"
              unlink-panels
              :shortcuts="shortcuts"
              class="form_right"
              :default-time="DEFAULT_TIME"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            /> -->
            <el-date-picker
              v-model="formData.createTime"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 200px"
              class="form_right"
              :shortcuts="shortcuts"
            />
          </el-form-item>
          <el-form-item label="违规状态" prop="recordStatus">
            <el-select v-model="formData.recordStatus" clearable>
              <el-option
                v-for="item in initSelectData.recordStatusEnum"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处罚状态" prop="phaseEnum">
            <el-select v-model="formData.phaseEnum" clearable>
              <el-option
                v-for="item in initSelectData.phaseEnum"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申诉状态" prop="appealStatusEnumList">
            <el-select
              v-model="formData.appealStatusEnumList"
              clearable
              multiple
              filterable
              :class="
                formData.appealStatusEnumList?.length > 1 ? 'hide_tag' : ''
              "
              collapse-tags
            >
              <template #prefix>
                <el-tag
                  v-if="formData.appealStatusEnumList?.length > 1"
                  type="info"
                  >已选{{ formData.appealStatusEnumList?.length }}项</el-tag
                >
              </template>
              <el-option
                v-for="item in initSelectData.appealStatusEnum"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="违规类型" prop="violationTypeList">
            <el-select
              v-model="formData.violationTypeList"
              class="form_multi"
              style="width: 140px"
              clearable
              multiple
              filterable
              :class="formData.violationTypeList?.length > 1 ? 'hide_tag' : ''"
              collapse-tags
            >
              <template #prefix>
                <el-tag
                  v-if="formData.violationTypeList?.length > 1"
                  type="info"
                  >已选{{ formData.violationTypeList?.length }}项</el-tag
                >
              </template>
              <el-option
                v-for="item in initSelectData.accountViolationTypeEnum"
                :key="item.code"
                :value="item.name"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="订单ID" prop="orderIdStr">
            <el-input v-model="formData.orderIdStr" clearable></el-input>
          </el-form-item> -->
          <el-form-item label="product ID" prop="productIdStr">
            <el-input v-model="formData.productIdStr" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品父sku" prop="prodPSkuStr">
            <el-input v-model="formData.prodPSkuStr" clearable></el-input>
          </el-form-item>
          <el-form-item label="申诉截止时间" prop="pronounceDeadline">
            <el-date-picker
              v-model="formData.pronounceDeadline"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetimerange"
              unlink-panels
              :shortcuts="shortcuts"
              class="form_right"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(ruleFormRef)"
            >查询</el-button
          ><el-button type="reset" @click="handleResetForm(ruleFormRef)"
            >清空</el-button
          ><el-button type="primary" @click="handleExportForm(ruleFormRef)"
            >导出</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
    <el-card class="common_split_bottom list_card card_position">
      <div v-if="activeKey === '1'" class="tools_btn">
        <el-button
          v-permission="['tiktokUpdateTortWhite']"
          type="primary"
          @click="updateTortWhite()"
          >商品违规侵权处理白名单</el-button
        >
      </div>
      <el-tabs v-model="activeKey" type="card" @tab-click="handleClick">
        <el-tab-pane
          :label="`罚分记录(${violationScoreCount})`"
          name="1"
        ></el-tab-pane>
        <el-tab-pane
          :label="`违规记录(${violationCount})`"
          name="0"
        ></el-tab-pane>
      </el-tabs>
      <vxe-grid
        v-if="activeKey === '1'"
        ref="tableDataRef"
        v-bind="gridOptions"
        @cell-click="handleRowClick"
      >
        <template #store_default="{ row }">
          <el-tooltip v-if="!row.syncStatus" placement="right">
            <div class="red_color">{{ row.storeAcct }}</div>
            <template #content>
              <div class="store_tip">
                {{ transferDate(row.syncTime) }}:{{ row.syncRemark }}
              </div>
            </template>
          </el-tooltip>
          <div v-else>{{ row.storeAcct }}</div>
        </template>
        <template #ssales_default="{ row }">
          <div>销售：{{ row.salesperson }}</div>
          <div>组长：{{ row.leaderName }}</div>
          <div>主管：{{ row.sellLeaderName }}</div>
        </template>
        <template #syncTime_default="{ row }">
          <div>平台更新时间:{{ transferDate(row.platUpdateTime) }}</div>
          <div>同步时间:{{ transferDate(row.syncTime) }}</div>
        </template>
        <template #totalViolationScore_default="{ row }">
          <el-button link @click="linkToRecordTab(row)">
            <span v-if="row.totalViolationScore < 12" class="hover_color">
              {{ row.totalViolationScore }}
            </span>
            <span
              v-else-if="
                row.totalViolationScore >= 12 && row.totalViolationScore < 24
              "
              class="orange_color hover_color"
            >
              {{ row.totalViolationScore }}
            </span>
            <span
              v-else-if="
                row.totalViolationScore >= 24 && row.totalViolationScore < 36
              "
              class="red_color hover_color"
            >
              {{ row.totalViolationScore }}
            </span>
            <span
              v-else-if="
                row.totalViolationScore >= 36 && row.totalViolationScore <= 48
              "
              class="danger_color hover_color"
            >
              {{ row.totalViolationScore }}
            </span>
          </el-button>
          <span v-if="row.hasNewViolation" class="red_color ml10">
            <el-icon :size="18" :color="chatPrimary"><Top /></el-icon>
          </span>
          <span v-else class="ml10">-</span>
        </template>
        <template #order_fulfillment_violation_score="{ row }">
          <el-button link @click="linkToRecordTab(row, '订单物流违规')">
            <span class="hover_color">{{
              row.orderFulfillmentViolationScore
            }}</span></el-button
          >
        </template>
        <template
          #compute_shop_liable_cancel_rate_by_seller_s14d_e8d_default="{ row }"
        >
          <CellInfo
            key-value="compute_shop_liable_cancel_rate_by_seller_s14d_e8d"
            :indicator-map="row.indicatorMap"
          />
          <div>{{}}</div>
        </template>
        <template #compute_non_fbt_late_dispatch_s7d_e1d_default="{ row }">
          <CellInfo
            key-value="compute_non_fbt_late_dispatch_s7d_e1d"
            :indicator-map="row.indicatorMap"
          />
        </template>
        <template #service_indicators_violation_score="{ row }">
          <el-button link @click="linkToRecordTab(row, '服务指标违规')"
            ><span class="hover_color">{{
              row.serviceIndicatorsViolationScore
            }}</span></el-button
          >
        </template>
        <template #seller_fault_negative_review_rate_temp_default="{ row }">
          <CellInfo
            key-value="Seller_NRR.seller_fault_negative_review_rate_temp"
            :indicator-map="row.indicatorMap"
          />
        </template>
        <template
          #seller_service_issue_negative_review_rate_temp_default="{ row }"
        >
          <CellInfo
            key-value="Seller_NRR.seller_service_issue_negative_review_rate_temp"
            :indicator-map="row.indicatorMap"
          />
        </template>
        <template
          #compute_shop_liable_return_rate_by_seller_s60d_e30d_default="{ row }"
        >
          <CellInfo
            key-value="compute_shop_liable_return_rate_by_seller_s60d_e30d"
            :indicator-map="row.indicatorMap"
          />
        </template>
        <template
          #performance_overview_violation_type_policy_compliance_default="{
            row
          }"
        >
          <CellInfo
            key-value="performance_overview_violation_type_policy_compliance"
            :indicator-map="row.indicatorMap"
          />
        </template>
        <template #compliance_bottom_lineViolation_score="{ row }">
          <el-button link @click="linkToRecordTab(row, '合规底线')"
            ><span class="hover_color">{{
              row.complianceBottomLineViolationScore
            }}</span></el-button
          >
        </template>
        <template #shop_violation_cnt_default="{ row }">
          <CellInfo
            key-value="shop_violation_cnt"
            :indicator-map="row.indicatorMap"
          />
        </template>
        <template #product_violation_cnt_default="{ row }">
          <CellInfo
            key-value="product_violation_cnt"
            :indicator-map="row.indicatorMap"
          />
        </template>
        <template #other_violation_score="{ row }">
          <el-button link @click="linkToRecordTab(row, '其他违规')"
            ><span class="hover_color">{{
              row.otherViolationScore
            }}</span></el-button
          >
        </template>
        <template #risk_control_violation_cnt_default="{ row }">
          <CellInfo
            key-value="risk_control_violation_cnt"
            :indicator-map="row.indicatorMap"
          />
        </template>
      </vxe-grid>
      <vxe-table
        v-if="activeKey === '0'"
        ref="tableRecordsDataRef"
        :height="height"
        :show-overflow="true"
        :scroll-y="{ gt: 50 }"
        :data="recordsList"
        border
      >
        <vxe-column type="checkbox" width="50"></vxe-column>
        <vxe-column title="店铺" field="storeAcct"></vxe-column>
        <vxe-column title="销售" field="salesperson" width="110">
          <template #default="{ row }">
            <div>销售：{{ row.salesperson }}</div>
            <div>组长：{{ row.leaderName }}</div>
            <div>主管：{{ row.sellLeaderName }}</div>
          </template>
        </vxe-column>
        <vxe-column title="罚单ID" field="recordId"></vxe-column>
        <vxe-column
          title="创建时间"
          field="platCreateTime"
          width="150"
          sortable="true"
        ></vxe-column>
        <vxe-column
          title="违规状态"
          field="recordStatus"
          width="100"
        ></vxe-column>
        <vxe-column title="处罚状态" field="phase" width="80"></vxe-column>
        <vxe-column
          title="申诉状态"
          field="appealStatus"
          width="100"
        ></vxe-column>
        <vxe-column title="违规类型" field="violationType"></vxe-column>
        <vxe-column
          title="违规原因"
          field="violationReason"
          width="120"
        ></vxe-column>
        <vxe-column
          title="违规详情"
          field="violationDetail"
          width="200"
        ></vxe-column>
        <vxe-column title="关联商品" field="productId">
          <template #default="{ row }">
            <span
              style="cursor: pointer"
              @click="copy(row.productId, 'input', 'product id已复制')"
              >product_id:
              <span class="hover_color">{{ row.productId }}</span></span
            ><br />
            <span
              style="cursor: pointer"
              @click="copy(row.prodPSku, 'input', '商品父sku已复制')"
              >商品父sku:
              <span class="hover_color">{{ row.prodPSku }}</span></span
            >
          </template>
        </vxe-column>
        <vxe-column title="整改建议" field="violationSuggestion" width="220">
        </vxe-column>
        <vxe-column title="处置动作" field="enforcementType"></vxe-column>
        <vxe-column
          title="申诉截止时间"
          field="pronounceDeadline"
          width="150"
          sortable="true"
        ></vxe-column>
      </vxe-table>
    </el-card>
    <BatchUpdateTortWhite v-model="showTortWhiteDialog" />
  </div>
</template>

<script setup name="publishstiktokaccountperformance">
  /* eslint-disable */
  import { onMounted, reactive, ref, computed } from 'vue';
  // import ZCascader from '@/components/ZCascader/index.vue';
  import { transferDate } from '@/utils/common';
  import { getStoreList, shortcuts } from '@/api/common';
  import { listValidUserByRoleApi } from '@/api/publishs/tiktokstoremanage';
  import {
    initEnumApi,
    queryListApi,
    initPerformanceApi,
    querViolationListApi
  } from '@/api/publishs/tiktokaccountperformance';
  import { chatPrimary } from '@/styles/vars.module.scss';
  import { Top } from '@element-plus/icons-vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import CellInfo from './components/CellInfo.vue';
  import { transBlob } from '@/utils/downloadFile';
  import { ElMessage } from 'element-plus';
  import { copy } from '@/utils/common';
  import BatchUpdateTortWhite from './components/BatchUpdateTortWhite.vue';

  const activeKey = ref('1');

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
  // 枚举
  const enumList = reactive({
    queryTypeList: [{ value: '1', label: '罚分记录', count: 0 }]
  });
  const searchCardRef = ref(null);
  const formData = ref({});
  const initSelectData = reactive({
    recordStatusEnum: [],
    recordOrderByEnum: [],
    appealStatusEnum: [],
    phaseEnum: [],
    accountViolationTypeEnum: []
  });
  const ruleFormRef = ref();
  const gridOptions = reactive({
    border: true,
    showFooter: true,
    height: 200,
    columnConfig: {
      resizable: true
    },
    showOverflow: true,
    scrollY: { gt: 20, enabled: true },
    rowConfig: { isCurrent: true, isHover: true, keyField: 'id' },
    editConfig: {
      trigger: 'click',
      mode: 'cell'
    },
    sortConfig: {
      sortMethod: customSort
    },
    data: [],
    columns: [],
    footerMethod() {}
  });
  const tableDataRef = ref(null);
  const tableRecordsDataRef = ref(null);
  // 获取枚举值，将默认值选中
  onMounted(() => {
    Promise.all([getStoreList('tiktok'), initEnumApi()])
      .then((res) => {
        enumList.storeList = res[0].data?.children;
        const { accountIndicatorTypeEnum } = res[1].data;
        enumList.accountIndicatorTypeEnum = accountIndicatorTypeEnum;
        accountIndicatorTypeEnum.forEach((v) => {
          enumList[v.code] = v.explanation;
        });
        const columns = [
          {
            type: 'checkbox',
            width: 50
          },
          {
            field: 'storeAcct',
            title: '店铺',
            slots: { default: 'store_default' }
          },
          {
            field: 'salesperson',
            title: '销售',
            slots: { default: 'ssales_default' }
          },
          {
            field: 'syncTime',
            title: '更新时间',
            width: 230,
            slots: { default: 'syncTime_default' }
          },
          {
            field: 'totalViolationScore',
            title: '店铺总罚分',
            sortable: true,
            // sortMethod: customSort,
            titlePrefix: {
              message:
                '所有违规分都将在（得分之日起算）180个日历日后重置。若违规分累计达到48分或以上，卖家的电商权限将被永久撤销'
            },
            slots: { default: 'totalViolationScore_default' }
          },
          {
            title: '订单物流违规',
            headerAlign: 'center',
            children: [
              {
                field: 'orderFulfillmentViolationScore',
                title: '罚分',
                sortable: true,
                slots: {
                  default: 'order_fulfillment_violation_score'
                }
              },
              {
                field: 'computeShopLiableCancelRateBySellerS14dE8dValue',
                title: '商责订单取消率(<2.50%)',
                slots: {
                  default:
                    'compute_shop_liable_cancel_rate_by_seller_s14d_e8d_default'
                },
                titlePrefix: {
                  message:
                    enumList[
                      'compute_shop_liable_cancel_rate_by_seller_s14d_e8d'
                    ]
                },
                sortable: true
              },
              {
                field: 'computeNonFbtLateDispatchS7dE1dValue',
                title: '延迟履约率(<4.00%)',
                slots: {
                  default: 'compute_non_fbt_late_dispatch_s7d_e1d_default'
                },

                titlePrefix: {
                  message: enumList['compute_non_fbt_late_dispatch_s7d_e1d']
                },

                sortable: true
              }
            ]
          },
          {
            title: '服务指标违规',
            headerAlign: 'center',
            children: [
              {
                field: 'serviceIndicatorsViolationScore',
                title: '罚分',
                sortable: true,
                slots: {
                  default: 'service_indicators_violation_score'
                }
              },
              {
                field: 'sellerFaultNegativeReviewRateTempValue',
                title: '店铺商责差评率',
                slots: {
                  default: 'seller_fault_negative_review_rate_temp_default'
                },

                titlePrefix: {
                  message:
                    enumList[
                      'Seller_NRR.seller_fault_negative_review_rate_temp'
                    ]
                },
                sortable: true
              },
              {
                field: 'sellerServiceIssueNegativeReviewRateTempValue',
                title: '服务相关差评率(≤0.10%)',
                slots: {
                  default:
                    'seller_service_issue_negative_review_rate_temp_default'
                },

                titlePrefix: {
                  message:
                    enumList[
                      'Seller_NRR.seller_service_issue_negative_review_rate_temp'
                    ]
                },

                sortable: true
              },
              {
                field: 'computeShopLiableReturnRateBySellerS60dE30dValue',
                title: '商责退货/退款率(≤2.50%)',
                slots: {
                  default:
                    'compute_shop_liable_return_rate_by_seller_s60d_e30d_default'
                },

                titlePrefix: {
                  message:
                    enumList[
                      'compute_shop_liable_return_rate_by_seller_s60d_e30d'
                    ]
                },

                sortable: true
              }
            ]
          },
          {
            title: '合规底线',
            headerAlign: 'center',
            children: [
              {
                field: 'complianceBottomLineViolationScore',
                title: '罚分',
                sortable: true,
                slots: {
                  default: 'compliance_bottom_lineViolation_score'
                }
              },
              {
                field: 'shopViolationCntValue',
                title: '店铺违规(0)',
                slots: { default: 'shop_violation_cnt_default' },

                titlePrefix: { message: enumList['shop_violation_cnt'] },
                sortable: true
              },
              {
                field: 'productViolationCntValue',
                title: '商品违规(0)',
                slots: { default: 'product_violation_cnt_default' },

                titlePrefix: { message: enumList['product_violation_cnt'] },
                sortable: true
              }
            ]
          },
          {
            title: '其他违规',
            headerAlign: 'center',
            children: [
              {
                field: 'otherViolationScore',
                title: '罚分',
                sortable: true,
                slots: {
                  default: 'other_violation_score'
                }
              },
              {
                field: 'riskControlViolationCntValue',
                title: '风控违规(0)',
                slots: { default: 'risk_control_violation_cnt_default' },
                titlePrefix: {
                  message: enumList['risk_control_violation_cnt']
                },
                sortable: true
              }
            ]
          }
        ];
        gridOptions.columns = columns;
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
    getSaleLeaderList()
    // 初始化违规记录
    initPerformance();
  });

  // 获取table高度
  onMounted(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCardRef?.value?.$el?.clientHeight;
    gridOptions.height = clientHeight - 95 - searchCardHeight;
  });

  // 点击罚分单元格跳转违规记录
  const handleRowClick = ({ row, column }) => {
    if (column.field === 'totalViolationScore') {
      linkToRecordTab(row);
    }
    if (column.field === 'orderFulfillmentViolationScore') {
      linkToRecordTab(row, '订单物流违规');
    }
    if (column.field === 'serviceIndicatorsViolationScore') {
      linkToRecordTab(row, '服务指标违规');
    }
    if (column.field === 'complianceBottomLineViolationScore') {
      linkToRecordTab(row, '合规底线');
    }
    if (column.field === 'otherViolationScore') {
      linkToRecordTab(row, '其他违规');
    }
  };

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.value.totalViolationScoreMax = null;
    // 清空店铺
    if (activeKey.value === '1') {
      formData.value.storeScoreAcctId = [];
    }
    if (activeKey.value === '0') {
      formData.value.storeRecordAcctId = [];
    }
  };

  const violationScoreCount = ref(0);
  const handleSearch = async () => {
    if (activeKey.value === '0') {
      querViolationList();
    }
    if (activeKey.value === '1') {
      formData.value.storeAcctIdList = formData.value.storeScoreAcctId;
      try {
        const { data, count } = await queryListApi({ ...formData.value });
        gridOptions.data = data;
        violationScoreCount.value = count;
      } catch (err) {
        gridOptions.data = [];
      }
    }
  };
  // 切换 tab
  const tabIndex = ref(0);
  const handleClick = (tab) => {
    tabIndex.value = tab.index;
    if (tab.index === '1') {
      if (
        !formData.value.createTime ||
        formData.value.createTime?.length === 0
      ) {
        formData.value.createTime = [getOneMonthAgo(), getTodayDate()];
        // 清空店铺和违规类型
        formData.value.storeAcctIdList = [];
        formData.value.storeRecordAcctId = [];
        formData.value.violationTypeList = [];
      }
    }
  };

  const getOneMonthAgo = () => {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate(),
      0,
      0,
      0
    );
    return oneMonthAgo;
  };

  const getTodayDate = () => {
    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );
    return todayDate;
  };

    // 获取销售组长
    const saleLeaderList = ref([])
    const getSaleLeaderList = async () => {
    try {
      const { code, data } = await listValidUserByRoleApi({
        role: 'tiktok组长',
        platCode: 'tiktok'
      });
      if (code === '0000') {
        saleLeaderList.value = data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 罚分记录 罚分跳转到违规记录tab
  // 填充店铺 并且查询
  const linkToRecordTab = (row, type) => {
    let storeAcctId = row.storeAcctId;
    activeKey.value = '0';
    formData.value.storeAcctIdList = [storeAcctId];
    formData.value.storeRecordAcctId = [storeAcctId];
    formData.value.violationTypeList = type ? [type] : [];
    formData.value.createTime = [];
    handleSearch(ruleFormRef);
  };

  // 罚分记录导出
  let selectRecords = ref([]);
  const handleExportForm = async () => {
    if (activeKey.value === '1') {
      let params = { ...formData.value };
      selectRecords.value = tableDataRef.value.getCheckboxRecords();
      if (selectRecords.value.length > 0) {
        params.storeAcctIdList = selectRecords.value.map(
          (item) => item.storeAcctId
        );
      }
      transBlob({
        url: '/lms/tiktok/accountPerformance/export',
        contentType: 'application/json',
        data: params,
        fileName:
          'TikTok罚分记录' + transferDate(new Date().getTime(), true) + '.xls'
      }).finally(() => {
        ElMessage.success('下载成功');
      });
    }
    if (activeKey.value === '0') {
      exportRecordsList();
    }
  };

  // 将数组修改为key value 格式
  const formatSelectOption = (arr) => {
    let list = [];
    arr?.forEach((item) => {
      let obj = {
        label: item,
        value: item
      };
      list.push(obj);
    });
    return list;
  };

  // 违规记录筛选条件 初始化
  const initPerformance = async () => {
    try {
      const { code, data } = await initPerformanceApi();
      if (code === '0000') {
        initSelectData.recordStatusEnum = formatSelectOption(
          data.recordStatusEnum
        );
        initSelectData.recordOrderByEnum = formatSelectOption(
          data.recordOrderByEnum
        );
        initSelectData.appealStatusEnum = formatSelectOption(
          data.appealStatusEnum
        );
        initSelectData.phaseEnum = formatSelectOption(data.phaseEnum);
        initSelectData.accountViolationTypeEnum =
          data.accountViolationTypeEnum || [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  const recordsList = ref([]);
  // 违规记录查询参数
  const handleQueryParams = () => {
    formData.value.recordIdList = formData.value.recordIdStr
      ? formData.value.recordIdStr?.split(',')
      : [];
    formData.value.storeAcctIdList = formData.value.storeRecordAcctId;
    formData.value.platCreateTimeMin = '';
    formData.value.platCreateTimeMax = '';
    formData.value.pronounceDeadlineMin = '';
    formData.value.pronounceDeadlineMax = '';
    if (formData.value.createTime && formData.value.createTime.length != 0) {
      formData.value.platCreateTimeMax = Date.parse(
        formData.value.createTime[1]
      );
      formData.value.platCreateTimeMin = Date.parse(
        formData.value.createTime[0]
      );
    }
    if (
      formData.value.pronounceDeadline &&
      formData.value.pronounceDeadline.length != 0
    ) {
      formData.value.pronounceDeadlineMax = Date.parse(
        formData.value.pronounceDeadline[1]
      );
      formData.value.pronounceDeadlineMin = Date.parse(
        formData.value.pronounceDeadline[0]
      );
    }
    // formData.value.orderIdList = formData.value.orderIdStr
    //   ? formData.value.orderIdStr?.split(',')
    //   : [];
    formData.value.productIdList = formData.value.productIdStr
      ? formData.value.productIdStr?.split(',')
      : [];
    formData.value.prodPSkuList = formData.value.prodPSkuStr
      ? formData.value.prodPSkuStr?.split(',')
      : [];
    if (!formData.value.recordStatus) {
      delete formData.value.recordStatus;
    }
    if (!formData.value.phaseEnum) {
      delete formData.value.phaseEnum;
    }
  };

  // 违规记录查询
  const violationCount = ref(0);
  const querViolationList = async () => {
    handleQueryParams();
    try {
      const { code, data, count } = await querViolationListApi({
        ...formData.value
      });
      if (code === '0000') {
        recordsList.value = data || [];
        violationCount.value = count;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 违规记录导出
  const exportRecordsList = () => {
    handleQueryParams();
    let params = { ...formData.value };
    selectRecords.value = tableRecordsDataRef.value.getCheckboxRecords();
    if (selectRecords.value.length > 0) {
      params.recordIdList = selectRecords.value.map((item) => item.recordId);
    }
    transBlob({
      url: '/lms/tiktok/accountPerformance/exportViolationRecord',
      contentType: 'application/json',
      data: params,
      fileName:
        'TikTok违规记录' + transferDate(new Date().getTime(), true) + '.xls'
    }).finally(() => {
      ElMessage.success('下载成功');
    });
  };

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 230;
  });

  // 级联多选
  const filterCascader = (node, keyword) => {
    if (keyword) {
      const keywordList = keyword.replace('，', ',').split(',');
      const label = node?.label?.trim();
      const text = node?.text?.trim();
      const isIncludelabel = keywordList.some((item) =>
        label?.includes(item.trim())
      );
      const isIncludetext = keywordList.some((item) =>
        text?.includes(item.trim())
      );
      if (isIncludelabel || isIncludetext) {
        return node;
      }
    }
  };

  // 侵权白名单
  const showTortWhiteDialog = ref(false);
  const updateTortWhite = () => {
    showTortWhiteDialog.value = true;
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
  .store_tip {
    max-height: 200px;
    max-width: 200px;
  }
  .red_color {
    color: var(--chat-primary);
  }
  .orange_color {
    color: #fb9902;
  }
  .danger_color {
    color: #bb6528;
  }
  .hover_color:hover {
    color: rgb(64, 158, 255);
  }
  .ml10 {
    margin-left: 10px;
  }
  .hide_tag {
    :deep(.el-select__selected-item) {
      display: none;
    }
    :deep(.el-select__input) {
      margin-left: 78px;
    }
    :deep(.el-select__input.is-small) {
      margin-left: 65px;
    }
    :deep(.el-select__input.is-large) {
      margin-left: 85px;
    }
  }
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 10px;
      right: 20px;
      z-index: 200;
    }
  }
  :deep(.form_multi .el-input){
    width: 140px;
  }
</style>
