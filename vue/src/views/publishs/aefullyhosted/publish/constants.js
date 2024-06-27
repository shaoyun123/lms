// #region   常量
export const MULTI_SEARCH_TYPE_ENUM = [
  { value: 'pSku', label: '父SKU' },
  { value: 'sSku', label: '子SKU' },
  { value: 'cnTitle', label: '中文标题' },
  { value: 'enTitle', label: '英文标题' }
];
export const IMG_STATUS_LIST = [
  { value: 1, label: '有图' },
  { value: 2, label: '部分' },
  { value: 3, label: '无图' }
];
export const ISSALES_LIST = [
  { value: 2, label: '在售' },
  { value: 1, label: '部分停售' },
  { value: 0, label: '停售' }
];
export const DEFAULT_FORMDATA = {
  storeAcctIds: [], // 店铺
  bizzOwnerId: '', // 开发专员
  searchTypeKey: 'pSku',
  searchTypeVal: '',
  isExactQuery: false,
  devType: '', // 开发类型
  isSales: [2], // 在售状态
  isSmtTort: false, //侵权状态
  isProhibit: null, //禁售状态
  isListing: false, //生成状态
  imgStatusList: [1, 2], //图片状态
  logisticsType: 1,
  logisAttrs: [],
  prodAttrList: '', // 商品标签
  cateId: '', //类目
  minWeight: '', //重量
  maxWeight: '',
  isIncludeStockAll: true, // 预计可用库存（含在途/不含在途
  stockMin: '',
  stockMax: '',
  orderByType: null, // 排序
  timeRangeKey: 'baseModelAuditTime', // 时间
  timeRangeVal: null,
  usefulVideo: null, //可用视频,
  listingCreatorId: '', //刊登创建人
  syncStatus: false, //刊登状态
  tplCreatorId: '', //模板创建人
  supplyPriceMin: '', // 供货价
  supplyPriceMax: '', // 供货价,
  purchaseCostPriceMin: '', //成本
  purchaseCostPriceMax: '', // 成本
  isAllStoreAcctNotPublish: '', // 全店铺刊登状态 默认 为空
  searchType: 3, // 预计可售天数 这个字段暂时写死
  stockAttrType: 1, // 预计可用库存部分属性 1 全部属性 2
  attrType: 1, // 预计可售天数部分属性 1 全部属性 2
  minDays: '',
  maxDays: ''
};
export const ORDERBY_TYPE_LIST = [
  { value: 1, label: '审核时间倒序' },
  { value: 2, label: '审核时间正序' },
  { value: 3, label: '创建时间倒序' },
  { value: 4, label: '创建时间正序' },
  { value: 5, label: 'SMT30天销量倒序' },
  { value: 7, label: '公司30天销量倒序' },
  { value: 9, label: 'shopee30天销量倒序' }
];
// 侵权状态 --列表
export const TORT_LIST_STATUS = [
  {
    label: '禁售',
    value: 'isListingAble'
  },
  {
    label: 'wish',
    value: 'isWishTort'
  },
  {
    label: 'joom',
    value: 'isJoomTort'
  },
  {
    label: 'ebay',
    value: 'isEbayTort'
  },
  {
    label: 'amazon',
    value: 'isAmazonTort'
  },
  {
    label: 'isSmtTort',
    value: 'smt'
  },
  {
    label: 'shopee',
    value: 'isShopeeTort'
  },
  {
    label: 'tophatter',
    value: 'isTophatterTort'
  }
];
// 列
export const TPL_COLUMNS = [
  { type: 'checkbox', width: 43 },
  {
    field: 'imageUrl',
    title: '缩略图',
    width: 100,
    slots: {
      default: 'default_pImage'
    }
  },
  {
    field: 'product',
    title: '商品',
    width: 220,
    slots: {
      default: 'default_product'
    }
  },
  {
    field: 'pSku',
    title: '父SKU',
    slots: {
      default: 'default_pSku'
    }
  },
  {
    field: 'subList',
    width: 580,
    resizable: false,
    slots: {
      header: 'header_subList',
      default: 'default_subList'
    }
  },
  {
    field: 'storeNum',
    title: '刊登状态',
    width: 80,
    slots: {
      default: 'default_storeNum'
    }
  },
  {
    field: 'salesNum',
    title: '销量',
    width: 80,
    slots: {
      default: 'default_salesNum'
    }
  },
  {
    field: 'devNote',
    width: 100,
    title: '开发备注'
  },
  {
    field: 'saleNote',
    width: 100,
    title: '销售备注',
    slots: {
      edit: 'edit_saleNote'
    },
    editRender: {}
  },
  {
    field: 'isTort',
    width: 110,
    title: '侵权状态',
    slots: {
      default: 'default_isTort'
    }
  },

  {
    field: 'time',
    width: 100,
    title: '时间',
    slots: {
      default: 'default_time'
    }
  },
  {
    field: 'toolbar',
    title: '操作',
    width: 105,
    slots: {
      default: 'default_toolbar'
    }
  }
];
export const LISTING_COLUMNS = [
  { type: 'checkbox', width: 43 },
  {
    field: 'imageUrl',
    title: '缩略图',
    width: 100,
    slots: {
      default: 'default_pImage'
    }
  },
  {
    field: 'title',
    title: '标题',
    slots: {
      default: 'default_title'
    }
  },
  {
    field: 'product',
    title: '商品名',
    slots: {
      default: 'default_publish_product'
    }
  },
  {
    field: 'bizzOwner',
    title: '开发专员',
    width: 80,
    slots: {
      default: 'default_bizzOwner'
    }
  },
  {
    field: 'prodPSku',
    title: '父SKU',
    width: 80,
    slots: {
      default: 'default_publish_prodPSku'
    }
  },
  {
    field: 'salesNum',
    title: '销量',
    width: 80,
    slots: {
      default: 'default_publish_salesNum'
    }
  },
  {
    field: 'subList',
    width: 600,
    resizable: false,
    slots: {
      header: 'header_publish_subList',
      default: 'default_publish_subList'
    }
  },
  {
    field: 'cateTreeName',
    width: 140,
    title: '类目'
  },
  {
    field: 'listingTime',
    width: 140,
    title: '时间',
    slots: {
      default: 'default_publish_time'
    }
  },
  {
    field: 'creator',
    width: 80,
    title: '创建人'
  },
  {
    field: 'toolbar',
    title: '操作',
    width: 100,
    slots: {
      default: 'default_toolbar'
    }
  }
];

