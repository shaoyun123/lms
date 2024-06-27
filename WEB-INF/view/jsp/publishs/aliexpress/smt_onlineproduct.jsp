<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>速卖通在线商品</title>
<style>
    .labelSel {
        padding: 0 15px;
    }
    .pl20 {
        padding-left: 20px;
    }
    #smt_onlineproductCard  .dis_flex{
        display: flex;
        justify-content: space-between;
    }
    #smt_onlineproductCard  .layui-tab-content{
        padding-right: 0px;
    }

    .row_module_js{
        background: #fff;
        height: 42px;
    }
    #smt_onlineproductCard .fixeddiv2 {
        left:100px;
    }
    #smt_online_searchForm .layui-col-md6.layui-col-lg6 .layui-input.layui-unselect {
        border-radius: 0;
        border-right: none;
    }
    #smt_online_searchForm .layui-col-md6.layui-col-lg6 .layui-input {
        border-radius: 0;
    }
    #smt_online_searchForm .labelSel{
        padding: 0 0 0 15px;
        width: 95px;
    }
    a.itemId {
        color: #428bca;
        cursor: pointer;
    }
    div .findGoods {
        width: 60px;
        height: 60px;
    }
    table.colspantable td {
        border: 0px;
    }
    div.sell-hot-iocn {
        z-index: 10;
        position: absolute;
        top: 0;
        width: 25px;
        height: 24px;
        background: url('${ctx}/static/img/goldenDiamond.png') no-repeat;
    }
    div .sell-hot-iocn-box {
        position: relative;
    }
    div .epz_out {
        position: relative !important;
        border: 1px solid #ccc;
    }
    img.wish_imgCss {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        padding: 1px;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
    }
    span.myj-type-box {
        display: inline-block;
        margin-right: 5px;
        border: 1px solid #a0a3a6;
        border-radius: 4px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #a0a3a6;
    }
    .myj-type-box.type-red {
        border-color: #ec4339;
        color: #ec4339;
    }
    .myj-type-box.type-yellow {
        border-color: #d6ad1a;
        color: #d6ad1a;
    }
    .mLeft20 {
        margin-left: 20px;
    }
    div.gray-c {
        color: #737679 !important;
        position: relative;
    }
    #wish_online_div_audit_chk div {
        margin-top: 5px;
    }

    a.productListSkuShow {
        color: #428bca;
    }
    .update_sellerNote{
        color: #009688;
        cursor: pointer;
    }
    .smt_online_operate_btn {
        position: absolute;
        min-width: 215px;
        z-index: 99999;
        left: -88px;
        border: 1px solid #ccc;
        background: #fff; 
    }
    #smt_online_bactchoerate_form .layui-form-select dl {
        /* max-height: 600px; */
        max-height: 400px;
    }
    #smt_online_bactchmark_form .layui-form-select dl {
        /* max-height: 600px; */
        max-height: 400px;
    }
    .smt_onlineproducts_exportSetting .layui-form-onswitch i{
        left: 50px;
    }
    .smt_onlineproducts_exportSetting  .layui-form-switch{
        margin-top: 0px;
        width: 60px;
    }
    .smt_onlineproducts_exportSetting em{
        width: 45px;
    }
    .exportSetting_grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 20%);
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="smt_online_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="smt_online_depart_sel" name="depart" lay-search lay-filter="smt_online_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select  id="smt_online_salesman_sel" name="salesman" lay-search lay-filter="smt_online_salesman_sel"  class="users_hp_custom" data-rolelist="smt专员" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="smt_online_store_sel" xm-select-search
                                        xm-select="smt_online_store_sel" lay-search
                                        lay-filter="smt_online_store_sel" class="store_hp_custom"
                                        xm-select-skin="normal"
                                        data-platcode="aliexpress">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">产品ID</label>
                                <div class="layui-input-block">
                                    <input  class="layui-input" autocomplete="off" id="smt_online_itemId" value="">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">SMT分类</label>
                                <button type="button"
                                    class="layui-btn layui-btn-primary layui-btn-sm"
                                    id="smt_online_SMTbutton">选择分类</button>
                                <i class="layui-icon layui-icon-delete" onclick="clearCate('smt_online_SMTbutton_div','smt_online_SMTbutton_hidden')" style="cursor:pointer" title="删除分类"></i>
                                <input type="hidden" name="categoryId" id="smt_online_SMTbutton_hidden">
                            </div>
                            <!-- <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">刊登类型</label>
                                <div class="layui-input-block">
                                    <select  id="smt_online_listingType_sel" lay-filter="smt_online_listingType_sel">
                                        <option value="">全部</option>
                                        <option value="1">定向刊登</option>
                                        <option value="2">自主选品</option>
                                        <option value="0">无</option>
                                    </select>
                                </div>
                            </div> -->

                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select id="smt_online_searchtype_sel">
                                        <%--<option value="1">商品父SKU</option>--%>
                                        <option value="2">商品子SKU</option>
                                        <%--<option value="3">店铺父SKU</option>--%>
                                        <option value="4">店铺子SKU</option>
                                        <option value="5">商品子SKU(精确)</option>
                                        <option value="6">店铺子SKU(精确)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="smt_online_searchtype_text">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel" style="display:flex;width:160px;">
                                    <select name="onlineStockStartType">
                                        <option value="1">子SKU</option>
                                        <option value="2">产品ID</option>
                                    </select>
                                    <div style="width:160px;line-height:34px;">在线数量</div>
                                </div>
                                <div class="layui-input-block" style="margin-left: 180px;">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input" autocomplete="off" id="smt_online_stockStart_text">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input" autocomplete="off" id="smt_online_stockEnd_text">
                                    </div>
                                </div>
                            </div>
