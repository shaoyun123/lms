<template>
  <el-dialog
    v-model="dialogVisible"
    title="报错提示"
    width="700px"
    :align-center="true"
    :close-on-click-modal="false"
  >
    <template v-if="failData.mainItemFailList?.length">
      <h2>主商品</h2>
      <vxe-table
        ref="tableRef"
        :data="failData.mainItemFailList"
        max-height="500"
        border
      >
        <vxe-column field="itemId" title="item_id" width="100" />
        <vxe-column field="failMessage" title="失败原因"
      /></vxe-table>
    </template>
    <template v-if="failData.subItemFailList?.length">
      <h5>加购商品</h5>
      <vxe-table
        ref="tableRef"
        :data="failData.subItemFailList"
        max-height="500"
        border
      >
        <vxe-column field="modelId" title="vari_id" width="100" />
        <vxe-column field="failMessage" title="失败原因"
      /></vxe-table>
    </template>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, watch } from 'vue';
  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    failData: {
      type: Object,
      default: () => {}
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'closeDialogBySave']);
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
        emits('closeDialogBySave');
      }
    }
  );
</script>

<style lang="scss" scoped></style>
