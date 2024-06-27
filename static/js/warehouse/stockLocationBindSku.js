console.log("stockLocationBindSku");
var formSelectsMain ;
layui.use(["admin", "form", "table", "layer", "laytpl", 'element','formSelects'], function () {
        var admin = layui.admin,
            form = layui.form,
            table = layui.table,
            layer = layui.layer,
            laytpl = layui.laytpl,
            element = layui.element,
            formSelects = layui.formSelects;
            formSelectsMain = layui.formSelects;

        $ = layui.$;
        form.render("select");
        form.render("radio");
        form.render("checkbox");
        // formSelects.render('buildNo')
        // formSelects.render('floorNo')
        // // 初始化楼栋和楼层
        // $.ajax({
        //     type: "POST",
        //     url: ctx + "/stockLocationBindSku/getFloorAndBuild",
        //     contentType: 'application/x-www-form-urlencoded',
        //     dataType: 'json',
        //     success: function (returnData) {
        //         if (returnData.code == "0000") {
        //
        //             appendSelect( $("#stockLocationBindSku_form select[_name=buildNo]"), returnData.data.buildNo,  'buildNo')
        //             appendSelect( $("#stockLocationBindSku_form select[_name=floorNo]"), returnData.data.floorNo,  'floorNo')
        //         } else {
        //             layer.msg(returnData.msg);
        //         }
        //     },
        //     error: function () {
        //         layer.msg("服务器正忙");
        //     },
        //     // complete: function () {
        //     //     loading.hide();
        //     // }
        // });
        //初始化操作人
        $.ajax({
            type: "POST",
            url: ctx + "/sysuser/listbyorgid.html",
            contentType: 'application/json',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    $("#stockLocationBindSku_form select[name=bindUserId]").html("<option value=''>请选择</option>");
                    $(returnData.data).each(function () {
                        $("#stockLocationBindSku_form select[name=bindUserId]").append("<option value='" + this.id + "'>" + this.userName + "</option>");
                    });
                    form.render('select');
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
            // complete: function () {
            //     loading.hide();
            // }
        });
        //初始化仓库
        $.ajax({
            type: "POST",
            url: ctx + "/prodWarehouse/getAuthedProdWarehouse.html",
            contentType: 'application/json',
            dataType: 'json',
            success: function (returnData) {
                if (returnData.code == "0000") {
                    $("#stockLocationBindSku_form select[name=warehouseId]").html("");
                    $("#stockLocationBindSku_form select[name=warehouseId]").append('<option value="">请选择</option>');
                    let defaultWarehouseId;
                    $(returnData.data).each(function () {
                        if(this.warehouseName == '义乌仓'){
                            defaultWarehouseId = this.id;
                            $("#stockLocationBindSku_form select[name=warehouseId]").append("<option value='" + this.id + "' selected >" + this.warehouseName + "</option>");
                        }else {
                            $("#stockLocationBindSku_form select[name=warehouseId]").append("<option value='" + this.id + "'>" + this.warehouseName + "</option>");
                        }
                    });
                    render_order_build_floor("#stockLocationBindSku_form",defaultWarehouseId)
                    // $("#stockLocationBindSku_form select[name=warehouseId]").find('option[value=65]').prop('selected', 'true')
                    form.render('select');
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
            complete: function () {
                loading.hide();
            }
        });

        new dropButton('stockLocationBindSku_export');
        new dropButton('stockLocationBindSku_downloadReport');
        new dropButton('stockLocationBindSku_importStatements');

    }
);



//请求需要包含参数,首次获取默认,使用分页控件修改属性,并使用修改后的属性,在页面中搜索,重置为第一页
var stockLocationBindSku_limitAllAppoint = 300;//每页显示数据条数
var stockLocationBindSku_currentPageAllAppoint = 1;//当前页数
var stockLocationBindSku_dataLength = 0;//数据总条数

function stockLocationBindSku_searchProd(notChangePage) {
    if(notChangePage){
        stockLocationBindSku_currentPageAllAppoint=notChangePage;
    }else{
        stockLocationBindSku_currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
    }
    stockLocationBindSku_dataLength = 0;
    stockLocationBindSku_search();
}

//填充下拉框
function appendSelect(aDom, data,selectId) {
    aDom.empty();
    var option = '<option value="">请选择</option>'
    for (var i in data) {
        option += '<option value="' + (data[i]) + '">' + ( data[i]) + '</option>'
    }
    aDom.append(option)
    formSelectsMain.render(selectId)
}


function stockLocationBindSku_toPage() {
    var laypage = layui.laypage;
    //处理分页
    laypage.render({
        elem: 'stockLocationBindSku_pagination',
        count: stockLocationBindSku_dataLength, //数据总数，从服务端得到
        layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
        limits:[300,500,1000, 2000],
        curr:stockLocationBindSku_currentPageAllAppoint,
        limit:stockLocationBindSku_limitAllAppoint,
        jump: function (obj, first) {
            stockLocationBindSku_currentPageAllAppoint = obj.curr;
            stockLocationBindSku_limitAllAppoint = obj.limit;
            //首次不执行
            if (!first) {
                stockLocationBindSku_search()
            }
        }
    });
}





function stockLocationBindSku_search(){
    var form = layui.form,
        laypage = layui.laypage;
    var data=stockLocationBindSku_getSearchData();
    if(!data.warehouseId){
        layer.msg("请选择仓库");
        return;
    }
    var table = layui.table;
    // data.page=stockLocationBindSku_currentPageAllAppoint;
    // data.limit=stockLocationBindSku_limitAllAppoint;
    loading.show();
    table.render({
        elem: "#stockLocationBindSku_table",
        method: "post",
        where: data,
        url: ctx + "/stockLocationBindSku/queryPage.html",
        contentType:"application/json;charset=utf-8",
        cols: [
            [
                { type: "checkbox", width: '3%' },
                { field: "warehouseName", title: "仓库", width: '5%' },
                { field: "regionCode", title: "区域", width: '5%' },
                { field: "locationCode", title: "库位名称", width: '8%' },
                { field: "originalLocationCode", title: "原库位名称", width: '8%' },
                { title: "库位状态", templet: function (d) {
                    let statusStoreTem = '<span style="">:status</span>'
                    if (d.alreadyBindSku) {
                        statusStoreTem = statusStoreTem.replace(':status', '在用')
                    }else {
                        statusStoreTem = statusStoreTem.replace(':status', '空闲')
                        statusStoreTem = statusStoreTem.replace('style=""', 'style="color:red"')
                    }
                    return statusStoreTem
                }, width: '5%' },
                { field: "specName", title: "库位规格", width: '5%' },
                // { field: "utilizationRate", title: "库位使用率", width: '5%' },
                {
                    title: "库位使用率", width: '5%', templet: function (data) {
                        if (data.utilizationRate) {
                            // 判断小数点后位数，小于三位直接返回，大于三位保留三位后返回
                            var arr = data.utilizationRate.toString().split('.')
                            if (arr.length === 2) {
                                let replaceStr = arr[1].length > 3 ? data.utilizationRate.toFixed(3) : data.utilizationRate;
                                return '<span>text</span>'.replace('text', replaceStr)
                            }
                            // 整数直接返回
                            return  '<span>text</span>'.replace('text', data.utilizationRate)
                        }
                        return '<span></span>'
                    }
                },
                { field: "floorNo", title: "楼层", width: '3%'  },
                { field: "buildingNo", title: "楼栋", width: '3%' },
                { field: "pickOrder", title: "拣货顺序", width: '4%' },
                { field: "nearArea", title: "邻近库位", width: '5%' },
                { field: "shelfArea", title: "上架区域", width: '5%' },
                { field: "returnArea", title: "退货区域", width: '5%' },
                { width: '20%',title: `<div style="display: flex;"><div style="flex:1">SKU</div><div style="height:100%;flex:1;border-left:1px solid #e6e6e6;border-right:1px solid #e6e6e6">绑定人</div><div style="flex:1">操作</div></div>`, templet: '#stockLocationBindSku_Mixed_operation'},
                { title: "库位操作", templet: '#stockLocationBindSku_Location_operations', width: '10%' },
                { field: "whStockLocationId", title: "whStockLocationId", width: '5%' },
            ]
        ],
        id: 'stockLocationBindSku_table',
        page: true,
        limit: 300,
        limits: [300,500,1000,2000],
        done:function () {
            $('[data-field="whStockLocationId"]').hide()
        }
    })
    // $.ajax({
    //     url: ctx + '/stockLocationBindSku/queryPage.html',
    //     type:"post",
    //     dataType: "json",
    //     contentType:"application/json;charset=utf-8",
    //     data: JSON.stringify(data),
    //     success: function (returnData) {
    //         stockLocationBindSku_dataLength=returnData.count;
    //         html = template('stockLocationBindSku_tpl', returnData);
    //         $('#stockLocationBindSku_table').html(html);
    //         $('.stockLocationBindSku_table_head table,.stockLocationBindSku_table_body table').css({'width':'100%','margin':0,'table-layout':'fixed'});
    //         $('.stockLocationBindSku_table_head table').addClass('toFixedContain')
    //         form.render('checkbox');
    //         loading.hide();
    //         stockLocationBindSku_toPage();
    //     }
    // });
}

//导入功能
function stocklocationImport(aDom) {
    $('#ationBindSku_bind_import_input').on('change', function () {
        var files = $(this)[0].files;
        var warehouseId = $("#stockLocationBindSku_form select[name=warehouseId]").val();
        if (files.length === 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension !== '.xlsx' && extension !== '.xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件');
            $('#ationBindSku_bind_import_input').val('');
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        formData.append("warehouseId", warehouseId);
        layer.confirm('确认导入这个文件吗?', {
            btn: ['确认', '取消'],
            yes: function (index) {
                $.ajax({
                    url: ctx + "/stockLocationBindSku/importPicker.html",
                    type: 'post',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    beforeSend: function () {
                        loading.show();
                    },
                    dataType: 'json',
                    success: function (res) {
                        layer.closeAll();
                        loading.hide()
                        // 清空 excel
                        $('#ationBindSku_bind_import_input').val('');
                        if (res.code === '0000') {
                            layer.open({
                                title: '导入结果'
                                ,content: "导入成功"
                            });
                        }else {
                            var message = "导入失败-->" + res.msg;
                            layer.open({
                                title: '导入结果'
                                ,content: message
                            });
                        }
                    },
                    error: function (res) {
                        loading.hide()
                        layer.closeAll();
                        var message = "导入失败-->" + res.msg;
                        layer.open({
                            title: '导入失败'
                            ,content: message
                        });
                        $('#ationBindSku_bind_import_input').val('');
                    }
                });
            },
            btn2: function (index) {
                $('#ationBindSku_bind_import').val('');
                layer.close(index);
            }
        });
    });
}

//绑定拣货人
function stockLocationBindSku_bind_picker_fun() {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        table = layui.table,
        form = layui.form;
    
    
    var warehouseId=$("#stockLocationBindSku_form select[name=warehouseId]").val();
    if (!warehouseId || warehouseId == "") {
        layer.msg("请选择仓库!");
        return;
    }
    layer.open({
        type: 1,
        title: '绑定拣货人',
        btn: ['确定', '关闭'],
        area: ['60%', '60%'],
        // content: $("#stockLocationBindSku_bind_picker_script").html(),
        content: $("#stockLocationBindSku_bind_picker_new_script").html(),
        id: 'stockLocationBindSku_bind_picker_new_scriptId',
        yes: function (index, layero) {
            //获取表格所有元素
            var updateItemData = getTbodyElementAndBackAllData("stockLocationBindSku_bind_picker_new_detail_tbody");
            var warehouseId = $('#stockLocationBindSku_bind_picker_store_id').val();
            $.ajax({
                type: "POST",
                url: ctx + "/stockLocationBindSku/updateLocationPreBindPicker.html",
                data: {warehouseId: warehouseId, params: JSON.stringify(updateItemData)},
                async: true,
                dataType: "json",
                success: function (data) {
                    layer.close(index);
                    if (data.code === "0000") {
                        layer.msg("修改库位绑定拣货人成功!");
                    }
                }, error: function (res) {
                    layer.close(index);
                    layer.msg("修改库位绑定拣货人失败！失败原因-->" + res.msg);
                }
            });
        },
        success: function (index, layero) {
            stocklocationImport(index);
            //导出拣货人模板
            $("#action_BindSku_bind_export_tpl").click(function () {
                window.location.href = ctx + '/static/templet/warehouseLocationBindPickerTemplate.xlsx'
            })
            $('#ationBindSku_bind_import').on('click', function () {
                $('#ationBindSku_bind_import_input').click();
            });
            $('#stockLocationBindSku_bind_picker_store_id').val(warehouseId);
            //初始化搜索条件
            commonReturnPromise({
              url: '/lms/stockLocationBindSku/listBindPickerEnum.html',
              params: {
                warehouseId: warehouseId
              }
            }).then(res => {
              let {locationPreList, pickerMapList} = res;
              commonRenderSelect('slbs_locationPres', locationPreList).then(() =>{
                layui.formSelects.render('xm_locationPres');
              });
              commonRenderSelect('slbs_pickerId', pickerMapList, {name: 'name', code: 'value'}).then(()=>{
                layui.form.render('select');
              });
              $('#slbs_bindPickerBtn').on('click', function(){
                let locationPres = layui.formSelects.value('xm_locationPres').map(item => item.val).join(',');
                let pickerId = $('#slbs_pickerId').val();
                commonReturnPromise({
                  type: 'post',
                  url: '/lms/stockLocationBindSku/queryLocationPreBindPicker.html',
                  params: {
                    warehouseId: warehouseId,
                    locationPres: locationPres,
                    pickerId: pickerId
                  }
                }).then(tRes=> {
                    var itemdata = tRes;
                    for(let i=0; i< itemdata.length; i++){
                      let item = itemdata[i];
                      item.userList = pickerMapList;
                    }
                    var formTemplate = stockLocationBindSku_bind_picker_table_detail_tpl.innerHTML;
                    var formDiv = document.getElementById('stockLocationBindSku_bind_picker_new_detail_tbody');
                    laytpl(formTemplate).render(itemdata, function (html) {
                        formDiv.innerHTML = html;
                    });
                });
              });

              //监听设置按钮的点击,渲染和赋值
              $('#stockLocationBindSku_bind_picker_new_detail_tbody').on('click', '.setPicker', function(){
                let $this = $(this);
                let pickerIdArr= $this.parents('td').find('input').val().trim().split(',');
                layer.open({
                  type: 1,
                  title: '设置拣货人',
                  content: $('#picker_itemLocationPreLayer').html(),
                  id: 'picker_itemLocationPreLayerId',
                  area: ['500px', '500px'],
                  btn: ['保存', '关闭'],
                  success: function(){
                    commonRenderSelect('slbs_picker_itemLocationPre', pickerMapList, {name: 'name', code: 'value'}).then(()=> {
                      layui.formSelects.render('picker_itemLocationPre');
                      layui.formSelects.value('picker_itemLocationPre', pickerIdArr);
                    });
                  },
                  yes: function(index){
                    let selectedData = layui.formSelects.value('picker_itemLocationPre');
                    let ids = selectedData.map(item=>item.value).join(',');
                    let names = selectedData.map(item=>item.name).join(',');
                    $this.parents('td').find('input').val(ids);
                    $this.parents('td').find('.picker').text(names);
                    layer.close(index);
                  }
                })
              });
            });
            // $.ajax({
            //     type: "POST",
            //     url: ctx + "/stockLocationBindSku/queryLocationPreBindPicker.html",
            //     data: {warehouseId: warehouseId},
            //     async: true,
            //     dataType: "json",
            //     success: function (data) {
            //         if (data.code === "0000") {
            //             var itemdata = data.data;
            //             var formTemplate = stockLocationBindSku_bind_picker_table_detail_tpl.innerHTML;
            //             var formDiv = document.getElementById('stockLocationBindSku_bind_picker_new_detail_tbody');
            //             laytpl(formTemplate).render(itemdata, function (html) {
            //                 formDiv.innerHTML = html;
            //                 let locationPre = itemdata.map(item => item.locationPre),i=0;
            //                 let oo = setInterval(function () {
            //                     if(i>locationPre.length){
            //                         clearInterval(oo)
            //                     }
            //                     layui.formSelects.render('picker_' + locationPre[i++]);
            //                 }, 10);
            //             });
            //         }
            //     }, error: function () {
            //         layer.msg("查询库位绑定拣货人失败");
            //     }
            // });
        }

    });
}

/**
 * 传入表格id并返回表格元素
 * 字段暂时写死；后面优化
 * @param tableId
 * @returns {[]}
 */
function getTbodyElementAndBackAllData(tableId) {
    var $tbody = $('#' + tableId);
    var $trs = $tbody.find('tr');
    var updateItemData = [];
    for (var i = 0; i < $trs.length; i++) {
        var item = $trs[i];
        var updateTemp = {};
        updateTemp.warehouseName = $.trim($(item).find('td[data-field="warehouseName"]').text());
        updateTemp.locationPre = $.trim($(item).find('td[data-field="locationPre"]').text());
        // updateTemp.pickerId = $.trim($(item).find('td[data-field="pickerId"] select').find("option:selected").val());
        updateTemp.pickerId = $.trim($(item).find('td[data-field="pickerId"] input').val());
        updateTemp.remark = $.trim($(item).find('td[data-field="remark"] input').val());
        updateItemData.push(updateTemp);
    }
    return updateItemData;
}

//新增
$('#stockLocationBindSku_locationAdd').click(function(){
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    var data=stockLocationBindSku_getSearchData();//搜索参数
    data.warehouseName = $("#stockLocationBindSku_form select[name=warehouseId]").find("option:selected").text();
    if(!data.warehouseId){
        layer.msg("请选择仓库");
        return;
    }
    layer.open({
        type: 1,
        title: '新增库位',
        btn: ['确定','关闭'],
        area: ['60%', '60%'],
        content: $("#stockLocationBindSku_locationTpl").html(),
        end:function(index,layero){},
        yes: function(index,layero){
            var req={};
            req.warehouseId=data.warehouseId;
            let messageTip = getAddOrUpdateFormCommonDate(req);
            if (messageTip.trim() !== ""){
                layer.msg(messageTip);
                return;
            }
            var continueDo = $("#stockLocationBindSku_locationForm input[name=continueDo]").is(':checked');
            loading.show();
            $.ajax({
                url: ctx + '/stockLocationBindSku/addOrEditLocationInfo.html',
                type:"post",
                dataType: "json",
                contentType:"application/json;charset=utf-8",
                data: JSON.stringify(req),
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("新增成功");
                        if(continueDo){
                            $("#stockLocationBindSku_locationForm input[name=stockLocation]").val("");
                            $("#stockLocationBindSku_locationForm input[name=stockLocation]").focus();
                            $("#stockLocationBindSku_locationForm input[name=pickOrder]").val("");
                            $("#stockLocationBindSku_locationForm input[name=shelfCode]").val("");
                            $("#stockLocationBindSku_locationForm input[name=buildingNo]").val("");
                            $("#stockLocationBindSku_locationForm input[name=floorNo]").val("");
                            $("#stockLocationBindSku_locationForm input[name=nearArea]").val("");
                        }else{
                            layer.close(index);
                            stockLocationBindSku_searchProd();
                        }
                    } else {
                        layer.msg(returnData.msg, {icon: 5});
                    }
                },
                complete:function () {
                    loading.hide();
                }
            });
        },
        btn2: function(index,layero){
            layer.close(index);
            stockLocationBindSku_searchProd();
        },
        cancel: function(index,layero){
            layer.close(index);
            stockLocationBindSku_searchProd();
        },
        success: function(index,layero) {
            $("#stockLocationBindSku_locationForm input[name=warehouseName]").val( data.warehouseName);
            $("#stockLocationBindSku_locationForm input[name=warehouseId]").val( data.warehouseId);
            form.render("checkbox");
        }
    });
});

