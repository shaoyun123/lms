<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>物流方式</title>
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
    .watermark_boxNumberFontContainer,
    .watermark_skuInfoNumberEnNameFontContainer,
    .watermark_countryNameFontContainer
    {
        border: 1px dashed #ccc;
        cursor:all-scroll;
        position:absolute;
        top: 0;
        left: 0;
        font-weight: 900;
    }
    .watermark_storeNameSubFontContainer {
      border: 1px dashed #ccc;
      cursor:all-scroll;
      position:absolute;
      top: 0;
      left: 0;
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
    #logisticsMode_tree li {
        border-bottom: 1px solid #797979;
    }
    #logisticsMode_tree li:last-child{
        border-bottom:none;
    }
    #logisticsMode_tableSetFaceSheetLayerId {
      overflow: visible;
    }
    #logisticsMode_searchCard .layui-card-body {
      z-index: 3000;
    }
    #logisticsMode_table__card .layui-card-header {
      position: sticky;
      top: 0;
      z-index: 2000;
      background: #fff;
    }

    /* #logisticsMode_newAddLayerId,
    #editLogisticsWayLayerId{
        overflow: visible;
    } */
</style>


<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card" id="logisticsMode_searchCard">
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
                                    <label class="layui-form-label">自动申跟踪号</label>
                                        <div class="layui-input-block">
                                            <select name="autoApplyTrackNum">
                                                <option value=""></option>
                                                <option value="1">是</option>
                                                <option value="0">否</option>
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
                                            <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="logisticsMode_submit">
                                            查询</span>
                                            <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" style="margin-left:2px;">清空</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-card" id="logisticsMode_table__card">
                <div class="layui-card-header">
                   <div class="fr">
                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="logisticsMode_syncLogiPlan">
                        SMT物流方案同步
                    </span>
                   <permTag:perm funcCode="logistics_copy">
                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="logisticsMode_copyCost">复制计费</span>
                   </permTag:perm>
                   <permTag:perm funcCode="edit_company_config_code">
                        <span class="layui-btn layui-btn-sm" id="logisticsMode_logisticCompany">
                            物流公司配置
                        </span>
                    </permTag:perm>
                    <permTag:perm funcCode="edit_company_type_config_code">
                        <span class="layui-btn layui-btn-sm layui-btn-warm" id="logisticsMode_logisticWay">
                            物流方式配置
                        </span>
                    </permTag:perm>
                    <div class="layui-form inline_block w150">
                        <select name="" id="" lay-filter="logisticsMode_downloadTpl_filter">
                            <option value="">模板下载</option>
                            <option value="logisticsChargeTmpTpl">计费模板</option>
                            <option value="maxWeightMaterialCoefficientTpl">修改上限重量模板</option>
                        </select>
                    </div>
                    <!-- <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" onclick="javascript: window.open('${ctx}/type/logisticsChargeTmpDownload')" style="margin-right: -7px;">计费模板下载</button> -->
                    <button class="layui-btn layui-btn-sm  layui-btn-normal" type="button" id="logisticsMode_importCost">导入计费</button>
                    <button class="layui-btn layui-btn-sm  layui-btn-normal" type="button" id="logisticsMode_importChargingPartProperty">修改上限重量</button>
                    <button class="layui-btn layui-btn-sm layui-btn-danger" type="button" id="logisticsMode_newAdd"  style="margin-left: 1px;">新增</button>
                   </div>
                </div>
                <div class="layui-card-body" >
                    <div class="layui-row">
                        <div class="layui-col-lg2 layui-col-md2" style="padding-top:12px;">
                            <ul class="layui-nav layui-nav-tree" id="logisticsMode_tree" style="width:230px;">
                            </ul>
                        </div>
                        <div class="layui-col-lg10 layui-col-md10" >
                           <table class="layui-table" id="logisticsMode_table"  lay-filter="logisticsMode_tableFilter"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<%-- 物流公司配置 --%>
<script type="text/html" id="logisticsMode_logisticCompanyLayer">
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
                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="logisticsMode_logisticCompany_add">
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
                        <tbody id="logisticsMode_logisticCompany_tbody">

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</script>
<%-- 物流方式配置 --%>
<script type="text/html" id="logisticsMode_logisticWayLayer">
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
                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="logisticsMode_logisticWay_add">
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
                        <tbody id="logisticsMode_logisticWay_tbody">

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</script>
<%-- 新增物流方式 --%>
<script type="text/html" id="logisticsMode_newAddLayer">
    <div class="p20">
        <div class="lms-splitline">全局参数</div>
        <div class="layui-form">
            <label class="layui-form-label"><font color="red">*</font>物流公司</label>
            <div class="layui-input-block">
                <select name="companyName" lay-search lay-filter="logisticsMode_newAdd_sel"></select>
            </div>
        </div>
        <form class="layui-form" id="logisticsMode_newAddLayerForm">
        </form>
    </div>
