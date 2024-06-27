<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>${appName}</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta HTTP-EQUIV="pragma" CONTENT="no-cache">
    <meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache, must-revalidate">
    <meta HTTP-EQUIV="expires" CONTENT="0">
    <link rel="stylesheet" href="${ctx}/static/layui/css/layui.css" media="all">
    <link rel="stylesheet" href="${ctx}/static/layui/css/common.css" media="all">
    <link rel="stylesheet" href="${ctx}/static/zTree/css/zTreeStyle/zTreeStyle.css" media="all">
    <link rel="stylesheet" href="${ctx}/static/select2/css/select2.min.css" media="all">
    <link rel="stylesheet" href="${ctx}/static/style/formSelects.css" media="all">
    <link rel="stylesheet" href="${ctx}/static/tagsinput/tagsinput.css" media="all">
    <link rel="stylesheet" href="${ctx}/static/style/animate.min.css" media="all">
    <link rel="icon" href="${ctx}/static/img/${appLogo}" type="image/x-icon">
    <script src="${ctx}/static/layui/layui.js"></script>
    <script src="${ctx}/static/layui/layui.all.js"></script>
    <script src="${ctx}/static/jquery.js"></script>
    <script src="${ctx}/static/jquery.lazyload.min.js"></script>
    <script src="${ctx}/static/zTree/js/jquery.ztree.core.js"></script>
    <script src="${ctx}/static/zTree/js/jquery.ztree.excheck.js"></script>
    <script src="${ctx}/static/select2/js/select2.min.js"></script>
    <script src="${ctx}/static/template.js"></script>
    <script src="${ctx}/static/util/util.js?v=${ver}"></script>
    <script src="${ctx}/static/util/newWindow.js?v=${ver}"></script>
    <script src="${ctx}/static/util/littleLove.js?v=${ver}"></script>
    <script>
        var ctx = '${ctx}';
        var tplIVP = '${tplIVP}'
        var imgDomainName = '${imgDomainName}'
     </script>
    <style>
        .hp_popWindow_bottomBox{
            height: 50px;
            position: fixed;
            bottom:0;
            left:0;
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .3);
            width: 100%;
            line-height: 50px;
            background-color: white;
            padding-top: 10px;
        }
    </style>
    <script type="text/html" id="bottomBox">
        <div class="hp_popWindow_bottomBox">
            <div class="fr mr30">
            </div>
        </div>
    </script>
</head>


<body>

</body>

<script>
    $(function () {
        var layer = layui.layer,
            form = layui.form,
            table = layui.table
        window.setTimeout(function () {
            form.render('select')
            form.render('radio')
            if (typeof success == 'function') {
                success(originData)
                AppendBottomBox()
            } else { // 增强可用性
                var index = window.setInterval(function () {
                    if (typeof success == 'function') {
                        success(originData)
                        AppendBottomBox()
                        window.clearInterval(index)
                    }
                },1000)
            }
        },100)

        function AppendBottomBox() {
            if (window.childWindowBtn) {
                // 加上底部按钮
                var bottom = $($('#bottomBox').html())
                $('body').append(bottom)
                var btn
                for (var i = 0; i < window.childWindowBtn.length; ++i) {
                    if (i == 0) {
                        btn = $('<div class="fl childWindowbtn'+ i +'" ><button class="layui-btn layui-btn-sm">'+ window.childWindowBtn[i] +'</button></div>')
                        $('.hp_popWindow_bottomBox>div').append(btn)
                    } else {
                        btn = $('<div class="fl childWindowbtn'+ i +'" ><button class="layui-btn layui-btn-primary layui-btn-sm">'+ window.childWindowBtn[i] +'</button></div>')
                        $('.hp_popWindow_bottomBox>div').append(btn)
                    }
                    // 绑定事件
                    $('.childWindowbtn' + i).click(btnFunction['btn' + i])
                }



            }
        }
    })
</script>
</html>


