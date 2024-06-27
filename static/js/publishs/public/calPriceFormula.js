/**
 * time: 2018/01/02
 */

var chooseRow={}
var calPriceFormula_platStore={}
layui.use(["admin", "form", "table", "layer", "laydate", "formSelects","laytpl"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laydate = layui.laydate,
        laytpl= layui.laytpl,
        formSelects = layui.formSelects,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    function search_calPriceFormula(data) {
        if (data) {
            if (!data.siteCodeList) {
                data.siteCodeList = []
            } else {
                data.siteCodeList = typeof data.siteCodeList === 'string' ? data.siteCodeList.split(',') : []
            }
            if (!data.storeAcctIdList) {
                data.storeAcctIdList = []
            } else {
                data.storeAcctIdList = typeof data.storeAcctIdList === 'string' ? data.storeAcctIdList.split(',') : []
            }
        }
        table.render({
            elem: "#calPriceFormulaTable",
            id: 'calPriceFormulaTable',
            method: "post",
            contentType: 'application/json',
            url: ctx + "/msgCalPriceFormula/queryPage.html",
            where: data,
            cols: [
                [
                    { checkbox: true, width: 30 },
                    //标题栏
                    // {field: "formulaCode", title: "系统编码",width: 150},
                    {field: "id", title: "ID", width: 70},
                    {field: "formulaName", title: "定价公式名称",width: 140},
                    {field: "platCode", title: "平台",width: 90},
                    {field: "siteName", title: "站点",width: 90},
                    {field: "buyer", title: "仓库",templet: '#stockLoaction_calPriceFormula',width: 70},
                    {field: 'grossRate', title: '毛利率(可编辑)',edit: 'text' ,style:"background-color: #7FFFD4;",width: 80},
                    {field: 'platDeduct', title: '平台提成(可编辑)',edit: 'text' ,style:"background-color: #7FFFD4;",width: 80},
                    {field: 'fixedCommission', title: "固定手续费(可编辑)",edit: 'text',style:"background-color: #7FFFD4;",width: 80},
                    {title: "商品标签(毛利率)",templet: '#logisAttrGrossRate_calPriceFormula' ,width: 180},
                    {field: 'discountRate', title: "优惠幅度",edit: 'text',style:"background-color: #7FFFD4;" ,width: 80},
                    {field: 'minGrossRate',title: "最低毛利(可编辑)",edit: 'text',style:"background-color: #7FFFD4;",width: 80},
                    {title: "在线lsiting标签(最低毛利)",templet: '#logisAttrGrossRate_minRate' ,width: 140},
                    {title: "商品价值(毛利率)",templet: '#logisAttrGrossRate_commodityValue' ,width: 150},
                    {field: 'ifDefault', title: "默认" ,templet: '#ifDefault_calPriceFormula',width: 50},
                    {field: 'refCount', title: "店铺数量",templet: '#store_calPriceFormula', sort: true, width: 100},
                    {field: 'remark',title:'备注(可编辑)',edit: 'text',style:"background-color: #7FFFD4;"},
                    {field: 'modifier', title: "最后修改人",templet: '#modify_calPriceFormula',width: 120},
                    {title: '操作', align: 'left', toolbar: '#Bar_calPriceFormula',width: 100}
                ],
            ],
            created: function(res) {
                res.data?.forEach(item => {
                    item.refCount = item.refList?.length || 0;
                    item.minGrossRateTagConfigDtoList.sort((a, b) => b.priority > a.priority ? -1 : 1)
                })
            },
            done: function(res, curr, count){
                $("#calPriceFormula_colLen").text(res.count);
                // 表头固定
                // theadHandle().fixTh({ id:'#calPriceFormulamanageCard',h:200 })
                UnifiedFixedFn('calPriceFormulamanageCard');
            },
            page: true, //是否显示分页
            limits: [100, 500, 1000],
            limit: 100, //每页默认显示的数量
        });
    }
    // 数据初始化
    search_calPriceFormula()

    table.on('edit(calPriceFormulaTable)', function(obj){
        //  获取单元格编辑之前td的选择器
        let oldValue = $(this).prev('div').text()
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        var Adata = {id: data.id}
        Adata[field] = value
        // 校验参数
        if (!calPriceFormula_validParam(Adata)) {
            // 校验不通过，恢复原值
            this.value = oldValue
            return
        }
        let url = ''
        if (Object.keys(Adata).includes('minGrossRate')) {
            url = '/msgCalPriceFormula/updateMingrossRate'
        } else {
            url = '/msgCalPriceFormula/updateFiled.html'
        }
        var ajax = new Ajax()
        ajax.post({
            url: ctx + url,
            data: JSON.stringify(Adata),
            contentType: 'application/json',
            success: function (data) {
                if (data.code === '0000') {
                    layer.msg('修改成功')
                }
            }
        })
    })

    function calPriceFormula_validParam(data) {
        for (let key in data) {
            switch (key){
                case 'grossRate':
                case 'minGrossRate':
                case 'platDeduct':
                case 'discountRate':
                case 'fixedCommission':
                    if (!isMoney(data[key]) || data[key] < 0) {
                        layer.msg('请填写正确比例')
                        return false
                    }
                    break
                case 'remark':
                    if (data[key].length > 200) {
                        layer.msg('备注超出最大长度限制')
                        return false
                    }
            }
        }
        return true
    }


    // 搜索
    $('#searchBtn_calPriceFormula').click(function () {
        var data = serializeObject($('#calPriceFormulaSearchForm'))
        search_calPriceFormula(data)
    });

    function renderTable_batch(data,isFirst){
        if(!isFirst){
            let checkedData = table.checkStatus("batch_productConfig_table");
            // table.cache的数据缓存的有选中的值LAY_CHECKED，选中渲染会有问题，下面代码手动设置LAY_CHECKED
            if(checkedData.data.length != 0){
                let checkedId = checkedData.data.map(item => item.id);
                data.forEach(item => {
                    if(checkedId.includes(item.id)){
                        item.LAY_CHECKED = true
                    }else{
                        delete item.LAY_CHECKED
                    }
                })
            }
        }
        table.render({
            elem: "#batch_productConfig_table",
            id: 'batch_productConfig_table',
            cols: [
                [
                    { checkbox: true, width: 30 },
                    {field: "formulaName", title: "定价公式名称",width: 150},
                    {field: "platCode", title: "平台",width: 90},
                    {field: "siteName", title: "站点",width: 90},
                    {field: 'grossRate', title: '毛利率',width: 80},
                    {field: 'prodAttrGrossRateData', title: "商品标签毛利率",templet: '#_logisAttrGrossRate_calPriceFormula'},
                    {field: 'productValueGrossRateData', title: "商品价值毛利率<a style='color:#1E9FFF' class='calPF_setUp'>批量设置</a>",templet: '#_logisAttrGrossRate_commodityValue'},
                ],
            ],
            done: function(res, curr, count) {
                $(".calPF_setUp").click(function(){
                    let _checkStatus = table.checkStatus("batch_productConfig_table")
                    if(_checkStatus.data.length <= 0){
                        return layer.msg("请选择需要修改的数据")
                    }
                    var popIndex = layer.open({
                        shadeClose: false,
                        type: 1,
                        title: "商品价值(毛利率)配置",
                        area: ["550px", "50%"],
                        btn: ['确认', '关闭'],
                        id:new Date().getTime(),
                        content: $("#_commodityValue_layer").html(),
                        success: function(layero, index){
                            let getTpl = $("#commodityValue_layer_tableTr").html(),result = {'productValueGrossRateData':[]};
                            laytpl(getTpl).render(result, function (html) {
                                $(".commodityValue_layer_tbody").html(html)
                            });

                            $(layero).on("click",".commodityValue_layer_del",function (){
                                if($(this).parent().children().length == 2){
                                    $(this).parents("tr").prev().find("td:last-child").html('<a class="layui-btn layui-btn-xs layui-btn-normal commodityValue_layer_add">添加</a><a class="layui-btn layui-btn-xs layui-btn-danger commodityValue_layer_del">删除</a>')
                                }
                                $(this).parents("tr").remove()
                            })
                            $(layero).on("click",".commodityValue_layer_add",function(){
                                let err = commodityValueLayerCheck(layero);
                                if(err){
                                    layer.msg(err,{icon:7})
                                }else{
                                    let str = ` <tr data-index="0">
                    <td><div style="display:flex"><input class="layui-input input1" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/> - <input class="layui-input input2" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/></div></td>
                    <td><input class="layui-input input3" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/></td>
                    <td><a class="layui-btn layui-btn-xs layui-btn-normal commodityValue_layer_add">添加</a><a class="layui-btn layui-btn-xs layui-btn-danger commodityValue_layer_del">删除</a></td>
                </tr>`
                                    $(this).parents("tbody").append(str)
                                    $(this).remove()
                                }
                            })
                        },yes: function (index, layero){
                            let newObj = [];
                            $(layero).find("tbody").find("tr").each(function (index, item) {
                                let minValue=$(item).find(".input1").val(),
                                    maxValue=$(item).find(".input2").val(),
                                    grossRate=$(item).find(".input3").val();
                                newObj.push({minValue, maxValue, grossRate})
                            });
                            let err = commodityValueLayerCheck(layero);

                            if(err != ''){
                                return layer.msg(err)
                            }

                            let checkedData = _checkStatus.data,allData = layui.table.cache['batch_productConfig_table'];

                            allData.forEach(item => {
                                for(let i=0;i<checkedData.length;i++){
                                    if(item.id == checkedData[i].id){
                                        item.productValueGrossRateData = JSON.stringify({productValueGrossRateData:newObj});
                                        return
                                    }
                                }
                            })
                            renderTable_batch(allData)
                            layer.close(popIndex)
                        }
                    })
                })
            },
            data:data,
            page: false, //是否显示分页
            limit: data.length, //每页默认显示的数量
        });
    }

    // 批量设置毛利率
    $('#batch_calPriceFormulaBtn').click(function () {
        let checkStatus = table.checkStatus("calPriceFormulaTable")
        if(checkStatus.data.length <= 0){
            return layer.msg("请选择需要修改的数据")
        }
        let platCode = checkStatus.data.map(item => item.platCode)
        let platCodeLen = Array.from(new Set(platCode))
        if(platCodeLen.length != 1){
            return layer.msg("请选择同一平台的数据")
        }
        // 最外层选中的数据
        let batch_calPriceFormulaBtn = checkStatus.data;
        var popIndex = layer.open({
            shadeClose: false,
            type: 1,
            title: "批量设置毛利率",
            area: ["80%", "80%"],
            btn: ['关闭'],
            id: new Date().getTime(),
            content: $("#batch_productConfig_layer").html(),
            success: function (layero, index) {
                let arr = []
                prodTagMap_calPriceFormula.forEach(item => {
                    arr.push({name: item.name, value: item.name})
                })
                formSelects.data('calPriceFormula_prodTagMap', 'local', {arr: arr})
                form.render(null,"batch_productConfig_form")
                renderTable_batch(batch_calPriceFormulaBtn,1)

                // 一键应用
                $(layero).find(".apply").click(function (){
                    let _checkStatus = table.checkStatus("batch_productConfig_table")
                    if(_checkStatus.data.length <= 0){
                        return layer.msg("请选择需要修改的数据")
                    }

                    let input1 = $(layero).find(".input1").val(),
                        input2 = $(layero).find(".input2").val(),
                        input3 = $(layero).find(".input3").val(),
                        select1 = $(layero).find("[name=select1]").val(),
                        select2 = $(layero).find("[name=select2]").val(),
                        select3 = $(layero).find("[name=select3]").val(),
                        select4 = formSelects.value("calPriceFormula_prodTagMap", "val");

                    if(select2 != '' && select4.length == 0){
                        return layer.msg("请选择商品标签")
                    }

                    if(input1 < 0 ||input2 < 0 ||input3 < 0){
                        return layer.msg("请输入非负数")
                    }

                    let checkedData = _checkStatus.data,allData = layui.table.cache['batch_productConfig_table'];
                    if(input1&&select1){
                        if(select1 == '+'){
                            checkedData.forEach(item => item.grossRate = (item.grossRate*1 + input1*1).toFixed(2))
                        }else if(select1 == '-'){
                            checkedData.forEach(item => item.grossRate = (item.grossRate*1 - input1*1).toFixed(2))
                        }else if(select1 == '='){
                            checkedData.forEach(item => item.grossRate = (input1*1).toFixed(2))
                        }

                    }

                    // 商品标签
                    if(select2 == '='&&input2){
                        checkedData.forEach(item => {
                            let prodAttrGrossRateData = item.prodAttrGrossRateData?JSON.parse(item.prodAttrGrossRateData):{};
                            select4.forEach(x => {
                                prodAttrGrossRateData[x] = (input2*1).toFixed(2)
                            })
                            item.prodAttrGrossRateData = JSON.stringify(prodAttrGrossRateData)
                        })
                    }else if(select2 == '-'){
                        checkedData.forEach(item => {
                            if(!item.prodAttrGrossRateData){return;}
                            let prodAttrGrossRateData = JSON.parse(item.prodAttrGrossRateData);
                            select4.forEach(x => {
                                delete prodAttrGrossRateData[x]
                            })
                            item.prodAttrGrossRateData = JSON.stringify(prodAttrGrossRateData)
                        })
                    }

                    // 商品价值
                    if(input3&&select3){
                        if(select3 == '+'){
                            checkedData.forEach(item => {
                                if(!item.productValueGrossRateData){return;}
                                let productValueGrossRateData = JSON.parse(item.productValueGrossRateData).productValueGrossRateData
                                productValueGrossRateData.forEach(x => x.grossRate = (x.grossRate*1 + input3*1).toFixed(2))
                                item.productValueGrossRateData = JSON.stringify({'productValueGrossRateData':productValueGrossRateData})
                            })
                        }else if(select3 == '-'){
                            checkedData.forEach(item => {
                                if(!item.productValueGrossRateData){return;}
                                let productValueGrossRateData = JSON.parse(item.productValueGrossRateData).productValueGrossRateData
                                productValueGrossRateData.forEach(x => x.grossRate = (x.grossRate*1 - input3*1).toFixed(2))
                                item.productValueGrossRateData = JSON.stringify({'productValueGrossRateData':productValueGrossRateData})
                            })
                        }else if(select3 == '='){
                            checkedData.forEach(item => {
                                if(!item.productValueGrossRateData){return;}
                                let productValueGrossRateData = JSON.parse(item.productValueGrossRateData).productValueGrossRateData
                                productValueGrossRateData.forEach(x => x.grossRate = (input3*1).toFixed(2))
                                item.productValueGrossRateData = JSON.stringify({'productValueGrossRateData':productValueGrossRateData})
                            })
                        }
                    }

                    allData.forEach(item => {
                        for(let i=0;i<checkedData.length;i++){
                            if(item.id == checkedData[i].id){
                                item.grossRate = checkedData[i].grossRate
                                item.prodAttrGrossRateData = checkedData[i].prodAttrGrossRateData
                                item.productValueGrossRateData = checkedData[i].productValueGrossRateData
                                return
                            }
                        }
                    })
                    renderTable_batch(allData)
                    $("#batch_productConfig_form")[0].reset();
                    formSelects.value("calPriceFormula_prodTagMap", [])
                })

                // 保存修改
                $(layero).find(".save").click(function (){
                    // console.log(layui.table.cache['batch_productConfig_table'])
                    let data = layui.table.cache['batch_productConfig_table'], tag = false;

                    data.forEach(item => {
                        if(item.grossRate < 0){
                            tag = true;
                            $(".td" + item.id).parents("tr").find("[data-field=grossRate] div").css("color","red")
                        }
                        let prodAttrGrossRateData = item.prodAttrGrossRateData?JSON.parse(item.prodAttrGrossRateData):{};
                        for(let key in prodAttrGrossRateData){
                            if(prodAttrGrossRateData[key] < 0){
                                tag = true;
                                $(".td" + item.id).parents("tr").find("[data-field=prodAttrGrossRateData] div").css("color","red")
                            }
                        }
                        let productValueGrossRateData = item.productValueGrossRateData?JSON.parse(item.productValueGrossRateData).productValueGrossRateData:[];
                        for(let i=0,len=productValueGrossRateData.length;i<len;i++){
                            if(productValueGrossRateData[i].grossRate < 0){
                                tag = true;
                                $(".td" + item.id).parents("tr").find("[data-field=productValueGrossRateData] div").css("color","red")
                            }
                        }
                    })

                    if(tag == true){
                        return layer.msg("请检查毛利率")
                    }

                    loading.show()
                    commonReturnPromise({
                        url: ctx + '/msgCalPriceFormula/updateGrossRateList',
                        type: 'POST',
                        contentType: 'application/json',
                        params:JSON.stringify(data)
                    }).then(res => {
                        loading.hide()
                        layer.alert("修改成功", {icon:1})
                        $('#searchBtn_calPriceFormula').click()
                    })
                })
            }
        })
    })

    // 获取所有商品标签
    let prodTagMap_calPriceFormula = []
    commonReturnPromise({
        url: ctx + '/fyndiq/new/listing/manage.html'
    }).then(res => {
        prodTagMap_calPriceFormula = res.prodTagMap
    })

    // 商品价值配置
    $('#ProductConfig_calPriceFormulaBtn').click(function () {
        commonReturnPromise({
            url: `/lms/platProductValueFormulaConfig/listFormulaConfig`,
            type: 'POST',
        }).then(function(result){
            if(result){
                var popIndex = layer.open({
                    shadeClose: false,
                    type: 1,
                    title: "商品价值计算公式配置",
                    area: ["850px", "80%"],
                    btn: ['确认', '关闭'],
                    id: new Date().getTime(),
                    content: $("#commodityValue_productConfig_layer").html(),
                    success: function (layero, index) {
                        var getTpl = $("#commodityValue_productConfig_layer_tableTr").html();
                        laytpl(getTpl).render(result, function (html) {
                            $(".commodityValue_productConfig_layer_tbody").html(html)
                        });

                        form.render()
                        // 移除
                        $(layero).on("click", ".commodityValue_productConfig_layer_del", function () {
                            let _this = this
                            var confirmIndex = layer.confirm('确定要移除数据吗？', { btn: ['确认', '取消'] }, function() {
                                $(_this).parents("tr").remove()
                                layer.close(confirmIndex)
                            })
                        })
                        // 新增
                        $(layero).on("click", ".commodityValue_productConfig_add", function () {
                            let checkedData = [];
                            $(".commodityValue_productConfig_layer_tbody").find("tr").each(function (index,item) {
                                let trData = $(item).data("tr")
                                if(!trData || !trData.status){
                                    checkedData.push(index)
                                }
                            });

                            if(checkedData.length != 0){
                                return layer.msg("请检查公式是否全部测试通过")
                            }else{
                                $(this).next("table").find("tbody").append($("#commodityValue_productConfig_layer_tableTr_tpl").html())
                                form.render()
                            }
                        })
                        // 测试
                        $(layero).on("click", ".commodityValue_productConfig_layer_test", function () {
                            let platCode = $(this).parents("tr").find("[name=platCode]").val();
                            let formula = $(this).parents("tr").find(".input1").val(),_this=this;
                            let trData = $(this).parents("tr").data("tr");
                            if(formula == ''){
                                return layer.msg("请输入商品价值计算公式(CNY)")
                            }
                            commonReturnPromise({
                                url: `/lms/platProductValueFormulaConfig/checkFormula`,
                                type: 'GET',
                                params:{formula}
                            }).then(function(result){
                                if(result){
                                    let obj;
                                    if(trData){
                                        obj = {...trData,platCode,productValueFormula:formula,status: true}
                                    }else{
                                        obj = {platCode,productValueFormula:formula,status: true}
                                    }
                                    $(_this).parents("tr").data("tr",obj)
                                    // $(_this).parents("tr").attr("data-tr",JSON.stringify(obj))
                                    $(_this).parents("tr").find(".res").html("<span style='color:green'>已测试</span>")
                                }
                            })
                        })
                    },yes: function (){
                        let submitData = [],checkedData=[];
                        $(".commodityValue_productConfig_layer_tbody").find("tr").each(function (index,item) {
                            let trData = $(item).data("tr")
                            if(!trData || !trData.status){
                                checkedData.push(index)
                            }else{
                                submitData.push(trData)
                            }
                        });
                        if(checkedData.length == 0){
                            // 校验平台是否重复
                            let platCodes = submitData.map(item => item.platCode)
                            if([...new Set(platCodes)].length !== platCodes.length){
                                return layer.msg("平台不能重复")
                            }
                            if(platCodes.includes("")){
                                return layer.msg("平台不能为空")
                            }
                            commonReturnPromise({
                                url: `/lms/platProductValueFormulaConfig/createFormulaConfig`,
                                type: 'POST',
                                contentType: 'application/json',
                                params:JSON.stringify(submitData)
                            }).then(function(result){
                                layer.closeAll();
                                layer.msg(result,{icon:1});
                                $('#searchBtn_calPriceFormula').click()
                            })
                        }else{
                            return layer.msg("请检查公式是否全部测试通过")
                        }
                    }
                })
            }
        }).catch(function(err){
        })
    })

    form.on('select(platCode_cal)',function (data) {
        let trData = $(data.elem).parents("tr").data("tr")
        if(trData.platCode != data.value){
            trData.platCode = data.value
            $(data.elem).parents("tr").attr("data-tr",JSON.stringify(trData))
        }
    })

    // 新增
    $('#addBtn_calPriceFormulaBtn').click(function () {
        var popIndex = layer.open({
            shadeClose: false,
            type: 1,
            title: "新增定价公式",
            area: ["800px", "600px"],
            btn: ['新增', '关闭'],
            content: $("#calPriceFormulaAddLayer").html(),
            success: function () {
                initNotNull('#calPriceFormulaAddForm')
                init_calPriceFormulaAddLayer()
            },
            yes: function () {
                if (!checkNotNull('#calPriceFormulaAddForm')){
                    return
                }

                var data = {
                    platCode: $('#calPriceFormulaAddForm [name=platCode]').val(),
                    siteId: $('#calPriceFormulaAddForm [name=siteId]').val(),
                    siteName: $('#calPriceFormulaAddForm [name=siteId] option:selected').text(),
                    stockLocation: $('#calPriceFormulaAddForm [name=stockLocation]').val(),
                    formulaCode: $('#calPriceFormulaAddForm [name=formulaCode]').val(),
                    grossRate: $('#calPriceFormulaAddForm [name=grossRate]').val(),
                    remark: $('#calPriceFormulaAddForm [name=remark]').val(),
                }

                // 有站点的平台站点必选
                const selectOtions =  $('#calPriceFormulaAddForm [name=siteId] option')
                if(selectOtions.length > 1 && !data.siteId){
                    layer.msg('请选择站点', {icon:0})
                    return;
                }

                //校验data 除eBay外其他不允许选择仓库
                if(data.platCode != 'ebay' && data.stockLocation != "0"){
                    //不允许选择仓库
                    layer.msg('除eBay外其他平台不允许选择仓库', {icon:0})
                    return;
                }

                var ajax = new Ajax(true)
                ajax.post({
                    url: ctx + "/msgCalPriceFormula/addOneFormula.html",
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.code == '0000') {
                            layer.close(popIndex)
                            $('#searchBtn_calPriceFormula').click()
                        }
                    }
                })
            }
        })
    })

    // 刷新缓存
    $('#refreshRedis_calPriceFormulaBtn').click(function () {
        var ajax = new Ajax(true)
        ajax.post({
            url: ctx + "/msgCalPriceFormula/resetRedisValue.html",
            data: JSON.stringify({}),
            contentType: 'application/json',
            success: function (data) {

            }
        })
    })

    function init_calPriceFormulaAddLayer() {
        form.render('select','calPriceFormulaAddForm')
        // 站点选择
        form.on('select(platCode_calPriceFormulaAddForm)', function(data){
            var platCode = data.value
            $('#calPriceFormulaAddForm [name=siteId]').html($('#salesSite_calPriceFormulaAddForm_' + platCode).html())
            form.render('select')
            const labelRequiredTagDom = $('#calPriceFormulaAddForm').find('.site-label-required-tag')
            const selectOtions =  $('#calPriceFormulaAddForm [name=siteId] option')
            if(selectOtions.length > 1){
                labelRequiredTagDom.show()
            }else{
                labelRequiredTagDom.hide()
            }
        });
    }

    table.on('tool(calPriceFormulaTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        chooseRow=data
        if (layEvent === 'setDefault') {
            var confirmIndex = layer.confirm('确认将该公式设为默认吗(同平台站点仓库的其他默认公式将取消默认)？', { btn: ['确认', '取消'] }, function() {
                var Adata = {
                    id: data.id
                }
                var ajax = new Ajax(true)
                ajax.post({
                    url: ctx + "/msgCalPriceFormula/setDefault.html",
                    data: JSON.stringify(Adata),
                    success: function (data) {
                        if (data.code == '0000') {
                            $('#searchBtn_calPriceFormula').click()
                        }
                    }
                })
            },function () {
                layer.close(confirmIndex)
            })
        } else if (layEvent === 'matchStore'){
            var popIndex = layer.open({
                shadeClose: false,
                type: 1,
                title: "匹配店铺(停用店铺不显示)",
                area: ["1200px", "600px"],
                btn: ['确认', '关闭'],
                content: $("#matchStorePop_calPriceFormula").html(),
                success: function () {
                    // 初始化店铺选择
                    initStore_calPriceFormula(data)
                },
                yes: function () {
                    var selectedBox = $('#matchStoreForm_calPriceFormula_checked [name=storeAcctId]:checked')
                    var refList = []
                    var ref
                    for (var i = 0 ; i < selectedBox.length; ++i) {
                        ref = {}
                        ref.fomulaId = data.id
                        ref.storeAcctId = selectedBox[i].value
                        refList.push(ref)
                    }
                    var Adta = {
                        id : data.id,
                        platCode: data.platCode,
                        siteId: data.siteId,
                        stockLocation: data.stockLocation,
                        refList: refList
                    }

                    commonReturnPromise({
                        url: `/lms/msgCalPriceFormula/updateFormula.html`,
                        type: 'POST',
                        contentType: 'application/json',
                        params:JSON.stringify(Adta)
                    }).then(function(result){
                        layer.msg(result, {icon:1});
                        layer.close(popIndex)
                        $('#searchBtn_calPriceFormula').click()
                    }).catch(function(err){
                        layer.confirm(err, {
                            btn: ['关闭'] //可以无限个按钮
                        });
                    })

                    // var ajax = new Ajax(true);
                    // ajax.post({
                    //     url: ctx + "/msgCalPriceFormula/updateFormula.html",
                    //     data: JSON.stringify(Adta),
                    //     success: function (data) {
                    //         if (data.code == '0000') {
                    //             layer.close(popIndex)
                    //             $('#searchBtn_calPriceFormula').click()
                    //         }
                    //     }
                    // })
                }
            })
        } else if (layEvent === 'updateGrossRate'){
            var popIndex = layer.open({
                shadeClose: false,
                type: 1,
                title: "修改毛利率",
                area: ["500px", "300px"],
                btn: ['确认', '关闭'],
                content: $("#updateGrossRatePop_calPriceFormula").html(),
                success: function () {
                    // 复现毛利率
                    $('#updateGrossRateForm_calPriceFormula [name=grossRate]').val(data.grossRate)
                },
                yes: function () {
                    var Adta = {
                        id : data.id,
                        grossRate:  $('#updateGrossRateForm_calPriceFormula [name=grossRate]').val()
                    }
                    if (!Adta.grossRate || isNaN(Adta.grossRate)) {
                        layer.msg('请输入正确的毛利率')
                        return
                    }

                    var ajax = new Ajax(true);
                    ajax.post({
                        url: ctx + "/msgCalPriceFormula/updateGrossRate.html",
                        data: JSON.stringify(Adta),
                        success: function (data) {
                            if (data.code == '0000') {
                                layer.close(popIndex)
                                $('#searchBtn_calPriceFormula').click()
                            }
                        }
                    })


                }
            })
        } else if (layEvent === 'updateGrossRate1'){
            let prodAttrGrossRateData = {};
            data.prodAttrGrossRateData?prodAttrGrossRateData = JSON.parse(data.prodAttrGrossRateData||{}):'';
            // 获取所有商品标签
            commonReturnPromise({
                url: ctx + '/fyndiq/new/listing/manage.html'
            }).then(res => {
                // 匹配商品标签的值
                for(let i=0;i<res.prodTagMap.length;i++){
                    if(prodAttrGrossRateData[res.prodTagMap[i].name]){
                        res.prodTagMap[i]["value"] = prodAttrGrossRateData[res.prodTagMap[i].name]
                    }
                }
                var getTpl = cpf_storeLabelDemo.innerHTML;
                laytpl(getTpl).render({"prodAttrGrossRateDataArr":res.prodTagMap}, function (html) {
                    $("#cpf_storeLabelView").html(html)
                });
            var popIndex = layer.open({
                shadeClose: false,
                type: 1,
                title: "商品标签(毛利率)",
                area: ["300px", "50%"],
                btn: ['确认', '关闭'],
                id:new Date().getTime(),
                content: $("#cpf_storeLabelView").html(),
                yes: function (index, layero) {
                    let formData = serializeObject($(layero).find("#cpf_storeLabelCon"))
                    // 请求什么值，后端直接保存，前端需要回显，所以删除没有数据的值
                    for(let key in formData){
                        formData[key] == ""?delete formData[key]:''
                    }

                    var updateData = {};
                    updateData.id = data.id;
                    updateData.prodAttrGrossRateData = JSON.stringify(formData);
                    new Ajax(true).post({
                        url: ctx + "/msgCalPriceFormula/updateGrossRate.html",
                        data: JSON.stringify(updateData),
                        success: function (returnData) {
                            if (returnData.code == '0000') {
                                layer.msg("修改成功",{icon:1});
                                layer.close(popIndex);
                                $('#searchBtn_calPriceFormula').click()
                            }else{
                                layer.msg(returnData.msg,{icon:7});
                            }
                        }
                    })
                }
            })
            })
        } else if (layEvent === 'updateDiscountRate'){
            var popIndex = layer.open({
                shadeClose: false,
                type: 1,
                title: "修改优惠幅度",
                area: ["500px", "300px"],
                btn: ['确认', '关闭'],
                content: $("#updateDiscountRatePop_calPriceFormula").html(),
                success: function () {
                    // 复现毛利率
                    $('#updateDiscountRateForm_calPriceFormula [name=discountRate]').val(data.discountRate)
                },
                yes: function () {
                    var Adta = {
                        id : data.id,
                        discountRate:  $('#updateDiscountRateForm_calPriceFormula [name=discountRate]').val()
                    }
                    if (!Adta.discountRate || isNaN(Adta.discountRate)) {
                        layer.msg('请输入正确的优惠幅度')
                        return
                    }

                    var ajax = new Ajax(true);
                    ajax.post({
                        url: ctx + "/msgCalPriceFormula/updateGrossRate.html",
                        data: JSON.stringify(Adta),
                        success: function (data) {
                            if (data.code == '0000') {
                                layer.close(popIndex)
                                $('#searchBtn_calPriceFormula').click()
                            }
                        }
                    })


                }
            })
        } else if (layEvent === 'delete'){
            var confirmIndex = layer.confirm('确认将该公式删除吗？', { btn: ['确认', '取消'] }, function() {
                var Adata = {
                    id: data.id
                }
                var ajax = new Ajax(true)
                ajax.post({
                    url: ctx + "/msgCalPriceFormula/delete.html",
                    data: JSON.stringify(Adata),
                    success: function (data) {
                        if (data.code == '0000') {
                            $('#searchBtn_calPriceFormula').click()
                        }
                    }
                })
            },function () {
                layer.close(confirmIndex)
            })
        } else if (layEvent === 'logList') {
            var id = data.id;
            var index = layer.open({
                type: 1,
                title: '操作日志',
                area: ['1000px', '600px'],
                btn: ['关闭'],
                shadeClose: false,
                content: $('#calPriceFormula_logListLayer').html(),
                success: function () {
                    console.log('render table')
                    table.render({
                        elem: "#calPriceFormula_logTable",
                        method:'post',
                        url: ctx + "/msgCalPriceFormula/getOperLogByFormulaId",
                        contentType: 'application/json',
                        cols: [[
                            { field: "createTime", title: "时间", width: 180, templet : "<div>{{ layui.admin.Format( d.createTime, 'yyyy-MM-dd hh:mm:ss')}}</div>"},
                            { field: "creator", title: "修改人"},
                            { field: "operDesc", title: "操作描述"}
                        ]],
                        page: true,
                        where: {id: id},
                        id:"calPriceFormula_logTable",
                        limits:[20,100,100],
                        limit:20
                    });
                }
            })
        } else if (layEvent === 'commodityValue') {  // 商品价值

            var popIndex = layer.open({
                shadeClose: false,
                type: 1,
                title: "商品价值(毛利率)配置",
                area: ["550px", "50%"],
                btn: ['确认', '关闭'],
                id:new Date().getTime(),
                content: $("#commodityValue_layer").html(),
                success: function(layero, index){
                    let getTpl = $("#commodityValue_layer_tableTr").html(),result = data.productValueGrossRateData && JSON.parse(data.productValueGrossRateData) || {productValueGrossRateData:[]};
                    laytpl(getTpl).render(result, function (html) {
                        $(".commodityValue_layer_tbody").html(html)
                    });

                    $(layero).on("click",".commodityValue_layer_del",function (){
                        if($(this).parent().children().length == 2){
                            $(this).parents("tr").prev().find("td:last-child").html('<a class="layui-btn layui-btn-xs layui-btn-normal commodityValue_layer_add">添加</a><a class="layui-btn layui-btn-xs layui-btn-danger commodityValue_layer_del">删除</a>')
                        }
                        $(this).parents("tr").remove()
                    })
                    $(layero).on("click",".commodityValue_layer_add",function(){
                        // let input1 = $(this).parents("tr").find(".input1").val()*1,
                        //     input2 = $(this).parents("tr").find(".input2").val()*1,
                        //     input3 = $(this).parents("tr").find(".input3").val()*1,
                        //     err = '',trDom = $(this).parents("tbody").children();
                        //
                        // if(input1 >= input2 || input1 < 0 || input2 < 0 || input3 < 0){
                        //     err = "输入数据不符合规范"
                        // }
                        // if(!input3  || input3 == ''){
                        //     err = "毛利率不能为空"
                        // }
                        // if(trDom.length > 1){
                        //     trDom.each(function (index, item) {
                        //         let i1 = $(item).find(".input1"),
                        //             i2 = $(item).find(".input2");
                        //         if(index != trDom.length-1 && (input1 < i2.val()*1 && input2 > i1.val()*1)){
                        //             err = "输入数据存在交集"
                        //         }
                        //     });
                        // }
                        let err = commodityValueLayerCheck(layero);
                        if(err){
                            layer.msg(err,{icon:7})
                        }else{
                            let str = ` <tr data-index="0">
                    <td><div style="display:flex"><input class="layui-input input1" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/> - <input class="layui-input input2" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/></div></td>
                    <td><input class="layui-input input3" onblur="handleFloat_cal(this.value,event)" placeholder="保留两位小数"/></td>
                    <td><a class="layui-btn layui-btn-xs layui-btn-normal commodityValue_layer_add">添加</a><a class="layui-btn layui-btn-xs layui-btn-danger commodityValue_layer_del">删除</a></td>
                </tr>`
                            $(this).parents("tbody").append(str)
                            $(this).remove()
                        }
                    })
                },yes: function (index, layero){
                    let newObj = [];
                    $(layero).find("tbody").find("tr").each(function (index, item) {
                        let minValue=$(item).find(".input1").val(),
                            maxValue=$(item).find(".input2").val(),
                            grossRate=$(item).find(".input3").val();
                        newObj.push({minValue, maxValue, grossRate})
                    });

                    // newObj.forEach((item,index)=>{
                    //     $(".commodityValue_layer_tbody").find(`tr:eq(${index})`).css("background","#ffffff")
                    //     if(item.minValue=='' || item.maxValue=='' || item.minValue*1 >= item.maxValue*1){
                    //         err = "数据有误或不能为空"
                    //         $(".commodityValue_layer_tbody").find(`tr:eq(${index})`).css("background","#ffe7c3")
                    //     }
                    //     if(!item.grossRate || item.grossRate == ''){
                    //         err = "毛利率不能为空"
                    //         $(".commodityValue_layer_tbody").find(`tr:eq(${index})`).css("background","#ffe7c3")
                    //     }
                    //     for(let j=index+1;j<newObj.length;j++){
                    //         if(item.minValue*1 < newObj[j].maxValue*1 && item.maxValue*1 > newObj[j].minValue*1){
                    //             err = "数据存在交集"
                    //             $(".commodityValue_layer_tbody").find(`tr:eq(${index})`).css("background","#ffe7c3")
                    //         }
                    //     }
                    // })
                    let err = commodityValueLayerCheck(layero);

                    if(err != ''){
                        return layer.msg(err)
                    }

                    var updateData = {};
                    updateData.id = data.id;
                    updateData.productValueGrossRateData = JSON.stringify({productValueGrossRateData:newObj});
                    new Ajax(true).post({
                        url: ctx + "/msgCalPriceFormula/updateProductValueGrossRateData",
                        data: JSON.stringify(updateData),
                        success: function (returnData) {
                            if (returnData.code == '0000') {
                                layer.msg("修改成功",{icon:1});
                                layer.close(popIndex);
                                $('#searchBtn_calPriceFormula').click()
                            } else {
                                layer.msg(returnData.msg,{icon:7});
                            }
                        }
                    })
                }
            })
        } else if (layEvent === 'updateListingTag') {
            if (data.platCode !== 'shopee') {
                return layer.msg("暂未接入listing标签，请联系技术部！",{icon:7});
            }
            // 获取所有商品标签
            commonReturnPromise({
                url: ctx + `/msgCalPriceFormula/editMingrossRateTagConfigPage?formulaId=${data.id}&&platCode=shoppe`
            }).then(res => {
                // 匹配商品标签的值
                for(let i=0;i < res?.length;i++){
                    data.minGrossRateTagConfigDtoList?.forEach(item => {
                        if (item.tagName == res[i].tagName) {
                            res[i]["value"] = item.minGrossRate
                        }
                    })
                }
                res.sort((a, b) => b.priority > a.priority ? -1 : 1)
                var getTpl = cpf_listingTag.innerHTML;
                laytpl(getTpl).render({"minGrossRateTagConfigDtoListArr": res}, function (html) {
                    $("#cpf_listingTagView").html(html)
                });
                var timer = null;
                var popIndex = layer.open({
                    shadeClose: false,
                    type: 1,
                    title: "在线listing标签(最低毛利)",
                    area: ["350px", "50%"],
                    btn: ['确认', '关闭'],
                    id:new Date().getTime(),
                    content: $("#cpf_listingTagView").html(),
                    success: function() {
                        toggleIcon();
                        $('.tag-input').on('input', function(val) {
                            clearTimeout(timer)
                            timer = setTimeout(() => {
                                let isHaveValArrLength = 0
                                $('.rowList').each((index, item) => {
                                    if ($(item).find('.tag-input').val()) {
                                        isHaveValArrLength++
                                    }
                                })
                                let value = val?.delegateTarget?.value
                                if (value !== '') {
                                    if (!isMoney(value) || value < 0) {
                                        layer.msg('请填写正确比例')
                                        $(this).val('')
                                        return false
                                    }
                                    let currentTr = $(this).parents('.rowList')
                                    let targetPrevTr = $('.rowList')[isHaveValArrLength - 2]
                                    $(targetPrevTr).after(currentTr)
                                    toggleIcon();
                                } else {
                                    let currentTr = $(this).parents('.rowList')
                                    let nextAll = $(currentTr).nextAll()
                                    let allTagEmpty = 0
                                    $(nextAll).each((index, item) => {
                                        if ($(item).find('.tag-input').val()) {
                                            allTagEmpty++
                                        }
                                    })
                                    if (allTagEmpty !== 0){
                                        let targetPrevTr = $('.rowList')[$('.rowList').length - 1]
                                        $(targetPrevTr).after(currentTr)
                                    }
                                    toggleIcon();
                                }
                            }, 800)
                        })
                    },
                    yes: function (index, layero) {
                        let formData = serializeObject($(layero).find("#cpf_listingTagCon"))
                        // 请求什么值，后端直接保存，前端需要回显，所以删除没有数据的值
                        
                        let idx = 0
                        let newDataList = []
                        for(let key in formData){
                            if (formData[key] !== '') {
                                idx++
                                let paramsObj = {}
                                paramsObj.tagName = key
                                paramsObj.minGrossRate = formData[key]
                                paramsObj.priority = idx;
                                newDataList.push(paramsObj)
                            }
                        }
                        
                        res?.forEach((item, index) => {
                            delete item.minGrossRate
                            delete item.priority
                            newDataList?.forEach((cItem, cIndex) => {
                                if (item.tagName === cItem.tagName) {
                                    item.minGrossRate = Number(cItem.minGrossRate)
                                    item.priority = cItem.priority
                                    item.formulaId = data.id
                                }
                            })
                        })
                        new Ajax(true).post({
                            url: ctx + "/msgCalPriceFormula/editMingrossRateTagConfig",
                            data: JSON.stringify(res),
                            success: function (returnData) {
                                if (returnData.code == '0000') {
                                    layer.msg("修改成功",{icon:1});
                                    layer.close(popIndex);
                                    $('#searchBtn_calPriceFormula').click()
                                }
                            }
                        })

                    }
                })
            })
        }
    })

    function commodityValueLayerCheck(layero){
        let newObj = [], err = '';
        $(layero).find("tbody").find("tr").each(function (index, item) {
            let minValue=$(item).find(".input1").val(),
                maxValue=$(item).find(".input2").val(),
                grossRate=$(item).find(".input3").val();
            newObj.push({minValue, maxValue, grossRate})
        });

        newObj.forEach((item,index)=>{
            $(".commodityValue_layer_tbody").find(`tr:eq(${index})`).css("background","#ffffff")
            if(item.minValue=='' || item.maxValue=='' || item.minValue*1 >= item.maxValue*1){
                err = "数据有误或不能为空"
                $(".commodityValue_layer_tbody").find(`tr:eq(${index})`).css("background","#ffe7c3")
            }
            if(!item.grossRate || item.grossRate == ''){
                err = "毛利率不能为空"
                $(".commodityValue_layer_tbody").find(`tr:eq(${index})`).css("background","#ffe7c3")
            }
            for(let j=index+1;j<newObj.length;j++){
                if(item.minValue*1 < newObj[j].maxValue*1 && item.maxValue*1 > newObj[j].minValue*1){
                    err = "数据存在交集"
                    $(".commodityValue_layer_tbody").find(`tr:eq(${index})`).css("background","#ffe7c3")
                }
            }
        })

        return err;
    }

    // 监听所有的checkbox
    form.on('checkbox(fieldBox_calPriceFormula_checkbox_filter)', function(data){
        let storeBox_checked = ``;
        let elemDom = data.elem,elemValue = data.value,elemCheck = data.elem.checked;

        if(data.elem.checked){ // 选中 true
            $(data.elem).attr("checked",true); // 将原始dom设置为选中状态，并添加到已选择店铺
            storeBox_checked += `<div class="fieldBox_calPriceFormula fieldBox_calPriceFormula_checkbox">${elemDom.outerHTML}</div>`
            $('#matchStoreForm_calPriceFormula_checked').append(storeBox_checked)
            form.render('checkbox','matchStoreForm_calPriceFormula_checked')
        }else{
            // 将所有店铺中的选中状态改为false
            $('#matchStoreForm_calPriceFormula').find(`input[type=checkbox][value=${elemValue}]`).attr("checked",false);
            form.render('checkbox','matchStoreForm_calPriceFormula')
            // 删掉已选择店铺中的店铺
            $('#matchStoreForm_calPriceFormula_checked').find(`input[type=checkbox][value=${elemValue}]`).parent().remove();
            form.render('checkbox','matchStoreForm_calPriceFormula_checked')
        }
    });

    // 匹配店铺弹框成功渲染
    function initStore_calPriceFormula(data,isstoreSerach=false) {
        var Adata = !isstoreSerach?{
            formulaId: data.id,
            platCode: data.platCode
        }:{
            formulaId: data.id,
            platCode: data.platCode,
            storeAcct: data.storeAcct
        }
        var ajax = new Ajax()
        ajax.post({
            url: ctx + "/msgCalPriceFormula/listStoreByPlatCode.html",
            data: JSON.stringify(Adata),
            contentType: 'application/json',
            success: function (data) {

                if (data.code == '0000') {
                    var list = data.data
                    if (list) {
                        var storeBox = ``,storeBox_checked = ``;
                        var store
                        for (var i =0; i < list.length; ++i) {
                            store = list[i]
                            store.ifMatch?storeBox_checked += `<div class="fieldBox_calPriceFormula fieldBox_calPriceFormula_checkbox"><input lay-filter="fieldBox_calPriceFormula_checkbox_filter" name="storeAcctId" type="checkbox" checked title="`+ store.storeName +`" lay-skin="primary" value="`+ store.storeAcctId +`" ></div>`:''
                            storeBox += `<div class="fieldBox_calPriceFormula fieldBox_calPriceFormula_checkbox"><input lay-filter="fieldBox_calPriceFormula_checkbox_filter" name="storeAcctId" type="checkbox" ` + (store.ifMatch ? `checked` : ``) + ` title="`+ store.storeName +`" lay-skin="primary" value="`+ store.storeAcctId +`" ></div>`
                        }
                        if(isstoreSerach){ // 手动搜索，默认不显示
                            $('#matchStoreForm_calPriceFormula').append(storeBox)

                            $('#matchStoreForm_calPriceFormula_checked').find('input[type=checkbox]').each(function(){
                                $('#matchStoreForm_calPriceFormula').find(`input[type=checkbox][value=${$(this).val()}]`).attr("checked",true);
                            })

                            form.render('checkbox','matchStoreForm_calPriceFormula')
                        }else{
                            $('#matchStoreForm_calPriceFormula_checked').append(storeBox_checked)
                            form.render('checkbox','matchStoreForm_calPriceFormula_checked')
                        }
                    }
                }
            }
        })
    }

    //匹配店铺的搜索
    form.on("submit(matchStoreForm_calPriceFormula_submit)",function(data){
        chooseRow["storeAcct"]=data.field.storeAcct
        $('#matchStoreForm_calPriceFormula .fieldBox_calPriceFormula_checkbox').remove()
        initStore_calPriceFormula(chooseRow,true)

    });

    // 匹配店铺弹窗的全选/全不选
    form.on('checkbox(matchStoreForm_calPriceFormula_checkAll)', function(data){
        let elemDom = data.elem,elemValue = data.value,elemCheck = data.elem.checked;

        if(elemCheck){ // 全选
            $('#matchStoreForm_calPriceFormula').find('input[type=checkbox]').each(function(index){
                if($(this).attr("checked") === "checked"|| index === 0){  // index === 0是全选的那个checkbox
                    // return false;
                }else{ // 需要添加的checkbox
                    // 先设置dom全部选中
                    $(this).attr("checked",true);
                    $('#matchStoreForm_calPriceFormula_checked').append(`<div class="fieldBox_calPriceFormula fieldBox_calPriceFormula_checkbox">${$(this)[0].outerHTML}</div>`);
                }
            })
            form.render('checkbox','matchStoreForm_calPriceFormula_checked')
        }else{ // 取消全选
            // 循环查询的所有店铺,如果选中的店铺在这个所有店铺中，删掉选中的这个店铺
            $('#matchStoreForm_calPriceFormula').find('input[type=checkbox]').each(function(index,item){
                $(this).attr("checked",false);
                $('#matchStoreForm_calPriceFormula_checked').find(`input[type=checkbox][value=${item.value}]`).parent().remove();
            })
            form.render('checkbox','matchStoreForm_calPriceFormula_checked')
        }
        // 全选&反选
        $("#matchStoreForm_calPriceFormula input[name=storeAcctId]").prop("checked",data.elem.checked)
        form.render('checkbox','matchStoreForm_calPriceFormula')
    });

    //全选
    form.on('checkbox(cpf_checkAllLogis)', function(data){
        var checked = data.elem.checked;
        $(data.elem).parents(".priceTypeItem").find("input[name=logisAttr]").prop("checked",checked);
        form.render();
    });

    // 监听搜索条件平台选择， 初始化店铺选择多选组件
    form.on('select(calPriceFormula_platCode)',function (data) {
       console.log(data)
        let platCode = data.value
        if(platCode==='shopee_cnsc'){
            platCode='shopee'
        }
        if (!calPriceFormula_platStore[platCode]) {
            oneAjax.post({
                url: '/sys/liststorebyplatcode',
                data: {platCode: platCode},
                contentType: 'application/x-www-form-urlencoded',
                success: function (res) {
                    console.log(res)
                    if (res.code === '0000') {
                        // 将当前平台的店铺数据缓存起来
                        let arr = []
                        let storeList = res.data
                        for (let i = 0; i < storeList.length; i++) {
                            arr.push({name: storeList[i].storeAcct, value: storeList[i].id})
                        }
                        calPriceFormula_platStore[platCode] = arr

                        formSelects.data( 'calPriceFormula_storeAcctIdList', 'local', {arr: arr})

                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
        } else {
            formSelects.data('calPriceFormula_storeAcctIdList', 'local',{arr: calPriceFormula_platStore[platCode]})
        }
        commonReturnPromise({
            url: ctx + "/enum/getSiteEnum.html?platCode=" + platCode,
            type: "post",
        }).then(res => {
            let arr = []
            for (let i = 0; i < res.length; i++) {
                arr.push({name: res[i].name, value: res[i].code})
            }
            formSelects.data( 'calPriceFormula_salesSite', 'local', {arr: arr})
        }).catch(function(err){
            layer.confirm(err, {
                btn: ['关闭'] //可以无限个按钮
            });
        })
    })

    // 一键复制
    $(document).off("click","[name=calPriceFormulaCopy]").on("click","[name=calPriceFormulaCopy]",function(){
        let calPriceFormulaCopyArr = []
        $.each($('#matchStoreForm_calPriceFormula_checked input[name=storeAcctId]:checked'),function(){
            calPriceFormulaCopyArr.push($(this).attr("title"))
        });
        copyTxtToClipboard(calPriceFormulaCopyArr.join())
    })
});

function toggleIcon() {
    $('.rowList').each((index, item) => {
        let val = $(item).find('.tag-input').val()
        if (val) {
            $(item).find('.layui-icon-up').show();
            $(item).find('.layui-icon-down').show();
            if (index === 0) {
                $(item).find('.layui-icon-up').hide();
            }
            let nextVal = $(item).next().find('.tag-input').val()
            if (nextVal == '') {
                $(item).find('.layui-icon-down').hide();
            }
        } else {
            $(item).find('.layui-icon-up').hide();
            $(item).find('.layui-icon-down').hide();
        }
    })
}


function moveup(dom) {
    let $this = $(dom);
    let currentTr = $this.parents('.rowList')
    let prevTr = $this.parents('.rowList').prev()
    prevTr.before(currentTr)
    toggleIcon()
}

function movedown(dom) {
    let $this = $(dom);
    let currentTr = $this.parents('.rowList')
    let nextTr = $this.parents('.rowList').next()
    nextTr.after(currentTr)
    toggleIcon()
}

function handleFloat_cal (val, event) {
    if(val != ''){
        let newVal = Math.floor(val*100)/100
        event.target.value = newVal
    }
}

function handleFloat_test (val, event) {
    $(event.target).parents("tr").find(".res").html("<span style='color:red'>未测试</span>")
    let trData = $(event.target).parents("tr").data("tr") || {};
    trData.status = false
    $(event.target).parents("tr").data("tr",trData)
    // $(event.target).parents("tr").attr("data-tr",JSON.stringify(trData))
}