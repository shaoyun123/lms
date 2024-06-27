<template>
  <!-- smt分组管理页面 -->
  <div class="app-container">
    <el-card ref="searchCard" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="店铺" prop="storeAcctIdList">
          <z-cascader
            v-model="formData.storeAcctIdList"
            placeholder="全部店铺"
            :data="initFormData.storeData"
          ></z-cascader>
        </el-form-item>
        <el-form-item label="映射关系" prop="complete">
          <el-select v-model="formData.complete" clearable placeholder="全部">
            <el-option :value="true" label="完整" />
            <el-option :value="false" label="不完整" />
          </el-select>
        </el-form-item>
        <el-form-item prop="itemIdNumberMin" class="form_range">
          <el-select
            v-model="formData.groupNumber"
            style="margin-left: 30px; width: 100px"
          >
            <el-option value="1" label="一级分组" />
            <el-option value="2" label="二级分组" />
          </el-select>
          商品数
          <ZInputNumber
            v-model="formData.itemIdNumberMin"
            :min="0"
            :precision="0"
            clearable
          />
          <div class="range_link">-</div>
          <ZInputNumber
            v-model="formData.itemIdNumberMax"
            :min="0"
            :precision="0"
            clearable
          />
        </el-form-item>
        <el-form-item prop="itemIdThirtyNumberMin" class="form_range">
          <el-select
            v-model="formData.groupNumber"
            style="margin-left: 30px; width: 100px"
          >
            <el-option value="1" label="一级分组" />
            <el-option value="2" label="二级分组" />
          </el-select>
          30天销量
          <ZInputNumber
            v-model="formData.itemIdThirtyNumberMin"
            :min="0"
            :precision="0"
            clearable
          />
          <div class="range_link">-</div>
          <ZInputNumber
            v-model="formData.itemIdThirtyNumberMax"
            :min="0"
            :precision="0"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <div style="display: flex; justify-content: right; margin-bottom: 10px">
        <el-button :loading="false" type="primary" @click="getSync"
          >同步分组</el-button
        >
        <el-popover
          ref="popoverRef"
          :virtual-ref="buttonRef"
          trigger="click"
          title="With title"
          virtual-triggering
        >
          <span> Some content </span>
        </el-popover>
      </div>
      <!-- :scroll-y="{ gt: 10 }" -->
      <vxe-table
        ref="tableDataRef"
        :data="tableData"
        header-align="center"
        :height="height"
        border
        :column-config="{ resizable: true }"
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="" title="" width="200">
          <template #header>
            <div>店铺</div>
            <div>销售</div>
          </template>
          <template #default="{ row }">
            <div>{{ row.storeAcctName }}</div>
            <div>{{ row.salesPersonName }}</div>
          </template>
        </vxe-column>
        <!-- <vxe-colgroup title="分组详情">
          <vxe-column field="" title="分组名称"></vxe-column>
          <vxe-column field="" title="速卖通类目"></vxe-column>
          <vxe-column field="" title="商品数"></vxe-column>
          <vxe-column field="" title="30天销量"></vxe-column>
        </vxe-colgroup> -->
        <vxe-column field="" title="分组详情">
          <template #header>
            <div>分组详情</div>
            <div style="display: flex; justify-content: space-around">
              <span style="cursor: pointer"
                ><el-icon v-if="!allExpandAll" @click="changeExpand()"
                  ><CaretRight /></el-icon
                ><el-icon v-else @click="changeExpand()"
                  ><CaretBottom /></el-icon
                >分组名称</span
              >
              <span style="width: 60%">速卖通类目</span>
              <span>商品数</span>
              <span>30天销量</span>
            </div>
          </template>
          <template #default="{ row }">
            <vxe-table
              :ref="stableDataRefList[row.storeAcctId]"
              :column-config="{ resizable: true }"
              :tree-config="{
                transform: true,
                expandAll: isExpandAll
              }"
              :data="row.groupDetailLists"
              :show-header="false"
              @toggle-tree-expand="toggleExpandChangeEvent"
            >
              <!-- :edit-config="{
                trigger: 'click',
                mode: 'cell',
                autoClear: false,
                beforeEditMethod: beforeEdit
              }" -->
              <vxe-column field="groupName" tree-node></vxe-column>
              <vxe-column field="categoryIdStr">
                <!-- :edit-render="{}"
                :slots="{ edit: 'edit' }" -->
                <!-- <template #edit="{ row: cRow }">
                  <div style="display: flex; align-items: center">
                    <el-cascader
                      v-model="cRow.categoryIds"
                      :options="cRow.smtCategoryList"
                      :filter-method="filterCascader"
                      filterable
                      :props="{
                        checkStrictly: true,
                        value: 'categoryId'
                      }"
                      @change="saveCategory(cRow, $event)"
                    ></el-cascader
                    ><el-icon><Edit /></el-icon>
                  </div>
                </template> -->
                <!-- // 一级分组且下面无二级分组和二级分组才支持编辑类目 -->

                <template #default="{ row: cRow }">
                  {{ cRow.categoryTreeName }}
                  <!-- <el-icon
                    v-if="
                      !(
                        cRow.childDetailList && cRow.childDetailList.length != 0
                      )
                    "
                    style="color: #409eff"
                    @hover="beforeEdit"
                    ><Edit
                  /></el-icon> -->
                  <!-- :visible="!!cRow.visible" -->
                  <!-- :ref="popoverRefList[`_${cRow.id}`]" -->
                  <el-popover
                    v-if="
                      !(
                        cRow.childDetailList && cRow.childDetailList.length != 0
                      )
                    "
                    :ref="popperRefList[cRow.id]"
                    width="auto"
                    height="auto"
                    placement="bottom"
                    trigger="click"
                    @show="beforeEdit(row, cRow)"
                  >
                    <template #reference>
                      <el-icon style="color: #409eff; cursor: pointer"
                        ><Edit
                      /></el-icon>
                    </template>
                    <!-- cRow.categoryTreeName -->
                    <el-input
                      v-model="cRow.aa"
                      @input="filterCateFunc(row, $event)"
                    />
                    <el-cascader-panel
                      ref="cateName"
                      v-model="cRow.categoryIds"
                      v-loading="tooltipLoading"
                      style="width: fit-content"
                      :options="row.filterCate"
                      :props="{
                        checkStrictly: true,
                        value: 'categoryId'
                      }"
                      @change="saveCategory(cRow, $event)"
                    />
                    <!-- <el-cascader
                      v-model="cRow.categoryIds"
                      :options="row.filterCate"
                      :filter-method="filterCascader"
                      :popper-append-to-body="false"
                      filterable
                      :props="{
                        checkStrictly: true,
                        value: 'categoryId'
                      }"
                      @change="saveCategory(cRow, $event)"
                    ></el-cascader> -->
                  </el-popover>
                </template>
              </vxe-column>
              <vxe-column field="itemIdNumber" width="120" />
              <vxe-column field="itemIdThirtySalesNumber" width="120" />
            </vxe-table>
            <el-link
              v-if="row.isShow == true || row.isShow == false"
              type="primary"
              @click="expandSingle(row)"
              >{{ row.isShow == false ? '收起全部' : '展开全部' }}</el-link
            >
          </template>
        </vxe-column>
        <vxe-column field="" title="" width="200">
          <template #header>
            <div>修改人</div>
            <div>修改时间</div>
          </template>
          <template #default="{ row }">
            <div>{{ row.modify }}</div>
            <div>{{ transferDate(row.modifyTime) }}</div>
          </template></vxe-column
        >
        <vxe-column field="lastSyncTime" title="最近分组同步时间" width="200"
          ><template #default="{ row }">
            {{ transferDate(row.lastSyncTime) }}
          </template></vxe-column
        >
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="limit"
          background
          :page-sizes="[10, 20, 30]"
          layout="prev, pager, next, sizes, total"
          :total="total"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>

  <el-dialog
    v-model="resDialog"
    :width="700"
    title="结果详情"
    :close-on-click-modal="true"
    :align-center="true"
  >
    <div style="display: flex; justify-content: space-between; margin: 10px 0">
      <span>操作成功：{{ resDialogData.successNum }}个</span>
      <span>操作失败：{{ resDialogData.failNum }}个</span>
    </div>
    <el-table :data="resDialogData.failResults" border max-height="500">
      <el-table-column prop="sku" label="失败物品号" />
      <el-table-column prop="reason" label="失败原因" />
    </el-table>
  </el-dialog>
