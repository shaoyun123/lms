/**
 * time: 2018/01/02
 */
console.log("wishAccount");
layui.use(["admin", "form", "table", "layer", "laytpl", 'element'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element,
        $ = layui.$;


    form.render("select");
    form.render("radio");
    form.render("checkbox");
    element.render('progress');

    //定义一个额外的搜索参数，区分tab选项卡
    var searchType = "1";

    //按钮的点击事件
    $("#wishAcct_addWishInfo").click(function () {
        var index = layer.open({
            type: 1,
            title: "设置平台账号信息",
            area: ["1000px", "500px"],
            btn: ["保存", "关闭"],
            content: $("#addWishInfoLayer").html(),
            success: function (layero, index) {
                wishAcct_getSalesPersion();
                form.render("select");
                form.render("radio");
                form.render("checkbox");
            },
            yes: function () {
                $("#addWishAcct").trigger("click");
                return; //虽然是我加的,但是就是脑子一动,感觉需要加,什么意思,不知道呀.....
            },
            end: function () {
                //$("#wishSalesPlatAccountAddForm")[0].reset();
                $("#wishAccount_reset").trigger("click");
                $("#wishSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                $("#wishSalesPlatAccountAddForm input[name='acctDetailId']").val("");
            },
        });
    });


    //wish订单下载
    // $("#wish_order_download").click(function () {
    //     var checkStatus = table.checkStatus('wishAcctTable'); //获取选择的店铺
    //     var checkAcctNum = checkStatus.data.length;
    //     if (checkAcctNum == null || checkAcctNum < 1) {
    //         layer.msg("请选择店铺");
    //         return;
    //     }
    //     var acctData = checkStatus.data;
    //     var acctIds = [];
    //     for (var index in acctData) {
    //         var obj = acctData[index];
    //         if (obj.status == true) {
    //             acctIds.push(acctData[index].id);
    //         }
    //     }
    //     if (acctIds.length < 1) {
    //         layer.msg("请选择启用的店铺");
    //         return;
    //     }
    //     var title = "确定要同步选中的" + checkAcctNum + "个店铺!";
    //     layer.confirm(title, {icon: 3}, function (index) {
    //         var platCode = "wish";
    //         /**提交同步任务**/
    //         $.ajax({
    //             url: ctx + '/wishOrder/batchDownloadOrders.html',
    //             type: 'post',
    //             data: {"acctIds": acctIds.join(","), "platCode": platCode},
    //             dataType: 'json',
    //             async: true,
    //             success: function (returnData) {
    //                 layer.msg("提交成功！");
    //             }, error: function () {
    //             }
    //         })
    //         layer.msg("提交成功！");
    //         layer.close;
    //     });
    // });


    //从旧OA同步token
    $("#wa_syncWishOaTokenBtn").click(function () {
        layer.confirm('从原OA系统同步所有token', {icon: 3}, function (index) {
            $.ajax({
                url: ctx + '/salesplat/syncwishoatoken.html',
                type: 'post',
                dataType: 'json',
                success: function (returnData) {
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, {icon: 2});
                    } else {
                        layer.msg("wishtoken同步成功");
                    }
                }
            })

        });
    });
    //同步lisiting
    $("#wish_syncWishListing").click(function () {
        var checkStatus = table.checkStatus('wishAcctTable'); //获取选择的店铺
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
            var platCode = "wish";
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
    if ($("#index_sync_fail_store").length > 0) {
        $("#wishSyncListingStatus").val($("#index_sync_fail_store").val());
        $("#index_sync_fail_store").remove();
        form.render('select');
    }
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#wishTable",
        method: "post",
        url: ctx + "/salesplat/salesPlatAccountDtoPage.html?platCode=wish",
        where: {
            status: $("#wishAcctSearchForm select[name='status'] option:selected").val(),
            syncStatus: $("#wishSyncListingStatus").val(),
            refreshTokenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:''),
            refreshTokenSevenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:''),
            searchType: searchType
        },
        cols: [
            [
                //标题栏
                {type: "checkbox"},
                {
                    field: "storeAcct",
                    title: "店铺名称",
                },
                // {
                //     field: "allrootAliasName",
                //     title: "普源别名",
                // },
                {
                    field: "storeLevel",
                    title: "店铺等级",
                },
                {
                    field: "accessTokenExpiryTime",
                    title: "Token到期时间",
                    templet: "#wishAccessTokenTpl",
                    width: 180
                },
                {field: "imgDomain", title: "图片域名",width: 200,
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
                {
                    field: "status",
                    title: "店铺状态",
                    templet: "#wishAcctStatusTpl",
                    width: 65
                },
                // {
                //     field: "orderDownloadStatus",
                //     title: "订单下载",
                //     templet: "#orderDownloadStatusTemplet",
                //     width: 90
                // },
                {field: "salesperson", title: "销售员"},
                {field: "sellLeaderName", title: "销售主管"},
                {
                    field: "listingUseCountInfo",
                    title: "Listing额度",
                    templet: d=>{
                         const listingLimit =[null,undefined].includes(d.listingLimit) ? '_' : d.listingLimit
                         const onlineItemCount =[null,undefined].includes(d.onlineItemCount) ? '_' : d.onlineItemCount
                         const remainingStoreProductNumber =[null,undefined].includes(d.remainingStoreProductNumber) ? '_' : d.remainingStoreProductNumber
                        return `<div>Listing总额度：<span class="listingLimit">${listingLimit}</span></div>
                        <div>Listing已使用：<span class="${onlineItemCount>listingLimit?'fRed':''}">${onlineItemCount}</span></div>
                        <div>剩余额度：<span class="${remainingStoreProductNumber<=0?'fRed':''}">${remainingStoreProductNumber}</span></div>`
                    },
                },
                {
                    field: "syncStatus",
                    title: "同步lisiting状态",
                    templet: "#wishSyncStatus",
                },
                {
                    field: "lastSyncTime",
                    title: "上次同步时间",
                    templet: "#wishLastSyncTime",
                },
                {
                    field: "syncDesc",
                    title: "同步异常备注",
                },
                {
                    field: "remark",
                    title: "备注"
                },
                //{ field: "city", title: "定时刊登" },
                //{ field: "experience", title: "操作" },
                //绑定工具条
                {
                    title: "操作",
                    align: "center",
                    toolbar: "#wishTableBar",
                },
            ],
        ],
        done: function (res, curr, count) {
            if(res.code == '0000'){
                $("#wishAccount_colLen").text(res.extra.mainTab);
                $("#wish_acct_domain_overdue_number").text(res.extra.sevenTab);
            }else{
                $("#wishAccount_colLen").text(0);
                $("#wish_acct_domain_overdue_number").text(0);
            }
            sessionStorage.clear("lastJumpParam")
            $('#wishTable').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
        },
        id: "wishAcctTable",
        page: true, //是否显示分页
        limits: [300, 500, 1000],
        limit: 500, //每页默认显示的数量
    });

    // 搜索
    var active = {
        reload: function () {
            var status = $(
                "#wishAcctSearchForm select[name='status'] option:selected"
            ).val();
            var syncStatus = $("#wishSyncListingStatus").val();//同步listing状态
            var storeAcct = $("#wishAcctSearchForm input[name='storeAcct']").val();
            var orgId = $("#wishAcctSearchForm select[name='orgId']").val();
            var salespersonId = $("#wishAcctSearchForm select[name='salespersonId']").val();
            // var orderDownloadStatus = $("#wishAcctSearchForm select[name='orderDownloadStatus'] option:selected").val();
            var syncDesc = $("#wishAcctSearchForm input[name='syncDesc']").val();
            var storeLevel = $("#wishAcctSearchForm select[name='storeLevel']").val();
            var listingQuotaRemainMin = $("#wishAcctSearchForm input[name='listingQuotaRemainMin']").val();
            var listingQuotaRemainMax = $("#wishAcctSearchForm input[name='listingQuotaRemainMax']").val();
            var listingQuotaUsedMin = $("#wishAcctSearchForm input[name='listingQuotaUsedMin']").val();
            var listingQuotaUsedMax = $("#wishAcctSearchForm input[name='listingQuotaUsedMax']").val();
            //执行重载
            table.reload("wishAcctTable", {
                where: {
                    status: status,
                    storeAcct: storeAcct,
                    syncStatus: syncStatus,
                    orgId: orgId,
                    salespersonId: salespersonId,
                    searchType: searchType,
                    // orderDownloadStatus: orderDownloadStatus,
                    syncDesc:syncDesc,
                    storeLevel,
                    listingQuotaRemainMin,
                    listingQuotaRemainMax,
                    listingQuotaUsedMin,
                    listingQuotaUsedMax,
                },
            });
        },
    };

    element.on('tab(wish_acct_tab_filter)', function (data) {
        searchType = $(this).attr("lay-id");
        active.reload();
    });

    $("#wishSearch").click(function () {
        var type = $(this).data("type");
        active[type] ? active[type].call(this) : "";
    });

    //添加wish账号提交事件
    form.on("submit(addWishAcct)", function (data) {
        //设置销售人员名称
        data.field["salesperson"] = $("#wishSalesPlatAccountAddForm select[name=salespersonId] option:selected").text();
        data.field["sellLeaderName"] = $("#wishSalesPlatAccountAddForm select[name=sellLeader] option:selected").text();
        data.field["sellLeaderId"] = $("#wishSalesPlatAccountAddForm select[name=sellLeader]").val();
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/addSalesPlatAccountBaseAndDetailInfo.html", //请求接口地址
            dataType: "json",
            data: data.field, //需要post的数据
            success: function (res) {
                loading.hide();
                //后台程序返回数据
                if (res.code == "0000") {
                    layer.closeAll();
                    layer.msg("操作成功");
                    // table.reload("wishAcctTable");//modify by zhaomin :要求编辑的时候不做页面刷新,而是直接修改页面的值
                    // if (data.field['acctBaseId']) {//如果有id,做更新
                    //     editObj.update({
                    //         'proxyServerIp': data.field['proxyServerIp'],
                    //         'imgDomain': data.field['imgDomain'],
                    //         'salespersonId': data.field['salespersonId'],
                    //         'salesperson': data.field['salesperson'],
                    //         'sellLeaderName': data.field['sellLeaderName'],
                    //         'storeLevel': data.field['storeLevel'],
                    //         'listingLimit': data.field['listingLimit'],
                    //     });
                    //     editObj.tr.find('.listingLimit').text(data.field['listingLimit'])
                    //     chekProxyIpObj.click();
                    // } else {
                        table.reload("wishAcctTable");
                    // }
                } else {
                    layer.msg(res.msg);
                }
            },
            error:function(res){
                loading.hide();
                layer.msg(res.responseJSON.msg || '操作失败');
            }
        });
        return false;
    });

    form.on("submit(delWishAcct)", function (data) {
        wishAcct_deleteSalesPlatAccount(data.field["acctBaseId"]);
        return false;
    });

    form.on("submit(reuseWishAcct)", function (data) {
        wishAcct_openSalesPlatAccount(data.field["acctBaseId"]);
        return false;
    });

    //搜索条件选择部门触发事件
    form.on('select(wishAcct-search-org-id)', function (data) {
        $("#wishAcctSearchForm select[name=salespersonId]").html('<option value="">选择销售人</option>');
        var orgId = data.value;
        //debugger;
        if (!orgId) {
            orgId = $(data.elem).find("option").eq(1).attr("value");
        }
        $.ajax({
            type: "post",
            url: ctx + "/sys/listuserbyorgcode.html",
            dataType: "json",
            data: {orgId: orgId},
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg);
                } else {
                    var accts = returnData.data;
                    if (accts.length > 0) {
                        for (var i = 0; i < accts.length; i++) {
                            $("#wishAcctSearchForm select[name=salespersonId]")
                                .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        }
                    }
                    form.render('select');
                }
            }
        });
    });

    var editObj;
    var chekProxyIpObj;
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on("tool(wishTable)", function (obj) {
        editObj = obj;
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === "tryConnect") {
            var _this = this;
            $.ajax({
                beforeSend: function () {
                    loading.show();
                },
                type: "POST",
                url: ctx + "/salesplat/tryConnect.html",
                data: {ip: data.proxyServerIp, port: data.proxyServerPort, storeAcctId: data.id},
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.closeAll();
                        layer.msg(returnData.msg);
                        $(_this).parent().prev().addClass('layui-bg-blue').text('√')
                    } else {
                        layer.msg(returnData.msg);
                        $(_this).parent().prev().removeClass('layui-bg-blue').text('x')
                    }
                },
                error: function () {
                    layer.msg("服务器正忙");
                },
                complete: function () {
                    loading.hide();
                }
            });
        } else if (layEvent === "restart") {
            $.ajax({
                type: "POST",
                url: ctx + "/salesplat/rebootInstance.html",
                data: {ip: data.proxyServerIp},
                async: false,
                dataType: "json",
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.closeAll();
                        layer.msg(returnData.msg);
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function () {
                    layer.msg("服务器正忙");
                },
            });
        } else if (layEvent === "edit") {
            chekProxyIpObj = $(this).parents("tr").find('td:nth-child(3)>div>span:last-child>a:first-child');//此处获取的是被编辑对象所在行的检测按钮
            layer.open({
                type: 1,
                title: "编辑平台账号信息",
                area: ["1000px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#addWishInfoLayer").html(),
                success: function (layero, index) {
                    wishAcct_getSalesPersion();
                    wishAcct_getSalesPlatAccountBaseAndDetailInfo(data.id);
                    form.render("select");
                    form.render("radio");
                    form.render("checkbox");
                },
                end: function () {
                    //$("#wishSalesPlatAccountAddForm")[0].reset();
                    $("#wishAccount_reset").trigger("click");
                    $("#wishSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                    $("#wishSalesPlatAccountAddForm input[name='acctDetailId']").val("");

                    $("#wishAcctReuseDiv").addClass("layui-hide");
                    $("#wishAcctDelDiv").addClass("layui-hide");
                },
                yes: function () {
                    var clientSecret = $("#wishSalesPlatAccountAddForm input[name='clientSecret']").val();
                    var imgDomain = $("#wishSalesPlatAccountAddForm input[name='imgDomain']").val();
                    var clientId = $("#wishSalesPlatAccountAddForm input[name='clientId']").val();
                    var salespersonId = $("#wishSalesPlatAccountAddForm select[name='salespersonId']").val();
                    var strRegex = "^http://";
                    var re = new RegExp(strRegex);
                    if(!re.test(imgDomain)) {
                        layer.msg("图片域名必须以http://开头");
                        return;
                    }
                    var result = checkRequiredData(clientSecret, imgDomain, clientId, salespersonId);
                    if (result) {
                        $("#addWishAcct").trigger("click");
                        return;
                    }
                },
            });
        } else if (layEvent == "generateAccessToken") {
            var index = layer.open({
                type: 1,
                title: "生成wish令牌",
                area: ["600px", "300px"],
                shadeClose: false,
                content: $("#wishTokenModalLayer").html(),
                btn: ["保存", "关闭"],
                yes: function (index, layero) {
                    $("#addWishAcctToken").trigger("click");
                    return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
                },
                success: function (layero) {
                    // 设置salesAcctId隐藏域
                    $("#wishTokenAddForm input[name='salesAcctId']").val(data.id);
                    $("#wishTokenAddForm input[name='clientId']").val(data.clientId);
                    $("#wishTokenAddForm input[name='clientSecret']").val(data.clientSecret);
                    form.render()
                    $("#wishAuthLinkUrl").attr('href', "https://china-merchant.wish.com/v3/oauth/authorize?client_id=" + data.clientId);
                },
                end: function () {
                    // $("#wishTokenAddForm")[0].reset();
                    $("#wishTokenAddForm").trigger('reset');
                    $("#wishTokenAddForm input[name='salesAcctId']").val("");
                },
            });
        } else if (layEvent === "refreshToken") {
            wishAcct_refreshAccessToken(data.acctDetailId);
        }else if(layEvent == 'checkAccessToken'){
          ztt_storeCommonCheckAuthFn(data.id, data.platCode);
        }
    });

    // 获取平台账号基本和辅助信息
    function wishAcct_getSalesPlatAccountBaseAndDetailInfo(salesPlatAccountId) {
        if (typeof salesPlatAccountId == "undefined") {
            layer.msg("服务器正忙");
            return;
        }
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/getSalesPlatAccountBaseAndDetailInfo.html",
            data: {id: salesPlatAccountId},
            async: false,
            dataType: "json",
            success: function (returnData) {
                // base
                $("#wishSalesPlatAccountAddForm input[name='acctBaseId']").val(returnData.acctBaseId);
                if (returnData.currency) {
                    $("#wishSalesPlatAccountAddForm select[name='currency']").val(
                        returnData.currency
                    );
                }
                $("#wishSalesPlatAccountAddForm input[name='storeAcct']").val(returnData.storeAcct);
                $("#wishSalesPlatAccountAddForm input[name='proxyServerIp']").val(returnData.proxyServerIp);
                $("#wishSalesPlatAccountAddForm input[name='imgDomain']").val(returnData.imgDomain);
                $("#wishSalesPlatAccountAddForm input[name='allrootAliasName']").val(returnData.allrootAliasName);
                $("#wishSalesPlatAccountAddForm input[name='taxNumber']").val(returnData.taxNumber);
                $("#wishSalesPlatAccountAddForm input[name='eoriNumber']").val(returnData.eoriNumber);
                $("#wishSalesPlatAccountAddForm textarea[name='acctBaseRemark']").val(returnData.acctBaseRemark);
                $("#wishSalesPlatAccountAddForm select[name=salespersonId]").val(returnData.salespersonId);
                $("#wishSalesPlatAccountAddForm select[name=sellLeader]").val(returnData.sellLeaderId);
                form.render('select');
                // detail
                $("#wishSalesPlatAccountAddForm input[name='acctDetailId']").val(
                    returnData.acctDetailId
                );
                $("#wishSalesPlatAccountAddForm input[name='salesAcctId']").val(
                    returnData.salesAcctId
                );
                $("#wishSalesPlatAccountAddForm input[name='clientId']").val(
                    returnData.clientId
                );
                $("#wishSalesPlatAccountAddForm input[name='clientSecret']").val(
                    returnData.clientSecret
                );
                $("#wishSalesPlatAccountAddForm select[name=storeLevel]").val(returnData.storeLevel);
                $("#wishSalesPlatAccountAddForm input[name=listingLimit]").val(returnData.listingLimit);

                if (returnData.status == false) {
                    $("#wishAcctReuseDiv").removeClass("layui-hide");
                } else {
                    $("#wishAcctDelDiv").removeClass("layui-hide");
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
        });
    }

    form.on('select(wishSalesPlatAccountAddForm-storeLevel)',function(data){
        const { value } = data
        const optionList=[
            {label:'Platinum 铂',value:'2000'},
            {label:'Gold 黄金',value:'1000'},
            {label:'Silver 银',value:'500'},
            {label:'Bronze 青铜',value:'200'},
            {label:'At Risk 有风险',value:'50'},
            {label:'Unrated未评级',value:'50'},
        ]
        if(value){
            const curObj = optionList.find(v=>v.label === value)
            $('#wishSalesPlatAccountAddForm').find('input[name=listingLimit]').val(curObj.value)
        }
    })

    //停用店铺账号
    function wishAcct_deleteSalesPlatAccount(salesPlatAccountId) {
        if (typeof salesPlatAccountId == "undefined") {
            layer.msg("服务器正忙");
            return;
        }
        layer.confirm("是否停用此账号？", function (result) {
            if (result) {
                $.ajax({
                    url: ctx + "/salesplat/deleteSalesPlatAccount.html",
                    data: {id: salesPlatAccountId},
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg(returnData.msg);
                            table.reload("wishAcctTable");
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    },
                });
            }
        });
    }

    //启用店铺
    function wishAcct_openSalesPlatAccount(salesPlatAccountId) {
        if (typeof salesPlatAccountId == "undefined") {
            layer.msg("服务器正忙");
            return;
        }
        layer.confirm("是否启用此账号？", function (result) {
            if (result) {
                $.ajax({
                    url: ctx + "/salesplat/openSalesPlatAccount.html",
                    data: {id: salesPlatAccountId},
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg(returnData.msg);
                            table.reload("wishAcctTable");
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    },
                });
            }
        });
    }

    // 获取token
    form.on("submit(addWishAcctToken)", function (data) {
        // if(data.field.type == undefined){
        //     data.field.type = false;
        // }
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/getWishToken.html",
            dataType: "json",
            data: data.field,
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg("生成token成功");
                    //$("#wishTokenModal").modal('hide');
                    //queryPage(searchData, salesPlatAccountUrl, salesPlatAccountTmpUrl);
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
        });
        return false;
    });

    //刷新令牌
    function wishAcct_refreshAccessToken(acctDetailId) {
        layer.confirm("刷新令牌会改变原有令牌，确定刷新吗？除非时间快过期，尽量不要刷新", function (result) {
            if (result) {
                layui.admin.load.show()
                $.ajax({
                    type: "POST",
                    url: ctx + "/salesplat/refreshAccessToken.html",
                    data: {id: acctDetailId},
                    dataType: "json",
                    success: function (returnData) {
                        layui.admin.load.hide()
                        if (returnData.code == "0000") {
                            layer.msg("操作成功");
                            table.reload("wishAcctTokenTable");
                        } else {
                            layer.msg("系统异常:" + returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    },
                });
            }
        });
    }

    form.on('select(wishAcctBatchOper)', function (data) {
        var optionNum = data.value;
        if (3 == optionNum) {
            var acctIds = wishAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改信息",
                area: ["500px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editWishSalesPersonLayer").html(),
                end: function () {
                    $("#editWishSalesPersonForm select[name=salespersonId]").val("");
                    $("#editWishSalesPersonForm select[name=salespersonLeaderId]").val("");
                },
                success: function (layero, index) {
                    wishAcct_getSalesPersion();
                    form.on('select(editWishSalesPersonForm-storeLevel)',function(data){
                        const { value } = data
                        const optionList=[
                            {label:'Platinum 铂',value:'2000'},
                            {label:'Gold 黄金',value:'1000'},
                            {label:'Silver 银',value:'500'},
                            {label:'Bronze 青铜',value:'200'},
                            {label:'At Risk 有风险',value:'50'},
                            {label:'Unrated未评级',value:'50'},
                        ]
                        if(value){
                            const curObj = optionList.find(v=>v.label === value)
                            $('#editWishSalesPersonForm').find('input[name=listingLimit]').val(curObj.value)
                        }
                    })
                    form.render("select");
                },
                yes: function () {
                    var salespersonId = $("#editWishSalesPersonForm select[name=salespersonId]").val();
                    var salesperson = $("#editWishSalesPersonForm select[name=salespersonId] option:selected").text();
                    var sellLeaderId = $("#editWishSalesPersonForm select[name=salespersonLeaderId]").val();
                    var sellLeaderName = $("#editWishSalesPersonForm select[name=salespersonLeaderId] option:selected").text();
                    var storeLevel = $("#editWishSalesPersonForm select[name=storeLevel]").val();
                    var listingLimit = $("#editWishSalesPersonForm input[name=listingLimit]").val();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/editSalesPersonForWish.html",
                        dataType: "json",
                        contentType: 'application/json;charset=UTF-8',
                        data: JSON.stringify({
                            ids: acctIds,
                            platCode: 'wish',
                            salesperson: salesperson,
                            salespersonId: salespersonId,
                            sellLeaderId: sellLeaderId,
                            sellLeaderName: sellLeaderName,
                            storeLevel,
                            listingLimit
                        }),
                        traditional: true,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                table.reload("wishAcctTable");
                                layer.msg("批量修改信息成功");
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        }else if(9==optionNum){
            var acctIds = wishAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改图片域名",
                area: ["600px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editWishDomainLayer").html(),
                end: function () {
                    $("#editWishDomainForm select[name=domainId]").val("");
                },
                success: function (layero, index) {
                    wishAcct_getDomain();
                    form.render("select");
                },
                yes: function () {
                    var imgDomain = $("#editWishDomainForm select[name=domainId] option:selected").text();
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
                                table.reload('wishAcctTable');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        } else if (4 == optionNum) {
            var acctIds = wishAcct_getStoreAcctIds();
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
            var acctIds = wishAcct_getStoreAcctIds();
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
                var acctIds = wishAcct_getStoreAcctIds();
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
                var acctIds = wishAcct_getStoreAcctIds();
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
        } else if (8 == optionNum) {//批量修改币种 batchEditCurrency
            var acctIdList = wishAcct_getStoreAcctIds();
            if (acctIdList.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            layer.open({
                type: 1,
                title: "批量修改币种",
                area: ["500px", "300px"],
                btn: ["确定", "取消"],
                content: $("#batchUpdateAcctCurrencyLayer").html(),
                success: function (layero, index) {
                    form.render("select");
                },
                yes: function () {
                    var currency = $("#batchUpdateAcctCurrencyForm select[name='currency']").val();
                    if (currency == null) {
                        layer.msg("请选择币种！");
                        return;
                    }
                    var obj = {
                        acctIdStr: acctIdList.toString(),
                        currency: currency
                    };
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/batchEditCurrency.html",
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify(obj),
                        traditional: true,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                table.reload("wishAcctTable");
                                layer.closeAll();
                                layer.msg("批量修改币种成功");
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    })
                    ;

                },
            });

        }
    });
    function wishAcct_getDomain() {
        $("#editWishDomainLayer select[name=domainId]").html('<option value="">选择域名</option>');
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
                    if (domainList.length > 0) {
                        for (var i = 0; i < domainList.length; i++) {
                            $("#editWishDomainForm select[name=domainId]")
                                .append('<option value="' + domainList[i].id + '">' + domainList[i].domain + '</option>')
                        }
                    }
                }
            }
        });
    }
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

    function wishAcct_getStoreAcctIds() {
        var acctIds = [];
        var checkStatus = table.checkStatus('wishAcctTable'); //test即为基础参数id对应的值
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
    function checkRequiredData(clientSecret, imgDomain, clientId, salespersonId) {
        if (clientSecret == null || clientSecret == '' || clientSecret == undefined) {
            layer.msg('请输入clientSecret');
            return false;
        }
        if (imgDomain == null || imgDomain == '' || imgDomain == undefined) {
            layer.msg('请输入图片域名');
            return false;
        }
        if (clientId == null || clientId == '' || clientId == undefined) {
            layer.msg("请输入clientId");
            return false;
        }
        if (salespersonId == null || salespersonId == '' || salespersonId == undefined) {
            layer.msg("请选择销售员");
            return false;
        }
        return true;
    }
    
    //监听iframe传参
    window.addEventListener('message', function(event){
      console.log('iframe接收到的数据是', event.data);
      let {syncStatus, searchType} = event.data;
      if(syncStatus){
        $('#wishSyncListingStatus').val(syncStatus);
        form.render('select');
        $('#wishSearch').trigger('click');
      }
      if(searchType){
        $('#wish_acct_domain_overdue_number').parents('li').trigger('click');
      }
    });
});

function wishAcct_getSalesPersion() {
    $("#wishSalesPlatAccountAddForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#editWishSalesPersonForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#wishSalesPlatAccountAddForm select[name=sellLeader]").html('<option value=""></option>');
    $("#editWishSalesPersonForm select[name=salespersonLeaderId]").html('<option value="">选择销售主管</option>');
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "wish专员"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#wishSalesPlatAccountAddForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        $("#editWishSalesPersonForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')

                    }
                }
            }
        }
    });
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "wish主管"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#wishSalesPlatAccountAddForm select[name=sellLeader]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        $("#editWishSalesPersonForm select[name=salespersonLeaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                    }
                }
            }
        }
    });
}