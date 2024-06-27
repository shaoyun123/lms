<template>
  <!-- 生成全球商品 -->
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="生成待刊登信息"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRule" size="default">
        <el-form-item label="发布店铺" prop="salesSiteList">
          <ZSelect
            v-model="formData.storeAcctIdList"
            :items="storeList"
            :num="1"
            :disabled-val="storeAcctName"
          />
        </el-form-item>
        <div>
          <el-text type="info">
            1.店铺中若存在已生成或已刊登的商品与已选商品相同，已选商品将不生成待刊登数据；
          </el-text>
        </div>
        <div class="mt05">
          <el-text type="info"
            >已生成：查询店铺刊登表中状态为待刊登、刊登中、刊登失败，7日内刊登成功的商品
          </el-text>
        </div>
        <div class="mt05">
          <el-text type="info">
            已刊登：店铺在线商品表中状态为1-草稿、2-审核中、3-审核失败、4-在线、5-卖家下架、6-平台下架、7-已冻结的商品
          </el-text>
        </div>
        <div>
          <el-text type="info">
            2.若今日店铺剩余可刊登数量为0，已选商品
          </el-text>
          <span>
            <el-select v-model="isAllowIgnoreLimitGenerateProduct">
              <el-option label="不再生成待刊登数据" :value="false"></el-option>
              <el-option label="生成待刊登数据" :value="true"></el-option>
            </el-select>
          </span>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            :loading="btnLoading"
            type="primary"
            @click="handlePublish(formRef, 'create')"
            >立即生成</el-button
          >
          <el-button
            :loading="publishBtnLoading"
            type="primary"
            @click="handlePublish(formRef, 'createPublish')"
            >立即生成并刊登</el-button
          >
          <el-button @click="dialogVisible = false"> 取消 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, reactive, watch } from 'vue';
  import {
    genListingApi,
    getListingPublishApi
  } from '@/api/publishs/tiktokpublish';
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

  const btnLoading = ref(false);
  const publishBtnLoading = ref(false);
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
  const isAllowIgnoreLimitGenerateProduct = ref(false);

  const storeAcctName = computed(() => {
    let storeName = [];
    props.storeList.forEach((item) => {
      if (item.id === props.storeAcctId) {
        storeName.push(item.name);
      }
    });
    return storeName;
  });

  const handlePublish = async (formEl, type) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        try {
          type === 'create'
            ? (btnLoading.value = true)
            : (publishBtnLoading.value = true);
          const { storeAcctIdList } = formData;
          const params = [];
          props.rowCheckedList.value.forEach((v) => {
            storeAcctIdList.forEach((item) => {
              let obj = {
                storeAcctId: item,
                prodPId: v.prodPId,
                prodPSku: v.prodPSku,
                isAllowIgnoreLimitGenerateProduct:
                  isAllowIgnoreLimitGenerateProduct.value
              };
              params.push(obj);
            });
          });
          const { data, msg } =
            type === 'create'
              ? await genListingApi(params)
              : await getListingPublishApi(params);
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
                    if (type === 'createPublish') {
                      emits('handleRefresh');
                    }
                  }
                  dialogVisible.value = false;
                }
              });
            } else {
              ElMessage.success(msg || '操作成功');
              dialogVisible.value = false;
              emits('handleSearch');
              if (type === 'createPublish') {
                emits('handleRefresh');
              }
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
          type === 'create'
            ? (btnLoading.value = false)
            : (publishBtnLoading.value = false);
        }
      }
    });
  };
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        formData.storeAcctIdList = [props.storeAcctId];
        isAllowIgnoreLimitGenerateProduct.value = false;
      }
    }
  );
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .mt05 {
    margin-top: 5px;
  }
</style>
