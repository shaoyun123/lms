<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>订单延长</title>
<style>

    table.colspantable td {
        border: 0px;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    #ebay_online_isEnableForm .layui-form-select dl {
        max-height: 600px
    }

    #smt_extend_order .layui-tab-title {
        height: 41px !important;
    }

    #smt_extend_order .layui-tab-content {
        padding: 0;
    }

</style>
<div class="layui-fluid" id="smt_extend_order">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="smt_order_extend_searchForm" id="smt_order_extend_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="smt_order_extend_depart_sel" lay-search lay-filter="smt_order_extend_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="smt_order_extend_salesman_sel" lay-search lay-filter="smt_order_extend_salesman_sel" class="users_hp_custom" data-rolelist="smt专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="smt_order_extend_store_sel" xm-select-search
                                        xm-select="smt_order_extend_store_sel" 
                                        lay-filter="smt_order_extend_store_sel" class="store_hp_custom"
                                        xm-select-skin="normal"
                                        name="storeAcctId"
                                        data-platcode="aliexpress">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">订单自动延长</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="smt_extend_order_status">
                                        <option value="">请选择</option>
                                        <option value="1" selected>开启</option>
                                        <option value="0">关闭</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1" style="padding-left: 10px">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit  id="smt_extend_order_submit" lay-filter="smt_extend_order_submit">查询</span>
                                <span type="reset" class="layui-btn layui-btn-sm layui-btn-primary">清空</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="smt_onlineproductCard">
                <div class="layui-card-body">
                    <div class="dis_flex row_module_js">
                        <div class="layui-tab" lay-filter="smt_online_tab_filter">
                            <ul class="layui-tab-title">
                                <li class="layui-this" product_status_type="1">数量(<span id="smt_extend_store_number"></span>)</li>
                            </ul>
                        </div>
                        <div class="layui-form">
                            <div style="display:flex;">
                                <div style="display:flex;align-items:center" class="layui-form">
                                    <span>买家收货期倒计时第</span>
                                    <input style="width:50px;margin: 0 5px;" class="layui-input" id="countDownTime" name="countDownTime"/>
                                    <span>天,</span>
                                    <span>收货期自动延长</span>
                                    <input style="width:50px;margin: 0 5px;" id="extendDay" 
                                    class="layui-input" name="extendDay"/>
                                    <span>天,</span>
                                    <span>延长类型为</span>
                                    <div style="margin: 0 5px;width:120px;">
                                        <select name="extendType" id = "extendType">
                                            <option value="1">延长最大天数</option>
                                            <option value="2">延长指定天数</option>
                                        </select>
                                    </div>
                                </div>
                                <permTag:perm funcCode="order_extend_config">
                                    <span class="layui-btn layui-btn-sm" id="smt_extend_order_config_submit">保存</span>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                    <div class="layui-tab-content">
                        <table class="layui-table" id="smt_order_extend_store_data_table" lay-filter="smt_order_extend_store_data_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="${ctx}/static/js/smtissueinfo/smtorderextend.js"></script>


<script type="text/html" id="orderExtendStatusTemplet">
    <div class="layui-form-item" >
        <permTag:perm funcCode="order_extend_smtStore">
            {{# if(d.orderExtendStatus){ }}
            <input  type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderExtendStatus"
                    checked>
            {{# }else{ }}
            <input  type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderExtendStatus">
            {{# } }}
            <div style="display: none">{{d.id}}</div>
        </permTag:perm>
        <permTag:lacksPerm funcCode="order_extend_smtStore">
            {{# if(d.orderExtendStatus){ }}
            <input  type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderExtendStatus"
                    checked disabled>
            {{# }else{ }}
            <input  type="checkbox" lay-skin="switch" lay-text="开启|关闭" lay-filter="orderExtendStatus" disabled>
            {{# } }}
        </permTag:lacksPerm>
    </div>
</script>