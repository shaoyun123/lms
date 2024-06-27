<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="新增机器人管理"
      :width="800"
      :close-on-click-modal="false"
      :align-center="true"
    >
      <el-form
        ref="formRef"
        :model="formData"
        size="default"
        :rules="rules"
        :label-width="200"
      >
        <el-form-item label="使用场景" prop="scene">
          <el-select v-model="formData.scene">
            <el-option
              v-for="item in sceneList"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="机器人ID" prop="robotCode">
          <el-select v-model="formData.robotCode">
            <el-option
              v-for="item in robotCodeList"
              :key="item.robotCode"
              :value="item.robotCode"
              :label="item.robotCode"
            >
              <span>{{ item.robotCode }}</span>
              <span class="ml10">{{ item.robotName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.scene === '群聊模式'"
          label="群聊chatId"
          prop="chatId"
        >
          <el-input v-model="formData.chatId" />
        </el-form-item>
        <el-form-item label="调用类型名称" prop="businessTypeName">
          <el-input v-model="formData.businessTypeName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="SendMessageBusinessType" prop="businessType">
          <el-select v-model="formData.businessType">
            <el-option
              v-for="item in msgList"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请填写此条钉钉通知的所属模块；收件人；执行周期；时间；"
            :rows="2"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div class="disflex line-height">
        <div class="w100">提示</div>
        <div>
          <div>1、机器人ID当前仅支持使用已有ID。</div>
          <div v-if="formData.scene === '群聊模式'" class="mt05">
            2、群聊chatId获取方式：点击链接<el-link
              type="primary"
              target="_blank"
              href="https://open-dev.dingtalk.com/apiExplorer?spm=ding_open_doc.document.0.0.afb839b7W85NCP#/jsapi?api=biz.chat.chooseConversationByCorpId"
              :underline="false"
              >https://open-dev.dingtalk.com/apiExplorer?spm=ding_open_doc.document.0.0.afb839b7W85NCP#/jsapi?api=biz.chat.chooseConversationByCorpId</el-link
            >，界面修改corpId为{{
              corpId
            }}，发起调用并按照提示操作，即可获取对应群聊chatId。
          </div>
        </div>
      </div>
      <template #footer>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave(formRef)"
        >
          保存</el-button
        >
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watch, computed, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    addNewApi,
    getRobotListApi,
    sendMsgTypeApi
  } from '@/api/configure/ddrobot';
  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    }
  });

  //亿品和梦旋的corpId不同
  const corpId = computed(() => {
    if (window.location.hostname.includes('mx')) {
      return 'ding1e9075c71179503435c2f4657eb6378f';
    }
    return 'ding8b47af10568dfe9035c2f4657eb6378f';
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const sceneList = ref(['群聊模式', '单聊模式']);
  const robotCodeList = ref([]);
  const msgList = ref([]);
  const formData = ref({ scene: '群聊模式' });
  const formRef = ref();

  const rules = reactive({
    scene: [{ required: true, trigger: 'change', message: '请选择使用场景' }],
    robotCode: [
      { required: true, trigger: 'change', message: '请选择机器人ID' }
    ],
    chatId: [{ required: true, trigger: 'blur', message: '请输入chatId' }],
    businessTypeName: [
      { required: true, trigger: 'blur', message: '请输入调用类型名称' }
    ],
    businessType: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入SendMessageBusinessType'
      }
    ]
  });
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        Promise.all([getRobotListApi(), sendMsgTypeApi()])
          .then((res) => {
            robotCodeList.value = res[0].data;
            msgList.value = res[1].data;
          })
          .catch((err) => {
            console.log('err :>> ', err);
          });
      } else {
        formRef.value.resetFields();
      }
    }
  );

  // 保存
  const saveLoading = ref(false);
  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          saveLoading.value = true;
          const { msg } = await addNewApi({ ...formData.value });
          ElMessage.success(msg || '操作成功');
          dialogVisible.value = false;
          emits('handleSearch');
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          saveLoading.value = false;
        }
      }
    });
  };
</script>

<style lang="scss" scoped>
  .disflex {
    display: flex;
  }
  .w100 {
    width: 100px;
  }
  .line-height {
    line-height: 20px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .ml05 {
    margin-top: 05px;
  }
  .avatar-uploader :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader :deep(.el-upload:hover) {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
  }
</style>