//导入库位盘点数据
$('#stockLocationBindSku_location_import_inventory_file').on('change', function () {
    var warehouseId = $("#stockLocationBindSku_form select[name=warehouseId]").val();
    if (!warehouseId) {
        layer.msg("请选择仓库");
        $('#stockLocationBindSku_location_import_inventory_file').val('');
        return
    }
    var files = $('#stockLocationBindSku_location_import_inventory_file')[0].files;
    if (files.length == 0) {
        $('#stockLocationBindSku_location_import_inventory_file').val('');
        return
    }
    // 校验文件类型
    var fileName = files[0].name
    var seat = fileName.lastIndexOf(".");
    var extension = fileName.substring(seat).toLowerCase();
    if (extension != '.xlsx' && extension != '.xls') {
        layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件', {icon: 0})
        return
    }
    var formData = new FormData();
    formData.append("file", files[0]);
    formData.append("warehouseId", warehouseId);
    var data = {};
    data.file = JSON.stringify(files[0]);
    data.warehouseId = warehouseId;
    //TODO: 此处需要修改
    // var Confirmindex = layer.confirm('确认导入改库位盘点数据么？',{btn:['确认','取消']},function (result) {
    //     if(result){
    //         layer.close(Confirmindex );
    //         submitForm(data,ctx + '/stockLocationBindSku/importLocationAndFindGreatLocation.html',"_blank");
    //     }
    // })
    layer.confirm('确认导入改库位盘点数据么', { btn: ['确认', '取消'] },
        function(index) {
            loading.show();
            transBlob({
                url: '/lms/stockLocationBindSku/importLocationAndFindGreatLocation.html',
                formData: formData,
                fileName: '库位管理'
            }).then(function(result){
                loading.hide();
                $('#stockLocationBindSku_location_import_inventory_file').val('');
                layer.close(index);
            }).catch(function(err){
                layer.msg(err,{icon:2});
            });
        },
        function() {
            $('#stockLocationBindSku_location_import_inventory_file').val('');
            layer.closeAll()
        }
    )
});

