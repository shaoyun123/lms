<!-- shein 处理图片表格 -->
<template>
  <div class="image_container">
    <vxe-table
      ref="tableDataRef"
      :data="imageInfoList"
      :align="'center'"
      border
    >
      <vxe-column
        title="主规格属性值"
        field="oaAttrName1"
        width="130"
      ></vxe-column>
      <vxe-column>
        <template #header>
          <span style="color: red">*</span>细节图<span
            style="font-size: 12px; color: #bbb"
            >（第一张默认为主图）</span
          >
        </template>
        <template #default="{ row, rowIndex }">
          <div class="img_box">
            <div
              v-for="(item, index) in row.detailImgList"
              :key="index"
              class="img_item"
              :draggable="true"
              @dragstart="dragstart(item, index, rowIndex)"
              @dragenter="dragenter(item, $event)"
              @dragend="dragend(item, $event)"
              @dragover="dragover($event)"
            >
              <el-popover
                :visible="item.isPopover"
                placement="top"
                width="500px"
                :hide-after="0"
                popper-class="newPopover"
              >
                <template #default>
                  <el-image
                    loading="lazy"
                    style="height: 500px"
                    :src="item.imageUrl || ''"
                  />
                </template>
                <template #reference>
                  <el-image
                    v-if="item.imageUrl"
                    loading="lazy"
                    style="width: 100%; height: 80px; cursor: pointer"
                    :src="item.imageUrl || ''"
                    @click="item.isPopover = !item.isPopover"
                  />
                </template>
              </el-popover>
              <div class="img_tool">
                <span
                  style="color: red; cursor: pointer"
                  @click="removeDetail(rowIndex, index)"
                  >移除</span
                >
              </div>
            </div>
            <!-- <div
              class="upload_icon"
              :class="{ hide: row.detailImgList?.length == 11 }"
              @click="handleChoose('0', rowIndex)"
            >
              <el-icon><Plus /></el-icon>
            </div> -->
            <div class="color_btn">
              <el-upload
                v-model:file-list="fileList"
                action=""
                :show-file-list="false"
                list-type="picture"
                :http-request="(file) => handleRequestLocal(file, rowIndex)"
              >
                <el-button type="primary" :disabled="requestLocalBtn"
                  >本地图片</el-button
                >
              </el-upload>
              <el-button
                type="primary"
                :class="{ hide: row.detailImgList?.length == 11 }"
                @click="handleChoose('0', rowIndex)"
                >模板图片</el-button
              >
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="squareImgUrl" width="150">
        <template #header> <span style="color: red">*</span>方形图 </template>
        <template #default="{ row, rowIndex }">
          <div style="display: flex; justify-content: center; width: 100%">
            <div class="img_box">
              <div
                v-for="(item, index) in row.squareImgUrl"
                :key="index"
                class="img_item"
              >
                <el-popover
                  :visible="item.isPopover"
                  placement="top"
                  width="500px"
                  :hide-after="0"
                  popper-class="newPopover"
                >
                  <template #default>
                    <el-image
                      loading="lazy"
                      style="height: 500px"
                      :src="item.imageUrl || ''"
                    />
                  </template>
                  <template #reference>
                    <el-image
                      v-if="item.imageUrl"
                      loading="lazy"
                      style="width: 100%; height: 80px; cursor: pointer"
                      :src="item.imageUrl || ''"
                      @click="item.isPopover = !item.isPopover"
                    />
                  </template>
                </el-popover>
                <div class="img_tool">
                  <span
                    style="color: red; cursor: pointer"
                    @click="removeSquare(rowIndex)"
                    >移除</span
                  >
                </div>
              </div>
              <div
                class="upload_icon"
                :class="{ hide: row.squareImgUrl?.length == 1 }"
                @click="handleChoose('1', rowIndex)"
              >
                <el-icon><Plus /></el-icon>
              </div>
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column field="colorImgUrl" width="220">
        <template #header> <span style="color: red">*</span>色块图 </template>
        <template #default="{ row, rowIndex }">
          <div style="display: flex; justify-content: flex-end; width: 100%">
            <div class="img_box">
              <div
                v-for="(item, index) in row.colorImgUrl"
                :key="index"
                class="img_item"
              >
                <el-popover
                  :visible="item.isPopover"
                  placement="top"
                  width="500px"
                  :hide-after="0"
                  popper-class="newPopover"
                >
                  <template #default>
                    <el-image
                      loading="lazy"
                      style="height: 500px"
                      :src="item.imageUrl || ''"
                    />
                  </template>
                  <template #reference>
                    <el-image
                      v-if="item.imageUrl"
                      loading="lazy"
                      style="width: 100%; height: 80px; cursor: pointer"
                      :src="item.imageUrl || ''"
                      @click="item.isPopover = !item.isPopover"
                    />
                  </template>
                </el-popover>
                <div class="img_tool">
                  <span
                    style="color: red; cursor: pointer"
                    @click="removeColor(rowIndex)"
                    >移除</span
                  >
                </div>
              </div>
              <div class="color_btn">
                <el-upload
                  v-model:file-list="fileList"
                  action=""
                  :show-file-list="false"
                  list-type="picture"
                  :http-request="(file) => handleRequest(file, rowIndex)"
                >
                  <el-button type="primary">本地图片</el-button>
                </el-upload>
                <el-button type="primary" @click="dropColor(rowIndex)"
                  >取色</el-button
                >
                <el-button type="primary" @click="handleScreenShot(rowIndex)"
                  >截取</el-button
                >
              </div>
            </div>
          </div>
        </template>
      </vxe-column>
    </vxe-table>

    <Chooseimage
      v-if="showChooseImage"
      :is-visible="showChooseImage"
      :prod-ids="prodIds"
      :action="action"
      :image-info-list="imageInfoList"
      :image-row-index="imageRowIndex"
      :fba-obj="fbaObj"
      :plat-code="platCode"
      @close="handleCloseImage"
      @choose="handleChooseImage"
    />
    <screen-short
      v-if="screenshotStatus"
      @destroy-component="destroyComponent"
      @get-image-data="getImg"
    ></screen-short>
  </div>
