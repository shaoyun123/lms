<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>开发人员映射</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" action="" lay-filter="component-form-group" id="dm_searchForm">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发人员</label>
                                <div class="layui-input-block">
                                    <select name="developerId" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${developers}" var="developer">
                                            <option value="${developer.id}">${developer.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">初审专员</label>
                                <div class="layui-input-block">
                                    <select name="auditorId" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${auditers}" var="auditer">
                                            <option value="${auditer.id}">${auditer.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购助理</label>
                                <div class="layui-input-block">
                                    <select name="purchaseAssiId" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${purchasers}" var="purchaser">
                                            <option value="${purchaser.id}">${purchaser.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发组长</label>
                                <div class="layui-input-block">
                                    <select name="teamLeaderId" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${devLeaders}" var="devLeader">
                                            <option value="${devLeader.id}">${devLeader.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发主管</label>
                                <div class="layui-input-block">
                                    <select name="managerIds" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${devManagers}" var="manager">
                                            <option value="${manager.id}">${manager.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" style="padding-left:20px">
                                    <button class="layui-btn layui-btn-sm keyHandle" type="button" id="dm_searchBtn"
                                            lay-filter="demo1">搜索
                                    </button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="devmappingCard">
                <div class="layui-card-header">
                    <button class="layui-btn layui-btn-sm" id="addDevMapping">新增</button>
                    <span class="fr fRed">tips:该映射仅指定流程操作人员，系统中所有数据的查看权限都由组织架构决定</span>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="devMappingTable" lay-filter="devMappingTable"></table>
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
<script type="text/html" id="dm_addMappingLayer">
    <div class="p20">
        <form class="layui-form" id="dm_addMappingForm" lay-filter="dm_addMappingForm">
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">开发专员</label>
                    <div class="layui-input-block">
                        <select name="developerId" lay-verify="required" lay-search="">
                            <option value=""></option>
                            <c:forEach items="${developers}" var="developer">
                                <option value="${developer.id}">${developer.userName}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">SKU编码</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="skuPrefix" maxlength="6">
                    </div>
                </div>
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">初审专员</label>
                    <div class="layui-input-block">
                        <select name="auditorId" lay-search>
                            <option value=""></option>
                            <c:forEach items="${auditers}" var="auditer">
                                <option value="${auditer.id}">${auditer.userName}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">采购助理</label>
                    <div class="layui-input-block">
                        <select name="purchaseAssiId" lay-search>
                            <option value=""></option>
                            <c:forEach items="${purchasers}" var="purchaser">
                                <option value="${purchaser.id}">${purchaser.userName}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item" notNull>
                    <label class="layui-form-label">开发组长</label>
                    <div class="layui-input-block">
                        <select name="teamLeaderId" lay-search>
                            <option value=""></option>
                            <c:forEach items="${devLeaders}" var="devLeader">
                                <option value="${devLeader.id}">${devLeader.userName}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">开发主管</label>
                <div class="layui-input-block">
                    <select name="managerIds" lay-search="" lay-filter="devmapping_managerIdEdit" xm-select="devmapping_managerIdEdit" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                        <option value=""></option>
                        <c:forEach items="${devManagers}" var="manager">
                            <option value="${manager.id}">${manager.userName}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="dm_editBar">
    <a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit">修改</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
</script>
<script type="text/javascript" src="${ctx}/static/js/work/develop/devmapping.js"></script>