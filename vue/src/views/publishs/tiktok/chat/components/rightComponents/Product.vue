<template>
  <el-card class="box-card mt05" style="margin: 5px">
    <el-row>
      <el-col :span="4">
        <el-image :src="productData.imgUrl" width="50" />
      </el-col>
      <el-col :span="20" style="padding-left: 5px">
        <div class="product_title">
          <el-tooltip
            class="item"
            effect="dark"
            :content="productData.productName"
            placement="top"
          >
            <b>{{ productData.productName }}</b>
          </el-tooltip>
        </div>
        <div class="mt-2">product id: {{ productData.productId }}</div>
        <div class="mt-2">
          <span>促销价: {{ productData.promotionPriceMin }}</span>
          <span v-if="productData.promotionPriceMax">
            - {{ productData.promotionPriceMax }}</span
          >
        </div>
        <div class="flex-between mt-2">
          <div>在线数量: {{ productData.skuCount }}</div>
          <div class="flex">
            <el-button
              type="danger"
              size="small"
              @click="productInfo(productData.productId)"
              >查看</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="sendProduct(productData)"
              >发送</el-button
            >
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
  import useTikTokChatStore from '@/store/modules/tiktokChat';
  const tikTokChatStore = useTikTokChatStore();
  const { sendMessage } = tikTokChatStore;
  defineProps({
    productData: {
      type: Object,
      default: () => ({})
    }
  });

  // 点击发送订单
  const sendProduct = (product) => {
    let message = {
      messageType: 'goods_card',
      params: {
        goodsId: product.productId
      },
      showData: {
        tiktokChatMsgItemDto: {
          ...product
        }
      }
    };
    sendMessage(message);
  };

  // 查看商品--点击跳转到TK在线商品 并且根据productId进行搜索
  const productInfo = (productId) => {
    window.open(
      `/trade-web/#/publishs/tiktok/onlineproduct?productId=${productId}`,
      '_blank'
    );
  };
</script>

<style lang="scss" scoped>
  .box_card {
    margin: 5px;
  }

  .product_title {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .mt-2 {
    margin-top: 2px;
  }
  .color_9B {
    color: #9b9b9b;
  }
  .main_color {
    color: var(--chat-primary);
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
