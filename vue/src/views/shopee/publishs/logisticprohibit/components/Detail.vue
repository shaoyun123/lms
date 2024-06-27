<template>
  <el-dialog
    v-model="dialogVisible"
    :title="configobj[type].title"
    :width="800"
    :close-on-click-modal="false"
    :align-center="true"
    :destroy-on-close="false"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :label-width="150"
      :rules="formRules"
      class="detail-form"
    >
      <el-form-item label="站点" prop="salesSite">
        <el-select
          v-model="formData.salesSite"
          filterable
          :disabled="type === 'edit'"
          @change="handleChangeSite"
        >
          <el-option
            v-for="item in initList.siteList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
        /></el-select>
      </el-form-item>
      <el-form-item label="物流名称（ID）" prop="logisticsChannelId">
        <el-select
          v-model="formData.logisticsChannelId"
          filterable
          :disabled="type === 'edit'"
        >
          <el-option
            v-for="item in logisticsChannelList"
            :key="item.logisticsChannelId"
            :label="item.logisticsChannelNameAndLogisticsId"
            :value="item.logisticsChannelId"
        /></el-select>
      </el-form-item>
      <el-form-item label="校验值" prop="prohibitType">
        <el-select
          v-model="formData.prohibitType"
          filterable
          :disabled="type === 'edit'"
        >
          <el-option
            v-for="item in ConstantObj.prohibitTypeList"
            :key="item"
            :label="item"
            :value="item"
        /></el-select>
      </el-form-item>
      <template v-if="isCnscCategory">
        <el-form-item
          v-if="type === 'add'"
          label="CNSC类目（ID）"
          prop="categoryIdList"
          :required="type === 'add' && isCnscCategory"
        >
          <ZCascader v-model="formData.categoryIdList" :data="cnscList" />
        </el-form-item>
        <el-form-item
          v-else
          label="CNSC类目（ID）"
          prop="categoryId"
          :required="type === 'edit' && isCnscCategory"
        >
          <el-cascader
            v-model="formData.categoryId"
            :options="cnscList"
            show-all-levels
            collapse-tags
            filterable
            :props="{ emitPath: false }"
          />
        </el-form-item>
      </template>
      <template v-else-if="isOuterBoxPacking">
        <el-form-item
          prop="outerBoxPackingConditionList"
          :required="isOuterBoxPacking"
        >
          <template #label>
            <div class="label-center">
              <el-tooltip
                effect="dark"
                placement="top-start"
                content="外箱包装校验至子sku级别，存在子sku满足条件则商品满足禁用条件"
              >
                <el-icon size="17" :color="primaryColor">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              外箱包装
            </div>
          </template>
          <div
            v-for="(item, index) in formData.outerBoxPackingConditionList"
            :key="item + index"
            class="outerbox-item"
          >
            <el-form-item
              :prop="'outerBoxPackingConditionList.' + index + '.target'"
              :rules="[{ validator: validateTarget, trigger: 'change' }]"
            >
              <el-select
                v-model="item.target"
                filterable
                clearable
                style="width: 150px"
              >
                <el-option
                  v-for="v in ConstantObj.targetList"
                  :key="v"
                  :value="v"
                  :label="v"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :prop="'outerBoxPackingConditionList.' + index + '.operator'"
              :rules="[{ validator: validateOperator, trigger: 'change' }]"
            >
              <el-select
                v-model="item.operator"
                filterable
                clearable
                class="ml10"
                style="width: 80px"
              >
                <el-option
                  v-for="v in ConstantObj.operatorList"
                  :key="v"
                  :value="v"
                  :label="v"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :prop="'outerBoxPackingConditionList.' + index + '.value'"
              :rules="[{ validator: validateValue, trigger: 'blur' }]"
            >
              <ZInputNumber
                v-model="item.value"
                :min="0"
                :precision="99"
                class="ml10"
              />
            </el-form-item>
            <el-button
              type="primary"
              :icon="Plus"
              circle
              class="ml10"
              @click="handleAddOuterBox(index)"
            />
            <el-button
              v-if="formData.outerBoxPackingConditionList.length > 1"
              type="danger"
              :icon="Minus"
              circle
              @click="handleDelOuterBox(index)"
            />
          </div>
        </el-form-item>
      </template>
      <template v-else-if="isSoldDays">
        <el-form-item prop="minDailySaleDays" :required="isSoldDays">
          <template #label>
            <div class="label-center">
              <el-tooltip
                effect="dark"
                placement="top-start"
                content="可售天数=预计可用库存(不含在途) / 日均销量"
              >
                <el-icon size="17" :color="primaryColor">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              可售天数
            </div>
          </template>
          <div>
            <div style="display: flex">
              <span style="padding: 0 10px">≤</span>
              <el-input
                v-model="formData.minDailySaleDays"
                type="number"
                placeholder="请填写可售天数"
              ></el-input>
            </div>
            <span style="color: red; padding-top: 10px"
              >当listing的预计可售天数小于等于指定值时，禁用指定物流</span
            >
          </div>
        </el-form-item>
      </template>
      <template v-else-if="isLogisAttr">
        <el-form-item prop="logisAttrList" :required="isLogisAttr">
          <template #label>
            <div class="label-center">
              <el-tooltip
                effect="dark"
                content="多选时为“或”逻辑"
                placement="top-start"
              >
                <el-icon size="17" :color="primaryColor">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
              物流属性
            </div>
          </template>
          <ZSelect v-model="formData.logisAttrList" :items="logisAttrEnums" />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, computed, reactive, onMounted } from 'vue';
  import ConstantObj from '../constant';
  import {
    getLogisticChanelBySalesSiteApi,
    addNewApi,
    updateApi
  } from '@/api/shopee/logisticprohibit';
  import { manageListApi } from '@/api/shopee/publishrules';
  import { queryCnscCategoryApi } from '@/api/shopee/common';
  import { cloneDeep, isEmpty } from 'lodash-es';
  import ZSelect from '@/components/ZSelect/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { Plus, Minus, QuestionFilled } from '@element-plus/icons-vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { ElMessage } from 'element-plus';
  import { primaryColor } from '@/styles/vars.module.scss';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => ({})
    },
    initList: {
      type: Object,
      default: () => ({})
    }
  });

  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  onMounted(() => {
    const { detail } = props;
    Promise.all([manageListApi(), queryCnscCategoryApi()]).then((res) => {
      logisAttrEnums.value = (res[0].data?.logisAttrEnums || []).map((v) => ({
        id: v,
        name: v
      }));
      cnscList.value = res[1].data;
    });
    if (!isEmpty(detail)) {
      type.value = 'edit';
      const _detail = cloneDeep(detail);
      formData.value = _detail;
      if (isLogisAttr.value) {
        formData.value.logisAttrList = _detail.logisAttrList.split(',');
      }
      handleChangeSite();
    } else {
      // 赋默认值
      formData.value.prohibitType = 'CNSC类目';
    }
  });
  const type = ref('add');
  const configobj = {
    edit: {
      title: '编辑物流规则',
      saveBtnApi: updateApi
    },
    add: {
      title: '新增物流规则',
      saveBtnApi: addNewApi
    }
  };
  const cnscList = ref([]);
  const logisAttrEnums = ref([]);
  const formRef = ref();
  const formData = ref({ outerBoxPackingConditionList: [{}] });
  // #region 校验
  const validateCate = (rule, value, callback) => {
    if (isCnscCategory.value) {
      if (type.value === 'edit' && !value) {
        callback(new Error('请选择CNSC类目'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const validateMultiCate = (rule, value, callback) => {
    if (isCnscCategory.value) {
      if (type.value === 'add' && !value?.length) {
        callback(new Error('请选择CNSC类目'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const validateTarget = (rule, value, callback) => {
    if (isOuterBoxPacking.value && !value) {
      callback(new Error('请将外箱包装数据填写完整'));
    } else {
      callback();
    }
  };
  const validateOperator = (rule, value, callback) => {
    if (isOuterBoxPacking.value && !value) {
      callback(new Error('请将外箱包装数据填写完整'));
    } else {
      callback();
    }
  };
  const validateValue = (rule, value, callback) => {
    if (isOuterBoxPacking.value && !value) {
      callback(new Error('请将外箱包装数据填写完整'));
    } else {
      callback();
    }
  };
  const validateOuterBox = (rule, value, callback) => {
    if (isOuterBoxPacking.value) {
      // 校验重复
      const arrStrList = value.map(
        (item) => item.target + item.operator + item.value
      );
      if ([...new Set(arrStrList)].length !== value.length) {
        callback(new Error('外箱包装数据存在重复'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const validateLogisAttrList = (rule, value, callback) => {
    if (isLogisAttr.value && !value?.length) {
      callback(new Error('请选择物流属性'));
    } else {
      callback();
    }
  };
  const validateSaleDay = (rule, value, callback) => {
    if (isSoldDays.value && !value) {
      callback(new Error('请填写可售天数'));
    } else if (isSoldDays.value && !/^\d+$/.test(value)) {
      callback(new Error('可售天数必须为整数'));
    } else {
      callback();
    }
  };
  const formRules = reactive({
    salesSite: [{ required: true, message: '请选择站点', trigger: 'change' }],
    logisticsChannelId: [
      { required: true, message: '请选择物流名称（ID）', trigger: 'change' }
    ],
    prohibitType: [
      { required: true, message: '请选择校验值', trigger: 'change' }
    ],
    minDailySaleDays: [
      {
        required: true,
        validator: validateSaleDay,
        trigger: 'change'
      }
    ],
    categoryIdList: [
      { validator: validateMultiCate, trigger: 'change' },
      { validator: validateMultiCate, trigger: 'blur' }
    ],
    categoryId: [
      { validator: validateCate, trigger: 'change' },
      { validator: validateCate, trigger: 'blur' }
    ],
    outerBoxPackingConditionList: [
      { validator: validateOuterBox, trigger: 'change' }
    ],
    logisAttrList: [
      { validator: validateLogisAttrList, trigger: 'change' },
      { validator: validateLogisAttrList, trigger: 'blur' }
    ]
  });
  //   #endregion 校验

  const isCnscCategory = computed(
    () => formData.value.prohibitType === 'CNSC类目'
  );
  const isOuterBoxPacking = computed(
    () => formData.value.prohibitType === '外箱包装'
  );
  const isSoldDays = computed(() => formData.value.prohibitType === '可售天数');
  const isLogisAttr = computed(
    () => formData.value.prohibitType === '物流属性'
  );

  const logisticsChannelList = ref([]);
  const handleChangeSite = async () => {
    try {
      const { data = [] } = await getLogisticChanelBySalesSiteApi(
        formData.value.salesSite
      );
      logisticsChannelList.value = data;
    } catch (err) {
      logisticsChannelList.value = [];
    }
  };
  const handleAddOuterBox = (index) => {
    formData.value.outerBoxPackingConditionList.splice(index + 1, 0, {
      operator: null,
      target: null,
      value: null
    });
  };
  const handleDelOuterBox = (index) => {
    formData.value.outerBoxPackingConditionList.splice(index, 1);
  };

  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const {
          prohibitType,
          categoryIdList,
          logisAttrList,
          outerBoxPackingConditionList,
          categoryId,
          salesSite,
          logisticsChannelId
        } = formData.value;
        const params = {
          salesSite,
          logisticsChannelId,
          prohibitType
        };
        if (isLogisAttr.value) {
          params.logisAttrList = logisAttrList.join(',');
        } else if (isCnscCategory.value) {
          if (type.value === 'add') {
            params.categoryIdList = categoryIdList;
          } else {
            params.categoryId = categoryId;
          }
        } else if (isOuterBoxPacking.value) {
          params.outerBoxPackingConditionList = outerBoxPackingConditionList;
        } else if (isSoldDays.value) {
          params.minDailySaleDays = formData.value.minDailySaleDays;
        }
        if (type.value === 'edit') {
          params.id = formData.value.id;
        }
        const { saveBtnApi } = configobj[type.value];
        await saveBtnApi(params);
        ElMessage.success(type.value === 'add' ? '新增成功' : '编辑成功');
        // 当查询条件存在值，才查询，，没有查询条件，后端会很慢，一分钟多
        // todo
        emits('handleSearch');
        dialogVisible.value = false;
      } else {
        return false;
      }
    });
  };
</script>

<style lang="scss" scoped>
  .detail-form {
    :deep(.z-select),
    :deep(.el-select) {
      width: 90%;
    }
    .el-form-item__content > div {
      width: 90%;
    }
    :deep(.el-cascader) {
      width: 90%;
    }
  }
  .outerbox-item {
    display: flex;
    margin-bottom: 18px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .label-center {
    display: flex;
    align-items: center;
  }
</style>
