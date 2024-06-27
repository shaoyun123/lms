<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>自动审核规则</title>
<style>
    .redfont{
        color:red!important;
    }
    .green{
        color:green!important;
    }
    .fr{
        float: right;
    }
    .dis_flex{
        display: flex;
        justify-content: space-between;
    }

    .condition_box{
    border: 1px solid #ccc;
    border-radius: 4px 4px 0 0;
    }

    #newhandle_ignoreRulesForm .w_70{
        width: 70%;
    }

    #newhandle_ignoreRulesForm .w_30{
        width:30%
    }

    #newhandle_ignoreRulesForm .h_min400{
        min-height: 400px;
    }
    .mg_20{
        margin:20px
    }
    #newhandle_ignoreRulesForm .title{
        border-bottom: 1px solid #ccc;
        background-color: #eeeeee;
        line-height: 38px;
        padding-left: 5px;
    }

    #newhandle_ignoreRulesForm .pd{
        padding:5px
    }

    .autoAuditRules_a{
        color: #428bd4 !important;
        text-decoration: none;
    }

    .padding_9{
        padding:9px 15px;
    }

    .eclipsedis{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .country_countainer_search {
        width: 270px;
        position: absolute;
        z-index: 999;
        top: 35px;
        right: 45px;
    }
    #autoAuditRules_country_container .country_countainer_content .layui-form-checkbox,
    #autoAuditRules_country_container .country_countainer_selected .country_countainer_selected_content .layui-form-checkbox{
    width: 200px;
    padding: 5px;
    }
    #autoAuditRules_country_container .country_countainer_content .layui-form-checkbox span,
    #autoAuditRules_country_container .country_countainer_selected .country_countainer_selected_content .layui-form-checkbox span {
    position: absolute;
    left: 15px;
    }
    #autoAuditRules_country_container .country_countainer_selected {
        border: 1px solid #d6e9c6;
        border-radius: 2px;
    }
    #autoAuditRules_country_container .country_countainer_selected .country_countainer_selected_title{
    height:40px;
    line-height: 40px;
    background-color:#dff0d8;
    padding-left: 20px;
    position: relative;
    }
    #autoAuditRules_country_container .country_countainer_selected .country_countainer_selected_title h3{
    color: #468847;
    }
    #autoAuditRules_country_container .country_countainer_selected .country_countainer_selected_content {
        padding: 5px 20px;
    }

</style>

<div class="layui-fluid" id="LAY-autoAuditRules">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body dis_flex">
                    <div class="w300">
                        <p>基础规则：</p> 
                        <p>最基础：待审核状态订单</p>
                        <ol>
                            <li>1.买家留言为空</li>
                            <li>2.排除SKU异常</li>
                            <li>3.排除可合并订单</li>
                            <li>4.符合平台订单状态</li>
                            <%-- <li>5.订单利润≥0</li> --%>
                        </ol>
                    </div>
                </div>
                <div class="layui-card-body">
                   <table class="layui-table" id="autoAuditRules_table"  lay-filter="autoAuditRules_table"></table>
                </div>
            </div>
        </div>
</script>

