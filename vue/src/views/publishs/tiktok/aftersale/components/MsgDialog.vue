<template>
  <div class="msg_wrapper">
    <el-dialog
      v-model="dialogVisible"
      title="发送消息"
      width="900"
      :close-on-click-modal="false"
    >
      <div class="msg_header">
        <div>
          <strong
            ><span class="msg_requier_tag">*</span>消息类型: 文本消息</strong
          >
        </div>
        <div>
          <el-select
            v-model="tplInfo.languageCode"
            filterable
            clearable
            placeholder="语言"
            class="w150"
            @change="handleGetTplNameList"
          >
            <el-option
              v-for="item in languageList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>

          <el-select
            v-model="tplInfo.templateTypeName"
            class="w150"
            filterable
            clearable
            placeholder="模板类型"
            @change="handleGetTplNameList"
          >
            <el-option
              v-for="item in tplTypeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>

          <el-select
            v-model="tplId"
            class="w150"
            filterable
            clearable
            placeholder="模板名称"
          >
            <el-option
              v-for="item in tplNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <div class="msg-body">
        <template v-for="(item, index) in messageList" :key="item.id">
          <el-row :gutter="10" align="middle">
            <el-col :span="2" class="common_ta_right">
              <span
                ><span class="msg_requier_tag">*</span>消息{{ index + 1 }}</span
              >
            </el-col>
            <el-col :span="20">
              <el-input
                v-model="item.value"
                class="w-50 m-2"
                size="default"
                placeholder="请输入"
              />
            </el-col>
            <el-col :span="2" class="common_ta_right">
              <el-button type="danger" @click="handleDel(index)"
                >删除</el-button
              >
            </el-col>
          </el-row>
        </template>
      </div>
      <template #footer>
        <span>
          <el-button type="primary" @click="handleSend"> 发送 </el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, reactive } from 'vue';
  import { batchSendMessage, getLanguageBySiteApi } from '@/api/tiktok/chat';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import {
    getTplTypeListApi,
    getTplNameListApi,
    getTplContentApi
  } from '@/api/common/chat';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const messageList = ref([{ value: '', id: 1 }]);

  onMounted(() => {
    initTplInfo();
  });

  // #region 语言模板
  const tplInfo = reactive({
    platCode: 'tiktok'
  });
  const languageList = ref([]);
  const initTplInfo = async () => {
    Promise.all([
      getLanguageBySiteApi({
        salesSite: ''
      }),
      getTplTypeListApi('tiktok')
    ]).then((res) => {
      languageList.value = res[0].data;
      tplInfo.languageCode = res[0].data[0];
      tplTypeList.value = res[1].data;
    });
  };
  // 获取模板类型
  const tplTypeList = ref([]);
  const handleGetTplNameList = async () => {
    tplNameList.value = null;
    tplId.value = null;
    if (tplInfo.languageCode && tplInfo.templateTypeName) {
      const { data } = await getTplNameListApi({ ...tplInfo });
      tplNameList.value = data;
    }
  };
  const tplNameList = ref([]);
  const tplId = ref();
  // #endregion 语言模板

  // 若当前存在空白消息，选择模板后，将对应内容填充至空白消息内；若当前无空白消息，则选择模板后，新增一条带有模板内容的消息
  const handleAdd = async () => {
    let msgContent = '';
    if (tplId.value) {
      const { data } = await getTplContentApi(tplId.value);
      msgContent = data.emailContent;
    }
    if (messageList.value.length) {
      // 取最后一项
      const lastObj = messageList.value[messageList.value.length - 1];
      const EmptyIndex = messageList.value.findIndex((v) => !v.value);
      if (tplId.value && EmptyIndex !== -1) {
        messageList.value[EmptyIndex].value = msgContent;
      } else {
        messageList.value.push({ value: msgContent, id: lastObj.id + 1 });
      }
    } else {
      messageList.value.push({ value: msgContent, id: 1 });
    }
  };
  const handleDel = (index) => {
    if (messageList.value.length === 1)
      return ElMessage.warning('至少一条消息');
    messageList.value.splice(index, 1);
  };
  const handleSend = async () => {
    const _messageList = messageList.value
      .map((item) => item.value)
      .filter((item) => !!item);
    if (_messageList.length !== messageList.value.length)
      return ElMessage.warning('请填写信息');
    const params = {
      messageList: _messageList,
      orderInfoList: props.rowCheckedList.map((item) => ({
        storeAcctId: item.storeAcctId,
        orderSn: item.orderId,
        buyerUserId: item.buyerUserId,
        platCode: item.platCode
      }))
    };
    // eslint-disable-next-line
    const { data, msg, code } = await batchSendMessage(params);
    if (code === '0000') {
      ElMessage.success(msg);
    } else {
      ElMessageBox.alert(msg || '请求失败', '错误信息', {
        confirmButtonText: '确认',
        type: 'error',
        dangerouslyUseHTMLString: true
      });
    }
    const failList = data.filter((v) => !v.success);
    const successList = data.filter((v) => v.success);
    if (failList.length) {
      const failListStr = failList.map((v) => v.orderSn).join(',');
      const successListStr = successList.map((v) => v.orderSn).join(',');
      const failListReasonStr = failList
        .map((v) => v.orderSn + '：' + v.msg)
        .join('；');
      let str = '订单发送失败：' + failListStr + '</br>';
      if (successListStr) {
        str = str + '订单发送成功：' + successListStr + '</br>';
      }
      str = str + '平台消息发送失败明细：' + failListReasonStr;
      ElMessageBox.alert(
        `<div style="max-height: 500px;overflow-y: auto;">${str}</div>`,
        '消息发送结果',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确认',
          type: 'error'
        }
      ).then(() => {
        dialogVisible.value = false;
      });
    } else {
      ElMessage.success('发送成功');
      dialogVisible.value = false;
    }
  };
</script>

<style lang="scss" scoped>
  .msg_wrapper {
    .msg_requier_tag {
      color: #f56c6c;
    }
    :deep(.el-row + .el-row) {
      margin-top: 10px;
    }
    .msg_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .msg-body {
      max-height: 500px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .w150 {
      width: 150px;
    }
  }
</style>
