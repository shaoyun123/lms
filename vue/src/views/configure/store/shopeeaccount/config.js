export const SyncStatusList = [
  { value: 1, label: '初始' },
  { value: 2, label: '同步中' },
  { value: 3, label: '成功' },
  { value: 4, label: '失败' }
];

export const PublistTimeList = [
  { value: 30, label: '30天' },
  { value: 50, label: '50天' },
  { value: 60, label: '60天' }
];

export const PreConfigStatusList = [
  { value: 1, label: '已开启' },
  { value: 0, label: '已取消' },
  { value: 2, label: '已暂停' }
];

export const StatusList = [
  { value: true, label: '已开启' },
  { value: false, label: '已关闭' }
];

export const DownLoadTplList = [
  {
    label: '新增店铺',
    value: 'addStore',
    href: '/lms/static/templet/addShopeeStoreTemplate.xlsx'
  },
  {
    label: '修改店铺',
    value: 'editStore',
    href: '/lms/static/templet/shopeeBatchImportUpdateTemplate.xlsx'
  },
  {
    label: '授权信息',
    value: 'authInfo',
    href: '/lms/static/templet/shopeeStoreAuthInfoTemplate.xlsx'
  },
  {
    label: '店铺预售规则配置',
    value: 'newPresaleTpl',
    href: ''
  }
];

export const Columns = [
  { type: 'checkbox', width: 30 },
  {
    field: 'storeAcct',
    title: '店铺名称',
    width: 120,
    slots: {
      default: 'storeAcct_default'
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
    field: 'shopIsMall',
    title: 'mall店铺',
    width: 80,
    slots: {
      default: 'shopIsMall_default'
    }
  },
  {
    field: 'shippingWarehouseName',
    title: '发货仓库',
    width: 80
  },
  {
    field: 'brand',
    title: '品牌',
    width: 80
  },
  {
    field: 'grossRate',
    title: '毛利率',
    width: 80
  },
  {
    field: 'personInfo',
    title: '人员信息',
    width: 100,
    slots: {
      default: 'personInfo_default'
    }
  },
  {
    field: 'status',
    title: '店铺状态',
    width: 75,
    slots: {
      default: 'status_default'
    }
  },
  {
    field: 'authTime',
    title: '授权到期日期',
    width: 140,
    slots: {
      default: 'authTime_default'
    }
  },
  {
    field: 'listingLimit',
    title: 'Listing额度',
    width: 150,
    slots: {
      default: 'listingLimit_default'
    }
  },
  {
    field: 'shopeePreOrderConfigStatus',
    title: '预售',
    width: 65,
    slots: {
      default: 'shopeePreOrderConfigStatus_default'
    }
  },
  {
    field: 'autoPublishCateIds',
    title: '自动删除',
    width: 80,
    slots: {
      default: 'autoPublishCateIds_default'
    }
  },
  {
    field: 'autoUploadVideo',
    title: '自动上传视频',
    width: 100,
    slots: {
      default: 'autoUploadVideo_default'
    }
  },
  {
    field: 'sexyImgFilter',
    title: '性感图片过滤',
    width: 100,
    slots: {
      default: 'sexyImgFilter_default'
    }
  },
  {
    field: 'syncStatus',
    title: '同步lisiting状态',
    width: 140,
    slots: {
      default: 'syncStatus_default'
    }
  },
  {
    field: 'syncDesc',
    title: '同步异常备注',
    slots: {
      default: 'syncDesc_default'
    }
  },
  {
    field: 'remark',
    title: '备注'
  },
  {
    title: '操作',
    width: 90,
    slots: {
      default: 'tool_default'
    }
  }
];
