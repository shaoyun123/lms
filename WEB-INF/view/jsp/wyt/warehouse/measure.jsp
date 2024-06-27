<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>尺寸测量</title>

<style>
    .secondary {
        color: grey;
    }
    .inputHeight {
        height: 40px;
        line-height: 40px;
        font-size: 24px;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="measure_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerIdListStr" 
                                        id="measure_bizzOwnerSelect" 
                                        lay-filter="measure_bizzOwnerFilter"
                                        xm-select="measure_bizzOwnerList"
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                        <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType">
                                        <option value="pSku">父SKU</option>
                                        <option value="sSku">子SKU</option>
                                        <option value="pSku2">父SKU(精确)</option>
                                        <option value="sSku2">子SKU(精确)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="searchValue">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 measurePerson">
                                <label class="layui-form-label">测量人</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="operator">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md4 measureTimes disN">
                                <label class="layui-form-label">测量时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="measureTimes" id="measure_timesRange">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 disN measureReason">
                                <label class="layui-form-label">无法测量原因</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="unmeasureReason">
                                </div>
                            </div>
                            <input type="hidden" name="measureStatus" value="0" id="measure_ifMeasure">
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="measure_submit">查询</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="measureCard">
                <div style="height:42px;line-height:42px;">
                <div class="layui-card-header" style="display:flex;justify-content:space-between;">
                    <div class="layui-tab" lay-filter="measure-tabs" id="measure-tabs" style="display:flex;align-items: center;">
                        <ul class="layui-tab-title">
                            <li class="layui-this">待测量(<span class="if_measure_false">0</span>)</li>
                            <li>已测量(<span class="if_measure_true">0</span>)</li>
                            <li>无法测量(<span class="if_measure_un">0</span>)</li>
                            <li>全部(<span class="if_measure_all">0</span>)</li>
                        </ul>
                        <span class="layui-btn layui-btn-sm measureInitBtn">初始化</span>
                    </div>
                    <div>
                        <permTag:perm funcCode="measure_delete">
                        <span class="layui-btn layui-btn-sm layui-btn-danger" id="measure_batchDel">批量删除</span>
                        </permTag:perm>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="measure_handleBtn">
                            测量
                        </span>
                    </div>
                </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="measure_table"  lay-filter="measure_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>



<%-- meaure弹框 --%>
<script type="text/html" id="measure_toolBar">
    <permTag:perm funcCode="measure_delete">
        <span class="layui-btn layui-btn-xs" lay-event="delete">删除</span>
    </permTag:perm>
</script>

<%-- 重量 --%>
<script type="text/html" id="measure_weight">
    <div class="alignLeft">
        <div><span class="secondary">称重: </span>{{d.prodWeight || 0}}</div>
        <div><span class="secondary">抛重(5): </span>{{accDiv(accMul(accMul( d.wrapLength || 0 , d.wrapWidth || 0 ), d.wrapHeight || 0 ),5).toFixed(2)}}</div>
        <div><span class="secondary">抛重(6): </span>{{accDiv(accMul(accMul( d.wrapLength || 0 , d.wrapWidth || 0 ), d.wrapHeight || 0 ),6).toFixed(2)}}</div>
        <div><span class="secondary">抛重(8): </span>{{accDiv(accMul(accMul( d.wrapLength || 0 , d.wrapWidth || 0 ), d.wrapHeight || 0 ),8).toFixed(2)}}</div>
    </div>
</script>

<%-- 尺寸 --%>
<script type="text/html" id="measure_size">
    <div class="alignLeft">
        <div><span class="secondary">包裹长: </span>{{d.wrapLength || 0}}</div>
        <div><span class="secondary">包裹宽: </span>{{d.wrapWidth || 0}}</div>
        <div><span class="secondary">包裹高: </span>{{d.wrapHeight || 0}}</div>
        <%-- <div><span class="secondary">压缩高: </span>{{d.compressHeight || ''}}</div>
        <div><span class="secondary">叠加高: </span>{{d.superpositionHeight || ''}}</div> --%>
    </div>
</script>
<%-- 英国信件 --%>
<script type="text/html" id="measure_eng">
{{# if(d.measureStatus ==0 || d.measureStatus ==2){  }}
    <div class="layui-form">
        <input type="checkbox" lay-skin="primary" disabled>
    </div>
{{# }else{ }}
    {{# if(d.wrapLength <35.3 && d.wrapWidth<25 && d.wrapHeight<2.5 && d.prodWeight< 750){  }}
    <div class="layui-form">
        <input type="checkbox" lay-skin="primary" disabled checked>
    </div>
    {{# }else{ }}
    <div class="layui-form">
        <input type="checkbox" lay-skin="primary" disabled>
    </div>
    {{# } }}
{{# } }}
</script>
<%-- 德国信件 --%>
<script type="text/html" id="measure_ger">
{{# if(d.measureStatus ==0 || d.measureStatus ==2){  }}
    <div class="layui-form">
        <input type="checkbox" lay-skin="primary" disabled>
    </div>
{{# }else{ }}
    {{# if(d.wrapLength <35.3 && d.wrapWidth<25 && d.wrapHeight<2 && d.prodWeight< 500){  }}
    <div class="layui-form">
        <input type="checkbox" lay-skin="primary" disabled checked>
    </div>
    {{# }else{ }}
    <div class="layui-form">
        <input type="checkbox" lay-skin="primary" disabled>
    </div>
    {{# } }}
{{# } }}
</script>

<%-- 计划英国信件 --%>
<script type="text/html" id="measure_ifUKLetterMeasure">
    {{# if(d.ifUKLetterMeasure){  }}
    <div class="layui-form">
        <input type="checkbox" lay-skin="primary" disabled checked>
    </div>
    {{# }else{ }}
    <div class="layui-form">
        <input type="checkbox" lay-skin="primary" disabled>
    </div>
    {{# } }}
</script>
<%-- 计划德国信件 --%>
<script type="text/html" id="measure_ifDELetterMeasure">
     {{# if(d.ifDELetterMeasure){  }}
    <div class="layui-form">
        <input type="checkbox" lay-skin="primary" disabled checked>
    </div>
    {{# }else{ }}
    <div class="layui-form">
        <input type="checkbox" lay-skin="primary" disabled>
    </div>
    {{# } }}
</script>

<%-- 可用库存 --%>
<script type="text/html" id="measureLayer_whStockWarning">
{{# if(d.prodSInfo){ }}
    {{# if (d.prodSInfo.isCombination) {}}
    <div>
        {{# if(d.combDetailList){  }}
        {{#  layui.each(d.combDetailList, function(index, item){ }}
        <div>{{ Number(item.combStockNum - item.combReservationNum) || 0 }}</div>
        {{#　})　}}
        {{# } }}
    </div>
    {{# } else {}}
        {{# if(d.whStockWarning){ }}
        <div>{{ Number(d.whStockWarning.stockNum - d.whStockWarning.reservationNum) || 0 }}</div>
        {{# } }}
    {{# } }}
{{# } }}
</script>



<%-- 尺寸测量详情弹框 --%>
<script type="text/html" id="measureDetail_layer">
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" id="measure_searchLayerForm">
                            <div class="layui-form-item">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">仓库</label>
                                    <div class="layui-input-block">
                                        <select name="whId" lay-filter="measure_warehouseFilter">
                                            
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">楼栋</label>
                                    <div class="layui-input-block">
                                        <select name="buildingNo" lay-filter="measure_buildingNoFilter">
                                            
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">楼层</label>
                                    <div class="layui-input-block">
                                        <select name="floorNo">
                                            
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">多品组合品</label>
                                    <div class="layui-input-block">
                                        <select name="ifMoreCombination">
                                            <option value="false" selected>否</option>
                                            <option value="true">是</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">数量</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" value="默认50,不可编辑" name="count" disabled>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2 pl20">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="measureLayer_submit">获取批次</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div>
                            <span style="font-size:20px;">数量(<span id="measure_layerTableCount">0</span>)</span>
                            <%-- <font color="red"><b>Tips:</b>鼠标移动到下一行输入框自动提交上一行数据,最后一行数据提交需点击提交按钮!</font> --%>
                            <font color="red" style="font-size:20px;"><b>提示:</b>鼠标移动到下一行输入框自动提交上一行数据,复制粘贴数据必须点击提交!最后一行必须点击提交!
                            </font>
                        </div>
                        <table class="layui-table" id="measureLayer_table"  lay-filter="measureLayer_tableFilter">
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<%-- sku处理 --%>
<script type="text/html" id="measureLayer_sSku">
    <div>
        {{d.sSku}}
        {{# if(d.isCombination){ }}
        <span class="layui-badge layui-bg-blue" title="组合品">组</span>
        {{# } }}
    </div>
</script>

<script type="text/html" id="measureLayer_sSku_batch">
    <div>
        {{d.sSku}}
        {{# if(d.prodSInfo.isCombination){ }}
        <span class="layui-badge layui-bg-blue" title="组合品">组</span>
        {{# } }}
    </div>
</script>

<%-- 弹框图片 --%>
<script type="text/html" id="measureLayer_img">
    {{#  if(typeof(d.prodSInfo.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.prodSInfo.image }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<%-- 组合品明细-主表 --%>
<script type="text/html" id="measureLayer_combination">
    <div class="alignLeft">
        {{# if(d.winitCombInfoDtoList){  }}
        {{#  layui.each(d.winitCombInfoDtoList, function(index, item){ }}
            {{#  if(item.combSku && item.prodDetailNums){ }}
                <div><strong>{{item.combSku}}</strong><span>*{{item.prodDetailNums}}</span></div>
            {{# } }}
        {{#　})　}}
        {{# } }}
    </div>
</script>

<%-- 组合品明细-批次表 --%>
<script type="text/html" id="measureLayer_combination_batch">
    <div>
        {{# if(d.combDetailList){  }}
        {{#  layui.each(d.combDetailList, function(index, item){ }}
        {{#  if(item.sSku && item.prodDetailNums){ }}
        <div><strong>{{item.sSku}}</strong><span>*{{item.prodDetailNums}}</span></div>
        {{# } }}
        {{#　})　}}
        {{# } }}
    </div>
</script>

<%-- 库位明细-批次表 --%>
<script type="text/html" id="measureLayer_location_batch">
    {{# if (d.prodSInfo.isCombination) {}}
    <div>
        {{# if(d.combDetailList){  }}
        {{#  layui.each(d.combDetailList, function(index, item){ }}
            {{# if(item.combLocation){ }}
                {{# if(item.combLocation.locationCode){ }}
                <div>{{ item.combLocation.locationCode }}</div>
                {{# } }}
            {{# } }}
        {{#　})　}}
        {{# } }}
    </div>
    {{# } else {}}
    <div>{{d.location&&d.location.locationCode || ''}}</div>
    {{# } }}

</script>

<%-- 款式-批次表 --%>
<script type="text/html" id="measureLayer_style_batch">
    {{# if (d.prodSInfo.isCombination) {}}
    <div>
        {{# if(d.combDetailList){  }}
        {{#  layui.each(d.combDetailList, function(index, item){ }}
        <div><strong>{{item.style || ''}}</strong></div>
        {{#　})　}}
        {{# } }}
    </div>
    {{# } else {}}
    <div>{{d.prodSInfo.style || ''}}</div>
    {{# } }}

</script>


<%-- 弹框表格-楼栋 --%>
<script type="text/html" id="measureLayer_buildingNo">
    {{# if (d.prodSInfo.isCombination) {}}
    <div>
        {{# if(d.combDetailList){  }}
        {{#  layui.each(d.combDetailList, function(index, item){ }}
        <div><strong>{{item.combLocation ? item.combLocation.buildingNo: ''}}</strong></div>
        {{#　})　}}
        {{# } }}
    </div>
    {{# } else {}}
    <div>{{d.location&&d.location.buildingNo || ''}}</div>
    {{# } }}
</script>
<%-- 弹框表格-楼层 --%>
<script type="text/html" id="measureLayer_floor">
    {{# if (d.prodSInfo.isCombination) {}}
    <div>
        {{# if(d.combDetailList){  }}
        {{#  layui.each(d.combDetailList, function(index, item){ }}
        <div><strong>{{item.combLocation ? item.combLocation.floorNo: ''}}</strong></div>
        {{#　})　}}
        {{# } }}
    </div>
    {{# } else {}}
    <div>{{d.location&&d.location.floorNo || ''}}</div>
    {{# } }}
</script>
<%-- 产品重量(kg) --%>
<script type="text/html" id="measureLayer_weight">
    <div>
        <input type="number" class="layui-input inputHeight measureLayer_weightInput" name="weight" value="{{Number(d.prodWeight/1000) || ''}}" ztt-verify="priority" min="0">
        <input type="hidden" value="{{Number(d.prodSInfo.suttleWeight/1000)}}" name="suttleWeight">
        <input type="hidden" value="{{Number(d.prodSInfo.packWeight/1000)}}" name="packWeight">
    </div>
</script>
<%-- 包裹长(cm) --%>
<script type="text/html" id="measureLayer_length">
    <div>
        <input type="number" class="layui-input inputHeight" name="length" value="{{d.wrapLength|| ''}}" ztt-verify="priority" min="15">
    </div>
</script>
<%-- 包裹宽(cm) --%>
<script type="text/html" id="measureLayer_width">
    <div>
        <input type="number" class="layui-input inputHeight" name="width" value="{{d.wrapWidth|| ''}}" ztt-verify="priority" min="10">
    </div>
</script>
<%-- 包裹高(cm) --%>
<script type="text/html" id="measureLayer_height">
    <div>
        <input type="number" class="layui-input inputHeight" name="height" value="{{d.wrapHeight|| ''}}" ztt-verify="priority" min="0">
    </div>
</script>
<%-- 无法测量原因 --%>
<script type="text/html" id="measureLayer_unReason">
    <div>
        <input type="text" class="layui-input inputHeight" name="unmeasureReason" value="{{d.unmeasureReason || ''}}">
    </div>
</script>
<%-- 备注 --%>
<script type="text/html" id="measureLayer_remark">
    <div>
        <textarea type="number" class="layui-input inputHeight" name="remark" value="{{d.remark || ''}}">
        </textarea>
    </div>
</script>
<%-- 包装规格 --%>
<script type="text/html" id="measureLayer_package">
    <div class="layui-form">
        <select name="winitPackSpecId" lay-search>
            <option value="">请选择</option>
            {{#  layui.each(JSON.parse(localStorage.getItem('packages')), function(index, item){ }}
            <option value="{{item.id}}">{{item.name}}</option>
            {{#　})　}}
        </select>
    </div>
</script>
<%-- 压缩数量 --%>
<%-- <script type="text/html" id="measureLayer_compress">
    <div>
        <input type="number" class="layui-input" name="compress_number" value="{{d.compressNum}}" min="0">
    </div>
</script> --%>
<%-- 压缩整体高(cm) --%>
<%-- <script type="text/html" id="measureLayer_compressHeight">
    <div>
        <input type="number" class="layui-input" name="compressHeight" value="{{d.compressTotalHeight}}" min="0">
    </div>
</script> --%>
<%-- 叠加数量 --%>
<%-- <script type="text/html" id="measureLayer_superposition">
    <div>
        <input type="number" class="layui-input" name="superposition_number" value="{{d.superpositionNum}}" min="0">
    </div>
</script> --%>
<%-- 叠加整体高(cm) --%>
<%-- <script type="text/html" id="measureLayer_superpositionHeight">
    <div>
        <input type="number" class="layui-input" name="superpositionHeight"  value="{{d.superpositionTotalHeight}}" min="0">
    </div>
</script> --%>
<%-- 弹框表格操作 --%>
<script type="text/html" id="measureLayer_toolBar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="copy">复制</span><br>
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="paste">粘贴</span><br>
        <%-- <span class="layui-btn layui-btn-xs disN" lay-event="submit" data-id="{{d.id}}">提交</span> --%>
        <span class="layui-btn layui-btn-xs" lay-event="submit">提交</span><br>
    </div>
</script>

<script src="${ctx}/static/js/wyt/warehouse/measure.js"></script>