<template>
  <div>
    <el-tabs
      v-if="state.currentSalesSite"
      v-model="activeName"
      class="rightMenu"
      @tab-click="handleClick"
    >
      <!-- 订单 -->
      <el-tab-pane label="订单" name="order">
        <!-- 订单列表 -->
        <div
          v-if="orderList.length !== 0"
          style="overflow-y: auto; overflow-x: hidden"
          :style="{ height: divHeight + 'px' }"
        >
          <VirtualList
            v-slot="slotProps"
            :list-data="orderList"
            :estimated-item-size="100"
          >
            <right-menu-order :order-data="slotProps.item"></right-menu-order>
          </VirtualList>
        </div>
      </el-tab-pane>
      <!-- 商品 -->
      <el-tab-pane label="商品" name="product">
        <el-row>
          <el-col :span="18">
            <el-input
              v-model="productSearchInput"
              placeholder="请输入内容"
              class="input-with-select"
              @keyup.enter="productSearchInputFunc"
            >
              <template #prepend>
                <el-select
                  v-model="productSearchSelect"
                  placeholder="请选择"
                  style="width: 100px"
                >
                  <el-option label="标题" value="title"></el-option>
                  <el-option label="Item ID" value="itemId"></el-option>
                  <el-option label="店铺子SKU" value="storeSubSku"></el-option>
                  <el-option label="ShopSKU" value="shopSku"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="productSearchOrderBySelect"
              placeholder="请选择"
              @change="productSearchInputFunc"
            >
              <el-option label="90天销量倒序" value="ninetySales"></el-option>
              <el-option label="刊登时间倒序" value="listingTime"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 商品列表 -->
        <div
          v-if="productList.length !== 0"
          style="overflow-y: auto; overflow-x: hidden"
          :style="{ height: divHeight + 'px' }"
        >
          <VirtualList
            v-slot="slotProps"
            :list-data="productList"
            :estimated-item-size="100"
          >
            <right-menu-product
              :product-data="slotProps.item"
            ></right-menu-product>
          </VirtualList>
        </div>
      </el-tab-pane>
      <!-- 优惠券 -->
      <el-tab-pane label="优惠券" name="coupon" class="coupon">
        <el-radio-group
          v-model="isCollapse"
          size="mini"
          style="width: 100%"
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
            <right-menu-coupon
              :voucher-data="slotProps.item"
            ></right-menu-coupon>
          </VirtualList>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import lazadaChat from '@/store/lazadaChat/store';
  import {
    listProduct,
    tradeInfo,
    listVoucherForChat
  } from '@/api/lazada/index';

  import rightMenuOrder from '@/components/lazada/rightMenuOrder.vue';
  import rightMenuProduct from '@/components/lazada/rightMenuProduct.vue';
  import rightMenuCoupon from '@/components/lazada/rightMenuCoupon.vue';
  import VirtualList from '@/components/lazada/VirtualList.vue';

  export default {
    components: {
      'right-menu-order': rightMenuOrder,
      'right-menu-product': rightMenuProduct,
      'right-menu-coupon': rightMenuCoupon,
      VirtualList: VirtualList
    },
    setup() {
      const { state } = lazadaChat();
      return {
        state
      };
    },
    data() {
      return {
        activeName: 'order',
        productSearchInput: '', // 商品tab 输入框
        productSearchSelect: 'title', // 商品tab 订单
        productSearchOrderBySelect: 'ninetySales', // 商品tab 90天销量倒序
        orderList: [], // 订单list
        productList: [], // 商品list
        voucherList: [], // 优惠券list
        divHeight: 0,
        isCollapse: true
      };
    },
    watch: {
      'state.currentSession': function (val) {
        if (val !== '') {
          this.activeName = 'order';
          this.orderFunc();
        }
      },
      'state.divHeight': function (val) {
        this.divHeight = val;
      }
    },
    methods: {
      handleClick(tab) {
        this.orderList = [];
        this.activeName = tab.paneName;
        if (tab.paneName === 'order') {
          // 订单查詢接口
          this.orderFunc();
        }
        if (tab.paneName === 'product') {
          // 商品查詢接口
          this.productSearchInputFunc();
        }
        if (tab.paneName === 'coupon') {
          // 优惠券查詢接口
          this.getCouponData();
        }
        // 获取可视区域高度
        window.screenHeight = document.body.clientHeight;
        this.divHeight = window.screenHeight - 150;
      },
      // 订单查询接口
      orderFunc() {
        let obj = {};
        // 买家的名字
        obj.buyerId = this.state.message.buyerId;
        obj.storeAcctId = this.state.currentStoreAcctId;
        obj.size = 1000; // 分頁，暫未用，前端分頁
        tradeInfo(obj).then((res) => {
          if (res.code === '0000') {
            this.orderList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      //  商品查詢接口--回车搜索
      productSearchInputFunc() {
        this.productList = [];
        let obj = {};
        obj[this.productSearchSelect] = this.productSearchInput;
        obj.storeAcctId = this.state.currentStoreAcctId;
        obj.order = this.productSearchOrderBySelect;
        listProduct(obj).then((res) => {
          if (res.code === '0000') {
            this.productList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      // 优惠券查詢接口
      getCouponData() {
        this.voucherList = [];
        let obj = {};
        if (this.isCollapse) {
          obj.voucherStatus = 'ONGOING';
        } else {
          obj.voucherStatus = 'NOT_START';
        }

        obj.storeAcctId = this.state.currentStoreAcctId;
        listVoucherForChat(obj).then((res) => {
          if (res.code === '0000') {
            this.voucherList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .text-align-right {
    text-align: right;
  }

  .color-9B {
    color: #9b9b9b;
  }

  .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  :deep(.rightMenu .el-tabs__item) {
    width: 80%;
    text-align: center;
  }

  :deep(.coupon .el-radio-button .el-radio-button__inner) {
    width: 100%;
  }

  :deep(.rightMenu .el-input__inner:focus) {
    border-color: #c0c4cc;
  }
</style>
