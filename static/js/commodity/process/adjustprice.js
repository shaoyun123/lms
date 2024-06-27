layui.use(['admin', 'layer', 'form', 'table', 'laydate', 'element', 'selectN', 'laypage', 'formSelects'], function() {
    let admin = layui.admin,
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        $ = layui.$;

    formSelects.render('adjustprice_auditorIdListStr')

    formSelects.render('adjustprice_bizzOwnerIdListStr')

    formSelects.render('adjustprice_creatorIdListStr')
    
    // 初始化采购员可选选项
    initPersonSelect('adjustprice_buyerIdListStr','adjustprice_priceSearchForm','采购专员',formSelects)
    
    // 初始化审核人可选选项
    initSelectByAjax('/prodPriceAdjustNotice/getAllAuditor',null,{name: 'auditor',value: 'auditor_id'},'adjustprice_auditorIdListStr',formSelects,null,null)
    // 初始化开发专员
    // initPersonSelect('adjustprice_bizzOwnerIdListStr','adjustprice_priceSearchForm','开发专员',formSelects)
    //修改人可选项
    initSelectByAjax('/prodPriceAdjustNotice/getLast30DaysCreator',null,{name: 'creator',value: 'creator_id'},'adjustprice_creatorIdListStr',formSelects,null,null)
    
    //日期范围
    laydate.render({
        elem: '#adjustprice_timeRange',
        range: true
    });
    form.render('select');
    // 初始化 组织-人员选择框
    render_hp_orgs_users('#adjustprice_priceSearchForm')
    // 初始化 开发专员查询项为 当前登录人
    initPersonCondition(['开发专员'],['开发组长', '开发主管'],$('#adjustprice_priceSearchForm [name=userId]'), 'id')

    //展示已知数据
    function search(data) {
        table.render({
            elem: "#adjustprice_table",
            method: 'post',
            url: ctx + "/prodPriceAdjustNotice/queryPage",
            even: true,
            cols: [[
                {type: "checkbox"},
                { title: "创建时间", templet: '<div>{{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 150 },
                { title: "商品创建时间", templet: '<div>{{Format(d.prodCreateTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 150 },
                { title: "审核时间", templet: '<div>{{Format(d.auditTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 150 },
                { field: "sSku", title: "商品SKU", width: 130 },
                { field: "buyer", title: "采购员" },
                { field: "responsor", title: "责任人" },
                { field: "bizzOwner", title: "开发专员" },
                { field: "creator", title: "修改人" },
                { field: "originCost", title: "原采购成本", width: 80 },
                { field: "newCost", title: "新采购成本", width: 80 },
                { field: "costDiff", title: "<div title='新采购成本-原采购成本'>成本差值</div>", width: 80, templet: '<div>{{accSub(d.newCost,d.originCost)}}</div>',style: 'background-color: rgba(66,200,238,0.2)', sort: true },
                { field: "originWeight", title: "原商品毛重(g)", width: 80 },
                { field: "newWeight", title: "新商品毛重(g)", width: 80 },
                { field: "weightDiff", title: "<div title='新商品毛重-原商品毛重'>毛重差值</div>", width: 80, templet: '<div>{{accSub(d.newWeight,d.originWeight)}}</div>',style: 'background-color: rgba(66,200,238,0.2)', sort: true },
                { field: "auditStatus", title: "审核状态", templet: function (d) {
                    let name = ''
                    let color = ''
                    switch (d.auditStatus) {
                        case 0: name = '待审核';color='grey';break;
                        case 1: name = '审核通过';color='#009688';break;
                        case 2: name = '审核失败';color='red';break;
                    }
                    return '<div style="color: '+ color +'">'+ name +'</div>'
                } },
                { field: "auditor", title: "审核人" },
                { field: "auditRemark", title: "备注" },
                { title: '操作', width: 150, align: 'center', toolbar: '#adjustprice_Bar' }
            ]],
            page: true,
            where: data,
            id: "adjustprice_table",
            limits: [100, 500, 1000],
            limit: 100,
            done: function(res, curr, count) {
            }
        });
    }

    table.on('sort(adjustprice_table)', function(obj) {
        let orderBy = ''
        if (!obj.type) {
            orderBy = ''
        } else {
            switch (obj.field){
                case "costDiff": 
                    if (obj.type === 'asc') {
                        orderBy = 1;
                    }
                    if (obj.type === 'desc') {
                        orderBy = 2;
                    }
                    break;
                case "weightDiff": 
                    if (obj.type === 'asc') {
                        orderBy = 3;
                    }
                    if (obj.type === 'desc') {
                        orderBy = 4;
                    }
                    break;
            }
        }
        $('#adjustprice_priceSearchForm').find('[name=orderBy]').val(orderBy)

        let data = getsearchPram()
        search(data)
    });

    $("#adjustprice_priceSearchBtn").click(function() {
        let data = getsearchPram()
        search(data)
    });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(adjustprice_table)', function(obj) {
        let data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        let id = data.id;
        if (layEvent === 'audit') {
            audit([data.id])
        }
    });

    function getsearchPram(){
        let data = serializeObject($('#adjustprice_priceSearchForm'))
        if (data.timeRange) {
            let arr = data.timeRange.split(' - ')
            data.beginTime = arr[0]
            data.endTime = arr[1]
        }
        
        // 查询人员设置
        if (data.organize || data.userId) {
            if (data.userId) { // 如果选了人，则只查询这个人的。
                data[data.userType] = data.userId
            } else { // 如果选了部门没选人，则查询整个部门的
                let userIdList = []
                let options = $('#adjustprice_priceSearchForm').find('[name=userId] option')
                let value
                for (let i = 0; i < options.length; ++i) {
                    value = options[i].getAttribute('value')
                    if (value) {
                        userIdList.push(parseInt(value))
                    }
                }
                data[data.userType] = userIdList.join(',')
            }
        }
        return data
    }

    $('#adjustprice_export').click(function () {
        let exportIndex = layer.confirm('确认根据查询条件导出调价通知?',{btn:['确认','取消']},function () {
            let data = getsearchPram()
            let checkStatus = table.checkStatus('adjustprice_table'),
                selectedDtoList = checkStatus.data
            if (selectedDtoList.length > 0) {
                let idList = []
                for (let i = 0; i < selectedDtoList.length; ++i) {
                    idList.push(selectedDtoList[i].id)
                }
                data.idList = idList
            }
            submitForm(data, ctx + '/prodPriceAdjustNotice/export', '_blank')
            layer.close(exportIndex)
        })
    })

    $('#adjustprice_batchAudit').click(function () {
        let checkStatus = table.checkStatus('adjustprice_table'),
            selectedDtoList = checkStatus.data
        let idList = []
        for (let i = 0; i < selectedDtoList.length; ++i) {
            idList.push(selectedDtoList[i].id)
        }
        audit(idList)
    })

    function audit(idList) {
        if (!idList || !idList.length) {
            layer.msg('请选择需要审核的通知')
            return
        }
        let index = layer.open({
            type: 1,
            title: "审核",
            shade: 0.2, //遮罩透明度
            area: ["800px", "300px"],
            content: $("#adjustprice_auditPop").html(),
            btn: ['保存', '关闭'],
            success: function () {
              form.render('select','adjustprice_auditForm')
            },
            yes: function(index, layero) {
                let Adada = serializeObject($('#adjustprice_auditForm'))
                Adada.idList = idList
                oneAjax.post({
                    url: '/prodPriceAdjustNotice/audit',
                    data: Adada,
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('操作成功')
                            layer.close(index)
                            refreshTable()
                        }
                    }
                })
            }
        });
    }
    $('#adjustprice_editThreshold').click(function () {
        let index = layer.open({
            type: 1,
            title: "修改审核参数",
            shade: 0.2, //遮罩透明度
            area: ["800px", "600px"],
            content: $("#adjustprice_editThresholdPop").html(),
            btn: ['保存', '关闭'],
            success: function () {
                table.render({
                    elem: "#adjustprice_thresholdTable",
                    method: 'post',
                    url: ctx + "/prodPriceAdjustNotice/queryThreshold",
                    cols: [[
                        { title: "变化", templet: function (threshold) {
                            let title = '商品'
                            switch (threshold.fieldType){
                                case 1 : title += '成本';break;
                                case 2 : title += '重量';break;
                            }
                            title += '变动'
                            switch (threshold.type){
                                case 1 : title += '差值(绝对值)';break;
                                case 2 : title += '比例';break;
                            }
                                return '<div>'+ title +'</div>'
                            }
                        },
                        { title: "关系", templet: '<div>&gt;<input type="hidden" name="id" value="{{d.id}}"></div>',width: 60 },
                        { title: "数值", templet: '<div><input class="layui-input" name="minChange" value="{{d.minChange}}"></div>'}
                    ]],
                    page: false,
                    where: {platCode: 'prod'},
                    id: "adjustprice_thresholdTable",
                    limit: false,
                    done: function(res, curr, count) {
                    }
                });
            },
            yes: function (index, layero) {
                // 获取参数值
                let trs = $('#adjustprice_editThresholdForm').find('tbody tr')
                let list = []
                for (let i = 0; i < trs.length; ++i) {
                    let tr = $(trs[i])
                    list.push({
                        id: tr.find('[name=id]').val(),
                        minChange: tr.find('[name=minChange]').val()
                    })
                }
                console.log(list)
                // 校验数值
                for (let i in list) {
                    let one = list[i]
                    if (!one.minChange || !isMoney(one.minChange)) {
                        layer.msg('请填写正确的数值')
                        return
                    }
                }
                oneAjax.post({
                    url: '/prodPriceAdjustNotice/updThresholdList',
                    data: list,
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('修改成功')
                            layer.close(index)
                        }
                    }
                })
            }
        })
    })

})