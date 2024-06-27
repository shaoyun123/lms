<template>
  <el-dialog
    :model-value="showTempImgsDialog"
    title="模板图片"
    width="60%"
    :align-center="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="closeDialog()"
  >
    <div class="img_container">
      <div class="img_wrap">
        <div class="img_text">主图：</div>
        <div class="img_content">
          <div v-for="item in mainImgs" :key="item.id" class="img_inner">
            <div class="image_item_box">
              <div style="flex: 1">
                <div class="image_item_box_top">
                  <el-checkbox
                    v-model="item.isWhite"
                    label="白底图"
                    size="small"
                    disabled
                  />
                  <el-checkbox
                    v-model="item.isClear"
                    label="清晰图"
                    size="small"
                    disabled
                  />
                  <el-checkbox
                    v-model="item.isNotSupplier"
                    label="非供图"
                    size="small"
                    disabled
                  />
                </div>
                <div class="image_item_box_bottom">
                  <el-checkbox
                    v-model="item.isChoose"
                    class="choose"
                    size="default"
                  ></el-checkbox>
                  <img :src="item.name" />
                </div>
              </div>
              <div v-if="item.isSelfImg" class="image_self">自拍图</div>
            </div>
          </div>
        </div>
      </div>
      <div class="img_wrap">
        <div class="img_text">辅图：</div>
        <div class="img_content">
          <div v-for="item in assistImgs" :key="item.id" class="img_inner">
            <div class="image_item_box">
              <div style="flex: 1">
                <div class="image_item_box_top">
                  <el-checkbox
                    v-model="item.isMust"
                    label="必选图"
                    size="small"
                    disabled
                  />
                  <el-checkbox
                    v-model="item.isClear"
                    label="清晰图"
                    size="small"
                    disabled
                  />
                  <el-checkbox
                    v-model="item.isNotSupplier"
                    label="非供图"
                    size="small"
                    disabled
                  />
                  <el-checkbox
                    v-model="item.isWhite"
                    label="白底图"
                    size="small"
                    disabled
                  />
                </div>
                <div class="image_item_box_bottom">
                  <el-checkbox
                    v-model="item.isChoose"
                    class="choose"
                    size="default"
                  ></el-checkbox>
                  <img :src="item.name" />
                </div>
              </div>
              <div v-if="item.isSelfImg" class="image_self">自拍图</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tempType === 'list'" class="img_wrap">
        <div class="img_text">sku图：</div>
        <div class="img_content">
          <div v-for="item in skuImageList" :key="item.id" class="img_inner">
            <div class="image_item_box">
              <div style="flex: 1">
                <div class="image_item_box_top">
                  <el-checkbox
                    v-model="item.isNotSupplier"
                    label="非供图"
                    size="small"
                    disabled
                  />
                  <el-checkbox
                    v-model="item.isWhite"
                    label="白底图"
                    size="small"
                    disabled
                  />
                </div>
                <div class="image_item_box_bottom">
                  <el-checkbox
                    v-model="item.isChoose"
                    class="choose"
                    size="default"
                  ></el-checkbox>
                  <img :src="item.name" />
                </div>
              </div>
              <div v-if="item.isSelfImg" class="image_self">自拍图</div>
            </div>
          </div>
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
  .img_container {
    max-height: 550px;
    overflow-y: auto;
  }
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
        margin-left: 10px;
        margin-bottom: 10px;
        border: 1px dashed #aaa;
        .choose {
          position: absolute;
          top: -2px;
          left: 2px;
        }
      }
    }
  }
  .image_item_box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    border-radius: 5px;
    .image_item_box_top {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 4px;
      .el-checkbox {
        margin: 1px;
      }
    }
    .image_item_box_bottom {
      position: relative;
      .el-checkbox {
        position: absolute;
        top: 15px;
        left: -3px;
        height: 15px;
        margin-top: 5px;
        margin-right: 0;
      }
      img {
        width: 130px;
        height: 120px;
        object-fit: cover;
      }
    }
    .image_self {
      width: 20px;
      padding-left: 2px;
      color: red;
      text-align: center;
    }
  }
</style>
