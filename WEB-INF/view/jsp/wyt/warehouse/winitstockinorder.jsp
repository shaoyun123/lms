<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>海外仓入库单</title>
<style>
#winitstockinorder_caseCountDiv .layui-table-view,
#winitstockinorder_caseCountDiv .layui-table-box,
#winitstockinorder_caseCountDiv .layui-table-body,
#winitstockinorder_caseCountDiv{
  overflow: visible;
}
/*#winitstockinorder_caseCountDiv .layui-table-main {*/
    /*overflow-y: auto;*/
    /*overflow-x: hidden;*/
/*}*/
</style>

<div class="layui-fluid" id="LAY-winitstockinorder">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="winitstockinorderForm" lay-filter="winitstockinorderForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">配货单状态</label>
                                <div class="layui-input-block">
                                    <select name="deliverStatusListStr" xm-select="winitstockinorder_deliverStatusListStr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                        <option value="0">待装箱</option>
                                        <option value="1">已装箱</option>
                                        <option value="2">已发货</option>
                                        <option value="9">已取消</option>
                                    </select>
                                </div>
                            </div>
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
                                    <select name="salerOrganize" lay-filter="orgs_hp_saler_winitstockinorder" class="orgs_hp_custom" data-id="winitstockinorder_saler" data-title="销售员部门" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" id="orgs_hp_saler_winitstockinorderForm">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="salerIdListStr" lay-filter="users_hp_saler_winitstockinorder" lay-search="" class="users_hp_custom" data-title="海外仓专员" data-id="winitstockinorder_saler" data-roleList="海外仓专员"  xm-select="winitstockinorder_saler" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-filter="skuTypeSelect_winitstockinorder" class="hiddenContent">
                                        <option value="registerSku">注册sku</option>
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">子SKU</option>
                                        <option value="pSku2">父SKU(精确)</option>
                                        <option value="sSku2">子SKU(精确)</option>
                                        <option value="registerSku2">注册sku(精确)</option>
                                        <option value="creator">发货计划创建人</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" maxlength="2000" name="searchValue" autocomplete="off">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">货代公司</label>
                                <div class="layui-input-block layui-form" lay-filter="winitstockinorder_goodsCompanyDiv">
                                    <select name="goodsCompany" id="winitstockinorder_goodsCompanySel" lay-filter="winitstockinorder_goodsCompanySel" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售头程</label>
                                <div class="layui-input-block">
                                    <select name="saleLogisticsTypeListStr" lay-filter="winitstockinorder_saleLogisticsTypeBox" lay-search xm-select="winitstockinorder_saleLogisticsTypeBox" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                        <c:forEach items="${saleLogisticsTypeList}" var="saleLogisticsType">
                                            <option value="${saleLogisticsType.saleLogisticsTypeName}">${saleLogisticsType.saleLogisticsTypeName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">真实头程</label>
                                <div class="layui-input-block">
                                    <select name="firstWayCompanyIdListStr" lay-filter="winitstockinorder_firstWayTypeBox" lay-search xm-select="winitstockinorder_firstWayTypeBox" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                        <c:forEach items="${firstWayCompanyList}" var="firstWayCompany">
                                            <option value="${firstWayCompany.id}">${firstWayCompany.name}</option>
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
                                <label class="layui-form-label">发货计划单号</label>
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
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchTimeType" class="hiddenContent">
                                        <option value="1">发货计划创建时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" id="winitstockinorder_time"
                                           name="searchTime">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">分配明细单号</label>
                                <div class="layui-input-block">
                                    <input name="deliverIdListStr" class="layui-input" placeholder="多个用逗号隔开">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">海外仓入库单号</label>
                                <div class="layui-input-block">
                                    <input name="winitOrderNoListStr" class="layui-input" placeholder="多个用逗号隔开">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="ml20">
                                    <select name="ifArrive">
                                        <option value="">是否到仓</option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>
                            <input class="disN hiddenContent" type="text" name="oaStatus" value="-1">
                            <input class="disN hiddenContent" type="text" name="feeStatus" value="">
                            <div class="layui-col-md2 layui-col-lg2" style="padding-left:32px;margin-top:2px">
                                <div id="winitstockinorder_searchBtn" class="layui-btn layui-btn-sm keyHandle">搜索</div>
                                <div id="winitstockinorder_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</div>
                            </div>
                        </div>
                        <div class="layui-col-l12 layui-col-md12" id="winitstockinorder_search_cate"></div>

                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <div>
                        <div class="fl">
                            <div class="layui-tab" lay-filter="winitstockinorder_Tab" id="winitstockinorder_Tab">
                                <ul class="layui-tab-title">
                                    <li data-status="-1" class="layui-this">待建分配单<span></span></li>
                                    <li data-status="0">预建入库单<span></span></li>
                                    <li data-status="1">已提交入库单<span></span></li>
                                    <li data-status="2">运输中<span></span></li>
                                    <li data-status="3">部分上架<span></span></li>
                                    <li data-status="4">已上架<span></span></li>
                                    <li data-status="-2">全部分配单<span></span></li>
                                </ul>
                            </div>
                        </div>
                        <div class="fl">
                            <permTag:perm funcCode="winitstockinorder_export">
                                <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitstockinorder_exportBtn" >导出</div>
                            </permTag:perm>
                        </div>
                        <div class="fr">
                            <permTag:perm funcCode="winitstockinorder_cancelPlanDeliver">
                                <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitstockinorder_cancelPlanDeliverBtn" >取消配货</div>
                            </permTag:perm>
                            <permTag:perm funcCode="winitstockinorder_preCreate">
                                <div class="layui-btn layui-btn-sm" id="winitstockinorder_preCreateBtn" >预建入库单</div>
                            </permTag:perm>

                            <permTag:perm funcCode="winitstockinorder_syncOrder">
                                <div class="layui-btn layui-btn-sm" id="winitstockinorder_syncOrderBtn" >同步入库单</div>
                            </permTag:perm>

                            <permTag:perm funcCode="matchchannel_print">
                                <div class="fl mt05">
                                    <input class="layui-input" type="number" id="winitstockinorder_printDeliverDetail" style="width: 80px" placeholder="配货单id">
                                </div>
                                <div class="layui-btn layui-btn-sm mr10 fl mt05" id="winitstockinorder_printDeliverDetailBtn">补打配货标签</div>
                                <div class="fl mt05">
                                    <input class="layui-input" type="number" id="winitstockinorder_printAmount" style="width: 80px" placeholder="打印数">
                                </div>
                                <div class="layui-btn layui-btn-sm fl mt05" id="winitstockinorder_printBtn">补打商品标签</div>
                            </permTag:perm>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <div class="checkbox-group toFixedContain">
                        <div class="layui-form winitstockinorder_feeStatusCheckbox disN" lay-filter="winitstockinorder_feeStatusCheckboxDiv">
                            <input type="checkbox" name="feeStatus" value="false" title="未摊分" lay-skin="primary" lay-filter="winitstockinorder_feeStatusCheckbox">
                            <input type="checkbox" name="feeStatus" value="true" title="已摊分" lay-skin="primary" lay-filter="winitstockinorder_feeStatusCheckbox">
                        </div>
                    </div>
                    <table lay-filter="winitstockinorder_table" class="layui-table" id="winitstockinorder_table"></table>
                </div>
            </div>
        </div>
    </div>

    <div hidden id="winitstockinorder_logisAttrList">
        <c:forEach items="${logisAttrList}" var="logisAttr">
            <option value="${logisAttr.name}"
                    alias="${logisAttr.alias}">${logisAttr.name}</option>
        </c:forEach>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/wyt/warehouse/winitstockinorder.js?v=${ver}"></script>

<script type="text/javascript">
    // 获取物流属性的简称
    function winitstockinorder_getColorOfLogis(name) {
        var totalLogis = $('#winitstockinorder_logisAttrList option')
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

<script id="winitstockinorder_tab_timeBox" type="text/html">
    <div class="alignLeft">
        <div><span class="secondary">创建:</span>{{Format(d.createTime,'yyyy-MM-dd')}}</div>
    </div>
</script>

<script type="text/html" id="winitstockinorder_tab_1_toolBar">
    <permTag:perm funcCode="winitstockinorder_editDeliverAmount">
        <div class="mt10">
            <div class="layui-btn layui-btn-sm" lay-event="editDeliverAmount">修改数量</div>
        </div>
    </permTag:perm>

    <permTag:perm funcCode="winitstockinorder_cancelPlanDeliver">
        <div class="mt10">
            <div class="layui-btn layui-btn-sm layui-btn-warm" lay-event="cancelPlanDeliver">取消配货</div>
        </div>
    </permTag:perm>
</script>

<script type="text/html" id="winitstockinorder_preCreatePop">
    <div class="layui-card">
        <div class="layui-card-header">
            <div class="fr">
                <div class="fl">
                    <input class="layui-input mt05" type="number" id="winitstockinorder_addCaseInp" placeholder="箱子数量">
                </div>
                <div class="fl">
                    <div class="layui-btn layui-btn-sm" id="winitstockinorder_addCaseBtn">新增箱子</div>
                </div>
            </div>
        </div>
        <div class="layui-card-body">
            <table lay-filter="winitstockinorder_preCreateTable" class="layui-table" id="winitstockinorder_preCreateTable"></table>
        </div>
    </div>
    <div class="layui-card layui-form" id="winitstockinorder_caseCountDiv" lay-filter="winitstockinorder_caseCountDiv">
        <div class="layui-card-body">
            <table lay-filter="winitstockinorder_preCreateCaseTable" class="layui-table" id="winitstockinorder_preCreateCaseTable"></table>
        </div>
    </div>
</script>
<script type="text/html" id="winitstockinorder_tab_image">
        {{#  if(typeof(d.image) !="undefined"){ }}
        <img width="60" height="60" data-original="${tplIVP}{{ d.image }}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" />
        {{#  } else { }}
        <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()"/>
        {{# } }}
</script>

<script type="text/html" id="winitstockinorder_preCreatetab_prodInfo">
    <div class="alignLeft">
        <div>
            <span class="fGrey">分配明细单:</span><span>{{d.id}}</span>
        </div>
        <div>
            <span class="fGrey">注册sku:</span><span>{{d.registerSku}}</span>
        </div>
        <div>
            {{#  if(d.logisAttrList!=undefined && d.logisAttrList!=''){ }}
            {{# var logisAttrArr = d.logisAttrList.split(',')}}
            {{# var alia}}
            {{# for (var i = 0; i < logisAttrArr.length; ++i) { }}
            {{# alia = winitstockinorder_getColorOfLogis(logisAttrArr[i])}}
            {{#  if(alia && alia != '普'){ }}
            <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logisAttrArr[i]}}">{{alia}}</span>
            {{#}}}
            {{#}}}
            {{#  } }}
        </div>
    </div>
</script>

<script type="text/html" id="winitstockinorder_preCreatetab_toolBar">
    <div>
        <div class="layui-btn layui-btn-sm" lay-event="remove">移除</div>
    </div>
</script>

<script type="text/html" id="winitstockinorder_tab_2_toolBar">
    <permTag:perm funcCode="winitstockinorder_recoveryDeliver">
        {{# if (d.processStatus == 2) {}}
        <div class="mt05">
            <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="recoveryDeliver">驳回</div>
        </div>
        {{# } }}
    </permTag:perm>
</script>

<script type="text/html" id="winitstockinorder_tab_toolBar">
    <permTag:perm funcCode="winitstockinorder_detail">
        {{# if (d.oaStatus != 4) {}}
        <div class="mt05">
            <div class="layui-btn layui-btn-xs" lay-event="detail">详情</div>
        </div>
        {{# } }}
    </permTag:perm>
    <permTag:perm funcCode="winitstockinorder_submitOrder">
        {{# if (d.oaStatus == 0) {}}
        <div class="mt05">
            <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="submitOrder">提交海外仓</div>
        </div>
        {{# } }}
    </permTag:perm>
    <permTag:perm funcCode="winitstockinorder_cancelPreOrder">
        {{# if (d.oaStatus == 0) {}}
        <div class="mt05">
            <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="cancelPreOrder">取消</div>
        </div>
        {{# } }}
    </permTag:perm>
    <permTag:perm funcCode="winitstockinorder_markDeliver">
        {{# if (d.oaStatus == 1) {}}
        <div class="mt05">
            <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="markDeliver">标记发货</div>
        </div>
        {{# } }}
    </permTag:perm>
    <permTag:perm funcCode="winitstockinorder_disableOrder">
        {{# if (d.oaStatus == 1) {}}
        <div class="mt05">
            <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="disableOrder">作废</div>
        </div>
        {{# } }}
    </permTag:perm>

    {{# if (d.oaStatus == 2 || d.oaStatus == 4 ) {}}
    <permTag:perm funcCode="winitstockinorder_queryProcess">
        <div class="mt05">
            <div class="layui-btn layui-btn-xs" lay-event="queryProcess">查询轨迹</div>
        </div>
    </permTag:perm>
    <permTag:perm funcCode="winitstockinorder_avgCalCost">
        <div class="mt05">
            <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="avgCalCost">摊分费用</div>
        </div>
    </permTag:perm>
    {{# } }}
    {{# if (d.feeStatus == 0) {}}
    <permTag:perm funcCode="winitstockinorder_editExpressNo">
        <div class="mt05">
            <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="editExpressNo">修改物流</div>
        </div>
    </permTag:perm>
    {{# } }}
    {{# if (d.oaStatus == 3 || d.oaStatus == 4) {}}
    <permTag:perm funcCode="winitstockinorder_getWinitFee">
        <%--<div class="mt05">--%>
            <%--<div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="getWinitFee">后台费用</div>--%>
        <%--</div>--%>
    </permTag:perm>
    <permTag:perm funcCode="winitstockinorder_avgCostDetail">
        <div class="mt05">
            <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="avgCostDetail">分摊详情</div>
        </div>
    </permTag:perm>
    {{# } }}

    <permTag:perm funcCode="winitstockinorder_export">
        <div class="mt05">
            <div class="layui-btn layui-btn-xs" lay-event="exportOrder">导出</div>
        </div>
    </permTag:perm>
</script>

<script type="text/html" id="winitstockinorder_orderProcessPop">
    <div class="layui-card">
        <div class="layui-card-body">
            <table lay-filter="winitstockinorder_orderProcessTable" class="layui-table" id="winitstockinorder_orderProcessTable"></table>
        </div>
    </div>
</script>

<script type="text/html" id="winitstockinorder_editDeliverAmountPop">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="winitstockinorder_editDeliverAmountForm" lay-filter="winitstockinorder_editDeliverAmountForm" autocomplete="off">
                <div class="layui-form-item">
                    <div class="layui-col-md10 layui-col-lg10">
                        <label class="layui-form-label">配货数量</label>
                        <div class="layui-input-block">
                          <input type="number" class="layui-input" name="amount">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>


<script type="text/html" id="winitstockinorder_avgCalCostPop">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="winitstockinorder_avgCalCostForm" lay-filter="winitstockinorder_avgCalCostForm" autocomplete="off">
                <div class="layui-form-item">
                    <div class="layui-col-md3 layui-col-lg3" notNull>
                        <label class="layui-form-label">包装材料费(￥)</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="packFee">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3" notNull>
                        <label class="layui-form-label">头程运费(￥)</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="firstWayFee">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3" notNull>
                        <label class="layui-form-label">VAT+关税(￥)</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="customsFee">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <div class="layui-btn layui-btn-sm" id="winitstockinorder_updateOrderCostBtn">更新入库成本</div>
                    </div>
                </div>

                <div class="layui-form-item">
                    <div class="layui-col-md3 layui-col-lg3" notNull>
                        <label class="layui-form-label">预估包装材料费(￥)</label>
                        <div class="layui-input-block">
                            <input class="layui-input disAbleInp" name="prePackFee" disabled>
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3" notNull>
                        <label class="layui-form-label">预估头程运费(￥)</label>
                        <div class="layui-input-block">
                            <input class="layui-input disAbleInp" name="preFirstWayFee" disabled>
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3" notNull>
                        <label class="layui-form-label">预估VAT+关税(￥)</label>
                        <div class="layui-input-block">
                            <input class="layui-input disAbleInp" name="preCustomsFee" disabled>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="winitstockinorder_avgCalCostShowTable" lay-filter="winitstockinorder_avgCalCostShowTable"></table>
        </div>
    </div>
</script>

<script type="text/html" id="winitstockinorder_exportPop">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_winitstockinorder_export"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="winitstockinorder_exportForm" id="winitstockinorder_exportForm">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">入库单信息</legend>
                        </fieldset>
                        <div class="fieldBox_standard"><input type="checkbox" title="OA入库单号" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox_standard"><input type="checkbox" title="海外仓单号" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="目的仓" title="目的仓" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="头程渠道" title="头程渠道" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="销售渠道" title="销售渠道" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="Winit产品编码" title="Winit产品编码" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="目的仓编码" title="目的仓编码" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="验货仓编码" title="验货仓编码" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="目标上架时间" title="目标上架时间" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="海外仓实际上架时间" title="海外仓实际上架时间" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="箱数" title="箱数" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="商品种类" title="商品种类" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="商品总数" title="商品总数" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="总重量(kg)" title="总重量" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="入库单状态" title="入库单状态" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="提交时间" title="提交时间" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="发货时间" title="发货时间" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="摊分费用状态" title="摊分费用状态" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="总包装材料费(￥)" title="总包装材料费(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="总头程运费(￥)" title="总头程运费(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="总关税+VAT(￥)" title="总关税+VAT(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="总入库费用(￥)" title="总入库费用(￥)" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">箱子信息</legend>
                        </fieldset>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="箱号" title="箱号" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="海外仓箱子条码" title="海外仓箱子条码" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="箱子规格名称" title="箱子规格名称" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="箱子成本(￥)" title="箱子成本(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="箱子长度(cm)" title="箱子长度(cm)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="箱子宽度(cm)" title="箱子宽度(cm)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="箱子高度(cm)" title="箱子高度(cm)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="箱子重量(kg)" title="箱子重量(kg)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="箱子中sku种类" title="箱子中sku种类" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="箱子中货物总数" title="箱子中货物总数" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">子包裹信息</legend>
                        </fieldset>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="注册sku" title="注册sku" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="商品条码" title="商品条码" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="配货单id" title="配货单id" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="数量" title="数量" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="实际上架数量" title="实际上架数量" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="平均入库成本(￥)" title="平均入库成本(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="发货成本(￥)" title="发货成本(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="包装材料费(￥)" title="包装材料费(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="头程运费(￥)" title="头程运费(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="海外仓入库费(￥)" title="海外仓入库费(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="关税+VAT(￥)" title="关税+VAT(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="申报总价" title="申报总价" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="申报总价(英国)" title="申报总价(英国)" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">发货计划信息</legend>
                        </fieldset>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="计划id" title="计划id" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="计划单号" title="计划单号" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="计划数量" title="计划数量" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="配货数量" title="配货数量" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="发货数量" title="发货数量" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="流程状态" title="流程状态" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="配货状态" title="配货状态" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="预估成本(￥)" title="预估成本(￥)" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">商品信息</legend>
                        </fieldset>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="父sku" title="父sku" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="商品sku" title="商品sku" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="物流属性" title="物流属性" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="海关编码" title="海关编码" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="是否带电" title="是否带电" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="是否带磁" title="是否带磁" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="图片路径" title="图片路径" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="采购成本" title="采购成本" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="内包装成本(￥)" title="内包装成本(￥)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="注册申报价值" title="注册申报价值" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="英国申报价值" title="英国申报价值" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="注册链接" title="注册链接" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="中文名称" title="中文名称" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="英文名称" title="英文名称" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="全类目" title="全类目" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="一级类目" title="一级类目" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="一级类目中文" title="一级类目中文" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="一级类目英文" title="一级类目英文" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="二级类目" title="二级类目" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="二级类目中文" title="二级类目中文" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="二级类目英文" title="二级类目英文" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="叶子类目" title="叶子类目英文" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="叶子类目中文" title="叶子类目中文" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="叶子类目英文" title="叶子类目英文" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="销售员" title="销售员" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="净重(g)" title="净重(g)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="包装重量(g)" title="包装重量(g)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="毛重(g)" title="毛重(g)" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="材质" title="材质" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="品牌" title="品牌" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="款式" title="款式" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="单位" title="单位" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="规格" title="规格" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="报关中文" title="报关中文" lay-skin="primary"></div>
                        <div class="fieldBox_standard"><input type="checkbox" name="sSkuField" value="报关英文" title="报关英文" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<%--导出模板选择弹窗--%>
<script type="text/html" id="winitstockinorder_exportTempSelectPop">
   <div>
       <table class="layui-table" id="winitstockinorder_exportTempTable" lay-filter="winitstockinorder_exportTempTable"></table>
   </div>
</script>

<script type="text/html" id="winitstockinorder_editExpressNoPop">
    <div class="p20">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="winitstockinorder_editExpressNoForm" lay-filter="winitstockinorder_editExpressNoForm">
                        <div class="layui-form-item" notNull>
                            <label class="layui-form-label">头程渠道</label>
                            <div class="layui-input-block">
                                <select name="firstWayCompanyId" lay-search>
                                    <option value=""></option>
                                    <c:forEach items="${firstWayCompanyList}" var="firstWayCompany">
                                        <option value="${firstWayCompany.id}">${firstWayCompany.name}</option>
                                    </c:forEach>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">物流商单号</label>
                            <div class="layui-input-block">
                                <input class="layui-input" name="expressNo" id="">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">转单单号</label>
                            <div class="layui-input-block">
                                <input class="layui-input" name="transferNo">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="winitstockinorder_tab_deliverStatus">
    <div>
        {{# if (d.processStatus === 0) {}}
            <span style="color: orange">待装箱</span>
        {{#}}}
        {{# if (d.processStatus === 1) {}}
        <span style="color: lightgreen">已装箱</span>
        {{#}}}
        {{# if (d.processStatus === 2) {}}
        <span style="color: lightgreen">已发货</span>
        {{#}}}
        {{# if (d.processStatus === 9) {}}
        <span style="color: grey">已取消</span>
        {{#}}}
    </div>
</script>

<script type="text/html" id="winitstockinorder_logisticsType">
    <div><span class="secondary">销售:</span>{{d.saleLogisticsType}}</div>
    <div><span class="secondary">真实:</span>{{d.firstWayCompany}}</div>
</script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/wyt/winitutil.js?v=${ver}"></script>