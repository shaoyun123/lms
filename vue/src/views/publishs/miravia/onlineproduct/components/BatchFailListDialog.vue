<template>
  <el-dialog
    v-model="dialogVisible"
    width="25%"
    style="max-height: 50%; overflow-x: auto"
    align-center
    title="提示"
    @close="handleClose"
  >
    <div class="failStrBox">
      <div
        v-for="itemKey in Object.keys(failGroupMap)"
        :key="itemKey"
        class="mb-20"
      >
        <div>listing{{ onlineOrOffLineType ? '上架' : '下架' }}失败:</div>
        <div>{{ failGroupMap[itemKey]?.join(',') }}</div>
        <div class="mt-4">失败原因: {{ itemKey }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
  import { computed, watch } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    failGroupMap: {
      type: Object,
      default: () => {}
    },
    onlineOrOffLineType: {
      type: Number,
      default: 0
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
      if (!val) {
        handleClose();
      }
    }
  );

  const handleClose = () => {
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  .mt-4 {
    margin-top: 4px;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
  .failStrBox {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    font-size: 14px;
    word-break: break-all;
    margin-top: -30px;
  }
</style>
