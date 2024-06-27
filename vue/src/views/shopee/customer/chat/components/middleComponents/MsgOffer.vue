<template>
  <div v-loading="offerLoading" :class="getClass()">
    <div class="card-product message_card">
      <div class="card-header">shopee议价申请</div>
      <div class="card-content flex_column">
        <div class="disflex">
          <div
            class="background-default lzd-pro-img"
            @click="scanImgFunc(offerData.offer.prodMainImg)"
          >
            <el-image :src="offerData.offer.prodMainImg" loading="lazy" />
          </div>
          <div class="lzd-pro-desc">
            <el-tooltip
              effect="dark"
              :content="offerData.offer.productTitle"
              placement="top-start"
            >
              <div class="lzd-pro-title text-two-lines">
                商品标题: {{ offerData.offer.productTitle }}
              </div>
            </el-tooltip>
            <div class="comon_text_overflow">
              item_id: {{ offerData.offer.itemId }}
            </div>
            <div class="comon_text_overflow">
              vari_id: {{ offerData.offer.modelId }}
            </div>
            <div class="comon_text_overflow">
              数量: {{ offerData.offer.productCount }}
            </div>
          </div>
        </div>
        <div class="card-price_info">
          <div class="price_info">
            <span>现价：</span>
            <div>
              {{ offerData.offer.currency }} {{ offerData.offer.currentPrice }}
              <span class="ml10"
                >(刊登价{{ offerData.offer.currency }}
                {{ offerData.offer.originalPrice }})</span
              >
            </div>
          </div>
          <div class="price_info">
            <span>5%毛利税后单价：</span>
            <span
              >{{ offerData.offer.currency }}
              {{ offerData.offer.minProfitPrice }}</span
            >
          </div>
          <div class="price_info">
            <span>议价后单价：</span>
            <div class="warning_color">
              {{ offerData.offer.currency }} {{ offerData.offer.offerPrice }}
              <span v-if="offerData.offer.taxApplicable" class="ml10"
                >(税前价{{ offerData.offer.currency }}
                {{ offerData.offer.priceBeforeTax }})</span
              >
            </div>
          </div>
          <div class="price_info">
            <span>议后价总金额：</span>
            <div class="warning_color">
              {{ offerData.offer.currency }}
              {{
                (
                  offerData.offer.productCount * offerData.offer.offerPrice
                ).toFixed(2)
              }}
              <span v-if="offerData.offer.taxApplicable" class="ml10"
                >(税前价 {{ offerData.offer.currency }}
                {{
                  (
                    offerData.offer.productCount *
                    offerData.offer.priceBeforeTax
                  ).toFixed(2)
                }})</span
              >
            </div>
          </div>
          <div class="price_info">
            <span>议后价总利润额：</span>
            <span class="warning_color">
              ￥ {{ offerData.offer.profitAfterOffer }}</span
            >
          </div>
          <template v-if="offerData.offer.latestOffersModelIds">
            <div class="show_word_break">
              <span class="warning_color">存在多个未处理议价申请：（</span>
              <span>vari_id:{{ offerData.offer.latestOffersModelIds }}</span>
              <span class="warning_color">）</span>
            </div>
            <div class="price_info">
              <span>合并议后价总利润额：</span>
              <span class="warning_color">
                ￥ {{ offerData.offer.latestOffersTotalProfit }}</span
              >
            </div>
          </template>
        </div>
      </div>
      <div class="card-footer">
        <!-- pending -->
        <div
          v-if="
            offerData.offer.offerStatus === 1 && offerData.offer.status === 1
          "
          class="card_footer_btn"
        >
          <el-button
            type="success"
            size="small"
            @click="handleOffer(offerData, true)"
            >接受议价</el-button
          >

          <el-button
            size="small"
            type="danger"
            @click="handleOffer(offerData, false)"
            >拒绝议价</el-button
          >
          <el-button type="info" size="small" @click="handleIgnore(offerData)"
            >忽略议价</el-button
          >
        </div>
        <!-- ignore -->
        <div
          v-else-if="
            offerData.offer.offerStatus === 1 && offerData.offer.status === 2
          "
          class="status_text"
        >
          <i class="el-icon-close"></i>
          <span>已忽略议价</span>
        </div>
        <!-- accepted -->
        <div
          v-else-if="offerData.offer.offerStatus === 2"
          style="color: #67c23a"
          class="status_text"
        >
          <i class="el-icon-check"></i>
          <span>已接受议价</span>
        </div>
        <!-- rejected -->
        <div
          v-else-if="offerData.offer.offerStatus === 3"
          style="color: #f56c6c"
          class="status_text"
        >
          <i class="el-icon-close"></i>
          <span>已拒绝议价</span>
        </div>
        <!-- cancelled -->
        <div v-else class="status_text">
          <i class="el-icon-close"></i>
          <span>已取消议价</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { handleOfferApi, handleIgnoreOfferApi } from '@/api/shopee/chat';
  const props = defineProps({
    offerData: {
      type: Object,
      default: () => ({})
    }
  });

  const getClass = () => {
    let classArr = ['lzd-message-item', 'card-product'];
    if (props.offerData.buyerOrSeller !== 2) {
      classArr.push('msg_right');
    }
    return classArr;
  };

  const url = ref();
  onMounted(() => {
    url.value = props.offerData.url || props.offerData.imageUrl;
  });

  const emits = defineEmits([
    'scanImgFunc',
    'changeOfferStatus',
    'changeOfferCount'
  ]);
  const scanImgFunc = (_url) => {
    emits('scanImgFunc', _url);
  };

  const offerLoading = ref(false);
  const handleOffer = async (offerInfo, agree = false) => {
    offerLoading.value = true;
    const { storeAcctId, offerId, messageId } = offerInfo;
    const params = {
      agree,
      storeAcctId,
      offerId,
      messageId
    };
    try {
      await handleOfferApi(params);
      // 改状态
      const offerStatus = agree ? 2 : 3;
      emits('changeOfferStatus', { offerStatus, id: offerInfo.id });
      emits('changeOfferCount', { type: 'reduce' });
    } catch (err) {
      console.log('err :>> ', err);
    }
    offerLoading.value = false;
  };
  const handleIgnore = async (offerInfo) => {
    offerLoading.value = true;
    try {
      await handleIgnoreOfferApi(offerInfo.offer.id);
      // 改状态
      const status = 2;
      this.$emit('changeOfferStatus', { status, id: offerInfo.id });
      // 减少数量
      this.$emit('changeOfferCount', { type: 'reduce' });
    } catch (err) {
      console.log('err :>> ', err);
    }
    offerLoading.value = false;
  };
</script>

<style lang="scss" scoped>
  @import url('@/components/lazada/css/common.css');
  .msg_right {
    border: 0.5px solid rgb(165, 203, 233);
    background-color: rgb(201, 231, 255);
  }
  .message_card {
    width: 330px;
    height: 100%;
  }
  .disflex {
    display: flex;
  }
  .flex_column {
    flex-direction: column;
  }
  .price_info {
    display: flex;
    align-content: center;
    justify-content: space-between;
  }
  .show_word_break {
    word-break: break-all;
  }
  .status_text {
    width: 100%;
    text-align: right;
  }
  .card_footer_btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    color: #fff;
  }
  .ml5 {
    margin-left: 5px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .warning_color {
    color: #e6a23c;
  }
</style>
