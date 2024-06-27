<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<title>禁售设置</title>
<style>
.prohibitconfLayer-tips {
    float: left;
    font-size: 20px;
    color: red;
    font-weight: 800;
}
    #LAY-iframe-itemCat .layui-col-md3,
    #LAY-iframe-itemCat .layui-col-xs3 {
        width: 24%;
        height: 305px;
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 2px 10px;
        border: 1px solid #ccc;
    }

    #LAY-iframe-itemCat ul li {
        position: relative;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 20px;
    }

    #LAY-iframe-itemCat .layui-col-xs12 ul li {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    #LAY-iframe-itemCat .layui-col-xs3 ul li i {
        position: absolute;
        top: 4px;
        right: 5px;
    }

    #LAY-iframe-itemCat ul li:hover {
        background-color: #f4f6f7;
        color: #438eb9;
    }

    #LAY-iframe-itemCat ul li.cat_active:hover {
        background-color: #6fb3e0;
        color: #fff;
    }

    #LAY-iframe-itemCat input {
        display: inline-block;
        width: 200px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 12px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
    }

    #LAY-iframe-itemCat input:focus {
        outline: 0;
        box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    }

    #LAY-iframe-itemCat input:focus,
    #LAY-iframe-itemCat input:hover {
        border-color: #57a3f3;
    }

    #preProdEditFrom_cateName {
        padding: 17px 15px;
    }
    .catechoose_Form {
        margin: 15px 0 0;
    }

    .catechoose_Form h3 {
        margin: -15px 25px 15px;
    }

    .preProdEditFrom_cateName {
        margin: 5px 20px;
    }
    .cat_common {
        padding: 3px;
        margin: 3px auto;
        border: 1px solid #f8f8f8;
        box-sizing: border-box;
        font-weight: 700;
        background-color: #f8faff;
        color: #7c9eb2;
        cursor: pointer;
    }

    .cat_active {
        background-color: #6fb3e0;
        color: #fff;
    }
</style>


