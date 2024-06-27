<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>分配渠道</title>

<div class="layui-fluid" id="LAY-matchchannel">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" id="matchchannelForm" lay-filter="component-form-grup" autocomplete="off" onsubmit="return false">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品sku</label>
                                <div class="layui-input-block">
                                    <input name="sku" class="layui-input" placeholder="只支持单个sku" maxlength="50">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" style="padding-left:32px;margin-top:2px">
                                <button id="matchchannel_searchBtn" class="layui-btn layui-btn-sm keyHandle">搜索</button>
                                <button type="reset" id="matchchannel_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <div>
                        <permTag:perm funcCode="matchchannel_queryMatchAbleProd">
                            <div class="layui-btn layui-btn-sm" id="matchchannel_queryMatchAbleProd">可分配商品查询</div>
                        </permTag:perm>
                        <div class="fr mt05">
                            <permTag:perm funcCode="matchchannel_print">
                                <div class="fl">
                                    <input class="layui-input" type="number" id="matchchannel_printDeliverDetail" style="width: 80px" placeholder="配货单id">
                                </div>
                                    <div class="layui-btn layui-btn-sm mr10 fl" id="matchchannel_printDeliverDetailBtn">补打配货标签</div>
                                <div class="fl">
                                    <input class="layui-input" type="number" id="matchchannel_printAmount" style="width: 80px" placeholder="打印数">
                                </div>
                                    <div class="layui-btn layui-btn-sm fl" id="matchchannel_printBtn">补打商品标签</div>
                            </permTag:perm>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table lay-filter="matchchannel_table" class="layui-table" id="matchchannel_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/wyt/warehouse/matchchannel.js?v=${ver}"></script>

<script id="matchchannel_tab_image" type="text/html">
    {{#  if(typeof(d.prodSInfo.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.prodSInfo.image }}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<script type="text/html" id="matchchannel_numberBox">
       <div>
           <span class="secondary">计划：</span> {{d.planAmount}}
       </div>
       <div>
           <span class="secondary">待配：</span> {{d.planAmount - d.actAmount}}
       </div>
       <div>
           <span class="secondary">可用：</span> {{d.whStock.currentStock - d.whStock.reservationStock}}
       </div>
</script>

<script type="text/html" id="matchchannel_UKLetterBox">
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

<script type="text/html" id="matchchannel_DELetterBox">
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

<script id="matchchannel_tab_isCombinationBox" type="text/html">
    <input type="checkbox" lay-skin="primary" disabled {{ d.prodSInfo.isCombination ? 'checked' : '' }}><br>
</script>

<script type="text/html" id="matchchannel_tab_toolBar">
    <permTag:perm funcCode="matchchannel_matchAndPrint">
        <div>
            <div class="layui-btn layui-btn-sm layui-btn-warm" lay-event="matchAndPrint" title="分配成功将自动打印商品标签">分配</div>
        </div>
    </permTag:perm>
</script>

<script type="text/html" id="matchchannel_matchAbleSearchPop">
    <div class="layui-col-lg12 layui-col-md12">
        <div class="layui-card">
            <div class="layui-card-header">
                <div class="disFCenter">
                    <div>数量(<span id="matchchannel_matchAbleSearchTotal">0</span>)</div>
                    <div class="layui-btn layui-btn-sm" id="matchchannel_matchAblePrintBtn">打印</div>
                </div>
            </div>
            <div class="layui-card-body">
                <table class="layui-table" id="matchAbleSearchTable" lay-filter="matchAbleSearchTable"></table>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="matchchannel_makeSingleCombPop">
    <div class="layui-card">
        <div class="layui-card-body">
            <table lay-filter="matchchannel_makeCombTable" class="layui-table" id="matchchannel_makeCombTable"></table>
        </div>
    </div>
</script>


<script type="text/html" id="matchchannel_makeComb_TableBar">
    <permTag:perm funcCode="makeComb_make">
        <div>
            <div class="layui-btn layui-btn-sm layui-btn-warm" lay-event="make">生产</div>
        </div>
    </permTag:perm>
</script>

<script type="text/html" id="matchchannel_makeComb_combDetail_sku">
    <table width="100%">
        {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.combDetailDtoList[i].sSku}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="matchchannel_makeComb_combDetail_unit">
    <table width="100%">
        {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.combDetailDtoList[i].unit}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="matchchannel_makeComb_combDetail_num">
    <table width="100%">
        {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.combDetailDtoList[i].prodDetailNums}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="matchchannel_makeComb_combDetail_locationCode">
    <table width="100%">
        {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
        <tr class="height30">
            <td>{{d.combDetailDtoList[i].combLocation ? d.combDetailDtoList[i].combLocation.locationCode : ''}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="matchchannel_makeComb_combDetail_availableAmount">
    <table width="100%">
        {{# for (let i = 0; i < d.combDetailDtoList.length; ++i) {}}
        <tr class="height30">
            <td>{{(d.combDetailDtoList[i].whStock.currentStock || 0) - (d.combDetailDtoList[i].whStock.reservationStock || 0)}}</td>
        </tr>
        {{# } }}
    </table>
</script>

<style>
    .height30{
        height:30px;
        line-height: 30px;
    }
</style>

<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/wyt/winitutil.js?v=${ver}"></script>
