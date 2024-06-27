<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>物流规则</title>
<style>
    .logisticsRules_createRules_bottomCondition {
        padding: 20px;
    }
    .logisticsRules_createRules_bottomCondition .bottomCondition_left{
    float: left;
    width: 800px;
    height: 600px;
    overflow-y:auto;
    border: 1px solid #ccc;
    border-radius: 4px 4px 0 0;
    }
    .logisticsRules_createRules_bottomCondition .bottomCondition_right{
        margin-left: 838px;
        border: 1px solid #ccc;
        border-radius: 4px 4px 0 0;
        width: 200px;
        height: 600px;
    }
    .logisticsRules_createRules_bottomCondition .bottomCondition_left .bottomCondition_left_title,
    .logisticsRules_createRules_bottomCondition .bottomCondition_right .bottomCondition_right_title {
        height: 28px;
        line-height: 28px;
        background: #eee;
        border-bottom: 1px solid #ccc;
        padding-left: 20px;
    }
    .logisticsRules_createRules_bottomCondition .bottomCondition_right .bottomCondition_right_body,
    .logisticsRules_createRules_bottomCondition .bottomCondition_right .bottomCondition_right_body{
        padding-left: 20px;
        padding-top:20px;
    }
    .logisticsRules_createRules_bottomCondition .bottomCondition_right .bottomCondition_right_body .layui-form {
      margin-bottom: 10px;
    }
    #rulesLeftChooseCondition {
        padding: 5px 20px;
    }
    #rulesLeftChooseCondition li {
        padding: 5px;
    }
    #logisticsRules_country_container .country_countainer_content .layui-form-checkbox,
    #logisticsRules_country_container .country_countainer_selected .country_countainer_selected_content .layui-form-checkbox{
    width: 200px;
    padding: 5px;
    }
    #logisticsRules_country_container .country_countainer_content .layui-form-checkbox span,
    #logisticsRules_country_container .country_countainer_selected .country_countainer_selected_content .layui-form-checkbox span {
    position: absolute;
    left: 15px;
    }
    #logisticsRules_country_container .country_countainer_selected {
        border: 1px solid #d6e9c6;
        border-radius: 2px;
    }
    #logisticsRules_country_container .country_countainer_selected .country_countainer_selected_title{
    height:40px;
    line-height: 40px;
    background-color:#dff0d8;
    padding-left: 20px;
    position: relative;
    }
    #logisticsRules_country_container .country_countainer_selected .country_countainer_selected_title h3{
    color: #468847;
    }
    #logisticsRules_country_container .country_countainer_selected .country_countainer_selected_content {
        padding: 5px 20px;
    }

    #logisticsRules_attr_container .layui-form-checkbox,
    #logisticsRules_platform_container .layui-form-checkbox {
        width: 150px;
        padding:5px;
    }
    #logisticsRules_attr_container .layui-form-checkbox span,
    #logisticsRules_platform_container .layui-form-checkbox span {
        position: absolute;
        left: 15px;
    }
    .detailRuleDefault{
        text-align:left;
    }
    .detailRuleHidden{
        overflow:hidden;
        max-height:135px;
    }
    .detailRuleShow{
        overflow:inherit;
        max-height:50000px;
    }
    .country_countainer_search {
        width: 270px;
        position: absolute;
        z-index: 999;
        top: 35px;
        right: 45px;
    }
    .logisticsRules_sizeItem {
        width: 230px;
        display: flex;
        line-height: 32px;
    }
    #logisticsRules_createRules_container .layui-form-select dl {
      right: 0 !important;
    }
</style>

