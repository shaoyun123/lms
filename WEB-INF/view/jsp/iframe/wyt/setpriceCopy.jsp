<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>定价</title>

<style>
    .setpriceCopy_header,
    .setpriceCopy_td {
        display:flex;
        line-height: 32px;
    }
    .setpriceCopy_header>input.layui-input {
        width: 60px;
        margin: 0 5px;
    }
</style>

<div class="layui-fluid" id="setpriceCopy_body">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="setpriceCopy_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" id="setpriceCopy_warehouse">
                                        
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select name="logisAttr" id="setpriceCopy_logisticAttr">
                                       
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品成本(￥)</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="prodCost"> 
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">重量(g)</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="prodWeight">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">万邑通长(cm)</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="wrapLength">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">万邑通宽(cm)</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="wrapWidth">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">万邑通高(cm)</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="wrapHeight">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">平台提成</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="platRate" value="0.15">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">毛利率</label>
                                <div class="layui-input-block">
                                   <input type="number" class="layui-input" autocomplete="off" name="grossProfitRate" value="0.25">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺运输方式</label>
                                <div class="layui-input-block">
                                   <input type="text" class="layui-input" autocomplete="off" name="storeTransport">
                                </div>
                            </div>
                            <input type="hidden" name="avgCost">
                            <input type="hidden" name="ifShowTail" value="true">
                            <input type="hidden" name="registerSku">
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="setpriceCopy_submit">定价</span>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div id="setpriceCopy_tables"></div>
                    <script type="text/html" id="setpriceCopy_tablesTpl">
                        {{# if(Object.prototype.toString.call(d.headAndTail)=='[object Array]'){ }}
                        <div><strong>头程定价:</strong></div>
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th>头程物流</th>
                                    <th>尾程物流</th>
                                    <th>计费重(g)</th>
                                    <th>头程运费(￥)</th>
                                    <th>尾程运费(￥)</th>
                                    <th>仓库费用和</th>
                                    <th>VAT(含关税)</th>
                                    <th>预估定价</th>
                                    <th>预估毛利(￥)</th>
                                    <th>设置定价</th>
                                    <th>操作</th>
                                    <th>预估毛利率</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{#  layui.each(d.headAndTail, function(index, item){ }}
                                    <tr>
                                        <td align="center">{{ item.headWayLogistics }}</td>
                                        <td align="center">{{ item.tailWayLogistics }}</td>
                                        <td align="center">
                                            {{ item.chargeWeight }}
                                            <input type="hidden" name="platRate" value="{{item.platRate}}">
                                            <input type="hidden" name="prodCost" value="{{item.prodCost}}">
                                            <input type="hidden" name="vatAndTariff" value="{{item.vatAndTariff}}">
                                            <input type="hidden" name="warehouseFee" value="{{item.warehouseFee}}">
                                            <input type="hidden" name="currency" value="{{item.currency}}">
                                        </td>
                                        <td align="center">
                                            <input type="hidden" name="headWayShipping" value="{{item.headWayShipping}}">
                                            <strong>
                                                <font size="4">{{Number(item.headWayShipping).toFixed(2)}}</font>
                                            </strong>
                                        </td>
                                        <td align="center">
                                            <input type="hidden" name="tailWayShipping" value="{{item.tailWayShipping}}">
                                            <strong>
                                                <font size="4">{{Number(item.tailWayShipping).toFixed(2)}}</font>
                                            </strong>
                                        </td>
                                        <td align="center">
                                            <div class="setpriceCopy_warehouseFeeDetail">
                                                <span>{{item.currency}}:</span>
                                                <strong><font size="4">{{Number(item.warehouseFee).toFixed(2)}}</font></strong>
                                            </div>
                                            <input type="hidden" name="warehouseFeeDetail" value='{{JSON.stringify(item)}}'>
                                        </td>
                                        <td align="center">
                                            <span>USD:</span>
                                            <strong>
                                                <font size="4">{{Number(item.vatAndTariff).toFixed(2)}}</font>
                                            </strong>
                                        </td>
                                        <td align="center">
                                            <span>{{item.currency}}:</span>
                                            <strong>
                                                <font size="4">{{Number(item.estimatePrice).toFixed(2)}}</font>
                                            </strong>
                                        </td>
                                        <td align="center">
                                            <strong>
                                                <font size="4">{{Number(item.estimateGrossPrice).toFixed(2)}}</font>
                                            </strong>
                                        </td>
                                        <td align="center">
                                            <div class="setpriceCopy_td">
                                                <span>{{item.currency}}</span>
                                                <input type="number" class="layui-input" name="setpriceCopy" autocomplete="off">
                                            </div>
                                        </td>
                                        <td align="center">
                                            <span class="layui-btn layui-btn-xs layui-btn-normal setpriceCopy_computed">
                                                计算毛利率
                                            </span>
                                        </td>
                                        <td align="center">
                                            <div>{{ item.estimate || '' }}</div>
                                        </td>
                                    </tr>
                                {{# }) }}                               
                            </tbody>
                        </table>
                        {{# }else{ }}
                            <div>{{ d.headAndTail || '头程定价暂无数据' }}</div>
                        {{# } }}
                        <br />
                        <br />
                        {{# if(Object.prototype.toString.call(d.tail)=='[object Array]'){ }}
                        <div><strong>尾程定价:</strong></div>
                        <table class="layui-table">
                            <thead>
                                <tr>
                                    <th>尾程物流</th>
                                    <th>平均成本(¥)</th>
                                    <th>尾程运费(¥)</th>
                                    <th>仓库出库费</th>
                                    <th>预估定价</th>
                                    <th>预估毛利(¥)</th>
                                    <th>设置定价</th>
                                    <th>操作</th>
                                    <th>预估毛利率</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{# layui.each(d.tail, function(index, item){ }}
                                <tr>
                                    <td align="center">
                                        {{item.tailWayLogistics}}
                                        <input type="hidden" name="currency" value="{{item.currency}}">
                                        <input type="hidden" name="platRate" value="{{item.platRate}}">
                                        <input type="hidden" name="tailWayShipping" value="{{item.tailWayShipping}}">
                                        <input type="hidden" name="warehouseFee" value="{{item.warehouseFee}}">
                                    </td>
                                    <td align="center">
                                        <input type="text" name="avgCost" value="{{item.avgCost}}" class="layui-input">
                                    </td>
                                    <td align="center">
                                        <strong>
                                            <font size="4">{{Number(item.tailWayShipping).toFixed(2)}}</font>
                                        </strong>
                                    </td>
                                    <td align="center">
                                        <div class="setpriceCopy_warehouseFeeDetail">
                                            <span> {{item.currency}}: </span>
                                            <strong>
                                                <font size="4">{{ (Number(item.outboundFee)+Number(item.emergencyExtraFee)).toFixed(2) }}</font>
                                            </strong>
                                        </div>
                                        <input type="hidden" name="warehouseFeeDetail" value='{{JSON.stringify(item)}}'>

                                    </td>
                                    <td align="center">
                                        <span> {{item.currency}}: </span>
                                        <strong>
                                            <font size="4">{{ Number(item.estimatePrice).toFixed(2) }}</font>
                                        </strong>
                                    </td>
                                    <td align="center">
                                        <strong>
                                            <font size="4">{{ Number(item.estimateGrossPrice).toFixed(2) }}</font>
                                        </strong>
                                    </td>
                                    <td align="center">
                                        <div class="setpriceCopy_td">
                                            <span>{{item.currency}}</span>
                                            <input type="number" class="layui-input" name="setpriceTailCopy" autocomplete="off">
                                        </div>
                                    </td>
                                    <td align="center">
                                        <span class="layui-btn layui-btn-xs layui-btn-normal setpriceCopy_tailComputed">
                                            计算毛利率
                                        </span>
                                    </td>
                                    <td align="center">
                                        <div>{{ item.estimate || '' }}</div>
                                    </td>
                                </tr>
                                {{# }) }}
                            </tbody>
                        </table>
                        {{# }else{ }}
                            <div>{{ d.tail || '尾程定价暂无数据'}}</div>
                        {{# } }}
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 头程运费 --%>
<script type="text/html" id="setpriceCopy_headWayShipping">
    <div>
        <strong><font size="4">{{Number(d.headWayShipping).toFixed(2)}}</font></strong>
    </div>
</script>
<%-- 尾程运费 --%>
<script type="text/html" id="setpriceCopy_tailWayShipping">
    <div>
        <strong><font size="4">{{Number(d.tailWayShipping).toFixed(2)}}</font></strong>
    </div>
</script>
<%-- 预估毛利 --%>
<script type="text/html" id="setpriceCopy_estimateGrossPrice">
    <div>
        <strong><font size="4">{{Number(d.estimateGrossPrice).toFixed(2)}}</font></strong>
    </div>
</script>
<%-- 仓库费用总和 --%>
<script type="text/html" id="setpriceCopy_warehouseFee">
    <div class="alignLeft">
        <div class="setpriceCopy_warehouseFeeDetail">
            <span>{{d.currency}}:</span><strong><font size="4">{{Number(d.warehouseFee).toFixed(2)}}</font></strong>
        </div>
        <input type="hidden" name="warehouseFeeDetail" value='{{JSON.stringify(d)}}'>
    </div>
</script>

<%-- VAT(含关税)vatAndTariff --%>
<script type="text/html" id="setpriceCopy_vatAndTariff">
    <div class="alignLeft">
        <span>USD:</span><strong><font size="4">{{Number(d.vatAndTariff).toFixed(2)}}</font></strong>
    </div>
</script>
<%-- 预估定价estimatePrice --%>
<script type="text/html" id="setpriceCopy_estimatePrice">
    <div class="alignLeft">
        <span>{{d.currency}}:</span><strong><font size="4">{{Number(d.estimatePrice).toFixed(2)}}</font></strong>
    </div>
</script>

<%-- 设置定价 --%>
<script type="text/html" id="setpriceCopy_price">
    <div class="setpriceCopy_td">
        <span>{{d.currency}}</span><input type="number" class="layui-input" name="setpriceCopy" autocomplete="off">
    </div>
</script>

<%-- 设置定价 --%>
<script type="text/html" id="setpriceCopy_toolBar">
    <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="computed">计算毛利率</span>
</script>

<%-- 操作 --%>
<script type="text/html" id="setpriceCopy_toolBar">
    <span class="layui-btn layui-btn-sm layui-btn-normal" lay-event="computed">计算毛利率</span>
</script>



<script src="${ctx}/static/js/wyt/info/setpriceCopy.js"></script>