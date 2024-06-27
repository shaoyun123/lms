<template>
  <div>
    <el-dialog
      v-model="showExport"
      :title="title"
      width="35%"
      :modal-class="'detailDialog'"
      :align-center="true"
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
            @change="operateTypeChange"
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
        <div class="text-red ml-12 leading">
          站点与店铺同时选时取并集；选择站点即选中站点下创建人有权限的所有店铺
        </div>
        <el-form-item label="站点" prop="salesSiteIdList">
          <el-select
            v-model="formData.salesSiteIdList"
            style="width: 100%"
            placeholder="请选择"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option
              v-for="item in tiktokSiteOption"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="店铺"
          prop="storeAcctIdStrList"
          class="store-form-item"
        >
          <ZCascader
            v-model="formData.storeAcctIdStrList"
            :data="storeListApiList"
          ></ZCascader>
        </el-form-item>
        <div class="secondTitle">筛选条件</div>
        <el-form-item v-if="formData.operType !== 2" label="listing状态">
          <span style="color: red">{{ formData.listingStatus }}</span>
        </el-form-item>
        <el-form-item
          v-if="formData.operType === 2"
          label="listing状态"
          required
          prop="prodPlatStatusList"
        >
          <el-select
            v-model="formData.prodPlatStatusList"
            class="m-2"
            style="width: 100%"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            @change="changePlatStatus"
          >
            <el-option
              v-for="item in platStatusOption"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="在售状态" prop="isSaleList">
          <el-select
            v-model="formData.isSaleList"
            clearable
            class="m-2"
            multiple
            style="width: 100%"
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
        <el-form-item
          v-if="formData.operType !== 1"
          label="已下架天数≥"
          prop="temporaryDeActiveDays"
        >
          <ZInputNumber
            v-model="formData.temporaryDeActiveDays"
            :precision="0"
            :min="0"
            :max="7"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <div class="flex">
          <el-form-item
            v-if="formData.operType !== 1"
            label="全球销量"
            prop="notSoldDays"
          >
            <el-select
              v-model="formData.notSoldDays"
              class="m-2"
              style="width: 100%"
            >
              <el-option
                v-for="item in globalSaleOption"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="formData.operType === 1"
            label="销量"
            prop="notSoldDays"
          >
            <el-select
              v-model="formData.notSoldDays"
              class="m-2"
              style="width: 100%"
            >
              <el-option
                v-for="item in saleOption"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <span style="margin: 10px">≤</span>
          <el-form-item prop="salesLte" class="salesLte">
            <el-input
              v-model="formData.salesLte"
              type="number"
              style="width: 100%"
              min="0"
              max="30"
              placeholder="[0,30]"
              @input="handleInput"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="刊登天数≥">
          <ZInputNumber
            v-model="formData.listingDays"
            :precision="0"
            :min="1"
          />
        </el-form-item>
        <div class="flex">
          <el-form-item label="商品类型" class="flexHalf">
            <el-select
              v-model="formData.isMultiSkuOld"
              clearable
              class="m-2"
              style="width: 100%"
            >
              <el-option label="全部" value="全部" />
              <el-option label="单属性" :value="0" />
              <el-option label="多属性" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="侵权状态" class="flexHalf">
            <el-select
              v-model="formData.tortBanListingOld"
              clearable
              class="m-2"
              style="width: 100%"
            >
              <el-option label="全部" value="全部" />
              <el-option label="tiktok侵权" value="TIKTOK_TORT" />
              <el-option label="任一平台侵权" value="ANY_PLAT_TORT" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="禁售站点">
          <el-select
            v-model="formData.prohibitSalesSiteIdStrList"
            placeholder="请选择，多选时为或逻辑"
            filterable
            collapse-tags
            style="width: 100%"
            clearable
            multiple
          >
            <el-option
              v-for="item in tiktokSiteOption"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="formData.operType === 1" label="商品父SKU">
          <el-input
            v-model="formData.prodPSkuStr"
            placeholder="多个用英文逗号分隔"
            type="text"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="formData.operType === 1"
          label="标题包含"
          style="display: flex"
        >
          <el-select v-model="formData.titleSearchType" style="width: 15%">
            <el-option :value="2" label="或" />
            <el-option :value="1" label="与" />
          </el-select>
          <el-input
            v-model="formData.titleSearchContent"
            style="flex: 1"
            placeholder="多个用英文逗号隔开"
            class="form_left form_right"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="formData.operType === 1"
          label="在线商品数量是否为0"
        >
          <el-select
            v-model="formData.onlineStockZero"
            placeholder="请选择"
            clearable
            style="width: 100%"
          >
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>
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
          <el-form-item label="周期起止时间" prop="ruleTimeArr">
            <el-date-picker
              v-model="formData.ruleTimeArr"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="shortcuts"
              range-separator="-"
              placeholder="请选择"
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
            style="position: relative; top: -10px; margin-left: 138px"
          >
            至少选择一天
          </div>
          <el-form-item label="执行时间" prop="executeTime">
            <el-time-picker
              v-model="formData.executeTime"
              placeholder="请选择"
              arrow-control
              style="width: 100%"
              value-format="HH:mm:ss"
            />
          </el-form-item>
          <div class="flex">
            <el-form-item
              v-if="formData.operType !== 1"
              label="每日删除数量限制"
              prop="endNumLimit"
              style="flex: 1"
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
              style="flex: 1"
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
            <div class="self-item">
              <el-popover
                placement="top-start"
                :width="40"
                trigger="hover"
                :content="
                  formData.operType === 1
                    ? '每个店铺单独计算'
                    : '全球商品的数量限制，非店铺维度'
                "
              >
                <template #reference>
                  <el-button link class="m-2"
                    ><el-icon style="font-size: 20px; line-height: 30px"
                      ><QuestionFilled /></el-icon
                  ></el-button>
                </template>
              </el-popover>
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
  import { ref, computed, onMounted, reactive, nextTick } from 'vue';
  import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
  import { cloneDeep } from 'lodash-es';
  // import MultiSelect from '@/components/MultiSelect/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  // import { addRuleApi, updateApi } from '@/api/publishs/tiktokautoreply';
  import {
    saveOrEdit,
    checkRuleHitNum,
    getTiktokAutoDeleteListingRuleOperType,
    getTkProdPlatStatusEnum
  } from '@/api/publishs/tiktokautodeletelisting';
  import { shortcuts } from '@/api/common';
  import { getSiteListApi, getStoreList } from '@/api/common';
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
    // salespersonIdStr: '',
    // salespersonIdStrList: [],
    salesSiteIdList: [],
    storeAcctIdStr: '',
    storeAcctIdStrList: [],
    isSaleList: null,
    isSaleListStr: '',
    notSoldDays: null,
    salesLte: '',
    listingDays: null,
    isMultiSkuOld: '全部',
    isMultiSku: '全部',
    tortBanListing: '全部',
    tortBanListingOld: '全部',
    prohibitSalesSiteIdStr: '',
    prohibitSalesSiteIdStrList: [],
    executeType: 0,
    temporaryDeActiveDays: null,
    ruleStartTime: '',
    ruleEndTime: '',
    ruleTimeArr: '',
    executeWeekDayStr: '',
    executeWeekDayStrList: [],
    executeTime: '',
    endNumLimit: null,
    listingStatus: '',
    prodPlatStatusList: [5, 6]
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
  const isDeActiveDaysRequired = ref(true);
  const checkTemporaryDeActiveDays = (rule, value, callback) => {
    if (
      (formData.value.prodPlatStatusList?.length === 1 &&
        formData.value.prodPlatStatusList[0] === 1) ||
      value ||
      value === 0
    ) {
      callback();
    } else {
      callback(new Error(rule.msg));
    }
  };

  let formRule = reactive({
    ruleName: [{ required: true, trigger: 'blur', message: '请输入任务名称' }],
    operType: [
      { required: true, trigger: 'change', message: '请选择操作类型' }
    ],
    isSaleList: [
      { required: true, trigger: 'blur', message: '请选择在售状态' }
    ],
    prodPlatStatusList: [
      { required: true, trigger: 'blur', message: '请选择listing状态' }
    ],
    notSoldDays: [{ required: true, trigger: 'change', message: '请输入销量' }],
    salesLte: [{ required: true, trigger: 'change', message: '请输入销量≤' }],
    executeType: [
      { required: true, trigger: 'change', message: '请选择任务类型' }
    ],
    temporaryDeActiveDays: [
      {
        validator: checkTemporaryDeActiveDays,
        required: isDeActiveDaysRequired,
        trigger: 'blur',
        message: '请输入已下架天数≥'
      }
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
  onMounted(async () => {
    getTiktokAutoDeleteListingRuleOperTypeFn();
    getTkProdPlatStatusEnumFn();
    getTiktokSiteFun();
    getStoreListApiFun();
    // 修改
    nextTick(() => {
      if (props.detailData.id) {
        isEdit.value = true;
        title.value = '编辑任务';
        formData.value = cloneDeep(props.detailData);

        formData.value.executeWeekDayStrList =
          formData.value.executeWeekDayList;
        formData.value.prohibitSalesSiteIdStrList =
          formData.value.prohibitSalesSiteIdList;
        // formData.value.salespersonIdStrList = formData.value.salespersonIdStr
        //   ? formData.value.salespersonIdStr.split(',').map((item) => Number(item))
        //   : [];
        // getStoreListApiFun(formData.value.salespersonIdStr);
        formData.value.storeAcctIdStrList = formData.value.storeAcctIdStr
          ? formData.value.storeAcctIdStr.split(',').map((item) => Number(item))
          : [];
        formData.value.ruleTimeArr = [
          transferDate(formData.value.ruleStartTime),
          transferDate(formData.value.ruleEndTime)
        ];
        // 新增选项全部 需要判断  默认全部
        if (
          formData.value.tortBanListing === undefined ||
          formData.value.tortBanListing === ''
        ) {
          formData.value.tortBanListing = '全部';
          formData.value.tortBanListingOld = '全部';
        } else {
          formData.value.tortBanListingOld = formData.value.tortBanListing;
        }
        if (formData.value.isMultiSku === undefined) {
          formData.value.isMultiSku = '全部';
          formData.value.isMultiSkuOld = '全部';
        } else {
          formData.value.isMultiSkuOld = formData.value.isMultiSku;
        }
        operateTypeChange(props.detailData.operType);

        if (
          formData.value.prodPlatStatusList?.length === 1 &&
          formData.value.prodPlatStatusList[0] === 1
        ) {
          isDeActiveDaysRequired.value = false;
        } else {
          isDeActiveDaysRequired.value = true;
        }
      }
    });
  });

  // 获取操作类型枚举
  const operateTypeOption = ref([]);
  const getTiktokAutoDeleteListingRuleOperTypeFn = async () => {
    const { data } = await getTiktokAutoDeleteListingRuleOperType();
    operateTypeOption.value = data;
  };

  const platStatusOption = ref();

  const getTkProdPlatStatusEnumFn = async () => {
    const { data } = await getTkProdPlatStatusEnum();
    platStatusOption.value = data;
  };

  const changePlatStatus = (val) => {
    if (val?.length === 1 && val[0] === 1) {
      isDeActiveDaysRequired.value = false;
    } else {
      isDeActiveDaysRequired.value = true;
    }
  };

  // 修改操作类型选择
  const operateTypeChange = (val) => {
    if (val === 2) {
      formData.value.listingStatus = '';
    }
    if (val === 1) {
      formData.value.listingStatus = '在线';
    }
  };

  // 销售员
  // const customersList = ref([]);
  // const getCustomersFun = async () => {
  //   const { code, data } = await getCustomers({ roleNames: 'tiktok专员' });
  //   if (code === '0000') {
  //     customersList.value = data.userList;
  //   }
  // };

  const tiktokSiteOption = ref([]);
  // 禁售站点
  const getTiktokSiteFun = async () => {
    const { code, data } = await getSiteListApi('tiktok');
    if (code === '0000') {
      tiktokSiteOption.value = data;
    }
  };

  const storeListApiList = ref([]);
  const getStoreListApiFun = async () => {
    const { data = {} } = await getStoreList('tiktok');
    storeListApiList.value = data.children || [];
  };

  const isSaleList = ref([
    { dictValue: 2, dictLabel: '全部在售' },
    { dictValue: 1, dictLabel: '部分在售' },
    { dictValue: 0, dictLabel: '全部停售' },
    { dictValue: -1, dictLabel: '无映射' }
  ]);

  const globalSaleOption = ref([
    { dictValue: 30, dictLabel: '30天全球销量' },
    { dictValue: 60, dictLabel: '60天全球销量' },
    { dictValue: 90, dictLabel: '90天全球销量' },
    { dictValue: 180, dictLabel: '180天全球销量' },
    { dictValue: 365, dictLabel: '365天全球销量' }
  ]);

  const saleOption = ref([
    // { dictValue: 0, dictLabel: '不限' },
    { dictValue: 30, dictLabel: '30天销量' },
    { dictValue: 60, dictLabel: '60天销量' },
    { dictValue: 90, dictLabel: '90天销量' },
    { dictValue: 180, dictLabel: '180天销量' },
    { dictValue: 365, dictLabel: '365天销量' }
  ]);

  const handleInput = () => {
    if (formData.value.salesLte > 30) {
      formData.value.salesLte = 30;
    }
  };

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

        formData.value.isSaleListStr =
          formData.value.isSaleList?.join(',') || '';

        // 店铺
        if (
          formData.value.storeAcctIdStrList &&
          formData.value.storeAcctIdStrList?.length
        ) {
          formData.value.storeAcctIdStr =
            formData.value.storeAcctIdStrList.join(',');
        }

        // // 销售员
        // formData.value.salespersonIdStr =
        //   formData.value.salespersonIdStrList.join(',') || '';
        // 站点
        formData.value.salesSiteListStr = (
          formData.value.salesSiteIdList || []
        ).join(',');
        // 商品类型/侵权状态
        if (formData.value.isMultiSkuOld === '全部') {
          formData.value.isMultiSku = null;
        } else {
          formData.value.isMultiSku = formData.value.isMultiSkuOld;
        }
        if (formData.value.tortBanListingOld === '全部') {
          formData.value.tortBanListing = null;
        } else {
          formData.value.tortBanListing = formData.value.tortBanListingOld;
        }

        // 禁售站点
        // if (
        //   formData.value.prohibitSalesSiteIdStrList &&
        //   formData.value.prohibitSalesSiteIdStrList?.length
        // ) {
        formData.value.prohibitSalesSiteIdStr =
          formData.value.prohibitSalesSiteIdStrList?.join(',');
        // }

        // 校验站点店铺至少选择一种
        if (
          !formData.value.salesSiteListStr.length &&
          !formData.value.storeAcctIdStrList.length
        ) {
          return ElMessage.warning('站点和店铺请至少选择一种！');
        }
        if (formData.value.salesLte > 30) {
          formData.value.salesLte = 30;
        }
        if (
          formData.value.salesLte > 0 &&
          !formData.value.tortBanListingOld &&
          !formData.value.prohibitSalesSiteIdStr
        ) {
          // salesLte 大于0时，侵权状态与禁售站点其中一个必须有值
          return ElMessage.warning('操作有销量商品需校验商品侵权或禁售！');
        }
        let idObj = {};
        if (props.detailData.id) {
          idObj.id = props.detailData.id;
        }

        let params = {
          ...idObj,
          ...formData.value
        };
        if (formData.value.operType === 1) {
          delete formData.value.prodPlatStatusList;
        }
        if (formData.value.executeType === 0) {
          loadingInstance.value = ElLoading.service({
            text: loadingText,
            customClass: 'loadingClass',
            target: document.querySelector('.detailDialog .el-dialog')
          });
          animateDots();
          const ruleHitNum = await checkRuleHitNum(params).finally(() => {
            loadingInstance.value.close();
          });

          // loadingInstance.value.close();
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
        }

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
    width: 35px;
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
  .salesLte {
    :deep(.el-form-item__content) {
      margin-left: 0px !important;
    }
  }
  .store-form-item {
    :deep(.el-form-item__content > div) {
      width: 100%;
    }
  }
</style>