//编辑
function stockLocationBindSku_locationEdit(warehouseId,whStockLocationId,warehouseName) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    layer.open({
        type: 1,
        title: '编辑库位',
        btn: ['确定', '关闭'],
        area: ['60%', '60%'],
        content: $("#stockLocationBindSku_locationTpl").html(),
        end: function (index, layero) {
        },
        yes: function (index, layero) {
            var req = {};
            req.locationId=whStockLocationId;
            req.warehouseId=$("#stockLocationBindSku_locationForm input[name=warehouseId]").val();
            let messageTip = getAddOrUpdateFormCommonDate(req);
            if (messageTip.trim() !== ""){
                layer.msg(messageTip);
                return;
            }
            loading.show();
            $.ajax({
                url: ctx + '/stockLocationBindSku/addOrEditLocationInfo.html',
                type: "post",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(req),
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("修改成功");
                        layer.close(index);
                        stockLocationBindSku_searchProd();
                    } else {
                        layer.msg(returnData.msg, {icon: 5});
                    }
                },
                complete: function () {
                    loading.hide();
                }
            });
        },
        btn2: function (index, layero) {
            layer.close(index);
            stockLocationBindSku_searchProd();
        },
        cancel: function (index, layero) {
            layer.close(index);
            stockLocationBindSku_searchProd();
        },
        success: function (index, layero) {
            $("#stockLocationBindSku_locationForm input[name=continueDo]").hide();
            $("#stockLocationBindSku_locationForm input[name=warehouseName]").val(warehouseName);
            $("#stockLocationBindSku_locationForm input[name=stockLocation]").attr('readonly','readonly');
            $("#stockLocationBindSku_locationForm input[name=warehouseId]").val(warehouseId);
                $.ajax({
                    url: ctx + '/stockLocationBindSku/getLocationInfoByLocationId.html',
                    type: "get",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data: {"locationId":whStockLocationId},
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            $("#stockLocationBindSku_locationForm input[name=stockLocation]").val(returnData.data.locationCode);
                            $("#stockLocationBindSku_locationForm input[name=pickOrder]").val(returnData.data.pickOrder);
                            $("#stockLocationBindSku_locationForm input[name=regionCode]").val(returnData.data.regionCode);
                            $("#stockLocationBindSku_locationForm input[name=buildingNo]").val(returnData.data.buildingNo);
                            $("#stockLocationBindSku_locationForm input[name=floorNo]").val(returnData.data.floorNo);
                            $("#stockLocationBindSku_locationForm input[name=nearArea]").val(returnData.data.nearArea);
                            // $("#stockLocationBindSku_locationForm input[name=shelfCode]").val(returnData.data.shelfCode);
                            $("#stockLocationBindSku_locationForm input[name=shelfArea]").val(returnData.data.shelfArea);
                            $("#stockLocationBindSku_locationForm input[name=returnArea]").val(returnData.data.returnArea);
                        }
                    },
                    complete: function () {
                        loading.hide();
                    }
                });
        }
    });
}

