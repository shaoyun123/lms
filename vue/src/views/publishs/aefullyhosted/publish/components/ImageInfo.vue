<template>
  <div class="image_wrapper">
    <el-form-item label="主图" prop="mainImages">
      <div>
        <div class="disflex">
          <el-button
            type="primary"
            class="mr10"
            @click="handleOpenUrlDialog('mainImages')"
            >网络图片</el-button
          >
          <el-upload
            ref="mainImagesLocalRef"
            action
            :http-request="handleUpload"
            :on-exceed="handleExceed"
            :show-file-list="false"
            :limit="MAX_IMAGE_LENGTH - mainImages.length"
            accept="image/*"
            multiple
          >
            <el-button
              type="primary"
              class="mr10"
              :loading="mainImagesLocalLoading"
              >本地图片</el-button
            >
          </el-upload>
          <el-button type="primary" @click="handleTplImg">模板图片</el-button>
          <el-button type="danger" @click="handleDelAllImg">删除全部</el-button>
          <span class="ml10"
            >(上传的图片像素:1000*1000,最多六张;支持拖动改变顺序)</span
          >
        </div>
        <div class="detail_image">
          <div v-for="(item, index) in mainImages" :key="item + index">
            <div class="detail_image_img">
              <img
                :id="index"
                class="small_img"
                :src="item"
                draggable="true"
                @dragstart="dragStart"
                @drop="drop"
                @dragover="dragover"
              />
            </div>
            <div class="detail_image_btns">
              <el-button link type="primary" @click="copy(item)"
                >复制链接</el-button
              >
              <el-button link type="danger" @click="handleRemoveImg(index)"
                >移除</el-button
              >
            </div>
            <div class="detail_image_btns">
              <el-button link type="primary" @click="handleSetWhiteImg(item)"
                >设置为白底图</el-button
              >
              <el-button link type="primary" @click="handleSetSceneImg(item)"
                >设置为场景图</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="营销图" prop="marketingImage">
      <div>
        <div class="disflex">
          <el-button
            type="primary"
            class="mr10"
            @click="handleOpenUrlDialog('market1Images')"
            >网络图片</el-button
          >
          <el-upload
            ref="market1ImagesLocalRef"
            action
            :http-request="handleUploadMarket1Images"
            :show-file-list="false"
            :limit="1"
            accept="image/*"
            multiple
          >
            <el-button
              type="primary"
              class="mr10"
              :loading="market1ImagesLoading"
              >本地图片</el-button
            >
          </el-upload>
          <span class="gray_text">
            (宽高比例必须为1:1,像素不能低于800x800)
          </span>
        </div>
        <div class="detail_image_img mt10" :style="{ height: '260px' }">
          <ImagePop :src="market1Images" width="150px" height="150px" />
          <div class="detail_image_btns">
            <span>1:1</span>
            <el-button link type="primary" @click="copy(market1Images)"
              >复制链接</el-button
            >
            <el-button link type="danger" @click="handleRemoveM1Img"
              >移除</el-button
            >
          </div>
        </div>
      </div>
      <div class="ml10">
        <div class="disflex">
          <el-button
            type="primary"
            class="mr10"
            @click="handleOpenUrlDialog('market2Images')"
            >网络图片</el-button
          >
          <el-upload
            ref="market2ImagesLocalRef"
            action
            :http-request="handleUploadMarket2Images"
            :show-file-list="false"
            :limit="1"
            accept="image/*"
            multiple
          >
            <el-button
              type="primary"
              class="mr10"
              :loading="market2ImagesLoading"
              >本地图片</el-button
            >
          </el-upload>
          <span class="gray_text">
            (宽高比例必须为3:4,像素不能低于750x1000)
          </span>
        </div>
        <div class="detail_image_img mt10" :style="{ height: '260px' }">
          <ImagePop :src="market2Images" width="150px" height="200px" />
          <div class="detail_image_btns">
            <span>3:4</span>
            <el-button link type="primary" @click="copy(market2Images)"
              >复制链接</el-button
            >
            <el-button link type="danger" @click="handleRemoveM2Img()"
              >移除</el-button
            >
          </div>
        </div>
      </div>
    </el-form-item>
    <!-- 网络图片 -->
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
      :limit="MAX_IMAGE_LENGTH - mainImages.length"
      :params="tplImgParams"
      @get-tpl-img="getTplImg"
    />
  </div>
</template>

