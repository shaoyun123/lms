<template>
  <el-dialog
    v-model="showWriteDeliver"
    title="填写发货单"
    width="30%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" class="deliver" :rules="formRules">
      <el-form-item label="发货单号" size="default" prop="deliverOrderSn">
        <el-input v-model="formData.deliverOrderSn" clearable></el-input>
      </el-form-item>
      <el-form-item label="LBX号" size="default" prop="lbxNo">
        <el-input v-model="formData.lbxNo" clearable></el-input>
      </el-form-item>
      <el-form-item
        label="预约时间"
        size="default"
        prop="expectedPickupTimeString"
      >
        <el-date-picker
          v-model="formData.expectedPickupTimeString"
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
  import { saveWriteDeliver } from '@/api/multiplatform/shipmentplan';
  import { ElMessage } from 'element-plus';
  import { transferDate } from '@/utils/common';
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    // 货件信息
    deliverInfo: {
      type: Object,
      default: () => {}
    },
    // 货件id
    id: {
      type: Number,
      default: 0
    },
    activeKey: {
      type: String,
      default: ''
    }
  });

  const showWriteDeliver = computed(() => {
    return props.isVisible;
  });

  const emits = defineEmits(['close', 'query']);
  const formRef = ref(null);
  const formData = reactive({
    id: '',
    lbxNo: '', // LBX号
    expectedPickupTimeString: '',
    deliverOrderSn: '' // 发货单号
  });

  onMounted(() => {
    let { lbxNo, expectedPickupTime, deliverOrderSn } = props.deliverInfo;
    formData.lbxNo = lbxNo;
    formData.expectedPickupTimeString = transferDate(expectedPickupTime);
    formData.deliverOrderSn = deliverOrderSn;
  });

  const formRules = reactive({
    lbxNo: [{ required: true, message: '请输入LBX号', trigger: 'blur' }],
    expectedPickupTimeString: [
      { required: true, message: '请填写预约时间', trigger: 'blur' }
    ]
  });

  // 关闭发货弹窗
  const handleClose = () => {
    // 清空表单
    formData.lbxNo = '';
    formData.expectedPickupTimeString = '';
    formData.deliverOrderSn = '';
    emits('close');
  };

  // 填写发货单
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        try {
          formData.id = props.id;
          formData.lbxNo = formData.lbxNo.replace(/\s/g, '');
          formData.deliverOrderSn = formData.deliverOrderSn.replace(/\s/g, '');
          const { code } = await saveWriteDeliver(formData);
          if (code === '0000') {
            ElMessage.success('填写发货单成功');
            handleClose();
            emits('query');
          }
        } catch (err) {
          console.log(err);
          // handleClose();
        }
      }
    });
  };
</script>

<style lang="scss" scoped>
  .deliver {
    :deep {
      .el-form-item .el-form-item__label {
        width: 90px;
      }
    }
  }
</style>
