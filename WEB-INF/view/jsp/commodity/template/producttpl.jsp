<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>基础模板</title>
<link rel="stylesheet" href="${ctx}/static/webuploader/webuploader.css">
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<link rel="stylesheet" href="${ctx}/static/cropper.css" />
<script src="${ctx}/static/Cropper.js"></script>
<script src="${ctx}/static/jquery-cropper.js"></script>
<style>
    .keywordContain{
        border: 1px solid lightgrey;
        padding: 10px;
    }
    .relateLeft{
        position: relative;
        left: -70px;
        top: 35px
    }
    .selfImgIcon{
        color: red;
        width: 10px;
        display: block;
        padding-top: 20px;
        font-size: 12px;
        display: none;
    }
    .showSexy {
        display: none;
        /* position: absolute; */
        width: 150px;
        text-align: center;
        color: red;
    }
    .uploadImgUL {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .ImgDivIn {
        /* width: 150px; */
        height: 150px;
    }
    .producttplTable_head th {
        padding: 5px 0px!important;
    }

    .showTipElem:hover {
        color: orange;
    }

    /* 表格内的padding调整 */
    #producttplTable td,
    #producttplTable th {
        padding: 0;
        text-align: center;
        word-wrap: break-word;
    }

    /* 时间线树 */
    #timeLineTree {
        position: fixed;
        z-index: 1000;
        margin-left: 1200px;
        margin-top: -60px;
    }

    #timeLineTree li {
        padding: 6px 15px;
    }

    #timeLineTree li a,
    #timeLineTree li i {
        color: #1e9fff;
    }

    .layui-btn {
        border-radius: 0;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .xm-select-parent .xm-select {
        min-height: 32px;
    }

    #LAY-work-develop-producttpl .layui-card-header .layui-icon {
        right: 6px;
        top: 45%;
    }

    .subTempUl {
        float: left;
        width: 70%;
    }

    .nasImgDiv {
        float: right;
        width: 20%;
        text-align: center;
        border-left: 1px solid #666;
    }

    .nasImg {
        width: 150px;
        height: 150px;
        border: 1px solid #f2f2f2;
    }

    .prodtpl_developremark {
        display: block;
    }

    .developremarkHidden {
        max-height: 235px;
        overflow: hidden;
    }

    .developremarkShow {
        max-height: 10000px;
        overflow: inherit;
    }

    .prodtpl_expand {
        position: absolute;
        bottom: 0;
    }

    .imgBox_prodTpl {
        width: 177px;
        border: 1px solid rgb(204, 204, 204);
        overflow: hidden;
    }

    .catechoose_Form {
        margin: 15px 0 0;
    }

    .catechoose_Form h3 {
        margin: -15px 25px 15px;
    }

    .cateAttrValueBox {
        position: relative;
        margin: 2px 0 4px;
    }

    .platCateChoose {
        margin: 5px 20px;
    }

    .cateAttrValueBox .layui-form-label {
        position: absolute;
        top: 0;
        left: -15px;
        width: 100px;
    }

    #producttplCard .layui-table-header .layui-table-cell {
        padding: 0 0;
    }

    #producttplCard .layui-table-header .layui-table-cell table th {
        border: none;
        border-right: 1px solid;
    }

    #producttpl_tplDetail .layui-form-select dl,
    #producttplAddSuccess .layui-form-select dl {
        z-index: 20210302;
    }

    /*select选中框被select2覆盖的问题*/
    #producttpl_addEditSKU_form dl.layui-anim.layui-anim-upbit {
        z-index: 999000000;
    }

    #producttpl_changeOACateAll_form {
        padding: 20px;
    }
    .devIdeaWayExtraStyle {
        margin-top: -15px;
        padding: 0 5px;
        background: #1e9fff;
        cursor: pointer;
        color: #fff;
        border-radius: 5px;
    }
    #tpl_searchForm .layui-form-switch {
        margin-top: 5px;
    }
    .expandIcon {
        width: 30px;
        height: 30px;
        margin-left: 10px;
        border-radius: 50%;
        border: 1px solid #bbb;
        color: #bbb;
        font-size: 20px;
        text-align: center;
        line-height: 30px;
        background-color: #fff;
        cursor: pointer;
    }
</style>

