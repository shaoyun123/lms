<template>
  <div class="detail_wrapper">
    <el-dialog
      v-model="dialogVisible"
      class="tiktok-watermark-dialog"
      :title="title"
      :width="1400"
      :close-on-click-modal="
        checkedRow?.operationType === 'view' ? true : false
      "
      :align-center="true"
    >
      <div style="display: flex; justify-content: space-between">
        <el-form ref="configRef" :model="config" class="search_form">
          <p style="color: red; margin-bottom: 10px">
            tips:不选择店铺，默认适用于所有店铺
          </p>
          <el-form-item
            label="适用店铺"
            prop="salesPlatAcctIds"
            class="search_item_cascader"
          >
            <z-cascader
              v-model="config.salesPlatAcctIds"
              :data="initList.storeList"
            ></z-cascader>
          </el-form-item>
          <p style="color: red; margin-bottom: 10px">
            店铺不选则表示 该水印模板适用tiktok所有店铺
          </p>
          <el-form-item label="模板名称" prop="watermarkTemplateName">
            <el-input v-model="config.watermarkTemplateName" clearable />
          </el-form-item>
          <el-form-item label="水印类型" prop="watermarkType">
            <el-radio-group
              v-model="config.watermarkType"
              style="margin-top: -10px"
              @change="changeWatermarkType"
            >
              <el-radio :value="0" size="large">图片水印</el-radio>
              <el-radio :value="1" size="large">文字水印</el-radio>
            </el-radio-group>
          </el-form-item>
          <p style="color: red; margin-bottom: 10px">
            注意：切换类型水印会被消除
          </p>
          <div v-if="config.watermarkType == 0">
            <el-form-item label="水印图片" prop="">
              <el-upload
                :action="'/api/lms/plat/platWatermark/uploadPhoto.html'"
                :data="{ platCode: 'tiktok' }"
                :on-success="importSuccess"
                :on-error="importError"
                accept=".png,.jpg,.jpeg"
                :show-file-list="false"
                style="margin: 0 10px"
              >
                <el-button type="primary" size="small">本地图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item style="margin-left: 110px">
              <ImagePop :src="config.watermarkUrl" />
            </el-form-item>
            <el-form-item label="透明度" prop="opacity">
              <el-slider
                v-model="config.opacity"
                :format-tooltip="formatTooltip"
              />
            </el-form-item>
            <el-form-item label="大小" prop="watermarkSize">
              <el-slider v-model="config.watermarkSize" :min="20" :max="200" />
            </el-form-item>
            <el-form-item label="旋转角度" prop="rotate">
              <el-slider v-model="config.rotate" :min="-180" :max="180" />
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="水印文字" prop="content">
              <el-input
                v-model="config.content"
                clearable
                :disabled="config.repeat && config.repeat.includes('是否平铺')"
              />
            </el-form-item>
            <el-form-item label="字体类型" prop="">
              <el-select
                v-model="config.font.fontFamily"
                filterable
                clearable
                :disabled="config.repeat && config.repeat.includes('是否平铺')"
              >
                <el-option value="微软雅黑">微软雅黑</el-option>
                <el-option value="宋体">宋体</el-option>
                <el-option value="Arial Black">Arial Black</el-option>
                <el-option value="MV Boli">MV Boli</el-option>
                <el-option value="Impact">Impact</el-option>
                <el-option value="Segoe Script">Segoe Script</el-option>
                <el-option value="楷体">楷体</el-option>
                <el-option value="华文琥珀">华文琥珀</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="字体大小">
              <ZInputNumber
                v-model="config.font.fontSize"
                :precision="2"
                :min="14"
                :max="200"
                placeholder="请输入"
                :disabled="config.repeat && config.repeat.includes('是否平铺')"
              />
            </el-form-item>
            <el-form-item label="字体颜色">
              <el-color-picker
                v-model="config.font.color"
                :predefine="predefineColors"
                :disabled="config.repeat && config.repeat.includes('是否平铺')"
              />
            </el-form-item>
            <el-form-item label="背景颜色" prop="backgroundColor">
              <el-color-picker
                v-model="config.backgroundColor"
                :predefine="predefineColors"
                :disabled="config.repeat && config.repeat.includes('是否平铺')"
              />
            </el-form-item>
            <el-form-item label="透明度">
              <el-slider
                v-model="config.opacity"
                :format-tooltip="formatTooltip"
                :disabled="config.repeat && config.repeat.includes('是否平铺')"
              />
            </el-form-item>
            <el-form-item label="文字旋转" prop="rotate">
              <el-slider
                v-model="config.rotate"
                :min="-180"
                :max="180"
                :disabled="config.repeat && config.repeat.includes('是否平铺')"
              />
            </el-form-item>
            <el-form-item label="平铺">
              <el-checkbox-group
                v-model="config.repeat"
                style="margin-top: -10px"
                @change="isRepeat"
              >
                <el-checkbox label="是否平铺" size="large" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              v-if="config.repeat && config.repeat.includes('是否平铺')"
              label="水平间距"
              prop="spaceX"
            >
              <el-slider
                v-model="config.spaceX"
                :min="50"
                :max="800"
                @change="changeSpace('X')"
              />
            </el-form-item>
            <el-form-item
              v-if="config.repeat && config.repeat.includes('是否平铺')"
              label="垂直间距"
              prop="spaceY"
            >
              <el-slider
                v-model="config.spaceY"
                :min="50"
                :max="800"
                @change="changeSpace('Y')"
              />
            </el-form-item>
          </div>
        </el-form>
        <div>
          <el-form-item>
            <el-select v-model="config.borderSize" filterable clearable>
              <el-option label="1000*1000" :value="1000" />
              <el-option label="800*800" :value="800" />
            </el-select>
          </el-form-item>
          <div
            v-if="config.repeat && config.repeat.includes('是否平铺')"
            style="border: 1px solid #000; display: flex; flex-wrap: wrap"
            :class="[
              config.borderSize == 1000
                ? 'watermark-right-1000'
                : 'watermark-right-800'
            ]"
          >
            <div v-for="item in 60" :key="item" :style="repeatStyle"></div>
          </div>
          <div
            v-else
            ref="target"
            class="target"
            :class="[
              config.borderSize == 1000
                ? 'watermark-right-1000'
                : 'watermark-right-800'
            ]"
          >
            <span
              v-if="config.watermarkUrl"
              ref="boxRef"
              class="box"
              :style="{
                left: position.left,
                top: position.top,
                opacity: config.opacity / 100,
                transformOrigin: 'left top',
                transform: `rotate(${config.rotate}deg) scale(${
                  config.watermarkSize / 100
                },${config.watermarkSize / 100})`
              }"
            >
              <img :src="config.watermarkUrl" />
            </span>
            <span
              v-else
              ref="boxRef"
              class="box"
              :style="{
                ...position,
                backgroundColor: config.backgroundColor,
                fontFamily: config.font.fontFamily,
                fontSize: config.font.fontSize + 'px',
                color: config.font.color,
                opacity: config.opacity / 100,
                transformOrigin: 'left top',
                transform: `rotate(${config.rotate}deg)`
              }"
              >{{ config.content }}</span
            >
          </div>
        </div>
      </div>
      <template v-if="checkedRow?.operationType !== 'view'" #footer>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave(configRef)"
          >保存</el-button
        >
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watch, reactive, toRefs, computed, onMounted } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ImagePop from '@/components/ImagePop/index.vue';
  import {
    editWatermarkApi,
    saveWatermarkApi
  } from '@/api/publishs/tiktokwatermark';
  import { ElMessage } from 'element-plus';
  import { useDraggable } from '@vueuse/core';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedRow: {
      type: Object,
      default: () => {}
    },
    initList: {
      type: Object,
      default: () => {}
    }
  });

  const emits = defineEmits([
    'update:modelValue',
    'handleSearch',
    'getCreatorList'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const title = computed(() => {
    if (props.checkedRow?.operationType === 'edit') {
      return '编辑水印';
    } else if (props.checkedRow?.operationType === 'view') {
      return '查看水印';
    }
    return '新增水印';
  });

  // 选择颜色的默认值
  const predefineColors = ['#E60027', '#409eff', '#FFFFFF', '#000000'];
  // 输入文字框的宽度
  const fontW = ref();
  // 输入文字框的高度
  const fontH = ref();
  // 选择平铺时的样式单独写
  const repeatStyle = ref();

  // 是否平铺
  const isRepeat = (isEdit) => {
    if (!isEdit) {
      // 水平间距&垂直间距默认值
      config.spaceX = 100;
      config.spaceY = 100;
    }
    if (config.repeat.length != 0) {
      const { fontSize, fontFamily, fontStyle, color } = config.font;
      const content = config.content;
      let dom = document.createElement('span');
      dom.style.display = 'inline-block';
      dom.style.fontSize = fontSize + 'px';
      dom.style.fontFamily = fontFamily;
      dom.textContent = content;
      document.body.appendChild(dom);
      let width = dom.clientWidth,
        height = dom.clientHeight;
      fontW.value = width || 0;
      fontH.value = height || 0;
      document.body.removeChild(dom);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return false;
      // 画布的宽度=文字的宽度+padding值
      canvas.setAttribute('width', `${fontW.value + 2 * (fontW.value / 10)}px`);
      canvas.setAttribute('height', `${fontH.value}px`);
      ctx.save();
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, fontW.value + 2 * (fontW.value / 10), fontH.value);
      // 行高
      ctx.font = `${fontStyle} normal normal ${fontSize}px/${
        fontH.value / 2
      }px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(content, fontW.value / 10, fontH.value / 5);
      /** 旋转后填充交错的文本*/
      ctx.restore();

      repeatStyle.value = {
        position: 'relative',
        width: width + 100 + 'px',
        height: height + 100 + 'px',
        background: `url('${canvas.toDataURL()}') no-repeat center center`,
        transform: `rotate(${config.rotate}deg)`,
        opacity: config.opacity / 100
      };
      if (isEdit) {
        changeSpace('X');
        changeSpace('Y');
      }
      return false;
    }
  };
  // 调整水平间距&垂直间距
  const changeSpace = (type) => {
    if (type == 'X') {
      repeatStyle.value['width'] =
        fontW.value + 100 + config.spaceX / 10 + 'px';
    } else if (type == 'Y') {
      repeatStyle.value['height'] =
        fontH.value + 100 + config.spaceY / 10 + 'px';
    }
  };
  const config = reactive({
    borderSize: 1000,
    watermarkType: 1, // 0图片水印，1文字水印
    content: '', //文字水印内容
    width: 100, // 图片宽
    height: 100, // 图片高
    rotate: 0, // 文字旋转
    repeat: [], //是否平铺
    backgroundColor: '#FFFFFF', // 背景颜色
    font: {
      fontSize: 14,
      fontFamily: '微软雅黑',
      fontStyle: 'normal',
      // fontWeight: 'normal',
      color: '#000000'
    },
    watermarkSize: 100,
    opacity: 100,
    watermarkUrl: ''
  });
  const configRef = ref();
  const formatTooltip = (val) => {
    return val / 100;
  };
  // 鼠标点击拖动代码--开始
  const target = ref();
  const boxRef = ref();
  const position = reactive({
    left: '0px',
    top: '0px'
  });
  const { x, y, style } = useDraggable(boxRef, { preventDefault: true });
  watch([x, y, style], () => {
    const { left, top } = target.value.getBoundingClientRect();
    position.left = x.value - left;
    position.top = y.value - top;
    const { width, height } = boxRef.value.getBoundingClientRect();
    if (position.left < 0) {
      position.left = 0;
    } else if (position.left + width > config.borderSize) {
      position.left = config.borderSize - width;
    }
    if (position.top < 0) {
      position.top = 0;
    } else if (position.top + height > config.borderSize) {
      position.top = config.borderSize - height;
    }
    position.left += 'px';
    position.top += 'px';
  });
  // 鼠标点击拖动代码--结束
  // 切换水印类型，清空数据
  const changeWatermarkType = () => {
    if (config.watermarkType == 1) {
      config.watermarkUrl = '';
      config.opacity = 100;
      config.watermarkSize = 100;
      config.rotate = 0;
    } else {
      config.content = '';
      config.font.fontFamily = '微软雅黑';
      config.font.fontSize = 14;
      config.font.color = '';
      config.backgroundColor = '';
      config.repeat = [];
      config.opacity = 100;
      config.rotate = 0;
      config.spaceX = 0;
      config.spaceY = 0;
    }
  };

  let { checkedRow } = toRefs(props);
  onMounted(() => {
    if (checkedRow.value.operationType !== 'new') {
      config.id = checkedRow.value.id;
      config.salesPlatAcctIds = checkedRow.value.storeAcctIds;
      config.watermarkTemplateName = checkedRow.value.watermarkTemplateName;
      config.borderSize = checkedRow.value.borderSize;
      config.watermarkType = checkedRow.value.watermarkType;
      config.content = checkedRow.value.watermarkFontContent;
      config.rotate = checkedRow.value.degree;
      config.repeat = checkedRow.value.layout == 0 ? [] : ['是否平铺'];
      config.spaceX = checkedRow.value.spaceX;
      config.spaceY = checkedRow.value.spaceY;
      config.backgroundColor = checkedRow.value.watermarkFontBackgroundColor; // 背景颜色：watermarkFontBackgroundColor
      config.font.fontFamily = checkedRow.value.watermarkFontType;
      config.font.color = checkedRow.value.watermarkFontColor;
      config.opacity = checkedRow.value.watermarkTransparency;
      config.borderSize = checkedRow.value.borderSize;
      config.watermarkUrl = checkedRow.value.watermarkUrl;
      position.left =
        JSON.parse(checkedRow.value.watermarkCoordinate).width + 'px';
      position.top =
        JSON.parse(checkedRow.value.watermarkCoordinate).height + 'px';

      if (checkedRow.value.watermarkType == 1) {
        config.watermarkSize = checkedRow.value.watermarkSize;
        config.font.fontSize = 14;
      } else {
        config.font.fontSize = checkedRow.value.watermarkSize;
        config.watermarkSize = 100;
      }
      // 编辑回显
      if (checkedRow.value.layout == 1) {
        isRepeat('edit');
      }
    }
  });

  const saveLoading = ref(false);
  const handleSave = async () => {
    saveLoading.value = true;
    try {
      let res = null;
      let params = getParams();
      // 图片大小&文字字体大小
      if (params.watermarkType == 1) {
        // 0图片水印，1文字水印
        params.watermarkSize = config.font.fontSize;
      }
      if (props.checkedRow?.operationType === 'new') {
        res = await saveWatermarkApi(params);
        emits('getCreatorList');
      } else {
        res = await editWatermarkApi(params);
      }
      ElMessage.success(res.msg);
      emits('handleSearch');
      dialogVisible.value = false;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      saveLoading.value = false;
    }
  };

  const getParams = () => {
    let left = position.left.split('px')[0] * 1,
      top = position.top.split('px')[0] * 1;
    let params = {
      ...config,
      salesPlatAcctIds: config.salesPlatAcctIds.join(','),
      file: '',
      watermarkFontContent: config.content,
      watermarkCoordinate: `{"width":${left.toFixed(0)},"height":${top.toFixed(
        0
      )}}`,
      watermarkFontType: config.font.fontFamily,
      watermarkFontColor: config.font.color,
      watermarkFontBackgroundColor: config.backgroundColor,
      watermarkTransparency: config.opacity,
      degree: config.rotate, // 旋转角度
      platCode: 'tiktok',
      layout: config.repeat.length // 是否平铺
    };

    return params;
  };

  // 本地上传图片
  const importSuccess = (res) => {
    if (res.code === '0000') {
      config.watermarkUrl = res.msg;
    } else {
      ElMessage.error(res.msg);
    }
  };
  const importError = () => {};
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .target {
    border: 1px solid #ccc;
    position: relative;
  }
  .box {
    border: 1px dashed #ddd;
    position: absolute;
    cursor: move;
  }
</style>
<style lang="scss">
  .tiktok-watermark-dialog {
    position: relative;
    margin-top: 40px;
    .el-dialog__body {
      overflow-y: scroll;
      max-height: 650px;
    }
    .vxe-table--body-wrapper {
      overflow-x: hidden;
    }
  }
</style>
