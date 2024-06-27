<template>
  <div class="detail_batch_wrapper fullDialog">
    <el-dialog
      v-model="dialogVisible"
      title="批量修改规则"
      width="65%"
      style="height: 88%; overflow: hidden"
      :close-on-click-modal="false"
      align-center
      @close="close"
    >
      <div style="display: flex; overflow: hidden; height: 100%">
        <div
          style="width: 400px; border-right: 1px solid #ccc; margin-right: 10px"
        >
          <p>请点击选中要修改的字段，仅非必填项支持修改为空</p>
          <el-checkbox-group v-model="checkedGroup">
            <el-checkbox
              v-for="(checkBoxItem, checkboxIndex) in checkBoxGroup"
              :key="checkboxIndex"
              style="width: 70px; margin-bottom: 8px"
              :label="checkBoxItem.value"
              @change="handleCheckBoxGroup"
              ><span v-if="checkBoxItem.requested" style="color: red">*</span
              >{{ checkBoxItem.paramName }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <div class="detail_batch_wrapper_contain">
          <div style="height: 100%; overflow: auto">
            <el-form
              ref="formRef"
              :model="formData"
              :label-width="150"
              :rules="formRule"
              size="default"
            >
              <el-form-item
                v-if="checkedGroup.includes('remark')"
                label="备注"
                prop="remark"
              >
                <el-input
                  v-model="formData.remark"
                  :rows="2"
                  type="textarea"
                  placeholder="请输入备注"
                />
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('status')"
                label="状态"
                prop="status"
              >
                <el-radio-group v-model="formData.status">
                  <el-radio :value="1">已启用</el-radio>
                  <el-radio :value="0">已停用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('executionWeekTime')"
                label="刊登日期"
                prop="executionWeekTime"
              >
                <el-checkbox-group v-model="formData.executionWeekTime">
                  <el-checkbox
                    v-for="item in PUBLISH_WEEK_TIME"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.label }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('platCateIdList')"
                label="站点类目"
                prop="platCateIdList"
              >
                <z-cascader
                  v-model="formData.platCateIdList"
                  :data="initList.tiktokCateList"
                  filterable
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  :props="{
                    emitPath: false,
                    label: 'cnName',
                    value: 'categoryId',
                    children: 'children'
                  }"
                ></z-cascader>
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('devType')"
                label="开发类型"
                prop="devType"
              >
                <MultiSelect
                  v-model="formData.devType"
                  :option-obj="{
                    optionList: initList.devTypeEnums
                  }"
                />
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('prodAttrList')"
                label="商品标签"
                prop="prodAttrList"
              >
                <MultiSelect
                  v-model="formData.prodAttrList"
                  :option-obj="{
                    optionList: initList.prodTagMap,
                    value: 'name',
                    label: 'name'
                  }"
                  :need-option-disabled="true"
                  :option-disabled-param="formData.filterProdAttrList || []"
                  @option-disabled="optionDisabled"
                />
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('logisAttrList')"
                label="物流属性"
                prop="logisAttrList"
              >
                <MultiSelect
                  v-model="formData.logisAttrList"
                  :option-obj="{
                    optionList: initList.logisAttrEnums
                  }"
                />
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('bizzOwnerList')"
                label="商品归属人"
                prop="bizzOwnerList"
              >
                <el-input
                  v-model="formData.bizzOwnerList"
                  :rows="2"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('auditDays')"
                label="商品审核时间"
                prop="auditDays"
              >
                <el-input-number
                  v-model="formData.auditDays"
                  :precision="0"
                  :min="0"
                  :step="1"
                  placeholder="请输入"
                />
                <div class="ml10">天内</div>
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('thirtySalesStart')"
                label="30天销量"
                prop="thirtySalesStart"
              >
                <el-input-number
                  v-model="formData.thirtySalesStart"
                  :precision="0"
                  :min="0"
                  :step="1"
                  placeholder="大于等于"
                /><span class="divide-line">-</span>
                <el-input-number
                  v-model="formData.thirtySalesEnd"
                  :precision="0"
                  :min="0"
                  :step="1"
                  placeholder="小于"
                />
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('costMin')"
                label="成本(RMB)"
                prop="costMin"
              >
                <el-input-number
                  v-model="formData.costMin"
                  :precision="0"
                  :min="0"
                  :step="1"
                  placeholder="大于等于"
                /><span class="divide-line">-</span>
                <el-input-number
                  v-model="formData.costMax"
                  placeholder="小于等于"
                />
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('weightMin')"
                label="重量(克)"
                prop="weightMin"
              >
                <el-input-number
                  v-model="formData.weightMin"
                  :precision="0"
                  :min="0"
                  :step="1"
                  placeholder="大于等于"
                /><span class="divide-line">-</span>
                <el-input-number
                  v-model="formData.weightMax"
                  placeholder="小于等于"
                />
              </el-form-item>
              <template v-if="checkedGroup.includes('preAvailableStockNum')">
                <el-form-item prop="preAvailableStockNum">
                  <template #label>
                    <el-select
                      v-model="formData.preAvailableStockType"
                      filterable
                      clearable
                    >
                      <el-option label="预计可用库存含在途大于" :value="1" />
                      <el-option label="预计可用库存不含在途大于" :value="2" />
                    </el-select>
                  </template>
                  <div>
                    <el-input-number
                      v-model="formData.preAvailableStockNum"
                      :precision="0"
                      :min="0"
                      :step="1"
                      placeholder="预计可用库存数"
                    />
                  </div>
                </el-form-item>
              </template>
              <el-form-item
                v-if="checkedGroup.includes('orderField')"
                label="获取顺序"
                prop="orderField"
              >
                <el-select v-model="formData.orderField">
                  <el-option
                    v-for="item in ORDER_FIELD"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="checkedGroup.includes('ruleType')"
                label="刊登方式"
                prop="ruleType"
              >
                <el-radio-group v-model="formData.ruleType">
                  <el-radio :value="1">刊登店铺配置数量</el-radio>
                  <el-radio :value="2">刊登模板配置数量</el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="formData.ruleType === 2">
                <el-form-item label="刊登模板数" prop="listingTemplateNum">
                  <el-input-number
                    v-model="formData.listingTemplateNum"
                    :precision="0"
                    :min="0"
                    :step="1"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="每个模板刊登店铺数" prop="listingStoreNum">
                  <el-input-number
                    v-model="formData.listingStoreNum"
                    :precision="0"
                    :min="0"
                    :step="1"
                    placeholder=""
                  />
                </el-form-item>
                <el-form-item label="模板在线上限" prop="listingMaxNum">
                  <el-input-number
                    v-model="formData.listingMaxNum"
                    placeholder=""
                    :precision="0"
                    :min="0"
                    :step="1"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave(formRef)"
          >保存</el-button
        >
        <el-button @click="close">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import {
    batchEditApi
    // getBatchEditParamEnumApi
  } from '@/api/publishs/tiktokpublishrules';
  import { PUBLISH_WEEK_TIME, ORDER_FIELD } from '../config';
  import { ElMessage } from 'element-plus';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  const checkBoxGroup = ref([
    {
      code: 0,
      type: '校验条件',
      paramName: '备注',
      requested: false,
      value: 'remark'
    },
    {
      code: 1,
      type: '校验条件',
      paramName: '状态',
      requested: true,
      value: 'status'
    },
    {
      code: 2,
      type: '校验条件',
      paramName: '刊登日期',
      requested: true,
      value: 'executionWeekTime'
    },
    {
      code: 5,
      type: '校验条件',
      paramName: '站点类目',
      requested: true,
      value: 'platCateIdList'
    },
    {
      code: 6,
      type: '校验条件',
      paramName: '开发类型',
      requested: false,
      value: 'devType'
    },
    {
      code: 7,
      type: '校验条件',
      paramName: '商品标签',
      requested: false,
      value: 'prodAttrList'
    },
    {
      code: 8,
      type: '校验条件',
      paramName: '物流属性',
      requested: false,
      value: 'logisAttrList'
    },
    {
      code: 9,
      type: '校验条件',
      paramName: '商品归属人',
      requested: false,
      value: 'bizzOwnerList'
    },
    {
      code: 10,
      type: '校验条件',
      paramName: '商品审核时间',
      requested: false,
      value: 'auditDays'
    },
    {
      code: 11,
      type: '校验条件',
      paramName: '30天销量',
      requested: false,
      value: 'thirtySalesStart'
    },
    {
      code: 12,
      type: '校验条件',
      paramName: '成本',
      requested: false,
      value: 'costMin'
    },
    {
      code: 13,
      type: '校验条件',
      paramName: '重量',
      requested: false,
      value: 'weightMin'
    },
    {
      code: 14,
      type: '校验条件',
      paramName: '库存',
      requested: false,
      value: 'preAvailableStockNum'
    },
    {
      code: 16,
      type: '校验条件',
      paramName: '获取顺序',
      requested: true,
      value: 'orderField'
    },
    {
      code: 17,
      type: '校验条件',
      paramName: '刊登方式',
      requested: true,
      value: 'ruleType'
    }
  ]);
  const checkedGroup = ref([]);
  const filterProdAttrList = ref();
  const handleCheckBoxGroup = (check, item) => {
    if (!check && item.target.defaultValue == 'ruleType') {
      //  刊登方式
      formData.value.ruleType = '';
    }
    if (!check) {
      let a = [
        'executionWeekTime',
        'platCateIdList',
        'devType',
        'prodAttrList',
        'logisAttrList',
        'filterProdAttrList'
      ];
      let b = ['thirtySalesStart', 'costMin', 'weightMin'];
      let c = {
        thirtySalesStart: 'thirtySalesEnd',
        costMin: 'costMax',
        weightMin: 'weightMax'
      };

      let d = ['preAvailableStockNum']; // 数字设置为null

      if (a.includes(item.target.defaultValue)) {
        formData.value[item.target.defaultValue] = [];
      } else if (b.includes(item.target.defaultValue)) {
        formData.value[item.target.defaultValue] = null;
        formData.value[c[item.target.defaultValue]] = null;
      } else if (d.includes(item.target.defaultValue)) {
        formData.value[item.target.defaultValue] = null;
      } else {
        formData.value[item.target.defaultValue] = '';
      }
    }
  };

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedRow: {
      type: Object,
      default: () => {}
    },
    initList: {
      type: Object,
      default: () => {}
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits([
    'update:modelValue',
    'handleSearch',
    'getCreatorList'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const formData = ref({});
  const formRef = ref();
  const validateListingTemplateNum = (rule, value, callback) => {
    const { ruleType } = formData.value;
    if (ruleType === 2) {
      if (value === undefined || value === null) {
        callback(new Error('请输入刊登模板数'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const validateListingStoreNum = (rule, value, callback) => {
    const { ruleType } = formData.value;
    if (ruleType === 2) {
      if (value === undefined || value === null) {
        callback(new Error('请输入每个模板刊登店铺数'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const validateCateId = (rule, value, callback) => {
    const { platCateIdList } = formData.value;
    if (!platCateIdList.length) {
      callback(new Error('站点类目不能为空'));
    } else {
      callback();
    }
  };
  const formRule = ref({
    status: {
      required: true,
      trigger: 'change',
      message: '请选择状态'
    },
    executionWeekTime: {
      required: true,
      trigger: 'change',
      message: '请选择刊登日期'
    },
    platCateIdList: {
      required: true,
      trigger: 'change',
      validator: validateCateId
    },
    orderField: {
      required: true,
      trigger: 'change',
      message: '请选择获取顺序'
    },
    ruleType: {
      required: true,
      trigger: 'change',
      message: '请选择刊登规则'
    },
    listingTemplateNum: {
      required: true,
      trigger: 'change',
      validator: validateListingTemplateNum
    },
    listingStoreNum: {
      required: true,
      trigger: 'change',
      validator: validateListingStoreNum
    }
  });

  const needFresh = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        // const { data } = await getBatchEditParamEnumApi();
        // console.log(data);
        try {
          formData.value = JSON.parse(
            JSON.stringify({
              executionWeekTime: [],
              platCateIdList: [],
              devType: [],
              prodAttrList: [],
              filterProdAttrList: [],
              logisAttrList: [],
              preAvailableStockType: 1 // 默认为含在途
            })
          );
        } catch (err) {
          console.log('err :>> ', err);
        }
      } else {
        if (needFresh.value) {
          emits('handleSearch');
          needFresh.value = false;
        }
      }
    }
  );

  const optionDisabled = (curOption, otherCheckedList, fn) => {
    let disabled = false;
    if ((otherCheckedList || []).includes(curOption.name)) {
      disabled = true;
    }
    fn(disabled);
  };

  const saveLoading = ref(false);
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        saveLoading.value = true;
        try {
          let res = null;
          let params = getParams();
          console.log('params :>> ', params);
          res = await batchEditApi(params);
          emits('getCreatorList');
          ElMessage.success(res.msg);
          needFresh.value = true;
          close();
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          saveLoading.value = false;
        }
      } else {
        console.log('error submit!', fields);
      }
    });
  };

  // 整理保存传参
  const getParams = () => {
    let params = { ...formData.value };
    if (params.executionWeekTime) {
      params.executionWeekTime = params.executionWeekTime.join(',');
    }
    if (params.devType) {
      params.devType = params.devType.join();
    }
    if (params.logisAttrList) {
      params.logisAttrList = params.logisAttrList.join();
    }
    if (params.prodAttrList) {
      params.prodAttrList = params.prodAttrList.join();
    }
    if (params.filterProdAttrList) {
      params.filterProdAttrList = params.filterProdAttrList.join();
    }
    if (params.ruleType == 1) {
      params.listingTemplateNum = '';
      params.listingStoreNum = '';
      params.listingMaxNum = '';
    }
    // 获取选中参数
    let editParamCodes = checkBoxGroup.value.filter((item) =>
      checkedGroup.value.includes(item['value'])
    );
    if (filterProdAttrList.value) {
      editParamCodes.push({
        code: 18,
        paramName: '不刊登商品标签',
        requested: false,
        type: '过滤条件'
      });
    }
    // 赋值选中行id
    params.ruleIdList = props.checkedRow;
    params.editParamCodes = editParamCodes.map((item) => item.code);
    return params;
  };

  const close = () => {
    dialogVisible.value = false;
    checkedGroup.value = [];
    formRef.value.resetFields();
    filterProdAttrList.value = false;
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .mb18 {
    margin-bottom: 18px;
  }
  .ml10 {
    margin-left: 10px;
  }
  :deep(.el-dialog__body) {
    height: 85%;
  }
  .detail_batch_wrapper_contain {
    flex: 1;
    overflow: hidden;
  }
</style>
