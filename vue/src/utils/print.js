/*
 * @Author: ztao
 * @Date: 2022-11-09 14:06:07
 * @LastEditTime: 2023-09-22 09:30:47
 * @Description:
 */
import qs from 'qs';
import axios from 'axios';
/**
 * epean 打印插件
 * epeanPrintPdf_plugin_fun 根据pdfurl打印pdf文件
 * epeanPrint_plugin_fun 其它jasper文件打印
 */
const cur_ip = 'http://localhost:9898/'; //默认使用ip

/**
 * 调用本地打印插件打印
 * @param printType 打印插件打印枚举类型
 * @param printArray 传入jasper模板文件的参数
 * @param backSuccessFun 成功后回调函数
 */
import { ElLoading, ElMessage } from 'element-plus';
export const epeanPrint_plugin_fun = (
  printType,
  printArray,
  backSuccessFun
) => {
  return new Promise((resolve, reject) => {
    const loadingInstance = ElLoading.service({
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.4)'
    });
    let obj = {
      printType: printType,
      printArray: JSON.stringify(printArray)
    };
    if (printType === 99) {
      obj = {
        printType: printType,
        printDto: JSON.stringify(printArray)
      };
    }
    axios({
      method: 'post',
      url: cur_ip,
      data: qs.stringify(obj)
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        var responseText = err.message;
        if (responseText == null || responseText.indexOf('打印成功') == -1) {
          ElMessage.error(
            '打印错误，请检查打印插件是否正常运行或者重新启动插件'
          );
        } else {
          if (backSuccessFun && typeof backSuccessFun == 'function') {
            console.log('执行backFun');
            backSuccessFun();
          }
        }
        reject();
      })
      .finally(() => {
        loadingInstance.close();
      });
  });
};

/**
 * 打印物流面单使用
 * @param obj
 * @returns {boolean}
 */
const logistics_label_pdf_print = (obj) => {
  obj.printType = 19;
  const loadingInstance = ElLoading.service({
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.4)'
  });
  return new Promise((resolve) => {
    axios({
      method: 'post',
      url: cur_ip,
      data: qs.stringify(obj)
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        var responseText = err.message;
        if (responseText == null || responseText.indexOf('打印成功') == -1) {
          ElMessage.error(
            '打印错误，请检查打印插件是否正常运行或者重新启动插件'
          );
        } else {
          resolve();
        }
      })
      .finally(() => {
        loadingInstance.close();
      });
  });
};

export async function commonExecutePrintJobs(printJobs) {
  for (let job of printJobs) {
    await logistics_label_pdf_print(job);
  }
  console.log('所有打印请求已完成');
}
