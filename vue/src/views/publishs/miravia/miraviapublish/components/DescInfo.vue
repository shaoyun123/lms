<template>
  <div class="desc_wrapper">
    <div style="display: flex; align-items: center; margin-bottom: 10px">
      <el-button type="primary" size="small" @click="handleAddPart('text')"
        >添加文本模块</el-button
      >
      <el-button type="primary" size="small" @click="handleAddPart('image')"
        >添加图片模块</el-button
      >
      <el-button type="primary" size="small" @click="handlePreview"
        >预览效果</el-button
      >
    </div>
    <template v-if="descObj.info?.length">
      <div v-for="(elem, index) in descObj.info" :key="index">
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
              <div class="row_right">
                <div>
                  <el-button @click="handleEditText(index)">编辑文本</el-button>
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

    <!-- 模板图片 -->
    <ChooseTplImage
      v-model="tplImgVisible"
      :limit="20 - descObj.info?.[partIndexVal]?.images?.length || 0"
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
      <el-form :model="textFormData" label-width="120px">
        <el-form-item label="标题(非必填)">
          <el-input
            v-model="textFormData.title"
            style="font-size: 12px; margin-bottom: 15px"
            maxlength="2000"
            type="textarea"
            :rows="4"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item label="文本内容(非必填)">
          <el-input
            v-model="textFormData.content"
            style="font-size: 10.5px"
            type="textarea"
            :rows="9"
            maxlength="2000"
            show-word-limit
            clearable
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="handleSaveText()">保存</el-button>
        <el-button @click="textEditVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watchEffect } from 'vue';
  import { listdetailmoduleApi } from '@/api/publishs/aefullyhostedpublish';
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

  const tabName = ref('mobileDesc');
  const syncLoading = ref(false);
  const moduleIdList = ref([]);

  watchEffect(() => {});
  const emits = defineEmits(['changeDesc', 'getTableData']);

  // 移动模块排序
  const moveCard = (dragIndex, hoverIndex) => {
    let partList = cloneDeep(props.descObj.info);
    const item = partList[dragIndex];
    partList.splice(dragIndex, 1);
    partList.splice(hoverIndex, 0, item);
    emits('changeDesc', { type: 'info', val: partList });
  };

  // 添加模块
  const handleAddPart = (type) => {
    let partList = cloneDeep(props.descObj.info || []);
    if (partList.length >= 10) return ElMessage.warning(`页面最多存在10个楼层`);
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
    emits('changeDesc', { type: 'info', val: partList });
  };

  // 移除模块
  const handleRemovePart = (index) => {
    let partList = props.descObj.info.filter(
      (_, partIndex) => partIndex !== index
    );
    emits('changeDesc', { type: 'info', val: partList });
  };

  // 修改图片
  const changeImg = ({ partIndex, images }) => {
    let partList = cloneDeep(props.descObj.info);
    partList[partIndex].images = images;
    emits('changeDesc', { type: 'info', val: partList });
  };
  let partIndexVal = ref(0);
  // #region 模板图片
  const tableData = ref([]);
  const tplImgVisible = ref(false);
  const tplImgParams = ref({});
  const handleTplImg = async (partIndex) => {
    partIndexVal.value = partIndex;
    await emits('getTableData');
    let partList = cloneDeep(props.descObj.info);
    const imgLength = partList[partIndexVal.value].images.length;
    if (20 - imgLength < 1) {
      return ElMessage.warning('每个楼层最多支持20张图片上传');
    }
    tableData.value = props.fullTableData;

    tplImgParams.value = {
      platCode: 'miravia',
      prodSSkus: tableData.value.map((item) => item.prodSSku)
    };
    if (tplImgParams.value.prodSSkus.length < 1) {
      return ElMessage.warning('当前子sku数量为空,不能添加模板图片!');
    }
    tplImgVisible.value = true;
  };

  const getTplImg = (imgUrlList) => {
    let partList = cloneDeep(props.descObj.info);
    const _imgUrlList = imgUrlList.map((item) => ({ url: item, style: {} }));
    const oldImgUrlList = cloneDeep(partList[partIndexVal.value].images);
    partList[partIndexVal.value].images = oldImgUrlList.concat(_imgUrlList);
    emits('changeDesc', { type: 'info', val: partList });
  };
  // #endregion

  // #region 网络图片
  const imgUrlVisible = ref(false);
  const imgUrls = ref('');
  const handleNetImg = (index) => {
    partIndexVal.value = index;
    let partList = cloneDeep(props.descObj.info);
    const imgLength = partList[partIndexVal.value].images.length;
    if (20 - imgLength < 1) {
      return ElMessage.warning('每个楼层最多支持20张图片上传');
    }
    imgUrlVisible.value = true;
    imgUrls.value = '';
  };

  // 保存网络图片
  const handleSaveUrl = () => {
    const imgList = imgUrls.value.split('\n').filter((item) => !!item);
    if (!imgList.length) {
      return ElMessage.warning('请输入图片地址');
    }
    let partList = cloneDeep(props.descObj.info);
    const _imgUrlList = imgList.map((item) => ({ url: item, style: {} }));
    const oldImgUrlList = cloneDeep(partList[partIndexVal.value].images);
    const maxlength = 20 - oldImgUrlList.length - _imgUrlList;

    if (maxlength < 0) {
      return ElMessage.warning('每个楼层最多支持20张图片上传');
    }
    // 判断url是否合法
    if (_imgUrlList.some((item) => !isUrl(item.url))) {
      return ElMessage.warning('输入地址不合法');
    }
    partList[partIndexVal.value].images = oldImgUrlList.concat(_imgUrlList);
    emits('changeDesc', { type: 'info', val: partList });
    imgUrlVisible.value = false;
  };
  // #endregion 网络图片

  //#region 本地图片
  const handleUploadLocal = (rawFile, index) => {
    partIndexVal.value = index;
    comBlobToDataURL(rawFile.file, (url) => {
      let partList = cloneDeep(props.descObj.info);
      const oldImgUrlList = cloneDeep(partList[partIndexVal.value].images);
      partList[partIndexVal.value].images = oldImgUrlList.concat([
        {
          url,
          style: {}
        }
      ]);
      if (partList[partIndexVal.value].images.length > 20) {
        return ElMessage.warning('每个楼层最多支持20张图片上传');
      } else {
        emits('changeDesc', { type: 'info', val: partList });
      }
    });
  };
  const handleExceed = () => {
    ElMessage.warning('每个楼层最多支持20张图片上传');
  };
  //#endregion 本地图片

  //#region 编辑文本
  const textEditVisible = ref(false);
  const textFormData = ref({});
  const handleEditText = (index) => {
    partIndexVal.value = index;
    textEditVisible.value = true;
    const curPart = cloneDeep(props.descObj.info)[partIndexVal.value].texts;
    textFormData.value = {
      title: curPart.filter((item) => item.class === 'title')[0].content,
      content: curPart.filter((item) => item.class === 'body')[0].content
    };
  };
  const handleSaveText = () => {
    const partList = cloneDeep(props.descObj.info);
    partList[partIndexVal.value].texts.forEach((item) => {
      if (item.class === 'title') {
        item.content = textFormData.value.title;
      } else if (item.class === 'body') {
        item.content = textFormData.value.content;
      }
    });
    emits('changeDesc', { type: 'info', val: partList });
    textEditVisible.value = false;
  };
  //#endregion 编辑文本

  const handleSync = async (isSync = false) => {
    syncLoading.value = true;
    try {
      const { data } = await listdetailmoduleApi({
        storeAcctId: props.storeAcctId,
        isSync
      });
      moduleIdList.value = data || [];
    } catch (err) {
      console.log('err :>> ', err);
    }
    syncLoading.value = false;
  };
  const handlePreview = () => {
    setItem('priviewAeDescData', {
      type: 'info',
      moduleList: cloneDeep(props.descObj.info)
    });
    window.open(`/trade-web/#/publishs/aefullyhosted/publishpreviewdesc`);
  };
  defineExpose({ handleSync, tabName });
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
      font-size: 12px;
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
      align-items: center;
      justify-content: flex-start;
      font-size: 10.5px;
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
        line-height: 24px;
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
  .ml20 {
    margin-left: 20px;
  }
  .tab_btns {
    position: absolute;
    top: 0;
    right: 0;
  }
  .desc_wrapper {
    width: 85%;
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
</style>
