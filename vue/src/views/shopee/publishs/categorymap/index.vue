<template>
  <!--shopee-类目映射 -->
  <div class="categorymap app-container">
    <el-card
      ref="searchCardRef"
      class="common_split_bottom search_card"
      :loading="searchCardLoading"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item
          label="OA类目"
          prop="oaCateIdList"
          class="categorymap_item_cascader"
        >
          <el-cascader
            v-model="formData.oaCateIdList"
            :options="oaList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'title',
              children: 'data'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="OA类目ID" prop="oaInputCateIdList">
          <el-input
            v-model="formData.oaInputCateIdList"
            placeholder="英文逗号隔开"
            clearable
            @blur="formatIdList('oaInputCateIdList')"
          />
        </el-form-item>
        <el-form-item
          label="CNSC类目"
          prop="cnscCateIdList"
          class="categorymap_item_cascader"
          ><el-cascader
            v-model="formData.cnscCateIdList"
            :options="cnscLsit"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true
            }"
          ></el-cascader
        ></el-form-item>
        <el-form-item label="CNSC类目ID" prop="cnscInputCateIdList">
          <el-input
            v-model="formData.cnscInputCateIdList"
            placeholder="英文逗号隔开"
            clearable
            @blur="formatIdList('cnscInputCateIdList')"
          />
        </el-form-item>
        <el-form-item label="修改人" prop="modifierList">
          <el-select
            v-model="formData.modifierList"
            clearable
            multiple
            filterable
            :class="[
              formData.modifierList.length > 1
                ? 'categorymap_item_mulselect'
                : '',
              'categorymap_item_modifierList'
            ]"
          >
            <template #prefix>
              <el-tag v-if="formData.modifierList.length > 1" type="info">
                已选{{ formData.modifierList.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in modifierList"
              :key="item"
              :label="item"
              :value="item"
          /></el-select>
        </el-form-item>
        <el-form-item label="是否映射" prop="isMapping">
          <el-select v-model="formData.isMapping" clearable filterable>
            <el-option
              v-for="item in MAPPING_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          /></el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button
          ><el-button type="primary" @click="handleResetForm(formRef)"
            >清空</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
    <el-card v-loading="queryLoading" class="common_split_bottom list_card">
      <el-tabs
        v-model="activeKey"
        v-loading="queryLoading"
        type="card"
        class="demo-tabs"
        @tab-click="handleTab"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.label"
          :label="`${item.label}(${item.count})`"
          :name="item.status"
        >
          <vxe-table
            ref="tableRef"
            :data="tableData"
            :height="height"
            :scroll-y="{ gt: 20 }"
            border
            :row-config="{ isCurrent: true, isHover: true }"
            :column-config="{ resizable: true }"
          >
            <vxe-column type="checkbox" width="40" />
            <vxe-column field="oaCateName" title="OA类目"></vxe-column>
            <vxe-column field="oaCateId" title="OA类目ID"></vxe-column>
            <vxe-column field="cnscCateName" title="CNSC类目"></vxe-column>
            <vxe-column field="cnscCateId" title="CNSC类目ID">
              <template #default="{ row }">
                <el-input v-model="row.cnscCateId" clearable></el-input>
              </template>
            </vxe-column>
            <vxe-column field="modify" title="修改人">
              <template #default="{ row }">
                {{ row.modifier }}
                <br />
                {{ transferDate(row.modifyTime) }}
              </template>
            </vxe-column>
            <vxe-column title="操作" width="80">
              <template #default="{ row }">
                <el-button
                  v-permission="['categorymapSaveBtn']"
                  :loading="row.saveLoading"
                  type="primary"
                  @click="handleSave(row)"
                  >保存</el-button
                >
              </template>
            </vxe-column>
            <!-- <vxe-column
          v-if="showBtn(PERMISSION_ENUM.edit)"
          title="操作"
          width="80"
        >
          <template #default="{ row }">
            <el-button
              v-permission="['categorymapSaveBtn']"
              :loading="row.saveLoading"
              type="primary"
              @click="handleSave(row)"
              >保存</el-button
            >
          </template>
        </vxe-column> -->
          </vxe-table>
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
        </el-tab-pane>
      </el-tabs>
      <div class="common_batch_btns">
        <el-form :model="batchData" :inline="true" class="search_form">
          <el-form-item label="店铺7日销量" class="form_range">
            <el-input v-model="batchData.minSales" clearable />
            <span class="range_devide"> - </span>
            <el-input v-model="batchData.maxSales" clearable />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="batchData.isFilterCategoryNotAdjustedListing"
              label="过滤类目未调整listing"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="batchUpdateCateLoading"
              type="primary"
              @click="batchUpdateCate"
              >修改在线listing</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup name="shopeepublishscategorymap">
  import { computed, onMounted, ref, reactive } from 'vue';
  // import { getItem } from '@/utils/storage';
  import { transferDate } from '@/utils/common';
  import {
    queryModifier,
    queryList,
    updateCate,
    queryCnscCategory,
    batchUpdateItemCateApi
  } from '@/api/shopee/categorymap';
  import { queryOaCategory } from '@/api/common';
  import { ElMessage } from 'element-plus';

  const searchCardLoading = ref(false);
  onMounted(async () => {
    searchCardLoading.value = true;
    getModifierList();
    getOaList();
    getCnscList();
    searchCardLoading.value = false;
  });

  // 保存按钮权限 categorymapSaveBtn
  // const PERMISSION_ENUM = {
  //   edit: 'categorymapSaveBtn'
  // };
  // const showBtn = (btn) => {
  //   let permissionBtn = getItem('buttonPermission') || [];
  //   if (permissionBtn.includes(btn)) return true;
  //   return false;
  // };

  const formatIdList = (keyword) => {
    formData[keyword] = formData[keyword]
      .replaceAll('，', ',')
      .split(',')
      .filter((item) => (Number(item) || item == 0) && item !== '')
      .join();
  };

  const searchCardRef = ref(null);
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    const searchCardHeight = searchCardRef.value
      ? searchCardRef.value.$el.clientHeight
      : '';
    return clientHeight - 167 - searchCardHeight;
  });

  const formData = reactive({
    oaCateIdList: [],
    cnscCateIdList: [],
    modifierList: [],
    oaInputCateIdList: '',
    cnscInputCateIdList: ''
  });
  const formRef = ref();
  const tableRef = ref();
  const tableData = ref();
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });
  const queryLoading = ref(false);
  const handleSearch = async () => {
    queryLoading.value = true;
    const { limit, page } = paginationData;
    let {
      oaCateIdList,
      oaInputCateIdList,
      cnscCateIdList,
      cnscInputCateIdList
    } = formData;
    oaCateIdList = oaCateIdList.length ? filterName(oaCateIdList) : [];
    cnscCateIdList = cnscCateIdList.length ? filterName(cnscCateIdList) : [];
    oaInputCateIdList = oaInputCateIdList ? oaInputCateIdList.split(',') : [];
    cnscInputCateIdList = cnscInputCateIdList
      ? cnscInputCateIdList.split(',')
      : [];
    try {
      const { data, count } = await queryList({
        limit,
        page,
        ...formData,
        oaCateIdList,
        oaInputCateIdList,
        cnscCateIdList,
        cnscInputCateIdList
      });
      tableData.value = (data || []).map((item) => ({
        ...item,
        saveLoading: false
      }));
      queryLoading.value = false;
      paginationData.total = count;
      getTabCount(count);
    } catch (err) {
      queryLoading.value = false;
      console.log('err :>> ', err);
    }
  };
  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };
  const filterStore = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };
  const filterName = (arr) => {
    let nameArr = [];
    arr.forEach((item) => {
      let length = item.length;
      const curVal = item[length - 1];
      nameArr.push(curVal);
    });
    return nameArr;
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

  const activeKey = ref('all');
  const tabList = ref([{ label: '数量', count: 0, status: 'all' }]);
  const handleTab = ({ paneName }) => {
    activeKey.value = paneName;
    handleSearch();
  };

  const getTabCount = (totalCount) => {
    tabList.value.forEach((item) => {
      if (item.status === activeKey.value) {
        item.count = totalCount;
      }
    });
  };

  const batchUpdateCateLoading = ref(false);
  const batchData = ref({});
  const batchUpdateCate = async () => {
    const $table = findTable();
    const checkedList = $table.getCheckboxRecords();
    const checkedLen = checkedList.length;
    if (!checkedLen) return ElMessage.warning('请选择数据');
    const oaCateIdList = checkedList.map((item) => item.oaCateId);
    try {
      batchUpdateCateLoading.value = true;
      const { msg } = await batchUpdateItemCateApi({
        ...batchData.value,
        oaCateIdList
      });
      ElMessage.success(msg || '操作成功');
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      batchUpdateCateLoading.value = false;
    }
  };

  // 保存
  const handleSave = async (row) => {
    const { id, cnscCateId } = row;
    if (cnscCateId === '') return ElMessage.warning('请填写数据');
    try {
      row.saveLoading = true;
      const { data, msg } = await updateCate({ id, cnscCateId });
      row.cnscCateId = data.cnscCateId;
      row.cnscCateName = data.cnscCateName;
      row.modifier = data.modifier;
      row.modifyTime = data.modifyTime;
      getModifierList();
      row.saveLoading = false;
      ElMessage.success(msg || '操作成功');
    } catch (err) {
      row.saveLoading = false;
      console.log('err :>> ', err);
    }
  };

  const MAPPING_LIST = [
    { label: '是', value: true },
    { label: '否', value: false }
  ];

  const modifierList = ref();
  const getModifierList = async () => {
    try {
      const { data } = await queryModifier();
      modifierList.value = data;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const oaList = ref();
  const getOaList = async () => {
    try {
      const { data } = await queryOaCategory();
      oaList.value = data;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const cnscLsit = ref();
  const getCnscList = async () => {
    try {
      const { data } = await queryCnscCategory();
      cnscLsit.value = data;
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  const findTable = () => {
    const $table = tableRef.value;
    const tableIndex = tabList.value.findIndex(
      (item) => item.status === activeKey.value
    );
    return $table[tableIndex];
  };
</script>

<style lang="scss" scoped>
  .categorymap {
    .categorymap_item_cascader {
      :deep(.el-input) {
        height: 24px;
      }
      :deep(.el-cascader__tags .el-tag) {
        margin: 0 0 0 5px;
      }
      :deep(.el-tag--small) {
        padding: 0 2px;
      }
      :deep(.el-cascader__tags) {
        flex-wrap: nowrap;

        span:first-child {
          max-width: 40px;
        }
        span:last-child {
          width: 30px;
        }
        input {
          min-width: 10px;
          height: auto;
          margin: 0;
        }
      }
    }
    :deep(.categorymap_item_mulselect .has-prefix) {
      span {
        display: none;
      }
      min-width: 60px;
    }
  }
  .common_batch_btns {
    top: 0px !important;
  }
  .form_range {
    :deep(.el-input) {
      width: 70px !important;
    }
    .range_devide {
      width: 10px;
      text-align: center;
    }
  }
</style>
