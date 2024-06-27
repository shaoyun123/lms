<template>
  <div ref="descImgRef" class="row_middle_wrap">
    <div
      v-for="(img, imgIndex) in images"
      :key="img.url + '_' + imgIndex"
      class="row_middle_image_part"
    >
      <CardDragSort
        :id="img + '_' + imgIndex"
        :index="imgIndex"
        :type="partIndex + 'cardImg'"
        :move-card="moveCardImg"
      >
        <!-- <el-popover
          :visible="imgIndex === showImgIndex"
          placement="top"
          width="500px"
          :hide-after="0"
        >
          <template #default>
            <el-image :src="img.url" />
          </template>
          <template #reference> -->
        <div draggable="true" @dragstart="dragStart" @dragover="dragover">
          <ImagePop
            :src="img.url"
            :width="'60px'"
            :height="'60px'"
            :teleported="false"
          />
          <div class="img_btns">
            <el-button type="danger" link @click="handleRemoveImg(imgIndex)"
              >移除</el-button
            >
          </div>
        </div>
        <!-- </template>
        </el-popover> -->
      </CardDragSort>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import { cloneDeep } from 'lodash-es';
  import CardDragSort from '@/components/CardDragSort/index.vue';
  import { comHidePopover } from '@/utils/common';

  const props = defineProps({
    images: {
      type: Array,
      default: () => []
    },
    partIndex: { type: Number, default: 0 }
  });
  const emits = defineEmits(['changeImg']);
  // const showImgIndex = ref(9999);

  const descImgRef = ref(null);
  const dragStart = () => {
    comHidePopover(descImgRef);
  };
  const dragover = () => {
    comHidePopover(descImgRef);
  };

  // 排序
  const moveCardImg = (dragIndex, hoverIndex) => {
    let imageListNew = cloneDeep(props.images);
    let imageListOld = cloneDeep(props.images);
    imageListNew.splice(dragIndex, 1, imageListOld[hoverIndex]);
    imageListNew.splice(hoverIndex, 1, imageListOld[dragIndex]);
    emits('changeImg', { partIndex: props.partIndex, images: imageListNew });
  };
  // 移除图片
  const handleRemoveImg = (imgIndex) => {
    let imageList = cloneDeep(props.images);
    imageList.splice(imgIndex, 1);
    emits('changeImg', { partIndex: props.partIndex, images: imageList });
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
    justify-content: flex-end;
    cursor: pointer;
  }
</style>
