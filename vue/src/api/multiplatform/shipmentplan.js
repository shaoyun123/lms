/*
 * @Author: Cisy.Wang
 * @Date: 2022-11-04 17:48:23
 * @LastEditTime: 2024-03-26 16:36:55
 * @Description:
 */
import request from '@/utils/request';
// import qs from 'qs';
// 获取所有平台数据
export const getAllPlatData = () => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/getAllPlatCode',
    method: 'post'
  });
};

// 获取销售数据
export const getSalersData = () => {
  return request({
    url: '/lms/acctPerson/queryAllSalesPerson.html',
    method: 'post'
  });
};

// 根据平台获取店铺信息
export const getStoreData = (params) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/getPermitStore.html',
    method: 'get',
    params
  });
};
// 获取平台状态
export const getPlatStatus = (params) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/getPlatProcessStatus',
    method: 'get',
    params
  });
};
// 查询货件计划
export const getShipmentList = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/searchPlatShipment',
    method: 'post',
    data
  });
};

// 获取货件计划的数量
export const getShipmentCount = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/getAllOaProcessStatusByCondition',
    method: 'post',
    data
  });
};

// 获取待装箱子状态的数量
export const getStoreProcessCount = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/countStoreProcessStatus',
    method: 'post',
    data
  });
};

// 获取收货地址
export const getAddress = (data) => {
  return request({
    url: '/lms/PlatWh/searchPlatWhReceiveAddress',
    method: 'post',
    data
  });
};

// 货件计划详情列表
export const getShipmentDetail = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/getPlatShipmentDetail',
    method: 'post',
    data
  });
};

// 删除货件计划
export const deleteShipment = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/deleteShipment',
    method: 'post',
    data
  });
};

// 待审核-审核取消
export const cancelCheck = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/oaStatusToCancel',
    method: 'post',
    data
  });
};

// 转待审核
export const cancelToCheck = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/pendingReview',
    method: 'post',
    data
  });
};

// 导出
export const exportShipment = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/PlatWhShipmentFullExport',
    method: 'post',
    data,
    needWrongMsg: true
  });
};

// 审核转至待派单
export const checkOrder = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/oaStatusToWaitSendOrder',
    method: 'post',
    data
  });
};

// 发货
export const sendShipment = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/sendPackage',
    method: 'post',
    data
  });
};

// 修改快递信息 保存
export const updateLogisticsInfoApi = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/updateLogisticsInfo',
    method: 'post',
    loading: true,
    data
  });
};

// 批量发货
export const batchSendShipment = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/batchSendPackage',
    method: 'post',
    data
  });
};

// 发货弹窗 保存
export const saveDelivery = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/updateShipmentDetailPack',
    method: 'post',
    data
  });
};

// 详情弹窗 保存
export const saveDetail = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/updateShipment',
    method: 'post',
    data
  });
};

// 0库存发货
export const deliveryNoStock = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/updateShipmentDetailPack',
    method: 'post',
    data,
    loading: true
  });
};

// 装箱查询接口
export const queryBoxup = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipmentBox/searchShipmentBox',
    method: 'post',
    data
  });
};

// 待装箱“合单装箱”和“装箱”按钮校验货件是否上传箱唛
export const queryCheckHaveCaseLabel = (params) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/checkHaveCaseLabel',
    method: 'get',
    params
  });
};

// 装箱保存接口
export const saveBoxup = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipmentBox/updateShipmentBox',
    method: 'post',
    data
  });
};
// 装箱保存接口
export const handleEditDeliver = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipmentBox/onlyUpdateShipmentBox ',
    method: 'post',
    data
  });
};

// 取消发货单(temu)
export const cancelTemuDeliveryOrderApi = (id) => {
  return request({
    url: `/lms/PlatWh/PlatWhShipment/cancelTemuDeliveryOrder?id=${id}`,
    method: 'post',
    loading: true
  });
};