function getAddOrUpdateFormCommonDate(req) {
    let message = "";
    req.warehouseName = $("#stockLocationBindSku_locationForm input[name=warehouseName]").val();
    if (!req.warehouseName || req.warehouseName.trim() === "") {
        message += "仓库名称不能为空;";
    }
    req.locationCode = $("#stockLocationBindSku_locationForm input[name=stockLocation]").val();
    if (!req.locationCode || req.locationCode.trim() === "") {
        message += "库位不能为空;";
    }
    req.pickOrder = $("#stockLocationBindSku_locationForm input[name=pickOrder]").val();
    if (!req.pickOrder || req.pickOrder.trim() === "") {
        message += "拣货顺序不能为空;";
    }
    // req.shelfCode = $("#stockLocationBindSku_locationForm input[name=shelfCode]").val();
    req.buildingNo = $("#stockLocationBindSku_locationForm input[name=buildingNo]").val();
    if (!req.buildingNo || req.buildingNo.trim() === "") {
        message += "拣货栋号不能为空;";
    }
    req.floorNo = $("#stockLocationBindSku_locationForm input[name=floorNo]").val();
    if (!req.floorNo || req.floorNo.trim() === "") {
        message += "拣货楼层不能为空;";
    }
    req.nearArea = $("#stockLocationBindSku_locationForm input[name=nearArea]").val();
    req.shelfArea = $("#stockLocationBindSku_locationForm input[name=shelfArea]").val();
    if (!req.shelfArea || req.shelfArea.trim() === "") {
        message += "上架区域不能为空;";
    }
    req.returnArea = $('#stockLocationBindSku_locationForm input[name=returnArea]').val();
    if (!req.returnArea || req.returnArea.trim() === ""){
        message += "退货区域不能为空;";
    }
    return message;
}

