/**
 * 订单操作的详情弹框
 */
layui.use(['form', 'table', 'layer', 'element'], function() {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element;
        element.on('tab(orderLog)', function(data){
            $(this).parents('.layui-layer-page').find('.layui-layer-btn0').addClass('hide')
            var orderId = $(this).data('orderId')
            if(data.index==1){
                table.render({
                    elem: '#orderOprateLog',
                    method: 'POST',
                    url: ctx + '/orderlog/listorderlog.html?orderId='+orderId,
                    cols: [
                        [
                            { width: '25%',title: "时间", field: "operTime", templet: "<div>{{Format(d.operTime,'yyyy-MM-dd hh:mm:ss')}}</div>" },
                            { width: '10%',title: "操作人", field: "operator" },
                            { width: '65%',title: "日志", field: "operDesc" },
                        ]
                    ],
                    page: false,
                    limit:500,
                    id: 'orderOprateLog',
                    done: function(res) {
                    }
                })
            }else if(data.index==0){
                var layero = $(this).parents('.layui-layer-page')
                var isSavable = layero.find('#order_savebtn')
                if(isSavable.length&&isSavable.length>0){
                    layero.find('.layui-layer-btn0').removeClass('hide')
                }else{
                    layero.find('.layui-layer-btn0').addClass('hide')
                }
            }
          });

          $('body').on('mouseover','.suspension',function(){
            var note = $(this).attr('data-note')
            var color = $(this).attr('data-color')||'6EB714'
            note = note.split(';').join('<br/>')
            if(note!=="")
            layer.tips(note, this, {
                tips: [1, '#'+color],
                time: 5000
              });
              $('.layui-layer-tips').css('width','250px')
        })
})

/**
 * 发送邮件
 * @param orderId
 * @param platCode
 * @param callback
 */
function orderWinitSendEmail(orderId, platCode,callback){
    if(!orderId || !platCode){
        layer.msg('参数错误', {icon:0})
        return;
    }
    layer.open({
        type: 1,
        title: '发送邮件',
        btn: ['发送','取消'],
        area: ['60%', '60%'],
        content: "loading",
        success: function(layero, index) {
            $(layero).find('.layui-layer-content').html(orderWinitSendEmailTpl);
            //加载模板类型
            initAjax('/emailTemplate/queryTemplateTypeName.html', 'post', { platformCode:platCode}, function(returnData) {
                var templateTypeNameOptions = '<option value="">请选择<option>';
                returnData.data.forEach(function (item) {
                    templateTypeNameOptions += "<option value='"+item.name+"'>"+item.name+"</option>"
                });
                $(layero).find('select[name=templateTypeName]').append(templateTypeNameOptions);
                layui.form.render();
            }, 'application/x-www-form-urlencoded');
            //修改模板类型触发模板名称
            layui.form.on('select(orderWinitSendEmail_templateTypeName)', function(data){
                let templateTypeName = data.value;
                //加载模板名称
                initAjax('/emailTemplate/listSysEmailTemplates.html', 'post', { platformCode:platCode,templateTypeName:templateTypeName}, function(returnData) {
                    var templateNameOptions = '<option value="">请选择<option>';
                    returnData.data.forEach(function (item) {
                        templateNameOptions += "<option value='"+item.id+"'>"+item.templateName+"</option>"
                    });
                    $(layero).find('select[name=templateName]').html(templateNameOptions);
                    layui.form.render();
                }, 'application/x-www-form-urlencoded');
            });
            //修改模板名称触发
            layui.form.on('select(orderWinitSendEmail_templateName)', function(data){
                let templateId = data.value;
                //加载模板名称
                initAjax('/emailTemplate/listSysEmailTemplates.html', 'post', { id:templateId}, function(returnData) {
                    let templates = returnData.data;
                    if(!templates || templates.length<1){
                        layer.msg('未加载到模板', {icon:0})
                        return;
                    }
                    let template = templates[0];
                    $(layero).find('input[name=emailSubject]').val(template.emailSubject);
                    $(layero).find('textarea[name=emailContent]').val(template.emailContent);
                    layui.form.render();
                }, 'application/x-www-form-urlencoded');
            });



        },
        yes: function(index, layero) {
            var subject = $(layero).find('input[name=emailSubject]').val();
            var content = $(layero).find('textarea[name=emailContent]').val();
            //ebay取消订单
            initAjax('/platorder/winit/sendEmail.html', 'post', { id:orderId,subject:subject,content:content }, function(returnData) {
                layer.msg('发送邮件给买家成功', {icon:1});
                layer.close(index);
            }, 'application/x-www-form-urlencoded')
        }
    })
}

