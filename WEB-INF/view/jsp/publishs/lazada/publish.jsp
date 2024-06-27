<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<link rel="stylesheet" href="${ctx}/static/simditor/simditor.css">
<title>lazada刊登</title>
<style>
    #lazadaPublish_extImg {
        overflow: hidden
    }

    #lazadaPublish_extImg li {
        float: left;
        margin-right: 10px
    }

    #lazadaPublish_searchForm .layui-form-item {
        margin-bottom: 0
    }

    td[class="colspan_td"] > table > tbody tr:first-child td {
        border-top: none;
    }

    td[class="colspan_td"] > table > tbody tr:last-child td {
        border-bottom: none;
    }

    td[class="colspan_td"] > table > tbody tr td {
        border-left: none;
        border-right: none;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
    }
    #lazadaPublish_table th,
    #lazadaPublish_table td {
    text-align: center;
    padding: 5px 0;
    white-space: normal;
    overflow: visible;
    word-wrap: break-word;
   }
    .lazadaPublish_table_head table,
    .lazadaPublish_table_body table {
        width: 100%;
        margin: 0;
        table-layout: fixed;
    }

    .lazadaSubImg_UL li {
        float: left;
        margin: 5px
    }

    .dis_flex{
        display: flex;
        justify-content: space-between;
    }
    /* #lazadaImgContainer {
        min-height: 160px;
        display: flex;
    } */
    #lazadaImgContainer .commonImg-imgsChild {
        width: 102px;
        display: inline-block;
        border: 1px solid #ccc;
        margin: 0 5px 5px 0;
    }

    #lazadaPublish_table .lazadaPublish-listfail:hover{
        cursor: pointer;
    }

    #lazadaPublish_editDetailForm .input95{
        width:95%;
        display: inline;
    }

    #lazadaPublish_editDetailForm .simditor{
        height: 300px;
        overflow: auto;
    }
    #lazadaPublish_searchForm .labelSel{
        padding: 0 0 0 15px;
        width: 95px;
    }
</style>
<div class="layui-fluid" id="lazada_publish">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="lazadaPublish_searchForm" lay-filter="lazadaPublish_salesSortFilter">
                        <div class="layui-form-item layui-row">
                            <input name="listingStatus" value="-2" type="hidden">
                            <input name="shippingStatus" value="" type="hidden">

                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select id="lazadaPublish_group_sel" name="orgId"
                                                lay-filter="orgs_hp_wishPersion_pb" lay-search class="orgs_hp_custom">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">销售员</label>
                                    <div class="layui-input-block">
                                        <select id="lazadaPublish_salesman_sel" name="sellerId"
                                                lay-filter="users_hp_wishPersion_pb" lay-search class="users_hp_custom"
                                                data-roleList="lazada专员">
                                        </select>
                                    </div>
                                </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" data-platcode="lazada" lay-filter="lazadaPublish_storeAcctId" lay-search class="store_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">类目</label>
                                <div class="layui-input-block">
