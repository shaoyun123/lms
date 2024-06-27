<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>Wish收支分析</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
        <div class="layui-card">
                <div class="layui-card-body">
                        <div class="layui-form">
                         <form id="wishIncomeAnalysisSearchForm" lay-filter="prod_search_form" class="layui-form">
                        
                            <div class="layui-form-item" style="margin-bottom: 0">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
	                                	<select placeholder="" name="storeAcct" id="wishBalanceAnalyze_depart_sel" lay-search lay-filter="wishBalanceAnalyze_depart_sel" class="orgs_hp_custom"></select>
                               	</div>
                            </div>
                             <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
	                                	<select placeholder="" name="saleName" id="wish_salesman_sel" lay-search lay-filter="wish_salesman_sel" class="users_hp_custom" data-rolelist="wish专员" ></select>
                             	</div>
                            </div>
                             <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block" lay-filter="component-form-element">
                                        <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"  class="store_hp_custom" data-platcode="wish">
                                        </select>
                                    </div>
                            </div>
                            </div>
							</form>                            
                        </div>
                </div>
            </div>
            <div class="layui-card" id="wishIncomeOutCard">
                <div class="layui-card-body">
                   <div class="layui-tab" lay-filter="wish_analysis_income_tab_filter">
                        <ul class="layui-tab-title layui-card-header">
                            <li class="layui-this" orderTimeTypeIn="1" >当月订单时间统计</li>
                            <li orderTimeTypeIn="2">当月罚款退款时间统计</li>
                        </ul>
                        <div class="layui-tab-content">
                           <table class="layui-table" lay-filter="order_tablefilter" id="order_table"></table>
                        </div>
                    </div>
                     <div style="position: absolute;top: 10px;right: 30px;">
                        <div style="float:right;">
                          <label class="layui-form-label">查看月份</label>
                          <div class="layui-inline" style="margin-top:2px" id="wishBalanceAnalyze_orderTimeDiv">
                            <input type="text" class="layui-input" id="incomeTime" name="incomeTime">
                         </div>
                        <div class="layui-inline">
                            <button id="income_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/statistics/wish/wishIncomeOutAnalysis.js"></script>
