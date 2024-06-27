<template>
  <div class="detail_batch_wrapper fullDialog">
    <el-dialog
      v-model="dialogVisible"
      title="批量修改规则"
      :width="900"
      :close-on-click-modal="true"
      :align-center="true"
    >
      <div style="display: flex; height: 100%">
        <div
          style="width: 400px; border-right: 1px solid #ccc; margin-right: 10px"
        >
          <p>请点击选中要修改的字段，仅非必填项支持修改为空</p>
          <h1 class="h1Con">校验条件</h1>
          <el-checkbox-group v-model="checkedGroup">
            <el-checkbox
              v-for="(checkBoxItem, checkboxIndex) in checkBoxGroup"
              :key="checkboxIndex"
              style="width: 70px"
              :label="checkBoxItem.value"
              @change="handleCheckBoxGroup"
              ><span v-if="checkBoxItem.requested" style="color: red">*</span
              >{{ checkBoxItem.paramName }}</el-checkbox
            >
          </el-checkbox-group>
          <h1 class="h1Con">过滤条件</h1>
          <el-checkbox
            v-model="filterProdAttrList"
            label="filterProdAttrList"
            @change="handleCheckBoxGroup"
            >不刊登商品标签</el-checkbox
          >
        </div>
        <div class="detail_batch_wrapper_contain">
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
              v-if="checkedGroup.includes('executionMonthSet')"
              label="刊登月份"
              prop="executionMonthSet"
            >
              <el-checkbox-group v-model="formData.executionMonthSet">
                <el-checkbox
                  v-for="item in PUBLISH_MONTH_ENUM"
                  :key="item"
                  :label="item.value"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item
              v-if="checkedGroup.includes('saleSite')"
              label="站点"
              prop="saleSite"
            >
              <el-select v-model="formData.saleSite">
                <el-option
                  v-for="item in initList.siteList"
                  :key="item.code"
                  :value="item.code"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="checkedGroup.includes('categoryIdListCNSC')"
              label="CNSC类目"
              prop="categoryIdListCNSC"
              ><el-cascader
                v-model="formData.categoryIdListCNSC"
                :options="initList.cnscCateLsit"
                filterable
                clearable
                collapse-tags
                collapse-tags-tooltip
                :props="{
                  multiple: true,
                  label: 'tag'
                }"
              ></el-cascader>
              <div v-if="false">
                <el-checkbox
                  v-model="formData.cnscAssiDataOnly"
                  disabled
                  class="ml30"
                  label="仅取值自商品补充信息"
                /><el-tooltip
                  effect="dark"
                  content="选中后将不会根据CNSC类目映射关系查找对应OA类目商品"
                  placement="right"
                >
                  <el-icon
                    ><QuestionFilled
                      style="width: 2em; height: 2em"
                      color="#409eff"
                  /></el-icon>
                </el-tooltip>
              </div>
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
                placeholder=""
              />
            </el-form-item>
            <el-form-item
              v-if="checkedGroup.includes('prodPSkuListStr')"
              label="模板SKU"
              prop="prodPSkuListStr"
            >
              <el-input
                v-model="formData.prodPSkuListStr"
                :rows="2"
                type="textarea"
                placeholder="英文逗号分隔"
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
                    v-model="formData.shippingWarehouseId"
                    placeholder="请选择发货仓库"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in initList.warehouseList"
                      :key="index"
                      :value="item.id"
                      :label="item.warehouseName"
                    ></el-option>
                  </el-select>
                </template>
                <div>
                  <el-select
                    v-model="formData.preAvailableStockType"
                    filterable
                    clearable
                  >
                    <el-option label="预计可用库存含在途大于" :value="1" />
                    <el-option label="预计可用库存不含在途大于" :value="2" />
                  </el-select>
                  <el-input-number
                    v-model="formData.preAvailableStockNum"
                    :precision="0"
                    :min="0"
                    :step="1"
                    placeholder="预计可用库存数"
                  />
                </div>
              </el-form-item>
              <div class="mb18">
                <el-text type="danger">
                  若未填写“发货仓库”和“预计可用库存含在途/不含在途”选项，保存时保留规则原设置值，若填写了则正常修改为指定值。若不填写“预计可用库存值”，保存时会清空原值，填写则批量修改为指定值
                </el-text>
              </div>
            </template>
            <el-form-item
              v-if="checkedGroup.includes('infringementStatus')"
              label="侵权状态"
              prop="infringementStatus"
            >
              <el-radio-group v-model="formData.infringementStatus">
                <el-radio value="shopee不侵权" size="large"
                  >shopee不侵权</el-radio
                >
                <el-radio value="全平台不侵权" size="large"
                  >全平台不侵权</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="默认条件">
              <p>
                来源shopee模板，禁售状态=未禁售，在售状态：仅过滤停售且预计可用库存含在途小于等于0的sku，类目禁售状态=不禁售，店铺刊登状态=未刊登，店铺生成状态=未生成
              </p>
            </el-form-item>
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
          <el-form-item label="过滤条件"></el-form-item>
          <el-form-item
            v-if="filterProdAttrList"
            label="不刊登商品标签"
            prop="filterProdAttrList"
          >
            <MultiSelect
              v-model="formData.filterProdAttrList"
              :option-obj="{
                optionList: initList.prodTagMap,
                value: 'name',
                label: 'name'
              }"
              :need-option-disabled="true"
              :option-disabled-param="formData.prodAttrList || []"
              @option-disabled="optionDisabled"
            />
          </el-form-item>
        </div>
      </div>
      <template #footer>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave(formRef)"
          >保存</el-button
        >
        <el-button @click="close">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import {
    batchEditApi
    // getBatchEditParamEnumApi
  } from '@/api/shopee/publishrules';
  import {
    PUBLISH_WEEK_TIME,
    ORDER_FIELD,
    PUBLISH_MONTH_ENUM
  } from '../config';
  import { ElMessage } from 'element-plus';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import { QuestionFilled } from '@element-plus/icons-vue';
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
      code: 3,
      type: '校验条件',
      paramName: '刊登月份',
      requested: true,
      value: 'executionMonthSet'
    },
    // {
    //   code: 4,
    //   type: '校验条件',
    //   paramName: '站点',
    //   requested: true,
    //   value: 'saleSite'
    // },
    {
      code: 5,
      type: '校验条件',
      paramName: 'CNSC类目',
      requested: true,
      value: 'categoryIdListCNSC'
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
      code: 19,
      type: '校验条件',
      paramName: '模板SKU',
      requested: false,
      value: 'prodPSkuListStr'
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
      paramName: '预计可用库存',
      requested: false,
      value: 'preAvailableStockNum'
    },
    {
      code: 15,
      type: '校验条件',
      paramName: '侵权状态',
      requested: true,
      value: 'infringementStatus'
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
        'executionMonthSet',
        'categoryIdListCNSC',
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
    const { categoryIdListCNSC } = formData.value;
    if (!categoryIdListCNSC.length) {
      callback(new Error('CNSC类目不能为空'));
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
    executionMonthSet: {
      required: true,
      trigger: 'change',
      message: '请选择刊登月份'
    },
    saleSite: {
      required: true,
      trigger: 'change',
      message: '请选择站点'
    },
    categoryIdListCNSC: {
      required: true,
      trigger: 'change',
      validator: validateCateId
    },
    orderField: {
      required: true,
      trigger: 'change',
      message: '请选择获取顺序'
    },
    infringementStatus: {
      required: true,
      trigger: 'change',
      message: '请选择获侵权状态'
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
              executionMonthSet: [],
              categoryIdListCNSC: [],
              devType: [],
              prodAttrList: [],
              filterProdAttrList: [],
              logisAttrList: []
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

  const getParams = () => {
    let params = { ...formData.value };
    if (params.executionWeekTime) {
      params.executionWeekTime = params.executionWeekTime.join(',');
    }
    if (params.executionMonthSet) {
      params.executionMonths = params.executionMonthSet.join(',');
    }
    if (params.categoryIdListCNSC) {
      params.categoryIdListCNSC = params.categoryIdListCNSC
        .map((item) => {
          if (Array.isArray(item)) {
            return item[item.length - 1];
          }
          return item;
        })
        .join();
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
    if (params.prodPSkuListStr) {
      params.prodPSkuListStr = params.prodPSkuListStr
        .replaceAll('，', ',')
        .split(',')
        .filter((item) => !!item)
        .join();
    }
    if (params.ruleType == 1) {
      params.listingTemplateNum = '';
      params.listingStoreNum = '';
      params.listingMaxNum = '';
    }
    if (params.saleSite) {
      params.siteName = props.initList.siteList.filter(
        (item) => item.code === params.saleSite
      )[0].name;
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
</style>
