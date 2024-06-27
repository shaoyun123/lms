<template>
  <el-dialog
    v-model="dialogVisible"
    title="在线listing数据筛选"
    width="800"
    align-center
    :close-on-click-modal="false"
  >
    <el-form label-width="100" size="default">
      <el-form-item label="店铺">
        <ZCascader
          v-model="formData.storeAcctIdList"
          :data="storeList"
        ></ZCascader>
      </el-form-item>
      <el-form-item label="listing销量">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-select v-model="formData.saleType" clearable filterable>
              <el-option
                v-for="item in saleTypeList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <ZInputNumber v-model="formData.saleMin" clearable />
          </el-col>
          <el-col :span="1" class="common_ta_center">-</el-col>
          <el-col :span="6">
            <ZInputNumber v-model="formData.saleMax" clearable />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="formData.isProhibitedCategoryUpdate"
          :label="true"
          size="large"
          >修改后为站点禁售类目时，仍要修改</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="formData.isSameCategoryUpdate"
          :label="true"
          size="large"
          >修改后类目与原类目一致时，仍要修改</el-checkbox
        >
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, ref, onMounted } from 'vue';
  import { getStoreList } from '@/api/common';
  import ZCascader from '@/components/ZCascader/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { updateCategoryApi } from '@/api/publishs/tiktokextrainfo';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: true
    },
    checkedList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue', 'openJunpPage']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const formData = ref({});
  const saleTypeList = ref([
    { label: '7天销量', value: 7 },
    { label: '30天销量', value: 30 },
    { label: '60天销量', value: 60 },
    { label: '90天销量', value: 90 },
    { label: '180天销量', value: 180 },
    { label: '365天销量', value: 365 }
  ]);
  const storeList = ref([]);
  onMounted(async () => {
    const { data } = await getStoreList('tiktok');
    storeList.value = data.children;
  });

  const handleConfirm = async () => {
    const idList = props.checkedList.map((v) => v.id);
    await updateCategoryApi({
      ...formData.value,
      idList
    });
    emits('openJunpPage');
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped></style>
