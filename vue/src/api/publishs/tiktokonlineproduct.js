import request from '@/utils/request';
import qs from 'qs';

// 查询店铺
export const getStoreListApi = () => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    data: qs.stringify({
      roleNames: 'tiktok专员',
      orgId: '',
      salePersonId: '',
      platCode: 'tiktok'
    })
  });
};

// 查询在线商品
export const getListApi = (data) => {
  return request({
    url: '/lms/tiktok/product/list',
    method: 'POST',
    data
  });
};

// 查询日志
export const getLogApi = (productId) => {
  return request({
    url: `/lms/tiktok/product/searchShopeeOnlineLog?productId=${productId}`
  });
};

// 获取库存信息
export const getStockInfoApi = (data) => {
  return request({
    url: `/lms/tiktok/listing/getStockInfo`,
    method: 'POST',
    data,
    loading: true
  });
};

// 批量修改库存
export const batchUpdateStockApi = (data) => {
  return request({
    url: '/lms/tiktok/listing/batchUpdateStock',
    method: 'POST',
    data
  });
};

// 批量上架
export const batchProductOnlineApi = (data) => {
  return request({
    url: '/lms/tiktok/product/batchActiveProducts',
    method: 'POST',
    data: qs.stringify(data)
  });
};
// 批量下架
export const batchProductOffApi = (data) => {
  return request({
    url: '/lms/tiktok/product/batchDeactiveProducts',
    method: 'POST',
    data: qs.stringify(data)
  });
};
// 批量删除
export const batchDelApi = (data) => {
  return request({
    url: '/lms/tiktok/product/batchDeleteGlobalProduct',
    method: 'POST',
    data
  });
};
export const searchBatchDelResultApi = (batchNo) => {
  return request({
    url: `/lms/tiktok/product/getBatchDeleteLocalProductResult/${batchNo}`
  });
};

// 调整税前价价格计算查询
export const queryAndComputePriceApi = (data) => {
  return request({
    url: '/lms/tiktok/product/queryAndComputePrice',
    method: 'POST',
    data: qs.stringify(data)
  });
};

// 发送调价队列
export const batchAdjustOriginPriceApi = (data) => {
  return request({
    url: '/lms/tiktok/product/batchAdjustOriginPrice',
    method: 'POST',
    data
  });
};

// 查询调价结果
export const searchResultApi = (data) => {
  return request({
    url: '/lms/tiktok/product/listAdjustPriceResult',
    method: 'POST',
    data: qs.stringify(data)
  });
};

//查询listing促销
export const queryPromotionListApi = (data) => {
  return request({
    url: `/lms/tiktok/product/listPromotion`,
    method: 'POST',
    loading: true,
    data
  });
};
//添加或移除促销
export const addOrRemovePromotionApi = (data) => {
  return request({
    url: '/lms/tiktok/product/addOrRemovePromotion',
    method: 'POST',
    loading: true,
    data
  });
};

//添加或移除促销队列
export const addOrRemovePromotionV2Api = (data) => {
  return request({
    url: '/lms/tiktok/product/addOrRemovePromotionV2',
    method: 'POST',
    loading: true,
    data
  });
};

//修改全球商品图片
export const modifyGlobalProductImagesApi = (data) => {
  return request({
    url: `/lms/tiktok/product/modifyProductImages`,
    method: 'post',
    data
  });
};

// 导出
export const exportApi = (data) => {
  return request({
    url: `lms/tiktok/product/exportOnlineProductInfos`,
    method: 'post',
    data
  });
};

// 批量同步 storeAcctId,productId
export const batchSyncApi = (data) => {
  return request({
    url: '/lms/tiktok/product/batchSyncProduct',
    method: 'post',
    loading: true,
    data
  });
};
// 上传视频
export const uploadVideoApi = (data) => {
  return request({
    url: '/lms/tiktok/product/batchUploadVideo',
    method: 'post',
    data
  });
};
// 批量重新生成标题
export const regenerateTitleApi = (data) => {
  return request({
    url: '/lms/tiktok/product/regenerateTitle',
    method: 'post',
    loading: true,
    data
  });
};
// 批量修改标题
export const batchModifyShopProductNameApi = (data) => {
  return request({
    url: '/lms/tiktok/product/batchModifyShopProductName',
    method: 'post',
    data
  });
};
// 重新生成标题索引枚举
export const regenerateTitleIndexEnumApi = () => {
  return request({
    url: '/lms/tiktok/product/regenerateTitleIndexEnum'
  });
};

//获取排序方式枚举值
export const getProductQueryEnumApi = () => {
  return request({
    url: '/lms/tiktok/product/productQueryEnum',
    method: 'get'
  });
};

//获取是否侵权枚举值
export const getTortBanEnumApi = () => {
  return request({
    url: '/lms/tiktok/product/tortBanEnum',
    method: 'get'
  });
};

//获取排序方式枚举值
export const getListAllQcReasonApi = () => {
  return request({
    url: '/lms/tiktok/product/listAllQcReasonV2',
    method: 'get'
  });
};

// 批量修改描述
export const batchModifyShopProductDescApi = (data) => {
  return request({
    url: '/lms/tiktok/product/batchModifyShopProductDescription',
    method: 'post',
    data
  });
};

// 查询要更新的类目商品
export const queryUpdateCategoryApi = (data) => {
  return request({
    url: '/lms/tiktok/product/queryUpdateCategory',
    method: 'post',
    loading: true,
    data
  });
};

// 获取推荐类目的信息
export const getRecommendCategoryApi = (data) => {
  return request({
    url: '/lms/tiktok/product/getRecommendCategory',
    method: 'post',
    loading: true,
    data
  });
};

