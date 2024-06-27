// 常量
export const tabsName = [
  '基础模板',
  '待重新选品',
  '待选品审核',
  '选品成功',
  '选品失败',
  '待刊登审核',
  '刊登成功',
  '刊登失败'
];
export const itemsStatus = {
  // 数组第一项是查询时的页签标识，请求参数；第二项无用
  基础模板: [1, 0],
  待重新选品: [31, 1],
  待选品审核: [2, 2],
  选品成功: [3, 3],
  选品失败: [4, 4],
  待刊登审核: [5, 5],
  刊登成功: [7, 6],
  刊登失败: [6, 7]
};
export const tortPlatStatus = [
  { name: 'wish侵权', value: 'wish_true' },
  { name: 'wish不侵权', value: 'wish_false' },
  { name: 'ebay侵权', value: 'ebay_true' },
  { name: 'ebay不侵权', value: 'ebay_false' },
  { name: 'aliexpress侵权', value: 'aliexpress_true' },
  { name: 'aliexpress不侵权', value: 'aliexpress_false' },
  { name: 'joom侵权', value: 'joom_true' },
  { name: 'joom不侵权', value: 'joom_false' },
  { name: 'amazon侵权', value: 'amazon_true' },
  { name: 'amazon不侵权', value: 'amazon_false' },
  { name: 'shopee侵权', value: 'shopee_true' },
  { name: 'shopee不侵权', value: 'shopee_false' },
  { name: 'lazada侵权', value: 'lazada_true' },
  { name: 'lazada不侵权', value: 'lazada_false' },
  { name: 'mercado侵权', value: 'mercado_true' },
  { name: 'mercado不侵权', value: 'mercado_false' }
];

export const tortPlat = {
  wish: ['isWishTort', 'wishTortReason'],
  joom: ['isJoomTort', 'joomTortReason'],
  ebay: ['isEbayTort', 'ebayTortReason'],
  amazon: ['isAmazonTort', 'amazonTortReason'],
  smt: ['isSmtTort', 'smtTortReason'],
  shopee: ['isShopeeTort', 'shopeeTortReason'],
  lazada: ['isLazadaTort', 'lazadaTortReason']
};
/**
 * 1 模板审核时间倒序
 * 2 模板创建时间倒序
 * 3 30天销量倒序
 * 4 选品时间倒序
 */
export const tempOrderBy = {
  'p.audit_time desc': 1,
  'p.model_create_time desc': 2,
  'psc.sale_num desc': 3,
  _TIME: 4
};
