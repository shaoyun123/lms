console.log("FbaCheckBox");
//结构
//初始化和数据结构定义
//click事件定义
//表单事件最后
//无业务意义的方法
layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage', 'upload', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        layer = layui.layer,
        upload = layui.upload;
    laydate = layui.laydate;
    form.render('select');

    var tablecol = {
        'FbaCheckBox_table': [
            [ //FBA
                { type: 'checkbox', width: 30 },
                {title: "仓库箱号", field: "boxCode",width:100},
                {title: "货件编号(店铺站点)", field: "shipmentId",width:120,templet:"#FbaCheckBox_shipmentId_tpl"},
                {title: $('#FbaCheckBox_subSkuInfo_title_tpl').html(), field: "",templet:"#FbaCheckBox_subSkuInfo_tpl",width:900},
                {title: "时间", field: "shipCreateTime",width:180,templet:'#FbaCheckBox_timeTpl'},
                {title: '仓库备注', field: "whRemark",event: 'setRemark',templet:'#FbaCheckBox_editRemark_tpl'},
                {title: '销售备注', field: "salerRemark"},
                // {title: '操作', field: "", toolbar: "#FbaCheckBox_Option",width:100}
            ]

        ],
        'FbaCheckBox_recomPutInBox_table':[
            [ //FBA
                {title: "仓库箱号", field: "boxCode"},
                {title: "数量", field: "planQuality"},
            ]
        ]
    };

    // 弹框-----------------
    //监听工具栏操作(精简化操作,使用封装方法的形式,使代码简洁,简单ajax无需封装)
    for (var i in tablecol) {
        table.on('tool(' + i + ')', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if(obj.event === 'setRemark'){

                layer.prompt({
                    formType: 2
                    , title: '修改仓库箱子 [' + data.boxCode + '] 的备注'
                    , value: data.whRemark
                    , yes: function (index, layero) {
                        var value = layero.find(".layui-layer-input").val();
                        console.log(123);
                        //这里一般是发送修改的Ajax请求
                        if (data.pShipId) {
                            initAjax("/amazonFbaWhBox/setWhRemark.html", "POST", JSON.stringify({
                                pShipId: data.pShipId,
                                whRemark: value
                            }), function (returnData) {
                                //同步更新表格和缓存对应的值
                                layer.close(index);
                                obj.updateLine({
                                    whRemark: value
                                });
                            }, null, true, true);
                        } else {
                            layer.msg("请选择分配有货件的箱子", {icon: 2});
                        }
                    }
                });
            }

            if (layEvent === 'printAllInfo') {//打印
                // var curlHref = window.location.href;
                // curlHref = curlHref.substring(0, curlHref.indexOf("/lms/"));
                // var reqUrl=curlHref+"/lms/amazonFbaWhBox/printAllInfo.html?id="+data.id;
                // FbaCheckBox_print(14,[{reqUrl:reqUrl}]);
                    submitForm({id:data.id}, ctx + '/amazonFbaWhBox/printAllInfo.html')//测试代码
            }
        });
    }
    $('#FbaCheckBox_exportBtn').click(function (){
        var checkStatus = table.checkStatus('FbaCheckBox_table'),
            data = checkStatus.data
        if (data.length !== 1) {
            layer.msg('请选择一个货件导出')
            return
        }
        submitForm({id:data[0].id}, ctx + '/amazonFbaWhBox/printAllInfo.html')//测试代码

    })
    //存箱失去焦点事件
    function FbaCheckBox_fnSku_blur(obj){
        initAjax("/amazonFbaWhBox/recomPutInBox.html", "POST",JSON.stringify({fnSku:$(obj).val()}), function (returnData) {
            renderTable(returnData.data,'FbaCheckBox_recomPutInBox_table');
        }, null, true, true);
    }

    $('#FbaCheckBox_putInBox').click(function () {//存箱弹框
        layer.open({
            type: 1,
            title: '存箱',
            btn: ['确定存箱', '关闭'],
            area: ['65%', '60%'],
            content: $('#FbaCheckBox_putInBox_Form_tpl').html(),
            success: function (index, layero) {
                $( '#FbaCheckBox_putInBox_Form input[name=fnSku]' ).blur(function(){//失去焦点事件
                    FbaCheckBox_fnSku_blur(this);
                });
            },
            yes: function (index, layero) {
                //触发表单提交任务
                $('#FbaCheckBox_putInBox_Form_submit').click();
            }
        })
    });
