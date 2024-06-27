<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>alipay账单</title>
<style>
    #alipay_alipayOrderDiv td .layui-table-cell{
    	height: inherit;
        overflow:visible;
        white-space:normal;
        word-wrap: break-word
    }
    #alipay_alipayOrderDiv .layui-form-item{
        margin-bottom: 0;
    }
</style>
<div class="layui-fluid" id="alipay_alipayOrderDiv">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
		<!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form action="" class="layui-form">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-lg2 layui-col-md2" style="margin-bottom: 10px">
                                <label class="layui-form-label">支付宝账号</label>
                                <div class="layui-input-block">
                                    <select name=alipayAcct id="alipayOrder_alipayAcctSelect" placeholder="请选择" lay-search >
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="margin-bottom: 10px">
                                <label class="layui-form-label">匹配结果</label>
                                <div class="layui-input-block">
                                    <select name="alipay_match_result" lay-filter="alipayOrder_macthResult" id="alipayOrder_macthResult">
                                        <option value="" >全部</option>
                                        <option value="0">未匹配</option>
                                        <option value="3">无1688单号</option>
                                        <option value="2">无差价</option>
                                        <option value="1">有差价</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">商户订单号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" placeholder="仅可输入商户订单号(18位)" id="alipayOrder_mercOrderNo">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">入账时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="alipayOrderTime">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2" style="padding-left:20px">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" lay-filter="formDemo" id="alipayOrder_search">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
<!-- 账单校验 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-row">

                        <div class="layui-col-lg4 layui-col-md4" style="margin-bottom: 10px">
                            <div style="float:left;margin:10px 10px 0 0">
                                <label>国际支付宝账单导入(csv)</label>
                            </div>
                            <div style="float:left;margin-right: 10px;">
                                <input type="text" class="layui-input">
                            </div>
                            <div style="float:left">
                                <button type="button" class="layui-btn layui-btn-sm" id="alipay_alipayOrderImport">
                                    <i class="layui-icon">&#xe67c;</i>浏览
                                </button>
                                <button type="button" class="layui-btn layui-btn-sm" id="alipay_alipayOrderImportBtn">导入</button>
                            </div>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4" style="margin-bottom: 10px">
                            <div style="float:left;margin:10px 10px 0 0">
                                <label>WF账单导入(xlsx)</label>
                            </div>
                            <div style="float:left;margin-right: 10px;">
                                <input type="text" class="layui-input">
                            </div>
                            <div style="float:left">
                                <button type="button" class="layui-btn layui-btn-sm" id="alipay_WFOrderImport">
                                    <i class="layui-icon">&#xe67c;</i>浏览
                                </button>
                                <button type="button" class="layui-btn layui-btn-sm" id="alipay_WFOrderImportBtn">导入</button>
                            </div>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4" style="margin-bottom: 10px">
                            <div style="float:left;margin:10px 10px 0 0">
                                <label>OA采购单(xlsx)</label>
                            </div>
                            <div style="float:left;margin-right: 10px;">
                                <input type="text" class="layui-input">
                            </div>
                            <div style="float:left">
                                <button type="button" class="layui-btn layui-btn-sm" id="alipay_allRootOrderImport">
                                    <i class="layui-icon">&#xe67c;</i>浏览
                                </button>
                                <button type="button" class="layui-btn layui-btn-sm" id="alipay_allRootOrderBtn">导入</button>
                            </div>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4">
                            <div style="float:left;margin:10px 10px 0 0">
                                <label>国际支付宝账单校验(csv)</label>
                            </div>
                            <div style="float:left;margin-right: 10px;">
                                <input type="text" class="layui-input">
                            </div>
                            <div style="float:left">
                                 <button type="button" class="layui-btn layui-btn-sm" id="alipay_alipayOrderCheck">
  									<i class="layui-icon">&#xe67c;</i>浏览
								</button>
                                <button type="button" class="layui-btn layui-btn-sm" id="alipay_alipayOrderCheckBtn">导入</button>
                            </div>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4">
                            <label>&nbsp</label>
                        </div>
                        <div class="layui-col-lg4 layui-col-md4">
                            <div style="float:left;margin:5px 10px 0 0">
                                <label>采购单校验(xlsx)</label>
                            </div>
                            <div style="float:left;margin-right: 10px;">
                                <input type="text" class="layui-input">
                            </div>
                            <div style="float:left">
                                <button type="button" class="layui-btn layui-btn-sm" id="alipay_allRootOrderCheck">
                                    <i class="layui-icon">&#xe67c;</i>浏览
                                </button>
                                <button type="button" class="layui-btn layui-btn-sm" id="alipay_allRootOrderCheckBtn">导入</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
