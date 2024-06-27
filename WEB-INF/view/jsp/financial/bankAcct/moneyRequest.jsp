<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>付款充值</title>

<div class="layui-fluid" id="LAY-financial-paypal-moneyRequest">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form class="layui-form" lay-filter="component-form-group" name="searchForm_moneyRequest"
                              autocomplete="off">
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">收款账户类型</label>
                                    <div class="layui-input-block">
                                        <select name="acctType" lay-search>
                                            <option value="">全部</option>
                                            <c:forEach items="${acctTypeList}" var="item">
                                                <option value="${item.code}"
                                                        data-usageCode="${item.code}">${item.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">收款账户名</label>
                                    <div class="layui-input-block">
                                        <select name="receiveAcct" lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${receiveAcctList}" var="receiveAcct">
                                                <c:choose>
                                                    <c:when test="${receiveAcct.simpleName!= '' || receiveAcct.simpleName== null }">
                                                        <option value="${receiveAcct.id}"
                                                                data-acct="${receiveAcct.acct}"
                                                                data-acctName="${receiveAcct.acctName}">${receiveAcct.acctName}--${receiveAcct.simpleName}
                                                        </option>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <option value="${receiveAcct.id}"
                                                                data-acct="${receiveAcct.acct}"
                                                                data-acctName="${receiveAcct.acctName}">${receiveAcct.acctName}</option>
                                                    </c:otherwise>
                                                </c:choose>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">实际付款人</label>
                                    <div class="layui-input-block">
                                        <select name="acctName" lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${bankAcctList}" var="bankAcct">
                                                <option value="${bankAcct.acctName}"
                                                        data-bankCardNo="${bankAcct.cardNo}"
                                                        data-bankAcctName="${bankAcct.acctName}"
                                                        data-bankAcctId="${bankAcct.id}">${bankAcct.acctName}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">开始日期</label>
                                    <div class="layui-input-block">
                                        <input type="text" id="beginDate_moneyRequest" name="beginDate"
                                               class="layui-input" readonly="readonly">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">结束日期</label>
                                    <div class="layui-input-block">
                                        <input type="text" id="endDate_moneyRequest" name="endDate" class="layui-input"
                                               readonly="readonly">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">公司</label>
                                    <div class="layui-input-block">
                                        <select name="companyList" xm-select="moneyRequest_select_company"
                                                xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                                lay-filter='moneyRequest_select_company' lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${companyList}" var="company">
                                                <option value="${company.name}">${company.code}</option>
                                            </c:forEach>
                                        </select>
<%--                                                                                <select name="company">--%>
<%--                                                                                    <option value=""></option>--%>
<%--                                                                                    <c:forEach items="${companyList}" var="company">--%>
<%--                                                                                        <option value="${company.name}">${company.code}</option>--%>
<%--                                                                                    </c:forEach>--%>
<%--                                                                                </select>--%>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">付款方式</label>
                                    <div class="layui-input-block">
                                        <select name="payType">
                                            <option value="">全部</option>
                                            <option value="1">转账</option>
                                            <option value="2">充值</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">用途</label>
                                    <div class="layui-input-block">
                                        <select name="usageTypeList" xm-select="usageTypeList_purchaseOrder"
                                                xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                                lay-filter='usageTypeList_purchaseOrder' lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${usageList}" var="usage">
                                                <option value="${usage.name}"
                                                        data-usageCode="${usage.code}">${usage.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label" style="padding-top: 0">
                                        <select name="searchType" lay-verify="required" lay-filter="aihao">
                                            <option value="">筛选条件</option>
                                            <option value="orderNo">单号</option>
                                            <option value="creator">申请人</option>
                                            <option value="requireUser">请求付款人</option>
                                            <option value="checkUser">审核人</option>
                                            <option value="amount">金额</option>
                                            <option value="remark">备注</option>
                                            <option value="checkRemark">审核备注</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" name="searchData" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">账号验证状态</label>
                                    <div class="layui-input-block">
                                        <select name="acctCheckStatus" lay-search>
                                            <option value="">全部</option>
                                            <c:forEach items="${acctCheckStatusEnums}" var="acctCheckStatus">
                                                <option value="${acctCheckStatus.code}">${acctCheckStatus.name()}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">支付平台</label>
                                    <div class="layui-input-block">
                                        <select name="payPlatCode" lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${payPlatCodeList}" var="item">
                                                <option value="${item.code}"
                                                        data-usageCode="${item.code}">${item.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3 pl20">
                                    <button type="button" class="layui-btn layui-btn-sm keyHandle"
                                            id="searchPaypalBtn_moneyRequest">搜索
                                    </button>
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm"
                                            id="resetBtn_moneyRequest">清空
                                    </button>
                                </div>
                                <div hidden id="requireUserDiv">
                                    <option value=""></option>
                                    <c:forEach items="${bankAcctList}" var="bankAcct">
                                        <option value="${bankAcct.managerId}" data-bankCardNo="${bankAcct.cardNo}"
                                                data-bankAcctName="${bankAcct.acctName}"
                                                data-bankAcctId="${bankAcct.id}">${bankAcct.manager}</option>
                                    </c:forEach>
                                </div>
                                <div hidden id="usageTypeDiv">
                                    <option value=""></option>
                                    <c:forEach items="${usageList}" var="usage">
                                        <option value="${usage.name}"
                                                data-usageCode="${usage.code}">${usage.name}</option>
                                    </c:forEach>
                                </div>
                            </div>
                            <input hidden name="checkStatus" value="5" class="hiddenContent">
                            <div hidden name="companyName"></div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="moneyRequestCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab">
                                <ul class="layui-tab-title" style="display:inline-block">
                                    <li class="layui-this" onclick="queryPage2_moneyRequest(5)">初审待审核(<span
                                            id="firstNum_moneyRequest">0</span>)
                                    </li>
                                    <li onclick="queryPage2_moneyRequest(6)">初审失败(<span
                                            id="firstFailNum_moneyRequest">0</span>)
                                    </li>
                                    <li onclick="queryPage2_moneyRequest(0)">出纳待审核(<span
                                            id="waitNum_moneyRequest">0</span>)
                                    </li>
                                    <li onclick="queryPage2_moneyRequest(1)">出纳审核成功(<span
                                            id="succNum_moneyRequest">0</span>)
                                    </li>
                                    <li onclick="queryPage2_moneyRequest(2)">出纳审核失败(<span
                                            id="failNum_moneyRequest">0</span>)
                                    </li>
                                    <li onclick="queryPage2_moneyRequest(3)">完成付款(<span
                                            id="rebackNum_moneyRequest">0</span>)
                                    </li>
                                    <li onclick="queryPage2_moneyRequest(4)">确认收款(<span
                                            id="confirmNum__moneyRequest">0</span>)
                                    </li>
                                    <li onclick="queryPage2_moneyRequest()">全部(<span id="totalNum_moneyRequest">0</span>)
                                    </li>
                                </ul>
                            </div>
                            <!-- 下面的div放按钮,结构不要变化 -->
                            <div>
                                <permTag:perm funcCode="moneyRequest_modify_bankAcct">
                                    <button class="layui-btn layui-btn-sm" id="moneyRequest_modify_bankAcct">编辑付款账户
                                    </button>
                                </permTag:perm>
                                <permTag:perm funcCode="moneyRequest_exportpayplat">
                                    <button class="layui-btn layui-btn-sm" id="export_moneyRequestBillLianlian">导出连连
                                    </button>
                                    <button class="layui-btn layui-btn-sm" id="export_moneyRequestBillXunhui">导出寻汇
                                    </button>
                                    <button class="layui-btn layui-btn-sm" id="export_moneyRequestBillAlipay">导出支付宝
                                    </button>
                                </permTag:perm>
                                <permTag:perm funcCode="moneyRequest_add">
                                    <button class="layui-btn layui-btn-sm" id="addmoneyRequest">新建请款单</button>
                                </permTag:perm>
                                <permTag:perm funcCode="moneyRequest_export">
                                    <button class="layui-btn layui-btn-sm" id="export_moneyRequest">导出</button>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <table class="layui-table" id="moneyRequestTab" lay-filter="moneyRequestTab"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 新增请款单 -->
<script type="text/html" id="add_money_request_pop">
<div style="padding-top: 20px;padding-right: 40px;">
    <form class="layui-form" lay-filter="addmoneyRequestForm" id="addmoneyRequestForm" autocomplete="off">
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">公司</label>
            <div class="layui-input-block">
                <select name="company">
                    <c:forEach items="${companyList}" var="company">
                        <option value="${company.name}">${company.code}</option>
                    </c:forEach>
                </select>
                <input id="company" class="layui-input" readonly="readonly" style="display: none;" readInp>
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">用途</label>
            <div class="layui-input-block">
                <select name="usageTypeId" lay-search lay-filter="add_money_request_usageTypeId">
                    <option value=""></option>
                </select>
                <input id="usageType" class="layui-input" readonly="readonly" style="display: none;" readInp>
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">属于组织</label>
            <div class="layui-input-block">
                <select name="orgId" lay-verify="required" lay-search id="moneyRequest_orgId"
                        lay-filter="moneyRequest_orgId_filter">
                    <option value=""></option>
                </select>
                <input id="orgizatId" class="layui-input" readonly="readonly" style="display: none;" readInp>
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">付款方式</label>
            <div class="layui-input-block">
                <select name="payType">
                    <option value="1">转账</option>
                    <option value="2">充值</option>
                </select>
                <input id="payType" class="layui-input" readonly="readonly" style="display: none;" readInp>
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <div class="layui-col-lg11 layui-col-md11">

            <label class="layui-form-label">收款账户名</label>
            <div class="layui-input-block">
                <select name="receiveAcctId" lay-search lay-filter="add_money_request_receiveAcctId">
                    <option value=""></option>
                    <c:forEach items="${receiveAcctList}" var="receiveAcct">
                        <c:choose>
                            <c:when test="${(receiveAcct.simpleName!= '' && receiveAcct.simpleName!= null) && receiveAcct.checkStatus!=0 }">
                                <option value="${receiveAcct.id}" data-acct="${receiveAcct.acct}"
                                        data-acctName="${receiveAcct.acctName}">${receiveAcct.acctName}--${receiveAcct.simpleName}
                                </option>
                            </c:when>
                            <c:when test="${(receiveAcct.simpleName== '' || receiveAcct.simpleName== null) && receiveAcct.checkStatus!=0 }">
                                <option value="${receiveAcct.id}" data-acct="${receiveAcct.acct}"
                                        data-acctName="${receiveAcct.acctName}">${receiveAcct.acctName}</option>
                            </c:when>
                            <c:otherwise>
                            </c:otherwise>
                        </c:choose>
                    </c:forEach>
                </select>
                <input id="receiveAcctName" class="layui-input" readonly="readonly" style="display: none;" readInp>
            </div>
            </div>
            <div class="layui-col-lg1 layui-col-md1 pt5">
                <span class="layui-icon layui-icon-refresh-1 ml20 pointHand" onclick="refreshReceiveAcct('#addmoneyRequestForm [name=receiveAcctId]')"></span>
            </div>
        </div>

        <input name="receiveAcctName" hidden>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">收款账户号</label>
            <div class="layui-input-block">
                <input name="receiveAcct" class="layui-input" readonly="readonly">
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">币种</label>
            <div class="layui-input-block">
                <select name="currency">
                    <option value="CNY">人民币</option>
                </select>
                <input id="currency" class="layui-input" readonly="readonly" style="display: none;" readInp>
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">金额</label>
            <div class="layui-input-block">
                <input name="amount" class="layui-input" type="number" min="0">
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <div class="layui-col-lg11 layui-col-md11">
                <label class="layui-form-label">请求付款人</label>
                <div class="layui-input-block">
                <select name="requireUserId" lay-search lay-filter="add_money_request_requireUserId">
                    <option value=""></option>
                </select>
                <input id="requireUser" class="layui-input" readonly="readonly" style="display: none;" readInp>
                </div>
            </div>
            <div class="layui-col-lg1 layui-col-md1 pt5">
                <span class="layui-icon layui-icon-refresh-1 ml20 pointHand" onclick="refreshRequireUser('#addmoneyRequestForm [name=requireUserId]',true)"></span>
            </div>
        </div>
        <input hidden name="requireUser">
        <div id="moneyRequest_bankAcctBox" class="disN">
            <c:forEach items="${bankAcctList}" var="bankAcct">
                <option value="${bankAcct.id}" data-bankCardNo="${bankAcct.cardNo}"
                        data-bankAcctName="${bankAcct.acctName}"
                        data-bankAcctId="${bankAcct.id}"
                        data-managerId="${bankAcct.managerId}">${bankAcct.acctName}</option>
            </c:forEach>
        </div>
        <div class="layui-form-item" id="money_request_bankCardNo">
            <label class="layui-form-label ">实际付款账户</label>
            <div class="layui-input-block layui-form" lay-filter="moneyRequest_bankAcctIdSel">
                <select name="bankAcctId" disabled>
                </select>
            </div>
        </div>
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
                <textarea name="remark" class="layui-textarea"></textarea>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">附件(不超过20M)</label>
            <div class="layui-input-block">
                <input type="file" name="extraFile" class="layui-input"/>
                <a href="javascript:;" id="extraFileDownLoadBtn_moneyRequest"
                   style="color:cornflowerblue;display: none;">下载</a>
            </div>
        </div>
    </form>
    <%--审核表单--%>
    <hr color="gray" size="2" style="margin: 40px 0"/>
    <form class="layui-form" hidden="hidden" lay-filter="checkmoneyRequestForm" id="checkmoneyRequestForm">
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">审核结果</label>
            <div class="layui-input-block">
                <select name="checkStatus" value="">
                    <option value=""></option>
                </select>
            </div>
        </div>
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">审核备注</label>
            <div class="layui-input-block">
                <textarea type="text" name="checkRemark" class="layui-textarea"></textarea>
            </div>
        </div>
    </form>

    <%--回填表单--%>
    <form class="layui-form" hidden="hidden" lay-filter="rebackInpForm_moneyRequest" id="rebackInpForm_moneyRequest">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="colorRed">*</span>打款截图</label>
            <div class="layui-input-block">
                <input type="file" name="rebackImg" class="layui-input">
            </div>
        </div>
    </form>
</div>
</script>
<!-- 修改付款账户-->
<script type="text/html" id="moneyRequest_againModify_bankAcct_pop">
<div class="layui-card-body">
    <form class="layui-form" lay-filter="moneyRequest_againModify_bankAcct_form"
          id="moneyRequest_againModify_bankAcct_form"
          autocomplete="off">
        <div id="moneyRequest_againModify_bankAcctBox" class="disN">
            <c:forEach items="${bankAcctList}" var="bankAcct">
                <option value="${bankAcct.id}" data-bankCardNo="${bankAcct.cardNo}"
                        data-bankAcctName="${bankAcct.acctName}"
                        data-bankAcctId="${bankAcct.id}"
                        data-managerId="${bankAcct.managerId}">${bankAcct.acctName}</option>
            </c:forEach>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label ">付款账户</label>
            <div class="layui-input-block layui-form" lay-filter="moneyRequest_againModify_bankAcctIdSel"
                 id="moneyRequest_againModify_bankAcctIdSel">
                <select name="bankAcctId" lay-search>
                </select>
            </div>
        </div>
    </form>
</div>
</script>
<!-- 编辑付款账户操作-->


<!-- 编辑付款账户操作-->
<script type="text/html" id="moneyRequest_modify_bankAcct_bar">
<div style="display: flex;justify-content: space-between;">
    <div><a class="layui-btn layui-btn-xs" lay-event="update">保存</a></div>
    <div><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a></div>
</div>
</script>

<!-- 新增付款账户-->
<script type="text/html" id="moneyRequest_add_bankAcct_pop">
<div class="layui-card-body">
    <form class="layui-form" lay-filter="moneyRequest_add_bankAcct_form" id="moneyRequest_add_bankAcct_form"
          autocomplete="off">
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">账号名称</label>
            <div class="layui-input-block">
                <input name="acctName" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item" notNull>
            <label class="layui-form-label">卡号</label>
            <div class="layui-input-block">
                <input name="cardNo" class="layui-input">
            </div>
        </div>
    </form>
</div>

</script>
<!-- 编辑付款账户表格 -->
<script type="text/html" id="moneyRequest_modify_bankAcct_pop">
<div class="layui-card-body">
    <p style="text-align: center">
        <span style="font-weight: bold">注意: &nbsp;&nbsp;</span><span style="color: red;">编辑完成之后，请点击保存,才能完成修改!</span>
    </p>
    <button class="layui-btn layui-btn-sm" id="moneyRequest_add_bankAcct">新增账户</button>
    <table class="layui-table" id="moneyRequest_modify_bankAcct_pop_tab"
           lay-filter="moneyRequest_modify_bankAcct_pop_tab"></table>
</div>
</script>

<!-- 图片模板 -->
<script type="text/html" id="rebackImg_moneyRquest">
  {{# if (d.rebackImgUrl){ }}
  {{# if((/.*\.(jpg|jpeg|png|gif|bmp|svg|webp)$/).test(d.rebackImgUrl)){  }}
  <div>
      <img width="60" height="60" src="{{ d.rebackImgUrl }}" class="img_show_hide b1" onerror="layui.admin.img_noFind()">
  </div>
  {{# }else{  }}
  <div>
    <a href="{{d.rebackImgUrl}}" target="_blank">
      <i class="layui-icon" style="font-size:50px;">&#xe621;</i>
    </a>
    
  </div>
  {{# } }}
  {{# } }}
</script>

<!-- 状态模板 -->
<script type="text/html" id="moneyRequestStatus">
{{# if(d.checkStatus == 5){ }}
<div style="color:orange ">
    初审待审核
</div>
{{# } }}

{{# if (d.checkStatus == 6){ }}
<div style="color: red">
    初审失败
</div>
{{# } }}

{{# if (d.checkStatus == 0){ }}
<div style="color: orange">
    出纳待审核
</div>
{{# } }}
{{# if (d.checkStatus == 1){ }}
<div style="color: green">
    出纳审核成功
</div>
{{# } }}
{{# if (d.checkStatus == 2){ }}
<div style="color: red">
    出纳审核失败
</div>
{{# } }}

{{# if (d.checkStatus == 3){ }}
<div style="color: green">
    完成付款
</div>
{{# } }}
{{# if (d.checkStatus == 4){ }}
<div style="color: green">
    确认收款
</div>
{{# } }}
</script>

<!-- table工具条 -->
<script type="text/html" id="moneyRequest_bar">
{{# if (d.creatorId == currentUserId && d.checkStatus == 5) { }}
<div class="mb5">
    <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="update">修改</a>
</div>
{{# } }}
{{# if (d.creatorId == currentUserId && d.checkStatus == 5) { }}
<div class="mb5">
    <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a>
</div>
{{# } }}
{{# if (d.creatorId != currentUserId && (ifPayRole || ifRequestCheck)  && (d.checkStatus < 3||d.checkStatus>4)) { }}
<div class="mb5">
    <a class="layui-btn layui-btn-xs" lay-event="check">审核</a>
</div>
{{# } }}
{{# if (d.creatorId != currentUserId && (d.checkStatus == 1 || d.checkStatus == 3)) { }}
<div class="mb5">
    <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="rebackInp">回填</a>
</div>
{{# } }}
{{# if (d.creatorId == currentUserId && d.checkStatus == 3) { }}
<div class="mb5">
    <a class="layui-btn layui-btn-xs layui-btn-warm " lay-event="confirm">确认收款</a>
</div>
{{# } }}

{{# if(d.extraFileUrl) {}}
<div class="mb5">
    <a class="layui-btn layui-btn-xs" lay-event="download">附件下载</a>
</div>
{{# } }}

{{# if(d.checkStatus==4) {}}
<permTag:perm funcCode="moneyRequest_modify_bankAcct">
    <div class="md5">
        <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="againModifyBankAcct">修改付款账户</a>
    </div>
</permTag:perm>
{{# } }}
</script>
</script>


<script type="text/html" id="remark_moneyRequest">
<p class="showMultiRow">
    {{ d.remark ? d.remark : ''}}
</p>
</script>

<script type="text/html" id="msgMoneyRequest_receiveAcctName_tpl">
<p class="showMultiRow">
    {{ d.receiveAcctName ||''}}
</p>
<p class="showMultiRow">
    {{# if (d.acctCheckStatus==0) { }}
    <a class="layui-btn layui-btn-xs layui-btn-danger">{{d.acctCheckStatusName}}</a>
    {{# } }}
    {{# if (d.acctCheckStatus>0) { }}
    <a class="layui-btn layui-btn-xs layui-btn">{{d.acctCheckStatusName}}</a>
    {{# } }}
</p>
</script>


<script type="text/html" id="checkRemark_moneyRequest">
<p class="showMultiRow" lay-event="update_field" style="cursor: pointer;">
    {{ d.checkRemark ? d.checkRemark: ''}}
    <i class="layui-icon tpl_relateSku"></i>
</p>
</script>

<script type="text/html" id="firstCheckRemark_moneyRequest">
<p class="showMultiRow" lay-event="update_field" style="cursor: pointer;">
    {{ d.firstCheckRemark ? d.firstCheckRemark: ''}}
    <i class="layui-icon tpl_relateSku"></i>
</p>
</script>

<script type="text/javascript" src="${ctx}/static/request.js"></script>
<script type="text/javascript" src="${ctx}/static/js/financial/bankAcct/moneyRequest.js"></script>

<script type="text/javascript">
var ifPayRole =
${ifPayRole}
var ifRequestCheck =
${ifRequestCheck}
var currentUserId =
${currentUserId}
</script>