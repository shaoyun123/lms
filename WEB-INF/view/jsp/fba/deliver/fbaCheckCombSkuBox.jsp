<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>组合品投篮</title>
<style>
    .text_l {
        text-align: left;
    }
</style>
<!-- 主页面 -->
<div class="layui-fluid" id="FbaCheckCombSkuBox">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="FbaCheckCombSkuBox_Form" lay-filter="FbaCheckCombSkuBox_Form" onsubmit="return false">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">货件编号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="shipmentId">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">篮子编号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="boxCode">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">篮子状态</label>
                                <div class="layui-input-block">
                                    <select type="text" class="layui-input" name="boxFullStatus">
                                        <option value="" selected>全部</option>
                                        <option value="0">未满</option>
                                        <option value="1">已满</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">投篮状态</label>
                                <div class="layui-input-block">
                                    <select type="text" class="layui-input" name="putInStatus">
                                        <option value="" selected>全部</option>
                                        <option value="0">未投</option>
                                        <option value="1">已投</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品sku</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="prodSSkuStr">
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="orderByType" lay-search>
                                        <option value="按创建时间正序">按创建时间正序</option>
                                        <option value="按创建时间倒序">按创建时间倒序</option>
                                        <option value="按盒子号正序">按盒子号正序</option>
                                    </select>
                                </div>
                            </div>
                            <!--<input class="disN" type="text" name="limit" value="10">-->
                            <!--<input class="disN" type="text" name="page" value="1">-->

                            <div class="layui-col-lg1 layui-col-md1">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal keyHandle" lay-submit=""
                                            id="FbaCheckCombSkuBox_Search" lay-filter="FbaCheckCombSkuBox_Search">查询
                                    </button>
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <span id="FbaCheckCombSkuBox_total_use_num"></span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header">
                        <div class="fl">
                            <span style="background-color:deepskyblue">    正常篮子已用/总    </span><span
                                id="FbaCheckCombSkuBox_showInfo_num"></span>
                        </div>
                        <div class="fr">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm"
                                    id="FbaCheckCombSkuBox_divideBox">
                                分配
                            </button>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm"
                                    id="FbaCheckCombSkuBox_printCombDetail">
                                打印组合品明细
                            </button>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm"
                                    id="FbaCheckCombSkuBox_putInBox">
                                投篮
                            </button>
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm"
                                    id="FbaCheckCombSkuBox_takeOutBox">
                                篮满取出
                            </button>
                        </div>

                    </div>
                </div>
                <div class="layui-card-body">
                    <div class="toFixedContain">数量(<span id="FbaCheckCombSkuBox_curNum"></span>)</div>
                    <table lay-filter="FbaCheckCombSkuBox_table" class="layui-table"
                           id="FbaCheckCombSkuBox_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- 表格渲染-弹窗 -->

<!--存篮-->
<script type="text/html" id="FbaCheckCombSkuBox_putInBox_Form_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FbaCheckCombSkuBox_putInBox_Form"
                  lay-filter="FbaCheckCombSkuBox_putInBox_Form">
                <div class="layui-form-item">

                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">仓库篮号</label>
                        <div class="layui-inline">
                            <input type="text" class="layui-input" name="boxCode">
                        </div>
                    </div>

                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">当前篮号</label>
                        <div class="layui-inline">
                            <span class="fRed" id="FbaCheckCombSkuBox_putInBox_Form_tpl_curBoxCode"></span>
                        </div>
                    </div>
                    <input type="hidden" name="curBoxCode">

                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">商品SKU</label>
                        <div class="layui-inline">
                            <input type="text" class="layui-input" name="prodSSku">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">当前sku</label>
                        <div class="layui-inline">
                            <span class="fRed" id="FbaCheckCombSkuBox_putInBox_Form_tpl_curProdSSku"></span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header">
            <span class="fl">篮子货品详情</span>
            <span class="fr" id="FbaCheckCombSkuBox_putInBox_ifFullSpan"></span>
        </div>
        <div class="layui-card-body">
            <div>
                <table lay-filter="FbaCheckCombSkuBox_recomPutInBox_table" class="layui-table" id="FbaCheckCombSkuBox_recomPutInBox_table"></table>
            </div>
        </div>
    </div>
