/**
 * time: 2018/01/02
 */
console.log("amazonAcctount");
layui.use(["admin", "form", "table", "layer", "laytpl"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element;
    $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    //定义一个额外的搜索参数，区分tab选项卡
    var searchType = "1";

    form.on("select(amazonAcctFulfillmentType)",function(data){
        let value = data.value;
        if(value == 'fba'){
            $(".fulfillmentLatencyDiv").hide()
        }else{
            $(".fulfillmentLatencyDiv").show()
            $("#amazonSalesPlatAccountAddForm input[name=fulfillmentLatency]").val($("#amazonSalesPlatAccountAddForm input[name=fulfillmentLatencyHide]").val() || 2)
        }
    })

    //按钮的点击事件
    $("#addAmazonInfo").click(function () {
        var index = layer.open({
            type: 1,
            title: "设置平台账号信息",
            area: ["1000px", "630px"],
            shadeClose: false,
            content: $("#addAmazonInfoLayer").html(),
            btn: ['测试', '保存', '关闭'],
            yes: function () {
                var testReq = {};
                var tformObjlist = $('#amazonSalesPlatAccountAddForm [name]').serializeArray();
                $.each(tformObjlist, function () {
                    testReq[this.name] = this.value;
                });
                $.ajax({
                    type: "POST",
                    url: ctx + "/salesplat/testAmazonAuth.html",  //请求接口地址
                    dataType: "json",
                    data: testReq,  //需要post的数据
                    success: function (res) {  //后台程序返回数据
                        loading.hide();
                        if (res.code == '0000') {
                            layer.msg('授权信息正确');
                        } else {
                            layer.msg(res.msg);
                        }
                    },
                    error: function () {
                        loading.hide();
                        layer.msg('网络繁忙')
                    }
                });


            },
            btn2: function () {
                $('#addAmazonAcct').trigger("click");
                return false;
            },
            success: function () {
                amazonAcct_getSalesPersion();
                form.render('select');
                form.render('radio');
                form.render('checkbox');
            },
            end: function () {
                // $("#amazonSalesPlatAccountAddForm")[0].reset();
                $("#amazonSalesPlatAccountAddForm").trigger('reset');
                $("#amazonSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                $("#amazonSalesPlatAccountAddForm input[name='acctDetailId']").val("");
            }
        });
    });
    if ($("#index_sync_fail_store").length > 0) {
        $("#amazonSyncListingStatus").val($("#index_sync_fail_store").val());
        $("#index_sync_fail_store").remove();
        form.render('select');
    }
    //表格渲染结果
    //展示已知数据
    // var amazonTableIns = table.render({
    //     elem: "#amazonTable",
    //     method: "post",
    //     url: ctx + "/salesplat/salesPlatAccountDtoPage.html?platCode=amazon",
    //     where: {
    //         status: $("#amazonAcctSearchForm select[name='status'] option:selected").val(),
    //         autoFollowSell: $("#amazonAcctSearchForm select[name='autoFollowSell']").val(),
    //         syncStatus: $("#amazonSyncListingStatus").val(),
    //         searchType: searchType
    //     },
    //     cols: [
    //         [
    //             //标题栏
    //             {type: "checkbox"},
    //             // {field: "platCode", title: "平台code"},
    //             {
    //                 field: "storeAcct",
    //                 title: "店铺名称",
    //             },
    //             {
    //                 field: "allrootAliasName",
    //                 title: "普源别名",
    //             },
    //             {field: "salesSiteName", title: "授权站点", templet: "#transSiteNameTpl"},
    //             // {field: "imgDomain", title: "图片域名", width: 280},
    //             {field: "advertisingExpiresTime", title: "广告access token", templet: "#amazonadvertisement", width: 200},
    //             {field: "brand", title: "商品品牌"},
    //             {
    //                 field: "imgDomain", title: "图片域名", width: 200,
    //                 templet: `<div>
    //                             <div class="alignLeft">
    //                                 {{# if(d.expireTime){ }}
    //                                  域名: {{d.imgDomain}}
    //                                 <br>
    //                                 到期时间: {{ Format(d.expireTime,"yyyy-MM-dd")}}
    //                                 {{# }else{ }}
    //                                 {{d.imgDomain}}
    //                                 {{# } }}
    //                          </div>
    //                      </div>`
    //             },
    //             {field: "status", title: "店铺状态", templet: '#amazonAcctStatusTpl', width: 65},
    //             {field: "orderDownloadStatus", title: "订单下载", templet: "#orderDownloadStatusTemplet", width: 90},
    //             {field: "salesperson", title: "销售员", width: 90,},
    //             {field: "sellLeaderName", title: "销售主管", width: 90},
    //             {
    //                 field: "syncStatus",
    //                 title: "同步lisiting状态",
    //                 templet: "#amazonSyncStatus",
    //             },
    //             {
    //                 field: "lastSyncTime",
    //                 title: "上次同步时间",
    //                 templet: "#amazonLastSyncTime",
    //             },
    //             {
    //                 field: "syncDesc",
    //                 title: "同步异常备注",
    //                 templet: "#amazonSyncDesc"
    //             },
    //             {
    //                 field: "remark",
    //                 title: "备注"
    //             },
    //             {
    //                 field: "autoFollowSell",
    //                 title: "是否跟卖店铺",
    //                 width: 90,
    //                 templet: "#amazonAcct_autoFollowSell_tpl"
    //             },
    //             //{ field: "city", title: "定时刊登" },
    //             //{ field: "experience", title: "操作" },
    //             //绑定工具条
    //             {title: '操作', width: 90, align: 'center', toolbar: '#amazonTableBar'}
    //         ],
    //     ],
    //     done: function (res, curr, count) {
    //         if (res.code == '0000') {
    //             $("#amazonAccount_colLen").text(res.extra.mainTab);
    //             $("#amazon_acct_domain_overdue_number").text(res.extra.sevenTab);
    //         } else {
    //             $("#amazonAccount_colLen").text(0);
    //             $("#amazon_acct_domain_overdue_number").text(0);
    //         }
    //         theadHandle().fixTh({id: '#amazonaccountCard'})
    //     },
    //     id: 'amazonAcctTable',
    //     page: true, //是否显示分页
    //     limits: [300, 500, 1000],
    //     limit: 500, //每页默认显示的数量
    // });

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
    var amazonTableIns
    // 搜索
    var active = {
        reload: function () {
            var status = $("#amazonAcctSearchForm select[name='status'] option:selected").val();
            var storeAcct = $("#amazonAcctSearchForm input[name='storeAcct']").val();
            var syncStatus = $("#amazonSyncListingStatus").val();//同步listing状态
            var autoFollowSell = $("#amazonAcctSearchForm select[name='autoFollowSell']").val();
            var orgId = $("#amazon_account_depart_sel").val();
            var salespersonId = $("#amazon_account_salesman_sel").val();
            var syncDesc = $("#amazonAcctSearchForm input[name='syncDesc']").val();
            //执行重载
            // table.reload('amazonAcctTable', {
            //     where: {
            //         status: status,
            //         storeAcct: storeAcct,
            //         syncStatus: syncStatus,
            //         autoFollowSell: autoFollowSell,
            //         orgId: orgId,
            //         salespersonId: salespersonId,
            //         searchType: searchType,
            //         orderDownloadStatus: orderDownloadStatus
            //     }
            // });
            amazonTableIns = table.render({
                elem: "#amazonTable",
                method: "post",
                url: ctx + "/salesplat/salesPlatAccountDtoPage.html?platCode=amazon",
                where: {
                            status: status,
                            storeAcct: storeAcct,
                            syncStatus: syncStatus,
                            autoFollowSell: autoFollowSell,
                            orgId: orgId,
                            salespersonId: salespersonId,
                            searchType: searchType,
                            syncDesc: syncDesc,
                            refreshTokenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:''),
                            refreshTokenSevenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:''),
                },
                cols: [
                    [
                        //标题栏
                        {type: "checkbox"},
                        // {field: "platCode", title: "平台code"},
                        {
                            field: "storeAcct",
                            title: "店铺名称",
                        },
                        // {
                        //     field: "allrootAliasName",
                        //     title: "普源别名",
                        // },
                        {field: "salesSiteName", title: "授权站点", templet: "#transSiteNameTpl"},
                        // {field: "imgDomain", title: "图片域名", width: 280},
                        {field: "advertisingExpiresTime", title: "广告access token", templet: "#amazonadvertisement", width: 200},
                        {field: "spAccessTokenExpiresTime", title: "spAPI access token", templet: "#amazonaspAccessTokenExpiresTime", width: 200},

                        {field: "brand", title: "商品品牌"},
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
                        {field: "status", title: "店铺状态", templet: '#amazonAcctStatusTpl', width: 65},
                        {field: "salesperson", title: "销售员", width: 90,},
                        {field: "sellLeaderName", title: "销售主管", width: 90},
                        {
                            field: "syncStatus",
                            title: "同步lisiting状态",
                            templet: "#amazonSyncStatus",
                        },
                        {
                            field: "lastSyncTime",
                            title: "上次同步时间",
                            templet: "#amazonLastSyncTime",
                        },
                        {
                            field: "syncDesc",
                            title: "同步异常备注",
                            templet: "#amazonSyncDesc"
                        },
                        {
                            field: "remark",
                            title: "备注"
                        },
                        {
                            field: "autoFollowSell",
                            title: "是否跟卖店铺",
                            width: 90,
                            templet: "#amazonAcct_autoFollowSell_tpl"
                        },
                        //{ field: "city", title: "定时刊登" },
                        //{ field: "experience", title: "操作" },
                        //绑定工具条
                        {title: '操作', width: 90, align: 'center', toolbar: '#amazonTableBar'}
                    ],
                ],
                done: function (res, curr, count) {
                    if (res.code == '0000') {
                        $("#amazonAccount_colLen").text(res.extra.mainTab);
                        $("#amazon_acct_domain_overdue_number").text(res.extra.sevenTab);
                    } else {
                        $("#amazonAccount_colLen").text(0);
                        $("#amazon_acct_domain_overdue_number").text(0);
                    }
                    theadHandle().fixTh({id: '#amazonaccountCard'})
                },
                id: 'amazonAcctTable',
                page: true, //是否显示分页
                limits: [300, 500, 1000],
                limit: 500, //每页默认显示的数量
            });
        }
    };

    element.on('tab(amazon_acct_tab_filter)', function (data) {
        searchType = $(this).attr("lay-id");
        active.reload();
    });

    $('#amazonSearch').click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    //同步lisiting
    $("#amazon_syncAmazonListing").click(function () {
        var checkStatus = table.checkStatus('amazonAcctTable'); //获取选择的店铺
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
            var platCode = "amazon";
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
                    element.progress('amazonShowListingPrecent', returnData.data.precent);
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
    form.on('submit(addAmazonAcct)', function (data) {
        var siteArr = new Array();
        $("#amazonSiteDiv :checkbox:checked").each(function () {
            siteArr.push($(this).val());
        });
        var sites = siteArr.join(",");
        data.field['salesSite'] = sites;
        data.field["salesperson"] = $("#amazonSalesPlatAccountAddForm select[name=salespersonId] option:selected").text();
        data.field["sellLeaderName"] = $("#amazonSalesPlatAccountAddForm select[name=salespersonLeader] option:selected").text();
        data.field["sellLeaderId"] = $("#amazonSalesPlatAccountAddForm select[name=salespersonLeader]").val();
        var siteBrandList = $("#amazonSalesPlatAccountAddForm").find('.siteBrand_class');
        var siteAndBrand = "";
        for (var m = 0; m < siteBrandList.length; m++) {
            var site = $(siteBrandList[m]).attr("site")
            var brandInp = $(siteBrandList[m]).val()
            if (brandInp) {
                if (siteAndBrand) {
                    siteAndBrand += "," + site + ":" + brandInp;
                } else {
                    siteAndBrand = site + ":" + brandInp;
                }
            }
        }
        data.field["siteAndBrand"] = siteAndBrand;
        var result = checkRequiredData(data.field);
        if (result) {
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
                        table.reload('amazonAcctTable');
                    } else {
                        layer.msg(res.msg);
                    }
                },
                error: function () {
                    loading.hide();
                    layer.msg('网络繁忙')
                }
            });
        }
        return false;
    });

    form.on('submit(delAmazonAcct)', function (data) {
        amazonAcct_deleteSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    form.on('submit(reuseAmazonAcct)', function (data) {
        amazonAcct_openSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(amazonTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent === 'edit') {
            var index = layer.open({
                    type: 1,
                    title: "设置平台账号信息",
                    area: ["1000px", "700px"],
                    shadeClose: false,
                    content: $("#addAmazonInfoLayer").html(),
                    btn: ['测试', '保存', '关闭'],
                    yes: function () {
                    var testReq = {};
                    var tformObjlist = $('#amazonSalesPlatAccountAddForm [name]').serializeArray();
                    $.each(tformObjlist, function () {
                        testReq[this.name] = this.value;
                    });
                    $.ajax({
                        type: "POST",
                        url: ctx + "/salesplat/testAmazonAuth.html",  //请求接口地址
                        dataType: "json",
                        data: testReq,  //需要post的数据
                        success: function (res) {  //后台程序返回数据
                            loading.hide();
                            if (res.code == '0000') {
                                layer.msg('授权信息正确');
                            } else {
                                layer.msg(res.msg);
                            }
                        },
                        error: function () {
                            loading.hide();
                            layer.msg('网络繁忙')
                        }
                    });


                },
                btn2: function () {
                    var dataObj = {
                        registerEmail: $("#amazonSalesPlatAccountAddForm input[name='registerEmail']").val(),
                        openingSite: $("#amazonSalesPlatAccountAddForm select[name='openingSite']").val(),
                        upcExemptionFlag: $("#amazonSalesPlatAccountAddForm select[name='upcExemptionFlag']").val(),
                        imgDomain: $("#amazonSalesPlatAccountAddForm input[name='imgDomain']").val(),
                        brand: $("#amazonSalesPlatAccountAddForm input[name='brand']").val(),
                        sellerId: $("#amazonSalesPlatAccountAddForm input[name='sellerId']").val(),
                        accessToken: $("#amazonSalesPlatAccountAddForm input[name='accessToken']").val(),
                        salespersonId: $("#amazonSalesPlatAccountAddForm select[name='salespersonId']").val(),
                        manufacturer: $("#amazonSalesPlatAccountAddForm input[name='manufacturer']").val(),
                        autoFollowSell: $("#amazonSalesPlatAccountAddForm select[name='autoFollowSell']").val(),
                        salespersonLeader: $("#amazonSalesPlatAccountAddForm select[name='salespersonLeader']").val()
                    }
                    var strRegex = "^http://";
                    var re = new RegExp(strRegex);
                    if (!re.test(dataObj.imgDomain)) {
                        layer.msg("图片域名必须以http://开头");
                        return false
                    }

                    // 验证必填项
                    var result = checkRequiredData(dataObj);
                    if (result) {
                        $('#addAmazonAcct').trigger("click");
                        // return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
                        // layer.close(index);
                    }
                    return false // layer.open多个按钮时，加上return false,就不会自动关闭
                },
                success: function (layero, index) {
                    amazonAcct_getSalesPersion();
                    amazonAcct_getSalesPlatAccountBaseAndDetailInfo(data.id);
                    form.render('select');
                    form.render('radio');
                    form.render('checkbox');
                },
                end: function () {
                    // $("#amazonSalesPlatAccountAddForm")[0].reset();
                    $("#amazonSalesPlatAccountAddForm").trigger('reset');
                    $("#amazonSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                    $("#amazonSalesPlatAccountAddForm input[name='acctDetailId']").val("");

                    $("#amazonAcctReuseDiv").addClass('layui-hide');
                    $("#amazonAcctDelDiv").addClass('layui-hide');
                }
            });
        } else if (layEvent === 'amazonAdverauthorization') {
            var popIndex = layer.open({
                shadeClose: false,
                title: "广告授权",
                area: ["800px", "400px"],
                btn: ['保存', '关闭'],
                content: $("#Adverauthorization").html(),
                success: function (layero, index) {
                    $.ajax({
                        type: "get",
                        url: ctx + "/amazonAdvertisingController/getLoginUrl",  //请求接口地址
                        data: {"salesAcctId": data.id},  //需要get的数据
                        success: function (res) {
                            $('#Amazonwebcode').val(res);  //后台程序返回数据
                        },
                    });
                },

                yes: function (index, layero) {
                    var obj = {};
                    obj.salesAcctId = data.id;
                    obj.code = layero.find("textarea[name='code']").val();
                    console.log(obj, "obj")
                    $.ajax({
                        type: "get",
                        url: `${ctx}/amazonAdvertisingController/getAuthToken`,
                        data: obj,
                        dataType: "json",
                        success: function (returnData) {
                            if (returnData.code == '0000') {
                                layer.msg("授权成功");
                                layer.close(popIndex)
                            } else {
                                layer.msg(returnData.msg)
                            }
                        },
                        error: function () {
                            layer.msg("服务器正忙");
                        }
                    });
                }
            });
        } else if (layEvent === 'amazonrefesh') {
            $.ajax({
                type: "get",
                url: `${ctx}/amazonAdvertisingController/refreshToken`,
                data: {"salesAcctId": data.id},
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == '0000') {
                        layer.msg("刷新Token成功");
                        layer.close(popIndex)
                    } else {
                        layer.msg(returnData.msg)
                    }
                },
                error: function () {
                    layer.msg("服务器正忙");
                }
            });
        }else if(layEvent === 'amazonrefesh_spAccessTokenExpiresTime'){ // 刷新
            commonReturnPromise({
                type: 'GET',
                url: '/lms/amazonSp/refreshAmazonSpAuthentication.html',
                params: {"storeId":data.id}
            }).then(res => {
                layer.msg("刷新Token成功");
                layer.close(popIndex)
            });
        }else if(layEvent === 'amazonSpAPIauthorization'){ // spapi授权
            commonReturnPromise({
                type: 'GET',
                url: '/lms/amazonSp/authorize',
                params: {"storeAcctId":data.id}
            }).then(result => {
                var popIndex = layer.open({
                    shadeClose: false,
                    title: "spAPI授权",
                    area: ["800px", "400px"],
                    btn: ['保存', '关闭'],
                    content: $("#spapiauthorization").html(),
                    success: function () {
                        // let id = data.id
                        // let inputurl = `https://sellercentral-japan.amazon.com/apps/authorize/consent?application_id=amzn1.sp.solution.09cc9c97-6fc6-4fe7-816b-ae878988b49a&state=${id}&version=beta`
                        $("input[name=spapiauthorizationUrl]").val(result.authorizeUrl)
                    },
                    yes: function (index, layero) {
                        var obj = {};
                        obj.storeAcctId = data.id;
                        obj.spApiOauthCode = layero.find("textarea[name='code']").val();

                        commonReturnPromise({
                            type: 'GET',
                            url: '/lms/amazonSp/callback/authorizeCodeSave',
                            params: obj
                        }).then(res => {
                            layer.msg("授权成功");
                            layer.close(popIndex)
                        });
                    }
                });
            })
        }else if(layEvent == 'checkAccessToken'){
          ztt_storeCommonCheckAuthFn(data.id, data.platCode);
        }
    })

    // 获取平台账号基本和辅助信息
    function amazonAcct_getSalesPlatAccountBaseAndDetailInfo(salesPlatAccountId) {
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
                $("#amazonSalesPlatAccountAddForm input[name='acctBaseId']").val(returnData.acctBaseId);
                $("#amazonSalesPlatAccountAddForm input[name='storeAcct']").val(returnData.storeAcct);
                $("#amazonSalesPlatAccountAddForm input[name='allrootAliasName']").val(returnData.allrootAliasName);
                $("#amazonSalesPlatAccountAddForm select[name=autoFollowSell]").val(returnData.autoFollowSell ? "true" : "false");
                $("#amazonSalesPlatAccountAddForm select[name=isDistributionStore]").val(JSON.stringify(returnData.isDistributionStore));
                $("#amazonSalesPlatAccountAddForm select[name=fulfillmentType]").val(returnData.fulfillmentType);
                $("#amazonSalesPlatAccountAddForm input[name=fulfillmentLatency]").val(returnData.fulfillmentLatency || 2);
                $("#amazonSalesPlatAccountAddForm input[name=fulfillmentLatencyHide]").val(returnData.fulfillmentLatency || 2);
                if(returnData.fulfillmentType == 'fba'){
                    $(".fulfillmentLatencyDiv").hide()
                }else{
                    $(".fulfillmentLatencyDiv").show()
                }
                $("#amazonSalesPlatAccountAddForm input[name='autoFsLimit']").val(returnData.autoFsLimit);

                $("#amazonSalesPlatAccountAddForm input[name='imgDomain']").val(returnData.imgDomain);
                $("#amazonSalesPlatAccountAddForm input[name='registerEmail']").val(returnData.registerEmail);
                $("#amazonSalesPlatAccountAddForm input[name='brand']").val(returnData.brand);
                $("#amazonSalesPlatAccountAddForm textarea[name='acctBaseRemark']").val(returnData.acctBaseRemark);
                $("#amazonSalesPlatAccountAddForm select[name=salespersonId]").val(returnData.salespersonId);
                $("#amazonSalesPlatAccountAddForm select[name=openingSite]").val(returnData.openingSite);
                $("#amazonSalesPlatAccountAddForm select[name=upcExemptionFlag]").val(returnData.upcExemptionFlag.toString());
                $("#amazonSalesPlatAccountAddForm select[name=salespersonLeader]").val(returnData.sellLeaderId);
                form.render('select');

                // detail
                $("#amazonSalesPlatAccountAddForm input[name='acctDetailId']").val(returnData.acctDetailId);
                $("#amazonSalesPlatAccountAddForm input[name='salesAcctId']").val(returnData.salesAcctId);
                $("#amazonSalesPlatAccountAddForm input[name='sellerId']").val(returnData.sellerId);
                $("#amazonSalesPlatAccountAddForm input[name='manufacturer']").val(returnData.manufacturer);
                $("#amazonSalesPlatAccountAddForm input[name='accessToken']").val(returnData.accessToken);

                $("#amazonSalesPlatAccountAddForm input[name='taxNumber']").val(returnData.taxNumber);
                $("#amazonSalesPlatAccountAddForm input[name='eoriNumber']").val(returnData.eoriNumber);
                $("#amazonSalesPlatAccountAddForm input[name='amazonSalesSite']").val(returnData.salesSite);

                //各个站点的品牌名
                if (returnData.siteAndBrand) {
                    var brandListStr = returnData.siteAndBrand;
                    var brandList = brandListStr.split(",");
                    for (var i = 0; i < brandList.length; i++) {
                        var site = brandList[i].substring(0, brandList[i].indexOf(":"));
                        var brand = brandList[i].substring(brandList[i].indexOf(":") + 1, brandList[i].length);
                        $("#amazonSalesPlatAccountAddForm input[name=siteBrand_" + site + "]").val(brand);
                    }
                }


                if (returnData.status == false) {
                    $("#amazonAcctReuseDiv").removeClass('layui-hide');
                } else {
                    $("#amazonAcctDelDiv").removeClass('layui-hide');
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    }

    //停用店铺账号
    function amazonAcct_deleteSalesPlatAccount(salesPlatAccountId) {
        if (typeof (salesPlatAccountId) == "undefined") {
            layer.msg('服务器正忙');
            return;
        }
        layer.confirm('是否停用此账号？', function (result) {
            if (result) {
                loading.show();
                $.ajax({
                    url: ctx + '/salesplat/deleteSalesPlatAccount.html',
                    data: {"id": salesPlatAccountId},
                    dataType: "json",
                    success: function (returnData) {
                        loading.hide();
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg(returnData.msg);
                            table.reload('amazonAcctTable');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        loading.hide();
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }

    render_hp_orgs_users("#amazonAcctSearchForm");//渲染部门销售员店铺三级联动

    //启用店铺
    function amazonAcct_openSalesPlatAccount(salesPlatAccountId) {
        if (typeof (salesPlatAccountId) == "undefined") {
            layer.msg("服务器正忙");
            return;
        }
        layer.confirm("是否启用此账号？", function (result) {
            if (result) {
                loading.show();
                $.ajax({
                    url: ctx + '/salesplat/openSalesPlatAccount.html',
                    data: {"id": salesPlatAccountId},
                    dataType: "json",
                    success: function (returnData) {
                        loading.hide();
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg(returnData.msg);
                            table.reload('amazonAcctTable');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        loading.hide();
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }

    form.on('select(amazonAcctBatchOper)', function (data) {
        var optionNum = data.value;
        console.log(optionNum);
        if (3 == optionNum) {
            var acctIds = amazonAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改信息",
                area: ["500px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editAmazonSalesPersonLayer").html(),
                end: function () {
                    $("#editAmazonSalesPersonForm select[name=salespersonId]").val("");
                    $("#editAmazonSalesPersonForm select[name=salespersonLeader]").val("");
                    $("#editAmazonSalesPersonForm select[name=autoFollowSell]").val("");
                },
                success: function (layero, index) {
                    amazonAcct_getSalesPersion();
                    form.render("select");
                },
                yes: function () {
                    var salespersonId = $("#editAmazonSalesPersonForm select[name=salespersonId]").val();
                    var salesperson = $("#editAmazonSalesPersonForm select[name=salespersonId] option:selected").text();
                    var salesLeaderId = $("#editAmazonSalesPersonForm select[name=salespersonLeader]").val();
                    var salesLeaderName = $("#editAmazonSalesPersonForm select[name=salespersonLeader] option:selected").text();
                    var autoFollowSell = $("#editAmazonSalesPersonForm select[name=autoFollowSell]").val();
                    var autoFollowSellNum = $("#editAmazonSalesPersonForm input[name=autoFollowSellNum]").val();
                    var fulfillmentLatency = $("#editAmazonSalesPersonForm input[name=fulfillmentLatency]").val();
                    if(fulfillmentLatency == 0){
                        return layer.msg("处理时间不允许为0");
                    }
                    loading.show();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/editSalesPerson.html",
                        dataType: "json",
                        data: {
                            ids: acctIds,
                            salesperson: salesperson,
                            salespersonId: salespersonId,
                            sellLeaderId: salesLeaderId,
                            sellLeaderName: salesLeaderName,
                            autoFollowSell: autoFollowSell,
                            fulfillmentLatency: fulfillmentLatency,
                            platCode: 'amazon',
                            autoFollowSellNum: autoFollowSellNum
                        },
                        traditional: true,
                        success: function (returnData) {
                            loading.hide();
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("批量修改信息成功");
                                table.reload('amazonAcctTable');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        } else if (4 == optionNum) {
            var acctIds = amazonAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var obj = {
                idListStr: acctIds.toString(),
                orderDownStatus: true
            }
            form.render("select");
            batchUpdateOrderDownload(obj);

        } else if (5 == optionNum) {
            var acctIds = amazonAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var obj = {
                idListStr: acctIds.toString(),
                orderDownStatus: false
            }
            form.render("select");
            batchUpdateOrderDownload(obj);

        } else if (6 == optionNum) {//启用店铺
            layer.confirm('确定批量启用店铺吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function (index) {
                var acctIds = amazonAcct_getStoreAcctIds();
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
                var acctIds = amazonAcct_getStoreAcctIds();
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
            var acctIds = amazonAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改图片域名",
                area: ["600px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editAmazonDomainLayer").html(),
                end: function () {
                    $("#editAmazonDomainForm select[name=domainId]").val("");
                },
                success: function (layero, index) {
                    amazonAcct_getDomain();
                    form.render("select");
                },
                yes: function () {
                    var imgDomain = $("#editAmazonDomainForm select[name=domainId] option:selected").text();
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
                                table.reload('amazonAcctTable');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        }else if (9 == optionNum) { // 批量备注弹窗
            var acctIds = amazonAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "批量备注",
                area: ["500px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editAmazonRemark").html(),
                end: function () {
                    $("#editAmazonRemarkForm input[name=remark]").val("");
                },
                yes: function () {
                    let remark = $("#editAmazonRemarkForm input[name=remark]").val();

                    loading.show();
                    amazonAccountBatchEditRemark({ids: acctIds,remark:remark}).then((res)=>{
                        layer.closeAll();
                        layer.msg(res,{icon:1});
                        table.reload('amazonAcctTable');
                    })
                },
            });
        }
    });

    // 批量备注接口
    function amazonAccountBatchEditRemark(obj) {
        return commonReturnPromise({
            type: 'post',
            url: ctx + "/salesplat/batchEditRemark",
            params:JSON.stringify(obj),
            contentType:"application/json"
        })
    }

    function amazonAcct_getStoreAcctIds() {
        var acctIds = [];
        var checkStatus = table.checkStatus('amazonAcctTable'); //test即为基础参数id对应的值
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


    function checkRequiredData(dataObj) {
        if (dataObj.registerEmail == null || dataObj.registerEmail == '' || dataObj.registerEmail == undefined) {
            layer.msg('请输入注册邮箱');
            return false;
        }
        if (dataObj.openingSite == null || dataObj.openingSite == '' || dataObj.openingSite == undefined) {
            layer.msg('请选择开户站');
            return false;
        }
        if (dataObj.imgDomain == null || dataObj.imgDomain == '' || dataObj.imgDomain == undefined) {
            layer.msg('请输入图片地址');
            return false;
        }
        if (dataObj.brand == null || dataObj.brand == '' || dataObj.brand == undefined) {
            layer.msg('请输入默认品牌');
            return false;
        }
        // if (dataObj.sellerId == null || dataObj.sellerId == '' || dataObj.sellerId == undefined) {
        //     layer.msg('请输入MWS Merchat ID');
        //     return false;
        // }
        // if (dataObj.accessToken == null || dataObj.accessToken == '' || dataObj.accessToken == undefined) {
        //     layer.msg('请输入MWS授权令牌');
        //     return false;
        // }
        if (dataObj.salespersonId == null || dataObj.salespersonId == '' || dataObj.salespersonId == undefined) {
            layer.msg('请选择销售员');
            return false;
        }
        if (dataObj.salespersonLeader == null || dataObj.salespersonLeader == '' || dataObj.salespersonLeader == undefined) {
            layer.msg('请选择主管');
            return false;
        }
        if (dataObj.manufacturer == null || dataObj.manufacturer == '' || dataObj.manufacturer == undefined) {
            layer.msg('请输入制造商');
            return false;
        }
        if (dataObj.autoFollowSell == null || dataObj.autoFollowSell == '' || dataObj.autoFollowSell == undefined) {
            layer.msg('请选择跟卖与否');
            return false;
        }
        return true;
    }

    //监听iframe传参
    window.addEventListener('message', function(event){
      console.log('iframe接收到的数据是', event.data);
      let {syncStatus, searchType} = event.data;
      if(syncStatus){
        $('#amazonSyncListingStatus').val(syncStatus);
        form.render('select');
        $('#amazonSearch').trigger('click');
      }
      if(searchType){
        $('#amazon_acct_domain_overdue_number').parents('li').trigger('click');
      }
    });
});

function amazonAcct_getSalesPersion() {
    $("#amazonSalesPlatAccountAddForm input[name=fulfillmentLatency]").val(2);
    $("#amazonSalesPlatAccountAddForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#editAmazonSalesPersonForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#amazonSalesPlatAccountAddForm select[name=salespersonLeader]").html('<option value=""></option>');
    $("#editAmazonSalesPersonForm select[name=salespersonLeader]").html('<option value="">选择销售主管</option>');

    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "amazon专员"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#amazonSalesPlatAccountAddForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                        $("#editAmazonSalesPersonForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                    }
                }
            }
        }
    });

    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "amazon主管"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#amazonSalesPlatAccountAddForm select[name=salespersonLeader]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                        $("#editAmazonSalesPersonForm select[name=salespersonLeader]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                    }
                }
            }
        }
    });
}

/**
 * 请求图片域名列表
 */
function amazonAcct_getDomain() {
    $("#editAmazonDomainLayer select[name=domainId]").html('<option value="">选择域名</option>');
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
                        $("#editAmazonDomainForm select[name=domainId]")
                            .append('<option value="' + domainList[i].id + '">' + domainList[i].domain + '</option>')
                    }
                }
            }
        }
    });
}