function orderIssueRefund(data,callback){
    let orderId = data.id;
    let platCode = data.platCode;
    if(!orderId){
        layer.msg('参数错误', {icon:0})
        return;
    }
    if(platCode != 'ebay'){
        layer.msg('非ebay订单', {icon:0})
        return;
    }
    layer.open({
        title: 'eBay退款',
        btn: ['确认退款','取消'],
        area: ['70%', '70%'],
        content: "loading",
        success: function(layero, index) {
            $(layero).find('.layui-layer-content').html(orderIssueRefundTpl);
            // debugger;
            //填充数据
            $(layero).find('input[name=orderId]').val(data.platOrderId);
            $(layero).find('input[name=storeName]').val(data.storeAcct);
            //填充退款原因
            initAjax('/sys/refundReason.html', 'post', { dictHead:'EBAY_PAYMENT_REFUND_REASON'}, function(returnData) {
                var refundReasonOptions = '<option value="">请选择<option>';
                returnData.data.forEach(function (item) {
                    refundReasonOptions += "<option value='"+item.name+"' data-code='"+item.code+"'>"+item.name+"</option>"
                });
                $(layero).find('select[name=refundReason]').append(refundReasonOptions);
                layui.form.render();
            }, 'application/x-www-form-urlencoded');
            //填表格信息
            let orderDetailOptions = '';
            (data.orderDetails || []).forEach(function (orderDetail) {
                orderDetailOptions += '<tr><td>'+orderDetail.itemId+'</td><td>'+orderDetail.platOrderDetailAmt+orderDetail.currency+'</td><td><input type="number" data-item="'+orderDetail.itemId+'" data-platdetailtranscationid="'+orderDetail.platDetailTranscationId+'" name="itemRefundAmt" class="layui-input"></td></tr>'
            });
            orderDetailOptions += '<tr><td>订单级别退款</td><td>'+data.platOrderAmt+data.currency+'</td><td><input type="number" name="orderRefundAmt" class="layui-input"></td></tr>';
            $(layero).find('.itemTable tbody').html(orderDetailOptions);
        },
        yes: function(index, layero) {
            let currency = data.currency;
            let orderId = $(layero).find('input[name=orderId]').val();
            let jsonData = {};
            jsonData.comment = $(layero).find('textarea[name=comment]').val();
            jsonData.reasonForRefund = $(layero).find('select[name=refundReason] option:selected').data("code");
            let orderRefundAmt =  $(layero).find('input[name=orderRefundAmt]').val();
            if(orderRefundAmt){
                jsonData.orderLevelRefundAmount = {value:orderRefundAmt,currency:currency}
            }
            let refundItems = [];
            $(layero).find('input[name=itemRefundAmt]').each(function(){
                let value = $(this).val();
                let itemId = $(this).data('item');
                let platDetailTranscationId = $(this).data('platdetailtranscationid');
                if(value){
                    let refundAmount = {};
                    refundAmount.value=value;
                    refundAmount.currency=currency;
                    refundItems.push({refundAmount:refundAmount, legacyReference:{legacyTransactionId:platDetailTranscationId,legacyItemId:itemId}});
                }
            });
            if(refundItems.length>0){
                jsonData.refundItems = refundItems;
            }
            //ebay取消订单
            initAjax('/platorder/winit/issuerefund/ebay.html', 'post', { storeAcctId:data.storeAcctId,orderId:orderId,paramJson:JSON.stringify(jsonData)}, function(returnData) {
                layer.msg('eBay退款提交成功', {icon:1});
                layer.close(index);
            }, 'application/x-www-form-urlencoded')
        }
    })
}


