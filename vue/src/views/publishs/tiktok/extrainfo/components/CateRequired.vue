<template>
  <el-dialog
    v-model="dialogVisible"
    title="商品属性必填项维护"
    :align-center="true"
    :width="1000"
    :close-on-click-modal="false"
  >
    <el-card ref="searchCardRef" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item label="默认值" prop="haveDefaultValue">
          <el-select v-model="formData.haveDefaultValue" filterable clearable>
            <el-option :value="true" label="有"></el-option>
            <el-option :value="false" label="无"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性名" prop="attributeNameList">
          <el-input
            v-model="formData.attributeNameList"
            clearable
            placeholder="支持多个查询，英文逗号分隔"
            @blur="commonDivideComma"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <el-button @click="handleReset">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-tabs v-model="activeName" class="page_header">
      <el-tab-pane :label="'数量(' + paginationData.total + ')'" name="first">
      </el-tab-pane>
    </el-tabs>
    <vxe-grid ref="tableRef" v-bind="gridOptions" class="mt10">
      <template #edit_defaultValue="{ row }">
        <el-select-v2
          v-if="row.platCateAttrValueList.length"
          v-model="row.defaultValueId"
          :allow-create="row.isCustomized"
          filterable
          clearable
          :teleported="false"
          :options="row._platCateAttrValueList"
          value-key="value"
          @change="handleChangeDefaultValue(row)"
        >
          <!-- <el-option
            v-for="item in row.platCateAttrValueList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          /> -->
        </el-select-v2>
        <el-input
          v-else
          v-model="row.defaultValueId"
          clearable
          @change="handleChangeDefaultValue(row)"
        />
      </template>
      <template #default_operate="{ row }">
        <div v-loading="row.saveLoading">
          <template v-if="hasActiveEditRow(row)">
            <el-button type="success" @click="saveRowEvent(row)"
              >保存</el-button
            >
          </template>
          <template v-else>
            <el-button type="primary" @click="editRowEvent(row)"
              >修改</el-button
            >
          </template>
        </div>
      </template>
    </vxe-grid>
    <div class="pagination">
      <el-pagination
        v-model:currentPage="paginationData.page"
        v-model:page-size="paginationData.limit"
        background
        :page-sizes="[50, 100, 300]"
        :small="true"
        layout="total, sizes, prev, pager, next"
        :total="paginationData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script setup>
  import { computed, reactive, ref, onUnmounted, onMounted } from 'vue';
  import { commonDivideComma } from '@/utils/divide';
  import {
    queryCateReqiuredListApi,
    updateCateReqiuredApi
  } from '@/api/publishs/tiktokextrainfo';
  import { ElMessage } from 'element-plus';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    attributeNames: {
      type: String,
      default: null
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

  const searchCardRef = ref();
  const formData = ref({});
  const formRef = ref();
  const handleReset = () => {
    formRef.value.resetFields();
  };
  onMounted(() => {
    formData.value.attributeNameList = props.attributeNames;
    if (props.attributeNames) {
      handleSearch();
    }
  });
  onUnmounted(() => {
    emits('handleSearch');
  });
  const handleSearch = async () => {
    const params = {
      ...formData.value,
      attributeNameList: formData.value.attributeNameList
        ? formData.value.attributeNameList.split(',')
        : [],
      limit: paginationData.limit,
      page: paginationData.page
    };
    try {
      const { data, count } = await queryCateReqiuredListApi(params);
      gridOptions.data = data.map((item) => ({
        ...item,
        _platCateAttrValueList: item?.platCateAttrValueList?.length
          ? item?.platCateAttrValueList.map((v) => ({
              label: v.name,
              value: v.id
            }))
          : [],
        lastDefaultValue: item.defaultValue,
        _defaultValueId: [null, undefined].includes(item.defaultValueId)
          ? ''
          : item.defaultValueId,
        defaultValueId: dealDefaultValueId(item)
      }));
      paginationData.total = count;
    } catch (err) {
      gridOptions.data = [];
      paginationData.total = 0;
    }
  };
  const dealDefaultValueId = (obj) => {
    let defaultValueId = obj.defaultValueId;
    if (obj.defaultValueId === 0 && !obj.defaultValue) {
      defaultValueId = null;
    } else if (obj.defaultValueId === 0 && obj.defaultValue) {
      defaultValueId = obj.defaultValue;
    }
    return defaultValueId;
  };
  // 分页处理
  const handleSizeChange = (val) => {
    paginationData.page = 1;
    paginationData.limit = val;
    handleSearch();
  };

  const handleCurrentChange = (val) => {
    paginationData.page = val;
    handleSearch();
  };

  const activeName = ref('first');
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });
  const tableRef = ref();
  const gridOptions = reactive({
    border: true,
    showHeaderOverflow: true,
    height: 500,
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true
    },
    columnConfig: {
      resizable: true
    },
    editConfig: {
      trigger: 'manual',
      mode: 'row',
      showStatus: true
    },
    scrollY: { enabled: false },
    columns: [
      {
        title: 'attribute_id',
        field: 'attributeId',
        width: 100
      },
      { title: '属性名', field: 'attributeName' },
      {
        title: '默认值',
        field: 'defaultValue',
        editRender: {},
        slots: { edit: 'edit_defaultValue' }
      },
      { title: '默认值id', field: '_defaultValueId' },
      { title: '操作', width: 100, slots: { default: 'default_operate' } }
    ],
    data: [],
    toolbarConfig: {
      custom: true
    }
  });

  const handleChangeDefaultValue = (row) => {
    if (typeof row.defaultValueId === 'string') {
      row._defaultValueId = 0;
      row.defaultValue = row.defaultValueId;
    } else {
      row._defaultValueId = row.defaultValueId;
      row.defaultValue = row.platCateAttrValueList.filter(
        (item) => item.id === row.defaultValueId
      )[0]?.name;
    }
  };

  const hasActiveEditRow = (row) => {
    const $grid = tableRef.value;
    if ($grid) {
      return $grid.isEditByRow(row);
    }
    return false;
  };
  const editRowEvent = (row) => {
    const $grid = tableRef.value;
    if ($grid) {
      $grid.setEditRow(row);
    }
  };
  const saveRowEvent = async (row) => {
    const $grid = tableRef.value;
    if ($grid) {
      const params = {
        attributeId: row.attributeId,
        attributeName: row.attributeName,
        attributeValueList: row.attributeValueList,
        defaultValueId: row._defaultValueId,
        defaultValue: row.defaultValue
      };
      if (row.isMandatory && !params.defaultValue) {
        // 必填项没填时，高亮当前行
        $grid.setCurrentRow(row);
        return ElMessage.warning('改行默认值为必填');
      }
      if (row.mappingId) {
        params.mappingId = row.mappingId;
      }
      row.saveLoading = true;
      try {
        const { msg } = await updateCateReqiuredApi(params);
        row.saveLoading = false;
        ElMessage.success(msg);
        await $grid.clearEdit();
      } catch (err) {
        row.saveLoading = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .page_header {
    position: absolute;
    width: calc(100% - 30px);
  }
  .mt10 {
    margin-top: 10px;
  }
</style>
