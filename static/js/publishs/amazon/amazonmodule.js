layui.use(['admin','form','table','layer','layedit'],function(){
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        element = layui.element,
        layedit = layui.layedit,
        layer = layui.layer;
        form.render('select')
        //构建富文本
        var editorArr = [];
        var amazonLayedit = function(id,data){
            var editor = new Simditor({
                textarea: $('#'+id),
                cleanPaste: true, //复制过来的默认清除所有自带样式
                toolbar: ['bold', 'italic'] //只允许显示加粗和斜体
            });
            editor.setValue(data || ''); //设置富文本的值
            return editor
        };

//#region 命名空间
        var amazonmoduleSpace = {
            searchResult: function(name, status, edit){  //搜索结果并更新表格
                loading.show();
                var _this = this;
                $.ajax({
                    type: 'post',
                    url: '/lms/amazonModel/queryDescModeList.html',
                    data: JSON.stringify({
                        "storeAcct":name,
                        "status": status,
                        "isAmazonModelEdited": edit
                    }),
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    success: function(res){
                        var data = res.data;
                        _this.tableRender(data);
                        loading.hide();
                    },
                    error: function(error){
                        layer.msg(error);
                    }
                });
            },
            tableRender: function(data){ //根据搜索结果渲染表格
                var _this = this;
                //执行一个 table 实例
                table.render({
                    elem: '#amazonmodule_tableId',
                    data: data,
                    cols: [[ //表头
                        {type: 'checkbox'},
                        {field: 'id', title: 'id',width: 100},
                        {field: 'storeAcct', title: '店铺名称'},
                        {title: '操作', align:'center', toolbar: '#amazonmodule_tableIdBar',width:100}
                    ]],
                    done: function(){
                        _this.watchBar();
                    },
                    page: false,
                    limit: data.length 
                });
            },
            watchBar: function() { //监听表格工具条的点击事件
                var _this = this;
                table.on('tool(amazonmodule_tableFilter)',function(obj){
                    if (obj.event == "amazonmodule_tableEdit"){
                        var storeId = obj.data.id;
                        loading.show();
                        _this.getStoreDetail(storeId);
                    }
                })
            },
            getStoreDetail:function(id){ //获取到点击的店铺的详情
                loading.hide();
                var _this = this;
                $.ajax({
                    type: 'POST',
                    url: '/lms/amazonModel/queryDescModeDetail.html',
                    data: JSON.stringify({
                        "storeAcctId": id
                    }),
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    success: function(res){
                      if(res.code=="0000"){
                        if (res.data.length==0){
                            res.data = [
                                {descHead: '', descFix: ''},
                                {descHead: '', descFix: ''},
                                {descHead: '', descFix: ''},
                                {descHead: '', descFix: ''},
                                {descHead: '', descFix: ''},
                                {descHead: '', descFix: ''}
                            ]
                        };
                        _this.setPopup(res.data, id);
                      }
                    },
                    error: function(error){
                        layer.msg(error);
                    }
                })
            },
            setPopup:function(data, id){ //设置弹框
                // console.log(data)
                var _this = this;
                //弹框开始
                var index = layer.open({
                    type: 1,
                    id: 'amazonmodule_trDetailLayer',
                    title: '店铺详情编辑',
                    area: ['1100px', '100%'],
                    btn: ['保存', '关闭'],
                    content: $('#amazonmodule_storeDetail').html(),
                    success: function(){ //弹框打开后的回调
                        var languageArr = ['en', 'de', 'fra', 'spa', 'it','jp']; //语种数组
                        for(var i=0; i<languageArr.length; i++){
                            if(data) {
                                var haveEdit=false;
                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].language==languageArr[i]) {
                                        //设置描述头内容
                                        var editorHead = amazonLayedit(languageArr[i] + '_amazonmodule_descHead', data[j].descHead);
                                        //设置描述尾内容
                                        var editorFooter = amazonLayedit(languageArr[i] + '_amazonmodule_descFooter', data[j].descFix);
                                        editorArr.push({head: editorHead, foot: editorFooter})
                                        haveEdit=true;
                                    }
                                }
                                if(!haveEdit){
                                    var editorHead = amazonLayedit(languageArr[i] + '_amazonmodule_descHead', '');
                                    //设置描述尾内容
                                    var editorFooter = amazonLayedit(languageArr[i] + '_amazonmodule_descFooter', '');
                                    editorArr.push({head: editorHead, foot: editorFooter})
                                }
                            }
                        };
                        console.log(editorArr)
                    },
                    yes: function(index, layero){ //保存按钮的回调
                        var languageArr = ['en', 'de', 'fra', 'spa', 'it','jp']; //语种数组
                        var infoArr = [];
                        for(var i=0; i<languageArr.length; i++){
                           var obj = {};
                           obj.language = languageArr[i];
                          obj.descHead = editorArr[i].head.getValue(); 
                          console.log(obj.descHead)
                          obj.descFix =editorArr[i].foot.getValue();
                            //如果发现font-style和font-weight 就替换成i和b
                            infoArr.push(obj);
                        }
                        // console.log('描述信息是:',infoArr);
                        loading.show();
                        $.ajax({
                            type: 'post',
                            url: '/lms/amazonModel/eidtDescModeDetail.html',
                            data: JSON.stringify({
                                "storeAcctId":id,
                                "assiFieldAmazonInfoList":infoArr
                            }),
                            dataType: 'json',
                            contentType: 'application/json;charset=UTF-8',
                            success: function(res){
                                loading.hide();
                                if (res.code ==="0000"){
                                    layer.msg('修改成功!');
                                    layer.close(index);
                                }
                            },
                            error: function(error){
                                loading.hide();
                                layer.msg(error);
                            }
                        });

                    },
                    end: function(){
                        editorArr=[]; 
                    }
                });
                //弹框结束
            }
        };
//#endregion 命名空间结束

        //监听表单提交事件
        form.on('submit(amazonmodule_form_btn)',function(data){
            var formData = data.field;//这个数据是表单提交的数据
            storeName = formData.amazonmodule_storeName;
            storeStatus = formData.amazonmodule_modeStatus ==0 ? '': formData.amazonmodule_modeStatus;
            storeEdit = formData.amazonmodule_editStatus==0?'': formData.amazonmodule_editStatus;
            amazonmoduleSpace.searchResult(storeName, storeStatus, storeEdit); //搜索并渲染表格
            return false;//阻止submit提交的
        })
        //初始化
        $('[lay-filter=amazonmodule_form_btn]').trigger('click');
});