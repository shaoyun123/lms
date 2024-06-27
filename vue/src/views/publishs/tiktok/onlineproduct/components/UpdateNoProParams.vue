<template>
  <el-dialog
    :model-value="showDialog"
    width="35%"
    align-center
    :title="editId ? '修改不处理参数' : '新增不处理参数'"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <div class="px-20">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="150px"
        class="dialog_form flex-column"
      >
        <el-form-item label="过滤类型" prop="filterListingType">
          <el-select
            v-model="formData.filterListingType"
            class="w-full"
            :disabled="editId ? true : false"
          >
            <el-option
              v-for="item in filterTypeEnum"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="店铺"
          prop="storeAcctIdList"
          class="search_item_cascader"
        >
          <z-cascader
            v-model="formData.storeAcctIdList"
            class="w-full"
            :data="storeTreeList"
          ></z-cascader>
        </el-form-item>
        <el-form-item>
          <template #label>
            <el-select
              v-model="formData.salesCountDay"
              class="w-150"
              filterable
            >
              <el-option
                v-for="item in salesTypeList"
                :key="item"
                :value="item"
                :label="item + '日销量'"
              />
            </el-select>
          </template>
          <div class="flex flex-1">
            <ZInputNumber v-model="formData.salesCountMin" :min="0" clearable />
            <div class="range_link">-</div>
            <ZInputNumber v-model="formData.salesCountMax" :min="0" clearable />
          </div>
        </el-form-item>
        <el-form-item label="<=模板审核时间天数">
          <ZInputNumber
            v-model="formData.templateAuditDay"
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="<=距离刊登时间天数">
          <ZInputNumber
            v-model="formData.productListingDay"
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="product_id">
          <el-input
            v-model="formData.productId"
            @blur="commonDivideCommaNum($event)"
          />
        </el-form-item>
        <el-form-item label="global_product_id">
          <el-input
            v-model="formData.globalProductId"
            @blur="commonDivideCommaNum($event)"
          />
        </el-form-item>
        <el-form-item prop="listingTagType" label="TikTok在线listing标签">
          <div class="flex w-full">
            <el-select
              v-model="formData.listingTagType"
              class="w-150"
              filterable
            >
              <el-option :value="1" label="product标签" />
              <el-option :value="2" label="product&sku标签" disabled />
            </el-select>
            <el-select
              v-model="formData.listingTagIdList"
              class="flex-1"
              style="width: 150px"
              clearable
              filterable
            >
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit(formRef)"
          >提交</el-button
        >
        <el-button @click="closeDialog">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { onMounted, ref, reactive } from 'vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import { ElMessage } from 'element-plus';
  // import { cloneDeep } from 'lodash-es';
  import { commonDivideCommaNum } from '@/utils/divide';
  import {
    getListingTagApi,
    saveProductApi,
    getDetailByIdApi
  } from '@/api/publishs/tiktokonlineproduct';
  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    checkedList: {
      type: Array,
      default: () => []
    },
    storeTreeList: {
      type: Array,
      default: () => []
    },
    filterTypeEnum: {
      type: Array,
      default: () => []
    },
    editId: {
      type: Number || String,
      default: () => null
    }
  });

  const emits = defineEmits(['close', 'done']);

  // 销量枚举
  const salesTypeList = ['7', '30', '60', '90', '180', '365'];

  const formRef = ref(null);
  const formData = reactive({
    filterListingType: '',
    storeAcctIdList: [],
    salesCountDay: '7',
    salesCountMin: null,
    salesCountMax: null,
    templateAuditDay: null,
    productListingDay: null,
    productId: '',
    globalProductId: '',
    listingTagType: 1,
    listingTagIdList: '', // 改为单选
    remark: ''
  });

  const rules = reactive({
    filterListingType: [
      {
        required: true,
        message: '请选择过滤类型',
        trigger: 'blur'
      }
    ],
    storeAcctIdList: [
      {
        required: true,
        message: '请选择店铺',
        trigger: 'blur'
      }
    ]
  });

  onMounted(() => {
    getTkListingTagList();
    // 编辑
    if (props.editId) {
      getDetail();
    }
  });

  // 获取tk在线listing标签
  const tagList = ref([]);
  const getTkListingTagList = async () => {
    const { data } = await getListingTagApi({
      headCode: 'TIKTOK_ONLINE_LISTING_TAG'
    });
    tagList.value = data;
  };

  // 获取详情
  const getDetail = async () => {
    const { data } = await getDetailByIdApi({
      id: props.editId
    });
    Object.assign(formData, JSON.parse(JSON.stringify(data)));
    // 回显listing标签
    if (formData.listingTagIdList?.length) {
      formData.listingTagIdList = formData.listingTagIdList[0];
    } else {
      formData.listingTagIdList = '';
    }
  };

  // 处理参数
  const getParams = () => {
    const obj = { ...formData };
    obj.productId = obj.productId || null;
    obj.globalProductId = obj.globalProductId || null;
    obj.listingTagIdList = obj.listingTagIdList ? [obj.listingTagIdList] : [];
    return obj;
  };

  // 点击提交
  const handleSubmit = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        const requiredKeyList = [
          'salesCountMin',
          'salesCountMax',
          'templateAuditDay',
          'productListingDay',
          'productId',
          'globalProductId',
          'listingTagIdList'
        ];
        // 这些至少填写一项
        const hasValue = requiredKeyList.some((key) => {
          if (Array.isArray(formData[key])) {
            return formData[key].length > 0;
          } else {
            return formData[key] && formData[key] !== '';
          }
        });
        // 非必填项中 除了备注 至少填写一项
        if (!hasValue) {
          return ElMessage.warning('请配置不处理参数');
        }
        if (formData.productId && formData.globalProductId) {
          return ElMessage.warning(
            'product ID与global product ID不可同时输入！'
          );
        }
        const obj = getParams();
        const editObj = props.editId ? { id: props.editId } : {};

        const { code, msg } = await saveProductApi({
          ...obj,
          ...editObj
        });

        if (code === '0000') {
          ElMessage.success(msg);
          emits('done');
          closeDialog();
        }
      }
    });
  };

  const closeDialog = () => {
    emits('close');
  };
</script>

<style lang="scss" scoped>
  .flex-column {
    display: flex;
    flex-direction: column;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-1 {
    flex: 1;
  }
  .range_link {
    margin: 0 10px;
  }
  .form_left {
    width: 200px;
  }
  .form_range {
    .el-form-item__content {
      display: flex;
    }
  }
  .w-full {
    width: 100%;
  }
  .w-150 {
    width: 150px;
  }
  .px-20 {
    padding: 0 50px 0 20px;
  }
</style>
