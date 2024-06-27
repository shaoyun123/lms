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

export const GOODS_CERTIFICATION = [
  {
    key: 'cosmetics_PIF',
    value: '化妆品PIF文件'
  },
  {
    key: 'CPNP_notification',
    value: 'CPNP通报证明'
  },
  {
    key: 'ECE_certification',
    value: 'ECE证书图片'
  },
  {
    key: 'EU_FCM_testing_report',
    value: '欧盟食品接触材料检测报告'
  },
  {
    key: 'item_EU_CE_certificate',
    value: 'CE认证'
  },
  {
    key: 'item_stock_photo',
    value: '商品库存实拍图'
  },
  {
    key: 'item_testing_report',
    value: '检测报告'
  },
  {
    key: 'Package_Label_Photo_EU',
    value: '外包装/标签实拍图-欧盟'
  },
  {
    key: 'REACH_testing_report',
    value: 'REACH检测报告'
  },
  {
    key: 'RoHS_testing_report',
    value: 'RoHS检测报告'
  }
];
/**
 * 商品资质
 */
