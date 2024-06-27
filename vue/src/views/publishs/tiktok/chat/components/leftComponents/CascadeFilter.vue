<template>
  <el-form-item :prop="formItemProp" class="search_item_cascader">
    <el-cascader
      v-model="storeValue"
      :options="storeOptionList"
      :filter-method="filterStore"
      filterable
      clearable
      collapse-tags
      :placeholder="cascadeDefaultText"
      :props="{ multiple: true, emitPath: false }"
    ></el-cascader>
  </el-form-item>
</template>

<script setup>
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
    },
    // placeholder
    cascadeDefaultText: {
      type: String,
      default: '请选择'
    },
    // 是否显示label
    isShowLabel: {
      type: Boolean,
      default: true
    },
    // TKchat 站点 客服 联动店铺数据
    storeOptionList: {
      type: Array,
      default: () => []
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
