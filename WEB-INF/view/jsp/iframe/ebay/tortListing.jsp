<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>侵权listing处理</title>
<style> 
  #adjustPriceSearchForm .layui-form-item{
       margin-bottom:0
  }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" class="layui-form">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">商品父SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认模糊查询">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select id="EBAY_torListing_pskuSearchType">
                                    <option value="0">模糊</option>
                                    <option value="1">精确</option>
                                </select>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectAttr_store"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-block">
	                                <select name="is_offline_tort" id="is_offline_tort">
	                                    <option value='0'>上架中<option>
	                                    <option value='1'>已下架<option>
	                                </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="adjustPriceResetBtn">清空</button>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" style="text-align:right">
                                <button type="button" id="batchEnableProd" class="layui-btn layui-btn-danger layui-btn-sm">批量处理</button>
                            </div>
                        </div>                          
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">数量(<span id="tolnum_span"></span>)    
          <span style="color:blue">&nbsp;&nbsp; &nbsp; &nbsp;处理规则：1. 橱窗图(主辅图)全部替换 成默认图片&nbsp; 2.子sku图片全部移除 &nbsp; 3.标题随机50-70个英文字符  &nbsp;4.描述随机生成三行，每行10-20个英文字符 &nbsp;  5.下架listing</span>  
				</div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="tortListngTable" lay-filter="tortListngTable"></table>
                    <script type="text/html" id="offlineStatsTpl">
                          {{# if(d.isOffline != null){ }}
                            {{# if(d.isOffline == true){ }}
                          	<span style="color:blue">已下架</span>
							 {{# }else if(d.isOffline == false){ }}
								<span style="color:red">上架中</span>
                            {{#  } }}
                        {{# } }}
                    </script>
                    <script type="text/html" id="titleTpl">
    					<a href="javascript:;" lay-event="show_item">{{d.title}}</a>
					</script>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/tortListing.js"></script>
<script>
    //多选渲染函数
    function select_multi(name, arr) {
        var formSelects = layui.formSelects
        formSelects.render({
            name: name, //xm-select的值
            type: 2, //select样式为checkbox
            data: {
                arr: arr,
                name: 'content', //这个对应数组项的属性,如{content: '属性1',value: 'attr1'},name就是content,val就是attr1
                val: 'value'
            }
        })
    }
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
    	var formSelects = layui.formSelects;
    	var platAccts = [];
    	$.ajax({
			 type: "POST",
			 url: ctx + "/ebayIsEnableProduct/getPlatData.html",
			 data: {},
			 async: false,
			 dataType: "json",
			 success: function (returnData) {
				 for(var i=0;i<returnData.length;i++){
					 var a = {name: returnData[i].storeAcct, value:returnData[i].id}
					 platAccts.push(a);
				 }
		    	//属性多选
		       // select_multi('selectAttr_store',platAccts)
			  formSelects.data('selectAttr_store','local',{arr:platAccts})
			 },
			 error: function () {
				 layer.msg("服务器正忙");
			 }
		 });
    })
</script>