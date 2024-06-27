<%--
  Created by IntelliJ IDEA.
  User: Ep
  Date: 2018/9/20
  Time: 15:10
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<link rel="stylesheet" href="${ctx}/static/webuploader/webuploader.css">
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<style>
    .platTree{
        display: none;
    }
    .treeGroup{
        border-radius: 3px;
        margin-bottom: 10px;
        padding: 7px 15px;
        color: #333;
        cursor: pointer;
        background-color: #f2f2f2;
        border: 1px solid #ccc;
    }
    .treeDetail{
        margin-left:36px;
    }
    .salesName {
        border-radius: 3px;
        cursor: pointer;
        margin-bottom: 10px;
        color: #333;
        cursor: pointer;
        background-color: #f2f2f2;
        border: 1px solid #ccc;
        padding: 5px;
    }
    .salesDetail {
        margin-left: 10px;
    }
    .storeBox_producttpl{
        float: left;
        width: 16%;
        height: 30px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
    }
    @media screen and (max-width: 1400px){
        .storeBox_producttpl{
            float: left;
            width: 20%;
            height: 30px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
        }
    }
    .clearLeft{
        clear: left;
    }
</style>

<%-- 竞品链接 --%>
<script type="text/html" id="tpl_compUrlLayer">
    <div class="layui-tab layui-tab-card">
        <div class="layui-tab-content">
            <div>
                <table class='layui-table'>
                    <thead>
                    <tr>
                        <th><font color="red">*</font>平台</th>
                        <th><font color="red">*</font>站点</th>
                        <th><font color="red">*</font>链接</th>
                        <th><font color="red">*</font>销量</th>
                        <th><font color="red">*</font>价格</th>
                        <th><font color="red">*</font>币种</th>
                        <th>是否相似品</th>
                        <th>毛利率</th>
                        <th>利润</th>
                        <th>提交人</th>
                        <th>提交时间</th>
                        <th width="50">操作</th>
                    </tr>
                    </thead>
                    <tbody id="tpl_compList" class="layui-form" lay-filter="tpl_compList">

                    </tbody>
                </table>
                <div class="taRight">
                    <button class="layui-btn layui-btn-sm" id="tpl_compAdd">新增链接</button>
                </div>
            </div>
        </div>
    </div>
</script>

<%-- 刊登状态弹框 --%>
<script type="text/html" id="producttpl_listingStatus">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <input type="hidden" id="producttpl_listing_status_prodPId"/>
            <ul class="layui-tab-title isCreateHidden" style="position:fixed;left:calc(5% + 5px);right:calc(5% + 20px);top: calc(5% + 45px);z-index: 999999;" title="平台(在售listing/下架listing/总店铺数)">
                <li class="layui-this" onclick="producttpl_AjaxToGetListingStatus('ebay')">ebay<span id="producttpl_listing_num_span_ebay"></span></li>
                <li onclick="producttpl_AjaxToGetListingStatus('aliexpress')">smt<span id="producttpl_listing_num_span_aliexpress"></span></li>
                <li onclick="producttpl_AjaxToGetListingStatus('tiktok')">tiktok<span id="producttpl_listing_num_span_tiktok"></span></li>
                <li onclick="producttpl_AjaxToGetListingStatus('shopee')">shopee<span id="producttpl_listing_num_span_shopee"></span></li>
                <li onclick="producttpl_AjaxToGetListingStatus('lazada')">lazada<span id="producttpl_listing_num_span_lazada"></span></li>
                <li onclick="producttpl_AjaxToGetListingStatus('amazon')">amazon<span id="producttpl_listing_num_span_amazon"></span></li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20 pora layui-form" lay-filter="treeContent_producttpl">
                    <div class="treeContent">
                        <div class="platTree" id="producttpl_Tree_ebay">
                            <input hidden id="contendProd_ifHadAjax_ebay"/>
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_wish">
                            <input hidden id="ifHadAjax_wish">
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_aliexpress">
                            <input hidden id="ifHadAjax_aliexpress">
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_joom">
                            <input hidden id="ifHadAjax_joom">
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_shopee">
                            <input hidden id="ifHadAjax_shopee">
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_amazon">
                            <input hidden id="ifHadAjax_amazon">
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_lazada">
                            <input hidden id="ifHadAjax_lazada">
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_fyndiq">
                            <input hidden id="ifHadAjax_fyndiq">
                            <div class="group_content">
                            </div>
                        </div>
                        <div class="platTree" id="producttpl_Tree_tiktok">
                            <input hidden id="ifHadAjax_tiktok">
                            <div class="group_content">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<%-- 刊登翻译弹框 --%>
