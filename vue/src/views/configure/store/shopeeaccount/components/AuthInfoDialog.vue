<template>
  <!-- 店铺授权 弹窗 -->
  <div class="fullDialog">
    <el-dialog
      :model-value="showAuthDialog"
      :title="title"
      width="700px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div class="handleAcctAuth_input">
        <span
          >进入下方链接：登录shopee账号，点击YES同意授权。复制网页地址栏中的shop_id参数</span
        >
      </div>
      <div class="handleAcctAuth_input">
        链接地址：
        <a :href="formData.authUrl" class="link-url" target="_blank">{{
          formData.authUrl
        }}</a>
      </div>
      <template #footer>
        <span>
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    getStoreAuthUrlApi,
    getChatAuthUrlApi,
    getAdsAuthUrlApi
  } from '@/api/configure/shopeeaccount';
  const props = defineProps({
    showAuthDialog: {
      type: Boolean,
      default: false
    },
    editInfo: {
      type: Object,
      default: () => {}
    },
    authType: {
      type: String,
      default: 'store'
    }
  });
  const formData = reactive({
    storeAcctId: '',
    authUrl: null
  });

  const title = ref();

  const emit = defineEmits(['close']);

  onMounted(async () => {
    const { authType } = props;
    const titleObj = {
      chat: 'chat授权',
      store: '授权',
      ads: '广告账户授权'
    };
    title.value = titleObj[authType];
    formData.storeAcctId = props.editInfo.id;
    const apiObj = {
      chat: getChatAuthUrlApi,
      store: getStoreAuthUrlApi,
      ads: getAdsAuthUrlApi
    };
    try {
      if (authType === 'store') {
        const { data } = await apiObj[authType](props.editInfo.id);

        formData.authUrl = data;
      } else {
        const { msg } = await apiObj[authType]();
        formData.authUrl = msg;
      }
    } catch (err) {
      console.log('err :>> ', err);
    }
  });

  const handleClose = () => {
    emit('close');
  };
</script>

<style lang="scss" scoped>
  .handleAcctAuth_input {
    width: 100% !important;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid rgb(220, 223, 230);
    color: #999;
    box-sizing: border-box;
  }
  .link-url {
    color: rgb(64, 158, 255);
    text-decoration: none;
    word-break: break-all;
  }
</style>
