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
      <div>主图：</div>
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
      <div>辅图：</div>
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
      type: String,
      default: ''
    },
    carouselImageUrlList: {
      type: Object,
      default: () => {}
    },
    uploadTempType: {
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
    let allImgs = mainImgs.value.concat(assistImgs.value);
    let addImgs = [];
    allImgs.forEach((item) => {
      if (item.isChoose) {
        addImgs.push(item.name);
      }
    });
    if (
      props.carouselImageUrlList.length + 1 + addImgs.length > 10 &&
      props.uploadTempType === 'basic'
    ) {
      return ElMessage.warning(
        `产品轮播图仅支持5-10张, 您最多还能上传${
          10 - props.carouselImageUrlList.length - 1
        }张！`
      );
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
