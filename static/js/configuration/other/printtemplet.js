layui.use(['admin','form','table','layer','upload'],function(){
    var admin = layui.admin,
    form = layui.form,
    table = layui.table,
    upload = layui.upload,
    layer = layui.layer;

    //监听表单提交事件
    form.on('submit(printtemplet_form_btn)',function(data){
        var formData = data.field;//这个数据是表单提交的数据
        printtempletName.handle(formData); //处理表格内操作
        return false;//阻止submit提交的
    });
    //新增模板
    $('#printtemplet_addTem').on('click',function(){
        var formData;
        layer.open({
            type: 1,
            title: '新增模板',
            id: 'printtemplet_addLayer',
            area: ['50%','50%'],
            btn: ['保存', '关闭'],
            content: $('#printtemplet_add').html(),
            success: function(layero,index){
                var $form = layero.find('form#printtemplet_editForm');
                //监听表单提交事件
                form.on('submit(printtemplet_addForm_btn)',function(data){
                    formData = data.field;//这个数据是表单提交的数据
                    return false;//阻止submit提交的
                });
            },
            yes: function(index){
                $('button[lay-filter=printtemplet_addForm_btn]').trigger('click');
                printtempletName.addTemplate(index,formData)
            }
        });
    })

//#region

    //打印模板的命名空间
    printtempletName = {
        editFormData: {}, //编辑弹框提交的数据
        handle: function(data){ //只发送ajax请求-搜索接口
            var _this = this;
            loading.show();
            $.ajax({
                type:'post',
                data: data,
                dataType: 'json',
                url: '/lms/template/search.html',
                success: function(res){
                    if(res.code=="0000"){
                        loading.hide();
                        _this.tableRender(res.data || []);
                    }else{
                        loading.hide();
                        layer.msg('接口无返回或出错',{icon: 5});
                    };
                },
                error: function(){
                    loading.hide();
                    layer.msg('服务器有问题!',{icon: 5});
                }
            })
        },
        tableRender: function(data){ //表格渲染
            var _this = this;
            table.render({
                elem: '#printtemplet_table'
               ,id: 'printtemplet_tableId'
               ,data: data //数据接口
               ,page: false //不开启分页
               ,limit: data.length
               ,cols: [
                   [ //表头
                        {field: 'templateCode', title: '模板编码'}
                       ,{field: 'templateName', title: '模板名称'}
                       ,{field: 'moduleCode', title: '模板编码'}
                       ,{field: 'remark', title: '备注'}
                       ,{field: 'templateUpdate', title:'模板上传', templet:'<div><button class="layui-btn layui-btn-xs" id="template_update{{d.id}}">模板上传</button></div>', width: 100}
                       ,{title: '操作', align:'center', toolbar: '#printtemplet_tableBar'}
                  ]
               ]
               ,done: function(res){
                  _this.watchBar();
                  $('[data-field="templateUpdate"]').hide(); //隐藏列
                  var d = res.data;
                  for(var i=0; i<d.length; i++){
                      var item = d[i];
                    upload.render({
                        elem: '#template_update'+item.id //绑定元素
                        ,url: '/lms/ireport/upload?templateCode='+ item.templateCode //上传接口
                        ,accept: 'file' //允许上传的文件类型
                        ,exts: 'jrxml|jasper'
                        ,done: function(res){
                          if(res.code=="0000"){
                              layer.msg(res.msg,{icon:1});
                          }else{
                            layer.msg(res.msg,{icon:5});
                          }
                        }
                        ,error: function(){
                          layer.msg('服务器出现故障!');
                        }
                    });
                  };
               }
           });
        },
        watchBar: function(){ //监听工具条
            var _this=this;
            table.on('tool(printtemplet_table)',function(obj){
                var data = obj.data;
                if(obj.event == "preview"){ //模板预览
                    var urlArr = [ctx+'/ireport/preview?templateCode=', data.templateCode]; 
                    window.open(urlArr.join(''),'_blank');  
                }
                else if(obj.event == "download"){ //模板下载
                    var urlArr = [ctx+'/ireport/download?templateCode=', data.templateCode];
                    window.open(urlArr.join(''),'_blank');  
                }
                else if(obj.event == "upload"){ //模板上传
                    var btn = obj.tr[0].lastChild.previousElementSibling.querySelector('#template_update'+data.id);
                    $(btn).trigger('click');
                }
                else if(obj.event=="edit"){ //模板编码之类的修改
                    layer.open({
                        type: 1,
                        title: '编辑',
                        id: 'printtemplet_editLayer',
                        area: ['50%','50%'],
                        btn: ['保存', '关闭'],
                        content: $('#printtemplet_edit').html(),
                        success: function(layero,index){
                            var $form = layero.find('form#printtemplet_editForm');
                            $form.find('input[name=templateCode]').val(data.templateCode); //模板编码
                            // $form.find('input[name=templateName]').val(data.templateName); //模板名称
                            $form.find('input[name=oldOrder]').val(data.oldOrder); //模板旧排序
                            $form.find('input[name=newOrder]').val(data.oldOrder); //模板旧排序
                            $form.find('input[name=remark]').val(data.remark); //模板备注
                            _this.formSubmitLayer('printtemplet_editForm_btn'); //注册form监听事件
                        },
                        yes: function(index){
                            $('button[lay-filter=printtemplet_editForm_btn]').trigger('click');
                            var obj= _this.editFormData;
                            var id = data.id;
                            $.ajax({
                                type:'post',
                                data: obj,
                                dataType: 'json',
                                url: '/lms/template/update.html/'+id,
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code=="0000"){
                                       layer.msg(res.msg,{icon: 1});
                                       layer.close(index);
                                       //表格重载
                                       $('button[lay-filter=printtemplet_form_btn]').trigger('click');
                                    }else{
                                       layer.msg('传递给后台的数据有问题, 请检查是否有空值',{icon:5});
                                    }
                                },
                                error: function(){
                                    loading.hide();
                                    layer.msg('服务器有问题!',{icon: 5});
                                }
                            })
                        }
                    })
                }
                else if(obj.event=="delete"){ //删除模板功能
                    var id = data.id;
                    layer.confirm('确定删除此条模板吗?', function(index){
                        //do something
                        loading.show();
                        $.ajax({
                            type:'get',
                            dataType: 'json',
                            url: '/lms/template/delete.html/'+ id,
                            success: function(res){
                               loading.hide();
                               if(res.code =="0000"){
                                  layer.close(index);
                                  layer.msg(res.msg, {icon: 1});
                                  //表格重载
                                  $('button[lay-filter=printtemplet_form_btn]').trigger('click');
                               }else{
                                   layer.msg('服务器返回出错',{icon: 5});
                               }
                            },
                            error: function(){
                                loading.hide();
                                layer.msg('服务器正忙',{icon: 5});
                            }
                        })  
                      });  
                }
            });
        },
        formSubmitLayer: function(btn){ //监听弹框里面的form表单提交事件
                var _this =this;
                //监听表单提交事件
                form.on('submit('+btn+')',function(data){
                    var formData = data.field;//这个数据是表单提交的数据
                    _this.editFormData = formData;
                    console.log(_this.editFormData);
                    return false;//阻止submit提交的
                });
        },
        addTemplate: function(index, data){ //新增模板函数
            $.ajax({
                type:'post',
                dataType: 'json',
                data: data,
                url: '/lms/template/add.html',
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                   loading.hide();
                   if(res.code =="0000"){
                      layer.close(index);
                      layer.msg(res.msg, {icon: 1});
                      //表格重载
                      $('button[lay-filter=printtemplet_form_btn]').trigger('click');
                      
                   }else{
                       layer.msg('服务器返回出错',{icon: 5});
                   }
                },
                error: function(){
                    loading.hide();
                    layer.msg('服务器正忙',{icon: 5});
                }
            })
        }
    };

//#endregion

    //默认加载数据
    $('[lay-filter=printtemplet_form_btn]').trigger('click');

});