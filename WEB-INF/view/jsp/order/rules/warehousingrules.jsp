<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>分仓规则</title>
<style>
    .logisticsRules_createRules_bottomCondition {
        padding: 20px;
    }
    .logisticsRules_createRules_bottomCondition .bottomCondition_left{
    float: left;
    width: 800px;
    height: 420px;
    overflow-y:auto;
    border: 1px solid #ccc;
    border-radius: 4px 4px 0 0;
    }
    .logisticsRules_createRules_bottomCondition .bottomCondition_right{
        margin-left: 838px;
        border: 1px solid #ccc;
        border-radius: 4px 4px 0 0;
        width: 200px;
        height: 420px;
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
    #warehouserulesLeftChooseCondition {
        padding: 5px 20px;
    }
    #warehouserulesLeftChooseCondition li {
        padding: 5px;
    }

    #warehouse_platform_container .layui-form-checkbox {
        width: 150px;
        padding:5px;
    }
    #warehouse_platform_container .layui-form-checkbox span {
        position: absolute;
        left: 15px;
    }
    .warehouse_a{
        color: #428bd4 !important;
        text-decoration: none;
    }
    .green{
        color:green!important;
    }
    .red{
        color:red!important;
    }
</style>

<div class="layui-fluid" id="LAY-warehousingrules">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-header">
                    <div class="fr">
                       <span class="layui-btn layui-btn-normal layui-btn-sm" id="newWarehousing">新增</span>
                    </div>
                </div>
                <div class="layui-card-body">
                   <table class="layui-table" id="warehousingrules_table"  lay-filter="warehousingrules_table"></table>
                </div>
            </div>
        </div>
</script>

<!-- 优先级 -->
<script type="text/html" id="warehouseRules_priority">
    <div>
       <input type="text" class="layui-input" value="{{d.priority}}" onkeydown="modifyWarehouseRulePriority(event, this)" data-id="{{d.id}}" ztt-verify="priority">
    </div>
