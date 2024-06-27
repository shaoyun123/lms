<template>
  <el-card class="box-card" style="margin-top: 5px">
    <el-row>
      <el-col :span="4">
        <div style="text-align: center; margin-top: 30px">
          <img
            src="@/components/lazada/images/shangdian.png"
            width="50"
            alt="hh"
          />
        </div>
        <div style="text-align: center; margin-top: 5px">商店</div>
      </el-col>
      <el-col :span="20">
        <!-- <el-row> -->
        <div
          v-if="voucherData.voucherDiscountType === 'MONEY_VALUE_OFF'"
          style="font-weight: bold; font-size: 20px; color: #d9001b"
        >
          {{ voucherData.currency }} {{ voucherData.offeringMoneyValueOff }}
        </div>
        <div
          v-if="voucherData.voucherDiscountType === 'PERCENTAGE_DISCOUNT_OFF'"
          style="font-weight: bold; font-size: 20px; color: #d9001b"
        >
          {{ voucherData.offeringPercentageDiscountOff }}%
        </div>
        <div style="margin-top: 5px">
          {{ voucherData.voucherName }}
        </div>
        <div style="margin-top: 5px" class="color-9B">
          {{ voucherData.voucherId }}
        </div>
        <div style="margin-top: 5px" class="color-9B">
          最低消费金额：{{ voucherData.currency }}
          {{ voucherData.criteriaOverMoney }}
        </div>
        <!-- </el-row> -->
        <hr />
        <el-row style="height: 30px; line-height: 30px">
          <el-col :span="4">
            <el-tag
              v-if="voucherData.voucherStatus === 'NOT_START'"
              type="danger"
              size="small"
              >未开始</el-tag
            >
            <el-tag
              v-if="voucherData.voucherStatus === 'ONGOING'"
              type="success"
              size="small"
              >进行中</el-tag
            >
          </el-col>
          <el-col :span="16">
            {{
              util.formatDate.format(
                new Date(voucherData.periodStartTime),
                'yyyy-MM-dd'
              )
            }}-{{
              util.formatDate.format(
                new Date(voucherData.periodEndTime),
                'yyyy-MM-dd'
              )
            }}
          </el-col>
          <el-col :span="4" class="text-align-right">
            <el-button
              type="danger"
              size="small"
              @click="sendVoucher(voucherData)"
              >发送</el-button
            >
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import lazadaChat from '@/store/lazadaChat/store';
  import { sendMessage } from '@/api/lazada/index';
  export default {
    props: {
      voucherData: {
        type: Object,
        default: () => {}
      }
    },
    setup() {
      const { state } = lazadaChat();
      return {
        state
      };
    },
    data() {
      return {};
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {
      sendVoucher(item) {
        item.templateId = 10008;
        item.sessionId = this.state.currentSession;
        item.storeAcctId = this.state.currentStoreAcctId;
        item.promotionId = item.voucherId;
        // 发送消息
        sendMessage(item).then((res) => {
          if (res.code !== '0000') {
            this.$message.error(res.msg);
          }
        });
      }
    }
  };
</script>

<style scoped>
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
</style>