</script>

<!--取篮-->
<script type="text/html" id="FbaCheckCombSkuBox_takeOutBox_Form_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FbaCheckCombSkuBox_takeOutBox_Form"
                  lay-filter="FbaCheckCombSkuBox_takeOutBox_Form" onsubmit="return false">
                <div class="layui-form-item">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">扫描篮号</label>
                        <div class="layui-inline">
                            <input type="text" class="layui-input" name="boxCode">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header">结果</div>
        <div class="layui-card-body">
            <span id="FbaCheckCombSkuBox_takeOutBox_result"
                  style="font-size: 16px;font-weight: bold;color: red;"></span>
        </div>
    </div>
</script>

<!-- 表格渲染-td内容格式 -->
<script type="text/html" id="FbaCheckCombSkuBox_time_tpl">
    <div class="text_l"><span>创建：</span><span>{{Format(d.createTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div class="text_l"><span>审核：</span><span>{{Format(d.auditTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div class="text_l"><span>修改：</span><span>{{Format(d.modifyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
</script>

<!-- 表格渲染-操作按钮 -->
<script type="text/html" id="FbaCheckCombSkuBox_Option">

</script>

<script type="text/html" id="FbaCheckCombSkuBox_subSkuInfo_tpl">
    {{# if(d.combSkuList){ }}
    <table class="layui-table" style="width:100%;text-align: center;color: #000;">
        {{# layui.each(d.combSkuList, function(index, item){ }}
        <tr>
            <td style="width:30%;">{{item.prodSSku}}</td>
            <td style="width:30%;">{{item.locationCode||''}}</td>
            <td style="width:20%;">{{item.amount}}</td>
            {{# if(item.putInStatus==1){ }}
            <td style="width:20%;color: greenyellow">已投</td>
            {{# }else{ }}
            <td style="width:20%;color: indianred">未投</td>
            {{# } }}
        </tr>
        {{# }) }}

    </table>
    {{# } }}
</script>

<script type="text/html" id="FbaCheckCombSkuBox_ifHasPutTemp">
    {{# if(d.putInStatus==1){ }}
    <div style="color: greenyellow">已投</div>
    {{# }else{ }}
    <div style="color: indianred">未投</div>
    {{# } }}
</script>

<script type="text/html" id="FbaCheckCombSkuBox_subSkuInfo_title_tpl">
    <div style='text-aligh:center;border-bottom:1px solid #e6e6e6'>商品信息</div>
    <div style='display:flex;justify-content:space-between'>
        <div style='width:30%;text-aligh:center;border-right:1px solid #e6e6e6'>商品SKU</div>
        <div style='width:30%;text-aligh:center;border-right:1px solid #e6e6e6'>库位</div>
        <div style='width:20%;text-aligh:center;border-right:1px solid #e6e6e6'>数量</div>
        <div style='width:20%;text-aligh:center;border-right:1px solid #e6e6e6'>是否已投篮</div>
    </div>
</script>

<script type="text/html" id="FbaCheckCombSkuBox_shipmentId_tpl">
    {{# if(d.shipmentId){ }}
    {{ d.shipmentId }}({{ d.storeAcct }}--{{ d.salesSite }})
    {{# } }}
</script>

<script type="text/html" id="FbaCheckCombSkuBox_combStyle_tpl">
   <%--  todo fnSku对应的明细 --%>
</script>

<script type="text/html" id="FbaCheckCombSkuBox_boxFullStatus_tpl">
    {{# if(d.boxFullStatus == 1){ }}
    <div style="color: greenyellow">已满</div>
    {{# }else { }}
    <div style="color: indianred">未满</div>
    {{# } }}
    {{# if (d.fullBoxTime) {}}
    <div>{{Format(d.fullBoxTime,'yyyy-MM-dd hh:mm:ss')}}</div>
    {{#}}}
</script>

<script type="text/html" id="FbaCheckCombSkuBox_havePrintStatus_tpl">
    {{# if(d.havePrintStatus){ }}
    <span>已打印</span>
    {{# }else { }}
    <span>未打印</span>
    {{# } }}
</script>

<script src="${ctx}/static/js/warehouse/fbaCheckCombSkuBox.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>