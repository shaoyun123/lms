<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="区域定价"
      width="60%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <vxe-table
        ref="tableRef"
        height="500"
        border
        :loading="tableDataLoading"
        :row-config="{ isHover: true }"
        :column-config="{ resizable: true }"
        :data="tableData"
      >
        <vxe-column :title="firstColumnTitle" prop="skuImage" width="80">
          <template #default="{ row }">
            <div>
              <ImagePop :src="row.skuImage" width="60px" height="60px" />
              <p>{{ row.skuPropertyName }}-{{ row.skuPropertyValue }}</p>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          v-for="(itemColumn, index) in tableColumns"
          :key="index"
          :prop="itemColumn"
          width="80"
        >
          <template #header>
            <div class="sku_header_item">
              {{ itemColumn }}零售价({{ currencyCode }})
            </div>
          </template>
          <template #default="{ row }">
            <div>
              <p class="bg-gray">
                {{ row.regionPrices[index].basePrice }}
              </p>
              <p class="bg-gray">
                {{ row.regionPrices[index].freightFee }}
              </p>
              <p class="text-bold">
                {{ row.regionPrices[index].price }}
              </p>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { getRegionPrice } from '@/api/publishs/aehalfhosted';
  import ImagePop from '@/components/ImagePop/index.vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    selectProductId: {
      type: String,
      default: () => ''
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
        getTableList();
      }
    }
  );

  const tableRef = ref();

  const tableDataLoading = ref(false);
  const tableData = ref([]);
  const tableColumns = ref([]);
  const currencyCode = ref('');
  const firstColumnTitle = ref('');

  const getTableList = async () => {
    tableDataLoading.value = true;

    const { data } = await getRegionPrice({
      productId: props.selectProductId
    }).finally(() => (tableDataLoading.value = false));

    tableData.value = data.skus;
    firstColumnTitle.value = data.skuPropertyName;
    tableColumns.value = data.regionPriceHeader;
    currencyCode.value = data.currencyCode;
  };
</script>

<style lang="scss" scoped>
  .sku_header {
    display: flex;
    .sku_header_item {
      flex: 1;
    }
  }
  .bg-gray {
    color: #333;
    font-size: 12px;
  }
  .text-bold {
    font-weight: bold;
  }
</style>