<%--                            <div class="layui-col-lg2 layui-col-md2">--%>
<%--                                <label class="layui-form-label">链接库存</label>--%>
<%--                                <div class="layui-input-block">--%>
<%--                                    <div class="layui-col-md6 layui-col-lg6">--%>
<%--                                        <input type="number" class="layui-input" autocomplete="off" id="smt_online_SalesStart_text">--%>
<%--                                    </div>--%>
<%--                                    <div class="layui-col-md6 layui-col-lg6">--%>
<%--                                        <input type="number" class="layui-input" autocomplete="off" id="smt_online_SalesEnd_text">--%>
<%--                                    </div>--%>
<%--                                </div>--%>
<%--                            </div>--%>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">重量(kg)</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input" autocomplete="off" id="smt_online_grossWeightStart_text">
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="number" class="layui-input" autocomplete="off" id="smt_online_grossWeightEnd_text">
                                    </div>
                                </div>
                            </div>
                            <%--<div class="layui-col-lg2 layui-col-md2">--%>
                                <%--<label class="layui-form-label">销量(暂无)</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<div class="layui-col-md6 layui-col-lg6">--%>
                                        <%--<input type="number" class="layui-input" autocomplete="off" id="smt_online_salesStart_text">--%>
                                    <%--</div>--%>
                                    <%--<div class="layui-col-md6 layui-col-lg6">--%>
                                        <%--<input type="number" class="layui-input" autocomplete="off" id="smt_online_salesEnd_text">--%>
                                    <%--</div>--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select  id="smt_online_listtime_sel">
                                        <option value="1">刊登时间</option>
                                        <option value="2">结束时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" id="smt_online_listtime">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">刊登类型</label>
                                <div class="layui-input-block">
                                    <select name="listingMethod">
                                        <option value="">全部</option>
                                        <option value="1">销售刊登</option>
                                        <option value="2">系统刊登</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">运费模板</label>
                                <div class="layui-input-block">
                                    <select id="smt_online_freight_template_sel" 
                                        lay-filter="smt_online_freight_template_sel"
                                        xm-select="smt_online_freight_template_sel"
                                        xm-select-search 
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                        xm-select-type="1"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">店铺分组</label>
                                    <div class="layui-input-block">
                                        <select 
                                            name="storeAcctGroup" 
                                            id="smt_online_storeAcctGroup"
                                            lay-filter="storeAcctGroup" 
                                            xm-select="storeAcctGroup"
                                            xm-select-search 
                                            xm-select-search-type="dl"
                                            xm-select-skin="normal"
                                            xm-select-type="1">
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label labelSel">
                                        <select  id="smt_online_logistics_search_type">
                                            <option value="1">物流属性与</option>
                                            <option value="2">物流属性或</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <select id="smt_online_logistics_sel" xm-select="smt_online_logistics_sel" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                    </div>
                                </div>
                                <!-- <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">可刊登时间</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" autocomplete="off" id="smt_online_canListingTime">
                                    </div>
                                </div> -->
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">区域调价</label>
                                    <div class="layui-input-block">
                                        <select  id="smt_online_region_price_sel" lay-filter="smt_online_region_price_sel">
                                            <option value="">全部</option>
                                            <option value="true">有</option>
                                            <option value="false">无</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">区域模板</label>
                                    <div class="layui-input-block">
                                        <select  id="smt_online_region_price_template_sel" lay-search lay-filter="smt_online_region_price_template_sel"></select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">单品折扣名称</label>
                                    <div class="layui-input-block">
                                        <select id="smt_online_discount" name="promotionId" lay-search lay-filter="smt_online_discount"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label labelSel">
                                        <select name="priceType">
                                            <option value="1">($)刊登价格</option>
                                            <option value="2">(￥)刊登价格</option>
                                        </select>
                                    </label>
                                    <div class="layui-input-block">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" class="layui-input" autocomplete="off" id="smt_online_priceStart_text">
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" class="layui-input" autocomplete="off" id="smt_online_priceEnd_text">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label labelSel">
                                        <select name="difPriceType">
                                            <option value="1">($)刊登差价</option>
                                            <option value="2">(￥)刊登差价</option>
                                        </select>
                                    </label>
                                    <div class="layui-input-block">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" class="layui-input" autocomplete="off" id="smt_online_difPriceStart_text">
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" class="layui-input" autocomplete="off" id="smt_online_difPriceEnd_text">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">刊登差价(%)</label>
                                    <div class="layui-input-block">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" class="layui-input" autocomplete="off" id="smt_online_difRatioStart_text">
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" class="layui-input" autocomplete="off" id="smt_online_difRatioEnd_text">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label labelSel">
                                        <select name="minPriceType">
                                            <option value="1">($)最低价格</option>
                                            <option value="2">(￥)最低价格</option>
                                        </select>
                                    </label>
                                    <div class="layui-input-block">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" class="layui-input" autocomplete="off" name="minPriceFrom">
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" class="layui-input" autocomplete="off" name="minPriceTo">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">商品标签</label>
                                    <div class="layui-input-block">
                                        <select id="smt_online_productLabel_sel" lay-search lay-filter="smt_online_productLabel_sel"></select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label labelSel">
                                        <select  name="regionPriceType">
                                            <option value="1">有国家定价(与)</option>
                                            <option value="2">有国家定价(或)</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <select id="smt_online_regionPriceCountryList" xm-select="smt_online_regionPriceCountryList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                    </div>
                                </div>
                                <div class="layui-col-lg4 layui-col-md4">
                                    <label class="layui-form-label">产品标题</label>
                                    <div class="layui-input-block">
                                        <div class="layui-col-md7 layui-col-lg7">
                                            <input  class="layui-input" autocomplete="off" id="smt_online_item_title" placeholder="默认分词全模糊查询">
                                        </div>
                                        <div class="layui-col-md4 layui-col-lg4">
                                            <select id="smt_online_title_search_type">
                                                <option value="0">分词全模糊</option>
                                                <option value="1">常规模糊</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label labelSel">
                                        <select name="salesNumType">
                                            <option value="1">ID7天销量</option>
                                            <option value="2">ID30天销量</option>
                                            <option value="3">ID60天销量</option>
                                            <option value="4">ID90天销量</option>
                                            <option value="6">半托管7天销量</option>
                                            <option value="7">半托管30天销量</option>
                                            <option value="8">半托管60天销量</option>
                                            <option value="9">半托管90天销量</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block disflex">
                                        <input type="number" name="salesNumFrom" class="layui-input" min="0">
                                        <input type="number" name="salesNumTo" class="layui-input" min="0">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">备货天数</label>
                                    <div class="layui-input-block">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" class="layui-input" autocomplete="off" name="deliveryTimeStart">
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" class="layui-input" autocomplete="off" name="deliveryTimeEnd">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label labelSel">
                                <%--    该接口获取以下枚举，因为产品只需要下列这几个，所以直接写了没调接口 lms/onlineProductSmt/getProdQualificationEnum?qualificationName=欧盟--%>
                                        <select name="qualificationKey" lay-search>
                                            <option value="cosmetics_PIF">化妆品PIF文件</option>
                                            <option value="CPNP_notification">CPNP通报证明</option>
                                            <option value="ECE_certification">ECE证书图片</option>
                                            <option value="EU_FCM_testing_report">欧盟食品接触材料检测报告</option>
                                            <option value="item_EU_CE_certificate">CE认证</option>
                                            <option value="item_stock_photo">商品库存实拍图</option>
                                            <option value="item_testing_report">检测报告</option>
                                            <option value="Package_Label_Photo_EU">外包装/标签实拍图-欧盟</option>
                                            <option value="REACH_testing_report">REACH检测报告</option>
                                            <option value="RoHS_testing_report">RoHS检测报告</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <select name="haveQualification" lay-search>
                                            <option value=""></option>
                                            <option value="true">有</option>
                                            <option value="false">无</option>
                                        </select>
                                    </div>
                                </div>
