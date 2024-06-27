var timer = null
layui.use(['form', 'layer', 'formSelects', 'table', 'laypage', 'laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        $ = layui.$;
    form.render();
    render_hp_orgs_users("#ebaypromotionForm"); //渲染部门销售员店铺三级联动

    // getDepartAndSelByRole('ebay专员');
    getListStore({ roleNames: 'ebay专员', orgId: '', salePersonId: '', platCode: 'ebay' })
    getSiteList('ebay')
    laydate.render({
        elem: '#ebaypromotionStartTime',
        type: 'date',
        range: true
    });

    laydate.render({
        elem: '#ebaypromotionEndTime',
        type: 'date',
        range: true
    });

    // //根据角色请求获取部门和销售人员
    // function getDepartAndSelByRole(role) {
    //     initAjax('/sys/getPersonAndOrgsByRole.html', 'POST', { roleNames: role }, function(returnData) {
    //         appendSelect('ebaypromotionForm', 'orgTree', returnData.data.orgTree);
    //         appendSelect('ebaypromotionForm', 'userList', returnData.data.userList, 'id', 'user_name')
    //         form.render('select');
    //     }, 'application/x-www-form-urlencoded')
    // }
    // //监听部门下拉框选择
    // form.on('select(orgTree)', function(data) {
    //     var salePersonId = $('#userList').val()
    //     getListStore({ roleNames: 'ebay专员', orgId: data.value, salePersonId: salePersonId, platCode: 'ebay' })
    // });
    // //监听销售员下拉选择
    // form.on('select(userList)', function(data) {
    //     var orgId = $('#orgTree').val()
    //     getListStore({ roleNames: 'ebay专员', orgId: orgId, salePersonId: data.value, platCode: 'ebay' })
    // });

    //根据根据角色请求获取店铺列表
    function getListStore(data, func) {
        initAjax('/sys/liststore.html', 'POST', data, function(returnData) {
            if (func) {
                func(returnData)
            } else {
                appendSelect('ebaypromotionForm', 'storeAcct', returnData.data, 'id', 'storeAcct')
                form.render('select');
            }
        }, 'application/x-www-form-urlencoded');
    }

    //根据平台获取站点列表和促销状态
    function getSiteList(platCode) {
        initAjax('/ebayDiscount/getPromotionStatusList.html', 'POST', { platCode: platCode }, function(returnData) {
            appendSelect('ebaypromotionForm', 'promotionStatus', returnData.data.promotionSaleStatusList, 'pormotionStatus', 'pormotionStatusName');
            form.render('select')
        })
    }

    //店铺同步
    function asyncStore(storeId) {
        initAjax('/ebayDiscount/syncEbayDiscount.html', 'POST', { storeAcctId: storeId }, function(returnData) {
            layer.msg(returnData.data)
            clearprocess();
        }, 'application/x-www-form-urlencoded');
    }

    //新增促销
    function newPromotion(data, func) {
        var { discountType, discountValue, promotionEndTime, promotionSaleName, promotionSaleType, promotionStartTime, storeAcctId } = data
        var submitdata = { discountType, discountValue, promotionEndTime, promotionSaleName, promotionSaleType, promotionStartTime, storeAcctId }
        initAjax('/ebayDiscount/savePromotion.html', 'POST', submitdata, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //编辑促销
    function editPromotion(data, func) {
        var { id, discountType, discountValue, promotionEndTime, promotionSaleName, promotionSaleType, promotionStartTime, storeAcctId } = data
        var submitdata = { discountType, discountValue, promotionEndTime, promotionSaleName, promotionSaleType, promotionStartTime, storeAcctId, id }
        initAjax('/ebayDiscount/updatePromotion.html', 'POST', submitdata, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //删除促销
    function deletePromotion(id, func) {
        loading.show()
        initAjax('/ebayDiscount/deletePromotion.html', 'POST', { id: id }, function(returnData) {
            loading.hide()
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //填充下拉框
    function appendSelect(pre, dom, data, id, name) {
        $('#' + pre + ' #' + dom + '').empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            data[i].id = data[i].id || data[i][id];
            data[i].name = data[i].name || data[i][name];
            option += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
        }
        $('#' + pre + ' #' + dom + '').append(option)
    }
    //封装ajax请求
    function initAjax(url, method, data, func, contentType) { //初始化ajax请求
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    if (timer) {
                        clearprocess();
                    }
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
            }
        })
    }

    form.on('submit(ebayPromotionSearch)', function(data) {
        if (data.field.startTime) {
            data.field.startTimeLeft = data.field.startTime.split(' - ')[0] + ' 00:00:00';
            data.field.startTimeRight = data.field.startTime.split(' - ')[1] + ' 23:59:59';
        }
        if (data.field.endTime) {
            data.field.endTimeLeft = data.field.endTime.split(' - ')[0] + ' 00:00:00';
            data.field.endTimeRight = data.field.endTime.split(' - ')[1] + ' 23:59:59';
        }
        ebaypromotionTable(data.field)
    });

    //渲染表格
    function ebaypromotionTable(data) {
        table.render({
            elem: '#ebaypromotionTable',
            method: 'get',
            url: ctx + '/ebayDiscount/searchPromotion.html',
            where: data,
            cols: [
                [ //表头
                    { checkbox: true, width: 30 },
                    { title: "名称", field: "promotionSaleName" },
                    { title: "店铺", field: "storeAcctName" },
                    { title: "开始时间", field: "promotionStartTime", templet: '<div>{{Format(d.promotionStartTime,"yyyy-MM-dd hh:mm:ss")}}</div>' },
                    { title: "结束时间", field: "promotionEndTime", templet: '<div>{{Format(d.promotionEndTime,"yyyy-MM-dd hh:mm:ss")}}</div>' },
                    { title: "优惠/降价", field: "discountType", templet: '<div>{{formateDiscount(d.discountType,d.discountValue)}}</div>' },
                    { title: "促销类型", field: "promotionSaleType", templet: '<div>{{formatePromotion(d.promotionSaleType)}}</div>' },
                    { title: "状态", field: "pormotionStatus", templet: '' },
                    { title: '操作', toolbar: '<div><button class="layui-btn layui-btn-xs" lay-event="epm_edit">修改</button><button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="epm_delete">删除</button></div>' }
                ]
            ],
            page: true,
            id: "ebaypromotionTable",
            limits: [50, 100, 300],
            limit: 50,
            done: function(data) {}
        })
    }

    $('#new_promotion').click(function() {
        pop_promotion()
    })

    $('#asyncStore').click(function() {
        var storeId = $('#ebaypromotionForm #storeAcct').val();
        if (storeId !== "") {
            asyncStore(storeId)
            process();
        } else {
            layer.msg('请先选择要同步的店铺')
        }
    })

    form.verify({
        ifChecked: function(value, item) { //value：表单的值、item：表单的DOM对象
            var promotionSaleType = $('#layersubmitform').val();
            if ($(item).siblings('.layui-form-radio').hasClass('layui-form-radioed') && value === "" && promotionSaleType !== "FreeShippingOnly") {
                return '勾选项必填'
            }
        }
    });

    //监听表格工具栏
    table.on('tool(ebaypromotionTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event;
        if (layEvent === 'epm_edit') { //编辑对应的普源id
            pop_promotion('edit', data)
        } else if (layEvent === 'epm_delete') {
            layer.confirm('确定删除这条促销?', function(index) {
                deletePromotion(data.id, function(returnData) {
                    layer.msg(returnData.msg);
                    var submitdata = serializeObject($('#ebaypromotionForm'))
                    ebaypromotionTable(submitdata)
                    layer.close(index);
                })
            });
        }
    });

    var poptitle = { 'edit': '修改促销' }

    //新增/修改弹框
    function pop_promotion(type, data) {
        layer.open({
            type: 1,
            title: poptitle[type] || '新增促销',
            btn: ['保存', '关闭'],
            area: ['50%', '70%'],
            content: $('#pop_ebay_promotion').html(),
            success: function(layero, index) {
                getListStore({ roleNames: 'ebay专员', orgId: '', salePersonId: '', platCode: 'ebay' }, function(returnData) {
                    appendSelect('layerForm', 'layer_store', returnData.data, 'id', 'storeAcct');
                    if (data) {
                        data.discountType === "Percentage" ? data.discountValue1 = data.discountValue : data.discountValue2 = data.discountValue;
                        data.promotionEndTime = Format(data.promotionEndTime, "yyyy-MM-dd hh:mm:ss")
                        data.promotionStartTime = Format(data.promotionStartTime, "yyyy-MM-dd hh:mm:ss")
                        $('#layer_store').attr('disabled', true)
                        $('#layersubmitform').val(data.promotionSaleType)
                        data.promotionSaleType === 'FreeShippingOnly' ? $('.promotionSaleTypeRow').addClass('hide') : $('.promotionSaleTypeRow').removeClass('hide')
                        form.val('layerForm', data || {})
                    }
                    form.render('select')
                })
                form.render();
                laydate.render({
                    elem: '#layer_startTime',
                    type: 'datetime',
                });

                laydate.render({
                    elem: '#layer_endTime',
                    type: 'datetime',
                });
                form.on('radio(discountType)', function(data) {
                    $(data.elem).parent('.radiorow').siblings('.radiorow').find('input[type="text"]').val("");
                });
                form.on('radio(promotionSaleType)', function(data) {
                    $('#layersubmitform').val(data.value)
                    if (data.value === 'FreeShippingOnly') {
                        $(data.elem).parents('.layui-form-item').next('.layui-form-item').addClass('hide');
                    } else {
                        $(data.elem).parents('.layui-form-item').next('.layui-form-item').removeClass('hide');
                    }
                });
            },
            yes: function(index, layero) {
                setTimeout(function() {
                    $(layero).find('#layersubmitform').click();
                    form.render()
                }, 0)
                form.on('submit(layersubmitform)', function(formdata) {
                    formdata.field.discountValue = formdata.field.discountType === "Percentage" ? formdata.field.discountValue1 : formdata.field.discountValue2
                        // formdata.field.promotionStartTime = formdata.field.promotionStartTime ? formdata.field.promotionStartTime + ' 00:00:00' : ""
                        // formdata.field.promotionEndTime = formdata.field.promotionEndTime ? formdata.field.promotionEndTime + ' 23:59:59' : ""
                    if (type === "edit") {
                        formdata.field.id = data.id
                        editPromotion(formdata.field, function(returnData) {
                            layer.msg(returnData.msg);
                            if (returnData.code = "0000") {
                                var submitdata = serializeObject($('#ebaypromotionForm'))
                                ebaypromotionTable(submitdata)
                                layer.close(index);
                            }
                        })
                    } else {
                        newPromotion(formdata.field, function(returnData) {
                            layer.msg(returnData.msg);
                            if (returnData.code = "0000") {
                                var submitdata = serializeObject($('#ebaypromotionForm'))
                                ebaypromotionTable(submitdata)
                                layer.close(index);
                            }
                        })
                    }
                });
            }
        })
    }

    function process() {
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: '同步进度',
            area: ['50%', '200px'],
            content: '<div class="m20"><div class="layui-progress layui-progress-big" lay-filter="demo" lay-showpercent="true"><div class="layui-progress-bar" lay-percent="0%"><span class="layui-progress-text">0%</span></div></div></div>',
            success: function() {
                var pro = 0;
                timer = setInterval(function() {
                    pro += 1;
                    if (pro < 97) {
                        $('.layui-progress-text').text(pro > 100 ? 100 + '%' : pro + '%');
                        layui.element.progress('demo', pro + '%');
                    }
                }, 1000);
            }
        });
    }

    function clearprocess() {
        layui.element.progress('demo', '100%');
        setTimeout(function() {
            clearInterval(timer);
            layer.closeAll();
        }, 1000);
    }
});

//格式化促销类型
function formatePromotion(str) {
    var obj = { 'PriceDiscountOnly': '价格优惠', 'FreeShippingOnly': '免第一运费', 'PriceDiscountAndFreeShipping': '价格优惠且免第一运费' }
    return obj[str]
}

//格式化优惠/降价
function formateDiscount(str, discount) {
    if (discount) {
        return str === 'Percentage' ? '在原价上优惠:' + discount + '%' : '在原价上降价:' + discount
    } else {
        return ''
    }
}