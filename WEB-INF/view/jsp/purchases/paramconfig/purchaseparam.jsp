<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>采购参数调整</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form" id="purchaseParamSearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg1 layui-col-md1">
                                <select name="warehouseId" id="purchaseparam_storeId" lay-search>
                                </select>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购员</label>
                                <div class="layui-input-block">
                                    <select name="buyerId" xm-select="buyer_purchaseOrder" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='buyer_purchaseOrder' lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${buyers}" var="buyer">
                                            <option value="${buyer.id}">${buyer.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">整合人员</label>
                                <div class="layui-input-block">
                                    <select name="integratorId" xm-select="integrator_purchaseOrder" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='integrator_purchaseOrder' lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${integrators}" var="integrator">
                                            <option value="${integrator.id}">${integrator.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerId" xm-select="bizzOwner_purchaseOrder" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='bizzOwner_purchaseOrder' lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${bizzOwners}" var="bizzOwner">
                                            <option value="${bizzOwner.id}">${bizzOwner.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="prodAttrList" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${prodTags}" var="tag">
                                            <option value="${tag.name}">${tag.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale">
                                        <option value="">全部</option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">是否定制</label>
                                <div class="layui-input-block">
                                    <select name="isSpecialMake">
                                        <option value="">全部</option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg4">
                                <div class="layui-form-label label_reset" style="padding: 0 15px">
                                    <select name="searchType" class="hiddenContent">
                                        <option value="sSku">子SKU</option>
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku2">子SKU(精确)</option>
                                        <option value="pSku2">父SKU(精确)</option>
                                        <%--<option value="6">商品名称</option>--%>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="searchValue" maxlength="2000" type="text" class="layui-input" placeholder="sku支持多个精确查询,英文逗号分隔" />
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">采购到货天数</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="purchaseDlvrDaysMin" autocomplete="off" class="layui-input">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="purchaseDlvrDaysMax" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">库存预警周期</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="stockWarnCycleMin" autocomplete="off" class="layui-input">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="stockWarnCycleMax" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">近30天销量</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="thirtySalesNumMin" autocomplete="off" class="layui-input">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="thirtySalesNumMax" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md3">
                                <label class="layui-form-label">库存周转天数</label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="stockAvailableDaysMin" autocomplete="off" class="layui-input">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="stockAvailableDaysMax" autocomplete="off" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">供应商</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="supplierId">
                                    <div>
                                        <input id="searchSupplier_purchaseparam"  name="supplierName" class="layui-input" />
                                    </div>
                                    <div class="dimResultDiv"></div>
                                </div>
                            </div>
<%--                            <div class="layui-col-md2 layui-col-lg2">--%>
<%--                                <label class="layui-form-label">实际与理论一致</label>--%>
<%--                                <div class="layui-input-block">--%>
<%--                                    <select name="ifSameAsPurchaseParam">--%>
<%--                                        <option value="">全部</option>--%>
<%--                                        <option value="1">是</option>--%>
<%--                                        <option value="0">否</option>--%>
<%--                                    </select>--%>
<%--                                </div>--%>
<%--                            </div>--%>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <select name="orderByType" class="hiddenContent">
                                        <option value="s.id desc">创建时间倒序</option>
                                        <option value="s.id asc">创建时间正序</option>
                                        <option value="s.stock_warn_cycle desc">库存预警周期倒序</option>
                                        <option value="s.stock_warn_cycle asc">库存预警周期正序</option>
                                        <option value="s.purchase_dlvr_days desc">采购到货天数倒序</option>
                                        <option value="s.purchase_dlvr_days asc">采购到货天数正序</option>
                                        <option value="t4.thirty_sales_num desc">30天销量倒序</option>
                                        <option value="t4.thirty_sales_num asc">30天销量正序</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md4 layui-col-lg4 fr">
                                <div class="layui-input-inline">
                                    <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" data-type="reload" id="searchBtn_purchaseParam">搜索</button>
                                    <button type="reset" id="searchReset_purchaseparam" class="layui-btn layui-btn-primary layui-btn-sm" >清空</button>
                                </div>
                            </div>

                        </div>
                    </form>

                </div>
            </div>
            <div class="layui-card" id="purchaseParammanageCard">
                <div class="layui-card-body">
                    <span class="fl numCount">总数(<span id="purchaseParam_colLen"></span>)</span>
                    <span class="fl">
                    <permTag:perm funcCode="purchaseparam_batchCalculate">
                        <button type="button" class="layui-btn layui-btn-sm" id="purchaseparam_calculateBatch">批量计算</button>
                    </permTag:perm>

                    </span>
                    <span class="fr">
                    <permTag:perm funcCode="purchaseparam_updateByExcel">
                        <button type="button" class="layui-btn layui-btn-sm" id="purchaseparam_downUpdateTemplate">下载修改模板</button>
                        <button type="button" class="layui-btn layui-btn-sm" id="purchaseparam_updateByExcelBtn" onclick="document.getElementById('purchaseparam_updateByExcelFile').click()">导入修改</button>
                        <input type="file" id="purchaseparam_updateByExcelFile" hidden="">
                    </permTag:perm>
                    <permTag:perm funcCode="purchaseparam_globalCalculate">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-warm" id="recalculate_purchaseparam">全量计算</button>
                    </permTag:perm>
                    </span>
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="purchaseParamTable" lay-filter="purchaseParamTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

      
<script type="text/javascript" src="${ctx}/static/js/purchases/purchaseparam.js"></script>

<script type="text/html" id="isSale_purchaseparam">
    {{# if (d.isSale == true) { }}
    <%--<input type="checkbox" lay-skin="primary" checked disabled>--%>
    <div class="layui-unselect layui-form-checkbox layui-form-checked layui-checkbox-disbaled layui-disabled"
         lay-skin="primary">
        <i class="layui-icon layui-icon-ok"></i>
    </div>
    {{# }else{ }}
    <%--<input type="checkbox" lay-skin="primary" disabled>--%>
    <div class="layui-unselect layui-form-checkbox layui-checkbox-disbaled layui-disabled"
         lay-skin="primary">
        <i class="layui-icon layui-icon-ok"></i>
    </div>
    {{# }}}
</script>
<script type="text/html" id="purchaseDlvrDays_purchaseparam">
    {{ d.whPurchaseParam != null && d.whPurchaseParam.purchaseDlvrDays != null ? d.whPurchaseParam.purchaseDlvrDays : '' }}
</script>
<script type="text/html" id="upperStock_purchaseparam">
    <div>{{d.whPurchaseParam != null && d.whPurchaseParam.upperStock != null ? d.whPurchaseParam.upperStock : ''}}</div>
</script>
<script type="text/html" id="lowerStock_purchaseparam">
    <div>{{d.whPurchaseParam != null && d.whPurchaseParam.lowerStock != null ? d.whPurchaseParam.lowerStock : ''}}</div>
</script>

<script type="text/html" id="stockWarnCycle_purchaseparam">
    {{ d.whPurchaseParam != null && d.whPurchaseParam.stockWarnCycle != null? d.whPurchaseParam.stockWarnCycle : '' }}
</script>

<script type="text/html" id="stockAbleDays_purchaseparam">
    <div>{{ (d.whStockWarning != null && d.whStockWarning.dailySaleNum3Valid) ? accDiv((d.whStockWarning.stockNum - d.whStockWarning.reservationNum), d.whStockWarning.dailySaleNum3Valid).toFixed(2) : '' }}</div>
</script>

<script type="text/html" id="dailySaleNum3_purchaseparam">
    <div>{{ d.whStockWarning.dailySaleNum3Valid ? d.whStockWarning.dailySaleNum3Valid : '' }}</div>
</script>

<script type="text/html" id="orderNum_purchaseparam">
    <div>{{d.whSalesCount && d.whSalesCount.fiveOrderNum != null ? (d.whSalesCount.fiveOrderNum + ' / ' + d.whSalesCount.fifteenOrderNum + ' / ' + d.whSalesCount.thirtyOrderNum) : ''}}</div>
</script>

<script type="text/html" id="person_purchaseparam">
    <div class="taLeft"><span class="fGrey">开发: </span> {{ d.parent.bizzOwner || '' }}</div>
    <div class="taLeft"><span class="fGrey">采购： </span> {{ d.buyer || ''}}</div>
    <div class="taLeft"><span class="fGrey">整合： </span> {{ d.integrator || '' }}</div>
</script>
<script type="text/html" id="supplier_purchaseparam">
    <div>
        {{# if (d.supplier && d.supplier.length > 0) {}}
        {{# for (var i = 0; i < d.supplier.length; ++i) {}}
        <div><a href="{{ d.supplier[i].purchaseUrl }}"  style="color:cornflowerblue" target="_blank">{{ d.supplier[i].supplierName }}</a>
            {{# if (d.supplier[i].offerId) {}}
            <i class="layui-icon layui-icon-face-smile" style="font-size: 15px; color: cornflowerblue;" title="已经匹配1688信息">&#xe6af;</i>
            {{#}}}
        </div>

        {{# } }}
        {{# } }}
    </div>
</script>
<script type="text/html" id="sku_purchaseparam">
    <div>{{d.sSku}}</div>
    <div style="text-align: left;color:#999;font-size: 5px">
        {{d.parent.prodAttrList || ''}}
    </div>
</script>

<script type="text/html" id="tableTime_purchaseparam">
    <div><span class="secondary">创建：</span>{{format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>
    {{# if(d.whPurchaseParam && d.whPurchaseParam.updateTime) {}}
    <div><span class="secondary">计算：</span>{{format(d.whPurchaseParam ? d.whPurchaseParam.updateTime : '',"yyyy-MM-dd hh:mm:ss")}}</div>
    {{# } }}
</script>