export const MAIN_COLS = [
  // {
  //   type: 'checkbox',
  //   width: 60
  // },
  {
    field: 'titleEn',
    title: '活动名称'
  },
  {
    field: 'actionStatus',
    title: '活动状态',
    slots: {
      default: 'actionStatus_default'
    }
  },
  {
    field: 'storeAcct',
    title: '店铺/销售',
    slots: {
      default: 'storeAcct_default'
    }
  },
  {
    field: 'executionWeekTime',
    title: '开始日期/结束日期',
    slots: {
      default: 'execution_week_time_default'
    }
  },
  {
    field: 'freezeDate',
    title: '暂停日期',
    slots: {
      header: 'freezeDate_header',
      default: 'freezeDate_default'
    }
  },
  {
    field: 'participatingProductsCount',
    title: '已添加商品数',
    slots: {
      default: 'participatingProductsCount_default'
    }
  },
  {
    field: 'potentialProductsCount',
    title: '可添加商品数',
    slots: {
      default: 'potentialProductsCount_default'
    }
  },
  {
    title: '操作',
    width: 150,
    slots: {
      default: 'toolbar_default'
    }
  }
];
export const LAYER_COLS = [
  {
    type: 'checkbox',
    width: 40
  },
  {
    field: 'image',
    title: '图片',
    width: 100,
    slots: {
      default: 'image_default'
    }
  },
  {
    field: 'offerId',
    title: '货号/物品号',
    slots: {
      default: 'offerId_default'
    }
  },
  {
    field: 'name',
    title: '标题/类目',
    slots: {
      default: 'name_default'
    }
  },
  {
    field: 'oldPrice',
    title: '折扣前价格/当前价格',
    slots: {
      default: 'oldPrice_default'
    }
  },
  {
    field: 'realDiscount',
    title: '促销价格/实际促销折扣(%)',
    slots: { header: 'realDiscount_header', default: 'realDiscount_default' }
  },
  {
    field: 'discount',
    title: '后台促销折扣(%)',
    slots: {
      header: 'discount_header',
      default: 'discount_default'
    }
  },
  {
    field: 'actionPrice',
    title: '折扣价格',
    width: 120,
    slots: {
      header: 'actionPrice_header',
      default: 'actionPrice_default'
    }
  },
  {
    field: 'stock',
    title: '促销库存',
    width: 120,
    slots: {
      default: 'stock_default'
    }
  },
  {
    field: 'quantity',
    title: '平台库存',
    width: 120
  },
  {
    title: '操作',
    width: 70,
    slots: {
      default: 'toolbar_default'
    }
  }
];
export const CURRENCY = {
  CNY: '￥',
  USD: '$'
};
