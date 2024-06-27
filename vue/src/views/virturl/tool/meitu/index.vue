<script setup name="virturltoolmeitu">
  import MTImageEditor from 'mt-image-editor-sdk';
  const commonBase64ToBlob = (base64) => {
    let parts = base64.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;
    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };
  if (MTImageEditor.config.el == '#meitu_container') {
    console.log('销毁美图秀秀');
    MTImageEditor.destroy();
  }
  //初始化美图秀秀
  let imgWidth = window.innerWidth * 0.8;
  let imgHeight = window.innerHeight * 0.8;
  MTImageEditor.init({
    moduleName: 'image-editor-sdk',
    accessKey: 'e2fpgd2lXdoG0z8Ml7BqyOUd5EgZxcvW',
    title: '美图秀秀',
    resizeAble: true,
    width: imgWidth,
    height: imgHeight,
    el: '#meitu_container'
  });
  //保存回调base64：图片数据
  MTImageEditor.saveImage((base64) => {
    let blobFile = commonBase64ToBlob(base64);
    // 创建下载链接
    let downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blobFile);
    // 根据时间戳生成文件名
    let timestamp = new Date().getTime();
    let fileName = 'image_' + timestamp + '.png';
    downloadLink.download = fileName;
    // 触发下载
    downloadLink.click();
  });
</script>

<template>
  <div class="app-container">
    <div id="meitu_container"></div>
  </div>
</template>

<style lang="scss" scoped>
  #meitu_container {
    width: 100%;
    height: calc(100vh - 80px);
  }
</style>
