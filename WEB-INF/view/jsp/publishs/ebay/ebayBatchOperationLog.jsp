<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>批量操作日志</title>
<style>
    .pl_110{
        padding-left:110px;
    }   
     .pl_50{
        padding-left:50px;
    }
    .ml_0{
        margin-left: 0;
    }
    .dis_flex{
        display: flex;
        justify-content: space-between;
    }

    #LAY-wish-batchoperation .layui-form-radio{
        margin: 0;
    }
    .w_50{
        width: 50% !important;
    }
    .W_60{
        width: 60% !important;
    }
    .dis_inline{
        display: inline-block;
    }
    .border_none{
        border:none !important;
    }
    .hide{
        display: none;
    }

    .layui-textarea{
       min-height:200px;
    }

    .icon_group i{
        color: #ccc;
        line-height: 20px;
        cursor:pointer;
    }

    .pl_10{
        padding-left: 10px;
    }

    #LAY-wish-batchoperation .layui-card-body form{
        padding: 10px 0 !important;
        border-bottom: 1px solid #e6e6e6 !important;
    }
</style>
<div class="layui-fluid" id="LAY-wish-batchoperation">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form id="batchoperationForm" lay-filter="batchoperationForm" class="layui-form">
                                <div class="layui-form-item" style="margin-bottom:0">
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">店铺</label>
                                        <div class="layui-input-block" lay-filter="component-form-element">
                                            <select class="ebay_selectAttr_store"  name="storeList" lay-search >
                                                <option value="">请选择</option>
                                            </select>
                                        </div>
                                    </div>
                                     <div class="layui-col-md2 layui-col-lg2">
                                         <label class="layui-form-label">操作人</label>
                                         <div class="layui-input-block">
                                             <select name=""  class="ebay_creator" data-rolelist="" lay-filter="" lay-search="">
                                                 <option value="">请选择</option>
                                             </select>
                                         </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">任务名称</label>
                                            <div class="layui-input-block">
                                                <select name=""  class="wish_oper_type" data-rolelist="" lay-filter="" lay-search="">
                                                    <option value="">请选择</option>
                                                    <option value="1">调价</option>
                                                    <option value="2">调整库存</option>
                                                    <option value="3">终止刊登</option>
                                                    <option value="4">侵权处理</option>
                                                    <option value="5">修改主标题</option>
                                                    <option value="6">修改副标题</option>
                                                    <option value="8">应用公共模块</option>
                                                    <option value="标零,补货">定时标零/补货</option>
                                                </select>
                                            </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2"  style="padding-right:20px">
                                            <label class="layui-form-label">时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" id="ebay_log_time" placeholder=" - ">
                                            </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <select name="sSkuList" class="ebay_sku_search">
                                                <option value="1">商品父SKU</option>
                                                <option value="2">商品子SKU</option>
                                                <option value="3">店铺父SKU</option>
                                                <option value="4">店铺子SKU</option>
                                                <option value="5">物品号</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="text" class="layui-input inputBorRadLeft inputBorRadRight" id="ebay_los_searchtype_text">
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                                <select id="ebay_log_pskuSearchType">
                                                    <option value="0">模糊</option>
                                                    <option value="1">精确</option>
                                                </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1  pl20">
                                        <button class="layui-btn layui-btn-sm layui-btn-normal keyHandle" type="button" data-type="reload" id="ebay_batchoperationBtn">查询</button>
                                    </div>
                                </div>                          
                                <div id="ebayBatchOperationLogCustomsContent"></div>
                        </form>
                </div>
            </div>
            <div class="layui-card" id="ebayBatchOperationLogCard">
                <div class="layui-card-header">
                     <span class="numCount" title="数量">数量(<span id="search_log_ebay"></span>)</span>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="ebay_bacthOpt_table" lay-filter="ebay_bacthOpt_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<table id="wish_online_hide_table" style="display: none;"></table>
