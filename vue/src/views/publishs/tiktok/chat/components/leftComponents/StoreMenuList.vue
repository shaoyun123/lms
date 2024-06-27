<template>
  <div v-move="200" v-loading="initLoading" class="search-store-content">
    <header class="header">TikTok Chat</header>
    <el-form ref="formRef" :model="form" class="search-part-content" inline>
      <div class="search_form_flex">
        <div class="search_form_select">
          <el-form-item prop="salesSite" style="flex: 1">
            <el-select
              v-model="form.salesSite"
              style="width: 100%"
              filterable
              placeholder="站点"
              size="small"
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
          <el-form-item prop="customer" style="flex: 1">
            <ZSelect
              v-model="form.customer"
              style="width: 100%"
              :default-text="serviceDefaultText"
              :items="customerFilterList"
              :num="1"
            />
          </el-form-item>

          <CascadeFilter
            v-model="form.storeAcctIdList"
            class="form-store"
            :store-option-list="storeOptionList"
            :is-show-label="isShowLabel"
            :cascade-default-text="cascadeDefaultText"
            form-item-prop="storeAcctIdList"
          />
        </div>
        <div class="search_form_input">
          <el-form-item prop="keyword" style="display: flex; flex: 1">
            <el-select
              v-model="form.keywordQueryType"
              filterable
              size="small"
              style="width: 32%"
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
              clearable
              style="flex: 1"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              class="mt10"
              type="danger"
              size="small"
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
        </div>
      </div>
    </el-form>
    <div v-loading="searchLoading">
      <div class="p10 pb0">
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
            <div style="text-align: center">{{ item.label }}</div>
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
      <div ref="userCardRef" class="search_content">
        <div v-if="visibleUser && isCheckedStatus" class="check_all">
          <div class="check_all_btn" @click="handleCheckAll()">
            <el-icon v-if="checkAll" :size="15" :color="chatPrimary"
              ><Check
            /></el-icon>
          </div>
          <span
            >已选择<span class="check_all_count">{{ checkedCount }}</span
            >条消息</span
          >
        </div>
        <UserCard
          v-if="visibleUser"
          class="card_info"
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
          <div v-if="visible" class="info_list_footer">
            ---- 已经到底啦 ----
          </div>
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
  </div>
</template>

