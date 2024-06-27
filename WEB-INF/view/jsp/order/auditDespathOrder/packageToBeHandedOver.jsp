<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>待交接包裹</title>
<style>
#packageToBeHandedOver_content>.layui-card-header {
    display: flex;
    justify-content: space-between;
}
#packageToBeHandedOver_content .layui-tab .layui-tab-title {
   border-bottom-width: 0 !important;
   border-bottom-style: none;
}
.increaseSize {
    font-size: 30px;
    color: brown;
    margin-right: 5px;
}
.batchNo_packageTobeHandedOverSpan {
    color: #428bca;
    cursor: pointer;
}
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="packakgeToBeHanderOver_FormId">
                        <div class="layui-form-item">
                            
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">包裹创建时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="packageToBeHandedOver_createTime" id="packageToBeHandedOver_createTime" readonly>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" id="logisticsCompany">
                                <label class="layui-form-label">物流公司</label>
                                <div class="layui-input-block">
                                    <select name="logisCompanyIds"
                                        id="packageLogisticsCompanyId"
                                        xm-select="packageLogisticsCompany"
                                        lay-filter="packageLogisticsCompany"
                                        lay-search
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3" id = warehouseInvoiceNo>
                                <label class="layui-form-label">交接包裹单号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" placeholder="单个模糊查询" autocomplete="off" name="batchNo">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">跟踪号/订单编号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" placeholder="单个精确查询" autocomplete="off" name="logisNoOrOrderId">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">口袋编号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" placeholder="" autocomplete="off" name="bagNo">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">预报号状态</label>
                                <div class="layui-input-block">
                                    <select name="batchNoStatus" id="batchNoStatusList" lay-filter="batchNoStatusList" lay-search>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">仓库</label>
                                <div class="layui-input-block">
                                    <select name="warehouseId" id="prodWarehouseList" lay-filter="prodWarehouseList" lay-search>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="layui-col-lg3 layui-col-md3" style="padding-left:5px">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="packageToBeHandedOver_submit" style="margin-right: 10px;">查询</span>
                                <input type="checkbox" name="packageToBeHandedOver_printCk" title="打印交接单" lay-skin="primary">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="packageToBeHandedOver_content">
                <div class="fixHigh">
                    <div class="layui-card-header">
                        <div class="fixTab">
                            <!-- 页签点击结构 -->
                            <div class="layui-tab" lay-filter="packageToBeHandedOver-tabs" id="packageToBeHandedOver-tabs">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">已扫描(<span></span>)</li>
                                    <li>已发货(<span></span>)</li>
                                </ul>
                            </div>
                            <div>
                                <span class="layui-btn layui-btn-normal layui-btn-sm" id="aefmCrossStoreHandoverBatch">
                                    AE全托管跨店铺组包
                                </span>
                              <span class="layui-btn layui-btn-normal layui-btn-sm" id="packageToBeHanded_printPackageNumberBatch">
                                打印包裹号
                              </span>
                            <permTag:perm funcCode="packageToBeHanded_handoverAgain_PermTag">
                              <span class="layui-btn layui-btn-normal layui-btn-sm" id="packageToBeHanded_handoverAgain">
                                组包
                              </span>
                            </permTag:perm>
                            <span class="layui-btn layui-btn-normal layui-btn-sm" id="packageToBeHanded_updateStatus">更新虾皮预报号状态</span>
                            <a type="button" class="layui-btn layui-btn-normal layui-btn-sm disN" id="packageToBeHandedOver_newAdd">打印发货单</a>
                            <a type="button" class="layui-btn layui-btn-normal layui-btn-sm disN" id="packageToBeHandedOver_newAdd">打印发货单</a>
