<template>
  <div class="">
    <el-dialog
      v-model="dialogVisible"
      width="40%"
      style="padding: 0 10px"
      title="多店铺刊登"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          :model="form"
          :rules="formRule"
          label-width="120px"
          label-position="right"
        >
          <el-form-item label="刊登店铺" prop="storeAcctIds">
            <el-select
              v-model="form.storeAcctIds"
              style="width: 280px"
              filterable
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="2"
              @change="changeStoreList"
            >
              <el-option
                v-for="item in storeOption"
                :key="item.id"
                :label="item.storeAcct"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选中视频">
            <el-switch v-model="form.selectVideo" />
          </el-form-item>

          <hr />
          <div>
            <el-form-item label="欧盟责任人"></el-form-item>
            <el-form-item
              v-for="item in EUResponseOption"
              :key="item.id"
              :label="item.storeAcct"
              prop="name"
            >
              <el-select v-model="item.msrEuId">
                <el-option
                  v-for="opt in item.options"
                  :key="opt.msrEuId"
                  :label="opt.msrEuName"
                  :value="opt.msrEuId"
                />
              </el-select>
              <el-button class="ml-16" type="primary" @click="handleAsync(item)"
                >同步</el-button
              >
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="publishRightNowOrCreate(2)">
            立即刊登
          </el-button>
          <el-button @click="publishRightNowOrCreate(1)">批量生成</el-button>
          <el-button @click="cancelCreate">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { computed, watch, ref, reactive } from 'vue';
  import { getStoreInfo } from '@/api/eBay/payments';
  import {
    getListEuResponsiblePersonsByStoreAcctIdsApi,
    batchSaveOrPublishListingApi
  } from '@/api/publishs/aefullyhostedpublish';
  import { synchronizationEU } from '@/api/multiplatform/aesupportprod';
  import useUserStore from '@/store/modules/user';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedStoreAccIdList: {
      type: Array,
      default: () => []
    },
    checkedRowList: {
      type: Array,
      default: () => []
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

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        await getStoreList();
        form.storeAcctIds = JSON.parse(
          JSON.stringify(props.checkedStoreAccIdList)
        );
        EUResponseOption.value = [];
        form.selectVideo = false;
        getEUResponseOption();
      } else if (needFresh.value) {
        emits('handleSearch');
      }
    }
  );

  const formRule = ref({
    storeAcctIds: [
      { required: true, trigger: 'change', message: '请选择刊登店铺' }
    ]
  });

  const form = reactive({
    storeAcctIds: [], // 选中的店铺列表
    selectVideo: false // 是否选中视频
  });
  const needFresh = ref(false);

  // 获取用户名
  const { userInfo } = useUserStore();
  let userName = computed(() => userInfo.userName);

  // 获取店铺枚举
  const storeOption = ref([]);
  const getStoreList = async () => {
    try {
      let params = {
        roleNames: 'AE全托管专员',
        orgId: '',
        salePersonId: '',
        platCode: 'AE全托管',
        lmsAppUserName: userName.value
      };
      const { data } = await getStoreInfo(params);
      storeOption.value = data;
    } catch (err) {
      console.log(err);
    }
  };

  // 查询欧盟责任人
  const EUResponseOption = ref([]);
  const getEUResponseOption = async () => {
    const { data } = await getListEuResponsiblePersonsByStoreAcctIdsApi(
      form.storeAcctIds
    );

    storeOption.value.forEach((item) => {
      if (form.storeAcctIds.includes(item.id)) {
        const newItem = JSON.parse(JSON.stringify(item));
        newItem.options = data.filter(
          (opt) => Number(opt.storeAcctId) === Number(item.id)
        );
        newItem.msrEuId = '';
        EUResponseOption.value.push(newItem);
      }
    });
  };

  // 改变店铺选中
  const changeStoreList = (val) => {
    EUResponseOption.value = [];
    if (val.length === 0) {
      return ElMessage.warning('店铺不能为空！');
    }
    getEUResponseOption();
  };

  // 点击同步
  const handleAsync = async (item) => {
    const leafCategoryIdList = props.checkedRowList.map((item) => item.cateId);
    const { code, msg } = await synchronizationEU({
      storeAcctId: item.id,
      leafCategoryIdList
    });
    if (code === '0000') {
      ElMessage.success(msg);
    } else {
      ElMessage.error(msg);
    }
  };

  // 立即刊登 批量生成
  const publishRightNowOrCreate = async (type) => {
    const { code, msg } = await batchSaveOrPublishListingApi({
      listingType: type,
      aliexpressTplIds: props.checkedRowList.map((item) => item.modelPId),
      storeAcctIds: form.storeAcctIds,
      selectVideo: form.selectVideo,
      euResponsibles: EUResponseOption.value
        .filter((item) => item.msrEuId !== '')
        .map((item) => {
          return {
            storeAcctId: item.id,
            msrEuId: item.msrEuId
          };
        })
    });
    if (code === '0000') {
      ElMessage.success(msg || '提交成功！');
      cancelCreate();
      needFresh.value = true;
    } else {
      ElMessageBox.alert(msg || '请求失败', '错误信息', {
        confirmButtonText: '确认',
        type: 'error'
      });
    }
  };

  // 取消
  const cancelCreate = () => {
    EUResponseOption.value = [];
    form.storeAcctIds = [];
    form.selectVideo = false;
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  .ml-16 {
    margin-left: 16px;
  }
</style>
