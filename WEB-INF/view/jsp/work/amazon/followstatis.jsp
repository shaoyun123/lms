<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>跟卖统计</title>

<style>
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="followstatis_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="times" id="followstatis_timeRange" readonly>
                                </div> 
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">创建人</label>
                                <div class="layui-input-block">
                                    <select name="createPersonId" id="followstatis_creator" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 followstatis_store">
                                <label class="layui-form-label">订单店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeId" id="followstatis_store"  lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2  followstatis_asin">
                                <div class="layui-form-label labelSel">
                                    <select name="skuType">
                                        <option value="1">子ASIN</option>
                                        <option value="2">商品SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="sku">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 followstatis_order_field">
                                <label class="layui-form-label ">排序</label>
                                <div class="layui-input-block">
                                    <select name="orderField" lay-search>
                                        <option value="">请选择</option>
                                        <option value="saleAmount asc">销售额升序</option>
                                        <option value="saleAmount desc">销售额降序</option>
                                        <option value="orderNumber asc">订单量升序</option>
                                        <option value="orderNumber desc">订单量降序</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" name="queryType" value="1" id="followstatis_queryType">
                            <div class="layui-col-md2 layui-col-lg2 pl20" style="display: flex">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="followstatis_submit">查询</span>
                                <span class="layui-btn layui-btn-sm layui-btn-normal followstatis_export"  lay-submit lay-filter="followstatis_export">导出</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="followstatisCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="followstatis_tabs" id="followstatis_tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">ASIN维度<span></span></li>
                                    <li>人员维度<span></span></li>
                                    <li>分配店铺ASIN<span></span></li>
                                    <li>首单统计<span></span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <table class="layui-table" id="followstatis_table" lay-filter="followstatis_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 创建人点击事件 --%>
<script type="text/html" id="followstatis_creatorTable">
    <div>
        <span lay-event="creator" class="canClickEl">{{d.creator}}</span>
    </div>
</script>
<%-- 查看创建人详情 --%>
<script type="text/html" id="followstatis_detail">
    <div>
        <table class="layui-table" id="followstatis_detailTable"></table>
    </div>
</script>
<script id="followstatisCreateTime" type="text/html">
    <div>
        <div><span>{{Format(d.createTime , 'yyyy-MM-dd hh:mm:ss') || ''}}</span></div>
    </div>
</script>
<script src="${ctx}/static/js/work/amazon/followstatis.js?v=${ver}"></script>