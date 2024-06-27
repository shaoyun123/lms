<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>payoneer交易</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form class="layui-form" lay-filter="searchForm_transData_payoneer" name="searchForm_transData_payoneer">
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">payoneer号</label>
                                    <div class="layui-input-block">
                                        <input name="acct" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-md2  layui-col-lg2">
                                    <label class="layui-form-label">tradeId</label>
                                    <div class="layui-input-block">
                                        <input name="tradeId" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-md2  layui-col-lg2">
                                    <label class="layui-form-label">交易类型</label>
                                    <div class="layui-input-block">
                                        <select name="tradeType" lay-verify="required" lay-filter="aihao">
                                            <option value="">全部</option>
                                            <option value="1">入账</option>
                                            <option value="2">退款</option>
                                            <option value="3">提款</option>
                                            <option value="4">卡交易</option>
                                            <option value="5">出账</option>
                                            <option value="6">费用</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2  layui-col-lg2">
                                    <label class="layui-form-label">核单结果</label>
                                    <div class="layui-input-block">
                                        <select name="checkResult" lay-verify="required" lay-filter="aihao">
                                            <option value="">全部</option>
                                            <option value="0">未核单</option>
                                            <option value="1">有差价</option>
                                            <option value="5">无差价</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2  layui-col-lg2">
                                        <label class="layui-form-label">开始日期</label>
                                        <div class="layui-input-block">
                                            <input type="text" id="beginDate_transData_payoneer" name="beginDate" class="layui-input" readonly="readonly">
                                        </div>
                                </div>
                                <div class="layui-col-md2  layui-col-lg2">
                                        <label class="layui-form-label">结束日期</label>
                                        <div class="layui-input-block">
                                            <input type="text" id="endDate_transData_payoneer" name="endDate" class="layui-input" readonly="readonly">
                                        </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <button class="layui-btn layui-btn-sm ctest keyHandle" id="searchPaypalBtn_payoneer" type="button">搜索</button>
                                    <button type="button" class="layui-btn layui-btn-primary ctest layui-btn-sm" id="resetBtn_transData_payoneer">清空</button>
                                </div>
                            </div>
                            <input hidden name="dealStatus" value="1"  class="hiddenContent">
                        </form>
                    </div>
                </div>
            </div>

            <div class="layui-card" id="tradeInfoCard">
                    <div class="layui-tab">
                        <%--<button class="layui-btn layui-btn layui-btn-sm ctest" id="checkByListBtn" style="float:right;margin-top:7px;z-index:10;position: relative">批量核单</button>--%>
                        <%--<button class="layui-btn layui-btn layui-btn-sm ctest" id="exportTransDataBtn" style="float:right;margin-top:7px;z-index:10;position: relative;margin-right: 10px">导出</button>--%>
                        <ul class="layui-tab-title layui-card-header  toFixedContain">
                            <li class="layui-this" onclick="queryByIcon_payoneer(1)">未核单(<span id="notDealNum_payoneer" style="color: red">0</span>)</li>
                            <li onclick="queryByIcon_payoneer(2)">已核单(<span id="hadDealNum_payoneer" style="color: green;">0</span>)</li>
                            <li onclick="queryByIcon_payoneer('')">全部(<span id="totalNum_payoneer" style="color: green;">0</span>)</li>
                        </ul>
                        <div class="layui-tab-content layui-card-body">
                            <!-- 表格的数据渲染 -->
                            <table class="layui-table" id="TransDataTable_payoneer" lay-filter="TransDataTable_payoneer"></table>
                        </div>
                    </div>
            </div>
        </div>
    </div>
</div>

