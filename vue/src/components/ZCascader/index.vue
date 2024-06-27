<template>
  <div v-click-outside="close">
    <!-- 点击输入框切换面板显示隐藏 -->
    <div ref="zcascader" class="z-cascader__wrapper" @click="toggle">
      <div class="z-cascader__container">
        <div class="z-cascader__tags">
          <div
            v-for="item in selectedLabels"
            :key="item"
            class="z-cascader__tags__item"
          >
            <template v-if="/\+\d+/.test(item)">
              <el-tag type="info">{{ item }}</el-tag>
            </template>
            <template v-else>
              <el-tag type="info" closable @close="handleCheckedClearChange">
                {{ item }}
              </el-tag>
            </template>
          </div>
        </div>
        <el-input
          v-model="searchText"
          :disabled="isDisabled"
          :placeholder="showPlaceholder()"
          class="z_cascader__input"
        >
          <template #suffix>
            <el-icon v-if="isVisible"><ArrowUp /></el-icon>
            <el-icon v-else><ArrowDown /></el-icon>
          </template>
        </el-input>
      </div>
    </div>
    <!-- 下拉部分 -->
    <teleport to="body">
      <div v-show="isVisible" ref="zdropdown" class="zdropdown" @click.stop>
        <template v-if="!isSearching">
          <div class="z-cascader-panel">
            <div v-if="showAll" class="z-cascader-panel__sidebar">
              <div @click="handleCheckAllChange">
                <el-icon><Finished /></el-icon>
                <span class="icon__text">全选</span>
              </div>
              <div @click="handleCheckReverseChange">
                <el-icon><Switch /></el-icon>
                <span class="icon__text">反选</span>
              </div>
              <div @click="handleCheckedClearChange">
                <el-icon><Close /></el-icon>
                <span class="icon__text">清空</span>
              </div>
            </div>
            <div class="floor-item floor-position-left-1">
              <render-list
                :only-last="onlyLast"
                :label-key="labelKey"
                :list="root.childNodes"
                :level="1"
                :active-list="activeList"
                @handle-click="handleClick"
                @handle-check="handleCheck"
              >
              </render-list>
            </div>
            <template v-for="item in maxLevellist">
              <div
                v-if="item.rendered && showData[item.id].length"
                v-show="activeList.length >= item.id"
                :key="item.id"
                :class="`floor-item floor-position-left-${item.id + 1}`"
              >
                <render-list
                  :only-last="onlyLast"
                  :list="showData[item.id]"
                  :level="item.id + 1"
                  :label-key="labelKey"
                  :active-list="activeList"
                  @handle-click="handleClick"
                  @handle-check="handleCheck"
                ></render-list>
              </div>
            </template>
          </div>
        </template>
        <template v-if="isSearching">
          <div class="zdropdown__search">
            <div class="zdropdown__checkbox">
              <div @click="handleCheckAllChange">
                <el-icon><Finished /></el-icon>
                <span class="icon__text">全选</span>
              </div>
              <div @click="handleCheckReverseChange">
                <el-icon><Switch /></el-icon>
                <span class="icon__text">反选</span>
              </div>
              <div @click="handleCheckedClearChange">
                <el-icon><Close /></el-icon>
                <span class="icon__text">清空</span>
              </div>
            </div>
          </div>
          <div class="z-cascader-search">
            <RecycleScroller
              v-slot="{ item }"
              :items="filteredSearchResults"
              :item-size="30"
              :item-secondary-size="400"
              :grid-items="1"
              key-field="id"
              class="recycle-scroller"
            >
              <div class="scroller-item">
                <el-checkbox
                  v-model="item.checked"
                  :label="item.totalLabel"
                  :title="item.totalLabel"
                  @update:model-value="handleCheck(item)"
                />
              </div>
            </RecycleScroller>
          </div>
        </template>
      </div>
    </teleport>
  </div>
</template>

