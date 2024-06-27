<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>域名管理</title>
<style>
    .fr {
        float: right;
    }
</style>
<div class="layui-fluid" id="LAY-DomainManage">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body"></div>
            </div>
        </div>
    </div>

    <form class="layui-form" id="DomainManageForm" lay-filter="DomainManageForm">
        <div class="layui-form-item">
            <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">域名</label>
                <div class="layui-input-block">
                    <input type="text" name="domain" class="layui-input">
                </div>
            </div>
            <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">销售平台</label>
                <div class="layui-input-block">
                    <select id="platCode" name="platCode" lay-search>
                    </select>
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-input-block">
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit id="DomainManageSearch" lay-filter="DomainManageSearch">查询</button>
                </div>
            </div>
        </div>
    </form>

    <div class="layui-card">
        <div style="height:42px;line-height:42px;">
            <div class="layui-card-header">
                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr" id="asyncDomainManage">同步</button>
            </div>
        </div>
        <div class="layui-card-body">
            <table lay-filter="DomainManageTable" class="layui-table" id="DomainManageTable"></table>
        </div>
    </div>
</div>

<script src="${ctx}/static/js/work/rim/domain.js"></script>