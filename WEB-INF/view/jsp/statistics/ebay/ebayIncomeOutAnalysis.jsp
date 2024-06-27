<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>ebay收支分析</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
         <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="component-form-group" id="ebay_income_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="income_orgFilter" class="orgs_hp_custom" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId"  class="users_hp_custom" data-rolelist="ebay专员" lay-filter="income_sellerFilter" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="platAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="income_search-store" lay-search="" >
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="ebayIncomeOutCard">
                <div class="layui-card-body">
                   <div class="layui-tab" lay-filter="ebay_analysis_income_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this" orderTimeTypeIn="1" >当月订单时间统计</li>
                            <li orderTimeTypeIn="2">当月罚款退款时间统计</li>
                        </ul>
                        <div class="layui-tab-content">
                           <table class="layui-table" lay-filter="order_tablefilter" id="ebay_order_table"></table>
                        </div>
                    </div>
                     <div style="position: absolute;top: 10px;right: 30px;">
                        <div style="float:right;">
                          <label class="layui-form-label">查看月份</label>
                          <div class="layui-inline" style="margin-top:2px" id="orderTimeDiv">
                            <input type="text" class="layui-input" id="ebayIncomeTime" name="ebayIncomeTime">
                         </div>
                        <div class="layui-inline">
                            <button id="ebay_income_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/statistics/ebay/ebayIncomeOutAnalysis.js"></script>