<script setup>
  import { ref, watch, reactive } from 'vue';
  // import { comBlobToDataURL } from '@/utils/upload';
  import { uploadSizeApi } from '@/api/publishs/aefullyhostedpublish';
  import { copy } from '@/utils/common';
  import { isUrl } from '@/utils/is';
  import { MAX_IMAGE_LENGTH } from '../constants';
  import { ElMessage } from 'element-plus';
  import ImagePop from '@/components/ImagePop/index.vue';
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  import { tansferImageApi } from '@/api/publishs/sheinpublish';

  const props = defineProps({
    mainImages: {
      type: Array,
      default: () => []
    },
    market1Images: {
      type: String,
      default: ''
    },
    market2Images: {
      type: String,
      default: ''
    },
    tableSkuRef: {
      type: Object,
      default: () => ({})
    },
    fullTableData: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['changeImage', 'getTableData']);
  // 图片
  // 本地上传
  const mainImagesLocalRef = ref();
  const market1ImagesLocalRef = ref();
  const market2ImagesLocalRef = ref();
  const mainImagesLocalLoading = ref(false);
  const handleUpload = async (rawFile) => {
    let imgFormData = new FormData();
    imgFormData.append('file', rawFile.file);
    try {
      mainImagesLocalLoading.value = true;
      const { msg } = await uploadSizeApi(imgFormData);
      const urlList = props.mainImages.concat(msg);
      if (urlList.length > 6) {
        mainImagesLocalLoading.value = false;
        return ElMessage.warning(`最多支持${MAX_IMAGE_LENGTH}张图片上传`);
      } else {
        emits('changeImage', { type: 'mainImages', val: urlList });
      }
      mainImagesLocalRef.value.clearFiles();
    } catch (err) {
      console.log('err :>> ', err);
    }
    mainImagesLocalLoading.value = false;
  };
  const market1ImagesLoading = ref(false);
  const handleUploadMarket1Images = async (rawFile) => {
    let imgFormData = new FormData();
    imgFormData.append('file', rawFile.file);
    imgFormData.append('width', 800);
    imgFormData.append('height', 800);
    try {
      market1ImagesLoading.value = true;
      const { msg } = await uploadSizeApi(imgFormData);
      emits('changeImage', { type: 'market1Images', val: msg });
    } catch (err) {
      console.log('err :>> ', err);
    }
    market1ImagesLoading.value = false;
    market1ImagesLocalRef.value.clearFiles();
  };
  const market2ImagesLoading = ref(false);
  const handleUploadMarket2Images = async (rawFile) => {
    let imgFormData = new FormData();
    imgFormData.append('file', rawFile.file);
    imgFormData.append('width', 750);
    imgFormData.append('height', 1000);
    try {
      market2ImagesLoading.value = true;
      const { msg } = await uploadSizeApi(imgFormData);
      emits('changeImage', { type: 'market2Images', val: msg });
    } catch (err) {
      console.log('err :>> ', err);
    }
    market2ImagesLocalRef.value.clearFiles();
    market2ImagesLoading.value = false;
  };
  const handleExceed = () => {
    ElMessage.warning(`最多支持${MAX_IMAGE_LENGTH}张图片上传`);
  };
  // 网络地址
  const imgUrlVisible = ref(false);
  const imgType = ref();
  const imgUrls = ref('');
  const handleOpenUrlDialog = (type) => {
    imgUrlVisible.value = true;
    imgType.value = type;
  };
  watch(
    () => imgUrlVisible.value,
    (val) => {
      if (!val) {
        imgUrls.value = '';
      }
    }
  );
  const handleSaveUrl = () => {
    const imgList = imgUrls.value.split('\n').filter((item) => !!item);
    if (!imgList.length) {
      return ElMessage.warning('请输入图片地址');
    }
    if (imgType.value === 'mainImages') {
      if (MAX_IMAGE_LENGTH - imgList.length - props.mainImages.length < 0) {
        return ElMessage.warning(`最多支持${MAX_IMAGE_LENGTH}张图片上传`);
      }
      // 判断url是否合法
      if (imgList.some((item) => !isUrl(item))) {
        return ElMessage.warning('输入地址不合法');
      }
      const urlList = props.mainImages.concat(imgList);
      emits('changeImage', { type: 'mainImages', val: urlList });
    } else {
      if (imgList.length > 1) {
        return ElMessage.warning('最多支持一张图片');
      }
      emits('changeImage', { type: imgType.value, val: imgList[0] });
    }
    imgUrlVisible.value = false;
  };

  // 模板图片
  const tplImgVisible = ref(false);
  const remainderLimit = ref(0);
  const tplImgParams = ref({});
  const handleTplImg = async () => {
    await emits('getTableData');
    remainderLimit.value = MAX_IMAGE_LENGTH - props.mainImages.length;
    if (remainderLimit.value < 1) {
      return ElMessage.warning(`最多支持${MAX_IMAGE_LENGTH}张图片上传`);
    }
    tplImgVisible.value = true;
    tplImgParams.value = {
      platCode: 'AE全托管',
      prodSSkus: props.fullTableData.map((item) => item.prodSSku)
    };
  };
  const getTplImg = (imgUrlList) => {
    const urlList = props.mainImages.concat(imgUrlList);
    emits('changeImage', { type: 'mainImages', val: urlList });
  };

  const dropEl = reactive({
    startEl: null, // 拖动开始的元素
    endEl: null // 拖动的结束元素
  });
  const dragStart = (e) => {
    dropEl.startEl = e.target || e.srcElement;
  };

  const dragover = (e) => {
    e.preventDefault();
  };

  const drop = (e) => {
    dropEl.endEl = e.target || e.srcElement;
    e.preventDefault();
    // 拖动元素，放置目标
    if (dropEl.startEl && dropEl.endEl) {
      // 交换
      let startI = dropEl.startEl.id;
      let endI = dropEl.endEl.id;
      const _mainImages = JSON.parse(JSON.stringify(props.mainImages));
      _mainImages[startI] = dropEl.endEl.src;
      _mainImages[endI] = dropEl.startEl.src;
      emits('changeImage', { type: 'mainImages', val: _mainImages });
    }
  };
  const handleSetWhiteImg = (imgUrl) => {
    emits('changeImage', { type: 'market1Images', val: imgUrl });
  };
  const handleSetSceneImg = (imgUrl) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let image = new Image();
    image.src = imgUrl;
    image.setAttribute('crossOrigin', 'Anonymous');
    image.onload = async () => {
      const realWidth = image.width;
      const realHeight = image.height;
      canvas.width = realWidth - 250;
      canvas.height = realHeight;
      // // 在 canvas 上绘制原始图片，并缩放到目标尺寸
      // 将左右各裁剪125像素后， 放入3:4场景图
      ctx.drawImage(
        image,
        125,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      // 将 canvas 转换为新的图片文件
      const newImageURL = canvas.toDataURL('image/jpeg');

      // 将图片base64转换为图片链接
      let reg =
        /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
      if (reg.test(newImageURL)) {
        let obj = {
          base64FileStr: newImageURL
        };
        try {
          const { code, msg } = await tansferImageApi(obj);
          if (code === '0000') {
            emits('changeImage', { type: 'market2Images', val: msg || '' });
          }
        } catch (err) {
          console.log(err);
          emits('changeImage', { type: 'market2Images', val: imgUrl });
        }
      }
    };
  };
  // 移除图片
  const handleRemoveImg = (index) => {
    const urlList = JSON.parse(JSON.stringify(props.mainImages));
    urlList.splice(index, 1);
    emits('changeImage', { type: 'mainImages', val: urlList });
  };
  const handleRemoveM1Img = () => {
    emits('changeImage', { type: 'market1Images', val: '' });
  };
  const handleRemoveM2Img = () => {
    emits('changeImage', { type: 'market2Images', val: '' });
  };

  const handleDelAllImg = () => {
    emits('changeImage', { type: 'mainImages', val: [] });
  };
</script>

<style lang="scss" scoped>
  .image_wrapper {
    :deep(.el-overlay-dialog) {
      overflow-y: hidden;
    }
    :deep(.el-dialog) {
      height: auto !important;
    }
    :deep(.el-dialog__body) {
      overflow-y: auto !important;
      height: auto !important;
    }
  }
  .ml10 {
    margin-left: 10px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .disflex {
    display: flex;
  }
  .detail_image {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    img {
      width: 100%;
    }
    .detail_image_img {
      width: 150px;
      height: 150px;
      margin: 0 10px;
      overflow: hidden;
      border: 1px solid #999;
    }
    .detail_image_btns {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 5px;
    }
  }
  .mt10 {
    margin-top: 10px;
  }
</style>
