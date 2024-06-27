import axios from 'axios';
import { ElMessage } from 'element-plus';

export const comBlobToDataURL = (rawFile, callback) => {
  blobToDataURL(rawFile, function (base64) {
    const fd = new FormData();
    fd.append('AreaImgKey', base64);
    axios({
      method: 'post',
      url: '/api/lms/preProdDev/getBase64Img.html',
      data: fd
    })
      .then(({ data, status, statusText }) => {
        if (status === 200) {
          callback(data);
        } else {
          throw statusText;
        }
      })
      .catch(() => {
        ElMessage.error('上传图片失败');
      })
      .finally(() => {
        // loadingInstance.close();
      });
  });
};
//blob转换成base64
const blobToDataURL = (blob, callback) => {
  let a = new FileReader();
  a.onload = function (e) {
    callback(e.target.result);
  };
  a.readAsDataURL(blob);
};
