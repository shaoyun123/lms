<template>
  <div class="z-select">
    <!-- 点击输入框部分[存放选中的值] -->
    <div ref="zselect" class="z-select__wrapper" @click="open = !open">
      <div class="z-select__container">
        <div class="z-select__tags">
          <div
            v-for="item in zCheckedLabelListShow"
            :key="item"
            class="z-select__tags__item"
          >
            <template v-if="/\+\d+/.test(item) || disabledVal?.includes(item)">
              <el-tag type="info">{{ item }}</el-tag>
            </template>
            <template v-else>
              <el-tag type="info" closable @close="handleCloseTags(item)">
                {{ item }}
              </el-tag>
            </template>
          </div>
        </div>
        <el-input
          readonly
          :placeholder="zCheckedLabelListShow.length ? '' : defaultText"
        >
          <template #suffix>
            <el-icon v-if="open"><ArrowUp /></el-icon>
            <el-icon v-else><ArrowDown /></el-icon>
          </template>
        </el-input>
      </div>
    </div>
    <!-- 下拉部分 -->
    <teleport to="body">
      <div v-show="open" ref="zdropdown" class="zdropdown">
        <div class="zdropdown__icon">
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
        <div class="zdropdown__search">
          <el-input
            ref="zSearchRef"
            v-model="zSearchValue"
            placeholder="请输入"
          />
        </div>
        <div
          class="zdropdown__content"
          :style="{
            maxHeight: maxHeight + 'px',
            overflow: 'auto'
          }"
        >
          <el-checkbox-group v-model="zCheckedList">
            <RecycleScroller
              v-slot="{ item }"
              :items="zOptions"
              :item-size="30"
              :item-secondary-size="200"
              :grid-items="1"
              key-field="id"
              class="recycle-scroller"
            >
              <div class="zLiItem">
                <!-- 这里就是自己要渲染的每一项的内容-->
                <el-checkbox
                  :key="item.id"
                  :value="item.id"
                  :disabled="disabledVal?.includes(item.name)"
                >
                  {{ item.name }}
                </el-checkbox>
              </div>
            </RecycleScroller>
          </el-checkbox-group>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup name="zSelect">
  import { ref, onMounted, watch, computed } from 'vue';
  const emits = defineEmits(['update:modelValue']);
  //接受传递过来的值
  const props = defineProps({
    items: {
      type: Array,
      required: true
    },
    num: {
      type: Number,
      default: 1
    },
    defaultText: {
      type: String,
      default: '请选择'
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    disabledVal: {
      type: Array,
      default: () => []
    }
  });

  //#region 输入框/下拉着显示隐藏
  const open = ref(false);
  const zselect = ref(null); // 用于获取点击输入框的dom
  const zdropdown = ref(null); // 用于获取下拉框的dom
  //父组件需要传递: showNum[默认显示一个,其余用+n条显示], zOptions[所有的选项], zCheckedList[选中的值,是数组]
  //显示的个数
  const showNum = ref(props.num);
  watch(
    () => props.num,
    (newVal) => {
      showNum.value = newVal;
    }
  );
  //所有的选项
  const zAllOptions = computed(() => props.items);
  const zCheckedList = computed({
    //选中的值
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  // 点击其他地方关闭下拉框,点击下拉框不关闭
  const closeDropdown = (e) => {
    if (zselect.value && zdropdown.value) {
      if (
        !zselect.value.contains(e.target) &&
        !zdropdown.value.contains(e.target)
      ) {
        open.value = false;
        zSearchValue.value = '';
      }
    }
  };
  // 监听点击事件
  onMounted(() => {
    document.addEventListener('click', closeDropdown);
  });

  //根据输入框的位置设置下拉框的位置
  const setDropdownPosition = () => {
    const { top, left } = zselect.value.getBoundingClientRect();
    zdropdown.value.style.top = `${top + 35}px`;
    zdropdown.value.style.left = `${left}px`;
    zdropdown.value.style.width = `fit-content`;
  };
  // 监听下拉框的显示隐藏
  watch(open, (newVal) => {
    if (newVal) {
      setDropdownPosition();
      zSearchRef.value.focus();
    }
  });
  //#endregion

  //#region 下拉框选项操作
  const zSearchValue = ref(''); //搜索框的值
  const zSearchRef = ref(); // 搜索框
  const zOptions = ref([]); //搜索后的选项
  const maxHeight = ref(400); //下拉框的最大高度
  zOptions.value = zAllOptions.value;
  watch(
    () => props.items,
    (val) => {
      zOptions.value = val;
    }
  );
  //全选
  const handleCheckAllChange = () => {
    //获取搜索的选项
    let zSearchOpts = zOptions.value.map((item) => item.id);
    //获取选中的选项
    let zCheckedOpts = zCheckedList.value;
    //组合成新的选项并去重
    let zNewCheckedOpts = [...new Set([...zSearchOpts, ...zCheckedOpts])];
    //通知父组件更新
    zCheckedList.value = zNewCheckedOpts;
  };
  //反选
  const handleCheckReverseChange = () => {
    //获取所有的选项
    let zAllOpts = zAllOptions.value.map((item) => item.id);
    //获取选中的选项
    let zCheckedOpts = zCheckedList.value;
    //从所有的选项中删除选中的选项
    let zNewCheckedOpts = zAllOpts.filter(
      (item) => !zCheckedOpts.includes(item)
    );
    //通知父组件更新
    zCheckedList.value = zNewCheckedOpts;
  };
  //清空
  const handleCheckedClearChange = () => {
    zCheckedList.value = [];
  };
  //监听搜索内容,多个用逗号隔开,匹配选项,仅展示匹配项;如果搜索内容为空,则展示全部选项
  watch(zSearchValue, (newVal) => {
    if (newVal) {
      //多个用逗号隔开
      let newValArr = newVal.split(',');
      zOptions.value = zAllOptions.value.filter((item) => {
        return newValArr.some((val) => {
          //模糊匹配
          return item.name.indexOf(val) > -1;
        });
      });
    } else {
      zOptions.value = zAllOptions.value;
    }
  });
  //根据选中的zCheckedList,匹配zAllOptions,返回label的数组
  const zCheckedLabelList = computed(() => {
    return zAllOptions.value
      .filter((item) => zCheckedList.value.includes(item.id))
      .map((item) => item.name);
  });
  //关闭tags,同时更新zCheckedList
  const handleCloseTags = (label) => {
    //从zAllOptions中找到对应zCheckedList的完整项
    let zCheckedOptsList = zAllOptions.value.filter((item) =>
      zCheckedList.value.includes(item.id)
    );
    //从完整项中找到对应的label
    let zCheckedLabel = zCheckedOptsList.find((item) => item.name == label);
    //从zCheckedList中删除对应的id
    zCheckedList.value = zCheckedList.value.filter(
      (item) => item != zCheckedLabel.id
    );
    // emits('update:modelValue', zCheckedList.value);
  };
  //当zCheckedLabelList.length>showNum.value时,展示showNum.value个label,后面用+1, +2号代替
  const zCheckedLabelListShow = computed(() => {
    if (zCheckedLabelList.value.length > showNum.value) {
      let newArr = zCheckedLabelList.value.slice(0, showNum.value);
      return [...newArr, `+${zCheckedLabelList.value.length - showNum.value}`];
    } else {
      return zCheckedLabelList.value;
    }
  });

  //#endregion
</script>

<style lang="scss" scoped>
  .z-select {
    width: 100%;
    height: 100%;
    position: relative;

    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      position: relative;
    }

    &__container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      :deep(.el-input__inner) {
        cursor: pointer;
      }
      .z-select__tags {
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        cursor: pointer;
        z-index: 2999;
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
    border: 1px solid #fff;
    background-color: #fff;
    border-radius: 4px;
    padding: 5px;
    box-sizing: border-box;
    z-index: 20231030;
    max-height: 500px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 12px 0px;
    .zdropdown__icon {
      display: flex;
      align-items: center;
      line-height: 30px;
      font-size: 14px;
      margin-bottom: 6px;
      div {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 80px;
        cursor: pointer;
        border-radius: 5px;
        color: #999;
        &:hover {
          color: #409eff;
        }
        :deep(.el-icon) {
          font-size: 14px;
        }
        .icon__text {
          margin-left: 6px;
          display: inline-block;
        }
      }
    }
    .recycle-scroller {
      height: 250px;
    }
    &__search {
      :deep(.el-input__inner) {
        //去除左右以及上下的边框
        border: none;
        outline: 0;
      }
      margin-bottom: 5px;
    }
    &__content {
      ::-webkit-scrollbar {
        width: 3px; /* 设置滚动条的宽度 */
      }
      ::-webkit-scrollbar-thumb {
        background-color: #888; /* 设置滚动条滑块的背景颜色 */
        border-radius: 4px; /* 设置滚动条滑块的圆角 */
      }
      ::-webkit-scrollbar-track {
        background-color: #f1f1f1; /* 设置滚动条轨道的背景颜色 */
      }
      .zLiItem {
        padding: 5px;
        width: max-content;
      }
    }
  }
</style>
