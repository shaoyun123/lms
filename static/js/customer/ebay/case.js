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
    render_hp_orgs_users("#case_searchForm");
    //表头固定
    UnifiedFixedFn('caseCard');
    //时间处理(默认2个月)
    var case_nowDateString = new Date().getTime();
    var case_dateFiftweenSting = case_nowDateString - 60*24*60*60*1000;
    var case_dateStart = Format(case_dateFiftweenSting, 'yyyy-MM-dd');
    var case_dateEnd = Format(case_nowDateString, 'yyyy-MM-dd');
    //渲染时间范围
    laydate.render({
        elem: '#case_receive_date', //指定元素
        range: true,
        value: case_dateStart +' - '+ case_dateEnd
    });
    laydate.render({
        elem: '#case_batchTimes',
        range: true,
        type: 'datetime'
    });
    getSalersPerson()
    //监听tab点击
    element.on('tab(case-tabs)', function(data){
        if(data.index == 0) { //未处理
            $('#case_disposeStatusType').val('0');
            $('[lay-filter="case_submit"]').trigger('click');
        }else if(data.index == 1){ //已处理
            $('#case_disposeStatusType').val('1');
            $('[lay-filter="case_submit"]').trigger('click');
        }else if(data.index == 2){ //关闭
            $('#case_disposeStatusType').val('4');
            $('[lay-filter="case_submit"]').trigger('click');
        }else { //全部
            $('#case_disposeStatusType').val('');
            $('[lay-filter="case_submit"]').trigger('click');
        }
    });

    var formDom = $('#case_searchForm')
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
    //case命名空间
    var caseName = {
        dataHandle: function(data){
            data.roleNames = 'ebay客服专员';
            data.platCode = 'ebay';
            data.type='customservicer';
            data.disposeStatus = $('#case_disposeStatusType').val();
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
                elem: '#case_table',
                method: 'post',
                url:'/lms/ebay/cases/query.html',
                where: data,
                page: true,
                id: "case_tableId",
                limits: [50, 100, 300],
                limit: 50,
                cols: [
                    [
                        {type: 'checkbox', width:32},
                        {title: '产品信息', templet: '#case_info'},
                        {title: '纠纷编号',field: 'caseId', width: 140},
                        {title: '店铺/客服/销售', templet: '<div><div style="text-align:left;"><strong>店铺:</strong><span>{{d.storeAcct}}</span><br><strong>客服:</strong><span>{{d.customServicer}}</span><br><strong>销售:</strong><span>{{d.salesperson}}</span></div></div>', width: 160},
                        {title: '买家账号', field: 'buyer', width: 140},
                        {title: '纠纷类型',field: 'caseType', width: 180},
                        {title: '纠纷金额',templet: '#case_money', width: 100},
                        {title: '状态',templet: `<div>
                            <div style="text-align:left;">
                                <span><strong>纠纷状态:</strong>{{d.caseStatus}}</span><br>
                                {{# if(d.needAutoRefund ==1){ }}
                                <span><strong>pp状态:</strong>{{d.autoRefundResponse}}</span>
                                {{# } }}
                            </div>
                        </div>`, 
                        width: 200},
                        {title: '时间',templet: '#case_times', width: 200},
                        {title: '操作',toolbar: '#case_tableIdBar', width:80}
                    ]
                ],
                done: function(res){
                    // console.log(res);
                    const case_numbers = res.extra ? res.extra : {
                        needProcess: 0,
                        processed: 0,
                        closed: 0,
                        total: 0
                    };
                    $('#case_not_handle_number').html(case_numbers.needProcess);
                    $('#case_already_handle_number').html(case_numbers.processed);
                    $('#case_already_close_number').html(case_numbers.closed);
                    $('#case_all_handle_number').html(case_numbers.total);
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(case_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'detail'){ //详情
                    _this.caseDetailHandle(data);
                }else if(obj.event == 'auto'){//同步
                    _this.autoData(data);
                }
            });
        },
        //case详情处理
        caseDetailHandle: function(data){
            var _this = this;
            _this.caseDetailAjax(data.id).then(function(result){
                var index = layer.open({
                    type: 1,
                    title: 'case详情',
                    area: ['1100px', '700px'],
                    btn: ['保存', '关闭'],
                    id: 'caseDetailLayeroId',
                    content: $('#caseDetailLayero').html(),
                    success: function(layero,index){
                        var getTpl = case_detail_containerTpl.innerHTML,
                        view = document.getElementById('case_detail_container');
                        laytpl(getTpl).render(result, function(html){
                            view.innerHTML = html;
                            form.render();
                            _this.watchRadio();
                        });
                    },
                    yes: function(index,layero){
                        // console.log(index);
                        var ajaxData = _this.caseDetailData(data);
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: '/lms/ebay/cases/processEbayCase.html',
                            data: ajaxData,
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code == '0000'){
                                    layer.msg(res.msg || '处理成功!');
                                    layer.close(index);
                                    $('[lay-filter="case_submit"]').trigger('click');
                                }else{
                                    layer.msg(res.msg || '处理失败!');
                                }
                            }
                        })
                    }
                })
            }).catch(function(reason){
                layer.msg(reason || '接口请求异常');
            })
        },
        //监听处理选项
        watchRadio: function(){
            form.on('radio(case_handle_filter)', function(obj){
                var val = obj.value;
                if(val == 'issueFullRefund'){//全额退款
                    $('.case_detail_money').removeClass('case_detail_disN');
                    $('.case_detail_addressInfo').addClass('case_detail_disN');
                    $('.case_container_leave').removeClass('case_detail_disN');
                }else if(val == 'appeal'){ //上诉
                    $('.case_detail_money').addClass('case_detail_disN');
                    $('.case_detail_addressInfo').addClass('case_detail_disN');
                    $('.case_container_leave').removeClass('case_detail_disN');
                }else if(val == 'provide_return_address'){ //提供退货地址
                    $('.case_detail_money').addClass('case_detail_disN');
                    $('.case_detail_addressInfo').removeClass('case_detail_disN');
                    $('.case_container_leave').addClass('case_detail_disN');
                }
            });
        },
        //case详情保存处理
        caseDetailData: function(data){
            var val = $('.case_detail_file').find("input[type='radio']:checked").val();
            var obj = {};
            var leaveInfo = $('#case_container_leave').text();//留言
            obj.id = data.id;
            obj.storeAcctId = data.storeAcctId;
            obj.caseId = data.caseId;
            //根据val的值决定传入什么参数
            if(val=='issueFullRefund'){ //全额退款
                obj.action = 'issueFullRefund';
                obj.currency = data.currency;
                obj.returnAmt = data.claimAmt;
                obj.content = leaveInfo;
                obj.ebayOrderId = data.ebayOrderId;
            }else if(val=='appeal'){ //上诉
                obj.action='appeal';
                obj.content = leaveInfo;
            }else if(val=='provide_return_address'){ //提供退货地址
                obj.action = 'provide_return_address';
                obj.addressType = $('#case_addressType').find("option:selected").text();
                obj.firstName = $('#case_detail_name').val().split(' ')[0] || '';
                obj.lastName = $('#case_detail_name').val().split(' ')[1] || '';
                obj.country = $('#case_detail_country').val() || '';
                obj.stateOrProvince = $('#case_detail_province').val() || '';
                obj.city =$('#case_detail_city').val() || '';
                obj.county = $('#case_detail_county').val() || '';
                obj.addressLine1 = $('#case_detail_street1').val() || '';
                obj.addressLine2 = $('#case_detail_street2').val() || '';
                obj.postalCode = $('#case_detail_code').val() || '';
            };

            return obj;
        },
        //case详情接口
        caseDetailAjax: function(id){
           return new Promise(function(resolve, reject){
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/ebay/cases/detail.html?id='+id,
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
        //单个同步
        autoData: function(data){
            $.ajax({
                type:'get',
                dataType:'json',
                url: '/lms/ebay/cases/syncSingleEbayCase.html?id='+data.id,
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        layer.msg(res.msg || '同步当前订单成功');
                        $('[lay-filter="case_submit"]').trigger('click');
                    }else{
                        layer.msg(res.msg || '同步当前订单失败');
                    }
                }
            })
        },
        //批量同步
        bacthHandle: function(){
            var _this = this;
            $('#case_batchHandle').on('click', function(){
                var data = {};
                data.roleNames = 'ebay客服专员';
                // data.platCode = 'ebay';
                var $form = $('#case_searchForm');
                data.orgId = $form.find('select[name=orgId]').val();
                data.salePersonId = $form.find('select[name=salePersonId]').val();
                data.storeAcctId = $form.find('select[name=storeAcctId]').val();
                var aftermkTimes = $('#case_batchTimes').val();
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
                                        layer.msg(res.msg || 'case同步任务已成功!');
                                        $('[lay-filter="case_submit"]').trigger('click');
                                    }else{
                                        layer.msg(res.msg || 'case同步任务失败!');
                                    }
                                }
                            })

                            }, 6000);                      
                    }
                }).catch(function(reason){
                    layer.msg(reason);
                });
            });
        },
        // 开始同步
        startSynchro: function(data,dateNow){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/cases/syncEbayCase.html?randomKey='+dateNow,
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
        },
        //查询白名单
        searchWhiteListAjax: function(){
            var _this = this;
            $('#case_whiteList').on('click', function(){
                layer.open({
                    type: 1,
                    title: '自动退款白名单',
                    area: ['1100px', '700px'],
                    id: 'case_whiteList_layerId',
                    // shadeClose: true,
                    content: $('#case_whiteList_layer').html(),
                    success: function(layero,index){
                        // console.log(index)
                        _this.whiteListTableRender();
                        _this.deleteWhiteList();
                        _this.addWhiteList();
                        _this.searchWhiteList();
                    }
                })
            });
        },
        //白名单搜索
        searchWhiteList: function(){
            var _this = this;
            $('#whiteListSearch').on('click', function(){
                var $val = $('#whiteListInputSearch').val();
                _this.whiteListTableRender({'ebayOrderId': $val});
            });
        },
        //白名单表格渲染
        whiteListTableRender: function(data){
            if(!data){
                data = {}
            }
            var _this = this;
            table.render({
                elem: '#case_whiteList_layerTable',
                method: 'post',
                url:'/lms/ebay/cases/queryWhitelist.html',
                page: true,
                where: data,
                id: "case_whiteList_layerTableId",
                limits: [50, 100, 300],
                limit: 50,
                cols: [
                    [
                        {type: 'checkbox', width:32},
                        {title: 'ebay订单号', field: 'ebayOrderId'},
                        {title: '添加人',field: 'creator', width: 140},
                        {title: '添加时间', templet: "<div>{{Format(d.createTime, 'yyyy-MM-dd hh:mm:ss')}}</div>", width: 160},
                        {title: '操作',toolbar: '#whiteList_tableIdBar', width:80}
                    ]
                ],
                done: function(){
                    table.on('tool(case_whiteList_layerTable)',function(obj){
                        var data = obj.data;
                        if(obj.event == 'delete'){ //详情
                            _this.deleteWhiteListAjax(data.ebayOrderId);
                        }
                    });
                }
            });
        },
        //删除白名单
        deleteWhiteList: function(){
            var _this = this;
            //批量删除
            $('#whiteListBatch').on('click', function(){
                var checkStatus = table.checkStatus('case_whiteList_layerTableId')
                , data = checkStatus.data;
                if(!data.length){
                    return layer.msg('请先选择数据');
                }
                var idArr = data.map(function(item){
                    return item.ebayOrderId;
                });
                layer.confirm('确定删除选中的ebay订单吗?',function(){
                    _this.deleteWhiteListAjax(idArr.join(','));
                });
            });
                    
        },
        //新增白名单
        addWhiteList: function(){
            var _this = this;
            //新增
            $('#whiteListAdd').on('click', function(){
                var $val = $('#whiteListInput').val();
                if(!$val){
                    return layer.msg('不能新增空值!');
                }
                _this.addWhiteListAjax($val);
            });
        },
        //删除白名单接口
        deleteWhiteListAjax: function(id){
            var _this = this;
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/ebay/cases/removeWhitelist.html?ebayOrderId='+id,
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        layer.msg(res.msg || '删除成功!');
                        _this.whiteListTableRender();
                    }else{
                        layer.msg(res.msg || '删除失败');
                    }
                }
            });
        },
        //新增白名单接口
        addWhiteListAjax: function(id){
            var _this = this;
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/ebay/cases/addWhitelist.html?ebayOrderId='+id,
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        layer.msg(res.msg || '新增成功!');
                        _this.whiteListTableRender();
                        $('#whiteListInput').val('');
                    }else{
                        layer.msg(res.msg || '新增失败');
                    }
                }
            })
        }
    };

    //表单搜索事件
    form.on('submit(case_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var dataObj =caseName.dataHandle(data);
        caseName.tableRender(dataObj);
        // console.log(dataObj);
    });
    //批量同步
    caseName.bacthHandle();
    //白名单
    caseName.searchWhiteListAjax();
    //默认查询2个月数据
    $('[lay-filter="case_submit"]').trigger('click');
});