<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>PB产品表现</title>
<style>
</style>



<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" id="pbproductshowForm" class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select id="pbproductshow_depart_sel" 
                                        lay-search
                                        lay-filter="pbproductshow_depart_sel"
                                        name="salesPersonOrgId"
                                        class="orgs_hp_custom">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select id="pbproductshow_salesman_sel" 
                                        lay-search
                                        lay-filter="pbproductshow_salesman_sel" 
                                        class="users_hp_custom"
                                        name="salesPersonId"
                                        data-rolelist="wish专员">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select id="pbproductshow_store_sel" 
                                        lay-filter="pbproductshow_store_sel"
                                        xm-select="pbproductshow_store_sel" 
                                        class="users_hp_store_multi"
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                        data-platcode="wish" 
                                        name="storeAcctIds">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">刊登时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" readonly id="pbproductshow_listingTime" name="listingTimes">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">搜索类型</label>
                                <div class="layui-input-block">
                                   <select name="type">
                                        <option value="listingStoreSubId">产品ID</option>
                                        <option value="cnTitle">产品名称</option>
                                        <option value="pSkus">商品SKU</option>
                                        <option value="storePSku">店铺SKU</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">搜索内容</label>
                                <div class="layui-input-block">
                                   <input type="text" class="layui-input" name="content">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                   <select
                                        name="prodAttrList"
                                        id="pbproductshow_prodAttrList"
                                        lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select
                                        name="logisAttr"
                                        id="pbproductshow_logisticsAttrStr"
                                        xm-select="pbproductshow_logisticsAttrStr" 
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                    >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                   <select name="orderByType" lay-search>
                                    <option value="1">刊登时间升序</option>
                                    <option value="2">刊登时间降序</option>
                                    <option value="3">费用升序</option>
                                    <option value="4">费用降序</option>
                                    <option value="5">成交额升序</option>
                                    <option value="6">成交额降序</option>
                                    <option value="7">订单量升序</option>
                                    <option value="8">订单量降序</option>
                                    <option value="9">花费成交比升序</option>
                                    <option value="10">花费成交比降序</option>
                                   </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">统计时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" readonly id="pbproductshow_AnalysisTime" name="analysisTimes">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-input-block">
                                    <span class="layui-btn layui-btn-sm layui-btn-normal" 
                                    lay-submit 
                                    lay-filter="pbproductshow_filter">搜索</span>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <div class="layui-card" id="pbproductshowCard">
                <div class="fixHigh">
                    <div class="layui-card-header">
                       <span class="layui-btn layui-btn-sm layui-btn-normal" id="pbproductshow_batchSubmit">导出</span>
                    </div>
                </div>
                <div class="layui-card-body">
                     <table class="layui-table" id="pbproductshow_table" 
                    lay-filter="pbproductshow_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<%-- 表格---图片 --%>
<script type="text/html" id="pbproductshow_img">
    <div>
      <img width="60" height="60" data-original="{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>

<%-- 表格---标题 --%>
<script type="text/html" id="pbproductshow_title">
  <div class="alignLeft">
    <strong>{{d.title || ''}}</strong>
    <div style="color:#ccc;">{{d.cnTitle || ''}}</div>
  </div>
</script>


<%-- 表格---店铺/销售 --%>
<script type="text/html" id="pbproductshow_store">
    <div class="alignLeft">
        <div>店铺名: {{d.storeAcctName || ''}}</div>
        <div>销售员: {{d.seller || ''}}</div>
    </div>
</script>


<%-- 表格---产品 --%>
<script type="text/html" id="pbproductshow_product">
    <div class="alignLeft">
       <div>产品ID: {{d.listingStoreSubId || ''}}</div>
       <div>产品SKU: {{d.pSkus || ''}}</div>
       <div>店铺SKU: {{d.storePSku || ''}}</div>
    </div>
</script>

<%-- 表格---总花费 --%>
<script type="text/html" id="pbproductshow_cost">
    <div class="alignLeft">
       <div>总花费: {{d.cost || ''}}</div>
       <div>PB销售额: {{d.orderTotalAmt || ''}}</div>
    </div>
</script>

<%-- 表格---最近活动状态pbproductshow_status" --%>
<script type="text/html" id="pbproductshow_status">

</script>


<%-- 表格---时间pbproductshow_time --%>
<script type="text/html" id="pbproductshow_time">
    <div class="alignLeft">
       <div>刊登: {{Format(d.listingTime,'yyyy-MM-dd hh:mm:ss')}}</div>
    </div>
</script>

<%-- 表格--操作pbproductshow_toolbar --%>
<script type="text/html" id="pbproductshow_toolbar">
    <div>
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="detail">查看详情</span>
        <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="export">导出活动数据</span>
    </div>
</script>

<%-- 弹框---图表 --%>
<script type="text/html" id="pbproductshow_layerEcharts">
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div style="padding:20px;height:90%;">
        <div style="display:flex;width:50%;" class="layui-form">
            <select name="" id="pbproductshow_layerEcharts_id" lay-filter="pbproductshow_echartSelectFilter">
                
            </select>
            <input type="text" class="layui-input" style="margin-left:30px;" id="pbproductshow_layerEcharts_times">
        </div>
        <div id="pbproductshow_echartsContainer" style="width: 100%;height:100%;"></div>
    </div>
</script>


<script src="${ctx}/static/js/publishs/wish/pbproductshow.js"></script>