<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<style type="text/css">
    .showLine4{
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;					
        -webkit-box-orient: vertical;
    }
</style>

<title>毛利率</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="calPriceFormulaSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                  <select name="platCode" lay-filter="calPriceFormula_platCode" lay-search>
                                      <option value=""></option>
                                      <c:forEach items="${platCodeList}" var="platCode">
                                          <option value="${platCode.name}">${platCode.name}</option>
                                      </c:forEach>
                                  </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctIdList" id="calPriceFormula_storeAcctIdList" xm-select="calPriceFormula_storeAcctIdList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='calPriceFormula_storeAcctIdList'>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="siteCodeList" id="calPriceFormula_salesSite" lay-filter="calPriceFormula_salesSite"
                                        xm-select="calPriceFormula_salesSite" xm-select-search
                                        xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">毛利率</label>
                                <div class="layui-input-block" style="display:flex;">
                                    <input type="text" class="layui-input" autocomplete="off" name="grossRateMin">
                                    <input type="text" class="layui-input" autocomplete="off" name="grossRateMax">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">创建人</label>
                                <div class="layui-input-block">
                                    <select name="creatorId">
                                        <option value=""></option>
                                        <c:forEach items="${creatorList}" var="creator">
                                            <option value="${creator.creatorId}">${creator.creator}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload" id="searchBtn_calPriceFormula">搜索</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="calPriceFormulamanageCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <span>
                                <span class="numCount">总数(<span id="calPriceFormula_colLen"></span>)</span>
                                <permTag:perm funcCode="calPriceFormula_refresh_redis">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-warm" id="refreshRedis_calPriceFormulaBtn">刷新缓存</button>
                                </permTag:perm>
                            </span>
                            <span>
                                <button type="button" class="layui-btn layui-btn-sm" id="batch_calPriceFormulaBtn">批量设置毛利率</button>
                                <button type="button" class="layui-btn layui-btn-sm" id="ProductConfig_calPriceFormulaBtn">商品价值公式配置</button>
                                <permTag:perm funcCode="add_calPriceFormula">
                                    <button type="button" class="layui-btn layui-btn-sm" id="addBtn_calPriceFormulaBtn">新增</button>
                                </permTag:perm>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body calPriceFormulaTableBox">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="calPriceFormulaTable" lay-filter="calPriceFormulaTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<%--    批量设置毛利率--%>
<script type="text/html" id="batch_productConfig_layer">
    <div class="p20">
        <form action="" class="layui-form" id="batch_productConfig_form" lay-filter="batch_productConfig_form">
            <div class="layui-form-item">
                <div class="layui-col-md2">
                    <label class="layui-form-label">毛利率</label>
                    <div class="layui-input-block">
                        <select name="select1">
                            <option value=""></option>
                            <option value="+">+</option>
                            <option value="-">-</option>
                            <option value="=">=</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md1">
                    <input class="layui-input input1"/>
                </div>
                <div class="layui-col-md2">
                    <label class="layui-form-label">商品标签</label>
                    <div class="layui-input-block">
                        <select id="calPriceFormula_prodTagMap" xm-select="calPriceFormula_prodTagMap" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2">
                    <label class="layui-form-label" style="width: 100px;padding: 9px 0;">商品标签毛利率</label>
                    <div class="layui-input-block">
                        <select name="select2">
                            <option value=""></option>
                            <option value="=">=</option>
                            <option value="-">移除</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md1">
                    <input class="layui-input input2"/>
                </div>
                <div class="layui-col-md2">
                    <label class="layui-form-label" style="width: 100px;padding: 9px 0;">商品价值毛利率</label>
                    <div class="layui-input-block">
                        <select name="select3">
                            <option value=""></option>
                            <option value="+">+</option>
                            <option value="-">-</option>
                            <option value="=">=</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md1">
                    <input class="layui-input input3"/>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md2 layui-col-md-offset10">
                    <a class="layui-btn layui-btn-sm apply">一键应用</a>
                    <a class="layui-btn layui-btn-sm save">保存修改</a>
                </div>
            </div>
        </form>
        <table class="layui-table" id="batch_productConfig_table"></table>
    </div>
</script>

