layui.use(['admin','table','form','element','layer','laydate','laytpl'],function(){
    var admin = layui.admin,
        table = layui.table,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        form = layui.form;
    //初始化部门-用户-店铺
    render_hp_orgs_users("#feedback_searchForm");
    //渲染时间范围
    laydate.render({
        elem: '#feedback_times', //指定元素
        range: true
    });
    //监听tabs点击事件
    element.on('tab(feedback-tabs)', function(data){
        if(data.index == 0) { //待评价
            $('#feedback_pageType').val('1');
            $('[lay-filter="feedback_submit"]').trigger('click');
        }else if(data.index == 1){ //已评价
            $('#feedback_pageType').val('2');
            $('[lay-filter="feedback_submit"]').trigger('click');
        }else if(data.index == 2) { //全部
            $('#feedback_pageType').val('3');
            $('[lay-filter="feedback_submit"]').trigger('click');
        }else{ //回复失败
            $('#feedback_pageType').val('4');
            $('[lay-filter="feedback_submit"]').trigger('click');
        }
    });
    //留评命名空间
    var feedbackName = {
        dataHandle: function(data){ //数据处理
            data.roleName = 'ebay客服';
            data.platCode = 'ebay';
            data.personType ='customservicer';
            data.type=$('#feedback_pageType').val();
            if(data.times){
                var timeArr =data.times.split(' - ');
                data.orderTimeStart = timeArr[0];
                data.orderTimeEnd = timeArr[1];
            }else{
                data.orderTimeStart = '';
                data.orderTimeEnd='';
            }
            if(data.searchType == 'itemId'){
                data.itemId = data.searchTypeVal;
                data.itemTitle = '';
                data.prodPSku = '';
                data.prodSSku = '';
            }else if(data.searchType == 'itemTitle'){
                data.itemId = '';
                data.itemTitle = data.searchTypeVal;
                data.prodPSku = '';
                data.prodSSku = '';
            }else if(data.searchType == 'prodPSku'){
                data.itemId = '';
                data.itemTitle = '';
                data.prodPSku = data.searchTypeVal;
                data.prodSSku = '';
            }else if(data.searchType == 'prodSSku'){
                data.itemId = '';
                data.itemTitle = '';
                data.prodPSku = '';
                data.prodSSku = data.searchTypeVal;
            }
            delete data.times;
            delete data.searchType;
            delete data.searchTypeVal;
            return data;
        },
        tableRender: function(data){ //表格渲染
            var $val =$('#feedback_pageType').val();
            var cols;
            if($val == 4){
               cols =  [
                    [
                        // {type: 'checkbox', width:32},
                        {title: '店铺/客服',templet:'#feedback_table_person', width: 150},
                        {title: '产品信息', templet: '#feedback_table_itemTitle'},
                        {title:'订单信息',templet:'#feedback_table_orderInfo', width: 195},
                        {title: '买家账号', templet: '#feedback_table_account', width: 128},
                        {title: '买家评价', templet: '#feedback_commentText'},
                        {title: '卖家评价', field: 'feedbackResponseSeller'},
                        {title: '失败原因', field: 'replyFailMessage'},
                        {title: '操作',toolbar: '#feedback_tableIdBar', width: 80}
                    ]
                ];
            }else{
                cols =  [
                    [
                        // {type: 'checkbox', width:32},
                        {title: '店铺/客服',templet:'#feedback_table_person', width: 150},
                        {title: '产品信息', templet: '#feedback_table_itemTitle'},
                        {title:'订单信息',templet:'#feedback_table_orderInfo', width: 195},
                        {title: '买家账号', templet: '#feedback_table_account', width: 128},
                        {title: '买家评价', templet: '#feedback_commentText'},
                        {title: '卖家评价', field: 'feedbackResponseSeller'},
                        {title: '操作',toolbar: '#feedback_tableIdBar', width: 80}
                    ]
                ];
            }

            var _this = this;
            table.render({
                elem: '#feedback_table',
                method: 'post',
                url: '/lms/msgFeedbackEbay/list.html',
                where:  data,
                page: true,
                id: "feedback_tableId",
                limits: [50, 100, 300],
                limit: 50,
                cols:cols,
                done: function(res, curr, count){
                    const feedback_numbers = res.extra;
                    $('#wait_evaluate_number').html(feedback_numbers.waitEvaluateCount);
                    $('#already_evaluate_number').html(feedback_numbers.alreadyEvaluateCount);
                    $('#all_evaluate_number').html(feedback_numbers.totalCount);
                    $('#fail_evaluate_number').html(feedback_numbers.replyFailCount);
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(feedback_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'evaluate'){ //留评
                    _this.evaluateDialog('回复买家',data);
                 }
            });
        },
        evaluateDialog: function(title,data){ //留评弹框
            var _this = this;
            var dataArr = [];
            if(Object.prototype.toString.call(data) == '[object Object]'){
                dataArr.push(data);
            }else{
                dataArr = data;
            }
           var index = layer.open({
               type: 1,
               title: title,
               showClose: false,
               area: ['1100px', '800px'],
               btn: ['提交', '关闭'],
               id: 'feedback_dialogLayeriD',
               content: $('#feedback_dialogLayer').html(),
               success:  function(layero,index){
                    var dataObj = {};
                    dataObj.dataArr = dataArr;
                    //渲染邮件类型和名称
                    Promise.all([_this.getEmailType(),_this.getEmailName()]).then(function(result){
                        dataObj.emailType = result[0];
                        dataObj.nameType = result[1];
                        var getTpl = feedback_commentDialog_tableTpl.innerHTML,
                        view = document.getElementById('feedback_commentDialog_tableContainer');
                        laytpl(getTpl).render(dataObj, function(html){
                            view.innerHTML = html;
                            form.render();
                           //点击应用
                            $('#feedback_commentDialog_config').on('click', function(){
                                // console.log('应用点击')
                                var $val = layero.find('select[name=feedback_commentDialog_middle_name]').val();
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
                                            var $trs = layero.find('#feedback_commentDialog_table_tbody>tr');
                                            for(var i=0; i<$trs.length; i++){
                                                var item = $trs[i];
                                                $(item).find('td.comment_textarea>textarea').val(response.data);
                                            };
                                        }
                                    }
                                })
                            });
                            //监听移除
                            $('#feedback_commentDialog_table_tbody').on('click','.commentDialog_table_tbody_remove', function(){
                                    $(this).parents('tr').remove();
                            });

                            //联动
                            var targetSel = layero.find('select[name=feedback_commentDialog_middle_name]');
                            form.on('select(feedback_commentDialog_middle_type)', function(data){
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
                            //延迟操作
                            layero.find('[name=delayReply]').next().on('click', function(){
                                _this.delayHandle(data, layero);
                            });
                        });
                    });
               },
               yes: function(index, layero){
                    var $trs = layero.find('#feedback_commentDialog_table_tbody>tr');
                    var delayReply = layero.find('[name=delayReply]').is(':checked') ? 1: 0;
                    var platAcctId = data.platAcctId;
                    var commentsArr = [];
                    for(var i=0; i<$trs.length; i++){
                        var item = $trs[i];
                        var id = $(item).find('td:first-child>input').val();
                        // var feedbackResponse = $(item).find('td.comment_textarea>textarea').val();
                        var responseText = $(item).find('td.comment_textarea>textarea').val();
                        // commentsArr.push({id, feedbackResponse});
                        commentsArr.push({id, responseText, delayReply, platAcctId});
                    };
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify(commentsArr[0]),
                        contentType: 'application/json',
                        // url: '/lms/msgFeedbackEbay/leaveFeedback.html',
                        url:'/lms/msgFeedbackEbay/feedbackReply.html',
                        beforeSend: function(){
                            loading.show();
                        },
                        success: function(res){
                            loading.hide();
                            if(res.code == '0000'){
                                if(delayReply ==1){
                                    layer.msg('已参与到延时回复,请稍后查看回复结果!');
                                }else{
                                    layer.msg('留评成功');
                                }
                                
                                layer.close(index);
                                $('[lay-filter="feedback_submit"]').trigger('click');
                            }else{
                                layer.msg(res.msg);
                            }
                        },
                        error: function(){
                            loading.hide();
                            layer.msg('服务器错误,未请求到数据');
                        }
                    })

               }
           }) 
        },
        getEmailType: function(){ //获取邮件类型
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
        getEmailName: function(templateTypeName){ //获取邮件名称
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
        // 延迟回复点击事件
        delayHandle: function(data, layero){
            var delayReply = layero.find('[name=delayReply]').is(':checked');
            $.ajax({
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                url: '/lms/msgFeedbackEbay/updateFeedBackDelayStatus.html',
                data: JSON.stringify({
                    platAcctId: data.platAcctId,
                    delayReply: delayReply
                }),
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code == '0000'){
                        layer.msg(res.msg|| '修改延时状态成功!');
                    }else{
                        layer.msg(res.msg || '修改延时状态失败!');
                    }
                }
            });
        }

    };

    //表单搜索事件
    form.on('submit(feedback_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var dataObj =feedbackName.dataHandle(data);
        feedbackName.tableRender(dataObj);
    });
    //批量留评
    // $('#feedback_batchHandle').on('click', function(){
    //     var checkStatus = table.checkStatus('feedback_tableId'),
    //     data = checkStatus.data;
    //     if(!data.length){
    //         return layer.msg('请先选择数据!');
    //     }
    //     feedbackName.evaluateDialog('批量留评',data);
    // });
    //表头固定
    UnifiedFixedFn('feedbackContentCard');
})