<div class="layui-fluid" id="LAY-work-develop-producttpl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" action="" lay-filter="component-form-group" id="tpl_searchForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">模板类型</label>
                                <div class="layui-input-block">
                                    <select name="tplType" lay-search>
                                        <option value=""></option>
                                        <option value="0">直邮</option>
                                        <option value="1">亚马逊精品</option>
                                        <option value="2">亚马逊精铺</option>
                                        <option value="3">亚马逊铺货</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="organize" lay-filter="producttpl_orgs_hp_devPerson" class="orgs_hp_custom" data-id="producttpl_orgs_hp_devPerson" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label labelSel">
                                    <select name="userType" lay-search>
                                        <option value="bizzOwnerIdList">开发专员</option>
                                        <option value="responsorIds">责任人</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <select name="userId" lay-filter="producttpl_users_hp_devPerson" lay-search="" class="users_hp_custom" data-id="producttpl_users_hp_devPerson" data-roleList="开发专员">
                                    </select>
                                </div>
                            </div>
                            <div hidden id="logisDiv_productTpl">
                                <c:forEach items="${logisAttrList}" var="logisAttr">
                                    <option value="${logisAttr.name}"
                                            alias="${logisAttr.alias}">${logisAttr.name}</option>
                                </c:forEach>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label labelSel">
                                    <select name="prodTagType">
                                        <option value="1">商品标签(含)</option>
                                        <option value="2">商品标签(不含)</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <select name="prodAttrList" xm-select="prodAttrList"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            lay-filter='prodAttrList_producttpl'>
                                        <option value=""></option>
                                        <c:forEach items="${prodTags}" var="tag">
                                            <option value="${tag.name}">${tag.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">审核状态</label>
                                <div class="layui-input-block">
                                    <select name="auditStatus" lay-search>
                                        <option value=""></option>
                                        <option value="0">待发布</option>
                                        <option value="1">待审核</option>
                                        <option value="3">审核通过</option>
                                        <option value="4">审核失败</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale" lay-search>
                                        <option value=""></option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">OA新类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                                            id="plat_choose_outside">选择分类
                                    </button>
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary catePresetsBtn" data-show="tplOACateInfo_show">预设分类
                                    </button>
                                    <i id="prod_clearPlat_outside" class="layui-icon layui-icon-delete"
                                       style="cursor: pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType" lay-search>
                                        <option value="createTime">创建时间</option>
                                        <option value="checkTime">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" id="producttplTimeVal"
                                           name="searchTime">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="devTypes" xm-select="devTypes_producttpl" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"
                                            lay-filter='devTypes_producttpl'>
                                        <option value=""></option>
                                        <c:forEach items="${devTypes}" var="devType">
                                            <option value="${devType.name}">${devType.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="logisAttrRelation" lay-search="">
                                        <option value="and">物流属性(与)</option>
                                        <option value="or">物流属性(或)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="logisAttrStr" xm-select="logisAttrStr" xm-select-search
                                            xm-select-skin="normal"
                                            xm-select-search-type="dl" lay-filter='logisAttr_productlist'>
                                        <option value=""></option>
                                        <c:forEach items="${logisAttrList}" var="logisAttr">
                                            <option value="${logisAttr.name}"
                                                    alias="${logisAttr.alias}">${logisAttr.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                                <div hidden id="basicTemplate_pl_logisAttrList">
                                    <c:forEach items="${logisAttrList}" var="logisAttr">
                                        <option value="${logisAttr.name}"
                                                alias="${logisAttr.alias}">${logisAttr.name}</option>
                                    </c:forEach>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md3">
                                <div class="layui-form-label labelSel">
                                    <select name="searchSKUType" lay-filter="skuTypeSelect_producttpl" lay-search>
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">子SKU</option>
<%--                                        <option value="pSku2">父SKU(精确)</option>--%>
<%--                                        <option value="sSku2">子SKU(精确)</option>--%>
                                    </select>
                                </div>
                                <div class="layui-input-block" style="display: flex;">
                                    <input type="text" class="layui-input" name="searchSKUValue" style="width:70%"
                                           id="product_tpl_searchSKU_input" autocomplete="off" placeholder="支持10000个SKU">
                                    <input name="switchSearchValue" type="checkbox" lay-skin="switch" lay-text="精确|模糊">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-search>
                                        <option value="cnTitle">中文名称</option>
                                        <option value="enTitle">英文标题</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="searchValue">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <div class="layui-form-label labelSel">
                                    <select name="keywordType" lay-search>
                                        <option value="1">关键词(分词)</option>
                                        <option value="2">关键词(不分词)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" maxlength="500" autocomplete="off"
                                           name="keyword" placeholder="多个以空格分隔">
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="tortPlat" xm-select="tortPlat" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"
                                            lay-filter='tortPlat_producttpl'>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">成本</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="price_min" placeholder="￥" autocomplete="off"
                                               class="layui-input">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="price_max" placeholder="￥" autocomplete="off"
                                               class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">重量(g)</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="weight_min" autocomplete="off" class="layui-input">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="weight_max" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderByStr" lay-search>
                                        <option value="p.model_create_time desc" selected>创建时间倒序</option>
                                        <option value="p.model_create_time asc">创建时间正序</option>
                                        <option value="p.audit_time desc">审核时间倒序</option>
                                        <option value="p.audit_time asc">审核时间正序</option>
                                        <option value="psc.sale_num desc">30天销量倒序</option>
                                        <option value="psc.sale_num asc">30天销量正序</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="externalBox" id="showMoreSearchCondition_producttpl">更多查询条件
                                    <span class="hasValue"></span>
                                    <span id="hide_icon_producttpl" class="fr mr10 disN">︽</span>
                                    <span id="show_icon_producttpl" class="fr mr10">︾</span>
                                </div>
                            </div>
                            <div class="externalContain disN">
                                <div class="externalPop" style="left: -35vw">
                                    <div class="layui-form-item">
                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">审核组</label>
                                            <div class="layui-input-block">
                                                <select name="auditTeam" lay-search>
                                                    <option value="">请选择</option>
                                                    <c:forEach items="${auditorGroupList}" var="group">
                                                        <option value="${group.teamName}">${group.teamName}</option>
                                                    </c:forEach>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">视频库视频</label>
                                            <div class="layui-input-block">
                                                <select name="hasVideo" lay-search>
                                                    <option value=""></option>
                                                    <option value="1">有</option>
                                                    <option value="0">无</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">单/多属性</label>
                                            <div class="layui-input-block">
                                                <select name="isMultiSku" lay-search>
                                                    <option value=""></option>
                                                    <option value="1">多属性</option>
                                                    <option value="0">单属性</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">禁售平台</label>
                                            <div class="layui-input-block">
                                                <select name="prohibitPlat" lay-filter="prohibitPlat_prodTpl" lay-search>
                                                    <option></option>
                                                    <c:forEach items="${salesPlatList}" var="salesPlat">
                                                        <option value="${salesPlat.name}">${salesPlat.name}</option>
                                                    </c:forEach>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">禁售站点</label>
                                            <div class="layui-input-block">
                                                <select id="pt_prohibitSalesSiteId" name="prohibitSalesSiteIds"
                                                        xm-select="prohibitSalesSiteId" xm-select-search xm-select-skin="normal"
                                                        xm-select-search-type="dl" lay-filter='prohibitSalesSiteId_productlist'>
                                                </select>

                                                <div class="disN" id="salesSite_searchForm_amazon">
                                                    <option value=""></option>
                                                    <c:forEach items="${amazonSiteEnum}" var="site">
                                                        <option value="${site.marketName}">${site.name}</option>
                                                    </c:forEach>
                                                </div>
                                                <div class="disN" id="salesSite_searchForm_aliexpress">
                                                    <option value=""></option>
                                                </div>
                                                <div class="disN" id="salesSite_searchForm_lazada">
                                                    <option value=""></option>
                                                    <c:forEach items="${lazadaSiteEnum}" var="site">
                                                        <option value="${site.code}">${site.name}</option>
                                                    </c:forEach>
                                                </div>
                                                <div class="disN" id="salesSite_searchForm_joom">
                                                    <option value=""></option>
                                                </div>
                                                <div class="disN" id="salesSite_searchForm_smt">
                                                    <option value=""></option>
                                                </div>
                                                <div class="disN" id="salesSite_searchForm_ebay">
                                                    <option value=""></option>
                                                    <c:forEach items="${ebaySiteEnum}" var="site">
                                                        <option value="${site.siteId}">${site.cnTitle}</option>
                                                    </c:forEach>
                                                </div>
                                                <div class="disN" id="salesSite_searchForm_shopee">
                                                    <option value=""></option>
                                                    <c:forEach items="${shopeeSiteEnum}" var="site">
                                                        <option value="${site.code}">${site.name}</option>
                                                    </c:forEach>
                                                </div>
                                                <div class="disN" id="salesSite_searchForm_mercado">
                                                    <option value=""></option>
                                                    <c:forEach items="${mercadoSiteEnum}" var="site">
                                                        <c:if test="${site.salesSite ne  'CBT' }">
                                                            <option value="${site.salesSite}">${site.salesSite}</option>
                                                        </c:if></c:forEach>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">模板视频</label>
                                            <div class="layui-input-block">
                                                <select name="ifHasVedio" lay-search>
                                                    <option value=""></option>
                                                    <option value="true">有</option>
                                                    <option value="false">无</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">供应商视频</label>
                                            <div class="layui-input-block">
                                                <select name="ifHasSupplierVedio" lay-search>
                                                    <option value=""></option>
                                                    <option value="true">有</option>
                                                    <option value="false">无</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">速卖通图</label>
                                            <div class="layui-input-block">
                                                <select name="imgStatusListStr" xm-select="producttpl_imgStatus" xm-select-search
                                                        xm-select-search-type="dl" xm-select-skin="normal"
                                                        lay-filter='producttpl_imgStatus'>
                                                    <option value="1">有图</option>
                                                    <option value="2">部分有图</option>
                                                    <option value="3">无图</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">亚马逊图</label>
                                            <div class="layui-input-block">
                                                <select name="hasWhiteImgListStr" xm-select="producttpl_hasWhiteImg" xm-select-search
                                                        xm-select-search-type="dl" xm-select-skin="normal"
                                                        lay-filter='producttpl_hasWhiteImg'>
                                                    <option value="2">有图</option>
                                                    <option value="1">部分有图</option>
                                                    <option value="0">无图</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">
                                                <select name="chooseSite" lay-search>
                                                    <option value="US">FBA-美国</option>
                                                    <option value="JP">FBA-日本</option>
                                                    <option value="GB">FBA-英国</option>
                                                    <option value="DE">FBA-德国</option>
                                                </select>
                                            </label>
                                            <div class="layui-input-block">
                                                <select name="hasChooseFba">
                                                    <option value=""></option>
                                                    <option value="true">已选品</option>
                                                    <option value="false">未选品</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">自拍图</label>
                                            <div class="layui-input-block">
                                                <select name="hasSelfImgStr" xm-select="producttpl_hasSelfImgStr" xm-select-search
                                                        xm-select-search-type="dl" xm-select-skin="normal"
                                                        lay-filter='producttpl_hasSelfImgStr'>
                                                    <option value="1">有图</option>
                                                    <option value="2">部分有图</option>
                                                    <option value="0">无图</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 fl">
                                <label class="layui-form-label">品牌授权</label>
                                <div class="layui-input-block">
                                    <select name="brandAuth" lay-search>
                                        <option value=""></option>
                                        <option value="true">授权</option>
                                        <option value="false">未授权</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label labelSel">
                                    <button class="layui-btn layui-btn-sm" type="button" id="tpl_copyBtn"
                                    onmouseover="showTip(`最多复制1w个`,this)" data-tipId="" onmouseout="removeTip(this)" lay-filter="tpl_copyBtn">一键复制父SKU
                                    </button>
                                    <input class="disN" type="text" id="skuCopy"> 
                                </label>
                            </div>

                            <div class="layui-col-lg1 layui-col-md1 fr">
                                <label class="layui-form-label labelSel">
                                    <button class="layui-btn layui-btn-sm keyHandle" type="button" id="tpl_searchBtn"
                                            lay-filter="tpl_searchBtn">搜索
                                    </button>
                                </label>
                                <div class="layui-input-block">
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                            id="tpl_resetBtn">清空
                                    </button>
                                </div>
                            </div>
                            <div class="layui-col-lg10 layui-col-md10"> <div id="tplCateInfo"></div></div>
                           
                            <div class="layui-col-lg10 layui-col-md10">

                                <div id="tplOACateInfo_show"></div>
                                <input type="hidden" name="cateOaId" value="" id="plat_chooseid_inp_outside"/>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="producttplCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header toFixedContain">
                        <div class="fl">
                            <span class="numCount">商品数量<span id="tplNum">0</span></span>
                            <%--<permTag:perm funcCode="exportListingStatus_prodTemp">--%>
                                <%--<button type="button" class="layui-btn layui-btn-sm layui-btn-danger"--%>
                                        <%--id="exportListingStatusBtn_prodTemp">导出刊登统计--%>
                                <%--</button>--%>
                            <%--</permTag:perm>--%>
                            <permTag:perm funcCode="exportTemplate_producttpl">
                                <button type="button" class="layui-btn layui-btn-sm layui-btn-warn"
                                        id="exportTemplateBtn_producttpl">导出模板
                                </button>
                            </permTag:perm>
                            <permTag:perm funcCode="createTemp_prodTemp">
                                <button type="button" class="layui-btn layui-btn-sm" id="producttplAdd">新增模板</button>
                            </permTag:perm>
                        </div>
                        <div class="fr" style="height: 42px; line-height: 42px;padding: 5px">
                            <permTag:perm funcCode="batchSaveOrUpdateCateOaAttrRelation">
                                <span class="fl layui-btn layui-btn-sm layui-btn-normal"
                                      id="prodTpl_batchEditCatesAttr">批量修改类目属性</span>
                            </permTag:perm>
                            <permTag:perm funcCode="batchSaveOrUpdateCateOaRelation">
                                <span class="fl layui-btn layui-btn-sm" id="prodTpl_batchEditCates">批量修改类目</span>
                            </permTag:perm>
                            <span class="fl layui-btn layui-btn-sm" onclick="expandAll('producttplCard')">展开所有</span>
                            <span class="fl layui-btn layui-btn-sm" onclick="PackUpAll('producttplCard')">收起所有</span>
                            <div class="fl" style="width: 200px;">
                                <input type="text" class="layui-input" placeholder="输入店铺SKU查商品SKU"
                                       title="支持多个精确查询，以逗号隔开" maxlength="40000" id="storeSku_prodTpl">
                            </div>
                            <i class="layui-icon layui-icon-search" style="cursor:pointer"
                               onclick="searchSkuByStoreSku()"></i>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body" id="producttplTableBodyDiv">
                    <%--<table class="layui-table" id="producttplTable" lay-filter="producttplTable"></table>--%>
                    <!-- 表格的数据渲染 -->
                    <div class="producttplTable_head disN toFixedContain" style="margin-right:15px;">
                        <table class="layui-table">
                            <thead>
                            <th width="66">
                                <div class="layui-form">
                                    <input type="checkbox" class="pid-all-cbox" lay-skin="primary">
                                </div>
                            </th>
                            <th>图片</th>
                            <th width="10%">商品名</th>
                            <th>商品归属人</th>
                            <th width="8%">parentSKU</th>
                            <th width="8%">subSKU</th>
                            <th width="2%">重量(g)</th>
                            <th width="2%">抛重(g)</th>
                            <th width="2%">成本</th>
                            <th width="4%">可用/在途/未派</th>
                            <th width="4%">7/15/30销量</th>
                            <th width="2%">在售</th>
                            <th width="10%">侵权信息</th>
                            <th width="10%">销售备注</th>
                            <th width="2%">销量</th>
                            <th width="5%">禁售站点</th>
                            <th width="200px">开发备注</th>
                            <th>创建时间</th>
                            <th>操作</th>
                            </thead>
                        </table>
                    </div>
                    <div class="producttplTable_head toFixedContain">
                        <table class="layui-table">
                            <colgroup>
                                <col width="66px"/>
                                <%-- type="checkbox" --%>
                                <col width="5%"/>
                                <%-- <th>图片</th>--%>
                                <col width="10%"/>
                                <%-- <th width="10%">商品名</th>--%>
                                <col width="6%"/>
                                <%-- <th>商品归属人</th>--%>
                                <col width="6%"/>
                                <%-- <th width="10%">parentSKU</th>--%>
                                <col width="6%"/>
                                <%-- <th width="6%">subSKU</th>--%>
                                <col width="4%"/>
                                <%-- <th width="2%">重量(g)</th>--%>
                                <col width="4%"/>
                                <%-- <th width="2%">成本</th>--%>
                                <col width="8%"/>
                                <%-- <th width="4%">可用/在途/未派</th>--%>
                                <col width="8%"/>
                                <%-- <th width="4%">7/15/30销量</th>--%>
                                <col width="4%"/>
                                <%-- <th width="2%">在售</th>--%>
                                <col width="10%"/>
                                <%-- <th width="10%">侵权信息</th>--%>
                                <col width="10%"/>
                                <%-- <th width="10%">销售备注</th>--%>
                                <col width="6%"/>
                                <%-- <th width="2%">销量</th>--%>
                                <col width="6%"/>
                                <%-- <th width="5%">禁售站点</th>--%>
                                <col width="6%"/>
                                <%-- <th width="200px">开发备注</th>--%>
                                <col width="8%"/>
                                <%-- <th>创建时间</th>--%>
                                <col width="6%"/>
                                <%-- <th>操作</th>--%>
                            </colgroup>
                            <thead>
                            <th>
                                <div class="layui-form">
                                    <input type="checkbox" class="prodtpl-cateId-all-cbox" lay-skin="primary"
                                           lay-filter="prodtpl-cateId-all-cbox-filter">
                                </div>
                            </th>
                            <th>图片</th>
                            <th width="10%">商品名</th>
                            <th>商品归属人</th>
                            <th width="8%">parentSKU</th>
                            <th width="8%">subSKU</th>
                            <th width="2%">重量(g)</th>
                            <th width="2%" lay-tips="采购单价+内包装成本">成本</th>
                            <th width="4%">可用/在途/未派</th>
                            <th width="4%">7/15/30销量</th>
                            <th width="2%">在售</th>
                            <th width="10%">侵权信息</th>
                            <th width="10%">销售备注</th>
                            <th width="2%">销量</th>
                            <th width="5%">禁售站点</th>
                            <th width="200px">开发备注</th>
                            <th>创建时间</th>
                            <th>操作</th>
                            </thead>
                        </table>
                    </div>
                    <div class="producttplTable_body" style="margin-top:-6px">
                        <table class="layui-table" id="producttplTable" lay-filter="producttplTable">
                            <colgroup>
                                <col width="66px"/>
                                <%-- <th>
                                                                  <div class="layui-form">
                                                                      <input type="checkbox" class="pid-all-cbox" lay-skin="primary">
                                                                  </div>
                                                              </th>--%>
                                <col width="5%"/>
                                <%-- <th>图片</th>--%>
                                <col width="10%"/>
                                <%-- <th width="10%">商品名</th>--%>
                                <col width="6%"/>
                                <%-- <th>商品归属人</th>--%>
                                <col width="6%"/>
                                <%-- <th width="10%">parentSKU</th>--%>
                                <col width="6%"/>
                                <%-- <th width="6%">subSKU</th>--%>
                                <col width="4%"/>
                                <%-- <th width="2%">重量(g)</th>--%>
                                <col width="4%"/>
                                <%-- <th width="2%">成本</th>--%>
                                <col width="8%"/>
                                <%-- <th width="4%">可用/在途/未派</th>--%>
                                <col width="8%"/>
                                <%-- <th width="4%">7/15/30销量</th>--%>
                                <col width="4%"/>
                                <%-- <th width="2%">在售</th>--%>
                                <col width="10%"/>
                                <%-- <th width="10%">侵权信息</th>--%>
                                <col width="10%"/>
                                <%-- <th width="10%">销售备注</th>--%>
                                <col width="6%"/>
                                <%-- <th width="2%">销量</th>--%>
                                <col width="6%"/>
                                <%-- <th width="5%">禁售站点</th>--%>
                                <col width="6%"/>
                                <%-- <th width="200px">开发备注</th>--%>
                                <col width="8%"/>
                                <%-- <th>创建时间</th>--%>
                                <col width="6%"/>
                                <%-- <th>操作</th>--%>
                            </colgroup>
                            <tbody id="tplListTbody" style="text-align: center"></tbody>
                        </table>
                    </div>
                    <div id="tpl_pagination" class="customPagination"></div>
                    <div style="clear:both"></div>
                </div>
            </div>
            <permTag:perm funcCode="audit_prodTemp"><input hidden id="ifCheck_prodtemp"></permTag:perm> <%--审核权限--%>
            <permTag:perm funcCode="updateSku_prodTemp"><input hidden id="ifUpdateSku_prodtemp"></permTag:perm><%--替换sku权限--%>
            <permTag:perm funcCode="update_prodTemp"><input hidden id="ifUpdate_prodtemp"></permTag:perm><%--修改权限--%>
        </div>
    </div>
</div>



<!-- value={{v.id}} name="id"-->
<!-- 模板文件 -->
<script type="text/html" id="tplListTbody_tpl">
{{each data}}
<tr class="prodtpl-parentTr">
    <td width="66px">
        <div class="layui-form">
            <input type="checkbox" class="prodtpl-cateId-cbox" lay-skin="primary" value="{{$value.id}}"
                   data-cateOaId="{{$value.prodPInfoCateOaDTO ? $value.prodPInfoCateOaDTO.cateOaId : ''}}"
                   data-psku="{{$value.pSku || ''}}">
        </div>
    </td>
    <td width="66px">
        {{ if $value.ifHasPublishing}}
        {{ if $value.ifPublishing}}
        <span title="进行中的活动数">{{ $value.pbStoreNum || 0 }}</span> / <span
            title="历史活动总数">{{ $value.pbTotalNum || 0 }}</span>

        <img width="60" height="20" src="${ctx}/static/img/onpb.png">
        {{else}}
        <img width="60" height="20" src="${ctx}/static/img/notpb.jpg">
        {{/if}}
        {{/if}}

        {{ if ($value.pImg != null && $value.pImg !="" )}}
        <img width="60" height="60" data-original="${tplIVP}{{ $value.pImg }}!size=60x60"
             class="img_show_hide lazy b1 dbclickCopyUrl" data-onerror="layui.admin.img_noFind()">
        {{ else }}
        <img width="60" height="60" src="${ctx}/static/img/kong.png" class="img_show_hide b1"
             data-onerror="layui.admin.img_noFind()">
        {{/if}}
        <div>
            {{ if ($value.prodAttrList != null && $value.prodAttrList.indexOf('防疫用品') >=0 )}}
            <span class="shine_red fRed">防疫用品</span>
            {{/if}}

        </div>
    </td>
    <td width="10%">
        <div style="color: grey">{{$value.devType ? ('[' + $value.devType + ']'): ''}}</div>
        <div>{{ $value.cnTitle }}</div>
        {{ if $value.prodCate != null}}
        <div><span style="color:#999;">分类: {{ $value.prodPInfoCateOa && $value.prodPInfoCateOa.cateName ? $value.prodPInfoCateOa.cateName : $value.prodCate.cateCnName }}</span></div>
        {{ /if}}
        <div>
            {{ if $value.selfImgStatus == '1' }}
            <span class="hp-badge layui-bg-blue" title="有自拍图">自</span>
            {{ /if}}
            {{ if $value.isSupplierOrigiImg == true}}
            <span class="hp-badge layui-bg-blue" title="有供应商图">供</span>
            {{ /if}}

            {{ if $value.auditStatus == '0' }}
            <span class="hp-badge layui-bg-orange pointHand" title="未发布" onclick="tplAuditLog({{ $value.id }})">未</span>
            {{ /if } }}
            {{ if $value.auditStatus == '1' }}
            <span class="hp-badge layui-bg-orange pointHand" title="待审核" onclick="tplAuditLog({{ $value.id }})">待</span>
            {{ /if } }}
            {{ if $value.auditStatus == '3' }}
            <span class="hp-badge layui-bg-green pointHand" title="通过审核" onclick="tplAuditLog({{ $value.id }})">通</span>
            {{ /if } }}
            {{ if $value.auditStatus == '4' }}
            <span class="hp-badge layui-bg-gray pointHand" title="审核失败" onclick="tplAuditLog({{ $value.id }})"
                  onmouseover="showTip(`{{$value.auditDesc}}`,this)" data-tipId="" onmouseout="removeTip(this)">拒</span>
            {{ /if } }}

            {{ if $value.mackRefineStatus == true}}
            {{ if $value.selfImgStatus ==1 || $value.selfImgStatus == 2 }}
            <span class="hp-badge layui-bg-red pointHand" title="精修商品">精</span>
            {{ /if}}
            {{ /if}}
        </div>
    </td>
    <td>
        <div><span style="color: gray">开发:</span>{{ $value.bizzOwner }}</div>
        {{ if $value.responsor}}
        <div><span style="color: gray">责任:</span>{{ $value.responsor }}</div>
        {{ /if}}
    </td>
    <td width="10%">
        <div style="color: #f00;">
            {{ if $value.tplType == 1}}
            亚马逊精品
            {{ /if}}
            {{ if $value.tplType == 2}}
            亚马逊精铺
            {{ /if}}
            {{ if $value.tplType == 3}}
            亚马逊铺货
            {{ /if}}
            {{ if $value.tplType == 0}}
            直邮
            {{ /if}}
        </div>
        <div style="color:#000;">
            {{ $value.pSku }}
            <span onclick="layui.admin.onlyCopyTxt('{{$value.pSku}}')" style="z-index:200;vertical-align: middle;display: {{$value.pSku ? 'inline-block':'none'}}; cursor:pointer">
                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
            </span>
            <a href="{{$value.purchaseUrl}}" target="_blank" title="跳转采购链接"><i class="layui-icon layui-icon-cart pointHand" style="color: blue;"></i></a></div>
        <div style="color:#999;font-size: 12px">{{ $value.prodAttrList}}</div>
        <div>
            {{each $value.logisAliaList}}
            <span class="layui-bg-red hp-badge ml5" title="物流属性:{{$value.logisAttr}}">{{ $value.alia }}</span>
            {{/each }}
        </div>
    </td>
    {{ include 'tpl_art5' $value }}
    <td width="10%">
        <div title="编辑侵权信息" onclick="producttpl_editTortInfo({{$value}})"><i class="layui-icon layui-icon-edit"
                                                                             style="color: #009688;cursor: pointer;">&#xe642;</i>
        </div>
        <div class="alignLeft">
            {{ include 'tpl_tortInfo' $value }}
        </div>
    </td>
    <td width="10%">
        <div title="编辑销售备注" onclick="producttpl_editTortInfo({{$value}})"><i class="layui-icon layui-icon-edit"
                                                                             style="color: #009688;cursor: pointer;">&#xe642;</i>
        </div>
        <div class="alignLeft">
            {{ include 'tpl_tortInfo_saleRemark' $value }}
        </div>
    </td>
    <td title="tip:该统计数据，为当前模板所有子模板对应的子商品总销量。例如该模板存在子模板A*30. 如果子商品A在其他模版中也存在一个A*3的子模板，且其刊登的listing卖出去1个。则此处销量也会+3">
        <div class="canClickEl mb10" onmouseenter="showSaleCountTab(this,{{$value.prodPlatSalesCountPDtoList}})" data-tipId=""
             onmouseleave="removeTip(this,1000)"><span style="color: grey;">7日:</span>{{ $value.sevenSales}}
        </div>
        <div class="canClickEl mb10" onmouseenter="showSaleCountTab(this,{{$value.prodPlatSalesCountPDtoList}})" data-tipId=""
             onmouseleave="removeTip(this,1000)"><span style="color: grey;">15日:</span>{{ $value.fifteenSales}}
        </div>
        <div class="canClickEl mb10" onmouseenter="showSaleCountTab(this,{{$value.prodPlatSalesCountPDtoList}})" data-tipId=""
             onmouseleave="removeTip(this,1000)"><span style="color: grey;">30日:</span>{{ $value.thirtySales}}
        </div>
    </td>
    <td width="5%">
        {{each $value.prohibitPlatArr}}
        <div class="pointHand showTipElem" onmouseover="showProhibitList(this,{{$value.detailList}})" data-tipId=""
             onmouseout="removeTip(this,1000)">
            {{$value.platCode}}
        </div>
        {{/each}}
        <i class="layui-icon layui-icon-edit tpl_devNote" style="color: #009688;cursor: pointer;"
        onclick="setProhibitPlat(this)" lay-event="tpl_devNote" datapsku="{{ $value.pSku }}" dataid="{{ $value.id }}">&#xe642;</i>
    </td>
    <td width="200px" class="copySpan">
        <div class="showMultiRow">
            <div class="prodtpl_developremark developremarkHidden">
                <div>{{ $value.devNote }}</div>
                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="prodtpl_copyTxt(this)"
                        style="top:0">复制备注
                </button>
            </div>
            <i class="layui-icon layui-icon-edit tpl_devNote" style="color: #009688;cursor: pointer;"
               onclick="setDevNote(this)" lay-event="tpl_devNote" dataid="{{ $value.id }}"
               dev-note="{{ $value.devNote }}">&#xe642;</i>
        </div>
    </td>
    <td>
        <div><span style="color: grey;">创建:</span>{{ $value.createTime }}</div>
        {{ if $value.auditTime != null }}
        <div><span style="color: grey;">审核:</span>{{ $value.auditTime }}</div>
        {{ /if }}
    </td>
    <td>
        <div>
            <a class="layui-btn layui-btn-xs tpl_detail mb3"
               onclick="detail_producttpl({{ $value.id }},{{$value.auditStatus}})" dataid="{{ $value.id }}">
                模板详情
            </a>
        </div>
        <div>
            <a class="layui-btn layui-btn-xs layui-btn-primary layui-border-blue tpl_detail mb3"
               onclick="detail_producttplCopyAdd({{ $value.id }})">
                复制新增
            </a>
        </div>
        <div>
            <a class="layui-btn layui-btn-warm layui-btn-xs tpl_detail mb3"
               onclick="product_optimize_add_btn_fun('{{ $value.pSku }}','{{ $value.id }}')" dataid="{{ $value.id }}">
                商品优化
            </a>
        </div>

        <div style="text-align: -webkit-center;">
            <div class="btnSelect_hp" style="width: 58px">
                <div class="title_btnSelect layui-btn-xs">更多操作</div>
                <div class="optionBox_btnSelect">
                    <div class="optionCanvas_btnSelect">
                        <div class="option_btnSelect layui-btn-xs"
                             onclick="producttpl_getListingStatus('{{ $value.id }}')" dataid="{{ $value.id }}">
                            刊登状态
                        </div>
                        <permTag:perm funcCode="add_msg_btn">
                            <div class="option_btnSelect layui-btn-xs"
                                 onclick="producttpl_develop_msg('{{ $value.pSku }}','{{ $value.id }}')"
                                 dataid="{{ $value.id }}">开发通知
                            </div>
                        </permTag:perm>
                        <%--<div class="option_btnSelect layui-btn-xs" onclick="producttpl_getTraslation('{{ $value.id }}')"--%>
                             <%--dataid="{{ $value.id }}">刊登翻译--%>
                        <%--</div>--%>
                        <div class="option_btnSelect layui-btn-xs devIdeaWayBtn" dataid="{{ $value.id }}">开发思路</div>
                    </div>
                </div>
            </div>
        </div>
    </td>
