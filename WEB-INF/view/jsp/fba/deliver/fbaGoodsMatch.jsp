<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>配货包装</title>
<style>
    .text_l {
        text-align: left;
    }
    .height60{height: 70px}
</style>
<!-- 主页面 -->
<div class="layui-fluid" id="FbaGoodsMatch">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="FbaGoodsMatch_Form" lay-filter="FbaGoodsMatch_Form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品sku</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="prodSSku">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">货件编号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="shipmentId">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="needAutoPrint" checked value="true" title="自动打印标签" lay-skin="primary">
                                </div>
                            </div>
                            <!--<input class="disN" type="text" name="limit" value="10">-->
                            <!--<input class="disN" type="text" name="page" value="1">-->
                            <input class="disN" type="text" name="printNumStyleInput" value="1">
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-inline">
                                <input type="radio" name="printNumStyle" value="0" title="自定义打印数量" lay-filter="FbaGoodsMatch_printNumStyle">
                                <input type="text" class="layui-input" name="customPrintNum">
                                <input type="radio" name="printNumStyle" value="1" title="打印发货数量" checked lay-filter="FbaGoodsMatch_printNumStyle">
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1 disN">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                            id="FbaGoodsMatch_Search" lay-filter="FbaGoodsMatch_Search">查询
                                    </button>
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <span id="FbaGoodsMatch_total_use_num"></span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <div class="fl">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="FbaGoodsMatch_exportDullStock">导出呆滞库存</button>
                    </div>
                    <div class="fr">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="FbaGoodsMatch_canPut_search">已包装未上架货品</button>
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="FbaGoodsMatch_canMatchMulti_search">查询可配多品</button>
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="FbaGoodsMatch_canMatch_search">查询可配单品</button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table lay-filter="FbaGoodsMatch_table" class="layui-table"
                           id="FbaGoodsMatch_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- 表格渲染-弹窗 -->

<!--存箱-->
<script type="text/html" id="FbaGoodsMatch_putInBox_Form_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FbaGoodsMatch_putInBox_Form"
                  lay-filter="FbaGoodsMatch_putInBox_Form">
                <div class="layui-form-item">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">商品SKU</label>
                        <div class="layui-inline">
                            <input type="text" class="layui-input" name="prodSSku">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3"></div>
                    <label class="layui-form-label">仓库箱号</label>
                    <div class="layui-inline">
                        <input type="text" class="layui-input" name="boxCode">
                    </div>
                </div>
                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal disN" lay-submit=""
                        id="FbaGoodsMatch_putInBox_Form_submit"
                        lay-filter="FbaGoodsMatch_putInBox_Form_submit">提交事件
                </button>
            </form>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header">结果</div>
        <div class="layui-card-body">
            <span id="FbaGoodsMatch_putInBox_result" style="font-size: 16px;font-weight: bold;color: red;"></span>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header">推荐存入箱子</div>
        <div class="layui-card-body">
            <div>
                <table lay-filter="FbaGoodsMatch_recomPutInBox_table" class="layui-table"
                       id="FbaGoodsMatch_recomPutInBox_table"></table>
            </div>
        </div>
    </div>
</script>

<!--取箱-->
<script type="text/html" id="FbaGoodsMatch_takeOutBox_Form_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FbaGoodsMatch_takeOutBox_Form"
                  lay-filter="FbaGoodsMatch_takeOutBox_Form">
                <div class="layui-form-item">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">扫描箱号</label>
                        <div class="layui-inline">
                            <input type="text" class="layui-input" name="boxCode">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <div class="layui-input-block">
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal disN" lay-submit=""
                                    id="FbaGoodsMatch_takeOutBox_Form_submit"
                                    lay-filter="FbaGoodsMatch_takeOutBox_Form_submit">
                                提交事件
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header">结果</div>
        <div class="layui-card-body">
            <span id="FbaGoodsMatch_takeOutBox_result"
                  style="font-size: 16px;font-weight: bold;color: red;"></span>
        </div>
    </div>
</script>

