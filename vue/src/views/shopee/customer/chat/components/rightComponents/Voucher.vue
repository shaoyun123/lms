<template>
  <el-card class="mt05">
    <el-row>
      <el-col :span="4" class="card_left">
        <div>
          <svg
            t="1685418346190"
            class="icon"
            viewBox="0 0 1089 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6018"
            width="40"
            height="40"
          >
            <path
              d="M900.64080875 992H184.57783156A152.75520281 152.75520281 0 0 1 32 839.42216844V562.68401656a22.17148594 22.17148594 0 0 1 44.34297187 0V839.42216844a108.36155344 108.36155344 0 0 0 108.23485969 108.23485968h716.06297719a108.36155344 108.36155344 0 0 0 108.23485969-108.23485968V569.98160281a22.17148594 22.17148594 0 1 1 44.34297187 0V839.42216844a152.75520281 152.75520281 0 0 1-152.57783156 152.57783156zM538.75148094 531.39054781a217.8000075 217.8000075 0 0 1-102.74899969-25.54155187 204.24372844 204.24372844 0 0 1-59.34356625-47.87773969c-36.10784812 26.37773344-80.32412625 40.66884-126.88424625 40.66884-113.44199156 0-205.81473656-85.89867094-206.41019812-191.70100219a79.81734938 79.81734938 0 0 1-1.03889251-12.59340375V119.67239C42.32557812 71.32588156 84.02064031 32 135.2557775 32h814.71975469c51.24780563 0 92.93019938 39.27520312 92.93019937 87.67239v174.67330031c0 1.60901625-0.08868563 3.02799188-0.17737218 4.11756188 0.11402437 2.77460344 0.17737219 5.16912375 0.17737218 7.44961875 0 106.27109906-92.60079469 192.72722437-206.41019906 192.72722531-48.46053375 0-95.36272781-16.077495-132.25608-44.76106312-38.66707125 48.34650844-99.86037281 77.51151469-165.48797156 77.51151468zM380.52308844 403.87283094a22.17148594 22.17148594 0 0 1 18.62404875 10.13553656 157.2401775 157.2401775 0 0 0 57.82323468 52.75546687 173.3176725 173.3176725 0 0 0 81.78110907 20.27107219c59.4195825 0 114.02478469-29.74779937 142.45496437-77.62553906a22.17148594 22.17148594 0 0 1 34.86624563-4.23158625c30.71067563 31.20478313 74.6102175 49.10667375 120.35949469 49.10667375 89.37009187 0 162.06722719-66.56513531 162.06722718-148.38425344 0-1.92575156 0-4.04154469-0.19004156-6.67678406a21.968775 21.968775 0 0 1 0-2.53388437c0-0.43076063 0-0.84885094 0.08868656-1.26694219s0.06334688-0.78550406 0.07601625-1.17825563V119.67239c0-23.8945275-21.79140281-43.32941813-48.5872275-43.32941813h-814.64373843c-26.79582469 0-48.5872275 19.43489063-48.58722844 43.32941813v174.67330031a38.36300531 38.36300531 0 0 0 0.69681844 6.85415625 22.15881656 22.15881656 0 0 1 0.35474343 4.14290063v0.86152125c0.16470281 81.67975406 72.81115969 148.09285594 162.06722719 148.09285593 43.82352563 0 84.88511719-15.7860975 115.63380094-44.45699625a22.17148594 22.17148594 0 0 1 15.11461875-5.96729718z"
              p-id="6019"
              fill="#d9001b"
            ></path>
          </svg>
        </div>
        <div class="mt05">商店</div>
      </el-col>
      <el-col :span="20">
        <el-row>
          <el-col :span="18">
            <div v-if="voucherData.rewardType !== 1">
              {{ voucherData.currency }}{{ voucherData.percentage }}% off
            </div>
            <div v-if="voucherData.rewardType === 1" class="card_title">
              {{ voucherData.currency }}{{ voucherData.discountAmount }}
            </div>
            <div v-else class="card_title">{{ voucherData.percentage }}%</div>

            <div class="card_price">
              <span>
                最低消费金额：{{ voucherData.currency }}
                {{ voucherData.minBasketPrice }}
              </span>
              <span v-if="showMaxPrice()">
                最高消费金额：{{ voucherData.currency }}
                {{ voucherData.minBasketPrice }}封顶
              </span>
            </div>
            <div class="card_voucherCode">
              voucher_code:{{ voucherData.voucherCode }}
            </div></el-col
          >
          <el-col :span="6" class="send_btn">
            <el-button
              type="danger"
              size="small"
              disabled
              @click="sendVoucher(voucherData)"
              >发送</el-button
            ></el-col
          >
        </el-row>

        <hr />
        <el-row class="card_status">
          <el-col :span="6">
            <el-tag
              v-if="voucherData.voucherStatus === 'upcoming'"
              type="danger"
              size="small"
              >未开始</el-tag
            >
            <el-tag
              v-if="voucherData.voucherStatus === 'ongoing'"
              type="success"
              size="small"
              >进行中</el-tag
            >
          </el-col>
          <el-col :span="18">
            {{
              util.formatDate.format(
                new Date(voucherData.startTime),
                'yyyy月MM年dd日'
              )
            }}-{{
              util.formatDate.format(
                new Date(voucherData.endTime),
                'yyyy月MM年dd日'
              )
            }}
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
  import util from '@/components/lazada/js/util.js';
  import useShopeeChatStore from '@/store/modules/shopeeChat';
  import { storeToRefs } from 'pinia';
  const shopeeChatStore = useShopeeChatStore();
  const { sendMessage } = shopeeChatStore;
  const { userInfo } = storeToRefs(shopeeChatStore);

  const props = defineProps({
    voucherData: {
      type: Object,
      default: () => ({})
    }
  });
  const showMaxPrice = () => {
    const { rewardType, maxPrice } = props.voucherData;
    if (rewardType !== 1 && (maxPrice !== undefined || maxPrice !== '')) {
      return true;
    }
    return false;
  };
  const sendVoucher = (item) => {
    let message = {
      messageType: 'voucher',
      params: {
        ...item,
        templateId: 10008,
        sessionId: userInfo.value.sessionId,
        storeAcctId: userInfo.value.storeAcctId,
        promotionId: item.voucherId
      }
    };
    sendMessage(message);
  };
</script>

<style lang="scss" scoped>
  @import '@/styles/mixins.scss';
  :deep(.el-card__body) {
    padding: 20px 10px 10px;
  }
  .card_left {
    display: flex;
    align-items: center;
    margin-top: 30px;
    justify-content: start;
    flex-direction: column;
    color: var(--chat-primary);
  }
  .card_title {
    color: var(--chat-primary);
    font-size: 16px;
    font-weight: 700;
    margin-top: 5px;
  }
  .card_price {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    color: #9b9b9b;
    margin-top: 5px;
  }
  .card_voucherCode {
    color: #9b9b9b;
    margin-top: 5px;
  }
  .send_btn {
    display: flex;
    align-items: center;
  }
  .mt05 {
    margin-top: 5px;
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
  .ml10 {
    margin-left: 10px;
  }
  .card_status {
    min-height: 30px;
    line-height: 30px;
  }
</style>
