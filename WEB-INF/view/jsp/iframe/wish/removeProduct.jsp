<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>wish移除商品</title>
<style>
#LAY_adjustPriceProcess .layui-form-label{
   padding: 8px 5px;
}
#LAY_adjustPriceProcess .layui-form-item .layui-inline {
    margin-right: 0; 
}
.dis_flex{
    display: flex;
    justify-content: space-between;
}
.w_100{
    width:100px;
}
.w_90{
    width:90%;
}
.ml_0{
    margin-left: 0 !important;
}
.mt_5{
    margin-bottom: 5px !important;
}
#LAY_adjustPriceProcess .layui-form{
    margin: 0 10px;
}
#LAY_adjustPriceProcess .layui-form-checkbox span{
    line-height: inherit;
}

#LAY_adjustPriceProcess .layui-form-checkbox{
    line-height: 30px !important;
}

.numCount {
    border: 1px solid #e8e8e8;
    border-bottom: none;
    display:inline-block;
    padding:0 5px;
    text-align: center;
    line-height: 30px;
}
.mg_10{
    margin:0 10px;
}
#LAY_adjustPriceProcess .layui-input-block{
    margin-left: 70px !important;
}

#LAY_adjustPriceProcess .layui-form-label{
    width: 60px !important;
}
#LAY_adjustPriceProcess .layui-btn-sm{
    padding: 0 5px !important;
}
</style>

<div class="layui-fluid" id="LAY_adjustPriceProcess">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
          <div class="layui-card">
                <div class="layui-card-body">
                    <form id="removeProdSearchForm" lay-filter="prod_search_form" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" name="sSkuList" class="layui-input" placeholder="默认模糊查询">
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select id="wish_idEnable_skuSearchType">
                                    <option value="0">模糊</option>
                                    <option value="1">精确</option>
                                </select>
                            </div>

                              <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
	                                	<select placeholder="" name="storeAcct" id="wishOnlineDel_depart_sel" lay-search lay-filter="wishOnlineDel_depart_sel" class="orgs_hp_custom"></select>
                               	</div>
                            </div>
                             <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
	                                	<select placeholder="" name="saleName" id="wish_salesman_sel" lay-search lay-filter="wish_salesman_sel" class="users_hp_custom" data-rolelist="wish专员" ></select>
                             	</div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block" lay-filter="component-form-element">
                                        <select id="wish_removeProd_store_sel"  name="storeList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"  class="store_hp_custom" data-platcode="wish">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                             <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-block">
	                                <select name="is_sale_p" id="is_sale_p">
                                        <option value='' selected>全部<option>
	                                    <option value='1'>上架中<option>
	                                    <option value='0'>已下架<option>
	                                </select>
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1"  style="text-align: right;">
                                        <button class="layui-btn layui-btn-sm mt_5 keyHandle" type="button" data-type="reload" id="removeProdSearchBtn">搜索</button>
                                        <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm  mt_5 ml_0" id="removeProdResetBtn">清空</button>
                            </div>
                        </div>                         
                        <div id="wishRemoveProductCustomsContent"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                上架商品不能移除，需先下架。
                <div class="dis_flex layui-card-body">
                <div class="numCount w_100">数量(<span id="tolnum_span_wish_stop"></span>)</div>
                <div class="dis_flex mg_10">
                        <button type="button" id="batchRemoveProd" class="layui-btn layui-btn-normal layui-btn-sm">批量删除</button>
                </div>
               </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="removeProdTable" lay-filter="removeProdTable"></table>
                    <script type="text/html" id="wish_auditStatus">
                        {{# if(d.auditStatus==0){ }}
                        审核中
                        {{# } }}
                        {{# if(d.auditStatus==1){ }}
                        已审核
                        {{# } }}
                        {{# if(d.auditStatus==2){ }}
                        被拒绝
                        {{# } }}
                        {{# if(d.auditStatus==3){ }}
                        已刪除
                        {{# } }}
                    </script>
                    <script type="text/html" id="wish_isPromotion">
                        {{# if(d.isPromotion){ }}
                        是
                        {{# }else{ }}
                        否
                        {{# } }}
                    </script>
                    <script type="text/html" id="wish_isSale">
                          {{# if(d.isSale != null){ }}
                            {{# if(d.isSale == '1'){ }}
                          	<span style="color:blue">上架中</span>
							 {{# }else if(d.isSale == '0'){ }}
								<span style="color:red">已下架</span>
                            {{#  } }}
                        {{# } }}
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/js/publishs/wish/removeProduct.js"></script>
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
			 url: ctx + "/wishIsEnableProduct/getPlatData.html",
			 data: {},
			 async: false,
			 dataType: "json",
			 success: function (returnData) {
				 for(var i=0;i<returnData.length;i++){
					 var a = {name: returnData[i].storeAcct, value:returnData[i].id}
					 platAccts.push(a);
				 }
		    	//属性多选
		      //  select_multi('selectAttr_store',platAccts)
		        formSelects.data('selectAttr_store','local',{arr:platAccts})
			 },
			 error: function () {
				 layer.msg("服务器正忙");
			 }
		 });
    })
</script>