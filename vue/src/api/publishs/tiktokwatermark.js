import request from '@/utils/request';
// 查询列表
export const queryListApi = (data) =>
  request({
    url: '/lms/plat/platWatermark/searchWatermark.html',
    method: 'POST',
    loading: true,
    data
  });

// 编辑水印图
export const editWatermarkApi = (data) =>
  request({
    url: '/lms/plat/platWatermark/editWatermark.html',
    method: 'POST',
    loading: true,
    data
  });

// 新增水印图
export const saveWatermarkApi = (data) =>
  request({
    url: '/lms/plat/platWatermark/saveWatermark.html',
    method: 'POST',
    loading: true,
    data
  });

// 删除
export const deleteWatermarkApi = (id) =>
  request({
    url: '/lms/plat/platWatermark/deleteWatermark.html?id=' + id,
    method: 'GET',
    loading: true
  });
