<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>销售选品</title>

<style>
    .layui-table.selectionHoverTable th,
    .layui-table.selectionHoverTable td {
        padding:5px;
        height:10px;
        line-height:10px;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="selection_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-sm layui-btn-primary" id="selection_cateBtn">选择类目</span>
                                    <input id="selection_cateId" name="cateId" type="hidden">
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('selection_cateDiv','selection_cateId')"
                                       style="cursor:pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType">
                                        <option value="sSku">子SKU</option>
                                        <option value="pSku">父SKU</option>
                                        <%-- <option value="pSku2">父SKU(精确)</option>
                                        <option value="sSku2">子SKU(精确)</option> --%>
                                        <option value="cnName">中文名称</option>
                                        <option value="enName">英文名称</option>
                                        <option value="recommendReason">推荐理由</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="searchValue">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale">
                                        <option value="">全部</option>
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4" id="orgs_hp_devPerson_selectionForm">
                               <div class="layui-form-label labelSel">
                                    <select name="bizzOwnerOrganize" lay-filter="orgs_hp_devPerson_selection" class="orgs_hp_custom" data-id="selection_devPerson" data-title="开发专员部门">
                                        <option value="">开发专员部门</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerIdListStr" 
                                    lay-filter="users_hp_devPerson_selection"  
                                    class="users_hp_custom" 
                                    data-title="开发专员" 
                                    data-id="selection_devPerson" 
                                    data-roleList="开发专员"
                                    xm-select="selection_devPerson" 
                                    xm-select-search 
                                    xm-select-search-type="dl" 
                                    xm-select-skin="normal">
                                        <option value="">开发专员</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" id="orgs_hp_saler_selectionForm">
                                <div class="layui-form-label labelSel">
                                    <select name="salerOrganize" lay-filter="orgs_hp_saler_selection" class="orgs_hp_custom" data-id="selection_saler" data-title="部门">
                                        <option value="">部门</option>
                                    </select>
                                </div>
                                <%-- <div class="layui-input-block">
                                    <select name="salerIdListStr" 
                                    lay-filter="users_hp_saler_selection" 
                                    class="users_hp_custom" 
                                    data-title="海外仓销售员" 
                                    data-id="selection_saler" 
                                    data-roleList="万邑通专员"
                                    xm-select="selection_saler" 
                                    xm-select-search 
                                    xm-select-search-type="dl" 
                                    xm-select-skin="normal">
                                        <option value="">海外仓销售员</option>
                                    </select>
                                </div> --%>
                                <div class="layui-input-block">
                                    <select name="salerId"
                                    lay-search 
                                    lay-filter="users_hp_saler_selection" 
                                    class="users_hp_custom" 
                                    data-title="海外仓销售员" 
                                    data-id="selection_saler" 
                                    data-roleList="万邑通专员"
                                    >
                                        <option value="">海外仓销售员</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售选品状态</label>
                                <div class="layui-input-block">
                                    <select name="ifSelected">
                                        <option value="">全部</option>
                                        <option value="0">未选</option>
                                        <option value="1">已选</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-form-label labelSel">
                                    <select name="searchTimeType">
                                        <option value="1">创建时间</option>
                                        <option value="2">发布时间</option>
                                        <option value="3">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="searchTime" id="selection_timeRange">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderBy">
                                        <option value="t9.register_time desc">注册成功时间倒序</option>
                                        <option value="t9.register_time asc">注册成功时间正序</option>
                                        <%-- <option value="t1.audit_time desc">审核时间倒序</option>
                                        <option value="t1.audit_time asc">审核时间正序</option> --%>
                                        <option value="t2.thirty_sales desc">30天销量倒序</option>
                                        <option value="t2.thirty_sales asc">30天销量正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售渠道</label>
                                <div class="layui-input-block">
                                    <select name="channelListStr" 
                                        id="selection_channelSelect" 
                                        lay-filter="selection_channelFilter"
                                        xm-select="selection_channelList"
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <%-- <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">分配时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="allocateTimes" id="selection_allocateTimes">
                                </div>
                            </div> --%>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品有效</label>
                                <div class="layui-input-block">
                                    <select name="ifEffective">
                                        <option value="">全部</option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>
                            <%-- <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">分配结果</label>
                                <div class="layui-input-block">
                                    <select name="ifAllocate">
                                        <option value="">全部</option>
                                        <option value="true">已分配</option>
                                        <option value="false">未分配</option>
                                    </select>
                                </div>
                            </div> --%>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">头程类型</label>
                                <div class="layui-input-block">
                                    <select name="firstWayType" id="selection_firstWayType" lay-filter="firstWayTypeFilter">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">禁止入库</label>
                                <div class="layui-input-block">
                                    <select name="ifProhibitInStock">
                                        <option value=""></option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="selection_submit">查询</span>
                            </div>
                        </div>
                    </form>
                    <div id="selection_cateDiv"></div>
                </div>
            </div>
            <div class="layui-card" id="selectionCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header">
                        <div style="display:flex;justify-content:flex-end;align-items:center;height: 100%;">
                            <%-- <span class="layui-btn layui-btn-sm layui-btn-normal" onclick="javascript: window.open('${ctx}/static/templet/importWinitVoluteerTemplate.xlsx')">下载模板</span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="selection_importIntention" style="margin-right: 10px;">导入意向</span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="selection_selectIntention">选品意向</span> --%>
                            <permTag:perm funcCode="selection_product">
                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="selection_batchSelection">
                            批量选品</span>
                            </permTag:perm>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="selection_table"  lay-filter="selection_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<%-- 销售渠道 --%>
<script type="text/html" id="selection_channelInfo">
    <div>
        <div class="selection_channelHover">{{ d.channel || '' }}</div>
        <input type="hidden" value='{{JSON.stringify(d.winitSInfoSaleList)}}'>
        <%-- <div class="selection_salerName">{{d.pSiteInfo.saler || ''}}</div> --%>
    </div>
</script>

<%-- 图片 --%>
<script type="text/html" id="selection_img">
    {{#  if(typeof(d.prodSInfo.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.prodSInfo.image }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy img_show_hide" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<%-- 英国信件 --%>
<script type="text/html" id="selection_eng">
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
<%-- 德国信件 --%>
<script type="text/html" id="selection_ger">
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
<%-- sku --%>
<script type="text/html" id="selection_sku">
    <div>
    {{# if(d.prodSInfo){ }}
        <div>{{d.prodSInfo.sSku || ''}}</div>
        <div><span class="secondary">父:</span>{{d.prodPInfo.pSku || ''}}</div>
        {{#  if(d.prodSInfo.logisAttrList!=undefined && d.prodSInfo.logisAttrList!=''){ }}
        {{# var logisAttrArr = d.prodSInfo.logisAttrList.split(',')}}
        {{# var alia}}
        {{# for (var i = 0; i < logisAttrArr.length; ++i) { }}
        {{# alia = selection_getColorOfLogis(logisAttrArr[i])}}
        {{#  if(alia && alia != '普'){ }}
        <div><span class="layui-bg-red hp-badge ml5" title="物流属性: {{logisAttrArr[i]}}">{{alia}}</span></div>
        {{#}}}
        {{#}}}
        {{#  } }}

        {{# if(d.prodSInfo.ifWithPlug){ }}
            <div><span class="layui-bg-blue hp-badge ml5" title="物流属性: 带插头">插</span></div>
        {{# } }}
    {{#  } }}
    </div>
</script>

<%-- 在售 --%>
<script type="text/html" id="selection_isSale">
    <div class="layui-form">
        {{# if(d.prodSInfo){ }}
        <input type="checkbox" lay-skin="primary" disabled {{ d.prodSInfo.isSale ? 'checked' : '' }}>
        {{#  }else{ }}
        <input type="checkbox" lay-skin="primary" disabled>
        {{#  } }}
    </div>
</script>

<%-- 选品状态 --%>
<script type="text/html" id="selection_isSelected">
    <div class="layui-form">
        {{# if(d.ifSelected){ }}
        <input type="checkbox" lay-skin="primary" disabled checked>
        {{#  }else{ }}
        <input type="checkbox" lay-skin="primary" disabled>
        {{#  } }}
    </div>
</script>


<%-- 简称 --%>
<script type="text/html" id="selection_simple">
    <div>
        {{# if(d.prodSInfo){ }}
        <div>{{d.prodSInfo.purchaseChannel || ''}}</div>
        {{#  } }}

        {{# if(d.prodCate){ }}
        <div><span class="secondary">分类: </span>{{d.prodCate.cateCnName || ''}}</div>
        {{#  } }}

        <div><div class="canClickEl" lay-event="showCompList">竞品链接</div></div>
    </div>
</script>

<%-- 责任人 --%>
<script type="text/html" id="selection_responser">
    <div  class="alignLeft">
        {{# if(d.prodSInfo){ }}
        <div><span class="secondary">开发: </span>{{d.prodPInfo.bizzOwner || ''}}
        {{# } }}

        {{# if(d.bizzOwnerOrg){ }}
            ({{d.bizzOwnerOrg}})
        {{# } }}
        </div>
        {{# if(d.prodSInfo){ }}
        <div><span class="secondary">采购: </span>{{d.prodSInfo.buyer || ''}}</div>
        {{# } }}
    </div>
</script>

<%-- 销量 --%>
<script type="text/html" id="selection_volume">
    <div  class="alignLeft">
        {{# if(d.prodSInfo){ }}
        <div><span class="secondary">7日: </span>{{d.prodSInfo.sevenSales || ''}}</div>
        <div><span class="secondary">15日: </span>{{d.prodSInfo.fifteenSales || ''}}</div>
        <div><span class="secondary">30日: </span>{{d.prodSInfo.thirtySales || ''}}</div>
        {{# }else{ }}
        <div><span class="secondary">7日: </span></div>
        <div><span class="secondary">15日: </span></div>
        <div><span class="secondary">30日: </span></div>
        {{# } }}
    </div>
</script>

<%-- 成本 --%>
<script type="text/html" id="selection_cost">
     <div lay-event="showPrePublishPrice" class="canClickEl">
        {{# if(d.prodSInfo){ }}
            {{accAdd(d.prodSInfo.purchaseCostPrice,d.prodSInfo.innerPackCost)}}
        {{# } }}
     </div>
</script>

<%-- 重量 --%>
<script type="text/html" id="selection_weight">
    <div class="alignLeft">
        {{# if(d.prodSInfo){ }}
            <div><span class="secondary">实重: </span>{{accAdd(d.prodSInfo.suttleWeight || 0, d.prodSInfo.packWeight || 0).toFixed(2)  }}</div>
            <div><span class="secondary">抛重(5): </span>{{accDiv(accMul(accMul(d.prodSInfo.winitLength || 0, d.prodSInfo.winitWidth || 0), d.prodSInfo.winitHeight || 0),5).toFixed(2) }}</div>
            <div><span class="secondary">抛重(6): </span>{{accDiv(accMul(accMul(d.prodSInfo.winitLength || 0, d.prodSInfo.winitWidth || 0), d.prodSInfo.winitHeight || 0),6).toFixed(2) }}</div>
            <div><span class="secondary">抛重(8): </span>{{accDiv(accMul(accMul(d.prodSInfo.winitLength || 0, d.prodSInfo.winitWidth || 0), d.prodSInfo.winitHeight || 0),8).toFixed(2) }}</div>
        {{# } }}
    </div>
</script>

<%-- 尺寸 --%>
<script type="text/html" id="selection_size">
    <div class="alignLeft">
    {{# if(d.prodSInfo){ }}
        <div><span class="secondary">包裹长: </span>{{d.prodSInfo.winitLength || ''}}</div>
        <div><span class="secondary">包裹宽: </span>{{d.prodSInfo.winitWidth || ''}}</div>
        <div><span class="secondary">包裹高: </span>{{d.prodSInfo.winitHeight || ''}}</div>
        <%-- <div><span class="secondary">压缩高: </span>{{d.prodSInfo.compressHeight || ''}}</div>
        <div><span class="secondary">叠加高: </span>{{d.prodSInfo.superpositionHeight || ''}}</div> --%>
    {{# } }}
    </div>
</script>

<%-- 推荐理由 --%>
<script type="text/html" id="selection_reason">
    {{# if(d.prodPInfo){ }}
    <div class="followRemarkBox" onmouseover="showTip(`{{d.prodPInfo.recommendReason || ''}}`, this)" onmouseleave="removeTip(this)">{{d.prodPInfo.recommendReason || '' }}</div>
    {{# } }}
</script>

<%-- 建议发货数量 --%>
<script type="text/html" id="selection_count">
    <%-- <div class="alignLeft">
      {{# if(d.suggestAmtInfoList){ }}
        {{#  layui.each(d.suggestAmtInfoList, function(index, item){ }}
            {{# if(item.suggestSendAmt){ }}
            <div><span>{{item.channel}}: </span>{{item.suggestSendAmt}}</div>
            {{# } }}
        {{#　})　}}
      {{# } }}
    </div> --%>
    <div>{{d.suggestSendAmt || '' }}</div>
    <%-- <div title="编辑建议发货数量" lay-event="editSuggestSendAmt"><i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;">&#xe642;</i></div> --%>
</script>

<script type="text/html" id="selection_showSyncProdInfoPop">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="selection_showSyncProdInfTable" lay-filter="selection_showSyncProdInfTable"></table>
        </div>
    </div>
</script>


<%-- 时间 --%>
<script type="text/html" id="selection_times">
    <div class="alignLeft">
        <%-- <div><span class="secondary">创建:</span>{{Format(d.createTime,'yyyy-MM-dd') || ''}}</div>
        <div><span class="secondary">发布:</span>{{Format(d.releaseTime,'yyyy-MM-dd') || ''}}</div> --%>
        <%--<div><span class="secondary">注册:</span>{{Format(d.registTime,'yyyy-MM-dd') || ''}}</div>--%>
        <div><span class="secondary">审核:</span>{{Format(d.winitSInfo.auditTime,'yyyy-MM-dd') || ''}}</div>
        <%-- <div><span class="secondary">分配:</span>{{Format(d.pSiteInfo.allocateTime,'yyyy-MM-dd') || ''}}</div> --%>
    </div>
</script>


<%-- 操作 --%>
<script type="text/html" id="selection_toolBar">
    <%-- <span class="layui-btn layui-btn-xs" lay-event="transfer">转移产品</span> --%>
    <permTag:perm funcCode="selection_product">
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="select">选品</span><br>
    </permTag:perm>
    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="setprice">定价</span>
</script>


<%-- 链接详情 --%>
<script  type="text/html" id="selection_linkDetailLayer">
    <div class="p20" id="selection_linkDetailContainer"></div>
</script>
<script type="text/html" id="selection_linkDetailContainerTpl">
    <table class="layui-table">
        <thead>
            <tr>
                <th>销售渠道</th>
                <th>链接</th>
            </tr>
        </thead>
        <tbody>
            {{# if(d.compList){ }}
                {{#  layui.each(d.compList, function(index, item){ }}
                <tr style="text-align:center;">
                    <td>{{item.channel || ''}}</td>
                    <td><a href="{{commonUrlHandle(item.url)}}" class="canClickEl" target="_blank">点击跳转</a></td>
                </tr>
                {{# }) }}
            {{# } }}
        </tbody>
    </table>
</script>
<%-- 编辑建议发货数量 --%>
<script type="text/html" id="selection_editSuggestSendAmtPopLayer">
    <div class="p20">
        <form class="layui-form" id="selection_editSuggestSendAmtForm">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <table class="layui-table" id="selection_suggestSendAmtTable"  lay-filter="selection_suggestSendAmtTable" ></table>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>
<%-- 转移产品 --%>
<script type="text/html" id="selection_transferLayer">
    <div class="layui-form p20" id="selection_transferContainer">
    </div>
</script>
<script type="text/html" id="selection_transferContainerTpl">
    <div class="layui-form-item">
        <label class="layui-form-label">父SKU</label>
        <div class="layui-input-block">
            <input type="text" class="layui-input" name="pSku" value="{{d.prodPInfo.pSku}}" disabled>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">原销售</label>
        <div class="layui-input-block">
        {{# if(d.pSiteInfo){ }}
            <input type="text" class="layui-input" name="olderSaler" value="{{d.pSiteInfo.saler || ''}} " disabled>
            <input type="hidden" name="pSiteId" value="{{d.pSiteInfo.id || ''}} " disabled>
        {{# } }}
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">新销售</label>
        <div class="layui-input-block">
            <select name="newSalerId" lay-filter="transfer_newSaler">
            {{# if(d.newSaler){ }}
                {{#  layui.each(d.newSaler, function(index, item){ }}
                    <option value="{{item.salerId}}">{{item.saler || ''}}</option>
                {{#　})　}}
            {{# } }}
            </select>
        </div>
    </div>
</script>

<%-- 选品意向 --%>
<script type="text/html" id="selection_selectInitLayer">
    <div class="p20" id="selection_selectInitContainer"></div>
</script>
<script type="text/html" id="selection_selectInitContainerTpl">
    <table class="layui-table">
        <thead>
            <tr>
                <th>销售渠道</th>
                <th>父SKU</th>
                <th>创建时间</th>
            </tr>
        </thead>
        <tbody>
        {{#　if(d){　}}
            {{#  layui.each(d, function(index, item){ }}
            <tr style="text-align:center;">
                <td>{{item.channel || ''}}</td>
                <td>{{item.pSku || ''}}</td>
                <td>{{Format(item.createTime,'yyyy-MM-dd hh:mm:ss') || ''}}</td>
            </tr>
            {{# }) }}
        {{# } }}
        </tbody>
    </table>
</script>

<%-- 物流属性 --%>
<select class="disN" id="selection_logisAttrList">
</select>

<script type="text/javascript">
    // 获取物流属性的简称
    function selection_getColorOfLogis(name) {
        let totalLogis = $('#selection_logisAttrList').find('option')
        let alias = ''
        if (!name) {
            return alias
        }
        for (let i = 0; i < totalLogis.length; ++i) {
            if (name === totalLogis[i].value) {
                alias = totalLogis[i].getAttribute('alias')
                alias = alias ? alias : '#999999'
            }
        }
        return alias
    }
    let firstWayTypeJson
    // 获取头程类型名
    function selection_getFirstWayTypeName(type) {
        if (!firstWayTypeJson) {
            firstWayTypeJson = {}
            let options = $('#selection_firstWayType').find('option')
            for (let i = 0; i < options.length; ++i) {
                firstWayTypeJson[options[i].value] = options[i].text
            }
        }
        return firstWayTypeJson[type]
    }
</script>



<script src="${ctx}/static/js/wyt/info/selection.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/productTplButton.js?v=${ver}"></script>
<%@ include file="/WEB-INF/view/jsp/wyt/info/component.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>