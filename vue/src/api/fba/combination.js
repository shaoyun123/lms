import request from '@/utils/request';
import qs from 'qs';

// 查询组合品
export const queryCombList = (data) => {
  return request({
    url: '/lms/whCombProduce/queryPage',
    method: 'POST',
    data
  });
};

// 查询组合品数量
export const queryCombCount = (data) => {
  return request({
    url: '/lms/whCombProduce/countForAllProcessStatus',
    method: 'POST',
    data
  });
};

// 批次号查询
export const queryBatchNo = (data) => {
  return request({
    // url: '/lms/whCombProduce/queryBatchNo',
    url: '/lms/whCombProduce/queryBatchNoV2',
    method: 'POST',
    data
  });
};

// 派单
export const distributeOrder = (data) => {
  return request({
    url: '/lms/whCombProduce/distribute',
    method: 'POST',
    data
  });
};

// 生成批次
export const generateBatch = (data) => {
  return request({
    url: '/lms/whCombProduce/generateBatch',
    method: 'POST',
    data
  });
};

// 获取仓库
export const getWarehouse = (data) => {
  return request({
    url: '/lms/unauditorder/listenum.html',
    method: 'POST',
    data
  });
};

// 投篮
export const putInFrame = (data) => {
  return request({
    url: '/lms/whCombProduce/putInFrame',
    method: 'POST',
    data
  });
};

// 根据生产单号查询待生产组合品信息
export const getProduce = (data) => {
  return request({
    url: '/lms/whCombProduce/queryForProduce',
    method: 'POST',
    data
  });
};

// 生产
export const handleProduce = (data) => {
  return request({
    url: '/lms/whCombProduce/produce',
    method: 'POST',
    data
  });
};
//缺货待检
export const outOfStockToCheckAjax = (data) => {
  return request({
    url: '/lms/whCombProduce/outOfStockToCheck',
    method: 'POST',
    data
  });
};

// 转待派单 取消
export const changeStatus = (data) => {
  return request({
    url: '/lms/whCombProduce/changeProcessStatus',
    method: 'POST',
    data
  });
};

// 包装 查询接口
export const queryPackup = (data) => {
  return request({
    url: '/lms/FbaDistributePlan/queryForPackage',
    method: 'POST',
    data,
    needWrongMsg: true
  });
};

// 包装
export const packup = (data) => {
  return request({
    url: '/lms/amazonFbaGoodsMatch/packRelSku',
    method: 'POST',
    data
  });
};

// 获取批次号
export const getBatch = (data) => {
  return request({
    url: '/lms/FbaDistributePlan/queryBacthNo',
    method: 'POST',
    data
  });
};

// 待建框查询
export const getWaitBuild = (data) => {
  return request({
    url: '/lms/amazonFbaWaitingFrame/queryPage',
    method: 'POST',
    data
  });
};

// 待建框新增
export const addWaitBuild = (data) => {
  return request({
    url: '/lms/amazonFbaWaitingFrame/addOne',
    method: 'POST',
    data
  });
};

// 待建框编辑
export const updateWaitBuild = (data) => {
  return request({
    url: '/lms/amazonFbaWaitingFrame/edit',
    method: 'POST',
    data
  });
};

// 查询amazon总店铺
export const getStoreListApi = () => {
  return request({
    url: '/lms/sys/listStoreForRenderHpStoreCommonComponent.html',
    method: 'POST',
    data: qs.stringify({
      roleNames: 'amazon专员',
      orgId: '',
      salePersonId: '',
      platCode: 'amazon'
    })
  });
};

// 查询打印
export const getPrintInfo = (data) => {
  return request({
    url: '/lms/whCombProduce/queryForPrint',
    method: 'POST',
    data
  });
};

// 查询待包装货件批次号
export const getWaitPackBatch = () => {
  return request({
    url: '/lms/FbaDistributePlan/queryBacthNoForWaitPackShip',
    method: 'POST'
  });
};

//ztt20230913 转拍照接口
export const transferToPhoto = (data) => {
  return request({
    url: '/lms/whCombProduce/changeProcessStatus',
    method: 'POST',
    data
  });
};

//ztt20230918 获取打印参数
export const getPrintParamsAjax = (params) => {
  return request({
    url: '/lms/printTemplate/printProd',
    method: 'post',
    data: qs.stringify(params)
  });
};

//cq20231012 生成盘点任务参数
export const generateInventoryApi = (data) => {
  return request({
    url: '/lms/whCombProduce/generateInventory',
    method: 'post',
    data
  });
};

//cq20231012 拆单参数
export const splitCombinSKuApi = (data) => {
  return request({
    url: '/lms/whCombProduce/splitCombinSKu',
    method: 'post',
    data
  });
};
//ztt20231031 仓库缺货导出
export const whExportExcelApi = (data) => {
  return request({
    url: '/lms/whCombProduce/exportExcel',
    method: 'post',
    data,
    responseType: 'blob',
    needWrongMsg: true
  });
};

// 打印投篮
export const printBasketLabelApi = (data) => {
  return request({
    url: '/lms/printTemplate/printBasketLabel',
    method: 'post',
    data,
    loading: true
  });
};

//标记少货接口
export const markLackApi = (data) => {
  return request({
    url: '/lms/FbaDistributePlan/markShortage',
    method: 'post',
    data,
    loading: true
  });
};
