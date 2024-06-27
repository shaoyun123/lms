layui.use(['admin','table','form','layer','laytpl'], function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        form = layui.form;

    // 初始化仓库选项
    function iniStockOption_address() {
        $.ajax({
            type: 'post',
            url: '/lms/prodWarehouse/getAllProdWarehouse.html',
            dataType: 'json',
            success: function(res){
                if (res.code == '0000') {
                    var list = res.data
                    var html = '<option></option>'
                    for(var stock in list) {
                        html += `<option value="`+ list[stock].id +`">`+ list[stock].warehouseName +`</option>`
                    }
                    $('#addressee_searchForm [name=storeId]').html(html)
                    form.render('select','addressee_searchForm')
                } else {
                    layer.msg('初始化仓库信息出错:' + res.msg)
                }
            }
        })
    }
    iniStockOption_address()
    //定义一个收件人的命名空间
    var addresseeName = {
        newAdd: function(){ //新增收件人
            var _this = this;
            var newData = {
               id: '',
               buyer: '', //采购员
               buyerId: 0, //采购员id
               receiver: '', //收件人
               isDefault: false, //是否默认
               phone: '', //手机
               addressId: 0 //地址id
            };
            Promise.all([_this.getBuyerLists(), _this.getAddressLists()]).then(function(result){
                var formNewData= '';
                newData.buyerArr = result[0]; //采购员数组
                newData.addressArr = result[1]; //地址数组
                layer.open({
                    type: 1,
                    title: '新建收件人',
                    area: ['800px', '75%'],
                    btn: ['保存', '关闭'],
                    id: 'addressee_newAddLayerId',
                    content: $('#addressee_newAddLayer').html(),
                    success: function(layero, index){
                        var formTemplate = addressee_newAddLayer_formTpl.innerHTML;
                        var formDiv= document.getElementById('addressee_newAddLayer_form');
                        laytpl(formTemplate).render(newData, function(html){
                            formDiv.innerHTML = html;
                            var storeHtml = $('#addressee_searchForm [name=storeId]').html()
                            $('#addressee_editOrAddForm [name=storeId]').html(storeHtml)
                            // console.log(storeHtml);
                            form.render('select','addressee_editOrAddForm');
                            form.render('checkbox');
                        });
                        form.on('submit(addressee_formTpl_submit)', function(data){
                            var data = data.field; //获取到表单提交对象
                            data.ifDefault = $('#addressee_editOrAddForm [name=isDefault]').is(':checked');
                            data.buyer = $('#addressee_editOrAddForm [name=buyerId] option:selected').text();
                            formNewData = data;
                            return false;
                        });
                    },
                    yes: function(index, layero){
                        $('[lay-filter=addressee_formTpl_submit]').click();
                        $.ajax({
                            type: 'post',
                            url: '/lms/purReceiverRef/saveOrUpdate.html',
                            dataType: 'json',
                            contentType: 'application/json;charset=UTF-8',
                            data:JSON.stringify(formNewData),
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code=="0000"){
                                   layer.close(index);
                                   layer.msg(res.msg);
                                   $('[lay-filter=addressee_submit]').click();
                                }else{
                                    layer.msg(res.msg);
                                }
                            },
                            error: function(){
                                layer.close(index);
                                layer.msg('服务器出错啦!');
                            }
                        });
                    }
                })
            }).catch(function(reason){
                layer.msg(reason);
            });
        },
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#addressee_table',
                method: 'post',
                url: ' /lms/purReceiverRef/query.html',
                where:  data,
                cols: [
                    [ //表头
                        {title: '采购员',field: 'buyer',width: 100}
                        ,{title: '仓库',field: 'storeName',width: 100}
                        ,{title: '收件人',field: 'receiver',width: 200}
                        ,{title: '是否默认',templet: '#addressee_isDefault',width: 100}
                        ,{title: '收件人手机', field: 'phone',width: 200}
                        ,{title: '收货地址', field: 'purAddress'}
                        ,{title: '操作', align:'center', toolbar: '#addressee_tableIdBar',width: 200}
                   ]
                ],
                page: true,
                id: "addressee_tableId",
                limits: [50, 100, 300],
                limit: 50,
                done: function(){
                    _this.watchBar();
                }
            })
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(addressee_tableFilter)',function(obj){
                var dataObj = obj.data;
                if (obj.event == 'edit'){
                    Promise.all([_this.getBuyerLists(), _this.getAddressLists()]).then(function(result){
                        var formNewData= '';
                        dataObj.buyerArr = result[0]; //采购员数组
                        dataObj.addressArr = result[1]; //地址数组
                        layer.open({
                            type: 1,
                            title: '编辑收件人',
                            area: ['800px', '75%'],
                            btn: ['保存', '关闭'],
                            id: 'addressee_newAddLayerId',
                            content: $('#addressee_newAddLayer').html(),
                            success: function(layero, index){
                                var formTemplate = addressee_newAddLayer_formTpl.innerHTML;
                                var formDiv= document.getElementById('addressee_newAddLayer_form');
                                laytpl(formTemplate).render(dataObj, function(html){
                                    formDiv.innerHTML = html;
                                    var storeHtml = $('#addressee_searchForm [name=storeId]').html()
                                    $('#addressee_editOrAddForm [name=storeId]').html(storeHtml)
                                    $('#addressee_editOrAddForm [name=storeId]').val(dataObj.storeId)
                                    form.render('select','addressee_editOrAddForm');
                                    form.render('checkbox');
                                });
                                form.on('submit(addressee_formTpl_submit)', function(data){
                                    var data = data.field; //获取到表单提交对象
                                    data.ifDefault = $('#addressee_editOrAddForm [name=isDefault]').is(':checked');
                                    data.buyer = $('#addressee_editOrAddForm [name=buyerId] option:selected').text();
                                    formNewData = data;
                                    return false;
                                });
                            },
                            yes: function(index, layero){
                                $('[lay-filter=addressee_formTpl_submit]').click();
                                $.ajax({
                                    type: 'post',
                                    url: '/lms/purReceiverRef/saveOrUpdate.html',
                                    dataType: 'json',
                                    contentType: 'application/json;charset=UTF-8',
                                    data:JSON.stringify(formNewData),
                                    beforeSend: function(){
                                        loading.show();
                                    },
                                    success: function(res){
                                        loading.hide();
                                        if(res.code=="0000"){
                                           layer.close(index);
                                           layer.msg(res.msg);
                                           $('[lay-filter=addressee_submit]').click();
                                        }else{
                                            layer.msg(res.msg);
                                        }
                                    },
                                    error: function(){
                                        layer.close(index);
                                        layer.msg('服务器出错啦!');
                                    }
                                });
                            }
                        });
                    }).catch(function(reason){
                        layer.msg(reason);
                    });
                }else if(obj.event == 'del'){
                    layer.confirm('确定删除？', function(index){
                        $.ajax({
                            type: 'get',
                            url: '/lms/purReceiverRef/delete.html',
                            data: {id: dataObj.id},
                            dataType: 'json',
                            beforeSend: function(){
                               loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code=='0000'){
                                    layer.close(index);
                                    layer.msg(res.msg);
                                    $('[lay-filter=addressee_submit]').click();
                                }else{
                                    layer.msg(res.msg);
                                };
                            },
                            error: function(){
                                loading.hide();
                                layer.msg('服务器出错啦!');
                            }
                        })
                    })
                }
            });
        },
        getBuyerLists: function(){ //获取所有的采购员
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    url: '/lms/sys/buyerList.html',
                    dataType: 'json',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data);
                        }else{
                            reject(res.msg);
                        };
                    }
                });
            });
        },
        getAddressLists: function(){ //获取所有的仓库地址
           return new Promise(function(resolve, reject){
            $.ajax({
                type: 'post',
                url: '/lms/purAddress/query.html',
                dataType: 'json',
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        resolve(res.data);
                    }else{
                        reject(res.msg);
                    };
                }
            });
           })
        }
    };

    //监听表单的提交事件
    form.on('submit(addressee_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        addresseeName.tableRender(data);
        return false;
    });
    //新增按钮点击事件
    $('#addressee_newAdd').on('click', function(){
        addresseeName.newAdd();
    });

    //默认触发表单提交事件(初始化)
    $('[lay-filter=addressee_submit]').click();
})