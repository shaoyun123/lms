<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>库存占用规则</title>
<style type="text/css">
    .inventoryrules_header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .inventoryrulesDetailDefault{
        text-align:left;
    }
    .inventoryrulesDetailHidden{
        overflow:hidden;
        max-height:135px;
    }
    .inventoryrulesDetailShow{
        overflow:inherit;
        max-height:10000px;
    }
    .inventoryrules_expand {
        display: flex;
        justify-content: flex-end;
        padding-right: 10px;
        box-sizing: border-box;
    }
    .newAddInventoryrulesForm {
        padding: 10px 52px 20px 0;
    }
    .newAddInventoryrulesCondition{
        display: flex;
        padding: 10px 52px 20px 45px;
    }
    .newAddInventoryrulesCondition .newAddInventoryrulesCondition_left {
        width: 800px;
        min-height: 420px;
        overflow-y:auto;
        border: 1px solid #ccc;
        border-radius: 4px 4px 0 0;
    }
    .newAddInventoryrulesCondition .newAddInventoryrulesCondition_right {
        width: 200px;
        min-height: 420px;
        margin-left: 20px;
        border: 1px solid #ccc;
        border-radius: 4px 4px 0 0;
    }
    .newAddInventoryrulesCondition_left .newAddInventoryrulesCondition_left_title,
    .newAddInventoryrulesCondition_right .newAddInventoryrulesCondition_right_title{
            height: 28px;
            line-height: 28px;
            background: #eee;
            border-bottom: 1px solid #ccc;
            padding-left: 20px;
    }
    .newAddInventoryrulesCondition_right .newAddInventoryrulesCondition_right_body {
        padding: 20px 0 0 20px;
    }
    #inventoryrulesLeftChooseCondition,
    #inventoryrulesLeftChooseCondition li {
        padding: 5px;
    }
    .inventoryrules_center {
        padding: 20px;
    }
    /* 平台checkbox */
    #inventoryrules_platformEditContainer .layui-form-checkbox {
        width: 150px;
        padding:5px;
    }
    #inventoryrules_logisticsTypeEditContainer .layui-form-checkbox {
        width: 300px;
        padding:5px;
    }
    #inventoryrules_platformEditContainer .layui-form-checkbox span,
    #inventoryrules_logisticsTypeEditContainer .layui-form-checkbox span {
        position: absolute;
        left: 15px;
    }
    /* 国家的样式 */
    #inventoryrules_countryEditContainer .country_countainer_content .layui-form-checkbox,
    #inventoryrules_countryEditContainer .country_countainer_selected .country_countainer_selected_content .layui-form-checkbox{
    width: 200px;
    padding: 5px;
    }
    #inventoryrules_countryEditContainer .country_countainer_content .layui-form-checkbox span,
    #inventoryrules_countryEditContainer .country_countainer_selected .country_countainer_selected_content .layui-form-checkbox span {
    position: absolute;
    left: 15px;
    }
    #inventoryrules_countryEditContainer .country_countainer_selected {
        border: 1px solid #d6e9c6;
        border-radius: 2px;
    }
    #inventoryrules_countryEditContainer .country_countainer_selected .country_countainer_selected_title{
    height:40px;
    line-height: 40px;
    background-color:#dff0d8;
    padding-left: 20px;
    position: relative;
    }
    #inventoryrules_countryEditContainer .country_countainer_selected .country_countainer_selected_title h3{
    color: #468847;
    }
    #inventoryrules_countryEditContainer .country_countainer_selected .country_countainer_selected_content {
        padding: 5px 20px;
    }
</style>
<div class="layui-fluid" id="inventoryrules_content">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                     <form class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">规则状态</label>
                                <div class="layui-input-block">
                                    <select lay-search name="status" lay-search>
                                        <option value="true">启用</option>
                                        <option value="false">停用</option>
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">规则名称</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="ruleName">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="remark">
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1" style="padding-left:5px;">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="inventoryrules_submit">查询</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <%-- 操作 --%>
            <div class="layui-card">
                <div class="layui-card-header inventoryrules_header">
                    <span>说明: 1.缺货|待派单订单里未占用库存的订单;  2.最近45天的订单</span>
                    <a class="layui-btn layui-btn-sm layui-btn-normal" id="inventoryrules_newAdd">新增</a>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="inventoryrules_table" lay-filter="inventoryrules_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<%-- 优先级 --%>
