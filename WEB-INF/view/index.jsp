<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>${appName}</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <link rel="stylesheet" href="${ctx}/static/layui/css/layui.css" media="all">
        <link rel="stylesheet" href="${ctx}/static/layui/css/common.css?v=${ver}" media="all">
        <link rel="stylesheet" href="${ctx}/static/zTree/css/zTreeStyle/zTreeStyle.css" media="all">
		<link rel="stylesheet" href="${ctx}/static/select2/css/select2.min.css" media="all">
        <link rel="stylesheet" href="${ctx}/static/style/formSelects.css" media="all">
        <link rel="stylesheet" href="${ctx}/static/style/cascader.css" media="all">
        <link rel="stylesheet" href="${ctx}/static/tagsinput/tagsinput.css" media="all">
        <link rel="stylesheet" href="${ctx}/static/style/animate.min.css" media="all">
        <link rel="icon" href="${ctx}/static/img/${appLogo}" type="image/x-icon">
        <script>
            /^http(s*):\/\//.test(location.href) || alert('请先部署到 localhost 下再访问');
             if(location.href.indexOf("test.epean.cn")>-1||location.href.indexOf("192.168.0.76")>-1||location.href.indexOf("localhost")>-1){
                 document.title = '${appName}——测试'
             }
        </script>
    </head>
    <body>
        <div id="LAY_app" class="layadmin-side-shrink"></div>
        <script src="${ctx}/static/layui/layui.js"></script>
        <script src="${ctx}/static/jquery.js"></script>
        <script src="${ctx}/static/jquery.lazyload.min.js"></script>
        <script src="${ctx}/static/zTree/js/jquery.ztree.core.js"></script>
        <script src="${ctx}/static/zTree/js/jquery.ztree.excheck.js"></script>
        <script src="${ctx}/static/select2/js/select2.min.js"></script>
        <script src="${ctx}/static/template.js"></script>
        <script src="${ctx}/static/watermarkAPI/index-slider.js?v=${ver}"></script>
        <script src="${ctx}/static/util/fabric@4.6.0.js?v=${ver}"></script>
        <script src="${ctx}/static/commonMethods.js?v=${ver}"></script>
        <script src="${ctx}/static/util/util.js?v=${ver}"></script>
        <script src="${ctx}/static/util/enum.js?v=${ver}"></script>
        <script src="${ctx}/static/util/dragsort.js?v=${ver}"></script>
        <script src="${ctx}/static/util/lrz.bundle.js?v=${ver}"></script>
        <script src="${ctx}/static/util/generatePrint.js?v=${ver}"></script>
        <script src="${ctx}/static/util/regUtils.js?v=${ver}"></script>
        <script src="${ctx}/static/util/newWindow.js?v=${ver}"></script>
        <script src="${ctx}/static/scrollfix.js"></script>
        <script src="${ctx}/static/vue/js/axios.min.js"></script><!--新增-->
        <script src="${ctx}/static/components/echarts.min.js"></script>
        <script src="${ctx}/static/xm-select/xm-select.js"></script>
        <script src="${ctx}/static/util/base64.min.js"></script>
        <script src="https://public.static.meitudata.com/xiuxiu-pc/image-editor-sdk/3.2.0/dist/index.min.js"></script>
        <script type="text/javascript">
            var ctx = '${ctx}';
            var imageUpDomain = '${imageUpDomain}';
            var imageUpPath = '${imageUpPath}';
            var imgHttpsAddress = '${imgHttpsAddress}';
            var tplIVP = '${tplIVP}';
            var wishMainImgIVP = '${wishMainImgIVP}';
            var imgDomainName = '${imgDomainName}'
            var templateVedioUploadPath = '${templateVedioUploadPath}'
            var templateVedioVisitPath = '${templateVedioVisitPath}'
            let ver = '${ver}';

            layui.config({
                base: '${ctx}/static/', //指定 layuiAdmin 项目路径，本地开发用 src，线上用 dist
                version: ver
            }).extend({formSelects:'formSelects',selectN: 'selectN',tableMerge: 'tableMerge', selectInput: 'selectInput', layCascader: 'layCascader'}).use('index');

            $(function () {
                $('body').on('click','.returnTop',function () {
                    document.getElementsByClassName("layadmin-tabsbody-item layui-show")[0].scrollTop = 0
                })
            })
            var selfRoleNameList = []
            $.ajax({
                url: ctx + '/sysuser/listSelfRoleName.html',
                dataType: 'json',
                success:function (res) {
                    if (res.code === '0000') {
                        selfRoleNameList = res.data
                    }
                }
            })
            // 更新lmsAppUserName字段获取
            $.ajax({
                url: '/lms/sysuser/getMyUserInfo.html',
                method: 'post',
                dataType: 'json',
                success:function (res) {
                    if (res.code === '0000') {
                        window.localStorage.setItem('lmsAppUserName', res.data.loginName);
                        window.localStorage.setItem('lmsAppUserId', res.data.id);
                    }
                }
            })
            //初始化美图秀秀
            MTImageEditor.init({
              moduleName: 'image-editor-sdk',
              accessKey: 'e2fpgd2lXdoG0z8Ml7BqyOUd5EgZxcvW',
              title: '图片美化',
              resizeAble: true,
              width: 1400,
              height: 700,
            });
        </script>
        <div class="returnTop"><div class="layui-icon layui-icon-up"></div></div>
    </body>

    </html>