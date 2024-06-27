<template>
  <!-- 添加/修改 shopee账号信息 -->
  <div class="fullDialog">
    <el-dialog
      width="900px"
      :title="title"
      :model-value="dialogVisible"
      :rules="formRules"
      destroy-on-close
      align-center
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div v-if="action === 'update'" class="header-btns">
        <el-button
          :type="status ? 'danger' : 'success'"
          @click="handleChangeStoreStatus"
          >{{ status ? '停用店铺' : '启用店铺' }}</el-button
        >
      </div>
      <el-form
        ref="editFormRef"
        :inline="true"
        :model="formData"
        size="default"
        :rules="formRules"
        label-width="100"
        class="form-part"
      >
        <el-form-item label="店铺名称" prop="storeAcct">
          <el-input
            v-model="formData.storeAcct"
            placeholder="请输入店铺名称"
            clearable
            @change="handleChangeStoreAcct"
          />
        </el-form-item>
        <el-form-item prop="salesSite" label="站点">
          <el-select
            v-model="formData.salesSite"
            clearable
            filterable
            placeholder="请选择站点"
          >
            <el-option
              v-for="item in initList.siteList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="发货仓库" prop="shippingWarehouseId">
          <el-select
            v-model="formData.shippingWarehouseId"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in initList.warehouseList"
              :key="item.id"
              :label="item.warehouseName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input
            v-model="formData.brand"
            placeholder="请输入品牌"
            clearable
          />
        </el-form-item>
        <el-form-item label="店铺ID" prop="siteId">
          <el-input
            v-model="formData.siteId"
            placeholder="请输入店铺ID"
            clearable
          />
        </el-form-item>
        <el-form-item label="PartnerID" prop="sellerId">
          <el-input
            v-model="formData.sellerId"
            placeholder="请输入PartnerID"
            clearable
          />
        </el-form-item>

        <el-form-item label="Secret Key" prop="secretKey">
          <el-input
            v-model="formData.secretKey"
            placeholder="请输入Secret Key"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售员" prop="salespersonId">
          <el-select
            v-model="formData.salespersonId"
            clearable
            filterable
            placeholder="请选择销售员"
            @change="
              handleChange($event, initList.salespersonList, 'salesperson')
            "
          >
            <el-option
              v-for="item in initList.salespersonList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客服" prop="customServicerId">
          <el-select
            v-model="formData.customServicerId"
            clearable
            filterable
            placeholder="请选择客服"
            @change="
              handleChange(
                $event,
                initList.customServicerList,
                'customServicer'
              )
            "
          >
            <el-option
              v-for="item in initList.customServicerList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售主管" prop="sellLeaderId">
          <el-select
            v-model="formData.sellLeaderId"
            clearable
            filterable
            placeholder="请选择销售主管"
            @change="
              handleChange($event, initList.sellLeaderList, 'sellLeaderName')
            "
          >
            <el-option
              v-for="item in initList.sellLeaderList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税号" prop="taxNumber">
          <el-input
            v-model="formData.taxNumber"
            placeholder="请输入税号"
            clearable
          />
        </el-form-item>
        <el-form-item label="shopee组长" prop="leaderId">
          <el-select
            v-model="formData.leaderId"
            clearable
            filterable
            placeholder="请选择shopee组长"
            @change="
              handleChange($event, initList.shopeeLeaderList, 'leaderName')
            "
          >
            <el-option
              v-for="item in initList.shopeeLeaderList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="欧盟税号" prop="eoriNumber">
          <el-input
            v-model="formData.eoriNumber"
            placeholder="请输入欧盟税号"
            clearable
          />
        </el-form-item>
        <div></div>
        <el-form-item label="备注" prop="acctBaseRemark" class="whole-line">
          <el-input
            v-model="formData.acctBaseRemark"
            type="textarea"
            rows="4"
            style="width: 100%"
            placeholder="请输入备注内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSave(editFormRef)">
            保存
          </el-button>
          <el-button @click="closeDialog"> 关闭 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { reactive, ref, computed, onMounted } from 'vue';
  import { getCustomerListApi } from '@/api/common/index';
  import {
    getSiteListApi,
    getAuthedProdWarehouseApi
  } from '@/api/shopee/common';
  import {
    getSalesPlatAccountBaseInfoApi,
    deleteSalesPlatAccountApi,
    openSalesPlatAccountApi,
    addOrUpdateSalesPlatAccountBaseInfoApi
  } from '@/api/configure/shopeeaccount';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { isEmptyNotObject } from '@/utils/validate';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    action: {
      // add 添加 update 编辑
      type: String,
      default: ''
    },
    editInfo: {
      type: Object,
      default: () => ({})
    }
  });

  const emits = defineEmits([
    'update:modelValue',
    'search',
    'getShopeeWarehouseList',
    'updateStoreList'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const titleObj = {
    add: '添加shopee账号',
    update: '设置平台账号信息'
  };
  const title = computed(() => titleObj[props.action]);

  // 不能多传值
  const formData = ref({
    salesperson: null,
    salespersonId: null,
    customServicer: null,
    customServicerId: null,
    sellLeaderName: null,
    sellLeaderId: null,
    leaderName: null,
    leaderId: null,
    acctBaseId: null,
    acctDetailId: null,
    storeAcct: null,
    salesSite: null,
    shippingWarehouseId: null,
    brand: null,
    siteId: null,
    sellerId: null,
    secretKey: null,
    taxNumber: null,
    eoriNumber: null,
    acctBaseRemark: null
  });

  const initList = reactive({
    salespersonList: [],
    shopeeLeaderList: [],
    sellLeaderList: [],
    customServicerList: [],
    siteList: []
  });

  onMounted(async () => {
    Promise.all([
      getCustomerListApi({ role: 'shopee专员' }),
      getCustomerListApi({ role: 'shopee组长' }),
      getCustomerListApi({ role: 'shopee主管' }),
      getCustomerListApi({ role: 'shopee客服' }),
      getSiteListApi(),
      getAuthedProdWarehouseApi()
    ]).then((res) => {
      initList.salespersonList = res[0]?.data || [];
      initList.shopeeLeaderList = res[1]?.data || [];
      initList.sellLeaderList = res[2]?.data || [];
      initList.customServicerList = res[3]?.data || [];
      initList.siteList = res[4]?.data?.siteList || [];
      initList.warehouseList = res[5]?.data || [];
    });
    const { action } = props;
    if (action === 'add') {
      formRules.value = {
        ...basicFormRules
      };
    } else {
      formRules.value = {
        ...basicFormRules,
        ...updateFormRules
      };
    }
    if (action === 'update') {
      const data = await getSalesPlatAccountBaseInfoApi(props.editInfo.id);
      Object.keys(formData.value).forEach((v) => {
        formData.value[v] = data[v];
      });
      status.value = data.status;
      const whiteList = ['leaderId', 'customServicerId'];
      whiteList.forEach((v) => {
        if (data[v] == -1) {
          formData.value[v] = null;
        }
      });
    }
  });

  const formRules = ref({});
  const basicFormRules = {
    storeAcct: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
    salesSite: [{ required: true, message: '请选择站点', trigger: 'change' }],
    siteId: [{ required: true, message: '请输入店铺ID', trigger: 'blur' }],
    shippingWarehouseId: [
      { required: true, message: '请输入发货仓库', trigger: 'blur' }
    ]
  };
  const updateFormRules = {
    brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
    salespersonId: [
      { required: true, message: '请选择销售员', trigger: 'change' }
    ]
  };

  const editFormRef = ref(null);

  const handleChange = (val, optionList, name) => {
    if (val) {
      formData.value[name] = optionList.find((v) => v.id === val)?.userName;
    } else {
      formData.value[name] = '';
    }
  };

  const closeDialog = () => {
    dialogVisible.value = false;
    if (needFresh.value) {
      emits('search');
      // 更改发货仓库枚举
      emits('getShopeeWarehouseList');
      if (storeChange.value) {
        emits('updateStoreList');
      }
    }
  };

  const storeChange = ref(false);
  const handleChangeStoreAcct = () => {
    storeChange.value = true;
  };

  const needFresh = ref(false);
  const handleSave = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          const params = {
            ...formData.value,
            platCode: 'shopee'
          };
          if (isEmptyNotObject(params.customServicerId)) {
            params.customServicer = '';
            params.customServicerId = -1;
          }
          if (isEmptyNotObject(params.leaderId)) {
            params.leaderName = '';
            params.leaderId = -1;
          }
          const { msg } = await addOrUpdateSalesPlatAccountBaseInfoApi(params);
          ElMessage.success(msg || '操作成功');
          needFresh.value = true;
          closeDialog();
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log('error submit!');
        return false;
      }
    });
  };

  // #region 状态
  const status = ref(null);
  const handleChangeStoreStatus = () => {
    let statusApi = deleteSalesPlatAccountApi;
    let str = '是否停用此账号？';
    if (!status.value) {
      statusApi = openSalesPlatAccountApi;
      str = '是否启用此账号？';
    }
    ElMessageBox.confirm(str, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        const { msg } = await statusApi(formData.value.acctBaseId);
        ElMessage.success(msg || '操作成功');
        status.value = !status.value;
        needFresh.value = true;
      } catch (err) {
        console.log('err :>> ', err);
      }
    });
  };

  // #endregion 状态
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .form-part {
    display: grid;
    grid-template-columns: repeat(auto-fill, 50%);
    :deep(.el-select) {
      width: 100%;
    }
  }
  .header-btns {
    display: flex;
    justify-content: end;
  }
  .whole-line {
    grid-column: 1 / 3;
  }
</style>