$('#stockLocationBindSku_locationRemoveBind').click(function(){
    var locaitonData=[];
    //获取库位列表
    var checkedTr=$("#stockLocationBindSku_table").next().find("input[name='layTableCheckbox']:checked");
    var data=stockLocationBindSku_getSearchData();
    if(!data.warehouseId){
        layer.msg("请选择仓库");
        return;
    }
    if (checkedTr.length > 0) {
        for (var i = 0; i < checkedTr.length; i++) {
            locaitonData.push($(checkedTr[i]).parents('tr').find('[data-field="locationCode"]').text());
        }
    }
    if (locaitonData == null || locaitonData.length < 1) {
        layer.msg('请选择要解绑的库位',{icon:0});
        return false;
    }
    layer.confirm("确认批量解除选择的数据的SKU绑定",{btn:['确认','取消']}, function () {
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/stockLocationBindSku/batchRemoveBind.html",
            data: JSON.stringify({locationCodeList: locaitonData, warehouseId: data.warehouseId}),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg);
                    stockLocationBindSku_searchProd();
                } else {
                    layer.msg(returnData.msg, {icon: 5});
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
            complete: function () {
                loading.hide();
            }
        });
    });
});

$('#stockLocationBindSku_exportLocaInfo').click(function(){
    var data=stockLocationBindSku_getSearchData();//搜索参数
    if(!data.warehouseId){
        layer.msg("请选择仓库");
        return;
    }
    data.page=stockLocationBindSku_currentPageAllAppoint;
    data.limit=stockLocationBindSku_limitAllAppoint;
    var locaitonData=[];
    //获取库位列表
    var checkedTr=$("#stockLocationBindSku_table").next().find("input[name='layTableCheckbox']:checked");
    if (checkedTr.length > 0) {
        for (var i = 0; i < checkedTr.length; i++) {
            locaitonData.push($(checkedTr[i]).parents('tr').find('[data-field="locationCode"]').text());
        }
        data.locationCodeList=locaitonData;
    }
    var Confirmindex = layer.confirm('确认导出当前搜索条件下的库位信息？',{btn:['确认','取消']},function (result) {
        if(result){
            layer.close(Confirmindex );
            submitForm(data,ctx + '/stockLocationBindSku/exportWhStockLocaInfo.html',"_blank");
        }
    })
});

$('#stockLocationBindSku_exportSkuInfo').click(function(){
    var data=stockLocationBindSku_getSearchData();//搜索参数
    if(!data.warehouseId){
        layer.msg("请选择仓库");
        return
    }
    data.page=stockLocationBindSku_currentPageAllAppoint;
    data.limit=stockLocationBindSku_limitAllAppoint;
    var locaitonData=[];
    //获取库位列表
    var checkedTr=$("#stockLocationBindSku_table").next().find("input[name='layTableCheckbox']:checked");
    if (checkedTr.length > 0) {
        for (var i = 0; i < checkedTr.length; i++) {
            locaitonData.push($(checkedTr[i]).parents('tr').find('[data-field="locationCode"]').text());
        }
        data.locationCodeList=locaitonData;
    }
    var Confirmindex = layer.confirm('确认导出当前搜索条件下的库位SKU信息？',{btn:['确认','取消']},function (result) {
        if(result){
            layer.close(Confirmindex );
            submitForm(data,ctx + '/stockLocationBindSku/exportWhStockLocaSkuInfo',"_blank");
        }
    })
});

//下载库位模板
$("#stockLocationBindSku_locationTemplate").click(function () {
    window.location.href = ctx + '/static/templet/warehouseLocationTemplate.xlsx'
})
//下载库位模板
$("#stockLocationBindSku_return_areaTemplate").click(function () {
    window.location.href = ctx + '/static/templet/onlyModifyReturnAreaTemplate.xlsx'
})

//下载库位绑定sku模板
$("#stockLocationBindSku_locationBindSkuTemplate").click(function () {
    window.location.href = ctx + '/static/templet/warehouseLocationBindSkuTemplate.xlsx'
})

//下载拣货区域模板
$("#stockLocationBindSku_pickAreaTemplate").click(function () {
    window.location.href = ctx + '/static/templet/warehouseLocationPickAreaTemplate.xlsx'
})

//下载修改库位编号模板
$("#stockLocationBindSku_locationChangeNumTemplate").click(function () {
    window.location.href = ctx + '/static/templet/warehouseLocationChangeNumTemplate.xlsx'
})
//下载修改库位规格模板-ztt-20220630
$("#stockLocationBindSku_locationStandardTemplate").click(function () {
    window.location.href = ctx + '/static/templet/warehouseLocationBindSpec.xlsx'
})

// 导入库位模板
$('#stockLocationBindSku_importLocation_file').on('change', function() {
    var warehouseId=$("#stockLocationBindSku_form select[name=warehouseId]").val();
    if(!warehouseId){
        layer.msg("请选择仓库")
        return
    }
    var warehouseName = $("#stockLocationBindSku_form select[name=warehouseId]").find("option:selected").text();
    var files = $('#stockLocationBindSku_importLocation_file')[0].files
    if (files.length == 0) {
        return
    }
    // 校验文件类型
    var fileName = files[0].name
    var seat = fileName.lastIndexOf(".");
    var extension = fileName.substring(seat).toLowerCase();
    if (extension != '.xlsx' && extension != '.xls') {
        layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件',{icon:0})
        return
    }
    var formData = new FormData();
    formData.append("file", files[0]);
    formData.append("warehourseId",warehouseId);
    formData.append("warehouseName",warehouseName);
    layer.confirm('确认导入模板吗', { btn: ['确认', '取消'] },
        function() {
            loading.show()
            $.ajax({
                url: ctx + '/stockLocationBindSku/importLocationTemplate.html',
                type: 'POST',
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function(returnData) {
                    loading.hide()
                    $('#stockLocationBindSku_importLocation_file').val('')
                    // returnData = JSON.parse(returnData)
                    if (returnData.code == '0000') {
                        layer.msg('导入进程结束',{icon:1});
                        stockLocationBindSku_search();
                    } else {
                        layer.msg(returnData.msg,{icon:2});
                    }
                },
                error: function() {
                    loading.hide()
                    $('#stockLocationBindSku_importLocation_file').val('')
                }
            });
        },
        function() {
            $('#stockLocationBindSku_importLocation_file').val('');
            layer.closeAll()
        }
    )
});
//导入库位绑定sku模板
$('#stockLocationBindSku_importLocationBindSku_file').on('change', function() {
    var warehouseId=$("#stockLocationBindSku_form select[name=warehouseId]").val();
    if(!warehouseId){
        layer.msg("请选择仓库")
        return
    }
    var warehouseName = $("#stockLocationBindSku_form select[name=warehouseId]").find("option:selected").text();
    var files = $('#stockLocationBindSku_importLocationBindSku_file')[0].files
    if (files.length == 0) {
        return
    }
    // 校验文件类型
    var fileName = files[0].name
    var seat = fileName.lastIndexOf(".");
    var extension = fileName.substring(seat).toLowerCase();
    if (extension != '.xlsx' && extension != '.xls') {
        layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件',{icon:0})
        return
    }
    var formData = new FormData();
    formData.append("file", files[0]);
    formData.append("warehourseId",warehouseId);
    formData.append("warehouseName",warehouseName);
    formData.append("excelSize", 10000);
    layer.confirm('确认导入模板吗', { btn: ['确认', '取消'] },
        function() {
            loading.show()
            $.ajax({
                url: ctx + '/stockLocationBindSku/importLocationBindSkuTemplate.html',
                type: 'POST',
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function(returnData) {
                    loading.hide()
                    $('#stockLocationBindSku_importLocationBindSku_file').val('')
                    // returnData = JSON.parse(returnData)
                    if (returnData.code == '0000') {
                        layer.msg('导入进程结束',{icon:1});
                        stockLocationBindSku_search();
                    } else {
                        layer.msg(returnData.msg,{icon:2});
                    }
                },
                error: function() {
                    loading.hide()
                    $('#stockLocationBindSku_importLocationBindSku_file').val('')
                }
            });
        },
        function() {
            $('#stockLocationBindSku_importLocationBindSku_file').val('');
            layer.closeAll()
        }
    )
});