</script>
<!-- 分仓规则详情 -->
<script type="text/html" id="warehouseRules_detail">
    {{# if(d.ruleData){ }}

        {{# if(!commonJudgeIsEmpty(d.ruleData.storeAcctNames)){ }}
       <div> 
         指定店铺为:{{ d.ruleData.storeAcctNames.join('、') }}
       </div>
       {{# } }}

       {{# if(!commonJudgeIsEmpty(d.ruleData.storeSSku)){ }}
       <div>
          指定店铺sku为:
          {{# if(d.ruleData.storeSSku.nocontains){ }}
          <span>排除以下sku:</span>
          {{# }else{  }}
          <span>包含以下sku:</span>
          {{# } }}
           {{# layui.each(d.ruleData.storeSSku.nocontains||d.ruleData.storeSSku.contains, function(index, item){ }}
           <span>{{item}};</span>
          {{# }) }}
       </div>
      {{# } }} 

      {{# if(!commonJudgeIsEmpty(d.ruleData.platCodes)){ }}
        <div>
          指定平台为:
          {{# layui.each(d.ruleData.platCodes, function(index, item){ }}
            <span>{{item}};</span>
          {{# }) }}
       </div> 
       {{# } }}

        {{# if(!commonJudgeIsEmpty(d.ruleData.storeShippingTypes)){ }}
       <div>
          指定店铺运输方式为:
          {{# layui.each(d.ruleData.storeShippingTypes, function(index, item){ }}
            <span>{{item}};</span>
          {{# }) }}
       </div>
       {{# } }}

    {{# } }}
        
</script>
<!-- 工具栏操作 -->
<script type="text/html" id="warehouseRules_tableIdBar">
    <div>
        <span class="layui-btn layui-btn-xs" lay-event="edit">修改</span><br>
        {{# if(!d.status){  }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="enable">启用</span><br>
        {{# }else{ }}
        <span class="layui-btn layui-btn-xs layui-btn-warm" lay-event="disable">停用</span><br>
        {{# } }}
        <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</span>
    </div>
</script>

<!-- 状态 -->
<script type="text/html" id="warehouseRules_status">
        <div class="{{d.status?'green':'red'}}">{{d.status?"启用":"停用"}}</div>
</script>

<!-- 新增规则弹框 -->
<script type="text/html" id="warehouseRule_createRulesLayer">
    <div id="warehouseRule_createRules_container"></div>
</script>
<script type="text/html" id="warehouseRule_createRules_containerTpl">
    <div class="p20">
       <div class="layui-form layui-row">
           <form class="layui-form" lay-filter="newRulesForm">
          <div class="layui-form-item">
             <div class="layui-col-md6">
                <label class="layui-form-label">规则名称</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="ruleName" lay-verify="required">
                </div>
             </div>
             <div class="layui-col-md6">
                <label class="layui-form-label">优先级</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="priority" lay-verify="required">
                </div>
             </div>
             <div class="layui-col-md6">
                <label class="layui-form-label">仓库模式</label>
                <div class="layui-input-block">
                    <select name="warehouseType" lay-search lay-verify="required">
                       <option value="">请选择</option>
                       {{# if(d.warehouseTypes){  }}
                       {{#  layui.each(d.warehouseTypes, function(index, item){ }}
                           <option value="{{item.code}}">{{item.name}}</option>
                       {{#  }) }}
                      {{# } }}
                    </select>
                </div>
             </div>
             <div class="layui-col-md12">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="ruleRemark">
                </div>
             </div>
             <input type="hidden" lay-submit lay-filter="submit_newWarehouse_btn" id="submit_newWarehouse_btn">
          </div>
        </form>
       </div>
    </div>
    <div class="logisticsRules_createRules_bottomCondition">
        <div class="bottomCondition_left">
          <div class="bottomCondition_left_title">已选条件</div>
          <div class="bottomCondition_left_body">
            <ul id="warehouserulesLeftChooseCondition"></ul>
          </div>
        </div>
        <div class="bottomCondition_right">
            <div class="bottomCondition_right_title">选择条件</div>
            <div class="bottomCondition_right_body">
              {{# if(d.ruleKeys){  }}
              {{#  layui.each(d.ruleKeys, function(index, item){ }}
                  <div class="layui-form">
                      <input type="checkbox" lay-filter="chooseType" lay-skin="primary" value="{{item.code}}" title="{{item.name}}" name="{{item.code}}">
                  </div>
                  <br>
              {{#  }) }}
              {{# } }}
            </div>
          </div>
    </div>
</script>

<!-- 店铺运输方式 -->
<script type="text/html" id="warehouseRules_transportLayer">
    <div id="warehouseRules_transport_container" style="padding:20px;">
        <div class="layui-form">
            <div class="layui-form-item" style="margin-left: -25px;">
                <label class="layui-form-label">运输方式</label>
                <div class="layui-input-inline" style="width: 250px;">
                    <input type="text" class="layui-input">
                </div>
                <div class="layui-input-inline" style="width: 68px;">
                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="warehouseRulesTable_tbody_add">新增一行</span>
                </div>
            </div>
        </div>
        <div class="transportTable" style="margin: 0 18px;">
            <table class="layui-table">
                <thead>
                    <th>店铺运输方式</th>
                    <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="warehouseRulesTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>

<!-- 平台 -->
<script type="text/html" id="warehouse_platformLayer">
    <div id="warehouse_platform_container" class="layui-form" style="padding:20px;">
    </div>
</script>

<script type="text/html" id="warehouse_platform_containerTpl">
    {{#  layui.each(d, function(index, item){ }}
       <input type="checkbox" title="{{item}}" lay-skin="primary" value="{{item}}">
    {{# }) }}
</script>

<!-- 店铺sku -->
<script type="text/html" id="warehouseRules_storeSkuLayer">
    <div id="warehouseRules_storeSku_container" class="layui-form" style="padding:20px;">
        <div class="layui-form-item" style="margin-left:-111px;">
            <div class="layui-input-block">
            <input type="radio" name="storesSkuRadio"  title="包含以下SKU" value="false" checked>
            <input type="radio" name="storesSkuRadio"  title="排除以下SKU" value="true">
            </div>
        </div>
        <div class="layui-form-item layui-form-text" style="margin-left:-111px;">
            <div class="layui-input-block">
            <textarea placeholder="SKU以半角逗号隔开" class="layui-textarea"></textarea>
            </div>
        </div>
    </div>
</script>

<!-- 店铺 -->
<script type="text/html" id="warehouseRules_storeLayer">
    <div id="warehouseRules_store_container" class="layui-form">
        <div id="warehouseRulesXTree" style="width:500px;padding: 10px 0 25px 5px;"></div>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script src="${ctx}/static/js/order/warehousingrules.js"></script>