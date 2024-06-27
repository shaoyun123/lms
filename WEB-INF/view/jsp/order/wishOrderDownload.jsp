<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>Wish订单下载</title>
<div class="layui-fluid" id="LAY-order-wishOrderDownload">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="orderSearchForm" lay-filter="order_form" class="layui-form">
                         <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺id</label>
                                <div class="layui-input-block">
                                    <input type="text" name="storeAcctId" class="layui-input" autocomplete="off">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">任务状态</label>
                                <div class="layui-input-block">
                                    <select name="wishStatus" id="wishStatus" lay-filter="wishStatus">
                                   <option value=''>无<option>
                                    <option value='1'>生成中<option>
                                    <option value='2'>已生成<option>
                                    <option value='3'>已处理<option>
                                    <option value='4'>处理失败<option>
                                </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">普源合并状态</label>
                                <div class="layui-input-block">
                                    <select name="allrootStatus" id="allrootStatus" lay-filter="allrootStatus">
                                        <option value=''>无<option>
	                                    <option value='1'>未处理<option>
	                                    <option value='2'>已处理<option>
	                                    <option value='4'>处理失败<option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md5 layui-col-lg5 pl20">
                                <button id="refund_searchBtn" data-type="reload" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                <button type="button" id="getChangeOrders" class="layui-btn layui-btn-normal layui-btn-sm">定时更新订单信息测试按钮</button>
                                <button type="button" id="batchGetJobStatus" class="layui-btn layui-btn-normal layui-btn-sm">继续处理jobId</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
               
            <div class="layui-card" id="wishOrderDownloadCard">
                <div class="layui-card-body">
                    <table class="layui-table" lay-filter="order_tablefilter" id="order_table1"></table>
                    <script type="text/html" id="jobStatTpl">
                        {{# if(d.jobStatus != null){ }}
                            {{# if(d.jobStatus == '1'){ }}
                          	<span style="color:orange">生成中</span>
							 {{# }else if(d.jobStatus == '2'){ }}
								<span style="color:green">已生成</span>
							{{# }else if(d.jobStatus == '3'){ }}
								<span style="color:blue">已处理</span>
							{{# }else if(d.jobStatus == '4'){ }}
								<span style="color:red">处理失败</span>
                            {{#  } }}
                        {{# } }}
                    </script>
                    <script type="text/html" id="handleStatTpl">
                        {{# if(d.handleStatus != null){ }}
                            {{# if(d.handleStatus == '1'){ }}
                          	<span style="color:orange">未处理</span>
							 {{# }else if(d.handleStatus == '2'){ }}
								<span style="color:blue">已处理</span>
							{{# }else if(d.handleStatus == '4'){ }}
								<span style="color:red">处理失败</span>
                            {{#  } }}
                        {{# } }}
                    </script>
                    <script type="text/html" id="seafileDownloadLink">
                    {{# if(d.downloadLink != undefined){ }}
                        <span class="pora copySpan">
                            <a href="javascript:;">{{ d.downloadLink }}</a>
                            <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" onclick="layui.admin.copyTxt(this)">复制</button>
                        </span>
                    {{# } }}
                    </script>
                </div>
            </div>               
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/order/wishOrderDownload.js"></script>
