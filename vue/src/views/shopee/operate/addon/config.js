// 排序
export const ORDERBY_LIST = [
  {
    label: '开始时间升序',
    value: 1
  },
  {
    label: '开始时间降序',
    value: 2
  },
  {
    label: '结束时间升序',
    value: 3
  },
  {
    label: '结束时间降序',
    value: 4
  }
];

// 优惠方式
export const PREFERENTIAL_WAY = [
  {
    label: '加购折扣',
    value: 0
  },
  {
    label: '赠品满最低消费',
    value: 1
  }
];

// 下载模板
export const DOWNLOAD_TPL_LIST = [
  {
    label: '新增-加购折扣',
    value: '1',
    uploadUrl: '/api/lms/shopee/addOneDeal/importCreate',
    fileName: '新增-加购折扣-模板.xlsx',
    data: { promotionType: 0 }
  },
  {
    label: '新增-赠品满最低消费',
    value: '2',
    uploadUrl: '/api/lms/shopee/addOneDeal/importCreate',
    fileName: '新增-赠品满最低消费-模板.xlsx',
    data: { promotionType: 1 }
  },
  {
    label: '修改-加购折扣',
    value: '3',
    uploadUrl: '/api/lms/shopee/addOneDeal/importUpdate',
    fileName: '修改-加购折扣-模板.xlsx',
    data: { promotionType: 0 }
  },
  {
    label: '修改-赠品满最低消费',
    value: '4',
    uploadUrl: '/api/lms/shopee/addOneDeal/importUpdate',
    fileName: '修改-赠品满最低消费-模板.xlsx',
    data: { promotionType: 1 }
  }
];

//编辑弹窗类型
export const EDit_TYPE_OBJ = {
  add: '新增加购优惠',
  edit: '修改加购优惠',
  copy: '复制加购优惠'
};

export const DEFAULT_TIME = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 1, 1, 23, 59, 59)
];
