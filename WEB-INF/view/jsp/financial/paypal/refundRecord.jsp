<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>经理退款</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form class="layui-form" name="searchForm_refundRecord">
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">paypal账号</label>
                                    <div class="layui-input-block">
                                        <div class="layui-form" lay-filter="component-form-element">
                                            <select name="paypalEmail" lay-search>
                                                <option value="">全部</option>
                                            </select>
                                            <div name="paypalEmail_available" hidden="hidden">
                                                <option value="">全部</option>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">原始交易ID</label>
                                    <div class="layui-input-block">
                                        <div class="layui-form" lay-filter="component-form-element">
                                            <input type="text" class="layui-input" placeholder="多个逗号分隔" name="transactionIdList">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">开始日期</label>
                                    <div class="layui-input-block">
                                        <div class="layui-form" lay-filter="component-form-element">
                                            <input type="text" class="layui-input" id="beginDate_refundRecord" readonly="readonly">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">结束日期</label>
                                    <div class="layui-input-block">
                                        <div class="layui-form" lay-filter="component-form-element">
                                            <input type="text" class="layui-input" id="endDate_refundRecord" readonly="readonly">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                   <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload"
                                            id="redundRecordSearch">搜索
                                    </button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                        </form>
                </div>
            </div>
            <div class="layui-card" id="refoundrecordCard">
                <div class="layui-card-header toFixedContain">
                        <input id="importFile" hidden="hidden" type="file">
                        <button class="layui-btn-sm layui-btn w100" id="importFileBtn">导入</button>
                        <button class="layui-btn-sm layui-btn w100" id="exportBtn">导出</button>
                        <a id="downLoadTemplet">
                            <button class="layui-btn-sm layui-btn w100">下载模板</button>
                        </a>
                        <button class="layui-btn layui-btn-sm" type="button" id="addOneRefundRecodBtn" style="float:right">新建退款单</button>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="refundRecordTable" lay-filter="refundRecordTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%--新建退款单--%>
<script type="text/html" id="add_refund_record">
    <div style="padding-top: 20px;padding-right: 40px;">
        <form class="layui-form" action="" lay-filter="component-form-element" id="addRefundRecordForm">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>交易ID：</label>
                <div class="layui-input-block">
                    <input type="text" name="transactionId" class="layui-input" >
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>首选邮箱：</label>
                <div class="layui-input-block">
                    <select name="fromPaypalAcct" lay-search>
                        <option value="">请选择paypal首选邮箱</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>退款金额：</label>
                <div class="layui-input-block">
                    <input type="text" name="amount" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="colorRed">*</span>处理结果：</label>
                <div class="layui-input-block">
                    <input type="text" name="dealResult" class="layui-input" maxlength="166"/>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注：</label>
                <div class="layui-input-block">
                    <textarea type="text" name="remark" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- table工具条 -->
<script type="text/html" id="refund_bar">
    <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete" >删除</div>
        <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="update" >修改</div>
</script>


<script type="text/javascript" src="${ctx}/static/js/financial/paypal/refundRecord.js"></script>
