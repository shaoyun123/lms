<template>
  <el-form-item label="店铺" :prop="formItemProp" class="search_item_cascader">
    <el-cascader
      v-model="storeValue"
      :options="storeList"
      :filter-method="filterStore"
      filterable
      clearable
      collapse-tags
      :props="{ multiple: true }"
    ></el-cascader>
  </el-form-item>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { getStoreList } from '@/api/common';
  import { computed } from 'vue';
  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    formItemProp: {
      type: String,
      default: ''
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue']);
  const storeValue = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const storeList = ref();
  onMounted(async () => {
    const { data } = await getStoreList('shopee');
    storeList.value = data.children;
  });
  const filterStore = (node, keyword) => {
    const label = node?.label?.trim();
    const text = node?.text?.trim();
    const _keyword = keyword.trim().replaceAll('，', ',').split(',');
    const hasLabel = _keyword.some((item) => label.includes(item));
    const hasText = _keyword.some((item) => text.includes(item));
    if (hasLabel || hasText) {
      return node;
    }
  };
</script>

<style lang="scss" scoped>
  .search_item_cascader {
    :deep(.el-input) {
      height: 24px;
      width: 120px;
    }
    :deep(.el-cascader__tags .el-tag) {
      margin: 0 0 0 5px;
    }
    :deep(.el-tag--small) {
      padding: 0 2px;
    }
    :deep(.el-cascader__tags) {
      flex-wrap: nowrap;

      span:first-child {
        max-width: 40px;
      }
      span:last-child {
        width: 30px;
      }
      input {
        min-width: 10px;
        height: auto;
        margin: 0 0 0 4px;
      }
      .el-tag--info + input {
        margin: 0;
      }
    }
  }
</style>
