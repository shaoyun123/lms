<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<title>交易数据</title>
<style>
    .dis_flex{
        display: flex;
        justify-content: space-between;
    }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form class="layui-form" lay-filter="searchForm_transData" name="searchForm_transData" id="searchForm_transData">
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-md2 layui-col-md2">
                                    <label class="layui-form-label">paypal账号</label>
                                    <div class="layui-input-block">
                                        <select name="fromPaypalEmail" lay-verify="required" lay-search>
                                            <option value="">全部</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">账号类型</label>
                                    <div class="layui-input-block">
                                        <select name="paypalAcctType">
                                            <option></option>
                                            <c:forEach items="${paypalAcctTypeList}" var="typeEnum">
                                                <option value="${typeEnum.code}">${typeEnum.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-md2">
                                    <label class="layui-form-label">交易类型</label>
                                    <div class="layui-input-block">
                                        <select name="tradeType" lay-verify="required">
                                            <option value=""></option>
                                            <c:forEach items="${tradeTypeList}" var="tradeTypeEnum">
                                                <option value="${tradeTypeEnum.code}">${tradeTypeEnum.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-md2">
                                    <label class="layui-form-label">核单结果</label>
                                    <div class="layui-input-block">
                                        <select name="checkResult">
                                            <option value=""></option>
                                            <c:forEach items="${checkResultList}" var="checkResultEnum">
                                                <option value="${checkResultEnum.code}">${checkResultEnum.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">负责人</label>
                                    <div class="layui-input-block">
                                        <select name="responsorId" lay-search>
                                            <option></option>
                                            <c:forEach items="${paypalResponsorList}" var="responsor">
                                                <option value="${responsor.id}">${responsor.userName}${responsor.status ? '' : '(已离职)'}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">核单人</label>
                                    <div class="layui-input-block">
                                        <select name="checkUserId" lay-search>
                                            <option></option>
                                            <c:forEach items="${checkUserList}" var="checkUser">
                                                <option value="${checkUser.check_user_id}">${checkUser.check_user}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label" style="padding: 0 15px">
                                        <select name="searchType"  class="hiddenContent">
                                            <option value="payerDisplayName">姓名</option>
                                            <option value="payerEmail">收款账户</option>
                                            <option value="checkRemark">核单备注</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input name="searchValue" type="text" class="layui-input" maxlength="2000">
                                    </div>
                                </div>

                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">交易状态</label>
                                    <div class="layui-input-block">
                                        <select name="payNote">
                                            <option></option>
                                            <c:forEach items="${tradeStatusList}" var="statusEnum">
                                                <option value="${statusEnum.code}">${statusEnum.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2  layui-col-md2">
                                        <label class="layui-form-label">开始日期</label>
                                        <div class="layui-input-block">
                                            <input type="text" id="beginDate_transData" name="beginDate" class="layui-input" readonly="readonly">
                                        </div>
                                </div>
                                <div class="layui-col-md2  layui-col-md2">
                                        <label class="layui-form-label">结束日期</label>
                                        <div class="layui-input-block">
                                            <input type="text" id="endDate_transData" name="endDate" class="layui-input" readonly="readonly">
                                        </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="ml20">
                                        <select name="orderBy" class="hiddenContent">
                                            <option value="t1.id desc">同步时间倒序</option>
                                            <option value="t1.id asc">同步时间正序</option>
                                            <option value="t1.trade_time desc">交易时间倒序</option>
                                            <option value="t1.trade_time asc">交易时间正序</option>
                                            <option value="t1.check_remark desc">核单备注倒序</option>
                                            <option value="t1.check_remark asc">核单备注正序</option>
                                            <option value="t1.gross_amount desc">总额倒序</option>
                                            <option value="t1.gross_amount asc">总额正序</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 ml20">
                                        <button class="layui-btn layui-btn-sm ctest keyHandle" id="searchPaypalBtn_traD" type="button">搜索</button>
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-primary ctest" id="resetBtn_transData">清空</button>
                                </div>
                            </div>
                            <input hidden name="dealStatus" value="1"  class="hiddenContent">
                        </form>
                        
                    </div>
                </div>
            </div>

            <div class="layui-card" id="transdataCard">
                <div class="layui-tab">
                    <div class="layui-card-header  toFixedContain">
                                <div class="dis_flex" style="border-bottom:none">
                                    <ul class="layui-tab-title">
                                        <li class="layui-this" onclick="queryByIcon(1)">未核单(<span id="notCheckNum" style="color: red">0</span>)</li>
                                        <li onclick="queryByIcon(2)">已核单(<span id="checkedNum" style="color: green;">0</span>)</li>
                                        <li onclick="queryByIcon('')">全部</li>
                                    </ul>
                                    <div>
                                        <button class="layui-btn layui-btn layui-btn-sm ctest" id="importPingpongTradeData_transData" >导入pingpong数据</button>
                                        <input id="pingpongFile_transData" type="file" hidden>
                                        <button class="layui-btn layui-btn layui-btn-sm ctest" id="checkByListBtn" >执行核单检查</button>
                                        <button class="layui-btn layui-btn layui-btn-sm ctest" id="dealByListBtn_paypal_transData" >批量人工核单</button>
                                        <button class="layui-btn layui-btn layui-btn-sm ctest" id="exportTransDataBtn">导出</button>
                                    </div>
                                </div>
                    </div>
                    <div class="layui-card-body">
                            <div class="layui-tab-content">
                                <!-- 表格的数据渲染 -->
                                <table class="layui-table" id="TransDataTable" lay-filter="TransDataTable"></table>
                            </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

<!--人工核单弹框-->
<script type="text/html" id="check_paypal_data_pop">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" lay-filter="component-form-element" id="tradeDataForm">
            <div class="layui-form-item">
                <label class="layui-form-label">PPID：</label>
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

        <form class="layui-form" lay-filter="component-form-element" id="payOrderInfoForm">
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
                    <textarea type="text" name="checkRemark" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<%--交易类型模板--%>
<script type="text/html" id="tradeType">
    {{# if (d.tradeType == 0){ }}<div>未知类型</div>{{# } }}
    {{# if (d.tradeType == 1){ }}<div>打款</div>{{# } }}
    {{# if (d.tradeType == 2){ }}<div>ebay结账</div>{{# } }}
    {{# if (d.tradeType == 3){ }}<div>银行提取</div>{{# } }}
    {{# if (d.tradeType == 4){ }}<div>货币兑换-转出</div>{{# } }}
    {{# if (d.tradeType == 5){ }}<div>货币兑换-转入</div>{{# } }}
    {{# if (d.tradeType == 6){ }}<div>补偿</div>{{# } }}
    {{# if (d.tradeType == 7){ }}<div>第三方收费</div>{{# } }}
    {{# if (d.tradeType == 8){ }}<div>集中付款</div>{{# } }}
    {{# if (d.tradeType == 9){ }}<div>paypal冻结</div>{{# } }}

</script>

<%--状态模板--%>
<script type="text/html" id="checkResult">
    {{# if (d.checkResult == 0){ }}<div style="color: orange">未核单</div>{{# } }}
    {{# if (d.checkResult == 1){ }}<div style="color: red">有差价</div>{{# } }}
    {{# if (d.checkResult == 2){ }}<div style="color: red">无打款单</div>{{# } }}
    {{# if (d.checkResult == 3){ }}<div style="color: red">无ebay账单</div>{{# } }}
    {{# if (d.checkResult == 5){ }}<div style="color: green">无差价</div>{{# } }}
    {{# if (d.checkResult == 6){ }}<div style="color: grey">无需核单</div>{{# } }}
    {{# if (d.checkResult == 7){ }}<div style="color: blue">非法转出</div>{{# } }}
</script>

<!-- table工具条 -->
<script type="text/html" id="trans_data_bar">
    {{# if (d.dealStatus == 1) { }}
    <a class="layui-btn layui-btn-xs" lay-event="check" data="{{d}}">核单</a>
    {{# } }}
</script>

<script type="text/javascript" src="${ctx}/static/js/financial/paypal/transData.js"></script>

<%--批量人工核单弹窗--%>
<script type="text/html" id="deal_trans_list_pop_paypal_transData">
<div>
    <form class="layui-form" lay-filter="dealPaypalTransListForm" id="dealPaypalTransListForm">
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">核单状态：</label>
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
                <textarea type="text" name="checkRemark" class="layui-textarea"></textarea>
            </div>
        </div>
    </form>
</div>
</script>