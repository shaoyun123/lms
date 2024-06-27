import request from '@/utils/request';
import qs from 'qs';
import useComApiDataStore from '@/store/modules/commonApiData';
const {
  fetchOaNewCategary,
  fetchOaCategary,
  fetchMercadoCateTree,
  fetchListlogisattr,
  fetchCurrencyEnum,
  fetchPreProdDevTypeEnum,
  fetchLeavedUserList,
  fetchAllUserPermissionList
} = useComApiDataStore();

/**
 * 获取常量枚举（平台）接口
 * @param {SVGAnimatedNumber} needFilterFake 值为0，不过滤shopee_cnsc，，传1或者不传过滤shopee_cnsc
 * @returns 登录状态
 */
export const getListEnum = (needFilterFake = '') => {
  return request({
    url: `/lms/unauditorder/listenum.html?needFilterFake=${needFilterFake}`,
    loading: true,
    method: 'get'
  });
};

/**
 * 获取日期常量
 */
export const shortcuts = [
  {
    text: '今天',
    value: () => {
      const start = new Date();
      let newStr = start.toString().split(' '),
        newStr1 = JSON.parse(JSON.stringify(newStr)),
        newStr2 = JSON.parse(JSON.stringify(newStr));
      newStr1[4] = '00:00:00';
      newStr2[4] = '23:59:59';
      return [newStr1.join(' '), newStr2.join(' ')];
    }
  },
  {
    text: '昨天',
    value: () => {
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      let newStr = start.toString().split(' '),
        newStr1 = JSON.parse(JSON.stringify(newStr)),
        newStr2 = JSON.parse(JSON.stringify(newStr));
      newStr1[4] = '00:00:00';
      newStr2[4] = '23:59:59';
      return [newStr1.join(' '), newStr2.join(' ')];
    }
  },
  {
    text: '近7天',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      let newStr1 = JSON.parse(JSON.stringify(start.toString().split(' '))),
        newStr2 = JSON.parse(JSON.stringify(end.toString().split(' ')));
      newStr1[4] = '00:00:00';
      newStr2[4] = '23:59:59';
      return [newStr1.join(' '), newStr2.join(' ')];
    }
  },
  {
    text: '近30天',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      let newStr1 = JSON.parse(JSON.stringify(start.toString().split(' '))),
        newStr2 = JSON.parse(JSON.stringify(end.toString().split(' ')));
      newStr1[4] = '00:00:00';
      newStr2[4] = '23:59:59';
      return [newStr1.join(' '), newStr2.join(' ')];
    }
  },
  {
    text: '近60天',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
      let newStr1 = JSON.parse(JSON.stringify(start.toString().split(' '))),
        newStr2 = JSON.parse(JSON.stringify(end.toString().split(' ')));
      newStr1[4] = '00:00:00';
      newStr2[4] = '23:59:59';
      return [newStr1.join(' '), newStr2.join(' ')];
    }
  },
  {
    text: '30天前',
    value: () => {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      let newStr2 = JSON.parse(JSON.stringify(end.toString().split(' ')));
      newStr2[4] = '23:59:59';
      return ['2010-01-01 00:00:00', newStr2.join(' ')];
    }
  }
];

/**
 * 获取平台下的店铺
 * @param  platCode 平台
 */
export const getStoreList = (platCode = '') => {
  return request({
    url: `/lms/sys/listStoreCascaderData/${platCode}`,
    method: 'get'
  });
};

/**
 * 获取操作日志操作类型枚举
 * @param  platCode 平台
 */
export const getProdListingOperTypeEnum = (platCode = '') => {
  return request({
    url: `/lms/prodListingOperTypeEnum/${platCode}`,
    method: 'get'
  });
};

// #region OA类目start
export const queryOaCategory = async () => {
  const data = await fetchOaCategary();
  return Promise.resolve({ data });
};
export const queryOaCategoryOrigin = () => {
  return request({
    url: '/lms/prodcate/listCategoryTree'
  });
};
// #endregion OA类目end

// #region OA新类目start
export const queryOaNewCategory = async () => {
  const data = await fetchOaNewCategary();
  return Promise.resolve({ data });
};
export const queryOaNewCategoryOrigin = () => {
  return request({
    url: '/lms/prodCateOa/get/cate/tree'
  });
};
// #endregion OA新类目end

