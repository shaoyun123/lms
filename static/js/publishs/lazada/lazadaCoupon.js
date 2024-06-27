layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laytpl = layui.laytpl,
        laydate = layui.laydate;

    form.render()
    formSelects.render()
    laydate.render({
        elem: '#lazadaCouponEndTime',
        range: true
        , type: 'datetime'
    });

    //渲染部门销售员店铺三级联动
    render_hp_orgs_users("#lazadaCouponSearchForm");

    //lazada站点初始化渲染
    getDataLazadaCouponGetAllSite().then(function (result) {
        commonRenderSelect("lazadaCouponSiteIdList", result, {
            name: 'name',
            code: 'code'
        }).then(()=>formSelects.render("lazadaCouponSiteIdList"))
    }).catch(function (err) {
        layer.msg(err, {icon: 2});
    })

    // 清空查询条件
    $("#lazadaCouponReset").click(() => {
        $("#lazadaCouponSearchForm")[0].reset();
    })

    // 查询
    $("#lazadaCouponSearch").click(() => {
        lazadaCouponTableRender()
    })

    //时间大小比对
    // date1>date2返回false
    function lazadaCouponCheckDate(date1, date2) {
        let oDate1 = new Date(date1);
        let oDate2 = new Date(date2);
        return oDate1.getTime() >= oDate2.getTime()
    }

    // 获取天数差
    function lazadaCouponGetDays(date1, date2) {
        let oDate1 = new Date(date1);
        let oDate2 = new Date(date2);
        let getd = (oDate2.getTime() - oDate1.getTime()) / (3600 * 24 * 1000);
        return Math.abs(getd);
    }

    // 获取分钟数差
    function lazadaCouponGetMins(date1, date2) {
        let oDate1 = new Date(date1);
        let oDate2 = new Date(date2);
        let getd = (oDate2.getTime() - oDate1.getTime()) / (60 * 1000);
        return Math.abs(getd);
    }

    function lazadaCouponTableRender() {
        let searchData = serializeObject($('#lazadaCouponSearchForm'));

        if (searchData.lazadaCouponEndTime) {
            searchData.leftPeriodEndTime = searchData.lazadaCouponEndTime.split(" - ")[0]
            searchData.rightPeriodEndTime = searchData.lazadaCouponEndTime.split(" - ")[1]
        }

        table.render({
            elem: '#lazadaCouponTable',
            method: 'GET',
            url: '/lms/lazada/voucher/pageQuery',
            where: searchData,
            cols: [[ //表头
                {type: "checkbox", width: 25, style: "vertical-align: top;"},
                {
                    title: "店铺", field: 'id', templet: function (d) {
                        return `
                    <div>${d.sysSalesPlatAcct.storeAcct}</div><div>${d.sysSalesPlatAcct.salesperson}</div>
                `
                    }
                },
                {
                    title: "优惠券名称", field: '', templet: function (d) {
                        return `<div>${d.voucherName}</div><div>${d.voucherId}</div>`
                    }
                },
                {
                    title: "活动时间", templet: function (d) {
                        return `
                    <span>从：${Format(d.periodStartTime || "", 'yyyy-MM-dd hh:mm:ss')}</span><br>
                    <span>到：${Format(d.periodEndTime || "", 'yyyy-MM-dd hh:mm:ss')}</span>
                `
                    }
                },
                {title: "适用范围", width: 90, templet: '<div>{{d.apply == "ENTIRE_SHOP"?"全店商品":"部分商品"}}</div>'},
                {
                    title: "优惠券展示区域", width: 110, templet: function (d) {
                        return `
                    <div>${d.displayArea == "REGULAR_CHANNEL" ? "常规页面" : ""}</div>
                    <div>${d.displayArea == "STORE_FOLLOWER" ? "店铺粉丝" : ""}</div>
                    <div>${d.displayArea == "OFFLINE" ? "线下" : ""}</div>
                    <div>${d.displayArea == "LIVE_STREAM" ? "直播间" : ""}</div>
                    <div>${d.displayArea == "SHARE_VOUCHER" ? "裂变红包券" : ""}</div>
                     `
                    }
                },
                {
                    title: "已领取", width: 90, templet: function (d) {
                        return `<span>${d.orderUsedBudget || 0}</span> / <span> ${d.issued || ""}</span>`
                    }
                },
                {
                    title: "优惠详情", field: '', templet: function (d) {
                        if (d.voucherDiscountType == "MONEY_VALUE_OFF") { // 满减
                            return `
                    <span>优惠：${d.currency}${d.offeringMoneyValueOff}</span><br>
                    <span>当订单金额 ≥ ：${d.currency}${d.criteriaOverMoney}</span>
                `
                        } else if (d.voucherDiscountType == "PERCENTAGE_DISCOUNT_OFF") {  // 折扣
                            return `
                    <span>优惠比例：${d.offeringPercentageDiscountOff}%</span><br>
                    <span>当订单金额 ≥ ：${d.currency}${d.criteriaOverMoney}</span>
                `
                        }
                    }
                },
                {
                    title: "优惠券状态", width: 90, templet: function (d) {
                        return `
                    <div>${d.voucherStatus == "NOT_START" ? "未开始" : ""}</div>
                    <div>${d.voucherStatus == "ONGOING" ? "进行中" : ""}</div>
                    <div>${d.voucherStatus == "SUSPEND" ? "暂停中" : ""}</div>
                    <div>${d.voucherStatus == "FINISH" ? "已过期" : ""}</div>
                `
                    }
                },
                {
                    title: "操作人", field: '', templet: function (d) {
                        return `<div>创建人：${d.creator||''}</div>
                    <div>修改人：${d.modifier||''}</div>`
                    }
                },
                {
                    title: "操作时间", width: 240, templet: function (d) {
                        return `<div>创建时间：${d.createTime?Format(d.createTime,"yyyy-MM-dd hh:mm:ss"):''}</div>
                    <div>修改时间：${d.modifyTime?Format(d.modifyTime,"yyyy-MM-dd hh:mm:ss"):''}</div>`
                    }
                },
                {title: "活动类型", field: 'activityType', templet: '<div>{{d.activityType == 1?"单次活动":"连续活动"}}</div>'},
                {
                    title: '操作',
                    width: 90,
                    align: 'center',
                    style: "vertical-align: top;",
                    toolbar: '#lazadaCouponOperateTpl'
                }
            ]],
            page: true,
            id: "lazadaCouponTable",
            limits: [50, 100, 300, 500, 700],
            limit: 50
        })
    }

    table.on('tool(lazadaCouponTable)', function (obj) {
        let data = obj.data;

        if (obj.event == 'edit') { // 编辑
            lazadaCouponCreatOrEdit(1, data)
        } else if (obj.event == "modify") { // 修改类型
            let popIndex = layer.open({
                title: "修改活动类型",
                type: 1,
                area: ['600px', '200px'],
                btn: ['保存', '关闭'],
                id: Date.now(),
                content: $('#lazadaCouponLayerModify').html(),
                success: function () {
                    laytpl($("#lazadaCouponLayerModifyDemo").html()).render(data, function (html) {
                        $("#lazadaCouponLayerModifyView").html(html)
                    });
                    form.render()
                },
                yes: function (index, layero) {
                    let formData = serializeObject($("#lazadaCouponLayerModifyForm"))

                    getDataLazadaCouponUpdateActivity(formData.id, formData.activityType).then(function (res) {
                        layer.close(popIndex)
                        lazadaCouponTableRender()
                        layer.msg(res || "修改成功", {icon: 1});
                    }).catch(function (err) {
                        layer.msg(err, {icon: 2});
                    })
                }
            })
        } else if (obj.event == 'on') { // 开启
            lazadaCouponOnOrOffFunc("on", data.id)
        } else if (obj.event == 'off') { // 暂停
            lazadaCouponOnOrOffFunc("off", data.id)
        }
    })

    // 创建优惠券
    $("#lazadaCouponCreatTemplate").click(function () {
        lazadaCouponCreatOrEdit(0, {})
    })

    // type: 0新建1编辑
    // obj: 优惠券信息，为空时代表是新建优惠券
    // voucherStatus ： 优惠券状态 <%--未开始NOT_START--%><%--进行中ONGOING--%><%--暂停中SUSPEND--%><%--已过期FINISH--%>
    function lazadaCouponCreatOrEdit(type, obj) {
        if (type == 1) {
            obj.periodTime = Format(obj.periodStartTime || "", 'yyyy-MM-dd hh:mm:ss') + ' - ' + Format(obj.periodEndTime || "", 'yyyy-MM-dd hh:mm:ss') // 优惠券使用时间
            obj.collectStart = Format(obj.collectStart || "", 'yyyy-MM-dd hh:mm:ss') // 领取开始时间
            obj.lazadaVoucherDisplayAreaEnum = obj.displayArea  // 优惠券展示区域
            obj.ladaVoucherDiscountTypeEnum = obj.voucherDiscountType // 优惠类型
            obj.lazadaVoucherStatusEnum = obj.apply // 适用范围
        }
        // 未开始的活动：不允许编辑领取开始时间和优惠适用范围，其他字段可以更改。
        // 进行中的活动：只允许修改优惠券发放数量，且新的值要比旧值大。
        // 暂停中，已过期的活动：不允许修改。
        let popIndex = layer.open({
            title: type == 0 ? "创建优惠券" : "编辑优惠券",
            type: 1,
            area: ['700px', '700px'],
            btn: obj.voucherStatus == "SUSPEND" || obj.voucherStatus == "FINISH" ? ['关闭'] : ['保存','关闭'],
            id: Date.now(),
            content: $('#lazadaCouponLayerCreatAndEdit').html(),
            success: function () {
                // 获取所有站点
                Promise.all([getDataLazadaCouponLazadaAllSite()]).then(function (result) {
                    laytpl($("#lazadaCouponDemo").html()).render(obj, function (html) {
                        $("#lazadaCouponView").html(html)
                    });

                    if (type == 1) {
                        $("#lazadaCouponCurrency").val(obj.currency) // 币种单位
                        let RadioDemoObj = {  // 优惠类型数据
                            ladaVoucherDiscountTypeEnum: obj.ladaVoucherDiscountTypeEnum || '',
                            currency: obj.currency,
                            criteriaOverMoney: obj.criteriaOverMoney,
                            offeringMoneyValueOff: obj.offeringMoneyValueOff,
                            offeringPercentageDiscountOff: obj.offeringPercentageDiscountOff,
                            maxDiscountOfferingMoneyValue: obj.maxDiscountOfferingMoneyValue,
                            voucherStatus: obj.voucherStatus
                        }
                        laytpl($(`#lazadaCouponRadioDemo`).html()).render(RadioDemoObj, function (html) {
                            $('#lazadaCouponRadioView').html(html);
                        });
                    }
                    //日期时间选择器
                    laydate.render({
                        elem: '#lazadaCouponCollectStart'
                        , type: 'datetime'
                    });

                    //日期时间范围
                    laydate.render({
                        elem: '#lazadaCouponPeriodTime'
                        , type: 'datetime'
                        , range: true
                    });

                    // 因为在option中新增了一个currency币种的属性，所以没有使用封装好的select方法渲染
                    var lazadaCouponSalesSite = $("#lazadaCouponSalesSite");
                    lazadaCouponSalesSite.html(`<option></option>`)
                    $(result[0]).each(function () {
                        lazadaCouponSalesSite.append(`<option value='${this.salesSite}' currency='${this.currency}'>${this.name}</option>`);
                    });

                    ladaVoucherRadioChange()
                    // formSelects.render("lazadaCouponDemoForm");
                    form.render()

                }).catch(function (err) {
                    layer.msg(err, {icon: 2})
                })
            },
            btn1: obj.voucherStatus == "SUSPEND" || obj.voucherStatus == "FINISH" ? '' : function (index, layero) {
                let formData = serializeObject($("#lazadaCouponDemoForm"))

                // 进行中,只允许修改优惠券发放数量，且新的值要比旧值大
                if (obj.voucherStatus == "ONGOING") {
                    if (formData.issued < obj.issued) {
                        layer.msg("优惠券发放数量须比修改前大", {icon: 2});
                        return false
                    }
                }else{
                    let flag = checkFormData();
                    if (flag == 0) return false;
                }

                if (formData.id == '') delete formData.id;
                if (formData.periodTime) {
                    formData.periodStartTime = new Date(formData.periodTime.split(" - ")[0])
                    formData.periodEndTime = new Date(formData.periodTime.split(" - ")[1])
                }
                formData.collectStart == '' ? '' : formData.collectStart = new Date(formData.collectStart)

                if (type == 0) {
                    formData.storeIdList == '' ? formData.storeIdList = [] : formData.storeIdList = formData.storeIdList.split(",")
                    // 批量创建优惠券
                    getDataLazadaCouponBatchCreate(formData).then(function (res) {
                        layer.msg(res || "保存成功", {icon: 1});
                        layer.close(popIndex)
                        lazadaCouponTableRender()
                    }).catch(function (err) {
                        layer.msg(err || "error", {icon: 2});
                    })
                } else {
                    // 编辑单个优惠券
                    getDataLazadaCouponUpdateSingle(formData).then(function (res) {
                        layer.msg(res || "保存成功", {icon: 1});
                        layer.close(popIndex)
                        lazadaCouponTableRender()
                    }).catch(function (err) {
                        layer.msg(err, {icon: 2});
                    })
                }
                return false;
            }
        })
    }

    // 验证必填项信息
    function checkFormData() {
        let obj = serializeObject($('#lazadaCouponDemoForm')),
            err = '';

        for (let key in obj) {
            if (((key != "collectStart" && key != 'maxDiscountOfferingMoneyValue' && key != 'id') && obj[key] == '') || obj.lazadaVoucherDisplayAreaEnum == undefined || obj.ladaVoucherDiscountTypeEnum == undefined || obj.lazadaVoucherApplyEnum == undefined) {
                err = '必填项不能为空';
            }
        }

        let nowDate = Format(new Date(), 'yyyy-MM-dd hh:mm:ss'), // 当前时间
            collectStart = obj.collectStart, // 优惠券领取时间
            periodStartTime, // 优惠券使用开始时间
            periodEndTime;  // 优惠券使用结束时间
        if (obj.periodTime) {
            periodStartTime = obj.periodTime.split(" - ")[0]
            periodEndTime = obj.periodTime.split(" - ")[1]
        }

        if (lazadaCouponCheckDate(periodEndTime,periodStartTime) == false) err = '优惠券领取结束时间不能小于等于开始时间';
        if (lazadaCouponGetDays(periodStartTime, periodEndTime) > 180) err = '开始和结束时间不能超过180天';
        if (lazadaCouponGetMins(periodStartTime, periodEndTime) < 10) err = '开始和结束时间间隔要超过10分钟';
        if (lazadaCouponCheckDate(periodEndTime,collectStart) == false) err = '优惠券使用开始时间不能晚于优惠券结束时间';
        if (lazadaCouponCheckDate(collectStart,nowDate) == false) err = '优惠券领取时间不能早于当前时间';
        if (lazadaCouponCheckDate(periodStartTime,nowDate) == false) err = '优惠券使用时间不能早于当前时间';
        if (err) {
            layer.alert(err, {
                icon: 2
            });
            return 0;
        }
        return 1;
    }

    // 批量启用or停用
    form.on(`select(lazadaCouponBatchOnOrOff)`, function (data) {
        let checkedDataId = table.checkStatus('lazadaCouponTable').data.map(item => item.id); //获取选中的数据
        let checkedStatus = data.value; // on off

        if (checkedDataId.length <= 0) {
            return layer.alert("请选择需要修改的数据", {icon: 7})
        }

        lazadaCouponOnOrOffFunc(checkedStatus, checkedDataId)
    })

    function lazadaCouponOnOrOffFunc(type, ids) {
        getDataLazadaCouponBatchOnOrOff(type, ids).then(function (res) {
            if (res.code == '0000') {
                layer.alert("操作成功", {icon: 1});
            }else if(res.code == '5555'){
                layer.alert(res.extra.error, {icon: 7});
            }
            lazadaCouponTableRender()
        }).catch(function (err) {
            layer.msg(err, {icon: 2});
        })
    }

    // 站点--店铺--币种 联动
    form.on(`select(lazadaCouponSalesSite)`, function (data) {
        let site = data.value,
            currency = $(data.elem[data.elem.selectedIndex]).attr("currency"); // 单位
        $("#lazadaCouponCurrency").val(currency)  // 币种单位

        if (site == '') return;
        getDataLazadaCouponLazadaStore(site).then(function (result) {
            commonRenderSelect("lazadaCouponStoreIdList", result, {
                name: 'storeAcct',
                code: 'id'
            }).then(()=>formSelects.render("lazadaCouponStoreIdList"))
        }).catch(function (err) {
            layer.msg(err, {icon: 2})
        })

        laytpl($(`#lazadaCouponRadioDemo`).html()).render({
            ladaVoucherDiscountTypeEnum: $("#lazadaCouponDemoForm input[name=ladaVoucherDiscountTypeEnum]:checked").val() || '',
            currency: currency
        }, function (html) {
            $('#lazadaCouponRadioView').html(html);
        });

        form.render()
    })

    // 优惠类型: MONEY_VALUE_OFF满减 \ PERCENTAGE_DISCOUNT_OFF折扣
    function ladaVoucherRadioChange() {
        form.on('radio(ladaVoucherDiscountTypeEnumFilter)', function (data) {
            let radioData = data.value
            laytpl($(`#lazadaCouponRadioDemo`).html()).render({
                ladaVoucherDiscountTypeEnum: radioData,
                currency: $("#lazadaCouponCurrency").val()
            }, function (html) {
                $('#lazadaCouponRadioView').html(html);
            });
        });
    }

    // 获取lazada站点的接口
    function getDataLazadaCouponGetAllSite() {
        return commonReturnPromise({
            url: `/lms/onlineProductLazada/getAllSite.html`,
            type: 'GET',
        })
    }

    /*****
     *  批量启用|停用接口
     *  params{
     *      ids:
     *  }
     * ****/
    function getDataLazadaCouponBatchOnOrOff(type, ids) {
        let url = '';
        if (type == 'on') {
            // 批量启用
            url= `/lms/lazada/voucher/batch/activate/${ids}`
        } else if (type == 'off') {
            url= `/lms/lazada/voucher/batch/deactivate/${ids}`
        }
        return new Promise(function(resolve, reject){
            $.ajax({
                type: 'POST',
                url: url,
                beforeSend: function(){
                    loading.show();
                },
                success: function(res){
                    loading.hide();
                    resolve(res)
                },
                error: function(err){
                    loading.hide();
                    reject(err.error)
                }
            })
        });
    }

    // 修改活动类型
    function getDataLazadaCouponUpdateActivity(id, type) {
        return commonReturnPromise({
            url: `/lms/lazada/voucher/updateActivity/${id}/type/${type}`,
            type: 'POST',
        })
    }

    // 批量创建优惠券
    function getDataLazadaCouponBatchCreate(obj) {
        // return commonReturnPromise({
        //     url: `/lms/lazada/voucher/batchCreate`,
        //     type: 'POST',
        //     contentType: 'application/json;charset=utf-8',
        //     params: JSON.stringify(obj)
        // })
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: `/lms/lazada/voucher/batchCreate`,
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(obj),
                success: function (res) {
                    if (res.code == '0000') {
                        resolve(res.data || res.msg)
                    } else {
                        reject(res.msg || res.extra.error)
                    }
                },
                error: function (err) {
                    reject(err.responseText);
                }
            })
        })
    }

    // 编辑单个优惠券
    function getDataLazadaCouponUpdateSingle(obj) {
        return commonReturnPromise({
            url: `/lms/lazada/voucher/updateSingle`,
            type: 'POST',
            contentType: 'application/json;charset=utf-8',
            params: JSON.stringify(obj)
        })
    }

    // 获取所有lazada站点
    function getDataLazadaCouponLazadaAllSite() {
        return commonReturnPromise({
            url: `/lms/lazada/voucher/get/lazada/site/all`,
            type: 'GET',
        })
    }

    // 根据站点查询出所有店铺和单位
    function getDataLazadaCouponLazadaStore(site) {
        return commonReturnPromise({
            url: `/lms/lazada/voucher/get/lazada/store/site/${site}`,
            type: 'GET',
        })
    }

})