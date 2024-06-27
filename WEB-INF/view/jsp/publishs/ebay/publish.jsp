<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<title>ebay刊登</title>
<style>

    #ebayPulish_listDetailForm .imageLeft {
        width: 260px;
        height: 260px;
        margin-right:20px;
        float: left;
        margin-top: 5px;
        border: 1px solid #ccc;
    }
    #ebayPulish_listDetailForm .imageRight {
        width: 150px;
        display: inline-block;
        border: 1px solid #ccc;
        margin: 0 5px 5px 0;
    }
    #ebayPulish_listDetailForm .imageRight span {
        cursor:pointer;
        color:#73a1bf;
    }
    #ebayPulish_listDetailForm .imageRight .removeEbayImg{
        float:right;
    }
    .ebayPublishStyleLeftBar {
        float: left;
        border: 1px solid #e8e8e8;
        border-left: none;
        border-top: none;
        box-sizing: border-box;
        width: 150px;
    }
    .ebayPublishStyleLeftBar>div {
        width: 100%;
        text-align: center;
        padding: 9px 0;
        cursor: pointer;
    }
    .ebayPublishStyleRightTem {
        /* background: #ffff00; */
        overflow: hidden;
    }
    .ebayPublishStyleRightTem>ul>li {
        width: 16%;
        text-align: center;
        cursor:pointer;
        float: left;
        margin: 10px;
        vertical-align: bottom;
    }
    .ebayPublishStyleRightTem>ul>li>img{
        width: 122px;
        height: 113px;
    }
    .et_activeStyle{
        opacity: 0.5;
    }
    .layui-table td{
        word-break: break-all !important;
    }
    #LAY-publishs-ebay-publish .layui-tab-content{
        padding:10px 0 !important;
    }
    .dis_flex {
                    display: flex;
                    justify-content: space-between;
                }
                .dis_flex_around {
                    display: flex;
                    justify-content: space-around;
                }

                .w_90 {
                    width: 90%
                }
    .hide{
        display: none;
    }
    .expand{
        cursor: pointer;
        color:lightskyblue
    }
    .errAlert {
        width: 700px !important;
        left: 50% !important;
        margin-left: -350px;
        overflow: auto;
    }
    .errAlert .layui-layer-content {
        height: 600px;
    }
    #LAY-publishs-ebay-publish .layui-btn+.layui-btn {
    margin-left:0!important;
    /* margin-top: 10px!important; */
    }

    /*eBay属性列 css*/
    .specificsField input{
        display: inline-block;
        width: 80%;
    }
    .specificsField i{
        color: red;
        cursor:pointer;
        display: none;
    }
    .specificsField:hover i{
        color: red;
        cursor:pointer;
        display: inline;
    }
    .specificsFieldPicture input{
        border-color: green;
    }
    #ebayPublish_subSkuImg_detailLayerId .subSkuImgContainer {
      display: flex;
      margin: 20px;
    }
    #ebayPublish_subSkuImg_detailLayerId .subSkuImgContainer-left {
      padding-right:30px;
      margin-top: 40px;
      width: 100px;
      text-align: center;
    }
    #ebayPublish_subSkuImg_detailLayerId .subSkuImgContainer-right-middle {
      margin: 10px 5px;
    }
    .auxiliary-ebaySubSkuImgs {
      display: flex;
      flex-wrap: wrap;
    }
    .auxiliary-ebaySubSkuImgs>div {
      margin: 5px 10px;
    }
    #ebayPublish_SubSkuInfo_body .subImgNum {
      position: absolute;
      bottom: 22px;
      left: 0;
      display: inline-block;
      width: 60px;
      height: 30px;
      margin-left: 10px;
      background: #6d503d;
      opacity: 0.6;
      text-align: center;
      color: #f00;
      font-weight: 700;
      line-height: 30px;
      font-size: 20px;
    }
    #ebayPublish_SubSkuInfo_body .editImgBtn {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }
</style>