function initAjax(url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
    if (!isLoad) {
        loading.show()
    }
    $.ajax({
        type: method,
        url: ctx + url,
        dataType: 'json',
        async: true,
        data: data,
        contentType: contentType || 'application/json',
        beforeSend: function(returnData) {
            if (func2) {
                func2(returnData)
            }
        },
        success: function(returnData) {
            loading.hide()
            if (returnData.code == "0000") {
                func(returnData)
            } else {
                layer.msg(returnData.msg, { icon: 2 });
            }
        },
        error: function(returnData) {
            layui.admin.load.hide();
            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", { icon: 7 });
            } else {
                layer.msg("服务器错误");
            }
        },
        complete: function(returnData) {
            loading.hide()
            if (func3) {
                func3(returnData)
            }
        }
    })
}


//订单发送邮件tpl
var orderWinitSendEmailTpl =
    '<form class="layui-form" action=""  id="orderWinitSendEmailForm">\n' +
    '                    <div class="p20">\n' +
    '                        <div class="layui-form-item">\n' +
    '                            <div class="layui-inline">\n' +
    '                                <label class="layui-form-label">模板类型</label>\n' +
    '                                <div class="layui-input-inline">\n' +
    '                                    <select name="templateTypeName" lay-filter="orderWinitSendEmail_templateTypeName" lay-search="">\n' +
    '                                    </select>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                            <div class="layui-inline">\n' +
    '                                <label class="layui-form-label">模板名称</label>\n' +
    '                                <div class="layui-input-inline">\n' +
    '                                    <select name="templateName"  lay-filter="orderWinitSendEmail_templateName" lay-search="">\n' +
    '                                    </select>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                            <div class="layui-form-item">\n' +
    '                                <label class="layui-form-label">主题</label>\n' +
    '                                <div class="layui-input-block">\n' +
    '                                    <input type="text" name="emailSubject" class="layui-input">\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                            <div class="layui-form-item layui-form-text">\n' +
    '                                <label class="layui-form-label">正文</label>\n' +
    '                                <div class="layui-input-block">\n' +
    '                                    <textarea name="emailContent" placeholder="请输入内容" class="layui-textarea"></textarea>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </form>'
var orderIssueRefundTpl = '<form class="layui-form" action=""  id="orderWinitIssueRefundForm">\n' +
    '                <div class="p20">\n' +
    '                    <div class="layui-form-item">\n' +
    '                        <div class="layui-inline">\n' +
    '                            <label class="layui-form-label">订单ID</label>\n' +
    '                            <div class="layui-input-inline">\n' +
    '                                <div>\n' +
    '                                    <input type="text" name="orderId" readonly class="layui-input">\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                        <div class="layui-inline">\n' +
    '                            <label class="layui-form-label">店铺</label>\n' +
    '                            <div class="layui-input-inline">\n' +
    '                                <div>\n' +
    '                                    <input type="text" name="storeName" readonly class="layui-input">\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="layui-form-item">\n' +
    '                        <label class="layui-form-label">退款原因</label>\n' +
    '                        <div class="layui-input-inline">\n' +
    '                            <select name="refundReason"   lay-search="">\n' +
    '                            </select>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="layui-form-item layui-form-text">\n' +
    '                        <label class="layui-form-label">退款备注</label>\n' +
    '                        <div class="layui-input-block">\n' +
    '                            <textarea name="comment" placeholder="请输入内容" class="layui-textarea"></textarea>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                    <div class="layui-form-item">\n' +
    '                        <div class="layui-input-block">\n' +
    '                            <table class="layui-table itemTable" >\n' +
    '                                <colgroup>\n' +
    '                                    <col width="150">\n' +
    '                                    <col width="150">\n' +
    '                                    <col width="200">\n' +
    '                                </colgroup>\n' +
    '                                <thead>\n' +
    '                                <tr>\n' +
    '                                    <th>ItemID</th>\n' +
    '                                    <th>付款金额</th>\n' +
    '                                    <th>退款金额(<span class="totalAmt">0</span>)</th>\n' +
    '                                </tr>\n' +
    '                                </thead>\n' +
    '                                <tbody>\n' +
    '                                </tbody>\n' +
    '                            </table>\n' +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </form>'