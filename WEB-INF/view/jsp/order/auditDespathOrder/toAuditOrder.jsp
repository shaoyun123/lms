<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>待审核订单</title>
<style>
    .fr {
        float: right;
    }

    .w_80 {
        width: 80%!important;
        display: inline-block;
    }

    .ma {
        margin: 0 auto;
    }

    .skyblue {
        color: skyblue;
    }

    .mt {
        margin-top: 10px;
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

    .dis_flex_around {
        display: flex;
        justify-content: space-around;
    }

    .mg_50 {
        margin: 20px 50px;
    }

    .lh_42 {
        line-height: 42px;
    }

    .lh_36 {
        line-height: 36px;
    }

    .w_100 {
        width: 100px;
    }

    .hide {
        display: none!important;
    }

    .select_label {
        padding: 0px!important;
    }

    .gray {
        color: gray;
    }

    .text_l {
        text-align: left;
    }

    .detail_img {
        width: 60px;
        height: 60px;
    }

    .detail_item {
        width: 300px;
        margin: 10px;
        padding: 10px;
        border: 1px solid #ccc;
    }

    .detail_font {
        line-height: 30px;
        color: #4e4e4e
    }

    .detail_wrap {
        flex-wrap: wrap
    }

    .yellowtips {
        color: deepskyblue;
        margin-left: 10px;
        background: lightyellow;
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

    .showExternal {
        border: 1px solid #1E9FFF!important;
    }

    .refresh_icon {
        margin-left: 5px;
        cursor: pointer;
    }
    #LAY-toAuditOrder .layui-btn+.layui-btn{
        margin-left: 0!important;
    }

    .dis_flex_start {
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
    }

    .mtb {
        margin: 5px 0;
    }

    .pageSortfix{
        background:#fff;
        width: 100%;
        position: fixed;
        bottom: 0;
        left:100px;
    }
    .toAuditOrder-noteContent-tag{
        color:#008B8B;
        border: 1px solid #008B8B;
        background-color: #fff;
    }

    .toAuditOrder_store_style .xm-select-dl{
        width:-webkit-fill-available !important;
    }
</style>
<div class="layui-fluid" id="LAY-toAuditOrder">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="toAuditOrderForm" lay-filter="toAuditOrderForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">订单时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="toAuditOrder_time" name="time" readonly>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select name="platCode" lay-filter="toAuditOrderplatCodes" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgs" lay-search class="orgs_hp_custom" lay-filter="toAuditOrder_orgs">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select lay-filter="toAuditOrder_salerAndcustomSelectFilter" name="salerAndcustomSelect">
                                        <option value="1">销售</option>
                                        <option value="2">客服</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="salePersonId" class="users_hp_custom" lay-filter="toAuditOrder_salePersonsSelect" id="toAuditOrder_salePersonsSelect" xm-select="toAuditOrder_salePersonsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 toAuditOrder_store_style">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="position: relative;">
                                    <select
                                    class="users_hp_store_multi"
                                    id="toAuditOrder_store"
                                    name="storeAcctIds"
                                    xm-select="toAuditOrderStoreAcct"
                                    xm-select-search
                                    xm-select-search-type="dl"
                                    xm-select-skin="normal"
                                    lay-filter="toAuditOrder_xmSelect">
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
                                    <select name="prodLogisAttrs" xm-select="logisAttrs" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
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
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">平台状态</label>
                                <div class="layui-input-block">
                                    <select id="toauditorderOrderStatusList" name="platOrderStatusList" xm-select="toauditorderOrderStatusList" lay-filter="toauditorderOrderStatusList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="prodIsSale">
                                        <option value="">全部</option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
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
                                    <select name="shippingCountryCodes" xm-select="shippingCountrys" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
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
                                <label class="layui-form-label">商品数量</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="prodQuantityMin" class="layui-input">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="prodQuantityMax" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">平台标签</label>
                                <div class="layui-input-block">
                                    <select name="platTags" xm-select="toAuditOrder_platTags" id="toAuditOrder_platTags" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding:0px 0px 0px 5px">
                                    <select name="agentCompany" lay-filter="toAuditOrdercompanyType">
                                        <option value="logisticsModes">物流方式集</option>
                                        <option value="companys">物流公司</option>
                                        <option value="agents">货代公司</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select type="text" name="logisticsCompanyId" lay-filter="toAuditOrdercompany" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">物流方式</label>
                                <div class="layui-input-block">
                                    <select name="logisTypeIds" xm-select="logisTypeIds_xm_select_toAudit" id="logisTypeIds_xm_select_toAudit" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">跟踪号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="logisTrackingNos" class="layui-input" placeholder="">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">标记发货</label>
                                <div class="layui-input-block">
                                    <select name="markShippingStatus" lay-search>
                                    </select>
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
                                <label class="layui-form-label">订单天数</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="orderDateMin" class="layui-input">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="orderDateMax" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">备注类型</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <select name="orderLabels" xm-select="orderLabels_toAuditOrder" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                        </select>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="text" name="orderNote" class="layui-input" placeholder="备注内容"  style="height:34px;">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderStr" lay-search>
                                        <option value="order_time_cn asc">订单时间正序</option>
                                        <option value="order_time_cn desc">订单时间倒序</option>
                                        <option value="logis_apply_time asc">申请跟踪号时间正序</option>
                                        <option value="logis_apply_time desc">申请跟踪号时间倒序</option>
                                        <option value="ship_by_date asc">截止发货时间正序</option>
                                        <option value="ship_by_date desc">截止发货时间倒序</option>
                                        <option value="plat_order_amt asc">订单金额正序</option>
                                        <option value="plat_order_amt desc">订单金额倒序</option>
                                        <option value="profit asc">利润正序</option>
                                        <option value="profit desc">利润倒序</option>
                                        <option value="profit/(plat_order_amt*exchange_rate) asc">利润率正序</option>
                                        <option value="profit/(plat_order_amt*exchange_rate) desc">利润率倒序</option>
                                    </select>
                                </div>
                            </div>
                             <div class="layui-col-md2 layui-col-lg2 dis_flex_space layui-col-md-offset2">
                                <div class="externalBox" id="showMoreSearchCondition_toAuditOrder">
                                    <span>更多查询条件<span class="hasValue"></span></span>
                                    <span id="hide_icon_toauditorder" class="fr mr10 hidden">︽</span>
                                    <span id="show_icon_toauditorder" class="fr mr10">︾</span>
                                </div>
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
                                                <select name="warehouseId" lay-search>
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
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">采购专员</label>
                                            <div class="layui-input-block">
                                                <select name="purchasingAgentId" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">利润区间</label>
                                            <div class="layui-input-block dis_flex_space">
                                                <input type="number" name="profitMin" class="layui-input">
                                                <span>&nbsp;~&nbsp;</span>
                                                <input type="number" name="profitMax" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg5 layui-col-md5 ">
                                            <label class="layui-form-label">单品金额</label>
                                            <div class="layui-input-block dis_flex_space">
                                                <input type="number" name="platUnitPriceMin" class="layui-input">
                                                <span>&nbsp;~&nbsp;</span>
                                                <input type="number" name="platUnitPriceMax" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">州/省</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="buyerShippingState" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">电话号码</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="phoneNumber" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">地址</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="address" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">邮编</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="zipCode" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">城市</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="city" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal  commonDirectMailRemarkSearch" lay-submit="" id="toAuditOrderSearch" lay-filter="toAuditOrderSearch">查询</button>
                                    <!-- <button type="button" class="layui-btn layui-btn-sm layui-btn-primary" lay-submit="" id="toAuditOrder_export" lay-filter="toAuditOrder_export">导出</button>
                                    <button type="button" class="layui-btn layui-btn-sm" lay-submit="" id="toAuditOrderDetail_export" lay-filter="toAuditOrderDetail_export">导出明细</button> -->
                                    <div id="toAuditOrder_exportTemplate" style="display: inline-block;position: relative;"></div>
                                    <div id="toAuditOrder_save" class="inline_block pora"></div>
                                </div>
                            </div>
                            <input class="hide" type="text" name="unAuditOrderStatus" value="1">
                            <input class="hide" type="text" name="limit" value="5000">
                            <input class="hide" type="text" name="page" value="1">
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="dis_flex_space">
                        <div>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" name="orderConfig">保存设置</button>
                        </div>
                        <div>
                            <permTag:perm funcCode="toAuditOrder_deleteOrder_permTag">
                            <span class="layui-btn layui-btn-danger layui-btn-sm" id="toAuditOrder_deleteOrder">
                            删除订单</span>
                            </permTag:perm>
                            <!--下拉按钮-->
                            <div id="toAuditOrder_platOper" class="layui-inline">
                            <permTag:perm funcCode="toAuditOrder_platBtnHandle_permTag">
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">平台操作</button>
                                <ul class="hidden">
                                    <li>
                                        <div>后台取消</div>
                                        <ul>
                                            <li id="toAuditOrder_cancelOrderEbay">ebay取消</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div>其他操作</div>
                                        <ul>
                                            <li id="syncOrderStatus">更新订单状态</li>
                                            <li id="markDelivery">标记平台发货</li>
                                            <li id="toAuditOrder_decryptAddress">解密地址</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <div>邮件</div>
                                        <ul>
                                            <li id="toAuditOrder_amazonEmail">Amazon邮件</li>
                                            <li id="toAuditOrder_eBayEmail">eBay邮件</li>
                                        </ul>
                                    </li>
                                </ul>
                            </permTag:perm>
                            </div>
                            <div id="toAuditOrder_editOrder" class="layui-inline">
                                
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单编辑</button>
                                <ul class="hidden">
                                    <li>
                                        <div>订单修改</div>
                                        <ul>
                                            <permTag:perm funcCode="toAuditOrder_newOrder_permTag">
                                            <li id="newOrder">新增订单</li>
                                            </permTag:perm>
                                            <permTag:perm funcCode="toAuditOrder_batchEditWareHouse_permTag">
                                            <li id="toAuditOrder_batchEditWareHouse">修改仓库和物流</li>
                                            </permTag:perm>
                                            <%-- <li disabled>批量导入新增</li>
                                            <li disabled>批量导入修改</li> --%>
                                        </ul>
                                    </li>
                                    <%--<li>
                                        <div>组合品</div>
                                        <ul>
                                            <li id="toAuditOrder_splitCompSku">拆分组合品</li>
                                            <li id="toAuditOrder_mergeCompSku">还原组合品</li>
                                        </ul>
                                    </li>--%>
                                    <li>
                                        <div>更新数据</div>
                                        <ul>
                                            <li id="updateCountry">更新法属国</li>
                                            <li id="updateProducts">更新商品信息</li>
                                        </ul>
                                    </li>
                                </ul>
                                
                            </div>
                            <div id="toAuditOrder_dealOrder" class="layui-inline">
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单处理</button>
                                <ul class="hidden">
                                    <permTag:perm funcCode="toaudit_auditOrderBtn">
                                        <li id="toaudit_auditOrder" style="background: #00B83F;color: #fff;">审核</li>
                                    </permTag:perm>
                                    <li id="toAuditOrder_reMatchWarehouseType">匹配分仓</li>
                                    <li id="toAuditOrder_appointWarehouseType">指定仓库类型</li>
                                    <permTag:perm funcCode="toAuditOrder_matchLogis_permTag">
                                    <li id="matchLogis">匹配物流</li>
                                    </permTag:perm>
                                    <permTag:perm funcCode="toAuditOrder_reParseSku_permTag">
                                    <li id="toAuditOrder_reParseSku">匹配SKU</li>
                                    </permTag:perm>
                                    <permTag:perm funcCode="toAuditOrder_markException_permTag">
                                    <li id="markException" style="background: #FFB951;color: #fff;">标记异常</li>
                                    </permTag:perm>
                                    <permTag:perm funcCode="toAuditOrder_toCancel_permTag">
                                    <li id="toAuditOrder_toCancel" style="background: #ff0000;color: #fff;">取消订单</li>
                                    </permTag:perm>
                                    <permTag:perm funcCode="toAuditOrder_toShipped_permTag">
                                    <li id="toAuditOrder_toShipped">直接转已发货</li>
                                    </permTag:perm>
                                    <li id="toAuditOrder_modifyOrderLabel">批量备注</li>
                                    <%-- <li id="toAuditOrder_modifyCostInfo">更新重量和成本</li> --%>
                                </ul>
                            </div>
                            <%-- <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="toAuditOrder_holdStockTask">库存占用规则</button> --%>
                        </div>
                    </div>
                    <div class="layui-tab" lay-filter="toAuditOrder_Tab" id="toAuditOrder_Tab">
                        <div class="">
                            <div style="height:42px;">
                                <ul class="layui-tab-title" style="width: 80%;">
                                </ul>
                            </div>
                        </div>
                        <div class="layui-tab-content">
                            <div id="toAuditOrder_table" style="width: 100%;height: 500px;" class="ag-theme-balham"></div>
                            <%--<table lay-filter="toAuditOrder_table" class="layui-table" id="toAuditOrder_table"></table>--%>
                            <div class="pageSortfix" id="toAuditOrderPage"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 表格渲染模板 -->
<script type="text/html" id="FBAdelivery_imageTpl">
    <div>
        <img width="60" height="60" data-original="{{d.image||d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<script type="text/html" id="toAuditOrder_id_tpl">
    <div class="alignLeft">
        <input type="hidden" class="toAuditOrder_col_id" value="{{d.id}}">
        <div>
                <span class="pora copySpan">
                    <a>{{d.id||""}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                </span>
            <span class="gray">[<span id="toAudit_table_storeAcct">{{d.storeAcct||""}}</span>[{{d.allrootAliasName||""}}]]</span>
            {{# if(d.operOrderType=="1"){ }}
            <span class="hp-badge layui-bg-orange fr" title="拆出订单">拆</span> {{# }else if(d.operOrderType=="2"){ }}
            <span class="hp-badge layui-bg-orange fr" title="合并订单">合</span> {{# }}}
        </div>
        <div>
                    <span class="pora copySpan">
                    <a id="toAudit_table_platOrderId">{{d.platOrderId}}{{# if(d.platStoreOrderId){ }}({{d.platStoreOrderId}}){{# }}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                </span>
        </div>
        <div><span class="gray">仓库:</span><span>{{d.warehouseName||'未分配'}}</span></div>
        <div><span class="gray">销售:</span><span>{{d.salesPersons||''}}</span></div>
    </div>
</script>

<script type="text/html" id="toAuditOrder_platOrderAmt_tpl">
    <div class="alignLeft">
        <div><span class='gray'>{{d.currency||""}}</span><span id="toAudit_table_platOrderAmt">{{d.platOrderAmt||""}}</span></div>
        <div><span class="gray">利润(RMB)</span><span>{{d.profit||'0.00'}}</span></div>
        <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
    </div>
</script>

<script type="text/html" id="toAuditOrder_prodQuantity_tpl">
    <div class="alignLeft">
        <div><span class="gray">种类：</span><span id="toAudit_table_skuQuantity">{{d.kindNum||""}}</span></div>
        <div><span class="gray">数量：</span><span id="toAudit_table_prodQuantity">{{d.prodQuantity||""}}</span></div>
        <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
    </div>
</script>

<script type="text/html" id="toAuditOrder_shippingUsername_tpl">
    <div class="alignLeft">
        <div id="toAudit_table_shippingUsername">{{d.shippingUsername||""}}</div>
        <div>[{{d.shippingCountryCnName||""}}]</div>
    </div>
</script>

<script type="text/html" id="toAuditOrder_logisTypeName_tpl">
    <div class="alignLeft">
        <div><span class="gray">买家:</span><span id="toAudit_table_buyerRequireShippingType">{{d.buyerRequireShippingType||""}}</span></div>
        <div><span class="gray">发货:</span><span id="logisTypeName_toAuditOrder">[{{d.logisTypeName||""}}]</span><span id="logisTrackingNo_toAuditOrder">[{{d.logisTrackingNo||""}}]</span></div>
    </div>
</script>

<script type="text/html" id="toAuditOrder_time_tpl">
    <div class="alignLeft">
        <div><span class="gray">订单:</span><span id="toAudit_table_orderTimeCn">{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})</span></div>
        <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
        <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    </div>
</script>


<script type="text/html" id="toAuditOrder_option_tpl">
    <div class="dis_flex_start">
        <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditOrder_modify">修改订单</button>
        <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditOrder_demolition">拆分订单</button>
        <button class="layui-btn layui-btn-xs mtb" lay-event="">邮件</button>
        <permTag:perm funcCode="toAuditOrder_issueRefund">
            <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditOrder_issueRefund">eBay退款</button>
        </permTag:perm>
        <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditOrder_remark">备注</button>
    </div>
</script>

<script type="text/html" id="toAuditOrder_detail_img_tpl">
    <div>
        <img width="60" height="60" data-original="{{d.imageUrl || ''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
    <div>

    </div>
</script>

<script type="text/html" id="toAuditOrder_detail_isSale">
    {{# if(d.isSale){ }}
        <span>在售</span>
    {{# } else if (!d.isSale&&d.isSale != null) { }}
        <span style="font-weight:700;font-size:24px;color:#f00;">停售</span>
    {{# } else {}}
        <span></span>
    {{# } }}
</script>

<!-- 商品价格 -->
<script type="text/html" id="toAuditOrder_edit_platOrderProdPrice">
  <div style="text-align:left;">
    <div title="平均库存成本|商品成本">
      成本(¥):{{d.prodUnitCost || ''}}|{{d.detailCostPrice || ''}}
    </div>
    <div>净重(g):{{d.prodUnitWeight || ''}}</div>
  </div>
</script>
<!-- 商品信息 -->
<script type="text/html" id="toAuditOrder_edit_platOrderProdInfo">
  <div style="text-align:left;">
    <div>库位:{{d.stockLocation || ''}}</div>
    <div class="onlyShowThreeLine" title="{{d.prodTitle || ''}}">
      名称:<span class="pora copySpan">
        <a>{{d.prodTitle || ''}}</a>
        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this, event)" type="button">复制</button>
      </span>
    </div>
  </div>
</script>
<!-- 订单信息 -->
<script type="text/html" id="toAuditOrder_edit_platOrderOrderInfo">
  <div style="text-align:left;">
    <div>报关信息:{{d.customsEnName || ''}}</div>
    <div>订单状态:{{d.platOrderDetailStatus || ''}}</div>
  </div>
</script>


<script type="text/html" id="add_product_img">
    <div>
        <img width="60" height="60" data-original="${tplIVP}{{d.image||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<script type="text/html" id="add_product_psku">
    <div>{{d.parent.pSku}}</div>
</script>

<script type="text/html" id="orginal_order_products">
    <div class="dis_flex">
        <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
        <div>
            <div>{{d.prodSSku||""}}
            </div>
            <div><span>Color</span>{{d.style||""}}</div>
        </div>
        <div><span>×</span><span>{{d.platQuantity||""}}</span></div>
        <div>
            {{# if(!d.isSale){ }}
                <span class="layui-badge plus-layui-badge ml5">停</span>
            {{# } }}
        </div>
    </div>
</script>
<script type="text/html" id="orginal_order_stock">
    <div><span class="gray">库存sku：{{d.availableStock||"0"}}</span></div>
    <div><span class="gray">当前数量：{{d.prodQuantity||"0"}}</span></div>
</script>

<script type="text/html" id="toAuditOrder_platOrderStatus_tpl">
    <div class="alignLeft">
        <div><span class="gray">留言：{{d.buyerNote||""}}</span></div>
        <!-- <div><span class="gray">标记发货：{{d.markShippingStatus || '' }} -->
        <div><span class="gray">标记发货：{{#  if(d.markShippingStatus == 0){ }}
                        未标记
                    {{#  } else if(d.markShippingStatus == 1) { }}
                        已标记
                    {{#  } else if(d.markShippingStatus == 2) { }}
                        标记失败
                    {{#  } }}
                </span></div>
        <div><span class="gray">订单标签：{{d.orderLabel||''}}</span></div>
        <div><span class="gray">订单状态：{{d.platOrderStatus||""}}</span></div>
        <%-- <div class="text_l"><span class="gray">万邑通状态：{{d.winitStatus||""}}</span></div> --%>
        <div><span class="gray">打印面单状态：</span></div>
    </div>
</script>

<script type="text/html" id="orginal_order_demolition">{{ d.prodQuantity * d.prodUnitWeight }}</script>

<script type="text/html" id="orginal_order_dynamicWeight"></script>

<script type="text/html" id="orginal_order_dynamicMoney"></script>

<script type="text/html" id="orginal_order_number">
    <input type="text" class="layui-input" name="demolitionQuality" onchange="commonSetInputMaxMinVal(this,{{d.prodQuantity}},1)">
</script>

<script type="text/html" id="toAuditOrder_edit_ListingID">
    <input type="text" class="layui-input" name="" value="{{d.itemId||''}}">
</script>

<script type="text/html" id="toAuditOrder_edit_Prodsku">
  <div>
    <div>
      {{# if(!d.isSale){ }}
      <span class="layui-badge">停</span>
      {{# } }}
    </div>
    <div>
      {{# if(d.logisAttrList){ }}
        {{# layui.each(d.logisAttrList.split(','), function(attrIndex, attrItem){ }}
          {{# if(attrItem != '普货'){ }}
          <span class="layui-badge">{{attrItem}}</span>
          {{# } }}
        {{# }) }}
      {{# } }}
    </div>
  </div>
    <div class="dis_flex">
        <input type="text" class="layui-input" name="" value="{{d.prodSSku}}">
        <i class="layui-icon refresh_icon">&#xe669;</i>
    </div>
</script>

<script type="text/html" id="toAuditOrder_edit_storeSSku">
    <input type="text" class="layui-input" name="" value="{{d.storeSSku||''}}">
</script>

<script type="text/html" id="toAuditOrder_edit_platUnitPrice">
    <input type="number" class="layui-input" name="" value="{{d.platUnitPrice||0}}" placeholder="订单币种">
</script>

<script type="text/html" id="toAuditOrder_edit_platQuantity">
    <input type="number" class="layui-input" name="" value="{{d.platQuantity||0}}">
</script>
<script type="text/html" id="toAuditOrder_edit_prodQuantity">
    <input type="text" class="layui-input" name="" value="{{d.prodQuantity}}">
</script>
<script type="text/html" id="add_product_prodQuantity">
    <input type="number" class="layui-input" name="prodQuantity" value="0">
</script>
<script type="text/html" id="add_product_platOrderDetailAmt">
    <input type="number" class="layui-input" name="platOrderDetailAmt" value="">
</script>
<script type="text/html" id="toAuditOrder_edit_platOrderDetailAmt">
    <input type="number" class="layui-input" value="{{d.platOrderDetailAmt===undefined ? '' : d.platOrderDetailAmt}}" placeholder="销售金额" min="0" step="1" onblur="commonFormatNonnegativeBlur(this)">
</script>

<script type="text/html" id="toAuditOrder_edit_option">
    <!-- <button class="layui-btn layui-btn-xs" lay-event="toAuditOrder_modify">修改订单</button> -->
    <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="edit_prod_delete">删除</button>
</script>

<!-- 表格渲染模板 -->

<!-- 操作弹框 -->
<!-- 添加备注 -->
<script type="text/html" id="pop_toAuditOrder_remark">
    <div class="layui-tab" id="toauditOrderremarkTab">
        <ul class="layui-tab-title">
            <li class="layui-this" data-index="1">备注</li>
            <li data-index="2">标签</li>
        </ul>
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
                <form class="layui-form mg_50">
                    <div class="layui-form-item">
                        <label class="layui-form-label">类型</label>
                        <div class="layui-input-block">
                            <select name="notetype" lay-verify="required">
                                <option value="addordernote">订单备注</option>
                                <option value="addpicknote">拣货备注</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">内容</label>
                        <div class="layui-input-block">
                            <textarea class="layui-textarea" name="noteContent" id="" cols="30" rows="10" lay-verify="required"></textarea>
                        </div>
                    </div>
                    <button type="button" id="toAuditOrder_remark_submit" class="hiden" lay-submit lay-filter="toAuditOrder_remark_submit"></button>
                </form>
            </div>
            <div class="layui-tab-item">
                <form class="layui-form mg_50">
                    <div class="layui-form-item">
                        <label class="layui-form-label">订单标签</label>
                        <div class="layui-input-block">
                            <select name="noteContent" lay-search>
                            </select>
                        </div>
                    </div>
                    <button type="button" id="toAuditorder_label_submit" class="hidden" lay-submit lay-filter="toAuditorder_label_submit"></button>
                </form>
            </div>
        </div>
    </div>
</script>

<!-- 商品详情 -->
<script type="text/html" id="pop_toAuditOrder_detail">
    <div class="mg_50">
        <table class="layui-table" id="toAuditOrder_detail_table" lay-filter="toAuditOrder_detail_table"></table>
    </div>
</script>
<!-- 原始订单拆单 -->
<script type="text/html" id="pop_toAuditOrder_demolition_original">
    <div class="mg_50">
        <div>
          <strong><font color="red" size="4">多个一买和组合品,所拆出的部分商品会影响线上发货,请谨慎拆分!</font></strong>
        </div>
       <div class="layui-form fixRight">
           <input type="radio" name="toAuditOrder_demo_original_abnormal" title="拆出订单转至取消订单" lay-skin="primary" id="toAuditOrder_demo_original_abnormal">
            <input type="radio" name="toAuditOrder_demo_original_abnormal" title="拆出订单转至其它异常订单" lay-skin="primary" id="toAuditOrder_demolition_original_abnormal">
        </div>
        <table class="layui-table" id="toAuditOrder_demolition_original_table" lay-filter="toAuditOrder_demolition_original_table"></table>
    </div>
</script>

<!-- 修改/新增订单 -->
<script type="text/html" id="pop_toAuditOrder_newandeditorder">
    <div class="mg_50">
        <div class="layui-tab" lay-filter="orderLog">
            <ul class="layui-tab-title">
                <li class="layui-this">详情</li>
                <li class="logHide">日志</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <form class="layui-form" id="toAuditOrder_editForm" lay-filter="toAuditOrder_editForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单编号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="id" class="layui-input" readonly>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label"><font class="fRed">*</font>店铺单号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="platOrderId" class="layui-input" lay-verify="required">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label"><font class="fRed">*</font>平台</label>
                                <div class="layui-input-block">
                                    <select name="platCode" lay-filter="edit_platCode" lay-verify="required" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label"><font class="fRed">*</font>店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" id="edit_storeAcct" lay-filter="edit_storeAcct" lay-verify="required" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="siteId" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label"><font class="fRed">*</font>订单北京时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="orderTimeCn" id="edit_time" class="layui-input" readonly lay-verify="required">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">交易ID</label>
                                <div class="layui-input-block">
                                    <input type="text" name="platTransactionId" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label"><font class="fRed">*</font>币种</label>
                                <div class="layui-input-block">
                                    <select name="currency" lay-verify="required" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label"><font class="fRed">*</font>订单金额</label>
                                <div class="layui-input-block">
                                    <input name="platOrderAmt" type="text" lay-verify="required" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">出货仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">物流方式</label>
                                <div class="layui-input-block">
                                    <select name="logisTypeId" lay-filter="edit_logisTypeId" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">物流跟踪号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="logisTrackingNo" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">买家指定物流</label>
                                <div class="layui-input-block">
                                    <input type="text" name="buyerRequireShippingType" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">卖家邮箱</label>
                                <div class="layui-input-block">
                                    <input type="text" name="sellerEmail" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                              <label class="layui-form-label">平台费用</label>
                              <div class="layui-input-block">
                                  <input type="text" name="platFee" class="layui-input">
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">买家邮箱</label>
                                <div class="layui-input-block">
                                    <input type="text" name="buyerEmail" class="layui-input">
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">买家ID</label>
                                <div class="layui-input-block">
                                    <input type="text" name="buyerUserId" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">收件人</label>
                                <div class="layui-input-block">
                                    <input type="text" name="shippingUsername" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">收件人电话</label>
                                <div class="layui-input-block">
                                    <input type="text" name="shippingPhoneNumber" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">收件人邮编</label>
                                <div class="layui-input-block">
                                    <input type="text" name="shippingZip" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4 ">
                                <label class="layui-form-label">地址1</label>
                                <div class="layui-input-block">
                                    <input type="text" name="shippingStreet1" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4 ">
                                <label class="layui-form-label">地址2</label>
                                <div class="layui-input-block">
                                    <input type="text" name="shippingStreet2" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">城市</label>
                                <div class="layui-input-block">
                                    <input type="text" name="shippingCity" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">州/省</label>
                                <div class="layui-input-block">
                                    <input type="text" name="shippingState" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label"><font class="fRed">*</font>国家/地区</label>
                                <div class="layui-input-block">
                                    <select name="shippingCountryCode" lay-verify="required" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">备注类型</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <select name="noteType" lay-search></select>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <input type="text" name="noteContent" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <button type="button" id="edit_submit" lay-filter="edit_submit" class="hide" lay-submit></button>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4 dis_flex">
                                <input type="text" class="layui-input">
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="toAuditOrder_addProducts">添加商品</button>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg12 layui-col-md12 ">
                                <table class="layui-table" id="toAuditOrder_product_table" lay-filter="toAuditOrder_product_table"></table>
                            </div>
                        </div>
                        <permTag:perm funcCode="toAuditOrder:save">
                            <button type="button" class="hide" id="order_savebtn">保存</button>
                        </permTag:perm>
                    </form>
                </div>
                <div class="layui-tab-item">
                    <div>
                        <table class="layui-table" id="orderOprateLog" lat-filter="orderOprateLog"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<!-- 添加商品弹框 -->
<script type="text/html" id="pop_toAuditOrder_addProducts">
    <div class="mg_50">
        <span class="numCount">数量<span></span></span>
        <table class="layui-table" id="toAuditOrder_addProducts_table" lay-filter="toAuditOrder_addProducts_table"></table>
    </div>
</script>
<script type="text/html" id="toAuditOrder_cancelEbayTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="toAuditOrder_cancelEbayForm">
        <div class="p20">
            <div class="layui-form-item">
                <label class="layui-form-label">取消原因</label>
                <div class="layui-input-block">
                    <input type="radio" checked name="cancelReason" value="BUYER_ASKED_CANCEL" title="买家要求取消">
                    <input type="radio" name="cancelReason" value="OUT_OF_STOCK_OR_CANNOT_FULFILL" title="缺货或不能发货">
                    <input type="radio" name="cancelReason" value="ADDRESS_ISSUES" title="买家地址问题">
                </div>
            </div>
        </div>
    </form>
</script>
<script type="text/html" id="toAuditOrder_cancelWishpostTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="toAuditOrder_cancelWishpostForm">
        <div class="p20">
            <div class="layui-form-item">
                <label class="layui-form-label">取消原因</label>
                <div class="layui-input-block">
                    <select class="layui-select" lay-search name="cancelReasonCode">
                        <option></option>
                        <option value="40101">需更换渠道</option>
                        <option value="40102">需更换揽收方式</option>
                        <option value="40103">需更换物流商</option>
                        <option value="40104">需更换仓库</option>
                        <option value="40105">需更换地址</option>
                        <option value="40106">需更换重量</option>
                        <option value="40107">需更换申报价格</option>
                        <option value="40201">单号已被使用</option>
                        <option value="40202">无法获取单号</option>
                        <option value="40203">ERP无法获取单号</option>
                        <option value="40204">无法打印面单</option>
                        <option value="40205">无效面单</option>
                        <option value="40206">订单过期</option>
                        <option value="40301">物流商未取货</option>
                        <option value="40302">不在揽收范围</option>
                        <option value="40303">物流商需更换单号</option>
                        <option value="40304">物流商无法收款</option>
                        <option value="40305">物流商未收到包裹</option>
                        <option value="40401">买家要求退货</option>
                        <option value="40402">寄错货物</option>
                        <option value="40403">需合并发货</option>
                        <option value="40404">需拆分发货</option>
                        <option value="40405">重复下单</option>
                        <option value="49999">其他原因</option>
                    </select>
                </div>
            </div>
            <div class="layui-inline">
                <label class="layui-form-label">其他原因</label>
                <div class="layui-input-inline">
                    <input type="text" name="invalidReason"  class="layui-input">
                </div>
            </div>
        </div>
    </form>
</script>
<script type="text/html" id="toAuditOrder_appointWarehouseTypeTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="toAuditOrder_appointWarehouseTypeForm">
        <div class="p20">
            <div class="layui-form-item">
                <label class="layui-form-label">仓库类型</label>
                <div class="layui-input-block">
                    <!-- <input type="radio" name="warehouseType" value="DIRECT" title="直邮仓"> -->
                    <input type="radio" name="warehouseType" value="WINIT" title="海外仓">
                </div>
            </div>
        </div>
    </form>
</script>
<!-- 修改订单标签 -->
<script type="text/html" id="toAuditOrder_updateProdPInfoListPop">
    <form class="layui-form mg_50" id="toAuditOrder_updateProdPInfoForm">
        <div class="layui-form-item">
            <label class="layui-form-label">备注类型</label>
            <div class="layui-input-block">
                <select name="notetype" lay-verify="required" id="toAuditOrder_noteContent_content"></select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">备注内容</label>
            <div class="layui-input-block">
                <textarea class="layui-textarea" name="noteContent" id="" cols="30" rows="10" lay-verify="required"></textarea>
            </div>
        </div>
    </form>
    <table class="layui-table" id="toAuditOrder_addProducts_table" lay-filter="toAuditOrder_addProducts_table"></table>
</script>

<%-- 弹框-批量修改仓库和物流 --%>
<script type="text/html" id="toAuditOrder_batchEditWareHouseLayer">
    <div class="layui-form" style="padding:20px 20px 0 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">仓库</label>
            <div class="layui-input-block">
                <select name="warehouse" id="batchEditWareHouse_warehouse"></select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">物流</label>
            <div class="layui-input-block" style="display:flex;">
                <select name="warehouse" id="batchEditWareHouse_logisCompany" lay-filter="batchEditWareHouse_logisCompanyFilter"></select>
                <div style="margin-left:10%;">
                    <select name="warehouse" id="batchEditWareHouse_logisWay"></select>
                </div>
            </div>
        </div>
    </div>
</script>

<%--<script type="text/html" id="toAuditOrder_orginal_order_availableStock">--%>
<%--    <div>--%>
<%--        {{# if(d.allCount > d.availableStock){ }}--%>
<%--        <div style="font-weight:700;font-size:24px;color:#f00;">{{d.availableStock}}</div>--%>
<%--        {{# }else{ }}--%>
<%--        <span>{{d.availableStock}}</span>--%>
<%--        {{# } }}--%>
<%--    </div>--%>
<%--</script>--%>
<%--<script type="text/html" id="toAuditOrder_orginal_order_allCount">--%>
<%--    {{# if(d.allCount > d.availableStock){ }}--%>
<%--    <span style="font-weight:700;font-size:24px;color:#f00;">{{d.allCount || d.prodQuantity}}</span>--%>
<%--    {{# }else{ }}--%>
<%--    <span>{{d.allCount || d.prodQuantity}}</span>--%>
<%--    {{# } }}--%>
<%--</script>--%>
<%--<script type="text/html" id="toAuditOrder_orginal_order_prodQuantity">--%>
<%--    <div>--%>
<%--    {{# if(d.allCount > d.availableStock){ }}--%>
<%--    <div style="font-weight:700;font-size:24px;color:#f00;">{{d.prodQuantity || ''}}</div>--%>
<%--    {{# }else{ }}--%>
<%--    <span>{{d.prodQuantity || ''}}</span>--%>
<%--    {{# } }}--%>
<%--    </div>--%>
<%--</script>--%>


<%-- 权限问题---修改订单 --%>
<script type="text/html" id="toAuditOrder_updatePermTagTable">
    <permTag:perm funcCode="toAuditOrder_updatePermTag">
    <button name="toAuditOrder_modify" class="layui-btn layui-btn-xs">修改订单</button>
    </permTag:perm>
</script>
<%-- 权限问题---拆分订单 --%>
<script type="text/html" id="toAuditOrder_splitPermTagTable">
    <permTag:perm funcCode="toAuditOrder_splitPermTag">
    <button name="toAuditOrder_demolition" class="layui-btn layui-btn-xs">拆分订单</button>
    </permTag:perm>
</script>

<%-- 权限问题---ebay退款 --%>
<script type="text/html" id="toAuditOrder_ebayRefundPermTagTable">
    <permTag:perm funcCode="toAuditOrder_issueRefund">
    <button name="toAuditOrder_issueRefund" class="layui-btn layui-btn-xs">ebay退款</button>
    </permTag:perm>
</script>
 
<!-- 成本占比 -->
<script type="text/html" id="toAuditOrder_costRatio">
  <div title="库存成本|商品成本占比">
    {{# if(!d.prodCost || !d.prodUnitCost){ }}
    <span></span>
    {{# }else{ }}
    <span>{{(d.prodUnitCost*100*d.prodQuantity/d.prodCost).toFixed(0)+'%' }}</span>
    {{# } }}
    <span>|</span>
    {{# if(!d.costPrice || !d.detailCostPrice){ }}
    <span></span>
    {{# }else{ }}
    <span>{{(d.detailCostPrice*100*d.prodQuantity/d.costPrice).toFixed(0)+'%'}}</span>
    {{# } }}
  </div>
</script>

<!-- 表格渲染模板 -->
<script type="text/javascript" src="${ctx}/static/js/order/orderLog.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script src="${ctx}/static/js/order/toAuditOrder.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
