layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate','upload'],function(){
    var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        upload = layui.upload,
        form = layui.form;
    form.render();
    // 人员选择
    render_hp_orgs_users("#orgs_hp_devPerson_selectionForm", function(){
        formSelects.render('selection_devPerson');
    });
    render_hp_orgs_users("#orgs_hp_saler_selectionForm", function(){
        form.render('select');
    });
    //时间渲染
    laydate.render({
        elem: '#selection_timeRange'
        ,range: true
    });
    // laydate.render({
    //     elem: '#selection_allocateTimes'
    //     ,range: true
    // });
    

    var selectionName = {
        //数据处理
        dataHandle: function(data){
            if (data.bizzOwnerOrganize && !data.bizzOwnerIdListStr) {
                data.bizzOwnerIdListStr = $('#orgs_hp_devPerson_selectionForm').find('[lay-filter=users_hp_devPerson_selection]').attr('user_ids')
            }
            if (data.salerOrganize && !data.salerId) {
                var options = $('#orgs_hp_saler_selectionForm').find('[lay-filter=users_hp_saler_selection]>option')
                var dataArr = [];
                for(var i=0; i<options.length; i++){
                    var item = options[i];
                    var val = $(item).attr('value');
                    if(val){
                            dataArr.push(val);
                    }
                }
                data.salerId = dataArr.join(',');
            }
            return data;
        },
        //选择分类事件
        cate: function(){
            $('#selection_cateBtn').click(function() {
                admin.itemCat_select('layer-publishs-select-layer',
                'selection_cateId',
                'selection_cateDiv');
            })
        },
        //渲染销售渠道和头程
        renderChannel: function(){
            var channelInit ='';
            var firstInit = '';
            var logistListInit = '';
            this.channelAjax().then(function(result){
                //这里是ajax请求的结果渲染
                var channelList = result.channelList || [];
                var firstList = result.firstList || [];
                var logistList = result.logistList || [];
                for(var i=0; i< channelList.length; i++){
                    var item = channelList[i];
                    channelInit +=`<option value="${item.channelCode}">${item.channelName}</option>`;
                }
                for(var j=0; j<firstList.length; j++){
                    var firstOne = firstList[j];
                    firstInit +=`<option value="${firstOne.firstCode}">${firstOne.firstName}</option>`;
                }
                for(var k=0; k<logistList.length;k++){
                    var logistListOne =logistList[k];
                    logistListInit += `<option value="${logistListOne.logisAttrName}" alias="${logistListOne.logisAttrAlias}">${logistListOne.logisAttrName}</option>`;
                }
                $('#selection_channelSelect').append(channelInit);
                formSelects.render('selection_channelList');
                $('#selection_firstWayType').append(firstInit);
                form.render('select');
                $('#selection_logisAttrList').append(logistListInit);

                if(result.salerId){
                    setTimeout(function(){
                        $('#orgs_hp_saler_selectionForm').find('select[name=salerId]').val(result.salerId);
                        form.render('select');
                    }, 200)
                }
            }).catch(function(error){
                layer.msg(error);
            })
        },
        //选品意向操作
        selectInitHandle: function(){
            var _this = this;
            $('#selection_selectIntention').on('click', function(){
                var index = layer.open({
                    type: 1,
                    title: '选品意向',
                    btn: ['关闭'],
                    area: ['800px', '600px'],
                    id: 'selection_selectInitLayerId',
                    content: $('#selection_selectInitLayer').html(),
                    success: function(layero, index){
                        _this.selectInitAjax().then(function(result){
                            var getTpl = selection_selectInitContainerTpl.innerHTML,
                            view = document.getElementById('selection_selectInitContainer');
                            laytpl(getTpl).render(result, function(html){
                                view.innerHTML = html;
                            });
                        }).catch(function(err){
                            layer.msg(err);
                        })
                    }
                });
            })
        },
        batchHandle: function(){
            var _this = this;
            $('#selection_batchSelection').on('click', function(){
                commonTableCksSelected('selection_tableId').then(function(result){
                    var idArr = result.map(function(item){
                        return item.id;
                    });
                    layer.confirm('选品后立即向万邑通后台注册新商品,确定要选品吗?', {icon: 6, title:'选品'}, function(index){
                        _this.selectionAjax(idArr.join(',')).then(function(result){
                            layer.msg(result || '批量选品成功!');
                            $('[lay-filter="selection_submit"]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon: 2});
                        });
                        layer.close(index);
                    });
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                })
            })
        },
        //渲染表格
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#selection_table',
                method: 'post',
                // url: '/lms/winitSellerChooseProducts/queryPage.html',
                url: '/lms/winitSalerChooseProducts/queryPage.html',
                where:  data,
                page: true,
                limits: [50, 100, 300],
                limit: 50,
                id: "selection_tableId",
                cols: [
                    [
                        {type: 'checkbox', width: 30},
                        {title: '销售渠道', field: 'channelInfo', templet: '#selection_channelInfo'},
                        {title: '选品状态', filed: 'isSelected', templet: '#selection_isSelected', width: 40},
                        {title: '图片',filed: 'image', templet: '#selection_img', width: 70},
                        {title: 'SKU', filed: 'sku', templet: '#selection_sku'},
                        {title: '在售', filed: 'isSale', templet: '#selection_isSale', width: 40},
                        {title: '英国信件', field: 'english', templet: '#selection_eng', width: 40},
                        {title: '德国信件', field: 'germany', templet: '#selection_ger', width: 40},
                        {title: '简称', field: 'simple', templet: '#selection_simple'},
                        {title: '责任人', filed: 'responser', templet: '#selection_responser', width: 154},
                        {title: '销量', field: 'volume', templet: '#selection_volume'},
                        {title: '成本(¥)', field: 'cost', templet: '#selection_cost'},
                        {title: '重量(g)', field: 'weight', templet: '#selection_weight'},
                        {title: '尺寸(cm)', field: 'size', templet: '#selection_size'},
                        {title: '推荐理由', field: 'reason', templet: '#selection_reason'},
                        {title: '建议发货数量',field: 'count', templet: '#selection_count'},
                        {title: '服务商状态', field: 'data', templet: '#selection_data'},
                        {title: '时间',field: 'times', templet: '#selection_times'},
                        {title: '操作', toolbar: '#selection_toolBar', width: 80}
                    ]
                ],
                done: function(){
                    _this.watchBar();
                    imageLazyload();
                }
            });
        },
        //监听表格操作
        watchBar: function(){
            var _this = this;
            table.on('tool(selection_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'select'){ //选品
                    layer.confirm('选品后立即向万邑通后台注册新商品,确定要选品吗?', {icon: 6, title:'选品'}, function(index){
                        _this.selectionAjax(data.id).then(function(result){
                            layer.msg(result || '选品成功!');
                            $('[lay-filter="selection_submit"]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon: 2});
                        })
                        layer.close(index);
                    });
                }else if(obj.event == 'showCompList'){ //链接
                    var index = layer.open({
                        type: 1,
                        title: '竞品链接',
                        btn: ['关闭'],
                        area: ['800px', '600px'],
                        id: 'selection_linkDetailLayerId',
                        content: $('#selection_linkDetailLayer').html(),
                        success: function(layero, index){
                            _this.getLinksAjax(data.prodSInfo.pId).then(function(result){
                                var getTpl = selection_linkDetailContainerTpl.innerHTML,
                                view = document.getElementById('selection_linkDetailContainer');
                                laytpl(getTpl).render(result, function(html){
                                    view.innerHTML = html;
                                });
                            }).catch(function(err){
                                layer.msg(err);
                            })
                        }
                    });
                }else if(obj.event == 'showPrePublishPrice'){ //成本
                    var Adata = {
                        prodSId: data.prodSId,
                        cost: accAdd(data.prodSInfo.purchaseCostPrice, data.prodSInfo.innerPackCost),
                        weight: accAdd(data.prodSInfo.suttleWeight, data.prodSInfo.packWeight),
                    }
                    tpl_listReferPrice(null,null, Adata)
                }else if(obj.event =='setprice'){ //定价
                    commonSetPriceFn(data);
                }
            });
        },
        //编辑建议发货数量
        selection_editSuggestSendAmtPop: function(data) {
            var _this = this;
            let popIndex = layer.open({
                title: '建议发货数量',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['1000px', '600px'],
                id: 'selection_editSuggestSendAmtPop',
                btn: ['保存','关闭'],
                content: $('#selection_editSuggestSendAmtPopLayer').html(),
                success: function () {
                    let Adata = {
                        prodSId: data.prodSId
                    }
                    loading.show()
                    $.ajax({
                        type: "post",
                        url: ctx + "/winitSInfo/getRegistInfoByProdSId.html",
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(Adata),
                        success: function(res) {
                            loading.hide()
                            if (res.code === '0000') {
                                _this.showSuggestSendAmtTable(res.data)
                            } else {
                                layer.msg(res.msg)
                            }
                        }
                    })
                }, yes: function () {
                    let list = []
                    let tabData = table.cache.selection_suggestSendAmtTable
                    for (let i = 0; i < tabData.length; ++i) {
                        if (!isInteger(tabData[i].suggestSendAmt)) {
                            layer.msg('建议发货数量必须为非负整数')
                            return
                        }
                        list.push({
                            id: tabData[i].id,
                            suggestSendAmt: tabData[i].suggestSendAmt
                        })
                    }
                    $.ajax({
                        type: "post",
                        url: ctx + "/winitSInfo/updateSSiteInfo.html",
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(list),
                        success: function (res) {
                            if (res.code === '0000') {
                                layer.msg('修改成功')
                                layer.close(popIndex)
                                $('[lay-filter="selection_submit"]').trigger('click');
                            } else {
                                layer.msg(res.msg)
                            }
                        }
                    })
                }
            })
        },
        //渲染建议发货表格
        showSuggestSendAmtTable: function(data) {
            table.render({
                elem: '#selection_suggestSendAmtTable',
                data : data,
                cols: [
                    [
                        {title: "销售渠道", field: 'channel'},
                        {title: "建议发货数量(点击可编辑)", field: "suggestSendAmt", edit:'text', style:"background-color: #7FFFD4;"}
                    ]
                ],
                page: false,
                height: 550,
                id: 'selection_suggestSendAmtTable',
                done: function (res) {
                }
            })
        },
        //ajax请求
        //销售渠道和头程类型ajax请求
        channelAjax: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    // url: '/lms/winitSellerChooseProducts/queryQueryEnum.html',
                    url: '/lms/winitSalerChooseProducts/queryQueryEnum.html',
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
        //获取竞品链接ajax请求(完成)id=data.prodSInfo.pId(76720)
        getLinksAjax: function(id){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/winitSInfo/getOriginCompListAndRecommendReason.html',
                    contentType: 'application/json',
                    data: JSON.stringify({prodPId: id}),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data)
                        }else{
                            reject('获取竞品链接接口请求返回数据出错!')
                        }
                    },
                    error: function(err){
                        reject(err)
                    }
                })
            })
        },
        //根据成本获取海外仓定价ajax请求
        getOutPrice: function(price,id){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: 'url',
                    data: {
                        id: id,
                        price: price
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success:function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data)
                        }else{
                            reject('获取海外仓定价失败!')
                        }
                    },
                    error: function(err){
                        reject(err);
                    }
                })
            })
        },
        //导入意向
        importAjax: function(id, urlStr){
            upload.render({
                elem: '#'+id //绑定元素
                ,url: `${ctx}/${urlStr}` //上传接口
                ,accept: 'file' //允许上传的文件类型
                ,exts: 'xlsx'
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
        },
        //选品意向
        selectInitAjax: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/winitSellerChooseProducts/showVolunteerProducts.html',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data)
                        }else{
                            reject(res.msg || '请求出错')
                        }
                    }
                })
            })
        },
        //新销售
        newSaleAjax: function(channel){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/winitSellerChooseProducts/getSalersByChannel.html',
                    data: {
                        channel: channel
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data)
                        }else{
                            reject(res.msg || '请求出错')
                        }
                    }
                })
            });
        },
        //新销售保存
        newSaleSaveAjax: function(obj){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/winitSellerChooseProducts/transferVolunteerProduct.html',
                    contentType: 'application/json',
                    data: JSON.stringify(obj),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data || '转移成功')
                        }else{
                            reject(res.msg || '请求出错')
                        }
                    }
                })
            });
        },
        //选品接口
        selectionAjax: function(ids){
            return commonReturnPromise({
                url: '/lms/winitSalerChooseProducts/chooseProduct.html',
                params: {
                    ids: ids
                }
            })
        }
    };
    //选择类目
    selectionName.cate();
    //渲染销售渠道
    selectionName.renderChannel();
    //选品意向和导入意向
    // selectionName.importAjax('selection_importIntention', 'winitSellerChooseProducts/importVolunteerProducts.html');
    // selectionName.selectInitHandle();
    //表单搜索事件
     form.on('submit(selection_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var obj = selectionName.dataHandle(data);
        // console.log(obj);
        if(!data.salerId){
            return layer.msg('海外仓销售员必选');
        }
        selectionName.tableRender(obj);
    });
    //默认触发搜索事件
    // $('[lay-filter="selection_submit"]').trigger('click');    
    //表头固定
    UnifiedFixedFn('selectionCard');
    //批量选品
    selectionName.batchHandle();
    //悬浮显示表格
    $('body').on('mouseover', '.selection_channelHover', function(){
        var data = JSON.parse($(this).next().val());
        var tableStr = `<div><table class="layui-table selectionHoverTable">
                        <thead>
                            <tr>
                                <th>销售</th>
                                <th>选品时间</th>
                            </tr>
                        </thead>
                        <tbody>
                    `
        for(var i=0; i<data.length; i++){
            var item= data[i];
            tableStr += `<tr>
                            <td style="">${item.saler}</td>
                            <td>${Format(item.createTime, 'yyyy-MM-dd')}</td>
                        </tr>`
        }
        tableStr +='</tbody></table></div>';
        layer.tips(tableStr,this,{tips: [1,'#fff'],time:10000,area:['250px']})
    });
    $('body').on('mouseleave', '.selection_channelHover', function(){
        layer.close(layer.tips());
    })
})
// function hoverShowTable(data, self){
//     console.log(tableStr);
//     var index = layui.layer.tips(tableStr,self,{tips: [1, 'orange'],time:10000})
//     $(self).attr('data-tipId',index)
// }
