<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" href="${ctx}/static/img/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="${ctx}/static/layui/css/layui.css">
    <link rel="stylesheet" href="${ctx}/static/layui/css/admin.css">
    <link rel="stylesheet" href="${ctx}/static/layui/css/login.css">
    <script src="${ctx}/static/layui/layui.js"></script>
    <script src="${ctx}/static/jquery.js"></script>
    <script type="text/javascript" src="${ctx}/static/util/util.js"></script>
    <style>
        body {
            background: url(https://imghz.epean.com.cn/trade/loginback.jpg?v=${ver});
            background-size: cover;
        }
        .layadmin-user-login-main {
            background: rgba(0, 0, 0, 0.1);
        }
        .layadmin-user-login {
            padding: 0;
            top: 38%;
            min-height: auto
        }
        #fingerprintDiv{
            position: fixed;
            bottom: 20px;
            right: 50px;
        }
        /* #video-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          object-fit: cover;
        } */
    </style>
</head>

<body>
    <div class="layadmin-user-login layadmin-user-display-show" id="LAY-user-login" style="display: none;">
        <!-- <video id="video-background" autoplay loop muted poster>
          <source src="https://lms.epean.com.cn/trade-web/assets/sdkl1280-8d94c831.mp4" type="video/mp4" />
        </video> -->
        <div class="layadmin-user-login-main">
            <div class="layadmin-user-login-box layadmin-user-login-header">
                <h2 style="color: rgba(237, 246, 245, 1)">${appName}</h2>
                <p style="color: rgba(237, 246, 245, 1)">办公管理系统</p>
            </div>
            <div class="layadmin-user-login-box layadmin-user-login-body layui-form">
                <form id="loginForm" class="layui-form" method="post" action="${ctx}/doLogin.html">
                    <div class="layui-form-item">
                        <label class="layadmin-user-login-icon layui-icon layui-icon-username" for="LAY-user-login-username"></label>
                        <input type="text" name="username" id="LAY-user-login-username" lay-verify="required" placeholder="用户名" class="layui-input" required="true">
                    </div>
                    <div class="layui-form-item">
                        <label class="layadmin-user-login-icon layui-icon layui-icon-password" for="LAY-user-login-password"></label>
                        <input type="password" name="password" id="LAY-user-login-password" lay-verify="required" placeholder="密码" class="layui-input" required="true">
                        <input type="hidden" name="machineCode" autocomplete="off">
                    </div>
                    <div class="layui-form-item">
                        <button type="button" id="loginBtn" class="layui-btn layui-btn-fluid" lay-submit lay-filter="LAY-user-login-submit" style="background-color: rgba(219,185,44,0.15)">登 入</button>
                    </div>
                    <div class="layui-form-item" id="loginErr">
                        <span style="color:red;">${loginErr}</span>
                    </div>
                </form>
            </div>
        </div>
        <div id="fingerprintDiv"></div>
    </div>
    <script type="application/javascript">
        $("#loginBtn").click(function () {
            login()
        })
        
        // 密码回车登录
        $('#LAY-user-login-password').keyup(function(){
            if(event.keyCode===13){
                login()
            }
        })

        function login(){
            $.ajax({
                url: '/login',
                type: 'POST',
                data: serializeObject($('#loginForm')),
                dataType: 'JSON',
                headers: {
                    "machineCode": $('#loginForm').find('[name=machineCode]').val(),
                },
//                beforeSend: function (XMLHttpRequest) {
//                    XMLHttpRequest.setRequestHeader("machineCode", $('#loginForm').find('[name=machineCode]').val());
//                },
                success:function (data) {
                    if(data.success){
                        //登录成功跳转 lms首页
                        window.location.href="/lms/index.html";
                    }else{
                        $("#loginErr").text(data.msg);
                    }
                },error:function(data){
                    $("#loginErr").text(data.msg || "登录异常");
                }
            });
        }

        // 获取/生成指纹
        function uuid() {
            let s = [];
            let hexDigits = "0123456789abcdef";
            for (let i = 0; i < 32; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23];
            return s.join("");
        }
        //360浏览器（极速内核）
        function check360() {
            let result = false;
            for (let key in navigator.plugins) {
                // np-mswmp.dll只在360浏览器下存在
                if (navigator.plugins[key].filename == 'internal-nacl-plugin') {
                    return !result;
                }
            }
            return result;
        }

        //获取当前的浏览器
        function getBrowser() {
            // 获取浏览器 userAgent
            let ua = navigator.userAgent.toLowerCase();
            console.log(ua)
            // 是否为 Opera
            let isOpera = ua.indexOf('opr') > -1
            // 返回结果
            if (isOpera) { return 'Opera' }

            // 是否为 IE
            let isIE = (ua.indexOf('compatible') > -1) && (ua.indexOf('msie') > -1) && !isOpera
            let isIE11 = (ua.indexOf('trident') > -1) && (ua.indexOf("rv:11.0") > -1)
            // 返回结果
            if (isIE11) { return 'IE11'
            } else if (isIE) {
                // 检测是否匹配
                let re = new RegExp('msie (\\d+\\.\\d+);')
                re.test(ua)
                // 获取版本
                let ver = parseFloat(RegExp["$1"])
                // 返回结果
                if (ver == 7) { return 'IE7'
                } else if (ver == 8) { return 'IE8'
                } else if (ver == 9) { return 'IE9'
                } else if (ver == 10) { return 'IE10'
                } else { return "IE" }
            }

            //console.log(ua);
            // 是否为 Edge
            let isEdge = ua.indexOf("edg") > -1
            // 返回结果
            if (isEdge) { return 'Edge' }

            // 是否为 Firefox
            let isFirefox = ua.indexOf("firefox") > -1
            // 返回结果
            if (isFirefox) { return 'Firefox' }

            // 是否为 Safari
            let isSafari = (ua.indexOf("safari") > -1) && (ua.indexOf("chrome") == -1)
            // 返回结果
            if (isSafari) { return "Safari" }



            // 是否为 QQ
            let isQQ = ua.indexOf("qqbrowser") > -1
            // 返回结果
            if (isQQ) { return 'QQBrowser' }

            // 是否为搜狗浏览器
            let isMaxthon = ua.indexOf("se 2.x") > -1
            // 返回结果
            if (isMaxthon) { return 'sogou' }

            // 是否为2345浏览器
            let is2345Explorer = ua.includes("2345explorer");
            // 返回结果
            if(is2345Explorer){
                return '2345Browser';
            }

            // 是否为UC浏览器
            let isubrowser = ua.includes("ubrowser");
            // 返回结果
            if(isubrowser){
                return 'UCBrowser';
            }
            let is360 = check360() && (ua.indexOf("safari") > -1)
            if(is360){return '360Browser'}

            // 是否为 Chrome
            let isChrome = (ua.indexOf("chrome") > -1) && (ua.indexOf("safari") > -1) && (ua.indexOf("edge") == -1) && (ua.indexOf("qqbrowser") == -1) && (ua.indexOf("2345explorer") == -1) && (check360() == false)
            // 返回结果
            if (isChrome) { return 'Chrome' }
            // 都不是
            return ''
        }

        let browserInfo = getBrowser()
        console.log(browserInfo)
        let fingerprint = window.localStorage.fingerprint
        if (!fingerprint) {
            fingerprint = browserInfo+ '$'+ uuid()
            console.log(fingerprint)
            window.localStorage.fingerprint = fingerprint
        }
        $('#fingerprintDiv').text(fingerprint)
        $('#loginForm').find('[name=machineCode]').val(fingerprint)

    </script>
</body>
</html>