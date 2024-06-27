<%@ page language="java" import="java.util.*" session="false" contentType="text/html;charset=UTF-8"%>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>错误页面</title>
    <!-- load css -->
    <link rel="icon" href="${ctx}/static/img/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="${ctx}/static/layui/css/layui.css">
    <link rel="stylesheet" href="${ctx}/static/layui/css/admin.css">
    <link rel="stylesheet" href="${ctx}/static/layui/css/login.css">
    <style>
     #LAY-error {
         text-align:center;
     }
     #LAY-error>div {
         margin-top:50px;
         font-size:18px;
     }
     #LAY-error>div>a {
         color:#0000EE
     }
    </style>
</head>

<body>
    <div class="layui-fluid" id="LAY-error">
        <div>你所在的用户组没有权限访问该页面,点击回<a href="Javascript:;" class="errorBack">首页</a></div>
    </div>
    <script>
       layui.use(['admin','layer'],function(){
           var admin = layui.admin,
               layer = layui.layer,
               $ = layui.$;
            //事件处理
            $('.errorBack').click(function(){
                admin.events.closeAllTabs()
            })
            
       })
    </script>   
</body>
</html>