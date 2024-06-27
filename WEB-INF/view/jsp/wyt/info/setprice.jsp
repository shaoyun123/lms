<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>定价</title>

<style>
    .setprice_header,
    .setprice_td {
        display:flex;
        line-height: 32px;
    }
    .setprice_header>input.layui-input {
        width: 60px;
        margin: 0 5px;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="selection_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" id="setprice_warehouse">
                                        
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select name="logisAttr" id="setprice_logisticAttr">
                                       
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品成本(￥)</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="prodCost"> 
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">重量(g)</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="prodWeight">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">包裹长(cm)</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="wrapLength">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">包裹宽(cm)</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="wrapWidth">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">包裹高(cm)</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="wrapHeight">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">平台提成</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="platRate" value="0.15">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">毛利率</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="grossProfitRate" value="0.25">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺运输方式</label>
                                <div class="layui-input-block">
                                   <input type="text" class="layui-input" autocomplete="off" name="storeTransport">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="setprice_submit">定价</span>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" lay-filter="setprice_tableFilter" id="setprice_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 头程运费 --%>
<script type="text/html" id="setprice_headWayShipping">
    <div>
        <strong><font size="4">{{Number(d.headWayShipping).toFixed(2)}}</font></strong>
    </div>
</script>
<%-- 围城运费 --%>
<script type="text/html" id="setprice_tailWayShipping">
    <div>
        <strong><font size="4">{{Number(d.tailWayShipping).toFixed(2)}}</font></strong>
    </div>
</script>
<%-- 预估毛利 --%>
<script type="text/html" id="setprice_estimateGrossPrice">
    <div>
        <strong><font size="4">{{Number(d.estimateGrossPrice).toFixed(2)}}</font></strong>
    </div>
</script>
<%-- 仓库费用总和 --%>
<script type="text/html" id="setprice_warehouseFee">
    <div class="alignLeft">
        <div class="setprice_warehouseFeeDetail">
            <span>{{d.currency}}:</span><strong><font size="4">{{Number(d.warehouseFee).toFixed(2)}}</font></strong>
        </div>
        <input type="hidden" name="warehouseFeeDetail" value='{{JSON.stringify(d)}}'>
    </div>
</script>

<%-- VAT(含关税)vatAndTariff --%>
<script type="text/html" id="setprice_vatAndTariff">
    <div class="alignLeft">
        <span>USD:</span><strong><font size="4">{{Number(d.vatAndTariff).toFixed(2)}}</font></strong>
    </div>
</script>
<%-- 预估定价estimatePrice --%>
<script type="text/html" id="setprice_estimatePrice">
    <div class="alignLeft">
        <span>{{d.currency}}:</span><strong><font size="4">{{Number(d.estimatePrice).toFixed(2)}}</font></strong>
    </div>
</script>

<%-- 设置定价 --%>
<script type="text/html" id="setprice_price">
    <div class="setprice_td">
        <span>{{d.currency}}</span><input type="number" class="layui-input" name="setprice" autocomplete="off">
    </div>
</script>

<%-- 设置定价 --%>
<script type="text/html" id="setprice_toolBar">
    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="computed">计算毛利率</span>
</script>

<%-- 操作 --%>
<script type="text/html" id="setprice_toolBar">
    <span class="layui-btn layui-btn-sm layui-btn-normal" lay-event="computed">计算毛利率</span>
</script>


<script src="${ctx}/static/js/wyt/info/setprice.js"></script>