</template>
<script setup name="customeraliexpressgroupmanage">
  import { ref, reactive, onMounted } from 'vue';
  import ZInputNumber from '@/components/ZInputNumber/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { getStoreList } from '@/api/common';
  import { transferDate, comGetTableHeight } from '@/utils/common';
  import { ElMessage } from 'element-plus';
  import {
    batchSyncGroupByStoreAcctIdList,
    queryByParams,
    getCateTreeByStoreAcctId,
    updateGroupAndCategoryMapping
  } from '@/api/smt/groupmanage';

  const initFormData = reactive({
    // 初始化查询条件
  });
  const formData = ref({
    pageNum: 1,
    pageSize: 1000,
    //店铺Id，必选
    storeAcctIdList: [],
    groupNumber: '2'
  });

  let tableDataRef = ref(null);
  let stableDataRefList = {};
  const searchCard = ref();
  const height = ref();
  onMounted(async () => {
    // 获取table高度
    height.value = comGetTableHeight(searchCard, true, true);
    Promise.all([getStoreList('aliexpress')])
      .then((res) => {
        // 店铺
        initFormData.storeData = res[0].data?.children;
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });
  });
  // 表单ref
  const formRef = ref();
  // 清空
  const resetForm = function () {
    formRef.value.resetFields();

    formData.value.itemIdNumberMax = '';
    formData.value.itemIdThirtyNumberMax = '';
  };

  const tableData = ref(null);
  const tableDataLoading = ref(false);
  const filterParams = () => {
    formData.value.pageNum = currentPage.value;
    formData.value.pageSize = limit.value;
  };
  // 提交查询
  const onSubmit = async () => {
    tableData.value = null;
    filterParams();
    tableDataLoading.value = true;
    const { data, code, count } = await queryByParams({
      ...formData.value
    });
    tableDataLoading.value = false;
    if (code == '0000') {
      total.value = count;
      data &&
        data.forEach((item) => {
          stableDataRefList[item.storeAcctId] = ref(null);
          if (item.groupDetailList && item.groupDetailList?.length != 0) {
            let all = []; //默认展示三条，前端组装的数据，还需要展示这三条下面的子数据，所以需要前三条数据+前三条数据的子数据的总数；
            all = all.concat(item.groupDetailList);
            item.groupDetailList.forEach((cItem) => {
              popperRefList[cItem.id] = ref(null); // popper的ref
              if (cItem.childDetailList && cItem.childDetailList.length != 0) {
                if (
                  formData.value.groupNumber == 2 &&
                  (!!formData.value.itemIdNumberMin ||
                    formData.value.itemIdNumberMin == 0 ||
                    !!formData.value.itemIdNumberMax ||
                    formData.value.itemIdNumberMax == 0 ||
                    !!formData.value.itemIdThirtyNumberMin ||
                    formData.value.itemIdThirtyNumberMin == 0 ||
                    !!formData.value.itemIdThirtyNumberMax ||
                    formData.value.itemIdThirtyNumberMax == 0)
                ) {
                  //展开
                  item.isShow = false;
                } else {
                  item.isShow = true;
                }
              }
              let child2 = cItem.childDetailList.map((i) => {
                i['parentId'] = cItem.id;
                popperRefList[i.id] = ref(null); // popper的ref
                return i;
              });
              all = all.concat(child2);
            });
            item.groupDetailLists = all; // 整理过的分组详情的全部数据
          }
        });
      tableData.value = data;
      // 二级分组，默认全部折叠，有数据且搜索为二级分组展开
      if (
        formData.value.groupNumber == 2 &&
        (!!formData.value.itemIdNumberMin ||
          formData.value.itemIdNumberMin == 0 ||
          !!formData.value.itemIdNumberMax ||
          formData.value.itemIdNumberMax == 0 ||
          !!formData.value.itemIdThirtyNumberMin ||
          formData.value.itemIdThirtyNumberMin == 0 ||
          !!formData.value.itemIdThirtyNumberMax ||
          formData.value.itemIdThirtyNumberMax == 0)
      ) {
        //展开
        isExpandAll.value = true;
        allExpandAll.value = true;
      } else {
        isExpandAll.value = false;
        allExpandAll.value = false;
      }
    }
  };
  let isExpandAll = ref(false); // 默认配置
  let allExpandAll = ref(false); // 表头总控制
  // 表头展开&收起
  const changeExpand = () => {
    const $table = stableDataRefList;
    for (let item in $table) {
      if (isExpandAll.value == true) {
        $table[item].value.clearTreeExpand();
        tableData.value.forEach((item) => {
          !!item.isShow || item.isShow == false ? (item.isShow = true) : '';
        });
      } else {
        $table[item].value.setAllTreeExpand(true);
        tableData.value.forEach((item) => {
          !!item.isShow || item.isShow == false ? (item.isShow = false) : '';
        });
      }
    }
    isExpandAll.value = !isExpandAll.value;
    allExpandAll.value = !allExpandAll.value;
  };
  // 展开全部&收起全部
  const expandSingle = (row) => {
    row.isShow = !row.isShow;
    if (row.isShow == true) {
      stableDataRefList[row.storeAcctId].value.clearTreeExpand();
    } else {
      stableDataRefList[row.storeAcctId].value.setAllTreeExpand(true);
    }
  };
  // 分页
  const currentPage = ref(1);
  const limit = ref(10);
  const total = ref(0);
  const handleSizeChange = (val) => {
    limit.value = val;
    onSubmit();
  };
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    onSubmit();
  };

  let resDialog = ref(false);
  let resDialogData = ref({});
  // 同步分组
  const getSync = async () => {
    const checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择店铺');
      return;
    }

    let { code, data } = await batchSyncGroupByStoreAcctIdList(checkedData);
    if (code == '0000') {
      if (data.failNum == 0) {
        ElMessage.success('操作成功');
      } else {
        resDialog.value = true;
        resDialogData.value = data;
      }
      onSubmit();
    }
  };

  // // 级联多选
  // const filterCascader = (node, keyword) => {
  //   if (
  //     node.label.trim().includes(keyword.trim()) ||
  //     node.text.trim().includes(keyword.trim())
  //   ) {
  //     return node;
  //   }
  // };

  const filterCateFunc = (row, e) => {
    if (e) {
      let data = row.filterCateList.filter((item) => item.label.includes(e));
      row.filterCate = data;
    } else {
      row.filterCate = row.smtCategoryList;
    }
  };

  const tooltipLoading = ref(false);
  const beforeEdit = async (row) => {
    // if (row.childDetailList && row.childDetailList.length != 0) {
    //   return;
    // }
    tooltipLoading.value = true;
    if (!(row.smtCategoryList && row.smtCategoryList.length != 0)) {
      let { code, data } = await getCateTreeByStoreAcctId(row.storeAcctId);
      if (code == '0000') {
        row.smtCategoryList = handleData(data, '', [])[0];
        row.filterCate = handleData(data, '', [])[0];
        row.filterCateList = handleData(data, '', [])[1];
      }
    } else {
      row.aa = '';
      row.filterCate = row.smtCategoryList;
    }
    tooltipLoading.value = false;
    // cRow.visible = !cRow.visible;
  };

  function handleData(res, pName, arr) {
    res.forEach((item) => {
      item['label'] = `${item.cnName}(${item.enName})`;
      if (pName) {
        item['pName'] = pName + '>>' + `${item.cnName}(${item.enName})`;
        arr.push({
          label: pName + '>>' + `${item.cnName}(${item.enName})`,
          categoryId: item.categoryId
        });
      } else {
        item['pName'] = `${item.cnName}(${item.enName})`;
        arr.push({
          label: `${item.cnName}(${item.enName})`,
          categoryId: item.categoryId
        });
      }
      if (item.children && item.children.length != 0) {
        handleData(
          item.children,
          pName
            ? pName + '>>' + `${item.cnName}(${item.enName})`
            : `${item.cnName}(${item.enName})`,
          arr
        );
      }
    });
    return [res, arr];
  }

  const cateName = ref();
  let popperRefList = {};
  const saveCategory = async (cRow, categoryIdList) => {
    // await stableDataRef.value.clearEdit();
    const { code } = await updateGroupAndCategoryMapping({
      storeAcctId: cRow.storeAcctId,
      groupId: cRow.groupId,
      categoryIds: categoryIdList[categoryIdList.length - 1]
    });

    if (code == '0000') {
      cRow.categoryTreeName =
        cateName.value.checkedNodes[0].pathLabels.join('>>');
      ElMessage.success('操作成功');
      // 该类目已经映射3个分组，请重新选择类目
      popperRefList[cRow.id].value.hide(); // 隐藏popper
      cRow.aa = '';
    }
  };
</script>

<style scoped lang="scss">
  .card_position {
    position: relative;
  }
</style>
