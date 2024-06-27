<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>海外仓头程</title>

<style>
.marginR08 {
    margin-right:8px;
}
.layui-layer-content {
    overflow: visible;
}
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="headconfig_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流方式</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="typeName">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售头程</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="saleLogisticsTypeName">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流状态</label>
                                <div class="layui-input-block">
                                    <select lay-search name="status">
                                        <option value=""></option>
                                        <option value="1" selected>已启用</option>
                                        <option value="0">已禁用</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">默认销售头程</label>
                                <div class="layui-input-block">
                                    <select lay-search name="ifSaleLogisticsTypeDefault">
                                        <option value=""></option>
                                        <option value="1" selected>是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">是否添加水印</label>
                                <div class="layui-input-block">
                                    <select lay-search name="ifHaveWatermark">
                                        <option value=""></option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2" style="padding-left:8px;margin-top:1px;">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="headconfig_submit">
                                    查询</span>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" style="margin-left:2px;">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <div style="height:100%;align-items:center;display:flex;justify-content:flex-end;">
                        <span class="layui-btn layui-btn-sm layui-btn-normal" onclick="javascript: window.open('${ctx}/type/logisticsChargeTmpDownload')">计费模板下载</span>
                        <span class="layui-btn layui-btn-sm  layui-btn-normal marginR08" id="headconfig_importCost">导入计费</span>
                        <span class="layui-btn layui-btn-sm layui-btn-danger" id="headconfig_newAdd">新增</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="headconfig_table"  lay-filter="headconfig_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<%-- 排序 --%>
<script type="text/html" id="headconfig_sort">
    <div>
        <input type="number" class="layui-input headconfig_sort" value="{{d.orderNo || ''}}">
        <input type="hidden" value="{{d.orderNo || ''}}" data-id="{{d.id}}">
    </div>
</script>
<%-- 物流方式+普源名 --%>
<script type="text/html" id="headconfig_nameAndshopElfTypeName">
  <div>
     <p>{{d.name || ''}}</p>
     <p style="color: #ccc;">普源: {{d.shopElfTypeName || ''}}</p>
  </div>
