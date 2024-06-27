<template>
  <el-dialog
    id="imageDialog"
    v-model="showImageDialog"
    :title="title"
    width="55%"
    top="3%"
    :append-to-body="false"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <div class="img_container">
      <div class="main_image">
        <div class="main_left">
          <div>主图</div>
          <el-checkbox
            v-model="checkedAllCurImgs.mainImgs"
            label="全选"
            size="large"
            @change="handleCheckedAllImage('mainImgs')"
          />
        </div>
        <div class="main_right">
          <div
            v-for="(item, index) in allImageList.mainImgs"
            :key="index"
            class="image_item"
          >
            <el-checkbox
              v-model="item.checked"
              style="margin-left: 5px; margin-top: -5px"
              size="large"
              @change="handleCheckedImage('mainImgs')"
            ></el-checkbox>
            <img :src="item.name" class="item_img" />
          </div>
        </div>
      </div>
      <div class="assist_image">
        <div class="assist_left">
          <div>辅图</div>
          <el-checkbox
            v-model="checkedAllCurImgs.assiImgs"
            label="全选"
            size="large"
            @change="handleCheckedAllImage('assiImgs')"
          />
        </div>
        <div class="assist_right">
          <div
            v-for="(item, index) in allImageList.assiImgs"
            :key="index"
            class="image_item"
          >
            <el-checkbox
              v-model="item.checked"
              style="margin-left: 5px; margin-top: -5px"
              size="large"
              @change="handleCheckedImage('assiImgs')"
            ></el-checkbox>
            <img :src="item.name" class="item_img" />
          </div>
        </div>
      </div>
      <div class="other_image">
        <div class="other_left">
          <div>其他自拍图</div>
          <el-checkbox
            v-model="checkedAllCurImgs.otherSelfiesImages"
            label="全选"
            size="large"
            @change="handleCheckedAllImage('otherSelfiesImages')"
          />
        </div>
        <div class="other_right">
          <div
            v-for="(item, index) in allImageList.otherSelfiesImages"
            :key="index"
            class="image_item"
          >
            <el-checkbox
              v-model="item.checked"
              style="margin-left: 5px; margin-top: -5px"
              size="large"
              @change="handleCheckedImage('otherSelfiesImages')"
            ></el-checkbox>
            <img :src="item.name" class="item_img" />
          </div>
        </div>
      </div>
      <div class="product_image">
        <div class="product_left">
          <div>产品变种图</div>
          <el-checkbox
            v-model="checkedAllCurImgs.productVariationImages"
            label="全选"
            size="large"
            @change="handleCheckedAllImage('productVariationImages')"
          />
        </div>
        <div class="product_right">
          <div
            v-for="(item, index) in allImageList.productVariationImages"
            :key="index"
            class="image_item"
          >
            <el-checkbox
              v-model="item.checked"
              style="margin-left: 5px; margin-top: -5px"
              size="large"
              @change="handleCheckedImage('productVariationImages')"
            ></el-checkbox>
            <img :src="item.name" class="item_img" />
          </div>
        </div>
      </div>
      <div class="nas_image">
        <div class="nas_left">
          <div>NAS亚马逊图</div>
          <el-checkbox
            v-model="checkedAllCurImgs.nasAmazonImages"
            label="全选"
            size="large"
            @change="handleCheckedAllImage('nasAmazonImages')"
          />
        </div>
        <div class="nas_right">
          <div
            v-for="(item, index) in allImageList.nasAmazonImages"
            :key="index"
            class="image_item"
          >
            <el-checkbox
              v-model="item.checked"
              style="margin-left: 5px; margin-top: -5px"
              size="large"
              @change="handleCheckedImage('nasAmazonImages')"
            ></el-checkbox>
            <img :src="item.name" class="item_img" />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
  import { onMounted, ref, computed } from 'vue';
  import { getOriginImageApi } from '@/api/publishs/sheinpublish';
  import { getOriginFbaImageApi } from '@/api/publishs/sheinmallpublish';
  import { ElMessage, ElLoading } from 'element-plus';
  import { tansferImageApi } from '@/api/publishs/sheinpublish';

  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    prodIds: {
      type: Array,
      default: () => []
    },
    platCode: {
      type: String,
      default: ''
    },
    action: {
      // 0 细节图 1 方形图
      type: String,
      default: '0'
    },
    imageInfoList: {
      type: Array,
      default: () => []
    },
    imageRowIndex: {
      type: Number,
      default: 0
    },
    fbaObj: {
      type: Object,
      default: () => ({})
    }
  });

  const emits = defineEmits(['close', 'choose']);

  const title = ref('');
  const imageLimit = ref(0);

  onMounted(() => {
    if (props.action === '0') {
      imageLimit.value = 11;
      title.value = `商品细节图(最多选择${imageLimit.value}张)`;
    }
    if (props.action === '1') {
      imageLimit.value = 1;
      title.value = `方形图(最多选择${imageLimit.value}张)`;
    }
    getImageList();
  });

  const showImageDialog = computed(() => {
    return props.isVisible;
  });

  const allImageList = ref({});
  const checkedAllCurImgs = ref({
    mainImgs: false,
    assiImgs: false,
    otherSelfiesImages: false,
    productVariationImages: false,
    nasAmazonImages: false
  });
  const handleCheckedAllImage = (type) => {
    allImageList.value[type] = (allImageList.value[type] || []).map((item) => ({
      ...item,
      checked: checkedAllCurImgs.value[type]
    }));
  };
  const handleCheckedImage = (type) => {
    const unChecked = (allImageList.value[type] || []).filter(
      (item) => !item.checked
    );
    checkedAllCurImgs.value[type] = !unChecked.length;
  };

  // 获取图片
  const getImageList = async () => {
    try {
      let params = {
        prodPIds: props.prodIds,
        platCode: props.platCode
      };
      let _getImageApi = getOriginImageApi;
      if (props.fbaObj.isFba) {
        params = {
          fbaProductId: props.fbaObj.fbaProductId
        };
        _getImageApi = getOriginFbaImageApi;
      }
      const { code, data } = await _getImageApi(params);
      if (code === '0000') {
        (data[0]?.mainImgs || []).forEach((item) => {
          item.checked = false;
          item.isPopover = false;
        });
        (data[0]?.assiImgs || []).forEach((item) => {
          item.checked = false;
          item.isPopover = false;
        });
        (data[0]?.otherSelfiesImages || []).forEach((item) => {
          item.checked = false;
          item.isPopover = false;
        });
        (data[0]?.productVariationImages || []).forEach((item) => {
          item.checked = false;
          item.isPopover = false;
        });
        (data[0]?.nasAmazonImages || []).forEach((item) => {
          item.checked = false;
          item.isPopover = false;
        });
        allImageList.value = data[0] || {};
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    let imageList = [];
    const mainImgs = allImageList.value?.mainImgs || [];
    const assiImgs = allImageList.value?.assiImgs || [];
    const otherSelfiesImages = allImageList.value?.otherSelfiesImages || [];
    const productVariationImages =
      allImageList.value?.productVariationImages || [];
    const nasAmazonImages = allImageList.value?.nasAmazonImages || [];
    imageList = [
      ...mainImgs,
      ...assiImgs,
      ...otherSelfiesImages,
      ...productVariationImages,
      ...nasAmazonImages
    ];
    imageList = imageList?.filter((item) => item.checked);
    let imageNum =
      props.action === '0'
        ? props.imageInfoList[props.imageRowIndex]?.detailImgList.length
        : props.imageInfoList[props.imageRowIndex]?.squareImgUrl.length;

    if (imageList?.length + imageNum > imageLimit.value) {
      return ElMessage.warning(
        `最多还能选择${imageLimit.value - imageNum}张图片！`
      );
    }
    if (props.action === '0') {
      let firstImage = Object.assign({}, imageList[0]);
      firstImage.isFirst = true;
      imageList.unshift(firstImage);
    } else {
      imageList = imageList?.filter((item) => !item.isFirst);
    }
    transferImage(imageList);
    // imageList.forEach((item) => (item.imageUrl = item.name));
    // emits('choose', imageList);
    // handleCancel();
  };

  // 细节图 方形图 调整像素 将 1000 * 1000 调整为 1340 * 1785
  const transferImage = (imageList) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // 细节图 1340*1785
    // 方形图 1200*1200
    // let top = '';
    // if (props.action === '0') {
    //   canvas.width = 1340;
    //   canvas.height = 1785;
    //   top = 222;
    // }

    // if (props.action === '1' || type === 'square') {
    //   canvas.width = canvas.height = 1200;
    //   top = 0;
    // }

    const loadingInstance = ElLoading.service({
      text: '图片尺寸裁剪中，请稍后...',
      target: '#imageDialog'
    });
    Promise.all(
      imageList.map(function (item) {
        return new Promise(function (resolve) {
          const image = new Image();
          image.src = item.name;
          image.setAttribute('crossOrigin', 'Anonymous');
          image.onload = async () => {
            let top = '';
            if (props.action === '0' && !item.first) {
              // canvas.width = 1340;
              // canvas.height = 1785;
              // top = 222;
              canvas.width = 1000;
              canvas.height = 1000;
              top = 0;
            }

            if (props.action === '1' || item.isFirst) {
              canvas.width = canvas.height = 1200;
              top = 0;
            }
            // 在 canvas 上绘制原始图片，并缩放到目标尺寸
            ctx.fillStyle = '#fff';
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < imageData.data.length; i += 4) {
              // 当该像素是透明的，则设置成白色
              if (imageData.data[i + 3] == 0) {
                imageData.data[i] = 255;
                imageData.data[i + 1] = 255;
                imageData.data[i + 2] = 255;
                imageData.data[i + 3] = 255;
              }
            }
            ctx.putImageData(imageData, 0, 0);

            ctx.drawImage(image, 0, top, canvas.width, canvas.width);
            // 将 canvas 转换为新的图片文件
            const newImageURL = canvas.toDataURL('image/jpeg');
            item.imageUrl = newImageURL;

            // 将图片base64转换为图片链接
            let reg =
              /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
            if (reg.test(item.imageUrl)) {
              let obj = {
                base64FileStr: item.imageUrl
              };

              const { code, msg } = await tansferImageApi(obj);
              if (code === '0000') {
                item.imageUrl = msg || '';
              }
            }
            resolve(item);
          };
          image.onerror = (err) => {
            console.log('error', err);
            resolve(item);
          };
        });
      })
    ).then(function (data) {
      // 等所有的返回结果
      loadingInstance.close();
      emits('choose', data);
      handleCancel();
    });
  };

  const handleCancel = () => {
    emits('close');
  };
</script>
<style lang="scss" scoped>
  .img_container {
    max-height: 550px;
    overflow-y: auto;
  }
  .main_image,
  .assist_image,
  .other_image,
  .product_image,
  .nas_image {
    display: flex;
    width: 100%;
    margin-bottom: 10px;
  }
  .main_left,
  .assist_left,
  .other_left,
  .product_left,
  .nas_left {
    width: 100px;
    padding-top: 10px;
    min-height: 40px;
    box-sizing: border-box;
  }
  .main_right,
  .assist_right,
  .other_right,
  .product_right,
  .nas_right {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .image_item {
    position: relative;
    width: 100px;
    height: 100px;
    margin-left: 10px;
    margin-bottom: 10px;
    border: 1px dashed #ddd;
    .el-checkbox {
      position: absolute;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
<style>
  #screenShotPanel {
    z-index: 9999;
  }
</style>
