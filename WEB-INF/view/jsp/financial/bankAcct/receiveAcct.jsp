<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld"%>
<title>收款账户</title>
<div class="layui-fluid" id="LAY-financial-paypal-receiveAcct">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form class="layui-form" lay-filter="searchForm_receiveAcct" id="searchForm_receiveAcct">
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">账户类型</label>
                                    <div class="layui-input-block">
                                        <select id="ra_searchAcctType" name="acctType">
                                            <option value="">全部</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">收款账户名</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="acctName" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">收款账户号</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="acct" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">手机号</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="telphone" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">身份证</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="idCard" class="layui-input">
                                    </div>
                                </div>
                                <%--<div class="layui-col-lg2 layui-col-md2">--%>
                                    <%--<label class="layui-form-label">营业执证号</label>--%>
                                    <%--<div class="layui-input-block">--%>
                                        <%--<input type="text" name="businessLicenseNo" class="layui-input">--%>
                                    <%--</div>--%>
                                <%--</div>--%>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">状态</label>
                                    <div class="layui-input-block">
                                        <select name="status">
                                            <option value="">全部</option>
                                            <option value="1">启用中</option>
                                            <option value="0">停用中</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">验证状态</label>
                                    <div class="layui-input-block">
                                        <select id="ra_checkStatus" name="checkStatus">
                                            <option value="">全部</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">身份证号</label>
                                    <div class="layui-input-block">
                                        <select name="isIdCard">
                                            <option value="">全部</option>
                                            <option value="1">已填</option>
                                            <option value="0">未填</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">营业执照号</label>
                                    <div class="layui-input-block">
                                        <select name="isBusinessLicenseNo">
                                            <option value="">全部</option>
                                            <option value="1">已填</option>
                                            <option value="0">未填</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2 pl20">
                                    <button type="button" class="layui-btn layui-btn-sm keyHandle" id="searchBtn_receiveAcct">搜索</button>
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="resetBtn_receiveAcct">清空</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="receiveAcctCard">
                <div class="layui-card-header toFixedContain" style="display: flex;
                    justify-content: flex-end;
                    align-items: center;">
                    <permTag:perm funcCode="createAcct_receiveAcct">
                        <button type="button" class="layui-btn layui-btn-sm" id="add_receiveAcct">新建收款账户</button>
                    </permTag:perm>
                    <permTag:perm funcCode="exportAcct_receiveAcct">
                        <button type="button" class="layui-btn layui-btn-sm" id="mr_receiveAcctExport">导出</button>
                    </permTag:perm>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="receiveAcctTab" lay-filter="receiveAcctTab"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 新增收款账户 -->
<script type="text/html" id="add_pop_receiveAcct">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" lay-filter="component-form-element" id="addForm_receiveAcct">
            <div class="layui-form-item" >
                <label class="layui-form-label">账户类型：</label>
                <div class="layui-input-block">
                    <select id="ra_acctType" name="acctType" lay-search>
                        <option value=""></option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">收款账户名：</label>
                <div class="layui-input-block">
                    <input type="text" name="acctName" class="layui-input" placeholder="如果是银行账户，就只写实际银行收款账户名，不要有任何备注。">
                </div>
            </div>
            <div class="layui-form-item" >
                <label class="layui-form-label">简称：</label>
                <div class="layui-input-block">
                    <input type="text" name="simpleName" class="layui-input" placeholder="对账户名进行注释，用以区分，请款时选择账户名会看到简称。">
                </div>
            </div>
            <div class="layui-form-item"notNull>
                <label class="layui-form-label">收款账户号：</label>
                <div class="layui-input-block">
                    <input type="text" name="acct" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item" >
                <label class="layui-form-label">银行名称：</label>
                <div class="layui-input-block">
                    <select id="ra_bank_name" name="bankName" lay-search>
                        <option value=""></option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item" >
                <label class="layui-form-label">开户省份：</label>
                <div class="layui-input-block">
                    <select id="ra_bank_province" name="bankProvince" lay-search lay-filter="ra_bank_province">
                        <option value=""></option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item" >
                <label class="layui-form-label">开户城市：</label>
                <div class="layui-input-block">
                    <select id="ra_bank_city" name="bankCity" lay-search>
                        <option value=""></option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">支行：</label>
                <div class="layui-input-block">
                    <input type="text" name="subBranch" class="layui-input" placeholder="单次付款预估超过2000,预估支付次数超过2次以上的必填">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">手机号：</label>
                <div class="layui-input-block">
                    <input type="text" name="telphone" class="layui-input" placeholder="单次付款预估超过2000,预估支付次数超过2次以上的必填">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">身份证：</label>
                <div class="layui-input-block">
                    <input type="text" name="idCard" class="layui-input" placeholder="单次付款预估超过2000,预估支付次数超过2次以上的必填">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">营业执照号：</label>
                <div class="layui-input-block">
                    <input type="text" name="businessLicenseNo" class="layui-input" placeholder="单次付款预估超过2000,预估支付次数超过2次以上的必填">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">支付平台：</label>
                <div class="layui-input-block">
                    <select id="receiveAcct_pay_platCode_sel" xm-select="receiveAcct_pay_platCode_sel"
                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
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
<script type="text/html" id="ra_checkStatusTpl">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" id="ra_checkStatusForm">
            <div class="layui-form-item">
                <label class="layui-form-label"></label>
                <div class="layui-input-block">
                    <input type="radio" name="checkStatus" value="0" title="未处理" >
                    <input type="radio" name="checkStatus" value="1" title="供应商包装">
                    <input type="radio" name="checkStatus" value="2" title="需要仓库包装">
                    <input type="radio" name="checkStatus" value="2" title="需要仓库包装">
                </div>
            </div>
        </form>
    </div>
</script>

<!-- table工具条 -->
<script type="text/html" id="receiveAcct_bar">
    <permTag:perm funcCode="updateAcct_receiveAcct">
        {{# if (!d.isChecked) { }}
        <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="update" >修改</a>
        {{# } }}
    </permTag:perm>
    <permTag:perm funcCode="changeStatus_receiveAcct">
    {{# if (d.status) { }}
        <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="change0" >停用</a>
    {{# } }}
    {{# if (!d.status) { }}
        <a class="layui-btn layui-btn-xs" lay-event="change1" >启用</a>
    {{# } }}
    </permTag:perm>
    <permTag:perm funcCode="changeChecked_receiveAcct">
        {{# if (d.checkStatus==0) { }}
        <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="updateCheckStatus" title="修改验证状态">验证</a>
        {{# } }}
        {{# if (d.checkStatus>0) { }}
        <a class="layui-btn layui-btn-xs layui-btn" lay-event="updateCheckStatus" title="修改验证状态">验证</a>
        {{# } }}
    </permTag:perm>
</script>


<script type="text/javascript" src="${ctx}/static/js/financial/bankAcct/receiveAcct.js"></script>