<!-- 表格渲染 -->
            <div class="layui-card">
                <div class="layui-card-header">
                    <div class="layui-tab" lay-filter="alipayOrder_tab">
                        <ul class="layui-tab-title">
                            <li class="layui-this" audit_status="2" >未审核(<span id="alipayOrder_noAuditNumSpan"></span>)</li>
                            <li audit_status="3">已核单(<span id="alipayOrder_auditNumSpan"></span>)</li>
                            <li audit_status="">全部(<span id="alipayOrder_allDataNumSpan"></span>)</li>
                        </ul>
                    </div>
                    <div style="position:absolute;right:13px;top:-3px;">
                        <div style="float: right">
                            <button class="layui-btn layui-btn-sm" id="alipay_alipayOrderMacthBtn">匹配</button>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <div class="layui-tab-content">
                       <table class="layui-table" id="alipay_alipayOrderTable" lay-filter="alipay_alipayOrderTable"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 核单弹窗start-->
<script type="text/html"  id="alipay_auditOrderLayer">
    	<div class="p20">
           <form  class="layui-form" id="alipay_updateAlipayOrderForm" >
               <div class="layui-form-item">
                   <label class="layui-form-label">核单备注</label>
            	    <input type="hidden" name="id" class="layui-input" lay-verify="required">
                   <div class="layui-input-block">
     				   <textarea  placeholder="请输入核单备注" class="layui-textarea" name="auditNote"></textarea>
                       <span style="color:red; float: right;" >*</span>
                   </div>
               </div>
           </form>
        </div>
     </script>
 <!--核单弹窗end-->
 
 <!-- 处理核单备注 -->
 <script type="text/html" id="alipay_auditNote">
	{{# if(d.auditNote){ }}
		<p style='word-break: break-all;white-space: normal;'>{{ d.auditNote}}</p>
	{{# } }}
</script>
<!-- 处理记录时间 -->
<script type="text/html" id="alipay_recordTimeTpl">
		{{ Format(d.recordTime, "yyyy-MM-dd hh:mm:ss")}}
</script>
<!-- 处理操作时间 -->
<script type="text/html" id="alipay_operateTimeTpl">
			<span  style="color:#999;">导入:</span> {{ Format(d.importTime, "yyyy-MM-dd hh:mm:ss")}}<br>
			{{# if(d.auditStatus == 3){ }}
				<span  style="color:#999;">审核:</span> {{ Format(d.auditTime, "yyyy-MM-dd hh:mm:ss")}}<br>
			{{# } }}
</script>
<!-- 匹配结果转换 -->
<script type="text/html" id="alipay_matchResultTpl">
	{{# if(d.matchResult == 0){ }}
        	未匹配
    {{# }else if(d.matchResult == 1) { }}
			<span style="color:#1E9FFF">有差价</span>
	{{# }else if(d.matchResult == 2){ }}
            <span style="color:green">无差价</span>
    {{# }else if(d.matchResult == 3){  }}
			<span style="color:#FF5722">无1688单号</span>
	{{# } }}
</script>
 <!-- 表格的数据操作 -->
 <script type="text/html" id="alipay_operateAllTpl"  >
	{{# if(d.auditStatus == 2){ }}
		<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="auditOrder">核单</a> 
	{{# }else if(d.auditStatus == 3){ }}
        <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="auditOrder">再次核单</a>
    {{# }}}

</script>

<script type="text/javascript" src="${ctx}/static/js/financial/alipay/alipayBill.js"></script>