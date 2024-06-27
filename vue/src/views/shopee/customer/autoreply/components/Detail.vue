<template>
  <div class="detail_wrapper">
    <el-dialog
      v-model="showExport"
      :title="formData.id ? '修改' : '新增'"
      width="800"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        v-loading="dialogLoading"
        :rules="formRule"
        :model="formData"
        size="default"
        :label-width="150"
      >
        <el-form-item label="回复类型" prop="autoReplyType">
          <el-select
            v-model="formData.autoReplyType"
            placeholder="请选择"
            filterable
            clearable
            :disabled="!!formData.id"
            @change="handleChangeAutoType"
          >
            <el-option
              v-for="val in autoReplyTypeList"
              :key="val.code"
              :label="val.type"
              :value="val.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="站点" prop="salesSite">
          <el-select
            v-model="formData.salesSite"
            placeholder="请选择"
            filterable
            clearable
            :disabled="!!formData.id"
          >
            <el-option
              v-for="item in initFormData.sites"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.autoReplyType == 1"
          label="截止天数≤"
          prop="deadlineDays"
        >
          <ZInputNumber
            v-model="formData.deadlineDays"
            placeholder="请输入正整数"
            :min="1"
            :precision="0"
          />
        </el-form-item>
        <el-form-item
          v-if="[1, 2].includes(formData.autoReplyType)"
          label="仓库订单状态"
          prop="orderStatusList"
        >
          <MultiSelect
            v-model="formData.orderStatusList"
            :option-obj="{
              optionList:
                formData.autoReplyType == 1
                  ? initFormData.delayShipOrderStatusList
                  : initFormData.changeProductOrderStatusList,
              label: 'orderStatus',
              value: 'code'
            }"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.autoReplyType == 2"
          label="延迟天数"
          prop="delayDays"
        >
          <ZInputNumber
            v-model="formData.delayDays"
            placeholder="请输入正整数"
            :min="1"
            :precision="0"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.autoReplyType == 3"
          label="评论星星数"
          prop="ratingStar"
        >
          <el-select
            v-model="formData.ratingStar"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in [1, 2, 3, 4, 5]"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.autoReplyType == 3"
          label="评论内容是否为空"
          prop="emptyComment"
        >
          <el-select
            v-model="formData.emptyComment"
            placeholder="请选择"
            filterable
            clearable
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <template v-if="formData.autoReplyType === 6">
          <el-form-item label="订单金额≥">
            <el-form-item prop="currency">
              <el-select v-model="formData.currency">
                <el-option label="人民币&yen;" value="RMB"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="orderCnAmountGte">
              <ZInputNumber
                v-model="formData.orderCnAmountGte"
                :min="0"
                :precision="2"
              />
            </el-form-item>
          </el-form-item>
        </template>
        <template v-if="formData.autoReplyType === 7">
          <el-form-item label="OA订单状态" prop="orderProcessStatusList">
            <MultiSelect
              v-model="formData.orderProcessStatusList"
              :option-obj="{
                optionList: initFormData.orderProcessStatus,
                label: 'value',
                value: 'name'
              }"
            />
          </el-form-item>
        </template>
        <!-- COD订单发货确认 -->
        <template v-if="formData.autoReplyType === 9">
          <el-form-item label="平台订单状态" prop="platOrderStatus">
            <MultiSelect
              v-model="formData.platOrderStatus"
              :option-obj="{
                optionList: initFormData.platOrderStatus
              }"
            />
          </el-form-item>
          <el-form-item label="买家拒绝次数" prop="buyerRejectNumber">
            <MultiSelect
              v-model="formData.buyerRejectNumber"
              :option-obj="{
                optionList: buyerRejectNumberList,
                label: 'label',
                value: 'value'
              }"
            />
          </el-form-item>
        </template>
        <!-- COD签收提醒 -->
        <template v-if="formData.autoReplyType === 10">
          <el-form-item label="平台订单物流状态" prop="logisticsStatus">
            <MultiSelect
              v-model="formData.logisticsStatus"
              :option-obj="{
                optionList: initFormData.platLogisticsStatusList
              }"
            />
          </el-form-item>
          <el-form-item label="订单物流描述">
            <el-form-item prop="logisticsDescriptionRelation">
              <el-select v-model="formData.logisticsDescriptionRelation">
                <el-option label="包含" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="logisticsDescription">
              <el-input
                v-model="formData.logisticsDescription"
                clearable
                placeholder="多个词用英文逗号隔开，单词之间为或的关系"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="买家拒绝次数" prop="buyerRejectNumber">
            <MultiSelect
              v-model="formData.buyerRejectNumber"
              :option-obj="{
                optionList: buyerRejectNumberList,
                label: 'label',
                value: 'value'
              }"
            />
          </el-form-item>
        </template>
        <!-- 关税提醒 -->
        <template v-if="formData.autoReplyType === 11">
          <el-form-item label="平台订单物流状态" prop="logisticsStatus">
            <MultiSelect
              v-model="formData.logisticsStatus"
              :option-obj="{
                optionList: initFormData.platLogisticsStatusList
              }"
            />
          </el-form-item>
          <el-form-item label="订单物流描述">
            <el-form-item
              class="left_input w100"
              prop="logisticsDescriptionRelation"
            >
              <el-select v-model="formData.logisticsDescriptionRelation">
                <el-option label="包含" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="right_input" prop="logisticsDescription">
              <el-input
                v-model="formData.logisticsDescription"
                clearable
                placeholder="多个词用英文逗号隔开，单词之间为或的关系"
              />
            </el-form-item>
          </el-form-item>
        </template>
        <!-- 催付款 -->
        <template v-if="formData.autoReplyType === 12">
          <el-form-item label="平台订单状态" prop="platOrderStatus">
            <MultiSelect
              v-model="formData.platOrderStatus"
              disabled
              :option-obj="{
                optionList: initFormData.platOrderStatus
              }"
            />
          </el-form-item>
          <el-form-item prop="" label="距订单时间">
            <el-form-item prop="orderTimeCnGreaterThanOrEqualValue">
              <ZInputNumber
                v-model="formData.orderTimeCnGreaterThanOrEqualValue"
                :min="1"
                :precision="2"
              />
            </el-form-item>
            <span class="m10"> - </span>
            <el-form-item class="m10" prop="orderTimeCnLessThanValue">
              <ZInputNumber
                v-model="formData.orderTimeCnLessThanValue"
                :min="1"
                :precision="2"
              />
            </el-form-item>
            <el-form-item style="flex: 1" prop="orderTimeCnValueType">
              <el-select v-model="formData.orderTimeCnValueType" filterable>
                <el-option
                  v-for="item in initFormData.timeValueTypeEnum"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item
            prop="notCodVerbalTrick"
            label="非COD订单话术(填站点对应语种)"
            ><el-input
              v-model="formData.notCodVerbalTrick"
              type="textarea"
              placeholder="请填写站点对应语种"
              clearable
          /></el-form-item>
        </template>
        <el-form-item
          :label="
            formData.autoReplyType === 12
              ? '话术(填站点对应语种)'
              : 'COD订单话术(填站点对应语种)'
          "
          prop="verbalTrick"
        >
          <el-input
            v-model="formData.verbalTrick"
            type="textarea"
            placeholder="请填写站点对应语种"
          />
        </el-form-item>
        <template v-if="formData.autoReplyType === 12">
          <el-form-item prop="sameOrderSendNum" label="同一订单发送次数">
            <ZInputNumber
              v-model="formData.sameOrderSendNum"
              :min="1"
              :precision="0"
            />
          </el-form-item>
          <el-form-item label="多次发送间隔时间">
            <el-form-item class="left_input w300" prop="sendIntervalValue">
              <ZInputNumber
                v-model="formData.sendIntervalValue"
                :min="1"
                :precision="0"
              />
            </el-form-item>
            <el-form-item class="right_input" prop="sendIntervalValueType">
              <el-select v-model="formData.sendIntervalValueType" filterable>
                <el-option
                  v-for="item in initFormData.timeValueTypeEnum"
                  :key="item"
                  :label="item"
                  :value="item"
              /></el-select>
            </el-form-item>
          </el-form-item>
        </template>
        <template v-if="showVoucherSetting">
          <el-form-item label="店铺优惠券" prop="sendVoucher">
            <el-radio-group v-model="formData.sendVoucher">
              <el-radio :value="false" size="large">不发送</el-radio>
              <el-radio :value="true" size="large">发送</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="formData.sendVoucher">
            <el-form-item label="店铺优惠券起值天数">
              <el-form-item prop="voucherStartEndLeftDay">
                <ZInputNumber
                  v-model="formData.voucherStartEndLeftDay"
                  :precision="0"
                />
              </el-form-item>
              <span class="m10">-</span>
              <el-form-item prop="voucherStartEndRightDay"
                ><ZInputNumber
                  v-model="formData.voucherStartEndRightDay"
                  :precision="0"
              /></el-form-item>
            </el-form-item>
            <el-form-item label="结束时间距当前天数">
              <el-form-item prop="voucherEndLeftDay">
                <ZInputNumber
                  v-model="formData.voucherEndLeftDay"
                  :precision="0"
                />
              </el-form-item>
              <span class="m10">-</span>
              <el-form-item prop="voucherEndRightDay"
                ><ZInputNumber
                  v-model="formData.voucherEndRightDay"
                  :precision="0"
              /></el-form-item>
            </el-form-item>
            <el-form-item label="店铺优惠券剩余数量">
              <el-form-item prop="voucherRemainingQuantityLeft">
                <ZInputNumber
                  v-model="formData.voucherRemainingQuantityLeft"
                  :precision="0"
                />
              </el-form-item>
              <span class="m10">-</span>
              <el-form-item prop="voucherRemainingQuantityRight"
                ><ZInputNumber
                  v-model="formData.voucherRemainingQuantityRight"
                  :precision="0"
              /></el-form-item>
            </el-form-item>
            <el-form-item label="店铺优惠券类型" prop="voucherType">
              <MultiSelect
                v-model="formData.voucherType"
                :option-obj="{
                  optionList: voucherTypeList,
                  label: 'label',
                  value: 'value'
                }"
              />
            </el-form-item>
            <el-form-item label="展示类型" prop="voucherShowType">
              <el-select
                v-model="formData.voucherShowType"
                placeholder="请选择"
                filterable
                clearable
              >
                <el-option
                  v-for="val in voucherShowTypeList"
                  :key="val.code"
                  :label="val.label"
                  :value="val.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <template #footer>
        <span>
          <el-button
            type="primary"
            :disabled="dialogLoading"
            @click="handleSave(formRef)"
            >保存</el-button
          >
          <el-button v-if="!formData.id" @click="handleReset">清空</el-button>
          <el-button :disabled="dialogLoading" @click="handleClose"
            >关闭</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  // /* eslint-disable */
  import { ref, computed, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  // import { ElMessage, ElMessageBox } from 'element-plus';

  import { addRuleApi, updateRuleApi } from '@/api/shopee/autoreply';
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
    initFormData: {
      type: Object,
      default: () => ({})
    },
    autoReplyTypeList: {
      type: Object,
      default: () => ({})
    }
  });

  const formData = ref({});

  const showExport = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const needFresh = ref(false);

  //   获取仓库订单状态---获取平台订单状态
  onMounted(async () => {
    if (props.detailData?.id) {
      formData.value = { ...props.detailData };
      const {
        autoReplyType,
        buyerRejectNumber,
        voucherType,
        platOrderStatus,
        logisticsStatus
      } = props.detailData;
      if (props.detailData?.voucherType) {
        formData.value.voucherType = props.detailData.voucherType.split(',');
      }
      if ([1, 2].includes(autoReplyType)) {
        formData.value.orderStatusList = props.detailData.orderStatusListStr
          ? props.detailData.orderStatusListStr.split(',').map(Number)
          : [];
      }
      if (voucherType) {
        formData.value.voucherType = voucherType.split(',').map(Number);
      }
      //买家次数
      if (buyerRejectNumber) {
        formData.value.buyerRejectNumber = buyerRejectNumber
          .split(',')
          .map(Number);
      }
      // 平台订单状态
      if (platOrderStatus) {
        formData.value.platOrderStatus = platOrderStatus.split(',');
      }
      // 平台订单物流状态
      if (logisticsStatus) {
        formData.value.logisticsStatus = logisticsStatus.split(',');
      }
      // 订单物流描述
      if ([10, 11].includes(autoReplyType)) {
        formData.value.logisticsDescriptionRelation = 1;
      }
      // 校验规则
      formRule.value = { ...basicFormRule, ...otherFormRule[autoReplyType] };
    }
  });
  const emits = defineEmits(['update:modelValue', 'getCreatorList', 'search']);
  const handleClose = () => {
    if (needFresh.value) {
      emits('getCreatorList');
      emits('search');
    }
    showExport.value = false;
  };

  // 优惠券
  const voucherTypeList = [
    { label: '折扣金额', value: 1 },
    { label: '折扣百分比', value: 2 },
    { label: '金币返还', value: 3 }
  ];
  const voucherShowTypeList = [
    { label: '展示在所有页面', value: 1 },
    { label: '通过优惠码分享', value: 3 }
  ];
  const showVoucherSetting = ref(true);

  //COD订单发货确认
  const buyerRejectNumberList = [
    {
      label: '0次',
      value: 0
    },
    {
      label: '1次',
      value: 1
    },
    {
      label: '2次',
      value: 2
    },
    {
      label: '3次',
      value: 3
    },
    {
      label: '4次',
      value: 4
    },
    {
      label: '5次',
      value: 5
    },
    {
      label: '5次以上',
      value: 9999
    }
  ];
  // 保存
  const dialogLoading = ref(false);
  const getParams = () => {
    let obj = { ...formData.value };
    if (showVoucherSetting.value) {
      if (obj.voucherType?.length) {
        obj.voucherType = obj.voucherType.join();
      } else {
        obj.voucherType = null;
      }
    }
    if ([1, 2].includes(obj.autoReplyType)) {
      obj.orderStatusListStr = obj.orderStatusList.join();
      if (!obj.id) {
        obj.orderStatusList = obj.orderStatusList.join();
      }
    }
    if (!obj.id && obj.autoReplyType === 7) {
      obj.orderProcessStatusList = obj.orderProcessStatusList.join();
    }
    // 买家次数
    if (obj.buyerRejectNumber) {
      obj.buyerRejectNumber = obj.buyerRejectNumber.join();
    }
    // 平台订单状态
    if (obj.platOrderStatus) {
      obj.platOrderStatus = obj.platOrderStatus.join();
    }
    // 平台订单物流状态
    if (obj.logisticsStatus) {
      obj.logisticsStatus = obj.logisticsStatus.join();
    }
    if (!obj.sendVoucher) {
      obj.voucherStartEndLeftDay = null;
      obj.voucherStartEndRightDay = null;
      obj.voucherEndLeftDay = null;
      obj.voucherEndRightDay = null;
      obj.voucherRemainingQuantityLeft = null;
      obj.voucherRemainingQuantityRight = null;
      obj.voucherType = null;
      obj.voucherShowType = null;
    }

    return obj;
  };
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        dialogLoading.value = true;
        const params = getParams();
        try {
          if (!formData.value.id) {
            const { msg } = await addRuleApi(params);
            ElMessage.success(msg);
            needFresh.value = true;
            emits('getCreatorList');
          } else {
            const { msg } = await updateRuleApi(params);
            ElMessage.success(msg);
          }
          if (formData.value.id) {
            showExport.value = false;
            emits('search');
          }
          dialogLoading.value = false;
        } catch (err) {
          dialogLoading.value = false;
        }
      }
    });
  };
  // 清空
  const formRef = ref();
  const formRule = ref({});
  const basicFormRule = {
    autoReplyType: [
      {
        required: true,
        message: '请选择回复类型',
        trigger: 'change'
      }
    ],
    salesSite: [
      {
        required: true,
        message: '请选择站点',
        trigger: 'change'
      }
    ],
    verbalTrick: [
      {
        required: true,
        message: '请输入话术',
        trigger: 'blur'
      }
    ]
  };
  const otherFormRule = {
    // 延迟发货
    1: {
      deadlineDays: [
        {
          required: true,
          message: '请输入截止天数',
          trigger: 'blur'
        }
      ],
      orderStatusList: [
        {
          required: true,
          message: '请选择仓库订单状态',
          trigger: 'change'
        }
      ]
    },
    // 换货
    2: {
      delayDays: [
        {
          required: true,
          message: '请输入延迟天数',
          trigger: 'blur'
        }
      ],
      orderStatusList: [
        {
          required: true,
          message: '请选择仓库订单状态',
          trigger: 'change'
        }
      ]
    },
    3: {}, //差评
    5: {}, // 乐言自动回复
    6: {
      // 发货确认
      orderCnAmountGte: [
        {
          required: true,
          message: '请输入订单金额≥',
          trigger: 'blur'
        }
      ]
    },
    7: {
      // OA订单状态
      orderProcessStatusList: [
        {
          required: true,
          message: '请选择OA订单状态',
          trigger: 'change'
        }
      ]
    },
    8: {}, // OA订单状态

    9: {
      // COD订单发货确认
      platOrderStatus: [
        {
          required: true,
          message: '请选择平台订单状态',
          trigger: 'change'
        }
      ],
      buyerRejectNumber: [
        {
          required: true,
          message: '请选择买家拒绝次数',
          trigger: 'change'
        }
      ]
    },
    10: {
      // COD签收提醒
      logisticsStatus: [
        {
          required: true,
          message: '请选择买家拒绝次数',
          trigger: 'change'
        }
      ],
      logisticsDescription: [
        {
          required: true,
          message: '请输入订单物流描述',
          trigger: 'blur'
        }
      ],
      buyerRejectNumber: [
        {
          required: true,
          message: '请选择买家拒绝次数',
          trigger: 'change'
        }
      ]
    },
    11: {
      // 关税类型
      logisticsStatus: [
        {
          required: true,
          message: '请选择买家拒绝次数',
          trigger: 'change'
        }
      ],
      logisticsDescription: [
        {
          required: true,
          message: '请输入订单物流描述',
          trigger: 'blur'
        }
      ]
    },
    12: {
      // 催付款
      platOrderStatus: [
        {
          required: true,
          message: '请选择平台订单状态',
          trigger: 'change'
        }
      ],
      orderTimeCnGreaterThanOrEqualValue: [
        {
          required: true,
          message: '请输入距离订单时间的左侧值',
          trigger: 'blur'
        }
      ],
      orderTimeCnLessThanValue: [
        {
          required: true,
          message: '请输入距离订单时间的右侧值',
          trigger: 'blur'
        }
      ],
      orderTimeCnValueType: [
        {
          required: true,
          message: '请选择距离订单时间的单位',
          trigger: 'change'
        }
      ],
      notCodVerbalTrick: [
        {
          required: true,
          message: '请输入非COD订单话术',
          trigger: 'blur'
        }
      ],
      sameOrderSendNum: [
        {
          required: true,
          message: '请输入同一订单发送次数',
          trigger: 'blur'
        }
      ],
      sendIntervalValue: [
        {
          required: true,
          message: '请输入多次发送间隔时间',
          trigger: 'blur'
        }
      ],
      sendIntervalValueType: [
        {
          required: true,
          message: '请选择多次发送间隔时间单位',
          trigger: 'change'
        }
      ]
    }
  };
  const handleChangeAutoType = () => {
    const { autoReplyType } = formData.value;
    if (autoReplyType) {
      formRule.value = {
        ...basicFormRule,
        ...otherFormRule[autoReplyType]
      };
      if (autoReplyType !== 5) {
        //乐言自动回复
        formData.value.sendVoucher = false;
        formData.value.voucherType = [];
        showVoucherSetting.value = true;
      } else {
        showVoucherSetting.value = false;
      }
      if (autoReplyType === 3) {
        //差评
        formData.value.ratingStar = 1;
        formData.value.emptyComment = false;
      }
      if (autoReplyType === 6) {
        //发货确认
        formData.value.currency = 'RMB';
      }
      if (autoReplyType === 11 || autoReplyType === 10) {
        formData.value.logisticsDescriptionRelation = 1;
      }
      if (autoReplyType === 12) {
        formData.value.platOrderStatus = ['UNPAID'];
      }
    } else {
      formRule.value = {
        ...basicFormRule
      };
    }
  };
  const handleReset = () => {
    formRef.value.resetFields();
  };
</script>
<style lang="scss" scoped>
  .detail_wrapper {
    :deep(.el-dialog__body) {
      padding-top: 0px !important;
    }
    :deep(.el-select) {
      width: 100%;
    }
    :deep(.el-date-editor--time) {
      width: 100%;
    }
    .m10 {
      margin: 0 10px;
    }
    :deep(.el-radio.el-radio--large) {
      height: 24px;
    }
    .w100 {
      width: 100px;
    }
    .w300 {
      width: 300px;
    }
    .left_input {
      :deep(.el-input__wrapper).el-input__wrapper {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        box-shadow: 1px 0 0 0 var(--el-input-border-color) inset,
          0 1px 0 0 var(--el-input-border-color) inset,
          0 -1px 0 0 var(--el-input-border-color) inset;
      }
    }
    .right_input {
      flex: 1;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      :deep(.el-input__wrapper) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
</style>
