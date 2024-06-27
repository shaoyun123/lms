<template>
  <el-dialog
    v-model="showAdjustPriceDialog"
    width="45%"
    title="导入调整价格配置"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      ref="exportFormRef"
      :model="exportFormData"
      :rules="formRules"
      style="padding: 0 20px"
      label-width="110"
      align="center"
    >
      <el-form-item label="调整方式" prop="adjustType">
        <el-radio-group v-model="exportFormData.adjustType">
          <el-radio value="0">全量调整</el-radio>
          <el-radio value="1">仅调整数据涨价</el-radio>
          <el-radio value="2">仅调整数据降价</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="选择文件" prop="file">
        <el-upload
          ref="upload"
          v-model:file-list="fileList"
          action=""
          :show-file-list="true"
          :on-change="handleChange"
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceed"
          class="upload"
        >
          <el-button type="primary">上传文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirmExport(exportFormRef)">
          确认
        </el-button>
        <el-button @click="close">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { reactive, ref, computed } from 'vue';
  import { adjustPriceByExcelAPI } from '@/api/publishs/tiktokonlineproduct';
  import { ElMessage, ElMessageBox } from 'element-plus';

  const props = defineProps({
    dialogVisible: {
      type: Boolean,
      default: false
    }
  });
  const emits = defineEmits(['close']);

  const showAdjustPriceDialog = computed(() => {
    return props.dialogVisible;
  });
  const exportFormData = reactive({
    file: null,
    adjustType: '0'
  });
  const fileList = ref([]);
  const exportFormRef = ref(null);

  const validateFile = (rule, value, callback) => {
    if (!exportFormData.file) {
      callback(new Error('请上传文件'));
    } else {
      callback();
    }
  };

  const handleExceed = () => {
    ElMessage.warning('只能上传一个文件');
  };
  const formRules = reactive({
    adjustType: [
      { required: true, trigger: 'blur', message: '请选择调价类型' }
    ],
    file: [{ required: true, trigger: 'change', validator: validateFile }]
  });

  const handleChange = (file, files) => {
    exportFormData.file = files;
  };

  const confirmExport = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        let formData = new FormData();
        exportFormData.file?.forEach((item) => {
          if (item.raw) {
            formData.append('file', item.raw);
          }
        });
        formData.append('adjustType', exportFormData.adjustType);
        const { code, data, msg } = await adjustPriceByExcelAPI(formData);
        if (code === '0000') {
          ElMessageBox.alert(
            '导入成功！请到任务中心查看导入结果！',
            '提示信息',
            {
              confirmButtonText: '确认',
              type: 'success'
            }
          ).then(() => {
            emits('close', true);
          });
        } else {
          if (data?.length) {
            const dataStr = data
              .map(
                (item) =>
                  '店铺名：' +
                  item.storeAcct +
                  '，失败原因：' +
                  item.errorMessage
              )
              .join('<br>');
            ElMessageBox.alert(
              `<div style="max-height:600px;overflow-y: auto">${dataStr}</div>`,
              '导入失败店铺',
              {
                dangerouslyUseHTMLString: true,
                customClass: 'custom-message-box'
              }
            );
          } else {
            ElMessage.warning(msg);
          }
        }
      }
    });
  };
  const close = () => {
    exportFormData.file = [];
    exportFormData.adjustType = '0';
    fileList.value = [];
    emits('close');
  };
</script>
<style lang="scss" scoped>
  .upload {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
</style>
<style lang="scss">
  .custom-message-box {
    min-width: 500px;
  }
</style>