<script type="text/html" id="producttpl_TranslationPop">
    <div class="p20">
        <form id="producttpl_TranslationSrcForm" class="layui-form" lay-filter="producttpl_TranslationSrcForm">
            <input type="hidden" name="prodPId"/>
            <input type="hidden" name="currentLanguage"/>
            <div class="layui-form-item">
                <label class="layui-form-label">关键词</label>
                <div class="layui-input-block">
                    <input type="text" name="keyword" class="layui-input" disabled>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">随机描述</label>
                <div class="layui-input-block">
                    <textarea type="text" name="prodDesc" class="layui-textarea" disabled></textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">固定描述</label>
                <div class="layui-input-block">
                    <textarea type="text" name="fixDesc" class="layui-textarea" disabled></textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">适用对象</label>
                <div class="layui-input-block">
                    <div class="layui-col-lg2 layui-col-md2">
                        <input class="layui-input" name="appObject" disabled>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <input class="layui-input" name="appObject" disabled>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <input class="layui-input" name="appObject" disabled>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">特殊数量</label>
                <div class="layui-input-block">
                    <div class="layui-col-lg2 layui-col-md2">
                        <input class="layui-input" name="specNum" disabled>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <input class="layui-input" name="specNum" disabled>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <input class="layui-input" name="specNum" disabled>
                    </div>
                </div>
            </div>
        </form>
        <form id="producttpl_TranslationForm" class="layui-form" lay-filter="producttpl_TranslationForm">
            <div class="layui-tab layui-tab-card">
                <div style="height: 40px; background-color: #f2f2f2">
                    <ul class="layui-tab-title isCreateHidden fl" id="productTplButton_langugeBoxUl">
                    </ul>
                    <div class="fr"><a class="layui-btn layui-btn-xs layui-btn-xs" onclick="traslateByLanguage(false)">全语种翻译</a></div>
                    <div class="fr"><a class="layui-btn layui-btn-xs layui-btn-xs" onclick="traslateByLanguage(true)">翻译</a></div>
                </div>

                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show p20 pora layui-form">
                        <div class="TraslationContains" id="productTplButton_TraslationContains">

                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<!--刊登预估价弹出框 -->
<script type="text/html" id="tpl_listPriceLayer">
    <div style="padding:20px 50px 0 20px">
        <div class="layui-tab-item layui-show">
            <form lay-filter="listingPriceForm_ptb" class="layui-form" id="listingPriceForm_ptb" autocomplete="false">
                <input hidden name="prodSId">
                <input hidden name="prodSTempId">
                <div class="layui-col-md3 layui-col-lg3">
                    <label class="layui-form-label" lay-tips="min(采购单价，平均成本)+内包装成本">成本(￥)</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="price">
                    </div>
                </div>
                <div class="layui-col-md3 layui-col-lg3">
                    <label class="layui-form-label">重量(g)</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="weight">
                    </div>
                </div>
                <div class="layui-col-md3 layui-col-lg3">
                    <label class="layui-form-label">毛利率(%)</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="grossProfitRate" placeholder="如20%,填写20,下同">
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2 ">
                    <label class="layui-form-label"></label>
                    <div class="layui-input-block">
                        <span class="layui-btn layui-btn-sm" onclick="reGetListingPrice()">更新</span>
                    </div>
                </div>
                <table class="layui-table" id="listingPriceTable_productTplButton" lay-filter="listingPriceTable_productTplButton">
                </table>
            </form>
        </div>
    </div>
</script>

<script type="text/html" id="listingPriceTable_productTplButton_bar">
    <span class="layui-btn layui-btn-sm" lay-event="update" >更新</span>
</script>
<script type="text/html" id="listingPriceShow_productTplButton">
    <div name="listingPriceShow">{{d.listingPriceShow}}</div>
</script>
<script type="text/html" id="listingDollarShow_productTplButton">
    <div name="listingDollarShow">{{d.listingDollarShow}}</div>
