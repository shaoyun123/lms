<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '修改品牌授权' : '新增品牌授权'"
      width="40%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div v-loading="pageLoading" style="padding: 0 16px">
        <el-form
          ref="formRef"
          :model="form"
          label-width="90px"
          :rules="formRules"
        >
          <div class="flex">
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="form.brand" />
            </el-form-item>
            <el-form-item label="商品子SKU" prop="goodsSSku">
              <div class="relative">
                <el-input v-model="form.goodsSSku" />
                <el-icon :size="20" class="search-icon" @click="getTempSkuList"
                  ><Search
                /></el-icon>
              </div>
            </el-form-item>
          </div>
          <el-form-item
            label="模板父SKU"
            prop="prodBrandAuthorizationTempList"
            class="modelSku"
          >
            <el-checkbox
              v-model="checkAll"
              class="checkAllSku"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <el-checkbox-group
              v-model="form.prodBrandAuthorizationTempList"
              @change="handleCheckChange"
            >
              <el-checkbox v-for="t in newTempPSkuList" :key="t" :label="t" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="授权公司" prop="company">
            <el-input v-model="form.company" maxlength="100" show-word-limit />
          </el-form-item>
          <el-form-item label="授权平台" prop="prodBrandAuthorizationPlatsList">
            <el-select
              v-model="form.prodBrandAuthorizationPlatsList"
              style="width: 642px"
              placeholder="请选择"
              clearable
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
            >
              <el-option
                v-for="item in platNameList"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权店铺" prop="prodBrandAuthorizationStores">
            <el-input
              v-model="form.prodBrandAuthorizationStores"
              maxlength="100"
              show-word-limit
              placeholder="支持多个逗号分隔"
            />
          </el-form-item>
          <el-form-item label="授权证书">
            <el-upload
              ref="upload"
              v-model:file-list="importList"
              :action="'/api/lms/prodBrand/uploadCertificate'"
              accept="image/*,.doc,.docx,.xls,.xlsx,.pdf"
              :on-success="importSuccess"
              :on-error="importError"
              :on-exceed="handleExceed"
              :show-file-list="true"
              :limit="1"
            >
              <el-button type="primary">上传文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" :row="4" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSave(formRef)">
            保存
          </el-button>
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, reactive, watch } from 'vue';
  import { ElMessage, ElMessageBox, genFileId } from 'element-plus';
  import { omit } from 'lodash-es';

  import {
    queryProdTempPSkuBySSkuApi,
    queryAllPlatNameApi,
    saveBrandAuthorizationApi,
    editBrandAuthorizationApi,
    queryProdBrandDetailApi
  } from '@/api/brand/goodsBrandAuth';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    selectId: {
      type: Number,
      default: null
    },
    currentRow: {
      type: Object,
      default: () => {}
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

  const needFresh = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        handleResetForm();
        needFresh.value = false;
        getQueryAllPlatNameList();
        if (props.isEdit) {
          getDetail(props.selectId);
        }
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
        needFresh.value = false;
      }
    }
  );

  const checkAll = ref(false);

  const handleCheckAllChange = () => {
    form.prodBrandAuthorizationTempList = checkAll.value
      ? JSON.parse(JSON.stringify(newTempPSkuList.value))
      : [];
  };
  const handleCheckChange = () => {
    checkAll.value =
      form.prodBrandAuthorizationTempList.length &&
      form.prodBrandAuthorizationTempList.length ===
        newTempPSkuList.value.length;
  };

  const formRef = ref(null);
  const formRules = reactive({
    brand: [{ required: true, message: '请填写品牌', trigger: 'blur' }],
    prodBrandAuthorizationTempList: [
      { required: true, message: '请填写模板父SKU', trigger: 'blur' }
    ],
    prodBrandAuthorizationPlatsList: [
      { required: true, message: '请填写授权平台', trigger: 'blur' }
    ]
  });

  const form = reactive({
    brand: '', // 品牌
    goodsSSku: '',
    prodBrandAuthorizationTempList: [], // 父模板
    company: '', // 公司名称
    prodBrandAuthorizationPlats: '', // 平台名称
    prodBrandAuthorizationPlatsList: '',
    prodBrandAuthorizationStores: '', // 店铺名 多个逗号隔开
    certificatePath: '', // 上传文件名
    remark: '' // 备注
  });

  // 根据id查详情
  const getDetail = async (id) => {
    pageLoading.value = true;
    const { data } = await queryProdBrandDetailApi({
      id
    }).finally(() => (pageLoading.value = false));
    allTempPSkuList.value = data.prodBrandAuthorizationTempList;
    newTempPSkuList.value = data.prodBrandAuthorizationTemps.split(',');
    form.brand = data.brand;
    // 默认选中的父模板
    form.prodBrandAuthorizationTempList =
      data.prodBrandAuthorizationTemps.split(',');
    form.company = data.company;
    form.prodBrandAuthorizationPlatsList =
      data.prodBrandAuthorizationPlats.split(',');
    form.prodBrandAuthorizationPlats = data.prodBrandAuthorizationPlats;
    form.prodBrandAuthorizationStores = data.prodBrandAuthorizationStores;
    form.certificatePath = data.certificatePath;
    if (form.certificatePath !== '') {
      // 授权整数有路径 就反显 没有不显示
      importList.value = [
        {
          name: data.certificatePath,
          url: data.certificateUrl
        }
      ];
    } else {
      importList.value = [];
    }
    form.remark = data.remark;
    handleCheckChange();
  };

  // 获取所有平台
  const platNameList = ref(false);
  const getQueryAllPlatNameList = async () => {
    const { data } = await queryAllPlatNameApi();
    platNameList.value = data;
  };

  // 输入商品SKU查询模板父SKU
  const tempPSkuList = ref([]); // 所有查出来的父SKu
  const newTempPSkuList = ref([]); // 绑定展示出来的所有父枚举
  const allTempPSkuList = ref([]); // 所有父枚举
  const getTempSkuList = async () => {
    const { data } = await queryProdTempPSkuBySSkuApi({
      sSku: form.goodsSSku
    });
    tempPSkuList.value = data;

    tempPSkuList.value.forEach((item) => {
      if (!newTempPSkuList.value.some((cItem) => cItem === item.tempPSku)) {
        newTempPSkuList.value.push(item.tempPSku);
        allTempPSkuList.value.push(item);
      }
    });
    handleCheckChange();
  };

  const pageLoading = ref(false);

  const importList = ref([]);
  // 导入新增
  const importSuccess = async (res) => {
    if (res.code == '0000') {
      importList.value = [
        {
          name: res.data[0],
          url: ''
        }
      ];
    } else {
      await ElMessageBox.confirm(res.msg || '上传失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
  };

  const importError = () => {
    pageLoading.value = false;
    ElMessage.error('导入新增失败！');
  };
  const upload = ref();

  const handleExceed = (files) => {
    upload.value.clearFiles();
    const file = files[0];
    file.uid = genFileId();
    upload.value.handleStart(file);
  };

  // 保存
  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        if (importList.value.length) {
          form.certificatePath = importList.value[0].name;
        } else {
          form.certificatePath = '';
        }
        // 平台
        if (form.prodBrandAuthorizationPlatsList.length) {
          form.prodBrandAuthorizationPlats =
            form.prodBrandAuthorizationPlatsList.join(',');
        }
        // 父模板
        if (form.prodBrandAuthorizationTempList.length) {
          form.prodBrandAuthorizationTempList = allTempPSkuList.value.filter(
            (item) =>
              form.prodBrandAuthorizationTempList.includes(item.tempPSku)
          );
        } else {
          return ElMessage.warning('模板父SKU不能为空！');
        }
        if (props.isEdit) {
          await handleEdit();
        } else {
          await handleAdd();
        }
      }
    });
  };

  // 新增
  const handleAdd = async () => {
    const params = omit(form, ['prodBrandAuthorizationPlatsList']);
    const { code, msg } = await saveBrandAuthorizationApi({
      ...params
    });
    if (code === '0000') {
      ElMessage.success(msg);
      form.goodsSSk = '';
      dialogVisible.value = false;
      needFresh.value = true;
    } else {
      ElMessage.warning(msg);
    }
  };

  // 编辑
  const handleEdit = async () => {
    const params = omit(form, ['prodBrandAuthorizationPlatsList']);
    const { code, msg } = await editBrandAuthorizationApi({
      id: props.selectId,
      ...params
    });
    if (code === '0000') {
      ElMessage.success(msg);
      handleResetForm();
      dialogVisible.value = false;
      needFresh.value = true;
    } else {
      ElMessage.warning(msg);
    }
  };

  // 关闭弹窗
  const handleClose = () => {
    handleResetForm();
    dialogVisible.value = false;
  };

  const handleResetForm = () => {
    checkAll.value = false;
    form.brand = '';
    form.goodsSSku = '';
    form.prodBrandAuthorizationTempList = [];
    newTempPSkuList.value = [];
    allTempPSkuList.value = [];
    form.company = '';
    form.prodBrandAuthorizationPlatsList = [];
    form.prodBrandAuthorizationStores = '';
    importList.value = [];
    form.remark = '';
  };
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    padding: 0 60px 0 0;
    justify-content: space-between;
    align-items: center;
  }
  .modelSku {
    position: relative;
    margin-bottom: 40px;
    .checkAllSku {
      position: absolute;
      bottom: -20px;
      left: -60px;
    }
    :deep(.el-checkbox__label) {
      width: 70px;
    }
  }
  .relative {
    postion: relative;
  }
  .search-icon {
    position: absolute;
    top: 0;
    right: -35px;
  }
</style>
