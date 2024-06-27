(function($, layui, window, document, undefined) {
    layui.use(
        [
            "admin",
            "table",
            "form",
            "element",
            "layer",
            "laytpl",
            "formSelects",
            "laydate",
            "selectInput",
        ],
        function() {
            var admin = layui.admin,
                table = layui.table,
                element = layui.element,
                layer = layui.layer,
                laytpl = layui.laytpl,
                laydate = layui.laydate,
                selectInput = layui.selectInput,
                formSelects = layui.formSelects,
                form = layui.form;
            form.render("select");
            var activeregisterName = {
                //搜索条件处理start
                triggerClick: function() {
                    $("[lay-filter=activeregister_filter]").trigger("click");
                },
                //初始化站点
                initSite: function(xmId) {
                    commonReturnPromise({
                            url: "/lms/onlineProductLazada/getAllSite.html",
                        })
                        .then((data) => {
                            var sites = [];
                            data.forEach((element) => {
                                var a = { name: element.name, value: element.code };
                                sites.push(a);
                            });
                            formSelects.data(xmId, "local", { arr: sites });
                            form.render();
                        })
                        .catch((err) => {
                            layer.msg(err.message, { icon: 2 });
                        });
                },
                //渲染时间
                timeRender: function() {
                    laydate.render({
                        elem: "#campaignSceneTimes",
                        type: "date",
                        range: true,
                    });
                },
                //切换tab
                tabHandle: function() {
                    var $hiddenInput = $("#activeregisterForm").find("[name=pageType]");
                    var _this = this;
                    element.on("tab(activeregister_tabs)", function(obj) {
                        var index = obj.index;
                        $("#activeregisterCard")
                            .find("input[type=checkbox]")
                            .prop("checked", false);
                        form.render("checkbox");
                        if (index == 0) {
                            //特殊邀请
                            $hiddenInput.val("InvitedOnline,InvitedOffline");
                            $(".batchHandleClass").addClass("disN");
                            $(".invitedCheckboxs").removeClass("disN");
                            $(".registerCheckboxs").addClass("disN");
                        } else if (index == 1) {
                            //平台活动
                            $hiddenInput.val(
                                "available,RegisteredInProgress,RegisteredComplete,RegisteredOnline,RegisteredOffline"
                            );
                            $(".batchHandleClass").removeClass("disN");
                            $(".invitedCheckboxs").addClass("disN");
                            $(".registerCheckboxs").removeClass("disN");
                        }
                        _this.triggerClick();
                    });
                },
                //监听checkbox选中点击
                checkboxClick: function() {
                    var _this = this;
                    form.on("checkbox(activeregister_checkboxs)", function(data) {
                        var elem = data.elem;
                        var hasInvitedCheckboxs = $(elem)
                            .parent("div")
                            .hasClass("invitedCheckboxs");
                        var checkedInputs = $(elem)
                            .parent("div")
                            .find("input[type=checkbox]:checked");
                        var arr = [];
                        if (checkedInputs.length == 0) {
                            if (hasInvitedCheckboxs) {
                                arr = ["InvitedOnline", "InvitedOffline"];
                            } else {
                                arr = [
                                    "available",
                                    "RegisteredInProgress",
                                    "RegisteredComplete",
                                    "RegisteredOnline",
                                    "RegisteredOffline",
                                ];
                            }
                        } else {
                            for (var i = 0; i < checkedInputs.length; i++) {
                                var item = checkedInputs[i];
                                arr.push($(item).val());
                            }
                        }
                        $("#activeregisterForm").find("[name=pageType]").val(arr.join());
                        _this.triggerClick();
                    });
                },
                //数据处理
                dataHandle: function(data) {
                    if (data.campaignSceneTimes) {
                        var timeArr = data.campaignSceneTimes.split(" - ");
                        data.registerEndTimeAfter = timeArr[0];
                        data.registerEndTimeBefore = timeArr[1];
                    } else {
                        data.registerEndTimeAfter = "";
                        data.registerEndTimeBefore = "";
                    }
                    var checkedDom = $(
                        "#activeregisterForm [name=lmsDealStatus]:checked"
                    );
                    var arr = [];
                    for (var i = 0; i < checkedDom.length; i++) {
                        var item = checkedDom[i];
                        arr.push($(item).val());
                    }
                    // data.storeIds = $('#activeregister_store_sel').find('input').eq(0).val();
                    data.lmsDealStatus = arr.join();
                    delete data.campaignSceneTimes;
                    // delete data.select;
                    return data;
                },
                //表格渲染
                tableRender: function(data) {
                    var _this = this;
                    table.render({
                        elem: "#activeregister_table",
                        id: "activeregister_tableId",
                        method: "POST",
                        where: data,
                        url: "/lms/lazadaCampaign/searchLazadaCampaignList.html",
                        cols: _this.colsHandle(data.pageType),
                        page: true,
                        limit: 300,
                        limits: [300, 500, 1000],
                        done: function() {
                            _this.watchBar();
                        },
                    });
                },
                colsHandle: function(type) {
                    var cols;
                    if (type.indexOf("Invited") > -1) {
                        //特殊邀请
                        cols = [
                            [
                                { type: "checkbox", width: 30 },
                                {
                                    title: "处理状态",
                                    templet: "#activeregister_status",
                                    field: "status",
                                },
                                {
                                    title: "平台状态",
                                    field: "platStatus",
                                    templet: "#activeregister_platStatus",
                                },
                                {
                                    title: "报名截止时间",
                                    field: "sceneTime",
                                    templet: "#activeregister_times",
                                },
                                { title: "店铺", field: "storeAcct" },
                                { title: "销售员", field: "salePerson" },
                                {
                                    title: "市场活动",
                                    field: "campaignName",
                                    templet: "#activeregister_campaignName",
                                },
                                {
                                    title: "修改人",
                                    field: "editPerson",
                                    templet: "#activeregister_editPerson",
                                },
                                {
                                    title: "操作",
                                    field: "handleBar",
                                    templet: "#activeregister_toolbar",
                                    width: 135,
                                },
                            ],
                        ];
                    } else {
                        //平台活动
                        cols = [
                            [
                                { type: "checkbox", width: 30 },
                                {
                                    title: "处理状态",
                                    templet: "#activeregister_status",
                                    field: "status",
                                },
                                {
                                    title: "平台状态",
                                    field: "platStatus",
                                    templet: "#activeregister_platStatus",
                                },
                                {
                                    title: "报名截止时间",
                                    field: "sceneTime",
                                    templet: "#activeregister_times",
                                },
                                { title: "店铺", field: "storeAcct" },
                                { title: "销售员", field: "salePerson" },
                                {
                                    title: "市场活动",
                                    field: "campaignName",
                                    templet: "#activeregister_campaignName",
                                },
                                { title: "已报名卖家", field: "sellerCount" },
                                { title: "折扣", field: "discount" },
                                { title: "最后错误", field: "error" },
                                {
                                    title: "操作",
                                    field: "handleBar",
                                    templet: "#activeregister_toolbar2",
                                    width: 135,
                                },
                            ],
                        ];
                    }
                    return cols;
                },
                watchBar: function() {
                    var _this = this;
                    table.on("tool(activeregister_tableFilter)", function(obj) {
                        var layEvent = obj.event; //获得 lay-event 对应的值
                        var data = obj.data;
                        // console.log(data);
                        if (layEvent == "mark") {
                            layer.confirm(
                                "确定已完成了吗?", { icon: 3, title: "标记已完成" },
                                function(index) {
                                    commonReturnPromise({
                                            url: "/lms/lazadaCampaign/lazadaCampaignBatchUpdate.html",
                                            contentType: "application/json",
                                            type: "post",
                                            params: JSON.stringify([{
                                                id: data.id,
                                                lmsDealStatus: 3,
                                            }]),
                                        })
                                        .then(() => {
                                            layer.msg("处理成功", { icon: 1 });
                                            layer.close(index);
                                            _this.triggerClick();
                                        })
                                        .catch((err) => {
                                            layer.msg(err.message, { icon: 2 });
                                        });
                                }
                            );
                        } else if (layEvent == "download") {
                            window.open(data.downLoadUpdateExcelUrl, "_blank");
                        } else if (layEvent == "discount") {
                            layer.prompt({
                                    title: "设置折扣(取值0.8-1)",
                                },
                                function(value, index) {
                                    var numberValue = Number(value);
                                    if (numberValue >= 0.8 && numberValue <= 1) {} else {
                                        return layer.msg("折扣值应该0.8-1之间", { icon: 7 });
                                    }
                                    _this
                                        .setDiscountAjax([{ id: data.id, discount: numberValue }])
                                        .then(() => {
                                            layer.msg("处理成功", { icon: 1 });
                                            layer.close(index);
                                            _this.triggerClick();
                                        })
                                        .catch((err) => {
                                            layer.msg(err.message, { icon: 2 });
                                        });
                                }
                            );
                        } else if (layEvent == "submit") {
                            if (!data.discount) {
                                return layer.msg("请先设置折扣", { icon: 7 });
                            }
                            layer.confirm(
                                "确定提交吗?", { icon: 3, title: "提交" },
                                function(index) {
                                    _this
                                        .submitAjax([{ id: data.id }])
                                        .then((res) => {
                                            layer.msg("处理成功", { icon: 1 });
                                            layer.close(index);
                                            _this.triggerClick();
                                        })
                                        .catch((err) => {
                                            layer.msg(err.message, { icon: 2 });
                                        });
                                }
                            );
                        } else if (layEvent == "journal") {
                            _this
                                .journalAjax({
                                    storeId: data.storeId,
                                    siteId: data.siteId,
                                    sceneId: data.sceneId,
                                })
                                .then((res) => {
                                    if (!res.length)
                                        return layer.msg("暂无操作日志", { icon: 1 });
                                    layer.open({
                                        type: 1,
                                        title: "日志",
                                        area: ["60%", "60%"],
                                        content: $("#activeregister_logsTable").html(),
                                        id: "activeregister_logsTableId",
                                        success: function() {
                                            var getTpl = activeregister_logsTbodyTpl.innerHTML,
                                                view = document.getElementById(
                                                    "activeregister_logsTbody"
                                                );
                                            laytpl(getTpl).render(res, function(html) {
                                                view.innerHTML = html;
                                            });
                                        },
                                    });
                                })
                                .catch((err) => {
                                    return layer.msg(err.message, { icon: 2 });
                                });
                        }
                    });
                },
                //设置优惠券模板lazadaCampaign/createVoucher
                setVoucherTemp: function () {
                    var _this = this;
                    $("#activeregister_voucherTemplate").on("click", function() {
                        commonTableCksSelected("activeregister_tableId")
                            .then((data) => {
                                let sceneIdArr = data.map(item => item.sceneId);
                                if (new Set(sceneIdArr).size != 1) {
                                    return layer.msg('请选择不同店铺的相同活动', { icon: 7 });
                                }
                                let idArr = data.map((item) => {
                                    return {
                                        id: item.id,
                                        sceneId: item.sceneId,
                                        storeId: item.storeId
                                    };
                                });
                                layer.open({
                                    type:1,
                                    title: '提报优惠券活动',
                                    content: $('#activeregister_voucherTemplateLayer').html(),
                                    area: ['90%', '60%'],
                                    btn: ['批量创建', '取消'],
                                    success: function (layero, index) {
                                        let $maxDiscountValueParent = layero.find('.activeregisterMaxDiscountValue');
                                        form.render('select');
                                        form.on('select(activeregister_voucher_discountType)', function(data){
                                            if (data.value == 2) {
                                                $maxDiscountValueParent.removeClass('activeregisterOpacity');
                                            } else {
                                                $maxDiscountValueParent.addClass('activeregisterOpacity');
                                            }
                                        });  
                                    },
                                    yes: function (index, layero) {
                                        let $maxDiscountValueParent = layero.find('.activeregisterMaxDiscountValue');
                                        let formData = serializeObject($('#activeregister_voucherForm'));
                                        if ($maxDiscountValueParent.hasClass('activeregisterOpacity')) {
                                            delete formData.maxDiscountValue;
                                        }
                                        if (!formData.discountType || !formData.discountValue || !formData.discountValue
                                            || !formData.voucherName || !formData.minimumSpend || !formData.canRedeemedCount || !formData.usageLimit) {
                                            return layer.msg('必填项不能为空', { icon: 7 });
                                        }
                                        let submitData = [];
                                        for (let i = 0; i < idArr.length; i++){
                                            let item = idArr[i];
                                            let newItem = Object.assign({}, item, formData);
                                            submitData.push(newItem);
                                        }
                                        console.log(submitData);
                                        _this.setVoucherAjax(submitData).then(res => {
                                            layer.msg('提报活动进入处理程序,请稍后在后台查看优惠券详情', { icon: 1 });
                                            layer.close(index);
                                        });
                                    }
                                });
                            })
                            .catch((err) => {
                                layer.msg(err || err.message, { icon: 2 });
                            });
                    });
                },
                //批量设置折扣
                batchDiscount: function() {
                    var _this = this;
                    $("#activeregister_batchDiscount").on("click", function() {
                        commonTableCksSelected("activeregister_tableId")
                            .then((data) => {
                                var idArr = data.map((item) => item.id);
                                layer.prompt({
                                        title: "设置折扣(取值0.8-1)",
                                    },
                                    function(value, index) {
                                        var numberValue = Number(value);
                                        if (numberValue >= 0.8 && numberValue <= 1) {} else {
                                            return layer.msg("折扣值应该0.8-1之间", { icon: 7 });
                                        }
                                        var arr = [];
                                        for (var i = 0; i < idArr.length; i++) {
                                            arr.push({
                                                id: idArr[i],
                                                discount: numberValue,
                                            });
                                        }
                                        _this
                                            .setDiscountAjax(arr)
                                            .then(() => {
                                                layer.msg("处理成功", { icon: 1 });
                                                layer.close(index);
                                                _this.triggerClick();
                                            })
                                            .catch((err) => {
                                                layer.msg(err.message, { icon: 2 });
                                            });
                                    }
                                );
                            })
                            .catch((err) => {
                                layer.msg(err || err.message, { icon: 2 });
                            });
                    });
                },
                //批量提交
                batchSubmit: function() {
                    var _this = this;
                    $("#activeregister_batchSubmit").on("click", function() {
                        commonTableCksSelected("activeregister_tableId")
                            .then((data) => {
                                var idArr = data.map((item) => {
                                    return { id: item.id };
                                });
                                var discountArr = data.filter((item) => {
                                    return item.discount;
                                });
                                if (discountArr.length != idArr.length) {
                                    return layer.msg("批量提交前请先设置折扣", { icon: 7 });
                                }
                                layer.confirm(
                                    "确定批量提交吗?", { icon: 3, title: "提交" },
                                    function(index) {
                                        _this
                                            .submitAjax(idArr)
                                            .then((res) => {
                                                layer.msg("处理成功", { icon: 1 });
                                                layer.close(index);
                                                _this.triggerClick();
                                            })
                                            .catch((err) => {
                                                layer.msg(err.message, { icon: 2 });
                                            });
                                    }
                                );
                            })
                            .catch((err) => {
                                layer.msg(err.message, { icon: 2 });
                            });
                    });
                },
                //设置优惠券模板ajax
                setVoucherAjax: function(data) {
                    return commonReturnPromise({
                        url: "/lms/lazadaCampaign/createVoucher.html",
                        contentType: "application/json",
                        type: "post",
                        params: JSON.stringify(data),
                    });
                },
                //设置折扣ajax
                setDiscountAjax: function(data) {
                    return commonReturnPromise({
                        url: "/lms/lazadaCampaign/lazadaCampaignBatchUpdate.html",
                        contentType: "application/json",
                        type: "post",
                        params: JSON.stringify(data),
                    });
                },
                //提交ajax
                submitAjax: function(data) {
                    return commonReturnPromise({
                        url: "/lms/lazadaCampaign/submitLazadaExcelBatchUpload.html",
                        contentType: "application/json",
                        type: "post",
                        params: JSON.stringify(data),
                    });
                },
                //处理日志ajax
                journalAjax: function(obj) {
                    return commonReturnPromise({
                        url: "/lms/lazadaCampaign/getLazadaCampaignOperationLogList.html",
                        contentType: "application/json",
                        type: "post",
                        params: JSON.stringify(obj),
                    });
                },
            };
            //渲染部门销售员店铺三级联动
            render_hp_orgs_users("#activeregisterForm");
            //渲染站点
            activeregisterName.initSite("activeregister_site_sel");
            //渲染时间
            activeregisterName.timeRender();
            //tab切换
            activeregisterName.tabHandle();
            //点击checkbox
            activeregisterName.checkboxClick();
            //设置优惠券模板
            activeregisterName.setVoucherTemp();
            //批量设置折扣
            activeregisterName.batchDiscount();
            //批量提交
            activeregisterName.batchSubmit();
            //监听提交事件
            form.on("submit(activeregister_filter)", function(data) {
                var data = data.field; //获取到表单提交对象
                var obj = activeregisterName.dataHandle(data);
                activeregisterName.tableRender(obj);
            });
            //固定头部
            UnifiedFixedFn("activeregisterCard");
        }
    );
})(jQuery, layui, window, document);