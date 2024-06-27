<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>smt调整价格</title>
        <style>
            #LAY_adjustPriceProcess .layui-form-label {
                padding: 9px 5px;
            }

            #LAY_adjustPriceProcess .layui-form-item .layui-col-lg2 layui-col-md2 {
                margin-right: 0;
            }

            .dis_flex {
                display: flex;
                justify-content: space-between;
            }

            .w_100 {
                width: 100px;
            }

            #LAY_adjustPriceProcess .layui-form {
                margin: 0 10px;
            }

            #LAY_adjustPriceProcess .layui-form-checkbox span {
                line-height: inherit;
            }

            #LAY_adjustPriceProcess .layui-form-checkbox {
                line-height: 30px !important;
            }

            #smt_theShelves_countryList {
                display: flex;
                flex-wrap: wrap;
            }

            #smtadjustPriceProcess .layui-table-box {
                overflow: scroll;
            }

            #smtadjustPriceProcess .layui-table-header,
            #smtadjustPriceProcess .layui-table-body {
                overflow: visible;
            }

            #smtadjustPriceProcess .layui-table-body {
                height: 467px !important;
            }

            .numCount {
                border: 1px solid #e8e8e8;
                border-bottom: none;
                display: inline-block;
                padding: 0 5px;
                text-align: center;
                line-height: 30px;
            }

            .mg_10 {
                margin: 0 10px;
            }

            .smt-theShelves-checkAllhasVal .layui-form-checkbox {
                top: -5px;
            }

            .smt-theShelves-checkAllhasVal .layui-icon {
                right: 0;
                margin-top: 0;
            }
            #smtadjustPriceProcess .smt-theShelves-allcheck .layui-icon{
                right: 0;
                top: 5px;
            }
            #smtadjustPriceProcess .unit{
                /* font-weight: bold; */
                font-size: 16px;
            }
            #smtadjustPriceProcess .flexTd{
                display: flex;
                align-items: center;
            }
        </style>

        <div class="layui-fluid" id="smtadjustPriceProcess">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form id="smt_theShelves_searchForm" lay-filter="prod_search_form" class="layui-form">
                                <div class="layui-form-item" style="margin-bottom:0">
                                    <div class="layui-col-lg1 layui-col-md1">
                                        <select id="smtModPrice_is_pAnds_sku">
                                            <option value="0">商品子SKU</option>
                                            <option value="1">商品父SKU</option>
                                        </select>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1">
                                        <input type="text" name="skuList" class="layui-input"
                                            placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1">
                                        <select id="smt_idEnable_skuSearchType">
                                            <option value="1">精确</option>
                                        </select>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select id="smt_online_depart_sel" name="orgId" lay-search
                                                lay-filter="smt_online_depart_sel" class="orgs_hp_custom">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">销售人员</label>
                                        <div class="layui-input-block">
                                            <select name="saleName" id="smt_online_salesman_sel" lay-search
                                                lay-filter="smt_online_salesman_sel" class="users_hp_custom"
                                                data-rolelist="smt专员">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block">
                                            <select id="smt_online_store_sel" xm-select-search
                                                xm-select="smt_modifyMainPrice_store" lay-search
                                                lay-filter="smt_online_store_sel" class="store_hp_custom"
                                                data-platcode="aliexpress">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">单品折扣</label>
                                        <div class="layui-input-block">
                                            <select id="smt_modifyMainPrice_discount"
                                                xm-select="smt_modifyMainPrice_discount" lay-search xm-select-search>
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <label class="layui-form-label">运费模板</label>
                                        <div class="layui-input-block">
                                            <select id="smt_modifyMainPrice_freightTpl"
                                                xm-select="smt_modifyMainPrice_freightTpl" lay-search xm-select-search>
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 pl20">
                                        <button class="layui-btn layui-btn-sm keyHandle" type="button"
                                            data-type="reload" id="smtModifyPirceSearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm"
                                            id="smtModifyPirceResetBtn">清空</button>
                                    </div>
                                    <div class="layui-col-lg4 layui-col-md4">
                                        <label class="layui-form-label"></label>
                                        <div class="layui-input-block"></div>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                        <div class="layui-form-label">定价公式</div>
                                        <div class="layui-input-block">
                                            <select name="shippingType">
                                                <option value="">子SKU默认定价</option>
                                                <option value="BY_RULE" selected>Listing默认定价</option>
                                                <option value="USD5_LESS_GENERAL">&lt;5USD 普货</option>
                                                <option value="SPECIAL">特货</option>
                                                <option value="USD5_GREATER_GENERAL">≥5USD 普货</option>
                                                <option value="GENERAL_OLD">普货（旧版）</option>
                                                <option value="USD5_USD8_GENERAL">5-8美金普货</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <div class="layui-form-label">利润率%</div>
                                        <div class="layui-input-block">
                                            <input type="number" class="layui-input" name="grossProfitRate">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <div class="layui-form-label">优惠幅度%</div>
                                        <div class="layui-input-block">
                                            <input type="number" class="layui-input" name="discountRate">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 pl20">
                                        <button class="layui-btn layui-btn-sm" type="button"
                                            id="smt_modifyMainPrice_getPrice">定价</button>
                                    </div>
                                </div>
                                <div id="smtModMainPriceCustomsContent"></div>
                            </form>
                            <form id="applyForm" class="layui-form layui-clear">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label labelSel w120">
                                        <select name="priceType">
                                            <option value="curPrice">当前刊登价($)</option>
                                            <option value="curPriceCny">当前刊登价(￥)</option>
                                            <option value="newPrice">新刊登价($)</option>
                                            <option value="newPriceCny">新刊登价(￥)</option>
                                        </select>
                                    </label>
                                    <div class="layui-input-block" style="margin-left: 150px;">
                                        <select name="calculateType">
                                            <option value="1"><b>+</b></option>
                                            <option value="2">-</option>
                                            <option value="3" selected>*</option>
                                            <option value="4">=</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <input type="number" class="layui-input" name="newPriceInput">
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <button type="button" id="newPriceBtn"
                                        class="layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                                </div>
                                <div class="layui-col-md4 layui-col-lg4">
                                    <div class="layui-form-label labelSel w100">
                                        <select name="diffPriceType">
                                            <option value="price">差价（$）</option>
                                            <option value="priceCny">差价（￥）</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block disflex">
                                        <select name="opreator">
                                            <option value="">请选择</option>
                                            <option value=">">&gt;</option>
                                            <option value="&lt;">&lt;</option>
                                            <option value="=">=</option>
                                        </select>
                                        <input type="number" name='diffPrice' class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-md2 pl20">
                                    <button class="layui-btn layui-btn-sm" type="button"
                                        id="smtModifyMainPrice_search_byLocal">搜索</button>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset"
                                        id="smtModifyMainPrice_reset_byLocal">清空</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="layui-card">
                        <div class="layui-card-header disflex" style="background-color: #D7D7D7"
                            id="smt-theShelves-country-header">
                            <div class="disflex layui-form">
                                区域定价
                                <span class="ml10" style="color:#666">
                                    (不支持单个SKU调整，请全选调整，多子sku若未全选，则会导致其他子sku的区域价格被清空)
                                </span>
                                <div class="ml10 smt-theShelves-allcheck"><input type="checkbox" name="adjustPriceCountry" lay-skin="primary" 
                                    lay-filter="smt_theShelves_checkAllCountry" 
                                    value="allCheck" title="全选"/></div>
                            </div>
                            <div class="h100 w_100 smt-theShelves-tohideIcon"><i class="layui-icon">&#xe61a;</i></div>
                            <div class="h100 w_100 hidden smt-theShelves-toShowIcon"><i class="layui-icon">&#xe619;</i>
                            </div>
                        </div>
                        <div class="layui-card-body">
                            <form action="" class="layui-form" id="smt_theShelves_countryList">
                            </form>
                        </div>
                    </div>

                    <div class="layui-card">
                        <div class="disFCenter layui-card-header">
                            <div class="w_100 numCount" style="text-align:center;padding:0 5px;">数量(共<span
                                    id="tolnum_span_smt_price">0</span>条)</div>
                            <div>
                                <form action="" class="layui-form dis_flex">
                                    <select name="adjustType" id="smt_theShelves_adjustType">
                                        <option value="ECONOMYECONOMY">常见1:俄西经济</option>
                                        <option value="ECONOMYSIMPLE">常见2:俄经济西简易</option>
                                        <option value="SIMPLESIMPLE">常见3:俄西简易</option>
                                        <option value="STANDARDSIMPLE">常见4:俄标准西简易</option>
                                        <option value="STANDARDSTANDARD">常见5:全标准</option>
                                    </select>
                                    <button type="button" class="layui-btn layui-btn-sm"
                                        id="smt_theShelves_batchEstimateRegionPrice">估算区域定价</button>
                                    <div class="ml40 smt-theShelves-checkAllhasVal">
                                        <input type="checkbox" name="checkAllhasVal" lay-skin="primary"
                                            lay-filter="smt_theShelves_checkAllhasVal" value="true" title="只修改已有值"
                                            checked />
                                    </div>
                                </form>
                            </div>
                            <div class="dis_flex">
                                <button type="button" id="smt_theShelves_batchUpadatePrice"
                                    class="layui-btn layui-btn-normal layui-btn-sm">仅调刊登价</button>
                                <button type="button" id="smt_theShelves_batchUpadateRegionPrice"
                                    class="layui-btn layui-btn-normal layui-btn-sm">仅区域调价</button>
                                <button type="button" id="smt_theShelves_batchUpadateBothPrice"
                                    class="layui-btn layui-btn-normal layui-btn-sm">调整刊登价和区域价</button>
                            </div>
                        </div>
                        <div class="layui-card-body">
                            <!-- 表格的数据渲染 -->
                            <table class="layui-table" id="smtModifyPriceTable" lay-filter="smtModifyPriceTable">
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script type="text/html" id="smtModifyPriceTable_sales">
   {{# if(d.thirtySales != null && d.thirtySales !=undefined){ }}
        <div>{{d.thirtySales}}</div>
    {{# } }}
</script>

<!-- 当前刊登价 -->
<script id="smtModifyPriceTable_curPrice_tpl" type="text/html">
    <div>
        <span class="unit">$</span>
        <span class="price">{{d.price}}</span></div>
    <div>
        <span class="unit">￥</span>
        <span class="priceCny">{{d.priceCny!==undefined ? d.priceCny :''}}</span>
    </div>
</script>

<!-- 新刊登价 -->
<script id="smtModifyPriceTable_newPrice_tpl" type="text/html">
    <div class="flexTd">
        <div class="unit w20">$</div>
        <input type="number" class="layui-input" style="height:28px" id="{{'smtModifyPriceTable_newPrice'+d.id}}" onblur="smtModifyPriceTable_newPriceBlur(this)" name="adjustPrice" value="{{d.newPrice!=undefined?d.newPrice:''}}" 
        />
    </div>
    <div class="flexTd">
        <div class="unit w20">￥</div>
        <input type="number" class="layui-input" style="height:28px" id="{{'smtModifyPriceTable_newPriceCny'+d.id}}" 
        onblur="smtModifyPriceTable_newPriceCnyBlur(this)" name="adjustPriceCny" value="{{d.newPriceCny!=undefined?d.newPriceCny:''}}" 
        />
    </div>
</script>

<!-- 差价 -->
<script id="smtModifyPriceTable_diffPrice_tpl" type="text/html">
    <div>
        <span class="unit">$</span>
        <span class="price">{{d.price}}</span>
    </div>
    <div>
        <span class="unit">￥</span>
        <span class="priceCny">{{d.priceCny!==undefined ? d.priceCny :''}}</span>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtModifyMainPrice.js"></script>