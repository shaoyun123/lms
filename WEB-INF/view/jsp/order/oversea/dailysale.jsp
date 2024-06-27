<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>海外仓销量统计</title>

<style>
.pageSort {
    display: block;
    width: 100%;
    background:#fff;
    position: fixed;
    left: 100px;
    bottom: 0;
}
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="dailysale_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">时间(发货/退款/仓储)</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="orderTimes" id="dailysale_orderTimes">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">注册sku</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="registerSkus">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" id="orgs_hp_saler_dailysaleForm">
                                <div class="layui-form-label labelSel">
                                    <select name="salesPersonOrgId" lay-filter="orgs_hp_saler_dailysale" class="orgs_hp_custom" data-id="dailysale_saler" data-title="部门" lay-search>
                                        <option value="">部门</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="salesPersonId"
                                    lay-search 
                                    lay-filter="users_hp_saler_dailysale" 
                                    class="users_hp_custom" 
                                    data-title="海外仓销售员" 
                                    data-id="dailysale_saler" 
                                    data-roleList="万邑通专员"
                                    >
                                        <option value="">海外仓销售员</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" id="orgs_hp_devPerson_dailysaleForm">
                                <div class="layui-form-label labelSel">
                                    <select name="bizzOwnerOrgId" lay-filter="orgs_hp_devPerson_dailysale" class="orgs_hp_custom" data-id="dailysale_devPerson" data-title="开发专员部门" lay-search>
                                        <option value="">开发专员部门</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerId"
                                    lay-search
                                    lay-filter="users_hp_devPerson_dailysale"  
                                    class="users_hp_custom" 
                                    data-title="开发专员" 
                                    data-id="dailysale_devPerson" 
                                    data-roleList="开发专员">
                                        <option value="">开发专员</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" name="statisticsType" id="dailysale_tabType" value="registerSku">
                            <div class="layui-col-lg2 layui-col-md2">
                                <div style="padding: 0 40px;">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="dailysale_submit">
                                    查询</span>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                                    <permTag:perm funcCode="dailysale_export">
                                    <button type="button" class="layui-btn layui-btn-sm" lay-submit lay-filter="dailysale_export">导出</button>
                                    </permTag:perm>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="dailysaleCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="dailysale-tabs" id="dailysale-tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">注册SKU<span>(0)</span></li>
                                    <li>开发专员出单销售<span></span></li>
                                    <li>开发专员当前销售统计<span></span></li>
                                    <li>商品SKU<span></span></li>
                                    <li>开发<span></span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <table class="layui-table" id="dailysale_table"></table>
                    <div id="dailysale_page" class="pageSort"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="${ctx}/static/js/order/oversea/dailysale.js?v=${ver}"></script>