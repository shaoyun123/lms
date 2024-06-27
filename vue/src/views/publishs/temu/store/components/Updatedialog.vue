<template>
  <!-- 批量修改店铺信息 -->
  <el-dialog
    width="30%"
    title="修改信息"
    :model-value="showDialog"
    destroy-on-close
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form :model="formData">
      <el-form-item
        label="销售员"
        size="default"
        label-width="100px"
        prop="salespersonId"
      >
        <el-select v-model="formData.salespersonId" filterable clearable>
          <el-option
            v-for="item in userData.salesPersonData"
            :key="item.id"
            bus
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="platCode === 'tiktok'"
        label="销售组长"
        size="default"
        label-width="100px"
      >
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
      <el-form-item label="销售主管" size="default" label-width="100px">
        <el-select v-model="formData.sellLeaderId" filterable clearable>
          <el-option
            v-for="item in userData.saleLeaderData"
            :key="item.id"
            bus
            :label="item.user_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客服专员" size="default" label-width="100px">
        <el-select v-model="formData.customServicerId" filterable clearable>
          <el-option
            v-for="item in userData.customServicerData"
            :key="item.id"
            bus
            :label="item.userName"
            :value="item.id"
          ></el-option
        ></el-select>
      </el-form-item>
      <el-form-item
        v-if="platCode !== 'tiktok'"
        label="组长"
        size="default"
        label-width="100px"
      >
        <el-select v-model="formData.leaderId" filterable>
          <el-option
            v-for="item in userData.groupLeaderData"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="platCode === 'temu'"
        label="制造商"
        size="default"
        prop="manufacturer"
        label-width="100px"
      >
        <el-input
          v-model="formData.manufacturer"
          placeholder="请输入"
          style="width: 49%"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="platCode === 'tiktok'" size="default">
        <el-card style="width: 100%" class="remark_card">
          <template #header>
            <div class="card-header">
              <span>备注</span>
              <el-radio-group v-model="remarkType" @change="changeRemarkType">
                <el-radio value="拼接至原备注后">拼接至原备注后</el-radio>
                <el-radio value="覆盖原备注">覆盖原备注</el-radio>
                <el-radio value="删除原备注">删除原备注</el-radio>
              </el-radio-group>
            </div>
          </template>
          <el-input
            v-model="remarkContent"
            type="textarea"
            :disabled="remarkDisabled"
            :autosize="{ minRows: 3, maxRows: 6 }"
          ></el-input>
        </el-card>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSave()"> 保存 </el-button>
        <el-button @click="closeDialog"> 关闭 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineProps, defineEmits, computed, reactive, ref } from 'vue';
  import { updateStore } from '@/api/publishs/temustoremanage';
  import { updateTiktokStore } from '@/api/publishs/tiktokstoremanage';
  import { ElMessage } from 'element-plus';
  import useUserStore from '@/store/modules/user';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    selectRecords: {
      type: Array,
      default: () => []
    },
    userData: {
      type: Object,
      default: () => {}
    },
    platCode: {
      type: String,
      default: ''
    },
    // tk专属
    saleLeaderList: {
      type: Array,
      default: () => []
    }
  });
  const emit = defineEmits('close');

  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  const formData = reactive({
    salespersonId: '',
    customServicerId: '',
    sellLeaderId: '',
    manufacturer: '',
    leaderId: ''
  });
  const remarkType = ref('拼接至原备注后');
  const remarkContent = ref('');
  const remarkDisabled = ref(false);

  const closeDialog = (val = '') => {
    emit('close', val);
  };

  const changeRemarkType = (val) => {
    if (val === '删除原备注') {
      remarkDisabled.value = true;
      remarkContent.value = '';
    } else {
      remarkDisabled.value = false;
    }
  };

  const handleSave = async () => {
    let ids = props.selectRecords.map((item) => item.id);
    try {
      if (
        !formData.salespersonId &&
        !formData.customServicerId &&
        !formData.sellLeaderId &&
        !formData.manufacturer &&
        !formData.leaderId &&
        props.platCode !== 'tiktok'
      ) {
        return ElMessage.warning('修改信息不可以全部为空！');
      }
      if (
        !formData.salespersonId &&
        !formData.customServicerId &&
        !formData.sellLeaderId &&
        !remarkContent.value &&
        !formData.leaderId &&
        props.platCode === 'tiktok' &&
        remarkType.value === '拼接至原备注后'
      ) {
        return ElMessage.warning('修改信息不可以全部为空！');
      }
      let salesperson =
        formData.salespersonId &&
        props.userData.salesPersonData.filter(
          (item) => item.id === formData.salespersonId
        )[0].userName;

      let customServicer =
        formData.customServicerId &&
        props.userData.customServicerData.filter(
          (item) => item.id === formData.customServicerId
        )[0].userName;

      let sellLeaderName =
        formData.sellLeaderId &&
        props.userData.saleLeaderData.filter(
          (item) => item.id === formData.sellLeaderId
        )[0].user_name;

      let leaderData =
        props.platCode === 'tiktok'
          ? props.saleLeaderList
          : props.userData.groupLeaderData;

      let leaderName =
        formData.leaderId &&
        leaderData.filter((item) => item.id === formData.leaderId)[0].userName;

      let paramsData = new FormData();
      paramsData.append('leaderId', formData.leaderId);
      paramsData.append('leaderName', leaderName);
      paramsData.append('salespersonId', formData.salespersonId);
      paramsData.append('salesperson', salesperson);
      paramsData.append('customServicerId', formData.customServicerId);
      paramsData.append('customServicer', customServicer);
      paramsData.append('sellLeaderId', formData.sellLeaderId);
      paramsData.append('sellLeaderName', sellLeaderName);
      paramsData.append('lmsAppUserName', userName.value);
      paramsData.append('platCode', props.platCode);
      let params = {
        ...formData,
        salesperson,
        customServicer,
        sellLeaderName,
        ids,
        leaderName
      };
      if (props.platCode === 'tiktok') {
        params.platCode = 'tiktok';
        params.remarkType = remarkType.value;
        params.remarkContent = remarkContent.value;
      }
      if (
        props.platCode === 'tiktok' &&
        !remarkContent.value &&
        remarkType.value === '覆盖原备注'
      ) {
        return ElMessage.warning('请填写备注');
      }
      for (let i = 0; i < ids.length; i++) {
        paramsData.append('ids', ids[i]);
      }
      if (props.platCode === 'temu') {
        paramsData.append('manufacturer', formData.manufacturer);
      }
      const { code } =
        props.platCode === 'tiktok'
          ? await updateTiktokStore(params)
          : await updateStore(paramsData);
      if (code === '0000') {
        ElMessage.success('修改成功！');
        closeDialog('update');
      }
    } catch (err) {
      console.log(err);
    }
  };
</script>

<style lang="scss" scoped>
  .card-header {
    padding: 0 60px 0 30px;
    display: flex;
    justify-content: space-between;
  }
  .remark_card {
    :deep(.el-card__body) {
      padding: 0 !important;
    }
    :deep(.el-textarea__inner) {
      border: none;
      box-shadow: none;
    }
  }
</style>
