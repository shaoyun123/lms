<template>
  <div class="app-container">
    <el-card>
      <el-form
        ref="modifyPwdFormRef"
        :label-position="labelPosition"
        label-width="100px"
        :model="modifyPwdForm"
        :rules="rules"
        style="max-width: 460px"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="modifyPwdForm.oldPassword"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="modifyPwdForm.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="repassword">
          <el-input
            v-model="modifyPwdForm.repassword"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item class="modifyPwdForm-btn">
          <el-button
            type="primary"
            @click="submitmodifyPwdForm(modifyPwdFormRef)"
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
  import { modifyPwdApi } from '@/api/user';
  import { ElMessage } from 'element-plus';
  const { logout } = useUserStore();
  const labelPosition = ref('right');
  const modifyPwdFormRef = ref(null);

  const modifyPwdForm = reactive({
    oldPassword: '',
    password: '',
    repassword: ''
  });
  //检验确认密码
  const checkrepassword = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入新密码'));
    } else if (value !== modifyPwdForm.password) {
      callback(new Error('两次输入密码不一致!'));
    } else {
      callback();
    }
  };
  //el-form表单验证规则
  const rules = {
    oldPassword: [
      { required: true, message: '请输入当前密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    repassword: [
      { required: true, message: '请再次新输入密码', trigger: 'blur' },
      { validator: checkrepassword, trigger: 'blur' }
    ]
  };
  //表单提交
  const submitmodifyPwdForm = async (formRef) => {
    formRef.validate((valid) => {
      if (valid) {
        //检验通过,提交表单并调用退出接口
        modifyPwdApi(modifyPwdForm).then((res) => {
          if (res.code === '0000') {
            ElMessage.success(res.msg || '修改成功');
            logout();
          } else {
            ElMessage.error(res.msg);
          }
        });
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  };
</script>

<style lang="scss" scoped>
  .modifyPwdForm-btn {
    :deep(.el-form-item__content) {
      justify-content: right;
    }
  }
</style>
