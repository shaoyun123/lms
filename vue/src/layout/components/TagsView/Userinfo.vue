<template>
  <div>
    <el-dropdown class="userinfo-admin" size="default" @command="handleCommand">
      <span class="el-dropdown-link"> {{ userInfo.loginName }} </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="modify">修改密码</el-dropdown-item>
          <el-dropdown-item command="profile">个人设置</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- <Notify class="userinfo-notify" /> -->
  </div>
</template>

<script setup>
  // import Notify from '@/components/Notify/index.vue';
  import useUserStore from '@/store/modules/user';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  const userStore = useUserStore();
  const { logout } = userStore;
  const userInfo = computed(() => userStore.userInfo);

  const router = useRouter();
  //根据command执行不同的操作
  const handleCommand = (command) => {
    switch (command) {
      case 'modify':
        router.push('/modify/password');
        break;
      case 'profile':
        router.push('/modify/profile');
        break;
      case 'logout':
        //退出登录
        logout();
        break;
      default:
        break;
    }
  };
</script>

<style lang="scss" scoped>
  .userinfo-notify {
    margin-left: 40px;
    cursor: pointer;
  }
  .userinfo-admin {
    cursor: pointer;
  }
</style>
