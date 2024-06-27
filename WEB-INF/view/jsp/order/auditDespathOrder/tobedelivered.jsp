<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>待发货订单</title>

<style>
/* 弹框样式start */
    #tobedelivered-scanLayerId .compositeStyle,
    #tobedelivered-smtBigPackageLayerId .compositeStyle,
    #tobedelivered-shopeeHandoverSheetId .compositeStyle{
        display:flex;
    }
    #tobedelivered-scanLayerId .compositeStyle .layui-form-select,
    #tobedelivered-scanLayerId .compositeStyle .xm-select-parent,
    #tobedelivered-smtBigPackageLayerId .compositeStyle .layui-form-select,
    #tobedelivered-smtBigPackageLayerId .compositeStyle .xm-select-parent,
    #tobedelivered-shopeeHandoverSheetId .compositeStyle .layui-form-select,
    #tobedelivered-shopeeHandoverSheetId .compositeStyle .xm-select-parent{
        flex: 4;
    }
    #tobedelivered-scanLayerId .compositeStyle .compositeCk,
    #tobedelivered-smtBigPackageLayerId .compositeStyle .compositeCk,
    #tobedelivered-shopeeHandoverSheetId .compositeStyle .compositeCk{
        width:121px;
        padding-left: 20px;
    }
    .totalWeight {
        position: absolute;
        right: 7%;
        bottom: 5%;
    }
/* 弹框样式end */
/* 搜索条件样式start */
    .dis_flex_space {
        display: flex;
        justify-content: space-between;
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
/* 搜索条件样式end */

.toBedelivered-noteContent-tag{
    color:#008B8B;
    border: 1px solid #008B8B;
    background-color: #fff;
}
.tobedelivered_store_style .xm-select-dl{
    width:-webkit-fill-available !important;
}
#tobedelivered_selfSendLayerId .layui-form-label {
  width: 90px;
}
#tobedelivered_selfSendLayerId .layui-input-block {
  margin-left: 120px;
}
.showNumStyle {
  display: inline-block;
  font-size: 20px;
  color: #f00;
  font-weight: 900;
}
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="tobedeliveredForm" lay-filter="tobedeliveredForm">
                        <input type="hidden" name="logisApplySearchStatus" value="0">
                        <input type="hidden" name="limit" value="5000">
                        <input type="hidden" name="page" value="1">
                        <div class="layui-form-item">
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-form-label labelSel">
                                    <select name="orderTimeType">
                                        <option value="orderTimeCn">订单时间</option>
                                        <option value="packingTime">包装时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="tobedelivered_time" name="times" readonly>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select name="platCode"
                                    lay-search
                                    id="tobedelivered_platCode"
                                    lay-filter="tobedelivered_platCode"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgs" lay-search class="orgs_hp_custom" lay-filter="tobedelivered_orgs">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select lay-filter="tobedelivered_salerAndcustomSelectFilter" name="salerAndcustomSelect">
                                        <option value="1">销售</option>
                                        <option value="2">客服</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="salePersonId" class="users_hp_custom" lay-filter="tobedelivered_salePersonsSelect" id="tobedelivered_salePersonsSelect" xm-select="tobedelivered_salePersonsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 tobedelivered_store_style">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctIds"
                                        class="users_hp_store_multi"
                                        id="tobedelivered_store"
                                        xm-select="tobedelivered_storeAcct"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                        lay-filter="tobedelivered_storeAcct">
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
                                <div class="layui-form-label labelSel">
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
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select name="prodLogisAttrs"
                                        lay-filter="tobedelivered_logisAttrs"
                                        xm-select="tobedelivered_logisAttrs"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                        id="tobedelivered_logisAttrs">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">SKU个数</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="skuQuantityMin" class="layui-input" min="0">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="skuQuantityMax" class="layui-input" min="0">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">平台状态</label>
                                <div class="layui-input-block">
                                    <select name="platOrderStatusList" id="tbd_platOrderStatusList" xm-select="tbd_platOrderStatusList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter="tbd_platOrderStatusList">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
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
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">国家/地区</label>
                                <div class="layui-input-block">
                                    <select name="shippingCountryCodes"
                                        lay-filter="tobedelivered_shippingCountrys"
                                        xm-select="tobedelivered_shippingCountrys"
                                        id="tobedelivered_shippingCountrys"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">买家指定物流</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="buyerRequireShippingType">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品数量</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="prodQuantityMin" class="layui-input" min="0">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="prodQuantityMax" class="layui-input" min="0">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">平台标签</label>
                                <div class="layui-input-block">
                                    <select name="platTags" xm-select="tobedelivered_platTags" id="tobedelivered_platTags" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="companyType" lay-filter="companyType">
                                        <option value="companys">物流公司</option>
                                        <option value="agents">货代公司</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select
                                        id="tobedelivered_company"
                                        lay-filter="tobedelivered_company"
                                        name="company"
                                        lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流方式</label>
                                <div class="layui-input-block">
                                    <select name="logisTypeIds"
                                        id="tobedelivered_logisTypeIds"
                                        lay-filter="logisTypeIds"
                                        xm-select="xm_tobedelivered_logisTypeIds"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">跟踪号</label>
                                <div class="layui-input-block">
                                    <input type="text" name="logisTrackingNos" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
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
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">订单金额</label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="platOrderAmtMin" class="layui-input" min="0">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="platOrderAmtMax" class="layui-input" min="0">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 dis_flex_space">
                                <div class="externalBox" id="showMoreSearchCondition_tobedelivered">
                                    <span>更多查询条件<span class="hasValue"></span></span>
                                    <span id="hide_icon_tobedelivered" class="fr mr10 disN">︽</span>
                                    <span id="show_icon_tobedelivered" class="fr mr10">︾</span>
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
                                                <select name="warehouseId" lay-search id="tobedelivered_warehouseId">
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
                                                <select name="preprodDevId" lay-search id="tobedelivered_preprodDevId">

                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">采购专员</label>
                                            <div class="layui-input-block">
                                                <select name="purchasingAgentId" lay-search id="tobedelivered_purchasingAgentId">

                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-lg5 layui-col-md5">
                                            <label class="layui-form-label">单品金额</label>
                                            <div class="layui-input-block dis_flex_space">
                                                <input type="number" name="platUnitPriceMin" class="layui-input" min="0">
                                                <span>&nbsp;~&nbsp;</span>
                                                <input type="number" name="platUnitPriceMax" class="layui-input" min="0">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-row">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label labelSel">
                                    <select name="newBatchNo">
                                        <option value="1">拣货批次</option>
                                        <option value="2">组包批次</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" name="valBatchNo" class="layui-input" placeholder="">
                                </div>
