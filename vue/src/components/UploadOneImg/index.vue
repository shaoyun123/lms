<template>
  <div class="disflex">
    <ImagePop :src="imageUrl" :width="width" :height="height" />
    <div class="left_btns">
      <el-button type="primary" link @click="handleOpenUrlDialog"
        >网络图片</el-button
      >
      <el-upload
        action
        class="mr20"
        :http-request="handleUpload"
        :show-file-list="false"
        accept="image/*"
      >
        <el-button type="primary" link :loading="localLoading"
          >本地图片</el-button
        >
      </el-upload>
      <el-button type="primary" link @click="handleTplImg">模板图片</el-button>
      <el-button type="danger" link @click="handleRemove">移除</el-button>
    </div>

    <!-- 本地图片 -->
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
    <!-- 模板图片 -->
    <ChooseTplImage
      v-model="tplImgVisible"
      :limit="remainderLimit"
      :params="params"
      @get-tpl-img="getTplImg"
    />
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
    height: {
      type: String,
      default: '80px'
    },
    width: {
      type: String,
      default: '80px'
    },
    params: {
      type: Object,
      default: () => ({})
    }
  });

  const emits = defineEmits(['update:modelValue', 'validateImage']);

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
  const handleTplImg = async () => {
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
  .disflex {
    display: flex;
  }
  .left_btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
  }
</style>
