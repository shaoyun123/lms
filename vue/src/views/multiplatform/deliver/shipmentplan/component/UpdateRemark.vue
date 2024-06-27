<template>
  <el-dialog
    v-model="dialogVisible"
    width="30%"
    title="修改采购备注"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules">
      <el-form-item prop="purchaseRemark">
        <el-input
          v-model="formData.purchaseRemark"
          :rows="4"
          type="textarea"
          placeholder="请输入采购备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSave(formRef)">确定</el-button>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, reactive, ref } from 'vue';
  import { batchEditPurchaseRemarkApi } from '@/api/multiplatform/shipmentplan';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    selectedData: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue', 'handleSearch']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const formRef = ref();
  const formData = ref({
    purchaseRemark: ''
  });
  const formRules = reactive({
    purchaseRemark: [
      { required: true, message: '请输入采购备注', trigger: 'blur' }
    ]
  });
  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const params = {
          ids: props.selectedData.map((v) => v.id),
          purchaseRemark: formData.value.purchaseRemark
        };
        const { msg } = await batchEditPurchaseRemarkApi(params);
        ElMessage.success(msg);
        emits('handleSearch');
        dialogVisible.value = false;
      } else {
        return false;
      }
    });
  };
</script>

<style lang="scss" scoped></style>
