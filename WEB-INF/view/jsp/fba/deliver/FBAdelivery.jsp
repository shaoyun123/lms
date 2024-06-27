<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>货件计划</title>
            <style>
                .fieldBox_FBAdeliverty{
                    float: left;
                    width: 20%;
                    height: 25px;
                    margin-top: 10px;
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

                .FBAdelivery_scroll_bt1 .layui-btn+.layui-btn {
                    margin-left: 5px!important;
                    /* margin-top: 5px */
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

                .w_400 {
                    width: 400px;
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

                #FBAdelivery_page {
                    position: fixed;
                    background: #fff;
                    width: 100%;
                    z-index: 99999;
                    bottom: 0;
                    left: 100px;
                    border-top: 1px solid #ccc;
                }

                .mt_5 {
                    margin-top: 5px
                }

                .ml_5 {
                    margin-left: 5px
                }
            </style>
            <div class="layui-fluid" id="LAY-FBAdelivery">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="FBAdeliveryForm" lay-filter="FBAdeliveryForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select name="orgId"  id="FBAdelivery_orgTree" lay-filter="FBAdelivery_orgTree" class="orgs_hp_custom" lay-search></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">销售员</label>
                                            <div class="layui-input-block">
                                                <select name="salesPersonId" id="FBAdelivery_userList" lay-filter="FBAdelivery_userList" class="users_hp_custom" data-rolelist="amazon专员" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">FBA销售员</label>
                                            <div class="layui-input-block">
                                                <select 
                                                    name="skuSalespersonIdList"
                                                    id="FBAdelivery_fbaUserList"
                                                    lay-filter="FBAdelivery_fbaUserList"
                                                    xm-select="FBAdelivery_fbaUserList" 
                                                    class="users_hp_custom_multi"
                                                    xm-select-search 
                                                    xm-select-search-type="dl" 
                                                    xm-select-skin="normal"
                                                    data-rolelist="amazon专员"
                                                    ></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1">
                                            <%--<label class="layui-form-label">店铺</label>--%>
                                            <%--<div class="layui-input-block">--%>
                                                <select name="storeAcctId" id="FBAdelivery_storeAcct" lay-filter="FBAdelivery_selAcct" lay-search class="store_hp_custom" data-platcode="amazon" data-title="店铺">
                                                </select>
                                            <%--</div>--%>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1">
                                                <select name="salesSite" id="FBAdelivery_amazonSite" lay-search>
                                                </select>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1 selectable planSearchField">
                                            <select name="planLabel"  id="FBAdelivery_planLabel" lay-filter='FBAdelivery_planLabel' xm-select="FBAdelivery_planLabel" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                                <option value="">标签</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label select_label ml">
                                                <select name="skuType">
                                                    <option value="sellerSkuStr">店铺SKU</option>
                                                    <option value="asinStr">ASIN</option>
                                                    <option value="fnSkuStr">FNSKU</option>
                                                    <option value="prodSSkuStr">子商品SKU</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" name="sku" class="layui-input" placeholder="多个使用逗号分隔">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1 disN selectable shipSearchField" id="FBAdelivery_oaShipStatus_div">
                                                <select name="shipmentStatus">
                                                    <option value="">平台货件状态</option>
                                                    <option value=""></option>
                                                </select>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1 disN selectable shipSearchField" >
                                            <select name="hasLosgitisFee">
                                                <option value="">摊分物流费</option>
                                                <option value="true">已摊分</option>
                                                <option value="false">未摊分</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-form-item">
                                        <div class="layui-col-lg2 layui-col-md2 disN selectable shipSearchField">
                                            <label class="layui-form-label">重量范围</label>
                                            <div class="layui-input-block dis_flex">
                                                <input type="number" name="totalWeightStart" class="layui-input" placeholder="左闭" style="width: 80px">
                                                <input type="number" name="totalWeightEnd" class="layui-input" placeholder="右开" style="width: 80px">
                                            </div>
                                        </div>

                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label" style="padding:0px 0px 0px 5px">
                                                <select name="timeType">
                                                    <option value="创建时间">创建时间</option>
                                                    <option value="修改时间">修改时间</option>
                                                    <option value="发货时间">发货时间</option>
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="time" id="FBAdelivery_Form_time">
                                            </div>
                                        </div>

                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">创建人</label>
                                            <div class="layui-input-block">
                                                <input class="layui-input" name="creator">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1 shipSearchField disN">
                                            <select name="logisticsCompanyNameList"
                                                    id="FBAdelivery_companyNameList"
                                                    xm-select="FBAdelivery_companyNameList"
                                                    xm-select-search
                                                    xm-select-search-type="dl"
                                                    xm-select-skin="normal"
                                            >
                                                <option value="">物流公司</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1 shipSearchField disN">
                                            <select name="logisticsTypeIdList"
                                                    id="FBAdelivery_logisticsTypeIdList"
                                                    xm-select="FBAdelivery_logisticsTypeIdList"
                                                    xm-select-search
                                                    xm-select-search-type="dl"
                                                    xm-select-skin="normal"
                                            >
                                                <option value="">发货物流</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 selectable planSearchField" title="可用数量 ➖ 计划发货数量 ≥ 该值">
                                            <label class="layui-form-label">可用计划差<i class="layui-icon layui-icon-about"></i></label>
                                            <div class="layui-input-block">
                                                <input class="layui-input" name="ableStockAndPlanQtyDiffMin" placeholder="≥ ">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1">
                                            <select name="hasPackDesc">
                                                <option value="">包装备注</option>
                                                <option value="true">有</option>
                                                <option value="false">无</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-lg1 layui-col-md1">
                                            <select name="isDistributionStore">
                                                <option value="">是否铺货</option>
                                                <option value="true">是</option>
                                                <option value="false">否</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 selectable planSearchField">
                                            <label class="layui-form-label">海外仓可用库存</label>
                                            <div class="layui-input-block">
                                                <input class="layui-input" name="fbaAvailableStockMin" placeholder="≥ ">
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 storageTypeList">
                                          <label class="layui-form-label">仓储类型</label>
                                          <div class="layui-input-block">
                                              <select 
                                                  name="storageTypeList"
                                                  id="FBAdelivery_storageTypeList"
                                                  xm-select="FBAdelivery_storageTypeList" 
                                                  xm-select-search 
                                                  xm-select-search-type="dl" 
                                                  xm-select-skin="normal"
                                                  ></select>
                                          </div>
                                      </div>
                                            <div class="layui-input-block fr">
                                                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal keyHandle" lay-submit="" id="FBAdeliverySearch" lay-filter="FBAdeliverySearch">查询</button>
                                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                            </div>
                                        <input class="hide" type="text" name="tablename" value="FBAdelivery_table_deliveryPlan">
                                        <input class="hide" type="text" name="shipmentStatus" value="">
                                        <input class="hide" type="text" name="limit" value="100">
                                        <input class="hide" type="text" name="page" value="1">
                                        <input type="hidden" name="orderBy" value="">
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-tab" lay-filter="FBAdelivery_Tab" id="FBAdelivery_Tab">
                                    <div class="toFixedContain" style="height:42px;">
                                        <div class="fl" style="height:42px;">
                                            <ul class="layui-tab-title" id="FBAdelivery_label">
                                                <li class="layui-this" data-index="FBAdelivery_table_deliveryPlan" data-code="100">发货需求(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_FBACreate" data-code="0" title="通过FBA后台创建，同步回来的货件">FBA创建(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_toPack" data-code="1">待装箱(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_toDelivery" data-code="2">待发货(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_delivered" data-code="3">已发货(<span>0</span>)</li>
                                                <%--<li data-index="FBAdelivery_table_error" data-code="4">状态异常(<span>0</span>)</li>--%>
                                                <li data-index="FBAdelivery_table_apiInfo" data-code="5">全部(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_deleteInfo" data-code="-4">已删除(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_matchInfo" data-code="9">配货数据(<span>0</span>)</li>
                                            </ul>
                                        </div>
                                        <div class="fl">
                                            <button type="button" class="layui-btn layui-btn-sm FBAdelivery_batchBtn disN" id="FBAdelivery_exportLackInfo">导出缺货数据</button>
                                            <button type="button" class="layui-btn layui-btn-sm layui-btn-warm disN FBAdelivery_batchBtn" id="FBAdelivery_syncByShipmentIdList">同步货件</button>
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_fixExpirDate">补充过期时间</button>
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_removExpirDate">清除过期时间</button>
                                        </div>
                                        <div class="fr">
                                            <permTag:perm funcCode="FBAdelivery_markLabel">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_markLabel">设置物流标签</button>
                                            </permTag:perm>

                                            <permTag:perm funcCode="FBAdelivery_startPurchase_btn">
<%--                                                <button type="button" class="layui-btn layui-btn-warm layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_prevPurchase">铺货采购</button>--%>
                                                <button type="button" class="layui-btn layui-btn-warm layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_prevPurchaseUn">非铺货采购</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="FBAdelivery_markOver">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_markOverBatch">剩余不发</button>
                                            </permTag:perm>

                                            <permTag:perm funcCode="FBAdelivery_audit_btn">
                                                <button type="button" class="layui-btn layui-btn-warm layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_batch_auditPlan">审核</button>
                                                <%--<button type="button" class="layui-btn layui-btn-warm layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_batch_cancelAuditPlan">取消审核</button>--%>
                                            </permTag:perm>


                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_createGoods">生成货件</button>
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_createBatch">生成批次</button>
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_cancelBatch">取消批次</button>
                                            <permTag:perm funcCode="FBA_markDeliver">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_batchDeliver">批量发货</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="FBA_fullFreightNum">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_batchWriteOrder">批量填入运单</button>
                                            </permTag:perm>
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_asyncGoods">按店铺同步货件</button>
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_recommPack_open">推荐装箱</button>
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_exportBoxInfo">导出装箱信息</button>
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_exportSSkuInfo">导出</button>
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_exportByTemplate">按模板导出</button>
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_importTransferNum">导入转运号</button>
                                            <input type="file" class="disN" id="FBAdelivery_importTransferNumFile">

                                            <permTag:perm funcCode="FBAdelivery_updateLogisticsTypeBatch">
                                                <button type="button" class="layui-btn layui-btn-warm layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdelivery_updateLogisticsTypeBatch">修改物流方式</button>
                                            </permTag:perm>
                                        </div>
                                    </div>
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                            <div class="checkbox-group toFixedContain">
                                                <div class="layui-form disN FBAdelivery_batchBtn" id="planStatusBox_FBAdelivery" lay-filter="planStatusBoxDiv_FBAdelivery">
                                                    <input type="checkbox" name="planStatus" value="0" title="待审核(<font>0</font>)" checked lay-skin="primary" lay-filter="planStatusBox_FBAdelivery">
                                                    <input type="checkbox" name="planStatus" value="2" title="待建货件(<font>0</font>)" lay-skin="primary" lay-filter="planStatusBox_FBAdelivery">
                                                    <input type="checkbox" name="planStatus" value="3" title="已完成(<font>0</font>)" lay-skin="primary" lay-filter="planStatusBox_FBAdelivery">
                                                    <input type="checkbox" name="planStatus" value="9" title="已删除(<font>0</font>)" lay-skin="primary" lay-filter="planStatusBox_FBAdelivery">
                                                </div>
                                            </div>
                                            <table lay-filter="FBAdelivery_table_deliveryPlan" class="layui-table" id="FBAdelivery_table_deliveryPlan"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <div class="checkbox-group toFixedContain">
                                                <div class="layui-form disN FBAdelivery_batchBtn" id="FBAdelivery_purStatusSearchBox" lay-filter="FBAdelivery_purStatusBoxDiv">
                                                    <input type="checkbox" name="purStatus" value="0" title="待审核(<font>0</font>)" checked lay-skin="primary" lay-filter="FBAdelivery_purStatusBox">
                                                    <input type="checkbox" name="purStatus" value="2" title="待派单(<font>0</font>)" lay-skin="primary" lay-filter="FBAdelivery_purStatusBox">
                                                </div>
                                            </div>
                                            <table lay-filter="FBAdelivery_table_FBACreate" class="layui-table" id="FBAdelivery_table_FBACreate"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <div class="checkbox-group toFixedContain">
                                                <div class="layui-form disN FBAdelivery_batchBtn" id="matchStatusCheckBox_FBAdelivery" lay-filter="matchStatusCheckBoxDiv_FBAdelivery">
                                                    <input type="checkbox" name="matchStatus" value="-1" title="待配货(<font id=unMatch_FBAdelivery>0</font>)" lay-skin="primary" lay-filter="matchStatusCheckBox_FBAdelivery">
                                                    <input type="checkbox" name="matchStatus" value="0" title="待包装(<font id=unMatch_FBAdelivery>0</font>)" lay-skin="primary" lay-filter="matchStatusCheckBox_FBAdelivery">
                                                    <input type="checkbox" name="matchStatus" value="1" title="部分包装(<font id=partMatch_FBAdelivery>0</font>)" lay-skin="primary" lay-filter="matchStatusCheckBox_FBAdelivery">
                                                    <input type="checkbox" name="matchStatus" value="2" title="已包装(<font id=allMatch_FBAdelivery>0</font>)" lay-skin="primary" lay-filter="matchStatusCheckBox_FBAdelivery">
                                                </div>
                                            </div>
                                            <table lay-filter="FBAdelivery_table_toPack" class="layui-table" id="FBAdelivery_table_toPack"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <table lay-filter="FBAdelivery_table_toDelivery" class="layui-table" id="FBAdelivery_table_toDelivery"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <div style="width:100%;height:30px;line-height:30px">
                                                <div class="dis_flex_space FBAdelivery_scroll_bt2">
                                                    <div class="layui-form layui-form-item">
                                                        <input type="radio" name="delivered" value="" title="全部" checked lay-filter="FBAdelivery_tab_delivered">
                                                        <input type="radio" name="delivered" value="SHIPPED" title="已发货" lay-filter="FBAdelivery_tab_delivered">
                                                        <input type="radio" name="delivered" value="IN_TRANSIT" title="在途" lay-filter="FBAdelivery_tab_delivered">
                                                        <input type="radio" name="delivered" value="DELIVERED" title="已运抵" lay-filter="FBAdelivery_tab_delivered">
                                                        <input type="radio" name="delivered" value="CHECKED_IN" title="审查" lay-filter="FBAdelivery_tab_delivered">
                                                        <input type="radio" name="delivered" value="RECEIVING" title="接收中" lay-filter="FBAdelivery_tab_delivered">
                                                        <input type="radio" name="delivered" value="CLOSED" title="已结束" lay-filter="FBAdelivery_tab_delivered">
                                                    </div>
                                                </div>
                                            </div>
                                            <table lay-filter="FBAdelivery_table_delivered" class="layui-table" id="FBAdelivery_table_delivered"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <div style="width:100%;height:30px;line-height:30px">
                                                <div class="dis_flex_space FBAdelivery_scroll_bt2">
                                                    <div class="layui-form layui-form-item">
                                                        <input type="radio" name="finished" value="" title="全部" checked lay-filter="FBAdelivery_tabfinished">
                                                        <input type="radio" name="finished" value="WORKING" title="准备中" checked lay-filter="FBAdelivery_tabfinished">
                                                        <input type="radio" name="finished" value="SHIPPED" title="已发货" lay-filter="FBAdelivery_tabfinished">
                                                        <input type="radio" name="finished" value="IN_TRANSIT" title="在途" lay-filter="FBAdelivery_tabfinished">
                                                        <input type="radio" name="finished" value="DELIVERED" title="已运抵" lay-filter="FBAdelivery_tabfinished">
                                                        <input type="radio" name="finished" value="CHECKED_IN" title="审查" lay-filter="FBAdelivery_tabfinished">
                                                        <input type="radio" name="finished" value="RECEIVING" title="接收中" lay-filter="FBAdelivery_tabfinished">
                                                        <input type="radio" name="finished" value="CLOSED" title="已结束" lay-filter="FBAdelivery_tabfinished">
                                                        <input type="radio" name="finished" value="DELETED" title="已删除" lay-filter="FBAdelivery_tabfinished">
                                                        <input type="radio" name="finished" value="CANCELLED" title="已取消" lay-filter="FBAdelivery_tabfinished">
                                                        <input type="radio" name="finished" value="ERROR" title="错误" lay-filter="FBAdelivery_tabfinished">
                                                    </div>
                                                </div>
                                            </div>
                                            <table lay-filter="FBAdelivery_table_apiInfo" class="layui-table" id="FBAdelivery_table_apiInfo"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <table lay-filter="FBAdelivery_table_deleteInfo" class="layui-table" id="FBAdelivery_table_deleteInfo"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <table lay-filter="FBAdelivery_table_matchInfo" class="layui-table" id="FBAdelivery_table_matchInfo"></table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="FBAdelivery_page"></div>
                    </div>
                </div>
            </div>

            <!-- 表格渲染模板 -->
            <script type="text/html" id="FBAdelivery_imageTpl">
                {{# if (d.labelList && d.labelList.length > 0) {}}
                    {{# for (let i = 0; i < d.labelList.length; ++i) { }}
                        <div class="fRed">「{{d.labelList[i].labelName}}」</div>
                    {{# }}}
                {{# }}}
                <div>
                    <img width="60" height="60" data-original="{{d.image||d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>
            </script>

<script type="text/html" id="FBAdelivery_batchUpdateLogisticTypePop">
    <form class="layui-form" id="FBAdelivery_batchUpdateLogisticTypeForm" lay-filter="FBAdelivery_batchUpdateLogisticTypeForm">
        <select name="preLogisticsTypeId" class="layui-select" lay-search></select>
    </form>
</script>

<script type="text/html" id="FBAdelivery_prodSSkuTemp">
<div>{{d.prodSSku}}</div>
<div>
    {{# if(d.logisAttrList){ }}
    {{# let logistAttrArr = d.logisAttrList.split(',')}}
    {{# for (let i = 0; i < logistAttrArr.length; ++i) { let logis = logistAttrArr[i];let alia=getLogisAttrAlia(logis)}}
    {{#  if(alia && alia !== '普'){ }}
    <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logis}}">{{alia}}</span>
    {{# } }}
    {{# }}}
    {{# } }}
</div>
<div style="max-height: 20px" class="text_l overContentEllipsis" onmouseenter="showTip(`{{d.fbaHisProd.packDesc}}`,this)" onmouseleave="removeTip(this)"><span class="gray">包装备注:</span>{{d.fbaHisProd.packDesc || ''}}</div>
</script>
<script type="text/html" id="FBAdelivery_Detail_numTemp">
    <div style='color:red' title='上限数量'>「{{d.planQualityMax}}」</div>
    <div title=''>{{d.originPlanQuality}}</div>
    <div style='color:green'  title='下限数量'>「{{d.planQualityMin}}」</div>
</script>

<script type="text/html" id="FBAdelivery_opAsyncInfo">
    <div onmouseover='showTip(`{{d.opAsyncInfo || ''}}`, this)' onmouseleave="removeTip(this)">
        <div class="overContentEllipsis4">{{d.opAsyncInfo || ""}}</div>
    </div>
</script>
<script type="text/html" id="FBAdelivery_showFreightNum">
    <div onmouseover="showTip(`{{d.showFreightNum || ''}}`, this)" onmouseleave="removeTip(this)">
        <div class="overContentEllipsis4">{{d.showFreightNum || ""}}</div>
    </div>
</script>
<script type="text/html" id="FBAdelivery_productInfo_OA">
    <div title="商品SKU">{{d.prodSSku}}</div>
    <div title="物流属性">
        {{# if(d.logisAttrList){ }}
        {{# let logistAttrArr = d.logisAttrList.split(',')}}
        {{# for (let i = 0; i < logistAttrArr.length; ++i) { let logis = logistAttrArr[i];let alia=getLogisAttrAlia(logis)}}
        {{#  if(alia && alia !== '普'){ }}
        <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logis}}">{{alia}}</span>
        {{# } }}
        {{# }}}
        {{# } }}
    </div>
    <div title="开发专员">{{d.bizzOwner}}</div>
    {{# if(d.packDesc !== '' && d.packDesc !== undefined){ }}
        <div onmouseover="FBAdelivery_showPackDesc(this,{{d.LAY_TABLE_INDEX}})" onmouseleave="removeTip(this,500)">【包装备注】</div>
    {{# } }}
</script>


<script type="text/html" id="FBAdelivery_productInfo">
    <div class="text_l"><span class="gray">店铺SKU:<a class="sellerSkuInfo">{{d.sellerSku||''}}</a></span>
    </div>
    <div class="text_l"><span class="gray">ASIN:</span><a class="skyblue" target="_blank" href="{{getAmazonProdPagePrex(d.salesSite) + d.asin}}">{{d.asin||''}}</a></div>
    <div class="text_l"><span class="gray">FNSKU:</span>{{d.fnSku||''}}</div>
    <div class="text_l"><span class="gray">仓储类型:</span>{{d.storageTypeName||''}}</div>
</script>

            <script type="text/html" id="FBAdelivery_productInfo_pack">
                <div class="text_l"><span class="gray">SKU:<a class="sellerSkuInfo">{{d.sellerSku||''}}</a></span></div>
                <div class="text_l"><span class="gray"> ASIN:</span><a class="skyblue" target="_blank" href="{{d.asinSrc}}">{{d.asin||''}}</a>
                    {{# if(d.logisAttrList){ }}
                    {{# let logistAttrArr = d.logisAttrList.split(',')}}
                    {{# for (let i = 0; i < logistAttrArr.length; ++i) { let logis = logistAttrArr[i];let alia=getLogisAttrAlia(logis)}}
                    {{#  if(alia && alia !== '普'){ }}
                    <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logis}}">{{alia}}</span>
                    {{# } }}
                    {{# }}}
                    {{# } }}
                </div>
                <div class="text_l"><span class="gray">FNSKU:</span>{{d.fnSku||''}}</div>
                <div class="text_l"><span class="gray">商品SKU:</span>{{d.prodSSku||''}}</div>
      </script>

            <script type="text/html" id="FBAdelivery_submitGoods">
                <button class="layui-btn layui-btn-xs" lay-event="FBA_submitproductDetail">商品详情</button>
                <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBA_submitremovegoods">删除</button>
            </script>

            <script type="text/html" id="FBAdelivery_fnCenterInfo">
                <div><span style="font-weight:bold">{{d.fnCenterId}}</span></div>
                <div><span>{{d.addressMark || ''}}</span></div>
                <div><span>{{d.fnCenterAddress || ''}}</span></div>
            </script>

            <script type="text/html" id="FBAdelivery_creatGoods">
                <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBA_createTable">移除</button>
            </script>

            <script type="text/html" id="FBAbox_proNum">
                <input type="number" class="layui-input" value="0" min="0" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
            </script>

<script type="text/html" id="FBAdelivery_changeLogistic_op">
    {{d.logisticsTypeName||''}}<button class="layui-btn layui-btn-sm" lay-event="FBAdelivery_changeLogistic">重选物流</button>
</script>

<script type="text/html" id="编辑物流">
    <div>序号:{{d.freightNum}}</div>
</script>

<script type="text/html" id="FBAdelivery_boxSizeTpl">
    <input type="number" class="layui-input" placeholder="{{d.customSizeName}}" value="0" min="0">
    <button class="layui-btn layui-btn-sm" lay-event="FBAdelivery_setAllboxSize">一键应用({{d.customSizeName}})</button>
</script>
<script type="text/html" id="FBAdelivery_boxSizeDescTpl">
   <span>{{d.customSizeDesc}}</span>
</script>

<script type="text/html" id="FBAbox_proNum_init">
    <input type="number" class="layui-input" value="{{d.planQuality||0}}" min="0" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
</script>

<script type="text/html" id="FBAprint_Label">
    <input type="text" class="layui-input" name="mixStyle" value="{{d.mixStyle||''}}">
    <input type="text" class="layui-input disN" name="prodSSku" value="{{d.prodSSku||''}}">
</script>

<script type="text/html" id="FBAcreate_proNum">
    <input type="number" class="layui-input" value="{{d.planQuality - d.actQty < d.availableQuality ? (d.planQuality - d.actQty) : d.availableQuality }}" min="1" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
</script>

<script type="text/html" id="FBAdelivery_store_site">
    <div class="text_l">{{d.storeAcct}}-{{d.salesSite}}</div>
    <div class="text_l"><span>销售员:{{d.salesperson||''}}</span></div>
    <div class="text_l"><span>创建人:{{d.creator||''}}</span></div>
</script>

<script type="text/html" id="FBAdelivery_createTime">
    <div>{{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</div>
</script>

<script type="text/html" id="FBAdelivery_weight_tpl">
    <div class="text_l"><span>箱号:{{ d.boxCode || '' }}</span></div>
    <div class="text_l"><span>称重:{{ (d.totalCartonWeight||0).toFixed(3) }}</span></div>
    <div class="text_l" title="根据商品信息的重量，预估的货件总重量"><span>商品合重:{{ ((d.totalWeight||0)/1000).toFixed(3) }}</span></div>
    <div class="text_l"><span>箱抛重:{{ (d.totalThrowWeight||0).toFixed(3) }}</span></div>
</script>

<script type="text/html" id="FBAdelivery_plan_cost_tpl">
    {{ ((d.oaCost||0)*d.planQuality).toFixed(2) }}
    <div><button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_showBehavior">表现</button></div>
</script>

<script type="text/html" id="FBAdelivery_planoption_tpl">
    {{# if (d.planStatus === 0) {}}
<permTag:perm funcCode="FBAdelivery_audit_btn">
    <div><button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="FBAdelivery_auditPlan">审核</button></div>
</permTag:perm>
        <div><button class="layui-btn layui-btn-xs" lay-event="FBA_modifyAmount">修改</button></div>
        <div><button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBA_removePro">删除</button></div>
    {{#}}}
    {{# if (d.planStatus === 1) {}}
    <div><button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="FBAdelivery_cancelAudit">取消审核</button></div>
    {{#}}}
    {{# if (d.planStatus === 2) {}}
<permTag:perm funcCode="FBAdelivery_markOver">
<div><button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="FBAdelivery_markOver">剩余不发</button></div>
</permTag:perm>
    {{#}}}
</script>

<script type="text/html" id="FBAdelivery_op_toPur_tpl">
    <permTag:perm funcCode="FBAdelivery_reqPur">
        {{# if (d.purStatus == 0) {}}
        <div>
            <button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="FBAdelivery_ShipAudit">审核</button>
        </div>
        {{# } }}
    </permTag:perm>
    <permTag:perm funcCode="FBAdelivery_setPurToSendWh">
        {{# if (d.purStatus == 2) {}}
        <div>
            <button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_setPurToSendWh">派单</button>
        </div>
        {{# } }}
    </permTag:perm>

    <permTag:perm funcCode="FBA_productDetail_canEdit">
        <div>
            <button class="layui-btn layui-btn-xs" lay-event="FBA_productDetail_canEdit">货品详情</button>
        </div>
    </permTag:perm>
    <permTag:perm funcCode="FBA_removegoods">
        <div>
            <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBA_removegoods">删除货件</button>
        </div>
    </permTag:perm>

    <permTag:perm funcCode="FBAdelivery_realeaseOcc_forWarehouse">
        <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBAdelivery_realeaseOcc" title="仅OA删除货件，不调用API删除">OA删除</button>
    </permTag:perm>
</script>

<script type="text/html" id="FBAdelivery_toPack_amtTemplet">
    <div class="planQuality">{{d.planQuality}}</div>
    <div title='实发数量' style="color: red">「{{d.actQuality || 0}}」</div>
</script>

<script type="text/html" id="FBAdelivery_op_toPack_tpl">
    <permTag:perm funcCode="FBA_productDetail_canEdit">
        <button class="layui-btn layui-btn-xs" lay-event="FBA_productDetail_canEdit">货品详情</button>
    </permTag:perm>
        <permTag:perm funcCode="FBA_pack">
            <button class="layui-btn layui-btn-xs" lay-event="FBA_pack">装箱</button>
        </permTag:perm>
    <%--<permTag:perm funcCode="FBA_pack_OA">--%>
        <%--{{# if (d.shipmentStatus != 'WORKING') {}}--%>
        <%--<button class="layui-btn layui-btn-xs" lay-event="FBA_pack_oa">OA装箱</button>--%>
        <%--{{# } }}--%>
    <%--</permTag:perm>--%>
<permTag:perm funcCode="FBA_printProduct">
<button class="layui-btn layui-btn-xs" lay-event="FBA_printProduct">打印货品标签</button>
</permTag:perm>
    <permTag:perm funcCode="FBA_removegoods">
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBA_removegoods">删除货件</button>
</permTag:perm>
    {{#if (d.matchStatus === 0){}}
<permTag:perm funcCode="FBAdelivery_realeaseOcc_forDev">
<%--<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBAdelivery_realeaseOcc">驳回货件</button>--%>
</permTag:perm>
    {{# } }}
    <permTag:perm funcCode="FBAdelivery_realeaseOcc_forWarehouse">
        <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBAdelivery_realeaseOcc"  title="仅OA删除货件，不调用API删除">OA删除</button>
    </permTag:perm>
</script>

<script type="text/html" id="FBAdelivery_op_toDelivery_tpl">
    <permTag:perm funcCode="FBA_productDetail_canEdit">
        <button class="layui-btn layui-btn-xs" lay-event="FBA_productDetail_canEdit">货品详情</button>
    </permTag:perm>
    <permTag:perm funcCode="FBA_markDeliver">
        <button class="layui-btn layui-btn-xs" lay-event="FBA_markDeliver">发货</button>
    </permTag:perm>
    <%--<permTag:perm funcCode="FBA_markDeliver_OA">--%>
        <%--{{# if (d.shipmentStatus != 'WORKING') {}}--%>
        <%--<button class="layui-btn layui-btn-xs" lay-event="FBA_markDeliver_oa">OA发货</button>--%>
        <%--{{# } }}--%>
    <%--</permTag:perm>--%>

    <permTag:perm funcCode="FBA_printBox">
        <button class="layui-btn layui-btn-xs" lay-event="FBA_printBox">打印箱子标签</button>
    </permTag:perm>
    <permTag:perm funcCode="FBA_pack_detail">

        <button class="layui-btn layui-btn-xs" lay-event="FBA_pack_detail">装箱详情</button>
    </permTag:perm>

<%--<permTag:perm funcCode="FBA_pack_OA">--%>
    <%--{{# if (d.shipmentStatus != 'WORKING') {}}--%>
    <%--<button class="layui-btn layui-btn-xs" lay-event="FBA_pack_oa">OA装箱</button>--%>
    <%--{{# } }}--%>
<%--</permTag:perm>--%>

    <permTag:perm funcCode="FBA_fullFreightNum">
        <button class="layui-btn layui-btn-xs" lay-event="FBA_fullFreightNum">填入运单</button>
    </permTag:perm>
    <permTag:perm funcCode="FBA_removegoods">
        <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBA_removegoods">删除货件</button>
    </permTag:perm>
</script>

<script type="text/html" id="FBAdelivery_op_notOp_tpl">
    <button class="layui-btn layui-btn-xs" lay-event="FBA_productDetail_OA">OA货品详情</button>
    <button class="layui-btn layui-btn-xs" lay-event="FBA_productDetail_online">API货品</button>
    <button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_pack_all_notEdit_detail">装箱详情</button>
</script>

<script type="text/html" id="FBAdelivery_op_delivered_tpl">
    <permTag:perm funcCode="FBA_productDetail_canEdit">
    <button class="layui-btn layui-btn-xs" lay-event="FBA_productDetail_OA">货品详情</button>
    </permTag:perm>
    <button class="layui-btn layui-btn-xs" lay-event="FBA_printBox">打印箱子标签</button>
    <button class="layui-btn layui-btn-xs" lay-event="FBA_fullFreightNum">填入运单</button>
</script>

<script type="text/html" id="FBAdelivery_op_delete_tpl">
    <permTag:perm funcCode="FBA_productDetail_canEdit">
    <button class="layui-btn layui-btn-xs" lay-event="FBA_productDetail_OA">货品详情</button>
    </permTag:perm>
</script>

<script type="text/html" id="FBAdelivery_modifyTime">
    <div>{{Format(d.modifyTime,'yyyy-MM-dd hh:mm')}}</div>
</script>

<script type="text/html" id="FBAdelivery_timeAll_tpl">
    <div>创建:{{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</div>
    <div>修改:{{Format(d.modifyTime,'yyyy-MM-dd hh:mm')}}</div>
    <div>发货:{{Format(d.deliverTime,'yyyy-MM-dd hh:mm')}}</div>
</script>

<script type="text/html" id="FBAdelivery_cost_tpl">
<div><span class="secondary fl">商品：</span>{{d.totalCost || ''}}</div>
{{#if(d.logisticsFee != null) {}}
<div class="clearLeft"><span class="secondary fl">头程：</span>{{d.logisticsFee || ''}}</div>
{{#}}}
</script>

<script type="text/html" id="FBAdelivery_warningInfo">
    <div>{{d.shipmentStatus}}</div>
    {{# if(!d.addressId){ }}
    <span style="color:#F00;font-size:12px">非OA生成的货件(缺发货地址)</span>
    <button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_full_address">补充地址</button>
    {{# } }}
</script>

<script type="text/html" id="FBAdelivery_itemInfo">
    <div class="text_l"><span class="secondary fl">种类：</span>{{d.skuMulNumber}}</div>
    <div class="text_l"><span class="secondary fl">数量：</span>{{d.totalUnits}}</div>
    <div class="text_l"><span class="secondary fl">属性：</span>
        {{# if(d.logisticAttrStatisticsDtoList){}}
            {{# for (let i = 0; i < d.logisticAttrStatisticsDtoList.length; ++i) {}}
                <div class="text_l">{{d.logisticAttrStatisticsDtoList[i].logisticsAttr}}:{{d.logisticAttrStatisticsDtoList[i].count}}</div>
            {{# } }}
        {{# } }}
    </div>
    
</script>

<script type="text/html" id="FBAdelivery_suggest_logistics_type">
    <div class="secondary" title="销售头程物流方式">{{d.saleLogisticsTypeName|| ""}}</div>
    <div title="标签准备方">卖家</div>
    <div title="实际头程物流方式">{{d.preLogisticsTypeName|| ""}}</div>
</script>

<!-- 修改发货数量 -->
<script type="text/html" id="pop_FBA_modifyAmount">
    <div class="layui-form layui-form-item mg_50">
        <label class="layui-form-label">发货数量</label>
        <div class="layui-input-block">
            <input type="number" class="layui-input w_80" min="0" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
        </div>
    </div>
</script>

<!-- 货品详情 -->

<script type="text/html" id="pop_FBA_shipRelSkuDetailQuery">
    <div class="layui-card">
        <table class="layui-table" id="FBA_shipRelSkuDetailQueryTable" lay-filter="FBA_shipRelSkuDetailQueryTable"></table>
    </div>
</script>

<script type="text/html" id="pop_FBA_productDetail">
    <div>
        <div class="layui-col-lg12 layui-col-md12 layui-tab-card mb10">
            <div class="layui-tab layui-card">
                <ul class="layui-tab-title isCreateHidden">
                    <li class="layui-this">详情</li>
                    <li id="Fbadelivery_opLogPage">操作日志</li>
                </ul>
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show p20">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-form-item">
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <label class="layui-form-label">新增货品</label>
                                        <div class="layui-input-block">
                                            <input class="layui-input" id="pop_FBA_productDetail_querySellerSku" placeholder="输入店铺sku">
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <div class="layui-btn layui-btn-sm" id="pop_FBA_productDetail_queryBtn">查询</div>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-col-md12 layui-col-lg12">
                                        <div class="layui-btn layui-btn-sm" id="pop_FBA_productDetail_copyFnSku">复制所有FNSKU</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-card">
                            <table class="layui-table" id="FBAdelivery_ProdDetailTable" lay-filter="FBAdelivery_ProdDetailTable"></table>
                        </div>
                    </div>
                    <div class="layui-tab-item layui-show p20">
                        <div class="layui-card">
                            <table class="layui-table" id="FBAdelivery_shipLogTable" lay-filter="FBAdelivery_shipLogTable"></table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

</script>
<%--货品详情- 图片模板--%>
<script type="text/html" id="FBAdelivery_ProdDetailTable_img">
    <div><img src="{{d.picUrl}}" data-original="{{d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" width="60" height="60"></div>
</script>

<%--货品详情- 图片模板--%>
<script type="text/html" id="FBA_shipRelSkuDetailQueryTable_img">
    <div><img src="{{d.image}}" data-original="{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" width="60" height="60"></div>
</script>

<%--货品详情- 操作模板--%>
<script type="text/html" id="FBAdelivery_ProdDetailTableBar">
    <div>
        <div class="layui-btn layui-btn-sm layui-btn-danger" lay-event="deleteProd">删除</div>
    </div>
</script>
<%--货品详情- 包装备注模板--%>
<script type="text/html" id="FBAdelivery_ProdDetailTable_packDesc">
    {{# if (d.packDesc) {}}
    <div onmouseover="FBAdelivery_showPackDesc(this,{{d.LAY_TABLE_INDEX}})" onmouseleave="removeTip(this,500)">【包装备注】</div>
    {{#}}}
</script>
<script type="text/html" id="FBAdelivery_updatePackDesc_pop">
    <div class="layui-card" style="color: #000;">
        <div class="layui-card-body">
            <div id="FBAdelivery_packDescEdit">
            </div>
        </div>
    </div>
</script>
<script src="${ctx}/static/util/we.js"></script>
<!-- 模板文件 -->
<script type="text/html" id="pop_FBA_productDetail_tpl">
    {{ each data value i}}
    <div class="detail_item dis_flex_space">
        <div><img class="detail_img" src="{{value.picUrl}}" data-original="{{value.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"></div>
        <div class="detail_font">
            <div><span>SKU:</span>{{value.sellerSku}}</div>
            <div><span>ASIN:</span><a class="skyblue" target="_blank" href="{{value.asinSrc}}">{{value.asin||''}}</a></div>
            <div><span>FNSKU:</span>{{value.fnSku}}</div>
            <div><span>oa重量(g):</span>{{value.oaWeight||0}}*{{value.planQuality}}|{{(value.oaWeight||0)*value.planQuality}}</div>
            <div><span>成本(￥):</span>{{value.oaCost||0}}*{{value.planQuality}}|{{(value.oaCost||0)*value.planQuality}}</div>
        </div>
        <div>x <span class="red">{{value.planQuality}}</span></div>
    </div>
    {{ /each}}
</script>

<!-- 模板文件 -->
<script type="text/html" id="pop_FBA_productDetail_online_tpl">
    {{ each data value i}}
    <div class="detail_item dis_flex_space">
        <div><img class="detail_img" src="{{value.picUrl}}" data-original="{{value.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"></div>
        <div class="detail_font">
            <div><span>SKU:</span>{{value.sellerSku}}</div>
            <div><span>ASIN:</span><a class="skyblue" target="_blank" href="{{value.asinSrc}}">{{value.asin||''}}</a></div>
            <div><span>FNSKU:</span>{{value.fnSku}}</div>
            <div><span>实发:</span>{{value.actQuality}}</div>
        </div>
        <div>x <span class="red">{{value.quantityShipped}}</span></div>
    </div>
    {{ /each}}
</script>

<script type="text/html" id="pop_FBA_productDetail_canEdit_tpl">
    {{ each data value i}}
    <div class="detail_item dis_flex_space">
        <div class="disN idInfo">{{value.id||''}}</div>
        <div><img class="detail_img" src="{{value.picUrl||''}}" data-original="{{value.picUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
            <div>
                <permTag:perm funcCode="FBAdelivery_productDetail_canEdit_delete_button">
                    <button type="button" class="mt_5 layui-btn layui-btn-sm layui-btn-danger FBAdelivery_productDetail_canEdit_delete_button">删除</button>
                </permTag:perm>
            </div>
        </div>
        <div class="detail_font ml_5 w_400">
            <div class="dis_flex_space"><span>SKU:</span><input name="sellerSku" type="text" class="layui-input" value="{{value.sellerSku}}" disabled></div>
            <div><span>ASIN:</span><a class="skyblue" target="_blank" href="{{value.asinSrc||''}}">{{value.asin||''}}</a></div>
            <div><span>FNSKU:</span>{{value.fnSku||''}}</div>
            <div><span>实发:</span>{{value.actQuality||''}}</div>
        </div>
        <div class="dis_flex_around"><span style="line-height:32px">x</span><input name="planQuality" type="number" class="layui-input" value="{{value.planQuality||'1'}}" min="1" oninput="this.value = this.value.replace(/[^0-9]/g, '');"></div>
    </div>
    {{ /each}}
</script>

<!-- 装箱 -->
<script type="text/html" id="pop_FBA_topack">
    <div class="layui-form mg_50 dis_flex_space" id="FBAdelivery_cartonDiv">
        <div id="FBAdelivery_ex_im_div">
            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal"
                    id="FBAdelivery_excelImport">导入
            </button>
            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="FBAdelivery_excelExport">导出模板</button>
        </div>
        <div class="layui-form" id="FBAdelivery_setscroll_form">
            <div class="layui-input-block dis_flex_around">
                <div class="layui-form-label" style="padding:0px 0px 0px 5px;width:180px">
                    <select name="locateType">
                        <option value="fnSku">FNSKU</option>
                        <option value="prodSSku">子商品SKU</option>
                        <option value="sellerSku">店铺SKU</option>
                    </select>
                </div>
                <input type="text" name="locateValue" class="layui-input"/>
                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal"
                        id="FBAdelivery_setscroll">定位
                </button>
            </div>
        </div>

        <div class="layui-col-md1 layui-col-lg1">
            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="FBAdelivery_AddBoxBtn">新增箱子</button>
        </div>
        <div class="layui-col-md3 layui-col-lg3">
            <label class="layui-form-label" style="width:150px">箱子数量</label>
            <div class="layui-input-block dis_flex_around">
                <input id="FBA_confirmNumber_input" type="number" class="layui-input w_80" name="boxNum"
                       min="0" value="1" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="FBA_confirmNumber">确定</button>
            </div>
        </div>
    </div>
    <div class="mg_50 pack_layer">
        <table class="layui-table" lay-filter="FBAdelivery_table_packInfoTable" id="FBAdelivery_table_packInfoTable"></table>
    </div>
    <div class="mg_50">
        <table class="layui-table" lay-filter="FBAdelivery_table_boxInfoTable" id="FBAdelivery_table_boxInfoTable"></table>
    </div>
</script>

<!-- 打印货品标签 -->
<script type="text/html" id="pop_FBA_printProduct">
    <div class="mg_50">
        <table class="layui-table" lay-filter="FBAdelivery_table_printProductTable" id="FBAdelivery_table_printProductTable"></table>
    </div>
</script>

<!-- 标记发货-->
<script type="text/html" id="pop_FBA_markDeliery">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="pop_FBA_markDelieryForm" lay-filter="pop_FBA_markDelieryForm">
                <div class="layui-form-item">
                    <label class="layui-form-label">配送方式</label>
                   <div class="layui-input-block">
                       <input name="shippingMethod" lay-filter="FBA_markDeliery_shippingMethod" value="SP" type="radio" title="小包裹快递(SPD)" checked>
                       <input name="shippingMethod" lay-filter="FBA_markDeliery_shippingMethod" value="LTL" type="radio" title="汽运零担(LTL)">
                   </div>
                </div>
                <%--<div class="layui-form-item">--%>
                    <%--<label class="layui-form-label" style="width:150px">配送模式</label>--%>
                    <%--<div class="layui-input-block">--%>
                        <%--<select name="">--%>
                            <%--<option value="">空运</option>--%>
                            <%--<option value="">海运</option>--%>
                            <%--<option value="">陆运</option>--%>
                        <%--</select>--%>
                    <%--</div>--%>
                <%--</div>--%>
                <div class="layui-form-item">
                    <label class="layui-form-label">配送商</label>
                    <div class="layui-input-block">
                        <select name="carrierName">
                            <option value="OTHER">其他</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item disN" id="FBAdelivery_proNumberDiv">
                    <label class="layui-form-label">托唛</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="proNumber" maxlength="10">
                    </div>
                </div>
            </form>
        </div>
    </div>

</script>

<script id="FBAdelivery_logisticsAttrList" type="text/html">
    {{# if(d.logisticAttrStatisticsDtoList){}}
        {{# for (let i = 0; i < d.logisticAttrStatisticsDtoList.length; ++i) {}}
            <div class="text_l">{{d.logisticAttrStatisticsDtoList[i].logisticsAttr}}:{{d.logisticAttrStatisticsDtoList[i].count}}</div>
        {{# } }}
    {{# } }}
</script>

<!-- 生成货件 -->
<script type="text/html" id="pop_FBA_createGoods">
    <div calss="layui-form-item">
        <form class="layui-form mg_50" id="FBAdelivery_layeracreateForm" lay-filter="FBAdelivery_layeracreateForm">
            <div class="layui-col-lg4 layui-col-md4" notNull>
                <label class="layui-form-label">发货地址</label>
                <div class="layui-input-block">
                    <select id="deliveryAddress" name="addressId" required lay-verify="required" lay-search>
                        <option value="6" >北美38</option>
                        <option value="283" >自注册002US</option>
                        <option value="14" data-trackingnoprefix="undefined">北美23</option>
                        <option value="11" data-trackingnoprefix="undefined">北美14</option>
                        <option value="7" data-trackingnoprefix="undefined">北美19</option>
                    </select>
                </div>
            </div>
            <div class="layui-col-lg4 layui-col-md4" notNull>
            <label class="layui-form-label">销售头程</label>
            <div class="layui-input-block">
                <%--<select  name="preLogisticsTypeId" class="layui-select" lay-search>--%>
                <%--</select>--%>
                <select  name="saleLogisticTypeId" class="layui-select" lay-search>
                </select>
            </div>
            </div>
        </form>
    </div>
    <div class="mg_50 create-picker">
        <table class="layui-table" lay-filter="FBAdelivery_table_createGoodsTable" id="FBAdelivery_table_createGoodsTable"></table>
    </div>
</script>

<!-- 提交货件 -->
<script type="text/html" id="pop_FBA_submitGoods">
    <div class="disFCenter mg_50">
        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="FBAdelivery_markDivideWarehouse">设置物流标签</button>
        <button type="button" class="layui-btn layui-btn-sm" id="FBAdelivery_copyAllFnSku">复制所有FNSKU</button>
    </div>
    <div class="mg_50">
        <table class="layui-table" lay-filter="FBAdelivery_table_submitGoodsTable" id="FBAdelivery_table_submitGoodsTable"></table>
    </div>
</script>

<!-- 推荐-->
<script type="text/html" id="FBAdelivery_recommPackTpl">
    <div class="mg_50">
        <table class="layui-table" lay-filter="FBAdelivery_table_recommPackTable" id="FBAdelivery_table_recommPackTable"></table>
    </div>
</script>

<!-- 填入运单弹框 -->
<script type="text/html" id="FBA_fullFreightNum_edit_tpl">
    <table class="layui-table" lay-filter="FBAdelivery_table_freightTable" id="FBAdelivery_table_freightTable"></table>
</script>

<!-- 补充 -->
<script type="text/html" id="FBAdelivery_full_address_tpl">
    <form class="layui-form mg_50" id="FBAdelivery_full_address_form" lay-filter="FBAdelivery_full_address_form">
        <div class="layui-col-lg4 layui-col-md4">
            <label class="layui-form-label">发货地址</label>
            <input type="text" class="disN" name="id" value="">
            <div class="layui-input-block">
                <select name="addressId" id="deliveryAddress_toFull" required lay-verify="required" lay-search></select>
            </div>
        </div>
        <button type="button" class="layui-btn disN" lay-submit=""
                id="FBAdelivery_full_address_form_submit" lay-filter="FBAdelivery_full_address_form_submit">提交事件
        </button>
    </form>
</script>

<script type="text/html" id="FBAdelivery_fix_remove_expirDate_tpl">
    <div class="p20 secondary">
        <p >tips:</p>
        <p>   店铺SKU和shipmentId选填一个。填了shipmentId将忽略店铺SKU。 将会对该货件的所有产品添加过期时间 </p>
    </div>

    <form class="layui-form mg_50" id="FBAdelivery_fix_remove_expirDate_form" lay-filter="FBAdelivery_fix_remove_expirDate_form">
        <div class="layui-col-lg4 layui-col-md4">
            <label class="layui-form-label">店铺SKU</label>
            <div class="layui-input-block">
                <input type="text" name="sellerSku" class="layui-input" />
            </div>
        </div>
        <div class="layui-col-lg4 layui-col-md4">
            <label class="layui-form-label">shipmentId</label>
            <div class="layui-input-block">
                <input type="text" name="shipmentId" class="layui-input" />
            </div>
        </div>
        <button type="button" class="layui-btn disN" lay-submit=""
                id="FBAdelivery_fix_remove_expirDate_form_submit" lay-filter="FBAdelivery_fix_remove_expirDate_form_submit">提交事件
        </button>
    </form>
</script>

<script type="text/html" id="FBAdelivery_pur_setLogistics_tpl">
    <form class="layui-form mg_50" id="FBAdelivery_pur_setLogistics_tpl_form" lay-filter="FBAdelivery_pur_setLogistics_tpl_form">
        <div calss="layui-form-item" notNull>
            <label class="layui-form-label">物流方式</label>
            <div class="layui-input-block">
                <select name="preLogisticsTypeId" class="layui-select" lay-search>
                </select>
            </div>
        </div>
        <button type="button" class="layui-btn disN" lay-submit=""
                id="FBAdelivery_pur_setLogistics_tpl_form_submit" lay-filter="FBAdelivery_pur_setLogistics_tpl_form_submit">提交事件
        </button>
    </form>
</script>


<script type="text/html" id="FBAdelivery_carton_setLogistics_tpl">
    <form class="layui-form mg_50" id="FBAdelivery_carton_setLogistics_tpl_form" lay-filter="FBAdelivery_carton_setLogistics_tpl_form">
        <div calss="layui-form-item">
            <label class="layui-form-label">物流方式</label>
            <div class="layui-input-block">
                <select   name="logisticsTypeId" class="layui-select" lay-verify="required" lay-search>

                </select>
            </div>
        </div>
    </form>
</script>

<script type="text/html" id="FBAdelivery_purStatus">
    {{# if(d.purStatus == 0){ }}
    <span>待处理</span>
    {{# }else if(d.purStatus == 1){ }}
    <span>待采购</span>
    {{# }else if(d.purStatus == 2){ }}
    <span>待派单</span>
    {{# }else if(d.purStatus == 3){ }}
    <span>不采购</span>
    {{# }else if(d.purStatus == 5){ }}
    <span>已派单</span>
    {{# } }}
</script>

<script type="text/html" id="FBAdelivery_oa_deal_statusTpl">
    {{# if(d.oaShipStatus == 0){ }}
    <span>初始化</span>
    {{# }else if(d.oaShipStatus == 1){ }}
    <span>待装箱</span>
    {{# }else if(d.oaShipStatus == 2){ }}
    <span>待发货</span>
    {{# }else if(d.oaShipStatus == 3){ }}
    <span>已发货</span>
    {{# }else if(d.oaShipStatus == 4){ }}
    <span>已取消</span>
    {{# } }}
</script>

<script type="text/html" id="FBAdelivery_mix_statusTpl">
    <div class="text_l">{{d.shipmentStatus}}<span></span></div>
    <div class="text_l">
        {{# if(d.oaShipStatus == 0){ }}
        <span>初始化</span>
        {{# }else if(d.oaShipStatus == 1){ }}
        <span>待装箱</span>
        {{# }else if(d.oaShipStatus == 2){ }}
        <span>待发货</span>
        {{# }else if(d.oaShipStatus == 3){ }}
        <span>已发货</span>
        {{# }else if(d.oaShipStatus == 4){ }}
        <span>已取消</span>
        {{# } }}
    </div>
</script>

<script type="text/html" id="FBAdelivery_packagedStatus_tpl">
    {{# if(d.packagedStatus == 0){ }}
    <span>未提交</span>
    {{# }else if(d.packagedStatus == 1){ }}
    <span>已提交</span>
    {{# } }}
</script>

<script type="text/html" id="FBAdelivery_whBoxPurStatus_tpl">
    {{# if(d.whBoxPurStatus == 0){ }}
    <span>未分配</span>
    {{# }else if(d.whBoxPurStatus == 1){ }}
    <span>不可取</span>
    {{# }else if(d.whBoxPurStatus == 2){ }}
    <span>可取</span>
    {{# }else if(d.whBoxPurStatus == 3){ }}
    <span>已取</span>
    {{# } }}
</script>

<script type="text/html" id="pop_FBA_lazyStockCheck">
    <div style="margin: 20px">
        <div class="fr">
            <permTag:perm funcCode="FBAdelivery_generateOrder_btn">
                <button class="layui-btn layui-btn-sm" id="generate_amazonOtherStorage">生成调拨单</button>
            </permTag:perm>
            <%--<button class="layui-btn layui-btn-sm disN" id="FBAdelivery_PurToYiwu">采购到义乌仓</button>--%>
            <permTag:perm funcCode="FBAdelivery_purchaseFba_btn">
                <button class="layui-btn layui-btn-sm disN" id="FBAdelivery_PurToFBA">采购到FBA仓</button>
            </permTag:perm>
        </div>
        <div>
            <table class="layui-table" lay-filter="lazyStockTable" id="lazyStockTable"></table>
        </div>
    </div>
</script>

<script type="text/html" id="FBAdelivery_createDHL_tpl">
    <form class="layui-form mg_50" id="FBAdelivery_createDHL_form" lay-filter="FBAdelivery_createDHL_form">

        <div class="layui-form-item">
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">物流方式</label>
                <div class="layui-input-block">
                    <select class="layui-select" name="logisticsTypeId" lay-verify="required">

                    </select>
                </div>
            </div>
        </div>



        <div class="layui-form-item">
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">提供内容和数量*</label>
                <div class="layui-input-block">
                    <textarea type="text" class="layui-textarea" lay-verify="required" name="Description"> </textarea>
                </div>
            </div>
        </div>


        <label class="layui-form-label">发票明细</label>
        <div class="layui-form-item">
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">英文品名*</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" lay-verify="required" name="ItemDescription"/>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">数量</label>
                <div class="layui-input-block dis_flex">
                    <input type="text"class="layui-input" lay-verify="required"  name="Quantity"/>
                    <select class="layui-select" name="QuantityUnitOfMeasurement" lay-verify="required" style="width: 80px">
                        <option value="">请选择</option>
                        <option value="Pieces">个</option><option value="Number">架</option><option value="Set">套</option><option value="Number">只</option><option value="Number">头</option><option value="Pieces">张</option><option value="Pieces">件</option><option value="Number">支</option><option value="Pieces">根</option><option value="Number">卷</option><option value="Set">副</option><option value="Pieces">片</option><option value="Set">组</option><option value="Yards">码</option><option value="Milliliters">毫升</option><option value="Square Yards">平方码</option><option value="Set">份</option><option value="Pairs">双</option><option value="Pairs">对</option><option value="Number">株</option><option value="Meters">米</option><option value="Cubic Meters">立方米</option><option value="Kilograms">千克</option><option value="Grams">克</option><option value="Pounds">磅</option><option value="Ounces">盎司</option><option value="Liters">升</option><option value="Cubic Feet">立方英尺</option><option value="Square Feet">平方英尺</option><option value="Boxes">箱</option><option value="Sachets">包</option><option value="Dozen">打</option><option value="Number">匹</option><option value="Number">册</option><option value="Number">本</option><option value="Set">捆</option><option value="Sachets">袋</option><option value="Boxes">盒</option><option value="Pieces">瓶</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">单价*</label>
                <div class="layui-input-block dis_flex">
                    <input type="number" class="layui-input" lay-verify="required" name="UnitPrice"/>
                    <select class="layui-select" name="Currency" lay-verify="required" style="width: 80px" lay-search>
                        <option value="">请选择</option>
                        <option value="USD">USD</option><option value="AED">AED</option><option value="AFN">AFN</option><option value="AMD">AMD</option><option value="ANG">ANG</option><option value="AOA">AOA</option><option value="ARS">ARS</option><option value="AUD">AUD</option><option value="AWG">AWG</option><option value="AZM">AZM</option><option value="BAM">BAM</option><option value="BBD">BBD</option><option value="BDT">BDT</option><option value="BGN">BGN</option><option value="BHD">BHD</option><option value="BIF">BIF</option><option value="BMD">BMD</option><option value="BND">BND</option><option value="BOB">BOB</option><option value="BRL">BRL</option><option value="BSD">BSD</option><option value="BTN">BTN</option><option value="BWP">BWP</option><option value="BYR">BYR</option><option value="BZD">BZD</option><option value="CAD">CAD</option><option value="CDF">CDF</option><option value="CHF">CHF</option><option value="CLP">CLP</option><option value="CNY">CNY</option><option value="COP">COP</option><option value="CRC">CRC</option><option value="CUP">CUP</option><option value="CVE">CVE</option><option value="CZK">CZK</option><option value="DJF">DJF</option><option value="DKK">DKK</option><option value="DOP">DOP</option><option value="DZD">DZD</option><option value="EEK">EEK</option><option value="EGP">EGP</option><option value="ERN">ERN</option><option value="ETB">ETB</option><option value="EUR">EUR</option><option value="FJD">FJD</option><option value="FKP">FKP</option><option value="GBP">GBP</option><option value="GEL">GEL</option><option value="GHS">GHS</option><option value="GIP">GIP</option><option value="GMD">GMD</option><option value="GNF">GNF</option><option value="GTQ">GTQ</option><option value="GWP">GWP</option><option value="GYD">GYD</option><option value="HKD">HKD</option><option value="HNL">HNL</option><option value="HRK">HRK</option><option value="HTG">HTG</option><option value="HUF">HUF</option><option value="IDR">IDR</option><option value="ILS">ILS</option><option value="INR">INR</option><option value="IQD">IQD</option><option value="IRR">IRR</option><option value="ISK">ISK</option><option value="JMD">JMD</option><option value="JOD">JOD</option><option value="JPY">JPY</option><option value="KES">KES</option><option value="KGS">KGS</option><option value="KHR">KHR</option><option value="KMF">KMF</option><option value="KPW">KPW</option><option value="KRW">KRW</option><option value="KWD">KWD</option><option value="KYD">KYD</option><option value="KZT">KZT</option><option value="LAK">LAK</option><option value="LKR">LKR</option><option value="LRD">LRD</option><option value="LSL">LSL</option><option value="LTL">LTL</option><option value="LVL">LVL</option><option value="LYD">LYD</option><option value="MAD">MAD</option><option value="MDL">MDL</option><option value="MGA">MGA</option><option value="MKD">MKD</option><option value="MNT">MNT</option><option value="MOP">MOP</option><option value="MRO">MRO</option><option value="MUR">MUR</option><option value="MVR">MVR</option><option value="MWK">MWK</option><option value="MXN">MXN</option><option value="MYR">MYR</option><option value="MZN">MZN</option><option value="NGN">NGN</option><option value="NIO">NIO</option><option value="NOK">NOK</option><option value="NPR">NPR</option><option value="NZD">NZD</option><option value="OMR">OMR</option><option value="PAB">PAB</option><option value="PEN">PEN</option><option value="PGK">PGK</option><option value="PHP">PHP</option><option value="PKR">PKR</option><option value="PLN">PLN</option><option value="PYG">PYG</option><option value="QAR">QAR</option><option value="RON">RON</option><option value="RSD">RSD</option><option value="RUB">RUB</option><option value="RWF">RWF</option><option value="SAR">SAR</option><option value="SBD">SBD</option><option value="SCR">SCR</option><option value="SDG">SDG</option><option value="SEK">SEK</option><option value="SGD">SGD</option><option value="SIS">SIS</option><option value="SLL">SLL</option><option value="SOS">SOS</option><option value="SRD">SRD</option><option value="STD">STD</option><option value="SYP">SYP</option><option value="SZL">SZL</option><option value="THB">THB</option><option value="TJS">TJS</option><option value="TMM">TMM</option><option value="TND">TND</option><option value="TOP">TOP</option><option value="TRY">TRY</option><option value="TTD">TTD</option><option value="TWD">TWD</option><option value="TZS">TZS</option><option value="UAH">UAH</option><option value="UGX">UGX</option><option value="UYU">UYU</option><option value="UZS">UZS</option><option value="VEF">VEF</option><option value="VND">VND</option><option value="VUV">VUV</option><option value="WST">WST</option><option value="XAF">XAF</option><option value="XCD">XCD</option><option value="XOF">XOF</option><option value="XPF">XPF</option><option value="YER">YER</option><option value="ZAR">ZAR</option><option value="ZMK">ZMK</option><option value="ZWD">ZWD</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">净重(kg)*</label>
                <div class="layui-input-block">
                    <input type="number" class="layui-input" lay-verify="required" name="NetWeight"/>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">毛重(kg)*</label>
                <div class="layui-input-block">
                    <input type="number" class="layui-input"  lay-verify="required" name="GrossWeight"/>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">HS CODE</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="CommodityCode"/>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-col-lg4 layui-col-md4">
                <label class="layui-form-label">产地*</label>
                <div class="layui-input-block">
                    <select  class="layui-select" lay-verify="required" name="ManufacturingCountryCode">
                        <option value="">请选择</option>
                        <option value="CN">China(中国)</option>
                    </select>
                </div>
            </div>
        </div>

        <button type="button" class="layui-btn disN" lay-submit=""
                id="FBAdelivery_createDHL_form_submit" lay-filter="FBAdelivery_createDHL_form_submit">提交事件
        </button>
    </form>
</script>

<!--推荐装箱表--操作-->
<script type="text/html" id="shipForRecommTable_op">
    <permTag:perm funcCode="FBA_productDetail_canEdit">
        <button class="layui-btn layui-btn-xs" lay-event="FBA_productDetail_canEdit">货品详情</button>
    </permTag:perm>
    <button class="layui-btn layui-btn-xs" lay-event="FBA_pack_detail">装箱详情</button>
    <button class="layui-btn layui-btn-xs" lay-event="FBA_fullFreightNum">填入运单</button>
</script>

<!--已发货--驳回-->
<script type="text/html" id="FBAdelivery_backTo_tpl">
    <form class="layui-form mg_50" id="FBAdelivery_backTo_tpl_form" lay-filter="FBAdelivery_backTo_tpl_form">
        <input type="hidden" name="pShipId">
        <div calss="layui-form-item">
            <label class="layui-form-label">返回状态至</label>
            <div class="layui-input-block">
                <select  name="backToStatus" class="layui-select" lay-verify="required" lay-search>
                    <option value="">请选择</option>
                    <option value="1">待发货</option>
                    <option value="2">待派单</option>
                </select>
            </div>
        </div>
        <button type="button" class="layui-btn disN" lay-submit=""
                id="FBAdelivery_backTo_tpl_form_submit" lay-filter="FBAdelivery_backTo_tpl_form_submit">提交事件
        </button>
    </form>
</script>

<!-- 修改发货数量 -->

<!-- 表格渲染模板 -->
<!-- 表格渲染模板 -->
<script src="${ctx}/static/js/publishs/amazon/FBAdelivery.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/util/enum.js?v=${ver}"></script>

<script type="text/html" id="FBAdelivery_matchInfo_prodInfo">
    <div><span class="secondary">sku:</span>{{d.prodSSku}}</div>
    <div>
        {{# if(d.logisAttrList){ }}
        {{# let logistAttrArr = d.logisAttrList.split(',')}}
        {{# for (let i = 0; i < logistAttrArr.length; ++i) { let logis = logistAttrArr[i];let alia=getLogisAttrAlia(logis)}}
        {{#  if(alia && alia !== '普'){ }}
        <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logis}}">{{alia}}</span>
        {{# } }}
        {{# }}}
        {{# } }}
    </div>
</script>

<script type="text/html" id="FBAdelivery_matchInfo_FbaGoodsInfo">
    <div><span class="secondary">fnSku:</span>{{d.fnSku}}</div>
    <div><span class="secondary">数量:</span>{{d.planQuality}}</div>
    {{#if (d.actQuality) {}}
    <div><span class="secondary">实发:</span>{{d.actQuality}}</div>
    {{#}}}
</script>
<script type="text/html" id="FBAdelivery_matchInfo_belongsComb">
    {{# if (d.isCombination) {}}
    <div>是</div>
    {{#}}}
    {{# if (!d.isCombination) {}}
    <div>否</div>
    {{#}}}
</script>

<script type="text/html" id="FBAdelivery_matchInfo_opTime">
    {{# if (d.singleMatchTime) {}}
    <div><span class="secondary">包装:</span>{{Format(d.singleMatchTime,'yyyy-MM-dd hh:mm')}}</div>
    {{#}}}
    {{# if (d.singlePackTime) {}}
    <div><span class="secondary">存箱:</span>{{Format(d.singlePackTime,'yyyy-MM-dd hh:mm')}}</div>
    {{#}}}
    {{# if (d.multiPutTime) {}}
    <div><span class="secondary">投篮:</span>{{Format(d.multiPutTime,'yyyy-MM-dd hh:mm')}}</div>
    {{#}}}
    {{# if (d.multiMatchTime) {}}
    <div><span class="secondary">包装:</span>{{Format(d.multiMatchTime,'yyyy-MM-dd hh:mm')}}</div>
    {{#}}}
    {{# if (d.multiPackTime) {}}
    <div><span class="secondary">存箱:</span>{{Format(d.multiPackTime,'yyyy-MM-dd hh:mm')}}</div>
    {{#}}}
    {{# if (d.takeOutTime) {}}
    <div><span class="secondary">取箱:</span>{{Format(d.takeOutTime,'yyyy-MM-dd hh:mm')}}</div>
    {{#}}}
</script>

<script type="text/html" id="FBAdelivery_matchInfo_operator">
    {{# if (d.singleMatcher) {}}
    <div><span class="secondary">包装:</span>{{d.singleMatcher}}</div>
    {{#}}}
    {{# if (d.singlePacker) {}}
    <div><span class="secondary">存箱:</span>{{d.singlePacker}}</div>
    {{#}}}
    {{# if (d.multiPuter) {}}
    <div><span class="secondary">投篮:</span>{{d.multiPuter}}</div>
    {{#}}}
    {{# if (d.multiMatcher) {}}
    <div><span class="secondary">包装:</span>{{d.multiMatcher}}</div>
    {{#}}}
    {{# if (d.multiPacker) {}}
    <div><span class="secondary">存箱:</span>{{d.multiPacker}}</div>
    {{#}}}
    {{# if (d.takeOuter) {}}
    <div><span class="secondary">取箱:</span>{{d.takeOuter}}</div>
    {{#}}}
</script>

<script type="text/html" id="FBAdelivery_matchInfo_shipStatus">
    {{# if (d.oaShipStatus == 0) {}}
    初始
    {{#}}}
    {{# if (d.oaShipStatus == 1) {}}
    待装箱
    {{#}}}
    {{# if (d.oaShipStatus == 2) {}}
    待发货
    {{#}}}
    {{# if (d.oaShipStatus == 3) {}}
    已发货
    {{#}}}
    {{# if (d.oaShipStatus == 4) {}}
    已取消
    {{#}}}
</script>

<script type="text/html" id="FBAdelivery_matchInfo_image">
    {{#  if(typeof(d.psiImage) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.psiImage }}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" onclick="toSetImg(this)"  title="点击可设置图片"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()" onclick="toSetImg(this)" title="点击可设置图片"/>
    {{# } }}
</script>

<script type="text/html" id="FBAdelivery_matchInfo_bar">
    <div>
        <button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_op_printFnSku">打印货品标签</button>
    </div>
    <%--{{# if(d.belongsCombination){ }}--%>
    <%--<div>--%>
        <%--<button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_op_printProdSSku">打印SKU标签</button>--%>
    <%--</div>--%>
    <%--<div>--%>
        <%--<button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_op_printOnlyBox">打印篮号标签</button>--%>
    <%--</div>--%>
    <%--<div>--%>
        <%--<button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_op_printPutInLabel">打印投篮标签</button>--%>
    <%--</div>--%>
    <%--{{# }}}--%>
    {{# if (d.actQuality) {}}
    <permTag:perm funcCode="FBAdelivery_op_updateActQuality">
        <div>
            <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBAdelivery_op_updateActQuality">修改包装数量</button>
        </div>
    </permTag:perm>
    <permTag:perm funcCode="FBAdelivery_op_cancelMatch">
        <div>
            <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBAdelivery_op_cancelMatch">取消包装</button>
        </div>
    </permTag:perm>
    {{#}}}
</script>

<script type="text/html" id="FBAdelivery_printFnSkuAmountPop">
    <div class="p20">
        <div class="layui-col-lg6 layui-col-md6">
            <label class="layui-form-label">数量</label>
            <div class="layui-input-block">
                <input class="layui-input" id="FBAdelivery_printFnSkuAmount">
            </div>
        </div>
    </div>
</script>


<script type="text/html" id="FBAdelivery_modifyMatchNumPop">
    <div class="p20">
        <div class="layui-col-lg6 layui-col-md6">
            <label class="layui-form-label">包装数量</label>
            <div class="layui-input-block">
                <input class="layui-input" id="FBAdelivery_MatchNum">
            </div>
        </div>
    </div>
</script>


<script type="text/html" id="FBAdelivery_exportSSkuPop">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="FBAdelivery_selectAll_exportySSku"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="component-form-group" id="FBAdelivery_exportSSkuForm">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">商品信息</legend>
                        </fieldset>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" title="商品sku" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="商品数量" title="商品数量" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="业绩归属人" title="开发专员" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">货件信息</legend>
                        </fieldset>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="货件编号" title="货件编号" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="OA货件状态" title="OA货件状态" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="亚马逊货件状态" title="亚马逊货件状态" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="店铺" title="店铺" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="站点" title="站点" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="销售员" title="销售员" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="货件商品数量" title="货件商品数量" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="总重量(kg)" title="总重量(kg)" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="总商品成本(￥)" title="总商品成本(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="建议物流" title="建议物流" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="创建时间" title="创建时间" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="创建人" title="创建人" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">货品信息</legend>
                        </fieldset>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="fnSku" title="fnSku" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="asin" title="asin" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="sellerSku" title="sellerSku" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="货品数量" title="货品数量" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="是否组合品" title="是否组合品" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">操作信息</legend>
                        </fieldset>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="投篮时间" title="投篮时间" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="投篮人" title="投篮人" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="包装时间" title="包装时间" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="包装人" title="包装人" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="存箱时间" title="存箱时间" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="存箱人" title="存箱人" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="取箱时间" title="取箱时间" lay-skin="primary"></div>
                        <div class="fieldBox_FBAdeliverty"><input type="checkbox" name="baseField" value="取箱人" title="取箱人" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="FBAdelivery_shipmentIdTemp">
    <div class="secondary">
        「{{#if (d.matchStatus === -1){}}
            待配货
        {{# } }}
        {{#if (d.matchStatus === 0){}}
            待包装
        {{# } }}
        {{#if (d.matchStatus === 1){}}
            部分包装
        {{# } }}
        {{#if (d.matchStatus === 2){}}
            已包装
        {{# } }}」
    </div>
    <div>{{d.shipmentId}}</div>
    <div>状态：{{d.shipmentStatus}}</div>
    {{# if(!d.addressId){ }}
        <span style="color:#F00;font-size:12px">非OA生成的货件(缺发货地址)</span>
        <button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_full_address">补充地址</button>
    {{# } }}
</script>

<script type="text/html" id="FBAdelivery_shipmentTemp">
    <div>{{d.shipmentId}}</div>
    <div>状态：{{d.shipmentStatus}}</div>
    {{# if(!d.addressId){ }}
        <span style="color:#F00;font-size:12px">非OA生成的货件(缺发货地址)</span>
        <button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_full_address">补充地址</button>
    {{# } }}
</script>


<script type="text/html" id="FBAdelivery_shipmentIdTemplet">
    <div>{{d.shipmentId}}</div>
    <div >总重量：{{d.totalWeight}} kg</div>
</script>

<script type="text/html" id="FBAdelivery_deliveryPlan_ProdSkuTpl">
    <div class="fRed">{{getDevTypeName(d.devType)}}</div>
    <div>{{d.prodSSku || '未映射'}}</div>
    <div>{{d.bizzOwner ? ('开发:' + d.bizzOwner) : ''}}</div>
    <div class="pointHand" title="创建时间">{{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</div>
    {{#  if(d.logisAttrList!=undefined && d.logisAttrList!=''){ }}
    {{# var logisAttrArr = d.logisAttrList.split(',')}}
    {{# var alia}}
    {{# for (var i = 0; i < logisAttrArr.length; ++i) { }}
    {{# alia = getLogisAttrAlia(logisAttrArr[i])}}
    {{#  if(alia && alia != '普'){ }}
    <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logisAttrArr[i]}}">{{alia}}</span>
    {{#}}}
    {{#}}}
    {{#  } }}
</script>

<script type="text/html" id="FBAdelivery_exportByTemplatePop">
    <div class="p20">
        <table class="layui-table" lay-filter="FBAdelivery_exportTemplateTable" id="FBAdelivery_exportTemplateTable"></table>
    </div>
</script>

<script type="text/html" id="FBAdelivery_plan_sameAsinSalesSiteData">
    <div class="alignLeft">
        <div><span class="secondary">oa建议:</span>{{d.statisticInfo && d.statisticInfo.allOaSuggestSale != null ? d.statisticInfo.allOaSuggestSale : ''}}</div>
        <div><span class="secondary">7日销量:</span>{{d.statisticInfo &&d.statisticInfo.sevenSales != null ?  d.statisticInfo.sevenSales :''}}</div>
        <div><span class="secondary">7日广告费:</span>{{d.statisticInfo && d.statisticInfo.adCostSeven != null ? d.statisticInfo.adCostSeven :''}}</div>
    </div>
</script>


<script type="text/html" id="FBAdelivery_plan_weight_tpl">
    <div class="alignLeft">
        {{# if (d.prodSInfo && d.prodSInfo.id) {}}
        <div><span class="secondary">实重:</span>{{((d.prodSInfo.packWeight + d.prodSInfo.suttleWeight)*d.planQuality/1000).toFixed(2)}}</div>
        <div><span class="secondary">抛重:</span>{{d.prodSInfo.outerBoxLength ? ((d.prodSInfo.outerBoxLength * d.prodSInfo.outerBoxHeight * d.prodSInfo.outerBoxWidth *d.planQuality/6000).toFixed(2)) : 0}}</div>
        <div title="抛重/实重"><span class="secondary">抛重比:</span>{{d.prodSInfo.suttleWeight ?  ((d.prodSInfo.outerBoxLength * d.prodSInfo.outerBoxHeight *d.prodSInfo.outerBoxWidth /6) / (d.prodSInfo.packWeight + d.prodSInfo.suttleWeight)).toFixed(2) : 0}}</div>
        {{# } }}
    </div>
</script>

<script type="text/html" id="FBAdelivery_setPlanLabelPop">
    <div class="p20">
        <form class="layui-form" id="FBAdelivery_setPlanLabelForm" lay-filter="FBAdelivery_setPlanLabelForm">
            <div id="FBAdelivery_setPlanLabelContains">

            </div>
        </form>
    </div>
</script>

<%@ include file="/WEB-INF/view/jsp/publishs/Amazon/component/salesBehavior.jsp"%>
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>