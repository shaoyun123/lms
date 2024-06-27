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
        :label-width="150"
        :rules="formRule"
        scroll-to-error
        size="default"
        class="rules_form"
      >
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="formData.ruleName" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="true">已启用</el-radio>
            <el-radio :value="false">已停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            :rows="2"
            type="textarea"
            placeholder="请输入备注"
          />
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
        <el-form-item label="刊登站点" prop="saleSiteList">
          <el-select
            v-model="formData.saleSiteList"
            multiple
            @change="saleSiteListChange"
          >
            <el-option value="MLM" label="墨西哥" />
            <el-option value="MLB" label="巴西" />
            <el-option value="MCO" label="哥伦比亚" />
            <el-option value="MLC" label="智利" />
          </el-select>
        </el-form-item>
        <el-form-item
          :required="formData.saleSiteList.includes('MLB')"
          label="巴西站点listing type"
          prop="listingType"
        >
          <el-select
            v-model="formData.listingType"
            :disabled="!formData.saleSiteList.includes('MLB')"
          >
            <el-option value="gold_special" label="Classic" />
            <el-option value="gold_pro" label="Premium" />
          </el-select>
        </el-form-item>
        <!-- 类目 -->
        <el-form-item label="平台类目" prop="categoryIdList">
          <z-cascader
            v-model="formData.categoryIdList"
            :show-all="true"
            :data="initList.merList"
            :props="{
              label: 'name',
              value: 'oaCategoryId',
              children: 'childList'
            }"
          ></z-cascader>
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
              optionList: initList.logisAttrEnums,
              value: 'name',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item label="商品归属人" prop="bizzOwnerIdList">
          <el-input
            v-model="formData.bizzOwnerIdList"
            :rows="2"
            type="textarea"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="美客多模板创建时间" prop="listingDays">
          <el-input-number
            v-model="formData.listingDays"
            :precision="0"
            :min="0"
            :step="1"
            placeholder="请输入"
          />
          <div class="ml10">天内</div>
        </el-form-item>
        <el-form-item label="成本(RMB)" prop="costMin">
          <el-input-number
            v-model="formData.costMin"
            :min="0"
            placeholder="大于等于"
          /><span class="divide-line">-</span>
          <el-input-number v-model="formData.costMax" placeholder="小于等于" />
        </el-form-item>
        <el-form-item label="重量(克)" prop="weightMin">
          <el-input-number
            v-model="formData.weightMin"
            :min="0"
            placeholder="大于等于"
          /><span class="divide-line">-</span>
          <el-input-number
            v-model="formData.weightMax"
            placeholder="小于等于"
          />
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
        <el-form-item label="获取数据顺序" prop="orderField">
          <el-select v-model="formData.orderField">
            <el-option
              v-for="item in ORDER_FIELD"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="默认条件">
          <p>
            禁售状态=未禁售，在售状态：仅过滤停售且预计可用库存含在途小于等于0的sku，侵权状态=任一平台不侵权，店铺刊登状态=未刊登，店铺生成状态=未生成
          </p>
        </el-form-item>
        <el-form-item label="商品类型" prop="multiSub">
          <el-select v-model="formData.multiSub" clearable>
            <el-option :value="false" label="单属性" />
            <el-option :value="true" label="多属性" />
          </el-select>
        </el-form-item>
        <el-form-item label="开发类型" prop="devType">
          <MultiSelect
            v-model="formData.devType"
            :option-obj="{
              optionList: initList.devTypeEnums,
              value: 'name',
              label: 'name'
            }"
          />
        </el-form-item>
        <el-form-item label="刊登方式" prop="ruleType">
          <el-radio-group v-model="formData.ruleType" @change="ruleTypeChange">
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
  import { ref, watch, computed } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import {
    getMercadoAutoListingRuleById,
    updateMercadoAutoListingRule,
    insertMercadoAutoListingRule
  } from '@/api/publishs/mercadopublishrules';
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
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

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

  const saleSiteListChange = () => {
    if (formData.value.saleSiteList.includes('MLB')) {
      formData.value.listingType = 'gold_special';
    }
  };

  const formData = ref({
    status: true,
    saleSiteList: [],
    listingType: 'gold_special',
    devType: [],
    logisAttrList: [],
    prodAttrList: [],
    preAvailableStockType: 1
  });
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
    const { categoryIdList } = formData.value;
    if (!categoryIdList || !categoryIdList.length) {
      callback(new Error('美客多类目不能为空'));
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
    saleSiteList: {
      required: true,
      trigger: 'change',
      message: '请选择站点'
    },
    categoryIdList: {
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
        if (props.checkedRow.id) {
          try {
            const { data } = await getMercadoAutoListingRuleById(
              props.checkedRow.id
            );
            formData.value = data;
            formData.value.saleSiteList = data.saleSites.split(',');
            formData.value.executionWeekTime = data.executionWeekTime
              .split(',')
              .map(Number);
            formData.value.prodAttrList = data.prodAttrList
              ? data.prodAttrList.split(',')
              : [];
            formData.value.logisAttrList = data.logisAttrList
              ? data.logisAttrList.split(',')
              : [];
            formData.value.devType = data.devType
              ? data.devType.split(',')
              : [];
            // 预计可用库存
            formData.value.preAvailableStockType = 1;
            if (data.expectedStockOnway != undefined) {
              formData.value.preAvailableStockNum = data.expectedStockOnway;
            }
            if (data.expectedStockExway != undefined) {
              formData.value.preAvailableStockType = 2;
              formData.value.preAvailableStockNum = data.expectedStockExway;
            }
            // 类目。
            formData.value.categoryIdList = data.categoryIdList
              .split(',')
              .map(Number);
          } catch (err) {
            console.log('err :>> ', err);
          }
        } else {
          formRef.value?.resetFields();
          formData.value.id = '';
          formData.value.thirtySalesEnd = '';
          formData.value.costMax = '';
          formData.value.weightMax = '';
        }
      } else {
        if (needFresh.value) {
          emits('handleSearch');
          needFresh.value = false;
        }
      }
    }
  );
  // 刊登方式
  const ruleTypeChange = () => {
    if (formData.value.ruleType == 2) {
      formData.value.listingTemplateNum = '';
      formData.value.listingStoreNum = '';
      formData.value.listingMaxNum = '';
    }
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
            res = await insertMercadoAutoListingRule(params);
          } else {
            res = await updateMercadoAutoListingRule(params);
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
    if (params.categoryIdList) {
      params.categoryIdList = params.categoryIdList.join();
    }
    // if (params.categoryIdList) {
    //   let newData = params.categoryIdList
    //     .map((item) => {
    //       if (Array.isArray(item)) {
    //         return item.join();
    //       }
    //       return item;
    //     })
    //     .join();
    //   let newArr = Array.from(new Set(newData.split(',')));
    //   params.categoryIdList = newArr
    //     .map((item) => item.replace('CBT', ''))
    //     .join();
    // }
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
    if (params.saleSiteList) {
      params.saleSites = params.saleSiteList.join(',');
    }

    // 预计可用库存含在途大于
    if (params.preAvailableStockType) {
      if (params.preAvailableStockType == 1) {
        params.expectedStockOnway = params.preAvailableStockNum;
        params.expectedStockExway = '';
      }
      if (params.preAvailableStockType == 2) {
        params.expectedStockExway = params.preAvailableStockNum;
        params.expectedStockOnway = '';
      }
    }
    if (!params.saleSiteList.includes('MLB')) {
      params.listingType = 'gold_special';
    }
    for (let key in params) {
      if (params[key] == null) {
        params[key] = '';
      }
    }
    return params;
  };
</script>
<style lang="scss" scoped>
  .rules_form {
    .el-select {
      width: 215px;
    }
  }
</style>
