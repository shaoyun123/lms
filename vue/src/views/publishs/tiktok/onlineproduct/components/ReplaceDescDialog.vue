<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改描述"
      width="70%"
      :align-center="true"
      destroy-on-close
      @close="closeDialog"
    >
      <el-form ref="formRef" :inline="true"
        ><el-form-item label="原描述文本：" prop="originDesc">
          <el-input
            v-model="originDesc"
            type="textarea"
            style="width: 200px"
            placeholder="请输入需替换词"
          /> </el-form-item
        ><el-form-item label="替换为：" prop="newDesc">
          <el-input
            v-model="newDesc"
            type="textarea"
            style="width: 200px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-button type="primary" @click="handleApply">一键应用</el-button>
        <el-button
          type="primary"
          :loading="batchAdjustLoading"
          @click="handleBatchAdjust"
          >提交</el-button
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
            <vxe-column field="productId" title="product_id" width="90" />
            <vxe-column field="result" title="操作结果" width="180">
              <template #default="{ row }">
                <div v-if="row.success" class="color_success">
                  {{ row.success }}
                </div>
                <div v-else class="color_error">{{ row.result }}</div>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
        <div style="flex: 1; margin-left: 10px">
          <Editor
            v-if="dialogVisible"
            ref="editRef"
            :height="'400px'"
            :detail="detail"
            :api-url="'/lms/tiktok/mediaSpace/uploadProductDescriptionImage'"
            :api-params="transferParams"
            :get-tpl-image-params="getTplImageParams"
            @get-url="getImageUrl"
            @change="changeEditor"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, watch, computed, reactive } from 'vue';
  import Editor from '@/components/Editor/index.vue';
  import { batchModifyShopProductDescApi } from '@/api/publishs/tiktokonlineproduct';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    rowCheckedList: {
      type: Array,
      default: () => []
    }
  });

  // eslint-disable-next-line
  const emits = defineEmits([
    'update:modelValue',
    'handleSearch',
    'updateCheckedList'
  ]);

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
    () => [dialogVisible.value, props.rowCheckedList],
    async (val) => {
      if (val[0]) {
        handleSearch();
      } else {
        currentRow.value = {};
        detail.value = '';
        if (needFresh.value) {
          emits('handleSearch');
        }
        needFresh.value = false;
        originDesc.value = null;
        newDesc.value = '';
      }
      if (val[1]) {
        tableData.value = JSON.parse(JSON.stringify(props.rowCheckedList));
        selectRowEvent();
      }
    },
    { deep: true }
  );
  const detail = ref(''); // 富文本框详情内容
  const currentRow = ref({}); // 当前行数据
  const getTplImageParams = ref({});
  // 点击表格行
  const handleRowClick = ({ row, column }) => {
    let selection = window.getSelection() || {};
    if (selection.type === 'Range') {
      return false;
    }
    if (column.type !== 'checkbox') {
      currentRow.value = row;
      // 判断img标签是否有p标签包裹，如果没有则添上p标签
      if (row.description) {
        let div = document.createElement('div');
        div.innerHTML = row?.description;
        const imgs = div.getElementsByTagName('img');

        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i];
          const parent = img.parentNode;
          var nextSibling = img.nextSibling;
          // 如果没有 p 标签包裹
          if (parent.tagName !== 'P') {
            const pElement = document.createElement('p');
            parent.removeChild(img);
            pElement.appendChild(img);
            if (nextSibling) {
              parent.insertBefore(pElement, nextSibling);
            } else {
              parent.appendChild(pElement);
            }
          }
        }
        detail.value = div.innerHTML
          .replaceAll('<div>', '<p>')
          .replaceAll('</div>', '</p>');
      }
      // 模板图片所需参数
      const prodSSkuList =
        currentRow.value?.skuList.map((item) => item.prodSSku) || [];
      getTplImageParams.value = {
        platCode: 'tiktok',
        prodSSkus: Array.from(new Set(prodSSkuList)).filter(Boolean)
      };
      transferParams.storeAcctId = row.storeAcctId || '';
    }
  };

  // 关闭弹窗销毁实例
  const editRef = ref(null);
  const closeDialog = () => {
    dialogVisible.value = false;
  };

  // 列表高亮行
  const selectRowEvent = () => {
    const $table = tableRef.value;
    if ($table) {
      let idx = tableData.value.findIndex(
        (item) => item.id === currentRow.value.id
      );
      $table.setCurrentRow(tableData.value[idx]);
    }
  };

  const handleSearch = async () => {
    try {
      tableDataLoading.value = true;
      tableData.value = JSON.parse(JSON.stringify(props.rowCheckedList));
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tableDataLoading.value = false;
    }
  };

  const handleApply = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (!checkedList.length) return ElMessage.warning('请选择需要替换商品数据');

    checkedList.forEach((item) => {
      let _description = item.description;
      if (originDesc.value && item.description.includes(originDesc.value)) {
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
      if (currentRow.value.id === item.id) {
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

  // 批量调整
  const batchAdjustLoading = ref(false);
  const handleBatchAdjust = async () => {
    const $table = tableRef.value;
    const checkedList = $table.getCheckboxRecords();
    if (checkImgNum()) {
      ElMessage.warning('描述内图片不得超过30张！');
    }
    if (!checkedList.length) return ElMessage.warning('请选择要修改的数据！');
    // let checkedData = checkedList.filter((item) => !item.updateProductName);
    // if (checkedData.length != 0) {
    //   return ElMessage.warning('请检查需要修改的标题，不能为空');
    // }
    let obj = [];
    // 将富文本里面的p标签替换成平台要的div 且删除除了src之外的属性
    checkedList.forEach((item) => {
      const newDesc = item.description
        .replaceAll('<p>', '<div>')
        .replaceAll('</p>', '</div>')
        .replace(/<img([^>]+)>/g, (match, attributes) => {
          const srcMatch = attributes.match(/src="([^"]+)"/);
          const src = srcMatch ? srcMatch[1] : '';
          return `<img src="${src}">`;
        })
        .replaceAll('<img src="">', '');
      obj.push({
        id: item.id,
        productId: item.productId,
        description: newDesc,
        storeAcctId: item.storeAcctId
      });
    });
    try {
      batchAdjustLoading.value = true;
      const { data } = await batchModifyShopProductDescApi(obj);
      needFresh.value = true;
      checkedList.forEach((item) => {
        if (data[item.productId] && data[item.productId].includes('失败')) {
          item.result = data[item.productId];
        } else {
          item.success = data[item.productId];
        }
      });
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      // currentRow.value = {};
      // detail.value = '';
      batchAdjustLoading.value = false;
    }
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