</tr>
{{/each}}
</script>
<script type="text/html" id="prohibitPlat_layer">
    <div class="p20">
        <form class="layui-form" action="" onsubmit="return false" id="prohibitPlat_layer_searchForm"
                autocomplete="off">
            <div class="layui-col-lg3 layui-col-md3">
                <div class="layui-form-item">
                    <label class="layui-form-label">平台</label>
                    <div class="layui-input-block">
                        <select name="platformCode" id="prohibitPlat_layer_platformCode" lay-filter="prohibitPlat_layer_platformCode" lay-search>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
                <div class="layui-form-item">
                    <label class="layui-form-label">站点</label>
                    <div class="layui-input-block">
                        <select name="salesSite" id="prohibitPlat_layer_salesSite" xm-select="prohibitPlat_layer_salesSite"
                        xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                    </div>
                </div>
            </div>
            <div class="layui-col-lg3 layui-col-md3">
                <div class="layui-form-item">
                    <label class="layui-form-label">仓库</label>
                    <div class="layui-input-block">
                        <select name="stockLocation" lay-search>
                            <option value=""></option>
                            <option value="0">全部</option>
                            <option value="1">国内仓</option>
                            <option value="2">虚拟仓</option>
                        </select>   
                    </div>
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-form-item">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="fixedInableMsg" />
                    </div>
                </div>
            </div>
            <div class="layui-col-lg1 layui-col-md1">
                <button class="fr layui-btn layui-btn-sm layui-btn-normal" onclick="addProhibitInfo()">新增</button>
            </div>

            <table class="layui-table" id="prohibit_layerTable">
            </table>
        </form>
    </div>

