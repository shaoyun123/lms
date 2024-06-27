<template>
  <div class="sidebar-logo-container">
    <transition name="sidebar-logo-fade">
      <router-link to="/">
        <img src="@/assets/layout/ep.png" class="sidebar-logo" />
      </router-link>
    </transition>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
  .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: var(--v3-tagsview-height);
    text-align: center;
    overflow: hidden;
    box-sizing: border-box;
    .sidebar-logo {
      width: 40px;
    }
  }
</style>
