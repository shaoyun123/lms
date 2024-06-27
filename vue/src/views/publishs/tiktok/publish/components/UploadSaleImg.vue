<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="选择图片上传方式"
      :width="500"
      :close-on-click-modal="false"
    >
      <div class="disflex">
        <el-button type="primary" class="mr20" @click="handleOpenUrlDialog"
          >网络图片</el-button
        >
        <el-upload
          action
          :http-request="handleUpload"
          :show-file-list="false"
          accept="image/*"
        >
          <el-button type="primary">本地图片</el-button>
        </el-upload>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="imgUrlVisible"
      width="600px"
      title="网络图片"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="saleImgUrl"
        type="textarea"
        :rows="1"
        placeholder="仅支持一张图片"
      />
      <template #footer>
        <el-button type="primary" @click="handleSaveImgUrl()">确定</el-button>
        <el-button @click="imgUrlVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  import { isUrl } from '@/utils/is';
  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedSaleRow: {
      type: Object,
      default: () => {}
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'changeSaleImg']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const saleImgUrl = ref();
  const imgUrlVisible = ref(false);

  watch(
    () => imgUrlVisible.value,
    (val) => {
      if (!val) {
        saleImgUrl.value = null;
      }
    }
  );

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
            dialogVisible.value = false;
            emits('changeSaleImg', {
              row: props.checkedSaleRow,
              saleImgUrl: data
            });
          } else {
            throw statusText;
          }
        })
        .catch((err) => {
          console.log('err :>> ', err);
          ElMessage.error('上传图片失败');
        });
    });
  };

  //blob转换成base64
  const blobToDataURL = (blob, callback) => {
    let a = new FileReader();
    a.onload = function (e) {
      callback(e.target.result);
    };
    a.readAsDataURL(blob);
  };
  const handleOpenUrlDialog = () => {
    imgUrlVisible.value = true;
  };
  const handleSaveImgUrl = () => {
    if (!saleImgUrl.value) return ElMessage.warning('请输入图片地址');
    // 判断url是否合法
    if (!isUrl(saleImgUrl.value)) {
      return ElMessage.warning('输入地址不合法');
    }
    imgUrlVisible.value = false;
    dialogVisible.value = false;

    emits('changeSaleImg', {
      row: props.checkedSaleRow,
      saleImgUrl: saleImgUrl.value
    });
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
