import { transferDate } from '@/utils/common';
export const ADS_COLS = [
  {
    type: 'checkbox',
    width: 60
  },
  {
    field: 'storeInfo',
    title: '店铺信息',
    width: 120,
    showHeaderOverflow: false,
    slots: {
      default: 'store_info_default'
    }
  },
  {
    field: 'merchant',
    title: 'GP',
    showHeaderOverflow: false,
    titlePrefix: { message: '店铺所属营业执照' },
    slots: {
      default: 'merchant_default'
    }
  },
  {
    field: 'personInfo',
    title: '人员信息',
    width: 100,
    showHeaderOverflow: false,
    slots: {
      default: 'person_info_default'
    }
  },
  {
    field: 'syncTime',
    title: '同步时间',
    minWidth: 80,
    showHeaderOverflow: false,
    formatter: ({ cellValue }) => (cellValue ? transferDate(cellValue) : '')
  },
  {
    field: 'autoTopUp',
    title: '是否自动充值',
    showHeaderOverflow: false,
    width: 60,
    formatter: ({ cellValue }) =>
      cellValue !== undefined ? (cellValue ? '是' : '否') : ''
  },
  {
    field: 'balance',
    title: '广告余额',
    showHeaderOverflow: false,
    sortable: true,
    formatter: ({ cellValue }) => cellValue,
    slots: {
      header: 'balance_header'
    }
  },
  {
    field: 'expense',
    title: '广告成本',
    showHeaderOverflow: false,
    sortable: true,
    slots: {
      header: 'expense_header',
      default: 'expense_default'
    }
  },
  {
    field: 'shopOrderCount',
    title: '店铺订单',
    sortable: true,
    showHeaderOverflow: false,
    slots: {
      default: 'shop_order_count_default'
    }
  },
  {
    field: 'directOrder',
    title: '广告订单数',
    sortable: true,
    showHeaderOverflow: false,
    slots: {
      default: 'direct_order_default'
    }
  },
  {
    field: 'broadOrder',
    title: '广告引流订单数',
    sortable: true,
    showHeaderOverflow: false,
    slots: {
      default: 'broad_order_default'
    }
  },
  {
    field: 'expensePerOrder',
    title: '广告均单成本',
    sortable: true,
    showHeaderOverflow: false,
    slots: {
      header: 'expense_per_order_header',
      default: 'expense_per_order_default'
    }
  },
  {
    field: 'clicks',
    title: '点击数',
    showHeaderOverflow: false,
    sortable: true,
    slots: {
      default: 'clicks_default'
    }
  },
  {
    field: 'impression',
    title: '浏览数',
    sortable: true,
    showHeaderOverflow: false,
    slots: {
      default: 'impression_default'
    }
  },
  {
    field: 'ctr',
    title: 'CTR点击率',
    sortable: true,
    showHeaderOverflow: false,
    slots: {
      default: 'ctr_default'
    }
  },
  {
    field: 'shopSalesVolume',
    title: 'GMV店铺销售金额',
    showHeaderOverflow: false,
    sortable: true,
    slots: {
      header: 'shop_sales_volume_header',
      default: 'shop_sales_volume_default'
    }
  },
  {
    field: 'directGmv',
    title: 'GMV广告销售金额',
    showHeaderOverflow: false,
    sortable: true,
    slots: {
      header: 'direct_gmv_header',
      default: 'direct_gmv_default'
    }
  },
  {
    field: 'costPerConversion',
    title: '广告投入产出比',
    sortable: true,
    showHeaderOverflow: false,
    slots: {
      default: 'cost_per_conversion_default'
    }
  },
  {
    field: 'shopProfit',
    title: '店铺利润',
    showHeaderOverflow: false,
    sortable: true,
    slots: {
      header: 'shop_profit_header',
      default: 'shop_profit_default'
    }
  },
  {
    field: 'profitExpenseRate',
    title: '店铺利润投资比',
    showHeaderOverflow: false,
    sortable: true,
    slots: {
      default: 'profit_expense_rate_default'
    }
  }
];