</script>
<script type="text/html" id="prohibitTable_stockLocation">
    {{# if(d.stockLocation === 0) { }}
      全部
    {{# } }}
    {{# if(d.stockLocation === 1) { }}
      国内仓
    {{# } }}
    {{# if(d.stockLocation === 2) { }}
      虚拟仓
    {{# } }}
</script>
<script type="text/html" id="prohibitTable_delete">
    <button class="layui-btn layui-btn-xs layui-btn-danger" onclick="deleteProhibitInfo({{d.id}})">移除</button>
</script>
<script type="text/html" id="producttpl_analysisTable_trends1">
    <div id="EchartZhu{{d.md5}}" style="width: 400px;height: 200px;margin-left: -80px;margin-bottom: -60px;"> </div>
</script>
<script type="text/html" id="producttpl_analysisTable_trends2">
    <div id="EchartZhu{{d.keyword.replaceAll(' ','')}}" style="width: 400px;height: 200px;margin-left: -80px;margin-bottom: -60px;"> </div>
</script>

<script type="text/html" id="producttpl_analysisTable_purchases">
<div>{{d.purchases}}</div>
<div class="secondary">{{accMul(d.purchaseRate,100)}}%</div>
</script>

<script type="text/html" id="producttpl_analysisTable_monopolyClickRate">
<div>{{accMul(d.monopolyClickRate,100)}}%</div>
<div class="secondary">{{accMul(d.cvsShareRate,100)}}%</div>
</script>

<script type="text/html" id="producttpl_analysisTable_bid">
    {{# if(d.bid) {}}
    <div><span class="secondary">$</span>{{d.bid}}</div>
    <div class="secondary">{{'$' + d.bidMin}} - {{'$' + d.bidMax}}</div>
    {{# } }}

</script>

<script type="text/html" id="producttpl_analysis_pop">
    <div class="layui-btn layui-btn-sm" id="producttpl_analysis_addToKeyWordCoreBtn">添加到关键词</div>
    <div class="layui-tab layui-tab-card">
        <ul class="layui-tab-title">
            <li class="layui-this">AliexpressGPT</li>
            <li id="">卖家精灵</li>
        </ul>
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
                <table class="layui-table" id="producttpl_analysisTable1" lay-filter="producttpl_analysisTable1"></table>
            </div>
            <div class="layui-tab-item">
                <table class="layui-table" id="producttpl_analysisTable" lay-filter="producttpl_analysisTable"></table>
            </div>
        </div>
    </div>
<%--    <table class="layui-table" id="producttpl_analysisTable" lay-filter="producttpl_analysisTable"></table>--%>
</script>

<script type="text/html" id="tpl_tortInfo">
    {{each prodTortInfoList}}
    {{ if ($value.ifTort || $value.tortReason) }}
    <div class="contentNotOver">
        {{ if ($value.ifTort) }}
        <span class="layui-badge" onmouseover="showTip(`{{$value.tortReason}}`, this)"
              onmouseleave="removeTip(this)">{{$value.platCode}}侵权</span>
        {{ else }}
        <span class="layui-badge layui-bg-gray" onmouseover="showTip(`{{$value.tortReason}}`, this)"
              onmouseleave="removeTip(this)">{{$value.platCode}}不侵权</span>
        {{/if}}
        {{$value.tortReason}}
    </div>
    {{/if}}
    {{/each}}
</script>

<script type="text/html" id="tpl_tortInfo_saleRemark">
    {{each prodTortInfoList}}
    {{ if ($value.saleRemark) }}
    <div class="contentNotOver" onmouseover="showTip(`{{$value.saleRemark}}`, this)"
         onmouseleave="removeTip(this)"><span class="fGrey">「{{$value.platCode}}」</span>{{$value.saleRemark}}
    </div>
    {{/if}}
    {{/each}}
</script>

<script type="text/html" id="tpl_art5">
<td colspan="6">
    <table id="intable_tpl" style="text-align:center">
        <colgroup>
            <col width="15%"/>
            <col width="8%"/>
            <col width="8%"/>
            <col width="10%"/>
            <col width="20%"/>
            <col width="10%"/>
        </colgroup>
        <tbody>
        {{each varients}}
        {{if $index<3}}
        <tr>
            {{else}}
        <tr class="myj-hide">
            {{ /if }}
            <td width='120px' style="text-align: left;height:100%;display:flex">
            {{ if ($value.sImg != null && $value.sImg !="" )}}
                <div src="${tplIVP}{{ $value.sImg }}!size=60x60" class="img_show_hide lazy dbclickCopyUrl">
                    {{ $value.sSku }}
                </div>
                <span onclick="layui.admin.onlyCopyTxt('{{$value.sSku}}')" style="z-index:200;vertical-align: middle;display: {{$value.sSku ? 'inline-block':'none'}}; cursor:pointer">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
            {{ else }}
                <div src="${ctx}/static/img/kong.png" class="img_show_hide">
                    {{ $value.sSku }}
                </div>
                <span onclick="layui.admin.onlyCopyTxt('{{$value.sSku}}')" style="z-index:200;vertical-align: middle;display: {{$value.sSku ? 'inline-block':'none'}}; cursor:pointer">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
            {{/if}}
            {{ if ($value.defaultUrl)}}
                <a href="{{$value.defaultUrl}}" target="_blank" title="跳转采购链接"><i class="layui-icon layui-icon-cart pointHand" style="color: blue;"></i></a>
            {{/if}}
            </td>
            <td width='20px'>{{ $value.weight }}</td>
            <%--<td width='25px'>{{ $value.throwWeight || ''}}</td>--%>
            <td width='20px'><span class="canClickEl"
                                   onclick="tpl_listReferPrice({{ $value.id}})">{{ $value.cost }}</span></td>
            <td width='50px'>{{ (($value.stockNum || 0) - ($value.reservationNum || 0)) + '/' + ($value.orderNotInNum ||
                0) + '/' + ($value.lackUnPaiNum || 0) }}
            </td>
            <td width='50px'>{{ ($value.sevenSales || 0) + '/' + ($value.fifteenSales || 0) + '/' + ($value.thirtySales
                || 0) }}
            </td>
            <td width='25px'>
                {{ if $value.isSale == true}}
                <div class="layui-unselect layui-form-checkbox layui-form-checked layui-checkbox-disbaled layui-disabled"
                     lay-skin="primary">
                    <i class="layui-icon layui-icon-ok"></i>
                </div>
                {{ else }}
                <div class="layui-unselect layui-form-checkbox layui-checkbox-disbaled layui-disabled"
                     lay-skin="primary">
                    <i class="layui-icon layui-icon-ok"></i>
                </div>
                {{/if}}
            </td>
        </tr>
        {{/each}}
        </tbody>
    </table>
    {{ if(varients && varients.length > 3)}}
    <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow"
       style="float:right;"><span>+ 展开</span>({{varients.length}})</a>
    {{/if}}
</td>
</script>

<!-- 商品模板弹出框 -->
<script type="text/html" id="producttplAddLayer">
<%--<div class="mr100 pora" style="min-height:1000px;padding: 20px 0 0 40px;">--%>
<div class="p20">
    <div class="layui-tab layui-tab-card">
        <ul class="layui-tab-title isCreateHidden">
            <li class="layui-this">详情</li>
            <li id="producttpl_queryLogBtn">操作日志</li>
            <li id="openDevDetailBtn">开发详情</li>
        </ul>
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show p20 pora">
                <form id="addProdTplForm" class="layui-form" autocomplete="off">
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label w90">模板类型</label>
                            <div class="layui-input-inline">
                                <select name="tplType" lay-search lay-filter="producttpl_tplTypeFilter">
                                    <option value="0">直邮</option>
                                    <option value="1">亚马逊精品</option>
                                    <option value="2">亚马逊精铺</option>
                                    <option value="3">亚马逊铺货</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label w90">关联新品开发父SKU</label>
                            <div class="layui-input-inline">
                                <input name="devPSku" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <div style="display: flex;">
                            <div class="layui-btn layui-btn-sm disN" id="producttpl_addParentProdBtn">新增父商品</div>
                            <div class="layui-btn-sm devIdeaWayBtn disN devIdeaWayExtraStyle">开发思路</div>
                            <%--只有复制新增添加--%>
                                <div class="layui-btn layui-btn-sm disN" id="producttpl_keyword" style="margin-left: 20px;">仅保留关键词</div>
                                <div class="layui-btn layui-btn-sm disN" id="producttpl_title_keyword_desc">仅保留标题、关键词、描述</div>
                            </div>
                        </div>
                    </div>

                    <!-- 表单 -->
                    <div id="timeLineTree">
                        <ul>
                            <li data-id="basicInfo" onclick="tplLocation(this)">
                                <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">基本信息</a>
                            </li>
                            <li data-id="mainPic" onclick="tplLocation(this)">
                                <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">主图</a>
                            </li>
                            <li data-id="assistPic" onclick="tplLocation(this)">
                                <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">辅图</a>
                            </li>
                            <li data-id="tplColor" onclick="tplLocation(this)" class="ifDetailHidden">
                                <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">颜色</a>
                            </li>
                            <li data-id="tplSize" onclick="tplLocation(this)" class="ifDetailHidden">
                                <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">尺寸</a>
                            </li>
                            <li data-id="tplStyle" onclick="tplLocation(this)" class="ifDetailHidden">
                                <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">款式</a>
                            </li>
                            <li data-id="tplChange" onclick="tplLocation(this)">
                                <i class="layui-icon layui-icon-tree"></i>
                                <a href="javascript:;">产品变种</a>
                            </li>
                        </ul>
                    </div>
                    <fieldset class="layui-elem-field layui-field-title site-demo-button" id="basicInfo">
                        <legend style="font-size:14px">基本信息</legend>
                    </fieldset>
                    <input hidden id="auditStatus_addProdTplForm">
                    <div class="layui-form-item">
                        <div class="layui-col-md3 layui-col-lg3" notNull>
                            <label class="layui-form-label">模板父SKU</label>
                            <div class="layui-input-block">
                                <input type="text" name="pSku" onblur="var self = this;window.setTimeout(function(){getPskuInfo(self.value,self)},500)" onfocus="getInputSku(this)" oninput="searchSku_prodTpl(this,'psku')" class="layui-input" readonly>
                                <ul class="supplierUl"
                                    style="width:100%;border:1px solid #f8f8f8;box-sizing:border-box;position:absolute;z-index:99999;background:#fff;max-height:230px;overflow-y:scroll"></ul>
                                <input type="hidden" name="id">
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">开发专员</label>
                            <div class="layui-input-block">
                                <input type="text" name="bizzOwner" class="layui-input" disabled
                                       placeholder="只读,跟父SKU有关">
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">责任人</label>
                            <div class="layui-input-block">
                                <input type="text" name="responsor" class="layui-input" disabled
                                       placeholder="只读,跟父SKU有关">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">

                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">Joom敏感货</label>
                            <div class="layui-input-block">
                                <select name="supportCateIds" id="tpl_joomSensProd" xm-select="tpl_select_joomSens"
                                        xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">供应商原图</label>
                            <div class="layui-input-block">
                                <input type="checkbox" name="isSupplierOrigiImg" lay-skin="primary">
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">自拍图状态</label>
                            <div class="layui-input-block">
                                <input name="selfImgStatus" class="layui-input" disabled/>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">类目</label>
                            <div class="layui-input-block">
                                <input id="tplCate" type="text" class="layui-input" name="cateName" disabled
                                       placeholder="自动生成">
                                <input name="cateId" id="cateId" type="hidden">
                            </div>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">新类目</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="newCateName" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item" notNull>
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">中文名称</label>
                            <div class="layui-input-block">
                                <input type="search" name="cnTitle" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item" notNull>
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">英文标题</label>
                            <div class="layui-input-block">
                                <input type="text" name="enTitle" id="detailEnTitle" placeholder="请输入标题" class="layui-input ifFocusInput"
                                       onkeyup="value=value.replace(/[^\u0000-\u00ff]/g, '')">
                                    </div>
                                </div>
                            <!-- <div class="layui-col-md1 layui-col-lg1">
                                <button type="button" class="layui-btn layui-btn-xs layui-btn-normal ml20 layui-bg-green pointHand"
                                    onclick="setFirstLetterUp($('#detailEnTitle')[0])" style="margin-top: 5px">首字母大写</button>
                            </div> -->
                    </div>
                    <div class="layui-form-item disN">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">亚马逊标题</label>
                            <div class="layui-input-block">
                                <input type="text" name="amazonTitle" placeholder="请输入标题" class="layui-input"
                                       onkeyup="value=value.replace(/[^\u0000-\u00ff]/g, '')">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item disN">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label" style="width: 100px">亚马逊侵权品牌</label>
                            <div class="layui-input-block">
                                <span name="brand" style="color: red; line-height: 30px;"></span>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item coreKeyWordItem disN">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">核心关键词</label>
                            <div class="layui-input-block">
                                <input type="text" name="coreKeyWord" class="layui-input"
                                       onkeyup="value=value.replace(/[^\u0000-\u00ff]/g, '')">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item oldKeyWordElem">
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">适用对象1</label>
                            <div class="layui-input-block">
                                <input type="text" name="appObject" class="layui-input"
                                       placeholder="特殊的适用对象,如机型">
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">适用对象2</label>
                            <div class="layui-input-block">
                                <input type="text" name="appObject" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">适用对象3</label>
                            <div class="layui-input-block">
                                <input type="text" name="appObject" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item oldKeyWordElem">
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">特殊数量1</label>
                            <div class="layui-input-block">
                                <input type="text" name="specNum" class="layui-input"
                                       placeholder="特殊的起卖量,如:5pairs">
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">特殊数量2</label>
                            <div class="layui-input-block">
                                <input type="text" name="specNum" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">特殊数量3</label>
                            <div class="layui-input-block">
                                <input type="text" name="specNum" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item ifDetailHidden oldKeyWordElem">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">原店铺标题
                                <button type="button" class="layui-btn layui-btn-xs"
                                        onclick="javascript:return makeKeyword(true)">
                                    生成关键词
                                </button>
                            </label>
                            <div class="layui-input-block">
                                    <textarea placeholder="请输入内容" name="originTitle" id="origintitle"
                                              class="layui-textarea"></textarea>
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <input type="hidden" id="prodTpl_ifNewKeyword" value="true">
                            <div id="prodtpl_showNewKeyWordElemBtn" class="layui-badge layui-bg-green pointHand">切换至新版关键词</div>
                        </div>
                    </div>
                    <div class="layui-form-item oldKeyWordElem" notNull>
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label w90">关键词<br>
                                <span class="layui-badge layui-bg-blue">数量:<i id="keywordNum">0</i></span><br>
                                <button type="button" class="layui-btn layui-btn-xs ifDetailHidden"
                                        onclick="javascript:return createTestTitle()">生成测试标题
                                </button>
                            </label>
                            <div class="layui-input-inline disflex" style="width:480px">
                                    <textarea placeholder="点击上面按钮生成" name="keyword" id="keyword" class="layui-textarea" style="height:195px;width:280px"></textarea>
                                    <div>
                                      <!-- <button type="button" class="layui-btn layui-btn-xs layui-btn-normal ml20" onclick="addWishTagsBtn()">一键应用到wish tags</button><br /> -->
                                      <button type="button" class="layui-btn layui-btn-xs layui-btn-normal ml20" onclick="setFirstLetterUp($('#keyword')[0])" style="margin-top:10px;">首字母大写</button>
                                    </div>
                            </div>
                        </div>
                        <div class="layui-inline" style="width:542px;color:skyblue">
                                    <span class="ifDetailHidden">
                                        关键词越前面的越重要，越后面的越可有可无。
                                        最前面的2-4个关键词需要能基本反映出销售的是什么商品，
                                        如指甲锉（nai指甲， Buffing抛光），婴儿印花交叉发带（Knot结，Turban头巾，Headband头带，Infant婴儿)，椅（chair椅子 cover套, Slipcovers沙发套），耳机包（earphone，Headphone，bag，case)。<br/>
                                        常见错误如下:<br/>
                                        1、耳机包，有人把hard（硬）写在第一位，这是形容词，比起包，hard重要性略低<br/>
                                        2、椅子套，有人把room(房间) Paddy（有弹性的）放在了第一第二位<br/>
                                        3、关键词重复出现，比如watch，men's watch, wrist watch,leather watch，其中watch重复了4次<br/>
                                        4、使用年份，如：2014，2015，2016
                                    </span>
                        </div>
                    </div>
                    <div class="layui-form-item ifDetailHidden oldKeyWordElem">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">生成测试标题</label>
                            <div class="layui-input-block">
                                <input type="text" id="testTitle" placeholder="请输入标题" class="layui-input">
                            </div>
                        </div>
                    </div>


                    <div class="layui-form-item newKeyWordElem">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">GPT拆词
                                <button type="button" class="layui-btn layui-btn-xs" onclick="requireGptSplitKeyWord()">
                                    拆分
                                </button>
                            </label>
                            <div class="layui-input-block">
                                <textarea placeholder="请输入竞品标题，多个标题换行输入" name="originTitle_new" class="layui-textarea" id="producttpl_originTitle_new"></textarea>
                            </div>
                            <%--<div class="layui-input-block disN" id="producttpl_keyword_btn_containsblock">--%>
                                <%--<div class="tagsinput-primary form-group">--%>
                                    <%--<input class="tagsinput" id="producttpl_keyword_btn_contains" readonly type="text">--%>
                                <%--</div>--%>
                                <%--<div style="margin-top: -18px">--%>
                                    <%--<span class="secondary">可拖拽至关键词</span>--%>
                                    <%--<div class="layui-badge pointHand" style="background-color: grey" onclick="$('#producttpl_keyword_btn_contains').tagsinput('removeAll')">清空拆分词</div>--%>
                                <%--</div>--%>
                            <%--</div>--%>
                        </div>
                        <div class="layui-col-md1 layui-col-lg1">
                            <div class="layui-badge relateLeft pointHand" style="background-color: grey" onclick="document.getElementById('producttpl_originTitle_new').value=''">清空标题</div>
                        </div>
                    </div>
                    <div class="layui-form-item newKeyWordElem" >
                        <div class="layui-col-md9 layui-col-lg9 disN" id="prodtpl_splitKeyWordResultDiv">
                            <label class="layui-form-label">拆分结果
                                <button type="button" class="layui-btn layui-btn-xs" onclick="translateGptSplitKeyWord()">
                                    翻译
                                </button>
                            </label>
                    <%--    <div class="layui-input-block">--%>
                        <%--    <textarea class="layui-textarea"  id="prodtpl_splitKeyWordResult" style="height: 250px;"></textarea>--%>
                    <%--    </div>--%>
                            <div class="layui-input-block" style="display: flex">
                                <textarea class="layui-textarea"  id="prodtpl_splitKeyWordResult1" style="height: 250px;"></textarea>
                                <textarea class="layui-textarea"  id="prodtpl_splitKeyWordResult2" readonly style="height: 250px;"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item newKeyWordElem">
                        <div class="layui-col-md12 layui-col-lg12">
                            <div><label class="layui-form-label" style="font-size: 22px"><span style="color:red;">*</span>关键词</label>
                                <div class="layui-input-block"><span class="layui-badge layui-bg-blue ml10 mr10">数量:<i id="producttpl_keywordsNumSpan">0</i></span><i class="layui-icon layui-icon-about"></i><span class="secondary">核心词+属性词+补充词的数量需≥10，同类型关键词如果重复只计数1个，且最终仅保存其中1个</span>
                                </div>
                            </div>
                            <div class="layui-input-block" id="producttpl_keyword_tip">
                                <div class="layui-col-md5 layui-col-lg5" style="color: #97CEEC">
                                    <p>·单词首字母大写</p>
                                    <p>·这些词不能大写：介词（for,in, on）、连词(and, or,)、冠词(the, a, an)</p>
                                    <p>·不要在标题中出现价格和促销信息，如Free shipping、Hot Sale、Promotion、100% quality guaranteed等</p>
                                    <p>·不要堆砌同一个意思或者不相关的关键词</p>
                                    <p>·不要用中文输入法状态下输入的标点符号</p>
                                    <p>·不要使用商标符号、高位 ASCII 字符（Æ、©、ô 等）</p>
                                </div>
                                <div class="layui-col-md7 layui-col-lg7" style="color: #97CEEC">
                                    <p><b>优秀标题拆解：</b></p>
                                    <p><b>·标题：</b>Bat Shaped Sunglasses for Women, Rimless Goth Glasses, UV 400 Protection Metal Frame Funny 90s Glasses Colorful Novelty Eyewear for Halloween Costume Disco Party Cosplay</p>
                                    <p><b>·核心关键词（精准词）：</b>Bat Shaped Sunglasses （蝙蝠形太阳镜）/ Rimless Goth Glasses （无框哥特眼镜）/ Rimless Bat Sunglasses（无框蝙蝠太眼镜）</p>
                                    <p><b>·产品属性词（尺寸、材质、颜色）：</b>Metal Frame（金属框架）/UV 400 Protection（UV 400防护）/Bat Shaped （蝙蝠形）/ Rimless （无框） / Goth （哥特）/Punk（朋克）/Novelty Eyewear（新奇特眼镜）</p>
                                    <p><b>·适用场景：</b>Women、Men、Halloween Costume、Disco Party、Cosplay</p>
                                    <p><b>·补充关键词：</b>Funny 90s Glasses、Colorful、Funky、Trendy、Funny</p>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md12 layui-col-lg12">
                            <div class="layui-input-block" >
                                <div class="layui-col-md12 layui-col-lg12">
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="keywordContain" name="keywordCore">
                                            <div class="keywordTitle mb10">
                                                <span style="color: red">*</span>核心关键词<div class="layui-badge pointHand layui-bg-green prodtpl_analysisBtn">分析</div>
                                            </div>
                                            <div>
                                                <textarea class="layui-textarea keywordInp" style="height: 250px;"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="keywordContain" name="keywordProdAttr">
                                            <div class="keywordTitle mb10">
                                                <span style="color: red">*</span>产品属性词(材质/尺寸/颜色/形状/属性等)
                                            </div>
                                            <div>
                                                <textarea class="layui-textarea keywordInp" style="height: 250px;"></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="keywordContain" name="keywordFit">
                                            <div class="keywordTitle mb10">
                                                适用场景/范围/人群/用途
                                            </div>
                                            <div>
                                                <textarea class="layui-textarea keywordInp" style="height: 250px;"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="keywordContain" name="keywordExtra">
                                            <div class="keywordTitle mb10">
                                                <span style="color: red">*</span>补充词
                                            </div>
                                            <div>
                                                <textarea class="layui-textarea keywordInp" style="height: 250px;"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-md12 layui-col-lg12">
                                    <div id="prodtpl_copyNewKeyWordBtn" class="layui-badge layui-bg-green pointHand">复制所有关键词</div>
                                    <div id="prodtpl_keywordFirstLetterUpperBtn" class="layui-badge layui-bg-green pointHand">首字母大写</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="layui-form-item ifDetailHidden newKeyWordElem">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">特殊数量</label>
                            <div class="layui-input-block">
                                <input type="text" name="specNumNew" placeholder="特殊的起卖量，如:5pairs、3pcs，不支持多个" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item ifDetailHidden newKeyWordElem">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">适用机型</label>
                            <div class="layui-input-block">
                                <input type="text" name="fitModel" placeholder="多个请用/隔开" class="layui-input">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item ifDetailHidden newKeyWordElem">
                        <div class="layui-col-md12 layui-col-lg12">
                            <label class="layui-form-label"><span id="prodtpl_generateTestTitleBtn" class="layui-btn layui-btn-xs">生成测试标题</span></label>
                            <div class="layui-input-block">
                                <span id="producttpl_testTitleSpan"></span>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item disN" notNull>
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">wish tags<br>
                                <span class="layui-badge layui-bg-blue">数量:<i class="tagsinputNum">0</i></span><br>
                            </label>
                            <div class="layui-input-block">
                                <div class="tagsinput-primary form-group">
                                    <input class="tagsinput" name="tag" type="text">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item" notNull>
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">
                                商品描述<br>
                                <span class="layui-badge layui-bg-blue copyTwoTextareaVal"
                                      style="cursor:pointer">一键复制</span>
                                <span class="layui-badge layui-bg-blue mt10"
                                      style="cursor:pointer" onclick="transferSizeOfDesc()">尺寸转换</span>
                            </label>
                            <div class="layui-input-block">
                                <textarea class="layui-textarea" name="prodDesc" ></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">&nbsp;</label>
                            <div class="layui-input-block">
                                <p>固定顺序描述,如使用步骤,可以为空</p>
                                <textarea class="layui-textarea" name="fixDesc" ></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item fivePointDescItem disN">
                        <div class="layui-col-md9 layui-col-lg9">
                            <label class="layui-form-label">五点描述</label>
                            <div class="layui-input-block">
                                <textarea class="layui-textarea mb5" name="fivePointDesc" placeholder="亚马逊精铺/亚马逊精品必填"/>
                                <textarea class="layui-textarea mb5" name="fivePointDesc" placeholder="亚马逊精铺/亚马逊精品必填"/>
                                <textarea class="layui-textarea mb5" name="fivePointDesc" placeholder="亚马逊精铺/亚马逊精品必填"/>
                                <textarea class="layui-textarea mb5" name="fivePointDesc" placeholder="亚马逊精铺/亚马逊精品必填"/>
                                <textarea class="layui-textarea mb5" name="fivePointDesc" placeholder="亚马逊精铺/亚马逊精品必填"/>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item disN">
                        <div class="layui-input-block">
                            <button class="layui-btn" type="button" id="submitTpl" lay-filter="submitTpl">立即提交
                            </button>
                            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                        </div>
                    </div>
                </form>
                <fieldset class="layui-elem-field layui-field-title site-demo-button" id="mainPic">
                    <legend style="font-size:14px">视频</legend>
                </fieldset>
                <div style="display: flex;">
                    <a class="layui-btn layui-btn-sm localUploadNetMp4Btn" style="margin-left: 15px;">本地上传</a>
                    <a class="layui-btn layui-btn-sm uploadNetMp4Btn" style="margin-left: 10px;">URL上传</a>
                    <a class="layui-btn layui-btn-sm layui-btn-danger deleteMp4Btn" style="margin-left: 10px;">删除视频</a>
                    <permTag:perm funcCode="prodtpl_syncMp4ToLazadaCode">
                        <a class="layui-btn layui-btn-sm  copyMp4ToLazadaBtn" style="margin-left: 10px;">同步公共视频库</a>
                    </permTag:perm>
                    <a id="producttpl_supplierVedioA" class="layui-btn layui-btn-sm layui-btn-disabled" style="margin-left: 10px;" target="_blank" >查看供应商视频</a>
                </div>
                <div style="margin:15px">
                    <span class="layui-bg-red">说明!</span>
                    <span>仅支持上传一个视频，视频不超过20M，时间限定1-60秒，仅支持MP4格式，像素限定480P-1280P之间</span>
                </div>
                <div class="mp4Contain">
                </div>

                <fieldset class="layui-elem-field layui-field-title site-demo-button" id="mainPic">
                    <legend style="font-size:14px">主图</legend>
                </fieldset>
                <div class="layui-form" style="position: relative;">
                    <div style="float: right;margin-bottom: 10px">
                        <input type="checkbox" lay-skin="primary" title="允许保存水印图" id="ifSaveWaterMarkImg" lay-filter="selectAllCheckboxes_pdc">
                    </div>
                </div>
                <%--imgContains 用于统一校验图片数量--%>
                <div class="layui-clear pl20 imgContains" data-maxImg="15" data-minImg="1" data-imgObjType="1"
                     data-id="mainImgContains">
                    <div class="uploadLocalImgBtn" style="margin-bottom:20px;display:inline-block"></div>
                    <!--图片上传按钮-->
                    <button type="button" class="layui-btn layui-btn-sm uploadNetImgBtn">网络图片</button>
                    <button type="button" class="layui-btn layui-btn-sm" onclick="downLoadAllImg(this)">下载主图</button>
                    <button type="button" class="layui-btn layui-btn-sm" onclick="downLoadForZipPackage(this)">打包下载</button>
                    <button type="button" class="layui-btn layui-btn-sm" onclick="copyAllUrl(this)">复制主图URL</button>
                    <button type="button" class="layui-btn layui-btn-sm" onclick="removeAllImg(this,'主图')" style="float: right;">移除所有主图</button>
                    <permTag:perm funcCode="prodtpl_capturePictureModule">
                    <button type="button" class="layui-btn layui-btn-sm" onclick="capturePictureModule('applyMainPic')" style="float: right;">采集图片&视频</button>
                    </permTag:perm>
                    <div style="margin-bottom:15px">
                        <span class="layui-bg-red">注意!</span>
                        <span>图片录入像素限制500-2000，系统会不等比例调整到1000*1000，请注意实际图片效果</span>
                    </div>
                    <div style="margin-bottom:15px">
                        <span class="layui-bg-red">说明!</span>
                        <span>
                                  「主图最多选用<font color="red">15</font>
                                   张,已经选用了<font class="curImgNum" color="green">0</font>
                                   张，主图至少<font color="blue">1</font>张」
                                </span>
                    </div>
                    <div class="layui-form">
                        <ul class="uploadImgUL ui-sortable">
                        </ul>
                        <div class="kongImgDivOut" style="display: inline-block;">
                            <img src="${ctx}/static/img/kong.png"
                                 style="width:120px;height:120px;border:1px solid #f2f2f2"/>
                            <!--预览图片-->
                        </div>
                    </div>
                </div>
                <fieldset class="layui-elem-field layui-field-title site-demo-button" id="assistPic">
                    <legend style="font-size:14px">辅图</legend>
                </fieldset>
                <div class="pl20 layui-clear imgContains" data-maxImg="50" data-minImg="0" data-imgObjType="2"
                     data-id="assistImgContains">
                    <div class="uploadLocalImgBtn" style="margin-bottom:20px;display:inline-block"></div>
                    <!--图片上传按钮-->
                    <button type="button" class="layui-btn layui-btn-sm uploadNetImgBtn">网络图片</button>
                    <button type="button" class="layui-btn layui-btn-sm" onclick="downLoadAllImg(this)">下载辅图</button>
                    <button type="button" class="layui-btn layui-btn-sm" onclick="copyAllUrl(this)">复制辅图URL</button>
                    <button type="button" class="layui-btn layui-btn-sm" onclick="removeAllImg(this,'辅图')" style="float: right;">移除所有辅图</button>
                    <div style="margin-bottom:15px">
                        <span class="layui-bg-red">注意!</span>
                        <span>图片录入像素限制500-2000，系统会不等比例调整到1000*1000，请注意实际图片效果</span>
                    </div>
                    <div style="margin-bottom:15px">
                        <span class="layui-bg-red">说明!</span>
                        <span>
                          「辅图最多选用<font color="red">50</font>张,已经选用了<font class="curImgNum" color="green">0</font>张」
                        </span>
                    </div>
                    <div class="layui-form">
                        <ul class="uploadImgUL ui-sortable">
                        </ul>
                        <div class="kongImgDivOut" style="display: inline-block;">
                            <img src="${ctx}/static/img/kong.png"
                                 style="width:120px;height:120px;border:1px solid #f2f2f2"/>
                            <!--预览图片-->
                        </div>
                    </div>
                </div>

                <fieldset class="layui-elem-field layui-field-title site-demo-button mt30" id="otherPic">
                    <legend style="font-size:14px">其他自拍图<div class="layui-btn layui-btn-xs" id="producttpl_showMoreOtherImg" data-show="false">展开</div></legend>

                </fieldset>
                <div class="pl20 layui-clear imgContains overContentEllipsis200px" data-maxImg="250" data-minImg="0" data-imgObjType="4"
                     data-id="otherImgContains" id="producttpl_otherImgContains">
                    <div class="layui-form">
                        <ul class="uploadImgUL ui-sortable">
                        </ul>
                        <div class="kongImgDivOut" style="display: inline-block;">
                            <img src="${ctx}/static/img/kong.png"
                                 style="width:120px;height:120px;border:1px solid #f2f2f2"/>
                            <!--预览图片-->
                        </div>
                    </div>
                </div>

                <fieldset class="layui-elem-field layui-field-title site-demo-button ifDetailHidden"
                          id="tplColor">
                    <legend style="font-size:14px">颜色</legend>
                </fieldset>
                <div class="pl20 productInfoModule-content ifDetailHidden">
                    <div id="productTpl_Color">

                    </div>
                    <div class="addColorGroup p20 dimSearchContent">
                        <div style="display:inline-block;width:255px;margin-right:10px">
                            <input type="text" class="layui-input" id="otherColor">
                        </div>
                        <div class="dimResultDiv"
                             style="width:255px;max-height: 365px;overflow-y: scroll;"></div>
                        <button class="layui-btn colorAdd layui-btn-sm" type="button"
                                onclick="colorAddBtnPrimary(this)">添加
                        </button>
                        <span class="layui-btn-danger ml20"><font color="#fff">说明:</font></span>
                        <span>请务必按要求添加！双色支持格式：black&white；单色请参考：<a
                                href="http://merchant.wish.com/documentation/colors"
                                target='_blank' style="color:#428BCA">wish官方颜色列表>></a>
                    </span>
                    </div>
                </div>
                <fieldset class="layui-elem-field layui-field-title site-demo-button ifDetailHidden"
                          id="tplSize">
                    <legend style="font-size:14px">尺寸</legend>
                </fieldset>
                <div class="pl20 ifDetailHidden">
                    <div class="shopKind layui-clear mt20">
                        <ul>
                            <li><a href="javascript:;" class="ulBgColor sizeBtn" rel="Man">男装</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Women">女装</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Child">儿童</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="ChildShoes">婴/童鞋</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="AdditionalApparelSizes">额外服装尺寸</a>
                            </li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Numbers">数字</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Bras">胸罩</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="ManShoes">男鞋</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="WomenShoes">女鞋</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Shoes">鞋子</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Macbooks">苹果电脑</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Smartphones">智能手机</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Gaming">游戏机</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Headphones">耳机</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Bedding">床上用品</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Memory">存储设备</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Area">面积容积或体积</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Length">长度</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Volume">容量</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Voltage">电压</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Wattage">瓦数</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Weight">重量(g)</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Shapes">形状</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="ElectricPlugs">电插头</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="MenSuitTuxedos">男士西装礼服</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Custom">自定义</a></li>
                            <li><a href="javascript:;" class="sizeBtn" rel="Others">其他</a></li>
                        </ul>
                    </div>
                    <div id="size_content" class="layui-clear" style="padding-left:20px"></div>
                </div>

                <fieldset class="layui-elem-field layui-field-title site-demo-button ifDetailHidden"
                          id="tplStyle">
                    <legend style="font-size:14px">款式</legend>
                </fieldset>
                <div class="pl20 ifDetailHidden">
                    <div class="layui-form-item">
                        <div class="layui-inline" style="width: 250px">
                            <input class="layui-input" id="styleInp_producttpl">
                        </div>
                        <span id="addStyleBtn_producttpl" class="layui-btn layui-btn-sm">添加</span>
                    </div>
                    <div id="style_content" class="layui-clear layui-form" lay-filter="" style="padding-left:20px">

                    </div>
                </div>

                <fieldset class="layui-elem-field layui-field-title site-demo-button" id="tplChange">
                    <legend style="font-size:14px">产品变种</legend>
                </fieldset>
                <div class="layui-form" id="shopSonSkuAttr_prod" style="position: relative;">
                    <div class="shopSonSkuAttr_prodSonInput" style="position: absolute;left: 20px;">
                        <input type="checkbox" lay-skin="primary" title="白底图" class="selectAllCheckboxes_pdc" id="selectAllCheckboxes_pdc" lay-filter="selectAllCheckboxes_pdc">
                        <input type="checkbox" lay-skin="primary" title="非供图" class="selectAllCheckboxes_notSupplier" id="selectAllCheckboxes_notSupplier" lay-filter="selectAllCheckboxes_notSupplier">
                    </div>
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal addVariantBtn"
                            style="float: right;margin: 0 0 10px 0;display: none">新增变种
                    </button>
                    <div class="goodsListParent">
                        <form class="layui-form" lay-filter="variantTableForm">
                            <table class="layui-table" id="goodsListTable">
                                <thead class="toFixedContain">
                                <tr>
                                    <th width='35'>排序</th>
                                    <th width='150'>SKU<span class="layui-btn layui-btn-xs layui-btn-normal"
                                                             id="prodtpl_copy">一键复制</span></th>
                                    <th width='110'>尺寸</th>
                                    <th width='110'>颜色</th>
                                    <th width='110'>款式</th>
                                    <th width='110'>重量(g)</th>
                                    <th width='110'>实际成本(¥)</th>
                                    <th width='110'>刊登警示价(¥)</th>
                                    <th width='18'>在售</th>
                                    <%--<th width='18'>有货</th>--%>
                                    <th width='18'>自拍图</th>
                                    <th width='18'>拍图需求</th>
                                    <th width='18'>引流</th>
                                    <th width='60'>操作</th>
                                </tr>
                                </thead>
                                <tbody id="goodsList">
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
            <div class="layui-tab-item p20">
                <div class="layui-tab layui-tab-brief">
                    <div class="layui-tab-content">
                        <div class="layui-tab-item layui-show">
                            <table class="layui-table">
                                <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>描述人</th>
                                    <th>日志</th>
                                </tr>
                                </thead>
                                <tbody id="tpl_LogTbody">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<%--</div>--%>
<div id="uploadImgInputDiv" class="myj-hide"></div>
<input id="skuPropertyCid" name="skuPropertyCid" type="hidden">
</script>
<!-- 产品类目弹出框 -->
<script type="text/html" id="tplCateLayer">
<div class="p20" id="innerTplCate">

</div>
</script>

<%-- 产品变种弹框 --%>
<script type="text/html" id="addVariantLayer">
<div id="addVariantContainer">
    <div class="variantColor">
        <div class="variantColorTitle">颜色</div>
        <div class="variantColorSel">
            <ul class="layui-clear"></ul>
        </div>
        <div class="variantColorInput">
            <input type="text" placeholder="可接受其他颜色的英文单词" class="variantColorVal">
            <div class="dimResultDiv" style="width:41%;max-height:255px;overflow-y:scroll"></div>
            <button type="button" class="variantColorBtn layui-btn layui-btn-sm layui-btn-normal">添加</button>
            <span>
                   <b>说明!</b>
                   双色支持格式：black&white；单色请参考：
                   <a href="http://merchant.wish.com/documentation/colors" target="_blank">wish官方颜色列表</a>
                </span>
        </div>
        <div class="colorErrorMsg"></div>
    </div>
    <div class="variantSize">
        <div class="variantSizeTitle">尺寸</div>
        <div class="variantSizeBody">
            <div class="variantSizeBodyHeader layui-clear">
                <ul></ul>
            </div>
            <div class="variantSizeBodyBody layui-clear"></div>
        </div>
    </div>
    <div class="variantStyle">
        <div class="variantStyleTitle">款式</div>
        <div class="variantStyleBody layui-form" lay-filter="addVariantStyleBox">

        </div>
        <div class="variantStyleInput">
            <input type="text" class="variantStyleVal">
            <span type="button" class="variantStyleBtn layui-btn layui-btn-sm layui-btn-normal">添加</span>
        </div>
    </div>
</div>
</script>

<script type="text/javascript">
    var msgBtn = [];
    var msgBtn1 = [];
    <permTag:perm funcCode="process_msg_btn">
    msgBtn.push('处理')
    </permTag:perm>
    <permTag:perm funcCode="add_msg_btn">
    msgBtn.push('保存')
    msgBtn1.push('保存')
    msgBtn1.push('保存并发布')
    </permTag:perm>
    msgBtn.push('关闭')
    msgBtn1.push('关闭')
</script>
<!-- 商品优化弹窗end -->
<!-- 新增产品 -->
<script src="${ctx}/static/jquery-ui.min.js"></script>

<script src="${ctx}/static/util/we.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script type="text/javascript" src="${ctx}/static/util/regUtils.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/proTplData.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/prodTpl.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/util/md5.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/productedit.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/productVariant.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/process/msgdevelopButton.js?v=${ver}"></script>
<script src="${ctx}/static/js/commodity/template/productTplButton.js?v=${ver}"></script>
<script src="${ctx}/static/util/ImgCompareUtil.js?v=${ver}"></script>
<script src="${ctx}/static/layui/saveFile.js?v=${ver}"></script>
<script src="${ctx}/static/layui/jszip.min.js?v=${ver}"></script>
<script src="${ctx}/static/util/downloadImage.js?v=${ver}"></script>
<script>
var joomSensArray = new Array();
<c:forEach items="${joomSensProp}" var="sensProp">
var obj = {};
obj['name'] = '${sensProp.name}';
obj['value'] = '${sensProp.name}';
obj['extend'] = '${sensProp.extend1}';
joomSensArray.push(obj);
</c:forEach>
</script>

<script type="text/javascript">
// 获取物流属性的简称
function getColorOfLogis_productTpl (name) {
  var totalLogis = $('#logisDiv_productTpl option')
  var alias = ''
  if (!name) {
    return alias
  }
  for (var i = 0; i < totalLogis.length; ++i) {
    if (name == totalLogis[i].value) {
      alias = totalLogis[i].getAttribute('alias')
      alias = alias ? alias : '#999999'
    }
  }
  return alias
}

/**
 * 展开全部和收起全部功能
 */
function expandAll () {
  var allShow = $('.productListSkuShow')
  for (var i = 0; i < allShow.length; i++) {
    var showi = allShow[i]
    if ($(showi).html().indexOf('展开') > -1) {
      $(showi).trigger('click')
    }
  }
}

function PackUpAll () {
  var allShow = $('.productListSkuShow')
  for (var i = 0; i < allShow.length; i++) {
    var showi = allShow[i]
    if ($(showi).html().indexOf('收起') > -1) {
      $(showi).trigger('click')
    }
  }
}

</script>
<!--审核日志弹出框 -->
<script type="text/html" id="tpl_auditLogLayer">
<div style="padding:20px 50px 0 20px">
    <div class="layui-tab-item layui-show">
        <table class="layui-table">
            <thead>
            <tr>
                <th>时间</th>
                <th>操作人</th>
                <th>审核结果</th>
                <th>备注</th>
            </tr>
            </thead>
            <tbody id="tpl_auditLogTbody">
            </tbody>
        </table>
    </div>
</div>
</script>

<%--侵权信息修改弹窗--%>
<script type="text/html" id="tortInfoEditPop_productTpl">
<div style="text-align: center">
    <form class="layui-form" lay-filter="tortInfoEditPop_productForm" id="tortInfoEditPop_productForm">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-col-md2 layui-col-lg2" style="margin-left: 38px">
                    <select name="ifTort" lay-search>
                        <option value="">是否侵权</option>
                        <option value="true">是</option>
                        <option value="false">否</option>
                    </select>
            </div>
            <div class="layui-col-md3 layui-col-lg3">
                <input class="layui-input" name="tortReason" placeholder="侵权原因">
            </div>
            <div class="layui-col-md3 layui-col-lg3">
                <input class="layui-input" name="saleRemark" placeholder="销售备注">
            </div>
            <div class="layui-col-md3 layui-col-lg3">
                <div class="layui-btn layui-btn-sm" id="producttpl_batchUpdate">批量修改</div>
            </div>
        </div>
    </form>
    <div class="layui-col-md12 layui-col-lg12 layui-form" lay-filter="producttpl_tortInfoEditTableForm">
        <table id="tortInfoTable_productTpl" lay-filter="tortInfoTable_productTpl">
        </table>
    </div>
</div>
</script>

<script type="text/html" id="exportPublishStasticsPop_producttpl">
<div class="layui-tab">
    <ul class="layui-tab-title">
        <li class="layui-this" onclick="getSalesByPlayCode('ebay')">ebay</li>
        <li onclick="getSalesByPlayCode('wish')">wish</li>
        <li onclick="getSalesByPlayCode('amazon')">amazon</li>
        <li onclick="getSalesByPlayCode('shopee')">shopee</li>
        <li onclick="getSalesByPlayCode('lazada')">lazada</li>
        <li onclick="getSalesByPlayCode('aliexpress')">aliexpress</li>
        <li onclick="getSalesByPlayCode('joom')">joom</li>
        <li onclick="getSalesByPlayCode('fyndiq')">fyndiq</li>
    </ul>
    <form class="layui-form" lay-filter="salesCheckForm_producttpl" id="salesCheckForm_producttpl">
        <div class="ml20 mt10"><input type="checkbox" id="productTplCheckAllSaler" lay-filter="productTplCheckAllSaler"
                                      title="全选"></div>
        <input name="platCode" type="hidden">
        <div class="layui-tab-content" id="saleContent_producttpl">
            <div class="layui-tab-item" data-platCode="ebay"></div>
            <div class="layui-tab-item" data-platCode="wish"></div>
            <div class="layui-tab-item" data-platCode="amazon"></div>
            <div class="layui-tab-item" data-platCode="shopee"></div>
            <div class="layui-tab-item" data-platCode="lazada"></div>
            <div class="layui-tab-item" data-platCode="aliexpress"></div>
            <div class="layui-tab-item" data-platCode="joom"></div>
            <div class="layui-tab-item" data-platCode="fyndiq"></div>
        </div>
    </form>
</div>
</script>

<%--导出模板弹框--%>
<script type="text/html" id="exportTemplatePop_producttpl">
<form class="layui-form">
    <div><input type="checkbox" title="全选" lay-filter="selectAll_exportTemplatePop_producttpl"></div>
</form>
<div class="p20">
    <div class="layui-tab layui-tab-card">
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show p20">
                <form class="layui-form" action="" lay-filter="exportTemplateForm_producttpl"
                      id="exportTemplateForm_producttpl">
                    <fieldset class="layui-elem-field layui-field-title site-demo-button">
                        <legend style="font-size:14px">子模板信息</legend>
                    </fieldset>
                    <div class="fieldBox"><input type="checkbox" title="子sku" disabled lay-skin="primary" checked></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="数量" title="数量"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="商品名称" title="商品名称"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="是否组合品" title="是否组合品"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="是否在售" title="是否在售"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="是否缺货" title="是否缺货"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="尺寸" title="尺寸"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="颜色" title="颜色"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="重量(g)" title="重量(g)"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="实际成本(¥)" title="实际成本(¥)"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="物流属性(子)" title="物流属性(子)"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="刊登价格" title="刊登价格"
                                                 lay-skin="primary"></div>
                    <div style="clear:left"></div>
                    <fieldset class="layui-elem-field layui-field-title site-demo-button">
                        <legend style="font-size:14px">库存预警信息</legend>
                    </fieldset>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="可用库存" title="可用库存"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="在途库存" title="在途库存"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="未派单" title="未派单"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="7日销量" title="7日销量"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="15日销量" title="15日销量"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="30日销量" title="30日销量"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="60日销量" title="60日销量"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="90日销量" title="90日销量"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="ebay虚拟仓7日销量"
                                                 title="ebay虚拟仓7日销量" lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="ebay虚拟仓15日销量"
                                                 title="ebay虚拟仓15日销量" lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="sSkuField" value="ebay虚拟仓30日销量"
                                                 title="ebay虚拟仓30日销量" lay-skin="primary"></div>
                    <div style="clear:left"></div>
                    <fieldset class="layui-elem-field layui-field-title site-demo-button">
                        <legend style="font-size:14px">父模板信息</legend>
                    </fieldset>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="父sku" title="父sku"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="关联新品开发父sku" title="关联新品开发父sku"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="模板类型" title="模板类型"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="业绩归属人" title="开发专员"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="责任归属人" title="责任人"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="类目" title="类目" lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="新类目" title="新类目" lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="是否有自拍图" title="是否有自拍图"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="是否供应商原图" title="是否供应商原图"
                                                 lay-skin="primary"></div>

                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="物流属性(父)" title="物流属性(父)"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="中文名称" title="中文名称"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="英文名称" title="英文名称"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="适用对象" title="适用对象"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="特殊数量" title="特殊数量"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="原店铺标题" title="原店铺标题"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="关键词" title="关键词"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="wish tags" title="wish tags"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="商品描述" title="商品描述"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="固定描述" title="固定描述"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="全平台侵权情况" title="全平台侵权情况"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="全平台销售备注" title="全平台销售备注"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="侵权品牌" title="侵权品牌"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="审核状态" title="审核状态"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="审核备注" title="审核备注"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="审核人" title="审核人"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="审核组" title="审核组"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="第一次通过审核时间" title="第一次通过审核时间"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="开发类型" title="开发类型"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="开发备注" title="开发备注"
                                                 lay-skin="primary"></div>
                    <%--<div class="fieldBox"><input type="checkbox" name="pSkuField" value="备注" title="备注" lay-skin="primary"></div>--%>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="父sku创建时间" title="父sku创建时间"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="发布时间" title="发布时间"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="第一次审核时间" title="第一次审核时间"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="模板创建时间" title="模板创建时间"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="自拍图状态" title="自拍图状态"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="自拍图需求" title="自拍图需求"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="亚马逊图状态" title="亚马逊图状态"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="wish主图需求" title="wish主图需求"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="wish主图需求时间" title="wish主图需求时间"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="wish主图完成时间" title="wish主图完成时间"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="自拍图时间" title="自拍图时间"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="是否多属性" title="是否多属性"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="joom敏感货" title="joom敏感货"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="是否独立包装" title="是否独立包装"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="非独立包装备注" title="非独立包装备注"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="是否特殊包装" title="是否特殊包装"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="特殊包装备注" title="特殊包装备注"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="禁售详情" title="禁售详情"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="商品标签" title="商品标签"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="关键词(新)" title="关键词(新)"
                                                 lay-skin="primary"></div>
                    <div class="fieldBox"><input type="checkbox" name="pSkuField" value="特殊数量(新)" title="特殊数量(新)"
                                                 lay-skin="primary"></div>
                    <div style="clear:left"></div>
                </form>
            </div>
        </div>
    </div>
</div>
</script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/newdevDetail.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productoptimize.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/product/addprodpinfo.jsp" %>
<style>
    .fieldBox {
        float: left;
        width: 20%;
        height: 25px;
    }

    .redBorderMark {
        border: 2px solid red;
    }

    .detailImg_prodtpl {
        width: 150px;
        height: 150px;
        border: 1px solid #f2f2f2
    }

    @-webkit-keyframes shineRed {
        from {
            -webkit-box-shadow: 0 0 5px #bbb;
        }
        50% {
            -webkit-box-shadow: 0 0 10px red;
        }
        to {
            -webkit-box-shadow: 0 0 5px #bbb;
        }
    }

    @-webkit-keyframes shineBlue {
        from {
            -webkit-box-shadow: 0 0 9px #333;
        }
        50% {
            -webkit-box-shadow: 0 0 18px blue;
        }
        to {
            -webkit-box-shadow: 0 0 9px #333;
        }
    }

    .shine_red {
        -webkit-animation-name: shineRed;
        -webkit-animation-duration: 2s;
        -webkit-animation-iteration-count: infinite;
    }

    [data-id="mainImgContains"] .imgDivDown {
        padding-right: 25px;
    }

    [data-id="assistImgContains"] .imgDivDown {
        padding-right: 12px;
    }
</style>

<script type="text/html" id="saleCountPop_producttpl">

<div class="layui-card">
    <div class="layui-card-body" style="display: flex;align-items: center">
        <div style="flex: 1;overflow: auto">
            <table class="layui-table" id="saleCountPop_productTable" lay-filter="saleCountPop_productTable"></table>
        </div>
        <div class="expandIcon" onclick="expandTable(this)">></div>
    </div>
</div>
</script>

<script type="text/html" id="prohibitDetailPop_producttpl">
<div class="layui-card">
    <div class="layui-card-body">
        <table class="layui-table" id="prohibitDetailPop_productTable" lay-filter="saleCountPop_productTable"></table>
    </div>
</div>
</script>
<script type="text/html" id="collect_cropImage_layer">
    <div style="width: 100%;height: 400px;margin-top: 30px;text-align: center;">
        <img id="collectCroppingImg" />
    </div>
</script>

<script type="text/html" id="producttpl_changeOACateAll">
<form lay-filter="producttpl_changeOACateAll_form" class="layui-form" id="producttpl_changeOACateAll_form">
    <div class="layui-col-lg12 layui-col-md12">
        <div class="layui-form-item">
            <div class="layui-col-md12 layui-col-lg12">
                <div class="layui-col-md2 layui-col-lg2 catechoose_tpl_Form">
                    <label class="layui-form-label">类目</label>
                    <div class="layui-input-block">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                                id="prodTpl_choose_changeOACateAll">选择分类
                        </button>
                        <!-- <input type="hidden" name="prodTpl_choose_inp_changeOACateAll" value=""
                               id="prodTpl_choose_inp_changeOACateAll"/>
                        <input type="hidden" name="prodTpl_chooseid_inp_changeOACateAll" value=""
                               id="prodTpl_chooseid_inp_changeOACateAll"/> -->
                        <i id="prodTpl_clearPlat" class="layui-icon layui-icon-delete" style="cursor: pointer"
                           title="删除产品类目"></i>
                    </div>
                </div>
                <div class="layui-col-md8 layui-col-lg8" id="prodTpl_changeOACateAll">

                </div>
                <input type="hidden" name="prodTpl_chooseid_inp_changeOACateAll" value=""
                        id="prodTpl_chooseid_inp_changeOACateAll"/>
                <input type="hidden" name="prodTpl_choose_inp_changeOACateAll" value=""
                        id="prodTpl_choose_inp_changeOACateAll"/>
                <div style="color: red;" class="layui-col-md12 layui-col-lg12">注意：修改新类目后，模板原来的属性值都会被清空！</div>
            </div>
        </div>
        <div class="layui-col-md12 layui-col-lg12 catechoose_tpl_Form">
            <h3 class="disN">类目属性</h3>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-md7 layui-col-lg7">
                <div id="cateAttrBox_changeOACateAll">
                    <div class="cateAttrValueBox_changeOACateAll disN">
                        <label class="layui-form-label">
                            <span id="mandatory_changeOACateAll" style="color: red;"></span>
                            <span id="cateAttrValue_changeOACateAll"></span>
                            <input type="hidden" name="cateAttrValueId" id="cateAttrValueId_changeOACateAll">
                        </label>
                        <div class="layui-input-block">
                            <select name="cateSEL_changeOACateAll" lay-search="" id="cateSEL_changeOACateAll"></select>
                        </div>
                    </div>
                    <div class="cateAttrBoxInner_changeOACateAll"></div>
                </div>
            </div>
        </div>
    </div>
</form>
</script>


<%-- 批量修改类目属性弹框 --%>
<script type="text/html" id="prodTpl_batchEditCatesAttr_layer">
<div class="layui-form" id="prodTpl_batchEditCatesAttrContainer" style="padding: 20px 20px 0 0;">

</div>
</script>
<script type="text/html" id="prodTpl_batchEditCatesAttrContainerTpl">
{{# if(d.length>0){ }}
<div class="layui-form-item layui-col-md12 layui-col-space10">
    <div class="layui-col-md3 layui-col-md-offset9">
        <input type="checkbox" class="prodTpl-batchEditCatesAttr-all-cbox" lay-skin="primary" title="全选"
               lay-filter="prodTpl-batchEditCatesAttr-all-cbox-filter">
    </div>
</div>
{{#  layui.each(d, function(index, item){ }}
<div class="layui-form-item layui-col-md12 layui-col-space10">
    <div class="layui-col-md9">
        <input type="hidden" name="cateOaAttr" value="{{item.attrName}}">
        <input type="hidden" name="cateOaAttrId" value="{{item.id}}">
        <label class="layui-form-label">{{item.attrName}}</label>
        <div class="layui-input-block">
            <select>
                {{# layui.each(item.prodCateOaAttrValueList, function(selectIndex, selectItem){ }}
                <option value="{{selectItem.attrValue}}">{{selectItem.attrValue}}</option>
                {{# }); }}
            </select>
        </div>
    </div>
    <div class="layui-col-md3">
        <input type="checkbox" class="prodTpl-batchEditCatesAttr-cbox" lay-skin="primary" title="修改">
    </div>
</div>
{{# }); }}
{{# }else{ }}
<div>暂无属性</div>
{{# } }}

</script>


<script type="text/html" id="layer_work_develop_pl">
    <div class="layui-fluid" id="LAY-iframe-itemCat">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <input type="text" id="itemCat_input" />
                <div id="LAY-iframe-itemCat-getCates" style="margin-top:20px"></div>
            </div>
        </div>
    </div>
</script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/catePresets.jsp" %>
