<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>尺寸重量测量</title>

<style>
    #dimensionCard .layui-table-box .layui-table-body{
        overflow: hidden;
    }
    #dimensionCard .tal {
        text-align: left;
    }
    .inputHeight {
        height: 40px;
        line-height: 40px;
        font-size: 24px;
    }
    .dimension_ellipsis {
        text-overflow:ellipsis; 
        overflow:hidden;
        white-space: nowrap;
    }
    .dimension_inputBg {
        background-color: #88d0b2;
    }
    #dimensionDetail_layerId td input[disabled],
    #dimensionDirectDetail_layerId td input[disabled] {
        background-color: #eee;
    }
    .dimension_tableStockBg {
        color: #ccc;
    }
    .dimension_red-plus{
        font-size: 24px;
        font-weight: bold;
        color: red;
        margin: 0 5px;
    }
    .dimension_blue-plus{
        font-size: 34px;
        font-weight: bold;
        color: #1E9FFF;
        margin: 0 5px;
    }
</style>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form" id="dimensionSearchForm">
            <div class="layui-form-item">
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">部门</label>
                    <div class="layui-input-block">
                        <select name="organize" lay-filter="dimension_devPerson" class="orgs_hp_custom" data-id="dimension_devPerson">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2 disN">
                    <div class="layui-input-block">
                        <select name="bizzOwnerIdListStr" lay-filter="dimension_devPerson" lay-search="" class="users_hp_custom" data-id="dimension_devPerson" data-roleList="开发专员">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <div class="layui-form-label labelSel">
                        <select name="personnelType">
                            <option value="1">需求人</option>
                            <option value="2">测量人</option>
                            <option value="3">开发</option>
                            <option value="4">采购</option>
                        </select>
                    </div>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="personnelValue">
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
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
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">需求类型</label>
                    <div class="layui-input-block">
                        <select name="measureType" lay-search  id="dimension_measureType">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <div class="layui-form-label labelSel">
                        <select name="timeType">
                            <option value="1">需求时间</option>
                            <option value="2">测量时间</option>
                            <option value="3">创建时间</option>
                        </select>
                    </div>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" autocomplete="off" name="times" id="dimension_times" readonly>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">是否新品</label>
                    <div class="layui-input-block">
                        <select name="ifNewProduct">
                            <option value="">请选择</option>
                            <option value="1">是</option>
                            <option value="0">否</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">是否复测</label>
                    <div class="layui-input-block">
                        <select name="ifRetest">
                            <option value="">请选择</option>
                            <option value="1">是</option>
                            <option value="0">否</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">商品状态</label>
                    <div class="layui-input-block">
                        <select name="isSale">
                            <option value="">请选择</option>
                            <option value="0">停售</option>
                            <option value="1">在售</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">重量同步</label>
                    <div class="layui-input-block">
                        <select name="weightSyncStatus">
                            <option value="">请选择</option>
                            <option value="1">已同步</option>
                            <option value="0">未同步</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">尺寸同步</label>
                    <div class="layui-input-block">
                        <select name="sizeSyncStatus">
                            <option value="">请选择</option>
                            <option value="1">已同步</option>
                            <option value="0">未同步</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">库位</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="locationName">
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <div class="layui-form-label labelSel">
                        <select name="weightDiffType">
                            <option value="1">抛重差</option>
                            <option value="0">毛重差</option>
                        </select>
                    </div>
                    <div class="layui-input-block" style="display:flex;">
                        <input type="text" class="layui-input" autocomplete="off" name="weightDiffMax" placeholder="g">
                        <input type="text" class="layui-input" autocomplete="off" name="weightDiffMin" placeholder="g">
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">排序</label>
                    <div class="layui-input-block">
                        <select name="sortStr">
                            <option value="dm.create_time asc">需求时间正序</option>
                            <option value="dm.create_time desc">需求时间倒序</option>
                            <option value="dm.throw_weight_diff asc">抛重差值正序</option>
                            <option value="dm.throw_weight_diff desc">抛重差值倒序</option>
                            <option value="dm.gross_weight_diff asc">实重差值正序</option>
                            <option value="dm.gross_weight_diff desc">实重差值倒序</option>
                            <option value="dm.wrap_length asc">包裹长正序</option>
                            <option value="dm.wrap_length desc">包裹长倒序</option>
                            <option value="dm.wrap_width asc">包裹宽正序</option>
                            <option value="dm.wrap_width desc">包裹宽倒序</option>
                            <option value="dm.wrap_height asc">包裹高正序</option>
                            <option value="dm.wrap_height desc">包裹高倒序</option>
                            <option value="dm.prod_weight asc">称重正序</option>
                            <option value="dm.prod_weight desc">称重倒序</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" name="remark" placeholder="关键词模糊搜索">
                    </div>
                </div>
                <div class="layui-col-md3 layui-col-lg3" style="margin-left:14px;">
                        <input type="hidden" value="0" name="measureStatus">
                        <div class="layui-form">
                            <span class="measurableShowOrHide">
                                <input type="checkbox" name="measurable" title="可测" lay-skin="primary">
                            </span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal" lay-submit lay-filter="dimension_submit">
                                查询
                            </span>
                        </div>
                </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card" id="dimensionCard">
         <div class="fixHigh">
            <div class="layui-card-header">
                <div class="fixTab">
                    <!-- 页签点击结构 -->
                    <div class="layui-tab" lay-filter="dimension_tabs"        
                    id="dimension_tabs">
                        <ul class="layui-tab-title">
                            <li class="layui-this">待测量<span data-index="0"></span></li>
                            <li>已测量<span data-index="1"></span></li>
                            <li>无法测量<span data-index="2"></span></li>
                            <li>全部<span data-index="3"></span></li>
                        </ul>
                        <div style="height: 40px;line-height: 40px;margin-left: 20px"><span style="color:red">*</span>&nbsp;&nbsp;<span style="color: #aaa">此页面只测量单个商品重量和尺寸</span></div>
                    </div>
                    <div>
                        <permTag:perm funcCode="dimension_batchDel_authBtn"> 
                            <span class="layui-btn layui-btn-sm layui-btn-danger" id="dimension_batchDel">
                                批量删除
                            </span>
                        </permTag:perm>

                        <permTag:perm funcCode="dimension_unbindBatch_authBtn">
                        <span class="layui-btn layui-btn-sm layui-btn-danger" id="dimension_unbindBatch">
                            解绑批次
                        </span>
                        </permTag:perm>

                        <permTag:perm funcCode="dimension_export_authBtn">
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="dimension_export">
                            导出
                        </span>
                        </permTag:perm>

                        <permTag:perm funcCode="dimension_add_authBtn"> 
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="dimension_add">
                            新增
                        </span>
                        </permTag:perm>

                        <permTag:perm funcCode="dimension_measureLayerBtn_authBtn"> 
                        <span class="layui-btn layui-btn-sm layui-btn-warm" id="dimension_measureLayerBtn">
                            测量
                        </span>
                        </permTag:perm>

                        <permTag:perm funcCode="dimension_directMeasureLayerBtn_authBtn"> 
                        <span class="layui-btn layui-btn-sm layui-btn-warm" id="dimension_directMeasureLayerBtn">
                            直接测量
                        </span>
                        </permTag:perm>


                        <permTag:perm funcCode="dimension_syncSize_authBtn"> 
                        <span class="layui-btn layui-btn-sm" id="dimension_syncSize">
                            同步尺寸
                        </span>
                        </permTag:perm>

                        <permTag:perm funcCode="dimension_syncWeight_authBtn"> 
                        <span class="layui-btn layui-btn-sm" id="dimension_syncWeight">
                            同步重量
                        </span>
                        </permTag:perm>

                        <permTag:perm funcCode="dimension_syncSizeAndWeight_authBtn"> 
                        <span class="layui-btn layui-btn-sm" id="dimension_syncSizeAndWeight">
                            同步尺寸和重量
                        </span>
                        </permTag:perm>
                    </div>
                </div>
            </div>
        </div>
        <!-- 下面放表格 -->
        <div class="layui-card-body">
            <table class="layui-table" id="dimension_table" 
            lay-filter="dimension_tableFilter"></table>
        </div>
      </div>
    </div>
  </div>
