<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>同步日志</title>


<div class="layui-fluid" id="LAY-financial-payoneerSyncLog-syncLog">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form class="layui-form" lay-filter="searchForm_syncLog_payoneerSyncLog" name="searchForm_syncLog_payoneerSyncLog">
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">账号</label>
                                    <div class="layui-input-block">
                                        <select name="acct"  lay-search>
                                            <option value="">全部</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">同步结果</label>
                                    <div class="layui-input-block">
                                        <select name="syncResult" >
                                            <option value="">全部</option>
                                            <option value="1">成功</option>
                                            <option value="2">失败</option>
                                        </select>
                                    </div>
                                </div>
                                <div name="currencyCode" style="display: none"></div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">开始日期</label>
                                    <div class="layui-input-block">
                                            <input type="text" id="beginDate_syncLog_payoneerSyncLog" name="beginDate" class="layui-input" readonly="readonly">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">结束日期</label>
                                    <div class="layui-input-block">
                                            <input type="text" id="endDate_syncLog_payoneerSyncLog" name="endDate" class="layui-input" readonly="readonly">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2 pl20">
                                    <button type="button" class="layui-btn layui-btn-sm keyHandle" id="searchPaypalBtn_syncLog_payoneerSyncLog">搜索</button>
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="resetBtn_syncLog_payoneerSyncLog">清空</button>
                                    <%--<button type="button" class="layui-btn layui-btn" id="specialSyncBtn">自定义同步</button>--%>
                                </div>
                            </div>
                            <input hidden name="isProc" value="0" class="hiddenContent">
                        </form>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="payoneerSyncLogCard">
                <div class="layui-tab">
                    <div class="layui-card-header toFixedContain">
                        <ul class="layui-tab-title" style="display:inline-block;margin-right: 10px">
                            <li class="layui-this" onclick="queryPage2_syncLog_payoneerSyncLog(0)">待处理(<span id="waitProc_payoneerSyncLog">0</span>)</li>
                            <li onclick="queryPage2_syncLog_payoneerSyncLog(1)">已处理(<span id="hadProc_payoneerSyncLog">0</span>)</li>
                            <li onclick="queryPage2_syncLog_payoneerSyncLog('')">全部(<span id="totalNum_payoneerSyncLog">0</span>)</li>
                        </ul>
                        <button class="layui-btn layui-btn-sm" id="reSyncByList">批量重新同步</button>
                        <button class="layui-btn layui-btn-sm layui-btn-danger" id="deleteLogByListBtn">批量删除</button>
                    </div>
                    <div class="layui-card-body">
                        <div class="layui-tab-content">
                            <!-- 表格的数据渲染 -->
                            <table class="layui-table" id="syncLog_payoneerSyncLogTab" lay-filter="syncLog_payoneerSyncLogTab"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<%--自定义同步--%>
<script type="text/html" id="special_sync_form">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" action="" lay-filter="payoneerSyncLogSyncForm" id="payoneerSyncLogSyncForm">
            <div class="layui-form-item">
                <label class="layui-form-label">payoneerSyncLog首选邮箱：</label>
                <div class="layui-input-block">
                    <select name="acct" lay-search>
                        <option value="">请选择payoneerSyncLog首选邮箱</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">交易类型:</label>
                <div class="layui-input-block">
                    <select name="transactionClass">
                        <option value="">全部</option>
                        <option value="Sent">打款</option>
                        <option value="FundsWithdrawn">银行提取</option>
                        <option value="BalanceTransfer">货币兑换</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>开始时间：</label>
                <div class="layui-input-block">
                    <input type="text" name="beginDate" id="specail_sync_form_beginDate" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>结束时间：</label>
                <div class="layui-input-block">
                    <input type="text" name="endDate" id="specail_sync_form_endDate" class="layui-input" readonly="readonly">
                </div>
            </div>
        </form>
    </div>
</script>

<%--状态模板--%>
<script type="text/html" id="isProcTemplat">
    {{# if (d.isProc == 0){ }}
    <div style="color: red">
        等待处理
    </div>
    {{# } }}
    {{# if (d.isProc == 1){ }}
    <div style="color: green">
        已经处理
    </div>
    {{# } }}
    {{# if (d.isProc == 2){ }}
    <div style="color: green">
        无需处理
    </div>
    {{# } }}
    {{# if (d.isProc == 3){ }}
    <div style="color: orange">
        正在处理
    </div>
    {{# } }}
</script>

<%--同步结果模板--%>
<script type="text/html" id="syncResultTemplat">
    {{# if (d.syncResult == 1){ }}
    <div style="color: green">
        成功
    </div>
    {{# } }}
    {{# if (d.syncResult == 2){ }}
    <div style="color: red">
        失败
    </div>
    {{# } }}
</script>


<!-- table工具条 -->
<script type="text/html" id="syncLog_payoneerSyncLog_bar">
    {{# if (d.isProc == 0) { }}
    <div class="mb5 fl">
        <a class="layui-btn layui-btn-xs" lay-event="reSync" >重新同步</a>
    </div>
    {{# } }}
    <div class="mb5 fl">
        <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delLog" >删除</a>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/financial/payoneer/syncLog.js"></script>