</script>
<script type="text/html" id="tpl_devIdeaWayPop">
    <div style="padding:20px 50px 0 20px">
        <form  class="layui-form layui-form-pane" lay-filter="devIdeaWayShowForm" id="devIdeaWayShowForm">
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">开发备注</label>
                <div class="layui-input-block">
                    <textarea  class="layui-textarea" name="devNote"></textarea>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">主管备注</label>
                <div class="layui-input-block">
                    <textarea  class="layui-textarea" name="managerNote"></textarea>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">老板备注</label>
                <div class="layui-input-block">
                    <textarea  class="layui-textarea" name="bossNote"></textarea>
                </div>
            </div>
            <div class="layui-tab-item layui-show">
                <table class="layui-table" id="tpl_devIdeaWayTab" lay-filter="tpl_devIdeaWayTab">
                    <thead>
                        <tr>
                            <th>时间</th>
                            <th>审核人</th>
                            <th>审核结果</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </form>
    </div>
</script>

<!--自定义刊登映射弹窗 -->
<script type="text/html" id="tpl_setProdProhibitMapping">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <input type="hidden" id="prodPId_tpl_setProdProhibitMapping" >
                <span class="layui-btn layui-btn-sm fr" onclick="addProdProhibitMapping()">新增</span>
                <div class="layui-tab-item layui-show">
                    <table class="layui-table" id="tpl_setProdProhibitMappingTable" lay-filter="tpl_setProdProhibitMappingTable">
                    </table>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="tplbtn_isListingAble">
    {{# if (d.isListingAble) {}}
    <span style="color: grey;">否</span>
    {{# } else {}}
    <span style="color: red;">是</span>
    {{# } }}
</script>

<script type="text/html" id="tplbtn_ifFixedInable">
    {{# if (d.ifFixedInable) {}}
        <span style="color: red;">禁售</span>
    {{# } else {}}
        <span style="color: grey;">不禁售</span>
    {{# } }}
</script>
<script type="text/html" id="tpl_AddProdProhibitMappingPop">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <form class="layui-form" lay-filter="addprohibitconfForm_prodtplButton" id="addprohibitconfForm_prodtplButton"
                      autocomplete="off">
                    <input type="hidden" name="prodPId" >

                    <div class="layui-form-item">
                        <div class="layui-inline" notNull>
                            <label class="layui-form-label">平台</label>
                            <div class="layui-input-inline">
                                <select name="platCode" lay-filter="plateCode_addprohibitconfForm_prodtplButton" lay-search>
                                    <option></option>
                                    <c:forEach items="${salesPlatList}" var="salesPlat">
                                        <option value="${salesPlat.name}">${salesPlat.name}</option>
                                    </c:forEach>
                                </select>
                                <input id="platCodeInp_addConfForm" class="layui-input disN" disabled>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">站点</label>
                            <div class="layui-input-inline">
                                <input id="salesSiteInp_addConfForm" class="layui-input disN" disabled>
                                <select name="salesSiteId" lay-search>
                                    <option value=""></option>
                                </select>
                                <div class="disN" id="salesSite_addConfForm_wish_copy">
                                    <option value=""></option>
                                </div>
                                <div class="disN" id="salesSite_addConfForm_amazon">
                                    <option value=""></option>
                                </div>
                                <div class="disN" id="salesSite_addConfForm_aliexpress">
                                    <option value=""></option>
                                </div>
                                <div class="disN" id="salesSite_addConfForm_joom">
                                    <option value=""></option>
                                </div>
                                <div class="disN" id="salesSite_addConfForm_smt">
                                    <option value=""></option>
                                </div>
                                <div class="disN" id="salesSite_addConfForm_ebay">
                                    <option value=""></option>
                                    <c:forEach items="${ebaySiteEnum}" var="site">
                                        <option value="${site.siteId}">${site.cnTitle}</option>
                                    </c:forEach>
                                </div>
                                <div class="disN" id="salesSite_addConfForm_shopee">
                                    <option value=""></option>
                                    <c:forEach items="${shopeeSiteEnum}" var="site">
                                        <option value="${site.code}">${site.name}</option>
                                    </c:forEach>
                                </div>
                            </div>
                        </div>
                        <div class="layui-inline" notNull>
                            <label class="layui-form-label">是否禁售</label>
                            <div class="layui-input-inline layui-form" lay-filter="ifFixedInable_filter">
                                <select name="ifFixedInable" lay-search>
                                    <option></option>
                                    <option value="1">是</option>
                                    <option value="0">否</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item layui-form-text">
                        <label class="layui-form-label">禁售原因</label>
                        <div class="layui-input-block">
                            <textarea class="layui-textarea" name="fixedInableMsg"></textarea>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>
<%--美工评分弹框--%>
<script type="text/html" id="evaluate_selfImgLayer">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <form class="layui-form" lay-filter="evaluate_selfImgForm" id="evaluate_selfImgForm" autocomplete="off">
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label"><span style="color: red;">*</span>评价</label>
                            <div class="layui-input-block">
                                <input type="radio" name="score" value="5" title="满意" >
                                <%--<input type="radio" name="score" value="3" title="一般">--%>
                                <input type="radio" name="score" value="1" title="需要改善">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-itemlayui-form-text">
                        <label class="layui-form-label">备注</label>
                        <div class="layui-input-block">
                            <textarea class="layui-textarea" name="remark" placeholder="如果评价为需要改善，必须填写备注"></textarea>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <%--详情--%>
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <form class="layui-form" lay-filter="selfImgEvaluateDetailSearchForm" id="selfImgEvaluateDetailSearchForm" autocomplete="off">
                    <div class="layui-form-item">
                        <div class="layui-row">
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">评价类型</label>
                                <div class="layui-input-block">
                                    <select name="type" lay-filter="selfImgEvaluateDetailForm_type" lay-search>
                                        <option value=""></option>
                                        <option value="1">摄影</option>
                                        <option value="2">美工</option>
                                    </select>
                                </div>
                                <input type="hidden" class="hiddenContent" name="score" value="5">
                                <input type="hidden" class="hiddenContent" name="pSku">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="layui-card" id="selfImgEvaluateDetailCard">
                <div class="layui-card-header">
                    <div style="float:left;">
                        <ul class="layui-tab-title fl">
                            <li class="layui-this score_selfImgEvaluateDetail" data-value="5">满意【<span id="selfImgEvaluateDetailNum5"></span>(<span id="selfImgEvaluateDetailPer5"></span>)】</li>
                            <%--<li class="score_selfImgEvaluateDetail" data-value="3">一般【<span id="selfImgEvaluateDetailNum3"></span>(<span id="selfImgEvaluateDetailPer3"></span>)】</li>--%>
                            <li class="score_selfImgEvaluateDetail" data-value="1">需要改善【<span id="selfImgEvaluateDetailNum1"></span>(<span id="selfImgEvaluateDetailPer1"></span>)】</li>
                        </ul>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="selfImgEvaluateDetailTable" lay-filter="selfImgEvaluateDetailTable"></table>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="tpl_setProdProhibitMapping_bar">
    <span class="layui-btn layui-btn-sm fr" onclick="editProdProhibitMapping( {{d.id}},'{{d.platCode}}','{{d.salesSite}}',{{d.ifFixedInable ? d.ifFixedInable : false}},'{{d.fixedInableMsg ? d.fixedInableMsg : ''}}' )">编辑</span>
</script>
<script type="text/html" id="grossRate_productTplButton">
    <input class="layui-input" name="grossRate">
</script>

<script type="text/html" id="msgSelfScoreTpl">
    {{# if (d.score == 5){ }}
        满意
    {{# }}}
    {{# if (d.score == 3){ }}
    一般
    {{# }}}
    {{# if (d.score == 1){ }}
    需要改进
    {{# }}}
</script>

<script>
    var currencyArrayprodButton = new Array();
    <c:forEach items="${currencyEnums}" var="currency">
        currencyArrayprodButton.push("${currency.getName()}");
    </c:forEach>
    var salesPlatArray = ["wish", "ebay", "amazon", "aliexpress", "shopee", "joom", "1688"]
</script>

<%--站点可选选项--%>
<div id="salesSiteBox_productTplButton">
    <div class="disN" id="salesSite_productTplButton_wish">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_productTplButton_amazon">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_productTplButton_lazada">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_productTplButton_aliexpress">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_productTplButton_joom">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_productTplButton_smt">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_productTplButton_ebay">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_productTplButton_shopee">
        <option value=""></option>
    </div>
</div>