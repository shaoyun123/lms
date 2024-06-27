import request from '@/utils/request';

// 查询
export function queryPageApi(data) {
  return request({
    url: `/lms/shopee/prodCateAttr/getProdCateAttr?page=${data.page}&limit=${data.limit}&defaultValue=${data.defaultValue}&displayAttributeName=${data.displayAttributeName}`,
    loading: true
  });
}

// 修改类目
export function editApi(data) {
  return request({
    url: '/lms/shopee/prodCateAttr/updateOrAddProdCateAttr',
    method: 'post',
    data,
    loading: true
  });
}
