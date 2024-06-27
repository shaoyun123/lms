/*
 * @Author: ztao
 * @Date: 2023-03-17 17:25:08
 * @LastEditTime: 2024-04-28 18:11:38
 * @Description:
 */
import axios from 'axios';
/**
 * 模拟表单提交
 * @param data  表单数据 json 格式
 * @param url  请求路径
 * @param target 可选，表单打开方式:_blank _self _parent _top
 */
export const submitForm = (data, url, target) => {
  const form = document.createElement('form');
  form.style = 'display:none';
  form.action = '/api' + url;
  form.method = 'post';
  form.target = target ? target : '_blank';
  document.body.appendChild(form);
  // 动态创建input并给value赋值
  for (let key in data) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  }
  form.submit();
  form.remove();
};

/**
 * 转化blob文件下载-只适合excel,其他类型需要改type,暂时不考虑
 * @param {Object} obj
 * @param obj.fileName: 下载下来的文件名称
 * @param obj.url: 需要执行的ajax链接,请求方式指定了必须是post
 * @param obj.data: 参数
 * @param obj.contentType 请求头 'application/json'
 * @param type 请求类型 get,post
 */
export const transBlob = (
  obj,
  method = 'post',
  type = 'application/vnd.ms-excel'
) =>
  new Promise(function (resolve, reject) {
    axios({
      url: '/api' + obj.url,
      method,
      headers: { 'Content-Type': obj.contentType },
      responseType: 'blob',
      data: obj.data,
      params: obj.params
    })
      .then((res) => {
        const result = res.data;
        const downloadA = document.createElement('a');
        const blob = new Blob([result], { type });
        downloadA.href = window.URL.createObjectURL(blob);
        let defaultFileName = window.decodeURI(
          res.headers['content-disposition']?.split('=')[1],
          'UTF-8'
        );
        downloadA.download = obj.fileName || defaultFileName;
        // downloadA.download = obj.fileName;
        downloadA.click();
        window.URL.revokeObjectURL(downloadA.href);
        resolve('下载完成');
      })
      .catch((err) => {
        console.log('err :>> ', err);
        reject('请求出错');
      });
  });

//文件以流的形式获取（参数url为文件链接地址）
export const getImgArrayBuffer = function (url) {
  return new Promise((resolve, reject) => {
    //通过请求获取文件blob格式
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);
    xmlhttp.responseType = 'blob';
    xmlhttp.onload = function (e) {
      if (e.target.status == 200) {
        resolve(e.target.response);
      } else {
        reject(e.target.status);
      }
    };
    xmlhttp.send();
  });
};