<!-- ali1688添加基本信息模态框内容 -->
<script type="text/html" id="calPriceFormulaAddLayer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="calPriceFormulaAddForm" lay-filter="calPriceFormulaAddForm">
            <div class="layui-form-item">
                <div class="layui-inline" notNull>
                    <label class="layui-form-label" style="width:150px">平台</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <select name="platCode" lay-filter="platCode_calPriceFormulaAddForm">
                            <option value=""></option>
                            <c:forEach items="${platCodeList}" var="platCode">
                                <option value="${platCode.name}">${platCode.name}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label" style="width:150px"><font class="fRed site-label-required-tag">*</font>站点</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <select name="siteId" lay-filter="siteId_calPriceFormulaAddForm">
                            <option value=""></option>
                        </select>

                        <div class="disN" id="salesSite_calPriceFormulaAddForm_wish">
                            <option value=""></option>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_amazon">
                            <option value=""></option>
                            <c:forEach items="${amazonSiteEnum}" var="site">
                                <option value="${site.marketName}">${site.name}</option>
                            </c:forEach>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_lazada">
                            <option value=""></option>
                            <c:forEach items="${lazadaSiteEnum}" var="site">
                                <option value="${site.code}">${site.name}</option>
                            </c:forEach>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_ebay">
                            <option value=""></option>
                            <c:forEach items="${ebaySiteEnum}" var="site">
                                <option value="${site.siteId}">${site.cnTitle}</option>
                            </c:forEach>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_shopee">
                            <option value=""></option>
                            <c:forEach items="${shopeeSiteEnum}" var="site">
                                <option value="${site.code}">${site.name}</option>
                            </c:forEach>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_shopee_cnsc">
                            <option value=""></option>
                            <c:forEach items="${shopeeCnscSiteEnum}" var="site">
                                <option value="${site.code}">${site.name}</option>
                            </c:forEach>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_tiktok">
                            <option value=""></option>
                            <c:forEach items="${tiktokSiteEnum}" var="site">
                                <option value="${site.code}">${site.name}</option>
                            </c:forEach>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_mercado">
                            <option value=""></option>
                            <c:forEach items="${mercadoSiteEnum}" var="site">
                                <option value="${site.salesSite}">${site.name}</option>
                            </c:forEach>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_fyndiq">
                            <option value=""></option>
                            <c:forEach items="${fyndiqSiteEnum}" var="site">
                                <option value="${site.marketName}">${site.name}</option>
                            </c:forEach>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_shein商城">
                            <option value=""></option>
                            <c:forEach items="${sheinSiteEnum}" var="site">
                                <option value="${site.code}">${site.name}</option>
                            </c:forEach>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_daraz">
                            <option value=""></option>
                            <c:forEach items="${darazSiteEnum}" var="site">
                                <option value="${site.siteCode}">${site.siteName}</option>
                            </c:forEach>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_aliexpress">
                            <option value=""></option>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_joom">
                            <option value=""></option>
                        </div>
                        <div class="disN" id="salesSite_calPriceFormulaAddForm_smt">
                            <option value=""></option>
                        </div>
                    </div>
                </div>

                <div class="layui-inline" notNull>
                    <label class="layui-form-label" style="width:150px">定价公式</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <select name="formulaCode" lay-filter="formulaCode_calPriceFormulaAddForm">
                            <option value=""></option>
                            <c:forEach items="${calPriceFomulaEnum}" var="fomula">
                                <option value="${fomula.code}" data-platCode="${fomula.platCode}" data-siteId="${fomula.siteId}"
                                        data-stockLoaction="${fomula.stockLocation}">${fomula.name}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>

                <div class="layui-inline" notNull>
                    <label class="layui-form-label" style="width:150px">毛利率</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <input name="grossRate" class="layui-input"/>
                    </div>
                </div>

                <div class="layui-inline" notNull>
                    <label class="layui-form-label" style="width:150px">仓库</label>
                    <div class="layui-input-inline" style="width:300px;">
                        <select name="stockLocation" lay-filter="stockLocation_calPriceFormulaAddForm">
                           <option value="0">全部</option>
                           <option value="1">国内仓</option>
                           <option value="2">虚拟仓</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="remark" placeholder="请输入备注内容" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="ifDefault_">
    <div><input type="checkbox" lay-skin="primary" {{d.ifDefault ? 'checked' : ''}} disabled></div>
</script>

