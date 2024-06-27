layui.use(['admin','table','form','element','layer','laytpl', 'upload','laydate'],function(){
    var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        upload = layui.upload,
        form = layui.form;
    form.render();
    //初始化部门-用户-店铺
    render_hp_orgs_users("#inquiry_searchForm");
    //表头固定
    UnifiedFixedFn('inquiryCard');
    //inquiry状态查询
    initInquiryStatus();
    getSalersPerson();
    function initInquiryStatus() {
        $.ajax({
            type: "get",
            dataType: 'json',
            url: '/lms/ebay/inquiry/inquiryStatus.html',
            success: function (result) {
                if (result.code == '0000') {
                //  获取select元素
                    var $inquiryStatus = $("#inquiry_searchForm select[name='inquiryStatus']");
                    var $option="<option value=''>全部</option>";
                    var data = result.data;
                    data.forEach(function(item){
                        $option += '<option value='+item+'>'+item+'</option>';
                    });
                    $inquiryStatus.append($option);
                    form.render('select');
                } else {
                    layer.msg(res.msg || '初始化inquiry状态列表失败');
                }
            },
            error: function (result) {
                console.error("获取列表失败")
            }
        });
    };
    //时间处理(默认2个月)
    var inquiry_nowDateString = new Date().getTime();
    var inquiry_dateFiftweenSting = inquiry_nowDateString - 60*24*60*60*1000;
    var inquiry_dateStart = Format(inquiry_dateFiftweenSting, 'yyyy-MM-dd');
    var inquiry_dateEnd = Format(inquiry_nowDateString, 'yyyy-MM-dd');
    //渲染时间范围
    laydate.render({
        elem: '#inquiry_receive_date', //指定元素
        range: true,
        value: inquiry_dateStart +' - '+ inquiry_dateEnd
    });
    laydate.render({
        elem: '#inquiry_batchTimes',
        range: true,
        type: 'datetime'
    });
    //监听tab点击
    element.on('tab(inquiry-tabs)', function(data){
        if(data.index == 0) { //未处理
            $('#inquiry_disposeStatusType').val('0');
            $('[lay-filter="inquiry_submit"]').trigger('click');
        }else if(data.index == 1){ //已处理
            $('#inquiry_disposeStatusType').val('1');
            $('[lay-filter="inquiry_submit"]').trigger('click');
        }else if(data.index == 2){ //关闭
            $('#inquiry_disposeStatusType').val('4');
            $('[lay-filter="inquiry_submit"]').trigger('click');
        }else { //全部
            $('#inquiry_disposeStatusType').val('');
            $('[lay-filter="inquiry_submit"]').trigger('click');
        }
    });
    var formDom = $('#inquiry_searchForm')
    var userSelect = formDom.find('.sale_hp_custom')

    function getSalersPerson() {
        $.ajax({
            type: "post",
            url: ctx + "/sys/getPersonAndOrgsByRole.html",
            data: {"roleNames": 'ebay专员'},
            dataType: "json",
            success: function (returnData) {
                let userList = returnData.data.userList
                if (userList) {
                    for (var i = 0; i < userList.length; ++i) {
                        userSelect.append(getAOption(userList[i].id, userList[i].user_name))
                    }
                }
            },
            error: function() {
                layer.msg('发送请求失败')
            }
        })
    }
    function getAOption(value, text, sites, remark) {
        return $(
            '<option value="' +
            value +
            '" data-sites="' +
            (sites || '') +
            '" data-remark="' +
            (remark || '') +
            '">' +
            text +
            '</option>'
        )
    }
    //inquiry命名空间
    var inquiryName = {
        dataHandle: function(data){
            data.roleNames = 'ebay客服专员';
            data.platCode = 'ebay';
            data.type='customservicer';
            data.processStatus = $('#inquiry_disposeStatusType').val();
            if(data.times){
                var timeArr =data.times.split(' - ');
                data.startTime = timeArr[0];
                data.endTime = timeArr[1];
            }else{
                data.startTime = '';
                data.endTime='';
            };
            delete data.times;
            return data;
        },
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#inquiry_table',
                method: 'post',
                url:'/lms/ebay/inquiry/query.html',
                where: data,
                page: true,
                id: "inquiry_tableId",
                limits: [50, 100, 300],
                limit: 50,
                cols: [
                    [
                        {type: 'checkbox', width:32},
                        {title: '产品信息', templet: '#inquiry_info'},
                        {title: 'inquiryId',field: 'inquiryId', width: 140},
                        {title: '店铺/客服', templet: '<div><div style="text-align:left;"><strong>店铺:</strong><span>{{d.storeAcct}}</span><br><strong>客服:</strong><span>{{d.customServicer}}</span><br><strong>销售:</strong><span>{{d.salesperson}}</span></div></div>', width: 160},
                        {title: '买家账号', field: 'buyer', width: 120},
                        {title: '发起原因',field: 'creationReason', width: 180},
                        {title: '纠纷金额',templet: '#inquiry_money', width: 100},
                        {title: 'INR状态',field: 'inrStatus', width: 120},
                        {title: '时间',templet: '#inquiry_times', width: 200},
                        {title: '操作',toolbar: '#inquiry_tableIdBar', width:80}
                    ]
                ],
                done: function(res){
                    const inquiry_numbers = res.extra ? res.extra : {
                        needProcess: 0,
                        processed: 0,
                        closed: 0,
                        total: 0
                    };
                    $('#inquiry_not_handle_number').html(inquiry_numbers.needProcess);
                    $('#inquiry_already_handle_number').html(inquiry_numbers.processed);
                    $('#inquiry_already_close_number').html(inquiry_numbers.closed);
                    $('#inquiry_all_handle_number').html(inquiry_numbers.total);
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(inquiry_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'detail'){ //详情
                    // console.log('详情:', data);
                    _this.inquiryDetailHandle(data);
                }else if(obj.event == 'auto'){//同步
                    _this.autoData(data);
                }
            });
        },
        inquiryDetailHandle: function(data){
            var _this = this;
            _this.inquiryDetailAjax(data.id).then(function(result){
                // console.log(result);
                var index = layer.open({
                    type: 1,
                    title: 'inquiry详情',
                    area: ['1100px', '700px'],
                    btn: ['保存', '关闭'],
                    id: 'inquiryDetailLayeroId',
                    content: $('#inquiryDetailLayero').html(),
                    success: function(layero,index){
                        var getTpl = inquiry_detail_containerTpl.innerHTML,
                        view = document.getElementById('inquiry_detail_container');
                        laytpl(getTpl).render(result, function(html){
                            view.innerHTML = html;
                            var ckedStr = '';
                            if(result.msgInquiryEbay.delayReply){
                               ckedStr +='<div class="layui-form" style="position:absolute;bottom:16px;right:188px;"><input type="checkbox" title="延迟回复" name="delayReply" lay-skin="primary" checked></div>';                                  
                            }else{
                                ckedStr = '<div class="layui-form" style="position:absolute;bottom:16px;right:188px;"><input type="checkbox" title="延迟回复" name="delayReply" lay-skin="primary"></div>';
                            };
                            layero.find('.layui-layer-btn.layui-layer-btn-').append(ckedStr);
                            form.render();
                            _this.watchRadio();
                            laydate.render({
                                elem: '#inquiry_detail_shippingCreateDate',
                                type: 'datetime'
                            })
                            layero.find('[name=delayReply]').next().on('click', function(){
                                _this.delayReplayHandle(data, layero);
                            });
                        });
                    },
                    yes: function(index,layero){
                        // console.log(index);
                        var ajaxData = _this.inquiryDetailData(data,layero);
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: '/lms/ebay/inquiry/processEbayInquiry.html',
                            data: ajaxData,
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code == '0000'){
                                    layer.msg(res.msg || '处理成功!');
                                    layer.close(index);
                                    $('[lay-filter="inquiry_submit"]').trigger('click');
                                }else{
                                    layer.msg(res.msg || '处理失败!');
                                }
                            }
                        })
                    }
                });
            }).catch(function(reason){
                layer.msg(reason || '接口请求异常');
            })
        },
        //延迟回复
        delayReplayHandle:function(data, layero){
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/ebay/return/updateReturnDelayStatus.html',
                data: {
                    storeAcctId: data.storeAcctId,
                    delayReply: layero.find('[name=delayReply]').is(':checked')
                },
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code=='0000'){
                        layer.msg(res.msg || '修改延迟回复状态成功');
                    }else{
                        layer.msg(res.msg || '修改延迟回复状态失败');
                    }
                }
            });
        },
        //inquiry详情接口
        inquiryDetailAjax: function(id){
            return new Promise(function(resolve, reject){
             $.ajax({
                 type: 'get',
                 dataType: 'json',
                 url: '/lms/ebay/inquiry/detail.html?id='+id,
                 beforeSend: function(){
                     loading.show();
                 },
                 success: function(res){
                     loading.hide();
                     if(res.code == '0000'){
                         resolve(res.data || {});
                     }else{
                         reject(res.msg || '请求详情失败')
                     }
                 }
             });
            });
        },
        //监听处理选项
        watchRadio: function(){
            form.on('radio(inquiry_handle_filter)', function(obj){
                var val = obj.value;
                if(val == 'ISSUE_FULL_REFUND'){//全额退款
                    $('.inquiry_detail_money').removeClass('inquiry_detail_disN');
                    $('.inquiry_detail_reason').addClass('inquiry_detail_disN');
                    $('.inquiry_detail_transport').addClass('inquiry_detail_disN');
                }else if(val == 'ESCALATE'){ //升级到客服
                    $('.inquiry_detail_money').addClass('inquiry_detail_disN');
                    $('.inquiry_detail_reason').removeClass('inquiry_detail_disN');
                    $('.inquiry_detail_transport').addClass('inquiry_detail_disN');
                }else if(val == 'SEND_MESSAGE'){ //与买家沟通
                    $('.inquiry_detail_money').addClass('inquiry_detail_disN');
                    $('.inquiry_detail_reason').addClass('inquiry_detail_disN');
                    $('.inquiry_detail_transport').addClass('inquiry_detail_disN');
                }else {
                    $('.inquiry_detail_money').addClass('inquiry_detail_disN');
                    $('.inquiry_detail_reason').addClass('inquiry_detail_disN');
                    $('.inquiry_detail_transport').removeClass('inquiry_detail_disN');
                }
            });
        },
        //保存前的数据处理
        inquiryDetailData: function(data,layero){
            var val = $('.inquiry_detail_file').find("input[type='radio']:checked").val();
            var obj = {};
            obj.content = $('#inquiry_container_leave').text();
            obj.delayReply = layero.find('[name=delayReply]').is(':checked');
            obj.id = data.id;
            obj.inquiryId = data.inquiryId;
            obj.shippingCarrier = data.shippingCarrier;
            obj.shippingTrackingNo = data.shippingTrackingNo;
            obj.storeAcctId = data.storeAcctId;
            obj.shippingCreateDate = Format(data.shippingCreateDate, 'yyyy-MM-dd hh:mm:ss');
            if(val == 'ISSUE_FULL_REFUND'){//全额退款
               obj.action = 'ISSUE_FULL_REFUND';
               obj.currency = data.currency;
               obj.returnAmt = data.claimAmt;
            }else if(val == 'ESCALATE'){ //升级到客服
                obj.action = 'ESCALATE';
                obj.escalateType = $('#inquiry_escalateType').find("option:selected").text()     
            }else if(val == 'SEND_MESSAGE'){ //与买家沟通
                obj.action='SEND_MESSAGE'
            }else{
                obj.action = 'PROVIDE_SHIPPING_INFO';
                obj.shippingCreateDate = $('#inquiry_detail_shippingCreateDate').val();
                obj.shippingCarrier = $('#inquiry_detail_shippingCarrier').val();
                obj.shippingTrackingNo =$('#inquiry_detail_shippingTrackingNo').val();
            };
            return obj;
        },
        //单个同步
        autoData: function(data){
            $.ajax({
                type:'get',
                dataType:'json',
                url: '/lms/ebay/inquiry/singleSync.html?id='+data.id,
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        layer.msg(res.msg || '同步当前订单成功');
                        $('[lay-filter="inquiry_submit"]').trigger('click');
                    }else{
                        layer.msg(res.msg || '同步当前订单失败');
                    }
                }
            })
        },
        //批量同步
        bacthHandle: function(){
            var _this = this;
            $('#inquiry_batchHandle').on('click', function(){
                var data = {};
                data.roleNames = 'ebay客服专员';
                data.type="customservicer";
                data.platCode ="ebay";
                // data.platCode = 'ebay';
                var $form = $('#inquiry_searchForm');
                data.orgId = $form.find('select[name=orgId]').val();
                data.salePersonId = $form.find('select[name=salePersonId]').val();
                data.storeAcctId = $form.find('select[name=storeAcctId]').val();
                var aftermkTimes = $('#inquiry_batchTimes').val();
                if(aftermkTimes){
                    var timeArr =aftermkTimes.split(' - ');
                    data.syncStart = timeArr[0];
                    data.syncEnd = timeArr[1];
                }else{
                    data.syncStart = '';
                    data.syncEnd = '';
                };
                var dateNow = Date.now();
                _this.startSynchro(data, dateNow).then(function(result){
                    if(result == '批量同步成功'){
                        layer.msg('同步中,请稍后...', {time: 5000});
                        setTimeout(function(){
                            $.ajax({
                                type: 'get',
                                dataType: 'json',
                                url: '/lms/ebay/return/getSyncMsg.html?randomKey='+dateNow,
                                beforeSend: function(){
                                    loading.show();
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        layer.msg(res.msg || 'inquiry同步任务已成功!');
                                        $('[lay-filter="inquiry_submit"]').trigger('click');
                                    }else{
                                        layer.msg(res.msg || 'inquiry同步任务失败!');
                                    }
                                }
                            })

                            }, 6000);                      
                    }
                }).catch(function(reason){
                    layer.msg(reason);
                });
            });

            $('#inquiry_batchExportHandle').on('click', function(){
                let paramData = table.checkStatus('inquiry_tableId').data
                if (paramData.length > 0) {
                    let idList = paramData.map(item => item.id)
                    submitForm({"idList": idList }, ctx + '/ebay/inquiry/exportSelected');
                }
                else {
                    layui.layer.msg("请选择导出范围!");
                }
            });
        },
        //开始同步
        startSynchro: function(data,dateNow){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/inquiry/batchSync.html?randomKey='+dateNow,
                    data: data,
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code == '0000'){
                            resolve('批量同步成功');
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
        }
    };
    //表单搜索事件
    form.on('submit(inquiry_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var dataObj =inquiryName.dataHandle(data);
        inquiryName.tableRender(dataObj);
        // console.log(dataObj);
    });
    //批量同步
    inquiryName.bacthHandle();
    //默认查询两个月
    $('[lay-filter="inquiry_submit"]').trigger('click');
});