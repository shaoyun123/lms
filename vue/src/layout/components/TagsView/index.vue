<template>
  <div class="tags-view-container">
    <ScrollPane class="tags-view-wrapper">
      <router-link
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.meta?.tabName || tag.meta?.title }}
        <el-icon
          v-if="!isAffix(tag)"
          :size="12"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </ScrollPane>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭
      </li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script setup name="tagsview">
  import path from 'path-browserify';
  import { ref, getCurrentInstance, watch, onMounted, unref } from 'vue';
  import { addQueryParamToUrl } from '@/utils/common';
  import { Close } from '@element-plus/icons-vue';
  import { useRoute, useRouter } from 'vue-router';
  import ScrollPane from './ScrollPane.vue';
  import useTagsViewStore from '@/store/modules/tags-view';
  import usePermissionStore from '@/store/modules/permission';
  import userIframeStore from '@/store/modules/iframes';

  const tagsViewStore = useTagsViewStore();
  const permissionStore = usePermissionStore();
  const iframeStore = userIframeStore();
  const instance = getCurrentInstance(); //当前组件实例
  const router = useRouter(); //路由
  const route = useRoute(); //当前路由
  const visible = ref(false); //右键菜单是否显示
  const top = ref(0); //右键菜单的位置
  const left = ref(0); //右键菜单的位置
  const selectedTag = ref({}); //当前选中的标签
  let affixTags = []; //固定的标签

  //当前tag是否被选中
  const isActive = (tag) => {
    return tag.path === route.path;
  };
  //当前tag是否固定
  const isAffix = (tag) => {
    return tag.meta?.affix;
  };
  //筛选出固定的标签
  const filterAffixTags = (routes, basePath = '/') => {
    let tags = [];
    routes.forEach((route) => {
      if (route.meta?.affix) {
        const tagPath = path.resolve(basePath, route.path);
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta }
        });
      }
      if (route.children) {
        const childTags = filterAffixTags(route.children, route.path);
        if (childTags.length >= 1) {
          tags = tags.concat(childTags);
        }
      }
    });
    return tags;
  };
  //初始化固定的标签
  const initTags = () => {
    affixTags = filterAffixTags(permissionStore.routes);
    for (const tag of affixTags) {
      // 必须含有 name 属性
      if (tag.name) {
        tagsViewStore.addVisitedView(tag);
      }
    }
  };
  //添加标签
  const addTags = () => {
    if (route.name) {
      tagsViewStore.addVisitedView(route);
      tagsViewStore.addCachedView(route);
      //如果route.name转大写可以在iframeStore.iframesObj中找到对应的iframe标签,就调用createdPage
      if (iframeStore.iframesObj[route.name.toUpperCase()]) {
        iframeStore.createdPage({ id: route.name.toUpperCase() });
      }
    }
  };
  //刷新选中的标签
  const refreshSelectedTag = (tag) => {
    const { fullPath, query, meta } = unref(tag);
    if (meta.isVue == 1) {
      //获取当前iframe的name
      const iframeName = tag.name;
      //根据name获取iframe
      const iframeDom = document.querySelector(`iframe[name=${iframeName}]`);
      const iframeSrc = iframeDom.getAttribute('src');
      const timestamp = new Date().getTime();
      const modifiedUrl = addQueryParamToUrl(iframeSrc, 'timestamp', timestamp);
      //部分链接有hash,刷新无效,需要对hash做特殊处理
      iframeDom.setAttribute('src', modifiedUrl);
    } else {
      router.replace({
        path: '/redirect' + fullPath,
        query
      });
    }
    //在pinia中删除缓存的name
    tagsViewStore.delCachedView(tag);
  };
  //关闭选中的标签
  const closeSelectedTag = (tag) => {
    tagsViewStore.delVisitedView(tag);
    tagsViewStore.delCachedView(tag);
    //调用iframeStore的销毁页面方法
    if (iframeStore.iframesObj[tag.name.toUpperCase()]) {
      iframeStore.beforeDestroyPage(tag.name.toUpperCase());
    }
    toLastView(tagsViewStore.visitedViews, tag);
  };
  //关闭其他标签
  const closeOthersTags = () => {
    if (
      selectedTag.value.fullPath !== route.path &&
      selectedTag.value.fullPath !== undefined
    ) {
      router.push(selectedTag.value.fullPath);
    }
    tagsViewStore.delOthersVisitedViews(selectedTag.value);
    tagsViewStore.delOthersCachedViews(selectedTag.value);
  };
  //关闭所有标签
  const closeAllTags = (tags) => {
    tagsViewStore.delAllVisitedViews();
    tagsViewStore.delAllCachedViews();
    if (affixTags.some((tag) => tag.path === route.path)) {
      return;
    }
    toLastView(tagsViewStore.visitedViews, tags);
  };
  //跳转到选中的标签
  const toLastView = (visitedViews, view) => {
    const latestView = visitedViews.slice(-1)[0];
    if (latestView !== undefined && latestView.fullPath !== undefined) {
      router.push(latestView.fullPath);
    } else {
      // 如果 TagsView 全部被关闭了，则默认重定向到主页
      if (view.name === 'Dashboard') {
        // 重新加载主页
        router.push({ path: '/redirect' + view.path, query: view.query });
      } else {
        router.push('/');
      }
    }
  };
  //实现右键菜单
  const openMenu = (tag, e) => {
    const menuMinWidth = 105;
    // container margin left
    const offsetLeft = instance.proxy.$el.getBoundingClientRect().left;
    // container width
    const offsetWidth = instance.proxy.$el.offsetWidth;
    // left boundary
    const maxLeft = offsetWidth - menuMinWidth;
    // 15: margin right
    const left15 = e.clientX - offsetLeft + 15;
    if (left15 > maxLeft) {
      left.value = maxLeft;
    } else {
      left.value = left15;
    }
    top.value = e.clientY;
    visible.value = true;
    selectedTag.value = tag;
  };
  //关闭右键菜单
  const closeMenu = () => {
    visible.value = false;
  };
  //监听路由变化
  watch(
    () => route.path,
    () => {
      addTags();
    },
    {
      deep: true
    }
  );
  //监听右键菜单
  watch(visible, (value) => {
    if (value) {
      document.body.addEventListener('click', closeMenu);
    } else {
      document.body.removeEventListener('click', closeMenu);
    }
  });
  onMounted(() => {
    initTags();
    addTags();
  });
