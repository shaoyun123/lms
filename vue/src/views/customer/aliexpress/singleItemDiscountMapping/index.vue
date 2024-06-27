<template>
  <!-- smt单品折扣映射页面 -->
  <div class="app-container">
    <el-card ref="searchCard" class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="100"
        class="search_form"
      >
        <el-form-item label="活动状态" prop="actStatus">
          <MultiSelect
            v-model="formData.actStatus"
            :option-obj="{
              optionList: initFormData.statusData,
              value: 'value',
              label: 'label'
            }"
          />
        </el-form-item>
        <el-form-item prop="discount" label="单品折扣名称">
          <el-input v-model="formData.discount" clearable></el-input>
        </el-form-item>
        <el-form-item label="店铺" prop="storeIdList">
          <z-cascader
            v-model="formData.storeIdList"
            :data="initFormData.storeData"
          ></z-cascader>
        </el-form-item>
        <el-form-item label="有无优惠幅度" prop="discountType">
          <el-select v-model="formData.discountType" clearable>
            <el-option :value="1" label="有优惠幅度" />
            <el-option :value="0" label="无优惠幅度" />
          </el-select>
        </el-form-item>
        <el-form-item prop="discountGreat" label="优惠幅度" class="form_range">
          <el-input v-model="formData.discountGreat" clearable></el-input>
          <div class="range_link">-</div>
          <el-input v-model="formData.discountLess" clearable></el-input>
        </el-form-item>
        <el-form-item prop="startTimes" label="开始时间">
          <!-- <el-date-picker
            v-model="formData.startTimes"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            type="daterange"
            unlink-panels
            style="width: 200px"
            class="form_right"
          /> -->
          <el-date-picker
            v-model="formData.startTimes"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="-"
          />
        </el-form-item>
        <el-form-item prop="endTimes" label="结束时间">
          <!-- <el-date-picker
            v-model="formData.endTimes"
            value-format="YYYY-MM-DD"
            :shortcuts="shortcuts"
            type="daterange"
            unlink-panels
            style="width: 200px"
            class="form_right"
          /> -->
          <el-date-picker
            v-model="formData.endTimes"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="-"
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="onSubmit('')"
            >查询</el-button
          >
          <el-button @click="resetForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <vxe-table
        ref="tableDataRef"
        :data="tableData"
        :scroll-y="{ gt: 10 }"
        :show-overflow="true"
        :height="height"
        :edit-config="{
          trigger: 'click',
          mode: 'cell'
        }"
        border
        @sort-change="sortChange"
      >
        <vxe-column title="活动状态" width="100">
          <template #default="{ row }">
            <span>{{ statusObj[row.actStatus] }}</span></template
          >
        </vxe-column>
        <vxe-column field="disName" title="单品折扣名称"> </vxe-column>
        <vxe-column field="storeAcctName" title="店铺"> </vxe-column>
        <vxe-column field="startTime" title="开始时间" sortable="startTime">
          <template #default="{ row }">
            {{
              row.startTime
                ? parseTime(row.startTime, '{y}-{m}-{d} {h}:{i}:{s}')
                : ''
            }}</template
          >
        </vxe-column>
        <vxe-column field="endTime" title="结束时间" sortable="endTime">
          <template #default="{ row }">
            {{
              row.endTime
                ? parseTime(row.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
                : ''
            }}</template
          >
        </vxe-column>
        <vxe-column field="disNum" title="listing数" sortable="custom">
        </vxe-column>
        <vxe-column
          field="rate"
          title="优惠幅度"
          sortable="custom"
          :edit-render="{ name: 'input' }"
          :slots="{ edit: 'edit' }"
          ><template #edit="{ row }">
            <el-input
              v-model="row.rate"
              @focus="getRate(row)"
              @blur="handleRate(row)"
            ></el-input>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="limit"
          background
          :page-sizes="[1000, 2000, 5000, 10000]"
          layout="prev, pager, next, sizes, total"
          :total="total"
          :small="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>
<script setup name="customeraliexpresssingleItemDiscountMapping">
  import { ref, reactive, onMounted } from 'vue';
  import { getStoreList } from '@/api/common';
  import { parseTime, comGetTableHeight } from '@/utils/common';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { shortcuts } from '@/api/common';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  // import { ElMessage, ElMessageBox } from 'element-plus';
  import { ElMessage } from 'element-plus';
  import {
    getAliexpressPromotionsListStatus,
    getSmtDiscountActivityRateList,
    updateSmtDiscountActivityRate
  } from '@/api/smt/singleItemDiscountMapping';

  const initFormData = reactive({
    // 初始化查询条件
  });
  const formData = ref({
    page: 1,
    limit: 1000,
    //店铺Id，必选
    storeIdList: [],
    actStatus: ['Ongoing'],
    discountType: 0
  });

  const searchCard = ref();
  const height = ref();
  let statusData = [],
    statusObj = {};
  onMounted(async () => {
    // 获取table高度
    height.value = comGetTableHeight(searchCard, true, false);
    Promise.all([
      getStoreList('aliexpress'),
      getAliexpressPromotionsListStatus()
    ])
      .then((res) => {
        // 店铺
        initFormData.storeData = res[0].data?.children;
        // 活动状态
        for (let key in res[1].data) {
          statusData.push({
            value: res[1].data[key],
            label: key
          });
          statusObj[res[1].data[key]] = key;
        }
        initFormData.statusData = statusData;
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
    formData.value.discountLess = '';
  };

  // 表格编辑，备注
  const rate = ref('');
  const getRate = (row) => {
    rate.value = row.rate;
  };
  const handleRate = async (row) => {
    // if (!row.rate || row.rate == '') {
    //   ElMessage.warning('提交的数据为空，保存失败');
    //   row.rate = rate.value;
    //   return;
    // }
    if (row.rate && (row.rate * 1 <= 0 || row.rate * 1 >= 1)) {
      ElMessage.warning('请输入0-1的数据');
      row.rate = rate.value;
      return;
    }
    const { code, msg } = await updateSmtDiscountActivityRate([
      {
        id: row.id,
        discountValue: row.rate
      }
    ]);
    if (code == '0000') {
      ElMessage.success(msg);
    }
  };

  const tableData = ref(null);
  const tableDataLoading = ref(false);
  // 提交查询
  const onSubmit = async (sortType) => {
    tableData.value = null;
    formData.value.page = currentPage.value;
    formData.value.limit = limit.value;
    tableDataLoading.value = true;
    formData.value.sortType = sortType;
    let startLessTime, startGreatTime, endLessTime, endGreatTime;
    if (formData.value.startTimes && formData.value.startTimes.length != 0) {
      startGreatTime = new Date(formData.value.startTimes[0]).getTime();
      startLessTime = new Date(formData.value.startTimes[1]).getTime();
    }
    if (formData.value.endTimes && formData.value.endTimes.length != 0) {
      endGreatTime = new Date(formData.value.endTimes[0]).getTime();
      endLessTime = new Date(formData.value.endTimes[1]).getTime();
    }
    const { data, code, count } = await getSmtDiscountActivityRateList({
      startLessTime,
      startGreatTime,
      endLessTime,
      endGreatTime,
      ...formData.value,
      actStatus: formData.value.actStatus.join()
    });
    tableDataLoading.value = false;
    if (code == '0000') {
      data.forEach((item) => {
        item.rate == -1 ? (item.rate = '') : '';
      });
      tableData.value = data;
    }
    total.value = count;
  };

  let tableDataRef = ref(null);

  // 分页
  const currentPage = ref(1);
  const limit = ref(1000);
  const total = ref(0);
  const handleSizeChange = (val) => {
    limit.value = val;
    onSubmit('');
  };
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    onSubmit('');
  };
  const sortChange = (e) => {
    //     sortType
    // 0 -->单品折扣listing数 升序
    // 1 -->单品折扣listing数降序
    // 2 -->优惠幅度升序
    // 3 -->优惠幅度降序
    let sortType;
    if (e.order == 'asc' && e.field == 'disNum') {
      sortType = 0;
    } else if (e.order == 'desc' && e.field == 'disNum') {
      sortType = 1;
    } else if (e.order == 'asc' && e.field == 'rate') {
      sortType = 2;
    } else if (e.order == 'desc' && e.field == 'rate') {
      sortType = 3;
    } else if (e.order == 'asc' && e.field == 'startTime') {
      sortType = 4;
    } else if (e.order == 'desc' && e.field == 'startTime') {
      sortType = 5;
    } else if (e.order == 'asc' && e.field == 'endTime') {
      sortType = 6;
    } else if (e.order == 'desc' && e.field == 'endTime') {
      sortType = 7;
    }
    onSubmit(sortType);
  };
</script>

<style scoped lang="scss"></style>
