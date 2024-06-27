<template>
  <div class="app-container">
    <el-card>
      <el-form
        class="modifyProfileForm"
        :label-position="labelPosition"
        label-width="100px"
        :model="modifyProfileForm"
        :rules="rules"
        style="max-width: 460px"
      >
        <el-form-item label="性别" prop="gender">
          <el-select v-model="modifyProfileForm.gender">
            <el-option label="男" :value="true" />
            <el-option label="女" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthdayStr">
          <el-date-picker
            v-model="modifyProfileForm.birthdayStr"
            style="width: 100%"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="modifyProfileForm.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="modifyProfileForm.mobile" autocomplete="off" />
        </el-form-item>
        <el-form-item class="modifyProfileForm-btn">
          <el-button
            type="primary"
            :loading="loading"
            @click="submitmodifyProfileForm"
          >
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
  import useUserStore from '@/store/modules/user';
  import { reactive, ref } from 'vue';
  import { modifyUserInfoApi } from '@/api/user';
  import { ElMessage } from 'element-plus';

  const { userInfo, getInfo } = useUserStore();
  const labelPosition = ref('right');
  const loading = ref(false);

  const modifyProfileForm = reactive({
    gender: userInfo.gender,
    birthdayStr: userInfo.birthday,
    email: userInfo.email,
    mobile: userInfo.mobile
  });
  //校验邮箱格式是否正确
  const checkEmail = (rule, value, callback) => {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (value === '') {
      callback(new Error('请输入邮箱'));
    } else if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱'));
    } else {
      callback();
    }
  };
  //校验form表单
  const rules = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { validator: checkEmail, trigger: 'blur' }
    ]
  };
  //提交表单
  const submitmodifyProfileForm = async () => {
    loading.value = true;
    try {
      const res = await modifyUserInfoApi(modifyProfileForm);
      if (res.code === '0000') {
        loading.value = false;
        ElMessage.success(res.msg || '修改成功');
        //重新获取用户信息
        getInfo();
      }
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
</script>

<style lang="scss" scoped>
  .modifyProfileForm {
    :deep(.el-form-item__content) {
      justify-content: right;
    }
    :deep(.el-select) {
      width: 100%;
    }
  }
</style>
