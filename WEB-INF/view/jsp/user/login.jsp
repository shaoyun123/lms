<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <script type="text/html" template>
        <link rel="stylesheet" href="{{ layui.setter.base }}style/login.css?v={{ layui.admin.v }}-2" media="all">
    </script>


    <div class="layadmin-user-login" id="LAY-user-login" style="display: none;">

        <div class="layadmin-user-login-main">
            <div class="layadmin-user-login-box layadmin-user-login-header">
                <h2>layuiAdmin</h2>
                <p>layui 官方出品的单页面后台管理模板系统</p>
            </div>
            <div class="layadmin-user-login-box layadmin-user-login-body layui-form">
                <div class="layui-form-item">
                    <label class="layadmin-user-login-icon layui-icon layui-icon-username" for="LAY-user-login-username"></label>
                    <input type="text" name="username" id="LAY-user-login-username" lay-verify="required" placeholder="用户名" class="layui-input">
                </div>
                <div class="layui-form-item">
                    <label class="layadmin-user-login-icon layui-icon layui-icon-password" for="LAY-user-login-password"></label>
                    <input type="password" name="password" id="LAY-user-login-password" lay-verify="required" placeholder="密码" class="layui-input">
                </div>
                <div class="layui-form-item">
                    <input type="checkbox" name="remember" lay-skin="primary" title="记住密码">
                </div>
                <div class="layui-form-item">
                    <button class="layui-btn layui-btn-fluid" lay-submit lay-filter="LAY-user-login-submit">登 入</button>
                </div>
                <div class="layui-trans layui-form-item layadmin-user-login-other">
                    <label>社交账号登入</label>
                    <a href="javascript:;"><i class="layui-icon layui-icon-login-qq"></i></a>
                    <a href="javascript:;"><i class="layui-icon layui-icon-login-wechat"></i></a>
                    <a href="javascript:;"><i class="layui-icon layui-icon-login-weibo"></i></a>
                </div>
            </div>
        </div>

        <div class="layui-trans layadmin-user-login-footer">

            <p>© 2018 <a href="http://www.layui.com/" target="_blank">layui.com</a></p>
            <p>
                <span><a href="http://www.layui.com/admin/#get" target="_blank">获取授权</a></span>
                <span><a href="http://www.layui.com/admin/pro/" target="_blank">在线演示</a></span>
                <span><a href="http://www.layui.com/admin/" target="_blank">前往官网</a></span>
            </p>
        </div>

        <!--<div class="ladmin-user-login-theme">
    <script type="text/html" template>
      <ul>
        <li data-theme=""><img src="{{ layui.setter.base }}style/res/bg-none.jpg"></li>
        <li data-theme="#03152A" style="background-color: #03152A;"></li>
        <li data-theme="#2E241B" style="background-color: #2E241B;"></li>
        <li data-theme="#50314F" style="background-color: #50314F;"></li>
        <li data-theme="#344058" style="background-color: #344058;"></li>
        <li data-theme="#20222A" style="background-color: #20222A;"></li>
      </ul>
    </script>
  </div>-->

    </div>

    <script>
        layui.use(['admin', 'form'], function() {
            var $ = layui.$,
                setter = layui.setter,
                admin = layui.admin,
                form = layui.form,
                router = layui.router();

            form.render();

            //提交
            form.on('submit(LAY-user-login-submit)', function(obj) {

                //请求登入接口
                admin.req({
                    url: '${ctx}/static/json/user/login.js' //实际使用请改成服务端真实接口
                        ,
                    data: obj.field,
                    done: function(res) {

                        //请求成功后，写入 access_token
                        layui.data(setter.tableName, {
                            key: setter.request.tokenName,
                            value: res.data.access_token
                        });

                        layer.msg('登入成功', {
                            offset: '15px',
                            icon: 1,
                            time: 1000
                        }, function() {
                            location.hash = '/';
                        });
                    }
                });

            });


        });
    </script>