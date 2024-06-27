<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title>Title</title>
    <script src="${ctx}/static/jquery.js"></script>
</head>
<body>
    <div>
    <p><a id="lazadaAuthCodeInfo">未授权</a></p>
    </div>
</body>
<script>
    var reg = new RegExp('(^|&)' + "code" + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        $('#lazadaAuthCodeInfo').html("授权Code:<b style='font-size:40px;color:#F00' id='lazadaAuthCode'>" + unescape(r[2]) + "</b>");
        $("#lazadaAuthCodeCopy_btn").show();
    }
</script>