<div class="layui-fluid" id="prohibitconf_content">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="prohibitconfSearchForm" class="layui-form">
                        <input type="hidden" name="pCateIds" id="LAY-commodity-catalog-prohibitconf-hidden">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select name="platCode" lay-filter="prohibitconf_searchForm_platCode" lay-search>
                                        <option></option>
                                        <c:forEach items="${salesPlatList}" var="salesPlat">
                                            <option value="${salesPlat.name}">${salesPlat.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售站点</label>
                                <div class="layui-input-block">
                                   <select name="salesSiteId"  xm-select="prohibitconf_salesSiteId" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='prohibitconf_salesSiteId'>
                                   </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="stockLocation" lay-search>
                                        <option></option>
                                        <option value="0">全部</option>
                                        <option value="1">国内仓</option>
                                        <option value="2">虚拟仓</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">检查状态</label>
                                <div class="layui-input-block">
                                    <select name="checkingStatus" lay-search>
                                        <option></option>
                                        <option value="0">待检查</option>
                                        <option value="1">检查中</option>
                                        <option value="2">检查成功</option>
                                        <option value="3">检查失败</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="status" lay-search>
                                    <option value="1" selected>启用</option>
                                    <option value="0">停用</option>
                                </select>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderBy" lay-search>
<%--                                        <option></option>--%>
                                        <option value="1" selected>创建时间正序</option>
                                        <option value="2">创建时间倒序</option>
                                        <option value="3">更新时间倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">规则ID</label>
                                <div class="layui-input-block">
                                    <input type="text" name="idList" id="prohibitConfIdList" placeholder="输入多个时使用英文逗号隔开" autocomplete="off"
                                        class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">关键词</label>
                                <div class="layui-input-block" style="display: flex;">
                                    <input
                                        type="text"
                                        name="keyWordStr"
                                        id="keyWordStr"
                                        class="layui-input"
                                        style="position: absolute; z-index: 2; width: 80%"
                                        placeholder="请选择"
                                        autocomplete="off"
                                      />
                                      <select
                                        name="hasKeyWord"
                                        lay-search
                                        lay-filter="hasKeyWord"
                                      >
                                        <option value="">请选择</option>
                                        <option value="有">有</option>
                                        <option value="无">无</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">描述词</label>
                                <div class="layui-input-block" style="display: flex;">
                                    <input
                                        type="text"
                                        name="descWordStr"
                                        id="descWordStr"
                                        class="layui-input"
                                        style="position: absolute; z-index: 2; width: 80%"
                                        placeholder="请选择"
                                        autocomplete="off"
                                      />
                                      <select
                                        name="hasDescWord"
                                        lay-search
                                        lay-filter="hasDescWord"
                                      >
                                        <option value="">请选择</option>
                                        <option value="有">有</option>
                                        <option value="无">无</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select name="logisticsAttrListStr" xm-select="logisticsAttrListStr" xm-select-search
                                            xm-select-skin="normal"
                                            xm-select-search-type="dl" lay-filter='logisAttr_prohibitconf'>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="cateType" lay-filter="cateType">
                                    <option value="1">OA类目</option>
                                    <option value="2" selected>OA新类目</option>
                                </select>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="dimSearchContent" style="display: flex;width: 100%;">
                                    <div style="width: 100%;display: none;" id="oldCateDiv">
                                        <input name="oldCateIdListStr" style="width: 120px;" id="prohibitconf_cate" type="text" class="layui-input">
                                    </div>
                                    <div style="width: 100%;" id="newCateDiv">
                                        <input name="oaCateIdListStr" class="disN" style="width: 120px;" id="prohibitconf_newcate" type="text" class="layui-input">
                                    </div>
                                </div>
                            </div>

                            <div class="layui-col-md1 layui-col-lg1 pl20" style="float: right">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload"
                                    id="prohibitconfSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                    id="prohibitconfResetBtn">清空</button>
                            </div>

                        </div>
                        <div id="prohibitconfContent"></div>

                        <div class="disN" id="prohibitconf_salesSiteBox">
                            <div class="disN" id="salesSite_addConfForm_wish">
                                <option value=""></option>
                            </div>
                            <div class="disN" id="salesSite_addConfForm_amazon">
                                <option value=""></option>
                                <c:forEach items="${amazonSiteEnum}" var="site">
                                    <option value="${site.marketName}">${site.name}</option>
                                </c:forEach>
                            </div>
                            <div class="disN" id="salesSite_addConfForm_lazada">
                                <option value=""></option>
                                <c:forEach items="${lazadaSiteEnum}" var="site">
                                    <option value="${site.code}">${site.name}</option>
                                </c:forEach>
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
                            <div class="disN" id="salesSite_addConfForm_mercado">
                                <option value=""></option>
                                <c:forEach items="${mercadoSiteEnum}" var="site">
                                    <c:if test="${site.salesSite ne  'CBT' }">
                                            <option value="${site.salesSite}">${site.salesSite}</option>
                                </c:if></c:forEach>
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

                            <div class="disN" id="salesSite_addConfForm_tiktok">
                                <option value=""></option>
                                <c:forEach items="${tiktokSiteEnum}" var="site">
                                    <option value="${site.code}">${site.name}</option>
                                </c:forEach>
                            </div>

                            <div class="disN" id="salesSite_addConfForm_shein商城">
                                <option value=""></option>
                                <c:forEach items="${sheinMallSiteEnum}" var="site">
                                    <option value="${site.code}">${site.name}</option>
                                </c:forEach>
                            </div>

                            <div class="disN" id="salesSite_addConfForm_daraz">
                                <option value=""></option>
                                <c:forEach items="${darazSiteEnum}" var="site">
                                    <option value="${site.siteCode}">${site.siteName}</option>
                                </c:forEach>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="prohibitconfCard">
                <div class="layui-card-header">
                    <div class="layui-tab fl">
                        <ul class="layui-tab-title">
                            <li class="layui-this">禁售设置(<span id="Count_prohibitconf">0</span>)</li>
                        </ul>
                    </div>
                    <div style="float:right">
                        <button type="button" id="disableBatch_prohibitconf" class="layui-btn layui-btn-warm layui-btn-sm">批量停用</button>
                        <button type="button" id="enableBatch_prohibitconf" class="layui-btn layui-btn-warm layui-btn-sm">批量启用</button>
                        <button type="button" id="addByCopyBtn_prohibitconf" class="layui-btn layui-btn-warm layui-btn-sm">复制新增</button>
                        <button type="button" id="addProhibitBtn_prohibitconf" class="layui-btn layui-btn-normal layui-btn-sm">新增设置</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="prohibitconfTable" lay-filter="prohibitconfTable"></table>

                    <script type="text/html" id="checkStatus_prohibitconf">
                        {{# if (d.checkingStatus == 0) {}}
                            <span style="color: orange;">待检查</span>
                        {{# } }}
                        {{# if (d.checkingStatus == 1) {}}
                        <span style="color: grey;">检查中</span>
                        {{# } }}
                        {{# if (d.checkingStatus == 2) {}}
                        <span style="color: green;">检查成功</span>
                        {{# } }}
                        {{# if (d.checkingStatus == 3) {}}
                        <span style="color: red;">检查失败</span>
                        {{# } }}
                    </script>

                    <script type="text/html" id="prohibitconfBar">
                        <div><a class="layui-btn layui-btn-xs" lay-event="edit">详情</a></div>
                        <div><a class="layui-btn layui-btn-xs" lay-event="queryLinkedPsku">禁售父SKU</a></div>
                        <div><a class="layui-btn layui-btn-xs" lay-event="editFixedUnListablePsku">固定禁售父SKU</a></div>
                        {{# if (d.status) {}}
                        <div><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="disableProhibitConf">停用</a></div>
                        {{# } else {}}
                        <div><a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="enableProhibitConf">启用</a></div>
                        {{# } }}
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="addprohibitconfLayer">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <ul class="layui-tab-title isCreateHidden">
                <li class="layui-this">详情</li>
                <li>操作日志</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <div class="secondary">
                        <p>tips:</p>
                        <p>1、每一条禁售设置，模板的被检查内容，需要存在所有【有值】的检查项内容，才认定该模板被当前设置禁售。</p>
                        <p>例如： 设置A禁售项：物流属性【带电】、关键词【hot】,则当模板 物流属性包含"带电"。且关键词包含"hot",才会被当前设置禁售</p>
                        <p>否则如果模板只有物流属性包含"带电"，关键词中没有"hot"， 是不会被认定为禁售的</p>
                        <p>2、特别说明：【商品类目】与【OA新类目】都属于【类目检查】，模板检查时，只需要满足其中一项禁售，即代表【类目禁售】</p>
                        <p>例如：设置A禁售项： 【商品类目】：花、【OA新类目】：干花、【关键词】：hot。             </p>
                        <p>则模板只需要【商品类目】为花，【关键词】包含hot就被禁售。</p>
                        <p>或者模板【OA新类目】为干花，【关键词】包含hot也被禁售</p>
                    </div>
                    <div class="layui-tab layui-tab-card">
                        <div class="layui-tab-content">
            
                            <div class="layui-tab-item layui-show p20">
                                <form class="layui-form" lay-filter="addprohibitconfForm_prohibitconf" id="addprohibitconfForm_prohibitconf"
                                      autocomplete="off">
                                    <div class="layui-form-item">
                                        <div class="layui-inline" notNull>
                                            <label class="layui-form-label">平台</label>
                                            <div class="layui-input-inline">
                                                <select name="platCode" lay-filter="plateCode_addConfForm" lay-search>
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
                                            </div>
                                        </div>
                                        <div class="layui-inline">
                                            <label class="layui-form-label">仓库</label>
                                            <div class="layui-input-block">
                                               <select name="stockLocation" lay-search>
                                                   <option value="0">全部</option>
                                                   <option value="1">国内仓</option>
                                                   <option value="2">虚拟仓</option>
                                               </select>
                                                <input id="stockLocationInp_addConfForm" class="layui-input disN" disabled>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <label class="layui-form-label">商品类目</label>
                                            <div class="layui-input-block">
                                                <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="cateBtn_addConfForm">选择类目</button>
                                                <input type="hidden" name="cateIdList">
                                                <input type="hidden" name="cateList">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <label class="layui-form-label"></label>
                                            <div class="layui-input-inline" style="width:815px">
                                                <div id="selectedCateShowDiv"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <label class="layui-form-label">OA新类目</label>
                                            <div class="layui-input-block">
                                                <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" id="cateOaBtn_addConfForm">选择类目</button>
                                                <input type="hidden" name="cateOAIdList">
                                                <input type="hidden" name="cateOAList">
                                            </div>
                                        </div>
                                    </div>
                                    <div id="tplOACateInfo_show" name="prohibitconf_tplOACateInfo" style="display:none;"></div>
                                    <input type="hidden" name="cateOaId" id="prohibitconf_cateOaId"/>
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <label class="layui-form-label"></label>
                                            <div class="layui-input-inline" style="width:815px">
                                                <div id="selectedOACateShowDiv"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md8 layui-col-lg8">
                                            <label class="layui-form-label">模板类型</label>
                                            <div class="layui-input-block">
                                                <select name="tplTypeList"  xm-select="prohibitconf_tplTypeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='prohibitconf_tplTypeList'>
                                                    <option value="">全部</option>
                                                    <option value="0">直邮</option>
                                                    <option value="1">亚马逊精品</option>
                                                    <option value="2">亚马逊精铺</option>
                                                    <option value="3">亚马逊铺货</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <label class="layui-form-label w90">物流属性</label>
                                            <div class="layui-input-inline" style="width:815px">
                                                <c:forEach items="${logisAttrList}" var="logisAttr">
                                                    <input type='checkbox' lay-skin='primary' name='logisAttrList' title='${logisAttr.name}' value='${logisAttr.name}'>
                                                </c:forEach>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item" style="margin-top: 20px">
                                        <div class="layui-inline">
                                            <div style="display: flex;justify-content: space-between">
                                                <div>
                                                    <span>关键词禁售词</span><br/>
                                                    <span class="layui-badge layui-bg-blue">数量:<i class="tagsinputNum">0</i></span><br>
                                                </div>
                                                <div style="display:flex;">
                                                    <input type="text" class="layui-input" id="prohibitconf_keywords_input">
                                                    <span class="layui-btn layui-btn-sm" id="prohibitconf_keywords_search" style="margin-left:5px;">
                                                        <i class="layui-icon">&#xe615;</i>
                                                    </span>
                                                    <span class="layui-btn layui-btn-sm layui-btn-danger" id="prohibitconf_keywords_delete">
                                                        <i class="layui-icon">&#xe640;</i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="layui-input-inline" style="width:815px;margin-top: 10px">
                                                <div class="tagsinput-primary form-group">
                                                    <input class="tagsinput" name="keywords" type="text" id="prohibitconf_keywords_tags">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
            
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <div style="display: flex;justify-content: space-between">
                                                <div>
                                                    <span>描述禁售词</span><br/>
                                                    <span class="layui-badge layui-bg-blue">数量:<i class="tagsinputNum">0</i></span><br>
                                                </div>
                                                <div style="display:flex;">
                                                    <input type="text" class="layui-input" id="prohibitconf_descwords_input">
                                                    <span class="layui-btn layui-btn-sm" id="prohibitconf_descwords_search" style="margin-left:5px;">
                                                        <i class="layui-icon">&#xe615;</i>
                                                    </span>
                                                    <span class="layui-btn layui-btn-sm layui-btn-danger" id="prohibitconf_descwords_delete">
                                                        <i class="layui-icon">&#xe640;</i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="layui-input-inline" style="width:815px">
                                                <div class="tagsinput-primary form-group">
                                                    <input class="tagsinput" name="descWords" type="text" id="prohibitconf_descords_tags">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-inline">
                                            <label class="layui-form-label w90">商品标签</label>
                                            <div class="layui-input-block" id="prohibitproductLabelList"></div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-tab-item p20">
                    <div class="layui-tab layui-tab-brief">
                        <div class="layui-show">
                            <table class="layui-table">
                                <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>操作人</th>
                                    <th>日志</th>
                                </tr>
                                </thead>
                                <tbody id="prohibitconf_subLogTbody">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>



<script type="text/html" id="prohibitconf_addByCopyfLayer">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" lay-filter="prohibitconf_addByCopyForm" id="prohibitconf_addByCopyForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-inline">
                                    <select name="salesSiteId" xm-select="prohibitconf_addByCopy_salesSiteId" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='prohibitconf_addByCopy_salesSiteId'>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script id="stockLocation_prohibitconf" type="text/html">
    <div>
        {{# if (d.stockLocation == 0) { }}
        全部
        {{# } }}
        {{# if (d.stockLocation == 1) { }}
        国内仓
        {{# } }}
        {{# if (d.stockLocation == 2) { }}
        虚拟仓
        {{# } }}
    </div>
</script>

<script type="text/html" id="linkedPskuPop">
    <div class="layui-card-header" style="z-index: 10000;height: auto;">
        <ul class="layui-tab-title fl">
            <li class="layui-this">总数(<span id="count_linkedPsku">0</span>)</li>
        </ul>
        <div class="fr">
            <a class="layui-btn layui-btn-sm" id="copyAllLinkedPsku">复制全部</a>
        </div>
    </div>
    <div class="layui-card-body">
        <table class="layui-table" id="linkedPskuTable" lay-filter="linkedPskuTable"></table>
    </div>
</script>

<script type="text/html" id="linkedPskuTemp">
      <div class="pskuStrTemp">{{d.pSkuStr}}</div>
</script>
<script type="text/html" id="bar_linkedPskuTable">
    <div><a class="layui-btn layui-btn-xs" lay-event="copy">复制</a></div>
</script>

<script id="prohibitconf_platInfo" type="text/html">
    <p style="font-size: 14px"><span style="padding: 0 10px 0 65px">平台:</span> {{ d.platCode }}</p>
    <p style="font-size: 14px"><span style="padding: 0 10px 0 65px">站点:</span> {{ d.salesSite }}</p>
    <p style="font-size: 14px"><span style="padding: 0 10px 0 65px">仓库:</span> {{ d.warehouse }}</p>
</script>

<script type="text/html" id="prohibitconf_fixedUnlistAbleEditLayer">
    <div class="secondary">
        <div class="layui-col-md8 layui-col-lg8">
            <p><div class="layui-col-md1 layui-col-lg1">tips:</div>1、本功能旨在对特定的父sku 手动添加禁售标记</p>
            <p><div class="layui-col-md1 layui-col-lg1">&nbsp;</div>2、相同平台、站点、仓库的禁售设置共享 固定禁售父sku</p>
        </div>
    </div>

    <div class="layui-col-md12 layui-col-lg12">
        <div class="layui-card">
            <div class="layui-card-body">
                <div class="layui-form-item">
                    <form class="layui-form" id="prohibitconf_fixedUnlistAbleEditForm" lay-filter="prohibitconf_fixedUnlistAbleEditForm" autocomplete="off">
                        <input name="platCode" type="hidden" />
                        <input name="salesSite" type="hidden" />
                        <input name="salesSiteId" type="hidden" />
                        <input name="stockLocation" type="hidden" />
                        <div id="prohibitconf_platInfoSlot"></div>
                        <div class="layui-col-md10 layui-col-lg10">
                            <label class="layui-form-label">新增固定禁售父SKU</label>
                            <div class="layui-input-block">
                                <textarea name="pSkuListStr" class="layui-textarea" placeholder="多个用逗号隔开。每次最多200个" maxlength="3200"></textarea>
                            </div>
                        </div>
                        <div class="layui-col-md10 layui-col-lg10">
                            <label class="layui-form-label">备注</label>
                            <div class="layui-input-block">
                                <input name="fixedInableMsg" class="layui-input" maxlength="300" />
                            </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                            <div class="layui-btn layui-btn-sm ml10" id="prohibitconf_fixedUnlistAbleAddBtn">添加</div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card-header">
                <form class="layui-form" id="prohibitconf_fixedUnlistAbleSearchForm" lay-filter="prohibitconf_fixedUnlistAbleSearchForm">
                    <div style="display:flex;float:left;">
                        <div class="layui-form-item">
                            <label class="layui-form-label">父SKU</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" placeholder="多个精确搜索,逗号隔开" name="accurate">
                            </div>
                        </div>
                        <div class="layui-form-item" style="margin: 0 10px;">
                            <label class="layui-form-label">备注</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" placeholder="模糊搜索" name="vague">
                            </div>
                        </div>
                        <span class="layui-btn layui-btn-sm" id="prohibitconf_fixedUnlistAbleSearchBtn">搜索</span>
                    </div>
                    <div class="fr">
                        <div class="layui-btn layui-btn-sm" id="prohibitconf_exportfixedUnlistBtn">导出</div>
                        <div class="layui-btn layui-btn-sm layui-btn-warm" id="prohibitconf_fixedUnlistAbleBatchDelBtn">删除</div>
                    </div>
                </form>
            </div>
            <div class="layui-card-body">
                <table class="layui-table" id="prohibitconf_fixedUnlistAbleTable" lay-filter="prohibitconf_fixedUnlistAbleTable"></table>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="prohibitconf_modifyInfo">
    <div>{{ Format( d.modifyTime, "yyyy-MM-dd hh:mm:ss")}}</div>
    <div>{{d.modifier}}</div>
</script>

<script type="text/html" id="prohibitconf_createInfo">
    <div>{{ Format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>
    <div>{{d.creator}}</div>
</script>

<script type="text/html" id="prohibitconf_cateList">
  <div class="detailProhibitconfHidden detailProhibitconfDefault">
    <div class="detailProhibitconfDiv">
      OA类目：{{d.cateList || ''}}<br/>
      OA新类目：{{d.cateNewList || ''}}
    </div>
  </div>
</script>

<script type="text/html" id="prohibitconf_keywords">
  <div class="detailProhibitconfHidden detailProhibitconfDefault">
    <div class="detailProhibitconfDiv">
      {{d.keywords || ''}}
    </div>
  </div>
</script>

<script type="text/html" id="prohibitconf_descWords">
  <div class="detailProhibitconfHidden detailProhibitconfDefault">
    <div class="detailProhibitconfDiv">
      {{d.descWords || ''}}
    </div>
  </div>
</script>

<script type="text/html" id="layer_work_develop_Prohibitconf">
    <div class="layui-fluid" id="LAY-iframe-itemCat">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <input type="text" id="itemCat_input" />
                <div id="LAY-iframe-itemCat-getCates" style="margin-top:20px"></div>
            </div>
        </div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/prohibitconf.js"></script>
<script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>

<style type="text/css">
    .pskuStrTemp {
        text-overflow: ellipsis;
        /*设置隐藏部分为省略号*/
        overflow: hidden;
        /*设置隐藏*/
        display: -webkit-box;
        -webkit-line-clamp: 2;
        /*设置显示行数，此处为2行，可设置其他数字*/
        -webkit-box-orient: vertical;
        width: 1000px;
        line-height: 25px;
        height: 75px;
    }
    .detailProhibitconfDefault{
      text-align:left;
    }
    .detailProhibitconfHidden{
        overflow:hidden;
        max-height:85px;
    }
</style>