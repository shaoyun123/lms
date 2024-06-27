<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改listing促销"
      :width="operateData.type == 1 ? 1000 : 800"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <div
        class="disflex_between mb10"
        :style="{ display: operateData.type == 1 ? 'flex' : 'block' }"
      >
        <div v-if="operateData.type == 1">数量({{ totalCount }})</div>
        <el-form
          ref="formRef"
          :model="bacthApplyInfo"
          :inline="true"
          :label-width="100"
        >
          <el-form-item label="新促销比例=" :required="operateData.type != 1">
            <el-select
              v-model="bacthApplyInfo.discountRateType"
              clearable
              filterable
              class="first-param-part"
            >
              <el-option :value="0" label="当前促销比例"></el-option>
              <el-option :value="1" label="配置优惠幅度"></el-option>
            </el-select>
            <el-select
              v-model="bacthApplyInfo.discountCalculateType"
              clearable
              filterable
              class="operator-param-part"
            >
              <el-option :value="0" label="+"></el-option>
              <el-option :value="1" label="-"></el-option>
              <el-option :value="2" label="*"></el-option>
              <el-option :value="3" label="/"></el-option>
            </el-select>
            <ZInputNumber
              v-model="bacthApplyInfo.discountRate"
              :min="1"
              clearable
              placeholder="请输入整数，不支持保留小数"
              class="second-param-part"
            />
            <span>%</span>
          </el-form-item>
          <el-form-item v-if="operateData.type == 1">
            <el-button type="primary" @click="handleApply">
              一键应用
            </el-button>
          </el-form-item>
        </el-form>
        <div class="last-btn-part">
          <el-checkbox
            v-model="updateOriginPrice"
            label="同时调整价格"
            size="large"
          />
          <el-tooltip
            effect="dark"
            content="若listing无促销，则添加至促销"
            placement="top-start"
          >
            <el-button
              type="primary"
              class="ml12"
              :loading="batchAddLoading"
              @click="handleBatchAdd()"
              >确认修改</el-button
            ></el-tooltip
          >
          <el-tooltip
            effect="dark"
            content="移除促销时，请手动调整价格，前方“同时调整价格”选项不生效！"
            placement="top-start"
          >
            <el-button
              type="danger"
              :loading="batchDelLoading"
              @click="handleBatchDel()"
              >移除促销</el-button
            ></el-tooltip
          >
        </div>
      </div>
      <vxe-table
        v-if="operateData.type == 1"
        ref="tableRef"
        :data="tableData"
        :height="600"
        border
        :edit-rules="validRules"
        :row-config="{
          isCurrent: true,
          isHover: true,
          keyField: 'productId'
        }"
        :column-config="{ resizable: true }"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺名称" width="150" />
        <vxe-column
          field="productId"
          title="product_id"
          width="150"
          :filters="[{}]"
          :filter-method="filterMultiSelect"
          :filter-recover-method="filterRecoverMethod"
          :filter-reset-method="filterResetMultiSelect"
        >
          <template #filter="{ column, $panel }">
            <div
              v-for="(option, index) in column.filters"
              :key="index"
              class="p10"
            >
              <ZSelectPanel
                v-model="option.data"
                :items="productIdListOption"
                @change="$panel.changeOption($event, true, option)"
              />
            </div> </template
        ></vxe-column>
        <vxe-column
          field="prodPSku"
          title="商品父SKU"
          width="150"
          :filters="[{}]"
          :filter-method="filterMultiSelect"
          :filter-recover-method="filterRecoverMethod"
          :filter-reset-method="filterResetMultiSelect"
        >
          <template #filter="{ column, $panel }">
            <div
              v-for="(option, index) in column.filters"
              :key="index"
              class="p10"
            >
              <ZSelectPanel
                v-model="option.data"
                :items="prodPSkuListOption"
                @change="$panel.changeOption($event, true, option)"
              />
            </div>
          </template>
        </vxe-column>
        <vxe-column
          field="productPromotionDiscount"
          title="促销比例"
          width="150"
        >
          <template #default="{ row }">
            <div class="disflex">
              <vxe-input
                v-model="row.productPromotionDiscount"
                placeholder="填入百分比，不支持保留小数"
                type="integer"
                min="1"
                step="1"
                max="100"
                @change="handleResetResult(row)"
              ></vxe-input>
              <span class="unit_style ml12">%</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="result" title="结果">
          <template #default="{ row }">
            <div v-if="row.result" class="color_success">
              {{ row.isAdd ? '添加成功' : '移除成功' }}
            </div>
            <div v-else>
              <div
                v-for="item in row.successPromotionIdList"
                :key="item.promotionId"
                class="color_success"
              >
                {{ item }}：{{ row.isAdd ? '添加成功' : '移除成功' }}
              </div>
              <div
                v-for="item in row.failPromotionList"
                :key="item.promotionId"
                class="color_error"
              >
                {{ item.promotionId }}：{{ item.reason }}
              </div>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { debounce } from 'lodash-es';
  import {
    queryPromotionListApi,
    addOrRemovePromotionApi,
    addOrRemovePromotionV2Api
  } from '@/api/publishs/tiktokonlineproduct';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ZSelectPanel from '@/components/ZSelectPanel/index.vue';
  import { calculateBasicOperator } from '../config';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    },
    operateData: {
      type: Object,
      default: () => ({})
    }
  });

  const emits = defineEmits([
    'update:modelValue',
    'handleSearch',
    'showTaskCenter'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const tableData = ref([]);
  const tableRef = ref();
  const totalCount = ref();
  const needFresh = ref(false); // 关闭弹窗页面是否需要查询列表

  const tableDataLoading = ref(false);
  onMounted(() => {
    handleSearch();
  });
  onUnmounted(() => {
    if (needFresh.value) {
      emits('handleSearch');
    }
  });
  const handleSearch = async () => {
    try {
      const { param, type } = props.operateData;
      tableDataLoading.value = true;
      if (type === 1) {
        const productIds = param.productIdList;
        const { data, count } = await queryPromotionListApi(productIds);
        tableData.value = (data || []).map((v) => ({
          ...v,
          _productPromotionDiscount:
            v.productPromotionDiscount || v.defaultDiscountRate,
          productPromotionDiscount:
            v.productPromotionDiscount || v.defaultDiscountRate
        }));
        prodPSkuListOption.value = [
          ...new Set((data || []).map((item) => item.prodPSku))
        ].map((v) => ({ id: v, name: v }));
        productIdListOption.value = (data || []).map((v) => ({
          id: v.productId,
          name: v.productId
        }));
        totalCount.value = count;
      }
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };

  const formRef = ref();
  const bacthApplyInfo = ref({});

  const validRules = ref({
    productPromotionDiscount: [{ required: true, message: '请填写' }]
  });

  const discountRateTypeObj = {
    0: '_productPromotionDiscount',
    1: 'defaultDiscountRate'
  };
  const discountCalculateTypeObj = {
    0: '+',
    1: '-',
    2: '*',
    3: '/'
  };

  const getcalculateInfo = () => {
    const {
      discountRateType: _discountRateType,
      discountCalculateType,
      discountRate
    } = bacthApplyInfo.value;
    const obj = {
      isOnlyFirst: false,
      isOnlyThird: false,
      allExist: false,
      operator: discountCalculateTypeObj[discountCalculateType],
      discountRateType: discountRateTypeObj[_discountRateType],
      discountRate
    };
    if (obj.discountRateType || obj.discountRate) {
      //	支持仅选中第一个下拉框，代表直接取值，
      if (obj.discountRateType && !obj.operator && !obj.discountRate) {
        obj.isOnlyFirst = true;
        // 仅输入第三个输入框，此时输入值为固定促销比例。
      } else if (!obj.discountRateType && !obj.operator && obj.discountRate) {
        obj.isOnlyThird = true;
        // 三个都有值
      } else if (obj.discountRateType && obj.operator && obj.discountRate) {
        obj.allExist = true;
      }
    }
    return obj;
  };
  const handleApply = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');

    // 获取一键应用相关信息
    const {
      isOnlyFirst,
      isOnlyThird,
      allExist,
      operator,
      discountRateType,
      discountRate
    } = getcalculateInfo();

    //	支持仅选中第一个下拉框，代表直接取值；仅输入第三个输入框，此时输入值为固定促销比例；三个都有值
    if (discountRateType || discountRate) {
      checkedList.forEach((item) => {
        //若表格内输入框内为空，则原值不修改
        if (
          item.productPromotionDiscount ||
          item.productPromotionDiscount === 0
        ) {
          if (isOnlyFirst) {
            item.productPromotionDiscount = item[discountRateType];
          } else if (isOnlyThird) {
            item.productPromotionDiscount = discountRate;
          } else if (allExist) {
            const newFlashSalePrice = calculateBasicOperator(
              operator,
              Number(discountRate),
              Number(item[discountRateType] || 0)
            );
            item.productPromotionDiscount = newFlashSalePrice;
          }
        }
      });
    }
  };

  // #region 表头筛选
  //商品父SKU 筛选项集合
  const prodPSkuListOption = ref([]);
  // product id 筛选项集合
  const productIdListOption = ref([]);
  const filterMultiSelect = ({ option, cellValue }) => {
    if (option.data && option.data.length && option.data.includes(cellValue)) {
      return true;
    }

    return false;
  };

  const filterRecoverMethod = (params) => {
    params.option._checked = true;
  };

  // 筛选重置
  const filterResetMultiSelect = ({ options }) => {
    options[0].data = [];
  };
  // #endregion 表头筛选

  const handleResetResult = debounce((row) => {
    if (
      row.result ||
      row.successPromotionIdList?.length ||
      row.failPromotionList?.length
    ) {
      row.result = false;
      row.successPromotionIdList = [];
      row.failPromotionList = [];
    }
  }, 1000);

  const updateOriginPrice = ref(false);
  // 确认修改
  const batchAddLoading = ref(false);
  const handleBatchAdd = async () => {
    const { type } = props.operateData;
    if (type == 1) {
      addOrRemovePromotion(batchAddLoading, true);
    } else {
      addOrRemovePromotionQueue(true);
    }
  };
  // 移除促销
  const batchDelLoading = ref(false);
  const handleBatchDel = async () => {
    const { type } = props.operateData;
    if (type == 1) {
      addOrRemovePromotion(batchDelLoading, false);
    } else {
      addOrRemovePromotionQueue(false);
    }
  };

  const addOrRemovePromotion = async (loading, isAdd) => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    const params = checkedList.map((item) => ({
      ...item,
      isAdd,
      updateOriginPrice: updateOriginPrice.value
    }));
    const errMap = await $table.validate(checkedList);
    if (errMap) return;
    try {
      loading.value = true;
      const { data } = await addOrRemovePromotionApi(params);
      needFresh.value = true;
      let checkedObj = {};
      data.forEach((item) => {
        checkedObj[item.productId] = item;
      });
      checkedList.forEach((item) => {
        let elem = checkedObj[item.productId];
        item.result = elem?.result;
        item.isAdd = isAdd;
        item.successPromotionIdList = elem?.successPromotionIdList || [];
        item.failPromotionList = elem?.failPromotionList || [];
      });
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      loading.value = false;
    }
  };

  const addOrRemovePromotionQueue = async (isAdd) => {
    const { type, param: searchParams } = props.operateData;
    const { discountRateType, discountCalculateType, discountRate } =
      bacthApplyInfo.value;
    // 移除不校验数据
    if (isAdd) {
      // 校验数据
      const { isOnlyFirst, isOnlyThird, allExist } = getcalculateInfo();
      if (!isOnlyFirst && !isOnlyThird && !allExist) {
        return ElMessage.warning(
          '支持仅选中第一个下拉框；或仅输入第三个输入框；或三个都有值'
        );
      }
    }
    const operationTypeObj = {
      2: 0, // 0操作查询条件中全部数据
      3: 1 //1操作输入数据
    };
    const params = {
      operationType: operationTypeObj[type],
      isAdd,
      [type == 3 ? 'productIdList' : 'searchDto']:
        type == 3 ? searchParams.productIdList : searchParams,
      discountRate,
      discountRateType,
      discountCalculateType,
      updateOriginPrice: updateOriginPrice.value
    };
    await addOrRemovePromotionV2Api(params);
    emits('showTaskCenter', {
      title: '修改listing促销结果',
      content: '操作成功，请到任务中心查看数据执行结果'
    });
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .last-btn-part {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .first-param-part {
    width: 115px;
    :deep(.el-input__wrapper) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      box-shadow: 1px 0 0 0 var(--el-input-border-color) inset,
        0 1px 0 0 var(--el-input-border-color) inset,
        0 -1px 0 0 var(--el-input-border-color) inset;
    }
  }
  .operator-param-part {
    width: 75px;
    :deep(.el-input__wrapper) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      box-shadow: 1px 0 0 0 var(--el-input-border-color) inset,
        0 1px 0 0 var(--el-input-border-color) inset,
        0 -1px 0 0 var(--el-input-border-color) inset;
    }
  }
  .second-param-part {
    width: 190px;
    :deep(.el-input__wrapper) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
</style>
