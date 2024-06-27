<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%-- 抠图 --%>
<title>抠图</title>
<div class="layui-fluid">
  <div class="layui-card" id="mattingPic">
    <div style="padding: 20px 60px 20px 0;">
      <canvas id="matting_canvas" style="display: none"> 你的浏览器不支持 HTML5 canvas </canvas>
      <div style="padding: 10px;">
          <div style="display: flex;">
              <button class="layui-btn layui-btn-sm layui-btn-normal" name="matting_layer_btn_urlupload" id="matting_layer_btn_urlupload">URL上传</button>
              <button class="layui-btn layui-btn-sm layui-btn-normal" name="matting_layer_btn_upload" id="matting_layer_btn_upload">本地上传</button>
              &nbsp;&nbsp;<p>图片格式：JPG、PNG。 图片大小：小于1MB。图片分辨率 > 400*400.<br>支持多张同时上传，最多支持9张。</p>
          </div>
          <ul name="index1_matting_layer_ul" style="overflow-y:auto;height: 600px;display: flex;flex-wrap: wrap;flex: 0 1 33%;">
          </ul>
      </div>
      <div class="index1_matting_layer_btn">
          <div style="display: flex;">
              <form class="layui-form" id="index1_matting_layer_form">
                  <input type="radio" name="index1_download_img" value="jpg" title="下载JPG" checked>
                  <input type="radio" name="index1_download_img" value="png" title="下载PNG">
              </form>
              <button class="layui-btn layui-btn-sm layui-btn-normal" name="matting_layer_btn_download">打包下载</button>
              <button class="layui-btn layui-btn-sm layui-btn-normal" name="matting_layer_btn_imgdownload">图片下载</button>
          </div>
      </div>
    </div>

  </div>
</div>

<style>
  .index1_matting_layer_btn{
      /* position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px; */
      display: flex;
      justify-content: space-between;
      padding: 10px;
  }
  .matting_drag::before {
      content: "";
      width: 2px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 15px;
      background: #1E9FFF;
  }
  .matting_drag {
      height:calc(100% - 17px);
      position: absolute;
      left: 0;
      top:0;
      width: 32px;
      cursor: pointer;
  }
