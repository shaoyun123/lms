<template>
  <div class="app-container">
    <el-card class="search_card">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :label-width="80"
        class="search_form"
      >
        <el-form-item prop="storeAcctIdList" label="店铺">
          <!-- <el-select-v2
            v-model="formData.storeAcctIdList"
            placeholder="请选择"
            :options="init.storeData"
            style="width: 240px"
            multiple
            collapse-tags
            clearable
            filterable
            remote
            :remote-method="handleStoreAcct"
            @visible-change="changeStoreAcct"
          >
          </el-select-v2> -->
          <z-cascader
            v-model="formData.storeAcctIdList"
            :data="init.storeData"
          ></z-cascader>
          <!-- <ZSelect
            v-model="formData.storeAcctIdList"
            style="width: 270px"
            :items="init.storeData"
            :num="1"
          /> -->
        </el-form-item>
        <el-form-item prop="saleSiteList" label="站点">
          <el-select
            v-model="formData.saleSiteList"
            multiple
            collapse-tags
            clearable
            filterable
          >
            <el-option value="SG" label="新加坡"></el-option>
            <el-option value="MY" label="马来西亚"></el-option>
            <el-option value="ID" label="印尼"></el-option>
            <el-option value="TH" label="泰国"></el-option>
            <el-option value="PH" label="菲律宾"></el-option>
            <el-option value="VN" label="越南"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="campaignTypeList" label="活动类型">
          <el-select
            v-model="formData.campaignTypeList"
            multiple
            collapse-tags
            clearable
            filterable
          >
            <el-option
              v-for="item in init.campaignType"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="campaignTimes" label="报名截至时间">
          <el-date-picker
            v-model="formData.campaignTimes"
            value-format="YYYY-MM-DD"
            type="daterange"
            unlink-panels
            :shortcuts="shortcuts"
            class="form_right"
            clearable
          />
        </el-form-item>
        <el-form-item prop="campaignName" label="活动名称"
          ><el-input
            v-model="formData.campaignName"
            clearable
            placeholder="模糊查询"
          />
        </el-form-item>
        <el-form-item prop="dealStatusList" label="处理状态"
          ><el-checkbox-group v-model="formData.dealStatusList">
            <el-checkbox
              v-for="(checkBoxItem, checkboxIndex) in [
                '待处理',
                '处理中',
                '处理成功',
                '处理失败'
              ]"
              :key="checkboxIndex"
              :label="checkboxIndex"
              >{{ checkBoxItem }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button :loading="false" type="primary" @click="getSearchData"
            >查询</el-button
          ><el-button @click="resetQuery">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card_position list_card">
      <el-tabs v-model="activeKey" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.status"
          :label="
            item.count !== '' && activeKey == item.status
              ? `${item.name}(${item.count})`
              : item.name
          "
          :name="item.status"
        >
          <el-checkbox-group v-model="formData.ifSignUpList">
            <el-checkbox
              v-for="(checkBoxItem, checkboxIndex) in [
                '未报名活动',
                '已报名活动'
              ]"
              :key="checkboxIndex"
              :label="checkboxIndex"
              >{{ checkBoxItem }}</el-checkbox
            >
          </el-checkbox-group>
          <vxe-table
            ref="tableDataRef"
            v-loading="tableDataLoading"
            :data="tableData"
            :height="height"
            :checkbox-config="{
              checkMethod: showCheckboxkMethod,
              visibleMethod: showCheckboxkMethod
            }"
            :edit-config="{
              trigger: 'click',
              mode: 'cell'
            }"
            :align="'left'"
            border
          >
            <!-- labelField: 'name', -->
            <vxe-column type="checkbox" width="40" />
            <vxe-column title="处理状态" width="100" field="dealStatus">
              <template #default="{ row }">
                {{
                  ['待处理', '处理中', '处理成功', '处理失败'][row.dealStatus]
                }}
              </template>
            </vxe-column>
            <vxe-column title="活动类型" field="campaignType" />
            <vxe-column title="活动名称/活动时间">
              <template #default="{ row }">
                {{ row.campaignName }} <br />
                {{ row.liveStart }}-{{ row.liveEnd }}
              </template>
            </vxe-column>
            <vxe-column title="报名截至时间" width="150">
              <template #default="{ row }">
                {{ row.campaignEnds }} <br />

                <span
                  v-if="
                    new Date(row.campaignEnds).getTime() < new Date().getTime()
                  "
                  style="color: red"
                  >报名已截止</span
                >
              </template>
            </vxe-column>
            <vxe-column title="店铺" field="storeAcct" width="120"></vxe-column>
            <vxe-column
              title="销售员"
              field="salesperson"
              width="90"
            ></vxe-column>
            <vxe-column
              title="折扣值"
              field="discount"
              width="100"
              :edit-render="{ name: 'input' }"
              :slots="{ edit: 'edit' }"
              ><template #edit="{ row }">
                <el-input
                  v-model="row.discount"
                  @focus="getDiscount(row)"
                  @blur="handleDiscount(row)"
                ></el-input> </template
            ></vxe-column>
            <vxe-column title="操作结果" field="error" />
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
        </el-tab-pane>
      </el-tabs>
      <div class="tools_btn" style="display: flex">
        <el-button type="primary" @click="handleDiscount('batch')"
          >设置折扣</el-button
        >
        <el-button
          v-permission="['lazadaactiveregisterbatchsubmit']"
          type="primary"
          @click="batchSubmit"
          >批量提交</el-button
        >
      </div>
    </el-card>
    <el-dialog
      v-model="showDiscount"
      title="批量设置折扣"
      width="30%"
      :close-on-click-modal="false"
      @close="closeDiscount"
    >
      <p>提示：</p>
      <p>折扣区间为(0,1)</p>
      <p>活动价格计算公式为：Campaign Price=Sales Price * (1 - 折扣值)</p>
      <el-form :inline="true" size="default" label-width="120px">
        <el-form-item label="折扣值">
          <el-input v-model="discount" />
        </el-form-item>
        <span v-if="discount * 1 > 0.5" style="color: red"
          >当前折扣值超过50%</span
        >
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" @click="batchSaveDiscount">确认</el-button>
          <el-button @click="closeDiscount">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="lazadaoperateactiveregister">
  import { ref, reactive, onMounted, computed } from 'vue';
  import { shortcuts } from '@/api/common';
  // import { parseTime } from '@/utils/common';
  import { ElMessage } from 'element-plus';
  // import { shortcuts } from '@/api/common';
  import {
    queryList,
    listCampaignType,
    modifyDiscount,
    commitCampaign
  } from '@/api/lazada/activeregister';
  // import useUserStore from '@/store/modules/user';
  // import { getStoreInfo } from '@/api/eBay/payments';
  // import ZSelect from '@/components/ZSelect/index.vue';
  import ZCascader from '@/components/ZCascader/index.vue';
  import { getStoreList } from '@/api/common';

  const init = reactive({
    storeData: [], // 店铺
    campaignType: [] // 活动类型
  });
  // 获取用户名
  // const { userInfo } = useUserStore();
  // let userName = computed(() => userInfo.userName);
  // 获取店铺信息
  const getStoreListFunc = async () => {
    // let params = {
    //   roleNames: 'lazada专员',
    //   platCode: 'lazada',
    //   lmsAppUserName: userName.value
    // };
    const { data } = await getStoreList('lazada');
    init.storeData = data?.children || [];
  };
  // 表格checkbox筛选
  const showCheckboxkMethod = ({ row }) => {
    return (
      row.dealStatus != 1 &&
      new Date(row.campaignEnds).getTime() > new Date().getTime()
    );
  };
  const currentPage = ref(1);
  const pageSize = ref(50);
  const total = ref(0);
  // 设置每页count
  const handleSizeChange = (val) => {
    pageSize.value = val;
    getSearchData();
  };
  // 上一页下一页
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    getSearchData();
  };
  // tab名称
  let tabList = ref([{ name: '大促营销活动', status: 0, count: 0 }]);
  const activeKey = ref(0);
  const formData = ref({
    storeAcctIdList: [], // 店铺
    saleSiteList: [], // 站点
    ifSignUpList: [],
    campaignTimes: [],
    dealStatusList: [0],
    campaignTypeList: [] // 活动类型
  });

  const tableData = ref([]);
  let tableDataRef = ref();
  const tableDataLoading = ref(false);
  // 查询条件表单ref
  const formRef = ref(null);
  // 清空查询
  const resetQuery = () => {
    formRef.value.resetFields();
    formData.value.campaignEndsLeft = '';
    formData.value.campaignEndsRight = '';
    formData.value.ifSignUp = null;
  };
  // 查询条件提交查询
  const getSearchData = async () => {
    formData.value.page = currentPage.value;
    formData.value.limit = pageSize.value;
    if (
      formData.value.campaignTimes &&
      formData.value.campaignTimes.length != 0
    ) {
      formData.value.campaignEndsLeft =
        formData.value.campaignTimes[0] + ' 00:00:00';
      formData.value.campaignEndsRight =
        formData.value.campaignTimes[1] + ' 23:59:59';
    }
    // 未报名活动/已报名活动
    if (formData.value.ifSignUpList.length == 2) {
      ElMessage.warning('未报名活动/已报名活动只能选其一');
      return false;
    } else if (formData.value.ifSignUpList.length == 1) {
      let type = [false, true];
      formData.value['ifSignUp'] = type[formData.value.ifSignUpList[0]];
    } else if (formData.value.ifSignUpList.length == 0) {
      formData.value['ifSignUp'] = null;
    }
    tableDataLoading.value = true;
    tableData.value = null;
    try {
      const { code, data, count } = await queryList(formData.value);
      if (code === '0000') {
        tableData.value = data || [];
        tabList.value[0].count = count;
        // tabList.value.forEach((item) => {
        //   item.count = 0;
        //   if (item.status == tableData.value[0]?.replOrderStatus) {
        //     item.count = count;
        //   }
        // });
        total.value = count;
      }
      tableDataLoading.value = false;
    } catch (err) {
      console.log(err);
      tableDataLoading.value = false;
    }
  };

  onMounted(async () => {
    getStoreListFunc();
    // 获取活动类型
    const { data } = await listCampaignType();
    init.campaignType = data;
  });

  // 设置折扣,单个&批量
  const showDiscount = ref(false);
  const discount = ref('');
  const getDiscount = (row) => {
    discount.value = row.discount;
  };
  const handleDiscount = async (row) => {
    if (row == 'batch') {
      // 批量，显示修改弹窗
      const checkedData = tableDataRef.value[0].getCheckboxRecords();
      if (checkedData.length == 0) {
        ElMessage.warning('请选择需要提交的数据');
        return;
      }
      showDiscount.value = true;
    } else {
      // 单个
      if (!row.discount || row.discount == '') {
        ElMessage.warning('提交的数据为空，保存失败');
        row.discount = discount.value;
        return;
      }
      discount.value = '';
      const { code, msg } = await modifyDiscount({
        ids: row.id,
        discount: row.discount
      });
      if (code == '0000') {
        ElMessage.success(msg);
      }
    }
  };
  // 批量修改调用的接口，同单个接口
  const batchSaveDiscount = async () => {
    if (discount.value == '') {
      return ElMessage.warning('请输入折扣值');
    }
    const checkedData = tableDataRef.value[0].getCheckboxRecords();
    let ids = checkedData.map((item) => item.id).join(',');
    const { code, msg } = await modifyDiscount({
      ids,
      discount: discount.value
    });
    if (code == '0000') {
      ElMessage.success(msg);
      closeDiscount();
      getSearchData();
    }
  };
  // 关闭弹窗
  const closeDiscount = () => {
    discount.value = '';
    showDiscount.value = false;
  };
  // 批量提交
  const batchSubmit = async () => {
    const checkedData = tableDataRef.value[0].getCheckboxRecords();
    if (checkedData.length == 0) {
      ElMessage.warning('请选择需要提交的数据');
      return;
    }
    if (!checkedData.every((item) => !!item.discount)) {
      ElMessage.warning('请检查折扣值是否已填写，并且不能为0');
      return;
    }
    let ids = checkedData.map((item) => item.id).join(',');
    const { code, msg } = await commitCampaign({
      ids
    });
    if (code == '0000') {
      ElMessage.success(msg);
      getSearchData();
    }
  };
  // 高度
  const height = computed(() => {
    const clientHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight ||
      937;
    return clientHeight - 250;
  });
</script>
<style scoped lang="scss">
  .card_position {
    position: relative;
    .tools_btn {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }

  .z-select {
    :deep(.el-input) {
      width: 270px;
    }
  }
</style>
