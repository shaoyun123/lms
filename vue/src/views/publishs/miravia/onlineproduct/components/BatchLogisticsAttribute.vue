<template>
  <el-dialog
    v-model="dialogVisible"
    width="45%"
    align-center
    title="修改物流属性"
    @close="handleClose"
  >
    <div class="content">
      <div class="flex justify-end">
        <el-select
          v-model="formData.attrValueIdList"
          placeholder="请选择"
          style="margin-right: 4px"
          size="small"
          multiple
          collapse-tags
          collapse-tags-tooltip
          clearable
        >
          <el-option
            v-for="item in hazmatOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
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
        <template #origin_logistics_attribute="{ row }">
          <div>
            {{
              row.hazmatPropertyDtoList.map((item) => item.attrValue).join(',')
            }}
          </div>
        </template>
        <!-- 修改为 -->
        <template #new_logistics_attribute="{ row }">
          <div>
            <el-select
              v-model="row.attrValueIdList"
              placeholder="请选择"
              style="margin-right: 4px"
              size="small"
              multiple
              collapse-tags
              collapse-tags-tooltip
              clearable
            >
              <el-option
                v-for="item in hazmatOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </template>
        <template #operate_result="{ row }">
          <div :class="row.operResult === 1 ? 'color_success' : 'color_error'">
            {{ row.operDesc }}
          </div>
        </template>
      </vxe-grid>
    </div>
  </el-dialog>
</template>

<script setup>
  import { computed, watch, onMounted, ref, reactive } from 'vue';
  import {
    getListHazmatOptionsApi,
    getHazmatDetail,
    submitHazmatDetail
  } from '@/api/publishs/miraviaonline';
  import { ElMessage } from 'element-plus';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedIdList: {
      type: Array,
      default: () => []
    }
  });
  const emits = defineEmits(['update:modelValue']);

  const formData = reactive({
    attrValueIdList: [] // 物流属性多选
  });

  onMounted(() => {
    getListHazmatOptions();
  });

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
      if (!val) {
        handleClose();
        formData.attrValueIdList = [];
      } else {
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
        field: 'prodPSku',
        title: '商品父SKU'
      },
      {
        title: '原物流属性',
        width: 180,
        slots: {
          default: 'origin_logistics_attribute'
        }
      },
      {
        title: '修改为',
        width: 180,
        slots: {
          default: 'new_logistics_attribute'
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

  const hazmatOptions = ref([]);
  const hazmatAttrNameId = ref('');

  // 获取商品物流属性
  const getListHazmatOptions = async () => {
    const { data } = await getListHazmatOptionsApi();
    hazmatOptions.value = data.optionalValueList;
    hazmatAttrNameId.value = data.attrNameId;
  };

  // 获取列表
  const queryList = async () => {
    tableLoading.value = true;
    const { data } = await getHazmatDetail(props.checkedIdList).finally(
      () => (tableLoading.value = false)
    );
    gridOptions.data = data.map((item) => {
      item.operDesc = '';
      item.operResult = '';
      item.attrValueIdList = [];
      return item;
    });
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

  // 将选中的物流属性转为后端需要的数组
  const transformHazmatOptions = (attrValueIdList) => {
    const options = hazmatOptions.value
      .filter((item) => attrValueIdList.includes(item.id))
      .map((item) => {
        return {
          attrNameId: hazmatAttrNameId.value,
          attrValueId: item.id,
          attrValue: item.name
        };
      });
    return options;
  };

  // 一键应用
  const BatchApply = () => {
    if (!isSelected()) return ElMessage.warning('请选择数据！');
    if (!formData.attrValueIdList.length)
      return ElMessage.warning('请选择物流属性！');

    checkedList.value.forEach((item) => {
      item.attrValueIdList = formData.attrValueIdList;
    });
  };

  // 提交 注:必须勾选数据 但是勾选了也可以不修改
  const submitbatchUpdate = async () => {
    if (!isSelected()) return ElMessage.warning('请选择数据！');

    tableLoading.value = true;
    const tableData = checkedList.value.map((item) => {
      return {
        id: item.id,
        storeAcctId: item.storeAcctId,
        prodPId: item.prodPId,
        prodPSku: item.prodPSku,
        productId: item.productId,
        hazmatPropertyDtoList: item.attrValueIdList.length
          ? transformHazmatOptions(item.attrValueIdList)
          : []
      };
    });
    const { msg, data } = await submitHazmatDetail(tableData).finally(
      () => (tableLoading.value = false)
    );
    ElMessage.success(msg);

    // 渲染操作结果
    checkedList.value = checkedList.value.forEach((item) => {
      data.forEach((cItem) => {
        if (item.productId === cItem.productId) {
          (item.operDesc = cItem.operDesc),
            (item.operResult = cItem.operResult);
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