</script>
<%-- 服务代码 --%>
<script type="text/html" id="headconfig_tableCode">
    {{# if(d.params){ }}
        <div class="alignLeft">
            {{#  layui.each(JSON.parse(d.params), function(index, item){ }}
            <div>
                {{# if(item.fieldName == 'winit_winitProductCode'){ }} 
                {{# }else if(item.fieldName == 'winit_inspectionWarehouseCode'){ }}
                {{# }else if(item.fieldName == 'winit_importerCode'){ }}
                {{# }else{ }}
                <strong>{{item.fieldDesc}}</strong>:<span>{{item.fieldValue}}</span>
                {{# } }} 
            </div>   
            {{# }) }}
        </div>
    {{# }else{ }}
        <div></div>
    {{# } }}
</script>
<%-- 自动申请跟踪号 --%>
<script type="text/html" id="headconfig_tableAuto">
    <div>
        {{# if(d.autoApplyTrackNum){ }}
           是
        {{# }else{ }}
           否
        {{# } }}
    </div>
</script>
<%-- 表格的开关控制-状态和自动申请跟踪号 --%>
<script type="text/html" id="headconfig_tableStatus">
    <div class="layui-form">
        {{# if(d.status){ }}
           <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" checked lay-filter="headconfig_tableStatus{{d.id}}">
        {{# }else{ }}
           <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" lay-filter="headconfig_tableStatus{{d.id}}">
        {{# } }}
    </div>
</script>

<%-- 表格备注 --%>
<script type="text/html" id="headconfig_remark">
        <div class="alignLeft">
            <pre>{{d.remark || ''}}</pre>
            <div>
                <i class="layui-icon layui-icon-edit" style="font-size: 30px; color: #1E9FFF;cursor:pointer;" lay-event="remark">&#xe642;</i> 
            </div> 
        </div>
</script>
<script type="text/html" id="headconfig_remarkLayer">
    <div class="layui-form" style="padding:20px;">
        <textarea placeholder="请输入内容" class="layui-textarea" name="remark" style="height:450px;"></textarea>
    </div>
</script>

<%-- 表格工具条 --%>
<script type="text/html" id="headconfig_tableIdBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑详情</a><br>
    <a class="layui-btn layui-btn-xs" lay-event="copy">复制新增</a><br>
  <a class="layui-btn layui-btn-xs" lay-event="billing">物流费用</a>
</script>


<%-- 编辑物流方式弹框--%>
<script type="text/html" id="headconfig_editLogisticsWay">
   <div class="p20 layui-row">
      <form class="layui-form" id="headconfig_editLogisticsWayForm">
        <div class="layui-form-item">
            <div class="layui-col-lg12 layui-col-md12">
                <label class="layui-form-label">物流公司</label>
                <div class="layui-input-block">
                    <select name="headconfig_logisticsCompany" lay-filter="headconfig_logisticsCompanyFilter">
                    </select>
                </div>
            </div>
            <div id="headconfig_editLogisticsWayFormDiv">
            </div>
        </div>
      </form>
   </div>
</script>
<script type="text/html" id="headconfig_editLogisticsWayFormTemplate">
        <input type="hidden" name="remark" value="{{d.remark}}">
        <input type="hidden" name="orderNo" value="1">
        <div class="layui-col-lg12 layui-col-md12"  title="只读,不可修改">
            <label class="layui-form-label">货代公司</label>
            <div class="layui-input-block">
                <select name="agent">
                    {{# if(d.agentArr){  }}
                    {{#  layui.each(d.agentArr, function(index,item){ }}
                        {{# if(item.code == d.agent){ }}
                         <option value="{{item.code}}" selected>{{item.name}}</option>
                        {{# }else{ }}
                            <option value="{{item.code}}">{{item.name}}</option>
                        {{# } }}
                    {{#  }) }}
                    {{# } }}
                </select>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">方式名称</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.name}}" name="name">
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">普源别名</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.shopElfTypeName}}" name="shopElfTypeName">
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">折扣率</label>
            <div class="layui-input-block">
               <input type="number" class="layui-input" min="0" value="{{d.discountRate || ''}}" name="discountRate">
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">自动申跟踪号</label>
            <div class="layui-input-block">
                <select name="autoApplyTrackNum">
                    {{# if(d.autoApplyTrackNum){  }}
                        <option value="true" selected>是</option>
                        <option value="false">否</option>
                    {{# }else{  }}
                        <option value="true">是</option>
                        <option value="false" selected>否</option>
                    {{# } }}
                </select>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">包裹最小重量(g)</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="packageMinWeight" value="{{d.packageMinWeight}}" />
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">包裹最大重量(g)</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="packageMaxWeight" value="{{d.packageMaxWeight}}"/>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">目的国家</label>
            <div class="layui-input-block">
                <input class="layui-input" type="text" name="destinationCountry" value="{{d.destinationCountry || ''}}" data-name="countryCode"  lay-verify="required" />
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">物流单号前缀</label>
            <div class="layui-input-block">
                <input class="layui-input" type="text" name="trackingNoPrefix" value="{{d.trackingNoPrefix || ''}}" data-name="trackingNoPrefix" />
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">销售头程</label>
            <div class="layui-input-block" style="display:flex;justify-content:space-between;">
                <select name="saleLogisticsType" id="headconfig_saleLogisticsType" lay-search  lay-verify="required">
                    {{# layui.each(d.saleLogisticsTypes, function(index, item){ }}
                        {{#  if(item.saleLogisticsTypeName == d.saleLogisticsType) { }}
                        <option value="{{item.saleLogisticsTypeName}}" selected>{{item.saleLogisticsTypeName}}</option>
                        {{# }else{ }}
                        <option value="{{item.saleLogisticsTypeName}}">{{item.saleLogisticsTypeName}}</option>
                        {{# } }}
                    {{# }) }}
                </select>
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="headconfig_addSaleLogisticsType">
                    新增销售头程
                </span>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">是否默认</label>
            <div class="layui-input-block">
                <select name="ifSaleLogisticsTypeDefault" lay-verify="required">
                    {{# if(d.ifSaleLogisticsTypeDefault){  }}
                    <option value="0">否</option>
                    <option value="1" selected>是</option>
                    {{# }else{ }}
                    <option value="0" selected>否</option>
                    <option value="1">是</option>
                    {{# } }}
                    
                </select>
            </div>
        </div>
        {{# if(d.params){ }}
            {{#  layui.each(d.params, function(index, item){ }}
                <div class="layui-col-lg12 layui-col-md12 logisticsModeAuto" style="line-height:36px;">
                    {{# if(item.fieldName=='winit_orderType'){ }}
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label" data-label="{{item.fieldName}}">{{item.fieldDesc}}</label>
                        <div class="layui-input-block">
                            <select data-name="{{item.fieldName}}" 
                                lay-filter="headconfig_{{item.fieldName}}Filter" 
                                id="headconfig_{{item.fieldName}}" 
                                lay-search
                                lay-verify="{{item.required == 'Y' ? 'required': ''}}"
                            >
                                {{# if(item.fieldValue == 'DI'){ }}
                                <option value="DI" selected>DI</option>
                                <option value="SD">SD</option>
                                {{# }else{ }}
                                <option value="DI">DI</option>
                                <option value="SD" selected>SD</option>
                                {{# } }}
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg9 layui-col-md9 pl20">
                        <span> {{item.remark || '' }} </span>
                    </div>
                    {{# }else if(item.fieldName=='winit_winitProductCode' || item.fieldName=='winit_inspectionWarehouseCode' || item.fieldName=='winit_importerCode'){ }}
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label" data-label="{{item.fieldName}}">{{item.fieldDesc}}</label>
                        <div class="layui-input-block">
                            <select data-name="{{item.fieldName}}" 
                                lay-filter="headconfig_{{item.fieldName}}Filter" 
                                id="headconfig_{{item.fieldName}}"  
                                lay-search
                                lay-verify="{{item.required == 'Y' ? 'required': ''}}"
                            >
                                <option value="{{item.fieldValue}}" selected>{{item.fieldValue}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg9 layui-col-md9 pl20">
                        <span> {{item.remark || '' }} </span>
                    </div>
                    {{# }else if(item.fieldName=='winit_winitProductCodeName' || item.fieldName=='winit_inspectionWarehouseCodeName' || item.fieldName=='winit_importerCodeName'){ }}
                    <div class="layui-col-lg3 layui-col-md3 disN">
                        <label class="layui-form-label"  data-label="{{item.fieldName}}">{{item.fieldDesc}}</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" 
                                data-name="{{item.fieldName}}" 
                                value="{{item.fieldValue}}" 
                                lay-verify="{{item.required == 'Y' ? 'required': ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg9 layui-col-md9 pl20 disN">
                        <span> {{item.remark || '' }} </span>
                    </div>
                    {{# }else{ }}
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label"  data-label="{{item.fieldName}}">{{item.fieldDesc}}</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" 
                                    data-name="{{item.fieldName}}" 
                                    value="{{item.fieldValue}}" 
                                    lay-verify="{{item.required == 'Y' ? 'required': ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg9 layui-col-md9 pl20">
                        <span> {{item.remark || '' }} </span>
                    </div>
                    {{# } }}
                </div>
            {{#  }) }}
        {{# } }}
        <div class="layui-form-item">
                <input type="hidden" name="logisticsAttributeList" value="{{d.logisticsAttributeList}}">
                <label class="layui-form-label">物流属性</label>
                <div class="layui-input-block">
                    {{# if(d.attrArr){ }}
                      {{#  layui.each(d.attrArr, function(index, item){ }}
                        <%-- {{# if(item.name == '普货'){ }}
                        <input type="checkbox" lay-skin="primary" title="{{item.name}}" lay-filter="{{item.code}}" checked>
                        {{# }else{ }} --%>
                        <input type="checkbox" lay-skin="primary" title="{{item.name}}" lay-filter="{{item.code}}">
                        <%-- {{# } }} --%>
                      {{# }) }}
                    {{# } }}
                </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">计算抛重</label>
            <div class="layui-input-block">
                <select name="throwingWeightStatus"  lay-filter="headconfig_throwingWeightStatus_filter">
                    {{# if(d.throwingWeightStatus){  }}
                    <option value="true" selected>是</option>
                    <option value="false">否</option>
                    {{# }else{  }}
                    <option value="true">是</option>
                    <option value="false" selected>否</option>
                    {{# } }}
                </select>
            </div>
        </div>
        {{# if(d.throwingWeightStatus){  }}
        <div class="logisticsModeStatus_show">
        {{# }else{  }}
        <div class="logisticsModeStatus_show  disN">
        {{# } }}
            <div class="layui-form-item">
                <label class="layui-form-label">计算抛重方式</label>
                <div class="layui-input-block">
                    <select name="throwingWeightType">
                        {{# if(d.throwingWeightType == 1){  }}
                        <option value="">请选择</option>
                        <option value="1" selected>长+宽+高 ≥ 设置的参数</option>
                        <option value="2">抛重≥ 设置的参数</option>
                        <option value="3">任意一边长 ≥ 设置的参数</option>
                        {{# }else if(d.throwingWeightType == 2){  }}
                        <option value="">请选择</option>
                        <option value="1">长+宽+高 ≥ 设置的参数</option>
                        <option value="2" selected>抛重≥ 设置的参数</option>
                        <option value="3">任意一边长 ≥ 设置的参数</option>
                        {{# }else if(d.throwingWeightType == 3){  }}
                        <option value="">请选择</option>
                        <option value="1">长+宽+高 ≥ 设置的参数</option>
                        <option value="2">抛重≥ 设置的参数</option>
                        <option value="3" selected>任意一边长 ≥ 设置的参数</option>
                        {{# }else{ }}
                        <option value="">请选择</option>
                        <option value="1">长+宽+高 ≥ 设置的参数</option>
                        <option value="2">抛重≥ 设置的参数</option>
                        <option value="3">任意一边长 ≥ 设置的参数</option>
                        {{# } }}
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">抛重参数</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="throwingWeightParam" value="{{d.throwingWeightParam}}"/>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>抛/实重比例≥</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="weightProportion" onkeypress="commonKeyPressInputFloat(event)" value="{{d.weightProportion}}"/>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>材积系数</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="materialCoefficient" value="{{d.materialCoefficient}}"/>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">分抛系数</label>
                <div class="layui-input-block">
                    <select name="partThrowingWeightType">
                        {{# if(d.partThrowingWeightType ==4){ }}
                        <option value="5">全抛</option>
                        <option value="4" selected>分抛50%</option>
                        {{# }else{ }}
                        <option value="5" selected>全抛</option>
                        <option value="4">分抛50%</option>
                        {{# } }}
                    </select>
                </div>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12 disN">
            <span class="layui-btn layui-btn-sm"  lay-submit lay-filter="headconfig_editLogisticsWayForm_submit">查询</span>
        </div>
</script>

<%-- 新增销售头程 --%>
<script type="text/html" id="addSaleLogisticsTypeLayer">
    <div id="addSaleLogisticsTypeContainer" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="addSaleLogisticsTypeContainerTpl">
    <div style="display:flex;">
        <span>销售头程</span>
        <input type="text" class="layui-input" name="addSaleLogisticsTypeContainer_input" style="flex:1;margin:0 5px;">
        <span class="layui-btn layui-btn-sm layui-btn-normal" id="addSaleLogisticsTypeContainer_row">新增一行</span>
    </div>
    <table class="layui-table">
        <thead>
            <tr>
                <th>销售头程</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody id="addSaleLogisticsTypeContainer_tbody">
            {{# layui.each(d, function(index, item){ }}
                <tr>
                    <td>{{item.saleLogisticsTypeName}}</td>
                    <td><span class="layui-btn layui-btn-danger layui-btn-xs" onclick="commonDelTr(this)">删除</span></td>
                </tr>
            {{# }) }}
        </tbody>
    </table>
</script>


<%-- DHL区域计费 --%>
<script type="text/html" id="headconfig_regionalPrice">
    <div style="padding:20px;">
        <div class="layui-form layui-row">
           <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-col-lg6 layui-col-md6">
                    <div class="layui-col-lg8 layui-col-md8">
                        <input type="text" class="layui-input" id="headconfig_regionalPriceInput" placeholder="多个国家用逗号分隔">
                    </div>
                    <div class="layui-col-md4 layui-col-lg4" style="padding-left:5px;">
                        <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="headconfig_regionalPriceTableSearch">查询</button>
                        <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="headconfig_regionalPriceTableEmpty">清空</button>
                    </div>
                </div>
                <div style="position:absolute;right:3px;overflow:hidden;">        
                    <button class="layui-btn layui-btn-sm"  type="button" id="headconfig_areaZipCodeRelationTempImport">邮编导入</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="headconfig_areaDHLPriceCodeMapping">邮编映射</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="headconfig_areaCityCodeMapping" style="margin-left:-1px;">城市映射</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="headconfig_addNewDHLPrice" style="margin-left:-1px;">添加</button>
                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="headconfig_batchDHLPrice" style="margin-left:-1px;">批量删除</button>
                    <button class="layui-btn layui-btn-sm"  type="button" onclick="javascript: window.open('${ctx}/areaZipCodeRelation/download.html')" style="margin-left:-1px;">邮编模板下载</button>
                </div>
           </div>
        </div>
        <table class="layui-table" id="headconfig_regionalPriceTable"   lay-filter="headconfig_regionalPriceTableFilter"></table>
    </div>
</script>
<%-- DHL区域计费编辑弹框 --%>
<script type="text/html" id="headconfig_regionalPriceEdit">
    <div class="p20">
        <form class="layui-form" id="headconfig_regionalPriceEditForm">
        </form>
    </div>
</script>
<%-- 区域编辑/添加 计费弹框模板 --%>
<script type="text/html" id="headconfig_regionalPriceEditFormTpl">
        {{# if(d.id){ }}
        <input type="hidden" name="id" value="{{d.id}}">
        {{# } }}
        <div class="layui-form-item">
            <label class="layui-form-label"><font color="red">*</font>国家/地区</label>
            <div class="layui-input-block">
                <select name="city" lay-filter="regionalPrice_country" lay-search>
                    {{# if(d.countryArr){ }}
                        {{#  layui.each(d.countryArr, function(index, item){ }}
                            {{# if(d.areaCountry.indexOf(item.value)>-1 ){ }}
                            <option value="{{item.value}}" selected="selected">{{ item.name }}({{item.value}})</option>
                            {{# }else{ }}
                            <option value="{{item.value}}">{{ item.name }}({{item.value}})</option>
                            {{# } }}
                        {{# }) }}
                    {{# } }}
                </select>
            </div>
        </div>
            <div class="layui-form-item">
              <label class="layui-form-label"><font color="red">*</font>首重(g)</label>
                <div class="layui-input-block" >
                  <input type="text" class="layui-input" name="firstWeight" value="{{d.firstWeight}}" lay-verify = "required">
                </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label"><font color="red">*</font>首费(￥)</label>
                <div class="layui-input-block">
                   <input type="text" class="layui-input" name="firstCost" value="{{d.firstCost}}" lay-verify = "required">
                </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label"><font color="red">*</font>续重(g)</label>
                <div class="layui-input-block">
                   <input type="text" class="layui-input" name="addedWeight" value="{{d.addedWeight}}" lay-verify = "required">
                </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label"><font color="red">*</font>续费(￥)</label>
                <div class="layui-input-block">
                   <input type="text" class="layui-input" name="addedCost" value="{{d.addedCost}}"  lay-verify = "required">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font color="red">*</font>操作费(不参与折扣)</label>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="operationCost" value="{{d.operationCost}}" lay-verify = "required">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">上限重量(g)</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="maxWeight" value="{{d.maxWeight==undefined ? '': 
                    d.maxWeight}}">
                </div>
            </div>
            <!-- <div class="layui-form-item">
                <label class="layui-form-label">材积系数</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="materialCoefficient" value="{{d.materialCoefficient==undefined ? '': d.materialCoefficient }}">
                </div>
            </div> -->
            <div class="layui-form-item">
                <label class="layui-form-label">区域</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="area" value="{{d.area==undefined ? '': d.area}}">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">区域折扣</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="areaDiscount" value="{{d.areaDiscount==undefined ? '': d.areaDiscount}}" placeholder="折扣请用小数表示，1代表不打折">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">序号</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="areaNumber" value="{{d.areaNumber==undefined ? '': d.areaNumber}}">
                </div>
            </div>
            <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="headconfig_regionalPriceEditForm_submit">查询</span>
</script>

<%-- 邮编映射 --%>
<script type="text/html" id="headconfig_areaDHLPriceCodeMappingLayer">
    <div>
        <div class="layui-form-item" style="margin: 20px 0 0 -30px;">
            <label class="layui-form-label">邮编</label>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="zipCodeGreatThanAndEqual">
            </div>
            <div class="layui-form-mid">-</div>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="zipCodeLessThan">
            </div>
            <div class="layui-input-inline" style="width: 68px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="headconfig_CodeMappingTable_tbody_add">新增一行</span>
            </div>
        </div>
        <div class="CodeMappingTable" style="margin: 0 38px;">
            <table class="layui-table">
                <thead>
                   <th>大于等于</th>
                   <th>小于</th>
                   <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="headconfig_CodeMappingTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>

<%-- 城市映射 --%>
<script type="text/html" id="headconfig_areaCityCodeMappingLayer">
    <div>
        <div class="layui-form-item" style="margin: 20px 0 0 -30px;">
            <label class="layui-form-label">州/省</label>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="logisticsProvince">
            </div>
            <div class="layui-form-mid">城市</div>
            <div class="layui-input-inline" style="width: 140px;">
                <input type="text" class="layui-input" name="logisticsCity">
            </div>
            <div class="layui-input-inline" style="width: 68px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="headconfig_areaCityCodeMappingTable_tbody_add">新增一行</span>
            </div>
        </div>
        <div class="CodeMappingTable" style="margin: 0 38px;">
            <table class="layui-table">
                <thead>
                <th>州/省</th>
                <th>城市</th>
                <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="headconfig_areaCityCodeMappingTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>

<script type="text/html" id="headconfig_regionalPriceTableBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
  <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>
</script>



<script src="${ctx}/static/js/wyt/logistics/headconfig.js?v=${ver}"></script>