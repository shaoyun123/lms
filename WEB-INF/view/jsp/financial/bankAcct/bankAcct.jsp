bankAcct.jsp<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld"%>
<title>余额流水</title>

<style>
    .showMultiRow{
        white-space:normal;
        word-break:break-all;
        word-wrap:break-word;
    }
</style>

<div class="layui-fluid" id="LAY-financial-bankAcct-bankAcct">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form class="layui-form" lay-filter="searchForm_bankAcct" name="searchForm_bankAcct">
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-lg3 layui-col-md4">
                                    <label class="layui-form-label">收款账户名</label>
                                    <div class="layui-input-block">
                                        <select name="receiveAcctId"  lay-search>
                                            <option value="">全部</option>
                                            <c:forEach items="${receiveAcctList}" var="receiveAcct">
                                                <option value="${receiveAcct.id}" data-acct="${receiveAcct.acct}">${receiveAcct.acctName}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md4">
                                    <label class="layui-form-label">付款账户名</label>
                                    <div class="layui-input-block">
                                        <select name="bankAcctId"  lay-search>
                                            <option value="">全部</option>
                                            <c:forEach items="${bankAcctList}" var="bankAcct">
                                                <option value="${bankAcct.id}" data-cardNo="${bankAcct.cardNo}" data-manager="${bankAcct.manager}" data-managerId="${bankAcct.managerId}">${bankAcct.acctName}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md4">
                                    <label class="layui-form-label">开始日期</label>
                                    <div class="layui-input-block">

                                        <input type="text" id="beginDate_bankAcct" name="beginDate" class="layui-input" readonly="readonly">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md4">
                                    <label class="layui-form-label">结束日期</label>
                                    <div class="layui-input-block">
                                        <input type="text" id="endDate_bankAcct" name="endDate" class="layui-input" readonly="readonly">

                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md4 pl20">
                                    <button type="button" class="layui-btn layui-btn-sm keyHandle" id="search_bankAcct">搜索</button>
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="resetBtn_bankAcct">清空</button>
                                </div>
                            </div>
                            <div class="layui-form-item layui-row">

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="bankAcctCard">
                <div class="layui-card-header toFixedContain">
                    <permTag:perm funcCode="addMoney">
                        <button type="button" class="layui-btn  layui-btn-sm" id="addmoney_bankAcct">充值</button>
                    </permTag:perm>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="bankAcctTab" lay-filter="bankAcctTab"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 充值 -->
