<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>头程汇总</title>
<style>

</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" lay-filter="headsum_tableFilter" id="headsum_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 分抛系数 --%>
<script type="text/html" id="headsum_partThrowingWeightType">
    <div>
        {{# if(d.partThrowingWeightType == 4){ }}
        <span>分抛50%</span>
        {{# }else{ }}
        <span>全抛</span>
        {{# } }}
    </div>
</script>

<script src="${ctx}/static/js/wyt/logistics/headsum.js"></script>