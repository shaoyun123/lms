<template>
  <el-input
    v-model="internalValue"
    :placeholder="placeholder"
    v-bind="attrs"
    @change="handleInput"
    @blur="handleBlur"
  />
</template>

<script setup name="ZInputNumber">
  import { ref, watch, useAttrs } from 'vue';

  const emits = defineEmits(['update:modelValue', 'blur']);
  const attrs = useAttrs();
  const props = defineProps({
    modelValue: {
      type: [Number, String],
      default: undefined
      // required: true
    },
    min: {
      type: Number,
      default: -Infinity
    },
    max: {
      type: Number,
      default: Infinity
    },
    precision: {
      type: Number,
      default: 0
    },
    // step: {
    //   type: Number,
    //   default: 1
    // },
    placeholder: {
      type: String,
      default: ''
    }
  });
  const internalValue = ref(props.modelValue);

  // 当输入值变化时，处理并触发事件
  const handleInput = (val) => {
    // 检查输入是否是"-"
    if (val === '-' || val === '') {
      internalValue.value = val;
      emits('update:modelValue', internalValue.value);
      return;
    }
    let value = Number(val);

    // 如果输入的不是数字，就使用原来的值
    if (isNaN(value)) {
      internalValue.value = props.modelValue;
      emits('update:modelValue', internalValue.value);
      return;
    }

    // 处理最小值和最大值
    if (value < props.min) {
      value = props.min;
    }
    if (value > props.max) {
      value = props.max;
    }

    // 处理精度和步长
    value = parseFloat(value.toFixed(props.precision));
    // value = Math.round(value / props.step) * props.step;

    // 更新内部值并触发事件
    internalValue.value = value;
    emits('update:modelValue', value);
  };

  const handleBlur = (e) => {
    // 对blur事件进行处理
    emits('blur', e);
  };

  watch(
    () => props.modelValue,
    (newValue) => {
      internalValue.value = newValue;
    }
  );
</script>