export const MIN_UNIT_LIST = [
  { code: '100000000', name: '袋 (bag/bags)' },
  { code: '100000001', name: '桶 (barrel/barrels)' },
  { code: '100000002', name: '蒲式耳 (bushel/bushels)' },
  { code: '100078580', name: '箱 (carton)' },
  { code: '100078581', name: '厘米 (centimeter)' },
  { code: '100000003', name: '立方米 (cubic meter)' },
  { code: '100000004', name: '打 (dozen)' },
  { code: '100078584', name: '英尺 (feet)' },
  { code: '100000005', name: '加仑 (gallon)' },
  { code: '100000006', name: '克 (gram)' },
  { code: '100078587', name: '英寸 (inch)' },
  { code: '100000007', name: '千克 (kilogram)' },
  { code: '100078589', name: '千升 (kiloliter)' },
  { code: '100000008', name: '千米 (kilometer)' },
  { code: '100078559', name: '升 (liter/liters)' },
  { code: '100000009', name: '英吨 (long ton)' },
  { code: '100000010', name: '米 (meter)' },
  { code: '100000011', name: '公吨 (metric ton)' },
  { code: '100078560', name: '毫克 (milligram)' },
  { code: '100078596', name: '毫升 (milliliter)' },
  { code: '100078597', name: '毫米 (millimeter)' },
  { code: '100000012', name: '盎司 (ounce)' },
  { code: '100000014', name: '包 (pack/packs)' },
  { code: '100000013', name: '双 (pair)' },
  { code: '100000015', name: '件/个 (piece/pieces)' },
  { code: '100000016', name: '磅 (pound)' },
  { code: '100078603', name: '夸脱 (quart)' },
  { code: '100000017', name: '套 (set/sets)' },
  { code: '100000018', name: '美吨 (short ton)' },
  { code: '100078606', name: '平方英尺 (square feet)' },
  { code: '100078607', name: '平方英寸 (square inch)' },
  { code: '100000019', name: '平方米 (square meter)' },
  { code: '100078609', name: '平方码 (square yard)' },
  { code: '100000020', name: '吨 (ton)' },
  { code: '100078558', name: '码 (yard/yards)' }
];

export const MAX_IMAGE_LENGTH = 6;
// #endregion   常量
