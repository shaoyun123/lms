<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>库存信息</title>
<style>
    .specialSpan{
        width: 24px;
        line-height: 24px;
        height: 24px;
        border-radius: 12px;
        text-align: center;;
    }
    /* 时间线树 */
    .timeLineTree {
        position: fixed;
        z-index: 1000;
        right: 100px;
    }

    .timeLineTree li {
        padding: 6px 15px;
    }

    .timeLineTree li a,
    .timeLineTree li i {
        color: #1e9fff;
    }

</style>
<div class="layui-fluid" id="LAY-work-develop-pl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="component-form-grup" id="whstock_searchForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="whstock_searchCate_btn">选择分类</button>
                                    <input type="hidden" name="cateId" value="" id="whstock_cateId_search_Inp">
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('pl_search_cate','whstock_cateId_search_Inp')"
                                       style="cursor:pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="storeId">
                                        <option></option>
                                        <!-- <c:forEach items="${storeList}" var="store">
                                            <option value="${store.id}" ${store.isDefault ? 'selected' : ''}>${store.warehouseName}</option>
                                        </c:forEach> -->
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">整合人员</label>
                                <div class="layui-input-block" hp-select>
                                    <div hidden hp-select-data id="whstockintegrators">
                                        <!-- <c:forEach items="${integrators}" var="integrator">
                                            <li data-value="${integrator.id}" hp-select-li>${integrator.userName}</li>
                                        </c:forEach> -->
                                    </div>
                                    <input class="layui-input" name="integrator" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block" hp-select>
                                    <div hidden hp-select-data id="whstockbuyers">
                                        <!-- <c:forEach items="${buyers}" var="buyer">
                                            <li data-value="${buyer.id}" hp-select-li>${buyer.userName}</li>
                                        </c:forEach> -->
                                    </div>
                                    <%--<input hidden name="buyerId" hp-select-value>--%>
                                    <input class="layui-input" name="buyer" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div id="buyerOptionBox" class="disN">
                                <option></option>
                                <!-- <c:forEach items="${buyers}" var="buyer">
                                    <option value="${buyer.id}">${buyer.userName}</option>
                                </c:forEach> -->
                            </div>
                            <div id="payTypeOptionBox" class="disN">
                                <option></option>
                                <!-- <c:forEach items="${payTypeList}" var="payType">
                                    <option value="${payType.code}">${payType.name}</option>
                                </c:forEach> -->
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale" value="1">
                                        <option value="">全部</option>
                                        <option value="true" selected="selected">在售</option>
                                        <option value="false">停售</option>
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
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">子SKU</option>
                                        <option value="pSku2">父SKU(精确)</option>
                                        <option value="sSku2" selected="selected">子SKU(精确)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="searchValue" type="text" class="layui-input" placeholder="多个逗号分隔">
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block" hp-select>
                                    <div hidden hp-select-data id="whstockbizzOwners">
                                        <!-- <c:forEach items="${bizzOwners}" var="developer">
                                            <li data-value="${developer.id}" hp-select-li>${developer.userName}</li>
                                        </c:forEach> -->
                                    </div>
                                    <input class="layui-input" name="bizzOwner" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品名称</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="title">
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">供应商</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="supplierId">
                                    <div>
                                        <input id="whstock_searchSupplier" name="supplierName" class="layui-input"/>
                                    </div>
                                    <div class="dimResultDiv"></div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="searchTimeType">
                                        <option value="1">创建时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="searchTime" id="whstock_searchTime">
                                </div>
                            </div>
                            <%--<div class="layui-col-md2 layui-col-lg2">--%>
                            <%--<label class="layui-form-label">库位</label>--%>
                            <%--<div class="layui-input-block" >--%>
                            <%--<input class="layui-input" name="stockLocation">--%>
                            <%--</div>--%>
                            <%--</div>--%>
                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">采购到货天数</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="purchaseReceiveDays_min" autocomplete="off"
                                               class="layui-input" placeholder="包含">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="purchaseReceiveDays_max" autocomplete="off"
                                               class="layui-input" placeholder="包含">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">预警周期</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="stockWarnSycle_min" autocomplete="off"
                                               class="layui-input" placeholder="包含">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="stockWarnSycle_max" autocomplete="off"
                                               class="layui-input" placeholder="包含">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="stockType">
                                        <option value="availableStock">可用库存</option>
                                        <option value="currentStock">真实库存</option>
                                        <option value="onwayStock">在途</option>
                                        <option value="preAvailabelStock">预计可用(不含在途)</option>
                                        <option value="preAvailabelStockAll">预计可用(含在途)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="stockMin" autocomplete="off"
                                               class="layui-input" placeholder="包含">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="stockMax" autocomplete="off"
                                               class="layui-input" placeholder="包含">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderByType">
                                        <option value="1">创建时间倒序</option>
                                        <option value="2">创建时间正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">库位</label>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-md9 layui-col-lg8">
                                        <input name="locationCodeList" type="text" class="layui-input"
                                            placeholder="库位名称，支持多个逗号分隔，精确查询">
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg4">
                                        <select id="stockLocation_searchtype_sel" name="locationCodeSearchType">
                                            <option value="0">精确</option>
                                            <option value="1">模糊</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2"
                                 style="padding-left:32px;margin-top:2px;float: right">
                                <button id="whstock_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button"
                                        data-type="reload">搜索
                                </button>
                                <button type="reset" id="whstock_resetBtn"
                                        class="layui-btn layui-btn-primary layui-btn-sm">清空
                                </button>
                            </div>
                        </div>
                        <div class="layui-col-l12 layui-col-md12" id="whstock_search_cate"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="whstockCard">
                <div class="layui-card-header">
                    <span class="numCount">库存信息(<span id="total_whstock"></span>)</span>
                    <span class="ml10">
                        <permTag:perm funcCode="exportwhstock_whstock">
                            <button type="button" class="layui-btn layui-btn-sm" id="exportwhstock_whstock">导出</button>
                        </permTag:perm>
                    </span>
                    <span style="float:right;">
                        <permTag:perm funcCode="whstock_updateSelectSkuNumBtn_auth">
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="whstock_updateSelectSkuNumBtn">
                            更新选择SKU占用数量
                        </span>
                        
                        </permTag:perm>
                        <!-- 
                        <permTag:perm funcCode="whstock_updateAllSkuNumBtn_auth">
                            <span class="layui-btn layui-btn-sm" id="whstock_updateAllSkuNumBtn">更新所有SKU占用数量</span>
                        </permTag:perm> -->
                    </span>
                </div>
                <div class="layui-card-body" id="whstockTableContain">
                    <table class="layui-table" id="whstockTable" lay-filter="whstockTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 弹出框信息 -->

