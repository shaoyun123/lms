<template>
  <el-card :body-style="{ padding: '5px 10px' }">
    <template #header>
      <div class="card-header">
        <span>{{ item.storeAcct }} {{ item.productId }}</span>
      </div>
    </template>
    <div class="text item">
      <el-form size="default" status-icon :model="mulSetting" :inline="true">
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
            v-model="mulSetting.packageWeight"
            :precision="0"
            clearable
            style="width: 80px"
            placeholder="输入正整数"
            :min="1"
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
            v-model="mulSetting.specialProductTypes"
            style="width: 140px"
            class="m-2"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            size="small"
          >
            <el-option
              v-for="item in SPECIAL_PRODUCT_TYPE_LIST"
              :key="item.label"
              :label="item.label"
              :value="item.label"
              :disabled="
                isOptionDisabled(mulSetting.specialProductTypes, item.label)
              "
            />
          </el-select>
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
    </div>
    <vxe-table
      ref="tableRef"
      max-height="380"
      show-overflow
      :data="detailListItem.skus"
      border
    >
      <vxe-column field="skuImage" title="sku图片" width="100">
        <template #default="{ row }">
          <ImagePop :src="row.skuImage" />
        </template>
      </vxe-column>
      <vxe-column field="skuProperties" title="sku属性">
        <template #default="{ row }">
          <div>
            <div
              v-for="(propertyItem, pIndex) in row.skuProperties"
              :key="pIndex"
            >
              <div>
                {{ propertyItem.skuPropertyName }}:{{
                  propertyItem.skuPropertyValue
                }}
              </div>
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="storeSSku" title="店铺子sku"> </vxe-column>
      <vxe-column field="originalBox" title="是否原箱">
        <template #default="{ row }">
          <el-select
            v-model="row.scItem.originalBox"
            class="m-2"
            placeholder="Select"
            size="small"
          >
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </template>
      </vxe-column>
      <vxe-column field="packageWeight" title="重量(g)">
        <template #default="{ row }">
          <ZInputNumber
            v-model="row.packageWeight"
            :precision="0"
            clearable
            style="width: 100%"
            placeholder="输入正整数"
            :min="1"
            size="small"
          />
        </template>
      </vxe-column>
      <vxe-column field="packageLength" title="包装尺寸(cm)">
        <template #default="{ row }">
          <div class="flex">
            <!-- oninput="value=value.replace(/^\.*((\d{0,})(?:\.\d{0,1})?).*$/g, '$1')" -->
            <ZInputNumber
              v-model="row.packageLength"
              placeholder="长"
              :precision="0"
              clearable
            />*
            <ZInputNumber
              v-model="row.packageWidth"
              placeholder="宽"
              :precision="0"
              clearable
            />*
            <ZInputNumber
              v-model="row.packageHeight"
              placeholder="高"
              :precision="0"
              clearable
            />
          </div>
        </template>
      </vxe-column>
      <vxe-column field="specialProductTypes" title="特殊商品类型">
        <template #default="{ row }">
          <el-select
            v-model="row.scItem.specialProductTypes"
            class="m-2"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            size="small"
          >
            <el-option
              v-for="item in SPECIAL_PRODUCT_TYPE_LIST"
              :key="item.label"
              :label="item.label"
              :value="item.label"
              :disabled="
                isOptionDisabled(row.scItem.specialProductTypes, item.label)
              "
            />
          </el-select>
        </template>
      </vxe-column>
    </vxe-table>
  </el-card>
</template>

<script setup>
  import { onMounted, ref, reactive, watch } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  });

  const SPECIAL_PRODUCT_TYPE_LIST = [
    {
      label: '普货',
      value: '普货'
    },
    {
      label: '内电',
      value: '274526'
    },
    {
      label: '弱磁',
      value: '274452'
    },
    {
      label: '粉末',
      value: '274511'
    },
    {
      label: '膏体',
      value: '274363'
    },
    {
      label: '液体',
      value: '274259'
    }
  ];

  const tableRef = ref(null);

  const mulSetting = reactive({
    originalBox: '', // 是否原箱
    packageWeight: '', // 重量
    packageLength: '', // 长
    packageWidth: '', // 宽
    packageHeight: '', // 高
    specialProductTypes: [] // 特殊商品类型
  });

  const detailListItem = ref({});

  watch(
    () => props.item,
    async (val) => {
      if (val) {
        detailListItem.value = props.item;
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    detailListItem.value = props.item;
  });

  // 特殊商品类型 普货与 （内电/弱磁） 互斥
  const isOptionDisabled = (selectList = [], optionValue) => {
    const specialOption = ['内电', '弱磁', '粉末', '膏体', '液体'];
    if (optionValue === '普货') {
      return Boolean(
        selectList.length &&
          Array.isArray(selectList) &&
          selectList?.some((option) => specialOption?.includes(option))
      );
    } else if (specialOption?.includes(optionValue)) {
      return Boolean(
        selectList.length &&
          Array.isArray(selectList) &&
          selectList?.includes('普货')
      );
    } else {
      return false;
    }
  };

  // 批量填写(原箱、重量、包装尺寸、特殊商品类型必须要有值)
  const handleSet = () => {
    const tableList = tableRef.value.getTableData().fullData;

    let obj = {
      originalBox: '', // 是否原箱
      packageWeight: '', // 重量
      packageLength: '', // 长
      packageWidth: '', // 宽
      packageHeight: '', // 高
      specialProductTypes: [] // 特殊商品类型
    };
    Object.keys(obj).forEach((key) => {
      tableList.forEach((cItem) => {
        if (mulSetting[key] !== '') {
          if (key === 'originalBox' || key === 'specialProductTypes') {
            cItem.scItem[key] = mulSetting[key];
          } else {
            cItem[key] = mulSetting[key];
          }
        }
      });
    });
  };

  const resultObj = () => {
    const tableList = cloneDeep(tableRef.value.getTableData().fullData);
    return {
      tableList,
      detailListItem: cloneDeep(detailListItem.value)
    };
  };

  const clearFormInfo = () => {
    Object.keys(mulSetting).forEach((key) => {
      mulSetting[key] = '';
    });
  };

  defineExpose({
    resultObj,
    clearFormInfo
  });
</script>
<style lang="scss" scoped>
  :deep(.el-card__header) {
    background-color: #eee;
  }
  .content {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 280px);
    margin-top: -30px;
    .skuList {
      flex: 1;
    }
  }

  .flex {
    display: flex;
    align-items: center;
  }
  .justify-end {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
  .btn_position {
    width: 80px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .batch_setting {
    display: flex;
    justify-content: space-between;
    :deep(.el-form-item) {
      margin-bottom: 0px;
    }
  }
</style>
