<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>调价通知</title>
<style>
</style>
<div class="layui-fluid" id="LAY-commodity-process-adjustprice">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="priceSearchForm" class="layui-form">
                        <input type="hidden" name="pCateIds" id="LAY-commodity-catalog-customs-hidden">
                        <div class="layui-form-item" style="margin-bottom:0">
                           <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">只看平台</label>
                                <div class="layui-input-block">
	                                <select name="platCode" id="platCodeSel" lay-filter="platCodeSel" lay-search>
	                                    <option value='wish'>wish<option>
	                                    <option value='joom'>joom<option>
	                                    <option value='shopee'>shopee<option>
	                                    <option value='ebay'>ebay<option>
	                                    <option value='smt'>smt<option>
	                                    <option value='lazada'>lazada<option>
	                                </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" id="wishStat">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-block">
                                    <select name="procStatus" lay-search>
                                        <option value="">全部<option>
                                         <option value='1'>未处理<option>
                                        <option value='3'>未刊登<option>
                                        <option value='4'>已处理<option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">搜索类型</label>
                                <div class="layui-input-block">
                                    <select name="selectType" id="selectType" lay-search>
                                         <option value='1'>子SKU<option>
                                         <%--<option value='2'>父SKU<option>--%>
                                     </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">搜索内容</label>
                                <div class="layui-input-block">
                                    <input type="text" name="sSku" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">时间范围</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="adjustPriceTime" name="adjustPriceTime" readonly>
                                </div>
                            </div>
                             <input name="orderBy" type="hidden">
                            
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button type="button" class='layui-btn layui-btn-sm keyHandle' data-type="reload" id="priceSearchBtn">搜索</button>
                                <button type="reset" class='layui-btn layui-btn-primary layui-btn-sm' data-type="reload" id="priceResetBtn">清空</button>
                            <div style="float:right;margin-top:3px">
                                <button type="button" id="batchUpadateStatus" class="layui-btn layui-btn-normal layui-btn-sm">批量处理</button>
                    		</div>
                            </div>
                            
                        </div>                          
                    </form>
	            </div>
		    </div>
	             <div class="layui-card" id="adjustpriceCard">
	                <div class="layui-card-header">
                               <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" id="exportAdjustInfo_Temp">导出调价通知信息</button>
                      </div>
	                <div class="layui-card-body">
	                    <!-- 表格的数据渲染 -->
	                    <table class="layui-table" id="intable" lay-filter="intable"></table>
	                <script type="text/html" id="prodOldOriTpl"> 
                         <span lay-tips="平均成本">成本(¥):</span>{{ d.origiCost }}<br>  
						 <span>毛重(g):</span>{{ d.origiNetWeight }}
                    </script>

	                <script type="text/html" id="prodNewOriTpl">
                         <div><span lay-tips="平均成本">成本(¥):</span>{{ d.currCost }}<br> 
						<span>毛重(g):</span>{{ d.currNetWeight }}</div> 
                    </script>
                     <script type="text/html" id="smtOrigiPriceTpl">
                         <span>{{ d.smtOrigiPrice }}</span> 
                    </script>
                     <script type="text/html" id="smtNewPriceTpl">
                         <span>{{ d.smtNewPrice }}</span> 
                    </script>
                    <script type="text/html" id="shopeeOrigiPriceTpl">
                         <span>{{ d.shopeeOrigiPrice }}</span> 
                    </script>
                     <script type="text/html" id="shopeeNewPriceTpl">
                         <span>{{ d.shopeeNewPrice }}</span> 
                    </script>
                    <script type="text/html" id="lazadaOrigiPriceTpl">
                        <span>{{ d.lazadaOrigiPrice ||'' }}</span>
                    </script>
                    <script type="text/html" id="lazadaNewPriceTpl">
                        <span>{{ d.lazadaNewPrice  ||'' }}</span>
                    </script>
                     <script type="text/html" id="wishOrigiPriceTpl">
                         <span>{{ d.wishOrigiPrice}}</span> 
                    </script>
                     <script type="text/html" id="wishNewPriceTpl">
                         <span>{{ d.wishNewPrice}}</span> 
                    </script>
                    
                     <script type="text/html" id="ebayOrigiPriceTpl">
                         <span>{{ d.ebayOrigiPrice }}</span> 
                    </script>
                     <script type="text/html" id="ebayNewPriceTpl">
                         <span>{{ d.ebayNewPrice }}</span> 
                    </script>
                    <script type="text/html" id="joomOrigiPriceTpl">
                         <span>{{ d.joomOrigiPrice }}</span> 
                    </script>
                     <script type="text/html" id="joomNewPriceTpl">
                         <span>{{ d.joomNewPrice }}</span> 
                    </script>
                    
                    <script type="text/html" id="smtProcStatusBar">
                        {{# if(d.smtProcStatus != null){ }}
                            {{# if(d.smtProcStatus == '1'){ }}
                          	<span style="color:red">未处理</span>
							 {{# }else if(d.smtProcStatus == '3'){ }}
								<span style="color:blue">未刊登</span>
							{{# }else if(d.smtProcStatus == '4'){ }}
								<span style="color:green">已处理</span>
                            {{#  } }}
                        {{# } }}
                    </script>
                    <script type="text/html" id="wishProcStatusBar">
                        {{# if(d.wishProcStatus != null){ }}
                            {{# if(d.wishProcStatus == '1'){ }}
                          	<span style="color:red">未处理</span>
							 {{# }else if(d.wishProcStatus == '3'){ }}
								<span style="color:blue">未刊登</span>
							{{# }else if(d.wishProcStatus == '4'){ }}
								<span style="color:green">已处理</span>
                            {{#  } }}
                        {{# } }}
                    </script>
                    <script type="text/html" id="ebayProcStatusBar">
                        {{# if(d.smtProcStatus != null){ }}
                            {{# if(d.ebayProcStatus == '1'){ }}
                          	<span style="color:red">未处理</span>
							 {{# }else if(d.ebayProcStatus == '3'){ }}
								<span style="color:blue">未刊登</span>
							{{# }else if(d.ebayProcStatus == '4'){ }}
								<span style="color:green">已处理</span>
                            {{#  } }}
                        {{# } }}
                    </script>
                    <script type="text/html" id="joomProcStatusBar">
                        {{# if(d.joomProcStatus != null){ }}
                            {{# if(d.joomProcStatus == '1'){ }}
                          	<span style="color:red">未处理</span>
							 {{# }else if(d.joomProcStatus == '3'){ }}
								<span style="color:blue">未刊登</span>
							{{# }else if(d.joomProcStatus == '4'){ }}
								<span style="color:green">已处理</span>
                            {{#  } }}
                        {{# } }}
                    </script>
                        <script type="text/html" id="lazadaProcStatusBar">
                            {{# if(d.lazadaProcStatus != null){ }}
                            {{# if(d.lazadaProcStatus == '1'){ }}
                            <span style="color:red">未处理</span>
                            {{# }else if(d.lazadaProcStatus == '3'){ }}
                            <span style="color:blue">未刊登</span>
                            {{# }else if(d.lazadaProcStatus == '4'){ }}
                            <span style="color:green">已处理</span>
                            {{#  } }}
                            {{# } }}
                        </script>
                    <script type="text/html" id="shopeeProcStatusBar">
                        {{# if(d.shopeeProcStatus != null){ }}
                            {{# if(d.shopeeProcStatus == '1'){ }}
                          	<span style="color:red">未处理</span>
							 {{# }else if(d.shopeeProcStatus == '3'){ }}
								<span style="color:blue">未刊登</span>
							{{# }else if(d.shopeeProcStatus == '4'){ }}
								<span style="color:green">已处理</span>
                            {{#  } }}
                        {{# } }}
                    </script>
	                <script type="text/html" id="wishPriceDifTpl">
                         <div>{{ (d.wishNewPrice-d.wishOrigiPrice).toFixed(2) }}</div> 
                    </script>
	                <script type="text/html" id="wishPricePropTpl">
                         <div>{{ (((d.wishNewPrice-d.wishOrigiPrice)/d.wishOrigiPrice)*100).toFixed(2)}}%</div> 
                    </script>
                    
                     <script type="text/html" id="ebayPriceDifTpl">
                         <div>{{ (d.ebayNewPrice-d.ebayOrigiPrice).toFixed(2) }}</div> 
                    </script>
	                <script type="text/html" id="ebayPricePropTpl">
                         <div>{{ (((d.ebayNewPrice-d.ebayOrigiPrice)/d.ebayOrigiPrice)*100).toFixed(2)}}%</div> 
                    </script>

                    <script type="text/html" id="lazadaPriceDifTpl">
                        {{#  if(d.lazadaNewPrice && d.lazadaOrigiPrice ){ }}
                        <div>{{ (d.lazadaNewPrice-d.lazadaOrigiPrice).toFixed(2) ||'' }}</div>
                        {{#  }else{   }}
                        <div></div>
                        {{# }  }}
                    </script>
                    <script type="text/html" id="lazadaPricePropTpl">
                            {{#  if(d.lazadaNewPrice && d.lazadaOrigiPrice ){ }}
                            <div>{{(((d.lazadaNewPrice-d.lazadaOrigiPrice)/d.lazadaOrigiPrice)*100).toFixed(2)}}%</div>
                            {{#  }else{   }}
                            <div></div>
                            {{# }  }}
                    </script>
                    
                     <script type="text/html" id="smtPriceDifTpl">
                         <div>{{ (d.smtNewPrice-d.smtOrigiPrice).toFixed(2) }}</div> 
                    </script>
	                <script type="text/html" id="shopeePricePropTpl">
                         <div>{{ (((d.shopeeNewPrice-d.shopeeOrigiPrice)/d.shopeeOrigiPrice)*100).toFixed(2)}}%</div> 
                    </script>
                    <script type="text/html" id="shopeePriceDifTpl">
                         <div>{{ (d.shopeeNewPrice-d.shopeeOrigiPrice).toFixed(2) }}</div> 
                    </script>
	                <script type="text/html" id="smtPricePropTpl">
                         <div>{{ (((d.smtNewPrice-d.smtOrigiPrice)/d.smtOrigiPrice)*100).toFixed(2)}}%</div> 
                    </script>
                    <script type="text/html" id="joomPriceDifTpl">
                         <div>{{ (d.joomNewPrice-d.joomOrigiPrice).toFixed(2) }}</div> 
                    </script>
	                <script type="text/html" id="joomPricePropTpl">
                         <div>{{ (((d.joomNewPrice-d.joomOrigiPrice)/d.joomOrigiPrice)*100).toFixed(2)}}%</div> 
                    </script>
                    
                    
	                <script type="text/html" id="checkStatusBar">
                        {{# if(d.isComplete != null){ }}
                            {{# if(d.isComplete == '0'){ }}
                          	<span>未处理</span>
                            {{# }else if(d.isComplete == '1'){ }}
                          	<span>已处理</span>
                            {{#  } }}
                        {{# } }}
                    </script>
	                    
	                    <script type="text/html" id="priceBar">
                          <a class="layui-btn layui-btn-xs" lay-event="edit">处理</a>
                    </script>
	                </div>
	            </div>
	            
	           <!--  <div class="layui-card">
	                <div class="layui-card-header">
	                    <button type="button" style="position: absolute;top:6px;right: 6px" class="layui-btn layui-btn-sm">导出</button>
	                </div>
	                <div class="layui-card-body">
	                      <button type="button" class="layui-btn layui-btn-sm" id="cost_remark">详情里的备注弹框</button>
	                </div>
	            </div> -->
            </div>
      </div>
</div>
<!-- 处理 -->
<div class="disN p20" id="proHandleLayer">
    <form class="layui-form" id="checkHandleForm">
        <input type="hidden" name="id" class="layui-input">
         <div class="layui-form-item"  style="display:none">
       		 <label class="layui-form-label">原价格：</label>
       		 <div class="layui-input-block">
       		 	<input type="text" name="changetype" class="layui-input">
        	</div>
        	 <div class="layui-input-block">
       		 	<input type="text" name="sSku" class="layui-input">
        	</div>
        </div>
        <div class="layui-form-item"  style="display:none">
       		 <label class="layui-form-label">原价格：</label>
       		 <div class="layui-input-block">
       		 	<input type="text" name="origiCost" class="layui-input" >
        	</div>
        </div>
        <div class="layui-form-item" style="display:none">
        	 <label class="layui-form-label" >新价格：</label>
        	  <div class="layui-input-block">
        	 		<input type="text" name="currCost" class="layui-input" >
       		  </div>
        </div>
         <div class="layui-form-item" style="display:none">
        	 <label class="layui-form-label" >批量数据：</label>
        	  <div class="layui-input-block">
        	 		<input type="text" name="batchData" class="layui-input">
       		  </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">处理：</label>
            <div class="layui-input-block">
               <select name="check" id="check" lay-search>
                    <option value="">全部<option>
                    <option value='3'>未刊登<option>
                    <option value='4'>已处理<option>
                </select>
           </div>
        </div>
         <div class="layui-form-item">
            <label class="layui-form-label">备注：</label>
            <div class="layui-input-block">
                <input type="text" name="remark" class="layui-input" lay-verify="required">
            </div>
        </div>
        
        <div class="layui-form-item" style="display: none;">
            <div class="layui-input-block taRight">
                <button class="layui-btn" lay-submit="" lay-filter="priceSubFil" id="submitEbayTortDevSuggest">提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">清空</button>
            </div>
        </div>
    </form>
</div>
<script type="text/html" id="exportAdjustPriceInfotpl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="exportAdjustInfoForm_producttpl"  lay-filter="exportAdjustInfoForm_producttpl" autocomplete="off">
                        <div class="layui-form-item" notNull>
                                <label class="layui-form-label">开始时间</label>
                                <div class="layui-input-block">
                                    <input name="beginTime" id="beginTime_export_adjust_tpl" class="layui-input">
                                </div>
                        </div>
                        <div class="layui-form-item">
                                <label class="layui-form-label">结束时间</label>
                                <div class="layui-input-block">
                                    <input name="endTime" id="endTime_export_adjust_tpl" class="layui-input">
                                </div>
                        </div>
 						<div class="layui-form-item">
                              <label class="layui-form-label">导出平台</label>
                                <div class="layui-input-block">
	                                <select name="Export_platCodeSel" id="Export_platCodeSel" lay-search>
	                                    <option value='1'>wish<option>
	                                    <option value='2'>joom<option>
	                                    <option value='3'>shopee<option>
	                                    <option value='4'>ebay<option>
	                                    <option value='5'>smt<option>
	                                    <option value='6'>lazada<option>
	                                </select>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>
<script src="${ctx}/static/js/commodity/process/adjustprice.js"></script>
<script src="${ctx}/static/bootstrap/bootstrap.min.js"></script>
