import request from '@/utils/request';

// 通过商品sku查询模板父sku
export const queryProdTempPSkuBySSkuApi = (data) =>
  request({
    url: '/lms/prodBrand/queryProdTempPSkuBySSku',
    method: 'POST',
    data
  });

// 渐进式搜索店铺接口
export const queryAllPossibleStoreAcctApi = (data) =>
  request({
    url: '/lms/prodBrand/queryAllPossibleStoreAcct',
    method: 'POST',
    data
  });

// 新增品牌授权
export const saveBrandAuthorizationApi = (data) =>
  request({
    url: '/lms/prodBrand/saveBrandAuthorization',
    method: 'POST',
    loading: true,
    data
  });

// 品牌授权详情
export const queryProdBrandDetailApi = (data) =>
  request({
    url: '/lms/prodBrand/queryProdBrandDetail',
    method: 'POST',
    loading: true,
    data
  });
// 编辑品牌授权
export const editBrandAuthorizationApi = (data) =>
  request({
    url: '/lms/prodBrand/editBrandAuthorization',
    method: 'POST',
    loading: true,
    data
  });

// 获取所有平台名称枚举
export const queryAllPlatNameApi = (data) =>
  request({
    url: '/lms/prodBrand/queryAllPlatName',
    method: 'POST',
    data
  });

// 查询所有创建人
export const queryAllCreatorApi = (data) =>
  request({
    url: '/lms/prodBrand/queryAllCreator',
    method: 'POST',
    data
  });

// 查询列表
export const prodBrandQueryByConditionApi = (data) =>
  request({
    url: '/lms/prodBrand/ProdBrandQueryByCondition',
    method: 'POST',
    loading: true,
    data
  });
