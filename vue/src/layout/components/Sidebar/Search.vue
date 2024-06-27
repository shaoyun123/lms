<template>
  <div class="sidebar-search-container">
    <div class="search-content">
      <el-icon size="20px" color="#fff"><Search /></el-icon>
    </div>

    <div class="search-info-content">
      <div style="padding: 15px 15px 0 15px">
        <el-input
          v-model="searchInfo"
          placeholder="请输入菜单名称"
          clearable
          size="default"
          :prefix-icon="Search"
          @clear="clearSearch"
          @input="handleFilterMenu"
        >
        </el-input>
      </div>

      <div v-if="showNoData">
        <el-empty description="暂无搜索结果" :image-size="100" />
      </div>
      <div v-else class="menu-content">
        <Link
          v-for="(item, index) in menuTitleList"
          :key="index"
          :to="item.url"
          class="menu-item"
        >
          <div class="menu-title" v-html="item.title"></div>
          <div class="menu-path">{{ item.path }}</div>
        </Link>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Link from './Link.vue';
  import { Search } from '@element-plus/icons-vue';
  import { ref } from 'vue';
  import { debounce } from 'lodash-es';
  import usePermissionStore from '@/store/modules/permission.js';
  import { computed } from 'vue';

  const permissionStore = usePermissionStore();
  let menus = computed(() => {
    return permissionStore.filterRoutes;
  });

  // input 输入的菜单名称
  const searchInfo = ref('');
  const search = (arr, path = '') => {
    for (let item of arr) {
      const currentPath = path + item.meta.title + ' / ';
      const url = item.path;
      if (item.meta.title.includes(searchInfo.value)) {
        const highlightedTitle = item.meta.title.replace(
          new RegExp(searchInfo.value, 'gi'),
          (match) => `<span style="color: #faaa39">${match}</span>`
        );
        menuTitleList.value.push({
          title: highlightedTitle,
          path: path,
          url: url
        });
      }

      if (item.children) {
        search(item.children, currentPath);
      }
    }
  };

  const menuTitleList = ref([]);
  const showNoData = ref(false);

  // 筛选出菜单
  const handleFilterMenu = debounce(() => {
    if (searchInfo.value) {
      menuTitleList.value = [];
      search(menus.value);
      // 去掉菜单路径最后一个"/"符号
      menuTitleList.value = menuTitleList.value.map((item) => {
        if (item.path.endsWith(' / ')) {
          item.path = item.path.slice(0, -3);
        }
        return item;
      });
      // 搜索出的菜单只显示 最后层级的菜单
      menuTitleList.value = menuTitleList.value.filter((item) => {
        return item.path.indexOf(' / ') > -1;
      });
      showNoData.value = menuTitleList.value?.length === 0 ? true : false;
    }
  }, 800);

  const clearSearch = () => {
    menuTitleList.value = [];
    showNoData.value = true;
  };
</script>

<style lang="scss" scoped>
  .sidebar-search-container {
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }
  .search-content {
    width: 100%;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .sidebar-search-container:hover {
    background-color: #fff;
    .el-icon {
      color: black;
    }
    .search-info-content {
      display: block !important;
    }
  }
  .search-info-content {
    display: none;
    width: 300px;
    min-height: 500px;
    position: absolute;
    left: var(--v3-sidebar-hide-width) !important;
    top: -1px;
    background-color: #fff;
    border: 1px #e6e6e6 solid;
    border-left: 0 none;
    box-sizing: border-box;
    overflow-y: auto;
    z-index: 1000;
  }
  .menu-content {
    max-height: 450px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 15px 0 15px 20px;
    overflow-y: auto;
    box-sizing: border-box;
    /* 滚动条宽度 */
    &::-webkit-scrollbar {
      width: 7px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #888; /* 设置滚动条滑块的背景颜色 */
      border-radius: 4px; /* 设置滚动条滑块的圆角 */
    }
    &::-webkit-scrollbar-track {
      background-color: #f1f1f1; /* 设置滚动条轨道的背景颜色 */
    }
    .menu-item {
      margin-bottom: 15px;
      cursor: pointer;
    }
    .menu-title {
      color: #000;
      margin-bottom: 5px;
    }
    .menu-path {
      color: #aaa;
    }
  }
  .titleHighlight {
    color: orange;
  }
</style>
