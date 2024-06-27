<template>
  <el-dialog
    :model-value="showAuthDialog"
    title="店铺授权"
    width="30%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @close="handleClose()"
  >
    <el-input
      class="handleAcctAuth_input"
      disabled
      type="textarea"
      rows="1"
      :placeholder="`步骤一：点击“进入链接”，登录${CODE_ENUM[platCode]}账号，并点击提交，成功后复制网页地址栏中的code`"
    /><br />
    <el-input class="handleAcctAuth_input" disabled :value="acctAuthUrl">
      <template #append>
        <a :href="acctAuthUrl" target="_blank">进入链接</a>
      </template> </el-input
    ><br />
    <el-input
      class="handleAcctAuth_input"
      disabled
      placeholder="步骤二：填写获取的code，点击保存，即可成功授权"
    /><br />
    <el-input
      v-model="authCode"
      class="handleAcctAuth_input"
      placeholder="请输入code"
    />
    <template #footer>
      <span>
        <el-button type="primary" @click="getAuthSave()">保存</el-button>
        <el-button @click="handleClose()">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineEmits, defineProps, ref } from 'vue';
  import {
    apiAuthApi,
    generateAccessTokenApi
  } from '@/api/configure/storeconf.js';
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
    acctAuthUrl: {
      type: String,
      default: ''
    },
    platCode: {
      type: String,
      default: ''
    }
  });

  const emit = defineEmits(['close']);
  const authCode = ref('');

  // 平台枚举
  const CODE_ENUM = ref({
    daraz: 'daraz',
    pinduoduo: '拼多多'
  });

  // 授权
  const getAuthSave = async () => {
    if (authCode.value === '') {
      return ElMessage.warning('请输入code');
    }
    try {
      let params = {
        code: authCode.value,
        storeAcctId: props.editInfo.id
      };
      // 拼多多 generateAccessTokenApi
      const { code } =
        props.platCode === 'daraz'
          ? await apiAuthApi(params)
          : await generateAccessTokenApi(params);
      if (code === '0000') {
        ElMessage.success('授权成功');
        handleClose();
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
