console.log("FbaCheckCombSkuBox");
//结构
//初始化和数据结构定义
//click事件定义
//表单事件最后
//无业务意义的方法
var fbaCheckCombSkuBox_CurrentPutBaketDetail,fbaCheckCombSkuBox_CurrentPutSkuInfo
layui.use(['admin', 'form', 'table', 'layer', 'layedit', 'element', 'laypage', 'upload', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        layer = layui.layer,
        upload = layui.upload;
    laydate = layui.laydate;
    form.render('select');


    var FBAdelivery_enterKeyEvent=0;//回车触发的事件类型 0:页面查询 1:投篮弹框页面跳转仓库篮号

    var tablecol = {
        'FbaCheckCombSkuBox_table': [
            [ //FBA
                {checkbox:true,width:30},
                {title: "篮子编号", field: "boxCode",width:100},
                {title: "FnSKU", field: "fnSku",width:100},
                {title: "货件编号(店铺站点)", field: "shipmentId",minWidth:200,templet:"#FbaCheckCombSkuBox_shipmentId_tpl"},
                {title: "计划发货数量", field: "planQuality",width:100},
                {title: "组合品明细", field: "combStyle",width:150,templet:"FbaCheckCombSkuBox_combStyle_tpl"},
                {title: $('#FbaCheckCombSkuBox_subSkuInfo_title_tpl').html(), field: "",templet:"#FbaCheckCombSkuBox_subSkuInfo_tpl",minWidth:300},
                {title: "篮子状态", field: "boxFullStatus",templet:"#FbaCheckCombSkuBox_boxFullStatus_tpl",width:150},
                {title: "打印标签状态", field: "havePrintStatus",templet:"#FbaCheckCombSkuBox_havePrintStatus_tpl",width:100},
                {title: "货件计划创建时间", field: "shipCreateTime",width:200,templet:'<div>{{format(d.shipCreateTime,"yyyy-MM-dd hh:mm:ss")}}</div>'},
                // {title: '操作', field: "" , toolbar: "",maxWidth:80}
            ]
        ],
        'FbaCheckCombSkuBox_recomPutInBox_table':[
            [ //FBA
                {title: "商品SKU", field: "prodSSku"},
                {title: "库位", field: "locationCode"},
                {title: "数量", field: "amount"},
                {title: "是否已投", templet: "#FbaCheckCombSkuBox_ifHasPutTemp"},
            ]
        ]
    };

    // 弹框-----------------
    //监听工具栏操作(精简化操作,使用封装方法的形式,使代码简洁,简单ajax无需封装)
    for (var i in tablecol) {
        table.on('tool(' + i + ')', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'edit') {

            }
        });
    }

    $("#FbaCheckCombSkuBox_Form input[name=prodSSkuStr]").on('keydown', function (event) {
        if (event.keyCode == 13) {
            $('#FbaCheckCombSkuBox_Search').click();
        }
    });

    //投篮失去焦点事件
    function FbaCheckCombSkuBox_prodSSku_blur(obj){
        initAjax("/amazonFbaWhCombSkuBox/recomPutInBox.html", "POST",JSON.stringify({prodSSku:$(obj).val()}), function (returnData) {
            renderTable(returnData.data,'FbaCheckCombSkuBox_recomPutInBox_table');
        }, null, true, true);
    }


    $('#FbaCheckCombSkuBox_putInBox').click(function () {//投篮弹框
        layer.open({
            type: 1,
            title: '投篮',
            btn: ['打印标签并取篮','关闭'],
            area: ['65%', '60%'],
            content: $('#FbaCheckCombSkuBox_putInBox_Form_tpl').html(),
            success: function (index, layero) {
                fbaCheckCombSkuBox_CurrentPutBaketDetail = []
                fbaCheckCombSkuBox_CurrentPutSkuInfo = []
                let scanForm = $('#FbaCheckCombSkuBox_putInBox_Form')
                scanForm.find('[name=boxCode]').focus()
                layuiOpenPop=1;
                scanForm.find("input[name=boxCode]").on('keydown', function (event) {
                    if (event.keyCode === 13) {
                        let Adata = {boxCode: scanForm.find('[name=boxCode]').val()}
                        if (!Adata.boxCode || !Adata.boxCode.trim()) {
                            layer.msg('请输入篮子编号')
                            return
                        }
                        ajaxGetBaketDetail(Adata)
                    }
                })
                scanForm.find("input[name=prodSSku]").on('keydown', function (event) {
                    if (event.keyCode === 13) {
                        let Adata = {
                            boxCode: scanForm.find('[name=curBoxCode]').val(),
                            prodSSku: scanForm.find('[name=prodSSku]').val()
                        }
                        ajaxToPutInBasket(Adata)
                    }
                });

            },
            yes: function () {
                if(!fbaCheckCombSkuBox_CurrentPutSkuInfo || fbaCheckCombSkuBox_CurrentPutSkuInfo.length === 0) {
                    layer.msg('请先扫描篮号')
                    return false
                }
                function takeOutBox() {
                    let Adata2 = {
                        boxCode: $('#FbaCheckCombSkuBox_putInBox_Form').find('[name=curBoxCode]').val()
                    }
                    FbaCheckCombSkuBox_takeOutBox(Adata2)
                }
                FbaCheckCombSkuBox_printFnSku(fbaCheckCombSkuBox_CurrentPutSkuInfo,takeOutBox)
                let scanForm = $('#FbaCheckCombSkuBox_putInBox_Form')
                scanForm.find('[name=boxCode]').focus()
                return false
            },
            end: function (index,layero) {
                layuiOpenPop=0;
                $('#FbaCheckCombSkuBox_Search').click()
            }
        })
    });

    // 获取篮子的详细信息
    function ajaxGetBaketDetail(Adata) {
        $('#FbaCheckCombSkuBox_putInBox_ifFullSpan').text('')
        fbaCheckCombSkuBox_CurrentPutBaketDetail = []
        fbaCheckCombSkuBox_CurrentPutSkuInfo = []
        renderTable(fbaCheckCombSkuBox_CurrentPutBaketDetail, 'FbaCheckCombSkuBox_recomPutInBox_table');
        initAjax('/amazonFbaWhCombSkuBox/queryPageForTakeOrPutBox.html', 'POST', JSON.stringify(Adata), function (returnData) {
            let scanForm = $('#FbaCheckCombSkuBox_putInBox_Form')

            if (!returnData.data.list || returnData.data.list.length === 0) {
                layer.msg('未找到该篮子需要投篮的货品')
                scanForm.find('[name=boxCode]').val('')
                scanForm.find('[name=boxCode]').focus()
                return
            }
            if (returnData.data.list.length > 1) {
                layer.msg('找到多个投篮信息')
                scanForm.find('[name=boxCode]').val('')
                scanForm.find('[name=boxCode]').focus()
                return
            }
            // 记录当前扫描篮号
            $('#FbaCheckCombSkuBox_putInBox_Form_tpl_curBoxCode').text(Adata.boxCode)
            scanForm.find('[name=curBoxCode]').val(Adata.boxCode)
            // 清空篮号输入框
            scanForm.find('[name=boxCode]').val('')
            // 聚焦sku输入框
            scanForm.find('[name=prodSSku]').focus()
            // 显示
            fbaCheckCombSkuBox_CurrentPutSkuInfo = returnData.data.list
            fbaCheckCombSkuBox_CurrentPutBaketDetail = returnData.data.list[0].combSkuList
            if (returnData.data.list[0].boxFullStatus) {
                $('#FbaCheckCombSkuBox_putInBox_ifFullSpan').text('已满')
                $('#FbaCheckCombSkuBox_putInBox_ifFullSpan').css('color','greenyellow')
            } else {
                $('#FbaCheckCombSkuBox_putInBox_ifFullSpan').text('未满')
                $('#FbaCheckCombSkuBox_putInBox_ifFullSpan').css('color','indianred')
            }
            renderTable(fbaCheckCombSkuBox_CurrentPutBaketDetail, 'FbaCheckCombSkuBox_recomPutInBox_table');
        }, null, true, true);
    }

    // 发送ajax确认投篮
    function ajaxToPutInBasket(Adata) {
        let scanForm = $('#FbaCheckCombSkuBox_putInBox_Form')
        initAjax("/amazonFbaWhCombSkuBox/putInBox.html", "POST",JSON.stringify(Adata), function (returnData) {
            let curProdSSku = scanForm.find('[name=prodSSku]').val()
            // 更新当前sku
            $('#FbaCheckCombSkuBox_putInBox_Form_tpl_curProdSSku').text(curProdSSku)
            let hasWaitPut = 0
            for (let i in fbaCheckCombSkuBox_CurrentPutBaketDetail) {
                if (fbaCheckCombSkuBox_CurrentPutBaketDetail[i].prodSSku === curProdSSku) {
                    fbaCheckCombSkuBox_CurrentPutBaketDetail[i].putInStatus = 1
                    continue
                }
                if (fbaCheckCombSkuBox_CurrentPutBaketDetail[i].putInStatus !== 1) {
                    hasWaitPut++
                }
            }
            // 更新详情表
            renderTable(fbaCheckCombSkuBox_CurrentPutBaketDetail, 'FbaCheckCombSkuBox_recomPutInBox_table');

            // 清空sku输入框
            scanForm.find('[name=prodSSku]').val('')
            // 聚焦篮号输入
            scanForm.find('[name=boxCode]').focus()
            if (hasWaitPut) {
                // scanForm.find('[name=prodSSku]').focus()
                $('#FbaCheckCombSkuBox_putInBox_ifFullSpan').text('未满')
                $('#FbaCheckCombSkuBox_putInBox_ifFullSpan').css('color','indianred')
            } else {
                $('#FbaCheckCombSkuBox_putInBox_ifFullSpan').text('已满')
                $('#FbaCheckCombSkuBox_putInBox_ifFullSpan').css('color','greenyellow')
            }
        }, null, true, true,function (returnData) {
            scanForm.find('[name=prodSSku]').val('')
            scanForm.find('[name=prodSSku]').focus()
            layer.msg(returnData.msg, {icon: 2});
        });
    }
