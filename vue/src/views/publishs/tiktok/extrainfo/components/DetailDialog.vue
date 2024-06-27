<template>
  <div class="detail_wrapper">
    <el-dialog
      v-model="dialogVisible"
      :title="isBatch ? '批量修改补充信息' : '修改补充信息'"
      width="1000"
      align-center
      :close-on-click-modal="false"
    >
      <el-card>
        <el-form
          ref="formRef"
          :rules="formRules"
          :model="formData"
          size="default"
          scroll-to-error
          :label-width="130"
          class="dialog_form"
        >
          <el-form-item
            label="TikTok类目"
            prop="categoryId"
            class="cate_cascader"
          >
            <el-cascader
              v-model="formData.categoryId"
              :options="tiktokCateList"
              clearable
              filterable
              collapse-tags
              :props="{
                label: 'cnName',
                value: 'categoryId'
              }"
              @change="handleChangeCate"
            />
          </el-form-item>
          <el-form-item label="商品属性" prop="useDefaultMapping">
            <el-checkbox
              v-model="formData.useDefaultMapping"
              label="必填项使用类目必填项数据（有修改时将同步修改）"
              @change="handdleUseDefaultVal"
            ></el-checkbox>
          </el-form-item>
          <div class="disflex">
            <div>
              <el-form-item
                v-for="item in attrList"
                :key="item.attributeId"
                :label="item.attributeName"
                label-width="200px"
                :prop="item.attributeId.toString()"
              >
                <el-select-v2
                  v-if="item?.platCateAttrValueList?.length"
                  v-model="item.checkValue"
                  :options="item._platCateAttrValueList"
                  filterable
                  clearable
                  :collapse-tags="item.isMultipleSelected"
                  :collapse-tags-tooltip="item.isMultipleSelected"
                  :multiple="item.isMultipleSelected"
                  :allow-create="item.isCustomized"
                  default-first-option
                  :reserve-keyword="false"
                  :disabled="item.isMandatory && formData.useDefaultMapping"
                  :placeholder="item.isCustomized ? '请选择/输入' : '请选择'"
                >
                </el-select-v2>
                <el-input
                  v-else
                  v-model="item.checkValue"
                  :disabled="item.isMandatory && formData.useDefaultMapping"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </div>
            <div v-if="isSizeChartMandatory" class="ml20">
              <el-form-item label="尺寸图" prop="sizeChartImgUrl">
                <UploadOneImg
                  v-model="formData.sizeChartImgUrl"
                  height="200px"
                  width="200px"
                  :params="{ prodPIds: prodPIdList, platCode: 'tiktok' }"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>
      <template #footer>
        <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import {
    getCateInfoApi,
    getCategoryInfoApi
  } from '@/api/publishs/tiktokpublish';
  import {
    batchSaveOrUpdateApi,
    getDefaultValApi
  } from '@/api/publishs/tiktokextrainfo';
  import UploadOneImg from '@/components/UploadOneImg/index.vue';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: true
    },
    isBatch: {
      type: Boolean,
      default: true
    },
    tiktokCateList: {
      type: Array,
      default: () => []
    },
    checkedList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue', 'handleSearch', 'fresh']);
  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });

  const formData = ref({});
  const formRules = ref({
    categoryId: [
      { required: true, trigger: 'change', message: '请选择TikTok类目' }
    ],
    sizeChartImgUrl: [
      { required: true, trigger: 'change', message: '请上传图片' }
    ]
  });
  const formRef = ref();

  let prodPIdList = [];
  onMounted(async () => {
    prodPIdList = props.checkedList.map((item) => item.prodPId);
    if (!props.isBatch) {
      formData.value.categoryId = props.checkedList[0].categoryId;
      await handleChangeCate();
      formData.value.useDefaultMapping =
        props.checkedList[0].useDefaultMapping || false;
      formData.value.sizeChartImgUrl = props.checkedList[0].sizeChartImgUrl;
      const { specificsTiktokDtoList } = props.checkedList[0];
      assignAttrValue(specificsTiktokDtoList);
    }
  });
  const assignAttrValue = (specificsTiktokDtoList) => {
    if (specificsTiktokDtoList.length) {
      const valueObj = {};
      specificsTiktokDtoList.forEach((item) => {
        valueObj[item.attributeId] = item;
      });
      // 类目赋值
      attrList.value.forEach((item) => {
        if (valueObj[item.attributeId]) {
          // 多选
          if (item.isMultipleSelected) {
            item.checkValue = valueObj[item.attributeId].valueList.map((v) =>
              item.isCustomized ? v?.id || v.name : v.id
            );
            // 单选，输入框
          } else {
            const curValue = valueObj[item.attributeId].valueList[0];
            item.checkValue = item.isCustomized
              ? curValue?.id || curValue.name
              : curValue.id;
          }
        }
      });
    }
  };
  const attrList = ref({});
  const isSizeChartMandatory = ref(false);
  const handleChangeCate = async () => {
    if (categoryId.value) {
      const param = categoryId.value;
      await Promise.all([
        getCateInfoApi(param),
        getCategoryInfoApi(param)
      ]).then((res) => {
        isSizeChartMandatory.value = res[1].data?.isSizeChartMandatory;
        // 商品类目
        attrList.value = res[0].data
          .filter((item) => item.attributeType === 3)
          .map((item) => ({
            ...item,
            checkValue: item.isMultipleSelected ? [] : null,
            platCateAttrValueList: item.platCateAttrValueList || [],
            // 用到select-v2
            _platCateAttrValueList: (item.platCateAttrValueList || []).map(
              (v) => ({ value: v.id, label: v.name })
            )
          }));
      });
    } else {
      isSizeChartMandatory.value = false;
      attrList.value = [];
    }
    formData.value.useDefaultMapping = false;
    // 类目必填项添加校验
    addAttrRequiredValidate();
    if (isSizeChartMandatory.value) {
      formRules.value.sizeChartImgUrl[0].required = true;
    } else {
      formRules.value.sizeChartImgUrl[0].required = false;
      formData.value.sizeChartImgUrl = '';
    }
  };
  // 类目必填项添加校验;
  const addAttrRequiredValidate = () => {
    // 之前类目必填项的校验删除
    Object.keys(formRules.value).forEach((item) => {
      if (Number(item)) {
        delete formRules.value[item];
      }
    });
    attrList.value.forEach((item) => {
      if (item.isMandatory) {
        if (item.platCateAttrValueList.length && item.isMultipleSelected) {
          //多选
          formRules.value[item.attributeId] = {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (item.checkValue.length) {
                callback();
              } else {
                callback(new Error('请输入'));
              }
            }
          };
        } else {
          //输入框,单选
          formRules.value[item.attributeId] = {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (item.checkValue) {
                callback();
              } else {
                callback(new Error('请选择'));
              }
            }
          };
        }
      }
    });
  };
  // 图片校验
  watch(
    () => formData.value.sizeChartImgUrl,
    () => {
      formRef.value?.validateField('sizeChartImgUrl');
    }
  );
  const handdleUseDefaultVal = async () => {
    if (formData.value.useDefaultMapping) {
      const { data } = await getDefaultValApi(categoryId.value);
      // 有必填项数据，需要把商品属性之前的值给清空，再赋值
      if (data?.length) {
        const _data = data.map((item) => ({
          ...item,
          valueList: [
            {
              name: item.defaultValue,
              id: item.defaultValueId
            }
          ]
        }));
        assignAttrValue(_data);
      }
    }
  };
  const categoryId = computed(() => {
    const _categoryId = formData.value.categoryId;
    if (Array.isArray(_categoryId)) {
      return _categoryId[_categoryId.length - 1];
    }
    return _categoryId;
  });
  const getHasAttrCheckedValue = () => {
    let arr = [];
    attrList.value.forEach((item) => {
      if (item.checkValue?.length || typeof item.checkValue === 'number') {
        let valueList = [];
        if (Array.isArray(item.checkValue)) {
          valueList = item.checkValue.map((v) => {
            if (typeof v === 'number') {
              const curV = item.platCateAttrValueList.filter(
                (elem) => elem.id === v
              )[0];
              return curV;
            } else {
              return { name: v };
            }
          });
        } else {
          if (typeof item.checkValue === 'number') {
            const curV = item.platCateAttrValueList.filter(
              (elem) => elem.id === item.checkValue
            )[0];
            valueList.push(curV);
          } else {
            valueList.push({ name: item.checkValue });
          }
        }
        let obj = {
          attributeId: item.attributeId,
          attributeName: item.attributeName,
          attributeType: item.attributeType,
          isCustomized: item.isCustomized,
          isMandatory: item.isMandatory,
          isMultipleSelected: item.isMultipleSelected,
          valueList
        };
        arr.push(obj);
      }
    });
    return arr;
  };
  const handleSave = async (formEl) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
      if (valid) {
        // 获取有值的商品属性
        let attrCheckedList = getHasAttrCheckedValue();
        // 参数
        const params = [];
        props.checkedList.forEach((item) => {
          let obj = {
            prodPId: item.prodPId,
            sizeChartImgUrl: formData.value.sizeChartImgUrl,
            useDefaultMapping: formData.value.useDefaultMapping || false,
            categoryId: categoryId.value,
            specifics: JSON.stringify(attrCheckedList)
          };
          if (item.id) {
            obj.id = item.id;
          }
          params.push(obj);
        });
        const { msg, data } = await batchSaveOrUpdateApi(params);
        const failList = data
          .filter((item) => !item.success)
          .map((item) => item.prodPSku);
        if (failList.length) {
          ElMessage.warning(failList.join() + '，操作失败，其余成功');
        } else {
          ElMessage.success(msg);
        }
        emits('handleSearch');
        emits('fresh');
        dialogVisible.value = false;
      }
    });
  };
</script>

<style lang="scss" scoped>
  .disflex {
    display: flex;
  }
  .ml20 {
    margin-left: 20px;
  }
  .detail_wrapper {
    :deep(.el-card__body) {
      max-height: 600px;
      min-height: 300px;
      overflow: auto;
    }
    :deep(.el-select-v2) {
      width: 100%;
    }
    :deep(.el-select-v2__input-wrapper) {
      flex: 1;
    }
    .cate_cascader {
      :deep(.el-cascader) {
        width: 350px;
      }
    }
  }
</style>
