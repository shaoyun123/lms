<template>
  <div class="">
    <el-dialog
      v-model="dialogVisible"
      title="修改"
      width="800px"
      align-center
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item :width="110">
          <template #label>
            <div class="cell-item">
              <el-icon class="mr05">
                <user />
              </el-icon>
              钉钉用户名
            </div>
          </template>
          {{ accountInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon class="mr05">
                <svg
                  t="1684830423286"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4103"
                  width="128"
                  height="128"
                >
                  <path
                    d="M186.4 478.4c-44-0.8-80 33.6-81.6 77.6v128H63.2C30.4 683.2 3.2 708.8 2.4 742.4v170.4c0.8 32.8 28 58.4 60.8 57.6h165.6c32.8 0.8 60-24.8 60.8-58.4V742.4c-0.8-32.8-28-59.2-60.8-58.4h-54.4V545.6h302.4v139.2h-48c-32.8-0.8-60 24.8-61.6 58.4v170.4c0.8 32.8 28 58.4 61.6 57.6h166.4c32.8 0.8 60-24.8 60.8-58.4V742.4c-0.8-32.8-28-59.2-60.8-58.4h-48V545.6h302.4v139.2h-54.4c-32.8-0.8-60 24.8-60.8 58.4v170.4c0.8 32.8 28 58.4 60.8 57.6h166.4c32.8 0.8 60-24.8 60.8-58.4V742.4c-0.8-32.8-28-59.2-61.6-58.4h-41.6v-128c-0.8-44-37.6-78.4-81.6-77.6H186.4z m20.8 272.8c7.2 0 12.8 5.6 12.8 12v128.8c0 7.2-5.6 12-12.8 12H84.8c-7.2 0-12.8-5.6-12.8-12V763.2c0-7.2 5.6-12 12.8-12h122.4z m366.4 0c7.2 0 12.8 5.6 12.8 12v128.8c0 7.2-5.6 12-12.8 12H450.4c-7.2 0-12.8-5.6-12.8-12V763.2c0-7.2 5.6-12 12.8-12h123.2z m378.4 140.8c0 7.2-5.6 12-12.8 12h-122.4c-7.2 0-12.8-5.6-12.8-12V763.2c0-7.2 5.6-12 12.8-12h122.4c7.2 0 12.8 5.6 12.8 12v128.8zM671.2 251.2c-4.8-6.4-4.8-15.2 0-21.6l37.6-45.6-4-10.4-4.8-10.4c-3.2-8-6.4-15.2-9.6-20-4.8-10.4-11.2-20-19.2-28l-7.2-7.2-57.6 8c-8.8 0.8-16.8-4.8-20-12.8L568 50.4l-11.2-1.6c-28.8-6.4-57.6-6.4-86.4 0l-9.6 1.6-20 54.4c-3.2 7.2-10.4 11.2-18.4 11.2h-1.6l-56.8-9.6-8 8c-15.2 18.4-27.2 39.2-35.2 61.6l-4 9.6 37.6 45.6c4.8 5.6 4.8 14.4 0 20.8L315.2 296l4 9.6c3.2 12.8 8.8 24.8 15.2 35.2 4.8 9.6 11.2 18.4 18.4 26.4l7.2 7.2 59.2-9.6c8-0.8 15.2 3.2 18.4 11.2l19.2 54.4 11.2 1.6c28.8 6.4 59.2 6.4 88 0l9.6-2.4 20-56c3.2-7.2 10.4-12 18.4-11.2l57.6 9.6 8-7.2c15.2-17.6 26.4-37.6 34.4-60l4-9.6-36.8-44z m-157.6 71.2c-45.6 0-82.4-36.8-82.4-82.4 0-45.6 36.8-82.4 82.4-82.4 45.6 0 82.4 36.8 82.4 82.4 0 45.6-36.8 81.6-82.4 82.4z"
                    p-id="4104"
                  ></path>
                </svg>
              </el-icon>
              钉钉所属部门
            </div> </template
          >{{ accountInfo.deptName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon class="mr05">
                <svg
                  t="1684830456122"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4927"
                  width="128"
                  height="128"
                >
                  <path
                    d="M629.824 256H394.176a32 32 0 0 1-31.232-25.152l-42.176-192A32 32 0 0 1 352 0h320a32.128 32.128 0 0 1 31.296 38.912l-42.176 192A32.192 32.192 0 0 1 629.824 256z m-209.92-64h184.128l28.096-128H391.808l28.096 128zM512 1024a32.192 32.192 0 0 1-23.616-10.368l-224-244.416a32.128 32.128 0 0 1-7.68-28.352l85.568-395.584A32 32 0 0 1 373.568 320h276.864a32 32 0 0 1 31.232 25.28l85.568 395.584a31.808 31.808 0 0 1-7.68 28.352l-224 244.416A31.936 31.936 0 0 1 512 1024z m-189.248-285.888L512 944.64l189.248-206.528L624.64 384H399.36l-76.608 354.112z"
                    p-id="4928"
                  ></path>
                </svg>
              </el-icon>
              职位
            </div>
          </template>
          {{ accountInfo.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon class="mr05">
                <iphone />
              </el-icon>
              手机号
            </div>
          </template>
          {{ accountInfo.mobile }}
        </el-descriptions-item>
      </el-descriptions>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRule"
        :label-width="100"
        class="mt10"
      >
        <el-form-item label="关联OA部门" prop="orgId">
          <el-tree-select
            v-model="formData.orgId"
            :data="initList.orgList"
            :render-after-expand="false"
            filterable
            clearable
            show-checkbox
            :props="orgProps"
          />
        </el-form-item>
        <el-form-item label="关联OA用户名" prop="sysUserId">
          <el-select v-model="formData.sysUserId" filterable>
            <el-option
              v-for="item in initList.sysUserList"
              :key="item.id"
              :label="item.loginName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button
          type="primary"
          :loading="updateLoading"
          @click="handleUpdate(formRef)"
          >修改</el-button
        >
        <el-button @click="dialogVisible = false"> 关闭 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, reactive, ref, watch } from 'vue';
  import { Iphone, User } from '@element-plus/icons-vue';
  import { queryOrgTreeApi, queryUserApi } from '@/api/configure/common';
  import { updateApi } from '@/api/configure/ddaccount';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    accountInfo: {
      type: Object,
      default: () => ({})
    }
  });
  const emits = defineEmits(['update:modelValue', 'handleSearch']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const initList = reactive({});
  const formRef = ref();
  const formRule = ref({
    sysUserId: [
      { required: true, trigger: 'change', message: '请选择关联OA用户名' }
    ]
  });
  const formData = ref({});
  const needFresh = ref(false);
  const resetSysUserId = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        try {
          const { data } = await queryOrgTreeApi();
          initList.orgList = data;
          resetSysUserId.value = false;
          formData.value.orgId = props.accountInfo.orgId?.toString();
          formData.value.sysUserId = props.accountInfo.sysUserId;
        } catch (err) {
          console.log('err :>> ', err);
        }
      } else if (needFresh.value) {
        emits('handleSearch');
      }
    }
  );
  watch(
    () => formData.value.orgId,
    async (val) => {
      try {
        if (resetSysUserId.value) {
          formData.value.sysUserId = null;
        }
        const { data } = await queryUserApi({
          page: 1,
          limit: 300,
          orgId: val
        });
        initList.sysUserList = data;
        resetSysUserId.value = true;
      } catch (err) {
        console.log('err :>> ', err);
      }
    }
  );

  const orgProps = {
    label: 'title',
    value: 'value',
    children: 'data'
  };

  const updateLoading = ref(false);
  const handleUpdate = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        try {
          const sysUserName = initList.sysUserList.filter(
            (item) => item.id === formData.value.sysUserId
          )[0].loginName;
          const { msg } = await updateApi({
            ...props.accountInfo,
            ...formData.value,
            sysUserName
          });
          ElMessage.success(msg || '操作成功');
          needFresh.value = true;
          dialogVisible.value = false;
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          updateLoading.value = false;
        }
      }
    });
  };
</script>

<style lang="scss" scoped>
  .mr05 {
    margin-right: 5px;
  }
  .mt10 {
    margin-top: 10px;
  }
</style>