<!--人工核单弹框-->
<script type="text/html" id="check_paypal_data_pop">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" lay-filter="component-form-element" id="tradeDataForm_payoneer">
            <div class="layui-form-item">
                <label class="layui-form-label">tradeId：</label>
                <div class="layui-input-block">
                    <input type="text" name="transactionId" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">交易类型：</label>
                <div class="layui-input-block">
                    <input type="text" name="tradeType" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">付款账号：</label>
                <div class="layui-input-block">
                    <input type="text" name="fromPaypalEmail" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">对方账号：</label>
                <div class="layui-input-block">
                    <input type="text" name="payerEmail" class="layui-input" readonly="readonly">
                </div>
            </div>
        </form>

        <hr color="gray" size="2" style="margin: 40px 0"/>

        <form class="layui-form" lay-filter="component-form-element" id="payOrderInfoForm_payoneer">
            <div class="layui-form-item">
                <label class="layui-form-label">公司：</label>
                <div class="layui-input-block">
                    <input type="text" name="companyName" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">平台：</label>
                <div class="layui-input-block">
                    <input type="text" name="channel" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">付款账号：</label>
                <div class="layui-input-block">
                    <input type="text" name="fromPaypalEmail" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">对方账号：</label>
                <div class="layui-input-block">
                    <input type="text" name="toPaypalEmail" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">币种：</label>
                <div class="layui-input-block">
                    <input type="text" name="currencyCode" class="layui-input" maxlength="3" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">金额：</label>
                <div class="layui-input-block">
                    <input type="text" name="amount" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">打款原因：</label>
                <div class="layui-input-block">
                    <input type="text" name="reason" class="layui-input" readonly="readonly">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注：</label>
                <div class="layui-input-block">
                    <input type="text" name="remark" class="layui-input" readonly="readonly">
                </div>
            </div>
        </form>
        <%--对账表单--%>
        <hr color="gray" size="2" style="margin: 40px 0"/>
        <form class="layui-form" lay-filter="component-form-element" id="checkPayOrderForm">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>核单状态：</label>
                <div class="layui-input-block">
                    <select name="dealStatus">
                        <option value="">请选择核单状态</option>
                        <option value="2">确认核单</option>
                        <option value="1">暂不核单</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">核单备注：</label>
                <div class="layui-input-block">
                    <textarea type="text" name="checkRemark" class="layui-input"/>
                </div>
            </div>
        </form>
    </div>
</script>


<%--交易类型模板--%>
<script type="text/html" id="tradeType_payoneerTradeInfo">
    {{# if (d.tradeType == 1){ }}<div>入账</div>{{# } }}
    {{# if (d.tradeType == 2){ }}<div>退款</div>{{# } }}
    {{# if (d.tradeType == 3){ }}<div>提款</div>{{# } }}
    {{# if (d.tradeType == 4){ }}<div>卡交易</div>{{# } }}
    {{# if (d.tradeType == 5){ }}<div>出账</div>{{# } }}
    {{# if (d.tradeType == 6){ }}<div>费用</div>{{# } }}
    {{# if (d.tradeType < 1 || d.tradeType > 6){ }}<div>其他</div>{{# } }}
</script>

<%--交易状态--%>
<script type="text/html" id="tradeStasu_payoneerTradeInfo">
    {{# if (d.tradeStatus == 1){ }}<div>处理中</div>{{# } }}
    {{# if (d.tradeStatus == 2){ }}<div>完成</div>{{# } }}
    {{# if (d.tradeStatus == 3){ }}<div>取消</div>{{# } }}
    {{# if (d.tradeStatus == 4){ }}<div>失败</div>{{# } }}
</script>

<%--状态模板--%>
<script type="text/html" id="checkResult_payoneerTradeInfo">
    {{# if (d.checkResult == 0){ }}<div style="color: orange">未核单</div>{{# } }}
    {{# if (d.checkResult == 1){ }}<div style="color: red">有差价</div>{{# } }}
</script>

<!-- table工具条 -->
<script type="text/html" id="payoneerTradeInfo_bar">
    {{# if (d.dealStatus == 1) { }}
    <%--<a class="layui-btn layui-btn-xs" lay-event="check" data="{{d}}">核单</a>--%>
    {{# } }}
</script>

<script type="text/javascript" src="${ctx}/static/js/financial/payoneer/transInfo.js"></script>
