<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="批量修改seller_sku"
      :width="1000"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <div class="disflex_between mb10">
        <div>数量({{ totalCount }})</div>
        <div>
          <el-button
            type="primary"
            :loading="batchUpdateLoading"
            @click="handleBatchUpdate"
            >批量修改</el-button
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
        <vxe-column field="storeAcct" title="店铺名称" />
        <vxe-column field="productId" title="product_id" />
        <vxe-column field="shopSkuId" title="shop_sku_id" />
        <vxe-column field="sellerSku" title="原seller_sku" />
        <vxe-column field="newSellerSku" title="新seller_sku">
          <template #default="{ row }">
            <vxe-input
              v-model="row.newSellerSku"
              placeholder="请输入新seller_sku"
              clearable
              @change="handleResetResult(row)"
            />
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
  import { ref, watch, computed } from 'vue';
  import { handleResetResult } from '../config';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Object,
      default: () => {}
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
  const tableData = ref([]);
  const tableRef = ref();
  const totalCount = ref();
  const tableDataLoading = ref(false);
  const needFresh = ref(false);

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        getList();
      } else {
        if (needFresh.value) {
          const checkedOnlineRowObj = {};
          props.rowCheckedList.forEach((item) => {
            checkedOnlineRowObj[item.productId] = true;
          });
          emits('handleSearch', checkedOnlineRowObj);
        }
        needFresh.value = false;
      }
    }
  );

  const validRules = ref({
    newSellerSku: [{ required: true, message: '请填写' }]
  });

  const getList = async () => {
    try {
      tableDataLoading.value = true;
      const data = [
        {
          stock: 12,
          onlineNum: 1,
          sellerSku: 'HADK8F75-1',
          storeAcct: '店铺',
          productId: '1729393094264786836',
          shopSkuId: '1729393268747046905'
        },
        {
          stock: 121,
          onlineNum: 11,
          sellerSku: 'HADK8F75-11',
          storeAcct: '店铺1',
          productId: '17293930942647868361',
          shopSkuId: '17293932687470469051'
        }
      ];
      const count = 1;
      tableData.value = data;
      totalCount.value = count;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };
  const batchUpdateLoading = ref(false);
  const handleBatchUpdate = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    checkedList.forEach((item) => {
      item.result = '';
    });
    const errMap = await $table.validate(checkedList);
    if (errMap) return;
    try {
      batchUpdateLoading.value = true;
      // Todo 调接口
      needFresh.value = true;
      let checkedObj = {};
      checkedList.forEach((item, index) => {
        if (index % 2 === 0) {
          checkedObj[item.productId] = {
            success: true,
            result: '操作成功'
          };
        } else {
          checkedObj[item.productId] = {
            success: false,
            result: '操作失败'
          };
        }
      });
      checkedList.forEach((item) => {
        (item.success = checkedObj[item.productId]?.success),
          (item.result = checkedObj[item.productId]?.result);
      });
      console.log('object :>> ', checkedList);
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batchUpdateLoading.value = false;
    }
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
