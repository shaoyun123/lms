layui.use(['form', 'admin', 'table', 'layer', 'element', 'laypage', 'laydate', 'formSelects'], function() {
    let form = layui.form,
        table = layui.table,
        element = layui.element,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        layer = layui.layer;
    // 初始化选择项
    form.render('select');
    // 初始化时间组件
    laydate.render({elem: '#processFbaDevForm [name=devSubmitTime]', type: 'date', range: true});
    laydate.render({elem: '#processFbaDevForm [name=tempAuditTime]', type: 'date', range: true});
    // 初始化人员选项
    render_hp_orgs_users("#processFbaDev_salesPersonIdListDiv"); //渲染部门销售员店铺三级联动
    render_hp_orgs_users("#processFbaDev_developerIdListDiv"); //渲染部门销售员店铺三级联动
    // 检查是否有跳转参数
    initSearchParam('#processFbaDevForm')
    // 查询
    $("#processFbaDev_searchBtn").click(function () {
        let data = serializeObject($('#processFbaDevForm'));
        console.log(data)
        if (data.amazonSaler_orgId && !data.salesPersonIdListStr) {
            data.salesPersonIdListStr = $('#processFbaDev_salesPersonIdListStr').attr('user_ids')
        }
        if (data.developer_orgId && !data.developerIdListStr) {
            data.developerIdListStr = $('#processFbaDev_developerIdListStr').attr('user_ids')
        }
        processFbaDevTableorder(data)
    });

    //渲染表格数据
    function processFbaDevTableorder(data) {
        let col = [
            [
                { checkbox: true, rowspan: 2, width:30},
                { field: 'prodPId',title: "父SKU1",  rowspan:2, templet: '#processFbaDev_pSkuTpl',width: 120},
                { field: 'salesPerson',title: "人员",  rowspan:2, templet: '#processFbaDev_personTpl',width: 110},
                { field: 'cnName',title: "中文名", rowspan:2, templet: '#processFbaDev_cnTitleTpl',width: 120},
                { title: "子商品", colspan: 5 },
                { field: 'purBillNumber', title: "流程", rowspan:2, templet: '#processFbaDev_timeTpl',width: 220},
                { field: 'shipmentId', title: "货件", rowspan:2, templet: '#processFbaDev_shipmentTpl',width: 155},
                { field: 'auditStatus', title: "Listing优化", rowspan:2, templet: '#processFbaDev_ListingTpl',width: 155},
                { field: 'hasCpc', title: "CPC", rowspan:2, templet: '#processFbaDev_CPCTpl',width: 155},
                { field: 'salesRemark', title: "销售备注(点击可修改)", rowspan:2, edit: 'text', style:"background-color: #7FFFD4;"},
                { title: "操作", align: "center", toolbar: "#processFbaDev_TableBar",rowspan: 2}
            ],
            [   { field: 'prodSId',title: "子sku", templet: '#processFbaDev_subDetail_sSku',width: 120},
                { field: 'deliverAmount',title: "发货数量", templet: '#processFbaDev_subDetail_deliverAmount',width: 60},
                { field: 'asin',title: "ASIN", templet: '#processFbaDev_subDetail_asin',width: 120},
                { field: 'syncDate',title: "同步时间", templet: '#processFbaDev_subDetail_syncDate',width: 120},
                { field: 'weight',title: "发货重量(kg)", templet: '#processFbaDev_subDetail_weight',width: 80}
            ]
        ]
        table.render({
            elem: '#processFbaDev_table',
            method: 'POST',
            url: ctx + '/processFbaDev/queryPage.html',
            where: data,
            cols: col,
            page: true,
            limit: 50,
            limits: [50, 100, 500],
            id: 'processFbaDev_table',
            done: function (res) {
                imageLazyload();
            }
        })
    }


    /**
     * 导出操作
     */
    $("#processFbaDev_exportBtn").click(function () {
        layer.confirm('导出当前条件的数据信息？', function (result) {
            if (result) {
                let data = serializeObject($('#processFbaDevForm'));
                if (data.amazonSaler_orgId && !data.salesPersonIdListStr) {
                    data.salesPersonIdListStr = $('#processFbaDev_salesPersonIdListStr').attr('user_ids')
                }
                if (data.developer_orgId && !data.salesPersonIdListStr) {
                    data.developerIdListStr = $('#processFbaDev_developerIdListStr').attr('user_ids')
                }
                submitForm(data, ctx + '/processFbaDev/exportProcessFbaDev.html', "_blank");
                layer.closeAll();
            }
        });
    });

    function reloadTable() {
        let data = serializeObject($('#processFbaDevForm'));
        table.reload('processFbaDev_table', {
            page: {
                curr: 1
            },
            where: data
        })
    }
    // 监听表格修改事件
    table.on('edit(processFbaDev_table)', function(obj) {
        var value = obj.value //得到修改后的值
            , data = obj.data //得到所在行所有键值
            , field = obj.field; //得到字段

        var AData = {
            id : data.id
        }
        AData[field] = value
        loading.show()
        $.ajax({
            url: ctx + "/processFbaDev/updateField.html",
            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(AData),
            success: function(res) {
                loading.hide()
                if (res.code === '0000') {
                    layer.msg('修改成功')
                } else {
                    layer.msg(res.msg)
                }
            },
            error: function () {
                loading.hide()
            }
        })
    })

    // 监听表格点击事件
    table.on('tool(processFbaDev_table)', function(obj) {
        let data = obj.data;
        switch (obj.event){
            case 'distributeSalesPerson':
                processFbaDev_distributeSalesPerson(data,[data.id]);
                break
            case 'edit':
                processFbaDev_processFbaDev_edit(data);
                break
            case 'requireAudit':
                processFbaDev_processFbaDev_requireAudit(data);
                break
            case 'audit':
                processFbaDev_processFbaDev_audit(data);
                break
            case 'completeCPC':
                processFbaDev_processFbaDev_completeCPC(data);
                break
        }
    });
    $('#processFbaDev_distributeSalesPersonForListBtn').click(function () {
        var checkStatus = table.checkStatus('processFbaDev_table'),
            data = checkStatus.data;
        if (!data || data.length == 0) {
            layer.msg('请选择产品')
            return
        }
        var idList = []
        for (var i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        processFbaDev_distributeSalesPerson({},idList)
    })

    // 分配销售
    function processFbaDev_distributeSalesPerson(data,idList) {
        let formEle
        let popIndex = layer.open({
            type: 1,
            title: '分配销售员',
            btn: ['保存','关闭'],
            area:['30%','500px'],
            content: $('#processFbaDev_distributeSalesPersonLayer').html(),
            success: function(layero, index) {
                formEle = $('#processFbaDev_distributeSalesPersonForm')
                let arr = getAllOptionsForMultiSelector('processFbaDev_salesPersonIdListStr')
                let options = '<option></option>'
                for (let i = 0; i < arr.length; ++i) {
                    options += '<option value="'+ arr[i].value +'">' + arr[i].name + '</option>'
                }
                formEle.find('[name=salesPersonId]').append(options)
                formEle.find('[name=salesPersonId]').val(data.salesPersonId)
                form.render('select','processFbaDev_distributeSalesPersonForm')
                initNotNull("#processFbaDev_distributeSalesPersonForm")
            },
            yes: function () {
                let Adata = serializeObject(formEle)
                if (!checkNotNull('#processFbaDev_distributeSalesPersonForm')) {
                    return false;
                }
                Adata.idList = idList
                Adata.salesPerson = formEle.find('[name=salesPersonId] option:selected').text()
                let ajax = new Ajax();
                ajax.post({
                    url: ctx + '/processFbaDev/distributeSales.html',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.close(popIndex)
                            reloadTable()
                        }
                    }
                })
            }
        })
    }
    // 修改信息
    function processFbaDev_processFbaDev_edit(data) {
        let formEle,inpDiv
        let popIndex = layer.open({
            type: 1,
            title: '修改信息',
            btn: ['保存','关闭'],
            area:['30%','60%'],
            content: $('#processFbaDev_editLayer').html(),
            success: function(layero, index) {
                formEle = $('#processFbaDev_editForm')
                // 初始化asin填写框
                inpDiv = $('#processFbaDev_skuAsinEditDiv')
                let divs = ''
                for (let i = 0; i < data.subDetailList.length; ++i) {
                    divs += `
                    <div class="layui-col-md10 layui-col-lg10"notNull>
                        <label class="layui-form-label">`+ data.subDetailList[i].sSku +`的ASIN</label>
                        <div class="layui-input-block">
                            <input data-priceId="`+ data.subDetailList[i].id +`" value="` + (data.subDetailList[i].asin || '') +`" class="layui-input" maxlength="10">
                        </div>
                    </div>
                    `
                }
                inpDiv.append(divs)
                // 复现数据
                formEle.find('[name=shipmentId]').val(data.shipmentId)
                formEle.find('[name=purBillNumber]').val(data.purBillNumber)
            },
            yes: function () {
                let Adata = serializeObject(formEle)
                Adata.id = data.id
                let inps = inpDiv.find('[data-priceId]')
                let subDetailList = []
                for (let i = 0; i < inps.length; ++i) {
                    subDetailList.push({
                        id: inps[i].getAttribute('data-priceId'),
                        asin: inps[i].value
                    })
                }
                Adata.subDetailList = subDetailList
                let ajax = new Ajax();
                ajax.post({
                    url: ctx + '/processFbaDev/editAndSetAsin.html',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.close(popIndex)
                            reloadTable()
                        }
                    }
                })
            }
        })
    }
    // 提交审核
    function processFbaDev_processFbaDev_requireAudit(data) {
        let confirmIndex = layer.confirm('确认提交审核吗',{btn: ['确认','取消']}, function () {
            let Adata = {
                id: data.id
            }
            let ajax = new Ajax()
            ajax.post({
                url: ctx + '/processFbaDev/requireAudit.html',
                data: JSON.stringify(Adata),
                success: function (res) {
                    layer.close(confirmIndex)
                    reloadTable()
                }
            })
        })
    }
    // 审核
    function processFbaDev_processFbaDev_audit(data) {
        let formEle
        let popIndex = layer.open({
            type: 1,
            title: '审核',
            btn: ['保存','关闭'],
            area:['40%','50%'],
            content: $('#processFbaDev_auditLayer').html(),
            success: function(layero, index) {
                formEle = $('#processFbaDev_auditForm')
                form.render('select','processFbaDev_auditForm')
            },
            yes: function () {
                let Adata = serializeObject(formEle)
                Adata.id = data.id
                let ajax = new Ajax();
                ajax.post({
                    url: ctx + '/processFbaDev/audit.html',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.close(popIndex)
                            reloadTable()
                        }
                    }
                })
            }
        })
    }
    // 完成CPC
    function processFbaDev_processFbaDev_completeCPC(data) {
        let confirmIndex = layer.confirm('确认完成CPC吗',{btn: ['确认','取消']}, function () {
            let Adata = {
                id: data.id
            }
            let ajax = new Ajax()
            ajax.post({
                url: ctx + '/processFbaDev/completeCPC.html',
                data: JSON.stringify(Adata),
                success: function (res) {
                    layer.close(confirmIndex)
                    reloadTable()
                }
            })
        })
    }

});

function routerToAmazonProd(site, asin) {
    window.open(getAmazonProdPagePrex(site) + asin)
}