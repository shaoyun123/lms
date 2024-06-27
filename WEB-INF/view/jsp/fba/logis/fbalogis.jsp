<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>物流头程</title>
<style>
   .watermark_left_config {
        float: left;
        width: 400px;
        height: 800px;
        overflow: hidden;
        border: 1px solid #ccc;
        margin-left: 10px;
        box-sizing: border-box;
    }
    .watermark_right_show {
        width: 850px;
        height:800px;
        margin-left: 450px;
        box-sizing: border-box;
        /* border: 1px solid #ccc; */
    }
    .watermark_boxNumberFontContainer{
        border: 1px dashed #ccc;
        cursor:all-scroll;
        position:absolute;
        top: 0;
        left: 0;
        font-weight: 900;
    }
    .watermark_pickNumberFontContainer{
        border: 1px dashed #ccc;
        cursor:all-scroll;
        position:absolute;
        top: 50px;
        left: 0;
        /* text-decoration:underline; */
        font-weight: 900;
    }
    .watermark_date_name_orderFontContainer {
        border: 1px dashed #ccc;
        cursor:all-scroll;
        position:absolute;
        top: 200px;
        left:100px;
    }
    #fbalogis_tree li {
        border-bottom: 1px solid #797979;
    }
    #fbalogis_tree li:last-child{
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
                            <form class="layui-form">
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
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">是否添加水印</label>
                                        <div class="layui-input-block">
                                            <select name="ifHaveWatermark">
                                                <option value=""></option>
                                                <option value="1">是</option>
                                                <option value="0">否</option>
                                            </select>
                                        </div>
                                    </div>
                                    <input type="hidden" name="logisticsCompanyId">
                                    <div class="layui-col-lg3 layui-col-md3" style="padding-left:8px;margin-top:1px;">
                                            <span class="layui-btn layui-btn-sm layui-btn-normal"  
                                            lay-submit lay-filter="fbalogis_submit"
                                            >
                                                查询
                                            </span>
                                            <button class="layui-btn layui-btn-sm layui-btn-primary" 
                                            type="reset" 
                                            style="margin-left:2px;"
                                            >
                                                清空
                                            </button>
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
                   <span class="layui-btn layui-btn-sm layui-btn-warning" id="fbalogis_showDataInfo">销售头程配置表</span>
                   <permTag:perm funcCode="fbalogis_copy">
                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="fbalogis_copyCost">复制计费</span>
                   </permTag:perm>
                    <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" onclick="javascript: window.open('${ctx}/type/logisticsChargeTmpDownload')" style="margin-right: -7px;">计费模板下载</button>
                    <button class="layui-btn layui-btn-sm  layui-btn-normal" type="button" id="fbalogis_importCost">导入计费</button>
                    <button class="layui-btn layui-btn-sm layui-btn-danger" type="button" id="fbalogis_newAdd"  style="margin-left: 1px;">新增</button>
                   </div>
                </div>
                <div class="layui-card-body">
                    <div class="layui-row">
                        <div class="layui-col-lg2 layui-col-md2" style="padding-top:12px;">
                            <ul class="layui-nav layui-nav-tree" id="fbalogis_tree" style="width:230px;"> 
                            </ul>
                        </div>
                        <div class="layui-col-lg10 layui-col-md10">
                           <table class="layui-table" id="fbalogis_table"  lay-filter="fbalogis_tableFilter"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 展示数据弹框 --%>
<script type="text/html" id="fbalogis_showDataInfoLayer">
    <div style="padding:20px;">
        <table class="layui-table">
            <thead>
                <tr>
                    <th>销售头程</th>
                    <th>发货物流方式</th>
                    <th>定价物流方式</th>
                    <th>发货方式</th>
                    <th>适用国家</th>
                </tr>
            </thead>
            <tbody id="fbalogis_showDataInfo_tbody">
            
            </tbody>
        </table>
    </div>