</script>
<script type="text/html" id="logisticsMode_newAddLayerFormTpl">
    <div class="layui-form-item">
        <label class="layui-form-label"><font color="red">*</font>物流方式</label>
        <div class="layui-input-block">
            <input class="layui-input" type="text" name="name" lay-verify="required"/>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">货代公司</label>
        <div class="layui-input-block">
            <select class="layui-input" name="goodsAgent" id="goodsAgent"></select>
        </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12">
        <label class="layui-form-label">普源别名</label>
        <div class="layui-input-block">
            <input type="text" class="layui-input" name="shopElfTypeName">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">折扣率</label>
        <div class="layui-input-block">
            <input class="layui-input" type="number" name="discountRate" value="1"/>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">自动申跟踪号</label>
        <div class="layui-input-block">
            <select name="autoApplyTrackNum">
                <option value="true">是</option>
                <option value="false">否</option>
                <option value="2">仅限已占用库存订单</option>
            </select>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">标记发货取值</label>
        <div class="layui-input-block">
            <select name="markShippingValue">
                <option value="true" selected>跟踪号</option>
                <option value="false">中间单号</option>
            </select>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label"><font color="red">*</font>面单尺寸</label>
        <div class="layui-input-block">
            <select name="labelSize">
                <option value="100*100">100*100</option>
                <option value="100*150">100*150</option>
            </select>
        </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">自动裁剪</label>
      <div class="layui-input-block">
          <select name="autoShrink">
              <option value="false">否</option>
              <option value="true">是</option>
          </select>
      </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">上传税号</label>
        <div class="layui-input-block">
            <div class="layui-col-lg10 layui-col-md10">
                <select name="ifUseTaxNumber">
                    <option value="true">是</option>
                    <option value="false" selected>否</option>
                </select>
            </div>
            <div class="layui-col-lg2 layui-col-md2" style="line-height: 32px;padding-left: 10px;">
                <font color="#f00">已弃用</font>
            </div>
        </div>
        <label class="layui-form-label">税费上限($)</label>
        <div class="layui-input-block">
            <input class="layui-input" type="number" name="maxCustomsPrice"/>
        </div>
        <label class="layui-form-label">税费下限($)</label>
        <div class="layui-input-block">
            <input class="layui-input" type="number" name="minCustomsPrice"/>
        </div>
    </div>
