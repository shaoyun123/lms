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
      <span>步骤一：点击进入链接，登录coupang账号</span>
      <span style="padding-left: 10px">
        <a
          style="color: rgb(64, 158, 255); text-decoration: none"
          href="https://wing.coupang.com/"
          target="_blank"
          >进入链接</a
        >
      </span>
    </div>
    <div class="handleAcctAuth_input">
      <span
        >步骤二：授权的菜单路径为：卖家信息-其他商家信息-发行OPEN-API密钥-点击条款同意完毕-点击发行-选择"OPEN
        API"，点击确认</span
      >
    </div>
    <div class="handleAcctAuth_input">
      <span>步骤三：点击确认后，复制界面返回的信息填入以下输入框</span>
    </div>
    <el-input
      v-model="formData.vendorCode"
      placeholder="请输入企业代码Vendor code"
      size="default"
    >
      <template #prepend><span style="color: red">*</span>Vendor code</template>
    </el-input>
    <el-input
      v-model="formData.accessKey"
      style="margin-top: 10px"
      placeholder="请输入Access Key"
      size="default"
    >
      <template #prepend><span style="color: red">*</span>Access Key</template>
    </el-input>
    <el-input
      v-model="formData.secretKey"
      style="margin-top: 10px"
      placeholder="请输入Secret Key"
      size="default"
    >
      <template #prepend><span style="color: red">*</span>Secret Key</template>
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
  import { defineEmits, defineProps, onMounted, reactive } from 'vue';
  import { handleAuth } from '@/api/publishs/coupangstoremanage';
  import { ElMessage } from 'element-plus';
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
    storeAcctId: '',
    vendorCode: '',
    accessKey: '',
    secretKey: ''
  });

  const emit = defineEmits(['close']);

  onMounted(() => {
    console.log(props.editInfo);
    formData.storeAcctId = props.editInfo.id;
  });

  const getAuthSave = async () => {
    if (!formData.vendorCode || !formData.accessKey || !formData.secretKey) {
      return ElMessage.warning('授权信息所有字段必填！');
    }
    try {
      const { code } = await handleAuth(formData);
      if (code === '0000') {
        ElMessage.success('授权成功！');
        emit('close');
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
