<template>
  <el-button
    :type="btnType"
    link
    style="font-size: 12px"
    @click="oneClickCutout()"
    >一键抠图</el-button
  >
</template>

<script setup name="OneClickCutout">
  import { computed } from 'vue';
  import { ElMessage } from 'element-plus';
  import { photoshopByFile, photoshopByUrl, getBase64Img } from '@/api/common';

  const props = defineProps({
    imgUrl: {
      type: String,
      default: ''
    },
    btnType: {
      type: String,
      default: 'primary'
    }
  });

  const mainImgUrl = computed({
    get() {
      return props.imgUrl;
    },
    set(val) {
      console.log(val);
      emits('update:imgUrl', val);
    }
  });

  const emits = defineEmits(['update:imgUrl']);

  //将base64转换成file
  function dataURLtoBlob(dataurl, name) {
    //base64转file
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], name, {
      type: mime
    });
  }

  // 一键抠图
  const oneClickCutout = async () => {
    let reg =
      /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;

    let type = '';
    if (props.imgUrl.includes('jpeg') || props.imgUrl.includes('jpg')) {
      type = 'image/jpeg';
    } else {
      type = 'image/png';
    }
    if (reg.test(props.imgUrl)) {
      // 需要抠图的图片url是base64
      let file = dataURLtoBlob(props.imgUrl, '1.jpg');
      let formData = new FormData();
      formData.append('files', file);
      const { code, data } = await photoshopByFile(formData);
      if (code === '0000') {
        getLmsImageUrl(data, type);
      }
    } else {
      // 需要抠图的图片url为网络链接
      const { code, data } = await photoshopByUrl([props.imgUrl]);
      if (code === '0000') {
        getLmsImageUrl(data, type);
      }
    }
  };

  const getLmsImageUrl = (res, type) => {
    if (Array.isArray(res) && res[0].state) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let image = new Image();
      image.src = res[0].imageUrl;
      image.setAttribute('crossOrigin', 'Anonymous');
      image.onload = async function () {
        canvas.width = this.width;
        canvas.height = this.height;
        if (type == 'image/png') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // // 在 canvas 上绘制原始图片，并缩放到目标尺寸
        ctx.drawImage(image, 0, 0);
        const newImageURL = canvas.toDataURL(type);

        let formData = new FormData();
        formData.append('AreaImgKey', newImageURL);
        try {
          let res = await getBase64Img(formData);
          if (res) {
            // 对点击事件进行处理
            // emits('getImgUrl', { newImg: res });
            mainImgUrl.value = res;
          }
        } catch (err) {
          console.log(err);
        }
      };
    } else {
      ElMessage.error('操作失败');
    }
  };
</script>
