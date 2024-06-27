<template>
  <el-dialog
    :model-value="showTempImgsDialog"
    title="模板图片"
    width="60%"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="closeDialog()"
  >
    <div class="img_wrap">
      <div class="img_text">主图：</div>
      <div class="img_content">
        <div v-for="item in mainImgs" :key="item.id" class="img_inner">
          <el-checkbox
            v-model="item.isChoose"
            class="choose"
            size="default"
          ></el-checkbox>
          <img :src="item.name" />
        </div>
      </div>
    </div>
    <div class="img_wrap">
      <div class="img_text">辅图：</div>
      <div class="img_content">
        <div v-for="item in assistImgs" :key="item.id" class="img_inner">
          <el-checkbox
            v-model="item.isChoose"
            class="choose"
            size="default"
          ></el-checkbox>
          <img :src="item.name" />
        </div>
      </div>
    </div>
    <div class="img_wrap">
      <div class="img_text">sku图：</div>
      <div class="img_content">
        <div v-for="item in skuImageList" :key="item.id" class="img_inner">
          <el-checkbox
            v-model="item.isChoose"
            class="choose"
            size="default"
          ></el-checkbox>
          <img :src="item.name" />
        </div>
      </div>
    </div>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleUpload">确定</el-button>
        <el-button @click="closeDialog()">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { defineProps, onMounted, ref, defineEmits } from 'vue';
  import { getTempImgs } from '@/api/publishs/temupublish';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    showTempImgsDialog: {
      type: Boolean,
      default: false
    },
    prodPId: {
      type: Number,
      default: 0
    },
    carouselImageUrlList: {
      type: Array,
      default: () => []
    },
    tempType: {
      type: String,
      default: ''
    },
    longMarketImage: {
      type: String,
      default: ''
    },
    squareMarketImage: {
      type: String,
      default: ''
    }
  });

  const emit = defineEmits(['close']);
  onMounted(() => {
    getTempImageList();
  });

  const mainImgs = ref([]);
  const assistImgs = ref([]);
  const skuImageList = ref([]);
  // 获取模板图片
  const getTempImageList = async () => {
    try {
      const { code, data } = await getTempImgs({
        prodPId: props.prodPId
      });
      if (code === '0000') {
        data.forEach((item) => {
          item.isChoose = false;
        });
        mainImgs.value = data.filter((item) => item.isMain);
        assistImgs.value = data.filter((item) => item.isAssist);
        skuImageList.value = data.filter((item) => item.prodTempVariId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = () => {
    let allImgs = mainImgs.value
      .concat(assistImgs.value)
      .concat(skuImageList.value);
    let addImgs = [];
    allImgs.forEach((item) => {
      if (item.isChoose) {
        addImgs.push(item.name);
      }
    });
    if (props.tempType === 'basic') {
      if (props.carouselImageUrlList.length + addImgs.length > 8) {
        return ElMessage.warning(
          `商品图片仅支持1-8张, 您最多还能上传${
            8 - props.carouselImageUrlList.length
          }张！`
        );
      }
    }
    if (props.tempType === 'white') {
      if (props.squareMarketImage || addImgs.length > 1) {
        return ElMessage.warning(`白底图仅支持1张！`);
      }
    }
    if (props.tempType === 'scene') {
      if (props.longMarketImage || addImgs.length > 1) {
        return ElMessage.warning(`场景图仅支持1张！`);
      }
    }
    if (props.tempType === 'list') {
      if (addImgs.length > 1) {
        return ElMessage.warning(`sku图仅支持1张！`);
      }
    }
    emit('close', addImgs);
  };

  const closeDialog = () => {
    emit('close');
  };
</script>
<style lang="scss" scoped>
  .img_wrap {
    display: flex;
    margin-bottom: 20px;
    margin-left: 30px;
    .img_text {
      width: 50px;
      white-space: nowrap;
    }
    .img_content {
      display: flex;
      flex-wrap: wrap;
      .img_inner {
        position: relative;
        width: 100px;
        height: 100px;
        margin: 0 10px 10px;
        border: 1px dashed #ddd;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .choose {
          position: absolute;
          top: -4px;
          left: 5px;
        }
      }
    }
  }
</style>
