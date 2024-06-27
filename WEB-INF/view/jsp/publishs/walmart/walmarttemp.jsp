<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>沃尔玛模板</title>

<style>
    table.walmarttemp_colspantable td{
        border: 0px;
        margin-left: -5px;
        width:400px;
    }
    table.walmarttemp_colspantable1 td{
        border: 0px;
        margin-left: -5px;
        width:320px;
    }
    .tipSpan {
        color: red;
        border: 1px solid red;
        padding: 2px;
    }
    .attr-title {
        font: 700 20px sans-serif;
        border-bottom: 1px solid #e5e5e5;
        padding-bottom: 5px;
    }
    .attr-content {
        margin: 10px auto;
    }
    .borRight {
        border-right: none;
    }
    .arrayDisplayP {
        display:flex;
        margin:10px;
    }
    .flexD {
        display:flex;
    }
</style>


<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="walmarttemp_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-sm layui-btn-primary" id="walmarttemp_cateBtn">选择类目</span>
                                    <input id="walmarttemp_cateId" name="cateId" type="hidden">
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('walmarttemp_cateDiv','walmarttemp_cateId')"
                                       style="cursor:pointer" title="删除产品类目"></i>
                                </div> 
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="bizzOwnderIdStr"
                                        id="walmarttemp_bizzOwnderIdStr"
                                        xm-select="walmarttemp_bizzOwnderIdStr" 
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select name="prodIsSaleStatus" xm-select="walmarttemp_prodIsSaleStatus" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value="2" selected>全部在售</option>
                                        <option value="1" selected>部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="tag" id="walmarttemp_tag" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 disN walmarttemp_creator">
                                <label class="layui-form-label">模板创建人</label>
                                <div class="layui-input-block">
                                    <select name="walmartModeCreatId" id="walmarttemp_modeCreatId" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label labelSel">
                                    <select name="logisticsAttrRelation">
                                        <option value="and">物流属性与</option>
                                        <option value="or">物流属性或</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <select
                                        name="logisticsAttrStr"
                                        id="walmarttemp_logisticsAttrStr"
                                        xm-select="walmarttemp_logisticsAttrStr" 
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="tortPlatStatus">
                                        <option value="1">所有平台都不侵权</option>
                                        <option value="2">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="devTypeStr"
                                        id="walmarttemp_devTypeStr"
                                        xm-select="walmarttemp_devTypeStr" 
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 walmarttemp_mode">
                                <label class="layui-form-label">walmart模板</label>
                                <div class="layui-input-block">
                                    <select name="walmartModeStatus">
                                        <option value="2">未生成</option>
                                        <option value="1">已生成</option>
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="sortType">
                                        <option value="2">创建时间降序</option>
                                        <option value="1">创建时间升序</option>
                                        <option value="3">审核时间升序</option>
                                        <option value="4">审核时间降序</option>
                                        <option value="5">30日销量升序</option>
                                        <option value="6">30日销量降序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label labelSel">
                                    <select name="skuTimeType">
                                        <option value="1">创建时间</option>
                                        <option value="2">审核时间</option>
                                        <%--<option value="3">父SKU30天销量</option>--%>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="times" readonly id="walmarttemp_times">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">walmart类目</label>
                                <div class="layui-input-block">
                                    <select name="walmartCateName" id="walmarttemp_cateName" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label labelSel">
                                    <select name="skuTitleType">
                                        <option value="1">父SKU30天销量</option>
                                    </select>
                                </label>
                                <div class="layui-input-block" style="display:flex;">
                                    <input type="number" min="0" class="layui-input" name="thirtyDaySalesStart">
                                    <input type="number" min="0" class="layui-input" name="thirtyDaySalesEnd">
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label labelSel">
                                    <select name="skuTitleType">
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">子SKU</option>
                                        <option value="cnTitle">中文名称</option>
                                        <option value="enTitle">英文名称</option>
                                    </select>
                                </label>
                                <div class="layui-input-block" style="display:flex;">
                                    <input type="text" class="layui-input" name="skuTitleValueStr">
                                    <select name="skuTitleSearchType">
                                        <option value="1">模糊搜索</option>
                                        <option value="2">精确搜索</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" name="searchType" value="base">
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="walmarttemp_submit">查询</span>
                                <span class="layui-btn layui-btn-primary layui-btn-sm" id="walmarttemp_reset">清空
                                </span>
                            </div>
                            </div>
                        </div>
                        <div id="walmarttemp_cateDiv"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="walmarttempCard">
                 <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab" style="display: flex;justify-content: space-between;">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="walmarttemp_tabs" id="walmarttemp_tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">基础模板<span></span></li>
                                    <li>walmart模板<span></span></li>
                                </ul>
                            </div>
                            <div>
                                <permTag:perm funcCode="walmarttemp_batch">
                                <a class="layui-btn layui-btn-sm" id="walmartTempBatchBtn">生成walmart模板</a>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <table class="layui-table" id="walmarttemp_table" lay-filter="walmarttemp_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格-图片 --%>
