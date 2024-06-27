<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<title>登陆图上传</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <a class="layui-btn localLoginImg">选择图片</a>
                    <a class="layui-btn localUploadLoginImg">开始上传</a>
                    登录图需命名为    <span class="copySpan">
                            <a href="javascript:;" style="color: red">loginback.jpg</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
                                    onclick="layui.admin.copyTxt(this)" style="left: 300px;top: 25px;">复制</button>
                        </span>
                    当前图片名<span class="uploadLoginImgFileName"></span>
                    <div id="demo2"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    layui.use(['upload'], function () {
        let upload = layui.upload;
        let fileName = '';

        upload.render({
            elem: '.localLoginImg'
            , url: imageUpDomain + 'file/uploadFile' //此处配置你自己的上传接口即可
            , data: {
                "savePath": "/usr/local/epean/trade/"
            }
            , auto: false
            , bindAction: '.localUploadLoginImg'
            , number: 1 // 设置同时可上传的文件数量
            , choose: function (obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) {
                    // file.name = "loginback.jpg"
                    if (file.name != "loginback.jpg") {
                        // 请修改图片名称为”loginback.jpg“
                        $(".uploadLoginImgFileName").css("color","red")
                    }else{
                        $(".uploadLoginImgFileName").css("color","#5FB878")
                    }
                    fileName = file.name
                    $(".uploadLoginImgFileName").text(file.name)
                    $('#demo2').html('<img src="' + result + '" alt="' + file.name + '" class="layui-upload-img">')
                });
            }
            , done: function (res) {
                if (res.code == '0000') {
                    layer.alert('上传成功' + tplIVP + fileName);
                    // https://imghz.epean.com.cn/trade/loginback.jpg
                } else {
                    layer.msg(res.msg)
                }
            }
        });
    });
</script>
