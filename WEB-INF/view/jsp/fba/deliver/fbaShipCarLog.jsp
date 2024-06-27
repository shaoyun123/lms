<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>FBA装车记录</title>
<style>
    .text_l {
        text-align: left;
    }
</style>
<!-- 主页面 -->
<div class="layui-fluid" id="fbaShipCarLog">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="fbaShipCarLog_Form" lay-filter="fbaShipCarLog_Form" autocomplete="off">
                        <!--<input class="disN" type="text" name="limit" value="10">-->
                        <!--<input class="disN" type="text" name="page" value="1">-->
                        <div class="layui-form-item">
                            <div class="layui-col-lg2">
                                <label class="layui-form-label">装车时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="timeStr" id="fbaShipCarLog_Form_timeStr">
                                </div>
                            </div>
                            <div class="layui-col-lg2">
                                <label class="layui-form-label">车牌号</label>
                                <div class="layui-input-block">
                                    <select name="carNumber" id="fbaShipCarLog_Form_carNumber">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2">
                                <label class="layui-form-label">货件计划</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="shipmentIdListStr" placeholder="多个以逗号隔开">
                                </div>
                            </div>
                            <div class="layui-col-lg2">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal keyHandle" id="fbaShipCarLog_Search">查询</button>
                                    <button type="reset" id="fbaShipCarLog_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <%--<div style="height:42px;line-height:42px;">--%>
                    <%--<div class="layui-card-header">--%>
                        <%--<button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr" id="fbaShipCarLog_export">--%>
                            <%--导出--%>
                        <%--</button>--%>
                    <%--</div>--%>
                <%--</div>--%>
                <div class="layui-card-body">
                    <table lay-filter="fbaShipCarLog_table" class="layui-table" id="fbaShipCarLog_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

  

<!-- 表格渲染-操作按钮 -->
<script type="text/html" id="fbaShipCarLog_toolBar">
    <button class="layui-btn layui-btn-sm" lay-event="print">打印</button><br/>
</script>

<script type="text/html" id="fbaShipCarLog_shipmentIdTpl">
    <table width="100%">
        {{# for (let i = 0; i < d.detailList.length; ++i) {}}
        <tr class="height30"><td>{{d.detailList[i].shipmentId}}</td></tr>
        {{# }}}
    </table>
</script>

<script type="text/html" id="fbaShipCarLog_boxNumTpl">
    <table width="100%">
        {{# for (let i = 0; i < d.detailList.length; ++i) {}}
        <tr class="height30"><td>{{d.detailList[i].boxNum}}</td></tr>
        {{# }}}
    </table>
</script>

<script type="text/html" id="fbaShipCarLog_relTransferNoTpl">
    <table width="100%">
        {{# for (let i = 0; i < d.detailList.length; ++i) {}}
        <tr class="height30"><td>{{d.detailList[i].relTransferNo}}</td></tr>
        {{# }}}
    </table>
</script>

<script type="text/html" id="fbaShipCarLog_cnNameTpl">
    <table width="100%">
        {{# for (let i = 0; i < d.detailList.length; ++i) {}}
        <tr class="height30"><td>{{d.detailList[i].cnName}}</td></tr>
        {{# }}}
    </table>
</script>

<script type="text/html" id="fbaShipCarLog_meterialTpl">
    <table width="100%">
        {{# for (let i = 0; i < d.detailList.length; ++i) {}}
        <tr class="height30"><td>{{d.detailList[i].material}}</td></tr>
        {{# }}}
    </table>
</script>


<script src="${ctx}/static/js/fba/fbaShipCarLog.js"></script>