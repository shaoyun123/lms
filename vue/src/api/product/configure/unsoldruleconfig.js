import request from '@/utils/request';

export const getRules = () =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/queryAllProdUnsoldCleanConfig',
    method: 'get'
  });

export const saveRules = (data) =>
  request({
    url: '/lms/prodUnsoldStockCleanProcess/saveProdUnsoldCleanCConfig',
    method: 'post',
    data,
    loading: true
  });