//表单--------------------
    $('#FbaCheckBox_takeOutBox').click(function () {//取箱弹框
        layer.open({
            type: 1,
            title: '取箱',
            btn: ['确定取箱', '关闭'],
            area: ['65%', '60%'],
            content: $('#FbaCheckBox_takeOutBox_Form_tpl').html(),
            success: function (index, layero) {

            },
            yes: function (index, layero) {
                //触发表单提交任务
                $('#FbaCheckBox_takeOutBox_Form_submit').click();
            }
        })
    });

    $('#FbaCheckBox_divideBox').click(function () {//自动分配箱子,遍历已采购,分配箱子
        initAjax("/amazonFbaWhBox/divideBox.html", "POST",JSON.stringify({}), function (returnData) {
            layer.msg(returnData.msg || "自动分配成功");
            $('#FbaCheckBox_Search').click();
        }, null, true, true);
    });

    /**
     * 获取打印信息
     * @param data  原数据列表
     * @param onlyUnPacked  是否仅筛选未包装的货品打印
     */
    function fbaCheckBox_printInfo(data,onlyHadPacked){
        let arr = []
        for (let i = 0; i < data.length; ++i) {
            let shipment = data[i]
            for (let j = 0; j < shipment.relSkuList.length; ++j) {
                let goodsInfo = shipment.relSkuList[j]
                if (onlyHadPacked && goodsInfo.matchStatus == 1) {
                    continue
                }
                arr.push({
                    boxCode: shipment.boxCode,
                    shipmentId: shipment.shipmentId,
                    whRemark: shipment.whRemark,
                    salerRemark: shipment.salerRemark,
                    storeName: shipment.storeName,
                    prodSSku: goodsInfo.prodSSku,
                    sellerSku: goodsInfo.sellerSku,
                    fnSku: goodsInfo.fnSku,
                    locationCode: goodsInfo.locationCode,
                    planQuality: goodsInfo.planQuality,
                })
            }
        }
        let tableColNameArr = [
            {title: "仓库箱号", field: "boxCode"},
            {title: "货件编码", field: "shipmentId"},
            {title: "商品SKU", field: "prodSSku", width: 128},
            {title: "店铺SKU", field: "sellerSku"},
            {title: "fnSku", field: "fnSku"},
            {title: "仓库", field: "storeName"},
            {title: "库位", field: "locationCode", width: 128},
            {title: "数量", field: "planQuality"},
            // {title: "仓库备注", field: "whRemark"},
            {title: "销售备注", field: "salerRemark"},
        ]

        openPrintTab('FBA货件存取详情',tableColNameArr,arr)
    }

    $('#FbaCheckBox_printBtn').click(function (){
        var checkStatus = table.checkStatus('FbaCheckBox_table'),
            data = checkStatus.data
        if (data.length == 0) {
            layer.msg('请选择需要打印的货件')
            return
        }

        let confirmIndex = layer.confirm('请选择打印方式？', {btn: ['仅打印未包装货品', '打印全部货品信息']}, function(){
            fbaCheckBox_printInfo(data,true)
            layer.close(confirmIndex)
        },function (){
            fbaCheckBox_printInfo(data,false)
            layer.close(confirmIndex)
        })
    })

    var measurementsIndex;
    //提交存箱
    form.on('submit(FbaCheckBox_putInBox_Form_submit)', function (data) {//作为初次提交
        initAjax("/amazonFbaWhBox/putInBox.html", "POST",JSON.stringify(data.field), function (returnData) {
            layer.msg(returnData.msg || "存箱成功");
            $('#FbaCheckBox_putInBox_result').html("存箱成功:货品sku"+data.field.fnSku+",箱号"+data.field.boxCode);
            $('#FbaCheckBox_Search').click();
        }, null, true, true,function (returnData) {//失败,按原因处理
            if(returnData.msg.indexOf(`长/宽/高`)>-1) {

                layer.confirm('对应子商品缺少长宽高,现在补充?',["确定","取消"],function() {
                    //新的弹框要求填写信息
                    layer.open({
                        type: 1,
                        title: data.field.fnSku + '补充基础子商品的长宽高',
                        btn: ['确认', '关闭'],
                        area: ['65%', '60%'],
                        content: $('#FbaCheckBox_complete_psi_info_Form_tpl').html(),
                        success: function (index, layero) {
                            initAjax("/amazonFbaWhBox/getPutInBoxPsi.html", "POST", JSON.stringify(data.field), function (returnData2) {
                                //设置长宽高
                                $('#FbaCheckBox_complete_psi_info_Form input[name=id]').val(returnData2.data.id);
                                $('#FbaCheckBox_complete_psi_info_Form input[name=sSku]').val(returnData2.data.sSku);
                                $('#FbaCheckBox_complete_psi_info_Form input[name=outerBoxLength]').val(returnData2.data.outerBoxLength);
                                $('#FbaCheckBox_complete_psi_info_Form input[name=outerBoxWidth]').val(returnData2.data.outerBoxWidth);
                                $('#FbaCheckBox_complete_psi_info_Form input[name=outerBoxHeight]').val(returnData2.data.outerBoxHeight);
                            }, null, true, true, null);
                        },
                        yes: function (index, layero) {
                            measurementsIndex=index;
                            $('#FbaCheckBox_complete_psi_info_Form_submit').click();
                        }
                    })
                });
            }else{
                layer.msg(returnData.msg, {icon: 2});
                $('#FbaCheckBox_putInBox_result').html("存箱失败:货品sku" + data.field.fnSku + ",箱号" + data.field.boxCode + ",失败原因:" + returnData.msg);
            }
        });
    });

    form.on('submit(FbaCheckBox_complete_psi_info_Form_submit)', function (data) {
        initAjax("/product/editPsiOuterMeasurements.html", "POST", JSON.stringify(data.field), function (returnData) {
            //设置长宽高
            layer.msg(returnData.msg || "设置长宽高成功");
            //关闭
            layer.close(measurementsIndex);
        }, null, true, true, null);
    })

    //提交取箱
    form.on('submit(FbaCheckBox_takeOutBox_Form_submit)', function (data) {//作为初次提交
        initAjax("/amazonFbaWhBox/takeOutBox.html", "POST",JSON.stringify(data.field), function (returnData) {
            layer.msg(returnData.msg || "取箱成功");
            $('#FbaCheckBox_takeOutBox_result').html("取箱成功:箱号"+data.field.boxCode);
            $('#FbaCheckBox_Search').click();
        }, null, true, true,function (returnData) {
            layer.msg(returnData.msg, {icon: 2});
            $('#FbaCheckBox_takeOutBox_result').html("取箱失败:,箱号"+data.field.boxCode+",失败原因:"+returnData.msg);
        });
    });

    // 表单提交
    //验证 //分页效果,从按钮触发是否可以重置//如果不能重置,则改为非表单提交,表单的目的做数据校验
    form.on('submit(FbaCheckBox_Search)', function (data) {//作为初次提交
        // data.field.page = 1;//保障首次分页请求中带有的值正确,分页首次为第一页,如果页面刷新业务需要保持在原有页,则注释此行
        // if (data.field.time) {
        //     data.field.startTime = data.field.time.split(' - ')[0] + ' 00:00:00';
        //     data.field.endTime = data.field.time.split(' - ')[1] + ' 23:59:59';
        // }
        form_search(data.field);
    });


    function initAjaxSync(url, method, data, succFunc, contentType, loadingShow, laodingHide,failFunc) { //初始化ajax请求
        if (loadingShow) {
            loading.show();
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: false,
            data: data,
            contentType: contentType || 'application/json',
            success: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (returnData.code == "0000") {
                    succFunc(returnData)
                } else {
                    if(failFunc){
                        failFunc(returnData);
                    }else{
                        layer.msg(returnData.msg, {icon: 2});
                    }
                }
            },
            error: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {icon: 7});
                } else {
                    layer.msg("服务器错误");
                }
            }
        })
    }


    function initAjax(url, method, data, succFunc, contentType, loadingShow, laodingHide,failFunc) { //初始化ajax请求
        if (loadingShow) {
            loading.show();
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (returnData.code == "0000") {
                    succFunc(returnData)
                } else {
                    if(failFunc){
                        failFunc(returnData);
                    }else{
                        layer.msg(returnData.msg, {icon: 2});
                    }
                }
            },
            error: function (returnData) {
                if (laodingHide) {
                    loading.hide();
                }
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", {icon: 7});
                } else {
                    layer.msg("服务器错误");
                }
            }
        })
    }

    function form_search(data) {//初次search的入口
        initAjax('/amazonFbaWhBox/queryPageForTakeOrPutBox.html', 'POST', JSON.stringify(data), function (returnData) {
            // renderPage(returnData.count, data.page, data.limit);
            renderTable(returnData.data.list, 'FbaCheckBox_table');
            //展示
            $('#FbaCheckBox_showInfo_num').html((returnData.data.totalNum-returnData.data.notUsedNum)+"/"+returnData.data.totalNum);
            $('#fbaCheckBox_curNum').html(returnData.data.list ? returnData.data.list.length : 0)
        }, null, true, true);
    }

    function renderTable(data, tablename, func) {//
        var tableIns = table.render({
            elem: '#' + tablename,
            method: 'POST',
            data: data,
            cols: tablecol[tablename],
            page: false,
            limit: Number.MAX_VALUE,
            id: tablename,
            done: function (data) {
                if (func) {
                    func(data);
                }
            }
        })
    }

    function getFormReqObj(formIdName) {//获取表单参数
        var d = {};
        var t = $('#' + formIdName + ' [name]').serializeArray();
        $.each(t, function () {
            d[this.name] = this.value;
        });
        return d;
    }

    function renderPage(count, current, limit) {//分页
        laypage.render({
            elem: 'FbaCheckBox_page',
            curr: current,
            limit: limit,
            limits: [10, 300, 500],
            layout: ['prev', 'page', 'next', 'count','limit'],
            count: count,
            jump: function (obj, first) {
                $('#FbaCheckBox_Form input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#FbaCheckBox_Form input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    var data = getFormReqObj("FbaCheckBox_Form");
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    form_search(data);
                }
            }
        });
    }

})