</script>

<style lang="scss" scoped>
  .tags-view-container {
    height: var(--v3-tagsview-height);
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 #00000010, 0 0 3px 0 #00000010;
    .tags-view-wrapper {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid var(--v3-tagsview-tag-border-color);
        border-radius: var(--v3-tagsview-tag-border-radius);
        color: var(--v3-tagsview-tag-text-color);
        background-color: var(--v3-tagsview-tag-bg-color);
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;
        &:first-of-type {
          margin-left: 5px;
        }
        &:last-of-type {
          margin-right: 5px;
        }
        &.active {
          background-color: var(--v3-tagsview-tag-active-bg-color);
          color: var(--v3-tagsview-tag-active-text-color);
          border-color: var(--v3-tagsview-tag-active-border-color);
          &::before {
            content: '';
            background-color: var(--v3-tagsview-tag-active-before-color);
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: relative;
            margin-right: 2px;
          }
        }
        .el-icon {
          margin: 0 2px;
          vertical-align: middle;
          border-radius: 50%;
          &:hover {
            background-color: var(--v3-tagsview-tag-icon-hover-bg-color);
            color: var(--v3-tagsview-tag-icon-hover-color);
          }
        }
      }
    }
    .contextmenu {
      margin: 0;
      background-color: #fff;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 #00000030;
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background-color: #eee;
        }
      }
    }
  }
</style>
