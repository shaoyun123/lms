<template>
  <div class="fullDialog">
    <el-dialog
      :model-value="dialogVisible"
      title="listing自动删除设置"
      width="800px"
      destroy-on-close
      align-center
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120"
        size="default"
      >
        <el-form-item label="每日删除" prop="autoDelete">
          <el-radio-group v-model="formData.autoDelete">
            <el-radio :value="false">关闭</el-radio>
            <el-radio :value="true">开启</el-radio>
          </el-radio-group>
          <el-text type="info" class="ml10"
            >!针对未触发侵权或禁售的listing</el-text
          >
        </el-form-item>
        <el-form-item label="每天删除数量" prop="autoDeleteNum">
          <ZInputNumber
            v-model="formData.autoDeleteNum"
            class="w200"
            :precision="0"
            :max="500"
            :min="1"
            placeholder="仅支持输入正整数"
          />
          <el-text type="info" class="ml10"
            >(最大500,该数量不包含侵权与禁售)</el-text
          >
        </el-form-item>
        <el-form-item label="刊登时间" prop="autoDeleteGreatListingTime">
          <template #label>
            <div>
              <span v-if="!isBacth" class="required-tag">*</span> 刊登时间
            </div>
          </template>
          <el-radio-group v-model="formData.autoDeleteGreatListingTime">
            <el-radio :value="15">大于15</el-radio>
            <el-radio :value="30">大于30</el-radio>
            <el-radio :value="50">大于50</el-radio>
            <el-radio :value="60">大于60</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <template #label>
            <div>
              <span v-if="!isBacth" class="required-tag">*</span> 销量校验
            </div>
          </template>
          <el-form-item prop="autoDeleteSalesType">
            <el-select
              v-model="formData.autoDeleteSalesType"
              clearable
              filterable
              class="w200"
            >
              <el-option label="30天销量=0" :value="1"></el-option>
              <el-option label="60天销量=0" :value="2"></el-option>
              <el-option label="90天销量=0" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="historySalesType" class="ml10">
            <el-select
              v-model="formData.historySalesType"
              clearable
              filterable
              class="w200"
            >
              <el-option label="历史销量大于0不删除" :value="1"></el-option>
              <el-option label="历史销量大于0删除" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="listing浏览量<" prop="autoDeleteViewLt">
          <ZInputNumber
            v-model="formData.autoDeleteViewLt"
            :precision="0"
            :min="1"
            placeholder="非必填，支持填入正数"
          />
        </el-form-item>
        <el-form-item label="listing收藏量<" prop="autoDeleteLikeLt">
          <ZInputNumber
            v-model="formData.autoDeleteLikeLt"
            :precision="0"
            :min="1"
            placeholder="非必填，支持填入正数"
          />
        </el-form-item>
        <el-form-item label="侵权删除" prop="autoDeleteItemByTort">
          <el-radio-group v-model="formData.autoDeleteItemByTort">
            <el-radio :value="1">开启</el-radio>
            <el-radio :value="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="销量校验">
          <el-form-item prop="autoDeleteItemByTortSalesType">
            <el-select
              v-model="formData.autoDeleteItemByTortSalesType"
              :clearable="isBacth ? true : false"
              filterable
              class="w200"
            >
              <el-option label="7天销量" :value="7"></el-option>
              <el-option label="30天销量" :value="30"></el-option>
              <el-option label="60天销量" :value="60"></el-option>
              <el-option label="90天销量" :value="90"></el-option>
            </el-select>
          </el-form-item>
          <span class="ml10">≤</span>
          <el-form-item prop="autoDeleteItemByTortSalesLte" class="ml10">
            <ZInputNumber
              v-model="formData.autoDeleteItemByTortSalesLte"
              :precision="0"
              :min="0"
              :max="20"
              placeholder="仅支持[0,20]内整数"
            />
          </el-form-item>
          <div class="next-line-item">
            <el-form-item prop="deleteItemByTortIfHistorySalesGtZero">
              <el-select
                v-model="formData.deleteItemByTortIfHistorySalesGtZero"
                :clearable="isBacth ? true : false"
                filterable
                class="w200"
              >
                <el-option
                  label="历史销量大于0不删除"
                  :value="false"
                ></el-option>
                <el-option label="历史销量大于0删除" :value="true"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="禁售删除" prop="autoDeleteItemByProhibit">
          <el-radio-group v-model="formData.autoDeleteItemByProhibit">
            <el-radio :value="1">开启</el-radio>
            <el-radio :value="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="销量校验">
          <el-form-item prop="autoDeleteItemByProhibitSalesType">
            <el-select
              v-model="formData.autoDeleteItemByProhibitSalesType"
              :clearable="isBacth ? true : false"
              filterable
              class="w200"
            >
              <el-option label="7天销量" :value="7"></el-option>
              <el-option label="30天销量" :value="30"></el-option>
              <el-option label="60天销量" :value="60"></el-option>
              <el-option label="90天销量" :value="90"></el-option>
            </el-select>
          </el-form-item>
          <span class="ml10">≤</span>
          <el-form-item prop="autoDeleteItemByProhibitSalesLte" class="ml10">
            <ZInputNumber
              v-model="formData.autoDeleteItemByProhibitSalesLte"
              :precision="0"
              :min="0"
              :max="20"
              placeholder="仅支持[0,20]内整数"
            />
          </el-form-item>
          <div class="next-line-item">
            <el-form-item prop="deleteItemByProhibitIfHistorySalesGtZero">
              <el-select
                v-model="formData.deleteItemByProhibitIfHistorySalesGtZero"
                :clearable="isBacth ? true : false"
                filterable
                class="w200"
              >
                <el-option
                  label="历史销量大于0不删除"
                  :value="false"
                ></el-option>
                <el-option label="历史销量大于0删除" :value="true"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
        <el-button @click="closeDialog">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, reactive } from 'vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { setAutoDeleteOrPublishApi } from '@/api/configure/shopeeaccount';
  import { cloneDeep } from 'lodash-es';
  import { isEmptyNotObject } from '@/utils/validate';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    editInfo: {
      type: Object,
      default: () => ({})
    },
    selectRecords: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue', 'search']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const isBacth = computed(() => props.selectRecords.length);

  const closeDialog = () => {
    dialogVisible.value = false;
  };

  //   参数
  const paramNumList = [
    'autoDeleteNum',
    'autoDeleteGreatListingTime',
    'autoDeleteSalesType',
    'historySalesType',
    'autoDeleteViewLt',
    'autoDeleteLikeLt',
    'autoDeleteItemByTortSalesType',
    'autoDeleteItemByTortSalesLte',
    'autoDeleteItemByProhibitSalesType',
    'autoDeleteItemByProhibitSalesLte'
  ];
  const otherParamList = [
    'autoDelete',
    'autoDeleteItemByTort',
    'deleteItemByProhibitIfHistorySalesGtZero',
    'autoDeleteItemByProhibit',
    'deleteItemByTortIfHistorySalesGtZero'
  ];
  //   默认值
  const defaultValueObj = {
    autoDelete: true,
    autoDeleteItemByProhibit: 1,
    autoDeleteItemByTort: 1,
    autoDeleteItemByProhibitSalesType: 90,
    autoDeleteItemByTortSalesType: 90,
    autoDeleteItemByProhibitSalesLte: 0,
    autoDeleteItemByTortSalesLte: 0,
    deleteItemByTortIfHistorySalesGtZero: true,
    deleteItemByProhibitIfHistorySalesGtZero: false
  };
  onMounted(async () => {
    const defaultValueKeyList = Object.keys(defaultValueObj);
    if (!isBacth.value) {
      //   设置默认值
      defaultValueKeyList.forEach((v) => {
        formData.value[v] = defaultValueObj[v];
      });
      formData.value = cloneDeep(props.editInfo);
      [...paramNumList, ...otherParamList].forEach((v) => {
        formData.value[v] = props.editInfo[v];
        // string转num
        if (paramNumList.includes(v) && !isEmptyNotObject(props.editInfo[v])) {
          formData.value[v] = Number(props.editInfo[v]);
        }
      });
      console.log('formData.value :>> ', formData.value);
    }
  });

  const formRef = ref();
  const formData = ref({});
  // #region 校验
  //   刊登时间
  const validateAutoDeleteGreatListingTime = (rule, value, callback) => {
    if (!isBacth.value && isEmptyNotObject(value)) {
      callback(new Error('请选择刊登时间'));
    } else {
      callback();
    }
  };
  const validateRequiredValue = (rule, value, callback) => {
    if (!isBacth.value && isEmptyNotObject(value)) {
      callback(new Error('请将销量校验填写完整'));
    } else {
      callback();
    }
  };
  //  侵权删除相关
  const validateByTortSalesType = (rule, value, callback) => {
    const { autoDeleteItemByTort } = formData.value;
    if (autoDeleteItemByTort == 1 && isEmptyNotObject(value)) {
      callback(new Error('请将侵权删除的销量校验填写完整'));
    } else {
      callback();
    }
  };
  const validateAutoDeleteItemByTort = (rule, value, callback) => {
    const { autoDeleteItemByProhibit } = formData.value;
    if (autoDeleteItemByProhibit && isEmptyNotObject(value)) {
      callback(new Error('请选择是否开启侵权删除'));
    } else {
      callback();
    }
  };
  //  禁售删除相关
  const validateAutoDeleteItemByProhibit = (rule, value, callback) => {
    if (!isBacth.value && isEmptyNotObject(value)) {
      callback(new Error('请选择是否开启禁售删除'));
    } else {
      callback();
    }
  };
  const validateByProhibit = (rule, value, callback) => {
    const { autoDeleteItemByProhibit } = formData.value;
    if (autoDeleteItemByProhibit && isEmptyNotObject(value)) {
      callback(new Error('请将禁售删除的销量校验填写完整'));
    } else {
      callback();
    }
  };
  const formRules = reactive({
    autoDeleteGreatListingTime: [
      {
        validator: validateAutoDeleteGreatListingTime,
        trigger: 'change'
      }
    ],
    autoDeleteSalesType: [
      { validator: validateRequiredValue, trigger: 'change' }
    ],
    historySalesType: [{ validator: validateRequiredValue, trigger: 'change' }],
    autoDeleteItemByTort: [
      { validator: validateAutoDeleteItemByTort, trigger: 'change' }
    ],
    autoDeleteItemByTortSalesType: [
      { validator: validateByTortSalesType, trigger: 'blur' }
    ],
    autoDeleteItemByTortSalesLte: [
      { validator: validateByTortSalesType, trigger: 'blur' }
    ],
    deleteItemByTortIfHistorySalesGtZero: [
      { validator: validateByTortSalesType, trigger: 'blur' }
    ],
    autoDeleteItemByProhibit: [
      { validator: validateAutoDeleteItemByProhibit, trigger: 'change' }
    ],
    autoDeleteItemByProhibitSalesType: [
      { validator: validateByProhibit, trigger: 'blur' }
    ],
    autoDeleteItemByProhibitSalesLte: [
      { validator: validateByProhibit, trigger: 'blur' }
    ],
    deleteItemByProhibitIfHistorySalesGtZero: [
      { validator: validateByProhibit, trigger: 'blur' }
    ]
  });
  // #endregion 校验

  const getParams = () => {
    const { selectRecords } = props;
    const params = {
      platCode: 'shopee'
    };
    // storeAcctIdStr
    if (isBacth.value) {
      params.storeAcctIdStr = selectRecords.map((v) => v.id).join();
    } else {
      params.storeAcctIdStr = formData.value.id;
    }
    // 其他的参数
    [...paramNumList, ...otherParamList].forEach((v) => {
      params[v] = formData.value[v];
    });
    // 参数特殊处理
    if (isBacth.value) {
      // 删除没有value的key
      for (var key in params) {
        if (isEmptyNotObject(params[key])) delete params[key];
      }
    } else {
      // 没填写数据传0
      const zeroEmptyList = [
        'autoDeleteViewLt',
        'autoDeleteLikeLt'
        // 'autoDeleteNum'
      ];
      zeroEmptyList.forEach((v) => {
        if (!formData.value[v] && formData.value[v] !== 0) {
          params[v] = 0;
        }
      });
      params.autoDeleteNum = Number(params.autoDeleteNum);
    }
    return params;
  };

  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const params = getParams();
        const { msg } = await setAutoDeleteOrPublishApi(params);
        closeDialog();
        emits('search');
        ElMessage.success(msg);
      } else {
        console.log('error submit!');
        return false;
      }
    });
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .ml10 {
    margin-left: 10px;
  }
  .w200 {
    width: 200px;
  }

  .next-line-item {
    width: 100%;
    margin-top: 10px;
  }
</style>
