
layui.use(['admin','form','table','layer', 'laytpl'],function(){
    var admin = layui.admin,
        table = layui.table,
        form = layui.form,
        laytpl= layui.laytpl,
        layer = layui.layer;

        countryrule_table_render();

        countryrule_newAddHandle();
        
        function countryrule_table_render(){
            table.render({
                elem: '#countryrule_table',
                method: 'get',
                url: '/lms/order/rule/fr/country/list.html',
                // where: {},
                page: false,
                id: "countryrule_tableId",
                // limits: [50, 100, 200],
                // limit: 50,
                cols: [
                    [
                      {title: '邮编前三位', field: 'postCodePrefix'},
                      {title: '映射国家代码', field: 'countryCode'},
                      {title: '映射国家中文', field: 'countryCnName'},
                      {title: '映射国家英文', field: 'countryEnName'},
                      {title: '操作',toolbar: '#countryrule_tableIdBar', width: 110}
                    ]
                ],
                done: function(){
                    countryrule_table_handle();
                }
            });
        }

        function countryrule_table_handle(){
            table.on('tool(countryrule_tableFilter)',function(obj){
                var data = obj.data;
                var id= data.id;
                if(obj.event== 'edit'){
                    // console.log('编辑')
                    countryrule_tableBar_edit(data, '修改映射国家', '修改');
                }else if(obj.event == 'delete'){
                    console.log('删除');
                    countryrule_tableBar_delete(id);
                }
            });
        }

        function countryrule_tableBar_edit(data, title,btn){
            var index = layer.open({
                type: 1,
                title: title,
                btn: [btn, '关闭'],
                area: ['800px', '600px'],
                content: $('#countryrule_add_edit').html(),
                success: function(layero, index){
                    new Promise(countryrule_getListCountry).then(function(result){
                        data.listCountry = result;
                        var getTpl = countryrule_add_edit_tpl.innerHTML,
                        view = document.getElementById('countryrule_add_edit_container');
                        laytpl(getTpl).render(data, function(html){
                            view.innerHTML = html;
                            form.render();
                        });
                    })
                },
                yes: function(index, layero){
                    var countryCode = $('#countryrule_add_edit_countryCode').val();
                    var postCodePrefix = $('#countryrule_add_edit_postCodePrefix').val();
                    var obj = {};
                    if(data.id){
                        obj = {
                            countryCode: countryCode,
                            postCodePrefix: postCodePrefix,
                            id: data.id
                        }
                    }else{
                        obj = {
                            countryCode: countryCode,
                            postCodePrefix: postCodePrefix,
                        }
                    };
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url:'/lms/order/rule/fr/country/update.html',
                        data: obj,
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code == '0000'){
                                layer.msg(btn+'成功!');
                                layer.close(index);
                                countryrule_table_render();
                            }else{
                                layer.msg(res.msg);
                            }
                        },
                        error: function(){
                            loading.hide();
                            layer.msg('服务器有问题');
                        }
                    })
                }

            })

        }

        function countryrule_getListCountry(resolve, reject){
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/order/rule/fr/country/listcountry.html',
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                  if(res.code == '0000'){
                    resolve(res.data);
                  }else{
                    reject(res.msg);
                  }
                },
                error: function(){
                    loading.hide();
                    reject('服务器错误');
                }
            })
        }
        

        function countryrule_tableBar_delete(id){
            layer.confirm('确定要删除吗?', {icon: 3, title:'提示'}, function(index){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url:'/lms/order/rule/fr/country/delete.html',
                    data: {
                        id: id
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            layer.msg('删除成功');
                            layer.close(index);
                            countryrule_table_render();
                        }else{
                            layer.msg(res.msg);
                        }
                    },
                    error: function(){
                        loading.hide();
                        layer.msg('服务器有问题');
                    }
                })
            });
        }

        function countryrule_newAddHandle(){
            $('#countryrule_newAdd').on('click', function(){
                var data = {
                    countryCode: '',
                    postCodePrefix: ''
                };
                countryrule_tableBar_edit(data, '新增映射国家', '新增');
            });
        }


})