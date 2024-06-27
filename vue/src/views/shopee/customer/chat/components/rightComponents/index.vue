<template>
  <el-tabs
    v-model="activeName"
    v-loading="tabLoading"
    class="right_menu"
    @tab-change="handleTabChange"
  >
    <el-tab-pane label="订单" name="order">
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
            placeholder="请输入内容"
            class="input-with-select"
            @keyup.enter="productSearchInputFunc"
          >
            <template #prepend>
              <el-select
                v-model="productSearchForm.type"
                placeholder="请选择"
                style="width: 100px"
              >
                <el-option label="标题" value="title"></el-option>
                <el-option label="Item ID" value="itemIds"></el-option>
                <el-option label="商品子SKU" value="prodSSkuList"></el-option>
                <el-option label="商品父SKU" value="prodPSkuList"></el-option>
                <el-option
                  label="variation_id"
                  value="variationIds"
                ></el-option>
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
            <el-option label="90天销量倒序" :value="1"></el-option>
            <el-option label="刊登时间倒序" :value="2"></el-option>
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
    <el-tab-pane label="优惠券" name="voucher" class="coupon">
      <el-radio-group
        v-model="isCollapse"
        size="small"
        style="width: 100%"
        fill="#d9001b"
        @change="getCouponData"
      >
        <el-radio-button :value="true" style="width: 50%"
          >进行中</el-radio-button
        >
        <el-radio-button :value="false" style="width: 50%"
          >未开始</el-radio-button
        >
      </el-radio-group>
      <!-- 优惠券列表 -->
      <div
        v-if="voucherList.length !== 0"
        style="overflow-y: auto; overflow-x: hidden"
        :style="{ height: divHeight + 'px' }"
      >
        <VirtualList
          v-slot="slotProps"
          :list-data="voucherList"
          :estimated-item-size="100"
        >
          <Voucher
            :voucher-data="slotProps.item"
            @send-message="sendMessage"
          ></Voucher>
        </VirtualList>
      </div>
      <el-empty v-else description="暂无数据" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import VirtualList from '@/components/lazada/VirtualList.vue';
  import Order from './Order.vue';
  import Voucher from './Voucher.vue';
  import Product from './Product.vue';
  import {
    tradeInfoApi,
    listProductApi,
    listVoucherForChatApi
  } from '@/api/shopee/chat';
  import useShopeeChatStore from '@/store/modules/shopeeChat';
  import { storeToRefs } from 'pinia';
  const shopeeChatStore = useShopeeChatStore();
  const { userInfo } = storeToRefs(shopeeChatStore);
  const { sendMessage } = shopeeChatStore;

  const activeName = ref('order');
  const divHeight = ref(0);
  onMounted(() => {
    window.screenHeight = document.body.clientHeight;
    divHeight.value = window.screenHeight - 150;
    orderFunc();
  });
  watch(
    () => userInfo.value.toId,
    (val) => {
      if (val && activeName.value === 'order') {
        orderList.value = [];
        orderFunc();
      }
    }
  );
  watch(
    () => userInfo.value.toId,
    () => {
      orderList.value = [];
      productCount.value = 0;
      productList.value = [];
      productPage.value = 1;
      voucherList.value = [];
      if (activeName.value === 'product') {
        getProductData();
      } else if (activeName.value === 'coupon') {
        getCouponData();
      }
    }
  );

  const tabLoading = ref(false);
  // #region 订单start
  const orderList = ref([]);
  const handleTabChange = (tab) => {
    activeName.value = tab;
    if (tab === 'order') {
      if (orderList.value.length) return;
      // 订单查詢接口
      orderFunc();
    }
    if (tab === 'product') {
      // 商品查詢接口
      if (productList.value.length) return;
      getProductData();
    }
    if (tab === 'voucher') {
      // 优惠券查詢接口
      if (voucherList.value.length) return;
      getCouponData();
    }
    // 获取可视区域高度
    window.screenHeight = document.body.clientHeight;
    divHeight.value = window.screenHeight - 150;
  };

  const orderFunc = async () => {
    const { storeAcctId, toName, toId } = userInfo.value;
    let params = {
      size: 1000, // 分頁，暫未用，前端分頁
      storeAcctId,
      buyerUserName: toName,
      buyerUserId: toId
    };
    try {
      tabLoading.value = true;
      const { data } = await tradeInfoApi(params);
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
  const productSearchForm = ref({ type: 'title', orderBy: 1 });
  const productList = ref([]);
  const productPage = ref(1);
  const productLimit = 10;
  const productCount = ref(0);
  const productDisabled = computed(
    () => productList.value.length >= productCount.value
  );
  const productSearchInputFunc = () => {
    productList.value = [];
    productPage.value = 1;
    productCount.value = 0;
    getProductData();
  };
  const getProductData = async () => {
    const { storeAcctId } = userInfo.value;
    let params = {
      limit: productLimit,
      page: productPage.value,
      storeAcctId,
      orderBy: productSearchForm.value.orderBy,
      [productSearchForm.value.type]: getSearchContent()
    };
    try {
      tabLoading.value = true;
      const { data, count } = await listProductApi(params);
      productList.value.push(...data);
      productCount.value = count;
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tabLoading.value = false;
    }
  };

  const getSearchContent = () => {
    if (productSearchForm.value.type !== 'title') {
      let temp = productSearchForm.value.content;
      return temp === '' ? [] : productSearchForm.value.content.split(',');
    }
    return productSearchForm.value.content;
  };

  const productLoad = () => {
    if (productDisabled.value) return;
    setTimeout(() => {
      productPage.value += 1;
      getProductData();
    }, 2000);
  };
  // #endregion 商品end

  // #region 优惠券start
  const isCollapse = ref(false);
  const voucherList = ref([]);
  const getCouponData = async () => {
    let params = {
      voucherStatus: isCollapse.value ? 'ongoing' : 'upcoming',
      storeAcctId: userInfo.value.storeAcctId,
      page: 1,
      limit: 1000
    };
    try {
      tabLoading.value = true;
      const { data } = await listVoucherForChatApi(params);
      voucherList.value = data || [];
    } catch (err) {
      console.log('err :>> ', err);
    } finally {
      tabLoading.value = false;
    }
  };
  // #endregion 优惠券end
</script>

<style lang="scss" scoped>
  .right_menu {
    width: 350px;

    :deep(.el-tabs__nav) {
      width: 33.3%;
    }
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