</style>
<script src="${ctx}/static/Cropper.js"></script>
<script src="${ctx}/static/jquery-cropper.js"></script>
<script src="${ctx}/static/util/downloadImage.js"></script>
<script src="${ctx}/static/layui/jszip.min.js?v=${ver}"></script>
<script src="${ctx}/static/layui/saveFile.js"></script>
<script type="text/javascript">
    let _layerX = 0;
    layui.use(['admin', 'form', 'table', 'laydate', 'upload', 'element', 'layedit', 'formSelects'], function () {
      var $ = layui.$,
        admin = layui.admin,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        upload = layui.upload,
        formSelects = layui.formSelects,
        form = layui.form
        form.render()

    let imgStr = `
        <li style="margin: 10px;position: relative;height: fit-content;">
            <div class="resize" style="width: 16px;position: absolute;overflow: hidden;">
                <img style="width: 400px;" src=":src" name="oldimg" data-name=":name">
            </div>        
            <div class="matting_drag" onclick="drag(event)" name="matting_drag">
                <img src="${ctx}/static/img/drag.png" style="position: relative;top: 45%;pointer-events: none">
            </div>
            <img style="width: 400px;" src=":newsrc" name="newimg" crossorigin="anonymous">
            <div style="display: flex;justify-content: space-between">
                <span></span>
                <span onclick="removeCurrentLi(this)" style="cursor: pointer;color: red;margin-right: 20px;">移除</span>
            </div>
        </li>`
      _layerX = $('#mattingPic')[0].getBoundingClientRect().left;
      // URL上传
      $('#matting_layer_btn_urlupload').on('click', function(){
          let layerIndex = layer.prompt({
              title: '图片URL',
              formType: 2,
              content: `<textarea class="layui-textarea" placeholder="请填写图片URL，多个换行" name="matting_layer_url" style="width:400px;height:60px;"></textarea>`,
              yes: function (_index, _layero) {
                  // 获取输入的url，换行分隔
                  let url = _layero.find("[name=matting_layer_url]").val().trim();
                  if (url == '') return layer.msg("请输入图片URL")
                  // 获取当前图片个数
                  let imgCount = $('#mattingPic').find("ul[name=index1_matting_layer_ul]>li").length || 0;
                  if(imgCount + url.split("\n").length > 9){
                      return layer.alert("最多支持9张,已上传" + imgCount + "张",{icon:5})
                  }
                  let str = ''
                  commonReturnPromise({
                      type: "post",
                      url: ctx + "/imageProcess/photoshopByUrl",
                      contentType:"application/json",
                      params: JSON.stringify(url.split("\n")),
                  }).then(res => {
                      let errMsg = '';
                      res.forEach((item,index) => {
                          if(item.state == true){
                              let str = imgStr.replace(":newsrc", item.imageUrl).replace(":name", item.name.split(".")[0]).replace(":src", url.split("\n")[index])
                              $('#mattingPic').find("[name=index1_matting_layer_ul]").append(str)
                          }else{
                              errMsg += item.name + ':' + item.msg + '<br>'
                          }
                      })
                      errMsg && layer.msg(errMsg, {icon: 5});
                      $("[name=matting_drag]").click()
                      form.render();
                  })
                  layer.close(layerIndex)
              }
          })
      })
      // 本地上传
      $('#mattingPic').find("[name=matting_layer_btn_upload]").on('click', function(){})
      let UPLOAD_FILES,UPLOAD_FILES_base64 = {};

      function clearFile() {
          for (let x in UPLOAD_FILES) {
              delete UPLOAD_FILES[x];
          }
      }

      //多图片上传
      let utils_uploadListIns = upload.render({
          elem: '#matting_layer_btn_upload'
          ,url: ctx + '/imageProcess/photoshopByFile' //此处配置你自己的上传接口即可
          ,multiple: true
          ,field:"files"
          ,accept:"images"
          ,number:9
          ,size: 1024 //最大允许上传的文件大小 单位KB
          ,before: function(obj){
              loading.show(); //上传loading
              let imgCount = $('#mattingPic').find("ul[name=index1_matting_layer_ul]>li").length || 0;
              let fileCount = 0;
              // 清空历史上传文件，解决choose只执行一次的问题！！！
              utils_uploadListIns.config.elem.next()[0].value = '';
              var that = this,fileArr = [];

              UPLOAD_FILES = obj.pushFile();
              clearFile(); //将所有文件先删除再说
              UPLOAD_FILES = obj.pushFile();

              for(let index in UPLOAD_FILES){
                  fileCount++;
              }

              obj.preview(function(index, file, result){
                  if (fileCount + imgCount > 9) {
                      delete files[index];
                      return layer.alert("最多支持9张,已上传" + imgCount + "张",{icon:5})
                  }
                  UPLOAD_FILES_base64[index] = result
              });
          }
          ,done: function(res, index, upload){
              layer.closeAll('loading');
              //上传完毕
              if (res.code == '0000') {
                  let errMsg = '';
                  res.data.forEach(item => {
                      if(item.state == true){
                          let str = imgStr.replace(":newsrc", item.imageUrl).replace(":name", item.name.split(".")[0]).replace(":src", UPLOAD_FILES_base64[index])
                          $('#mattingPic').find("[name=index1_matting_layer_ul]").append(str)
                          base64Url = ''
                      }else{
                          errMsg += item.name + ':' + item.msg + '<br>'
                      }
                  })
                  errMsg && layer.msg(errMsg, {icon: 5});
              } else if (res.code == '9999') {
                  layer.msg(res.msg, {icon: 5});
              }
              $("[name=matting_drag]").click()
          }
      });
      // 打包下载
      $('#mattingPic').find("[name=matting_layer_btn_download]").on('click', function(){
          let imgArr = [],data = serializeObject($('#index1_matting_layer_form'))
          $('#mattingPic').find("ul[name=index1_matting_layer_ul]>li").each(function() {
              let _this = this;
              imgArr.push({
                  url: $(_this).find("img[name=newimg]").attr("src"),
                  fileName: $(_this).find("img[name=oldimg]").data("name")+"."+data.index1_download_img
              })
          });
          packageImages(imgArr,"抠图" + getNowTime())
      })
      // 图片下载
      $('#mattingPic').find("[name=matting_layer_btn_imgdownload]").on('click', function(){
          let data = serializeObject($('#index1_matting_layer_form'))
          $.each($('#mattingPic').find("ul[name=index1_matting_layer_ul]>li"),function(){
              let _this = this;
              exportCanvasAsJPG($(_this).find("img[name=newimg]"), $(_this).find("img[name=oldimg]").data("name")+"."+data.index1_download_img,data.index1_download_img)
              // downLoadImg_utils($(_this).find("img[name=newimg]").attr("src"), $(_this).find("img[name=oldimg]").data("name")+"."+data.index1_download_img)
          })
      })

      function exportCanvasAsJPG(dom, fileName,type){
        let canvas = document.getElementById('matting_canvas');
        let context = canvas.getContext('2d');
        canvas.width = dom[0].naturalWidth;
        canvas.height = dom[0].naturalHeight;
        // context.fillStyle = "#fff";
        if(type == 'jpg'){
            context.fillStyle = "rgba(255, 255, 255, 1)";
        }else if(type == 'png'){
            context.fillStyle = "rgba(255, 255, 255, 0)";
        }
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
            dom[0], 0, 0
        );

        let MIME_TYPE = "";
        if(type == 'jpg'){
            MIME_TYPE = "image/jpeg";
        }else if(type == 'png'){
            MIME_TYPE = "image/png";
        }
        let imgURL = canvas.toDataURL(MIME_TYPE);
        let dlLink = document.createElement('a');
        dlLink.download = fileName;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }


    })
    var drag = function (obj) {
      $(obj.target).on("mousedown", start);

      function start(event) {
          if (event.button == 0) { //判断是否点击鼠标左键
              /*
          * clientX和clientY代表鼠标当前的横纵坐标
          * offset()该方法返回的对象包含两个整型属性：top 和 left，以像素计。此方法只对可见元素有效。
          * bind()绑定事件，同样unbind解绑定，此效果的实现最后必须要解绑定，否则鼠标松开后拖拽效果依然存在
          * getX获取当前鼠标横坐标和对象离屏幕左侧距离之差（也就是left）值，
          * getY和getX同样道理，这两个差值就是鼠标相对于对象的定位，因为拖拽后鼠标和拖拽对象的相对位置是不变的
          */
              // console.log(event.clientX)
              let targetLeft = $(obj.target).offset().left;
              gapX = event.clientX - targetLeft;
              gapIndex = $(obj.target).parents("li").index();
              //movemove事件必须绑定到$(document)上，鼠标移动是在整个屏幕上的
              $(document).bind("mousemove", move);
              //此处的$(document)可以改为obj
              $(document).bind("mouseup", stop);
          }
          return false; //阻止默认事件或冒泡
      }

      function move(event) {
          let left = event.clientX - _layerX - 400 * (gapIndex % 3)- 10 * (gapIndex % 3 + 3);

          if(left>=32&&left<=400){
              $(obj.target).css({
                  "left": left -32 + "px",
              });
              $(obj.target).prev(".resize").css({"width":left-16 + "px"})
          }
          return false; //阻止默认事件或冒泡
      }

      function stop() {
          //解绑定，这一步很必要，前面有解释
          $(document).unbind("mousemove", move);
          $(document).unbind("mouseup", stop);

      }
    }


    // 删除图片
    function removeCurrentLi(self) {
        $(self).closest('li').remove()
    }
</script>