<script>
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate','table'], function () {
        var formSelects = layui.formSelects,
            laydate = layui.laydate,
            form = layui.form,
            table = layui.table;

        //日期范围
        laydate.render({
            elem: '#ebay_log_time'
            ,range: true
        });
        // console.log(1)
        // 表格渲染
        function tableReload(data) {
            var searchData = data;
            table.render({
                elem: "#ebay_bacthOpt_table",
                method: 'post',
                url: ctx + '/ebayLog/searchLog.html',
                where:searchData,
                cols: [[
                        { type: "checkbox"},
                        { field: "storeName", title: "店铺" ,width:'100'},
                        { field: "SKU", title: "SKU" , templet: '#wish_log_sku',width:'200'},
                        { field: "itemId", title: "物品号",width:'200'},
                        { field: "operType", title: "事件",templet:'#ebay_bacth_log_operation_type',width:'100'},
                        { field: "newData", title: "调整值",width:'600'},
                        { field: "operDesc", title: "处理结果",width:'150'},
                        { field: "createTime", title: "时间", templet: "<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>",width:150},
                        { field: "creator", title: "操作人",width:'100'},
                        { field: "", title: "操作",width:'100'}
                    ]],
                page: true,
                id: "ebay_bacthOpt_table",
                limits: [300, 500, 1000],
                limit: 300,
                done: function(res, curr, count) {
                    if (res.code == '0000') {
                        $("#search_log_ebay").text("共"+count+"条");
                    }
                }
            });
        }
        $("#ebay_batchoperationBtn").click(function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
        var active = {
            reload: function () {
                var data = new Object();
                data.storeAcctId ="";
                data.creator = "";
                data.operType= "";
                data.time = "";
                data.prodPSku = "";
                data.prodSSku = "";
                data.storePSku = "";
                data.storeSSku = "";
                data.itemId = "";
                data.searchType="";
                data.overType = "";

                data.storeAcctId = $(".ebay_selectAttr_store").val();
                data.creator = $(".ebay_creator").val();
                data.operType= $(".wish_oper_type").val();
                if(data.operType == '标零,补货'){
                    data.overType = data.operType;
                    data.operType = -1;
                }else{
                    data.overType = 0;
                }
                data.time = $("#ebay_log_time").val();
                var skuSearchType = $(".ebay_sku_search").val();
                var text = $("#ebay_los_searchtype_text").val();
                if(skuSearchType == 1){
                   data.prodPSku = text;
                }else if(skuSearchType == 2){
                    data.prodSSku = text;
                }else if(skuSearchType == 3){
                    data.storePSku = text;
                }else if(skuSearchType == 4){
                    data.storeSSku = text;
                }else if(skuSearchType == 5){
                    data.itemId = text;
                }
                data.searchType = $("#ebay_log_pskuSearchType").val();//搜索类型
                //执行重载
                tableReload(data);
            }
        }
    })
</script>
<script>
    layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'laydate'], function () {
        var formSelects = layui.formSelects;
        var admin = layui.admin,
            layer = layui.layer,
            $ = layui.$,
            table = layui.table,
            laytpl = layui.laytpl,
            element = layui.element,
            laydate=layui.laydate,
            form = layui.form;
        form.render('select'); //刷新select选择框渲染
        $.ajax({
            type: "POST",
            url: ctx + "/ebayIsEnableProduct/getPlatData.html",
            data: {},
            async: false,
            dataType: "json",
            success: function (returnData) {
                for( var i = 0;i < returnData.length; i++){
                    $(".ebay_selectAttr_store").append("<option value='"+ returnData[i].id+"'>"+ returnData[i].storeAcct+"</option>")
                }
                form.render('select'); //刷新select选择框渲染
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });

        $.ajax({
            type: "POST",
            url: ctx + "/ebayLog/searchLogCreator.html",
            async: false,
            dataType: "json",
            success: function (returnData) {
                for( var i = 0;i < returnData.data.length; i++){
                    $(".ebay_creator").append("<option value='"+ returnData.data[i].creator+"'>"+ returnData.data[i].creator+"</option>")
                }
                form.render('select'); //刷新select选择框渲染
            },
            error:function () {
                layer.msg("服务器正忙");
            }
        })
    })

</script>
<script type="text/html" id="wish_log_sku">
    {{# if(d.prodPSku != null){ }}
    <span  style="color:#999;">商品父SKU:</span>{{d.prodPSku}}<br>
    {{# } }}
    {{# if(d.prodSSku != null){ }}
    <span  style="color:#999;">商品子SKU:</span>{{d.prodSSku}}<br>
    {{# } }}
    {{# if(d.storePSku != null){ }}
    <span  style="color:#999;">店铺父SKU:</span>{{d.storePSku}}<br>
    {{# } }}
    {{# if(d.storeSSku != null){ }}
    <span  style="color:#999;">店铺子SKU:</span>{{d.storeSSku}}<br>
    {{# } }}
</script>
<div class="layui-tab-content">
    <script type="text/html" id="ebay_bacth_log_operation_type">
        {{# if(d.operType==1){ }}
        调价
        {{# } }}
        {{# if(d.operType==2){ }}
        调整库存
        {{# } }}
        {{# if(d.operType==3){ }}
        终止刊登
        {{# } }}
        {{# if(d.operType==4){ }}
        侵权处理
        {{# } }}
        {{# if(d.operType==5){ }}
        修改主标题
        {{# } }}
        {{# if(d.operType==6){ }}
        修改副标题
        {{# } }}
        {{# if(d.operType==7){ }}
        替换橱窗图
        {{# } }}
        {{# if(d.operType==8){ }}
        应用公共模块
        {{# } }}
        {{# if(d.operType== 10){ }}
        定时标零
        {{# } }}
        {{# if(d.operType== 11){ }}
        定时补货
        {{# } }}
    </script>
</div>