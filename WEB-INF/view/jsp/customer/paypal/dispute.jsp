<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld"%>
<title>paypal纠纷</title>

<link rel="stylesheet" href="${ctx}/static/layui/css/modules/layim/layim.css">

<div class="layui-fluid" id="LAY-financial-paypal-paypalDispute">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form class="layui-form" lay-filter="component-form-group" id="searchForm_paypalDispute" autocomplete="off">
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select name="customerOrgId" lay-filter="orgs_hp_devPerson_dispute" class="orgs_hp_custom" data-id="dispute_devPerson" onchange="orgs_hp_changeFun_dispute()" lay-search>
                                            <option></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">客服人员</label>
                                    <div class="layui-input-block">
                                        <select name="customerServiceUserId" lay-filter="users_hp_devPerson_dispute" lay-search="" class="users_hp_custom" data-id="dispute_devPerson" data-roleList="ebay客服专员">
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md3">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select name="tradeStoreId" lay-search>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md3">
                                    <label class="layui-form-label">paypal账号</label>
                                    <div class="layui-input-block">
                                        <select name="paypalAcctId" lay-search>
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md3">
                                    <div class="layui-form-label" style="padding: 0 15px">
                                        <select name="searchType" lay-search>
                                            <option value="1">买家ID</option>
                                            <option value="2">交易号</option>
                                            <option value="3">买家邮箱</option>
                                            <option value="4">收件人</option>
                                            <option value="5">事件号</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input name="searchValue" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md3">
                                    <div class="layui-form-label" style="padding: 0 15px">
                                        <select name="searchTimeType" lay-search>
                                            <option value="1">开立时间</option>
                                            <option value="2">更新时间</option>
                                            <option value="3">截止时间</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" id="searchDate_paypalDispute" name="searchDate" class="layui-input" readonly="readonly">
                                    </div>
                                </div>

                                <div class="layui-col-lg2 layui-col-md3">
                                    <label class="layui-form-label">是否已读</label>
                                    <div class="layui-input-block">
                                        <select name="ifNotRead" lay-search>
                                            <option value=""></option>
                                            <option value="1">未读</option>
                                            <option value="0">已读</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="layui-col-lg2 layui-col-md3" >
                                    <label class="layui-form-label labelSel">
                                        <button class="layui-btn layui-btn-sm keyHandle" type="button" id="searchPaypalBtn_paypalDispute" lay-filter="searchPaypalBtn_paypalDispute">搜索</button>
                                    </label>
                                    <div class="layui-input-block">
                                        <div class="layui-btn layui-btn-primary layui-btn-sm" id="resetBtn_paypalDispute">清空</div>
                                    </div>
                                </div>
                                <div hidden id="requireUserDiv">
                                    <option value=""></option>
                                    <c:forEach items="${bankAcctList}" var="bankAcct">
                                        <option value="${bankAcct.managerId}" data-bankCardNo="${bankAcct.cardNo}" data-bankAcctName="${bankAcct.acctName}" data-bankAcctId="${bankAcct.id}">${bankAcct.manager}</option>
                                    </c:forEach>
                                </div>
                            </div>
                            <input hidden name="statusCode" value="2" class="hiddenContent">
                        </form>
                    </div>
                </div>
            </div>
            <div class="layui-card"  id="paypalDisputeCard">
                <div class="layui-tab layui-card-header">
                    <div class="fr">
                        <button class="layui-btn layui-btn-sm layui-btn-warm" id="dealByList_paypalDispute">批量处理</button>
                        <button class="layui-btn layui-btn-sm" id="updateByIdList_paypalDispute">批量更新</button>
                    </div>
                    <ul class="layui-tab-title fl">
                        <li class="layui-this" onclick="queryPage2_paypalDispute(2)">需要回复(<span id="NeedReplyNum_paypalDispute">0</span>)</li>
                        <li onclick="queryPage2_paypalDispute(4)">paypal审查中(<span id="underReviewNum_paypalDispute">0</span>)</li>
                        <li onclick="queryPage2_paypalDispute(3)">待买家回复(<span id="WaitBuyerReplyNum_paypalDispute">0</span>)</li>
                        <li onclick="queryPage2_paypalDispute(1)">买家消息(<span id="HasBuyerMessageNum_paypalDispute">0</span>)</li>
                        <li onclick="queryPage2_paypalDispute(9)">已结束</li>
                    </ul>
                    <div class="fl ml20">
                        <button class="layui-btn layui-btn-sm" id="markReadByIdList_paypalDispute">批量已读</button>
                    </div>
                </div>
                <div class="layui-card-body">
                        <div class="layui-tab-content">
                            <!-- 表格的数据渲染 -->
                            <table class="layui-table" id="paypalDisputeTab" lay-filter="paypalDisputeTab"></table>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script id="reasonBox_paypalDispute" type="text/html">
    <div>
        {{# if(d.reason == 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED') {}}
            物品未收到
        {{# } }}
        {{# if(d.reason == 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED') {}}
            物品与描述显著不符
        {{#}}}
        {{# if(d.reason == 'UNAUTHORISED') {}}
            未经授权交易
        {{#}}}
        {{# if(d.reason == 'DUPLICATE_TRANSACTION') {}}
            重复交易
        {{#}}}
        {{# if(d.reason == 'CREDIT_NOT_PROCESSED') {}}
            未收到退款或退费
        {{#}}}
        {{# if(d.reason == 'INCORRECT_AMOUNT') {}}
            收取金额不正确
        {{#}}}
        {{# if(d.reason == 'PAYMENT_BY_OTHER_MEANS') {}}
            其他渠道已经付款
        {{#}}}
        {{# if(d.reason == 'CANCELED_RECURRING_BILLING') {}}
            已取消交易仍付款
        {{#}}}
        {{# if(d.reason == 'PROBLEM_WITH_REMITTANCE') {}}
            汇款故障
        {{#}}}
        {{# if(d.reason == 'OTHER') { }}
            其他
        {{#}}}
    </div>
</script>

<script id="timeBox_paypalDispute" type="text/html">
    <div><span style="color: grey">开立:</span><span>{{format(d.createTime,'yyyy-MM-dd hh:mm')}}</span></div>
    <div><span style="color: grey">更新:</span><span>{{format(d.updateTime,'yyyy-MM-dd hh:mm')}}</span></div>
    {{# if(d.solveTime){ }}
    <div><span style="color: grey">截止:</span><span>{{format(d.solveTime,'yyyy-MM-dd hh:mm')}}</span></div>
    {{# }}}
    {{# if (d.haveReadMessageNum != d.receiveMessageNum){ }}
    <span class="messageNotRead_paypalDispute"></span>
    {{# } }}
</script>

<!-- 纠纷详情 -->
<script type="text/html" id="paypal_dispute_detail_pop">

    <div class="layui-fluid" id="LAY-financial-paypal-paypalDisputeDetail">
        <div style="padding-top: 20px;padding-right: 40px;">
            <form class="layui-form" lay-filter="showPaypalDisputeDetailForm" id="showPaypalDisputeDetailForm" autocomplete="off">
                <fieldset class="layui-elem-field layui-field-title site-demo-button">
                    <legend style="font-size:14px"><span name="reason"></span>--<span name="disputeId"></span></legend>
                </fieldset>
                <div class="layui-form-item layui-row">
                    <div class="layui-col-lg5 layui-col-md5">
                        <label class="layui-form-label">事件状态：</label>
                        <div class="layui-input-block">
                            <div name="status" style="padding: 9px 15px"></div>
                        </div>
                    </div>
                    <div class="layui-col-lg5 layui-col-md5">
                        <label class="layui-form-label">事件结果：</label>
                        <div class="layui-input-block">
                            <div name="outcome" style="padding: 9px 15px"></div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item layui-row">
                    <table class="layui-table">
                        <thead>
                        <tr>
                            <th>买家ID</th>
                            <th>邮箱</th>
                            <th>收件人</th>
                            <th>交易金额</th>
                            <th>交易号</th>
                            <th>日期</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td name="buyerId"></td>
                            <td name="buyerEmail"></td>
                            <td name="receiveName"></td>
                            <td name="transactionGrossAmount"></td>
                            <td name="paypalTransactionId"></td>
                            <td name="date"></td>
                        </tr>
                        </tbody>
                        <thead>
                        <tr>
                            <th>itemIDs</th>
                            <th>物流</th>
                            <th>跟踪号</th>
                            <th>地址</th>
                            <th>其他</th>
                            <th>...</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td name="itemsIdList">加载失败，请重新打开</td>
                            <td name="logisticWay"></td>
                            <td name="trackNumber"></td>
                            <td name="receiveAddress"></td>
                            <td ></td>
                            <td ></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <fieldset class="layui-elem-field layui-field-title site-demo-button">
                    <legend style="font-size:14px">对话过程</legend>
                </fieldset>
                <div class="layui-form-item layui-row">
                    <div class="p20">
                        <div class="layui-tab layui-tab-card">
                            <div class="layim-chat-box" style='background-image: url("https://res.layui.com/layui/dist/css/modules/layim/skin/3.jpg");'>
                                <div class="layim-chat layim-chat-friend layui-show">
                                    <div class="layim-chat-main">
                                        <ul id="messageBox_hp_2018_12_25">
                                            <%--<li>--%>
                                                <%--<div class="layim-chat-user">--%>
                                                    <%--<img>--%>
                                                    <%--<cite>--%>
                                                        <%--"付付付"--%>
                                                        <%--<i>2018-12-19 17:33:49</i>--%>
                                                    <%--</cite>--%>
                                                <%--</div>--%>
                                                <%--<div class="layim-chat-text">--%>
                                                    <%--快退钱，无良商家--%>
                                                <%--</div>--%>
                                            <%--</li>--%>
                                            <%--<li class="layim-chat-mine">--%>
                                                <%--<div class="layim-chat-user">--%>
                                                    <%--<img>--%>
                                                    <%--<cite>--%>
                                                        <%--"黄鹏"--%>
                                                        <%--<i>2018-12-19 18:33:49</i>--%>
                                                    <%--</cite>--%>
                                                <%--</div>--%>
                                                <%--<div class="layim-chat-text">--%>
                                                    <%--滚远点--%>
                                                <%--</div>--%>
                                            <%--</li>--%>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <form id="dealPaypalDisputeForm" class="layui-form" lay-filter="dealPaypalDisputeForm" autocomplete="off">
                <fieldset class="layui-elem-field layui-field-title site-demo-button">
                    <legend style="font-size:14px">处理方案</legend>
                </fieldset>
                <div class="layui-form-item layui-row">
                    <div class="layui-col-lg10 layui-col-md10">
                        <label class="layui-form-label" style="width: 100px;">选择处理方案：</label>
                        <div class="layui-input-block">
                            <div class="dealMethod_radioBox fl disN" id="dealMethod_radioBox_1">
                                <input type="radio" name="dealMethod" value="1" title="全额退款" lay-filter="dealMethod_dealPaypalDisputeForm" >
                            </div>
                            <div class="dealMethod_radioBox fl disN" id="dealMethod_radioBox_2">
                                <input type="radio" name="dealMethod" value="2" title="已发货" lay-filter="dealMethod_dealPaypalDisputeForm">
                            </div>
                            <div class="dealMethod_radioBox fl disN" id="dealMethod_radioBox_3">
                                <input type="radio" name="dealMethod" value="3" title="其他方案" lay-filter="dealMethod_dealPaypalDisputeForm">
                            </div>
                            <div class="dealMethod_radioBox fl disN" id="dealMethod_radioBox_4">
                                <input type="radio" name="dealMethod" value="4" title="不同意且提交证据" lay-filter="dealMethod_dealPaypalDisputeForm">
                            </div>
                            <div class="dealMethod_radioBox fl disN" id="dealMethod_radioBox_6">
                                <input type="radio" name="dealMethod" value="6" title="给买家发消息" lay-filter="dealMethod_dealPaypalDisputeForm">
                            </div>
                        </div>
                    </div>

                </div>
                <hr color="gray" size="2" style="margin: 40px 0"/>

                <div class="layui-form-item layui-row">
                    <%--全额退款--%>
                    <div class="disN" id="dealMethod_content_1">
                        <%--<div class="layui-col-lg5 layui-col-md5">--%>
                            <%--<label class="layui-form-label">退款币种</label>--%>
                            <%--<div class="layui-input-block">--%>
                                <%--<select name="refund_currency">--%>
                                    <%--<option></option>--%>
                                    <%--<option value="USD">美元</option>--%>
                                    <%--<option value="AUD">澳元</option>--%>
                                    <%--<option value="EUD">欧元</option>--%>
                                    <%--<option value="GBP">英镑</option>--%>
                                    <%--<option value="CAD">加元</option>--%>
                                <%--</select>--%>
                            <%--</div>--%>
                        <%--</div>--%>
                        <%--<div class="layui-col-lg5 layui-col-md5">--%>
                            <%--<label class="layui-form-label">退款金额</label>--%>
                            <%--<div class="layui-input-block">--%>
                                <%--<input class="layui-input" name="refund_value" type="number"/>--%>
                            <%--</div>--%>
                        <%--</div>--%>
                        <%--<div class="layui-col-lg5 layui-col-md5">--%>
                            <%--<label class="layui-form-label">退货地址</label>--%>
                            <%--<div class="layui-input-block">--%>
                                <%--<select name="returnAddress">--%>
                                    <%--<option value="default">默认</option>--%>
                                <%--</select>--%>
                            <%--</div>--%>
                        <%--</div>--%>
                        <div class="layui-col-lg5 layui-col-md5">
                            <label class="layui-form-label">接受退款原因</label>
                            <div class="layui-input-block">
                                <select name="accept_claim_reason" lay-search>
                                    <option></option>
                                    <option value="DID_NOT_SHIP_ITEM">无法运送到</option>
                                    <option value="TOO_TIME_CONSUMING">时间太长</option>
                                    <option value="LOST_IN_MAIL">丢失货物</option>
                                    <option value="NOT_ABLE_TO_WIN">无有力证据</option>
                                    <option value="COMPANY_POLICY">遵循公司政策</option>
                                    <option value="REASON_NOT_SET">默认</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item layui-form-text">
                            <label class="layui-form-label"><span style="color: red;">*</span>卖家备注(仅paypal可见)</label>
                            <div class="layui-input-block">
                                <textarea  class="layui-textarea" name="note"></textarea>
                            </div>
                        </div>
                    </div>

                    <%--已发货，提供证据--%>
                    <div class="disN" id="dealMethod_content_2">
                        <div class="layui-col-lg5 layui-col-md5">
                            <label class="layui-form-label"><span style="color: red;">*</span>物流</label>
                            <div class="layui-input-block">
                                <input class="layui-input" name="logisticWay"/>
                            </div>
                        </div>
                        <div class="layui-col-lg5 layui-col-md5">
                            <label class="layui-form-label"><span style="color: red;">*</span>跟踪号</label>
                            <div class="layui-input-block">
                                <input class="layui-input" name="trackNumber"/>
                            </div>
                        </div>
                        <div class="layui-form-item layui-form-text">
                            <label class="layui-form-label">证据信息</label>
                            <div class="layui-input-block">
                                <textarea  class="layui-textarea" name="notes"></textarea>
                            </div>
                        </div>
                        <div class="layui-form-item layui-form-text">
                            <label class="layui-form-label">上传证据</label>
                            <div class="layui-input-block">
                                <input type="file"  class="layui-textarea" name="evidence_file"/>仅接受图片文件。格式为JPG GIF PNG PDF| 每个文件不超过5M
                            </div>
                        </div>
                    </div>

                    <%--提出解决方案--%>
                    <div class="disN" id="dealMethod_content_3">
                        <div class="layui-col-lg5 layui-col-md5">
                            <label class="layui-form-label"><span style="color: red;">*</span>方案</label>
                            <div class="layui-input-block">
                                <select name="offer_type" lay-search>
                                    <option></option>
                                    <option value="REFUND">仅退款</option>
                                    <option value="REFUND_WITH_RETURN">退货后退款</option>
                                    <option value="REFUND_WITH_REPLACEMENT">退款且重发</option>
                                    <option value="REPLACEMENT_WITHOUT_REFUND">重发不退款</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg5 layui-col-md5">
                            <label class="layui-form-label">退款币种</label>
                            <div class="layui-input-block">
                                <select name="offer_currency" lay-search>
                                    <option></option>
                                    <option value="USD">美元</option>
                                    <option value="AUD">澳元</option>
                                    <option value="EUD">欧元</option>
                                    <option value="GBP">英镑</option>
                                    <option value="CAD">加元</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg5 layui-col-md5">
                            <label class="layui-form-label">退款金额</label>
                            <div class="layui-input-block">
                                <input class="layui-input" name="offer_value" type="number"/>
                            </div>
                        </div>
                        <div class="layui-col-lg5 layui-col-md5">
                            <label class="layui-form-label">退货地址</label>
                            <div class="layui-input-block">
                                <select name="returnAddress" lay-search>
                                    <option>暂不支持退货</option>
                                    <option value="default">默认</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item layui-form-text">
                            <label class="layui-form-label"><span style="color: red;">*</span>卖家留言</label>
                            <div class="layui-input-block">
                                <textarea  class="layui-textarea" name="note"></textarea>
                            </div>
                        </div>
                    </div>

                    <%--上诉纠纷--%>
                    <div class="disN" id="dealMethod_content_4">
                        <div class="layui-col-lg5 layui-col-md5">
                            <label class="layui-form-label">物流</label>
                            <div class="layui-input-block">
                                <input class="layui-input" name="logisticWay"/>
                            </div>
                        </div>
                        <div class="layui-col-lg5 layui-col-md5">
                            <label class="layui-form-label">跟踪号</label>
                            <div class="layui-input-block">
                                <input class="layui-input" name="trackNumber"/>
                            </div>
                        </div>
                        <div class="layui-form-item layui-form-text">
                            <label class="layui-form-label">证据信息</label>
                            <div class="layui-input-block">
                                <textarea  class="layui-textarea" name="notes"></textarea>
                            </div>
                        </div>
                        <div class="layui-form-item layui-form-text">
                            <label class="layui-form-label">上传证据</label>
                            <div class="layui-input-block">
                                <input type="file"  class="layui-textarea" name="evidence_file"/>仅接受图片文件。格式为JPG GIF PNG PDF| 每个文件不超过5M
                            </div>
                        </div>
                    </div>

                    <%--给买家发送信息--%>
                    <div class="disN" id="dealMethod_content_6">
                        <div class="layui-form-item layui-form-text">
                            <label class="layui-form-label">卖家留言</label>
                            <div class="layui-input-block">
                                <textarea  class="layui-textarea" name="message"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div style="height: 200px"></div>
        </div>
    </div>
</script>

<!-- table工具条 -->
<script type="text/html" id="paypalDispute_bar">
    <div class="mb5">
        <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="detail" >详情</a>
        <a class="layui-btn layui-btn-xs " lay-event="markRead" >已读</a>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/customer/paypal/paypaldispute.js"></script>

<%--<script id="showDisputeDetailJS"  type="text/html">--%>
<script id="showDisputeDetailJS" >
    // 必要函数
    function success(originData) {
        setDataForDisputeDetail(originData)
    }
    function setDataForDisputeDetail(originData) {
        var form = layui.form
        for (var key in originData) {
            $('#showPaypalDisputeDetailForm [name='+ key +']').text(originData[key])
        }
        $('#showPaypalDisputeDetailForm [name=transactionGrossAmount]').text(originData.transactionCurrency + ' : ' + originData.transactionGrossAmount)

        // 日期
        $('#showPaypalDisputeDetailForm [name=date]').html('<div>开立: '+ format(new Date(originData.createTime), 'yyyy-MM-dd hh:mm') +' </div>' +
            '<div>更新: '+ format(new Date(originData.updateTime), 'yyyy-MM-dd hh:mm') +' </div>')

        var reasonShow = ''
        switch (originData.reason){
            case "MERCHANDISE_OR_SERVICE_NOT_RECEIVED" : reasonShow = '物品未收到';break;
            case "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED" : reasonShow = '物品与描述显著不符';break;
            case "UNAUTHORISED" : reasonShow = '未经授权交易';break;
            case "DUPLICATE_TRANSACTION" : reasonShow = '重复交易';break;
            case "CREDIT_NOT_PROCESSED" : reasonShow = '未收到退款或退费';break;
            case "INCORRECT_AMOUNT" : reasonShow = '收取金额不正确';break;
            case "PAYMENT_BY_OTHER_MEANS" : reasonShow = '其他渠道已经付款';break;
            case "CANCELED_RECURRING_BILLING" : reasonShow = '已取消交易仍付款';break;
            case "PROBLEM_WITH_REMITTANCE" : reasonShow = '汇款故障';break;
            case "OTHER" : reasonShow = '其他';break;
        }
        $('#showPaypalDisputeDetailForm [name=reason]').text(reasonShow)

        var status = ''
        switch (originData.statusCode) {
            case 1 : status = '有买家消息';break;
            case 2 : status = '需要回复';break;
            case 3 : status = '等待买家回复'; break;
            case 4 : status = '正在审查'; break;
            case 9 : status = '已结束'; break;
        }

        $('#showPaypalDisputeDetailForm [name=status]').text(status)
        var outcome = ''
        switch (originData.disputeOutcome || ''){
            case 'RESOLVED_BUYER_FAVOUR' : outcome = '已解决，对买家有利';break;
            case 'RESOLVED_SELLER_FAVOUR' : outcome = '已解决，对卖家有利';break;
            case 'RESOLVED_WITH_PAYOUT' : outcome = 'paypal担保解决';break;
            case 'CANCELED_BY_BUYER' : outcome = '买家取消纠纷';break;
            case 'ACCEPTED' : outcome = 'paypal接受该纠纷';break;
            case 'DENIED' : outcome = 'paypal否认该纠纷';break;
            case 'NONE' : outcome = '相同交易重复纠纷，被关闭';break;
        }
        $('#showPaypalDisputeDetailForm [name=outcome]').text(outcome)

        // 历史对话展示
        if (originData.messageList && originData.messageList.length > 0) {
            for (var i = 0;i < originData.messageList.length; ++i) {
                addOneMessage(originData.messageList[i],originData.buyerName)
            }
        }

        var methodList = [] // 可执行的处理方案
        if (originData.availableApi) {
            methodList = originData.availableApi.split(',')
        }

        if (methodList.length > 0) {
            for (var i = 0; i < methodList.length; ++i) {
                if (methodList[i]) {
                    $('#dealMethod_radioBox_' + methodList[i]).show()
                }
            }
            form.on('radio(dealMethod_dealPaypalDisputeForm)', function(data) {
                var value = data.value;
                $('[id^=dealMethod_content_]').hide()
                $('#dealMethod_content_' + value).show()
            })
            form.render('radio')
        } else{
            $('#dealPaypalDisputeForm').hide()
        }
    }
    function addOneMessage(message,buyerName) {
        var MessageLi = $('<li class="'+ (message.source == 'SELLER' ? 'layim-chat-mine' : '' ) +'">' +
            '<div class="layim-chat-user">' +
            '<img src='+ (message.source == 'SELLER' ? ctx +'/static/img/seller.jpg' : ctx +'/static/img/buyer.jpg' ) + '>' +
            '<cite>' + (message.source == 'SELLER' ?  '我'  :buyerName) +
            '<i>'+ format(message.date,'yyyy-MM-dd hh:mm:ss') +'</i>' +
            '</cite>' +
            ' </div>' +
            '<div class="layim-chat-text">' + message.content +
            '</div>' +
            '<li>')

        $('#messageBox_hp_2018_12_25').append(MessageLi)
    }

    // 必要参数-  底部按钮事件, 从btn0~ btnN
    var btnFunction = {
        btn0: function () {
            var layer = layui.layer
            var Adata = {
                id: originData.id,
                dealMethodType: $('#dealPaypalDisputeForm [name=dealMethod]:checked').val()
            }
            // 校验必填项
            if (!Adata.dealMethodType) {
                layer.msg('请选择处理方法')
                return
            }
            var files
            switch (Adata.dealMethodType) {
                case '1':
                    Adata['accept_claim_reason'] = $('#dealMethod_content_1 [name=accept_claim_reason]').val()
                    Adata['note'] = $('#dealMethod_content_1 [name=note]').val()
                    if (!Adata['note']) {
                        layer.msg('请填写必要信息')
                        return
                    }
                    break
                case '2':
                    Adata['logisticWay'] = $('#dealMethod_content_2 [name=logisticWay]').val()
                    Adata['trackNumber'] = $('#dealMethod_content_2 [name=trackNumber]').val()
                    Adata['notes'] = $('#dealMethod_content_2 [name=notes]').val()
                    files = $('#dealMethod_content_2  input[name=evidence_file]')[0].files
                    if (!Adata['logisticWay'] || !Adata['trackNumber']) {
                        layer.msg('请填写必要信息')
                        return
                    }
                    break
                case '3':
                    Adata['offer_type'] = $('#dealMethod_content_3 [name=offer_type]').val()
                    Adata['offer_currency'] = $('#dealMethod_content_3 [name=offer_currency]').val()
                    Adata['offer_value'] = $('#dealMethod_content_3 [name=offer_value]').val()
                    Adata['returnAddress'] = $('#dealMethod_content_3 [name=returnAddress]').val()
                    Adata['note'] = $('#dealMethod_content_3 [name=note]').val()
                    if (!Adata['offer_type'] || !Adata['note']) {
                        layer.msg('请填写必要信息')
                        return
                    }
                    if (Adata['offer_type'] == 'REFUND' && (!Adata['offer_currency'] || !Adata['offer_value'])) {
                        layer.msg('请填写完善退款金额信息')
                        return
                    }
                    break
                case '4':
                    Adata['logisticWay'] = $('#dealMethod_content_4 [name=logisticWay]').val()
                    Adata['trackNumber'] = $('#dealMethod_content_4 [name=trackNumber]').val()
                    Adata['notes'] = $('#dealMethod_content_4 [name=notes]').val()
                    files = $('#dealMethod_content_4  input[name=evidence_file]')[0].files
                    break
                case '6':
                    Adata['message'] = $('#dealMethod_content_6 [name=message]').val()
                    break
            }

            var formData = new FormData();
            if (files && files.length > 0) {
                formData.append("evidenceFile",files[0]);
            }
            for (var key in Adata) {
                formData.append(key, Adata[key])
            }
            loading.show()
            $.ajax({
                url: ctx + "/sysPaypalDispute/dealDispute.html",
                type : 'POST',
                async : true,
                data : formData,
                // 告诉jQuery不要去处理发送的数据
                processData : false,
                // 告诉jQuery不要去设置Content-Type请求头
                contentType : false,
                success: function (data) {
                    loading.hide()
                    if (data.code == '0000') {
                        alert('处理成功')
                        window.close()
                    } else {
                        layer.msg(data.msg)
                    }
                },
                complete: function () {
                    loading.hide()
                }
            })
        },
        btn1: function () {
            window.close()
        }
    }
</script>