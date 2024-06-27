<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<style>

</style>
<title>smt订单提醒</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md15">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="smt_order_remind_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="smt_order_remind_depart_sel" lay-search lay-filter="smt_order_remind_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">客服人员</label>
                                <div class="layui-input-block">
                                    <select  id="smt_order_remind_salesman_sel" lay-search lay-filter="smt_order_remind_salesman_sel"  class="users_hp_custom" data-rolelist="smt客服专员" data-type="customservicer">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select class="users_hp_store_multi"
                                    data-platcode="aliexpress"  
                                    id='smt_order_remind_store_sel'  
                                    xm-select="smt_order_remind_store_sel" 
                                    xm-select-type="1" 
                                    xm-select-search-type="dl" 
                                    xm-select-search xm-select-skin="normal" 
                                    lay-filter="smt_order_remind_store_sel" 
                                    name="smtRemind_smtorderremindsearchForm_select">
                                        <option value=""></option>
                                    </select>
                                </div>                              
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-inline" style="float: right">
                                    <button id="smt_order_sync_Btn" class="layui-btn layui-btn-sm keyHandle" type="button">同步订单状态</button>
                                </div>
                                <div class="layui-inline" style="float: right">
                                    <button id="smt_order_remind_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div> 
            </div>
            <div class="layui-card" id="smt_order_remindCard">
                <div class="layui-tab-content" id="issue_processing_div" style="">
                    <table id="smt_order_remind_table" lay-filter="v"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="smtOrderRemindProcessBar">
    <div class="copySpan">
        <button class="layui-btn layui-btn-danger layui-btn-xs" onclick="smtRemind_copyTxt(this)" style="top:-20px;left:44px;">复制订单号</button>
        <div class="ms-cont1"  style="display: none">{{d.orderIds}}</div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/order/smtRemind.js"></script>