/*导入拣货区域*/
$('#stockLocationBindSku_importPickArea_file').on('change', function() {
    var warehouseId=$("#stockLocationBindSku_form select[name=warehouseId]").val();
    if(!warehouseId){
        layer.msg("请选择仓库")
        return
    }
    var warehouseName = $("#stockLocationBindSku_form select[name=warehouseId]").find("option:selected").text();
    var files = $('#stockLocationBindSku_importPickArea_file')[0].files
    if (files.length == 0) {
        return
    }
    // 校验文件类型
    var fileName = files[0].name
    var seat = fileName.lastIndexOf(".");
    var extension = fileName.substring(seat).toLowerCase();
    if (extension != '.xlsx' && extension != '.xls') {
        layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件',{icon:0})
        return
    }
    var formData = new FormData();
    formData.append("file", files[0]);
    formData.append("warehourseId",warehouseId);
    formData.append("warehouseName",warehouseName);
    layer.confirm('确认导入模板吗', { btn: ['确认', '取消'] },
        function() {
            loading.show()
            $.ajax({
                url: ctx + '/stockLocationBindSku/importLocationPickAreaTemplate.html',
                type: 'POST',
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function(returnData) {
                    loading.hide()
                    $('#stockLocationBindSku_importPickArea_file').val('')
                    // returnData = JSON.parse(returnData)
                    if (returnData.code == '0000') {
                        layer.msg('导入进程结束',{icon:1});
                        stockLocationBindSku_search();
                    } else {
                        // layer.msg(returnData.msg,{icon:5,time:10000,shift: 6});
                        layer.confirm(returnData.msg, { btn: ['已知晓', '关闭'] });
                    }
                },
                error: function() {
                    loading.hide()
                    $('#stockLocationBindSku_importPickArea_file').val('')
                }
            });
        },
        function() {
            $('#stockLocationBindSku_importLocationBindSku_file').val('');
            layer.closeAll()
        }
    )
});


/**
 * 导入退货区域
 */
$('#stockLocationBindSku_import_return_area_file').on('change',function(){
    var warehouseId = $("#stockLocationBindSku_form select[name=warehouseId]").val();
    if (!warehouseId) {
        layer.msg("请选择仓库");
        $('#stockLocationBindSku_import_return_area_file').val('');
        return;
    }
    console.log("============");
    var files = $('#stockLocationBindSku_import_return_area_file')[0].files
    if (files.length === 0) {
        return
    }
    // 校验文件类型
    var fileName = files[0].name
    var seat = fileName.lastIndexOf(".");
    var extension = fileName.substring(seat).toLowerCase();
    if (extension !== '.xlsx' && extension !== '.xls') {
        layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件', {icon: 0})
        return;
    }
    var formData = new FormData();
    formData.append("file", files[0]);
    formData.append("warehouseId",warehouseId);
    layer.confirm('确认导入模板吗', { btn: ['确认', '取消'] },
        function() {
            loading.show()
            $.ajax({
                url: ctx + '/stockLocationBindSku/importReturnArea.html',
                type: 'POST',
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function(returnData) {
                    loading.hide()
                    $('#stockLocationBindSku_import_return_area_file').val('')
                    if (returnData.code === '0000') {
                        layer.confirm(returnData.msg, { btn: ['确认', '取消'] });
                        stockLocationBindSku_search();
                    } else {
                        layer.msg(returnData.msg,{icon:2});
                    }
                },
                error: function() {
                    loading.hide()
                    $('#stockLocationBindSku_import_return_area_file').val('')
                }
            });
        },
        function() {
            $('#stockLocationBindSku_import_return_area_file').val('');
            layer.closeAll()
        }
    )
});

//导入修改库位编号模板
$('#stockLocationBindSku_importLocationChangeNum_file').on('change', function() {
    var warehouseId=$("#stockLocationBindSku_form select[name=warehouseId]").val();
    if(!warehouseId){
        layer.msg("请选择仓库")
        return
    }
    var warehouseName = $("#stockLocationBindSku_form select[name=warehouseId]").find("option:selected").text();
    var files = $('#stockLocationBindSku_importLocationChangeNum_file')[0].files
    if (files.length == 0) {
        return
    }
    // 校验文件类型
    var fileName = files[0].name
    var seat = fileName.lastIndexOf(".");
    var extension = fileName.substring(seat).toLowerCase();
    if (extension != '.xlsx' && extension != '.xls') {
        layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件',{icon:0})
        return
    }
    var formData = new FormData();
    formData.append("file", files[0]);
    formData.append("warehourseId",warehouseId);
    formData.append("warehouseName",warehouseName);
    layer.confirm('确认导入模板吗', { btn: ['确认', '取消'] },
        function() {
            loading.show()
            $.ajax({
                url: ctx + '/stockLocationBindSku/importLocationChangeNumTemplate.html',
                type: 'POST',
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function(returnData) {
                    loading.hide()
                    $('#stockLocationBindSku_importLocationChangeNum_file').val('')
                    if (returnData.code == '0000') {
                        layer.msg('导入进程结束',{icon:1});
                        stockLocationBindSku_search();
                    } else {
                        layer.msg(returnData.msg,{icon:2});
                    }
                },
                error: function() {
                    loading.hide()
                    $('#stockLocationBindSku_importLocationChangeNum_file').val('')
                }
            });
        },
        function() {
            $('#stockLocationBindSku_importLocationChangeNum_file').val('');
            layer.closeAll()
        }
    )
});
//导入库位规格-ztt-20220630
$('#stockLocationBindSku_locationStandardImportExcel_file').on('change',function(){
    let files = $('#stockLocationBindSku_locationStandardImportExcel_file')[0].files
    if (files.length === 0) {
        return
    }
    // 校验文件类型
    let fileName = files[0].name
    let seat = fileName.lastIndexOf(".");
    let extension = fileName.substring(seat).toLowerCase();
    if (extension !== '.xlsx' && extension !== '.xls') {
        layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件', {icon: 0})
        return;
    }
    let formData = new FormData();
    formData.append("file", files[0]);
    layer.confirm('确认导入库位规格模板吗', { btn: ['确认', '取消'] },
        function() {
            loading.show()
            $.ajax({
                url: ctx + '/wh/spec/upload',
                type: 'POST',
                data: formData,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function(returnData) {
                    loading.hide()
                    $('#stockLocationBindSku_locationStandardImportExcel_file').val('')
                    if (returnData.code === '0000') {
                        layer.confirm(returnData.msg, { btn: ['确认', '取消'] });
                        stockLocationBindSku_search();
                    } else {
                        layer.msg(returnData.msg,{icon:2});
                    }
                },
                error: function() {
                    loading.hide()
                    $('#stockLocationBindSku_locationStandardImportExcel_file').val('')
                }
            });
        },
        function() {
            $('#stockLocationBindSku_locationStandardImportExcel_file').val('');
            layer.closeAll()
        }
    )
});

