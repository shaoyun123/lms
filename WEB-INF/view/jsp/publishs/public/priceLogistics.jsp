<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>定价物流</title>
<style>
   #priceLogistics_tree li {
        border-bottom: 1px solid #797979;
    }
    #priceLogistics_tree li:last-child{
        border-bottom:none;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
          <div class="layui-card">
           <div class="layui-card-body">
              <div class="layui-row">
                <div class="layui-col-lg12 layui-col-md12">
                    <form class="layui-form" id="priceLogistics_form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流方式</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="typeName">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流状态</label>
                                <div class="layui-input-block">
                                    <select lay-search name="status">
                                        <option value=""></option>
                                        <option value="1">已启用</option>
                                        <option value="0">已禁用</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" name="logisticsCompanyId">
                            <div class="layui-col-lg3 layui-col-md3" style="padding-left:8px;margin-top:1px;">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="priceLogistics_submit">查询</span>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" style="margin-left:2px;">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
           </div>
          </div>
          <div class="layui-card">
            <div class="layui-card-header">
              <div class="fr">
                <span class="layui-btn layui-btn-sm layui-btn-normal" onclick="javascript: window.open('${ctx}/type/logisticsChargeTmpDownload')" style="margin-right: -7px;">计费模板下载</span>
                <span class="layui-btn layui-btn-sm  layui-btn-normal" id="priceLogistics_importCost">导入计费</span>
                <span class="layui-btn layui-btn-sm layui-btn-danger" id="priceLogistics_newAdd"  style="margin-left: 1px;">新增</span>
              </div>
            </div>
            <div class="layui-card-body">
              <div class="layui-row">
                  <div class="layui-col-lg2 layui-col-md2" style="padding-top:12px;">
                      <ul class="layui-nav layui-nav-tree" id="priceLogistics_tree" style="width:230px;"> 
                      </ul>
                  </div>
                  <div class="layui-col-lg10 layui-col-md10">
                      <table class="layui-table" id="priceLogistics_table"  lay-filter="priceLogistics_tableFilter"></table>
                  </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</div>

