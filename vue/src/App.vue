<!--
 * @Author: 陈芩 
 * @Date: 2023-05-16 21:48:57
 * @LastEditors: 陈芩 
 * @LastEditTime: 2023-07-11 09:16:31
 * @FilePath: /trade-web/src/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
  import { DndProvider } from 'vue3-dnd';
  import { HTML5Backend } from 'react-dnd-html5-backend';
</script>

<template>
  <DndProvider :backend="HTML5Backend">
    <router-view />
  </DndProvider>
</template>

<style scoped lang="scss"></style>
