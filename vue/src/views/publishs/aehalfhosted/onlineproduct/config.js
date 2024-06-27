import { debounce } from 'lodash-es';

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

export const PRODUCT_ORDER = [
  {
    label: '刊登时间正序',
    value: 1
  },
  {
    label: '刊登时间倒序',
    value: 2
  },
  {
    label: '义乌仓库存可售正序',
    value: 3
  },
  {
    label: '义乌仓库存可售倒序',
    value: 4
  },
  {
    label: '7天销量正序',
    value: 5
  },
  {
    label: '7天销量倒序',
    value: 6
  },
  {
    label: '30天销量正序',
    value: 7
  },
  {
    label: '30天销量倒序',
    value: 8
  },
  {
    label: '60天销量正序',
    value: 9
  },
  {
    label: '60天销量倒序',
    value: 10
  },
  {
    label: '90天销量正序',
    value: 11
  },
  {
    label: '90天销量倒序',
    value: 12
  },
  {
    label: '180天销量正序',
    value: 13
  },
  {
    label: '180天销量倒序',
    value: 14
  }
];

/**
 * 排序(待加入tab)
 */

export const WAITINGJOIN_ORDER = [
  {
    label: '义乌仓库可售',
    value: 2
  },
  {
    label: '7天销量(速卖通)',
    value: 3
  },
  {
    label: '30天销量(速卖通)',
    value: 4
  },
  {
    label: '60天销量(速卖通)',
    value: 5
  },
  {
    label: '90天销量(速卖通)',
    value: 6
  },
  {
    label: '180天销量(速卖通)',
    value: 7
  },
  {
    label: '7天销量(公司)',
    value: 8
  },
  {
    label: '30天销量(公司)',
    value: 9
  },
  {
    label: '60天销量(公司)',
    value: 10
  },
  {
    label: '90天销量(公司)',
    value: 11
  },
  {
    label: '180天销量(公司)',
    value: 12
  },
  {
    label: '7天销量(美国)',
    value: 13
  },
  {
    label: '30天销量(美国)',
    value: 14
  },
  {
    label: '60天销量(美国)',
    value: 15
  },
  {
    label: '90天销量(美国)',
    value: 16
  },
  {
    label: '180天销量(美国)',
    value: 17
  }
];
