<template>
  <div class="left_menu">
    <div v-if="tpl.templateType === 'SKU_LABEL'" class="notice_wrapper">
      SKU标签模板必须要添加补打标元素
    </div>
    <div v-for="(item, index) in dragMenuList" :key="index" class="panel">
      <div class="panel_header" @click="handleShow(index)">
        <el-icon v-if="active === index"><ArrowUpBold /></el-icon>
        <el-icon v-else><ArrowDownBold /></el-icon>
        <span class="ml10">{{ item.name }}</span>
      </div>
      <div :class="['panel_collapse', active === index ? 'in' : '']"></div>
      <div v-if="active === index" class="panel_body">
        <template v-for="(elem, elemIndex) in item.list" :key="elemIndex">
          <div
            v-if="elem.collectedProps.isDragging"
            :ref="elem.dragPreview"
            :class="getDragitemClass(elem.itemType)"
            :data-type="elem.itemType"
          >
            <div
              v-if="elem.itemType === 'pre-img'"
              class="image"
              v-html="elem.itemHtml"
            ></div>
            <template v-else>
              <strong>{{ elem.itemName }}</strong>
              <span class="detail" style="display: none" v-html="elem.itemHtml">
              </span>
            </template>
          </div>
          <div
            v-else
            :ref="elem.dragSource"
            :class="getDragitemClass(elem.itemType)"
            :data-type="elem.itemType"
          >
            <div
              v-if="elem.itemType === 'pre-img'"
              class="image"
              v-html="elem.itemHtml"
            ></div>
            <template v-else>
              <strong>{{ elem.itemName }}</strong>
              <span class="detail" style="display: none" v-html="elem.itemHtml">
              </span>
            </template>
          </div>
        </template>
      </div>
    </div>
    <!-- 构图元素 -->
    <!-- <div v-for="(item, index) in dragCustomList" :key="index" class="panel">
      <div class="panel_header" @click="handleCustomShow(index)">
        <el-icon v-if="customActive === index"><ArrowUpBold /></el-icon>
        <el-icon v-else><ArrowDownBold /></el-icon>
        <span class="ml10">{{ item.name }}</span>
      </div>
      <div
        :class="['panel_collapse', customActive === index ? 'in' : '']"
      ></div>
      <div v-if="customActive === index" class="panel_body">
        <template v-for="(elem, elemIndex) in item.list" :key="elemIndex">
          <div
            v-if="elem.collectedProps.isDragging"
            :ref="elem.dragPreview"
            class="dragitem character"
            :data-type="item.itemType"
          >
            <strong>{{ elem.itemName }}</strong>
            <span class="detail" style="display: none" v-html="elem.itemHtml">
            </span>
          </div>
          <div
            v-else
            :ref="elem.dragSource"
            class="dragitem character"
            :data-type="item.itemType"
          >
            <strong>{{ elem.itemName }}</strong>
            <span class="detail" style="display: none" v-html="elem.itemHtml">
            </span>
          </div>
        </template>
      </div>
    </div> -->
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue';
  import { useDrag } from 'vue3-dnd';

  const props = defineProps({
    menuList: {
      type: Array,
      default: () => []
    },
    tpl: {
      type: Object,
      default: () => ({})
    }
  });

  // const customList = [
  //   {
  //     name: '构图元素',
  //     list: [
  //       {
  //         itemType: 'x-line',
  //         itemName: '横线',
  //         itemHtml: `<div class="dropitem" data-type="x-line" data-title="横线" style="width:100%;border-top-color:#000;height:2px;border-top-style:solid;border-top-width:2px">

  // </div>`
  //       },
  //       {
  //         itemType: 'y-line',
  //         itemName: '竖线',
  //         itemHtml: `<div class="dropitem" data-type="y-line"  data-title="竖线" style="width:2px;border-left-color:#000;height:100%;border-left-style:solid;border-left-width:2px">

  // </div>`
  //       },
  //       {
  //         itemType: 'square',
  //         itemName: '方形',
  //         itemHtml: `<div class="dropitem shapeText" data-type="square" data-title="方形" style="width: 40px;
  //   height: 40px;border-width: 2px;">
  //     <span  class="detail">A</span>
  // </div>`
  //       },
  //       {
  //         itemType: 'circular',
  //         itemName: '圆形',
  //         itemHtml: `<div class="dropitem circleText" data-type="circular" data-title="圆形" style="width: 40px;
  //   height: 40px;border-width: 2px;">
  //     <span  class="detail">A</span>
  // </div>`
  //       },
  //       {
  //         itemType: 'custom-text',
  //         itemName: '自定义文本',
  //         itemHtml: `<div class="dropitem" data-type="custom-text" data-title="自定义文本" style="width:150px;">
  //     <span data-text="customText" class="detail">自定文本内容</span>
  // </div>`
  //       },
  //       {
  //         itemType: 'custom-img',
  //         itemName: '自定义图片',
  //         itemHtml: `<div class="dropitem" data-type="custom-img" data-title="自定义图片" style="width:150px">
  //     <img data-text="custom-img" src="https://img.test.epean.cn/sub/ep/img/preprod/1/230620/d7691e78402880c00601.jpg">
  // </div>`
  //       }
  //     ]
  //   }
  // ];
  // const dragCustomList = computed(() => {
  //   return customList.map((item, index) => {
  //     const list = item.list.map((elem, elemIndex) => {
  //       const id = '2_' + index + '_' + elemIndex;
  //       const [collectedProps, dragSource, dragPreview] = useDrag({
  //         type: 'BOX',
  //         item: { id: id, itemHtml: elem.itemHtml, type: elem.itemType },
  //         collect: (monitor) => ({ isDragging: monitor.isDragging() })
  //       });
  //       return { ...elem, collectedProps, dragSource, dragPreview };
  //     });
  //     return { ...item, list };
  //   });
  // });

  // 拖拽
  const dragMenuList = computed(() => {
    return props.menuList.map((item, index) => {
      const list = item.list.map((elem, elemIndex) => {
        const id = index + '_' + elemIndex;
        const [collectedProps, dragSource, dragPreview] = useDrag({
          type: 'BOX',
          item: { id: id, itemHtml: elem.itemHtml, type: elem.itemType },
          collect: (monitor) => ({ isDragging: monitor.isDragging() })
        });
        return { ...elem, collectedProps, dragSource, dragPreview };
      });
      return { ...item, list };
    });
  });

  const active = ref(null);
  const handleShow = (index) => {
    if (active.value === index) {
      active.value = null;
    } else {
      active.value = index;
    }
  };
  const getDragitemClass = (itemType) => {
    const classStyle = ['dragitem', 'character'];
    if (itemType === 'pre-img') {
      classStyle.push('dragitem_img');
    }
    return classStyle;
  };

  // const customActive = ref(null);
  // const handleCustomShow = (index) => {
  //   if (customActive.value === index) {
  //     customActive.value = null;
  //   } else {
  //     customActive.value = index;
  //   }
  // };
