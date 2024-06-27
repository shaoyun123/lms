var outpagedata = {};
layui.use(["admin", "layer", "table", "form", "laytpl", "laydate", "element", 'upload', "formSelects"], function() {
    var layer = layui.layer,
        admin = layui.admin,
        table = layui.table,
        form = layui.form,
        element = layui.element,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        $ = layui.$,
        laydate = layui.laydate;
    formSelects.render('logisAttr_productlist');
    element.render('collapse');

    form.render('select')
    form.render('checkbox')
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    $('#cluster').select2();
    $('#test2').select2();
    var updateParentSkuLayerIndex = "";
    fillSelect(); //初始化页面下拉框填充
    // 初始化  选择条件form 种的 自定义选择输入框
    initHpSelect('#opl_skuTagPrint_searchForm')

    form.on('select(downTempBtn_productlist)', function (data) {
        var optionNum = data.value;
        var Adata = {}
        if (1 == optionNum) {
            window.location.href = ctx + '/static/templet/updateProductListTemplate.xlsx'
        } else if (2 == optionNum) {
            submitForm(Adata, ctx + '/product/downAddByExcelTemp.html')
        } else if (3 == optionNum) {
            window.location.href = ctx + '/static/templet/updateProductCKGTemplate.xlsx'
        }
    })
    //ztt20230913 该页面公共打印功能
    function skuTagPrintPrintHandle(data){
      let printParamsList = [];
      let warehouseId = $('#sku_tagwarehouseList').val();
      for(let i=0; i<data.length;i++){
        let item = data[i];
        let obj = {};
        obj.printNum = $(`[id='${item.id}${item.sSku}']`).val();
        obj.storageNum = $(`[id='${item.id}${item.sSku}']`).val();
        obj.warehouseId = warehouseId;
        obj.prodSId = item.id;
        obj.addFlag = true;
        printParamsList.push(obj);
      }
      let printResData = commonGetPrintDataByLoopRequest(printParamsList);
      Promise.all(printResData).then(res => {
        let printParams = [];
        for(let k=0; k<res.length; k++){
          let item = res[k];
          if(typeof(item) == 'string'){
            return layer.msg(item, {icon:7});
          }else{
            let obj = {};
            obj.printType = 19;
            obj.labelUrl = item.labelUrl;
            obj.width = item.width;
            obj.height = item.height;
            obj.printName = item.printName;
            // logistics_label_pdf_print(obj);
            printParams.push(obj);
          }
        }
        commonExecutePrintJobs(printParams);
      });
  }

    // 表格渲染
    function search_productlist(data) {
        table.render({
            elem: "#sProdSkuTable",
            method: 'post',
            url: ctx + "/skuTagPrint/list.html",
            where: data,
            cols: [
                [
                    {type: "checkbox", width: 30},
                    {field: "sSku", title: "商品sku"},
                    {field: "isSale", title: "商品状态", width: 70, templet: '#skuTag_isSale_Tpl'},
                    {field: "imgUrl", title: "图片", width: 70, templet: `<div>
                    <img width="60" height="60" data-original="{{d.imgUrl||''}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                </div>`},
                    {field: "title", title: "商品名称"},
                    {field: "storageRequirements", title: "入库要求",width: 140},
                    {title: "特殊包装", templet:'#skuTag_specialPack_Tpl',width: 140},
                    {title: "独立包装", templet:'#skuTag_alonePack_Tpl' ,width: 140},
                    {title: "质检要求", templet:'#skuTag_ifNeedQualityCheck_Tpl' ,width: 100},
                    {field: "printNumber", title: "打印数量", width: 140,templet:'#skuTag_editPrintNumberBatchInput_Tpl'},
                    {field: "stockLocation", title: "库位", width: '15%'},
                    {field: "buyer", title: '采购专员', width: 140},
                    {field: "bizzOwner", title: '开发专员', width: 140}
                ],
            ],
            done: function (res, curr, count) {
                var tags_isChecked = $('#opl_skuTagPrint_searchForm').find('[name=autoPrintSkuTags]').is(":checked");
                if(res.data.length >0){
                    if(tags_isChecked){
                      skuTagPrintPrintHandle(res.data);
                        var $input = $('#opl_skuTagPrint_searchForm').find('[name=sSku]');
                        $input.val('');
                        $input.focus();
                    }
                }
                imageLazyload();
                imageLazyloadOrigin();
            },
            id: "sProdSkuTable",
            page: true,
            limits: [1000, 2000, 3000],
            limit: 3000
        });
    }

    $("#pl_skuTagPrint_searchBtn").click(function () {
        var sSku = $.trim($("#opl_skuTagPrint_searchForm input[name='sSku']").val());
        if(!sSku) {
            layer.msg('请输入查询的sku',{icon:0})
            return;
        }
        var sub = new Object();
        sub.warehouseId = $("#opl_skuTagPrint_searchForm [name='warehouseId']").val();
        sub.isSale = $("#opl_skuTagPrint_searchForm [name='isSale']").val();
        if (sub.isSale) {
            sub.isSale = JSON.parse($("#opl_skuTagPrint_searchForm [name='isSale']").val());
        } else {
            sub.isSale = null
        }
        sub.skuSearchType = $.trim($("#opl_skuTagPrint_searchForm select[name='skuSearchType']").val());
        sub.sSku = $.trim($("#opl_skuTagPrint_searchForm input[name='sSku']").val());
        if(sub.skuSearchType == 0){
            if(sub.sSku){
                if(sub.sSku.length > 1000){
                    layer.msg('sku模糊查询时，数据长度不能超过1000个字符',{icon:0})
                    return;
                }
            }
        }
        search_productlist(sub)
    });

    //页面下拉框枚举类型填充
    function fillSelect() {
        $.ajax({
            url: ctx + "/skuTagPrint/getSkuTagPrintEnum.html",
            type: 'post',
            dataType: 'json',
            success: function(returnData) {
                if (returnData.code == "0000") {
                    for (var i in returnData.data) {
                        if (returnData.data[i].length > 0) {
                            appendoption('sku_tag', i, returnData.data[i]); //遍历数据生成option填到相应select
                        }
                    }
                    outpagedata.warehouseList = returnData.data.warehouseList;
                    layui.form.render('select');
                }
            }
        });
    };

    // 填充下拉框
    function appendoption(pre, domName, obj) {
        var $li = '<option value="">请选择</option>';
        if (pre.indexOf("sku_tag") != -1 && domName.indexOf("warehouseList") != -1) {
            $li = '';
        }
        for (var i in obj) {
            if (obj[i]) {
                $li += '<option value=' + obj[i].value + '>' + obj[i].name + '</option>';
            }
        }
        $("#" + pre + domName).append($li);
    }

    $("#downTemplate_skuTagPrint").click(function () {
        window.location.href = ctx + '/static/templet/skuTagPrintTemplate.xlsx'
    })


    // 通过模板
    $('#skuTagPrintExcel_productlist_file').on('change', function() {
        // debugger
        var files = $('#skuTagPrintExcel_productlist_file')[0].files
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
        formData.append("warehouseId",$("#sku_tagwarehouseList").val());
        formData.append("isSale",$("#layerisSale").val());
        layer.confirm('确认导入模板吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/skuTagPrint/importSkuTagPrintTemplate.html',
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    success: function(returnData) {
                        loading.hide()
                        $('#skuTagPrintExcel_productlist_file').val('')
                        // returnData = JSON.parse(returnData)
                        if (returnData.code == '0000') {
                            layer.msg('导入成功',{icon:1});
                            skuTagPrintStaticTableRender(returnData.data);
                            console.log('表格的重新渲染');
                        } else {
                            layer.alert(returnData.msg,{icon:2});
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#skuTagPrintExcel_productlist_file').val('')
                    }
                });
            },
            function() {
                $('#skuTagPrintExcel_productlist_file').val('');
                layer.closeAll()
            }
        )
    });


    $("#pl_skuTagPrint_searchReset").click(function () {
        $("#opl_skuTagPrint_searchForm")[0].reset();
        $("#opl_skuTagPrint_searchForm input[type='hidden']").val('');
    });

    //表格渲染
    function skuTagPrintStaticTableRender(data){
        table.render({
            elem: "#sProdSkuTable",
            data: data,
            cols: [
                [
                    {type: "checkbox", width: 30},
                    {field: "sSku", title: "商品sku"},
                    {field: "isSale", title: "商品状态", width: 140, templet: '#skuTag_isSale_Tpl'},
                    {field: "title", title: "商品名称", width: '20%'},
                    {field: "printNumber", title: "打印数量", width: 140,templet:'#skuTag_editPrintNumberBatchInput_Tpl'},
                    {field: "stockLocation", title: "库位", width: '15%'},
                    {field: "buyer", title: '采购专员', width: 140},
                    {field: "bizzOwner", title: '开发专员', width: 140}
                ],
            ],
            done: function (res, curr, count) {
            },
            id: "sProdSkuTable",
            page: true,
            limits: [50,100,200],
            limit: 50
        });
    }

    //打印功能
    printProductList('sProductlist_printData');
    var printData;
    function printProductList(dom) {
        $('#' + dom).on('click', function () {
            var checkDatas = table.checkStatus('sProdSkuTable').data;
            if (!checkDatas.length) {
                return layer.msg('请先选择需要打印的数据!');
            }
            // printProductCore(checkDatas);
            skuTagPrintPrintHandle(checkDatas);
        })
    }
    //打印的核心功能
    function printProductCore(checkDatas){
        var printData = [];
        for (var i = 0; i < checkDatas.length; i++) {
            var item = checkDatas[i];
            var obj = {};
            var $id = item.id + item.sSku;
            item.printNumber = $('#'+$id).val();
            obj.printNum = item.printNumber;//标签打印次数，弹框可修改
            console.log("打印数量："+obj.printNum);
            obj.unit = item.unit; //单位
            // obj.weight= accAdd(item.suttleWeight, (item.packWeight?item.packWeight : 0)); //毛重
            // obj.develop = item.bizzOwner; //开发
            obj.prodSSku = item.sSku; //子SKU
            obj.stockLocation = item.stockLocation;
            obj.prodStyle = item.style; //款式
            // obj.prodPSku = item.pSku; //父sku
            obj.inPackType = item.inPackType; //入库包装类型
            obj.packDesc = item.packDesc; //入库包装类型
            obj.printerName = "6515"; //调用的打印机名称
            obj.title = item.title;
            obj.storageNumber="";
            obj.addParam='1'
            //商品名称--> 名称+款式
            if (obj.prodStyle != null && obj.prodStyle != '') {
                obj.title = obj.title + "(" + obj.prodStyle + ")";
            }
            obj.printType = 2; //打印入库单标签
            obj.printUserId = window.localStorage.getItem('lmsAppUserId') || '';
            printData.push(obj);
        };
        epeanPrint_plugin_fun(2,printData);
    }
})