// 校验平台类目必填项是否完整
export const checkCategoryCompleteApi = (categoryId) => {
  return request({
    url: `/lms/tiktok/product/checkCategoryComplete?categoryId=${categoryId}`,
    loading: true
  });
};

// 批量修改类目
export const batchUpdateCategoryApi = (data) => {
  return request({
    url: `/lms/tiktok/product/batchUpdateCategory`,
    loading: true,
    method: 'post',
    data
  });
};

// 获取不处理类型
export const filterListinginitApi = () => {
  return request({
    url: `/lms/tiktok/filterListing/init`,
    loading: true
  });
};

// 不处理listing 查询
export const filterListingQueryApi = (data) => {
  return request({
    url: `/lms/tiktok/filterListing/queryByPage`,
    loading: true,
    method: 'post',
    data
  });
};
// 不处理listing 新增
export const filterListingAddApi = (data) => {
  return request({
    url: `/lms/tiktok/filterListing/addProduct`,
    loading: true,
    method: 'post',
    data: data
  });
};
// 不处理listing 删除
export const filterListingDelApi = (data) => {
  return request({
    url: `/lms/tiktok/filterListing/delete`,
    loading: true,
    method: 'post',
    data
  });
};

// 查询选中listing的秒杀信息
export const listFlashSaleApi = (data) => {
  return request({
    url: `/lms/tiktok/product/listFlashSale`,
    loading: true,
    method: 'post',
    data
  });
};

// listing的秒杀信息的枚举值
export const getFlashSaleEnumApi = () => {
  return request({
    url: `/lms/tiktok/product/getFlashSaleEnum`,
    method: 'post',
    loading: true
  });
};

// 查询所有不续期的秒杀活动
export const listNotRenewFlashSaleApi = (data) => {
  return request({
    url: `/lms/tiktok/product/listNotRenewFlashSale`,
    loading: true,
    method: 'post',
    data
  });
};

// 选择商品添加或修改秒杀活动
export const addOrUpdateFlashSaleApi = (data) => {
  return request({
    url: `/lms/tiktok/product/addOrUpdateFlashSale`,
    loading: true,
    method: 'post',
    data
  });
};

// 移除秒杀活动
export const removeFlashSaleApi = (data) => {
  return request({
    url: `/lms/tiktok/product/removeFlashSale`,
    loading: true,
    method: 'post',
    data
  });
};

// 更新30天最低销量
export const updateMinSaleApi = (data) => {
  return request({
    url: `/lms/tiktok/product/listThirtyDaysMinPromotionPrice`,
    method: 'post',
    data
  });
};

//更新首图水印
export const updateWatermarkApi = (data) => {
  return request({
    url: `/lms/tiktok/product/updateProductWatermark`,
    loading: true,
    method: 'post',
    data
  });
};

//根据平台和店铺查询水印信息
export const getWatermarkInfoApi = (data) => {
  return request({
    url: `/lms/plat/platWatermark/listByStoreAcctIdAndPlatCode`,
    loading: true,
    method: 'post',
    data
  });
};

//批量首图加水印接口
export const batchFirstImageAddWatermarkApi = (data) => {
  return request({
    url: `/lms/tiktok/product/batchFirstImageAddWatermark`,
    loading: true,
    method: 'post',
    data
  });
};

// 调价配置
export function adjustPriceByExcelAPI(data) {
  return request({
    url: 'lms/tiktok/product/adjustPriceByExcel',
    method: 'post',
    data,
    loading: true,
    needWrongMsg: true
  });
}

// 导出表头字段
export const getExportHeadersApi = () => {
  return request({
    url: '/lms/tiktok/product/getExportOnlineProductInfosHeaders',
    loading: true
  });
};

//获取tk在线listing标签
export const getListingTagApi = (data) => {
  return request({
    url: `/lms/sysdict/getListingTag?headCode=${data.headCode}`
  });
};

//批量修改Listing标签
export const batchModifyListingTagApi = (data) => {
  return request({
    url: `/lms/tiktok/product/batchModifyListingTag`,
    method: 'post',
    data
  });
};

// 一键复制枚举
export const getBatchCopyEnumApi = () => {
  return request({
    url: '/lms/tiktok/product/getBatchCopyEnum'
  });
};

// 点击一键复制
export const batchCopyListApi = (data) => {
  return request({
    url: '/lms/tiktok/product/batchCopyList',
    method: 'post',
    data,
    loading: true
  });
};

// 查询详情
export const getDetailByIdApi = (data) => {
  return request({
    url: `/lms/tiktok/filterListing/queryById/${data.id}`,
    loading: true
  });
};

// 已下架页签 批量删除
export const showLogApi = (data) => {
  return request({
    url: '/lms/tiktok/filterListing/log/page',
    method: 'post',
    data,
    loading: true
  });
};

// 添加/修改不处理条件
export const saveProductApi = (data) => {
  return request({
    url: '/lms/tiktok/filterListing/saveProduct',
    method: 'post',
    data,
    loading: true
  });
};

// 已下架页签 批量删除查询是否满足条件
export const queryBatchDeleteByProductIdsApi = (data) => {
  return request({
    url: '/lms/tiktok/product/queryBatchDeleteByProductIds',
    method: 'post',
    data,
    loading: true
  });
};

// 已下架页签 批量删除
export const batchDeleteGlobalProductApi = (data) => {
  return request({
    url: '/lms/tiktok/product/batchDeleteGlobalProduct',
    method: 'post',
    data,
    loading: true
  });
};
