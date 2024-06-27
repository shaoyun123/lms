/*
 * @Author: ztao
 * @Date: 2023-03-08 10:40:07
 * @LastEditTime: 2023-09-20 09:55:34
 * @Description:
 */
const currentOrigin = import.meta.env.VITE_APP_ORIGIN_LMS;
/** 缓存数据时用到的 Key */
class CacheKey {
  static TOKEN = `SESSION`;
  static externalLinkArr = [
    // {
    //   name: 'shopee聊天',
    //   path: currentOrigin + '/chatui/#/shopeeChat'
    // },
    // {
    //   name: 'Lazada聊天',
    //   path: currentOrigin + '/chatui/'
    // },
    {
      name: '货架规划',
      path: currentOrigin + '/lms/static/shelfplanning/index.html'
    },
    {
      name: '数据可视化',
      path: currentOrigin + '/lms/static/datavisual/index.html'
    }
  ];
  static externalLinkTitle = [
    // 'shopee聊天',
    // 'Lazada聊天',
    '货架规划',
    '数据可视化'
  ];
  // 物流模板类型 ---改为掉接口
  // static ORDER_PRINT_TPL_ENUM = {
  //   ORDER_LOGISTICS: '直邮物流',
  //   SKU_LABEL: 'SKU标签',
  //   LOCATION_LABEL: '库位标签',
  //   AU_INVOICE: '澳洲发票',
  //   TRANSFER_ORDER: '调拨单'
  // };
  // 使用缩略图的url
  // 所有https://imghz.epean.com.cn/ 、https://img.epean.com.cn/,https://img.test.epean.cn/ 域名  都要使用缩略图
  static THUMBNAIL_URL_ENUM = [
    '//imghz.epean.com.cn/',
    '//img.epean.com.cn/',
    '//img.test.epean.cn/'
  ];
}

export default CacheKey;