</template>
<script setup>
  import { ElMessage } from 'element-plus';
  import { defineProps, ref, computed } from 'vue';
  import Chooseimage from './Chooseimage.vue';
  import axios from 'axios';
  import { tansferImageApi } from '@/api/publishs/sheinpublish';

  // skuIinfoList 数据结构
  // skuInfoList: [
  //  {
  // 		oaAttrName1: 'red', 主规格属性值
  //    imageInfos: [{
  //      imageSort: 1,  图片序号
  //      imageType: 1,  图片类型
  //      imageUrl: '1111.jpg' 图片路径
  //    }]
  //  }
  // ]

  // const tranferData = () => {
  //   skuInfoList.value = skuInfoList.value?.map((item) => {
  //     return {
  //       ...item,
  //       detailImgList: item.imageInfos?.filter(
  //         (cItem) => cItem.imageType == 1 || cItem.imageType == 2
  //       ),
  //       squareImgUrl: item.imageInfos?.filter((cItem) => cItem.imageType == 5),
  //       colorImgUrl: item.imageInfos?.filter((cItem) => cItem.imageType == 6)
  //     };
  //   });
  // };

  //    detailImgList: [], 细节图
  // 		squareImgUrl: [], 方形图
  // 		colorImgUrl: [] 色块图
  const props = defineProps({
    skuInfoList: {
      type: Array,
      default: () => []
    },
    assistLimit: {
      // 细节图默认为 11 张
      type: Number,
      default: 11
    },
    prodIds: {
      type: Array,
      default: () => []
    },
    fbaObj: {
      type: Object,
      default: () => ({})
    },
    platCode: {
      type: String,
      default: ''
    }
  });
  const emits = defineEmits(['changeImage']);

  const imageInfoList = computed(() => {
    return props.skuInfoList;
  });

  const action = ref('0'); // 0 细节图 or 1 方形图
  const imageRowIndex = ref(0); // 选择图片的行号

  const showChooseImage = ref(false); // 显示选择图片弹窗

  const handleChoose = (type, rowIdx) => {
    showChooseImage.value = true;
    imageRowIndex.value = rowIdx;
    action.value = type;
  };

  const handleCloseImage = () => {
    showChooseImage.value = false;
  };

  const handleChooseImage = (val) => {
    if (action.value === '0') {
      const detailImgList =
        imageInfoList.value[imageRowIndex.value]?.detailImgList;
      const notFirstChoose =
        imageInfoList.value[imageRowIndex.value]?.notFirstChoose ||
        !!detailImgList.length;
      const squareImgUrl =
        imageInfoList.value[imageRowIndex.value]?.squareImgUrl;
      // 只有全部都是空的，先选了细节图，才需要替换
      if (!notFirstChoose && !squareImgUrl.length) {
        let newImage = Object.assign({}, val[0]);
        imageInfoList.value[imageRowIndex.value]?.squareImgUrl.push(newImage);
      }
      val.shift();
      imageInfoList.value[imageRowIndex.value]?.detailImgList.push(...val);
    }
    if (action.value === '1') {
      imageInfoList.value[imageRowIndex.value]?.squareImgUrl.push(...val);
    }
    hanldeAddTypeAndSort(imageRowIndex.value);
    emits('changeImage', imageInfoList.value);
  };

  // 给所有图片添加图片类型和图片序号
  // 图片类型 1-主图 2-细节图 5-方块图 6-色块图
  const hanldeAddTypeAndSort = (rowIndex) => {
    let detailImgLength =
      imageInfoList.value[rowIndex].detailImgList?.length || 0;
    let squareImgLength =
      imageInfoList.value[rowIndex].squareImgUrl?.length || 0;
    imageInfoList.value[rowIndex].detailImgList?.forEach((item, index) => {
      item.imageSort = index + 1;
      if (item.imageSort === 1) {
        // 主图的序号 必须是 1
        // 默认细节图第一张为主图
        item.imageType = 1;
      } else {
        item.imageType = 2;
      }
    });
    imageInfoList.value[rowIndex].squareImgUrl?.forEach((item, index) => {
      item.imageSort = index + detailImgLength + 1;
      item.imageType = 5;
    });
    imageInfoList.value[rowIndex].colorImgUrl?.forEach((item, index) => {
      item.imageSort = index + detailImgLength + squareImgLength + 1;
      item.imageType = 6;
    });
  };

  // 拖动图片改变顺序
  let oldData = null;
  let newData = null;
  let dragIndex = ref(-1);

  let images = ref([]);
  let rowIdx = ref(-1);
  const dragstart = (value, index, rowIndex) => {
    images.value = [...imageInfoList.value[rowIndex].detailImgList];
    images.value = images.value.map((v) => v.imageUrl);
    rowIdx.value = rowIndex;
    oldData = value.imageUrl;
    dragIndex.value = index;
  };

  const dragenter = (value, e) => {
    newData = value.imageUrl;
    e.preventDefault();
  };

  const dragover = (e) => {
    e.preventDefault();
  };

  const dragend = () => {
    // 保证是表格的同一行图片交换顺序
    if (oldData !== newData && images.value.includes(newData)) {
      let oldIndex = images.value.indexOf(oldData);
      let newIndex = images.value.indexOf(newData);
      let imageRow = imageInfoList.value[rowIdx.value];

      let oldUrl = imageRow.detailImgList[oldIndex].imageUrl;
      imageRow.detailImgList[oldIndex].imageUrl =
        imageRow.detailImgList[newIndex].imageUrl;
      imageRow.detailImgList[newIndex].imageUrl = oldUrl;

      [images.value[oldIndex], images.value[newIndex]] = [
        images.value[newIndex],
        images.value[oldIndex]
      ];
    }
    dragIndex.value = -1;
    hanldeAddTypeAndSort(rowIdx.value);
    emits('changeImage', imageInfoList.value);
  };

  // 移除方形图
  const removeSquare = (rowIndex) => {
    imageInfoList.value[rowIndex].squareImgUrl = [];
    emits('changeImage', imageInfoList.value);
  };

  // 移除细节图
  const removeDetail = (rowIndex, index) => {
    imageInfoList.value[rowIndex].detailImgList.splice(index, 1);
    imageInfoList.value[rowIndex].notFirstChoose = true;
    emits('changeImage', imageInfoList.value);
  };

  // 移除色块图
  const removeColor = (rowIndex) => {
    imageInfoList.value[rowIndex].colorImgUrl = [];
    emits('changeImage', imageInfoList.value);
  };

  // 取色
  const dropColor = async (rowIndex) => {
    if ('EyeDropper' in window) {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      const colorHexVal = result?.sRGBHex;
      const canvas = document.createElement('canvas');
      canvas.width = 80;
      canvas.height = 80;
      const context = canvas.getContext('2d');
      // 填充颜色
      context.fillStyle = colorHexVal;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // 将canvas转换为base64图片数据
      const dataURL = canvas.toDataURL('image/png');
      let obj = {
        imageUrl: dataURL
      };
      imageInfoList.value[rowIndex].colorImgUrl = [obj];
      hanldeAddTypeAndSort(rowIndex);
      transferUrlByBase64(obj);
      emits('changeImage', imageInfoList.value);
    } else {
      return ElMessage.error('当前浏览器版本过低，请先升级后使用取色功能！');
    }
  };

  const fileList = ref([]);

  const handleRequest = (val, rowIndex) => {
    if (val.file.type !== 'image/jpg' && val.file.type !== 'image/jpeg') {
      return ElMessage.warning('仅支持上传jpg和jpeg格式图片！');
    }
    let formData = new FormData();
    formData.append('file', val.file);
    formData.append('width', 80);
    formData.append('height', 80);
    axios.post('/api/lms/prodTpl/uploadPic2.html', formData).then((res) => {
      if (res.data?.code === '0000') {
        let obj = {
          imageUrl: res.data?.msg
        };
        imageInfoList.value[rowIndex].colorImgUrl = [obj];
        hanldeAddTypeAndSort(rowIndex);
        emits('changeImage', imageInfoList.value);
      } else {
        ElMessage.error(res.data.msg || '上传失败');
      }
    });
  };

  const requestLocalBtn = ref(false);
  const handleRequestLocal = (val, rowIndex) => {
    requestLocalBtn.value = true;
    let formData = new FormData();
    formData.append('file', val.file);
    axios.post('/api/lms/prodTpl/uploadPic2.html', formData).then((res) => {
      if (res.data?.code === '0000') {
        let obj = {
          imageUrl: res.data?.msg
        };
        tpl_calculateImageSize(res.data?.msg).then(function ({
          width,
          height
        }) {
          if (width == height && width >= 900 && width <= 2200) {
            imageInfoList.value[rowIndex]?.detailImgList.push(obj);
            hanldeAddTypeAndSort(imageRowIndex.value);
            emits('changeImage', imageInfoList.value);
          } else {
            ElMessage.error('图片尺寸不合适');
          }
          requestLocalBtn.value = false;
        });
      } else {
        ElMessage.error(res.data.msg || '上传失败');
        requestLocalBtn.value = false;
      }
    });
  };

  // 根据图片地址获取图片的宽和高
  const tpl_calculateImageSize = function (url) {
    return new Promise(function (resolve, reject) {
      const image = document.createElement('img');
      image.addEventListener('load', function (e) {
        resolve({
          width: e.target.width,
          height: e.target.height
        });
      });

      image.addEventListener('error', function () {
        reject();
      });

      // 将图片的url地址添加到图片地址中
      image.src = url;
    });
  };

  // 截图
  const screenshotStatus = ref(false);
  const handleScreenShot = (rowIndex) => {
    screenshotStatus.value = true;
    imageRowIndex.value = rowIndex;
  };

  const destroyComponent = () => {
    screenshotStatus.value = false;
  };
  const getImg = (base64) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    canvas.width = 80;
    canvas.height = 80;
    image.src = base64;
    image.onload = () => {
      // 在 canvas 上绘制原始图片，并缩放到目标尺寸
      ctx.drawImage(image, 0, 0, 80, 80);
      // 将 canvas 转换为新的图片文件
      const newImageURL = canvas.toDataURL('image/jpeg');
      let obj = {
        imageUrl: newImageURL
      };
      imageInfoList.value[imageRowIndex.value].colorImgUrl = [obj];
      screenshotStatus.value = false;
      hanldeAddTypeAndSort(imageRowIndex.value);
      transferUrlByBase64(obj);
      emits('changeImage', imageInfoList.value);
    };
  };

  // 将图片base64转换为图片链接
  const transferUrlByBase64 = async (item) => {
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
  };