// #region 美客多类目
export const getCateTree = async () => {
  const data = await fetchMercadoCateTree();
  return Promise.resolve({ data });
};
export const getCateTreeOrigin = () => {
  return request({
    url: '/lms/mercadoCate/getCateTree'
  });
};
// #endregion 美客多类目

// 标签 默认商品标签
export const getProdTagListApi = (data = { headCode: 'prod_tag' }) => {
  return request({
    url: '/lms/sys/listdict.html',
    method: 'post',
    data: qs.stringify(data)
  });
};

// #region 物流属性start
export const getLogisListApi = async () => {
  const data = await fetchListlogisattr();
  return Promise.resolve({ data });
};
export const getLogisListApiOrigin = () => {
  return request({
    url: '/lms/sys/listlogisattr.html',
    method: 'post'
  });
};
// #endregion 物流属性 end

// 根据平台获取站点
export const getSiteListApi = (platCode) => {
  return request({
    url: `/lms/enum/getSiteEnum.html?platCode=${platCode}`,
    method: 'post'
  });
};

// #region 根据币种枚举start
export const getCurrencyEnumApi = async () => {
  const data = await fetchCurrencyEnum();
  return Promise.resolve({ data });
};
export const getCurrencyEnumApiOrigin = () => {
  return request({
    url: `/lms/sysdict/getCurrencyEnums.html`,
    method: 'post'
  });
};
// #endregion 根据币种枚举end

// #region 开发类型start
export const getDevTypeListApi = async () => {
  const data = await fetchPreProdDevTypeEnum();
  return Promise.resolve({ data });
};
export const getDevTypeListApiOrigin = () => {
  return request({
    url: '/lms/enum/getPreProdDevTypeEnum.html',
    method: 'post'
  });
};
// #endregion 开发类型end

//获取平台类目树
export const getPlatCategoryTreeApi = (code) => {
  return request({
    url: '/lms/prodcate/getPlatCategoryTree',
    params: { code }
  });
};

// 获取水洗唛和英文标签
export const getWaterMarkLabel = (data) => {
  return request({
    url: '/lms/PlatWh/distribute/printTemuPDFLabel',
    method: 'post',
    data
  });
};

// 客服
// eg data:{role:'shopee客服'}
export const getCustomerListApi = (data) => {
  return request({
    url: '/lms/sys/listuserbyrole.html',
    method: 'post',
    data: qs.stringify(data)
  });
};
// 基础模板开发专员   部门和销售
export function getCustomers(data = { roleNames: '开发专员' }) {
  return request({
    method: 'post',
    url: '/lms/sys/getPersonAndOrgsByRole.html',
    data: qs.stringify(data)
  });
}

// #region 采购员 start
export async function getLeavedUser() {
  const data = await fetchLeavedUserList();
  return Promise.resolve({ data });
}
export function getLeavedUserOrigin() {
  return request({
    method: 'post',
    url: '/lms/sysuser/getLeavedUser.html'
  });
}
// #endregion 采购员 end

// 开发专员
// eg data:{role, '开发专员'}
export const getListuserbyrole = (data = { role: '开发专员' }) => {
  return request({
    url: '/lms/sys/listuserbyrole.html',
    method: 'POST',
    data: qs.stringify(data)
  });
};
// 美客多模板创建人
export const getModelCreatorList = () => {
  return request({
    url: '/lms/mercadoModel/getModelCreatorList',
    method: 'POST'
  });
};

//ztt-20230616新增
//根据店铺id查询已授权的角色和用户
export function listAuthorizedRoleUserByStoreAcctIdAjax(id) {
  return request({
    url: `/lms/sys/listAuthorizedRoleUserByStoreAcctId?storeAcctId=${id}`,
    loading: true,
    method: 'GET'
  });
}
//根据平台查询已授权的角色和用户
export function listAuthorizedRoleUserByPlatCodeAjax(platCode) {
  return request({
    url: `/lms/sys/listAuthorizedRoleUserByPlatCode?platCode=${platCode}`,
    loading: true,
    method: 'GET'
  });
}
//获取可用的用户
export function getAvailableListUserAjax() {
  return request({
    url: `/lms/sysuser/listUser.html`,
    loading: true,
    method: 'GET'
  });
}
//获取可用的角色
export function getAvailableListRoleAjax() {
  return request({
    url: `/lms/sys/listAllRoles.html`,
    method: 'POST',
    loading: true
  });
}

