<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>销售产品管理</title>
<style>
    .secondary {
        color: grey;
    }
    .layui-table.managementHoverTable th,
    .layui-table.managementHoverTable td {
        padding:5px;
        height:10px;
        line-height:10px;
    }
    .wid60 {
        width: 60px;
        text-align:center;
    }
    .wid80{
        width: 80px;
        text-align:center;
    }
    .wid120 {
        width: 120px;
        text-align:center;
    }
    table.mangement_colspantable td {
        border: 0px;
        margin-left: -5px;
        width:390px;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="management_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType">
                                        <option value="rsSku">注册SKU</option>
                                        <option value="pSku">商品父SKU</option>
                                        <option value="sSku">商品子SKU</option>
                                        <option value="cnName">中文简称</option>
                                        <option value="enName">英文简称</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="searchValue">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" id="orgs_hp_devPerson_managementForm">
                               <div class="layui-form-label labelSel">
                                    <select name="bizzOwnerOrganize" lay-filter="orgs_hp_devPerson_management" class="orgs_hp_custom" data-id="management_devPerson" data-title="开发专员部门">
                                        <option value="">开发专员部门</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerIdListStr" 
                                    lay-filter="users_hp_devPerson_management"  
                                    class="users_hp_custom" 
                                    data-title="开发专员" 
                                    data-id="management_devPerson" 
                                    data-roleList="开发专员"
                                    xm-select="management_devPerson" 
                                    xm-select-search 
                                    xm-select-search-type="dl" 
                                    xm-select-skin="normal">
                                        <option value="">开发专员</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" id="orgs_hp_saler_managementForm">
                                <div class="layui-form-label labelSel">
                                    <select name="salerOrganize" lay-filter="orgs_hp_saler_management" class="orgs_hp_custom" data-id="management_saler" data-title="部门">
                                        <option value="">部门</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="salerIdListStr"
                                    lay-search 
                                    lay-filter="users_hp_saler_management" 
                                    class="users_hp_custom" 
                                    data-title="海外仓销售员" 
                                    data-id="management_saler" 
                                    data-roleList="万邑通专员"
                                    >
                                        <option value="">海外仓销售员</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select name="logisAttr" id="management_logisticAttrRender">
                                    
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售渠道</label>
                                <div class="layui-input-block">
                                    <select name="channel" 
                                        id="management_channelSelect" 
                                        lay-filter="management_channelFilter"
                                    >
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">服务商</label>
                                <div class="layui-input-block">
                                    <select name="serviceTypeListStr" xm-select="management_serviceTypeListStr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='management_serviceTypeListStr'>
                                        <option value="">全部</option>
                                        <option value="1">万邑通</option>
                                        <option value="2">谷仓</option>
                                        <option value="3">递四方</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" id="management_ifLetter">
                                <label class="layui-form-label">是否信件</label>
                                <div class="layui-input-block">
                                    <select name="ifLetter" disabled>
                                    <option value="">请先选择渠道</option>
                                    <option value="false">否</option>
                                    <option value="true">是</option>
                                    <option value="">无</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发状态</label>
                                <div class="layui-input-block">
                                    <select name="ifEffective">
                                        <option value="">全部</option>
                                        <option value="false">无效</option>
                                        <option value="true">有效</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售状态</label>
                                <div class="layui-input-block">
                                    <select name="ifSale">
                                        <option value="">全部</option>
                                        <option value="true">售卖</option>
                                        <option value="false">不卖</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-form-label labelSel">
                                    <select name="searchTimeType">
                                        <option value="1">选品时间</option>
                                        <option value="2">上架时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="searchTime" id="management_timeRange">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">库存成本</label>
                                <div class="layui-input-block" style="display:flex;">
                                <input type="number" class="layui-input" name="averageCostMin">
                                <input type="number" class="layui-input" name="averageCostMax"> 
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 toHideForNotSucc">
                                <div class="layui-form-label labelSel">
                                    <select name="salesQtyType">
                                        <option value="1">7天销量</option>
                                        <option value="2">15天销量</option>
                                        <option value="3">30天销量</option>
                                    </select>
                                </div>
                                <div class="layui-input-block" style="display:flex;">
                                <input type="number" class="layui-input" name="salesQtyMin">
                                <input type="number" class="layui-input" name="salesQtyMax"> 
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 toHideForNotSucc">
                                <div class="layui-form-label labelSel">
                                    <select name="stockType">
                                        <option value="1">待发</option>
                                        <option value="2">在途</option>
                                        <option value="3">可用</option>
                                    </select>
                                </div>
                                <div class="layui-input-block" style="display:flex;">
                                <input type="number" class="layui-input" name="stockQtyMin">
                                <input type="number" class="layui-input" name="stockQtyMax"> 
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 toHideForNotSucc">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderBy">
                                        <option value="">请选择</option>
                                        <option value="t1.create_time desc">选品时间倒序</option>
                                        <option value="t1.create_time asc">选品时间正序</option>
                                        <option value="t1.total_sales_qty7 desc">7天销量倒序</option>
                                        <option value="t1.total_sales_qty7 asc">7天销量正序</option>
                                        <option value="t1.total_sales_qty desc">30天销量倒序</option>
                                        <option value="t1.total_sales_qty asc">30天销量正序</option>
                                        <option value="t2.thirty_sales desc">历史总销量倒序</option>
                                        <option value="t2.thirty_sales asc">历史总销量正序</option>
                                        <option value="t1.total_available_stock desc">可用数量倒序</option>
                                        <option value="t1.total_available_stock asc">可用数量正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4 toHideForNotSucc">
                                <div class="layui-form-label">库龄</div>
                                <div class="layui-input-block" style="display:flex;">
                                    <input type="number" class="layui-input" name="merchandiseAgeMin" placeholder="<=库龄">
                                    <input type="number" class="layui-input" name="merchandiseAgeMax" placeholder=">=库龄"> 
                                    <input type="number" class="layui-input" name="ageStockMin" placeholder="<=库存">
                                    <input type="number" class="layui-input" name="ageStockMax" placeholder="<=库存"> 
                                </div>
                            </div>
                            <input type="hidden" name="registStatus" value="2" id="management_registStatus">
                            <div class="layui-col-md2 layui-col-lg2 pl20" style="float: right;">
                                <span class="layui-btn layui-btn-sm layui-btn-normal keyHandle" lay-submit lay-filter="management_submit">查询</span>
                                <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="managementCard">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header">
                        <div class="fl">
                            <div class="layui-tab fl" lay-filter="management-tabs" id="management-tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">注册成功(<span class="regist_status2">0</span>)</li>
                                    <li>注册中(<span class="regist_status1">0</span>)</li>
                                    <li>注册失败(<span class="regist_status3">0</span>)</li>
                                </ul>
                            </div>
                            <div class="fl">
                                <permTag:perm funcCode="management_export">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" id="management_export">
                                    导出
                                </span>
                                </permTag:perm>
                            </div>
                        </div>
                        <div class="fr">
                            <div>
                            <permTag:perm funcCode="management_register">
                                <span class="layui-btn layui-btn-sm layui-btn-warm disN" id="management_batchRegister">
                                    注册产品
                                </span>
                            </permTag:perm>
                            <permTag:perm funcCode="management_transfer">
                                <span class="layui-btn layui-btn-sm layui-btn-danger" id="management_batchTransfer">
                                    转移产品
                                </span>
                            </permTag:perm>
                            <permTag:perm funcCode="management_result">
                                <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="management_synchroResult">
                                    同步注册结果
                                </span>
                            </permTag:perm>
                            <permTag:perm funcCode="management_info">
                                <span class="layui-btn layui-btn-sm layui-btn-normal disN" id="management_synchroInfo">
                                    同步海外仓商品信息
                                </span>
                            </permTag:perm>
                            <permTag:perm funcCode="management_summary">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" id="management_summary">
                                    汇总
                                </span>
                            </permTag:perm>
                            <permTag:perm funcCode="management_replenishment">
                                <span class="layui-btn layui-btn-sm layui-btn-normal" id="management_replenishment">
                                    补货
                                </span>
                            </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="management_table"  lay-filter="management_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格-销售渠道 --%>
<script type="text/html" id="management_channelInfo">
    <div>
        <div class="management_channelHover canClickEl">{{ d.channel || '' }}</div>
        <input type="hidden" value='{{JSON.stringify(d.allSalerList)}}'>
        <div>{{ d.serviceType ? selection_getServiceName(d.serviceType) : '' }}</div>
    </div>
</script>

<%-- 表格-待发 --%>
<script type="text/html" id="management_reservedInventory">
    <div>
        {{# if(d.winitStock){ }}
         <span>{{d.winitStock.reservedInventory || 0 }}</span>
        {{# } }}
    </div>
</script>
<%-- 表格-在途 --%>
<script type="text/html" id="management_pipelineInventory">
    <div>
        {{# if(d.winitStock){ }}
         <span>{{d.winitStock.pipelineInventory || 0 }}</span>
        {{# } }}
    </div>
</script>
<%-- 表格-在库 --%>
<script type="text/html" id="management_inventory">
    <div>
        {{# if(d.winitStock){ }}
         <span>{{d.winitStock.inventory || 0 }}</span>
        {{# } }}
    </div>
</script>

<%-- 表格-图片 --%>
<script type="text/html" id="management_img">
    {{#  if(typeof(d.prodSInfo.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.prodSInfo.image }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy img_show_hide" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<%-- 表格-sku --%>
<script type="text/html" id="management_sku">
    <div class="alignLeft">
        <div><span class="secondary">注册:</span>
            <span class="management_registerHover canClickEl">{{d.registerSku || ''}}</span>
            <input type="hidden" value='{{JSON.stringify(d)}}'>
        </div>
        {{# if(d.prodSInfo){ }}
            <%-- <div><span class="secondary">商品子:</span>{{d.prodSInfo.sSku || ''}}</div> --%>
            <div><span class="secondary">父:</span>{{d.prodPInfo.pSku || ''}}</div>
        {{#  } }}
        <div><span class="secondary">中:</span>{{d.descCn || ''}}</div>
        <div><span class="secondary">英:</span>{{d.descEn || ''}}</div>
    </div>
</script>
<%-- 表格-物流属性 --%>
<select class="disN" id="management_logisAttrList">
</select>
<script type="text/javascript">
    // 获取物流属性的简称
    function management_getColorOfLogis(name) {
        let totalLogis = $('#management_logisAttrList').find('option')
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
    function management_getFirstWayTypeName(type) {
        if (!firstWayTypeJson) {
            firstWayTypeJson = {}
            let options = $('#management_firstWayType').find('option')
            for (let i = 0; i < options.length; ++i) {
                firstWayTypeJson[options[i].value] = options[i].text
            }
        }
        return firstWayTypeJson[type]
    }
</script>

<%-- 表格-在售 --%>
<script type="text/html" id="management_isSale">
    <div class="layui-form">
        {{# if(d.prodSInfo){ }}
        <input type="checkbox" lay-skin="primary" disabled {{ d.prodSInfo.isSale ? 'checked' : '' }}>
        {{#  }else{ }}
        <input type="checkbox" lay-skin="primary" disabled>
        {{#  } }}
    </div>
</script>

<%-- 表格-简称 --%>
<script type="text/html" id="management_simple">
    <div>
        <div>{{d.descCn || ''}}</div>

        {{# if(d.prodCate){ }}
        <div><span class="secondary">分类: </span>{{d.prodCate.cateCnName || ''}}</div>
        {{#  } }}

        <div><div class="canClickEl" lay-event="showCompList">竞品链接</div></div>
    </div>
</script>

<%-- 表格状态 --%>
<script type="text/html" id="management_status">
    <div  class="alignLeft">
        <div><span class="secondary">销售: </span>{{ d.ifSale==true? '售卖': '不卖' }}</div>
        {{# if(d.prodSInfo){ }}
        <div><span class="secondary">开发: </span>{{d.developStatus ==true ? '有效': '无效'}}</div>
        {{# } }}
        <div><span class="secondary">信件:</span>
            {{# if (d.prodSInfo && d.prodSInfo.suttleWeight != null && d.prodSInfo.packWeight != null && d.prodSInfo.outerBoxHeight && d.prodSInfo.outerBoxLength&& d.prodSInfo.outerBoxWidth) {}}
                {{# if (d.prodSInfo.outerBoxHeight < 2.5 && d.prodSInfo.outerBoxWidth < 25 && d.prodSInfo.outerBoxLength < 35.3&& (d.prodSInfo.suttleWeight + d.prodSInfo.packWeight) < 750) {}}
                    {{#  if(d.channel =='ebay英国'){ }}
                    <span>英国信件</span>
                    {{# } }}
                {{# }}}

                {{# if (d.prodSInfo.outerBoxHeight < 2 && d.prodSInfo.outerBoxWidth < 25 && d.prodSInfo.outerBoxLength < 35.3 && (d.prodSInfo.suttleWeight + d.prodSInfo.packWeight) < 500) {}}
                    {{#  if(d.channel =='ebay德国'){ }}
                    <span>德国信件</span>
                    {{# } }}
                {{# }}}
            {{# } }}
        </div>
        <div><span class="secondary">物流:</span>
        {{#  if(d.prodSInfo.logisAttrList!=undefined && d.prodSInfo.logisAttrList!=''){ }}
        {{# var logisAttrArr = d.prodSInfo.logisAttrList.split(',')}}
        {{# var alia}}
        {{# for (var i = 0; i < logisAttrArr.length; ++i) { }}
        {{# alia = management_getColorOfLogis(logisAttrArr[i])}}
        {{#  if(alia && alia != '普'){ }}
        <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logisAttrArr[i]}}">{{alia}}</span>
        {{#}}}
        {{#}}}
        {{#  } }}
        {{# if(d.prodSInfo.ifWithPlug){ }}
          <span class="layui-bg-blue hp-badge ml5" title="物流属性: 带插头">插</span>
        {{# } }}
        </div>
    </div>
</script>

<%-- 表格-责任人 --%>
<script type="text/html" id="management_responser">
    <div  class="alignLeft">
        <div><span class="secondary">销售: </span>{{ d.saler }}
        {{# if(d.prodSInfo){ }}
        <div><span class="secondary">开发: </span>{{d.prodPInfo.bizzOwner || ''}}
        {{# } }}
        </div>
        {{# if(d.prodSInfo){ }}
        <div><span class="secondary">采购: </span>{{d.prodSInfo.buyer || ''}}</div>
        {{# } }}
    </div>
</script>

<%-- 表格-入库成本 --%>
<script type="text/html" id="management_cost">
     <div class="alignLeft management_avgcost">
        <div><span class="secondary">商品成本:</span>
        {{# if(d.prodSInfo){ }}
            <span  lay-event="showPrePublishPrice" class="canClickEl">{{accAdd(d.prodSInfo.purchaseCostPrice,d.prodSInfo.innerPackCost).toFixed(2)}}</span>
        {{# } }}
        </div>
        <div><span class="secondary">库存成本:</span>
            <span  lay-event="setprice" class="canClickEl">
                {{# if (d.winitStockOaList && d.winitStockOaList.length > 0) {}}
                    {{# let totalCost = 0,totalNum = 0}}
                    {{# for (let i = 0; i < d.winitStockOaList.length; ++i) {}}
                        {{# totalCost +=  d.winitStockOaList[i].avgCost * d.winitStockOaList[i].currentStock ; }}
                        {{# totalNum +=  d.winitStockOaList[i].currentStock ; }}
                    {{# } }}
                    {{totalNum ? accDiv(totalCost,totalNum).toFixed(2):""}}
                {{# } }}
            </span>
        </div>
        <div>
            <span class="secondary">库存总成本:</span>
            <span>{{(Number(d.totalCostStock)+Number(d.waitDeliverCost)+Number(d.onwayCost)).toFixed(2)}}</span>
        </div>
     </div>
</script>

<%-- 表格-重量 --%>
<script type="text/html" id="management_weight">
    <div class="alignLeft">
        {{# if(d.prodSInfo){ }}
            <div><span class="secondary">实重: </span>{{accAdd(d.prodSInfo.suttleWeight || 0, d.prodSInfo.packWeight || 0).toFixed(2)  }}</div>
            <div><span class="secondary">抛重(5): </span>{{accDiv(accMul(accMul(d.prodSInfo.outerBoxLength || 0, d.prodSInfo.outerBoxWidth || 0), d.prodSInfo.outerBoxHeight || 0),5).toFixed(2) }}</div>
            <div><span class="secondary">抛重(6): </span>{{accDiv(accMul(accMul(d.prodSInfo.outerBoxLength || 0, d.prodSInfo.outerBoxWidth || 0), d.prodSInfo.outerBoxHeight || 0),6).toFixed(2) }}</div>
            <div><span class="secondary">抛重(8): </span>{{accDiv(accMul(accMul(d.prodSInfo.outerBoxLength || 0, d.prodSInfo.outerBoxWidth || 0), d.prodSInfo.outerBoxHeight || 0),8).toFixed(2) }}</div>
        {{# } }}
    </div>
</script>

<%-- 表格-尺寸 --%>
<script type="text/html" id="management_size">
    <div class="alignLeft">
    {{# if(d.prodSInfo){ }}
        <div><span class="secondary">包裹长: </span>{{d.prodSInfo.outerBoxLength || ''}}</div>
        <div><span class="secondary">包裹宽: </span>{{d.prodSInfo.outerBoxWidth || ''}}</div>
        <div><span class="secondary">包裹高: </span>{{d.prodSInfo.outerBoxHeight || ''}}</div>
    {{# } }}
    </div>
</script>

<%-- 表格-万邑通数据 --%>
<script type="text/html" id="management_data">
    <div>
        <div class="alignLeft">
            <div><span class="secondary">申报价值：</span>{{d.importDeclareValue || ''}}</div>
            <div><span class="secondary">进口税率：</span>{{d.syncProdInfo.importRate || ''}}</div>
            <div><span class="secondary">允许存储：</span>{{d.syncProdInfo.allowSave ? '是' : '否'}}</div>
        </div>
    </div>
    <div class="clearLeft canClickEl" onmouseover="showTip(`{{d.winitDescription || ''}}`, this)" onmouseleave="removeTip(this)">备注</div>
</script>

<%-- 表格-销量 --%>
<script type="text/html" id="management_volume">
    <div  class="alignLeft">
        {{# if(d.prodSInfo){ }}
        <div><span class="secondary">7日: </span>{{d.totalSalesQty7 ? d.totalSalesQty7.toFixed(0): ''}}</div>
        <div><span class="secondary">15日: </span>{{d.totalSalesQty15 ? d.totalSalesQty15.toFixed(0): ''}}</div>
        <div><span class="secondary">30日: </span>{{d.totalSalesQty ? d.totalSalesQty.toFixed(0): ''}}</div>
        {{# }else{ }}
        <div><span class="secondary">7日: </span></div>
        <div><span class="secondary">15日: </span></div>
        <div><span class="secondary">30日: </span></div>
        {{# } }}
    </div>
</script>

<%-- 表格-时间 --%>
<script type="text/html" id="management_times">
    <div class="alignLeft">
        <div><span class="secondary">选品时间:</span>{{Format(d.createTime,'yyyy-MM-dd') || ''}}</div>
        <div><span class="secondary">上架时间:</span>{{Format(d.lastShelfTime,'yyyy-MM-dd') || ''}}</div>
    </div>
</script>

<%-- 表格-内嵌表格 --%>
<script type="text/html" id="management_detail">
    <table class="layui-table mangement_colspantable">
    {{# if(d.winitStockList.length){ }}
        {{#  layui.each(d.winitStockList, function(index, item){ }}
            {{#  if(index ==d.winitStockList.length-1){ }}
            <tr>
            {{#  }else{ }}
            <tr style="border-bottom: 1px solid #e6e6e6 !important">
            {{#  } }}
                <td style="width:130px;text-align:left;"> {{item.winitStoreName || ''}}</td>
                <td style="width:60px;text-align:center;"> {{item.oaWaitDeliverQty || ''}}</td>
                <td style="width:60px;text-align:center;"> {{item.qtyOrdered }}</td>
                <td style="width:60px;text-align:center;"> {{item.qtyAvailable || ''}}</td>
                <td style="width:70px;text-align:center;">
                    <div style="display:flex;flex-direction:column;">
                    {{# if(d.winitWarehouseReceiptDetailList.length){ }}
                    {{# layui.each(d.winitWarehouseReceiptDetailList, function(listIndex, listItem){ }}
                        {{# if(listItem.winitStoreId == item.winitStoreId){ }}
                            <span>{{ listItem.merchandiseAge}}天: {{listItem.totalQty}}</span>
                        {{# } }}
                    {{# }) }}
                    {{# } }}
                    </div>
                </td>
            </tr>
        {{# }) }}
    {{# } }}
    </table>
</script>


<%-- 表格-操作 --%>
<script type="text/html" id="management_toolBar">
    <permTag:perm funcCode="management_transfer">
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="transfer">转移</span><br>
    </permTag:perm>
    <permTag:perm funcCode="management_print">
        <span class="layui-btn layui-btn-xs" lay-event="print">打印</span><br>
    </permTag:perm>
    <permTag:perm funcCode="management_detail">
    <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="detail">详情</span><br>
    </permTag:perm>
    {{# if(d.ifSale){ }}
    <permTag:perm funcCode="management_notSale">
        <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="notSale">不卖</span><br>
    </permTag:perm>
    {{# }else{ }}
    <permTag:perm funcCode="management_sale">
        <span class="layui-btn layui-btn-xs" lay-event="sale">售卖</span><br>
    </permTag:perm>
    {{# } }}
    {{# if(d.syncProdInfo && d.syncProdInfo.registerStatus == 3){ }}
    <permTag:perm funcCode="management_register">
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="register">注册</span><br>
    </permTag:perm>
    <permTag:perm funcCode="management_edit">
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="edit">修改</span><br>
    </permTag:perm>
    {{# } }}
    <span class="layui-btn layui-btn-xs layui-btn-warm" lay-event="logs">日志</span>
</script>


<%-- 弹框 - 链接详情 --%>
<script  type="text/html" id="management_linkDetailLayer">
    <div class="p20" id="management_linkDetailContainer"></div>
</script>
<script type="text/html" id="management_linkDetailContainerTpl">
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

<%-- 弹框 -转移产品 --%>
<script type="text/html" id="management_transferLayer">
    <div class="layui-form p20" id="orgs_hp_saler_managementLayerForm">
        <div class="layui-form-label">
           新销售
        </div>
        <div class="layui-input-block">
            <select name="salerIdListLayerStr"
            lay-search 
            lay-filter="users_hp_saler_managementLayer" 
            class="users_hp_custom" 
            data-title="海外仓销售员" 
            data-id="management_salerLayer" 
            data-roleList="万邑通专员"
            >
                <option value="">海外仓销售员</option>
            </select>
        </div>
    </div>
</script>

<%-- 弹框 - 修改产品 --%>
<script type="text/html" id="management_editLayer">
    <div class="layui-form p20">
        <div class="layui-form-item">
            <div class="layui-form-label">商品简称</div>
            <div class="layui-input-block">
                <input type="text" class="layui-input" autocomplete="false" name="descCn">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-form-label">申报价值(进口/出口)</div>
            <div class="layui-input-block">
                <input type="text" class="layui-input" autocomplete="false" name="importDeclareValue">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-form-label">竞品链接</div>
            <div class="layui-input-block">
                <input type="text" class="layui-input" autocomplete="false" name="skuLink">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-form-label">备注</div>
            <div class="layui-input-block">
                <textarea name="winitDescription" class="layui-textarea">
                </textarea>
            </div>
        </div>
    </div>
</script>

<%-- 弹框 - 日志 --%>
<script type="text/html" id="mangement_logsTable">
    <div id="mangement_logsTableContainer" style="padding:20px;"></div>
</script>
<script type="text/html" id="mangement_logsTableTpl">
    {{# if(d.length){ }}
    <table class="layui-table">
        <thead>
            <tr>
                <th>时间</th>
                <th>操作</th>
                <th>操作人</th>
            </tr>
        </thead>
        <tbody>
            {{#  layui.each(d, function(index, item){ }}
            <tr>
                <td>{{ new Date(item.operTime).toLocaleString() }}</td>
                <td>{{item.operDesc}}</td>
                <td>{{item.operator}}</td>
            </tr>
            {{# }) }}
        </tbody>
    </table>
    {{# }else{ }}
     <div>暂无操作日志</div>
    {{# } }}
</script>

<%-- 弹框 - 详情 --%>
<script type="text/html" id="mangement_publishDetailLayer">
    <div id="mangement_publishDetailContainer" style="padding:20px;"></div>
</script>
<script type="text/html" id="mangement_publishDetailTpl">
    {{# if(d.length){ }}
    <table class="layui-table">
        <thead>
            <tr>
                <th>itemID</th>
                <th>店铺</th>
                <th>站点</th>
                <th>物品所在国</th>
                <th>注册SKU</th>
                <th>店铺SKU</th>
                <th>刊登价格</th>
                <th>在线数量</th>
                <th>Listing销量</th>
                <th>Listing 7日销量</th>
                <th>刊登时间</th>
            </tr>
        </thead>
        <tbody>
            {{#  layui.each(d, function(index, item){ }}
            <tr>
                <td>
                   {{# if(item.itemId){ }}
                    {{# if(item.plat == 'smt'){ }}
                    <a href="https://www.aliexpress.com/item/{{item.itemId}}.html" target="_blank" class="canClickEl">{{item.itemId}}</a>
                    {{# }else if(item.plat == 'wish'){ }}
                    <a href="https://www.wish.com/product/{{item.itemId}}" target="_blank" class="canClickEl">{{item.itemId}}</a>
                    {{# }else if(item.plat == 'ebay'){ }}
                    <a href="https://www.ebay.com/itm/{{item.itemId}}" target="_blank" class="canClickEl">{{item.itemId}}</a>
                    {{# }else if(item.plat == 'joom'){ }}
                    <a href="https://www.joom.com/en/products/{{item.itemId}}" target="_blank" class="canClickEl">{{item.itemId}}</a>
                    {{# }else{ }}
                    <a href="{{item.itemIdSrc}}" target="_blank" class="canClickEl">{{ item.itemId || '' }}</a>
                    {{# } }}
                    {{# } }}
                </td>
                <td>{{item.storeName || ''}}</td>
                <td>{{item.site || ''}}</td>
                <td>{{item.country || ''}}</td>
                <td>{{item.registerSku || ''}}</td>
                <td>{{item.storeSSku || ''}}</td>
                <td><strong>{{item.currency || '无'}}:</strong>{{item.listingPrice || ''}}</td>
                <td>{{item.onlineQty || ''}}</td>
                <td>{{item.listingSalesQty || ''}}</td>
                <td>{{item.listingSalesQty7 || ''}}</td>
                <td>{{ new Date(item.listingTime).toLocaleString() || '' }}</td>
            </tr>
            {{# }) }}
        </tbody>
    </table>
    {{# }else{ }}
     <div>暂无刊登详情</div>
    {{# } }}
</script>

<%-- 弹框 - 汇总 --%>
<script type="text/html" id="mangement_summaryLayer">
    <div id="mangement_summaryContainer" style="padding:20px;">
        <table class="layui-table" id="mangement_summaryContainer_table"></table>
    </div>
</script>

<%-- 弹框 -补货 --%>
<script type="text/html" id="mangement_replenishmentLayer">
    <div id="mangement_replenishmentContainer" style="padding:20px;"></div>
</script>
<script type="text/html" id="mangement_replenishmentTpl">
    <table class="layui-table" id="replenishTbale">
        <thead>
            <tr>
                <th>注册SKU</th>
                <th>销售渠道</th>
                <th>收货仓库</th>
                <th>
                    <div style="display: flex;align-items: center">
                        <span>头程渠道</span>
                        <div id="channelSelect" style="width: 200px"></div>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" style="cursor: pointer" onclick="hanldeSetChannel(this)">一键应用</span>
                    </div>
                </th>
                <th>
                    <div style="display: flex;align-items: center">
                        <span>发货数量</span>
                        <input type="number" id="setCount" class="layui-input" style="width: 150px" name="number" min="0">
                        <span class="layui-btn layui-btn-sm layui-btn-normal" style="cursor: pointer" onclick="hanldeSetCount(this)">一键应用</span>
                    </div>
                </th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            {{#  layui.each(d, function(index, item){ }}
                <tr>
                    <td>{{item.registerSku}}</td>
                    <td>{{item.channel}}</td>
                    <td>
                        <div class="layui-form">
                            <select name="warehouse">
                                {{# layui.each(item.warehouseArr, function(warehouseIndex, warehouseItem){  }}
                                    {{# if(item.channel == warehouseItem.channel){ }}
                                    <option value="{{warehouseItem.id}}">{{warehouseItem.name}}</option>
                                    {{# } }}
                                {{# }) }}
                            </select>
                        </div>
                    </td>
                    <td>
                        <div class="layui-form">
                            <select name="channel">
                                {{# layui.each(item.channelArr, function(channelIndex, channelItem){  }}
                                    <option value="{{channelItem.saleLogisticsTypeName}}">{{channelItem.saleLogisticsTypeName}}</option>
                                {{# }) }}
                            </select>
                        </div>
                    </td>
                    <td>
                        <input type="number" class="layui-input" name="number" min="0">
                    </td>
                    <td><span class="layui-btn layui-btn-sm layui-btn-danger" onclick="commonDelTr(this)">移除</span></td>
                </tr>
            {{# }) }}
        </tbody>
    </table>
</script>


<script type="text/html" id="mangement_channelTpl">
    <div class="layui-form">
        <select id="setChannel">
            {{# layui.each(d.channelArr, function(channelIndex, channelItem){  }}
            <option value="{{channelItem.saleLogisticsTypeName}}">{{channelItem.saleLogisticsTypeName}}</option>
            {{# }) }}
        </select>
    </div>
</script>



<script src="${ctx}/static/js/wyt/info/management.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/wyt/winitutil.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/template/productTplButton.js?v=${ver}"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<%@ include file="/WEB-INF/view/jsp/wyt/info/component.jsp" %>