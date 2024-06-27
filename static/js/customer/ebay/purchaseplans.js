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
    render_hp_orgs_users("#purchaseplans_searchForm"); //渲染部门销售员店铺三级联动
    //时间范围
    laydate.render({
        elem: '#purchaseplans_rangeTime'
        ,type: 'datetime'
        ,range: true
    });
    //点击事件(切换选项)
    element.on('tab(purchaseplans-tabs)', function(data){
        if(data.index == 0) { //购买计划
            $('#purchaseplans-tabVal').val(0);
            //展示隐藏未留评和未分配
            $('.purchaseplans_card_checkbox').removeClass('disN');
            $('.purchaseplans-notBuyer').removeClass('disN');
            $('.purchaseplans-notEvaluate').addClass('disN');
            $('[lay-filter="purchaseplans_submit"]').trigger('click');
        }else if(data.index == 1){ //已取消
            $('#purchaseplans-tabVal').val(1);
            //展示隐藏未留评和未分配
            $('.purchaseplans_card_checkbox').addClass('disN');
            $('[lay-filter="purchaseplans_submit"]').trigger('click');
        }else if(data.index == 2){ //购买中
            $('#purchaseplans-tabVal').val(2);
            //展示隐藏未留评和未分配
            $('.purchaseplans_card_checkbox').addClass('disN');
            $('[lay-filter="purchaseplans_submit"]').trigger('click');
        }else if(data.index == 3){//购买成功
            $('#purchaseplans-tabVal').val(3);
            //展示隐藏未留评和未分配
            $('.purchaseplans_card_checkbox').removeClass('disN');
            $('.purchaseplans-notBuyer').addClass('disN');
            $('.purchaseplans-notEvaluate').removeClass('disN');
            $('[lay-filter="purchaseplans_submit"]').trigger('click');
        }else if(data.index == 4){//购买失败
            $('#purchaseplans-tabVal').val(4);
            //展示隐藏未留评和未分配
            $('.purchaseplans_card_checkbox').addClass('disN');
            $('[lay-filter="purchaseplans_submit"]').trigger('click');
        }else if(data.index == 5){//全部
            $('#purchaseplans-tabVal').val('');
            //展示隐藏未留评和未分配
            $('.purchaseplans_card_checkbox').addClass('disN');
            $('[lay-filter="purchaseplans_submit"]').trigger('click');
        }
    });
    //命名空间
    var purchaseplansName = {
        //渲染买家Id
        renderBuyer: function(){
            this.buyerAjax().then(function(result){
                var optStr = '<option value="">请选择</option>';
                for(var i=0; i<result.length; i++){
                    var item = result[i];
                    optStr += `<option value="${item.id}">${item.storeAcct}</option>`;
                }
                $('#purchaseplans_buyerId').html(optStr);
                formSelects.render();
            }).catch(function(err){
                layer.msg(err);
            })
        },
        //数据处理
        dataHandle: function(data){
            //tab页签
            data.planStatus = $('#purchaseplans-tabVal').val();
            //未分配买家
            data.allocatedStatus = $('#purchaseplans_notBuyerVal').val();
            //未留评
            data.feedbackStatus = $('#purchaseplans_notEvaluateVal').val();
            //处理时间
            if(data.times){
                var timeArr =data.times.split(' - ');
                data.startTime = timeArr[0];
                data.endTime = timeArr[1];
            }else{
                data.startTime = '';
                data.endTime = '';
            }
            //处理itemId,title
            if(data.searchType == 'itemId'){
                data.itemId = data.searchTypeVal;
                data.title = '';
                data.shipmentTrackingNumber = '';
                data.feedback = '';
            }else if(data.searchType == 'title'){
                data.itemId = '';
                data.title = data.searchTypeVal;
                data.shipmentTrackingNumber = '';
                data.feedback = '';
            }else if(data.searchType == 'feedback'){
                data.itemId = '';
                data.title = '';
                data.shipmentTrackingNumber = '';
                data.feedback =data.searchTypeVal;
            }else if(data.searchType == 'shipmentTrackingNumber'){
                data.itemId = '';
                data.title = '';
                data.shipmentTrackingNumber = data.searchTypeVal;
                data.feedback = '';
            }
            var currentStoreAccts = formSelects.value("purchaseplans_storeSel", "val"); //所选店铺
            if (currentStoreAccts == null || currentStoreAccts.length < 1) { //没有选择店铺
				var acctIds = $("#purchaseplans_storeSel").attr("acct_ids");
				if (acctIds && acctIds.length > 1) {
					data.storeAcctId = acctIds;
				} else {
					data.storeAcctId = 99999;
				}
			} else {
				storeAcctId = currentStoreAccts.join(","); //选择的店铺
			}
            //删除多余字段
            delete data.times;
            delete data.searchType;
            delete data.searchTypeVal;
            return data;
        },
        //表格渲染
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#purchaseplans_table',
                method: 'get',
                url: '/lms/ebay/buyer/listPlan.html',
                where:  data,
                page: true,
                limits: [50, 100, 300],
                limit: 50,
                id: "purchaseplans_tableId",
                cols:[
                    [
                        {type: 'checkbox', width:32},
                        {title: '图片',templet:'#purchaseplans_img', width: 70},
                        {title:'标题/itemID',templet:'#purchaseplans_title',width: 355},
                        {title: '售价', templet:'<div><div><strong class="currency">{{d.currency}}</strong>:<span class="price">{{d.price}}</span></div></div>', width: 125},
                        {title: '在线数量',
                        templet: `<div>
                        {{# if(d.stock){ }}
                          <span>{{d.stock}}</span>
                        {{# }else{ }}
                            <span>MORE_THAN 10</span>
                        {{# } }}
                        </div>`, width:80},
                        {title: '购买数量', field:'orderQuantity', width:80},
                        {title: '买家ID', field:'buyer'},
                        {title: '订单状态', field: 'purchaseOrderStatus'},
                        {title: '留评', field: 'feedbackStatus'},
                        {title: '人员', filed: 'creator', templet:`<div><div style="text-align:left;">
                        <div><strong>创建:</strong><span>{{d.creator}}</span></div>
                        <div><strong>购买:</strong><span>{{d.modifier}}</span></div>
                        </div></div>`, width: 120},
                        {title: '时间', templet: '#purchaseplans_times', width: 170},
                        {title: '备注', filed: 'remark'},
                        {title: '操作',toolbar: '#purchaseplans_tableIdBar', width: 80}
                    ]
                ],
                done: function(res){
                    $('#purchaseplans-tabs').find('li>span').text('点击显示');
                    $('#purchaseplans-tabs').find('li.layui-this>span').text(res.count);
                    //监听表格事件
                    _this.watchBar();
                }
            });
        },
        //监听表格事件
        watchBar: function(){
            var _this = this;
            table.on('tool(purchaseplans_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'buy'){ //购买
                    var ids = data.id;
                    _this.purchaseLayer(ids);
                }else if(obj.event == 'edit'){ //编辑
                    console.log('编辑')
                }else if(obj.event == 'delete'){//删除
                    _this.deleteLayer(data.id);    
                }else if(obj.event == 'leave'){ //留评
                    _this.evaluateDialog(data);
                }else if(obj.event == 'cancel'){ //取消
                    _this.cancelLayer(data.id);
                }
            });
        },
        //参数配置弹框(完成)
        argConfigFn: function(){
            var _this = this;
            $('#purchaseplans_args_config_button').on('click', function(){
                var index = layer.open({
                    type: 1,
                    title: '参数配置',
                    area:['600px', '400px'],
                    btn: ['确认','关闭'],
                    id: 'purchaseplans_layerId',
                    content: $('#purchaseplans_args_config_layer').html(),
                    success: function(layero,index){
                        var getTpl = purchaseplans_args_config_template.innerHTML,
                        view = document.getElementById('purchaseplans_args_config_container');
                        _this.allConfigAjax().then(function(result){
                            laytpl(getTpl).render(result, function(html){
                                view.innerHTML = html;
                            });
                        }).catch(function(err){
                            layer.msg(err);
                        });
                    },
                    yes: function(index,layero){
                        var dailyOrderNum = $('#purchaseplans_args_config_number').val();//每日可下单数量
                        var storeInterval = $('#purchaseplans_args_config_delay').val();//店铺间隔
                        _this.editConfigAjax(dailyOrderNum,storeInterval).then(function(result){
                            layer.msg(result);
                            layer.close(index);
                        }).catch(function(err){
                            layer.msg(err);
                        })
                    }
                })
            });
        },
        //批量点击按钮封装
        batchBtnHandle:function(id, fn){
            var _this = this;
            $('#'+id).on('click', function(){
                _this.tableSlect().then(function(result){
                    _this[fn](result);
                }).catch(function(err){
                    layer.msg(err);
                });
            });
        },
        //表格选中处理
        tableSlect: function(){
           return new Promise(function(resolve, reject){
                var checkStatus = table.checkStatus('purchaseplans_tableId')
                , data = checkStatus.data;
                if(!data.length){
                    reject('请先选中一条数据');
                };
                var idsArr = data.map(function(item){
                    return item.id;
                })
                var ids = idsArr.join(',');
                resolve(ids);
           })
        },
        tableSlectD: function(){
            return new Promise(function(resolve, reject){
                 var checkStatus = table.checkStatus('purchaseplans_tableId')
                 , data = checkStatus.data;
                 if(!data.length){
                     reject('请先选中一条数据');
                 };
                 resolve(data);
            })
         },
        //批量购买功能
        purchaseFn: function(){
            this.batchBtnHandle('purchaseplans_purchase_button','purchaseLayer');
        },
        //购买功能的独立弹框
        purchaseLayer: function(ids){
            var _this = this;
            layer.open({
                type: 1,
                title: '购买',
                area:['600px', '400px'],
                btn: ['确认','关闭'],
                id: 'purchaseplans_purchase_layerId',
                content: $('#purchaseplans_purchase_layer').html(),
                success: function(layero,index){
                    laydate.render({
                        elem: '#purchaseplans_purchase_time'
                        ,type: 'datetime'
                    });
                },
                yes: function(index,layero){
                    var planTime =$('#purchaseplans_purchase_time').val(); //开始时间
                    var interval = $('#purchaseplans_purchase_minute').val(); //间隔时间
                    if(!planTime || !interval){
                        return layer.msg('开始时间和间隔时间都不能为空!');
                    }
                    _this.purchaseAjax(ids,planTime,interval).then(function(result){
                        layer.msg(result);
                        layer.close(index);
                        $('[lay-filter="purchaseplans_submit"]').trigger('click');
                    }).catch(function(err){
                        layer.msg(err);
                    })
                }
            });
        },
        //批量删除功能
        deleteFn: function(){
            this.batchBtnHandle('purchaseplans_delete_button','deleteLayer');
        },
        //删除弹框
        deleteLayer: function(ids){
            var _this = this;
            layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
                _this.deleteAjax(ids).then(function(result){
                    layer.msg(result);
                    layer.close(index);
                    $('[lay-filter="purchaseplans_submit"]').trigger('click');
                }).catch(function(err){
                    layer.msg(err);
                });
            });
        },
        //批量取消功能
        cancelFn: function(){
            this.batchBtnHandle('purchaseplans_cancel_button', 'cancelLayer');
        },
        //取消弹框
        cancelLayer: function(ids){
            var _this = this;
            layer.confirm('确定取消吗?', {icon: 3, title:'提示'}, function(index){
                _this.cancelAjax(ids).then(function(result){
                    layer.msg(result);
                    layer.close(index);
                    $('[lay-filter="purchaseplans_submit"]').trigger('click');
                }).catch(function(err){
                    layer.msg(err);
                });
            });
        },
        //分配买家功能
        allocateFn: function(){
            this.batchBtnHandle('purchaseplans_allocate_button', 'allocateLayer');
        },
        allocateLayer: function(ids){
            this.allocateAjax(ids).then(function(result){
                layer.msg(result);
                $('[lay-filter="purchaseplans_submit"]').trigger('click');
            }).catch(function(err){
                layer.msg(err);
            })
        },
        //批量留评操作
        leaveFn: function(){
            var _this = this;
            $('#purchaseplans_leave_button').on('click', function(){
                _this.tableSlectD().then(function(result){
                    console.log(result);
                    _this.evaluateDialog(result);
                }).catch(function(err){
                    layer.msg(err);
                });
            })
        },
        //新增
        addFn: function(){
            var _this= this;
            $('#purchaseplans_add_button').on('click', function(){
                var index = layer.open({
                    type: 1,
                    title: '新增',
                    area:['1100px', '700px'],
                    btn: ['新建计划','关闭'],
                    id: 'purchaseplans_add_layerId',
                    content: $('#purchaseplans_add_layer').html(),
                    success: function(layero,index){
                        //关注搜索事件
                        $('#purchaseplans_add_search_btn').on('click', function(){
                            var inpVal = $('#purchaseplans_add_search_input').val();
                            if(!inpVal){
                                return layer.msg('查询的itemId不能为空!');
                            }
                            _this.addFnRender(inpVal);
                        });
                    },
                    yes: function(index,layero){
                        //关注保存事件
                        var targetTrs = $('.purchaseplans_add_tableContainer').find('.layui-table-body.layui-table-main>table>tbody>tr');
                        var tableData = [];
                        //数据获取完成
                        for(var i=0; i<targetTrs.length; i++){
                            var $tr = $(targetTrs[i]);
                            var obj = {};
                            var imgUrl = $tr.find('td:nth-child(1) img').attr('src'); //图片
                            if(imgUrl == '/lms/static/img/kong.png'){
                                obj.img = '';
                            }else{
                                obj.img = imgUrl;
                            };
                            obj.storeAcct = $tr.find('td:nth-child(2) div').text(); //店铺
                            obj.itemId = $tr.find('td:nth-child(3) div').text(); //itemId
                            obj.title = $tr.find('td:nth-child(4) div').text(); //标题
                            obj.stock = $tr.find('td:nth-child(5) div').text(); //在线数量
                            obj.currency = $tr.find('td:nth-child(6) .currency').text(); //币种
                            obj.price = $tr.find('td:nth-child(6) .price').text() || ''; //价格
                            obj.storeAcctId = $tr.find('td:nth-child(7) input[type=hidden]').val(); //卖家Id
                            if(obj.storeAcctId == 'undefined'){
                                obj.storeAcctId = '';
                            }
                            obj.orderQuantity = $tr.find('td:nth-child(7) input[type=text]').val(); //购买数量
                            tableData.push(obj);
                        };
                        //执行新增操作
                        _this.addAjax(tableData).then(function(result){
                            layer.msg(result);
                            layer.close(index);
                            $('[lay-filter="purchaseplans_submit"]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err);
                        })
                    }
                });
            });
        },
        //新增弹框表格渲染
        addFnRender: function(data){
            table.render({
                elem: '#purchaseplans_add_table',
                method: 'get',
                url: '/lms/ebay/buyer/list.html',
                where:  {items: data},
                page: false,
                id: "purchaseplans_add_tableId",
                cols:[
                    [
                        // {type: 'checkbox', width:32},
                        {title: '图片',templet:'#purchaseplans_add_layer_img', width: 70},
                        {title: '店铺', field: 'storeAcct'},
                        {title:'itemID',templet:'<div><a  href="http://www.ebay.co.uk/itm/{{d.itemId}}" target="_blank" style="color:#4ab2fe;">{{d.itemId}}</a></div>'},
                        {title: '标题', field:'title', width: 240},
                        {title: '在线数量',field:'stock'},
                        {title: '价格', templet:'<div><div><strong class="currency">{{d.currency}}</strong>:<span class="price">{{d.price}}</span></div></div>'},
                        {title: '购买数量',templet:'#purchaseplans_add_layer_number',width: 80},
                        {title: '删除',toolbar: '#purchaseplans_add_layer_tableIdBar', width: 80}
                    ]
                ],
                done: function(){
                    //单个删除事件
                    $('#purchaseplans_add_layerId').on('click', '.purchaseplans_add_layer_tableIdBar_remove', function(){
                        $(this).parents('tr').remove();
                    });
                }
            });
        },
        //留评弹框
        evaluateDialog:function(data){
            var _this = this;
            var dataArr = [];
            if(Object.prototype.toString.call(data) == '[object Object]'){
                dataArr.push(data);
            }else{
                dataArr = data;
            }
           var index = layer.open({
               type: 1,
               title: '留评',
               showClose: false,
               area: ['1100px', '800px'],
               btn: ['提交', '关闭'],
               id: 'purchaseplans_leave_layerID',
               content: $('#purchaseplans_leave_layer').html(),
               success:  function(layero,index){
                    var dataObj = {};
                    dataObj.dataArr = dataArr;
                    //渲染邮件类型和名称
                    Promise.all([_this.getEmailType(),_this.getEmailName()]).then(function(result){
                        dataObj.emailType = result[0];
                        dataObj.nameType = result[1];
                        var getTpl = purchaseplans_leave_layer_tableTpl.innerHTML,
                        view = document.getElementById('purchaseplans_leave_layer_tableContainer');
                        laytpl(getTpl).render(dataObj, function(html){
                            view.innerHTML = html;
                            form.render();
                           //点击应用
                            $('#purchaseplans_leave_layer_config').on('click', function(){
                                // console.log('应用点击')
                                var $val = layero.find('select[name=purchaseplans_leave_layer_middle_name]').val();
                                $.ajax({
                                    type: 'post',
                                    dataType: 'json',
                                    url: '/lms/emailTemplate/queryTemplateInfoById.html',
                                    data: {id: $val},
                                    beforeSend: function(){
                                        loading.show();
                                    },
                                    success: function(response){
                                        loading.hide();
                                        if(response.code=='0000'){
                                            var $trs = layero.find('#purchaseplans_leave_layer_table_tbody>tr');
                                            for(var i=0; i<$trs.length; i++){
                                                var item = $trs[i];
                                                $(item).find('td.comment_textarea>textarea').val(response.data);
                                            };
                                        }
                                    }
                                })
                            });
                            //监听移除
                            $('#purchaseplans_leave_layer_table_tbody').on('click','.purchaseplans_leave_remove', function(){
                                    $(this).parents('tr').remove();
                            });

                            //联动
                            var targetSel = layero.find('select[name=purchaseplans_leave_layer_middle_name]');
                            form.on('select(purchaseplans_leave_layer_middle_type)', function(data){
                                console.log(data.value);
                                _this.getEmailName(data.value).then(function(emailNameresult){
                                    var optStrs = '';
                                    if(emailNameresult.length){
                                        for(var j=0;j<emailNameresult.length; j++){
                                           var emailNameItem = emailNameresult[j];
                                           optStrs +=`<option value="${emailNameItem.id}">${emailNameItem.name}</option>`;
                                        }
                                    }else{
                                      optStrs +=`<option value="">请选择</option>`;
                                    }
                                    targetSel.html(optStrs);
                                    form.render('select');
                                });
                            }); 
                        });
                    });
               },
               yes: function(index, layero){
                    var $trs = layero.find('#purchaseplans_leave_layer_table_tbody>tr');
                    var commentsArr = [];
                    for(var i=0; i<$trs.length; i++){
                        var item = $trs[i];
                        var id = $(item).find('td:first-child>input[type=hidden]').val();
                        var responseText = $(item).find('td.comment_textarea>textarea').val();
                        commentsArr.push({id, responseText});
                    };
                    if(!commentsArr.length){
                        return layer.msg('没有数据!')
                    };
                    _this.saveLeaveAjax(commentsArr).then(function(result){
                        layer.msg(result);
                        layer.close(index);
                        $('[lay-filter="purchaseplans_submit"]').trigger('click');
                    }).catch(function(err){
                        layer.msg(err);
                    });
               }
           }) 
        },
    //ajax请求
        //新增请求
        addAjax: function(data){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/ebay/buyer/addPlan.html',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000' || res.code == '5555'){
                            resolve(res.msg || '新增成功');
                        }else{
                            reject(res.msg || '新增失败');
                        }
                    },
                    error: function(err){
                        loading.hide();
                        reject(err.error)
                    }
                })
            });
        },
        //买家店铺请求
        buyerAjax: function(){
           return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/buyer/listBuyer.html',
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code =='0000'||res.code == '5555'){
                            resolve(res.data || []);
                        }else {
                            reject(res.msg);
                        }
                    },
                    error: function(err){
                        reject(err);
                    }
                })
           })
        },
        //全局配置请求
        allConfigAjax: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/buyer/search/config.html',
                    beforeSend: function(){
                        loading.show();
                    },
                    success:function(res){
                        loading.hide();
                        if(res.code == '0000'||res.code == '5555'){
                            resolve(res.data);
                        }else{
                            reject(res.msg);
                        }
                    },
                    error: function(err){
                        reject(err);
                    }
                })
            })
        },
        // 修改配置请求
        editConfigAjax: function(day, interval){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/buyer/config.html',
                    data: {
                        dailyOrderNum: day,
                        storeInterval: interval
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success:function(res){
                        loading.hide();
                        if(res.code == '0000'||res.code == '5555'){
                            resolve(res.msg || '修改参数成功');
                        }else{
                            reject(res.msg);
                        }
                    },
                    error: function(err){
                        reject(err);
                    }
                })
            })
        },
        //取消计划请求
        cancelAjax: function(ids){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/buyer/cancelPlan.html',
                    data: {
                        ids: ids
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success:function(res){
                        loading.hide();
                        if(res.code == '0000'||res.code == '5555'){
                            resolve(res.msg || '取消成功');
                        }else{
                            reject(res.msg);
                        }
                    },
                    error: function(err){
                        reject(err);
                    }
                })
            })
        },
        //删除计划请求
        deleteAjax: function(ids){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/buyer/removePlan.html',
                    data: {
                        ids: ids
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success:function(res){
                        loading.hide();
                        if(res.code == '0000'||res.code == '5555'){
                            resolve(res.msg || '删除成功');
                        }else{
                            reject(res.msg);
                        }
                    },
                    error: function(err){
                        reject(err);
                    }
                })
            })
        },
        //购买计划请求
        purchaseAjax: function(ids, planTime, interval){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/buyer/addToPlanQueue.html',
                    data: {
                        ids: ids,
                        planTime: planTime,
                        interval: interval
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success:function(res){
                        loading.hide();
                        if(res.code == '0000'||res.code == '5555'){
                            resolve(res.msg || '购买计划成功');
                        }else{
                            reject(res.msg);
                        }
                    },
                    error: function(err){
                        reject(err);
                    }
                })
            })
        },
        //分配买家请求
        allocateAjax: function(ids){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/buyer/allocated.html',
                    data: {
                        ids: ids
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success:function(res){
                        loading.hide();
                        if(res.code == '0000'||res.code == '5555'){
                            resolve(res.msg);
                        }else{
                            reject(res.msg);
                        }
                        
                    },
                    error: function(err){
                        reject(err);
                    }
                })
            })
        },
         //获取邮件类型
        getEmailType: function(){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/emailTemplate/queryTemplateTypeName.html',
                    data: {platformCode: 'ebay'},
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        if(res.code == '0000'){
                            loading.hide();
                            resolve(res.data || []);
                        }else{
                            loading.hide();
                            reject(res.msg);
                        }
                    },
                    error: function(){
                        loading.hide();
                        reject('服务器出问题,请稍后在试!');
                    }
                })
            });
        },
        //获取邮件名称
        getEmailName: function(templateTypeName){ 
            if(!templateTypeName){
                templateTypeName = '';
            };
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/emailTemplate/queryFeedbackTemplateName.html',
                    data: {templateTypeName: templateTypeName},
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        if(res.code == '0000'){
                            loading.hide();
                            resolve(res.data || []);
                        }else{
                            loading.hide();
                            reject(res.msg);
                        }
                    },
                    error: function(){
                        loading.hide();
                        reject('服务器出问题,请稍后在试!');
                    }
                })
            });
        },
        //保存留评
        saveLeaveAjax: function(data){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    url: '/lms/ebay/buyer/feedback.html',
                    data: JSON.stringify(data),
                    beforeSend: function(){
                        loading.show();
                    },
                    success:function(res){
                        loading.hide();
                        if(res.code == '0000'||res.code == '5555'){
                            resolve(res.msg);
                        }else{
                            reject(res.msg);
                        }
                        
                    },
                    error: function(err){
                        reject(err);
                    }
                })
            })
        }
    };

    //参数配置
    purchaseplansName.argConfigFn();
    //新增弹框
    purchaseplansName.addFn();
    //渲染买家id
    purchaseplansName.renderBuyer();

    //表单搜索事件
    form.on('submit(purchaseplans_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var dataObj =purchaseplansName.dataHandle(data);
        purchaseplansName.tableRender(dataObj);
    });

    //监听未留评是否选中
    form.on('checkbox(purchaseplans_notEvaluate)', function(data){
        var selted = data.elem.checked;
        if(selted){
            $('#purchaseplans_notEvaluateVal').val(0);
        }else{
            $('#purchaseplans_notEvaluateVal').val('');
        };
        $('[lay-filter="purchaseplans_submit"]').trigger('click');
    }); 
    //监听未分配是否选中
    form.on('checkbox(purchaseplans_notBuyer)', function(data){
        var selted = data.elem.checked;
        if(selted){
            $('#purchaseplans_notBuyerVal').val(0);
        }else{
            $('#purchaseplans_notBuyerVal').val('');
        };
        $('[lay-filter="purchaseplans_submit"]').trigger('click');
    }); 

    //批量购买
    purchaseplansName.purchaseFn();
    //批量删除
    purchaseplansName.deleteFn();
    //批量取消
    purchaseplansName.cancelFn();
    //分配买家
    purchaseplansName.allocateFn();
    //批量留评
    purchaseplansName.leaveFn();

});