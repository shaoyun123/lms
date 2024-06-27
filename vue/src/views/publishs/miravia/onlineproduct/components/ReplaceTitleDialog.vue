<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改标题"
      width="48%"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :inline="true"
        ><el-form-item label="原标题：" prop="title">
          <el-input
            v-model="formData.title"
            type="textarea"
            style="width: 240px"
            placeholder="请输入需要被替换的词，为空将全量调整标题"
          /> </el-form-item
        ><el-form-item label="替换/修改：" prop="newTitle">
          <el-input
            v-model="formData.newTitle"
            type="textarea"
            style="width: 240px"
            placeholder="请输入,可用下划线代替原标题在其前后新增,例: _apple/apple_"
          />
        </el-form-item>
        <el-button type="primary" @click="handleApply">一键应用</el-button>
      </el-form>
      <div class="updateBtn">
        <el-button
          type="primary"
          :loading="batchAdjustLoading"
          style="margin-right: 50px"
          @click="getMiraviaRandomTitle"
          >重新生成</el-button
        >
        <el-button
          type="primary"
          :loading="batchAdjustLoading"
          @click="handleBatchAdjust"
          >提交修改</el-button
        >
      </div>
      <vxe-table
        ref="tableRef"
        :data="tableData"
        :height="600"
        border
        :row-config="{ isCurrent: true, isHover: true }"
        :column-config="{ resizable: true }"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="storeAcct" title="店铺" width="90" />
        <vxe-column field="productId" title="商品编号" width="90" />
        <vxe-column field="title" title="原标题" />
        <vxe-column field="updateTitle" title="修改为">
          <template #default="{ row }">
            <PlatTitle
              v-model="row.updateTitle"
              :custom-type="'textarea'"
              :content-top="50"
              :max-length="128"
              :show-word-limit="true"
              :input-width="'100%'"
              :prod-p-id="row.prodPId"
              @change="handleResetResult(row)"
            />
          </template>
        </vxe-column>
        <vxe-column field="result" title="操作结果" width="180">
          <template #default="{ row }">
            <div>
              {{ getResultMsg(row.result) }}
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, watch, computed, reactive } from 'vue';
  import { handleResetResult } from '../config';
  import PlatTitle from '@/components/PlatTitle/index.vue';
  // import { batchModifyShopProductNameApi } from '@/api/publishs/tiktokonlineproduct';
  import {
    batchQueryBasicInfo,
    batchModifyBasicInfo,
    getBatchModifyBasicResult,
    batchGetProductTitle
  } from '@/api/publishs/miraviaonline';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedPIdList: {
      type: Array,
      default: () => []
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits(['update:modelValue', 'handleSearch']);

  const dialogVisible = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    }
  });
  const tableData = ref([]);
  const tableRef = ref();
  const formData = reactive({
    title: '',
    newTitle: ''
  });
  const needFresh = ref(false); // 关闭弹窗页面是否需要查询列表

  const tableDataLoading = ref(false);

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        handleSearch();
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
        needFresh.value = false;
        formData.title = null;
        formData.newTitle = '';
      }
    }
  );

  const getResultMsg = (result) => {
    if (result === 1) return '还在执行';
    if (result === 0) return '成功';
    if (result === -1) return '失败';
    if (result === 2) return '维持原标题';
  };

  const handleSearch = async () => {
    tableDataLoading.value = true;
    const { data } = await batchQueryBasicInfo({
      type: 1,
      params: props.checkedPIdList
    }).finally(() => {
      tableDataLoading.value = false;
    });
    tableData.value = data;
  };

  // 一键应用
  const handleApply = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');
    checkedList.forEach((item) => {
      let _productName = item.title;
      if (!formData.title) {
        if (formData.newTitle.includes('_')) {
          item.updateTitle = formData.newTitle.replace('_', item.title);
        } else {
          item.updateTitle = formData.newTitle;
        }
      } else {
        if (item.title.includes(formData.title)) {
          if (!formData.newTitle) {
            formData.newTitle = '';
            _productName = _productName
              .split(' ')
              .filter((e) => e !== formData.title)
              .join(' ');
          }
          item.updateTitle = _productName.replaceAll(
            formData.title,
            formData.newTitle
          );
        }
      }
    });
  };

  // 重新生成
  const getMiraviaRandomTitle = async () => {
    const checkedList = tableRef.value.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');

    const checkedPId = checkedList.map((item) => item.prodPId);
    const res = await batchGetProductTitle(checkedPId);

    tableData.value = tableData.value.map((item) => {
      if (res.data[item.prodPId]) {
        item.updateTitle = res.data[item.prodPId];
      }
      return item;
    });
  };

  // 查询操作结果
  const getOperateResult = async (batchNo) => {
    const { data } = await getBatchModifyBasicResult({
      type: 1,
      batchNo: batchNo
    });
    data.forEach((item) => {
      const index = tableData.value.findIndex(
        (el) => el.productId === item.productId
      );
      if (index > -1) {
        tableData.value[index].result = item.result;
      }
    });
  };

  // 提交修改
  const batchAdjustLoading = ref(false);
  const handleBatchAdjust = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择数据');

    // 修改的标题为空 操作结果显示：维持原标题
    let checkedData = checkedList.filter((item) => !item.updateTitle);
    if (checkedData.length != 0) {
      return checkedData.forEach((item) => {
        item.result = 2;
      });
    }

    let params = [];
    checkedList.forEach((item) => {
      params.push({
        productId: item.productId,
        title: item.updateTitle,
        storeAcctId: item.storeAcctId
      });
    });
    try {
      batchAdjustLoading.value = true;
      const { data, msg } = await batchModifyBasicInfo({
        type: 1,
        params
      });
      needFresh.value = true;
      ElMessage.warning(msg);
      getOperateResult(data);
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batchAdjustLoading.value = false;
    }
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .updateBtn {
    display: flex;
    justify-content: end;
    margin-bottom: 10px;
  }
</style>
