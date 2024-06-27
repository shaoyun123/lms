/**
 * time: 2018/01/02
 */
var lazadaSiteEnum = [];
var lazadaCateData;
var lazadaCateTree;
$.ajax({
    type: "post",
    url: ctx + "/lazada/listLazadaSiteEnum.html",
    dataType: "json",
    async: false,
    success: function(returnData) {
        if (returnData.code != "0000") {
            layer.alert(returnData.msg);
        } else {
            lazadaSiteEnum = returnData.data;
        }
    }
});

layui.use(["admin", "form", "table", "layer", "laytpl", 'element', 'upload','formSelects','layCascader','laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        upload = layui.upload,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        layCascader = layui.layCascader,
        element = layui.element;
    $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    //
    lazadaAccount_init()
    function lazadaAccount_init(){
        Promise.all([commonReturnPromise({
            url: '/lms/sysdict/getBizDictByCode.html?headCode=STORE_LABEL',
        })
        ]).then(res=>{
            let lazadaLabel = res[0].filter(item=>item.code=='lazada')
            formSelects.data('lazadaAccount_search_storeTagList','local',{arr: lazadaLabel.map(item=>({...item, value:item.name}))})
        })
    }
    //导入授权信息
    upload.render({
        elem: '#lazada_importAuthInfo' //绑定元素
            ,
        url: `${ctx}/salesplat/importAuthInfo` //上传接口
            ,
        accept: 'file' //允许上传的文件类型
            ,
        exts: 'xlsx',
        done: function(res) {
            if (res.code == "0000") {
                layer.confirm(res.msg, { icon: 1, title: '提示' }, function(index) {
                    layer.close(index);
                });
            } else {
                layer.confirm(res.msg, { icon: 2, title: '提示' }, function(index) {
                    layer.close(index);
                });
            }
        },
        error: function() {
            layer.msg('服务器出现故障!');
        }
    });

    //导入预售
    upload.render({
        elem: '#lazada_importPresale' //绑定元素
        , url: `${ctx}/importLazadaShopAutoPreOrderConfig` //上传接口
        , accept: 'file' //允许上传的文件类型
        , exts: 'xlsx',
        done: function(res) {
            layer.confirm(res.msg, { icon: res.code == "0000"?1:2, title: '提示' }, function(index) {
                layer.close(index);
            });
        },
        error: function() {
            layer.msg('服务器出现故障!');
        }
    });


    //导入授权信息
    upload.render({
        elem: '#lazada_importEditStore',
        url: `${ctx}/salesplat/importLazadaUpdateInfo`,
        accept: 'file',
        exts: 'xlsx',
        before: function () {
          loading.show()
        },
        done: function(res) {
            loading.hide();
            if (res.code == "0000") {
                layer.confirm(res.msg+ '<br>'+res.data, { icon: 1, title: '提示' }, function(index) {
                    layer.close(index);
                });
            } else {
                layer.confirm(res.msg, { icon: 2, title: '提示' }, function(index) {
                    layer.close(index);
                });
            }
        },
        error: function() {
            loading.hide();
            layer.msg('服务器出现故障!');
        }
    });

    //定义一个额外的搜索参数，区分tab选项卡
    var searchType = "1";
    //按钮的点击事件
    $("#addLazadaInfo").click(function() {
        var index = layer.open({
            type: 1,
            title: "添加lazada账号",
            area: ["920px", "600px"],
            shadeClose: false,
            content: $("#addLazadaInfoLayer").html(),
            btn: ['保存', '关闭'],
            success: function(layero, index) {
                lazadaAcct_getSalesPersion();
                for (var i = 0; i < lazadaSiteEnum.length; i++) {
                    $("#lazadaSalesPlatAccountAddForm select[name=salesSite]")
                        .append('<option value="' + lazadaSiteEnum[i].code + '">' + lazadaSiteEnum[i].name + '</option>');
                }
                form.render("select");
                form.render('checkbox');

            },
            yes: function(index, layero) {
                $('#addLazadaAcct').trigger("click");
                return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
            },
            end: function() {
                // $("#lazadaSalesPlatAccountAddForm")[0].reset();
                $("#lazadaSalesPlatAccountAddForm").trigger('reset');
                $("#lazadaSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                $("#lazadaSalesPlatAccountAddForm input[name='acctDetailId']").val("");
            }
        });
    });
    if ($("#index_sync_fail_store").length > 0) {
        $("#lazadaSyncListingStatus").val($("#index_sync_fail_store").val());
        $("#index_sync_fail_store").remove();
        form.render('select');
    }
    render_hp_orgs_users("#lazadaAcctSearchForm"); //渲染部门销售员店铺三级联动

    function lazadaAccount_tableRender(){
      let formObj = serializeObject($("#lazadaAcctSearchForm"))
      formObj.searchType = searchType
      let grossRateMin = Number(formObj.grossRateMin),grossRateMax = Number(formObj.grossRateMax);
      if(grossRateMin != '' && grossRateMax != ''&& grossRateMax<grossRateMin){
          layer.msg("毛利率右侧值需比左侧值大")
          return false;
      }
      formObj.refreshTokenExpiryTime =(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:'');
      formObj.refreshTokenSevenExpiryTime =(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:'');
      table.render({
        elem: "#lazadaTable",
        method: "post",
        url: ctx + "/salesplat/salesPlatAccountDtoPage.html?platCode=lazada",
        where: formObj,
        cols: [
            [
                //标题栏
                { type: "checkbox" },
                {
                    field: "storeAcct",
                    title: "店铺名称",
                    templet: d=>{
                        let tagDoms = ''
                        if(d.storeTagListStr && d.storeTagListStr != ''){
                            tagDoms = d.storeTagListStr.split(",").map(item=>`<span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">${item}</span>`).join('')
                        }
                        return `<div>${d.storeAcct}<br>${tagDoms}</div>`
                    },
                    sort: true,
                },
                {
                    field: "grossRate",
                    title: "毛利率",
                    width: 70,
                },
                {
                    field: "refresh_token",
                    title: "授权到期时间",
                    width: 200,
                    templet: `<div>
            <div class="alignLeft">
                {{# if(d.accessToken){ }}
                access: 
                   {{ Format(d.accessTokenExpiryTime,"yyyy-MM-dd hh:mm:ss")}}
                    <a class="layui-btn layui-btn-danger layui-btn-xs fixRightIcon"                   lay-event="refreshAccessToken" 
                    title="刷新token">
                        <i class="layui-icon layui-icon-refresh-3"></i>
                    </a>
                {{# } }}<br>
                {{# if(d.refreshToken){ }}
                    refresh: {{ Format(d.refreshTokenExpiryTime,"yyyy-MM-dd hh:mm:ss")}}
                {{# } }}<br>
                {{# if(d.chatAccessTokenExpiryTime){ }}
                    chat access_token: {{ Format(d.chatAccessTokenExpiryTime,"yyyy-MM-dd hh:mm:ss")}}
                {{# } }}<br>
                {{# if(d.chatRefreshTokenExpiryTime){ }}
                    chat refresh_token: {{ Format(d.chatRefreshTokenExpiryTime,"yyyy-MM-dd hh:mm:ss")}}
                {{# } }}
            </div>
            </div>`
                },
                { field: "brand", title: "品牌", width: 80, },
            //     {
            //         field: "imgDomain",
            //         title: "图片域名",
            //         templet: `<div>
            // <div class="alignLeft">
            //     {{# if(d.expireTime){ }}
            //         域名:{{d.imgDomain}}
            //     <br>
            //        到期时间:{{ Format(d.expireTime,"yyyy-MM-dd")}}
            //     {{# }else{ }}
            //        {{d.imgDomain}}
            //     {{# } }}
            // </div>
            // </div>`,
            //         width: 150
            //     },
                { field: "status", title: "店铺状态", templet: '#lazadaAcctStatusTpl', width: 75 },
                // { field: "orderDownloadStatus", title: "订单下载", templet: "#orderDownloadStatusTemplet", width: 90 },
                { title: "人员信息", width: 110,templet: `
                <div>
                    销售：{{d.salesperson||''}}
                    <br>
                    客服：{{d.customServicer||''}}
                    <br>
                    主管：{{d.sellLeaderName||''}}
                    <br>
                    lazada组长：<br>{{d.leaderName||''}}
                </div>
            ` },
            //     {
            //         field: "sellLeaderName",
            //         title: "自动删除",
            //         templet: `
            //     <div>
            //         {{d.autoDelete ? '已开启': '已关闭' }}
            //         {{# if (d.autoDelete){ }}
            //          每天删除{{d.autoDeleteNum}}
            //            {{# if (d.autoDeleteSalesType == 1){ }}
            //            ，30天销量=0
            //            {{# }else if(d.autoDeleteSalesType == 2){ }}
            //            ，60天销量=0
            //            {{# }else{ }}
            //             ，90天销量=0
            //            {{# } }}
            //         {{# } }}
            //     </div>
            // `,
            //         width: 110
            //     },
                {
                    field: 'Listing额度',
                    title: 'Listing额度',
                    width: 180,
                    templet: `
                <div>
                    Listing总额度：{{d.listingQuotaLimit?d.listingQuotaLimit:'-' }}
                    <br>
                    Listing已使用：{{d.listingQuotaUsed?d.listingQuotaUsed:'-' }}
                  <br>
                  <!--{{d.syncListingQuotaTime||''}}  -->
                  <!--<a class="layui-btn layui-btn-xs" lay-event="lazadaAccountSyncListingQuotaTimeBtn">同步</a>-->
                  变动时间：{{Format(d.limitChangeTime||'', "yyyy-MM-dd")}}
                  <br>
                  变动额度：{{d.limitChangeCount||''}}
                </div>
            `
                },
                // {
                //     field: "autoPublishCateIds",
                //     title: "自动删除设置",
                //     width: 100,
                //     templet: '#lazada_autoHandle'
                // },
                {
                    field: "lazadaPreOrderConfigStatus",
                    title: "预售",
                    width: 65,
                    templet: '#lazadaAcct_presale_tpl'
                },
                {
                    field: "lazadaFilterSexImg",
                    title: "性感图片过滤设置",
                    width: 65,
                    templet: '#lazadaAcct_filterSexImg_tpl'
                },
                {
                    field: "lazadaMediaCenter",
                    title: "自动上传视频设置",
                    width: 65,
                    templet: '#lazadaAcct_mediaCenter_tpl'
                },
                {
                    field: "",
                    title: "预售情况",
                    width: 150,
                    templet: `
                <div>
                    预售总额度：{{d.lazadaPreOrderItemLimit?d.lazadaPreOrderItemLimit: 0 }}<br>
                    预售已使用：{{d.lazadaPreOrderItemNum?d.lazadaPreOrderItemNum:0 }}<br>
                    预售占比：{{d.lazadaPreOrderItemRatio|| 0}}%
                </div>`
                },
                {
                    field: "",
                    title: "延长收货",
                    width: 100,
                    templet: `
                <div>
                    {{# if(d.holidayMode == true){ }}
                        已开启<br>
                       {{ Format(d.holidayPeriodStart,"yyyy-MM-dd")}}-{{ Format(d.holidayPeriodEnd,"yyyy-MM-dd")}}
                    {{# }else{ }}
                       未开启
                    {{# } }}
                </div>`
                },
                {
                    title: "上次同步时间",
                    templet: "#lazadaSyncStatus",
                    width: 140,
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
                { title: '操作', width: 90, align: 'center', toolbar: '#lazadaTableBar'}
            ],
        ],
        done: function(res, curr, count) {
          sessionStorage.clear("lastJumpParam");
            if(res.code == '0000'){
                $("#lazadaAccount_colLen").text(res.extra.mainTab);
                // $("#lazada_acct_domain_overdue_number").text(res.extra.sevenTab);
            }else{
                $("#lazadaAccount_colLen").text(0);
                // $("#lazada_acct_domain_overdue_number").text(0);
            }
        },
        id: 'lazadaAcctTable',
        page: true, //是否显示分页
        limits: [500, 1000, 2000],
        limit: 500, //每页默认显示的数量
      });
    }


    element.on('tab(lazada_acct_tab_filter)', function(data) {
        searchType = $(this).attr("lay-id");
        // active.reload();
        $('#lazadaSearch').trigger('click');
    });

    $('#lazadaSearch').click(function() {
        // var type = $(this).data('type');
        // active[type] ? active[type].call(this) : '';
        lazadaAccount_tableRender();
    });
    //同步lisiting
    $("#lazada_syncLazadaListing").click(function() {
        var checkStatus = table.checkStatus('lazadaAcctTable'); //获取选择的店铺
        var checkAcctNum = checkStatus.data.length;
        if (checkAcctNum == null || checkAcctNum < 1) {
            layer.msg("请选择店铺", { icon: 0 });
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
            var platCode = "lazada";
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
                        element.progress(showListingPrecent, returnData.data.precent);
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
    form.on('submit(addLazadaAcct)', function(data) {
        if(data.field["salesSite"] == 'TH' && data.field["manufacturer"] == ''){
            layer.msg("请选择运输方式")
            return false;
        }
        //设置销售人员名称
        data.field["salesperson"] = $("#lazadaSalesPlatAccountAddForm select[name=salespersonId] option:selected").text();
        data.field["sellLeaderId"] = $("#lazadaSalesPlatAccountAddForm select[name=sellLeaderId]").val();
        data.field["sellLeaderName"] = $("#lazadaSalesPlatAccountAddForm select[name=sellLeaderId] option:selected").text();
        data.field["customServicerId"] = $("#lazadaSalesPlatAccountAddForm select[name=customServicerId]").val();
        data.field["customServicer"] = $("#lazadaSalesPlatAccountAddForm select[name=customServicerId] option:selected").text();
        data.field["leaderId"] = $("#lazadaSalesPlatAccountAddForm select[name=leaderId]").val();
        data.field["leaderName"] = $("#lazadaSalesPlatAccountAddForm select[name=leaderId] option:selected").text();

        if($("#lazadaSalesPlatAccountAddForm select[name=customServicerId]").val() == ''){
            layer.msg("请选择客服专员")
            return false;
        }

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
                    // table.reload('lazadaAcctTable');
                    $("#lazadaSearch").click()
                } else {
                    layer.msg(res.msg);
                }
            },
            error: function() {
                loading.hide()
                layer.msg('网络繁忙')
            }
        });
        return false;
    });

    form.on('submit(delLazadaAcct)', function(data) {
        lazadaAcct_deleteSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    form.on('submit(reuseLazadaAcct)', function(data) {
        lazadaAcct_openSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

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
                    layer.closeAll();
                    $('#lazadaSearch').trigger('click');
                } else {
                    layer.msg(res.msg);
                }
            }
        });
    }

    function getStoreAcctIds() {
        var acctIds = [];
        var checkStatus = table.checkStatus('lazadaAcctTable'); //test即为基础参数id对应的值
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

    // function lazadaAccountAutoSelect(data) {
    //     form.on('select(autoPublishTypeFilter)', function(obj) {
    //         var val = obj.value;
    //         if (val == 1) {
    //             $('#lazadaStyle_siteShow').html('(MY)')
    //             initLazadaCateTree('MY').then(function(result) {
    //             });
    //         } else {
    //             $('#lazadaStyle_siteShow').html('');
    //             initLazadaCateTree(data.salesSite).then(function(result) {
    //             });
    //         }
    //     });
    // }

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(lazadaTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值
        var saleSite = data.salesSite || ''; //站点
        if (data.autoPublishType != 2) {
            saleSite = "MY";
        }
        if (layEvent === 'edit') {
            var index = layer.open({
                type: 1,
                title: "设置平台账号信息",
                area: ["920px", "600px"],
                shadeClose: false,
                content: $("#addLazadaInfoLayer").html(),
                btn: ['保存', '关闭'],
                yes: function(index, layero) {
                    var dataObj = {
                        brand: $("#lazadaSalesPlatAccountAddForm input[name='brand']").val(),
                        // imgDomain: $("#lazadaSalesPlatAccountAddForm input[name='imgDomain']").val(),
                        salespersonId: $("#lazadaSalesPlatAccountAddForm select[name='salespersonId']").val(),
                        customServicer:$("#lazadaSalesPlatAccountAddForm select[name='customServicerId'] option:selected").text(),
                        customServicerId:$("#lazadaSalesPlatAccountAddForm select[name='customServicerId']").val(),
                    }
                    var result = checkRequiredData(dataObj);
                    if (result) {
                        $('#addLazadaAcct').trigger("click");
                        return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
                    }
                },
                success: function(layero, index) {
                    for (var i = 0; i < lazadaSiteEnum.length; i++) {
                        $("#lazadaSalesPlatAccountAddForm select[name=salesSite]")
                            .append('<option value="' + lazadaSiteEnum[i].code + '">' + lazadaSiteEnum[i].name + '</option>');
                    }
                    lazadaAcct_getSalesPersion();
                    lazadaAcct_getSalesPlatAccountBaseAndDetailInfo(data.id);
                    form.render('select');
                    form.render('radio');
                    form.render('checkbox');
                },
                end: function() {
                    // $("#lazadaSalesPlatAccountAddForm")[0].reset();
                    $("#lazadaSalesPlatAccountAddForm").trigger('reset');
                    $("#lazadaSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                    $("#lazadaSalesPlatAccountAddForm input[name='acctDetailId']").val("");

                    $("#lazadaAcctReuseDiv").addClass('layui-hide');
                    $("#lazadaAcctDelDiv").addClass('layui-hide');
                }
            });
        }
        if (layEvent === 'auth') {
            var index = layer.open({
                type: 1,
                title: "授权",
                area: ['800px', '500px'],
                shadeClose: false,
                content: $("#lazadaAuthLayer").html(),
                btn: ["保存", "关闭"],
                yes: function(layero) { //
                    loading.show()
                    $.ajax({
                        url: ctx + '/lazada/saveAuthInfo.html',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            "storeAcctId": data.id,
                            "code": $('#lazadaAuthForm [name=code1]').val(),
                            "chatCode": $('#lazadaAuthForm [name=code2]').val()
                        },
                        success: function(response) {
                            loading.hide()
                            if (response.code == '0000') {
                                layer.closeAll();
                                layer.msg('授权成功');
                                // table.reload('lazadaAcctTable');
                                $("#lazadaSearch").click()
                            } else {
                                layer.msg(response.msg)
                            }
                        },
                        error: function() {
                            loading.hide()
                            layer.msg('网络繁忙')
                        }
                    })
                },
                success: function(layero, index) {
                    let chat = {'SG':'https://marketplace.lazada.sg/web/detail.html?articleCode=FW_GOODS-1000011633&itemCode=FW_GOODS-1000011633-1',
                        'MY':'https://marketplace.lazada.com.my/web/detail.html?articleCode=FW_GOODS-1000011633&itemCode=FW_GOODS-1000011633-1',
                        'VN':'https://marketplace.lazada.vn/web/detail.html?articleCode=FW_GOODS-1000011633&itemCode=FW_GOODS-1000011633-1',
                        'ID':'https://marketplace.lazada.co.id/web/detail.html?articleCode=FW_GOODS-1000011633&itemCode=FW_GOODS-1000011633-1',
                        'PH':'https://marketplace.lazada.com.ph/web/detail.html?articleCode=FW_GOODS-1000011633&itemCode=FW_GOODS-1000011633-1',
                        'TH':'https://marketplace.lazada.co.th/web/detail.html?articleCode=FW_GOODS-1000011633&itemCode=FW_GOODS-1000011633-1'},
                    other = {
                        'SG':'https://marketplace.lazada.sg/web/detail.html?articleCode=FW_GOODS-1000011626&itemCode=FW_GOODS-1000011626-1',
                        'MY':'https://marketplace.lazada.com.my/web/detail.html?articleCode=FW_GOODS-1000011626&itemCode=FW_GOODS-1000011626-1',
                        'VN':'https://marketplace.lazada.vn/web/detail.html?articleCode=FW_GOODS-1000011626&itemCode=FW_GOODS-1000011626-1',
                        'ID':'https://marketplace.lazada.co.id/web/detail.html?articleCode=FW_GOODS-1000011626&itemCode=FW_GOODS-1000011626-1',
                        'PH':'https://marketplace.lazada.com.ph/web/detail.html?articleCode=FW_GOODS-1000011626&itemCode=FW_GOODS-1000011626-1',
                        'TH':'https://marketplace.lazada.co.th/web/detail.html?articleCode=FW_GOODS-1000011626&itemCode=FW_GOODS-1000011626-1'
                    };

                    $('#lazadaAuthForm .chatApi').val(chat[data.salesSite])
                    $('#lazadaAuthForm .otherApi').val(other[data.salesSite])
                    // $.ajax({
                    //     url: ctx + '/lazada/getAuthUrlInfo.html',
                    //     type: 'post',
                    //     dataType: 'json',
                    //     success: function(response) {
                    //         loading.hide()
                    //         if (response.code == '0000') {
                    //             $('#lazadaAuthForm #authUrl').val("https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=" + response.data.callbackUrl + "&client_id=" + response.data.clientId)
                    //         } else {
                    //             layer.msg(response.msg);
                    //         }
                    //     }
                    // });
                }
            });
        }
        if (layEvent === 'refreshAccessToken') {
            lazadaAcct_refreshLazadaAccessToken(data.acctDetailId);
        }
        if (layEvent == 'notSet') { //未设置
            var index = layer.open({
                type: 1,
                title: "自动删除设置",
                area: ['800px', '30%'],
                shadeClose: false,
                content: $("#lazada_setedLayer").html(),
                btn: ["保存", "关闭"],
                success: function(layero, index) {
                    var getTpl = lazada_setedContainerTpl.innerHTML,
                        view = document.getElementById('lazada_setedContainer');
                    laytpl(getTpl).render(data, function(html) {
                        view.innerHTML = html;
                        form.render();
                    });
                },
                yes: function(index, layero) {
                    //自动删除
                    var autoDelete = layero.find('[name=autoDelete]:checked').val();
                    var autoDeleteNum = layero.find('[name=autoDeleteNum]').val();
                    var autoDeleteSalesType = layero.find('select[name=autoDeleteSalesType] option:selected').val().trim();
                    var autoDeleteGreatListingTime = layero.find('[name=autoDeleteGreatListingTime]').val();
                    var lazadaCommentLte = layero.find('[name=lazadaCommentLte]').val();
                    if (!autoDeleteGreatListingTime) {
                        return layer.msg('请输入刊登时间');
                    }
                    if (autoDeleteGreatListingTime < 5) {
                        return layer.msg('刊登天数需大于等于5天');
                    }
                    if (autoDelete == 'true') {
                        if (!autoDeleteNum) {
                            return layer.msg('请输入自动删除数量!', { icon: 2 });
                        }
                    }
                    var obj = {
                        platCode: 'lazada',
                        storeAcctIdStr: data.id,
                        autoDelete: autoDelete,
                        autoDeleteNum: Number(autoDeleteNum),
                        autoDeleteSalesType: autoDeleteSalesType,
                        lazadaCommentLte:lazadaCommentLte==''?'':lazadaCommentLte*1,
                        autoDeleteGreatListingTime: autoDeleteGreatListingTime
                    };
                    lazadaAutoAjax(obj).then(function(result) {
                        layer.close(index);
                        layer.msg(result || '设置自动删除成功!', { icon: 1 });
                        $('#lazadaSearch').trigger('click'); //重新搜索
                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    })
                },
                end: function() {
                    // $('#lazadaCateTree').empty();
                    lazadaCateTree.destroy();
                    lazadaCateData = undefined;
                }
            });
        }
        if (layEvent == 'hasSet') { //已设置
            var index = layer.open({
                type: 1,
                title: "自动删除设置",
                area: ['800px', '30%'],
                shadeClose: false,
                content: $("#lazada_setedLayer").html(),
                btn: ["保存", "关闭"],
                success: function(layero, index) {
                    var getTpl = lazada_setedContainerTpl.innerHTML,
                        view = document.getElementById('lazada_setedContainer');
                    laytpl(getTpl).render(data, function(html) {
                        view.innerHTML = html;
                        form.render();
                    });
                },
                yes: function(index, layero) {
                    //自动删除
                    var autoDelete = layero.find('[name=autoDelete]:checked').val();
                    var autoDeleteNum = layero.find('[name=autoDeleteNum]').val();
                    var autoDeleteSalesType = layero.find('select[name=autoDeleteSalesType] option:selected').val().trim();
                    var autoDeleteGreatListingTime = layero.find('[name=autoDeleteGreatListingTime]').val();
                    var lazadaCommentLte = layero.find('[name=lazadaCommentLte]').val();
                    if (!autoDeleteGreatListingTime) {
                        return layer.msg('请输入刊登时间');
                    }
                    if (autoDeleteGreatListingTime < 5) {
                        return layer.msg('刊登天数需大于等于5天');
                    }
                    if (autoDelete == 'true') {
                        if (!autoDeleteNum) {
                            return layer.msg('请输入自动删除数量!', { icon: 2 });
                        }
                    }
                    var obj = {
                        platCode: 'lazada',
                        storeAcctIdStr: data.id,
                        autoDelete: autoDelete,
                        autoDeleteNum: Number(autoDeleteNum),
                        autoDeleteSalesType: autoDeleteSalesType,
                        lazadaCommentLte:lazadaCommentLte==''?'':lazadaCommentLte*1,
                        autoDeleteGreatListingTime: autoDeleteGreatListingTime
                    };
                    lazadaAutoAjax(obj).then(function(result) {
                        layer.close(index);
                        layer.msg(result || '设置自动删除成功!', { icon: 1 });
                        $('#lazadaSearch').trigger('click'); //重新搜索
                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    })
                },
                end: function() {
                    // $('#lazadaCateTree').empty();
                    lazadaCateTree.destroy();
                    lazadaCateData = undefined;
                }
            });
        }
        if(layEvent == "lazadaAccountSyncListingQuotaTimeBtn"){ // 同步
            getDataLazadaAccountLazadaSyncStoreQuota(data.id).then(function(result) {
                layer.msg(result, { icon: 1 });
            }).catch(function(err) {
                layer.msg(err, { icon: 2 });
            })
        }
        if(layEvent == 'storeTagList'){  // 店铺标签
            lazadaAcct_storeTagSet({isBatch: false,idArr: [data.id]})
        }
        if(layEvent === 'setPreSale'){ // 预售设置
            lazadaAcct_setPreSale(data)
        }
        if(layEvent === 'setMediaCenter'){ // 自动上传视频设置
            lazadaAcct_setMediaCenter(data)
        }
        if(layEvent === 'setFilterSexImg'){ // 性感图片过滤设置
            lazadaAcct_setFilterSexImg(data)
        }
        if(layEvent == 'checkAccessToken'){
          ztt_storeCommonCheckAuthFn(data.id, data.platCode);
        }
    });

    function lazadaAcct_setFilterSexImg_tableRender(storeAcctId,isFirst){
        commonReturnPromise({
            url: ctx + "/lazadaSexCate/getByStoreAcctId?storeAcctId=" + storeAcctId,
            type: 'get'
        }).then(res=>{
            if(isFirst == true){
                $("#lazadaAccount_filter_sku").val(res.skuList)
            }
        table.render({
            elem: "#lazadaFilterSexImgTable",
            data: res.list,
            cols: [[
                { type: "checkbox",field: "id" }, {
                    field: "cateId",
                    title: "类目id",
                    width: 70,
                }, {
                    field: "fullCateName",
                    title: "过滤性感图片类目"
                }, {
                    field: "createTime",
                    title: "添加时间",
                    width: 150,
                    templet: `<div>{{ d.createTime?Format(d.createTime,"yyyy-MM-dd hh:mm:ss"):''}}</div>`
                },{
                    field: "creator",
                    title: "添加人",
                    width: 100,
                }, { title: '操作', width: 90, align: 'center', toolbar: '#lazadaFilterSexImgTableBar'}
            ]], done: function(res, curr, count) {},
            id: 'lazadaFilterSexImgTable',
            page: false, //是否显示分页
            limit: res.list.length, //每页默认显示的数量
        });
        })
    }

    // 性感图片过滤设置

    let lazadaAccountlazadaCates;
    function lazadaAcct_setFilterSexImg(data){
        let popIndex = layer.open({
            type: 1,
            title: "性感图片过滤设置",
            area: ['1000px', '600px'],
            content: $("#lazada_acct_filter_sex_img_tpl").html(),
            btn: ["关闭"],
            success: function(layero, index) {
                $("#lazadaAccount_siteSingle").val(data.salesSite)
                $("#lazadaAccount_storeAcctId").val(data.id)
                lazadaAcct_setFilterSexImg_tableRender(data.id,true)

                lazadaAccountlazadaCates = layCascader({
                    elem: "#lazadaAccountlazadaCates",
                    clearable: true,
                    filterable: true,
                    collapseTags: true,
                    placeholder: '请选择',
                    // options: res,
                    props: {
                        multiple: true,
                        label: "enName",
                        value: "categoryId"
                    },
                })

                commonReturnPromise({
                    url: "/lms/lazada/getLazadaCategoryTree?site=" + data.salesSite,
                }).then((res)=>{
                    lazadaAccountlazadaCates.setOptions(res)
                })
            }
        })
    }
    table.on('tool(lazadaFilterSexImgTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent == 'delete') {
            layer.confirm('确认删除吗？', {icon: 7, title:'提示'}, function(index){
                commonReturnPromise({
                    url: ctx + `/lazadaSexCate/deleteListByIdList`,
                    type: 'POST',
                    contentType: 'application/json',
                    params: JSON.stringify([data.id])
                }).then(res=>{
                    lazadaAcct_setFilterSexImg_tableRender($("#lazadaAccount_storeAcctId").val())
                    layer.alert('删除成功',{icon:1})
                })
            });
        }
    })
    // 性感图片过滤设置--保存
    $(document).on("click", "#lazadaAccount_save_btn", function () {
        commonReturnPromise({
            url: ctx + `/lazadaSexCate/addSexProdPSkuList`,
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify({
                storeAcctId:$("#lazadaAccount_storeAcctId").val(),
                prodPSku:$("#lazadaAccount_filter_sku").val()
            })
        }).then(res=>{
            layer.alert(res,{icon:1})
        })
    })
    // 性感图片过滤设置--批量删除
    $(document).on("click", "#lazadaAccount_delete_btn", function () {
        let checkData = table.checkStatus('lazadaFilterSexImgTable').data;
        if(checkData.length <= 0){
            return layer.msg("请至少选择一条数据")
        }
        layer.confirm('确认删除吗？', {icon: 7, title:'提示'}, function(index){
            commonReturnPromise({
                url: ctx + `/lazadaSexCate/deleteListByIdList`,
                type: 'POST',
                contentType: 'application/json',
                params: JSON.stringify(checkData.map(item=>item.id))
            }).then(res=>{
                lazadaAcct_setFilterSexImg_tableRender($("#lazadaAccount_storeAcctId").val())
                layer.alert('删除成功',{icon:1})
            })
        });
    })
    // 性感图片过滤设置--添加类目
    $(document).on("click", "#lazadaAccount_cate_select_btn", function () {
            // admin.itemCat_select('lazadaAccountLayer_category_select_event',
            //     'lazadaAccountLayer_category_Id',
            //     'lazadawhiteListLayer_category_text',
            //     "/lazada/getLazadaCateList.html?siteId=" + siteCode,
            //     "/lazada/searchLazadaCate.html?siteId=" + siteCode
            // );
        let cateIdList = JSON.parse($('#lazadaAccountlazadaCates').val() || '[]');//平台类目ID
            commonReturnPromise({
                url: ctx + `/lazadaSexCate/saveForStore`,
                type: 'POST',
                contentType: 'application/json',
                params: JSON.stringify({
                    storeAcctId:$("#lazadaAccount_storeAcctId").val(),
                    cateIdList:cateIdList
                })
            }).then(res=>{
                lazadaAccountlazadaCates.setValue(null)
                lazadaAcct_setFilterSexImg_tableRender($("#lazadaAccount_storeAcctId").val())
            })
    });

    // $(document).on("change", "#lazadaAccountLayer_category_Id", function () {
    //     commonReturnPromise({
    //         url: ctx + `/lazadaSexCate/saveForStore`,
    //         type: 'POST',
    //         contentType: 'application/json',
    //         params: JSON.stringify({
    //             storeAcctId:$("#lazadaAccount_storeAcctId").val(),
    //             cateIdList:[$("#lazadaAccountLayer_category_Id").val()]
    //         })
    //     }).then(res=>{
    //         lazadaAcct_setFilterSexImg_tableRender($("#lazadaAccount_storeAcctId").val())
    //     })
    // })

    // 自动上传视频设置
    function lazadaAcct_setMediaCenter(obj){
        let confirmindex =layer.open({
            type: 1,
            title: "自动上传视频至店铺media center",
            area: ["500px", '300px'],
            btn: ['保存', '关闭'],
            content: $('#lazadaAcct_mediaCenter_layer').html(),
            success: function (layero, index) {
                commonReturnPromise({
                    url: ctx + '/LazadaVideoUpload/getByStoreAcctId?storeAcctId=' + obj.id,
                    type: 'GET',
                }).then(res=>{
                    if(res.id){
                        $(layero).find('[name=status][value="' + res.status + '"]').prop("checked",true);
                        $(layero).find('[name=prodPSkus]').val(res.prodPSkus)
                        $(layero).find('[name=id]').val(res.id)
                        layui.form.render();
                    }
                })
                layui.form.render();
            }, yes: function(index, layero) {
                let data = serializeObject($(layero).find("#lazadaAcct_mediaCenterDeleteForm"))
                commonReturnPromise({
                    url: ctx + '/LazadaVideoUpload/saveOrUpdate',
                    type: 'POST',
                    contentType: 'application/json',
                    params: JSON.stringify({
                        id:data.id,
                        storeAcctId: obj.id,
                        status:data.status,
                        prodPSkus:data.prodPSkus
                    })
                }).then(res=>{
                    layer.alert(res)
                    layer.close(confirmindex)
                    $("#lazadaSearch").click()
                })
            }, end: function () {

            }
        })
    }

    // 预售设置
    function lazadaAcct_setPreSale(obj={}){
        let isAdd = true
        let id = ''
        let popIndex = layer.open({
            type: 1,
            title: "预售设置",
            area: ['1020px', '400px'],
            content: $("#lazada_acct_set_presale_tpl").html(),
            btn: ["保存", "关闭"],
            success: function(layero, index) {
                // 修改样式
                layero.find('.layui-form-label').css({'width':'110px','padding':"9px 15px 9px 0"})
                layero.find('.layui-input-block').css({'margin-left':'125px'})
                layero.find('.layui-form-item').css({'margin-bottom':'15px'})

                $('#lazada_acct_set_presale_form textarea[name=itemIdsStr]').blur(function(){
                    let curVal = $(this).val().replaceAll('，',',').split(',').map(Number).filter(item=>item)
                    $(this).val([...new Set(curVal)].join(','))
                })

                commonReturnPromise({
                    url: ctx + `/getByStoreAcctId`,
                    params: {
                        'storeAcctId': `${obj.id}`
                    }
                }).then(res=>{
                    let formDom = $('#lazada_acct_set_presale_form')
                    if(JSON.stringify(res) != '{}'){
                        isAdd = false
                        id = res.id
                        //赋值
                        formDom.find(`input[name=status][value=${res.status}]`).prop('checked',true)
                        res.itemIdsStr !==undefined && formDom.find('textarea[name=itemIdsStr]').val(res.itemIdsStr)
                        res.salesType !==undefined && formDom.find('select[name=salesType]').val(res.salesType)
                        res.salesDay !==undefined && formDom.find('input[name=salesDay]').val(res.salesDay)
                        res.secondLeftArrivalDay !==undefined&& formDom.find('input[name=secondLeftArrivalDay]').val(res.secondLeftArrivalDay)
                        res.secondRightArrivalDay !==undefined&& formDom.find('input[name=secondRightArrivalDay]').val(res.secondRightArrivalDay)
                        res.thirdLeftArrivalDay !==undefined&& formDom.find('input[name=thirdLeftArrivalDay]').val(res.thirdLeftArrivalDay)
                        res.thirdRightArrivalDay !==undefined&& formDom.find('input[name=thirdRightArrivalDay]').val(res.thirdRightArrivalDay)
                        res.auditTimeDayLte !==undefined && formDom.find('input[name=auditTimeDayLte]').val(res.auditTimeDayLte)
                        res.secondZeroRatio !==undefined && formDom.find('input[name=secondZeroRatio]').val(res.secondZeroRatio)
                        res.thirdZeroRatio !==undefined && formDom.find('input[name=thirdZeroRatio]').val(res.thirdZeroRatio)
                    }
                    form.render()
                })

            },
            yes:function(){
                let formObj = serializeObject($('#lazada_acct_set_presale_form'))
                let statusDom = $('#lazada_acct_set_presale_form').find('input[name=status]:checked')
                if(!statusDom.length){
                    return layer.msg('请选择预售状态')
                }
                formObj.status = Number(statusDom.val())
                formObj.salesType = formObj.salesType==='' ? null : Number(formObj.salesType)
                formObj.salesDay = formObj.salesDay==='' ? null : Number(formObj.salesDay)
                formObj.secondLeftArrivalDay = formObj.secondLeftArrivalDay==='' ? null : Number(formObj.secondLeftArrivalDay)
                formObj.secondRightArrivalDay = formObj.secondRightArrivalDay==='' ? null : Number(formObj.secondRightArrivalDay)
                formObj.thirdLeftArrivalDay = formObj.thirdLeftArrivalDay==='' ? null : Number(formObj.thirdLeftArrivalDay)
                formObj.thirdRightArrivalDay = formObj.thirdRightArrivalDay==='' ? null : Number(formObj.thirdRightArrivalDay)
                formObj.auditTimeDayLte = formObj.auditTimeDayLte==='' ? null : Number(formObj.auditTimeDayLte)
                formObj.storeAcctId = obj.id
                if(!isAdd){
                    formObj.id = id
                }
                if(formObj.status === 1){
                    if(!formObj.itemIdsStr && formObj.salesDay === null && formObj.salesType === null && formObj.auditTimeDayLte === null){
                        return layer.msg('如需开启预售，3个优先级条件必填1项，请重新设置')
                    }else if(!formObj.salesType){
                        if(formObj.salesDay !==null){
                            return layer.msg('预售设置中，请选择销量')
                        }
                    }else if(!!formObj.salesType){
                        if(formObj.salesDay ===null){
                            return layer.msg('预售设置中，请填写销量')
                        }
                    }
                    lazadaAcct_preSaleAjax(isAdd, formObj,'',popIndex)
                }else if(formObj.status === 0){
                    layer.confirm('店铺预售设置取消后，已预售商品将在1个工作日内全部取消预售，确定继续取消预售吗？', {icon: 7, title:'提示'}, function(index){
                        lazadaAcct_preSaleAjax(isAdd, formObj,index,popIndex)
                    });
                }else if(formObj.status === 2){
                    layer.confirm('店铺预售定时任务暂停后，该店铺将不再调整所有商品的预售状态，已预售的继续保持预售，未预售的继续不预售，确定继续暂停预售定时任务吗？?', {icon: 7, title:'提示'}, function(index){
                        lazadaAcct_preSaleAjax(isAdd, formObj,index,popIndex)
                    });
                }
            }
        })
    }

    // 预售设置  接口
    function lazadaAcct_preSaleAjax(isAdd, formObj, curLayer='',popIndex){
        commonReturnPromiseRes({
            url: ctx + '/saveOrUpdateLazadaShopAutoPre',
            // type: isAdd?'POST':'PUT', // 新建POST 更新PUT
            type: isAdd?'POST':'PUT', // 新建POST 更新PUT
            contentType: 'application/json',
            params: JSON.stringify({...formObj})
        }).then(res=>{
            if(res.code == '0000'){
                if(res.msg.includes('item_id')){
                    layer.alert('部分商品不存在--->' +res.msg, { icon: 2 });
                }else {
                    layer.msg('保存成功', {icon: 1})
                }
                curLayer && layer.close(curLayer)
                layer.close(popIndex)
                $("#lazadaSearch").click()
            }else{
                layer.alert(res.msg, { icon: 2 });
            }
        }).catch(err => {
            layer.alert(err, { icon: 2 });
        })
    }

    form.on("select(lazadaAccountBtnSelect)",function(data){
        data.value == "新增店铺"? window.location.href = `${ctx}/static/templet/addStoreTemplate.xlsx`:'';
        data.value == "修改店铺"?window.location.href = `${ctx}/static/templet/importLazadaSysSalesPlatAcctUpdateInfo.xlsx`:'';
        data.value == "授权信息"? window.location.href = `${ctx}/static/templet/lazadaStoreAuthInfoTemplate.xlsx`:'';
        data.value == "预售设置"? window.location.href = `${ctx}/static/templet/addLazadaShopPre.xlsx`:'';
    })

    $("#lazadaAccountExportBtn").click(()=>{
        const selectData = $("#lazadaAccountCard select[name=lazadaAccountBtnSelect]").val()
        selectData == "新增店铺"?$('#addLazadaInfoByImportFile').click():'';
        selectData == "修改店铺"?$("#lazada_importEditStore").click():'';
        selectData == "授权信息"?$("#lazada_importAuthInfo").click():'';
        selectData == "预售设置"?$("#lazada_importPresale").click():'';
    })

    // 同步店铺刊登额度接口
    // id：number 店铺ID
    function getDataLazadaAccountLazadaSyncStoreQuota(id){
        return commonReturnPromise({
            url: `/lms/lazadaStore/lazadaSyncStoreQuota`,
            type: 'get',
            params:{
                "storeId":id
            }
        })
    }

    //刷新令牌
    function lazadaAcct_refreshLazadaAccessToken(acctDetailId) {
        layer.confirm("刷新令牌会改变原有令牌，确定刷新吗？除非时间快过期，尽量不要刷新", function(result) {
            if (result) {
                layui.admin.load.show()
                $.ajax({
                    type: "POST",
                    url: ctx + "/salesplat/refreshAccessToken.html",
                    data: { id: acctDetailId },
                    dataType: "json",
                    success: function(returnData) {
                        layui.admin.load.hide()
                        if (returnData.code == "0000") {
                            layer.msg("操作成功");
                            table.reload("lazadaAcctTable");
                        } else {
                            layer.msg("系统异常:" + returnData.msg);
                        }
                    },
                    error: function() {
                        layer.msg("服务器正忙");
                    },
                });
            }
        });
    }



    // 获取平台账号基本和辅助信息
    function lazadaAcct_getSalesPlatAccountBaseAndDetailInfo(salesPlatAccountId) {
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
                if(returnData.salesSite == 'TH'){
                    $(".lazadaAcctManufacturer").show()
                    $("#lazadaSalesPlatAccountAddForm select[name='manufacturer']").val(returnData.manufacturer);
                }else{
                    $(".lazadaAcctManufacturer").hide()
                }

                // base
                $("#lazadaSalesPlatAccountAddForm input[name='acctBaseId']").val(returnData.acctBaseId);
                $("#lazadaSalesPlatAccountAddForm input[name='storeAcct']").val(returnData.storeAcct);
                $("#lazadaSalesPlatAccountAddForm input[name='registerEmail']").val(returnData.registerEmail);
                $("#lazadaSalesPlatAccountAddForm textarea[name='acctBaseRemark']").val(returnData.acctBaseRemark);
                $("#lazadaSalesPlatAccountAddForm select[name=salespersonId]").val(returnData.salespersonId);
                $("#lazadaSalesPlatAccountAddForm select[name=sellLeaderId]").val(returnData.sellLeaderId);
                $("#lazadaSalesPlatAccountAddForm select[name=leaderId]").val(returnData.leaderId);
                $("#lazadaSalesPlatAccountAddForm select[name=customServicerId]").val(returnData.customServicerId);
                form.render('select');
                $("#lazadaSalesPlatAccountAddForm input[name='ibayAliasName']").val(returnData.ibayAliasName);
                $("#lazadaSalesPlatAccountAddForm input[name='allrootAliasName']").val(returnData.allrootAliasName);
                if (returnData.discountRate != '' && returnData.discountRate != null) {
                    $("#lazadaSalesPlatAccountAddForm input[name='discountRate']").val(returnData.discountRate);
                }

                $("#lazadaSalesPlatAccountAddForm input[name='brand']").val(returnData.brand);
                $("#lazadaSalesPlatAccountAddForm select[name='salesSite']").val(returnData.salesSite);
                // detail
                $("#lazadaSalesPlatAccountAddForm input[name='acctDetailId']").val(returnData.acctDetailId);
                $("#lazadaSalesPlatAccountAddForm input[name='salesAcctId']").val(returnData.salesAcctId);
                $("#lazadaSalesPlatAccountAddForm input[name='taxNumber']").val(returnData.taxNumber);
                $("#lazadaSalesPlatAccountAddForm input[name='eoriNumber']").val(returnData.eoriNumber);

                if (returnData.status == false) {
                    $("#lazadaAcctReuseDiv").removeClass('layui-hide');
                } else {
                    $("#lazadaAcctDelDiv").removeClass('layui-hide');
                }
            },
            error: function() {
                layer.msg("服务器正忙");
            }
        });
    }

    //停用店铺账号
    function lazadaAcct_deleteSalesPlatAccount(salesPlatAccountId) {
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
                            // table.reload('lazadaAcctTable');
                            $("#lazadaSearch").click()
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
    function lazadaAcct_openSalesPlatAccount(salesPlatAccountId) {
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
                            // table.reload('lazadaAcctTable');
                            $("#lazadaSearch").click()
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

    // $('#addLazadaInfoByImportBtn').click(function() {
    //     $('#addLazadaInfoByImportFile').click()
    // })
    $('#addLazadaInfoByImportFile').on('change', function() {
        var files = $('#addLazadaInfoByImportFile')[0].files
            // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        layer.confirm('确认导入这个文件进行新增店铺吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/salesplat/importStore.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        loading.hide()
                        $('#addLazadaInfoByImportFile').val('')

                        if (data.code === '0000') {
                            layer.alert('成功新增: ' + data.data + ' 个店铺')
                        } else {
                            layer.msg(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#addLazadaInfoByImportFile').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })
    form.on('select(lazadaAccountSalesSite)', function(data) {
        var val = data.value;
        if(val == 'TH'){
            $(".lazadaAcctManufacturer").show()
        }else{
            $(".lazadaAcctManufacturer").hide()
        }
    })

    form.on('select(lazadaAcctBatchOper)', function(data) {
        var optionNum = data.value;
        if (3 == optionNum) {
            var acctIds = lazadaAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改信息",
                area: ["500px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editLazadaSalesPersonLayer").html(),
                end: function() {
                    $("#editLazadaSalesPersonForm select[name=salespersonId]").val("");
                    $("#editLazadaSalesPersonForm select[name=sellLeaderId]").val("");
                    $("#editLazadaSalesPersonForm select[name=customServicerId]").val("");
                    $("#editLazadaSalesPersonForm select[name=customServicerId]").val("");
                },
                success: function(layero, index) {
                    lazadaAcct_getSalesPersion();
                    form.render("select");
                },
                yes: function() {
                    var salespersonId = $("#editLazadaSalesPersonForm select[name=salespersonId]").val();
                    var salesperson = $("#editLazadaSalesPersonForm select[name=salespersonId] option:selected").text();
                    var sellLeaderId = $("#editLazadaSalesPersonForm select[name=sellLeaderId]").val();
                    var sellLeaderName = $("#editLazadaSalesPersonForm select[name=sellLeaderId] option:selected").text();
                    var customServicerId = $("#editLazadaSalesPersonForm select[name=customServicerId]").val();
                    var customServicer = $("#editLazadaSalesPersonForm select[name=customServicerId] option:selected").text();
                    var leaderId = $("#editLazadaSalesPersonForm select[name=leaderId]").val();
                    var leaderName = $("#editLazadaSalesPersonForm select[name=leaderId] option:selected").text();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/editSalesPerson.html",
                        dataType: "json",
                        data: {
                            ids: acctIds,
                            salesperson: salesperson,
                            salespersonId: salespersonId,
                            sellLeaderId: sellLeaderId,
                            sellLeaderName: sellLeaderName,
                            leaderId: leaderId,
                            leaderName: leaderName,
                            customServicerId:customServicerId,
                            customServicer:customServicer
                        },
                        traditional: true,
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("批量修改信息成功");
                                table.reload("lazadaAcctTable");
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        // } else if (4 == optionNum) {
        //     var acctIds = lazadaAcct_getStoreAcctIds();
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
        //     var acctIds = lazadaAcct_getStoreAcctIds();
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

        } else if (8 == optionNum) { //启用店铺
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
                };
                form.render("select");
                batchUpdateAcctStatus(obj);
            });
        } else if (9 == optionNum) { //批量停用店铺
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
        }else if( 10 == optionNum) { // 批量添加店铺标签
            commonTableCksSelected('lazadaAcctTable').then(function(result) {
                const idArr = result.map(item=>item.id);
                lazadaAcct_storeTagSet({isBatch:true ,idArr:idArr})
            })
                .catch(function(err) {
                    layer.msg(err, { icon: 7 });
                })
        }else if( 11 == optionNum) { // 批量开启延长收货
            commonTableCksSelected('lazadaAcctTable').then(function(result) {
                const idArr = result.map(item=>item.id);
                holidayPeriodLayer(idArr.join(","))
            })
            .catch(function(err) {
                layer.msg(err, { icon: 7 });
            })
        }
        else if( 12 == optionNum) { // 批量关闭延长收货
            commonTableCksSelected('lazadaAcctTable').then(function(result) {
                layer.confirm('是否对选中店铺全部关闭延长收货？', {icon: 7, title:'提示'}, function(index){
                    const idArr = result.map(item=>item.id);
                    holidayPeriodApi({holidayMode:false ,ids:idArr.join(",")})
                });
            })
            .catch(function(err) {
                layer.msg(err, { icon: 7 });
            })
        }
    });

    function holidayPeriodLayer(ids){
        layer.open({
                type: 1,
                title: "设置延长收货",
                area: ["300px", "200px"],
                shadeClose: false,
                content: $("#holidayPeriodLayer").html(),
                btn: ['保存', '关闭'],
                success: function (layero, index) {
                    // 时间渲染
                    laydate.render({
                        elem: '#holidayPeriodTime',
                        min: 1,
                        range: true
                    })
                },
                yes: function (index, layero) {
                    let time = layero.find('#holidayPeriodTime').val()
                    if(time == ''){
                        return layer.alert("请选择时间",{icon:7})
                    }
                    let holidayPeriodStart = time.split(" - ")[0],
                        holidayPeriodEnd = time.split(" - ")[1];
                    holidayPeriodApi({
                        ids,
                        holidayPeriodStart,
                        holidayPeriodEnd,
                        holidayMode: true,
                    },index)
                    // return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
                }
            })
    }

    function holidayPeriodApi(data,index) {
        commonReturnPromiseRes({
            url:'/lms/salesplat/batchSetLazadaHolidayMode',
            type: 'post',
            params: data
        }).then((res)=>{
            if(res.code == '0000'){
                if(res.msg.includes("失败")){
                    layer.alert(JSON.stringify(res.extra),{icon:7})
                }else{
                    layer.msg(res.msg)
                }
            }
            layer.close(index);
            $("#lazadaSearch").click()
        }).catch((err)=>{
            layer.alert(err,{icon:2})
            layer.close(index);
        })
    }

    // 店铺标签设置
    function lazadaAcct_storeTagSet({isBatch=false,idArr}){
        const title = isBatch ? '批量添加店铺标签' :'店铺标签'
        let configId = ''
        let popIndex = layer.open({
            type: 1,
            title,
            area: ['820px', '600px'],
            content: '',
            btn: ["保存", "清空"],
            success: function(layero, index) {
                let apiList = [commonReturnPromise({
                    url: '/lms/sysdict/getStoreTagByCode',
                    type: 'post',
                    params: {codes: 'lazada'}
                })]
                if(!isBatch){
                    apiList.push(
                        commonReturnPromise({
                            url: `/lms/salesplat/getStoreConfig?storeAcctId=${idArr[0]}`,
                        })
                    )
                }
                Promise.all(apiList)
                    .then(res=>{
                        let bacthTitle='提示：批量给选中的店铺添加标签，既是将以下选中的标签添加到选中的店铺中，不会覆盖原有标签。'
                        let tagList = res[0]
                        if(!isBatch){
                            bacthTitle = ''
                            configId = res[1].id
                            const storeTagList = res[1].storeTagListStr ? res[1].storeTagListStr.split(',') : []
                            tagList = tagList.map(item=>({...item, checked: storeTagList.includes(item.name)}))
                        }
                        const getTpl = $("#lazada_acct_set_storetag_tpl").html()
                        laytpl(getTpl).render({ isBatch,bacthTitle,tagList}, function (html) {
                            layero.find('.layui-layer-content').html(html)
                            form.render()
                        })
                    })
            },
            yes:function(index,layero){
                let storeTagList = []
                layero.find('input[name=storeTag]:checked').each(function(){
                    storeTagList.push( $(this).val())
                })
                if(isBatch){
                    commonReturnPromise({
                        url:'/lms/salesplat/batchAddStoreTag',
                        type: 'post',
                        params: {storeAcctIdList:idArr.join(), storeTagList: storeTagList.join()}
                    }).then(()=>{
                        layer.msg('操作成功')
                        layer.close(index);
                        $("#lazadaSearch").click()
                    })
                }else{
                    const storeTagListStr = storeTagList.join()
                    commonReturnPromise({
                        url:'/lms/salesplat/saveOrUpdateStoreTag',
                        type: 'post',
                        contentType: 'application/json',
                        params:JSON.stringify({storeAcctId:idArr[0], configId, storeTagListStr})
                    }).then(()=>{
                        layer.msg('操作成功')
                        layer.close(index);
                        $("#lazadaSearch").click()
                    })
                }
            },
            btn2: function (index, layero) {
                layero.find('input[name=storeTag]').each(function(){
                    $(this).prop('checked',false)
                })
                form.render()
                return false
            },
        })
    }

    function lazadaAcct_getStoreAcctIds() {
        var acctIds = [];
        var checkStatus = table.checkStatus('lazadaAcctTable'); //test即为基础参数id对应的值
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
    //                 $('#lazadaSearch').trigger('click');
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
        if (dataObj.brand == null || dataObj.brand == '' || dataObj.brand == undefined) {
            layer.msg('请输入品牌');
            return false;
        }
        // if (dataObj.imgDomain == null || dataObj.imgDomain == '' || dataObj.imgDomain == undefined) {
        //     layer.msg('请输入图片域名');
        //     return false;
        // }
        // if (dataObj.imgDomain.indexOf(".") < 1 || dataObj.imgDomain.length < 5) {
        //     layer.msg("修改图片域名失败，域名格式错误", { icon: 2 });
        //     return false;
        // }
        if (dataObj.salespersonId == null || dataObj.salespersonId == '' || dataObj.salespersonId == undefined) {
            layer.msg('请选择销售员');
            return false;
        }
        return true;
    }


    //监听iframe传参
    window.addEventListener('message', function(event){
      let {syncStatus,time,sevenTime} = event.data;
      if(syncStatus){
        $('#lazadaAcctSearchForm [name=syncStatus]').val(syncStatus);
        form.render('select');
        $('#lazadaSearch').trigger('click');
      }
       //都存在表明是七天内过期域名
      if(time && sevenTime){
        vueIframeJumpAndSearch({time: time, sevenDayTime: sevenTime}, 'lazada');
      }
      if(time && !sevenTime){
        //{time: time}
        vueIframeJumpAndSearch({time: time}, 'lazada');
      }
    });
});

function lazadaAcct_getSalesPersion() {
    $("#lazadaSalesPlatAccountAddForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#lazadaSalesPlatAccountAddForm select[name=sellLeaderId]").html('<option value=""></option>');
    $("#lazadaSalesPlatAccountAddForm select[name=customServicerId]").html('<option value=""></option>');
    $("#lazadaSalesPlatAccountAddForm select[name=leaderId]").html('<option value=""></option>');
    $("#editLazadaSalesPersonForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#editLazadaSalesPersonForm select[name=sellLeaderId]").html('<option value="">选择销售主管</option>');
    $("#editLazadaSalesPersonForm select[name=customServicerId]").html('<option value=""></option>');
    $("#editLazadaSalesPersonForm select[name=leaderId]").html('<option value=""></option>');
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: { role: "lazada专员" },
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#lazadaSalesPlatAccountAddForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        $("#editLazadaSalesPersonForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')

                    }
                }
            }
        }
    });
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: { role: "lazada主管" },
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#lazadaSalesPlatAccountAddForm select[name=sellLeaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')
                        $("#editLazadaSalesPersonForm select[name=sellLeaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>')

                    }
                }
            }
        }
    });
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: { role: "lazada客服专员" },
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#lazadaSalesPlatAccountAddForm select[name=customServicerId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].loginName + '</option>')
                        $("#editLazadaSalesPersonForm select[name=customServicerId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].loginName + '</option>')
                    }
                }
            }
        }
    });
    $.ajax({
        type: "get",
        url: '/lms/sys/getPersonAndOrgsByRole.html?roleNames=lazada组长',
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data.userList;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#lazadaSalesPlatAccountAddForm select[name=leaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].user_name + '</option>')
                        $("#editLazadaSalesPersonForm select[name=leaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].user_name + '</option>')
                    }
                }
            }
        }
    });
    // commonReturnPromise({
    //     type: 'get',
    //     url: '/lms/sys/getPersonAndOrgsByRole.html?roleNames=lazada组长',
    // }).then(res => {
    //     if (res.userList.length > 0) {
    //         for (var i = 0; i < res.userList.length; i++) {
    //             $("#lazadaSalesPlatAccountAddForm select[name=leaderId]")
    //                 .append('<option value="' + res.userList[i].id + '">' + res.userList[i].user_name + '</option>')
    //             $("#editLazadaSalesPersonForm select[name=leaderId]")
    //                 .append('<option value="' + res.userList[i].id + '">' + res.userList[i].user_name + '</option>')
    //         }
    //         layui.form.render("select");
    //     }
    // })
}

