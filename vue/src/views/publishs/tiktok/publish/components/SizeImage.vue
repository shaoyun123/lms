<template>
  <div class="size_image_wrapper">
    <div class="disflex">
      <el-button type="primary" class="mr20" @click="handleOpenUrlDialog"
        >网络图片</el-button
      >
      <el-upload
        action
        class="mr20"
        :http-request="handleUpload"
        :show-file-list="false"
        accept="image/*"
      >
        <el-button type="primary" :loading="localLoading">本地图片</el-button>
      </el-upload>
      <el-button type="primary" @click="handleTplImg">模板图片</el-button>
    </div>
    <ImagePop :src="imageUrl" class="mt10" :width="'200px'" :height="'200px'" />
    <el-button class="ml170" type="primary" link @click="handleRemove"
      >移除</el-button
    >

    <!-- 网络图片 -->
    <teleport to="body">
      <el-dialog
        v-model="imgUrlVisible"
        width="600px"
        title="网络图片"
        :close-on-click-modal="false"
      >
        <el-input
          v-model="imgUrls"
          type="textarea"
          :rows="9"
          placeholder="换行分割"
        />
        <template #footer>
          <el-button type="primary" @click="handleSaveUrl()">保存</el-button>
          <el-button @click="imgUrlVisible = false">取消</el-button>
        </template>
      </el-dialog>
    </teleport>
    <!-- 模板图片 -->
    <teleport to="body">
      <ChooseTplImage
        v-model="tplImgVisible"
        :limit="remainderLimit"
        :params="tplImgParams"
        @get-tpl-img="getTplImg"
      />
    </teleport>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import { ElMessage } from 'element-plus';
  import { isUrl } from '@/utils/is';
  import { comBlobToDataURL } from '@/utils/upload';

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits([
    'update:modelValue',
    'getTableData',
    'validateImage'
  ]);

  const imageUrl = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  // 本地上传
  const localLoading = ref(false);
  const handleUpload = (rawFile) => {
    localLoading.value = true;
    comBlobToDataURL(rawFile.file, (url) => {
      imageUrl.value = url;
      emits('validateImage');
      localLoading.value = false;
    });
  };

  // 网络地址
  const imgUrlVisible = ref(false);
  const imgUrls = ref('');
  const handleOpenUrlDialog = () => {
    imgUrlVisible.value = true;
    imgUrls.value = '';
  };
  const handleSaveUrl = () => {
    const imgList = imgUrls.value.split('\n').filter((item) => !!item);
    if (imgList.length > 1) {
      return ElMessage.warning('最多支持1张图片上传');
    }
    // 判断url是否合法
    if (imgList.some((item) => !isUrl(item))) {
      return ElMessage.warning('输入地址不合法');
    }
    imageUrl.value = imgList[0];
    emits('validateImage');
    imgUrlVisible.value = false;
  };

  // 模板图片
  const tplImgVisible = ref(false);
  const remainderLimit = 1;
  const tplImgParams = ref({});
  const handleTplImg = async () => {
    await emits('getTableData');
    tplImgParams.value = {
      platCode: 'tiktok',
      prodSSkus: (props.tableData || [])
        .map((item) => item.prodSSku)
        .filter((item) => !!item)
    };
    tplImgVisible.value = true;
  };
  const getTplImg = (imgUrlList) => {
    imageUrl.value = imgUrlList[0];
    emits('validateImage');
  };

  const handleRemove = () => {
    imageUrl.value = '';
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  // .size_image_wrapper {
  //   :deep(.el-overlay-dialog) {
  //     height: unset !important;
  //     overflow-y: unset !important;
  //   }
  //   :deep(.el-dialog) {
  //     height: unset !important;
  //   }
  //   :deep(.el-dialog__body) {
  //     overflow-y: unset !important;
  //     height: unset !important;
  //   }
  // }
  .ml170 {
    margin-left: 170px;
  }
  .mt10 {
    margin-top: 10px;
  }
</style>
