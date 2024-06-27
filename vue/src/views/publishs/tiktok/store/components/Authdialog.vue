<template>
  <!-- 店铺授权 弹窗 -->
  <el-dialog
    :model-value="showAuthDialog"
    :title="title"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="handleAcctAuth_input">
      <span
        >进入下方链接，登录TikTok账号，按照界面步骤操作授权，直至界面返回授权成功提示即可。</span
      >
    </div>
    <div class="handleAcctAuth_input">
      链接地址：
      <a
        style="color: rgb(64, 158, 255); text-decoration: none"
        :href="formData.authUrl"
        target="_blank"
        >{{ formData.authUrl }}</a
      >
    </div>
    <template #footer>
      <span>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineEmits, defineProps, onMounted, reactive, ref } from 'vue';
  import { handleAuth, chatAuthApi } from '@/api/publishs/tiktokstoremanage';
  import { ElMessage } from 'element-plus';
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
    console.log(props.editInfo);
    const { authType } = props;
    const titleObj = {
      chat: 'chat授权',
      store: '店铺授权'
    };
    title.value = titleObj[authType];
    formData.storeAcctId = props.editInfo.id;
    const apiObj = {
      chat: chatAuthApi,
      store: handleAuth
    };
    const { code, msg } = await apiObj[authType](props.editInfo.id);
    if (code === '0000') {
      formData.authUrl = msg;
    } else {
      ElMessage.error(msg);
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
</style>
