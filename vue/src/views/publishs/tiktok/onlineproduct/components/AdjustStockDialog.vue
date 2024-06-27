<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="调整库存"
      :width="1000"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <div class="query_form">
        <el-form
          ref="formRef"
          :model="formData"
          :inline="true"
          aria-label="left"
          class="search_form"
        >
          <el-form-item label="商品状态" prop="isSale">
            <el-select v-model="formData.isSale" clearable filterable>
              <el-option :value="true" label="在售" />
              <el-option :value="false" label="停售" />
            </el-select>
          </el-form-item>
          <el-form-item prop="preAvailableStockQueryType " class="form_range"
            ><el-select
              v-model="formData.preAvailableStockQueryType"
              filterable
            >
              <el-option :value="1" label="预计可用库存含在途" />
              <el-option :value="2" label="预计可用库存不含在途" />
            </el-select>
            <ZInputNumber
              v-model="formData.preAvailableStockLowerBound"
              :precision="0"
              :min="0"
            />
            <div class="range_link">-</div>
            <ZInputNumber
              v-model="formData.preAvailableStockUpperBound"
              :precision="0"
              :min="0"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch(1)">查询</el-button
            ><el-button @click="handleReset()">取消</el-button></el-form-item
          >
        </el-form>
      </div>
      <div class="disflex_between mb10">
        <div>数量({{ totalCount }})</div>
        <div>
          <el-input-number
            v-model="newStock"
            :precision="0"
            :min="0"
            placeholder="请输入库存"
            controls-position="right"
          />
          <el-button type="primary" @click="handleApply">一键应用</el-button>
          <el-button
            type="primary"
            :loading="batchAdjustLoading"
            @click="handleBatchAdjust"
            >批量调整</el-button
          >
        </div>
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
        <vxe-column field="productId" title="product_id" width="150" />
        <vxe-column field="shopSkuId" title="shop_sku_id" width="150" />
        <vxe-column field="sellerSku" title="seller_sku" width="120">
          <template #default="{ row }">
            {{ row.sellerSku }}
            <el-tag v-if="row.isSale === false" type="danger">停</el-tag>
          </template>
        </vxe-column>
        <vxe-column field="storeAcct" title="店铺名称" />
        <vxe-column field="stock" title="在线数量" width="80" />
        <vxe-column field="updateStock" title="可用/在途/未派">
          <template #default="{ row }">
            <div>
              {{ row.availableStock }}/{{ row.orderNotInNum }}/{{
                row.lackUnPaiNum
              }}
            </div>
          </template>
        </vxe-column>
        <vxe-column field="updateStock" title="调整库存">
          <template #default="{ row }">
            <vxe-input
              v-model="row.updateStock"
              placeholder="请输入"
              type="integer"
              @change="handleResetResult(row)"
            ></vxe-input>
          </template>
        </vxe-column>
        <vxe-column field="result" title="结果">
          <template #default="{ row }">
            <div v-if="row.success" class="color_success">{{ row.result }}</div>
            <div v-else class="color_error">{{ row.result }}</div>
          </template>
        </vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, watch, computed, reactive } from 'vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { handleResetResult } from '../config';
  import {
    getStockInfoApi,
    batchUpdateStockApi
  } from '@/api/publishs/tiktokonlineproduct';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
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
    isSale: '', // 商品状态
    preAvailableStockQueryType: 1,
    preAvailableStockUpperBound: '',
    preAvailableStockLowerBound: ''
  });
  const tableData = ref([]);
  const tableRef = ref();
  const totalCount = ref();
  const newStock = ref();
  const needFresh = ref(false); // 关闭弹窗页面是否需要查询列表

  const tableDataLoading = ref(false);

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        handleReset();
        handleSearch();
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
        needFresh.value = false;
        totalCount.value = null;
        newStock.value = null;
      }
    }
  );

  const handleSearch = async (type = 0) => {
    try {
      tableDataLoading.value = true;
      let checkedSList = [];
      props.rowCheckedList.forEach((item) => {
        checkedSList = checkedSList.concat(item.skuList);
      });
      const skuIdList = checkedSList.map((item) => item.skuId);
      const obj = type ? formData : {};
      const { data, count } = await getStockInfoApi({
        ...obj,
        skuIdList
      });
      tableData.value = data;
      totalCount.value = count;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };

  const validRules = ref({
    updateStock: [{ required: true, message: '请填写' }]
  });

  const handleApply = async () => {
    if (newStock.value !== 0 && !newStock.value)
      return ElMessage.warning('请输入库存');
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    checkedList.forEach((item) => {
      item.updateStock = newStock.value;
    });
  };

  // 批量调整
  const batchAdjustLoading = ref(false);
  const handleBatchAdjust = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    const errMap = await $table.validate(checkedList);
    if (errMap) return;
    try {
      batchAdjustLoading.value = true;
      const { data } = await batchUpdateStockApi(checkedList);
      needFresh.value = true;
      let checkedObj = {};
      data.forEach((item) => {
        checkedObj[item.productId] = {
          result: item.result,
          success: item.success
        };
      });
      checkedList.forEach((item) => {
        item.success = checkedObj[item.productId]?.success;
        item.result = checkedObj[item.productId]?.result;
      });
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batchAdjustLoading.value = false;
    }
  };

  // 清空
  const handleReset = () => {
    formData.isSale = '';
    formData.preAvailableStockQueryType = 1;
    formData.preAvailableStockUpperBound = '';
    formData.preAvailableStockLowerBound = '';
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
