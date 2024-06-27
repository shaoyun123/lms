<template>
  <div class="update_sale_dialog">
    <el-dialog
      v-model="dialogVisible"
      title="修改listing秒杀"
      :width="1200"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div style="margin: 0 10px 10px; color: red">
        注：秒杀价需小于等于30天最低促销价
      </div>
      <el-card>
        <el-row>
          <el-col :span="24">
            <el-form :inline="true">
              <el-form-item
                v-if="params.type === 1"
                :label="'数量(' + totalCount + ')'"
              ></el-form-item>
              <el-form-item label="新秒杀价=" class="hide-boder" required>
                <el-select
                  v-model="bacthApplyInfo.flashSalePriceConsultEnum"
                  filterable
                  clearable
                  class="w100 left"
                >
                  <el-option
                    v-for="item in flashSalePriceEnum.flashSalePriceConsultEnum"
                    :key="item.code"
                    :value="item.code"
                    :label="item.name"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="bacthApplyInfo.tiktokMathOperatorEnum"
                  filterable
                  clearable
                  class="w50 middle"
                >
                  <el-option
                    v-for="item in flashSalePriceEnum.tiktokMathOperatorParam"
                    :key="item.code"
                    :value="item.code"
                    :label="item.name"
                  ></el-option>
                </el-select>
                <ZInputNumber
                  v-model="bacthApplyInfo.tiktokMathOperatorParam"
                  :precision="2"
                  clearable
                  class="w100 right"
                />
              </el-form-item>
              <el-form-item label="限购总量">
                <template #label>
                  <span class="label-text">限购总量</span>
                  <el-tooltip
                    effect="dark"
                    content="所有用户设置限购总量。一旦达到限购量，用户将无法再享受折扣价或秒杀价"
                    placement="top-start"
                  >
                    <el-icon :size="16" style="margin-top: 2px; cursor: pointer"
                      ><QuestionFilled
                    /></el-icon>
                  </el-tooltip>
                </template>
                <ZInputNumber
                  v-model="bacthApplyInfo.specialSkuNumLimit"
                  class="w100"
                />
              </el-form-item>
              <el-form-item label="买家限购量">
                <template #label>
                  <span class="label-text">买家限购量</span>
                  <el-tooltip
                    effect="dark"
                    content="每个用户设置限购量。一旦应用，将为每个用户设置商品的最大购买数量"
                    placement="top-start"
                  >
                    <el-icon :size="16" style="margin-top: 2px; cursor: pointer"
                      ><QuestionFilled
                    /></el-icon>
                  </el-tooltip>
                </template>
                <ZInputNumber
                  v-model="bacthApplyInfo.specialSkuUserLimit"
                  class="w100"
                />
              </el-form-item>
              <el-form-item
                ><el-button
                  v-if="params.type === 1"
                  type="primary"
                  @click="handleApply"
                  >一键应用</el-button
                >
                <el-button type="primary" @click="handleConfirm"
                  >确认修改</el-button
                >
                <el-button type="danger" @click="handleRemove"
                  >移除秒杀</el-button
                ></el-form-item
              >
            </el-form>
          </el-col>
        </el-row>
        <vxe-table
          v-if="params.type === 1"
          ref="tableRef"
          :data="tableData"
          :height="500"
          border
          :edit-rules="validRules"
          :row-config="{ isCurrent: true, isHover: true }"
          :column-config="{ resizable: true }"
        >
          <vxe-column type="checkbox" width="40" />
          <vxe-column field="storeAcct" title="店铺名称" />
          <vxe-column
            field="productId"
            title="product_id"
            :filters="[{}]"
            :filter-method="filterShopAndSku"
            :filter-reset-method="filterResetShopAndSku"
          >
            <template #default="{ row }">
              <div>
                {{ row.productId }}
                <el-tag v-if="row.isSale === false" type="danger">停</el-tag>
                <el-tag v-if="row.isFlashSalePrice" type="warning">秒</el-tag>
              </div>
            </template>
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
              </div>
            </template>
          </vxe-column>
          <vxe-column
            field="skuId"
            title="shop_sku_id"
            :filters="[{}]"
            :filter-method="filterShopAndSku"
            :filter-reset-method="filterResetShopAndSku"
          >
            <template #default="{ row }">
              <div>
                {{ row.skuId }}
                <el-tag v-if="row.isSale === false" type="danger">停</el-tag>
                <el-tag v-if="row.isFlashSalePrice" type="warning">秒</el-tag>
              </div>
            </template>
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <ZSelectPanel
                  v-model="option.data"
                  :items="skuIdListOption"
                  @change="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
          </vxe-column>
          <vxe-column field="promotionPrice" title="促销价/30天最低促销价">
            <template #default="{ row }">
              {{ row.promotionPrice }}/{{ row.thiryDaysMinPromotionPrice }}
            </template>
          </vxe-column>
          <vxe-column field="flashSalePrice">
            <template #header>
              <span style="color: red">*</span> 秒杀价
            </template>
            <template #default="{ row }">
              <ZInputNumber v-model="row.flashSalePrice" :precision="2" />
            </template>
          </vxe-column>
          <vxe-column field="skuNumLimit" title="限购总量">
            <template #header>
              <span>
                限购总量
                <el-tooltip
                  effect="dark"
                  content="所有用户设置限购总量。一旦达到限购量，用户将无法再享受折扣价或秒杀价"
                  placement="top-start"
                >
                  <el-icon
                    :size="16"
                    style="vertical-align: text-bottom; cursor: pointer"
                    ><QuestionFilled
                  /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <template #default="{ row }">
              <ZInputNumber v-model="row.skuNumLimit" /> </template
          ></vxe-column>
          <vxe-column field="skuUserLimit" title="买家限购量">
            <template #header>
              <span>
                买家限购量
                <el-tooltip
                  effect="dark"
                  content="每个用户设置限购量。一旦应用，将为每个用户设置商品的最大购买数量"
                  placement="top-start"
                >
                  <el-icon
                    :size="16"
                    style="vertical-align: text-bottom; cursor: pointer"
                    ><QuestionFilled
                  /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <template #default="{ row }">
              <ZInputNumber v-model="row.skuUserLimit" />
            </template>
          </vxe-column>

          <vxe-column field="result" title="操作结果" width="200">
            <template #default="{ row }">
              <el-text
                v-if="row.operationMsg"
                :type="!row.operationStatus ? 'danger' : ''"
                >{{ row.operationMsg }}</el-text
              >
            </template>
          </vxe-column>
        </vxe-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  //   import ZCascader from '@/components/ZCascader/index.vue';
  import {
    getFlashSaleEnumApi,
    listNotRenewFlashSaleApi,
    listFlashSaleApi,
    addOrUpdateFlashSaleApi,
    updateMinSaleApi,
    removeFlashSaleApi
  } from '@/api/publishs/tiktokonlineproduct';
  //   import { cloneDeep } from 'lodash-es';
  //   import { commonDivideCommaNum } from '@/utils/divide';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ZSelectPanel from '@/components/ZSelectPanel/index.vue';
  import { ElMessage } from 'element-plus';
  import { calculateBasicOperator } from '../config';
  import { cloneDeep, groupBy, uniqBy } from 'lodash-es';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => ({})
    },
    storeList: {
      type: Object,
      default: () => ({})
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['update:modelValue', 'getParams']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const istNotRenewFlashSaleList = ref([]);
  const flashSalePriceEnum = ref({});
  onMounted(async () => {
    const { params } = props;
    let notRenewFlashSaleParam = {};
    if (params.type === 3) {
      notRenewFlashSaleParam.productIdList = params.param.productIdList;
    } else {
      notRenewFlashSaleParam.storeAcctIdList = params.param.storeAcctIdList;
    }
    if (params.type === 1) {
      params.param.pageNum = 1;
      params.param.pageSize = 1000;
    }
    Promise.all([
      getFlashSaleEnumApi(),
      listNotRenewFlashSaleApi(notRenewFlashSaleParam)
    ]).then(async (res) => {
      flashSalePriceEnum.value = res[0].data;
      istNotRenewFlashSaleList.value = res[1].data;
      if (params.type === 1) {
        const { data, count } = await listFlashSaleApi(params.param);
        tableData.value = data.map((v) => ({
          ...v,
          isFlashSalePrice: !!v.flashSalePrice
        }));
        productIdListOption.value = uniqBy(
          data.map((v) => ({
            id: v.productId,
            name: v.productId
          })),
          'id'
        );
        skuIdListOption.value = data.map((v) => ({
          id: v.skuId,
          name: v.skuId
        }));
        totalCount.value = count;
      }
    });
  });

  const totalCount = ref(23);
  const tableRef = ref();
  const productIdListOption = ref([]); // 表头productId筛选下拉枚举
  const skuIdListOption = ref([]); // 表头skuId下拉枚举
  const tableData = ref([]);
  const validRules = ref({
    flashSalePrice: [{ required: true, message: '请填写' }]
  });
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

  //  #region 批量应用
  const bacthApplyInfo = reactive({});
  const flashSalePriceConsultObj = {
    FLASH_SALE_PRICE: 'flashSalePrice',
    PROMOTION_PRICE: 'promotionPrice',
    THIRTY_DAYS_MIN_PROMOTION_PRICE: 'thiryDaysMinPromotionPrice'
  };
  const operatorObj = {
    ADD: '+',
    SUBTRACT: '-',
    MULTIPLY: '*',
    DIVIDE: '/'
  };
  const handleApply = () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    const {
      flashSalePriceConsultEnum,
      tiktokMathOperatorEnum,
      tiktokMathOperatorParam,
      specialSkuUserLimit,
      specialSkuNumLimit
    } = bacthApplyInfo;
    checkedList.forEach((item) => {
      // 秒杀价
      // 支持仅选中第一个下拉框，代表直接取值，或仅输入第三个输入框
      if (
        flashSalePriceConsultEnum &&
        !tiktokMathOperatorEnum &&
        !tiktokMathOperatorParam &&
        !tiktokMathOperatorParam !== 0
      ) {
        item.flashSalePrice =
          item[flashSalePriceConsultObj[flashSalePriceConsultEnum]];
      } else if (
        !flashSalePriceConsultEnum &&
        !tiktokMathOperatorEnum &&
        (tiktokMathOperatorParam || tiktokMathOperatorParam === 0)
      ) {
        item.flashSalePrice = tiktokMathOperatorParam;
      } else if (
        flashSalePriceConsultEnum &&
        tiktokMathOperatorEnum &&
        (tiktokMathOperatorParam || tiktokMathOperatorParam === 0)
      ) {
        //若输入框内为空，则原值不修改
        const newFlashSalePrice = calculateBasicOperator(
          operatorObj[tiktokMathOperatorEnum],
          Number(tiktokMathOperatorParam),
          Number(item[flashSalePriceConsultObj[flashSalePriceConsultEnum]] || 0)
        );
        item.flashSalePrice = newFlashSalePrice.toFixed(2);
      }
      //   限购总量
      if (!!specialSkuNumLimit || specialSkuNumLimit === 0) {
        item.skuNumLimit = specialSkuNumLimit;
      }
      //   买家限购量
      if (!!specialSkuUserLimit || specialSkuUserLimit === 0) {
        item.skuUserLimit = specialSkuUserLimit;
      }
    });
  };
  const handleConfirm = async () => {
    const { params } = props;
    let flashSalePriceConsultEnum = bacthApplyInfo.flashSalePriceConsultEnum
      ? bacthApplyInfo.flashSalePriceConsultEnum
      : null;
    let tiktokMathOperatorEnum = bacthApplyInfo.tiktokMathOperatorEnum
      ? bacthApplyInfo.tiktokMathOperatorEnum
      : null;
    let obj = {
      isSave: false,
      flashSaleOperationTypeEnum:
        flashSalePriceEnum.value.flashSaleOperationTypeEnum.filter(
          (v) => v.sort === params.type
        )[0].name || null, // 操作类型
      isCreateActivity: false,
      ...bacthApplyInfo,
      flashSalePriceConsultEnum,
      tiktokMathOperatorEnum
    };
    let checkedList = [];
    if (params.type === 1) {
      checkedList = tableRef.value.getCheckboxRecords();
      if (!checkedList.length) return ElMessage.warning('请选择数据');
      //   列表中的秒杀价必填
      const isEmptyFlashSale = checkedList.some(
        (v) => !v.flashSalePrice && v.flashSalePrice !== 0
      );
      if (isEmptyFlashSale)
        return ElMessage.warning('请将列表中的秒杀价填写完整');
      obj.tiktokFlashSaleDtoList = cloneDeep(checkedList);
    } else {
      // 秒杀价： 第一个下拉框与第三个输入框不可均为空
      if (
        !bacthApplyInfo.flashSalePriceConsultEnum &&
        !bacthApplyInfo.tiktokMathOperatorParam &&
        bacthApplyInfo.tiktokMathOperatorParam !== 0
      )
        return ElMessage.warning('请将秒杀价公式填写完整');
      obj.tikTokProductDTO = params.param;
    }
    const { data } = await addOrUpdateFlashSaleApi(obj);
    const skuIdObj = groupBy(data, 'skuId');
    if (params.type === 1) {
      checkedList.forEach((v) => {
        if (skuIdObj[v.skuId]?.length) {
          v.operationStatus = skuIdObj[v.skuId][0].operationStatus;
          v.operationMsg = skuIdObj[v.skuId][0].operationMsg;
        }
      });
      updateMinSale();
    } else {
      ElMessage.success('操作成功，请到任务中心查看数据执行结果');
      dialogVisible.value = false;
    }
  };

  const updateMinSale = async () => {
    let list = tableRef.value.getCheckboxRecords();
    const { data } = await updateMinSaleApi(list.map((v) => v.skuId));
    tableData.value?.forEach((item) => {
      data?.forEach((cItem) => {
        if (item.skuId === cItem.skuId) {
          item.thiryDaysMinPromotionPrice = cItem.thirtyDaysMinPromotionPrice;
        }
      });
    });
  };
  const handleRemove = async () => {
    const { params } = props;
    const obj = {
      flashSaleOperationTypeEnum:
        flashSalePriceEnum.value.flashSaleOperationTypeEnum.filter(
          (v) => v.sort === params.type
        )[0].name // 操作类型
    };
    let checkedList = [];
    if (params.type === 1) {
      checkedList = tableRef.value.getCheckboxRecords();
      if (!checkedList.length) return ElMessage.warning('请选择数据');
      obj.skuIdList = checkedList.map((v) => v.skuId);
    } else {
      obj.tikTokProductDTO = params.param;
    }
    const { data } = await removeFlashSaleApi(obj);
    const skuIdObj = groupBy(data, 'skuId');
    if (params.type === 1) {
      checkedList.forEach((v) => {
        if (skuIdObj[v.skuId]?.length) {
          tableRef.value.remove(v);
        }
      });
    } else {
      ElMessage.success('操作成功，请到任务中心查看数据执行结果');
      dialogVisible.value = false;
    }
  };
  //  #endregion 批量应用
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .hide-boder {
    .left {
      :deep(.el-input__wrapper) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        box-shadow: 1px 0 0 0 var(--el-input-border-color) inset,
          0 1px 0 0 var(--el-input-border-color) inset,
          0 -1px 0 0 var(--el-input-border-color) inset;
      }
    }
    .right {
      :deep(.el-input__wrapper) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    .middle {
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
  }
  .w120 {
    width: 120px;
  }
  .update_sale_dialog {
    :deep(.el-dialog__body) {
      padding-top: 10px;
    }
  }
</style>
