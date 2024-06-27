<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>广告费占比统计</title>
<style type="text/css">
</style>
<div class="layui-fluid" id="LAY-amazonAdvertisingRateCompution">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="amazonAdvertisingRateCompution_search_form"
                          lay-filter="amazonAdvertisingRateCompution_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonOrgId"
                                            id="amazonAdvertisingRateCompution_online_depart_sel" lay-search
                                            lay-filter="amazonAdvertisingRateCompution_online_depart_sel"
                                            class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonId" id="amazonAdvertisingRateCompution_online_salesman_sel"
                                            lay-search
                                            lay-filter="amazonAdvertisingRateCompution_online_salesman_sel"
                                            class="users_hp_custom"
                                            data-rolelist="amazon专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="amazonAdvertisingRateCompution_online_store_sel"
                                            lay-filter="amazonAdvertisingRateCompution_online_store_sel"
                                            xm-select="amazonAdvertisingRateCompution_online_store_sel"
                                            class="users_hp_store_multi"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            data-platcode="amazon" name="storeAcctIdList"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="siteIdList" id="amazonAdvertisingRateComputionsiteIdList"
                                            lay-filter="amazonAdvertisingRateComputionsiteIdList"
                                            xm-select="amazonAdvertisingRateComputionsiteIdList"
                                            xm-select-search-type="dl" xm-select-skin="normal"
                                            xm-select-type="1">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">区间</label>
                                <div class="layui-input-block">
                                    <select name="timeCycle">
                                        <option value="2">近1天</option>
                                        <option value="8"> 近7天</option>
                                        <option value="31"> 近30天</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否跟卖店铺</label>
                                <div class="layui-input-block">
                                    <select name="autoFollowSell" class="layui-select">
                                        <option value=""></option>
                                        <option value="0">否</option>
                                        <option value="1">是</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <button type="button" style="margin-left: 50px;" class="layui-btn" type="submit"
                                        lay-submit="" lay-filter="search_btn"
                                        id="amazonAdvertisingRateCompution_search_btn">查询
                                </button>

                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                        id="amazonAdvertisingRateCompution_reset">清空
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div>
                    <div class="layui-card-header">
                        <div style="display:flex;justify-content:flex-start;align-items:center;height: 100%;">
                            <button type="button" class="layui-btn layui-btn-sm"
                                    id="amazonAdvertisingRateCompution_out">
                                导出
                            </button>
                            <button type="button" class="layui-btn layui-btn-sm"
                                    id="amazonAdvertisingRateCompution_detail_out">
                                导出每日明细
                            </button>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="amazonAdvertisingRateCompution_table"
                           lay-filter="amazonAdvertisingRateCompution_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="amazonAdvertisingRateCompution_acosRate">
    <span>{{d.acos}}%</span>
</script>
<script type="text/html" id="amazonAdvertisingRateCompution_acoasRate">
    <span>{{d.acoas}}%</span>
</script>
<script type="text/html" id="amazonAdvertisingRateCompution_acos">
    <span>{{d.acos}}%</span>
</script>
<script type="text/html" id="amazonAdvertisingRateCompution_acoas">
    <span>{{d.acoas}}%</span>
</script>
<script type="text/html" id="amazonAdvertisingRateCompution_operation">
    {{# if(d.siteCode){ }}
    <span class="layui-btn layui-btn-xs" lay-event="amazonAdvertisingRateCompution_detail">查看明细</span>
    {{# } }}
</script>
<script type="text/html" id="amazonAdvertisingRateCompution_detail_view">
    <div class="layui-form-item" style="margin-top:20px">
        <div class="layui-form-item">
            <h2 style="text-align: center;">
                <span id="amazonAdvertisingRateCompution_item_info_title"></span>
            </h2>
        </div>
        <div class="layui-form-item">
            <h4 class="text-center" style="text-align: center;">
                <span id="amazonAdvertisingRateCompution_item_info_sub_title"></span>
            </h4>
        </div>
    </div>
    <div class="layui-card container-fluid">
        <div class="layui-card-body row-fluid">
            <table class="layui-table layui-table-hover"
                   lay-filter="amazonAdvertisingRateCompution_datadetail_table"
                   id="amazonAdvertisingRateCompution_datadetail_table"></table>
        </div>
    </div>
</script>
<script src="${ctx}/static/js/work/amazon/amazonAdvertisingRateCompution.js"></script>