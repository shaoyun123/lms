<template>
  <div class="fullDialog">
    <el-dialog
      :model-value="dialogVisible"
      :title="title"
      width="600px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100"
        size="default"
      >
        <template v-if="isBacth">
          <el-form-item label="新增标签" prop="addStoreTagList">
            <ZSelect v-model="formData.addStoreTagList" :items="storeTagList" />
          </el-form-item>
          <el-form-item label="移除标签" prop="removeStoreTagList">
            <ZSelect
              v-model="formData.removeStoreTagList"
              :items="storeTagList"
            />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="店铺标签" prop="storeTagList">
            <el-checkbox-group v-model="formData.storeTagList">
              <el-checkbox
                v-for="item in storeTagList"
                :key="item.name"
                :value="item.name"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
        <el-button v-if="!isBacth" @click="handleReset(formRef)"
          >清空</el-button
        >
        <el-button v-else @click="closeDialog">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, reactive } from 'vue';
  import {
    batchUpdateStoreTagApi,
    getStoreInfoApi,
    saveOrUpdateStoreTagApi
  } from '@/api/configure/shopeeaccount';
  import { getStoreTagListApi } from '@/api/common/index';
  import ZSelect from '@/components/ZSelect/index.vue';
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
  const title = computed(() =>
    props.selectRecords.length ? '批量修改店铺标签' : '修改店铺标签'
  );

  const closeDialog = () => {
    dialogVisible.value = false;
  };
  const handleReset = () => {
    formData.value.storeTagList = [];
  };

  const storeTagList = ref([]);
  onMounted(async () => {
    const { data } = await getStoreTagListApi('shopee');
    storeTagList.value = (data || []).map((v) => ({ ...v, id: v.name }));
    if (!isBacth.value) {
      const { data } = await getStoreInfoApi(props.editInfo.id);
      const { id, storeTagListStr } = data;
      formData.value.configId = id;
      if (storeTagListStr) {
        formData.value.storeTagList = storeTagListStr.split(',');
      }
    } else {
      formData.value.removeStoreTagList = [];
      formData.value.addStoreTagList = [];
    }
  });

  const formRef = ref();
  const formData = ref({});
  const formRules = reactive({});

  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const params = {};
        let saveApi = '';
        if (isBacth.value) {
          const { addStoreTagList = [], removeStoreTagList = [] } =
            formData.value;
          if (!addStoreTagList?.length && !removeStoreTagList?.length) {
            return ElMessage.warning('请选择标签添加或移除！');
          }
          if (addStoreTagList?.length && removeStoreTagList?.length) {
            const sameTag = addStoreTagList.some((item) =>
              removeStoreTagList.includes(item)
            );
            if (sameTag) {
              return ElMessage.warning('同一标签无法同时添加与移除！');
            }
          }
          params.storeAcctIdList = props.selectRecords.map((v) => v.id);
          saveApi = batchUpdateStoreTagApi;
        } else {
          params.storeAcctId = props.editInfo.id;
          params.storeTagListStr = formData.value.storeTagList.join();
          saveApi = saveOrUpdateStoreTagApi;
        }

        try {
          const { msg } = await saveApi({ ...formData.value, ...params });
          ElMessage.success(isBacth.value ? '已成功添加/移除标签！' : msg);
          emits('search');
          closeDialog();
        } catch (err) {
          console.log('err :>> ', err);
        }
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
  .w300 {
    width: 300px;
  }

  .next-line-item {
    width: 100%;
    margin-top: 10px;
  }
</style>