<%--                            <a type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="packageToBeHanded_newAdd">包裹称重</a>--%>
                            <a type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="packageToBeHanded_main_newAdd">包裹交接</a>
                            <!-- <a type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="packageToBeHanded_export">导出</a> -->
                            <div id="packageToBeHanded_export_div" class="layui-inline" style="margin-left: 5px;">
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm">导出</button>
                                <ul class="hidden">
                                    <li id="packageToBeHanded_export">组包</li>
                                    <li id="packageToBeHanded_export_order">组包订单</li>
                                </ul>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
               <div class="layui-card-body">
                 <table class="layui-table" id="packageToBeHandedOver_table"  lay-filter="packageToBeHandedOver_tableFilter"></table>
               </div>
            </div>
        </div>
    </div>
</div>

<%-- 表格操作栏 --%>
<script type="text/html" id="packageToBeHandedOver_tableIdBar">
  <a class="layui-btn layui-btn-xs" lay-event="detail">详情</a>
  <a class="layui-btn layui-btn-xs" lay-event="preview" href="${ctx}/static/html/deliverprint.html?id={{d.id}}" target="_blank">预览</a><br>
  {{# if(d.status){ }}
  <a class="layui-btn layui-btn-xs" lay-event="abandon">作废</a>
  {{# }else{ }}
  <a class="layui-btn layui-btn-xs" lay-event="normal">转正常单</a>
  {{# } }}
  <a class="layui-btn layui-btn-xs" lay-event="export">导出</a>
</script>
<%-- 新增开发单弹框 --%>
<script type="text/html" id="packageToBeHandedOver_newAddLayer">
    <form class="layui-form layui-row" style="margin:15px 50px 10px 0;">
        <div class="layui-col-md12">
            <div class="layui-form-item">
                <div class="layui-col-md4">
                    <label class="layui-form-label">货代公司</label>
                    <div class="layui-input-block">
                        <select lay-search name="add_agentCompany" lay-search id="add_agentCompany">    
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">包裹号</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="add_packageNo">
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">重量(kg)</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="add_weight">
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">快递公司</label>
                    <div class="layui-input-block">
                        <select lay-search name="add_expressCompany" lay-search id="add_expressCompany">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">快递单号</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="add_expressNo" id = "add_expressNo">
                    </div>
                </div>
            </div>
        </div>
    </form>
    <div style="margin: 0 50px 0 43px;">
        <table class="layui-table">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>包裹号</th>
                    <th>重量(kg)</th>
                    <th>操作</th>
                </tr> 
            </thead>
            <tbody id="add_packageToBeHandedOver_tbody" style="text-align: center">
            </tbody>
        </table>
    </div>
</script>


<%--&lt;%&ndash; 新增包裹单弹框 &ndash;%&gt;--%>
<%--<script type="text/html" id="packageToBeHanded_newAddLayer">--%>
<%--    <form class="layui-form layui-row" style="margin:15px 50px 10px 0;">--%>
<%--        <div class="layui-col-md12">--%>
<%--            <div class="layui-form-item">--%>
<%--                <div class="layui-col-md4">--%>
<%--                    <label class="layui-form-label">交接包裹单号</label>--%>
<%--                    <div class="layui-input-block">--%>
<%--                        <input type="text" class="layui-input" autofocus autocomplete="off" name="packageToBeHanded_add_packageNo">--%>
<%--                    </div>--%>
<%--                </div>--%>
<%--                <div class="layui-col-md4">--%>
<%--                    <label class="layui-form-label">重量(kg)</label>--%>
<%--                    <div class="layui-input-block">--%>
<%--                        <input type="text" class="layui-input" autocomplete="off" placeholder="保留2位小数" name="packageToBeHanded_add_weight">--%>
<%--                    </div>--%>
<%--                </div>--%>
<%--                <div class="layui-col-md4">--%>
<%--                    <!-- <label class="layui-form-label">一单多包</label> -->--%>
<%--                    <div class="layui-input-block">--%>
<%--                        <input type="checkbox" name="singleMultiplePackages" title="一单多包" lay-skin="primary">--%>
<%--                    </div>--%>
<%--                </div>--%>
<%--            </div>--%>
<%--        </div>--%>
<%--    </form>--%>
<%--    <div class="layui-col-md3" style="float: right;">--%>
<%--        <div class="layui-col-md6">--%>
<%--            称重求和：<span class="increaseSize" id="weighingSumming"></span>Kg--%>
<%--        </div>--%>
<%--        <div class="layui-col-md6">--%>
<%--            订单求和：<span class="increaseSize" id="orderSummation"></span>Kg--%>
<%--        </div>--%>
<%--    </div>--%>
<%--    <table class="layui-table" id="packageToBeHanded_newAddLayer_table"  lay-filter="packageToBeHanded_newAddLayer_table"></table>--%>
<%--</script>--%>
<%-- 新增包裹单弹框 - 删除--%>
<%--<script type="text/html" id="packageToBeHanded_newAddLayer_remove">--%>
<%--    <span class="layui-btn layui-btn-xs layui-btn-primary layui-border-red" style="color: red;" lay-event="removeData">删除</span>--%>
<%--</script>--%>

<%-- 未生成的表格操作栏 --%>
<script type="text/html" id="printPackageNumber_tableIdBar">
    <a class="layui-btn layui-btn-xs" lay-event="printPackageNumber">打印包裹号</a>
</script>


<script type="text/html" id="deliver_type_templet">
    <div>
        {{# if(d.deliveryType == 1){ }}
        物流自取
        {{# }if(d.deliveryType == 2){ }}
        快递发货
        {{# } }}
    </div>
</script>

<script type="text/html" id="batchNo_packageTobeHandedOver">
    <div style="position:relative;">
        <span class="batchNo_packageTobeHandedOverSpan" onclick="batchNo_packageTobeHandedOver_click(this)">
            <span class="batchNo">{{d.batchNo}}</span>
            {{# if(d.batchNoStatus){ }}
            <span class="layui-badge layui-bg-orange">{{d.batchNoStatus}}</span>
            {{# } }}
        </span>
    </div>
</script>

<script type="text/html" id="time_createTime_packageTobeHandedOver">
    <div>{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</div>
</script>
<script type="text/html" id="time_shippingTime_packageTobeHandedOver">
    <div>{{Format(d.shippingTime,'yyyy-MM-dd hh:mm:ss')}}</div>
</script>
<script type="text/html" id="time_scanTime_packageTobeHandedOver">
    <div>{{Format(d.scanTime,'yyyy-MM-dd hh:mm:ss')}}</div>
</script>

<%-- 弹框--包裹详情 --%>
<script type="text/html" id="packageToBeHandedOver_PackageDetails">
    <table class="layui-table" id="packageToBeHandedOver_PackageDetails_table" lay-filter="packageToBeHandedOver_PackageDetails_table"></table>
</script>
<%-- 弹框--交接发货 --%>
<script type="text/html" id="packageToBeHandedOver_generatorLayer">
    <table class="layui-table" id="packageToBeHandedOver_generatorLayer_table"  lay-filter="packageToBeHandedOver_generatorLayer_table"></table>
</script>
<%-- 交接发货 - 删除--%>
<script type="text/html" id="packageToBeHandedOver_generatorLayer_toolbar">
    <span class="layui-btn layui-btn-xs layui-btn-primary layui-border-red" style="color: red;" lay-event="delete">删除</span>
</script>

<%-- 备注弹框 --%>
<script type="text/html" id="generator_remarkLayer">
    <div class="layui-form" style="padding:20px;">
        <textarea placeholder="请输入内容" class="layui-textarea" name="remark" style="height:450px;"></textarea>
    </div>
</script>
<%-- 未生成的表格操作栏 --%>
<script type="text/html" id="aefmCrossStoreHandoverBatchTpl">
    <div style="padding:10px;">
        <div style="text-align: right;"><button id="getAefmPickupLabelBtn" class="layui-btn layui-btn-normal layui-btn-sm">打印揽收单</button></div>
        <div id="aefmCrossStoreHandoverTbl">

        </div>
    </div>
</script>
<script type="text/html" id="aefmCrossStoreHandover_createTime">
    <div>
        <span>{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</span>
    </div>
</script>

<script src="${ctx}/static/js/ireport/print.js"></script>
<script src="${ctx}/static/js/order/packageToBeHandedOver.js"></script>
