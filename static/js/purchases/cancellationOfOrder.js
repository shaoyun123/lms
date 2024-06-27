//模块引入 类似于 requirejs
layui.use(['admin', 'form', 'table', 'layer', 'laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.laydate
    form.render('select')
    //日期时间选择器
    laydate.render({
        elem: '#loweringNotice_createTime'
    })
    //降价通知的命名空间
    var loweringNoticeName = {
        //data-sendAjax-tableRender-watchBar(处理表格)
        data: function (data) {//需要提交给后台的对象
            var obj = {
                'buyerId': data.loweringNotice_buyerId,
                'integratorId': data.loweringNotice_integratorId,
                'developerId': data.loweringNotice_developerId,
                'isSale': data.loweringNotice_isSale,
                'skuType': data.loweringNotice_skuType,
                'sku': data.loweringNotice_sku,
                'createTime': data.loweringNotice_createTime,
                'dealRemark': data.loweringNotice_dealRemark,
                'dealStatus': data.loweringNotice_dealStatus,
                'dealType': data.loweringNotice_dealType
            }
            return obj
        },
        getColByDealType: function (dealType) {
            switch (dealType) {
                case '1':
                    return [ //表头
                        { type: 'checkbox' }
                        , { title: '图片', templet: '#loweringNotice_table_img',width: 80 }
                        , { title: 'SKU', templet: '#loweringNotice_table_sSku' }
                        , { field: 'sTitle', title: '商品名称' }
                        , { field: 'buyer', title: '采购专员',width: 80 }
                        , { field: 'integrator', title: '整合专员',width: 80 }
                        , { field: 'bizzOwner', title: '开发专员',width: 80 }
                        , { field: 'originPrice', title: '1688原价(￥)' }
                        // , { field: 'purchaseCostPrice', title: '采购价(￥)' }
                        , {
                            title: '1688新价(￥)',
                            templet: '<div><a href="{{d.purchaseUrl}}" target="_blank" style="color: #1e9fff;cursor:pointer;">{{d.newPrice || ""}}</a></div>'
                        }
                        , { field: 'createTime', title: '创建时间', templet: '<div>{{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>'}
                        , { field: 'dealRemark', title: '处理备注' }
                        , { title: '操作', align: 'center', toolbar: '#loweringNotice_tableIdBar' }
                    ]
                case '2':
                    return [ //表头
                        { type: 'checkbox' }
                        , { title: '图片', templet: '#loweringNotice_table_img',width: 80 }
                        , { title: 'SKU', templet: '#loweringNotice_table_sSku' }
                        , { field: 'sTitle', title: '商品名称' }
                        , { field: 'buyer', title: '采购专员',width: 80 }
                        , { field: 'integrator', title: '整合专员',width: 80 }
                        , { field: 'bizzOwner', title: '开发专员',width: 80 }
                        , { field: 'createTime', title: '创建时间', templet: '<div>{{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>'}
                        , { field: 'dealRemark', title: '处理备注' }
                        , { title: '操作', align: 'center', toolbar: '#loweringNotice_tableIdBar' }
                    ]
                case '3':
                    return [ //表头
                        { type: 'checkbox' }
                        , { title: '图片', templet: '#loweringNotice_table_img',width: 80 }
                        , { title: 'SKU', templet: '#loweringNotice_table_sSku' }
                        , { field: 'sTitle', title: '商品名称' }
                        , { field: 'buyer', title: '采购专员',width: 80 }
                        , { field: 'integrator', title: '整合专员',width: 80 }
                        , { field: 'bizzOwner', title: '开发专员',width: 80 }
                        , { field: 'originPurPrice', title: '商品采购成本(￥)' }
                        , { field: 'purPrice', title: '本次采购单价(￥)' }
                        , { field: 'billNumber', title: '采购单号' }
                        , { field: 'createTime', title: '创建时间', templet: '<div>{{Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>'}
                        , { field: 'dealRemark', title: '处理备注' }
                        , { title: '操作', align: 'center', toolbar: '#loweringNotice_tableIdBar' }
                    ]
            }
        },
        tableRender: function (data) {
            let _this = this
            let obj = _this.data(data)
            let col = _this.getColByDealType(obj.dealType)
            console.log(col)
            table.render({
                elem: '#loweringNotice_table',
                method: 'post',
                url: '/lms/prodCutPriceNotice/list',
                where: obj,
                cols: [
                    col
                ],
                page: true,
                id: 'loweringNotice_tableId',
                limits: [50, 100, 300],
                limit: 50,
                done: function (data) {
                    //监听操作的处理按钮
                    _this.watchBar()
                    //监听批量操作
                    _this.batchHandle()
                    //表头固定
                    $('#loweringNotice_table').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
                    _this.countByType(obj)
                }
            })
        },
        countByType: function (data) {
            $.ajax({
                type: 'post',
                data: data,
                url: '/lms/prodCutPriceNotice/countByType',
                success: function (res) {
                    if (res.code = '0000') {
                        var mapList = res.data
                        $('.numCount_loweringNotice').find('span').text(0)
                        for (var i = 0; i < mapList.length; ++i) {
                            $('.numCount_loweringNotice[data-code='+ mapList[i].deal_type +']').find('span').text(mapList[i].num || 0)
                        }
                    }
                },
                error: function (err) {
                    layer.msg('请求错误')
                }
            })
        },
        watchBar: function () {
            var _this = this
            table.on('tool(loweringNotice_tableFilter)', function (obj) {
                if (obj.event == 'loweringNotice_deal') {
                    var data = obj.data
                    var id = data.id
                    var status = data.dealStatus //处理状态
                    var remark = data.dealRemark //处理备注
                    var index = layer.open({
                        type: 1,
                        title: '降价处理',
                        id: 'lowering_tableIdBarLayer',
                        area: ['50%', '50%'],
                        btn: ['保存', '关闭'],
                        content: $('#loweringNotice_tableIdDeal').html(),
                        success: function (layero, index) {
                            form.render('radio')
                            layero.find('input[name=id]').val(id)
                            layero.find('[name=dealRemark]').val(remark)
                            var inps = $('#lowering_tableIdBarLayer [name=dealStatus]')
                            $(inps[status - 1]).next().trigger('click')
                            _this.layerFormSubmit()
                        },
                        yes: function () {
                            $('[lay-filter=loweringNotice_tableIdDeal_submit]').trigger('click')
                        },
                        end: function () {
                            $('#loweringNotice_tableIdDeal_form').trigger('reset')
                        },

                    })
                }
            })
        },
        batchHandle: function () {
            var _this = this
            $('#loweringNotice_batchHandle').on('click', function () {
                var datas = table.checkStatus('loweringNotice_tableId').data
                if (!datas.length) {
                    layer.msg('请先选中需要处理的数据')
                    return false
                }
                var idsArr = []
                for (var i = 0; i < datas.length; i++) {
                    var data = datas[i]
                    idsArr.push(data.id)
                }
                var ids = idsArr.join(',')
                var index = layer.open({
                    type: 1,
                    title: '降价处理(批量)',
                    id: 'lowering_tableIdBarLayerBatch',
                    area: ['50%', '50%'],
                    btn: ['保存', '关闭'],
                    content: $('#loweringNotice_tableIdDeal').html(),
                    success: function (layero, index) {
                        layero.find('input[name=type]').val(1)
                        layero.find('input[name=id]').val(ids)
                        layero.find('[name=dealRemark]').val()
                        form.render('radio')
                        _this.layerFormSubmit()//注册form监听
                    },
                    yes: function () {
                        $('[lay-filter=loweringNotice_tableIdDeal_submit]').trigger('click')
                    },
                    end: function () {
                        $('#loweringNotice_tableIdDeal_form').trigger('reset')
                    },

                })
            })
        },
        layerFormSubmit: function () {
            var _this = this
            form.on('submit(loweringNotice_tableIdDeal_submit)', function (data) {
                loading.show()
                var obj = data.field
                $.ajax({
                    type: 'post',
                    data: obj,
                    url: '/lms/prodCutPriceNotice/handle',
                    success: function (res) {
                        loading.hide()
                        if (res.code == '0000') {
                            layer.closeAll()
                            layer.msg('处理成功!', { icon: 1 })
                            _this.tableRender({})
                        } else {
                            layer.msg('处理失败!', { icon: 5 })
                        }
                    },
                    error: function () {
                        loading.hide()
                        layer.msg('后台请求报错', { icon: 5 })
                    }
                })
                return false
            })
        },
        //initPersonByType-initAjax(初始化专员)
        initPersonByType: function (type) {
            var _this = this
            switch (type) {
                case 1:
                    _this.initAjax(1, 'select[name=loweringNotice_buyerId]') //采购人员
                    break
                case 2:
                    _this.initAjax(2, 'select[name=loweringNotice_integratorId]') //整合人员
                    break
                case 3:
                    _this.initAjax(3, 'select[name=loweringNotice_developerId]') //开发人员
                    break
            }
        },
        initAjax: function (val, ele) {
            $.ajax({
                type: 'post',
                data: { type: val },
                async: true,
                url: '/lms/prodCutPriceNotice/query/assign/user',
                success: function (res) {
                    if (res.code = '0000') {
                        var data = res.data
                        var str = '<option value="">全部</option>'
                        for (var i = 0; i < data.length; i++) {
                            str += '<option value=' + data[i].id + '>' + data[i].userName + '</option>'
                        }
                        $(ele).html(str)
                        form.render('select')
                    }
                },
                error: function (err) {
                    layer.msg('请求错误')
                }
            })
        }
    }
    //采购专员-整合专员-开发专员初始化
    loweringNoticeName.initPersonByType(1)
    loweringNoticeName.initPersonByType(2)
    loweringNoticeName.initPersonByType(3)
    //监听表单的提交事件
    form.on('submit(loweringNotice_submit)', function (data) {
        var data = data.field //获取到表单提交对象
        if (data.loweringNotice_sku.split(',').length > 1000) {
            layer.msg('搜索的sku长度不能超过1000', { icon: 5 })
            return false
        }
        loading.show()
        loweringNoticeName.tableRender(data)//渲染表格
        return false
    })
    //首先触发搜索按钮
    $('[lay-filter=loweringNotice_submit]').trigger('click')

    $('.numCount_loweringNotice').click(function () {
        $('#loweringNotice_form [name=loweringNotice_dealType]').val(this.getAttribute('data-code'))
        $('[lay-filter=loweringNotice_submit]').trigger('click')
    })

    // 全量同步1688商品信息
    $('#syncAllProdFromAli_loweringNotice').click(function () {
        var confirmIndex = layer.confirm('确认现在全量同步在售的1688商品信息吗', { btn: ['确认', '取消'] }, function () {
            loading.show()
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: ctx + '/product/reFreshAllProduct.html',
                continue: 'application/json',
                success: function (res) {
                    loading.hide()
                    if (res.code == '0000') {
                        layer.msg('正在同步中，请稍后查看')
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
            layer.close(confirmIndex)
        })
    })

    // 导出
    $('#loweringNotice_exportBtn').on('click', () => {
        let data = serializeObject($('#loweringNotice_form'))
        const queryParams = {
            'buyerId': data.loweringNotice_buyerId,
            'integratorId': data.loweringNotice_integratorId,
            'developerId': data.loweringNotice_developerId,
            'isSale': data.loweringNotice_isSale,
            'skuType': data.loweringNotice_skuType,
            'sku': data.loweringNotice_sku,
            'createTime': data.loweringNotice_createTime,
            'dealRemark': data.loweringNotice_dealRemark,
            'dealStatus': data.loweringNotice_dealStatus,
            'dealType': data.loweringNotice_dealType
        }
        console.log('查询条件: ', queryParams)
        layer.confirm('确定导出当前查询条件下的所有数据？', {
            btn: ['确定'] //按钮
        }, function () {
            submitForm(queryParams, ctx + '/prodCutPriceNotice/exportProdCutPriceNotice.html')
            layer.closeAll()
        })
    })
})