<div class="layui-fluid" id="logisticsRules_content">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-row">
                        <div class="layui-col-lg12 layui-col-md12">
                            <form class="layui-form" id="logisticsRule_searchForm">
                                <div class="layui-form-item">
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">规则状态</label>
                                        <div class="layui-input-block">
                                            <select lay-search name="status" lay-filter="logisiticRules_status">
                                                <option value="true">已启用</option>
                                                <option value="false">已禁用</option>
                                                <option value="">全部</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">规则名称</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" autocomplete="off" name="ruleName">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">物流方式</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" autocomplete="off" name="typeName">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label labelSel">
                                          <select name="platformSearchType">
                                            <option value="1">平台(模糊)</option>
                                            <option selected value="2">平台(精确)</option>
                                          </select>
                                        </label>
                                        <div class="layui-input-block">
                                            <select name="platform" id="logsRules_platform" lay-search></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label labelSel">
                                          <select name="attributeSearchType">
                                            <option value="1">物流属性(模糊)</option>
                                            <option selected value="2">物流属性(精确)</option>
                                          </select>
                                        </label>
                                        <div class="layui-input-block">
                                            <select name="attribute" id="logsRules_attribute" lay-search></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label labelSel">
                                          <select name="transportSearchType">
                                            <option value="1">店铺运输方式(模糊)</option>
                                            <option selected value="2">店铺运输方式(精确)</option>
                                          </select>
                                        </label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" autocomplete="off" name="transport">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">优先级</label>
                                        <div class="layui-input-block" style="display:flex;">
                                            <input type="text" class="layui-input" autocomplete="off" name="minPriority" style="width:45%">
                                            <span style="padding:0 5px;"> - </span>
                                            <input type="text" class="layui-input" autocomplete="off" name="maxPriority" style="width:45%">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">仓库类型</label>
                                        <div class="layui-input-block">
                                            <select name="warehouseType" id="logsRules_warehouseType" lay-search lay-filter="logsRules_warehouseTypeFilter"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">仓库</label>
                                        <div class="layui-input-block">
                                            <select name="warehouseId" id="logsRules_warehouseId" lay-search>
                                                <option value="">请先选择仓库类型</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">备注</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" autocomplete="off" name="remark">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <div class="layui-input-block">
                                            <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="logisticsRules_submit">
                                            查询</span>
                                            <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header" style="display: flex;justify-content: space-between;">
                        <%-- <form class="layui-form" id="logisticsRules_modifyRule_Form">
                            <div class="layui-form-item">
                                <div class="layui-col-lg4 layui-col-md4" style="margin-top: 7px;">
                                    <label class="layui-form-label">仓库类型</label>
                                    <div class="layui-input-block">
                                        <select name="_warehouseType" id="_logsRules_warehouseType" lay-search
                                                lay-filter="_logsRules_warehouseTypeFilter"></select>
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4" style="margin-top: 7px;">
                                    <label class="layui-form-label">仓库</label>
                                    <div class="layui-input-block">
                                        <select name="_warehouseId" id="_logsRules_warehouseId" lay-search>
                                            <option value="">请先选择仓库类型</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="logisticsRules_modifyRule">修改规则</span>
                                </div>
                            </div>
                        </form> --%>
                    <div style="position:absolute;right:10px">
                      <span class="layui-btn layui-btn-sm layui-btn-normal" id="logisticsRules_batchImportSkuBtn">批量添加SKU</span>
                       <span class="layui-btn layui-btn-sm layui-btn-normal" id="logisticsRules_importZipCode">导入邮编</span>
                       <span class="layui-btn layui-btn-sm" id="logisticsRules_batchHandle">批量修改</span>
                       <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="logisticsRules_batchEnable">批量启用</span>
                       <span class="layui-btn layui-btn-sm layui-btn-warm" id="logisticsRules_batchDisable">批量禁用</span>
                       <span class="layui-btn layui-btn-sm layui-btn-danger" id="logisticsRules_createRule">创建规则</span>
                    </div>
                </div>
                <div class="layui-card-body">
                   <table class="layui-table" id="logisticsRules_table"  lay-filter="logisticsRulesFilter"></table>
                </div>
            </div>
        </div>

</script>

<%-- batchhandle --%>
<script type="text/html" id="logisticsRules_handleContent">
   <div class="p20">
   <form class="layui-form" id="logisticsRules_handleContent_form">
   </form>
   </div>
