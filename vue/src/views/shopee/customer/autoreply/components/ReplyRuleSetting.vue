<template>
  <div class="rule_wrapper">
    <el-dialog
      v-model="dislogVisible"
      title="自动回复规则配置"
      width="800"
      :close-on-click-modal="false"
    >
      <div class="contain">
        <el-menu default-active="0">
          <el-menu-item index="0" @click="handleClick(0)">
            <el-icon><icon-menu /></el-icon>
            <template #title>全部回复类型</template>
          </el-menu-item>
          <el-menu-item index="1" @click="handleClick(1)">
            <template #title>延长发货回复</template>
          </el-menu-item>
          <el-menu-item index="2" @click="handleClick(2)">
            <template #title>换货回复</template>
          </el-menu-item>
          <el-menu-item index="3" @click="handleClick(3)">
            <template #title>差评回复</template>
          </el-menu-item>
        </el-menu>
        <div v-if="autoReplyType" class="right_content">
          <el-form
            ref="formRef"
            :rules="formRule"
            :model="formData"
            size="default"
            :label-width="150"
          >
            <el-form-item prop="replyDateType" label="回复日期">
              <el-select v-model="formData.replyDateType">
                <el-option label="按星期" :value="1"></el-option>
                <el-option label="按日期" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="formData.replyDateType === 1"
              prop="replyWeekday"
              label="回复具体星期"
            >
              <MultiSelect
                v-model="formData.replyWeekday"
                :option-obj="{
                  optionList: replyWeekdayList,
                  label: 'label',
                  value: 'value'
                }"
              />
            </el-form-item>
            <el-form-item
              v-if="formData.replyDateType === 2"
              prop="replyMonthday"
              label="回复具体日期"
            >
              <MultiSelect
                v-model="formData.replyMonthday"
                :option-obj="{
                  optionList: dateArr,
                  label: 'label',
                  value: 'value'
                }"
              />
            </el-form-item>
            <el-form-item prop="" label="回复开始时间">
              <el-form-item prop="replyHour" class="item_left">
                <MultiSelect
                  v-model="formData.replyHour"
                  :option-obj="{
                    optionList: hourArr,
                    label: 'label',
                    value: 'value'
                  }"
                />
              </el-form-item>
              <el-form-item prop="replyMinute" class="item_right">
                <MultiSelect
                  v-model="formData.replyMinute"
                  :option-obj="{
                    optionList: minutesArr,
                    label: 'label',
                    value: 'value'
                  }"
                />
              </el-form-item>
            </el-form-item>
            <el-form-item prop="replyTimeSpace" label="回复时间间隔">
              <ZInputNumber
                v-model="formData.replyTimeSpace"
                :min="1"
                :precision="0"
                style="flex: 1"
              />
              <span class="item_note">秒（1-10s之间，消息回复间隔）</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span>
          <el-button type="primary" @click="handleSave(formRef)"
            >保存</el-button
          >
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, reactive, ref } from 'vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { autoReplyExecuteRuleApi } from '@/api/shopee/autoreply';

  const props = defineProps({
    // 是否显示弹窗
    modelValue: {
      type: Boolean,
      default: false
    }
  });
  const emits = defineEmits(['update:modelValue']);
  const dislogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const autoReplyType = ref(0);
  const handleClick = async (autoType) => {
    autoReplyType.value = autoType;
    if (autoType) {
      const { data } = await autoReplyExecuteRuleApi(autoType);
      formData.value = { ...data };
      if (data.replyDate) {
        formData.value.replyDate = data.replyDate.split(',').map(Number);
      }
      if (data.replyStartTime) {
        formData.value.replyHour = data.replyStartTime.split(',')[0];
        formData.value.replyMinute = data.replyStartTime.split(',')[1];
      }
    }
  };

  const validateRreplyWeekday = (rule, value, callback) => {
    const { replyDateType } = formData.value;
    if (replyDateType === 1 && !value.length) {
      callback(new Error('请选择回复具体星期'));
    } else {
      callback();
    }
  };
  const validateReplyMonthday = (rule, value, callback) => {
    const { replyDateType } = formData.value;
    if (replyDateType === 2 && !value.length) {
      callback(new Error('请选择回复具体星期'));
    } else {
      callback();
    }
  };

  const formRef = ref(null);
  const formRule = reactive({
    replyDateType: [
      {
        required: true,
        message: '请选择回复日期',
        trigger: 'change'
      }
    ],
    replyWeekday: [
      {
        required: true,
        message: '请选择回复具体星期',
        validator: validateRreplyWeekday,
        trigger: 'change'
      }
    ],
    replyMonthday: [
      {
        required: true,
        validator: validateReplyMonthday,
        message: '请选择回复具体日期',
        trigger: 'change'
      }
    ],
    replyHour: [
      {
        required: true,
        message: '请选择开始时间的小时',
        trigger: 'change'
      }
    ],
    replyMinute: [
      {
        required: true,
        message: '请选择开始时间的分钟',
        trigger: 'change'
      }
    ],
    replyTimeSpace: [
      {
        required: true,
        message: '请输入回复时间间隔',
        trigger: 'blur'
      }
    ]
  });
  const formData = ref({});

  const replyWeekdayList = [
    { label: '星期一', value: 2 },
    { label: '星期二', value: 3 },
    { label: '星期三', value: 4 },
    { label: '星期四', value: 5 },
    { label: '星期五', value: 6 },
    { label: '星期六', value: 7 },
    { label: '星期日', value: 1 }
  ];
  const dateArr = new Array(28)
    .fill('')
    .map((_, index) => ({ value: index + 1, label: index + 1 }));
  const hourArr = new Array(24).fill('').map((_, index) => ({
    value: index,
    label: ('00' + index).slice(-2) + '时'
  }));
  const minutesArr = new Array(60).fill('').map((_, index) => ({
    value: index,
    label: ('00' + index).slice(-2) + '分'
  }));

  const handleSave = () => {};
  const handleClose = () => {
    dislogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  :deep(.el-menu-vertical-demo:not(.el-menu--collapse)) {
    width: 200px;
    min-height: 400px;
  }
  .contain {
    display: flex;
  }
  .right_content {
    flex: 1;
  }
  .item_note {
    flex: none;
    margin-left: 10px;
  }
  .item_left {
    :deep(.el-input__wrapper).el-input__wrapper {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      box-shadow: 1px 0 0 0 var(--el-input-border-color) inset,
        0 1px 0 0 var(--el-input-border-color) inset,
        0 -1px 0 0 var(--el-input-border-color) inset;
    }
  }
  .item_right {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    :deep(.el-input__wrapper) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
</style>
