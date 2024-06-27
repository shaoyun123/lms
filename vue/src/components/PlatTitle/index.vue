<!-- 平台标题 -->
<template>
  <div ref="inputRef" class="platform_title">
    <el-input
      v-model="inputValue"
      :type="customType"
      v-bind="attrs"
      :style="{ width: inputWidth }"
      @focus="showTitleContent"
    >
      <template #suffix>
        <div v-if="maxLength && showWordLimit" class="title_text">
          <span :class="{ colorRed: inputValue.length > maxLength }">{{
            inputValue.length
          }}</span>
          / {{ maxLength }}
        </div>
        <el-tooltip
          effect="dark"
          content="把单词首字母转为<br/>大写（点击生效）"
          raw-content
          placement="top-end"
        >
          <div style="cursor: pointer" @click.stop="transferText(inputValue)">
            <img class="transfer_img" src="@/assets/layout/text.png" />
          </div>
        </el-tooltip>
      </template>
    </el-input>
    <!-- textare 不支持 suffix 插槽 -->
    <div v-if="customType == 'textarea'" class="area_limit">
      <span v-if="maxLength && showWordLimit" class="title_text">
        <span :class="{ colorRed: inputValue.length > maxLength }">{{
          inputValue.length
        }}</span>
        / {{ maxLength }}
      </span>
      <el-tooltip
        effect="dark"
        content="把单词首字母转为<br/>大写（点击生效）"
        raw-content
        placement="top-end"
      >
        <img
          class="transfer_img"
          src="@/assets/layout/text.png"
          @click.stop="transferText(inputValue)"
        />
      </el-tooltip>
    </div>
    <el-card
      v-if="showTitle"
      v-loading="loading"
      class="keyword_content"
      :style="{
        width: inputWidth,
        maxHeight: contentHeight + 'px',
        top: contentTop + 'px'
      }"
    >
      <div v-if="Object.keys(titleList)?.length > 0">
        <div v-for="(item, index) in Object.keys(titleList)" :key="index">
          <div style="color: #aaa">{{ TITLE_TAGS_MAP[item] }}:</div>
          <div>
            <el-tag
              v-for="(cItem, cIndex) in titleList[item]"
              :key="cIndex"
              class="title_tag"
              effect="light"
              @click="handleCopyTitle(cItem)"
              >{{ cItem }}</el-tag
            >
          </div>
        </div>
      </div>
      <div v-else>暂无数据</div>
    </el-card>
  </div>
</template>

<script setup>
  import { onMounted, ref, watch, useAttrs } from 'vue';
  import { getPlatTitleTagApi } from '@/api/common/index';
  import { copy } from '@/utils/common';
  const emit = defineEmits(['update:modelValue']);
  const attrs = useAttrs();
  const props = defineProps({
    modelValue: {
      // 内容
      type: String,
      default: ''
    },
    customType: {
      type: String, // input 框的类型
      default: 'text'
    },
    inputWidth: {
      type: String,
      default: '280px'
    },
    // 标题弹出框的宽高以及距离顶部的距离
    // contentWidth: {
    //   type: Number,
    //   default: 400
    // },
    contentHeight: {
      type: Number,
      default: 400
    },
    contentTop: {
      type: Number,
      default: 30
    },
    // prodPId, prodSId, prodPSku, prodSSku 其中一个有值即可
    prodPId: {
      type: Number,
      default: 0
    },
    prodSId: {
      type: String,
      default: ''
    },
    prodPSku: {
      type: String,
      default: ''
    },
    prodSSku: {
      type: String,
      default: ''
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    // 文字字符数量
    maxLength: {
      type: Number,
      default: 128
    }
  });

  const inputValue = ref(props.modelValue);

  const showTitle = ref(false);
  const loading = ref(false);
  const inputRef = ref(null);

  watch(inputValue, (value) => {
    emit('update:modelValue', value);
  });
  watch(
    () => props.modelValue,
    (value) => {
      inputValue.value = value;
    }
  );

  const TITLE_TAGS_MAP = {
    coreKeyWordList: '核心关键词',
    keyWordProdAttrList: '产品属性词',
    keyWordFitList: '使用场景/范围/人群/用途',
    keyWordExtraList: '补充词'
  };

  const titleList = ref({});

  // 获取标题相关标签
  const getTitleTags = async () => {
    showTitle.value = true;
    try {
      loading.value = true;
      let { prodPId, prodSId, prodPSku, prodSSku } = props;
      let params = {
        prodPId,
        prodSId,
        prodPSku,
        prodSSku
      };
      const { data } = await getPlatTitleTagApi(params);
      titleList.value = data || {};
      loading.value = false;
    } catch (err) {
      showTitle.value = false;
      console.log(err);
    }
  };
  onMounted(() => {
    document.addEventListener('click', handleCloseTitle);
  });

  const handleCloseTitle = (e) => {
    if (inputRef.value) {
      if (!inputRef.value.contains(e.target)) {
        showTitle.value = false;
      }
    }
  };

  const showTitleContent = () => {
    if (!showTitle.value) {
      getTitleTags();
    }
  };

  // 复制 tag 内容
  const handleCopyTitle = (val) => {
    copy(val);
  };

  // 标题首字母大写
  const transferText = (str) => {
    if (!str) return;
    // inputValue.value = str.charAt(0).toUpperCase() + str.slice(1);
    let newStr = str
      .replace(/\s[a-z]/g, function ($1) {
        return $1.toLocaleUpperCase();
      })
      .replace(/^[a-z]/, function ($1) {
        return $1.toLocaleUpperCase();
      })
      .replace(
        /\sOr[^a-zA-Z]|\sAnd[^a-zA-Z]|\sOf[^a-zA-Z]|\sAbout[^a-zA-Z]|\sFor[^a-zA-Z]|\sWith[^a-zA-Z]|\sOn[^a-zA-Z]/g,
        function ($1) {
          return $1.toLowerCase();
        }
      );
    inputValue.value = newStr;
  };
</script>

<style lang="scss" scoped>
  .area_limit {
    position: absolute;
    bottom: 1px;
    right: 15px;
    display: flex;
    align-items: center;
    background: #fcfbfb;
  }
  .platform_title {
    position: relative;
    .el-textarea {
      position: relative;
    }
    .el-input__validateIcon {
      display: none !important;
    }
  }
  .keyword_content {
    position: absolute;
    z-index: 999;
    overflow-y: auto;
  }
  .title_tag {
    margin: 5px;
    cursor: pointer;
  }
  .colorRed {
    color: red;
  }
  .title_text {
    padding-left: 3px;
    color: #aaa;
    font-size: 12px;
  }
  .transfer_img {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
</style>
<style lang="scss">
  .platform_title {
    .el-input__validateIcon {
      display: none !important;
    }
  }
</style>
