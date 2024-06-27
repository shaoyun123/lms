<template>
  <div class="detail_wrapper fullDialog">
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :width="900"
      :close-on-click-modal="
        checkedRow?.operationType === 'view' ? true : false
      "
      :align-center="true"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :label-width="150"
        :rules="formRule"
        size="default"
        class="rules_form"
      >
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="formData.ruleName" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            :rows="2"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">已启用</el-radio>
            <el-radio :value="0">已停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="刊登日期" prop="executionWeekTime">
          <el-checkbox-group v-model="formData.executionWeekTime">
            <el-checkbox
              v-for="item in PUBLISH_WEEK_TIME"
              :key="item.value"
              :value="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="刊登月份" prop="executionMonthSet">
          <el-checkbox-group v-model="formData.executionMonthSet">
            <el-checkbox
              v-for="item in PUBLISH_MONTH_ENUM"
              :key="item"
              :value="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="站点" prop="saleSite">
          <el-select v-model="formData.saleSite">
            <el-option
              v-for="item in initList.siteList"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <!-- 类目 -->
        <el-form-item
          v-if="
            checkedRow?.operationType === 'view' ||
            checkedRow?.operationType === 'edit'
          "
          label="刊登类目"
          prop="cateId"
        ></el-form-item>
        <el-form-item v-if="false" label="OA类目" prop="categoryIdList">
          <el-cascader
            v-model="formData.categoryIdList"
            :options="initList.oaCateList"
            filterable
            clearable
            collapse-tags
            collapse-tags-tooltip
            disabled
            :props="{
              multiple: true,
              label: 'title',
              children: 'data'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item v-if="false" prop="cateAndOr">
          <el-select v-model="formData.cateAndOr" disabled>
            <el-option :value="true" label="and" />
            <el-option :value="false" label="or" />
          </el-select>
        </el-form-item>
        <el-form-item label="CNSC类目" prop="categoryIdListCNSC"
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
            style="width: 220px"
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
        <el-form-item label="开发类型" prop="devType">
          <MultiSelect
            v-model="formData.devType"
            :option-obj="{
              optionList: initList.devTypeEnums
            }"
          />
        </el-form-item>
        <el-form-item label="商品标签" prop="prodAttrList">
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
        <el-form-item label="物流属性" prop="logisAttrList">
          <MultiSelect
            v-model="formData.logisAttrList"
            :option-obj="{
              optionList: initList.logisAttrEnums
            }"
          />
        </el-form-item>
        <el-form-item label="商品归属人" prop="bizzOwnerList">
          <el-input
            v-model="formData.bizzOwnerList"
            :rows="2"
            type="textarea"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="模板SKU" prop="prodPSkuListStr">
          <el-input
            v-model="formData.prodPSkuListStr"
            :rows="2"
            type="textarea"
            placeholder="英文逗号分隔"
          />
        </el-form-item>
        <el-form-item label="商品审核时间" prop="auditDays">
          <el-input-number
            v-model="formData.auditDays"
            :precision="0"
            :min="0"
            :step="1"
            placeholder="请输入"
          />
          <div class="ml10">天内</div>
        </el-form-item>
        <el-form-item label="30天销量" prop="thirtySalesStart">
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
        <el-form-item label="成本(RMB)" prop="costMin">
          <el-input-number
            v-model="formData.costMin"
            :precision="0"
            :min="0"
            :step="1"
            placeholder="大于等于"
          /><span class="divide-line">-</span>
          <el-input-number v-model="formData.costMax" placeholder="小于等于" />
        </el-form-item>
        <el-form-item label="重量(克)" prop="weightMin">
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
        <el-form-item prop="preAvailableStockNum">
          <template #label>
            <el-select
              v-model="formData.shippingWarehouseId"
              placeholder="请选择发货仓库"
              filterable
            >
              <el-option
                v-for="(item, index) in initList.warehouseList"
                :key="index"
                :value="item.id"
                :label="item.warehouseName"
              ></el-option>
            </el-select>
          </template>
          <el-select
            v-model="formData.preAvailableStockType"
            filterable
            class="stock-item-type"
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
            class="stock-item-num"
          />
        </el-form-item>
        <el-form-item label="侵权状态" prop="infringementStatus">
          <el-radio-group v-model="formData.infringementStatus">
            <el-radio value="shopee不侵权" size="large">shopee不侵权</el-radio>
            <el-radio value="全平台不侵权" size="large">全平台不侵权</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="默认条件">
          <p>
            来源shopee模板，禁售状态=未禁售，在售状态：仅过滤停售且预计可用库存含在途小于等于0的sku，类目禁售状态=不禁售，店铺刊登状态=未刊登，店铺生成状态=未生成
          </p>
        </el-form-item>
        <el-form-item label="获取顺序" prop="orderField">
          <el-select v-model="formData.orderField">
            <el-option
              v-for="item in ORDER_FIELD"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="刊登方式" prop="ruleType">
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
      <el-form-item label="不刊登商品标签" prop="filterProdAttrList">
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
      <template v-if="checkedRow?.operationType !== 'view'" #footer>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave(formRef)"
          >保存</el-button
        >
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import { editRuleApi, addNewApi } from '@/api/shopee/publishrules';
  import {
    PUBLISH_WEEK_TIME,
    ORDER_FIELD,
    PUBLISH_MONTH_ENUM
  } from '../config';
  import { ElMessage } from 'element-plus';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import { QuestionFilled } from '@element-plus/icons-vue';

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

  const title = computed(() => {
    if (props.checkedRow?.operationType === 'edit') {
      return '编辑规则';
    } else if (props.checkedRow?.operationType === 'view') {
      return '查看规则';
    }
    return '新增规则';
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
    ruleName: [
      { required: true, trigger: 'blur', message: '请输入规则名称' },
      {
        required: true,
        trigger: 'change',
        message: '请输入规则名称'
      }
    ],
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
        try {
          formData.value = JSON.parse(
            JSON.stringify({
              cateAndOr: true,
              preAvailableStockType: 1,
              orderField: 1,
              ruleType: 1,
              infringementStatus: 'shopee不侵权',
              ...props.checkedRow,
              categoryIdList: props.checkedRow.categoryIdList
                ? props.checkedRow.categoryIdList.split(',')
                : [],
              categoryIdListCNSC: props.checkedRow.categoryIdListCNSC
                ? props.checkedRow.categoryIdListCNSC.split(',').map(Number)
                : [],
              devType: props.checkedRow.devType
                ? props.checkedRow.devType.split(',')
                : [],
              prodAttrList: props.checkedRow.prodAttrList
                ? props.checkedRow.prodAttrList.split(',')
                : [],
              filterProdAttrList: props.checkedRow.filterProdAttrList
                ? props.checkedRow.filterProdAttrList.split(',')
                : [],
              logisAttrList: props.checkedRow.logisAttrList
                ? props.checkedRow.logisAttrList.split(',')
                : []
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
          if (props.checkedRow?.operationType === 'new') {
            res = await addNewApi(params);
            emits('getCreatorList');
          } else {
            res = await editRuleApi(params);
          }
          ElMessage.success(res.msg);
          needFresh.value = true;
          dialogVisible.value = false;
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
    if (params.categoryIdList) {
      params.categoryIdList = params.categoryIdList
        .map((item) => {
          if (Array.isArray(item)) {
            return item[item.length - 1];
          }
          return item;
        })
        .join();
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
    return params;
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .stock-item-type {
    width: 260px;
    :deep(.el-input__wrapper) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      box-shadow: 1px 0 0 0 var(--el-input-border-color) inset,
        0 1px 0 0 var(--el-input-border-color) inset,
        0 -1px 0 0 var(--el-input-border-color) inset;
    }
    :deep(.el-select__wrapper) {
      box-shadow: 1px 0 0 0 var(--el-border-color) inset,
        0 1px 0 0 var(--el-border-color) inset,
        0 -1px 0 0 var(--el-border-color) inset;
    }
  }
  .stock-item-num {
    :deep(.el-input__wrapper) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .rules_form {
    .el-select {
      width: 220px;
    }
  }
</style>
