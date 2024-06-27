<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>ebay账单分析</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                     <form class="layui-form" lay-filter="component-form-group" id="ebay_entries_analysis_searchForm">
                        <div class="layui-form-item">
                                <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                    	<select name="orgId" lay-filter="entries_orgFilter" class="orgs_hp_custom" >
                                            <option value=""></option>
                                            </select>
                                        </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">销售人员</label>
                                        <div class="layui-input-block">
                                    	<select name="salePersonId"  class="users_hp_custom" data-rolelist="ebay专员" lay-filter="entries_sellerFilter" lay-search="">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                    <select name="platAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="entries_search-store" lay-search="" >
                                                    <option value=""></option>
                                            </select>
                                        </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">主站点</label>
                                        <div class="layui-input-block">
                                           <select name="mainSite" lay-search="">
                                    		</select>
                                        </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">仓库属性</label>
                                        <div class="layui-input-block">
                                            <select name="storeWarehouse">
		                                        <option value="">全部</option>
		                                        <option value="0">国内仓</option>
		                                        <option value="1">海外仓</option>
		                                    </select>
                                        </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">时间</label>
                                    <div class="layui-input-block"  id="entriesOrderTimeDiv">
                                        <input type="text" class="layui-input" id="ebayEntriesTime" name="ebayEntriesTime">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2 ml20">
                                    <button id="ebay_entries_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card"  id="incomeOutCard">
                <div class="layui-card-body">
                    <table class="layui-table" lay-filter="order_tablefilter" id="ebay_order_entries_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/statistics/ebay/ebayEntriesAnalysis.js"></script>