<%--                                <label class="layui-form-label">拣货批次</label>--%>
<%--                                <div class="layui-input-block">--%>
<%--                                    <input type="text" name="pickBatchNo" class="layui-input" placeholder="">--%>
<%--                                </div>--%>
<%--                            </div>--%>
<%--                            <div class="layui-col-md2 layui-col-lg2">--%>
<%--                                <label class="layui-form-label">组包批次</label>--%>
<%--                                <div class="layui-input-block">--%>
<%--                                    <input type="text" name="handoverBatchNo" class="layui-input" placeholder="">--%>
<%--                                </div>--%>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">备注类型</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <select name="orderLabels"
                                            xm-select="tobedelivered_orderLabels"
                                            id="tobedelivered_orderLabels"
                                            xm-select-search
                                            xm-select-search-type="dl"
                                            xm-select-skin="normal"
                                            lay-filter="tobedelivered_orderLabels">
                                        </select>
                                    </div>
                                <div class="layui-col-md6 layui-col-lg6">
                                    <input type="text" name="orderNote" class="layui-input" placeholder="备注内容" style="height:34px;">
                                </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderStr"  lay-search>
                                        <option value="o.order_time_cn asc">订单时间正序</option>
                                        <option value="o.order_time_cn desc">订单时间倒序</option>
                                        <option value="o.logis_apply_time asc">申请跟踪号时间正序</option>
                                        <option value="o.logis_apply_time desc">申请跟踪号时间倒序</option>
                                        <option value="o.ship_by_date asc">截止发货时间正序</option>
                                        <option value="o.ship_by_date desc">截止发货时间倒序</option>
                                        <option value="o.plat_order_amt asc">订单金额正序</option>
                                        <option value="o.plat_order_amt desc">订单金额倒序</option>
                                        <option value="o.profit asc">利润正序</option>
                                        <option value="o.profit desc">利润倒序</option>
                                        <option value="poli.close_time asc">跟踪号剩余天数正序</option>
                                        <option value="poli.close_time desc">跟踪号剩余天数倒序</option>
                                        <option value="o.profit/(o.plat_order_amt*o.exchange_rate) asc">利润率正序</option>
                                        <option value="o.profit/(o.plat_order_amt*o.exchange_rate) desc">利润率倒序</option>
                                    </select>
                                </div>
                            </div>
                                <div class="layui-col-md2 layui-col-lg2 layui-col-md-offset2">
                                    <div class="layui-input-block">
                                        <span class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch" lay-filter="tobedeliveredSearch" id="tobedeliveredSearch" lay-submit>查询</span>
                                        <!-- <permTag:perm funcCode="export_tobe_Order">
                                            <span class="layui-btn layui-btn-sm layui-btn-primary" id="tobedelivered_export" lay-filter="tobedelivered_export">导出</span>
                                        </permTag:perm>
                                        <permTag:perm funcCode="export_details_tobe_Order">
                                            <span class="layui-btn layui-btn-sm" id="tobedeliveredDetail_export">导出明细</span>
                                        </permTag:perm> -->
                                        <permTag:perm funcCode="export_tobe_Order">
                                        <div id="tobedelivered_exportTemplate" style="display: inline-block;position: relative;"></div>
                                      </permTag:perm>
                                        <div id="tobedelivered_save" class="inline_block pora"></div>
                                    </div>
                                </div>
                            </div>
                            <%-- <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="orderNote" class="layui-input" placeholder="">
                                </div>
                            </div> --%>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="tobedeliveredCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                        <audio src="${ctx}/static/audio/error.wav" id="tobedelivered_audioplay">亲 您的浏览器不支持html5的audio标签</audio>
                        <audio src="${ctx}/static/audio/success.wav" id="tobedelivered_audioplaySuccess">亲 您的浏览器不支持html5的audio标签</audio>
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="tobedelivered-tabs" id="tobedelivered-tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">全部(<span></span>)</li>
                                </ul>
                            </div>
                            <div>
                                <span class="layui-btn layui-btn-sm layui-btn-normal" style="margin-right:5px;" id="tobedelivered_yanwenCutOrder">燕文截单</span>
                                <permTag:perm funcCode="platform_operation_tobe_Order">
                                    <div id="tobedelivered_platOperate" style="position:relative;margin-right:5px;">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">平台操作</button>
                                            <ul class="hidden">
                                                <li>
                                                    <div>后台取消</div>
                                                    <ul>
                                                        <li id="tobedelivered_cancelOrderEbay">ebay取消</li>
                                                        <permTag:perm funcCode="tobedelivered_wishBtnPermTag">
                                                            <li id="tobedelivered_wishRefund">wish退款</li>
                                                        </permTag:perm>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <div>其他操作</div>
                                                    <ul>
                                                        <li id="tobedelivered_syncOrderStatus">更新订单状态</li>
                                                        <li id="tobedelivered_markDelivery">标记平台发货</li>
                                                        <li id="tobedelivered_batchRemark">批量备注</li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <div>邮件</div>
                                                    <ul>
                                                        <li id="tobedelivered_amazonEmail">Amazon邮件</li>
                                                        <li id="tobedelivered_eBayEmail">eBay邮件</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                    </div>
                                </permTag:perm>
                                <permTag:perm funcCode="print_deliv_Order">
                                    <div id="tobedelivered_printOperate" style="position:relative;margin-right:5px;">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">打印</button>
                                        <ul class="hidden" style="margin-top: -3px;">
                                            <li id="tobedelivered_logisLi">物流面单</li>
                                            <li id="tobedelivered_setLi">配货单</li>
                                            <li id="tobedelivered_setlogisLi" style="line-height: 17px;">物流面单(含SKU)</li>
                                        </ul>
                                    </div>
                                </permTag:perm>
                                <permTag:perm funcCode="goto_shipped_deliv_Order">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered-pickCompleteBtn">
                                        转至已发货
                                     </span>
                                </permTag:perm>
                                <permTag:perm funcCode="reject_the_order_deliv_Order">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered-rejectBtn">
                                        驳回订单
                                     </span>
                                </permTag:perm>
                                <permTag:perm funcCode="express_delivery_tobe_Order">
                                    <div id="tobedelivered_express_delivery" style="position:relative;margin-left:5px;">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">快递交接单</button>
                                        <ul class="hidden" style="margin-top: -3px;">
                                            <permTag:perm funcCode="scan_checklist_deliv_Order">
                                                    <li id="tobedelivered-scanBtn">扫描核单</li>
                                            </permTag:perm>
                                            <permTag:perm funcCode="aliExpress_big_package_deliv_Order">
                                                <li id="tobedelivered-smtBigPackageBtn">速卖通交接</li>
                                            </permTag:perm>
                                            <permTag:perm funcCode="shopee_deliv_handover_sheet">
                                                <li id="tobedelivered-shopeeHandoverSheet" style="line-height: 30px;">Shopee交接</li>
                                            </permTag:perm>
                                            <permTag:perm funcCode="lazada_deliv_handover_sheet">
                                                <li id="tobedelivered-lazadaHandoverSheet" style="line-height: 30px;">Lazada交接</li>
                                            </permTag:perm>
                                             <li id="tobedelivered-optimizationSheet" style="line-height: 30px;">优选仓组包</li>
                                             <li id="tobedelivered-aefullyhosted" style="line-height: 30px;">AE全托管</li>
                                             <li id="tobedelivered-aehalfhosted" style="line-height: 30px;">AE半托管</li>
                                            <%-- <permTag:perm funcCode="lazada_deliv_handover_optimization">
                                                <li id="tobedelivered-optimizationSheet" style="line-height: 30px;">优选仓组包</li>
                                            </permTag:perm> --%>
                                        </ul>
                                </div>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下面放表格 -->
                <div class="layui-card-body">
                    <%--<table class="layui-table" id="tobedelivered_table" --%>
                    <%--lay-filter="tobedelivered_tableFilter"></table>--%>
                    <div id="tobedelivered_tableId" style="width: 100%;height: 500px;" class="ag-theme-balham"></div>
                        <div class="pageSortfix" id="toBedeliveredPage"></div>
                </div>

            </div>
        </div>
    </div>
