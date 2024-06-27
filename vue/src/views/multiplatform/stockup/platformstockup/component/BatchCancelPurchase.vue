<template>
  <el-dialog
    width="30%"
    title="取消采购"
    :model-value="showDialog"
    destroy-on-close
    align-center
    @close="closeDialog"
  >
    <el-form
      ref="cancelFormRef"
      :model="form"
      label-width="48px"
      :rules="rules"
    >
      <el-form-item label="备注" prop="salespersonRemark">
        <el-input
          v-model="form.salespersonRemark"
          type="textarea"
          maxlength="200"
          :rows="6"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button
        type="primary"
        :loading="loading"
        @click="confirmCancel(cancelFormRef)"
        >确认取消</el-button
      >
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
  import { defineProps, defineEmits, reactive, ref } from 'vue';
  import { cancelOrderApi } from '@/api/multiplatform/platformstockup';
  import { ElMessage } from 'element-plus';

  const emit = defineEmits(['close', 'success']);

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    cancelOrderIdList: {
      type: Array,
      default: () => []
    }
  });

  const form = reactive({
    salespersonRemark: ''
  });

  const cancelFormRef = ref(null);

  const rules = reactive({
    salespersonRemark: [
      { required: true, message: '请填写备注', trigger: 'blur' }
    ]
  });
  const loading = ref(false);

  // 确认取消
  const confirmCancel = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        try {
          loading.value = true;
          const { code } = await cancelOrderApi({
            ...form,
            orderIds: props.cancelOrderIdList
          }).finally(() => {
            loading.value = false;
          });

          if (code === '0000') {
            ElMessage.success('取消成功！');
            emit('success');
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  const closeDialog = () => {
    emit('close');
  };
</script>
<style scoped lang="scss"></style>
