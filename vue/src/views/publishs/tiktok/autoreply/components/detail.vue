<template>
  <div>
    <el-dialog
      v-model="showExport"
      :title="title"
      :width="800"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        v-loading="dialogLoading"
        :rules="formRule"
        :model="formData"
        :label-width="120"
        size="default"
      >
        <el-form-item label="自动回复名称" prop="autoReplyName">
          <el-input
            v-model="formData.autoReplyName"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="触发方式" prop="triggerType">
          <el-select
            v-model="formData.triggerType"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option
              v-for="val in initData.triggerTypeEnum"
              :key="val"
              :label="val"
              :value="val"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" prop="salesSite">
          <el-select
            v-model="formData.salesSite"
            placeholder="请选择"
            :disabled="!!formData.id"
            filterable
            clearable
          >
            <el-option
              v-for="val in initData.sites"
              :key="val.code"
              :value="val.code"
              :label="val.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="COD订单" prop="orderType">
          <el-radio-group v-model="formData.orderType">
            <el-radio value="COD订单">是</el-radio>
            <el-radio value="非COD订单">否</el-radio>
            <el-radio value="全部订单">全部订单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="平台订单状态" prop="platOrderStatusStr">
          <MultiSelect
            v-model="formData.platOrderStatusStr"
            placeholder="请选择"
            :option-obj="{
              optionList: initData.orderStatusEnum
            }"
          />
        </el-form-item>
        <el-form-item label="订单物流跟踪状态" prop="platLogisticsStatusStr">
          <MultiSelect
            v-model="formData.platLogisticsStatusStr"
            placeholder="请选择"
            :option-obj="{
              optionList: initData.logisticsTrackingStatus
            }"
          />
        </el-form-item>
        <!-- <el-form-item label="平台物流状态" prop="platLogisticsStatusStr">
          <MultiSelect
            v-model="formData.platLogisticsStatusStr"
            placeholder="请选择"
            :option-obj="{
              optionList: initData.logisticStatusEnum
            }"
          />
        </el-form-item> -->
        <el-form-item label="订单金额≥">
          <el-form-item prop="orderPriceType" class="form_item_left">
            <el-select v-model="formData.orderPriceType">
              <el-option label="人民币" value="orderPriceCny"></el-option>
              <el-option label="当地币种" value="orderPriceLocal"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="orderPrice" class="form_item_right">
            <ZInputNumber
              v-model="formData.orderPrice"
              :step="1"
              :min="0"
              :precision="10"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="下单时间≤" prop="placeOrderDays">
          <!-- <template #label>
            <el-form-item prop="timeType" class="form_item_left">
              <el-select v-model="formData.timeType">
                <el-option label="下单时间≤" value="placeOrderDays"></el-option>
               <el-option
                  label="订单状态变更时间≤"
                  value="orderStatusChangeDays"
                ></el-option>  <el-option
                  label="物流状态变更时间≤"
                  value="logisticsStatusChangeDays"
                ></el-option> 
              </el-select>
            </el-form-item>
          </template> -->
          <!-- <el-form-item class="form_item_right" prop="placeOrderDays"> -->
          <ZInputNumber
            v-model="formData.placeOrderDays"
            :step="1"
            :precision="0"
            :min="1"
            style="width: 80%"
          />
          <span class="ml20">天</span>
          <!-- </el-form-item> -->
        </el-form-item>
        <el-form-item label="是否发送订单卡" prop="sendOrderCard">
          <el-radio-group v-model="formData.sendOrderCard">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="话术" prop="verbalTrick">
          <div>
            （填站点对应语种，可用
            <span class="danger_color">[[ order_id]]</span>
            字符表示对应订单ID，发送时会替换）
          </div>
          <el-input
            v-model="formData.verbalTrick"
            type="textarea"
            :rows="3"
            placeholder="请填写站点对应语种"
          />
        </el-form-item>
        <el-form-item
          label="是否合并发送话术（同一买家多订单）"
          prop="mergeOrderAndSendVerbalTrice"
          label-width="260"
        >
          <el-radio-group v-model="formData.mergeOrderAndSendVerbalTrice">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="存在拆单时是否发送"
          prop="sendIfIsSplitOrder"
          label-width="260"
        >
          <el-radio-group v-model="formData.sendIfIsSplitOrder">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="存在未回复买家消息时是否发送"
          prop="sendIfNotResponse"
          label-width="240"
        >
          <el-radio-group v-model="formData.sendIfNotResponse">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button
            type="primary"
            :loading="dialogLoading"
            :disabled="dialogLoading"
            @click="handleSave(formRef)"
            >保存</el-button
          >
          <el-button v-if="!formData.id" @click="handleReset">重置</el-button>
          <el-button :disabled="dialogLoading" @click="showExport = false"
            >关闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import { cloneDeep } from 'lodash-es';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { addRuleApi, updateApi } from '@/api/publishs/tiktokautoreply';

  const props = defineProps({
    // 是否显示弹窗
    modelValue: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: () => ({})
    },
    initData: {
      type: Object,
      default: () => ({})
    }
  });
  //  默认选中每日上午定时扫描,默认选中全部订单,默认显示人民币,是否发送订单卡默认选中是,是否合并发送话术默认选中是,存在未回复买家消息时是否发送默认选中是
  const formData = ref({
    triggerType: '每日上午定时扫描',
    orderType: '全部订单',
    orderPriceType: 'orderPriceCny',
    sendOrderCard: true,
    mergeOrderAndSendVerbalTrice: true,
    sendIfIsSplitOrder: false,
    sendIfNotResponse: true
    // timeType: 'placeOrderDays'
  });
  const showExport = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const emits = defineEmits(['freshList', 'update:modelValue']);

  const formRule = reactive({
    autoReplyName: [
      { required: true, trigger: 'blur', message: '请输入自动回复名称' }
    ],
    triggerType: [
      { required: true, trigger: 'change', message: '请选择触发方式' }
    ],
    salesSite: [{ required: true, trigger: 'change', message: '请选择站点' }],
    orderType: [
      { required: true, trigger: 'change', message: '请选择COD订单' }
    ],
    platOrderStatusStr: [
      { required: true, trigger: 'change', message: '请选择平台订单状态' }
    ],
    // platLogisticsStatusStr: [
    //   { required: true, trigger: 'change', message: '请选择平台物流状态' }
    // ],
    sendOrderCard: [
      { required: true, trigger: 'change', message: '请选择是否发送订单卡' }
    ],
    verbalTrick: [{ required: true, trigger: 'blur', message: '请输入话术' }],
    mergeOrderAndSendVerbalTrice: [
      { required: true, trigger: 'change', message: '请选择是否合并发送话术' }
    ],
    sendIfIsSplitOrder: [
      { required: true, trigger: 'change', message: '请选择存在拆单时是否发送' }
    ],
    sendIfNotResponse: [
      {
        required: true,
        trigger: 'change',
        message: '请选择存在未回复买家消息时是否发送'
      }
    ]
  });

  const title = ref('新增自动回复');
  onMounted(() => {
    // 表示修改
    if (props.detailData.id) {
      title.value = '修改自动回复';
      formData.value = cloneDeep(props.detailData);
      //
      if (formData.value.platOrderStatusStr) {
        formData.value.platOrderStatusStr =
          formData.value.platOrderStatusStr.split(',');
      } else {
        formData.value.platOrderStatusStr = [];
      }
      if (formData.value.platLogisticsStatusStr) {
        formData.value.platLogisticsStatusStr =
          formData.value.platLogisticsStatusStr.split(',');
      } else {
        formData.value.platLogisticsStatusStr = [];
      }
      // if (formData.value.platLogisticsStatusStr) {
      //   formData.value.platLogisticsStatusStr =
      //     formData.value.platLogisticsStatusStr.split(',');
      // } else {
      //   formData.value.platLogisticsStatusStr = [];
      // }
      //订单金额(人民币) 订单金额（当地币种）
      if (formData.value.orderPriceLocal) {
        formData.value.orderPriceType = 'orderPriceLocal';
        formData.value.orderPrice = formData.value.orderPriceLocal;
      } else {
        formData.value.orderPriceType = 'orderPriceCny';
        formData.value.orderPrice = formData.value.orderPriceCny;
      }
      // 下单时间截止天数 订单状态变更截止天数 物流状态变更截止天数
      // if (formData.value.logisticsStatusChangeDays) {
      //   formData.value.timeType = 'logisticsStatusChangeDays';
      //   formData.value.timeTypeVal = formData.value.placeOrderDays;
      // } else if (formData.value.orderStatusChangeDays) {
      //   formData.value.timeType = 'orderStatusChangeDays';
      //   formData.value.timeTypeVal = formData.value.orderStatusChangeDays;
      // } else {
      //   formData.value.timeType = 'placeOrderDays';
      //   formData.value.timeTypeVal = formData.value.placeOrderDays;
      // }
    }
  });

  // 保存
  const dialogLoading = ref(false);
  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        let params = {
          ...formData.value,
          platOrderStatusStr: formData.value.platOrderStatusStr.join(),
          platLogisticsStatusStr: (
            formData.value.platLogisticsStatusStr || []
          ).join(),
          // platLogisticsStatusStr: formData.value.platLogisticsStatusStr.join(),
          [formData.value.orderPriceType]: formData.value.orderPrice
          // [formData.value.timeType]: formData.value.timeTypeVal
        };
        if (params.orderPriceType === 'orderPriceLocal') {
          params.orderPriceCny = null;
        } else {
          params.orderPriceLocal = null;
        }
        // if (params.timeType === 'placeOrderDays') {
        //   params.orderStatusChangeDays = null;
        //   params.logisticsStatusChangeDays = null;
        // } else if (params.timeType === 'orderStatusChangeDays') {
        //   params.placeOrderDays = null;
        //   params.logisticsStatusChangeDays = null;
        // } else {
        //   params.placeOrderDays = null;
        //   params.orderStatusChangeDays = null;
        // }
        dialogLoading.value = true;
        let res = null;
        try {
          if (props.detailData.id) {
            res = await updateApi(params);
          } else {
            res = await addRuleApi(params);
          }
          ElMessage.success(res.msg);
          emits('freshList');
          showExport.value = false;
          dialogLoading.value = false;
        } catch (err) {
          dialogLoading.value = false;
        }
      }
    });
  };
  // 清空
  const formRef = ref();
  const handleReset = () => {
    formRef.value.resetFields();
  };
</script>
<style lang="scss" scoped>
  :deep(.el-overlay-dialog) {
    overflow-y: hidden;
    height: calc(100% - 50px);
  }
  :deep(.el-dialog) {
    height: calc(100% - 50px);
  }
  :deep(.el-dialog__body) {
    overflow-y: scroll;
    height: calc(100% - 168px);
  }
  :deep(.el-select) {
    width: 100%;
  }
  :deep(.el-date-editor--time) {
    width: 100%;
  }
  .danger_color {
    color: var(--danger-color);
  }
  .form_item_label {
    :deep(.el-form-item__label) {
      padding-right: 0px;
    }
  }
  .form_item_left {
    :deep(.el-input__wrapper) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      box-shadow: 1px 0 0 0 var(--el-input-border-color) inset,
        0 1px 0 0 var(--el-input-border-color) inset,
        0 -1px 0 0 var(--el-input-border-color) inset;
    }
  }
  .form_item_right {
    flex: 1;
    :deep(.el-input__wrapper) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .ml20 {
    margin-left: 20px;
  }
</style>
