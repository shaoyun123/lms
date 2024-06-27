import request from '@/utils/request';

export const get1688Catagory = (data) =>
  request({
    url: '/lms/prod1688Ranking/queryProd1688RankCategoryList',
    method: 'post',
    data
  });

export const get1688RankingList = (data) =>
  request({
    url: '/lms/prod1688Ranking/productTopListQuery',
    method: 'post',
    data,
    loading: true
  });

export const queryCateLike = (data) =>
  request({
    url: '/lms/prod1688Ranking/queryProd1688RankCategoryListLike',
    method: 'post',
    data,
    loading: true
  });
