<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<link rel="stylesheet" href="${ctx}/static/Huploadify/Huploadify.css" media="all">
<title>ebay在线商品</title>
<style>
    #ebay_online_searchForm .showExternal {
        border: 1px solid #1E9FFF!important;
    }
    #ebay_online_searchForm .externalContain_ebayOnline {
        position: relative;
        width: 0;
        float: left;
        height: 0;
        z-index: 20190918;
    }
    #ebay_online_searchForm .externalPop-ebayOnline {
        clear: left;
        position: relative;
        left: -36vw;
        top: 40px;
        width: 35vw;
        min-height: 250px;
        border: 1px solid #e6e6e6;
        background-color: lightyellow;
        padding: 20px 10px;
        border-radius: 5px;
        box-shadow: 1px 1px 1px grey;
    }
    #showMoreSearchCondition_ebayOnline{
        width: auto;
    }
    a.itemId {
        color: #428bca;
    }

    table.colspantable td {
        border: 0px;
    }

    span.squareSpan {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-color: green;
        color: #fff;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
        border-radius: 4px;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .dis_flex_around {
        display: flex;
        justify-content: space-around;
    }
    .flex{
        display: flex;
        align-items: center;
    }

    .hide {
        display: none;
    }

    a.productListSkuShow {
        color: #428bca;
    }

    #ebay_online_isEnableForm .layui-form-select dl {
        max-height: 600px
    }

    #ebay_onlilne_product .layui-tab-title {
        height: 41px !important;
    }

    #ebay_onlilne_product .layui-tab-content {
        padding: 0;
    }

    .update_sellerNote {
        color: #009688;
        cursor: pointer;
    }

    #ebay_onlineproduct_pageSort {
        position: fixed;
        left: 100px;
        bottom: 0;
        background: #fff;
        display: block;
        width: 100%;
    }

    .mg_20 {
        margin: 20px;
    }

    .dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .dis_flex_col {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
    }

    #ebay_onlilne_product .layui-btn+.layui-btn {
        margin-left: 0 !important;
    }

    .mb {
        margin-bottom: 5px;
    }

    #ebayOnlineproduct_listDetailForm .imageLeft {
        width: 260px;
        height: 260px;
        margin-right: 20px;
        float: left;
        margin-top: 5px;
        border: 1px solid #ccc;
    }

    #ebayOnlineproduct_listDetailForm .imageRight {
        width: 150px;
        display: inline-block;
        border: 1px solid #ccc;
        margin: 0 5px 5px 0;
    }

    #ebayOnlineproduct_listDetailForm .imageRight span {
        cursor: pointer;
        color: #73a1bf;
    }

    #ebayOnlineproduct_listDetailForm .imageRight .removeEbayImg {
        float: right;
    }

    /*eBay属性列 css*/
    .specificsField input {
        display: inline-block;
        width: 80%;
    }

    .specificsField i {
        color: red;
        cursor: pointer;
        display: none;
    }

    .specificsField:hover i {
        color: red;
        cursor: pointer;
        display: inline;
    }

    .specificsFieldPicture input {
        border-color: green;
    }
    #ebayOnlineproduct_subSkuImg_detailLayerId .subSkuImgContainer {
      display: flex;
      margin: 20px;
    }
    #ebayOnlineproduct_subSkuImg_detailLayerId .subSkuImgContainer-left {
      padding-right:30px;
      margin-top: 40px;
      width: 100px;
      text-align: center;
    }
    #ebayOnlineproduct_subSkuImg_detailLayerId .subSkuImgContainer-right-middle {
      margin: 10px 5px;
    }
    .auxiliary-ebaySubSkuImgs {
      display: flex;
      flex-wrap: wrap;
    }
    .auxiliary-ebaySubSkuImgs>div {
      margin: 5px 10px;
    }
    #ebayOnline_SubSkuInfo_body .subImgNum {
      position: absolute;
      bottom: 22px;
      left: 0;
      display: inline-block;
      width: 60px;
      height: 30px;
      background: #6d503d;
      opacity: 0.6;
      text-align: center;
      color: #f00;
      font-weight: 700;
      line-height: 30px;
      font-size: 20px;
    }
    .mx-10{
        margin: 0 10px;
    }
    .w-100{
        width: 100px;
    }
