<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>FBA销售进度</title>
<style>

</style>

<div class="layui-fluid" id="LAY-processFbaDev">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="processFbaDevForm" lay-filter="processFbaDevForm" onsubmit="return false">
                        <div class="layui-form-item" id="processFbaDev_salesPersonIdListDiv">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="amazonSaler_orgId" lay-filter="processFbaDev_amazonSaler_orgTree" class="orgs_hp_custom" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonIdListStr" id="processFbaDev_salesPersonIdListStr" class="users_hp_custom" lay-filter="processFbaDev_salesPersonIdListStr" data-rolelist="amazon专员" xm-select="processFbaDev_salesPersonIdListStr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-col-md10 layui-col-lg10">
                                    <div class="layui-form-label labelSel">
                                        <select name="searchType" lay-filter="skuTypeSelect_winitstockinorder" class="hiddenContent">
                                            <option value="pSku">父SKU</option>
                                            <option value="sSku">子SKU</option>
                                            <option value="asin">ASIN</option>
                                            <option value="shipmentId">货件计划</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" maxlength="2000" name="searchValue" autocomplete="off" placeholder="多个用逗号隔开">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <select name="searchMethod">
                                        <option value="2">精确</option>
                                        <option value="1">模糊</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发提交时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="devSubmitTime" id="devSubmitTime">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">文案审核时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="tempAuditTime" id="tempAuditTime">
                                </div>
                            </div>
                            </div>
                        <div class="layui-form-item" id="processFbaDev_developerIdListDiv">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="developer_orgId" lay-filter="processFbaDev_developer_orgTree" class="orgs_hp_custom" lay-search></select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="developerIdListStr" id="processFbaDev_developerIdListStr" class="users_hp_custom" lay-filter="processFbaDev_developerIdListStr" data-rolelist="开发专员" xm-select="processFbaDev_developerIdListStr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="auditStatus">
                                    <option value="">Listing审核</option>
                                    <option value="0">未提交</option>
                                    <option value="1">未审核</option>
                                    <option value="2">审核通过</option>
                                    <option value="3">审核失败</option>
                                </select>
                            </div>

                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="hasCpc">
                                    <option value="">CPC状态</option>
                                    <option value="0">未完成</option>
                                    <option value="1">已完成</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="hasSales">
                                    <option value="">分配销售</option>
                                    <option value="false">未分配</option>
                                    <option value="true">已分配</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="hasPurBillNumber">
                                    <option value="">填写采购单</option>
                                    <option value="false">未填写</option>
                                    <option value="true">已填写</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="hasShipmentId">
                                    <option value="">填写货件编号</option>
                                    <option value="false">未填写</option>
                                    <option value="true">已填写</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="hasAsin">
                                    <option value="">填写ASIN</option>
                                    <option value="false">未填写</option>
                                    <option value="true">已填写</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="countryCode">
                                    <option value="">国家</option>
                                    <option value="美国">美国</option>
                                    <option value="英国">英国</option>
                                    <option value="德国">德国</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="oaShipStatus">
                                    <option value="">货件状态</option>
                                    <option value="0">初始化</option>
                                    <option value="1">待装箱</option>
                                    <option value="2">待发货</option>
                                    <option value="3">已发货</option>
                                    <option value="4">已取消</option>
                                </select>
                            </div>

                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="ifSale">
                                    <option value="">售卖状态</option>
                                    <option value="1">已开卖</option>
                                    <option value="0">未开卖</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="tplHasAudit">
                                    <option value="">文案审核</option>
                                    <option value="true">已审核</option>
                                    <option value="false">未审核</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1 fr" style="padding-left: 20px">
                                <button id="processFbaDev_searchBtn" class="layui-btn layui-btn-sm keyHandle">搜索</button>
                                <button type="reset" id="processFbaDev_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                        <input type="hidden" name="processStatus" value="1">
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <div class="fr">
                        <permTag:perm funcCode="processFbaDev_distributeSalesPerson">
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" id="processFbaDev_distributeSalesPersonForListBtn">分配销售</button>
                        </permTag:perm>
                        <button type="button" class="layui-btn layui-btn-sm " id="processFbaDev_exportBtn">导出</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table lay-filter="processFbaDev_table" class="layui-table" id="processFbaDev_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="processFbaDev_TableBar">
    <permTag:perm funcCode="processFbaDev_distributeSalesPerson">
        <div>
            <div class="layui-btn layui-btn-xs" lay-event="distributeSalesPerson">分配销售</div>
        </div>
    </permTag:perm>
    <permTag:perm funcCode="processFbaDev_update">
        <div>
            <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">修改</div>
        </div>
    </permTag:perm>
    <permTag:perm funcCode="processFbaDev_requireAudit">
        {{# if (d.auditStatus === 0 || d.auditStatus === 3) {}}
        <div>
            <div class="layui-btn layui-btn-xs" lay-event="requireAudit">提交审核</div>
        </div>
        {{# } }}

    </permTag:perm>
    <permTag:perm funcCode="processFbaDev_audit">
        {{# if (d.auditStatus > 0) {}}
        <div>
            <div class="layui-btn layui-btn-xs layui-btn-danger" lay-event="audit">审核</div>
        </div>
        {{# } }}
    </permTag:perm>
    <permTag:perm funcCode="processFbaDev_completeCPC">
        {{#if (!d.hasCpc) {}}
        <div>
            <div class="layui-btn layui-btn-xs layui-btn-warm" lay-event="completeCPC">完成CPC</div>
        </div>
        {{# } }}
    </permTag:perm>
</script>

<script type="text/html" id="processFbaDev_pSkuTpl">
    <div class="canClickEl">
        <span class="copySpan">
            <a onclick="newdevdetail_openDevDetail({{d.prodPId}})">{{d.devInfo.pSku}}</a>
            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
        </span>
    </div>
    <div>{{d.countryCode}}</div>
    <div class="secondary" title="一级类目">{{d.devInfo.firstCateName}}</div>
<%--    <div class="secondary" title="物流属性">{{d.prodPInfo.prodAttrList || ''}}</div>--%>
    {{# if(d.prodPInfo!=undefined) { }}
    {{# if(d.prodPInfo.logisAttrList!=undefined && d.prodPInfo.logisAttrList!=''){ }}
    {{# var logisAttrArr = d.prodPInfo.logisAttrList.split(',')}}
    {{# var alia}}
    {{# for (var i = 0; i < logisAttrArr.length; ++i) { }}
    {{# alia = getLogisAttrAlia(logisAttrArr[i])}}
    {{#  if(alia && alia != '普'){ }}
    <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logisAttrArr[i]}}">{{alia}}</span>
    {{#}}}
    {{#}}}
    {{#}}}
    {{#}}}
</script>
<script type="text/html" id="processFbaDev_personTpl">
    <div class="alignLeft" >
        <div><div class="secondary fl clearLeft">开发:</div><div class="fl">{{d.devInfo.creator}}</div></div>
        <div><div class="secondary fl clearLeft">销售:</div><div class="fl">{{d.salesPerson || ''}}</div></div>
    </div>
</script>
<script type="text/html" id="processFbaDev_cnTitleTpl">
    <div>
        {{d.devInfo.cnName}}
    </div>
    <div class="secondary" title="叶子类目">
        {{d.devInfo.cateName}}
    </div>
</script>

<script type="text/html" id="processFbaDev_subDetail_sSku">
    <table width="100%">
        {{# for (let i = 0; i < d.subDetailList.length; ++i) {}}
            <tr class="height30">
                <td>                   
                    <span class="copySpan">
                        <a>{{d.subDetailList[i].sSku}}</a>
                        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                    </span>
                    {{# if (d.subDetailList[i].firstOnShelfTime) { }}
                    <span class="hp-badge layui-bg-green pointHand fr" title="{{Format(d.subDetailList[i].firstOnShelfTime,'yyyy-MM-dd')}}已开卖">售</span>
                    {{# }}}
                </td>
            </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="processFbaDev_subDetail_deliverAmount">
    <table width="100%">
        {{# for (let i = 0; i < d.subDetailList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.subDetailList[i].deliveryAmount}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="processFbaDev_subDetail_asin">
    <table width="100%">
        {{# for (let i = 0; i < d.subDetailList.length; ++i) {}}
        <tr class="height30">
            <td>
                <div class="canClickEl">
                    <span class="copySpan">
                        <a onclick="routerToAmazonProd(`{{d.countryEn}}`,`{{d.subDetailList[i].asin}}`)"> {{d.subDetailList[i].asin || ''}}</a>
                        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                    </span>
                </div>
            </td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="processFbaDev_subDetail_syncDate">
    <table width="100%">
        {{# for (let i = 0; i < d.subDetailList.length; ++i) {}}
        <tr class="height30">
            <td><div>{{Format(d.subDetailList[i].syncDate, 'yyyy-MM-dd hh:mm')}}</div></td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="processFbaDev_subDetail_weight">
    <table width="100%">
        {{# for (let i = 0; i < d.subDetailList.length; ++i) {}}
        <tr class="height30">
            <td>{{accDiv(accMul(d.subDetailList[i].deliveryAmount, accAdd(d.subDetailList[i].suttleWeight,d.subDetailList[i].packWeight)),1000)}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="processFbaDev_timeTpl">
    <div class="alignLeft" >
        <div><div class="secondary fl clearLeft">提交发货:</div><div class="fl">{{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</div></div>
        <div><div class="secondary fl clearLeft">文案审核:</div><div class="fl">{{d.prodPInfo != null ? Format(d.prodPInfo.auditTime,'yyyy-MM-dd hh:mm') : ''}}</div></div>
        <div><div class="secondary fl clearLeft">分配销售:</div><div class="fl">{{Format(d.distributeTime,'yyyy-MM-dd hh:mm')}}</div></div>
    </div>
</script>
<script type="text/html" id="processFbaDev_shipmentTpl">
    <div>
        <span class="copySpan">
            <a>{{d.shipmentId || ''}}</a>
            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
        </span>
    </div>
    {{# if (d.shipInfo) {}}
    <div title="货件状态">
        {{# if (d.shipInfo.oaShipStatus == 0){ }}<div style="color: #7FFFD4;">初始</div>{{# } }}
        {{# if (d.shipInfo.oaShipStatus == 1){ }}<div style="color: orange;">待装箱</div>{{# } }}
        {{# if (d.shipInfo.oaShipStatus == 2){ }}<div style="color: orange;">待发货</div>{{# } }}
        {{# if (d.shipInfo.oaShipStatus == 3){ }}<div style="color: #009688;">已发货</div>{{# } }}
        {{# if (d.shipInfo.oaShipStatus == 4){ }}<div style="color: grey;">已取消</div>{{# } }}
    </div>
    <div class="alignLeft" >
        <div><div class="secondary fl clearLeft">创建:</div><div class="fl">{{Format(d.shipInfo.createTime,'yyyy-MM-dd hh:mm')}}</div></div>
        <div><div class="secondary fl clearLeft">到货:</div><div class="fl">{{Format(d.shipInfo.fbaReceiveTime,'yyyy-MM-dd hh:mm')}}</div></div>
    </div>
    {{# } }}
</script>
<script type="text/html" id="processFbaDev_ListingTpl">
    <div class="alignLeft" >
        <div><div class="secondary fl clearLeft">提交:</div><div class="fl">{{Format(d.requireAuditTime,'yyyy-MM-dd hh:mm')}}</div></div>
        <div><div class="secondary fl clearLeft">审核:</div><div class="fl">{{Format(d.auditTime,'yyyy-MM-dd hh:mm')}}</div></div>
        <div>
            {{#  if(d.auditStatus === 0){ }}
            <span class="hp-badge layui-bg-gray" title="未提交">未</span>
            {{#  } }}
            {{#  if(d.auditStatus === 1){ }}
            <span class="hp-badge layui-bg-orange" title="待审核">待</span>
            {{#  } }}
            {{#  if(d.auditStatus === 2){ }}
            <span class="hp-badge layui-bg-green pointHand" title="审核通过" onmouseover="showTip(`{{d.auditRemark || ''}}`, this)" onmouseleave="removeTip(this)">通</span>
            {{#  } }}
            {{#  if(d.auditStatus === 3){ }}
            <span class="hp-badge layui-bg-red pointHand" title="审核不通过" onmouseover="showTip(`{{d.auditRemark || ''}}`, this)" onmouseleave="removeTip(this)">拒</span>
            {{#  } }}
        </div>
    </div>
</script>


<script type="text/html" id="processFbaDev_CPCTpl">
    <div class="alignLeft" >
        <div><div class="secondary fl clearLeft">完成:</div><div class="fl">{{Format(d.cpcTime,'yyyy-MM-dd hh:mm')}}</div></div>
        {{# if (d.cpcInfo) {}}
        <div><div class="secondary fl clearLeft">创建:</div><div class="fl">{{Format(d.cpcCreateTime,'yyyy-MM-dd hh:mm')}}</div></div>
        <div><div class="secondary fl clearLeft">生效:</div><div class="fl">{{Format(d.cpcValidTime,'yyyy-MM-dd hh:mm')}}</div></div>
        <div><div class="secondary fl clearLeft">金额:</div><div class="fl">{{d.cpcInfo.cpcMoney}}</div></div>
        {{# } }}
    </div>
</script>

<style>
    .height30{
        height:30px;
        line-height: 30px;
    }
</style>

<script type="text/html" id="processFbaDev_distributeSalesPersonLayer">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="processFbaDev_distributeSalesPersonForm" lay-filter="processFbaDev_distributeSalesPersonForm">
                <div class="layui-form-item" notNull>
                    <div class="layui-col-md10 layui-col-lg10">
                        <label class="layui-form-label">销售专员</label>
                        <div class="layui-input-block">
                            <select name="salesPersonId" lay-search>

                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<script type="text/html" id="processFbaDev_editLayer">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="processFbaDev_editForm" lay-filter="processFbaDev_editForm">
                <div class="layui-form-item">
                    <div class="layui-col-md10 layui-col-lg10">
                        <label class="layui-form-label">货件计划</label>
                        <div class="layui-input-block">
                            <input name="shipmentId" class="layui-input" placeholder="根据销售员、asin自动抓取，可不填">
                        </div>
                    </div>
                </div>
                <div id="processFbaDev_skuAsinEditDiv" class="layui-form-item">
                </div>
            </form>
        </div>
    </div>
</script>

<script type="text/html" id="processFbaDev_auditLayer">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="processFbaDev_auditForm" lay-filter="processFbaDev_auditForm">
                <div class="layui-form-item">
                    <div class="layui-col-md6 layui-col-lg6"notNull>
                        <label class="layui-form-label">审核结果</label>
                        <div class="layui-input-block">
                            <select name="auditStatus">
                                <option></option>
                                <option value="2">通过</option>
                                <option value="3">不通过</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12"notNull>
                        <label class="layui-form-label">审核备注</label>
                        <div class="layui-input-block">
                            <input name="auditRemark" class="layui-input">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>
<script type="text/javascript" src="${ctx}/static/js/work/develop/processFbaDev.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/util/enum.js?v=${ver}"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/newdevDetail.jsp" %>
