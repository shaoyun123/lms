<template>
  <div class="row_middle_wrap">
    <div
      v-for="(img, imgIndex) in images"
      :key="img.url"
      class="row_middle_image_part"
    >
      <CardDragSort
        :id="img + '_' + imgIndex"
        :index="imgIndex"
        :type="partIndex + 'cardImg'"
        :move-card="moveCardImg"
      >
        <el-popover
          :visible="imgIndex === showImgIndex"
          placement="top"
          width="500px"
          :hide-after="0"
        >
          <template #default>
            <el-image :src="img.url" />
          </template>
          <template #reference>
            <div
              @mouseleave="setBigImgIndex(9999)"
              @mouseenter="setBigImgIndex(imgIndex)"
              @dragover="setBigImgIndex(9999)"
            >
              <el-image
                loading="lazy"
                :src="img.url"
                class="row_middle_image"
                @click="handleOpenTargetUrl(img.targetUrl)"
              >
                <template #placeholder>
                  <div class="image-slot">
                    Loading<span class="dot">...</span>
                  </div>
                </template>
              </el-image>
              <div class="img_btns">
                <el-icon
                  :color="img.targetUrl && '#409EFF'"
                  @click="handleAddTargetUrl(imgIndex, img.targetUrl)"
                  ><Link
                /></el-icon>
                <el-button type="danger" link @click="handleRemoveImg(imgIndex)"
                  >移除</el-button
                >
              </div>
            </div>
          </template>
        </el-popover>
      </CardDragSort>
    </div>
    <!-- 图片链接 -->
    <el-dialog
      v-model="imgLinkVisible"
      width="600px"
      title="图片跳转URL"
      :close-on-click-modal="false"
    >
      <el-input v-model="imgLink" clearable placeholder="请输入该图片跳转URL" />
      <template #footer>
        <el-button type="primary" @click="handleSaveUrlLink">保存</el-button>
        <el-button @click="imgLinkVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import CardDragSort from '@/components/CardDragSort/index.vue';
  import { isUrl } from '@/utils/is';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    images: {
      type: Array,
      default: () => []
    },
    partIndex: { type: Number, default: 0 }
  });
  const emits = defineEmits(['changeImg']);
  const showImgIndex = ref(9999);
  const setBigImgIndex = (index) => {
    showImgIndex.value = index;
  };
  //   const openBigImg = (imgItem) => {
  //     imgItem.showBigImg = true;
  //     console.log('obje111ct :>> ', imgItem.showBigImg);
  //   };

  //   排序
  const moveCardImg = (dragIndex, hoverIndex) => {
    let imageList = cloneDeep(props.images);
    const item = imageList[dragIndex];
    imageList.splice(dragIndex, 1);
    imageList.splice(hoverIndex, 0, item);
    emits('changeImg', { partIndex: props.partIndex, images: imageList });
  };
  // 移除图片
  const handleRemoveImg = (imgIndex) => {
    let imageList = cloneDeep(props.images);
    imageList.splice(imgIndex, 1);
    emits('changeImg', { partIndex: props.partIndex, images: imageList });
  };
  // #region图片链接
  const imgLinkVisible = ref(false);
  const imgLink = ref('');
  const imgLinkIndexVal = ref(0);
  const handleAddTargetUrl = (imgIndex, imgUrlLink) => {
    imgLink.value = imgUrlLink;
    imgLinkIndexVal.value = imgIndex;
    imgLinkVisible.value = true;
  };
  const handleSaveUrlLink = () => {
    // 判断url是否合法
    if (imgLink.value && !isUrl(imgLink.value)) {
      return ElMessage.warning('输入地址不合法');
    }
    let imageList = cloneDeep(props.images);
    imageList[imgLinkIndexVal.value].targetUrl = imgLink.value;

    emits('changeImg', { partIndex: props.partIndex, images: imageList });

    imgLinkVisible.value = false;
  };
  const handleOpenTargetUrl = (targetUrl) => {
    targetUrl && window.open(targetUrl);
  };
</script>

<style lang="scss" scoped>
  .row_middle_wrap {
    display: flex;
    flex-wrap: wrap;
  }
  .row_middle_image_part + .row_middle_image_part {
    margin-left: 10px;
  }
  .row_middle_image {
    height: 85px;
    width: auto;
    min-width: 100px;
  }
  .row_middle_image_part {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .img_btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
</style>
