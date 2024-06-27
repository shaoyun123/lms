<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>组合品加工</title>

<div class="layui-fluid" id="LAY-makecomb">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="makecombForm" lay-filter="makecombForm" onsubmit="return false">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-filter="skuTypeSelect_winitstockinorder" class="hiddenContent">
                                        <option value="detailSku2">单品sku(精确)</option>
                                        <option value="combSku2">组合品sku(精确)</option>
                                        <option value="detailSku">单品sku</option>
                                        <option value="combSku">组合品sku</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" maxlength="2000" name="searchValue" autocomplete="off">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" style="padding-left:32px;margin-top:2px">
                                <button id="makecomb_searchBtn" class="layui-btn layui-btn-sm keyHandle">搜索</button>
                                <button type="reset" id="makecomb_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                        <input type="hidden" name="processStatus" value="1">
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <div>
                        <div class="fl">
                            <div class="layui-tab" lay-filter="makecomb_Tab" id="makecomb_Tab">
                                <ul class="layui-tab-title">
                                    <li data-status="1" class="layui-this">待生产<span id="makecomb_waitMakeCountSpan"></span></li>
                                    <li data-status="2">已生产<span id="makecomb_HadMakeCountSpan"></span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table lay-filter="makecomb_table" class="layui-table" id="makecomb_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/wyt/warehouse/makecomb.js?v=${ver}"></script>

<script type="text/html" id="makecomb_TableBar">
    <permTag:perm funcCode="makecomb_make">
        <div>
            <div class="layui-btn layui-btn-sm layui-btn-warm" lay-event="make">生产</div>
        </div>
    </permTag:perm>
</script>

<script type="text/html" id="makeComb_combDetail_sku">
    <table width="100%">
        {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
            <tr class="height30">
                <td>{{d.combDetailDtoList[i].sSku}}</td>
            </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="makeComb_combDetail_unit">
    <table width="100%">
        {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.combDetailDtoList[i].unit}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="makeComb_combDetail_num">
    <table width="100%">
        {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.combDetailDtoList[i].prodDetailNums}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="makeComb_combDetail_locationCode">
    <table width="100%">
        {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.combDetailDtoList[i].combLocation ? d.combDetailDtoList[i].combLocation.locationCode : ''}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="makeComb_combDetail_availableAmount">
    <table width="100%">
        {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
        <tr class="height30">
            <td>{{(d.combDetailDtoList[i].whStock.currentStock || 0) - (d.combDetailDtoList[i].whStock.reservationStock || 0)}}</td>
        </tr>
        {{# } }}
    </table>
</script>

<script type="text/html" id="makeComb_hadMake_combDetail">
    {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
        {{d.combDetailDtoList[i].sSku + '*' +d.combDetailDtoList[i].prodDetailNums + ';'}}
    {{# } }}
</script>

<style>
    .height30{
        height:30px;
        line-height: 30px;
    }
</style>

<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>