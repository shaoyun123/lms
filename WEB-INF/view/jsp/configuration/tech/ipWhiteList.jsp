<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<title>IP白名单</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">IP白名单设置</div>
                <div class="layui-card-body" pad15>
                    <form class="layui-form" id="pc_ipWhiteListform">
                        <div class="layui-form-item">
                            <label class="layui-form-label">IP白名单</label>
                            <div class="layui-input-inline">
                                <textarea placeholder="输入IP白名单 0.0.0.0或者空表示允许全部,多个英文分号分割" class="layui-textarea" name="ipWhiteList"></textarea>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-input-block">
                                <a class="layui-btn layui-btn-sm" id="pc_ipWhiteListUpdata">更新</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    layui.use(['form'], function() {
        var form = layui.form;
        //初始化数据
        $.ajax({
            type: "GET",
            url: ctx + "/whitelist/listAllWhite.html",
            success: function(returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, {
                        icon: 2
                    });
                }else{
                    $("#pc_ipWhiteListform textarea[name=ipWhiteList]").val(returnData.data)
                }
            }
        });

        //监听提交
        $("#pc_ipWhiteListUpdata").click(function(){
            let ipWhiteList = $("#pc_ipWhiteListform textarea[name=ipWhiteList]").val();
            $.ajax({
                type: "POST",
                url: ctx + "/whitelist/updateWhite?ipList=" + ipWhiteList,
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
        });
    });
</script>
