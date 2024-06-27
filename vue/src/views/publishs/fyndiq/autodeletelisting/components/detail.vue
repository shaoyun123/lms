<template>
  <div>
    <el-dialog
      v-model="showExport"
      :title="title"
      width="45%"
      :modal-class="'detailDialog'"
      :align-center="true"
      style="margin-top: 50px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        v-loading="dialogLoading"
        :rules="formRule"
        :model="formData"
        :label-width="138"
        size="default"
      >
        <el-form-item label="任务名称" prop="ruleName">
          <el-input
            v-model="formData.ruleName"
            placeholder="请输入"
            maxlength="50"
            type="textarea"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="操作类型" prop="operType">
          <el-select
            v-model="formData.operType"
            :disabled="isEdit"
            style="width: 100%"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in operateTypeOption"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <div class="secondTitle"><span class="text-red">*</span>筛选方式</div>
        <div class="text-red ml-12 leading">以下方式至少选择一种：</div>
        <el-form-item label="销售员" prop="salespersonIdStrList">
          <el-select
            v-model="formData.salespersonIdStrList"
            style="width: 100%"
            placeholder="请选择"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            @change="changeSaler"
          >
            <el-option
              v-for="val in customersList"
              :key="val.id"
              :label="val.user_name"
              :value="val.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="店铺"
          prop="storeAcctIdStrList"
          class="search_item_cascader"
        >
          <el-select
            v-model="formData.storeAcctIdStrList"
            style="width: 100%"
            placeholder="请选择"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option
              v-for="val in storeListApiList"
              :key="val.id"
              :label="val.storeAcct"
              :value="val.id"
            />
          </el-select>
        </el-form-item>
        <div class="secondTitle">筛选条件</div>
        <div class="flex">
          <el-form-item label="在售状态" prop="saleStatusList" class="flexHalf">
            <el-select
              v-model="formData.saleStatusList"
              clearable
              class="m-2"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
            >
              <el-option
                v-for="item in isSaleList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="刊登时间" prop="listingTimeArr" class="flexHalf">
            <el-date-picker
              v-model="formData.listingTimeArr"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="shortcuts"
              range-separator="-"
              :default-time="defaultTime"
            />
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item label="销量" prop="notSoldDays" class="flexHalf">
            <el-select v-model="formData.notSoldDays" class="m-2">
              <el-option
                v-for="item in globalSaleOption"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="刊登天数≥" class="flexHalf">
            <ZInputNumber
              v-model="formData.listingDays"
              :precision="0"
              :min="1"
            />
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item label="侵权状态" class="flexHalf">
            <el-select v-model="formData.tortBanListing" clearable class="m-2">
              <!-- <el-option label="全部" value="全部" /> -->
              <!-- <el-option label="fyndiq侵权" value="FYNDIQ_TORT" /> -->
              <el-option label="任一平台侵权" value="ANY_PLAT_TORT" />
            </el-select>
          </el-form-item>
        </div>
        <div class="secondTitle">执行设置</div>
        <el-form-item label="任务类型" prop="executeType">
          <el-radio-group
            v-model="formData.executeType"
            @change="changeExecuteType"
          >
            <el-radio :value="0">手动执行</el-radio>
            <el-radio :value="1">定时任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="formData.executeType">
          <el-form-item
            label="周期起止时间"
            prop="ruleTimeArr"
            class="flexHalf"
          >
            <el-date-picker
              v-model="formData.ruleTimeArr"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="shortcuts"
              range-separator="-"
              placeholder="请选择"
              :default-time="defaultTime"
            />
          </el-form-item>
          <el-form-item label="循环规则" prop="executeWeekDayStrList">
            <el-checkbox-group v-model="formData.executeWeekDayStrList">
              <el-checkbox :label="2">周一</el-checkbox>
              <el-checkbox :label="3">周二</el-checkbox>
              <el-checkbox :label="4">周三</el-checkbox>
              <el-checkbox :label="5">周四</el-checkbox>
              <el-checkbox :label="6">周五</el-checkbox>
              <el-checkbox :label="7">周六</el-checkbox>
              <el-checkbox :label="1">周日</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <div
            class="text-red leading"
            style="position: relative; top: -10px; padding-left: 138px"
          >
            至少选择一天
          </div>
          <div class="flex">
            <el-form-item label="执行时间" prop="executeTime" class="flexHalf">
              <el-time-picker
                v-model="formData.executeTime"
                placeholder="请选择"
                arrow-control
                value-format="HH:mm:ss"
              />
            </el-form-item>
            <div class="flexHalf flex">
              <el-form-item
                v-if="formData.operType !== 1"
                label="每日删除数量限制"
                prop="endNumLimit"
                :rules="{
                  required: true,
                  trigger: 'blur',
                  message: '请输入每日删除数量限制'
                }"
              >
                <ZInputNumber
                  v-model="formData.endNumLimit"
                  :step="1"
                  :precision="0"
                  :min="1"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                v-if="formData.operType === 1"
                label="每日下架数量限制"
                prop="endNumLimit"
                :rules="{
                  required: true,
                  trigger: 'blur',
                  message: '请输入每日下架数量限制'
                }"
              >
                <ZInputNumber
                  v-model="formData.endNumLimit"
                  :step="1"
                  :precision="0"
                  :min="1"
                  placeholder="请输入"
                />
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span>
          <el-button
            type="primary"
            :loading="dialogLoading"
            :disabled="dialogLoading"
            @click="handleSave(formRef)"
            >确定</el-button
          >
          <el-button :disabled="dialogLoading" @click="showExport = false"
            >取消</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
  import { cloneDeep } from 'lodash-es';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import {
    saveOrEdit,
    checkRuleHitNum,
    getAutoDeleteListingRuleOperType,
    getStoreListApi
  } from '@/api/publishs/fyndiqautodeletelisting';
  import { shortcuts } from '@/api/common';
  import { getCustomers, getSiteListApi } from '@/api/common';
  import { transferDate } from '@/utils/common';

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

  const formData = ref({
    ruleName: '',
    operType: '',
    salespersonIdStr: '',
    salespersonIdStrList: [],
    storeAcctIdStr: '',
    storeAcctIdStrList: '',
    saleStatusList: [],
    listingTimeMin: '',
    listingTimeMax: '',
    listingTimeArr: [],
    notSoldDays: null,
    listingDays: null,
    isMultiSku: '全部',
    tortBanListing: '',
    executeType: 0,
    temporaryDeActiveDays: null,
    ruleStartTime: '',
    ruleEndTime: '',
    ruleTimeArr: '',
    executeWeekDayStr: '',
    executeWeekDayStrList: [],
    executeTime: '',
    endNumLimit: null
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
    ruleName: [{ required: true, trigger: 'blur', message: '请输入任务名称' }],
    operType: [
      { required: true, trigger: 'change', message: '请选择操作类型' }
    ],
    saleStatusList: [
      { required: true, trigger: 'change', message: '请选择在售状态' }
    ],
    listingTimeArr: [
      { required: true, trigger: 'change', message: '请选择刊登时间' }
    ],
    notSoldDays: [
      { required: true, trigger: 'change', message: '请选择刊登时间' }
    ],
    executeType: [
      { required: true, trigger: 'change', message: '请选择任务类型' }
    ],
    temporaryDeActiveDays: [
      { required: true, trigger: 'blur', message: '请输入暂时下架天数' }
    ],
    ruleTimeArr: [
      { required: true, trigger: 'change', message: '请选择周期起止时间' }
    ],
    executeWeekDayStrList: [
      { required: true, trigger: 'change', message: '请选择循环规则' }
    ],
    executeTime: [
      { required: true, trigger: 'change', message: '请选择执行时间' }
    ]
  });

  const title = ref('新建任务');
  const isEdit = ref(false);
  onMounted(() => {
    getTiktokAutoDeleteListingRuleOperTypeFn();
    getTiktokSiteFun();
    getCustomersFun();
    getStoreListApiFun();
    // 修改
    if (props.detailData.id) {
      isEdit.value = true;
      title.value = '编辑任务';
      formData.value = cloneDeep(props.detailData);
      formData.value.executeWeekDayStrList = formData.value.executeWeekDayList;
      formData.value.prohibitSalesSiteIdStrList =
        formData.value.prohibitSalesSiteIdList;
      formData.value.salespersonIdStrList = formData.value.salespersonIdStr
        ? formData.value.salespersonIdStr.split(',').map((item) => Number(item))
        : [];
      getStoreListApiFun(formData.value.salespersonIdStr);
      formData.value.storeAcctIdStrList = formData.value.storeAcctIdStr
        ? formData.value.storeAcctIdStr.split(',').map((item) => Number(item))
        : [];
      formData.value.listingTimeArr = [
        transferDate(formData.value.listingTimeMin),
        transferDate(formData.value.listingTimeMax)
      ];
      formData.value.ruleTimeArr = [
        transferDate(formData.value.ruleStartTime),
        transferDate(formData.value.ruleEndTime)
      ];
    }
  });

  const defaultTime = [
    new Date(0, 0, 0, 0, 0, 0),
    new Date(0, 0, 0, 23, 59, 59)
  ];

  // 获取操作类型枚举
  const operateTypeOption = ref([]);
  const getTiktokAutoDeleteListingRuleOperTypeFn = async () => {
    const { data } = await getAutoDeleteListingRuleOperType();
    operateTypeOption.value = data;
  };

  // 销售员
  const customersList = ref([]);
  const getCustomersFun = async () => {
    const { code, data } = await getCustomers({ roleNames: 'fyndiq专员' });
    if (code === '0000') {
      customersList.value = data.userList;
    }
  };

  const tiktokSiteOption = ref([]);
  // 禁售站点
  const getTiktokSiteFun = async () => {
    const { code, data } = await getSiteListApi('fyndiq');
    if (code === '0000') {
      tiktokSiteOption.value = data;
    }
  };

  const changeSaler = () => {
    // 将店铺筛选出来
    getStoreListApiFun(formData.value.salespersonIdStrList.join(','));
    formData.value.storeAcctIdStrList = [];
  };

  const storeListApiList = ref([]);
  const getStoreListApiFun = async (salePersonId) => {
    const { code, data } = await getStoreListApi({ salePersonId });
    if (code === '0000') {
      storeListApiList.value = data;
    }
  };

  const isSaleList = ref([
    { dictValue: 1, dictLabel: '在售' },
    { dictValue: 0, dictLabel: '停售' }
  ]);

  const globalSaleOption = ref([
    { dictValue: 7, dictLabel: '7天=0' },
    { dictValue: 30, dictLabel: '30天=0' },
    { dictValue: 90, dictLabel: '90天=0' },
    { dictValue: 180, dictLabel: '180天=0' }
  ]);

  const changeExecuteType = (val) => {
    if (!val) {
      formData.value.ruleTimeArr = [];
      formData.value.ruleStartTime = '';
      formData.value.ruleEndTime = '';
      formData.value.executeWeekDayStr = ''; // 周一到周六
      formData.value.executeWeekDayStrList = []; // 周一到周六
      formData.value.executeTime = ''; // 执行时间
      formData.value.endNumLimit = ''; // 执行时间
    }
    formData.value.temporaryDeActiveDays = ''; // 暂时下架天数
  };

  // 保存
  const formRef = ref();
  const dialogLoading = ref(false);
  const loadingText = ref('查询中');
  const loadingInstance = ref(null);
  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        // 任务类型 0手动  1定时
        if (formData.value.executeType) {
          const ruleTimeList = formData.value.ruleTimeArr.map((item) => {
            return new Date(item).getTime();
          });
          [formData.value.ruleStartTime, formData.value.ruleEndTime] =
            ruleTimeList;

          // 循环规则
          if (
            formData.value.executeWeekDayStrList &&
            formData.value.executeWeekDayStrList.length
          ) {
            formData.value.executeWeekDayStr =
              formData.value.executeWeekDayStrList.join(',');
          }
        }
        if (formData.value.listingTimeArr.length) {
          const listingTimeList = formData.value.listingTimeArr.map((item) => {
            return new Date(item).getTime();
          });
          [formData.value.listingTimeMin, formData.value.listingTimeMax] =
            listingTimeList;
        }
        if (
          formData.value.ruleStartTime &&
          formData.value.ruleEndTime &&
          formData.value.ruleStartTime >= formData.value.ruleEndTime
        ) {
          return ElMessage.warning('周期结束时间需要大于开始时间！');
        }
        if (formData.value.listingTimeMin >= formData.value.listingTimeMax) {
          return ElMessage.warning('刊登结束时间需要大于开始时间！');
        }

        // 店铺
        if (
          formData.value.storeAcctIdStrList &&
          formData.value.storeAcctIdStrList?.length
        ) {
          formData.value.storeAcctIdStr =
            formData.value.storeAcctIdStrList.join(',');
        }

        // 销售员
        if (
          formData.value.salespersonIdStrList &&
          formData.value.salespersonIdStrList?.length
        ) {
          formData.value.salespersonIdStr =
            formData.value.salespersonIdStrList.join(',');
        }

        // 是否停售
        if (formData.value.oldIsSale === '全部') {
          formData.value.isSale = '';
        } else {
          formData.value.isSale = formData.value.oldIsSale;
        }

        // 商品类型/侵权状态
        // if (formData.value.isMultiSku === '全部') {
        //   formData.value.isMultiSku = null;
        // }
        // if (formData.value.tortBanListing === '全部') {
        //   formData.value.tortBanListing = null;
        // }

        // 校验销售员店铺至少选择一种
        if (
          !formData.value.salespersonIdStrList.length &&
          !formData.value.storeAcctIdStrList.length
        ) {
          return ElMessage.warning('销售员和销售店铺请至少选择一种！');
        }
        let idObj = {};
        if (props.detailData.id) {
          idObj.id = props.detailData.id;
        }

        let params = {
          ...idObj,
          ...formData.value
        };

        loadingInstance.value = ElLoading.service({
          text: loadingText.value,
          target: document.querySelector('.detailDialog .el-dialog')
        });
        animateDots();
        const ruleHitNum = await checkRuleHitNum(params);
        loadingInstance.value.close();
        const operType =
          operateTypeOption.value.filter(
            (v) => v.code === formData.value.operType
          )[0]?.name || '删除';
        await ElMessageBox.confirm(
          `本次执行${operType}的listing数量为${ruleHitNum.count}，请确认是否进行${operType}?`,
          '信息',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );

        dialogLoading.value = true;
        try {
          const { code, msg } = await saveOrEdit(params);
          if (code === '0000') {
            ElMessage.success(msg);
            emits('freshList');
            showExport.value = false;
            dialogLoading.value = false;
          }
        } catch (err) {
          dialogLoading.value = false;
        }
      }
    });
  };

  const animateDots = () => {
    setInterval(() => {
      switch (loadingText.value) {
        case '查询中':
          loadingText.value = '查询中.';
          loadingInstance.value.setText('查询中.');
          break;
        case '查询中.':
          loadingText.value = '查询中..';
          loadingInstance.value.setText('查询中..');
          break;
        case '查询中..':
          loadingText.value = '查询中...';
          loadingInstance.value.setText('查询中...');
          break;
        case '查询中...':
          loadingText.value = '查询中';
          loadingInstance.value.setText('查询中');
          break;
      }
    }, 500);
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
  .ml20 {
    margin-left: 20px;
  }
  .flex {
    display: flex;
  }
  .flexHalf {
    width: 50%;
    flex-shrink: 0;
  }
  .flex-1 {
    flex: 1;
  }
  .self-item {
    place-self: start;
  }
  .text-red {
    color: red;
  }
  .leading {
    line-height: 20px;
  }
  .ml-12 {
    margin-left: 48px;
  }
  .secondTitle {
    margin-left: 44px;
    font-size: 16px;
    font-weight: bold;
    line-height: 30px;
  }
</style>
