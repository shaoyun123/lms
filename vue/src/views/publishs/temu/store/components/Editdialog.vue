<template>
  <!-- 添加/修改店铺信息 -->
  <el-dialog
    width="40%"
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
      label-width="100px"
      class="dialog_form"
    >
      <el-form-item label="店铺名称" prop="storeAcct">
        <el-input v-model="formData.storeAcct"></el-input>
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
      <!-- <el-form-item label="普源别名">
        <el-input v-model="formData.storeAcct"></el-input>
      </el-form-item> -->
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
      <el-form-item label="组长">
        <el-select
          v-model="formData.leaderId"
          filterable
          @change="changeGroupLeader"
        >
          <el-option
            v-for="item in userData.groupLeaderData"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺ID" prop="sellerId">
        <el-input v-model="formData.sellerId"></el-input>
      </el-form-item>
      <el-form-item label="制造商" prop="manufacturer">
        <el-input v-model="formData.manufacturer"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="brand">
        <el-input v-model="formData.brand"></el-input>
      </el-form-item>
      <el-form-item label="开发者账号" prop="devAccount">
        <el-select
          v-model="formData.devAccount"
          clearable
          @change="chooseDevAccount"
        >
          <el-option
            v-for="item in accountList"
            :key="item"
            :label="item.devAccount"
            :value="item.devAccount"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="action === 'add'" label="店铺状态" prop="status">
        <el-select v-model="formData.status" disabled>
          <el-option label="启用中" :value="true"></el-option>
          <el-option label="已停用" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="币种" prop="currency">
        <el-select v-model="formData.currency">
          <el-option label="CNY" value="CNY"></el-option>
          <el-option label="USD" value="USD"></el-option>
        </el-select>
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
    accountList: {
      type: Array,
      default: () => []
    }
  });

  const emit = defineEmits(['close', 'edit']);

  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  const formData = reactive({
    platCode: 'temu',
    sellerId: '',
    storeAcct: '',
    sellLeaderId: '',
    salespersonId: '',
    customServicerId: '',
    brand: '',
    status: true,
    acctBaseRemark: '',
    lmsAppUserName: '',
    salesperson: '',
    sellLeaderName: '',
    customServicer: '',
    accessToken: '',
    devAccount: '',
    temuDevAccountId: '',
    manufacturer: '',
    leaderId: '',
    leaderName: '',
    currency: 'CNY'
  });

  onMounted(() => {
    if (props.action === 'update') {
      Object.keys(formData).forEach((item) => {
        formData[item] = props.editInfo[item];
      });
      formData.acctBaseRemark = props.editInfo.remark;
      formData.platCode = 'temu';
    }
  });

  const formRules = reactive({
    storeAcct: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
    sellLeaderId: [
      { required: true, message: '请选择销售主管', trigger: 'blur' }
    ],
    salespersonId: [
      { required: true, message: '请选择销售员', trigger: 'blur' }
    ],
    // ' ': [{ required: true, message: '请输入普源别名', trigger: 'blur' }],
    customServicerId: [
      { required: true, message: '请选择客服专员', trigger: 'blur' }
    ],
    sellerId: [{ required: true, message: '请输入店铺ID', trigger: 'blur' }],
    manufacturer: [
      { required: true, message: '请输入制造商', trigger: 'blur' }
    ],
    currency: [{ required: true, message: '请选择币种', trigger: 'blur' }]
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

  const chooseDevAccount = (val) => {
    formData.temuDevAccountId =
      props.accountList &&
      props.accountList.filter((item) => item.devAccount === val)[0]?.id;
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

  const changeGroupLeader = (val) => {
    formData.customServicer =
      props.userData.groupLeaderData &&
      props.userData.groupLeaderData.filter((item) => item.id === val)[0]
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
              props.userData.groupLeaderData.filter(
                (item) => item.id === formData.leaderId
              )[0]?.userName) ||
            '';
          const { code } =
            props.action === 'update'
              ? await updateStoreApi({ ...formData, ...params })
              : await createStoreApi({ ...formData, ...params });
          if (code === '0000') {
            ElMessage.success(`${msg}成功！`);
            emit('close');
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
  .input_area {
    width: 610px;
  }
</style>
