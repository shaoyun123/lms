const basicStartCols = [
  {
    type: 'checkbox',
    width: 60
  },
  {
    field: 'status',
    title: '状态',
    width: 90,
    slots: {
      default: 'status_default'
    }
  },
  {
    field: 'autoReplyType',
    title: '自动回复类型',
    width: 110,

    slots: {
      default: 'autoReplyType_default'
    }
  },
  {
    field: 'salesSite',
    title: '站点',
    width: 100,
    slots: {
      default: 'salesSite_default'
    }
  }
];
const basicEndCols = [
  {
    title: '操作',
    pinned: 'right',
    width: 130,
    slots: {
      default: 'toolbar_default'
    }
  }
];
export const BasicColObj = {
  1: [
    ...basicStartCols,
    {
      field: 'storeCount',
      title: '应用店铺数',
      width: 100,
      slots: {
        default: 'storeCount_default'
      }
    },
    {
      field: 'deadlineDays',
      title: '截止天数',
      width: 100
    },
    {
      field: 'orderStatusList',
      title: '仓库订单状态',
      width: 200,
      formatter: ({ row }) =>
        (row.orderStatusList || []).map((item) => item.orderStatus).join()
    },
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'sendVoucher',
      title: '店铺优惠券发送',
      width: 120,
      slots: {
        default: 'sendVoucher_default'
      }
    },
    {
      field: 'creator',
      title: '创建人',
      width: 100
    },
    ...basicEndCols
  ],
  2: [
    ...basicStartCols,
    {
      field: 'storeCount',
      title: '应用店铺数',
      width: 100,
      slots: {
        default: 'storeCount_default'
      }
    },
    {
      field: 'deadlineDays',
      title: '延迟天数'
    },
    {
      field: 'orderStatusList',
      title: '仓库订单状态',
      formatter: ({ row }) =>
        (row.orderStatusList || []).map((item) => item.orderStatus).join()
    },
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'sendVoucher',
      title: '店铺优惠券发送',
      slots: {
        default: 'sendVoucher_default'
      }
    },
    {
      field: 'creator',
      title: '创建人'
    },
    ...basicEndCols
  ],
  3: [
    ...basicStartCols,
    {
      field: 'storeCount',
      title: '应用店铺数',
      width: 100,
      slots: {
        default: 'storeCount_default'
      }
    },
    {
      field: 'emptyComment',
      title: '评论内容是否为空',
      formatter: ({ row }) => (row.emptyComment ? '是' : '否')
    },
    {
      field: 'ratingStar',
      title: '评论星星数'
    },
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'sendVoucher',
      title: '店铺优惠券发送',
      slots: {
        default: 'sendVoucher_default'
      }
    },
    {
      field: 'creator',
      title: '创建人'
    },
    ...basicEndCols
  ],
  4: [
    ...basicStartCols,
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'operator',
      title: '操作人',
      slots: {
        default: 'operator_default'
      }
    },
    ...basicEndCols
  ],
  5: [
    ...basicStartCols,
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'operator',
      title: '操作人',
      slots: {
        default: 'operator_default'
      }
    },
    ...basicEndCols
  ],
  6: [
    ...basicStartCols,
    {
      field: 'orderCnAmountGte',
      title: '订单金额≥',
      formatter: ({ row }) =>
        row.orderCnAmountGte !== undefined && row.orderCnAmountGte !== null
          ? row.orderCnAmountGte + ' ¥'
          : ''
    },
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'sendVoucher',
      title: '店铺优惠券发送',
      slots: {
        default: 'sendVoucher_default'
      }
    },
    {
      field: 'operator',
      title: '操作人',
      slots: {
        default: 'operator_default'
      }
    },
    ...basicEndCols
  ],
  7: [
    ...basicStartCols,
    {
      field: 'storeCount',
      title: '应用店铺数',
      width: 100,
      slots: {
        default: 'storeCount_default'
      }
    },
    {
      field: 'orderStatusList',
      title: 'OA订单状态',
      formatter: ({ row }) =>
        (row.orderProcessStatusEnumList || []).map((item) => item.name).join()
    },
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'sendVoucher',
      title: '店铺优惠券发送',
      slots: {
        default: 'sendVoucher_default'
      }
    },
    {
      field: 'operator',
      title: '操作人',
      slots: {
        default: 'operator_default'
      }
    },
    ...basicEndCols
  ],
  8: [
    ...basicStartCols,
    {
      field: 'storeCount',
      title: '应用店铺数',
      width: 100,
      slots: {
        default: 'storeCount_default'
      }
    },
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'sendVoucher',
      title: '店铺优惠券发送',
      slots: {
        default: 'sendVoucher_default'
      }
    },
    {
      field: 'operator',
      title: '操作人',
      slots: {
        default: 'operator_default'
      }
    },
    ...basicEndCols
  ],
  9: [
    ...basicStartCols,
    {
      field: 'storeCount',
      title: '应用店铺数',
      width: 100,
      slots: {
        default: 'storeCount_default'
      }
    },
    {
      field: 'platOrderStatus',
      title: '平台订单状态'
    },
    {
      field: 'orderStatusList',
      title: '买家拒绝次数',
      formatter: ({ row }) => {
        const buyerRejectNumberList = row.buyerRejectNumber.split(',').sort();
        const buyerRejectNumberStr = buyerRejectNumberList
          .map((item) => (item === 9999 ? '5次以上' : item))
          .join();
        return buyerRejectNumberStr;
      }
    },
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'sendVoucher',
      title: '店铺优惠券发送',
      slots: {
        default: 'sendVoucher_default'
      }
    },
    {
      field: 'operator',
      title: '操作人',
      slots: {
        default: 'operator_default'
      }
    },
    ...basicEndCols
  ],
  10: [
    ...basicStartCols,
    {
      field: 'storeCount',
      title: '应用店铺数',
      width: 100,
      slots: {
        default: 'storeCount_default'
      }
    },
    {
      field: 'logisticsStatus',
      title: '仓库订单状态',
      formatter: ({ row }) =>
        (row.orderStatusList || []).map((item) => item.orderStatus).join() +
        '<br>包含' +
        row.logisticsDescription
    },
    {
      field: 'orderStatusList',
      title: '买家拒绝次数',
      formatter: ({ row }) => {
        const buyerRejectNumberList = row.buyerRejectNumber.split(',').sort();
        const buyerRejectNumberStr = buyerRejectNumberList
          .map((item) => (item === 9999 ? '5次以上' : item))
          .join();
        return buyerRejectNumberStr;
      }
    },
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'sendVoucher',
      title: '店铺优惠券发送',
      slots: {
        default: 'sendVoucher_default'
      }
    },
    {
      field: 'operator',
      title: '操作人',
      slots: {
        default: 'operator_default'
      }
    },
    ...basicEndCols
  ],
  11: [
    ...basicStartCols,
    {
      field: 'storeCount',
      title: '应用店铺数',
      width: 100,
      slots: {
        default: 'storeCount_default'
      }
    },
    {
      field: 'logisticsStatus',
      title: '仓库订单状态',
      formatter: ({ row }) =>
        (row.orderStatusList || []).map((item) => item.orderStatus).join() +
        '<br>包含' +
        row.logisticsDescription
    },
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_default'
      }
    },
    {
      field: 'sendVoucher',
      title: '店铺优惠券发送',
      slots: {
        default: 'sendVoucher_default'
      }
    },
    {
      field: 'operator',
      title: '操作人',
      slots: {
        default: 'operator_default'
      }
    },
    ...basicEndCols
  ],
  12: [
    ...basicStartCols,
    {
      field: 'storeCount',
      title: '应用店铺数',
      width: 100,
      slots: {
        default: 'storeCount_default'
      }
    },
    {
      field: 'platOrderStatus',
      title: '平台订单状态'
    },
    {
      field: 'sendIntervalValue',
      title: '发送次数及间隔',
      formatter: ({ row }) =>
        `${row.sameOrderSendNum}次\n每次u间隔时长：${row.sendIntervalValue}${row.sendIntervalValueType}`
    },
    {
      field: 'verbalTrick',
      title: '话术',
      slots: {
        default: 'verbalTrick_cod_default'
      }
    },
    {
      field: 'sendVoucher',
      title: '店铺优惠券发送',
      slots: {
        default: 'sendVoucher_default'
      }
    },
    {
      field: 'operator',
      title: '操作人',
      slots: {
        default: 'operator_default'
      }
    },
    ...basicEndCols
  ]
};
