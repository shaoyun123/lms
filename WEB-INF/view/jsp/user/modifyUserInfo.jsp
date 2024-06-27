<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<title>修改个人设置</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md3 layui-col-lg3">
            <div class="layui-card">
                <div class="layui-card-header">个人设置</div>
                <div class="layui-card-body" pad15>
                    <form class="layui-form layui-form-pane" id="myUserInfo_form">
                        <div class="layui-form-item">
                            <label class="layui-form-label">性别</label>
                            <div class="layui-input-block">
                                <select name="gender" lay-filter="gender">
                                    <option value="true" selected>男</option>
                                    <option value="false">女</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item" lay-filter="birthday">
                            <label class="layui-form-label">生日</label>
                            <div class="layui-input-block">
                                <input type="text" name="birthdayStr" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">邮箱</label>
                            <div class="layui-input-block">
                                <input type="text" name="email" lay-verify="email|DingTalkOrEpeanEmail" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">手机</label>
                            <div class="layui-input-block">
                                <input type="text" name="mobile" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-input-block">
                                <button class="layui-btn" lay-submit lay-filter="myuUserInfo_submit_filter">确认修改</button>
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
    layui.use(['form', 'layedit',  "laydate",'laydate'], function(){
        var form = layui.form,
         laydate = layui.laydate;

        var form = layui.form
        //自定义验证规则
        form.verify({
            DingTalkOrEpeanEmail: [/^([a-zA-Z0-9_\.\-])+\@(dingtalk.com|epean.com.cn)+$/, '只能是epean邮箱或者钉钉邮箱']
        });

        form.on('submit(myuUserInfo_submit_filter)',function(data){
                 $.ajax({
                type:"post",
                url: ctx + "/sysuser/modifyMyUserInfo.html",
                data:data.field,
                dataType:"json",
                success:function(returnData){
                    if(returnData.code == "0000"){
                        layer.msg("修改成功");
                    }else{
                        layer.alert(returnData.msg,{icon:2});
                    }
                }
            });
            return false;
        });
        $.ajax({
            type: "post",
            url: ctx + '/sysuser/getMyUserInfo.html',
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var obj = returnData.data;
                    $("#myUserInfo_form select[name='gender']").val(obj.gender + "");
                    $("#myUserInfo_form input[name='birthdayStr']").val(obj.birthday);
                    $("#myUserInfo_form input[name='email']").val(obj.email);
                    $("#myUserInfo_form input[name='mobile']").val(obj.mobile);
                    form.render('select');
                    laydate.render({
                        elem: "#myUserInfo_form input[name='birthdayStr']"
                    });
                } else {
                    layer.msg(returnData.msg);
                }
            }
        });
    });
</script>