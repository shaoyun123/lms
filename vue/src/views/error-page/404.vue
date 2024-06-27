<template>
  <div class="error-page">
    <div class="error-page-svg">
      <img src="@/assets/error-page/404.svg" alt="" />
    </div>
    <span>
      您还没有当前页面的访问权限，请找管理员授权后重新登录访问，或点击下面按钮
      <router-link to="/">
        <el-button type="primary">回到首页</el-button>
      </router-link>
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .error-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-svg {
      width: 400px;
      margin-bottom: 50px;
    }
  }
</style>