</script>
<script type="text/html" id="fbalogis_showDataInfo_tbodyTpl">
    {{#  layui.each(d, function(index, item){ }}
    <tr>
        <td>{{item.saleLogisticsType}}</td>
        <%-- 发货物流方式 --%>
        <td>
            {{# if(item.shippingLogisticsTypes.length>0){ }}
            <div class="layui-form">
                <select name="shippingLogisticsType" lay-search>
                <option value="">请选择</option>
                {{#  layui.each(item.shippingLogisticsTypes, function(index,shippingLogisticsType){ }}
                {{# if(item.realShippingLogisticsTypeId ==shippingLogisticsType.id){ }}
                <option value="{{shippingLogisticsType.id}}" selected>{{shippingLogisticsType.name}}</option>
                {{# }else{ }}
                <option value="{{shippingLogisticsType.id}}">{{shippingLogisticsType.name}}</option>
                {{# } }}
                {{# }) }}
                </select>
            </div>
            {{# } }}
        </td>
        <%-- 定价物流方式 --%>
        <td>
            {{# if(item.matchPriceLogisticsTypes.length>0){ }}
            <div class="layui-form">
                <select name="matchPriceLogisticsType" lay-search>
                <option value="">请选择</option>
                {{#  layui.each(item.matchPriceLogisticsTypes, function(index,matchPriceLogisticsType){ }}
                {{# if(item.realPriceLogisticsTypeId ==matchPriceLogisticsType.id){ }}
                <option value="{{matchPriceLogisticsType.id}}" selected>{{matchPriceLogisticsType.name}}</option>
                {{# }else{ }}
                <option value="{{matchPriceLogisticsType.id}}">{{matchPriceLogisticsType.name}}</option>
                {{# } }}
                {{# }) }}
                </select>
            </div>
            {{# } }}
        </td>
        <%-- 发货方式 --%>
        <td>
            {{# if(item.shippingTypes.length>0){ }}
            <div class="layui-form">
                <select name="shippingType" lay-search>
                <option value="">请选择</option>
                {{#  layui.each(item.shippingTypes, function(index,shippingType){ }}
                {{# if(item.shippingTypeId == shippingType){ }}
                <option value="{{shippingType}}" selected>{{shippingType}}</option>
                {{# }else{ }}
                <option value="{{shippingType}}">{{shippingType}}</option>
                {{# } }}
                {{# }) }}
                </select>
            </div>
            {{# } }}
        </td>
        <%-- 适用国家 --%>
        <td>
            {{# if(item.shippingCountryCodes.length>0){ }}
            <div class="layui-form">
                <select name="shippingCountryCode" lay-search>
                <option value="">请选择</option>
                {{#  layui.each(item.shippingCountryCodes, function(index,shippingCountryCode){ }}
                {{# if(item.countryCodeId ==shippingCountryCode){ }}
                <option value="{{shippingCountryCode}}" selected>{{shippingCountryCode}}</option>
                {{# }else{ }}
                <option value="{{shippingCountryCode}}">{{shippingCountryCode}}</option>
                {{# } }}
                {{# }) }}
                </select>
            </div>
            {{# } }}
        </td>
    </tr>
    {{# }) }}
</script>
<%-- 物流公司配置 --%>
<script type="text/html" id="fbalogis_logisticCompanyLayer">
    <div class="layui-form p20">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-form-item">
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">cnName</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="cnName">
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">enName</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="enName">
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">id</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="id">
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">prefix</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="prefix">
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">apicode</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="apiCode">
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">specialType</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="specialType">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div style="display:flex;justify-content: flex-end;">
                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="fbalogis_logisticCompany_add">
                        增加一行
                    </span>
                </div>
                <div style="margin-left:40px;">
                    <table class="layui-table">
                        <thead>
                            <tr>
                                <th>fieldName</th>
                                <th>fieldDesc</th>
                                <th>remark</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="fbalogis_logisticCompany_tbody">
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</script>
<%-- 物流方式配置 --%>
<script type="text/html" id="fbalogis_logisticWayLayer">
    <div class="layui-form p20">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-form-item">
                <div class="layui-col-lg4 layui-col-md4">
                    <label class="layui-form-label">公司id</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="id">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div style="display:flex;justify-content: flex-end;">
                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="fbalogis_logisticWay_add">
                        增加一行
                    </span>
                </div>
                <div style="margin-left:40px;">
                    <table class="layui-table">
                        <thead>
                            <tr>
                                <th>fieldName</th>
                                <th>fieldDesc</th>
                                <th>remark</th>
                                <th>fieldType</th>
                                <th>required</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="fbalogis_logisticWay_tbody">
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</script>
<%-- 新增物流方式 --%>
<script type="text/html" id="fbalogis_newAddLayer">
    <div class="p20">
        <div class="layui-form">
            <label class="layui-form-label"><font color="red">*</font>物流公司</label>
            <div class="layui-input-block">
                <select name="companyName" lay-search lay-filter="fbalogis_newAdd_sel"></select>
            </div>
        </div>
        <form class="layui-form" id="fbalogis_newAddLayerForm">
        </form>
    </div>
</script>
<script type="text/html" id="fbalogis_newAddLayerFormTpl">
    <input type="hidden" name="remark" value="">
    <div class="layui-form-item">
        <label class="layui-form-label"><font color="red">*</font>物流方式</label>
        <div class="layui-input-block">
            <input class="layui-input" type="text" name="name" lay-verify="required"/>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">货代公司</label>
        <div class="layui-input-block">
            <select class="layui-input" name="goodsAgent" id="fbalogis_goodsAgent"></select>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">折扣率</label>
        <div class="layui-input-block">
            <input class="layui-input" type="number" name="discountRate" value="1"/>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">包裹最大重量(g)</label>
        <div class="layui-input-block">
            <input class="layui-input" type="number" name="packageMaxWeight"/>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">包裹最小重量(g)</label>
        <div class="layui-input-block">
            <input class="layui-input" type="number" name="packageMinWeight"/>
        </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12">
        <label class="layui-form-label">目的国家</label>
        <div class="layui-input-block">
            <input class="layui-input" type="text" name="destinationCountry" lay-verify="required" placeholder="支持多个,英文逗号分隔"/>
        </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12">
        <label class="layui-form-label">物流单号前缀</label>
        <div class="layui-input-block">
            <input class="layui-input" type="text" name="trackingNoPrefix"/>
        </div>
    </div>
    {{# if(d.data){ }}
    {{#  layui.each(d.data, function(index, item){ }}
    <div class="layui-form-item fbalogis_newAddLayerFormAuto layui-row">
        <div class="layui-col-md12">
            <div class="layui-col-md4">
                <input type="hidden" value="{{item.id}}">
                <input type="hidden" value="{{item.logisticsCompanyId|| '' }}">
                <label class="layui-form-label">{{item.fieldDesc}}</label>
                <div class="layui-input-block">
                    {{# if(item.required == 'Y'){ }}
                    <input type="text" class="layui-input" data-name="{{item.fieldName}}" value="{{item.fieldValue || ''}}" lay-verify="required">
                    {{# }else{  }}
                        <input type="text" class="layui-input" data-name="{{item.fieldName}}" value="{{item.fieldValue || ''}}">
                    {{# } }}
                    
                </div>
            </div>
            <div class="layui-col-md8" style="padding-left:10px;">
                <span> {{item.remark || '' }} </span>
            </div>
        </div>
    </div>
    {{#  }) }}
    {{# } }}
    <div class="layui-form-item">
        <input type="hidden" name="logisticsAttributeList" value="普货">
        <label class="layui-form-label">物流属性</label>
        <div class="layui-input-block">
            {{# if(d.attrArr){ }}
                {{#  layui.each(d.attrArr.logisticsTypeComboBox.logisticsAttributeList, function(index, item){ }}
                    {{# if(item.name == '普货'){  }}
                    <input type="checkbox" lay-skin="primary" title="{{item.name}}" lay-filter="{{item.code}}" checked>
                    {{# }else{  }}
                    <input type="checkbox" lay-skin="primary" title="{{item.name}}" lay-filter="{{item.code}}">
                    {{# } }}
                {{# }) }}
            {{# } }}
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">计算抛重</label>
        <div class="layui-input-block">
            <select name="throwingWeightStatus" lay-filter="throwingWeightStatus_filter">
                <option value="true">是</option>
                <option value="false" selected>否</option>
            </select>
        </div>
    </div>
    <div class="logisticsModeStatus_show disN">
        <div class="layui-form-item">
            <label class="layui-form-label"><font class="fRed">*</font>计算抛重方式</label>
            <div class="layui-input-block">
                <select name="throwingWeightType">
                    <option value="">请选择</option>
                    <option value="1">长+宽+高 ≥ 设置的参数</option>
                    <option value="2">抛重≥ 设置的参数</option>
                    <option value="3">任意一边长 ≥ 设置的参数</option>
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><font class="fRed">*</font>抛重参数</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="throwingWeightParam" />
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><font class="fRed">*</font>抛/实重比例≥</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="weightProportion" onkeypress="commonKeyPressInputFloat(event)"/>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><font class="fRed">*</font>材积系数</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="materialCoefficient"/>
            </div>
        </div>
    </div>
    <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="fbalogis_newAddLayerForm_submit">查询</span>
</script>
<%-- 物流商模板 --%>
<script id="fbalogis_provider" type="text/html">
    <li class="layui-nav-item layui-this" style="text-align: center;"><a href="javascript:;"  data-logistics="">全部物流商</a></li>
    {{#  layui.each(d.data, function(index, item){ }}
        <li class="layui-nav-item">
           <a href="javascript:;"  data-logistics="{{item.id}}">{{item.cnName}}</a>
           <permTag:perm funcCode="fbalogis_config_logistics">
            <span class="layui-btn layui-btn-sm set" style="position:absolute;right:60px;top:7px;font-size:10px;background: #5fb878;" data-provider="{{item.id}}">设置</span>
           </permTag:perm>
           <span class="layui-btn layui-btn-sm seq" style="position:absolute;right:8px;top:7px;font-size:10px" 
           data-seq="{{item.seq}}" data-provider="{{item.id}}">排序</span>
        </li>
    {{#  }); }}
</script>
<%-- 物流公司配置 --%>
<script type="text/html" id="fbalogisCompanyLayer">
   <div class="p20">
      <form class="layui-form" id="fbalogisCompanyLayerForm">
         
      </form>
   </div>
</script>
<script type="text/html" id="fbalogisCompanyLayerFormTpl">
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
    <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="fbalogisCompanyLayerForm_submit">查询</span>
</script>
<%-- 物流公司排序 --%>
<script type="text/html" id="fbalogisCompany_seq">
    <div style="padding:20px 100px 0 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">排序</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" lay-verify="required" name="seq">
            </div>
        </div>
    </div>
</script>
<%-- 表格的开关控制-状态和自动申请跟踪号 --%>
<script type="text/html" id="fbalogis_tableStatus">
    <div class="layui-form">
        {{# if(d.status){ }}
           <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" checked lay-filter="fbalogis_tableStatus{{d.id}}">
        {{# }else{ }}
           <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" lay-filter="fbalogis_tableStatus{{d.id}}">
        {{# } }}
    </div>
</script>
<script type="text/html" id="fbalogis_tableAuto">
    <div>
        {{# if(d.autoApplyTrackNum){ }}
           是
        {{# }else{ }}
           否
        {{# } }}
    </div>
</script>

<%-- 面单上传/下载/预览 --%>
<script type="text/html" id="fbalogis_expressBill">
    <a class="layui-btn layui-btn-xs layui-btn-warm" id="fbalogis_billPreview{{d.id}}">模板预览</a><br/>
    <a class="layui-btn layui-btn-xs" id="fbalogis_billDown{{d.id}}">模板下载</a><br/>
    <a class="layui-btn layui-btn-xs  layui-btn-normal" id="fbalogis_billUpload{{d.id}}">模板上传</a>
</script>

<%-- 物流方式+普源名 --%>
<script type="text/html" id="fbalogis_nameAndshopElfTypeName">
  <div>
     <p>{{d.name}}</p>
     <%-- <p style="color: #ccc;">普源: {{d.shopElfTypeName}}</p> --%>
  </div>
</script>
<%-- 表格多个重量集合 --%>
<script type="text/html" id="fbalogis_packageWeight">
    <div class="alignLeft">
        <p>包裹最大重量:{{d.packageMaxWeight || ''}}</p>
        <p>包裹最小重量:{{d.packageMinWeight || ''}}</p>
    </div>
</script>

<%-- 表格备注 --%>
<script type="text/html" id="fbalogis_remark">
        <div class="alignLeft">
            <pre>{{d.remark || ''}}</pre>
            <div>
                <i class="layui-icon layui-icon-edit" style="font-size: 30px; color: #1E9FFF;cursor:pointer;" lay-event="remark">&#xe642;</i> 
            </div> 
        </div>
</script>
<%-- 备注弹框 --%>
<script type="text/html" id="fbalogis_remarkLayer">
    <div class="layui-form" style="padding:20px;">
        <textarea placeholder="请输入内容" class="layui-textarea" name="remark" style="height:450px;"></textarea>
    </div>
</script>


<%-- 表格服务代码 --%>
<script type="text/html" id="fbalogis_tableCode">
    {{# if(d.params){ }}
        <div>
            {{#  layui.each(JSON.parse(d.params), function(index, item){ }}
                <div>
                    <span>{{item.fieldDesc}}</span>:<span>{{item.fieldValue}}</span>         
                </div>
            {{# }) }}
        </div>
    {{# }else{ }}
       <div></div>
    {{# } }}
</script>
<%-- 表格工具条 --%>
<script type="text/html" id="fbalogis_tableIdBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑详情</a><br>
  <%-- <a class="layui-btn layui-btn-xs" lay-event="carries" style="width:58px;text-align:center;margin-left:3px;">承运商</a><br> --%>
  <a class="layui-btn layui-btn-xs" lay-event="billing">物流费用</a>
  <%-- <a class="layui-btn layui-btn-xs" lay-event="watermark" style="margin-left:3px;">面单水印</a> --%>
</script>

<script type="text/html" id="fbalogis_regionalPriceTableBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
  <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>
</script>
<%-- 设置物流参数弹框 --%>
<script type="text/html" id="fbalogis_set_layer">
  <div class="p20">
    <form class="layui-form">
        <div class="layui-form-item">
            <label class="layui-form-label">参数1</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input">
                </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">参数2</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input">
                </div>
        </div>
    </form>
  </div>
</script>
<%-- 编辑物流方式弹框--%>
<script type="text/html" id="fbalogis_editLogisticsWay">
   <div class="p20">
      <form class="layui-form" id="fbalogis_editLogisticsWayForm">
        <div class="layui-form-item">
            <div class="layui-row" id="fbalogis_editLogisticsWayFormDiv">
            </div>
        </div>
      </form>
   </div>
</script>
<script type="text/html" id="fbalogis_editLogisticsWayFormTemplate">
        <div class="layui-col-lg12 layui-col-md12"  title="只读,不可修改">
            <label class="layui-form-label">物流公司</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.companyName}}" readonly>
            </div>
        </div>
        <input type="hidden" name="remark" value="{{d.remark}}">
        <div class="layui-col-lg12 layui-col-md12"  title="只读,不可修改">
            <label class="layui-form-label">货代公司</label>
            <div class="layui-input-block">
                <select id="fbalogis_editAgent" name="agent"></select>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">方式名称</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.name}}" name="name">
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">折扣率</label>
            <div class="layui-input-block">
               <input type="number" class="layui-input" min="0" value="{{d.discountRate || ''}}" name="discountRate">
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">包裹最大重量(g)</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="packageMaxWeight" value="{{d.packageMaxWeight}}"/>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">包裹最小重量(g)</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="packageMinWeight" value="{{d.packageMinWeight}}"/>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">目的国家</label>
            <div class="layui-input-block">
                <input class="layui-input" type="text" name="destinationCountry" value="{{d.destinationCountry || ''}}"  lay-verify="required"/>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">物流单号前缀</label>
            <div class="layui-input-block">
                <input class="layui-input" type="text" name="trackingNoPrefix" value="{{d.trackingNoPrefix || ''}}" />
            </div>
        </div>
        {{# if(d.params){ }}
        {{#  layui.each(JSON.parse(d.params), function(index, item){ }}
            <div class="layui-col-lg12 layui-col-md12 logisticsModeAuto" style="line-height:36px;">
                <div class="layui-col-lg3 layui-col-md3">
                    <label class="layui-form-label">{{item.fieldDesc}}</label>
                    <div class="layui-input-block">
                       {{# if(item.required == 'Y'){ }}
                            <input type="text" class="layui-input" data-name="{{item.fieldName}}" value="{{item.fieldValue}}" lay-verify="required">
                            {{# }else{  }}
                            <input type="text" class="layui-input" data-name="{{item.fieldName}}" value="{{item.fieldValue}}">
                        {{# } }}
                    </div>
                </div>
                <div class="layui-col-lg9 layui-col-md9 pl20">
                  <span> {{item.remark || '' }} </span>
                </div>
            </div>
        {{#  }) }}
        {{# } }}
        <div class="layui-form-item">
                <input type="hidden" name="logisticsAttributeList" value="{{d.logisticsAttributeList}}">
                <label class="layui-form-label">物流属性</label>
                <div class="layui-input-block">
                    {{# if(d.attrArr){ }}
                      {{#  layui.each(d.attrArr.logisticsTypeComboBox.logisticsAttributeList, function(index, item){ }}
                        <input type="checkbox" lay-skin="primary" title="{{item.name}}" lay-filter="{{item.code}}">
                      {{# }) }}
                    {{# } }}
                </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">计算抛重</label>
            <div class="layui-input-block">
                <select name="throwingWeightStatus"  lay-filter="throwingWeightStatus_filter">
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
                <label class="layui-form-label"><font class="fRed">*</font>计算抛重方式</label>
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
                <label class="layui-form-label"><font class="fRed">*</font>抛重参数</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="throwingWeightParam" value="{{d.throwingWeightParam}}"/>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>抛/实重比例≥</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="weightProportion" onkeypress="commonKeyPressInputFloat(event)"  value="{{d.weightProportion}}" />
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>材积系数</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="materialCoefficient" value="{{d.materialCoefficient}}"/>
                </div>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12 disN">
            <span class="layui-btn layui-btn-sm"  lay-submit lay-filter="fbalogis_editLogisticsWayForm_submit">查询</span>
        </div>
</script>

<%-- 承运商信息 --%>
<script type="text/html" id="fbalogis_carriersLogistics">
    <div style="padding:20px">
        <span class="layui-badge">注意:承运商为空,上传跟踪号无效</span>
        <table class="layui-table">
        <colgroup>
        <col width="150">
        <col width="150">
        <col width="200">
        </colgroup>
        <thead>
            <tr>
                <th>平台</th>
                <th>承运商名称</th>
                <th>上传跟踪号</th>
            </tr> 
        </thead>
        <tbody id="fbalogis_carriersLogisticsTbody">

        </tbody>
    </table>
    </div>
</script>
<%-- 承运商模板 --%>
<script type="text/html" id="fbalogis_carriersLogisticsTbodyTpl">
    {{#  layui.each(d.data, function(index, item){ }}
        <tr>
            <td  hidden><input type="hidden" value="{{item.id|| ''}}"></td>
            <td  hidden><input type="hidden" value="{{item.logisticsTypeId}}"></td>
            <td>{{ item.platCode }}</td>
            <td width="200">
               <input type="text" class="layui-input" value="{{ item.logisticsProviderName || ''}}">
            </td>
            <td>
            {{#  if(item.isNeedSyncTrackingNo){ }}
            <input type="checkbox" checked>
            {{#  }else{  }}
            <input type="checkbox">
            {{# }  }}
            </td>
        </tr>
    {{# }); }}
</script>
<%-- DHL区域计费 --%>
<script type="text/html" id="fbalogis_regionalPrice">
    <div style="padding:20px;">
        <div class="layui-form layui-row">
           <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-col-lg6 layui-col-md6">
                    <div class="layui-col-lg8 layui-col-md8">
                        <input type="text" class="layui-input" id="fbalogis_regionalPriceInput" placeholder="多个国家用逗号分隔">
                    </div>
                    <div class="layui-col-md4 layui-col-lg4" style="padding-left:5px;">
                        <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="fbalogis_regionalPriceTableSearch">查询</button>
                        <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="fbalogis_regionalPriceTableEmpty">清空</button>
                    </div>
                </div>
                <div style="position:absolute;right:3px;overflow:hidden;">
                    <span class="layui-btn layui-btn-sm" id="exportCostInfo">导出计费</span>        
                    <!-- <button class="layui-btn layui-btn-sm"  type="button" id="areaZipCodeRelationTempImport">邮编导入</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="areaDHLPriceCodeMapping">邮编映射</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="areaCityCodeMapping" style="margin-left:-1px;">城市映射</button> -->
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="addNewDHLPrice" style="margin-left:-1px;">添加</button>
                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="batchDHLPrice" style="margin-left:-1px;">批量删除</button>
                    <!-- <button class="layui-btn layui-btn-sm"  type="button" onclick="javascript: window.open('${ctx}/areaZipCodeRelation/download.html')" style="margin-left:-1px;">邮编模板下载</button> -->
                </div>
           </div>
        </div>
        <table class="layui-table" id="fbalogis_regionalPriceTable"   lay-filter="fbalogis_regionalPriceTableFilter"></table>
    </div>
</script>
<%-- DHL区域计费编辑弹框 --%>
<script type="text/html" id="fbalogis_regionalPriceEdit">
    <div class="p20">
        <form class="layui-form" id="fbalogis_regionalPriceEditForm">
        </form>
    </div>
</script>
<%-- 区域编辑/添加 计费弹框模板 --%>
<script type="text/html" id="fbalogis_regionalPriceEditFormTpl">
        {{# if(d.id){ }}
        <input type="hidden" name="id" value="{{d.id}}">
        {{# } }}
        <div class="layui-form-item">
            <label class="layui-form-label"><font color="red">*</font>国家</label>
            <div class="layui-input-block">
                <select name="city" lay-filter="fbalogis_regionalPrice_country" lay-search>
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
            <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="fbalogis_regionalPriceEditForm_submit">查询</span>
</script>

<%-- 面单加水印弹框 --%>
<script type="text/html" id="fbalogis_watermark">
 <div class="p20" id="fbalogis_watermark_content">  
 </div>
</script>
<%-- 面单加水印弹框模板 --%>
<script type="text/html" id="fbalogis_watermark_contentTpl">
    <div class="watermark_left_config p20">
        <form class="layui-form">
            <div class="layui-form-item">
                <div class="layui-form-label">物流方式</div>
                <div class="layui-input-block">
                    <input class="layui-input fbalogis_watermark_way" value="{{d.name}}" disabled>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-form-label">字段</div>
                <div class="layui-input-block">
                   {{# if(d.boxNumber.selected){  }}
                   <input type="checkbox" title="箱号(固定加粗)" lay-skin="primary" name="watermark_boxNumberFont_checkbox" checked>
                   {{# }else{  }}
                   <input type="checkbox" title="箱号(固定加粗)" lay-skin="primary" name="watermark_boxNumberFont_checkbox">
                   {{# } }}
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-form-label">字号</div>
                <div class="layui-input-block">
                   <select name="watermark_boxNumberFont_select">
                   {{# if(d.fontSizeArr){ }}
                   {{#  layui.each(d.fontSizeArr, function(index, item){ }}
                       {{# if(d.boxNumber.fontSize == item.size){  }}
                           <option value="{{item.key}}" selected>{{item.size}}</option>
                       {{# }else{  }}
                          <option value="{{item.key}}">{{item.size}}</option>
                       {{# } }}
                   {{# }) }}
                   {{# } }}
                   </select>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-form-label">字段</div>
                <div class="layui-input-block">
                {{# if(d.batchNo.selected){  }}
                    <input type="checkbox"  title="分拣码(固定加粗+大括号)" lay-skin="primary" name="watermark_pickNumberFont_checkbox" checked>
                {{# }else{  }}
                   <input type="checkbox"  title="分拣码(固定加粗+大括号)" lay-skin="primary" name="watermark_pickNumberFont_checkbox">
                {{# } }}
                </div>
            </div>
            {{# if(d.batchNo.selected){  }}
            <div class="layui-form-item">
                <div class="layui-form-label">输入分拣码</div>
                <div class="layui-input-block">
                   <input type="text" class="layui-input" name="watermark_pickNumberFont_input" value="{{d.batchNo.value}}">
                </div>
            </div>
            {{# }else{  }}
            <div class="layui-form-item disN">
                <div class="layui-form-label">输入分拣码</div>
                <div class="layui-input-block">
                   <input type="text" class="layui-input" name="watermark_pickNumberFont_input"  value="{{d.batchNo.value}}">
                </div>
            </div>
            {{# } }}
            <div class="layui-form-item">
                <div class="layui-form-label">字号</div>
                <div class="layui-input-block">
                   <select name="watermark_pickNumberFont_select">
                   {{# if(d.fontSizeArr){ }}
                   {{#  layui.each(d.fontSizeArr, function(index, item){ }}
                       {{# if(d.batchNo.fontSize == item.size){  }}
                           <option value="{{item.key}}" selected>{{item.size}}</option>
                       {{# }else{  }}
                          <option value="{{item.key}}">{{item.size}}</option>
                       {{# } }}
                   {{# }) }}
                   {{# } }}
                   </select>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-form-label">字段</div>
                <div class="layui-input-block">
                {{# if(d.printDate.selected){  }}
                <input type="checkbox" title="打印时间" lay-skin="primary" name="watermark_date_name_orderFont_printDate_checkbox" checked>
                {{# }else{  }}
                   <input type="checkbox" title="打印时间" lay-skin="primary" name="watermark_date_name_orderFont_printDate_checkbox">
                {{# } }}
                {{# if(d.storeName.selected){  }}
                  <input type="checkbox" title="店铺名称" lay-skin="primary" name="watermark_date_name_orderFont_storeName_checkbox" checked>
                {{# }else{  }}
                   <input type="checkbox" title="店铺名称" lay-skin="primary" name="watermark_date_name_orderFont_storeName_checkbox">
                {{# } }}
                {{# if(d.orderNumber.selected){  }}
                  <input type="checkbox" title="订单编号" lay-skin="primary" name="watermark_date_name_orderFont_orderNumber_checkbox" checked>
                {{# }else{  }}
                   <input type="checkbox" title="订单编号" lay-skin="primary" name="watermark_date_name_orderFont_orderNumber_checkbox">
                {{# } }} 
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-form-label">字号</div>
                <div class="layui-input-block">
                   <select name="watermark_date_name_orderFont_select">
                   {{# if(d.fontSizeArr){ }}
                   {{#  layui.each(d.fontSizeArr, function(index, item){ }}
                        {{# if(d.printDate.fontSize == item.size){  }}
                           <option value="{{item.key}}" selected>{{item.size}}</option>
                        {{# }else{  }}
                          <option value="{{item.key}}">{{item.size}}</option>
                        {{# } }}
                   {{# }) }}
                   {{# } }}
                   </select>
                </div>
            </div>
        </form>
    </div>
    <div class="watermark_right_show">
        <div id="watermark_containerBox">
            <%-- 箱号容器 --%>
            {{# if(d.boxNumber.selected){  }}
            <div id="watermark_boxNumberFont" class="watermark_boxNumberFontContainer">
                <span style="font-size:{{d.boxNumber.fontSize}}px">{{d.boxNumber.value}}</span>
            </div>
            {{# }else{  }}
            <div id="watermark_boxNumberFont" class="watermark_boxNumberFontContainer disN">
                <span style="font-size:{{d.boxNumber.fontSize}}px">{{d.boxNumber.value}}</span>
            </div>
            {{# } }}
            <%-- 记录箱号容器的坐标 --%>
            <input type="hidden" id="watermark_boxNumberFontLocation" value='{{JSON.stringify(d.boxNumber.location)}}'>
            <%-- 分拣码容器 --%>
            {{# if(d.batchNo.selected){  }}
            <div id="watermark_pickNumberFont" class="watermark_pickNumberFontContainer">
                <span style="font-size:{{d.batchNo.fontSize}}px">{{d.batchNo.value}}</span>
            </div>
            {{# }else{  }}
            <div id="watermark_pickNumberFont" class="watermark_pickNumberFontContainer disN">
                <span style="font-size:{{d.batchNo.fontSize}}px">{{d.batchNo.value}}</span>
            </div>
            {{# } }}
            <%-- 记录分拣码容器的坐标 --%>
            <input type="hidden" id="watermark_pickNumberFontLocation" value='{{JSON.stringify(d.batchNo.location)}}'>
            <%-- 打印时间-店铺名称-订单编号容器 --%>
            {{# if(!d.printDate.selected && !d.storeName.selected && !d.orderNumber.selected){  }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px">
                       <span class="watermark_date_name_orderFont_printDate disN">[{{d.printDate.value}}]</span>
                       <span class="watermark_date_name_orderFont_storeName disN">[{{d.storeName.value}}]</span>
                       <span class="watermark_date_name_orderFont_orderNumber disN">[{{d.orderNumber.value}}]</span>
                    </span>
                </div>
            {{# }else if(d.printDate.selected && !d.storeName.selected && !d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px">
                       <span class="watermark_date_name_orderFont_printDate">[{{d.printDate.value}}]</span>
                       <span class="watermark_date_name_orderFont_storeName disN">[{{d.storeName.value}}]</span>
                       <span class="watermark_date_name_orderFont_orderNumber disN">[{{d.orderNumber.value}}]</span>
                    </span>
                </div>
            {{# }else if(!d.printDate.selected && d.storeName.selected && !d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px">
                     <span class="watermark_date_name_orderFont_storeName">[{{d.storeName.value}}]</span>
                     <span class="watermark_date_name_orderFont_printDate disN">[{{d.printDate.value}}]</span>
                     <span class="watermark_date_name_orderFont_orderNumber disN">[{{d.orderNumber.value}}]</span>
                    </span>
                </div>
            {{# }else if(!d.printDate.selected && !d.storeName.selected && d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px">
                      <span class="watermark_date_name_orderFont_orderNumber">[{{d.orderNumber.value}}]</span>
                      <span class="watermark_date_name_orderFont_storeName disN">[{{d.storeName.value}}]</span>
                      <span class="watermark_date_name_orderFont_printDate disN">[{{d.printDate.value}}]</span>
                    </span>
                </div>
            {{# }else if(d.printDate.selected && d.storeName.selected && !d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px">
                        <span class="watermark_date_name_orderFont_printDate">[{{d.printDate.value}}]</span>
                        <span class="watermark_date_name_orderFont_storeName">[{{d.storeName.value}}]</span>
                        <span class="watermark_date_name_orderFont_orderNumber disN">[{{d.orderNumber.value}}]</span>
                    </span>
                </div>
            {{# }else if(d.printDate.selected && !d.storeName.selected && d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px">
                        <span class="watermark_date_name_orderFont_printDate">[{{d.printDate.value}}]</span>
                        <span class="watermark_date_name_orderFont_storeName disN">[{{d.storeName.value}}]</span>
                        <span class="watermark_date_name_orderFont_orderNumber">[{{d.orderNumber.value}}]</span>
                    </span>
                </div>
            {{# }else if(!d.printDate.selected && d.storeName.selected && d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px">
                        <span class="watermark_date_name_orderFont_storeName">[{{d.storeName.value}}]</span>
                        <span class="watermark_date_name_orderFont_orderNumber">[{{d.orderNumber.value}}]</span>
                        <span class="watermark_date_name_orderFont_printDate disN">[{{d.printDate.value}}]</span>
                    </span>
                </div>
            {{# }else if(d.printDate.selected && d.storeName.selected && d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px"> 
                       <span class="watermark_date_name_orderFont_printDate">[{{d.printDate.value}}]</span>
                       <span class="watermark_date_name_orderFont_storeName">[{{d.storeName.value}}]</span>
                       <span class="watermark_date_name_orderFont_orderNumber">[{{d.orderNumber.value}}]</span>
                    </span>
                </div>
            {{# } }}   
            <%-- 记录分拣码容器的坐标 --%>
            <input type="hidden" id="watermark_date_name_orderFontLocation" value='{{JSON.stringify(d.printDate.location)}}'>
        </div>
        
    </div>
</script>

<%-- 邮编映射 --%>
<script type="text/html" id="fbalogis_areaDHLPriceCodeMappingLayer">
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
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="fbalogis_CodeMappingTable_tbody_add">新增一行</span>
            </div>
        </div>
        <div class="CodeMappingTable" style="margin: 0 38px;">
            <table class="layui-table">
                <thead>
                   <th>大于等于</th>
                   <th>小于</th>
                   <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="fbalogis_CodeMappingTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>

<%-- 城市映射 --%>
<script type="text/html" id="fbalogis_areaCityCodeMappingLayer">
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
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="areaCityfbalogis_CodeMappingTable_tbody_add">新增一行</span>
            </div>
        </div>
        <div class="CodeMappingTable" style="margin: 0 38px;">
            <table class="layui-table">
                <thead>
                <th>州/省</th>
                <th>城市</th>
                <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="areaCityfbalogis_CodeMappingTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>

<script src="${ctx}/static/js/fba/fbalogis.js"></script>