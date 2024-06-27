<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld"%>
<title>打款管理</title>

<div class="layui-fluid" id="LAY-financial-paypal-payOrder">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="component-form-group" name="searchForm_payOrder">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3 disN">
                                <label class="layui-form-label">paypal账号</label>
                                <div class="layui-input-block">
                                    <select name="paypalEmail" lay-search>
                                        <option value="">全部</option>
                                    </select>
                                    <div name="paypalEmail_available" hidden="hidden">
                                        <option value="">原始账号如果被停用，将不再显示</option>
                                    </div>
                                    <div name="paypalEmail_payAble" hidden="hidden">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3 mb10">
                                <label class="layui-form-label">打款原因</label>
                                <div class="layui-input-block">
                                    <select name="reason" lay-verify="required">
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3 mb10">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select name="channel" lay-verify="required" lay-filter="aihao">
                                        <option value="">全部</option>
                                        <option value="wish">wish</option>
                                        <option value="amazon">amazon</option>
                                        <option value="joom">joom</option>
                                        <option value="aliexpress">aliexpress</option>
                                        <option value="shopee">shopee</option>
                                        <option value="ebay">ebay</option>
                                        <option value="其他">其他</option>
                                    </select>
                                </div>
                            </div>
                            <div name="currencyCode" style="display: none"></div>
                            <div class="layui-col-md3 layui-col-lg3 mb10">
                               <label class="layui-form-label">开始时间</label>
                                <div class="layui-input-block">
                                    <input type="text" id="beginDate_payOrder" name="beginDate" class="layui-input" readonly="readonly">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3 mb10">
                                <label class="layui-form-label">结束日期</label>
                                <div class="layui-input-block">
                                    <input type="text" id="endDate_payOrder" name="endDate" class="layui-input" readonly="readonly">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="searchType" lay-verify="required" lay-filter="aihao">
                                        <option value="">筛选条件</option>
                                        <option value="toPaypalEmail">对方账号</option>
                                        <option value="amount">金额</option>
                                        <option value="remark">备注</option>
                                        <option value="checkRemark">审核备注</option>
                                        <option value="transactionId">PPID</option>
                                        <option value="creator">创建人</option>
                                        <option value="checkUserName">审核人</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="searchData" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" style="padding-left:20px">
                                <button type="button" class="layui-btn layui-btn layui-btn-sm keyHandle" id="searchPaypalBtn_payO">搜索</button>
                                <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="resetBtn_payOrder">清空</button>
                            </div>
                            <input hidden name="checkStatus" value="1" class="hiddenContent">
                            <div hidden name="companyName"></div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="payorderCard">
                <div class="layui-card-body layui-table-header ">
                    <button class="layui-btn layui-btn-sm mb10" id="addPayOrder">新建打款单</button>
                    <button class="layui-btn layui-btn-sm mb10" id="exportOrder">导出</button>
                        <div class="layui-tab">
                                <ul class="layui-tab-title">
                                  <li class="layui-this" onclick="queryPage2_payOrder(1)">待审核(<span id="waitToCheckNum">0</span>)</li>
                                  <li onclick="queryPage2_payOrder(2)">审核通过(<span id="HasCheckedNum">0</span>)</li>
                                  <li onclick="queryPage2_payOrder(3)">审核失败(<span id="failNum">0</span>)</li>
                                  <li onclick="queryPage2_payOrder(4)">完成打款(<span id="paidNum">0</span>)</li>
                                  <li onclick="queryPage2_payOrder()">全部(<span id="totalNum">0</span>)</li>
                                </ul>
                                <div class="layui-tab-content">
                                   <!-- 表格的数据渲染 -->
                                   <table class="layui-table" id="payOrderTab" lay-filter="payOrderTab"></table>
                                </div>
                        </div>

                </div>
            </div>
        </div>
    </div>
</div>

<!-- 新增打款单 -->
<script type="text/html" id="add_pay_order_pop">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" lay-filter="component-form-element" id="addPayOrderForm">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>公司：</label>
                <div class="layui-input-block">
                    <select name="companyName" lay-filter="companySelect_payOrder">
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>平台：</label>
                <div class="layui-input-block">
                    <select name="channel" lay-verify="required" lay-filter="aihao">
                        <option value="">请选择平台</option>
                        <option value="wish">wish</option>
                        <option value="amazon">amazon</option>
                        <option value="joom">joom</option>
                        <option value="aliexpress">aliexpress</option>
                        <option value="shopee">shopee</option>
                        <option value="ebay">ebay</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>付款账号：</label>
                <div class="layui-input-block">
                    <select name="fromPaypalEmail" lay-verify="required" lay-search>
                        <option value="">全部</option>
                    </select>
                        <%--<input type="text" name="fromPaypalEmail" class="layui-input" readonly="readonly" value="dohairxpp@163.com">--%>
                </div>
            </div>
            <div class="layui-form-item" >
                <label class="layui-form-label"><span class="colorRed">*</span>对方账号：</label>
                <div class="layui-input-block">
                    <input type="text" name="toPaypalEmail" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>币种：</label>
                <div class="layui-input-block">
                    <select name="currencyCode" lay-verify="required">
                        <option value="">请选择币种</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>金额：</label>
                <div class="layui-input-block">
                    <input type="text" name="amount" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>打款原因：</label>
                <div class="layui-input-block">
                    <select name="reason" lay-verify="required">
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注：</label>
                <div class="layui-input-block">
                    <input type="text" name="remark" class="layui-input">
                </div>
            </div>
        </form>
        <%--审核表单--%>
        <hr color="gray" size="2" style="margin: 40px 0"/>
        <form class="layui-form" hidden="hidden" lay-filter="component-form-element" id="checkPayOrderForm">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>审核结果：</label>
                <div class="layui-input-block">
                    <select name="checkStatus">
                        <option value="">请选择审核结果</option>
                        <option value="2">审核通过</option>
                        <option value="3">审核未通过</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">审核备注：</label>
                <div class="layui-input-block">
                    <textarea type="text" name="checkRemark" class="layui-input"/>
                </div>
            </div>
        </form>

        <%--回填表单--%>
        <form class="layui-form" hidden="hidden" lay-filter="component-form-element" id="rebackInpForm">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>交易PaypalID：</label>
                <div class="layui-input-block">
                    <input type="text" name="transactionId" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>交易截图：</label>
                <div class="layui-input-block">
                    <input type="file" name="file" class="layui-input">
                </div>
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
<script type="text/html" id="payOrderStatus">
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
<script type="text/html" id="payOrder_bar">
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


<script type="text/html" id="remark_payOrder">
            {{ d.remark}}
</script>

<script type="text/html" id="checkRemark_payOrder">
            {{ d.checkRemark ? d.checkRemark: ''}}
</script>

<script type="text/javascript" src="${ctx}/static/js/financial/paypal/payOrder.js"></script>
