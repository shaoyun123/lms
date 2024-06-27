<template>
  <div
    class="login"
    :class="{ loginImg: loginBackType === 'image' }"
    :style="
      loginBackType === 'image'
        ? { backgroundImage: 'url(' + imgUrl + ')' }
        : {}
    "
  >
    <video
      v-if="loginBackType === 'video'"
      id="video-background"
      autoplay
      loop
      muted
      poster
    >
      <source :src="videoUrl" type="video/mp4" />
    </video>
    <div class="login-container">
      <div class="card-header">
        <p>{{ loginTitle }}</p>
        <p>办公管理系统</p>
      </div>
      <div>
        <el-form
          ref="loginFormRef"
          class="login-form"
          :model="loginForm"
          :rules="loginFormRules"
          size="default"
        >
          <el-form-item prop="username">
            <span class="icon-container">
              <span class="iconfont">&#xe7ae;</span>
            </span>
            <el-input
              v-model="loginForm.username"
              type="text"
              placeholder="用户名"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="icon-container">
              <span class="iconfont">&#xe7fb;</span>
            </span>
            <el-input
              v-model="loginForm.password"
              placeholder="密码"
              type="password"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              style="width: 100%; background-color: #fff7b329"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import useUserStore from '@/store/modules/user';
  import axios from 'axios';

  let loginTitle = import.meta.env.VITE_APP_TITLE;

  const router = useRouter();

  const userStore = useUserStore();
  const loginFormRef = ref(null);
  /** 登录按钮 Loading */
  const loading = ref(false);
  /** 登录表单数据 */
  const loginForm = reactive({
    username: '',
    password: ''
  });

  /** 登录表单校验规则 */
  const loginFormRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 16, message: '长度在6个字符或以上', trigger: 'blur' }
    ]
  };

  /** 登录逻辑 */
  const handleLogin = () => {
    loginFormRef.value?.validate((valid) => {
      if (valid) {
        loading.value = true;
        userStore
          .login({
            username: loginForm.username,
            password: loginForm.password,
            code: loginForm.code
          })
          .then(() => {
            router.push({ path: '/' });
          })
          .catch(() => {
            loginForm.password = '';
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        return false;
      }
    });
  };

  const loginBackType = ref('image');
  const imgUrl = ref('https://imghz.epean.com.cn/trade/loginBack2024.jpg?v=1');
  const videoUrl = ref('');
  const getLoginBack = async () => {
    axios
      .get('/api/lms/prodImageAliyun/unLogin/queryLastLoginBackUrl')
      .then((res) => {
        if (res.data?.code === '0000') {
          let msg = res.data?.msg;
          // 背景文件上传时必须是 jpg 或者 mp4 格式 且文件名固定
          imgUrl.value = '';
          videoUrl.value = '';
          if (msg.indexOf('.jpg') > -1) {
            loginBackType.value = 'image';
            imgUrl.value = msg;
          }
          if (msg.indexOf('.mp4') > -1) {
            loginBackType.value = 'video';
            videoUrl.value = msg;
          }
        }
      });
  };

  //页面加载完成接收参数
  onMounted(() => {
    window.parent.postMessage(localStorage.getItem('lmsAppUserId'), '*');
    // 获取登录背景类型
    getLoginBack();
  });
</script>

<style lang="scss" scoped>
  .login {
    min-height: 100vh;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    background-position: 50%;
    #video-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      object-fit: cover;
    }
    .login-container {
      // position: absolute;
      // right: 200px;
      // top: 50%;
      // transform: translateY(-60%);
      width: 365px;
      height: 267px;
      background: rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      padding: 20px;
      .card-header {
        text-align: center;
        height: 80px;
        p {
          font-size: 18px;
          color: #fff;
          &:first-child {
            margin-bottom: 10px;
            font-size: 20px;
          }
          &:last-child {
            font-size: 12px;
          }
        }
      }
      .login-form {
        :deep(.el-form-item__content) {
          position: relative;
          .el-input {
            opacity: 0.5;
          }
          input {
            padding: 12px 5px 12px 15px;
          }
          .icon-container {
            position: absolute;
            padding: 6px;
            vertical-align: middle;
            display: inline-block;
            z-index: 999;
          }
        }
      }
    }
  }
</style>