<script setup>
  import { getSiteListApi } from '@/api/common';
  import {
    batchUpdateConversationStatusApi,
    getStoresTreeApi,
    getKeywordTypeApi
  } from '@/api/tiktok/chat';
  import { querySalersData } from '@/api/publishs/temustoremanage'; // 获取客服枚举接口
  import { ref, computed, onMounted, watch, onActivated, nextTick } from 'vue';
  import useTikTokChatStore from '@/store/modules/tiktokChat';
  import { storeToRefs } from 'pinia';
  import SearchCard from './SearchCard.vue';
  import UserCard from './UserCard.vue';
  import { isEmpty } from 'lodash-es';
  import { ElMessage } from 'element-plus';
  import { chatPrimary } from '@/styles/vars.module.scss';
  import { getItem, removeItem } from '@/utils/storage';
  import ZSelect from '@/components/ZSelect/index.vue';
  import CascadeFilter from './CascadeFilter.vue';
  const tikTokChatStore = useTikTokChatStore();

  const {
    handleBeginCheck,
    getUserList,
    changeUserList,
    handleCheckAll,
    changeUserListStatus,
    chooseStatus,
    reset
  } = tikTokChatStore;
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
  } = storeToRefs(tikTokChatStore);
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
    salesSite: '', // 站点选中的值
    keyword: '',
    keywordQueryType: 1 // 默认为消息内容
  });

  const serviceDefaultText = '客服';
  const cascadeDefaultText = '店铺多选';
  const isShowLabel = false;

  let customerList = [];
  const customerFilterList = ref([]);

  onMounted(async () => {
    await getServicerData();
    await getSiteOption();
    await getKeywordType();
    await getStoreTreeOption(true);
    await handleSearch();
  });

  // 递归获取级联列表最后一级的所有value值
  const getAllLeafValues = (options) => {
    let leafValues = [];
    const traverse = (options) => {
      options.forEach((item) => {
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        } else {
          leafValues.push(item.value);
        }
      });
    };
    traverse(options);
    return leafValues;
  };

  // 客服搜索框枚举
  const getServicerData = async () => {
    initLoading.value = true;
    try {
      const { data } = await querySalersData({ role: 'tiktok客服' }).finally(
        () => {
          initLoading.value = false;
        }
      );
      customerList.value = data;
      customerFilterList.value = data.map((v) => ({
        id: v.id,
        name: v.userName
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // 搜索栏关键字枚举
  const keywordTypeList = ref([]);
  const getKeywordType = async () => {
    const { data } = await getKeywordTypeApi();
    keywordTypeList.value = data;
  };

  // 站点枚举
  const siteList = ref([]);
  const getSiteOption = async () => {
    initLoading.value = true;
    const { data } = await getSiteListApi('tiktok').finally(() => {
      initLoading.value = false;
    });
    siteList.value = data.filter((item) => {
      return item.code !== 'GLOBAL';
    });
  };

  // 获取店铺接口
  const storeOptionList = ref([]);
  const storeAllOption = ref([]);
  const getStoreTreeOption = async (isMounted) => {
    const { data } = await getStoresTreeApi({
      platCode: 'tiktok',
      salespersonIdList: [],
      salesSiteList: form.value.salesSite ? [form.value.salesSite] : [],
      customerIdList: form.value.customer
    });
    // 初始啥都没选默认传全部
    if (isMounted) {
      storeAllOption.value = data.children;
      getAllLeafValues(storeAllOption.value);
    }
    storeOptionList.value = data.children;
  };

  //  销售/客服联动查询当前用户权限店铺
  watch(
    () => form.value.customer,
    (val) => {
      // 如果选中了客服 未选中店铺 取交集; 如果要切换选中的客服 但是店铺存在有选中 将所选店铺先清空
      if (val.length && !form.value.storeAcctIdList.length) {
        getStoreTreeOption(false);
      } else {
        form.value.storeAcctIdList = [];
      }
    }
  );
  watch(
    () => form.value.salesSite,
    (val) => {
      if (val) {
        getStoreTreeOption(false);
      }
    }
  );

  // 当站点和客服都不选 默认展示全部
  watch(
    () => !form.value.salesSite.length && !form.value.salesSite,
    () => {
      storeOptionList.value = storeAllOption.value;
    }
  );
  // #endregion 初始化

  // #region 表单
  onActivated(() => {
    let detail = getItem('publishstiktokchat');
    if (!isEmpty(detail)) {
      formRef.value.resetFields();
    }
    nextTick(() => {
      setTimeout(async () => {
        if (!isEmpty(detail)) {
          form.value.keywordQueryType = 3;
          form.value.keyword = detail.orderId;
          form.value.storeAcctIdList = [].concat(detail.storeAcctId);
          await handleSearch();
          await removeItem('publishstiktokchat');
        }
      }, 1000);
    });
  });
  const handleChooseStatus = (index) => {
    // 如果是在搜索关键字 则会话状态列表传空
    if (form.value.keywordQueryType && form.value.keyword) {
      statusList.value = statusList.value.map((item) => {
        item.checked = false;
        return item;
      });
      return false;
    }
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
    await reset();
    conversationStatusList = statusList.value
      .filter((item) => item.checked)
      .map((item) => item.status);

    // 如果是在搜索关键字 则会话状态列表传空
    if (form.value.keywordQueryType && form.value.keyword) {
      conversationStatusList = [];
      statusList.value = statusList.value.map((item) => {
        item.checked = false;
        return item;
      });
    }

    // 获取选中的店铺列表（店铺为空 则默认查询所有）
    storeAcctIdList = form.value.storeAcctIdList;
    console.log('storeAcctIdList :>> ', storeAcctIdList);
    if (!form.value.storeAcctIdList.length) {
      storeAcctIdList = getAllLeafValues(storeAllOption.value);
    }
    if (500 > storeAcctIdList.length > 100) {
      ElMessage.warning('查询店铺数量过多, 需要等待较长时间, 请耐心等待');
    }
    if (storeAcctIdList.length > 500) {
      return ElMessage.warning('查询店铺数量过多, 请重新选择店铺');
    }
    const keyword = form.value.keyword;
    if (keyword && storeAcctIdList.length > 1) {
      return ElMessage.warning('关键词查询必须选中且最多选中一个店铺');
    }
    try {
      getUserList({
        storeAcctIdList,
        conversationStatusList,
        keywordQueryType: form.value.keywordQueryType,
        keyword,
        page: 1
      });
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  // #endregion 表单

  // 批量改变会话状态
  const handleBatchChangeStatus = async (conversationStatus) => {
    const arr = userList.value
      .filter((item) => item.checked)
      .map((item) => ({
        storeAcctId: item.storeAcctId,
        convShortId: item.convShortId
      }));
    if (!arr.length) return ElMessage.warning('请选择要处理的数据');

    try {
      await batchUpdateConversationStatusApi({
        conversationList: arr,
        conversationStatusEnum: conversationStatus
      });
      ElMessage.success('操作成功');
      changeUserListStatus({
        conversationStatus,
        conversationIdList: arr.map((item) => item.convShortId),
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
    min-width: 290px;
    border-right: 1px solid #ddd;
  }
  .search-part-content {
    padding: 0 10px;
    text-align: center;
  }
  .w150 {
    width: 150px;
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
  .pb0 {
    padding-bottom: 0;
  }
  .status_part {
    display: inline-flex;
    vertical-align: middle;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .status_part_info {
    min-height: 35px;
    padding: 5px;
    margin-right: 10px;
    margin-bottom: 15px;
    flex: 1;
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
    padding-bottom: 10px;
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
  .search_form_flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .search_form_select {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .search_form_input {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-store {
    flex: 1;
    :deep(.el-cascader--small) {
      width: 100%;
    }
    :deep(.el-input) {
      width: 100%;
    }
  }
</style>