<!-- 操作栏 -->
<script type="text/html" id="autoAuditRules_Tool">
    {{# if(d.autoAudit){ }}
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="autoAudit_off">停用</button>
    {{# }else{ }}
    <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="autoAudit_on">启用</button>
    {{# } }}
    <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="manageIgnoreCondition">不处理条件</button>
</script>
<!-- 状态列 -->
<script type="text/html" id="autoAuditRules_auditStatustpl">
    {{# if(d.autoAudit){ }}
    <div class="green">已启用</div>
    {{# }else{ }}
    <div class="redfont">已停用</div>
    {{# } }}
</script>

<!-- 不处理条件弹框 -->
<script type="text/html" id="autoAuditRules_mangeIgnorePop">
    <div class="layui-col-lg12 layui-col-md12">
        <div class="layui-card">
            <input type="hidden" name="autoAuditRules_mangeIgnorePopName">
            <div class="layui-card-body clearfix">
                <button class="layui-btn layui-btn-sm layui-btn-normal fr">新增</button>
            </div>
            <div class="layui-card-body">
               <!-- <table class="layui-table" id="mangeIgnoreConditionTable"  lay-filter="mangeIgnoreConditionTable"></table> -->
               <table class="layui-table" id="mangeIgnoreConditionTable"  lay-filter="mangeIgnoreConditionTable">
                <thead>
                    <th lay-data="{field:'warehouseType'}">仓库模式</th>
                    <th lay-data="{field:'platCodes'}">平台</th>
                    <th lay-data="{field:'storeAcctIds'}">店铺</th>
                    <th lay-data="{field:'storeShippingTypes'}">店铺运输方式</th>
                    <th lay-data="{field:'logisTypeNames'}">物流方式</th>
                    <th lay-data="{field:'countryCode'}">国家/地区</th>
                    <th lay-data="{field:'orderProfit'}">利润区间</th>
                    <th lay-data="{field:'orderProfitRate'}">利润率区间</th>
                    <th lay-data="{field:'orderAmt'}">订单金额(原币种)</th>
                    <th lay-data="{field:'configTime', width: 120}">订单时间(小时)&lt;</th>
                    <th lay-data="{field:'options'}">操作</th>
                </thead>
                <tbody style="text-align: center;" id="mangeIgnoreConditionTable_body">
                </tbody>
            </table>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="mangeIgnoreConditionTable_bodytpl">
    {{#  layui.each(d, function(index, item){ }}
       <tr data-index="{{index}}">
           <td>
               <div>{{getWarehouseTypeName(item.warehouseType)||""}}</div>
           </td>
           <td>
               <div>{{item.platCodes||""}}</div>
           </td>
           <td>
            <div class="eclipsedis suspension" data-note="{{item.storeAcctNames}}">{{item.storeAcctNames||""}}</div>
        </td>
           <td>
               <div>{{item.storeShippingTypes||""}}</div>
           </td>
           <td>
               <div>{{item.logisTypeNames||""}}</div>
           </td>
           <td>{{item.countryCode||""}}</td>
           <td>
            {{# if(item.orderProfit){ }}
            <div><span>{{item.orderProfit.minAmt}}</span> ~ <span>{{item.orderProfit.maxAmt}}</span></div>
            {{# } }}
           </td>
           <td>
            {{# if(item.orderProfitRate){ }}
            <div><span>{{item.orderProfitRate.minRate}}</span> ~ <span>{{item.orderProfitRate.maxRate}}</span></div>
            {{# } }}
           </td>
           <td>
            {{# if(item.orderAmt){ }}
            <div><span>{{item.orderAmt.minAmt}}</span> ~ <span>{{item.orderAmt.maxAmt}}</span>(<span>{{item.orderAmt.currency}}</span>)</div>
            {{# } }}
           </td>
           <td>{{item.configTime || ''}}</td>
           <td>
            <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="handleIgnore_modify">修改</button>
            <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="handleIgnore_delete">删除</button>
           </td>
       </tr>
    {{# }) }}
</script>

<!-- 不处理条件弹框内表格列展示 -->

<!-- 仓库模式列 -->
<script type="text/html" id="handleIgnore_warehousemode">
    <div>{{getWarehouseTypeName(d.warehouseType)}}</div>
</script>

<!-- 利润区间列 -->
<script type="text/html" id="handleIgnore_orderProfit">
    {{# if(d.orderProfit){ }}
    <div><span>{{d.orderProfit.minAmt}}</span> ~ <span>{{d.orderProfit.maxAmt}}</span></div>
    {{# } }}
</script>

<!-- 利润率区间列 -->
<script type="text/html" id="handleIgnore_orderProfitRate">
    {{# if(d.orderProfitRate){ }}
    <div><span>{{d.orderProfitRate.minRate}}</span> ~ <span>{{d.orderProfitRate.maxRate}}</span></div>
    {{# } }}
</script>

<!-- 金额区间 -->
<script type="text/html" id="handleIgnore_orderAmt">
    {{# if(d.orderAmt){ }}
    <div><span>{{d.orderAmt.minAmt}}</span> ~ <span>{{d.orderAmt.maxAmt}}</span>(<span>{{d.orderAmt.currency}}</span>)</div>
    {{# } }}
</script>

<!-- 操作栏 -->
<script type="text/html" id="handleIgnore_optiontpl">
    <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="handleIgnore_modify">修改</button>
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="handleIgnore_delete">删除</button>
</script>

<!-- 新增不处理条件弹框 -->
<script type="text/html" id="new_mangeIgnorePop">
    <div class="mg_20">
        <form class="layui-form" id="newhandle_ignoreRulesForm" lay-filter="newhandle_ignoreRulesForm">
        <div class="layui-form-item">
            <div class="layui-col-md6">
                <label class="layui-form-label">仓库模式</label>
                <div class="layui-input-block">
                    <select name="warehouseType" lay-search lay-verify="required">
                    </select>
                </div>
            </div>
            <input type="hidden" name="id">
        </div>
        <div class="layui-form-item dis_flex">
            <div class="condition_box w_70 h_min400 mg_20">
                <div class="title">已选条件</div>
                <ul id="autoRules_conditions"></ul>
            </div>
            <div class="condition_box w_30 h_min400 mg_20">
                <div class="title">选择条件</div>
                <ul class="autoRules_conditionType">
                    <!-- <li class="pd"><input type="checkbox" lay-filter="autoAuditRuleschooseType" name="platCodes" value="platCodes" title="平台" lay-skin="primary"></li> -->
                    <li class="pd"><input type="checkbox" lay-filter="autoAuditRuleschooseType" name="storeAcctIds" value="storeAcctIds" title="店铺" lay-skin="primary"></li>
                    <li class="pd"><input type="checkbox" lay-filter="autoAuditRuleschooseType" name="storeShippingTypes" value="storeShippingTypes" title="店铺运输方式" lay-skin="primary"></li>
                    <li class="pd"><input type="checkbox" lay-filter="autoAuditRuleschooseType" name="logisTypeNames" value="logisTypeNames" title="物流方式" lay-skin="primary"></li>
                    <li class="pd"><input type="checkbox" lay-filter="autoAuditRuleschooseType" name="orderProfit" value="orderProfit" title="利润" lay-skin="primary"></li>
                    <li class="pd"><input type="checkbox" lay-filter="autoAuditRuleschooseType" name="orderProfitRate" value="orderProfitRate" title="利润率" lay-skin="primary"></li>
                    <li class="pd"><input type="checkbox" lay-filter="autoAuditRuleschooseType" name="orderAmt" value="orderAmt" title="订单金额" lay-skin="primary"></li>
                    <li class="pd"><input type="checkbox" lay-filter="autoAuditRuleschooseType" name="countryCode" value="countryCode" title="国家/地区" lay-skin="primary"></li>
                    <li class="pd"><input type="checkbox" lay-filter="autoAuditRuleschooseType" name="configTime" value="configTime" title="配置时间" lay-skin="primary"></li>
                </ul>
            </div>
        </div>
    </form>
    </div>
</script>

<!-- 平台 -->
<script type="text/html" id="autoAuditRules_platformPop">
    <div id="autoAuditRules_platformContainer" class="layui-form" style="padding:20px;">
    </div>
</script>

<script type="text/html" id="autoAuditRules_platformContainertpl">
    {{#  layui.each(d, function(index, item){ }}
       <input type="checkbox" title="{{item}}" lay-skin="primary" value="{{item}}">
    {{# }) }}
</script>

<!-- 店铺 -->
<script type="text/html" id="autoAuditRules_storePop">
    <div id="autoAuditRules_store_container" class="layui-form">
        <div id="autoAuditRulesXTree" style="width:500px;padding: 10px 0 25px 5px;"></div>
    </div>
</script>

<!-- 店铺运输方式 -->
<script type="text/html" id="autoAuditRules_transportPop">
    <div id="autoAuditRules_transport_container" style="padding:20px;">
        <div class="layui-form">
            <div class="layui-form-item" style="margin-left: -25px;">
                <label class="layui-form-label">运输方式</label>
                <div class="layui-input-inline" style="width: 250px;">
                    <input type="text" class="layui-input">
                </div>
                <div class="layui-input-inline" style="width: 68px;">
                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="autoAuditRulesTable_tbody_add">新增一行</span>
                </div>
            </div>
        </div>
        <div class="transportTable" style="margin: 0 18px;">
            <table class="layui-table">
                <thead>
                    <th>店铺运输方式</th>
                    <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="autoAuditRulesTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>

<!-- 利润 -->
<script type="text/html" id="autoAuditRules_orderprofitPop">
    <div id="autoAuditRules_orderprofit_container" class="layui-form" style="padding:20px;">
        <form class="layui-form" lay-filter="autoAuditRules_orderprofitForm">
            <div class="layui-form-item">
                <div class="layui-col-md6">
                    <label class="layui-form-label">币种：</label>
                    <div class="layui-input-block">
                        <div class="padding_9">RMB</div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item dis_flex">
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">金额</label>
                    <div class="layui-input-block">
                        <div class="dis_flex">
                            <input type="number" class="layui-input" name="minAmt">
                            <span class="padding_9"> ~ </span>
                            <input type="number" class="layui-input" name="maxAmt">
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- 利润率 -->
<script type="text/html" id="autoAuditRules_orderprofitRatePop">
    <div id="autoAuditRules_orderprofitRate_container" class="layui-form" style="padding:20px;">
        <form class="layui-form" lay-filter="autoAuditRules_orderprofitRateForm">
            <div class="layui-form-item">
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">!注意：</label>
                    <div class="layui-input-block">
                        <div class="padding_9">利润率需填写小数,如0.01</div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item dis_flex">
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">金额</label>
                    <div class="layui-input-block">
                        <div class="dis_flex">
                            <input type="number" class="layui-input" name="minRate" max="1" min="0" step="0.01">
                            <span class="padding_9"> ~ </span>
                            <input type="number" class="layui-input" name="maxRate" max="1" min="0" step="0.01">
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- 订单金额 -->
<script type="text/html" id="autoAuditRules_orderAmt">
    <div id="autoAuditRules_orderAmt_container" class="layui-form" style="padding:20px;">
        <form class="layui-form" lay-filter="autoAuditRules_orderAmtForm">
            <div class="layui-form-item">
                <div class="layui-col-md6">
                    <label class="layui-form-label">币种</label>
                    <div class="layui-input-block">
                        <select name="" id=""></select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item dis_flex">
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">金额</label>
                    <div class="layui-input-block">
                        <div class="dis_flex">
                            <input type="number" class="layui-input" name="minAmt"  min="0">
                            <span class="padding_9"> ~ </span>
                            <input type="number" class="layui-input" name="maxAmt"  min="0">
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- 物流方式 -->
<script type="text/html" id="autoAuditRules_logicsPop">
    <div id="autoAuditRules_logics_container" style="padding:20px;">
        <div class="layui-form">
            <div class="layui-form-item" style="margin-left: -25px;">
                <label class="layui-form-label">物流方式</label>
                <div class="layui-input-inline" style="width: 250px;">
                    <input type="text" class="layui-input">
                </div>
                <div class="layui-input-inline" style="width: 68px;">
                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="autoAuditRules_logicsTable_tbody_add">新增一行</span>
                </div>
            </div>
        </div>
        <div class="transportTable" style="margin: 0 18px;">
            <table class="layui-table">
                <thead>
                    <th>物流方式</th>
                    <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="autoAuditRules_logicsTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>

<!-- options tpl -->
<script type="text/html" id="autoAuditRules_options_tpl">
    <option value="">请选择</option>
    {{#  layui.each(d, function(index, item){ }}
    <option value="{{item.code}}">{{item.name}}</option>
    {{# }) }}
</script>

<%-- country --%>
<script type="text/html" id="autoAuditRules_countryLayer">
    <div id="autoAuditRules_country_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="autoAuditRules_country_containerTpl">
    <div class="country_countainer_search disflex">
       <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-normal mr10" id="autoAuditRules_country_checkSelect_btn">一键选择</a >
       <input type="text" class="layui-input" placeholder="回车搜索,多个搜索逗号隔开;" name="country_search">
    </div>
    <div class="country_countainer_content">
        <div class="layui-tab layui-tab-card">
            <ul class="layui-tab-title">
                <li class="layui-this">A-E</li>
                <li>F-J</li>
                <li>K-O</li>
                <li>P-T</li>
                <li>U-Z</li>
            </ul>
            <div class="layui-tab-content allCountryContainer">
                <div class="layui-tab-item layui-show">
                    <div class="layui-form">
                       <input type="checkbox" title="全选" lay-skin="primary" lay-filter="aeCountries">
                    </div>
                    <div class="layui-form">
                    {{#  layui.each(d['A-E'], function(index, item){ }}
                    <input type="checkbox" title="{{item.name}}({{item.abbr}})" name="{{item.abbr}}&auto" lay-skin="primary" lay-filter="conditionCountriesFilter">
                    {{#  }) }}
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-form">
                       <input type="checkbox" title="全选" lay-skin="primary" lay-filter="fjCountries">
                    </div>
                    <div class="layui-form">
                    {{#  layui.each(d['F-J'], function(index, item){ }}
                    <input type="checkbox" title="{{item.name}}({{item.abbr}})" name="{{item.abbr}}&auto" lay-skin="primary" 
                    lay-filter="conditionCountriesFilter">
                    {{#  }) }}
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-form">
                       <input type="checkbox" title="全选" lay-skin="primary"  lay-filter="koCountries">
                    </div>
                    <div class="layui-form">
                    {{#  layui.each(d['K-O'], function(index, item){ }}
                    <input type="checkbox" title="{{item.name}}({{item.abbr}})" name="{{item.abbr}}&auto" lay-skin="primary" lay-filter="conditionCountriesFilter">
                    {{#  }) }}
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-form">
                       <input type="checkbox" title="全选" lay-skin="primary" lay-filter="ptCountries">
                    </div>
                    <div class="layui-form">
                    {{#  layui.each(d['P-T'], function(index, item){ }}
                    <input type="checkbox" title="{{item.name}}({{item.abbr}})" name="{{item.abbr}}&auto" lay-skin="primary" lay-filter="conditionCountriesFilter">
                    {{#  }) }}
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-form">
                       <input type="checkbox" title="全选" lay-skin="primary"  lay-filter="uzCountries">
                    </div>
                    <div class="layui-form">
                    {{#  layui.each(d['U-Z'], function(index, item){ }}
                    <input type="checkbox" title="{{item.name}}({{item.abbr}})" name="{{item.abbr}}&auto" lay-skin="primary" lay-filter="conditionCountriesFilter">
                    {{#  }) }}
                    </div>
                </div>
            </div>
            <div class="layui-tab-content allCountrySearchContainer disN">
               <div class="layui-form">
                  
               </div>
            </div>
        </div>
    </div>
    <div class="country_countainer_selected">
       <div class="country_countainer_selected_title">
            <h3>已选择国家或区域</h3>
       </div>
       <div class="country_countainer_selected_content layui-form">
       </div>
    </div>
</script>


<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script src="${ctx}/static/js/order/autoAuditRules.js"></script>