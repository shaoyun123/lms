<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>wish库存管理</title>
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
    #LAY-wish-inventory .layui-form-radio{
        margin: 0;
    }
    #LAY-wish-inventory .layui-card-body form{
        padding: 10px 0 !important;
        border-bottom: 1px solid #e6e6e6 !important;
    }

    #LAY-wish-inventory .layui-form [lay-ignore] {
     display: none !important; 
}
    .pl_10{
        padding-left: 10px;
    }
</style>
<div class="layui-fluid" id="LAY-wish-inventory">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form id="wishModifyStore" lay-filter="inventoryForm" class="layui-form">
                                <div class="layui-form-item" style="margin-bottom:0">
                                    <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                        <%--<label class="layui-form-label">商品SKU</label>--%>
                                        <%--<div class="layui-input-block">--%>
                                            <%--<input type="text" name="sSkuList" class="layui-input" style="width:200px" placeholder="默认模糊查询">--%>
                                        <%--</div>--%>
                                    <%--</div>--%>
                                    <%--<div class="layui-col-md1 layui-col-lg1">--%>
                                            <%--<select id="wish_modifyStock_sskuSearchType">--%>
                                                <%--<option value="0">模糊</option>--%>
                                                <%--<option value="1">精确</option>--%>
                                            <%--</select>--%>
                                    <%--</div>--%>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">商品SKU</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="sSkuList" class="layui-input" style="width:200px" placeholder="默认精确查询，且SKU数量不能超过1000个" onblur="handleSku(this.value,event)">
                                            </div>
                                        </div>
                                        <div class="layui-col-md1 layui-col-lg1">
                                            <select id="wish_modifyStock_sskuSearchType">
                                                <option value="1">精确</option>
                                            </select>
                                        </div>
                                     <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">部门</label>
                                        <div class="layui-input-block">
                                            <select name="orgId" lay-filter="orgs_hp_wishModifyStore" class="orgs_hp_custom" lay-search=""><option value="">请选择</option></select>
                                           </div>
                                    </div>
                                     <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">销售人员</label>
                                        <div class="layui-input-block">
                                               <select name="saleName"  class="users_hp_custom" data-rolelist="wish专员" lay-filter="users_hp_wishModifyStore" lay-search>
                                                   <option value="">请选择</option>
                                               </select>
                                         </div>
                                    </div>
                                     <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block" lay-filter="component-form-element">
                                                <select id="wish_modifystock_store_sel" lay-search lay-filter="wish_online_store_sel"   class="store_hp_custom" data-platcode="wish">
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1" style="text-align:right">
                                          <button class="layui-btn ml20 layui-btn-sm layui-btn-normal" type="button" data-type="reload" id="wish_inventoryBtn">查询</button>
                                    </div>
                                </div>                          
                                <div id="wishModInventoryCustomsContent"></div>
                        
                        </form>
                        <form id="applyForm" class="layui-form">
                                <div class="layui-form-item" style="margin-bottom:0">
                                    <div class="layui-col-md4 layui-col-lg4 pl_110">
                                        <input type="radio" name="apply" value="0" title="按现有库存量" checked style="margin:0" lay-filter="apply">
                                        <label style="display:inline-block;margin:6px 10px 0 0">增加</label>
                                        <input type="number" class="layui-input" style="width:80px;display: inline;" id="wish_in_addinvntory">
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4 pl_110">
                                            <input type="radio" name="apply" value="1" title="直接修改库存" lay-filter="apply" >
                                            <input type="number" class="layui-input" style="width:80px;display: inline;"disabled id="wish_in_adjustto" min="0">
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4 pl_110" style="text-align:right">
                                            <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" type="button"  lay-submit id="wish_in_applyBtn" lay-filter="wish_in_applyBtn">应用</button>
                                    </div>
                                </div>
                        </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="dis_flex pl_10">
                         <div>
                            <div class="numCount" title="数量">数量(<span id="num_span_wish"></span>)</div>
                        </div>
                        <div class="layui-form">
                            <input type="checkbox" name="" title="当前数量低于10个处理" checked lay-skin="primary" id="wish_modifyStock_num_id">
                            <input type="checkbox" name="" title="同时应用黄钻产品"  lay-skin="primary" id="wish_modifyStock_isPromotion_id">
                            <button class="layui-btn ml20 layui-btn-sm layui-btn-normal ml_0" id="wish_upadateMainStock">批量修改</button>
                        </div>
                    </div>
                        <div class="layui-tab-content">
                            <table class="layui-table" id="wish_inventory_table" lay-filter="wish_inventory_table"></table>
                            <script type="text/html" id="wish_isPromotion">
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
<table id="wish_online_hide_table" style="display: none;"></table>
<script type="text/html" id="new_stock">
    <input type="text" class="layui-input" style="height:28px" name="adjustprice" >
</script>
<script type="text/html" id="wishOnline_stock_manage">
    <div class="layui-form"><input type="checkbox" lay-skin="primary" /></div>
</script>
<script type="text/javascript" src="${ctx}/static/js/publishs/wish/modifyInventory.js"></script>
<script>
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
        var formSelects = layui.formSelects;
        var platAccts = [];
        // $.ajax({
        //     type: "POST",
        //     url: ctx + "/wishIsEnableProduct/getPlatData.html",
        //     data: {},
        //     async: false,
        //     dataType: "json",
        //     success: function (returnData) {
        //         for(var i=0;i<returnData.length;i++){
        //             var a = {name: returnData[i].storeAcct, value:returnData[i].id}
        //             platAccts.push(a);
        //         }
        //         //属性多选
        //         // select_multi('selectAttr_store',platAccts)
        //         formSelects.data('selectAttr_store','local',{arr:platAccts})
        //     },
        //     error: function () {
        //         layer.msg("服务器正忙");
        //     }
        // });
    })
</script>