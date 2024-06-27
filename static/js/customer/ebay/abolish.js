layui.use(['admin','table','form','element','layer','laytpl', 'upload','laydate','formSelects'],function(){
    var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        upload = layui.upload,
        formSelects = layui.formSelects
        form = layui.form;
    form.render();
    //初始化部门-用户-店铺
    render_hp_orgs_users("#abolish_searchForm");
    //时间处理(默认2个月)
    var abolish_nowDateString = new Date().getTime();
    var abolish_dateFiftweenSting = abolish_nowDateString - 60*24*60*60*1000;
    var abolish_dateStart = Format(abolish_dateFiftweenSting, 'yyyy-MM-dd');
    var abolish_dateEnd = Format(abolish_nowDateString, 'yyyy-MM-dd');
    //渲染时间范围
    laydate.render({
        elem: '#abolish_receive_date', //指定元素
        range: true,
        value: abolish_dateStart +' - '+ abolish_dateEnd
    });

    //监听tab点击事件
    element.on('tab(abolish-tabs)', function(data){
        if(data.index == 0) { //开启
            $('#abolish-tabVal').val('2');
            $('[lay-filter="abolish_submit"]').trigger('click');
        }else if(data.index == 1){ //关闭
            $('#abolish-tabVal').val('3');
            $('[lay-filter="abolish_submit"]').trigger('click');
        }else if(data.index == 2){ //全部
            $('#abolish-tabVal').val('1');
            $('[lay-filter="abolish_submit"]').trigger('click');
        }
    });
    //abolish命名空间
    var abolishName={
        initCalcelReasonList: function(){
            commonReturnPromise({
                url: "/lms/ebayCancel/listCancelReason"
            }).then(data=>{
                const arr = data.map(item=>({name:item,value:item}))
               formSelects.data('ebay_abolish_cancalreason','local',{arr})
            })
        },
        //表格搜索的数据处理
        dataHandle: function(data){ 
            data.roleNames = 'ebay客服专员';
            data.platCode = 'ebay';
            data.type ='customservicer';
            data.searchType = $('#abolish-tabVal').val();
            if(data.times){
                var timeArr =data.times.split(' - ');
                data.startDate = timeArr[0];
                data.endDate = timeArr[1];
            }else{
                data.startDate = '';
                data.endDate = '';
            }
            if(data.abolish_searchType == 'cancelId'){
                data.cancelId = data.abolish_searchContent;
                data.itemId = '';
                data.buyerName = '';
            }else if(data.abolish_searchType == 'itemId'){
                data.itemId = data.abolish_searchContent;
                data.cancelId = '';
                data.buyerName = '';
            }else{
                data.itemId = '';
                data.cancelId = '';
                data.buyerName = data.abolish_searchContent;
            }
            data.cancelReasonList = data.cancelReasonList==='' ?[]:data.cancelReasonList.split(',')
            delete data.times;
            delete data.abolish_searchType;
            delete data.abolish_searchContent;
            return data;
        },
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#abolish_table',
                method: 'post',
                url:'/lms/ebayCancel/search.html',
                where: data,
                contentType: 'application/json;charset=UTF-8',
                page: true,
                id: "abolish_tableId",
                limits: [50, 100, 300],
                limit: 50,
                cols: [
                    [
                        // {type: 'checkbox', width:32},
                        {title: '产品信息',templet: '#abolish_info'},
                        {title: '取消交易编号',field: 'cancelId', width: 100},
                        {title: '买家', field: 'buyerName',width : 140},
                        {title: '卖家',templet:'<div><div style="text-align:left;"><div><strong>店铺:</strong>{{d.sellerName}}</div><div><strong>客服:</strong>{{d.customServicer}}</div></div></div>', width: 140},
                        {title: '交易金额', templet: '#abolish_money', width: 100},
                        {title: '发起原因',field: 'cancelReason', width: 130},
                        {title: '发起关闭原因',field: 'cancelCloseReason', width: 130},
                        {title: '日期', templet: '#abolish_date', width: 200},
                        {title: '状态', field: 'cancelState', width: 160},
                        {title: '操作',toolbar: '#abolish_tableIdBar', width:80}
                    ]
                ],
                done: function(res){
                    const abolish_numbers = res.extra;
                    $('#abolish_not_handle_number').html(abolish_numbers.openTotal);//开启
                    $('#abolish_already_close_number').html(abolish_numbers.closedTotal);//关闭
                    $('#abolish_all_handle_number').html(abolish_numbers.allTotal);//全部
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(abolish_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'detail'){ //详情
                    _this.detailPageRender(data);
                }else if(obj.event == 'auto'){ //同步
                    _this.singleAuto(data);
                }
            });
        },
        //单个订单同步
        singleAuto: function(data){
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/lms/ebayCancel/syncOneCancelOrder.html',
                data: {
                    cancelId: data.cancelId,
                    storeAcctId: data.storeAcctId
                },
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        layer.msg(res.msg || '同步成功');
                        $('[lay-filter="abolish_submit"]').trigger('click');
                    }else{
                        layer.msg(res.msg || '同步失败');
                    }
                }
            });
        },
        //取消订单字段参数
        cancelOrder: function(){
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/ebayCancel/getCancelStatus.html',
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        var str = '<option value="">请选择</option>';
                        for(var i=0; i< res.data.length; i++){
                            var item = res.data[i];
                            str += `<option value="${item}">${item}</option>`
                        }
                        $('#abolish_cancelStatus').append(str);
                        form.render();
                    }else{
                        layer.msg(res.msg|| '请求取消状态接口失败!');
                    }
                }
            })
        },
        detailPageRender: function(data){
            var _this = this;
            Promise.all([_this.detailAjaxRequest(data),_this.MoneyHistoryRequest(data),_this.ActivityHistoryRequest(data)]).then(function(result){
                result.push(data);
                // console.log(result);
                layer.open({
                    type:1,
                    title: '详情',
                    area:['1100px', '600px'],
                    btn: ['保存','关闭'],
                    id: 'abolish_detail_layerId',
                    content: $('#abolish_detail_layer').html(),
                    success: function(layero,index){
                        var getTpl = abolish_detail_containerTpl.innerHTML,
                        view = document.getElementById('abolish_detail_container');
                        laytpl(getTpl).render(result, function(html){
                            view.innerHTML = html;
                            form.render();
                            _this.watchRadio();
                            laydate.render({
                                elem: '#abolishlayer_sendTime'
                            });
                        });
                    },
                    yes: function(index,layero){
                        var val = $('.abolish_detail_file').find("input[type='radio']:checked").val();
                        var obj = {};
                        var objUrl = '';
                        if(val == 'abolishAgree'){
                            obj.cancelId = data.cancelId;
                            obj.storeAcctId = data.storeAcctId;
                            objUrl = '/lms/ebayCancel/approveCancel.html';
                        }else{
                            obj.cancelId = data.cancelId;
                            obj.storeAcctId = data.storeAcctId;
                            obj.trackingNumber = $('#abolishlayer_trackno').val();
                            obj.shipmentDate = $('#abolishlayer_sendTime').val();
                            objUrl = '/lms/ebayCancel/rejectCancel.html';
                        };
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: objUrl,
                            data: obj,
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code == '0000'){
                                    layer.msg(res.msg || '操作成功');
                                    layer.close(index);
                                    $('[lay-filter="abolish_submit"]').trigger('click');
                                }else{
                                    layer.msg(res.msg);
                                }
                            }
                        });
                    }
                })
          }).catch(function(reason){
              console.log(reason)
              layer.msg(reason);
          });
        },
        //监听radio选择
        watchRadio: function(){
            form.on('radio(abolish_handle_filter)', function(obj){
                var val = obj.value;
                // console.log(obj);
                if(val == 'abolishAgree'){
                    $('#abolishlayer_sendProductTime').addClass('abolish_disN');
                    $('#abolishlayer_trackno_parent').addClass('abolish_disN');
                }else{
                    $('#abolishlayer_sendProductTime').removeClass('abolish_disN');
                    $('#abolishlayer_trackno_parent').removeClass('abolish_disN');
                }
            })
        },
        //详情接口请求
        detailAjaxRequest: function(data){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    // contentType:'application/json',
                    url: '/lms/ebayCancel/searchOrderDetail.html',
                    data: {
                        itemId: data.itemId,
                        transactionId: data.transactionId,
                        cancelId: data.cancelId,
                        storeAcctId: data.storeAcctId
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        if(res.code == '0000'){
                            loading.hide();
                            resolve(res.data || {});
                        }else{
                            loading.hide();
                            reject(res.msg);
                        }
                    },
                    error: function(){
                        loading.hide();
                        reject('服务器出问题,请稍后在试!');
                    }
                });
            });
        },
        //交易详情接口(资金历史)
        MoneyHistoryRequest: function(data){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/ebayCancel/getCancelMoneyHistory.html',
                    data: {
                        cancelId: data.cancelId,
                        storeAcctId: data.storeAcctId
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data || []);
                        }else{
                            reject(res.msg);
                        }
                    },
                    error: function(){
                        loading.hide();
                        reject('服务器出问题,请稍后在试!');
                    }
                });
            });
        },
        //操作记录接口(活动历史)
        ActivityHistoryRequest: function(data){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/ebayCancel/getCancelActivityHistory.html',
                    data: {
                        cancelId: data.cancelId,
                        storeAcctId: data.storeAcctId
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve(res.data || []);
                        }else{
                            reject(res.msg);
                        }
                    },
                    error: function(){
                        loading.hide();
                        reject('服务器出问题,请稍后在试!');
                    }
                });
            });
        },
        //批量同步
        bacthHandle: function(){
            $('#abolish_batchHandle').on('click', function(){
                var storeAcctId = $('#abolish_searchForm').find('select[name=storeAcctId]').val();
                console.log(storeAcctId);
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/lms/ebayCancel/syncOneStore.html',
                    data: {
                        storeAcctId: storeAcctId
                    },
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            layer.msg(res.msg || '批量同步成功');
                            $('[lay-filter="abolish_submit"]').trigger('click');
                        }else{
                            layer.msg(res.msg);
                        }
                    }
                })
            });
        }
    }
    //表单搜索事件
    form.on('submit(abolish_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var dataObj =abolishName.dataHandle(data);
        abolishName.tableRender(dataObj);
        // console.log(dataObj);
    });
    //表头固定
    UnifiedFixedFn('abolishCard');
    //批量操作
    abolishName.bacthHandle();
    //取消订单
    abolishName.cancelOrder();
    // 取消原因枚举
    abolishName.initCalcelReasonList()
    //默认查询2个月
    $('[lay-filter="abolish_submit"]').trigger('click');
});