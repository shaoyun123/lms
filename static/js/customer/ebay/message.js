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
    render_hp_orgs_users("#message_searchForm");
    //获取到当前时间
    var nowDateString = new Date().getTime();
    var dateFiftweenSting = nowDateString - 15*24*60*60*1000;
    var dateStart = Format(dateFiftweenSting, 'yyyy-MM-dd');
    var dateEnd = Format(nowDateString, 'yyyy-MM-dd');
    //渲染时间范围
    laydate.render({
        elem: '#message_receive_date', //指定元素
        range: true,
        value: dateStart +' - '+ dateEnd
    });

    element.on('tab(message-tabs)', function(data){
        if(data.index == 0) { //未读
            $('#message_pageType').val('0');
            $('[lay-filter="message_submit"]').trigger('click');
            $('.markAlreadyRead').removeClass('disN');
            $('.markNotRead').addClass('disN');
        }else if(data.index == 1){ //已读
            $('#message_pageType').val('1');
            $('[lay-filter="message_submit"]').trigger('click');
            $('.markAlreadyRead').addClass('disN');
            $('.markNotRead').removeClass('disN');
        }else { //全部
            $('#message_pageType').val('');
            $('[lay-filter="message_submit"]').trigger('click');
            $('.markAlreadyRead').removeClass('disN');
            $('.markNotRead').removeClass('disN');
        }
    });
    //命名空间
    var messageName = {
        dataHandle: function(data){
            data.roleNames = 'ebay客服';
            data.platCode = 'ebay';
            data.personType ='customservicer';
            data.timeType = 'receive_date';
            data.isRead = $('#message_pageType').val();
            if(data.times){
                var timeArr =data.times.split(' - ');
                data.startTime = timeArr[0];
                data.endTime = timeArr[1];
            }else{
                data.startTime = '';
                data.endTime='';
            };
            if(data.messageType == 'sender'){
                data.sender = data.messageTypeVal;
                data.subject = '';
                data.itemId = '';
            }else if(data.messageType == 'subject'){
                data.sender = '';
                data.subject = data.messageTypeVal;
                data.itemId = '';
            }else if(data.messageType == 'itemId'){
                data.sender = '';
                data.subject = '';
                data.itemId = data.messageTypeVal;
            }
            delete data.times;
            delete data.messageType;
            delete data.messageTypeVal;
            return data;
        },
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#message_table',
                method: 'post',
                url:'/lms/ebayMessage/mymsgEbay.html',
                where: data,
                page: true,
                id: "message_tableId",
                limits: [50, 100, 300],
                limit: 50,
                cols: [
                    [
                        {type: 'checkbox', width:32},
                        {title: '店铺', field: 'storeName', width: 72},
                        {title: '图片', templet: '#message_image', width: 72},
                        {title: '物品号',field: 'itemId', width: 100, templet: '#ebay_message_title_tpl'},
                        {title: '颜色', templet: '#message_flagColor', width: 60},
                        {title: '消息主题', templet: '#message_subject'},
                        {title: '发件人', field: 'sender', width: 100},
                        {title: '收件人', field: 'sendToName', width: 100},
                        {title: '客服', field: 'customServicer', width: 100},
                        {title: '日期', field:'receiveDate',templet: '<div>{{Format(d.receiveDate, "yyyy-MM-dd hh:mm:ss")}}</div>', width: 150},
                        {title: '操作',toolbar: '#message_tableIdBar', width: 120}
                    ]
                ],
                done: function(res){
                    // console.log(res);
                    const message_numbers = res.extra;
                    $('#not_read_number').html(message_numbers.unRead);
                    $('#already_read_number').html(message_numbers.readed);
                    $('#all_read_number').html(message_numbers.noMatterReaded);
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(message_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'markReaded'){ //标记已读
                    _this.markHandle('确定标记已读吗?',[{
                        ebayMsgId: data.ebayMsgId,
                        folderId: data.folderId,
                        id: data.id,
                        isRead: true,
                        platAcctId: data.platAcctId
                    }]);
                }else if(obj.event == 'markUnread'){//标记未读
                    _this.markHandle('确定标记未读吗?',[{
                        ebayMsgId: data.ebayMsgId,
                        folderId: data.folderId,
                        id: data.id,
                        isRead: false,
                        platAcctId: data.platAcctId
                    }]);
                }else if(obj.event == 'response' || obj.event == 'detail'){ //回复
                    // if(!data.isRead){
                    //     _this.markReaded(data);
                    // }
                }else if(obj.event == 'logs'){//日志
                    _this.getLogsData(data.id).then(function(result){
                        layer.open({
                            type: 1,
                            title:'日志',
                            btn: ['保存', '关闭'],
                            area: ['1100px', '600px'],
                            id: 'message_logsLayerId',
                            content: $('#message_logsLayer').html(),
                            success: function(){
                                var getTpl = message_logsLayer_containerTpl.innerHTML,
                                    view = document.getElementById('message_logsLayer_container');
                                laytpl(getTpl).render(result, function(html){
                                    view.innerHTML = html;
                                });
                            }
                        })
                    }).catch(function(reason){
                        layer.msg(reason);
                    })
                }
            });
        },
        //请求日志接口
        getLogsData: function(id){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebayMessage/getMsgOperLogs.html?id='+id,
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
            })
        },
        markHandle: function(txt,data){ //标记已读未读
            layer.confirm(txt, function(index){
                data.forEach(function(item){
                    item.storeAcctId = item.platAcctId;
                })
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    url: '/lms/ebayMessage/updateRead.html',
                    data: JSON.stringify(data),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        layer.close(index);
                        if(res.code=='0000'){
                            layer.msg(res.msg);
                            $('[lay-filter="message_submit"]').trigger('click');
                        }
                    }
                })
            });
        },
        //批量或者打开以后标记已读
        markReaded: function(item){
            var data = [{
                ebayMsgId: item.ebayMsgId,
                folderId: item.folderId,
                id: item.id,
                isRead: true,
                storeAcctId: item.platAcctId
            }];
            $.ajax({
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                url: '/lms/ebayMessage/updateRead.html',
                data: JSON.stringify(data),
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    if(res.code=='0000'){
                        layer.msg(res.msg);
                        $('[lay-filter="message_submit"]').trigger('click');
                    }
                }
            });
        },
        responseHandle: function(data){ //处理回复
            var _this = this;
            var index = layer.open({
                type: 1,
                title: '回复买家',
                showClose: false,
                area: ['1100px', '800px'],
                btn: ['关闭'],
                content: $('#message_responseLayer').html(),
                success: function(layero, index){
                    _this.getResponseData(data.id).then(function(getData){
                        // console.log(getData[0]);
                        var getTpl = response_containerTpl.innerHTML,
                            view = document.getElementById('response_container');
                        laytpl(getTpl).render(getData[0], function(html){
                            view.innerHTML = html;
                            _this.uploadImg();
                            _this.sendClickHandle();
                            _this.insertModelHandle();
                            $('body').on('click', function(e){
                                if(!$(e.target).closest("#message_insert_model").length){
                                    $('#message_insert_model').find('ul').addClass('disN');
                                };
                            })
                        });
                    })
                }
            })
        },
        getResponseData: function(idStr){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebayMessage/getMsgListByIds.html?idArr='+idStr,
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
        changeColor: function(id, num){//旗帜颜色更改
            $('#'+id).on('click', function(){
                var checkStatus = table.checkStatus('message_tableId'),
                    data = checkStatus.data;
                // console.log(data);
                if(!data.length){
                    return layer.msg('请选择一条数据!');
                };
                var idArr= data.map(function(item){
                    return {
                        id: item.id,
                        flagColor: num
                    };
                });
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    url: '/lms/ebayMessage/updateFlagColor.html',
                    data: JSON.stringify(idArr),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code=='0000'){
                            layer.msg(res.msg);
                            $('[lay-filter="message_submit"]').trigger('click');
                        }
                    }
                });
            });
        },
        markStatusHandle: function(cls,status,txt){
            var _this = this;
            $('.'+cls).on('click', function(){
                var checkStatus = table.checkStatus('message_tableId'),
                    data = checkStatus.data;
                // console.log(data);
                if(!data.length){
                    return layer.msg('请选择一条数据!');
                };
                var dataArr = data.map(function(item){
                    return {
                        ebayMsgId: item.ebayMsgId,
                        folderId: item.folderId,
                        id: item.id,
                        isRead: status,
                        platAcctId: item.platAcctId
                    };
                });
                _this.markHandle(txt,dataArr);
            })
        },
        uploadImg: function(){
            upload.render({
                elem: '#message_img_upload',
                url: ctx + "/ebayMessage/uploadImg.html",
                accept: 'images',
                multiple: true,
                done: function(res) {
                    if(res.code == '0000'){
                        var ImgElement = `<img  class="img_show_hide imgCss imgBorder" width="60" height="60" src="${res.data. imgName}" onerror="layui.admin.img_noFind()" data-imgId="${res.data.imgId}" data-imgName="${res.data.fileName}">`;
                        $('#repsonse_left_msg_title_return').append(ImgElement);
                    }
                }
            });
        },
        insertModelHandle: function(){ //插入模板
            var _this = this;
            $('#message_insert_model_btn').on('click', function(e){
                _this.getEmailName().then(function(result){
                    var $ul =$('<ul class="message_model_ul">');
                    var liStr = '';
                    for(var i=0; i<result.length; i++){
                        var liItem = result[i];
                        liStr += `<li data-id="${liItem.id}">${liItem.name}</li>`;
                    };
                    $ul.append(liStr);
                    if($('#message_insert_model').find('ul').length == 0){
                        $('#message_insert_model').append($ul);
                    }else{
                        $('#message_insert_model').find('ul').removeClass('disN');
                    };
                    $('#message_insert_model').find('ul').on('click', 'li', function(){
                        var liId = $(this).attr('data-id');
                        $.ajax({
                            type: 'post',
                            dataType: 'json',
                            url: '/lms/emailTemplate/queryTemplateInfoById.html',
                            data: {id: liId},
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(response){
                                loading.hide();
                                if(response.code=='0000'){
                                    $('#repsonse_left_msg_title_return').find('span').remove();
                                    $('#repsonse_left_msg_title_return').append(`<span>${response.data}</span>`);
                                }
                            }
                        })
                    })
                });
            });
        },
        getEmailName: function(templateTypeName){ //获取模板的ajax请求
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
        sendClickHandle: function(){ //发送的点击事件
            $('#respose_left_btn_upload').on('click', function(){
                var backImgs = $('#repsonse_left_msg_title_return').find('img');
                var backTxt = $('#repsonse_left_msg_title_return').text();
                var backImgsArr = [];
                if(backImgs.length){
                    for(var i=0; i< backImgs.length; i++){
                        var backItem = backImgs[i];
                        backImgsArr.push({
                            id: $(backItem).attr('data-imgId'),
                            imgName: $(backItem).attr('data-imgName'),
                            status: true
                        });
                    };
                };
                var $buyer=$('.repsonse_left_msg_content').find('.repsonse_left_msg_content_buyer');
                var buyId = $($buyer[$buyer.length -1]).find('input[type=hidden]').val();
                var buySender = $($buyer[$buyer.length -1]).find('.repsonse_left_msg_content_buyer_sender').text();
                console.log(buySender, buyId);
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json;charset=UTF-8',
                    url: '/lms/ebayMessage/replyMsg.html',
                    data: JSON.stringify({
                        id: buyId,
                        msgImgs: backImgsArr,
                        recipient: buySender,
                        replyBody: backTxt
                    }),
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        //这里需要渲染到页面
                        if(res.code == '0000'){
                            if($('#repsonse_left_msg_title_return').text().length){
                                var nowTime = Format(Date.now(), 'yyyy-MM-dd hh:mm:ss');
                                var nowName = $('#respose_left_msg_storename').text();
                                var nowHtml = $('#repsonse_left_msg_title_return').html();
                                var nowStr = `
                                    <div class="repsonse_left_msg_content_seller">
                                        <div>
                                            <span style="color: #5b8ac0;font-weight: 700;font-size: 14px;">
                                            ${nowName}
                                            </span>
                                            <span style="color: #b1b1b3;font-size: 12px;margin-left: 10px;">
                                            ${nowTime}
                                        </span>
                                        </div>
                                        <div class="repsonse_left_msg_content_seller_content">
                                        ${nowHtml}
                                        </div>
                                    </div>
                                `;
                                $('.repsonse_left_msg_content').append(nowStr);
                            }else{
                                layer.msg('回复的内容不能为空');
                            }
                        }else {
                            layer.msg(res.msg|| '回复失败');
                        }
                    }

                })
            })

        },
        //批量打开页面
        batchHandle: function(){
            var _this =this;
            $('#message_batchHandle').on('click', function(){
                var checkStatus = table.checkStatus('message_tableId'),
                    data = checkStatus.data;
                if(!data.length){
                    return layer.msg('请先选择数据!');
                }
                for(var i=0; i<data.length; i++){
                    var item =data[i];
                    if(item.sender == 'eBay'){
                        window.open(`${ctx}/static/msgDetailTemplate.html?id=${item.id}`);
                        _this.markReaded(item);
                    }else{
                        window.open(`${ctx}/static/msgResponseTemplate.html?id=${item.id}&storeAcctId=${item.platAcctId}&buyer=${item.buyer}`);
                        _this.markReaded(item);
                    }
                }
            });
        }
    };

    //表单搜索事件
    form.on('submit(message_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var dataObj =messageName.dataHandle(data);
        // if(!dataObj.storeAcctId){
        //     return layer.msg('请选择店铺!');
        // }
        messageName.tableRender(dataObj);
        // console.log(dataObj);
    });
    //更改颜色
    messageName.changeColor('message_changeColorBtn', 1);
    messageName.changeColor('message_unchangeColorBtn', 0);
    //标记已读和标记未读
    messageName.markStatusHandle('markAlreadyRead', true, '确定标记已读吗?');
    messageName.markStatusHandle('markNotRead', false, '确定标记未读吗?');

    //表头固定
    UnifiedFixedFn('messageContentCard');
    //批量打开页面
    messageName.batchHandle();


    // 导出采购入库单
    $("#message_exportBtn").click(function() {
        var confirmindex = layer.confirm('确认导出当前搜索条件下的店铺信息？', { btn: ['确认', '取消'] }, function() {
            var data = serializeObject($('#message_searchForm'));
            submitForm({data:JSON.stringify(data)}, ctx + '/ebayMessage/exportMessageStoreAcct.html', "_blank")
            layer.close(confirmindex);
        }, function() {
            layer.close(confirmindex);
        })
    });

    function serializeObject(form) {
        var o = {};
        $.each(form.serializeArray(), function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }
})