// 一键采购
export const purchaseOrder = () => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/fastCreatePurOrder',
    method: 'post'
  });
};

// 派至仓库
export const sendRepository = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/sendToRepository',
    method: 'post',
    data
  });
};

// 上传箱唛
export const importCaseLabel = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/importShipmentCaseLabel',
    method: 'post',
    data
  });
};

// 上传箱唛
export const clearCaseLabel = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/cleanCaseLabel',
    method: 'post',
    data
  });
};

// 详情-新增商品
export const addSku = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/searchNewProd',
    method: 'post',
    data
  });
};

// 标记平台发货
export const markOrder = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/markSendOrder',
    method: 'post',
    data
  });
};

// 派至仓库进度条
export const getProcess = (data) => {
  return request({
    url: '/lms/msgProcess/queryProcess',
    method: 'post',
    data
  });
};

// 打印记录-快递单
export const savePrintExpressNoLog = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/savePrintExpressNoLog',
    method: 'post',
    data
  });
};

// 打印记录-箱唛
export const savePrintCaseLabelLog = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/savePrintCaseLabelLog',
    method: 'post',
    data
  });
};

// 打印记录-发货单
export const savePrintDeliverOrderSnLog = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/savePrintDeliverOrderSnLog',
    method: 'post',
    data
  });
};

// 获取箱唛
export const getCaseLabelData = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/getCaseLabelApi',
    method: 'post',
    data
  });
};

// 获取快递单信息
export const getDeliverData = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/printTemuExpressDeliverSn',
    method: 'post',
    data
  });
};

// 打印快递单
export const printExpressDeliverSnApi = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/printExpressDeliverSn',
    method: 'post',
    data
  });
};

// 发货单信息
export const getDeliverItemData = (data) => {
  return request({
    url: '/lms/PlatWh/distribute/printDeliverOrderFile',
    method: 'post',
    data
  });
};

// 平台取消接口 待发货状态
export const platCancel = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/cancelDelivery',
    method: 'post',
    data
  });
};

// 修改销售备注
export const editRemark = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/editSalesRemark',
    method: 'post',
    data
  });
};

// 采购列表
export const getPurchaseList = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/queryPlatWhShipmentPurchaseStock',
    method: 'post',
    data
  });
};

// 义乌仓调拨中转仓
export const transferStore = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/createTranStorageOrderForPlatWhShipment',
    method: 'post',
    data
  });
};

// 采购到平台仓
export const purchaseToStore = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/fastCreatePurOrderByProdSId',
    method: 'post',
    data
  });
};

// 匹配sku
export const mateSku = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/repairSkuMapping',
    method: 'post',
    data
  });
};

// 获取导出模板
export const getExportTemplate = (data) => {
  return request({
    url: '/lms/winitExportTemplate/queryPage.html',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

// Lazada 平台打印商品条码
export const getLazadaPrint = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/printLazadaBarCode',
    method: 'post',
    data
  });
};

// Lazada 打印箱唛信息
export const getLazadaCase = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipmentBox/printLazadaCaseLabel',
    method: 'post',
    data
  });
};

// shein 自营打印箱唛信息
export const getSheinCase = (data) => {
  return request({
    url: '/lms/PlatWh/distribute/printSheinCaseLable',
    method: 'post',
    data
  });
};

// 跳过装箱到待发货
export const skipPack = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/skipPackage ',
    method: 'post',
    data
  });
};

// 合单装箱
export const mergeBox = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipmentBox/searchComShipmentBox',
    method: 'post',
    data
  });
};

// 保存合单装箱
export const saveMergeBox = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipmentBox/combinationPackBox',
    method: 'post',
    data
  });
};

// 合单装箱号
export const getCombox = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/queryPlatWhComBox',
    method: 'post',
    data
  });
};

// 修改货件编号
export const editPlatOrder = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/editPlatOrderId',
    method: 'post',
    data
  });
};

