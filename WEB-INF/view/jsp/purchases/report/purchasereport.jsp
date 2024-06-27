<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>供应商信息表</title>
<style type="text/css">
    .layui-layout-body {
       overflow-x: hidden;
   }
   #buyerPurchaseReportCard .layui-table-body {
        height: 630px;
   }

</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="buyerProcessCountSearchForm">
                        <div class="layui-form-item" style="display:flex">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="month" readonly placeholder="请选择时间" class="layui-input" id="queryTime_purchaseReport">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">供应商</label>
                                <div class="layui-input-block">
                                    <input type="hidden" name="nameId">
                                    <div>
                                        <input id="name_purchaseReport"  name="name" class="layui-input" autocomplete="off"/>
                                    </div>
                                    <div class="dimResultDiv_purchaseReport"></div>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload" id="search_purchaseReport">搜索</button>
                                </div>
                            </div>
                            <div class="layui-col-md8 layui-col-lg8">
                                <permTag:perm funcCode="purchas_ereport_export">
                                    <button style="float: right" type="button" class="layui-btn layui-btn-normal ml20 layui-btn-sm" data-type="reload" id="search_purchaseExport">导出</button>
                                </permTag:perm>
                            </div>

                        </div>
                    </form>

                </div>
            </div>
            <div class="layui-card" id="buyerPurchaseReportCard">
                <div class="layui-card-body">
                    <span class="numCount">总数(<span id="buyerPurchaseReport_colLen"></span>)</span>
                    <!-- 表格的数据渲染 -->
                    <!-- <div style="overflow-x: auto;"> -->
                        <table class="layui-table" id="buyerPurchaseReport" lay-filter="buyerPurchaseReport"></table>
                    <!-- </div> -->
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/purchases/purchasereport.js"></script>