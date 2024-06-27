<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%-- 采集图片模块 --%>
<title>采集图片模块</title>
<div class="layui-fluid">
  <div class="layui-card" id="collectimg" style="padding: 20px 60px 20px 0;">
    <form class="layui-form" οnclick="return false" onkeypress="javascript:return NoSubmit(event);" id="capturePictureModuleForm" lay-filter="capturePictureModuleForm">
      <div style="display: flex;">
          <input class="layui-input" name="CPMCollectPicturesUrl" placeholder="暂仅支持1688，ebay，smt产品链接" style="margin: 0 10px;">
          <a class="layui-btn layui-btn-sm layui-btn-normal CPMCollectPictures">采集图片</a>
      </div>
      <div style="display: flex;justify-content: space-between;margin: 10px;">
          <div>
              <input type="checkbox" name="" title="全选" lay-skin="primary" lay-filter="capturePictureModuleUlCheckAll">
              <a class="layui-btn layui-btn-sm CPMPackageDownload">打包下载</a>
              <a class="layui-btn layui-btn-sm CPMOneClickDelete">一键删除</a>
              <a class="layui-btn layui-btn-sm CPMChangeWH" lay-tips="固定调整为1000*1000，不等比例调整">修改图片尺寸@</a>
          </div>
          <div>
              <a class="layui-btn layui-btn-sm" id="collectCopyImages">粘贴图片</a>
              <a class="layui-btn layui-btn-sm CPMLocalImg">本地图片</a>
              <a class="layui-btn layui-btn-sm layui-btn-primary CPMOneClickUndo">一键撤销</a>
              <!-- <a class="layui-btn layui-btn-sm layui-brn-primary CPMApplyToMain">应用至主图</a>
              <a class="layui-btn layui-btn-sm layui-brn-primary CPMApplyToOther">应用至辅图</a> -->
          </div>
      </div>
      <ul class="capturePictureModuleUl" style="display: flex;flex-wrap: wrap">
      <!-- :liStr -->
      </ul>
      <fieldset class="layui-elem-field layui-field-title">
          <legend>视频</legend>
      </fieldset>
      <ul class="captureMP4ModuleUl" style="display: flex;flex-wrap: wrap">
      </ul>
    </form>
  </div>
</div>

<script type="text/html" id="collect_cropImage_layer">
    <div style="width: 100%;height: 400px;margin-top: 30px;text-align: center;">
        <img id="collectCroppingImg" />
    </div>
  </script>
<style>
  .CPMApplyToMain,
  .CPMApplyToOther {
    display: none;
  }
