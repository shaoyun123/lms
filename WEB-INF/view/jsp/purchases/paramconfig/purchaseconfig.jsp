<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>参数设置</title>
<style>
    #purchaseConfig .layui-table-box,
    #purchaseConfig .layui-table-body,
    #purchaseConfig .layui-table-view {
        overflow: visible;
    }
</style>
<div class="layui-fluid" id="purchaseConfig">
    <div class="layui-row layui-col-space15">
        <%--销量权重--%>
        <div class="layui-card">
            <div class="fl" style="width: 30%;height: 200px">
                <div>销量权重</div>
                <form autocomplete="off">
                    <div class="layui-card-body">
                        <table class="layui-table" id="whSalesRatioTable" lay-filter="whSalesRatioTable"></table>
                        <div class="layui-btn layui-btn-danger" id="recountDailySales_purchaseconfig">重新计算权重销量</div>
                    </div>
                </form>
            </div>
            <div class="fl" style="width: 40%;height: 200px;margin-left:50px;">
                <div>高频次采购销量权重</div>
                <form autocomplete="off">
                    <div class="layui-card-body">
                        <table class="layui-table" id="whSalesRatioExtraTable" lay-filter="whSalesRatioExtraTable"></table>
                    </div>
                </form>
            </div>
            <div class="clearLeft"></div>
        </div>


        <%--销量级数设置--%>
        <div class="layui-card clearLeft">
            <div class="fl" style="width: 50%;">
                <div>销量级数设置</div>
                <form autocomplete="off">
                    <div class="layui-card-body" style="display:flex;">
                        <table class="layui-table" id="whSalesParamTable" lay-filter="whSalesParamTable"></table>
                        <table class="layui-table" id="whSalesParamTable_plat" lay-filter="whSalesParamTable_plat" style="margin-left:30px;"></table>
                    </div>
                </form>
            </div>
            <div class="clearLeft"></div>
        </div>
        <div class="layui-card clearLeft">

            <div class="fl"  style="width: 60%;">
                <div>商品标签影响参数（1.按照优先级，有一条满足，则使用该条参数设置 2.到期自动延续一年）</div>
                <form autocomplete="off">
                    <div class="layui-card-body">
                        <table class="layui-table" id="whProdAttrParamTable" lay-filter="whProdAttrParamTable"></table>
                    </div>
                </form>
            </div>
            <div class="clearLeft"></div>
        </div>

        <%--长销款设置--%>
        <div class="layui-card clearLeft">
            <div class="fl" style="width: 50%">
                <div>长销款参数设置：按照排序，有一条满足，则使用该条参数设置</div>
                <form autocomplete="off">
                    <div class="layui-card-body">
                        <table class="layui-table" id="whSalesParamStableTable" lay-filter="whSalesParamStableTable"></table>
                    </div>
                </form>
            </div>

            <div class="fl" style="width: 40%;margin-left:50px;">
                <div>长销款定义：满足任意一条即为长销款</div>
                <form autocomplete="off">
                    <div class="layui-card-body">
                        <table class="layui-table" id="whStableSalesDefinitionTable" lay-filter="whStableSalesDefinitionTable"></table>
                    </div>
                </form>
            </div>
            <div class="clearLeft"></div>
        </div>

        <%--动态设置--%>
        <div class="layui-card clearLeft" id="purchaseconfig_dynamicConfigContains">

        </div>
    </div>
</div>


<%--销量权重--%>
<script type="text/html" id="purPeriod_purchaseconfig">
    <div><input name="purPeriod" class="layui-input" value="{{d.purPeriod}}"/></div>
</script>
<%--销量权重--%>
<script type="text/html" id="purTimes_purchaseconfig">
    <div><input name="purTimes" class="layui-input" value="{{d.purTimes}}"/></div>
</script>

<%--销量权重--%>
<script type="text/html" id="saleRatioSeven_purchaseconfig">
    <div><input name="saleRatioSeven" class="layui-input" value="{{d.saleRatioSeven}}"/></div>
</script>
<script type="text/html" id="saleRatioFifteen_purchaseconfig">
    <div><input name="saleRatioFifteen" class="layui-input" value="{{d.saleRatioFifteen}}"/></div>
</script>
<script type="text/html" id="saleRatioThirty_purchaseconfig">
    <div><input name="saleRatioThirty" class="layui-input" value="{{d.saleRatioThirty}}"/></div>
</script>

<script type="text/html" id="whSalesRatioTool_purchaseconfig">
    <div class="layui-btn layui-btn-sm" lay-event="update">保存</div>
</script>

<%--销量阶级--%>
<script type="text/html" id="stepName_salesParam_purchaseconfig">
    <div><input name="stepName" class="layui-input" value="{{d.stepName != null ? d.stepName : ''}}"/></div>
</script>
<script type="text/html" id="minDailySales_salesParam_purchaseconfig">
    <div><input name="minDailySales" class="layui-input" value="{{d.minDailySales != null ? d.minDailySales : ''}}"/></div>
</script>
<script type="text/html" id="maxDailySales_salesParam_purchaseconfig">
    <div><input name="maxDailySales" class="layui-input" value="{{d.maxDailySales != null ? d.maxDailySales : ''}}"/></div>
</script>
<script type="text/html" id="purchaseDlvrDays_salesParam_purchaseconfig">
    <div><input name="purchaseDlvrDays" class="layui-input" value="{{d.purchaseDlvrDays != null ? d.purchaseDlvrDays : ''}}"/></div>
</script>
<script type="text/html" id="stockWarnCycle_salesParam_purchaseconfig">
    <div><input name="stockWarnCycle" class="layui-input" value="{{d.stockWarnCycle != null ? d.stockWarnCycle : ''}}"/></div>