//新增店铺授权
export function userStoreAcctAuthorizeAjax(data) {
  return request({
    url: '/lms/sys/userStoreAcctAuthorize',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
}
//新增平台授权
export function rolePlatAuthorizeAjax(data) {
  return request({
    url: '/lms/sys/rolePlatAuthorize',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
}
//店铺取消授权
export function storeAcctCancelAuthorizationAjax(data) {
  return request({
    url: '/lms/sys/storeAcctCancelAuthorization',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
}
//平台取消授权
export function platCancelAuthorizationAjax(data) {
  return request({
    url: '/lms/sys/platCancelAuthorization',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });
}

// 获取所有对接的平台数据
export function getAllPlatList() {
  return request({
    url: '/lms/PlatWh/PlatWhFrameInfo/getAllPlatName',
    method: 'get'
  });
}

// 查询批次号结果结果
export const getResultByBatchNoApi = (data) =>
  request({
    url: '/lms/sys/selectResult.html',
    method: 'POST',
    loading: true,
    data: qs.stringify(data)
  });

// 获取模版描述
export const getTemplateDescApi = (prodPIds) =>
  request({
    url: `lms/prodTpl/getTemplateDesc?prodPIds=${prodPIds}`,
    method: 'POST',
    loading: true
  });

// 上传图片
export const publicUploadFileApi = (data) =>
  request({
    url: `/lms/prodTpl/uploadPic.html`,
    method: 'POST',
    data
  });

// 富文本上传图片
export const wangEditorUploadFileApi = (data) =>
  request({
    url: `/lms/prodImageAliyun/uploadFile`,
    method: 'POST',
    data
  });

// 平台标题 标签
export const getPlatTitleTagApi = (data) =>
  request({
    url: `/lms/plat/assist/getProdPInfoAssistInfoByProdPIdOrProdSIdOrProdPSkuOrProdSSku`,
    method: 'POST',
    data
  });

// 获取所有平台
export const getPlatNameApi = () =>
  request({
    url: `/lms/preProdDev/getAllPlatName`,
    method: 'GET'
  });

//  商品物流属性
export const getMsgFreightTemplateSmtList = (data) =>
  request({
    url: '/lms/onlineProductSmt/getMsgFreightTemplateSmtList.html',
    method: 'POST',
    data
  });

// 权限 获取所有用户
export function getAllUserPermissionListApi() {
  return request({
    url: 'lms/sysPermissionCommon/listAllUser',
    method: 'post',
    loading: true
  });
}

export async function allUserPermissionListApi() {
  const data = await fetchAllUserPermissionList();
  return Promise.resolve({ data });
}

// 上传登录页背景文件
export function uploadVideoApi(data) {
  return request({
    url: 'lms/prodImageAliyun/uploadMP4File',
    method: 'post',
    data
  });
}

// base64
export const photoshopByFile = (data) =>
  request({
    url: '/lms/imageProcess/photoshopByFile',
    data,
    loading: true,
    method: 'post'
  });

// 网络链接
export const photoshopByUrl = (data) =>
  request({
    url: '/lms/imageProcess/photoshopByUrl',
    data,
    loading: true,
    method: 'post'
  });

// base64存到数据库，并转为url链接
export const getBase64Img = (data) =>
  request({
    url: '/lms/preProdDev/getBase64Img.html',
    data,
    loading: true,
    needWrongMsg: true,
    method: 'post'
  });

// 修改禁售状态
export const editOrAddProdProhibitMapping = (data) =>
  request({
    url: '/lms/prohibit/editOrAddProdProhibitMapping.html',
    data,
    loading: true,
    method: 'post'
  });

// 查询店铺标签
export function getStoreTagListApi(platCode) {
  return request({
    url: '/lms/sysdict/getStoreTagByCode',
    method: 'post',
    loading: true,
    data: qs.stringify({ codes: platCode })
  });
}

// 查询视频标签
export function getVideoTagsApi() {
  return request({
    url: '/lms/LazadaVideoMange/getVideoTags',
    loading: true
  });
}
