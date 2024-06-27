<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<title>移库报表</title>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="movestock_reportForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label labelSel">
                                    <select name="timeSelection">
                                        <option value="2">生成时间</option>
                                        <option value="1">完成时间</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" name="patchTime" id="movestockReport_patchTime" autocomplete="off" class="layui-input" placeholder='选择日期' readonly lay-verify="required">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                               <label class="layui-form-label">仓库</label>
                               <div class="layui-input-block">
                                    <select id="movestockReport_warehouses"
                                        lay-filter="movestockReport_warehousesFilter"
                                        xm-select="movestockReport_warehouses"
                                        xm-select-search
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                        name="warehouseIds">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">移库类型</label>
                                <div class="layui-input-block">
                                    <select name="transferType" 
                                    id="movestockReport_transferType" 
                                    lay-filter="movestockReport_transferType" 
                                    xm-select="movestockReport_transferType"
                                    xm-select-search 
                                    xm-select-search-type="dl" 
                                    xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">取货人</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="consigneeId">
                                    <div>
                                        <input id="movestockReport_consigneeId" type="text" class="layui-input" placeholder="渐进搜索" name="consigneeName">
                                    </div>
                                    <div class="movestockReport_dimResultDivconsigneeName"></div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">目标通道</label>
                                <div class="layui-input-block">
                                    <input type="text" name="targetAisle" class="layui-input" placeholder="请输入">
                                </div>
                            </div>
                            <input type="hidden" name="limit" value="50">
                            <input type="hidden" name="page" value="1">
                            <div class="layui-col-md1 layui-col-lg1 pl20">
                                <button class="layui-btn layui-btn-sm" type="button" lay-submit id="movestock_reportSearch" lay-filter="movestock_reportSearch">查询</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" >清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-tab">
                    <div class="layui-card-header dis_flex">
                        <ul class="layui-tab-title" style="margin: 0px;display: inline-grid;" >
                            <li class="layui-this" tab_type="1" >数量(<span id="movestock_reportCount"></span>)</li>
                        </ul>
                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="movestockReport_export" style="float:right; margin-top:5px;">导出</span>
                    </div>
                    <div class="layui-tab-content" style="padding-top: 0px;">
                        <div class="layui-tab-item layui-show">
                            <table class="layui-table" id="movestock_reportTable" lay-filter="movestock_reportTable" style="margin: 0px;"></table>
                            <div id="movestock_reportPage"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    layui.use(["admin", "layer", "table", "form", "laypage", "laydate", "element", "formSelects"], function () {
    var layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laypage = layui.laypage,
        formSelects = layui.formSelects,
        laydate = layui.laydate;

        form.render('select');

        laydate.render({
        elem: '#movestock_reportForm #movestockReport_patchTime',
        type: 'datetime',
        inputAuto: true,
        range:true,
        showShortcuts: true,
        });
        //渲染移库取货
        commonReturnPromise({
            url: '/lms/tranOrder/getTranBizDict.html',
            params: {
                headCode: "MOVE_TRANSFER_TYPE"
            }
        }).then(res => {
            commonRenderSelect('movestockReport_transferType', res, {
                name: 'name',
                code: 'id'
            }).then(()=> {
                formSelects.render('movestockReport_transferType');
            });
        });

        //仓库渲染
        commonReturnPromise({
            url: '/lms/prodWarehouse/getAuthedProdWarehouse.html'
        }).then(res => {
            commonRenderSelect('movestockReport_warehouses', res, {
                str: '',
                name: 'warehouseName',
                code: 'id',
            }).then(() => {
                formSelects.render('movestockReport_warehouses'); //刷新select选择框渲染
            });
        });
        //取货人渐进搜索
        // var movestockReport_consigneeId = new DimSearch('#movestockReport_consigneeId', 'consigneeId',
        //     {
        //         url:'/skuLocationTransfer/getConsigneeUserList.html',
        //         type:'get',
        //         query:'search',
        //         label:'userName',
        //         isIncludeData:true,
        //         name:'.movestockReport_dimResultDivconsigneeName'
        //     }
        // );
        // movestockReport_consigneeId.init();


        form.on('submit(movestock_reportSearch)',function(obj){
            var data = obj.field
            if(data.patchTime){
                [startTime,endTime] = data.patchTime.split(' - ')
                data.startTime = startTime
                data.endTime = endTime
            }
            delete data.patchTime;
            data.warehouseIds = data.warehouseIds ? data.warehouseIds.split(',') : [];
            data.transferTypeList = data.transferType? data.transferType.split(','): [];
            delete data.transferType;
            data.consigneeNameList = data.consigneeName ? data.consigneeName.split(',').filter(Boolean) : [];
            delete data.consigneeName;
            getMoveStock_Report(data);
        });

        function getMoveStock_Report(data){
            initAjax('/skuLocationTransfer/analysis.html','post',JSON.stringify(data),function(returnData){
                movestock_reportTablerender(returnData.data)
                movestock_reportpage(returnData.count,data.page,data.limit)
                $('#movestock_reportCount').text(returnData.count)
            })
        }

        function movestock_reportTablerender(data){
            layui.table.render({
            elem: "#movestock_reportTable",
            data:data,
            id: 'movestock_reportTable',
            height: 'full-240',
            cols: [
                [
                    { title: "批次号", field: 'batchNumber' },
                    {title: '仓库', field: 'warehouseName'},
                    { title: "移库类型", field: 'headName' },
                    { title: "目标通道", field: 'targetAisle' },
                    { title: "批次生成时间",field:"batchTime",templet:'<div>{{Format(d.batchTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 135},
                    { title: "取货完成时间",field:"consigneeTime",templet:'<div>{{Format(d.consigneeTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 135},
                    { title: "批次生成人", field: 'batchUserName' },
                    { title: "取货人", field: 'consigneeName' },
                    { title: "批次SKU总个数", field: 'skuTotal' },
                    { title: "缺货SKU个数", field: 'outSkuTotal' },
                    { title: "可取SKU个数", field: 'skuNumber' },
                    { title: "取货已完成SKU个数", field: 'moveSkuNumber' },
                    { title: "取货完成比例", field: 'finishRatio',templet:'<div>{{typeof d.finishRatio !=="undifined"?d.finishRatio+"%":""}}</div>'},
                    { title: "上架已完成SKU个数", field: 'shelfSkuTotal' },
                    { title: "上架完成比例", field: 'shelfFinishRatio',templet:'<div>{{ d.shelfFinishRatio ?d.shelfFinishRatio+"%":""}}</div>'},
                ]
            ],
            page: false,
            done: function(res) { 
            },
            limit: 300,
        });
        }

        function movestock_reportpage(count, current, limit) {
            laypage.render({
                elem: 'movestock_reportPage',
                curr: current,
                limit: limit,
                limits: [50, 100, 150],
                layout: ['prev', 'page', 'next', 'limit'],
                count: count,
                jump: function(obj, first) {
                    $('#movestock_reportForm input[name="limit"]').val(obj.limit);
                    $('#movestock_reportForm input[name="page"]').val(obj.curr);
                    //首次不执行
                    if (!first) {
                        var data = getFormReqObj("movestock_search_form");
                        data.page = obj.curr;
                        data.limit = obj.limit;
                        $('#movestock_reportSearch').click()
                    }
                }
            });
        }

        function getFormReqObj(formIdName) { //获取表单参数
            var d = {};
            var t = $('#' + formIdName + ' [name]').serializeArray();
            $.each(t, function() {
                d[this.name] = this.value;
            });
            return d;
        }

        function initAjax(url, method, data, func, contentType, showLoading) {
            //默认loading
            if (!showLoading) {
                loading.show()
            }
            $.ajax({
                type: method,
                url: ctx + url,
                dataType: 'json',
                async: true,
                data: data,
                contentType: contentType || 'application/json',
                success: function(returnData) {
                    loading.hide()
                    if (returnData.code == "0000") {
                        func(returnData)
                    } else if(returnData.code == "0001"){
                        layer.alert(returnData.msg, { icon: 2 });
                    }else {
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
                }
            });
        }

        //导出功能渲染
        movestock_reportExport();
        function movestock_reportExport(){
            $('#movestockReport_export').on('click', function(){
                let data = serializeObject($('#movestock_reportForm'));
                if(!data.patchTime){
                    return layer.msg('必须选择时间', {icon:2});
                }
                if(data.patchTime){
                    [startTime,endTime] = data.patchTime.split(' - ')
                    data.startTime = startTime
                    data.endTime = endTime
                }
                delete data.patchTime;
                data.warehouseIds = data.warehouseIds ? data.warehouseIds.split(',') : [];
                data.transferTypeList = data.transferType?data.transferType.split(',') : [];
                transBlob({
                    url: '/lms/skuLocationTransfer/exportSkuLocationTransferInfoByDto.html',
                    formData: JSON.stringify(data),
                    fileName: `移库报表`,
                    contentType: 'application/json'
                }).then(function (result) {
                    loading.hide();
                }).catch(function (err) {
                    layer.msg(err, { icon: 2 });
                });
            });
        }


    })

    var nowdate = new Date(new Date().toLocaleDateString()).getTime();
    var endDate = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss');
    var onemonth = Format(new Date(nowdate - 60 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss');
    $('#movestockReport_patchTime').val(onemonth + ' - ' + endDate);
</script>