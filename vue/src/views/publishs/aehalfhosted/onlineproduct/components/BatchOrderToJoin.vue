<template>
  <el-dialog
    v-model="dialogVisible"
    width="85%"
    align-center
    title="预约加入"
    @close="handleClose"
  >
    <div class="content">
      <el-card :body-style="{ padding: '5px 10px' }">
        <div class="text item">
          <el-form
            size="default"
            status-icon
            :model="mulSetting"
            :inline="true"
          >
            <b>批量设置</b>
            <el-form-item label="是否原箱" style="margin-left: 25px">
              <el-select
                v-model="mulSetting.originalBox"
                class="m-2"
                style="width: 100px"
                size="small"
              >
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="重量(g)">
              <ZInputNumber
                v-model="mulSetting.oldPackageWeight"
                :precision="4"
                clearable
                style="width: 80px"
                :min="0"
                size="small"
              />
            </el-form-item>
            <el-form-item label="包装尺寸(cm)">
              <div class="flex">
                <ZInputNumber
                  v-model="mulSetting.packageLength"
                  style="width: 80px"
                  :precision="0"
                  clearable
                />*
                <ZInputNumber
                  v-model="mulSetting.packageWidth"
                  style="width: 80px"
                  :precision="0"
                  clearable
                />*
                <ZInputNumber
                  v-model="mulSetting.packageHeight"
                  style="width: 80px"
                  :precision="0"
                  clearable
                />
              </div>
            </el-form-item>
            <el-form-item label="特殊商品类型">
              <el-select
                v-model="mulSetting.oldSpecialProductTypes"
                style="width: 140px"
                class="m-2"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="1"
                size="small"
              >
                <el-option
                  v-for="item in specialOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="
                    isOptionDisabled(
                      mulSetting.oldSpecialProductTypes,
                      item.value
                    )
                  "
                />
              </el-select>
            </el-form-item>
            <el-form-item label="价格($)">
              <ZInputNumber
                v-model="mulSetting.basePrice"
                :precision="4"
                clearable
                style="width: 80px"
                :min="0"
                size="small"
                @input="changeMulSettingBasePrice"
              />
            </el-form-item>
            <el-form-item label="价格(￥)">
              <ZInputNumber
                v-model="mulSetting.basePriceCny"
                :precision="4"
                clearable
                style="width: 80px"
                :min="0"
                size="small"
                @input="changeMulSettingBasePriceCny"
              />
            </el-form-item>
            <el-form-item label="JIT库存">
              <ZInputNumber
                v-model="mulSetting.availableStock"
                :precision="2"
                clearable
                style="width: 80px"
                :min="0"
                size="small"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                style="margin-left: 10px"
                type="primary"
                size="small"
                @click="handleSet()"
                >应用</el-button
              >
            </el-form-item>
          </el-form>
          <div class="flex justify-end mb-8 mr-72">
            <span class="mr-12">毛利率</span>
            <ZInputNumber
              v-model="gross"
              :precision="2"
              clearable
              :min="0"
              placeholder="输入小数,如0.3"
              style="width: 100px"
              size="small"
            />
            <el-button
              style="margin-left: 20px"
              type="primary"
              size="small"
              @click="handleGross()"
              >定价</el-button
            >
          </div>
        </div>
        <vxe-table
          ref="tableRef"
          height="550"
          show-overflow
          :data="tableData"
          border
        >
          <vxe-column field="storeAcct" title="店铺">
            <template #default="{ row }">
              <div>{{ row.storeAcct }}</div>
            </template>
          </vxe-column>
          <vxe-column field="productId" title="商品ID">
            <template #default="{ row }">
              <div>{{ row.productId }}</div>
            </template>
          </vxe-column>
          <vxe-column field="skuPropertyName" title="SKU属性"> </vxe-column>
          <vxe-column field="skuCode" width="150">
            <template #header>
              <span class="text-red">*</span>SKU编码
            </template>
            <template #default="{ row }">
              <el-input v-model="row.skuCode" />
            </template>
          </vxe-column>
          <vxe-column field="originalBox">
            <template #header>
              <span class="text-red">*</span>是否原箱
            </template>
            <template #default="{ row }">
              <el-select v-model="row.originalBox" class="m-2" size="small">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="oldPackageWeight">
            <template #header>
              <span class="text-red">*</span>重量(g)
            </template>
            <template #default="{ row }">
              <ZInputNumber
                v-model="row.oldPackageWeight"
                placeholder="重量"
                :precision="2"
                clearable
              />
            </template>
          </vxe-column>
          <vxe-column field="packageLength" width="180">
            <template #header>
              <span class="text-red">*</span>包装尺寸(cm)
            </template>
            <template #default="{ row }">
              <div class="flex">
                <ZInputNumber
                  v-model="row.packageLength"
                  placeholder="长"
                  :precision="2"
                  clearable
                />*
                <ZInputNumber
                  v-model="row.packageWidth"
                  placeholder="宽"
                  :precision="2"
                  clearable
                />*
                <ZInputNumber
                  v-model="row.packageHeight"
                  placeholder="高"
                  :precision="2"
                  clearable
                />
              </div>
            </template>
          </vxe-column>
          <vxe-column field="specialProductTypes" width="165">
            <template #header>
              <span class="text-red">*</span>特殊商品类型
            </template>
            <template #default="{ row }">
              <el-select
                v-model="row.oldSpecialProductTypes"
                style="width: 140px"
                class="m-2"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="1"
                size="small"
              >
                <el-option
                  v-for="item in specialOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="
                    isOptionDisabled(row.oldSpecialProductTypes, item.value)
                  "
                />
              </el-select>
            </template>
          </vxe-column>
          <vxe-column field="basePriceCny" width="120">
            <template #header>
              <span class="text-red">*</span>价格(不含预约物流服务费)
            </template>
            <template #default="{ row, rowIndex }">
              <div class="flex-y py-4">
                <div class="flex">
                  <span>$ </span>
                  <ZInputNumber
                    v-model="row.basePrice"
                    :precision="2"
                    clearable
                    style="width: 80px"
                    @input="changeTableBasePrice($event, rowIndex)"
                  />
                </div>
                <div class="flex mt-2">
                  <span>￥</span>
                  <ZInputNumber
                    v-model="row.basePriceCny"
                    :precision="2"
                    clearable
                    style="width: 80px"
                    @input="changeTableBasePriceCny($event, rowIndex)"
                  />
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="availableStock">
            <template #header>
              <span class="text-red">*</span>JIT库存
            </template>
            <template #default="{ row }">
              <ZInputNumber
                v-model="row.availableStock"
                oninput="value=value.replace(/^\.*((\d{0,})(?:\.\d{0,1})?).*$/g, '$1')"
                :precision="0"
                clearable
              />
            </template>
          </vxe-column>
          <vxe-column field="scItemBarCode" title="货品条码" width="150">
            <template #default="{ row }">
              <el-input v-model="row.scItemBarCode" />
            </template>
          </vxe-column>
          <vxe-column field="result" title="操作结果" width="160">
            <template #default="{ row }">
              <div
                v-if="row.result"
                :class="row.result !== '1' ? '' : 'success_color'"
              >
                {{ getResultText(row.result) }}
              </div>
            </template>
          </vxe-column>
        </vxe-table>
      </el-card>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          :disabled="disabledSubmit"
          :loading="submitLoading"
          @click="handleSubmit"
          >提交</el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, watch, onMounted, ref, reactive } from 'vue';
  import {
    getSpecialGoodsEnumType,
    listPreSelectedInfoApi,
    batchPreSelectSubmitApi,
    getBatchUpdateResultApi
  } from '@/api/publishs/aefullyhosted';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    selectRecords: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue']);

  onMounted(() => {
    getSpecialProductTypeEnumOption();
  });

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const needFresh = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (!val) {
        clearTimeout(timerId.value);
        handleClose();
        needFresh.value && emits('handleSearch', 1, 100);
      } else {
        needFresh.value = false;
        resetForm();
        queryList();
      }
    }
  );

  const tableLoading = ref(false);

  // 初始渲染特殊商品类型
  const specialEnum = {
    普货: 'general',
    内电: 274526,
    弱磁: 274452,
    粉末: 274511,
    液体: 274259,
    膏体: 274363
  };
  const specialOption = ref([
    {
      label: '普货',
      value: 'general'
    },
    {
      label: '内电',
      value: 274526
    },
    {
      label: '弱磁',
      value: 274452
    },
    {
      label: '粉末',
      value: 274511
    },
    {
      label: '液体',
      value: 274259
    },
    {
      label: '膏体',
      value: 274363
    }
  ]);

  const mulSetting = reactive({
    originalBox: '', // 是否原箱
    oldPackageWeight: '', // 重量
    packageLength: '', // 长
    packageWidth: '', // 宽
    packageHeight: '', // 高
    oldSpecialProductTypes: [], // 特殊商品类型
    basePrice: null, // 美元价格
    basePriceCny: null // 人民币
  });

  // 表单人民币和美元联动
  const changeMulSettingBasePrice = (val) => {
    if (val === '') {
      return (mulSetting.basePriceCny = null);
    }
    mulSetting.basePriceCny = (
      Number(val || 0) * Number(exchRate.value)
    ).toFixed(2);
  };

  const changeMulSettingBasePriceCny = (val) => {
    if (val === '') {
      return (mulSetting.basePrice = null);
    }
    mulSetting.basePrice = (Number(val || 0) / Number(exchRate.value)).toFixed(
      2
    );
  };

  // 表格人民币和美元联动
  const changeTableBasePrice = (val, index) => {
    if (val === '') {
      return (tableData.value[index].basePriceCny = null);
    }
    tableData.value[index].basePriceCny = (
      Number(val || 0) * Number(exchRate.value)
    ).toFixed(2);
  };

  const changeTableBasePriceCny = (val, index) => {
    if (val === '') {
      return (tableData.value[index].basePrice = null);
    }
    tableData.value[index].basePrice = (
      Number(val || 0) / Number(exchRate.value)
    ).toFixed(2);
  };

  const tableRef = ref(null);
  const specialGoodsEnumTypeOption = ref([]);

  // 应用(SKU编码、原箱、重量、包装尺寸、特殊商品类型、价格(美元、人民币)、JIT库存必须要有值)
  const handleSet = () => {
    const tableList = tableRef.value.getTableData().fullData;

    let obj = {
      // skuCode: '', // sku编码
      originalBox: '', // 是否原箱
      oldPackageWeight: '', // 重量
      packageLength: '', // 长
      packageWidth: '', // 宽
      packageHeight: '', // 高
      oldSpecialProductTypes: [], // 特殊商品类型
      basePrice: null, // 美元价格
      basePriceCny: null, // 人民币
      availableStock: null // JIT库存
    };

    Object.keys(obj).forEach((key) => {
      tableList.forEach((cItem) => {
        // 给表单中有值的赋值
        if (key === 'oldSpecialProductTypes') {
          if (mulSetting.oldSpecialProductTypes.length) {
            cItem[key] = mulSetting[key];
          }
        } else {
          if (
            mulSetting[key] !== '' &&
            mulSetting[key] !== null &&
            mulSetting[key] !== undefined
          ) {
            cItem[key] = mulSetting[key];
          }
        }
      });
    });
  };

  // 获取特殊商品类型
  const getSpecialProductTypeEnumOption = async () => {
    const { data } = await getSpecialGoodsEnumType();
    specialGoodsEnumTypeOption.value = data.specialProductTypeEnum;
  };

  // 特殊商品类型 普货与 （内电/弱磁/粉末/液体/膏体） 互斥
  const isOptionDisabled = (selectList, optionValue) => {
    if (optionValue === 'general') {
      return selectList.some((option) =>
        [274526, 274452, 274511, 274259, 274363].includes(option)
      );
    } else if ([274526, 274452, 274511, 274259, 274363].includes(optionValue)) {
      return selectList.includes('general');
    } else {
      return false;
    }
  };

  // 定价
  const gross = ref(null); // 毛利率
  const handleGross = async () => {
    if (gross.value === '' || gross.value === null) {
      return ElMessage.warning('毛利率不得为空！');
    }
    tableLoading.value = true;

    const { data } = await listPreSelectedInfoApi({
      productIds: props.selectRecords.map((item) => item.productId),
      gross: gross.value
    }).finally(() => (tableLoading.value = false));

    // 计算结果所有为true才是定价成功
    if (data.skus.every((item) => item.isCalculatePrice === true)) {
      tableData.value.forEach((item) => {
        data.skus.forEach((cItem) => {
          if (
            item.prodSSku === cItem.prodSSku &&
            item.productId === cItem.productId
          ) {
            item.basePrice = cItem.basePrice;
            item.basePriceCny = cItem.basePriceCny;
          }
        });
      });
    } else {
      ElMessage.warning('当前毛利率未计算出结果，请重新输入！');
    }
  };

  // 获取列表
  const disabledSubmit = ref(true);
  const tableData = ref([]);
  const exchRate = ref(null); // 汇率
  const queryList = async () => {
    tableLoading.value = true;
    const { data } = await listPreSelectedInfoApi({
      productIds: props.selectRecords.map((item) => item.productId),
      gross: gross.value
    }).finally(() => (tableLoading.value = false));
    exchRate.value = data.exchRate;
    tableData.value = data.skus.map((item) => {
      item.originalBox = 1;
      item.oldPackageWeight = item.packageWeight;
      item.result = '';
      // 特殊商品类型 初始渲染默认枚举
      if (item.specialProductTypes) {
        item.specialProductTypes = item.specialProductTypes.map((item) => {
          return specialEnum[item];
        });
      }
      item.oldSpecialProductTypes = item.specialProductTypes;

      return item;
    });

    // 没有列表 禁用提交按钮
    disabledSubmit.value = tableData.value.length ? false : true;
  };

  // 清空表单
  const resetForm = () => {
    let obj = {
      originalBox: '', // 是否原箱
      oldPackageWeight: '', // 重量
      packageLength: '', // 长
      packageWidth: '', // 宽
      packageHeight: '', // 高
      specialProductTypes: [], // 特殊商品类型
      oldSpecialProductTypes: [], // 特殊商品类型
      basePrice: null, // 美元价格
      basePriceCny: null, // 人民币
      availableStock: null // JIT库存
    };
    Object.keys(obj).forEach((key) => {
      Object.keys(mulSetting).forEach((mulKey) => {
        if (key === mulKey) {
          mulSetting[mulKey] = obj[key];
        }
      });
    });
  };

  // 验证必填
  const verifyForm = () => {
    const resultKey = [
      'skuCode',
      'originalBox',
      'oldPackageWeight',
      'packageLength',
      'packageWidth',
      'packageHeight',
      'oldSpecialProductTypes',
      'basePrice',
      'basePriceCny',
      'availableStock'
    ];

    const isRequiredFieldFilled = (item) => {
      return resultKey.every((key) => {
        if (key === 'originalBox' && item[key] !== '') {
          return true;
        } else if (key === 'oldSpecialProductTypes') {
          return Array.isArray(item[key]) && item[key].length > 0;
        }
        return item[key];
      });
    };

    return tableData.value.every(isRequiredFieldFilled);
  };

  // 点击提交
  const submitLoading = ref(false);
  const timerId = ref(null);
  const handleSubmit = async () => {
    if (!verifyForm()) {
      return ElMessage.warning('必填项请填写完整！');
    }
    const params = tableData.value.map((item) => {
      // 普货传空
      if (item.oldSpecialProductTypes.includes('general')) {
        item.specialProductTypes = [''];
      } else {
        item.specialProductTypes = item.oldSpecialProductTypes;
      }
      item.packageWeight = (item.oldPackageWeight / 1000).toFixed(3);
      return item;
    });

    submitLoading.value = true;
    const { code, data, msg } = await batchPreSelectSubmitApi(params).finally(
      () => (submitLoading.value = false)
    );
    if (code === '0000') {
      ElMessage.success(msg);
      timerId.value = setInterval(() => {
        getOperateResult(data);
      }, 1000);
    } else {
      ElMessage.warning(msg);
    }
    needFresh.value = true;
  };

  // 查询操作结果
  const getOperateResult = async (batchNo) => {
    const { data } = await getBatchUpdateResultApi({
      type: 6,
      batchNo: batchNo
    });
    Object.keys(data).forEach((key) => {
      const index = tableData.value.findIndex((el) => el.storeSSku === key);
      if (index > -1) {
        tableData.value[index].result = data[key];
      }
    });
    const isEnd = Object.values(data).every((item) => {
      return item !== '0';
    });
    if (isEnd) {
      clearTimeout(timerId.value);
    }
  };

  const getResultText = (res) => {
    if (res === '0') return '执行中...';
    if (res === '1') {
      return '成功';
    }
    if (res !== '0' && res !== '1') {
      return res;
    }
  };

  const handleClose = () => {
    dialogVisible.value = false;
    submitLoading.value = false;
    gross.value = null;
    resetForm();
  };
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-y {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .justify-end {
    justify-content: end;
  }
  .mt-4 {
    margin-top: 16px;
  }
  .mt-2 {
    margin-top: 4px;
  }
  .mb-8 {
    margin-bottom: 8px;
  }
  .mr-12 {
    margin-right: 12px;
  }
  .mr-72 {
    margin-right: 72px;
  }
  .color_success {
    color: #67c23a;
  }
  .text-red {
    color: #f56c6c;
  }
  .py-4 {
    padding: 4px 0;
  }
</style>
