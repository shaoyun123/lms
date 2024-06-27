<!-- 多行文本“展开收起” -->
<template>
  <div class="expand_text">
    <div
      :class="[
        'expand_text_content',
        lineClamp !== defaultLine ? 'expand_text_content_more' : ''
      ]"
      :style="style"
    >
      <el-button
        type="primary"
        link
        class="expand_text_btn"
        @click="handleClick"
      ></el-button>
      {{ text }}
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  // eslint-disable-next-line
  const props = defineProps({
    defaultLine: {
      type: Number,
      default: 3
    },
    text: {
      type: String,
      default: ''
    }
  });
  const lineClamp = ref(props.defaultLine);
  const style = computed(() => ({ '-webkit-line-clamp': lineClamp.value }));
  const handleClick = () => {
    lineClamp.value =
      lineClamp.value === props.defaultLine ? 999 : props.defaultLine;
  };
</script>

<style lang="scss" scoped>
  .expand_text {
    display: flex;
    .expand_text_content {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: justify;
      position: relative;
      &::before {
        content: '';
        float: right;
        width: 0;
        height: calc(100% - 18px);
      }
      &::after {
        content: '';
        width: 900px;
        height: 900px;
        position: absolute;
        margin-left: -30px;
        box-shadow: inset -870px -880px 0 0 #fff;
      }
      .expand_text_btn {
        float: right;
        clear: both;
        // position: relative;
        &::before {
          content: '...';
          position: absolute;
          left: -10px;
          transform: translateX(-100%);
        }
        &::after {
          content: '展开';
        }
      }
    }
    .expand_text_content_more {
      .expand_text_btn {
        &::after {
          content: '收起';
        }
      }
      &::after {
        visibility: hidden;
      }
    }
  }
  .vxe-table--render-default .vxe-body--row.row--hover,
  .vxe-table--render-default .vxe-body--row.row--hover.row--stripe {
    &:hover {
      .expand_text_content::after {
        box-shadow: inset -870px -880px 0 0 #f5f7fa;
      }
    }
  }
  .vxe-table--render-default .vxe-body--row.row--current {
    .expand_text_content::after {
      box-shadow: inset -870px -880px 0 0 #e6f7ff;
    }
  }
  .vxe-table--render-default .vxe-body--row.row--hover.row--current {
    &:hover {
      .expand_text_content::after {
        box-shadow: inset -870px -880px 0 0 #d7effb;
      }
    }
  }
</style>
