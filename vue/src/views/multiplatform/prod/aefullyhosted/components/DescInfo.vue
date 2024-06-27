<template>
  <div class="desc_wrapper">
    <div style="height: 100%">
      <div class="mobile_title">手机版描述</div>
      <div class="flex mb15">
        <el-button type="primary" @click="handleAddPart('text')"
          >添加文本模块</el-button
        >
        <el-button type="primary" @click="handleAddPart('image')"
          >添加图片模块</el-button
        >
        <el-button type="primary" class="ml20" @click="handlePreview"
          >预览效果</el-button
        >
      </div>
      <template v-if="descObj.mobileDesc?.length">
        <div v-for="(elem, index) in descObj.mobileDesc" :key="index">
          <CardDragSort
            :id="elem + '_' + index"
            :index="index"
            type="card"
            :move-card="moveCard"
          >
            <template v-if="elem.type === 'text'">
              <div class="row_part">
                <div class="row_left">
                  <div>文本</div>
                  <el-icon
                    :size="20"
                    color="#f56c6c"
                    @click="handleRemovePart(index)"
                    ><Delete
                  /></el-icon>
                </div>
                <div class="row_middle">
                  <div class="row_middle_title">
                    <div class="title">标题：</div>
                    <div class="content">{{ elem.texts[0].content }}</div>
                  </div>
                  <div class="row_middle_content">
                    <div class="row_middle_content_title">内容：</div>
                    <div class="row_middle_content_text">
                      {{ elem.texts[1].content }}
                    </div>
                  </div>
                </div>
                <div class="row_right_desc">
                  <div>
                    <el-button @click="handleEditText(index)"
                      >编辑文本</el-button
                    >
                  </div>
                </div>
              </div>
            </template>
            <template v-if="elem.type === 'image'">
              <div class="row_part">
                <div class="row_left">
                  <div>图片({{ elem.images?.length }})</div>
                  <el-icon
                    :size="20"
                    color="#f56c6c"
                    @click="handleRemovePart(index)"
                    ><Delete
                  /></el-icon>
                </div>
                <div class="row_middle">
                  <DescImg
                    :images="elem.images"
                    :part-index="index"
                    @change-img="changeImg"
                  />
                </div>
                <div class="row_right">
                  <el-upload
                    action
                    :http-request="(file) => handleUploadLocal(file, index)"
                    :on-exceed="handleExceed"
                    :show-file-list="false"
                    accept="image/*"
                    multiple
                  >
                    <el-button class="mr10">本地图片</el-button>
                  </el-upload>
                  <div>
                    <el-button @click="handleNetImg(index)">网络图片</el-button>
                  </div>
                  <div>
                    <el-button @click="handleTplImg(index)">模板图片</el-button>
                  </div>
                </div>
              </div>
            </template>
          </CardDragSort>
        </div>
      </template>
      <template v-else>
        <el-empty description="暂无数据" />
        <div></div>
      </template>
    </div>

    <!-- 模板图片 -->
    <ChooseTplImage
      v-model="tplImgVisible"
      :limit="10 - descObj.mobileDesc?.[partIndexVal]?.images?.length || 0"
      :params="tplImgParams"
      @get-tpl-img="getTplImg"
    />
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
        <el-button type="primary" @click="handleSaveUrl">保存</el-button>
        <el-button @click="imgUrlVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- 文本编辑框 -->
    <el-dialog
      v-model="textEditVisible"
      width="700px"
      title="文本编辑框"
      :close-on-click-modal="false"
    >
      <div class="flex_end">
        <el-button type="primary" @click="handleReplaceText()"
          >一键替换</el-button
        >
      </div>
      <div class="mb15">
        <el-form ref="formRef" :inline="true" label-width="90px"
          ><el-form-item label="原文本：" prop="originText">
            <el-input
              v-model="originText"
              type="textarea"
              style="width: 230px"
              placeholder="请输入需要被替换的词, 同时标题和文本内容生效, 此框为空时将全量替换"
            /> </el-form-item
          ><el-form-item label="替换/修改：" prop="newText">
            <el-input
              v-model="newText"
              type="textarea"
              style="width: 230px"
              placeholder="请输入替换词"
            />
          </el-form-item>
        </el-form>
      </div>
      <el-form :model="textFormData" label-width="120px">
        <el-form-item label="标题(非必填)">
          <el-input
            v-model="textFormData.title"
            type="textarea"
            style="width: 530px"
            :rows="1"
            clearable
          />
        </el-form-item>
        <el-form-item label="文本内容(非必填)">
          <el-input
            v-model="textFormData.content"
            type="textarea"
            style="width: 530px"
            :rows="9"
            clearable
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="handleSaveText()">保存</el-button>
        <el-button @click="handleCancelText">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watchEffect } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { ElMessage } from 'element-plus';
  import { isUrl } from '@/utils/is';
  import { comBlobToDataURL } from '@/utils/upload';
  import ChooseTplImage from '@/components/ChooseTplImage/index.vue';
  import { setItem } from '@/utils/storage';
  import CardDragSort from '@/components/CardDragSort/index.vue';
  import DescImg from './DescImg.vue';

  const props = defineProps({
    descObj: {
      type: Object,
      default: () => {}
    },
    storeAcctId: {
      type: [Number, String],
      default: 0
    },
    fullTableData: {
      type: Array,
      default: () => []
    }
  });

  const originText = ref('');
  const newText = ref('');

  watchEffect(() => {});
  const emits = defineEmits(['changeDesc', 'getTableData']);

  // 移动模块排序
  const moveCard = (dragIndex, hoverIndex) => {
    let partList = cloneDeep(props.descObj.mobileDesc);
    const item = partList[dragIndex];
    partList.splice(dragIndex, 1);
    partList.splice(hoverIndex, 0, item);
    emits('changeDesc', { type: 'mobileDesc', val: partList });
  };

  // 添加模块
  const handleAddPart = (type) => {
    let partList = cloneDeep(props.descObj.mobileDesc || []);
    let newPartObj = { type };
    if (type === 'text') {
      newPartObj.texts = [
        {
          class: 'title',
          content: ''
        },
        {
          class: 'body',
          content: ''
        }
      ];
    } else if (type === 'image') {
      newPartObj.images = [];
    } else {
      newPartObj.texts = [
        {
          class: 'title',
          content: ''
        },
        {
          class: 'body',
          content: ''
        }
      ];
      newPartObj.images = [];
    }
    partList.push(newPartObj);
    emits('changeDesc', { type: 'mobileDesc', val: partList });
  };

  // 移除模块
  const handleRemovePart = (index) => {
    let partList = props.descObj.mobileDesc.filter(
      (_, partIndex) => partIndex !== index
    );
    emits('changeDesc', { type: 'mobileDesc', val: partList });
  };

  // 修改图片
  const changeImg = ({ partIndex, images }) => {
    let partList = cloneDeep(props.descObj.mobileDesc);
    partList[partIndex].images = images;
    emits('changeDesc', { type: 'mobileDesc', val: partList });
  };

  let partIndexVal = ref(0);
  // #region 模板图片
  const tplImgVisible = ref(false);
  const tplImgParams = ref({});
  const handleTplImg = async (partIndex) => {
    partIndexVal.value = partIndex;
    await emits('getTableData');
    let partList = cloneDeep(props.descObj.mobileDesc);
    const imgLength = partList[partIndexVal.value].images.length;
    if (10 - imgLength < 1) {
      return ElMessage.warning(`最多支持10张图片上传`);
    }
    tplImgVisible.value = true;
    tplImgParams.value = {
      platCode: 'AE全托管',
      prodPIds: props.fullTableData
        .filter((item) => !!item.prodPId)
        .map((item) => item.prodPId)
    };
  };

  const getTplImg = (imgUrlList) => {
    let partList = cloneDeep(props.descObj.mobileDesc);
    const _imgUrlList = imgUrlList.map((item) => ({ url: item, style: {} }));
    const oldImgUrlList = cloneDeep(partList[partIndexVal.value].images);
    partList[partIndexVal.value].images = oldImgUrlList.concat(_imgUrlList);
    emits('changeDesc', { type: 'mobileDesc', val: partList });
  };

  // #endregion
  // #region 网络图片
  const imgUrlVisible = ref(false);
  const imgUrls = ref('');
  const handleNetImg = (index) => {
    partIndexVal.value = index;
    let partList = cloneDeep(props.descObj.mobileDesc);
    const imgLength = partList[partIndexVal.value].images.length;
    if (10 - imgLength < 1) {
      return ElMessage.warning(`最多支持10张图片上传`);
    }
    imgUrlVisible.value = true;
    imgUrls.value = '';
  };

  const handleSaveUrl = () => {
    const imgList = imgUrls.value.split('\n').filter((item) => !!item);
    if (!imgList.length) {
      return ElMessage.warning('请输入图片地址');
    }
    let partList = cloneDeep(props.descObj.mobileDesc);
    const _imgUrlList = imgList.map((item) => ({ url: item, style: {} }));
    const oldImgUrlList = cloneDeep(partList[partIndexVal.value].images);
    const maxlength = 10 - oldImgUrlList.length - _imgUrlList;
    if (maxlength < 0) {
      return ElMessage.warning(`最多支持10张图片上传`);
    }
    // 判断url是否合法
    if (_imgUrlList.some((item) => !isUrl(item.url))) {
      return ElMessage.warning('输入地址不合法');
    }
    partList[partIndexVal.value].images = oldImgUrlList.concat(_imgUrlList);
    emits('changeDesc', { type: 'mobileDesc', val: partList });
    imgUrlVisible.value = false;
  };

  // #endregion 网络图片
  //#region 本地图片
  const handleUploadLocal = (rawFile, index) => {
    partIndexVal.value = index;
    comBlobToDataURL(rawFile.file, (url) => {
      let partList = cloneDeep(props.descObj.mobileDesc);
      const oldImgUrlList = cloneDeep(partList[partIndexVal.value].images);
      partList[partIndexVal.value].images = oldImgUrlList.concat([
        {
          url,
          style: {}
        }
      ]);
      if (partList[partIndexVal.value].images > 10) {
        return ElMessage.warning(`最多支持10张图片上传`);
      } else {
        emits('changeDesc', { type: 'mobileDesc', val: partList });
      }
    });
  };

  const handleExceed = () => {
    ElMessage.warning(`最多支持10张图片上传`);
  };
  //#endregion 本地图片

  // 一键替换
  const handleReplaceText = () => {
    if (!originText.value) {
      if (newText.value.includes('_')) {
        textFormData.value.title = newText.value.replace(
          '_',
          textFormData.value.title
        );
        textFormData.value.content = newText.value.replace(
          '_',
          textFormData.value.content
        );
      } else {
        textFormData.value.title = newText.value;
        textFormData.value.content = newText.value;
      }
    } else {
      let _productName = textFormData.value.title;
      if (textFormData.value.title.includes(originText.value)) {
        if (!newText.value) {
          newText.value = '';
          _productName = _productName
            .split(' ')
            .filter((e) => e !== originText.value)
            .join(' ');
        }
        textFormData.value.title = _productName.replaceAll(
          originText.value,
          newText.value
        );
      }
      if (textFormData.value.content.includes(originText.value)) {
        let _productContent = textFormData.value.content;
        if (!newText.value) {
          newText.value = '';
          _productContent = _productContent
            .split(' ')
            .filter((e) => e !== originText.value)
            .join(' ');
        }
        textFormData.value.content = _productContent.replaceAll(
          originText.value,
          newText.value
        );
      }
    }
  };

  //#region 编辑文本
  const textEditVisible = ref(false);
  const textFormData = ref({});
  const handleEditText = (index) => {
    partIndexVal.value = index;
    textEditVisible.value = true;
    const curPart = cloneDeep(props.descObj.mobileDesc)[partIndexVal.value]
      .texts;
    textFormData.value = {
      title: curPart.filter((item) => item.class === 'title')[0].content,
      content: curPart.filter((item) => item.class === 'body')[0].content
    };
  };

  // 保存文本框内容编辑
  const handleSaveText = () => {
    const partList = cloneDeep(props.descObj.mobileDesc);
    partList[partIndexVal.value].texts.forEach((item) => {
      if (item.class === 'title') {
        item.content = textFormData.value.title;
      } else if (item.class === 'body') {
        item.content = textFormData.value.content;
      }
    });
    emits('changeDesc', { type: 'mobileDesc', val: partList });
    textEditVisible.value = false;
    originText.value = '';
    newText.value = '';
  };

  const handleCancelText = () => {
    textEditVisible.value = false;
    originText.value = '';
    newText.value = '';
  };
  //#endregion 编辑文本

  // 查看预览
  const handlePreview = () => {
    setItem('priviewAeDescData', {
      type: 'mobileDesc',
      moduleList: cloneDeep(props.descObj.mobileDesc)
    });
    window.open(`/trade-web/#/publishs/aefullyhosted/publishpreviewdesc`);
  };
  const tabName = 'mobileDesc';
  defineExpose({ tabName });
