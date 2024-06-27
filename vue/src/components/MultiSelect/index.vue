<template>
  <el-select
    v-model="selectValue"
    multiple
    clearable
    filterable
    v-bind="attrs"
    :class="selectValue?.length > 1 ? 'hide_tag' : ''"
  >
    <template #prefix>
      <el-tag v-if="selectValue?.length > 1" type="info">
        已选{{ selectValue?.length }}项</el-tag
      >
    </template>
    <el-option
      v-for="item in optionObj.optionList"
      :key="optionObj.value ? item[optionObj.value] : item"
      :label="optionObj.label ? item[optionObj.label] : item"
      :value="optionObj.value ? item[optionObj.value] : item"
      :disabled="needOptionDisabled ? getDisabled(item) : false"
    ></el-option>
  </el-select>
</template>

<script setup>
  import { computed, useAttrs } from 'vue';
  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    optionObj: {
      type: Object,
      default: () => ({})
    },
    needOptionDisabled: {
      type: Boolean,
      default: false
    },
    optionDisabledParam: {
      type: [Object, Array],
      default: () => ({})
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'optionDisabled']);
  const attrs = useAttrs();
  const selectValue = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const getDisabled = (optionObj) => {
    let curOptionDisabled = false;
    emits(
      'optionDisabled',
      optionObj,
      props.optionDisabledParam,
      (disabled) => {
        curOptionDisabled = disabled;
      }
    );
    return curOptionDisabled;
  };
</script>

<style lang="scss" scoped>
  .hide_tag {
    :deep(.el-select__selected-item) {
      display: none;
    }
    :deep(.el-select__input) {
      margin-left: 78px;
    }
    :deep(.el-select__input.is-small) {
      margin-left: 65px;
    }
    :deep(.el-select__input.is-large) {
      margin-left: 85px;
    }
  }
</style>
