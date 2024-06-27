<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>

<title>车子管理</title>

<div class="layui-fluid" id="LAY-machineManage">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body clearfix">
                    <button class="layui-btn layui-btn-sm layui-btn-normal fr" onclick="printLocationNum()">打印位置号</button>
                    <button class="layui-btn layui-btn-sm layui-btn-normal fr" onclick="addTruckManageData()">新增</button>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <table class="layui-table" id="machineManageTable" lay-filter="machineManageTable"></table>

                    <script type="text/html" id="loadingTypeTemp">
                        {{# if(d.carLoadingType != null){ }}
                        {{# if(d.carLoadingType == '1'){ }}
                        多货装车(其他装车)
                        {{# }else if(d.carLoadingType == '2'){ }}
                        退货装车
                        {{#  }else if(d.carLoadingType == '0'){  }}
                        初始化状态
                        {{#  }else if(d.carLoadingType == '3'){  }}
                        摄影还库(其他装车)
                        {{#  }else if(d.carLoadingType == '4'){  }}
                        寻货还库(其他装车)
                        {{# } }}
                        {{# } }}
                    </script>
                    <script type="text/html" id="statusTemp">
                        {{# if(d.status != null){ }}
                            {{# if(d.status == '1'){ }}
                            装车操作中
                            {{# }else if(d.status == '2'){ }}
                            装车结束
                            {{# }else if(d.status == '3'){ }}
                            上架中
                            {{# }else if(d.status == '5'){ }}
                            退货装车结束
                            {{#  }else if(d.status == '0'){  }}
                            初始化状态
                            {{# } }}
                        {{# } }}
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- 工具栏 -->
<script type="text/html" id="truckManageTool">
    <button class="layui-btn layui-btn-xs" lay-event="truckManage_print">打印</button>
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="truckManage_delete">删除</button>
</script>

<!-- 编辑 -->
<script type="text/html" id="truckManage_addtpl">
    <div class="p20">
        <form action="" class="layui-form">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">车子号</label>
                    <div class="layui-input-inline">
                        <input type="text" class="layui-input" name="carNumber">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">位置数量</label>
                    <div class="layui-input-inline">
                        <input type="number" class="layui-input" name="carPositionNumber">
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- 打印位置号 -->
<script type="text/html" id="truckManage_printLocationtpl">
    <div class="p20">
        <form action="" class="layui-form">
            <div class="layui-form-item">
                <div class="layui-col-lg12 layui-col-md12">
                    <label class="layui-form-label">位置号</label>
                    <div class="layui-input-inline">
                        <input type="number" class="layui-input" name="positionStart" min="0" step="1">
                    </div>
                    <div class="layui-input-inline">
                        <input type="number" class="layui-input" name="positionEnd" min="0" step="1">
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<!--  车子管理展示该车子绑定的SKU明细 -->
<script type="text/html" id="truckManage_carNumber_layer">
    <div class="layui-card">
        <div class="layui-card-body">
            <table class="layui-table" id="truckManage_carNumber_table" lay-filter="truckManage_carNumber_table"></table>
        </div>
    </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
<!-- 表格渲染模板 -->
<script>
    layui.use(['form', 'layer', 'laytpl','table'], function() {
    var form = layui.form,
    laytpl = layui.laytpl,
    table = layui.table
    layer = layui.layer;

    table.on('tool(machineManageTable)',function(obj){
        var data = obj.data
        var event = obj.event
        if(event == "truckManage_delete"){
            layer.confirm("确定删除？", function(result) {
            if (result) {
                delTruck(data.id,function(returnData){
                layer.msg(returnData.msg||'删除成功')
                    truckTableRender()
                    layer.close(index)
            })
            }
        });
        }else if(event == "truckManage_print"){
            var object = {};
            // 20200728
            object.carNumber = data.carNumber;
            if (!object.carNumber || object.carNumber === "") {
                layer.msg('请选择车号!');
                return;
            }
            // 1 --> 代表打印 车子号; 2 --> 代表打印  位置号
            object.printMethodType = 1;
            object.printerName = "10040";
            object.printNumber = 1;
            epeanPrint_plugin_fun(18 ,object);
        }
    })

    window.addTruckManageData = function(){
        layer.open({
                    type: 1,
                    title: '添加',
                    btn: ['添加', '关闭'],
                    area: ['40%', '30%'],
                    content: $('#truckManage_addtpl').html(),
                    success: function(layero, index) {
                        form.render()
                    },
                    yes: function(index, layero) {
                        var carNumber = $(layero).find('input[name="carNumber"]').val()
                        var carPositionNumber = $(layero).find('input[name="carPositionNumber"]').val()
                        addTruck(carNumber,carPositionNumber,function(returnData){
                            layer.msg(returnData.msg||'新增成功')
                            truckTableRender()
                            layer.closeAll()
                        })
                    }
                })
    }

    window.printLocationNum = function(){
        layer.open({
                    type: 1,
                    title: '打印位置号',
                    btn: ['打印', '关闭'],
                    area: ['40%', '20%'],
                    content: $('#truckManage_printLocationtpl').html(),
                    success: function(layero, index) {
                        form.render()
                    },
                    yes: function(index, layero) {
                        var positionStart = $(layero).find('input[name="positionStart"]').val()
                        var positionEnd = $(layero).find('input[name="positionEnd"]').val()
                        var object = {};
                        // 1 --> 代表打印 车子号; 2 --> 代表打印  位置号
                        object.printMethodType = 2;
                        var position = {};
                        position.positionStart = positionStart;
                        position.positionEnd = positionEnd;
                        console.log(position,'position')
                        if (!position.positionStart || !position.positionEnd) {
                            layer.msg('请选择起始位置号!');
                            return;
                        }
                        if(Number(position.positionStart) > Number(position.positionEnd)){
                            layer.msg('起始位置号不能大于结束位置号');
                            return;                           
                        }
                        object.position = position;
                        object.printerName = "10040";
                        object.printNumber = 1;
                        epeanPrint_plugin_fun(18, object);
                    }
                })
    }

    truckTableRender()

    // 删除
    function delTruck(id,func){
        initAjax('/storageCarApi/delete.html','POST',JSON.stringify({id}),function(returnData){
            if(func){
                func(returnData)
            }
        })
    }

    //新增
    function addTruck(carNumber,carPositionNumber,func){
        initAjax('/storageCarApi/insert.html','POST',JSON.stringify({carNumber,carPositionNumber}),function(returnData){
            if(func){
                func(returnData)
            }
        })
    }

    function truckTableRender(){
        initAjax('/storageCarApi/select.html','post',JSON.stringify({}),function(returnData){
            table.render({
                elem: '#machineManageTable',
                method: 'POST',
                data:returnData.data,
                cols: [
                    [
                        { checkbox: true, width: 30 },
                        { title: "车子号", field: "carNumber",templet: d=>{
                            return '<div class="truckManage_carNumber blue" data-carnumber="'+d.carNumber+'">'+d.carNumber+'</div>'
                        } },
                        { title: "位置数量", field: "carPositionNumber"},
                        { title: "创建人", field: "creator" },
                        { title: "类型", field: "carLoadingType", templet: '#loadingTypeTemp' },
                        { title: "状态", field: "status", templet: '#statusTemp' },
                        { title: "使用人", field: "modifier" },
                        { title: "创建时间", templet: "<div>{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}434</div>" },
                        { title: '操作', toolbar: "#truckManageTool", width: 100 }
                    ]
                ],
                page: false,
                limit:Number.MAX_VALUE,
                // limits: [100, 200, 500],
                id: 'machineManageTable',
                done: function(res) {
                    $('#LAY-machineManage').find('.truckManage_carNumber').click(function(){
                        viewSkuInfo($(this).data('carnumber'))
                    })
                }
            })
        })
    }

    function viewSkuInfo(carNumber){
        commonReturnPromise({
            url: '/lms/storageCarApi/get/'+carNumber
        }).then(res=>{
            layer.open({
            type: 1,
            title: 'SKU明细',
            id:'warehousedashboardOA_taskTypeName_batchProcess_layer',
            shadeClose: true,
            area: ['800px', '600px'],
            content: $('#truckManage_carNumber_layer').html(),
            success: function () {
                table.render({
                    elem: '#truckManage_carNumber_table',
                    data:res,
                    cols: [[
                        {field: 'sku', title: 'SKU' },
                        {field: 'locationCode', title: '库位' },
                        {field: 'scanNumber', title: '数量' },
                        {field: 'creator', title: '装车人' },
                    ]],
                    page: false,
                    limit: 99999,
                })
            }
        })
        })
    }

    function initAjax(url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            beforeSend: function(returnData) {
                if (func2) {
                    func2(returnData)
                }
            },
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
                if (func3) {
                    func3(returnData)
                }
            }
        })
    }
    })
</script>