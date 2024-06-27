<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>发货计划</title>

<style>
    .w_40 {
        width: 40% !important;
    }

    .flex_between {
        display: flex;
        justify-content: space-between;
    }
</style>
<div class="layui-fluid" id="LAY-winitplan">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="winitplanForm" lay-filter="winitplanForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售渠道</label>
                                <div class="layui-input-block">
                                    <select name="channelListStr">
                                        <option value="">全部</option>
                                        <c:forEach items="${channelList}" var="channel">
                                            <option value="${channel.channel}" data-plat="${channel.platCode}">${channel.channel}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="salerOrganize" lay-filter="orgs_hp_saler_winitplan" class="orgs_hp_custom" data-id="winitplan_saler" data-title="销售员部门" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" id="orgs_hp_saler_winitplanForm">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="salerIdListStr" lay-filter="users_hp_saler_winitplan" lay-search="" class="users_hp_custom" data-title="万邑通专员" data-id="winitplan_saler" data-roleList="万邑通专员"  xm-select="winitplan_saler" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-filter="skuTypeSelect_winitplan" class="hiddenContent">
                                        <option value="registerSku">注册sku</option>
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">子SKU</option>
                                        <option value="pSku2">父SKU(精确)</option>
                                        <option value="sSku2">子SKU(精确)</option>
                                        <option value="registerSku2">注册sku(精确)</option>
                                        <option value="creator">创建人</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" maxlength="2000" name="searchValue" id="product_tpl_searchSKU_input" autocomplete="off">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">头程渠道</label>
                                <div class="layui-input-block">
                                    <select name="saleLogisticsType" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${saleLogisticsTypeList}" var="saleLogisticsType">
                                            <option value="${saleLogisticsType.saleLogisticsTypeName}">${saleLogisticsType.saleLogisticsTypeName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">收货仓库</label>
                                <div class="layui-input-block">
                                    <select name="winitStoreId" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${winitStoreList}" var="store">
                                            <option value="${store.id}">${store.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">发货单号</label>
                                <div class="layui-input-block">
                                    <input name="planNoListStr" class="layui-input" placeholder="多个用逗号隔开" maxlength="4000">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品条码</label>
                                <div class="layui-input-block">
                                    <input name="winitCodeListStr" class="layui-input" placeholder="多个用逗号隔开" maxlength="4000">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">未配数量</label>
                                <div class="layui-input-block flex_between">
                                    <input name="waitMatchNumMin" type="text" class="layui-input w_40" placeholder="≥" onkeyup="if(this.value && ! /^[0-9]+$/.test(this.value)){alert('只能输入正整数');this.value='';}"  />-
                                    <input name="waitMatchNumMax" type="text" class="layui-input w_40" placeholder="≤" onkeyup="if(this.value && ! /^[0-9]+$/.test(this.value)){alert('只能输入正整数');this.value='';}"  />
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发状态</label>
                                <div class="layui-input-block">
                                    <select name="developerStatus">
                                        <option></option>
                                        <option value="true">有效</option>
                                        <option value="false">失效</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售状态</label>
                                <div class="layui-input-block">
                                    <select name="salerStatus">
                                        <option></option>
                                        <option value="true">售卖</option>
                                        <option value="false">不卖</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchTimeType" class="hiddenContent">
                                        <option value="1">创建时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" id="winitplan_time"
                                           name="searchTime">
                                </div>
                            </div>

                            <input class="disN hiddenContent" type="text" name="processStatusListStr" value="0">
                            <input class="disN hiddenContent" type="text" name="matchStatus">

                            <div class="layui-col-md2 layui-col-lg2 fr" style="padding-left:32px;margin-top:2px">
                                <div id="winitplan_searchBtn" class="layui-btn layui-btn-sm keyHandle">搜索</div>
                                <div id="winitplan_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</div>
                            </div>
                        </div>
                        <div class="layui-col-l12 layui-col-md12" id="winitplan_search_cate"></div>
                        <div hidden id="winitplan_logisAttrList">
                            <c:forEach items="${logisAttrList}" var="logisAttr">
                                <option value="${logisAttr.name}"
                                        alias="${logisAttr.alias}">${logisAttr.name}</option>
                            </c:forEach>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <div>
                        <div class="fl">
                            <div class="layui-tab" lay-filter="winitplan_Tab" id="winitplan_Tab">
                                <ul class="layui-tab-title">
                                    <li data-status="0" class="layui-this">发货计划<span></span></li>
                                    <li data-status="1">待采购<span></span></li>
                                    <li data-status="2,3" data-matchstatus="0,1">未配货<span></span></li>
                                    <li data-status="2,3" data-matchstatus="1,2">已配货<span></span></li>
                                    <li data-status="3">部分发货<span></span></li>
                                    <li data-status="4">已发货<span></span></li>
                                    <li data-status="8">已作废<span></span></li>
                                    <li data-status="9">已归档<span></span></li>
                                </ul>
                            </div>
                        </div>

                        <div class="fl ml10">
                            <permTag:perm funcCode="winitplan_addByExcel">
                                <input type="file" class="disN" id="winitplan_addPlanExcel">
                                <div class="layui-btn layui-btn-sm" id="winitplan_addWinitPlanTemplateBtn" onclick="window.location.href = ctx + '/static/templet/addWinitPlanTemplate.xlsx'">下载模板</div>
                                <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitplan_addByExcelBtn" onclick="document.getElementById('winitplan_addPlanExcel').click()">导入新增</div>
                            </permTag:perm>

                            <permTag:perm funcCode="winitplan_export">
                                <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitplan_exportBtn" >导出</div>
                            </permTag:perm>
                            <permTag:perm funcCode="winitplan_exportHasStockWithoutPlan">
                                <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitplan_exportHasStockWithoutPlanBtn"
                                     title="导出待发海外仓有货却无发货计划的数据">导出多货信息</div>
                            </permTag:perm>
                        </div>
                        <div class="fr">
                            <permTag:perm funcCode="winitplan_markFinishPur">
                                <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitplan_markFinishPurBtn" >标记已采购</div>
                            </permTag:perm>
                            <permTag:perm funcCode="winitplan_exportWaitPurDetail">
                                <div class="layui-btn layui-btn-sm" id="winitplan_exportWaitPurDetailBtn" >导出待采购详情</div>
                            </permTag:perm>
                            <permTag:perm funcCode="winitplan_exportLackDetail">
                                <div class="layui-btn layui-btn-sm" id="winitplan_exportLackDetailBtn" >导出缺货数据</div>
                            </permTag:perm>
                            <permTag:perm funcCode="winitplan_requestPurchase">
                                <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitplan_requestPurchaseBtn" >提交采购</div>
                            </permTag:perm>
                            <permTag:perm funcCode="winitplan_purchase">
                                <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitplan_purchaseBtn" >一键采购</div>
                            </permTag:perm>
                            <permTag:perm funcCode="winitplan_checkStock">
                                <div class="layui-btn layui-btn-sm" id="winitplan_checkStockBtn" >库存检查</div>
                            </permTag:perm>
                            <permTag:perm funcCode="winitplan_delete">
                                <div class="layui-btn layui-btn-sm layui-btn-danger" id="winitplan_deleteBtn" >删除</div>
                            </permTag:perm>
                            <permTag:perm funcCode="winitplan_disable">
                                <div class="layui-btn layui-btn-sm layui-btn-danger" id="winitplan_disableBtn" >作废</div>
                            </permTag:perm>
                            <permTag:perm funcCode="winitplan_putInvalid">
                                <div class="layui-btn layui-btn-sm layui-btn-danger" id="winitplan_putInvalidBtn" >归档</div>
                            </permTag:perm>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table lay-filter="winitplan_table" class="layui-table" id="winitplan_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/wyt/warehouse/winitplan.js?v=${ver}"></script>

<script id="winitplan_tab_image" type="text/html">
    {{#  if(typeof(d.prodSInfo.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.prodSInfo.image }}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<script id="winitplan_tab_isCombinationBox" type="text/html">
    <input type="checkbox" lay-skin="primary" disabled {{ d.prodSInfo.isCombination ? 'checked' : '' }}><br>
</script>

<script id="winitplan_tab_timeBox" type="text/html">
    <div class="alignLeft">
        <div><span class="secondary">创建:</span>{{Format(d.createTime,'yyyy-MM-dd')}}</div>
    </div>
</script>

<script type="text/html" id="winitplan_tab_toolBar">
    {{# if (d.processStatus == 0) {}}
    <permTag:perm funcCode="winitplan_update">
        <div class="mt10">
            <div class="layui-btn layui-btn-sm layui-btn-warm" lay-event="edit">修改</div>
        </div>
    </permTag:perm>
    <permTag:perm funcCode="winitplan_delete">
        <div class="mt10">
            <div class="layui-btn layui-btn-sm layui-btn-danger" lay-event="delete">删除</div>
        </div>
    </permTag:perm>
    {{# } }}

    {{# if (d.processStatus == 1) {}}
    <permTag:perm funcCode="winitplan_update">
        <div class="mt10">
            <div class="layui-btn layui-btn-sm layui-btn-warm" lay-event="edit">修改</div>
        </div>
    </permTag:perm>
    <permTag:perm funcCode="winitplan_disable">
        <div class="mt10">
            <div class="layui-btn layui-btn-sm layui-btn-danger" lay-event="disable">作废</div>
        </div>
    </permTag:perm>
    {{# } }}
    {{# if (d.processStatus == 2 || d.processStatus == 3) {}}
    <permTag:perm funcCode="winitplan_update">
        <div class="mt10">
            <div class="layui-btn layui-btn-sm layui-btn-warm" lay-event="edit">修改</div>
        </div>
    </permTag:perm>
    <permTag:perm funcCode="winitplan_putInvalid">
        <div class="mt10">
            <div class="layui-btn layui-btn-sm layui-btn-danger" lay-event="putInvalid">归档</div>
        </div>
    </permTag:perm>
    {{# } }}
</script>

<script type="text/html" id="winitplan_editPlanPop">
    <div class="p20">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" id="winitplanEditForm" lay-filter="winitplanEditForm">
                            <div class="layui-form-item">
                                <div class="layui-col-md12 layui-col-lg12">
                                    <label class="layui-form-label">注册SKU</label>
                                    <div class="layui-input-block">
                                        <div name="registerSku"></div>
                                    </div>
                                </div>
                                <div class="layui-col-md12 layui-col-lg12" notNull>
                                    <label class="layui-form-label">收货仓库</label>
                                    <div class="layui-input-block">
                                        <select name="winitStoreId">
                                            <option value=""></option>
                                            <c:forEach items="${winitStoreList}" var="store">
                                                <option value="${store.id}">${store.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md12 layui-col-lg12" notNull>
                                    <label class="layui-form-label">头程渠道</label>
                                    <div class="layui-input-block">
                                        <select name="saleLogisticsType" lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${saleLogisticsTypeList}" var="saleLogisticsType">
                                                <option value="${saleLogisticsType.saleLogisticsTypeName}">${saleLogisticsType.saleLogisticsTypeName}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md12 layui-col-lg12">
                                    <label class="layui-form-label">发货数量</label>
                                    <div class="layui-input-block">
                                        <input name="planAmount" class="layui-input">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="winitplan_checkStockPop">
    <div class="p20">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="winitplan_checkStockForm" lay-filter="winitplan_checkStockForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="storeId">
                                        <c:forEach items="${storeList}" var="store">
                                            <option value="${store.id}">${store.warehouseName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="fr">
                                <div class="layui-btn layui-btn-sm" id="winitplan_checkStockSearchBtn">查询</div>
                                <div class="layui-btn layui-btn-sm" id="winitplan_checkStockPrintBtn">打印</div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="winitplan_checkStockTable" lay-filter="winitplan_checkStockTable"></table>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="winitplan_skuTemplet">
    <div>
        {{d.prodSInfo.sSku}}
    </div>
    <div>
        {{#  if(d.prodSInfo.logisAttrList!=undefined && d.prodSInfo.logisAttrList!=''){ }}
        {{# var logisAttrArr = d.prodSInfo.logisAttrList.split(',')}}
        {{# var alia}}
        {{# for (var i = 0; i < logisAttrArr.length; ++i) { }}
        {{# alia = winitplan_getColorOfLogis(logisAttrArr[i])}}
        {{#  if(alia && alia != '普'){ }}
        <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logisAttrArr[i]}}">{{alia}}</span>
        {{#}}}
        {{#}}}
        {{#  } }}
    </div>
</script>

<script type="text/html" id="winitplan_UKLetterBox">
    {{# if (d.prodSInfo && d.prodSInfo.suttleWeight != null && d.prodSInfo.packWeight != null && d.prodSInfo.winitHeight && d.prodSInfo.winitLength
    && d.prodSInfo.winitWidth) {}}
    {{# if (d.prodSInfo.winitHeight < 2.5 && d.prodSInfo.winitWidth < 25 && d.prodSInfo.winitLength < 35.3
    && (d.prodSInfo.suttleWeight + d.prodSInfo.packWeight) < 750) {}}
    <input type="checkbox" lay-skin="primary" disabled checked>
    {{# }else{}}
    <input type="checkbox" lay-skin="primary" disabled>
    {{# }}}
    {{# } }}
</script>

<script type="text/html" id="winitplan_DELetterBox">
    {{# if (d.prodSInfo && d.prodSInfo.suttleWeight != null && d.prodSInfo.packWeight != null && d.prodSInfo.winitHeight && d.prodSInfo.winitLength
    && d.prodSInfo.winitWidth) {}}
    {{# if (d.prodSInfo.winitHeight < 2 && d.prodSInfo.winitWidth < 25 && d.prodSInfo.winitLength < 35.3
    && (d.prodSInfo.suttleWeight + d.prodSInfo.packWeight) < 500) {}}
    <input type="checkbox" lay-skin="primary" disabled checked>
    {{# }else{}}
    <input type="checkbox" lay-skin="primary" disabled>
    {{# }}}
    {{# } }}
</script>

<script type="text/html" id="winitplan_exportPop">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_winitplan_export"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="winitplan_exportForm" id="winitplan_exportForm">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">货件计划信息</legend>
                        </fieldset>
                        <div class="fieldBox_standard"><input type="checkbox" title="注册sku" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="计划id" title="计划id" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="计划单号" title="计划单号" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="计划数量" title="计划数量" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="配货数量" title="配货数量" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="发货数量" title="发货数量" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="销售渠道" title="销售渠道" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="目的仓" title="目的仓" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="销售头程" title="销售头程" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="头程渠道" title="头程渠道" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="流程状态" title="流程状态" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="配货状态" title="配货状态" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="头程运费(￥)" title="头程运费(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="万邑通入库费(￥)" title="万邑通入库费(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="关税+VAT(￥)" title="关税+VAT(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="预估成本(￥)" title="预估成本(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="创建人" title="创建人" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="创建时间" title="创建时间" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">商品信息</legend>
                        </fieldset>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="商品sku" title="商品sku" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="图片url" title="图片url" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="外箱长(cm)" title="外箱长(cm)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="外箱宽(cm)" title="外箱宽(cm)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="外箱高(cm)" title="外箱高(cm)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="净重(g)" title="净重(g)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="包装重量(g)" title="包装重量(g)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="毛重(g)" title="毛重(g)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="采购成本(￥)" title="采购成本(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="内包装成本(￥)" title="内包装成本(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="是否组合品" title="是否组合品" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="英国信件" title="英国信件" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="德国信件" title="德国信件" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">选品信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="sSkuField" value="销售员" title="销售员" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">仓库信息</legend>
                        </fieldset>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="库位" title="库位" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="实际库存" title="实际库存" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="有货占用" title="有货占用" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="虚拟占用" title="虚拟占用" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="在途库存" title="在途库存" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="库存成本" title="库存成本" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/javascript">
    // 获取物流属性的简称
    function winitplan_getColorOfLogis(name) {
        var totalLogis = $('#winitplan_logisAttrList option')
        var alias = ''
        if (!name) {
            return alias
        }
        for (var i = 0; i < totalLogis.length; ++i) {
            if (name == totalLogis[i].value) {
                alias = totalLogis[i].getAttribute('alias')
                alias = alias ? alias : '#999999'
            }
        }
        return alias
    }
</script>
