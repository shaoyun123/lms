<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2022/9/19
  Time: 14:52
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>违禁词维护</title>
</head>
<body>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="public_prohibitWord_form">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select
                                            name="platCode"
                                            lay-search
                                            lay-filter="prohibitWord_form_platCode"
                                            id="prohibitWord_form_platCode"
                                    ></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="salesSite" id="prohibitWord_form_salesSite"
                                            xm-select="prohibitWord_form_salesSite"
                                            xm-select-search-type="dl" xm-select-search
                                            xm-select-skin="normal"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">检查模块</label>
                                <div class="layui-input-block">
                                    <select name="checkModules" id="prohibitWord_form_checked"
                                            xm-select="prohibitWord_form_checked"
                                            xm-select-search-type="dl" xm-select-search
                                            xm-select-skin="normal"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">违禁词</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="keywords" placeholder="单个模糊多个精准逗号隔开">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">替换词</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="replacedKeywords" placeholder="仅支持输入当地语种">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="display: flex;justify-content: center">
                                <a class="layui-btn layui-btn-sm" id="public_prohibitWord_search">搜索</a>
                                <a class="layui-btn layui-btn-sm layui-btn-primary" id="public_prohibitWord_reset">清空</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div style="display: flex;justify-content: space-between">
                        <div>
                            <permTag:perm funcCode="prohibitWord_export">
                                <a class="layui-btn layui-btn-sm layui-btn-normal" id="public_prohibitWord_export">导出</a>
                            </permTag:perm>
                        </div>
                        <div style="display: flex;justify-content: space-between;width: 270px;">
                            <permTag:perm funcCode="prohibitWord_download">
                                <a class="layui-btn layui-btn-sm" id="public_prohibitWord_download">导入模板下载</a>
                            </permTag:perm>
                            <permTag:perm funcCode="prohibitWord_import">
                                <a class="layui-btn layui-btn-sm" id="public_prohibitWord_import" onclick="document.getElementById('prohibitWord_import_actvt').click()">导入</a>
                            </permTag:perm>
                            <input type="file" hidden id="prohibitWord_import_actvt">
                            <permTag:perm funcCode="prohibitWord_add">
                                <a class="layui-btn layui-btn-sm" id="public_prohibitWord_add">新增</a>
                            </permTag:perm>
                            <permTag:perm funcCode="prohibitWord_delete_all">
                                <a class="layui-btn layui-btn-sm layui-btn-danger" id="public_prohibitWord_delete">批量删除</a>
                            </permTag:perm>
                        </div>
                    </div>
                    <table class="layui-table" id="prohibitWord_table" lay-filter="prohibitWord_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
<script type="text/html" id="public_prohibitWord_toolbar">
<permTag:perm funcCode="prohibitWord_edit">
    <a href="javascript:;" class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
</permTag:perm>
<permTag:perm funcCode="prohibitWord_delete">
    <a href="javascript:;" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a>
</permTag:perm>
</script>
<script type="text/html" id="public_prohibitWord_editModal">
    <form id="prohibitWord_layer_from" class="layui-form" style="padding: 10px 20px 0 0">
        <div class="layui-form-item layui-row" style="padding-left: 70px;">
            tips:<br>
            1、违禁词：填当地语种，且只允许输入1个单词或词组<br>
            2、替换词：填当地语种，且最多只允许输入1个单词或词组<br>
            3、违禁词、替换词（单个词或者词组）都会进行精准匹配
        </div>
        <div class="layui-form-item layui-row" notNull>
            <label class="layui-form-label"><font color="red">*</font>平台</label>
            <div class="layui-input-block">
                <select
                        name="platCode"
                        lay-search
                        lay-filter="prohibitWord_layer_platCode"
                        id="prohibitWord_layer_platCode"
                ></select>
            </div>
        </div>
        <div class="layui-form-item layui-row">
            <label class="layui-form-label"><font color="red">*</font>站点</label>
            <div class="layui-input-block">
                <select name="salesSite" id="prohibitWord_layer_salesSite"
                        xm-select="prohibitWord_layer_salesSite"
                        xm-select-search-type="dl" xm-select-search
                        xm-select-skin="normal"
                >
                </select>
            </div>
        </div>
        <div class="layui-form-item layui-row" notNull>
            <label class="layui-form-label"><font color="red">*</font>检查模块</label>
            <div class="layui-input-block">
                <select name="checkModules" id="prohibitWord_layer_checked"
                        xm-select="prohibitWord_layer_checked"
                        xm-select-search-type="dl" xm-select-search
                        xm-select-skin="normal"
                >
                </select>
            </div>
        </div>
        <div class="layui-form-item layui-row" notNull>
            <label class="layui-form-label"><font color="red">*</font>违禁词</label>
            <div class="layui-input-block">
                <input class="layui-input" placeholder="填当地语种" name="keywords">
            </div>
        </div>
        <div class="layui-form-item layui-row">
            <label class="layui-form-label">替换词</label>
            <div class="layui-input-block">
                <input class="layui-input" placeholder="填当地语种" name="replacedKeywords">
            </div>
        </div>
        <div class="layui-form-item layui-row">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
                <textarea class="layui-textarea" name="remark"></textarea>
            </div>
        </div>
    </form>
</script>

<script src="${ctx}/static/js/publishs/public/prohibitedWords.js"></script>