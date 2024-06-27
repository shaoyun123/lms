<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      width="75%"
      :align-center="true"
      @close="handleClose"
    >
      <el-card>
        <el-form
          ref="formRef"
          :inline="true"
          :model="formData"
          class="search_form"
        >
          <el-form-item prop="skuType">
            <el-select v-model="formData.skuType" class="form_left" filterable>
              <el-option :value="2" label="商品子SKU" />
              <el-option :value="3" label="商品父SKU" />
            </el-select>
            <el-input
              v-model="formData.skus"
              clearable
              class="form_right"
              placeholder="精确搜索,支持多个逗号隔开"
            />
          </el-form-item>
          <el-form-item label="部门" prop="orgId" class="label-width">
            <el-tree-select
              v-model="formData.orgId"
              placeholder="请选择"
              :data="selectData.departData"
              check-strictly
              :props="defaultProps"
              :render-after-expand="false"
              :empty-text="'No matching Data'"
              clearable
              filterable
              class="tree_select"
              @node-click="handleNodeClick"
              @clear="clearDepart"
            />
          </el-form-item>
          <el-form-item label="销售" prop="salesPersonId" class="label-width">
            <el-select
              v-model="formData.salesPersonId"
              placeholder="请选择"
              clearable
              filterable
              style="width: 150px"
              @change="changeSalers"
              @clear="resetSearch"
            >
              <el-option
                v-for="item in selectData.salersData"
                :key="item.id"
                :label="item.user_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺" prop="storeAcctIds" class="label-width">
            <el-select
              v-model="formData.storeAcctIds"
              :class="formData.storeAcctIds.length > 1 ? 'hideTag' : ''"
              placeholder="请选择"
              multiple
              filterable
              collapse-tags
              clearable
            >
              <template #prefix>
                <el-tag v-if="formData.storeAcctIds.length > 1" type="info"
                  >已选{{ formData.storeAcctIds.length }}项</el-tag
                >
              </template>
              <el-option
                v-for="item in selectData.storeData"
                :key="item.id"
                :label="item.storeAcct"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeKey !== 4"
            class="form_range"
            prop="salesCountType"
          >
            <el-select v-model="formData.salesCountType" class="form_left">
              <el-option value="1" label="7天销量" />
              <el-option value="2" label="30天销量" />
              <el-option value="3" label="60天销量" />
              <el-option value="4" label="90天销量" />
              <el-option value="5" label="180天销量" />
            </el-select>
            <el-input
              v-model="formData.minSalesCount"
              clearable
              placeholder=">="
            />
            <el-input
              v-model="formData.maxSalesCount"
              clearable
              placeholder="<="
            />
          </el-form-item>
          <el-form-item prop="profitStart" class="form_range" label="利润(￥)">
            <ZInputNumber
              v-model="formData.profitStart"
              style="width: 50px"
              placeholder=">="
              clearable
              :precision="2"
            />
            <div class="range_link">-</div>
            <ZInputNumber
              v-model="formData.profitEnd"
              style="width: 50px"
              placeholder="<="
              clearable
              :precision="2"
            />
          </el-form-item>
          <el-form-item
            prop="profitRateStartStr"
            class="form_range"
            label="利润率"
          >
            <ZInputNumber
              v-model="formData.profitRateStartStr"
              style="width: 50px"
              placeholder=">="
              clearable
              :precision="2"
            />
            <div class="range_link">-</div>
            <ZInputNumber
              v-model="formData.profitRateEndStr"
              style="width: 50px"
              placeholder="<="
              clearable
              :precision="2"
            />
          </el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <el-button @click="handleResetForm()">清空</el-button>
        </el-form>
      </el-card>
      <el-card class="list_card">
        <el-tabs v-model="activeName" @tab-click="handleSearch()">
          <el-tab-pane :label="tabLabel" name="first">
            <vxe-table
              ref="tableRef"
              :data="tableData"
              :height="500"
              :loading="tableLoading"
              border
              :row-config="{ isCurrent: true, isHover: true }"
              :column-config="{ resizable: true }"
            >
              <vxe-column v-if="activeKey === 1" type="checkbox" width="40" />
              <vxe-column v-if="activeKey === 4" width="40">
                <template #header>
                  <el-checkbox
                    v-model="isAllSelected"
                    @change="toggleAllCheckboxEvent"
                  >
                  </el-checkbox>
                </template>
                <template #default="{ row }">
                  <el-checkbox
                    v-model="row.isCheckbox"
                    @change="toggleCheckboxEvent(row)"
                  >
                  </el-checkbox>
                </template>
              </vxe-column>
              <vxe-column field="storeAcct" title="店铺"> </vxe-column>
              <vxe-column field="itemId" title="item_id" width="120" />
              <vxe-column field="storeSSku" title="店铺子SKU"> </vxe-column>
              <vxe-column field="prodSSku" title="商品子SKU" />
              <vxe-column
                v-if="activeKey !== 4"
                field="grossProfitRate"
                title="
                 7/30/60/90/180天销量
                "
                width="200"
              >
                <template #default="{ row }">
                  {{ row.sevenSale || '-' }}/{{ row.thirtySale || '-' }}/{{
                    row.sixtySale || '-'
                  }}/{{ row.ninetySale || '-' }}/{{
                    row.oneHundredAndEightySale || '-'
                  }}
                </template>
              </vxe-column>
              <vxe-column field="oldPrice" width="120" title="当前价格">
                <template #default="{ row }">
                  <div>
                    <span v-if="row.currencyCode === 'USD'">*</span>$：
                    <span>{{ row.oldPriceUSD }}</span>
                  </div>
                  <div>
                    <span v-if="row.currencyCode !== 'USD'">*</span>￥：
                    <span>{{ row.oldPriceCNY }}</span>
                  </div>
                </template>
              </vxe-column>
              <vxe-column field="oldPrice" width="120" title="利润(￥)/利润率">
                <template #default="{ row }">
                  <div>
                    <span>{{ row.profit || '-' }}</span
                    >/
                    <span>{{ row.profitRateStr || '-' }}</span>
                  </div>
                </template>
              </vxe-column>
              <vxe-column field="newPrice" title="新价格" width="120">
                <template #default="{ row }">
                  <div class="flex">
                    <span v-if="row.currencyCode === 'USD'">*</span>$：
                    <vxe-input
                      v-model="row.newPriceUSD"
                      class="w80"
                      @input="handleChangeNewPriceUsd($event, row)"
                    ></vxe-input>
                  </div>
                  <div class="flex mt-10">
                    <span v-if="row.currencyCode !== 'USD'">*</span>￥：
                    <vxe-input
                      v-model="row.newPriceCNY"
                      class="w80"
                      @input="handleChangeNewPriceCny($event, row)"
                    ></vxe-input>
                  </div>
                </template>
              </vxe-column>
              <vxe-column
                field="diffRate"
                title="差值幅度"
                width="140"
                :title-help="{
                  message: '（新价格-当前价格）/当前价格'
                }"
                :filters="[{}]"
                :filter-method="filterRange"
                :filter-reset-method="filterResetRange"
              >
                <template #default="{ row }">
                  {{ ((row.diffRate || 0) * 100).toFixed(0) }}%
                </template>
                <template #filter="{ column, $panel }">
                  <div
                    v-for="(option, index) in column.filters"
                    :key="index"
                    class="disflex_between m10"
                  >
                    <ZInputNumber
                      v-model="option.min"
                      :precision="2"
                      placeholder=">="
                      class="w80"
                      @input="$panel.changeOption($event, true, option)"
                    /><span>%</span>
                    <ZInputNumber
                      v-model="option.max"
                      :precision="2"
                      placeholder="<="
                      class="w80 ml10"
                      @input="$panel.changeOption($event, true, option)"
                    /><span>%</span>
                  </div>
                </template>
              </vxe-column>
              <vxe-column field="result" title="操作结果" width="180">
                <template #default="{ row }">
                  <div :class="getResultClass(row.result)">
                    {{ getResultMsg(row) }}
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </el-tab-pane>
        </el-tabs>
        <div
          style="
            position: absolute;
            top: 10px;
            left: 100px;
            width: 660px;
            display: flex;
          "
        >
          <el-form-item>
            <el-select v-model="formData.sel1" style="width: 100px" clearable>
              <el-option value="USD" label="新价格($)=" />
              <el-option value="CNY" label="新价格(￥)=" />
            </el-select>
            <el-select v-model="formData.sel2" style="width: 90px" clearable>
              <el-option :value="0" label="当前价格" />
              <el-option :value="1" label="新价格" />
            </el-select>
            <el-select v-model="formData.sel3" style="width: 50px" clearable>
              <el-option value="+" label="+" />
              <el-option value="-" label="-" />
              <el-option value="*" label="*" />
              <el-option value="/" label="/" />
            </el-select>
            <el-input
              v-model="formData.writeNum"
              style="width: 100px"
              clearable
            />
          </el-form-item>
          <el-button type="primary" style="margin: 0 10px" @click="apply">
            一键应用
          </el-button>
          <el-form-item label="毛利率" prop="gross" style="width: 150px">
            <ZInputNumber
              v-model="formData.gross"
              :min="0"
              :max="1"
              :precision="2"
              placeholder="填写小数, 0.3"
            />
          </el-form-item>
          <el-button type="primary" style="margin: 0 10px" @click="fixPrice">
            定价
          </el-button>
        </div>
        <div class="common_batch_btns">
          <el-button
            :loading="submitLoading"
            type="primary"
            @click="handleBatchPriceadjust"
          >
            批量调价
          </el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, reactive, ref, nextTick, watch } from 'vue';
  import {
    batchGetPriceInfoApi,
    batchModifyPriceApi,
    getModifyResultApi
  } from '@/api/publishs/aehalfhosted';
  import { getDepartData, getStoreInfo } from '@/api/eBay/payments';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { ElMessage } from 'element-plus';
  import { calculateBasicOperator } from '@/utils/common';
  import { cloneDeep } from 'lodash-es';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    selectRecords: {
      type: Array,
      default: () => []
    },
    storeTreeList: {
      type: Array,
      default: () => []
    },
    activeKey: {
      type: Number,
      default: () => null
    },
    joinedProductTabList: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['update:modelValue']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        needFresh.value = false;
        handleResetForm();
        handleResetBatch();
        const idList = props.selectRecords.map((item) => item.productId);
        // 已加入/可预约tab添加参数
        const tabObj =
          props.activeKey === 3
            ? {}
            : { joinedProductTabList: props.joinedProductTabList };

        tableLoading.value = true;
        const { data } = await batchGetPriceInfoApi({
          itemIds: idList,
          platCode: 'AE半托管',
          ...tabObj
        }).finally(() => {
          tableLoading.value = false;
        });
        tableData.value = data?.map(({ halfManagePrice, ...rest }) => ({
          ...rest,
          ...halfManagePrice,
          isCheckbox: false
        }));

        totalCount.value = data.length;
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
        tableRef.value.clearFilter();
        needFresh.value = false;
        clearTimeout(timerId.value);
      }
      // 销售
      getDepartmentList();
      // 店铺
      getStoreList();
    }
  );

  const title = ref('修改价格');
  const formData = ref({
    skus: '',
    oldSkusList: [],
    skuType: 2,
    salesCountType: '1',
    storeAcctIds: [],
    sel1: 'USD',
    sel2: 0,
    sel3: '-',
    minSalesCount: null,
    maxSalesCount: null,
    orgId: '',
    gross: '',
    salesPersonId: '',
    writeNum: null, // 加减乘除多少
    profitStart: '', // 利润
    profitEnd: '',
    profitRateStartStr: '', // 利润率
    profitRateEndStr: ''
  });

  const tableData = ref();
  const needFresh = ref(false);

  // #region 搜索
  const formRef = ref();
  const handleResetForm = () => {
    formRef.value.resetFields();
    formData.value.skus = '';
    formData.value.oldSkusList = [];
    formData.value.saleGreat = '';
    formData.value.saleLess = '';
    formData.value.salesCountType = '1';
    formData.value.maxSalesCount = null;
    formData.value.minSalesCount = null;
    formData.value.profitEnd = null;
    formData.value.profitRateEndStr = null;
  };

  const handleResetBatch = () => {
    formData.value.sel1 = 'USD';
    formData.value.sel2 = 0;
    formData.value.sel3 = '-';
    formData.value.writeNum = null;
  };

  const totalCount = ref(0);
  const activeName = ref('first');
  const tabLabel = computed(() => `总数(${totalCount.value})`);

  // 清空表格勾选
  const clearTableChecked = () => {
    tableData.value.map((item) => {
      return (item.isCheckbox = false);
    });
  };

  const tableLoading = ref(false);

  // 查询
  const handleSearch = async () => {
    clearTableChecked();
    if (!formData.value.skus || formData.value.skus === '') {
      ElMessage.warning('输入sku，才可以查询');
      return false;
    } else {
      formData.value.oldSkusList = cloneDeep(formData.value.skus);
      formData.value.oldSkusList = formData.value.oldSkusList
        .split(',')
        .filter((item) => item !== '');
    }
    formData.value.gross = '';
    const idList = props.selectRecords.map((item) => item.productId);

    // 已加入/可预约tab添加参数
    const tabObj =
      props.activeKey === 3
        ? {}
        : { joinedProductTabList: props.joinedProductTabList };

    tableLoading.value = true;
    try {
      const { data } = await batchGetPriceInfoApi({
        itemIds: idList,
        ...formData.value,
        skus: formData.value.oldSkusList,
        platCode: 'AE半托管',
        ...tabObj
      }).finally(() => {
        tableLoading.value = false;
      });

      tableData.value = data?.map(({ halfManagePrice, ...rest }) => ({
        ...rest,
        ...halfManagePrice,
        checkbox: false
      }));
      totalCount.value = data.length;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // #endregion
  const tableRef = ref();

  const isAllSelected = ref(false);

  const toggleAllCheckboxEvent = (val) => {
    tableData.value.forEach((row) => {
      row.isCheckbox = val;
    });
  };

  const toggleCheckboxEvent = (row) => {
    if (props.activeKey === 4) {
      tableData.value
        .filter((item) => item.itemId === row.itemId)
        .forEach((item) => {
          item.isCheckbox = row.isCheckbox;
        });
    }
    isAllSelected.value = !tableData.value.filter((item) => !item.isCheckbox)
      .length;
  };

  // 改变美元价格
  const handleChangeNewPriceUsd = (e, row) => {
    if (row.newPriceUSD == '') {
      row.diffRate = 0;
    } else {
      // 都要区分当前是哪个币种
      row.newPriceCNY = (Number(e.value || 0) * row.usdRate).toFixed(2);
      if (row.currencyCode === 'USD') {
        row.diffRate =
          (Number(row.newPriceUSD) * 1 - Number(row.oldPriceUSD) * 1) /
          Number(row.oldPriceUSD);
      } else {
        row.diffRate =
          (Number(row.newPriceCNY) * 1 - Number(row.oldPriceCNY) * 1) /
          Number(row.oldPriceCNY);
      }
    }
  };

  // 改变人民币价格
  const handleChangeNewPriceCny = (e, row) => {
    if (row.newPriceCNY == '') {
      row.diffRate = 0;
    } else {
      // 都要区分当前是哪个币种
      row.newPriceUSD = (Number(e.value || 0) / row.usdRate).toFixed(2);
      if (row.currencyCode === 'USD') {
        row.diffRate =
          (Number(row.newPriceUSD) * 1 - Number(row.oldPriceUSD) * 1) /
          Number(row.oldPriceUSD);
      } else {
        row.diffRate =
          (Number(row.newPriceCNY) * 1 - Number(row.oldPriceCNY) * 1) /
          Number(row.oldPriceCNY);
      }
    }
  };
  // #region 差价筛选
  // 差值幅度筛选项
  const filterRange = ({ option, cellValue }) => {
    // 差值幅度默认返回的是小数
    const cellNewValue = ((cellValue || 0) * 100).toFixed(0);
    const { min, max } = option;
    if ([null, undefined].includes(min)) {
      if (cellNewValue <= max) {
        return true;
      }
    } else if ([null, undefined].includes(max)) {
      if (cellNewValue >= min) {
        return true;
      }
    } else if (
      ![null, undefined].includes(min) &&
      ![null, undefined].includes(max)
    ) {
      if (cellNewValue <= max && cellNewValue >= min) {
        return true;
      }
    }
    return false;
  };
  const filterResetRange = ({ options }) => {
    options[0].min = null;
    options[0].max = null;
  };

  const submitLoading = ref(false);
  // #region 操作 批量调价
  const timerId = ref(null);
  const handleBatchPriceadjust = async () => {
    let reqs = [];
    if (props.activeKey === 1) {
      reqs = tableRef.value.getCheckboxRecords();
    }
    if (props.activeKey === 4) {
      reqs = tableData.value.filter((item) => item.isCheckbox);
    }
    if (!reqs.length) return ElMessage.warning('请选择要处理的数据！');
    let isNull = false;
    reqs.forEach((item) => {
      if (!item.newPriceUSD || item.newPriceUSD * 1 <= 0) {
        isNull = true;
      }
    });
    if (isNull) {
      return ElMessage.warning('新价格必填且值必须>0！');
    }
    const arr = reqs.map((obj) => {
      const {
        oldPriceCNY,
        newPriceCNY,
        oldPriceUSD,
        newPriceUSD,
        currencyCode,
        usdRate,
        ...rest
      } = obj;
      const halfManagePrice = {
        oldPriceCNY,
        newPriceCNY,
        oldPriceUSD,
        newPriceUSD,
        currencyCode,
        usdRate
      };
      return { ...rest, halfManagePrice };
    });
    submitLoading.value = true;
    try {
      const { code, data } = await batchModifyPriceApi({
        checkedList: arr,
        platCode: 'AE半托管'
      });

      if (code == '0000') {
        needFresh.value = true;
        timerId.value = setInterval(() => {
          getOperateResult(data);
        }, 1000);
      }
    } catch (err) {
      ElMessage.error(err || '提交队列失败');
      submitLoading.value = false;
    }
  };

  // 查询操作结果
  const getOperateResult = async (batchNo) => {
    const { data } = await getModifyResultApi({
      platCode: 'AE半托管',
      batchNo: batchNo
    });
    data.forEach((item) => {
      const index = tableData.value.findIndex(
        (el) => el.variationId === item.variationId
      );
      if (index > -1) {
        tableData.value[index].result = item.operResult;
        tableData.value[index].desc = item.desc || '';
      }
    });
    const isEnd = data.every((item) => {
      return item.operResult !== 0;
    });
    if (isEnd) {
      clearTimeout(timerId.value);
      submitLoading.value = false;
    }
  };

  const getResultMsg = (row) => {
    if (row.result === 0) return '修改中...';
    if (row.result === 1) return '修改成功';
    if (row.result === -1) return `修改失败 ${row.desc}`;
  };

  const getResultClass = (result) => {
    if (result === 0) return '';
    if (result === 1) return 'color_success';
    if (result === -1) return 'color_error';
  };
  // #endregion 操作
  //  一键应用
  const originVal = ref(null);
  const newVal = ref(null);
  const apply = () => {
    let reqs = [];
    if (props.activeKey === 1) {
      reqs = tableRef.value.getCheckboxRecords();
    }
    if (props.activeKey === 4) {
      reqs = tableData.value.filter((item) => item.isCheckbox);
    }
    if (!formData.value.writeNum || formData.value.writeNum == '') {
      ElMessage.warning('请输入数据');
      return false;
    }
    if (reqs.length === 0) {
      ElMessage.warning('请选择要处理的数据');
      return false;
    }

    // sel2====>0：当前价格oldPrice；1：新价格newPrice
    // sel3====>+-*/
    if (formData.value.sel1 === '') {
      return ElMessage.warning('请选择新价格($)或者新价格(￥)!');
    }
    if (
      formData.value.sel2 &&
      !formData.value.sel3 &&
      !formData.value.sel2 &&
      formData.value.sel3
    ) {
      return ElMessage.warning('请选择下拉数据！');
    }

    reqs.forEach((item) => {
      if (formData.value.sel2 === '' && formData.value.sel3 === '') {
        newVal.value = Number(formData.value.writeNum).toFixed(2);
      } else {
        // 0 下拉框选择了旧价格
        if (!formData.value.sel2) {
          originVal.value = item['oldPrice' + formData.value.sel1] || 0;
        } else {
          originVal.value = item['newPrice' + formData.value.sel1] || 0;
        }
        newVal.value = calculateBasicOperator(
          formData.value.sel3,
          Number(formData.value.writeNum),
          Number(originVal.value)
        ).toFixed(2);
      }
      item['newPrice' + formData.value.sel1] = newVal.value;
      switch (formData.value.sel1) {
        case 'USD':
          handleChangeNewPriceUsd({ value: newVal.value }, item);
          break;
        case 'CNY':
          handleChangeNewPriceCny({ value: newVal.value }, item);
          break;
      }
      item.diffRate =
        (Number(item['newPrice' + formData.value.sel1]) -
          Number(item['oldPrice' + formData.value.sel1])) /
        Number(item['oldPrice' + formData.value.sel1]);
    });
  };
  //   定价
  const fixPrice = async () => {
    let reqs = [];
    if (props.activeKey === 1) {
      reqs = tableRef.value.getCheckboxRecords();
    }
    if (props.activeKey === 4) {
      reqs = tableData.value.filter((item) => item.isCheckbox);
    }
    if (!formData.value.gross || formData.value.gross == '') {
      ElMessage.warning('请填写毛利率！');
      return false;
    }
    if (reqs.length == 0) {
      ElMessage.warning('请选择要处理的数据');
      return false;
    }
    const idList = props.selectRecords.map((item) => item.productId);
    // 已加入/可预约tab添加参数
    const tabObj =
      props.activeKey === 3
        ? {}
        : { joinedProductTabList: props.joinedProductTabList };

    const assignGrossVariationIds = reqs.map((item) => item.variationId);

    const { data } = await batchGetPriceInfoApi({
      itemIds: idList,
      gross: formData.value.gross,
      platCode: 'AE半托管',
      assignGrossVariationIds,
      ...tabObj
    });

    data.forEach((item) => {
      const index = tableData.value.findIndex(
        (el) => el.variationId === item.variationId
      );
      if (index > -1) {
        tableData.value[index].diffRate = item.diffRate;
        tableData.value[index].newPriceCNY = item.halfManagePrice.newPriceCNY;
        tableData.value[index].newPriceUSD = item.halfManagePrice.newPriceUSD;
      }
    });
    formData.value.gross = '';
  };

  // 部门和销售人员数据
  const selectData = reactive({
    departData: [],
    salersData: [],
    storeData: []
  });
  const salersDataCopy = ref([]);
  const defaultProps = {
    children: 'childOrgList',
    label: 'name',
    value: 'id'
  };

  // 获取部门以及销售人员信息
  const getDepartmentList = async () => {
    let params = {
      roleNames: 'smt专员'
    };
    const { data } = await getDepartData(params);
    selectData.departData = data.orgTree;
    selectData.salersData = data.userList;
    salersDataCopy.value = data.userList;
  };

  // 获取店铺信息
  const getStoreList = async () => {
    let params = {
      roleNames: 'smt专员',
      orgId: formData.value.orgId,
      salesPersonId: formData.value.salesPersonId,
      platCode: 'AE半托管'
    };
    const { data } = await getStoreInfo(params);
    selectData.storeData = data;
  };

  // 点击部门节点
  const handleNodeClick = (data) => {
    let selectId = data.id;
    selectData.salersData = salersDataCopy.value.filter(
      (item) => item.org_id === selectId
    );
    resetSearch();
    nextTick(() => {
      getStoreList();
    });
  };

  // 切换销售
  const changeSalers = () => {
    formData.value.storeAcctIds = [];
    getStoreList();
  };

  // 清空部门选择
  const clearDepart = () => {
    selectData.salersData = salersDataCopy.value;
    formData.value.orgId = '';
    resetSearch();
  };

  // 清空销售人员以及店铺
  const resetSearch = () => {
    formData.value.salesPersonId = '';
    formData.value.storeAcctIds = [];
    getStoreList();
  };
  //  部门-销售员-店铺联动 -- end

  const handleClose = () => {
    handleResetForm();
    handleResetBatch();
    clearDepart();
    submitLoading.value = false;
    tableLoading.value = false;
  };
</script>
<style lang="scss" scoped>
  .disflex_between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .w80 {
    width: 80px;
  }
  .m10 {
    margin: 10px;
  }
  .mt-10 {
    margin-top: 10px;
  }
  .ml-4 {
    margin-left: 4px;
  }
  .color_success {
    color: #67c23a;
  }
  .color_error {
    color: #f56c6c;
  }
  .tree_select {
    width: 150px;
  }
</style>
