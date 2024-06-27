<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改描述"
      width="70%"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :inline="true"
        ><el-form-item label="原描述：" prop="originDesc">
          <el-input
            v-model="originDesc"
            type="textarea"
            style="width: 200px"
            placeholder="请输入需要被替换的词"
          /> </el-form-item
        ><el-form-item label="替换：" prop="newDesc">
          <el-input
            v-model="newDesc"
            type="textarea"
            style="width: 200px"
            placeholder="请输入替换词"
          />
        </el-form-item>
        <el-button type="primary" @click="handleApply">一键应用</el-button>
        <el-button
          type="primary"
          :loading="batchAdjustLoading"
          @click="handleBatchAdjust"
          >提交修改</el-button
        ></el-form
      >
      <div style="display: flex">
        <div style="width: 400px">
          <vxe-table
            ref="tableRef"
            :data="tableData"
            border
            :row-config="{ isCurrent: true, isHover: true }"
            :column-config="{ resizable: true }"
            @cell-click="handleRowClick"
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column field="storeAcct" title="店铺" width="90" />
            <vxe-column field="productId" title="商品编号" width="90" />
            <vxe-column field="result" title="操作结果" width="180">
              <template #default="{ row }">
                <div>
                  {{ getResultMsg(row.result) }}
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
        <div style="flex: 1; margin-left: 10px">
          <Editor
            v-if="dialogVisible && detail"
            :height="'400px'"
            :detail="detail"
            :api-url="'/lms/tiktok/mediaSpace/uploadProductDescriptionImage'"
            :api-params="transferParams"
            @getUrl="getImageUrl"
            @change="changeEditor"
          />
          <div v-else class="tips">点击列表数据查看描述</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, watch, computed, reactive } from 'vue';
  import Editor from '@/components/Editor/index.vue';
  import {
    batchQueryBasicInfo,
    batchModifyBasicInfo,
    getBatchModifyBasicResult
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
  const newDesc = ref();
  const originDesc = ref();
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
        currentRow.value = {};
        detail.value = '';
        originDesc.value = null;
        newDesc.value = '';
      }
    },
    { deep: true }
  );
  const detail = ref(''); // 富文本框详情内容
  const currentRow = ref({}); // 当前行数据

  // 点击表格行
  const handleRowClick = ({ row, column }) => {
    let selection = window.getSelection() || {};
    if (selection.type === 'Range') {
      return false;
    }

    if (column.type !== 'checkbox') {
      currentRow.value = row;
      detail.value = row?.description || '';
      transferParams.storeAcctId = row.storeAcctId || '';
    }
  };

  // 查询详情
  const handleSearch = async () => {
    tableDataLoading.value = true;
    const { data } = await batchQueryBasicInfo({
      type: 2,
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
    if (!checkedList.length) return ElMessage.warning('请选择需要替换商品数据');

    checkedList.forEach((item) => {
      item.description = item.description.replaceAll('&nbsp;', ' ');
      let _description = item.description;
      if (originDesc.value && item.description.indexOf(originDesc.value) > -1) {
        if (!newDesc.value) {
          newDesc.value = '';
          _description = _description
            .split(' ')
            .filter((e) => e !== originDesc.value)
            .join(' ');
        }
        item.description = _description.replaceAll(
          originDesc.value,
          newDesc.value
        );
      }
    });
    handleApplyCurrent(checkedList);
  };

  // 一键应用后更新当前行富文本框
  const handleApplyCurrent = (checkedList) => {
    let newRow = checkedList.find((item) => item.id === currentRow.value.id);
    detail.value = newRow?.description || '';
  };

  // 富文本框内容修改
  const changeEditor = (html) => {
    tableData.value?.forEach((item) => {
      if (currentRow.value.productId === item.productId) {
        item.description = html;
      }
    });
  };

  const transferParams = reactive({
    storeAcctId: '',
    openId: '',
    imageUrl: ''
  });
  // 图片原始链接
  const getImageUrl = (url) => {
    transferParams.imageUrl = url;
  };
  // 获取字符串中图片数量
  const countImages = (str) => {
    var imgRegex = /<img[^>]+>/g;
    var matches = str.match(imgRegex);
    if (matches) {
      return matches.length;
    } else {
      return 0;
    }
  };
  // 提交时校验图片数量 描述内图片不得超过30张
  const checkImgNum = () => {
    let descList = tableData.value.map((item) => item.description);
    let restImageList = descList?.filter((item) => {
      return countImages(item) > 30;
    });
    if (restImageList?.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const getResultMsg = (result) => {
    if (result === 1) return '还在执行';
    if (result === 0) return '成功';
    if (result === -1) return '失败';
    if (result === 2) return '维持原描述';
  };

  // 查询操作结果
  const getOperateResult = async (batchNo) => {
    const { data } = await getBatchModifyBasicResult({
      type: 2,
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

  // 批量调整
  const batchAdjustLoading = ref(false);
  const handleBatchAdjust = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (checkImgNum()) {
      ElMessage.warning('描述内图片不得超过30张！');
    }
    if (!checkedList.length) return ElMessage.warning('请选择要修改的数据！');

    // 修改的标题为空 操作结果显示：维持原标题
    let checkedData = checkedList.filter(
      (item) => item.description.length <= 11
    );
    if (checkedData.length != 0) {
      checkedData.forEach((item) => {
        item.result = 2;
      });
    }

    const list = JSON.parse(JSON.stringify(checkedList)).filter((item) => {
      return item.description.length > 11;
    });

    let params = [];
    list.forEach((item) => {
      console.log(item);
      params.push({
        productId: item.productId,
        description: item.description.replaceAll('<p><img', '<p> <img'),
        storeAcctId: item.storeAcctId
      });
    });

    try {
      batchAdjustLoading.value = true;
      const { data, msg } = await batchModifyBasicInfo({
        type: 2,
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
  .tips {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
  }
</style>