<script type="text/html" id="inventoryrules_priority">
    <div>
       <input type="text" class="layui-input" value="{{d.priority}}" onkeydown="modifyInventoryrulesPriority(event, this)" data-id="{{d.id}}" ztt-verify="priority">
    </div>
</script>
<%-- 表格操作弹框 --%>
<script type="text/html" id="inventoryrules_tableIdBar">
    <div><a class="layui-btn layui-btn-xs" lay-event="edit">修改</a></div>
    <div><a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="copy">复制</a></div>
    {{# if(!d.status){  }}
        <div><a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="enable">启用</a></div>
    {{# }else{ }}
        <div><a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="disable">停用</a></div>
    {{# } }}
    <div><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a></div>
</script>
<%-- 表格详情渲染 --%>
<script type="text/html" id="inventoryrules_ruleDetail">
    <div class="inventoryrulesDetailHidden inventoryrulesDetailDefault">
        <div class="inventoryrulesDetailDiv">
            <%-- 国家 --%>
            {{# if(d.detail.country){  }}
                {{# if(d.detail.country.shippingCountryName.length){  }}
                <div>
                    {{# if(d.detail.country.exclude){ }}
                    <strong>排除以下国家/地区:</strong>
                    {{# }else{  }}
                    <strong>包含以下国家/地区:</strong>
                    {{# } }}
                    {{# layui.each(d.detail.country.shippingCountryName, function(index, item){ }}
                    <span>{{item}};</span>
                    {{# }) }}
                </div>
                {{# } }}
            {{# } }}
            <%-- 金额 --%>
            {{# if(d.detail.money){  }}
                {{# if(d.detail.money.moneyRegionList.length){  }}
                <div>
                    <strong>金额包含:</strong>
                    <span>金额类型为[</span>
                        {{# if(d.detail.money.moneyType == 1){ }}
                            <span>订单总额</span>
                        {{# }else if(d.detail.money.moneyType == 2){ }}
                            <span>商品总额</span>
                        {{# }else if(d.detail.money.moneyType == 3){ }}
                            <span>单品总额+单品运费</span>
                        {{# } }}
                        ]
                    <span>币种为[</span>
                        {{# if(d.detail.money.currency == 1){ }}
                            <span>人民币</span>
                        {{# }else if(d.detail.money.currency == 2){  }}
                            <span>订单原币种</span>
                        {{# } }}
                        ]
                    <span>范围为[</span>
                        {{# layui.each(d.detail.money.moneyRegionList, function(index, item){ }}
                            <span>{{item.minimumMoney}}到{{item.maximumMoney}};</span>
                        {{# }) }}
                        ]
                </div>
                {{# } }}
            {{# } }}
            <%-- 物流 --%>
            {{# if(d.detail.logisticsType){  }}
                {{# if(d.detail.logisticsType.ruleValueNameList.length){  }}
                <div>
                    <strong>物流包含:</strong>
                    {{# layui.each(d.detail.logisticsType.ruleValueNameList, function(index, item){ }}
                    <span>{{item}};</span>
                    {{# }) }}
                </div>
                {{# } }}
            {{# } }}
            <%-- 平台 --%>
            {{# if(d.detail.platform){  }}
                {{# if(d.detail.platform.platformCode.length){  }}
                <div>
                    <strong>平台包含:</strong>
                    {{# layui.each(d.detail.platform.platformCode, function(index, item){ }}
                    <span>{{item}};</span>
                    {{# }) }}
                </div>
                {{# } }}
            {{# } }}
            <%-- 店铺--%>
            {{# if(d.detail.store){  }}
                {{# if(d.detail.store.storeAcctName.length){  }}
                <div>
                    <strong>店铺包含:</strong>
                    {{# layui.each(d.detail.store.storeAcctName, function(index, item){ }}
                    <span>{{item}};</span>
                    {{# }) }}
                </div>
                {{# } }}
            {{# } }}
            <%-- 延迟天数 --%>
            {{# if(d.detail.orderDelayDays){  }}
                {{# if(d.detail.orderDelayDays.daysRegionList.length){  }}
                <div>
                    <strong>延迟天数包含:</strong>
                    {{# layui.each(d.detail.orderDelayDays.daysRegionList, function(index, item){ }}
                    <span>{{item.minimumDay}}至{{item.maximumDay}}天;</span>
                    {{# }) }}
                </div>
                {{# } }}
            {{# } }}
            <%-- 截止发货天数 --%>
            {{# if(d.detail.orderShipByDate){  }}
            {{# if(d.detail.orderShipByDate.timeRegionList.length){  }}
            <div>
                <strong>截止发货天数包含:</strong>
                {{# layui.each(d.detail.orderShipByDate.timeRegionList, function(index, item){ }}
                <span>{{item.minimumTime}}至{{item.maximumTime}}天;</span>
                {{# }) }}
            </div>
            {{# } }}
            {{# } }}
            
            {{# if(d.detail.appointTransport){ }}
            {{# if(d.detail.appointTransport.transportType.length){  }}
            <div>
              <strong>指定运输方式为:</strong>
              {{# layui.each(d.detail.appointTransport.transportType, function(index, item){ }}
              <span>{{item}};</span>
              {{# }) }}
            </div>
            {{# } }}
            {{# } }}
        </div>
    </div>
</script>

<%-- 新增/编辑/复制库存占用规则弹框容器 --%>
<script type="text/html" id="inventoryrules_newAddInventoryrules">
    <div id="newAddInventoryrulesContainer"></div>
</script>
<%-- 新增/编辑/复制库存占用规则弹框模板--%>
<script type="text/html" id="newAddInventoryrulesContainerTpl">
    <%-- 表单元素 --%>
    {{# if(d.id){ }}
     <input type="hidden" name="id" value="{{d.id}}"> 
    {{# } }}

    <input type="hidden" name="status" value="{{d.status}}"> 
    <div class="layui-form newAddInventoryrulesForm">
        <div style="display:flex;justify-content:flex-start;">
            <div class="layui-form-item">
                <label class="layui-form-label">规则名称</label>
                <div class="layui-input-block">
                <input type="text" name="ruleName" autocomplete="off" class="layui-input" value="{{d.ruleName}}">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备用仓库</label>
                <div class="layui-input-block">
                    <select name="alternativeWarehouseIds" xm-select="newAddInventoryrulesContainerTpl_warehouse" xm-select-search
                        xm-select-search-type="dl" xm-select-skin="normal">
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">优先级</label>
                <div class="layui-input-block">
                <input type="text" name="priority" autocomplete="off" class="layui-input" value="{{d.priority}}">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
               <input type="text" name="remark" autocomplete="off" class="layui-input" value="{{d.remark}}">
            </div>
        </div>
    </div>
    <%-- 条件选择 --%>
    <div class="newAddInventoryrulesCondition">
        <%-- 已选条件 --%>
        <div class="newAddInventoryrulesCondition_left">
            <div class="newAddInventoryrulesCondition_left_title">
                已选条件
            </div>
            <div class="newAddInventoryrulesCondition_left_body">
                <ul id="inventoryrulesLeftChooseCondition">
                <%-- 国家 --%>
                {{# if(d.detail.country){ }}
                    {{# if(d.detail.country.shippingCountryName.length){  }}
                    <li ztt-name="country">
                        <strong>国家/地区是:</strong>
                        <a href="javascript:;" class="ztt-a" ztt-key="country">
                            <span>
                               {{# if(d.detail.country.exclude){ }}
                                <strong>排除以下国家/地区:</strong>
                                {{# }else{  }}
                                <strong>包含以下国家/地区:</strong>
                                {{# } }}
                                {{# layui.each(d.detail.country.shippingCountryName, function(index, item){ }}
                                   {{item}};
                                {{# }) }}
                            </span>
                        </a>
                        <input type="hidden" name="ztt-country-code" value='{{JSON.stringify(d.detail.country)}}'>
                    </li>
                    {{# } }}
                {{# } }}
                <%-- 金额 --%>
                {{# if(d.detail.money){  }}
                   {{# if(d.detail.money.moneyRegionList.length){  }}
                    <li ztt-name="money">
                        <strong>金额是:</strong>
                        <a href="javascript:;" class="ztt-a" ztt-key="money">
                            <b>金额类型为:</b>
                                {{# if(d.detail.money.moneyType == 1){ }}
                                    <span>订单总额</span>
                                {{# }else if(d.detail.money.moneyType == 2){ }}
                                    <span>商品总额</span>
                                {{# }else if(d.detail.money.moneyType == 3){ }}
                                    <span>单品总额+单品运费</span>
                                {{# } }}
                            ;
                            <b>币种为:</b>
                                {{# if(d.detail.money.currency == 1){ }}
                                    <span>人民币</span>
                                {{# }else if(d.detail.money.currency == 2){  }}
                                    <span>订单原币种</span>
                                {{# } }}
                            ;
                            <b>范围为:</b>
                                {{# layui.each(d.detail.money.moneyRegionList, function(index, item){ }}
                                    <span>{{item.minimumMoney}}至{{item.maximumMoney}};</span>
                                {{# }) }}
                        </a>
                        <input type="hidden" name="ztt-money-code" value='{{JSON.stringify(d.detail.money)}}'>
                    </li>
                    {{# } }}
                {{# } }}
                <%-- 物流 --%>
                {{# if(d.detail.logisticsType){  }}
                   {{# if(d.detail.logisticsType.ruleValueNameList.length){  }}
                    <li ztt-name="logisticsType">
                        <strong>物流是:</strong>
                        <a href="javascript:;" class="ztt-a" ztt-key="logisticsType">
                            {{# layui.each(d.detail.logisticsType.ruleValueNameList, function(index, item){ }}
                                <span>{{item}};</span>
                            {{# }) }} 
                        </a>
                        <input type="hidden" name="ztt-logisticsType-code" value='{{JSON.stringify(d.detail.logisticsType)}}'>
                    </li>
                    {{# } }}
                {{# } }}
                <%-- 平台 --%>
                {{# if(d.detail.platform){  }}
                    {{# if(d.detail.platform.platformCode.length){  }}
                    <li ztt-name="platform">
                        <strong>平台是:</strong>
                        <a href="javascript:;" class="ztt-a" ztt-key="platform">
                            {{# layui.each(d.detail.platform.platformCode, function(index, item){ }}
                                <span>{{item}};</span>
                            {{# }) }}
                        </a>
                        <input type="hidden" name="ztt-platform-code" value='{{JSON.stringify(d.detail.platform)}}'>
                    </li>
                    {{# } }}
                {{# } }}
                <%-- 店铺 --%>
                {{# if(d.detail.store){  }}
                    {{# if(d.detail.store.storeAcctName.length){  }}
                    <li ztt-name="store">
                        <strong>店铺是:</strong>
                        <a href="javascript:;" class="ztt-a" ztt-key="store">
                            {{# layui.each(d.detail.store.storeAcctName, function(index, item){ }}
                            <span>{{item}};</span>
                            {{# }) }}
                        </a>
                        <input type="hidden" name="ztt-store-code" value='{{JSON.stringify(d.detail.store)}}'>
                    </li>
                    {{# } }}
                {{# } }}
                <%-- 延迟天数 --%>
                {{# if(d.detail.orderDelayDays){  }}
                    {{# if(d.detail.orderDelayDays.daysRegionList.length){  }}
                    <li ztt-name="orderDelayDays">
                        <strong>延迟天数是:</strong>
                        <a href="javascript:;" class="ztt-a" ztt-key="orderDelayDays">
                            {{# layui.each(d.detail.orderDelayDays.daysRegionList, function(index, item){ }}
                            <span>{{item.minimumDay}}至{{item.maximumDay}}天;</span>
                            {{# }) }}
                        </a>
                        <input type="hidden" name="ztt-orderDelayDays-code" value='{{JSON.stringify(d.detail.orderDelayDays)}}'>
                    </li>
                    {{# } }}
                {{# } }}
                <%-- 截止发货天数 --%>
                {{# if(d.detail.orderShipByDate){  }}
                {{# if(d.detail.orderShipByDate.timeRegionList.length){  }}
                <li ztt-name="orderShipByDate">
                    <strong>截止发货天数是:</strong>
                    <a href="javascript:;" class="ztt-a" ztt-key="orderShipByDate">
                        {{# layui.each(d.detail.orderShipByDate.timeRegionList, function(index, item){ }}
                        <span>{{item.minimumTime}}至{{item.maximumTime}}天;</span>
                        {{# }) }}
                    </a>
                    <input type="hidden" name="ztt-orderShipByDate-code" value='{{JSON.stringify(d.detail.orderShipByDate)}}'>
                </li>
                {{# } }}
                {{# } }}

                <%-- 指定运输方式 --%>
                {{# if(d.detail.appointTransport){  }}
                {{# if(d.detail.appointTransport.transportType.length){  }}
                <li ztt-name="appointTransport">
                    <strong>运输方式为:</strong>
                    <a href="javascript:;" class="ztt-a" ztt-key="appointTransport">
                        {{# layui.each(d.detail.appointTransport.transportType, function(index, item){ }}
                        <span>{{item}};</span>
                        {{# }) }}
                    </a>
                    <input type="hidden" name="ztt-appointTransport-code" value='{{JSON.stringify(d.detail.appointTransport)}}'>
                </li>
                {{# } }}
                {{# } }}
                </ul>
            </div>
        </div>
        <%-- 选择条件 --%>
        <div class="newAddInventoryrulesCondition_right">
            <div class="newAddInventoryrulesCondition_right_title">
                选择条件
            </div>
            <div class="newAddInventoryrulesCondition_right_body">
                {{#  layui.each(d.conditionArr, function(index, item){ }}
                    {{# if(d.detail[item.key]){ }}
                    <div class="layui-form">
                        <input type="checkbox" lay-filter="inventoryrulesCondition" lay-skin="primary" title="{{item.value}}" 
                        name="{{item.key}}" checked>
                    </div>
                    {{#  }else{ }}
                    <div class="layui-form">
                        <input type="checkbox" lay-filter="inventoryrulesCondition" lay-skin="primary" title="{{item.value}}" 
                        name="{{item.key}}">
                    </div>
                    {{# } }}
                <br />
               {{#  }) }}
            </div>
        </div>
    </div>
</script>


<%-- 国家 --%>
<script type="text/html" id="inventoryrules_countryEdit">
    <div id="inventoryrules_countryEditContainer" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="inventoryrules_countryEditContainerTpl">
    <div class="country_countainer_search">
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
            <div class="layui-form" style="position:absolute;top:0;right:0;">
                <input type="checkbox" title="排除以下国家/地区" lay-skin="primary" name="excludeCountry">
            </div>
       </div>
       <div class="country_countainer_selected_content layui-form">
       </div>
    </div>
</script>

<%-- 金额 --%>
<script type="text/html" id="inventoryrules_moneyEdit">
    <div id="inventoryrules_moneyEditContainer" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="inventoryrules_moneyEditContainerTpl">
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left:-50px;">
            <label class="layui-form-label">类型</label>
            <div class="layui-input-block" style="margin-right:108px;">
                <select name="moneyType" lay-search lay-filter="inventoryrules_moneyTypeFilter">
                <option value="">选择类型</option>
                {{#  layui.each(d.moneyTypeOptions, function(index, item){ }}
                   <option value="{{item.code}}">{{item.name}}</option>
                {{# }) }}
                </select>
            </div>
        </div>
        <div class="layui-form-item"  style="margin-left:-50px;">
            <label class="layui-form-label">币种</label>
            <div class="layui-input-block"  style="margin-right:108px;">
                <select name="currency" lay-search>
                <option value="">选择币种</option>
                {{#  layui.each(d.currencyOptions, function(index, item){ }}
                   <option value="{{item.code}}">{{item.name}}</option>
                {{# }) }}
                </select>
            </div>
        </div>
        <div class="layui-form-item" style="margin-left: -50px;">
            <label class="layui-form-label">金额</label>
            <div class="layui-input-inline" style="width: 135px;">
                <input type="text" class="layui-input" name="greatThanMoney">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 134px;">
                <input type="text" class="layui-input" name="lessThanMoney">
            </div>
            <div class="layui-input-inline" style="width: 68px;margin-left:10px;margin-top:1px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="in_moneyRulesTable_tbody_add">新增一行</span>
            </div>
        </div>
    </div>
    <div class="moneyRulesTable" style="margin: 0 18px;">
        <table class="layui-table">
            <thead>
                <th>大于等于</th>
                <th>小于</th>
                <th>操作</th>
            </thead>
            <tbody style="text-align: center;" id="in_moneyRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<%-- 物流 --%>
<script type="text/html" id="inventoryrules_logisticsTypeEdit">
  <div id="inventoryrules_logisticsTypeEditContainer" class="layui-form">
      <div id="inventoryrulesLogisticXTree" style="width:500px;padding: 10px 0 25px 5px;"></div>
  </div>
</script>
<%-- <script type="text/html" id="inventoryrules_logisticsTypeEditContainerTpl">
    {{#  layui.each(d.typeComboBoxes, function(index, item){ }}
       {{# if(d.initCks.map(Number).indexOf(item.id)>= 0){ }}
       <input type="checkbox" title="{{item.name}}" lay-skin="primary" value="{{item.id}}" checked>
       {{# }else{ }}
       <input type="checkbox" title="{{item.name}}" lay-skin="primary" value="{{item.id}}">
       {{# } }}
    {{# }) }}
</script> --%>

<%-- 平台 --%>
<script type="text/html" id="inventoryrules_platformEdit">
  <div id="inventoryrules_platformEditContainer" class="layui-form" style="padding:20px;"></div>
</script>
<script type="text/html" id="inventoryrules_platformEditContainerTpl">
    {{#  layui.each(d.platformOptions, function(index, item){ }}
       {{# if(d.initCks.indexOf(item)>= 0){ }}
       <input type="checkbox" title="{{item}}" lay-skin="primary" value="{{item}}" checked>
       {{# }else{ }}
       <input type="checkbox" title="{{item}}" lay-skin="primary" value="{{item}}">
       {{# } }}
    {{# }) }}
</script>

<%-- 店铺 --%>
<script type="text/html" id="inventoryrules_storeEdit">
  <div id="inventoryrules_storeEditContainer"  class="layui-form">
     <div id="inventoryrulesStoreXTree" style="width:500px;padding: 10px 0 25px 5px;"></div>
  </div>
</script>

<%-- 延迟天数 --%>
<script type="text/html" id="inventoryrules_orderDelayDaysEdit">
    <div id="inventoryrules_orderDelayDaysEditContainer" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="inventoryrules_orderDelayDaysEditContainerTpl">
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left: -50px;">
            <label class="layui-form-label">天数</label>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="greatThanDelayDays" ztt-verify="delayDays">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="lessThanDelayDays" ztt-verify="delayDays">
            </div>
            <div class="layui-input-inline" style="width: 68px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="in_delayDaysRulesTable_tbody_add">新增一行</span>
            </div>
        </div>
    </div>
    <div class="delayDaysRulesTable" style="margin: 0 18px;">
        <table class="layui-table">
            <thead>
                <th>大于等于</th>
                <th>小于</th>
                <th>操作</th>
            </thead>
            <tbody style="text-align: center;" id="in_delayDaysRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>
<%-- 截止发货天数 --%>
<script type="text/html" id="inventoryrules_orderShipByDateEdit">
    <div id="inventoryrules_orderShipByDateEditContainer" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="inventoryrules_orderShipByDateEditContainerTpl">
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left: -50px;">
            <label class="layui-form-label">天数</label>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="greatThanShipByDate" ztt-verify="shipByDate">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="lessThanShipByDate" ztt-verify="shipByDate">
            </div>
            <div class="layui-input-inline" style="width: 68px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="in_shipByDateRulesTable_tbody_add">新增一行</span>
            </div>
        </div>
    </div>
    <div class="shipByDateRulesTable" style="margin: 0 18px;">
        <table class="layui-table">
            <thead>
            <th>大于等于</th>
            <th>小于</th>
            <th>操作</th>
            </thead>
            <tbody style="text-align: center;" id="in_shipByDateRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<!-- 店铺运输方式弹框 -->
<script type="text/html" id="inventoryrules_transportLayer">
  <div id="inventoryrules_transport_container" style="padding:20px;">
  </div>
</script>
<script type="text/html" id="inventoryrules_transport_containerTpl">
  <div class="layui-form">
      <div class="layui-form-item" style="margin-left: -25px;">
          <label class="layui-form-label">运输方式</label>
          <div class="layui-input-inline" style="width: 277px;">
              <textarea rows="10" cols="34" name="greatThanTransport" placeholder="多个运输方式请分行输入" style="resize: none;border: 1px solid #ccc;padding: 8px;"></textarea>
          </div>
          <div class="layui-input-inline" style="width: 58px;">
              <span class="layui-btn layui-btn-sm layui-btn-normal" id="in_transportRulesTable_tbody_add">新增</span>
          </div>
      </div>
  </div>
  <div class="transportTable" style="margin: 0 18px;">
      <table class="layui-table">
          <thead>
              <th>店铺运输方式</th>
              <th>操作</th>
          </thead>
          <tbody style="text-align: center;" id="in_transportRulesTable_tbody">
          </tbody>
      </table>
  </div>
</script>


<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script src="${ctx}/static/js/order/inventoryrules.js"></script>
