<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<style>
    #amazon_analysis_card .layui-tab-title {
        height: 41px !important;
    }
</style>
<title>Amazon营收</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-form">
                        <form class="layui-form" lay-filter="component-form-group" id="amazon_analysis_search_form">
                            <div class="layui-form-item">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select name="orgId" lay-filter="amazon_analysis_orgFilter"
                                                class="orgs_hp_custom" lay-search="">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">销售人员</label>
                                    <div class="layui-input-block">
                                        <select name="salePersonId" class="users_hp_custom" data-rolelist="amazon专员"
                                                lay-filter="amazon_analysis_sellerFilter" lay-search="">
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select name="platAcctId" class="store_hp_custom" data-platcode="amazon"
                                                lay-filter="amazon_analysis_search-store" lay-search="">
                                            <option value="">全部</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item" style="margin-bottom: 0">
                                <div class="layui-inline" style="padding-top: 3px;">
                                    <label class="layui-form-label">查看月份</label>
                                    <div class="layui-inline" style="margin-top:2px" id="amazonAnalysisOrderTimeDiv">
                                        <input type="text" class="layui-input" id="amazonAnalysisOrderTime"
                                               name="amazonAnalysisOrderTime">
                                    </div>
                                    <div class="layui-inline">
                                        <button id="amazon_financial_search_btn"
                                                class="layui-btn layui-btn-sm keyHandle" type="button">搜索
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card" id="amazon_analysis_card">
                    <div class="layui-card-body">
                        <div class="layui-tab" lay-filter="amazon_analysis_tab_filter">
                            <ul class="layui-card-header layui-tab-title">
                                <li class="layui-this" orderType="0">直邮</li>
                                <li orderType="1">FBA</li>
                            </ul>
                            <div class="layui-tab-content">
                                <table class="layui-table" lay-filter="amazon_analysis_table_filter"
                                       id="amazon_analysis_table_filter"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!--二级分类类目模板-->
<script type="text/javascript" src="${ctx}/static/js/statistics/amazon/amazonanalysis.js"></script>
