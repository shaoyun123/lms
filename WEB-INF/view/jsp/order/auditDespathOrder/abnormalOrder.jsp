<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>异常订单</title>
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
                #LAY-abnormalOrder .layui-btn+.layui-btn{
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
                .abnormalOrder_store_style .xm-select-dl{
                    width:-webkit-fill-available !important;
                }
            </style>
            <div class="layui-fluid" id="LAY-abnormalOrder">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="abnormalOrderForm" lay-filter="abnormalOrderForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md4 layui-col-lg4">
                                            <label class="layui-form-label">订单时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" id="abnormalOrder_time" name="time" lay-verify="required" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">平台</label>
                                            <div class="layui-input-block">
                                                <select name="platCode" lay-filter="abnormalOrderplatCodes" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select name="orgs" lay-search class="orgs_hp_custom" lay-filter="abnormalOrder_orgs">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label labelSel">
                                                <select lay-filter="abnormalOrder_salerAndcustomSelectFilter" name="salerAndcustomSelect">
                                                    <option value="1">销售</option>
                                                    <option value="2">客服</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <select name="salePersonId" class="users_hp_custom" lay-filter="abnormalOrder_salePersonsSelect" id="abnormalOrder_salePersonsSelect" xm-select="abnormalOrder_salePersonsSelect" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 abnormalOrder_store_style">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select name="storeAcctIds"
                                                class="users_hp_store_multi"
                                                id="abnormalOrder_store"
                                                xm-select="abnormalOrderStoreAcctIds" 
                                                xm-select-search 
                                                xm-select-search-type="dl" 
                                                xm-select-skin="normal" 
                                                lay-filter="abnormalOrderStoreAcctIds">
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
                                                <select name="platOrderStatusList" xm-select="abnormalplatOrderStatusList" id="abnormalplatOrderStatusList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
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
                                                <select name="platTags" xm-select="abnormalOrder_platTags" id="abnormalOrder_platTags" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                       
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label" style="padding:0px 0px 0px 5px">
                                                <select name="agentCompany" lay-filter="abnormalOrdercompanyType">
                                                    <option value="companys">物流公司</option>
                                                    <option value="agents">货代公司</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <select name="logisticsCompanyId" lay-filter="abnormalOrdercompany" lay-search></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 ">
                                            <label class="layui-form-label">物流方式</label>
                                            <div class="layui-input-block">
                                                <select name="logisTypeIds" lay-search>
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
                                        <div class="layui-col-md2 layui-col-lg2 dis_flex_space">
                                            <div class="externalBox" id="showMoreSearchCondition_abnormalOrder">
                                                <span>更多查询条件<span class="hasValue"></span></span>
                                                <span id="hide_icon_abnormalOrder" class="fr mr10 hidden">︽</span>
                                                <span id="show_icon_abnormalOrder" class="fr mr10">︾</span>
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
                                                <div class="layui-col-lg5 layui-col-md5">
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
                                        <div class="layui-row">
                                        <div class="layui-col-lg4 layui-col-md4">
                                            <label class="layui-form-label">备注类型</label>
                                            <div class="layui-input-block">
                                                <div class="layui-col-md6 layui-col-lg6">
                                                    <select name="orderLabels" xm-select="abnormalOrder_orderLabels" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                                    </select>
                                                </div>
                                                <div class="layui-col-md6 layui-col-lg6">
                                                    <input type="text" name="orderNote" class="layui-input" placeholder="备注内容" style="height:34px;">
                                                </div>
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
                                                    <option value="ship_by_date asc">截止发货时间正序</option>
                                                    <option value="ship_by_date desc">截止发货时间倒序</option>
                                                    <option value="plat_order_amt asc">订单金额正序</option>
                                                    <option value="plat_order_amt desc">订单金额倒序</option>
                                                    <option value="profit asc">利润正序</option>
                                                    <option value="profit desc">利润倒序</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2 layui-col-md-offset4">
                                            <div class="layui-input-block ml15">
                                                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal commonDirectMailRemarkSearch" lay-submit="" id="abnormalOrderSearch" lay-filter="abnormalOrderSearch">查询</button>
                                                <button type="button" class="layui-btn layui-btn-sm layui-btn-primary" lay-submit="" id="abnormalOrder_export" lay-filter="abnormalOrder_export">导出</button>
                                                <button type="button" class="layui-btn layui-btn-sm" lay-submit="" id="abnormalOrderDetail_export" lay-filter="abnormalOrderDetail_export">导出明细</button>
                                                <div id="abnormalOrder_save" class="inline_block pora"></div>
                                            </div>
                                        </div>
                                        </div>
                                        <%-- <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">备注内容</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="orderNote" class="layui-input" placeholder="">
                                            </div>
                                        </div> --%>
                                        <input class="hide" type="text" name="processStatus" value="501">
                                        <input class="hide" type="text" name="limit" value="5000">
                                        <input class="hide" type="text" name="page" value="1">
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card" id="abnormalOrderCard">
                            <div class="layui-card-body">
                                <div class="dis_flex_space">
                                    <div>
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" name="orderConfig">保存设置</button>
                                    </div>
                                    <div>
                                        <div id="abnormalOrder_logis" class="layui-inline disN">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">物流</button>
                                            <ul class="hidden">
                                                <permTag:perm funcCode="abnormalOrder_matchLogis_permTag">
                                                <li id="abnormalOrder_matchLogis">匹配物流</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="abnormalOrder_updatelogistype_permTag">
                                                <li id="abnormalOrder_updatelogistype">手动指定物流</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="abnormalOrder_applylogisno_permTag">
                                                    <li id="abnormalOrder_applylogisno">申请跟踪号</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="abnormalOrder_removelogisno_permTag">
                                                <li id="abnormalOrder_removelogisno">清空跟踪号</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="abnormalOrder_cancelwishpost_permTag">
                                                <li id="abnormalOrder_cancelwishpost">取消wishpost跟踪号</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="abnormalOrder_cancelEdisebay_permTag">
                                                <li id="abnormalOrder_cancelEdisebay">取消橙联跟踪号</li>
                                                </permTag:perm>
                                            </ul>
                                        </div>
                                        <div id="abnormalOrder_orderHandle" class="layui-inline disN">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">订单处理</button>
                                            <ul class="hidden">
                                                <permTag:perm funcCode="abnormalOrder_batchEditWareHouse_permTag">
                                                <li id="abnormalOrder_batchEditWareHouse_copy">修改仓库和物流</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="abnormalOrder_toCancel_permTag">
                                                <li id="abnormalOrder_toCancel_copy">取消订单</li>
                                                </permTag:perm>
                                                <permTag:perm funcCode="abnormalOrder_toAudit_permTag">
                                                <li id="abnormalOrder_toAudit_copy">转待审核</li>
                                                </permTag:perm>
                                            </ul>
                                        </div>
                                        <permTag:perm funcCode="abnormalOrder_removelogisno_permTag">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm hidden" id="abnormalOrder_removelogisno_copy">清空跟踪号</button>
                                        </permTag:perm>

                                        <permTag:perm funcCode="abnormalOrder_syncOrderStatus_permTag">
                                        <button type="button" id="abnormalOrder_syncOrderStatus" class="layui-btn layui-btn-normal layui-btn-sm hidden">更新订单状态</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="abnormalOrder_batchEditWareHouse_permTag">
                                        <button type="button" id="abnormalOrder_batchEditWareHouse" class="layui-btn layui-btn-normal layui-btn-sm hidden">修改仓库和物流</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="abnormalOrder_replenishCheck_permTag">
                                            <button type="button" id="abnormalOrder_replenishCheck" class="layui-btn layui-btn-normal layui-btn-sm hidden">补货检测</button>
                                        </permTag:perm>

                                        <permTag:perm funcCode="abnormalOrder_markExceptionBtn_permTag">
                                        <button type="button" id="abnormalOrder_markExceptionBtn" class="layui-btn layui-btn-normal layui-btn-sm hidden">标记异常</button>
                                        </permTag:perm>
                                        
                                        <permTag:perm funcCode="abnormalOrder_holdStockTask_permTag">
                                        <button type="button" id="abnormalOrder_holdStockTask" class="layui-btn layui-btn-normal layui-btn-sm hidden">全量库存占用</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="abnormalOrder_toAudit_permTag">
                                        <button type="button" id="abnormalOrder_toAudit" class="layui-btn layui-btn-normal layui-btn-sm hidden">转待审核</button>
                                        </permTag:perm>
                                        <permTag:perm funcCode="abnormalOrder_toCancel_permTag">
                                        <button type="button" id="abnormalOrder_toCancel" class="layui-btn layui-btn-normal layui-btn-sm hidden">转取消订单</button>
                                        </permTag:perm>
                                    </div>
                                </div>
                                <div class="layui-tab" lay-filter="abormalOrder_Tab" id="abormalOrder_Tab">
                                    <div class="">
                                        <div style="height:42px;">
                                            <ul class="layui-tab-title" style="width: 80%;">
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="layui-tab-content">
                                        <%--<table lay-filter="abnormalOrder_table" class="layui-table" id="abnormalOrder_table"></table>--%>
                                        <%--<div id="abnormalOrderPage" class="pageSortfix"></div>--%>
                                            <div id="abnormalOrder_table" style="width: 100%;height: 500px;" class="ag-theme-balham"></div>
                                            <div class="pageSortfix" id="abnormalOrderPage"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 表格渲染模板 -->

            <script type="text/html" id="abnormal_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

            <script type="text/html" id="abnormalorder_id_tpl">
            <div class="alignLeft">
                <input type="hidden" class="abnormalorder_col_id" value="{{d.id}}">
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
                    <a>{{d.platOrderId}}{{# if(d.platStoreOrderId){ }}({{d.platStoreOrderId}}){{# }}}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                </span>
                </div>
                <div><span class="gray">仓库:</span><span>{{d.warehouseName||'未分配'}}</span></div>
                <div><span class="gray">销售:</span><span>{{d.salesPersons||''}}</span></div>
                </div>
            </script>

            <script type="text/html" id="abnormalorder_platOrderAmt_tpl">
                <div class="alignLeft">
                <div><span class='gray'>{{d.currency||""}}</span><span>{{d.platOrderAmt||""}}</span></div>
                <div><span class="gray">利润(RMB)</span><span>{{d.profit||'0.00'}}</span></div>
                <div class="text_l"><span class="gray">利润率:</span><span>{{(100*d.profit/d.platOrderAmt/d.exchangeRate).toFixed(2)}}%</span></div>
                </div>
            </script>

            <script type="text/html" id="abnormalorder_prodQuantity_tpl">
            <div class="alignLeft">
                <div><span class="gray">种类：</span><span>{{d.kindNum||""}}</span></div>
                <div><span class="gray">数量：</span><span>{{d.prodQuantity||""}}</span></div>
                <div><span class="gray">重量：</span><span>{{d.realWeight||d.preWeight}}g</span></div>
                <div><span class="gray">计费重：</span><span>{{d.priceWeight}}g</span></div>
                </div>
            </script>

            <script type="text/html" id="abnormalorder_shippingUsername_tpl">
            <div class="alignLeft">
                <div>{{d.shippingUsername||""}}</div>
                <div>[{{d.shippingCountryCnName||""}}]</div>
                </div>
            </script>

            <script type="text/html" id="abnormalorder_logisTypeName_tpl">
            <div class="alignLeft">
                <div><span class="gray">买家:</span><span>{{d.buyerRequireShippingType||""}}<span></div>
                <div><span class="gray">发货:</span><span>[{{d.logisTypeName||""}}]</span><span>[{{d.logisTrackingNo||""}}]</span></div>
                </div>
            </script>

            <script type="text/html" id="abnormalOrder_time_tpl">
            <div class="alignLeft">
                <div><span class="gray">订单:</span><span>{{Format(d.orderTimeCn||"",'yyyy-MM-dd hh:mm:ss')}} ({{d.orderDay|| '0'}})<span></div>
                <div><span class="gray">申号:</span><span>{{Format(d.logisApplyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                <div><span class="gray">发货:</span><span>{{Format(d.shippingTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
                </div>
            </script>


            <script type="text/html" id="abnormalorder_option_tpl">
                <span class="layui-btn layui-btn-xs disN" lay-event="edit">修改订单</span>
                <span class="layui-btn layui-btn-xs abnormalOrder_split disN" lay-event="split">拆分订单</span>
                <span class="layui-btn layui-btn-xs" lay-event="remark">备注</span>
            </script>

            <!-- 商品详情 -->
            <script type="text/html" id="pop_abnormalorder_detail">
                <div class="mg_50">
                    <table class="layui-table" id="abnormalorder_detail_table" lay-filter="abnormalorder_detail_table"></table>
                </div>
            </script>

            <script type="text/html" id="abnormalorder_appointWarehouseTypeTpl">
                <form class="layui-form" action="" lay-filter="component-form-group" id="abnormalorder_appointWarehouseTypeForm">
                    <div class="p20">
                        <div class="layui-form-item">
                            <label class="layui-form-label">仓库类型</label>
                            <div class="layui-input-block">
                                <input type="radio" name="warehouseType" value="DIRECT" title="直邮仓">
                                <input type="radio" name="warehouseType" value="WINIT" title="万邑通仓">
                            </div>
                        </div>
                    </div>
                </form>
            </script>

            <!-- 修改/新增订单 -->
            <script type="text/html" id="pop_abnormalOrder_newandeditorder">
                <div class="mg_50">
                    <div class="layui-tab" lay-filter="orderLog">
                        <ul class="layui-tab-title">
                          <li class="layui-this">详情</li>
                          <li>日志</li>
                        </ul>
                        <div class="layui-tab-content">
                          <div class="layui-tab-item layui-show">
                            <form class="layui-form" id="abnormalOrder_editForm" lay-filter="abnormalOrder_editForm">
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
                                            <select name="storeAcctId" lay-verify="required" lay-search>
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
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">添加商品</button>
                                    </div>
                                </div> -->
                                <div class="layui-form-item">
                                    <div class="layui-col-lg12 layui-col-md12 ">
                                        <table class="layui-table" id="abnormalOrder_product_table" lay-filter="abnormalOrder_product_table"></table>
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
            <script type="text/html" id="abnormalOrder_detail_img_tpl">
                <div>
                    <img width="60" height="60" data-original="{{d.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>


<%-- 弹框--拆分订单 --%>
<script type="text/html" id="abnormalOrderSplitOrderLayer">
    <div id="abnormalOrderSplitOrderContainer" style="padding: 20px 40px;">
    </div>
</script>
<script type="text/html" id="abnormalOrderSplitOrderContainerTpl">
    <div>
      <strong><font color="red" size="4">多个一买和组合品,所拆出的部分商品会影响线上发货,请谨慎拆分!</font></strong>
    </div>
    <table class="layui-table">
        <thead>
            <tr>
                <th>商品信息</th>
                <th>可用库存</th>
                <th>商品数量</th>
                <th>拆分数量</th>
            </tr>
        </thead>
        <tbody>
            {{# if(d.orderDetails.length>0){ }}
            {{#  layui.each(d.orderDetails, function(index, item){ }}
            <tr>
                <td>
                    <div class="dis_flex">
                        <img width="60" height="60" data-original="{{item.imageUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                        <div>
                            <div>{{item.prodSSku||""}}</div>
                            <div>{{item.prodTitle||""}}</div>
                        </div>
                    </div>
                </td>
                <td>{{item.availableStock}}</td>
                <td>{{item.prodQuantity}}</td>
                <td>
                    <input type="number" class="layui-input" name="demolitionQuality" onchange="commonSetInputMaxMinVal(this,{{item.prodQuantity}},1)" data-id="{{item.id}}">
                </td>
            </tr>
            {{# }); }}
            {{# } }}
        </tbody>
    </table>
</script>

<%-- 弹框-批量修改仓库和物流 --%>
<script type="text/html" id="abnormalOrder_batchEditWareHouseLayer">
    <div class="layui-form" style="padding:20px 20px 0 0;">
        <div class="layui-form-item">
            <label class="layui-form-label">仓库</label>
            <div class="layui-input-block">
                <select name="warehouse" id="batchEditWareHouse_warehouse_abnormalOrder"></select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">物流</label>
            <div class="layui-input-block" style="display:flex;">
                <select name="warehouse" id="batchEditWareHouse_logisCompany_abnormalOrder" lay-filter="batchEditWareHouse_logisCompanyFilter_abnormalOrder"></select>
                <div style="margin-left:10%;">
                    <select name="warehouse" id="batchEditWareHouse_logisWay_abnormalOrder"></select>
                </div>
            </div>
        </div>
    </div>
</script>
<%-- 取消wishpost跟踪号 --%>
<script type="text/html" id="abnormalOrder_cancelWishpostTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="abnormalOrder_cancelWishpostForm">
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
<%-- 手动指定物流 --%>
<script type="text/html" id="abnormalOrder_updateLogisTypeTpl">
    <form class="layui-form" action="" lay-filter="component-form-group" id="abnormalOrder_updateLogisTypeForm">
        <div class="p20">
            <div class="layui-form-item">
                <label class="layui-form-label">物流公司</label>
                <div class="layui-input-block">
                    <select class="layui-select" lay-search name="logisCompany" lay-filter="abnormalOrder_logisCompany">
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

<%-- 权限问题---拆分订单 --%>
<script type="text/html" id="abnormalOrder_splitPermTagTable">
    <permTag:perm funcCode="abnormalOrder_splitPermTag">
    <button type="button" name="split" class="layui-btn layui-btn-xs disN abnormalOrder__splitBtn">拆分订单</button>
    </permTag:perm>
</script>
<!-- 表格渲染模板 -->
<script type="text/javascript" src="${ctx}/static/js/order/orderLog.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ag-grid/ag-grid.min.js"></script>
<script src="${ctx}/static/js/order/abnormalOrder.js"></script>