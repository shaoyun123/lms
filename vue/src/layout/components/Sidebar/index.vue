<template>
  <div class="sidebar-container">
    <Logo />
    <Search />
    <div class="scrollbar-wrapper">
      <Menu />
    </div>
  </div>
</template>

<script setup>
  import Logo from './Logo.vue';
  import Menu from './Menu.vue';
  import Search from './Search.vue';
</script>

<style lang="scss" scoped>
  .sidebar-container {
    z-index: 9999 !important;
    .scrollbar-wrapper {
      height: calc(100% - 50px);
      width: 100%;
    }
  }
</style>
