<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>修改库存</title>
<style> 
  #adjustPriceSearchForm .layui-form-item{
       margin-bottom:0
  }
  #LAY_adjustPriceProcess .layui-form-label{
      padding: 9px 5px;
  }
  #LAY_adjustPriceProcess .layui-form-item .layui-col-lg2 layui-col-md2 {
      margin-right: 0;
  }
  .mg_10{
      margin:0 10px;
  }
.dis_flex{
    display: flex;
    justify-content: space-between;
}
.numbox{
    border: 1px solid #e8e8e8;
    padding: 0 10px;
    border-bottom: none;
}
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="stopPublishForm" class="layui-form">
                        <div class="layui-form-item">
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                <%--<select id="amazon_stop_searchType_sku">--%>
                                    <%--<option value="0">商品父SKU</option>--%>
                                    <%--<option value="1">商品子SKU</option>--%>
                                <%--</select>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                    <%--<input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认模糊查询">--%>
                                <%--</div>--%>
                            <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                <%--<select id="amazon_stop_searchType">--%>
                                    <%--<option value="0">模糊</option>--%>
                                    <%--<option value="1">精确</option>--%>
                                <%--</select>--%>
                            <%--</div>--%>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select id="amazon_stop_searchType_sku">
                                        <option value="0">商品父SKU</option>
                                        <option value="1">商品子SKU</option>
                                    </select>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select id="amazon_stop_searchType">
                                        <%--<option value="0">模糊</option>--%>
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select  id="amazon_online_depart_sel" lay-search lay-filter="amazon_online_depart_sel"  class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select  lay-search lay-filter="amazon_online_salesman_sel"  class="users_hp_custom" data-rolelist="amazon专员" >
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select xm-select="selectAttr_store" id="amazon_online_store_sel" lay-search lay-filter="amazon_online_store_sel"   class="store_hp_custom" data-platcode="amazon">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="storeListingSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="storeListingResetBtn">清空</button>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" style="text-align: right">
                                
                            </div>
                        </div>                          
                    </form>
                    <form id="applyForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-md4 layui-col-lg4 pl_110">
                                <input type="radio" name="apply" value="0" title="按现有库存" checked style="margin:0" lay-filter="apply">
                                <label style="display:inline-block;margin:6px 10px 0 0">增加</label>
                                <input type="number" class="layui-input" style="width:80px;display: inline;" id="addinvntory">
                            </div>
                            <div class="layui-col-md4 layui-col-lg4 pl_110">
                                <input type="radio" name="apply" value="1" title="直接修改库存" lay-filter="apply" >
                                <input type="number" class="layui-input" style="width:80px;display: inline;"disabled id="adjustto" min="0">
                            </div>
                            <div class="layui-col-md4 layui-col-lg4 pl_110" style="text-align:right">
                                <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" type="button"  lay-submit id="amazonModStock_applyBtn" lay-filter="amazonModStock_applyBtn">应用</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header dis_flex">
                    <div class="numbox">数量(<span id="tolnum_span_amazon_stop"></span>)</div>
                    <button type="button" id="batchEnableProd" class="layui-btn layui-btn-danger layui-btn-sm">批量修改</button>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="stopPublishTable_amazon" lay-filter="stopPublishTable_amazon"></table>
                    <script type="text/html" id="currPriceTpl">
                        <div>{{ d.currPrice }}</div> 
                    </script>
                    <script type="text/html" id="newPriceTpl">
                        <input type="text" class="layui-input" id="newPrice" style="height:28px"   value={{ d.newPrice || '' }}>
                    </script>
                    <script type="text/html" id="saleStatsTpl">
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
<script type="text/javascript" src="${ctx}/static/js/publishs/amazon/stopPublish.js"></script>
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
        formSelects.data('selectAttr_store','local')
    })
</script>
<script type="text/html" id="new_stock">
    <input type="text" class="layui-input" style="height:28px" name="adjustStock" >
</script>