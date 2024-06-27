<template>
  <div class="tiktokSalesProhibitionCateWhiteList">
    <el-dialog
      v-model="showExport"
      title="白名单管理"
      width="65%"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item
          label="TikTok类目"
          prop="tiktokName"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="formData.tiktokName"
            :options="initFormData.merList"
            :filter-method="filterCascader"
            filterable
            clearable
            collapse-tags
            :props="{
              multiple: true,
              label: 'cnName',
              value: 'categoryId'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="创建人" prop="creators">
          <el-select
            v-model="formData.creators"
            placeholder="请选择"
            :class="formData.creators.length > 1 ? 'hideTag' : ''"
            filterable
            collapse-tags
            clearable
            multiple
          >
            <template #prefix>
              <el-tag v-if="formData.creators.length > 1" type="info"
                >已选{{ formData.creators.length }}项</el-tag
              >
            </template>
            <el-option
              v-for="item in initFormData.creatorIds"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="店铺"
          prop="storeAcctId"
          class="search_item_cascader"
        >
          <el-cascader
            v-model="formData.storeAcctId"
            :options="storeList"
            :filter-method="filterStore"
            filterable
            clearable
            collapse-tags
            :props="{ multiple: true }"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="false" @click="onSubmit"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-button type="danger" @click="batchDel">批量删除</el-button>
          <el-button type="primary" @click="exportExcel">导出</el-button>
        </div>
        <div style="display: flex">
          <el-button type="primary" style="margin-right: 12px">
            <a
              style="color: #fff; text-decoration: none"
              href="/api/lms/static/templet/tiktokCateWhitelistImportTemplate.xlsx"
              target="_blank"
              >下载模板</a
            >
          </el-button>
          <el-upload
            :action="'/api/lms/tiktokCateWhitelist/importWhitelistData'"
            :on-success="importSuccess"
            :on-error="importError"
            :show-file-list="false"
          >
            <el-button type="primary">导入新增</el-button>
          </el-upload>
        </div>
      </div>
      <vxe-table
        ref="tableDataRef"
        v-loading="tableDataLoading"
        :data="tableData"
        :scroll-y="{ gt: 10 }"
        height="500px"
        :align="'center'"
        border
      >
        <vxe-column type="checkbox" width="40" />
        <vxe-column field="categoryId" title="白名单类目ID" />
        <vxe-column field="fullCateName" title="白名单类目" />
        <vxe-column field="storeAcct" title="白名单店铺" />
        <vxe-column field="createTime" title="创建时间">
          <template #default="{ row }">
            {{ row.createTime ? parseTime(row.createTime, '{y}-{m}-{d}') : '' }}
          </template>
        </vxe-column>
        <vxe-column field="creator" title="创建人" />
        <vxe-column title="操作"
          ><template #default="{ row }"
            ><el-button type="danger" width="120" @click="Del(row.id)"
              >删除</el-button
            ></template
          >
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          background
          :page-sizes="[50, 100, 200]"
          layout="prev, pager, next,sizes, total"
          :total="total"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <template #footer>
        <span>
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <el-dialog
    v-model="resultVisible"
    width="300"
    title="导出"
    destroy-on-close
    :close-on-click-modal="false"
    @close="resultVisible = false"
  >
    <el-form-item>
      <el-radio-group v-model="resultType">
        <el-radio value="按查询结果导出" />
        <el-radio value="按列表选中导出" />
      </el-radio-group>
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="SaveResult"> 保存 </el-button>
        <el-button @click="resultVisible = false"> 关闭 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, computed, onMounted, toRefs } from 'vue';
  import { parseTime } from '@/utils/common';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { transBlob } from '@/utils/downloadFile';
  import {
    batchRemoveWhitelistCate,
    queryPageWhitelist
    // exportAllWhitelistData
  } from '@/api/publishs/tiktoksalesprohibitioncate';

  import { getStoreList } from '@/api/common';
  const props = defineProps({
    // 是否显示弹窗
    isVisible: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: () => {}
    },
    initFormData: {
      type: Object,
      default: () => {}
    }
  });
  const { detailData } = toRefs(props);
  const formData = ref({
    tiktokName: '',
    storeAcctId: [],
    creators: []
  });
  const showExport = computed(() => {
    return props.isVisible;
  });

  let storeList = ref([]);
  onMounted(async () => {
    let { data } = await getStoreList('tiktok');
    storeList.value = data?.children;
    if (detailData.value && detailData.value.id) {
      formData.value = { ...deepCopy(detailData.value) };
    }
  });
  const emits = defineEmits(['close', 'submit']);
  const handleClose = (val) => {
    emits('close', val);
  };

  // 查询条件表单ref
  const formRef = ref();
  // 查询条件表单清空
  const resetForm = function () {
    formRef.value.resetFields();
    formData.value.categoryIds = [];
    formData.value.storeAcctIds = [];
  };

  const tableData = ref(null);
  // 查询条件提交查询
  const onSubmit = async () => {
    tableData.value = null;
    formData.value.page = currentPage.value;
    formData.value.limit = pageSize.value;
    if (
      formData.value.tiktokName.length &&
      formData.value.tiktokName.length != 0
    ) {
      formData.value.categoryIds = [];
      formData.value.tiktokName.forEach((item) => {
        formData.value.categoryIds.push(item[item.length - 1]);
      });
    } else {
      formData.value.categoryIds = [];
    }
    if (
      formData.value.storeAcctId.length &&
      formData.value.storeAcctId.length != 0
    ) {
      formData.value.storeAcctIds = [];
      formData.value.storeAcctId.forEach((item) => {
        formData.value.storeAcctIds.push(item[item.length - 1]);
      });
    } else {
      formData.value.storeAcctIds = [];
    }
    let { code, data } = await queryPageWhitelist(formData.value);
    if (code == '0000') {
      tableData.value = data.list;
      total.value = data.total;
    }
  };
  // 深拷贝
  function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = deepCopy(obj[key]); //递归复制
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }

  // 导入新增
  const importSuccess = (res) => {
    if (res.code == '0000') {
      let str = res.msg + '\n';
      if (res.data && res.data.length != 0) {
        for (let key in res.data) {
          str += '<div>' + key + JSON.stringify(res.data[key]) + '</div>';
        }
      }
      ElMessageBox.alert(`<div>${str}</div>`, '导入成功', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '取消'
      });
    } else {
      ElMessageBox.alert(res.msg || '导入新增失败！', '错误信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error'
      });
    }
  };
  const importError = () => {
    ElMessage.error('导入新增失败！');
  };

  // 导出
  const resultVisible = ref(false);
  const resultType = ref('按查询结果导出');
  const exportExcel = () => {
    // 按查询结果/按列表选中导出
    resultVisible.value = true;
  };
  const SaveResult = async () => {
    if (resultType.value == '按查询结果导出') {
      if (
        formData.value.tiktokName.length &&
        formData.value.tiktokName.length != 0
      ) {
        formData.value.categoryIds = [];
        formData.value.tiktokName.forEach((item) => {
          formData.value.categoryIds.push(item[item.length - 1]);
        });
      } else {
        formData.value.categoryIds = [];
      }
      if (
        formData.value.storeAcctId.length &&
        formData.value.storeAcctId.length != 0
      ) {
        formData.value.storeAcctIds = [];
        formData.value.storeAcctId.forEach((item) => {
          formData.value.storeAcctIds.push(item[item.length - 1]);
        });
      } else {
        formData.value.storeAcctIds = [];
      }
      transBlob({
        url: '/lms/tiktokCateWhitelist/exportAllWhitelistData',
        contentType: 'application/json',
        data: formData.value,
        fileName: '白名单.xls'
      }).finally(() => {
        // ElMessage.success('下载成功');
        resultVisible.value = false;
      });
    } else if (resultType.value == '按列表选中导出') {
      let checkedData = tableDataRef.value.getCheckboxRecords();
      if (checkedData.length == 0) {
        return ElMessage.warning('请至少选择一条数据');
      }
      transBlob({
        url: '/lms/tiktokCateWhitelist/exportSelectedWhitelistData',
        contentType: 'application/json',
        data: checkedData,
        fileName: '白名单.xls'
      }).finally(() => {
        // ElMessage.success('下载成功');
        resultVisible.value = false;
      });
    }
  };

  let tableDataRef = ref();
  // 批量删除
  const batchDel = async () => {
    let checkedData = tableDataRef.value.getCheckboxRecords();
    if (checkedData.length == 0) {
      return ElMessage.warning('请至少选择一条数据');
    }
    let ids = checkedData.map((item) => item.id);
    Del(ids.join(','));
  };
  // 单个删除
  const Del = async (ids) => {
    ElMessageBox.confirm('确认要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      let { code } = await batchRemoveWhitelistCate({ ids });
      if (code == '0000') {
        ElMessage.success('删除成功');
        onSubmit();
      }
    });
  };
  const currentPage = ref(1);
  const pageSize = ref(50);
  const total = ref(0);

  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
    onSubmit();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    onSubmit();
  };
</script>
<style lang="scss" scoped>
  .lazadaAutoReplyDetail {
    :deep(.el-dialog__body) {
      padding-top: 0px !important;
    }
    :deep(.el-select) {
      width: 100%;
    }
    :deep(.el-date-editor--time) {
      width: 100%;
    }
  }

  .warnTxt {
    color: #aaa;
    margin-bottom: 10px;
  }
</style>