</style>
<div class="layui-fluid" id="ebay_onlilne_product">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" lay-filter="ebay_online_searchForm" id="ebay_online_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="ebay_online_depart_sel1" lay-search lay-filter="ebay_online_depart_sel1"
                                        class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="ebay_online_salesman_sel" lay-search
                                        lay-filter="ebay_online_salesman_sel" class="users_hp_custom"
                                        data-rolelist="ebay专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="ebay_online_store_sel" lay-filter="ebay_online_store_sel"
                                        xm-select="ebay_online_store_sel" class="users_hp_store_multi" xm-select-search
                                        xm-select-search-type="dl" xm-select-skin="normal" data-platcode="ebay"
                                        name="ebay_online_store_sel_name"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select id="ebay_online_site_sel" lay-filter="ebay_online_site_sel"
                                        xm-select="ebay_online_site_sel" class="salesSite_hp_custom" xm-select-search
                                        xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品类型</label>
                                <div class="layui-input-block">
                                    <select name="" id="ebay_online_producttype_sel"
                                        lay-filter="ebay_online_producttype_sel">
                                        <option value=""></option>
                                        <option value="0">单属性</option>
                                        <option value="1">多属性</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">物品号</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" autocomplete="off" id="ebay_online_itemId">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">在线数量</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <select id="ebay_noline_quantitytype_sel" lay-search>
                                            <option value="1">小于</option>
                                            <option value="0">等于</option>
                                            <option value="2">大于</option>
                                        </select>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input" autocomplete="off"
                                            id="ebay_online_quantity">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销量</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <select id="ebay_noline_soldnumtype_sel" lay-search>
                                            <option value="1">小于</option>
                                            <option value="0">等于</option>
                                            <option value="2">大于</option>
                                        </select>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input" autocomplete="off"
                                            id="ebay_online_soldnum">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">价格</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" id="ebay_online_priceStart_text" autocomplete="off"
                                            class="layui-input inputBorRadLeft">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" id="ebay_online_priceEnd_text" autocomplete="off"
                                            class="layui-input inputRad">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="" id="ebay_online_listtime_sel" lay-search>
                                        <option value="1">刊登时间</option>
                                        <option value="2">结束时间</option>
                                        <option value="3">优化时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" id="ebay_online_listtime">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">备货天数</label>
                                <div class="layui-input-block">
                                    <input type="number" class="layui-input" autocomplete="off"
                                        id="ebay_online_dispatch_time_max" placeholder="备货天数">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="" id="ebay_online_sortdesc_sel" lay-search>
                                        <option value=""></option>
                                        <option value="p.listing_start_time asc">开始时间升序</option>
                                        <option value="p.listing_start_time desc">开始时间降序</option>
                                        <option value="p.listing_end_time asc">结束时间升序</option>
                                        <option value="p.listing_end_time desc">结束时间降序</option>
                                        <option value="extra.quantity asc">在线数量升序</option>
                                        <option value="extra.quantity desc">在线数量降序</option>
                                        <option value="p.sold_nums asc">卖出数量升序</option>
                                        <option value="p.sold_nums desc">卖出数量降序</option>
                                        <option value="p.sold_nums_time asc">最后售出时间升序</option>
                                        <option value="p.sold_nums_time desc">最后售出时间降序</option>
                                        <option value="e.four_week_count asc">优化后效果升序</option>
                                        <option value="e.four_week_count desc">优化后效果降序</option>
                                        <option value="d.bid_percentage desc">按照广告费率降序</option>
                                        <option value="d.bid_percentage asc">按照广告费率升序</option>
                                        <option value="MAX(s.price)">当前价格升序</option>
                                        <option value="MAX(s.price) desc">当前价格降序</option>
                                        <option value="salesCount.seven_sales DESC">7日销量降序</option>
                                        <option value="salesCount.thirty_sales DESC">30日销量降序</option>
                                        <option value="feedback.total_comment_num DESC">总评数倒序</option>
                                        <option value="feedback.total_comment_num ASC">总评数正序</option>
                                        <option value="feedback.negative_comment_num DESC">差评数倒序</option>
                                        <option value="feedback.negative_comment_num ASC">差评数正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="ebay_online_searchtype_sel" id="ebay_online_searchtype_sel" lay-search>
                                        <option value="prodPSKu">商品父sku</option>
                                        <option value="prodSSku">商品子sku</option>
                                        <option value="storePSku">店铺父sku</option>
                                        <option value="storeSSku">店铺子sku</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off"
                                        id="ebay_online_searchtype_input" placeholder="搜索类型">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select id="ebay_online_title_search_type">
                                        <option value="0">刊登标题(分词全模糊)</option>
                                        <option value="1">刊登标题(常规模糊)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" id="ebay_online_title"
                                        placeholder="刊登标题">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select id="ebay_online_location_search_type" lay-search>
                                        <option value="1">country</option>
                                        <option value="2">location</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off"
                                        id="ebay_online_location_text" placeholder="">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select id="ebay_online_logistics_search_type">
                                        <option value="1">物流属性与</option>
                                        <option value="2">物流属性或</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select id="ebay_online_logistics_sel" xm-select="ebay_online_logistics_sel"
                                        xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select id="ebay_online_productLabel_sel" lay-search
                                        lay-filter="ebay_online_productLabel_sel"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="ebay_online_searchtype_sel" id="ebay_online_logisticsType_sel">
                                        <option value="1">境内物流1</option>
                                        <option value="2">境外物流1</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off"
                                        id="ebay_online_logisticsType_input" placeholder="手动输入店铺物流方式">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label">刊登方式</div>
                                <div class="layui-input-block">
                                    <select id="ebay_online_lisitingMethod_sel" lay-search>
                                        <option value="">请选择</option>
                                        <option value="0">系统刊登</option>
                                        <option value="1">人工刊登</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select id="ebay_online_productStatus" lay-search xm-select="ebay_online_productStatus" lay-filter="ebay_online_productStatus">
                                        <option value=""></option>
                                        <option value="-1">无映射</option>
                                        <option value="2">在售</option>
                                        <option value="1">部分在售</option>
                                        <option value="0">全部停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">账号类型</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="ebay_online_Account_type" lay-filter="ebay_online_Account_type"
                                        xm-select="ebay_online_Account_type" class="users_hp_store_multi" xm-select-search
                                        xm-select-search-type="dl" xm-select-skin="normal" data-platcode="ebay"
                                        name="ebay_online_Account_type_name"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销量</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" id="ebay_online_pSoldNumsStart" autocomplete="off" min="0"
                                            class="layui-input inputBorRadLeft" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" id="ebay_online_pSoldNumsEnd" autocomplete="off" min="0"
                                            class="layui-input inputRad" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" style="height: 36px;">
                                <label class="layui-form-label">指定天数内未售出</label>
                                <div class="layui-input-block">
                                    <input style="border-right:1px solid #e6e6e6;" type="number" id="ebay_online_notSoldDays" autocomplete="off" min="0"
                                        class="layui-input inputBorRadLeft" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                        onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="devTypes" xm-select="devTypes_ebay_online" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"
                                            lay-filter='devTypes_ebay_online' id="devTypes_ebay_online">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding:0;text-align: right;width: 110px;">
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
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">禁售平台</label>
                                <div class="layui-input-block">
                                    <select  name="prohibitPlat" id="ebayOnline_prohibitPlat" lay-filter="ebayOnline_prohibitPlat">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">禁售站点</label>
                                <div class="layui-input-block">
                                    <select  name="prohibitSalesSiteIdStr"
                                            xm-select="ebayOnline_prohibitSalesSiteId" xm-select-search xm-select-skin="normal"
                                            xm-select-search-type="dl">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="tortPlat" xm-select="ebayOnline_tortPlat" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="externalBox" id="showMoreSearchCondition_ebayOnline" style="margin-left: 10px">
                                    <span id="moreSearch_ebayOnline_text">更多查询条件</span>
                                    <span id="hide_icon_ebayOnline" class="fr mr10 disN">︽</span>
                                    <span id="show_icon_ebayOnline" class="fr mr10">︾</span>
                                </div>
                            </div>
                            <div class="externalContain_ebayOnline disN">
                                <div class="externalPop-ebayOnline">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">刊登类型</label>
                                            <div class="layui-input-block">
                                                <select name="" id="ebay_online_listtype_sel" lay-filter="ebay_online_listtype_sel">
                                                    <option value=""></option>
                                                    <option value="1">拍卖</option>
                                                    <option value="2">一口价</option>
                                                    <option value="3">非GTC一口价</option>
                                                    <option value="4">GTC</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">副标题</label>
                                            <div class="layui-input-block">
                                                <select name="" id="ebay_online_subtile_sel" lay-filter="ebay_online_subtile_sel">
                                                    <option value=""></option>
                                                    <option value="1">有</option>
                                                    <option value="0">无</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">best offer</label>
                                            <div class="layui-input-block">
                                                <select name="" id="ebay_online_bestoffer_sel"
                                                    lay-filter="ebay_online_bestoffer_sel">
                                                    <option value=""></option>
                                                    <option value="1">开启</option>
                                                    <option value="0">未开启</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">退货时间</label>
                                            <div class="layui-input-block">
                                                <select name="" id="ebay_online_returnback_sel" lay-search>
                                                    <option value=""></option>
                                                    <option value="Days_3">3天</option>
                                                    <option value="Days_7">7天</option>
                                                    <option value="Days_14">14天</option>
                                                    <option value="Days_30">30天</option>
                                                    <option value="Months_1">1个月</option>
                                                    <option value="Days_60">60天</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">促销2.0</label>
                                            <div class="layui-input-block">
                                                <select style="width: 200px" id="ebay_online_marketing_promotion_sel" name="ebay_online_marketing_promotion_sel"
                                                 lay-filter="ebay_online_marketing_promotion_sel"
                                                    id="ebay_online_marketing_promotion_sel" lay-search></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md1 layui-col-lg1">
                                            <div style="margin-left: 20px;margin-top: 5px;cursor: pointer;">
                                                <i id="syncIcon" class="layui-icon layui-icon-refresh-3"></i> 
                                            </div>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">调价模板</label>
                                            <div class="layui-input-block">
                                                <select name="ruleId" id="ebay_online_ruleId" lay-search></select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md10 layui-col-lg10">
                                            <label class="layui-form-label">ebay第一分类</label>
                                            <div class="layui-input-block">
                                                <input class="layui-input" autocomplete="off" id="ebay_online_ebayCategory1"
                                                    placeholder="分类ID,多值空格分隔">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <div class="ml10">
                                                <input type="checkbox" name="ebayCategory1Type" title="反选" lay-skin="primary">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md10 layui-col-lg10">
                                            <label class="layui-form-label">ebay第二分类</label>
                                            <div class="layui-input-block">
                                                <input class="layui-input" autocomplete="off" id="ebay_online_ebayCategory2"
                                                    placeholder="分类ID,多值空格分隔">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <div class="ml10">
                                                <input type="checkbox" name="ebayCategory2Type" title="反选" lay-skin="primary" class="ml10">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <label class="layui-form-label">刊登人</label>
                                        <div class="layui-input-block">
                                            <select name="listingBySystem" id="ebay_online_listing_creator" lay-filter="ebay_online_listing_creator">
                                                <option value=""></option>
                                                <option value="true">系统刊登</option>
                                                <option value="false">手动刊登</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <div class="layui-form-label" style="padding:0;text-align: right;width: 110px;margin-left: 45px;">
                                            <select name="weightType">
                                                <option value="1">重量(部分属性)</option>
                                                <option value="2">重量(全部属性)</option>
                                            </select>
                                        </div>
                                        <div class="layui-input-block disflex">
                                            <input type="number" id="ebay_online_minWeight_text" class="layui-input inputBorRadLeft" name="minWeight" style="width: 80px;" placeholder="g" >
                                            <input type="number" id="ebay_online_maxWeight_text" class="layui-input" name="maxWeight" style="width: 80px;" placeholder="g">
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">境内物流1运费</label>
                                            <div class="layui-input-block flex">
                                                <input type="number" class="layui-input w-100" onblur="changeIntShippingSrv1Cost(event)" lay-verify="decimal" autocomplete="off" id="shippingSrv1CostMin"
                                                    placeholder="≥">
                                                    <span class="mx-10">-</span>
                                                <input type="number" class="layui-input w-100" onblur="changeIntShippingSrv1Cost(event)" lay-verify="decimal" autocomplete="off" id="shippingSrv1CostMax"
                                                placeholder="≤">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1 fr">
                                <button type="button" class="layui-btn layui-btn-sm keyHandle"
                                    id="ebay_online_search_submit">查询</button>
                                <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary ml10"
                                    id="ebay_online_search_reset">清空</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
            <div class="layui-card" id="ebayOnlineCard">
                <div class="layui-tab" lay-filter="ebay_online_tab_filter">
                    <div class="layui-card-header toFixedContain">
                        <ul class="layui-tab-title">
                            <li class="layui-this" isOffline="0" title="点击统计在线数量">在线(<span
                                    id="ebay_online_online_num_span"></span>)</li>
                            <li isOffline="1" title="点击统计下线数量">下线(<span id="ebay_online_offline_num_span"></span>)</li>
                        </ul>
                        <div style="position:absolute;right:13px;top:-3px;">
                            <button type="button" class="layui-btn layui-btn-sm"
                                onclick="expandAll('ebayOnlineCard')">展开所有</button>
                            <button type="button" class="layui-btn layui-btn-sm"
                                onclick="PackUpAll('ebayOnlineCard')">收起所有</button>
                            <button type="button" class="layui-btn layui-btn-sm"
                                id="ebay_onlilne_export_btn">导出</button>
                            <div style="display: inline-block;" class="layui-form">
                                <select id="ebay_online_tagsOperate_sel" lay-filter="ebay_online_tagsOperate_sel">
                                    <option value="">批量打标签</option>
                                </select>
                            </div>
                            <div class="layui-input-inline">
                                <form id="ebay_online_isEnableForm" class="layui-form">
                                    <select name="isEnableSel" id="ebay_online_isEnableSel"
                                        lay-filter="ebay_online_isEnableSel">
                                        <option value="" data-link="" data-title="">批量操作</option>
                                        <permTag:perm funcCode="batch_update_ebay">
                                            <option value="0" data-link="" data-title="">批量更新</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="stop_publish_ebay">
                                            <option value="1" data-link="route/iframe/ebay/stopPublish"
                                                data-title="终止刊登">终止刊登</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="modify_stock_ebay">
                                            <option value="2" data-link="route/iframe/ebay/modifyStock"
                                                data-title="调整库存">调整库存</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="adjust_price_ebay">
                                            <option value="3" data-link="route/iframe/ebay/adjustPriceProcess"
                                                data-title="调整价格">调整价格</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="tort_listing_ebay">
                                            <option value="4" data-link="route/iframe/ebay/tortListing"
                                                data-title="侵权listing处理">侵权listing处理</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="modify_mian_title_ebay">
                                            <option value="5" data-link="route/iframe/ebay/modifyMainTitle"
                                                data-title="修改标题">修改标题</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="modify_mian_subtitle_ebay">
                                            <option value="6" data-link="route/iframe/ebay/modifyMainSubtitle"
                                                data-title="修改副标题">修改副标题</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="replace_window_ebay">
                                            <option value="7" data-link="route/iframe/ebay/replaceWindowMap"
                                                data-title="替换橱窗图">替换橱窗图</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="application_commonmodule_ebay">
                                            <option value="8" data-link="route/iframe/ebay/applicationCommonModule"
                                                data-title="应用公共模块">应用公共模块</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="modifyspecific">
                                            <option value="10" data-link="route/iframe/ebay/modifyspecific"
                                                data-title="修改specifics">修改specifics</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="modifydiscription">
                                            <option value="11" data-link="route/iframe/ebay/modifydiscription"
                                                data-title="修改描述">修改描述</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="modifySku">
                                            <option value="12" data-link="route/iframe/ebay/modifySku"
                                                data-title="修改多属性信息">修改多属性信息</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="addandRemovePromotion">
                                            <option value="13" data-link="route/iframe/ebay/addandRemovePromotion"
                                                data-title="添加/修改促销1.0">添加/修改促销1.0</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="setAchievementSaleperson">
                                            <option value="14" data-link="route/iframe/ebay/setAchievementSaleperson"
                                                data-title="设置开发专员销售">设置开发专员销售</option>
                                        </permTag:perm>
                                        <permTag:perm funcCode="generateAuction">
                                            <option value="15" data-link="route/iframe/ebay/genauctionModel"
                                                data-title="刊登拍卖">刊登拍卖</option>
                                        </permTag:perm>
                                    </select>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="layui-card-body">
                        <div class="layui-tab-content checkbox-group" style="padding:10px;">
                            <div class="layui-form">
                                <form id="ebay_online_marks_form">
                                    <input type="checkbox" value="" lay-skin="primary" title="全部"
                                        lay-filter="ebayonline_marksCheck">
                                </form>
                                <div style="position: absolute;top: 0;right: 0;" class="layui-form" id="ebayOnPro_displayAccurateCount">
                                    <input type="checkbox" name="ebayOnPro_accurateCount" lay-skin="primary" title="统计总数" lay-filter="ebayonline_marksCheck" >
                                </div>
                            </div>
                        </div>
                        <div class="layui-tab-content">
                            <table class="layui-table" id="ebay_online_data_table" lay-filter="ebay_online_data_table">
                            </table>
                        </div>
                        <div id="ebay_onlineproduct_pageSort"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="ebay_online_pImgs_tpl">
            <div class="imgDiv" style="margin-right:0px;">
                <div>
                    {{# if(d.firstImage != null){ }}
                    <img class="img_show_hide lazy b1" data-original="{{d.firstImage}}" width="60" height="60" data-onerror="layui.admin.img_noFind()"> {{# } }}
                </div>
            </div>
        </script>
<script type="text/html" id="ebay_online_title_tpl">
            <div style="text-align: left; font-size: 12px;">
                <div>
                    {{# if(d.listingType != 'FIXED_PRICE_ITEM') { }}
                        <span style="float: right!important;">&nbsp;
                            <span class="squareSpan" style="background-color:#ff8345;">拍</span>
                            {{# if(d.bidCount != null && d.bidCount > 0){ }}
                                <span style="color: #999;" title="出价次数({{d.bidCount}})">({{d.bidCount}})</span>
                            {{# }}}
                         </span>
                    {{# }}}
                    {{d.title || ''}}
                    {{# layui.each(d.marksSet, function(index, item){ }}
                        {{# if(item&&item.indexOf('调价完成')==-1){ }}
                        <span class="hp-badge layui-bg-blue fr" title="{{item}}">{{item.substring(0,1)}}</span>
                     {{# }}}
                    {{# }); }}
                </div>
                <div style="color: #999;">
                        <a class="itemId" target="_blank" href="{{d.seoViewUrl}}">{{d.itemId || ''}}</a>
                        <span onclick="layui.admin.onlyCopyTxt('{{d.itemId}}')" style="display: {{d.itemId ? 'inline-block':'none'}}; cursor:pointer">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                    [ {{d.storeAcct || ''}} ] &nbsp; [ {{ d.site}} ]  &nbsp; [ {{ d.salesperson}} ]
                </div>
                <div>  country : <span style="color: #999;">{{ d.country||'' }}</span>
                    &nbsp;&nbsp;&nbsp;&nbsp; location : <span style="color: #999;"> {{ d.location || '' }}</span>
                </div>
                <div>备货天数: <span style="color: #999;">{{ d.dispatchTimeMax||'' }}</span></div>
            </div>
        </script>
<script type="text/html" id="ebay_online_storePSku_tpl">
            <div style="text-align: left;font-size: 12px;">
                {{d.storePSku || ''}}</br>
                <div style="color: #999;" title="对应的基础商品sku"> [
                        <a>{{d.prodPSku || ''}}</a>
                        <span onclick="layui.admin.onlyCopyTxt('{{d.prodPSku}}')" style="display: {{d.prodPSku ? 'inline-block':'none'}}; cursor:pointer">
                            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                        </span>
                      ]</div>
            </div>
        </script>
<script type="text/html" id="ebay_online_storeSSku_tpl">
            <table class="layui-table colspantable" style="width: 460px;margin-left: -5px;">
                {{# layui.each(d.prodSyncSEbayDtos, function(index, item){ }}
                {{# if(index<1){ }}
                    {{# if(index==d.prodSyncSEbayDtos.length-1){ }}
                        <tr style="">
                    {{# }else{ }}
                        <tr style="border-bottom: 1px solid #e6e6e6 !important">
                    {{# } }}
                {{# }else{ }}
                    {{# if(index == d.prodSyncSEbayDtos.length-1){ }}
                        <tr style="display: none;" class="myj-hide">
                    {{# }else{ }}
                        <tr style="border-bottom: 1px solid #e6e6e6 !important;display: none;" class="myj-hide">
                    {{# } }}
                {{# } }}
                                <td style="width:100px;text-align: left;padding-left: 5px;color: #000;font-size: 12px;">
                                    {{item.storeSSku}} {{# if(item.isAdjust){ }}
                                    <span class="hp-badge layui-bg-blue fr" title="待调价">调</span> {{# } }} {{# if(item.profitType ==1){ }}
                                    <span class="hp-badge layui-bg-blue fr" title="虚拟仓<15%毛利率">虚</span> {{# } }} {{# if(item.profitType ==2){ }}
                                    <span class="hp-badge layui-bg-blue fr" title="国内仓<10%毛利率">国</span> {{# } }}{{# if(item.autoModifyPriceMark > 0){ }}
                                    <span class="hp-badge layui-bg-red fr ebay_online_autoModifyPriceMark" data-ruledata='{{item.ruleData}}' title="调价模板">价</span> {{# } }}
                                    <br/>
                                    <div style="color: #999;" title="对应的基础子商品sku"> [
                                         <!-- {{item.prodSSku || ''}} -->
                                            <a>{{item.prodSSku || ''}}</a>
                                            <span onclick="layui.admin.onlyCopyTxt('{{item.prodSSku}}')" style="display: {{item.prodSSku ? 'inline-block':'none'}}; cursor:pointer">
                                                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                                            </span>
                                         ]</div>
                                </td>
                                <td class="layui-table-cell" style="width:80px;text-align: left;padding-left: 5px;font-size: 12px;">
                                    <div>{{item.properties || '<div style="text-align: center;">-</div>' }}</div>
                                    <div> <span>价格:</span>{{item.currentPrice || item.startPrice }} <span style="color:#999;font-size: 12px;">{{d.currency}}</span></div>
                                </td>
                                <!-- <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
                                   </td> -->
                                <td style="width:60px;text-align: center;color: #000;font-size: 12px;"> {{item.subStock }}</td>
                                <td style="width:80px;text-align: center;font-size: 12px;"> {{ ((item.stockNum || 0) - (item.reservationNum || 0))  + '/' + (item.orderNotInNum || 0) + '/' + (item.lackUnPaiNum || 0) }}</td>
                                <td style="width:60px;text-align: center;color: #000;font-size: 12px;"> {{item.soldNums }}</td>
                                <td style="width:60px;text-align: center;"><input type="checkbox" name="isAttractSku" data-id="{{item.id}}" data-itemid="{{d.itemId}}" lay-filter="ebay_onlline_isAttractSku" lay-skin="primary" {{item.isAttractSku ? 'checked' : '' }}></td>
                            </tr>
                            {{# }); }}
            </table>
            {{# if(d.prodSyncSEbayDtos.length > 1){ }}
            <a href="javascript:" onclick="changeColspantable(this);" class="productListSkuShow" style="float:right;">+ 展开</a> {{# } }}
        </script>
<script type="text/html" id="ebay_online_listTime_tpl">
            <div style="font-size: 10px;">
                <span style="color:#999;" >刊登:</span><span class="ebay_online_publishPerson_tip" tips="{{d.publishPerson || '' }}"> {{ Format(d.listingStartTime, "yyyy-MM-dd hh:mm:ss")}}</span><br>
                <span style="color:#999;">结束:</span> {{ Format(d.listingEndTime, "yyyy-MM-dd hh:mm:ss")}}<br>
            </div>
        </script>
<script type="text/html" id="ebay_online_shipCost_tpl">
            <div style="text-align: left;font-size: 12px;line-height: 18px;">
                {{# if(d.shippingService1 != null && d.shippingService1 != '' ){ }}
                <div style="color:red">{{d.shippingService1}}</div>
                <div style="color:red"> <span style="color:#999;">境内物流1：</span>{{d.shippingSrv1Cost}} {{d.currency}}</div>
                {{# if(d.shippingService2 != null && d.shippingService2 != '' ){ }}
                <div style="color:red"> <span style="color:#999;">境内物流2：</span>{{d.shippingSrv2Cost}} {{d.currency}}</div>
                {{# }}} {{# if(d.shippingService3 != null && d.shippingService3 != '' ){ }}
                <div style="color:red"> <span style="color:#999;">境内物流3：</span>{{d.shippingSrv3Cost}} {{d.currency}}</div>
                {{# }}} {{# if(d.shippingService4 != null && d.shippingService4 != '' ){ }}
                <div style="color:red"> <span style="color:#999;">境内物流4：</span>{{d.shippingSrv4Cost}} {{d.currency}}</div>
                {{# }}} {{# }}} {{# if(d.intShippingService1 != null){ }}
                <div style="color:blue">{{d.intShippingService1}}</div>
                <div style="color:blue"> <span style="color:#999;">境外物流1：</span>{{d.intShippingSrv1Cost}} {{d.currency}}</div>
                {{# if(d.intShippingService2 != null && d.intShippingService2 != ''){ }}
                <div style="color:blue"> <span style="color:#999;">境外物流2：</span>{{d.intShippingSrv2Cost}} {{d.currency}}</div>
                {{# }}} {{# if(d.intShippingService3 != null && d.intShippingService3 != '' ){ }}
                <div style="color:blue"> <span style="color:#999;">境外物流3：</span>{{d.intShippingSrv3Cost}} {{d.currency}}</div>
                {{# }}} {{# if(d.intShippingService4 != null && d.intShippingService4 != '' ){ }}
                <div style="color:blue"> <span style="color:#999;">境外物流4：</span>{{d.intShippingSrv4Cost}} {{d.currency}}</div>
                {{# }}} {{# if(d.intShippingService5 != null && d.intShippingService5 != '' ){ }}
                <div style="color:blue"> <span style="color:#999;">境外物流5：</span>{{d.intShippingSrv5Cost}} {{d.currency}}</div>
                {{# }}} {{# }}}
            </div>
        </script>
<script type="text/html" id="ebay_online_promotionName_tpl">
            <div style="font-size: 12px;" class="ebay_online_promotion_tip" pstart="{{d.promotionMarketStratTime || ''}}"   pend="{{d.promotionMarketEndTime || ''}}">
                {{d.promotionName || '' }}
            </div>
        </script>
<script type="text/html" id="ebay_online_effive_tpl">
            <div style="text-align: left; font-size: 12px;line-height: 18px;">
                <span style="width: 60px;text-align: right">浏览：{{d.hitCount || 0 }}</span><br>
                <span style="width: 60px;text-align: right">收藏：{{d.watchCount || 0}}</span><br>
                <span style="width: 60px;text-align: right" title="本周日统计的销量减去上周日统计的销量">7日销量：{{d.lastWeekSales || 0}}</span><br>
                <span style="width: 60px;text-align: right">总销量：{{d.soldNums || 0}}</span><br>
                <span style="width: 60px;text-align: right">30日销量：{{d.thirtySales || 0}}</span><br>
                <span style="width: 60px;text-align: right">转化率：{{d.conversionRatio}}</span><br>
                <span style="width: 60px;text-align: right">总评/差评：{{d.totalCommentNum}} / <span style="color:red">{{d.negativeCommentNum}}</span></span><br>
            </div>
        </script>
<script type="text/html" id="ebay_online_Rate_tpl">
            <div style="text-align: left; font-size: 12px;line-height: 18px;">
                <div style="text-align: center">{{d.bidPercentage|| "" }}{{d.bidPercentage?'%':""}}</div>
            </div>
        </script>

<!--竞品链接标题-->
<script type="text/html" id="ebay_online_comp_title_tpl">
            <div style="text-align: left; font-size: 12px;">
                <div>{{d.competingTitle || ''}}</div>
                <div style="color: #999;">
                    <a class="itemId" target="_blank" href="https://www.ebay.com/itm/{{d.competingLink}}">{{d.competingLink || ''}} </a>
                </div>
            </div>
        </script>
<!--优化时间-->
<script type="text/html" id="ebay_online_optimizedTime_tpl">
            <div style="font-size: 12px;">
                <span style="color:#999;"></span> {{ Format(d.optimizedTime, "yyyy-MM-dd")}}<br>
            </div>
        </script>
<!--竞品价格-->
<script type="text/html" id="ebay_online_optimizedPrice_tpl">
            <div style="font-size: 12px;text-align: left;text-indent: 1em;">
                <p><span style="color:#999;">我们:</span> {{ d.currentPrice}}</p>
                <p><span style="color:#999;">竞品:</span> {{ d.competingPrice || '' }}</p>
            </div>
        </script>
<!--优化前销量-->
<script type="text/html" id="ebay_online_optimizedBeforeSales_tpl">
            {{d.beforeSale || 0 }}
        </script>
<script type="text/html" id="ebay_online_optimized_effive_tpl">
            <div style="text-align: left; font-size: 12px;line-height: 18px;">
                <span style="width: 60px;text-align: right">1周：{{d.firstWeekSale ==null ? "-" : d.firstWeekSale  }}</span><br>
                <span style="width: 60px;text-align: right">2周：{{d.secondWeekSale ==null ? "-" : d.secondWeekSale  }}</span><br>
                <span style="width: 60px;text-align: right">3周：{{d.threeWeekSale ==null ? "-" : d.threeWeekSale }}</span><br>
                <span style="width: 60px;text-align: right">4周：{{d.fourWeekSale ==null ? "-" : d.fourWeekSale }}</span><br>
            </div>
        </script>
<!--优化思路-->
<script type="text/html" id="ebay_online_optimizedIdea_tpl">
            <div style="text-align: left;text-indent: 2em;" class="ebay_online_optimize_idea_tip" sellerNote="{{d.optimizedIdea|| ''}}">
                {{# if(d.optimizedIdea != null && d.optimizedIdea !='' ){ }} {{# if(d.optimizedIdea.length > 50){ }} {{d.optimizedIdea.substring(0,50)}}
                <span>... </span> {{# }else{ }} {{d.optimizedIdea}} {{# } }} {{# }else { }} &nbsp; {{# }}}
            </div>
        </script>
<script type="text/html" id="ebay_online_operate_tpl">
            <div class="dis_flex_col">
                <a class="layui-btn layui-btn-xs mb" lay-event="ebay_online_syncOneItem">更新</a>
                <a class="layui-btn layui-btn-xs mb" lay-event="ebay_online_markOneItem">标签</a>
                <a class="layui-btn layui-btn-xs mb" lay-event="ebay_online_show_optimize">优化</a>
                <a class="layui-btn layui-btn-xs mb" lay-event="ebay_online_searchLog">日志</a>
                <permTag:perm funcCode="update_listing_ebay">
                    <a class="layui-btn layui-btn-xs mb" lay-event="ebay_online_listing">listing</a>
                </permTag:perm>
                <a class="layui-btn layui-btn-xs mb" lay-event="ebay_online_comments">查看评价</a>
            </div>
        </script>
<script type="text/html" id="log_table_ebay">
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="ebay_log_table" lay-filter="ebay_log_table"></table>
                </div>
            </div>
        </script>
<script type="text/html" id="comments_table_ebay">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="commentTableForm">
                <div class="layui-form-item">
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">SKU</label>
                        <div class="layui-input-block">
                            <select id="ebay_online_comment_sku" lay-search lay-filter="ebay_online_comment_sku"
                                xm-select="commentSku" name="ebay_online_comment_sku"
                                xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">评价类型</label>
                        <div class="layui-input-block">
                            <select id="commentType" lay-search >
                                <option value=""></option>
                                <option value="2">好评</option>
                                <option value="3">中评</option>
                                <option value="4">差评</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">评价时间</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" id="ebayCommentTime">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <div class="layui-input-block">
                            <button type="button" class="layui-btn layui-btn-sm keyHandle"
                                    id="ebay_online_search_comment">查询</button>
                        </div>
                    </div>
                </div>
            </form>
            <table class="layui-table" id="ebay_comments_table" lay-filter="ebay_log_table"></table>
        </div>
    </div>
</script>
<script type="text/html" id="commentTpeTpl">
    {{#if (d.commentType === 'Positive') { }} 
        <span>好评</span>
    {{#} }}
    {{#if (d.commentType === 'Neutral') { }} 
        <span>中评</span>
    {{#} }}
    {{#if (d.commentType === 'Negative') { }} 
        <span>差评</span>
    {{#} }}
</script>
<script type="text/html" id="ebay_log_operation">
            <%-- {{# if(d.id!==-1){ }}--%>
                {{# if(d.operType==1){ }} 调价 {{# } }} {{# if(d.operType==2){ }} 调整库存 {{# } }} {{# if(d.operType==3){ }} 终止刊登 {{# } }} {{# if(d.operType==4){ }} 侵权处理 {{# } }} {{# if(d.operType==5){ }} 修改主标题 {{# } }} {{# if(d.operType==6){ }} 修改副标题 {{# } }} {{# if(d.operType==7){
                }} 替换橱窗图 {{# } }} {{# if(d.operType==8){ }} 应用公共模块 {{# } }} {{# if(d.operType==10){ }} 修改specific {{# } }} {{# if(d.operType==11){ }} 修改skuinfo {{# } }} {{# if(d.operType==9){ }} 修改paypal {{# } }} {{# if(d.operType==14){ }} 修改listing {{# } }} {{# if(d.operType==null){ }} 定时标零/补货 {{# } }}
        </script>
<!-- 修改标签弹窗start-->
<script type="text/html" id="ebayOnline_updateBatchEbayItemMarksLayer">
            <div class="p20">
                <form class="layui-form" id="ebayOnline_updateBatchEbayItemMarksForm">
                    <div class="layui-form-item">
                        <label class="layui-form-label">标签:</label>
                        <div class="layui-input-block">
                            <div id="ebay_online_update_marks_form"></div>
                        </div>
                    </div>
                </form>
            </div>
        </script>
<!--修改标签弹窗end-->
<!-- 待优化弹窗start-->
<script type="text/html" id="ebayOnline_updateBatchEbayTobeOptimizeLayer">
            <div class="p20">
                <form class="layui-form" id="ebayOnline_updateBatchEbayTobeOptimizeForm">
                    <div class="layui-form-item">
                        <label class="layui-form-label">竞品链接<span style="color: red;">*</span>:</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" style="width: 95%;display: inline;" placeholder="只需填写itemId" id="ebay_online_optimize_itemId">
                            <button type="button" class="layui-btn layui-btn-sm" id="ebay_online_zhuqu_button">抓取</button>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-input-block">
                            <table class="layui-table" id="ebay_online_optimize_table" lay-filter="ebay_online_optimize_table">
                                <thead>
                                    <tr>
                                        <th>类型</th>
                                        <th>竞品</th>
                                        <th>我们</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>标题</td>
                                        <td id="ebay_online_optimize_comp_title" style="text-align: left;font-size: 12px;line-height: 18px;"></td>
                                        <td id="ebay_online_optimize_our_title" style="text-align: left;font-size: 12px;line-height: 18px;"></td>

                                    </tr>
                                    <tr>
                                        <td>价格</td>
                                        <td id="ebay_online_optimize_comp_price"></td>
                                        <td id="ebay_online_optimize_our_price"></td>
                                    </tr>
                                    <tr>
                                        <td>Specifics</td>
                                        <td id="ebay_online_optimize_comp_desc" style="text-align: left;font-size: 12px;line-height: 18px;"></td>
                                        <td id="ebay_online_optimize_our_desc"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">优化思路<span style="color: red;">*</span>:</label>
                        <div class="layui-input-block">
                            <textarea id='ebay_online_optimize_idea' class="layui-textarea"></textarea>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">优化时间<span style="color: red;">*</span>:</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" autocomplete="off" id="ebay_online_optimized_time">
                        </div>
                    </div>
                </form>
            </div>
        </script>

<script type="text/html" id="pop_eabayonlineprducts_edit_rate">
            <div class="mg_20">
                <form class="layui-form" id="editRate_form" lay-filter="editRate_form">
                    <div class="layui-form-item">
                        <div class="layui-col-lg8 layui-col-md8">
                        <label class="layui-form-label">广告活动名称:</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" value="{{data.campaignName}}" placeholder="不支持修改" readonly >
                        </div>
                        </div>
                        <div class="layui-col-lg8 layui-col-md8">
                            <div class="layui-form-label">
                                <input type="radio" name="listingType" value="1" title="设置费率" checked>
                            </div>
                            <div class="layui-input-block">
                                <div class="dis_flex"><input type="text" name="bidPercentage" class="layui-input" placeholder="默认设置当前费率" value="{{data.bidPercentage}}"><span>%</span></div>
                                <div><span>Tradding ad rate：</span><span>{{data.recommendBidPercentage}}</span></div>
                            </div>
                        </div>
                        <div class="layui-col-lg8 layui-col-md8">
                            <div class="layui-form-label">
                                <input type="radio" name="listingType" value="2" title="停止推广">
                            </div>
                        </div>
                        <button type="button" class="hidden" lay-submit id="submit_ebayonlineproduct_EditRate" lay-filter="submit_ebayonlineproduct_EditRate"></button>
                    </div>
                </form>
            </div>
        </script>



<%-- ebay在线商品修改listing --%>
<script type="text/html" id="ebayOnlineproduct_listDetailTpl">
    <div style="padding: 20px 40px 0 0">
        <form action="" class="layui-form" id="ebayOnlineproduct_listDetailForm">
            <input type="hidden" name="id" value="{{d.prodListingEbay.id}}">
            <%-- 站点等信息 --%>
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
                <div>
                    <label class="layui-form-label w90 p09">itemId</label>
                    <div class="layui-input-inline">
                        <input readonly name="itemId" type="text" autocomplete="off" class="layui-input" value="{{d.itemId}}">
                    </div>
                </div>
                <div>
                    <label class="layui-form-label w90 p09">刊登方式</label>
                    <div class="layui-input-inline">
                        <input readonly name="listingType" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.listingType}}">
                    </div>
                </div>
                <div class="layui-input-inline" style="display: none">
                    <input readonly name="storeAcctId" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.storeAcctId}}">
                    <input readonly name="siteId" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.siteId}}">
                    <input readonly name="currency" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.currency}}">
                    <input readonly name="isMultiSku" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.isMultiSku}}">
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label w90 p09">刊登时间</label>
                    <div class="layui-input-inline">
                        <select name="listingDuration">
                            {{#  layui.each(d.listingDurations, function(index, item){ }}
                                {{#  if(d.prodListingEbay.listingDuration == item){ }}
                                    <option value="{{item}}" selected>{{item}}</option>
                                {{#  } else { }}
                                    <option value="{{item}}">{{item}}</option>
                                {{#  } }}
                            {{#　})　}}
                        </select>
                    </div>
                </div>
            </div>
            <%-- 刊登标题,只提示剩余字数，不限制长度 --%>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">刊登标题</label>
                <div class="layui-input-block">
                    <input name="title" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.title}}" style="width: 95%; display: inline-block">
                    <b></b>
                </div>
            </div>
            <%-- 副标题 --%>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">副标题</label>
                <div class="layui-input-block">
                    <input name="subTitle" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.subTitle || ''}}">
                </div>
            </div>
            <%-- 类目1 --%>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">类目1</label>
                <div class="layui-input-block">
                    <div style="width:18%;float: left;">
                        <input readonly name="category1" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.category1 || ''}}">
                    </div>
                </div>
            </div>
            <%-- 类目2 --%>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">类目2</label>
                <div class="layui-input-block">
                    <div style="width:18%;float: left;">
                        <input readonly name="category2" type="text" autocomplete="off" class="layui-input" value="{{d.prodListingEbay.category2 || ''}}">
                    </div>
                </div>
            </div>
            <%-- Specifics --%>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">Specifics</label>
                <div class="layui-input-block dis_flex">
                    <textarea name="specifics" class="layui-textarea w_90">{{d.prodListingEbay.specifics || ''}}
                    </textarea>
                    <span id="editspecifics" class="layui-btn layui-btn-sm layui-btn-normal">编辑</span>
                </div>
            </div>
            <%-- 修改交易价格等 --%>
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
            <%-- 图片 --%>
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
                          <div style="display:flex;">
                            <div class="ebayPublish_extImg_edit_local" style="margin-right:10px;"></div>
                            <button class="layui-btn layui-btn-primary layui-btn-sm ebayInternetImgBtn" type="button">
                                网络图片</button>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="ebayOnlineproductMainImgAddWatermark">主图添加水印图</button>
                          </div>
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
                        <div id="ebayOnlineproduct_extImg">
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
            <%-- 变种操作 --%>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">变种操作</label>
                <div class="layui-input-block">
                    <%-- 使用商品SKU --%>
                    <div class="layui-col-md1 layui-col-lg1">
                        <div class="layui-inline">
                            <button onclick="ebayPublishUpdateSku({{d.prodListingEbay.id}})" type="button" class="layui-btn layui-btn-sm">使用商品SKU</button>
                        </div>
                    </div>
                    <%-- sku后缀批量 --%>
                    <div class="layui-col-md5 layui-col-lg5">
                        <label class="layui-form-label">sku后缀批量</label>
                        <div class="layui-input-block dis_flex">
                            <select name="ebay_onlineproduct_sufixSetType" id="ebay_onlineproduct_sufixSetType" lay-filter="ebay_onlineproduct_sufixSetType">
                                <option value="1">添加</option>
                                <option value="2">替换</option>
                                <option value="3">删除</option>
                            </select>
                            <input type="text" class="layui-input" name="originalsku" style="width:30%">
                            <div class="replacehide dis_flex_around hide" style="width:50%">
                                <span style="width:20%;line-height: 38px;margin-left: 10px;">替换为</span>
                                <input type="text" class="layui-input" name="newsku" style="width:60%">
                            </div>
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="ebayBatchSetSkuSufix($(this))">批量设置后缀</button>
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label w90 p09">&nbsp;</label>
                        <div class="layui-input-block">
                            <div class="layui-input-inline">
                                <input id="ebayOnlineproduct_addSku"  width="120" type="text" autocomplete="off" class="layui-input" placeholder="关联SKU">
                            </div>
                            <button onclick="ebayOnlineproduct_addSkuBtn()" type="button" class="layui-btn layui-btn-sm layui-btn-normal">关联销售</button>
                        </div>
                    </div>
                    <%-- 毛利率 --%>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">毛利率</label>
                        <div class="layui-input-inline dis_flex">
                            <input name="defaultGrossProfitRate" type="number" class="layui-input" placeholder="毛利率">
                        </div>
                        <span onclick="ebayOnlineproductUpdatePrice({{d.prodListingEbay.id}})" class="layui-btn layui-btn-sm layui-btn-warm">更新价格</span>
                    </div>
                </div>
            </div>
            <%-- 图片关联属性 --%>
            <div class="layui-form-item">
                <label class="layui-form-label">图片关联属性</label>
                <div class="layui-col-md2 layui-col-lg2 pictureFieldDiv">
                    <input type="radio" class="pictureField" value="color" title="color" lay-filter="ep_pictureField">
                    <input type="radio" class="pictureField" value="size" title="size" lay-filter="ep_pictureField">
                    <input type="radio" class="pictureField" value="style" title="style" lay-filter="ep_pictureField">
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <span class="addSpecificsBtn layui-btn layui-btn-sm layui-btn-normal">新增属性</span>
                </div>
                <div class="layui-col-md1 layui-col-lg1 dis_flex" style="justify-content: flex-end;">
                    <button id="ebayOnline_add_sub_btn" type="button"
                            class="layui-btn layui-btn-sm">新增一行
                    </button>
                </div>
            </div>
            <%-- 变种信息 --%>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">变种信息</label>
                <div class="layui-input-block">
                    <table class="layui-table sub-sku-ebay">
                        <thead>
                            <tr id="ebayOnline_sub-sku-ebay_th_tr">
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
                        <tbody id="ebayOnline_SubSkuInfo_body">
                            {{#  layui.each(d.subSkuEbayDtos, function(index, subSkuEbayDto){ }}
                            <tr>
                                <input type="hidden" name="id" value="{{subSkuEbayDto.id}}">
                                <input type="hidden" name="tempVarietyId" value="{{subSkuEbayDto.tempVarietyId}}">
                                <td>
                                    <div style="width: 60px;position:relative;">
                                        <input type="hidden" name="imgUri" value="{{subSkuEbayDto.imgUri || ''}}">
                                        <img class="img_show_hide" width="60" height="60" src="{{subSkuEbayDto.imgUri ? subSkuEbayDto.imgUri.split(';')[0]: ''}}" onerror="layui.admin.img_noFind()">
                                        <span class="subImgNum">{{subSkuEbayDto.imgUri ? subSkuEbayDto.imgUri.split(';').length: 0}}</span>
                                        <br>
                                        <!--<span id="ebayPublish_subSkuImg" style="cursor: pointer;color: #73a1bf;float: right;">修改</span>
                                        <div class="ebayPublish_subSkuImg_edit_local"></div>
                                        <div
                                            class="layui-btn layui-btn-primary layui-btn-sm ebayPublish_subSkuImg_edit_net"
                                            style="margin-top:10px;"
                                            onclick="ebayPublish_subSkuImg_exchangeNet(this)"
                                        >
                                         网络图片
                                        </div>-->
                                        <span class="layui-btn layui-btn-xs" onclick="ebayOnlineproduct_subSkuImg_detailHandle(this)">详情</span>
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
            <%-- 商品所在地 --%>
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
            <%-- 境内运输方式1,2,3,4等 --%>
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
            <%-- 境外运输方式1 --%>
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
            <%-- 境外运输方式2 --%>
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
            <%-- 境外运输方式3 --%>
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
            <%-- 境外运输方式4 --%>
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
            <%-- 境外运输方式5 --%>
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
            <%-- 不寄送国家 --%>
            <div class="layui-form-item">
                <label class="layui-form-label w90 p09">不寄送国家</label>
                <button style="margin-bottom: 10px" id="ebay_exclude_country" type="button" class="layui-btn layui-btn-sm layui-btn-normal">使用店铺设置</button>
                <div class="layui-input-block">
                     <textarea id="ebay_listing_not_ship_to_countries_textarea" name="notShipToCountries" placeholder="请输入内容" class="layui-textarea">{{d.prodListingEbay.notShipToCountries}}</textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<!--specifics td模板-->
<script type="text/html" id="ep_specificsThTpl">
    <th width="100" class="specificsField">
        <input name="specifics" value=":key" class="layui-input">
        <i class="layui-icon delSpecificsBtn">&#xe640;</i>
    </th>
</script>

<%--待刊登生成--%>
<script type="text/html" id="ebayPublish_info_add_water">
    <form class="layui-form" action="" lay-filter="component-form-group" id="ebayPublish_info_water">
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

<!-- ebay刊登表格辅图展示 -->
<script type="text/html" id="ebayOnlineproduct_subSkuImg_detailLayer">
  <div class="subSkuImgContainer">
    <div class="subSkuImgContainer-left">
      <div>变种图片</div>
      <div>(<span id="subSkuImgLeftOnlineproductImgNum">0</span> /<span class="subSkuImgLeftImgNumTotal">1</span>)</div>
    </div>
    <div class="subSkuImgContainer-right">
      <div>
        <span class="layui-btn layui-btn-sm" id="subSkuImgOnlineproduct_container_localUpload">本地上传</span>
        <span class="layui-btn layui-btn-sm layui-btn-primary" id="subSkuImgOnlineproduct_container_networkUpload">网络图片</span>
      </div>
      <div class="subSkuImgContainer-right-middle">
        <i style="background:red;color:#fff">说明: </i>
          点击图片拖动，即可调整图片顺序！
      </div>
      <!-- 辅图容器 -->
      <div class="auxiliary-ebaySubSkuImgs" id="onlineproduct-auxiliary-ebaySubSkuImgs">
      </div>
    </div>
  </div>
</script>


<!--待优化弹窗end-->
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>
<script src="${ctx}/static/jquery-ui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/Huploadify/jquery.Huploadify.js"></script>
<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/onlineproduct.js"></script>
