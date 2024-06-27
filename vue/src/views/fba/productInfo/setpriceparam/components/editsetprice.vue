<template>
  <el-dialog
    width="80%"
    :title="`平台佣金 - ${editSite}`"
    :model-value="showDialog"
    :close-on-click-modal="false"
    destroy-on-close
    @close="closeDialog"
  >
    <div ref="detailRef">
      <el-form
        size="default"
        status-icon
        :model="searchForm"
        :label-width="90"
        :inline="true"
      >
        <el-form-item label="佣金分类名称" label-width="90">
          <el-input v-model="searchForm.ruleName" />
        </el-form-item>
        <el-form-item
          label="亚马逊类目"
          prop="cateName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="cateIdList"
            :options="cateListOption"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'localCateName',
              value: 'categoryId',
              children: 'children'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="销售佣金百分比=" label-width="120">
          <el-input v-model="searchForm.commissionRate" type="number">
            <template #append>%</template></el-input
          >
        </el-form-item>
        <el-form-item label="适用的最低销售佣金=" label-width="150">
          <el-input v-model="searchForm.totalMinCommision" type="number" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch"
            >查询</el-button
          >
          <el-button size="small" @click="handleReset">清空</el-button>
        </el-form-item>
      </el-form>
      <div class="add_btn">
        <el-button type="primary" size="small" @click="handleAddCommission"
          >新增</el-button
        >
      </div>
      <vxe-table
        :data="commissionList"
        height="450"
        :loading="commissionLoading"
      >
        <vxe-column title="ID" field="id" width="80"></vxe-column>
        <vxe-column title="佣金分类名称" field="ruleName"></vxe-column>
        <vxe-column title="亚马逊类目">
          <template #default="{ row }">
            <div style="position: relative">
              <div class="cate_overflow">
                {{ row.cateList?.map((item) => item.fullCateName).join(',') }}
              </div>
              <el-icon
                v-if="row.cateList?.length > 0"
                class="copy_icon"
                style="
                  position: absolute;
                  bottom: 5px;
                  right: 0;
                  cursor: pointer;
                "
                size="16"
                color="#aaa"
                @click="
                  copy(
                    row.cateList?.map((item) => item.fullCateName).join(',') ||
                      ''
                  )
                "
                ><CopyDocument
              /></el-icon>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="销售佣金百分比">
          <template #default="{ row }">
            <div v-for="(item, index) in row.subRuleList" :key="index">
              售价： ({{ item.chargeStartPrice }},
              <span>{{
                item.chargeEndPrice === undefined || item.chargeEndPrice === ''
                  ? '+∞'
                  : item.chargeEndPrice
              }}</span
              >] <span> {{ row.applyAllScopes ? ' -> ' : ' 的部分 ' }}</span
              >{{ getRate(item.commissionRate) }}
              %
            </div>
          </template>
        </vxe-column>
        <vxe-column title="适用的最低销售佣金" width="150">
          <template #default="{ row }">
            {{ row.currencySign }}{{ row.totalMinCommision }}
          </template>
        </vxe-column>
        <vxe-column title="备注" field="remark"></vxe-column>
        <vxe-column title="操作" width="150">
          <template #default="{ row }">
            <el-button type="danger" @click="handleDelete(row)">删除</el-button>
            <el-button type="primary" @click="updateSetPrice(row)"
              >编辑</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <template #footer>
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>

  <Editcommission
    v-if="fbaEditCommissionDialog"
    :is-visible="fbaEditCommissionDialog"
    :title="commissionTitle"
    :currency-sign="currencySign"
    :edit-info="editInfo"
    :site-id="props.siteId"
    @close="handleEditCommissionClose"
  />
