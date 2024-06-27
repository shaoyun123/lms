<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>修改标题</title>
<style>
    #adjustPriceSearchForm .layui-form-item{
        margin-bottom:0
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label">字符</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="old_string" id="old_string" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">替换为</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="new_string" id="new_string" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <button type="button" id="mt_replaceSubtitle" class="layui-btn layui-btn-danger layui-btn-sm" >替换</button>
                            </div>
                            <div style="float:right;margin-top:5px;">
                                <button type="button" id="mt_modifySubtitle" class="layui-btn layui-btn-danger layui-btn-sm">批量调整</button>
                            </div>
                        </div>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">表格(<span id="tolnum_span_ebay_modifySubTitle"></span>)</div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="modifySubtitle_Table" lay-filter="modifySubtitle_Table"></table>
                    <script type="text/html" id="new_subTitle">
                        <input type="text" class="layui-input mt_newTitle" style="height:28px"  value="{{ d.subTitle || '' }}">
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/modifyMainSubtitle.js"></script>