</script>

<style lang="scss" scoped>
  .row_part {
    min-height: 120px;
  }
  .row_middle_wrap {
    display: flex;
    flex-wrap: wrap;
  }
  .row_mix_part {
    min-height: 240px;
  }
  .row_part {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border: 1px solid #eee;
    align-items: center;
    font-size: 16px;
  }
  .row_left {
    width: 120px;
    text-align: center;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    padding: 20px 0;
    :deep(.el-icon) {
      cursor: pointer;
    }
  }

  .row_right {
    width: 120px;
    min-height: 120px;
    box-sizing: border-box;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    :deep(.el-button) {
      cursor: pointer;
    }
  }
  .row_right_desc {
    width: 120px;
    min-height: 120px;
    box-sizing: border-box;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    :deep(.el-button) {
      cursor: pointer;
    }
  }

  .row_mix_right {
    min-height: 240px;
  }
  .row_middle {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .row_middle_title {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      margin-bottom: 8px;
      .title {
        width: 50px;
        flex: none;
      }
      .content {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 90%;
      }
    }
    .row_middle_content {
      display: flex;
      flex-direction: row;
      // align-items: center;
      justify-content: flex-start;
      font-size: 12px;
      .row_middle_content_title {
        width: 50px;
        flex: none;
      }
      .row_middle_content_text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        font-size: 10.5px;
        color: #333;
        line-height: 20px;
        white-space: pre-wrap;
      }
    }
    .row_middle_image {
      height: 85px;
      width: auto;
      min-width: 100px;
    }
  }
  .mt10 {
    margin-top: 10px;
  }
  .mb15 {
    margin-bottom: 15px;
  }
  .ml20 {
    margin-left: 20px;
  }
  .tab_btns {
    position: absolute;
    top: 0;
    right: 0;
  }
  .desc_wrapper {
    height: 100%;
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
  .mobile_title {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .flex {
    display: flex;
  }
  .flex_end {
    display: flex;
    justify-content: end;
  }
</style>
