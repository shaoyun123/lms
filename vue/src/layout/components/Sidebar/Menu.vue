<template>
  <div class="sidebar-menus">
    <div
      v-for="menu in menus"
      :key="menu.path"
      class="sidebar-menu-item"
      :class="{ hideMenu: menu.name === 'virturl' }"
      @mouseleave="hideMenuPannel($event)"
      @mouseenter="showMenuPannel($event)"
    >
      <template v-if="!menu.meta.hidden">
        <span class="menu-title">
          {{ !HIDE_MENU.includes(menu.meta.title) ? menu.meta.title : '' }}
        </span>
        <div v-if="menu.children" class="menu-pannel">
          <ul class="pannel-ul">
            <!-- 循环menu.children -->
            <li
              v-for="item in menu.children"
              :key="item.name"
              class="pannel-li"
            >
              <div class="li-title">
                {{
                  !HIDE_MENU.includes(item.meta.title) ? item.meta.title : ''
                }}
              </div>
              <div v-if="item.children" class="li-children-item">
                <Link
                  v-for="child in item.children"
                  :key="child.name"
                  :to="child.path"
                  :title="child.meta.title"
                >
                  {{
                    !HIDE_MENU.includes(child.meta.title)
                      ? child.meta.title
                      : ''
                  }}
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
  import usePermissionStore from '@/store/modules/permission.js';
  import { computed } from 'vue';
  import Link from './Link.vue';

  const permissionStore = usePermissionStore();

  let menus = computed(() => {
    return permissionStore.filterRoutes;
  });

  const HIDE_MENU = [
    '抠图',
    '换行逗号转换',
    '采集图片模块',
    '以图搜图',
    '定价工具',
    '小工具',
    '虚拟菜单',
    'amazon1'
  ];
  //鼠标悬浮在sidebar-menu-item,显示menu-pannel
  const showMenuPannel = (e) => {
    let menuPannel = e.target.lastElementChild;
    if (menuPannel && menuPannel.className.indexOf('menu-pannel') !== -1) {
      menuPannel.style.display = 'block';
      // //获取悬浮元素父元素的高度
      // let parentHeight = e.target.parentNode.offsetHeight; //菜单所在元素的高度
      // //获取menuPannel的高度
      // let menuPannelHeight = menuPannel.offsetHeight;
      // //获取menuPannel的top值
      // let menuPannelTop = menuPannel.getBoundingClientRect().top;
      //获取menuPannel的bottom值
      let menuPannelBottom = menuPannel.getBoundingClientRect().bottom;
      //获取当前屏幕可视高度
      let bodyClientHeight = document.body.clientHeight;
      // //如果menuPannel的高度+top值大于父元素的高度,则设置menuPannel的top值为父元素的高度-menuPannel的高度
      // if (menuPannelHeight + menuPannelTop > parentHeight) {
      //   if ((menuPannelHeight - 20) / 2 < menuPannelTop) {
      //     menuPannel.style.top = -(menuPannelHeight - 20) / 2 + 'px';
      //   } else {
      //     menuPannel.style.top = -menuPannelTop / 2 + 'px';
      //   }
      // }
      // 如果屏幕的高度>menuPannel的地步
      if (menuPannelBottom > bodyClientHeight) {
        menuPannel.style.top = bodyClientHeight - menuPannelBottom - 20 + 'px';
      }
    }
  };
  //鼠标离开在sidebar-menu-item,显示menu-pannel
  const hideMenuPannel = (e) => {
    let menuPannel = e.target.lastElementChild;
    if (menuPannel && menuPannel.className.indexOf('menu-pannel') !== -1) {
      menuPannel.style.display = 'none';
    }
  };
</script>

<style lang="scss" scoped>
  .hideMenu {
    display: none;
  }
  .sidebar-menus {
    height: 100%;
    .sidebar-menu-item {
      height: 45px;
      line-height: 45px;
      width: 100%;
      text-align: center;
      position: relative;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
        cursor: pointer;
        color: #fff;
        &:hover {
          transition: width 0.28s;
          background-color: #fff;
          color: #000;
        }
      }
      .menu-pannel {
        left: var(--v3-sidebar-hide-width) !important;
        display: none;
        top: -1px;
        position: absolute;
        z-index: 1000;
        background-color: #fff;
        border: 1px #e6e6e6 solid;
        border-left: 0 none;
        width: 800px;
        padding: 5px 15px;
        box-sizing: border-box;
        overflow-y: auto;
        max-height: 600px;
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
        ul {
          width: 100%;
          height: 100%;
          .pannel-li {
            width: 100%;
            height: auto;
            line-height: 45px;
            border-bottom: 1px #e6e6e6 dashed;
            display: flex;
            &:last-child {
              border-bottom: 0 none;
            }
            .li-title {
              width: 100px;
              height: 100%;
              display: inline-block;
              color: #000;
              font-weight: bold;
            }
            .li-children-item {
              width: 100%;
              height: 100%;
              display: flex;
              flex-wrap: wrap;
              a {
                display: inline-block;
                // width: 105px;
                flex: 0 0 20%;
                height: 100%;
                color: #000;
                &:hover {
                  color: #1890ff;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
