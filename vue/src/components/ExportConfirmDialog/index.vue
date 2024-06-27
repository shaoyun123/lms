<template>
  <el-dialog
    v-model="dialogVisible"
    width="45%"
    :title="exportTitle"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-divider content-position="left"><h3>店铺信息</h3></el-divider>
    <div class="px-12">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
      <div>
        <el-checkbox-group
          v-model="checkedGoodsInfoList"
          @change="handleCheckedCitiesChange"
        >
          <div>
            <el-checkbox
              v-for="item in goodsInfoList"
              :key="item"
              :disabled="requireCheckedField.includes(item.field)"
              :label="item.field"
              >{{ item.name }}</el-checkbox
            >
          </div>
        </el-checkbox-group>
      </div>
    </div>
    <el-divider content-position="left"
      ><h3><span class="text-red">*</span>数据范围</h3></el-divider
    >

    <div class="px-12">
      <el-radio-group v-model="checkedExportType" class="ml-4">
        <el-radio :value="1" size="large">导出列表选中数据</el-radio>
        <el-radio :value="2" size="large">导出查询条件中的数据</el-radio>
      </el-radio-group>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirmExport"> 导出 </el-button>
        <el-button @click="close">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    exportTitle: {
      type: String,
      default: () => ''
    },
    goodsInfoListCopy: {
      type: Array,
      default: () => []
    },
    requireCheckedField: {
      type: Array,
      default: () => ['storeAcct']
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits([
    'update:modelValue',
    'checkedExportInfo',
    'close'
  ]);
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
        goodsInfoList.value = props.goodsInfoListCopy;
        // 开始默认全选
        checkedGoodsInfoList.value = goodsInfoList.value.map(
          (item) => item.field
        );
      }
    }
  );

  const goodsInfoList = ref([]);
  const checkAll = ref(true);
  const isIndeterminate = ref(true);
  const checkedGoodsInfoList = ref([]);

  // 全选
  const handleCheckAllChange = (val) => {
    checkedGoodsInfoList.value = val
      ? goodsInfoList.value.map((item) => item.field)
      : ['storeAcct'];
    isIndeterminate.value = false;
  };

  // 勾选单个
  const handleCheckedCitiesChange = (value) => {
    const checkedCount = value.length;
    checkAll.value = checkedCount === goodsInfoList.value.length;
    isIndeterminate.value =
      checkedCount > 0 && checkedCount < goodsInfoList.value.length;
  };

  const checkedExportType = ref(1);

  // 点击导出
  const confirmExport = () => {
    const checkedExportInfo = {
      selectedExportFieldList: checkedGoodsInfoList.value,
      type: checkedExportType.value
    };
    emits('checkedExportInfo', checkedExportInfo);
  };

  // 点击关闭
  const close = () => {
    emits('close');
  };
</script>

<style lang="scss" scoped>
  :deep(.el-checkbox .el-checkbox__label) {
    width: 60px !important;
  }
  :deep(.el-checkbox.el-checkbox--small) {
    height: 35px !important;
  }
  .px-12 {
    padding: 0 12px;
  }
  .text-red {
    color: red;
    font-size: 12px;
  }
</style>