</template>
<script setup>
  import { defineProps, defineEmits, reactive, onMounted, ref } from 'vue';
  import {
    querAmazonCate,
    queryCommisionRuleList,
    deleteByParentRuleId
  } from '@/api/fba/setpriceparams.js';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import Editcommission from './editcommission.vue';
  import { copy } from '@/utils/common';

  const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false
    },
    siteId: {
      type: String,
      default: ''
    },
    editSite: {
      type: String,
      default: ''
    },
    currencySign: {
      type: String,
      default: ''
    }
  });
  const emit = defineEmits(['closeDialog']);

  const cateIdList = ref([]);
  const searchForm = reactive({
    ruleName: '',
    commissionRate: '',
    totalMinCommision: ''
  });

  onMounted(() => {
    queryCatelist();
    handleSearch();
  });

  const cateListOption = ref([]);
  const queryCatelist = async () => {
    try {
      const { data } = await querAmazonCate({
        salesSite: props.siteId,
        parentRuleId: ''
      });
      cateListOption.value = data;
    } catch (err) {
      console.log(err);
    }
  };
  const getRate = (val) => {
    if (!isNaN(val)) {
      let dotLength = String(val).length - (String(val).indexOf('.') + 1);

      return (val + '').indexOf('.') != -1 && dotLength > 3
        ? parseFloat(val * 100).toFixed(2)
        : parseFloat(val * 100).toFixed(dotLength - 2 > 0 ? dotLength - 2 : 0);
    }
  };
  // 级联多选
  const filterCascader = (node, keyword) => {
    if (
      node.label.trim().includes(keyword.trim()) ||
      node.text.trim().includes(keyword.trim())
    ) {
      return node;
    }
  };

  const findAnemById = (arr, list) => {
    let ids = [].concat(list);
    if (ids.length === 0) {
      return null; // 如果 ids 为空，则返回 null
    }
    const id = ids.shift(); // 取出数组的第一个元素，并从数组中移除
    for (let item of arr) {
      if (item.categoryId === id) {
        if (ids.length === 0) {
          return item.localFullCateName; // 如果 ids 已经为空，则返回当前 item 的 localFullCateName
        }
        if (item.children) {
          return findAnemById(item.children, ids); // 递归调用，继续在 children 中查找
        }
      }
    }
    return null; // 如果未找到匹配的 id，则返回 null
  };

  // 查询
  const commissionList = ref([]);
  const commissionLoading = ref(false);
  const handleSearch = async () => {
    try {
      let cateList = [];
      if (cateIdList.value?.length > 0) {
        cateIdList.value?.forEach((item) => {
          let obj = {
            categoryId: '',
            fullCateName: ''
          };
          obj.categoryId = item[item.length - 1];
          obj.fullCateName = findAnemById(cateListOption.value, item);
          cateList.push(obj);
        });
      }
      commissionLoading.value = true;
      const { data } = await queryCommisionRuleList({
        siteId: props.siteId,
        ...searchForm,
        cateList
      });
      commissionLoading.value = false;
      commissionList.value = data || [];
    } catch (err) {
      console.log(err);
      commissionLoading.value = false;
    }
  };

  const handleReset = () => {
    searchForm.ruleName = '';
    searchForm.commissionRate = '';
    searchForm.totalMinCommision = '';
    cateIdList.value = [];
  };

  // 新增 编辑
  const fbaEditCommissionDialog = ref(false);
  const editInfo = ref({});

  const handleEditCommissionClose = (val) => {
    fbaEditCommissionDialog.value = false;
    if (val === 'update') {
      handleSearch();
    }
  };

  const commissionTitle = ref('新增');

  const handleAddCommission = () => {
    commissionTitle.value = '新增';
    fbaEditCommissionDialog.value = true;
    editInfo.value = {};
  };

  // 编辑佣金
  const updateSetPrice = (row) => {
    fbaEditCommissionDialog.value = true;
    commissionTitle.value = '编辑';
    editInfo.value = row;
  };

  const handleDelete = (row) => {
    ElMessageBox.confirm(`确定要删除该条配置？删除后将不可恢复！`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        const { code } = await deleteByParentRuleId({
          parentRuleId: row.id
        });
        if (code == '0000') {
          ElMessage.success('删除成功！');
          handleSearch();
        }
      })
      .catch(() => {});
  };

  const closeDialog = () => {
    emit('closeDialog', 'update');
  };
</script>
<style scoped lang="scss">
  .add_btn {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    margin: 10px 0;
  }
  .cate_overflow {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
</style>
