<template>
  <el-tooltip v-if="indicatorMap?.[keyValue]">
    <div :class="getColorByOperator()">
      {{ indicatorMap[keyValue].value }}
      <span class="ml10">{{ getPercentSign() }}</span>
    </div>
    <template #content>
      <div class="store_tip">
        <div>
          当前值考核时间区间:{{
            transferDate(indicatorMap[keyValue].startTime)
          }}-
          {{ transferDate(indicatorMap[keyValue].endTime) }}
        </div>
        <div>
          {{ getOperatorTips() }}
        </div>
      </div>
    </template>
  </el-tooltip>
</template>

<script setup>
  import {} from 'vue';
  import { transferDate } from '@/utils/common';

  const props = defineProps({
    indicatorMap: {
      type: Object,
      default: () => ({})
    },
    keyValue: {
      type: String,
      default: ''
    }
  });

  const getColorByOperator = () => {
    const { indicatorMap, keyValue } = props;
    const curObj = indicatorMap[keyValue];
    if (curObj.targetValue < curObj.value) {
      return 'red_color';
    }
  };
  const operatorObj = {
    lt: '<',
    le: '≤',
    e: '='
  };
  const showOperator = ['Seller_NRR.seller_fault_negative_review_rate_temp'];
  const getOperatorTips = () => {
    if (showOperator.includes(props.keyValue)) {
      const { indicatorMap, keyValue } = props;
      const curObj = indicatorMap[keyValue];
      const str =
        '目标值' + operatorObj[curObj.operator] + curObj.targetValue + '%';
      return str;
    }
  };
  const showPercentSign = [
    'compute_shop_liable_cancel_rate_by_seller_s14d_e8d',
    'compute_non_fbt_late_dispatch_s7d_e1d',
    'Seller_NRR.seller_fault_negative_review_rate_temp',
    'Seller_NRR.seller_service_issue_negative_review_rate_temp',
    'compute_shop_liable_return_rate_by_seller_s60d_e30d'
  ];
  const getPercentSign = () => {
    const { indicatorMap, keyValue } = props;
    const curObj = indicatorMap[keyValue];
    if (
      showPercentSign.includes(props.keyValue) &&
      curObj.value !== null &&
      curObj.value !== undefined
    )
      return '%';
  };
</script>

<style lang="scss" scoped>
  .red_color {
    color: var(--chat-primary);
  }
  .orange_color {
    color: #fb9902;
  }
  .danger_color {
    color: #bb6528;
  }
  .ml {
    margin-left: 10;
  }
</style>