<%--    <div class="layui-form-item">--%>
<%--        <label class="layui-form-label">包裹最大重量(g)</label>--%>
<%--        <div class="layui-input-block">--%>
<%--            <input class="layui-input" type="number" name="packageMaxWeight"/>--%>
<%--        </div>--%>
<%--    </div>--%>
    <div class="layui-form-item">
        <label class="layui-form-label">wish发货国家/地区</label>
        <div class="layui-input-block">
            <input class="layui-input" type="text" name="wishCountryCode" value="CN" />
        </div>
    </div>
    <div class="layui-col-lg12 layui-col-md12">
      <label class="layui-form-label">币种</label>
      <div class="layui-input-block">
          <select name="currency">
          {{# if(d.currencyLists){ }}
              {{#  layui.each(d.currencyLists, function(index, item){ }}
                <option value="{{item.srcCyCode}}">{{item.srcCyName}}</option>
              {{# }) }}
          {{# } }}
          </select>
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
                <input class="layui-input" type="number" name="materialCoefficient" value="{{d.materialCoefficient}}"/>
            </div>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">体积拦截</label>
        <div class="layui-input-block">
            <select name="volumeIntercept" lay-filter="volumeIntercept_filter">
                <option value="true">是</option>
                <option value="false" selected>否</option>
            </select>
        </div>
    </div>
    <div class="logisticsVolumeInfo_show disN">
        <div class="layui-form-item">
            <label class="layui-form-label"><font class="fRed">*</font>任意边长cm≥</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="eitherSideLength"/>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><font class="fRed">*</font>长+宽+高cm≥</label>
            <div class="layui-input-block">
                <input class="layui-input" type="number" name="lengthWidthHeightSum"/>
            </div>
        </div>
    </div>
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
    <div class="lms-splitline" style="margin-top:20px;">物流参数</div>
    {{# if(d.data){ }}
    {{#  layui.each(d.data, function(index, item){ }}
    <div class="layui-form-item logisticsMode_newAddLayerFormAuto layui-row">
        <div class="layui-col-md12">
            <div class="layui-col-md8">
                <input type="hidden" value="{{item.id}}">
                <input type="hidden" value="{{item.logisticsCompanyId|| '' }}">
                <label class="layui-form-label">
                    <font color="red" class="{{item.required == 'Y'? '': 'disN'}}">*</font>
                    <span class="labelContent">{{item.fieldDesc}}</span>
                </label>
                <div class="layui-input-block">
                    {{# if(item.required == 'Y'){ }}
                        {{# if(item.fieldName == 'warehouseCarrierService'){ }}
                        <select data-name="{{item.fieldName}}" lay-search class="markAutoRender">
                            {{#  layui.each(d.smtLogisticsWarehouseArr, function(smtLogisIndex, smtLogisItem){ }}
                                <option value="{{smtLogisItem.value}}">{{smtLogisItem.name}}</option>
                            {{# }) }}
                        </select>
                        {{# }else if(item.fieldName == 'insurance'){ }}
                        <select data-name="{{item.fieldName}}" lay-search class="markAutoRender" lay-filter="insuranceFilter">
                          {{# if(item.fieldValue == '是'){ }}
                          <option value="是" selected>是</option>
                          <option value="否">否</option>
                          {{# }else{ }}
                          <option value="是">是</option>
                          <option value="否" selected>否</option>
                          {{# } }}
                        </select>
                        {{# }else if(item.fieldName == 'packPrintProdLabel'){ }}
                        <select data-name="{{item.fieldName}}" lay-search class="markAutoRender">
                          {{#  layui.each(d.packPrintProdLabelListArr, function(labelIndex, labelItem){ }}
                              <option value="{{labelItem.value}}">{{labelItem.name}}</option>
                          {{# }) }}
                        </select>
                        {{# }else{ }}
                        <input type="text" class="layui-input markAutoRender" data-name="{{item.fieldName}}" value="{{item.fieldValue || ''}}" lay-verify="required">
                        {{# } }}   
                    {{# }else{  }}
                        {{# if(item.fieldName !='isAgreeUpgradeReverseParcelInsure'){ }}
                        <input type="text" class="layui-input markAutoRender" data-name="{{item.fieldName}}" value="{{item.fieldValue}}">
                        {{# }else{ }}
                        <select data-name="{{item.fieldName}}" lay-search class="markAutoRender">
                          {{# if(item.fieldValue == '是'){ }}
                          <option value="否">否</option>
                          <option value="是" selected>是</option>
                          {{# }else{ }}
                          <option value="否" selected>否</option>
                          <option value="是">是</option>
                          {{# } }}
                        </select>
                        {{# } }}
                    {{# } }}

                </div>
            </div>
            <div class="layui-col-md4" style="padding-left:10px;line-height: 32px;">
                <span> {{item.remark || '' }} </span>
            </div>
        </div>
    </div>
    {{#  }) }}
    {{# } }}
    <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="logisticsMode_newAddLayerForm_submit">查询</span>
</script>
<%-- 物流商模板 --%>
<script id="logisticsMode_provider" type="text/html">
    <li class="layui-nav-item layui-this" style="text-align: center;"><a href="javascript:;"  data-logistics="">全部物流商</a></li>
    {{#  layui.each(d.data, function(index, item){ }}
        <li class="layui-nav-item">
            <a href="javascript:;"  data-logistics="{{item.id}}">{{item.cnName}}</a>
            <permTag:perm funcCode="logisticsMode_config_logistics">
                <span class="layui-btn layui-btn-sm set" style="position:absolute;right:60px;top:7px;font-size:10px;background: #5fb878;" data-provider="{{item.id}}">设置</span>
            </permTag:perm>
           <span class="layui-btn layui-btn-sm seq" style="position:absolute;right:8px;top:7px;font-size:10px"
           data-seq="{{item.seq}}" data-provider="{{item.id}}">排序</span>
        </li>
    {{#  }); }}
</script>
<%-- 物流公司配置 --%>
<script type="text/html" id="logisticsCompanyLayer">
   <div class="p20">
      <form class="layui-form" id="logisticsCompanyLayerForm">

      </form>
   </div>
</script>
<script type="text/html" id="logisticsCompanyLayerFormTpl">
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
        {{# if(d.logisticsProvidersName== '橙联'){  }}
        <div class="layui-form-item">
          <div class="layui-input-block">
            <span class="layui-btn layui-btn-sm refresh-token">刷新token</span>
          </div>
      </div>
        {{# } }}
    {{# } }}
    <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="logisticsCompanyLayerForm_submit">查询</span>
</script>
<%-- 物流公司排序 --%>
<script type="text/html" id="logisticsCompany_seq">
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
<script type="text/html" id="logisticsMode_tableStatus">
    <div class="layui-form">
        {{# if(d.status){ }}
           <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" checked lay-filter="logisticsMode_tableStatus{{d.id}}">
        {{# }else{ }}
           <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" lay-filter="logisticsMode_tableStatus{{d.id}}">
        {{# } }}
    </div>
</script>
<script type="text/html" id="logisticsMode_tableAuto">
    <div>
        {{# if(d.autoApplyTrackNum){ }}
           是
        {{# }else{ }}
           否
        {{# } }}
    </div>
</script>

<%-- 面单上传/下载/预览 --%>
<script type="text/html" id="logisticsMode_expressBill">
    <a class="layui-btn layui-btn-xs layui-btn-warm" id="logisticsMode_billPreview{{d.id}}">模板预览</a><br/>
    <a class="layui-btn layui-btn-xs" id="logisticsMode_billDown{{d.id}}">模板下载</a><br/>
    <a class="layui-btn layui-btn-xs  layui-btn-normal" id="logisticsMode_billUpload{{d.id}}">模板上传</a>
</script>

<%-- 物流方式+普源名 --%>
<script type="text/html" id="logisticsMode_nameAndshopElfTypeName">
  <div>
     <p>{{d.name}}({{d.id}})</p>
     <p style="color: #ccc;">普源: {{d.shopElfTypeName}}</p>
  </div>
</script>


<%-- 表格服务代码 --%>
<script type="text/html" id="logisticsMode_tableCode">
    {{# if(d.params){ }}
        <div style="text-align: left;">
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
<script type="text/html" id="logisticsMode_tableIdBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑详情</a>
  <a class="layui-btn layui-btn-xs" lay-event="carries" style="width:58px;text-align:center;margin-left:3px;">承运商</a><br>
  <a class="layui-btn layui-btn-xs" lay-event="billing">物流费用</a>
  <a class="layui-btn layui-btn-xs" lay-event="watermark" style="margin-left:3px;">面单水印</a><br>
  <a class="layui-btn layui-btn-xs" lay-event="import">导入面单</a>
  <input type="file" class="disN" accept="application/pdf">
  <permTag:perm funcCode="logisticsMode_printSetting_btn">
      <a class="layui-btn layui-btn-xs" lay-event="set">面单设置</a>
  </permTag:perm>
  <%-- 只是占位,没有其他作用 --%>
  <a class="layui-btn layui-btn-xs" lay-event="seizeSeat" style="margin-left:3px;opacity:0;">占位占位</a> 
</script>

<!-- 表格---设置物流面单 -->
<script type="text/html" id="logisticsMode_tableSetFaceSheetLayer">
  <div class="layui-form" style="padding:20px;">
    <div class="layui-form-item">
      <div class="layui-form-label">面单类型</div>
      <div class="layui-input-block">
        <input type="radio" name="facesheetType" value="0" title="官方面单" class="facesheetType1" lay-filter="facesheetTypeFilter">
        <input type="radio" name="facesheetType" value="1" title="自定义面单" class="facesheetType2" lay-filter="facesheetTypeFilter">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-form-label">面单模板</div>
      <div class="layui-input-block">
        <select name="printTemplateId" id="FaceSheetLayer_printTemplateId">
          <option value="1">你好</option>
        </select>
      </div>
    </div>
  </div>
</script>

<script type="text/html" id="regionalPriceTableBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
  <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>
</script>
<%-- 设置物流参数弹框 --%>
<script type="text/html" id="logisticsMode_set_layer">
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
<script type="text/html" id="editLogisticsWay">
   <div class="p20">
      <form class="layui-form" id="editLogisticsWayForm">
        <div class="layui-form-item">
            <div class="layui-row" id="editLogisticsWayFormDiv">
            </div>
        </div>
      </form>
   </div>
</script>
<script type="text/html" id="editLogisticsWayFormTemplate">
        <div class="lms-splitline">全局参数</div>
        <div class="layui-col-lg12 layui-col-md12"  title="只读,不可修改">
            <label class="layui-form-label">物流公司</label>
            <div class="layui-input-block">
                <input type="text" class="layui-input" value="{{d.companyName}}" readonly>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12"  title="只读,不可修改">
            <label class="layui-form-label">货代公司</label>
            <div class="layui-input-block">
                <select id="editAgent" name="agent"></select>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label"><font color="red">*</font>物流方式名称</label>
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
                    {{# if(d.autoApplyTrackNum == true && d.limitHasHoldStock==false){  }}
                        <option value="true" selected>是</option>
                        <option value="false">否</option>
                        <option value="2">仅限已占用库存订单</option>
                    {{# }else if(d.autoApplyTrackNum == false){  }}
                        <option value="true">是</option>
                        <option value="false" selected>否</option>
                        <option value="2">仅限已占用库存订单</option>
                    {{# }else if(d.autoApplyTrackNum == true && d.limitHasHoldStock==true){ }}
                        <option value="true">是</option>
                        <option value="false">否</option>
                        <option value="2" selected>仅限已占用库存订单</option>
                    {{# } }}
                </select>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">标记发货取值</label>
            <div class="layui-input-block">
                <select name="markShippingValue">
                    {{# if(d.markShippingValue){ }}
                    <option value="true" selected>跟踪号</option>
                    <option value="false">中间单号</option>
                    {{# }else{  }}
                    <option value="true">跟踪号</option>
                    <option value="false" selected>中间单号</option>
                    {{# } }}
                </select>
            </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label"><font color="red">*</font>面单尺寸</label>
            <div class="layui-input-block">
                <select name="labelSize">
                    {{# if(d.labelSize == '100*100'){  }}
                    <option value="100*100" selected>100*100</option>
                    <option value="100*150">100*150</option>
                    {{# }else{  }}
                    <option value="100*100">100*100</option>
                    <option value="100*150" selected>100*150</option>
                    {{# } }}
                </select>
            </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">自动裁剪</label>
          <div class="layui-input-block">
              <select name="autoShrink">
                {{# if(d.autoShrink == true){  }}
                  <option value="false">否</option>
                  <option value="true" selected>是</option>
                {{# }else{ }}
                <option value="false" selected>否</option>
                <option value="true">是</option>
                {{# } }}
              </select>
          </div>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">上传税号</label>
            <div class="layui-input-block">
                <div class="layui-col-lg10 layui-col-md10">
                    <select name="ifUseTaxNumber">
                        {{# if(d.ifUseTaxNumber){ }}
                        <option value="true" selected>是</option>
                        <option value="false">否</option>
                        {{# }else{  }}
                        <option value="true">是</option>
                        <option value="false" selected>否</option>
                        {{# } }}
                    </select>
                </div>
                <div class="layui-col-lg2 layui-col-md2" style="line-height: 32px;padding-left: 10px;">
                    <font color="#f00">已弃用</font>
                </div>
            </div>
            <label class="layui-form-label">税费上限($)</label>
            <div class="layui-input-block ">
                <div class="layui-col-lg10 layui-col-md10">
                    <input class="layui-input" type="text" name="maxCustomsPrice" value="{{d.maxCustomsPrice||d.maxCustomsPrice==0?d.maxCustomsPrice:''}}"/>
                </div>
                <div class="layui-col-lg2 layui-col-md2" style="line-height: 32px;padding-left: 10px;">
                    <span style="color:red;">税费上限针对总申报价</span>
                </div>
            </div>
            <label class="layui-form-label">税费下限($)</label>
            <div class="layui-input-block">
                <div class="layui-col-lg10 layui-col-md10">
                    <input class="layui-input" type="text" name="minCustomsPrice" value="{{d.minCustomsPrice||d.minCustomsPrice==0?d.minCustomsPrice:''}}"/>
                </div>
                <div class="layui-col-lg2 layui-col-md2" style="line-height: 32px;padding-left: 10px;">
                    <span style="color:red;">税费下限针对总申报价</span>
                </div>
            </div>
        </div>
<%--        <div class="layui-col-lg12 layui-col-md12">--%>
<%--            <label class="layui-form-label">包裹最大重量(g)</label>--%>
<%--            <div class="layui-input-block">--%>
<%--                <input class="layui-input" type="number" name="packageMaxWeight" value="{{d.packageMaxWeight}}"/>--%>
<%--            </div>--%>
<%--        </div>--%>
        <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">wish发货国家/地区</label>
            <div class="layui-input-block">
                <input class="layui-input" type="text" name="wishCountryCode" value="{{d.wishCountryCode}}"/>
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
                    <input class="layui-input" type="number" name="weightProportion" onkeypress="commonKeyPressInputFloat(event)" value="{{d.weightProportion}}"/>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>材积系数</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="materialCoefficient" value="{{d.materialCoefficient}}"/>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">体积拦截</label>
            <div class="layui-input-block">
                <select name="volumeIntercept"  lay-filter="volumeIntercept_filter">
                    {{# if(d.volumeIntercept){  }}
                    <option value="true" selected>是</option>
                    <option value="false">否</option>
                    {{# }else{  }}
                    <option value="true">是</option>
                    <option value="false" selected>否</option>
                    {{# } }}
                </select>
            </div>
        </div>
        {{# if(d.volumeIntercept){  }}
        <div class="logisticsVolumeInfo_show">
        {{# }else{  }}
        <div class="logisticsVolumeInfo_show  disN">
            {{# } }}
            <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>任意边长cm≥</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="eitherSideLength" value="{{d.eitherSideLength}}"/>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>长+宽+高cm≥</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="lengthWidthHeightSum" value="{{d.lengthWidthHeightSum}}"/>
                </div>
            </div>
        </div>
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
        <div class="lms-splitline" style="margin-top:20px;">物流参数</div>
        {{# if(d.params){ }}
        {{#  layui.each(JSON.parse(d.params), function(index, item){ }}
            <div class="layui-col-lg12 layui-col-md12 logisticsModeAuto" style="line-height:36px;">
                <div class="layui-col-lg8 layui-col-md8">
                    <label class="layui-form-label">
                        <font color="red" class="{{item.required == 'Y'? '': 'disN'}}">*</font>
                        <span class="labelContent">{{item.fieldDesc}}</span>
                    </label>
                    <div class="layui-input-block">
                       {{# if(item.required == 'Y'){ }}
                            {{# if(item.fieldName == 'warehouseCarrierService'){ }}
                            <select data-name="{{item.fieldName}}" lay-search class="markAutoRender">
                                {{#  layui.each(d.smtLogisticsWarehouseArr, function(smtLogisIndex, smtLogisItem){ }}
                                    {{# if(item.fieldValue == smtLogisItem.value){ }}
                                    <option value="{{smtLogisItem.value}}" selected>{{smtLogisItem.name}}</option>
                                    {{# }else{ }}
                                    <option value="{{smtLogisItem.value}}">{{smtLogisItem.name}}</option>
                                    {{# } }}
                                {{# }) }}
                            </select>
                            {{# }else if(item.fieldName == 'insurance'){ }}
                            <select data-name="{{item.fieldName}}" lay-search class="markAutoRender" lay-filter="insuranceFilter">
                              {{# if(item.fieldValue == '是'){ }}
                              <option value="是" selected>是</option>
                              <option value="否">否</option>
                              {{# }else{ }}
                              <option value="是">是</option>
                              <option value="否" selected>否</option>
                              {{# } }}
                            </select>
                            {{# }else if(item.fieldName == 'packPrintProdLabel'){ }}
                            <select data-name="{{item.fieldName}}" lay-search class="markAutoRender">
                              {{#  layui.each(d.packPrintProdLabelListArr, function(labelIndex, labelItem){ }}
                                {{# if(item.fieldValue == labelItem.value){ }}
                                <option value="{{labelItem.value}}" selected>{{labelItem.name}}</option>
                                {{# }else{ }}
                                <option value="{{labelItem.value}}">{{labelItem.name}}</option>
                                {{# } }}
                              {{# }) }}
                            </select>
                            {{# }else{ }}
                            <input type="text" class="layui-input markAutoRender" data-name="{{item.fieldName}}" value="{{item.fieldValue || ''}}" lay-verify="required">
                            {{# } }}
                        {{# }else{  }}
                            {{# if(item.fieldName !='isAgreeUpgradeReverseParcelInsure'){ }}
                            {{# if(item.fieldName=='pdfSize'){ }}
                                <select data-name="{{item.fieldName}}" lay-search class="markAutoRender">
                                    {{#  layui.each(d.logisticsLabelArr, function(labelIndex, labelItem){ }}
                                      {{# if(item.fieldValue == labelItem.value){ }}
                                      <option value="{{labelItem.value}}" selected>{{labelItem.name}}</option>
                                      {{# }else{ }}
                                      <option value="{{labelItem.value}}">{{labelItem.name}}</option>
                                      {{# } }}
                                    {{# }) }}
                                </select>
                            {{# }else{ }}
                                <input type="text" class="layui-input markAutoRender" data-name="{{item.fieldName}}" value="{{item.fieldValue}}">
                            {{# } }}
                            {{# }else{ }}
                            <select data-name="{{item.fieldName}}" lay-search class="markAutoRender">
                              {{# if(item.fieldValue == '是'){ }}
                              <option value="否">否</option>
                              <option value="是" selected>是</option>
                              {{# }else{ }}
                              <option value="否" selected>否</option>
                              <option value="是">是</option>
                              {{# } }}
                            </select>
                            {{# } }}
                        {{# } }}
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-md4">
                  <span> {{item.remark || '' }} </span>
                </div>
            </div>
        {{#  }) }}
        {{# } }}

        <div class="layui-col-lg12 layui-col-md12 disN">
            <span class="layui-btn layui-btn-sm"  lay-submit lay-filter="editLogisticsWayForm_submit">查询</span>
        </div>
</script>

<%-- 承运商信息 --%>
<script type="text/html" id="carriersLogistics">
    <div style="padding:20px">
        <span class="layui-badge">注意:承运商为空,上传跟踪号无效</span>
        <table class="layui-table">
        <colgroup>
        <col width="150">
        <col width="150">
<%--        <col width="200">--%>
        </colgroup>
        <thead>
            <tr>
                <th>平台</th>
                <th>承运商名称</th>
            </tr>
        </thead>
        <tbody id="carriersLogisticsTbody">

        </tbody>
    </table>
    </div>
</script>
<%-- 承运商模板 --%>
<script type="text/html" id="carriersLogisticsTbodyTpl">
    {{#  layui.each(d.data, function(index, item){ }}
        <tr>
            <td  hidden><input type="hidden" value="{{item.id|| ''}}"></td>
            <td  hidden><input type="hidden" value="{{item.logisticsTypeId}}"></td>
            <td>{{ item.platCode }}</td>
            <td width="200">
               <input type="text" class="layui-input" value="{{ item.logisticsProviderName || ''}}">
            </td>
<%--            <td>--%>
<%--            {{#  if(item.isNeedSyncTrackingNo){ }}--%>
<%--            <input type="checkbox" checked>--%>
<%--            {{#  }else{  }}--%>
<%--            <input type="checkbox">--%>
<%--            {{# }  }}--%>
<%--            </td>--%>
        </tr>
    {{# }); }}
</script>
<%-- DHL区域计费 --%>
<script type="text/html" id="regionalPrice">
    <div style="padding:20px;">
        <div class="layui-form layui-row">
           <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-col-lg6 layui-col-md6">
                    <div class="layui-col-lg8 layui-col-md8">
                        <input type="text" class="layui-input" id="regionalPriceInput" placeholder="多个国家/地区用逗号分隔">
                    </div>
                    <div class="layui-col-md4 layui-col-lg4" style="padding-left:5px;">
                        <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="regionalPriceTableSearch">查询</button>
                        <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="regionalPriceTableEmpty">清空</button>
                    </div>
                </div>
                <div style="position:absolute;right:3px;overflow:hidden;">
                    <button class="layui-btn layui-btn-sm layui-btn-danger" type="button" id="batchDHLPrice" style="margin-left:-1px;">批量删除</button>
                    <span class="layui-btn layui-btn-sm" id="exportCostInfo">导出计费</span>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="areaDHLPriceCodeMapping">邮编区间映射</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="regionalPrice_areaZipCodeMapping">邮编号映射</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="areaCityCodeMapping" style="margin-left:-1px;">城市映射</button>
                    <button class="layui-btn layui-btn-sm"  type="button" onclick="javascript: window.open('${ctx}/areaZipCodeRelation/download.html')" style="margin-left:-1px;">区域映射模板</button>
                    <button class="layui-btn layui-btn-sm"  type="button" id="areaZipCodeRelationTempImport">区域映射上传</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" id="addNewDHLPrice" style="margin-left:-1px;">添加</button>
                </div>
           </div>
        </div>
        <table class="layui-table" id="regionalPriceTable"   lay-filter="regionalPriceTableFilter"></table>
    </div>
</script>
<%-- DHL区域计费编辑弹框 --%>
<script type="text/html" id="regionalPriceEdit">
    <div class="p20">
        <form class="layui-form" id="regionalPriceEditForm">
        </form>
    </div>
</script>
<%-- 区域编辑/添加 计费弹框模板 --%>
<script type="text/html" id="regionalPriceEditFormTpl">
        {{# if(d.id){ }}
        <input type="hidden" name="id" value="{{d.id}}">
        {{# } }}
        <div class="layui-form-item">
            <label class="layui-form-label"><font color="red">*</font>国家/地区</label>
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
            <span class="layui-btn layui-btn-sm disN"  lay-submit lay-filter="regionalPriceEditForm_submit">查询</span>
</script>

<%-- 面单加水印弹框 --%>
<script type="text/html" id="logisticsMode_watermark">
 <div class="p20" id="logisticsMode_watermark_content">
 </div>
</script>
<%-- 面单加水印弹框模板 --%>
<script type="text/html" id="logisticsMode_watermark_contentTpl">
    <div class="watermark_left_config p20">
        <form class="layui-form">
            <div class="layui-form-item">
                <div class="layui-form-label">物流方式</div>
                <div class="layui-input-block">
                    <input class="layui-input logisticsMode_watermark_way" value="{{d.name}}" disabled>
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
                {{# if(d.pickNumber.selected){  }}
                    <input type="checkbox"  title="分拣码(固定加粗+大括号)" lay-skin="primary" name="watermark_pickNumberFont_checkbox" checked>
                {{# }else{  }}
                   <input type="checkbox"  title="分拣码(固定加粗+大括号)" lay-skin="primary" name="watermark_pickNumberFont_checkbox">
                {{# } }}
                </div>
            </div>
            {{# if(d.pickNumber.selected){  }}
            <div class="layui-form-item">
                <div class="layui-form-label">输入分拣码</div>
                <div class="layui-input-block">
                   <input type="text" class="layui-input" name="watermark_pickNumberFont_input" value="{{d.pickNumber.value}}">
                </div>
            </div>
            {{# }else{  }}
            <div class="layui-form-item disN">
                <div class="layui-form-label">输入分拣码</div>
                <div class="layui-input-block">
                   <input type="text" class="layui-input" name="watermark_pickNumberFont_input"  value="{{d.pickNumber.value}}">
                </div>
            </div>
            {{# } }}
            <div class="layui-form-item">
                <div class="layui-form-label">字号</div>
                <div class="layui-input-block">
                   <select name="watermark_pickNumberFont_select">
                   {{# if(d.fontSizeArr){ }}
                   {{#  layui.each(d.fontSizeArr, function(index, item){ }}
                       {{# if(d.pickNumber.fontSize == item.size){  }}
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
                {{# if(d.skuInfoNumberEnName.selected){ }}
                <input type="checkbox" title="SKU信息" lay-skin="primary" name="watermark_date_name_orderFont_skuInfoNumberEnName_checkbox" checked>
                {{# }else{ }}
                 <input type="checkbox" title="SKU信息" lay-skin="primary" name="watermark_date_name_orderFont_skuInfoNumberEnName_checkbox">
                {{# } }}
                {{# if(d.countryName.selected){ }}
                <input type="checkbox" title="国家/地区信息" lay-skin="primary" name="watermark_date_name_orderFont_countryName_checkbox" checked>
                {{# }else{ }}
                 <input type="checkbox" title="国家/地区信息" lay-skin="primary" name="watermark_date_name_orderFont_countryName_checkbox">
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
            {{# if(d.storeNameSub.selected){  }}
            <div class="layui-form-item" title="截取店铺名称第1个-之前的内容">
              <div class="layui-form-label">名称截取</div>
              <div class="layui-input-block" style="display: flex;">
                <input type="checkbox" title="店铺名称截取" lay-skin="primary" name="watermark_storeNameSubFont_checkbox" checked>
                <input type="checkbox" title="加粗" lay-skin="primary" name="storeNameSubFont_isBold" {{d.storeNameSub.bold ? 'checked': ''}}>
              </div>
            </div>
            {{# }else{  }}
            <div class="layui-form-item" title="截取店铺名称第1个-之前的内容">
              <div class="layui-form-label">名称截取</div>
              <div class="layui-input-block" style="display: flex;">
                <input type="checkbox" title="店铺名称截取" lay-skin="primary" name="watermark_storeNameSubFont_checkbox">
                <input type="checkbox" title="加粗" lay-skin="primary" name="storeNameSubFont_isBold" {{d.storeNameSub.bold ? 'checked': ''}}>
              </div>
            </div>
            {{# } }}
            <div class="layui-form-item">
              <div class="layui-form-label">字号</div>
              <div class="layui-input-block">
                 <select name="watermark_storeNameSubFont_select">
                 {{# if(d.fontSizeArr){ }}
                 {{#  layui.each(d.fontSizeArr, function(index, item){ }}
                     {{# if(d.storeNameSub.fontSize == item.size){  }}
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
                <div class="layui-input-block">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="syncLastNewSheetBtn">同步最新面单</span>
                </div>
            </div>
        </form>
        <div class="layui-card">
            <div class="layui-card-header">各数值对应的参数如下(虚拟值,用来位置预览)</div>
            <div class="layui-card-body">
                <div style="color:#ec2c64;font-size: 16px;">箱号: 100</div>
                <div style="color:#e8b004;font-size: 16px;">分拣码:输入值</div>
                <div style="color:#fc7930;font-size: 16px;">SKU信息: HADB8881-1*1</div>
                <div style="color:#41ae3c;font-size: 16px;">打印时间: 10-25 13:20:00</div>
                <div style="color:#41ae3c;font-size: 16px;">店铺名称: lazada0190</div>
                <div style="color:#41ae3c;font-size: 16px;">订单编号: 2747103</div>
                <div style="color:#1e9fff;font-size: 16px;">店铺名称截取: AAAA-家居01</div>
            </div>
        </div>
    </div>
    <div class="watermark_right_show">
        <div id="watermark_containerBox">
            <%-- SKU信息容器 --%>
            {{# if(d.skuInfoNumberEnName.selected){  }}
            <div id="watermark_skuInfoNumberEnNameFont" class="watermark_skuInfoNumberEnNameFontContainer watermark_date_name_orderFont_skuInfoNumberEnName">
                <span style="font-size:{{d.skuInfoNumberEnName.fontSize}}px;color:#fc7930;">HADB8881-1*1</span>
            </div>
            {{# }else{  }}
            <div id="watermark_skuInfoNumberEnNameFont" class="watermark_skuInfoNumberEnNameFontContainer watermark_date_name_orderFont_skuInfoNumberEnName disN">
                <span style="font-size:{{d.skuInfoNumberEnName.fontSize}}px;color:#fc7930;">HADB8881-1*1</span>
            </div>
            {{# } }}
            <%-- 记录SKU信息容器的坐标 --%>
            <input type="hidden" id="watermark_skuInfoNumberEnNameFontLocation" value='{{JSON.stringify(d.skuInfoNumberEnName.location)}}'>

            <%-- 国家容器 --%>
            <%-- {{# if(d.countryName.selected){  }}
            <div id="watermark_countryNameFont" class="watermark_countryNameFontContainer watermark_date_name_orderFont_countryName">
                <span style="font-size:{{d.countryName.fontSize}}px;color:#f00;" class="">国家信息</span>
            </div>
            {{# }else{  }}
            <div id="watermark_countryNameFont" class="watermark_countryNameFontContainer disN watermark_date_name_orderFont_countryName">
                <span style="font-size:{{d.countryName.fontSize}}px;color:#f00;">国家信息</span>
            </div>
            {{# } }} --%>
            <%-- 记录国家容器的坐标 --%>
            <%-- <input type="hidden" id="watermark_countryNameFontLocation" value='{{JSON.stringify(d.countryName.location)}}'> --%>

            <%-- 箱号容器 --%>
            {{# if(d.boxNumber.selected){  }}
            <div id="watermark_boxNumberFont" class="watermark_boxNumberFontContainer">
                <span style="font-size:{{d.boxNumber.fontSize}}px;color:#ec2c64;">100</span>
            </div>
            {{# }else{  }}
            <div id="watermark_boxNumberFont" class="watermark_boxNumberFontContainer disN">
                <span style="font-size:{{d.boxNumber.fontSize}}px;color:#ec2c64;">100</span>
            </div>
            {{# } }}
            <%-- 记录箱号容器的坐标 --%>
            <input type="hidden" id="watermark_boxNumberFontLocation" value='{{JSON.stringify(d.boxNumber.location)}}'>

            <%-- 分拣码容器 --%>
            {{# if(d.pickNumber.selected){  }}
            <div id="watermark_pickNumberFont" class="watermark_pickNumberFontContainer">
                <span style="font-size:{{d.pickNumber.fontSize}}px;color:#e8b004;">
                    {{d.pickNumber.value}}
                    {{# if(d.countryName.selected){  }}
                    <span class="watermark_date_name_orderFont_countryName">国家/地区信息</span>
                    {{# }else{  }}
                    <span class="watermark_date_name_orderFont_countryName disN">国家/地区信息</span>
                    {{# } }}
                </span>
            </div>
            {{# }else{  }}
            <div id="watermark_pickNumberFont" class="watermark_pickNumberFontContainer disN">
                <span style="font-size:{{d.pickNumber.fontSize}}px;color:#e8b004;">{{d.pickNumber.value}}</span>
            </div>
            {{# } }}
            <%-- 记录分拣码容器的坐标 --%>
            <input type="hidden" id="watermark_pickNumberFontLocation" value='{{JSON.stringify(d.pickNumber.location)}}'>
            <%-- 店铺截取容器 --%>
            {{# if(d.storeNameSub.selected){  }}
            <div id="watermark_storeNameSubFont" class="watermark_storeNameSubFontContainer">
                <span style="font-size:{{d.storeNameSub.fontSize}}px;color:#1e9fff;font-weight: {{d.storeNameSub.bold ? 900: 500}}">AAAA</span>
            </div>
            {{# }else{  }}
            <div id="watermark_storeNameSubFont" class="watermark_storeNameSubFontContainer disN">
                <span style="font-size:{{d.storeNameSub.fontSize}}px;color:#1e9fff;font-weight: {{d.storeNameSub.bold ? 900: 500}}">AAAA</span>
            </div>
            {{# } }}
            <%-- 记录店铺截取容器的坐标 --%>
            <input type="hidden" id="watermark_storeNameSubFontLocation" value='{{JSON.stringify(d.storeNameSub.location)}}'>
            <%-- 打印时间-店铺名称-订单编号容器 --%>
            {{# if(!d.printDate.selected && !d.storeName.selected && !d.orderNumber.selected){  }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px;color:#41ae3c;">
                       <span class="watermark_date_name_orderFont_printDate disN">[10-25 13:20:00]</span>
                       <span class="watermark_date_name_orderFont_storeName disN">[lazada0190]</span>
                       <span class="watermark_date_name_orderFont_orderNumber disN">[2747103]</span>
                    </span>
                </div>
            {{# }else if(d.printDate.selected && !d.storeName.selected && !d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px;color:#41ae3c;">
                       <span class="watermark_date_name_orderFont_printDate">[10-25 13:20:00]</span>
                       <span class="watermark_date_name_orderFont_storeName disN">[lazada0190]</span>
                       <span class="watermark_date_name_orderFont_orderNumber disN">[2747103]</span>
                    </span>
                </div>
            {{# }else if(!d.printDate.selected && d.storeName.selected && !d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px;color:#41ae3c;">
                     <span class="watermark_date_name_orderFont_storeName">[lazada0190]</span>
                     <span class="watermark_date_name_orderFont_printDate disN">[10-25 13:20:00]</span>
                     <span class="watermark_date_name_orderFont_orderNumber disN">[2747103]</span>
                    </span>
                </div>
            {{# }else if(!d.printDate.selected && !d.storeName.selected && d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px;color:#41ae3c;">
                      <span class="watermark_date_name_orderFont_orderNumber">[2747103]</span>
                      <span class="watermark_date_name_orderFont_storeName disN">[lazada0190]</span>
                      <span class="watermark_date_name_orderFont_printDate disN">[10-25 13:20:00]</span>
                    </span>
                </div>
            {{# }else if(d.printDate.selected && d.storeName.selected && !d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px;color:#41ae3c;">
                        <span class="watermark_date_name_orderFont_printDate">[10-25 13:20:00]</span>
                        <span class="watermark_date_name_orderFont_storeName">[lazada0190]</span>
                        <span class="watermark_date_name_orderFont_orderNumber disN">[2747103]</span>
                    </span>
                </div>
            {{# }else if(d.printDate.selected && !d.storeName.selected && d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px;color:#41ae3c;">
                        <span class="watermark_date_name_orderFont_printDate">[10-25 13:20:00]</span>
                        <span class="watermark_date_name_orderFont_storeName disN">[lazada0190]</span>
                        <span class="watermark_date_name_orderFont_orderNumber">[2747103]</span>
                    </span>
                </div>
            {{# }else if(!d.printDate.selected && d.storeName.selected && d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px;color:#41ae3c;">
                        <span class="watermark_date_name_orderFont_storeName">[lazada0190]</span>
                        <span class="watermark_date_name_orderFont_orderNumber">[2747103]</span>
                        <span class="watermark_date_name_orderFont_printDate disN">[10-25 13:20:00]</span>
                    </span>
                </div>
            {{# }else if(d.printDate.selected && d.storeName.selected && d.orderNumber.selected){ }}
                <div id="watermark_date_name_orderFont" class="watermark_date_name_orderFontContainer">
                    <span style="font-size:{{d.printDate.fontSize}}px;color:#41ae3c;">
                       <span class="watermark_date_name_orderFont_printDate">[10-25 13:20:00]</span>
                       <span class="watermark_date_name_orderFont_storeName">[lazada0190]</span>
                       <span class="watermark_date_name_orderFont_orderNumber">[2747103]</span>
                    </span>
                </div>
            {{# } }}
            <%-- 记录分拣码容器的坐标 --%>
            <input type="hidden" id="watermark_date_name_orderFontLocation" value='{{JSON.stringify(d.printDate.location)}}'>
        </div>

    </div>
</script>

<%-- 邮编映射 --%>
<script type="text/html" id="areaDHLPriceCodeMappingLayer">
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
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="CodeMappingTable_tbody_add">新增一行</span>
            </div>
        </div>
        <div class="CodeMappingTable" style="margin: 0 38px;">
            <table class="layui-table">
                <thead>
                   <th>大于等于</th>
                   <th>小于</th>
                   <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="CodeMappingTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>

<%-- 区域邮编号映射 --%>
<script type="text/html" id="regionalPrice_areaZipCodeMappingLayer">
    <div class="layui-card">
        <div class="layui-card-body">
            <div class="layui-form-item" style="margin: 20px 0 0 -30px;">
                <label class="layui-form-label">邮编</label>
                <div class="layui-input-block">
                    <textarea name="zipCodeStr" id="regionalPrice_areaZipCodeMappingLayer_zipCodeStr" placeholder="多个邮编或邮编区域输入时使用英文逗号分割" class="layui-textarea"></textarea>
                </div>
            </div>
        </div>
    </div>
</script>

<%-- 城市映射 --%>
<script type="text/html" id="areaCityCodeMappingLayer">
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
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="areaCityCodeMappingTable_tbody_add">新增一行</span>
            </div>
        </div>
        <div class="CodeMappingTable" style="margin: 0 38px;">
            <table class="layui-table">
                <thead>
                <th>州/省</th>
                <th>城市</th>
                <th>操作</th>
                </thead>
                <tbody style="text-align: center;" id="areaCityCodeMappingTable_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>

<script src="${ctx}/static/js/logistics/logisticsMode.js"></script>