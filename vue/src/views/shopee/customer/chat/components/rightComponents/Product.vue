<template>
  <el-card class="box-card mt05" style="margin: 5px">
    <el-row>
      <el-col :span="4">
        <el-image :src="productData.imgs" width="50" />
      </el-col>
      <el-col :span="20">
        <div class="product_title">
          <el-tooltip
            class="item"
            effect="dark"
            :content="productData.title"
            placement="bottom-end"
          >
            <b>{{ productData.title }}</b>
          </el-tooltip>
        </div>
        <div>
          <el-tag type="danger" size="small"> {{ productData.itemId }}</el-tag
          ><el-icon alt="复制" title="复制" @click="copy(productData.itemId)"
            ><CopyDocument
          /></el-icon>
        </div>
        <div>
          <el-tag type="warning" size="small"> {{ productData.variSku }}</el-tag
          ><el-icon alt="复制" title="复制" @click="copy(productData.variSku)"
            ><CopyDocument
          /></el-icon>
        </div>
        <div class="main_color">
          {{ productData.showCurrPrice }}
        </div>
      </el-col>
    </el-row>
    <hr />
    <el-row>
      <el-col :span="14">
        <span class="color_9B">在线库存 {{ productData.stock }}</span> |
        90天销量
        {{ productData.ninetySales }}
      </el-col>
      <el-col :span="10" class="text-right">
        <el-button size="small" @click="productInfo(productData.itemIdSrc)"
          >详情</el-button
        >
        <el-button type="danger" size="small" @click="sendProduct(productData)"
          >发送</el-button
        >
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
  import { CopyDocument } from '@element-plus/icons-vue';
  import useShopeeChatStore from '@/store/modules/shopeeChat';
  import { copy } from '@/utils/common';
  const shopeeChatStore = useShopeeChatStore();
  const { sendMessage } = shopeeChatStore;
  defineProps({
    productData: {
      type: Object,
      default: () => ({})
    }
  });
  const sendProduct = (product) => {
    let message = {
      messageType: 'item',
      params: {
        itemId: product.itemId
      },
      showData: {
        shopeeChatMsgItemDto: {
          ...product
        }
      }
    };
    sendMessage(message);
  };
  const productInfo = (productUrl) => {
    window.open(productUrl, '_blank');
  };
</script>

<style lang="scss" scoped>
  .box_card {
    margin: 5px;
  }

  .product_title {
    font-size: 15px;
  }
  .color_9B {
    color: #9b9b9b;
  }
  .main_color {
    color: var(--chat-primary);
  }
</style>
