<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="修改在线标签"
      width="65%"
      :align-center="true"
      :close-on-click-modal="false"
      @close="close"
    >
      <div>
        <div class="flex-between">
          <el-form ref="formRef" :inline="true">
            <el-form-item prop="checkedTagsList">
              <ZSelect
                v-model="checkedTagsList"
                default-text="请选择标签"
                class="w150 mr-2"
                :items="listingTagListOption"
                :num="2"
              />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="isFilterHaltSales" :value="1"
                >过滤停售sku</el-checkbox
              >
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="batchAdd">批量添加</el-button>
              <el-button type="primary" @click="batchDel">批量删除</el-button>
            </el-form-item>
          </el-form>

          <el-button type="danger" @click="clearCheckedTagList"
            >清空已有标签</el-button
          >
        </div>
        <vxe-table
          ref="tableRef"
          :data="tableData"
          height="600"
          :loading="loading"
          border
          :row-config="{ isCurrent: true, isHover: true }"
          :column-config="{ resizable: true }"
          :span-method="rowSpanMethod"
        >
          <vxe-column
            field="storeAcct"
            title="店铺"
            width="180"
            :filters="[{}]"
            :filter-method="filterStore"
            :filter-reset-method="filterResetStore"
          >
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <el-input
                  v-model="option.data"
                  placeholder="请输入"
                  clearable
                  @input="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
          </vxe-column>
          <vxe-column
            header-class-name="filter_header"
            width="220"
            :filters="[{}]"
            :filter-method="filterListingItemId"
            :filter-reset-method="filterResetListing"
          >
            <template #header>
              <span class="flex">
                <el-checkbox
                  v-model="allCheckedProduct"
                  size="small"
                  @click="() => {}"
                  @change="handleAllCheckedProduct"
                ></el-checkbox>
                <span class="ml-10">product_id</span>
              </span>
            </template>
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <el-input
                  v-model="option.data"
                  placeholder="请输入"
                  clearable
                  @input="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
            <template #default="{ row }">
              <div class="flex">
                <el-checkbox
                  v-model="parentData[row.id].checkedProduct"
                  size="small"
                  @change="
                    parentProductCheck(
                      row.id,
                      parentData[row.id].checkedProduct
                    )
                  "
                  >{{ parentData[row.id].itemId }}</el-checkbox
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
          </vxe-column>
          <vxe-column
            title="product标签"
            :filters="[{}]"
            :filter-method="filterListingItemIdTags"
            :filter-reset-method="filterResetListing"
          >
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <el-input
                  v-model="option.data"
                  placeholder="请输入"
                  clearable
                  @input="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
            <template #default="{ row }">
              <el-tag
                v-for="tag in parentData[row.id].tagList"
                :key="tag.id"
                closable
                size="small"
                class="mr-4"
                @close="parentDelTag(row.id, tag.id)"
              >
                {{ tag.name }}
              </el-tag>
            </template>
          </vxe-column>
          <vxe-column
            field="skuId"
            title="sku_id"
            width="220"
            :filters="[{}]"
            :filter-method="filterListingSkuId"
            :filter-reset-method="filterResetListing"
          >
            <template #header>
              <div class="flex">
                <el-checkbox
                  v-model="allCheckedSkuId"
                  size="small"
                  @change="sonAllCheckedProduct"
                ></el-checkbox>
                <span class="ml-10">shop_sku_id</span>
              </div>
            </template>
            <template #default="{ row }">
              <template v-if="row.variationId">
                <div class="flex">
                  <el-checkbox
                    v-model="row.checkedSkuId"
                    size="small"
                    @change="handleCheckedSkuId(row, row.checkedSkuId)"
                    >{{ row.variationId }}</el-checkbox
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
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <el-input
                  v-model="option.data"
                  clearable
                  @input="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
          </vxe-column>
          <vxe-column
            title="seller_sku"
            field="sellerSku"
            width="220"
            :filters="[{}]"
            :filter-method="filterSellerSku"
            :filter-reset-method="filterResetListing"
          >
            <template #default="{ row }">
              <div>
                <span class="mr-4">{{ row.sellerSku }}</span>
                <el-tag v-if="row.isSale === 0" type="danger">停</el-tag>
              </div>
            </template>
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <el-input
                  v-model="option.data"
                  clearable
                  @input="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
          </vxe-column>
          <vxe-column
            field="tagList"
            title="sku标签"
            :filters="[{}]"
            :filter-method="filterListingSkuIdTags"
            :filter-reset-method="filterResetListing"
          >
            <template #default="{ row }">
              <template v-if="row.variationId">
                <el-tag
                  v-for="tag in row.tagList"
                  :key="tag.id"
                  closable
                  size="small"
                  class="mr-4"
                  @close="currentSonDelTag(row, tag.id)"
                >
                  {{ tag.name }}
                </el-tag>
              </template>
            </template>
            <template #filter="{ column, $panel }">
              <div
                v-for="(option, index) in column.filters"
                :key="index"
                class="p10"
              >
                <el-input
                  v-model="option.data"
                  placeholder="请输入"
                  clearable
                  @input="$panel.changeOption($event, true, option)"
                />
              </div>
            </template>
          </vxe-column>
        </vxe-table>
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
            :default-text="请选择标签"
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
  import { batchModifyListingTagApi } from '@/api/publishs/tiktokonlineproduct';
  import ZSelect from '@/components/ZSelect/index.vue';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    checkedParamsList: {
      type: Array,
      default: () => []
    },
    tagList: {
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
  const isFilterHaltSales = ref(false); // 是否过滤停售sku
  const needFresh = ref(false); // 关闭弹窗页面是否需要查询列表

  watch(
    () => dialogVisible.value,
    async (val) => {
      if (val) {
        // 重置
        // isFilterHaltSales.value = false;
        checkedTagsList.value = [];
        parentData.value = {};
        tableData.value = [];
        listingTagListOption.value = props.tagList;
        // 初始化
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
        itemId: first.productId,
        pid: first.id,
        tagList: first.listingTagInfoList || [],
        checkedProduct: allCheckedProduct.value,
        children: []
      };

      first.skuList.forEach((second) => {
        const children = {
          storeAcctId: first.storeAcctId,
          storeAcct: first.storeAcct,
          itemId: first.productId,
          pTagList: first.listingTagInfoList || [],
          id: first.id,
          variationId: second.skuId,
          sellerSku: second.sellerSku,
          isSale: second.isSale,
          tagList: second.listingTagInfoList || [],
          checkedSkuId: false,
          isShow: true
        };
        parentData.value[first.id].children.push(children);
        tableData.value.push(children);
      });
    });
    // 子sku全选默认不勾选
    changeAllCheckedSkuId();
  };

  // 获取商品标签
  const listingTagListOption = ref([]);

  // 批量添加标签
  const batchAdd = () => {
    if (!checkedTagsList.value.length) {
      return ElMessage.warning('请选择标签！');
    }
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

    // 如果否选了过滤停售sku
    let sonCheckedTableList = [];
    if (isFilterHaltSales.value) {
      sonCheckedTableList = tableData.value.filter(
        (item) => item.checkedSkuId && item.isSale !== 0
      );
    } else {
      sonCheckedTableList = tableData.value.filter((item) => item.checkedSkuId);
    }
    sonCheckedTableList.forEach((item) => {
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
    if (!checkedTagsList.value.length) {
      return ElMessage.warning('请选择标签！');
    }
    if (isCheck()) return ElMessage.warning('请选择数据');
    // 先找到添加的标签对应的枚举项id name
    const matchedItems = listingTagListOption.value.filter((tagItem) =>
      checkedTagsList.value.includes(tagItem.id)
    );

    // 如果否选了过滤停售sku
    let sonCheckList = [];
    if (isFilterHaltSales.value) {
      sonCheckList = tableData.value.filter(
        (item) => item.checkedSkuId && item.isSale !== 0
      );
    } else {
      sonCheckList = tableData.value.filter((item) => item.checkedSkuId);
    }

    // 有sku就清空sku 没sku标签清空product标签
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
      parentAddTag(currentItemRow.value.id, matchedItems);
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
        return !tagList.some((oldTag) => oldTag.id === tag.id);
      })
      .map((tag) => {
        return {
          name: tag.name,
          id: tag.id
        };
      });
    tagList.push(...newTags);
  };

  // 子标签添加
  const sonAddTag = (item, tagOptionItems) => {
    // 判断选中的时候已存在
    const newTags = tagOptionItems
      .filter((tag) => {
        return !item.tagList.some((oldTag) => oldTag.id === tag.id);
      })
      .map((tag) => {
        return {
          name: tag.name,
          id: tag.id
        };
      });
    item.tagList.push(...newTags);
    parentAddTag(item.id, tagOptionItems);
  };

  // 清空所有选中项的标签(勾选子的 清空子的;勾选父的 把子也清掉)
  const clearCheckedTagList = () => {
    if (isCheck()) return ElMessage.warning('请选择数据');
    // 有sku就清空sku 没sku标签清空product标签
    // const oldTableData = JSON.parse(JSON.stringify(tableData.value));
    tableData.value
      .filter((item) => item.checkedSkuId)
      .forEach((item) => {
        const tagLit = JSON.parse(JSON.stringify(item.tagList));
        tagLit.forEach((tag) => {
          currentSonDelTag(item, tag.id);
        });
      });

    Object.keys(parentData.value).forEach((key) => {
      const parentItem = JSON.parse(JSON.stringify(parentData.value[key]));
      if (parentItem.checkedProduct) {
        parentItem.tagList.forEach((tag) => {
          parentDelTag(key, tag.id);
        });
      }
    });
  };

  // 父标签删除
  const parentDelTag = (id, tagId) => {
    // 父标签涉及到的子标签也要删除
    const tagList = parentData.value[id].tagList;
    const parentIndex = tagList.findIndex((item) => item.id === tagId);
    if (parentIndex > -1) tagList.splice(parentIndex, 1);
    sonDelTag(id, tagId);
  };

  // 子标签删除
  const sonDelTag = (id, tagId) => {
    tableData.value = tableData.value.map((item) => {
      if (item.id === Number(id)) {
        currentSonDelTag(item, tagId);
      }
      return item;
    });
  };

  // 当前子标签删除
  const currentSonDelTag = (item, tagId) => {
    const secondIndex = item.tagList.findIndex(
      (item) => item.id === Number(tagId)
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

  // 弹窗添加标签点击了保存
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
    sonAllCheckedProduct(value);
  };

  // 子商品编号表头全选勾选框
  const sonAllCheckedProduct = (value) => {
    tableData.value.forEach((row) => {
      if (row.isShow) handleCheckedSkuId(row, value);
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
      if (item.id === Number(pid)) {
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
      parentData.value[row.id].checkedProduct = true;
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
    allCheckedSkuId.value = !tableData.value.some(
      (item) => !item.checkedSkuId && item.isShow
    );
  };

  // 行合并
  const rowSpanMethod = ({ row, rowIndex, columnIndex }) => {
    const rowspanIndex = [0, 1, 2];
    if (rowspanIndex.includes(columnIndex)) {
      if (
        rowIndex === 0 ||
        row.id !== preShowId(tableData.value, rowIndex, 1)
      ) {
        const rowList = tableData.value.filter(
          (item) => item.id === row.id && item.isShow
        );
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

  const preShowId = (list, rowIndex, diff) => {
    if (diff > rowIndex) return -1;
    const currentItem = list[rowIndex - diff];
    if (currentItem.isShow) return currentItem.id;
    return preShowId(list, rowIndex, diff + 1);
  };

  // 提交
  const loading = ref(false);
  const submit = async () => {
    loading.value = true;
    // 处理数据
    const resultData = [];
    Object.keys(parentData.value).forEach((key) => {
      const resultItem = JSON.parse(JSON.stringify(parentData.value[key]));
      resultItem.tagIdList = resultItem.tagList.map((item) => item.id);
      resultItem.variationList = tableData.value
        .filter((item) => item.id === Number(key))
        .map((item) => {
          return {
            variationId: item.variationId,
            tagIdList: item.tagList.map((item) => item.id)
          };
        });
      resultData.push({
        itemId: resultItem.itemId,
        storeAcctId: resultItem.storeAcctId,
        tagIdList: resultItem.tagIdList,
        pId: resultItem.pid,
        variationList: resultItem.variationList
      });
    });

    const { code, msg } = await batchModifyListingTagApi(resultData).finally(
      () => {
        loading.value = false;
      }
    );

    if (code === '0000') {
      needFresh.value = true;
      ElMessage.success(msg);
      close();
    } else {
      ElMessage.warning(msg);
    }
  };

  // 店铺筛选
  const filterStore = ({ option, cellValue }) => {
    // 判断有没有多个逗号隔开
    if (option.data && option.data.includes(',')) {
      let result = false;
      option.data?.split(',').forEach((item) => {
        if (cellValue.includes(item)) {
          result = true;
        }
      });
      return result;
    } else {
      if (cellValue.includes(option.data)) {
        return true;
      }
    }
    return false;
  };

  const filterResetStore = ({ options }) => {
    options[0].data = [];
  };

  // 封装标签类筛选
  const filterListingTags = (option, row, key) => {
    let tagNameList = row[key].map((item) => item.name);
    // 判断有没有多个逗号隔开
    if (option.data) {
      const values = option.data.trim().split(',');
      row.isShow = false;
      let result = false;
      values.forEach((value) => {
        tagNameList.forEach((name) => {
          if (name.includes(value)) {
            row.isShow = true;
            result = true;
          }
        });
      });
      return result;
    }
    row.isShow = true;
    return true;
  };

  // sku标签筛选
  const filterListingSkuIdTags = ({ option, row }) => {
    return filterListingTags(option, row, 'tagList');
  };

  // product标签筛选
  const filterListingItemIdTags = ({ option, row }) => {
    return filterListingTags(option, row, 'pTagList');
  };

  // 封装列表类筛选
  const filterListingId = (option, row, key) => {
    if (option.data) {
      const values = option.data.trim().split(',');
      let result = false;
      row.isShow = false;
      values.forEach((value) => {
        if (row[key].includes(value)) {
          row.isShow = true;
          result = true;
        }
      });
      changeAllCheckedSkuId();
      return result;
    }
    row.isShow = true;
    changeAllCheckedSkuId();
    return true;
  };

  // product_id 筛选
  const filterListingItemId = ({ option, row }) => {
    return filterListingId(option, row, 'itemId');
  };

  // shop_sku_id筛选
  const filterListingSkuId = ({ option, row }) => {
    return filterListingId(option, row, 'variationId');
  };

  // sellerSku筛选
  const filterSellerSku = ({ option, row }) => {
    return filterListingId(option, row, 'sellerSku');
  };

  // 重置
  const filterResetListing = ({ options }) => {
    tableData.value.forEach((item) => (item.isShow = true));
    changeAllCheckedSkuId();
    options[0].data = [];
  };

  // 关闭
  const close = () => {
    dialogVisible.value = false;
    checkedTagsList.value = [];
    isFilterHaltSales.value = false;
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
  .p10 {
    padding: 10px;
  }
</style>
<style lang="scss" scoped>
  :deep(.vxe-cell) {
    display: flex;
    align-items: center;
  }
</style>