<%--                                <div class="layui-col-lg2 layui-col-md2">--%>
<%--                                    <label class="layui-form-label">利润率(%)</label>--%>
<%--                                    <div class="layui-input-block">--%>
<%--                                        <div class="layui-col-md6 layui-col-lg6">--%>
<%--                                            <input type="number" class="layui-input" autocomplete="off" name="profitPercentageStart">--%>
<%--                                        </div>--%>
<%--                                        <div class="layui-col-md6 layui-col-lg6">--%>
<%--                                            <input type="number" class="layui-input" autocomplete="off" name="profitPercentageEnd">--%>
<%--                                        </div>--%>
<%--                                    </div>--%>
<%--                                </div>--%>
<%--                                <div class="layui-col-lg2 layui-col-md2">--%>
<%--                                    <label class="layui-form-label">均单利润(&yen;)</label>--%>
<%--                                    <div class="layui-input-block">--%>
<%--                                        <div class="layui-col-md6 layui-col-lg6">--%>
<%--                                            <input type="number" class="layui-input" autocomplete="off" name="profitMoneyStart">--%>
<%--                                        </div>--%>
<%--                                        <div class="layui-col-md6 layui-col-lg6">--%>
<%--                                            <input type="number" class="layui-input" autocomplete="off" name="profitMoneyEnd">--%>
<%--                                        </div>--%>
<%--                                    </div>--%>
<%--                                </div>--%>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">排序类型</label>
                                    <div class="layui-input-block">
                                        <select  id="smt_online_sortdesc_sel" lay-search lay-filter="smt_online_sortdesc_sel">
                                            <option value="gmt_create desc">刊登时间降序</option>
                                            <option value="gmt_create asc">刊登时间升序</option>
                                            <option value="ipm_sku_stock asc">在线数量升序</option>
                                            <option value="ipm_sku_stock desc">在线数量降序</option>
                                            <option value="sales asc">卖出数量升序</option>
                                            <option value="sales desc">卖出数量降序</option>
                                            <option value="seven_sales asc">7日销量排序升序</option>
                                            <option value="seven_sales desc">7日销量排序降序</option>
                                            <option value="thirty_sales asc">30日销量排序升序</option>
                                            <option value="thirty_sales desc">30日销量排序降序</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label labelSel" style="display:flex;width:160px;">
                                        <select name="preAvailableStockType">
                                            <option value="1">预计可用库存含在途</option>
                                            <option value="2">预计可用库存不含在途</option>
                                        </select>
                                        <select name="preAvailableAllSku">
                                            <option value="false">部分属性</option>
                                            <option value="true">全部属性</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block" style="margin-left: 180px;">
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" id="smt_online_preAvailableStockMin" name="preAvailableStockMin" autocomplete="off" class="layui-input inputBorRadLeft">
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="number" id="smt_online_preAvailableStockMax" name="preAvailableStockMax" autocomplete="off" class="layui-input inputRad">
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label">诊断结果</div>
                                    <div class="layui-input-block">
                                        <select id="smt_online_diagnosisProblemType" name="diagnosisProblemType" lay-search></select>
                                    </div>
                                </div>
                                <div class="layui-col-lg1 layui-col-md1">
                                    <select name="isAvailableVideo" lay-search>
                                        <option value="">有无可用视频</option>
                                        <option value="1">有可用视频</option>
                                        <option value="0">无可用视频</option>
                                    </select>
                                </div>
                                <div class="layui-col-lg1 layui-col-md1">
                                    <select name="isUploadVedio" lay-search>
                                        <option value="">是否上传视频</option>
                                        <option value="1">已上传视频</option>
                                        <option value="0">未上传视频</option>
                                    </select>
                                </div>
                                <div class="layui-col-lg1 layui-col-md1">
                                    <select name="msrEuIdStatus" lay-search>
                                        <option value="">欧盟责任人</option>
                                        <option value="有欧盟责任人">有欧盟责任人</option>
                                        <option value="无欧盟责任人">无欧盟责任人</option>
                                        <option value="无需欧盟责任人">无需欧盟责任人</option>
                                    </select>
                                </div>
                                <div class="layui-col-lg1 layui-col-md1">
                                    <select name="isHalfMa" lay-search>
                                        <option value="">是否加入半托管</option>
                                        <option value="true">已加入半托管</option>
                                        <option value="fasle">未加入半托管</option>
                                    </select>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label">品牌</div>
                                    <div class="layui-input-block">
                                        <select name="haveBrand" lay-search>
                                            <option value=""></option>
                                            <option value="false">none</option>
                                            <option value="true">非none</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2 smt_online_wsDisplayList disN">
                                    <label class="layui-form-label">下架原因</label>
                                    <div class="layui-input-block">
                                        <select id="smt_online_wsDisplayList"
                                            xm-select="smt_online_wsDisplayList"
                                            placeholder="全部"
                                            xm-select-search
                                            xm-select-search-type="dl"
                                            xm-select-skin="normal">
                                        </select>
                                    </div>
                                </div>
                                <!-- <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">可用视频</label>
                                    <div class="layui-input-block">
                                        <select name="isAvailableVideo" lay-search >
                                            <option value="">请选择</option>
                                            <option value="1">有</option>
                                            <option value="0">无</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">已上传视频</label>
                                    <div class="layui-input-block">
                                        <select name="isUploadVedio" lay-search >
                                            <option value="">请选择</option>
                                            <option value="1">是</option>
                                            <option value="0">否</option>
                                        </select>
                                    </div>
                                </div> -->
                                <!-- <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">营销图</label>
                                    <div class="layui-input-block">
                                        <select name="marketImageMissing" lay-search >
                                            <option value="">全部</option>
                                            <option value="1">完整</option>
                                            <option value="0">不完整</option>
                                        </select>
                                    </div>
                                </div> -->
                                <div class="layui-col-lg3 layui-col-md3 layui-col-md-offset9">
                                    <div class="layui-input-block" style="text-align:right;">
                                        <button type="button" class="layui-btn layui-btn-sm keyHandle" id="smt_online_search_submit">查询</button>
                                        <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary" id="smt_online_search_reset">清空</button>
                                        <span id="smt_online_copy_list" style="position:relative;" onmouseover="showTip(`最多复制1w个`,this)" onmouseout="removeTip(this)">
                                        <button type="button" class="layui-btn layui-btn-sm">一键复制</button>
                                        <ul class="hidden">
                                            <li class="smtOnline_copyData" data-type="itemId" data-typestr="item_id">产品id</li>
                                            <li class="smtOnline_copyData" data-type="prodPSku" data-typestr="商品父SKU">商品父SKU</li>
                                            <li class="smtOnline_copyData" data-type="storeAcct" data-typestr="店铺">店铺</li>
                                            <li class="smtOnline_copyData" data-type="salesPerson" data-typestr="销售">销售</li>
                                        </ul>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div id="smt_online_SMTbutton_div"></div>
                </div>
            </div>
            <div class="layui-card" id="smt_onlineproductCard">
                <div class="layui-card-body">
                    <div class="dis_flex row_module_js">
                    <div class="layui-tab" lay-filter="smt_online_tab_filter">
                        <ul class="layui-tab-title">
                            <li class="layui-this" product_status_type="1">在线(<span id="smt_online_online_num1_span"></span>)</li>
                            <li product_status_type="2">已下架(<span id="smt_online_online_num2_span"></span>)</li>
                            <li product_status_type="3">审核中(<span id="smt_online_online_num3_span"></span>)</li>
                            <li product_status_type="4">审核不通过(<span id="smt_online_online_num4_span"></span>)</li>
                        </ul>
                    </div>
                    <div class="layui-form">
                        <div  style="display: inline-block;">
                            <a href="javascript:;" class="layui-btn layui-btn-sm" id="smt_online_online_export">导出</a>
                            <a href="javascript:;" class="layui-btn layui-btn-sm" onclick="expandAll('smt_onlineproductCard')">展开所有</a>
                            <a href="javascript:;" class="layui-btn layui-btn-sm" onclick="PackUpAll('smt_onlineproductCard')">收起所有</a>
                        </div>
                        <div style="display: inline-block;" class="layui-form">
                            <form id="smt_online_bactchmark_form" class="layui-form">
                                <select  id="smt_online_tagsOperate_sel"  lay-filter="smt_online_tagsOperate_sel">
                                    <option value="" >批量打标签</option>
                                </select>
                            </form>
                        </div>
                        <div class="layui-input-inline">
                            <form id="smt_online_bactchoerate_form" class="layui-form">
                                <select id="smt_online_apiOperate_sel" lay-search lay-filter="smt_online_apiOperate_sel">
                                    <permTag:perm funcCode="batch_update_smt">
                                        <option value="0">批量更新</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="batch_delete_smt">
                                        <option value="1">批量删除</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="is_ebable_product_smt">
                                        <option value="2"  data-link="route/iframe/smt/smtIsEnableProduct" data-title="商品下架">商品下架</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="online_aeproduct_smt">
                                        <option value="16"  data-link="route/iframe/smt/smtOnlineaeproduct" data-title="商品上架">商品上架</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="adjust_price_smt">
                                        <option value="3"  data-link="route/iframe/smt/smtModifyMainPrice" data-title="调整价格">调整价格</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_inventory_smt">
                                        <option value="4"  data-link="route/iframe/smt/smtModifyMainStock" data-title="调整库存">调整库存</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_title_smt">
                                        <option value="6"  data-link="route/iframe/smt/smtModifyMainTitle" data-title="修改标题">修改标题</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_imgs_smt">
                                        <option value="7"  data-link="route/iframe/smt/smtReplaceWindowMap" data-title="修改图片">修改图片</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_grossWeight_smt">
                                        <option value="10"  data-link="route/iframe/smt/smtModifyMainGrossWeight" data-title="修改毛重">修改毛重</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_group_smt">
                                        <option value="9"  data-link="route/iframe/smt/smtModifGroup" data-title="修改分组">修改分组</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_templat_smt">
                                        <option value="8"  data-link="route/iframe/smt/smtModifyFreightTemplat" data-title="调整区域调价和运费模板">调整区域调价和运费模板</option>
                                    </permTag:perm>
                                    <!-- <permTag:perm funcCode="modify_templat_smt_price"> -->
                                        <!-- 该功能合并到 调整区域调价和运费模板-->
                                        <!-- <option value="11"  data-link="route/iframe/smt/smtModifyAreaPrice" data-title="区域调价">区域调价</option>
                                    </permTag:perm> -->
                                    <permTag:perm funcCode="modify_commodity_smt_price">
                                        <option value="12"  data-link="route/iframe/smt/smtModifyCommodityPrice" data-title="仅调整待调价商品价格">仅调整待调价商品价格</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_title_desc_smt">
                                        <option value="13"  data-link="route/iframe/smt/smtModifyTitleDesc" data-title="修改标题和描述">修改标题和描述</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_attribute_smt">
                                        <option value="14"  data-link="route/iframe/smt/smtModifyAttribute" data-title="修改分类属性">修改分类属性</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_sskuInfo_smt">
                                        <option value="15"  data-link="route/iframe/smt/smtModifySskuInfo" data-title="修改子SKU信息">修改子SKU信息</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="upload_video_smt">
                                        <option value="17"  data-link="route/iframe/smt/smtUploadVideo"  data-title="上传视频">上传视频</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="del_video_smt">
                                        <option value="18"  data-title="删除视频">删除视频</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_market_image_smt">
                                        <option value="19" data-link="route/iframe/smt/smtMarketImage"  data-title="修改营销图">修改营销图</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_simple_product_filed_smt">
                                        <option value="20" data-link="route/iframe/smt/smtSimpleProductFiled"  data-title="修改备货期">修改备货期</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_MsrEuId_smt">
                                        <option value="21" data-link="route/iframe/smt/smtUpdateMsrEuId"  data-title="修改欧盟责任人">修改欧盟责任人</option>
                                    </permTag:perm>
                                    <permTag:perm funcCode="modify_ProductQualification_smt">
                                        <option value="22" data-link="route/iframe/smt/smtProductQualification"  data-title="修改商品资质">修改商品资质</option>
                                    </permTag:perm>
                                </select>
                            </form>
                        </div>
                    </div>
                    </div>
                    <div class="checkbox-group" style="padding:10px;">
                            <div class="layui-form">
                                <form id="smt_online_marks_form">
                                    <input type="checkbox" name="like1[sky]" value="" lay-skin="primary" title="全部" id="smt_online_marks_checkAll" lay-filter="marksCheck" >
                                    <input type="checkbox" name="like1[read]" value="重点维护" lay-skin="primary" title="重点维护" id="smt_online_marks_import" lay-filter="marksCheck" >
                                    <input type="checkbox" name="like1[game]" value="待优化" lay-skin="primary" title="待优化"  id="smt_online_marks_optimize"  lay-filter="marksCheck" >
                                    <input type="checkbox" name="like1[write]" value="需要调价"  lay-skin="primary" title="待调价"  id="smt_online_marks_adjust" lay-filter="marksCheck" >
                                    <input type="checkbox" name="prodStopSaleStatus" value="全部停售" lay-skin="primary" title="全部停售" lay-filter="marksCheck" >
                                    <input type="checkbox" name="like1[read]" value="部分停售" lay-skin="primary" title="部分停售" lay-filter="marksCheck" >
                                    <input type="checkbox" name="like1[game]" value="优化完成" lay-skin="primary" title="优化完成" lay-filter="marksCheck" >
                                    <input type="checkbox" name="like1[write]" value="调价完成" lay-skin="primary" title="调价完成" lay-filter="marksCheck" >
                                    <input type="checkbox" name="like1[write]" value="暂缺货" lay-skin="primary" title="暂缺货" lay-filter="marksCheck" >
                                    <input type="checkbox" name="like1[skyblue]" value="滞销品维护中" lay-skin="primary" title="滞销品维护中" lay-filter="marksCheck" >
                                    <input type="checkbox" name="smtTortStatus" value="SMT侵权" lay-skin="primary" title="SMT侵权" lay-filter="marksCheck" >
                                    <input type="checkbox" name="tortStatus" value="有平台侵权" lay-skin="primary" title="有平台侵权" lay-filter="marksCheck" >
                                    <input type="checkbox" name="remarkStatus" value="有备注" lay-skin="primary" title="有备注" lay-filter="marksCheck" >
                                </form>
                            </div>
                    </div>
                    <div class="layui-tab-content" style="padding-top: 0px;" >
                        <table class="layui-table" style="margin: 0px;"  id="smt_online_data_table" lay-filter="smt_online_data_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<table id="smt_online_hide_table" style="display: none;"></table>
