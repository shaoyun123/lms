
layui.use(['form', 'admin', 'table', 'layer', 'element', 'laypage', 'laydate', 'formSelects'], function() {
    let form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        layer = layui.layer;

    form.render('select');
    laydate.render({
        elem: '#makecomb_time',
        type: 'date',
        range: true
    });

    // 查询
    $("#makecomb_searchBtn").click(function () {
        let data = serializeObject($('#makecombForm'));
        makecombTableorder(data)
    });
    // 页签切换
    element.on('tab(makecomb_Tab)', function (data) {
        let searchForm = $('#makecombForm');
        let status = data.elem.context.dataset.status;
        searchForm.find('[name="processStatus"]').val(status);
        console.log(11)
        let Adata = serializeObject(searchForm);
        makecombTableorder(Adata)
    })

    $('#LAY-makecomb').on('focus','.layui-table-edit',function (even) {
        console.log(even)
        even.target.select()
    })

    //渲染表格数据
    function makecombTableorder(data) {
        let col = []
        switch (data.processStatus) {
            case '1':
                col = [
                    [
                        {title: "商品SKU", field: 'sSku',rowspan:2},
                        {title: "仓库", field: 'storeName',rowspan:2},
                        {title: "可用数量", field: 'availableAmount',rowspan:2},
                        {title: "需要发货数量", field: 'needAmount',rowspan:2},
                        {title: "包装规格", field: 'winitPackSpec',rowspan:2},
                        {title: "组合品明细", colspan: 5},
                        {title: "加工数量(点击可编辑)", field: "makeAmount",edit: 'text',style:"background-color: #7FFFD4;",rowspan: 2},
                        { title: "操作", align: "center", toolbar: "#makecomb_TableBar",rowspan: 2},
                    ],
                    [
                        {title: "基础商品sku", templet: '#makeComb_combDetail_sku'},
                        {title: "单位", templet: '#makeComb_combDetail_unit'},
                        {title: "组合数量", templet: '#makeComb_combDetail_num'},
                        {title: "基础商品库位", templet: '#makeComb_combDetail_locationCode'},
                        {title: "商品可用数量", templet: '#makeComb_combDetail_availableAmount'},
                    ]
                ]
                break
            case '2':
                col = [[
                    {title: "仓库", field: 'storeName'},
                    {title: "商品SKU", field: 'sSku'},
                    {title: "组合品明细", templet: '#makeComb_hadMake_combDetail'},
                    {title: "加工数量", field: 'makeAmount'},
                    {title: "加工人", field: 'maker'},
                    {title: "加工时间", templet: '<div>{{Format(d.makeTime,"yyyy-MM-dd hh:mm:ss")}}</div>'},
                ]]
                break
        }
        table.render({
            elem: '#makecomb_table',
            method: 'POST',
            url: ctx + '/winitPlanCombMake/queryPage.html',
            where: data,
            cols: col,
            page: true,
            limit: 50,
            limits: [50, 100, 500],
            id: 'makecomb_table',
            created: function (res) {
                if (res.code === '0000') {
                    if (data.processStatus === '1') {
                        let list = res.data
                        let makeAmount
                        for (let i = 0; i < list.length; ++i) {
                            let min
                            let combList = list[i].combDetailDtoList
                            for (let j = 0; j < combList.length; ++j) {
                                makeAmount = Math.floor(((combList[j].whStock.currentStock || 0) - (combList[j].whStock.reservationStock || 0)) / combList[j].prodDetailNums)
                                if (!min || min > makeAmount) {
                                    min = makeAmount
                                }
                            }
                            list[i].maxMakeAmount = min // 记录最大可生产数
                            // 设置加工数量
                            list[i].makeAmount = list[i].needAmount - list[i].availableAmount > min ? min : list[i].needAmount - list[i].availableAmount
                        }
                    }
                }
            },
            done: function (res) {
                imageLazyload();
                switch (data.processStatus) {
                    case '1' : $('#makecomb_waitMakeCountSpan').text('(' + res.count + ')')
                        break
                    case '2' : $('#makecomb_HadMakeCountSpan').text('(' + res.count + ')')
                        break
                }
            }
        })
    }

    // 监听表格点击事件
    table.on('tool(makecomb_table)', function(obj) {
        let data = obj.data;
        if (obj.event === "make") {
            if (data.makeAmount === 0 || data.makeAmount === '0') {
                layer.msg('本次配货数量必须是正整数')
                return
            }
            if (!data.makeAmount) {
                layer.msg('请填写本次配货数量')
                return
            }
            if (!isInteger(data.makeAmount)) {
                layer.msg('本次配货数量必须是正整数')
                return
            }
            data.makeAmount = parseInt(data.makeAmount)
            if (data.makeAmount > data.maxMakeAmount) {
                layer.msg('根据库存计算，最大可生产数量为' + data.maxMakeAmount)
                return
            }


            let popIndex = layer.confirm('确认生产？',{btn: ['确认','取消']},function () {
                let Adata = {
                    prodSId : data.prodSId,
                    makeAmount: data.makeAmount
                }
                let ajax = new Ajax(true);
                ajax.post({
                    url: ctx + "/winitPlanCombMake/makeComb.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    success: function (res) {
                        if (res.code === '0000') {
                            let combDetail = ''
                            for (let i = 0; i < data.combDetailDtoList.length; ++i) {
                                combDetail += data.combDetailDtoList[i].sSku + '*' + data.combDetailDtoList[i].prodDetailNums + ';'
                            }
                            // 打印组合品标签
                            let time = Format(new Date(),'yyyy-MM-dd')
                            printStandard({
                                jspaper: 'combDetail6040.jasper',
                                printDetailDtoList:[{
                                    titleMap : {
                                        "prodSSku" : res.data.sSku,
                                        "prodName" : res.data.title,
                                        "inPackType" : res.data.inPackType || '',
                                        "develop" : res.data.parent.bizzOwner,
                                        "combDetail" : combDetail,
                                        "time" : time,
                                    }, // 要打印的参数 - 要和所设计的面单参数 一样
                                    amount: 3 // 需要打印的份数, 不填默认为1
                                }]
                            })
                            // 重载表格
                            table.reload('makecomb_table')
                        }
                    }
                })
                layer.close(popIndex)
            })
        }
    });

});