//表单--------------------
    $('#FbaCheckCombSkuBox_takeOutBox').click(function () {//取篮弹框
        layer.open({
            type: 1,
            title: '取篮',
            btn: ['确定取篮', '关闭'],
            area: ['65%', '60%'],
            content: $('#FbaCheckCombSkuBox_takeOutBox_Form_tpl').html(),
            success: function (index, layero) {
                layuiOpenPop = true
            },
            yes: function (index, layero) {
                //触发表单提交任务
                let data = serializeObject($('#FbaCheckCombSkuBox_takeOutBox_Form'))
                FbaCheckCombSkuBox_takeOutBox(data)
            },end: function () {
                layuiOpenPop = false
            }
        })
    });
    function FbaCheckCombSkuBox_takeOutBox(data) {
        initAjax("/amazonFbaWhCombSkuBox/takeOutBox.html", "POST",JSON.stringify(data), function (returnData) {
            layer.msg(returnData.msg || "取篮成功");
            $('#FbaCheckCombSkuBox_takeOutBox_result').html("取篮成功:篮号"+data.boxCode);
            $('#FbaCheckCombSkuBox_Search').click();
        }, null, true, true,function (returnData) {
            layer.msg(returnData.msg, {icon: 2});
            $('#FbaCheckCombSkuBox_takeOutBox_result').html("取篮失败:,篮号"+data.boxCode+",失败原因:"+returnData.msg);
        });
    }

    $('#FbaCheckCombSkuBox_divideBox').click(function () {//自动分配篮子,遍历已采购,分配篮子
        initAjax("/amazonFbaWhCombSkuBox/divideBox.html", "POST",JSON.stringify({}), function (returnData) {
            layer.msg(returnData.msg || "自动分配成功");
            $('#FbaCheckCombSkuBox_Search').click();
        }, null, true, true);
    });

    $('#FbaCheckCombSkuBox_printFnSku').click(function () {//打印标签
        let data = table.checkStatus('FbaCheckCombSkuBox_table').data;
        if (data.length <= 0) {
            layer.msg('请勾选至少一条')
            return
        }
        FbaCheckCombSkuBox_printFnSku(data)
    });

    function FbaCheckCombSkuBox_printFnSku(data,succFunc) {
        var markIdList= [];
        data.forEach(function(item,index){
            markIdList.push(item.id);
        });
        var printData = data.map(function(item) {
            return {
                fnSku:item.fnSku,
                mixStyle:item.mixStyle,
                printNumber:item.planQuality,
                planQuality:item.planQuality,
                printerName:"10040",
                onlyPreView: false,
                prodSSku:item.prodSSku,
                boxCode:item.boxCode,
                shipmentId:item.shipmentId,
                combStyle:item.combStyle,
                shipBoxCode:item.shipBoxCode,
                combSkuList:item.combSkuList
            }
        })
        var canPrint=true;//能打印
        var errorMsg="";
        printData.forEach(function(printItem,index){
            if(canPrint) {
                if ($.isEmptyObject(printItem.shipBoxCode)) {
                    errorMsg+="<div>货件:" + printItem.shipmentId + "，fnSku:" + printItem.fnSku + "没有分配仓库箱子<br/></div>";
                    canPrint=false;
                }
            }
        });
        if(!canPrint){
            layer.msg(errorMsg, {icon: 2});
        }else {
            fbaCheckCombSkuBox_print(printData,markIdList,succFunc);
        }
    }

    $('#FbaCheckCombSkuBox_printCombDetail').click(function () {
        let data = table.checkStatus('FbaCheckCombSkuBox_table').data;
        if (data.length <= 0) {
            layer.msg('请勾选至少一条')
            return false
        }
        printCombDetail(data)
    })

    function printCombDetail(data) {
        let printList = []
        for (let i = 0; i < data.length; ++i) {
            let printOne = {
                titleMap: {
                    shipmentId: data[i].shipmentId,
                    boxCode: data[i].boxCode
                },
                amount: 1
            }
            let skuList = []
            let locationList = []
            let numList = []
            for (let j = 0; j < data[i].combSkuList.length; j++) {
                skuList.push(data[i].combSkuList[j].prodSSku)
                locationList.push(data[i].combSkuList[j].locationCode || '')
                numList.push(data[i].combSkuList[j].amount)
            }
            printOne.titleMap.skuList = skuList
            printOne.titleMap.locationList = locationList
            printOne.titleMap.numList = numList
            printList.push(printOne)
        }
        let printDto = {
            jspaper: 'fbaCombDetail.jasper',
            printDetailDtoList: printList
        }
        printStandard(printDto)
    }

    // 表单提交
    //验证 //分页效果,从按钮触发是否可以重置//如果不能重置,则改为非表单提交,表单的目的做数据校验
    form.on('submit(FbaCheckCombSkuBox_Search)', function (data) {//作为初次提交
        // data.field.page = 1;//保障首次分页请求中带有的值正确,分页首次为第一页,如果页面刷新业务需要保持在原有页,则注释此行
        // if (data.field.time) {
        //     data.field.startTime = data.field.time.split(' - ')[0] + ' 00:00:00';
        //     data.field.endTime = data.field.time.split(' - ')[1] + ' 23:59:59';
        // }
        form_search(data.field);
    });


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

    function fbaCheckCombSkuBox_print(data,markIdList,succFunc) { //打印标签//批量
       var backFun = function(){
           printCombDetail(data)
           initAjax('/amazonFbaWhCombSkuBox/markPrintSucc.html', 'POST', JSON.stringify({idList:markIdList}), function (returnData) {
               $('#FbaCheckCombSkuBox_Search').click();
               if (succFunc && typeof succFunc === 'function') {
                   succFunc()
               }
           }, null, true, true);
       };
        epeanPrint_plugin_fun(8,data,backFun);
    }

    function form_search(data) {//初次search的入口
        initAjax('/amazonFbaWhCombSkuBox/queryPageForTakeOrPutBox.html', 'POST', JSON.stringify(data), function (returnData) {
            // renderPage(returnData.count, data.page, data.limit);
            renderTable(returnData.data.list, 'FbaCheckCombSkuBox_table');
            //展示
            $('#FbaCheckCombSkuBox_showInfo_num').html((returnData.data.totalNum-returnData.data.notUsedNum)+"/"+returnData.data.totalNum);
            $('#FbaCheckCombSkuBox_curNum').text(returnData.data.list ? returnData.data.list.length : 0)
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
            elem: 'FbaCheckCombSkuBox_page',
            curr: current,
            limit: limit,
            limits: [10, 300, 500],
            layout: ['prev', 'page', 'next', 'count','limit'],
            count: count,
            jump: function (obj, first) {
                $('#FbaCheckCombSkuBox_Form input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                $('#FbaCheckCombSkuBox_Form input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                //首次不执行
                if (!first) {
                    var data = getFormReqObj("FbaCheckCombSkuBox_Form");
                    data.page = obj.curr;
                    data.limit = obj.limit;
                    form_search(data);
                }
            }
        });
    }

    //初始动作
    $('#FbaCheckCombSkuBox_Search').click();
})