<script type="text/html" id="walmarttemp_img">
    {{#  if(typeof(d.prodImgUrl) !="undefined"){ }}
    <img width="60" height="60" data-original="{{ d.prodImgUrl }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy img_show_hide" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<%-- 表格-父SKU --%>
<script type="text/html" id="walmarttemp_pSku">
    <div class="alignLeft">
        <span>{{d.pSku}}</span><br>
        {{# if(d.canSaleBoolFlag){ }}
        <span class="tipSpan">禁售</span>
        {{# } }}
        {{# if(d.tortStatusFlag){ }}
        <span class="tipSpan tortPlatList" data-plat="{{d.tortPlatList?d.tortPlatList.join():''}}">侵权</span>
        {{# } }}
    </div>
</script>

<%-- 表格-内嵌表格(基础模板) --%>
<script type="text/html" id="walmarttemp_detail">
    {{# if(d.sSkuInfoList){ }}
        <table class="layui-table walmarttemp_colspantable">
        {{#  layui.each(d.sSkuInfoList, function(index, item){ }}
            {{# if(index <4){ }}
                {{#  if(index ==d.sSkuInfoList.length-1){ }}
                <tr>
                {{#  }else{ }}
                <tr style="border-bottom: 1px solid #e6e6e6 !important">
                {{#  } }}
            {{# }else{ }}
                {{#  if(index ==d.sSkuInfoList.length-1){ }}
                <tr  class="myj-hide">
                {{#  }else{ }}
                <tr style="border-bottom: 1px solid #e6e6e6 !important" class="myj-hide">
                {{#  } }}
            {{# } }}
                <td style="width:130px;text-align:left;"> {{item.sSku || ''}}</td>
                <td style="width:60px;text-align:center;"> {{item.color || ''}}</td>
                <td style="width:60px;text-align:center;"> {{item.size || '' }}</td>
                <td style="width:60px;text-align:center;"> {{item.ifSale ? '是': '否'}}</td>
                <td style="width:80px;text-align:center;">{{d.ifHaveWalmartMode ? '是': '否'}}</td>
            </tr>
        {{# }) }}
        </table>
        {{# if(d.sSkuInfoList.length > 4){ }}
            <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;">
            <span> + 展开</span>({{d.sSkuInfoList.length}})
            </a> 
        {{# } }}
    {{# } }}
</script>
<%-- 表格内嵌表格(沃尔玛模板) --%>
<script type="text/html" id="walmarttemp_detail_walmart">
    {{# if(d.sSkuInfoList){ }}
        <table class="layui-table walmarttemp_colspantable1">
        {{#  layui.each(d.sSkuInfoList, function(index, item){ }}
            {{# if(index <4){ }}
                {{#  if(index ==d.sSkuInfoList.length-1){ }}
                <tr>
                {{#  }else{ }}
                <tr style="border-bottom: 1px solid #e6e6e6 !important">
                {{#  } }}
            {{# }else{ }}
                {{#  if(index ==d.sSkuInfoList.length-1){ }}
                <tr  class="myj-hide">
                {{#  }else{ }}
                <tr style="border-bottom: 1px solid #e6e6e6 !important" class="myj-hide">
                {{#  } }}
            {{# } }}
                <td style="width:130px;text-align:left;"> {{item.sSku || ''}}</td>
                <td style="width:60px;text-align:center;"> {{item.color || ''}}</td>
                <td style="width:60px;text-align:center;"> {{item.size || '' }}</td>
                <td style="width:60px;text-align:center;"> {{item.ifSale ? '是': '否'}}</td>
            </tr>
        {{# }) }}
        </table>
        {{# if(d.sSkuInfoList.length > 4){ }}
            <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;">
            <span>+ 展开</span>({{d.sSkuInfoList.length}})
            </a> 
        {{# } }}
    {{# } }}
</script>

<%-- 表格-时间(基础模板) --%>
<script type="text/html" id="walmarttemp_time">
    <div class="alignLeft">
        <div><span>创建:</span><span>{{Format(d.baseModeCreatTime,'yyyy-MM-dd hh:mm:ss') || ''}}</span></div>
        <div><span>审核:</span><span>{{Format(d.baseModeAuditTime,'yyyy-MM-dd hh:mm:ss') || ''}}</span></div>
    </div>
</script>
<%-- 表格-时间(沃尔玛模板)walmarttemp_time_walmart --%>
<script type="text/html" id="walmarttemp_time_walmart">
    <div class="alignLeft">
        <div><span>创建:</span><span>{{Format(d.walmartModeCreatTime,'yyyy-MM-dd hh:mm:ss') || ''}}</span></div>
        <div><span>更新:</span><span class="updateTime">{{Format(d.walmartModeUpdateTime,'yyyy-MM-dd hh:mm:ss') || ''}}</span></div>
    </div>
</script>

<%-- 表格-操作栏(基础模板) --%>
<script type="text/html" id="walmarttemp_toolBar">
    <div class="alignLeft">
        <span class="layui-btn layui-btn-xs" lay-event="newBulid">新建沃尔玛模板</span>
    </div>
</script>
<%-- 表格-操作栏(沃尔玛模板) --%>
<script type="text/html" id="walmarttemp_toolBar_walmart">
    <div class="alignLeft">
        <span class="layui-btn layui-btn-xs" lay-event="edit">修改</span><br>
        <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="delete">删除</span>
    </div>
</script>


<%-- 弹框-新建/编辑沃尔玛模板 --%>
<script type="text/html" id="walmarttemp_newOrEditLayer">
    <div id="walmarttemp_newOrEdit_container" style="padding: 20px;">
    </div>
</script>
<script type="text/html" id="walmarttemp_newOrEdit_containerTpl">
    <div>
        <div>
            <div class="attr-title">必填属性</div>
            <div class="attr-content layui-form">
                <div class="layui-form-item">
                    <div class="layui-form-label">父SKU</div>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" value="{{d.trData.pSku}}" disabled>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label"><font color="red" size="4">*</font>站点</div>
                    <div class="layui-input-block">
                        <select name="site">
                            <option value="US">US</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">Product Tax Code</div>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="prodTaxCode" value="{{d.prodTaxCode || ''}}">
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="attr-title">选填属性</div>
            <div class="attr-content layui-form" id="optional_attr">
                {{#  layui.each(d.attributeList, function(index, item){ }}
                    <%-- 输入类型 --%>
                    {{# if(item.displayType == 'input'){ }}
                    <div class="layui-form-item">
                        <div class="layui-form-label">
                        {{# if(item.required){ }}
                        <font color="red" size="4">*</font>
                        {{# } }}
                        {{item.attributeTitle}}
                        </div>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" 
                                value="{{item.attributeValue || ''}}" 
                                name="{{item.attributeName}}"
                            >
                        </div>
                        <input type="hidden" name="attrCollection" value='{
                            "attributeName":"{{item.attributeName}}",
                            "attributeTitle":"{{item.attributeTitle}}",
                            "dataType":"{{item.dataType}}",
                            "displayType":"{{item.displayType}}",
                            "required":"{{item.required}}"
                        }'>
                    </div>
                    {{# } }}
                    <%-- select选择类型 --%>
                    {{# if(item.displayType == 'select'){ }}
                    <div class="layui-form-item">
                        <div class="layui-form-label">
                        {{# if(item.required){ }}
                        <font color="red" size="4">*</font>
                        {{# } }}
                        {{item.attributeTitle}}
                        </div>
                        <div class="layui-input-block">
                            <select name="{{item.attributeName}}" lay-search>
                                <option value="">请选择</option>
                                {{#  layui.each(item.attributeValueList, function(index, attr){ }}
                                {{# if(item.attributeValue == attr){ }}
                                <option value="{{attr}}" selected>{{attr}}</option>
                                {{# }else{ }}
                                <option value="{{attr}}">{{attr}}</option>
                                {{# } }}
                                {{# }) }}
                            </select>
                        </div>
                        <input type="hidden" name="attrCollection" value='{
                            "attributeName":"{{item.attributeName}}",
                            "attributeTitle":"{{item.attributeTitle}}",
                            "dataType":"{{item.dataType}}",
                            "displayType":"{{item.displayType}}",
                            "required":"{{item.required}}"
                        }'>
                    </div>
                    {{# } }}
                    <%-- 复选框类型--%>
                    {{# if(item.displayType == 'selects'){ }}
                    <div class="layui-form-item">
                        <div class="layui-form-label">
                            {{# if(item.required){ }}
                            <font color="red" size="4">*</font>
                            {{# } }}
                            {{item.attributeTitle}}
                        </div>
                        <div class="layui-input-block">
                            <select 
                                name="{{item.attributeName}}"
                                xm-select="{{item.attributeName}}_xmSel" 
                                xm-select-search 
                                xm-select-search-type="dl" 
                                xm-select-skin="normal"
                            >
                                <option value="">请选择</option>
                                {{#  layui.each(item.attributeValueList, function(index, attr){ }}
                                {{# if(item.attributeValue){ }}
                                    {{# if(item.attributeValue.indexOf(attr) > -1){ }}
                                    <option value="{{attr}}" selected>{{attr}}</option>
                                    {{# }else{ }}
                                    <option value="{{attr}}">{{attr}}</option>
                                    {{# } }}
                                {{# }else{ }}
                                <option value="{{attr}}">{{attr}}</option>
                                {{# } }}
                                {{# }) }}
                            </select>
                        </div>
                        <input type="hidden" name="attrCollection" value='{
                            "attributeName":"{{item.attributeName}}",
                            "attributeTitle":"{{item.attributeTitle}}",
                            "dataType":"{{item.dataType}}",
                            "displayType":"{{item.displayType}}",
                            "required":"{{item.required}}"
                        }'>
                    </div>
                    {{# } }}         
                    <%-- input+select选择类型 --%>
                    {{# if(item.displayType == 'inputSelect'){ }}
                    <div class="layui-form-item">
                        <div class="layui-form-label">
                            {{# if(item.required){ }}
                            <font color="red" size="4">*</font>
                            {{# } }}
                            {{item.attributeTitle}}
                        </div>
                         <div class="layui-input-block" style="display:flex;">
                            <input type="text" class="layui-input borRight"
                                name="{{item.attributeName}}"
                                value="{{item.attributeValue ? (item.attributeValue.split('&')[0]): ''  }}"
                            >
                            <select lay-search name="{{item.attributeName}}_unit">
                                {{#  layui.each(item.attributeValueList, function(index, attr){ }}
                                {{# if(item.attributeValue){ }}
                                    {{# if(item.attributeValue.split('&')[1] == attr || item.valueFromMapping == attr){ }}
                                    <option value="{{attr}}" selected>{{attr}}</option>
                                    {{# }else{ }}
                                    <option value="{{attr}}">{{attr}}</option>
                                    {{# } }}
                                {{# }else{ }}
                                <option value="{{attr}}">{{attr}}</option>
                                {{# } }}
                                {{# }) }}
                            </select>
                        </div>
                        <input type="hidden" name="attrCollection" value='{
                            "attributeName":"{{item.attributeName}}",
                            "attributeTitle":"{{item.attributeTitle}}",
                            "dataType":"{{item.dataType}}",
                            "displayType":"{{item.displayType}}",
                            "required":"{{item.required}}"
                        }'>
                    </div>
                    {{# } }}
                    <%-- input+array输入类型 --%>
                    {{# if(item.displayType == 'array'){ }}
                    <div class="layui-form-item">
                        <div>
                            {{# if(item.required){ }}
                            <font color="red" size="4">*</font>
                            {{# } }}
                            {{item.attributeTitle}}
                        </div>
                        {{# if(!item.attributeValue.length){ }}
                        <div class="arrayDisplayP">
                            {{#  layui.each(item.attributeList, function(index, attr){ }}
                            <div class="arrayDisplayClass flexD">
                                <span data-name="{{attr.attributeName}}">{{attr.attributeTitle}}</span>
                                <input type="text" class="layui-input" value="">
                            </div>
                            {{# }) }}
                            <span class="layui-btn layui-btn-sm layui-btn-normal ml10 arrayDisplayP_add">+</span>
                        </div>
                        {{# }else{ }}
                            {{#  layui.each(item.attributeValue, function(index, value){ }}
                            <div class="arrayDisplayP">
                               {{#  layui.each(value.infos, function(index, info){ }}
                                <div class="arrayDisplayClass flexD">
                                    <span data-name="{{info.name}}">{{info.title}}</span>
                                    <input type="text" class="layui-input" value="{{info.value || ''}}">
                                </div>
                                {{# }) }}
                                <span class="layui-btn layui-btn-sm layui-btn-normal ml10 arrayDisplayP_add">+</span>
                                {{# if(index !=0){ }}
                                <span class="layui-btn layui-btn-sm layui-btn-normal ml10 arrayDisplayP_delete">-</span>
                                {{# } }}
                            </div>
                            {{# }) }}
                        {{# } }}
                        <input type="hidden" name="attrCollection" value='{
                            "attributeName":"{{item.attributeName}}",
                            "attributeTitle":"{{item.attributeTitle}}",
                            "dataType":"{{item.dataType}}",
                            "displayType":"{{item.displayType}}",
                            "required":"{{item.required}}"
                        }'>
                    </div>
                    {{# } }}
                {{# }) }}
            </div>
        </div>
    </div>
</script>


<script src="${ctx}/static/js/publishs/walmart/walmarttemp.js?v=${ver}"></script>