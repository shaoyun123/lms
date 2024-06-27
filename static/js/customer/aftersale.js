//模块引入 类似于 requirejs
var aftersale_disputeReasonArr;
layui.use(['admin', 'form', 'table', 'layer', 'laydate', 'upload','formSelects'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laytpl = layui.laytpl,
        upload = layui.upload,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    form.render('select');
    render_hp_orgs_users("#aftersale_shopee_searchForm"); //渲染部门销售员店铺三级联动
    laydate.render({
        elem: '#aftersale_times', //指定元素
        range: true
    });
    laydate.render({
        elem: '#aftersale_batchTimes',
        range: true,
        type: 'datetime'
    });
    //监听tabs点击事件
    element.on('tab(aftersale-tabs)', function(data) {
        if (data.index == 0) { //待处理
            $('#aftersale_pageType').val('REQUESTED_PAGE');
            // $('[lay-filter="aftersale_submit"]').trigger('click');
        } else if (data.index == 1) { //已处理
            $('#aftersale_pageType').val('DEAL_PAGE');
            // $('[lay-filter="aftersale_submit"]').trigger('click');
        } else { //全部
            $('#aftersale_pageType').val('');
            // $('[lay-filter="aftersale_submit"]').trigger('click');
        }
    });
    //售后命名空间
    var aftersaleName = {
        selectInit: function(resolve, reject) { //下拉框初始化
            loading.show();
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/lms/shopee/returns/init.html',
                success: function(res) {
                    if (res.code == '0000') {
                        loading.hide();
                        resolve(res.data)
                    } else {
                        loading.hide();
                        reject(res.msg);
                    }
                },
                error: function() {
                    loading.hide();
                    reject('服务器错误,未请求到数据');
                }
            })
        },
        selectRender: function(data, id) { //下拉框渲染
            var dataJson = JSON.parse(data);
            var str;
            if (id == 'aftersale_status') { //退款状态
                str = '<option value="">未选择</option>';
                for (var i = 0; i < dataJson.length; i++) {
                    var item = dataJson[i];
                    str += `<option value="${item.key}">${item.value}</option>`;
                };
            } else if (id == 'aftersale_orderBy' || id == 'aftersale_time') { //退款排序和时间
                str = '';
                for (var i = 0; i < dataJson.length; i++) {
                    var item = dataJson[i];
                    str += `<option value="${item.key}">${item.value}</option>`;
                };
            } else if (id == 'aftersale_reason') { //退款类型
                str = '<option value="">未选择</option>';
                for (var i = 0; i < dataJson.length; i++) {
                    var item = dataJson[i];
                    str += `<option value="${item.key}">${item.key}</option>`;
                };
            } else { //退款申诉
                str = '';
                for (var i = 0; i < dataJson.length; i++) {
                    var item = dataJson[i];
                    str += `<option value="${item.key}">${item.value}</option>`;
                };
            }

            $('#' + id).append(str);
            form.render('select');
        },
        dataHandle: function(data) { //数据处理
            data.roleName = 'shopee客服';
            data.platCode = 'shopee';
            data.type = 'customservicer';
            if (data.times) {
                var timeArr = data.times.split(' - ');
                data.startTime = timeArr[0];
                data.endTime = timeArr[1];
            } else {
                data.startTime = '';
                data.endTime = '';
            }
            delete data.times;
            return data;
        },
        tableRender: function(data) { //表格渲染
            var _this = this;
            table.render({
                elem: '#aftersale_table',
                method: 'post',
                url: '/lms/shopee/returns/list.html',
                where: data,
                page: true,
                id: "aftersale_tableId",
                limits: [50, 100, 300],
                limit: 50,
                cols: [
                    [
                        { type: 'checkbox', width: 32 },
                        { title: '店铺名称(shopId)', field: 'storeAcct',templet: function(d){
                            return `<span>${d.storeAcct}</span><br><span>(${d.shopId})</span>`
                        }},
                        { title: '店铺单号', field: 'orderId', width: 140 },
                        { title: '订单金额(￥)', field: 'amountBeforeDiscount', width: 110 },
                        { title: '售后申请号', field: 'returnSn', width: 140 },
                        { title: '退款类型', field: 'reason', width: 140 },
                        { title: '退款理由', field: 'textReason' },
                        { title: '退款商品数量', field: 'amount', width: 110 },
                        { title: '退款金额(￥)', field: 'refundAmount', width: 110 },
                        { title: '退款状态', field: 'returnStatusCn', width: 110 },
                        { title: '客服备注', field: 'remark' },
                        { title: '时间', field: 'times', templet: `<div>
                      <div>开立:{{Format(d.returnCreateTime,'yyyy-MM-dd')}}</div>
                      <div>更新:{{Format(d.returnUpdateTime,'yyyy-MM-dd')}}</div>
                      <div>截止:{{Format(d.returnDueTime,'yyyy-MM-dd')}}</div>
                      </div>`, width: 135 },
                        { title: '操作', toolbar: '#aftersale_tableIdBar', width: 80 }
                    ]
                ],
                done: function(res, curr, count) {
                    $('#aftersale-tabs>.layui-tab-title').find('li>span').html('点击显示');
                    $('#aftersale-tabs>.layui-tab-title').find('li.layui-this>span').html(res.count);
                    _this.watchBar();
                }
            });
        },
        watchBar: function() { //表格工具条
            var _this = this;
            table.on('tool(aftersale_tableFilter)', function(obj) {
                var data = obj.data;
                // console.log('当前行数据', data);
                if (obj.event == 'remark') { //备注弹框
                    _this.remarkDialog(data);
                } else if (obj.event == 'detail') { //详情弹框
                    var btns = [];
                    if (data.returnStatus == 'REQUESTED') {
                        btns = ['同意退款', '申诉', '关闭'];
                    } else {
                        btns = ['关闭'];
                    }
                    _this.detailDialog(data, btns);
                } else if (obj.event == 'auto') { //单个同步
                    _this.autoAjax(data.id).then(function(result) {
                        layer.msg(result);
                        $('[lay-filter="aftersale_submit"]').trigger('click');
                    })
                }
            });
        },
        remarkDialog: function(data) {
            var index = layer.open({
                type: 1,
                title: '客服备注',
                showClose: false,
                area: ['600px', '400px'],
                btn: ['备注', '关闭'],
                content: $('#aftersale_remarkDialog').html(),
                success: function(layero, index) {
                    var $textarea = layero.find('.layui-textarea');
                    if (data.remark) {
                        $textarea.val(data.remark);
                    }
                },
                yes: function(index, layero) {
                    var val = layero.find('.layui-textarea').val();
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        url: '/lms/shopee/returns/add_remark.html',
                        data: {
                            id: data.id,
                            remark: val
                        },
                        beforeSend: function() {
                            loading.show();
                        },
                        success: function(res) {
                            if (res.code == '0000') {
                                loading.hide();
                                layer.close(index);
                                layer.msg(res.msg);
                                $('[lay-filter="aftersale_submit"]').trigger('click');
                            } else {
                                loading.hide();
                            }
                        },
                        error: function() {
                            loading.hide();
                            layer.msg('服务器错误');
                        }
                    })
                }

            })
        },
        detailDialog: function(data, btns) {
            var _this = this;
            var index = layer.open({
                type: 1,
                title: '售后详情',
                showClose: false,
                area: ['1100px', '800px'],
                btn: btns,
                content: $('#aftersale_detailDialog').html(),
                success: function(layero, index) {
                    _this.detailAjax(data.id).then(function(result) {
                        for (let i = 0; i < result.sub.length; i++) {
                            let item = result.sub[i];
                            let itemImg;
                            if (item.itemImages) {
                                itemImg = item.itemImages.split(',')[0];
                            } else {
                                itemImg = '';
                            }

                            result.sub[i] = Object.assign(item, { itemImg: itemImg });
                        };
                        // console.log('id查询结果', result.sub);
                        var getTpl = aftersale_detailTpl.innerHTML,
                            view = document.getElementById('aftersale_detailContainer');
                        laytpl(getTpl).render(result, function(html) {
                            view.innerHTML = html;
                        });
                    });
                },
                yes: function(index, layero) {
                    if (data.returnStatus == 'REQUESTED') {
                        layer.confirm('确定要退款吗?', { icon: 3, title: '提示' }, function(index) {
                            $.ajax({
                                type: 'get',
                                dataType: 'json',
                                url: '/lms/shopee/returns/confirm.html',
                                data: {
                                    id: data.id,
                                    returnSn: data.returnSn,
                                    storeAcctId: data.storeAcctId
                                },
                                beforeSend: function() {
                                    loading.show();
                                },
                                success: function(res) {
                                    loading.hide();
                                    if (res.code == '0000') {
                                        layer.msg(res.msg);
                                        layer.closeAll();
                                        //默认触发搜索
                                        $('[lay-filter="aftersale_submit"]').trigger('click');
                                    } else {
                                        layer.msg(res.msg);
                                    }
                                }
                            })
                        });
                    } else {
                        layer.close(index);
                    }
                },
                btn2: function(layero, index) {
                    console.log('申诉')
                    _this.AppealDialog(data);
                    return false;
                }
            })
        },
        detailAjax: function(id) { //详情请求
            return new Promise(function(resolve, reject) {
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/shopee/returns/detail.html',
                    data: { id: id },
                    beforeSend: function() {
                        loading.show();
                    },
                    success: function(res) {
                        if (res.code == '0000') {
                            loading.hide();
                            resolve(res.data);
                        } else {
                            loading.hide();
                            reject(res.msg);
                        }
                    },
                    error: function() {
                        loading.hide();
                        reject('服务器出问题,请稍后在试!');
                    }
                })
            })
        },
        AppealDialog: function(data) { //申诉弹框
            var _this = this;
            var index = layer.open({
                type: 1,
                title: '申诉',
                showClose: false,
                area: ['800px', '600px'],
                btn: ['提交申诉', '关闭'],
                content: $('#aftersale_appealDialog').html(),
                success: function(layero, index) {
                    _this.selectRender(aftersale_disputeReasonArr, 'aftersale_disputeReason');
                    new UploadImage("aftersale_appeal_images", ctx + '/preProdDev/getBase64Img.html').upload(function(xhr) {
                        var img = new Image('200', '200');
                        var returnData;
                        try {
                            returnData = xhr.responseText
                        } catch (err) {

                        };
                        if (xhr.responseText == '') {
                            layer.msg("上传出错!");
                        } else if (returnData != undefined && returnData.code == '9999') {
                            layer.msg("上传出错!" + xhr.responseText);
                        } else {
                            img.src = xhr.responseText;
                            var childs = document.getElementById('aftersale_appeal_images').childNodes;
                            if (childs.length > 2) {
                                layer.msg("图片不可以超过三张");
                                return;
                            }
                            this.appendChild(img);
                        }
                    });
                },
                yes: function(index, layero) {
                    var $form = $('#aftersale_appealForm');
                    var disputeEmail = $form.find('[name=disputeEmail]').val();
                    var disputeReason = $form.find('[name=disputeReason]').val();
                    var disputeTextReason = $form.find('[name=disputeTextReason]').val();
                    var $lis = $('#aftersale_appeal_images').find('img');
                    var imgStr = '';
                    var imgStrArr = [];
                    for (let i = 0; i < $lis.length; i++) {
                        let item = $lis[i];
                        let src = $(item).attr('src');
                        imgStrArr.push(src);
                    }
                    imgStr = imgStrArr.join(',');
                    if (!disputeEmail || !disputeReason || !disputeTextReason || !imgStr) {
                        return layer.msg('申诉类型/原因/邮箱/证据都必须填写');
                    }
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        url: '/lms/shopee/returns/dispute.html',
                        data: {
                            disputeEmail: disputeEmail,
                            disputeReason: disputeReason,
                            disputeTextReason: disputeTextReason,
                            disputeImages: imgStr,
                            id: data.id,
                            returnSn: data.returnSn,
                            storeAcctId: data.storeAcctId
                        },
                        beforeSend: function() {
                            loading.show();
                        },
                        success: function(res) {
                            loading.hide();
                            if (res.code == '0000') {
                                layer.msg(res.msg);
                                layer.closeAll();
                                //默认触发搜索
                                $('[lay-filter="aftersale_submit"]').trigger('click');
                            } else {
                                layer.msg(res.msg);
                            }
                        },
                        error: function() {
                            loading.hide();
                            layer.msg('接口出问题了');
                        }
                    })
                    console.log(index);
                }
            })
        },
        // 同步接口
        autoAjax: function(ids) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/lms/shopee/returns/refresh.html',
                    data: { ids: ids },
                    beforeSend: function() {
                        loading.show();
                    },
                    success: function(res) {
                        loading.hide();
                        if (res.code == '0000') {
                            resolve(res.msg);
                        } else {
                            reject(res.msg);
                        }
                    }
                })
            });
        },
        //批量同步
        batchHandle: function() {
            var _this = this;
            $('#aftersale_batchAuto').on('click', function() {
                var checkStatus = table.checkStatus('aftersale_tableId'),
                    data = checkStatus.data;
                if (!data.length) {
                    return layer.msg('请先选中数据!');
                };
                var idsArr = data.map(function(item) {
                    return item.id;
                });
                _this.autoAjax(idsArr.join()).then(function(result) {
                    layer.msg(result);
                    $('[lay-filter="aftersale_submit"]').trigger('click');
                }).catch(function(reason) {
                    layer.msg(reason);
                })
            });
        }
    };

    //初始化
    new Promise(aftersaleName.selectInit).then(function(res) {
        aftersale_disputeReasonArr = res.dispute_reason;
        if(!!res.return_status){
            formSelects.data('aftersale_status','local',{arr:JSON.parse(res.return_status).map(item=>({...item,name:item.value,value:item.key,selected:'selected'}))})
        }
        aftersaleName.selectRender(res.return_reason, 'aftersale_reason');
        aftersaleName.selectRender(res.timeType, 'aftersale_time');
        aftersaleName.selectRender(res.orderBy, 'aftersale_orderBy');
    }).then(function() {
        //表单搜索事件
        form.on('submit(aftersale_submit)', function(data) {
            var data = data.field; //获取到表单提交对象
            var dataObj = aftersaleName.dataHandle(data);
            aftersaleName.tableRender(dataObj);
        });

        //默认触发搜索
        // $('[lay-filter="aftersale_submit"]').trigger('click');
        aftersaleName.batchHandle();
    });
})

