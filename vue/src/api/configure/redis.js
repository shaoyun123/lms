import request from '@/utils/request';
import qs from 'qs';

export const searchkeyListApi = (key) =>
  request({
    url: `/lms/redis/searchkey.html?key=${key}`,
    loading: true
  });

export const delKeyApi = (data) =>
  request({
    url: '/lms/redis/delredis.html',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });

export const getHashRedisApi = (data) =>
  request({
    url: '/lms/redis/gethredis.html',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });
export const saveHashRedisApi = (data) =>
  request({
    url: '/lms/redis/savehredis.html',
    method: 'post',
    loading: true,
    data
  });

export const removeFiledApi = (data) =>
  request({
    url: '/lms/redis/removefield.html',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });

export const getStringredisApi = (data) =>
  request({
    url: '/lms/redis/getredis.html',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });
export const saveStringredisApi = (data) =>
  request({
    url: '/lms/redis/saveredis.html',
    method: 'post',
    loading: true,
    data: qs.stringify(data)
  });
