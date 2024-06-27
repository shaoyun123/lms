<template>
  <div class="desc_wrapper">
    <el-tabs v-model="tabName">
      <el-tab-pane
        v-for="item in tabList"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <template v-if="descObj[item.name]?.length">
          <div v-for="(elem, index) in descObj[item.name]" :key="index">
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
                      <span>标题：</span>
                      <span>{{ elem.texts[0].content }}</span>
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
                      <el-button @click="handleEditText(index)"
                        >编辑文本</el-button
                      >
                    </div>
                    <div>
                      <el-button @click="handleTplContent(index)"
                        >模板描述</el-button
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
                      <el-button @click="handleNetImg(index)"
                        >url添加</el-button
                      >
                    </div>
                    <div>
                      <el-button @click="handleTplImg(index)"
                        >模板图片</el-button
                      >
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="elem.type === 'text-image'">
                <div class="row_part row_mix_part">
                  <div class="row_left">
                    <div>图文({{ elem.images?.length }})</div>
                    <el-icon
                      :size="20"
                      color="#f56c6c"
                      @click="handleRemovePart(index)"
                      ><Delete
                    /></el-icon>
                  </div>
                  <div class="row_middle">
                    <div class="row_middle_title">
                      <span>标题：</span>
                      <span>{{ elem.texts[0].content }}</span>
                    </div>
                    <div class="row_middle_content">
                      <div class="row_middle_content_title">内容：</div>
                      <div class="row_middle_content_text">
                        {{ elem.texts[1].content }}
                      </div>
                    </div>
                    <DescImg
                      class="mt10"
                      :images="elem.images"
                      :part-index="index"
                      @change-img="changeImg"
                    />
                  </div>
                  <div class="row_right row_mix_right">
                    <div>
                      <el-button @click="handleEditText(index)"
                        >编辑文本</el-button
                      >
                    </div>
                    <div>
                      <el-button @click="handleTplContent(index)"
                        >模板描述</el-button
                      >
                    </div>
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
                      <el-button @click="handleNetImg(index)"
                        >url添加</el-button
                      >
                    </div>
                    <div>
                      <el-button @click="handleTplImg(index)"
                        >模板图片</el-button
                      >
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
      </el-tab-pane>
    </el-tabs>
    <div class="tab_btns">
      <template v-if="tabName === 'mobileDesc'">
        <el-button type="primary" @click="handleGeneratePCDesc"
          >生成PC描述</el-button
        >
      </template>
      <template v-else>
        <span>信息模块: </span>
        <el-select
          v-model="moduleId"
          filterable
          clearable
          @change="changeDesc({ type: 'position', val: $event })"
        >
          <el-option
            v-for="elem in moduleIdList"
            :key="elem.moduleId"
            :label="elem.name"
            :value="elem.moduleId"
          />
        </el-select>
        <el-button
          type="primary"
          :loading="syncLoading"
          @click="handleSync(true)"
          >同步</el-button
        >
        <el-select
          v-model="position"
          class="ml20"
          filterable
          clearable
          placeholder="请选择呈现的位置"
          @change="changeDesc({ type: 'position', val: $event })"
        >
          <el-option label="顶端" value="top" />
          <el-option label="低端" value="bottom" />
        </el-select>
      </template>
      <el-dropdown split-button type="primary" class="ml20">
        添加模块
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleAddPart('text')">
              文本模块
            </el-dropdown-item>
            <el-dropdown-item @click="handleAddPart('image')"
              >图片模块</el-dropdown-item
            >
            <el-dropdown-item @click="handleAddPart('text-image')"
              >图文模块</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button type="primary" class="ml20" @click="handlePreview"
        >预览效果</el-button
      >
    </div>

    <!-- 模板图片 -->
    <ChooseTplImage
      v-model="tplImgVisible"
      :limit="10 - descObj[tabName]?.[partIndexVal]?.images?.length || 0"
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
        <el-form-item label="标题(f非必填)">
          <el-input v-model="textFormData.title" clearable />
        </el-form-item>
        <el-form-item label="文本内容(非必填)">
          <el-input
            v-model="textFormData.content"
            type="textarea"
            :rows="9"
            clearable
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="handleSaveText()">保存</el-button>
        <el-button @click="textEditVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 模版描述 -->
    <ChooseTplDesc
      v-model="tplDescVisile"
      :desc-params="tplContentParams"
      @get-tpl-desc="getTplContent"
    />
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
  import ChooseTplDesc from '@/components/ChooseTplDesc/index.vue';
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
  const tabList = [
    {
      label: '手机版',
      name: 'mobileDesc'
    },
    {
      label: '电脑版',
      name: 'pcDesc'
    }
  ];
  const tabName = ref('mobileDesc');
  const syncLoading = ref(false);
  const moduleIdList = ref([]);
  const moduleId = ref();
  const position = ref();
  watchEffect(() => {
    // moduleId.value = props.descObj.moduleId;
    // position.value = props.descObj.position;
  });
  const emits = defineEmits(['changeDesc', 'getTableData']);

  // 移动模块排序
  const moveCard = (dragIndex, hoverIndex) => {
    let partList = cloneDeep(props.descObj[tabName.value]);
    const item = partList[dragIndex];
    partList.splice(dragIndex, 1);
    partList.splice(hoverIndex, 0, item);
    emits('changeDesc', { type: tabName.value, val: partList });
  };

  // 添加模块
  const handleAddPart = (type) => {
    let partList = cloneDeep(props.descObj[tabName.value] || []);
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
    emits('changeDesc', { type: tabName.value, val: partList });
  };
  // 生成pc描述
  const handleGeneratePCDesc = () => {
    const partList = cloneDeep(props.descObj.mobileDesc);
    emits('changeDesc', { type: 'pcDesc', val: partList });
    ElMessage.success('操作成功');
  };
  // 移除模块
  const handleRemovePart = (index) => {
    let partList = props.descObj[tabName.value].filter(
      (_, partIndex) => partIndex !== index
    );
    emits('changeDesc', { type: tabName.value, val: partList });
  };

  // 修改图片
  const changeImg = ({ partIndex, images }) => {
    let partList = cloneDeep(props.descObj[tabName.value]);
    partList[partIndex].images = images;
    emits('changeDesc', { type: tabName.value, val: partList });
  };
  let partIndexVal = ref(0);
  // #region 模板图片
  const tplImgVisible = ref(false);
  const tplImgParams = ref({});
  const handleTplImg = async (partIndex) => {
    partIndexVal.value = partIndex;
    await emits('getTableData');
    let partList = cloneDeep(props.descObj[tabName.value]);
    const imgLength = partList[partIndexVal.value].images.length;
    if (10 - imgLength < 1) {
      return ElMessage.warning(`最多支持10张图片上传`);
    }
    tplImgVisible.value = true;
    tplImgParams.value = {
      platCode: 'AE全托管',
      prodPIds: props.fullTableData.map((item) => item.prodPId)
    };
  };
  const getTplImg = (imgUrlList) => {
    let partList = cloneDeep(props.descObj[tabName.value]);
    const _imgUrlList = imgUrlList.map((item) => ({ url: item, style: {} }));
    const oldImgUrlList = cloneDeep(partList[partIndexVal.value].images);
    partList[partIndexVal.value].images = oldImgUrlList.concat(_imgUrlList);
    emits('changeDesc', { type: tabName.value, val: partList });
  };
  // #endregion
  // #region 网络图片
  const imgUrlVisible = ref(false);
  const imgUrls = ref('');
  const handleNetImg = (index) => {
    partIndexVal.value = index;
    let partList = cloneDeep(props.descObj[tabName.value]);
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
    let partList = cloneDeep(props.descObj[tabName.value]);
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
    emits('changeDesc', { type: tabName.value, val: partList });
    imgUrlVisible.value = false;
  };
  // #endregion 网络图片
  //#region 本地图片
  const handleUploadLocal = (rawFile, index) => {
    partIndexVal.value = index;
    comBlobToDataURL(rawFile.file, (url) => {
      let partList = cloneDeep(props.descObj[tabName.value]);
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
        emits('changeDesc', { type: tabName.value, val: partList });
      }
    });
  };
  const handleExceed = () => {
    ElMessage.warning(`最多支持10张图片上传`);
  };
  //#endregion 本地图片
  //#region 编辑文本
  const textEditVisible = ref(false);
  const textFormData = ref({});
  const handleEditText = (index) => {
    partIndexVal.value = index;
    textEditVisible.value = true;
    const curPart = cloneDeep(props.descObj[tabName.value])[partIndexVal.value]
      .texts;
    textFormData.value = {
      title: curPart.filter((item) => item.class === 'title')[0].content,
      content: curPart.filter((item) => item.class === 'body')[0].content
    };
  };
  const handleSaveText = () => {
    const partList = cloneDeep(props.descObj[tabName.value]);
    partList[partIndexVal.value].texts.forEach((item) => {
      if (item.class === 'title') {
        item.content = textFormData.value.title;
      } else if (item.class === 'body') {
        item.content = textFormData.value.content;
      }
    });
    emits('changeDesc', { type: tabName.value, val: partList });
    textEditVisible.value = false;
  };
  //#endregion 编辑文本
  //#region //模版文本
  const tplDescVisile = ref(false);
  const tplContentParams = ref('');
  const handleTplContent = async (index) => {
    await emits('getTableData');
    tplContentParams.value = props.fullTableData
      .map((item) => item.prodPId)
      .join();
    partIndexVal.value = index;
    tplDescVisile.value = true;
  };
  const getTplContent = (text) => {
    const partList = cloneDeep(props.descObj[tabName.value]);
    partList[partIndexVal.value].texts.forEach((item) => {
      if (item.class === 'body') {
        item.content = text;
      }
    });
    emits('changeDesc', { type: tabName.value, val: partList });
  };
  //#endregion 模版文本
  const changeDesc = (type, val) => {
    emits('changeDesc', { type, val });
  };
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
      type: tabName.value,
      moduleList: cloneDeep(props.descObj[tabName.value])
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
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      font-size: 14px;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .row_middle_content {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .row_middle_content_title {
        width: 50px;
        flex: none;
      }
      .row_middle_content_text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        font-size: 14px;
        color: #333;
        line-height: 26px;
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