// 批量删除
$('#stockLocationBindSku_batchDelete').click(function(){
    var idsArr = getCheckedLocationId()
    console.log(idsArr,'idsArr')
    var ids = ""
    if(idsArr.length>0){
        ids = idsArr.join(',')
    var warehouseName=$("#stockLocationBindSku_form select[name=warehouseId]").val();
    loading.show();
    $.ajax({
        url: ctx + '/warehouseProdLocation/deleteBatch.html',
        type:"post",
        dataType: "json",
        contentType:"application/json;charset=utf-8",
        data: JSON.stringify({ids:ids,warehouseName:warehouseName}),
        success: function (returnData) {
            if (returnData.code == "0000") {
                layer.msg(returnData.msg||"删除成功");
                stockLocationBindSku_search()
            } else {
                layer.msg(returnData.msg, {icon: 5});
            }
        },
        complete:function () {
            loading.hide();
        }
    });
}else{
    layer.msg("请勾选要删除的数据行")
}
})

//获取勾选行Id
function getCheckedLocationId(){
    var locationIds = []
    var pId_cbox_td = $("#stockLocationBindSku_table").next().find("tbody input[name='layTableCheckbox']:checked")
    // pId_layui_td = pId_cbox_td.next();
    // pId_layui_td.each(function(index,item){
    //     if($(item).hasClass('layui-form-checked')){
    //         var locationId = $(item).parents('tr').attr('data-locationId')
    //         locationIds.push(locationId)
    //     }
    // })
    
    if (pId_cbox_td.length > 0) {
        for (var i = 0; i < pId_cbox_td.length; i++) {
            locationIds.push($(pId_cbox_td[i]).parents('tr').find('[data-field="whStockLocationId"]').text());
        }
    }
    return locationIds
}


function stockLocationBindSku_getSearchData() {
    var data = {};
    data.warehouseId=$("#stockLocationBindSku_form select[name=warehouseId]").val();
    data.bindUserId=$("#stockLocationBindSku_form select[name=bindUserId]").val();
    data.locationCodeSearchType=$.trim($("#stockLocation_searchtype_sel").val());//库位检索类型
    data.stockLocation=$("#stockLocationBindSku_form input[name=stockLocation]").val();
    data.prodSSkuStr=$("#stockLocationBindSku_form input[name=prodSSkuStr]").val();
    data.locationStatus=$("#stockLocationBindSku_form select[name=locationStatus]").val();
    data.buildNo= formSelectsMain.value('stockLB_buildNo','valStr')
    data.floorNo= formSelectsMain.value('stockLB_floorNo','valStr')
    var stockLocationStr = data.stockLocation;
    if(stockLocationStr){
        var stockLocationArr = stockLocationStr.split(",");
        if (stockLocationArr.length > 0) {
            var locaitonData =[];
            for (var i = 0; i < stockLocationArr.length; i++) {
                locaitonData.push(stockLocationArr[i]);
            }
            data.locationCodeList=locaitonData;
        }
    }
    return data;
}

//按库位绑定
function stockLocationBindSku_bindSku(whStockLocationId,stockLocation,warehouseName) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    layer.open({
        type: 1,
        title: '绑定SKU',
        btn: ['绑定','关闭'],
        area: ['60%', '60%'],
        content: $("#stockLocationBindSku_tpl1").html(),
        end:function(index,layero){},
        yes: function(index,layero){
            var req={};
            req.id=whStockLocationId;
            req.warehouseName=warehouseName;
            req.sSku=$("#stockLocationBindSku_form2 input[name=sSku]").val();
            var continueDo=$("#stockLocationBindSku_form2 input[name=continueDo]").prop('checked');
            loading.show();
            $.ajax({
                url: ctx + '/stockLocationBindSku/bindSku.html',
                type:"post",
                dataType: "json",
                contentType:"application/json;charset=utf-8",
                data: JSON.stringify(req),
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("绑定成功");
                        if(continueDo){
                            $("#stockLocationBindSku_form2 input[name=sSku]").val("");
                            $("#stockLocationBindSku_form2 input[name=sSku]").focus();

                        }else{
                            $("#stockLocationBindSku_form2 input[name=sSku]").val("");
                            $("#stockLocationBindSku_form2 input[name=sSku]").focus();
                        }
                    } else {
                        layer.msg(returnData.msg, {icon: 5});
                    }
                },
                complete:function () {
                    loading.hide();
                }
            });
        },
        btn2: function(index,layero){
            layer.close(index);
            stockLocationBindSku_searchProd();
        },
        cancel: function(index,layero){
            layer.close(index);
            stockLocationBindSku_searchProd();
        },
        success: function(index,layero) {
            $("#stockLocationBindSku_form2 input[name=stockLocation]").val(stockLocation);
            $("#stockLocationBindSku_form2 input[name=warehouseName]").val(warehouseName);
            form.render("checkbox");
            $("#stockLocationBindSku_form2 input[name=sSku]").focus();
        }
    });
}

