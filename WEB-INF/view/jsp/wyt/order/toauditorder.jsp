<!-- 海外仓待审核订单页面 -->
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>待审核订单(海外仓)</title>
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
                    word-break: break-all;
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
                
                .externalContainAuditorderWinit {
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
                #LAY-toAuditOrderWinit .layui-btn+.layui-btn{
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

                .bage{
                    font-size: 14px;
                    color: #fff;
                    padding: 3px;
                    border-radius: 5px;
                }

                .red{
                    background-color: rgb(250, 13, 24);
                }

                .pointer{
                    cursor: pointer;
                }

                .eclipsedis{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            </style>
            <div class="layui-fluid" id="LAY-toAuditOrderWinit">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="toAuditorderWinitForm" lay-filter="toAuditorderForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md4 layui-col-lg4">
                                            <label class="layui-form-label">订单时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" id="toAuditorderWinit_time" name="time" lay-verify="required" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">平台</label>
                                            <div class="layui-input-block">
                                                <select name="platCode" lay-filter="toauditwinitplatCodes" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg4 layui-col-md4">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select name="storeAcctIds" xm-select="storeAcct" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">订单标签</label>
                                            <div class="layui-input-block">
                                                <select name="orderLabels" xm-select="orderLabels" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
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
                                                    <option value="prodSSkus">注册SKU(模糊)</option>
                                                    <option value="storeSSkus">店铺SKU(模糊)</option>
                                                    <option selected value="exactProdSSkus">注册SKU(精确)</option>
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
                                                <select name="shippingCountryCodes" xm-select="winittoallditshippingCountrys" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
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
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">平台标记</label>
                                            <div class="layui-input-block">
                                                <select name="platTags" xm-select="toauditorderWinit_platTags" id="toauditorderWinit_platTags" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label" style="padding:0px 0px 0px 5px">
                                                <select name="" lay-filter="toauditwinitcompanyType">
                                                    <option value="companys">物流公司</option>
                                                    <option value="agents">货代公司</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <select type="text" name="company" lay-filter="toauditwinitcompany" lay-search></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">物流方式</label>
                                            <div class="layui-input-block">
                                                <select 
                                                    name="logisTypeIds"
                                                    id="toauditorder_logisTypeIds"
                                                    xm-select="toauditorder_logisTypeIds" 
                                                    xm-select-search 
                                                    xm-select-search-type="dl" 
                                                    xm-select-skin="normal"
                                                    lay-filter="toauditorder_logisTypeIds"
                                                >
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
                                            <label class="layui-form-label">排序方式</label>
                                            <div class="layui-input-block">
                                                <select name="orderStr" lay-search>
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
                                            <div class="externalBox" id="toAuditWinitOrder_showMoreSearchCondition">
                                                <span>更多查询条件<span class="hasValue"></span></span>
                                                <span id="hide_icon_toauditorderWinit" class="fr mr10 hidden">︽</span>
                                                <span id="show_icon_toauditorderWinit" class="fr mr10">︾</span>
                                            </div>
                                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit="" id="toAuditWinitOrderSearch" lay-filter="toAuditWinitOrderSearch">查询</button>
                                        </div>


                                        <div class="externalContainAuditorderWinit disN">
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
                                                        <label class="layui-form-label">州</label>
                                                        <div class="layui-input-block">
                                                            <input type="text" class="layui-input" name="shippingState">
                                                        </div>
                                                    </div>
                                                    <div class="layui-col-md5 layui-col-lg5">
                                                        <label class="layui-form-label">城市</label>
                                                        <div class="layui-input-block">
                                                            <input type="text" class="layui-input" name="shippingCity">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item">
                                                    <div class="layui-col-md5 layui-col-lg5">
                                                        <label class="layui-form-label">邮编</label>
                                                        <div class="layui-input-block">
                                                            <input type="text" class="layui-input" name="shippingZip">
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
                                            </div>
                                        </div>
                                        <div class="layui-col-md4 layui-col-lg4" id="toAuditWinitOrder_storeSalesPersonDiv">
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <label class="layui-form-label">店铺销售部门</label>
                                                <div class="layui-input-block">
                                                    <select name="salesPersonOrgId" lay-filter="toAuditWinitOrder_orgFilter" class="orgs_hp_custom">
                                                        <option value=""></option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <label class="layui-form-label">店铺销售</label>
                                                <div class="layui-input-block">
                                                    <select name="salesPersonId"  class="users_hp_custom" data-rolelist="ebay专员,wish专员,amazon专员,lazada专员,shopee专员" lay-filter="toAuditWinitOrder_sellerFilter" lay-search="">
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-col-md4 layui-col-lg4" id="toAuditWinitOrder_winitSalesPersonDiv">
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <label class="layui-form-label">海外仓销售部门</label>
                                                <div class="layui-input-block">
                                                    <select name="winitSalesPersonOrgId" lay-filter="toAuditWinitOrder_winitOrgFilter" class="orgs_hp_custom">
                                                        <option value=""></option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="layui-col-md6 layui-col-lg6">
                                                <label class="layui-form-label">海外仓销售</label>
                                                <div class="layui-input-block">
                                                    <select name="winitSalesPersonId"  class="users_hp_custom" data-rolelist="万邑通专员" lay-filter="toAuditWinitOrder_winitSellerFilter" lay-search="">
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <input class="hide" type="text" name="unAuditOrderStatus" value="1">
                                        <input class="hide" type="text" name="limit" value="100">
                                        <input class="hide" type="text" name="page" value="1">
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="dis_flex_space">
                                    <div>
                                    </div>
                                    <div>
                                        <!--下拉按钮-->
                                        <permTag:perm funcCode="toAuditOrderWinit_platOper">
                                        <div id="toAuditOrderWinit_platOper" class="layui-inline">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">平台操作</button>
                                            <ul class="hidden">
                                                <li>
                                                    <div>后台取消</div>
                                                    <ul>
                                                        <permTag:perm funcCode="toAuditOrderWinit_cancelOrderEbay"><li id="toAuditOrderWinit_cancelOrderEbay">ebay取消</li></permTag:perm>
                                                        <permTag:lacksPerm funcCode="toAuditOrderWinit_cancelOrderEbay"><li class="disabledLi" disabled>ebay取消</li></permTag:lacksPerm>
                                                    </ul>
                                                </li>
                                                <li>
                                                    <div>其他操作</div>
                                                    <ul>
                                                        <permTag:perm funcCode="toAuditOrderWinit_syncOrderStatus"><li id="toAuditOrderWinit_syncOrderStatus">更新订单状态</li></permTag:perm>
                                                        <permTag:lacksPerm funcCode="toAuditOrderWinit_syncOrderStatus"><li class="disabledLi" disabled>更新订单状态</li></permTag:lacksPerm>
                                                        <permTag:perm funcCode="toAuditOrderWinit_markDelivery"><li id="toAuditOrderWinit_markDelivery">标记平台发货</li></permTag:perm>
                                                        <permTag:lacksPerm funcCode="toAuditOrderWinit_markDelivery"><li class="disabledLi" disabled>标记平台发货</li></permTag:lacksPerm>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                        </permTag:perm>

                                        <permTag:perm funcCode="toAuditOrderWinit_dealOrder">
                                        <div id="toAuditOrderWinit_dealOrder" class="layui-inline">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单处理</button>
                                            <ul class="hidden">
                                                <permTag:perm funcCode="toAuditOrderWinit_reMatchWarehouseType"><li id="toAuditOrderWinit_reMatchWarehouseType">匹配分仓</li></permTag:perm>
                                                <permTag:lacksPerm funcCode="toAuditOrderWinit_reMatchWarehouseType"><li class="disabledLi" disabled>匹配分仓</li></permTag:lacksPerm>
                                                <permTag:perm funcCode="toAuditOrderWinit_appointWarehouseType"><li id="toAuditOrderWinit_appointWarehouseType">指定仓库类型</li></permTag:perm>
                                                <permTag:lacksPerm funcCode="toAuditOrderWinit_appointWarehouseType"><li class="disabledLi" disabled>指定仓库类型</li></permTag:lacksPerm>
                                                <permTag:perm funcCode="toAuditOrderWinit_matchLogis"><li id="toAuditOrderWinit_matchLogis">匹配物流规则</li></permTag:perm>
                                                <permTag:lacksPerm funcCode="toAuditOrderWinit_matchLogis"><li class="disabledLi" disabled>匹配物流规则</li></permTag:lacksPerm>
                                                <permTag:perm funcCode="toAuditOrderWinit_markException"><li id="toAuditOrderWinit_markException">标记异常</li></permTag:perm>
                                                <permTag:lacksPerm funcCode="toAuditOrderWinit_markException"><li class="disabledLi" disabled>标记异常</li></permTag:lacksPerm>
                                                <permTag:perm funcCode="toAuditOrderWinit_toCancel"><li id="toAuditOrderWinit_toCancel">取消订单</li></permTag:perm>
                                                <permTag:lacksPerm funcCode="toAuditOrderWinit_toCancel"><li class="disabledLi" disabled>取消订单</li></permTag:lacksPerm>

                                                <%--<li id="toAuditOrderWinit_auditOrder">审核</li>--%>
                                                <li id="toAuditOrderWinit_toShipped">直接转已发货</li>
                                            </ul>
                                        </div>
                                        </permTag:perm>
                                        <permTag:perm funcCode="toAuditOrderWinit_auditOrder">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="toAuditOrderWinit_auditOrder">审核</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="toAuditOrderWinit_holdStockTask">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="toAuditOrderWinit_holdStockTask">库存占用规则</button>
                                        </permTag:perm>
                                    </div>
                                </div>
                                <div class="layui-tab" lay-filter="toAuditorderWinit_Tab" id="toAuditorderWinit_Tab">
                                    <div class="">
                                        <div style="height:42px;">
                                            <ul class="layui-tab-title" style="width: 80%;">
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="layui-tab-content">
                                        <table lay-filter="toAuditorderWinit_table" class="layui-table" id="toAuditorderWinit_table"></table>
                                        <div class="pageSortfix" id="toAuditorderWinitPage"></div>
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

            <script type="text/html" id="toAuditorderWinit_id_tpl">
                <input type="hidden" class="toAuditorderWinit_col_id" value="{{d.id}}">
                <div>
                    <span>{{d.id||""}}</span>
                    <span onclick="layui.admin.onlyCopyTxt('{{d.id}}',event)" style="display: {{d.id ? 'inline-block':'none'}}" class="copy-icon">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                    </span>
                    <span class="gray">[{{d.storeAcct||""}}][{{d.allrootAliasName||""}}]</span>
                    {{# if(d.operOrderType=="1"){ }}
                    <span class="hp-badge layui-bg-orange fr" title="拆出订单">拆</span> {{# }else if(d.operOrderType=="2"){ }}
                    <span class="hp-badge layui-bg-orange fr" title="合并订单">合</span> {{# }}}
                </div>
                <div>
                    <span>{{d.platOrderId}}</span>
                    <span onclick="layui.admin.onlyCopyTxt('{{d.platOrderId}}',event)" style="display: {{d.platOrderId ? 'inline-block':'none'}}" class="copy-icon">
                        <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                    </span>
                    {{# if(d.platStoreOrderId){ }}
                    ({{d.platStoreOrderId}}){{# }}}
                </div>
                <div><span class="gray">仓库:</span><span>{{d.warehouseName||'未分配'}}</span></div>
                <div><span class="gray">销售:</span><span>{{d.salesPersons||''}}</span></div>
                <div><span class="gray">海外仓销售:</span><span>{{d.winitSalesPersons||''}}</span></div>
            </script>

            <script type="text/html" id="toAuditorderWinit_remark_tpl">
                <div class="text_l"><span class="gray">标签：</span><span> {{d.orderLabel||""}}</span></div>
                <div class="text_l"><span class="gray">备注:</span><span>{{d.orderNote||""}}</span></div>
                <div class="text_l"><span class="gray">平台:</span>
                {{# if(d.platTagList && d.platTagList.length > 0){ }}
                    {{# layui.each(d.platTagList,function(inedx,item){ }}
                    <span style="background:{{item.color}};color:#fff;margin: 0 5px;padding:5px;">{{item.tagName}}</span>         
                    {{#  }) }}
                {{# } }}
                </div>
            </script>

            <script type="text/html" id="toAuditorderWinit_platOrderAmt_tpl">
                <div class="text_l"><span class='gray'>{{d.currency||""}}</span><span> {{d.platOrderAmt||""}}</span></div>
                <div class="text_l"><span class="gray">利润(RMB)</span><span> {{d.profit||'0.00'}}</span></div>
                <div class="text_l"><span class="gray">成本:</span><span>{{d.prodCost}}</span></div>
                <div class="text_l"><span class="gray">运费:</span><span>{{d.shippingCost}}</span></div>
                <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
            </script>

            <script type="text/html" id="toAuditorderWinit_prodQuantity_tpl">
                <div class="text_l"><span class="gray">ItemId:</span><span>{{d.itemIds.join(';')}}</span></div>
                <div class="text_l eclipsedis"><span class="gray">店铺sku:</span><span class="suspension pointer" data-color="6EB714" data-note="{{d.storeskuview.join(';')}}">{{d.storeskuview.join(';')}}</span></div>
                <div class="text_l eclipsedis"><span class="gray">注册sku:</span><span class="suspension pointer" data-color="6EB714" data-note="{{d.skuOverview}}">{{#  if(d.isMatchSku){ }}{{d.skuOverview}}{{#  } else { }}SKU异常{{#  } }} </span></div>
                <div class="text_l"><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
            </script>

            <script type="text/html" id="toAuditorderWinit_shippingUsername_tpl">
                <div><span>{{d.shippingUsername||""}}</span><span>[{{d.shippingCountryCnName||""}}]</span></div>
                <div>{{d.shippingState||""}},{{d.shippingCity||""}},{{d.shippingStreet1||""}},{{d.shippingStreet2||""}},{{d.shippingZip||""}},{{d.shippingPhoneNumber||""}}</div>
            </script>

            <script type="text/html" id="toAuditorderWinit_logisTypeName_tpl">
                <div class="text_l"><span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}<span></div>
                <div class="text_l"><span class="gray">发货:</span><span>[{{d.logisTypeName||""}}]</span><span>[{{d.logisTrackingNo||""}}]</span></div>
            </script>

            <script type="text/html" id="toAuditorderWinit_time_tpl">
                <div class="text_l"><span class="gray">订单:</span><span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})</span></div>
                <div class="text_l"><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                <div class="text_l"><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                <div class="text_l"><span class="gray">标记:</span><span>{{Format(d.markShippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
            </script>


            <script type="text/html" id="toAuditorderWinit_option_tpl">
                <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditorderWinit_modify">修改订单</button>
                <br/>
                <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditorderWinit_demolition">拆分订单</button>
                <br/>
                <permTag:perm funcCode="orderWinit_sendEmail">
                <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditorderWinit_sendEmail">发送邮件</button>
                <br/>
                </permTag:perm>
                <permTag:perm funcCode="toAuditorderWinit_issueRefund">
                <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditorderWinit_issueRefund">eBay退款</button>
                <br/>
                </permTag:perm>
                <button class="layui-btn layui-btn-xs mtb" lay-event="toAuditorderWinit_remark">订单备注</button>
                <br/>
            </script>

            <script type="text/html" id="toAuditorderWinit_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
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

            <script type="text/html" id="toAuditorderWinit_platOrderStatus_tpl">
                <!-- {{d.buyerNote||""}} -->
                {{# if(d.buyerNote){ }}
                <div><span class="bage red suspension pointer" data-color="FA0D18" data-note="{{d.buyerNote||''}}">言</span></div>
                {{# } }}
                <!-- <div><span class="gray">标记发货：{{d.markShippingStatus || '' }} -->
                <div class="text_l"><span class="gray">标记发货：{{#  if(d.markShippingStatus == 0){ }}
                    未标记
                {{#  } else if(d.markShippingStatus == 1) { }}
                    已标记
                {{#  } else if(d.markShippingStatus == 2) { }}
                    标记失败
                {{#  } }}   </span></div>
                <!-- <div><span class="gray">订单标签：</span></div> -->
                <div class="text_l"><span class="gray">订单状态：{{d.platOrderStatus||""}}</span></div>
                <div class="text_l"><span class="gray">海外仓状态：{{d.winitStatus||""}}</span></div>
                <!-- <div><span class="gray">打印面单状态：</span></div> -->
            </script>

            <script type="text/html" id="orginal_order_demolition">
                <input type="checkbox" class="layui-input" lay-filter="isDemolition" name="isDemolition" lay-skin="primary">
            </script>

            <script type="text/html" id="orginal_order_number">
                <input type="number" class="layui-input" name="demolitionQuality">
            </script>

            <script type="text/html" id="toAuditorderWinit_edit_ListingID">
                <input type="text" class="layui-input" name="" value="{{d.itemId||''}}">
            </script>

            <script type="text/html" id="toAuditorderWinit_edit_Prodsku"> 
                <div class="dis_flex">
            <input type="text" class="layui-input" name="" value="{{d.prodSSku}}">
            <i class="layui-icon refresh_icon">&#xe669;</i>
                </div>
            </script>

            <script type="text/html" id="toAuditorderWinit_edit_storeSSku">
                <input type="text" class="layui-input" name="" value="{{d.storeSSku||''}}">
            </script>

            <script type="text/html" id="toAuditorderWinit_edit_platUnitPrice">
                <div class="dis_flex_space">
                <input type="number" class="layui-input" name="" value="{{d.platUnitPrice||0}}" placeholder="订单币种">
                <span>{{d.currency}}</span>
            </div>
            </script>

            <script type="text/html" id="toAuditorderWinit_edit_platQuantity">
                <input type="number" class="layui-input" name="" value="{{d.platQuantity||0}}">
            </script>
            <script type="text/html" id="toAuditorderWinit_edit_prodQuantity">
                <input type="number" class="layui-input" name="" value="{{d.prodQuantity||0}}">
            </script>

            <script type="text/html" id="toAuditorderWinit_edit_platOrderDetailAmt">
                <div class="dis_flex_space">
                <input type="number" class="layui-input" value="{{d.platOrderDetailAmt||0}}" placeholder="订单币种">
                <span>{{d.currency}}</span>
                </div>
            </script>

            <script type="text/html" id="toAuditorderWinit_edit_option">
                <!-- <button class="layui-btn layui-btn-xs" lay-event="toAuditorderWinit_modify">修改订单</button> -->
                <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="edit_prod_delete">删除</button>
            </script>

            <!-- 表格渲染模板 -->

            <!-- 操作弹框 -->
            <!-- 添加备注 -->
            <script type="text/html" id="pop_toAuditorderWinit_remark">
                <div class="layui-tab" id="toauditOrderwinitremarkTab">
                    <ul class="layui-tab-title">
                      <li class="layui-this" data-index="1">备注</li>
                      <li data-index="2">标签</li>
                    </ul>
                    <div class="layui-tab-content">
                      <div class="layui-tab-item layui-show">
                        <form class="layui-form mg_50" lay-filter="toauditOrderwinitremarkForm" id="toauditOrderwinitremarkForm">
                            <div class="layui-form-item">
                                <label class="layui-form-label">类型</label>
                                <div class="layui-input-block">
                                    <select name="notetype" lay-filter="notetype" lay-verify="required">
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
                            <button type="button" id="toAuditorderWinit_remark_submit" class="hidden" lay-submit lay-filter="toAuditorderWinit_remark_submit"></button>
                        </form>
                      </div>
                      <div class="layui-tab-item">
                        <form class="layui-form mg_50" lay-filter="toauditOrderwinitlabelForm" id="toauditOrderwinitlabelForm">
                            <div class="layui-form-item">
                                <label class="layui-form-label">订单标签</label>
                                <div class="layui-input-block">
                                    <select name="noteContent" lay-search>
                                    </select>
                                </div>
                            </div>
                            <button type="button" id="toAuditorderWinit_label_submit" class="hidden" lay-submit lay-filter="toAuditorderWinit_label_submit"></button>
                        </form>
                      </div>
                    </div>
                  </div>
            </script>

            <!-- 商品详情 -->
            <script type="text/html" id="pop_toAuditorderWinit_detail">
                <div class="mg_50">
                    <table class="layui-table" id="toAuditorderWinit_detail_table" lay-filter="toAuditorderWinit_detail_table"></table>
                </div>
            </script>
            <!-- 原始订单拆单 -->
            <script type="text/html" id="pop_toAuditorderWinit_demolition_original">
                <div class="mg_50">
                    <table class="layui-table" id="toAuditorderWinit_demolition_original_table" lay-filter="toAuditorderWinit_demolition_original_table"></table>
                </div>
            </script>

            <!-- 修改/新增订单 -->
            <script type="text/html" id="pop_toAuditorderWinit_newandeditorder">
                <div class="mg_50">
                    <div class="layui-tab" lay-filter="orderLog">
                        <ul class="layui-tab-title">
                          <li class="layui-this">详情</li>
                          <li>日志</li>
                        </ul>
                    <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show">
                    <form class="layui-form" id="toAuditorderWinit_editForm" lay-filter="toAuditorderWinit_editForm">
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
                                    <select name="platCode" lay-filter="toauditwinitedit_platCode" lay-verify="required" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label"><font class="fRed">*</font>店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" lay-filter="toauditwinitedit_storeAcct" lay-verify="required" lay-search>
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
                                <label class="layui-form-label"><font class="fRed">*</font>币种</label>
                                <div class="layui-input-block">
                                    <select name="currency" lay-search lay-verify="required">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 ">
                                <label class="layui-form-label"><font class="fRed">*</font>订单金额</label>
                                <div class="layui-input-block">
                                    <input name="platOrderAmt" type="text" class="layui-input" lay-verify="required">
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
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4 dis_flex">
                                <input type="text" class="layui-input">
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="toAuditorderWinit_addProducts">添加商品</button>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg12 layui-col-md12 ">
                                <table class="layui-table" id="toAuditorderWinit_product_table" lay-filter="toAuditorderWinit_product_table"></table>
                            </div>
                        </div>
                        <permTag:perm funcCode="toauditorderwinit:save">
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
            <script type="text/html" id="pop_toAuditorderWinit_addProducts">
                <div class="mg_50">
                    <span class="numCount">数量<span></span></span>
                    <table class="layui-table" id="toAuditorderWinit_addProducts_table" lay-filter="toAuditorderWinit_addProducts_table"></table>
                </div>
            </script>
            <script type="text/html" id="toAuditorderWinit_cancelEbayTpl">
                <form class="layui-form" action="" lay-filter="component-form-group" id="toAuditorderWinit_cancelEbayForm">
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
            <script type="text/html" id="toAuditorderWinit_cancelWishpostTpl">
                <form class="layui-form" action="" lay-filter="component-form-group" id="toAuditorderWinit_cancelWishpostForm">
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
            <script type="text/html" id="toAuditorderWinit_appointWarehouseTypeTpl">
                <form class="layui-form" action="" lay-filter="component-form-group" id="toAuditorderWinit_appointWarehouseTypeForm">
                    <div class="p20">
                        <div class="layui-form-item">
                            <label class="layui-form-label">仓库类型</label>
                            <div class="layui-input-block">
                                <input type="radio" name="warehouseType" value="DIRECT" title="直邮仓">
                                <!-- <input type="radio" name="warehouseType" value="WINIT" title="海外仓"> -->
                                <input type="radio" name="warehouseType" value="FBP" title="平台仓">
                            </div>
                        </div>
                    </div>
                </form>
            </script>


<!-- 表格渲染模板 -->
<script type="text/javascript" src="${ctx}/static/js/order/orderLog.js"></script>
<script src="${ctx}/static/js/order/winit/toauditorder.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>