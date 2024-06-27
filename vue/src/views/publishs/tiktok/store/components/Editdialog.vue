<template>
  <!-- 添加/修改店铺信息 -->
  <el-dialog
    width="800px"
    :title="title"
    :model-value="showEditDialog"
    :rules="formRules"
    destroy-on-close
    :close-on-click-modal="false"
    @close="closeDialog()"
  >
    <el-form
      ref="editFormRef"
      :inline="true"
      :model="formData"
      size="default"
      :rules="formRules"
      label-width="150"
    >
      <el-form-item label="店铺名称" prop="storeAcct">
        <el-input v-model="formData.storeAcct"></el-input>
      </el-form-item>
      <el-form-item prop="allrootAliasName" label="电商浏览器店铺名称">
        <el-input v-model="formData.allrootAliasName"></el-input>
      </el-form-item>
      <el-form-item label="销售主管" prop="sellLeaderId">
        <el-select
          v-model="formData.sellLeaderId"
          filterable
          @change="changeLeader"
        >
          <el-option
            v-for="item in userData.saleLeaderData"
            :key="item.id"
            bus
            :label="item.user_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售组长">
        <el-select v-model="formData.leaderId" filterable>
          <el-option label="无" :value="0"></el-option>
          <el-option
            v-for="item in saleLeaderList"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售员" prop="salespersonId">
        <el-select
          v-model="formData.salespersonId"
          filterable
          @change="changeSaler"
        >
          <el-option
            v-for="item in userData.salesPersonData"
            :key="item.id"
            bus
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客服专员" prop="customServicerId">
        <el-select
          v-model="formData.customServicerId"
          filterable
          @change="changeServicer"
        >
          <el-option
            v-for="item in userData.customServicerData"
            :key="item.id"
            bus
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Shop Code" prop="mainShopCode">
        <el-input v-model="formData.mainShopCode"></el-input>
      </el-form-item>
      <el-form-item label="站点" prop="salesSite">
        <el-select v-model="formData.salesSite">
          <el-option
            v-for="item in siteDataOption"
            :key="item.code"
            :label="item.code"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌" prop="brand">
        <el-input v-model="formData.brand"></el-input>
      </el-form-item>
      <el-row>
        <el-form-item label="备注" class="input_area" prop="acctBaseRemark">
          <el-input
            v-model="formData.acctBaseRemark"
            type="textarea"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-row>
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
</template>

<script setup>
  import {
    defineProps,
    toRefs,
    defineEmits,
    reactive,
    ref,
    computed,
    onMounted
  } from 'vue';
  import { updateStoreApi, createStoreApi } from '@/api/configure/storeconf.js';
  import { ElMessage } from 'element-plus';
  import useUserStore from '@/store/modules/user';
  import { trim } from 'lodash-es';
  const props = defineProps({
    showEditDialog: {
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
      default: () => {}
    },
    userData: {
      type: Object,
      default: () => {}
    },
    saleLeaderList: {
      type: Array,
      default: () => []
    }
  });

  const emit = defineEmits(['close', 'edit', 'freshCreator']);

  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  const formData = reactive({
    platCode: 'tiktok',
    storeAcct: '',
    allrootAliasName: '',
    sellLeaderId: '',
    salespersonId: '',
    customServicerId: '',
    brand: '',
    acctBaseRemark: '',
    lmsAppUserName: '',
    salesperson: '',
    sellLeaderName: '',
    customServicer: '',
    salesSite: '',
    mainShopCode: '',
    leaderId: ''
  });

  const siteDataOption = ref([]);
  onMounted(() => {
    // 站点 新增: 过滤掉GLOBAL  编辑:过滤掉GLOBAL和US
    if (props.action === 'update') {
      siteDataOption.value = props.userData.siteData.filter(
        (item) => item.code !== 'GLOBAL' && item.code !== 'US'
      );
      Object.keys(formData).forEach((item) => {
        formData[item] = props.editInfo[item];
      });
      formData.acctBaseRemark = props.editInfo.remark;
      formData.platCode = 'tiktok';
    } else {
      siteDataOption.value = props.userData.siteData.filter(
        (item) => item.code !== 'GLOBAL'
      );
    }
  });

  const formRules = reactive({
    storeAcct: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
    allrootAliasName: [
      { required: true, message: '请输入电商浏览器店铺名称', trigger: 'blur' }
    ],
    sellLeaderId: [
      { required: true, message: '请选择销售主管', trigger: 'blur' }
    ],
    salespersonId: [
      { required: true, message: '请选择销售员', trigger: 'blur' }
    ],
    customServicerId: [
      { required: true, message: '请选择客服专员', trigger: 'blur' }
    ],
    mainShopCode: [
      { required: true, message: '请输入Shop Code', trigger: 'blur' }
    ],
    salesSite: [{ required: true, message: '请选择站点', trigger: 'blur' }]
  });

  const editFormRef = ref(null);

  const title = computed(() => {
    if (props.action === 'add') {
      return '添加店铺账号';
    } else if (props.action === 'update') {
      return '修改店铺账号';
    }
    return '';
  });
  const { showEditDialog } = toRefs(props);
  const closeDialog = () => {
    editFormRef.value.resetFields();
    emit('close');
  };

  const changeLeader = (val) => {
    formData.sellLeaderName =
      props.userData.saleLeaderData &&
      props.userData.saleLeaderData.filter((item) => item.id === val)[0]
        ?.user_name;
  };

  const changeSaler = (val) => {
    formData.salesperson =
      props.userData.salesPersonData &&
      props.userData.salesPersonData.filter((item) => item.id === val)[0]
        ?.userName;
  };

  const changeServicer = (val) => {
    formData.customServicer =
      props.userData.customServicerData &&
      props.userData.customServicerData.filter((item) => item.id === val)[0]
        ?.userName;
  };

  const handleSave = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          let params = {};
          let msg = '添加';
          if (props.action === 'update') {
            params = {
              acctBaseId: props.editInfo.id,
              acctDetailId: props.editInfo.acctDetailId
            };
            msg = '修改';
          }
          formData.lmsAppUserName = userName;

          formData.leaderName =
            (formData.leaderId &&
              props.saleLeaderList.filter(
                (item) => item.id === formData.leaderId
              )[0].userName) ||
            '';
          const { code } =
            props.action === 'update'
              ? await updateStoreApi({
                  ...formData,
                  ...params,
                  mainShopCode: trim(formData.mainShopCode)
                })
              : await createStoreApi({
                  ...formData,
                  ...params,
                  mainShopCode: trim(formData.mainShopCode)
                });
          if (code === '0000') {
            ElMessage.success(`${msg}成功！`);
            emit('close');
            if (props.action !== 'update') {
              emit('freshCreator');
            }
            emit('edit');
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log('error submit!');
        return false;
      }
    });
  };
</script>

<style lang="scss" scoped>
  .el-input {
    width: 200px;
  }
  .el-select {
    width: 200px;
  }
  .input_area {
    width: 610px;
  }
</style>
