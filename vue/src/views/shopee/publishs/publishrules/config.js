export const MAIN_COLS = [
  {
    type: 'checkbox',
    width: 60
  },
  {
    field: 'status',
    title: '状态',
    width: 80,
    slots: {
      default: 'status_default'
    }
  },
  {
    field: 'id',
    title: '规则ID',
    width: 80
  },
  {
    field: 'ruleName',
    title: '规则名称',
    minWidth: 120
  },
  {
    field: 'saleSite',
    title: '站点',
    width: 100
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
    field: 'executionWeekTime',
    title: '刊登时间',
    minWidth: 120,
    slots: {
      default: 'executionWeekTime_default'
    }
    // width: 150
  },
  // {
  //   field: 'categoryLevelAndName',
  //   title: 'OA类目(弃)',
  //   width: 300,
  //   slots: {
  //     default: 'category_level_name_default'
  //   }
  // },
  // {
  //   field: 'categoryLevelAndCategoryIdCnsc',
  //   title: 'CNSC类目ID',
  //   slots: {
  //     default: 'category_level_and_category_id_default'
  //   }
  // },
  {
    field: 'categoryLevelAndNameCnsc',
    title: 'CNSC类目',
    width: 300,
    slots: {
      default: 'category_level_name_cnsc_default'
    }
  },
  {
    field: 'remark',
    title: '备注',
    minWidth: 80,
    slots: {
      default: 'remark_default'
    }
  },
  { field: 'creator', title: '创建人', width: 100 },
  {
    field: 'modifier',
    title: '修改人',
    width: 100
  },
  {
    title: '操作',
    width: 150,
    slots: {
      default: 'toolbar_default'
    }
  }
];
export const DEL_COLS = [
  {
    field: 'status',
    title: '状态',
    width: 80,
    slots: {
      default: 'status_default'
    }
  },
  {
    field: 'id',
    title: '规则ID',
    width: 80
  },
  {
    field: 'ruleName',
    title: '规则名称',
    minWidth: 120
  },
  {
    field: 'saleSite',
    title: '站点',
    width: 100
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
    field: 'executionWeekTime',
    title: '刊登时间',
    minWidth: 120,
    slots: {
      default: 'executionWeekTime_default'
    }
    // width: 150
  },
  // {
  //   field: 'categoryLevelAndName',
  //   title: 'OA类目(弃)',
  //   width: 300,
  //   slots: {
  //     default: 'category_level_name_default'
  //   }
  // },
  // {
  //   field: 'categoryLevelAndCategoryIdCnsc',
  //   title: 'CNSC类目ID',
  //   slots: {
  //     default: 'category_level_and_category_id_default'
  //   }
  // },
  {
    field: 'categoryLevelAndNameCnsc',
    title: 'CNSC类目',
    width: 300,
    slots: {
      default: 'category_level_name_cnsc_default'
    }
  },
  {
    field: 'remark',
    title: '备注',
    minWidth: 80,
    slots: {
      default: 'remark_default'
    }
  },
  { field: 'creator', title: '创建人', width: 100 },
  {
    field: 'modifier',
    title: '修改人',
    width: 100
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

export const PUBLISH_MONTH_ENUM = [
  { label: '1月', value: 1 },
  { label: '2月', value: 2 },
  { label: '3月', value: 3 },
  { label: '4月', value: 4 },
  { label: '5月', value: 5 },
  { label: '6月', value: 6 },
  { label: '7月', value: 7 },
  { label: '8月', value: 8 },
  { label: '9月', value: 9 },
  { label: '10月', value: 10 },
  { label: '11月', value: 11 },
  { label: '12月', value: 12 }
];

export const ORDER_FIELD = [
  { label: '审核时间倒序', value: 1 },
  { label: '审核时间正序', value: 2 },
  { label: '7天销量倒序', value: 3 },
  { label: '30天销量倒序', value: 4 }
];

export const DEFAULT_TEXT_LINE = 3;

export const DOWNLOAD_TPL_URL =
  '/lms/static/templet/ShopeeListingRuleStoreTemplate.xlsx';

export const DOWNLOAD_RULES_TPL_URL =
  '/lms/static/templet/shopee批量导入模板刊登规则.xlsx';
