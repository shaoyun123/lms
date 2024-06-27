/**
 * time: 2018/01/02
 */

layui.use(["admin", "form", "table", "layer", "laytpl", 'element', 'laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laytpl = layui.laytpl,
        laydate = layui.laydate
    $ = layui.$;
    form.render("select");
    form.render("radio");
    form.render("checkbox");
    //定义一个额外的搜索参数，区分tab选项卡
    var searchType = "1";
    //店铺账号
    ebayAcct_getAllEbayAcctTypeEnum(function (returnData) {
        var html = "<option value=''>请选择</option>"
        for (var i in returnData.data) {
            html += "<option value='" + returnData.data[i].name + "'>" + returnData.data[i].name + "</option>"
        }
        $('#ebay_account_type').append(html);
        setTimeout(function () {
            form.render()
        }, 0)
    })

    //初始化客服搜索项
    initUserFn('ebay客服专员', 'customServicerId', 'userName');
    //初始化主管
    initUserFn('ebay主管', 'ebayManager', 'loginName');
    //初始化组长
    initUserFn('ebay组长', 'ebayLeader', 'loginName');

    function initUserFn(role, name, nameText, container='ebayAcctSearchForm') {
        $.ajax({
            type: "post",
            url: ctx + "/sys/listuserbyrole.html",
            data: {role},
            dataType: "json",
            async: false,
            success: function (returnData) {
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg);
                } else {
                    var accts = returnData.data;
                    if (accts.length > 0) {
                        if (role === 'ebay组长' && name === 'ebayLeader') {
                            $("#" + container + " select[name=" + name + "]").html('<option value="">组长</option>')
                        }
                        for (var i = 0; i < accts.length; i++) {
                            $("#" + container + " select[name=" + name + "]").append('<option value="' + accts[i].id + '">' + accts[i][nameText] + '</option>');
                        }
                        form.render('select');
                    }
                }
            }
        });
    }


    //按钮的点击事件
    $("#addEbayToken").click(function () {
        layer.open({
            type: 1,
            title: "授权ebay账号",
            area: ["550px", "300px"],
            shadeClose: false,
            content: $("#addEbayTokenLayer").html(),
            btn: ["关闭"],
            success: function (layero) {
                //获取ebaySessionId
                $("#getEbaySessionId").click(function () {
                    var loadIndex = layer.load(0, {shade: [0.1, 'black']})
                    $.ajax({
                        type: "POST",
                        url: ctx + "/salesplat/getEbaySessionId.html",
                        dataType: "json",
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                $("#ebaySessionID").val(returnData.data.sessionId);
                                window.open(returnData.data.url);
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function () {
                            layer.msg("服务器正忙");
                        },
                        complete: function () {
                            layer.close(loadIndex)
                        }
                    });
                });

                // 获取ebay Token
                $("#saveEbayToken").click(function () {
                    var sessionId = $("#ebaySessionID").val();
                    if (sessionId == null || sessionId == "") {
                        layer.msg("请先完成第一步");
                        return;
                    }
                    var loadIndex = layer.load(0, {shade: [0.1, 'black']})
                    loading.show();
                    $.ajax({
                        type: "POST",
                        url: ctx + "/salesplat/saveEbayToken.html",
                        dataType: "json",
                        data: {sessionId: sessionId},
                        success: function (returnData) {
                            loading.hide();
                            layer.msg(returnData.msg);
                            //$("#ebayTokenModal").modal('hide');
                            //queryPage(searchData, salesPlatAccountUrl, salesPlatAccountTmpUrl);
                        },
                        error: function () {
                            loading.hide();
                            layer.msg("服务器正忙");
                        },
                        complete: function () {
                            layer.close(loadIndex)
                        }
                    });
                });
            },
        });
    });

     // 导入调价店铺
     $('#ebayAcct_import_adjust_store').click(function () {
        $('#ebayAcct_import_adjust_store_file').click()
    })

    $('#ebayAcct_import_adjust_store_file').on('change', function () {
        let files = $('#ebayAcct_import_adjust_store_file')[0].files
        // 如果没有文件则终止
        if (files.length === 0) {
        return
        }
        // 校验文件类型
        let fileName = files[0].name
        let seat = fileName.lastIndexOf('.')
        let extension = fileName.substring(seat).toLowerCase()
        if (extension !== '.xlsx' && extension !== '.xls') {
        layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
        return
        }
        let formData = new FormData()
        formData.append('file', files[0])
        let confirmIndex = layer.confirm('确认导入这个文件，对这些店铺的所有商品进行调价吗?', { btn: ['确认', '关闭'] },
        function () {
            layer.close(confirmIndex)
            loading.show()
            $.ajax({
            url: ctx + '/onlineProductEbay/adjustByExcel',
            type: 'POST',
            // async : false,
            data: formData,
            // 告诉jQuery不要去处理发送的数据
            processData: false,
            // 告诉jQuery不要去设置Content-Type请求头
            contentType: false,
            success: function (res) {
                $('#ebayAcct_import_adjust_store_file').val('')
                loading.hide()
                if (res.code === '0000') {
                if(Array.isArray(res.data) && res.data.length){
                    const _dataStr = res.data.join(',')
                    const msg = res.msg + '<br>' + `${res.data.length}个导入失败，店铺` +_dataStr+'系统不存在'
                    layer.alert(msg)
                }else{
                    layer.msg(res.msg||'操作成功',{icon:1})
                }
                $('#ebaySearch').click()
                } else {
                layer.alert(res.msg)
                }
            },
            error: function () {
                loading.hide()
                $('#ebayAcct_import_adjust_store_file').val('')
            }
            })
        },
        function () {
            layer.closeAll()
            $('#ebayAcct_import_adjust_store_file').val('')
        }
        )
    })

    //导出信息
    $("#ebayAccount_exportInfo").click(function () {
        var outerIndex = layer.open({
            title: '导出详情',
            type: 1,
            area: ['1000px', '600px'],
            btn: ['确定', '关闭'],
            content: $('#ebayAcct_exportInfo_tpl').html(),
            success: function () {
                form.on('checkbox(ebayAcct_exportInfo_checkAll)', function (data) {
                    var checked = data.elem.checked
                    $('#ebayAcct_exportInfo_form input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function () {
                var data = serializeObject($('#ebayAcct_exportInfo_form'));//不通过表单方式submit触发
                data.platCode = 'ebay';
                var Confirmindex = layer.confirm('确认导出当前搜索条件下的数据？', {btn: ['确认', '取消']}, function () {
                    layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/salesplat/exportAcctInfo.html')
                    layer.close(outerIndex);
                })
            }
        })
    });

    //同步lisiting
    $("#ebay_syncEbayListing").click(function () {
        var checkStatus = table.checkStatus('ebayAcctTable'); //获取选择的店铺
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
            var platCode = "ebay";
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
        $("#ebaySyncListingStatus").val($("#index_sync_fail_store").val());
        $("#index_sync_fail_store").remove();
        form.render('select');
    }

    function ebayAccount_tableRender(){
        //表格渲染结果
        // ebay1.0 ebay2.0
        let ebayVersion = (sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).ebayVersion?JSON.parse(sessionStorage.getItem("lastJumpParam")).ebayVersion:'');
        let expireTime = sevenExpiryTime = '';
        if (ebayVersion == 1) {
            expireTime = 'accessTokenExpiryTime';
            sevenExpiryTime = 'accessTokenSevenExpiryTime';
        }
        if (ebayVersion == 2) {
            expireTime = 'refreshTokenExpiryTime';
            sevenExpiryTime = 'refreshTokenSevenExpiryTime';
        }
        //展示已知数据
        table.render({
          elem: "#ebayTable",
          method: "post",
          url: ctx + "/salesplat/salesPlatAccountDtoPage.html?platCode=ebay",
          where: {
              status: $("#ebayAcctSearchForm select[name='status'] option:selected").val(),
              syncStatus: $("#ebaySyncListingStatus").val(),
              storeAcct: $("#ebayAcctSearchForm input[name='storeAcct']").val(),
              orgId: $("#ebay_account_depart_sel").val(),
              salespersonId: $("#ebay_account_salesman_sel").val(),
              sellLeaderId: $('#ebayManager').val(),
              leaderId: $('#ebayLeader').val(),
              searchType: searchType,
              acctType: $("#ebayAcctSearchForm #ebay_account_type option:selected").val(),
              storeWarehouses: $("#ebayAcctSearchForm #ebay_account_warehouse option:selected").val(),
              [expireTime]:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:''),
              [sevenExpiryTime]:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:''),
              ebayMainSite: $("#ebay_main_site_input").val(),
              customServicerId: $("#ebayAcctSearchForm select[name=customServicerId]").val(),
              syncDesc: $("#ebayAcctSearchForm input[name='syncDesc']").val(),
              allrootAliasNameSearchType: $("#ebayAcctSearchForm select[name=allrootAliasNameSearchType]").val(),
              allrootAliasNameStr: $("#ebayAcctSearchForm input[name='allrootAliasNameStr']").val()
          },
          cols: [
              [
                  //标题栏
                  {type: "checkbox"},
                  {field: "storeAcct", title: "店铺/普源名称", templet: '#ebay_acct_name_template'},
                  {field: "ebayMainSite", title: "主站点"},
                  {field: "paypalEmail", title: "PayPal邮箱"},
                  {title: "Token到期时间", templet: '#tokenExpireTime_ebay'},
                  {
                      field: "imgDomain", title: "图片域名",
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
                    </div>`,
                      width: 200
                  },
                  {field: "status", title: "店铺状态", templet: "#ebayAcctStatusTpl", width: 65},
                  {field: "salesperson", title: "人员信息", width: 120, templet: '#ebay_person_info_template'},
                  {field: "syncStatus", title: "同步lisiting状态", templet: "#ebayAcccount_ebaySyncStatus",},
                  {field: "lastSyncTime", title: "上次同步时间", templet: "#ebayAcccount_lastSyncTime", sort: true,},
                  {field: "syncDesc", title: "同步异常备注"},
                  {field: "remark", title: "备注"},
                  {field: "authStatus", title: "2.0授权状态", templet: "#ebayAcccount_ebayAuthStatus"},
                  {field: "authMsg", title: "2.0授权异常信息"},
                  {field: "acctType", title: "账号/仓库类型", templet: "#ebay_acct_warehouse_type_templet"},
                  //绑定工具条
                  {title: "操作", align: "center", toolbar: "#ebayTableBar"},
              ],
          ],
          done: function (res, curr, count) {
                  if(res.code == '0000'){
                      $("#ebayAccount_colLen").text(res.extra.mainTab);
                      $("#ebay_acct_domain_overdue_number").text(res.extra.sevenTab);
                      $("#ebay_acct_error_auth_number").text(res.extra.errorAuthTab);
                  }else{
                      $("#ebayAccount_colLen").text(0);
                      $("#ebay_acct_domain_overdue_number").text(0);
                      $("#ebay_acct_error_auth_number").text(0);
                  }
                  sessionStorage.clear("lastJumpParam")
                  theadHandle().fixTh({id: '#ebayaccountCard'});
          },
          id: "ebayAcctTable",
          page: false, //是否显示分页
          limits: [300, 500, 1000],
          limit: 500, //每页默认显示的数量
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
                    // active.reload();
                    layer.closeAll();
                    $("#ebaySearch").trigger('click');
                } else {
                    layer.msg(res.msg);
                }
            }
        });
    }

    // 搜索
    // var active = {
    //     reload: function () {
    //         var status = $(
    //             "#ebayAcctSearchForm select[name='status'] option:selected"
    //         ).val();
    //         var storeAcct = $("#ebayAcctSearchForm input[name='storeAcct']").val();
    //         var syncStatus = $("#ebaySyncListingStatus").val();//同步listing状态
    //         var orgId = $("#ebay_account_depart_sel").val();
    //         var salespersonId = $("#ebay_account_salesman_sel").val();
    //         var acctType = $("#ebayAcctSearchForm #ebay_account_type option:selected").val();
    //         var storeWarehouses = $("#ebayAcctSearchForm #ebay_account_warehouse option:selected").val();
    //         var ebayMainSite = $("#ebay_main_site_input").val();
    //         var orderDownloadStatus = $("#ebayAcctSearchForm select[name='orderDownloadStatus'] option:selected").val();
    //         var syncDesc = $("#ebayAcctSearchForm input[name='syncDesc']").val();

    //         //执行重载
    //         table.reload("ebayAcctTable", {
    //             where: {
    //                 status: status,
    //                 storeAcct: storeAcct,
    //                 syncStatus: syncStatus,
    //                 orgId: orgId,
    //                 salespersonId: salespersonId,
    //                 searchType: searchType,
    //                 acctType: acctType,
    //                 storeWarehouses: storeWarehouses,
    //                 ebayMainSite: ebayMainSite,
    //                 searchType: searchType,
    //                 orderDownloadStatus: orderDownloadStatus,
    //                 customServicerId: $("#ebayAcctSearchForm select[name=customServicerId]").val(),
    //                 syncDesc: syncDesc
    //             },
    //         });
    //     },
    // };


    element.on('tab(ebay_acct_tab_filter)', function (data) {
        searchType = $(this).attr("lay-id");
        // active.reload();
        $("#ebaySearch").trigger('click');
    });


    $("#ebaySearch").click(function () {
        ebayAccount_tableRender();
        // var type = $(this).data("type");
        // active[type] ? active[type].call(this) : "";
    });

    $('#resetEbayAccount').click(function() {
        render_hp_orgs_users("#ebayAcctSearchForm");//渲染部门销售员店铺三级联动
        //初始化组长
         initUserFn('ebay组长', 'ebayLeader', 'loginName');
    })

    form.on("submit(addEbayAcct)", function (data) {
        var siteArr = new Array();
        var paypalEmailArr = new Array();
        $("#ebaySiteDiv :checkbox:checked").each(function () {
            siteArr.push($(this).val());
        });

        var soreHouses = new Array();
        $("#ebaySoreHousesCheck :checkbox:checked").each(function () {
            soreHouses.push($(this).val());
        });
        if (soreHouses.length < 1) {
            layer.alert("仓库属性至少要选一个", {icon: 2});
            return false;
        }
        data.field["storeWarehouses"] = soreHouses.join(",");
        var sites = siteArr.join(",");
        data.field["salesSite"] = sites;
        //设置销售人员名称
        data.field["salesperson"] = $("#ebaySalesPlatAccountAddForm select[name=salespersonId] option:selected").text();
        data.field["customServicer"] = $("#ebaySalesPlatAccountAddForm select[name=customServicerId] option:selected").text();
        data.field["sellLeaderId"] = $("#ebaySalesPlatAccountAddForm select[name=sellLeaderId]").val();
        data.field["sellLeaderName"] = $("#ebaySalesPlatAccountAddForm select[name=sellLeaderId] option:selected").text();
        data.field["leaderId"] = $("#ebaySalesPlatAccountAddForm select[name=leaderId]").val();
        data.field["leaderName"] = $("#ebaySalesPlatAccountAddForm select[name=leaderId] option:selected").text();

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
                    table.reload("ebayAcctTable");
                } else {
                    layer.msg(res.msg);
                }
            },
        });
        return false;
    });

    form.on("submit(delEbayAcct)", function (data) {
        ebayAcct_deleteSalesPlatAccount(data.field["acctBaseId"]);
        return false;
    });

    form.on("submit(reuseEbayAcct)", function (data) {
        ebayAcct_openSalesPlatAccount(data.field["acctBaseId"]);
        return false;
    });
    render_hp_orgs_users("#ebayAcctSearchForm");//渲染部门销售员店铺三级联动

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on("tool(ebayTable)", function (obj) {
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent === "edit") {
            var index = layer.open({
                type: 1,
                title: "设置平台账号辅助信息",
                area: ['1000px', '600px'],
                shadeClose: false,
                btn: ["保存", "关闭"],
                yes: function (layero) {
                    var dataObj = {
                        imgDomain: $("#ebaySalesPlatAccountAddForm input[name='imgDomain']").val(),
                        salespersonId: $("#ebaySalesPlatAccountAddForm select[name='salespersonId']").val(),
                        customServicerId: $("#ebaySalesPlatAccountAddForm select[name='customServicerId']").val(),
                        acctType: $("#ebaySalesPlatAccountAddForm select[name='acctType']").val(),
                        ebayAutoRefundAmount: $("#ebaySalesPlatAccountAddForm input[name='ebayAutoRefundAmount']").val(),
                        leaderId: $("#ebaySalesPlatAccountAddForm select[name='leaderId']").val(),
                        sellLeaderId: $("#ebaySalesPlatAccountAddForm select[name='sellLeaderId']").val(),
                    }
                    var strRegex = "^http://";
                    var re = new RegExp(strRegex);
                    if (!re.test(dataObj.imgDomain)) {
                        layer.msg("图片域名必须以http://开头");
                        return;
                    }
                    var result = checkRequiredData(dataObj, data);
                    if (result) {
                        $('#addEbayAcct').trigger("click");
                    }
                },
                content: $("#addEbayInfoLayer").html(),
                success: function (layero, index) {
                    ebayAcct_getSalesPersion();
                    ebayAcct_getAllEbayAcctTypeEnum();
                    // ebayAcct_getSellLeaderList();
                    //初始化主管
                     initUserFn('ebay主管', 'sellLeaderId', 'loginName', 'ebaySalesPlatAccountAddForm');
                    //初始化组长
                    initUserFn('ebay组长', 'leaderId', 'loginName', 'ebaySalesPlatAccountAddForm');
                    ebayAcct_getSalesPlatAccountBaseAndDetailInfo(data.id);
                    form.render("select");
                    form.render("radio");
                    form.render("checkbox");
                },
                end: function () {
                    // $("#ebaySalesPlatAccountAddForm")[0].reset();
                    $("#ebaySalesPlatAccountAddForm").trigger('reset');
                    $("#ebaySalesPlatAccountAddForm input[name='acctBaseId']").val("");
                    $("#ebaySalesPlatAccountAddForm input[name='acctDetailId']").val("");
                    $("#ebayAcctReuseDiv").addClass("layui-hide");
                    $("#ebayAcctDelDiv").addClass("layui-hide");
                },
            });
        } else if (layEvent == 'getRestfulToken') {
            var index = layer.open({
                type: 1,
                title: "获取restfulAPI token",
                area: ['800px', '300px'],
                shadeClose: false,
                content: $("#ebayRestfulTokenModalLayer").html(),
                btn: ["生成token", "关闭"],
                yes: function (layero) {
                    var Adata = {
                        acctId: data.id,
                        code: $('#ebayRestfulTokenAddForm [name=code]').val()
                    }
                    var ajax = new Ajax()
                    loading.show()
                    ajax.post({
                        url: ctx + '/ebayAuth/getAccessToken.html',
                        type: 'POST',
                        data: JSON.stringify(Adata),
                        success: function (response) {
                            loading.hide()
                            if (response.code == '0000') {
                                layer.closeAll()
                                layer.msg('授权成功')
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
                success: function (layero, index) {
                    var ajax = new Ajax()
                    loading.show()
                    ajax.post({
                        url: ctx + '/ebayAuth/getAuthCodeUrl.html',
                        type: 'POST',
                        data: JSON.stringify({}),
                        success: function (response) {
                            loading.hide()
                            if (response.code == '0000') {
                                $('#ebayRestfulTokenAddForm #autoUrl').val(response.data)
                            } else {
                                layer.msg(response.msg)
                            }
                        },
                        error: function () {
                            loading.hide()
                            layer.msg('网络繁忙')
                        }
                    })
                }
            });
        } else if (layEvent == 'refreshToken2') {
            var Adata = {
                acctId: data.id
            }
            var ajax = new Ajax()
            loading.show()
            ajax.post({
                url: ctx + '/ebayAuth/getAccessToken.html',
                type: 'POST',
                data: JSON.stringify(Adata),
                success: function (response) {
                    loading.hide()
                    if (response.code == '0000') {
                        layer.closeAll()
                        layer.msg('刷新成功')
                    } else {
                        layer.msg(response.msg)
                    }
                },
                error: function () {
                    loading.hide()
                    layer.msg('网络繁忙')
                }
            })
        } else if(layEvent == 'checkAccessToken'){
          ztt_storeCommonCheckAuthFn(data.id, data.platCode);
        }
    });

    // 获取平台账号基本和辅助信息
    function ebayAcct_getSalesPlatAccountBaseAndDetailInfo(salesPlatAccountId) {
        if (typeof salesPlatAccountId == "undefined") {
            layer.msg("服务器正忙");
            return;
        }
        $("#ebaySiteDiv").empty();
        for (var i = 0; i < ebayAcctSiteData.length; i++) {
            $("#ebaySiteDiv").append("<input type='checkbox' lay-skin='primary' id='ebaySiteCheck' title='" + ebayAcctSiteData[i].name + "' value='" + ebayAcctSiteData[i].id + "'/>");
        }
        $("#ebayPaypalEmail").empty();
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/getSalesPlatAccountBaseAndDetailInfo.html",
            data: {id: salesPlatAccountId, platCode: "ebay"},
            async: false,
            dataType: "json",
            success: function (returnData) {
                console.log("回显");
                // base
                $("#ebaySalesPlatAccountAddForm input[name='acctBaseId']").val(returnData.acctBaseId);
                $("#ebaySalesPlatAccountAddForm input[name='storeAcct']").val(returnData.storeAcct);
                $("#ebaySalesPlatAccountAddForm input[name='allrootAliasName']").val(returnData.allrootAliasName);
                $("#ebaySalesPlatAccountAddForm input[name='ebayAutoRefundAmount']").val(returnData.ebayAutoRefundAmount);
                $("#ebaySalesPlatAccountAddForm input[name='taxNumber']").val(returnData.taxNumber);
                $("#ebaySalesPlatAccountAddForm input[name='eoriNumber']").val(returnData.eoriNumber);

                if (returnData.storeWarehouses != null && returnData.storeWarehouses.length > 0) {//可能直接返回"0"
                    if (returnData.storeWarehouses.indexOf("0") != -1) {
                        $("#soreHouses_in").prop("checked", true);
                    }
                    if (returnData.storeWarehouses.indexOf("1") != -1) {
                        $("#soreHouses_invented").prop("checked", true);
                    }
                    if (returnData.storeWarehouses.indexOf("2") != -1) {
                        $("#soreHouses_out").prop("checked", true);
                    }
                }

                var salesSite = returnData.salesSite;
                if (salesSite != null && salesSite != "") {
                    var sites = salesSite.split(",");
                    //回显站点
                    for (i = 0; i < sites.length; i++) {
                        $("#ebaySiteDiv :checkbox").each(function () {
                            if ($(this).val() == sites[i]) {
                                $(this).prop("checked", true);
                            }
                        });
                    }
                }

                var paypalEmails = returnData.paypalEmails;
                if (paypalEmails != null && paypalEmails.length > 0) {
                    var eamilStr = "";
                    for (var i = 0; i < paypalEmails.length; i++) {
                        if (paypalEmails[i].paypalEmail != null && paypalEmails[i].paypalEmail != "") {
                            eamilStr += paypalEmails[i].paypalEmail + ",";
                        }
                    }
                    if (eamilStr.lastIndexOf(",") != -1) {
                        eamilStr = eamilStr.substring(0, eamilStr.lastIndexOf(","));
                    }

                    //回显paypal账号
                    $("#ebayPaypalEmail").val(eamilStr);
                }


                // if (returnData.isAutoStopSale == true) {
                //     $("#isAutoStopSale").prop("checked", true);
                // }
                $("#ebaySalesPlatAccountAddForm input[name='imgDomain']").val(
                    returnData.imgDomain
                );
                $("#ebaySalesPlatAccountAddForm textarea[name='acctBaseRemark']").val(
                    returnData.acctBaseRemark
                );
                $("#ebaySalesPlatAccountAddForm select[name=salespersonId]").val(returnData.salespersonId);
                $("#ebaySalesPlatAccountAddForm select[name=customServicerId]").val(returnData.customServicerId);
                $("#ebaySalesPlatAccountAddForm select[name=acctType]").val(returnData.acctType);
                $("#ebaySalesPlatAccountAddForm select[name=sellLeaderId]").val(returnData.sellLeaderId);
                $("#ebaySalesPlatAccountAddForm select[name=leaderId]").val(returnData.leaderId);
                form.render('select');

                // detail
                $("#ebaySalesPlatAccountAddForm input[name='acctDetailId']").val(
                    returnData.acctDetailId
                );
                $("#ebaySalesPlatAccountAddForm input[name='salesAcctId']").val(
                    returnData.salesAcctId
                );
                $("#ebaySalesPlatAccountAddForm input[name='clientId']").val(
                    returnData.clientId
                );
                $("#ebaySalesPlatAccountAddForm input[name='clientSecret']").val(
                    returnData.clientSecret
                );
                $("#ebaySalesPlatAccountAddForm input[name='paypalEmail1']").val(
                    returnData.paypalEmail1
                );
                $("#ebaySalesPlatAccountAddForm input[name='paypalEmail2']").val(
                    returnData.paypalEmail2
                );
                $("#ebaySalesPlatAccountAddForm input[name='paypalEmail3']").val(
                    returnData.paypalEmail3
                );

                if (returnData.status == false) {
                    $("#ebayAcctReuseDiv").removeClass("layui-hide");
                } else {
                    $("#ebayAcctDelDiv").removeClass("layui-hide");
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
        });
    }

    //停用店铺账号
    function ebayAcct_deleteSalesPlatAccount(salesPlatAccountId) {
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
                            table.reload("ebayAcctTable");
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
    function ebayAcct_openSalesPlatAccount(salesPlatAccountId) {
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
                            table.reload("ebayAcctTable");
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

    form.on('select(ebayAcctBatchOper)', function (data) {
        var optionNum = data.value;
        if (3 == optionNum) {
            var acctIds = ebayAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改信息",
                area: ["500px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editEbaySalesPersonLayer").html(),
                end: function () {
                    $("#editEbaySalesPersonForm select[name=salespersonId]").val("");
                },
                success: function (layero, index) {
                    ebayAcct_getSalesPersion();
                    // ebayAcct_getSellLeaderList();
                    //初始化主管
                    initUserFn('ebay主管', 'sellLeaderId', 'loginName', 'editEbaySalesPersonForm');
                    //初始化组长
                    initUserFn('ebay组长', 'leaderId', 'loginName', 'editEbaySalesPersonForm');
                    form.render("select");
                },
                yes: function () {
                    var salespersonId = $("#editEbaySalesPersonForm select[name=salespersonId]").val();
                    var salesperson = $("#editEbaySalesPersonForm select[name=salespersonId] option:selected").text();
                    var customServicerId = $("#editEbaySalesPersonForm select[name=customServicerId]").val();
                    var customServicer = $("#editEbaySalesPersonForm select[name=customServicerId] option:selected").text();
                    var sellLeaderId = $("#editEbaySalesPersonForm select[name=sellLeaderId]").val();
                    var leaderId = $("#editEbaySalesPersonForm select[name=leaderId]").val();
                    var leaderName = $("#editEbaySalesPersonForm select[name=leaderId] option:selected").text();
                    var sellLeaderName = $("#editEbaySalesPersonForm select[name=sellLeaderId] option:selected").text();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/editSalesPerson.html",
                        dataType: "json",
                        data: {
                            ids: acctIds,
                            platCode: 'ebay',
                            salesperson: salesperson,
                            salespersonId: salespersonId,
                            customServicerId: customServicerId,
                            customServicer: customServicer,
                            leaderId,
                            leaderName,
                            sellLeaderId: sellLeaderId,
                            sellLeaderName: sellLeaderName
                        },
                        traditional: true,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("批量修改成功");
                                table.reload("ebayAcctTable");
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        } else if (4 == optionNum) {
            var acctIds = ebayAcct_getStoreAcctIds();
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
            var acctIds = ebayAcct_getStoreAcctIds();
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
            var acctIds = ebayAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            layer.confirm('删除Listing操作不可还原，确定要删除吗', {icon: 3}, function (index) {
                layer.confirm('删除Listing操作不可还原，确定要删除吗', {icon: 3}, function (index) {
                    layui.admin.load.show();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/deleteListingByAcct.html",
                        dataType: "json",
                        data: {
                            acctIds: acctIds.toString()
                        },
                        success: function (returnData) {
                            layui.admin.load.hide();
                            if (returnData.code != "0000") {
                                layer.alert(returnData.msg, {icon: 2});
                            } else {
                                layer.msg("删除店铺所有Listing成功");
                                table.reload("ebayAcctTable");
                            }
                        },
                        error: function (XMLHttpRequest) {
                            layui.admin.load.hide();
                            if (XMLHttpRequest.status == 200) {
                                layer.msg("请重新登录", {icon: 7});
                            } else {
                                layer.msg("服务器错误");
                            }
                        }
                    });
                });
            });

        } else if (7 == optionNum) {
            var acctIds = ebayAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var hideFixedPriceStoreItems = 0
            layer.open({
                type: 1,
                title: "店铺休假设置",
                area: ["600px", "500px"],
                shadeClose: false,
                content: $("#setStoreBreak_tpl").html(),
                btn: ["保存", "关闭"],
                success: function (layero) {
                    form.render()
                    laydate.render({
                        elem: '#breakStartTime',
                        type: 'datetime'
                    });
                    laydate.render({
                        elem: '#breakEndTime',
                        type: 'date'
                    });
                    form.on('checkbox(hideFixedPriceStoreItems)', function (data) {
                        data.elem.checked ? hideFixedPriceStoreItems = 1 : hideFixedPriceStoreItems = 0
                    });
                },
                yes: function (index, layero) {
                    var sendData = {}
                    sendData.endDate = $('#breakEndTime').val()
                    sendData.startTime = $('#breakStartTime').val()
                    sendData.showText = $('#showText').val()
                    sendData.hideFixedPriceStoreItems = hideFixedPriceStoreItems
                    sendData.storeAcctIds = acctIds
                    layui.admin.load.show();
                    $.ajax({
                        type: "post",
                        url: ctx + "/ebayVacation/setEbayVacation.html",
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(sendData),
                        success: function (returnData) {
                            layui.admin.load.hide();
                            if (returnData.code != "0000") {
                                layer.alert(returnData.msg, {icon: 2});
                            } else {
                                layer.msg(returnData.msg);
                                table.reload("ebayAcctTable");
                                layer.close(index)
                            }
                        },
                        error: function (XMLHttpRequest) {
                            layui.admin.load.hide();
                            if (XMLHttpRequest.status == 200) {
                                layer.msg("请重新登录", {icon: 7});
                            } else {
                                layer.msg("服务器错误");
                            }
                        }
                    });
                }
            });
        } else if (8 == optionNum) {
            var storeAcctIds = ebayAcct_getStoreAcctIds();
            if (storeAcctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            layer.confirm('确定要结束这些店铺的休假吗', {icon: 3}, function (index) {
                layui.admin.load.show();
                $.ajax({
                    type: "post",
                    url: ctx + "/ebayVacation/endEbayVacationStoreAcct.html",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({storeAcctIds: storeAcctIds}),
                    success: function (returnData) {
                        layui.admin.load.hide();
                        if (returnData.code != "0000") {
                            layer.alert(returnData.msg, {icon: 2});
                        } else {
                            layer.msg("结束休假成功");
                            table.reload("ebayAcctTable");
                        }
                    },
                    error: function (XMLHttpRequest) {
                        layui.admin.load.hide();
                        if (XMLHttpRequest.status == 200) {
                            layer.msg("请重新登录", {icon: 7});
                        } else {
                            layer.msg("服务器错误");
                        }
                    }
                });
            });
        } else if (9 == optionNum) {//启用店铺
            layer.confirm('确定批量启用店铺吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function (index) {
                var acctIds = ebayAcct_getStoreAcctIds();
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
        } else if (10 == optionNum) {//批量停用店铺
            layer.confirm('确定批量停用店铺吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function (index) {
                var acctIds = ebayAcct_getStoreAcctIds();
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
        } else if (11 == optionNum) {
            var acctIds = ebayAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改图片域名",
                area: ["600px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editEbayDomainLayer").html(),
                end: function () {
                    $("#editEbayDomainForm select[name=domainId]").val("");
                },
                success: function (layero, index) {
                    ebayAcct_getDomain();
                    form.render("select");
                },
                yes: function () {
                    var imgDomain = $("#editEbayDomainForm select[name=domainId] option:selected").text();
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
                                table.reload('ebayAcctTable');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        } else if (12 == optionNum) {//批量修改PayPal
            var acctIds = ebayAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            let layindex =  layer.open({
                type: 1,
                title: "批量修改店鋪PayPal邮箱",
                area: ["500px", "300px"],
                btn: ["保存", "关闭"],
                content: $("#editEbayPayPal").html(),
                success: function (layero, index) {
                    form.render();
                },
                yes: function () {
                    let checked = $("input[name='paypalEmail']:checked").val(),obj = {};
                    obj.idList=acctIds,
                        obj.listingPayPal=$("#editEbayPayPalForm input[name='"+ checked +"']").val(),
                        obj.paypalEmail1=$("#editEbayPayPalForm input[name=paypalEmail1]").val(),
                        obj.paypalEmail2=$("#editEbayPayPalForm input[name=paypalEmail2]").val(),
                        obj.paypalEmail3=$("#editEbayPayPalForm input[name=paypalEmail3]").val();
                    // var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                    var reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

                    if(obj.paypalEmail1!= ''&&!reg.test($("#editEbayPayPalForm input[name=paypalEmail1]").val())){
                        layer.msg("paypalEmail1邮箱格式不正确");
                        return false;
                    }
                    if(obj.paypalEmail2!= ''&&!reg.test($("#editEbayPayPalForm input[name=paypalEmail2]").val())){
                        layer.msg("paypalEmail2邮箱格式不正确");
                        return false;
                    }
                    if(obj.paypalEmail3!= ''&&!reg.test($("#editEbayPayPalForm input[name=paypalEmail3]").val())){
                        layer.msg("paypalEmail3邮箱格式不正确");
                        return false;
                    }
                    if(obj.paypalEmail1 == ''&&obj.paypalEmail2 == ''&&obj.paypalEmail3 == ''){
                        layer.msg("至少填一个邮箱");
                        return false;
                    }
                    commonReturnPromise({
                        url: ctx + "/salesplat/batchUpdatePayPal.html",
                        type: 'post',
                        contentType: 'application/json',
                        params: JSON.stringify(obj)
                    }).then(res => {
                        layer.closeAll();
                        layer.alert(res, {icon: 1});
                        $("#ebaySearch").click();
                    }).catch(err => {
                        console.log(err);
                    })
                },

            });
        }
    });

    function ebayAcct_getStoreAcctIds() {
        var acctIds = [];
        var checkStatus = table.checkStatus('ebayAcctTable'); //test即为基础参数id对应的值
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
     * 校验必填数据，为了保存和停用店铺时区分校验
     */
    function checkRequiredData(dataObj, data) {
        if (dataObj.customServicerId == null || dataObj.customServicerId == '' || dataObj.customServicerId == undefined) {
            layer.msg('请选择客服专员');
            return false;
        }
        if (dataObj.acctType == null || dataObj.acctType == '' || dataObj.acctType == undefined) {
            layer.msg('请选择账号类型');
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
        if (!dataObj.leaderId && data.leaderId) {
            layer.msg('请选择组长');
            return false;
        }
        if (!dataObj.sellLeaderId && data.sellLeaderId) {
            layer.msg('请选择销售主管');
            return false;
        }
        return true;
    }

    //监听iframe传参
    window.addEventListener('message', function(event){
      console.log('iframe接收到的数据是', event.data);
      let {syncStatus,searchType,time,sevenTime,ebayVersion} = event.data;
      if(syncStatus){
        $('#ebaySyncListingStatus').val(syncStatus);
        form.render('select');
        $('#ebaySearch').trigger('click');
      }
      if(searchType){
        $('#ebay_acct_domain_overdue_number').parents('li').trigger('click');
      }
       //都存在表明是七天内过期域名
      if(time && sevenTime){
        sessionStorage.setItem('lastJumpParam', JSON.stringify({time: time, sevenDayTime: sevenTime, ebayVersion: ebayVersion}));
        $('#ebaySearch').trigger('click');
      }
      if(time && !sevenTime){
        sessionStorage.setItem('lastJumpParam', JSON.stringify({time: time, ebayVersion: ebayVersion}));
        $('#ebaySearch').trigger('click');
      }
    });

});

// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
//Format("2016-10-04 8:9:4.423","yyyy-MM-dd hh:mm:ss.S") ==> 2016-10-04 08:09:04.423
//Format("1507353913000","yyyy-M-d h:m:s.S")      ==> 2017-10-7 13:25:13.0
function Format(datetime, fmt) {
    if (datetime) {
        datetime = datetime.toString();
        if (parseInt(datetime) == datetime) {
            if (datetime.length == 10) {
                datetime = parseInt(datetime) * 1000;
            } else if (datetime.length == 13) {
                datetime = parseInt(datetime);
            }
        }
        datetime = new Date(datetime);
        var o = {
            "M+": datetime.getMonth() + 1, //月份
            "d+": datetime.getDate(), //日
            "h+": datetime.getHours(), //小时
            "m+": datetime.getMinutes(), //分
            "s+": datetime.getSeconds(), //秒
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
            S: datetime.getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                (datetime.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
        return fmt;
    } else {
        return "";
    }
}

function ebayAcct_getSalesPersion() {
    $("#ebaySalesPlatAccountAddForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#editEbaySalesPersonForm select[name=salespersonId]").html('<option value="">选择销售员</option>');

    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "ebay专员"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#ebaySalesPlatAccountAddForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        $("#editEbaySalesPersonForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                    }
                }
            }
        }
    });

    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "ebay客服专员"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#ebaySalesPlatAccountAddForm select[name=customServicerId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        $("#editEbaySalesPersonForm select[name=customServicerId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                    }
                }
            }
        }
    });

}

function ebayAcct_getAllEbayAcctTypeEnum(func) {
    $.ajax({
        type: "post",
        url: ctx + "/sys/ebayAcctTypeEnum.html",
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code == "0000") {
                if (func) {
                    func(returnData)
                } else {
                    $(returnData.data).each(function () {
                        $("#ebaySalesPlatAccountAddForm select[name=acctType]").append("<option value='" + this.name + "'>" + this.name + "</option>");
                    });
                    layui.form.render("select");
                }
            } else {
                layer.msg(returnData.msg);
            }
        }
    })
}

function ebayAcct_getSellLeaderList() {
    $.ajax({
        type: 'post',
        url: ctx + '/sys/getPersonAndOrgsByRole.html',
        dataType: 'json',
        data: {roleNames: "ebay主管"},
        async: false,
        success: function (returnData) {

            if (returnData.code == "0000") {
                $(returnData.data.userList).each(function () {
                    $("#ebaySalesPlatAccountAddForm select[name=sellLeaderId]").append("<option value='" + this.id + "'>" + this.user_name + "</option>");
                    $("#editEbaySalesPersonForm select[name=sellLeaderId]").append("<option value='" + this.id + "'>" + this.user_name + "</option>");

                });
                layui.form.render("select");
            } else {
                layer.msg(returnData.msg);
            }
        },
        error: function () {
            layer.msg('发送请求失败')
        }
    })

}

/**
 * 请求图片域名列表
 */
function ebayAcct_getDomain() {
    $("#editEbayDomainLayer select[name=domainId]").html('<option value="">选择域名</option>');
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
                        $("#editEbayDomainForm select[name=domainId]")
                            .append('<option value="' + domainList[i].id + '">' + domainList[i].domain + '</option>')
                    }
                }
            }
        }
    });
}
