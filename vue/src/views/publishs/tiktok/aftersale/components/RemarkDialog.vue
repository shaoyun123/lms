<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      class="dialog_wrapper"
      title="客服备注"
      :width="600"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="remarkText"
        type="textarea"
        :autosize="{ minRows: 3 }"
        placeholder="请输入内容"
      >
      </el-input>
      <template #footer>
        <el-button :loading="remarkLoading" type="primary" @click="handleRemark"
          >备注</el-button
        >
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, watch, toRef } from 'vue';
  import { editRemarkApi } from '@/api/publishs/tiktokaftersale';
  import { ElMessage } from 'element-plus';
  // eslint-disable-next-line
  const props = defineProps({
    rowData: {
      type: Object,
      default: () => {}
    },
    modelValue: {
      type: Boolean,
      default: true
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'changeData']);
  // console.log('object :>> ', props.rowData, props.modelValue);
  const remarkText = toRef(props.rowData, 'remark');
  // const remarkText = ref();

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  watch(dialogVisible, (val) => {
    if (val) {
      remarkText.value = props.rowData.remark;
    }
  });

  const remarkLoading = ref(false);
  const handleRemark = async () => {
    try {
      remarkLoading.value = true;
      const { msg } = await editRemarkApi({
        id: props.rowData.id,
        remarkText: remarkText.value
      });
      ElMessage.success(msg);
      emits('changeData', {
        row: props.rowData,
        key: 'remark',
        value: remarkText.value
      });
      dialogVisible.value = false;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      remarkLoading.value = false;
    }
  };
</script>

<style lang="scss" scoped></style>