<%-- 物流商模板 --%>
<script id="priceLogistics_provider" type="text/html">
    <li class="layui-nav-item layui-this" style="text-align: center;"><a href="javascript:;"  data-logistics="">全部物流商</a></li>
    {{#  layui.each(d.data, function(index, item){ }}
        <li class="layui-nav-item">
           <a href="javascript:;"  data-logistics="{{item.id}}">{{item.cnName}}</a>
           <permTag:perm funcCode="priceLogistics_config_logistics">
           <span class="layui-btn layui-btn-sm set" style="position:absolute;right:60px;top:7px;font-size:10px;background: #5fb878;" data-provider="{{item.id}}">设置</span>
           </permTag:perm>
           <span class="layui-btn layui-btn-sm seq" style="position:absolute;right:8px;top:7px;font-size:10px" 
           data-seq="{{item.seq}}" data-provider="{{item.id}}">排序</span>
        </li>
    {{#  }); }}
</script>
<%-- 物流公司配置 --%>
<script type="text/html" id="priceLogistics_logisticsCompanyLayer">
   <div class="p20">
      <form class="layui-form" id="priceLogistics_logisticsCompanyLayerForm">
         
      </form>
   </div>
</script>
<script type="text/html" id="priceLogistics_logisticsCompanyLayerFormTpl">
    {{# if(d.data){ }}
        {{#  layui.each(d.data, function(index, item){ }}
            <div class="layui-form-item companyData">
                <input type="hidden" value="{{item.id}}">
                <label class="layui-form-label" lay-tips="{{item.remark || ''}}">{{item.fieldDesc}}</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" data-name="{{item.fieldName}}" value="{{item.fieldValue || ''}}"  lay-verify="required">
                </div>
            </div>
        {{#  }) }}
    {{# } }}
    <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="priceLogistics_logisticsCompanyLayerForm_submit">查询</span>
</script>
<%-- 物流公司排序 --%>
<script type="text/html" id="priceLogistics_logisticsCompany_seq">
    <div style="padding:20px 100px 0 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">排序</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" lay-verify="required" name="seq">
            </div>
        </div>
    </div>
</script>


<%-- 弹框--新增/编辑定价物流 --%>
<script type="text/html" id="priceLogistics_newAddLayer">
    <div class="p20">
        <form class="layui-form" id="priceLogistics_newAddLayerForm">
            <div class="layui-form-item">
                <div class="layui-row" id="priceLogistics_newAddLayerFormDiv"></div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="priceLogistics_newAddLayerFormDivTemplate">
    <div class="layui-col-lg12 layui-col-md12">
        <label class="layui-form-label">定价物流</label>
        <div class="layui-input-block">
            <select name="logisticsCompanyId">
            {{#  layui.each(d.logisticsCompanyArr, function(index, item){ }}
                {{# if(item.id == d.logisticsCompanyId){ }}
                <option value="{{item.id}}" selected>{{item.cnName}}</option>
                {{# }else{ }}
                <option value="{{item.id}}">{{item.cnName}}</option>
                {{# } }}
            {{# }) }}
            </select>
        </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12">
        <label class="layui-form-label">物流方式</label>
        <div class="layui-input-block">
            <input type="text" class="layui-input" value="{{d.name || ''}}" name="name">
        </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12">
        <label class="layui-form-label">计算抛重</label>
        <div class="layui-input-block">
            <select name="throwingWeightStatus"  lay-filter="priceLogistics_throwingWeightStatus_filter">
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
    <div class="layui-col-lg12 layui-col-md12">
      <label class="layui-form-label">币种</label>
      <div class="layui-input-block">
          <select name="currency">
          {{# if(d.currencyLists){ }}
              {{#  layui.each(d.currencyLists, function(index, item){ }}
                {{# if(d.currency == item.srcCyCode){ }}
                <option value="{{item.srcCyCode}}" selected>{{item.srcCyName}}</option>
                {{# }else{ }}
                <option value="{{item.srcCyCode}}">{{item.srcCyName}}</option>
                {{# } }}
              {{# }) }}
          {{# } }}
          </select>
      </div>
    </div>
    {{# if(d.throwingWeightStatus){  }}
    <div class="priceLogisticsStatus_show">
    {{# }else{  }}
    <div class="priceLogisticsStatus_show  disN">
    {{# } }}
        <div class="layui-form-item">
            <label class="layui-form-label">计算方式</label>
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
                <input class="layui-input" type="number" name="throwingWeightParam" value="{{d.throwingWeightParam!==undefined ?d.throwingWeightParam : ''}}"/>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">抛重/实重≥</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="weightProportion" value="{{d.weightProportion || ''}}"/>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><font class="fRed">*</font>材积系数</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="materialCoefficient" value="{{d.materialCoefficient}}"/>
            </div>
        </div>
    </div>
</script>

<%-- 表格---计算抛重方式 --%>
<script type="text/html" id="priceLogistics_tableCalcWay">
    {{# if(d.throwingWeightStatus){ }}
        <div>
            {{# if(d.throwingWeightType == 1){  }}
            <span>长+宽+高 ≥ 设置的参数</span>
            {{# }else if(d.throwingWeightType == 2){  }}
            <span>抛重≥ 设置的参数</span>
            {{# }else if(d.throwingWeightType == 3){  }}
            <span>任意一边长 ≥ 设置的参数</span>
            {{# }else{ }}
            <span></span>
            {{# } }}
        </div>
    {{# }else{ }}
       <div></div>
    {{# } }}
</script>
<%-- 表格的开关控制-状态和自动申请跟踪号 --%>
<script type="text/html" id="priceLogistics_tableStatus">
    <div class="layui-form">
        {{# if(d.status){ }}
           <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" checked lay-filter="priceLogistics_tableStatus{{d.id}}">
        {{# }else{ }}
           <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" lay-filter="priceLogistics_tableStatus{{d.id}}">
        {{# } }}
    </div>
</script>

<%-- 表格工具条 --%>
<script type="text/html" id="priceLogistics_tableIdBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑详情</a><br>
  <a class="layui-btn layui-btn-xs" lay-event="billing">物流费用</a>
</script>

<%-- 弹框---DHL区域计费 --%>
<script type="text/html" id="priceLogistics_regionalPrice">
    <div style="padding:20px;">
        <div class="layui-form layui-row">
           <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-col-lg6 layui-col-md6">
                    <div class="layui-col-lg8 layui-col-md8">
                        <input type="text" class="layui-input" id="priceLogistics_regionalPriceInput" placeholder="多个国家/地区用逗号分隔">
                    </div>
                    <div class="layui-col-md4 layui-col-lg4" style="padding-left:5px;">
                        <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="priceLogistics_regionalPriceTableSearch">查询</button>
                        <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="priceLogistics_regionalPriceTableEmpty">清空</button>
                    </div>
                </div>
                <div style="position:absolute;right:3px;overflow:hidden;">
                    <span class="layui-btn layui-btn-sm" id="priceLogistics_exportCostInfo">导出计费</span>        
                    <!-- <button class="layui-btn layui-btn-sm"  type="button" id="priceLogistics_areaZipCodeRelationTempImport">邮编导入</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="priceLogistics_areaDHLPriceCodeMapping">邮编映射</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="priceLogistics_areaCityCodeMapping" style="margin-left:-1px;">城市映射</button> -->
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="priceLogistics_addNewDHLPrice" style="margin-left:-1px;">添加</button>
                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="priceLogistics_batchDHLPrice" style="margin-left:-1px;">批量删除</button>
                    <!-- <button class="layui-btn layui-btn-sm"  type="button" onclick="javascript: window.open('${ctx}/areaZipCodeRelation/download.html')" style="margin-left:-1px;">邮编模板下载</button> -->
                </div>
           </div>
        </div>
        <table class="layui-table" id="priceLogistics_regionalPriceTable"   lay-filter="priceLogistics_regionalPriceTableFilter"></table>
    </div>
</script>
<%-- 弹框---DHL区域计费---表格---工具条 --%>
<script type="text/html" id="priceLogistics_regionalPriceTableBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
  <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>
</script>
<%-- 弹框---DHL区域计费---表格---编辑弹框--%>
<script type="text/html" id="priceLogistics_regionalPriceEdit">
    <div class="p20">
        <form class="layui-form" id="priceLogistics_regionalPriceEditForm">
        </form>
    </div>
</script>
<%-- 弹框---DHL区域计费---表格--计费弹框模板 --%>
<script type="text/html" id="priceLogistics_regionalPriceEditFormTpl">
        {{# if(d.id){ }}
        <input type="hidden" name="id" value="{{d.id}}">
        {{# } }}
        <div class="layui-form-item">
            <label class="layui-form-label"><font color="red">*</font>国家</label>
            <div class="layui-input-block">
                <select name="city" lay-filter="regionalPrice_country" lay-search>
                    {{# if(d.countryArr){ }}
                        {{#  layui.each(d.countryArr, function(index, item){ }}
                            <%-- {{# if(d.areaCountry.split(',').indexOf(item.value)>-1 ){ }} --%>
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
              <label class="layui-form-label"><font color="red">*</font>首费({{d.currency}})</label>
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
              <label class="layui-form-label"><font color="red">*</font>续费({{d.currency}})</label>
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
            <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="priceLogistics_regionalPriceEditForm_submit">查询</span>
</script>

<%-- 弹框---DHL区域计费---表格--邮编映射弹框 --%>
<script type="text/html" id="priceLogistics_areaDHLPriceCodeMappingLayer">
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
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="priceLogistics_CodeMappingTable_tbody_add">新增一行</span>
            </div>
        </div>
        <div class="CodeMappingTable" style="margin: 0 38px;">
            <table class="layui-table">
                <thead>
                   <th>大于等于</th>
                   <th>小于</th>
                   <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="priceLogistics_CodeMappingTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>
<%-- 弹框---DHL区域计费---表格--城市映射弹框 --%>
<script type="text/html" id="priceLogistics_areaCityCodeMappingLayer">
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
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="priceLogistics_areaCityCodeMappingTable_tbody_add">新增一行</span>
            </div>
        </div>
        <div class="CodeMappingTable" style="margin: 0 38px;">
            <table class="layui-table">
                <thead>
                <th>州/省</th>
                <th>城市</th>
                <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="priceLogistics_areaCityCodeMappingTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>


<script src="${ctx}/static/js/publishs/public/priceLogistics.js"></script>