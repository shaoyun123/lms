<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="1000"
    :close-on-click-modal="false"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120"
      size="default"
      class="dialog_form"
    >
      <el-form-item label="在线listing标签" prop="listingTagId">
        <el-select
          v-model="formData.listingTagId"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option
            v-for="item in tagList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="item.disabled"
          >
          </el-option
        ></el-select>
      </el-form-item>
      <el-form-item label="配置对象" prop="processingType">
        <el-select
          v-model="formData.processingType"
          placeholder="请选择配置对象"
          filterable
          @change="handleChangeProcessingType"
        >
          <el-option
            v-for="item in initList.processingTypeList"
            :key="item.code"
            :label="item.desc"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签操作" prop="type">
        <el-select
          v-model="formData.type"
          placeholder="请选择标签操作"
          filterable
          @change="handleChangeType"
        >
          <el-option
            v-for="item in initList.typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="标签条件"
        prop="triggerConditionType"
        class="listing-tag-condition"
      >
        <!-- 触发来源 -->
        <el-select
          v-model="formData.triggerConditionType"
          placeholder="请选择"
          filterable
          @change="handleChangeTriggerConditionType"
        >
          <template
            v-for="item in initList.triggerConditionTypeList"
            :key="item.code"
          >
            <el-option
              v-if="item.code === 3 && formData.type === 0"
              :label="item.desc"
              :value="item.code"
            /><el-option
              v-else-if="item.code !== 3"
              :label="item.desc"
              :value="item.code"
            />
          </template>
        </el-select>
        <!-- 逻辑判断 -->
        <el-select
          v-model="formData.conditionInclude"
          placeholder="请选择"
          filterable
          class="w100"
          @change="handleConditionInclude"
        >
          <el-option label="包含" :value="true"></el-option>
          <el-option
            v-if="formData.triggerConditionType == 0"
            label="不包含"
            :value="false"
          ></el-option>
        </el-select>
        <!-- 条件值 -->
        <el-select
          v-if="formData.triggerConditionType === 0"
          v-model="formData.conditionListingFilterCodeList"
          :multiple-limit="formData.conditionInclude ? 9999 : 1"
          class="multi-select"
          clearable
          multiple
          filterable
          collapse-tags
        >
          <el-option
            v-for="item in initList.prodFilterListingTypeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
        <el-input
          v-else-if="formData.triggerConditionType === 1"
          v-model="formData.conditionLogText"
          style="flex: 1"
          clearable
        />
        <el-select
          v-else-if="formData.triggerConditionType === 2"
          v-model="formData.autoAdjustPriceLogCodeList"
          class="multi-select"
          clearable
          multiple
          filterable
          collapse-tags
        >
          <el-option
            v-for="item in initList.autoAdjustPriceLogEnum"
            :key="item.code"
            :label="item.desc"
            :value="item.code"
          >
          </el-option>
        </el-select>
        <el-select
          v-else-if="formData.triggerConditionType === 3"
          v-model="formData.developmentNoticeTypeList"
          clearable
          multiple
          filterable
          collapse-tags
        >
          <el-option
            v-for="item in initList.developDictList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="showIsFilterNoSku"
        label="是否过滤无SKU"
        prop="isFilterNoSku"
      >
        <el-radio-group v-model="formData.isFilterNoSku" class="ml-4">
          <el-radio :value="true">是</el-radio>
          <el-radio :value="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规则状态" prop="status">
        <el-radio-group v-model="formData.status" class="ml-4">
          <el-radio :value="true">开启</el-radio>
          <el-radio :value="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-text type="danger"
          >日志结果添加逻辑：当最新一条满足条件时触发，每条日志仅触发一次标签操作</el-text
        >
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { saveApi } from '@/api/shopee/autosetlistingtag';
  import { ElMessage } from 'element-plus';
  import { cloneDeep } from 'lodash-es';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    checkedRow: {
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

  const title = computed(() =>
    props.type === 'add' ? '新增自动标签配置' : '编辑自动标签配置'
  );

  const formData = ref({
    processingType: 0, // 配置对象 默认product
    type: 0, // 标签操作 默认添加标签
    status: true, // 规则状态 默认开启
    isFilterNoSku: true // 是否过滤无SKU 默认是
  });
  const formRef = ref();

  const tagList = ref([]);
  onMounted(() => {
    const { tagList: oldTagList } = props.initList;
    tagList.value = cloneDeep(oldTagList);
    if (props.type !== 'add') {
      formData.value = cloneDeep(props.checkedRow);
      //
      const { listingTagId } = props.checkedRow;
      const isExist = oldTagList.some((item) => item.id === listingTagId);
      if (!isExist) {
        tagList.value.push({
          id: listingTagId,
          name: '标签已删除!',
          disabled: true
        });
      }
    }
  });

  // #region 校验
  const validateIsFilterNoSku = (rule, value, callback) => {
    const { processingType } = formData.value;
    if (processingType === 1) {
      if (value === undefined || value === null) {
        callback(new Error('请选择是否过滤无SKU'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const validateTriggerCondition = (rule, value, callback) => {
    const {
      conditionInclude,
      triggerConditionType,
      conditionListingFilterCodeList,
      conditionLogText,
      autoAdjustPriceLogCodeList,
      developmentNoticeTypeList
    } = formData.value;
    if (value === undefined || value === null) {
      callback(new Error('请将标签条件填写完整'));
    } else if (conditionInclude === undefined || conditionInclude === null) {
      callback(new Error('请将标签条件填写完整'));
    } else if (
      triggerConditionType === 0 &&
      !conditionListingFilterCodeList?.length
    ) {
      callback(new Error('请将标签条件填写完整'));
    } else if (triggerConditionType === 1 && !conditionLogText) {
      callback(new Error('请将标签条件填写完整'));
    } else if (
      triggerConditionType === 2 &&
      !autoAdjustPriceLogCodeList?.length
    ) {
      callback(new Error('请将标签条件填写完整'));
    } else if (
      triggerConditionType === 3 &&
      !developmentNoticeTypeList?.length
    ) {
      callback(new Error('请将标签条件填写完整'));
    } else {
      callback();
    }
  };
  const rules = reactive({
    listingTagId: [
      { required: true, trigger: 'change', message: '请选择listing标签' }
    ],
    processingType: [
      { required: true, trigger: 'change', message: '请选择配置对象' }
    ],
    type: [{ required: true, trigger: 'change', message: '请选择标签操作' }],
    triggerConditionType: [
      { required: true, trigger: 'change', validator: validateTriggerCondition }
    ],
    isFilterNoSku: [
      {
        required: true,
        trigger: 'change',
        validator: validateIsFilterNoSku
      }
    ],
    status: [{ required: true, trigger: 'change', message: '请选择规则状态' }]
  });
  // #endregion 校验

  // #region 联动
  // 不展示过滤sku
  const showIsFilterNoSku = computed(() => {
    const { processingType, triggerConditionType } = formData.value;
    if (processingType === 1 && triggerConditionType === 1) {
      return true;
    }
    return false;
  });
  const handleChangeProcessingType = (val) => {
    // 是否过滤无SKU 设置默认值 是
    if (val === 1) {
      formData.value.isFilterNoSku = true;
      // 当配置对象选择variation&product时，该选项仅支持选择[不处理类型]、[日志结果]、[variation自动调价失败日志]、[开发通知]
      // 当前触发来源仅有这四个，故不作判断
    }
  };
  const handleChangeType = () => {
    // 开发通知仅支持选择添加标签
    if (
      formData.value.type === 1 &&
      formData.value?.triggerConditionType === 3
    ) {
      formData.value.triggerConditionType = null;
      formData.value.developmentNoticeTypeList = null;
    }
  };
  const handleChangeTriggerConditionType = () => {
    // [日志结果]、[variation自动调价失败日志]、[开发通知]时，当前下拉框仅显示包含选项，且仅支持选中包含；
    const { triggerConditionType, conditionInclude } = formData.value;
    if (
      [1, 2, 3].includes(triggerConditionType) &&
      conditionInclude === false
    ) {
      formData.value.conditionInclude = true;
    }

    // 通过触发来源将部分数据置空
    const emptyList = [
      {
        triggerConditionType: 0,
        list: [
          'conditionLogText',
          'autoAdjustPriceLogCodeList',
          'developmentNoticeTypeList'
        ]
      },
      {
        triggerConditionType: 1,
        list: [
          'conditionListingFilterCodeList',
          'autoAdjustPriceLogCodeList',
          'developmentNoticeTypeList'
        ]
      },
      {
        triggerConditionType: 2,
        list: [
          'conditionLogText',
          'conditionListingFilterCodeList',
          'developmentNoticeTypeList'
        ]
      },
      {
        triggerConditionType: 3,
        list: [
          'conditionLogText',
          'conditionListingFilterCodeList',
          'autoAdjustPriceLogCodeList'
        ]
      }
    ];

    // 置空
    emptyList.forEach((v) => {
      if (triggerConditionType === v.triggerConditionType) {
        v.list.forEach((elem) => {
          if (formData.value[elem]) {
            formData.value[elem] = null;
          }
        });
      }
    });
  };

  const handleConditionInclude = () => {
    // 触发来源选择不处理类型时，该项为下拉框，必选项，:逻辑判断为包含时支持多选，:逻辑判断为不包含时仅支持单选
    const {
      triggerConditionType,
      conditionInclude,
      conditionListingFilterCodeList
    } = formData.value;
    if (triggerConditionType === 0) {
      if (!conditionInclude && conditionListingFilterCodeList.length > 1) {
        formData.value.conditionListingFilterCodeList = [];
      }
    }
  };
  // #endregion 联动

  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        const params = { ...formData.value };
        if (!showIsFilterNoSku.value) {
          params.isFilterNoSku = null;
        }
        if (params.autoAdjustPriceLogEnumList) {
          delete params.autoAdjustPriceLogEnumList;
        }
        if (params.filterTypes) {
          delete params.filterTypes;
        }
        try {
          const { msg } = await saveApi(params);
          dialogVisible.value = false;
          ElMessage.success(msg);
          emits('handleSearch');
        } catch (err) {
          console.log('err :>> ', err);
        }
      } else {
        console.log('error submit!', fields);
      }
    });
  };
</script>

<style lang="scss" scoped>
  .w100 {
    width: 100px;
  }
  .listing-tag-condition {
    .multi-select {
      :deep(.el-select__tags-text) {
        max-width: 300px !important;
      }
      :deep(.el-input--suffix) {
        width: 460px;
      }
    }
  }
</style>
