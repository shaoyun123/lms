import request from '@/utils/request';

// 商品标签
export const listdict = (data) =>
  request({
    url: '/lms/sys/listdict.html',
    method: 'POST',
    data: data
  });
// 查询
export const getProducts = (data) =>
  request({
    url: '/lms/mercadoProducts/getProducts',
    method: 'POST',
    data: data
  });
// 导出价格
export const exportMercadoPriceInfo = (data) =>
  request({
    url: '/lms/mercadoProducts/exportMercadoPriceInfo.html',
    responseType: 'blob',
    loading: true,
    data: data
  });
// 计算价格
export const getPriceByItemIds = (data) =>
  request({
    url: '/lms/mercadoProducts/getPriceByItemIds',
    method: 'POST',
    data: data
  });
// 批量调价
export const mercadoUpdatePrices = (data) =>
  request({
    url: '/lms/mercadoProducts/mercadoUpdatePrices',
    method: 'POST',
    data: data
  });
// 按店铺调价上传excel
export const importUpdatePriceByStoreList = (data) =>
  request({
    url: '/lms/mercadoProducts/importUpdatePriceByStoreList',
    method: 'POST',
    data: data
  });
// 美客多在线商品下架需求
export const pausedProductStatus = (data) =>
  request({
    url: '/lms/mercadoProducts/pausedProductStatus',
    method: 'POST',
    data: data
  });
// 美客多在线商品删除
export const deleteProducts = (data) =>
  request({
    url: '/lms/mercadoProducts/deleteProducts',
    method: 'DELETE',
    data: data
  });
// 美客多在线日志
export const getProductLogs = (data) =>
  request({
    url: '/lms/mercadoProducts/getProductLogs',
    method: 'GET',
    params: data
  });
// 美客多更新listing批量
export const syncByItems = (data) =>
  request({
    url: '/lms/mercadoProducts/syncByItems',
    method: 'POST',
    data
  });
// 美客多更新listing单个
export const syncItem = (data) =>
  request({
    url: '/lms/mercadoProducts/syncItem',
    method: 'POST',
    data
  });
