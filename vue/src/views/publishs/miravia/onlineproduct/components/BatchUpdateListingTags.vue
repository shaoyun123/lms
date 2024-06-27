<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改listing标签"
      width="50%"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <div>
        <div class="flex-between">
          <el-form ref="formRef" :model="formData" :inline="true">
            <el-form-item prop="checkedTagsList">
              <ZSelect
                v-model="checkedTagsList"
                class="w150 mr-2"
                :items="listingTagListOption"
                :num="2"
              />
            </el-form-item>
            <el-button type="primary" @click="batchAdd">批量添加</el-button>
            <el-button type="warning" @click="batchDel">批量删除</el-button>
          </el-form>

          <el-button type="danger" @click="clearCheckedTagList"
            >清空已有标签</el-button
          >
        </div>
        <el-table
          ref="tableRef"
          :data="tableData"
          height="600"
          border
          :span-method="rowSpanMethod"
        >
          <el-table-column label="店铺" prop="storeAcct" width="180">
          </el-table-column>
          <el-table-column label="商品编号" width="180">
            <template #header>
              <div class="flex">
                <el-checkbox
                  v-model="allCheckedProduct"
                  size="small"
                  @click="() => {}"
                  @change="handleAllCheckedProduct"
                ></el-checkbox>
                <span class="ml-10">商品编号</span>
              </div>
            </template>
            <template #default="{ row }">
              <div class="flex">
                <el-checkbox
                  v-model="parentData[row.pid].checkedProduct"
                  size="small"
                  @change="
                    parentProductCheck(
                      row.pid,
                      parentData[row.pid].checkedProduct
                    )
                  "
                  >{{ parentData[row.pid].productId }}</el-checkbox
                >
                <el-icon
                  color="#409eff"
                  size="16"
                  class="ml-5"
                  @click="handleAddTag('productAddTag', row)"
                  ><CirclePlus
                /></el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="product标签">
            <template #default="{ row }">
              <el-tag
                v-for="tag in parentData[row.pid].tagList"
                :key="tag.tagId"
                closable
                size="small"
                class="mr-4"
                @close="parentDelTag(row.pid, tag.tagId)"
              >
                {{ tag.tagName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="sku_id" prop="skuId" width="180">
            <template #header>
              <div class="flex">
                <el-checkbox
                  v-model="allCheckedSkuId"
                  size="small"
                  @change="sonAllCheckedProduct"
                ></el-checkbox>
                <span class="ml-10">sku_id</span>
              </div>
            </template>
            <template #default="{ row }">
              <template v-if="row.skuId">
                <div class="flex">
                  <el-checkbox
                    v-model="row.checkedSkuId"
                    size="small"
                    @change="handleCheckedSkuId(row, row.checkedSkuId)"
                    >{{ row.skuId }}</el-checkbox
                  >
                  <el-icon
                    color="#409eff"
                    size="16"
                    class="ml-5"
                    @click="handleAddTag('skuAddTag', row)"
                    ><CirclePlus
                  /></el-icon>
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="sku标签" prop="tagNames">
            <template #default="{ row }">
              <template v-if="row.skuId">
                <el-tag
                  v-for="tag in row.tagList"
                  :key="tag.tagId"
                  closable
                  size="small"
                  class="mr-4"
                  @close="currentSonDelTag(row, tag.tagId)"
                >
                  {{ tag.tagName }}
                </el-tag>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submit"> 确定 </el-button>
          <el-button @click="close">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="addTagVisible"
      title="添加在线listing标签"
      width="25%"
      class="addTagsBox"
      :align-center="true"
      draggable
    >
      <el-form style="height: 350px">
        <el-form-item label="新增标签">
          <ZSelect
            v-model="addTagList"
            class="w150 mr-2"
            :items="listingTagListOption"
            :num="2"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="addTagSubmit"> 保存 </el-button>
          <el-button @click="addTagCancel">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ElMessage } from 'element-plus';
  import { ref, watch, computed } from 'vue';
  import {
    getMiraviaListingTagApi,
    batchUpdateMiraviaListingTagApi
  } from '@/api/publishs/miraviaonline';
  // import ZSelectPanel from '@/components/ZSelectPanel/index.vue';
  import ZSelect from '@/components/ZSelect/index.vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedParamsList: {
      type: Array,
      default: () => []
    }
  });

  const tableData = ref([]);
  const parentData = ref({});
  const tableRef = ref();

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

  const checkedTagsList = ref([]);
  const needFresh = ref(false); // 关闭弹窗页面是否需要查询列表

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        checkedTagsList.value = [];
        parentData.value = {};
        tableData.value = [];
        getListingTagList();
        initTableData();
      } else {
        if (needFresh.value) {
          emits('handleSearch');
        }
        needFresh.value = false;
      }
    }
  );

  // 初始化表格数据
  const initTableData = () => {
    let checkedList = JSON.parse(JSON.stringify(props.checkedParamsList));
    checkedList.forEach((first) => {
      parentData.value[first.id] = {
        storeAcctId: first.storeAcctId,
        productId: first.productId,
        syncPId: first.id,
        tagList: first.tags || [],
        checkedProduct: allCheckedProduct.value
      };

      first.prodSyncSMiraviaDtoList.forEach((second) => {
        tableData.value.push({
          pid: second.pid,
          storeAcct: first.storeAcct,
          storeAcctId: first.storeAcctId,
          skuId: second.skuId,
          tagList: second.tags || [],
          checkedSkuId: false
        });
      });
    });
  };

  // 获取商品标签
  const listingTagListOption = ref([]);
  const getListingTagList = async () => {
    const { data } = await getMiraviaListingTagApi();
    listingTagListOption.value = data;
  };

  // 批量添加标签
  const batchAdd = () => {
    // 先找到添加的标签对应的枚举项id name
    const matchedItems = listingTagListOption.value.filter((tagItem) =>
      checkedTagsList.value.includes(tagItem.id)
    );
    if (isCheck()) return ElMessage.warning('请选择数据');
    Object.keys(parentData.value)
      .filter((key) => parentData.value[key].checkedProduct)
      .forEach((key) => {
        parentAddTag(key, matchedItems);
      });
    tableData.value
      .filter((item) => item.checkedSkuId)
      .forEach((item) => {
        sonAddTag(item, matchedItems);
      });
  };

  const isCheck = () => {
    const parentCheckList = Object.keys(parentData.value).filter(
      (key) => parentData.value[key].checkedProduct
    );
    const sonCheckList = tableData.value.filter((item) => item.checkedSkuId);
    return !parentCheckList.length && !sonCheckList.length;
  };

  // 批量删除标签
  const batchDel = () => {
    if (isCheck()) return ElMessage.warning('请选择数据');
    // 先找到添加的标签对应的枚举项id name
    const matchedItems = listingTagListOption.value.filter((tagItem) =>
      checkedTagsList.value.includes(tagItem.id)
    );

    // 有sku就清空sku 没sku标签清空product标签
    const sonCheckList = tableData.value.filter((item) => item.checkedSkuId);
    matchedItems.forEach((tag) => {
      if (sonCheckList.length) {
        sonCheckList.forEach((item) => {
          currentSonDelTag(item, tag.id);
        });
      } else {
        Object.keys(parentData.value)
          .filter((key) => parentData.value[key].checkedProduct)
          .forEach((key) => {
            parentDelTag(key, tag.id);
          });
      }
    });
  };

  // 弹窗批量添加(要判断是添加父标签还是子标签)
  const popBatchAdd = () => {
    // 先找到添加的标签对应的枚举项id name
    const matchedItems = listingTagListOption.value.filter((tagItem) =>
      addTagList.value.includes(tagItem.id)
    );

    if (addTagFromPopType.value === 'productAddTag') {
      parentAddTag(currentItemRow.value.pid, matchedItems);
    }
    if (addTagFromPopType.value === 'skuAddTag') {
      sonAddTag(currentItemRow.value, matchedItems);
    }
  };

  // 父标签添加
  const parentAddTag = (key, tagOptionItems) => {
    // tagOptionItem 这是从枚举列表中找出选中的每一项
    const tagList = parentData.value[key].tagList;
    // 判断选中的时候已存在
    const newTags = tagOptionItems
      .filter((tag) => {
        return !tagList.some((oldTag) => oldTag.tagId === tag.id);
      })
      .map((tag) => {
        return {
          tagName: tag.name,
          tagId: tag.id
        };
      });
    tagList.push(...newTags);
  };

  // 子标签添加
  const sonAddTag = (item, tagOptionItems) => {
    // 判断选中的时候已存在
    const newTags = tagOptionItems
      .filter((tag) => {
        return !item.tagList.some((oldTag) => oldTag.tagId === tag.id);
      })
      .map((tag) => {
        return {
          tagName: tag.name,
          tagId: tag.id
        };
      });
    item.tagList.push(...newTags);
    parentAddTag(item.pid, tagOptionItems);
  };

  // 清空所有选中项的标签
  const clearCheckedTagList = () => {
    if (isCheck()) return ElMessage.warning('请选择数据');
    // 有sku就清空sku 没sku标签清空product标签
    const oldTableData = JSON.parse(JSON.stringify(tableData.value));
    tableData.value
      .filter((item) => item.checkedSkuId)
      .forEach((item) => {
        const tagLit = JSON.parse(JSON.stringify(item.tagList));
        tagLit.forEach((tag) => {
          currentSonDelTag(item, tag.tagId);
        });
      });

    const allSonTagListsEmpty = oldTableData.every(
      (item) => item.tagList.length === 0
    );
    if (allSonTagListsEmpty) {
      Object.keys(parentData.value).forEach((key) => {
        const parentItem = JSON.parse(JSON.stringify(parentData.value[key]));
        if (parentItem.checkedProduct) {
          parentItem.tagList.forEach((tag) => {
            parentDelTag(key, tag.tagId);
          });
        }
      });
    }
  };

  // 父标签删除
  const parentDelTag = (pid, tagId) => {
    // 父标签涉及到的子标签也要删除
    const tagList = parentData.value[pid].tagList;
    const parentIndex = tagList.findIndex((item) => item.tagId === tagId);
    if (parentIndex > -1) tagList.splice(parentIndex, 1);
    sonDelTag(pid, tagId);
  };

  // 子标签删除
  const sonDelTag = (pid, tagId) => {
    tableData.value = tableData.value.map((item) => {
      if (item.pid === Number(pid)) {
        currentSonDelTag(item, tagId);
      }
      return item;
    });
  };

  // 当前子标签删除
  const currentSonDelTag = (item, tagId) => {
    const secondIndex = item.tagList.findIndex(
      (item) => item.tagId === Number(tagId)
    );
    if (secondIndex > -1) item.tagList.splice(secondIndex, 1);
  };

  // 点击icon加号添加标签
  const addTagList = ref([]);
  const addTagVisible = ref(false);
  const addTagFromPopType = ref('');
  const currentItemRow = ref({});
  const handleAddTag = (type, row) => {
    addTagFromPopType.value = type;
    currentItemRow.value = row;
    addTagVisible.value = true;
    addTagList.value = [];
  };

  // 弹窗添加父标签点击了保存
  const addTagSubmit = () => {
    popBatchAdd();
    addTagVisible.value = false;
  };

  const addTagCancel = () => {
    addTagVisible.value = false;
    addTagList.value = [];
  };

  const allCheckedProduct = ref(true);
  const allCheckedSkuId = ref(false);
  // 父商品编号表头全选勾选框
  const handleAllCheckedProduct = (value) => {
    Object.keys(parentData.value).forEach((key) => {
      parentProductCheck(key, value);
    });
  };

  // 子商品编号表头全选勾选框
  const sonAllCheckedProduct = (value) => {
    tableData.value.forEach((row) => {
      handleCheckedSkuId(row, value);
    });
  };

  // 父商品状态改变
  const parentProductCheck = (key, status) => {
    parentData.value[key].checkedProduct = status;
    sonProductCheck(key, status);
    changeAllCheckedProduct();
  };

  // 全部子商品状态改变
  const sonProductCheck = (pid, status) => {
    tableData.value = tableData.value.map((item) => {
      if (item.pid === Number(pid)) {
        item.checkedSkuId = status;
      }
      return item;
    });
    changeAllCheckedSkuId();
  };

  // 子标签勾选/取消
  const handleCheckedSkuId = (row, status) => {
    row.checkedSkuId = status;
    if (status) {
      parentData.value[row.pid].checkedProduct = true;
      changeAllCheckedProduct();
    }
    changeAllCheckedSkuId();
  };

  // 父商品全选状态改变
  const changeAllCheckedProduct = () => {
    allCheckedProduct.value = !Object.keys(parentData.value).some(
      (key) => !parentData.value[key].checkedProduct
    );
  };

  // 子商品全选状态改变
  const changeAllCheckedSkuId = () => {
    allCheckedSkuId.value = !tableData.value.some((item) => !item.checkedSkuId);
  };

  // 行合并
  const rowSpanMethod = ({ row, rowIndex, columnIndex }) => {
    const rowspanIndex = [0, 1, 2];
    if (rowspanIndex.includes(columnIndex)) {
      if (rowIndex === 0 || row.pid !== tableData.value[rowIndex - 1].pid) {
        const rowList = tableData.value.filter((item) => item.pid === row.pid);
        return {
          rowspan: rowList.length,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
  };

  const submit = async () => {
    const resultData = [];
    Object.keys(parentData.value).forEach((key) => {
      const resultItem = JSON.parse(JSON.stringify(parentData.value[key]));
      resultItem.tagIds = resultItem.tagList.map((item) => item.tagId);
      resultItem.skuTags = tableData.value
        .filter((item) => item.pid === Number(key))
        .map((item) => {
          return {
            skuId: item.skuId,
            tagIds: item.tagList.map((item) => item.tagId)
          };
        });
      resultData.push({
        storeAcctId: resultItem.storeAcctId,
        productId: resultItem.productId,
        syncPId: resultItem.syncPId,
        tagIds: resultItem.tagIds,
        skuTags: resultItem.skuTags
      });
    });

    const { code, msg } = await batchUpdateMiraviaListingTagApi(resultData);
    if (code === '0000') {
      needFresh.value = true;
      ElMessage.success(msg);
      close();
    } else {
      ElMessage.warning(msg);
    }
  };

  const close = () => {
    dialogVisible.value = false;
    checkedTagsList.value = [];
  };
</script>

<style lang="scss" scoped>
  @import '../index.scss';
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .mr-4 {
    margin-right: 4px;
  }
  .ml-5 {
    margin-left: 5px;
  }
  .ml-10 {
    margin-left: 10px;
  }
  .addTagsBox {
    :deep(.el-dialog .el-dialog__body) {
      height: 350px !important;
    }
  }
</style>
