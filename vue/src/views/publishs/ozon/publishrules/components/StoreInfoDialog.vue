<template>
  <div class="">
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :width="620"
      :align-center="true"
      :close-on-click-modal="storeInfo.type === 'view' ? true : false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :label-width="120"
        :rules="formRule"
        size="default"
      >
        <el-form-item label="店铺名" prop="storeAcctIdList">
          <ZSelect
            v-if="storeInfo.type === 'add'"
            v-model="formData.storeAcctIdList"
            :items="storeAcctList"
          />
          <div>{{ formData.storeAcct }}</div>
        </el-form-item>
        <el-form-item label="在线库存" prop="stock">
          <div>{{ formData.stock }}</div>
        </el-form-item>
        <el-form-item label="每天刊登量" prop="dailyPublishNums">
          <el-input-number
            v-model="formData.dailyPublishNums"
            :precision="0"
            :min="1"
            :step="1"
            :max="500"
          />
          <span class="ml10">大于0，小于等于500</span>
        </el-form-item>

        <el-form-item label="上架开始时间" prop="publishTime">
          <el-select v-model="formData.publishTime">
            <el-option
              v-for="item in PublishTimeList"
              :key="item"
              :value="item"
              :label="item + '点'"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上架间隔时间" prop="publishInterval">
          <el-select v-model="formData.publishInterval">
            <el-option
              v-for="item in PublishIntervalList"
              :key="item"
              :value="item"
              :label="item + '分钟'"
            />
          </el-select>
          <span class="ml10">刊登量 x 间隔时间 必须小于 1200</span>
        </el-form-item>
      </el-form>
      <template v-if="storeInfo.type !== 'view'" #footer>
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
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import {
    addRuleShopApi,
    editRuleShopApi,
    getAllStoreListApi,
    getOzonAutoListingRuleStoreById
  } from '@/api/publishs/ozonpublishrules';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import ZSelect from '@/components/ZSelect/index.vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    storeInfo: {
      type: Object,
      default: () => ({})
    },
    ruleObj: {
      type: Object,
      default: () => ({})
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleStoreSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const title = computed(() => {
    if (props.storeInfo.type === 'edit') {
      return '编辑';
    } else if (props.storeInfo.type === 'view') {
      return '查看';
    }
    return '新增';
  });

  const PublishTimeList = new Array(24).fill().map((_, index) => index + 1);
  const PublishIntervalList = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30];

  const formData = ref({});

  // #region 校验
  const formRef = ref();
  const validateDailyPublishNums = (rule, value, callback) => {
    const { publishInterval } = formData.value;
    if (value === undefined || value === null) {
      callback(new Error('请输入每天刊登量'));
    } else if (value > 500) {
      callback(new Error('大于0，小于等于500'));
    } else if (publishInterval * value >= 1200) {
      callback(new Error('刊登量 x 间隔时间 必须小于 1200'));
    } else {
      callback();
    }
  };
  const validatePublishInterval = (rule, value, callback) => {
    const { dailyPublishNums } = formData.value;
    if (dailyPublishNums * value >= 1200) {
      callback(new Error('刊登量 x 间隔时间 必须小于 1200'));
    } else {
      callback();
    }
  };
  const validateStoreAcctIdList = (rule, value, callback) => {
    if (props.storeInfo.type === 'add') {
      if (!value) {
        callback(new Error('请选择店铺'));
      } else if (!value.length) {
        callback(new Error('请选择店铺'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  const formRule = ref({
    storeAcctIdList: [
      {
        required: true,
        trigger: 'change',
        validator: validateStoreAcctIdList
      }
    ],
    dailyPublishNums: {
      required: true,
      trigger: 'blur',
      validator: validateDailyPublishNums
    },
    publishTime: {
      required: true,
      trigger: 'change',
      message: '请选择上架开始事件'
    },
    publishInterval: {
      required: true,
      trigger: 'change',
      validator: validatePublishInterval
    }
  });

  //#endregion 校验

  const needFresh = ref(false);
  const storeAcctList = ref([]);

  onMounted(async () => {
    console.log(555);
    console.log(props.storeInfo);
    formData.value = {
      ...props.storeInfo.rowData
    };
    const { data } = await getAllStoreListApi();
    if (props.storeInfo.type === 'add') {
      // 获取站点对应的店铺
      storeAcctList.value = (data || []).map((item) => ({
        ...item,
        name: item.storeAcct
      }));
      //     .filter((item) => props.ruleObj.salesSiteList.includes(item.salesSite));
    } else {
      const { data } = await getOzonAutoListingRuleStoreById(formData.value.id);
      console.log(data);
    }
  });
  onUnmounted(() => {
    if (needFresh.value) {
      emits('handleStoreSearch');
    }
  });
  const saveLoading = ref(false);
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        saveLoading.value = true;
        try {
          let res = null;
          if (props.storeInfo.type === 'edit') {
            res = await editRuleShopApi([formData.value]);
          } else {
            let storeNameList = storeAcctList.value
              .filter((item) =>
                formData.value['storeAcctIdList'].includes(item.id)
              )
              .map((item) => item.name);
            formData.value['storeAccts'] = storeNameList.join(',');
            res = await addRuleShopApi({
              ...formData.value,
              ruleId: props.ruleObj.id
            });
          }
          ElMessage.success(res.msg);
          // 没有添加成功的
          const failList = (res.data || []).filter(
            (item) => item.msg !== '添加成功!'
          );
          if (failList.length) {
            const errMsg = failList
              .map((item) => item.storeAcct + ':' + item.msg)
              .join(';');
            ElMessageBox.alert(errMsg || '请求失败', '添加失败', {
              confirmButtonText: '确认',
              type: 'error',
              dangerouslyUseHTMLString: true
            });
          }
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
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
