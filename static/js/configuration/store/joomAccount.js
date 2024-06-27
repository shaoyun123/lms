/**
 * time: 2018/01/02
 */

layui.use(["admin", "form", "table", "layer", "laytpl"], function() {
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
    render_hp_orgs_users("#joomAcctSearchForm"); //渲染部门销售员店铺三级联动

    //按钮的点击事件
    $("#addJoomInfo").click(function() {
        var index = layer.open({
            type: 1,
            title: "添加joom账号",
            area: ["1000px", "450px"],
            shadeClose: false,
            content: $("#addJoomInfoLayer").html(),
            btn: ['保存', '关闭'],
            success: function() {
                joomAcct_getSalesPersion();
                form.render('select');
            },
            yes: function() {
                $('#addJoomAcct').trigger("click");
                return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
            },
            end: function() {
                // $("#joomSalesPlatAccountAddForm")[0].reset();
                $("#joomSalesPlatAccountAddForm").trigger('reset');
                $("#joomSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                $("#joomSalesPlatAccountAddForm input[name='acctDetailId']").val("");
            }
        });
    });
    if ($("#index_sync_fail_store").length > 0) {
        $("#joomSyncListingStatus").val($("#index_sync_fail_store").val());
        $("#index_sync_fail_store").remove();
        form.render('select');
    }
    //表格渲染结果
    //展示已知数据
    function joomAccount_tableRender(){
      table.render({
        elem: "#joomTable",
        method: "post",
        url: ctx + "/salesplat/getJoomStoreAcctInfo",
        where: {
            status: $("#joomAcctSearchForm select[name='status'] option:selected").val(),
            syncStatus: $("#joomSyncListingStatus").val(),
            storeAcct: $("#joomAcctSearchForm input[name='storeAcct']").val(),
            syncDesc: $("#joomAcctSearchForm input[name='syncDesc']").val(),
            orgId: $("#joom_account_depart_sel").val(),
            salespersonId: $("#joom_account_salesman_sel").val(),
            // orderDownloadStatus: $("#joomAcctSearchForm select[name='orderDownloadStatus'] option:selected").val(),
            searchType: searchType,
            refreshTokenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:''),
            refreshTokenSevenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:'')
        },
        cols: [
            [
                //标题栏
                { type: "checkbox" },
                {
                    field: "storeAcct",
                    title: "店铺名称",
                },
                // {
                //     field: "allrootAliasName",
                //     title: "普源别名",
                // },
                { field: "refreshTokenExpiryTime", title: "refresh_token到期时间", templet: '#joomAccessTokenTpl' },
                {
                    field: "imgDomain",
                    title: "图片域名",
                    width: 200,
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
                { field: "status", title: "店铺状态", templet: '#joomAcctStatusTpl', width: 65 },
                // { field: "orderDownloadStatus", title: "订单下载", templet: "#orderDownloadStatusTemplet", width: 90 },
                { field: "salesperson", title: "销售员" },
                { field: "sellLeaderName", title: "销售主管" },
                {
                    field: "syncStatus",
                    title: "同步lisiting状态",
                    templet: "#joomSyncStatus"
                },
                {
                    field: "autoDeleteInfo",
                    title: "自动删除",
                    templet: "#joomAccount_autoDeleteInfo",
                    width: 140
                },
                {
                    field: "autoDelete",
                    title: "删除设置",
                    templet: "#joomAccount_autoDelete"
                },
                {
                    field: "quota",
                    title: "额度/已用额度/活性产品",
                    templet: "#joomAccount_quota"
                },
                {
                    field: "lastSyncTime",
                    title: "上次同步时间",
                    templet: "#joomLastSyncTime"
                },
                {
                    field: "syncDesc",
                    title: "同步异常备注"
                },
                {
                    field: "remark",
                    title: "备注"
                },
                //{ field: "city", title: "定时刊登" },
                //{ field: "experience", title: "操作" },
                //绑定工具条
                { title: '操作', align: 'center', toolbar: '#joomTableBar' }
            ],
        ],
        done: function(res, curr, count) {
            if(res.code == '0000'){
                $("#joomAccount_colLen").text(res.extra.mainTab);
                $("#joom_acct_domain_overdue_number").text(res.extra.sevenTab);
            }else{
                $("#joomAccount_colLen").text(0);
                $("#joom_acct_domain_overdue_number").text(0);
            }
            sessionStorage.clear("lastJumpParam")
            theadHandle().fixTh({ id: '#joomaccountCard' })
        },
        id: 'joomAcctTable',
        page: true, //是否显示分页
        limits: [300, 500, 1000],
        limit: 500, //每页默认显示的数量
      });
    }
   

    // 搜索
    // var active = {
    //     reload: function() {
    //         var status = $("#joomAcctSearchForm select[name='status'] option:selected").val();
    //         var storeAcct = $("#joomAcctSearchForm input[name='storeAcct']").val();
    //         var syncStatus = $("#joomSyncListingStatus").val(); //同步listing状态
    //         var orgId = $("#joom_account_depart_sel").val();
    //         var salespersonId = $("#joom_account_salesman_sel").val();
    //         var orderDownloadStatus = $("#joomAcctSearchForm select[name='orderDownloadStatus'] option:selected").val();
    //         var syncDesc = $("#joomAcctSearchForm input[name='syncDesc']").val();
    //         //执行重载
    //         table.reload('joomAcctTable', {
    //             where: {
    //                 status: status,
    //                 storeAcct: storeAcct,
    //                 syncStatus: syncStatus,
    //                 orgId: orgId,
    //                 salespersonId: salespersonId,
    //                 searchType: searchType,
    //                 orderDownloadStatus: orderDownloadStatus,
    //                 syncDesc: syncDesc
    //             }
    //         });
    //     }
    // };

    element.on('tab(joom_acct_tab_filter)', function(data) {
        searchType = $(this).attr("lay-id");
        $('#joomSearch').trigger('click');
    });

    $('#joomSearch').click(function() {
      joomAccount_tableRender();
    });
    //同步lisiting
    $("#joom_syncJoomListing").click(function() {
        var checkStatus = table.checkStatus('joomAcctTable'); //获取选择的店铺
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
        layer.confirm(title, { icon: 3 }, function(index) {
            var platCode = "joom";
            var showListingPrecent = platCode + "ShowListingPrecent"; //显示进度条百分比的元素
            var showListingContent = platCode + "ShowListingContent"; //显示进度内容
            var showListingErrorMsg = platCode + "ShowListingErrorMsg"; //显示错误的店铺
            var batchNo = new Date().getTime(); //本次同步任务流水号
            /**提交同步任务**/
            $.ajax({
                    url: ctx + '/syncItem/batchSyncPlatListing.html',
                    type: 'post',
                    data: { "acctIds": acctIds.join(","), "batchNo": batchNo, "platCode": platCode },
                    dataType: 'json',
                    success: function(returnData) {
                        element.progress('wishShowListingPrecent', returnData.data.precent);
                        $("#" + showListingContent).html(returnData.data.content);
                        if (returnData.data.errorMsg != null && returnData.data.errorMsg != '') {
                            $("#" + showListingErrorMsg).html("<p>异常店铺：</p>" + returnData.data.errorMsg);
                        }
                    },
                    error: function() {
                        layer.msg("提交店铺listing同步任务失败");
                    }
                })
                /**
                 * 查询同步进度的定时任务
                 */
            var listInterval = setInterval(function() {
                $.ajax({
                    url: ctx + '/syncItem/getSyncProcessByBatchNo.html',
                    type: 'post',
                    data: { batchNo: batchNo, "platCode": platCode },
                    dataType: 'json',
                    success: function(returnData) {
                        try {
                            var content = returnData.data.content;
                            var errorMsg = returnData.data.errorMsg; //错误信息
                            element.progress(showListingPrecent, returnData.data.precent);
                            $("#" + showListingContent).html(content);
                            if (errorMsg != null && errorMsg != '') {
                                errorMsg = "<p style='padding-left: 10px;'>" + errorMsg + "</p>";
                                $("#" + showListingErrorMsg).html("<p>异常店铺：</p>" + errorMsg);
                            }
                            if (content != null && content.indexOf("完成") > -1) {
                                clearInterval(listInterval); //清除定时任务
                            }
                        } catch (e) {
                            element.progress(showListingPrecent, "100%");
                            clearInterval(listInterval); //清除定时任务
                        }
                    },
                    error: function() {
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
                yes: function(index, layero) {
                    clearInterval(listInterval);
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            });
        });
    });
    form.on('submit(addJoomAcct)', function(data) {
        data.field["salesperson"] = $("#joomSalesPlatAccountAddForm select[name=salespersonId] option:selected").text();
        data.field["sellLeaderId"] = $("#joomSalesPlatAccountAddForm select[name=sellLeaderId]").val();
        data.field["sellLeaderName"] = $("#joomSalesPlatAccountAddForm select[name=sellLeaderId] option:selected").text();
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/addSalesPlatAccountBaseAndDetailInfo.html", //请求接口地址
            dataType: "json",
            data: data.field, //需要post的数据
            success: function(res) { //后台程序返回数据
                loading.hide();
                if (res.code == '0000') {
                    layer.closeAll();
                    layer.msg('操作成功');
                    table.reload('joomAcctTable');
                } else {
                    layer.msg(res.msg);
                }
            }
        });
        return false;
    });

    form.on('submit(delJoomAcct)', function(data) {
        joomAcct_deleteSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    form.on('submit(reuseJoomAcct)', function(data) {
        joomAcct_openSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(joomTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent === 'edit') {
            var index = layer.open({
                type: 1,
                title: "设置平台账号信息",
                area: ["1000px", "480px"],
                shadeClose: false,
                content: $("#addJoomInfoLayer").html(),
                btn: ['保存', '关闭'],
                yes: function() {
                    var dataObj = {
                        clientId: $("#joomSalesPlatAccountAddForm input[name='clientId']").val(),
                        clientSecret: $("#joomSalesPlatAccountAddForm input[name='clientSecret']").val(),
                        imgDomain: $("#joomSalesPlatAccountAddForm input[name='imgDomain']").val(),
                        salespersonId: $("#joomSalesPlatAccountAddForm select[name='salespersonId']").val(),
                        listingLimit: $("#joomSalesPlatAccountAddForm input[name='listingLimit']").val()
                    }
                    var strRegex = "^http://";
                    var re = new RegExp(strRegex);
                    if (!re.test(dataObj.imgDomain)) {
                        layer.msg("图片域名必须以http://开头");
                        return;
                    }
                    var result = checkRequiredData(dataObj);
                    if (result) {
                        $('#addJoomAcct').trigger("click");
                        return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
                    }
                },
                success: function(layero, index) {
                    joomAcct_getSalesPersion();
                    joomAcct_getSalesPlatAccountBaseAndDetailInfo(data.id);
                    form.render('select');
                    form.render('radio');
                    form.render('checkbox');
                },
                end: function() {
                    // $("#joomSalesPlatAccountAddForm")[0].reset();
                    $("#joomSalesPlatAccountAddForm").trigger('reset');
                    $("#joomSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                    $("#joomSalesPlatAccountAddForm input[name='acctDetailId']").val("");

                    $("#joomAcctReuseDiv").addClass('layui-hide');
                    $("#joomAcctDelDiv").addClass('layui-hide');
                }
            });
        } else if (layEvent == 'generateAccessToken') {
            var index = layer.open({
                type: 1,
                title: "生成joom令牌",
                area: ["800px", "300px"],
                shadeClose: false,
                content: $("#joomTokenModalLayer").html(),
                btn: ['保存', '关闭'],
                yes: function(index, layero) {
                    layero.find('#addJoomAcctToken').click();
                    return;
                    // layer.close(index);
                },
                success: function() {
                    // 设置salesAcctId隐藏域
                    $("#joomTokenAddForm input[name='salesAcctId']").val(data.id);
                    $("#joomTokenAddForm input[name='clientId']").val(data.clientId);
                    $("#joomTokenAddForm input[name='clientSecret']").val(data.clientSecret);
                    $("#joomTokenAddForm input[name='clientSecret']").val(data.clientSecret);
                    $("#joomAuthLinkUrl").attr('href', "https://api-merchant.joom.com/api/v2/oauth/authorize?client_id=" + data.clientId);

                },
                end: function() {
                    // $("#joomTokenAddForm")[0].reset();
                    $("#joomTokenAddForm").trigger('reset');
                    $("#joomTokenAddForm input[name='salesAcctId']").val("");
                }
            });
        } else if (layEvent === 'refreshToken') {
            joomAcct_refreshAccessToken(data.acctDetailId);
        } else if (layEvent == 'notSet' || layEvent == 'hasSet') {
            joomAccount_autoDeleteFn(data);
        }else if(layEvent == 'checkAccessToken'){
          ztt_storeCommonCheckAuthFn(data.id, data.platCode);
        }
    });
    //单个-自动删除函数
    function joomAccount_autoDeleteFn(data) {
        layer.open({
            type: 1,
            title: '自动删除设置',
            area: ['40%', '40%'],
            btn: ['保存', '关闭'],
            content: $('#joomAccount_autoDeleteLayer').html(),
            id: 'joomAccount_autoDeleteLayerId',
            success: function(layero, index) {
                var getTpl = joomAccount_autoDeleteLayer_containerTpl.innerHTML,
                    view = document.getElementById('joomAccount_autoDeleteLayer_container');
                laytpl(getTpl).render(data, function(html) {
                    view.innerHTML = html;
                    form.render();
                });
            },
            yes: function(index, layero) {
                var formData = $('#joomAccount_autoDeleteLayer_container_form').serializeObject();
                formData.storeAcctId = data.id;
                commonReturnPromise({
                    type: 'put',
                    contentType: 'application/json',
                    url: `/lms/onlineProductJoom/autoDelete`,
                    params: JSON.stringify(formData)
                }).then(res => {
                    layer.msg(res || '保存成功', { icon: 1 });
                    layer.close(index);
                    $('#joomSearch').click();
                }).catch(err => {
                    layer.alert(err, { icon: 2 });
                })
            }
        });
    }

    // 获取平台账号基本和辅助信息
    function joomAcct_getSalesPlatAccountBaseAndDetailInfo(salesPlatAccountId) {
        if (typeof(salesPlatAccountId) == "undefined") {
            layer.msg('服务器正忙');
            return;
        }
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/getSalesPlatAccountBaseAndDetailInfo.html",
            data: { "id": salesPlatAccountId },
            async: false,
            dataType: "json",
            success: function(returnData) {
                // base
                $("#joomSalesPlatAccountAddForm input[name='acctBaseId']").val(returnData.acctBaseId);
                $("#joomSalesPlatAccountAddForm input[name='storeAcct']").val(returnData.storeAcct);
                $("#joomSalesPlatAccountAddForm input[name='imgDomain']").val(returnData.imgDomain);
                $("#joomSalesPlatAccountAddForm input[name='allrootAliasName']").val(returnData.allrootAliasName);
                $("#joomSalesPlatAccountAddForm input[name='taxNumber']").val(returnData.taxNumber);
                $("#joomSalesPlatAccountAddForm input[name='eoriNumber']").val(returnData.eoriNumber);
                $("#joomSalesPlatAccountAddForm textarea[name='acctBaseRemark']").val(returnData.acctBaseRemark);
                $("#joomSalesPlatAccountAddForm select[name=salespersonId]").val(returnData.salespersonId);
                $("#joomSalesPlatAccountAddForm select[name=sellLeaderId]").val(returnData.sellLeaderId);
                form.render('select');
                $("#joomSalesPlatAccountAddForm input[name=listingLimit]").val(returnData.listingLimit);

                // detail
                $("#joomSalesPlatAccountAddForm input[name='acctDetailId']").val(returnData.acctDetailId);
                $("#joomSalesPlatAccountAddForm input[name='salesAcctId']").val(returnData.salesAcctId);
                $("#joomSalesPlatAccountAddForm input[name='clientId']").val(returnData.clientId);
                $("#joomSalesPlatAccountAddForm input[name='clientSecret']").val(returnData.clientSecret);

                if (returnData.status == false) {
                    $("#joomAcctReuseDiv").removeClass('layui-hide');
                } else {
                    $("#joomAcctDelDiv").removeClass('layui-hide');
                }
            },
            error: function() {
                layer.msg("服务器正忙");
            }
        });
    }

    //停用店铺账号
    function joomAcct_deleteSalesPlatAccount(salesPlatAccountId) {
        if (typeof(salesPlatAccountId) == "undefined") {
            layer.msg('服务器正忙');
            return;
        }
        layer.confirm('是否停用此账号？', function(result) {
            if (result) {
                $.ajax({
                    url: ctx + '/salesplat/deleteSalesPlatAccount.html',
                    data: { "id": salesPlatAccountId },
                    dataType: "json",
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg(returnData.msg);
                            table.reload('joomAcctTable');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function() {
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }

    //启用店铺
    function joomAcct_openSalesPlatAccount(salesPlatAccountId) {
        if (typeof(salesPlatAccountId) == "undefined") {
            layer.msg("服务器正忙");
            return;
        }
        layer.confirm("是否启用此账号？", function(result) {
            if (result) {
                $.ajax({
                    url: ctx + '/salesplat/openSalesPlatAccount.html',
                    data: { "id": salesPlatAccountId },
                    dataType: "json",
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg(returnData.msg);
                            table.reload('joomAcctTable');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function() {
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }


    // 获取token
    form.on('submit(addJoomAcctToken)', function(data) {
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/getJoomToken.html",
            dataType: "json",
            data: data.field,
            success: function(returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg("生成token成功");
                    table.reload('joomAcctTable');
                    //$("#joomTokenModal").modal('hide');
                    //queryPage(searchData, salesPlatAccountUrl, salesPlatAccountTmpUrl);
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function() {
                layer.msg("服务器正忙");
            }
        });
        // var newTab = window.open('about:blank');//防止弹框禁用被拦截
        // $.ajax({
        //     url: ctx + "/salesplat/unLogin/getJoomAuthorizationCode.html",
        //     dataType: "json",
        //     data: data.field,
        //     success: function (returnData) {
        //         if (returnData.code == "0000") {
        //             //window.open(returnData.body, "_blank");
        //             newTab.location.href = returnData.data;
        //             layer.close();
        //         } else {
        //             layer.msg(returnData.msg);
        //         }
        //     },
        //     error: function () {
        //         layer.msg("服务器正忙");
        //     }
        // });
        return false;
    });

    //刷新令牌
    function joomAcct_refreshAccessToken(apiAssisConfigId) {
        layer.confirm("刷新令牌会改变原有令牌，确定刷新吗？除非时间快过期，尽量不要刷新", function(result) {
            if (result) {
                $.ajax({
                    type: "POST",
                    url: ctx + "/salesplat/refreshAccessToken.html",
                    data: { "id": apiAssisConfigId },
                    dataType: "json",
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.msg("操作成功");
                            table.reload('joomAcctTable');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function() {
                        layer.msg("服务器正忙");
                    }
                });
            }
        });
    }

    //从旧OA同步token
    $("#joom_syncjoomOaTokenBtn").click(function() {
        layer.confirm('从原OA系统同步所有token', { icon: 3 }, function(index) {
            $.ajax({
                url: ctx + '/salesplat/syncjoomOaToken.html',
                type: 'post',
                dataType: 'json',
                success: function(returnData) {
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                    } else {
                        layer.msg("wishtoken同步成功");
                    }
                }
            })

        });
    });

    form.on('select(joomAcctBatchOper)', function(data) {
        var optionNum = data.value;
        // console.log(optionNum);
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
                content: $("#editJoomSalesPersonLayer").html(),
                end: function() {
                    $("#editJoomSalesPersonForm select[name=salespersonId]").val("");
                    $("#editJoomSalesPersonForm select[name=sellLeaderId]").val("");
                },
                success: function(layero, index) {
                    joomAcct_getSalesPersion();
                    form.render("select");
                },
                yes: function() {
                    var salespersonId = $("#editJoomSalesPersonForm select[name=salespersonId]").val();
                    var salesperson = $("#editJoomSalesPersonForm select[name=salespersonId] option:selected").text();
                    var sellLeaderId = $("#editJoomSalesPersonForm select[name=sellLeaderId]").val();
                    var sellLeaderName = $("#editJoomSalesPersonForm select[name=sellLeaderId] option:selected").text();
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
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("批量修改信息成功");
                                table.reload('joomAcctTable');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        } else if (4 == optionNum) {
            var acctIds = getStoreAcctIds();
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
            var acctIds = getStoreAcctIds();
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

        } else if (6 == optionNum) {
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
                content: $("#editJoomDomainLayer").html(),
                end: function() {
                    $("#editJoomDomainForm select[name=domainId]").val("");
                },
                success: function(layero, index) {
                    joomAcct_getDomain();
                    form.render("select");
                },
                yes: function() {
                    var imgDomain = $("#editJoomDomainForm select[name=domainId] option:selected").text();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/batchUpdateImgDomain.html",
                        dataType: "json",
                        data: { idListStr: acctIds, imgDomain: imgDomain },
                        traditional: true,
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("修改图片域名成功");
                                table.reload('joomAcctTable');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        } else if (7 == optionNum) { //启用店铺
            layer.confirm('确定批量启用店铺吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function(index) {
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
        } else if (8 == optionNum) { //批量停用店铺
            layer.confirm('确定批量停用店铺吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function(index) {
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
        } else if (9 == optionNum) { //批量自动删除
            var acctIds = getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺", { icon: 2 });
                return;
            }
            joomAccount_autoDeleteBatchFn(acctIds);
        }else if (10 == optionNum) { //批量修改店铺额度
            var acctIds = getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺", { icon: 2 });
                return;
            }
            joomAccountEditAcctQuota(acctIds);
        }
    });
    function joomAccountEditAcctQuota(ids) {
        layer.open({
            type: 1,
            title: '修改店铺额度',
            area: ['300px', '40%'],
            btn: ['保存', '关闭'],
            content: $('#joomAccountEditAcctQuotaLayer').html(),
            id: 'joomAccountEditAcctQuota',
            yes: function(index, layero) {
                var formData = $('#joomAccountEditAcctQuotaForm').serializeObject();
                if(formData.newListingLimit == ''|| !isInteger(formData.newListingLimit) || formData.newListingLimit <= 0){
                    return layer.msg("请输入正确的店铺额度")
                }
                commonReturnPromise({
                    type: 'put',
                    contentType: 'application/json',
                    url: `/lms/salesplat/batchUpdateListingLimit`,
                    params: JSON.stringify({
                        'updateIdList':ids,
                        'listingLimit':formData.newListingLimit,
                        'platCode':'joom'
                    })
                }).then(res => {
                    layer.msg(res || '保存成功', { icon: 1 });
                    layer.close(index);
                    $('#joomSearch').click();
                }).catch(err => {
                    layer.alert(err, { icon: 2 });
                })
            }
        })
    }
    //批量-自动删除函数
    function joomAccount_autoDeleteBatchFn(ids) {
        var data = {
            autoDeleteNum: '',
            autoDeleteSalesType: '',
            historySalesType: ''
        };
        layer.open({
            type: 1,
            title: '自动删除设置',
            area: ['40%', '40%'],
            btn: ['保存', '关闭'],
            content: $('#joomAccount_autoDeleteLayer').html(),
            id: 'joomAccount_autoDeleteLayerId',
            success: function(layero, index) {
                var getTpl = joomAccount_autoDeleteLayer_containerTpl.innerHTML,
                    view = document.getElementById('joomAccount_autoDeleteLayer_container');
                laytpl(getTpl).render(data, function(html) {
                    view.innerHTML = html;
                    form.render();
                });
            },
            yes: function(index, layero) {
                var formData = $('#joomAccount_autoDeleteLayer_container_form').serializeObject();
                formData.storeAcctIdList = ids;
                commonReturnPromise({
                    type: 'put',
                    contentType: 'application/json',
                    url: `/lms/onlineProductJoom/autoDeleteBatch`,
                    params: JSON.stringify(formData)
                }).then(res => {
                    layer.msg(res || '保存成功', { icon: 1 });
                    layer.close(index);
                    $('#joomSearch').click();
                }).catch(err => {
                    layer.alert(err, { icon: 2 });
                })
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
            success: function(res) {
                loading.hide();
                //后台程序返回数据
                if (res.code == "0000") {
                    // active.reload();
                    $('#joomSearch').trigger('click');
                    layer.closeAll();
                } else {
                    layer.msg(res.msg);
                }
            }
        });
    }

    function getStoreAcctIds() {
        var acctIds = [];
        var checkStatus = table.checkStatus('joomAcctTable'); //test即为基础参数id对应的值
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
    // form.on('switch(orderDownloadStatus)', function(data) {
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
    //         success: function(res) {
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
    //         success: function(res) {
    //             loading.hide();
    //             //后台程序返回数据
    //             if (res.code == "0000") {
    //                 // active.reload();
    //                 $('#joomSearch').trigger('click');
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
        if (dataObj.clientId == null || dataObj.clientId == '' || dataObj.clientId == undefined) {
            layer.msg('请输入ClientId');
            return false;
        }
        if (dataObj.clientSecret == null || dataObj.clientSecret == '' || dataObj.clientSecret == undefined) {
            layer.msg('请输入ClientSecret');
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
        if (dataObj.listingLimit == '' || !isInteger(dataObj.listingLimit) || dataObj.listingLimit <= 0) {
            layer.msg('请输入正确的店铺额度');
            return false;
        }
        return true;
    }

    //监听iframe传参
    window.addEventListener('message', function(event){
      console.log('iframe接收到的数据是', event.data);
      let {syncStatus,searchType,time,sevenTime} = event.data;
      if(syncStatus){
        $('#joomSyncListingStatus').val(syncStatus);
        form.render('select');
        $('#joomSearch').trigger('click');
      }
      if(searchType){
        $('#joom_acct_domain_overdue_number').parents('li').trigger('click');
      }
       //都存在表明是七天内过期域名
      if(time && sevenTime){
        vueIframeJumpAndSearch({time: time, sevenDayTime: sevenTime}, 'joom');
      }
      //仅time存在表示过期域名
      if(time && !sevenTime){
        //{time: time}
        vueIframeJumpAndSearch({time: time}, 'joom');
      }
    });
});

function joomAcct_getSalesPersion() {
    $("#joomSalesPlatAccountAddForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#joomSalesPlatAccountAddForm select[name=sellLeaderId]").html('<option value=""></option>');
    $("#editJoomSalesPersonForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#editJoomSalesPersonForm select[name=sellLeaderId]").html('<option value="">选择销售主管</option>');
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: { role: "joom专员" },
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#joomSalesPlatAccountAddForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        $("#editJoomSalesPersonForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')

                    }
                }
            }
        }
    });
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: { role: "joom主管" },
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#editJoomSalesPersonForm select[name=sellLeaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        $("#joomSalesPlatAccountAddForm select[name=sellLeaderId]")
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
function joomAcct_getDomain() {
    $("#editJoomDomainLayer select[name=domainId]").html('<option value="">选择域名</option>');
    $.ajax({
        type: "post",
        url: ctx + "/domain/listAll.html",
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var domainList = returnData.data;
                console.log("domainList", domainList)
                if (domainList.length > 0) {
                    for (var i = 0; i < domainList.length; i++) {
                        $("#editJoomDomainForm select[name=domainId]")
                            .append('<option value="' + domainList[i].id + '">' + domainList[i].domain + '</option>')
                    }
                }
            }
        }
    });
}
