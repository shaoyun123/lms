<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>待派单/缺货订单</title>
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

                .externalContaintoDespatchOrder {
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
                #LAY-toDespatchOrder .layui-btn+.layui-btn{
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
                .waitOrderErrorTips{
                    position: absolute;
                    top: 2px;
                    left: -30px;
                    z-index: 2020;
                    border: 2px solid #EACCD1;
                    background-color: #f7f9fa;
                    padding: 5px;
                    border-radius: 3px;
                    min-width: 500px;
                    opacity: 0.8;
                }

                .waitOrderErrorTipsClose{
                    width: 20px;
                    height: 20px;
                    top:0;
                    background-color: #cccccc;
                    opacity: 0.5;
                    line-height: 20px;
                    color: #fff;
                    border-radius: 50%;
                    text-align: center;
                    position: absolute;
                    right: 0;
                    margin-left: 20px;
                    cursor: pointer;
                }

                .waitOrderErrorTipsword{
                    margin-right: 20px;
                    color:#008B8B;
                }

                .toDespatchOrder-noteContent-tag{
                    color:#008B8B;
                    border: 1px solid #008B8B;
                    background-color: #fff;
                }

                .toDespatchOrder_store_style .xm-select-dl{
                    width:-webkit-fill-available !important;
                }
            </style>
            <div class="layui-fluid" id="LAY-toDespatchOrder">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="toDespatchOrderForm" lay-filter="toDespatchOrderForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md4 layui-col-lg4">
                                            <label class="layui-form-label">订单时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" id="toDespatchOrder_time" name="time" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">平台</label>
                                            <div class="layui-input-block">
                                                <select name="platCode" lay-filter="toDespatchOrderplatCodes" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select name="orgs" lay-search class="orgs_hp_custom" lay-filter="toDespatchOrder_orgs">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label labelSel">
                                                <select lay-filter="toDespatchOrder_salerAndcustomSelectFilter" name="salerAndcustomSelect">
                                                    <option value="1">销售</option>
                                                    <option value="2">客服</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <select name="salePersonId" class="users_hp_custom" lay-filter="toDespatchOrder_salePersonsSelect" id="toDespatchOrder_salePersonsSelect" xm-select="toDespatchOrder_salePersonsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 toDespatchOrder_store_style">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select
                                                        class="users_hp_store_multi"
                                                        id="toDespatchOrder_store"
                                                        name="storeAcctIds"
                                                        xm-select="storeAcct"
                                                        xm-select-search
                                                        xm-select-search-type="dl"
                                                        xm-select-skin="normal"
                                                        lay-search>
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
                                                <select name="platOrderStatusList" id="todespatchorderplatOrderStatusList" xm-select="todespatchorderplatOrderStatusList" lay-filter="todespatchorderplatOrderStatusList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search="">
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
                                                <select name="platTags" xm-select="toDespatchOrder_platTags" id="toDespatchOrder_platTags" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label" style="padding:0px 0px 0px 5px">
                                                <select name="agentCompany" lay-filter="toDespatchOrdercompanyType">
                                                    <option value="logisticsModes">物流方式集</option>
                                                    <option value="companys">物流公司</option>
                                                    <option value="agents">货代公司</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <select type="text" name="logisticsCompanyId" lay-filter="toDespatchOrdercompany" lay-search></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">物流方式</label>
                                            <div class="layui-input-block">
                                                <select name="logisTypeIds" xm-select="logisTypeIds_xm_select_toDes" id="logisTypeIds_xm_select_toDes" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
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
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label labelSel">
                                                 <select name="orderLabels" xm-select="toDespatchOrder_orderLabels" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                </select>
                                            </label>
                                            <div class="layui-input-block">
                                                <input type="text" name="orderNote" class="layui-input" placeholder="备注内容" style="height:34px;">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">订单状态</label>
                                            <div class="layui-input-block">
                                                <select name="processStatus">
                                                    <option value="115">待派单</option>
                                                    <option value="502">缺货</option>
                                                    <option value="">全部</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                             <label class="layui-form-label">是否占用</label>
                                            <div class="layui-input-block">
                                                <select name="holdStock">
                                                    <option value="">请选择</option>
                                                    <option value="true">是</option>
                                                    <option value="false">否</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                             <label class="layui-form-label">申请失败原因</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="logisApplyFailMsg">
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
                                                    <option value="poli.close_time asc">跟踪号剩余天数正序</option>
                                                    <option value="poli.close_time desc">跟踪号剩余天数倒序</option>
                                                    <option value="o.profit/(o.plat_order_amt*o.exchange_rate) asc">利润率正序</option>
                                                    <option value="o.profit/(o.plat_order_amt*o.exchange_rate) desc">利润率倒序</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="externalContaintoDespatchOrder disN">
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
                                            <label class="layui-form-label" style="padding:0;">
                                                <div class="externalBox" id="showMoreSearchCondition_toDespatchOrder">
                                                    <span>更多<span class="hasValue"></span></span>
                                                    <span id="hide_icon_toDespatchOrder" class="fr mr10 hidden">︽</span>
                                                    <span id="show_icon_toDespatchOrder" class="fr mr10">︾</span>
                                                </div>
                                            </label>
                                            <div class="layui-input-block">
                                                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch" lay-submit="" id="toDespatchOrderSearch" lay-filter="toDespatchOrderSearch">查询</button>
                                                <!-- <span class="layui-btn layui-btn-sm layui-btn-primary" id="allStatusOrder_export001">导出</span>
                                                <span class="layui-btn layui-btn-sm" id="toDespatchOrderDetail_export">导出明细</span> -->
                                                <div id="toDespatchOrder_exportTemplate" style="display: inline-block;position: relative;"></div>
                                                <div id="toDespatchOrder_save" class="inline_block pora"></div>
                                            </div>
                                        </div>
                                       </div>
                                        <input class="hide" type="text" name="logisApplySearchStatus" value="0">
                                        <input class="hide" type="text" name="limit" value="5000">
                                        <input class="hide" type="text" name="page" value="1">
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card" id="toDespatchOrderCard">
                            <div class="layui-card-body">
                                <div class="dis_flex_space">
                                    <div>
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" name="orderConfig">保存设置</button>
                                    </div>
                                    <div>
                                        <!-- 导出功能 -->
                                        <div id="toDespatchOrder_exportDetail" class="layui-inline">
                                          <permTag:perm funcCode="platform_operation_toDespatchOrder_export">
                                          <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">导出</button>
                                          <ul class="hidden">
                                            <li data-detail="false">导出缺货SKU汇总</li>
                                            <li data-detail="true">导出缺货SKU明细</li>
                                          </ul>
                                        </permTag:perm>
                                      </div>
                                        <div id="toDespatchOrder_platOperate" class="layui-inline">
                                            <permTag:perm funcCode="platform_operation_toDespatchOrder_Order">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">平台操作</button>
                                                <ul class="hidden">
                                                    <li>
                                                        <div>后台取消</div>
                                                        <ul>
                                                            <li id="toDespatchOrder_cancelOrderEbay">ebay取消</li>
                                                            <permTag:perm funcCode="toDespatchOrder_wishBtnPermTag">
                                                                <li id="toDespatchOrder_wishRefund">wish退款</li>
                                                            </permTag:perm>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <div>其他操作</div>
                                                        <ul>
                                                            <li id="toDespatchOrder_syncOrderStatus">更新订单状态</li>
                                                            <li id="toDespatchOrder_markDelivery">标记平台发货</li>
                                                            <li id="toDespatchOrder_decryptAddress">解密地址</li>
                                                            <li id="toDespatchOrder_deliverDeclare">修改发货声明</li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <div>邮件</div>
                                                        <ul>
                                                            <li id="toDespatchOrder_amazonEmail">Amazon邮件</li>
                                                            <li id="toDespatchOrder_eBayEmail">eBay邮件</li>
                                                            <!--优选仓拒单按钮-->
                                                            <permTag:perm funcCode="toDespatchOrder_rejectOrderdabao_permTag">
                                                              <li id="toDespatchOrder_rejectOrderdabao">
                                                                优选仓拒单
                                                              </li>
                                                              </permTag:perm>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </permTag:perm>
                                        </div>
                                        <div id="toDespatchOrder_logis" class="layui-inline">
                                            <permTag:perm funcCode="toDespatchOrder_LogisBtnHandle_permTag">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">物流</button>
                                            <ul class="hidden">
                                                <li id="toDespatchOrder_matchLogis">匹配物流</li>
                                                <li id="toDespatchOrder_updatelogistype">手动指定物流</li>
                                                <li id="toDespatchOrder_applylogisno">申请跟踪号</li>
                                                <li id="toDespatchOrder_removelogisno">清空跟踪号</li>
                                                <li id="toDespatchOrder_cancelwishpost">取消wishpost跟踪号</li>
                                                <li id="toDespatchOrder_cancelEdisebay">取消橙联跟踪号</li>
                                                <li id="toDespatchOrder_getEdisebay" style="display: none">获取跟踪号</li>
                                                <li id="toDespatchOrder_editTrackingNo">修改跟踪号</li>
                                            </ul>
                                            </permTag:perm>
                                        </div>
                                        <div id="toDespatchOrder_dealOrder" class="layui-inline">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单处理</button>
                                            <ul class="hidden">
                                                <permTag:perm funcCode="toDespatchOrder_dispatch_permTag">
                                                <li id="toDespatchOrder_dispatch">派至仓库</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_toAudit_permTag">
                                                <li id="toDespatchOrder_toAudit">转待审核</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_markException_permTag">
                                                <li id="toDespatchOrder_markException" style="background: #FFB951;color: #fff;">标记异常</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_toCancel_permTag">
                                                <li id="toDespatchOrder_toCancel" style="background: #ff0000;color: #fff;">取消订单</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_toShipped_permTag">
                                                <li id="toDespatchOrder_toShipped">直接转已发货</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_batchEditReceiver_permTag">
                                                <li id="toDespatchOrder_batchEditReceiver">修改收件信息</li>
                                                </permTag:perm>
                                                <li id="toDespatchOrder_batchRemark">批量备注</li>
                                                <permTag:perm funcCode="toDespatchOrder_updateCostInfo_permTag">
                                                <li id="toDespatchOrder_updateCostInfo">更新商品信息</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_oneClickDelivery_permTag">
                                                <li id="toDespatchOrder_oneClickDelivery">一键派单</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_holdStockTask_permTag">
                                                <li id="toDespatchOrder_holdStockTask">全量库存占用</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_towaitToShip_permTag">
                                                <li id="toDespatchOrder_towaitToShip">转至待发货</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_toCheckList_permTag">
                                                <li id="toDespatchOrder_toCheckList">转待核单</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_replenishCheck_permTag">
                                                    <li id="toDespatchOrder_replenishCheck">补货检测</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="toDespatchOrder_toWarehouseIntercept_permTag">
                                                    <li id="toDespatchOrder_toWarehouseIntercept">转至仓库拦截单</li>
                                                </permTag:perm>
                                            </ul>
                                        </div>
                                        <button type="button" id="toDespatchOrder_printlogistpl" class="layui-btn layui-btn-normal layui-btn-sm">打印面单</button>
                                    </div>
                                </div>
                                <div class="layui-tab" lay-filter="toDespatchOrder_tab" id="toDespatchOrder_tab">
                                    <div class="">
                                        <div style="height:42px;">
                                            <ul class="layui-tab-title markSymbol" style="width: 80%;">
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="layui-tab-content">
                                        <%--<table lay-filter="toDespatchOrder_table" class="layui-table" id="toDespatchOrder_table"></table>--%>
                                        <div id="toDespatchOrder_table" style="width: 100%;height: 500px;" class="ag-theme-balham"></div>
                                        <div class="pageSortfix" id="toDespatchOrderPage"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 表格渲染模板 -->
            <script type="text/html" id="toDespatchOrder_id_tpl">
                <div class="alignLeft">
                <input type="hidden" class="toDespatchOrder_col_id" value="{{d.id}}">
                <div>
                <span class="pora copySpan">
                    <a class="toDespatchOrder_Id">{{d.id||""}}</a>
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

            <script type="text/html" id="toDespatchOrder_platOrderAmt_tpl">
                <div class="alignLeft">
                <div><span class='gray'>{{d.currency||""}}</span><span>{{d.platOrderAmt||""}}</span></div>
                <div><span class="gray">利润(RMB)</span><span>{{d.profit||'0.00'}}</span></div>
                <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
                {{# if(d.logisApplyStatus==4&&d.logisApplyFailMsg){ }}
                <div class="waitOrderErrorTips dis_flex"><div class="waitOrderErrorTipsword">{{d.logisApplyFailMsg}}</div><div class="waitOrderErrorTipsClose">x</div></div>
                {{# } }}
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_prodQuantity_tpl">
                <div class="alignLeft">
                    <div><span class="gray">种类：</span><span>{{d.kindNum||""}}</span></div>
                    <div><span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span></div>
                    <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_shippingUsername_tpl">
                <div class="alignLeft">
                    <div>{{d.shippingUsername||""}}</div>
                    <div>[{{d.shippingCountryCnName||""}}]</div>
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_logisTypeName_tpl">
                <div class="alignLeft">
                    <div><span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}<span></div>
                    <div><span class="gray">发货:</span><span id="logisTypeName_toDespatchOrder">[{{d.logisTypeName||""}}]</span><span id="logisTrackingNo_toDespatchOrder">[{{d.logisTrackingNo||""}}]</span></div>
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_time_tpl">
                <div class="alignLeft">
                    <div><span class="gray">订单:</span><span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})<span></div>
                    <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                    <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                </div>
            </script>

            <script type="text/html" id="todispatchr_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>


            <script type="text/html" id="toDespatchOrder_option_tpl">
                <div class="dis_flex_start">
                    <span class="layui-btn layui-btn-xs disN" lay-event="edit">修改订单</span><br>
                    <span class="layui-btn layui-btn-xs" lay-event="remark">备注</span>
                </div>
            </script>
            <script type="text/html" id="toDespatchOrder_cancelWishpostTpl">
                <form class="layui-form" action="" lay-filter="component-form-group" id="toDespatchOrder_cancelWishpostForm">
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
            <script type="text/html" id="toDespatchOrder_updateLogisTypeTpl">
                <form class="layui-form" action="" lay-filter="component-form-group" id="toDespatchOrder_updateLogisTypeForm">
                    <div class="p20">
                        <div class="layui-form-item">
                            <label class="layui-form-label">物流公司</label>
                            <div class="layui-input-block">
                                <select class="layui-select" lay-search name="logisCompany" lay-filter="toDespatchOrder_logisCompany">
                                    <option></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">物流方式</label>
                            <div class="layui-input-block">
                                <select class="layui-select" lay-search name="logisType">
                                    <option></option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </script>

            <!-- 商品详情 -->
            <script type="text/html" id="pop_todispathorder_detail">
                <div class="mg_50">
                    <table class="layui-table" id="todispathorder_detail_table" lay-filter="todispathorder_detail_table"></table>
                </div>
            </script>

            <!-- 修改/新增订单 -->
            <script type="text/html" id="pop_toDespatchOrder_newandeditorder">
                <div class="mg_50">
                    <div class="layui-tab" lay-filter="orderLog">
                        <ul class="layui-tab-title">
                          <li class="layui-this">详情</li>
                          <li>日志</li>
                        </ul>
                        <div class="layui-tab-content">
                          <div class="layui-tab-item layui-show">
                            <form class="layui-form" id="toDespatchOrder_editForm" lay-filter="toDespatchOrder_editForm">
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
                                            <select name="currency" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2 ">
                                        <label class="layui-form-label"><font class="fRed">*</font>订单金额</label>
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
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="toDespatchOrder_addProducts">添加商品</button>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-col-lg12 layui-col-md12 ">
                                        <table class="layui-table" id="toDespatchOrder_product_table" lay-filter="toDespatchOrder_product_table"></table>
                                    </div>
                                </div>
                                <button type="button" class="hide" id="order_savebtn">保存</button>
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
            <script type="text/html" id="toDespatchOrder_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="toDespatchOrder_edit_ListingID">
                <input type="text" class="layui-input" name="" value="{{d.itemId||''}}">
            </script>
            
            <script type="text/html" id="toDespatchOrder_edit_Prodsku">
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
            
            <script type="text/html" id="toDespatchOrder_edit_storeSSku">
                <input type="text" class="layui-input" name="" value="{{d.storeSSku||''}}">
            </script>
            
            <script type="text/html" id="toDespatchOrder_edit_platUnitPrice">
                <input type="number" class="layui-input" name="" value="{{d.platUnitPrice||0}}" placeholder="订单币种">
            </script>
            
            <script type="text/html" id="toDespatchOrder_edit_platQuantity">
                <input type="number" class="layui-input" name="" value="{{d.platQuantity||0}}">
            </script>
            <script type="text/html" id="toDespatchOrder_edit_prodQuantity">
                <input type="text" class="layui-input" name="" value="{{d.prodQuantity||0}}">
            </script>
            <script type="text/html" id="toDespatchOrder_edit_platOrderDetailAmt">
                <input type="number" class="layui-input" value="{{d.platOrderDetailAmt===undefined ? '' : d.platOrderDetailAmt}}" placeholder="销售金额"  min="0" step="1" onblur="commonFormatNonnegativeBlur(this)">
            </script>

            <%-- 弹框--ebay取消订单原因展示 --%>
            <script type="text/html" id="toDespatchOrder_cancelEbayTpl">
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
            <!-- 添加商品弹框 -->
            <script type="text/html" id="pop_toDespatchOrder_addProducts">
                <div class="mg_50">
                    <span class="numCount">数量<span></span></span>
                    <table class="layui-table" id="toDespatchOrder_addProducts_table" lay-filter="toDespatchOrder_addProducts_table"></table>
                </div>
            </script>
            <script type="text/html" id="toDespatchOrder_edit_option">
                <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="edit_prod_delete">删除</button>
            </script>
            <script type="text/html" id="toDespatchOrder_add_product_prodQuantity">
                <input type="number" class="layui-input" name="prodQuantity" value="0">
            </script>
            <script type="text/html" id="toDespatchOrder_add_product_platOrderDetailAmt">
                <input type="number" class="layui-input" name="platOrderDetailAmt" value="">
            </script>

<script type="text/html" id="toDespatchOrderReceiveLayer">
    <div style="padding:0 10px;">
        <table class="layui-table">
            <tbody id="toDespatchOrderReceiveLayerTbody">

            </tbody>
        </table>
        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="decryptAddress">解密地址</button>
    </div>
</script>
<script type="text/html" id="toDespatchOrderReceiveLayerTbodyTpl">
    <tr>
        <td>收件人</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingUsername || ''}}" name="shippingUsername">
        </td>
    </tr>
    <tr>
        <td>州/省</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingState || ''}}" name="shippingState">
        </td>
    </tr>
    <tr>
        <td>城市</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingCity || ''}}" name="shippingCity">
        </td>
    </tr>
    <tr>
        <td>邮编</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingZip || ''}}" name="shippingZip">
        </td>
    </tr>
    <tr>
        <td>地址1</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingStreet1 || ''}}" name="shippingStreet1">
        </td>
    </tr>
    <tr>
        <td>地址2</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingStreet2 || ''}}" name="shippingStreet2">
        </td>
    </tr>
    <tr>
        <td>电话</td>
        <td>
          <input type="text" class="layui-input" value="{{ d.shippingPhoneNumber || ''}}" name="shippingPhoneNumber">
        </td>
    </tr>
