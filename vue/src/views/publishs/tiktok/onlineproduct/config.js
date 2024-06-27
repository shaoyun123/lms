import { debounce } from 'lodash-es';

export const STATUS_ENUM = {
  DRAFT: '草稿',
  PENDING: '审核中',
  FAILED: '审核失败',
  LIVE: '在线',
  SELLER_DEACTIVATED: '卖家下架',
  PLATFORM_DEACTIVATED: '平台下架',
  FREEZE: '已冻结',
  DELETED: '已删除'
};

export const ORDER_TYPE_ENUM = [
  '刊登时间正序',
  '刊登时间倒序',
  '本地展示价降序',
  '本地展示价升序'
];

export const SALE_ENUM = [
  {
    label: '7日销量',
    value: 7
  },
  {
    label: '30日销量',
    value: 30
  },
  {
    label: '60日销量',
    value: 60
  },
  {
    label: '90日销量',
    value: 90
  },
  {
    label: '180日销量',
    value: 180
  },
  {
    label: '365日销量',
    value: 365
  },
  {
    label: '7日全球销量',
    value: -7
  },
  {
    label: '30日全球销量',
    value: -30
  },
  {
    label: '60日全球销量',
    value: -60
  },
  {
    label: '90日全球销量',
    value: -90
  },
  {
    label: '180日全球销量',
    value: -180
  },
  {
    label: '365日全球销量',
    value: -365
  }
];

export const ORDER_TYPE_CONTENT_ENUM = [
  {
    label: '刊登时间',
    value: 1
  },
  {
    label: '本地展示价',
    value: 2
  },
  {
    label: '7天销量',
    value: 3
  },
  {
    label: '30天销量',
    value: 4
  },
  {
    label: '60天销量',
    value: 5
  },
  {
    label: '90天销量',
    value: 6
  },
  {
    label: '180天销量',
    value: 7
  },
  {
    label: '365天销量',
    value: 8
  },
  {
    label: '选中在线product标签添加天数',
    value: 9
  }
];

/**
 * @description: 将操作结果置空
 * @param {*} row 表格的行数据
 * @return {*}
 */
export const handleResetResult = debounce((row) => {
  if (row.result) {
    row.result = '';
  }
}, 1000);

/**
 * @description: 通过运算符计算
 * @param {*} calculType 运算符
 * @param {*} calculNum 填写的值
 * @param {*} originVal 基础值
 * @return {*}
 */
export const calculateBasicOperator = (calculType, calculNum, originVal) => {
  if (calculType === '+') {
    return originVal + calculNum;
  } else if (calculType === '-') {
    return originVal - calculNum;
  } else if (calculType === '*') {
    return originVal * calculNum;
  } else if (calculType === '=') {
    return calculNum;
  } else if (calculType === '/') {
    return originVal / calculNum;
  }
};

// export const refresh=(){}
