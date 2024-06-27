<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>调价通知</title>
<style>
</style>
<div class="layui-fluid" id="LAY-commodity-process-adjustprice">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustprice_priceSearchForm" class="layui-form" lay-filter="adjustprice_priceSearchForm">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="timeType" lay-search>
                                        <option value="1">创建时间</option>
                                        <option value="2">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="timeRange" class="layui-input" id="adjustprice_timeRange" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="organize" lay-filter="adjustprice__orgs_hp_devPerson" class="orgs_hp_custom" data-id="adjustprice__orgs_hp_devPerson" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label labelSel">
                                    <select name="userType" lay-search>
                                        <option value="bizzOwnerIdList">开发专员</option>
                                        <option value="responsorIdList">责任人</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <select name="userId" lay-filter="adjustprice__users_hp_devPerson" lay-search="" class="users_hp_custom" data-id="adjustprice__users_hp_devPerson" data-roleList="开发专员">
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block">
                                    <select name="buyerIdListStr" id="adjustprice_buyerIdListStr" xm-select="adjustprice_buyerIdListStr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='adjustprice_buyerIdListStr'>
                                    </select>
                                </div>
                            </div>
                            <!-- <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerIdList" id="adjustprice_bizzOwnerIdListStr" xm-select="adjustprice_bizzOwnerIdListStr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='adjustprice_bizzOwnerIdListStr'>
                                    </select>
                                </div>
                            </div> -->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" name="sSkuListStr" class="layui-input" placeholder="单个模糊，多个精确查询" maxlength="5000">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">审核状态</label>
                                <div class="layui-input-block">
                                    <select name="auditStatus" lay-search>
                                        <option value=""></option>
                                        <option value="0" selected>待审核</option>
                                        <option value="1">审核通过</option>
                                        <option value="2">审核失败</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">审核人</label>
                                <div class="layui-input-block">
                                    <select name="auditorIdListStr" id="adjustprice_auditorIdListStr" xm-select="adjustprice_auditorIdListStr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='adjustprice_auditorIdListStr'>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">修改人</label>
                                <div class="layui-input-block">
                                    <select name="creatorIdListStr" id="adjustprice_creatorIdListStr" xm-select="adjustprice_creatorIdListStr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='adjustprice_creatorIdListStr'>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="auditRemark" class="layui-input" maxlength="2000">
                                </div>
                            </div>
                            <input type="hidden" name="orderBy" value="" />
                            <div class="layui-col-lg2 layui-col-md2 pl20 fr">
                                <button type="button" class='layui-btn layui-btn-sm keyHandle' data-type="reload" id="adjustprice_priceSearchBtn">搜索</button>
                                <button type="reset" class='layui-btn layui-btn-primary layui-btn-sm' data-type="reload" id="adjustprice_priceResetBtn">清空</button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="adjustpriceCard">
                <div class="layui-card-header fl">
                    <permTag:perm funcCode="adjustprice_export">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-warm" id="adjustprice_export">导出</button>
                    </permTag:perm>
                </div>
                <div class="layui-card-header fr">
                    <permTag:perm funcCode="adjustprice_audit">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-warm" id="adjustprice_batchAudit">批量审核</button>
                    </permTag:perm>
                    <permTag:perm funcCode="adjustprice_editThreshold">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" id="adjustprice_editThreshold">修改审核参数</button>
                    </permTag:perm>
                </div>
                <div class="clearLeft">
                </div>

                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="adjustprice_table" lay-filter="adjustprice_table"></table>

                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="adjustprice_auditPop">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="adjustprice_auditForm"  lay-filter="adjustprice_auditForm" autocomplete="off">
                        <div class="layui-form-item" notNull>
                                <label class="layui-form-label">审核结果</label>
                                <div class="layui-input-block">
                                    <select name="auditStatus" lay-search>
                                        <option value=""></option>
                                        <option value="1">审核通过</option>
                                        <option value="2">审核失败</option>
                                    </select>
                                </div>
                        </div>
 						<div class="layui-form-item">
                              <label class="layui-form-label">审核备注</label>
                                <div class="layui-input-block">
                                    <textarea class="layui-textarea" name="auditRemark" ></textarea>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script id="adjustprice_Bar" type="text/html">
    {{# if (d.auditStatus != 1) {}}
        <permTag:perm funcCode="adjustprice_audit">
        <div class="layui-btn layui-btn-sm layui-btn-warm" lay-event="audit">审核</div>
        </permTag:perm>
    {{#}}}
</script>
<script src="${ctx}/static/js/commodity/process/adjustprice.js"></script>

<script id="adjustprice_editThresholdPop" type="text/html">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <p>tips:</p>
            <p>1、若商品成本变动比例>【阈值百分比】，并且成本变动差值>【阈值绝对值】，调价通知需要人工审核，否则自动审核通过</p>
            <p>2、若商品毛重变动比例>【阈值百分比】，并且商品毛重变动差值>【阈值绝对值】，调价通知需要人工审核，否则自动审核通过</p>
            <p>3、变动比例请填写小数。 如【商品成本变动比例】 填写0.1代表10% </p>
            <p>4、因为有缓存，修改后30秒才会生效</p>
        </div>
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="adjustprice_editThresholdForm"  lay-filter="adjustprice_editThresholdForm" autocomplete="off">
                        <table class="layui-table" id="adjustprice_thresholdTable" lay-filter="adjustprice_thresholdTable"></table>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

