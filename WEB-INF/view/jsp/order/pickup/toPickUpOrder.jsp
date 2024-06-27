<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>待包装订单</title>
<style>
    .fr {
        float: right;
    }


    .ml {
        margin-left: 10px;
    }

    .fr {
        float: right;
    }

    .mr10 {
        margin-right: 10px;
    }

    .hidden {
        display: none;
    }

    .dis_flex {
        display: flex;
        justify-content: flex-start;
    }

    .dis_flex_space {
        display: flex;
        justify-content: space-between;
    }

    .mg_50 {
        margin: 20px 50px;
    }
    .hide {
        display: none;
    }

    .select_label {
        padding: 0px!important;
    }

    .gray {
        color: gray;
    }
    .externalContainAuditorder {
        position: relative;
        width: 0;
        float: left;
        height: 0;
        z-index: 20190918;
    }

    .externalPopAuditorder {
        clear: left;
        position: relative;
        left: -35.667vw;
        top: 40px;
        width: 35vw;
        border: 1px solid #e6e6e6;
        background-color: lightyellow;
        padding: 20px 0;
        border-radius: 5px;
        box-shadow: 1px 1px 1px grey;
    }

    .externalBox {
        width: 85%;
        line-height: 32px;
        text-align: center;
        border: 1px solid #e6e6e6;
        margin-left: 15%;
        cursor: pointer;
    }

    .externalBox:hover {
        border: 1px solid grey;
    }

    .refresh_icon {
        margin-left: 5px;
        cursor: pointer;
    }
