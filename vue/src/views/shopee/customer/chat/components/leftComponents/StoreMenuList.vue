<template>
  <div v-move="200" v-loading="initLoading" class="search-store-content">
    <header class="header">Shopee Chat</header>
    <el-form ref="formRef" :model="form" class="search-part-content" inline>
      <el-form-item prop="customer" label="客服">
        <MultiSelect
          v-model="form.customer"
          placeholder="客服"
          size="small"
          class="w150"
          allow-create
          :filter-method="dataFilterCustomer"
          :option-obj="{
            optionList: customerFilterList,
            label: 'user_name',
            value: 'id'
          }"
        />
      </el-form-item>
      <el-form-item prop="salespersonIds" label="销售">
        <MultiSelect
          v-model="form.salespersonIds"
          placeholder="销售"
          size="small"
          allow-create
          :filter-method="dataFilterSalesPerson"
          class="w150"
          :option-obj="{
            optionList: salePersonFilterList,
            label: 'user_name',
            value: 'id'
          }"
        />
      </el-form-item>
      <el-form-item label="站点" prop="salesSite">
        <el-select
          v-model="form.salesSite"
          filterable
          placeholder="站点单选"
          size="small"
          class="w150"
          clearable
        >
          <el-option
            v-for="item in siteList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺" prop="storeAcctIdList">
        <ZSelect
          v-model="form.storeAcctIdList"
          class="w150"
          :items="storeFilterList"
        />
      </el-form-item>
      <el-form-item prop="keyword">
        <el-select
          v-model="form.keywordQueryType"
          filterable
          size="small"
          class="form_left"
        >
          <el-option
            v-for="item in keywordTypeList"
            :key="item.typeCode"
            :label="item.description"
            :value="item.typeCode"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="form.keyword"
          class="form_right"
          clearable
          style="width: 210px"
          placeholder="可输入买家名称/消息内容/订单号"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="mt10"
          type="danger"
          size="small"
          :loading="searchLoading"
          @click="handleSearch(formRef)"
          >查询</el-button
        >
        <el-button
          class="mt10"
          type="danger"
          plain
          size="small"
          @click="handleReset(formRef)"
          >清空</el-button
        >
      </el-form-item>
    </el-form>
    <div class="p10">
      <div class="status_part">
        <div
          v-for="(item, index) in statusList"
          :key="item.status"
          :class="[
            'status_part_info',
            item.checked ? 'status_part_checked' : ''
          ]"
          @click="handleChooseStatus(index)"
        >
          <div>{{ item.label }}</div>
          <div
            v-if="item.count >= 0"
            :class="
              item.status === 'PENDING_OFFER' &&
              item.count &&
              'status_info_offering'
            "
          >
            {{ item.count }}
          </div>
        </div>
      </div>
      <div v-if="visibleUser">
        <span class="check_all_icon" @click="handleBeginCheck">
          <svg
            t="1685604748829"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2051"
            width="30"
            height="30"
          >
            <path
              d="M450.56 207.36a23.04 23.04 0 1 1 0-46.08h506.88a23.04 23.04 0 0 1 0 46.08H450.56z m0 325.12a23.04 23.04 0 0 1 0-46.08h506.88a23.04 23.04 0 0 1 0 46.08H450.56z m0 332.8a23.04 23.04 0 0 1 0-46.08h506.88a23.04 23.04 0 0 1 0 46.08H450.56zM138.51136 223.6928l137.3184-132.736a23.04 23.04 0 1 1 32.0256 33.1264l-153.6 148.48a23.04 23.04 0 0 1-32.3072-0.27136l-71.68-71.68a23.04 23.04 0 1 1 32.58368-32.58368L138.51136 223.6928zM82.85184 495.70816l55.65952 55.66464 137.3184-132.736a23.04 23.04 0 1 1 32.0256 33.1264l-153.6 148.48a23.04 23.04 0 0 1-32.3072-0.27136l-71.68-71.68a23.04 23.04 0 0 1 32.58368-32.58368z m0 332.8l55.65952 55.66464 137.3184-132.736a23.04 23.04 0 0 1 32.0256 33.1264l-153.6 148.48a23.04 23.04 0 0 1-32.3072-0.27136l-71.68-71.68a23.04 23.04 0 0 1 32.58368-32.58368z"
              :fill="isCheckedStatus ? '#d9001b' : '#909399'"
              p-id="2052"
            ></path>
          </svg>
        </span>
        <el-button
          type="danger"
          size="small"
          class="ml10"
          :disabled="!isCheckedStatus"
          @click="handleBatchChangeStatus('UNREAD')"
          >标记未读</el-button
        >
        <el-button
          type="danger"
          size="small"
          :disabled="!isCheckedStatus"
          @click="handleBatchChangeStatus('UN_HANDLED')"
          >标记未处理</el-button
        >
        <el-button
          type="danger"
          size="small"
          :disabled="!isCheckedStatus"
          @click="handleBatchChangeStatus('READ')"
          >标为已读</el-button
        >
        <el-button
          type="danger"
          size="small"
          :disabled="!isCheckedStatus"
          @click="handleBatchChangeStatus('HANDLED')"
          >标为已处理</el-button
        >
      </div>
    </div>
    <div ref="userCardRef" v-loading="searchLoading" class="search_content">
      <div v-if="visibleUser && isCheckedStatus" class="check_all">
        <div class="check_all_btn" @click="handleCheckAll()">
          <el-icon v-if="checkAll" :size="15" :color="chatPrimary"
            ><Check
          /></el-icon>
        </div>
        <span
          >已选择<span class="check_all_count">{{ checkedCount }}</span
          >个用户</span
        >
      </div>
      <UserCard
        v-if="visibleUser"
        class="card_info"
        :search-loading="searchLoading"
        :total="total"
        :user-list="userList"
        :conversation-status-list="conversationStatusList"
        :store-acct-id-list="storeAcctIdList"
      />
      <SearchCard
        v-else
        ref="searchCardRef"
        class="card_info"
        :search-list="searchList"
        :store-acct-id-list="storeAcctIdList"
        :conversation-status-list="conversationStatusList"
        :total="searchTotal"
      >
        <div v-if="visible" class="info_list_footer">---- 已经到底啦 ----</div>
        <el-button
          v-else
          class="view-more"
          text
          size="small"
          @click="handleViewMore"
          >加载更多</el-button
        >
      </SearchCard>
      <el-empty v-if="!len" description="暂无数据"></el-empty>
    </div>
  </div>
