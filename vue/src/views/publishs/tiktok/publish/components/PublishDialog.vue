<template>
  <!-- 立即刊登 -->
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="立即刊登"
      width="600px"
      :close-on-click-modal="false"
      @close="dialogVisible = false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRule" size="default">
        <el-form-item label="刊登店铺" prop="salesSiteList">
          <ZSelect
            v-model="formData.storeAcctIdList"
            :items="storeList"
            :disabled-val="storeAcctName"
            :num="1"
          />
        </el-form-item>
        <div>
          <el-text type="info">
            若选择的店铺里存在选中模板待刊登数据，将同步刊登；<br />
            若刊登时无剩余刊登量，则留存在待刊登数据
          </el-text>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            :loading="btnLoading"
            type="primary"
            @click="handlePublish(formRef)"
            >立即刊登</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, reactive, watch } from 'vue';
  import { publishListingApi } from '@/api/publishs/tiktokpublish';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import ZSelect from '@/components/ZSelect/index.vue';

  // eslint-disable-next-line
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    },
    storeList: {
      type: Array,
      default: () => []
    },
    storeAcctId: {
      type: Number,
      default: null
    },
    isRepublish: {
      type: String,
      default: ''
    }
  });
  // eslint-disable-next-line
  const emits = defineEmits([
    'update:modelValue',
    'handleSearch',
    'handleRefresh'
  ]);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const storeAcctName = computed(() => {
    let storeName = [];
    props.storeList.forEach((item) => {
      if (item.id === props.storeAcctId) {
        storeName.push(item.name);
      }
    });
    return storeName;
  });

  const btnLoading = ref(false);
  const formRef = ref();
  const formData = reactive({ storeAcctIdList: [] });
  const formRule = ref({
    storeAcctIdList: {
      type: 'array',
      required: true,
      message: '请至少选择一个店铺',
      trigger: 'change'
    }
  });

  const needFresh = ref(false);
  const handlePublish = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        try {
          btnLoading.value = true;
          const { storeAcctIdList } = formData;
          const prodPIdList = [];
          props.rowCheckedList.value.forEach((v) => {
            prodPIdList.push(v.prodPId);
          });
          let params = {
            prodPIdList,
            storeAcctIdList
          };
          if (props.isRepublish === 'republish') {
            params.republish = true;
          }
          const { msg, data } = await publishListingApi(params);

          if (Array.isArray(data)) {
            const failList = data.filter((item) => !item.success);
            if (failList.length) {
              const failMsg = failList
                .map(
                  (item) =>
                    `<span style="color:#409EFF">${item.prodPSku}</span>` +
                    ': ' +
                    String(item.storeAcct || '') +
                    item.operationMessage
                )
                .join('\n');
              const failHtml = `<div style="white-space:pre-line">${failMsg}</div>`;
              ElMessageBox.alert(failHtml || '请求失败', '失败信息', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确认',
                type: 'error',
                callback: () => {
                  if (failList?.length !== data?.length) {
                    emits('handleSearch');
                  }
                  dialogVisible.value = false;
                }
              });
            } else {
              ElMessage.success(msg || '操作成功');
              dialogVisible.value = false;
              emits('handleSearch');
              needFresh.value = true;
            }
          } else {
            ElMessageBox.alert(msg, '失败信息', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确认',
              type: 'error'
            });
          }
        } catch (err) {
          console.log('err :>> ', err);
        } finally {
          btnLoading.value = false;
        }
      }
    });
  };
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        formData.storeAcctIdList = [props.storeAcctId];
      }
      if (!val) {
        formRef.value.resetFields();
        if (needFresh.value) {
          emits('handleSearch');
          emits('handleRefresh');
          needFresh.value = false;
        }
      }
    },
    {
      immediate: true
    }
  );
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .mt05 {
    margin-top: 5px;
  }
</style>
