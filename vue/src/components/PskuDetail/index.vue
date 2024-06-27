<template>
  <el-dialog
    width="1100px"
    title="商品详情"
    :model-value="showDialog"
    :close-on-click-modal="false"
    destroy-on-close
    @close="closeDialog"
  >
    <ul v-if="activeName == '详情'" class="pSkuLi">
      <li @click="goRule('pSku1')">基础信息</li>
      <li @click="goRule('pSku2')">主图</li>
      <li @click="goRule('pSku3')">辅图</li>
      <li @click="goRule('pSku4')">视频</li>
      <li @click="goRule('pSku5')">产品变种</li>
    </ul>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="name in ['详情', '操作日志']"
        :key="name"
        :label="name"
        :name="name"
      >
        <el-form
          v-if="activeName == '详情'"
          ref="dialogFormRef"
          :model="dialogForm"
          size="default"
          status-icon
          :label-width="100"
        >
          <el-divider id="pSku1" content-position="left"
            ><h3>基础信息</h3></el-divider
          >
          <div style="display: flex">
            <el-form-item label="商品父SKU">
              <el-input v-model="dialogForm.pSku" readonly />
            </el-form-item>
            <el-form-item label="开发专员">
              <el-input v-model="dialogForm.bizzOwner" />
            </el-form-item>
            <el-form-item label="责任人">
              <el-input v-model="dialogForm.responsor" />
            </el-form-item>
          </div>
          <div style="display: flex">
            <el-form-item v-if="dialogForm.joomSensProd" label="Joom敏感货">
              <el-input v-model="dialogForm.joomSensProd" />
            </el-form-item>
            <el-form-item label="供应商原图">
              <el-checkbox v-model="dialogForm.isSupplierOrigiImg" />
            </el-form-item>
            <el-form-item label="自拍图状态">
              <el-input v-model="selfImgStatusList[dialogForm.selfImgStatus]" />
            </el-form-item>
          </div>
          <el-form-item label="类目">
            <el-input v-model="dialogForm.cateName" />
          </el-form-item>
          <el-form-item label="中文名称">
            <el-input v-model="dialogForm.cnTitle" />
          </el-form-item>
          <el-form-item label="英文标题">
            <el-input v-model="dialogForm.enTitle" />
          </el-form-item>
          <el-form-item
            v-if="dialogForm.assistInfo && dialogForm.assistInfo.keywordCore"
          >
            <template #label>
              <div>
                <div>关键词</div>
                <el-tag>
                  数量{{
                    dialogForm.assistInfo.keywordCore.split('|').length +
                    dialogForm.assistInfo.keywordProdAttr.split('|').length +
                    dialogForm.assistInfo.keywordFit.split('|').length +
                    dialogForm.assistInfo.keywordExtra.split('|').length
                  }}</el-tag
                >
              </div>
            </template>
            <div style="display: flex">
              <div style="flex: 1; font-size: 10px">
                核心关键词
                <el-input
                  v-model="dialogForm.assistInfo.keywordCore1"
                  :rows="4"
                  type="textarea"
                >
                </el-input>
              </div>
              <div style="flex: 1; font-size: 10px">
                产品属性词(材质/尺寸/颜色/形状/属性等)
                <el-input
                  v-model="dialogForm.assistInfo.keywordProdAttr1"
                  :rows="4"
                  type="textarea"
                />
              </div>
              <div style="flex: 1; font-size: 10px">
                适用场景/范围/人群/用途
                <el-input
                  v-model="dialogForm.assistInfo.keywordFit1"
                  :rows="4"
                  type="textarea"
                />
              </div>
              <div style="flex: 1; font-size: 10px">
                补充词
                <el-input
                  v-model="dialogForm.assistInfo.keywordExtra1"
                  :rows="4"
                  type="textarea"
                />
              </div>
            </div>
          </el-form-item>
          <div v-else>
            <div style="display: flex">
              <el-form-item label="适用对象1">
                <el-input v-model="dialogForm.appObject0" />
              </el-form-item>
              <el-form-item label="适用对象2">
                <el-input v-model="dialogForm.appObject1" />
              </el-form-item>
              <el-form-item label="适用对象3">
                <el-input v-model="dialogForm.appObject2" />
              </el-form-item>
            </div>
            <div style="display: flex">
              <el-form-item label="特殊数量1">
                <el-input v-model="dialogForm.specNum0" />
              </el-form-item>
              <el-form-item label="特殊数量2">
                <el-input v-model="dialogForm.specNum1" />
              </el-form-item>
              <el-form-item label="特殊数量3">
                <el-input v-model="dialogForm.specNum2" />
              </el-form-item>
            </div>
            <el-form-item>
              <template #label>
                <div>
                  <div>关键词</div>
                  <el-tag>
                    数量{{
                      dialogForm.keyword
                        ? dialogForm.keyword.split('\n').length
                        : ''
                    }}</el-tag
                  >
                </div>
              </template>
              <el-input
                v-model="dialogForm.keyword"
                :rows="4"
                type="textarea"
              />
            </el-form-item>
          </div>
          <el-form-item
            v-if="dialogForm.assistInfo && dialogForm.assistInfo.specNumNew"
            label="特殊数量"
          >
            <el-input v-model="dialogForm.assistInfo.specNumNew" type="input" />
          </el-form-item>
          <el-form-item v-else label="特殊数量">
            <el-input type="input" />
          </el-form-item>
          <el-form-item
            v-if="dialogForm.assistInfo && dialogForm.assistInfo.fitModel"
            label="适用机型"
          >
            <el-input v-model="dialogForm.assistInfo.fitModel" type="input" />
          </el-form-item>
          <el-form-item v-else label="适用机型">
            <el-input type="input" />
          </el-form-item>
          <!-- <el-form-item>
            <template #label>
              <div>
                <div>wish tags</div>
                <el-tag>
                  数量{{
                    dialogForm.tag ? dialogForm.tag.split(',').length : ''
                  }}</el-tag
                >
              </div>
            </template>
            <el-input v-model="dialogForm.tag" :rows="4" type="textarea" />
          </el-form-item> -->
          <el-form-item>
            <template #label>
              <div>
                <div>商品描述</div>
                <el-tag
                  @click="
                    copy(
                      dialogForm.prodDesc + '\r\n' + dialogForm.fixDesc,
                      'textarea'
                    )
                  "
                >
                  一键复制</el-tag
                >
              </div>
            </template>
            <el-input v-model="dialogForm.prodDesc" :rows="4" type="textarea" />
          </el-form-item>
          <el-form-item> 固定顺序描述,如使用步骤,可以为空 </el-form-item>
          <el-form-item label="">
            <el-input v-model="dialogForm.fixDesc" :rows="4" type="textarea" />
          </el-form-item>
          <el-form-item label="繁中标题">
            <el-input v-model="dialogForm.tradTitle" />
          </el-form-item>
          <el-form-item label="繁中描述">
            <el-input v-model="dialogForm.tradDesc" :rows="4" type="textarea" />
          </el-form-item>
          <el-divider id="pSku2" content-position="left"
            ><h3>
              主图<el-tag @click="copyUrl('main')"> 复制主图URL</el-tag>
            </h3></el-divider
          >
          <div class="imgContainer">
            <div
              v-for="item in dialogForm.mainImages"
              :key="item.id"
              class="imgCon"
            >
              <div class="imgHeader">
                <el-checkbox
                  v-model="item.isWhite"
                  label="白底图"
                  size="small"
                />
                <!-- <el-checkbox
                  v-model="item.isClear"
                  label="清晰图"
                  size="small"
                /> -->
                <el-checkbox
                  v-model="item.isNotSupplier"
                  label="非供图"
                  size="small"
                />
              </div>
              <div class="imgBorder" style="display: flex">
                <el-popover
                  placement="right"
                  width="500px"
                  :hide-after="0"
                  trigger="hover"
                >
                  <template #default>
                    <el-image :src="extraUrl + item.name || ''" />
                  </template>
                  <template #reference>
                    <el-image
                      v-if="item.name"
                      :src="extraUrl + item.name + '!size=140x140' || ''"
                    />
                  </template>
                </el-popover>
                <span
                  v-if="item.isSelfImg"
                  style="color: red; margin: auto 4px; width: 0"
                  >自拍图</span
                >
              </div>
              <div class="imgFooter">
                <span @click="copy(extraUrl + item.name)">复制</span>
                <span @click="downLoadImg(extraUrl + item.name)">下载</span>
              </div>
            </div>
          </div>
          <el-divider id="pSku3" content-position="left"
            ><h3>
              辅图<el-tag @click="copyUrl('assist')"> 复制辅图Url</el-tag>
            </h3>
          </el-divider>
          <div class="imgContainer">
            <div
              v-for="item in dialogForm.assistImgs"
              :key="item.id"
              class="imgCon"
            >
              <div class="imgHeader">
                <el-checkbox
                  v-model="item.isMust"
                  label="必选图"
                  size="small"
                />
                <!-- <el-checkbox
                  v-model="item.isClear"
                  label="清晰图"
                  size="small"
                /> -->
                <el-checkbox
                  v-model="item.isNotSupplier"
                  label="非供图"
                  size="small"
                />
                <el-checkbox
                  v-model="item.isWhite"
                  label="亚马逊图"
                  size="small"
                />
                <el-checkbox
                  v-model="item.ifSize"
                  label="尺寸图"
                  size="small"
                />
              </div>
              <div class="imgBorder" style="display: flex">
                <el-popover
                  placement="right"
                  width="500px"
                  :hide-after="0"
                  trigger="hover"
                >
                  <template #default>
                    <el-image :src="extraUrl + item.name || ''" />
                  </template>
                  <template #reference>
                    <el-image
                      v-if="item.name"
                      :src="extraUrl + item.name + '!size=140x140' || ''"
                    />
                  </template>
                </el-popover>
                <span
                  v-if="item.isSelfImg"
                  style="color: red; margin: auto 4px; width: 0"
                  >自拍图</span
                >
              </div>
              <div class="imgFooter">
                <span @click="copy(extraUrl + item.name)">复制</span>
                <span @click="downLoadImg(extraUrl + item.name)">下载</span>
              </div>
            </div>
          </div>
          <el-divider id="pSku4" content-position="left"
            ><h3>视频</h3></el-divider
          >
          <div class="imgContainer">
            <div v-for="(item, index) in videoData" :key="index" class="imgCon">
              <div v-if="item.videos.length != 0">
                <el-image
                  :src="item.videos[0].picture + '!size=140x140' || ''"
                />
                <div
                  style="
                    background-color: rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    position: absolute;
                    z-index: 9;
                    margin-top: -142px;
                    font-size: 70px;
                    width: 140px;
                    height: 140px;
                  "
                  @click="openVideo(item.videos[0].location)"
                >
                  <el-icon style="left: 35px; top: 35px"><VideoPlay /></el-icon>
                </div>
              </div>
            </div>
          </div>
          <el-divider id="pSku5" content-position="left"
            ><h3>产品变种</h3></el-divider
          >
          <el-table
            :data="dialogForm.varients"
            border
            default-expand-all
            size="small"
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column type="expand">
              <template #default="scope">
                <div class="imgContainer">
                  <div
                    v-for="item in scope.row.varientImgs"
                    :key="item.id"
                    class="imgCon"
                  >
                    <div class="imgBorder">
                      <el-popover
                        placement="right"
                        width="500px"
                        :hide-after="0"
                        trigger="hover"
                      >
                        <template #default>
                          <el-image :src="extraUrl + item.name || ''" />
                        </template>
                        <template #reference>
                          <el-image
                            v-if="item.name"
                            :src="extraUrl + item.name + '!size=140x140' || ''"
                          />
                        </template>
                      </el-popover>
                    </div>
                    <div class="imgFooter">
                      <span @click="copy(extraUrl + item.name)">复制</span>
                      <span @click="downLoadImg(extraUrl + item.name)"
                        >下载</span
                      >
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="SKU" prop="sSku" width="200" />
            <el-table-column label="尺寸" prop="size" />
            <el-table-column label="颜色" prop="color" />
            <el-table-column label="款式" prop="style" />
            <el-table-column label="可用/在途/未派">
              <template #default="scope">
                {{
                  (scope.row.stockNum || 0) -
                  (scope.row.reservationNum || 0) +
                  '/' +
                  (scope.row.orderNotInNum || 0) +
                  '/' +
                  (scope.row.lackUnPaiNum || 0)
                }}
              </template>
            </el-table-column>
            <el-table-column label="重量(g)" prop="weight" width="65" />
            <el-table-column label="成本(¥)" prop="cost" width="65" />
            <el-table-column
              label="刊登警示(¥)"
              prop="listingWarnPrice"
              width="120"
            />
            <el-table-column label="在售" prop="isSale" width="50">
              <template #default="scope">
                <el-checkbox v-model="scope.row.isSale" /> </template
            ></el-table-column>
            <el-table-column label="有货" prop="isOutOfStock" width="50">
              <template #default="scope">
                <el-checkbox
                  v-if="scope.row.isOutOfStock == false"
                  checked
                /><el-checkbox v-else /> </template
            ></el-table-column>
          </el-table>
        </el-form>
        <el-table v-if="activeName == '操作日志'" :data="tplOperLog" border>
          <el-table-column label="时间">
            <template #default="scope">
              {{
                scope.row.operTime
                  ? parseTime(scope.row.operTime, '{y}-{m}-{d} {h}:{i}:{s}')
                  : ''
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作人" prop="operator" />
          <el-table-column label="内容" prop="operDesc" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button type="primary" @click="downloadAllImg">图片下载</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
  import {
    ref,
    reactive,
    toRefs,
    onMounted,
    defineProps,
    defineEmits
  } from 'vue';
  import {
    getTplDetail,
    queryAliexpressVideoInfo,
    getTplOperLog
  } from '@/api/publishs/mercadopublish';
  import { ElMessageBox } from 'element-plus';
  import { parseTime, copy } from '@/utils/common';

  const activeName = ref('详情');
  const handleClick = (tab) => {
    activeName.value = tab.paneName;
  };
  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    prodPId: {
      type: Number,
      default: null
    }
  });
  const { prodPId } = toRefs(props);
  const goRule = (id) => {
    document.querySelector('#' + id).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  };
  let selfImgStatusList = ['无自拍图', '有自拍图', '部分有图'];
  //   美客多模板弹窗
  const dialogForm = reactive({});
  //   操作日志
  let tplOperLog = ref([]);
  //   视频
  let videoData = ref([]);
  let extraUrl = ref('');
  onMounted(async () => {
    {
      let form = new FormData();
      form.append('id', prodPId.value);
      const { data, extra } = await getTplDetail(form);
      extraUrl.value = extra;
      for (let key in data) {
        dialogForm[key] = data[key];
      }
      if (dialogForm.assistInfo && dialogForm.assistInfo.keywordCore) {
        dialogForm.assistInfo.keywordCore1 =
          dialogForm.assistInfo.keywordCore.replaceAll('|', '\n');
        dialogForm.assistInfo.keywordProdAttr1 =
          dialogForm.assistInfo.keywordProdAttr.replaceAll('|', '\n');
        dialogForm.assistInfo.keywordFit1 =
          dialogForm.assistInfo.keywordFit.replaceAll('|', '\n');
        dialogForm.assistInfo.keywordExtra1 =
          dialogForm.assistInfo.keywordExtra.replaceAll('|', '\n');
      }
      dialogForm.appObject?.split('|').forEach((item, index) => {
        dialogForm[`appObject${index}`] = item;
      });

      dialogForm.specNum?.split('|').forEach((item, index) => {
        dialogForm[`specNum${index}`] = item;
      });
    }
    {
      const { data } = await queryAliexpressVideoInfo({
        prodPIds: [prodPId.value]
      });
      videoData.value = data;
    }
    {
      let form = new FormData();
      form.append('pid', prodPId.value);
      const { data } = await getTplOperLog(form);
      tplOperLog.value = data;
    }
  });

  //   播放视频
  const openVideo = (url) => {
    ElMessageBox.alert(
      `<video width="370" height="240" controls>
              <source src="${url}" type="video/mp4" />
              您的浏览器不支持Video标签。
            </video>`,
      '视频',
      {
        showConfirmButton: false,
        dangerouslyUseHTMLString: true
      }
    )
      .then(() => {})
      .catch(() => {});
  };

  //   下载图片
  const downLoadImg = (src, fileName) => {
    if (validURL(src)) {
      if (!fileName) {
        fileName = src.substring(src.lastIndexOf('/'));
      }
      fetch(src).then((res) =>
        res.blob().then((blob) => {
          var a = document.createElement('a');
          var url = window.URL.createObjectURL(blob);
          var filename = fileName;
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      );
    }
  };

  //校验url
  const validURL = function (url) {
    const reg =
      /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
  };

  // 下载所有图片
  const downloadAllImg = () => {
    let imgData = [];
    imgData = dialogForm.assistImgs.map((item) => item.name);
    let mainImages = dialogForm.mainImages.map((item) => item.name);
    imgData = imgData.concat(mainImages);
    dialogForm.varients.forEach((item) => {
      item.varientImgs.forEach((item) => {
        imgData.push(item.name);
      });
    });
    for (let i = 0; i < imgData.length; i++) {
      downLoadImg(extraUrl.value + imgData[i]);
    }
  };

  //   复制主图/辅图URL
  const copyUrl = (type) => {
    let imgUrl = [],
      str = '';
    if (type == 'main') {
      imgUrl = dialogForm.mainImages.map((item) => item.name);
    } else {
      imgUrl = dialogForm.assistImgs.map((item) => item.name);
    }
    imgUrl.forEach((item) => (str += extraUrl.value + item + '\r\n'));
    copy(str, 'textarea');
  };

  const emit = defineEmits(['closeDialog']);
  const closeDialog = () => {
    emit('closeDialog', { isShow: false });
  };

  const dialogFormRef = ref(null);
</script>
<style scoped lang="scss">
  .el-checkbox {
    margin-right: 8px;
    height: 16px;
  }
  //   :deep(.el-dialog__body) {
  //     margin-top: -35px;
  //   }
  .el-form-item--default {
    margin-bottom: 5px;
  }
  .imgContainer {
    display: flex;
    flex-wrap: wrap;
  }
  .imgCon {
    margin: 0 0 5px 5px;
    border: 1px solid #ddd;
  }
  .imgBorder {
    width: 160px;
    height: 140px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  .imgHeader {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 150px;
  }
  .imgFooter {
    display: flex;
    justify-content: space-between;
    color: #55c3f7;
    cursor: pointer;
  }
  .pSkuLi {
    position: fixed;
    margin-left: 800px;
    z-index: 99;
    color: #409eff;
    li {
      height: 26px;
      line-height: 26px;
    }
  }
</style>