</template>

<script setup>
  import {
    getStoresApi,
    getSiteListApi,
    batchDealWithConversationStatusApi,
    getKeywordTypeApi
  } from '@/api/shopee/chat';
  import { getCustomers } from '@/api/common';
  import { ref, computed, onMounted, watch, onActivated, nextTick } from 'vue';
  import useShopeeChatStore from '@/store/modules/shopeeChat';
  import { storeToRefs } from 'pinia';
  import SearchCard from './SearchCard.vue';
  import UserCard from './UserCard.vue';
  import MultiSelect from '@/components/MultiSelect/index.vue';
  import { debounce, isEmpty } from 'lodash-es';
  import { ElMessage } from 'element-plus';
  import { chatPrimary } from '@/styles/vars.module.scss';
  import { getItem, removeItem } from '@/utils/storage';
  import ZSelect from '@/components/ZSelect/index.vue';

  const shopeeChatStore = useShopeeChatStore();
  const {
    handleBeginCheck,
    getUserList,
    changeUserList,
    handleCheckAll,
    changeUserListStatus,
    chooseStatus,
    reset
  } = shopeeChatStore;
  const {
    userList,
    isCheckedStatus,
    cacheSearchList,
    searchList,
    total,
    checkAll,
    visibleUser,
    searchLoading,
    statusList
  } = storeToRefs(shopeeChatStore);
  const checkedCount = computed(
    () => userList.value.filter((item) => item.checked).length
  );

  // #region 初始化
  const initLoading = ref(false);
  const formRef = ref();
  const form = ref({
    customer: [],
    salespersonIds: [], // shopee客服专员选中的值
    storeAcctIdList: [], // 店铺多选选中的值
    salesSite: '', // 站点选中的值,
    keywordQueryType: 2,
    keyword: ''
  });
  let customerList = [];
  const customerFilterList = ref([]);
  let salePersonList = [];
  const salePersonFilterList = ref([]);
  const siteList = ref([]);
  const keywordTypeList = ref([]);
  onMounted(async () => {
    initLoading.value = true;
    Promise.all([
      getCustomers({ roleNames: 'shopee客服' }),
      getCustomers({ roleNames: 'shopee专员' }),
      getSiteListApi(),
      getKeywordTypeApi()
    ])
      .then((res) => {
        customerList = res[0]?.data?.userList || [];
        customerFilterList.value = res[0]?.data?.userList || [];
        salePersonList = res[1]?.data?.userList || [];
        salePersonFilterList.value = res[1]?.data?.userList || [];
        siteList.value = res[2]?.data?.siteList || [];
        keywordTypeList.value = res[3].data;
      })
      .finally(() => {
        initLoading.value = false;
      });

    // 获取shopee店铺列表
    fetchStore({});
    let detail = getItem('shopeecustomerchat');
    setTimeout(() => {
      if (isEmpty(detail)) {
        handleSearch();
      }
    }, 1000);
  });
  // 获取店铺
  const storeList = ref([]);
  const storeFilterList = ref([]);
  const storeLoading = ref(false);
  const fetchStore = async (params) => {
    storeLoading.value = true;
    try {
      const { data } = await getStoresApi(params);
      const _data = (data || []).map((item) => ({
        ...item,
        label: item.storeAcct
      }));
      storeList.value = _data;
      storeFilterList.value = _data.map((v) => ({ ...v, name: v.storeAcct }));
    } catch (err) {
      console.log('err :>> ', err);
    }
    storeLoading.value = false;
  };
  const dataFilterCustomer = debounce((val) => {
    if (val) {
      let valArr = val.replaceAll('，', ',').split(',');
      customerFilterList.value = customerList.filter((item) =>
        valArr.some((elem) => item.user_name.indexOf(elem) > -1)
      );
    } else {
      customerFilterList.value = customerList;
    }
  }, 1000);
  const dataFilterSalesPerson = debounce((val) => {
    if (val) {
      let valArr = val.replaceAll('，', ',').split(',');
      salePersonFilterList.value = salePersonList.filter((item) =>
        valArr.some((elem) => item.user_name.indexOf(elem) > -1)
      );
    } else {
      salePersonFilterList.value = salePersonList;
    }
  }, 1000);
  // const dataFilterStore = debounce((val) => {
  //   if (val) {
  //     let valArr = val.replaceAll('，', ',').split(',');
  //     storeFilterList.value = storeList.value.filter((item) =>
  //       valArr.some((elem) => item.storeAcct.indexOf(elem) > -1)
  //     );
  //     console.log(
  //       'storeFilterList.value.length :>> ',
  //       storeFilterList.value.length
  //     );
  //     console.log('object :>> ', storeFilterList.value);
  //   } else {
  //     storeFilterList.value = storeList.value;
  //   }
  // }, 1000);
  // const getAllStore = () => {
  //   storeFilterList.value = storeList.value;
  // };
  //  销售/客服联动查询当前用户权限店铺
  let storeCustomerList = [];
  let storesalesPersonList = [];
  let salesSite = null;
  watch(
    () => form.value.customer,
    (val) => {
      storeCustomerList = [];
      if (val) {
        val.forEach((item) => {
          if (typeof item === 'number') {
            const curList = customerList
              .filter((elem) => elem.id === item)
              .map((elem) => ({ id: elem.id, username: elem['user_name'] }));
            storeCustomerList = storeCustomerList.concat(curList);
          } else {
            storeCustomerList.push({ id: null, username: item });
          }
        });
      }
      fetchStore({
        customers: storeCustomerList,
        salespersons: storesalesPersonList,
        salesSite
      });
    }
  );
  watch(
    () => form.value.salespersonIds,
    (val) => {
      storesalesPersonList = [];
      if (val) {
        val.forEach((item) => {
          if (typeof item === 'number') {
            const curList = salePersonList
              .filter((elem) => elem.id === item)
              .map((elem) => ({ id: elem.id, username: elem['user_name'] }));
            storesalesPersonList = storesalesPersonList.concat(curList);
          } else {
            storesalesPersonList.push({ id: null, username: item });
          }
        });
      }
      fetchStore({
        customers: storeCustomerList,
        salespersons: storesalesPersonList,
        salesSite
      });
    }
  );
  watch(
    () => form.value.salesSite,
    (val) => {
      salesSite = val;
      fetchStore({
        customers: storeCustomerList,
        salespersons: storesalesPersonList,
        salesSite
      });
    }
  );
  // #endregion 初始化

  // #region 表单
  onActivated(() => {
    let detail = getItem('shopeecustomerchat');
    nextTick(() => {
      setTimeout(async () => {
        if (!isEmpty(detail)) {
          formRef.value.resetFields();
          form.value.storeAcctIdList = [].concat(detail.storeAcctId);
          form.value.keywordQueryType = 3;
          form.value.keyword = detail.orderId;
          await handleSearch();
          await removeItem('shopeecustomerchat');
        }
      }, 1000);
    });
  });
  const handleChooseStatus = (index) => {
    chooseStatus(index);
    handleSearch();
  };

  const handleReset = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };

  const userCardRef = ref(null);
  const searchCardRef = ref(null);

  let conversationStatusList = [];
  let storeAcctIdList = [];
  const handleSearch = async () => {
    // 获取聊天列表
    await reset();
    // 如果含有keyword，需要把状态标签置灰
    const keyword = form.value.keyword;
    if (keyword) {
      statusList.value.forEach((v) => {
        v.checked = false;
      });
    }
    conversationStatusList = statusList.value
      .filter((item) => item.checked)
      .map((item) => item.status);
    storeAcctIdList = form.value.storeAcctIdList;
    if (!form.value.storeAcctIdList.length) {
      storeAcctIdList = storeFilterList.value.map((item) => item.id);
    }
    if (500 > storeAcctIdList.length > 100) {
      ElMessage.warning('查询店铺数量过多, 需要等待较长时间, 请耐心等待');
    }
    if (storeAcctIdList.length > 500) {
      return ElMessage.warning('查询店铺数量过多, 请重新选择店铺');
    }
    if (keyword && storeAcctIdList.length > 1) {
      return ElMessage.warning('关键词查询必须选中且最多选中一个店铺');
    }
    try {
      getUserList({
        storeAcctIdList,
        conversationStatusList,
        keyword,
        keywordQueryType: form.value.keywordQueryType,
        page: 1
      });
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // #endregion 表单

  const handleBatchChangeStatus = async (conversationStatus) => {
    const arr = userList.value
      .filter((item) => item.checked)
      .map((item) => ({
        storeAcctId: item.storeAcctId,
        conversationId: item.conversationId
      }));
    if (!arr.length) return ElMessage.warning('请选择要处理的数据');

    try {
      await batchDealWithConversationStatusApi({
        conversationStatus,
        arr
      });
      ElMessage.success('操作成功');
      changeUserListStatus({
        conversationStatus,
        conversationIdList: arr.map((item) => item.conversationId),
        conversationStatusList
      });
    } catch (err) {
      console.log('err :>> ', err);
    }
  };

  watch(
    () => isCheckedStatus.value,
    (val) => {
      if (visibleUser.value === true) {
        changeUserList({ isCheckedStatus: val });
      }
    }
  );
  const len = computed(() => {
    return (
      (visibleUser.value && userList.value.length) ||
      (!visibleUser.value && searchList.value.flat(Infinity).length)
    );
  });

  const visible = computed(() => {
    return (
      searchList.value.flat(Infinity).length ===
      cacheSearchList.value.flat(Infinity).length
    );
  });
  const handleViewMore = () => {
    searchList.value = cacheSearchList.value;
  };
  const searchTotal = computed(
    () => cacheSearchList.value.flat(Infinity).length
  );
</script>

<style lang="scss" scoped>
  .header {
    height: 80px;
    background-color: var(--chat-primary);
    color: #fff;
    font-size: 20px;
    text-align: center;
    line-height: 80px;
  }
  .search-store-content {
    width: 430px;
    border-right: 1px solid #ddd;
  }
  .search-part-content {
    padding: 0 0 0 10px;
    text-align: center;
    .form_left {
      :deep(.el-input) {
        width: 80px !important;
      }
      :deep(.el-input__wrapper) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        box-shadow: 1px 0 0 0 var(--el-input-border-color) inset,
          0 1px 0 0 var(--el-input-border-color) inset,
          0 -1px 0 0 var(--el-input-border-color) inset;
      }
    }
    .form_right {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      :deep(.el-input__wrapper) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
  .w150 {
    width: 150px;
  }
  .w180 {
    width: 180px;
  }
  :deep(.el-button--danger) {
    background: var(--chat-primary);
    border-color: var(--chat-primary);
  }
  :deep(.el-button--danger.is-plain) {
    color: var(--chat-primary);
    background: #fff;
    border-color: var(--chat-primary);
  }
  :deep(.el-button:focus) {
    color: #fff;
    border-color: #f89898;
    background: #f89898;
  }
  :deep(.el-button:hover) {
    color: #fff;
    border-color: #f89898;
    background: #f89898;
  }
  :deep(.el-button:active) {
    color: #fff;
    border-color: #c45656;
    background: #c45656;
  }
  :deep(.el-button--danger.is-disabled) {
    border-color: #f89898;
    background: #f89898;
  }

  .p10 {
    padding: 10px;
  }
  .status_part {
    display: inline-flex;
    vertical-align: middle;
  }
  .status_part_info {
    min-height: 35px;
    padding: 5px;
    margin-right: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #909399;
    color: #909399;
    border-radius: 5px;
  }
  .status_part_checked {
    color: var(--chat-primary);
    border: 1px solid var(--chat-primary);
  }
  .status_info_offering {
    color: var(--chat-primary);
  }
  .search_content {
    padding: 10px;
    overflow: hidden;
  }
  .check_all_icon {
    display: inline-flex;
    vertical-align: middle;
    margin-right: 10px;
  }
  .check_all {
    display: flex;
    &_btn {
      height: 15px;
      width: 15px;
      border: 1px solid var(--chat-primary);
      margin-right: 10px;
    }
    &_count {
      color: var(--chat-primary);
    }
  }

  .card_info {
    position: relative;
    height: calc(100vh - 400px);
    padding: 0 10px;
    overflow-y: auto;
  }
  .store-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      background-color: #fbe6e8;
    }
    &--active {
      color: var(--chat-primary);
    }
  }

  .info_list_footer {
    text-align: center;
    padding: 20px 0 30px 0;
    color: #999;
  }
  .no-content {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, 50%);
    color: #999;
  }
  .mr10 {
    margin-right: 10px;
  }
</style>
