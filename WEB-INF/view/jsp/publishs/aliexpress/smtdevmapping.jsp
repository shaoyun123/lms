<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>速卖通开发映射</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" action="" lay-filter="component-form-group" id="sdm_searchForm">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="sdm_orgFilter" class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">速卖通销售员</label>
                                <div class="layui-input-block">
                                    <select name="smtUserId"  class="users_hp_custom" data-rolelist="smt专员" lay-filter="sdm_sellerFilter" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发人员</label>
                                <div class="layui-input-block">
                                    <select name="developUserId" lay-search="">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="layui-col-md2 layui-col-lg2" style="padding-left:20px">
                                    <button class="layui-btn layui-btn-sm keyHandle" type="button" id="sdm_searchBtn"
                                            lay-filter="demo1">搜索
                                    </button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="smtdevmappingCard">
                <div class="layui-card-header pora" style="background:#fff">
                    <button class="layui-btn layui-btn-sm" id="addDevMapping" style="float:right; margin: 10px;">新增</button>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="sdm_devMappingTable" lay-filter="sdm_devMappingTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 新增 -->
<script type="text/html" id="newdevelop_PhotographyLayer">
    <div style="padding:20px 50px 0 20px">
        <form class="layui-form" id="pd_photo">
            <div class="layui-form-item">
                <label class="layui-form-label">摄影专员</label>
                <div class="layui-input-block">
                    <select name="personId" lay-search=""  lay-verify="required">
                        <option value="">请选择</option>
                        <c:forEach items="${photos}" var="photo">
                            <option value="${photo.id}">${photo.userName}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">父SKU</label>
                <div class="layui-input-block">
                    <textarea name="skus" class="layui-textarea" lay-verify="required" placeholder="多个SKU请换行分隔"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="sdm_addMappingLayer">
    <div class="p20">
        <form action="" class="layui-form" id="sdm_addMappingForm">
            <input type="hidden" name="id">
                <div class="layui-form-item">
                    <label class="layui-form-label">速卖通专员</label>
                    <div class="layui-input-block">
                        <select name="smtUserId">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">开发专员</label>
                    <div class="layui-input-block">
                        <select name="developUserId" lay-search="">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
            <div class="layui-form-item">
                <label class="layui-form-label">覆盖达标数(销售)</label>
                <div class="layui-input-block">
                    <input type="number" min="0" class="layui-input" autocomplete="off"  name="standard"/>
                </div>
            </div>
                <div class="layui-form-item disN">
                    <div class="layui-input-block taRight">
                        <button class="layui-btn" lay-submit="" lay-filter="sdm_submitMapping"
                                id="sdm_submitMapping">
                            提交
                        </button>
                        <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                    </div>
                </div>
        </form>
    </div>
</script>
<script type="text/html" id="sdm_editBar">
    <a class="layui-btn layui-btn-normal layui-btn-xs mb5" lay-event="edit">修改</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs mb5" lay-event="del">删除</a>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtdevmapping.js"></script>