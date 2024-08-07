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
                                            <select class="selectAttr_store"  name="storeList" lay-search >
                                                <option value="">请选择</option>
                                            </select>
                                        </div>
                                    </div>
                                     <div class="layui-col-md2 layui-col-lg2">
                                         <label class="layui-form-label">操作人</label>
                                         <div class="layui-input-block">
                                             <select name=""  class="wish_creator" data-rolelist="" lay-filter="" lay-search="">
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
                                                    <option value="2">上架子SKU</option>
                                                    <option value="3">下架子SKU</option>
                                                    <option value="4">上架父SKU</option>
                                                    <option value="5">下架父SKU</option>
                                                    <option value="6">调整库存</option>
                                                    <option value="7">修改标题</option>
                                                    <option value="8">侵权处理</option>
                                                </select>
                                            </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2" style="padding-right:20px">
                                            <label class="layui-form-label">时间</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" id="wish_log_time">
                                            </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <select name="sSkuList" class="whis_sku_search">
                                                <option value="1">商品父SKU</option>
                                                <option value="2">商品子SKU</option>
                                                <option value="3">店铺父SKU</option>
                                                <option value="4">店铺子SKU</option>
                                                <option value="5">产品ID</option>
                                            </select>
                                        </div>
                                        <div class="layui-col-md6 layui-col-lg6">
                                            <input type="text" class="layui-input  inputBorRadLeft  inputBorRadRight"  id="wish_los_searchtype_text">
                                        </div>
                                        <div  class="layui-col-md3 layui-col-lg3">
                                            <select id="wish_log_pskuSearchType">
                                                <option value="0">模糊</option>
                                                <option value="1">精确</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md1 layui-col-lg1 pl20">
                                        <button class="layui-btn layui-btn-sm layui-btn-normal keyHandle" type="button" data-type="reload" id="batchoperationBtn">查询</button>  
                                    </div>
                                </div>                          
                                <div id="wishBatchOperationLogCustomsContent"></div>
                        </form>
                </div>
            </div>
            <div class="layui-card" id="batchOperationLogCard">
                <div class="layui-card-header">
                    <span class="numCount">数量(<span id="search_log_wish"></span>)</span>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="bacthOpt_table" lay-filter="bacthOpt_table"></table>
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
            elem: '#wish_log_time'
            ,range: true
        });
        // 表格渲染
        function tableReload(data) {
            var searchData = data;
            table.render({
                elem: "#bacthOpt_table",
                method: 'post',
                url: ctx + '/wishHandleTrot/searchLog.html',
                where:searchData,
                cols: [
                    [
                        { type: "checkbox"},
                        { field: "storeName", title: "店铺" ,width:'100'},
                        { field: "SKU", title: "SKU" , templet: '#wish_log_sku',width:'200'},
                        { field: "storeProdPId", title: "产品ID",width:'200'},
                        { field: "operType", title: "事件",templet:'#wish_log_operation_type',width:'100'},
                        { field: "newData", title: "调整值",width:'600'},
                        { field: "operDesc", title: "处理结果",width:'150'},
                        { field: "createTime", title: "时间", templet: "<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>",width:150},
                        { field: "creator", title: "操作人",width:'100'},
                        { field: "", title: "操作",width:'100'}

                    ],
                ],
                page: true,
                id: "bacthOpt_table",
                limits: [300, 500, 1000],
                limit: 300,
                done: function(res, curr, count) {
                    if (res.code == '0000') {
                        $("#search_log_wish").text("共"+count+"条");
                    }
                    
                }
            });
        }
        $("#batchoperationBtn").click(function () {
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
                data.prodPId = "";
                data.searchType="";

                data.storeAcctId = $(".selectAttr_store").val();
                data.creator = $(".wish_creator").val();
                data.operType= $(".wish_oper_type").val();
                data.time = $("#wish_log_time").val();
                var skuSearchType = $(".whis_sku_search").val();
                var text = $("#wish_los_searchtype_text").val();
                if(skuSearchType == 1){
                   data.prodPSku = text;
                }else if(skuSearchType == 2){
                    data.prodSSku = text;
                }else if(skuSearchType == 3){
                    data.storePSku = text;
                }else if(skuSearchType == 4){
                    data.storeSSku = text;
                }else if(skuSearchType == 5){
                    data.prodPId = text;
                }
                data.searchType = $("#wish_log_pskuSearchType").val();//搜索类型
                //执行重载
                tableReload(data);
            }
        };
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
        var platAccts = [];
        $.ajax({
            type: "POST",
            url: ctx + "/wishIsEnableProduct/getPlatData.html",
            data: {},
            async: false,
            dataType: "json",
            success: function (returnData) {
                for( var i = 0;i < returnData.length; i++){
                    $(".selectAttr_store").append("<option value='"+ returnData[i].id+"'>"+ returnData[i].storeAcct+"</option>")
                }
                form.render('select'); //刷新select选择框渲染
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });

        $.ajax({
            type: "POST",
            url: ctx + "/wishHandleTrot/searchLogCreator.html",
            async: false,
            dataType: "json",
            success: function (returnData) {
                for( var i = 0;i < returnData.data.length; i++){
                    $(".wish_creator").append("<option value='"+ returnData.data[i].creator+"'>"+ returnData.data[i].creator+"</option>")
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
    <script type="text/html" id="wish_log_operation_type">
        <%-- {{# if(d.id!==-1){ }}--%>
        {{# if(d.operType==1){ }}
        调价
        {{# } }}
        {{# if(d.operType==2){ }}
        上架子SKU
        {{# } }}
        {{# if(d.operType==3){ }}
        下架子SKU
        {{# } }}
        {{# if(d.operType==4){ }}
        上架父SKU
        {{# } }}
        {{# if(d.operType==5){ }}
        下架父SKU
        {{# } }}
        {{# if(d.operType==6){ }}
        调整库存
        {{# } }}
        {{# if(d.operType==7){ }}
        修改标题
        {{# } }}
        {{# if(d.operType==8){ }}
        侵权处理
        {{# } }}
    </script>
</div>