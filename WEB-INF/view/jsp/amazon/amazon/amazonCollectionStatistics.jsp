<%--
  Created by IntelliJ IDEA.
  User: shaohuiyun
  Date: 2021/7/13
  Time: 9:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>回款统计</title>
</head>
<body>
<div class="layui-fluid" id="amazonCollectionStatistics">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="amazonCollectionStatistics_SearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonOrgId" lay-search lay-filter="salesPersonOrgId"
                                            class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonId" lay-search lay-filter="salesPersonId"
                                            class="users_hp_custom" data-rolelist="amazon专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctIdList" lay-search lay-filter="storeAcctIdList"
                                            xm-select="storeAcctIdList" class="users_hp_store_multi"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            class="store_hp_custom" data-platcode="amazon">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="siteIdList" lay-search lay-filter="amazon_online_site_sel"
                                            xm-select="amazon_online_site_sel" class="salesSite_hp_custom"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">结算状态</label>
                                <div class="layui-input-block">
                                    <select name="paymentStatus" lay-search>
                                        <option value="">全部</option>
                                        <option value="1">已结算</option>
                                        <option value="2">未结算</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">转账状态</label>
                                <div class="layui-input-block">
                                    <select name="depositStatus" lay-search>
                                        <option value="">全部</option>
                                        <option value="1">成功</option>
                                        <option value="2">失败</option>
                                        <option value="3">处理中</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">结算结束日期</label>
                                <div class="layui-input-block">
                                    <input type="text" name="settlementEndDate" autocomplete="off" class="layui-input"
                                           id="settlementEndDate" placeholder="请选择日期">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">转账日期</label>
                                <div class="layui-input-block">
                                    <input type="text" name="depositTime" autocomplete="off" class="layui-input"
                                           id="depositTime" placeholder="请选择日期">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">账户尾号</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="accountEndingNumber" placeholder="请输入账户尾号">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">追踪编码</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="traceId" placeholder="请输入追踪编码">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">结算组编号</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="settlementGroupId" placeholder="请输入结算组编号">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button"
                                        id="amazonCollectionStatistics_search">查询
                                </button>
                                <button class="layui-btn ml20 layui-btn-sm" type="reset"
                                        id="">清空
                                </button>
                            </div>
                        </div>
                    </form>
                    <div id="LAY-amazon-prod-etra-info-div"></div>
                </div>
            </div>
            <div class="layui-card" id="amazonProdExtraInfoCard">
                <div class="layui-card-body" id="amazonCollectionStatisticsTableDiv">
                    <div style="display: flex;justify-content: flex-end;padding: 10px;">
                        <a class="layui-btn" id="amazonCollectionStatistics_export">导出</a>
                    </div>
                    <!-- 表格你自己渲染 -->
                    <table class="layui-table" id="amazonCollectionStatisticsTable"
                           lay-filter="amazonCollectionStatisticsTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
<!-- 编辑按钮-->
<script type="text/html" id="amazonCollectionStatisticsEditBar">
    <a class="layui-btn layui-btn-xs" lay-event="download">下载</a>
</script>

<script src="${ctx}/static/js/work/amazon/amazonCollectionStatistics.js"></script>