</script>
<style lang="scss" scoped>
  .image_container {
    width: 100%;
  }
  .main_img_box {
    position: relative;
    width: 100px;
    height: 100px;
    // margin-left: 20px;
    .el-image {
      width: 100%;
      height: 100%;
    }
    .main_tag {
      position: absolute;
      background-color: rgb(22, 155, 213);
      border-radius: 4px;
      top: -3px;
      left: -3px;
      color: #fff;
      padding: 0 5px;
      z-index: 9;
    }
  }
  .img_box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .img_item {
      position: relative;
      width: 80px;
      height: 100px;
      margin-right: 10px;
      margin-bottom: 15px;
      border-radius: 4px;
      img {
        width: 100%;
        height: 80px;
        // border: 1px dashed rgb(205, 208, 214);
      }
    }
  }
  .img_tool {
    display: flex;
    justify-content: center;
  }
  :deep(.el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
  :deep(.el-upload) {
    // width: 100px;
    // height: 100px;
  }
  .hide {
    display: none !important;
  }
  .color_btn {
    // width: 80px;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }
  .upload_icon:hover {
    border: 1px dashed rgb(22, 155, 213);
  }
  .upload_icon {
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    color: rgb(143, 147, 153);
    border: 1px dashed rgb(205, 208, 214);
    border-radius: 6px;
    cursor: pointer;
  }
</style>
<style lang="scss">
  .newPopover {
    display: flex;
    justify-content: center;
    .el-image__inner {
      border: 1px dashed #ccc;
      box-sizing: border-box;
      object-fit: contain;
    }
  }
</style>