</script>
<style lang="scss">
  .editor_wrapper {
    .left_menu {
      .dragitem_img {
        height: 50px;
        .image {
          display: flex;
          justify-content: center;
          height: 100%;
          .dropitem {
            height: 100% !important;
            position: unset;
            width: auto !important;
            img {
              height: 100%;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .notice_wrapper {
    color: var(--danger-color);
    padding: 5px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .left_menu {
    overflow-y: auto;
  }
  .panel {
    border-radius: 0;
    border-width: 1px 0;
    background-color: #fff;
    overflow: inherit;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }
  .panel_header {
    padding: 0 15px;
    margin: -1px -1px 0 -1px;
    color: #444;
    background-color: #f6f6f6;
    display: table-cell;
    vertical-align: middle;
    height: 40px;
    width: 1%;
    border-radius: 0;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #ddd;
    &:hover {
      color: #00b1e1;
    }
  }
  .panel_collapse {
    display: none;
  }
  .collapse.in {
    display: block;
  }
  .panel_body {
    overflow-y: auto;
    overflow-x: hidden;
    .dragitem {
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
      color: #6a6a6a;
      border: 1px solid #cfd9db;
      border-radius: 3px;
      cursor: move;
      .detail {
        display: none;
      }
    }
    .dragitem.character {
      margin: 10px;
      padding: 5px 7px;
      background-color: #f5f5f5;
      text-align: left;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
