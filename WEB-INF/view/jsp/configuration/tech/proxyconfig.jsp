<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<title>全局代理</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">全局代理设置</div>
                <div class="layui-card-body" pad15>
                    <form class="layui-form" id="pc_proxyConfigform">
                        <div class="layui-form-item">
                            <label class="layui-form-label">代理开关</label>
                            <div class="layui-input-block">
                                <input type="checkbox"  name="open" lay-skin="switch"  lay-text="开启|关闭">
                            </div>
                            <div class="layui-form-mid layui-word-aux">更新代理后，需要在xxljob中刷新一下配置，以更新CPS</div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">代理服务器</label>
                            <div class="layui-input-inline">
                                <input type="text" name="proxyHost" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">代理服务端口</label>
                            <div class="layui-input-inline">
                                <input type="number" name="proxyPort" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">代理认证用户</label>
                            <div class="layui-input-inline">
                                <input type="text" name="proxyUsername" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">代理认证密码</label>
                            <div class="layui-input-inline">
                                <input type="text" name="proxyPassword" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">代理类型</label>
                            <div class="layui-input-block">
                                <input type="radio" name="proxyType" value="HTTP" title="HTTP" checked>
                                <input type="radio" name="proxyType" value="SOCKS" title="SOCKS" >
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">代理域名</label>
                            <div class="layui-input-inline">
                                <textarea placeholder="请输入代理的域名，多个换行分开" class="layui-textarea" name="domains"></textarea>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-input-block">
                                <button class="layui-btn layui-btn-sm"  id="pc_saveConfig">更新代理</button>
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
        var form = layui.form;
        //初始化数据
        $.ajax({
            type: "get",
            url: ctx + "/getproxyconfig.html",
            dataType: "json",
            success: function(returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, {
                        icon: 2
                    });
                } else {
                    let configData = returnData.data;
                    if(configData){
                        debugger;
                        $("#pc_proxyConfigform input[name=open]").prop("checked",configData.open);
                        $("#pc_proxyConfigform input[name=proxyHost]").val(configData.proxyHost);
                        $("#pc_proxyConfigform input[name=proxyPort]").val(configData.proxyPort);
                        $("#pc_proxyConfigform input[name=proxyUsername]").val(configData.proxyUsername);
                        $("#pc_proxyConfigform input[name=proxyPassword]").val(configData.proxyPassword);
                        $("#pc_proxyConfigform input[name=proxyType][value="+configData.proxyType+"]").prop("checked", true);
                        if(configData.domains){
                            $("#pc_proxyConfigform textarea[name=domains]").val(configData.domains.join("\n"));
                        }
                    }
                    layui.form.render();
                }
            }
        });

        //监听提交
        $("#pc_saveConfig").click(function(){
            //封装对象
            let requestData = {};
            requestData.open = $("#pc_proxyConfigform input[name=open]").prop("checked");
            requestData.proxyHost = $("#pc_proxyConfigform input[name=proxyHost]").val();
            requestData.proxyPort = $("#pc_proxyConfigform input[name=proxyPort]").val();
            requestData.proxyUsername = $("#pc_proxyConfigform input[name=proxyUsername]").val();
            requestData.proxyPassword = $("#pc_proxyConfigform input[name=proxyPassword]").val();
            requestData.proxyType = $("#pc_proxyConfigform input[name=proxyType]:checked").val();
            let domains = $("#pc_proxyConfigform textarea[name=domains]").val();
            if(domains){
                requestData.domains = $("#pc_proxyConfigform textarea[name=domains]").val().split("\n");
            }
            debugger;
            //请求后台
            $.ajax({
                type: "post",
                url: ctx + "/proxyconfig.html",
                data: JSON.stringify(requestData),
                dataType: "json",
                contentType: "application/json",
                success: function(returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("修改成功");
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