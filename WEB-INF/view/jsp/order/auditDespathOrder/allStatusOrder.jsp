<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>全部订单</title>
<style>
    #allStatusOrder_logisRule_match_analysis_tabs .layui-tab-title li {
        padding: 0;
    }
    .shallow-yellow{
        background-color: #dec674;
    }
    .shallow-yellow:hover{
        background-color: #dec674 !important;
    }
    .match-grey {
        color: #ccc;
    }
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
    .mg_t{
        margin-top:10px;
    }
    .mg{
        margin:0 10px;
    }

    .fr {
        float: right;
    }
    .mr3 {
      margin-right: 3px;
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
        display: none;
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

    .externalContainabnorlmalorder {
        position: relative;
        width: 0;
        float: left;
        height: 0;
        z-index: 20190918;
    }

    .externalPopAuditorder {
        clear: left;
        position: relative;
        left: -30.667vw;
        top: 40px;
        width: 35vw;
        border: 1px solid #e6e6e6;
        background-color: lightyellow;
        padding: 20px 0;
        border-radius: 5px;
        box-shadow: 1px 1px 1px grey;
    }

    .externalBox {
        width: 70px;
        line-height: 32px;
        text-align: center;
        border: 1px solid #e6e6e6;
        margin-left: 15px;
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
    #LAY-allStatusOrder .layui-btn+.layui-btn{
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
    .hide{
        display: none!important;
    }

    .allStatusOrder-noteContent-tag{
        color:#008B8B;
        border: 1px solid #008B8B;
        background-color: #fff;
    }

    .allStatusOrder_store_style .xm-select-dl{
        width:-webkit-fill-available !important;
    }
    .skuEllipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    #allStatusOrder_save .common-save-dropdown {
      bottom: 5px !important;
    }
    .placeholder_color input::placeholder {
        color: #333; /* 设置占位符文本的颜色 */
    }

</style>
<div class="layui-fluid" id="LAY-allStatusOrder">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="allStatusOrderForm" lay-filter="allStatusOrderForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-form-label labelSel">
                                    <select name="orderTimeType">
                                        <option value="orderTimeCn">订单时间</option>
                                        <option value="shippingTime">发货时间</option>
                                        <option value="shipByDate">截止发货</option>
                                        <option value="packingTime">包装时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="allStatusOrder_time" name="time">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select name="platCode" lay-filter="allstatusplatCodes" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgs" lay-search class="orgs_hp_custom" lay-filter="allStatusOrder_orgs">
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select lay-filter="allStatusOrder_salerAndcustomSelectFilter" name="salerAndcustomSelect">
                                        <option value="1">销售</option>
                                        <option value="2">客服</option>
                                        <option value="4">组长</option>
                                        <option value="3">主管</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="salePersonId" class="users_hp_custom" lay-filter="allStatusOrder_salerAndcustom" id="allStatusOrder_salePersonsSelect" xm-select="allStatusOrder_salePersonsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 allStatusOrder_store_style">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select
                                    class="users_hp_store_multi"
                                    id="allStatusOrder_store"
                                    name="storeAcctIds"
                                    xm-select="allStatusOrder_store"
                                    xm-select-search
                                    xm-select-search-type="dl"
                                    xm-select-skin="normal">
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
                                    <select name="platOrderStatusList" xm-select="platOrderStatusList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search="">
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
                                <label class="layui-form-label labelSel">
                                  <select name="platTagsSign" lay-filter="allStatusOrder_platTagsSign">
                                    <option value="1">平台标签(包含)</option>
                                    <option value="0">平台标签(不含)</option>
                                    <option value="3">订单标签(包含)</option>
                                    <option value="2">订单标签(不含)</option>
                                </select>
                                </label>
                                <div class="layui-input-block">
                                    <select name="platTags" xm-select="allStatusOrder_platTags" id="allStatusOrder_platTags" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label" style="padding:0px 0px 0px 5px">
                                    <select name="agentCompany" lay-filter="allstatuscompanyType">
                                        <option value="logisticsModes">物流方式集</option>
                                        <option value="companys">物流公司</option>
                                        <option value="agents">货代公司</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select type="text" name="logisticsCompanyId" lay-filter="allstatuscompany" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label">物流方式</label>
                                <div class="layui-input-block">
                                    <select 
                                    name="logisTypeIds" 
                                    xm-select="logisTypeIds_xm_select_allOrder"
                                    id="logisTypeIds_xm_select_allOrder" 
                                    xm-select-search 
                                    xm-select-search-type="dl" 
                                    xm-select-skin="normal">
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
                                <div class="layui-form-label select_label ml placeholder_color">
                                    <select name="orderAmountCurrency">
                                        <option selected value>订单金额</option>
                                        <option value="USD">订单金额(仅USD)</option>
                                        <option value="CNY">订单金额(仅CNY)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="platOrderAmtMin" class="layui-input">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="platOrderAmtMax" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label labelSel">
                                    <select name="dateType">
                                        <option value="1">订单天数</option>
                                        <option value="2">跟踪号天数</option>
                                        <option value="3">上网剩余天数</option>
                                        <option value="4">跟踪剩余天数</option>
                                        <option value="5">发货剩余天数</option>
                                    </select>
                                </label>
                                <div class="layui-input-block dis_flex_space">
                                    <input type="number" name="orderDateMin" class="layui-input">
                                    <span>&nbsp;~&nbsp;</span>
                                    <input type="number" name="orderDateMax" class="layui-input">
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
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">物流状态</label>
                              <div class="layui-input-block">
                                <select 
                                name="logisticsStatusList"
                                id="allStatusOrder_typeIdStr"
                                xm-select="allStatusOrder_typeIdStr"
                                xm-select-search
                                xm-select-search-type="dl"
                                xm-select-skin="normal">
                                </select>
                              </div>
                          </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label labelSel">
                                    <select name="orderLabels" xm-select="allStatusOrder_orderLabels" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" name="orderNote" class="layui-input" placeholder="备注内容" style="height:34px;">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">订单状态</label>
                                <div class="layui-input-block">
                                    <select name="processStatusList" xm-select="processStatusList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                                <div class="layui-col-lg2 layui-col-md2 ">
                                    <label class="layui-form-label">排序方式</label>
                                    <div class="layui-input-block">
                                        <select name="orderStr" lay-search>
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
                                            <option value="o.shipping_time asc">发货时间正序</option>
                                            <option value="o.shipping_time desc">发货时间倒序</option>
                                            <option value="close_time asc">跟踪号剩余天数正序</option>
                                            <option value="close_time desc">跟踪号剩余天数倒序</option>
                                            <option value="o.profit/(o.plat_order_amt*o.exchange_rate) asc">利润率正序</option>
                                            <option value="o.profit/(o.plat_order_amt*o.exchange_rate) desc">利润率倒序</option>
                                        </select>
                                    </div>
                                </div>
                            <div class="externalContainabnorlmalorder disN">
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
                                                <select name="warehouseId" lay-search id="allStatusOrder_warehouseId" lay-filter="warehouseId">
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
                                            <label class="layui-form-label">楼栋</label>
                                            <div class="layui-input-block">
                                                <select name="buildingNo" class="buildNo" lay-filter="afterdispatchtowh_">
                                                </select>
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
                                            <label class="layui-form-label">付款邮箱</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="buyerEmail" class="layui-input">
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
                                            <label class="layui-form-label">开发专员</label>
                                            <div class="layui-input-block">
                                                <select name="preprodDevId" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg5 layui-col-md5">
                                        <label class="layui-form-label">单品金额</label>
                                        <div class="layui-input-block dis_flex_space">
                                            <input type="number" name="platUnitPriceMin" class="layui-input">
                                            <span>&nbsp;~&nbsp;</span>
                                            <input type="number" name="platUnitPriceMax" class="layui-input">
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
                                        <div class="layui-col-md5 layui-col-lg5">
                                            <label class="layui-form-label">邮编</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="zipCode" class="layui-input">
                                            </div>
                                        </div>
                                    </div>
                                        <div class="layui-form-item">
                                
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <label class="layui-form-label">订单类型</label>
                                                <div class="layui-input-block">
                                                    <select name="operOrderType" lay-search>
                                                        <option value="">请选择</option>
                                                        <option value="1">拆分订单</option>
                                                        <option value="2">合并订单</option>
                                                        <option value="3">重寄订单</option>
                                                    </select>
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
                                                <label class="layui-form-label labelSel">
                                                  <select name="orderTagSign" lay-filter="allStatusOrder_orderTagSign">
                                                    <option value="1">订单标签(包含)</option>
                                                    <option value="0">订单标签(不含)</option>
                                                  </select>
                                                </label>
                                                <div class="layui-input-block">
                                                  <select name="orderTagList" 
                                                  xm-select="allStatusOrder_orderTagLists" id="allStatusOrder_orderTagLists" 
                                                  xm-select-search 
                                                  xm-select-search-type="dl" 
                                                  xm-select-skin="normal">
                                                  </select>
                                                </div>
                                            </div>
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <label class="layui-form-label">州/省</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="buyerShippingState" class="layui-input">
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
                                                <label class="layui-form-label">城市</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="city" class="layui-input">
                                                </div>
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2" style="display: flex;">
                                
                                    <div class="externalBox mr3" id="showMoreSearchCondition_allStatusOrder">
                                    <span>更多<span class="hasValue"></span></span>
                                    <span id="hide_icon_allStatusOrder" class="fr mr10 hidden">︽</span>
                                    <span id="show_icon_allStatusOrder" class="fr mr10">︾</span>
                                    </div>
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch mr3" lay-submit="" id="allStatusOrderSearch" lay-filter="allStatusOrderSearch">查询</button>
                                    <!-- <button type="button" class="layui-btn layui-btn-sm layui-btn-primary" lay-submit="" id="allStatusOrder_export" lay-filter="allStatusOrder_export">导出</button>
                                    <button type="button" class="layui-btn layui-btn-sm" lay-submit="" id="allStatusOrderDetail_export" lay-filter="allStatusOrderDetail_export">导出明细</button> -->
                                    <div id="allStatusOrder_save" class="inline_block pora"></div>
                                    <div id="allStatusOrder_exportTemplate" style="display: inline-block;position: relative;margin-right: 3px;"></div>
                            </div>
                            </div>
                            <%-- <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">订单备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="orderNote" class="layui-input" placeholder="">
                                </div>
                            </div> --%>

<%--                            <input class="hide" type="text" name="processStatus" value="501">--%>
                            <input class="hide" type="text" name="page" value="1">
                            <input class="hide" type="text" name="limit" value="5000">
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="allStatusOrderCard">
                <div class="layui-card-body">
                    <div class="dis_flex_space">
                        <div>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm hidden">批量操作左布局</button>
                        </div>
                        <div>

                        </div>
                    </div>
                    <div class="layui-tab" lay-filter="allStatusOrder_Tab" id="allStatusOrder_Tab">
                        <div class="disFCenter">
                            <div style="height:42px;">
                                <ul class="layui-tab-title" style="width: 80%;">
                                    <li class="layui-this">数量(<span></span>)</li>
                                </ul>
                            </div>
                            <div>
                                <div>
                                    <span class="layui-btn-sm layui-btn layui-btn-normal" id="allStatusOrder_saveOrderConfig">
                                        保存设置
                                    </span>
                                  
                                    <permTag:perm funcCode="allStatusOrder_orderHandleBtns_permTag">
                                    <div id="allStatusOrder_orderHandleBtns" class="layui-inline">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单驳至</button>
                                        <ul class="hidden">
                                            <li data-value="130">待包装</li>
                                            <li data-value="125">待核单</li>
                                            <li data-value="120">待配货</li>
                                            <li data-value="115">待派单</li>
                                            <li data-value="110">待审核</li>
                                        </ul>
                                    </div>
                                    </permTag:perm>
                                    <span id="allStatusOrder_platOperate" style="position:relative;">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">平台操作</button>
                                        <ul class="hidden">
                                            <li>
                                                <div>后台取消</div>
                                                <ul>
                                                    <permTag:perm funcCode="allStatusOrder_cancelOrderEbay_permTag">
                                                    <li id="allStatusOrder_cancelOrderEbay">ebay取消</li>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="allStatusOrder_rejectOrderdabao_permTag">
                                                    <li id="allStatusOrder_rejectOrderdabao">优选仓拒单</li>
                                                    </permTag:perm>
                                                </ul>
                                            </li>
                                            <li>
                                                <div>其他操作</div>
                                                <ul>
                                                    <li id="allStatusOrder_syncOrderStatus">更新订单状态</li>
                                                    <li id="allStatusOrder_markDelivery">标记平台发货</li>
                                                    <permTag:perm funcCode="allStatusOrder_decryptAddress_permTag">
                                                    <li id="allStatusOrder_decryptAddress">解密地址</li>
                                                    </permTag:perm>
                                                </ul>
                                            </li>
                                            <li>
                                                <div>邮件</div>
                                                <ul>
                                                    <li id="allStatusOrder_amazonEmail">Amazon邮件</li>
                                                    <li id="allStatusOrder_eBayEmail">eBay邮件</li>
                                                    <li id="allStatusOrder_shopeeEmail">shopee发送消息</li>
                                                    <li id="allStatusOrder_tiktokEmail">tiktok发送消息</li>
                                                    <li id="allStatusOrder_ozonEmail">ozon发送消息</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </span>
                                        <div id="allStatusOrder_logisRuleAll" class="layui-inline">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">物流处理</button>
                                            <ul class="hidden">
                                                <permTag:perm funcCode="allStatusOrder_yanwenCutOrder_permTag">
                                                <li id="allStatusOrder_yanwenCutOrder">燕文截单</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="allStatusOrder_huayiTrackingNo_btn_permTag">
                                                <li id="allStatusOrder_huayiTrackingNo_btn">获取华亿跟踪号</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="allStatusOrder_logisRule_match_analysis_permTag">
                                                <li id="allStatusOrder_logisRule_match_analysis">物流规则匹配分析</li>
                                                </permTag:perm>
                                                <li id="allStatusOrder_logisRule_import_logistics">导入物流费</li>
                                                <permTag:perm funcCode="allStatusOrder_logisRule_replace_trackNum_permTag">
                                                <li id="allStatusOrder_logisRule_replace_trackNum">更换跟踪号</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="allStatusOrder_logisRule_getEdisebay">
                                                    <li id="allStatusOrder_logisRule_getEdisebay">获取跟踪号</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="allStatusOrder_import_thailandFee_perm">
                                                <li id="allStatusOrder_import_thailandFee" style="width: max-content;">导入泰国陆运(头程)</li>
                                                </permTag:perm>
                                            </ul>
                                        </div>
                                        <div id="allStatusOrder_dealOrder" class="layui-inline">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单处理</button>
                                            <ul class="hidden">
                                                <%-- <li id="allStatusOrder_rejectOrder_btn">驳回订单</li> --%>
                                                <li id="allStatusOrder_changeplatlabel">批量备注</li>
                                                <permTag:perm funcCode="allStatusOrder_resend_btn_permTag">
                                                <li id="allStatusOrder_resend_btn">重寄</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="allStatusOrder_cancelOrderBtn">
                                                <li id="allStatusOrder_cancelOrder" style="background: #ff0000;color: #fff;">取消订单</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="allStatusOrder_updateWeight">
                                                <li id="allStatusOrder_updateWeight" lay-tips="上传表格分2列，第1列：订单号/跟踪号，第2列：包裹重量(g)">修改称重</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="allStatusOrder_markException_permTag">
                                                <li id="allStatusOrder_markException" style="background: #FFB951;color: #fff;">标记异常</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="allStatusOrder_cancelTrack_permTag">
                                                    <li id="allStatusOrder_cancelTrack">作废跟踪号</li>
                                                </permTag:perm>
                                            </ul>
                                        </div>
                                        <span class="layui-btn-sm layui-btn" id="allStatusOrder_copyOrderNum">
                                          复制订单号
                                        </span>
                                        <span class="layui-btn-sm layui-btn" id="allStatusOrder_copyStoreNum">
                                          复制店铺单号
                                        </span>
                                        <span class="layui-btn-sm layui-btn" id="allStatusOrder_copyItemId"  style="margin-right: 3px;">
                                          复制itemId
                                        </span>
                                    <permTag:perm funcCode="allStatusOrder_printBtn">
                                        <div id="allStatusOrder_printOperate" class="layui-inline">
                                            <button type="button" class="layui-btn layui-btn-sm">打印</button>
                                            <ul class="hidden" style="margin-top: -3px;">
                                                <li id="allStatusOrder_logisLi">物流面单</li>
                                                <li id="allStatusOrder_setLi">配货单</li>
                                                <li id="allStatusOrder_setlogisLi" style="line-height: 17px;">物流面单(含SKU)</li>
                                                <!-- <li id="allStatusOrder_australiaBill">澳洲发票</li> -->
                                            </ul>
                                        </div>
                                    </permTag:perm>
                                    <div id="allStatusOrder_downloadInvoices" class="layui-inline">
                                        <button type="button" class="layui-btn layui-btn-sm">下载发票</button>
                                        <ul class="hidden" style="margin-top: -3px;">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-tab-content">
                            <%--<table lay-filter="allStatusOrder_table" class="layui-table" id="allStatusOrder_table"></table>--%>
                                <%--<div class="pageSortfix" id="allStatusOrderPage"></div>--%>
                            <div id="allStatusOrder_table" style="width: 100%;height: 500px;" class="ag-theme-balham"></div>
                            <div class="pageSortfix" id="allStatusOrderPage"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格-操作 --%>
<script type="text/html" id="allStatusOrder_handleBtn">
    <span class="layui-btn layui-btn-xs disN" lay-event="edit">修改订单</span>
    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="remark">备注</span>
</script>

<!-- 表格渲染模板 -->

<script type="text/html" id="allStatus_detail_img_tpl">
    <div>
        <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>
<%--订单号--%>
<script type="text/html" id="allStatusOrder_id_tpl">
    <div class="alignLeft">
    <input type="hidden" class="allStatusOrder_col_id" value="{{d.id}}">
    <div>
                <span class="pora copySpan">
                    <a>{{d.id||""}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                </span>
                    <span class="gray">[{{d.storeAcct||""}}[{{d.allrootAliasName||""}}]]</span>
                    {{# if(d.operOrderType=="1"){ }}
                    <span class="hp-badge layui-bg-orange fr" title="拆出订单">拆</span> {{# }else if(d.operOrderType=="2"){ }}
                    <span class="hp-badge layui-bg-orange fr" title="合并订单">合</span> {{# }}}
    </div>
    <div>
                    <span class="pora copySpan">
                    <a>{{d.platOrderId}}{{# if(d.platStoreOrderId){ }}({{d.platStoreOrderId}}){{# }}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                </span>
    </div>
    <div><span class="gray">仓库:</span><span>{{d.warehouseName||'未分配'}}</span></div>
    <div><span class="gray">销售:</span><span>{{d.salesPersons||''}}</span></div>
    </div>
</script>
<%--订单金额--%>
<script type="text/html" id="allStatusOrder_platOrderAmt_tpl">
    <div class="alignLeft">
        <div><span class='gray'>{{d.currency||""}}</span><span>{{d.platOrderAmt||""}}</span></div>
        <div><span class="gray">利润(RMB)</span><span>{{d.profit||'0.00'}}</span></div>
        <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
    </div>
</script>
<%--商品--%>
<script type="text/html" id="allStatusOrder_prodQuantity_tpl">
    <div class="alignLeft">
    <div><span class="gray">种类：</span><span>{{d.kindNum||""}}</span></div>
    <div><span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span></div>
    <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
    </div>
</script>
<%--收件人--%>
<script type="text/html" id="allStatusOrder_shippingUsername_tpl">
    <div class="alignLeft">
        <div>{{d.shippingUsername||""}}</div>
        <div>[{{d.shippingCountryCnName||""}}]</div>
    </div>
</script>
<%--物流--%>
<script type="text/html" id="allStatusOrder_logisTypeName_tpl">
    <div class="alignLeft">
        <div><span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}<span></div>
        <div><span class="gray">发货:</span><span>[{{d.logisTypeName||""}}]</span><span>[{{d.logisTrackingNo||""}}]</span></div>
    </div>
</script>
<%--时间--%>
<script type="text/html" id="allStatusOrder_time_tpl">
    <div class="alignLeft">
        <div><span class="gray">订单:</span><span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})<span></div>
        <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
        <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    </div>
</script>


<script type="text/html" id="allStatusOrder_option_tpl">
    <div class="dis_flex_start">
        <button class="layui-btn layui-btn-xs mtb hidden" lay-event="">行操作</button>
    </div>
</script>

<!-- 商品详情 -->
<script type="text/html" id="pop_allStatusOrder_detail">
    <div class="mg_50">
        <table class="layui-table" id="allStatusOrder_detail_table" lay-filter="allStatusOrder_detail_table"></table>
    </div>
</script>
<%--oa订单状态--%>
<script type="text/html" id="allStatusOrder_processStatus_tpl">
    <div>{{getprocessStatus(d.processStatus)}}</div>
</script>

<script type="text/html" id="allStatusOrder_appointWarehouseTypeTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="allStatusOrder_appointWarehouseTypeForm">
        <div class="p20">
            <div class="layui-form-item">
                <label class="layui-form-label">仓库类型</label>
                <div class="layui-input-block">
                    <input type="radio" name="warehouseType" value="DIRECT" title="直邮仓">
                    <input type="radio" name="warehouseType" value="" title="万邑通仓">
                </div>
            </div>
        </div>
    </form>
</script>

            <!-- 修改/新增订单 -->
            <script type="text/html" id="pop_allStatusOrder_newandeditorder">
                <div class="mg_50">
                    <div class="layui-tab" lay-filter="orderLog">
                        <ul class="layui-tab-title">
                          <li class="layui-this">详情</li>
                          <li>日志</li>
                        </ul>
                        <div class="layui-tab-content">
                          <div class="layui-tab-item layui-show">
                            <form class="layui-form" id="allStatusOrder_editForm" lay-filter="allStatusOrder_editForm">
                                <div class="layui-form-item">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">订单编号</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="id" class="layui-input" readonly>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">店铺单号</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="platOrderId" class="layui-input" lay-verify="required">
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">店铺</label>
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
                                        <label class="layui-form-label">订单北京时间</label>
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
                                        <label class="layui-form-label">币种</label>
                                        <div class="layui-input-block">
                                            <select name="currency" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label">订单金额</label>
                                        <div class="layui-input-block">
                                            <input name="platOrderAmt" type="text" class="layui-input">
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
                                            <select name="logisTypeId" lay-search>
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
                                    <div class="layui-col-lg2 layui-col-md2 ">
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
                                        <label class="layui-form-label">国家/地区</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="shippingCountryCode" class="layui-input">
                                        </div>
                                    </div>
                                    <button type="button" id="edit_submit" lay-filter="edit_submit" class="hide" lay-submit></button>
                                </div>
                                <!-- <div class="layui-form-item">
                                    <div class="layui-col-lg4 layui-col-md4 dis_flex">
                                        <input type="text" class="layui-input">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="toAuditOrder_addProducts">添加商品</button>
                                    </div>
                                </div> -->
                                <div class="layui-form-item">
                                    <div class="layui-col-lg12 layui-col-md12 ">
                                        <table class="layui-table" id="allStatusOrder_product_table" lay-filter="allStatusOrder_product_table"></table>
                                    </div>
                                </div>
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
             <!-- 修改订单标签 -->
             <script type="text/html" id="allStatusOrder_updateProdPInfoListPop">
                <div class="p20">
                    <form class="layui-form" id="allStatusOrder_updateProdPInfoListForm" lay-filter="allStatusOrder_updateProdPInfoListForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md12 layui-col-lg12">
                                <label class="layui-form-label">订单标签</label>
                                <div class="layui-input-block" style="height: 300px">
                                    <input name="Ids" type="hidden" class="layui-input">
                                    <div class="fl w300">
                                        <input name="opType" type="radio" value="新增单个" title="新增单个" checked>
                                        <input name="opType" type="radio" value="删除单个" title="删除单个">
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <select name="noteContent" id="allStatusOrder_noteContent_note">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </script>

            <!-- 重寄订单 -->
            <script type="text/html" id="pop_allStatusOrder_resend">
                <div class="mg_50">
                    <div class="layui-tab" lay-filter="orderLog">
                        <ul class="layui-tab-title">
                            <li class="layui-this">详情</li>
                        </ul>
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show">
                                <form class="layui-form" id="allStatusOrder_resend_editForm" lay-filter="allStatusOrder_resend_editForm">
                                    <div class="layui-form-item">
                                        <!-- <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">订单编号</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="id" class="layui-input layui-disabled" readonly style="color: #555!important;">
                                            </div>
                                        </div> -->
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">店铺单号</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="platOrderId" class="layui-input layui-disabled" style="color: #555!important;"
                                                readonly
                                                lay-verify="required">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">平台</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="platCode" readonly class="layui-disabled layui-input" style="color: #555!important;">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="storeAcct" readonly class="layui-disabled layui-input" style="color: #555!important;">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">站点</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="siteName" class="layui-disabled layui-input" readonly style="color: #555!important;">
                                            </div>
                                        </div>
                                        <!-- <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">订单北京时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="orderTimeCn" class="layui-input layui-disabled" readonly style="color: #555!important;">
                                            </div>
                                        </div> -->
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">交易ID</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="platTransactionId" class="layui-input layui-disabled" readonly style="color: #555!important;">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">币种</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="currency" class="layui-disabled layui-input" readonly style="color: #555!important;">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label">订单金额</label>
                                            <div class="layui-input-block">
                                                <input name="platOrderAmt" type="text" lay-verify="required" class="layui-input layui-disabled" readonly style="color: #555!important;">
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
                                            <label class="layui-form-label">买家指定物流</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="buyerRequireShippingType" class="layui-input layui-disabled" readonly style="color: #555!important;">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label">卖家邮箱</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="sellerEmail" class="layui-input layui-disabled" readonly style="color: #555!important;">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label">买家邮箱</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="buyerEmail" class="layui-input layui-disabled" readonly style="color: #555!important;">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label">买家ID</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="buyerUserId" class="layui-input layui-disabled" readonly style="color: #555!important;">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label"><font class="fRed">*</font>收件人</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="shippingUsername" class="layui-input" lay-verify="required">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label"><font class="fRed">*</font>收件人电话</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="shippingPhoneNumber" class="layui-input" lay-verify="required">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label"><font class="fRed">*</font>收件人邮编</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="shippingZip" class="layui-input" lay-verify="required">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg4 layui-col-md4 ">
                                            <label class="layui-form-label"><font class="fRed">*</font>地址1</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="shippingStreet1" class="layui-input" lay-verify="required">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label">地址2</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="shippingStreet2" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label"><font class="fRed">*</font>城市</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="shippingCity" class="layui-input" lay-verify="required">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label"><font class="fRed">*</font>州/省</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="shippingState" class="layui-input" lay-verify="required">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label"><font class="fRed">*</font>国家/地区</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="shippingCountryCode" class="layui-input" lay-verify="required">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg6 layui-col-md6">
                                            <label class="layui-form-label"><font class="fRed">*</font>备注类型</label>
                                            <div class="layui-input-block">
                                                <div class="layui-col-md6 layui-col-lg6">
                                                    <input type="text" name="noteType" class="layui-input layui-disabled" value="重寄订单" readonly style="color: #555!important;height:34px;" >
                                                    </select>
                                                </div>
                                                <div class="layui-col-md6 layui-col-lg6">
                                                    <input type="text" name="noteContent" class="layui-input" lay-verify="required" placeholder="备注内容"  style="height:34px;">
                                                </div>

                                            </div>
                                        </div>
                                        <button type="button" id="edit_submit" lay-filter="edit_submit" class="hide" lay-submit></button>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-lg4 layui-col-md4 dis_flex">
                                            <input type="text" class="layui-input">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="allStatusOrder_addProducts">添加商品</button>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-lg12 layui-col-md12 ">
                                            <table class="layui-table" id="allStatusOrder_resend_product_table" lay-filter="allStatusOrder_resend_product_table"></table>
                                        </div>
                                    </div>
                                    <button type="button" class="hide" id="order_savebtn">保存</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </script>

            <!-- 添加商品弹框 -->
            <script type="text/html" id="pop_allStatusOrder_addProducts">
                <div class="mg_50">
                    <span class="numCount">数量(<span id="pop_allStatusOrder_addProducts_num"></span>)</span>
                    <table class="layui-table" id="allStatusOrder_addProducts_table" lay-filter="allStatusOrder_addProducts_table"></table>
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

            <script type="text/html" id="allStatusOrder_edit_option">
                <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="edit_prod_delete">删除</button>
            </script>

            <script type="text/html" id="allStatusOrder_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>
            <script type="text/html" id="allStatusOrder_edit_ListingID">
                <input type="text" class="layui-input" name="" value="{{d.itemId||''}}">
            </script>
            <script type="text/html" id="allStatusOrder_edit_Prodsku">
                <div class="dis_flex">
                    <input type="text" class="layui-input" name="" value="{{d.prodSSku}}">
                    <i class="layui-icon refresh_icon">&#xe669;</i>
                </div>
            </script>
            <script type="text/html" id="allStatusOrder_edit_prodQuantity">
                <input type="number" class="layui-input" name="" value="{{d.prodQuantity||''}}" onkeypress="commonKeyPressInputPositiveInt(event)" min="1">
                <input type="hidden" name="platOrderItemId" value="{{d.platOrderItemId}}" />
                <input type="hidden" name="platDetailTranscationId" value="{{d.platDetailTranscationId}}" />
            </script>
            <script type="text/html" id="allStatusOrder_edit_platQuantity">
                <input type="number" class="layui-input" name="" value="{{d.platQuantity||0}}">
            </script>
            <script type="text/html" id="allStatusOrder_edit_platOrderDetailAmt">
                <input type="number" class="layui-input" value="{{d.platOrderDetailAmt||0}}" placeholder="订单币种" onkeypress="commonKeyPressInputFloat(event)" min="0">
            </script>

<!-- 表格渲染模板 -->


<%-- 物流规则分析 --%>
<script type="text/html" id="allStatusOrder_logisRule_match_analysisLayer">
    <div style="padding:20px;">
        <div id="allStatusOrder_logisRule_match_analysisLayerContainer" class="layui-fluid"></div>
    </div>
</script>
<script type="text/html" id="allStatusOrder_logisRule_match_analysisLayerTpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form">
                <div class="layui-form-item">
                    <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">订单编号</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled value="{{d.orderInfo.id || ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">国家/地区</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled value="{{d.orderInfo.shippingCountryCnName || ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">店铺名称</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled  value="{{d.orderInfo.storeAcct || ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">订单天数</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled  value="{{d.orderInfo.delayDays || ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">订单金额</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled  value="{{d.orderInfo.platOrderAmt || ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">运费</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled  value="{{d.orderInfo.shippingCost !==undefined ? d.orderInfo.shippingCost : ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">订单重量(g)</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled  value="{{d.orderInfo.preWeight || ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">发货仓库</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled  value="{{d.orderInfo.warehouseName || ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">买家指定物流</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled  value="{{d.orderInfo.buyerRequireShippingType || ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">物流方式</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled  value="{{d.orderInfo.logisTypeName || ''}}">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">平台</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" disabled  value="{{d.orderInfo.platCode || ''}}">
                        </div>
                    </div>
                    </div>
                </div>
            </form>
            <div>
                <span>
                    <span><strong>1.待处理订单匹配物流规则运费低的优先;</strong></span>
                    <span><strong>2.待处理订单未关联商品也匹配物流;</strong></span>
                    <span><strong>3.匹配物流规则金额币种:人民币RMB;</strong></span>
                </span>
                <span class="layui-btn layui-btn-sm layui-btn-normal" style="position:absolute;right:0;" id="allStatusOrder_logisRule_match_analysis_exportBtn">导出</span>
            </div>
      </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header">
        <!-- 页签点击结构 -->
            <div class="layui-tab" lay-filter="allStatusOrder_logisRule_match_analysis_tabs"
            id="allStatusOrder_logisRule_match_analysis_tabs">
                <ul class="layui-tab-title">
                  {{#  layui.each(Object.keys(d.resultMap), function(index, item){ }}
                  {{# if(index ==0){ }}
                  <li data-attr="{{item}}" class="layui-this">{{item}}</li>
                  {{# }else{ }}
                  <li data-attr="{{item}}">{{item}}</li>
                  {{# } }}
                  {{#　})　}}
                </ul>
            </div>
        </div>
        <div class="layui-card-body">
            <table class="layui-table">
            <thead>
                <tr>
                    <th>编号</th>
                    <th class="priority_sort">优先级
                        <span style="display:inline-flex;flex-direction:column;line-height:10px;cursor:pointer;">
                            <i class="layui-icon match-analysis-up">&#xe619;</i>
                            <i class="layui-icon match-analysis-down">&#xe61a;</i>
                        </span>
                    </th>
                    <th>物流方式</th>
                    <th>物流规则</th>
                    <th>备注</th>
                    <th>说明</th>
                </tr>
            </thead>
            <tbody id="allStatusOrder_logisRule_match_analysis_tbody">
                {{#  layui.each(d.resultMap['状态'], function(index, item){ }}
                <tr>
                    <td>{{ index+1 }}</td>
                    <td>{{item.priority}}</td>
                    <td>{{item.logisticsTypeName}}</td>
                    <td>{{item.ruleName}}</td>
                    <td>{{item.remark}}</td>
                    <td>{{item.desc}}</td>
                </tr>
                {{#　})　}}
            </tbody>
        </table>
        </div>
    </div>
</script>

<%-- 更换跟踪号 --%>
<script type="text/html" id="allStatusOrder_logisRule_replace_trackNum_layer">
    <div style="padding:20px">
        <%-- 展示按钮 --%>
        <div style="display:flex;justify-content: space-between;">
            <span class="layui-btn layui-btn-sm layui-btn-normal" id="allStatusOrder_logisRule_replace_trackNum_applyBtn">申请跟踪号
            </span>
            <span class="layui-btn layui-btn-sm layui-btn-danger" id="allStatusOrder_logisRule_replace_trackNum_changeBtn">
            更换跟踪号
            </span>
        </div>
        <%-- 展示表格 --%>
        <div>
            <table class="layui-table">
                <thead>
                    <tr>
                        <th>订单号</th>
                        <th>物流公司</th>
                        <th>物流方式</th>
                        <th>旧跟踪号</th>
                        <th>新跟踪号</th>
                    </tr>
                </thead>
                <tbody id="allStatusOrder_logisRule_replace_trackNum_layer_tbody">
                </tbody>
            </table>
        </div>
    </div>
</script>
<script type="text/html" id="allStatusOrder_logisRule_replace_trackNum_layer_tbodyTpl">
    {{#  layui.each(d, function(index, item){ }}
    <tr id="tr{{item.id}}">
        <td class="id">{{ item.id }}</td>
        <td>
            <div class="layui-form">
                <select name="logisCompany" lay-filter="trackNum_company{{item.id}}" disabled>
                    {{#  layui.each(item.companys, function(cIndex,cItem){ }}
                        {{# if(cItem.id == item.logisCompanyId){ }}
                        <option value="{{cItem.id}}" selected>{{cItem.cnName}}</option>
                        {{#  }else{ }}
                        <option value="{{cItem.id}}">{{cItem.cnName}}</option>
                        {{# } }}
                    {{#　})　}}
                </select>
            </div>
        </td>
        <td class="logisType">
            <div class="layui-form" lay-filter="trackNum_logisType{{item.id}}">
                <select name="logisType" id="trackNum_logisType{{item.id}}">
                    {{#  layui.each(item.logisticsModes, function(lIndex,lItem){ }}
                        {{# if(lItem.id == item.logisTypeId){ }}
                        <option value="{{lItem.id}}" selected>{{lItem.name}}</option>
                        {{#  }else{ }}
                        <option value="{{lItem.id}}">{{lItem.name}}</option>
                        {{# } }}
                    {{#　})　}}
                </select>
            </div>
        </td>
        <td>{{item.logisTrackingNo || ''}}</td>
        <td class="newLogisTrackingNo"></td>
    </tr>
    {{#　})　}}
</script>


<%-- 弹框--ebay取消订单原因展示 --%>
<script type="text/html" id="allStatusOrder_cancelEbayTpl">
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

<%-- 录入异常弹框 --%>
<script type="text/html" id="allStatusOrder_inputexceptLayer">
    <div class='mg_t'>
        <form class="layui-form mg" action="" id="issue_mofidy_form">
            <div class="layui-col-md12 layui-col-lg12">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label" style="display: none">数据来源</label>
                    <div class="layui-input-block" style="display: none">
                        <input name="dataSource" class="layui-input"  placeholder="必填">
                    </div>
                </div>

                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">问题类型</label>
                    <div class="layui-input-block">
                        <select name="issueType" lay-verify="required" id="layer_issue_select" >
                            
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">订单号</label>
                    <div class="layui-input-block">
                        <input name="allrootNid" class="layui-input" lay-verify="required" placeholder="必填">
                    </div>
                </div>
                <!-- <div class="layui-col-md4 layui-col-lg4">
                    <div style="min-height: 36px;"></div>
                </div> -->
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">店铺单号</label>
                    <div class="layui-input-block">
                        <input name="orderId" class="layui-input " lay-verify="required" >
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">平台</label>
                    <div class="layui-input-block">
                        <input name="platCode" class="layui-input " lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                        <input name="storeAcct" class="layui-input " lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">包装员</label>
                    <div class="layui-input-block">
                        <input name="packager" class="layui-input">
                    </div>
                </div>
                <!-- <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">异常sku</label>
                    <div class="layui-input-block">
                        <input name="issueSku" class="layui-input" placeholder="商品子sku,必填" lay-verify="required">
                    </div>
                </div> -->
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label"><font class="fRed">*</font>异常数量</label>
                    <div class="layui-input-block">
                        <input name="issueNum" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">异常重量(g)</label>
                    <div class="layui-input-block">
                        <input name="issueWeight" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">发货时间</label>
                    <div class="layui-input-block">
                        <input name="deliveryTime" class="layui-input" id="delivery_time_str" placeholder="请选择">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">实发sku</label>
                    <div class="layui-input-block">
                        <input name="deliverySku" class="layui-input">
                    </div>
                </div>
                <!-- <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">金额</label>
                    <div class="layui-input-block">
                        <div class="layui-col-md6 layui-col-lg6">
                            <select name="issueCurrency" id="allStatusOrder_issueCurrency">
                                
                            </select>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <input name="issueAmount" class="layui-input" placeholder="">
                        </div>
                    </div>
                </div> -->
            </div>
            <div style="padding: 10px;">
                <table id="allStatusOrder_inputexcept_table" lay-filter="allStatusOrder_inputexcept_table"></table>
            </div>
            <!-- </div> -->
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">问题描述</label>
                <div class="layui-input-block">
                    <textarea name="issueRemark" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12 mg_t">
                <label class="layui-form-label">
                  <div>图片URL</div>
                  <span class="layui-btn layui-btn-xs layui-btn-normal previewBtn">预览链接</span>
                </label>
                <div class="layui-input-block">
                    <textarea name="issueImgs" class="layui-textarea" placeholder="多个以换行分隔"></textarea>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12 mg_t">
              <label class="layui-form-label">图片预览</label>
              <div class="layui-input-block" style="margin-bottom:10px;">
                  <!-- 分成两部分: 一部分专门用来拖拽,拖拽完成以后把图片链接渲染到textarea中,一部分预览,每次点击预览,都会清空这两部分 -->
                  <ul class="commonPreviewImg" style="height:150px"></ul>
                  <div  class="layui-upload-drag"  id="issue_mofidy_dragImg">
                    <i class="layui-icon">&#xe67c;</i>
                    <p>点击上传，或将文件拖拽到此处</p>
                  </div>
              </div>
            </div>
        </form>
    </div>
</script>

<%-- 权限问题---录入异常 --%>
<script type="text/html" id="allStatusOrder_inputexceptPermTagTable">
    <permTag:perm funcCode="allStatusOrder_inputexceptPermTag">
    <button name="allOrder_inputexcept" class="layui-btn layui-btn-xs layui-btn-normal">录入异常</button><br>
    </permTag:perm>
</script>
<%-- 权限问题---订单API --%>
<script type="text/html" id="allStatusOrder_orderApiPermTagTable">
    <permTag:perm funcCode="allStatusOrder_orderApiPermTag">
    <button name="allOrder_orderApi" class="layui-btn layui-btn-xs">订单API</button><br>
    </permTag:perm>
</script>
<!-- 录入异常 radio -->
<script type="text/html" id="allStatusOrder_inputexcept_table_radio">
    <input type="radio" name="radio" value="{{d.id}}" title="">
</script>
<!-- 录入异常 商品SKU -->
<script type="text/html" id="allStatusOrder_inputexcept_table_prodSSku">
    <input type="hidden" name="pickUserName_prodSSku_{{d.id}}" value="{{d.pickUserName}}">
    <input type="hidden" name="checkUserName_prodSSku_{{d.id}}" value="{{d.checkUserName}}">
<%--    <input type="hidden" name="packager_prodSSku_{{d.id}}" value="{{d.packUser}}">--%>
    <input type="text" name="prodSSku_{{d.id}}" value="{{d.prodSSku}}" placeholder="请输入异常sku" autocomplete="off" class="layui-input">    
</script>
<%-- AE托管显示SKU标签 --%>
<script type="text/html" id="allStatusOrder_aeSkuTagDom">
  <button name="allStatusOrder_aeSkuTagBtn" class="layui-btn layui-btn-xs" type="button">AE商品标签</button>
</script>

<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/order/orderLog.js"></script>
<script src="${ctx}/static/js/order/allStatusOrder.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
<%--<script src="${ctx}/static/virtual-list/virtual-list.js"></script>--%>
