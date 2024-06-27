export const MAIN_COLS = [
  {
    type: 'checkbox',
    width: 60
  },
  {
    field: 'status',
    title: '状态',
    slots: {
      default: 'status_default'
    }
  },
  {
    field: 'id',
    title: '规则ID'
  },
  {
    field: 'ruleName',
    title: '规则名称'
  },
  {
    field: 'storeNums',
    title: '应用店铺数量',
    width: 100,
    slots: {
      default: 'store_nums_default'
    }
  },
  {
    field: 'dayOfWeekListStr',
    title: '执行日期（每周）',
    slots: {
      default: 'execution_week_time_default'
    }
  },
  {
    field: 'operator',
    title: '创建人/修改人',
    slots: {
      default: 'operator_default'
    }
  },
  {
    field: 'remark',
    title: '备注',
    slots: {
      default: 'remark_default'
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

export const PUBLISH_WEEK_TIME = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 0 }
];

export const ORDER_FIELD = [
  { label: '审核时间倒序', value: 1 },
  { label: '审核时间正序', value: 2 },
  { label: ' 全平台7天销量倒序', value: 3 },
  { label: ' 全平台30天销量倒序', value: 4 },
  { label: '西班牙7天销量倒序', value: 5 },
  { label: '西班牙30天销量倒序', value: 6 }
];

export const DEFAULT_TEXT_LINE = 3;

export const DOWNLOAD_TPL_URL =
  '/lms/static/templet/ShopeeListingRuleStoreTemplate.xlsx';