<!-- 表格渲染-td内容格式 -->
<script type="text/html" id="FbaGoodsMatch_time_tpl">
    <div class="text_l"><span>创建：</span><span>{{Format(d.createTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div class="text_l"><span>审核：</span><span>{{Format(d.auditTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div class="text_l"><span>修改：</span><span>{{Format(d.modifyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
</script>

<!-- 表格渲染-操作按钮 -->
<script type="text/html" id="FbaGoodsMatch_Option">
   
</script>

<script type="text/html" id="FbaGoodsMatch_subSkuInfo_tpl">
    {{# if(d.relSkuList){ }}
    <table class="layui-table" style="width:100%;text-align: center;color: #000;">
        {{# layui.each(d.combSkuList, function(index, item){ }}
        <tr>
            <td style="width:35%;">{{item.prodSSku}}</td>
            <td style="width:35%;">{{item.locationCode}}</td>
            <td style="width:20%;">{{item.amount}}</td>
            {{# if(item.putInStatus==1){ }}
            <td style="width:10%;color: greenyellow">已投</td>
            {{# }else{ }}
            <td style="width:10%;color: indianred">未投</td>
            {{# } }}
        </tr>
        {{# }) }}

    </table>
    {{# } }}
</script>
<script type="text/html" id="FbaGoodsMatch_subSkuInfo_title_tpl">
    <div style='text-aligh:center;border-bottom:1px solid #e6e6e6'>商品信息</div>
    <div style='display:flex;justify-content:space-between'>
        <div style='width:35%;text-aligh:center;border-right:1px solid #e6e6e6'>商品SKU</div>
        <div style='width:35%;text-aligh:center;border-right:1px solid #e6e6e6'>库位</div>
        <div style='width:20%;text-aligh:center;border-right:1px solid #e6e6e6'>数量</div>
        <div style='width:10%;text-aligh:center;border-right:1px solid #e6e6e6'>是否已投篮</div>
    </div>
</script>

<script type="text/html" id="FbaGoodsMatch_shipmentId_tpl">
    {{# if(d.shipmentId){ }}
    {{ d.shipmentId }}({{ d.storeAcct }}--{{ d.salesSite }})
    {{# } }}
</script>

<script type="text/html" id="FbaGoodsMatch_combStyle_tpl">
    <%--  todo fnSku对应的明细 --%>
</script>

<script type="text/html" id="FbaGoodsMatch_boxFullStatus_tpl">
    {{# if(d.boxFullStatus == 1){ }}
    <span>已满</span>
    {{# }else { }}
    <span>未满</span>
    {{# } }}
</script>

<script type="text/html" id="FbaGoodsMatch_havePrintStatus_tpl">
    {{# if(d.havePrintStatus){ }}
    <span>已打印</span>
    {{# }else { }}
    <span>未打印</span>
    {{# } }}
</script>


<script type="text/html" id="FbaGoodsMatch_combBool_tpl">
    {{# if(d.combBool){ }}
    <span style="color: red;font-weight: 700;font-size: 30px;">是</span>
    {{# }else{ }}
    <span>否</span>
    {{# } }}
</script>

<script type="text/html" id="FbaGoodsMatch_packType_tpl">
    <span>{{d.packType || ''}}</span>
    <div>
        <button class="layui-btn layui-btn-xs" lay-event="FbaGoodsMatch_op_printFnSku">打印货品标签</button>
    </div>
    {{# if (d.combBool) {}}
    <div>
        <button class="layui-btn layui-btn-xs" lay-event="FbaGoodsMatch_op_printCombDetail">打印组合明细</button>
    </div>
    {{# } }}
</script>


<script type="text/html" id="FbaGoodsMatch_ifSmallSize_tpl">
    {{# if(d.ifSmallSize){ }}
    <span style="color: blue;font-weight: 700">是</span>
    {{# }else{ }}
    <span>否</span>
    {{# } }}
</script>

<script type="text/html" id="FbaGoodsMatch_nextStep_tpl">
    {{# if(d.combBool){ }}
    <span>组合品投篮</span>
    {{# }else{ }}
    <span>单品打单存箱</span>
    {{# } }}
</script>

<script type="text/html" id="FbaGoodsMatch_image_tpl">
    <div>
        <img width="60" height="60" src="{{d.picUrl}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<script type="text/html" id="FbaGoodsMatch_psiImage_tpl">
    <div>
        <img width="60" height="60" src="${tplIVP}{{d.prodImage}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<script type="text/html" id="FbaGoodsMatch_nextStep_opt_tpl">
    <div>
        <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="FbaGoodsMatch_op_matchOrUpdate">包装/修改数量</button>
    </div>
</script>

<script type="text/html" id="FbaGoodsMatch_canMatch_search_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <button class="layui-btn layui-btn-xs fl" id="FbaGoodsMatch_canMatch_print">打印</button>
            <div class="fr">
                <button class="layui-btn layui-btn-xs fl" id="FbaGoodsMatch_markMatch">标记已配货</button>
            </div>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header" style="z-index: 10000;height: auto;width:500px">
            <div style="float:left;">
                <ul class="layui-tab-title">
                    <li class="layui-this" >数量(<span id="FbaGoodsMatch_canMatchNum"></span>)</li>
                </ul>
            </div>
        </div>
        <div class="layui-card-body">
            <table class="layui-table" lay-filter="FbaGoodsMatch_canMatch_search_table" id="FbaGoodsMatch_canMatch_search_table"></table>
        </div>
    </div>
</script>
<script type="text/html" id="fbaGoodsMatch_matchStatus">
    {{# if (d.matchStatus === -1) {}}
    <div class="fRed">待配货</div>
    {{# } }}
    {{# if (d.matchStatus === 0) {}}
    <div class="secondary">待包装</div>
    {{# } }}
</script>


<script type="text/html" id="FbaGoodsMatch_canMatchMulti_search_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <button class="layui-btn layui-btn-xs fl" id="FbaGoodsMatch_canMatchMulti_print">打印</button>
            <div class="fr">
                <button class="layui-btn layui-btn-xs fl" id="FbaGoodsMatch_markMatchMulti">标记已配货</button>
            </div>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header" style="z-index: 10000;height: auto;width:500px">
            <div style="float:left;">
                <ul class="layui-tab-title">
                    <li class="layui-this" >数量(<span id="FbaGoodsMatch_canMatchMultiNum"></span>)</li>
                </ul>
            </div>
        </div>
        <div class="layui-card-body">
            <table class="layui-table" lay-filter="FbaGoodsMatch_canMatchMulti_search_table" id="FbaGoodsMatch_canMatchMulti_search_table"></table>
        </div>
    </div>
</script>

<script type="text/html" id="FbaGoodsMatch_canPut_search_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <button class="layui-btn layui-btn-xs fl" id="FbaGoodsMatch_canPut_print">打印</button>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header" style="z-index: 10000;height: auto;">
            <div style="float:left;">
                <ul class="layui-tab-title fl">
                    <li class="layui-this" >数量(<span id="FbaGoodsMatch_canPutNum"></span>)</li>
                </ul>
            </div>
        </div>

        <div class="layui-card-body">
            <table class="layui-table" lay-filter="FbaGoodsMatch_canPut_search_table" id="FbaGoodsMatch_canPut_search_table"></table>
        </div>
    </div>
</script>


<script type="text/html" id="fbaGoodsMatch_combDetail_image">
    <table width="100%">
        {{# for (let i = 0; i < d.prodSInfoDto.combSubProds.length; ++i) {}}
        <tr class="height60">
            <td>
                <img width="60" height="60" src="${tplIVP}{{d.prodSInfoDto.combSubProds[i].image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
            </td>
        </tr>
        {{# } }}
    </table>
</script>

<script type="text/html" id="fbaGoodsMatch_combDetail_sku">
    <table width="100%">
        {{# for (let i = 0; i < d.prodSInfoDto.combSubProds.length; ++i) {}}
        <tr class="height60">
            <td>{{d.prodSInfoDto.combSubProds[i].sSku}}</td>
        </tr>
        {{# } }}
    </table>
</script>

<script type="text/html" id="fbaGoodsMatch_combDetail_lastInTime">
    <table width="100%">
        {{# for (let i = 0; i < d.prodSInfoDto.combSubProds.length; ++i) {}}
        <tr class="height60">
            <td>{{d.prodSInfoDto.combSubProds[i].lastPurTime ? Format(d.prodSInfoDto.combSubProds[i].lastPurTime, "yyyy-MM-dd hh:mm:ss") : ''}}</td>
        </tr>
        {{# } }}
    </table>
</script>

<script type="text/html" id="fbaGoodsMatch_combDetail_lastInAmount">
    <table width="100%">
        {{# for (let i = 0; i < d.prodSInfoDto.combSubProds.length; ++i) {}}
        <tr class="height60">
            <td>{{d.prodSInfoDto.combSubProds[i].lastPurAmount || ''}}</td>
        </tr>
        {{# } }}
    </table>
</script>

<script type="text/html" id="fbaGoodsMatch_combDetail_num">
    <table width="100%">
        {{# for (let i = 0; i < d.prodSInfoDto.combSubProds.length; ++i) {}}
        <tr class="height60">
            <td>{{d.prodSInfoDto.combSubProds[i].prodDetailNums}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="fbaGoodsMatch_combDetail_totalNum">
    <table width="100%">
        {{# for (let i = 0; i < d.prodSInfoDto.combSubProds.length; ++i) {}}
        <tr class="height60">
            <td>{{d.prodSInfoDto.combSubProds[i].prodDetailNums * d.actQuality}}</td>
        </tr>
        {{# } }}
    </table>
</script>
<script type="text/html" id="fbaGoodsMatch_combDetail_locationCode">
    <table width="100%">
        {{# for (let i = 0; i < d.prodSInfoDto.combSubProds.length; ++i) {}}
        <tr class="height60">
            <td>{{d.prodSInfoDto.combSubProds[i].combLocation ? d.prodSInfoDto.combSubProds[i].combLocation.locationCode : ''}}</td>
        </tr>
        {{# } }}
    </table>
</script>

<script src="${ctx}/static/js/warehouse/fbaGoodsMatch.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>