<template>
  <el-tabs
    v-model="activeName"
    v-loading="tabLoading"
    class="right_menu"
    @tab-click="handleTabChange"
  >
    <el-tab-pane label="订单" name="order">
      <el-row>
        <el-col :span="24" style="padding: 0 8px">
          <el-input
            v-model="orderSearchForm.content"
            placeholder="订单ID 支持多个订单号精准查询 使用,隔开"
            clearable
            @keyup.enter="productSearchInputFunc"
          >
            <template #prepend>
              <el-select
                v-model="orderSearchForm.type"
                placeholder="请选择"
                style="width: 100px"
              >
                <el-option label="全部" value="全部"></el-option>
                <el-option label="未支付" value="未支付"></el-option>
                <el-option label="待发货" value="待发货"></el-option>
                <el-option label="已发货" value="已发货"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
                <el-option label="已取消" value="已取消"></el-option>
              </el-select>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <div
        v-if="orderList.length"
        style="overflow-y: auto; overflow-x: hidden"
        :style="{ height: divHeight + 'px' }"
      >
        <VirtualList
          v-slot="slotProps"
          :list-data="orderList"
          :estimated-item-size="100"
        >
          <order
            :order-data="slotProps.item"
            @send-message="sendMessage"
          ></order>
        </VirtualList>
      </div>
      <el-empty v-else description="暂无数据" />
    </el-tab-pane>
    <el-tab-pane label="商品" name="product">
      <el-row>
        <el-col :span="18">
          <el-input
            v-model="productSearchForm.content"
            class="input-with-select"
            style="panding: 0 8px"
            clearable
            @keyup.enter="productSearchInputFunc"
          >
            <template #prepend>
              <el-select
                v-model="productSearchForm.type"
                placeholder="请选择"
                style="width: 100px"
              >
                <el-option label="product_id" value="product_id"></el-option>
                <el-option label="标题" value="title"></el-option>
                <el-option label="店铺子SKU" value="sellerSkuList"></el-option>
                <el-option label="店铺父SKU" value="prodPSkuList"></el-option>
              </el-select>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="productSearchForm.orderBy"
            placeholder="请选择"
            @change="productSearchInputFunc"
          >
            <el-option
              v-for="item in salesVolumeOption"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <div
        v-if="productList.length !== 0"
        style="overflow-y: auto; overflow-x: hidden"
        :style="{ height: divHeight + 'px' }"
      >
        <div class="infinite-list-wrapper" style="verflow-y: hidden">
          <ul
            v-infinite-scroll="productLoad"
            class="list"
            :infinite-scroll-immediate="false"
            :infinite-scroll-disabled="productDisabled"
            :infinite-scroll-delay="400"
            :infinite-scroll-distance="1"
          >
            <div v-for="item of productList" :key="item.id">
              <Product :product-data="item" @send-message="sendMessage" />
            </div>
          </ul>
        </div>
      </div>
      <el-empty v-else description="暂无数据" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import VirtualList from '@/components/lazada/VirtualList.vue';
  import Order from './Order.vue';
  import Product from './Product.vue';
  import {
    listTkOrdersApi,
    handleTkInitEnumApi,
    listTkProductsApi,
    tiktokOrderStatusApi
  } from '@/api/tiktok/chat';
  import useTikTokChatStore from '@/store/modules/tiktokChat';
  import { storeToRefs } from 'pinia';
  const tikTokChatStore = useTikTokChatStore();
  const { userInfo } = storeToRefs(tikTokChatStore);
  const { sendMessage } = tikTokChatStore;

  const activeName = ref('order');
  const divHeight = ref(0);

  onMounted(() => {
    window.screenHeight = document.body.clientHeight;
    divHeight.value = window.screenHeight - 150;
    getTkSalesVolumeOption();
    getOrderSearchEnum();
    orderFunc();
  });

  watch(
    () => userInfo.value.buyerId,
    (val) => {
      if (val && activeName.value === 'order') {
        orderList.value = [];
        orderFunc();
      }
    }
  );
  watch(
    () => userInfo.value.buyerId,
    () => {
      initDataForm();
      orderList.value = [];
      productCount.value = 0;
      productList.value = [];
      productPage.value = 1;
      if (activeName.value === 'product') {
        getProductData();
      }
    }
  );

  const initDataForm = () => {
    orderSearchForm.value = { type: '全部', content: '' };
    productSearchForm.value = {
      type: 'product_id',
      orderBy: 'NINETY_SALES_ASC',
      content: ''
    };
  };

  const tabLoading = ref(false);
  // #region 订单start
  const orderSearchForm = ref({ type: '全部', content: '' });
  const orderList = ref([]);
  const handleTabChange = (tab) => {
    activeName.value = tab.props.name;

    // initDataForm();
    if (tab === 'order') {
      if (orderList.value.length) return;
      orderFunc();
    }
    if (tab === 'product') {
      if (productList.value.length) return;
      getProductData();
    }
    // 获取可视区域高度
    window.screenHeight = document.body.clientHeight;
    divHeight.value = window.screenHeight - 150;
  };

  // 查询商品销量枚举
  const salesVolumeOption = ref([]);
  const getTkSalesVolumeOption = async () => {
    const { data } = await handleTkInitEnumApi();
    salesVolumeOption.value = data.tiktokQueryProductOrderByEnum;
  };

  // 查询订单搜索下拉选择
  const orderSearchEnum = ref({});
  const getOrderSearchEnum = async () => {
    const { data } = await tiktokOrderStatusApi();
    orderSearchEnum.value = {
      ...data,
      全部: []
    };
  };

  // 查询订单列表
  const orderFunc = async () => {
    const { storeAcctId, buyerId } = userInfo.value;

    let params = {
      platCodeEnum: 'TIKTOK',
      storeAcctIdList: [storeAcctId],
      buyerUserId: buyerId,
      platOrderStatusList: orderSearchEnum.value[orderSearchForm.value.type],
      platOrderIdLIst: orderSearchForm.value.content
        .split(',')
        .filter((item) => item !== '')
    };
    try {
      tabLoading.value = true;
      const { data } = await listTkOrdersApi(params);
      orderList.value = (data || []).map((item) => ({
        ...item,
        storeAcctId
      }));
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tabLoading.value = false;
    }
  };
  // #endregion 订单end

  // #region 商品start
  const productSearchForm = ref({
    type: 'product_id',
    orderBy: 'NINETY_SALES_ASC',
    content: ''
  });

  const productList = ref([]);
  const productPage = ref(1);
  const productLimit = 10;
  const productCount = ref(0);
  const productDisabled = computed(
    () => productList.value.length >= productCount.value
  );

  // enter事件
  const productSearchInputFunc = () => {
    productList.value = [];
    productPage.value = 1;
    productCount.value = 0;
    if (activeName.value === 'order') {
      orderFunc();
    }
    if (activeName.value === 'product') {
      getProductData();
    }
  };

  // 查询店铺商品列表
  const getProductData = async () => {
    const { storeAcctId } = userInfo.value;
    const params = {
      page: productPage.value,
      limit: productLimit,
      storeAcctId: storeAcctId,
      orderByEnum: productSearchForm.value.orderBy
    };
    const content = productSearchForm.value.content
      .split(',')
      .filter((item) => item !== '');
    switch (productSearchForm.value.type) {
      case 'product_id':
        params.productIdList = content;
        break;
      case 'title':
        params.title = productSearchForm.value.content;
        break;
      case 'prodPSkuList':
        params.prodPSkuList = content;
        break;
      case 'sellerSkuList':
        params.sellerSkuList = content;
        break;

      default:
        break;
    }
    try {
      tabLoading.value = true;
      const { data, count } = await listTkProductsApi(params);
      productList.value.push(...data);
      productCount.value = count;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tabLoading.value = false;
    }
  };

  // 从对话框复制跳转过来反显productId
  const searchProductListByMiddlePart = (pId) => {
    productList.value = [];
    activeName.value = 'product';
    productSearchForm.value.type = 'product_id';
    productSearchForm.value.orderBy = 'NINETY_SALES_ASC';
    productSearchForm.value.content = pId;
    getProductData();
  };

  defineExpose({ searchProductListByMiddlePart });

  const productLoad = () => {
    if (productDisabled.value) return;
    setTimeout(() => {
      productPage.value += 1;
      getProductData();
    }, 2000);
  };
  // #endregion 商品end
</script>

<style lang="scss" scoped>
  .right_menu {
    width: 350px;
    min-width: 325px;

    :deep(.el-tabs__item) {
      width: 100%;
      text-align: center;
    }
    :deep(.el-tabs__item.is-active) {
      color: var(--chat-primary);
    }
    :deep(.el-tabs__active-bar) {
      background-color: var(--chat-primary);
    }
    :deep(.el-radio-button .el-radio-button__inner) {
      width: 100%;
    }
    :deep(.el-input__inner) {
      :focus {
        border-color: #c0c4cc;
      }
    }
  }
</style>
