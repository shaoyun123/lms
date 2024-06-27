<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<style>
    #amazonRefundCard .layui-tab-title{
        height: 41px !important;
    }
</style>
<title>amazon退款订单分析</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="amazon_refund_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="amazon_refund_depart_sel" lay-search lay-filter="amazon_refund_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select  id="amazon_refund_salesman_sel" lay-search lay-filter="amazon_refund_salesman_sel"  class="users_hp_custom" data-rolelist="amazon专员" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <!-- <select id="amazon_refund_store_sel" lay-search lay-filter="amazon_refund_store_sel"   class="store_hp_custom" data-platcode="aliexpress">
                                        <option value=""></option>
                                    </select> -->
                                    <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"  class="store_hp_custom" data-platcode="amazon">
                                        </select>
                                </div>
                            </div>
                        </div>
                            <div class="layui-form-item" style="margin-bottom: 0">
                                <div class="layui-inline" style="padding-top: 3px;">
                                    <label class="layui-form-label">查看方式</label>
                                   <div class="layui-input-block" id="refundAnalysisType">
								      <input type="radio" name="statisticsType" value="platAcctId" title="按店铺（已发货）" checked>
								      <input type="radio" name="statisticsType" value="platAcctIdAll" title="按店铺">
								      <input type="radio" name="statisticsType" value="country" title="按国家">
								      <input type="radio" name="statisticsType" value="logistics" title="按物流方式">
                                      </div>
                                </div>
                            </div>
                    </form>
                </div> 
            </div>
            <div class="layui-card" id="amazonRefundCard">
                <div class="layui-card-body">
                 	<div class="layui-tab" lay-filter="amazon_analysis_tab_filter">
                        <ul class="layui-card-header layui-tab-title">
                            <li class="layui-this" orderTimeType="1" >根据订单时间</li>
                            <li orderTimeType="2">根据退款时间</li>
                        </ul>
                        <div class="layui-tab-content">
                           <table class="layui-table" lay-filter="refund_tablefilter" id="amazonRefund_table"></table>
                        </div>
                    </div>
                     <div style="position: absolute;top: 10px;right: 30px;">
                        <div style="float:right;">
                          <label class="layui-form-label">查看月份</label>
                          <div class="layui-inline" style="margin-top:2px" id="amazonOrdeTimeDiv">
                            <input type="text" class="layui-input" id="amazonOrderTime" name="amazonOrderTime">
                         </div>
                        <div class="layui-inline">
                            <button id="amazonRefund_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
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
                    <script type="text/html" id="amazonRefundCountryTpl">
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
<script type="text/html" id="amazon_refund_analysis_prodCate_tpl">
        {{d.prodCateClass2 || ''}}
</script>
<script type="text/javascript" src="${ctx}/static/js/statistics/amazon/amazonRefundAnalysis.js"></script>