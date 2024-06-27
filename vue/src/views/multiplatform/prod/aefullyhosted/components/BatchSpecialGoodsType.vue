<template>
  <el-dialog
    v-model="dialogVisible"
    width="55%"
    align-center
    title="修改特殊商品类型"
    @close="handleClose"
  >
    <div class="content">
      <div class="flex justify-end">
        <el-select
          v-model="formData.specialProductType"
          placeholder="请选择"
          style="margin-right: 4px; width: 150px"
          size="small"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="2"
          clearable
        >
          <el-option
            v-for="item in specialGoodsEnumTypeOption"
            :key="item"
            :label="item"
            :value="item"
            :disabled="isOptionDisabled(formData.specialProductType, item)"
          />
        </el-select>
        <el-button style="margin-right: 60px" type="primary" @click="BatchApply"
          >一键应用</el-button
        >
        <el-button type="primary" @click="submitbatchUpdate"
          >提交修改</el-button
        >
      </div>
      <vxe-grid v-bind="gridOptions" ref="tableRef" class="mt-4">
        <template #origin_special_type="{ row }">
          <div>
            {{ row.specialProductTypeList.join(',') }}
          </div>
        </template>
        <!-- 修改为 -->
        <template #new_special_type="{ row }">
          <div>
            <el-select
              v-model="row.updateSpecialProductTypeEnum"
              placeholder="请选择"
              style="margin-right: 4px"
              size="small"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="1"
            >
              <el-option
                v-for="item in specialGoodsEnumTypeOption"
                :key="item"
                :label="item"
                :value="item"
                :disabled="
                  isOptionDisabled(row.updateSpecialProductTypeEnum, item)
                "
              />
            </el-select>
          </div>
        </template>
        <template #operate_result="{ row }">
          <div
            v-if="row.result || row.remark"
            :class="row.result === true ? 'color_success' : 'color_error'"
          >
            {{ row.remark }}
          </div>
        </template>
      </vxe-grid>
    </div>
  </el-dialog>
</template>

<script setup>
  import { computed, watch, onMounted, ref, reactive } from 'vue';
  import {
    getSpecialGoodsEnumType,
    getEditSpecialProductTypeInfo,
    editSpecialProductType
  } from '@/api/publishs/aefullyhosted';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkProdIdList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue']);

  const formData = reactive({
    specialProductType: [] // 批量应用的下拉框
  });

  onMounted(() => {
    getSpecialProductTypeEnumOption();
  });

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const needFresh = ref(false);
  watch(
    () => dialogVisible.value,
    async (val) => {
      if (!val) {
        handleClose();
        formData.specialProductType = [];
        needFresh.value && emits('handleSearch', 1, 100);
      } else {
        needFresh.value = false;
        queryList();
      }
    }
  );

  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 280;
  });

  const tableLoading = ref(false);

  const gridOptions = reactive({
    border: true,
    showOverflow: true,
    loading: tableLoading,
    height: height,
    scrollY: {
      gt: 20
    },
    rowConfig: {
      isHoverRow: true
    },
    columnConfig: {
      resizable: true
    },
    columns: [
      { type: 'checkbox', width: 43 },
      {
        field: 'storeAcct',
        title: '店铺'
      },
      {
        field: 'productId',
        title: '商品编号'
      },
      {
        field: 'sellerSku',
        title: '商品子SKU'
      },
      {
        field: 'logisAttrListStr',
        title: 'OA物流属性'
      },
      {
        title: '原特殊商品类型',
        width: 120,
        slots: {
          default: 'origin_special_type'
        }
      },
      {
        title: '修改为',
        width: 180,
        slots: {
          default: 'new_special_type'
        }
      },
      {
        title: '操作结果',
        width: 120,
        slots: {
          default: 'operate_result'
        }
      }
    ],
    data: []
  });

  const specialGoodsEnumTypeOption = ref([]);

  // 获取特殊商品类型
  const getSpecialProductTypeEnumOption = async () => {
    const { data } = await getSpecialGoodsEnumType();
    specialGoodsEnumTypeOption.value = data.specialProductTypeEnum;
  };

  // 特殊商品类型 普货与 （内电/弱磁） 互斥
  const isOptionDisabled = (selectList, optionValue) => {
    const specialOption = ['内电', '弱磁', '粉末', '膏体', '液体'];
    if (optionValue === '普货') {
      return Boolean(
        selectList.length &&
          selectList.some((option) => specialOption.includes(option))
      );
    } else if (specialOption.includes(optionValue)) {
      return Boolean(selectList.length && selectList.includes('普货'));
    } else {
      return false;
    }
  };

  // 获取列表
  const queryList = async () => {
    tableLoading.value = true;
    const { data } = await getEditSpecialProductTypeInfo(
      props.checkProdIdList
    ).finally(() => (tableLoading.value = false));
    gridOptions.data = data;
  };

  // 校验是否勾选了数据
  const tableRef = ref(null);
  const checkedList = ref([]);
  const isSelected = () => {
    checkedList.value = tableRef.value.getCheckboxRecords();
    if (!checkedList.value.length) {
      return false;
    } else {
      return true;
    }
  };

  // 一键应用
  const BatchApply = () => {
    if (!isSelected()) return ElMessage.warning('请选择数据！');
    if (!formData.specialProductType.length)
      return ElMessage.warning('请选择特殊商品属性！');

    checkedList.value.forEach((item) => {
      item.updateSpecialProductTypeEnum = formData.specialProductType;
    });
  };

  // 提交 注:必须勾选数据 但是勾选了也可以不修改
  const submitbatchUpdate = async () => {
    if (!isSelected()) return ElMessage.warning('请选择数据！');

    const haveEmpty = checkedList.value.some(
      (item) => !item.updateSpecialProductTypeEnum.length
    );
    if (haveEmpty) {
      return ElMessage.warning('所有勾选数据修改值不能为空！');
    }

    const withoutSSku = checkedList.value.some((item) => !item.sellerSku);
    if (withoutSSku) {
      return ElMessage.warning('存在商品子sku为空，无法修改，请重新选择！');
    }
    tableLoading.value = true;

    const { msg, data } = await editSpecialProductType(
      checkedList.value
    ).finally(() => (tableLoading.value = false));
    needFresh.value = true;
    ElMessage.success(msg);

    // 渲染操作结果
    checkedList.value = checkedList.value.forEach((item) => {
      data.forEach((cItem) => {
        if (item.productId === cItem.productId) {
          item.result = cItem.result;
          item.remark = cItem.remark;
        }
      });
    });
  };

  const handleClose = () => {
    dialogVisible.value = false;
  };
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
    align-items: center;
  }
  .justify-end {
    justify-content: end;
  }
  .mt-4 {
    margin-top: 16px;
  }
  .color_success {
    color: #67c23a;
  }
  .color_error {
    color: #f56c6c;
  }
</style>