<div class="layui-fluid" id="LAY-publishs-ebay-publish">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="eabyPublish_searchForm">
                        <div class="layui-form-item layui-row">
                            <input name="listingStatus" value="-2" type="hidden">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="ep_orgFilter" class="orgs_hp_custom" id="ebay_publish_organization">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId"  class="users_hp_custom" data-rolelist="ebay专员" lay-filter="ep_sellerFilter" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="platAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="ebayPublish_search-store" lay-search="" >
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="siteId" class="site_hp_custom" placeholder="选择店铺后显示">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品类目</label>
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-primary layui-btn-sm" type="button" id="ebayPublish_item">选择类目</button>
                                    <i class="layui-icon layui-icon-delete" onclick="clearCate('LAY-publishs-ebay-publish-div','LAY-publishs-ebay-publish-hidden')" style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" id="LAY-publishs-ebay-publish-hidden" name="cateId">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="tag">
                                        <option value="">全部<option>
                                        <option value="空">无标签</option>
                                        <c:forEach items="${prodTagMap}" var="prodTag">
                                            <option value="${prodTag.value.name}">${prodTag.value.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select xm-select="ebayPulish_selectAttr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品归属人</label>
                                <div class="layui-input-block">
                                    <select xm-select="ebayPulish_selectMan" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="tortBanListing">
                                        <%--<c:forEach items="${tortBanListings}" var="tortBanListing">--%>
                                            <%--<option value="${tortBanListing.name()}">${tortBanListing.getText().replace("该平台","ebay")}</option>--%>
                                        <%--</c:forEach>--%>
                                            <option value="CURRENT_PLAT">ebay不侵权</option>
                                            <option value="ANY_PLAT" selected>所有平台都不侵权</option>
                                            <option value="ALL">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-all">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="isOverSeasWh" placeholder="">
                                        <!-- <option value="false">国内仓</option>
                                        <option value="true">虚拟仓</option> -->
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-ebayAttr">
                                <label class="layui-form-label">ebay属性</label>
                                <div class="layui-input-block">
                                    <select name="ebayAttr" placeholder="">
                                        <option value="">全部</option>
                                        <option value="addComplete" selected>已添加且完整</option>
                                        <option value="unAdd">未添加</option>
                                        <option value="cateInComplete">类目不完整</option>
                                        <option value="attrInComplete">属性不完整</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select name="saleStatusList " xm-select="ebayPulish_saleStatusList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value="2" selected>在售</option>
                                        <option value="1" selected>部分在售</option>
                                        <option value="0">停售</option>
                                        <option value="-1">无映射</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-all">
                                <label class="layui-form-label">刊登状态</label>
                                <div class="layui-input-block">
                                    <select name="isListing">
                                        <option value="">全部</option>
                                        <option value="true">已刊登</option>
                                        <option value="false" selected>未刊登</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-all">
                                <label class="layui-form-label">生成状态</label>
                                <div class="layui-input-block">
                                    <select name="isGenerate">
                                        <option value="">全部</option>
                                        <option value="true">已生成</option>
                                        <option value="false" selected>未生成 </option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-all">
                                <label class="layui-form-label">禁售状态</label>
                                <div class="layui-input-block">
                                    <select name="isListingAble">
                                        <option value="true">未禁售</option>
                                        <option value="false">禁售</option>
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="searchType">
                                        <option value="pSkus">父SKU</option>
                                        <option value="sSkus">模板子SKU</option>
                                        <option value="cnTitle">商品中文</option>
                                        <option value="enTitle">商品英文</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="searchValue" type="text" class="layui-input" placeholder="">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding: 0 15px;text-align: right">
                                    <select name="timeType">
                                    		<%--<c:forEach items="${timeTypes}" var="timeType">--%>
                                        	<%--<option value="${timeType.name()}">${timeType.getText()}</option>--%>
                                      <%--</c:forEach>--%>
                                                <option value="AUDIT_TIME">审核时间</option>
                                                <%--<option value="CREATE_TIME">创建时间</option>--%>
                                                <%--<option value="AUDIT_TIME">审核时间</option>--%>
                                                <%--<option value="LISTING_TIME">刊登时间</option>--%>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="time" type="text" class="layui-input" placeholder="选择时间" id="ebayPublish_time" autocomplete="off">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">成本</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" name="minCost" placeholder="￥" autocomplete="off" class="layui-input">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" name="maxCost" placeholder="￥" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">重量</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" name="minWeight" placeholder="g" autocomplete="off" class="layui-input">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" name="maxWeight" placeholder="g" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="layui-col-lg2 layui-col-md2 ebayPublish-all">
                                <label class="layui-form-label">库存</label>
                                <div class="layui-input-block">
                                    <input type="checkbox" name="isStock" lay-skin="primary" title="过滤零库存">
                                </div>
                            </div> -->
                            <div class="layui-col-md4 layui-col-lg4 ebayPublish-listing hidden">
                                <label class="layui-form-label">错误查询</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <select name="listingRespCode" lay-search="">
                                            <option value="1">侵权</option>
                                            <option value="0">其他</option>
                                        </select>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input name="respShortMsg" placeholder="错误码或错误信息" class="layui-input" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品类型</label>
                                <div class="layui-input-block">
                                    <select name="isMultiSku">
                                        <option value="">全部</option>
                                        <option value="false">单属性</option>
                                        <option value="true">多属性</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-listing hidden">
                                <label class="layui-form-label">刊登方式</label>
                                <div class="layui-input-block">
                                    <select name="listingMode">
                                        <option value="">全部</option>
                                        <option value="0">批量刊登</option>
                                        <option value="1">手动刊登</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-listing hidden">
                                <label class="layui-form-label">刊登类型</label>
                                <div class="layui-input-block">
                                    <select name="durationType">
                                        <option value=""></option>
                                        <option value="1">拍卖</option>
                                        <option value="2">一口价</option>
                                        <option value="3">非GTC一口价</option>
                                        <option value="4">GTC</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-all">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderField">
                                        <option value="ppi.create_time desc">创建时间倒序</option>
                                        <option value="ppi.create_time asc">创建时间正序</option>
                                        <option selected value="ppi.audit_time desc">审核时间倒序</option>
                                        <option value="ppi.audit_time asc">审核时间正序</option>
                                        <option value="saleCount7">7天销量倒序-全平台</option>
                                        <option value="saleCount15">15天销量倒序-全平台</option>
                                        <option value="saleCount30">30天销量倒序-全平台</option>
                                        <option value="ebaySaleCount7">7天销量倒序-ebay</option>
                                        <option value="ebaySaleCount15">15天销量倒序-ebay</option>
                                        <option value="ebaySaleCount30">30天销量倒序-ebay</option>
                                        <option value="ebayOutSaleCount7">7天销量倒序-虚拟仓</option>
                                        <option value="ebayOutSaleCount15">15天销量倒序-虚拟仓</option>
                                        <option value="ebayOutSaleCount30">30天销量倒序-虚拟仓</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-listing" style="display: none;">
                                <label class="layui-form-label">创建人</label>
                                <div class="layui-input-block">
                                    <select xm-select="followSell_person_search_select" name="followSell_person_search_select" xm-select-search id="followSell_person_search_select"
                                            xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-form-label" style="padding: 0 0 0 15px; width: 95px;">
                                    <select name="ebayCategoryType" >
                                        <option value="ebayCategory1">ebay第一分类</option>
                                        <option value="ebayCategory2">ebay第二分类</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input class="layui-input" autocomplete="off" id="ebay_online_ebayCategory2"
                                        placeholder="分类ID,多值空格分隔">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1" style="text-align: center; height: 36px;">
                                <input type="checkbox" name="ebayCategory2Type" title="反选" lay-skin="primary">
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-listing hidden">
                                <label class="layui-form-label">账号类型</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="ebayPublish_Account_type" lay-filter="ebayPublish_Account_type"
                                        xm-select="ebayPublish_Account_type" class="users_hp_store_multi" xm-select-search
                                        xm-select-search-type="dl" xm-select-skin="normal" data-platcode="ebay"
                                        name="ebayPublish_Account_type_name"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="devTypes" xm-select="devTypes_ebay_public" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"
                                            lay-filter='devTypes_ebay_public' id="devTypes_ebay_public">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ebayPublish-all">
                                <div class="layui-form-label" style="padding: 0 0 0 15px; width: 100px;">
                                    <select name="stockType">
                                        <option value="available">预计可用含在途</option>
                                        <option value="notAvailable">预计可用不含在途</option>
                                    </select>
                                </div>
                                <div class="layui-input-block disflex">
                                    <input type="number" class="layui-input" name="stockMin" onkeypress="commonKeyPressInputInt(event)" style="width: 70%;">
                                    <input type="number" class="layui-input" name="stockMax" onkeypress="commonKeyPressInputInt(event)" style="width: 70%;">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="float:right">
                                <div style="margin-left:20px">
                                    <button class="layui-btn layui-btn-sm keyHandle" type="button" id="eabyPublish_search">搜索</button>
                                    <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset" id="ebayPublish_reset">清空</button>
                                </div>
                            </div>
                        </div>

                    </form>
                    <div id="LAY-publishs-ebay-publish-div"></div>
                </div>
            </div>
            <div class="layui-card" id="ebayPublishCard">
                <div class="layui-card-body">
                    <div class="layui-tab" id="ebayPublish_tab" lay-filter="ebayPublish_tab">
                        <div class="dis_flex toFixedContain">
                                    <ul class="layui-tab-title">
                                            <li data-value="-2" class="layui-this">全部(<span></span>)</li>
                                            <li data-value="0">待刊登(<span></span>)</li>
                                            <li data-value="3">刊登中(<span></span>)</li>
                                            <li data-value="1">刊登成功(<span></span>)</li>
                                            <li data-value="2">刊登失败(<span></span>)</li>
                                        </ul>
                                        <div id="ebay_btn_show_hide">
                                            <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" onclick="ebayPublishGenList()">生成店铺商品</button>
                                            <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" onclick="ebayPublishOverToUnListing()">超额转待发布</button>
                                            <button class="layui-btn layui-btn-sm layui-btn-danger disN" type="button" onclick="ebayPublishDeleteListing()">删除店铺商品</button>
                                            <button class="layui-btn layui-btn-sm disN" type="button" onclick="ebayPublishListing()">发布上架</button>
                                            <button class="layui-btn layui-btn-sm layui-btn-primary disN" type="button" onclick="ebayPublishListTiming()">定时刊登</button>
                                            <button class="layui-btn layui-btn-sm layui-btn-danger disN" type="button" onclick="ebayPublishBatchCancleList()">批量取消刊登</button>
                                            <button class="layui-btn layui-btn-sm layui-btn-danger disN" type="button" onclick="ebayPublishCancleListTiming()">取消定时刊登</button>
                                            <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" onclick="ebayPublishListingAuction()">刊登拍卖</button>
                                            <button class="layui-btn layui-btn-sm layui-btn-warm disN" type="button" onclick="ebayPulish_listingCopy()" title="复制ebay刊登数据">复制模板</button>
                                            <button class="layui-btn layui-btn-sm layui-btn-normal disN" type="button" onclick="ebayPulish_signListingMode()" title="标记刊登方式：批量/手动">刊登方式</button>
                                            <button class="layui-btn layui-btn-sm layui-btn-danger" type="button" id="ebayPublishExportSkuMappingBtn">导出SKU映射</button>
                                            <button class="layui-btn layui-btn-sm" type="button" onclick="expandAllEbay()">展开全部</button>
                                            <button class="layui-btn layui-btn-sm" type="button" onclick="PackUpAllEbay()">收起全部</button>
                                    </div>
                        </div>
                                    <div class="layui-tab-content" style="position: relative;">
                                        <div style="position: absolute;top: 0;right: 0;" class="layui-form" id="ebay_displayAccurateCount">
                                            <input type="checkbox" name="ebay_accurateCount" lay-skin="primary" title="统计总数" lay-filter="ebayonline_marksCheck" >
                                        </div>
                                          <div class="layui-tab-item layui-show">
                                            <table class="layui-table" lay-filter="ebayPublish_table" id="ebayPublish_table"></table>
                                          </div>
                                    </div>
                                    <div id="ebayPublish_pagination"   class="customPagination"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 表格渲染模板 -->
<!-- 子sku详情模板 -->
    <script type="text/html" id="ebaypublish_prodSSku_tpl">
        <table class="layui-table colspantable" style="width: 100%;font-size: 8px;" >
                    {{#  layui.each(d.prodListingSubSkuEbays, function(index, item){ }}
                    {{#  if(index < 3){ }}
                    <tr style="border-bottom: 1px solid #e6e6e6 !important;" >
                        <td style="width:10%;text-align: center;color: #000;">
                            <input name="prodTempVarietyId" value="{{ item.prodTempVarietyId }}" type="checkbox" data-prodpId="{{item.prodPId}}" data-ssku="{{item.sSku}}" lay-skin="primary" lay-filter="ebayPublish_prodTempVarietyId">
                        </td>
                        <td style="width:20%;text-align: center;color: #000;font-size: 10px;">
                            <div>{{item.sSku}}</div>
                            <div><span class="{{item.id?'layui-green':''}}">{{item.id?'已生成':'未生成'}}</span>
                                <span class="{{item.isSale?'':'layui-bg-orange'}}">{{item.isSale?'':'停'}}</span></div>
                        </td>
                        <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{item.cost ||"" }}</td>
                        <td style="width:15%;text-align: center;color: #000;font-size: 10px;color:{{item.color}}"> {{item.color ||''  }}</td>
                        <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{item.size||""  }}</td>
                        <td style="width:15%;text-align: center;color: #000;font-size: 10px;"> {{item.style||'' }}</td>
                        <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{ ((item.stockNum || 0) - (item.reservationNum || 0))  + '/' + (item.orderNotInNum || 0) + '/' + (item.lackUnPaiNum || 0) }}</td>
                    </tr>
                    {{# }else{ }}
                        <tr style="border-bottom: 1px solid #e6e6e6 !important;" class="expandrow hide">
                                <td style="width:10%;text-align: center;color: #000;">
                                        <input name="prodTempVarietyId" value="{{ item.prodTempVarietyId }}" data-prodpId="{{item.prodPId}}" data-ssku="{{item.sSku}}" type="checkbox" lay-skin="primary" lay-filter="ebayPublish_prodTempVarietyId">
                                    </td>
                                    <td style="width:20%;text-align: center;color: #000;font-size: 10px;">
                                        <div>{{item.sSku}}</div>
                                        <div><span class="{{item.id?'layui-green':''}}">{{item.id?'已生成':'未生成'}}</span>
                                            <span class="{{item.isSale?'':'layui-bg-orange'}}">{{item.isSale?'':'停'}}</span></div>
                                    </td>
                                    <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> ￥{{item.cost ||"" }}</td>
                                    <td style="width:15%;text-align: center;color: #000;font-size: 10px;color:{{item.color}}"> {{item.color ||''  }}</td>
                                    <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{item.size||""  }}</td>
                                    <td style="width:15%;text-align: center;color: #000;font-size: 10px;"> {{item.style||'' }}</td>
                                    <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{ ((item.stockNum || 0) - (item.reservationNum || 0))  + '/' + (item.orderNotInNum || 0) + '/' + (item.lackUnPaiNum || 0) }}</td>
                            </tr>
                     {{# }}}
                    {{#  }) }}
                </table>
                {{# if(d.prodListingSubSkuEbays.length>3){ }}
                <div class="expand" onclick="expandAll($(this))" data-index="expand"><span>展开+</span>({{d.prodListingSubSkuEbays.length}})</div>
                {{# }}}
    </script>
    <!-- 子sku详情模板 -->
    <script type="text/html" id="ebaypublish_prodSSku_tpl1">
        <table class="layui-table colspantable" style="width: 100%;font-size: 8px;" >
                    {{#  layui.each(d.prodListingSubSkuEbays, function(index, item){ }}
                    {{#  if(index < 3){ }}
                    <tr style="border-bottom: 1px solid #e6e6e6 !important;" >
                        <td style="width:20%;text-align: center;color: #000;font-size: 10px;">
                            <div>{{item.sSku||'不存在'}}</div>
                            <div><span class="{{item.id?'layui-green':''}}">{{item.id?'已生成':'未生成'}}</span>
                                <span class="{{item.isSale?'':'layui-bg-orange'}}">{{item.isSale?'':'停'}}</span></div>
                        </td>
                        <td style="width:20%;text-align: center;color: #000;font-size: 10px;">
                                <div>{{item.storeSSku}}</div>
                            </td>
                        <td style="width:10%;text-align: center;color: #000;font-size: 10px;">
                                {{ item.buyItNowPrice }}({{ d.currency }})
                        </td>
                        <td style="width:10%;text-align: center;color: #000;font-size: 10px;color:{{item.color}}"> {{item.color ||''  }}</td>
                        <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{item.size||""  }}</td>
                        <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{item.style||'' }}</td>
                        <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{ ((item.stockNum || 0) - (item.reservationNum || 0))  + '/' + (item.orderNotInNum || 0) + '/' + (item.lackUnPaiNum || 0) }}</td>
                        <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{ item.quantity||"" }}</td>
                    </tr>
                    {{# }else{ }}
                        <tr style="border-bottom: 1px solid #e6e6e6 !important;" class="expandrow hide">
                                    <td style="width:20%;text-align: center;color: #000;font-size: 10px;">
                                        <div>{{item.sSku||'不存在'}}</div>
                                        <div><span class="{{item.id?'layui-green':''}}">{{item.id?'已生成':'未生成'}}</span>
                                            <span class="{{item.isSale?'':'layui-bg-orange'}}">{{item.isSale?'':'停'}}</span></div>
                                    </td>
                                    <td style="width:20%;text-align: center;color: #000;font-size: 10px;">
                                            <div>{{item.storeSSku}}</div>
                                        </td>
                                    <td style="width:10%;text-align: center;color: #000;font-size: 10px;">
                                            {{ item.buyItNowPrice }}({{ d.currency }})
                                    </td>
                                    <td style="width:10%;text-align: center;color: #000;font-size: 10px;color:{{item.color}}"> {{item.color ||''  }}</td>
                                    <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{item.size||""  }}</td>
                                    <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{item.style||'' }}</td>
                                    <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{ ((item.stockNum || 0) - (item.reservationNum || 0))  + '/' + (item.orderNotInNum || 0) + '/' + (item.lackUnPaiNum || 0) }}</td>
                                    <td style="width:10%;text-align: center;color: #000;font-size: 10px;"> {{ item.quantity||"" }}</td>
                            </tr>
                     {{# }}}
                    {{#  }) }}
                </table>
                {{# if(d.prodListingSubSkuEbays.length>3){ }}
                <div class="expand" onclick="expandAll($(this))" data-index="expand"><span>展开+</span>({{d.prodListingSubSkuEbays.length}})</div>
                {{# }}}
    </script>
    <!-- 父sku模板 -->
    <script type="text/html" id="ebaypublish_prodPSku_tpl">
        <a href="javascrpt:;" id="prodDetail" data-id="{{d.prodPId}}" style="color:blue">商品:{{ d.pSku }}</a>
        <div>店铺：{{ d.storePSku || '' }}</div>
            {{# if(d.isListing||d.isGenerate){ }}
            {{# if(d.isListing){ }}
            <div><span class="layui-bg-green" title="已刊登成功">已刊登</span></div>
            {{# }}}
            {{# if(d.isGenerate){ }}
            <div><span class="layui-bg-orange" title="系统已生成刊登商品">已生成</span></div>
            {{# }}}
            {{# }}}
            {{# if(!d.isListingAble){ }}
            <div><span class="layui-bg-gray hp-badge ml5">禁</span></div>
            {{# }}}
            {{# if(d.auditTime){ }}
            <div style="font-size:10px"><span>审核：</span>{{Format(d.auditTime,'yyyy-MM-dd hh:mm')}}</div>
            {{# }}}
            {{# if(d.createTime){ }}
            <div style="font-size:10px"><span>创建：</span>{{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</div>
            {{# }}}
            {{# if(d.listingTime&&d.listingStatus!==3){ }}
            <div style="font-size:10px"><span>刊登：</span>{{Format(d.listingTime,'yyyy-MM-dd hh:mm')}}</div>
            {{# }}}
            {{# if(d.listingStatus===3){ }}
               {{# if(d.listTiming ){ }}
            <div style="font-size:10px" class="layui-gray"><span>定时：</span>{{Format(d.listTiming,'yyyy-MM-dd hh:mm')}}</div>
            {{# }else{ }}
            <div class="layui-green">刊登中</div>
            {{# }}}
            {{# }}}
        {{# if(d.creator ){ }}
        <div><span>创建人：</span>{{d.creator || "-"}}</div>
        {{# }}}

        {{# if(d.isAuction){ }}
        <span class="layui-bg-red hp-badge ml5" title="拍卖">拍</span>
        {{# } }}
        {{# if(d.listingMode==1){ }}
            <span class="layui-bg-green hp-badge ml5" title="手动刊登">手</span>
        {{# } }}
        {{# if(d.respLongMsg){ }}
        <span class="ebayPublish-listingsucc ebayPublish-respMsg">
            <pre style="display: inline;"> <i title="刊登警告信息" class="layui-icon" style="color: #FFB800;cursor: pointer;" >&#xe702;</i></pre>
            <pre class="layui-hide">{{d.respLongMsg}}</pre>
        </span>
        {{# } }}


    </script>
    <!-- 父sku模板 -->
    <!-- 店铺sku -->
    <script type="text/html" id="ebaypubish_storePSku_Tpl">

        <div>
            <div>{{ d.storePSku }}</div>
            {{# if(d.isAuction){ }}
            <span class="layui-bg-red hp-badge ml5" title="拍卖">拍</span>
            {{# } }}
            {{# if(d.listingMode==1){ }}
                <span class="layui-bg-green hp-badge ml5" title="手动刊登">手</span>
            {{# } }}
            {{# if(d.respLongMsg){ }}
            <span class="ebayPublish-listingsucc ebayPublish-respMsg">
                <pre style="display: inline;"> <i title="刊登警告信息" class="layui-icon" style="color: #FFB800;cursor: pointer;" >&#xe702;</i></pre>
                <pre class="layui-hide">{{d.respLongMsg}}</pre>
            </span>
            {{# } }}
        </div>
    </script>
    <!-- 店铺sku -->
    <!-- 侵权状态模板 -->
    <script type="text/html" id="ebaypublish_tort_tpl">
        <div style="text-align:left;" class="layui-form">
                {{# if(d.isWishTort){ }}
                <input type="checkbox" checked disabled title="wish" lay-skin="primary">
                {{# }else{ }}
                  <input type="checkbox" disabled  title="wish" lay-skin="primary">
                {{# }}}
                <span class="w_50 inline_table hv20">{{ d.wishTortReason ? d.wishTortReason : ''}}</span>
                <br>
                {{# if(d.isJoomTort){ }}
                <input type="checkbox" disabled checked title="joom" lay-skin="primary">
                {{# }else{ }}
                  <input type="checkbox" disabled  title="joom" lay-skin="primary">
                {{# }}}
                <span class="w_50 inline_table hv20">{{ d.joomTortReason ? d.joomTortReason : ''}}</span>
                <br>
                {{# if(d.isEbayTort){ }}
                <input type="checkbox" disabled checked title="ebay" lay-skin="primary">
                {{# }else{ }}
                  <input type="checkbox" disabled  title="ebay" lay-skin="primary">
                {{# }}}
                <span class="w_50 inline_table hv20">{{ d.ebayTortReason ? d.ebayTortReason : ''}}</span>
                <br>
                {{# if(d.isAmazonTort){ }}
                <input type="checkbox" disabled checked title="amazon" lay-skin="primary">
                {{# }else{ }}
                  <input type="checkbox" disabled  title="amazon" lay-skin="primary">
                {{# }}}
                <span class="w_50 inline_table hv20">{{ d.amazonTortReason ? d.amazonTortReason : ''}}</span>
                <br>
                {{# if(d.isSmtTort){ }}
                <input type="checkbox" disabled checked title="smt" lay-skin="primary">
                {{# }else{ }}
                  <input type="checkbox" disabled  title="smt" lay-skin="primary">
                {{# }}}
                <span class="w_50 inline_table hv20">{{ d.smtTortReason ? d.smtTortReason : ''}}</span>
                <br>
                {{# if(d.isShopeeTort){ }}
                <input type="checkbox" disabled checked title="shopee" lay-skin="primary">
                {{# }else{ }}
                  <input type="checkbox" disabled  title="shopee" lay-skin="primary">
                {{# }}}
                <span class="w_50 inline_table hv20">{{ d.shopeeTortReason ? d.shopeeTortReason : ''}}</span>
                <br>

            </div>
    </script>
    <!-- 侵权状态模板 -->
    <!-- 操作列模板 -->
    <script type="text/html" id="ebaypublish_option_tpl">
         <!--全部详情-->
         {{# if(!d.listingStatus&&(d.listingStatus!==0)){ }}

         {{# if(d.isListing == false){ }}
         <button class="layui-btn layui-btn-xs layui-btn-primary" onclick="ebayPublishGenList({{ d.prodPId }})" title="生成店铺商品">生成商品</button>
         {{# }}}
         <button class="layui-btn layui-btn-xs" onclick="producttpl_getTraslation('{{d.prodPId }}')" dataid="{{ d.prodPId }}">刊登翻译</button>
         <button  type="button" class="layui-btn layui-btn-xs" onclick="compUrl_producttpl('{{d.pSku}}','{{d.prodPId}}')">竞品链接</button>
         <button  type="button" class="layui-btn layui-btn-xs" onclick="producttpl_getListingStatus('{{d.prodPId}}')">刊登状态</button>
         <button class="layui-btn layui-btn-xs devIdeaWayBtn" dataid="{{d.prodPId}}">开发思路</button>
         {{# }}}
         <!--待发布-->
         {{# if(d.listingStatus==0){ }}
         <button class="layui-btn layui-btn-xs" type="button" onclick="ebayPulish_listDetail({{ d.id}})">刊登详情</button>
         <button class="layui-btn layui-btn-xs" onclick="ebayPublishListing({{ d.id }})">发布上架</button>
         <button class="layui-btn layui-btn-xs layui-btn-primary" onclick="ebayPublishVerifyListing({{d.id }})">测刊登费</button>
         <button  type="button" class="layui-btn layui-btn-xs" onclick="compUrl_producttpl('{{d.pSku}}','{{d.prodPId}}')">竞品链接</button>
         <button  type="button" class="layui-btn layui-btn-xs" onclick="producttpl_getListingStatus('{{d.prodPId}}')">刊登状态</button>
         <button class="layui-btn layui-btn-xs devIdeaWayBtn" dataid="{{d.prodPId}}">开发思路</button>
         {{# }}}
         <!-- 刊登成功 -->
         {{# if(d.listingStatus&&(d.listingStatus==1)){ }}
         <button class="layui-btn layui-btn-xs" type="button" onclick="ebayPulish_listDetail({{ d.id}}, true)">成功详情</button>
         <button  type="button" class="layui-btn layui-btn-xs" onclick="compUrl_producttpl('{{d.pSku}}','{{d.prodPId}}')">竞品链接</button>
         <button  type="button" class="layui-btn layui-btn-xs" onclick="producttpl_getListingStatus('{{d.prodPId}}')">刊登状态</button>
         <button class="layui-btn layui-btn-xs devIdeaWayBtn" dataid="{{d.prodPId}}">开发思路</button>
         {{# }}}
         <!-- 刊登失败 -->
         {{# if(d.listingStatus&&(d.listingStatus==2)){ }}
         <button class="layui-btn layui-btn-xs" type="button" onclick="ebayPulish_listDetail({{ d.id}})">刊登详情</button>
         <button class="layui-btn layui-btn-xs" onclick="ebayPublishListing({{ d.id }})">重新发布</button>
         <button  type="button" class="layui-btn layui-btn-xs" onclick="compUrl_producttpl('{{d.pSku}}','{{d.prodPId}}')">竞品链接</button>
         <button  type="button" class="layui-btn layui-btn-xs" onclick="producttpl_getListingStatus('{{d.prodPId}}')">刊登状态</button>
         <button class="layui-btn layui-btn-xs devIdeaWayBtn" dataid="{{d.prodPId}}">开发思路</button>
         {{# }}}
         {{# if(d.listingStatus&&(d.listingStatus==3)){ }}
         {{# if(d.listingTime){ }}
            <button class="layui-btn layui-btn-xs layui-btn-danger" onclick="ebayPublishCancleListTiming({{ d.id }})">取消定时</button>
         {{# }else{ }}
            <button class="layui-btn layui-btn-xs layui-btn-danger" onclick="ebayPublishCancleList({{ d.id }})">取消刊登</button>
         {{# }}}
         {{# }}}
    </script>
    <!-- 操作列模板 -->
              <!-- 刊登失败信息 -->
              <script type="text/html" id="ebaypubish_respShortMsg_Tpl">
                <span class="ebayPublish-listingsucc ebayPublish-respMsg">
                <pre>{{d.respShortMsg || ''}}
                    {{# if(d.respLongMsg!=d.respShortMsg){ }}
                    <i title="完整错误详情" class="layui-icon" style="color: red;cursor: pointer;" >&#xe702;</i>
                    {{# }}}</pre>
                <pre class="layui-hide">{{d.respLongMsg || ''}}</pre>
                </span>
            </script>
            <!-- 刊登失败信息 -->
       <!-- 开发备注 -->
       <script type="text/html" id="ebaypubish_devNote_Tpl">
        {{# if(d.devNote&&d.devNote.length>100){ }}
        <div>
            <span class="shortStr">{{d.devNote.slice(0,100)}}</span>
            <span class="hide compeleteStr">{{d.devNote}}</span>
            <span onclick="expandStr($(this))" data-index="expand" class="expand">[展开]</span></div>
        {{# }else{ }}
        <div>{{d.devNote||""}}</div>
        {{# }}}
    </script>
    <!-- 开发备注 -->
<!-- 表格渲染模板 -->
<script type="text/html" id="ebaypubish_imageTpl">
    <div>
        {{# if(d.listingStatus||d.listingStatus==0){ }}
            <img class="img_show_hide lazy b1" width="61" height="61" data-original="{{ d.mainImgUri }}" data-onerror="layui.admin.img_noFind()">
            <input type="text" value="{{d.prodPId}}" hidden name="prodPId">
        {{# }else{ }}
            <img class="img_show_hide lazy b1" width="60" height="60" data-original="${tplIVP}/{{ d.mainImgUri }}" data-onerror="layui.admin.img_noFind()">
            <input type="text" value="{{d.prodPId}}" hidden name="prodPId">
        {{# }}}
    </div>
</script>
<!-- 表格渲染模板 -->
<!--待生成详情弹框 modify by zhaoyd 修改为展示三行 category1, category2, specifics-->
<script type="text/html" id="ebayPulish_unGenDetailTpl">
    <span style="color:#999;">category1:</span>{{d.category1}}<br>
    <span style="color:#999;">category2:</span>{{d.category2}}<br>
    <pre>{{d.specifics}}</pre>
</script>


<!-- 刊登详情 -->
<script type="text/html" id="ebayPulish_listDetailTpl">
    <div style="padding: 20px 40px 0 0">
        <form action="" class="layui-form" id="ebayPulish_listDetailForm">
            <input type="hidden" name="id" value="{{d.prodListingEbay.id}}">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label w90 p09">站点</label>
                    <div class="layui-input-inline">
                        <input readonly name="siteName" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.siteName}}">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label w90 p09">父SKU</label>
                    <div class="layui-input-inline">
                        <input name="storePSku" data-sku="{{d.prodListingEbay.pSku}}" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.storePSku}}">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label w90 p09">收款paypal</label>
                    <div class="layui-input-inline">
                        <input readonly name="paypalEmailAddr" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.paypalEmailAddr}}">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label w90 p09">刊登时间</label>
                    <div class="layui-input-inline">
                        <select name="listingDuration">
                          <c:forEach items="${listingDurations}" var="listingDuration">
                                {{#  if(d.prodListingEbay.listingDuration == "${listingDuration.value()}"){ }}
                                    <option value="${listingDuration.value()}" selected>${listingDuration.name()}</option>
                                {{#  } else { }}
                                    <option value="${listingDuration.value()}">${listingDuration.name()}</option>
                                {{#  } }}
                          </c:forEach>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">刊登标题</label>
                <div class="layui-input-block">
                    <input name="title" type="text" autocomplete="off" class="layui-input ifFocusInput" data-prodpid="{{d.prodListingEbay.prodPId}}" value="{{d.prodListingEbay.title}}"
                           style="display: inline-block"
                    >
                    <b></b>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">副标题</label>
                <div class="layui-input-block">
                    <input name="subTitle" type="text" autocomplete="off" class="layui-input ifFocusInput" data-prodpid="{{d.prodListingEbay.prodPId}}" value="{{d.prodListingEbay.subTitle || ''}}">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">类目1</label>
                <div class="layui-input-block">
                    <div style="width:18%;float: left;">
                        <input readonly name="category1" type="text" autocomplete="off" class="layui-input"value="{{d.prodListingEbay.category1 || ''}}">
                    </div>
                    <span style="display: inline-block;line-height: 30px;margin-left: 10px;" class="category1Name">{{d.prodListingEbay.category1Name || ''}}</span>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">类目2</label>
                <div class="layui-input-block">
                    <div style="width:18%;float: left;">
                        <input readonly name="category2" type="text" autocomplete="off" class="layui-input"value="{{d.prodListingEbay.category2 || ''}}">
                    </div>
                    <span style="display: inline-block;line-height: 30px;margin-left: 10px;" class="category2Name">{{d.prodListingEbay.category2Name || ''}}</span>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">Specifics</label>
                <div class="layui-input-block dis_flex">
                    <textarea name="specifics" class="layui-textarea w_90">{{d.prodListingEbay.specifics || ''}}</textarea>
                    <button id="editspecifics" type="button" class="layui-btn layui-btn-sm layui-btn-normal">编辑</button>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">best Offer</label>
                <div class="layui-input-block">
                    <div style="width:20%;float:left;">
                        {{#  if(d.prodListingEbay.isBestoffer){ }}
                            <input name="isBestoffer" type="radio" name="switch" value="true" title="开启" checked>
                            <input name="isBestoffer" type="radio" name="switch" value="false" title="关闭">
                        {{#  } else { }}
                            <input name="isBestoffer" type="radio" name="switch" value="true" title="开启" >
                            <input name="isBestoffer" type="radio" name="switch" value="false" title="关闭" checked>
                        {{#  } }}
                    </div>
                    <div style="width:78%;float:right;">
                        <div class="layui-inline">
                            <label class="layui-form-label" style="width:110px">自动交易价格>=</label>
                            <div class="layui-input-inline">
                                <input name="autoAcceptPrice" type="text" autocomplete="off" class="layui-input"
                                {{#  if(d.prodListingEbay.autoAcceptPrice){ }}
                                value="{{d.prodListingEbay.autoAcceptPrice}}"
                                {{#  } }}
                                >
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label" style="width:110px">自动拒绝价格<=</label>
                            <div class="layui-input-inline">
                                <input name="minimumBoPrice" type="text" autocomplete="off" class="layui-input"
                                {{#  if(d.prodListingEbay.minimumBoPrice){ }}
                                value="{{d.prodListingEbay.minimumBoPrice}}"
                                {{#  } }}
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">刊登风格</label>
                <div class="layui-input-block">
                    <div style="width:20%;float:left;margin-right:15px">
                        <input name="listingStyleId" type="hidden">
                        <input readonly name="listingStyleName" type="text" class="layui-input et_moduleStyleDesc" autocomplete="off">
                    </div>
                    <div style="width:20%;float:left;margin-right:15px">
                        <button class="layui-btn layui-btn-sm layui-btn-normal ebayPublish_selStyle" type="button">选择风格</button>
                    </div>
                    <div style="float:left;border:1px solid #e8e8e8">
                         <img src="${ctx}/static/img/kong.png" alt=""  id="et_moduleStyle">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">销售模板</label>
                <div class="layui-input-block">
                    <div style="width:20%;float:left;margin-right:15px">
                        <select name="assiFieldInfoId" lay-search>
                        <option value="">不使用模板</option>
                    </select>
                    </div>
                    <div style="width:20%;float:left;margin-right:15px">
                        <button id="ebayPulish_previewStyleBtn" class="layui-btn layui-btn-sm layui-btn-normal" type="button">预览</button>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <input type="hidden" name="mainImgUri">
                <input type="hidden" name="extImgUris">
                <label class="layui-form-label w90 p09">图片</label>
                <div class="layui-input-block" style="overflow:hidden;">
                    <div class="imageLeft">
                        <img src="{{ d.prodListingEbay.mainImgUri }}" width="260" height="260">
                    </div>
                    <div>
                        <div style="margin: 5px 0">
                          <button class="layui-btn layui-btn-primary layui-btn-sm ebayInternetImgBtn" type="button">网络图片</button>
                          <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="ebayMainImgAddWatermark">主图添加水印图</button>
                          <button type="button" class="layui-btn layui-btn-sm" id="ebayMainImgAddWatermark" onclick="ebay_publish_addImgByTpl(this)">模板图片</button>
                          <div class="ebayPublish_extImg_edit_local"></div>
                          <span>
                               <i style="background:red;color:#fff">说明: </i>
                               点击图片拖动，即可调整图片顺序！辅图最多选用<span class="ebaySpecialImgNum">{{[0,3,15,77].includes(d.prodListingEbay.siteId) ? 23: 11}}</span>张，已经选用了
                               <span class="layui-badge layui-bg-blue ebaySecondImgNum">

                                    {{#  if(d.prodListingEbay.extImgUris){ }}
                                        {{ d.prodListingEbay.extImgUris.split('|').length }}
                                    {{#  } else { }}
                                        0
                                    {{#  } }}
                               </span>张辅图
                          </span>
                        </div>
                        <div id="ebayPublish_extImg">
                            {{#  if(d.prodListingEbay.extImgUris){ }}
                                {{#   layui.each(d.prodListingEbay.extImgUris.split('|'),function(i,v){ }}
                                    <div class="imageRight">
                                         <img src="{{ v }}" width="150" height="150">
                                         <span class="setEbayMainImg">设为主图</span>
                                         <span class="removeEbayImg">移除</span>
                                    </div>
                                {{# }); }}
                            {{#  } }}

                        </div>

                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">产品描述</label>
                <div class="layui-input-block">
                    <%-- <textarea readonly name="description" class="layui-textarea">{{d.prodListingEbay.description}}</textarea>       --%>
                    <div id="wangEditor">
                        {{d.prodListingEbay.description}}
                    </div>
                </div>
            </div>
            <br>
        <div class="layui-form-item">
            <label class="layui-form-label w90 p09">变种操作</label>
            <div class="layui-input-block">
            <div class="layui-col-md1 layui-col-lg1">
                <div class="layui-inline">
                    <button onclick="ebayPublishUpdateSku({{d.prodListingEbay.id}})" type="button" class="layui-btn layui-btn-sm">使用商品SKU</button>
                </div>
            </div>
            <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">sku后缀批量</label>
                    <div class="layui-input-block dis_flex">
                        <select name="sufixSetType" id="sufixSetType" lay-filter="sufixSetType">
                            <option value="1">添加</option>
                            <option value="2">替换</option>
                            <option value="3">删除</option>
                        </select>
                        <input type="text" class="layui-input" name="originalsku" style="width:30%">
                        <div class="replacehide dis_flex_around hide" style="width:50%">
                        <span style="width:20%;line-height: 38px;margin-left: 10px;">替换为</span>
                        <input type="text" class="layui-input" name="newsku" style="width:60%">
                        </div>
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="batchSetSkuSufix($(this))">批量设置后缀</button>
                    </div>
                </div>
                    <div class="layui-col-md2 layui-col-lg2">
                        <div class="layui-input-block dis_flex">
                            <div class="layui-input-inline">
                                <input id="ebayPulish_addSku"  width="120" type="text" autocomplete="off" class="layui-input" placeholder="关联SKU">
                            </div>
                            <button onclick="ebayPulish_addSkuBtn()" type="button" class="layui-btn layui-btn-sm layui-btn-normal">关联销售</button>
                        </div>
                    </div>
                    <div class="layui-col-md1 layui-col-lg1 dis_flex" style="justify-content: flex-end;">
                        <button id="ebayPublish_add_sub_btn" type="button"
                                class="layui-btn layui-btn-sm">新增一行
                        </button>
                    </div>
                <div class="layui-col-md6 layui-col-lg6 dis_flex">
                    <div class="disFCenter">
                        <label class="layui-form-label">毛利率</label>
                        <div class="layui-input-inline">
                            <input name="grossProfitRate" type="number" class="layui-input" placeholder="毛利率">
                        </div>
                        <span>%</span>
                    </div>
                    <div class="disFCenter">
                        <label class="layui-form-label">优惠幅度</label>
                        <div class="layui-input-inline">
                            <input name="discountRate" type="number" class="layui-input" placeholder="优惠幅度">
                        </div>
                        <span>%</span>
                    </div>
                    <div class="disFCenter">
                        <label class="layui-form-label">定价方式</label>
                        <div class="layui-input-inline">
                            <select name="platListingPriceFormulaConfigId"></select>
                        </div>
                    </div>
                    <button onclick="ebayPublishUpdatePrice({{d.prodListingEbay.id}})" type="button"
                            class="layui-btn layui-btn-sm layui-btn-warm">更新价格
                    </button>
                </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">图片关联属性</label>
                <div class="layui-col-md2 layui-col-lg2 pictureFieldDiv">
                    <input type="radio" class="pictureField" value="color" title="color" lay-filter="ep_pictureField">
                    <input type="radio" class="pictureField" value="size" title="size" lay-filter="ep_pictureField">
                    <input type="radio" class="pictureField" value="style" title="style" lay-filter="ep_pictureField">
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <button type="button" class="addSpecificsBtn layui-btn layui-btn-sm layui-btn-normal">新增属性</button>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">变种信息</label>
                <div class="layui-input-block">
                    <table class="layui-table sub-sku-ebay">
                        <thead>
                            <tr id="ebayPulish_sub-sku-ebay_th_tr">
                                <th>图片</th>
                                <th>店铺SKU</th>
                                <%--根据specifics决定 --%>
                                <%--<th>尺寸</th>--%>
                                <%--<th>颜色</th>--%>
                                <%--<th>款式</th>--%>
                                <th class="price">
                                    <div class="pricemodify" style="width:300px">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <select name="operator">
                                            <option>=</option>
                                            <option>+</option>
                                            <option>-</option>
                                            <option>*</option>
                                            <option>/</option>
                                             </select>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" name="deviation" class="layui-input" autocomplete="off">
                                        </div>
                                         <div class="layui-col-md layui-col-lg3">
                                            <button id="ebayPublish_batchChangePriceBtn" type="button" class="layui-btn layui-btn-sm layui-btn-normal">修改价格</button>
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div class="numbermodify" style="width:300px">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <select name="operator">
                                                <option>=</option>
                                                <option>+</option>
                                                <option>-</option>
                                                <option>*</option>
                                                <option>/</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input name="deviation" type="number" class="layui-input" autocomplete="off">
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <button id="ebayPublish_batchChangeQuantityBtn" type="button" class="layui-btn layui-btn-sm layui-btn-normal">修改数量</button>
                                        </div>
                                     </div>
                                </th>
                                <th>UPC/EAN</th>
                                <th>固定价格</th>
                                <th>引流SKU</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="ebayPublish_SubSkuInfo_body">
                            {{#  layui.each(d.subSkuEbayDtos, function(index, subSkuEbayDto){ }}
                            <tr data-prodssku="{{subSkuEbayDto.sSku}}">
                                <input type="hidden" name="id" value="{{subSkuEbayDto.id}}">
                                <input type="hidden" name="tempVarietyId" value="{{subSkuEbayDto.tempVarietyId}}">
                                <td width="180">
                                    <div style="display: flex;">
                                        <div style="width: 80px;position:relative;">
                                            <input type="hidden" name="imgUri" value="{{subSkuEbayDto.imgUri || ''}}">
                                            <img class="img_show_hide" width="60" height="60" style="margin-left: 10px" src="{{subSkuEbayDto.imgUri ? subSkuEbayDto.imgUri.split(';')[0]: ''}}" onerror="layui.admin.img_noFind()">
                                            <span class="subImgNum">{{subSkuEbayDto.imgUri ? subSkuEbayDto.imgUri.split(';').length: 0}}</span>
                                            <br>
                                            <span class="layui-btn layui-btn-xs" onclick="ebayPublish_subSkuImg_detailHandle(this)">详情</span>
                                            <span onclick="ebayPublish_subSkuImg_removeHandle(this)" class="layui-btn layui-btn-xs layui-btn-danger">删除</span>
                                        </div>
                                        <div class="editImgBtn">
                                            <a href="javascrpt:;" style="color: cornflowerblue" id="subSkuImg_container_tableLocalUpload" onclick="ebayPublish_subTableSkuImg_exchangeLocal(this)">本地图片</a>
                                            <a href="javascrpt:;" style="color: cornflowerblue" id="subSkuImg_container_tableNetUpload" onclick="ebayPublish_subTableSkuImg_exchangeNet(this)">网络图片</a>
                                            <a href="javascrpt:;" style="color: cornflowerblue" id="subSkuImg_container_tableTempUpload" onclick="ebayPublish_subTableSkuImg_exchangeTemp(this)">模板图片</a>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <input name="storeSSku" data-sku="{{subSkuEbayDto.sSku}}" value="{{subSkuEbayDto.storeSSku}}" class="layui-input">
                                </td>
                                <%--根据specifics决定 --%>
                                <%--<td>{{subSkuEbayDto.size}}</td>--%>
                                <%--<td>{{subSkuEbayDto.color}}</td>--%>
                                <%--<td>{{subSkuEbayDto.style || ''}}</td>--%>
                                <td class="price"><input type="number" name="buyItNowPrice" value="{{subSkuEbayDto.buyItNowPrice}}" class="layui-input"></td>
                                <td><input type="number" name="quantity" value="{{subSkuEbayDto.quantity}}" class="layui-input"></td>
                                <td>
                                    {{#  if(subSkuEbayDto.upc){ }}
                                        {{subSkuEbayDto.upc}}
                                    {{#  } else { }}
                                        {{subSkuEbayDto.ean}}
                                    {{#  } }}
                                </td>
                                <td>
                                    {{#  if(subSkuEbayDto.isLockPrice){ }}
                                    <input type="checkbox" checked name="isLockPrice" lay-filter="ep_isLockPrice" lay-skin="switch" lay-text="是|否">
                                    {{#  } else { }}
                                    <input type="checkbox" name="isLockPrice" lay-filter="ep_isLockPrice" lay-skin="switch" lay-text="是|否">
                                    {{#  } }}
                                </td>
                                <td>
                                    {{#  if(subSkuEbayDto.isAttractSku){ }}
                                    <input type="checkbox" checked name="isAttractSku" lay-filter="ep_isAttractSku" lay-skin="switch" lay-text="是|否">
                                    {{#  } else { }}
                                    <input type="checkbox" name="isAttractSku" lay-filter="ep_isAttractSku" lay-skin="switch" lay-text="是|否">
                                    {{#  } }}
                                </td>
                                <td>
                                    <button type="button" onclick="ebayPulish_removeSkuBtn(this)" class="layui-btn layui-btn-sm layui-btn-danger">删除</button>
                                </td>
                            </tr>
                            {{#  }); }}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label w90 p09">商品所在地</label>
                    <div class="layui-input-inline">
                        <input readonly name="location" name="local" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.location}}">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label" style="width:110px">商品所在国家</label>
                    <div class="layui-input-inline">
                        <input readonly name="locationCountry" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.locationCountry}}">
                    </div>
                </div>
                <div class="layui-inline" style="float: right;">
                    <label class="layui-form-label w90 p09">&nbsp;</label>
                    <div class="layui-input-block">
                        <div class="layui-input-inline">
                              <select name="shippingTpl" lay-search="">
                              </select>
                        </div>
                        <button id="ebayPublish_applyShipping" type="button" class="layui-btn layui-btn-sm layui-btn-normal">应用物流模板</button>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">境内运输方式1</label>
                <div class="layui-input-block">
                    <div style="width:55%;float:left;">
                       <input name="shippingService1" type="text" class="layui-input" autocomplete="off" value="{{d.prodListingEbay.shippingService1 || ''}}">
                    </div>
                    <div style="width:40%;float:right;">
                        <div class="layui-inline">
                            <label class="layui-form-label">运费</label>
                            <div class="layui-input-inline"  style="width: 50px">
                                <input name="shippingSrv1Cost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.shippingSrv1Cost || '0'}}">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">附加费</label>
                            <div class="layui-input-inline" style="width: 50px">
                                <input name="shippingSrv1AddiCost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.shippingSrv1AddiCost || '0'}}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">境内运输方式2</label>
                <div class="layui-input-block">
                    <div style="width:55%;float:left;">
                       <input name="shippingService2" type="text" class="layui-input" autocomplete="off" value="{{d.prodListingEbay.shippingService2 || ''}}">
                    </div>
                    <div style="width:40%;float:right;">
                        <div class="layui-inline">
                            <label class="layui-form-label">运费</label>
                            <div class="layui-input-inline"  style="width: 50px">
                                <input name="shippingSrv2Cost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.shippingSrv2Cost || '0'}}">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">附加费</label>
                            <div class="layui-input-inline" style="width: 50px">
                                <input name="shippingSrv2AddiCost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.shippingSrv2AddiCost || '0'}}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">境内运输方式3</label>
                <div class="layui-input-block">
                    <div style="width:55%;float:left;">
                       <input name="shippingService3" type="text" class="layui-input" autocomplete="off" value="{{d.prodListingEbay.shippingService3 || ''}}">
                    </div>
                    <div style="width:40%;float:right;">
                        <div class="layui-inline">
                            <label class="layui-form-label">运费</label>
                            <div class="layui-input-inline"  style="width: 50px">
                                <input name="shippingSrv3Cost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.shippingSrv3Cost || '0'}}">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">附加费</label>
                            <div class="layui-input-inline" style="width: 50px">
                                <input name="shippingSrv3AddiCost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.shippingSrv3AddiCost || '0'}}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">境内运输方式4</label>
                <div class="layui-input-block">
                    <div style="width:55%;float:left;">
                       <input name="shippingService4" type="text" class="layui-input" autocomplete="off" value="{{d.prodListingEbay.shippingService4 || ''}}">
                    </div>
                    <div style="width:40%;float:right;">
                        <div class="layui-inline">
                            <label class="layui-form-label">运费</label>
                            <div class="layui-input-inline"  style="width: 50px">
                                <input name="shippingSrv4Cost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.shippingSrv4Cost || '0'}}">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">附加费</label>
                            <div class="layui-input-inline" style="width: 50px">
                                <input name="shippingSrv4AddiCost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.shippingSrv4AddiCost || '0'}}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">境外运输方式1</label>
                <div class="layui-input-block">
                    <div style="width:55%;float:left;">
                       <input name="intShippingService1" type="text" class="layui-input" autocomplete="off" value="{{d.prodListingEbay.intShippingService1 || ''}}">
                    </div>
                    <div style="width:40%;float:right;">
                        <div class="layui-inline">
                            <label class="layui-form-label">运费</label>
                            <div class="layui-input-inline"  style="width: 50px">
                                <input name="intShippingSrv1Cost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.intShippingSrv1Cost || '0'}}">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">附加费</label>
                            <div class="layui-input-inline" style="width: 50px">
                                <input name="intShippingSrv1AddiCost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.intShippingSrv1AddiCost || '0'}}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">运输到</label>
                <div class="layui-input-block ebayShipTo1">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">境外运输方式2</label>
                <div class="layui-input-block">
                    <div style="width:55%;float:left;">
                       <input name="intShippingService2" type="text" class="layui-input" autocomplete="off" value="{{d.prodListingEbay.intShippingService2 || ''}}">
                    </div>
                    <div style="width:40%;float:right;">
                        <div class="layui-inline">
                            <label class="layui-form-label">运费</label>
                            <div class="layui-input-inline"  style="width: 50px">
                                <input name="intShippingSrv2Cost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.intShippingSrv2Cost || '0'}}">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">附加费</label>
                            <div class="layui-input-inline" style="width: 50px">
                                <input name="intShippingSrv2AddiCost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.intShippingSrv2AddiCost || '0'}}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">运输到</label>
                <div class="layui-input-block ebayShipTo2">
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">境外运输方式3</label>
                <div class="layui-input-block">
                    <div style="width:55%;float:left;">
                       <input name="intShippingService3" type="text" class="layui-input" autocomplete="off" value="{{d.prodListingEbay.intShippingService3 || ''}}">
                    </div>
                    <div style="width:40%;float:right;">
                        <div class="layui-inline">
                            <label class="layui-form-label">运费</label>
                            <div class="layui-input-inline"  style="width: 50px">
                                <input name="intShippingSrv3Cost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.intShippingSrv3Cost || '0'}}">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">附加费</label>
                            <div class="layui-input-inline" style="width: 50px">
                                <input name="intShippingSrv3AddiCost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.intShippingSrv3AddiCost || '0'}}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">运输到</label>
                <div class="layui-input-block ebayShipTo3">
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">境外运输方式4</label>
                <div class="layui-input-block">
                    <div style="width:55%;float:left;">
                       <input name="intShippingService4" type="text" class="layui-input" autocomplete="off" value="{{d.prodListingEbay.intShippingService4 || ''}}">
                    </div>
                    <div style="width:40%;float:right;">
                        <div class="layui-inline">
                            <label class="layui-form-label">运费</label>
                            <div class="layui-input-inline"  style="width: 50px">
                                <input name="intShippingSrv4Cost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.intShippingSrv4Cost || '0'}}">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">附加费</label>
                            <div class="layui-input-inline" style="width: 50px">
                                <input name="intShippingSrv4AddiCost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.intShippingSrv4AddiCost || '0'}}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">运输到</label>
                <div class="layui-input-block ebayShipTo4">
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">境外运输方式5</label>
                <div class="layui-input-block">
                    <div style="width:55%;float:left;">
                       <input name="intShippingService5" type="text" class="layui-input" autocomplete="off" value="{{d.prodListingEbay.intShippingService5 || ''}}">
                    </div>
                    <div style="width:40%;float:right;">
                        <div class="layui-inline">
                            <label class="layui-form-label">运费</label>
                            <div class="layui-input-inline"  style="width: 50px">
                                <input name="intShippingSrv5Cost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.intShippingSrv5Cost || '0'}}">
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">附加费</label>
                            <div class="layui-input-inline" style="width: 50px">
                                <input name="intShippingSrv5AddiCost" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.intShippingSrv5AddiCost || '0'}}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">运输到</label>
                <div class="layui-input-block ebayShipTo5">
                   <div class="layui-inline worldwilde">
                        <input name="intShip5ToLocal" type="checkbox" title="全球" value="Worldwide" lay-skin="primary" lay-filter="ebayPulish_worldwilde">
                    </div>
                    <div class="layui-inline" style="margin-left: 15px">
                        <input name="intShip5ToLocal" type="checkbox" title="德国" value="DE" lay-skin="primary">
                        <input name="intShip5ToLocal" type="checkbox" title="法国" value="FR" lay-skin="primary">
                        <input name="intShip5ToLocal" type="checkbox" title="俄罗斯" value="RU" lay-skin="primary">
                        <input name="intShip5ToLocal" type="checkbox" title="巴西" value="BR" lay-skin="primary">
                        <input name="intShip5ToLocal" type="checkbox" title="美国" value="US" lay-skin="primary">
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">不寄送国家</label>
                <button style="margin-bottom: 10px" id="ebay_exclude_country" type="button" class="layui-btn layui-btn-sm layui-btn-normal">使用店铺设置</button>
                <div class="layui-input-block">
                     <textarea id="ebay_listing_not_ship_to_countries_textarea" name="notShipToCountries" placeholder="请输入内容" class="layui-textarea">{{d.prodListingEbay.notShipToCountries}}</textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-row">
                    <div class="layui-col-md6">
                        <label class="layui-form-label wp90"><span style="color: red">*</span>国内退货</label>
                        <div class="layui-input-block">
                            <select name="returnsAcceptedOption">
                                <c:forEach items = "${returnsAcceptedOptions}" var = "returnsAcceptedOption" >
                                    {{#  if(d.prodListingEbay.returnsAcceptedOption == "${returnsAcceptedOption.value()}"){ }}
                                        <option value="${returnsAcceptedOption.value()}" selected>${returnsAcceptedOption.value()}</option>
                                    {{#  } else { }}
                                        <option value="${returnsAcceptedOption.value()}">${returnsAcceptedOption.value()}</option>
                                    {{#  } }}
                                </c:forEach>

                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md6">
                        <label class="layui-form-label wp90"><span style="color: red">*</span>退货方式</label>
                        <div class="layui-input-block">
                            <select name="refundOptions">
                                <c:forEach items = "${refundOptions}" var = "refundOption" >
                                    {{#  if(d.prodListingEbay.refundOptions == "${refundOption.value()}"){ }}
                                        <option value="${refundOption.value()}" selected>${refundOption.value()}</option>
                                    {{#  } else { }}
                                        <option value="${refundOption.value()}">${refundOption.value()}</option>
                                    {{#  } }}
                                </c:forEach>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-row">
                    <div class="layui-col-md6">
                        <label class="layui-form-label wp90"><span style="color: red">*</span>退货期限</label>
                        <div class="layui-input-block">
                            <select name="returnsWithinOption">
                                <c:forEach items = "${returnsWithinOptions}" var = "returnsWithinOption" >
                                    {{#  if(d.prodListingEbay.returnsWithinOption == "${returnsWithinOption.value()}"){ }}
                                        <option value="${returnsWithinOption.value()}" selected>${returnsWithinOption.value()}</option>
                                    {{#  } else { }}
                                        <option value="${returnsWithinOption.value()}">${returnsWithinOption.value()}</option>
                                    {{#  } }}
                                </c:forEach>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md6">
                        <label class="layui-form-label wp90"><span style="color: red">*</span>运费承担</label>
                        <div class="layui-input-block">
                            <select name="shippingCostPaidBy">
                                <c:forEach items = "${shippingCostPaidBys}" var = "shippingCostPaidBy" >
                                    {{#  if(d.prodListingEbay.shippingCostPaidBy == "${shippingCostPaidBy.value()}"){ }}
                                        <option value="${shippingCostPaidBy.value()}" selected="">${shippingCostPaidBy.value()}</option>
                                    {{#  } else { }}
                                        <option value="${shippingCostPaidBy.value()}">${shippingCostPaidBy.value()}</option>
                                    {{#  } }}
                                </c:forEach>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-row">
                    <div class="layui-col-md12">
                        <label class="layui-form-label wp90">退货说明</label>
                        <div class="layui-input-block">
                            {{#  if(d.prodListingEbay.returnDescription){ }}
                                <textarea name="returnDescription" class="layui-textarea">{{d.prodListingEbay.returnDescription}}</textarea>
                            {{#  } else { }}
                                <textarea name="returnDescription" class="layui-textarea"></textarea>
                            {{#  } }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-row">
                    <div class="layui-col-md6">
                        <label class="layui-form-label wp90">国际退货</label>
                        <div class="layui-input-block">
                            <select name="internationalReturnsAcceptedOption">
                                <option value=""></option>
                                <c:forEach items = "${returnsAcceptedOptions}" var = "returnsAcceptedOption" >
                                    {{#  if(d.prodListingEbay.internationalReturnsAcceptedOption == "${returnsAcceptedOption.value()}"){ }}
                                        <option value="${returnsAcceptedOption.value()}" selected>${returnsAcceptedOption.value()}</option>
                                    {{#  } else { }}
                                        <option value="${returnsAcceptedOption.value()}">${returnsAcceptedOption.value()}</option>
                                    {{#  } }}
                                </c:forEach>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md6">
                        <label class="layui-form-label wp90">国际退货方式</label>
                        <div class="layui-input-block">
                            <select name="internationalRefundOptions">
                                <option value=""></option>
                                <c:forEach items = "${refundOptions}" var = "refundOption" >
                                    {{#  if(d.prodListingEbay.internationalRefundOptions == "${refundOption.value()}"){ }}
                                        <option value="${refundOption.value()}" selected>${refundOption.value()}</option>
                                    {{#  } else { }}
                                        <option value="${refundOption.value()}">${refundOption.value()}</option>
                                    {{#  } }}
                                </c:forEach>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-row">
                    <div class="layui-col-md6">
                        <label class="layui-form-label wp90">国际退货期限</label>
                        <div class="layui-input-block">
                            <select name="internationalReturnsWithinOption">
                                <option value=""></option>
                                <c:forEach items = "${returnsWithinOptions}" var = "returnsWithinOption" >
                                    {{#  if(d.prodListingEbay.internationalReturnsWithinOption == "${returnsWithinOption.value()}"){ }}
                                        <option value="${returnsWithinOption.value()}" selected>${returnsWithinOption.value()}</option>
                                    {{#  } else { }}
                                        <option value="${returnsWithinOption.value()}">${returnsWithinOption.value()}</option>
                                    {{#  } }}
                                </c:forEach>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md6">
                        <label class="layui-form-label wp90">国际退货运费承担</label>
                        <div class="layui-input-block">
                            <select name="internationalShippingCostPaidBy">
                                <option value=""></option>
                                <c:forEach items = "${shippingCostPaidBys}" var = "shippingCostPaidBy" >
                                    {{#  if(d.prodListingEbay.internationalShippingCostPaidBy == "${shippingCostPaidBy.value()}"){ }}
                                        <option value="${shippingCostPaidBy.value()}" selected="">${shippingCostPaidBy.value()}</option>
                                    {{#  } else { }}
                                        <option value="${shippingCostPaidBy.value()}">${shippingCostPaidBy.value()}</option>
                                    {{#  } }}
                                </c:forEach>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- 编辑specific弹框 -->
<script type="text/html" id="publish_editspecific">
    <form id="ee_editspecificForm" class="layui-form">
        <div class="layui-row layui-col-space15">
                <div class="layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-header">ebay分类</div>
                            <div class="layui-card-body layui-row">
                                <div class="ebayCateDiv layui-col-lg12 layui-col-md12">
                                    <label class="layui-form-label">第一分类</label>
                                    <div class="layui-input-block">
                                        <button id="publish_ebayCateIdBtn1" type="button" class="layui-btn layui-btn-normal layui-btn-sm">选择ebay分类</button>
                                        <button id="publish_ebayCateSearch1" class="layui-btn layui-btn-primary layui-btn-sm" type="button">
                                            <i class="layui-icon layui-icon-search"></i>
                                        </button>
                                        <h4 id="publish_ebayCateText1" style="display: inline;"></h4>
                                    </div>
                                    <input id="publish_ebayCateId1" name="ebayCateId1" type="hidden">
                                </div>
                                <div class="ebayCateDiv layui-col-lg12 layui-col-md12">
                                    <label class="layui-form-label">第二分类</label>
                                    <div class="layui-input-block">
                                        <button id="publish_ebayCateIdBtn2" type="button" class="layui-btn layui-btn-normal layui-btn-sm">选择ebay分类</button>
                                        <button id="publish_ebayCateSearch2" class="layui-btn layui-btn-primary layui-btn-sm" type="button">
                                            <i class="layui-icon layui-icon-search"></i>
                                        </button>
                                        <h4 id="publish_ebayCateText2" style="display: inline;"></h4>
                                    </div>
                                    <input id="publish_ebayCateId2" name="ebayCateId2" type="hidden">
                                </div>
                            </div>
                        </div>
                    </div>
            <div class="layui-col-md12 ebayCateSpecifics">
                <div class="layui-card">
                    <div class="layui-card-header">分类属性信息</div>
                    <div class="layui-card-body layui-row">
                    </div>
                </div>
            </div>
            <div class="layui-col-md12 ebayCustomSpecifics">
                <div class="layui-card">
                    <div class="layui-card-header">自定义属性信息</div>
                    <div class="layui-card-body layui-row">
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label"></label>
                        <div class="layui-inline">
                            <button type="button" id="publish_addCustomAttr" class="layui-btn layui-btn-normal">添加自定义属性</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</script>
<script type="text/html" id="publish_ebayCateSearchTpl">
    <div class="p10">
        <form id="ebayPublish_cateSearchForm" class="layui-form">
            <input type="hidden" name="sourceBtnId">
            <div class="layui-form-item">
                <div class="layui-inline layui-col-md10">
                <label class="layui-form-label">关键字</label>
                    <div class="layui-input-block">
                        <input type="text" name="title" required="" lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline layui-col-md1">
                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm">搜索</button>
                </div>
            </div>
        </form>
        <table id="publish_ebayCateSearchTable"></table>
    </div>
</script>
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/html" id="ebayPulish_listSubTrTpl">
    {{#  layui.each(d, function(index, subSkuEbayDto){ }}
    <tr>
        <input type="hidden" name="id" value="{{subSkuEbayDto.id}}">
        <input type="hidden" name="tempVarietyId" value="{{subSkuEbayDto.tempVarietyId}}">
        <td>
            <div style="width: 60px;">
                <input type="hidden" name="imgUri" value="{{subSkuEbayDto.imgUri || ''}}">
                <img class="img_show_hide" width="60" height="60" src="{{subSkuEbayDto.imgUri}}" onerror="layui.admin.img_noFind()">
                <br>
                <!--<span id="ebayPublish_subSkuImg" style="cursor: pointer;color: #73a1bf;float: right;">修改</span>-->
                <div class="ebayPublish_subSkuImg_edit_local"></div>
                <div class="layui-btn layui-btn-primary layui-btn-sm ebayPublish_subSkuImg_edit_net"
                     onclick="ebayPublish_subSkuImg_exchangeNet(this)">网络图片</div>
            </div>
        </td>
        <td>{{subSkuEbayDto.storeSSku}}</td>
        {{#  layui.each(subSkuEbayDto.specificsArr, function(index, specificsItem){ }}
            <td>{{subSkuEbayDto[specificsItem]==='undefined'||subSkuEbayDto[specificsItem]===undefined ? '':subSkuEbayDto[specificsItem]}}</td>
        {{#  }) }}
        <td class="price"><input type="number" name="buyItNowPrice" value="{{subSkuEbayDto.buyItNowPrice}}" class="layui-input"></td>
        <td><input type="number" name="quantity" value="{{subSkuEbayDto.quantity}}" class="layui-input"></td>
        <td>
            {{#  if(subSkuEbayDto.upc){ }}
                {{subSkuEbayDto.upc}}
            {{#  } else { }}
                {{subSkuEbayDto.ean}}
            {{#  } }}
        </td>
        <td>
            {{#  if(subSkuEbayDto.isLockPrice){ }}
            <input type="checkbox" checked name="isLockPrice" lay-filter="ep_isLockPrice" lay-skin="switch" lay-text="是|否">
            {{#  } else { }}
            <input type="checkbox" name="isLockPrice" lay-filter="ep_isLockPrice" lay-skin="switch" lay-text="是|否">
            {{#  } }}
        </td>
        <td>
            {{#  if(subSkuEbayDto.isAttractSku){ }}
            <input type="checkbox" checked name="isAttractSku" lay-filter="ep_isAttractSku" lay-skin="switch" lay-text="是|否">
            {{#  } else { }}
            <input type="checkbox" name="isAttractSku" lay-filter="ep_isAttractSku" lay-skin="switch" lay-text="是|否">
            {{#  } }}
        </td>
        <td>
            <button type="button" onclick="ebayPulish_removeSkuBtn(this)" class="layui-btn layui-btn-sm layui-btn-danger">删除</button>
        </td>
    </tr>
    {{#  }); }}
</script>
<script src="${ctx}/static/js/publishs/ebay/publish.js"></script>
<script>
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function() {
        var formSelects = layui.formSelects;
        //属性多选
        formSelects.data('ebayPulish_selectAttr', 'local',{arr:[
            <c:forEach items="${logisAttrEnums}" var="logisAttrEnum">
                {name: '${logisAttrEnum.getName()}',value: '${logisAttrEnum.getName()}'},
            {name: '不含 ${logisAttrEnum.getName()}',value: 'no_${logisAttrEnum.getName()}'},
        </c:forEach>
        ]})
        //商品归属人多选
        formSelects.data('ebayPulish_selectMan','local',{arr:[
            <c:forEach items="${bizzOwners}" var="bizzOwner">
                {name: '${bizzOwner.userName}',value: '${bizzOwner.id}'},
        </c:forEach>
        ]})
    })
    //站点
    var ebayPublishSiteData = {};
    <c:forEach items = "${ebaySites}" var = "ebaySite" >
    siteId = ${ebaySite.getSiteId()};
    siteName = "${ebaySite.getSite().getSiteChineseName()}";
    ebayPublishSiteData[siteId] = siteName;
    </c:forEach>

    //当前登录人授权的店铺
    var ebayPublishStoreList = [];
    $.ajax({
        type:"post",
        url:ctx + "/sys/listuserstore.html?platCode=ebay",
        dataType:"json",
        success:function(returnData){
            if(returnData.code != "0000"){
                // console.error(returnData.msg);
                layer.msg(returnData.msg);
            }else{
                ebayPublishStoreList = returnData.data;
            }
        }
    });


    //初始化错误信息
    $(function(){
        $.ajax({
            type:"post",
            url:ctx + "/sys/listdict.html?headCode=EBAY_PUBLISH_FAIL_REASON",
            dataType:"json",
            success:function(returnData){
                if(returnData.code != "0000"){
                    // console.error(returnData.msg);
                    layer.msg(returnData.msg);
                }else{
                    var str = '<option value="">全部</value>';
                    for(var i=0; i<returnData.data.length; i++){
                        var dict = returnData.data[i];
                        str += '<option value="'+dict.code+'">'+dict.name+'</option>';
                    }
                    $("#eabyPublish_searchForm select[name=listingRespCode]").html(str);
                }
            }
        });

    });

</script>

<!--定时刊登-->
<script type="text/html" id="ebayPulish_listTimingTpl">
    <div class="p20">
        <form class="layui-form" action="" lay-filter="component-form-group">
            <div class="layui-form-item">
                <label class="layui-form-label">定时时间</label>
                <div class="layui-input-block">
                    <input class="layui-input" id="ebayPulish_listTiming"  name="listTiming">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">刊登间隔(分)</label>
                <div class="layui-input-block">
                    <input class="layui-input" type="number" name="listInterval">
                </div>
            </div>
        </form>
    </div>
</script>
<!--生成待刊登-->
<script type="text/html" id="ebayPulish_genListTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="ebayPulish_genListTpl_water">
        <div class="p20">
                <div class="layui-form-item">
                    <label class="layui-form-label">刊登数量</label>
                    <div class="layui-input-block">
                        <input class="layui-input" type="number" name="quantity" value="2">
                    </div>
                </div>
        </div>
        <div class="p20">
            <label class="layui-form-label">过滤停售子商品</label>
            <div class="layui-input-block">
                <input type="radio" name="isSale" value="true" title="是" checked>
                <input type="radio" name="isSale" value="" title="否">
            </div>
        </div>
        <div class="p20">
            <label class="layui-form-label">图片水印</label>
            <div class="layui-input-block">
                <select name="watermarkImage" lay-filter="ebayPublish_search-watermarkImage" lay-search="" >
                    <option value="">全部</option>
                </select>
            </div>
        </div>
        <div class="p20">
            <label class="layui-form-label">文字水印</label>
            <div class="layui-input-block">
                <select name="watermarkFont"  lay-filter="ebayPublish_search-watermarkFont" lay-search="" >
                    <option value="">全部</option>
                </select>
            </div>
        </div>
        <div class="p20">
            <div class="layui-form-item">
                <label class="layui-form-label">开启引流价</label>
                <div class="layui-input-block">
                    <input type="checkbox" checked="" name="allowAttract" lay-skin="switch"  lay-text="开启|关闭">
                </div>
            </div>
        </div>
   </form>
</script>
<!--测算刊登费-->
<script type="text/html" id="ebayPulish_verifyListingFeeTpl">
    <div style="margin:20px">
        <form class="layui-form layui-form-pane">
            <div class="layui-form-item">
                {{#  if(d.success){ }}
                    <hr class="layui-bg-green">
                        <h3 style="color: green">检验成功，可以发布</h3>
                    <hr class="layui-bg-green">
                {{#  } else { }}
                    <hr class="layui-bg-orange">
                        <h3 style="color:orange">检验失败.请检查你所填的各项内容或联系客服人员.</h3>
                    <hr class="layui-bg-orange">
                {{#  } }}
            </div>
            {{#  if(d.success){ }}
                <div class="layui-form-item">
                    <div>
                        <label class="layui-form-label">总费用</label>
                        <div class="layui-input-block">
                            <input readonly class="layui-input" value="{{'$'+d.listingFee}}">
                        </div>
                    </div>
                    <div>
                        <label class="layui-form-label">InsertionFee</label>
                        <div class="layui-input-block">
                            <input readonly class="layui-input" value="{{'$'+d.insertionFee}}">
                        </div>
                    </div>
                </div>
            {{#  } }}

            {{#  if(d.errors.length>0){ }}
                <div class="layui-form-item">
                    <hr class="layui-bg-orange">
                        <h3>以下错误信息，影响您的商品刊登</h3>
                    <hr class="layui-bg-orange">
                </div>
                {{#  layui.each(d.errors, function(index, error){ }}
                <div class="layui-form-item">
                    <div>
                        <label class="layui-form-label">错误代码</label>
                        <div class="layui-input-block">
                            <input readonly class="layui-input" value="{{error.errorCode}}">
                        </div>
                    </div>
                    <div>
                        <label class="layui-form-label">错误标题</label>
                        <div class="layui-input-block">
                            <input readonly class="layui-input" value="{{error.shortMsg}}">
                        </div>
                    </div>
                    <div>
                        <label class="layui-form-label">错误详细</label>
                        <div class="layui-input-block">
                            <textarea readonly class="layui-textarea">{{error.longMsg}}</textarea>
                        </div>
                    </div>
                </div>
                {{#  }); }}
            {{#  } }}

            {{#  if(d.warnings.length>0){ }}
                <div class="layui-form-item">
                    <hr class="layui-bg-orange">
                        <h3>以下提示信息，不会影响您的商品刊登</h3>
                    <hr class="layui-bg-orange">
                </div>
                {{#  layui.each(d.warnings, function(index, warning){ }}
                <div class="layui-form-item">
                    <div>
                        <label class="layui-form-label">错误代码</label>
                        <div class="layui-input-block">
                            <input readonly class="layui-input" value="{{warning.errorCode}}">
                        </div>
                    </div>
                    <div>
                        <label class="layui-form-label">错误标题</label>
                        <div class="layui-input-block">
                            <input readonly class="layui-input" value="{{warning.shortMsg}}">
                        </div>
                    </div>
                    <div>
                        <label class="layui-form-label">错误详细</label>
                        <div class="layui-input-block">
                            <textarea readonly class="layui-textarea">{{warning.longMsg}}</textarea>
                        </div>
                    </div>
                </div>
                {{#  }); }}
            {{#  } }}
        </form>
    </div>
</script>
<%-- 刊登风格弹框 --%>
<script type='text/html' id="ebayPublish_selStyleLayer">
   <div>
        <div class="ebayPublishStyleLeftBar">
        </div>
        <div class="ebayPublishStyleRightTem">
            <ul>
            </ul>
        </div>
   </div>
</script>

<!--复制模板表格相关tpl-->
<!--sku-->
<script type='text/html' id="ebayPublish_lcSkuTpl">

</script>

<script type='text/html' id="ebayPublish_listingModeTpl">
    <form class="layui-form p20" >
        <div class="layui-form-item">
            <label class="layui-form-label">刊登方式:</label>
            <div class="layui-input-block">
              <input type="radio" name="listingMode" value="0" title="批量刊登" >
              <input type="radio" name="listingMode" value="1" title="手动刊登" checked>
            </div>
        </div>
    </form>
</script>

<%--待刊登生成--%>
<script type="text/html" id="ebayPulish_info_add_water">
    <form class="layui-form" action="" lay-filter="component-form-group" id="ebayPulish_info_water">
        <div class="p20">
            <label class="layui-form-label">图片水印</label>
            <div class="layui-input-block">
                <select name="watermarkImage" lay-filter="ebayPublish_search-watermarkImage" lay-search="" >
                    <option value="">全部</option>
                </select>
            </div>
        </div>
        <div class="p20">
            <label class="layui-form-label">文字水印</label>
            <div class="layui-input-block">
                <select name="watermarkFont"  lay-filter="ebayPublish_search-watermarkFont" lay-search="" >
                    <option value="">全部</option>
                </select>
            </div>
        </div>
    </form>
</script>
<script type="text/html" id="ebayPulish_genAuctionListTpl">
    <form class="layui-form" action="" lay-search lay-filter="component-form-group">
        <div class="p20">
            <div class="layui-form-item layui-row">
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">刊登天数</label>
                    <div class="layui-input-block">
                        <select name="listingDuration">
                            <c:forEach items="${listingDurations}" var="listingDuration">
                                <option value="${listingDuration.value()}">${listingDuration.name()}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">一口价的</label>
                    <div class="layui-input-block">
                        <select name="listingDuration">
                            <c:forEach items="${listingDurations}" var="listingDuration">
                                <option value="${listingDuration.value()}">${listingDuration.name()}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">刊登天数</label>
                    <div class="layui-input-block">
                        <select name="listingDuration">
                            <c:forEach items="${listingDurations}" var="listingDuration">
                                <option value="${listingDuration.value()}">${listingDuration.name()}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">刊登天数</label>
                    <div class="layui-input-block">
                        <select name="listingDuration">
                            <c:forEach items="${listingDurations}" var="listingDuration">
                                <option value="${listingDuration.value()}">${listingDuration.name()}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </form>
</script>
<!--specifics td模板-->
<script type="text/html" id="ep_specificsThTpl">
    <th width="100" class="specificsField">
        <input name="specifics" value=":key" class="layui-input">
        <i class="layui-icon delSpecificsBtn">&#xe640;</i>
    </th>
</script>
<script>
    function expandAll(dom){
        var status = dom.attr('data-index')
        if(status==="expand"){
            dom.parents('td').find('.expandrow').removeClass('hide')
            dom.find('span').text('收起-')
            dom.attr('data-index','close')
        }else if(status==="close"){
            dom.parents('td').find('.expandrow').addClass('hide')
            dom.find('span').text('展开+')
            dom.attr('data-index','expand')
        }
    }

    function expandStr(dom){
        var status = dom.attr('data-index')
        if(status==="expand"){
            dom.siblings('.compeleteStr').removeClass('hide')
            dom.siblings('.shortStr').addClass('hide')
            dom.text('[收起]')
            dom.attr('data-index','close')
        }else if(status==="close"){
            dom.siblings('.shortStr').removeClass('hide')
            dom.siblings('.compeleteStr').addClass('hide')
            dom.text('[展开]')
            dom.attr('data-index','expand')
        }
    }
</script>
<!-- 导出SKU映射 -->
<script  type="text/html" id="ebayPublish_exportsku_modal">
 <div class="p20">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" action="" id='ebayPublish_exportsku_modal_form' lay-filter="ebayPublish_exportsku_modal_form">
                <div class="layui-form-item ml10">
                    <div>
                        <input type="radio" name='exportType' lay-filter="ebayPublish_exportsku_modal_form_radio" value="1" title='列表勾选导出'>
                    </div>
                    <div>
                        <input type="radio" name='exportType' lay-filter="ebayPublish_exportsku_modal_form_radio" value="2" title='根据下面条件导出'>
                    </div>
                </div>
                <div id='ebayPublish_exportsku_modal_form_hide_show'>
                    <div class="layui-form-item">
                        <label class="layui-form-label">部门</label>
                        <div class="layui-input-block">
                            <select name="exportorgId" lay-filter="sss" class="orgs_hp_custom" id='ebayPublish_exportsku_ep_orgFilter'>
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">销售员</label>
                        <div class="layui-input-block">
                            <select name="exportsalePersonId"  class="users_hp_custom" data-rolelist="ebay专员" lay-filter="ep_sellerFilter_exportsku" lay-search="">
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label"><font color='red'>*</font>店铺名</label>
                        <div class="layui-input-block">
                            <textarea name="storeAcctNameStr" class="layui-textarea" id="ebayPublish_exportsku_modal_stores" placeholder="多值换行分隔"></textarea>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label w90" style="padding-right: 0px;"><font color='red'>*</font>刊登创建时间</label>
                        <div class="layui-input-block">
                            <input name='listingDate' type="text" id='ebayPublish_exportsku_modal_date' class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label"><font color='red'>*</font>刊登状态</label>
                        <div class="layui-input-block">
                            <input type="radio" name='listingStatus' value="3" title='刊登中' >
                            <input type="radio" name='listingStatus' value="1" title='刊登成功' >
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
 </div>
</script>

<!-- ebay刊登表格辅图展示 -->
<script type="text/html" id="ebayPublish_subSkuImg_detailLayer">
  <div class="subSkuImgContainer">
    <div class="subSkuImgContainer-left">
      <div>变种图片</div>
      <div>(<span id="subSkuImgLeftPublishImgNum">0</span> / <span class="subSkuImgLeftImgNumTotal">1</span>)</div>
    </div>
    <div class="subSkuImgContainer-right">
      <div>
        <span class="layui-btn layui-btn-sm" id="subSkuImg_container_localUpload">本地上传</span>
        <span class="layui-btn layui-btn-sm layui-btn-primary" id="subSkuImg_container_networkUpload">网络图片</span>
        <button type="button" class="layui-btn layui-btn-sm" id="ebayMainImgAddWatermark" onclick="ebay_publish_addSubImgByTpl(this)">模板图片</button>
      </div>
      <div class="subSkuImgContainer-right-middle">
        <i style="background:red;color:#fff">说明: </i>
          点击图片拖动，即可调整图片顺序！
      </div>
      <!-- 辅图容器 -->
      <div class="auxiliary-ebaySubSkuImgs" id="publish-auxiliary-ebaySubSkuImgs">
      </div>
    </div>
  </div>
</script>

<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>