</script>
<script type="text/html" id="maxDailySales_salesParam_purchaseconfig_plat">
    <div>
        <table class="layui-table">
            <tbody id="" style="width:400px;">
            {{# layui.each(d.platPurParamList || [], function(index, item){ }}
                <tr data-index="{{d.id}}_{{index}}">
                    <td style="width:200px;">
                    {{# if (item.platCode == '剩余平台') { }}
                        <input id="table_plat{{d.id}}_{{index}}" value="剩余平台" class="layui-input" readonly/>
<%--    <select name="plat"--%>
<%--    id="table_plat{{d.id}}_{{index}}"--%>
<%--    xm-select="table_plat{{d.id}}_{{index}}"--%>
<%--    xm-select-search xm-select-search-type="dl" xm-select-skin="normal"--%>
<%--    lay-filter="table_plat">--%>
<%--    </select>--%>
                    {{# } else { }}
                        <select name="plat"
                            id="table_plat{{d.id}}_{{index}}"
                            xm-select="table_plat{{d.id}}_{{index}}"
                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                            lay-filter="table_plat">
                        </select>
                    {{# } }}
                    </td>
                    <td><input name="purchaseDlvrDays" class="layui-input" value="{{ item.purchaseDlvrDays }}" /></td>
                    <td><input name="stockWarnCycle" class="layui-input" value="{{ item.stockWarnCycle }}" /></td>
                    <td>
                        {{# if (item.platCode != '剩余平台') { }}
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="childDel" style="margin:5px;">删除</a>
                        {{# } }}
                    </td>
                </tr>
            {{# }) }}
                <tr data-index="{{d.id?d.id:'new'}}_{{d.platPurParamList?.length||0}}" data-id="{{d.id||'new'}}">
                    <td style="width:200px;">
                        <select name="plat"
                            id="table_plat{{d.id||'new'}}_{{d.platPurParamList?.length||0}}"
                            xm-select="table_plat{{d.id||'new'}}_{{d.platPurParamList?.length||0}}"
                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                            lay-filter="table_plat">
                        </select>
                    </td>
                    <td><input name="purchaseDlvrDays" class="layui-input" /></td>
                    <td><input name="stockWarnCycle" class="layui-input" /></td>
                    <td><a class="layui-btn layui-btn-xs" lay-event="childAdd" style="margin:5px;">新增</a></td>
                </tr>
            </tbody>
        </table>
    </div>
</script>

<script type="text/html" id="whSalesParamTool_purchaseconfig">
    {{# if (d.id) { }}
    <div class="layui-btn layui-btn-sm" lay-event="update">保存</div>
    <div class="layui-btn layui-btn-sm layui-btn-danger" lay-event="delete">删除</div>
    {{# } else { }}
    <div class="layui-btn layui-btn-sm" lay-event="add">新增</div>
    {{# } }}
</script>

<script type="text/html" id="dynamicParamTool_purchaseconfig">
    <input type="hidden" dname="id" value="{{d.id || ''}}">
    {{# if (d.id) { }}
    <div class="layui-btn layui-btn-sm" onclick="purchaseconfig_dynamicBtn(1,this)">保存</div>
    <div class="layui-btn layui-btn-sm layui-btn-danger" onclick="purchaseconfig_dynamicBtn(2,this)">删除</div>
    {{# } else { }}
    <div class="layui-btn layui-btn-sm" onclick="purchaseconfig_dynamicBtn(3,this)">新增</div>
    {{# } }}
</script>

<%--商品标签影响参数--%>
<script type="text/html" id="prodAttr_prodAttrParam_purchaseconfig">
    <div class="prodAttrWrap">
        <select name="prodAttr"
          tag="{{ d.prodAttr }}"
          id="table_prodAttr{{d.index}}"
          xm-select="table_prodAttr{{d.index}}"
          xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
          lay-filter="table_prodAttr">
        </select>
    </div>
</script>
<script type="text/html" id="beginTime_prodAttrParam_purchaseconfig">
    <div><input name="beginTime" class="layui-input" value="{{d.beginTime != null ? format(d.beginTime,'yyyy-MM-dd') : ''}}" placeholder="yyyy-MM-dd"/></div>
</script>
<script type="text/html" id="endTime_prodAttrParam_purchaseconfig">
    <div><input name="endTime" class="layui-input" value="{{d.endTime != null ? format(d.endTime,'yyyy-MM-dd') : ''}}" placeholder="yyyy-MM-dd"/></div>
</script>
<script type="text/html" id="purchaseDlvrDays_prodAttrParam_purchaseconfig">
    <div><input name="purchaseDlvrDays" class="layui-input" value="{{d.purchaseDlvrDays != null ? d.purchaseDlvrDays : ''}}"/></div>
</script>
<script type="text/html" id="stockWarnCycle_prodAttrParam_purchaseconfig">
    <div><input name="stockWarnCycle" class="layui-input" value="{{d.stockWarnCycle != null ? d.stockWarnCycle : ''}}"/></div>
</script>

<script type="text/html" id="whProdAttrParamTool_purchaseconfig">
    {{# if (d.id) { }}
    <div class="layui-btn layui-btn-sm" lay-event="update">保存</div>
    <div class="layui-btn layui-btn-sm layui-btn-danger" lay-event="delete">删除</div>
    {{# } else { }}
    <div class="layui-btn layui-btn-sm" lay-event="add">新增</div>
    {{# } }}
</script>


<script type="text/javascript" src="${ctx}/static/js/purchases/purchaseconfig.js"></script>
