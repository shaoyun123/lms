<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<script type="text/html" id="proceeFbaSalesTable_layer">
    <div class="layui-card">
        <div class="layui-card-body">
            <table lay-filter="processFbaSalesTable_table" class="layui-table" id="processFbaSalesTable_table"></table>
        </div>
    </div>
</script>

<script type="text/html" id="processFbaSalesTable_pSkuTpl">
    <div class="canClickEl" onclick="newdevdetail_openDevDetail({{d.prodPId}})">
        {{d.devInfo.pSku}}
    </div>
    <div>{{d.countryCode}}</div>
</script>
<script type="text/html" id="processFbaSalesTable_personTpl">
    <div class="alignLeft" >
        <div><div class="secondary fl clearLeft">开发:</div><div class="fl">{{d.devInfo.creator}}</div></div>
        <div><div class="secondary fl clearLeft">销售:</div><div class="fl">{{d.salesPerson || ''}}</div></div>
    </div>
</script>
<script type="text/html" id="processFbaSalesTable_cnTitleTpl">
    <div>
        {{d.devInfo.cnName}}
    </div>
    <div class="secondary">
        {{d.devInfo.cateName}}
    </div>
</script>

<script type="text/html" id="processFbaSalesTable_subDetail_sSku">
    <table width="100%">
        {{# for (let i = 0; i < d.subDetailList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.subDetailList[i].sSku}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="processFbaSalesTable_subDetail_deliverAmount">
    <table width="100%">
        {{# for (let i = 0; i < d.subDetailList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.subDetailList[i].deliveryAmount}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="processFbaSalesTable_subDetail_asin">
    <table width="100%">
        {{# for (let i = 0; i < d.subDetailList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.subDetailList[i].asin || ''}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="processFbaSalesTable_subDetail_weight">
    <table width="100%">
        {{# for (let i = 0; i < d.subDetailList.length; ++i) {}}
        <tr class="height30">
            <td>{{accDiv(accMul(d.subDetailList[i].deliveryAmount, accAdd(d.subDetailList[i].suttleWeight,d.subDetailList[i].packWeight)),1000)}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="processFbaSalesTable_timeTpl">
    <div class="alignLeft" >
        <div><div class="secondary fl clearLeft">提交发货:</div><div class="fl">{{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</div></div>
        <div><div class="secondary fl clearLeft">文案审核:</div><div class="fl">{{d.prodPInfo != null ? Format(d.prodPInfo.auditTime,'yyyy-MM-dd hh:mm') : ''}}</div></div>
        <div><div class="secondary fl clearLeft">分配销售:</div><div class="fl">{{Format(d.distributeTime,'yyyy-MM-dd hh:mm')}}</div></div>
        <div><div class="secondary fl clearLeft">采购订单:</div><div class="fl">{{d.purBillNumber || ''}}</div></div>
    </div>
</script>
<script type="text/html" id="processFbaSalesTable_shipmentTpl">
    <div>{{d.shipmentId || ''}}</div>
    {{# if (d.shipInfo) {}}
    <div class="alignLeft" >
        <div><div class="secondary fl clearLeft">创建:</div><div class="fl">{{Format(d.shipInfo.createTime,'yyyy-MM-dd hh:mm')}}</div></div>
        <div><div class="secondary fl clearLeft">到货:</div><div class="fl">{{Format(d.shipInfo.fbaReceiveTime,'yyyy-MM-dd hh:mm')}}</div></div>
    </div>
    {{# } }}
</script>
<script type="text/html" id="processFbaSalesTable_ListingTpl">
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


<script type="text/html" id="processFbaSalesTable_CPCTpl">
    <div class="alignLeft" >
        <div><div class="secondary fl clearLeft">完成:</div><div class="fl">{{Format(d.cpcTime,'yyyy-MM-dd hh:mm')}}</div></div>
        {{# if (d.cpcInfo) {}}
        <div><div class="secondary fl clearLeft">创建:</div><div class="fl">{{Format(d.cpcInfo.fbaReceiveTime,'yyyy-MM-dd hh:mm')}}</div></div>
        <div><div class="secondary fl clearLeft">生效:</div><div class="fl">{{Format(d.cpcInfo.fbaReceiveTime,'yyyy-MM-dd hh:mm')}}</div></div>
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

<script type="text/javascript" src="${ctx}/static/js/common/processFbaSalesTable.js?v=${ver}"></script>
