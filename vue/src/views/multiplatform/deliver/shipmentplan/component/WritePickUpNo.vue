<template>
  <el-dialog
    v-model="showWritePickUp"
    title="填写揽收单"
    width="30%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" class="pickUp" :rules="formRules">
      <el-form-item label="揽收单号" size="default" prop="pickUpNo">
        <el-input v-model="formData.pickUpNo" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleSave(formRef)">提交</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import {
    defineProps,
    defineEmits,
    computed,
    reactive,
    ref,
    onMounted
  } from 'vue';
  import { editPickUpNoApi } from '@/api/multiplatform/shipmentplan';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    // 货件id
    id: {
      type: Number,
      default: 0
    }
  });

  const showWritePickUp = computed(() => {
    return props.isVisible;
  });

  const emits = defineEmits(['close', 'query']);
  const formRef = ref(null);
  const formData = reactive({
    id: '',
    pickUpNo: '' // 揽收单号
  });

  onMounted(() => {});

  const formRules = reactive({
    pickUpNo: [{ required: true, message: '请输入揽收单号', trigger: 'blur' }]
  });

  // 关闭发货弹窗
  const handleClose = () => {
    // 清空表单
    formData.pickUpNo = '';
    emits('close');
  };

  // 填写发货单
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        try {
          formData.id = props.id;
          formData.pickUpNo = formData.pickUpNo.replace(/\s/g, '');
          const { code } = await editPickUpNoApi(formData);
          if (code === '0000') {
            ElMessage.success('填写揽收单成功！');
            handleClose();
            emits('query');
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
  };
</script>

<style lang="scss" scoped>
  .pickUp {
    :deep {
      .el-form-item .el-form-item__label {
        width: 90px;
      }
    }
  }
</style>
