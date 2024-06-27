<template>
  <el-dialog
    v-model="showBatchWritePickUp"
    title="修改揽收单"
    width="30%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" class="pickUp" :rules="formRules">
      <el-form-item label="LBX号" size="default" prop="lbxNo">
        <el-input v-model="formData.lbxNo" clearable></el-input>
      </el-form-item>
      <el-form-item label="揽收单号" size="default" prop="pickUpNo">
        <el-input v-model="formData.pickUpNo" clearable></el-input>
      </el-form-item>
      <el-form-item label="预约时间" size="default" prop="expectedPickupTime">
        <el-date-picker
          v-model="formData.expectedPickupTime"
          type="datetime"
          placeholder="请选择"
          arrow-control
          style="width: 100%"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSave(formRef)"
          >提交</el-button
        >
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
  import { batchEditAePickUpNoAndLbxNoApi } from '@/api/multiplatform/shipmentplan';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    // 货件id
    shipmentIdList: {
      type: Array,
      default: () => []
    }
  });

  const showBatchWritePickUp = computed(() => {
    return props.isVisible;
  });

  const emits = defineEmits(['close', 'query']);
  const formRef = ref(null);
  const formData = reactive({
    lbxNo: '', // LBX
    pickUpNo: '', // 揽收单号
    expectedPickupTime: '' // 预约时间
  });

  onMounted(() => {});

  const formRules = reactive({
    lbxNo: [{ required: true, message: '请输入LBX号', trigger: 'blur' }],
    pickUpNo: [{ required: true, message: '请输入揽收单号', trigger: 'blur' }],
    expectedPickupTime: [
      { required: true, message: '请填写预约时间', trigger: 'blur' }
    ]
  });

  // 关闭发货弹窗
  const handleClose = () => {
    // 清空表单
    formRef.value.resetFields();
    emits('close');
  };

  const loading = ref(false);

  // 填写发货单
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        formData.pickUpNo = formData.pickUpNo.replace(/\s/g, '');
        formData.shipmentIdStr = props.shipmentIdList.join(',');

        try {
          loading.value = true;
          const { code } = await batchEditAePickUpNoAndLbxNoApi(
            formData
          ).finally(() => {
            loading.value = false;
          });
          if (code === '0000') {
            ElMessage.success('修改揽收单成功！');
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
