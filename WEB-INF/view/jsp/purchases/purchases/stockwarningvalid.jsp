<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>库存预警(有效)</title>
<style>
    .specialSpan{
        width: 24px;
        line-height: 24px;
        height: 24px;
        border-radius: 12px;
        text-align: center;;
    }
</style>
<div class="layui-fluid" id="LAY-work-develop-pl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="stockwarningvalid_searchForm" id="stockwarningvalid_searchForm" autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="stockwarningvalid_searchCate_btn">选择分类</button>
                                    <input type="hidden" name="cateId" value="" id="stockwarningvalid_cateId_search_Inp">
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('pl_search_cate','stockwarningvalid_cateId_search_Inp')"
                                       style="cursor:pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="storeId">
                                        <c:forEach items="${storeList}" var="store">
                                            <c:if test="${store.storeType == 1}">
                                            <option value="${store.id}" ${store.isDefault ? 'selected' : ''}>${store.warehouseName}</option>
                                            </c:if>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">整合人员</label>
                                <div class="layui-input-block" hp-select>
                                    <div hidden hp-select-data>
                                        <c:forEach items="${integrators}" var="integrator">
                                            <li data-value="${integrator.id}" hp-select-li>${integrator.userName}</li>
                                        </c:forEach>
                                    </div>
                                    <input class="layui-input" name="integrator" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block" hp-select>
                                    <div hidden hp-select-data id="buyerBox_stockwarningvalid">
                                        <c:forEach items="${buyers}" var="buyer">
                                            <li data-value="${buyer.id}" hp-select-li data-text="${buyer.userName}">${buyer.userName}</li>
                                        </c:forEach>
                                    </div>
                                    <input class="layui-input" name="buyer" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div id="buyerOptionBox" class="disN">
                                <option></option>
                                <c:forEach items="${buyers}" var="buyer">
                                    <option value="${buyer.id}">${buyer.userName}</option>
                                </c:forEach>
                            </div>
                            <div id="payTypeOptionBox" class="disN">
                                <option></option>
                                <c:forEach items="${payTypeList}" var="payType">
                                    <option value="${payType.code}">${payType.name}</option>
                                </c:forEach>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale" value="1">
                                        <option value="">全部</option>
                                        <option value="1" selected="selected">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否定制</label>
                                <div class="layui-input-block">
                                    <select name="isSpecialMake">
                                        <option value=""></option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="searchType">
                                        <option value="sSku">子SKU</option>
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku2">子SKU(精确)</option>
                                        <option value="pSku2">父SKU(精确)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input id="searchInputValue" name="searchValue" type="text" class="layui-input" placeholder="多个逗号分隔">
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block" hp-select>
                                    <div hidden hp-select-data>
                                        <c:forEach items="${bizzOwners}" var="developer">
                                            <li data-value="${developer.id}" hp-select-li>${developer.userName}</li>
                                        </c:forEach>
                                    </div>
                                    <input class="layui-input" name="bizzOwner" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品名称</label>
                                <div class="layui-input-block" >
                                    <input class="layui-input" name="title">
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">供应商</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="supplierId">
                                    <div>
                                        <input id="stockwarningvalid_searchSupplier"  name="supplierName" class="layui-input"/>
                                    </div>
                                    <div class="dimResultDiv"></div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="searchTimeType" >
                                        <option value="1">创建时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="searchTime" id="stockWarningValid_searchTime">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">库位</label>
                                <div class="layui-input-block" >
                                    <input class="layui-input" name="stockLocation">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">采购到货天数</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="purchaseReceiveDays_min" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="purchaseReceiveDays_max" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">预警周期</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="stockWarnSycle_min" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="stockWarnSycle_max" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">月销量</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="salesNum30_min" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="salesNum30_max" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否缺货</label>
                                <div class="layui-input-block">
                                    <select name="ifLack">
                                        <option value=""></option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>      
                            <div class="layui-col-md1 layui-col-lg1">
                                    <select name="prodAttrList">
                                        <option value="">商品标签</option>
                                        <c:forEach items="${prodTags}" var="prodTag">
                                            <option value="${prodTag.name}">${prodTag.name}</option>
                                        </c:forEach>
                                    </select>
                            </div>                 
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="isHighPurTimes">
                                    <option value="">高频次采购</option>
                                    <option value="true">是高频次采购</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="ifStableSale">
                                    <option value="">长销款</option>
                                    <option value="true">是长销款</option>
                                    <option value="false">非长销款</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="orderByType">
                                    <option value="1">创建时间倒序</option>
                                    <option value="2">创建时间正序</option>
                                    <option value="3">月销量正序</option>
                                    <option value="4">月销量倒序</option>
                                </select>
                            </div>
                            
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">AE全托管未占用数</label>
                                <div class="layui-input-block">
                                    <select name="ifAePreReservationStockBiggerThanZero">
                                        <option value="">请选择</option>
                                        <option value="true">AE全托管未占用数>0</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label" title="（订单签收时间-采购单创建时间）去掉最高最低，取最近三个月的平均值">实际到货天数<i class="layui-icon layui-icon-about"></i></label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="avgReceiveDayLastThreeMonthMin" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="avgReceiveDayLastThreeMonthMax" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">周转天数</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="turnOverDay_min" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="turnOverDay_max" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">库存金额</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="soldStockAmount_min" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="soldStockAmount_max" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <input type="checkbox" name="ifPurMerge" value="true" lay-skin="primary" title="顺带采购" lay-filter="stockwarningvalid_ifPurMergeCheckbox">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <input type="checkbox" name="ifAdvicePurchase" lay-skin="primary" value="true" title="建议采购">
                                </div>
                            </div>

                            <div class="layui-col-md1 layui-col-lg1" style="padding-left:32px;margin-top:2px">
                                <button id="stockWarningValid_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload">搜索</button>
                                <button type="reset" id="stockWarningValid_resetBtn" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                        <div class="layui-col-l12 layui-col-md12" id="stockwarningvalid_search_cate"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="stockwarningvalidCard">
                <div class="layui-card-header">
                    <span class="numCount">库存预警(<span id="total_stockWarning"></span>)</span>

                    <permTag:perm funcCode="exportStockWarning_stockwarningvalid">
                            <button type="button" class="layui-btn layui-btn-sm" id="exportStockWarning_stockwarningvalid">导出</button>
                    </permTag:perm>
                    <permTag:perm funcCode="exportInvalidSaleOrder_stockwarningvalid">
                        <button type="button" class="layui-btn layui-btn-sm" id="exportInvalidSaleOrder_stockwarningvalid">导出异常订单</button>
                    </permTag:perm>
                    <permTag:perm funcCode="exportUnsalableGoodsInfo_stockwarningvalid">
                        <button type="button" class="layui-btn layui-btn-sm" id="exportUnsalableGoodsInfo_stockwarningvalid">导出滞销品</button>
                    </permTag:perm>
                    <permTag:perm funcCode="exportUnsalablePurOrder_stockwarningvalid">
                        <button type="button" class="layui-btn layui-btn-sm" id="exportUnsalablePurOrder_stockwarningvalid">导出最近一月滞销采购单</button>
                        <button type="button" class="layui-btn layui-btn-sm" id="exportUnsalablePurOrder_stockwarningvalidForHalfYear">导出最近半年滞销采购单</button>
                    </permTag:perm>
                    <span style="float:right;">
                        <permTag:perm funcCode="batchSync_stockwarningvalid">
                            <button type="button" class="layui-btn layui-btn-sm" id="stockWarningValid_refreshByProdSIdList_Btn">批量同步</button>
                        </permTag:perm>
                        <permTag:perm funcCode="editSaleExlude_stockwarningvalid">
                            <button type="button" class="layui-btn layui-btn-sm" id="stockWarningValid_addExcludeConf_Btn">设置日期</button>
                        </permTag:perm>
                    </span>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="stockWarningValidTable" lay-filter="stockWarningValidTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 弹出框信息 -->