<script setup name="ZCascader">
  import { ref, computed, watch, nextTick } from 'vue';
  import RenderList from './List.vue';
  import TreeStore from './lib/Tree.js';
  //定义props,接收父组件传递过来的数据
  const props = defineProps({
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          children: 'children',
          value: 'value'
        };
      }
    },
    showAll: {
      //是否展示全部
      type: Boolean,
      default: false
    },
    showNum: {
      //默认展示数量
      type: Number,
      default: 1
    },
    modelValue: {
      //父组件通过v-model传递过来的数据
      type: Array,
      default: () => [],
      required: true
    },
    separator: {
      type: String,
      default: '/'
    },
    onlyLast: {
      //设置只有最后一个节点可选中
      type: Boolean,
      default: false
    },
    isTwoDimensionValue: {
      type: Boolean,
      default: true
    },
    showLeafLabel: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: () => false
    }
  });
  //定义labelKey/valueKey
  const labelKey = computed(() => props.props.label);
  const valueKey = computed(() => props.props.value);
  //定义emit,传递给父组件对应的事件
  const emits = defineEmits(['update:modelValue']);
  //定义组件内数据
  const isVisible = ref(false);
  const store = ref({});
  const root = ref([]);
  const maxLevellist = ref([]);
  const showData = ref({});
  const activeClass = ref('floor-width-1');
  const activeList = ref([]);
  const selectedNodes = ref([]); //选中完整项
  const searchText = ref('');
  const zcascader = ref(null); // 用于获取点击输入框的dom
  const zdropdown = ref(null); // 用于获取下拉框的dom
  //搜索内容变化
  const filteredSearchResults = computed(() => {
    if (!searchText.value) {
      return [];
    }
    let tempResult = store.value.nodeList;
    tempResult = tempResult.filter((o) => o.isLeaf);
    //多个用逗号隔开
    let newValArr = searchText.value.split(',');
    let filteredArray = newValArr.filter(
      (item) => item !== null && item !== undefined && item !== ''
    );
    return tempResult.filter((item) => {
      return filteredArray.some((val) => {
        //模糊匹配
        return item.showLabel.indexOf(val) > -1;
      });
    });
  });
  const isSearching = computed(() => {
    return !(searchText.value.trim() === '');
  });

  //当selectedLabels.length>showNum.value时,展示showNum个label,后面用+1, +2号代替
  const selectedLabels = computed(() => {
    // 获取映射后的所有选中节点的标签
    const labels = selectedNodes.value.map((node) => node.showLabel);

    // 如果选中的节点不超过showNum，直接返回这些标签
    if (labels.length <= props.showNum) {
      return labels;
    }

    // 如果选中的节点超过showNum，则截取前showNum个并添加一个总数显示
    // const visibleLabels = labels.slice(0, props.showNum);
    // const overflowCount = labels.length - props.showNum;
    // const overflowLabel = `+${overflowCount}`;
    // 返回前showNum个标签加上一个表示超出数量的标签
    // return [...visibleLabels, overflowLabel];
    return [`${labels.length}项`];
  });
  //点击清空,执行功能如下
  const handleCheckedClearChange = () => {
    // 取消所有选中节点的选中状态
    const newSelectedNodes = [...selectedNodes.value];
    while (newSelectedNodes.length > 0) {
      const node = newSelectedNodes.pop();
      node.check(false);
    }
    // 发出事件更新父组件的 modelValue
    nextTick(() => {
      // 清空选中节点的数组
      selectedNodes.value = [];
      emits('update:modelValue', []);
    });
  };
  //执行全选操作
  const handleCheckAllChange = () => {
    // 仅在搜索状态下执行全选
    if (isSearching.value) {
      // 假设 filteredSearchResults 是一个根据搜索过滤得到的结果数组
      let index = 0;
      const results = filteredSearchResults.value;
      while (index < results.length) {
        const result = results[index];
        const node = store.value.nodesMap[result.id];
        if (node && !node.checked) {
          // 如果节点未选中
          node.check(true); // 选中节点
        }
        index++;
      }

      // 更新选中节点的状态
      updateSelectedNodes();
    } else if (props.showAll) {
      // 假设 filteredSearchResults 是一个根据搜索过滤得到的结果数组
      let index = 0;
      let tempResult = store.value.nodeList;
      const results = tempResult.filter((o) => o.isLeaf);
      while (index < results.length) {
        const result = results[index];
        const node = store.value.nodesMap[result.id];
        if (node && !node.checked) {
          // 如果节点未选中
          node.check(true); // 选中节点
        }
        index++;
      }

      // 更新选中节点的状态
      updateSelectedNodes();
    } else {
      console.log('非搜索状态，不执行全选操作');
    }
  };
  //执行反选操作[基于搜索内容的反选]
  const handleCheckReverseChange = () => {
    if (isSearching.value) {
      // 遍历当前搜索结果集
      let index = 0;
      const results = filteredSearchResults.value;
      while (index < results.length) {
        const result = results[index];
        const node = store.value.nodesMap[result.id];
        if (node) {
          node.check(!node.checked);
        }
        index++;
      }

      // 更新选中的节点
      updateSelectedNodes();
    } else if (props.showAll) {
      // 遍历当前搜索结果集
      let index = 0;
      let tempResult = store.value.nodeList;
      const results = tempResult.filter((o) => o.isLeaf);
      while (index < results.length) {
        const result = results[index];
        const node = store.value.nodesMap[result.id];
        if (node) {
          node.check(!node.checked);
        }
        index++;
      }

      // 更新选中的节点
      updateSelectedNodes();
    } else {
      console.log('没有搜索结果可反选');
    }
  };
  const toggle = (e) => {
    if (e.target.nodeName == 'INPUT' && zcascader.value.contains(e.target)) {
      isVisible.value = true;
      return;
    }
    isVisible.value = !isVisible.value;
  };
  const close = () => {
    isVisible.value = false;
    searchText.value = '';
  };
  //点击操作,接受子组件传递过来的值
  const handleClick = (node, levelIndex, level) => {
    if (maxLevellist.value[level - 1]) {
      maxLevellist.value[level - 1].rendered = true;
    }
    activeClass.value = `floor-width-${node.isLeaf ? level : level + 1}`;
    let tempList = [...activeList.value];
    if (level < tempList.length) {
      tempList.splice(level);
    }
    tempList[level - 1] = node.id;
    showData.value[level] = node.childNodes;
    activeList.value = tempList;
  };

  const handleCheck = (node) => {
    node.check(node.checked); // Toggle the current check state of the node.
    updateSelectedNodes(); // Synchronize the selectedNodes with the current selection.
  };

  // 更新全/反选后的节点状态
  const updateSelectedNodes = () => {
    // 清空当前选中的节点
    selectedNodes.value = [];

    // 更新 selectedNodes 数组
    const newSelectedNodes = [];
    const storeNodesMap = [...Object.values(store.value.nodesMap)];
    while (storeNodesMap.length > 0) {
      const node = storeNodesMap.pop();
      if (node.checked && node.isLeaf) {
        newSelectedNodes.push(node);
      }
    }
    selectedNodes.value = [...newSelectedNodes];
    nextTick(() => {
      // 更新 emit 出去的 modelValue 数据
      emits(
        'update:modelValue',
        selectedNodes.value.map((node) => node[valueKey.value])
      );
    });
  };
  //根据选中项的数量,展示不同的placeholder
  const showPlaceholder = () => {
    if (selectedLabels.value.length) {
      return '';
    }
    return props.placeholder;
  };

  //定义组件内方法
  //根据输入框的位置设置下拉框的位置
  const setDropdownPosition = () => {
    const { top, left } = zcascader.value.getBoundingClientRect();
    zdropdown.value.style.top = `${top + 34}px`;
    zdropdown.value.style.left = `${left}px`;
  };
  //初始化结构[不考虑select相关]
  const init = () => {
    store.value = new TreeStore({
      cascaderData: props.data,
      separator: props.separator,
      valueKey: props.props.value,
      labelKey: props.props.label,
      childrenKey: props.props.children,
      showLeafLabel: props.showLeafLabel
    });
    root.value = store.value.root;
    maxLevellist.value = Array.from(
      { length: store.value.maxLevel - 1 },
      (v, i) => {
        showData.value[i + 1] = [];
        return {
          id: i + 1,
          rendered: false
        };
      }
    );
    //初始化选中项
    let tempResult = store.value.nodeList;
    tempResult = tempResult.filter((o) => o.isLeaf);
    selectedNodes.value = tempResult.filter((item) =>
      props.modelValue.includes(item[valueKey.value])
    );
    const newSelectedNodes = [...selectedNodes.value];
    while (newSelectedNodes.length > 0) {
      const node = newSelectedNodes.pop();
      node.check(true);
    }
    updateSelectedNodes();
  };

  //mounted时初始化
  watch(
    () => props.data,
    (newData) => {
      // Wait for the data to be populated
      if (newData && newData.length > 0) {
        // Now that we have data, initialize it
        init();
      }
    },
    { immediate: true } // This ensures the watcher is run immediately on component mount
  );

  // 监听下拉框的显示隐藏
  watch(isVisible, (newVal) => {
    if (newVal) {
      setDropdownPosition();
    }
  });

  watch(
    () => props.modelValue,
    (newVal) => {
      if (Object.keys(store.value).length) {
        let tempList = store.value.nodeList.filter(
          (node) => newVal.includes(node[valueKey.value]) && node.isLeaf
        );

        // Uncheck previous nodes that are not in the new model values
        const newSelectedNodes = [...selectedNodes.value];
        while (newSelectedNodes.length > 0) {
          const node = newSelectedNodes.pop();
          if (!newVal.includes(node[valueKey.value])) {
            node.check(false);
          }
        }

        // Update the array of selected nodes
        selectedNodes.value = tempList;

        // Check the new nodes
        const newSelectedNodes2 = [...selectedNodes.value];
        while (newSelectedNodes2.length > 0) {
          const node = newSelectedNodes2.pop();
          node.check(true);
        }
      }
    },
    { immediate: true }
  );
  defineExpose({ selectedNodes });
