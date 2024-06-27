layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate'],function(){
    var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        form = layui.form;
    form.render();
    render_hp_orgs_users("#site_searchForm"); //渲染部门销售员二级联动

    var siteName = {
        //渲染销售渠道
        renderChannel: function(id){
            var optsInit ='';
            this.channelAjax().then(function(result){
                //这里是ajax请求的结果渲染
                for(var i=0; i< result.length; i++){
                    var item = result[i];
                    optsInit +=`<option value="${item.channelCode}">${item.channelName}</option>`;
                }
                $('#'+id).append(optsInit);
                formSelects.render(id);
            }).catch(function(error){
                layer.msg(error);
            })
        },
        //渲染表格
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#site_table',
                method: 'post',
                url: '/lms/winitSalesChannelConifg/queryPage.html',
                where: data,
                page: true,
                limits: [50, 100, 300],
                limit: 50,
                id: "site_tableId",
                cols: [
                    [
                        {title: '部门', field:'orgName'},
                        {title: '销售专员', field:'saler'},
                        {title: '匹配销售渠道', field: 'channelList'},
                        {title: '操作', toolbar: '#site_toolBar'}
                    ]
                ],
                done: function(){
                    _this.watchBar();
                }
            });
        },
        //监听表格操作
        watchBar: function(){
            var _this = this;
            table.on('tool(site_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'edit'){ //修改
                    _this.addAndEditLayer(data);
                }
            });
        },
        //新增功能
        addBtnHandle: function(){
            var _this = this;
            $('#site_addConfigBtn').on('click', function(){
                _this.addAndEditLayer({title: '新增'})
            })
        },
        //新增和编辑操作
        addAndEditLayer: function(data){
            var _this = this;
            var index = layer.open({
                type: 1,
                title: data.title,
                area:['800px', '600px'],
                btn: ['确认','关闭'],
                id: 'site_addAndEditLayerId',
                content: $('#site_addAndEditLayer').html(),
                success: function(layero, index){
                    render_hp_orgs_users("#site_addAndEditLayerForm"); //渲染部门销售员二级联动
                    _this.renderChannel('site_channelSelectLayer'); //渲染渠道
                    //延时执行
                    setTimeout(function(){
                        if(data.id){
                            layero.find('[name=orgId]').next().find(`dd[lay-value="${data.orgId}"]`).trigger('click');
                            layero.find('[name=salerId]').next().find(`dd[lay-value="${data.salerId}"]`).trigger('click')
                            formSelects.render('site_channelSelectLayer',{
                                init: data.channelList.split(',')
                            }); 
                        }
                    },500);
                },
                yes: function(index, layero){
                    var obj ={};
                    if(!data.id){
                        delete obj.id;
                    }else{
                        obj.id = data.id;
                    }
                    obj.orgId = layero.find('[name=orgId]').val();
                    obj.orgName = layero.find('[name=orgId] option:selected').text();
                    obj.salerId = layero.find('[name=salerId]').val();
                    obj.saler = layero.find('[name=salerId] option:selected').text();
                    obj.channelStrList = $('#site_channelSelectLayer').next().find('.xm-input.xm-select').attr('title').split(',');
                    if(!obj.orgId || !obj.salerId || !obj.channelStrList.length){
                        return layer.msg('部门,销售专员以及渠道都不能为空!')
                    };
                    _this.addAndEditAjax(obj).then(function(result){
                        layer.close(index);
                        layer.msg(result, {time: 1500, icon: 1});
                        $('[lay-filter="site_submit"]').trigger('click');
                    }).catch(function(err){
                        layer.msg(err);
                    })
                }
            })
        },
        //ajax请求
        //销售渠道ajax请求
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
        //新增/编辑站点配置的ajax请求
        addAndEditAjax: function(obj){
            if(!obj.id){
                id = '';
            }
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    url: '/lms/winitSalesChannelConifg/addOrUpdateConfig.html',
                    data: JSON.stringify(obj),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.msg || '保存数据成功!');
                        }else{
                            reject(res.msg|| '服务器错误');
                        }
                    },
                    error: function(){
                        reject('服务器错误,清稍后重试!');
                    }
                })
            })
        }
    };

    //新增配置
    siteName.addBtnHandle();
    //渲染销售渠道
    siteName.renderChannel('site_channelSelect');
    
     //表单搜索事件
    form.on('submit(site_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        data.channelStr = $('#site_channelSelectLayer').next().find('.xm-input.xm-select').attr('title');
        delete data.channelStrList;
        var $salerSel = $('#site_searchForm').find('select[name=salerIdStr]');
        if($salerSel.val() == ''){
            var optionsArr= [];
            var $options = $salerSel.find('option');
            for(var i=0; i<$options.length; i++){
                var item = $options[i];
                var $id = $(item).attr('value');
                optionsArr.push($id);
            }
            var optionsArrTarget = optionsArr.filter(function(s){
                return s & s.trim()
            });
            data.salerIdStr = optionsArrTarget.join(',');
        }else{
            data.salerIdStr = $salerSel.val();
        }
        siteName.tableRender(data);
    });

    //默认触发搜索
    $('[lay-filter="site_submit"]').trigger('click');
    
})