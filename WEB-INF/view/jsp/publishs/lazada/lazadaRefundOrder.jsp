<%--
  Created by IntelliJ IDEA.
  User: shaohuiyun
  Date: 2022/1/18
  Time: 12:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>Lazada退款订单</title>
<style>
    .lazadaTextLeft{
        text-align: left;
    }

</style>
<div class="layui-fluid" id="">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="lazadaRefundOrderSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="lazadaRefundOrderDepart" lay-search name="deportId"
                                            lay-filter="lazadaRefundOrderDepartSel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="lazadaRefundOrderSalesman" lay-search name="salespersonId"
                                            lay-filter="lazadaRefundOrderSalesman" class="users_hp_custom"
                                            data-rolelist="lazada专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="lazadaRefundOrderStore" lay-search name="storeAcctIds"
                                            lay-filter="lazadaRefundOrderStore" class="users_hp_store_multi"
                                            data-platcode="lazada"></select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">店铺单号</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" placeholder="精确查询，多个逗号分隔" name="platOrderIds">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="lazadaROSelectSSku">
                                        <option value="storeSSkus">店铺SKU</option>
                                        <option value="prodSSkus">商品子SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off"
                                           placeholder="单个模糊,多个精确,逗号分隔" name="lazadaROSelectValue">
                                </div>
                            </div>

                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">收件人</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="shippingUsername">
                                </div>
                            </div>
                            <div class="layui-col-md6 layui-col-lg4">
                                <label class="layui-form-label">订单时间</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" id="orderTimeCn" name="orderTimeCn" readonly>
                                </div>
                            </div>

                            <div class="layui-col-md3 layui-col-lg2">
                                <div class="layui-input-block">
                                    <a id="lazadaRefundOrderSearchBtn" class="layui-btn layui-btn-sm" type="button">查询
                                    </a>
                                    <a type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                       id="lazadaRefundOrderResetBtn">清空</a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="lazadaRefundOrder_tab" id="lazadaRefundOrder_tab">
                        <div class="disFCenter">
                            <div style="height:42px;">
                                <ul class="layui-tab-title" style="width: 80%;">
                                    <li class="layui-this">数量(<span></span>)</li>
                                </ul>
                            </div>
                            <div>
                                <a class="layui-btn" id="lazadaRefundOrderExport" style="float: right;">导出</a>
                            </div>
                        </div>
                        <div class="layui-tab-content">
                            <table class="layui-table" id="lazadaRefundOrderTable"
                                   lay-filter="lazadaRefundOrderTable"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/lazada/lazadaRefundOrder.js"></script>

<!-- 表格 -->
<script type="text/html" id="lazadaRefundOrderTableSku">
    <div>{{d.prodSSku}}</div>
    {{# if(!d.isOnSale){ }}
        <span class="layui-badge layui-bg-orange">停售</span>
    {{# } }}
    {{# if(d.isLazadaTort){ }}
        <span class="layui-badge">侵权</span>
    {{# } }}
    {{# if(!d.isListingAble){ }}
        <span class="layui-badge layui-bg-gray">禁售</span>
    {{# } }}
</script>






