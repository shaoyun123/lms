layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate'],function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        form = layui.form;
    
    var wytWarehouseName = {
        tableRender: function(){
            var _this = this;
            table.render({
                elem: '#wyt_warehouse_table',
                method: 'get',
                url: '/lms/winitWarehouseRef/queryList.html',
                page: false,
                limits: [50, 100, 300],
                limit: 50,
                id: "wyt_warehouse_tableId",
                cols: [
                    [
                        {title: '海外仓仓库名', field:'name'},
                        {title: '服务商类型 ', field: 'serviceType',templet: '#wyt_warehouse_serviceType'},
                        {title: '海外仓仓库编码', field:'code'},
                        {title: '销售渠道', field: 'channel'},
                        {title: '对应OA仓库', field: 'warehouseName'},
                        {title: '仓库货币', field: 'currency'},
                        {title: '收件人', field: 'recipient'},
                        {title: '电话号码', field: 'mobile'},
                        {title: '地址', field: 'address'},
                        {title: '操作',toolbar: '#wyt_warehouse_toolBar'}
                    ]
                ],
                done: function(){
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(wyt_warehouse_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'edit'){ //修改
                    data.title="修改仓库";
                    _this.addOrEditLayer(data);
                }else if(obj.event == 'enable'){ //启用功能
                    layer.confirm('确定停用该仓库吗？', function(){
                        var id = data.id;
                        _this.isAbleAjax({id: id,status: false}).then(function(result){
                            layer.msg(result);
                            _this.tableRender();
                        }).catch(function(err){
                            layer.msg(err);
                        });
                    });
                }else if(obj.event == 'disable'){ //停用功能
                    layer.confirm('确定启用该仓库吗？', function(){
                        var id = data.id;
                        _this.isAbleAjax({id: id,status: true}).then(function(result){
                            layer.msg(result);
                            _this.tableRender();
                        }).catch(function(err){
                            layer.msg(err);
                        })
                    });
                }
            });
        },
        addBtnHandle: function(){
            var _this = this;
            $('#warehouse_addWarehouseBtn').on('click', function(){
                var obj = {
                    id: '',
                    title: '新增',
                    code: '', //万邑通仓库编码
                    name: '', //万邑通仓库名
                    warehouseId: '', //oa仓库id
                    warehouseName: '', //oa仓库名称
                    currency: '', //仓库货币
                    channel: '',//oa仓库渠道
                    recipient: '',
                    serviceType: '',
                    mobile: '',
                    address: ''
                };
                _this.addOrEditLayer(obj);

            })
        },
        // 新增/编辑弹框
        addOrEditLayer: function(obj){
            var _this = this;
            layer.open({
                type: 1,
                title: obj.title,
                area:['800px', '600px'],
                btn: ['确认','关闭'],
                id: 'wyt_warehouse_editOrAddLayerId',
                content: $('#wyt_warehouse_editOrAddLayer').html(),
                success: function(layero, index){
                    Promise.all([_this.channelAjax(),_this.warehouseAjax(),_this.currencyAjax()]).then(function(result){
                        obj.channelArr = result[0];
                        obj.warehouseArr = result[1];
                        obj.currencyArr = result[2];
                        var getTpl = wyt_warehouse_editOrAddContainerTpl.innerHTML,
                        view = document.getElementById('wyt_warehouse_editOrAddContainer');
                        laytpl(getTpl).render(obj, function(html){
                            view.innerHTML = html;
                            form.render();
                        });
                    }).catch(function(err){
                        layer.msg(err);
                    })
                },
                yes: function(index, layero){
                    var saveData = {};
                    if(obj.id){
                        saveData.id = obj.id
                    }else{
                        delete saveData.id
                    }
                    saveData.winitWarehouseId = layero.find('input[name=winitWarehouseId]').val().trim();
                    saveData.code = layero.find('input[name=code]').val().trim();
                    saveData.name = layero.find('input[name=name]').val().trim();
                    saveData.recipient = layero.find('input[name=recipient]').val().trim();
                    saveData.mobile = layero.find('input[name=mobile]').val().trim();
                    saveData.address = layero.find('input[name=address]').val().trim();
                    saveData.warehouseId  = layero.find('select[name=warehouse]').val().trim();
                    saveData.serviceType = layero.find('select[name=serviceType]').val().trim();//服务商类型
                    saveData.warehouseName = layero.find('select[name=warehouse] option:selected').text();
                    saveData.channel =layero.find('select[name=channel]').val().trim();
                    saveData.currency =layero.find('select[name=currency]').val().trim();
                    _this.addOrEditAjax(saveData).then(function(result){
                        layer.close(index);
                        layer.msg(result);
                        _this.tableRender();
                    }).catch(function(err){
                        layer.msg(err);
                    })
                }
            })
        },
        //货币枚举
        currencyAjax: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/winitWarehouseRef/queryCurrencyEnum.html',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data)
                        }else{
                            reject('请求接口失败,请稍后重试')
                        }
                    }
                })
            })
        },
        //渠道接口
        channelAjax: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/winitSalesChannelConifg/queryChannel.html',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data)
                        }else{
                            reject('请求接口失败,请稍后重试')
                        }
                    }
                })
            })
        },
        //OA仓库下拉框接口
        warehouseAjax: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/prodWarehouse/getAuthedProdWarehouse.html',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data)
                        }else{
                            reject('请求接口失败,请稍后重试')
                        }
                    }
                })
            })
        },
        //增加-修改接口
        addOrEditAjax: function(obj){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/winitWarehouseRef/addOrUpdateWarehouseRef.html',
                    contentType: 'application/json',
                    data: JSON.stringify(obj),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data || '操作成功!')
                        }else{
                            reject(res.msg || '请求出错')
                        }
                    }
                })
            });
        },
        //启用停用接口
        isAbleAjax: function(obj){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/winitWarehouseRef/updateStatus.html',
                    contentType: 'application/json',
                    data: JSON.stringify(obj),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data || '操作成功!')
                        }else{
                            reject(res.msg || '请求出错')
                        }
                    }
                })
            });
        }
    };
    //新增按钮
    wytWarehouseName.addBtnHandle();
    //进来就查询店铺
    wytWarehouseName.tableRender();
})
