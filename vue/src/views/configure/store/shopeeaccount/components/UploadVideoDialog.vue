<template>
  <div class="fullDialog">
    <el-dialog
      :model-value="dialogVisible"
      title="自动上传视频设置"
      width="800px"
      destroy-on-close
      align-center
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="180"
        size="default"
      >
        <el-form-item label="自动上传视频" prop="autoUploadVideo">
          <el-radio-group v-model="formData.autoUploadVideo">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="mb18">
          <el-text tag="b" class="subtitle">视频上传不处理条件设置：</el-text>
        </div>
        <el-form-item>
          <template #label>
            <el-form-item prop="salesType" style="width: 100%">
              <el-select v-model="formData.salesType" filterable clearable>
                <el-option label="listing7天销量&le;" :value="7"></el-option>
                <el-option label="listing30天销量&le;" :value="30"></el-option>
                <el-option label="listing60天销量&le;" :value="60"></el-option>
                <el-option label="listing90天销量&le;" :value="90"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item prop="salesNum">
            <ZInputNumber
              v-model="formData.salesNum"
              :precision="0"
              :min="0"
              placeholder="填入0或正整数"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="刊登天数&le;" prop="listingDayNums">
          <ZInputNumber
            v-model="formData.listingDayNums"
            :precision="0"
            :min="0"
            placeholder="填入0或正整数"
          />
        </el-form-item>
        <el-form-item label="浏览量+收藏量&le;" prop="viewsPlusLikes">
          <ZInputNumber
            v-model="formData.viewsPlusLikes"
            :precision="0"
            :min="0"
            placeholder="填入0或正整数"
          />
        </el-form-item>
        <el-form-item label="视频标签" prop="videoTagList">
          <ZSelect v-model="formData.videoTagList" :items="videoTagList" />
        </el-form-item>
        <el-form-item label="商品父SKU" prop="prodPSkuListStr">
          <el-input
            v-model="formData.prodPSkuListStr"
            type="textarea"
            :rows="4"
            clearable
            placeholder="支持填入多个，英文逗号隔开"
            @blur="commonDivideComma($event)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
        <el-button @click="closeDialog">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, reactive } from 'vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import {
    getStoreInfoApi,
    updateStoreInfoApi
  } from '@/api/configure/shopeeaccount';
  import { getVideoTagsApi } from '@/api/common/index';
  import { ElMessage } from 'element-plus';
  import { cloneDeep } from 'lodash-es';
  import ZSelect from '@/components/ZSelect/index.vue';
  import { commonDivideComma } from '@/utils/divide';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    editInfo: {
      type: Object,
      default: () => ({})
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

  const closeDialog = () => {
    dialogVisible.value = false;
  };

  let originalObj;
  const videoTagList = ref([]);
  onMounted(async () => {
    Promise.all([getStoreInfoApi(props.editInfo.id), getVideoTagsApi()]).then(
      (res) => {
        originalObj = cloneDeep(res[0].data);
        videoTagList.value = res[1].data.map((v) => ({
          ...v,
          id: v.name
        }));
        if (originalObj.videoTagList) {
          originalObj.videoTagList = originalObj.videoTagList.split(',');
        }
        formData.value = cloneDeep(originalObj);
      }
    );
  });

  const formRef = ref();
  const formData = ref({});
  const formRules = reactive({});
  const handleSave = async (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
      if (valid) {
        const params = { ...formData.value };
        params.videoTagList = (params.videoTagList || []).join();
        try {
          const { msg } = await updateStoreInfoApi({
            storeAcctId: props.editInfo.id,
            ...originalObj,
            ...params
          });
          ElMessage.success(msg);
          closeDialog();
          emits('search');
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
  .mb18 {
    margin-bottom: 18px;
  }
  .subtitle {
    font-weight: bold;
  }
</style>
