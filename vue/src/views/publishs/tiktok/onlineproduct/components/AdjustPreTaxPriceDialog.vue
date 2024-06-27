<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="调整税前价"
      width="70%"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          ref="formRef"
          :model="formData"
          :inline="true"
          class="adjustPreTax_form"
        >
          <el-row align="middle">
            <el-col :span="12"
              ><el-form-item prop="searchList">
                <el-select
                  v-model="formData.searchType"
                  class="form_left"
                  filterable
                  style="width: 120px"
                >
                  <el-option value="sellerSkuList" label="seller_sku" />
                  <el-option value="skuIdList" label="shop_sku_id" />
                </el-select>
                <el-input
                  v-model="formData.searchList"
                  clearable
                  class="form_right"
                  placeholder="精确搜索,支持多个逗号隔开"
                  @blur="commonDivideComma($event)"
                /> </el-form-item
            ></el-col>
            <el-col :span="8"
              ><el-form-item label="店铺" prop="storeAcctIdList">
                <!-- <el-select
                  v-model="formData.storeAcctIdList"
                  filterable
                  :class="
                    formData?.storeAcctIdList?.length > 1 ? 'hide_tag' : ''
                  "
                  clearable
                  multiple
                  placeholder="请选择"
                >
                  <template #prefix>
                    <el-tag
                      v-if="formData?.storeAcctIdList?.length > 1"
                      type="info"
                      >已选{{ formData?.storeAcctIdList?.length }}项</el-tag
                    >
                  </template>
                  <el-option
                    v-for="item in storeList"
                    :key="item.id"
                    :label="item.storeAcct"
                    :value="item.id"
                  />
                </el-select>  -->
                <ZSelect
                  v-model="formData.storeAcctIdList"
                  :items="searchShopOption"
                  :num="2"
                /> </el-form-item
            ></el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                :loading="tableDataLoading"
                @click="handleSearch"
                >查询</el-button
              >
              <el-button @click="handleResetForm(formRef)"
                >清空</el-button
              ></el-col
            >
          </el-row>
        </el-form>
      </div>
      <div v-loading="tableDataLoading">
        <div class="disflex_between mb10">
          <div>数量({{ totalCount }})</div>
          <div>
            毛利率
            <el-input-number
              v-model="grossfit"
              placeholder="填写小数，例如0.3"
              controls-position="right"
            />
            <el-button
              type="primary"
              :loading="grossfitLoading"
              @click="handleApplyByGrossfit"
              >一键应用</el-button
            >
          </div>
          <div class="disflex">
            <div class="w100">
              <el-select v-model="calculate.taxPriceType">
                <el-option value="old" label="税前价" />
                <el-option value="new" label="新税前价" />
              </el-select>
            </div>
            <div class="w50">
              <el-select v-model="calculate.operateType">
                <el-option value="+">+</el-option>
                <el-option value="-">-</el-option>
                <el-option value="*">*</el-option>
                <el-option value="=">=</el-option>
              </el-select>
            </div>
            <el-input-number
              v-model="calculate.price"
              :precision="2"
              placeholder="请输入"
              controls-position="right"
            />
            <el-button type="primary" @click="handleApplyByCalculate"
              >一键应用</el-button
            >
          </div>
          <el-button
            type="primary"
            :loading="batchAdjustLoading"
            @click="handleBatchAdjust"
            >批量调整</el-button
          >
        </div>
        <vxe-table
          ref="tableRef"
          :data="tableData"
          :height="600"
          border
          :edit-rules="validRules"
          :row-config="{ isCurrent: true, isHover: true }"
          :column-config="{ resizable: true }"
        >
          <vxe-column type="checkbox" width="40" />
          <vxe-column field="productId" title="product_id" />
          <vxe-column field="skuId" title="shop_sku_id" />
          <vxe-column
            field="sellerSku"
            title="seller_sku"
            width="120"
            :filters="[{}]"
            :filter-method="filterShopAndSku"
            :filter-reset-method="filterResetShopAndSku"
          >
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <ZSelectPanel
                  v-model="option.data"
                  :items="sellerSkuListOption"
                  @change="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
            <template #default="{ row }">
              {{ row.sellerSku }}
              <el-tag v-if="row.salesStatus === false" type="danger">停</el-tag>
            </template>
          </vxe-column>
          <vxe-column
            field="storeAcct"
            title="店铺名称"
            :filters="[{}]"
            :filter-method="filterShopAndSku"
            :filter-reset-method="filterResetShopAndSku"
          >
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <ZSelectPanel
                  v-model="option.data"
                  :items="shopListOption"
                  @change="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
          </vxe-column>

          <vxe-column
            field="grossProfitRate"
            title="毛利率(店铺)"
            width="100"
          />
          <vxe-column
            field="minListingPrice"
            title="最低定价"
            :title-help="{ message: '定价公式中配置的所有公式计算值的最小值' }"
            :filters="[{}]"
            :filter-method="filterRange"
            :filter-reset-method="filterResetRange"
          >
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="disflex_between m10"
              >
                <ZInputNumber
                  v-model="option.min"
                  placeholder=">="
                  class="w80"
                  :precision="2"
                  @input="$panel.changeOption($event, true, option)"
                />
                <ZInputNumber
                  v-model="option.max"
                  placeholder="<="
                  class="w80 ml10"
                  :precision="2"
                  @input="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
          </vxe-column>
          <vxe-column field="originalPrice" title="税前价" width="100" />
          <vxe-column field="newOriginalPrice" title="新税前价">
            <template #default="{ row }">
              <vxe-input
                v-model="row.newOriginalPrice"
                placeholder="请输入"
                type="float"
                min="0"
                @change="handleChangeNewPrice(row)"
              ></vxe-input>
            </template>
          </vxe-column>
          <vxe-column
            field="differOriginalPrice"
            title="差值"
            :title-help="{ message: '差值 = 新税前价 - 税前价' }"
            :filters="originalPriceOptions"
            :filter-method="filterOriginalPrice"
          >
          </vxe-column>
          <vxe-column
            field="differenceAmplitude"
            title="差价幅度"
            :title-help="{
              message:
                '差价幅度=（新税前价-税前价）/税前价；显示为无小数点的百分数'
            }"
            :filters="[{}]"
            :filter-method="filterRange"
            :filter-reset-method="filterResetRange"
          >
            <template #default="{ row }">
              {{ row.differenceAmplitude || 0 }}%
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
          <vxe-column field="result" title="操作结果" width="100">
            <template #default="{ row }">
              <div v-if="row.success" class="color_success">
                <ExpandText :text="row.result" />
              </div>
              <div v-else class="color_error">
                <ExpandText :text="row.result" />
              </div>
            </template>
          </vxe-column>
        </vxe-table>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="paginationData.page"
            v-model:page-size="paginationData.limit"
            background
            :page-sizes="[5000, 10000, 20000]"
            :small="true"
            layout="total, sizes, prev, pager, next"
            :total="paginationData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, reactive, onMounted } from 'vue';
  import { commonDivideComma } from '@/utils/divide';
  import { ElMessage } from 'element-plus';
  import { handleResetResult, calculateBasicOperator } from '../config';
  import {
    queryAndComputePriceApi,
    batchAdjustOriginPriceApi,
    searchResultApi
  } from '@/api/publishs/tiktokonlineproduct';
  import ExpandText from '@/components/ExpandText.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ZSelectPanel from '@/components/ZSelectPanel/index.vue';
  import ZSelect from '@/components/ZSelect/index.vue';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Object,
      default: () => {}
    },
    storeList: {
      type: Array,
      default: () => []
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const formData = reactive({
    searchType: 'sellerSkuList'
  });
  const formRef = ref();
  const tableData = ref([]);
  const tableRef = ref();
  const totalCount = ref();
  const paginationData = reactive({
    total: 0,
    limit: 5000,
    page: 1
  });
  const calculate = ref({ operateType: '+', taxPriceType: 'old' });
  const needFresh = ref(false);
  let timer = null; //计时器

  const tableDataLoading = ref(false);
  const shopListOption = ref([]); // 表头店铺筛选下拉枚举
  const sellerSkuListOption = ref([]); // 表头seller_sku下拉枚举
  const searchShopOption = ref([]);

  onMounted(() => {
    searchShopOption.value = props.storeList.map((item) => {
      return {
        id: item.id,
        name: item.storeAcct,
        salesSite: item.salesSite
      };
    });
    formData.searchList = props.rowCheckedList
      .map((item) => item.skuList.map((elem) => elem.sellerSku))
      .flat(Infinity);
    const _storeAcctIdList = props.rowCheckedList.map(
      (item) => item.storeAcctId
    );
    formData.storeAcctIdList = Array.from(new Set(_storeAcctIdList));

    handleSearch('id');
  });

  const handleSearch = async (type) => {
    let obj = {};
    if (type === 'id') {
      obj.idList = props.rowCheckedList
        .map((item) => item.skuList.map((elem) => elem.id))
        .flat(Infinity)
        .join();
    } else {
      obj[formData.searchType] = Array.isArray(formData.searchList)
        ? formData.searchList?.join(',')
        : formData.searchList;
    }
    obj.storeAcctIdList = formData.storeAcctIdList?.join(',');
    if (tableRef.value) {
      tableRef.value
        .getColumnByField('differOriginalPrice')
        .filters.forEach((v) => {
          v.checked = false;
        });
    }
    try {
      tableDataLoading.value = true;
      const { limit, page } = paginationData;
      const { data, count } = await queryAndComputePriceApi({
        limit,
        page,
        ...obj
      });
      paginationData.total = count;
      tableData.value = data.map((v) => ({
        ...v,
        differOriginalPrice: (
          Number(v.newOriginalPrice || 0) - v.originalPrice
        ).toFixed(2)
      }));

      shopListOption.value = [
        ...new Set(tableData.value.map((item) => item.storeAcct))
      ].map((v) => ({ id: v, name: v }));
      sellerSkuListOption.value = [
        ...new Set(tableData.value.map((item) => item.sellerSku))
      ].map((v) => ({ id: v, name: v }));

      totalCount.value = count;
    } catch (err) {
      paginationData.total = 0;
      tableData.value = [];
      totalCount.value = 0;
    } finally {
      tableDataLoading.value = false;
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

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    formData.searchType = 'sellerSkuList';
    formData.searchList = null;
    formData.storeAcctIdList = [];
  };
  const validRules = ref({
    newOriginalPrice: [{ required: true, message: '请填写' }]
  });

  const handleChangeNewPrice = (row) => {
    handleResetResult(row);
    row.differOriginalPrice = (
      row.newOriginalPrice - row.originalPrice
    ).toFixed(2);
    row.differenceAmplitude = (
      ((row.newOriginalPrice - row.originalPrice) / row.originalPrice).toFixed(
        2
      ) * 100
    ).toFixed(0);
  };

  // 毛利率计算出新税前价
  const grossfit = ref();
  const grossfitLoading = ref(false);
  const handleApplyByGrossfit = async () => {
    if (grossfit.value !== 0 && !grossfit.value)
      return ElMessage.warning('请输入毛利率');
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    try {
      grossfitLoading.value = true;
      const { limit, page } = paginationData;
      const { data } = await queryAndComputePriceApi({
        limit,
        page,
        idList: checkedList.map((item) => item.id).join(),
        storeAcctIdList: checkedList.map((item) => item.storeAcctId).join(),
        grossProfitRate: grossfit.value
      });
      let obj = {};
      data.forEach((item) => {
        obj[item.id] = item.newOriginalPrice;
      });
      checkedList.forEach((item) => {
        if (obj[item.id]) {
          item.newOriginalPrice = obj[item.id];
          item.grossProfitRate = grossfit.value;
          item.differOriginalPrice = (
            obj[item.id] - item.originalPrice
          ).toFixed(2);
          item.differenceAmplitude = (
            (
              (item.newOriginalPrice - item.originalPrice) /
              item.originalPrice
            ).toFixed(2) * 100
          ).toFixed(0);
        }
      });
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      grossfitLoading.value = false;
    }
  };

  // 运算符计算出新税前价
  const handleApplyByCalculate = async () => {
    const { operateType, taxPriceType, price } = calculate.value;
    if (price !== 0 && !price) return ElMessage.warning('请选择数据');
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    checkedList.forEach((item) => {
      let originVal = item.originalPrice;
      if (taxPriceType === 'new') {
        originVal = item.newOriginalPrice;
      }
      item.newOriginalPrice = calculateBasicOperator(
        operateType,
        price,
        Number(originVal || 0)
      ).toFixed(2);
      item.differOriginalPrice = (
        item.newOriginalPrice - item.originalPrice
      ).toFixed(2);
      item.differenceAmplitude = (
        (
          (item.newOriginalPrice - item.originalPrice) /
          item.originalPrice
        ).toFixed(2) * 100
      ).toFixed(0);
    });
  };

  // #region 差价筛选
  // 差价筛选项
  const originalPriceOptions = [
    { label: '>0', value: 1 },
    { label: '<0', value: -1 },
    { label: '=0', value: 0 }
  ];
  const filterOriginalPrice = ({ option, row }) => {
    if (option.value === 1 && row.differOriginalPrice > 0) {
      return true;
    } else if (option.value === -1 && row.differOriginalPrice < 0) {
      return true;
    } else if (option.value === 0 && row.differOriginalPrice == 0) {
      return true;
    }
  };

  const filterRange = ({ option, cellValue }) => {
    const { min, max } = option;
    if ([null, undefined].includes(min)) {
      if (cellValue <= max) {
        return true;
      }
    } else if ([null, undefined].includes(max)) {
      if (cellValue >= min) {
        return true;
      }
    } else if (
      ![null, undefined].includes(min) &&
      ![null, undefined].includes(max)
    ) {
      if (cellValue <= max && cellValue >= min) {
        return true;
      }
    }
    return false;
  };
  const filterResetRange = ({ options }) => {
    options[0].min = null;
    options[0].max = null;
  };
  // #endregion 差价筛选

  // 店铺以及sku表头筛选
  const filterShopAndSku = ({ option, cellValue }) => {
    if (option.data && option.data.length && option.data.includes(cellValue)) {
      return true;
    }

    return false;
  };

  // 店铺以及sku表头筛选重置
  const filterResetShopAndSku = ({ options }) => {
    options[0].data = [];
  };

  // 批量调整
  const batchAdjustLoading = ref(false);
  const handleBatchAdjust = async () => {
    if (timer) {
      clearInterval(timer);
    }
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    checkedList.forEach((item) => {
      item.result = '';
    });
    const errMap = await $table.validate(checkedList);
    if (errMap) return;
    try {
      batchAdjustLoading.value = true;
      const { data, msg } = await batchAdjustOriginPriceApi(checkedList);
      ElMessage.success(msg || '操作成功');
      needFresh.value = true;
      batchAdjustLoading.value = false;
      timer = setInterval(() => searchResult(data), 2000);
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batchAdjustLoading.value = false;
    }
  };

  const searchResult = async (batchNo) => {
    try {
      const { data } = await searchResultApi({ batchNo });
      const checkedList = tableRef.value.getCheckboxRecords();
      checkedList.forEach((item) => {
        let result = data[item.productId.toString() + item.skuId.toString()];
        if (result) {
          item.success = result === '调价成功';
          item.result = result || '调价失败';
        }
      });
      const hasValueArr = Object.values(data).filter((v) => !!v);
      if (hasValueArr.length === checkedList.length) {
        clearInterval(timer);
      }
    } catch (err) {
      console.log('err :>> ', err);
      if (timer) {
        clearInterval(timer);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .adjustPreTax_form {
    :deep(.hide_tag) {
      :deep(.el-select__selected-item) {
        display: none;
      }
    }
    :deep(.el-form-item) {
      width: 90%;
    }
    .form_left {
      :deep(.el-input) {
        width: 100px !important;
      }
      :deep(.el-input__wrapper) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
    .form_right {
      flex: auto;
      width: auto;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      :deep(.el-input__wrapper) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
  .m10 {
    margin: 10px;
  }
  .w80 {
    width: 80px;
  }
  .w200 {
    width: 200px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .mb10 {
    margin-bottom: 10px;
  }
  .flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .p10 {
    padding: 10px;
  }
  .h500 {
    height: 500px;
  }
</style>
