<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>备货配置</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <%--动态设置--%>
        <div class="layui-card clearLeft" id="fbapurchaseconfig_dynamicConfigContains">

        </div>
    </div>
</div>


<script type="text/html" id="dynamicParamTool_fbapurchaseconfig">
    <input type="hidden" dname="id" value="{{d.id || ''}}">
    {{# if (d.id) { }}
    <div class="layui-btn layui-btn-sm" onclick="fbapurchaseconfig_dynamicBtn(1,this)">保存</div>
    <div class="layui-btn layui-btn-sm layui-btn-danger" onclick="fbapurchaseconfig_dynamicBtn(2,this)">删除</div>
    {{# } else { }}
    <div class="layui-btn layui-btn-sm" onclick="fbapurchaseconfig_dynamicBtn(3,this)">新增</div>
    {{# } }}
</script>

<script type="text/javascript" src="${ctx}/static/js/fba/fbapurchaseconfig.js"></script>
