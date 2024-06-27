<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>SKU标签打印</title>
<style>
    .productlist_header_button {
        position:absolute;
        right: 20px;
    }
</style>
<div class="layui-fluid" id="LAY-work-develop-pl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="component-form-grup" id="opl_skuTagPrint_searchForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" id="sku_tagwarehouseList" lay-search=""></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="skuSearchType" style="width: 30px">
                                        <option value="1">子SKU(精确)</option>
                                        <option value="0">子SKU(模糊)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input name="sSku" type="text" class="layui-input" placeholder="多个逗号分隔" maxlength="2000">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale" id="layerisSale"  lay-search="">
                                        <option value="">全部</option>
                                        <option value="1" selected>在售</option>
                                        <option value="0">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-input-block">
                                    <input type="checkbox" name="autoPrintSkuTags" title="自动打印sku标签" lay-skin="primary">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" style="padding-left:32px;margin-top:2px">
                                <button id="pl_skuTagPrint_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload">查询</button>
                                <button type="reset" id="pl_skuTagPrint_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="productlistCard">
                <div class="layui-card-header">
                            <button type="button" class="layui-btn layui-btn-sm ml10" id="downTemplate_skuTagPrint">模板下载</button>
                            <button type="button" class="layui-btn layui-btn-warm layui-btn-sm ml10" onclick="document.getElementById('skuTagPrintExcel_productlist_file').click()">导入模板</button>
                            <input type="file" name="sInfoExcel" id="skuTagPrintExcel_productlist_file" hidden>
                    <span class="productlist_header_button">
                            <button type="button" class="layui-btn layui-btn-sm" id="sProductlist_printData">SKU标签打印</button>
                    </span>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="sProdSkuTable" lay-filter="sProdSkuTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="${ctx}/static/js/warehouse/skuTagPrint.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js"></script>
<script type="text/html" id="skuTag_isSale_Tpl">
    {{# if(d.isSale ){ }}
    <div style="color: forestgreen;">在售</div>
    {{# }else {}}
    <div style="color: red;">停售</div>
    {{# }}}
</script>

<script type="text/html" id="skuTag_editPrintNumberBatchInput_Tpl">
    <input name="printNumber" id="{{d.id+d.sSku}}" value="{{d.printNumber}}"  min="0" type="number" class="layui-input">
</script>

<script type="text/html" id="skuTag_specialPack_Tpl">
    <div style="text-align: left">
        <span style="color: grey">是否特殊包装:</span>{{d.specialPack ? '是' :'否'}}
    </div>
    <div style="text-align: left">
        <span style="color: grey">备注:</span>{{ d.specialPackDesc || ''}}
    </div>
</script>
<script type="text/html" id="skuTag_alonePack_Tpl">
    <div style="text-align: left">
        <span style="color: grey">是否独立包装:</span>{{d.alonePack ? '是' : '否'}}
    </div>
    <div style="text-align: left">
        <span style="color: grey">备注:</span>{{ d.noAlonePackDesc || ''}}
    </div>
</script>
<script type="text/html" id="skuTag_ifNeedQualityCheck_Tpl">
    <div style="text-align: left">
        <span style="color: grey">是否质检:</span>{{d.ifNeedQualityCheck ? "是" : "否"}}
    </div>
</script>