<template>
  <el-dialog
    v-model="showEditDeliver"
    title="修改发货单"
    width="30%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" class="deliver" :rules="formRules">
      <el-form-item label="发货单号" size="default" prop="deliverOrderSn">
        <el-input v-model="formData.deliverOrderSn" clearable></el-input>
      </el-form-item>
      <el-form-item label="发货单面单" size="default" prop="fileList">
        <el-upload
          ref="uploadRef"
          v-model:file-list="formData.fileList"
          action=""
          class="upload_btn"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
        >
          <el-button type="primary" size="small">本地上传</el-button>
        </el-upload>
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
  import { reactive, ref, computed, defineEmits, onMounted } from 'vue';
  import { editDeliverOrder } from '@/api/multiplatform/shipmentplan';
  import { ElMessage, ElMessageBox } from 'element-plus';

  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    batchBeliverId: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['close', 'query']);

  const formRules = reactive({
    deliverOrderSn: [
      { required: true, message: '请输入发货单号', trigger: 'blur' }
    ]
    // fileList: [{ required: true, message: '请上传发货单面单', trigger: 'blur' }]
  });
  const formData = reactive({
    deliverOrderSn: '',
    fileList: []
  });

  onMounted(() => {
    // 清空表单内容
    formData.deliverOrderSn = '';
    formData.fileList = [];
  });

  const showEditDeliver = computed(() => {
    return props.isVisible;
  });

  const handleClose = () => {
    formRef.value.resetFields();
    emits('close');
  };
  const uploadRef = ref(null);

  const handleExceed = (files) => {
    uploadRef.value.clearFiles();
    const file = files[0];
    uploadRef.value.handleStart(file);
  };

  const formRef = ref(null);
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        try {
          let formParams = new FormData();
          formParams.append('file', formData.fileList[0]?.raw);
          formParams.append('deliverOrderSn', formData.deliverOrderSn.trim());
          formParams.append('ids', props.batchBeliverId);

          const { code, msg } = await editDeliverOrder(formParams);
          if (code === '0000') {
            ElMessage.success('修改发货单成功！');
            emits('query');
          } else {
            if (msg.indexOf('不属于同一发货单') > -1) {
              ElMessageBox.confirm(msg || '请求失败', '错误信息', {
                confirmButtonText: '确认',
                cancelButtonText: '一键复制',
                showCancelButton: true,
                type: 'error',
                dangerouslyUseHTMLString: true,
                beforeClose: (action, instance, done) => {
                  if (action === 'confirm') {
                    done();
                  }
                  if (action === 'cancel') {
                    let startChar = '[';
                    let endChar = ']';
                    let startIndex = msg?.indexOf(startChar) + 1;
                    let length = msg?.indexOf(endChar) - startIndex;
                    let copyVal = msg.substr(startIndex, length);
                    let input = document.createElement('input'); // 创建input对象
                    input.value = copyVal; // 设置复制内容
                    document.body.appendChild(input); // 添加临时实例
                    input.select(); // 选择实例内容
                    document.execCommand('Copy'); // 执行复制
                    document.body.removeChild(input); // 删除临时实例
                  }
                }
              });
            } else {
              ElMessageBox.alert(msg || '请求失败', '错误信息', {
                confirmButtonText: '确认',
                type: 'error',
                dangerouslyUseHTMLString: true
              });
            }
          }
          handleClose();
        } catch (err) {
          console.log(err);
          handleClose();
        }
      }
    });
  };
</script>
<style lang="scss" scoped>
  .upload_btn {
    width: 100%;
  }
</style>
