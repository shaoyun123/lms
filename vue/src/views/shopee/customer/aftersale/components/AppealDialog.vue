<template>
  <div class="appeal_wrapper">
    <el-dialog
      v-model="dialogVisible"
      title="申诉"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        label-width="80px"
        :rules="rules"
        size="default"
      >
        <el-form-item label="申诉类型" prop="disputeReason">
          <el-select v-model="formData.disputeReason" filterable>
            <el-option
              v-for="item in disputeReasonList"
              :key="item.code"
              :label="item.descCn"
              :value="item.code"
              clearable
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申诉原因" prop="disputeTextReason">
          <el-input
            v-model="formData.disputeTextReason"
            :rows="3"
            type="textarea"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="disputeEmail">
          <el-input
            v-model="formData.disputeEmail"
            clearable
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传图片" prop="disputeImages">
          <div>
            <div>已选{{ formData.disputeImages.length }}/3</div>
            <el-upload
              v-model:file-list="formData.disputeImages"
              list-type="picture-card"
              action
              :http-request="handleUpload"
              :on-remove="handleRemove"
              :on-preview="handlePictureCardPreview"
              :on-exceed="handleExceed"
              :limit="3"
              accept="image/*"
              multiple
              drag
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">拖拽 <em>点击上传</em></div>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button
            type="primary"
            :loading="appealLoading"
            @click="handleAppeal(formRef)"
            >提交申诉</el-button
          >
          <el-button @click="handleClose(formRef)">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="imgVisible" :close-on-click-modal="false">
      <img w-full :src="imageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, reactive, ref } from 'vue';
  import axios from 'axios';
  import { dispute } from '@/api/shopee/aftersale';
  import { ElMessage } from 'element-plus';
  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    disputeReasonList: {
      type: Array,
      default: () => []
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    pageType: {
      type: String || Number,
      default: 0
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'delData', 'handleSearch']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const formData = ref({ disputeImages: [] });
  const formRef = ref(null);
  const rules = reactive({
    disputeReason: [
      {
        required: true,
        message: '请选择申请类型',
        trigger: 'change'
      }
    ],
    disputeEmail: [
      {
        required: true,
        message: '请输入邮箱',
        trigger: 'blur'
      },
      {
        type: 'email',
        message: '请输入正确格式邮箱',
        trigger: ['blur', 'change']
      }
    ],
    disputeImages: [
      {
        required: true,
        trigger: ['change', 'click'],
        validator: (rule, value, callback) => {
          if (!value.length) {
            callback(new Error('请上传图片222'));
          } else {
            callback();
          }
        }
      }
    ]
  });
  const handleClose = (formEl) => {
    dialogVisible.value = false;
    formEl.resetFields();
  };
  const appealLoading = ref(false);
  const handleAppeal = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (!valid) return;
      appealLoading.value = true;
      try {
        const disputeImages = formData.value.disputeImages
          .map((item) => item.raw.url)
          .join();
        const { id, returnSn, storeAcctId } = props.rowData;
        const params = {
          ...formData.value,
          disputeImages,
          id,
          returnSn,
          storeAcctId
        };
        const { msg } = await dispute(params);
        appealLoading.value = false;
        ElMessage.success(msg || '操作成功');
        props.pageType === 0 ? emits('delData') : emits('handleSearch');
      } catch (err) {
        appealLoading.value = false;
        console.log('err :>> ', err);
      }
    });
  };
  const handleUpload = (rawFile) => {
    blobToDataURL(rawFile.file, function (base64) {
      const fd = new FormData();
      fd.append('AreaImgKey', base64);
      axios({
        method: 'post',
        url: '/api/lms/preProdDev/getBase64Img.html',
        data: fd
      })
        .then(({ data, status, statusText }) => {
          if (status === 200) {
            rawFile.file.url = data;
          } else {
            throw statusText;
          }
        })
        .catch(() => {
          ElMessage.error('上传图片失败');
        })
        .finally(() => {
          // loadingInstance.close();
        });
    });
  };
  const handleExceed = () => {
    ElMessage.warning('最多支持三张图片上传');
  };

  const imgVisible = ref(false);
  const imageUrl = ref('');
  const handlePictureCardPreview = (uploadFile) => {
    imageUrl.value = uploadFile.url;
    imgVisible.value = true;
  };
  const handleRemove = () => {
    console.log('formData.value :>> ', formData.value);
  };
  //blob转换成base64
  const blobToDataURL = (blob, callback) => {
    let a = new FileReader();
    a.onload = function (e) {
      callback(e.target.result);
    };
    a.readAsDataURL(blob);
  };
</script>

<style lang="scss" scoped>
  .appeal_wrapper {
    // :deep() ;
    .msg_requier_tag {
      color: #f56c6c;
    }
    :deep(.el-row + .el-row) {
      margin-top: 10px;
    }
    .msg_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
  }
</style>
