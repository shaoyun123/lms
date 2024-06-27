<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<style>
    #wishRefundCard .layui-tab-title{
        height: 41px !important;
    }
</style>
<title>Wish退款订单分析</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <div class="layui-form">
                         <form id="wishAnalysisSearchForm" lay-filter="prod_search_form" class="layui-form">
                        
                            <div class="layui-form-item" style="margin-bottom: 0">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
	                                	<select placeholder="" name="storeAcct" id="wishRefund_depart_sel" lay-search lay-filter="wishRefund_depart_sel" class="orgs_hp_custom"></select>
                               	</div>
                            </div>
                             <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
	                                	<select placeholder="" name="saleName" id="wish_salesman_sel" lay-search lay-filter="wish_salesman_sel" class="users_hp_custom" data-rolelist="wish专员" ></select>
                             	</div>
                            </div>
                             <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block" lay-filter="component-form-element">
                                        <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"  class="store_hp_custom" data-platcode="wish">
                                        </select>
                                    </div>
                            </div>
                                <div class="layui-inline" style="padding-top: 3px;">
                                    <label class="layui-form-label">查看方式</label>
                                   <div class="layui-input-block" id="wish_refundAnalysisType">
								      <input type="radio" name="statisticsType" value="platAcctId" title="按店铺（已发货）" checked>
								      <input type="radio" name="statisticsType" value="platAcctIdAll" title="按店铺">
								      <input type="radio" name="statisticsType" value="refundReason" title="按退款原因">
								      <input type="radio" name="statisticsType" value="country" title="按国家">
								      <input type="radio" name="statisticsType" value="logistics" title="按物流方式">
								      <input type="radio" name="statisticsType" value="adName" title="按收件人">
								      <input type="radio" name="statisticsType" value="buyerId" title="按买家Id">
								      <input type="radio" name="statisticsType" value="cateId" title="按类目">
							    </div>
                                </div>
                            </div>
							</form>                            
                        </div>
                </div>
            </div>
            <div class="layui-card" id="wishRefundCard">
                <div class="layui-card-body">
                 	<div class="layui-tab" lay-filter="wish_analysis_tab_filter">
                        <ul class="layui-card-header layui-tab-title">
                            <li class="layui-this" orderTimeType="1" >根据订单时间</li>
                            <li orderTimeType="2">根据退款时间</li>
                        </ul>
                        <div class="layui-tab-content">
                           <table class="layui-table" lay-filter="refund_tablefilter" id="refund_table"></table>
                        </div>
                    </div>
                     <div style="position: absolute;top: 10px;right: 30px;">
                        <div style="float:right;">
                          <label class="layui-form-label">查看月份</label>
                          <div class="layui-inline" style="margin-top:2px" id="ordeTimeDiv">
                            <input type="text" class="layui-input" id="orderTime" name="orderTime">
                         </div>
                        <div class="layui-inline">
                            <button id="refund_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                        </div>
                    </div>
                    </div>
                    <script type="text/html" id="countryShipTpl">
    					<table class="layui-table" lay-filter="ship_tablefilter" id="ship_table"></table>
					</script>
					<script type="text/html" id="shipCountryTpl">
    					<table class="layui-table" lay-filter="country_tablefilter" id="country_table"></table>
					</script>
					<script type="text/html" id="cateClassTpl">
    					<table class="layui-table" lay-filter="country_tablefilter" id="cateClass_table"></table>
					</script>
					<script type="text/html" id="shipTpl">
    					<a href="javascript:;" lay-event="show_ship">{{d.allrootLogisType}}</a>
					</script>
                    <script type="text/html" id="wishRefundCountryTpl">
    						<a href="javascript:;" lay-event="show_country">{{d.adCountry}}</a>
					</script>
					<script type="text/html" id="cateIdTpl">
    						<a href="javascript:;" lay-event="show_cateclass2">{{d.prodCateClass1 || ''}}</a>
					</script>
                </div>
            </div>
        </div>
    </div>
</div>
<!--二级分类类目模板-->
<script type="text/html" id="wish_refund_analysis_prodCate_tpl">
        {{d.prodCateClass2 || ''}}
</script>
<script type="text/javascript" src="${ctx}/static/js/statistics/wish/wishRefundAnalysis.js"></script>
