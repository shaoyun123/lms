layui.use(['admin','table','form','layer','laytpl','formSelects'], function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        form = layui.form;
    //创建一个字母和数字对象数组
        var charNumArr = [];
        for(var i=0; i<26;i++){
            var letter = String.fromCharCode(65+i);
            var obj = {
                'key': letter,
                'value': letter
            };
            charNumArr.push(obj);
        };
        for(var i=0; i<10; i++){
            var obj= {
                'key': i,
                'value': i
            };
            charNumArr.push(obj);
        };
    //定义一个receiveAddress的命名空间
    var receiveAddressName = {
        newAdd: function(){ //新增
            var _this = this;
            var newData = {
                addressName:'',
                ifDefault: false,
                province: '',
                city: '',
                street: '',
                district: '',
                detail: '',
                stockLocationPrefix: '',
                charNumArr: charNumArr
            };
            var newFormData= '';
            layer.open({
                type: 1,
                title: '新增地址',
                area: ['800px', '800px'],
                btn: ['保存', '关闭'],
                id: 'receiveAddress_newAddLayerId',
                content: $('#receiveAddress_newAddLayer').html(),
                success: function(layero, index){
                    _this.getWarehouseLists().then(function(result){
                        newData.storeArr = result;
                        var formTemplate = receiveAddress_newAddLayer_formTpl.innerHTML;
                        var formDiv= document.getElementById('receiveAddress_newAddLayer_form');
                        laytpl(formTemplate).render(newData, function(html){
                            formDiv.innerHTML = html;
                            form.render('select','receiveAddress_newAddLayerForm');
                            form.render('checkbox','receiveAddress_newAddLayerForm');

                            _this.queryAllTopLevelCate().then((res)=> {
                                let list = res || []
                                let cateSelectStr = ''
                                list?.forEach(item => {
                                    cateSelectStr += '<option value="' + item.id + '">' + item.cateTreeName + '</option>'
                                })
                                $('#purAddressCateIdList').append(cateSelectStr)
                                layui.formSelects.render('receiveAddress_purAddressCateIdList')
                            })
                        });
                        form.on('submit(receiveAddress_formTpl_submit)', function(data){
                            var data = data.field; //获取到表单提交对象
                            data.storeName = $('#receiveAddress_newAddLayer_form [name=storeId] option:selected').text();
                            var stockLocationPrefixArr = [];
                            for(var j=0; j<charNumArr.length; j++){
                                var name = 'receiveAddress_'+charNumArr[j]['key'];
                                var ck = $(`[name=${name}]`).is(':checked');
                                if(ck){
                                    stockLocationPrefixArr.push(charNumArr[j]['key']);
                                }
                            }
                            data.stockLocationPrefix = stockLocationPrefixArr.join();
                            data.ifDefault = $('[name=isDefault]').is(':checked');
                            data.purAddressCateIdList = data.addressCateIdList ? data.addressCateIdList?.split(',') : [];
                            newFormData = data;
                            return false;
                        });
                    }).catch(function(reason){
                        layer.msg(reason);
                    });
                    // 初始化仓库选择监听
                    form.on('select(receiveAddress_storeIdSel)', function(data) {
                        _this.queryBuildingno(data.value)
                    });
                    
                },
                yes: function(index, layero){
                    $('[lay-filter=receiveAddress_formTpl_submit]').click();
                    newFormData.buildingNos = _this.getbuildingnos()
                    $.ajax({
                        type: 'post',
                        url: '/lms/purAddress/saveOrUpdate.html',
                        dataType: 'json',
                        contentType: 'application/json;charset=UTF-8',
                        data:JSON.stringify(newFormData),
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code=="0000"){
                               layer.close(index);
                               layer.msg(res.msg);
                               _this.tableRender();
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
        },
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#receiveAddress_table'
                ,url: '/lms/purAddress/query.html' //数据接口
                ,page: true //开启分页
                ,cols: [[ //表头
                {field: 'id', title: 'ID'} 
                 ,{field: 'addressName', title: '地址名称'}
                ,{field: 'storeName', title: '仓库'}
                ,{field: 'detail', title: '详细地址'}
                ,{field: 'stockLocationPrefix', title: '匹配库位前缀', width:200} 
                ,{field: 'buildingNos', title: '匹配楼栋', width:200}
                ,{field: 'purAddressCateList', title: '匹配类目', width:200}
                ,{title: '是否默认',templet: '#receiveAddress_isDefault'}
                ,{title: '操作', align:'center', toolbar: '#receiveAddress_tableIdBar'}
                ]]
                ,id: "receiveAddress_tableId"
                ,limits: [50, 100, 300]
                ,limit: 50
                ,done: function(){
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(receiveAddress_tableFilter)',function(obj){
                var dataObj = obj.data;

                console.log("🚀 ~ table.on ~ dataObj:", dataObj);

                var newFormData;
                // console.log(dataObj);
                if (obj.event == 'edit'){
                    layer.open({
                        type: 1,
                        title: '编辑地址',
                        area: ['800px', '800px'],
                        btn: ['保存', '关闭'],
                        id: 'receiveAddress_newAddLayerId',
                        content: $('#receiveAddress_newAddLayer').html(),
                        success: function(layero, index){
                            _this.getWarehouseLists().then(function(result){
                                dataObj.storeArr = result;
                                dataObj.charNumArr = charNumArr;
                                var formTemplate = receiveAddress_newAddLayer_formTpl.innerHTML;
                                var formDiv= document.getElementById('receiveAddress_newAddLayer_form');
                                laytpl(formTemplate).render(dataObj, function(html){
                                    formDiv.innerHTML = html;
                                    form.render('select','receiveAddress_newAddLayerForm');
                                    form.render('checkbox','receiveAddress_newAddLayerForm');
                                    let checkedList = dataObj.buildingNos.split(',')
                                    _this.queryBuildingno(dataObj.storeId,checkedList)
                                    _this.queryAllTopLevelCate().then((res)=> {
                                        let list = res || []
                                        let cateSelectStr = ''
                                        list?.forEach(item => {
                                            cateSelectStr += '<option value="' + item.id + '">' + item.cateTreeName + '</option>'
                                          })
                                          $('#purAddressCateIdList').append(cateSelectStr)
                                          layui.formSelects.render('receiveAddress_purAddressCateIdList')
                                          layui.formSelects.value('receiveAddress_purAddressCateIdList', dataObj.purAddressCateIdList || [])
                                          
                                    })
                                });

                                form.on('submit(receiveAddress_formTpl_submit)', function(data){
                                    var data = data.field; //获取到表单提交对象
                                    data.storeName = $('#receiveAddress_newAddLayer_form [name=storeId] option:selected').text();
                                    var stockLocationPrefixArr = [];
                                    for(var j=0; j<charNumArr.length; j++){
                                        var name = 'receiveAddress_'+charNumArr[j]['key'];
                                        var ck = $(`[name=${name}]`).is(':checked');
                                        if(ck){
                                            stockLocationPrefixArr.push(charNumArr[j]['key']);
                                        }
                                    }
                                    data.stockLocationPrefix = stockLocationPrefixArr.join();
                                    data.ifDefault = $('[name=isDefault]').is(':checked');
                                    data.purAddressCateIdList = data.addressCateIdList ? data.addressCateIdList?.split(',') : [];
                                    newFormData = data;
                                    return false;
                                });

                            }).catch(function(reason){
                                layer.msg(reason);
                            });
                            // 初始化仓库选择监听
                            form.on('select(receiveAddress_storeIdSel)', function(data) {
                                let storeId = data.value
                                _this.queryBuildingno(storeId)
                            });
                        },
                        yes: function(index, layero){
                            $('[lay-filter=receiveAddress_formTpl_submit]').click();
                            newFormData.buildingNos = _this.getbuildingnos()
                            // console.log(newFormData);
                            $.ajax({
                                type: 'post',
                                url: '/lms/purAddress/saveOrUpdate.html',
                                dataType: 'json',
                                contentType: 'application/json;charset=UTF-8',
                                data:JSON.stringify(newFormData),
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code=="0000"){
                                    layer.close(index);
                                    layer.msg(res.msg);
                                    _this.tableRender();
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
                }else if(obj.event == 'del'){
                    layer.confirm('确定删除吗?', function(index){
                        $.ajax({
                            type: 'get',
                            url: '/lms/purAddress/delete.html',
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
                                    _this.tableRender();
                                }else{
                                    layer.msg(res.msg);
                                };
                            },
                            error: function(){
                                loading.hide();
                                layer.msg('服务器出错啦!');
                            }
                        });
                    });
                };
            });
        },
        getWarehouseLists: function(){ //获取所有的仓库地址
           return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/prodWarehouse/getAllProdWarehouse.html',
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
                    }
                });
           });
        },
        queryAllTopLevelCate: function(){ //获取所有的一级类目
            return new Promise(function(resolve, reject){
                 $.ajax({
                     type: 'post',
                     dataType: 'json',
                     url: '/lms/prodCateOa/queryAllTopLevelCate',
                     success: function(res){
                         if(res.code == '0000'){
                            resolve(res.data);
                         }else{
                             reject(res.msg);
                         }
                     }
                 });
            });
         },
        queryBuildingno: function (storeId, checkedList){
            var _this = this;
            loading.show()
            oneAjax.post({
                type: 'GET',
                url: '/lms/stockLocationBindSku/getFloorAndBuild?warehouseId=' + storeId,
                success:function (res){
                    if (res.code === '0000') {
                        _this.renderBuildingno(res.data,checkedList)
                    }
                }
            })
        },
        /**
         * 渲染楼栋
         * @param totalList 所有选项
         * @param checkedList 已选项
         */
        renderBuildingno: function (totalList,checkedList){
            let chckedMap = {}
            if (checkedList && checkedList.length) {
                for (let i = 0; i < checkedList.length; ++i) {
                    chckedMap[checkedList[i]] = true
                }
            }
            console.log(totalList)
            if (totalList) {
                let  html = ''
                for (let buildingNo in totalList) {
                    if (chckedMap[buildingNo]) {
                        html += `<input type="checkbox" name="buildingNos" lay-skin="primary" title="`+ buildingNo +`" checked>`
                    } else {
                        html += `<input type="checkbox" name="buildingNos" lay-skin="primary" title="`+ buildingNo +`">`
                    }
                }
                // 更新html
                $('#receiveAddress_buildingNosContains').html(html)
                form.render('checkbox','receiveAddress_buildingNosContains')
            }
        },
        getbuildingnos: function (){
            let contains = $('#receiveAddress_buildingNosContains')
            let checkedArr = contains.find('[name=buildingNos]:checked')
            let buildingNoArr = []
            if (checkedArr && checkedArr.length) {
                for (let i = 0; i < checkedArr.length; ++i) {
                    buildingNoArr.push(checkedArr[i].getAttribute('title'))
                }
            }
            return buildingNoArr.join(',')
        }
    };
    //直接渲染表格
    receiveAddressName.tableRender();
    //新增按钮事件
    $('#receiveAddress_newAdd').on('click',function(){
        receiveAddressName.newAdd();
    })
});