<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>铺货发货需求</title>
            <style>
                .batchNoForm {
                    display: none;
                }
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

                #FBAdistribute_page {
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
                #shipmentIdOption {
                    display: none;
                }
                .type_tag {
                    height: 20px;
                    font-size: 12px;
                    line-height: 20px;
                    padding: 2px 5px;
                    color: #ffffff;
                    border-radius: 4px;
                }
                .blue_tag {
                    background-color: rgb(30, 149, 255);
                }
                .red_tag {
                    background-color: rgb(255, 87, 34);
                }
                .grey_tag {
                    background-color: rgb(153, 153, 153);
                }
            </style>
            <div class="layui-fluid" id="LAY-FBAdistribute">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="FBAdistributeForm" lay-filter="FBAdistributeForm">
                                    <div class="layui-form-item layui-row">
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select name="orgId"  id="FBAdistribute_orgTree" lay-filter="FBAdistribute_orgTree" class="orgs_hp_custom" lay-search></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">销售员</label>
                                            <div class="layui-input-block">
                                                <select name="salesPersonId" id="FBAdistribute_userList" lay-filter="FBAdistribute_userList" class="users_hp_custom" data-rolelist="amazon专员" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">FBA销售员</label>
                                            <div class="layui-input-block">
                                                <select 
                                                    name="skuSalespersonIdList"
                                                    lay-filter="FBAdistributeForm_fbaUserList"
                                                    xm-select="FBAdistributeForm_fbaUserList" 
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
                                                <select name="salesSite" id="FBAdistribute_amazonSite" lay-search>
                                                </select>
                                        </div>

                                        <div class="layui-col-lg1 layui-col-md1 planSearchField">
                                            <select name="planLabel"  id="FBAdistribute_planLabel" lay-filter='FBAdistribute_planLabel' xm-select="FBAdistribute_planLabel" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
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
                                                    <!-- <option value="shipmentIdStr">货件编号</option> -->
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" name="sku" class="layui-input" placeholder="多个使用逗号分隔">
                                            </div>
                                        </div>

                                        <div class="layui-col-lg2 layui-col-md2">
                                            <div class="layui-form-label" style="padding:0px 0px 0px 5px">
                                                <select name="timeType">
                                                    <option value="创建时间">创建时间</option>
                                                    <option value="修改时间">修改时间</option>
                                                    <!-- <option value="发货时间">发货时间</option> -->
                                                </select>
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="time" id="FBAdistribute_Form_time">
                                            </div>
                                        </div>
                                        <!-- <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">发货物流</label>
                                            <div class="layui-input-block">
                                                <select name="logisticsTypeId" lay-search>
                                                </select>
                                            </div>
                                        </div> -->
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">创建人</label>
                                            <div class="layui-input-block">
                                                <input class="layui-input" name="creator">
                                            </div>
                                        </div>

                                        <div class="layui-col-lg2 layui-col-md2 planSearchField" title="（义乌仓）可用数量 ➖ 计划发货数量 ≥ 该值" style="display: flex;">
                                            <label class="layui-form-label" style="width: 100px;">可用计划差<i class="layui-icon layui-icon-about"></i></label>
                                            <div class="layui-input-block" style="flex: 1;margin-left: 0">
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
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">在售状态</label>
                                            <div class="layui-input-block">
                                                <select name="isOnSale" lay-search>
                                                    <option value="">请选择</option>
                                                    <option value="true">在售</option>
                                                    <option value="false">停售</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">是否组合品</label>
                                            <div class="layui-input-block">
                                                <select name="isCombination" lay-search>
                                                    <option value="">请选择</option>
                                                    <option value="true">是</option>
                                                    <option value="false">否</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">发货类型</label>
                                            <div class="layui-input-block">
                                                <select name="shippingTypeList" lay-search
                                                    xm-select="shippingType" 
                                                    xm-select-search 
                                                    xm-select-search-type="dl" 
                                                    xm-select-skin="normal">
                                                        <option value="">请选择</option>
                                                        <option value="1">空运</option>
                                                        <option value="2">海运</option>
                                                        <option value="0">未设置</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 selectable batchNoForm disN">
                                            <label class="layui-form-label">批次号</label>
                                              <div style="display:flex;">
                                                  <select name="batchNo" lay-search> </select>
                                                  <i style="margin-top:5px;" lay-tips="点击刷新批次号" class="layui-icon layui-icon-refresh updateBatchNo"></i>
                                              </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2 selectable ifCreateShipment disN">
                                            <label class="layui-form-label"></label>
                                            <input type="checkbox" name="ifCreateShipment" title="未生成货件" lay-skin="primary" id="FBAdistribute_ifCreateShipment">
                                        </div>

                                        <div class="layui-col-lg2 layui-col-md2 storageType disN">
                                          <label class="layui-form-label">仓储类型</label>
                                          <div class="layui-input-block">
                                            <select 
                                                name="storageTypeList"
                                                id="FBAdistribute_storageTypeList"
                                                xm-select="FBAdistribute_storageTypeList" 
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
                                        <input class="hide" type="text" name="tablename" value="FBAdelivery_table_check">
                                        <input class="hide" type="text" name="matchStatus" value="0">
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
                                <div class="layui-tab" lay-filter="FBAdistribute_Tab" id="FBAdistribute_Tab">
                                    <div class="toFixedContain" style="height:42px;">
                                        <div class="fl" style="height:42px;">
                                            <ul class="layui-tab-title" id="FBAdistrubute_label">

                                                <li class="layui-this" data-index="FBAdelivery_table_check" data-code="0">待审核(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_waitSend" data-code="1">待派单(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_waitSet" data-code="2">待配货(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_waitCheck" data-code="3">待包装(<span>0</span>)</li>
                                                <!-- <li data-index="FBAdelivery_table_toCreate" data-code="5">待建框(<span>0</span>)</li> -->
                                                <li data-index="FBAdelivery_table_lackup" data-code="6">仓库缺货(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_finish" data-code="4">已包装(<span>0</span>)</li>
                                                <li data-index="FBAdelivery_table_cancel" data-code="9">已取消(<span>0</span>)</li>
                                            </ul>
                                        </div>
                                        <div class="fl">
    
                                        </div>
                                        <div class="fr">
                                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdistribute_cancelAll">批量取消</button>
                                            <permTag:perm funcCode="FBAdeliveryForDistribute_audit_btn">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdistribute_check">审核</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="FBAdeliveryForDistribute_markLabel">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdistribute_setLable">设置物流标签</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="FBAdeliveryForDistribute_distribute">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdistribute_warehouse">派至仓库</button>
                                            </permTag:perm>
                                            <!-- <permTag:perm funcCode="FBAdeliveryForDistribute_createBatch">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdistribute_batch">生成批次</button>
                                            </permTag:perm> -->
                                            <permTag:perm funcCode="FBAdeliveryForDistribute_createShip">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdistribute_generate">生成货件</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="FBAdeliveryForDistribute_transferToWaitDistribute">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdistribute_waitSend">转待派单</button>
                                            </permTag:perm>
                                            <permTag:perm funcCode="FBAdeliveryForDistribute_statistics">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm disN FBAdelivery_batchBtn" id="FBAdistribute_statistics">待建批次统计</button>
                                            </permTag:perm>
                                        </div>
                                    </div>
                                    <div class="layui-tab-content">
                                        <div class="layui-tab-item layui-show">
                                            <table lay-filter="FBAdelivery_table_check" class="layui-table" id="FBAdelivery_table_check"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <table lay-filter="FBAdelivery_table_waitSend" class="layui-table" id="FBAdelivery_table_waitSend"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <table lay-filter="FBAdelivery_table_waitSet" class="layui-table" id="FBAdelivery_table_waitSet"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <table lay-filter="FBAdelivery_table_waitCheck" class="layui-table" id="FBAdelivery_table_waitCheck"></table>
                                        </div>
                                        <!-- <div class="layui-tab-item">
                                            <table lay-filter="FBAdelivery_table_toCreate" class="layui-table" id="FBAdelivery_table_toCreate"></table>
                                        </div> -->
                                        <div class="layui-tab-item">
                                            <table lay-filter="FBAdelivery_table_lackup" class="layui-table" id="FBAdelivery_table_lackup"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                            <!-- <div class="checkbox-group toFixedContain">
                                                <div class="layui-form FBAdistribute_batchBtn" id="packStatuBox_FBAdistribute" lay-filter="packStatuBoxDiv_FBAdistribute">
                                                    <input type="checkbox" name="packStatus" value="false" title="待包装(<font>0</font>)" checked lay-skin="primary" lay-filter="packStatusBox_FBAdistribute">
                                                    <input type="checkbox" name="packStatus" value="true" title="已包装(<font>0</font>)" lay-skin="primary" lay-filter="packStatusBox_FBAdistribute">
                                                </div>
                                            </div> -->
                                          <table lay-filter="FBAdelivery_table_finish" class="layui-table" id="FBAdelivery_table_finish"></table>
                                        </div>
                                        <div class="layui-tab-item">
                                          <table lay-filter="FBAdelivery_table_cancel" class="layui-table" id="FBAdelivery_table_cancel"></table>
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="FBAdistribute_page"></div>
                    </div>
                </div>
            </div>

<!-- 表格渲染模板 -->
<script type="text/html" id="FBAdistribute_imageTpl">
    {{# if (d.labelList && d.labelList.length > 0) {}}
    {{# for (let i = 0; i < d.labelList.length; ++i) { }}
    <div class="fRed">「{{d.labelList[i].labelName}}」</div>
    {{# }}}
    {{# }}}
    <div>
        <img width="60" height="60" data-original="{{d.image||d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
    <div title="需求ID">{{d.id}}</div>
    <span class="ship_tag">
        {{# if(d.shippingType === 1){ }} 
        <span class="type_tag blue_tag">空运</span>
        {{# } }}
        {{# if(d.shippingType === 2){ }} 
            <span class="type_tag red_tag">海运</span>
        {{# } }}
        {{# if(!d.shippingType){ }} 
            <span class="type_tag grey_tag">无发货类型</span>
        {{# } }}
    </span>
</script>

<script type="text/html" id="FBAdelivery_opAsyncInfo">
    <div onmouseover="showTip(`{{d.opAsyncInfo || ''}}`, this)" onmouseleave="removeTip(this)">
        <div class="overContentEllipsis4">{{d.opAsyncInfo || ""}}</div>
    </div>
</script>
<script type="text/html" id="FBAdelivery_showFreightNum">
    <div onmouseover="showTip(`{{d.showFreightNum || ''}}`, this)" onmouseleave="removeTip(this)">
        <div class="overContentEllipsis4">{{d.showFreightNum || ""}}</div>
    </div>
</script>


<script type="text/html" id="FBAdistribute_proNum">
    <input type="number" class="layui-input" value="{{d.planQuality}}" min="1" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
</script>

<script type="text/html" id="FBAdistribute_productInfo_OA">
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
<div onmouseover="FBAdelivery_showPackDesc(this,{{d.LAY_TABLE_INDEX}})" onmouseleave="removeTip(this,500)">【包装备注】</div>


    </script>

<!-- 生成货件 -->
<script type="text/html" id="pop_FBA_distribute_createGoods">
    <div calss="layui-form-item">
        <form class="layui-form mg_50" id="FBAdistribute_layeracreateForm" lay-filter="FBAdistribute_layeracreateForm">
            <div class="layui-col-lg4 layui-col-md4" notNull>
                <label class="layui-form-label">发货地址</label>
                <div class="layui-input-block">
                    <select id="distributeAddress" name="addressId" required lay-verify="required" lay-search>
                        <%--<option value="6" >北美38</option>--%>
                        <%--<option value="283" >自注册002US</option>--%>
                        <%--<option value="14" data-trackingnoprefix="undefined">北美23</option>--%>
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
        <table class="layui-table" lay-filter="FBAdistribute_table_createGoodsTable" id="FBAdistribute_table_createGoodsTable"></table>
    </div>
</script>

<!-- 提交货件 -->
<script type="text/html" id="pop_FBA_distribute_submitGoods">
    <div class="disFCenter mg_50">
        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="FBAdelivery_markDivideWarehouse">设置物流标签</button>
        <button type="button" class="layui-btn layui-btn-sm" id="FBAdistribute_copyAllFnSku">复制所有FNSKU</button>
    </div>
    <div class="mg_50">
        <table class="layui-table" lay-filter="FBAdistribute_table_submitGoodsTable" id="FBAdistribute_table_submitGoodsTable"></table>
    </div>
</script>

<script type="text/html" id="FBAdistribute_prodSSkuTemp">
    <div>{{d.prodSSku}}</div>
    <div style="max-height: 20px" class="text_l overContentEllipsis" onmouseenter="showTip(`{{d.fbaHisProd.packDesc}}`,this)" onmouseleave="removeTip(this)"><span class="gray">包装备注:</span>{{d.fbaHisProd.packDesc || ''}}</div>
    {{# if(d.logisAttrList){ }}
    {{# let logistAttrArr = d.logisAttrList.split(',')}}
    {{# for (let i = 0; i < logistAttrArr.length; ++i) { let logis = logistAttrArr[i];let alia=getLogisAttrAlia(logis)}}
    {{#  if(alia && alia !== '普'){ }}
    <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logis}}">{{alia}}</span>
    {{# } }}
    {{# }}}
    {{# } }}·
</script>

<script type="text/html" id="FBAdistribute_productInfo">
    <div class="text_l"><span class="gray">店铺SKU:<a class="sellerSkuInfo">{{d.sellerSku||''}}</a></span>
    </div>
    <div class="text_l"><span class="gray">ASIN:</span><a class="skyblue" target="_blank" href="{{getAmazonProdPagePrex(d.salesSite || '') + d.asin}}">{{d.asin||''}}</a></div>
    <div class="text_l"><span class="gray">FNSKU:</span>{{d.fnSku||''}}</div>
    {{# if(d.shipmentIds){}}
    <div class="text_l"><span class="gray">货件:</span>{{d.shipmentIds || ''}}</div>
    {{# } }}
    {{# if(d.matchStatus ==2){ }}
    <div class="text_l"><span class="gray">仓储类型:</span>{{d.storageTypeName || ''}}</div>
    {{# } }}
</script>

<script type="text/html" id="FBAcreate_distribute_proNum">
    <input type="number" class="layui-input" value="{{d.planQuality - d.actQty < d.availableQuality ? (d.planQuality - d.actQty) : d.availableQuality }}" min="1" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
</script>

<script type="text/html" id="FBAdistribute_creatGoods">
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBA_distribute_createTable">移除</button>
</script>

<script type="text/html" id="pop_FBA_distribute_productDetail">
    <div>
        <div class="layui-col-lg12 layui-col-md12 layui-tab-card mb10">
            <div class="layui-tab layui-card">
                <ul class="layui-tab-title isCreateHidden">
                    <li class="layui-this">详情</li>
                    <li id="Fbadistribute_opLogPage">操作日志</li>
                </ul>
                <div class="layui-tab-content">
                    <div class="layui-tab-item layui-show p20">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-form-item">
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <label class="layui-form-label">新增货品</label>
                                        <div class="layui-input-block">
                                            <input class="layui-input" id="pop_distribute_productDetail_querySellerSku" placeholder="输入店铺sku">
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <div class="layui-btn layui-btn-sm" id="pop_FBA_distribute_productDetail_queryBtn">查询</div>
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <div class="layui-col-md12 layui-col-lg12">
                                        <div class="layui-btn layui-btn-sm" id="pop_FBA_distribute_productDetail_copyFnSku">复制所有FNSKU</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-card">
                            <table class="layui-table" id="FBAdistribute_ProdDetailTable" lay-filter="FBAdistribute_ProdDetailTable"></table>
                        </div>
                    </div>
                    <div class="layui-tab-item layui-show p20">
                        <div class="layui-card">
                            <table class="layui-table" id="FBAdistribute_shipLogTable" lay-filter="FBAdistribute_shipLogTable"></table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    </script>

    <script type="text/html" id="pop_FBA_distribute_shipRelSkuDetailQuery">
        <div class="layui-card">
            <table class="layui-table" id="FBA_distribute_shipRelSkuDetailQueryTable" lay-filter="FBA_distribute_shipRelSkuDetailQueryTable"></table>
        </div>
    </script>

<script type="text/html" id="FBAdistribute_productInfo">
    <div class="text_l"><span class="gray">店铺SKU:<a class="sellerSkuInfo">{{d.sellerSku||''}}</a></span>
    </div>
    <div class="text_l"><span class="gray">ASIN:</span><a class="skyblue" target="_blank" href="{{getAmazonProdPagePrex(d.salesSite || '') + d.asin}}">{{d.asin||''}}</a></div>
    <div class="text_l"><span class="gray">FNSKU:</span>{{d.fnSku||''}}</div>

</script>

<script type="text/html" id="FBAdelivery_productInfo_pack">
    <div class="text_l"><span class="gray">SKU:<a class="sellerSkuInfo">{{d.sellerSku||''}}</a></span></div>
    <div class="text_l"><span class="gray"> ASIN:</span><a class="skyblue" target="_blank" href="{{d.asinSrc}}">{{d.asin||''}}</a></div>
    <div class="text_l"><span class="gray">FNSKU:</span>{{d.fnSku||''}}</div>
    <div class="text_l"><span class="gray">商品SKU:</span>{{d.prodSSku||''}}</div>
</script>

<script type="text/html" id="FBAdelivery_distribute_submitGoods">
    <button class="layui-btn layui-btn-xs" lay-event="FBA_distribute_submitproductDetail">商品详情</button>
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBA_distribute_submitremovegoods">删除</button>
</script>

<script type="text/html" id="FBAdelivery_distribute_fnCenterInfo">
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

<script type="text/html" id="FBAdistribute_Detail_numTemp">
    <div style='color:red' title='上限数量'>「{{d.planQualityMax}}」</div>
    <div title=''>{{d.originPlanQuality}}</div>
    <div style='color:green'  title='下限数量'>「{{d.planQualityMin}}」</div>
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

<script type="text/html" id="FBAdistribute_store_site">
    <div class="text_l">{{d.storeAcct}}-{{d.salesSite}}</div>
    <div class="text_l"><span>销售员:{{d.salesperson||''}}</span></div>
    <!-- <div class="text_l"><span>创建人:{{d.creator||''}}</span></div> -->
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

<script type="text/html" id="FBAdistribute_plan_cost_tpl">
    {{# if (d.planSource == '1') {}}
        <div onmouseover="showTip(`{{d.splitMergeDesc || ''}}`, this)" onmouseleave="removeTip(this)" style="font-size: 24px;color:red;font-weight: bold">拆</div>
    {{# } }}
    {{# if (d.planSource == '2') {}}
        <div onmouseover="showTip(`{{d.splitMergeDesc || ''}}`, this)" onmouseleave="removeTip(this)" style="font-size: 24px;color:red;font-weight: bold">合</div>
    {{# } }}
    {{ ((d.oaCost||0)*d.planQuality).toFixed(2) }}
    <div><button class="layui-btn layui-btn-xs" lay-event="FBAdistribute_showBehavior">表现</button></div>
</script>

<script type="text/html" id="FBAdistribute_planoption_tpl">
    {{# if (d.matchStatus === '0') {}}
    <permTag:perm funcCode="FBAdeliveryForDistribute_audit_btn">
        <div><button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="FBAdistribute_auditPlan">审核</button></div>
    </permTag:perm>
    <permTag:perm funcCode="FBAdeliveryForDistribute_modify">
        <div><button class="layui-btn layui-btn-xs" lay-event="FBA_modifyAmount">修改</button></div>
    </permTag:perm>
    {{#}}}
    {{# if ( ['1','2','3','5','6'].includes(d.matchStatus)) {}}
        <permTag:perm funcCode="FBAdeliveryForDistribute_transferToWaitAudit">
            <div><button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="FBAdistribute_toCheckStatus">转待审核</button></div>
        </permTag:perm>
    {{#}}}
    {{# if (['0', '1', '2', '3', '5', '6'].includes(d.matchStatus)) {}}
        <permTag:perm funcCode="FBAdeliveryForDistribute_cancel">
            <div><button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FBAdistribute_removePro">取消</button></div>
        </permTag:perm>
    {{# } }}
</script>

<script type="text/html" id="FBAdistribute_cancel_tpl">
    <div class="text_l"><span>{{ d.cancelOperator || '' }}</span></div>
    <div class="text_l"><span>{{ Format(d.cancelTime || '','yyyy-MM-dd hh:mm') }}</span></div>
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
    <div>{{d.planQuality}}</div>
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

<script type="text/html" id="FBAdelivery_modifyTime">
    <div>{{Format(d.modifyTime,'yyyy-MM-dd hh:mm')}}</div>
</script>

<script type="text/html" id="FBAdelivery_timeAll_tpl">
    <div>创建:{{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</div>
    <div>修改:{{Format(d.modifyTime,'yyyy-MM-dd hh:mm')}}</div>
    <div>发货:{{Format(d.deliverTime,'yyyy-MM-dd hh:mm')}}</div>
</script>

<script type="text/html" id="FBAdelivery_warningInfo">
    <div>{{d.shipmentStatus}}</div>
    {{# if(!d.addressId){ }}
    <span style="color:#F00;font-size:12px">非OA生成的货件(缺发货地址)</span>
    <button class="layui-btn layui-btn-xs" lay-event="FBAdelivery_full_address">补充地址</button>
    {{# } }}
</script>

<script type="text/html" id="FBAdelivery_suggest_logistics_type">
    {{# if(d.preLogisticsTypeName){ }}
        <div>卖家<br/>采购建议物流:{{d.preLogisticsTypeName||""}}</div>
    {{# }else{ }}
        <div>卖家</div>
    {{# } }}
</script>

<!-- 修改发货数量 -->
<script type="text/html" id="pop_FBAdistrubute_modifyAmount">
    <div class="layui-form layui-form-item mg_50">
        <label class="layui-form-label">发货数量</label>
        <div class="layui-input-block">
            <input type="number" class="layui-input w_80" min="0" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
        </div>
    </div>
</script>

<script type="text/html" id="FBAdistribute_updatePackDesc_pop">
    <div class="layui-card" style="color: #000;">
        <div class="layui-card-body">
            <div id="FBAdistribute_packDescEdit">
            </div>
        </div>
    </div>
</script>

<%--货品详情- 图片模板--%>
<script type="text/html" id="FBAdistribute_ProdDetailTable_img">
    <div><img src="{{d.picUrl}}" data-original="{{d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" width="60" height="60"></div>
</script>

<%--货品详情- 图片模板--%>
<script type="text/html" id="FBA_distribute_shipRelSkuDetailQueryTable_img">
    <div><img src="{{d.image}}" data-original="{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" width="60" height="60"></div>
</script>

<%--货品详情- 操作模板--%>
<script type="text/html" id="FBAdistribute_ProdDetailTableBar">
    <div>
        <div class="layui-btn layui-btn-sm layui-btn-danger" lay-event="deleteProd">删除</div>
    </div>
</script>
<%--货品详情- 包装备注模板--%>
<script type="text/html" id="FBAdistribute_ProdDetailTable_packDesc">
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


<!-- 修改发货数量 -->

<!-- 表格渲染模板 -->
<!-- 表格渲染模板 -->
<script src="${ctx}/static/js/publishs/amazon/FBAdeliveryForDistribute.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/util/enum.js?v=${ver}"></script>

<script type="text/html" id="FBAdelivery_matchInfo_prodInfo">
    <div><span class="secondary">sku:</span>{{d.prodSSku}}</div>
    <div><span class="secondary">数量:</span>{{d.amount}}</div>
    <%--{{#if (d.actQuality) {}}--%>
    <div><span class="secondary">配货:</span>{{d.occNum}}</div>
    <%--{{#}}}--%>
</script>

<script type="text/html" id="FBAdelivery_matchInfo_FbaGoodsInfo">
    <div><span class="secondary">fnSku:</span>{{d.fnSku}}</div>
    <div><span class="secondary">数量:</span>{{d.planQuality}}</div>
    {{#if (d.actQuality) {}}
    <div><span class="secondary">实发:</span>{{d.actQuality}}</div>
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
    {{# if (d.matchStatus) {}}
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
<script type="text/html" id="FBAdistribute_shipmentIdTemp">
    <div>{{d.shipmentIds || ''}}</div>
</script>


<script type="text/html" id="FBAdelivery_distribute_shipmentIdTemplet">
    <div>{{d.shipmentId}}</div>
    <div >总重量：{{d.totalWeight}} kg</div>
</script>

<script type="text/html" id="FBAdistribute_deliveryPlan_ProdSkuTpl">
    <div class="fRed">{{getDevTypeName(d.devType)}}</div>
    <div>{{d.prodSSku || '未映射'}}</div>
    <div>{{d.bizzOwner ? ('开发:' + d.bizzOwner) : ''}}</div>
    {{# if(d.logisAttrList){ }}
        {{# let logistAttrArr = d.logisAttrList.split(',')}}
        {{# for (let i = 0; i < logistAttrArr.length; ++i) { let logis = logistAttrArr[i];let alia=getLogisAttrAlia(logis)}}
    {{#  if(alia && alia !== '普'){ }}
                <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logis}}">{{alia}}</span>
            {{# } }}
        {{# }}}
    {{# } }}
</script>

<script type="text/html" id="FBAdistribute_isSale_tpl">
    <input type="checkbox" lay-skin="primary" disabled {{ d.prodSInfo?.isSale ? 'checked' : '' }}><br>
</script>

<script type="text/html" id="FBAdelivery_exportByTemplatePop">
    <div class="p20">
        <table class="layui-table" lay-filter="FBAdelivery_exportTemplateTable" id="FBAdelivery_exportTemplateTable"></table>
    </div>
</script>

<script type="text/html" id="FBAdistribute_plan_sameAsinSalesSiteData">
    <div class="alignLeft">
        <div><span class="secondary">oa建议:</span>{{d.statisticInfo && d.statisticInfo.allOaSuggestSale != null ? d.statisticInfo.allOaSuggestSale : ''}}</div>
        <div><span class="secondary">7日销量:</span>{{d.statisticInfo &&d.statisticInfo.sevenSales != null ?  d.statisticInfo.sevenSales :''}}</div>
        <div><span class="secondary">7日广告费:</span>{{d.statisticInfo && d.statisticInfo.adCostSeven != null ? d.statisticInfo.adCostSeven :''}}</div>
        <div><span class="secondary">利润率:</span>{{d.fbaHisProd && d.fbaHisProd.profitRate || ""}}</div>
        <div><span class="secondary">退款率:</span>{{d.totalOrder ? (accMul(accDiv(d.refundOrder,d.totalOrder),100).toFixed(2) + "%") : ""}}</div>
    </div>
</script>


<script type="text/html" id="FBAdistribute_plan_weight_tpl">
    <div class="alignLeft">
        {{# if (d.prodSInfo && d.prodSInfo.id) {}}
        <div><span class="secondary">实重:</span>{{((d.prodSInfo.packWeight + d.prodSInfo.suttleWeight)*d.planQuality/1000).toFixed(2)}}</div>
        <div><span class="secondary">抛重:</span>{{d.prodSInfo.outerBoxLength ? ((d.prodSInfo.outerBoxLength * d.prodSInfo.outerBoxHeight * d.prodSInfo.outerBoxWidth *d.planQuality/6000).toFixed(2)) : 0}}</div>
        <div title="抛重/实重"><span class="secondary">抛重比:</span>{{d.prodSInfo.suttleWeight ?  ((d.prodSInfo.outerBoxLength * d.prodSInfo.outerBoxHeight *d.prodSInfo.outerBoxWidth /6) / (d.prodSInfo.packWeight + d.prodSInfo.suttleWeight)).toFixed(2) : 0}}</div>
        {{# } }}
    </div>
</script>

<script type="text/html" id="FBAdistribute_warehouse_tpl">
    <div class="alignLeft">
        <div>批次号: {{ d.batchNo }}</div>
        <div><span>创建：{{d.creator||''}} {{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</span></div>
        {{# layui.each(d.logList||[], function(index, cItem){ }}
            {{# if(cItem.operType == 7){ }}
                <div>配货：{{cItem.operator}} {{Format( cItem.operTime, 'yyyy-MM-dd hh:mm')}}</div>
            {{# } }}
            {{# if(cItem.operType == 12){ }}
                <div>包装：{{cItem.operator}} {{Format( cItem.operTime, 'yyyy-MM-dd hh:mm')}}</div>
            {{# } }}
        {{#}) }}
    </div>
</script>

<script type="text/html" id="FBAdistribute_create_tpl">
    <div class="alignLeft">
        <div><span>创建：{{d.creator||''}} {{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</span></div>
    </div>
</script>

<script type="text/html" id="FBAdistribute_setPlanLabelPop">
    <div class="p20">
        <form class="layui-form" id="FBAdistribute_setPlanLabelForm" lay-filter="FBAdistribute_setPlanLabelForm">
            <div id="FBAdistribute_setPlanLabelContains">

            </div>
        </form>
    </div>
</script>

<script type="text/html" id="FBAdistribute_statisticsPop">
    <table id="FBAdistribute_statisticsTable"></table>
</script>

<%@ include file="/WEB-INF/view/jsp/publishs/Amazon/component/salesBehavior.jsp"%>
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>