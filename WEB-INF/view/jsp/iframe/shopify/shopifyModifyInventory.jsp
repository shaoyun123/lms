<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>shopify库存管理</title>
<style>
    .pl_110{
        padding-left:110px;
    }
    .ml_0{
        margin-left: 0;
    }
    .dis_flex{
        display: flex;
        justify-content: space-between;
    }

    #LAY-shopify-inventory .layui-card-body form{
        padding: 10px 0 !important;
        border-bottom: 1px solid #e6e6e6 !important;
    }

    #LAY-shopify-inventory .layui-form [lay-ignore] {
     display: none !important; 
}
    .pl_10{
        padding-left: 10px;
    }
</style>
<div class="layui-fluid" id="LAY-shopify-inventory">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form id="shopifyModifyStore" lay-filter="inventoryForm" class="layui-form">
                                <div class="layui-form-item" style="margin-bottom:0">
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label">商品SKU</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="sSkuList" class="layui-input" style="width:200px" placeholder="默认模糊查询">
                                        </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1">
                                            <select id="shopify_modifyStock_sskuSearchType">
                                                <option value="0">模糊</option>
                                                <option value="1">精确</option>
                                            </select>
                                    </div>
                                     <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select name="orgId" lay-filter="orgs_hp_shopifyModifyStore" class="orgs_hp_custom" lay-search=""><option value="">请选择</option></select>
                                           </div>
                                    </div>
                                     <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">销售人员</label>
                                        <div class="layui-input-block">
                                               <select name="saleName"  class="users_hp_custom" data-rolelist="shopify专员" lay-filter="users_hp_shopifyModifyStore" lay-search>
                                                   <option value="">请选择</option>
                                               </select>
                                         </div>
                                    </div>
                                     <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block" lay-filter="component-form-element">
                                                <select id="shopify_modifystock_store_sel" lay-search lay-filter="shopify_online_store_sel"   class="store_hp_custom" data-platcode="shopify">
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1" style="text-align:right">
                                          <button class="layui-btn ml20 layui-btn-sm layui-btn-normal" type="button" data-type="reload" id="shopify_inventoryBtn">查询</button>
                                    </div>
                                </div>                          
                                <div id="shopifyModInventoryCustomsContent"></div>
                        
                        </form>
                        <form id="applyForm" class="layui-form">
                                <div class="layui-form-item" style="margin-bottom:0">
                                    <div class="layui-col-md4 layui-col-lg4 pl_110">
                                        <input type="radio" name="apply" value="0" title="按现有库存量" checked style="margin:0" lay-filter="apply">
                                        <label style="display:inline-block;margin:6px 10px 0 0">增加</label>
                                        <input type="number" class="layui-input" style="width:80px;display: inline;" id="shopify_in_addinvntory">
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4 pl_110">
                                            <input type="radio" name="apply" value="1" title="直接修改库存" lay-filter="apply" >
                                            <input type="number" class="layui-input" style="width:80px;display: inline;"disabled id="shopify_in_adjustto" min="0">
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4 pl_110" style="text-align:right">
                                            <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" type="button"  lay-submit id="shopify_in_applyBtn" lay-filter="shopify_in_applyBtn">应用</button>
                                    </div>
                                </div>
                        </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="dis_flex pl_10">
                         <div>
                            <div class="numCount" title="数量">数量(<span id="num_span_shopify"></span>)</div>
                        </div>
                        <div class="layui-form">
                            <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" id="shopify_upadateMainStock">批量修改</button>
                        </div>
                    </div>
                        <div class="layui-tab-content">
                            <table class="layui-table" id="shopify_inventory_table" lay-filter="shopify_inventory_table"></table>
                            <script type="text/html" id="shopify_isPromotion">
                                {{# if(d.isPromotion){ }}
                                是
                                {{# }else{ }}
                                否
                                {{# } }}
                            </script>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
<table id="shopify_online_hide_table" style="display: none;"></table>
<script type="text/html" id="new_stock">
    <input type="text" class="layui-input" style="height:28px" name="new_stock" >
</script>
<script type="text/html" id="shopifyOnline_stock_manage">
    <div class="layui-form"><input type="checkbox" lay-skin="primary" /></div>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/shopify/shopifyModifyInventory.js"></script>
