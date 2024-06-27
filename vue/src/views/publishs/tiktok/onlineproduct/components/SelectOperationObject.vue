<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      :width="800"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :model="form"
        label-width="20"
        class="operate-from"
        size="default"
      >
        <el-form-item prop="type">
          <el-radio-group v-model="form.type">
            <template
              v-for="item in flashSaleOperationTypeList"
              :key="item.sort"
            >
              <el-radio :value="item.sort">{{ item.name }}</el-radio>
              <el-form-item
                v-if="form.type === 2 && item.sort == 2"
                prop="storeAcctIdList"
                class="whole-cascader-width m10"
              >
                <z-cascader
                  v-model="form.storeAcctIdList"
                  :placeholder="placeholderRef"
                  :data="storeList"
                ></z-cascader>
              </el-form-item>
              <el-form-item
                v-if="form.type == 3 && item.sort == 3"
                prop="productIdList"
                class="whole-textarea-width m10"
              >
                <el-input
                  v-model="form.productIdList"
                  :rows="4"
                  type="textarea"
                  placeholder="请输入product_ID,多个用英文逗号隔开；最多支持输入5000个product_ID"
                  @blur="commonDivideCommaNum($event)"
                />
              </el-form-item>
            </template>
            <!-- <el-radio
                  v-for="item in flashSaleOperationTypeList"
                  :key="item.sort"
                  :label="item.sort"
                  >{{ item.name }}</el-radio
                > -->
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  // import { getFlashSaleEnumApi } from '@/api/publishs/tiktokonlineproduct';
  import { cloneDeep } from 'lodash-es';
  import { commonDivideCommaNum } from '@/utils/divide';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    storeList: {
      type: Object,
      default: () => ({})
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    },
    dialogValue: {
      type: String,
      default: ''
    },
    // 列表是否展示过滤后的sku
    onlyPassFilterSku: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits(['update:modelValue', 'getParams']);

  const placeholderRef = computed(() => {
    if (props.dialogValue === 'updateFirstWatermark') {
      return '店铺必选,且最多选择100个店铺';
    } else {
      return '店铺必选,且最多选择10个店铺';
    }
  });

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const form = reactive({
    type: 1
  });
  const ruleFormRef = ref();
  const validateStoreAcctIdList = (rule, value, callback) => {
    const { type, storeAcctIdList } = form;
    if (
      type == 2 &&
      props.dialogValue !== 'updateFirstWatermark' &&
      (storeAcctIdList.length > 10 || !storeAcctIdList.length)
    ) {
      callback(new Error('店铺必选,且最多10个'));
    } else if (
      type == 2 &&
      props.dialogValue === 'updateFirstWatermark' &&
      (storeAcctIdList.length > 100 || !storeAcctIdList.length)
    ) {
      callback(new Error('店铺必选,且最多100个'));
    } else {
      callback();
    }
  };
  const validateProductIdList = (rule, value, callback) => {
    const { type, productIdList } = form;
    const _productIdList = productIdList ? productIdList.split(',') : [];
    if (type == 3 && !_productIdList.length) {
      callback(new Error('请输入product_ID'));
    } else if (type === 3 && _productIdList.length > 5000) {
      callback(new Error('最多支持输入5000个product_ID'));
    } else {
      callback();
    }
  };
  const rules = reactive({
    storeAcctIdList: [
      {
        trigger: 'change',
        validator: validateStoreAcctIdList
      }
    ],
    productIdList: [{ trigger: 'blur', validator: validateProductIdList }]
  });

  const title = ref();
  const flashSaleOperationTypeList = ref([]);
  onMounted(async () => {
    // const { data } = await getFlashSaleEnumApi();
    flashSaleOperationTypeList.value = [
      {
        name: '操作列表选中数据',
        sort: 1
      },
      {
        name: '操作查询条件中全部数据',
        sort: 2
      },
      {
        name: '操作输入数据',
        sort: 3
      }
    ];
    const { rowCheckedList, formData, dialogValue } = props;
    const titleObj = {
      batchAddFlashSale: '添加listing秒杀',
      batchUpdateFlashSale: '修改listing秒杀',
      updateFirstWatermark: '更新首图水印',
      batchPromotion: '修改listing促销'
    };
    title.value = titleObj[dialogValue];
    if (rowCheckedList.length) {
      form.type = 1;
    } else {
      form.type = 2;
    }
    // 反显
    if (formData.storeAcctIdList?.length) {
      form.storeAcctIdList = cloneDeep(formData.storeAcctIdList);
    }
    // if (form.type == 2) {
    //   form.storeAcctIdList = cloneDeep(formData.storeAcctIdList);
    // }
  });

  // 获取子级的idList
  const getSkuIdList = (checkedList) => {
    let checkedSList = [];
    checkedList.forEach((item) => {
      checkedSList = checkedSList.concat(item.skuList);
    });
    return checkedSList.map((item) => item.skuId);
  };

  const handleConfirm = async (event) => {
    let formEl = ruleFormRef.value;
    event.stopPropagation();
    if (!formEl) return;
    formEl.validate(async (valid, fields) => {
      if (valid) {
        let params = {};
        const { rowCheckedList, formData } = props;
        if (form.type == 1) {
          if (!rowCheckedList.length)
            return ElMessage.warning('请选择查询列表数据');
          params.productIdList = rowCheckedList.map((v) => v.productId);
          params.skuIdList = getSkuIdList(rowCheckedList);
          params.storeAcctIdList = rowCheckedList.map((v) => v.storeAcctId);
          params.onlyPassFilterSku = props.onlyPassFilterSku;
        } else if (form.type == 2) {
          params = {
            ...formData,
            storeAcctIdList: form.storeAcctIdList,
            onlyPassFilterSku: props.onlyPassFilterSku
          };
        } else {
          params.productIdList = form.productIdList.split(',');
        }
        try {
          emits('getParams', {
            param: params,
            type: form.type,
            updateFirstWatermark:
              props.dialogValue === 'updateFirstWatermark' ? true : false
          });
          dialogVisible.value = false;
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
  .operate-from {
    :deep(.el-radio-group) {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }
  }
  .whole-cascader-width,
  .whole-textarea-width {
    width: 100%;
  }
  .whole-cascader-width {
    :deep(.el-form-item__content > div) {
      width: 80%;
    }
  }
  .m10 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
