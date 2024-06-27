<template>
  <div v-if="tiktokChatMsgItemDto" :class="getProductClass">
    <el-tooltip placement="right-start">
      <template #content>
        <div
          @click="
            copyProdPSkus(
              tiktokChatMsgItemDto.prodPSkus
                ? tiktokChatMsgItemDto.prodPSkus.join(',')
                : '',
              tiktokChatMsgItemDto.productId
            )
          "
        >
          {{
            tiktokChatMsgItemDto.prodPSkus
              ? tiktokChatMsgItemDto.prodPSkus.join(',')
              : ''
          }}
        </div>
      </template>
      <div
        class="card-product message-card border-r-10"
        @click="goHtml(tiktokChatMsgItemDto.itemIdSrc)"
      >
        <div class="card-header flex-header">
          <el-icon color="#20b2aa" size="18" class="mr-4"><Goods /></el-icon
          >商品
        </div>
        <div class="card-content">
          <div class="product_img">
            <el-image
              :src="
                tiktokChatMsgItemDto.imageUrl || tiktokChatMsgItemDto.imgUrl
              "
              loading="lazy"
              fit="contain"
            />
          </div>
          <div class="lzd-pro-desc">
            <div class="lzd-pro-title text-two-lines">
              {{ tiktokChatMsgItemDto.productName }}
            </div>
            <div class="lzd-pro-price text-overflow product-price">
              {{ tiktokChatMsgItemDto.showCurrPrice }}
            </div>
          </div>
        </div>
      </div>
    </el-tooltip>
  </div>
  <div v-else :class="getTextClass()">
    <div class="message-text-box">
      <div class="lzd-message-text">
        <span class="emoji-face has-text"
          >商品：{{
            productData.content ? JSON.parse(productData.content)?.goods_id : ''
          }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, inject } from 'vue';
  import { copy } from '@/utils/common';

  const props = defineProps({
    productData: {
      type: Object,
      default: () => ({})
    }
  });
  const tiktokChatMsgItemDto = computed(
    () => props.productData.tiktokChatMsgItemDto
  );

  const productMsgListPId = inject('productMsgListPId');

  const copyProdPSkus = (pSku, productId) => {
    copy(pSku, 'input', '商品父sku已复制');
    productMsgListPId(productId);
  };

  const getTextClass = () => {
    let classArr = ['lzd-message-item', 'card-text'];
    if (props.productData.senderRole === 1) {
      classArr.push('msg_right');
    }
    return classArr;
  };
  const getProductClass = () => {
    let classArr = ['lzd-message-item', 'card-text'];
    if (props.productData.senderRole === 1) {
      classArr.push('msg_right');
    }
    return classArr;
  };
  const goHtml = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .card-content {
    display: flex;
    flex-direction: column;
  }
  .card-product {
    height: inherit !important;
    padding: 5px 10px 10px;
    box-sizing: border-box;
    font-size: 12px;
    color: #3a434d;
    background-color: #fff;
  }
  .product_img {
    width: 100%;
    height: auto;
    padding: 0 5px 10px;
  }
  .msg_right {
    border: 0.5px solid rgb(165, 203, 233);
    background-color: rgb(201, 231, 255);
  }
  .flex-header {
    display: flex;
    align-items: center;
    font-size: 16px !important;
  }
  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .mt-4 {
    margin-top: 4px;
  }
  .mr-4 {
    margin-right: 4px;
  }
  .card-header {
    border-bottom: 0 !important;
  }
  .border-r-10 {
    border-radius: 10px;
  }
  .text-md {
    font-size: 134px !important;
  }
</style>