</script>


<%-- 批量修改收件信息 --%>
<script type="text/html" id="toDespatchOrder_batchEditReceiverLayer">
    <div id="toDespatchOrderBatchEditReceiverContainer" style="padding:10px;" lay-filter="toDespatchOrderBatchEditReceiverContainer" class="layui-form"></div>
</script>
<script type="text/html" id="toDespatchOrderBatchEditReceiverContainerTpl">
    <table class="layui-table">
        <thead>
            <tr>
                <th>
                    <div class="layui-form">
                        <input type="checkbox" name="allCheck"  lay-skin="primary" class="receiverAllCheck" lay-filter="receiverAllCheckFilter">
                    </div>
                </th>
                <th>订单号</th>
                <th>收件人<input class="layui-input Username" style="width:100px" placeholder="回车批量"></th>
                <th>州/省<input class="layui-input State" style="width:100px" placeholder="回车批量"></th>
                <th>城市<input class="layui-input City" style="width:100px" placeholder="回车批量"></th>
                <th>邮编<input class="layui-input Zip" style="width:100px" placeholder="回车批量"></th>
                <th>地址1<input class="layui-input Street1" style="width:100px" placeholder="回车批量"></th>
                <th>地址2<input class="layui-input Street2" style="width:100px" placeholder="回车批量"></th>
                <th>电话<input class="layui-input PhoneNumber" style="width:100px" placeholder="回车批量"></th>
            </tr>
        </thead>
        <tbody>
            {{#  layui.each(d, function(index, item){ }}
            <tr>
                <td>
                    <div class="layui-form">
                        <input type="checkbox" lay-skin="primary" class="receiverCheck" name="checkbox1">
                    </div>
                </td>
                <td class="id">{{item.id}}</td>
                <td class="shippingUsername">
                    <input type="text" class="layui-input" value="{{ item.shippingUsername || ''}}" name="shippingUsername">
                </td>
                <td class="shippingState">
                    <input type="text" class="layui-input" value="{{ item.shippingState || ''}}" name="shippingState">
                </td>
                <td class="shippingCity">
                  <input type="text" class="layui-input" value="{{ item.shippingCity || ''}}" name="shippingCity">
                </td>
                <td class="shippingZip">
                   <input type="text" class="layui-input" value="{{ item.shippingZip || ''}}" name="shippingZip">
                </td>
                <td class="shippingStreet1">
                    <input type="text" class="layui-input" value="{{ item.shippingStreet1 || ''}}" name="shippingStreet1">
                </td>
                <td class="shippingStreet2">
                    <input type="text" class="layui-input" value="{{ item.shippingStreet2 || ''}}" name="shippingStreet2">
                </td>
                <td class="shippingPhoneNumber">
                    <input type="text" class="layui-input" value="{{ item.shippingPhoneNumber || ''}}" name="shippingPhoneNumber">
                </td>
            </tr>
            {{# }) }}
        </tbody>
    </table>
</script>


<script type="text/html" id="pop_toDespatchOrder_demolition_original">
    <div class="mg_50">
        <div>
          <strong><font color="red" size="4">多个一买和组合品,所拆出的部分商品会影响线上发货,请谨慎拆分!</font></strong>
        </div>
        <div class="layui-form fixRight">
            <input type="radio" name="toDespatchOrder_demo_original_abnormal" title="拆出订单转至取消订单" lay-skin="primary" id="toDespatchOrder_demo_original_abnormal">
            <input type="radio" name="toDespatchOrder_demo_original_abnormal" title="拆出订单转至其它异常订单" lay-skin="primary" id="toDespatchOrder_demolition_original_abnormal">
        </div>
        <table class="layui-table" id="toDespatchOrder_demolition_original_table" lay-filter="toDespatchOrder_demolition_original_table"></table>
    </div>
</script>

<script type="text/html" id="toDespatchOrder_orginal_order_products">
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

<%--<script type="text/html" id="toDespatchOrder_orginal_order_availableStock">--%>
<%--    <div>--%>
<%--        {{# if(d.allCount > d.availableStock){ }}--%>
<%--        <div style="font-weight:700;font-size:24px;color:#f00;">{{d.availableStock}}</div>--%>
<%--        {{# }else{ }}--%>
<%--        <span>{{d.availableStock}}</span>--%>
<%--        {{# } }}--%>
<%--    </div>--%>
<%--</script>--%>
<%--<script type="text/html" id="toDespatchOrder_orginal_order_allCount">--%>
<%--   {{# if(d.allCount > d.availableStock){ }}--%>
<%--   <span style="font-weight:700;font-size:24px;color:#f00;">{{d.allCount || d.prodQuantity}}</span>--%>
<%--   {{# }else{ }}--%>
<%--   <span>{{d.allCount || d.prodQuantity}}</span>--%>
<%--   {{# } }}--%>
<%--</script>--%>
<%--<script type="text/html" id="toDespatchOrder_orginal_order_prodQuantity">--%>
<%--    <div>--%>
<%--    {{# if(d.allCount > d.availableStock){ }}--%>
<%--    <div style="font-weight:700;font-size:24px;color:#f00;">{{d.prodQuantity || ''}}</div>--%>
<%--    {{# }else{ }}--%>
<%--    <span>{{d.prodQuantity || ''}}</span>--%>
<%--    {{# } }}--%>
<%--    </div>--%>
<%--</script>--%>

<script type="text/html" id="toDespatchOrder_orginal_order_demolition">{{ d.prodQuantity * d.prodUnitWeight }}</script>

<script type="text/html" id="toDespatchOrder_orginal_order_number">
    <input type="text" class="layui-input" name="demolitionQuality" onchange="commonSetInputMaxMinVal(this,{{d.prodQuantity}},1)">
</script>

<script type="text/html" id="toDespatchOrder_orginal_order_dynamicWeight"></script>
<script type="text/html" id="toDespatchOrder_orginal_order_dynamicMoney"></script>

<%-- 修改跟踪号 --%>
<script type="text/html" id="toDespatchOrder_editTrackingNoLayer">
    <form class="layui-form p20" id="toDespatchOrder_editTrackingNoForm"></form>
</script>
<script type="text/html" id="toDespatchOrder_editTrackingNoFormTpl">
    <div class="layui-form-item">
        <label class="layui-form-label">物流方式</label>
        <div class="layui-input-block">
            <input type="text" class="layui-input" name="logisTypeName" disabled value="{{d.logisTypeName || ''}}">
            <input type="hidden" name="id" value="{{d.id}}">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">跟踪号</label>
        <div class="layui-input-block">
            <input type="text" class="layui-input" name="logisTrackingNo" value="{{d.logisTrackingNo || ''}}">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">内部单号(包裹号)</label>
        <div class="layui-input-block">
            <input type="text" class="layui-input" name="logisAgentTrackingNo" value="{{d.logisAgentTrackingNo || ''}}">
        </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">&nbsp;</label>
      <div class="layui-input-block">虾皮店铺后台拆单订单,需填写跟踪号和内部单号,内部单号获取方法: 
        <a href="/lms/static/templet/虾皮真实拆单订单如何填入跟踪号和包裹号.docx" download="虾皮真实拆单订单如何填入跟踪号和包裹号" target="_blank" style="color: #0075ff;">
        <b>【下载】</b>
      </a> 
    </div>
    </div>
</script>
<%-- 权限问题---wish退款 --%>
<script type="text/html" id="toDespatchOrder_btnPermTag_wish">
    <permTag:perm funcCode="toDespatchOrder_wishBtnPermTag">
        <button name="toDespatchOrder_wishBtn" class="layui-btn layui-btn-xs">wish退款</button>
    </permTag:perm>
</script>
<%-- 权限问题---修改订单 --%>
<script type="text/html" id="toDespatchOrder_updatePermTagTable">
    <permTag:perm funcCode="toDespatchOrder_updatePermTag">
    <button name="toDespatchOrder_update" class="layui-btn layui-btn-xs">修改订单</button>
    </permTag:perm>
</script>
<%-- 权限问题---拆分订单 --%>
<script type="text/html" id="toDespatchOrder_splitPermTagTable">
    <permTag:perm funcCode="toDespatchOrder_splitPermTag">
    <button name="toDespatchOrder_demolition" class="layui-btn layui-btn-xs">拆分订单</button>
    </permTag:perm>
</script>

<!-- 商品价格 -->
<script type="text/html" id="toDespatchOrder_edit_platOrderProdPrice">
  <div style="text-align:left;">
    <div title="平均库存成本|商品成本">
      成本(¥):{{d.prodUnitCost || ''}}|{{d.detailCostPrice || ''}}
    </div>
    <div>净重(g):{{d.prodUnitWeight || ''}}</div>
  </div>
</script>
<!-- 商品信息 -->
<script type="text/html" id="toDespatchOrder_edit_platOrderProdInfo">
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
<script type="text/html" id="toDespatchOrder_edit_platOrderOrderInfo">
  <div style="text-align:left;">
    <div>报关信息:{{d.customsEnName || ''}}</div>
    <div>订单状态:{{d.platOrderDetailStatus || ''}}</div>
  </div>
</script>

<!-- 成本占比 -->
<script type="text/html" id="toDespatchOrder_costRatio">
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
<script type="text/javascript" src="${ctx}/static/js/order/toDespatchOrder.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>