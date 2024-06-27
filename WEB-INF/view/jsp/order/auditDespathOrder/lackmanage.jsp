<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>少货管理</title>
<style>
</style>


<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="lackmanageForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">缺货日期</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="lackmanage_time" name="shortageDate" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" class="warehouseId" lay-filter="lackmanage_warehouseId" id="lackmanageWarehouseId" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">楼栋</label>
                                <div class="layui-input-block">
                                    <select name="buildingNo" class="buildNo" lay-filter="lackmanage_buildNo">
<%--                                        <option value="">请选择</option>--%>
<%--                                        <option value="1">1</option>--%>
<%--                                        <option value="2">2</option>--%>
<%--                                        <option value="4">4</option>--%>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">楼层(区域)</label>
                                <div class="layui-input-block">
                                    <select name="floorNo" class="floorNo">
<%--                                        <option value="">请选择</option>--%>
<%--                                        <option value="1">1</option>--%>
<%--                                        <option value="2">2</option>--%>
<%--                                        <option value="3">3</option>--%>
<%--                                        <option value="4">4</option>--%>
<%--                                        <option value="5">5</option>--%>
<%--                                        <option value="6">6</option>--%>
<%--                                        <option value="7">7</option>--%>
<%--                                        <option value="8">8</option>--%>
<%--                                        <option value="9">9</option>--%>
<%--                                        <option value="10">10</option>--%>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">篮号类型</label>
                                <div class="layui-input-block">
                                    <select name="basketNoType">
                                        <option value="M">M篮</option>
                                        <option value="E">E篮</option>
                                        <option value="Q">Q篮</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">新配货状态</label>
                                <div class="layui-input-block">
<%--                                    <select name="newPickComplete">--%>
<%--                                        <option value="">请选择</option>--%>
<%--                                        <option value="true">已配货</option>--%>
<%--                                        <option value="false">未配货</option>--%>
<%--                                    </select>--%>
                                    <select name="pickStatus" id="pickStatus">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单状态</label>
                                <div class="layui-input-block">
                                    <select name="processStatusList"
                                        id="lackmanageOrderStatusId"
                                        xm-select="lackmanageOrderStatusId"
                                        lay-search
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">是否可发</label>
                              <div class="layui-input-block">
                                  <select name="sendable">
                                      <option value=""></option>
                                      <option value="true">是</option>
                                      <option value="false">否</option>
                                  </select>
                              </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select name="platCode" 
                                    id="lackmanagePlatCode" 
                                    xm-select="lackmanagePlatCode"
                                    lay-search
                                    xm-select-search
                                    xm-select-search-type="dl"
                                    xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" name="hasNewPickBatch" value="false">
                            <div class="layui-col-md12 layui-col-lg12" style="text-align:right;">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" lay-filter="lackmanageSearch"  lay-submit>查询</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="lackmanageCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="lackmanage-tabs"
                            id="lackmanage-tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">未生成<span></span></li>
                                    <li>已生成<span></span></li>
                                </ul>
                            </div>
                            <div style="display:flex;">
                              <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="lackmanage_judgeDeliveryBtn">判断是否可发</span>
                                 <span class="layui-btn layui-btn-sm layui-btn-normal" id="lackmanag_normalDeliveryBtn">正常发货</span>
                                <span class="layui-btn layui-btn-sm layui-btn-danger" id="lackmanage-delBtn"  style="margin-right:10px;">
                                    删除
                                </span>
                                <div class="layui-form" style="margin-right:10px;">
                                    <%-- <select id="lackmanage-pickUser" lay-search></select> --%>
                                    <input type="text" class="layui-input" id="lackmanage-pickUser" placeholder="设置拣货人">
                                </div>
                                <span class="layui-btn layui-btn-sm layui-btn-normal" id="lackmanage-generateBtn">
                                    生成配货单
                                </span>
                                <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="lackmanage-cancelBtn">
                                    取消配货单
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <table class="layui-table" id="lackmanage-table"
                    lay-filter="lackmanage-tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<%-- 弹框--多品缺货处理 --%>
<script type="text/html" id="waittopack_multiNoProdLayer">
    <div class="layui-row" style="padding:20px;">
        <%-- 搜索条件 --%>
        <div class="layui-card">
            <div class="layui-card-body">
                <div class="layui-form">
                    <label class="layui-form-label" style="width:110px;">订单编号或跟踪号</label>
                    <div class="layui-input-block" style="margin-left:140px;">
                        <input type="text" class="layui-input" style="width:300px;" name="orderOrTrackId">
                    </div>
                </div>
            </div>
        </div>
        <%-- 按钮操作 --%>
        <div class="layui-card">
            <div class="layui-card-header" style="text-align:right;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="waittopack_multiNoProdNormal">正常发货</span>
            </div>
            <div class="layui-card-body" id="waittopack_multiNoProdLayerContainer">

            </div>
        </div>
    </div>
</script>

<script src="${ctx}/static/js/order/lackmanage.js"></script>
<script src="${ctx}/static/components/lodash.js"></script>