/**
 * 获取所有的域名地址
 */
function lazadaAcct_getDomain() {
    // $("#editlazadaDomainLayer select[name=domainId]").html('<option value="">选择域名</option>');
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
                if (domainList.length > 0) {
                    for (var i = 0; i < domainList.length; i++) {
                        $("#editLazadaDomainForm select[name=domainId]")
                            .append('<option value="' + domainList[i].id + '">' + domainList[i].domain + '</option>')
                    }
                }
            }
        }
    });
}

//设置自动刊登函数
function lazadaAutoAjax(obj) {
    return commonReturnPromise({
        type: 'post',
        url: '/lms/salesplat/setAutoDeleteOrPublish',
        contentType: 'application/json',
        params: JSON.stringify(obj)
    })
}

//初始化lazada商品类目
function initLazadaCateAjax(saleSite) {
    return commonReturnPromise({
        url: ctx + "/salesplat/listLazadaCateTree.html?saleSite=" + saleSite
    });
}

// function initLazadaCateTree(saleSite) {
//     //左侧类目tree
//     return new Promise(function(resolve) {
//         initLazadaCateAjax(saleSite).then(function(result) {
//             $('#lazadaCateTree').empty();
//             var setting = {
//                 check: {
//                     enable: true,
//                     chkDisabledInherit: true,
//                 },
//                 data: {
//                     simpleData: {
//                         enable: true,
//                         idKey: "id",
//                         pIdKey: "pid",
//                     },
//                 },
//                 callback: {
//                     onCheck: function(event, treeId, treeNode) {
//                         //禁用所有子类
//                         if (treeNode.isParent) {
//                             var childrenNodes = treeNode.children;
//                             try {
//                                 for (var i = 0; i <= childrenNodes.length; i++) {
//                                     lazadaCateTree.setChkDisabled(
//                                         childrenNodes[i],
//                                         treeNode.checked,
//                                         false,
//                                         true
//                                     );
//                                 }
//                             } catch (e) {
//                                 //TODO handle the exception
//                                 console.log(e)
//                             }
//                             var childrenIds = getLazadaChildren([], treeNode);
//                             for (var i = 0; i < childrenIds.length; i++) {
//                                 var node = lazadaCateTree.getNodeByParam("id", childrenIds[i]);
//                                 lazadaCateTree.checkNode(node, treeNode.checked, false, true);
//                             }
//                         }
//                     }
//                 }
//             };
//             setting.check.chkboxType = { Y: "s", N: "s" };
//             lazadaCateData = result;
//             var t = $("#lazadaCateTree");
//             t = $.fn.zTree.init(t, setting, lazadaCateData);
//             lazadaCateTree = $.fn.zTree.getZTreeObj("lazadaCateTree");
//             resolve('tree');
//         }).catch(function(err) {
//             layer.alert(err, { icon: 2 });
//         });
//     });
// }

//获取ztree所有字节点id
function getLazadaChildren(ids, treeNode) {
    ids.push(treeNode.id);
    if (treeNode.isParent) {
        for (var obj in treeNode.children) {
            getLazadaChildren(ids, treeNode.children[obj]);
        }
    }
    return ids;
}

//
// //监听checkbox选中
// function watchCateChangeCkbox1(layero) {
//     var form = layui.form;
//     form.on('radio(cateChangeFilter1)', function(obj) {
//         if (obj.value == 'appoint') { //指定类目
//             layero.find('.lazadaCateTreeIsShow').removeClass('disN');
//         } else {
//             layero.find('.lazadaCateTreeIsShow').addClass('disN');
//         }
//     })
// }