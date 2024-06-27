<template>
  <div style="padding: 10px">
    <el-card class="app-container common_split_bottom" style="padding: 20px">
      <el-form :model="state">
        <el-form-item label-width="80">
          <template #label>
            <span
              >关键词
              <el-tooltip
                effect="light"
                popper-class="hwcTooltipText"
                content="举例：<br/>
                  短信内容：【青竹论坛】您的验证码987654，请5分钟内完成验证。<br/>
                  关键字：青竹论坛<br/>
                  短信内容：验证码 2217，您在进行登录验证。[北极企鹅]<br/>
                  关键字：北极企鹅<br/>
                  短信内容：Verification Code: 809202. Valid for 5 minutes<br/>
                  关键字：Verification<br/>
                  短信内容：<Verification >Microsoft access code: 8021<br/>
                  关键字：Verification<br/>
                  【注意！】 关键字设置非常重要，设置错了直接收不到短信。关键宇一般是括号里的内容，没有括号的一般是整个短信的第一个字或词。"
                placement="right"
                :show-arrow="false"
                raw-content
                ><el-icon
                  :size="18"
                  style="vertical-align: text-bottom; cursor: pointer"
                  ><Warning
                /></el-icon> </el-tooltip
            ></span>
          </template>
          <div style="padding-left: 15px">
            <el-input v-model="state.keyWord" clearable> </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="d_flex">
            <div>
              <el-input
                v-model="state.appointPhoneNum"
                placeholder="手机号"
              ></el-input>
            </div>
            <el-button type="primary" @click="getPhoneNumber('appoint')">
              指定手机号
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="d_flex">
            <el-button type="primary" @click="getPhoneNumber('get')">
              获取号码
            </el-button>
            <div class="info_content">{{ state.phoneNumber }}</div>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="d_flex">
            <el-button type="primary" @click="getMessage()">
              收取短信
            </el-button>
            <div class="info_content">{{ state.message }}</div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup name="financialhuaweicloudhwcmsgreceivecode">
  import {
    getPhoneNumberApi,
    getMessageApi
  } from '@/api/financial/huaweicloud.js';
  import { reactive } from 'vue';
  import { ElMessage } from 'element-plus';

  const state = reactive({
    phoneNumber: '',
    message: '',
    keyWord: '',
    appointPhoneNum: ''
  });
  // 获取手机号 指定手机号
  const getPhoneNumber = async (type) => {
    try {
      let params = {
        phone: state.appointPhoneNum
      };
      if (!state.keyWord) {
        return ElMessage.warning('请输入关键词');
      }
      if (type === 'appoint' && state.appointPhoneNum === '') {
        ElMessage.warning('请填写手机号');
        return;
      }
      let regex = /^1[3456789]\d{9}$/;
      if (type === 'appoint' && !regex.test(state.appointPhoneNum)) {
        ElMessage.warning('请输入正确的11位手机号');
        return;
      }
      if (type === 'get') {
        params.phone = '';
      }
      state.phoneNumber = '';
      const { code, msg } = await getPhoneNumberApi(params);
      if (code === '0000') {
        state.phoneNumber = msg;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 收取短信
  const getMessage = async () => {
    if (!state.keyWord) {
      return ElMessage.warning('请输入关键词');
    }
    if (!state.phoneNumber) {
      return ElMessage.warning('请先获取号码');
    }
    try {
      state.message = '';
      let params = {
        phone: state.phoneNumber,
        keyWord: state.keyWord
      };
      const { code, msg } = await getMessageApi(params);
      if (code === '0000') {
        state.message = msg;
      }
    } catch (err) {
      console.log(err);
    }
  };
</script>
<style lang="scss" scoped>
  .d_flex {
    display: flex;
  }
  .info_content {
    padding: 0 20px;
    max-width: 500px;
  }
</style>
<style>
  .hwcTooltipText {
    margin-top: 50px;
  }
</style>
