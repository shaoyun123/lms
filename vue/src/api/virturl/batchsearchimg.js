import request from '@/utils/request';
// 根据平台获取站点
export const getSiteByPlatApi = (data) =>
  request({
    url: `/lms/preProdDev/getSiteNameByPlatCode`,
    method: 'POST',
    data
  });

// 导入excel 文件
export const importImgExccelApi = (data) =>
  request({
    url: `/lms/prodImageAliyun/importExcelSearchImage`,
    method: 'POST',
    data
  });

// 定价
export const setPriceApi = (data) =>
  request({
    url: `/lms/preProdDev/getAllPirce`,
    method: 'POST',
    data
  });

// 单张图片进行搜图
export const singleImgSearchApi = (data) =>
  request({
    url: `/lms/prodImageAliyun/prodSInfoSearchByBase64`,
    method: 'POST',
    data,
    loading: true
  });

// 单张图片进行搜图
export const getExcelImgApi = (data) =>
  request({
    url: `/lms/prodImageAliyun/queryImportExcelSearchImageResult`,
    method: 'POST',
    data
  });