<script type="text/html" id="smt_online_mainImage_tpl">
    <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
        <div class="imgDiv sell-hot-iocn-box" style="margin-right:0px;">
            <div class="findGoods epz_out">
                {{# if(d.firstImage != null){ }}
                <img  class="img_show_hide wish_imgCss lazy" data-original="{{d.firstImage}}" style="display: block;" data-onerror="layui.admin.img_noFind()">
                {{# } }}
            </div>
        </div>
    </div>
    {{# if(d.availableVideo && d.uploadVedio ){ }}
        <span lay-tips="有可用，已上传">[视频]</span>
    {{#}else if(d.availableVideo && !d.uploadVedio ){}}
        <span lay-tips="有可用，未上传">[视频]</span>

    {{#}else if(!d.availableVideo && d.uploadVedio ){ }}
        <span lay-tips="无可用，已上传">[视频]</span>
    {{#}else{ }}
        <span lay-tips="无可用，未上传">[视频]</span>
    {{# } }}
</script>
<script type="text/html" id="smt_online_itemId_tpl">
    <div style="text-align: left;"  id="td_{{d.itemId}}">
            {{d.title}} &nbsp;  &nbsp;
                {{#  if(d.isRegionalPricing){ }}
                    <div style="position: relative !important;float:right;z-index:9999">
                        <span class="hp-badge layui-bg-blue fr smt_online_region_price_show" style="cursor:pointer;">区</span>
                        {{#  if(d.halfMa){ }}
                            <span class="hp-badge layui-bg-blue fr" style="cursor:pointer;width:46px;">chioce</span>
                        {{#  }; }}
                        <div class="disN smt_online_region_price_showHandle">
                            <div style="padding:20px"> 
                            <table class="layui-table" style="font-size: 12px;min-width:900px;">
                                <thead>
                                <tr>
                                    <th style="width: 90px" align="center">颜色</th>
                                    {{#  layui.each(d.regionPriceList, function(index, item){ }}
                                    {{#  if(index==0){ }}
                                    {{#  layui.each(item.countrys, function(index1, item1){ }}
                                    {{#  if(index==0){ }}
                                    <th  align="center">{{item1.shiptoCountry}}零售价($USD)</th>
                                    {{#  }; }}
                                    {{#  }); }}
                                    {{#  }; }}
                                    {{#  }); }}
                                </tr>
                                </thead>
                                <tbody>
                                {{#  layui.each(d.regionPriceList, function(index, item){ }}
                                <tr>
                                    <td  align="center">
                                        <div style="border: 1px solid #ccc; width:50px;hegiht:50px;">
                                           <img src="{{item.imageUrl}}" alt="子sku图片" width="48" height="48">   
                                        </div>
                                    {{item.color || item.storeSubSku }}
                                    </td>
                                    {{#  layui.each(item.countrys, function(index1, item1){ }}
                                    <td  align="center"> <span style="color: #737679;font-size: 10px;">{{item1.orignPrice || ''}} &nbsp; {{item1.changeValue}}</span>  &nbsp; &nbsp; {{Number(item1.finaValue).toFixed(2)}} </td>
                                    {{#  }); }}
                                </tr>
                                {{#  }); }}
                                </tbody>
                            </table> 
                            </div>
                        </div>
                    </div>
                {{#  } }}

            <div style=" display: inline-block !important;">
                {{# if(d.productStatusType =='3'){ }}
                <span class="popoverHover myj-type-box type-yellow" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" data-content="审核中" title="">审</span>
                {{# }else if(d.productStatusType =='4'){ }}
                <span class="popoverHover myj-type-box type-red" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" data-content="被拒绝" title="">拒</span>
                {{# } }}
            </div>
            <div class="gray-c">
                [ {{d.storeAcct || ''}} ]&nbsp;  &nbsp;[ {{d.salesPerson || ''}} ]
                <a class="itemId" target="_blank" href="http://www.aliexpress.com/item/info/{{d.itemId}}.html">{{d.itemId}}</a>
                <span onclick="layui.admin.onlyCopyTxt('{{d.itemId}}')" style="display: {{d.itemId ? 'inline-block':'none'}};cursor:pointer">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
<%--                <a class="itemId" target="_blank" href="http://www.aliexpress.com/item/info/{{d.itemId}}.html">{{d.itemId}}</a>--%>
                <!-- &nbsp;&nbsp;{{d.categoryName}} -->
                {{#  if(d.marks.indexOf('待优化') >-1 ){ }}
                    <span class="hp-badge layui-bg-blue fr layTitle" lay-title="待优化">待</span>
                {{#  } }}
                {{#  if(d.marks.indexOf('重点维护') >-1){ }}
                    <span class="fr layTitle" lay-title="重点维护"><i class="layui-icon layui-icon-fire" style="font-size: 20px; color:red;"></i></span>
                {{#  } }}
                {{#  if(d.marks.indexOf('需要调价') >-1){ }}
                    <span class="hp-badge layui-bg-blue fr layTitle" style="width:40px;" lay-title="待调价">调{{d.adjustIntervalDay || '' }}</span>
                {{#  } }}
                {{#  if(d.marks.indexOf('亏损') >-1 && (d.marks.indexOf('取消亏损') == -1) ){ }}
                     <span class="hp-badge layui-bg-red fr layTitle" lay-title="亏损标记">亏</span>
                {{#  } }}
                {{#  if(d.marks.indexOf( '优化完成') >-1){ }}
                <span class="fr layTitle" lay-title="优化完成"><i class="layui-icon layui-icon-ok-circle" style="font-size: 20px; color:blue;"></i></span>
                {{#  } }}
                {{#  if(d.marks.indexOf( '暂缺货') >-1 && d.marks.indexOf( '取消暂缺货') ==-1 ){ }}
                <span class="hp-badge layui-bg-red fr layTitle" lay-title="暂缺货">暂1</span>
                {{#  } }}
                {{#  if(d.marks.indexOf( '滞销品维护中') >-1  ){ }}
                <span class="hp-badge layui-bg-orange fr layTitle" lay-title="滞销品维护中">滞</span>
                {{#  } }}
                {{#  if(d.isDiscontinued == 1){ }}
                <span class="hp-badge layui-bg-red fr layTitle" lay-title="停售">停</span>
                {{#  } }}
                {{#  if(d.currencyCode != 'USD'){ }}
                <span class="hp-badge layui-bg-blue fr layTitle" style="width:40px;" >{{d.currencyCode || '' }}</span>
                {{#  } }}
            </div>
            <div class="gray-c">{{d.categoryNameZh || ''}}</div>
    </div>
</script>
<script type="text/html" id="smt_online_storePSku_tpl">
    <div style="text-align: left;">
        {{d.storePSku || ''}}</br>
        <div style="color: #999;" title="对应的基础商品sku"> [
            <a>{{item.prodPSku || ''}}</a>
            <span onclick="layui.admin.onlyCopyTxt('{{item.prodPSku}}')" style="display: {{item.prodPSku ? 'inline-block':'none'}};cursor:pointer">
                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
            </span>
        ]</div>
    </div>
</script>
<script type="text/html" id="smt_online_storeSSku_tpl">
    <table class="layui-table colspantable" style="width: 490px;margin-left: -5px;" >
        {{#  layui.each(d.prodSyncSmtDtos, function(index, item){ }}
        {{#  if(index <1){ }}
        {{#  if(index ==d.prodSyncSmtDtos.length-1){ }}
        <tr style="">
            {{#  }else{ }}
        <tr style="border-bottom: 1px solid #e6e6e6 !important">
            {{#  } }}
            {{# }else{ }}
            {{#  if(index == d.prodSyncSmtDtos.length-1){ }}
        <tr style="display: none;" class="myj-hide">
            {{#  }else{ }}
        <tr style="border-bottom: 1px solid #e6e6e6 !important;display: none;" class="myj-hide">
            {{#  } }}
            {{# } }}
            <td style="width:140px;text-align: left;padding-left: 5px;">
                {{item.storeSubSku}}
                {{# if(item.isDiscontinued =='1'){ }}
                    <span class="hp-badge layui-bg-red fr" title="停售">停</span>
                {{# } }}
                {{# if(item.isAdjust){ }}
                <span class="hp-badge layui-bg-blue fr" title="待调价" style="width:40px;">调{{item.adjustIntervalDay || '' }}</span>
                {{# } }}
                {{#  if(item.isOutofStock){ }}
                <span class="hp-badge layui-bg-red fr layTitle" lay-title="暂缺货">暂</span>
                {{#  } }}
                </br>
                <div style="color: #999;" title="对应的基础子商品sku">
                    {{# if(item.prodSSku != null && item.prodSSku != '' ){ }}
                        <div> [
                            <a class="itemId" id="prodDetail_smtListing" prodPSku="{{item.prodPSku || '' }}" title="父商品详情"> {{ item.prodSSku || ''}}</a>
                            <span onclick="layui.admin.onlyCopyTxt('{{item.prodSSku}}')" style="display: {{item.prodSSku ? 'inline-block ':'none'}}; cursor:pointer">
                                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                            </span>
                        ]</div>
                    {{# }else{ }}
                        [
                            <a>{{item.prodSSku || ''}}</a>
                            <span onclick="layui.admin.onlyCopyTxt('{{item.prodSSku}}')" style="display: {{item.prodSSku ? 'inline-block':'none'}}; cursor:pointer">
                                <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                            </span>
                        ]
                    {{# } }}
                </div>
                {{# if(item.isSale =='0'){ }}
                    <span class="popoverHover myj-type-box" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" data-content="已下架" title="">下</span>
                {{# } }}
            </td>
            <td style="width:80px;text-align: center;"> {{item.sProperty || ''}}</td>
            <td style="width:60px;text-align: center;"> {{item.price || ''}}</td>
            <td style="width:60px;text-align: center;"> {{item.priceCny || ''}}</td>
            <td style="width:80px;text-align: center;"> {{item.ipmSkuStock }}</td>
            <td style="width:90px;text-align: center;font-size: 12px;"> {{ (item.preAvailableStockAll || 0)  + '/' + (item.preAvailableStock || 0) }}</td>
        </tr>
        {{#  }); }}
    </table>
    {{#  if(d.prodSyncSmtDtos.length > 1){ }}
    <a href="javascript:" onclick="smtOnline_changeColspantable(this);" class="productListSkuShow" style="float:right;">+ 展开</a>
    {{# } }}
</script>
<script type="text/html" id="smt_online_listingTime_tpl">
    <div >
        <span  style="color:#999;">刊登:</span><br> {{ Format(d.gmtCreate, "yyyy-MM-dd")}}
    </div>
    <span style="color:#999;">下架原因:</span>{{ d.wsDisplay || ''}}
</script>
<!-- 销量 -->
<script type="text/html" id="smt_online_sales_tpl">
        <div><span style="color: #999;" class="mr10">7天:</span>{{d.halfSevenSales || 0 }} / {{d.sevenSales || 0 }} / {{d.companySevenSalesNumTotal || 0 }}</div>
        <div><span style="color: #999;" class="mr10">30天:</span>{{d.halfThirtySales || 0 }} / {{d.thirtySales || 0 }} / {{d.companyThirtySalesNumTotal || 0 }}</div>
        <div><span style="color: #999;" class="mr10">60天:</span>{{d.halfSixtySales || 0 }} / {{d.sixtySales || 0 }} / {{d.companySixtySalesNumTotal || 0 }}</div>
        <div><span style="color: #999;" class="mr10">90天:</span>{{d.halfNinetySales || 0 }} / {{d.ninetySales || 0}} / {{d.companyNinetySalesNumTotal || 0 }}</div>
        <div><span style="color: #999;" class="mr10">180天:</span>{{d.halfOneHundredAndEightySales || 0 }} / {{d.oneHundredAndEightySales || 0 }} / _</div>
</script>
<script type="text/html" id="smt_online_freightTemplateId_tpl">
    <div >
        <!-- <span lay-tips="运费模板" > {{d.freightTemplateName || d.freightTemplateId }}</span><br>
        <span lay-tips="区域调价模板" style="color:#999;">{{d.regionPriceCode ||''}}</span> -->
        <div><span style="color:#999;" class="mr10">运费模板:</span>{{d.freightTemplateName || d.freightTemplateId }}</div>
        <div><span style="color:#999;" class="mr10">重量(kg):</span>{{d.grossWeight }}</div>
        {{# if(d.isRegionalPricing && d.regionPriceCode){ }}
            <div><span style="color: #999;" class="mr10">区域调价模板:</span>{{d.regionPriceCode ||''}}</div>
        {{# } }}
        <div><span style="color:#999;" class="mr10">单品折扣名称:</span>{{d.promotionName || ''}}</div>
    </div>
</script>
<!--需求备注-->
<script type="text/html" id="smt_online_listingRemark_tpl">
    <div style="text-align: left;text-indent: 2em;" class="smt_online_listingRemark_tip" listingRemark="{{d.listingRemark || ''}}">
            {{# if(d.listingRemark != null && d.listingRemark !='' ){ }}
            {{# if(d.listingRemark.length > 44){ }}
            {{d.listingRemark.substring(0,44)}}<span>... </span>
            {{# }else{ }}
            {{d.listingRemark}}
            {{# } }}
            {{# }else { }}
            &nbsp;
            {{# }}}
            &nbsp; &nbsp;   <i class="layui-icon update_sellerNote" title="修改标记备注" lay-event="smt_online_update_listingRemark"></i>
    </div>
</script>
<script type="text/html" id="smt_online_operate_tpl">
    <div class="smt_online_operate_handle">
        <div class="smt_online_operate_btn disN">
            <%--{{#  if(d.roleNames != null && (d.roleNames.join(",").indexOf('smt主管') > -1 || d.roleNames.join(",").indexOf('smt组长') > -1 )){ }}--%>
            <%--<a class="layui-btn  layui-btn-xs" lay-event="smt_online_marksOneItem" title="标记为待优化" marks="待优化" exmarks="优化完成">需要优化</a>--%>
            <%--{{# } }}--%>
            <%--<a class="layui-btn  layui-btn-xs" lay-event="smt_online_marksOneItem" title="标记为维护完成" marks="重点维护" exmarks="维护完成" >重点维护</a>--%>
            <%--<a class="layui-btn  layui-btn-xs" lay-event="smt_online_marksOneItem" title="优化完成" marks="优化完成" exmarks="待优化" >优化完成</a>--%>
            <%--<a class="layui-btn  layui-btn-xs" lay-event="smt_online_marksOneItem" title="调价完成" marks="调价完成" exmarks="需要调价">调价完成</a>--%>
            <%--<br />--%>
            <%--<a class="layui-btn  layui-btn-xs" lay-event="smt_online_marksOneItem" title="取消重点维护" marks="维护完成" exmarks="重点维护">维护完成</a>--%>
            <a class="layui-btn  layui-btn-xs" lay-event="smt_online_marksOneItem" title="取消亏损标记" marks="取消亏损标记" exmarks="亏损标记">取消亏损标记</a>
        </div>
    </div>
    <a class="layui-btn  layui-btn-xs" lay-event="smt_online_updateOneItem" title="从平台重新同步产品">更新</a><br>
    <a class="layui-btn  layui-btn-xs" lay-event="smt_online_showlog">日志</a><br>
    <a class="layui-btn  layui-btn-xs" lay-event="smt_online_update">修改</a>
</script>
<!-- 查看日志弹框 -->
<script type="text/html" id="smt_online_showlog_layer">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="smt_online_showlog_table" lay-filter="smt_online_showlog_table"></table>
        </div>
    </div>
</script>
<script type="text/html" id="smtOnline_aep_smtListingPriceTpl">
    <div style="padding:20px 50px 0 20px">
        <div class="layui-tab-item layui-show">
            <form id="smtOnline_aep_smtListingPrice" class="layui-form"  autocomplete="false" >
                <input type="hidden" name="prodPId" value="1">
                <div class="layui-row">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">成本(￥)</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="cost" value="" placeholder="商品成本">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">重量(g)</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="weight" value="" placeholder="商品重量">
                        </div>
                    </div>
                </div>
                <div class="layui-col-md3 layui-col-lg3">
                    <label class="layui-form-label">毛利率(%)</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="grossProfitRate" value="" placeholder="如20%,请直接填写20">
                    </div>
                </div>
                <div class="layui-col-md3 layui-col-lg3">
                    <label class="layui-form-label">优惠幅度(%)</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="discountRate" value="30">
                    </div>
                </div>
                <div class="layui-col-md3 layui-col-lg3">
                    <label class="layui-form-label">定价方式</label>
                    <div class="layui-input-block">
                        <select name="shippingType" lay-filter="smtOnline_aep_smtShippingType">
                        	<option value="">默认定价</option>
                            <option value="USD5_LESS_GENERAL"><5USD 普货</option>
                            <option value="SPECIAL">特货</option>
                            <option value="USD5_GREATER_GENERAL">≥5USD 普货</option>
                            <option value="GENERAL_OLD">普货（旧版）</option>
                            <option value="USD5_USD8_GENERAL">5-8美金普货</option>
                        </select>
                    </div>
                </div>

                <div class="layui-col-md2 layui-col-lg2 ">
                    <label class="layui-form-label"></label>
                    <div class="layui-input-block">
                        <button type="submit" lay-submit lay-filter="smtOnline_aep_smtListingPrice" class="layui-btn layui-btn-sm" >更新</button>
                    </div>
                </div>
            </form>
            <table class="layui-table" id="smtOnline_aep_smtListingPriceTable">
                <thead>
                <tr>
                    <th>模板子SKU</th>
                    <th>成本</th>
                    <th>重量</th>
                    <th>定价</th>
                    <th>刊登价</th>
                    <th>预估利润(&yen;)</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>

        </div>
    </div>
</script>
<script type="text/html" id="smt_online_online_export_container_script">
    <div id="smt_online_online_export_container"></div>
</script>
<!-- 导出字段配置 -->
<script type="text/html" id="smt_onlineproducts_exportSetting">
    <div class="layui-card smt_onlineproducts_exportSetting">
        <div class="layui-card-body">
            <form class="layui-form" action="" id="smt_online_exportSetting_form" lay-filter="smt_online_exportSetting_form">
           {{#layui.each(d,function(index,item){}}
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div class="mb10">
                            <span style="font-weight: bold;">{{item.name}}</span>
                            <input type="checkbox" name="{{item.key}}" lay-skin="switch" lay-text="全选|全选" lay-filter="{{'exportSetting_'+item.key}}" {{item.checked ?'checked':''}}>
                        </div>
                        <div class="exportSetting_grid">
                            {{#  layui.each(item.list,function(vIndex,v){}}
                            <div>
                                <input type="checkbox" name="{{'checkbox_'+item.key}}" title="{{v.name}}" lay-skin="primary" value="{{v.field}}" {{item.checked ?'checked':''}} lay-filter="{{'exportSetting_checkbox_'+item.key}}">
                            </div>
                                {{#   })}}
                        </div>
                    </div>
                </div>
                {{#  })}}
            </form>
            <div style="position: absolute;top:10px;right:44px">
                <div id="smt_online_exportSetting_save" class="inline_block pora"></div>
            </div>
        </div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smt_onlineproduct.js"></script>