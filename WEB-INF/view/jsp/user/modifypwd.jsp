<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

        <title>修改密码</title>

        <div class="layui-card layadmin-header">
            <div class="layui-breadcrumb" lay-filter="breadcrumb">
                <a lay-href="">主页</a>
                <a><cite>设置</cite></a>
                <a><cite>我的密码</cite></a>
            </div>
        </div>

        <div class="layui-fluid">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-header">修改密码</div>
                        <div class="layui-card-body" pad15>
                            <form class="layui-form layui-form-pane" id="mp_form">
                                <div class="layui-form-item">
                                    <label class="layui-form-label">当前密码</label>
                                    <div class="layui-input-inline">
                                        <input type="password" name="oldPassword" lay-verify="required" lay-verType="tips" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">新密码</label>
                                    <div class="layui-input-inline">
                                        <input type="password" name="password" lay-verify="pass" lay-verType="tips" autocomplete="off" id="LAY_password" class="layui-input">
                                    </div>
                                    <div class="layui-form-mid layui-word-aux">6到12个字符</div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">确认新密码</label>
                                    <div class="layui-input-inline">
                                        <input type="password" name="repassword" lay-verify="pass|repass" lay-verType="tips" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-input-block">
                                        <button class="layui-btn" lay-submit lay-filter="mp_submit_filter">确认修改</button>
                                        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            layui.use(['form', 'layedit', 'laydate'], function() {
                var form = layui.form
                    //自定义验证规则
                form.verify({
                    pass: [/^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,12}$/, '密码必须6到12位字母数字组合'],
                    repass: function(value) {
                        var password = $("#mp_form input[name=password]").val();
                        if (value != password) {
                            return "两次输入密码不一致"
                        }
                    }
                });
                //监听提交
                form.on('submit(mp_submit_filter)', function(data) {
                    $.ajax({
                        type: "post",
                        url: ctx + "/sysuser/modifypwd.html",
                        data: data.field,
                        dataType: "json",
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                layer.msg("修改密码成功");
                                window.location = "/logout";
                            } else {
                                layer.alert(returnData.msg, {
                                    icon: 2
                                });
                            }
                        }
                    });
                    return false;
                });
            });
        </script>