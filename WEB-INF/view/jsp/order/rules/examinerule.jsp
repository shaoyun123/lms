<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>自动审核规则</title>

<style>

</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 表格-->
            <div class="layui-card">
                <div class="layui-card-body">
                   <table class="layui-table" id="examinerule_table" lay-filter="examinerule_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 操作栏 --%>
<script type="text/html" id="examinerule_tableIdBar">
    {{# if(!d.autoAudit){  }}
        <div><a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="enable">启用</a></div>
    {{# }else{ }}
        <div><a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="disable">停用</a></div>
    {{# } }}
</script>

<%-- 是否启用自动合单(只是展示用) --%>
<script type="text/html" id="examinerule_automerge">
    {{# if(d.autoAudit){  }}
        <div style="color:#5fb878">已启用</div>
    {{# }else{ }}
        <div style="color:#ff5722">未启用</div>
    {{# } }}
</script>

<script src="${ctx}/static/js/order/examinerule.js"></script>