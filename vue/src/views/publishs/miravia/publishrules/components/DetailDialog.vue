<template>
  <div class="detail_wrapper">
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :width="900"
      style="height: 78%; overflow: auto"
      :close-on-click-modal="
        checkedRow?.operationType === 'view' ? true : false
      "
      :align-center="true"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :label-width="180"
        :rules="formRule"
        scroll-to-error
        size="default"
      >
        <el-form-item label="规则名称" prop="ruleName">
          <el-input
            v-model="formData.ruleName"
            placeholder="请输入规则名称"
            maxlength="50"
            type="text"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            :rows="2"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">已启用</el-radio>
            <el-radio :value="0">已停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="刊登日期" prop="dayOfWeekList">
          <el-checkbox-group v-model="formData.dayOfWeekList">
            <el-checkbox
              v-for="item in PUBLISH_WEEK_TIME"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <!-- 类目 -->
        <el-form-item label="平台类目" prop="miraviaCategoryIdList">
          <el-cascader
            v-model="formData.miraviaCategoryIdList"
            :options="cateList"
            :props="{
              label: 'cnName',
              value: 'categoryId',
              children: 'children',
              emitPath: false,
              multiple: true,
              checkStrictly: true
            }"
            collapse-tags
            clearable
            filterable
          />
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
        <el-form-item label="商品归属人" prop="bizzOwnerIdListStr">
          <el-input
            v-model="formData.bizzOwnerIdListStr"
            :rows="2"
            type="textarea"
            clearable
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="模板审核时间" prop="auditDays">
          <el-input-number
            v-model="formData.auditDays"
            :precision="0"
            :min="1"
            :step="1"
            placeholder="请输入"
          />
          <div class="ml10">天内</div>
        </el-form-item>
        <el-form-item label="30天销量">
          <el-form-item prop="thirtySalesNumMin">
            <el-input-number
              v-model="formData.thirtySalesNumMin"
              :precision="0"
              :min="0"
              :step="1"
              placeholder="大于等于"
            />
          </el-form-item>
          <span class="divide-line">-</span>
          <el-form-item prop="thirtySalesNumMax">
            <el-input-number
              v-model="formData.thirtySalesNumMax"
              :precision="0"
              :min="0"
              :step="1"
              placeholder="小于等于"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="成本(RMB)">
          <el-form-item prop="costMin">
            <el-input-number
              v-model="formData.costMin"
              :min="0"
              :step="1"
              placeholder="大于等于"
            />
          </el-form-item>
          <span class="divide-line">-</span>
          <el-form-item prop="costMax">
            <el-input-number
              v-model="formData.costMax"
              :min="0"
              :step="1"
              placeholder="小于等于"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="重量(克)">
          <el-form-item prop="weightMin">
            <el-input-number
              v-model="formData.weightMin"
              :min="0"
              :step="1"
              placeholder="大于等于"
            />
          </el-form-item>
          <span class="divide-line">-</span>
          <el-form-item prop="weightMax">
            <el-input-number
              v-model="formData.weightMax"
              :min="0"
              :step="1"
              placeholder="小于等于"
            />
          </el-form-item>
        </el-form-item>
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
          <el-input-number
            v-model="formData.preAvailableStockNum"
            :precision="0"
            :min="0"
            :step="1"
            placeholder="预计可用库存数"
          />
        </el-form-item>
        <el-form-item label="默认条件">
          <p>
            来源基础模板，禁售状态=未禁售，在售状态=在售+停售且预计可用库存含在途>0，侵权状态=所有平台不侵权
            店铺刊登状态=未刊登，店铺生成状态=未生成
          </p>
        </el-form-item>
        <el-form-item label="获取顺序" prop="orderByType">
          <el-select v-model="formData.orderByType">
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
  import { ref, computed, onMounted, watch } from 'vue';
  import {
    editRuleApi,
    addNewRuleApi
  } from '@/api/publishs/miraviapublishrules';
  import { PUBLISH_WEEK_TIME, ORDER_FIELD } from '../config';
  import { ElMessage } from 'element-plus';
  import MultiSelect from '@/components/MultiSelect/index.vue';

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

  //#region  校验
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
    const { miraviaCategoryIdList } = formData.value;
    if (!miraviaCategoryIdList || !miraviaCategoryIdList.length) {
      callback(new Error('站点类目不能为空'));
    } else {
      callback();
    }
  };
  // 若两侧框均填写，需左侧框输入值小于等于右侧框
  const validateRange = (start, end, callback) => {
    if (
      start !== undefined &&
      start !== null &&
      end !== undefined &&
      end !== null
    ) {
      if (start > end) {
        callback(new Error('需左侧框输入值小于等于右侧框'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const validateThirtySalesNumMax = (rule, value, callback) => {
    const { thirtySalesNumMin } = formData.value;
    validateRange(thirtySalesNumMin, value, callback);
  };
  const validateThirtySalesNumMin = (rule, value, callback) => {
    const { thirtySalesNumMax } = formData.value;
    validateRange(value, thirtySalesNumMax, callback);
  };
  const validateCostMin = (rule, value, callback) => {
    const { costMax } = formData.value;
    validateRange(value, costMax, callback);
  };
  const validateCostMax = (rule, value, callback) => {
    const { costMin } = formData.value;
    validateRange(costMin, value, callback);
  };
  const validateWeightMin = (rule, value, callback) => {
    const { weightMax } = formData.value;
    validateRange(value, weightMax, callback);
  };
  const validateWeightMax = (rule, value, callback) => {
    const { weightMin } = formData.value;
    validateRange(weightMin, value, callback);
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
    dayOfWeekList: {
      required: true,
      trigger: 'change',
      message: '请选择刊登日期'
    },
    miraviaCategoryIdList: {
      required: true,
      trigger: 'change',
      validator: validateCateId
    },
    orderByType: {
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
    },
    // 若两侧框均填写，需左侧框输入值小于等于右侧框
    thirtySalesNumMin: [
      { trigger: 'blur', validator: validateThirtySalesNumMin },
      {
        trigger: 'change',
        validator: validateThirtySalesNumMin
      }
    ],
    thirtySalesNumMax: [
      { trigger: 'blur', validator: validateThirtySalesNumMax },
      {
        trigger: 'change',
        validator: validateThirtySalesNumMax
      }
    ],
    costMin: [
      { trigger: 'blur', validator: validateCostMin },
      {
        trigger: 'change',
        validator: validateCostMin
      }
    ],
    costMax: [
      { trigger: 'blur', validator: validateCostMax },
      {
        trigger: 'change',
        validator: validateCostMax
      }
    ],
    weightMin: [
      { trigger: 'blur', validator: validateWeightMin },
      {
        trigger: 'change',
        validator: validateWeightMin
      }
    ],
    weightMax: [
      { trigger: 'blur', validator: validateWeightMax },
      {
        trigger: 'change',
        validator: validateWeightMax
      }
    ]
  });

  //#endregion 校验

  // 获取刊登日期的值 新增默认全部勾选
  const getDayOfWeekListValue = () => {
    if (
      props.checkedRow?.operationType !== 'edit' &&
      props.checkedRow?.operationType !== 'view'
    ) {
      return [1, 2, 3, 4, 5, 6, 0];
    } else {
      return props.checkedRow.dayOfWeekListStr
        ? props.checkedRow.dayOfWeekListStr
            .split(',')
            .map((str) => parseInt(str))
        : [];
    }
  };

  // 初始化站点类目下拉数据 父子节点不关联 勾选父 子全部禁用
  const initCateList = (list, disabled) => {
    const newList = JSON.parse(JSON.stringify(list));
    newList.forEach((item) => {
      if (item.children && item.children.length) {
        const childrenDisabled = formData.value.miraviaCategoryIdList?.includes(
          item.categoryId
        );
        if (childrenDisabled) initMiraviaCategoryIdList(item.children);
        item.children = initCateList(
          item.children,
          disabled ? disabled : childrenDisabled
        );
      }
      item.disabled = disabled;
    });
    return newList;
  };

  // 初始化选择类目列表
  const initMiraviaCategoryIdList = (list) => {
    list.forEach((item) => {
      const index = formData.value.miraviaCategoryIdList.findIndex(
        (id) => id === item.categoryId
      );
      if (index > -1) formData.value.miraviaCategoryIdList.splice(index, 1);
      if (item.children && item.children.length)
        initMiraviaCategoryIdList(item.children);
    });
  };
  const cateList = ref([]);

  watch(
    () => formData.value.miraviaCategoryIdList,
    () => {
      cateList.value = initCateList(props.initList.cateList, false);
    }
  );
  onMounted(() => {
    formData.value = JSON.parse(
      JSON.stringify({
        orderByType: 1,
        ruleType: 1,
        ...props.checkedRow,
        devType: props.checkedRow.devTypeListStr
          ? props.checkedRow.devTypeListStr.split(',')
          : [],
        prodAttrList: props.checkedRow.prodAttrListStr
          ? props.checkedRow.prodAttrListStr.split(',')
          : [],
        logisAttrList: props.checkedRow.logisAttrListStr
          ? props.checkedRow.logisAttrListStr.split(',')
          : [],
        dayOfWeekList: getDayOfWeekListValue(),
        preAvailableStockNum:
          props.checkedRow.expectedStockOnway ||
          props.checkedRow.expectedStockExway,
        preAvailableStockType: props.checkedRow.expectedStockOnway ? 1 : 2
      })
    );
    cateList.value = initCateList(props.initList.cateList, false);
  });

  // 点击保存
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
            res = await addNewRuleApi(params);
            emits('getCreatorList');
          } else {
            res = await editRuleApi(params);
          }
          ElMessage.success(res.msg);
          emits('handleSearch');
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
    if (params.dayOfWeekList && params.dayOfWeekList.length) {
      params.dayOfWeekListStr = params.dayOfWeekList.join(',');
    }
    if (params.miraviaCategoryIdList) {
      params.miraviaCategoryIdListStr = params.miraviaCategoryIdList
        .map((item) => {
          if (Array.isArray(item)) {
            return item[item.length - 1];
          }
          return item;
        })
        .join(',');
    }
    if (params.devType) {
      params.devTypeListStr = params.devType.join(',');
    }
    if (params.logisAttrList.length) {
      params.logisAttrListStr = params.logisAttrList.join(',');
    } else {
      params.logisAttrListStr = '';
    }
    if (params.prodAttrList.length) {
      params.prodAttrListStr = params.prodAttrList.join(',');
    } else {
      params.prodAttrListStr = '';
    }
    // 可用库存含/不含在途
    if (params.preAvailableStockType === 1) {
      params.expectedStockOnway = params.preAvailableStockNum;
      params.expectedStockExway = '';
    } else if (params.preAvailableStockType === 2) {
      params.expectedStockOnway = '';
      params.expectedStockExway = params.preAvailableStockNum;
    }

    if (params.ruleType == 1) {
      params.listingTemplateNum = '';
      params.listingStoreNum = '';
      params.listingMaxNum = '';
    }
    return params;
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
