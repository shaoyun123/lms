; (function ($, layui, window, document, undefined) {
    layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'laypage', 'laydate', 'upload', 'element'], function () {
        var form = layui.form,
            admin = layui.admin,
            formSelects = layui.formSelects,
            laydate = layui.laydate,
            laypage = layui.laypage,
            upload = layui.upload,
            laytpl = layui.laytpl,
            element = layui.element,
            table = layui.table;
        render_hp_orgs_users("#smtCancelOrder_search_form");
        form.render()
        var smtCancelOrderName = {
            tabValue: 1,
            //#region 初始化 start
            init: function () {
                this.payTimeRender()  //支付时间渲染
            },
            //支付时间渲染
            payTimeRender: function () {
                var startTime = this.getlastmonth()
                var endTime = Format(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')
                laydate.render({
                    elem: '#smtCancelOrder_search_payTime',
                    range: true,
                    type: 'datetime',
                    value: `${startTime} - ${endTime}`
                })
            },
            p: function (s) {
                return s < 10 ? '0' + s : s;

            },
            getlastmonth: function () {
                var myDate = new Date();
                var currentYear = myDate.getFullYear();
                var currentMonth = myDate.getMonth() + 1;
                var currentDate = myDate.getDate();
                var lastDate;

                //一年前的时间
                var oneY = 0;
                var oneM = 0;
                var oneD = 0;
                var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
                isYears(currentYear);
                if (currentMonth == 0) {
                    var halfM = 0;
                    //一年前的时间
                    oneY = currentYear - 1;
                    oneM = 0;
                    oneD = monthTime(oneM, currentDate);

                } else {
                    //一年前的时间
                    oneY = currentYear - 1;
                    oneM = 12 + (currentMonth - 12);
                    isYears(halfM);
                    oneD = monthTime(oneM, currentDate)
                }
                function isYears(years) {
                    if (years % 4 == 0 && years % 100 != 0 || years % 400 == 0) {
                        daysInMonth[2] = 29;
                    }
                }
                function monthTime(a, b) {
                    if (daysInMonth[a] < b) {
                        lastDate = daysInMonth[a]
                    } else {
                        lastDate = b;
                    }
                    return lastDate;
                }

                //一年前的时间
                var oneTime = oneY + "-" + this.p(oneM) + "-" + this.p(oneD)
                var nowTime = Format(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')
                var nowTimelast = nowTime.split(' ')[1]
                var lastYear = oneTime + ' ' + nowTimelast
                return lastYear;
            },
            //#endregion 初始化 end
            //#region tab监听 start
            tabMonitor: function () {
                var _this = this
                element.on('tab(smtCancelOrder_tab)', function (data) {
                    if (data.index == 0) {
                        _this.tabValue = 1
                        _this.tableRender()
                    } else if (data.index == 1) {
                        _this.tabValue = 2
                        _this.tableRender()

                    } else if (data.index == 2) {
                        _this.tabValue = null
                        _this.tableRender()

                    }
                });
            },
            //#endregion tab监听 end
            //#region 搜索 start
            search: function () {
                var _this = this
                $("#smtCancelOrder_search_submit").click(function () {
                    _this.tableRender()
                })
            },
            tableRender: function () {
                var _this = this
                table.render({
                    elem: '#smtCancelOrder_table',
                    where: _this.searchData(),
                    url: ctx + '/cancelOrder/queryList',
                    page: true, //开启分页
                    cols: _this.cols(),
                    id: 'smtCancelOrder_table_id',
                    limits: [20, 50, 100],
                    limit: 20,
                    created: function (res) {
                        if (res.code == "0000") {
                            res.data = res.data.list.map(item => ({
                                ...item,
                                handleResult: !!item.handleResult ? item.handleResult.slice(0, 50) : ''
                            }))
                        }
                    },
                    done: function (res, curr, count) {
                        if (_this.tabValue == 1) {
                            $('#smtCancelOrder_listNum_will').find('span').html(count)
                        } else if (_this.tabValue == 2) {
                            $('#smtCancelOrder_listNum_done').find('span').html(count)
                        } else if (_this.tabValue == null) {
                            $('#smtCancelOrder_listNum_all').find('span').html(count)
                        }

                        _this.tableMonitor()
                    }
                });
            },
            searchData: function () {
                var data = serializeObject($("#smtCancelOrder_search_form"))
                // 默认值
                data.type = 'customservicer'
                data.roleNames = 'smt客服专员'

                if (data.payTime) {
                    data.payTimeStart = data.payTime.split(' - ')[0]
                    data.payTimeEnd = data.payTime.split(' - ')[1]
                }

                data.handleStatus = this.tabValue

                delete data.payTime

                return data
            },
            tableMonitor: function () {
                var _this = this
                table.on('tool(smtCancelOrder_table)', function (obj) {
                    var ids = [].concat(obj.data).map(item => item.id).join()
                    switch (obj.event) {
                        case 'agree':
                            _this.agree(ids, false)
                            break;
                        case 'refuse':
                            _this.refuse(ids, false)
                            break;
                        default:
                            break;
                    }
                })
            },
            // 批量 同意
            batchAgree: function () {
                var _this = this
                $('#smtCancelOrder_batch_agree').click(function () {
                    commonTableCksSelected("smtCancelOrder_table_id")
                        .then(data => {
                            var _arr = data.filter(item => item.handleStatus != 2)
                            if (!_arr.length) return layer.msg('请选择未处理数据', { icon: 2 })
                            var ids = _arr.map(item => item.id).join()
                            _this.agree(ids, true)
                        })
                        .catch(err => layer.msg(err, { icon: 2 }))
                })
            },
            // 批量 拒绝
            batchRefuse: function () {
                var _this = this
                $('#smtCancelOrder_batch_refuse').click(function () {
                    commonTableCksSelected("smtCancelOrder_table_id")
                        .then(data => {
                            var _arr = data.filter(item => item.handleStatus != 2)
                            if (!_arr.length) return layer.msg('请选择未处理数据', { icon: 2 })
                            var ids = _arr.map(item => item.id).join()
                            _this.refuse(ids, true)
                        })
                        .catch(err => layer.msg(err, { icon: 2 }))
                })
            },
            // 批量复制单号
            batchCopyOrderIds: function () {
                var _this = this
                $('#smtCancelOrder_batch_copy').click(function () {
                    commonTableCksSelected("smtCancelOrder_table_id")
                        .then(data => {
                            _this.copy(data)
                        })
                        .catch(err => layer.msg(err, { icon: 2 }))
                })
            },
            cols: function () {
                var epeanCols = [[
                    { type: 'checkbox' },
                    { field: 'orderId', title: '店铺单号' },
                    { field: 'storeAcct', title: '店铺' },
                    { field: 'customServicer', title: '客服' },
                    { field: 'orderAmount', title: '订单金额($)' },
                    { field: 'cancelRequestReason', title: '买家发起取消原因' },
                    { field: 'gmtPayTime', title: '订单支付时间', templet: `<div>{{Format(d.gmtPayTime,'yyyy-MM-dd hh:mm:ss')}}</div>` },
                    { field: 'processStatusStr', title: 'OA订单状态' },
                    { field: 'handleResult', title: '处理结果', },
                    { title: '操作', align: 'center', style: "vertical-align: top;", toolbar: '#smtCancelOrder_table_toolbar', width: 100 }
                ]]
                return  epeanCols
            },
            agree: function (arr, isBatch) {
                var _this = this
                layer.open({
                    title: `${isBatch ? '批量' : ''}同意`,
                    type: 1,
                    id: "smtCancelOrder_agreeId",
                    area: '300px',
                    btn: [isBatch ? '批量同意' : '同意', '关闭'],
                    content: '',
                    success: function (layero) {
                        laytpl($("#smtCancelOrder_agree_linkage").html()).render({ isBatch }, function (html) {
                            layero.find('.layui-layer-content').html(html)
                        })
                    },
                    yes: function (index, layero) {
                        console.log('arr :>> ', arr);
                        _this.agreeAjax(arr)
                            .then(() => {
                                layer.msg('处理成功，请重新搜索后查看处理结果。', { icon: 1 })
                                layer.close(index)
                            })
                            .catch(err => layer.msg(err, { icon: 2 }))
                    }
                })

            },
            refuse: function (arr, isBatch) {
                var _this = this
                layer.open({
                    title: `${isBatch ? '批量' : ''}拒绝`,
                    type: 1,
                    id: "smtCancelOrder_refuseId",
                    area: '400px',
                    btn: [isBatch ? '批量拒绝' : '拒绝', '关闭'],
                    content: $("#smtCancelOrder_refuse_linkage").html(),
                    success: function (layero) {
                        laytpl($("#smtCancelOrder_refuse_linkage").html()).render(isBatch, function (html) {
                            layero.find('.layui-layer-content').html(html)
                        })
                    },
                    yes: function (index, layero) {
                        var formData = serializeObject($("#smtCancelOrder_refuse_form"))
                        if (formData.refuseReason == '') {
                            _this.saveVerifyParamsByBorder("#smtCancelOrder_refuse_form", 'smtCancelOrder_refuse_form_refuseReason',)
                            return layer.msg('请填写拒绝理由')
                        }
                        _this.refuseAjax(arr, formData.refuseReason)
                            .then(() => {
                                layer.msg('批量处理成功，请重新搜索后查看处理结果。', { icon: 1 })
                                layer.close(index)
                            })
                            .catch(err => layer.msg(err, { icon: 2 }))
                    }
                })
            },
            copy: function (arr) {
                var orderIds = arr.map(item => item.orderId).join()
                console.log('orderIds :>> ', orderIds);
                var oInput = document.createElement('input'); //创建一个input元素
                oInput.value = orderIds;
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                document.body.removeChild(oInput)
                layer.msg('复制成功');
                return false;

            },
            // 同意接口
            agreeAjax: function (ids) {
                console.log('object :>> ', { ids: ids });
                return commonReturnPromise({
                    url: ctx + '/cancelOrder/acceptCancelOrder',
                    type: 'post',
                    params: { ids: ids }
                })
            },
            // 拒绝接口
            refuseAjax: function (ids, cancelReason) {
                console.log('12 :>> ', { ids: ids, cancelReason });
                return commonReturnPromise({
                    url: ctx + '/cancelOrder/refuseCancelOrder',
                    type: 'post',
                    params: { ids: ids, cancelReason }
                })
            },
            // 验证标红
            saveVerifyParams: function (formDom, domHtml, domName) {
                $(formDom + domHtml + '[name=' + domName + ']').addClass('layui-form-danger').focus();
                setTimeout(function () {
                    $(formDom + domHtml + '[name=' + domName + ']').removeClass('layui-form-danger')
                }, 1500);
            },
            // 验证标红 by border
            saveVerifyParamsByBorder: function (formDom, className) {
                $(formDom).find(`.${className}`).css('border', '1px solid red');
                setTimeout(function () {
                    $(formDom).find(`.${className}`).css('border', '');
                }, 1500);
            },
        }
        // 初始化
        smtCancelOrderName.init()
        // 
        smtCancelOrderName.search()

        smtCancelOrderName.tabMonitor()
        //批量同意
        smtCancelOrderName.batchAgree()
        // 批量复制单号
        smtCancelOrderName.batchCopyOrderIds()
        // 批量拒绝
        smtCancelOrderName.batchRefuse()
    })
})(jQuery, layui, window, document);