</style>
<div class="layui-fluid" id="LAY-toPickUpOrder">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="toPickUporderForm" lay-filter="toPickUporderForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">订单时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="toPickUporder_time" name="time" lay-verify="required" readonly>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select name="platCode" lay-filter="platCodes_toPickUpOrder" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${platCodeList}" var="plat">
                                            <option value="${plat.name}">${plat.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctIds" id="storeAcct_toPickUpOrder" xm-select="storeAcct_toPickUpOrder" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter="" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">订单标签</label>
                                <div class="layui-input-block">
                                    <select name="orderNote" id="" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单编号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="orderIds" class="layui-input" placeholder="多个编号使用逗号隔开">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺单号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="platOrderIds" class="layui-input" placeholder="多个单号使用逗号隔开">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label select_label ml">
                                    <select name="skuType">
                                        <option value="prodSSkus">商品SKU(模糊)</option>
                                        <option value="storeSSkus">店铺SKU(模糊)</option>
                                        <option selected value="exactProdSSkus">商品SKU(精确)</option>
                                        <option value="exactStoreSSkus">店铺SKU(精确)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="skuvalue" class="layui-input" placeholder="支持多个">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select name="prodLogisAttrs" id="logisAttrs" xm-select="logisAttrs" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">SKU个数</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="skuQuantityMin" class="layui-input">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="skuQuantityMax" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">商品数量</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="prodQuantityMin" class="layui-input">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="prodQuantityMax" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="prodIsSale">
                                        <option value="">全部</option>
                                        <option value="0">在售</option>
                                        <option value="1">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">LlistingID</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="itemIds" placeholder="多个单号使用逗号隔开">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">国家/地区</label>
                                <div class="layui-input-block">
                                    <select name="shippingCountryCodes" id="shippingCountrys" xm-select="shippingCountrys" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                        <option></option>
                                        <c:forEach items="${countryList}" var="country">
                                            <option value="${country.enSimpleName}">${country.cnName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">买家指定物流</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="buyerRequireShippingType">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">订单金额</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="platOrderAmtMin" class="layui-input">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="platOrderAmtMax" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">单品金额</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="platUnitPriceMin" class="layui-input">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="platUnitPriceMax" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding:0px 0px 0px 5px">
                                    <select name="companyType" lay-filter="companyType">
                                        <option value="companys">物流公司</option>
                                        <option value="agents">货代公司</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select type="text" name="" id="company_toPickUpOrder" lay-filter="company" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">物流方式</label>
                                <div class="layui-input-block">
                                    <select name="logisTypeIds" id="logisTypeIds" lay-filter="logisTypeIds" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">发货跟踪号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="" class="layui-input" placeholder="">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">标记发货</label>
                                <div class="layui-input-block">
                                    <select name="markShippingStatus">
                                        <option value=""></option>
                                        <option value="0">未标记</option>
                                        <option value="1">已标记</option>
                                        <option value="2">标记失败</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderStr">
                                        <option value="order_time_cn asc">订单时间正序</option>
                                        <option value="order_time_cn desc">订单时间倒序</option>
                                        <option value="logis_apply_time asc">申请跟踪号时间正序</option>
                                        <option value="logis_apply_time desc">申请跟踪号时间倒序</option>
                                        <option value="plat_order_amt asc">订单金额正序</option>
                                        <option value="plat_order_amt desc">订单金额倒序</option>
                                        <option value="profit asc">利润正序</option>
                                        <option value="profit desc">利润倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 dis_flex_space">
                                <div class="externalBox" id="showMoreSearchCondition_toPickUpOrder">更多查询条件
                                    <span id="hide_icon_toPickUporder" class="fr mr10 hidden">︽</span>
                                    <span id="show_icon_toPickUporder" class="fr mr10">︾</span>
                                </div>
                                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit="" id="toPickUpOrderSearch" lay-filter="toPickUpOrderSearch">查询</button>
                            </div>
                            <div class="externalContainAuditorder disN">
                                <div class="externalPopAuditorder">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">买家账号</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="buyerUserId" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">收件人</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="shippingUsername" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">发货仓库</label>
                                            <div class="layui-input-block">
                                                <select name="storeId" lay-search>
                                                    <option value=""></option>
                                                    <c:forEach items="${wareHouseList}" var="store">
                                                        <option value="${store.id}">${store.warehouseName}</option>
                                                    </c:forEach>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">平台交易ID</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="platTransactionIds" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">付款邮箱</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="buyerEmail" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">收款邮箱</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="sellerEmail" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">开发专员</label>
                                            <div class="layui-input-block">
                                                <select name="preprodDevId" lay-search>
                                                    <option value=""></option>
                                                    <c:forEach items="${bizzOwners}" var="bizzOwner">
                                                        <option value="${bizzOwner.id}">${bizzOwner.userName}</option>
                                                    </c:forEach>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">采购专员</label>
                                            <div class="layui-input-block">
                                                <select name="purchasingAgentId" lay-search>
                                                    <option value=""></option>
                                                    <c:forEach items="${buyers}" var="buyer">
                                                        <option value="${buyer.id}">${buyer.userName}</option>
                                                    </c:forEach>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input class="disN" type="text" name="processStatus" value="120">
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <div class="">
                        <div class="fl">
                            <div class="layui-tab" lay-filter="toPickUpOrder_Tab" id="toPickUpOrder_Tab">
                                <ul class="layui-tab-title">
                                    <li class="layui-this" data-processStatus="120">待拣货<span></span></li>
                                    <li data-processStatus="125">待核单<span></span></li>
                                    <li data-processStatus="130">待包装<span></span></li>
                                    <li data-processStatus="135">仓库缺货<span></span></li>
                                </ul>
                            </div>
                        </div>
                        <div class="fr">
                            <permTag:perm funcCode="toPickUpOrder_setPickBatch">
                                <div class="layui-btn layui-btn-sm" id="toPickUpOrder_matchPackSpecification">匹配包装规格</div>
                            </permTag:perm>
                            <permTag:perm funcCode="toPickUpOrder_setPickBatch">
                                <div class="layui-btn layui-btn-sm" id="toPickUpOrder_setPickBatch">设置分拣批次</div>
                            </permTag:perm>
                            <permTag:perm funcCode="toPickUpOrder_pickGoods">
                                <div class="layui-btn layui-btn-sm" id="toPickUpOrder_pickGoods">配货</div>
                            </permTag:perm>
                            <permTag:perm funcCode="toPickUpOrder_changeToLackWaitPack">
                                <%--<div class="layui-btn layui-btn-sm" id="toPickUpOrder_changeToLackWaitPack">转缺货待包装</div>--%>
                            </permTag:perm>
                            <permTag:perm funcCode="toPickUpOrder_MarkException">
                                <div class="layui-btn layui-btn-sm" id="toPickUpOrder_MarkException">标记异常</div>
                            </permTag:perm>
                            <permTag:perm funcCode="toPickUpOrder_singleScan">
                                <div class="layui-btn layui-btn-sm" id="toPickUpOrder_singleScan">单品扫描核单</div>
                            </permTag:perm>
                            <permTag:perm funcCode="toPickUpOrder_multipleMatchBasket">
                                <div class="layui-btn layui-btn-sm" id="toPickUpOrder_multipleMatchBasket">多品投篮</div>
                            </permTag:perm>
                            <permTag:perm funcCode="toPickUpOrder_multiplePackWeight">
                                <div class="layui-btn layui-btn-sm" id="toPickUpOrder_multiplePackWeight">捆单称重</div>
                            </permTag:perm>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table lay-filter="toPickUpOrder_table" class="layui-table" id="toPickUpOrder_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="toPickUporder_id_tpl">
    <div class="showContent">
        <input type="hidden" class="toPickUpOrder_col_id" value="{{d.id}}">
        <div>{{d.id || ''}}<span class="gray">{{d.allrootAliasName ? ('「' + d.allrootAliasName + '」') : ''}}</span>
            {{# if(d.operOrderType == "1"){ }}
            <span class="hp-badge layui-bg-orange fr" title="拆出订单">拆</span>
            {{# }else if(d.operOrderType=="2"){ }}
            <span class="hp-badge layui-bg-orange fr" title="合并订单">合</span>
            {{# } }}
        </div>
        <div><a>{{d.platOrderId}}{{# if(d.platStoreOrderId){ }}({{d.platStoreOrderId}}){{# }}}</a></div>
    </div>
</script>
<!-- 表格渲染模板 -->
<script type="text/html" id="FBAdelivery_imageTpl">
    <div>
        <img width="60" height="60" data-original="{{d.image||d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<script type="text/html" id="toPickUporder_platOrderAmt_tpl">
    <div><span>{{d.currency||""}}</span><span>{{d.platOrderAmt||""}}</span></div>
    <div><span class="gray">利润(RMB)</span><span>{{d.profit||""}}</span></div>
    <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
</script>

<script type="text/html" id="toPickUporder_prodQuantity_tpl">
    <div><span class="gray">种类：</span><span>{{d.skuQuantity||""}}</span></div>
    <div><span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span></div>
    <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
</script>

<script type="text/html" id="toPickUporder_shippingUsername_tpl">
    <div>{{d.shippingUsername||""}}</div>
    <div>[{{d.shippingCountryCnName||""}}]</div>
</script>

<script type="text/html" id="toPickUporder_logisTypeName_tpl">
    <div><span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}</span></div>
    <div><span class="gray">发货:</span><span>[{{d.logisTypeName||""}}]</span><span>[{{d.logisTrackingNo||""}}]</span></div>
</script>

<script type="text/html" id="toPickUporder_time_tpl">
    <div><span class="gray">订单:</span><span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})</span></div>
    <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
</script>


<script type="text/html" id="toPickUporder_option_tpl">
    <%--<button class="layui-btn layui-btn-xs" lay-event="toPickUpOrder_modify">修改订单</button>--%>
    <%--<button class="layui-btn layui-btn-xs" lay-event="toPickUporder_demolition">拆分订单</button>--%>
    <%--<button class="layui-btn layui-btn-xs" lay-event="">邮件</button>--%>
    <%--<button class="layui-btn layui-btn-xs" lay-event="toPickUpOrder_remark">备注</button>--%>
</script>

<script type="text/html" id="toPickUporder_detail_img_tpl">
    <div>
        <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    </div>
</script>

<script type="text/html" id="add_product_img">
    <div>
        <img width="60" height="60" data-original="{{d.image||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<script type="text/html" id="add_product_psku">
    <div>{{d.parent.pSku}}</div>
</script>

<script type="text/html" id="orginal_order_products">
    <div class="dis_flex">
        <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
        <div>
            <div>{{d.prodSSku||""}}</div>
            <div>{{d.prodSSku||""}}</div>
            <div><span>Color</span>{{d.style||""}}</div>
        </div>
        <div><span>×</span><span>{{d.platQuantity||""}}</span></div>
    </div>
</script>
<script type="text/html" id="orginal_order_stock">
    <div><span class="gray">库存sku：{{d.availableStock||"0"}}</span></div>
    <div><span class="gray">当前数量：{{d.prodQuantity||"0"}}</span></div>
</script>

<script type="text/html" id="toPickUporder_platOrderStatus_tpl">
    <div><span class="gray">留言：{{d.buyerNote||""}}</span></div>
    <!-- <div><span class="gray">标记发货：{{d.markShippingStatus || '' }} -->
    <div><span class="gray">标记发货：{{#  if(d.markShippingStatus == 0){ }}
        未标记
    {{#  } else if(d.markShippingStatus == 1) { }}
        已标记
    {{#  } else if(d.markShippingStatus == 2) { }}
        标记失败
    {{#  } }}   </span></div>
    <div><span class="gray">订单标签：</span></div>
    <div><span class="gray">订单状态：{{d.platOrderStatus||""}}</span></div>
    <div><span class="gray">打印面单状态：</span></div>
</script>

<script type="text/html" id="orginal_order_demolition">
    <input type="checkbox" class="layui-input" lay-filter="isDemolition" name="isDemolition">
</script>

<script type="text/html" id="orginal_order_number">
    <input type="number" class="layui-input" name="demolitionQuality">
</script>

<script type="text/html" id="toPickUporder_edit_ListingID">
    <input type="text" class="layui-input" name="" value="{{d.itemId||''}}">
</script>

<!-- <script type="text/html" id="toPickUporder_edit_Prodsku"> -->
<!-- <input type="text" class="layui-input" name="" value="{{d.prodSSku}}">
</script> -->
<!-- 订单详情 -->
<script type="text/html" id="pop_toPickUporder_detail">
    <div class="mg_50">
        <table class="layui-table" id="toPickUporder_detail_table" lay-filter="toPickUporder_detail_table"></table>
    </div>
</script>
<script type="text/html" id="toPickUporder_edit_storeSSku">
    <div class="dis_flex">
        <input type="text" class="layui-input" name="" value="{{d.storeSSku||''}}">
        <i class="layui-icon refresh_icon">&#xe669;</i>
    </div>
</script>

<script type="text/html" id="toPickUporder_edit_platUnitPrice">
    <input type="number" class="layui-input" name="" value="{{d.platUnitPrice||0}}">
</script>

<script type="text/html" id="toPickUporder_edit_platQuantity">
    <input type="number" class="layui-input" name="" value="{{d.platQuantity||0}}">
</script>

<script type="text/html" id="toPickUporder_edit_platOrderDetailAmt">
    <input type="number" class="layui-input" value="{{d.platOrderDetailAmt||0}}">
</script>

<!-- 生成拣货批次 -->
<script type="text/html" id="toPickUporder_generatePickUpBatchPop">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="generatePickUpBatchSearchForm" lay-filter="generatePickUpBatchSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">拣货楼栋</label>
                                <div class="layui-input-block">
                                    <select name="buildingNo">
                                        <option value=""></option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="9">9</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">拣货楼层</label>
                                <div class="layui-input-block">
                                    <select name="floorNo">
                                        <option value=""></option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="9">9</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">临近库位</label>
                                <div class="layui-input-block">
                                    <select name="ifNearArea">
                                        <option value="">不限库位</option>
                                        <option value="true">临近库位</option>
                                        <option value="false">非临近库位</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">拣货人</label>
                                <div class="layui-input-block">
                                    <select name="prePickerId">
                                        <option value=""></option>
                                        <c:forEach items="${pickers}" var="picker">
                                            <option value="${picker.id}">${picker.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select name="platCodeList"  xm-select="platCode_generatePickUpBatchSearchForm" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='platCode_generatePickUpBatchSearchForm'>
                                        <option></option>
                                        <c:forEach items="${platCodeList}" var="plat">
                                            <option value="${plat.name}">${plat.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">分拣单号</label>
                                <div class="layui-input-block">
                                    <input name="batchNo" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单类型</label>
                                <div class="layui-input-block">
                                    <select name="orderType" lay-filter="orderType_generatePickUpBatchSearchForm">
                                        <option value=""></option>
                                        <option value="1">单品订单</option>
                                        <option value="3">多品订单</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单数量</label>
                                <div class="layui-input-block">
                                    <input name="orderAmount" value="100" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">物流方式集</label>
                                <div class="layui-input-block">
                                    <%--<select name="logistTypeCollectionId"   xm-select="logistTypeCollectionId_generatePickUpBatchSearchForm" lay-filter='logistTypeCollectionId_generatePickUpBatchSearchForm' xm-select-search xm-select-search-type="dl" xm-select-skin="normal">--%>
                                    <select name="logistTypeCollectionId" lay-filter="logistTypeCollectionId_generatePickUpBatchSearchForm" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${logistTypeCollectionList}" var="logistTypeCollection">
                                            <option value="${logistTypeCollection.id}">${logistTypeCollection.collectionName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">物流方式</label>
                                <div class="layui-input-block">
                                    <select name="logistTypeIdList"   xm-select="logistTypeIdList_generatePickUpBatchSearchForm" lay-filter='logistTypeIdList_generatePickUpBatchSearchForm' xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="fl ml20">
                                    <div class="layui-btn layui-btn-sm" id="searchOrderBtn_generatePickUpBatchSearchForm">查询</div>
                                    <div class="layui-btn layui-btn-sm" id="generateBatchBtn_generatePickUpBatchSearchForm">生成分拣单</div>
                                    <div class="layui-btn layui-btn-sm" id="searchPickBatchBtn_generatePickUpBatchSearchForm">查询分拣单</div>
                                </div>
                                <div class="fr">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" style="height: 90%;">
                <%--<div class="layui-card-header"></div>--%>
                <div class="layui-card-body">
                    <table class="layui-table" id="pickUpOrderBatch_toPickUpOrder" lay-filter="pickUpOrderBatch_toPickUpOrder"></table>
                </div>
            </div>
        </div>
    </div>
</script>

<%--配货--%>
<script type="text/html" id="toPickUporder_pickUpPop">
    <div>
        <div class="leftBody">
            <div class="layui-card">
                <div class="layui-card-body" style="padding: 0;margin: 0">
                    <table class="layui-table" id="toPickUporder_pickGoodsShowTable" lay-filter="toPickUporder_pickGoodsShowTable"></table>
                </div>
            </div>
        </div>
        <div class="rightBody">
            <form class="layui-form" id="toPickUpOrder_ToPickSearchForm" lay-filter="toPickUpOrder_ToPickSearchForm">
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">拣货条件</label>
                        <div class="layui-input-block">
                            <div class="layui-col-md4 layui-col-lg4">
                                <select name="buildingNo">
                                    <option value="">楼栋</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="9">9</option>
                                </select>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <select name="floorNo">
                                    <option value="">楼层</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="9">9</option>
                                </select>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <select name="orderType" >
                                    <option value="1" selected>单品订单</option>
                                    <option value="3">多品订单</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">拣货人</label>
                        <div class="layui-input-block">
                            <div class="layui-col-md8 layui-col-lg8">
                                <input name="actPickerId" value="${currentUser.id}" class="hidden">
                                <input name="actPicker" value="${currentUser.userName}" class="layui-input disAbleInp" disabled>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">分拣单号</label>
                        <div class="layui-input-block">
                            <div class="layui-col-md8 layui-col-lg8">
                               <input name="batchNo" class="layui-input disAbleInp" disabled>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">&nbsp</div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-btn layui-btn-sm" id="getOrRobPickUpOrderBtn">获取</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">顺序号</label>
                        <div class="layui-input-block">
                            <div class="layui-col-md8 layui-col-lg8">
                               <input name="sortNumber" class="layui-input disAbleInp" disabled>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">库位</label>
                        <div class="layui-input-block">
                            <div class="layui-col-md8 layui-col-lg8">
                                <input name="stockLocation" class="layui-input disAbleInp" disabled>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">当前SKU</label>
                        <div class="layui-input-block">
                            <div class="layui-col-md8 layui-col-lg8">
                                <input name="sSku" class="layui-input" title="回车即可显示信息" placeholder="回车即可显示信息">
                                <input name="prodSId" hidden>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">库存数量</label>
                        <div class="layui-input-block">
                            <div class="layui-col-md8 layui-col-lg8">
                                <input name="currentStock" class="layui-input disAbleInp" disabled>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">实拣数量</label>
                        <div class="layui-input-block">
                            <div class="layui-col-md8 layui-col-lg8">
                                <input name="actAmount" class="layui-input" title="回车即可拣货完成" placeholder="回车即可拣货完成">
                                <input name="amount" hidden>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label" style="color: red;">应拣数量</label>
                        <div class="layui-input-block">
                            <div class="layui-col-md8 layui-col-lg8">
                                <div id="toPickUpOrder_needPickAmount"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12" style="text-align:center">
                        <div class="layui-btn layui-btn-sm" id="toPickUpOrder_pickFinish">拣货完成</div>
                        <div class="layui-btn layui-btn-sm" id="toPickUpOrder_lackWaitPick" title="缺货待拣，先满足需求数小且无其他sku缺货的订单，这些订单状态标为拣货完成，剩下不能满足的订单转为缺货待拣。然后返回已标记拣货完成的订单需求总数，多出部分放回">
                            缺货待拣
                            <i class="layui-icon layui-icon-about" id="toPickUpOrder_helperTip"></i>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12" style="text-align:center">
                    <img id="toPickUpOrder_CurrentSkuImage" class="img_show_hide" width="250" height="250">
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<%--单品核单--%>
<script type="text/html" id="toPickUpOrder_singleCheckPop">
    <div id="toPickUpOrder_singleCheckBody">
        <div class="leftBody_checkSingle">
            <div class="layui-card">
                <div  class="layui-card-body" style="padding: 0;margin: 0">
                    <div class="leftOperDiv">
                        <form class="layui-form" id="toPickUpOrder_singleCheckOperForm" lay-filter="toPickUpOrder_singleCheckOperForm">
                            <div class="layui-col-md12 layui-col-lg12 ml20">
                                <div class="fl" style="width: 460px;">
                                    <div class="fl mb10" style="width: 460px;">
                                        <div class="fl" style="width: 180px;">
                                            <div class="layui-btn layui-btn-sm" id="confirmCheckSingleBtn">核单完成</div>
                                            <div class="layui-btn layui-btn-sm" id="removeScanInfoBtn">移除单据</div>
                                        </div>
                                        <div class="fl operBox" style="width: 240px;">
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <input lay-filter="singleCheckConf" type="checkbox" name="ifAutoSubmit" title="核单称重" lay-skin="primary">
                                            </div>
                                            <div class="layui-col-md3 layui-col-lg3">
                                                <input lay-filter="singleCheckConf" type="number" name="autoSubmitAmount" style="width: 40px"  min="1" value="1"  onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
                                            </div>
                                            <div class="layui-col-md4 layui-col-lg4">
                                            条自动提交
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <%--<input type="checkbox" title="按物流方式排序优先" lay-skin="primary">--%>
                                        <%--<input type="checkbox" title="按交易时间排序" lay-skin="primary">--%>
                                        <div class="layui-btn layui-btn-sm" id="markLackBtn">标记少货</div>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div><input lay-filter="singleCheckConf" title="核单后打印" type="checkbox" name="ifAutoPrint" lay-skin="primary"></div>
                                    <div><input lay-filter="singleCheckConf" title="直接打印物流PDF" type="checkbox" name="ifPrintLogisPDF" lay-skin="primary"></div>
                                    <div><input lay-filter="singleCheckConf" title="按物流方式打印" type="checkbox" name="printAsLogisModel" lay-skin="primary"></div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">打印模板</label>
                                    <div class="layui-input-block">
                                        <select name="printTemplet">
                                            <option></option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="leftTableDiv">
                        <div class="layui-card">
                            <div class="layui-card-body" style="padding: 0;margin: 0">
                                <table class="layui-table" id="toPickUpOrder_singleCheckTable" lay-filter="toPickUpOrder_singleCheckTable"></table>
                            </div>
                            <div class="layui-card-body" style="padding: 0;margin: 0">
                                <div id="toPickUpOrder_checkSingleLeftSaleDetailDiv" class="fl" style="width: 60%;border: 1px solid gainsboro">
                                    <div class="layui-col-md11 layui-col-lg11 ml10">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <img class="img_show_hide" width="100" height="100" name="image">
                                        </div>
                                        <div class="layui-col-md9 layui-col-lg9">
                                            <label class="layui-form-label">单号</label>
                                            <div class="layui-input-block">
                                                <input name="tradeOrderId" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md9 layui-col-lg9">
                                            <label class="layui-form-label">商品sku</label>
                                            <div class="layui-input-block">
                                                <input name="prodSSku" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md9 layui-col-lg9">
                                            <label class="layui-form-label">商品ITEMID</label>
                                            <div class="layui-input-block">
                                                <input name="itemId" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md12 layui-col-lg12">
                                            <label class="layui-form-label">商品名称</label>
                                            <div class="layui-input-block">
                                                <input name="prodTitle" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <%--<div class="layui-col-md12 layui-col-lg12">--%>
                                            <%--<label class="layui-form-label">配货名称</label>--%>
                                            <%--<div class="layui-input-block">--%>
                                                <%--<input name="tradeOrderId" class="layui-input" readonly>--%>
                                            <%--</div>--%>
                                        <%--</div>--%>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">销售数</label>
                                            <div class="layui-input-block">
                                                <input name="prodQuantity" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">规格</label>
                                            <div class="layui-input-block">
                                                <input name="specification" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">型号</label>
                                            <div class="layui-input-block">
                                                <input name="model" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">款式</label>
                                            <div class="layui-input-block">
                                                <input name="style" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">单位</label>
                                            <div class="layui-input-block">
                                                <input name="unit" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">包装规格</label>
                                            <div class="layui-input-block">
                                                <input name="packSpecification" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <label class="layui-form-label">库位</label>
                                            <div class="layui-input-block">
                                                <input name="locationCode" class="layui-input" readonly>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fl" style="width: 38%;border: 1px solid gainsboro" id="toPickUpOrder_checkSingleRightSaleDetailDiv">
                                    <div class="layui-col-md11 layui-col-lg11 ml10">
                                        <div class="layui-col-md12 layui-col-lg12">
                                            <label class="layui-form-label">单号</label>
                                            <div class="layui-input-block">
                                                <input name="tradeOrderId" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md12 layui-col-lg12">
                                            <label class="layui-form-label">商品sku</label>
                                            <div class="layui-input-block">
                                                <input name="sSku" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md12 layui-col-lg12">
                                            <label class="layui-form-label">商品名称</label>
                                            <div class="layui-input-block">
                                                <input name="title" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md12 layui-col-lg12">
                                            <label class="layui-form-label">核查数</label>
                                            <div class="layui-input-block">
                                                <input name="checkedNum" class="layui-input" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md12 layui-col-lg12">
                                            <label class="layui-form-label">包装规格</label>
                                            <div class="layui-input-block">
                                                <input name="packSpecification" class="layui-input" readonly>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="rightBody_checkSingle">
            <form class="layui-form" id="toPickUpOrder_singleCheckSelectForm" lay-filter="toPickUpOrder_singleCheckSelectForm">
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">物流方式集</label>
                    <div class="layui-input-block">
                        <select name="logistTypeCollectionId" lay-filter="logistTypeCollectionId_toPickUpOrder_singleCheckSelectForm" lay-search>
                            <option value=""></option>
                            <c:forEach items="${logistTypeCollectionList}" var="logistTypeCollection">
                                <option value="${logistTypeCollection.id}">${logistTypeCollection.collectionName}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">物流方式</label>
                    <div class="layui-input-block">
                        <select name="logistTypeIdList" xm-select="logistTypeIdList_toPickUpOrder_singleCheckSelectForm" lay-filter='logistTypeIdList_toPickUpOrder_singleCheckSelectForm' xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12" notNull>
                    <label class="layui-form-label">批次号</label>
                    <div class="layui-input-block">
                        <input name="batchNo" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">sku扫描</label>
                    <div class="layui-input-block">
                        <input name="skuScan" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md9 layui-col-lg9">
                    <label class="layui-form-label">物品sku</label>
                    <div class="layui-input-block">
                        <input name="sku" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <input name="checkedNum" type="number" class="layui-input" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" >
                </div>
                <div class="layui-col-md1 layui-col-lg1">
                    <span name="unit" style="color: red;font-size: 20px">个</span>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">订单号</label>
                    <div class="layui-input-block">
                        <input name="tradeOrderId" class="layui-input disAbleInp" disabled>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">跟踪号</label>
                    <div class="layui-input-block">
                        <input name="logisTrackingNo" class="layui-input disAbleInp" disabled>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">包裹重量(g)</label>
                    <div class="layui-input-block">
                        <input name="realWeight" type="number" class="layui-input" >
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12" style="border: 1px solid gainsboro">
                    <%--<input name="ifOnlyReceivePick" type="checkbox" title="限定收货分拣" lay-skin="primary">--%>
                    <input lay-filter="singleCheckConf" name="remindOver2kg" type="checkbox" title="大于2kg提醒" lay-skin="primary">
                    <input lay-filter="singleCheckConf" name="countLogisFee" type="checkbox" title="计算运费" lay-skin="primary">
                    <input lay-filter="singleCheckConf" name="defaultAllAmount" type="checkbox" title="数量默认全部" lay-skin="primary">
                    <%--<input name="NoRemindWhenWeightError" type="checkbox" title="称重错误不提示，只停留光标" lay-skin="primary">--%>
                    <input lay-filter="singleCheckConf" name="theoryWeight" type="checkbox" title="理论重量" lay-skin="primary">
                    <%--<input name="getWeightType" value="defaultWeight" type="checkbox" title="默认" lay-skin="primary">--%>
                    <%--<input name="getWeightType" value="autoGetPackageWeight" type="checkbox" title="自动获取包裹重量" lay-skin="primary">--%>
                    <%--<input name="allowCheckWhenLack" type="checkbox" title="少货批次核单" lay-skin="primary">--%>
                    <%--<input name="remindWhenNoLogisTrackingNo" type="checkbox" title="打印时跟踪号为空提示" lay-skin="primary">--%>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">收件人</label>
                    <div class="layui-input-block">
                        <input name="shippingUsername" class="layui-input disAbleInp" disabled>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">国家/地区</label>
                    <div class="layui-input-block">
                        <input name="shippingCountryCnName" class="layui-input disAbleInp" disabled>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">物流方式</label>
                    <div class="layui-input-block">
                        <input name="logisTypeName" class="layui-input disAbleInp" disabled>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<%--多品投篮--%>
<script type="text/html" id="toPickUpOrder_MultiplePreCheckPop">
    <div id="toPickUpOrder_MultiplePreCheckBody">
        <div id="toPickUpOrder_MultiplePreCheckLeftBody">
            <div id="toPickUpOrder_MultiplePreCheckLeftBody_head">
                <form class="layui-form" id="toPickUpOrder_multiplePreCheckOperForm" lay-filter="toPickUpOrder_singleCheckOperForm">
                    <div class="layui-col-md12 layui-col-lg12 ml10">
                        <div class="layui-col-md1 layui-col-lg1">
                                <div class="layui-btn layui-btn-sm">移除单据</div>
                        </div>
                        <div class="layui-col-md1 layui-col-lg1">
                            <div class="layui-btn layui-btn-sm">标记缺货</div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                            <input name="printAsLogisType" type="checkbox" title="按物流方式打印" lay-skin="primary">
                            <input name="printLogisPDF" type="checkbox" title="直接打印物流PDF" lay-skin="primary">
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                            <input name="deleteWhenFinish" type="checkbox" title="核完一单删除一单" lay-skin="primary">
                            <input name="sayWhenScan" type="checkbox" title="语音同步播放" lay-skin="primary">
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                                <div class="layui-col-md8 layui-col-lg8">
                                    <label class="layui-form-label">打印模板</label>
                                    <div class="layui-input-block">
                                        <select name="printModel">
                                            <option></option>
                                        </select>
                                    </div>
                                </div>
                            <div class="layui-col-md6 layui-col-lg6">
                                <label class="layui-form-label">上次被核单:</label>
                                <div class="layui-input-block" name="lastTradeOrderId">
                                </div>
                            </div>
                            <div class="layui-col-md6 layui-col-lg6">
                                <label class="layui-form-label">上次篮号:</label>
                                <div class="layui-input-block" name="lastBasketNo" style="color: red;">
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div id="toPickUpOrder_MultiplePreCheckLeftBody_center">
                <div class="leftTableDiv_multiple">
                    <fieldset class="layui-elem-field site-demo-button">
                        <legend style="font-size:14px">主表信息</legend>
                    </fieldset>
                    <table class="layui-table" id="toPickUpOrder_multiplePreCheckTotalOrderTable" lay-filter="toPickUpOrder_multiplePreCheckTotalOrderTable"></table>
                </div>
                <div class="rightTableDiv_multiple">
                    <fieldset class="layui-elem-field site-demo-button">
                        <legend style="font-size:14px">订单核对进度</legend>
                    </fieldset>
                    <table class="layui-table" id="toPickUpOrder_multiplePreCheckCurrentOrderProdTable" lay-filter="toPickUpOrder_multiplePreCheckCurrentOrderProdTable"></table>
                </div>
            </div>
            <div id="toPickUpOrder_MultiplePreCheckLeftBody_foot">
                <div class="leftTableDiv_multiple">
                    <fieldset class="layui-elem-field site-demo-button">
                        <legend style="font-size:14px">未核sku信息</legend>
                    </fieldset>
                    <table class="layui-table" id="toPickUpOrder_multiplePreCheckTotalProdTable" lay-filter="toPickUpOrder_multiplePreCheckTotalProdTable"></table>
                </div>
                <div class="rightTableDiv_multiple">
                    <fieldset class="layui-elem-field site-demo-button">
                        <legend style="font-size:14px">已核sku信息</legend>
                    </fieldset>
                    <table class="layui-table" id="toPickUpOrder_multiplePreCheckHasCheckedProdTable" lay-filter="toPickUpOrder_multiplePreCheckHasCheckedProdTable"></table>
                </div>
            </div>
        </div>
        <div id="toPickUpOrder_MultiplePreCheckRightBody">
            <form class="layui-form" id="toPickUpOrder_MultiplePreCheckSelectForm" lay-filter="toPickUpOrder_MultiplePreCheckSelectForm">
                        <div class="layui-tab-content">
                            <div class="layui-col-md12 layui-col-lg12">
                                <div class="layui-col-md12 layui-col-lg12">
                                    <label class="rightLabel">批次号</label>
                                    <div class="rightBlock">
                                        <input class="layui-input" name="batchNo" title="按回车键生效">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md12 layui-col-lg12 mb10">
                                <div class="layui-col-md9 layui-col-lg9">
                                    <label class="rightLabel">sku</label>
                                    <div class="rightBlock">
                                        <input class="layui-input" name="sSku" title="按回车键生效">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2 ml20">
                                    <input class="layui-input disAbleInp" name="scanAmount" disabled title="按回车键生效" type="number" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" >
                                </div>
                            </div>
                            <div class="layui-col-md12 layui-col-lg12 mb10" style="text-align: center">
                                <input type="checkbox" lay-filter="multipleCheck_checkStrict" name="checkStrict" title="严格核对数量" lay-skin="primary" checked>
                            </div>
                            <hr class="mb10"/>
                            <div class="layui-col-md12 layui-col-lg12 mb10">
                                <label class="rightLabel">篮号: </label>
                                <div style="color: blue; font-size: 40px" name="basketNo">无</div>
                            </div>
                            <div class="layui-col-md6 layui-col-lg6">
                                <label class="rightLabel">数量: </label>
                                <div class="fRed" style="font-size: 40px" name="amount"></div>
                            </div>
                            <div class="layui-col-md6 layui-col-lg6 mb10">
                                <label class="rightLabel">单位: </label>
                                <div class="fRed" style="font-size: 40px" name="unit"></div>
                            </div>
                            <hr class="mb10"/>
                            <div class="layui-col-md12 layui-col-lg12">
                                <img style="width: 220px; height: 220px;" name="image">
                            </div>
                        </div>
            </form>
        </div>
    </div>
</script>
<!-- 表格渲染模板 -->
<script src="${ctx}/static/js/order/toPickUpOrder.js"></script>
<style type="text/css">
    .leftBody{
        float: left;
        width: 79%;
        height:90%;
    }
    .rightBody{
        float: left;
        width: 20%;
        height:auto;
    }

    .leftBody_checkSingle{
        float: left;
        width: 70%;
        height:90%;
        border-right: 1px solid gainsboro;
    }
    .rightBody_checkSingle{
        float: left;
        width: 28%;
        height:auto;
    }
    #toPickUpOrder_needPickAmount{
        color: red;
        font-size: 45px;
        text-align:center
    }
    .operBox{
        border: 1px solid gainsboro;
        text-align: center;
        height: 30px;
        line-height: 30px;
    }
    .leftTableDiv{
        clear: left;
    }

    #toPickUpOrder_MultiplePreCheckLeftBody{
        float: left;
        width: 80%;
    }
    #toPickUpOrder_MultiplePreCheckRightBody{
        float: right;
        width: 20%;
    }
    #toPickUpOrder_MultiplePreCheckLeftBody_head{
        float: left;
        width: 100%;
        border: 1px solid gainsboro;
        padding-top: 10px;
    }
    .leftTableDiv_multiple{
        float: left;
        width: 61%;
    }
    .rightTableDiv_multiple{
        float: right;
        width: 37%;
    }

    .rightLabel{
        float: left;
        display: block;
        padding: 5px 5px;
        width: 50px;
        font-weight: 400;
        line-height: 14px;
        text-align: right;
    }
    .rightBlock{
        margin-left: 60px;
        min-height: 36px;
    }
</style>
