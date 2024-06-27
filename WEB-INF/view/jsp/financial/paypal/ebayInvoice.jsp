<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>ebay结账单</title>

<style>
    /*#LAY-financial-paypal-payOrder td[data-field="remark"] .layui-table-cell,*/
    /*#LAY-financial-paypal-payOrder td[data-field="checkRemark"] .layui-table-cell{*/
    /*overflow: visible; */
    /*text-overflow: inherit;*/
    /*white-space: normal;*/
    /*}*/
    .showMultiRow{
        white-space:normal;
        word-break:break-all;
        word-wrap:break-word;
    }
</style>

<div class="layui-fluid" id="LAY-financial-paypal-ebayInvoice">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body layui-row">
                    <div class="layui-col-lg12 layui-col-md12">
                        <form class="layui-form" lay-filter="component-form-group" name="searchForm_ebayInvoice">
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">paypal账号</label>
                                    <div class="layui-input-block">
                                        <select name="paypalEmail"  lay-search>
                                            <option value="">全部</option>
                                        </select>
                                        <div name="paypalEmail_available" hidden="hidden">
                                            <option value="">原始账号如果被停用，将不再显示</option>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">开始日期</label>
                                    <div class="layui-input-block">

                                        <input type="text" id="beginDate_ebayInvoice" name="beginDate" class="layui-input" readonly="readonly">
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">结束日期</label>
                                    <div class="layui-input-block">
                                        <input type="text" id="endDate_ebayInvoice" name="endDate" class="layui-input" readonly="readonly">

                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <div class="layui-form-label" style="padding: 0 15px">
                                        <select name="searchType" lay-verify="required" lay-filter="aihao">
                                            <option value="">筛选条件</option>
                                            <option value="toPaypalEmail">ebay账号</option>
                                            <option value="amount">金额</option>
                                            <option value="remark">备注</option>
                                            <option value="transactionId">PPID</option>
                                            <option value="creator">创建人</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" name="searchData" class="layui-input" >
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3 pl20">
                                    <button type="button" class="layui-btn layui-btn-sm keyHandle" id="searchPaypalBtn_ebayInvoice">搜索</button>
                                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="resetBtn_ebayInvoice">清空</button>
                                </div>
                                <div name="currencyCode" style="display: none"></div>
                            </div>
                            <input hidden name="checkStatus" class="hiddenContent">
                            <div hidden name="companyName">
                            </div>
                            <div hidden name="ebayAcct">
                                <option value=""></option>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="ebayinvoiceCard">
                <div class="layui-card-header toFixedContain">
                    <span class="numCount">数量(<span id="totalNum_ebayInvoice">0</span>)</span>
                    <button class="layui-btn layui-btn-sm mb10" id="addEbayInvoice">新建结账单</button>
                    <button class="layui-btn layui-btn-sm mb10" id="exportOrder_ebayInvoice">导出</button>
                    <button class="layui-btn layui-btn-sm mb10" id="importOrder_ebayInvoice">导入</button>
                    <button class="layui-btn layui-btn-sm mb10" id="importTemplate_ebayInvoice">下载模板</button>
                    <input hidden type="file" id="importFile_ebayInvoice" />
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="ebayInvoiceTab" lay-filter="ebayInvoiceTab"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 新增打款单 -->
<script type="text/html" id="add_ebay_invoice_pop">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" lay-filter="component-form-element" id="addEbayInvoiceForm">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>公司：</label>
                <div class="layui-input-block">
                    <select name="companyName" lay-filter="companySelect_ebayInvoice">
                    </select>
                </div>
            </div>
            <div class="layui-form-item" id="channelInp_contain_addPayOrder">
                <label class="layui-form-label"><span class="colorRed">*</span>平台：</label>
                <div class="layui-input-block">
                    <input type="text" name="channel" class="layui-input" readonly="readonly" value="ebay">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>付款账号：</label>
                <div class="layui-input-block">
                    <select name="fromPaypalEmail" lay-verify="required" lay-search>
                    <option value="">全部</option>
                    </select>
                    <%--<input type="text" name="fromPaypalEmail" class="layui-input" readonly="readonly" value="worldofwell@gmail.com">--%>
                </div>
            </div>
            <div class="layui-form-item" id="ebayAcct_contain_addPayOrder">
                <label class="layui-form-label"><span class="colorRed">*</span>ebay账号：</label>
                <div class="layui-input-block">
                    <input type="text" name="toPaypalEmail" class="layui-input">
                    <%--<select name="toPaypalEmail"  lay-search>--%>
                    <%--</select>--%>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>币种：</label>
                <div class="layui-input-block">
                    <select name="currencyCode" lay-verify="required">
                        <option value="USD">美元</option>
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
                <label class="layui-form-label">备注：</label>
                <div class="layui-input-block">
                    <input type="text" name="remark" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>交易PaypalID：</label>
                <div class="layui-input-block">
                    <input type="text" name="transactionId" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">交易截图：</label>
                <div class="layui-input-block">
                    <input type="file" name="file" class="layui-input">
                </div>
            </div>
        </form>
    </div>
</script>

<%--图片模板--%>
<script type="text/html" id="payImg_ebayInvoice">
    {{# if (d.payImgUrl){ }}
    <div>
        <img width="60" height="60" src="{{ d.payImgUrl }}" class="img_show_hide b1" onerror="layui.admin.img_noFind()">
    </div>
    {{# } }}
</script>

<%--状态模板--%>
<script type="text/html" id="ebayInvoiceStatus">
    {{# if (d.checkStatus == 1){ }}
    <div style="color: orange">
        未核单
    </div>
    {{# } }}
    {{# if (d.checkStatus >= 2){ }}
    <div style="color: green">
        已核单
    </div>
    {{# } }}
    <%--{{# if (d.checkStatus == 3){ }}--%>
    <%--<div style="color: red">--%>
        <%--核单失败--%>
    <%--</div>--%>
    <%--{{# } }}--%>
</script>

<!-- table工具条 -->
<script type="text/html" id="ebayInvoice_bar">
    {{# if (d.checkStatus == 1) { }}
    <div class="mb10">
        <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="update" >修改</a>
    </div>
    {{# } }}
    {{# if (d.checkStatus == 1) { }}
    <div class="mb10">
        <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete" >删除</a>
    </div>
    {{# } }}
</script>


<script type="text/html" id="remark_ebayInvoice">
    <p class="showMultiRow">
        {{ d.remark ? d.remark : ''}}
    </p>
</script>

<script type="text/javascript" src="${ctx}/static/js/financial/paypal/ebayInvoice.js"></script>