</script>
<script type="text/html" id="logisticsRules_handleContent_formTpl">
    <div class="layui-form-item">
        <label class="layui-form-label">指定物流方式</label>
        <div class="layui-input-block">
            <select name="logisticsTypeId" lay-search lay-verify="required">
                <option value="">请选择</option>
            {{# if(d.typeComboBoxes){  }}
                {{#  layui.each(d.typeComboBoxes, function(index, item){ }}
                    <option value="{{item.id}}">{{item.name}}</option>
                {{#  }) }}
            {{# } }}
            </select>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">仓库类型</label>
        <div class="layui-input-block">
            <select name="warehouseTypeCode" lay-search lay-filter="warehouseTypeFilter">
                <option value="">请选择</option>
                {{# if(d.warehouseTypeOptions){  }}
                {{#  layui.each(d.warehouseTypeOptions, function(index, item){ }}
                    <option value="{{item.code}}">{{item.name}}</option>
                {{#  }) }}
            {{# } }}
            </select>
        </div>
    </div>
   <div class="layui-form-item">
        <label class="layui-form-label">指定仓库</label>
        <div class="layui-input-block">
            <select name="warehouseId" lay-search  lay-verify="required">
                <option value="">请选择</option>
            {{# if(d.warehouseComboBoxes){  }}
                {{#  layui.each(d.warehouseComboBoxes, function(index, item){ }}
                    <option value="{{item.id}}">{{item.name}}</option>
                {{#  }) }}
            {{# } }}
            </select>
        </div>
   </div>
</script>
<%-- priority --%>
<script type="text/html" id="logisticsRules_priority">
    <div>
       <input type="text" class="layui-input" value="{{d.priority}}" onkeydown="modifyLogisticsRulePriority(event, this)" data-id="{{d.id}}" ztt-verify="priority">
    </div>
</script>
<%-- detail --%>
<script type="text/html" id="logisticsRules_detail">
    <div class="detailRuleHidden detailRuleDefault">
        <div class="detailRuleDiv">
        {{# if(d.detail){ }}
       {{# if(!commonJudgeIsEmpty(d.detail.money)){ }}
        <div>
          订单金额为: 
          <span>金额类型:</span>
          {{# if(d.detail.money.moneyType == 1){ }}
            <span>订单总额</span>
          {{# }else if(d.detail.money.moneyType == 2){ }}
            <span>商品总额</span>
          {{# }else if(d.detail.money.moneyType == 3){ }}
            <span>单品总额+单品运费</span>
          {{# } }}
          <span>币种:</span>
          {{# if(d.detail.money.currency == 1){ }}
            <span>人民币</span>
          {{# }else if(d.detail.money.currency == 2){  }}
            <span>订单原币种</span>
          {{# } }}
          <span>范围:</span>
           {{# layui.each(d.detail.money.moneyRegionList, function(index, item){ }}
            <span>{{item.minimumMoney}}到{{item.maximumMoney}};</span>
           {{# }) }}
        </div>
       {{# } }}


       {{# if(!commonJudgeIsEmpty(d.detail.store)){ }}
       <div> 
         指定店铺为:{{ d.detail.store.storeAcctName.join('、') }}
         <%-- {{# layui.each(d.detail.store.storeAcctName, function(index, item){ }}
              <span>{{ item.split('\(')[0] }};</span>
         {{# }) }} --%>
       </div>
       {{# } }}


       {{# if(!commonJudgeIsEmpty(d.detail.goodsSku)){ }}
        <div>
           商品sku为:
           {{# if(d.detail.goodsSku.exclude){ }}
           <span>排除以下sku:</span>
           {{# }else{  }}
           <span>包含以下sku:</span>
           {{# } }}
            {{# layui.each(d.detail.goodsSku.goodsSku, function(index, item){ }}
            <span>{{item}};</span>
           {{# }) }}
        </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.itemId)){ }}
        <div>
           item_id为:
           {{# if(d.detail.itemId.exclude){ }}
           <span>排除以下item_id:</span>
           {{# }else{  }}
           <span>包含以下item_id:</span>
           {{# } }}
            {{# layui.each(d.detail.itemId.itemIdList, function(index, item){ }}
            <span>{{item}};</span>
           {{# }) }}
        </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.platform)){ }}
       <div>
          指定平台为:
          {{# layui.each(d.detail.platform.platformCode, function(index, item){ }}
            <span>{{item}};</span>
          {{# }) }}
       </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.province)){ }}
       <div>
          指定州/省为:
          {{# layui.each(d.detail.province.ruleValueList, function(index, item){ }}
            <span>{{item}};</span>
          {{# }) }}
       </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.city)){ }}
       <div>
          指定城市为:
          {{# layui.each(d.detail.city.ruleValueList, function(index, item){ }}
            <span>{{item}};</span>
          {{# }) }}
       </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.logisticsAttribute)){ }}
       <div>
          物流属性为:
        {{# layui.each(d.detail.logisticsAttribute.logisticsAttribute, function(index, item){ }}
        <span>{{item}};</span>
        {{# }) }}
       </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.orderDelayDays)){ }}
       <div>
          订单延迟天数为:
        {{# layui.each(d.detail.orderDelayDays.daysRegionList, function(index, item){ }}
        <span>{{item.minimumDay}}至{{item.maximumDay}}天;</span>
        {{# }) }}
       </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.weight)){ }}
       <div>
          订单重量为:
        {{# layui.each(d.detail.weight.weightRegionList, function(index, item){ }}
        <span>{{item.minimumWeight}}至{{item.maximumWeight}}g;</span>
        {{# }) }}
       </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.liquidVolume)){ }}
       <div>
          液体体积为:
        {{# layui.each(d.detail.liquidVolume.orderRuleSimpleCompareDtoList, function(index, item){ }}
        <span>{{item.minNumber}}至{{item.maxNumber}};</span>
        {{# }) }}
       </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.zipCode)){ }}
       <div>
          订单邮编(区间)为:
        {{# layui.each(d.detail.zipCode.zipCodeRegionDtoList, function(index, item){ }}
        <span>{{item.zipCodeBegin}}至{{item.zipCodeEnd}};</span>
        {{# }) }}
       </div>
       {{# } }}

      {{# if(!commonJudgeIsEmpty(d.detail.zipCodeNumber)){ }}
      <div>
          订单邮编(固定值)为:
          {{# layui.each(d.detail.zipCodeNumber.zipCodeNumberStrList, function(index, item){ }}
          <span>{{item}};</span>
          {{# }) }}
      </div>
      {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.country)){ }}
       <div>
        订单国家/地区为:
        {{# if(d.detail.country.exclude){ }}
        <span>排除以下国家:</span>
        {{# }else{  }}
        <span>包含以下国家:</span>
        {{# } }}
        {{# layui.each(d.detail.country.shippingCountryName, function(index, item){ }}
        <span>{{item}};</span>
        {{# }) }}
       </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.detail.appointTransport)){ }}
       <div>
        指定运输方式为:
        {{# layui.each(d.detail.appointTransport.transportType, function(index, item){ }}
        <span>{{item}};</span>
        {{# }) }}
       </div>
       {{# } }}

        {{# if(!commonJudgeIsEmpty(d.detail.buyerPayFreight)){ }}
        <div>
            买家付运费为:
            <span>币种:</span>
            {{# if(d.detail.buyerPayFreight.currency == 1){ }}
            <span>人民币</span>
            {{# }else if(d.detail.buyerPayFreight.currency == 2){  }}
            <span>订单原币种</span>
            {{# } }}
            <span>范围:</span>
            {{# layui.each(d.detail.buyerPayFreight.buyerPayFreightRegion, function(index, item){ }}
            <span>{{item.minimumCharge}}到{{item.maximumCharge}};</span>
            {{# }) }}
        </div>
       {{# } }}

        {{# if(!commonJudgeIsEmpty(d.detail.goodsNumber)){ }}
        <div>
            商品数量为:
            {{d.detail.goodsNumber.minNumber}} 至 {{d.detail.goodsNumber.maxNumber}}
        </div>
        {{# } }}

        {{# if(!commonJudgeIsEmpty(d.detail.goodsSkuNumber)){ }}
        <div>
            SKU数量为:
            {{d.detail.goodsSkuNumber.minNumber}} 至 {{d.detail.goodsSkuNumber.maxNumber}}
        </div>
        {{# } }}

        {{# if(!commonJudgeIsEmpty(d.detail.goodsSize)){ }}
        <div>
            商品尺寸为:
            {{# layui.each(d.detail.goodsSize.sizeRegionDtoList, function(index, item){ }}
                {{# if(item.compareType == 1){ }}
                长{{d.CompareSymbolObj[item.compareSymbol]}}{{item.length}}cm,宽{{d.CompareSymbolObj[item.compareSymbol]}}{{item.width}}cm,高{{d.CompareSymbolObj[item.compareSymbol]}}{{item.height}}cm;
                {{# } }}
                {{# if(item.compareType == 2){ }}
                长宽高之和{{d.CompareSymbolObj[item.compareSymbol]}}{{item.sum}}cm;
                {{# } }}
                {{# if(item.compareType == 3){ }}
                万邑通长{{d.CompareSymbolObj[item.compareSymbol]}}{{item.length}}cm,万邑通宽{{d.CompareSymbolObj[item.compareSymbol]}}{{item.width}}cm,万邑通高{{d.CompareSymbolObj[item.compareSymbol]}}{{item.height}}cm;
                {{# } }}
            {{# }) }}
        </div>
        {{# } }}

    {{# } }}
        </div>
        
    </div>
</script>
<%-- handle --%>
<script type="text/html" id="logisticsRules_tableIdBar">
    <div>
        <span class="layui-btn layui-btn-xs" lay-event="edit">修改</span><br>
        <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="copy">复制</span><br>
        {{# if(!d.status){  }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="enable">启用</span><br>
        {{# }else{ }}
        <span class="layui-btn layui-btn-xs layui-btn-warm" lay-event="disable">停用</span><br>
        {{# } }}
        <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</span>
    </div>
</script>

<%-- addRules --%>
<script type="text/html" id="logisticsRules_createRulesLayer">
    <div id="logisticsRules_createRules_container"></div>
</script>
<script type="text/html" id="logisticsRules_createRules_containerTpl">
    <div class="logisticsRules_createRules_topForm p20">
       {{# if(d.id){  }}
       <input type="hidden" value="{{d.id}}" name="id">
       {{# } }}
       <div class="layui-form layui-row">
          <div class="layui-form-item">
             <div class="layui-col-md4">
                <label class="layui-form-label">规则名称</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="ruleName" value="{{d.ruleName}}" lay-verify="required">
                </div>
             </div>
             <div class="layui-col-md4">
                <label class="layui-form-label">优先级</label>
                <div class="layui-input-block">
                    <input type="number" class="layui-input" name="priority" value="{{d.priority}}" lay-verify="required" min="0">
                </div>
             </div>
             <div class="layui-col-md4">
                <label class="layui-form-label">指定物流方式</label>
                <div class="layui-input-block">
                    <select name="logisticsTypeId" lay-search lay-verify="required">
                       <option value="">请选择</option>
                    {{# if(d.typeComboBoxes){  }}
                    {{#  layui.each(d.typeComboBoxes, function(index, item){ }}
                       {{# if(d.logisticsTypeId == item.id){ }}
                       <option value="{{item.id}}" selected>{{item.name}}</option>
                       {{# }else{ }}
                       <option value="{{item.id}}">{{item.name}}</option>
                       {{# } }}
                    {{#  }) }}
                    {{# } }}
                    </select>
                </div>
             </div>
             <div class="layui-col-md4">
                <label class="layui-form-label">仓库类型</label>
                <div class="layui-input-block">
                    <select name="warehouseType" lay-search  lay-verify="required" lay-filter="warehouseTypeFilter">
                       <option value="">请选择</option>
                        {{# if(d.warehouseTypeOptions){  }}
                        {{#  layui.each(d.warehouseTypeOptions, function(index, item){ }}
                            {{# if(d.warehouseType == item.code){  }}
                            <option value="{{item.code}}" selected>{{item.name}}</option>
                            {{# }else{ }}
                            <option value="{{item.code}}">{{item.name}}</option>
                            {{# } }}
                        {{#  }) }}
                        {{# } }}
                    </select>
                </div>
             </div>
             <div class="layui-col-md4">
                <label class="layui-form-label">指定仓库</label>
                <div class="layui-input-block">
                    <select name="warehouseId" lay-search  lay-verify="required">
                       <option value="">请先选择仓库类型</option>
                    {{# if(d.warehouseComboBoxes){  }}
                    {{#  layui.each(d.warehouseComboBoxes, function(index, item){ }}
                        {{# if(d.warehouseType == item.warehouseType){ }}
                            {{# if(d.warehouseId == item.id){  }}
                            <option value="{{item.id}}" selected>{{item.name}}</option>
                            {{# }else{ }}
                            <option value="{{item.id}}">{{item.name}}</option>
                            {{# } }}
                       {{# } }}
                    {{#  }) }}
                    {{# } }}
                    </select>
                </div>
             </div>
             <div class="layui-col-md12">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" value="{{d.remark}}" name="remark">
                </div>
             </div>
          </div>
       </div>
    </div>
    <div class="logisticsRules_createRules_bottomCondition">
        <div class="bottomCondition_left">
          <div class="bottomCondition_left_title">已选条件</div>
          <div class="bottomCondition_left_body">
            <ul id="rulesLeftChooseCondition"></ul>
          </div>
        </div>
        <div class="bottomCondition_right">
          <div class="bottomCondition_right_title">选择条件</div>
          <div class="bottomCondition_right_body">
            {{# if(d.ruleConditionArr){  }}
            {{#  layui.each(d.ruleConditionArr, function(index, item){ }}
                <div class="layui-form">
                    <input type="checkbox" lay-filter="{{item.key}}" lay-skin="primary" title="{{item.name}}" data-desc="{{item.desc}}" name="{{item.val}}">
                </div>
            {{#  }) }}
            {{# } }}
          </div>
        </div>
    </div>
</script>

<%-- 商品数量goodsNumber --%>
<script type="text/html" id="logisticsRules_goodsNumberLayer">
    <div class="layui-form">
        <div class="layui-form-item" style="margin:30px 0 0 -30px;">
            <label class="layui-form-label">商品数量</label>
            <div class="layui-input-inline" style="width: 180px;">
                <input type="number" class="layui-input" name="minNumber" min="0">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 180px;">
                <input type="number" class="layui-input" name="maxNumber" min="0">
            </div>
        </div>
    </div>
</script>
<%-- sku数量goodsSkuNumber --%>
<script type="text/html" id="logisticsRules_goodsSkuNumberLayer">
    <div class="layui-form">
        <div class="layui-form-item" style="margin:30px 0 0 -30px;">
            <label class="layui-form-label">SKU数量</label>
            <div class="layui-input-inline" style="width: 180px;">
                <input type="number" class="layui-input" name="minNumber" min="0">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 180px;">
                <input type="number" class="layui-input" name="maxNumber" min="0">
            </div>
        </div>
    </div>
</script>
<%-- 商品尺寸goodsSize --%>
<script type="text/html" id="logisticsRules_goodsSizeLayer">
    <div class="layui-form" lay-filter="logisticsRules_goodsSizeFilter" style="padding:20px;">
        <div style="display:flex;">
            <div class="layui-form-item" style="margin-right:20px;width:100px;">
                <input type="checkbox" lay-skin="primary" id="logisticsRules_goodsSize_single" title="直邮" lay-filter="logisticsRules_goodsSize_filter">
            </div>
            <div class="layui-form-item logisticsRules_sizeItem">
                长
                <div class="w50 ml10">
                    <select name="compareSymbolSingle" lay-filter="logisticsRules_goodsSize_compareSymbol_single">
                        <option value="1" selected>＜</option>
                        <option value="4">&ge;</option>
                    </select>
                </div>
                <input type="number" class="layui-input" style="width: 100px;margin: 0 10px;" name="length" value="0" min="0">
                cm,
            </div>
            <div class="layui-form-item logisticsRules_sizeItem">
                宽
                <div class="w50 ml10">
                    <select name="compareSymbolSingle" lay-filter="logisticsRules_goodsSize_compareSymbol_single">
                        <option value="1" selected>&lt;</option>
                        <option value="4">&ge;</option>
                    </select>
                </div>
                <input type="number" class="layui-input" style="width: 100px;margin: 0 10px;" name="width" value="0" min="0">
                cm,
            </div>
            <div class="layui-form-item logisticsRules_sizeItem">
                高
                <div class="w50 ml10">
                    <select name="compareSymbolSingle" lay-filter="logisticsRules_goodsSize_compareSymbol_single">
                        <option value="1" selected>&lt;</option>
                        <option value="4">&ge;</option>
                    </select>
                </div>
                <input type="number" class="layui-input" style="width: 100px;margin: 0 10px;" name="height" value="0" min="0">
                cm
            </div>
        </div>
        <div style="display:flex;margin-top:15px;">
            <div class="layui-form-item" style="width:100px;">
                <input type="checkbox" lay-skin="primary" id="logisticsRules_goodsSize_all" title="直邮" lay-filter="logisticsRules_goodsSize_filter">
            </div>
            <div class="layui-form-item logisticsRules_sizeItem" style="width:350px">
                (长+宽+高)
                <div class="w50 ml10">
                    <select name="compareSymbolAll">
                        <option value="1" selected>&lt;</option>
                        <option value="4">&ge;</option>
                    </select>
                </div>
                <input type="number" class="layui-input" style="width: 100px;margin: 0 10px;" name="sum" value="0" min="0">
                cm
            </div>
        </div>
        <div style="display:flex;margin-top:15px;">
            <div class="layui-form-item" style="margin-right:20px;width:100px;">
                <input type="checkbox" lay-skin="primary" id="logisticsRules_goodsSize_wytsize" title="万邑通" lay-filter="logisticsRules_goodsSize_wytFilter">
            </div>
            <div class="layui-form-item logisticsRules_sizeItem">
                长<
                <input type="number" class="layui-input" style="width: 100px;margin: 0 10px;" name="wytLength" value="0" min="0">
                cm,
            </div>
            <div class="layui-form-item logisticsRules_sizeItem">
                宽<
                <input type="number" class="layui-input" style="width: 100px;margin: 0 10px;" name="wytWidth" value="0" min="0">
                cm,
            </div>
            <div class="layui-form-item logisticsRules_sizeItem">
                高<
                <input type="number" class="layui-input" style="width: 100px;margin: 0 10px;" name="wytHeight" value="0" min="0">
                cm
            </div>
        </div>
    </div>
    <div style="margin: 20px 0 0 20px;">
        <div><strong><font size="4" color="red">注意</font></strong></div>
        <div class="mt05"><strong><font size="4" color="red">1. 直邮和万邑通尺寸只能二选一,不能同时选择!</font></strong></div>
        <div class="mt05"><strong><font size="4" color="red">2. 长宽高是且的关系，同时满足才生效</font></strong></div>
    </div>
</script>

<%-- country --%>
<script type="text/html" id="logisticsRules_countryLayer">
    <div id="logisticsRules_country_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_country_containerTpl">
    <div class="country_countainer_search disflex">
       <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-normal mr10" id="logisticsRules_country_checkSelect_btn">一键选择</a >
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
                <input type="checkbox" title="排除以下国家" lay-skin="primary" name="excludeCountry">
            </div>
       </div>
       <div class="country_countainer_selected_content layui-form">
       </div>
    </div>
</script>

<%-- money --%>
<script type="text/html" id="logisticsRules_moneyLayer">
    <div id="logisticsRules_money_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_money_containerTpl">
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left:-50px;">
            <label class="layui-form-label">类型</label>
            <div class="layui-input-block" style="margin-right:108px;">
                <select name="moneyType" lay-search>
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
                <input type="number" class="layui-input" name="greatThanMoney" 
                class="layui-input">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 134px;">
                <input type="number" class="layui-input" name="lessThanMoney" 
                class="layui-input">
            </div>
            <div class="layui-input-inline" style="width: 58px;margin-left:10px;margin-top:1px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="moneyRulesTable_tbody_add">新增一行</span>
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
            <tbody style="text-align: center;" id="moneyRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<%-- weight --%>
<script type="text/html" id="logisticsRules_weightLayer">
    <div id="logisticsRules_weight_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_weight_containerTpl">
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left: -50px;">
            <label class="layui-form-label">重量</label>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="greatThanWeight">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="lessThanWeight">
            </div>
            <div class="layui-input-inline" style="width: 58px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="weightRulesTable_tbody_add">新增一行</span>
            </div>
        </div>
    </div>
    <div class="weightRulesTable" style="margin: 0 18px;">
        <table class="layui-table">
            <thead>
                <th>大于等于(g)</th>
                <th>小于(g)</th>
                <th>操作</th>
            </thead>
            <tbody style="text-align: center;" id="weightRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<%-- 邮编 --%>
<%-- weight --%>
<script type="text/html" id="logisticsRules_zipCodeLayer">
    <div id="logisticsRules_zipCode_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_zipCode_containerTpl">
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left: -50px;">
            <label class="layui-form-label">邮编</label>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="greatThanzipCode">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="lessThanzipCode">
            </div>
            <div class="layui-input-inline" style="width: 58px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="zipCodeRulesTable_tbody_add">新增一行</span>
            </div>
        </div>
    </div>
    <div class="weightRulesTable" style="margin: 0 18px;">
        <table class="layui-table">
            <thead>
                <th>起始邮编(包含)</th>
                <th>结束邮编(不包含)</th>
                <th>操作</th>
            </thead>
            <tbody style="text-align: center;" id="zipCodeRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<%-- transport --%>
<script type="text/html" id="logisticsRules_transportLayer">
    <div id="logisticsRules_transport_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_transport_containerTpl">
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left: -25px;">
            <label class="layui-form-label">运输方式</label>
            <div class="layui-input-inline" style="width: 277px;">
                <textarea rows="10" cols="34" name="greatThanTransport" placeholder="多个运输方式请分行输入" style="resize: none;border: 1px solid #ccc;padding: 8px;"></textarea>
                <!-- <input type="text" class="layui-input" name="greatThanTransport" placeholder="多个运输方式使用英文逗号分隔"> -->
            </div>
            <div class="layui-input-inline" style="width: 58px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="transportRulesTable_tbody_add">新增</span>
            </div>
        </div>
    </div>
    <div class="transportTable" style="margin: 0 18px;">
        <table class="layui-table">
            <thead>
                <th>店铺运输方式</th>
                <th>操作</th>
            </thead>
            <tbody style="text-align: center;" id="transportRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<%-- province --%>
<script type="text/html" id="logisticsRules_provinceLayer">
    <div id="logisticsRules_province_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_province_containerTpl">
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left: -25px;">
            <label class="layui-form-label">州/省</label>
            <div class="layui-input-inline" style="width: 277px;">
                <textarea rows="10" cols="34" name="greatThanProvince" placeholder="多个州/省请分行输入" style="resize: none;border: 1px solid #ccc;padding: 8px;"></textarea>
            </div>
            <div class="layui-input-inline" style="width: 58px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="provinceRulesTable_tbody_add">新增</span>
            </div>
        </div>
    </div>
    <div class="provinceTable" style="margin: 0 18px;">
        <table class="layui-table">
            <thead>
            <th>州/省</th>
            <th>操作</th>
            </thead>
            <tbody style="text-align: center;" id="provinceRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<%-- city --%>
<script type="text/html" id="logisticsRules_cityLayer">
  <div id="logisticsRules_city_container" style="padding:20px;">
  </div>
</script>
<script type="text/html" id="logisticsRules_city_containerTpl">
  <div class="layui-form">
      <div class="layui-form-item" style="margin-left: -25px;">
          <label class="layui-form-label">城市</label>
          <div class="layui-input-inline" style="width: 277px;">
              <textarea rows="10" cols="34" name="greatThanCity" placeholder="多个城市请分行输入" style="resize: none;border: 1px solid #ccc;padding: 8px;"></textarea>
          </div>
          <div class="layui-input-inline" style="width: 58px;">
              <span class="layui-btn layui-btn-sm layui-btn-normal" id="cityRulesTable_tbody_add">新增</span>
          </div>
      </div>
  </div>
  <div class="cityTable" style="margin: 0 18px;">
      <table class="layui-table">
          <thead>
          <th>城市</th>
          <th>操作</th>
          </thead>
          <tbody style="text-align: center;" id="cityRulesTable_tbody">
          </tbody>
      </table>
  </div>
</script>

<%-- buyer --%>
<script type="text/html" id="logisticsRules_buyerLayer">
    <div id="logisticsRules_buyer_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_buyer_containerTpl">
    <div class="layui-form">
        <div class="layui-form-item"  style="margin-left:-62px;">
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
        <div class="layui-form-item" style="margin-left: -62px;">
            <label class="layui-form-label">金额</label>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="greatThanBuyer">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="lessThanBuyer">
            </div>
            <div class="layui-input-inline" style="width: 58px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="buyerRulesTable_tbody_add">新增一行</span>
            </div>
        </div>
    </div>
    <div class="buyerRulesTable" style="margin: 0 30px 0 8px;">
        <table class="layui-table">
            <thead>
                <th>大于等于</th>
                <th>小于</th>
                <th>操作</th>
            </thead>
            <tbody style="text-align: center;" id="buyerRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<%-- delayDays --%>
<script type="text/html" id="logisticsRules_delayDaysLayer">
    <div id="logisticsRules_delayDays_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_delayDays_containerTpl">
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
            <div class="layui-input-inline" style="width: 58px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="delayDaysRulesTable_tbody_add">新增一行</span>
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
            <tbody style="text-align: center;" id="delayDaysRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<%-- 液体体积 --%>
<script type="text/html" id="logisticsRules_liquidVolumeLayer">
    <div id="logisticsRules_liquidVolume_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_liquidVolume_containerTpl">
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left: -50px;">
            <label class="layui-form-label">液体体积</label>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="greatThanLiquidVolume" ztt-verify="liquidVolume">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="lessThanLiquidVolume" ztt-verify="liquidVolume">
            </div>
            <div class="layui-input-inline" style="width: 58px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="liquidVolumeRulesTable_tbody_add">新增一行</span>
            </div>
        </div>
    </div>
    <div class="liquidVolumeRulesTable" style="margin: 0 18px;">
        <table class="layui-table">
            <thead>
                <th>大于等于</th>
                <th>小于</th>
                <th>操作</th>
            </thead>
            <tbody style="text-align: center;" id="liquidVolumeRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<%-- attr --%>
<script type="text/html" id="logisticsRules_attrLayer">
    <div id="logisticsRules_attr_container" class="layui-form" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_attr_containerTpl">
    {{#  layui.each(d.attributeOptions, function(index, item){ }}
       <input type="checkbox" title="{{item.name}}" lay-skin="primary" value="{{item.colorAlias}}">
    {{# }) }}
</script>

<%-- platform --%>
<script type="text/html" id="logisticsRules_platformLayer">
    <div id="logisticsRules_platform_container" class="layui-form" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_platform_containerTpl">
    {{#  layui.each(d.platformOptions, function(index, item){ }}
       <input type="checkbox" title="{{item}}" lay-skin="primary" value="{{item}}">
    {{# }) }}
</script>
<%-- goodsSku --%>
<script type="text/html" id="logisticsRules_zipCodeNumberLayer">
    <textarea placeholder="邮编固定值以半角逗号隔开" class="layui-textarea" name="zipCodeNumberTextarea" style="">
    </textarea>
</script>
<%-- goodsSku --%>
<script type="text/html" id="logisticsRules_goodsSkuLayer">
    <div id="logisticsRules_goodsSku_container" class="layui-form" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_goodsSku_containerTpl">
    <div class="layui-form-item" style="display:flex;justify-content:space-between;">
        <div>
            <input type="radio" name="goodsSkuRadio"  title="包含以下SKU" value="false" checked>
            <input type="radio" name="goodsSkuRadio"  title="排除以下SKU" value="true">
        </div>
        <div style="display:flex;margin-right: -430px;">
            <input type="text" class="layui-input" name="logisticsRules_goodsSku_input">
            <span class="layui-btn layui-btn-sm logisticsRules_goodsSku_search" style="margin-left:5px;">
                <i class="layui-icon">&#xe615;</i>
            </span>
            <span class="layui-btn layui-btn-sm layui-btn-danger logisticsRules_goodsSku_delete">
                <i class="layui-icon">&#xe640;</i>
            </span>
        </div>
    </div>
    <div class="layui-form-item layui-form-text" style="margin-left:-111px;">
        <div class="layui-input-block">
            <textarea 
                placeholder="SKU以半角逗号隔开" 
                class="layui-textarea" 
                name="goodsSkuTextarea"
                style="height:610px;">
            </textarea>
        </div>
    </div>
</script>

<%-- itemId --%>
<script type="text/html" id="logisticsRules_itemIdLayer">
    <div id="logisticsRules_itemId_container" class="layui-form" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_itemId_containerTpl">
    <div class="layui-form-item" style="margin-left:-111px;display:flex;justify-content:flex-end;">
        <div class="layui-input-block">
            <input type="radio" name="itemIdRadio"  title="包含以下item_id" value="false" checked>
            <input type="radio" name="itemIdRadio"  title="排除以下item_id" value="true">
        </div>
        <div style="display:flex;">
            <input type="text" class="layui-input" name="logisticsRules_itemId_input">
            <span class="layui-btn layui-btn-sm logisticsRules_itemId_search" style="margin-left:5px;">
                <i class="layui-icon">&#xe615;</i>
            </span>
            <span class="layui-btn layui-btn-sm layui-btn-danger logisticsRules_itemId_delete">
                <i class="layui-icon">&#xe640;</i>
            </span>
        </div>
    </div>
    <div class="layui-form-item layui-form-text" style="margin-left:-111px;">
        <div class="layui-input-block">
            <textarea 
                placeholder="item_id以半角逗号隔开" 
                class="layui-textarea" 
                name="itemIdTextarea"
                style="height:610px;">
            </textarea>
        </div>
    </div>
</script>

<%-- store --%>
<script type="text/html" id="logisticsRules_storeLayer">
    <div id="logisticsRules_store_container" class="layui-form">
        <div id="logisticsRuleXTree" style="width:500px;padding: 10px 0 25px 5px;"></div>
    </div>
</script>

<%-- tags(give up temporarily) --%>
<script type="text/html" id="logisticsRules_tagsLayer">
    <div id="logisticsRules_tags_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="logisticsRules_tags_containerTpl">
    <div class="layui-form">
        <div class="layui-form-item" style="margin-left: -25px;">
            <label class="layui-form-label">订单标签</label>
            <div class="layui-input-inline" style="width: 277px;">
                <input type="text" class="layui-input" name="greatThanTransport">
            </div>
            <div class="layui-input-inline" style="width: 58px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="tagsRulesTable_tbody_add">新增一行</span>
            </div>
        </div>
    </div>
    <div class="tagsRulesTable" style="margin: 0 18px;">
        <table class="layui-table">
            <thead>
                <th>大于等于</th>
                <th>小于</th>
                <th>操作</th>
            </thead>
            <tbody style="text-align: center;" id="tagsRulesTable_tbody">
            </tbody>
        </table>
    </div>
</script>

<!-- 批量添加SKU -->
<script type="text/html" id="logisticsRules_batchImportSkuLayer">
  <div class="p20">
      <form class="layui-form">
          <div class="layui-form-item">
              <label class="layui-form-label">SKU</label>
              <div class="layui-input-block">
                <textarea name="sSku" placeholder="每行一个" class="layui-textarea" rows="13"></textarea>
              </div>
          </div>
      </form>
  </div>
</script>


<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script src="${ctx}/static/js/logistics/logisticsRules.js"></script>