</div>


<%-- 表格-图片 --%>
<script type="text/html" id="dimension_productImage">
    {{#  if(d.productImage){ }}
    <img width="60" height="60" data-original="{{ d.productImage }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy img_show_hide" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>
<%-- 表格-sku --%>
<script type="text/html" id="dimension_sSku">
    <div class="tal">
        <div>{{d.sSku}}</div>
        <div>
            {{# if(d.ifNewProduct){ }}
            <span class="layui-badge layui-bg-green" title="新品">新</span>
            {{# } }}
            {{# if(d.ifRetest){ }}
            <span class="layui-badge layui-bg-blue" title="复测">复</span>
            {{# } }}
            {{# if(!d.isSale){ }}
            <span class="layui-badge layui-bg-orange" title="停售">停</span>
            {{# } }}
        </div>
    </div>
</script>
<%-- 表格-需求类型 --%>
<script type="text/html" id="dimension_measureTypeTable">
    <div>
        {{# if(d.measureType==1){ }}
        <span>测量重量</span>
        {{# }else if(d.measureType==2){ }}
        <span>测量尺寸</span>
        {{# }else if(d.measureType==3){ }}
        <span>测量尺寸&重量</span>
        {{# }else{ }}
        <span>拍照确认</span>
        {{# } }}
    </div>
</script>

<script type="text/html" id="dimension_measureLayerTypeTable">
    <div>
        {{# if(d.measureType==1){ }}
        <span>测量重量</span>
        {{# }else if(d.measureType==2){ }}
        <span>测量尺寸</span>
        {{# }else if(d.measureType==3){ }}
        <span>测量尺寸&重量</span>
        {{# }else{ }}
        <span>拍照确认</span>
        {{# } }}
    </div>
</script>

<%-- 表格-义乌仓信息 --%>
<script type="text/html" id="dimension_locationName">
    <div class="tal">
        <div>库位: {{d.locationName || ''}}</div>
        <div class="{{!d.preAvailableStock ? 'dimension_tableStockBg': ''}}">可用: {{d.preAvailableStock || 0}}</div>
    </div>
</script>

<%-- 表格-商品信息 --%>
<script type="text/html" id="dimension_prodInfo">
    <div class="tal">
        <div>外箱长: {{d.outerBoxLength || ''}}</div>
        <div>外箱宽: {{d.outerBoxWidth || ''}}</div>
        <div>外箱高: {{d.outerBoxHeight || ''}}</div>
        <div>抛重: {{d.prodThrowWeight || ''}}</div>
        <div>净重: {{d.prodGrossWeight || ''}}</div>
    </div>
</script>

<%-- 表格-测量信息 --%>
<script type="text/html" id="dimension_measureInfo">
    <div class="tal">
        <div>包裹长: {{d.wrapLength || ''}}</div>
        <div>包裹宽: {{d.wrapWidth || ''}}</div>
        <div>包裹高: {{d.wrapHeight || ''}}</div>
        <div>抛重(6): {{d.throwWeight || ''}}</div>
        <div>净重: {{d.prodWeight || ''}}</div>
    </div>
</script>

<%-- 表格-同步状态 --%>
<script type="text/html" id="dimension_syncStatus">
    <div class="tal">
        <div>尺寸: {{d.sizeSyncStatusCn || ''}}</div>
        <div>重量: {{d.weightSyncStatusCn || ''}}</div>
    </div>
</script>

<%-- 表格-绝对差值 --%>
<script type="text/html" id="dimension_absDiff">
    <div class="tal">
        <div>抛重: {{d.throwWeightDiff|| ''}}</div>
        <div>净重: {{d.grossWeightDiff || ''}}</div>
    </div>
</script>

<%-- 表格-人员 --%>
<script type="text/html" id="dimension_persons">
    <div class="tal">
        <div>需求: {{d.creator|| ''}}</div>
        <div>测量: {{d.measurer || ''}}</div>
        <div>开发: {{d.bizzOwner|| ''}}</div>
        <div>采购: {{d.buyer || ''}}</div>
    </div>
</script>
<%-- 表格-备注 --%>
<script type="text/html" id="dimension_remark">
    <div class="tal">
        <div title="{{d.remark|| ''}}" class="dimension_ellipsis">备注: {{d.remark|| ''}}</div>
        <div title="{{d.unmeasureReason || ''}}"  class="dimension_ellipsis">无法测量: {{d.unmeasureReason || ''}}</div>
    </div>
</script>
<%-- 表格-时间 --%>
<script type="text/html" id="dimension_timesTable">
    <div class="tal">
        <div>需求时间: {{Format(d.createTime,"yyyy-MM-dd")}}</div>
        {{# if(d.measureStatus=== 1){ }}
        <div>测量时间: {{Format(d.measureTime,"yyyy-MM-dd")}}</div>
        {{# } }}
        <div>更新时间: {{Format(d.modifyTime,"yyyy-MM-dd")}}</div>
        <div>创建时间: {{Format(d.prodCreateTime,"yyyy-MM-dd")}}</div>
    </div>
</script>

<%-- 表格-操作 --%>
<script type="text/html" id="dimensionBar">
    <div class="tal">
        {{# if(d.measureStatus=== 1 || d.measureStatus=== ''){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="retest">复测</span>
        {{# } }}
        {{# if(d.measureStatus=== 0){ }}
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="nomeasure">无法测量</span>
        {{# } }}
    </div>
</script>

<%-- 弹框-新增测量需求 --%>
<script type="text/html" id="dimension_addLayer">
    <div class="p20">
        <form class="layui-form" id="dimension_addForm">
            <div class="layui-form-item">
                <label class="layui-form-label">需求类型</label>
                <div class="layui-input-block">
                    <select name="measureType" lay-search  id="dimension_measureTypeLayer">
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">子SKU</label>
                <div class="layui-input-block">
                    <textarea name="skusStr" placeholder="请输入内容" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">需求备注</label>
                <div class="layui-input-block">
                    <textarea name="remark" placeholder="请输入内容" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>


<%-- 弹框-测量-尺寸测量 --%>
<script type="text/html" id="dimensionDetail_layer">
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" id="dimension_searchLayerForm">
                            <div class="layui-form-item">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">仓库</label>
                                    <div class="layui-input-block">
                                        <select name="whId" lay-filter="dimension_warehouseFilter" id="dimension_warehouseLayer">
                                            
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">楼栋</label>
                                    <div class="layui-input-block">
                                        <select name="buildingNo" lay-filter="dimension_buildingNoFilter">
                                            <option value="">请选择楼栋</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">楼层</label>
                                    <div class="layui-input-block">
                                        <select name="floorNo">
                                            <option value="">请选择楼层</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">数量</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" value="50" name="showNums" disabled placeholder="默认50,不可编辑">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2 pl20">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal"  lay-submit lay-filter="dimensionLayer_submit">获取批次</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div style="display: flex;justify-content: space-between;">
                            <span style="font-size:20px;">数量(<span id="dimension_layerTableCount">0</span>)</span>
                            <font color="red" style="font-size:20px;"><b>提示:</b>扫描SKU获取纪录要求,绿色背景为需测量字段,输入所有测量值后回车自动提交,复制粘贴数据必须点击提交!
                            </font>
                        </div>
                        <table class="layui-table" id="dimensionLayer_table"  lay-filter="dimensionLayer_tableFilter">
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<%-- 弹框-测量-表格-图片 --%>
<script type="text/html" id="dimensionLayer_img">
    {{#  if(typeof(d.prodSInfo.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.prodSInfo.image }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<%-- 弹框-测量-表格-库位--%>
<script type="text/html" id="dimensionLayer_location_batch">
   <div>{{d.location && d.location.locationCode || ''}}</div>
</script>

<%-- 弹框-测量-表格-库存 --%>
<script type="text/html" id="dimensionLayer_whStockWarning">
    {{# if(d.whStockWarning){ }}
        <div>{{ Number(d.whStockWarning.stockNum - d.whStockWarning.reservationNum) || 0 }}</div>
    {{# } }}
</script>

<%-- 弹框-测量-表格-楼栋 --%>
<script type="text/html" id="dimensionLayer_buildingNo">
    <div>{{d.location && d.location.buildingNo || ''}}</div>
</script>
<%-- 弹框-测量-表格-楼层 --%>
<script type="text/html" id="dimensionLayer_floor">
    <div>{{d.location && d.location.floorNo || ''}}</div>
</script>
<%-- 弹框-测量-表格-楼层 --%>
<script type="text/html" id="dimensionLayer_floor">
    <div>{{d.location && d.location.floorNo || ''}}</div>
</script>
<%-- 弹框-测量-表格-款式 --%>
<script type="text/html" id="dimensionLayer_style_batch">
    <div>{{d.prodSInfo && d.prodSInfo.style || ''}}</div>
</script>

<%-- 弹框-测量-表格-产品重量(g) --%>
<script type="text/html" id="dimensionLayer_weight">
    <div>
        <input type="number" class="layui-input inputHeight dimensionLayer_weightInput {{(d.measureType==1 || d.measureType==3) ? 'dimension_inputBg': ''}}" name="weight" value="{{Number(d.prodWeight) }}" ztt-verify="priority" min="0" {{(d.measureType==1 || d.measureType==3) ? '': 'disabled'}}>
        <input type="hidden" value="{{Number(d.prodSInfo.suttleWeight)}}" name="suttleWeight">
        <input type="hidden" value="{{Number(d.prodSInfo.packWeight)}}" name="packWeight">
    </div>
</script>
<%-- 弹框-测量-表格-包裹长(cm) --%>
<script type="text/html" id="dimensionLayer_length">
    <div>
        <input type="number" class="layui-input inputHeight {{(d.measureType==2 || d.measureType==3) ? 'dimension_inputBg': ''}}" name="length" value="{{d.wrapLength|| ''}}" ztt-verify="priority" min="15" {{(d.measureType==2 || d.measureType==3) ? '': 'disabled'}}>
        <input type="hidden" value="{{Number(d.prodSInfo.outerBoxLength || '')}}" name="outerBoxLength">
    </div>
</script>
<%-- 弹框-测量-表格-包裹宽(cm) --%>
<script type="text/html" id="dimensionLayer_width">
    <div>
        <input type="number" class="layui-input inputHeight {{(d.measureType==2 || d.measureType==3) ? 'dimension_inputBg': ''}}" name="width" value="{{d.wrapWidth|| ''}}" ztt-verify="priority" min="10" {{(d.measureType==2 || d.measureType==3) ? '': 'disabled'}}>
        <input type="hidden" value="{{Number(d.prodSInfo.outerBoxWidth || '')}}" name="outerBoxWidth">
    </div>
</script>
<%-- 弹框-测量-表格-包裹高(cm) --%>
<script type="text/html" id="dimensionLayer_height">
    <div>
        <input type="number" class="layui-input inputHeight {{(d.measureType==2 || d.measureType==3) ? 'dimension_inputBg': ''}}" name="height" value="{{d.wrapHeight|| ''}}" ztt-verify="priority" min="0" {{(d.measureType==2 || d.measureType==3) ? '': 'disabled'}}>
        <input type="hidden" value="{{Number(d.prodSInfo.outerBoxHeight || '')}}" name="outerBoxHeight">
    </div>
</script>

<%-- 弹框-测量-表格-操作 --%>
<script type="text/html" id="dimensionLayer_toolBar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="copy">复制</span><br>
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="paste">粘贴</span><br>
        <span class="layui-btn layui-btn-xs" lay-event="submit">提交</span>
        <span class="layui-btn layui-btn-xs" lay-event="lack">缺货待测</span>
    </div>
</script>


<%-- 弹框-直接测量-尺寸测量 --%>
<script type="text/html" id="dimensionDirectDetail_layer">
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form class="layui-form" id="dimensionDirect_searchLayerForm">
                            <div class="layui-form-item">
                                <div class="layui-col-lg2 layui-col-md2">
                                    <label class="layui-form-label">sku</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" placeholder="请扫描需要测量的SKU" id="dimensionDirect_searchLayerForm_sku">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div style="display: flex;justify-content: space-between;">
                            <span style="font-size:20px;">数量(<span id="dimensionDirect_layerTableCount">0</span>)</span>
                            <font color="red" style="font-size:20px;"><b>提示:</b>扫描SKU获取纪录要求,绿色背景为需测量字段,输入所有测量值后回车自动提交,复制粘贴数据必须点击提交!
                            </font>
                        </div>
                        <table class="layui-table" id="dimensionDirectLayer_table"  lay-filter="dimensionDirectLayer_tableFilter">
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>


<%-- 弹框-直接测量-表格-图片 --%>
<script type="text/html" id="dimensionDirectLayer_img">
    {{#  if(typeof(d.prodSInfo.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.prodSInfo.image }}!size=60x60" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="b1 lazy" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<%-- 弹框-直接测量-表格-库位--%>
<script type="text/html" id="dimensionDirectLayer_location_batch">
   <div>{{d.location && d.location.locationCode || ''}}</div>
</script>

<%-- 弹框-直接测量-表格-库存 --%>
<script type="text/html" id="dimensionDirectLayer_whStockWarning">
    {{# if(d.whStockWarning){ }}
        <div>{{ Number(d.whStockWarning.stockNum - d.whStockWarning.reservationNum) || 0 }}</div>
    {{# } }}
</script>

<%-- 弹框-直接测量-表格-楼栋 --%>
<script type="text/html" id="dimensionDirectLayer_buildingNo">
    <div>{{d.location && d.location.buildingNo || ''}}</div>
</script>
<%-- 弹框-直接测量-表格-楼层 --%>
<script type="text/html" id="dimensionDirectLayer_floor">
    <div>{{d.location && d.location.floorNo || ''}}</div>
</script>
<%-- 弹框-直接测量-表格-楼层 --%>
<script type="text/html" id="dimensionDirectLayer_floor">
    <div>{{d.location && d.location.floorNo || ''}}</div>
</script>
<%-- 弹框-直接测量-表格-款式 --%>
<script type="text/html" id="dimensionDirectLayer_style_batch">
    <div>{{d.prodSInfo && d.prodSInfo.style || ''}}</div>
</script>

<%-- 弹框-直接测量-表格-产品重量(g) --%>
<script type="text/html" id="dimensionDirectLayer_weight">
    <div>
        <input type="number" class="layui-input inputHeight dimensionLayer_weightInput {{(d.measureType==1 || d.measureType==3) ? 'dimension_inputBg': ''}}" name="weight" value="{{Number(d.prodWeight) }}" ztt-verify="priority" min="0" {{(d.measureType==1 || d.measureType==3) ? '': 'disabled'}}>
        <input type="hidden" value="{{Number(d.prodSInfo.suttleWeight)}}" name="suttleWeight">
        <input type="hidden" value="{{Number(d.prodSInfo.packWeight)}}" name="packWeight">
    </div>
</script>
<%-- 弹框-直接测量-表格-包裹长(cm) --%>
<script type="text/html" id="dimensionDirectLayer_length">
    <div>
        <input type="number" class="layui-input inputHeight {{(d.measureType==2 || d.measureType==3) ? 'dimension_inputBg': ''}}" name="length" value="{{d.wrapLength|| ''}}" ztt-verify="priority" min="15" {{(d.measureType==2 || d.measureType==3) ? '': 'disabled'}}>
        <input type="hidden" value="{{Number(d.prodSInfo.outerBoxLength|| '')}}" name="outerBoxLength">
    </div>
</script>
<%-- 弹框-直接测量-表格-包裹宽(cm) --%>
<script type="text/html" id="dimensionDirectLayer_width">
    <div>
        <input type="number" class="layui-input inputHeight {{(d.measureType==2 || d.measureType==3) ? 'dimension_inputBg': ''}}" name="width" value="{{d.wrapWidth|| ''}}" ztt-verify="priority" min="10" {{(d.measureType==2 || d.measureType==3) ? '': 'disabled'}}>
        <input type="hidden" value="{{Number(d.prodSInfo.outerBoxWidth|| '')}}" name="outerBoxWidth">
    </div>
</script>
<%-- 弹框-直接测量-表格-包裹高(cm) --%>
<script type="text/html" id="dimensionDirectLayer_height">
    <div>
        <input type="number" class="layui-input inputHeight {{(d.measureType==2 || d.measureType==3) ? 'dimension_inputBg': ''}}" name="height" value="{{d.wrapHeight|| ''}}" ztt-verify="priority" min="0" {{(d.measureType==2 || d.measureType==3) ? '': 'disabled'}}>
        <input type="hidden" value="{{Number(d.prodSInfo.outerBoxHeight|| '')}}" name="outerBoxHeight">
    </div>
</script>

<%-- 弹框-直接测量-表格-操作 --%>
<script type="text/html" id="dimensionDirectLayer_toolBar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-primary" lay-event="copy">复制</span><br>
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="paste">粘贴</span><br>
        <span class="layui-btn layui-btn-xs" lay-event="submit">提交</span>
    </div>
</script>


<script src="${ctx}/static/js/warehouse/dimension.js"></script>