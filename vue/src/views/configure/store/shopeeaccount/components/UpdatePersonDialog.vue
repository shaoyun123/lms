<template>
  <!-- 批量修改店铺信息 -->
  <div class="fullDialog">
    <el-dialog
      :model-value="dialogVisible"
      width="500px"
      title="修改信息"
      destroy-on-close
      align-center
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form :model="formData" label-width="100px" size="default">
        <el-form-item label="销售员" prop="salespersonId">
          <el-select
            v-model="formData.salespersonId"
            filterable
            clearable
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
        <el-form-item label="客服专员" prop="customServicerId">
          <el-select
            v-model="formData.customServicerId"
            filterable
            clearable
            placeholder="请选择客服专员"
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
            ></el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="shopee组长" prop="leaderId">
          <el-select
            v-model="formData.leaderId"
            filterable
            clearable
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
        <el-form-item label="销售主管" prop="sellLeaderId">
          <el-select
            v-model="formData.sellLeaderId"
            filterable
            clearable
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
            ></el-option
          ></el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="closeDialog">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, reactive, onMounted } from 'vue';
  import { getCustomerListApi } from '@/api/common/index';
  import { updatePersonInfoStoreApi } from '@/api/configure/shopeeaccount';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: true
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

  const initList = reactive({
    salespersonList: [],
    shopeeLeaderList: [],
    sellLeaderList: [],
    customServicerList: []
  });

  onMounted(() => {
    Promise.all([
      getCustomerListApi({ role: 'shopee专员' }),
      getCustomerListApi({ role: 'shopee组长' }),
      getCustomerListApi({ role: 'shopee主管' }),
      getCustomerListApi({ role: 'shopee客服' })
    ]).then((res) => {
      initList.salespersonList = res[0]?.data || [];
      initList.shopeeLeaderList = res[1]?.data || [];
      initList.sellLeaderList = res[2]?.data || [];
      initList.customServicerList = res[3]?.data || [];
    });
  });

  const formData = reactive({
    salespersonId: '',
    salesperson: '',
    customServicerId: '',
    customServicer: '',
    sellLeaderId: '',
    sellLeaderName: '',
    leaderId: '',
    leaderName: ''
  });

  const handleChange = (val, optionList, name) => {
    if (val) {
      formData[name] = optionList.find((v) => v.id === val)?.userName;
    } else {
      formData[name] = '';
    }
  };

  const closeDialog = () => {
    dialogVisible.value = false;
  };
  const handleSave = async () => {
    const ids = props.selectRecords.map((v) => v.id).join();
    const params = {
      ids,
      ...formData
    };
    try {
      await updatePersonInfoStoreApi(params);
      emits('search');
      closeDialog();
      ElMessage.success('操作成功');
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
</script>

<style lang="scss" scoped></style>
