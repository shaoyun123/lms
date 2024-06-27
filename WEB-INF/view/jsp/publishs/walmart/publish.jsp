<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>沃尔玛刊登</title>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<style>
    .tipSpan {
        color: red;
        border: 1px solid red;
        padding: 2px;
    }
    table.walmartpublish_colspantable td{
        border: 0px;
        margin-left: -5px;
        width:400px;
    }
    table.walmartpublish_colspantable-1 td{
        border: 0px;
        margin-left: -5px;
        width:510px;
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
    #walmartpublish_container .layui-table img {
        max-width: 200px;
    }
    .walmartp_imgContainer {
        margin: 5px;
        box-sizing: border-box;
    }
    .walmartp_imgContainer .opte {
        display:flex;
        justify-content: space-around;
    }
    .walmartp_imgContainer .opte span:first-child {
        color: #1e9fff;
        cursor: pointer;
    }
    .walmartp_imgContainer .opte span:nth-child(2) {
        color: #ff5722;
        cursor: pointer;
    }
    .walmart_subExtraImgs {
        display:flex;
        flex-wrap: wrap;
    }
    .disN {
        display: none;
    }
    .walmartpublish_tplimg_grid{
        display: grid;
        grid-template-columns: repeat(auto-fill, 16.6%);
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="walmartpublish_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select 
                                        id="walmartpublish_group_sel" 
                                        name="orgId"
                                        lay-filter="orgs_hp_walmartpublish_pb" 
                                        class="orgs_hp_custom"
                                        lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select 
                                        id="walmartpublish_salesman_sel" 
                                        name="sellerId"
                                        lay-filter="users_hp_walmartpublish_pb" 
                                        lay-search
                                        class="users_hp_custom"
                                        data-roleList="walmart专员">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="storeAcctId" 
                                        data-platcode="walmart" 
                                        lay-filter="walmartpublish_storeAcctId" 
                                        lay-search 
                                        class="store_hp_custom">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">walmart类目</label>
                                <div class="layui-input-block">
                                    <select name="walmartCateName"  id="walmartpublish_cateName" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="tag" id="walmartpublish_tag" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select
                                        name="logisticsAttrStr"
                                        id="walmartpublish_logisticsAttrStr"
                                        xm-select="walmartpublish_logisticsAttrStr" 
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="bizzOwnderIdStr"
                                        id="walmartpublish_bizzOwnderIdStr"
                                        xm-select="walmartpublish_bizzOwnderIdStr" 
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
                                    <select name="prodIsSaleStatus"  xm-select="walmartpublish_prodIsSaleStatus" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value="2" selected>全部在售</option>
                                        <option value="1" selected>部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品类型</label>
                                <div class="layui-input-block">
                                    <select name="multiSub">
                                        <option value="2">全部</option>
                                        <option value="1">多属性</option>
                                        <option value="0">单属性</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">生成情况</label>
                                <div class="layui-input-block">
                                    <select name="isListing">
                                        <option value="false">未生成</option>
                                        <option value="true">已生成</option>
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">是否禁售</label>
                                <div class="layui-input-block">
                                    <select name="canSaleBool">
                                        <option value="true">非禁售</option>
                                        <option value="false">禁售</option>
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="tortPlatStatus">
                                        <option value="1">所有平台都不侵权</option>
                                        <option value="3">walmart不侵权</option>
                                        <option value="2">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="devTypeStr"
                                        id="walmartpublish_devTypeStr"
                                        xm-select="walmartpublish_devTypeStr" 
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">模板创建人</label>
                                <div class="layui-input-block">
                                    <select name="walmartModeCreatId" id="walmartpublish_modeCreatId" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label labelSel">
                                    <select name="skuTimeType">
                                        <option value="1">创建时间</option>
                                        <option value="2">审核时间</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="times" readonly id="walmartpublish_times">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="preAvailableStockType">
                                        <option value="0">预计可用库存含在途</option>
                                        <option value="1">预计可用库存不含在途</option>
                                    </select>
                                </div>
                                <div class="layui-input-block disflex">
                                    <input type="number" name="preAvailableStockMin" autocomplete="off" class="layui-input inputBorRadLeft">
                                    <span class="ml5 mr5">-</span>
                                    <input type="number" name="preAvailableStockMax" autocomplete="off" class="layui-input inputRad">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label">成本(￥)</div>
                                <div class="layui-input-block disflex">
                                    <input type="number"  name="purchaseCostPriceMin" autocomplete="off" class="layui-input inputBorRadLeft">
                                    <span class="ml5 mr5">-</span>
                                    <input type="number" name="purchaseCostPriceMax" autocomplete="off" class="layui-input inputRad">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label">重量(g)</div>
                                <div class="layui-input-block disflex">
                                    <input type="number"  name="weightMin" autocomplete="off" class="layui-input inputBorRadLeft">
                                    <span class="ml5 mr5">-</span>
                                    <input type="number" name="weightMax" autocomplete="off" class="layui-input inputRad">
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
                                        <option value="2">精确搜索</option>
                                        <option value="1">模糊搜索</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 orderBy_0">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderby0">
                                        <option></option>
                                        <option value="walmartSort_1" selected>沃尔玛模板创建时间倒序</option>
                                        <option value="walmartSort_0">沃尔玛模板创建时间正序</option>
                                        <option value="baseSort_1">基础模板审核时间倒序</option>
                                        <option value="baseSort_0">基础模板审核时间正序</option>
                                        <option value="thirtyDaysSales_1">公司30天销量倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 disN orderBy_1">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderby1">
                                        <option></option>
                                        <option value="walmartCreateListing_1" selected>沃尔玛刊登创建时间倒序</option>
                                        <option value="walmartCreateListing_0">沃尔玛刊登创建时间正序</option>
                                        <option value="baseSort_1">基础模板审核时间倒序</option>
                                        <option value="baseSort_0">基础模板审核时间正序</option>
                                        <option value="thirtyDaysSales_1">公司30天销量倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 disN orderBy_2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderby2">
                                        <option></option>
                                        <option value="walmartListing_1" selected>刊登时间倒序</option>
                                        <option value="walmartListing_0">刊登时间正序</option>
                                        <option value="baseSort_1">基础模板审核时间倒序</option>
                                        <option value="baseSort_0">基础模板审核时间正序</option>
                                        <option value="thirtyDaysSales_1">公司30天销量倒序</option>
                                    </select>
                                </div>
                            </div>
                            <input type="hidden" name="listingStatus" value="-2">
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="walmartpublish_submit">查询</span>
                                <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary" id="walmartpublish_reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="walmartpublishCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="walmartpublish_tabs" id="walmartpublish_tabs">
                                <ul class="layui-tab-title">
                                    <li data-index="1" class="layui-this">商品(<span></span>)</li>
                                    <li data-index="2">待刊登(<span></span>)</li>
                                    <li data-index="3">刊登中(<span></span>)</li>
                                    <li data-index="4">刊登成功(<span></span>)</li>
                                    <li data-index="5">刊登失败(<span></span>)</li>
                                </ul>
                            </div>
                            <div class="layui-form ml10">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" 
                                    id="walmartpublish_generateProductBtn"
                                >生成店铺商品</span>
                                <div class="w100">
                                    <select name="downloadTpl" lay-filter="walmartpublish_downloadTpl">
                                        <option value="">下载模板</option>
                                        <option value="upcFilter">UPC查重不处理</option>
                                    </select>
                                </div>
                                <span class="layui-btn layui-btn-sm layui-btn-normal"
                                    id="walmartpublish_importUpcBtn"
                                >导入</span>
                                <span class="layui-btn layui-btn-sm layui-btn-normal disN"
                                    id="walmartpublish_exportBtn"
                                >导出</span>
                                <span class="layui-btn layui-btn-sm layui-btn-normal disN"
                                    id="walmartpublish_publishItemBtn"
                                >立即刊登</span>
                                <span class="layui-btn layui-btn-sm layui-btn-danger disN" 
                                    id="walmartpublish_deleteStoreBtn"
                                >删除店铺商品</span>
                                <%-- <span class="layui-btn layui-btn-sm disN" 
                                    id="walmartpublish_immediatelyBtn"
                                >立即刊登</span> --%>
                                <permTag:perm funcCode="mark_publish_success_btn">
                                <span class="layui-btn layui-btn-sm disN" 
                                    id="walmartpublish_immediatelyBtn"
                                >标记刊登成功</span>
                                </permTag:perm>
                                <span class="layui-btn layui-btn-sm disN" 
                                    id="walmartpublish_refreshBtn"
                                >重新发布</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <table class="layui-table" id="walmartpublish_table" lay-filter="walmartpublish_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格-图片 --%>
<script type="text/html" id="walmartpublish_img">
    {{#  if(typeof(d.prodImgUrl) !="undefined"){ }}
    <img width="60" height="60" data-original="{{ d.prodImgUrl }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy img_show_hide" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>
<%-- 表格-父SKU --%>
<script type="text/html" id="walmartpublish_pSku">
    <div class="alignLeft">
        <span id="prodDetail" data-id="{{d.pId}}" style="color:#1e9fff;cursor:pointer;">商品父:{{d.pSku || ''}}</span>
        {{# if(d.tabStatus != -2){ }}
        <br>
        <span class="storePSku">店铺父: {{d.storePSku || ''}}</span>
        {{# } }}
        {{# if(d.tabStatus ==1){ }}
        <span class="layui-bg-green hp-badge">已</span>
        {{# } }}
        {{# if(d.canSaleBoolFlag){ }}
        <span class="tipSpan">禁售</span>
        {{# } }}
        {{# if(d.tortStatusFlag){ }}
        <span class="tipSpan tortPlatListPublish" data-plat="{{d.tortPlatList?d.tortPlatList.join():''}}">侵权</span>
        {{# } }}
    </div>
</script>
<%-- 表格-内嵌表格(商品tab) --%>
<script type="text/html" id="walmartpublish_detail">
    {{# if(d.sSkuInfoList){ }}
        <table class="layui-table walmartpublish_colspantable">
        {{#  layui.each(d.sSkuInfoList, function(index, item){ }}
            {{# if(index <5){ }}
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
                <td style="width:60px;text-align:center;"> {{item.ifSale ? '<font color="blue">是</font>': '<font color="red">否</font>'}}</td>
                <td style="width:80px;text-align:center;">
                    {{(item.stockNum || 0) - (item.reservationNum || 0)}}/{{item.orderNotInNum || 0}}/{{item.lackUnPaiNum || 0}}
                </td>
            </tr>
        {{# }) }}
        </table>
        {{# if(d.sSkuInfoList.length > 5){ }}
            <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;">
            <span> + 展开</span>({{d.sSkuInfoList.length}})
            </a> 
        {{# } }}
    {{# } }}
</script>
<%-- 表格-内嵌表格(非商品tab) --%>
<script type="text/html" id="walmartpublish_detail-1">
    {{# if(d.sSkuInfoList){ }}
        <table class="layui-table walmartpublish_colspantable-1">
        {{#  layui.each(d.sSkuInfoList, function(index, item){ }}
            {{# if(index <5){ }}
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
                <td style="width:130px;text-align:left;"> 
                    {{item.sSku || ''}}
                    {{# if(item.listingStatus==2){ }}
                        <span class="layui-badge layui-bg-gray listingRemark" data-remark="{{item.listingRemark}}">败</span>
                    {{# } }}
                </td>
                <td style="width:130px;text-align:left;"> {{item.storeSSku || ''}}</td>
                <td style="width:60px;text-align:center;"> {{item.color || ''}}</td>
                <td style="width:60px;text-align:center;"> {{item.size || '' }}</td>
                <td style="width:60px;text-align:center;"> 
                    {{item.ifSale ? '<font color="blue">是</font>': '<font color="red">否</font>'}}
                </td>
                <td style="width:60px;text-align:center;">{{item.price || ''}}</td>      
                {{# if(d.tabStatus == 1 || d.tabStatus == 2 || d.tabStatus == 3){ }}
                    <td style="width:100px;text-align:center;"><div class="w100">{{item.feedId || ''}}</div></td>    
                {{#  }   }}
            </tr>
        {{# }) }}
        </table>
        {{# if(d.sSkuInfoList.length > 5){ }}
            <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;">
            <span> + 展开</span>({{d.sSkuInfoList.length}})
            </a> 
        {{# } }}
    {{# } }}
</script>
<%-- 表格--时间 --%>
<script type="text/html" id="walmartpublish_time_store">
    <div class="alignLeft">
        <div>审核时间:{{Format(d.auditTime,'yyyy-MM-dd') || ''}}</div>
        <div>创建时间:{{Format(d.walmartModeCreatTime,'yyyy-MM-dd') || ''}}</div>
    </div>
</script>
<%-- 表格--时间 --%>
<script type="text/html" id="walmartpublish_time">
    <div class="alignLeft">
        <div>审核时间:{{Format(d.auditTime,'yyyy-MM-dd') || ''}}</div>
        <div>生成时间:{{Format(d.walmartListingCreateTime,'yyyy-MM-dd') || ''}}</div>
    </div>
</script>
<%-- 表格--时间---刊登成功 --%>
<script type="text/html" id="walmartpublish_time_success_fail">
    <div class="alignLeft">
        <div>审核时间:{{Format(d.auditTime,'yyyy-MM-dd') || ''}}</div>
        <div>刊登时间:{{Format(d.walmartListingTime,'yyyy-MM-dd') || ''}}</div>
    </div>
</script>
<%-- 表格--商品操作 --%>
<script type="text/html" id="walmartpublish_toolBar">
        {{# if(d.tabStatus != -2){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="detail">详情</span><br>
        {{# } }}
        <%--<span class="layui-btn layui-btn-xs" lay-event="link">竞品链接</span><br>--%>
        <%--<span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="status">刊登状态</span><br>--%>
        <%--<span class="layui-btn layui-btn-xs layui-btn-warm devIdeaWayBtn" dataid="{{d.pId}}">开发思路</span>--%>
</script>

<%-- 弹框--详情 --%>
<script type="text/html" id="walmartpublish_detailLayer">
    <div id="walmartpublish_container" style="padding: 20px;">
    </div>
</script>
<script type="text/html" id="walmartpublish_containerTpl">
    <div>
        <%-- 必填属性 --%>
        <div>
            <div class="attr-title">必填属性</div>
            <div class="attr-content layui-form" id="walmartpublish_mustBeNeed">
                <input type="hidden" name="id" value="{{d.id}}">
                <input type="hidden" name="listingStatus" value="{{d.listingStatus}}">
                <div class="layui-form-item">
                    <div class="layui-form-label"><font color="red" size="4">*</font>Variant Group ID</div>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" value="{{d.storePSku || ''}}" name="variantGroup">
                    </div>
                </div>
                <div class="layui-form-item" style="position: releative">
                    <div class="layui-form-label"><font color="red" size="4">*</font>Item Name</div>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input ifFocusInput" value="{{d.title || ''}}" id="prohibitInputId" maxlength="200" name="itemName"
                        data-prodpid="{{d.prodPId}}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label"><font color="red" size="4">*</font>Brand</div>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" value="{{d.brand || ''}}" name="brand">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label">Product Tax Code</div>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="productTaxCode" value="{{d.productTaxCode || ''}}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label"><font color="red" size="4">*</font>Description</div>
                    <div class="layui-input-block">
                        <textarea id="walmartpublish_desc" style="display: none;" name="walmartpublish_desc">
                        {{d.describeHtml || ''}}</textarea>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-form-label"><font color="red" size="4">*</font>Key Features</div>
                    <div class="layui-input-block">
                        <textarea id="walmartpublish_key" style="display: none;" name="walmartpublish_key">
                            {{d.keyFeature || ''}}
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
        <%-- SKU变种属性 --%>
        <div id="walmartpublish_skuAttr">
            <div class="attr-title">SKU变种</div>
            <div style="display:flex;margin:20px 0;justify-content: flex-end;">
                <span class="layui-btn layui-btn-sm" id="walmartpublish_addSku">新增</span>
                <div style="display:flex;margin-left:20px;">
                    <input type="text" class="layui-input walmartpublish_batchSetPriceInp">
                    <span class="layui-btn layui-btn-sm walmartpublish_batchSetPriceBtn">批量设置价格</span>
                </div>
            </div>
            <div>
                {{# if(d.subSkuWalmartList.length){ }}
                <table class="layui-table">
                    <thead>
                        <tr>
                            <th>店铺子SKU</th>
                            <th>系统属性</th>
                            <th>变种属性</th>
                            <th>UPC</th>
                            <th>毛重(lb)</th>
                            <th>价格(USD)</th>
                            <th>刊登数量</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="walmartpublish_tbody">
                        {{#  layui.each(d.subSkuWalmartList, function(index, subList){ }}
                        <tr>
                            <td>{{subList.storeSSku}}</td>
                            <td>
                                颜色: <span class="color">{{subList.color || ''}}</span><br>
                                尺寸: <span class="size">{{subList.size || ''}}</span><br>
                                样式: <span class="style">{{subList.style || ''}}</span><br>
                            </td>
                            <td>
                                {{#  layui.each(subList.baseAttributeList, function(index, item){ }}
                                    <%-- 输入类型 --%>
                                    <div class="layui-form-item">
                                        <div class="layui-form-label" style="padding:0;">
                                            <input type="text" class="layui-input" value="{{item.attributeTitle || ''}}" disabled placeholder="属性名">
                                        </div>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" value="{{item.attributeValue || ''}}" name="attrVal" placeholder="属性值">
                                            <input type="hidden" name="dataType" value="{{item.dataType || ''}}">
                                            <input type="hidden" name="displayType" value="{{item.displayType || ''}}">
                                            <input type="hidden" name="required" value="{{item.required || 'false'}}">
                                        </div>
                                    </div>    
                                {{# }) }}
                            </td>
                            <td>
                                <input type="text" class="layui-input" value="{{subList.upc || ''}}">
                            </td>
                            <td>
                                <input type="text" class="layui-input" value="{{subList.grossWeight || ''}}">
                            </td>
                            <td>
                                <input type="text" class="layui-input" value="{{subList.price || ''}}">
                            </td>
                            <td>
                                <input type="text" class="layui-input" value="{{subList.quantity || ''}}" name="quantity">
                                <input type="hidden" value="{{subList.prodPId || ''}}" name="prodPId">
                                <input type="hidden" value="{{subList.prodTempId || ''}}" name="prodTempId">
                                <input type="hidden" value="{{subList.listingStatus}}" name="listingStatus">
                                <input type="hidden" value="{{subList.status || ''}}" name="status">
                                <input type="hidden" value="{{subList.listingId || ''}}" name="listingId">
                                <input type="hidden" value="{{subList.id || ''}}" name="id">
                            </td>
                            <td>
                                <span class="layui-btn layui-btn-xs layui-btn-danger">删除</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="8">
                                <div style="display:flex;" class="walmart_subImgs">
                                    <div style="width:200px;min-height:180px;" class="walmart_subMainImg">
                                        <img src="{{subList.subMainImg}}" width="150" height="150" class="img_show_hide b1" onerror="layui.admin.img_noFind()">
                                    </div>
                                    <div class="walmart_subExtraImgsContainer">
                                        <div>
                                            <span class="layui-btn layui-btn-sm walmartpublish_netImg">网络图片</span>
                                            <span class="layui-btn layui-btn-sm walmartpublish_localImg">本地图片</span>
                                            <span class="layui-btn layui-btn-sm walmartpublish_tempImg">模板图片</span>
                                            <span>说明：可拖动图片调整顺序！子SKU辅图最多选用7张</span>
                                        </div>
                                        <div class="walmart_subExtraImgs">
                                            {{#  layui.each(subList.extraImages.split('|'), function(index, img){ }}
                                            <div class="walmartp_imgContainer" draggable="true">
                                                <img src="{{img}}" width="100" height="100" class="b1" onerror="layui.admin.img_noFind()">
                                                <div class="opte">
                                                    <span class="setMainImg">设为主图</span>
                                                    <span class="removeImg">移除</span>
                                                </div>
                                            </div>
                                            {{# }) }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        {{# }) }}
                    </tbody>
                </table>
                {{# }else{ }}
                <div>暂无数据</div>
                {{# } }}
            </div>
        </div>
        <%-- 选填属性 --%>
        <div>
            <div class="attr-title">选填属性</div>
            <div class="attr-content layui-form" id="walmartpublish_optional_attr">
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
                            {{# if(item.attributeValue.split('&')[1] == attr){ }}
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

<script src="${ctx}/static/js/publishs/walmart/publish.js?v=${ver}"></script>
<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/productVariant.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/proTplData.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<!-- 模板图片 -->
<script type="text/html" id="walmartPublish_tplImg_tpl">
    <div class="layui-card layui-form">
        <div class="layui-card-header disflex">
            <span>供应商原图</span>
            <input type="checkbox" name="isSupplierOrigiImg" lay-skin="primary" disabled {{d.isSupplierOrigiImg ? 'checked':''}}>
        </div>
        <div class="layui-card-body">
            <!-- 主图 -->
            <div>
                <div style="color: #333;font-size: 16px;">主图</div>
                <div style="margin-top: 15px;" class="walmartpublish_tplimg_grid">
                    {{# layui.each(d.mainImgs,function(index,item){ }}
                    <div>
                        <div>
                            <div class="disfelx">
                                <input type="checkbox" name="checkbox1" lay-skin="primary" title="亚马逊图" disabled {{item.isAmazonImg ? 'checked' : '' }} />
                                <input type="checkbox" name="checkbox2" lay-skin="primary" title="清晰图" disabled {{item.isClear ? 'checked' : '' }} />
                            </div>
                            <div class="mt05">
                                <input type="checkbox" name="checkbox3" lay-skin="primary" title="非供图" disabled {{item.isNotSupplier ? 'checked' : '' }} />
                            </div>
                        </div>
                        <div class="mt05">
                            <img src="{{tplIVP+item.name}}!size=120x120" alt="" style="width: 120px;height:120px" class="walmartPublish-chooseTplImg">
                            <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}">
                        </div>
                    </div>
                    {{# }) }}
                </div>
            </div>
            <!-- 辅图 -->
            <div>
                <div  style="margin-top: 10px;color: #333;font-size: 16px;">辅图</div>
                <div class="walmartpublish_tplimg_grid">
                    {{# layui.each(d.assiImgs,function(index,item){ }}
                    <div style="margin-top: 15px;">
                        <div class="disfelx">
                            <div class="disflex">
                                <input type="checkbox" name="checkbox3" lay-skin="primary" title="必选图" disabled {{item.isMust ? 'checked' : '' }} />
                                <input type="checkbox" name="checkbox1" lay-skin="primary" title="亚马逊图" disabled {{item.isAmazonImg ? 'checked' : '' }} />
                            </div>
                            <div class="disflex mt05">
                                <input type="checkbox" name="checkbox2" lay-skin="primary" title="清晰图" disabled {{item.isClear ? 'checked' : '' }}/>
                                <input type="checkbox" name="checkbox3" lay-skin="primary" title="非供图" disabled {{item.isNotSupplier ? 'checked' : '' }} />
                            </div>
                        </div>
                        <div class="mt05">
                            <img src="{{tplIVP+item.name}}!size=120x120" alt="" style="width: 120px;height:120px" class="walmartPublish-chooseTplImg">
                            <input type="checkbox" name="tplUrl" lay-skin="primary" value="{{tplIVP+item.name}}">
                        </div>
                    </div>
                    {{# }) }}
                </div>
            </div>
        </div>
    </div>
</script>

<script src="${ctx}/static/components/lodash.js"></script>