</script>

<style lang="scss" scoped>
  .z-cascader {
    position: relative;

    &__wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
    }

    &__container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      vertical-align: middle;
      padding: 1px;
      box-shadow: rgb(220, 223, 230) 0px 0px 0px 1px inset;
      border-radius: 4px;
      .z-cascader__tags {
        cursor: pointer;
        flex: none;
        width: auto;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        cursor: pointer;
        z-index: 2000;
        &__item {
          margin: 0 1px;
          :deep(.el-tag__content) {
            max-width: 60px;
            width: fit-content;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .z_cascader__input {
        flex: 1;
        // padding-left: 50%;
        :deep(.el-input__wrapper) {
          box-shadow: none !important;
        }
        :deep(.el-input__inner) {
          border: none; /* 移除边框 */
          box-shadow: none !important; /* 移除聚焦时的阴影效果 */
          &:focus {
            outline: none !important; /* 移除蓝色聚焦轮廓 */
          }
        }
      }
    }

    &__input__icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .zdropdown {
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    z-index: 20231115;
    box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04),
      0px 8px 20px rgba(0, 0, 0, 0.08);
    .zdropdown__search {
      width: fit-content;
      box-sizing: border-box;
      padding: 3px 10px;
      border-right: none;
      :deep(.el-checkbox) {
        margin-right: 9px !important;
      }
      .zdropdown__checkbox {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        div {
          display: flex;
          align-items: center;
          line-height: 25px;
          width: 80px;
          // flex: 1;
          cursor: pointer;
          font-size: 12px;
          color: #999;
          &:hover {
            color: #409eff;
          }
          :deep(.el-icon) {
            font-size: 12px;
          }
          .icon__text {
            display: inline-block;
          }
        }
      }
      .zdropdown__clear {
        cursor: pointer;
        font-size: 13px;
        vertical-align: middle;
        display: inline-block;
        height: 24px;
        color: #4e5969;
        line-height: 26px;
        // margin-left: 10px;
        &:hover {
          color: #50a6ff;
        }
      }
    }
    .z-cascader-panel {
      display: flex;
      border-radius: 4px;
      font-size: 14px;
      .z-cascader-panel__sidebar {
        width: 70px;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        div {
          cursor: pointer;
          line-height: 40px;
          &:hover {
            color: #409eff;
          }
        }
      }
      .floor-item {
        background-color: #fff;
        border: 1px solid #dcdfe6;
        border-right: none;
        &:last-child {
          border-right: 1px solid #dcdfe6;
        }
      }
    }
  }
  .z-cascader-search {
    width: fit-content;
    height: 204px;
    min-width: 400px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: hidden;
    border-top: 1px solid #dcdfe6;
    color: #606266;
    .recycle-scroller {
      height: 204px;
      &::-webkit-scrollbar {
        width: 6px; /* 设置滚动条的宽度 */
      }
      &::-webkit-scrollbar-thumb {
        background-color: #888; /* 设置滚动条滑块的背景颜色 */
        border-radius: 4px; /* 设置滚动条滑块的圆角 */
      }
      &::-webkit-scrollbar-track {
        background-color: #f1f1f1; /* 设置滚动条轨道的背景颜色 */
      }
      .vue-recycle-scroller__item-view {
        width: fit-content !important;
      }
      .scroller-item {
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:hover {
          background-color: #f5f7fa;
        }
        :deep(.el-checkbox__label) {
          font-size: 14px;
          width: 350px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