//按输入信息绑定
function stockLocationBindSku_bindSku2() {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    layer.open({
        type: 1,
        title: '绑定SKU',
        btn: ['绑定','关闭'],
        area: ['60%', '60%'],
        content: $("#stockLocationBindSku_tpl2").html(),
        end:function(index,layero){},
        yes: function(index,layero){
            var req={};
            req.warehouseId=$("#stockLocationBindSku_form3 select[name=warehouseId]").val();
            req.whName = $("#stockLocationBindSku_form3 select[name=warehouseId]").find("option:selected").text();
            req.stockLocation=$("#stockLocationBindSku_form3 input[name=stockLocation]").val();
            req.sSku=$("#stockLocationBindSku_form3 input[name=sSku]").val();
            var continueDo=$("#stockLocationBindSku_form3 input[name=continueDo]").prop('checked');
            loading.show();
            $.ajax({
                url: ctx + '/stockLocationBindSku/bindSkuWithWHAndStockloca.html',
                type:"post",
                dataType: "json",
                contentType:"application/json;charset=utf-8",
                data: JSON.stringify(req),
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.msg("绑定成功");
                        if(continueDo){
                            $("#stockLocationBindSku_form3 input[name=sSku]").val("");
                            $("#stockLocationBindSku_form3 input[name=sSku]").focus();
                        }else{
                            $("#stockLocationBindSku_form3 input[name=sSku]").val("");
                            $("#stockLocationBindSku_form3 input[name=stockLocation]").val("");
                            $("#stockLocationBindSku_form3 input[name=stockLocation]").focus();
                        }
                    } else {
                        layer.msg(returnData.msg, {icon: 5});
                    }
                },
                complete:function () {
                    loading.hide();
                }
            });
        },
        btn2: function(index,layero){
            layer.close(index);
            stockLocationBindSku_searchProd();
        },
        cancel: function(index,layero){
            layer.close(index);
            stockLocationBindSku_searchProd();
        },
        success: function(index,layero) {
            $("#stockLocationBindSku_form3 input[name=stockLocation]").on('keydown', function (event) {
                if (event.keyCode == 13) {
                    $("#stockLocationBindSku_form3 input[name=sSku]").focus();
                    return false
                }
            });
            $("#stockLocationBindSku_form3 input[name=stockLocation]").focus();
            //初始化仓库
            loading.show();
            $.ajax({
                type: "POST",
                url: ctx + "/prodWarehouse/getAuthedProdWarehouse.html",
                contentType: 'application/json',
                dataType: 'json',
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        $("#stockLocationBindSku_form3 select[name=warehouseId]").html("");
                        $(returnData.data).each(function(){
                            $("#stockLocationBindSku_form3 select[name=warehouseId]").append("<option value='"+this.id+"'>"+this.warehouseName+"</option>");
                        });
                        form.render('select');
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function () {
                    layer.msg("服务器正忙");
                },
                complete: function () {
                    loading.hide();
                }
            });
            form.render("checkbox");
        }
    });
}

//删除库位
function stockLocationBindSku_delStockLocation(whStockLocationId,warehouseName) {
    layer.confirm('您确认要删除吗？', {icon: 3, title: '提示'}, function () {
        var form = layui.form,
            laypage = layui.laypage,
            table = layui.table;
        $.ajax({
            url: ctx + '/warehouseProdLocation/delById.html',
            type: "post",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({id: whStockLocationId,warehouseName:warehouseName}),
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.msg("删除库位成功");
                    stockLocationBindSku_searchProd();
                } else {
                    layer.msg(returnData.msg, {icon: 5});
                }
            },
            complete: function () {
                loading.hide();
            }
        });
    });
}

/**
 * 批量打印库位标签
 */
function stockLocationBindSku_printStockLoca () {
    var whetherPrint = $('[name=stockLocationBindSKu_whetherPrint]').is(':checked');
    var locationDataArr = [];
    //获取库位列表
    var checkedTr = $("#stockLocationBindSku_table").next().find(".layui-table-body input[name='layTableCheckbox']:checked");//元素的dom列表
    if (checkedTr.length < 1) {
        return layer.msg('请选择要打印的库位',{icon:2});
    }
    if (checkedTr.length > 0) {
        for (var i = 0; i < checkedTr.length; i++) {
            var $item = $(checkedTr[i]);
            // var locationCode = $item.val().trim(); //库位名称
            var locationCode = $item.parents('tr').find('[data-field="locationCode"]').text(); //库位名称
            // var originalLocationCode = $item.parents('tr').find('.originalLocationCode').text().trim(); //原库位
            var originalLocationCode = $item.parents('tr').find('[data-field="originalLocationCode"]').text(); //原库位
            // var sonTableTrLen = $item.parents('tr').find('.stockLocationBindSku_inner_table tr').length;
            var sonTableTrLen = $item.parents('tr').find('.stockLocationBindSku_inner_table tr').length;
            var obj = {};
            //子sku长度大于1或者等于0,不传样式和名称
            if (sonTableTrLen > 1 || sonTableTrLen==0) {
                obj = {
                    locationCode: locationCode,
                    originalLocationCode: originalLocationCode,
                    printerName: "10040",
                    printNumber: 1,
                    onlyPreView: false
                };
            } else {//等于1,传样式和名称
                var style = $item.parents('tr').find('.style').text().trim();
                var title = $item.parents('tr').find('.title').text().trim();
                var sSku = $item.parents('tr').find('.sSku').text().trim();
                if (whetherPrint) {
                    obj = {
                        locationCode: locationCode,
                        originalLocationCode: originalLocationCode,
                        printerName: "10040",
                        printNumber: 1,
                        style: style,
                        title: title,
                        sku: sSku,
                        onlyPreView: false
                    };
                } else {
                    obj = {
                        locationCode: locationCode,
                        originalLocationCode: originalLocationCode,
                        printerName: "10040",
                        printNumber: 1,
                        style: style,
                        title: title,
                        // sku: sSku,
                        onlyPreView: false
                    };
                }

            }
            locationDataArr.push(obj);
        }
        epeanPrint_plugin_fun(13,locationDataArr);
        return false;
    }
}

//解绑
function stockLocationBindSku_delBind(id,warehouseName) {
    layer.confirm('您确认要删除吗？', {icon: 3, title: '提示'}, function () {
        var form = layui.form,
            laypage = layui.laypage,
            table = layui.table;
        loading.show();
        $.ajax({
            url: ctx + '/stockLocationBindSku/delBind.html',
            type: "post",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({id: id,warehouseName:warehouseName}),
            success: function (returnData) {
                if (returnData.code == "0000") {
                    stockLocationBindSku_searchProd();
                    layer.msg("成功解除绑定");
                } else {
                    layer.msg(returnData.msg, {icon: 5});
                }
            },
            complete: function () {
                loading.hide();
            }
        });
    })
}

//全选框
function stockLocationBindSku_checkAll(obj){
    /*获取checkbox的状态*/
    var isChecked = $(obj).prop('checked');
    var pId_cbox_td = $("#stockLocationBindSku_table tbody input.pid-cbox"),
        pId_layui_td = pId_cbox_td.next();
    if (isChecked) {
        pId_layui_td.addClass('layui-form-checked');
        pId_cbox_td.prop('checked', true);
    } else {
        pId_layui_td.removeClass('layui-form-checked');
        pId_cbox_td.prop('checked', false);
    }
}