function aftersale_delLi(obj) {
    $(obj).parent().remove();
}

function aftersale_reset() {
    //重置表单
    document.getElementById('aftersale_shopee_searchForm').reset();
    layui.formSelects.value('aftersale_status', [])
    $('#shopee_aftersale_depart_sel').next().find('dd[lay-value=""]').trigger('click')
}

//表头固定
(function() {
    $('.layadmin-tabsbody-item.layui-show').on('scroll', function() {
        var top = $(this).scrollTop();
        //固定layui-card-header和layui-table-header
        var cardHeader = $('#aftersale_positionCard').find('.layui-card-header');
        var tableHeader = $('#aftersale_positionCard').find('.layui-table-header');
        var cardHeaderH = cardHeader[0].offsetTop;
        if (top > cardHeaderH) {
            cardHeader.css({
                position: 'fixed',
                zIndex: 999,
                width: '94vw',
                background: '#fff',
                marginLeft: '15px',
                top: '50px'
            });
            tableHeader.css({
                position: 'fixed',
                zIndex: 999,
                width: '94vw',
                background: '#fff',
                top: '92px'
            });
        } else {
            cardHeader.css({
                position: 'inherit',
                width: '100%',
                marginLeft: '0px',
                padding: 'inherit',
                marginLeft: '15px',
                background: '#fff'
            });
            tableHeader.css({
                position: 'inherit',
                width: '100%',
                top: '0px'
            })
        }
    })
})()