<script type="text/html" id="stockLoaction_calPriceFormula">
    <div>
        {{# if (d.stockLocation == 0) {}}
            全部
        {{# } else if (d.stockLocation == 1) {}}
            国内仓
        {{# } else if (d.stockLocation == 2) {}}
            虚拟仓
        {{# } }}
    </div>
</script>

<script type="text/html" id="store_calPriceFormula">
    <div class="showLine4">
        <span class="pora copySpan">
            <a style="padding: 10px">{{ d.refCount }}</a>
            <a style="display: none">
                {{# if (d.refList){ }}
                {{# for(var i = 0; i < d.refList.length; ++i){ }}
                {{d.refList[i].storeName + ','}}
                {{# } }}
                {{# } }}
            </a>
            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this)">复制</button>
        </span>
    </div>

</script>
<%--最后修改人，修改时间--%>
<script type="text/html" id="modify_calPriceFormula">
    {{d.modifier||''}}<br />
    {{d.modifyTime?Format(d.modifyTime,'yyyy-MM-dd hh:mm'):''}}
</script>
<script type="text/html" id="grossRate_calPriceFormula">
        <div>
            {{d.grossRate}}
        <permTag:perm funcCode="updateGrossRate_calPriceFormula">
            <a lay-event="updateGrossRate">
            <i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;"></i>
            </a>
        </permTag:perm>
        </div>
</script>
<script type="text/html" id="logisAttrGrossRate_calPriceFormula">
    <div>
        {{d.prodAttrGrossRateData||"无数据"}}
        <%--<permTag:perm funcCode="updateGrossRate_calPriceFormula">--%>
        <permTag:perm funcCode="updateStoreLabel_calPriceFormula">
            <a lay-event="updateGrossRate1">
                <i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;"></i>
            </a>
        </permTag:perm>
    </div>
</script>
<script type="text/html" id="_logisAttrGrossRate_calPriceFormula">
    <div class="td{{d.id}}">
    {{d.prodAttrGrossRateData||"无数据"}}
    </div>
</script>
<script type="text/html" id="logisAttrGrossRate_minRate">
    <div>
        {{# if(d.minGrossRateTagConfigDtoList.length > 0){ }}
            {
                {{# for(var i = 0; i < d.minGrossRateTagConfigDtoList.length; ++i){ }}
                    {{# if (d.minGrossRateTagConfigDtoList[i].minGrossRate !== ''){ }}
                        {{# if ( i == d.minGrossRateTagConfigDtoList.length - 1){ }}  
                            {{JSON.stringify(d.minGrossRateTagConfigDtoList[i].tagName) + ':' + JSON.stringify(d.minGrossRateTagConfigDtoList[i].minGrossRate)}}
                        {{# } else { }}
                            {{JSON.stringify(d.minGrossRateTagConfigDtoList[i].tagName) + ':' + JSON.stringify(d.minGrossRateTagConfigDtoList[i].minGrossRate) + ','}}
                        {{# } }}
                    {{# } }}
                {{# } }}
            }
        {{# } }}
        {{# if(d.minGrossRateTagConfigDtoList.length == 0){ }}
            无数据
        {{# } }}

        <a lay-event="updateListingTag">
            <i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;"></i>
        </a>
    </div>
</script>
<%--    商品价值--%>
<script type="text/html" id="logisAttrGrossRate_commodityValue">
    <div>
        {{# if(d.productValueGrossRateData && JSON.parse(d.productValueGrossRateData).productValueGrossRateData.length > 0){ }}
            {{# for(var i = 0; i < JSON.parse(d.productValueGrossRateData).productValueGrossRateData.length; ++i){ }}
                {
                区间[{{JSON.parse(d.productValueGrossRateData).productValueGrossRateData[i].minValue}}-{{JSON.parse(d.productValueGrossRateData).productValueGrossRateData[i].maxValue}}),毛利率{{JSON.parse(d.productValueGrossRateData).productValueGrossRateData[i].grossRate}}
                }
            {{# } }}
        {{# } }}
        {{# if(!d.productValueGrossRateData){ }}
            无数据
        {{# } }}
        <a lay-event="commodityValue">
            <i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;"></i>
        </a>
    </div>
</script>
<script type="text/html" id="_logisAttrGrossRate_commodityValue">
    <div>
        {{# if(d.productValueGrossRateData && JSON.parse(d.productValueGrossRateData).productValueGrossRateData.length > 0){ }}
            {{# for(var i = 0; i < JSON.parse(d.productValueGrossRateData).productValueGrossRateData.length; ++i){ }}
                {
                区间[{{JSON.parse(d.productValueGrossRateData).productValueGrossRateData[i].minValue}}-{{JSON.parse(d.productValueGrossRateData).productValueGrossRateData[i].maxValue}}),毛利率{{JSON.parse(d.productValueGrossRateData).productValueGrossRateData[i].grossRate}}
                }
            {{# } }}
        {{# } }}
        {{# if(!d.productValueGrossRateData){ }}
            无数据
        {{# } }}
    </div>
</script>
<script type="text/html" id="_commodityValue_layer">
    <div style="padding:10px;">
        <div style="color:red;">
            <p>1. 批量设置将会把以下商品价值毛利率数据应用至列表选中的所有数据</p>
            <p>2. 商品价值区间为左闭右开；商品价值单位为CNY</p>
        </div>
        <table class="layui-table" lay-size="sm">
            <thead>
                <tr>
                    <th>商品价值(CNY)</th>
                    <th>毛利率</th>
                    <th style="width:150px;"></th>
                </tr>
            </thead>
            <tbody class="commodityValue_layer_tbody">
            </tbody>
        </table>
    </div>
</script>
<script type="text/html" id="commodityValue_layer">
    <div style="padding:10px;">
        <div style="color:red;">
            <p>1. 请检查定价公式商品价值公式是否配置，若未配置则计算定价不使用商品价值毛利率；仅支持两位小数</p>
            <p>2. 商品价值区间为左闭右开；商品价值单位为CNY</p>
        </div>
        <table class="layui-table" lay-size="sm">
            <thead>
                <tr>
                    <th>商品价值(CNY)</th>
                    <th>毛利率</th>
                    <th style="width:150px;"></th>
                </tr>
            </thead>
            <tbody class="commodityValue_layer_tbody">
            </tbody>
        </table>
    </div>
</script>
<%--    配置公式--%>
<script type="text/html" id="commodityValue_productConfig_layer">
    <div style="padding:10px;">
        <div style="color:red;">
            <p>1. 公式可填写的字段：商品成本 商品毛重 运费</p>
            <p>2. 计算出来的商品价值和运费的币种为人民币，不需要单独换算</p>
        </div>
        <a class="layui-btn layui-btn-xs commodityValue_productConfig_add">新增一行</a>
        <table class="layui-table" lay-size="sm">
            <thead>
                <tr>
                    <th style="width:200px;">平台</th>
                    <th>商品价值计算公式(CNY)</th>
                    <th style="width:200px;"></th>
                </tr>
            </thead>
            <tbody class="commodityValue_productConfig_layer_tbody">
            </tbody>
        </table>
    </div>
</script>
<script type="text/html" id="commodityValue_layer_tableTr">
    {{#  if(d.productValueGrossRateData.length != 0){ }}
        {{#  layui.each(d.productValueGrossRateData, function(index, item){ }}
            <tr>
                <td><div style="display:flex"><input class="layui-input input1" value="{{item.minValue}}" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/> - <input class="layui-input input2" value="{{item.maxValue}}" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/></div></td>
                <td><input class="layui-input input3" value="{{item.grossRate}}" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/></td>
                <td style="width:150px;">
                {{#  if(d.productValueGrossRateData.length-1 == index){ }}
                    <a class="layui-btn layui-btn-xs layui-btn-normal commodityValue_layer_add">添加</a>
                {{#  } }}
            <a class="layui-btn layui-btn-xs layui-btn-danger commodityValue_layer_del">删除</a></td> </tr>
        {{#  }); }}
    {{#  }else{ }}
    <tr>
        <td><div style="display:flex"><input class="layui-input input1" value="" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/> - <input class="layui-input input2" value="" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/></div></td>
        <td><input class="layui-input input3" value="" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/></td>
        <td style="width:150px;"><a class="layui-btn layui-btn-xs layui-btn-normal commodityValue_layer_add">添加</a><a class="layui-btn layui-btn-xs layui-btn-danger commodityValue_layer_del">删除</a></td>
    </tr>
    {{#  } }}
</script>
<script type="text/html" id="commodityValue_productConfig_layer_tableTr">
{{#  layui.each(d, function(index, item){ }}
    <tr data-tr='{{JSON.stringify(item)}}'>
        <td><form class="layui-form"><select name="platCode" lay-filter="platCode_cal" lay-search>
            <option value=""></option>
            <c:forEach items="${platCodeList}" var="platCode">
                <option value="${platCode.name}" {{'${platCode.name}' == item.platCode ?'selected':''}}>${platCode.name}</option>
            </c:forEach>
            </select></form></td>
        <td><input class="layui-input input1" value="{{item.productValueFormula||''}}" onchange="handleFloat_test(this.value,event)" /></td>
    <td><a class="layui-btn layui-btn-xs layui-btn-danger commodityValue_productConfig_layer_del">移除</a><a class="layui-btn layui-btn-xs layui-btn-normal commodityValue_productConfig_layer_test">测试</a><span class="res">{{item.status!=true?'<span style="color:red">未测试</span>':'<span style="color:green">已测试</span>'}}</span></td>
    </tr>
{{#  }); }}
</script>
<script type="text/html" id="commodityValue_productConfig_layer_tableTr_tpl">
    <tr>
        <td><form class="layui-form"><select name="platCode" lay-filter="platCode_cal">
            <option value=""></option>
            <c:forEach items="${platCodeList}" var="platCode">
                <option value="${platCode.name}">${platCode.name}</option>
            </c:forEach>
            </select></form></td>
        <td><input class="layui-input input1"/></td>
        <td><a class="layui-btn layui-btn-xs layui-btn-danger commodityValue_productConfig_layer_del">移除</a><a class="layui-btn layui-btn-xs layui-btn-normal commodityValue_productConfig_layer_test">测试</a><span class="res"><span style="color:red">未测试</span></span></td>
    </tr>
</script>

<script type="text/html" id="discountRate_calPriceFormula">
    <div>
        {{d.discountRate}}
        <permTag:perm funcCode="updateDiscountRate_calPriceFormula">
            <a lay-event="updateDiscountRate">
                <i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;"></i>
            </a>
        </permTag:perm>
    </div>
</script>


<script type="text/html" id="Bar_calPriceFormula">
    <div style="text-align:left;">
        <permTag:perm funcCode="setDefault_calPriceFormula">
            <a class="layui-btn layui-btn-xs" lay-event="setDefault">设为默认</a><br />
        </permTag:perm>
        <permTag:perm funcCode="matchStore_calPriceFormula">
            <a class="layui-btn layui-btn-xs" lay-event="matchStore">匹配店铺</a>
        </permTag:perm>
        <br />
        <a class="layui-btn layui-btn-xs" lay-event="logList">日志</a>
        <permTag:perm funcCode="delete_calPriceFormula">
            {{# if (!d.ifDefault) { }}
            <br /><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a>
            {{# } }}
        </permTag:perm>
    </div>
</script>
<script type="text/html" id="ifDefault_calPriceFormula">
    {{# if (d.ifDefault) { }}
        <div class="layui-unselect layui-form-checkbox layui-form-checked layui-checkbox-disbaled layui-disabled"
             lay-skin="primary">
            <i class="layui-icon layui-icon-ok"></i>
        </div>
    {{# } else { }}
        <div class="layui-unselect layui-form-checkbox layui-checkbox-disbaled layui-disabled"
             lay-skin="primary">
            <i class="layui-icon layui-icon-ok"></i>
        </div>
    {{# } }}
</script>

<script type="text/html" id="matchStorePop_calPriceFormula">
    <div class="p10" style="display: flex;justify-content: space-between;flex-direction: column;">
        <div class="layui-tab layui-tab-card">
            <%--<div class="layui-tab-content">--%>
                <%--<div class="layui-tab-item layui-show p20">--%>
                    <form class="layui-form" lay-filter="matchStoreForm_calPriceFormula" id="matchStoreForm_calPriceFormula">
                        <div class="layui-form-item layui-row" style="padding: 5px 0;">
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">全选</label>
                                <div class="layui-input-block" style="line-height: 30px!important;">
                                    <input type="checkbox" lay-skin="primary" title="" lay-filter="matchStoreForm_calPriceFormula_checkAll">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <input type="text" lay-skin="primary" title="" name="storeAcct" placeholder="单个模糊，多个精确逗号分隔" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-input-block" style="line-height: 30px!important;">
                                    <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" lay-submit lay-filter="matchStoreForm_calPriceFormula_submit">搜索</button>
                                </div>
                            </div>
                        </div>
                        <%--<div class="fieldBox"><input type="checkbox" title="子sku" disabled lay-skin="primary" checked></div>--%>
                    </form>
                <%--</div>--%>
            <%--</div>--%>
        </div>
        <div class="layui-tab layui-tab-card">
                <div class="layui-card-header" style="color: #468847;background-color: #dff0d8">已选择店铺
                    <button type="button" class="layui-btn ml20 layui-btn-xs" name="calPriceFormulaCopy" style="margin-left:100px;">一键复制</button>
                </div>
                <div class="layui-card-body">
                    <form class="layui-form" id="matchStoreForm_calPriceFormula_checked" lay-filter="matchStoreForm_calPriceFormula_checked">

                    </form>
                </div>
            </div>
    </div>
</script>


<script type="text/html" id="calPriceFormula_logListLayer">
    <div style="padding:20px 50px 0 20px">
        <table class="layui-table" id="calPriceFormula_logTable" lay-filter="tortBrand_logTable">
        </table>
    </div>
</script>


<script type="text/html" id="updateGrossRatePop_calPriceFormula">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
            <div class="layui-tab-item layui-show p20">
            <form class="layui-form" lay-filter="updateGrossRateForm_calPriceFormula" id="updateGrossRateForm_calPriceFormula">
                <div class="layui-input-inline">
                    <input name="grossRate" class="layui-input">
                </div>
            </form>
            </div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="updateDiscountRatePop_calPriceFormula">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" lay-filter="updateDiscountRateForm_calPriceFormula" id="updateDiscountRateForm_calPriceFormula">
                        <div class="layui-input-inline">
                            <input name="discountRate" class="layui-input">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>
<script id="cpf_storeLabelDemo" type="text/html">
    <form class="layui-form" id="cpf_storeLabelCon">
        {{#  layui.each(d.prodAttrGrossRateDataArr, function(index, item){ }}
            <div class="layui-col-md11 layui-col-lg11">
                <label class="layui-form-label">{{ item.name }}</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="{{ item.name }}" value="{{ item.value||'' }}">
                </div>
            </div>
        {{#  }); }}
    </form>
</script>

<script id="cpf_listingTag" type="text/html">
    <form class="layui-form" id="cpf_listingTagCon">
        <p style="padding: 10px 20px">当前listing满足多个标签时自上向下取值</p>
        {{#  layui.each(d.minGrossRateTagConfigDtoListArr, function(index, item){ }}
            <div class="layui-col-md11 layui-col-lg11 rowList">
                <label class="layui-form-label">{{ item.tagName }}</label>
                <div class="layui-input-block" style="display: flex">
                    <input class="layui-input tag-input" style="width: 80%" name="{{ item.tagName }}" value="{{ item.value || (item.value == 0 ? item.value: '') }}" lay-filter="cpf_tagInput">
                    <div style="width: 20%;display: flex">
                        <i class="layui-icon layui-icon-up disN" style="cursor: pointer;margin: 5px 5px 0;" onclick="moveup(this)"></i>
                        <i class="layui-icon layui-icon-down disN" style="cursor: pointer;margin: 5px 5px 0;" onclick="movedown(this)"></i>
                    </div>
                </div>
            </div>
        {{#  }); }}
    </form>
</script>

<script type="text/html" id="cpf_storeLabelView">
</script>
<script type="text/html" id="cpf_listingTagView">
</script>
<script type="text/html" id="editLogisGrossRateTpl">
    <div class="layui-row" style="padding: 20px">

    </div>
</script>
<script type="text/html" id="editLogisGrossRateItemTpl">
    <div class="priceTypeItem layui-col-xs4" style="border: 1px solid #e9e9e9;padding: 10px">
        <form class="layui-form">
            <input type="hidden" name="priceTypeCode" value=":priceTypeCode">
            <div class="layui-form-item">
                <p style="text-align: center; line-height: 35px">:priceTypeName</p>
                <hr>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md12 layui-col-lg12">
                    <div class="layui-col-md4" style="float: left">
                        <input type="checkbox" name="checkAll" lay-skin="primary" title="全选" lay-filter="cpf_checkAllLogis">
                    </div>
                    <div class="layui-col-md4">
                        <input type="number" class="layui-input" name="grossRateAll">
                    </div>
                    <div class="layui-col-md3">
                        <button type="button" class="applyGrossRateAll layui-btn layui-btn-sm layui-btn-normal" style="float: right">批量设置</button>
                    </div>
                </div>
            </div>
            <c:forEach items="${logisAttrEnum}" var="logisAttr">
                <div class="logisAttrItem layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <div class="layui-col-md4" style="float: left">
                            <input type="checkbox" name="logisAttr" value="${logisAttr.name}" lay-skin="primary" title="${logisAttr.name}">
                        </div>
                        <div class="layui-col-md7">
                            <input type="number" class="layui-input" name="grossRate">
                        </div>
                    </div>
                </div>
            </c:forEach>
        </form>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/public/calPriceFormula.js"></script>
<style>
    .fieldBox_calPriceFormula{
        float: left;
        width: 20%;
        height: 25px;
        line-height: 25px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
</style>