layui.use(["admin", "form", "table", "layer", "laytpl"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    //定义一个额外的搜索参数，区分tab选项卡
    var searchType = "1";

    render_hp_orgs_users("#fyndiqAcctSearchForm");//渲染部门销售员店铺三级联动

    //按钮的点击事件
    $("#addFyndiqInfo").click(function () {
        var index = layer.open({
            type: 1,
            title: "添加fyndiq账号",
            area: ["1000px", "450px"],
            shadeClose: false,
            content: $("#addFyndiqInfoLayer").html(),
            btn: ['保存', '关闭'],
            success: function () {
                fyndiqAcct_getSalesPersion();
                form.render('select');
            },
            yes: function () {
                $('#addFyndiqAcct').trigger("click");
                return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
            },
            end: function () {
                // $("#fyndiqSalesPlatAccountAddForm")[0].reset();
                $("#fyndiqSalesPlatAccountAddForm").trigger('reset');
                $("#fyndiqSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                $("#fyndiqSalesPlatAccountAddForm input[name='acctDetailId']").val("");
            }
        });
    });
    if ($("#index_sync_fail_store").length > 0) {
        $("#fyndiqSyncListingStatus").val($("#index_sync_fail_store").val());
        $("#index_sync_fail_store").remove();
        form.render('select');
    }
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#fyndiqTable",
        method: "post",
        url: ctx + "/salesplat/salesPlatAccountDtoPage.html?platCode=fyndiq",
        where: {
            status: $("#fyndiqAcctSearchForm select[name='status'] option:selected").val(),
            syncStatus: $("#fyndiqSyncListingStatus").val(),
            refreshTokenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:''),
            refreshTokenSevenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:''),
            searchType: searchType
        },
        cols: [
            [
                //标题栏
                {type: "checkbox"},
                {field: "storeAcct", title: "店铺名称",},
                // {field: "allrootAliasName", title: "普源别名",},
                {field: "devAcct", title: "登录名",},
                {
                    field: "imgDomain", title: "图片域名", width: 200,
                    templet: `<div>
                    <div class="alignLeft">
                        {{# if(d.expireTime){ }}
                            域名: {{d.imgDomain}}
                        <br>
                           到期时间: {{ Format(d.expireTime,"yyyy-MM-dd")}}
                        {{# }else{ }}
                           {{d.imgDomain}} 
                        {{# } }}
                    </div>
               </div>`
                },
                {field: "status", title: "店铺状态", templet: '#fyndiqAcctStatusTpl', width: 65},
                // {field: "orderDownloadStatus", title: "订单下载", templet: "#orderDownloadStatusTemplet", width: 90},
                {field: "salesperson", title: "销售员"},
                {field: "sellLeaderName", title: "销售主管", width: 90},
                { field: "productFeedUrl", title: "Product feed URL" },
                {
                    field: "syncDesc",
                    title: "同步异常备注",
                },
                {title: '操作', align: 'center', toolbar: '#fyndiqTableBar'}
            ],
        ],
        done: function (res, curr, count) {
            if(res.code == '0000'){
                $("#fyndiqAccount_colLen").text(res.extra.mainTab);
                $("#fyndiq_acct_domain_overdue_number").text(res.extra.sevenTab);
            }else{
                $("#fyndiqAccount_colLen").text(0);
                $("#fyndiq_acct_domain_overdue_number").text(0);
            }
            sessionStorage.clear("lastJumpParam")
            theadHandle().fixTh({id: '#fyndiqaccountCard'})
        },
        id: 'fyndiqAcctTable',
        page: true, //是否显示分页
        limits: [300, 500, 1000],
        limit: 500, //每页默认显示的数量
    });

    // 搜索
    var active = {
        reload: function () {
            var status = $("#fyndiqAcctSearchForm select[name='status'] option:selected").val();
            var storeAcct = $("#fyndiqAcctSearchForm input[name='storeAcct']").val();
            var syncStatus = $("#fyndiqSyncListingStatus").val();//同步listing状态
            var orgId = $("#fyndiq_account_depart_sel").val();
            var salespersonId = $("#fyndiq_account_salesman_sel").val();
            var syncDesc = $('#fyndiqAcctSearchForm  input[name=syncDesc]').val();
            //执行重载
            table.reload('fyndiqAcctTable', {
                where: {
                    status: status,
                    storeAcct: storeAcct,
                    syncStatus: syncStatus,
                    orgId: orgId,
                    salespersonId: salespersonId,
                    searchType: searchType,
                    syncDesc: syncDesc
                }
            });
        }
    };

    element.on('tab(fyndiq_acct_tab_filter)', function (data) {
        searchType = $(this).attr("lay-id");
        active.reload();
    });

    $('#fyndiqSearch').click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    //同步lisiting
    $("#fyndiq_syncFyndiqListing").click(function () {
        var checkStatus = table.checkStatus('fyndiqAcctTable'); //获取选择的店铺
        var checkAcctNum = checkStatus.data.length;
        if (checkAcctNum == null || checkAcctNum < 1) {
            layer.msg("请选择店铺");
            return;
        }
        var acctData = checkStatus.data;
        var acctIds = [];
        for (var index in acctData) {
            var obj = acctData[index];
            if (obj.status == true) {
                acctIds.push(acctData[index].id);
            }
        }
        if (acctIds.length < 1) {
            layer.msg("请选择启用的店铺");
            return;
        }
        var title = "确定要同步选中的" + checkAcctNum + "个店铺!";
        layer.confirm(title, {icon: 3}, function (index) {
            var platCode = "fyndiq";
            var showListingPrecent = platCode + "ShowListingPrecent";//显示进度条百分比的元素
            var showListingContent = platCode + "ShowListingContent";//显示进度内容
            var showListingErrorMsg = platCode + "ShowListingErrorMsg";//显示错误的店铺
            var batchNo = new Date().getTime();//本次同步任务流水号
            /**提交同步任务**/
            $.ajax({
                url: ctx + '/syncItem/batchSyncPlatListing.html',
                type: 'post',
                data: {"acctIds": acctIds.join(","), "batchNo": batchNo, "platCode": platCode},
                dataType: 'json',
                success: function (returnData) {
                    element.progress('wishShowListingPrecent', returnData.data.precent);
                    $("#" + showListingContent).html(returnData.data.content);
                    if (returnData.data.errorMsg != null && returnData.data.errorMsg != '') {
                        $("#" + showListingErrorMsg).html("<p>异常店铺：</p>" + returnData.data.errorMsg);
                    }
                }, error: function () {
                    layer.msg("提交店铺listing同步任务失败");
                }
            })
            /**
             * 查询同步进度的定时任务
             */
            var listInterval = setInterval(function () {
                $.ajax({
                    url: ctx + '/syncItem/getSyncProcessByBatchNo.html',
                    type: 'post',
                    data: {batchNo: batchNo, "platCode": platCode},
                    dataType: 'json',
                    success: function (returnData) {
                        try {
                            var content = returnData.data.content;
                            var errorMsg = returnData.data.errorMsg;//错误信息
                            element.progress(showListingPrecent, returnData.data.precent);
                            $("#" + showListingContent).html(content);
                            if (errorMsg != null && errorMsg != '') {
                                errorMsg = "<p style='padding-left: 10px;'>" + errorMsg + "</p>";
                                $("#" + showListingErrorMsg).html("<p>异常店铺：</p>" + errorMsg);
                            }
                            if (content != null && content.indexOf("完成") > -1) {
                                clearInterval(listInterval);//清除定时任务
                            }
                        } catch (e) {
                            element.progress(showListingPrecent, "100%");
                            clearInterval(listInterval);//清除定时任务
                        }
                    }, error: function () {
                        $("#" + showListingContent).html("获取同步lisiting进度失败");
                    }
                })
            }, 2000);
            /**展示同步任务结果*/
            var content = '<div class="layui-progress layui-progress-big" lay-filter="' + showListingPrecent + '">' +
                '<div class="layui-progress-bar layui-bg-blue"  lay-percent="80%"></div>' +
                '</div>' +
                '<p id=\'' + showListingContent + '\'>正在同步中...</p>' +
                '<p id=\'' + showListingErrorMsg + '\'></p>';
            layer.open({
                title: '同步listing结果',
                content: content,
                offset: '100px',
                area: '500px',
                yes: function (index, layero) {
                    clearInterval(listInterval);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            });
        });
    });
    form.on('submit(addFyndiqAcct)', function (data) {
        data.field["salesperson"] = $("#fyndiqSalesPlatAccountAddForm select[name=salespersonId] option:selected").text();
        data.field["sellLeaderId"] = $("#fyndiqSalesPlatAccountAddForm select[name=sellLeaderId]").val();
        data.field["sellLeaderName"] = $("#fyndiqSalesPlatAccountAddForm select[name=sellLeaderId] option:selected").text();
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/addSalesPlatAccountBaseAndDetailInfo.html",  //请求接口地址
            dataType: "json",
            data: data.field,  //需要post的数据
            success: function (res) {  //后台程序返回数据
                loading.hide();
                if (res.code == '0000') {
                    layer.closeAll();
                    layer.msg('操作成功');
                    table.reload('fyndiqAcctTable');
                } else {
                    layer.msg(res.msg);
                }
            }
        });
        return false;
    });

    form.on('submit(delFyndiqAcct)', function (data) {
        fyndiqAcct_deleteSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    form.on('submit(reuseFyndiqAcct)', function (data) {
        fyndiqAcct_openSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(fyndiqTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent === 'edit') {
            var index = layer.open({
                type: 1,
                title: "设置平台账号信息",
                area: ["1000px", "480px"],
                shadeClose: false,
                content: $("#addFyndiqInfoLayer").html(),
                btn: ['保存', '关闭'],
                yes: function () {
                    var dataObj = {
                        devAcct: $("#fyndiqSalesPlatAccountAddForm input[name='devAcct']").val(),
                        imgDomain: $("#fyndiqSalesPlatAccountAddForm input[name='imgDomain']").val(),
                        salespersonId: $("#fyndiqSalesPlatAccountAddForm select[name='salespersonId']").val(),
                        clientId: $("#fyndiqSalesPlatAccountAddForm input[name='cliendId']").val(),
                        accessToken: $("#fyndiqSalesPlatAccountAddForm input[name='accessToken']").val(),
                    }
                    var strRegex = "^http://";
                    var re = new RegExp(strRegex);
                    if (!re.test(dataObj.imgDomain)) {
                        layer.msg("图片域名必须以http://开头");
                        return;
                    }
                    var result = checkRequiredData(dataObj);
                    if (result) {
                        $('#addFyndiqAcct').trigger("click");
                        return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
                    }
                },
                success: function (layero, index) {
                    fyndiqAcct_getSalesPersion();
                    fyndiqAcct_getSalesPlatAccountBaseAndDetailInfo(data.id);
                    form.render('select');
                    form.render('radio');
                    form.render('checkbox');
                },
                end: function () {
                    // $("#fyndiqSalesPlatAccountAddForm")[0].reset();
                    $("#fyndiqSalesPlatAccountAddForm").trigger('reset');
                    $("#fyndiqSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                    $("#fyndiqSalesPlatAccountAddForm input[name='acctDetailId']").val("");

                    $("#fyndiqAcctReuseDiv").addClass('layui-hide');
                    $("#fyndiqAcctDelDiv").addClass('layui-hide');
                }
            });
        } else if (layEvent == 'generateAccessToken') {
            var index = layer.open({
                type: 1,
                title: "生成fyndiq令牌",
                area: ["800px", "300px"],
                shadeClose: false,
                content: $("#fyndiqTokenModalLayer").html(),
                btn: ['保存', '关闭'],
                yes: function (layero) {//
                    loading.show()
                    $.ajax({
                        url: ctx + '/fyndiqAuth/saveToken.html',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            "storeAcctId": data.id,
                            "token": $('#fyndiqTokenAddForm [name=token]').val()
                        },
                        success: function (response) {
                            loading.hide()
                            if (response.code == '0000') {
                                layer.closeAll();
                                layer.msg('授权成功');
                                table.reload('shopeeAcctTable');
                            } else {
                                layer.msg(response.msg)
                            }
                        },
                        error: function () {
                            loading.hide()
                            layer.msg('网络繁忙')
                        }
                    })
                },
                end: function () {
                    $("#fyndiqTokenAddForm").trigger('reset');
                }
            });
        }
    });

    // 获取平台账号基本和辅助信息
    function fyndiqAcct_getSalesPlatAccountBaseAndDetailInfo(salesPlatAccountId) {
        if (typeof (salesPlatAccountId) == "undefined") {
            layer.msg('服务器正忙');
            return;
        }
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/getSalesPlatAccountBaseAndDetailInfo.html",
            data: {"id": salesPlatAccountId},
            async: false,
            dataType: "json",
            success: function (returnData) {
                // base
                $("#fyndiqSalesPlatAccountAddForm input[name='acctBaseId']").val(returnData.acctBaseId);
                $("#fyndiqSalesPlatAccountAddForm input[name='storeAcct']").val(returnData.storeAcct);
                $("#fyndiqSalesPlatAccountAddForm input[name='imgDomain']").val(returnData.imgDomain);
                $("#fyndiqSalesPlatAccountAddForm input[name='allrootAliasName']").val(returnData.allrootAliasName);
                $("#fyndiqSalesPlatAccountAddForm input[name='devAcct']").val(returnData.devAcct);
                $("#fyndiqSalesPlatAccountAddForm input[name='accessToken']").val(returnData.accessToken);
                $("#fyndiqSalesPlatAccountAddForm input[name='clientId']").val(returnData.clientId);
                $("#fyndiqSalesPlatAccountAddForm input[name='productFeedUrl']").val(returnData.productFeedUrl);
                $("#fyndiqSalesPlatAccountAddForm input[name='taxNumber']").val(returnData.taxNumber);
                $("#fyndiqSalesPlatAccountAddForm input[name='eoriNumber']").val(returnData.eoriNumber);
                $("#fyndiqSalesPlatAccountAddForm textarea[name='acctBaseRemark']").val(returnData.acctBaseRemark);
                $("#fyndiqSalesPlatAccountAddForm select[name=salespersonId]").val(returnData.salespersonId);
                $("#fyndiqSalesPlatAccountAddForm select[name=sellLeaderId]").val(returnData.sellLeaderId);
                form.render('select');

                // detail
                $("#fyndiqSalesPlatAccountAddForm input[name='acctDetailId']").val(returnData.acctDetailId);
                $("#fyndiqSalesPlatAccountAddForm input[name='salesAcctId']").val(returnData.salesAcctId);
                if (returnData.status == false) {
                    $("#fyndiqAcctReuseDiv").removeClass('layui-hide');
                } else {
                    $("#fyndiqAcctDelDiv").removeClass('layui-hide');
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    }

    //停用店铺账号
    function fyndiqAcct_deleteSalesPlatAccount(salesPlatAccountId) {
        if (typeof (salesPlatAccountId) == "undefined") {
            layer.msg('服务器正忙');
            return;
        }
        layer.confirm('是否停用此账号？', function (result) {
            if (result) {
                $.ajax({
                    url: ctx + '/salesplat/deleteSalesPlatAccount.html',
                    data: {"id": salesPlatAccountId},
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg(returnData.msg);
                            table.reload('fyndiqAcctTable');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }

    //启用店铺
    function fyndiqAcct_openSalesPlatAccount(salesPlatAccountId) {
        if (typeof (salesPlatAccountId) == "undefined") {
            layer.msg("服务器正忙");
            return;
        }
        layer.confirm("是否启用此账号？", function (result) {
            if (result) {
                $.ajax({
                    url: ctx + '/salesplat/openSalesPlatAccount.html',
                    data: {"id": salesPlatAccountId},
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg(returnData.msg);
                            table.reload('fyndiqAcctTable');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }


    form.on('select(fyndiqAcctBatchOper)', function (data) {
        var optionNum = data.value;
        console.log(optionNum);
        if (3 == optionNum) {
            var acctIds = getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改信息",
                area: ["500px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editFyndiqSalesPersonLayer").html(),
                end: function () {
                    $("#editFyndiqSalesPersonForm select[name=salespersonId]").val("");
                    $("#editFyndiqSalesPersonForm select[name=sellLeaderId]").val("");
                },
                success: function (layero, index) {
                    fyndiqAcct_getSalesPersion();
                    form.render("select");
                },
                yes: function () {
                    var salespersonId = $("#editFyndiqSalesPersonForm select[name=salespersonId]").val();
                    var salesperson = $("#editFyndiqSalesPersonForm select[name=salespersonId] option:selected").text();
                    var sellLeaderId = $("#editFyndiqSalesPersonForm select[name=sellLeaderId]").val();
                    var sellLeaderName = $("#editFyndiqSalesPersonForm select[name=sellLeaderId] option:selected").text();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/editSalesPerson.html",
                        dataType: "json",
                        data: {
                            ids: acctIds,
                            salesperson: salesperson,
                            salespersonId: salespersonId,
                            sellLeaderId: sellLeaderId,
                            sellLeaderName: sellLeaderName
                        },
                        traditional: true,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("批量修改信息成功");
                                table.reload('fyndiqAcctTable');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        // } else if (4 == optionNum) {
        //     var acctIds = getStoreAcctIds();
        //     if (acctIds.length < 1) {
        //         layer.msg("请至少选择1个店铺");
        //         return;
        //     }
        //     var obj = {
        //         idListStr: acctIds.toString(),
        //         orderDownStatus: true
        //     }
        //     form.render("select");
        //     batchUpdateOrderDownload(obj);
        //
        // } else if (5 == optionNum) {
        //     var acctIds = getStoreAcctIds();
        //     if (acctIds.length < 1) {
        //         layer.msg("请至少选择1个店铺");
        //         return;
        //     }
        //     var obj = {
        //         idListStr: acctIds.toString(),
        //         orderDownStatus: false
        //     }
        //     form.render("select");
        //     batchUpdateOrderDownload(obj);

        } else if (6 == optionNum) {//启用店铺
            layer.confirm('确定批量启用店铺吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function (index) {
                var acctIds = getStoreAcctIds();
                if (acctIds.length < 1) {
                    layer.msg("请至少选择1个店铺");
                    return;
                }
                var obj = {
                    acctIdStr: acctIds.toString(),
                    flag: true
                }
                form.render("select");
                batchUpdateAcctStatus(obj);
            });
        } else if (7 == optionNum) {//批量停用店铺
            layer.confirm('确定批量停用店铺吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function (index) {
                var acctIds = getStoreAcctIds();
                if (acctIds.length < 1) {
                    layer.msg("请至少选择1个店铺");
                    return;
                }
                var obj = {
                    acctIdStr: acctIds.toString(),
                    flag: false
                };
                form.render("select");
                batchUpdateAcctStatus(obj);
            });
        } else if (8 == optionNum) {
            var acctIds = getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改图片域名",
                area: ["600px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editFyndiqDomainLayer").html(),
                end: function () {
                    $("#editFyndiqDomainForm select[name=domainId]").val("");
                },
                success: function (layero, index) {
                    fyndiqAcct_getDomain();
                    form.render("select");
                },
                yes: function () {
                    var imgDomain = $("#editFyndiqDomainForm select[name=domainId] option:selected").text();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/batchUpdateImgDomain.html",
                        dataType: "json",
                        data: {idListStr: acctIds, imgDomain: imgDomain},
                        traditional: true,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("修改图片域名成功");
                                table.reload('fyndiqAcctTable');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        }
    });

    function batchUpdateAcctStatus(obj) {
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/batchUpdateAcctStatus.html", //请求接口地址
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(obj), //需要post的数据
            success: function (res) {
                loading.hide();
                //后台程序返回数据
                if (res.code == "0000") {
                    active.reload();
                    layer.closeAll();
                } else {
                    layer.msg(res.msg);
                }
            }
        });
    }

    function getStoreAcctIds() {
        var acctIds = [];
        var checkStatus = table.checkStatus('fyndiqAcctTable'); //test即为基础参数id对应的值
        var checkAcctNum = checkStatus.data.length;
        if (checkAcctNum == null || checkAcctNum < 1) {
            return acctIds;
        }
        var acctData = checkStatus.data;
        for (var index in acctData) {
            var obj = acctData[index];
            acctIds.push(acctData[index].id);
        }
        return acctIds;
    }

    /**
     * 开启关闭订单下载的功能
     */
    // form.on('switch(orderDownloadStatus)', function (data) {
    //     //取到当前的开启状态和店铺id
    //     var obj = {
    //         id: data.othis.next().text(),
    //         orderDownStatus: data.elem.checked
    //     }
    //     $.ajax({
    //         type: "POST",
    //         url: ctx + "/salesplat/updateOrderStatusById.html", //请求接口地址
    //         dataType: "json",
    //         data: obj, //需要post的数据
    //         success: function (res) {
    //             loading.hide();
    //             //后台程序返回数据
    //             if (res.code == "0000") {
    //                 // active.reload();
    //                 layer.msg("设置成功");
    //             } else {
    //                 layer.msg(res.msg);
    //             }
    //         },
    //     });
    // });

    /**
     * 批量开启关闭订单下载的功能
     */
    // function batchUpdateOrderDownload(obj) {
    //     $.ajax({
    //         type: "POST",
    //         url: ctx + "/salesplat/batchUpdateOrderStatus.html", //请求接口地址
    //         dataType: "json",
    //         data: obj, //需要post的数据
    //         success: function (res) {
    //             loading.hide();
    //             //后台程序返回数据
    //             if (res.code == "0000") {
    //                 active.reload();
    //             } else {
    //                 layer.msg(res.msg);
    //             }
    //         },
    //     });
    // }

    /**
     * 校验必填数据，为了保存和停用店铺时区分校验
     */
    function checkRequiredData(dataObj) {
        if (dataObj.devAcct == null || dataObj.devAcct == '' || dataObj.devAcct == undefined) {
            layer.msg('请输入登录名');
            return false;
        }
        if (dataObj.imgDomain == null || dataObj.imgDomain == '' || dataObj.imgDomain == undefined) {
            layer.msg('请输入图片域名');
            return false;
        }
        if (dataObj.salespersonId == null || dataObj.salespersonId == '' || dataObj.salespersonId == undefined) {
            layer.msg('请选择销售员');
            return false;
        }
        return true;
    }

    //监听iframe传参
    window.addEventListener('message', function(event){
      console.log('iframe接收到的数据是', event.data);
      let {searchType} = event.data;
      if(searchType){
        $('#fyndiq_acct_domain_overdue_number').parents('li').trigger('click');
      }
    });

});

function fyndiqAcct_getSalesPersion() {
    $("#fyndiqSalesPlatAccountAddForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#editFyndiqSalesPersonForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#fyndiqSalesPlatAccountAddForm select[name=sellLeaderId]").html('<option value=""></option>');
    $("#editFyndiqSalesPersonForm select[name=sellLeaderId]").html('<option value="">选择销售主管</option>');
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "fyndiq专员"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#fyndiqSalesPlatAccountAddForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        $("#editFyndiqSalesPersonForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')

                    }
                }
            }
        }
    });

    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "fyndiq主管"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#fyndiqSalesPlatAccountAddForm select[name=sellLeaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        $("#editFyndiqSalesPersonForm select[name=sellLeaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')

                    }
                }
            }
        }
    });

}

/**
 * 请求图片域名列表
 */
function fyndiqAcct_getDomain() {
    $("#editFyndiqDomainLayer select[name=domainId]").html('<option value="">选择域名</option>');
    $.ajax({
        type: "post",
        url: ctx + "/domain/listAll.html",
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var domainList = returnData.data;
                console.log("domainList", domainList)
                if (domainList.length > 0) {
                    for (var i = 0; i < domainList.length; i++) {
                        $("#editFyndiqDomainForm select[name=domainId]")
                            .append('<option value="' + domainList[i].id + '">' + domainList[i].domain + '</option>')
                    }
                }
            }
        }
    });
}