// 修改发货单
export const editDeliverOrder = (data) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/importDeliverOrderFileAndDeliverOrderNo',
    method: 'post',
    data,
    needWrongMsg: true
  });
};

// 清空发货单和快递单
export const removeLogisNoAndDeliverOrderSnApi = (idStr) => {
  return request({
    url: `/lms/PlatWh/PlatWhShipment/removeLogisNoAndDeliverOrderSn?idStr=${idStr}`,
    needWrongMsg: true
  });
};

// 查询商品标签 水洗唛 眼镜贴 环保贴
export const getSheinPrint = (data) => {
  return request({
    url: '/lms/PlatWh/distribute/printSheinBarCode',
    method: 'post',
    data
  });
};

// 批量转待审核
export const batchPendingReviewApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/batchPendingReview',
    method: 'post',
    data
  });

// 批量取消
export const batchBatchCancelApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/batchOaStatusToCancel',
    method: 'post',
    data
  });

// 获取仓库名称接口
export const getRepoName = () =>
  request({
    url: '/lms/PlatWh/PlatWhFrameInfo/getAllWareHouseName',
    method: 'get'
  });

// 获取创建人
export const getCreator = () =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/queryLastThreeMothCreator',
    method: 'get'
  });

// 修改采购备注
export const savePurchaseRemark = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/savePurchaseRemark',
    method: 'post',
    data
  });

// 填写发货单
export const saveWriteDeliver = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/editAeLbxNo',
    method: 'post',
    data
  });

// 查询ae字画箱唛
export const queryAeCaleLabelApi = (data) =>
  request({
    url: '/lms/printTemplate/printPlatWhLabel',
    method: 'post',
    data
  });

// 查询ae欧盟标签
export const queryAeEuCaleLabelApi = (data) =>
  request({
    url: '/lms/printTemplate/printEuLabel',
    method: 'post',
    data
  });

// 是否需要打印欧盟标签
export const queryIfNeedEuLabelApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/queryIfNeedEuLabel',
    method: 'post',
    data
  });

// 修改采购备注
export const batchEditPurchaseRemarkApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/batchEditPurchaseRemark',
    method: 'post',
    loading: true,
    data
  });

//  获取是否需要打印食品接触标识
export const queryIfPrintFoodLabelApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/queryIfPrintFoodLabel',
    method: 'post',
    loading: true,
    data
  });

// 货件计划-填写揽收单号
export const editPickUpNoApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/editPickUpNo',
    method: 'post',
    loading: true,
    data
  });

// 货件计划-批量填写AE揽收单号
export const batchEditAePickUpNoAndLbxNoApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/batchEditAePickUpNoAndLbxNo',
    method: 'post',
    loading: true,
    data
  });
// 货件计划-批量上传物流面单
export const UploadLogisticsBillApi = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/importTiktokDeliverOrderFile',
    method: 'post',
    loading: true,
    data
  });
// 货件计划-批量上传物流面单-清清除物流面单
export const clearLogisticsBillApi = (params) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/cleanTiktokDeliverOrderFile',
    method: 'get',
    params
  });
};
// 通用的获取打印信息接口
export const getPrintInfo = (data) =>
  request({
    url: '/lms/printTemplate/common/getPrintInfo',
    method: 'post',
    loading: true,
    data
  });
// temu货件获取平台推荐物流商
export const queryTemuGetMatchLogistics = (params) => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/temuGetMatchLogistics',
    method: 'get',
    params
  });
};
// temu修改物流
export const quieryTemuChangeShipOrderLogistics = (data) =>
  request({
    url: '/lms/PlatWh/PlatWhShipment/temuChangeShipOrderLogistics',
    method: 'post',
    loading: true,
    data
  });
// 获取平台标签，OA标签枚举
export const queryPlatOaListEnum = () => {
  return request({
    url: '/lms/PlatWh/PlatWhShipment/listEnum',
    method: 'get'
  });
};
