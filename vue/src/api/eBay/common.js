import request from '@/utils/request';

// 获取账号类型
export const getAcctTypeData = () =>
  request({
    url: '/lms/sys/ebayAcctTypeEnum.html',
    method: 'post'
  });