</div>
<%-- 表格-订单号 --%>
<script type="text/html" id="tobedelivered_id_tpl">
    <input type="hidden" value="{{d.id}}">
    <div class="alignLeft">
        <div>
            <span class="pora copySpan">
                <a>{{d.id||""}}</a>
                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
            </span>
            <span class="gray">[{{d.storeAcct||""}}[{{d.allrootAliasName||""}}]]</span>
            {{# if(d.operOrderType=="1"){ }}
            <span class="hp-badge layui-bg-orange fr" title="拆出订单">拆</span>
            {{# }else if(d.operOrderType=="2"){ }}
            <span class="hp-badge layui-bg-orange fr" title="合并订单">合</span>
            {{# }}}
        </div>
        <div>
            <span class="pora copySpan">
                <a>{{d.platOrderId}}{{d.platStoreOrderId ? (d.platStoreOrderId): '' }}</a>
                <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">
                    复制
                </button>
            </span>
        </div>
        <div><span class="gray">仓库:</span><span>{{d.warehouseName||'未分配'}}</span></div>
        <div><span class="gray">销售:</span><span>{{d.salesPersons||''}}</span></div>
    </div>
</script>

<%-- 表格-订单金额 --%>
<script type="text/html" id="tobedelivered_platOrderAmt_tpl">
    <div class="alignLeft">
      <div><span class='gray'>{{d.currency||""}}:</span>{{d.platOrderAmt||""}}</div>
      <div><span class="gray">利润(RMB):</span>{{d.profit||'0.00'}}</div>
      <div><span class="gray">利润率:</span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</div>
    </div>
</script>

<%-- 表格--商品 --%>
<script type="text/html" id="tobedelivered_prodQuantity_tpl">
   <div class="alignLeft">
        <div><span class="gray">种类：</span><span>{{d.kindNum||""}}</span></div>
        <div><span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span></div>
        <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
   </div>
</script>

<%-- 表格---收件人 --%>
<script type="text/html" id="tobedelivered_shippingUsername_tpl">
    <div class="alignLeft">
        <div>{{d.shippingUsername||""}}</div>
        <div>[{{d.shippingCountryCnName||""}}]</div>
    </div>
</script>

<%-- 表格---物流 --%>
<script type="text/html" id="tobedelivered_logisTypeName_tpl">
    <div class="alignLeft">
        <div>
            <span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}</span>
        </div>
        <div>
            <span class="gray">发货:</span><span>[{{d.logisTypeName||""}}]</span><span>[{{d.logisTrackingNo||""}}]</span>
        </div>
    </div>
</script>


<%-- 表格---时间 --%>
<script type="text/html" id="tobedelivered_time_tpl">
    <div class="alignLeft">
        <div>
            <span class="gray">订单:</span>
            <span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})</span>
        </div>
        <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
        <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    </div>
</script>

<%-- 表格---状态 --%>
<script type="text/html" id="tobedelivered_platOrderStatus_tpl">
    <div class="alignLeft">
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
        <%-- <div class="text_l"><span class="gray">万邑通状态：{{d.winitStatus||""}}</span></div> --%>
        <div><span class="gray">打印面单状态：</span></div>
    </div>
</script>


<%-- 表格---操作 --%>
<script type="text/html" id="tobedelivered_detailTool">
    <span class="layui-btn layui-btn-xs disN" lay-event="detail">详情</span><br>
    <span class="layui-btn layui-btn-xs" lay-event="remark">备注</span>
</script>






<%-- 弹框---扫描核单 --%>
<script type="text/html" id="tobedelivered-scanLayer">
    <div class="layui-row">
        <div class="layui-card">
            <div class="layui-card-body">
                <form class="layui-form">
                    <div class="layui-form-item">
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">参考单号或跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="referOrder">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单编号或跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="order">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">物流公司</label>
                            <div class="layui-input-block compositeStyle">
                                <select name="tobedelivered-companySelect" id="tobedelivered-companySelect" lay-search>
                                </select>
                                <div class="compositeCk">
                                    <input type="checkbox" name="checkCompany" lay-skin="primary" title="检查物流公司" checked>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单快递公司</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="company" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">物流方式</label>
                            <div class="layui-input-block compositeStyle">
                                <select name="tobedelivered-waySelect"
                                    id="tobedelivered-waySelect"
                                    xm-select="tobedelivered-waySelect">
                                </select>
                                <div class="compositeCk">
                                    <input type="checkbox" name="checkWay" lay-skin="primary" title="检查物流方式" checked>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单物流方式</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="logisWay" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单数量</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" id="tobedelivered_orderNum" value="0" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                          <div style="display:flex;margin-left: 15px;box-sizing: border-box;width: 100%;">
                              <div style="display:flex;">
                                <div style="display:flex;line-height: 32px;">
                                    <input type="checkbox" lay-skin="primary" title="跟踪号过滤" name="trackNumFilter">
                                    <div style="display:flex;">
                                        <span>前</span>
                                        <input type="text" class="layui-input" name="trackNumFilterFront" style="width:50px;margin:0 20px 0 8px;">
                                    </div>
                                    <div style="display:flex;">
                                        <span>后</span>
                                        <input type="text" class="layui-input" name="trackNumFilterAfter" style="width:50px;margin:0 20px 0 8px;">
                                    </div>
                                </div>
                              </div>
                              <%-- 右侧部分 --%>
                              <div style="display:flex;line-height: 32px;margin-left: 20px;">
                                <input type="checkbox" lay-skin="primary" title="校验跟踪长度" name="checkTrackLength">
                                <input type="text" class="layui-input" style="width:50px;margin:0 5px 0 -12px;"  name="checkTrackLengthNum">
                                <span>位</span>
                              </div>
                          </div>
                        </div>
                        <div class="layui-col-md12 layui-col-lg12" style="display:flex;justify-content:space-between;">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered-joinBtn">交接完成</span>
                            <div style="display:flex;">
                                <input type="text" class="layui-input" placeholder="扫描跟踪号/订单号/交接单号" id="tobedelivered_makeupOrderInput">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" style="margin-left:15px;" id="tobedelivered_makeupOrderBtn">补打交接单</span>
                            </div>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedeliveredScan_printBtn">打印交接单</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="layui-card">
            <div class="layui-card-body">
                <table class="layui-table">
                    <thead>
                        <tr>
                            <th>订单编号</th>
                            <th>物流方式</th>
                            <th>跟踪号</th>
                            <th>卖家简称</th>
                            <th>包裹重量(kg)</th>
                            <th>运费(¥)</th>
                            <th>扫描时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="tobedelivered-scanTbody"></tbody>
                </table>
            </div>
        </div>
        <div class="totalWeight">
            <font size="10" color="#ff0000">合计: <span id="tobedeliveredScan_totalWeight">0</span></font>
        </div>
    </div>
</script>

<%-- 弹框---速卖通大包裹 --%>
<script type="text/html" id="tobedelivered-smtBigPackageLayer">
    <div class="layui-row">
        <div class="layui-card">
            <div class="layui-card-body">
                <form class="layui-form">
                    <div class="layui-form-item">
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">参考单号或跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="referOrder">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单编号或跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="order">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">物流公司</label>
                            <div class="layui-input-block compositeStyle">
                                <select name="tobedelivered-companySelectBig" id="tobedelivered-companySelectBig" lay-search>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单快递公司</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="company" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">物流方式</label>
                            <div class="layui-input-block compositeStyle">
                                <select name="tobedelivered-waySelectBig"
                                    id="tobedelivered-waySelectBig"
                                    xm-select="tobedelivered-waySelectBig">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单物流方式</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="logisWay" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">揽收地址</label>
                            <div class="layui-input-block">
                                <select name="collectAddress" id="tobedelivered_smtBig_collect" lay-search></select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">退回地址</label>
                            <div class="layui-input-block">
                                <select name="returnAddress" id="tobedelivered_smtBig_return"  lay-search></select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单数量</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" id="tobedeliveredSmt_orderNum" value="0" readonly/>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <div class="disflex ml10">
                                <input type="text" class="layui-input mr10" name="smtSheetSearchStatusAndCancelVal"/>
                                <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedeliveredSmt-searchStatusBtn">查询状态</span>
<%--                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedeliveredSmt-cancelSubmitBtn">取消提交</span>--%>
                            </div>
                        </div>
                        <div class="layui-col-md12 layui-col-lg12" style="display:flex;justify-content:space-between;">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered-joinBigBtn">提交发布交接单</span>
                            <div style="display:flex;">
                                <input type="text" class="layui-input" placeholder="扫描跟踪号/订单号/交接单号" id="tobedelivered_makeupOrderInput">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" style="margin-left:15px;" id="tobedelivered_makeupOrderBtn">补打交接单</span>
                            </div>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedeliveredSmtBig_printBtn">打印交接单</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="layui-card">
            <div class="layui-card-body">
                <table class="layui-table">
                    <thead>
                        <tr>
                            <th>订单编号</th>
                            <th>物流方式</th>
                            <th>跟踪号</th>
                            <th>LP号</th>
                            <th>卖家简称</th>
                            <th>包裹重量(g)</th>
                            <th>运费(¥)</th>
                            <th>扫描时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="tobedelivered-bigPackageTbody"></tbody>
                </table>
            </div>
        </div>
        <div class="totalWeight">
            <font size="10" color="#ff0000">合计: <span id="tobedeliveredSmtBig_totalWeight">0</span></font>
        </div>
    </div>
</script>

<%-- 弹框---lazada快递交接单 --%>
<script type="text/html" id="tobedelivered-lazadaHandoverSheetLayer">
    <div class="layui-row">
        <div class="layui-card">
            <div class="layui-card-body">
                <form class="layui-form">
                    <div class="layui-form-item">
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">参考单号或跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="referOrderLazadaSheet">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单编号或跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="orderLazadaSheet">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">物流公司</label>
                            <div class="layui-input-block compositeStyle">
                                <select name="tobedelivered-companySelectLazada" id="tobedelivered-companySelectLazada" lay-search>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单快递公司</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="companyLazadaSheet" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">物流方式</label>
                            <div class="layui-input-block compositeStyle">
                                <select name="tobedelivered-waySelectLazada"
                                    id="tobedelivered-waySelectLazada"
                                    xm-select="tobedelivered-waySelectLazada">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单物流方式</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="logisWayLazadaSheet" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">揽收地址</label>
                            <div class="layui-input-block">
                                <select name="collectAddress" id="tobedelivered_lazadaSheet_collect" lay-search></select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">退回地址</label>
                            <div class="layui-input-block">
                                <select name="returnAddress" id="tobedelivered_lazadaSheet_return"  lay-search></select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">寄送方式</label>
                            <div class="layui-input-block">
                                <select name="deliveredWay" id="tobedelivered_deliveredWay"  lay-search></select>
                            </div>
                        </div>
                        <div class="layui-col-md12 layui-col-lg12">
                            <div>
                                <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered-submitOrder" style="float:left;">
                                提交发布交接单
                                </span>
                            </div>
                            <div style="float:left;width: 30%;">
                                <label class="layui-form-label">订单数量</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="tobedeliveredLazada_orderNum" value="0" readonly>
                                </div>
                            </div>
                            <div style="display:flex;float:right;">
                                <div style="display:flex;">
                                    <input type="text" class="layui-input" placeholder="扫描跟踪号/订单号/交接单号" id="tobedelivered_makeupOrderInput">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" style="margin:0 15px;" id="tobedelivered_makeupOrderBtn">补打交接单</span>
                                </div>
                                <div style="display:flex;margin-right:10px;">
                                    <input type="text" class="layui-input" name="lazadaSheetSearchStatusAndCancelVal">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" style="margin-left:10px;" id="tobedelivered-searchStatusBtn">查询状态</span>
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered-cancelSubmitBtn">
                                    取消提交
                                    </span>
                                </div>
                                <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedeliveredLazadaSheet_printBtn">打印交接单</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="layui-card">
            <div class="layui-card-body">
                <table class="layui-table">
                    <thead>
                        <tr>
                            <th>订单编号</th>
                            <th>物流方式</th>
                            <th>跟踪号</th>
                            <th>卖家简称</th>
                            <th>包裹重量(kg)</th>
                            <th>运费(¥)</th>
                            <th>扫描时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="tobedelivered-lazadaSheetTbody"></tbody>
                </table>
            </div>
        </div>
        <div class="totalWeight">
            <font size="10" color="#ff0000">合计: <span id="tobedeliveredLazadaSheet_totalWeight">0</span></font>
        </div>
    </div>
</script>

<%-- 弹框---shopee快递交接单 --%>
<script type="text/html" id="tobedelivered-shopeeHandoverSheetLayer">
    <div class="layui-row">
        <div class="layui-card">
            <div class="layui-card-body">
                <form class="layui-form">
                    <div class="layui-form-item">
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">参考单号或跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="referOrderShopee">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单编号或跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="orderShopee">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">物流公司</label>
                            <div class="layui-input-block compositeStyle">
                                <select name="tobedelivered-companySelectShopee" id="tobedelivered-companySelectShopee" lay-search>
                                </select>
                                <div class="compositeCk">
                                    <input type="checkbox" name="checkCompanyShopee" lay-skin="primary" title="检查物流公司" checked>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单快递公司</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="companyShopee" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">物流方式</label>
                            <div class="layui-input-block compositeStyle">
                                <select name="tobedelivered-waySelectShopee"
                                    id="tobedelivered-waySelectShopee"
                                    xm-select="tobedelivered-waySelectShopee">
                                </select>
                                <div class="compositeCk">
                                    <input type="checkbox" name="checkWayShopee" lay-skin="primary" title="检查物流方式" checked>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单物流方式</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="logisWayShopee" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md12 layui-col-lg12">
                            <div class="layui-col-md6 layui-col-lg6">
                                <div style="float:left;width: 30%;">
                                    <label class="layui-form-label">订单数量</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" id="tobedelivered_orderNumShopee" value="0" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md6 layui-col-lg6">
                                <label class="layui-form-label">预报号</label>
                                <div class="layui-input-block compositeStyle">
                                    <select name="tobedelivered-forecast-number" id="tobedelivered-forecast-number" lay-search>
                                    </select>
                                    <div class="compositeCk">
                                        <permTag:perm funcCode="tobedelivered_get_forecast_number">
                                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered_get_forecast_number">获取预报号</span>
                                        </permTag:perm>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md12 layui-col-lg12">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered-joinBtnShopee" style="float:left;">交接完成</span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedeliveredScan_printBtnShopee" style="float:right;">打印交接单</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="layui-card">
            <div class="layui-card-body">
                <table class="layui-table">
                    <thead>
                        <tr>
                            <th>订单编号</th>
                            <th>物流方式</th>
                            <th>跟踪号</th>
                            <th>卖家简称</th>
                            <th>包裹重量(kg)</th>
                            <th>运费(¥)</th>
                            <th>状态</th>
                            <th>扫描时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="tobedelivered-shopeeScanTbody"></tbody>
                </table>
            </div>
        </div>
        <div class="totalWeight">
            <font size="10" color="#ff0000">合计: <span id="tobedeliveredScan_totalWeightShopee">0</span></font>
        </div>
    </div>
</script>

<%-- 弹框---优选仓组包-ztt20220711 --%>
<script type="text/html" id="tobedelivered-optimizationSheetLayer">
    <div class="layui-row">
        <div class="layui-card">
            <div class="layui-card-body">
                <form class="layui-form">
                    <div class="layui-form-item">
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">参考单号或跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="referOrderOptimization">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单编号或跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="orderOptimization">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">物流公司</label>
                            <div class="layui-input-block compositeStyle">
                                <select name="tobedelivered-companySelectOptimization" id="tobedelivered-companySelectOptimization" lay-search>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单快递公司</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="companyOptimization" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">物流方式</label>
                            <div class="layui-input-block compositeStyle">
                                <select name="tobedelivered-waySelectOptimization"
                                    id="tobedelivered-waySelectOptimization"
                                    xm-select="tobedelivered-waySelectOptimization">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单物流方式</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="logisWayOptimization" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单数量</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" id="tobedelivered_orderNumOptimization" value="0" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                          <div style="display:flex;margin-left: 15px;box-sizing: border-box;width: 100%;">
                              <div style="display:flex;">
                                <div style="display:flex;line-height: 32px;">
                                    <input type="checkbox" lay-skin="primary" title="跟踪号过滤" name="trackNumFilter">
                                    <div style="display:flex;">
                                        <span>前</span>
                                        <input type="text" class="layui-input" name="trackNumFilterFront" style="width:50px;margin:0 20px 0 8px;">
                                    </div>
                                    <div style="display:flex;">
                                        <span>后</span>
                                        <input type="text" class="layui-input" name="trackNumFilterAfter" style="width:50px;margin:0 20px 0 8px;">
                                    </div>
                                </div>
                              </div>
                              <%-- 右侧部分 --%>
                              <div style="display:flex;line-height: 32px;margin-left: 20px;">
                                <input type="checkbox" lay-skin="primary" title="校验跟踪长度" name="checkTrackLength">
                                <input type="text" class="layui-input" style="width:50px;margin:0 5px 0 -12px;"  name="checkTrackLengthNum">
                                <span style="margin-right:20px;">位</span>
                                <%-- 过滤中括号 --%>
                                <input type="checkbox" lay-skin="primary" title="过滤中括号" name="filterBrackets">
                              </div>
                          </div>
                        </div>
                        <div class="layui-col-md12 layui-col-lg12" style="display:flex;justify-content:space-between;">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered-joinBtnOptimization">提交发布交接单</span>
                            <div style="display:flex;">
                                <input type="text" class="layui-input" placeholder="扫描跟踪号/订单号/交接单号" id="tobedelivered_makeupOrderInput">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" style="margin-left:15px;" id="tobedelivered_makeupOrderBtn">补打交接单</span>
                            </div>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedeliveredScan_printBtnOptimization">打印交接单</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="layui-card">
            <div class="layui-card-body">
                <table class="layui-table">
                    <thead>
                        <tr>
                            <th>订单编号</th>
                            <th>物流方式</th>
                            <th>跟踪号</th>
                            <th>LP号</th>
                            <th>卖家简称</th>
                            <th>包裹重量(kg)</th>
                            <th>运费(¥)</th>
                            <th>扫描时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="tobedelivered-optimizationScanTbody"></tbody>
                </table>
            </div>
        </div>
        <div class="totalWeight">
            <font size="10" color="#ff0000">合计: <span id="tobedeliveredScan_totalWeightOptimization">0</span></font>
        </div>
    </div>
</script>

<%-- 弹框---AE全托管-ztt20230719 --%>
<script type="text/html" id="tobedelivered-aefullyhostedLayer">
    <div class="layui-row">
        <div class="layui-card">
            <div class="layui-card-body">
                <form class="layui-form">
                    <div class="layui-form-item">
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">参考单号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="referOrderAefullyhosted" placeholder="输入订单号/跟踪号识别">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单/跟踪号</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="orderAefullyhosted" placeholder="扫描条形码输入">
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">店铺</label>
                            <div class="layui-input-block storeStyle">
                                <select name="tobedelivered-storeSelectAefullyhosted" id="tobedelivered-storeSelectAefullyhosted" lay-search>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单店铺</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="storeAefullyhosted" readonly>
                            </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                          <label class="layui-form-label">收件仓库</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="referReceiveWarehouse" readonly>
                          </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                          <label class="layui-form-label">订单收货仓库</label>
                          <div class="layui-input-block">
                              <input type="text" class="layui-input" name="receiveWarehouse" readonly>
                          </div>
                        </div>
                        <!-- <div class="layui-col-md6 layui-col-lg6">
                            <label class="layui-form-label">订单数量</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" id="tobedelivered_orderNumAefullyhosted" value="0" readonly>
                            </div>
                        </div> -->
                        <div class="layui-col-md6 layui-col-lg6">
                          <div style="display:flex;box-sizing: border-box;" class="layui-input-block">
                              <div style="display:flex;">
                                <div style="display:flex;line-height: 32px;">
                                    <input type="checkbox" lay-skin="primary" title="跟踪号过滤" name="trackNumFilter">
                                    <div style="display:flex;">
                                        <span>前</span>
                                        <input type="text" class="layui-input" name="trackNumFilterFront" style="width:50px;margin:0 20px 0 8px;">
                                    </div>
                                    <div style="display:flex;">
                                        <span>后</span>
                                        <input type="text" class="layui-input" name="trackNumFilterAfter" style="width:50px;margin:0 20px 0 8px;">
                                    </div>
                                </div>
                              </div>
                              <%-- 右侧部分 --%>
                              <div style="display:flex;line-height: 32px;margin-left: 20px;">
                                <input type="checkbox" lay-skin="primary" title="校验跟踪长度" name="checkTrackLength">
                                <input type="text" class="layui-input" style="width:50px;margin:0 5px 0 -12px;"  name="checkTrackLengthNum">
                                <span style="margin-right:20px;">位</span>
                                <%-- 过滤中括号 --%>
                                <input type="checkbox" lay-skin="primary" title="过滤中括号" name="filterBrackets">
                              </div>
                          </div>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <!-- <div>
                              <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered-joinBtnAefullyhosted">创建揽收单</span>
                              <input type="checkbox" lay-skin="primary" title="自寄" name="selfSend">
                            </div> -->
                            <div style="display:flex;" class="layui-input-block">
                                <input type="text" class="layui-input" id="tobedelivered_makeupOrderInputAefullyhosted">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" style="margin-left:15px;" id="tobedelivered_makeupOrderAefullyhostedBtn">补打交接单</span>
                            </div>
                            <!-- <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedeliveredScan_printBtnAefullyhosted">打印揽收单</span> -->
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="layui-card layui-col-space10">
          <div class="layui-col-md6 layui-col-lg6">
            <div class="layui-card-body">
                <div style="display:flex;justify-content: space-between;align-items: center">
                  <span class="layui-btn layui-btn-sm" id="tobedelivered-joinBtnAefullyhosted-collet">创建揽收单</span>
                  <span>订单数量: <span class="showNumStyle" id="tobedelivered_orderNumAefullyhosted_collet">0</span></span>
                  <span>合计: <span class="showNumStyle" id="tobedeliveredScan_totalWeightAefullyhosted_collet">0</span></span>
                  <span class="layui-btn layui-btn-sm" id="tobedeliveredScan_printBtnAefullyhosted_collet">打印揽收单</span>
                </div>
                <table class="layui-table">
                    <thead>
                        <tr>
                            <th>订单编号</th>
                            <th class="disN">物流方式</th>
                            <th>跟踪号</th>
                            <th class="disN">LP号</th>
                            <th>卖家简称</th>
                            <th>包裹重量(kg)</th>
                            <th class="disN">运费(¥)</th>
                            <th>扫描时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="tobedelivered-aefullyhostedScanTbody-collect"></tbody>
                </table>
            </div>
          </div>
          <div class="layui-col-md6 layui-col-lg6">
            <div class="layui-card-body">
              <div style="display:flex;justify-content: space-between;align-items: center;margin-bottom: 10px;">
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedelivered-joinBtnAefullyhosted-selfSend">创建自寄单</span>
                <span>订单数量: <span class="showNumStyle" id="tobedelivered_orderNumAefullyhosted_selfSend">0</span></span>
                <span>合计: <span class="showNumStyle" id="tobedeliveredScan_totalWeightAefullyhosted_selfSend">0</span></span>
                <span class="layui-btn layui-btn-sm layui-btn-normal" id="tobedeliveredScan_printBtnAefullyhosted_selfSend">打印自寄单</span>
              </div>
                <table class="layui-table">
                    <thead>
                        <tr>
                            <th>订单编号</th>
                            <th class="disN">物流方式</th>
                            <th>跟踪号</th>
                            <th class="disN">LP号</th>
                            <th>卖家简称</th>
                            <th>包裹重量(kg)</th>
                            <th class="disN">运费(¥)</th>
                            <th>扫描时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="tobedelivered-aefullyhostedScanTbody-selfSend"></tbody>
                </table>
            </div>
          </div>
        </div>
        <!-- <div class="totalWeight">
            <font size="10" color="#ff0000">合计: <span id="tobedeliveredScan_totalWeightAefullyhosted">0</span></font>
        </div> -->
    </div>
</script>

<%-- 弹框--ebay取消订单原因展示 --%>
<script type="text/html" id="tobedelivered_cancelEbayTpl">
    <form class="layui-form">
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
<%-- 权限问题---wish退款 --%>
<script type="text/html" id="tobedelivered_btnPermTag_wish">
    <permTag:perm funcCode="tobedelivered_wishBtnPermTag">
        <button name="tobedelivered_wishBtn" class="layui-btn layui-btn-xs">
            wish退款
        </button><br>
    </permTag:perm>
</script>
<%-- AE托管显示SKU标签 --%>
<script type="text/html" id="tobedelivered_aeSkuTagDom">
  <button name="tobedelivered_aeSkuTagBtn" class="layui-btn layui-btn-xs" type="button">
    AE商品标签
  </button>
</script>
<!-- 自行发货弹框 -->
<script type="text/html" id="tobedelivered_selfSendLayer">
  <div class="layui-form" style="padding: 20px 20px 20px 0">
    <div class="layui-form-item">
      <label class="layui-form-label"><font color="red">*</font>送仓物流方式</label>
      <div class="layui-input-block">
        <input type="radio" name="delivery_type" value="1" title="快递" checked lay-filter="delivery_type_radio">
        <input type="radio" name="delivery_type" value="2" title="卡车派送或其他" lay-filter="delivery_type_radio">
      </div>
    </div>
    <div class="layui-form-item express">
      <label class="layui-form-label"><font color="red">*</font>物流服务商</label>
      <div class="layui-input-block">
        <input type="text" class="layui-input"  name="logistics_service_provider" placeholder="请输入物流服务商">
      </div>
    </div>
    <div class="layui-form-item express">
      <label class="layui-form-label"><font color="red">*</font>快递单号</label>
      <div class="layui-input-block">
        <input type="text" class="layui-input" name="appointment_express_no" placeholder="请输入快递单号">
      </div>
    </div>
    <div class="layui-form-item truck disN">
      <label class="layui-form-label"><font color="red">*</font>车牌号</label>
      <div class="layui-input-block">
        <input type="text" class="layui-input"  name="appointment_license_plate" placeholder="请输入车牌号">
      </div>
    </div>
    <!-- <div class="layui-form-item truck">
      <label class="layui-form-label">预估体积</label>
      <div class="layui-input-block">
        <input type="text" class="layui-input"  name="" placeholder="请输入预估体积">
        <span>m³</span>
      </div>
    </div> -->
    <div class="layui-form-item truck disN">
      <label class="layui-form-label">联系电话</label>
      <div class="layui-input-block">
        <input type="text" class="layui-input" name="appointment_phone_number" placeholder="请输入联系电话">
      </div>
    </div>
  </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script src="${ctx}/static/js/order/tobedelivered.js"></script>
<script src="${ctx}/static/vue/js/vue@2.6.10.js"></script>
<script src="${ctx}/static/js/ireport/print.js"></script>