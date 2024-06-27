<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>删除listing</title>
<style> 
  #adjustPriceSearchForm .layui-form-item{
       margin-bottom:0
  }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="adjustPriceSearchForm" class="layui-form">
                        <div class="layui-form-item">
                                <div class="layui-col-md1 layui-col-lg1">
                                    <label class="layui-form-label">商品父SKU</label>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <div class="layui-input-inline">
                                        <input type="text" name="sSkuList" autocomplete="off" class="layui-input" placeholder="默认模糊查询">
                                    </div>
                                </div>
                                <div class="layui-col-md1 layui-col-lg1">
                                    <select id="shopee_stopPublish_skuSearchType" >
                                        <option value="0">模糊</option>
                                        <option value="1">精确</option>
                                    </select>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select  id="shopee_stop_publish_depart_sel" name="orgId" lay-search lay-filter="shopee_stop_publish_depart_sel"  class="orgs_hp_custom">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>

                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">销售人员</label>
                                    <div class="layui-input-block">
                                        <select id="shopee_stop_publish_salesman_sel" lay-search lay-filter="shopee_stop_publish_salesman_sel" class="users_hp_custom" data-rolelist="shopee专员">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-lg3 layui-col-md3">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block" style="font-size: 12px;">
                                        <select id="shopee_stop_publish_store_sel" lay-filter="shopee_stop_publish_store_sel" xm-select="shopee_stop_publish_store_sel" class="users_hp_store_multi" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" data-platcode="shopee"></select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">站点</label>
                                    <div class="layui-input-block">
                                        <select id="shopee_stop_publish_site_sel" lay-filter="shopee_stop_publish_site_sel" xm-select="shopee_stop_publish_site_sel" class="salesSite_hp_custom" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">itemId</label>

                                    <div class="layui-input-inline">
                                        <input type="text" id="shopee_stop_publish_itemid_input" style="width: 254px" name="shopee_stop_publish_itemid_input" autocomplete="off" class="layui-input" placeholder=",分割">
                                    </div>
                                </div>
                            <div class="layui-inline">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="adjustPriceSearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="adjustPriceResetBtn">清空</button>
                            </div>
                            <div style="float:right;margin-top:5px;">
                                <button type="button" id="batchEnableProd" class="layui-btn layui-btn-danger layui-btn-sm">批量删除listing</button>
                            </div>
                        </div>                          
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">数量(<span id="tolnum_span_shopee_stop"></span>)</div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="stopPublishTable" lay-filter="stopPublishTable"></table>
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
<script type="text/javascript" src="${ctx}/static/js/publishs/shopee/stopPublish.js"></script>
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
</script>