<%--图片--%>
<script type="text/html" id="image_whstock">
    {{# if(typeof(d.prodSInfoDto.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.prodSInfoDto.image }}"
         class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{# } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png" class="pointHand b1 lazy"
         data-onerror="layui.admin.img_noFind()"/>
    {{# } }}
</script>

<script type="text/html" id="whstock_skuInfo">
    <div><span style="color: grey">「{{d.storeName}}」</span></div>
    <div><span style="color: grey">SKU:</span>{{d.sSku}}</div>
    <%--<div><span style="color: grey">库位:</span>{{d.stockLocation ? d.stockLocation : ''}}</div>--%>
    <%--<div><span style="color: grey">开发时间:</span>{{Format(new Date(d.prodSInfoDto.createTime), "yyyy-MM-dd")}}</div>--%>
</script>

<script type="text/html" id="whstockoptionTpl">
    {{#   layui.each(d, function(index, item){ }}
    <option value="{{item.id}}">{{item.warehouseName}}</option>
    {{# }) }}
</script>

<script type="text/html" id="whstock_Info">
    <div>{{d.prodSInfoDto.title}}</div>
    <div>
      <span style="color: grey">类目:</span>{{(d.prodSInfoDto.cateDto && d.prodSInfoDto.cateDto.cateCnName) || ''}}
    </div>
    <div><span style="color: grey">单位:</span>{{d.prodSInfoDto.unit ? d.prodSInfoDto.unit : ''}}
        {{# if (d.prodSInfoDto.isSpecialMake) {}}
        <span class="layui-badge layui-bg-blue specialSpan fr" title="定制产品">定</span>
        {{# }}}
    </div>
    <div></div>
</script>

<script type="text/html" id="whstock_userInfo">
    <div><span style="color: grey">采购:</span>{{d.prodSInfoDto.buyer}}</div>
    <div><span style="color: grey">整合:</span>{{d.prodSInfoDto.integrator ? d.prodSInfoDto.integrator : ''}}</div>
    <div><span style="color: grey">开发:</span>{{d.prodSInfoDto.parent.bizzOwner}}</div>

</script>
<script type="text/html" id="whstock_priceInfo">
    <div><span style="color: grey">库存成本:</span>{{d.avgCost}}</div>
    <div><span style="color: grey">采购成本:</span>{{d.prodSInfoDto.purchaseCostPrice}}</div>
    <div><span style="color: grey">库存金额:</span>{{accMul(d.currentStock, d.avgCost)}}</div>
</script>

<script type="text/html" id="whstock_purchaseInfo">
    <div><span style="color: grey">预警周期:</span>{{d.whPurchaseParam && d.whPurchaseParam.stockWarnCycle ? d.whPurchaseParam.stockWarnCycle : ''}}</div>
    <div><span style="color: grey">到货天数:</span>{{d.whPurchaseParam && d.whPurchaseParam.purchaseDlvrDays ? d.whPurchaseParam.purchaseDlvrDays : ''}} </div>
</script>
<script type="text/html" id="whstock_RealSalesVolume">
    <div><span style="color: grey">日均:</span>{{ d.averageDailySales||'' }}</div>
    <div><span style="color: grey">7日:</span>{{ d.realSales7||'' }} </div>
    <div><span style="color: grey">15日:</span>{{ d.realSales15||'' }} </div>
    <div><span style="color: grey">30日:</span>{{ d.realSales30||'' }} </div>
</script>

<script type="text/html" id="whstock_stockInfo">
    <div>
    <input type="hidden" class="whstockId" value="{{d.id}}">
    <input type="hidden" class="whstock_prodSId" value="{{d.prodSId}}">
    <input type="hidden" class="whstock_storeId" value="{{d.storeId}}">
    <input type="hidden" class="whstock_sSku" value="{{d.sSku||''}}">
    <div><span style="color: grey">当前库存:</span>{{d.currentStock}}</div>
    <div><span style="color: grey">有货占用:</span><span lay-event="whstockDetail" style="cursor:pointer;color:#6998ee;">{{d.reservationStock}}</span></div>
    <div><span style="color: grey">在途库存:</span><span lay-event="whstockDetail1" style="cursor:pointer;color:#6998ee;">{{d.onwayStock}}</span></div>
    <div><span style="color: grey">虚拟占用:</span><span lay-event="whstockDetail2" style="cursor:pointer;color:#6998ee;">{{d.preReservationStock}}</span></div>
    <div><span style="color: grey">缺货待派:</span>{{d.lackUnreservationStock}}</div>
    </div>
</script>

<script type="text/html" id="whstock_supplierInfo">
    <div>
        {{# if (d.prodSInfoDto.supplier && d.prodSInfoDto.supplier.length > 0) {}}
        {{# for (var i = 0; i < d.prodSInfoDto.supplier.length; ++i) {}}
        <div><a href="{{ d.prodSInfoDto.supplier[i].purchaseUrl }}" style="color:cornflowerblue" target="_blank">{{
            d.prodSInfoDto.supplier[i].supplierName || '' }}</a></div>
        {{# } }}
        {{# } }}
    </div>
</script>

<script type="text/html" id="whstock_exportPop">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_export_whstock"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" id="export_whstock_form">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">库存信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" title="子sku" disabled lay-skin="primary" checked>
                        </div>
                        <div class="fieldBox"><input type="checkbox" title="仓库" disabled lay-skin="primary" checked>
                        </div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="当前库存" title="当前库存"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="有货占用" title="有货占用"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="在途库存" title="在途库存"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="虚拟占用" title="虚拟占用"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="缺货待派" title="缺货待派"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="平均单价" title="平均单价"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库位" title="库位"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="预留占用" title="预留占用"
                                                     lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">商品信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="图片" title="图片"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="父sku" title="父sku"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="商品名称" title="商品名称"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="类目" title="类目"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="单位" title="单位"
                                                     lay-skin="primary"></div>
                        <%--<div class="fieldBox"><input type="checkbox" name="baseField" value="库位" title="库位" lay-skin="primary"></div>--%>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="开发时间" title="开发时间"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购员" title="采购员"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="整合人员" title="整合人员"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="业绩归属人" title="开发专员"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购单价" title="采购单价"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库存金额" title="库存金额"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="预警周期" title="预警周期"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="到货天数" title="到货天数"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="7日销量" title="7日销量"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="15日销量" title="15日销量"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="30日销量" title="30日销量"
                                                     lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">供应商信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="供应商名称" title="供应商名称"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购Url1" title="采购Url1"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购Url2" title="采购Url2"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购Url3" title="采购Url3"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购Url4" title="采购Url4"
                                                     lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购Url5" title="采购Url5"
                                                     lay-skin="primary"></div>
                        <%--<div class="fieldBox"><input type="checkbox" name="baseField" value="最小订货量" title="最小订货量" lay-skin="primary"></div>--%>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="供应商报价" title="供应商报价"
                                                     lay-skin="primary"></div>
                        <%--<div class="fieldBox"><input type="checkbox" name="baseField" value="供应商备注" title="供应商备注" lay-skin="primary"></div>--%>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>


<script  type="text/html" id="whstock_detail_goods_occupied_script">
    <div style="padding:10px;">
      <div class="layui-tab" lay-filter="whstock_detail_goods_occupied_title_type">
        <div style="height:40px;line-height:40px;">
            <ul class="layui-tab-title">
                <li data-value="1" class="layui-this">出库占用(<span id="whstock_detail_goods_occupied_title_type_1"/>)</li>
                <li data-value="2" >订单占用(<span id="whstock_detail_goods_occupied_title_type_2"/>)</li>
                <li data-value="3">FBA货件计划占用(<span id="whstock_detail_goods_occupied_title_type_3"/>)</li>
                <li data-value="5">中转仓货件计划占用(<span id="whstock_detail_goods_occupied_title_type_5"/>)</li>
                <li data-value="9">自拍图占用(<span id="whstock_detail_goods_occupied_title_type_9"/>)</li>
                <li data-value="4">待入库明细(<span id="whstock_detail_goods_occupied_title_type_4"/>)</li>
                <li data-value="6">FBA铺货需求占用(<span id="whstock_detail_goods_occupied_title_type_6"/>)</li>
                <li data-value="7">组合品生产占用(<span id="whstock_detail_goods_occupied_title_type_7"/>)</li>
                <li data-value="8">虚拟占用(<span id="whstock_detail_goods_occupied_title_type_8"/>)</li>
                <li data-value="10">预留占用(<span id="whstock_detail_goods_occupied_title_type_10"/>)</li>
            </ul>
        </div>
        <div>
            <table class="layui-table" lay-filter="whstock_detail_goods_occupied_Table"
                   id="whstock_detail_goods_occupied_Table">
            </table>
            <div id="whstock_detail_goods_occupied_title_type_10_desc" style="position: absolute;bottom:15px;" class="disN">
              <font color="red">说明:</font><br>
              <font color="red">1. 占用数量＜各平台预留数量和，可能是可用库存不够</font><br>
              <font color="red">2. 所有平台预留数量都是0时，如果有店铺还在售，也会占用1个</font>
            </div>
        </div>
      </div>
    </div>
</script>

<script  type="text/html" id="whstock_detail_goods_occupied_number_1">
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
<script  type="text/html" id="whstock_detail_goods_occupied_creator_1">
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
<script  type="text/html" id="whstock_detail_goods_occupied_creator_time_1">
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
<script  type="text/html" id="whstock_detail_goods_occupied_back_number_1">
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

<script type="text/javascript" src="${ctx}/static/js/warehouse/whstock.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<style>
    .fieldBox {
        float: left;
        width: 12.5%;
        height: 25px;
    }
</style>

<%--库存明细弹窗--%>
<script type="text/html" id="whStockDetail">
    <div class="timeLineTree">
        <ul>
            <li data-id="issueOccupation" onclick="tplLocation(this)">
                <i class="layui-icon layui-icon-tree"></i>
                <a href="javascript:;">出库占用</a>
            </li>
            <li data-id="orderOccupation" onclick="tplLocation(this)">
                <i class="layui-icon layui-icon-tree"></i>
                <a href="javascript:;">订单占用</a>
            </li>
            <li data-id="FBAOccupation" onclick="tplLocation(this)">
                <i class="layui-icon layui-icon-tree"></i>
                <a href="javascript:;">FBA货件计划占用</a>
            </li>
            <li data-id="PlatWhShipmnetOccupation" onclick="tplLocation(this)">
                <i class="layui-icon layui-icon-tree"></i>
                <a href="javascript:;">中转仓货件计划占用</a>
            </li>
            <li data-id="detailsOccupation" onclick="tplLocation(this)">
                <i class="layui-icon layui-icon-tree"></i>
                <a href="javascript:;">待入库明细</a>
            </li>
        </ul>
    </div>
    <div style="width: 80%;">
        <fieldset class="layui-elem-field layui-field-title site-demo-button" id="issueOccupation">
            <legend style="font-size:14px">出库占用(<span></span>)</legend>
        </fieldset>
        <table class="layui-table layui-table-" id="issueOccupationTable"></table>
        <fieldset class="layui-elem-field layui-field-title site-demo-button" id="orderOccupation">
            <legend style="font-size:14px">订单占用(<span></span>)</legend>
        </fieldset>
        <table class="layui-table" id="orderOccupationTable"></table>
        <fieldset class="layui-elem-field layui-field-title site-demo-button" id="FBAOccupation">
            <legend style="font-size:14px">FBA货件计划占用(<span></span>)</legend>
        </fieldset>
        <table class="layui-table" id="FBAOccupationTable"></table>
        <fieldset class="layui-elem-field layui-field-title site-demo-button" id="PlatWhShipmnetOccupation">
            <legend style="font-size:14px">中转仓货件计划占用(<span></span>)</legend>
        </fieldset>
        <table class="layui-table" id="PlatWhShipmnetOccupationTable"></table>
        <fieldset class="layui-elem-field layui-field-title site-demo-button" id="detailsOccupation">
            <legend style="font-size:14px">待入库明细(<span></span>)</legend>
        </fieldset>
        <table class="layui-table" id="detailsOccupationTable"></table>
    </div>
</script>