<script type="text/html" id="add_money_pop">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" lay-filter="component-form-element" id="addMoneyForm">
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">账户名</label>
                <div class="layui-input-block">
                    <select name="bankAcctId" lay-filter="add_money_bankAcctId">
                    </select>
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">银行卡号</label>
                <div class="layui-input-block">
                    <input type="text" name="cardNo" class="layui-input" readonly="readonly" placeholder="根据所选账户填充">
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">币种：</label>
                <div class="layui-input-block">
                    <select name="currency" lay-verify="required">
                        <option value="CNY">人民币</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">金额：</label>
                <div class="layui-input-block">
                    <input type="text" name="amount" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注：</label>
                <div class="layui-input-block">
                    <textarea type="text" name="remark" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="detail_money_request_pop">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" lay-filter="component-form-element" id="moneyRequestDetailForm">
            <div class="layui-form-item layui-row">
                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">公司：</label>
                    <div class="layui-input-block">
                        <input type="text" name="company" class="layui-input" readonly="readonly">
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">付款方式：</label>
                    <div class="layui-input-block">
                        <input type="text" name="payType" class="layui-input" readonly="readonly">
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">收款账户名：</label>
                    <div class="layui-input-block">
                        <input type="text" name="receiveAcctName" class="layui-input" readonly="readonly">
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">收款账户号：</label>
                    <div class="layui-input-block">
                        <input type="text" name="receiveAcct" class="layui-input" readonly="readonly">
                    </div>
                </div>
            </div>

            <div class="layui-form-item layui-row">
                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">币种：</label>
                    <div class="layui-input-block">
                        <select name="currency" >
                            <option value="CNY">人民币</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">金额：</label>
                    <div class="layui-input-block">
                        <input type="text" name="amount" class="layui-input" readonly="readonly">
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">请求付款人：</label>
                    <div class="layui-input-block">
                        <input type="text" name="requireUser" class="layui-input" readonly="readonly">
                    </div>
                </div>

                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">审核人：</label>
                    <div class="layui-input-block">
                        <input type="text" name="checkUser" class="layui-input" readonly="readonly">
                    </div>
                </div>
            </div>

            <div class="layui-form-item layui-row">
                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">付款银行卡号：</label>
                    <div class="layui-input-block">
                        <input type="text" name="bankCardNo" class="layui-input" readonly="readonly">
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">付款账号名：</label>
                    <div class="layui-input-block">
                        <input type="text" name="bankAcctName" class="layui-input" readonly="readonly">
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md4">
                    <label class="layui-form-label">实际付款人：</label>
                    <div class="layui-input-block">
                        <input type="text" name="realOperator" class="layui-input" readonly="readonly">
                    </div>
                </div>

            </div>

            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">审核备注：</label>
                <div class="layui-input-block">
                    <textarea name="checkRemark" class="layui-textarea" readonly></textarea>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注：</label>
                <div class="layui-input-block">
                    <textarea name="remark" class="layui-textarea" readonly></textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">附件：</label>
                <div class="layui-input-block">
                    <a href="javascript:;"  id="extraFileDownLoadBtn_bankAcct" style="display: none;color:cornflowerblue;">下载</a>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">打款回填截图：</label>
                <img name="rebackImgUrl" width="100" height="100" onmouseover="onImgHover(this)" onmouseout="onImgOut()">
            </div>
        </form>
    </div>
</script>


<%--图片模板--%>
<script type="text/html" id="payImg">
    {{# if (d.payImgUrl){ }}
    <div>
        <img width="60" height="60" src="{{ d.payImgUrl }}" class="img_show_hide">
    </div>
    {{# } }}
</script>

<%--状态模板--%>
<script type="text/html" id="bankAcctStatus">
    {{# if (d.checkStatus == 1){ }}
    <div style="color: orange">
        等待审核
    </div>
    {{# } }}
    {{# if (d.checkStatus == 2){ }}
    <div style="color: green">
        审核通过
    </div>
    {{# } }}
    {{# if (d.checkStatus == 3){ }}
    <div style="color: red">
        审核失败
    </div>
    {{# } }}

    {{# if (d.checkStatus == 4){ }}
    <div style="color: green">
        打款成功
    </div>
    {{# } }}
</script>

<!-- table工具条 -->
<script type="text/html" id="bankAcct_bar">
    {{# if (d.checkStatus < 4) { }}
    <permTag:perm funcCode="check">
    <div class="mb5">
        <a class="layui-btn layui-btn-xs" lay-event="check" >审核</a>
    </div>
    </permTag:perm>
    {{# } }}
    {{# if (d.checkStatus == 1) { }}
    <div class="mb5">
        <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="update" >修改</a>
    </div>
    {{# } }}
    {{# if (d.checkStatus == 1) { }}
    <div class="mb5">
        <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete" >删除</a>
    </div>
    {{# } }}
    {{# if (d.checkStatus == 2 || d.checkStatus == 4) { }}
    <div class="mb5">
        <a class="layui-btn layui-btn-xs layui-btn-warm layui-btn-xs" lay-event="rebackInp">回填</a>
    </div>
    {{# } }}
</script>


<script type="text/html" id="remark_bankAcct">
        <p class="showMultiRow">
            {{ d.remark}}
        </p>
</script>

<script type="text/html" id="checkRemark_bankAcct">
        <p class="showMultiRow">
            {{ d.checkRemark ? d.checkRemark: ''}}
        </p>
</script>

<script type="text/html" id="tradeOutDiv_bankAcct">
    <a lay-event="detail" href="javascript:;" style="color:cornflowerblue" >
        {{d.tradeType == 2 ? d.amount : ""}}
    </a>
</script>

<script type="text/javascript" src="${ctx}/static/js/financial/bankAcct/bankAcct.js"></script>