</style>
<script src="${ctx}/static/util/downloadImage.js"></script>
<script src="${ctx}/static/layui/jszip.min.js?v=${ver}"></script>
<script src="${ctx}/static/layui/saveFile.js"></script>
<link rel="stylesheet" href="${ctx}/static/cropper.css" />
<script src="${ctx}/static/Cropper.js"></script>
<script src="${ctx}/static/jquery-cropper.js"></script>
<script type="text/javascript">
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

        // let arg = [].slice.call(arguments,0);
        // let isapplyMainPic = false;
        //     arg.indexOf("applyMainPic") != -1?isapplyMainPic = true:'';
        // if (isapplyMainPic) {
        //   $('.CPMApplyToMain').show()
        //   $('.CPMApplyToOther').show()
        // } else {
        //   $('.CPMApplyToMain').hide()
        //   $('.CPMApplyToOther').hide()
        // }

        let str = `
          <li li-index=":liIndex" item-id=":itemId">
              <div class="photo">
                  <div class="photo-table">
                      <input type="hidden" name="imgSrcHide">
                      <img class="img_show_hide" name="imgSrc" src=":src">
                  </div>
                  <div class="photo-tips">
                      尺寸：<span>:photoWH</span>
                  </div>
              </div>
              <div class="group">
              <div>
                  <a href="javascript:void(0)" title="全选">
                      <input type="checkbox" name="check" value=":liIndex" lay-skin="primary" lay-filter="capturePictureModuleUlCheckChild">
                  </a>
                  <div class="btnSelect_hp fr" style="width: 58px;">
                      <div class="title_btnSelect" style="background-color:#fff;"><img src="${ctx}/static/img/xt.png"><i style="color:#828282;vertical-align:-webkit-baseline-middle" class="layui-icon layui-icon-sanjiao1"></i></div>
                      <div class="optionBox_btnSelect">
                          <div class="optionCanvas_btnSelect" style="width: 120px">
                              <div class="option_imgSelect capturePictureModuleTranslate" type="button">图片翻译</div>
                              <div class="option_imgSelect capturePictureModuleCropping" type="button">修改尺寸</div>
                              <div class="option_imgSelect capturePictureCutOut" type="button">一键抠图</div>
                              <div class="option_imgSelect capturePictureModuleMeitu" type="button">美图秀秀</div>
                              <div class="option_imgSelect capturePictureModuleRuler" type="button">添加标尺</div>
                              <div class="translate_dialog">
                                <form id="translateForm" lay-fiter="translateForm" class="layui-form" action="">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md4 layui-col-lg4">
                                            <select name="transferSource" lay-filter="transferSource">
                                                <option value="zh" selected>中文</option>
                                                <option value="en">英文</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <div class="mid-tanfer-icon">
                                                <img src="${ctx}/static/img/transfer.png" />
                                            </div>
                                        </div>
                                        <div class="layui-col-md4 layui-col-lg4">
                                            <select name="transferTarget" lay-filter="transferTarget">
                                                <option value="zh">中文</option>
                                                <option value="en" selected>英文</option>
                                                <option value="vi">越南语</option>
                                                <option value="th">泰国语</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <button type="button" class="layui-btn layui-btn-primary layui-btn-sm languageTranslate">翻译</button>
                                        </div>
                                    </div>
                                </form>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
<%--                  <a href="javascript:void(0)" title="翻译" class="capturePictureModuleTranslate">--%>
<%--                      <img src="${ctx}/static/img/fy.png">--%>
<%--                  </a>--%>
<%--                  <a href="javascript:void(0)" title="裁剪" class="capturePictureModuleCropping">--%>
<%--                      <img src="${ctx}/static/img/cropping.png">--%>
<%--                  </a>--%>
<%--                  <a href="javascript:void(0)" title="抠图" class="capturePictureCutOut">--%>
<%--                    <img src="${ctx}/static/img/kt.png">--%>
<%--                  </a>--%>
<%--                  <a href="javascript:void(0)" title="美图秀秀" class="capturePictureModuleMeitu">--%>
<%--                      <img src="${ctx}/static/img/mei.png" width="30" height="30">--%>
<%--                  </a>--%>
                  <a href="javascript:void(0)" title="删除" class="capturePictureModuleDelete">
                      <img src="${ctx}/static/img/delete.png">
                  </a>
              </div>
          </li>
        `,
        mp4s = `
          <li li-index=":liIndex" item-id=":itemId">
              <div class="photo">
                  <div class="photo-table">
                      <video width="200" height="200" controls>
                          <source name="imgSrc" src=":src"  type="video/mp4">
                          您的浏览器不支持 HTML5 video 标签。
                      </video>
                  </div>
              </div>
              <div class="group">
                  <a href="javascript:void(0)" title="播放" class="border-l captureMp4ModuleOpen">
                      <i class="layui-icon layui-icon-play"></i>
                  </a>
                  <a href="javascript:void(0)" title="应用" class="border-l captureMp4ModuleApply">
                      <i class="layui-icon layui-icon-ok-circle" style="color: #FFB800;"></i>
                  </a>
                  <a href="javascript:void(0)" title="删除" class="capturePictureModuleDelete">
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjcyNDIzIDExLjU1NEM5Ljk4ODI3IDExLjU1NCAxMC4yMDIxIDExLjMzNTUgMTAuMjAyMSAxMS4wNjQ4VjUuODYwNjRDMTAuMjAyMSA1LjU5MDA2IDkuOTg4NzIgNS4zNzE0NCA5LjcyNDIzIDUuMzcxNDRDOS40NjA2IDUuMzcxNDQgOS4yNDY4NyA1LjU5MDA2IDkuMjQ2ODcgNS44NjA2NFYxMS4wNjQ4QzkuMjQ2ODcgMTEuMzM1NSA5LjQ2MDIxIDExLjU1NCA5LjcyNDIzIDExLjU1NFpNNS4yNzU3NiAxMS41NTRDNS41Mzk4NiAxMS41NTQgNS43NTMxMyAxMS4zMzU1IDUuNzUzMTMgMTEuMDY0OFY1Ljg2MDY0QzUuNzUzMTMgNS41OTAwNiA1LjUzOTg2IDUuMzcxNDQgNS4yNzU3NiA1LjM3MTQ0QzUuMDExNzMgNS4zNzE0NCA0Ljc5ODQ3IDUuNTkwMDYgNC43OTg0NyA1Ljg2MDY0VjExLjA2NDhDNC44MDg2MSAxMS4zMzU1IDUuMDIxODcgMTEuNTU0IDUuMjc1NzYgMTEuNTU0Wk03LjUgMTEuNTU0QzcuNzY0MSAxMS41NTQgNy45NzczNiAxMS4zMzU1IDcuOTc3MzYgMTEuMDY0OFY1Ljg2MDY0QzcuOTc3MzYgNS41OTAwNiA3Ljc2NDU1IDUuMzcxNDQgNy41IDUuMzcxNDRDNy4yMzU5NyA1LjM3MTQ0IDcuMDIyNjQgNS41OTAwNiA3LjAyMjY0IDUuODYwNjRWMTEuMDY0OEM3LjAyMjY0IDExLjMzNTUgNy4yMzU5NyAxMS41NTQgNy41IDExLjU1NFpNMTMuNTIyNyAyLjYyMzdIMTAuNTE2NVYyLjEzNDQ5QzEwLjUxNjUgMS41MDk5OSAxMC4wMTg4IDEgOS40MDkzOCAxSDUuNjAwNzdDNC45ODk5NiAxLjAwMTMzIDQuNDk1MTggMS41MDg0NiA0LjQ5Mzc1IDIuMTM0NDlWMi42MjM3SDEuNDc3MzZDMS4yMTMzMyAyLjYyMzcgMSAyLjg0MjI2IDEgMy4xMTI4NEMxIDMuMzgzNDkgMS4yMTMzMyAzLjYwMjA1IDEuNDc3MzYgMy42MDIwNUgyLjg5OTI0VjEyLjIwOThDMi44OTkyNCAxMy4xOTg1IDMuNjgxMzggMTQgNC42NDYxMSAxNEgxMC4zNTRDMTEuMzE4NyAxNCAxMi4xMDA4IDEzLjE5ODUgMTIuMTAwOCAxMi4yMDk4VjMuNTkxNjZIMTMuNTIyN0MxMy43ODY3IDMuNTkxNjYgMTQgMy4zNzMwMyAxNCAzLjEwMjQ1QzE0IDIuODMxODcgMTMuNzg2NyAyLjYyMzcgMTMuNTIyNyAyLjYyMzdaTTUuNDM4MjYgMi4xMzQ0OUM1LjQzODI2IDIuMDQwODMgNS41MDkzNyAxLjk2Nzk2IDUuNjAwNzYgMS45Njc5Nkg5LjQwOTM4QzkuNTAwNzYgMS45Njc5NiA5LjU3MTQ5IDIuMDQwODMgOS41NzE0OSAyLjEzNDQ5VjIuNjIzN0g1LjQzODI2VjIuMTM0NDlaTTExLjE0NjEgMTIuMjA5OEMxMS4xNDYxIDEyLjY1NzMgMTAuNzkwNiAxMy4wMjE2IDEwLjM1NDMgMTMuMDIxNkg0LjY0NjExQzQuMjA4ODUgMTMuMDIwOSAzLjg1NDYgMTIuNjU3OCAzLjg1Mzg5IDEyLjIwOThWMy41OTE2NkgxMS4xNDYxVjEyLjIwOThaIiBmaWxsPSIjRjUyMjJEIi8+Cjwvc3ZnPgo=">
                  </a>
              </div>
          </li>
        `;

        prodTpl_mainImg = [];
        prodTpl_assistImg = [];
        layui.form.render();


        // 采集图片
        $('#collectimg').find(".CPMCollectPictures").click(function(){
            CPMCollectPicturesFunc(str,mp4s)
        })
        // 打包下载
        $('#collectimg').find(".CPMPackageDownload").click(function(){
            CPMPackageDownloadFunc($('#collectimg'))
        })
        // 一键删除
        $('#collectimg').find(".CPMOneClickDelete").click(function(){
            CPMOneClickDeleteFunc()
        })
        // 修改图片尺寸
        $('#collectimg').find(".CPMChangeWH").click(function(){
            let checkData = serializeObject($("#capturePictureModuleForm"))
            if(!checkData.check){
                return layer.msg("请选择需要修改的图片")
            }
            let checkArr = checkData.check.split(",")
            $(".capturePictureModuleUl").find("li").each(function(index){
                let _this = this
                if(checkArr.indexOf($(_this).attr("li-index")) != -1){
                    // 修改为1000*1000
                    getImageBase64($(_this).find("img[name=imgSrc]").attr("src").split("?")[0])
                        .then((response)=>{
                            // 返回的是文件对象，使用变量接收即可
                            getBase64And1000(response)
                                .then(function(base64){
                                    $(_this).find("[name=imgSrcHide]").val($(_this).find("img[name=imgSrc]").attr("src"))
                                    $(_this).find("img[name=imgSrc]").attr("src",base64)
                                    $(_this).find("[name=imgSrcHide]").attr("size",$(_this).find(".photo-tips>span").text())
                                    $(_this).find(".photo-tips>span").text("1000 * 1000")
                                },function(err){
                                    console.log(err);//打印异常信息
                                });
                        })
                        .catch((e)=> {
                                console.error(e)
                            }
                        )
                }
            })
        })
        // 本地图片
        layui.upload.render({
            elem: '.CPMLocalImg' //绑定元素
            ,url:''
            ,multiple: true
            ,accept: 'images'
            ,auto: false //选择文件后不自动上传
            ,choose: function(obj){
                //将每次选择的文件追加到文件队列
                var files = obj.pushFile();
                //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                obj.preview(function(index, file, result){
                    tpl_calculateImageSize(result).then(function({width, height}) {
                        if(width > 500 || height > 500){
                            liStr = str.replaceAll(":src",result).replaceAll(":liIndex",new Date().getTime()).replaceAll(":photoWH",width + " * " + height).replaceAll(":itemId",'本地图片')
                            $(".capturePictureModuleUl").append(liStr)
                        } else {
                            layer.alert("图片大小必须大于500*500!",{icon:2})
                        }
                        layui.form.render('checkbox','capturePictureModuleForm')
                    });
                    // 取消全选
                    $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
                });
            }
        });
        // 一键撤销
        $('#collectimg').find(".CPMOneClickUndo").click(function(){
            let checkData = serializeObject($("#capturePictureModuleForm"))
            if(!checkData.check){
                layer.msg("请选择需要撤销的图片")
                return false;
            }
            let checkArr = checkData.check.split(",")
            $(".capturePictureModuleUl").find("li").each(function(index) {
                let _this = this
                if (checkArr.indexOf($(_this).attr("li-index")) != -1 && $(_this).find("[name=imgSrcHide]").attr("size") != '') {
                  // 恢复图片
                  $(_this).find("img[name=imgSrc]").attr("src",$(_this).find("[name=imgSrcHide]").val())
                  $(_this).find("[name=imgSrcHide]").val("")
                  // 恢复尺寸
                  $(_this).find(".photo-tips>span").text($(_this).find("[name=imgSrcHide]").attr("size"))
                  $(_this).find("[name=imgSrcHide]").attr("size","")
                }
            })
            layer.alert("撤销成功",{icon:1})
        })
        // 应用至主图
        $('#collectimg').find(".CPMApplyToMain").click(function(){
            CPMApplyToImgFunc("mainImgContains")
        })
        // 应用至辅图
        $('#collectimg').find(".CPMApplyToOther").click(function(){
            CPMApplyToImgFunc("assistImgContains")
        })

        // 暂时只需要支持smt
        $('#collectCopyImages').click(function() {
            navigator.clipboard.readText().then(text => {
            let collectInfo = JSON.parse(text)
            let images = collectInfo.images || []
            if (images.length === 0) {
                return layer.msg('没有图片可以粘贴', { icon: 2 });
            }
            images.forEach((item,index) => {
                let newItem = item?.split('?')[0]
                let itemSplitLen = newItem?.split(".")
                if(itemSplitLen[itemSplitLen.length-1] != "mp4"){
                    tpl_calculateImageSize(item).then(function({width, height}) {
                        if(width > 500 || height > 500){
                            liStr = str.replaceAll(":src",item).replaceAll(":liIndex",new Date().getTime()).replaceAll(":photoWH",width + " * " + height).replaceAll(":itemId", 'image')
                            $(".capturePictureModuleUl").append(liStr)
                        }
                        layui.form.render('checkbox','capturePictureModuleForm')
                    });
                    // 取消全选
                    $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
                }else{
                    // 视频
                    liStr = mp4s.replaceAll(":src",item).replaceAll(":liIndex",new Date().getTime())
                    $(".captureMP4ModuleUl").append(liStr)
                }
            })
        }).catch(err => {
            layer.msg('读取剪贴板中的文本失败', { icon: 2 });
        })
        })
        
    })

    // 采集图片
    function CPMCollectPicturesFunc(str,mp4s) {
        let liStr = ''
        let data = $("[name=CPMCollectPicturesUrl]").val();
        // 暂时测试使用
        if(data == ''){
            layer.msg("请输入采集链接")
            return false;
        }

        commonReturnPromise({
            url: '/lms/prodSupplier/getWangDuoYunCrawlerApiInformation.html',
            type:'POST',
            contentType:"application/json",
            params:JSON.stringify({"Url":data,"categoryForecast":"false"})
        }).then(res => {
            if(res.sku == undefined){
                res.sku = []
            }
            let newArr = [...res.images, ...res.desc,...res.sku]
            let itemId = res.item_id;
            newArr.forEach((item,index) => {
                let newItem = item?.split('?')[0]
                let itemSplitLen = newItem?.split(".")
                if(itemSplitLen[itemSplitLen.length-1] != "mp4"){
                    tpl_calculateImageSize(item).then(function({width, height}) {
                        if(width > 500 || height > 500){
                            liStr = str.replaceAll(":src",item).replaceAll(":liIndex",new Date().getTime()).replaceAll(":photoWH",width + " * " + height).replaceAll(":itemId",itemId)
                            $(".capturePictureModuleUl").append(liStr)
                        }
                        layui.form.render('checkbox','capturePictureModuleForm')
                    });
                    // 取消全选
                    $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
                }else{
                    // 视频
                    liStr = mp4s.replaceAll(":src",item).replaceAll(":liIndex",new Date().getTime())
                    $(".captureMP4ModuleUl").append(liStr)
                }
            })
        }).catch(err => {
            layer.msg(err, { icon: 2 });
        })
    }
    // 根据图片地址获取图片的宽和高
    const tpl_calculateImageSize = function(url) {
        return new Promise(function(resolve, reject) {
            const image = document.createElement("img");
            image.addEventListener("load", function(e) {
                resolve({
                    width: e.target.width,
                    height: e.target.height,
                });
            });

            image.addEventListener("error", function() {
                reject();
            });

            // 将图片的url地址添加到图片地址中
            image.src = url;
        });
    }

    // 打包下载
    function CPMPackageDownloadFunc(layero){
        let imgArr = [],checkData = serializeObject($('#capturePictureModuleForm'))
        if(!checkData.check){
            return layer.msg("请选择需要打包的图片")
        }
        let checkArr = checkData.check.split(",")
        let liLen = layero.find(".capturePictureModuleUl .layui-form-checked").length;
        layero.find(".capturePictureModuleUl>li").each(function(index) {
            let _this = this;
            if(checkArr.indexOf($(_this).attr("li-index")) != -1){
                let src = $(_this).find("img[name=imgSrc]").attr("src");
                getImageBase64(src.split("?")[0])
                    .then((response)=>{
                        imgArr.push({
                            url: response,
                            fileName: $(_this).attr("item-id") +"_" + index
                        })
                        if(imgArr.length == liLen){
                            packageImages(imgArr,getNowTime())
                        }
                    })
            }
        });
        // packageImages(imgArr,getNowTime())
    }

    // 一键删除
    function CPMOneClickDeleteFunc() {
        let checkData = serializeObject($("#capturePictureModuleForm"))
        if(!checkData.check){
            return layer.msg("请选择需要删除的图片")
        }
        let checkArr = checkData.check.split(",")
        $(".capturePictureModuleUl").find("li").each(function(index){
            let _this = this
            if(checkArr.indexOf($(_this).attr("li-index")) != -1){
                $(_this).remove()
            }
        })
        // 全部删除取消全选
        if($('.capturePictureModuleUl').find('li').length == 0){
            $("[lay-filter='capturePictureModuleUlCheckAll']").prop("checked",false);
            layui.form.render('checkbox','capturePictureModuleForm')
        }
    }
    // 应用至主图/辅图
    function CPMApplyToImgFunc(_container){
        let container
        if(_container == "mainImgContains"){
            container = $('[data-id=mainImgContains]')
        }else if(_container == "assistImgContains"){
            container = $('[data-id=assistImgContains]')
        }
        let checkData = serializeObject($("#capturePictureModuleForm"))
        if(!checkData.check){
            return layer.msg("请选择需要应用的图片")
        }
        let checkArr = checkData.check.split(","),checkFlag = false;
        // 目的为采集图片&视频添加的图片数量校验
        if(container.find('.uploadImgUL li').length*1 >= container.attr("data-maxImg")){
            return layer.alert("图片数量已达到上限",{icon:2})
        }
        $(".capturePictureModuleUl").find("li").each(function(index) {
            let _this = this
            let liIndex = $(_this).attr("li-index") // 当前索引，用以记录是否应用过主图/辅图
            // prodTpl_mainImg.indexOf(src) == -1  打开弹窗后，从没有应用过主图/辅图
            if(checkArr.indexOf($(_this).attr("li-index")) != -1 && prodTpl_mainImg.indexOf(liIndex) == -1 && $(_this).find(".photo-tips>span").text() == '1000 * 1000') {
                if(_container == "mainImgContains"){
                    prodTpl_mainImg.push(liIndex)
                }else if(_container == "assistImgContains"){
                    prodTpl_assistImg.push(liIndex)
                }
                let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
                // 判断图片是BASE64还是图片链接
                if(reg.test($(_this).find("img[name=imgSrc]").attr("src"))){
                    $.ajax({
                        type: "POST",
                        url: ctx + "/preProdDev/getBase64ImgForTpl.html",
                        data: {"AreaImgKey":$(_this).find("img[name=imgSrc]").attr("src")},
                        success: function (returnData) {
                            proTpl_showImg(returnData, container, false, false,false);
                            layui.form.render('checkbox')
                        },error:function(err){
                            layer.alert(err.msg,{icon:2})
                        }
                    })
                }else{
                    $.ajax({
                        type: "post",
                        url: ctx + "/prodTpl/getOnlinePic.html",
                        data: 'urlString=' + [$(_this).find("img[name=imgSrc]").attr("src")],
                        success: function(data) {
                            if (data) {
                                if (data.code == '0000') {
                                    proTpl_showImg(data.data, container, false, false,false);
                                    layui.form.render('checkbox')
                                } else if (data.code == '9999') {
                                    layer.msg(data.msg, { icon: 5 });
                                }
                            } else {
                                layer.msg('图片上传失败!', { icon: 2 })
                            }
                        }
                    });
                }
            }else if(checkArr.indexOf($(_this).attr("li-index")) != -1 && $(_this).find(".photo-tips>span").text() != '1000 * 1000'){ // 选中图片包含非1000*1000
                checkFlag = true;
            }
        })
        // 非1000*1000，报错提醒
        if(checkFlag){
            layer.alert("只有1000*1000的图片支持应用",{icon:2})
        }else{
            layer.alert("应用成功",{icon:1})
        }
    }
</script>