<%--<!-- 新增日期设置 -->--%>
<script type="text/html" id="addExcludeConf_warningStock_Layer">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" id="addExcludeConf_warningStock" autocomplete="off" lay-filter="addExcludeConf_warningStock">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">日期</label>
                                <div class="layui-input-block">
                                    <input type="text" name="countDate" id="addExcludeConf_countDate" class="layui-input" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md5 layui-col-lg5 ml20" id="stockwarningvalidPlatCodeDiv">
                            </div>
                            <div class="layui-col-md3 layui-col-lg3 ml10">
                                <button type="button" class="layui-btn layui-btn-sm" id="addExcludeBtn">新增</button>
                                <button type="button" class="layui-btn layui-btn-sm ml10" id="delExcludeBtn">删除</button>
                                <button type="button" class="layui-btn layui-btn-sm ml10" id="recountSalesBtn" onclick="recountSales()">重新统计</button>
                            </div>
                        </div>

                    </form>
                </div>
                <hr class="layui-bg-gray">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <table class="layui-table" id="salesCountExcludeTable" lay-filter="salesCountExcludeTable"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<%--图片--%>
<script type="text/html" id="image_stockWarning">
    {{# if(typeof(d.prodSInfo.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.prodSInfo.image }}" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{# } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{# } }}
</script>

<%--是否建议采购--%>
<script type="text/html" id="stockWarningValid_ifAdvicePurchase">
    {{# if (d.adviceNum > 0) { }}
        <span style="color: red">{{ d.adviceNum }}</span>
    {{# } else { }}
        <span style="color: grey">{{ d.adviceNum }}</span>
    {{# } }}
</script>

<script type="text/html" id="stockWarningValid_skuInfo">
    <div><span style="color: grey">SKU:</span>{{d.sSku}}</div>
    <div><span style="color: grey">库位:</span>{{d.stockLocation ? d.stockLocation : ''}}</div>
    <div><span style="color: grey">开发时间:</span>{{Format(new Date(d.prodSInfo.createTime), "yyyy-MM-dd")}}</div>
    <div><span style="color: grey">更新时间:</span>{{Format(new Date(d.updateTime), "yyyy-MM-dd hh:mm:ss")}}</div>
</script>

<script type="text/html" id="stockWarningValid_Info">
    <div>{{d.prodSInfo.title}}</div>
    <div><span style="color: grey">类目:</span>{{d.prodPInfoDto?.prodCate?.cateCnName || ''}}</div>
    <div><span style="color: grey">单位:</span>{{d.prodSInfo.unit ? d.prodSInfo.unit : ''}}
        {{# if (d.prodSInfo.isSpecialMake) {}}
        <span class="layui-badge layui-bg-blue specialSpan fr" title="定制产品">定</span>
        {{# }}}
    </div>
    <div></div>
</script>

<script type="text/html" id="stockWarningValid_userInfo">
    <div><span style="color: grey">采购:</span>{{d.prodSInfo.buyer}}</div>
    <div><span style="color: grey">整合:</span>{{d.integrator ? d.integrator : ''}}</div>
    <div><span style="color: grey">开发:</span>{{d.prodPInfoDto?.bizzOwner}}</div>

</script>
<script type="text/html" id="stockWarningValid_priceInfo">
    <div><span style="color: grey">平均单价:</span>{{d.avgPrice}}</div>
    <div><span style="color: grey">采购单价:</span>{{d.prodSInfo.purchaseCostPrice}}</div>
    <div><span style="color: grey">待调整价:</span>{{d.waitAdjustPrice || ''}}</div>
    <div><span style="color: grey">库存金额:</span>{{d.stockMoney}}</div>
</script>

<script type="text/html" id="stockWarningValid_purchaseInfo">
    <div>「{{d.storeName}}」</div>
    <div><span style="color: grey">预警周期:</span>{{d.whPurchaseParam != null && d.whPurchaseParam.stockWarnCycle != null ? d.whPurchaseParam.stockWarnCycle : ''}}
    </div>
    <div><span style="color: grey">到货天数:</span>{{d.whPurchaseParam != null && d.whPurchaseParam.purchaseDlvrDays != null ? d.whPurchaseParam.purchaseDlvrDays : ''}}
    </div>
    <div><span style="color: grey">实际到货天数:</span>
        {{d.avgReceiveDayLastThreeMonth && d.avgReceiveDayLastThreeMonth > 0 ? d.avgReceiveDayLastThreeMonth : ''}}
    </div>
    <div><span style="color: grey">周转天数:</span>
        {{d.dailySaleNum3Valid > 0 ? (accDiv(d.preAvailableStockAll, d.dailySaleNum3Valid)).toFixed(2) : ''}}
    </div>
    <div class="stockwarningvalid_showupperlowerstock" onmouseleave="removeTip(this,100)"><span style="color: grey">库存上限:</span>
        {{d.whPurchaseParam != null && d.whPurchaseParam.upperStock != null ? d.whPurchaseParam.upperStock : ''}}
    </div>
    <div class="stockwarningvalid_showupperlowerstock" onmouseleave="removeTip(this,100)"><span style="color: grey">库存下限:</span>
        {{d.whPurchaseParam != null && d.whPurchaseParam.lowerStock != null ? d.whPurchaseParam.lowerStock : ''}}
    </div>

</script>

<script type="text/html" id="stockWarningValid_stockInfo">
    <div><span style="color: grey">当前库存:</span>{{d.stockNum}}</div>
    <div><span style="color: grey">占用库存:</span><span lay-event="stockwarningvalidDetail" style="cursor:pointer;color:#6998ee;">{{d.reservationNum}}</span></div>
    <div><span style="color: grey">未占用数:</span><span lay-event="stockwarningvalidDetail1" style="cursor:pointer;color:#6998ee;">{{d.lackUnPaiNum - d.lackReservationNum}}</span></div>
    <div><span style="color: grey">预计可用:</span><span lay-event="stockwarningvalidDetail2" style="cursor:pointer;color:#6998ee;">{{d.preAvailableStockAll}}</span></div>
    <div><span style="color: grey">未入库数:</span><span lay-event="stockwarningvalidDetail3" style="cursor:pointer;color:#6998ee;">{{d.orderNotInNum}}</span></div>
</script>

<script  type="text/html" id="stockwarningvalid_detail_goods_occupied_script">
    <div style="padding:10px;">
      <div class="layui-tab" lay-filter="stockwarningvalid_detail_goods_occupied_title_type">
        <div style="height:40px;line-height:40px;">
            <ul class="layui-tab-title">
                <li data-value="1" class="layui-this">出库占用(<span id="stockwarningvalid_detail_goods_occupied_title_type_1"/>)</li>
                <li data-value="2" >订单占用(<span id="stockwarningvalid_detail_goods_occupied_title_type_2"/>)</li>
                <li data-value="3">FBA货件计划占用(<span id="stockwarningvalid_detail_goods_occupied_title_type_3"/>)</li>
                <li data-value="5">中转仓货件计划占用(<span id="stockwarningvalid_detail_goods_occupied_title_type_5"/>)</li>
                <li data-value="9">自拍图占用(<span id="stockwarningvalid_detail_goods_occupied_title_type_9"/>)</li>
                <li data-value="4">待入库明细(<span id="stockwarningvalid_detail_goods_occupied_title_type_4"/>)</li>
                <li data-value="6">FBA铺货需求占用(<span id="stockwarningvalid_detail_goods_occupied_title_type_6"/>)</li>
                <li data-value="7">组合品生产占用(<span id="stockwarningvalid_detail_goods_occupied_title_type_7"/>)</li>
                <li data-value="8">虚拟占用(<span id="stockwarningvalid_detail_goods_occupied_title_type_8"/>)</li>
                <li data-value="10">预留占用(<span id="stockwarningvalid_detail_goods_occupied_title_type_10"/>)</li>
            </ul>
        </div>
        <div>
            <table class="layui-table" lay-filter="stockwarningvalid_detail_goods_occupied_Table"
                   id="stockwarningvalid_detail_goods_occupied_Table">
            </table>
            <div id="stockwarningvalid_detail_goods_occupied_title_type_10_desc" style="position: absolute;bottom:15px;" class="disN">
              <font color="red">说明:</font><br>
              <font color="red">1. 占用数量＜各平台预留数量和，可能是可用库存不够</font><br>
              <font color="red">2. 所有平台预留数量都是0时，如果有店铺还在售，也会占用1个</font>
            </div>
        </div>
      </div>
    </div>
</script>
<script  type="text/html" id="stockwarningvalid_detail_goods_occupied_number_1">
    {{# if (d.stockOutNumber) { }}
        {{ d.stockOutNumber }}
    {{# } }}
    {{# if (d.backNumber) { }}
    {{ d.backNumber }}
    {{# } }}
    {{# if (d.billNumber) { }}
    {{ d.billNumber }}
    {{# } }}
    {{# if (d.tranOrderId) { }}
    {{ d.tranOrderId }}
    {{# } }}
    {{# if (d.outTranOrderId) { }}
    {{ d.outTranOrderId }}
    {{# } }}
    {{# if (d.otherStorageNumber) { }}
    {{ d.otherStorageNumber }}
    {{# } }}
    {{# if (d.bizNumber) { }}
    {{ d.bizNumber }}
    {{# } }}
</script>
<script  type="text/html" id="stockwarningvalid_detail_goods_occupied_creator_1">
    {{# if (d.creator) { }}
    {{ d.creator }}
    {{# } }}
    {{# if (d.backCreator) { }}
    {{ d.backCreator }}
    {{# } }}
    {{# if (d.purCreator) { }}
    {{ d.purCreator }}
    {{# } }}
    {{# if (d.tranCreator) { }}
    {{ d.tranCreator }}
    {{# } }}
    {{# if (d.outTranCreator) { }}
    {{ d.outTranCreator }}
    {{# } }}
</script>
<script  type="text/html" id="stockwarningvalid_detail_goods_occupied_creator_time_1">
    {{# if (d.createTime) { }}
    {{ Format( d.createTime, "yyyy-MM-dd hh:mm:ss") }}
    {{# } }}
    {{# if (d.backCreateTime) { }}
    {{ Format( d.backCreateTime, "yyyy-MM-dd hh:mm:ss") }}
    {{# } }}
    {{# if (d.purCreateTime) { }}
    {{ Format( d.purCreateTime, "yyyy-MM-dd hh:mm:ss") }}
    {{# } }}
    {{# if (d.tranCreateTime) { }}
    {{ Format( d.tranCreateTime, "yyyy-MM-dd hh:mm:ss") }}
    {{# } }}
    {{# if (d.outCreateTime) { }}
    {{ Format( d.outCreateTime, "yyyy-MM-dd hh:mm:ss") }}
    {{# } }}
</script>
<script  type="text/html" id="stockwarningvalid_detail_goods_occupied_back_number_1">
    {{# if (d.storageNum) { }}
    {{ d.storageNum }}
    {{# } }}
    {{# if (d.backNum) { }}
    {{ d.backNum }}
    {{# } }}
    {{# if (d.planAmount) { }}
    {{ d.planAmount }}
    {{# } }}
    {{# if (d.planOutNumber) { }}
    {{ d.planOutNumber }}
    {{# } }}
    {{# if (d.outNumber) { }}
    {{ d.outNumber }}
    {{# } }}
    {{# if (d.notInStockAmount) { }}
    {{ d.notInStockAmount }}
    {{# } }}
</script>

<script type="text/html" id="stockWarningValid_salesInfo">
    <div class="alignLeft">
        <div><span style="color: grey">日均:</span>
            {{d.dailySaleNum3Valid != null ? d.dailySaleNum3Valid : ''}}
            {{# if (d.ifHighPurchase) {}}
            「<span style="color: red" title="高频次采购权重计算的日均销量">{{d.dailySaleNumHigh}}</span>」
            {{# } }}
            {{# if( d.dailySalesNumSection != null && d.dailySalesNumSection > 0){}}
            「<span style="color: blue" title="匹配暴跌权重计算的日均销量">{{d.dailySalesNumSection}}</span>」
            {{# } }}
        </div>
        <div><span style="color: grey">7天:</span>{{d.whSalesCount && d.whSalesCount.sevenSalesNum ? d.whSalesCount.sevenSalesNum : ''}}
            {{# if (d.whSalesCount && d.whSalesCount.outEbaySevenSales) { }}
            「<span title="ebay虚拟仓" class="fRed">
                {{d.whSalesCount.outEbaySevenSales}}
        </span>」
            {{# } }}
        </div>
        <div><span style="color: grey">15天:</span>{{d.whSalesCount && d.whSalesCount.fifteenSalesNum ? d.whSalesCount.fifteenSalesNum : ''}}
            {{# if (d.whSalesCount && d.whSalesCount.outEbayFifteenSales) { }}
            「<span title="ebay虚拟仓" class="fRed">
                {{d.whSalesCount.outEbayFifteenSales}}
        </span>」
            {{# } }}
        </div>
        <div><span style="color: grey">30天:</span>{{d.whSalesCount && d.whSalesCount.thirtySalesNum ? d.whSalesCount.thirtySalesNum : ''}}
            {{# if (d.whSalesCount && d.whSalesCount.outEbayThirtySales) { }}
            「<span title="ebay虚拟仓" class="fRed">
                {{d.whSalesCount.outEbayThirtySales}}
        </span>」
            {{# } }}
        </div>
    </div>
</script>
<script type="text/html" id="stockWarningValid_orderInfo">
    <div><span style="color: grey">7天:</span>{{d.whSalesCount && d.whSalesCount.sevenOrderNum ? d.whSalesCount.sevenOrderNum : ''}}</div>
    <div><span style="color: grey">15天:</span>{{d.whSalesCount && d.whSalesCount.fifteenOrderNum ? d.whSalesCount.fifteenOrderNum : ''}}</div>
    <div><span style="color: grey">30天:</span>{{d.whSalesCount && d.whSalesCount.thirtyOrderNum ? d.whSalesCount.thirtyOrderNum : ''}}</div>
    <div><span style="color: grey">7天采购频次:</span>{{d.purTimes || 0 }}</div>
    <div><span style="color: grey">AE全托管未占用数:</span>{{(d.aePreReservationStock || d.aePreReservationStock == 0) ? d.aePreReservationStock: ''}}</div>
</script>

<script type="text/html" id="stockWarningValid_supplierInfo">
    <div>
        {{# if (d.supplierRefDtos && d.supplierRefDtos.length > 0) {}}
        {{# for (var i = 0; i < d.supplierRefDtos.length; ++i) {}}
        <div><a href="{{ d.supplierRefDtos[i].purchaseUrl }}"  style="color:cornflowerblue" target="_blank">{{ d.supplierRefDtos[i].supplierName }}</a></div>
        {{# } }}
        {{# } }}
    </div>
</script>

<script type="text/html" id="payType_stockwarningvalid">
    {{# if(d.payType == 'alipay') {}}
    <div>支付宝</div>
    {{# }}}
    {{# if(d.payType == 'bank') {}}
    <div>银行转账</div>
    {{# }}}
</script>

<script type="text/html" id="stockwarningvalid_forecastPop">
    <div class="p20">
        <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
                <form class="layui-form" id="stockwarningvalid_forecastForm" lay-filter="stockwarningvalid_forecastForm">
                    <div class="layui-form-item">
                        <div class="layui-col-md5 layui-col-lg4">
                            <label class="layui-form-label">历史数据</label>
                            <div class="layui-input-block">
                                <select name="period">
                                    <option value="6" selected>半年</option>
                                    <option value="12">一年</option>
                                    <option value="24">两年</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md5 layui-col-lg4">
                            <label class="layui-form-label">预测天数</label>
                            <div class="layui-input-block">
                                <input type="number" name="forecastDay" class="layui-input" value="15"/>
                            </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2 ml20">
                            <div class="layui-btn layui-btn-sm" id="stockwarningvalid_forecastBtn">预测</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div>
            <div class="layui-form-item">
                <img width="900px" height="600px" id="stockwarningvalid_forecastImg">
            </div>
        </div>
    </div>

</script>


<script type="text/html" id="stockwarningvalid_exportPop">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_export_stockwarningvalid"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" id="export_stockwarningvalid_form">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">基本信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" title="子sku" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="图片" title="图片" lay-skin="primary"></div>
                        <div class="fieldBox" title="如果是长销款，当建议采购量 + 预计可用库存(含在途) ≥ 安全库存，则该值等于【建议采购量】；否则等于 【安全库存 - 预计可用库存】"><input type="checkbox" name="baseField" value="建议采购量(安全)" title="建议采购量(安全)"  checked lay-skin="primary"></div>
                        <div class="fieldBox" title="如果 (建议采购量 + 预计可用库存(含在途)) * 平均库存成本 > 最低库存金额，则该值等于【建议采购量】，否则等于 【最低库存金额/平均库存成本】"><input type="checkbox" name="baseField" value="建议采购量(最低)" title="建议采购量(最低)"  checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="建议采购量" title="建议采购量"  checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="商品名称" title="商品名称" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="单位" title="单位" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="仓库" title="仓库" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库位" title="库位" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="开发时间" title="开发时间" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购员" title="采购员" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="整合人员" title="整合人员" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="平均单价" title="平均单价" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购单价" title="采购单价" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库存金额" title="库存金额" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="预警周期" title="预警周期" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="到货天数" title="到货天数" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="实际到货天数" title="实际到货天数" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="周转天数" title="周转天数" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库存上限" title="库存上限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库存下限" title="库存下限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="按销量计算的库存上限" title="按销量计算的库存上限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="按销量计算的库存下限" title="按销量计算的库存下限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="30天有销量设置库存上限" title="30天有销量设置库存上限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="30天有销量设置库存下限" title="30天有销量设置库存下限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购单价设置库存上限" title="采购单价设置库存上限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购单价设置库存下限" title="采购单价设置库存下限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="占用库存" title="占用库存" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="可用库存" title="可用库存(不含在途)" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="未入库数" title="未入库数" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购未入库数" title="采购未入库数" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="调拨未入库数" title="调拨未入库数" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="缺货占用" title="缺货占用" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="缺货待派" title="缺货待派" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="预计可用" title="预计可用(含在途)" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="日均销量" title="日均销量" checked lay-skin="primary"></div>
                        <div class="fieldBox" title="按照高频次采购销量权重计算的日均销量"><input type="checkbox" name="baseField" value="高频次日均销量" title="高频次日均销量" checked lay-skin="primary"></div>
                        <div class="fieldBox" title="按照暴跌参数权重计算的日均销量"><input type="checkbox" name="baseField" value="暴跌权重日均销量" title="暴跌权重日均销量" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="匹配暴跌销量" title="匹配暴跌销量" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="5日销量" title="5日销量" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="7日销量" title="7日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="15日销量" title="15日销量" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="30日销量" title="30日销量" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="60日销量" title="60日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="90日销量" title="90日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="5日订单" title="5日订单" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="15日订单" title="15日订单" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="30日订单" title="30日订单" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="ebay虚拟仓5日销量" title="ebay虚拟仓5日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="ebay虚拟仓7日销量" title="ebay虚拟仓7日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="ebay虚拟仓15日销量" title="ebay虚拟仓15日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="ebay虚拟仓30日销量" title="ebay虚拟仓30日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="ebay虚拟仓60日销量" title="ebay虚拟仓60日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="ebay虚拟仓90日销量" title="ebay虚拟仓90日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="同库位sku数" title="同库位sku数" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="近15天采购次数" title="近15天采购次数" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="近30天采购次数" title="近30天采购次数" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="7天采购次数" title="7天采购次数" checked lay-skin="primary"></div>
                        <div class="fieldBox" title="根据参数设置中，高频次采购销量权重参数判断，是否高频次采购"><input type="checkbox" name="baseField" value="高频次采购" title="高频次采购" checked lay-skin="primary"></div>
                        <div class="fieldBox" title="根据参数设置中，长销款定义判断是否长销款"><input type="checkbox" name="baseField" value="是否长销款" title="是否长销款" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="安全库存" title="安全库存" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="是否在售" title="是否在售" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="待调整价" title="待调整价" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="建议采购数量(平台求和)" title="建议采购数量(平台求和)"  checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="各平台库存上下限和" title="各平台库存上下限和" lay-skin="primary"></div>

                        <div class="fieldBox notYWField"><input type="checkbox" name="baseField" value="义乌仓7日销量" title="义乌仓7日销量"  checked lay-skin="primary"></div>
                        <div class="fieldBox notYWField"><input type="checkbox" name="baseField" value="义乌仓15日销量" title="义乌仓15日销量"  checked lay-skin="primary"></div>
                        <div class="fieldBox notYWField"><input type="checkbox" name="baseField" value="义乌仓30日销量" title="义乌仓30日销量"  checked lay-skin="primary"></div>
                        <div class="fieldBox notYWField"><input type="checkbox" name="baseField" value="义乌仓日均销量" title="义乌仓日均销量"  checked lay-skin="primary"></div>
                        <div class="fieldBox notYWField"><input type="checkbox" name="baseField" value="义乌仓可用库存" title="义乌仓可用库存"  checked lay-skin="primary"></div>
                        <div class="fieldBox notYWField"><input type="checkbox" name="baseField" value="义乌仓预计可用(含在途)" title="义乌仓预计可用(含在途)"  checked lay-skin="primary"></div>
                        <div class="fieldBox notYWField"><input type="checkbox" name="baseField" value="义乌仓周转天数" title="义乌仓周转天数"  checked lay-skin="primary"></div>


                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">供应商信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="供应商名称" title="供应商名称" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="货号" title="货号" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购Url1" title="采购Url1" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购Url2" title="采购Url2" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购Url3" title="采购Url3" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购Url4" title="采购Url4" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购Url5" title="采购Url5" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="最小订货量" title="最小订货量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="供应商报价" title="供应商报价" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="供应商备注" title="供应商备注" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="默认采购链接类型" title="默认采购链接类型" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="是否多属性" title="是否多属性" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="offerId" title="offerId" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="specId" title="specId" checked lay-skin="primary"></div>

                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">父商品信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="父sku" title="父sku" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="业绩归属人" title="开发专员" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="责任归属人" title="责任人" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="开发类型" title="开发类型" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="需要质检" title="需要质检" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="商品标签" title="商品标签" checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="类目" title="类目" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="独立包装" title="独立包装" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="独立包装备注" title="独立包装备注" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="特殊包装" title="特殊包装" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="特殊包装备注" title="特殊包装备注" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="报关中文" title="报关中文" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="报关英文" title="报关英文" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="报关价值$" title="报关价值$" lay-skin="primary"></div>
                        <div style="clear:left"></div>

                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">平台统计信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="AE全托管未占用数" title="AE全托管未占用数" checked lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<%--<script id="pre_generate_pur_order_pop" type="text/html">--%>
    <%--<div class="layui-tab-content">--%>
        <%--<div class="layui-tab-item layui-show">--%>
            <%--<form class="layui-form" id="pre_generate_pur_order_form" lay-filter="pre_generate_pur_order_form">--%>
                <%--<div class="layui-form-item">--%>
                    <%--<div class="layui-col-md2 layui-col-lg2">--%>
                        <%--<label class="layui-form-label">采购算法</label>--%>
                        <%--<div class="layui-input-block">--%>
                            <%--<input type="text" name="countMethod" class="layui-input" disabled/>--%>
                        <%--</div>--%>
                    <%--</div>--%>
                    <%--<div class="layui-col-md2 layui-col-lg2">--%>
                        <%--<label class="layui-form-label">预计到货时间</label>--%>
                        <%--<div class="layui-input-block">--%>
                            <%--<input type="text" name="preDlvrDate" class="layui-input" disabled/>--%>
                        <%--</div>--%>
                    <%--</div>--%>
                    <%--<div class="layui-col-md3 layui-col-lg3">--%>
                        <%--<label class="layui-form-label">付款方式</label>--%>
                        <%--<div class="layui-input-block">--%>
                            <%--<select name="payType">--%>
                                <%--<option></option>--%>
                            <%--</select>--%>
                        <%--</div>--%>
                    <%--</div>--%>

                    <%--<div class="layui-col-md3 layui-col-lg3">--%>
                        <%--<label class="layui-form-label">采购员</label>--%>
                        <%--<div class="layui-input-block">--%>
                            <%--<select class="layui-input" type="text" name="mainBuyerId" lay-search>--%>
                            <%--</select>--%>
                        <%--</div>--%>
                    <%--</div>--%>

                    <%--<div class="layui-col-md2 layui-col-lg2">--%>
                        <%--<div class="layui-btn layui-btn-sm ml20" id="UpdatePurOrderMainInfoByListBtn">批量修改</div>--%>
                    <%--</div>--%>
                <%--</div>--%>

                <%--<div>--%>
                    <%--<div class="layui-card">--%>
                        <%--<div class="layui-card-header">--%>
                            <%--<span>主表信息</span>--%>
                        <%--</div>--%>
                        <%--<div class="layui-card-body">--%>
                            <%--<table class="layui-table" id="purOrderMainTable" lay-filter="purOrderMainTable">--%>

                            <%--</table>--%>
                        <%--</div>--%>
                    <%--</div>--%>
                <%--</div>--%>

                <%--<div>--%>
                    <%--<div class="layui-card">--%>
                        <%--<div class="layui-card-header">--%>
                            <%--<span>子表信息</span>--%>
                        <%--</div>--%>
                        <%--<div class="layui-card-body">--%>
                            <%--<table class="layui-table" id="purOrderDetailTable" lay-filter="purOrderDetailTable">--%>

                            <%--</table>--%>
                        <%--</div>--%>
                    <%--</div>--%>
                <%--</div>--%>

            <%--</form>--%>
        <%--</div>--%>
    <%--</div>--%>
<%--</script>--%>

<script type="text/html" id="ifSpeedBox">
    <div><input type="checkbox" lay-skin="primary" class="ifspeedCheckBox" lay-filter="ifSpeedCheckBox" {{d.ifSpeed ? 'checked' : ''}}/></div>
</script>

<script type="text/html" id="purNoteBox">
    <div><input class="layui-input purNoteInp" value="{{d.memo || ''}}"/></div>
</script>

<script type="text/javascript" src="${ctx}/static/js/purchases/stockwarningvalid.js"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>

<script type="text/javascript">
    var currentUserName = `${currentUser.userName}`
    var allBuyer = $('#buyerBox_stockwarningvalid li[data-text='+ currentUserName + ']')
    console.log(allBuyer)
    if (allBuyer && allBuyer.length > 0) {
        $('#stockwarningvalid_searchForm [name=buyer]').val(currentUserName)
    }
</script>

<style>
    .fieldBox{
        float: left;
        width: 12.5%;
        height: 25px;
    }
</style>