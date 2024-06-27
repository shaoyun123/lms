<template>
  <div>
    <el-dialog
      :model-value="showDialog"
      title="批量生成店铺商品"
      width="30%"
      align-center
      @close="close"
    >
      <el-form ref="formRef" :model="formData" size="default">
        <el-form-item label="刊登店铺" prop="salesSiteList">
          <ZSelect
            v-model="formData.storeAcctIdList"
            :items="storeList"
            :num="3"
          />
        </el-form-item>
        <div>
          <el-text type="danger">仅支持选择有开发者账号的店铺！</el-text>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handlePublish(formRef, false)"
            >立即生成</el-button
          >
          <el-button type="primary" @click="handlePublish(formRef, true)"
            >立即生成并刊登</el-button
          >
          <el-button @click="close"> 取消 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 失败弹窗 -->
    <el-dialog
      v-model="failVisible"
      align-center
      title="错误信息"
      width="500"
      class="fail_box"
      style="overflow-y: auto; max-height: 55%"
      @close="failVisible = false"
    >
      <div v-html="failContent"></div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="failVisible = false"
            >关闭</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  import ZSelect from '@/components/ZSelect/index.vue';
  import {
    getListTemuValidStore,
    batchGenListingApi
  } from '@/api/publishs/temupublish';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    storeAccId: {
      type: Number,
      default: null
    },
    prodPIdAndPSkuList: {
      type: Array,
      default: () => []
    }
  });

  const emits = defineEmits(['close']);

  onMounted(() => {
    getTemuValidStoreList();
  });

  const formRef = ref();
  const formData = reactive({ storeAcctIdList: [] });
  const failVisible = ref(false);
  const failContent = ref('');

  const storeList = ref([]);
  // 获取所有有开发者账号的店铺列表
  const getTemuValidStoreList = async () => {
    const { code, data } = await getListTemuValidStore({
      roleNames: 'temu专员',
      orgId: '',
      salePersonId: ''
    });
    if (code === '0000') {
      storeList.value =
        data?.map((item) => ({
          id: item.id,
          name: item.storeAcct
        })) || [];
      formData.storeAcctIdList = [props.storeAccId];
    }
  };

  // 批量生成 立即生成 false 生成并刊登 true
  const handlePublish = async (formEl, type) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        if (!formData.storeAcctIdList.length) {
          return ElMessage.warning('请至少选择一个店铺！');
        }
        const res = await batchGenListingApi({
          storeAcctIdList: formData.storeAcctIdList,
          prodPIdAndPSkuList: props.prodPIdAndPSkuList,
          publishNow: type,
          salesSite: 'US' // temu站点只有美国
        });
        // msg有返回 代表失败
        if (!res.msg) {
          ElMessage.success('操作成功！');
        } else {
          failVisible.value = true;
          failContent.value = res.msg;
        }
      }
    });
  };

  const close = () => {
    emits('close');
  };
</script>

<style lang="scss" scoped>
  .fail_box {
    word-break: break-all;
  }
</style>
