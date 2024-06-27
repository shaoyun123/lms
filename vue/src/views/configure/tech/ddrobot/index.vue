<template>
  <!-- 钉钉机器人 -->
  <div class="app-container">
    <el-card ref="searchCardRef" class="common_split_bottom search_card">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :inline="true"
        class="search_form"
      >
        <el-form-item label="机器人名称" prop="robotName">
          <el-input
            v-model="formData.robotName"
            clearable
            placeholder="模糊搜索"
          />
        </el-form-item>
        <el-form-item label="群聊名称" prop="chatName">
          <el-input
            v-model="formData.chatName"
            clearable
            placeholder="模糊搜索"
          />
        </el-form-item>
        <el-form-item label="调用类型名称" prop="businessTypeName">
          <el-input
            v-model="formData.businessTypeName"
            clearable
            placeholder="模糊搜索"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch(ruleFormRef)"
            >查询</el-button
          ><el-button @click="handleResetForm(ruleFormRef)"
            >清空</el-button
          ></el-form-item
        >
      </el-form>
    </el-card>
    <el-card class="list_card">
      <el-tabs
        v-model="activeKey"
        v-loading="serachLoading"
        type="card"
        @tab-click="handleSearch"
      >
        <el-tab-pane :name="'1'" :label="'数量(' + paginationData.total + ')'">
          <vxe-grid ref="tableDataRef" v-bind="gridOptions">
            <template #avartor_default="{ row }">
              <ImagePop :src="row.robotAvatar" />
            </template>
            <template #businessType_default="{ row }">
              <div>{{ row.businessTypeName }}</div>
              <div>SendMessageBusinessType：{{ row.businessType }}</div>
            </template>
            <template #timecol_default="{ row }">
              {{ transferDate(row.createTime) }}
            </template>
            <template #remark_default="{ row }">
              <vxe-input
                v-model="row.remark"
                @blur="handleRemark(row.remark, row, rowIndex)"
                @focus="previousRemark = row.remark"
              ></vxe-input>
            </template>
            <template #toolbar_default="{ row }">
              <el-popconfirm
                title="确定删除吗?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDel(row)"
              >
                <template #reference>
                  <el-button type="danger" :loading="row.delLoading"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </template>
          </vxe-grid>
          <div class="pagination">
            <el-pagination
              v-model:currentPage="paginationData.page"
              v-model:page-size="paginationData.limit"
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
      <div class="common_batch_btns ddrobot-btn">
        <span>
          xxljob定时任务失败告警邮件支持配置钉钉自定义webhook机器人token，格式取{https://oapi.dingtalk.com/robot/send?access_token=b81979ef6cc9e7b691b7bdb7ffe4265e27d4d64bfa2f4e2605746ef72146f7c6}的token参数，可与邮箱混用。
        </span>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </el-card>
    <EditDialog v-model="dialogVisible" @handle-search="handleSearch" />
  </div>
</template>

<script setup name="configuretechddrobot">
  import { onMounted, reactive, ref } from 'vue';
  import { transferDate } from '@/utils/common';
  import { queryListApi, delApi, remarkApi } from '@/api/configure/ddrobot';
  import { ElMessage } from 'element-plus';
  import ImagePop from '@/components/ImagePop/index.vue';
  import EditDialog from './components/EditDialog.vue';
  import { comGetTableHeight } from '@/utils/common';

  const activeKey = ref('1');
  const searchCardRef = ref(null);
  const formData = reactive({});
  const ruleFormRef = ref();
  const paginationData = reactive({
    total: 0,
    limit: 50,
    page: 1
  });

  const serachLoading = ref(false);
  const gridOptions = reactive({
    border: true,
    showFooter: true,
    height: 200,
    columnConfig: {
      resizable: true
    },
    showOverflow: true,
    scrollY: { gt: 15 },
    rowConfig: { isCurrent: true, isHover: true, keyField: 'id' },
    editConfig: {
      trigger: 'click',
      mode: 'cell'
    },
    data: [],
    columns: [
      {
        field: 'robotAvatar',
        title: '机器人头像',
        slots: { default: 'avartor_default' }
      },
      { field: 'robotCode', title: '机器人ID' },
      { field: 'robotName', title: '机器人名称' },
      { field: 'scene', title: '使用场景' },
      {
        field: 'chatName',
        title: '群聊名称'
      },
      {
        field: 'chatId',
        title: '群聊chatId'
      },
      {
        field: 'businessTypeInfo',
        title: '调用类型信息',
        width: 300,
        slots: { default: 'businessType_default' }
      },
      {
        field: 'createUserName',
        title: '创建人'
      },
      {
        field: '创建人',
        title: '创建时间',
        slots: { default: 'timecol_default' }
      },
      {
        field: 'remark',
        title: '备注',
        slots: { edit: 'remark_default' },
        editRender: {}
      },
      {
        field: 'toolbar',
        title: '操作',
        width: 100,
        slots: { default: 'toolbar_default' }
      }
    ],
    footerMethod() {}
  });

  const previousRemark = ref('');
  const handleRemark = async (value, row, rowIndex) => {
    console.log(row, value);
    try {
      if (previousRemark.value == value) {
        return;
      }
      const { msg } = await remarkApi({ remark: value, id: row.id });
      ElMessage.success(msg);
    } catch (err) {
      gridOptions.data[rowIndex]['remark'] = previousRemark.value;
      previousRemark.value = '';
      console.log('err :>> ', err);
    }
  };

  const tableDataRef = ref();
  onMounted(() => {
    // 获取table高度
    gridOptions.height = comGetTableHeight(searchCardRef, true, true);
  });

  const handleResetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };

  const handleSearch = async () => {
    serachLoading.value = true;
    try {
      const params = {
        ...formData,
        chatName: formData.chatName ? formData.chatName : null,
        pageNum: paginationData.page,
        pageSize: paginationData.limit
      };
      const { data, count } = await queryListApi(params);
      gridOptions.data = (data || []).map((item) => ({
        ...item,
        delLoading: false
      }));
      paginationData.total = count;
    } catch (err) {
      gridOptions.data = [];
      paginationData.total = 0;
    } finally {
      serachLoading.value = false;
    }
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

  // 删除
  const handleDel = async (row) => {
    try {
      row.delLoading = true;
      const params = {
        robotCode: row.robotCode,
        businessType: row.businessType
      };
      const { msg } = await delApi(params);
      ElMessage.success(msg);
      handleSearch();
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      row.delLoading = false;
    }
  };

  // 新增
  const dialogVisible = ref(false);
  const handleAdd = () => {
    dialogVisible.value = true;
  };
</script>

<style lang="scss" scoped>
  .ddrobot-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - 140px);
  }
</style>
