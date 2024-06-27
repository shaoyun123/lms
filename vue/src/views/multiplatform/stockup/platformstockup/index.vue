<template>
  <div class="app-container">
    <el-card ref="searchCardRef" class="temu_prod search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item label="平台" prop="platCode">
          <el-select
            v-model="formData.platCode"
            placeholder="请选择"
            clearable
            filterable
            @change="changePlatCode"
          >
            <el-option
              v-for="item in platCodeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺" prop="storeAcctIds">
          <z-cascader
            v-model="formData.storeAcctIds"
            :is-disabled="!formData.platCode"
            :placeholder="formData.platCode ? '' : '请先选择平台'"
            :data="storeList"
          ></z-cascader>
        </el-form-item>
        <el-form-item label="采购" prop="buyerIds">
          <el-select
            v-model="formData.buyerIds"
            placeholder="请选择"
            clearable
            filterable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
          >
            <el-option
              v-for="item in purchaseList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="formData.createTime"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            :shortcuts="shortcuts"
            range-separator="-"
            :default-time="defaultTime"
          />
        </el-form-item>
        <el-form-item prop="skuType">
          <el-select v-model="formData.skuType" class="form_left">
            <el-option :value="2" label="商品SKU" />
            <el-option :value="1" label="商品SKU精确" />
            <el-option :value="3" label="货品ID" />
          </el-select>
          <el-input
            v-model="formData.skuValues"
            class="form_right"
            placeholder="多个英文逗号隔开"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售备注" prop="salespersonRemark">
          <el-input v-model="formData.salespersonRemark" class="form_right" />
        </el-form-item>
        <el-form-item label="采购备注" prop="buyerRemark">
          <el-input v-model="formData.buyerRemark" class="form_right" />
        </el-form-item>
        <el-form-item label="排序" prop="orderByType">
          <el-select
            v-model="formData.orderByType"
            placeholder="排序"
            clearable
          >
            <el-option
              v-for="item in STOCK_UP_TYPE_STATUS"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据列表展示 -->
    <el-card class="card_position list_card">
      <div class="tools_btn">
        <el-button
          v-if="activeKey === 1"
          v-permission="['stockUpHandledownloadTemp']"
          type="primary"
          style="margin-right: 10px"
          @click="downloadTemp"
        >
          下载备货需求模板
        </el-button>
        <!-- 需要授权 -->
        <el-upload
          style="margin-right: 10px"
          :action="'/api/lms/PlatWh/PlatStockUpOrder/importOrderByExcel'"
          :on-success="importSuccess"
          :on-error="importError"
          :show-file-list="false"
        >
          <el-button
            v-if="activeKey === 1"
            v-permission="['stockUpImportOrderByExcel']"
            type="primary"
            >导入备货需求</el-button
          >
        </el-upload>
        <!-- <el-button type="primary" @click="downBarCode">导出条码</el-button> -->
        <el-button
          v-if="activeKey === 1"
          v-permission="['stockUpHandleBatchPurchaseConfirm']"
          type="primary"
          @click="handleBatchPurchaseConfirm({}, 0)"
          >批量采购确认</el-button
        >
        <el-button
          v-if="activeKey === 2"
          v-permission="['stockUpHandleBatchSellerConfirmPurchase']"
          type="primary"
          @click="handleBatchSellerConfirmPurchase({}, 0)"
          >批量确认采购</el-button
        >
        <el-button
          v-if="activeKey === 3"
          v-permission="['stockUpHandleBatchAllotPurchase']"
          type="primary"
          @click="handleBatchAllotPurchase({}, 0)"
          >批量调拨采购</el-button
        >
        <el-button
          v-if="[1, 2, 3].includes(activeKey)"
          v-permission="['stockUpHandleBatchCancelOrder']"
          @click="handleBatchCancelOrder({}, 0)"
          >批量取消</el-button
        >
        <el-button
          v-if="[5].includes(activeKey)"
          v-permission="['stockUpHandleBatchDelete']"
          type="danger"
          @click="handleBatchDelete({}, 0)"
          >批量删除</el-button
        >
        <el-button
          v-if="[5].includes(activeKey)"
          v-permission="['stockUpHandleBatchTransPurchase']"
          type="primary"
          @click="handleBatchTransPurchase({}, 0)"
          >批量转待采购确认</el-button
        >
        <el-button
          v-permission="['stockUpExportFn']"
          type="primary"
          @click="exportFn"
          >导出</el-button
        >
      </div>

      <el-tabs
        v-model="activeKey"
        type="card"
        class="demo-tabs"
        @tab-click="changeTab"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.status"
          :label="`${item.label}(${item.count})`"
          :name="item.status"
        >
        </el-tab-pane>
      </el-tabs>

      <div v-for="index in 1" :key="index">
        <vxe-table
          ref="tableDataRef"
          v-loading="loading"
          :data="tableData"
          header-align="center"
          :height="height"
          :row-config="{ keyField: 'prodSId' }"
          :scroll-y="{ enabled: false }"
          border
          :checkbox-config="{ reserve: true }"
          :column-config="{ resizable: true }"
        >
          <vxe-column type="checkbox" width="45" />
          <vxe-column title="SKU信息" field="prodSSku" width="180">
            <template #default="{ row }">
              <div>
                <div>{{ row.prodSSku }}</div>
                <div>
                  <span class="text-bold">开发：</span>{{ row.bizzOwner }}
                </div>
                <div><span class="text-bold">采购：</span>{{ row.buyer }}</div>
                <div>
                  <span class="text-bold">商品名称：</span>{{ row.title }}
                </div>
                <div><span class="text-bold">款式：</span>{{ row.style }}</div>
              </div>
            </template>
          </vxe-column>
          <vxe-column title="成本" field="purchaseCostPrice" width="100">
            <template #default="{ row }">
              <div>
                <div>商品成本:{{ row.purchaseCostPrice }}</div>
                <div>库存成本:{{ row.avgCost }}</div>
              </div>
            </template></vxe-column
          >
          <vxe-column title="默认供应商" field="supplierName" width="100">
            <template #default="{ row }">
              <div class="text-center">
                <el-link
                  type="primary"
                  :href="row.purchaseUrl"
                  target="_blank"
                  :underline="false"
                  >{{ row.supplierName }}</el-link
                >
              </div>
            </template>
          </vxe-column>
          <vxe-column title="备货仓库库存" width="100">
            <template #header>
              <div>
                <div>备货仓库</div>
                <div>备货仓库库存</div>
              </div>
            </template>
            <template #default="{ row }">
              <div>
                <div>{{ row.warehouseName }}</div>
                <div>
                  <span
                    >{{ getCount(row.availableStock) }}/{{
                      getCount(row.orderNotInNum)
                    }}/{{ getCount(row.lackUnPaiNum) }}</span
                  >
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column>
            <template #header>
              <div class="flex">
                <div style="width: 40px"></div>
                <div class="table_thead">平台</div>
                <div class="table_thead">店铺</div>
                <div class="table_thead">销售</div>
                <div class="table_thead">货品id</div>
                <div class="table_thead">需要发货数量</div>
                <div style="width: 68px">
                  需要采购数量<el-icon v-if="activeKey === 1"
                    ><EditPen
                  /></el-icon>
                </div>
                <div style="width: 65px">
                  备货天数<el-icon v-if="activeKey === 1"><EditPen /></el-icon>
                </div>
                <div class="table_thead">
                  目标价格(￥)<el-icon v-if="activeKey === 1"
                    ><EditPen
                  /></el-icon>
                </div>
                <div class="table_thead">压价后价格(￥)</div>
                <div style="width: 40px">是否包邮</div>
                <div class="table_thead">预计到货时间</div>
                <div v-if="activeKey === 4" style="width: 100px">
                  采购单号<br />调拨单号
                </div>
                <div style="width: 120px">
                  <el-icon><EditPen /></el-icon>销售备注
                </div>
                <div style="width: 120px">
                  <el-icon><EditPen /></el-icon>采购备注
                </div>
                <div style="width: 120px">创建时间/创建人</div>
                <div :style="{ width: activeKey === 5 ? '140px' : '100px' }">
                  操作
                </div>
              </div>
            </template>
            <template #default="{ row }">
              <vxe-table
                ref="innerTableRef"
                :data="
                  row.detailList && row.detailList.slice(0, row.displayCount)
                "
                :checkbox-config="{ reserve: true, enabled: false }"
                :row-config="{ keyField: 'id' }"
                :show-header="false"
                @cell-dblclick="handleCellDblClick"
              >
                <vxe-column type="checkbox" width="40" />
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div class="flex-center">
                      <div>{{ sonRow.platCode }}</div>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>
                      <span>{{ sonRow.storeAcct }}</span>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>{{ sonRow.salesperson }}</div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>{{ sonRow.item_id }}</div>
                  </template>
                </vxe-column>
                <vxe-column field="shippedQuantity">
                  <template #default="{ row: sonRow }">
                    <div>{{ sonRow.shippedQuantity }}</div>
                  </template>
                </vxe-column>
                <vxe-column field="inventoryQuantity" width="68">
                  <template #default="{ row: sonRow }">
                    <el-input
                      v-if="sonRow.inventoryQuantityShow && activeKey === 1"
                      ref="inventoryQuantityRef"
                      v-model="sonRow.inventoryQuantity"
                      type="number"
                      autofocus
                      @blur="handleCellUpdateBlur(sonRow, 'inventoryQuantity')"
                    />
                    <span v-else>{{ sonRow.inventoryQuantity }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="inventoryDay" width="65">
                  <template #default="{ row: sonRow }">
                    <el-input
                      v-if="sonRow.inventoryDayShow && activeKey === 1"
                      ref="inventoryDayRef"
                      v-model="sonRow.inventoryDay"
                      type="number"
                      autofocus
                      @blur="handleCellUpdateBlur(sonRow, 'inventoryDay')"
                    />
                    <span v-else>{{ sonRow.inventoryDay }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="targetPrice">
                  <template #default="{ row: sonRow }">
                    <el-input
                      v-if="sonRow.targetPriceShow && activeKey === 1"
                      ref="targetPriceRef"
                      v-model="sonRow.targetPrice"
                      type="number"
                      autofocus
                      @blur="handleCellUpdateBlur(sonRow, 'targetPrice')"
                    />
                    <span v-else>{{ sonRow.targetPrice }}</span>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>{{ sonRow.forcePrice }}</div>
                  </template>
                </vxe-column>
                <vxe-column width="40">
                  <template #default="{ row: sonRow }">
                    <div>
                      <span v-if="sonRow.freeShip === 1">是</span>
                      <span v-if="sonRow.freeShip === 0">否</span>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column>
                  <template #default="{ row: sonRow }">
                    <div>
                      <div>
                        {{ sonRow.predictAogTime }}
                      </div>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column v-if="activeKey === 4" width="100">
                  <template #default="{ row: sonRow }">
                    <div>
                      <div
                        @click="
                          toJumpMenuPage('/purchases/purchases/purchaseOrder')
                        "
                      >
                        <el-link
                          :underline="false"
                          type="primary"
                          class="mb-10"
                          >{{ sonRow.purNo }}</el-link
                        >
                      </div>
                      <div
                        @click="
                          toJumpMenuPage('/warehouse/houselist/transferOrder')
                        "
                      >
                        <el-link :underline="false" type="primary">
                          {{ sonRow.transferNo }}</el-link
                        >
                      </div>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column field="salespersonRemark" width="120">
                  <template #default="{ row: sonRow }">
                    <el-input
                      v-if="sonRow.salespersonRemarkShow"
                      ref="salespersonRemarkRef"
                      v-model="sonRow.salespersonRemark"
                      type="textarea"
                      class="w-full"
                      :rows="4"
                      maxlength="200"
                      autofocus
                      @blur="handleCellUpdateBlur(sonRow, 'salespersonRemark')"
                    />
                    <span v-else>{{ sonRow.salespersonRemark }}</span>
                  </template>
                </vxe-column>
                <vxe-column field="buyerRemark" width="120">
                  <template #default="{ row: sonRow }">
                    <el-input
                      v-if="sonRow.buyerRemarkShow"
                      ref="buyerRemarkRef"
                      v-model="sonRow.buyerRemark"
                      class="w-full"
                      :rows="4"
                      type="textarea"
                      maxlength="200"
                      autofocus
                      @blur="handleCellUpdateBlur(sonRow, 'buyerRemark')"
                    />
                    <span v-else>{{ sonRow.buyerRemark }}</span>
                  </template>
                </vxe-column>
                <vxe-column width="120">
                  <template #default="{ row: sonRow }">
                    <div>
                      <p>创建时间: {{ transferDate(sonRow.createTime) }}</p>
                      <p>创建人: {{ sonRow.creator }}</p>
                    </div>
                  </template>
                </vxe-column>
                <vxe-column :width="activeKey === 5 ? 140 : 100" fixed="right">
                  <template #default="{ row: sonRow }">
                    <el-button
                      v-if="activeKey === 1"
                      v-permission="['stockUpHandleBatchPurchaseConfirm']"
                      type="primary"
                      @click="handleBatchPurchaseConfirm(row, 1)"
                      >采购确认</el-button
                    >
                    <el-button
                      v-if="activeKey === 2"
                      v-permission="['stockUpHandleBatchSellerConfirmPurchase']"
                      type="primary"
                      @click="handleBatchSellerConfirmPurchase(sonRow, 1)"
                      >确认采购</el-button
                    >
                    <el-button
                      v-if="activeKey === 3"
                      v-permission="['stockUpHandleBatchAllotPurchase']"
                      type="primary"
                      @click="handleBatchAllotPurchase(sonRow, 1)"
                      >调拨采购</el-button
                    >
                    <el-button
                      v-if="activeKey === 5"
                      v-permission="['stockUpHandleBatchTransPurchase']"
                      type="primary"
                      @click="handleBatchTransPurchase(sonRow, 1)"
                      >转待采购待确认</el-button
                    >
                    <el-button
                      v-if="[1, 2, 3].includes(activeKey)"
                      v-permission="['stockUpHandleBatchCancelOrder']"
                      @click="handleBatchCancelOrder(sonRow, 1)"
                      >取消</el-button
                    >
                    <el-button type="primary" @click="handleShowLog(sonRow)"
                      >日志</el-button
                    >
                    <el-button
                      v-if="activeKey === 5"
                      v-permission="['stockUpHandleBatchDelete']"
                      type="danger"
                      @click="handleBatchDelete(sonRow, 1)"
                      >删除</el-button
                    >
                  </template>
                </vxe-column>
              </vxe-table>
              <span
                v-if="row.detailList"
                :class="[row.detailList.length <= 3 ? 'hideBtn' : '']"
                @click="row.displayCount > 3 ? hideList(row) : viewAll(row)"
              >
                <a
                  v-if="row.detailList"
                  style="color: #409eff; text-align: center; cursor: pointer"
                  >{{ row.displayCount > 3 ? '收起' : '展开所有' }}</a
                >
              </span>
            </template>
          </vxe-column>
        </vxe-table>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="formData.pageNum"
            v-model:page-size="formData.pageSize"
            background
            :page-sizes="[50, 100, 500]"
            layout="prev, pager, next,sizes, total"
            :total="total"
            :small="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
    <!-- 采购确认 -->
    <PurchaseConfirm
      v-if="showPurchaseConfirm"
      :show-dialog="showPurchaseConfirm"
      :checked-list="checkedList"
      @close="closePurchaseConfirm"
      @success="buyerConfirmSuccess"
    />
    <!-- 日志 -->
    <PurchaseLog
      v-if="showLog"
      :show-dialog="showLog"
      :log-table-data="logTableData"
      @close="closeLog"
    />
    <!-- 销售取消采购单 -->
    <BatchCancelPurchase
      v-if="showCancelPurchase"
      :show-dialog="showCancelPurchase"
      :cancel-order-id-list="cancelOrderIdList"
      @close="closeCancelPurchase"
      @success="cancelPurchaseSuccess"
    />
    <!-- 调拨采购 -->
    <BatchAllotPurchase
      v-if="showAllotPurchase"
      :show-dialog="showAllotPurchase"
      :checked-allot-id-list="checkedAllotIdList"
      :checked-stock-warehouse="checkedStockWarehouse"
      @close="closeAllotPurchase"
      @done="allotPurchaseSuccess"
    />
    <!-- 转代采购确认 -->
    <TransPurchaseConfirm
      v-if="showTransPurchase"
      :show-dialog="showTransPurchase"
      :checked-list="checkedSList"
      @close="closeTransPurchase"
      @success="transPurchaseSuccess"
    />
  </div>
</template>

<script setup name="multiplatformstockupplatformstockup">
  import { onMounted, reactive, ref } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { STOCK_UP_TYPE_STATUS } from './constants.js';
  import { shortcuts } from '@/api/common';
  import { getStoreList } from '@/api/common';
  import { transBlob } from '@/utils/downloadFile';
  import { transferDate } from '@/utils/common';
  import PurchaseConfirm from './component/PurchaseConfirm.vue';
  import PurchaseLog from './component/PurchaseLog.vue';
  import BatchCancelPurchase from './component/BatchCancelPurchase.vue';
  import BatchAllotPurchase from './component/BatchAllotPurchase.vue';
  import TransPurchaseConfirm from './component/TransPurchaseConfirm.vue';
  import { getSysUserList } from '@/api/multiplatform/aesupportprod';
  // import { exportBarCodePDF } from '@/api/multiplatform/aesupportprod';
  // import FileSaver from 'file-saver';
  // import JSZip from 'jszip';
  // import { getImgArrayBuffer } from '@/utils/downloadFile';
  import { cloneDeep } from 'lodash-es';
  import {
    getSupportPlatApi,
    getSearchTabCountApi,
    searchPageApi,
    platStockUpOrderLogApi,
    salespersonConfirmApi,
    deleteOrderApi,
    updateOrderApi
  } from '@/api/multiplatform/platformstockup';
  import { useRouter } from 'vue-router';

  // 表单ref
  const formRef = ref();

  const formData = reactive({
    platCode: '',
    storeAcctIds: [],
    buyerIds: [],
    skuType: 2,
    skuValues: '', // 用户输入的sku
    skuList: [],
    salespersonRemark: '', // 销售备注
    buyerRemark: '', // 采购备注
    orderByType: 1, // 排序
    pageNum: 1,
    pageSize: 100,
    createTime: [],
    createTimeStart: '',
    createTimeEnd: ''
  });

  const defaultTime = [
    new Date(0, 0, 0, 0, 0, 0),
    new Date(0, 0, 0, 23, 59, 59)
  ];

  const height = ref(400);
  const searchCardRef = ref();

  onMounted(async () => {
    const searchCardHeight = searchCardRef.value.$el.clientHeight;
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    height.value = clientHeight - searchCardHeight - 160;
    getPlatList();
    getPurchaseList();
    getTabCount();
  });

  const tabList = ref([
    { label: '待采购确认', count: '', status: 1, index: 0 },
    { label: '待销售确认', count: '', status: 2, index: 1 },
    { label: '确认采购', count: '', status: 3, index: 2 },
    { label: '已建采购单', count: '', status: 4, index: 3 },
    { label: '取消采购', count: '', status: 5, index: 4 }
  ]);

  const activeKey = ref(1);
  const tabIndex = ref(0);
  const total = ref(0);

  // 获取平台
  const platCodeList = ref([]);
  const getPlatList = async () => {
    const { data } = await getSupportPlatApi();
    platCodeList.value = data;
  };

  // 切换平台
  const changePlatCode = (val) => {
    formData.platCode = val;
    formData.storeAcctIds = [];
    if (val) {
      getStoreListFn();
    }
  };

  // 获取店铺数据
  const storeList = ref([]);
  const getStoreListFn = async () => {
    const { data } = await getStoreList(formData.platCode);
    storeList.value = data?.children || [];
  };

  // 获取采购数据
  const purchaseList = ref([]);
  const getPurchaseList = async () => {
    const { data } = await getSysUserList();
    purchaseList.value = data.purchasingAgentList;
  };

  // 查询不同状态tab的数量
  const countList = ref([]);
  const getTabCount = async () => {
    formatFormData();
    const { code, data } = await getSearchTabCountApi({
      ...formData,
      orderState: activeKey.value
    });
    if (code === '0000') {
      countList.value = data;
      handleTabsCount();
    }
  };

  // 处理tab的数量
  const handleTabsCount = () => {
    tabList.value.forEach((item) => {
      item.count = 0;
      countList.value.forEach((cItem) => {
        if (item.status == cItem.orderState) {
          item.count = cItem.detailCount;
        }
      });
    });
  };

  // 格式化日期
  const formatFormData = () => {
    if (formData.createTime.length) {
      [formData.createTimeStart, formData.createTimeEnd] = formData.createTime;
    } else {
      formData.createTimeStart = '';
      formData.createTimeEnd = '';
    }
    if (formData.skuValues) {
      formData.skuList = formData.skuValues.split(',');
    } else {
      formData.skuList = [];
    }
  };

  // 获取列表
  const loading = ref(false);
  const tableData = ref([]);
  const tableDataRef = ref(null);
  const loadData = async () => {
    loading.value = true;
    getTabCount();
    formatFormData();

    const { code, data } = await searchPageApi({
      ...formData,
      orderState: activeKey.value
    }).finally(() => {
      loading.value = false;
      // 清空勾选
      clearTableCheckedStatus();
    });
    total.value = 0;
    if (code == '0000' && data?.list && data?.list?.length !== 0) {
      tableData.value = data.list.map(({ detailList, ...item }) => ({
        ...item,
        displayCount: 3,
        detailList: detailList.map((detailItem) => ({
          ...detailItem,
          inventoryQuantityShow: false,
          inventoryDayShow: false,
          targetPriceShow: false,
          salespersonRemarkShow: false,
          buyerRemarkShow: false,
          targetPriceOld: detailItem.targetPrice || '',
          inventoryQuantityOld: detailItem.inventoryQuantity || '',
          inventoryDayOld: detailItem.inventoryDay || '',
          salespersonRemarkOld: detailItem.salespersonRemark || '',
          buyerRemarkOld: detailItem.buyerRemark || ''
        }))
      }));
      total.value = data.total;
    } else {
      tableData.value = [];
      total.value = 0;
    }
  };

  // 清空勾选
  const clearTableCheckedStatus = () => {
    tableDataRef.value &&
      tableDataRef.value.forEach((item) => {
        item.clearCheckboxRow();
      });
    innerTableRef.value &&
      innerTableRef.value.forEach((item) => {
        item.clearCheckboxRow();
      });
  };

  // 清空
  const resetForm = function () {
    formRef.value.resetFields();
    formData.skuValues = '';
  };

  // 切换 tab
  const changeTab = (tab) => {
    activeKey.value = Number(tab.props.name);
    tabIndex.value = Number(tab.index);
    formData.pageNum = 1;
    handleTabsCount();
    loadData();
  };

  const handleSizeChange = (val) => {
    formData.pageSize = val;
    loadData();
  };

  const handleCurrentChange = (val) => {
    formData.pageNum = val;
    loadData();
  };

  const getCount = function (count) {
    if (count == undefined) {
      return '-';
    } else {
      return count;
    }
  };

  // 双击单元格修改
  const buyerRemarkRef = ref(null);
  const salespersonRemarkRef = ref(null);
  const targetPriceRef = ref(null);
  const inventoryDayRef = ref(null);
  const inventoryQuantityRef = ref(null);

  const handleCellDblClick = (params) => {
    const { row, column } = params;
    // 判断点击的单元格
    const needEditFieldArr = [
      'buyerRemark',
      'salespersonRemark',
      'targetPrice',
      'inventoryDay',
      'inventoryQuantity'
    ];
    needEditFieldArr.forEach((field) => {
      if (column.field === field) {
        row[field + 'Show'] = true;
      } else {
        row[field + 'Show'] = false;
      }
    });
  };

  // 封装不同字段修改提示文字/保留小数位
  const initFieldNumber = (row, field, fixNumber, errorMessage) => {
    if (
      !row[field] ||
      Number(row[field]) <= 0 ||
      Number(row[field]).toFixed(fixNumber) <= 0
    ) {
      row[field] = row[field + 'Old'];
      row[field + 'Show'] = false;
      ElMessage.warning(errorMessage);
      return { result: 2 };
    } else {
      return { result: 1, number: Number(row[field]).toFixed(fixNumber) };
    }
  };

  // 双击单元格编辑失去焦点
  const handleCellUpdateBlur = async (row, field) => {
    // 验证
    // inventoryQuantity采购数量：正整数
    // inventoryDay备货天数 >0 最多保留一位
    // targetPrice 目标价格 >0 最多保留两位

    // 销售备注 salespersonRemark
    // 采购备注 buyerRemark
    let res = {};
    if (field === 'inventoryQuantity') {
      res = initFieldNumber(
        row,
        field,
        0,
        '采购数量仅支持正整数，请重新填写！'
      );
    } else if (field === 'inventoryDay') {
      res = initFieldNumber(
        row,
        field,
        1,
        '备货天数仅支持 > 0的数字，请重新填写！'
      );
    } else if (field === 'targetPrice') {
      res = initFieldNumber(
        row,
        field,
        2,
        '目标价格仅支持 > 0的数字，请重新填写！'
      );
    }
    if (res.result === 1) {
      row[field] = res.number;
    } else if (res.result === 2) {
      return;
    }
    try {
      const { code, msg } = await updateOrderApi(row);
      if (code === '0000') {
        row[field + 'Old'] = row[field];
        ElMessage.success(msg);
      } else {
        row[field] = row[field + 'Old'];
        ElMessage.warning(msg);
      }
      row[field + 'Show'] = false;
    } catch (err) {
      // 接口权限报错 那就将值回到未修改的原值
      row[field + 'Show'] = false;
      row[field] = row[field + 'Old'];
      console.log('error :>> ', err);
    }
  };

  // 获取所有子表格选中的数据
  const innerTableRef = ref(null);
  const getAllSonCheckedData = () => {
    let selectArr = [];
    innerTableRef.value.forEach((item) => {
      if (item.getCheckboxRecords().length) {
        selectArr = selectArr.concat(item.getCheckboxRecords());
      }
    });
    return selectArr;
  };

  // 获取父表格选中的数据
  const getAllPCheckedData = () => {
    let selectPArr = []; // 选中的父级中所有的子级

    tableDataRef.value.forEach((item) => {
      if (item.getCheckboxRecords().length) {
        selectPArr = selectPArr.concat(item.getCheckboxRecords());
      }
    });
    return selectPArr;
  };

  // 计算最终选中的 数据
  const judgeData = () => {
    let selectPList = getAllPCheckedData();
    let selectSList = getAllSonCheckedData();
    // 首先是统计勾选的父级 把勾选的里面所有的子都取出来
    // 如果存在子级 的父级 没有被勾选 应该合并

    let resultList = cloneDeep(selectPList);

    // 如果选择了子节点
    if (selectSList?.length) {
      // 对子节点进行遍历
      selectSList.forEach((item) => {
        const checkedIndex = selectPList.findIndex(
          (prod) => prod.prodSId === item.prodSId
        );
        if (checkedIndex > -1) return;

        const resultIndex = resultList.findIndex(
          (prod) => prod.prodSId === item.prodSId
        );
        if (resultIndex > -1) {
          resultList[resultIndex].detailList.push(item);
          return;
        }

        const prodIndex = tableData.value.findIndex(
          (prod) => prod.prodSId === item.prodSId
        );
        if (prodIndex > -1) {
          const pItem = cloneDeep(tableData.value[prodIndex]);
          pItem.detailList = [item];
          resultList.push(pItem);
        }
      });
    }
    return resultList;
  };

  // 下载备货模板
  const downloadTemp = () => {
    loading.value = true;
    let form = new FormData();
    transBlob(
      {
        url: '/lms/PlatWh/PlatStockUpOrder/downloadExcelTemplat',
        data: form,
        fileName: '备货需求模板' + '.xls'
      },
      'get'
    ).finally(() => {
      loading.value = false;
    });
  };

  // 导入备货需求
  const importList = ref([]);
  const importTempLoading = ref(false);
  const importSuccess = (res) => {
    if (res.code == '0000') {
      importTempLoading.value = true;
      importList.value = res.data || [];
      ElMessage.success('导入备货需求成功！');
      loadData();
    } else {
      importTempLoading.value = false;
      ElMessageBox.confirm(res.msg || '导入备货需求失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
  };

  const importError = () => {
    ElMessage.error('导入备货需求失败！');
  };

  // 采购确认
  const checkedList = ref([]);
  const showPurchaseConfirm = ref(false);
  const handleBatchPurchaseConfirm = (row, type) => {
    let checkedTableList = [];
    // type 0 批量 1单项
    if (type) {
      checkedTableList = [row];
    } else {
      checkedTableList = judgeData();
      if (!checkedTableList.length) {
        return ElMessage.warning('请选择数据！');
      }
    }

    // 需要采购数量 ---所有子级数量相加 inventoryQuantity
    // 目标价格 --- 所有子级去最低价格 purchaseCostPrice
    checkedList.value = checkedTableList.map((item) => {
      const inventoryQuantities = item.detailList
        .filter((detail) => detail.inventoryQuantity !== undefined)
        .map((detail) => detail.inventoryQuantity);

      const targetPrices = item.detailList
        .filter((detail) => detail.targetPrice !== undefined)
        .map((detail) => detail.targetPrice);

      const inventoryQuantitySum = inventoryQuantities.reduce(
        (sum, quantity) => sum + quantity,
        0
      );
      const targetPriceMin = Math.min(...targetPrices);

      return {
        ...item,
        inventoryQuantity: inventoryQuantitySum,
        targetPrice: targetPriceMin
      };
    });

    showPurchaseConfirm.value = true;
  };

  // 采购确认成功
  const buyerConfirmSuccess = () => {
    showPurchaseConfirm.value = false;
    loadData();
  };

  // 关闭采购确认弹窗
  const closePurchaseConfirm = () => {
    showPurchaseConfirm.value = false;
  };

  // 销售 确认采购
  const checkedIdList = ref([]);
  const handleBatchSellerConfirmPurchase = async (row, type) => {
    // type 0 批量 1单项
    if (type) {
      checkedIdList.value = [row.id];
    } else {
      const checkedList = judgeData();
      if (!checkedList.length) {
        return ElMessage.warning('请选择数据！');
      }
      checkedIdList.value = checkedList
        .map((item) => item.detailList.map((detail) => detail.id))
        .flat();
    }
    const { code, msg } = await salespersonConfirmApi(checkedIdList.value);
    if (code === '0000') {
      ElMessage.success(msg);
      loadData();
    } else {
      ElMessage.warning(msg);
    }
  };

  // 调拨采购
  const checkedAllotIdList = ref([]);
  const showAllotPurchase = ref(false);
  const checkedStockWarehouse = ref('');
  const handleBatchAllotPurchase = (row, type) => {
    // type 0 批量 1单项
    if (type) {
      checkedAllotIdList.value = [row.id];
      // 勾选为同一个仓库 弹窗回显
      checkedStockWarehouse.value = row.warehouseName;
    } else {
      const checkedList = judgeData();
      if (!checkedList.length) {
        return ElMessage.warning('请选择数据！');
      }
      // 勾选为同一个仓库 弹窗回显
      const warehouseNameList = [
        ...new Set(checkedList.map((item) => item.warehouseName))
      ];
      if (warehouseNameList.length === 1) {
        checkedStockWarehouse.value = warehouseNameList[0];
      } else {
        checkedStockWarehouse.value = '';
      }
      // 获取子集选中的id
      checkedAllotIdList.value = checkedList
        .map((item) => item.detailList.map((detail) => detail.id))
        .flat();
    }
    showAllotPurchase.value = true;
  };

  // 调拨采购成功
  const allotPurchaseSuccess = () => {
    showAllotPurchase.value = false;
    loadData();
  };

  // 关闭挑拨采购
  const closeAllotPurchase = () => {
    showAllotPurchase.value = false;
  };

  // 转代采购待确认
  const checkedSList = ref([]);
  const showTransPurchase = ref(false);
  const handleBatchTransPurchase = (row, type) => {
    // type 0 批量 1单项
    if (type) {
      checkedSList.value = [row];
    } else {
      const checkedList = judgeData();
      if (!checkedList.length) {
        return ElMessage.warning('请选择数据！');
      }
      // 获取所有选中的子集
      checkedSList.value = checkedList.flatMap((item) => item.detailList);
    }
    showTransPurchase.value = true;
  };

  // 转代采购成功
  const transPurchaseSuccess = () => {
    showTransPurchase.value = false;
    loadData();
  };

  // 关闭转代采购待确认
  const closeTransPurchase = () => {
    showTransPurchase.value = false;
  };

  // 取消采购
  const cancelOrderIdList = ref([]);
  const showCancelPurchase = ref(false);
  const handleBatchCancelOrder = (row, type) => {
    // type: 批量0 单个1
    if (type) {
      cancelOrderIdList.value = [row.id];
    } else {
      const checkedList = judgeData();
      if (!checkedList.length) {
        return ElMessage.warning('请选择数据！');
      }

      cancelOrderIdList.value = checkedList
        .map((item) => item.detailList.map((detail) => detail.id))
        .flat();
    }
    showCancelPurchase.value = true;
  };

  // 批量取消成功
  const cancelPurchaseSuccess = () => {
    showCancelPurchase.value = false;
    loadData();
  };

  // 关闭批量取消弹窗
  const closeCancelPurchase = () => {
    showCancelPurchase.value = false;
  };

  // 导出(默认列表所有 有勾选导出勾选)
  const exportFn = async () => {
    formatFormData();
    const checkedList = judgeData();
    const orderIdObj = {};

    orderIdObj.orderIds = checkedList
      .map((item) => item.detailList.map((detail) => detail.id))
      .flat();
    loading.value = true;

    transBlob({
      url: '/lms/PlatWh/PlatStockUpOrder/exportExcel',
      data: {
        ...formData,
        ...orderIdObj,
        orderState: activeKey.value
      },
      fileName: '平台仓备货导出' + '.xls'
    }).finally(() => {
      loading.value = false;
    });
  };

  // 日志
  const logTableData = ref([]);
  const showLog = ref(false);
  const handleShowLog = async (row) => {
    showLog.value = true;
    const { data } = await platStockUpOrderLogApi({
      orderId: row.id,
      page: {
        pageNum: 1,
        pageSize: 5000
      }
    });
    logTableData.value = data?.list;
  };

  const closeLog = () => {
    showLog.value = false;
  };

  // 删除
  const handleBatchDelete = async (row, type) => {
    // 0 批量 1单项
    const checkedList = type ? [row] : judgeData();
    if (!type && !checkedList.length) {
      return ElMessage.warning('请选择数据！');
    }
    const paramsList = type
      ? checkedList.map((item) => item.id)
      : checkedList
          .map((item) => item.detailList.map((detail) => detail.id))
          .flat();

    await ElMessageBox.confirm('确认删除吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const { code, msg } = await deleteOrderApi(paramsList);
    if (code === '0000') {
      ElMessage.success(msg);
      loadData();
    } else {
      ElMessage.warning(msg);
    }
  };

  const router = useRouter();
  // 跳转至采购订单/调拨单页面
  const toJumpMenuPage = (pageKey) => {
    router.push(pageKey);
  };

  // 展开
  const viewAll = (row) => {
    row.displayCount = row.detailList.length;
  };

  // 收起
  const hideList = (row) => {
    row.displayCount = 3;
  };
</script>
<style lang="scss" scoped>
  .card_position {
    position: relative;
    .tools_btn {
      display: flex;
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 99;
    }
  }
  .w-full {
    width: 100%;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .table_thead {
    text-align: center;
    flex: 1;
  }
  .flex-end {
    display: flex;
    justify-content: end;
  }
  .text-bold {
    font-weight: bold;
  }
  .text-center {
    text-align: center;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
</style>
<style lang="scss">
  :deep(.vxe-header--row .col--last .vxe-cell span) {
    width: 100%;
    display: flex;
    box-sizing: border-box;
    padding: 0 5px;
  }
</style>
