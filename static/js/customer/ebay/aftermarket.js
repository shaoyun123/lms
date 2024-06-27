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
    render_hp_orgs_users("#aftermarket_searchForm");
    // 销售人员
    getSalersPerson();

    //时间处理(默认2个月)
    var aftermarket_nowDateString = new Date().getTime();
    var aftermarket_dateFiftweenSting = aftermarket_nowDateString - 60*24*60*60*1000;
    var aftermarket_dateStart = Format(aftermarket_dateFiftweenSting, 'yyyy-MM-dd');
    var aftermarket_dateEnd = Format(aftermarket_nowDateString, 'yyyy-MM-dd');
    //渲染时间范围
    laydate.render({
        elem: '#aftermarket_receive_date', //指定元素
        range: true,
        value: aftermarket_dateStart +' - '+ aftermarket_dateEnd
    });
    laydate.render({
        elem: '#aftermarket_batchTimes',
        range: true,
        type: 'datetime'
    });
    initReturnStatus();
    // 初始化退款状态
    function initReturnStatus(){
        $.ajax({
            type: "get",
            url: ctx + "/ebay/return/listReturnStatusEnums",
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    let list = returnData.data;
                    let res = [];
                    list?.forEach(item => {
                        let obj = {
                            name: item,
                            code: item
                        }
                        res.push(obj);
                    });
                    commonRenderSelect("returnStatus", res, { name: "name", code: "name" })
                    formSelects.data("aftermarket_refundStatus", "local", { arr: [] })
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        });
    }

    initReturnReason();
    // 初始化退款原因
    function initReturnReason(){
        $.ajax({
            type: "get",
            url: ctx + "/ebay/return/listReturnReasonEnums",
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    let list = returnData.data;
                    let res = [];
                    list?.forEach(item => {
                        let obj = {
                            name: item,
                            code: item
                        }
                        res.push(obj);
                    });
                    commonRenderSelect("returnReason", res, { name: "name", code: "name" })
                    formSelects.data("aftermarket_refundReason", "local", { arr: [] })
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        });
    }

    //监听tab点击
    element.on('tab(aftermarket-tabs)', function(data){
        if(data.index == 0) { //未处理
            $('#aftermarket_closeType').val('0');
            $('#aftermarket_processType').val('0');
            $('[lay-filter="aftermarket_submit"]').trigger('click');
        }else if(data.index == 1){ //已处理
            $('#aftermarket_closeType').val('0');
            $('#aftermarket_processType').val('1');
            $('[lay-filter="aftermarket_submit"]').trigger('click');
        }else if(data.index == 2){ //关闭
            $('#aftermarket_closeType').val('1');
            $('#aftermarket_processType').val('');
            $('[lay-filter="aftermarket_submit"]').trigger('click');
        }else { //全部
            $('#aftermarket_closeType').val('');
            $('#aftermarket_processType').val('');
            $('[lay-filter="aftermarket_submit"]').trigger('click');
        }
    });
    var formDom = $('#aftermarket_searchForm')
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

    //售后命名空间
    var aftermarketName = {
        dataHandle: function(data){
            data.roleNames = 'ebay客服专员';
            data.platCode = 'ebay';
            // data.personType ='customservicer';
            // data.type='customservicer';
            data.isClosed = $('#aftermarket_closeType').val();
            data.isProcessed = $('#aftermarket_processType').val();
            if(data.times){
                var timeArr =data.times.split(' - ');
                data.startTime = timeArr[0];
                data.endTime = timeArr[1];
            }else{
                data.startTime = '';
                data.endTime='';
            };
            return data;
        },
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#aftermarket_table',
                method: 'post',
                url:'/lms/ebay/return/query.html',
                where: data,
                page: true,
                id: "aftermarket_tableId",
                limits: [50, 100, 300],
                limit: 50,
                cols: [
                    [
                        {type: 'checkbox', width:32},
                        {title: '产品信息', templet: '#aftermarket_info'},
                        {title: '退货编号',field: 'returnId', width: 100},
                        {title: '金额币种',templet: '#aftermarket_money', width: 100},
                        {title: '店铺/客服/销售', templet: '<div><div style="text-align:left;"><strong>店铺:</strong><span>{{d.storeAcct}}</span><br><strong>客服:</strong><span>{{d.customServicer}}</span><br><strong>销售:</strong><span>{{d.salesperson}}</span></div></div>', width: 160},
                        {title: '买家账号', templet: '#aftermarket_buyer_account', width: 240},
                        {title: '退款原因',field: 'returnReason', width: 180},
                        {title: '退款状态',field: 'returnStatus', width: 180},
                        {title: '时间',templet: '<div>{{Format(d.returnCreationDate, "yyyy-MM-dd hh:mm:ss")}}</div>', width: 160},
                        {title: '操作',toolbar: '#aftermarket_tableIdBar', width:80}
                    ]
                ],
                done: function(res){
                    const aftermarket_numbers = res.extra ? res.extra : {
                        needProcess: 0,
                        processed: 0,
                        closed: 0,
                        total: 0
                    };
                    $('#aftermarket_not_handle_number').html(aftermarket_numbers.needProcess);
                    $('#aftermarket_already_handle_number').html(aftermarket_numbers.processed);
                    $('#aftermarket_already_close_number').html(aftermarket_numbers.closed);
                    $('#aftermarket_all_handle_number').html(aftermarket_numbers.total);
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(aftermarket_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'detail'){ //详情
                    _this.detailPageRender(data);
                }else if(obj.event == 'auto'){//同步
                    _this.autoData(data);
                }
            });
        },
        autoData: function(data){ //同步数据
            layer.confirm('确定同步该条数据吗？',function(index){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms//ebay/return/syncSingleEbayReturn.html',
                    data: {id: data.id},
                    before: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code=='0000'){
                            layer.msg(res.msg|| '同步成功');
                            $('[lay-filter="aftermarket_submit"]').trigger('click');
                        }
                    }
                });
            });
        },
        //详情页面的数据处理
        detailSaveDataHandle: function(obj,layero){
            var data = {};
            var val = $('.aftermarket_detail_file').find("input[type='radio']:checked").val();
            data.content = $('#aftermarket_container_leave').text();//留言
            if(val == 'issueFullRefund' || val == 'partialRefund'){
                if(val == 'issueFullRefund'){
                    data.action = 'issueFullRefund';
                    data.currency = $('#all_aftm_refundCurrency').text();//币种
                    data.returnAmt = $('#all_aftm_refundMoney').text();//金额
                }else{
                    data.action = 'partialRefund';
                    data.currency = $('#part_aftm_refundCurrency').text();//币种
                    data.partialRefund = $('#part_aftm_refundMoney').val();//金额
                }
            }else{
                if(val=='sendMessage'){//与买家沟通
                    data.action = 'sendMessage';
                }else if(val=='approve'){//同意退款
                    data.action = 'approve';
                }else{ //拒绝退货
                    data.action = 'decline';
                }
            };
            data.id = obj.id;
            data.returnId = obj.returnId;
            data.storeAcctId = obj.storeAcctId;
            data.delayReply = layero.find('[name=delayReply]').is(':checked');
            return data;
        },
        //详情页面的渲染
        detailPageRender: function(data){
            var _this = this;
            Promise.all([_this.getDetailData(data.id), _this.getOrderData(data.itemId, data.transactionId)]).then(function(result){
                // console.log(result);
                var templateData = result[0];
                templateData.orderDetailData = result[1];
                layer.open({
                    type: 1,
                    title: '详情',
                    area: ['1100px', '800px'],
                    btn: ['保存', '关闭'],
                    id: 'aftermarket_detail_layerId',
                    content: $('#aftermarket_detail_layer').html(),
                    success: function(layero, index){
                       var getTpl = aftermarket_detail_containerTpl.innerHTML,
                        view = document.getElementById('aftermarket_detail_container');
                        laytpl(getTpl).render(templateData, function(html){
                            view.innerHTML = html;
                            var ckedStr = '';
                            if(templateData.msgReturnEbay.delayReply){
                               ckedStr +='<div class="layui-form" style="position:absolute;bottom:16px;right:188px;"><input type="checkbox" title="延迟回复" name="delayReply" lay-skin="primary" checked></div>';                                  
                            }else{
                                ckedStr = '<div class="layui-form" style="position:absolute;bottom:16px;right:188px;"><input type="checkbox" title="延迟回复" name="delayReply" lay-skin="primary"></div>';
                            };
                            layero.find('.layui-layer-btn.layui-layer-btn-').append(ckedStr);
                            form.render();
                            _this.watchRadio();
                            var imgHandleObj = templateData.fileMap || {};
                            imgHandleObj.delayReply = templateData.msgReturnEbay.delayReply;
                            _this.addImg(data, imgHandleObj);
                            layero.find('[name=delayReply]').next().on('click', function(){
                                _this.delayHandle(data, layero);
                            });
                        });
                    },
                    yes: function(index,layero){
                        var ajaxData = _this.detailSaveDataHandle(data,layero);
                        console.log(ajaxData);
                        $.ajax({
                                type: 'get',
                                dataType: 'json',
                                url: '/lms/ebay/return/processEbayReturn.html',
                                data: ajaxData,
                                beforeSend: function(){
                                    loading.show()
                                },
                                success: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        layer.msg(res.msg|| '处理成功');
                                        layer.close(index);
                                        $('[lay-filter="aftermarket_submit"]').trigger('click');
                                    }else{
                                        layer.msg(res.msg);
                                    }
                                }
                        });
                    }
                })
            }).catch(function(){
                layer.msg('请求繁忙,请稍后重试!');
            });
        },
        //详情的接口请求和数据获取
        getDetailData: function(id){
           return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/return/detail.html?id='+id,
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
                });
           });
        },
        //订单详情的接口
        getOrderData: function(itemId, transactionId){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/return/getOrderInfo.html',
                    data: {
                        itemId: itemId,
                        transactionId: transactionId
                    },
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
                });
            });
        },
        // 监听radio选择
        watchRadio: function(){
            var $nextEle = $('#aftermarket_detail_refund_items');
            form.on('radio(aftermarker_handle_filter)', function(obj){
                var val = obj.value;
                if(val == 'issueFullRefund' || val == 'partialRefund'){
                    $nextEle.removeClass('disN');
                    var items = $nextEle.find('.aftermarket_detail_refund_item');
                    if(val =='issueFullRefund'){
                        $(items[0]).removeClass('disN');
                        $(items[1]).addClass('disN');
                    }else {
                        $(items[0]).addClass('disN');
                        $(items[1]).removeClass('disN');
                    }
                }else{
                    $nextEle.addClass('disN');
                }
            })
        },
        //新增图片弹框
        addImg: function(data,imgHandleObj){
            var _this = this;
            // console.log(imgHandleObj);
            // console.log(Object.keys(imgHandleObj));
            $('#aftermarket_back_content_imgLi').on('click',function(){
                var index = layer.open({
                    type:1,
                    title: '新增图片',
                    area: ['600px', '400px'],
                    btn: ['发布', '关闭'],
                    id: 'aftermarket_back_content_imgLiLayerId',
                    content: $('#aftermarket_back_content_imgLiLayer').html(),
                    success: function(layero, index){
                        var getTpl = aftermarket_back_content_imgLiContainerTpl.innerHTML,
                        view = document.getElementById('aftermarket_back_content_imgLiContainer');
                        laytpl(getTpl).render(imgHandleObj, function(html){
                            view.innerHTML = html;
                            var ckedImgStr ='';
                            if(imgHandleObj.delayReply){
                                ckedImgStr +='<div class="layui-form" style="position:absolute;bottom:16px;right:188px;"><input type="checkbox" title="延迟回复" name="delayReply" lay-skin="primary" checked></div>';                                  
                             }else{
                                ckedImgStr = '<div class="layui-form" style="position:absolute;bottom:16px;right:188px;"><input type="checkbox" title="延迟回复" name="delayReply" lay-skin="primary"></div>';
                             };
                            layero.find('.layui-layer-btn.layui-layer-btn-').append(ckedImgStr);
                            form.render();
                            _this.removeImg();
                            layero.find('[name=delayReply]').next().on('click', function(){
                                _this.delayHandle(data, layero);
                            });
                            //执行实例
                            upload.render({
                                elem: '#aftermarket_back_content_img_upload' //绑定元素
                                ,url: `/lms/ebay/return/uploadImg.html?id=${data.id}&storeAcctId=${data.storeAcctId}` //上传接口
                                ,before: function(){
                                    loading.show();
                                }
                                //上传完毕回调
                                ,done: function(res){
                                    loading.hide();
                                    if(res.code == '0000'){
                                        var imgData = res.data;
                                        var liStr = `
                                            <li data-imgUrl="${imgData.fileFtpUrl}" data-imgId="${imgData.fileFtpId}">
                                                <img class="img_show_hide imgCss imgBorder" width="60" height="60" src="${imgData.fileFtpUrl}" onerror="layui.admin.img_noFind()">
                                                <span data-id="${imgData.fileFtpId}">删除</span>
                                            </li>
                                        `;
                                        $('#aftermarket_back_content_imgUlContainer').append(liStr);
                                        // _this.removeImg();
                                    }
                                }
                                //请求异常回调
                                ,error: function(){
                                    loading.hide();
                                    layer.msg('上传图片失败');
                                }
                            });
                        });
                    },
                    yes: function(index, layero){
                        var filePurpose = layero.find('select[name=filePurpose]').val();
                        var $imgLis = $('#aftermarket_back_content_imgUlContainer').find('li');
                        var delayReply = layero.find('[name=delayReply]').is(':checked');
                        var imgsArr = [];
                        for(var i=0; i<$imgLis.length; i++){
                            var item = $imgLis[i];
                            var imgObj = {};
                            imgObj.fileFtpId = $(item).attr('data-imgId');
                            imgObj.fileFtpUrl = $(item).attr('data-imgUrl');
                            imgsArr.push(imgObj);
                        };
                        var ajaxData = {
                            filePurpose: filePurpose,
                            id: data.id,
                            imgs: imgsArr,
                            returnId: data.returnId,
                            storeAcctId: data.storeAcctId,
                            delayReply: delayReply
                        };
                        $.ajax({
                            type: 'post',
                            dataType:'json',
                            contentType: 'application/json',
                            url: '/lms/ebay/return/publishImg.html',
                            data: JSON.stringify(ajaxData),
                            beforeSend: function(){
                                loading.show();
                            },
                            success: function(res){
                                loading.hide();
                                if(res.code == '0000'){
                                    layer.msg(res.msg || '同步图片成功!');
                                    layer.close(index);
                                    var sellLiStr = '';
                                    for(var j=0;j<imgsArr.length; j++){
                                        var imgItem = imgsArr[j];
                                        sellLiStr += `
                                        <li>
                                            <img class="img_show_hide imgCss imgBorder" width="60" height="60" src="${imgItem.fileFtpUrl}" onerror="layui.admin.img_noFind()" data-id="{{item.fileId}}">
                                        </li>
                                        `
                                    };
                                    $('#aftermarket_back_content_imgLi').nextAll().remove();
                                    $('#aftermarket_back_content_imgLi').after(sellLiStr);
                                }else{
                                    layer.msg(res.msg || '同步图片失败!');
                                }
                            }
                        })

                    }
                })
            })
        },
        //删除图片事件
        removeImg: function(){
            $('#aftermarket_back_content_imgUlContainer').on('click','span', function(){
                var spanThis = $(this);
                // console.log('测试执行次数')
                var imgId = $(this).attr('data-id');
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/return/deleteImg.html?fileFtpId='+imgId,
                    beforeSend: function(){
                        loading.show();
                    },
                    success: function(res){
                        loading.hide();
                        if(res.code=="0000"){
                            spanThis.parents('li').remove();
                            layer.msg(res.msg || '移除图片成功');
                        }else{
                            layer.msg(res.msg);
                        }
                    }
                });
            })
        },
        //批量同步
        bacthHandle: function(){
            var _this = this;
            $('#aftermarket_batchHandle').on('click', function(){
                var data = {};
                data.roleNames = 'ebay客服专员';
                // data.platCode = 'ebay';
                var $form = $('#aftermarket_searchForm');
                data.orgId = $form.find('select[name=orgId]').val();
                data.salePersonId = $form.find('select[name=salePersonId]').val();
                data.storeAcctId = $form.find('select[name=storeAcctId]').val();
                var aftermkTimes = $('#aftermarket_batchTimes').val();
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
                                        layer.msg(res.msg || 'return同步任务已成功!');
                                        $('[lay-filter="aftermarket_submit"]').trigger('click');
                                    }else{
                                        layer.msg(res.msg || 'return同步任务失败!');
                                    }
                                }
                            })

                         }, 4000)
                        
                       
                        
                    }
                }).catch(function(reason){
                    layer.msg(reason);
                });
            });

            $('#aftermarket_batchExportHandle').on('click', function(){
                let paramData = table.checkStatus('aftermarket_tableId').data
                if (paramData.length > 0) {
                    let idList = paramData.map(item => item.id)
                    submitForm({"idList": idList }, ctx + '/ebay/return/exportSelected');
                }
                else {
                    layui.layer.msg("请选择导出范围!");
                }
            });
        },
        // 开始同步
        startSynchro: function(data,dateNow){
            return new Promise(function(resolve, reject){
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/ebay/return/syncEbayReturn.html?randomKey='+dateNow,
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
        //延时点击就处理的函数
        delayHandle: function(data, layero){
            var delayReply = layero.find('[name=delayReply]').is(':checked');
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/ebay/return/updateReturnDelayStatus.html',
                data: {
                    storeAcctId: data.storeAcctId,
                    delayReply: delayReply
                },
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
    form.on('submit(aftermarket_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        var dataObj =aftermarketName.dataHandle(data);
        aftermarketName.tableRender(dataObj);
    });
    //表头固定
    UnifiedFixedFn('aftermarketCard');
    //批量操作
    aftermarketName.bacthHandle();

    //默认触发表单搜索事件
    setTimeout(() => {
        $('[lay-filter="aftermarket_submit"]').trigger('click');
    }, 100)
});