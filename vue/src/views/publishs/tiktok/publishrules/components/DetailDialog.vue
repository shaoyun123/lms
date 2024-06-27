<template>
  <div class="detail_wrapper">
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
        :label-width="180"
        :rules="formRule"
        scroll-to-error
        size="default"
        class="tk_edit_form"
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
              :label="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="站点" prop="salesSiteList">
          <MultiSelect
            v-if="checkedRow?.operationType == 'new'"
            v-model="formData.salesSiteList"
            :option-obj="{
              optionList: initList.siteList,
              label: 'name',
              value: 'code'
            }"
          />
          <div v-else>{{ formData.siteNames }}</div>
        </el-form-item> -->
        <!-- 类目 -->
        <el-form-item label="站点类目" prop="platCateIdList">
          <z-cascader
            v-model="formData.platCateIdList"
            :data="initList.tiktokCateList"
            :props="{
              label: 'cnName',
              value: 'categoryId',
              children: 'children'
            }"
          ></z-cascader>
          <!-- <el-cascader
            v-model="formData.platCateIdList"
            :options="initList.tiktokCateList"
            filterable
            clearable
            collapse-tags
            collapse-tags-tooltip
            :props="{
              multiple: true,
              label: 'cnName',
              value: 'categoryId',
              children: 'children'
            }"
          ></el-cascader> -->
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
        <el-form-item label="商品归属人" prop="bizzOwnerList">
          <el-input
            v-model="formData.bizzOwnerList"
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
            :min="0"
            :step="1"
            placeholder="请输入"
          />
          <div class="ml10">天内</div>
        </el-form-item>
        <el-form-item label="30天销量">
          <el-form-item prop="thirtySalesStart">
            <el-input-number
              v-model="formData.thirtySalesStart"
              :precision="0"
              :min="0"
              :step="1"
              placeholder="大于等于"
            />
          </el-form-item>
          <span class="divide-line">-</span>
          <el-form-item prop="thirtySalesEnd">
            <el-input-number
              v-model="formData.thirtySalesEnd"
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
        <!-- <el-form-item label="刊登量">
          <el-form-item prop="listingNumMin">
            <el-input-number
              v-model="formData.listingNumMin"
              :precision="0"
              :min="0"
              :step="1"
              placeholder="大于等于"
            />
          </el-form-item>
          <span class="divide-line">-</span>
          <el-form-item prop="listingNumMax">
            <el-input-number
              v-model="formData.listingNumMax"
              :precision="0"
              :min="0"
              :step="1"
              placeholder="小于等于"
            />
          </el-form-item>
          <span class="ml10">模板在TikTok对应站点刊登listing数量</span>
        </el-form-item> -->
        <el-form-item label="默认条件">
          <p>
            来源基础模板，禁售状态=未禁售，在售状态：仅过滤停售且预计可用库存含在途小于等于0的sku，侵权状态=所有平台不侵权,
            类目禁售状态=不禁售 店铺刊登状态=未刊登，店铺生成状态=未生成
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
  import { ref, computed, onMounted } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import {
    editRuleApi,
    addNewRuleApi
  } from '@/api/publishs/tiktokpublishrules';
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
    const { platCateIdList } = formData.value;
    if (!platCateIdList || !platCateIdList.length) {
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
  const validateThirtySalesStart = (rule, value, callback) => {
    const { thirtySalesEnd } = formData.value;
    validateRange(value, thirtySalesEnd, callback);
  };
  const validateThirtySalesEnd = (rule, value, callback) => {
    const { thirtySalesStart } = formData.value;
    validateRange(thirtySalesStart, value, callback);
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
  // const validateListingNumMin = (rule, value, callback) => {
  //   const { listingNumMax } = formData.value;
  //   validateRange(value, listingNumMax, callback);
  // };
  // const validateListingNumMax = (rule, value, callback) => {
  //   const { listingNumMin } = formData.value;
  //   validateRange(listingNumMin, value, callback);
  // };

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
    // salesSiteList: {
    //   required: true,
    //   trigger: 'change',
    //   message: '请选择站点'
    // },
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
    },
    // 若两侧框均填写，需左侧框输入值小于等于右侧框
    thirtySalesStart: [
      { trigger: 'blur', validator: validateThirtySalesStart },
      {
        trigger: 'change',
        validator: validateThirtySalesStart
      }
    ],
    thirtySalesEnd: [
      { trigger: 'blur', validator: validateThirtySalesEnd },
      {
        trigger: 'change',
        validator: validateThirtySalesEnd
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
    // listingNumMin: [
    //   { trigger: 'blur', validator: validateListingNumMin },
    //   {
    //     trigger: 'change',
    //     validator: validateListingNumMin
    //   }
    // ],
    // listingNumMax: [
    //   { trigger: 'blur', validator: validateListingNumMax },
    //   {
    //     trigger: 'change',
    //     validator: validateListingNumMax
    //   }
    // ]
  });

  //#endregion 校验

  onMounted(() => {
    formData.value = JSON.parse(
      JSON.stringify({
        preAvailableStockType: 1,
        orderField: 1,
        ruleType: 1,
        ...props.checkedRow,
        devType: props.checkedRow.devType
          ? props.checkedRow.devType.split(',')
          : [],
        prodAttrList: props.checkedRow.prodAttrList
          ? props.checkedRow.prodAttrList.split(',')
          : [],
        logisAttrList: props.checkedRow.logisAttrList
          ? props.checkedRow.logisAttrList.split(',')
          : []
      })
    );
  });

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
    if (params.executionWeekTime) {
      params.executionWeekTime = params.executionWeekTime.join(',');
    }
    if (params.platCateIdList) {
      params.platCateIdList = params.platCateIdList.map((item) => {
        if (Array.isArray(item)) {
          return item[item.length - 1];
        }
        return item;
      });
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
  .tk_edit_form {
    .el-select {
      width: 215px;
    }
  }
</style>
