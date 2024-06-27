<template>
  <!-- 店铺授权 弹窗 -->
  <el-dialog
    :model-value="showAuthDialog"
    title="店铺授权"
    width="30%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="handleAcctAuth_input">
      <span>步骤一：点击进入链接，登录TEMU账号</span>
      <span style="padding-left: 10px">
        <a
          style="color: rgb(64, 158, 255); text-decoration: none"
          href="https://kuajing.pinduoduo.com/login"
          target="_blank"
          >进入链接</a
        >
      </span>
    </div>
    <div class="handleAcctAuth_input">
      <span
        >步骤二：授权的菜单路径为：系统管理-授权管理-获取授权-对接系统选择"{{
          text
        }}"</span
      >
    </div>
    <div class="handleAcctAuth_input">
      <span
        >步骤三：点击确认后，复制弹窗界面返回的access_token,填入以下输入框</span
      >
    </div>
    <el-input
      v-model="formData.accessToken"
      placeholder="请输入access_token"
      size="default"
    >
    </el-input>
    <template #footer>
      <span>
        <el-button type="primary" @click="getAuthSave()">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineEmits, defineProps, onMounted, reactive, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { authStore } from '@/api/publishs/temustoremanage';
  const props = defineProps({
    showAuthDialog: {
      type: Boolean,
      default: false
    },
    editInfo: {
      type: Object,
      default: () => {}
    }
  });
  const formData = reactive({
    id: '',
    accessToken: ''
  });
  const text = ref('');

  const emit = defineEmits(['close']);

  onMounted(() => {
    formData.id = props.editInfo.acctDetailId;
    let origin = window.location.origin;
    if (origin.indexOf('lms') !== -1) {
      text.value = '上海幂涵';
    } else {
      text.value = 'pinxuan';
    }
  });

  const getAuthSave = async () => {
    if (!formData.accessToken) {
      return ElMessage.warning('请输入access_token！');
    }
    try {
      const { code } = await authStore(formData);
      if (code === '0000') {
        ElMessage.success('授权成功！');
        emit('close', 'update');
      }
    } catch (err) {
      console.log(err);
    }
  };

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