<%--                                    <button id="lazadaPublish_cateSelBtn" type="button"--%>
<%--                                            class="layui-btn layui-btn-sm layui-btn-primary">选择分类--%>
<%--                                    </button>--%>
<%--                                    <i class="layui-icon layui-icon-delete"--%>
<%--                                       onclick="clearCate('LAY-publishs-lazada-publish-div','LAY-publishs-lazada-publish-hidden')"--%>
<%--                                       style="cursor:pointer" title="删除产品类目"></i>--%>
<%--                                    <input type="hidden" id="LAY-publishs-lazada-publish-hidden" name="cateId">--%>
                                    <input class="layui-input" id="lazadaPublish_lazadaCates" />
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 showInTotalTab">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="devType">
                                        <option value="" selected>全部</option>
                                        <c:forEach items="${devTypeEnums}" var="devType">
                                            <option value="${devType.getName()}">${devType.getName()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2 showInTotalTab">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="tag">
                                        <option value="" selected>全部
                                            <c:forEach items="${prodTagMap}" var="prodTag">
                                        <option value="${prodTag.value.name}">${prodTag.value.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 showInTotalTab">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectAttr_lazada" xm-select-search xm-select-search-type="dl"
                                            xm-select-skin="normal" lay-filter='selectAttr_lazada'>
                                        <c:forEach items="${logisAttrEnums}" var="logisAttrEnum">
                                            <option value="${logisAttrEnum.getName()}">${logisAttrEnum.getName()}</option>
                                            <option value='no_${logisAttrEnum.getName()}'>
                                                不含${logisAttrEnum.getName()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 showInTotalTab">
                                <label class="layui-form-label">商品归属人</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectMan_lazada" name="bizzOwnerIds" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <c:forEach items="${bizzOwners}" var="bizzOwner">
                                            <option value="${bizzOwner.id}">${bizzOwner.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="tortBanListing">
                                        <%-- <c:forEach items="${tortBanListings}" var="tortBanListing">
                                            <option value="${tortBanListing.name()}">${tortBanListing.getText().replace("该平台","lazada")}</option>
                                        </c:forEach> --%>
                                        <option value="CURRENT_PLAT">lazada不侵权</option>
                                        <option value="ANY_PLAT">所有平台都不侵权</option>
                                        <option value="ALL">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select xm-select="isSaleListLazadaPublish" name="isSaleList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                        <option value="2" selected>全部在售</option>
                                        <option value="1" selected>部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 showInTotalAndToListingTab">
                                <label class="layui-form-label">刊登情况</label>
                                <div class="layui-input-block">
                                    <select name="isPublish">
                                        <option value="">全部</option>
                                        <option value="false" selected>未刊登</option>
                                        <option value="true">已刊登</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 showInTotalTab">
                                <label class="layui-form-label">商品类型</label>
                                <div class="layui-input-block">
                                    <select name="multiSub">
                                        <option value="" selected>全部</option>
                                        <option value="false">单属性</option>
                                        <option value="true">多属性</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 showInTotalTab">
                                <label class="layui-form-label">生成情况</label>
                                <div class="layui-input-block">
                                    <select name="existListing">
                                        <option value="">全部</option>
                                        <option value="false" selected>未生成</option>
                                        <option value="true">已生成</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">是否禁售</label>
                                <div class="layui-input-block">
                                    <select name="canSaleBool">
                                        <option value="true" selected>非禁售</option>
                                        <option value="false">禁售</option>
                                        <option value="" >全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType" id="lazadaPublishTimeType">
                                        <option value="CREATE_TIME">创建时间</option>
                                        <option value="AUDIT_TIME">审核时间</option>
                                        <option value="PUBLISH_TIME">刊登时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="time" autocomplete="off" class="layui-input"
                                           id="lazadaPublishTime">
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-filter="lazadaPublish_showHideVagueFlag">
                                        <option value="pSkus">父SKU</option>
                                        <option value="sSkus">模板子SKU</option>
                                        <option value="cnTitle">商品中文</option>
                                        <option value="enTitle">商品英文</option>
                                    </select>
                                </div>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-md9 layui-col-lg9">
                                    <input name="searchText" type="text" class="layui-input" placeholder="">
                                    </div>
                                    <div id="lazada_skuVagueFlag_div" class="layui-col-md3 layui-col-lg3">
                                        <select name="skuVagueFlag">
                                            <option value="false">精确</option>
                                            <option value="true">模糊</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 showInTotalTab" id="lazadaPublish_btn_modelcreator">
                                <label class="layui-form-label">创建人</label>
                                <div class="layui-input-block">
                                    <select name="modelCreatorId" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 showInTotalTab">
                                <label class="layui-form-label">组合模板</label>
                                <div class="layui-input-block">
                                    <select name="groupTemplate">
                                        <option value="">全部</option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label" style="width:110px;padding:9px 0px">全平台<span class="lazadaPublishSalessite">国家</span>销量</label>
                                <div class="layui-form-label labelSel" style="padding:0 0 0 0px;width:65px;">
                                    <select name="allPlatCuntSaleType" id="">
                                        <option value="1">7日</option>
                                        <option value="2">15日</option>
                                        <option value="3">30日</option>
                                        <option value="4">60日</option>
                                        <option value="5">90日</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input type="text" name="allPlatCountGreat" autocomplete="off" class="layui-input">
                                    <input type="text" name="allPlatCountLess" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label" style="width:97px;padding:9px 0px">全平台销量</label>
                                <div class="layui-form-label labelSel" style="padding:0 0 0 13px;width:65px;">
                                    <select name="searchSalesType" id="searchSalesType">
                                        <option value="1">7日</option>
                                        <option value="2">15日</option>
                                        <option value="3">30日</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input type="text" name="salesMin" autocomplete="off" class="layui-input" id="salesMin">
                                    <input type="text" name="salesMax" autocomplete="off" class="layui-input" id="salesMax">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" id="lazadaPublish_btn_stockType">
                                <div class="layui-form-label labelSel" style="display:flex;width:160px;">
                                    <select name="stockType" id="stockType">
                                        <option value="1">预计可用含在途</option>
                                        <option value="2">预计可用不含在途</option>
                                    </select>
                                    <select name="preAvailableAllSku">
                                        <option value="false">部分属性</option>
                                        <option value="true">全部属性</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex">
                                    <input type="text" name="greaterThenStock" autocomplete="off" class="layui-input" id="greaterThenStock">
                                    <input type="text" name="lessThenStock" autocomplete="off" class="layui-input" id="lessThenStock">
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2 showInTotalToListingTab">
                                <div class="layui-form-label">成本</div>
                                <div class="layui-input-block dis_flex">
                                    <input type="text" name="priceMin" autocomplete="off" class="layui-input">
                                    <input type="text" name="priceMax" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 showInTotalToListingTab">
                                <div class="layui-form-label">重量</div>
                                <div class="layui-input-block dis_flex">
                                    <input type="text" name="weightMin" autocomplete="off" class="layui-input">
                                    <input type="text" name="weightMax" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" id="lazadaPublish_btn_needFilterStock">
                                <label class="layui-form-label">库存</label>
                                <div class="layui-input-block">
                                    <input type="checkbox" name="needFilterStock" title="过滤零库存" lay-skin="primary" value="true">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 listingRespMsgDiv disN">
                                <div class="layui-form-label">失败原因</div>
                                <div class="layui-input-block">
                                    <input type="text" name="listingRespMsg" autocomplete="off" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div style="margin-left:20px">
                                    <button class="layui-btn layui-btn-sm keyHandle" type="button"
                                            onClick="lazadaPublish_searchProd()" id="lazadaPublish_search">搜索
                                    </button>
                                    <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset"
                                            id="lazadaPublish_reset">清空
                                    </button>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 layui-col-md-offset6 salesSortStyle">
                                <div class="layui-input-block">
                                    <select name="salesSort" id="lazadaPublish_salesSort"  lay-filter="lazadaPublish_salesSortFilter">
                                        <option value="1">7日销量倒序排列</option>
                                        <option value="2">15日销量倒序排列</option>
                                        <option value="3">30日销量倒序排列</option>
                                        <option value="4">模板创建时间升序</option>
                                        <option value="5">模板创建时间降序</option>
                                        <option value="6">模板刊登时间升序</option>
                                        <option value="7">模板刊登时间降序</option>
                                        <option value="8">模板审核时间升序</option>
                                        <option value="9">模板审核时间降序</option>
                                        <option class="sortTypeHide" value="10">预计可用库存不含在途正序</option>
                                        <option class="sortTypeHide" value="11">预计可用库存不含在途倒序</option>
                                        <option class="sortTypeHide" value="12">预计可用库存含在途正序</option>
                                        <option class="sortTypeHide" value="13">预计可用库存含在途倒序</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div id="LAY-publishs-lazada-publish-div"></div>
                </div>
            </div>
            <div class="layui-card" id="lazadaPublishCard">
                <div class="layui-card-body">
                        <div id="lazada_btn_show_hide" style="position: absolute; right: 10px; z-index: 999">
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                                        id="lazadaPublish_btn_genListing"
                                        onclick="lazadaPublish_genToListingProd()">生成店铺商品
                                </button>
                                <button class="layui-btn layui-btn-sm layui-btn-danger disN" type="button"
                                        id="lazadaPublish_btn_delListing"
                                        onclick="lazadaPublish_deletelisting()">删除店铺商品
                                </button>
                                <div class="layui-input-inline w100 layui-form disN" id="lazadaPublish_div_selPubStyle">
                                    <select id="lazadaPublish_selPubStyle" lay-filter="lazadaPublish_selPubStyle_filter">
                                        <option value="" disabled selected>刊登</option>
                                        <option value="1">立即刊登</option>
                                        <option value="2">定时刊登</option>
                                    </select>
                                </div>
                                <button id="lazadaPublish_btn_cancleOnTime" class="layui-btn layui-btn-sm layui-btn-danger disN"
                                        type="button" onclick="lazadaPublish__canclePublishOnTiming()">取消定时刊登
                                </button>
        
                                <button id="lazadaPublish_btn_pubNow" class="layui-btn layui-btn-sm disN" type="button"
                                        onclick="lazadaListingPublish('',false)">发布上架
                                </button>
                                <%--<button id="lazadaPublish_btn_exportSku" class="layui-btn layui-btn-sm layui-btn-danger"--%>
                                        <%--type="button" onclick="lazadaPublish_exportskumapping()">导出SKU映射--%>
                                <%--</button>--%>
        
                                <button id="lazadaPublish_btn_pubOnTime" class="layui-btn layui-btn-sm layui-btn-primary disN"
                                        type="button" onclick="lazadaPublish_OnTiming()">定时刊登
                                </button>
                                <button id="lazadaPublish_btn_rePubNow" class="layui-btn layui-btn-sm layui-btn-primary disN"
                                        type="button" onclick="lazadaListingPublish('',false)">重新发布
                                </button>
                        </div>
                    <div class="layui-tab" lay-filter="lazadaPublish_tab">
                        <div style="height:40px;line-height:40px;">
                            <ul class="layui-tab-title">
                                <li data-value="-2" class="layui-this" id="totalNum">商品(0)</li>
                                <li data-value="0" id="toListingNum">待刊登(0)</li>
                                <li data-value="3" id="lazada_listingNum">刊登中(0)</li>
                                <li data-value="1" id="listingSucNum">刊登成功(0)</li>
                                <li data-value="2" id="listingFailNum">刊登失败(0)</li>
                            </ul>
                        </div>
                        <div class="layui-tab-content">
                            <div id="lazadaPublish_table">

                            </div>
                            <div id="lazadaPublish_pagination" class="customPagination"></div>
                            <!--模板文件-->
                            <script type="text/html" id="lazadaPublish_tpl">
                                <div class="lazadaPublish_table_head">
                                    <table class="layui-table">
                                        <colgroup>
                                            <col width="30px">
                                            <col width="70px">
                                            <col width="10%">
                                            <col width="10%">
                                            <col width="70px">
                                            <col width="10%">
                                            <col width="100px">
                                            <col width="100px">
                                            <col width="30px">
                                            <col width="10%">
                                            <col width="60px">
                                            <col width="60px">
                                            <col width="60px">
                                            <col width="60px">
                                            <col width="60px">
                                            <col width="60px">
                                            <col width="5%">
                                            <col width="8%">
                                            <col width="5%">
                                            <col width="5%">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div class="layui-form">
                                                        <input type="checkbox" class="pid-all-cbox" lay-skin="primary">
                                                    </div>
                                                </th>
                                                <th>缩略图</th>
                                                <th>标题</th>
                                                <th>商品名</th>
                                                <th>开发专员</th>
                                                <th>父SKU</th>
                                                <th>全平台销量</th>
                                                <th>全平台<span class="lazadaPublishSalessite_th">国家</span>销量</th>
                                                <th style="width: 30px"></th>
                                                <th>模板子SKU</th>
                                                <th class="storeSubSkuInfo">店铺子SKU</th>
                                                <th>颜色</th>
                                                <th>尺寸</th>
                                                <th class="listingInfo" id="lazadaPublish_currency_th">售价()</th>
                                                <th>在售</th>
                                                <th  class="quantityInfo">预计可用库存含在途/不含在途</th>
                                                <th>成本</th>
                                                <th>重量</th>
                                                <th>站点</th>
                                                <th>类目</th>
                                                <th class="timeClass">时间</th>
                                                <th class="creatorClass">创建人</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                                <div class="lazadaPublish_table_body" style="margin-top: -6px">
                                    <table class="layui-table">
                                        <colgroup>
                                            <col width="30px">
                                            <col width="70px">
                                            <col width="10%">
                                            <col width="10%">
                                            <col width="70px">
                                            <col width="10%">
                                            <col width="100px">
                                            <col width="100px">
                                            <col width="30px">
                                            <col width="10%">
                                            <col width="60px">
                                            <col width="60px">
                                            <col width="60px">
                                            <col width="60px">
                                            <col width="60px">
                                            <col width="60px">
                                            <col width="5%">
                                            <col width="8%">
                                            <col width="5%">
                                            <col width="5%">
                                        </colgroup>
                                        <tbody>
                                        {{ each data v i}}
                                        <tr class="skus-tr tr{{v.id}}">
                                            <td>
                                                <div class="layui-form">
                                                    <input type="checkbox" class="pid-cbox" lay-skin="primary" value={{ v.id }}
                                                        name="id">
                                                </div>
                                            </td>
                                            <td>
                                                <img width="60" height="60"  data-original="{{GlobalDomainImgSrc(v.mainImage)}}" class="img_show_hide lazy b1" data-onerror="layui.admin.img_noFind()">
                                            </td>
                                            <td>
                                                {{if v.name }}
                                                    {{ v.name }}<br/>
                                                {{/if}}
                                                {{if v.enTitle }}
                                                    {{ v.enTitle }}<br/>
                                                {{/if}}
                                            </td>
                                            <td>
                                                {{ v.cnTitle }}<br/>
                                            </td>
                                            <td>
                                                <span>{{ v.bizzOwner }}</span>
                                                {{ if v.storeAcct }}
                                                    <span>{{ v.storeAcct }}</span>
                                                {{/if}}
                                            </td>
                                            <td>
                                                <a href="javascrpt:;" id="prodDetail" data-id={{v.prodPId}} style="color:blue">{{
                                                    v.pSku }}</a>
                                                {{if v.onlinePublishStatus||v.existListing }}
                                                {{if v.onlinePublishStatus}}
                                                <span class="layui-bg-green">已刊登</span>
                                                {{/if}}
                                                {{if v.existListing}}
                                                <span class="layui-bg-orange">已生成</span>
                                                {{/if}}
                                                <br/>
                                                {{/if}}
                                                {{if v.storePSku }}
                                                <div class="storeSkuInfo">
                                                    <span>店铺父SKU:</span><br/>
                                                    {{ v.storePSku }}
                                                    {{if v.listingStatus == 0}}
                                                    <span class="layui-bg-orange hp-badge ml5 lazadaPublish_status  lazadaPublish-unlist">待</span>
                                                    <span class="layui-hide lazadaPublish-unlistreason">{{v.listingRespMsg}}</span>
                                                    {{else if v.listingStatus == 1}}
                                                    <span class="layui-bg-green hp-badge ml5 lazadaPublish_status lazadaPublish-listsucc">已</span>
                                                    {{else if v.listingStatus == 2}}
                                                    <span class="layui-bg-gray hp-badge ml5 lazadaPublish_status lazadaPublish-listfail">败</span>
                                                    <span class="layui-hide lazadaPublish-listfailreason">{{v.listingRespMsg}}</span>
                                                    {{else if v.listingStatus == 3}}
                                                    <span class="layui-bg-blue hp-badge ml5 lazadaPublish_status lazadaPublish-inlist">中</span>
                                                    {{/if}}
                                                </div>
                                                {{/if}}
                                                {{ if v.globalPublish }}
                                                <br/><span  class="layui-bg-orange">其他站点:</span><span class="layui-bg-red">{{v.globalSites}}</span>
                                                {{/if}}
                                                {{ if v.groupTemplate }}
                                                <br/><span class="layui-badge layui-bg-green">组</span>
                                                {{/if}}

                                            </td>
                                            <td>
                                                7日：{{v.saleNumLazadaSeven }}
                                                <br>
                                                15日：{{v.saleNumLazadaFifteen  }}
                                                <br>
                                                30日：{{v.saleNumLazadaThirty }}
                                            </td>
                                            <td>
                                                7日：{{v.allPlatSevenSalesNum || 0 }}
                                                <br>
                                                15日：{{v.allPlatFiftySalesNum || 0  }}
                                                <br>
                                                30日：{{v.allPlatThirtySalesNum || 0 }}
                                                <br>
                                                60日：{{v.allPlatSixtySalesNum || 0  }}
                                                <br>
                                                90日：{{v.allPlatNinetySalesNum || 0 }}
                                            </td>
                                            <td colspan="8" style="padding: 10px 0" class="colspan_td">
                                                <table style='width: 100%'>
                                                    <tbody>
                                                    {{ each v.prodListingSubSkuLazadas }}
                                                    {{if $index<5}}
                                                        <tr>
                                                    {{else}}
                                                    <tr   class="myj-hide">
                                                    {{ /if }}
                                                        <td width="30">
                                                            <div class="layui-form">
                                                                {{if $value.id != ''}}
                                                                <input type="checkbox" class="sid-cbox" lay-skin="primary"
                                                                    value={{$value.id}}>
                                                                {{/if}}
                                                            </div>
                                                        </td>
                                                        <td width='140'>

                                                            <span>
                                                                {{if $value.sSku}}
                                                                {{ $value.sSku }}
                                                                {{else}}
                                                                <font class="layui-gray">不存在</font>
                                                                {{/if}}
                                                            </span>
                                                            {{if $value.listingStatus == 0}}
                                                            <span class="layui-bg-orange hp-badge ml5  lazadaPublish-unlist">待</span>
                                                            <span class="layui-hide lazadaPublish-unlistreason">{{$value.listingRespMsg}}</span>
                                                            {{else if $value.listingStatus == 1}}
                                                            <span class="layui-bg-green hp-badge ml5 lazadaPublish-listsucc">已</span>
                                                            {{else if $value.listingStatus == 2}}
                                                            <span class="layui-bg-gray hp-badge ml5 lazadaPublish-listfail">败</span>
                                                            <span class="layui-hide lazadaPublish-listfailreason">{{$value.listingRespMsg}}</span>
                                                            {{else if $value.listingStatus == 3}}
                                                            <span class="layui-bg-blue hp-badge ml5 lazadaPublish-inlist">中</span>
                                                            {{/if}}
                                                        </td>
                                                        <td class="storeSubSkuInfo" width='120'>{{ $value.storeSSku
                                                            }}
                                                        </td>
                                                        <td>{{ $value.color }}</td>
                                                        <td>{{ $value.size }}</td>
                                                        <td class="listingInfo">{{ $value.specialPrice }}</td>
                                                        <td>
                                                            {{if null==$value.isSale}}
                                                            {{else if $value.isSale}}
                                                            <span class="layui-green lazadaPublish-isSale">在售</span>
                                                            {{else}}
                                                            <span class="layui-gray lazadaPublish-isNotSale">停售</span>
                                                            {{/if}}
                                                        </td>
                                                        <td class="quantityInfo">{{ ($value.preAvailableStockAll || 0)  + '/' + ($value.preAvailableStock || 0)}}</td>
                                                        <td>{{$value.cost}}</td>
                                                        <td>{{$value.weight}}</td>
                                                    </tr>
                                                    {{ /each }}
                                                    </tbody>
                                                </table>
                                                {{  if(v.prodListingSubSkuLazadas && v.prodListingSubSkuLazadas.length > 5)}}
                                                <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;"><span>+ 展开</span>({{v.prodListingSubSkuLazadas.length}})</a>
                                            {{/if}}
                                            </td>
                                            <td>
                                                {{v.salesSite}}
                                            </td>
                                            <td>
                                                {{v.fullCateName}}
                                            </td>
                                            <td class="timeClass" style="width: 150px">
                                                <div class="auditTime">
                                                    {{if v.createTime}}
                                                    <span class="layui-green">创建:{{v.createTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span><br/>
                                                    {{/if}}
                                                    {{if v.modifyTime}}
                                                    <span class="layui-green">更新:{{v.modifyTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                                                    {{/if}}
                                                </div>
                                                <div class="listingTime">
                                                    {{if v.listingTime}}
                                                    <span class="layui-green">刊登:{{v.listingTime| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                                                    {{/if}}
                                                </div>
                                                <div class="listTiming">
                                                    {{if v.listTiming}}
                                                    <span class="layui-green">定时:{{v.listTiming| dateFormat 'yyyy-MM-dd hh:mm'}}</span>
                                                    {{else}}
                                                    <span class="layui-green">刊登中</span>
                                                    {{/if}}
                                                </div>
                                            </td>
                                            <td class="creatorClass">
                                                {{v.creator}}<br>
                                                创建时间：{{v.createTime| dateFormat 'yyyy-MM-dd hh:mm'}}
                                            </td>
                                            <td>
                                                <div class="detailInfoBtn">
                                                <button type="button" class="layui-btn layui-btn-xs mb3"
                                                        onclick="lazadaPublish__layer_lazada('{{v.id}}')">详情
                                                </button>
                                                <br>
                                                </div>
                                                <button type="button" class="layui-btn layui-btn-xs mb3"
                                                        onclick="compUrl_producttpl('{{v.pSku}}','{{v.prodPId}}')">竞品链接
                                                </button>
                                                <br>
                                                <button type="button" class="layui-btn layui-btn-xs mb3"
                                                        onclick="producttpl_getListingStatus('{{v.prodPId}}')">刊登状态
                                                </button>
                                                <br>
                                                <div class="publishBtn">
                                                <button type="button"
                                                        class="layui-btn layui-btn-warm  layui-btn-xs mb3"
                                                        onclick="lazadaListingPublish('{{v.id}}',false)">发布上架
                                                </button>
                                                <br>
                                                </div>
                                                <button  type="button" class="layui-btn layui-btn-xs layui-btn-xs mb3 devIdeaWayBtn" dataid="{{v.prodPId}}">开发思路</button><br>
                                            </td>
                                        </tr>
                                        {{ /each }}
                                        </tbody>
                                    </table>
                                </div>
                            </script>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!--待发布详情弹框-->
<script type="text/html" id="lazadaPulish_listDetailTpl">
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-col-lg12 layui-col-md12">
                <form action="" class="layui-form" id="lazadaPublish_editDetailForm">
                    <input name="lazadaListingId" type="text" value="{{d.prodListingLazada.id}}" hidden>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">店铺父SKU:</label>
                            <div class="layui-input-block">
                                <input name="storePSku" readonly value="{{d.prodListingLazada.storePSku}}" type="text"
                                       class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">品牌:
                            </label>
                            <div class="layui-input-block">
                                <input name="brand" value="{{d.prodListingLazada.brand}}" type="text" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">刊登标题:
                                <!--<button id="lazadaPublish_upcase" type="button" class="layui-btn layui-btn-xs"-->
                                        <!--onclick="lazadaPublish_upCaseTitle()">-->
                                    <!--首字母大写-->
                                <!--</button>-->
                            </label>
                            <div class="layui-input-block">
                                <input name="title" oninput="lazadaPublish_titleNumNote(this)" data-prodpid="{{d.prodListingLazada.prodPId}}" value="{{d.prodListingLazada.name || ''}}" type="text"
                                style="width: 100%" class="layui-input input95 ifFocusInput">
                                <!-- <span>{{d.prodListingLazada.name.length}}</span> / 255 -->
                            </div>
                            {{# if(d.prodListingLazada.salesSite == 'MY' ){ }}
                                <label class="layui-form-label">刊登标题(马来西亚):
                                </label>
                                <div class="layui-input-block">
                                    <input name="myName" oninput="lazadaPublish_titleNumNote(this)" value="{{d.prodListingLazada.myName || '' }}" type="text" class="layui-input input95">
                                    <span>{{d.prodListingLazada.myName.length}}</span> / 255
                                </div>
                            {{# } }}
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">长描述:</label>
                            <div class="layui-input-block">
<%--                                <textarea id="lazadaPublish_desc_editor_ID" autofocus>--%>
<%--                                </textarea>--%>
                                <div id="lazadaPublish_desc_editor_ID"></div>
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">高亮描述:</label>
                            <div class="layui-input-block">
<%--                                <textarea id="lazadaPublishWang_highlights_editor_ID" autofocus>--%>
<%--                                </textarea>--%>
                                <div id="lazadaPublishWang_highlights_editor_ID"></div>
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">taxes:
                            </label>
                            <div class="layui-input-block">
                                <input name="taxes" value="{{d.prodListingLazada.taxes}}" type="text" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div calss="layui-card">
                        <div class="layui-form-item">
                            <label class="layui-form-label">包装规格:
                            </label>
                            <div class="layui-input-block" style="display:flex">
                                <div style="flex: 1">
                                 长:<input name="packageLength" value="{{d.prodListingLazada.packageLength}}" type="text" class="layui-input" style="width:200px;display:inline-block">
                                </div>
                                <div style="flex: 1">
                                  宽:<input name="packageWidth" value="{{d.prodListingLazada.packageWidth}}" type="text" class="layui-input" style="width:200px;display:inline-block">
                                </div>
                                <div style="flex: 1">
                                  高:<input name="packageHeight" value="{{d.prodListingLazada.packageHeight}}" type="text" class="layui-input"  style="width:200px;display:inline-block">
                                </div>
                            </div>
                            <br>
                            <label class="layui-form-label">包装内容:</label>
                            <div class="layui-input-block">
                                    <textarea name="packageContent" type="text" class="layui-textarea" style="height: 100px">{{d.prodListingLazada.packageContent}}</textarea>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">类目属性:</label>
                            <div class="layui-input-block">
                                <textarea name="attrKeyVal" type="text" class="layui-textarea" style="height: 100px">{{d.prodListingLazada.attrKeyVal}}</textarea>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">图片:</label>
                            <div class="layui-input-block" style="overflow:hidden;">
                                <div style="margin: 5px 0">
                                    <span class="layui-btn layui-btn-normal layui-btn-sm lazadaInternetImgBtn">
                                        网络图片
                                    </span>
                                    <span class="layui-btn layui-btn-danger layui-btn-sm lazadaLocalImgBtn">
                                        本地图片
                                    </span>
                                    <input type="file" style="display:none;">
                                    <span class="layui-btn layui-btn-sm" id="lazadaTplImg" onclick="lazada_publish_addImgByTpl({{d.prodListingLazada.prodPId}})">模板图片</span>
                                    <span>
                                        <font size="2" color="red">说明！</font> sku辅图最多选用8张
                                    </span>
                                </div>
                                <div id="lazadaImgContainer">
                                {{# if(d.prodListingLazada.pImages){ }}
                                {{# layui.each(d.prodListingLazada.pImages.split("|"), function(index, item){ }}
                                    <div class="commonImg-imgsChild">
                                        <img src="{{item}}" width="100" height="100" onerror="layui.admin.img_noFind()" class="img_show_hide">
                                        <div class="opte" onclick="imgRemove_handleFn(this)">
                                            <span class="removeImg">移除</span>
                                        </div>
                                    </div>
                                {{# }); }}
                                {{# } }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="layui-card">
                        <div class="layui-card-header">
                            <span>SKU信息</span>
                            <div class="fr" style="width: 550px;display: flex;box-sizing: border-box">
                                <button type="button" class="addLazadaSubListing layui-btn layui-btn-sm layui-btn-warm disN" onclick="lazadaListingPublish_updatePrice()">
                                    更新价格
                                </button>
                            </div>
                            <!--<button type="button"-->
                            <!--class="addLazadaSubListing layui-btn layui-btn-sm layui-btn-normal fr disN"-->
                            <!--onclick="addLazadaSubListing()">-->
                            <!--添加一行-->
                            <!--</button>-->
                        </div>
                        <div class="layui-card-body">
                            <table class="layui-table" id="listingInfo_sub_tab">
                                <thead>
                                <tr>
                                    <th hidden>id</th>
                                    <th>店铺SKU</th>
                                    <th>重量(g)</th>
                                    <th>颜色</th>
                                    <th>尺寸</th>
                                    <th width='210px'>刊登价格</th>
<%--                                    <th>促销开始时间</th>--%>
<%--                                    <th>促销结束时间</th>--%>
                                    <th width='210px'>促销价格</th>
                                    <th>刊登数量</th>
                                    <th width='40'>状态</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody id="lazadaPublish_SubSkuInfo">
                                {{# layui.each(d.subSkuLazadaDtos, function(index, subSkuLazadaDto){ }}
                                <tr>
                                    <td hidden>{{subSkuLazadaDto.id}}</td>
                                    <td>{{subSkuLazadaDto.storeSSku}}</td>
                                    <td>{{subSkuLazadaDto.weight}}</td>
                                    <td>{{subSkuLazadaDto.color}}
                                    </td>
                                    <td>{{subSkuLazadaDto.size}}
                                    </td>
                                    <td>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">马来(MYR):</label>
                                            <input type='number' name="myRetailPrice" class="layui-input" value='{{subSkuLazadaDto.myRetailPrice}}'>
                                        </div>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">新加坡(SGD):</label>
                                            <input type='number' name="sgRetailPrice" class="layui-input" value='{{subSkuLazadaDto.sgRetailPrice}}'>
                                        </div>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">印尼(IDR):</label>
                                            <input type='number' name="idRetailPrice" class="layui-input" value='{{subSkuLazadaDto.idRetailPrice}}'>
                                        </div>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">菲律宾(PHP):</label>
                                            <input type='number' name="phRetailPrice" class="layui-input" value='{{subSkuLazadaDto.phRetailPrice}}'>
                                        </div>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">泰国(THB):</label>
                                            <input type='number' name="thRetailPrice" class="layui-input" value='{{subSkuLazadaDto.thRetailPrice}}'>
                                        </div>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">越南(VND):</label>
                                            <input type='number' name="vnRetailPrice" class="layui-input" value='{{subSkuLazadaDto.vnRetailPrice}}'>
                                        </div>
                                    </td>

<%--                                    <td><input  class="layui-input"  id="promStartDate_{{subSkuLazadaDto.id}}"   value="{{ format( subSkuLazadaDto.promStartDate, 'yyyy-MM-dd hh:mm')}}"></td>--%>
<%--                                    <td><input  class="layui-input"  id="promEndDate_{{subSkuLazadaDto.id}}"   value="{{ format( subSkuLazadaDto.promEndDate, 'yyyy-MM-dd hh:mm')}}"></td>--%>
                                    <td>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">马来(MYR):</label>
                                            <input type='number' name="mySalesPrice" class="layui-input" value='{{subSkuLazadaDto.mySalesPrice}}'>
                                        </div>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">新加坡(SGD):</label>
                                            <input type='number' name="sgSalesPrice" class="layui-input" value='{{subSkuLazadaDto.sgSalesPrice}}'>
                                        </div>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">印尼(IDR):</label>
                                            <input type='number' name="idSalesPrice" class="layui-input" value='{{subSkuLazadaDto.idSalesPrice}}'>
                                        </div>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">菲律宾(PHP):</label>
                                            <input type='number' name="phSalesPrice" class="layui-input" value='{{subSkuLazadaDto.phSalesPrice}}'>
                                        </div>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">泰国(THB):</label>
                                            <input type='number' name="thSalesPrice" class="layui-input" value='{{subSkuLazadaDto.thSalesPrice}}'>
                                        </div>
                                        <div class="layui-input-inline" style="width:100px">
                                            <label calss="layui-form-label">越南(VND):</label>
                                            <input type='number' name="vnSalesPrice" class="layui-input" value='{{subSkuLazadaDto.vnSalesPrice}}'>
                                        </div>
                                    </td>

                                    <td><input type='number' class="layui-input" value='{{subSkuLazadaDto.quantity}}'></td>
                                    <td>{{# if(subSkuLazadaDto.listingStatus==1){ }}
                                        成功
                                        {{# }else if(subSkuLazadaDto.listingStatus==2){ }}
                                        失败
                                        {{# }else if(subSkuLazadaDto.listingStatus==3){ }}
                                        刊登中
                                        {{# }else if(subSkuLazadaDto.listingStatus==0){ }}
                                        待刊登
                                        {{# } }}
                                    </td>
                                    <td>
                                        {{# if(subSkuLazadaDto.listingStatus==1 || subSkuLazadaDto.listingStatus==3){ }}
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled">移除
                                        </button>
                                        {{# }else{ }}
                                        <button type="button" class="layui-btn layui-btn-sm"
                                                onclick="removeLazadaSubListing(this)">移除
                                        </button>
                                        {{# } }}
                                    </td>
                                </tr>
                                <tr class="lazadaPublish_detail_pic_class">
                                    <td colspan="3">
                                        <label calss="layui-form-label">类目属性:</label>
                                            <textarea name="attrKeyVal" type="text" class="layui-textarea" style="height: 100px">{{subSkuLazadaDto.attrKeyVal}}</textarea>
                                    </td>
                                    <td colspan="8">
                                        <div>
                                            <div class="ImgDivIn lazadaPublish_mainImg" style="height:300px;width: 280px;display:flex;">
                                                <input type="hidden" name="thumbnail" value="{{subSkuLazadaDto.thumbnail}}">
                                                <img style="height:250px;max-width: 250px" src="{{GlobalDomainImgSrc(subSkuLazadaDto.thumbnail)}}"  class='b1' onerror="layui.admin.img_noFind()">
                                                <div style="display:flex;">
                                                    <span class="layui-btn layui-btn-normal layui-btn-sm lazadaInternetImgSubBtn">
                                                        网络图片
                                                    </span>
                                                    <span class="layui-btn layui-btn-danger layui-btn-sm lazadaLocalImgSubBtn">
                                                        本地图片
                                                    </span>
                                                    <input type="file" style="display:none;">
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                {{# }); }}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
            </div>


        </div>
    </div>
</script>


<!--定时刊登-->
<script type="text/html" id="lazadaPulish_listTimingTpl">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group" id="lazadaPulish_listTiming_form">
            <div class="layui-form-item">
                <label class="layui-form-label">定时刊登开始时间:</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="lazadaPulish_listTiming" name="listTiming">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">listing刊登间隔(分):</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="listInterval">
                </div>
            </div>
            <div class="layui-form-item disN" id="lazadaPulish_listTiming_form_site">
                <label class="layui-form-label">站点:</label>
                <div class="layui-input-block">
                    <input type="checkbox" class="lazada_LFS_P_c" name="ALL" lay-filter="lazada_LFS_P_c" title="全选" lay-skin="primary">
                    <input type="checkbox" name="SG" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c" title="新加坡" lay-skin="primary">
                    <input type="checkbox" name="ID" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c" title="印尼" lay-skin="primary">
                    <input type="checkbox" name="TH" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c" title="泰国" lay-skin="primary">
                    <input type="checkbox" name="PH" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c" title="菲律宾" lay-skin="primary">
                    <input type="checkbox" name="VN" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c" title="越南" lay-skin="primary">
                    <input type="checkbox" name="MY" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c" title="马来西亚" lay-skin="primary">
                </div>
            </div>

        </form>
    </div>
</script>
<script src="${ctx}/static/tagsinput/tagsinput.js"></script>

<!-- 增删子sku-->
<script type="text/html" id="lazadaPulish_listSubTrTpl">
    {{#  layui.each(d, function(index, subSkuLazadaDto){ }}
    <tr>
        <td hidden>{{subSkuLazadaDto.id}}</td>
        <td>
            {{# if(subSkuLazadaDto.subImgUri){ }}
            <img width="60" height="60" src="{{subSkuLazadaDto.subImgUri}}">
            <a class="img_ssku_uri disN">{{subSkuLazadaDto.subImgUri}}</a>
            {{# }else{ }}
            <img width="60" height="60" src="" onerror="layui.admin.img_noFind()">
            <a class="img_ssku_uri disN"></a>
            {{# } }}
        </td>
        <td>{{subSkuLazadaDto.storeSSku}}</td>
        <td><input type='text' name="color" class="layui-input" value='{{subSkuLazadaDto.color || ""}}'
                   onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
        </td>
        <td><input type='text' name="size" class="layui-input" value='{{subSkuLazadaDto.size || ""}}'
                   onkeyup="value=value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g,'')">
        </td>
        <td><input type='number' class="layui-input" value='{{subSkuLazadaDto.quantity}}'></td>
        <td>{{# if(subSkuLazadaDto.listingStatus==1){ }}
            成功
            {{# }else if(subSkuLazadaDto.listingStatus==2){ }}
            失败
            {{# }else if(subSkuLazadaDto.listingStatus==3){ }}
            刊登中
            {{# }else if(subSkuLazadaDto.listingStatus==0){ }}
            待刊登
            {{# } }}
        </td>
        <td>
            {{# if(subSkuLazadaDto.listingStatus==1 || subSkuLazadaDto.listingStatus==3){ }}
            <button type="button" class="layui-btn layui-btn-sm layui-btn-disabled"
                    onclick="removeLazadaSubListing(this)">移除
            </button>
            {{# }else{ }}
            <button type="button" class="layui-btn layui-btn-sm" onclick="removeLazadaSubListing(this)">移除</button>
            {{# } }}
        </td>
    </tr>
    {{#  }); }}
</script>

<!-- 新增新品 -->
<script type="text/html" id="lazadaPulish_globelsite_selTpl">
    <div class="p20">
        <form class="layui-form" id="lazadaPulish_globelsite_selForm">
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <input type="checkbox" name="All" class="lazada_LFS_P_c" lay-filter="lazada_LFS_P_c" title="全选" lay-skin="primary">
                    <input type="checkbox" name="SG" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c"  title="新加坡" lay-skin="primary">
                    <input type="checkbox" name="ID" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c"  title="印尼" lay-skin="primary">
                    <input type="checkbox" name="TH" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c"  title="泰国" lay-skin="primary">
                    <input type="checkbox" name="PH" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c"  title="菲律宾" lay-skin="primary">
                    <input type="checkbox" name="VN" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c"  title="越南" lay-skin="primary">
                    <input type="checkbox" name="MY" class="lazada_LFS_S_c" lay-filter="lazada_LFS_S_c"  title="马来西亚" lay-skin="primary">
                </div>
            </div>
        </form>
    </div>
</script>

<script>
    var lazadaSensArray1 =  new Array();
    <c:forEach items="${lazadaSensProp}" var="sensProp">
    var obj = {};
    obj.name = '${sensProp.name}';
    obj.value = '${sensProp.code}';
    lazadaSensArray1.push(obj);
    </c:forEach>
</script>

<!--商品--生成店铺商品弹框-->
<script type="text/html" id="lazadaPublish_goodsTpl">
    <form class="layui-form" id="lazadaPublish_goodsTplForm" style="padding:20px;">
        <div class="layui-form-item">
            <label class="layui-form-label">发布店铺</label>
            <div class="layui-input-block">
                <select name="storeAcctIdList" xm-select="lazadaPublish_goods_storeAcctId" id="lazadaPublish_goods_storeAcctId" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                    <option value=""></option>
                </select>
            </div>
        </div>
        <p style="padding: 10px;"> 店铺中若存在已生成或已刊登的商品与已选商品相同，已选商品将不生成待刊登数据</p>
    </form>
</script>

<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/productVariant.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/proTplData.js"></script>

<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>
<script src="${ctx}/static/js/publishs/lazada/publish.js"></script>
<script src="${ctx}/static/jquery-ui.min.js"></script>

<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script src="${ctx}/static/simditor/module.js"></script>
<script src="${ctx}/static/simditor/hotkeys.js"></script>
<script src="${ctx}/static/simditor/simditor.js"></script>