console.log("进入aliexpressAccount.js")
/**
 * time: 2018/01/02
 */

layui.use(["admin", "form", "table", "layer", "formSelects", "laydate", "laytpl",'upload'], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        upload = layui.upload,
        element = layui.element;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    //定义一个额外的搜索参数，区分tab选项卡
    var searchType = "1";

    laydate.render({
        elem: '#aliexpressAcctSearchForm input[name=listing_time]',
        range: '~'
    });

    //初始化客服搜索项
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "smt客服专员"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#aliexpressAcctSearchForm select[name=customServicerId]").append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                    }
                    form.render('select');
                }
            }
        }
    });


    render_hp_orgs_users("#aliexpressAcctSearchForm");//渲染部门销售员店铺三级联动

    // 初始化
    aliexpressaccount_init()
    function aliexpressaccount_init(){
        Promise.all([commonReturnPromise({
            url: '/lms/sysdict/getStoreTagByCode',
            type: 'post',
            params: {codes: 'aliexpress'}
            })
        ]).then(res=>{
            formSelects.data('aliexpressaccount_search_storeTagList','local',{arr: res[0].map(item=>({...item, value:item.name}))})
        })
    }

    //按钮的点击事件
    $("#addAliexpressInfo").click(function () {
        var index = layer.open({
            type: 1,
            shadeClose: false,
            title: "添加aliexpress账号",
            area: ["920px", "480px"],
            btn: ['保存', '关闭'],
            success: function () {
                smtAcct_getSalesPersion();
                form.render('select');
            },
            yes: function () {
                $('#addAliexpressAcct').trigger("click");
                return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
            },
            content: $("#addAliexpressInfoLayer").html(),
            end: function () {
                $("#aliexpressSalesPlatAccountAddForm").trigger('reset');
                $("#aliexpressSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                $("#aliexpressSalesPlatAccountAddForm input[name='acctDetailId']").val("");
            }
        });
    });
    if ($("#index_sync_fail_store").length > 0) {
        $("#smtSyncListingStatus").val($("#index_sync_fail_store").val());
        $("#index_sync_fail_store").remove();
        form.render('select');
    }
    //表格渲染结果
    function getAliexpressAccountSearchData(){
        let syncStatusList = $('#aliexpressAcctSearchForm').find("[name='syncStatusList']").val(),
            storeTagList = $('#aliexpressAcctSearchForm').find("[name='storeTagList']").val(),
            listing_time = $('#aliexpressAcctSearchForm').find("[name='listing_time']").val(),
            startTime = listing_time ? listing_time.split(" ~ ")[0] + ' 00:00:00':'',
            endTime = listing_time ? listing_time.split(" ~ ")[1] + ' 23:59:59':'';
        if(listing_time){
            startTime = new Date(startTime).getTime();
            endTime = new Date(endTime).getTime();
        }
        return {
            status: $("#aliexpressAcctSearchForm select[name='status'] option:selected").val(),
            syncStatus: $("#smtSyncListingStatus").val(),
            searchType: searchType,
            storeAcct: $('#aliexpressAcctSearchForm').find("[name='storeAcct']").val(),
            orgId: $("#aliexpress_account_depart_sel").val(),
            salespersonId: $("#aliexpress_account_salesman_sel").val(),
            customServicerId: $("#aliexpressAcctSearchForm select[name=customServicerId]").val(),
            orderDownloadStatus: $('#aliexpressAcctSearchForm').find("[name='orderDownloadStatus']").val(),
            refreshTokenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:''),
            refreshTokenSevenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:''),
            syncDesc: $('#aliexpressAcctSearchForm').find("input[name='syncDesc']").val(),
            // syncStatusList: syncStatusList,
            storeTagList: storeTagList,
            autoDelete: $('#aliexpressAcctSearchForm').find("[name='autoDelete']").val(),
            timeType: $('#aliexpressAcctSearchForm').find("[name='timeType']").val(),
            startTime: startTime,
            endTime: endTime,
        }
    }
    //展示已知数据
    function aliexpressAccount_tableRender () {
        return table.render({
            elem: "#aliexpressTable",
            method: "post",
            url: ctx + "/salesplat/salesPlatAccountDtoPage.html?platCode=aliexpress",
            where: getAliexpressAccountSearchData(),
            cols: [
                [
                    //标题栏
                    {type: "checkbox"},
                    {
                        field: "storeAcct",
                        title: "店铺名称",
                        width: 210,
                        templet: d=>{
                            let tagDoms = ''
                            if(d.storeTagList && d.storeTagList.length){
                                tagDoms = d.storeTagList.map(item=>`<span class="hp-badge layui-bg-blue" style="width:auto;overflow:hidden;padding:0 5px!important;" lay-tips="${item}">${item}</span>`).join('')
                            }
                            const createTime = d.createTime ? Format(d.createTime,'yyyy-MM-dd hh:mm:ss') : ''
                            return `<div>${d.storeAcct}<br>创建时间:${createTime}<br>${d.clientId||''}<br>${tagDoms}</div>`
                        }
                    },
                    // {
                    //     field: "allrootAliasName",
                    //     title: "普源别名",
                    // },
                    {field: "grossRate", 
                    title: "毛利率/优惠幅度",
                    width: 110,
                    templet: "<div><div>毛利率：{{d.grossRate == undefined ? '' : d.grossRate}}</div><div>优惠幅度：{{d.discountRate == undefined ? '' : d.discountRate}}</div></div>",
                    },
                    {field:'personInfo',title:'人员信息',width:100, templet: '<div>销售:{{d.salesperson}}<br>组长:{{d.leaderName||""}}<br>主管:{{d.sellLeaderName}}<br>客服:{{d.customServicer}}</div>'},
                    {field: "status", title: "店铺状态", templet: '#aliexpressAcctStatusTpl', width: 65},
                    {field: "accessTokenExpiryTime", title: "授权到期时间", width: 200, templet: d=>{
                        const refreshTime = d.refreshTokenExpiryTime ? Format(d.refreshTokenExpiryTime,'yyyy-MM-dd hh:mm:ss') : ''
                        const accessTime =  d.accessTokenExpiryTime ? Format(d.accessTokenExpiryTime,'yyyy-MM-dd hh:mm:ss') : ''
                        return `refresh:${refreshTime}<br>access:${accessTime}`
                    }},
                    // {field: "orderDownloadStatus", title: "订单下载", templet: "#orderDownloadStatusTemplet", width: 90},
                    {filed: "autoDelete", title: '自动下架设置',width:90,templet: '#aliexpressAcct_autoDelete'},
                    {
                        field: 'Listing额度',
                        title: 'Listing额度',
                        width: 140,
                        templet:
                        `
                    <div>
                        Listing总额度：{{d.listingQuotaLimit ? d.listingQuotaLimit : '-' }}
                        <br>
                        Listing已使用：{{d.listingQuotaUsed ? d.listingQuotaUsed : '-' }}
                        <br>
                    </div>
                `
                    },
                    {
                        field: "syncStatus",
                        title: "同步lisiting状态",
                        templet: "#smtSyncStatus",
                    },
                    // {
                    //     field: "lastSyncTime",
                    //     title: "上次同步时间",
                    //     templet: "#smtLastSyncTime",
                    // },
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
                    {title: '操作', align: 'center', toolbar: '#aliexpressTableBar'}
                ],
            ],
            done: function (res, curr, count) {
                sessionStorage.clear("lastJumpParam");
                if(res.code =='0000'){
                    $("#aliexpressAccount_colLen").text(res.extra.mainTab);
                    // $("#aliexpress_acct_domain_overdue_number").text(res.extra.sevenTab);
                }else{
                    $("#aliexpressAccount_colLen").text(0);
                    // $("#aliexpress_acct_domain_overdue_number").text(0);
                }

                theadHandle().fixTh({id: '#aliexpressaccountCard'});
            },
            id: 'aliexpressAcctTable',
            page: true, //是否显示分页
            limits: [300, 500, 1000],
            limit: 500, //每页默认显示的数量
        });
    }

    // // 搜索
    // var active = {
    //     reload: function () {
    //         let searchParamForm = $('#aliexpressAcctSearchForm')
    //         let status = searchParamForm.find("[name='status'] option:selected").val();
    //         let storeAcct = searchParamForm.find("[name='storeAcct']").val();
    //         let syncStatus = $("#smtSyncListingStatus").val();//同步listing状态
    //         let orgId = $("#aliexpress_account_depart_sel").val();
    //         let salespersonId = $("#aliexpress_account_salesman_sel").val();
    //         let orderDownloadStatus = searchParamForm.find("[name='orderDownloadStatus']").val();
    //         let searchType = $('[lay-filter=aliexpress_acct_tab_filter]').find('.layui-this').attr('lay-id');
    //         var syncDesc = searchParamForm.find("input[name='syncDesc']").val();
    //         //执行重载
    //         if (Object.keys(table.cache).length == 0 || (Object.keys(table.cache).length > 0 && !table.cache.aliexpressAcctTable)) {
    //             aliexpressAccount_tableRender();
    //         } else {
    //             table.reload('aliexpressAcctTable', {
    //                 where: {
    //                     status: status,
    //                     storeAcct: storeAcct,
    //                     syncStatus: syncStatus,
    //                     orgId: orgId,
    //                     salespersonId: salespersonId,
    //                     searchType: searchType,
    //                     customServicerId: $("#aliexpressAcctSearchForm select[name=customServicerId]").val(),
    //                     orderDownloadStatus: orderDownloadStatus,
    //                     refreshTokenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:''),
    //                     refreshTokenSevenExpiryTime:(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:''),
    //                     syncDesc: syncDesc
    //                 }
    //             });
    //         }
    //     }
    // };

    element.on('tab(aliexpress_acct_tab_filter)', function (data) {
        searchType = $(this).attr("lay-id");
        $('#aliexpressSearch').trigger('click');
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
                    // active.reload();
                    layer.closeAll();
                    $('#aliexpressSearch').trigger('click');
                } else {
                    layer.msg(res.msg);
                }
            }
        });
    }

    $('#aliexpressSearch').click(function () {
        aliexpressAccount_tableRender();
        // var type = $(this).data('type');
        // active[type] ? active[type].call(this) : '';
    });


    // #region 下载模板导入模板
    form.on('select(aliexpressAcct_downloadType)',function(data){
        const { value } = data
        switch(value){
            case 'editStore':
                window.location.href = `${ctx}/static/templet/AliexpressAutoOffShelfListingTemplate.xlsx`
                break;
            default:
                break;
        }
    })
    let aliexpressAcctImportType = ''
    form.on('select(aliexpressAcct_importExcelType)',function(obj){
        const { value } = obj
        aliexpressAcctImportType = value
        if(value){
            $('#aliexpressAccount_import_file').click()
        }
    })

    $('#aliexpressAccount_import_file').on('change', function () {
        let files = $('#aliexpressAccount_import_file')[0].files
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
        // if(aliexpressAcctImportType == 'importNewPrice'){
        //   const importType = $('#shopeeOnlineProCard').find('select[name=exportType]').val()
        //   if(importType==='') return
        //   const importUrl = {
        //     storePrice: ctx + '/shopee/shopeeIsEnableProduct/adjustByExcel.html',
        //     cnscPrice: ctx + '/shopee/shopeeIsEnableProduct/adjustCnscByExcel',
        //   }
        //   let formData = new FormData()
        //   formData.append('file', files[0])
        //   let confirmIndex = layer.confirm('确认导入这个文件，对这些店铺的所有商品进行调价吗?', { btn: ['确认', '关闭'] },
        //     function () {
        //       layer.close(confirmIndex)
        //       loading.show()
        //       $.ajax({
        //         // url: ctx + '/shopee/shopeeIsEnableProduct/adjustByExcel.html',
        //         url: importUrl[importType],
        //         type: 'POST',
        //         // async : false,
        //         data: formData,
        //         // 告诉jQuery不要去处理发送的数据
        //         processData: false,
        //         // 告诉jQuery不要去设置Content-Type请求头
        //         contentType: false,
        //         success: function (res) {
        //           $('#aliexpressAccount_import_file').val('')
        //           loading.hide()
        //           if (res.code === '0000') {
        //             if(Array.isArray(res.data) && res.data.length){
        //               const _dataStr = res.data.join(',')
        //                 const msg = res.msg + '<br>' + `${res.data.length}个导入失败，店铺` +_dataStr+'系统不存在'
        //               layer.alert(msg)
        //             }else{
        //               layer.msg(res.msg||'操作成功',{icon:1})
        //             }
        //             // $('#shopee_online_search_submit').click()
        //           } else {
        //             layer.alert(res.msg)
        //           }
        //         },
        //         error: function () {
        //           loading.hide()
        //           $('#aliexpressAccount_import_file').val('')
        //         }
        //       })
        //     },
        //     function () {
        //       layer.closeAll()
        //       $('#aliexpressAccount_import_file').val('')
        //     }
        //   )
        // }else if(aliexpressAcctImportType == 'importNewTitle' || aliexpressAcctImportType == 'importNewDesc'){
          let formData = new FormData()
          formData.append('file', files[0])
          loading.show()
          $.ajax({
            url: '/lms/salesplat/aliexpress/importAutoOffListingConfig.html',
            type: 'POST',
            // async : false,
            data: formData,
            // 告诉jQuery不要去处理发送的数据
            processData: false,
            // 告诉jQuery不要去设置Content-Type请求头
            contentType: false,
            success: function (res) {
                $('#aliexpressAccount_import_file').val('')
                loading.hide()
                if(res.code=='0000'){
                    layer.msg(res.msg || '操作成功',{icon:1})
                }else{
                    if (Array.isArray(res.data)) {
                        const failArr = res.data.filter(item=>item.operationCode===0)
                        if(failArr.length){
                            aliexpressAccount_exportResult(failArr, res.msg || '操作失败')
                        }else{
                            layer.msg(res.msg || '操作失败',{icon:2})
                        }
                    }else{
                        layer.msg(res.msg || '操作失败',{icon:2})
                    }
                }
            },
            error: function () {
              loading.hide()
              $('#aliexpressAccount_import_file').val('')
            }
          })
        // }
      })

    function aliexpressAccount_exportResult(failArr, msg){
        failArr.length && layer.open({
            title:'操作失败结果',
            area:['800px','800px'],
            btn:['确认','取消'],
            content:$('#aliexpress_acct_export_result_tpl').html(),
            success:function(){
                var tableIns = table.render({
                    elem: '#aliexpress_acct_export_result',
                    data: failArr,
                    cols: [
                        [
                            { field: 'storeAcct', title: '店铺名称' },
                            { field: 'operationResult', title: '报错信息' }
                        ],
                    ],
                    id: 'aliexpress_acct_export_resultId',
                    page: false,
                    limit: 100000,
                })
            }
        })
        !failArr.length && layer.msg(msg||'操作失败',{icon:2})
    }
    // #endregion 下载模板导入模板
    //导出店铺信息
    $("#smtAcct_export").click(function () {
        layer.open({
            type: 1,
            title: "导出店铺信息",
            area: ["920px", "500px"],
            shadeClose: false,
            content: $("#smtAccount_exportLayer").html(),
            btn: ['导出', '关闭'],
            yes: function (index, layero) {
                let obj = {},formData = serializeObject(layero.find("#smtAccount_exportLayer_form"));
                if(formData.type == 1){ // 导出列表选中数据
                    var checkStatus = table.checkStatus('aliexpressAcctTable'); //获取选择的店铺
                    var checkAcctNum = checkStatus.data.length;
                    if (checkAcctNum == null || checkAcctNum < 1) {
                        layer.msg("未选择数据");
                        return;
                    }
                    let ids = checkStatus.data.map(item => item.id);
                    obj.ids = ids
                }else{
                    obj = {...getAliexpressAccountSearchData()}
                    // obj.syncStatusList = obj.syncStatusList ? obj.syncStatusList.split(",") : [];
                    obj.storeTagList = obj.storeTagList ? obj.storeTagList.split(",") : [];
                }
                obj.smtExportFields = formData.field?.split(",");
                if(obj.smtExportFields.includes('自动下架设置')){
                    let index = obj.smtExportFields.indexOf('自动下架设置');
                    obj.smtExportFields.splice(index, 1)
                    obj.smtExportFields = obj.smtExportFields.concat(["自动下架状态", "自动下架每日下架数量", "自动下架刊登时间≥", "自动下架listing店铺销量", "自动下架是否半托管商品"])
                }
                if(obj.smtExportFields.includes('授权到期时间')){
                    let index = obj.smtExportFields.indexOf('授权到期时间');
                    obj.smtExportFields.splice(index,1)
                    obj.smtExportFields = obj.smtExportFields.concat(["access到期时间", "refresh到期时间"])
                }
                obj.platCode = "aliexpress";
                console.log(obj)
                transBlob({
                    fileName: `aliexpress店铺.xlsx`,
                    url: "/lms/salesplat/exportSMTStore",
                    formData: JSON.stringify(obj),
                    contentType: 'application/json'
                }, 'post').then(function (result) {
                    layer.msg(result || '导出成功', { icon: 1 });
                    layer.close(index);
                }).catch(function (err) {
                    layer.alert(err , { icon: 2 })
                });
            },
            success: function (layero, index) {
                var getTpl = smtAccount_exportLayer_containerTpl.innerHTML,
                    view = document.getElementById('smtAccount_exportLayer_container');
                let field = [
                    '店铺名称',
                    '主账号',
                    '创建时间',
                    '标签',
                    '毛利率',
                    '优惠幅度',
                    '销售主管',
                    '组长',
                    '销售员',
                    '客服',
                    '店铺启用状态',
                    '授权到期时间',
                    // '订单下载状态',
                    '自动下架设置',
                    'listing总额度',
                    'listing已使用',
                    '同步状态',
                    '同步异常备注',
                    '备注'
                ]
                laytpl(getTpl).render({field}, function(html) {
                    view.innerHTML = html;
                    form.render();
                });

            }
        })
    })

    // 全选&反选
    form.on('checkbox(smtAcctCheckAll)', function(data){
        let elemCheck = data.elem.checked;
        $('.smtAcctCheckChildDiv').find('input[type=checkbox]').each(function(index){
            $(this).prop("checked",elemCheck);
        })
        form.render('checkbox','smtAccount_exportLayer_form')
    });
    // 子checkbox
    form.on('checkbox(smtAcctCheckChild)', function(data){
        let elemCheck = data.elem.checked;
        $("[lay-filter='smtAcctCheckAll']").prop("checked",true);
        $('.smtAcctCheckChildDiv').find('input[type=checkbox]').each(function(index){
            if($(this).prop("checked") == false){
                $("[lay-filter='smtAcctCheckAll']").prop("checked",false);
                return false;// 只结束each循环
            }
        })
        form.render('checkbox','smtAccount_exportLayer_form')
    });

    //同步lisiting
    $("#smt_syncWishListing").click(function () {
        var checkStatus = table.checkStatus('aliexpressAcctTable'); //获取选择的店铺
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
            var platCode = "aliexpress";
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
    form.on('submit(addAliexpressAcct)', function (data) {
        data.field["salesperson"] = $("#aliexpressSalesPlatAccountAddForm select[name=salespersonId] option:selected").text();
        data.field["customServicer"] = $("#aliexpressSalesPlatAccountAddForm select[name=customServicerId] option:selected").text();
        data.field["sellLeaderName"] = $("#aliexpressSalesPlatAccountAddForm select[name=salespersonLeaderId] option:selected").text();
        data.field["sellLeaderId"] = $("#aliexpressSalesPlatAccountAddForm select[name=salespersonLeaderId]").val();
        data.field["leaderName"] = $("#aliexpressSalesPlatAccountAddForm select[name=leaderId] option:selected").text();
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
                    // active.reload();
                    $('#aliexpressSearch').trigger("click")
                } else {
                    layer.msg(res.msg);
                }
            }
        });
        return false;
    });

    form.on('submit(delAliexpressAcct)', function (data) {
        smtAcct_deleteSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    form.on('submit(reuseAliexpressAcct)', function (data) {
        smtAcct_openSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(aliexpressTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent === 'edit') {
            layer.open({
                type: 1,
                title: "设置平台账号信息",
                area: ["920px", "500px"],
                shadeClose: false,
                content: $("#addAliexpressInfoLayer").html(),
                btn: ['保存', '关闭'],
                yes: function () {
                    var salespersonId = $("#aliexpressSalesPlatAccountAddForm select[name='salespersonId']").val();
                    var customServicerId = $("#aliexpressSalesPlatAccountAddForm select[name='customServicerId']").val();
                    var result = checkRequiredData(salespersonId, customServicerId);
                    // var imgDomain = $("#aliexpressSalesPlatAccountAddForm input[name='imgDomain']").val();
                    var strRegex = "^http://";
                    var re = new RegExp(strRegex);
                    // if(!re.test(imgDomain)) {
                    //     layer.msg("图片域名必须以http://开头");
                    //     return;
                    // }
                    if (result) {
                        $('#addAliexpressAcct').trigger("click");
                        return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
                    }
                },
                success: function (layero, index) {
                    smtAcct_getSalesPersion();
                    form.render('select');
                    form.render('radio');
                    form.render('checkbox');
                    smtAcct_getSalesPlatAccountBaseAndDetailInfo(data.id);
                },
                end: function () {
                    $("#aliexpressSalesPlatAccountAddForm").trigger('reset');
                    $("#aliexpressSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                    $("#aliexpressSalesPlatAccountAddForm input[name='acctDetailId']").val("");

                    $("#aliexpressAcctReuseDiv").addClass('layui-hide');
                    $("#aliexpressAcctDelDiv").addClass('layui-hide');
                }
            });
        } else if (layEvent == 'generateAccessToken') {
            var index = layer.open({
                type: 1,
                title: "速卖通店铺授权",
                area: ["600px", "300px"],
                shadeClose: false,
                btn: ['保存', '关闭'],
                content: $("#aliexpressTokenModalLayer").html(),
                success: function () {
                    // 设置salesAcctId隐藏域
                    $("#aliexpressTokenAddForm input[name='salesAcctId']").val(data.id);
                },
                yes: function () {
                    var salesAcctId = $("#aliexpressTokenAddForm input[name='salesAcctId']").val();
                    var code = $("#aliexpressTokenAddForm textarea[name='code']").val();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/getqimentoken.html",
                        async: true,
                        data: {
                            salesAcctId: salesAcctId,
                            code: code
                        },
                        dataType: "json",
                        success: function (returnData) {
                            if (returnData.code != '0000') {
                                layer.msg(returnData.msg);
                            } else {
                                layer.msg("授权成功");
                                layer.close(index);
                                $('#aliexpressSearch').trigger("click");
                            }
                        }
                    });
                }
            });
        } else if (layEvent == 'genAccessToken') {
            var index = layer.open({
                type: 1,
                title: "速卖通店铺授权(新)",
                area: ["600px", "300px"],
                shadeClose: false,
                btn: ['保存', '关闭'],
                content: $("#aliexpressTokenModalLayer").html(),
                success: function () {
                    // 设置salesAcctId隐藏域
                    $("#aliexpressTokenAddForm input[name='salesAcctId']").val(data.id);
                },
                yes: function () {
                    var salesAcctId = $("#aliexpressTokenAddForm input[name='salesAcctId']").val();
                    var code = $("#aliexpressTokenAddForm textarea[name='code']").val();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/getaliexpresstoken.html",
                        async: true,
                        data: {
                            salesAcctId: salesAcctId,
                            code: code
                        },
                        dataType: "json",
                        success: function (returnData) {
                            if (returnData.code != '0000') {
                                layer.msg(returnData.msg);
                            } else {
                                layer.msg("授权成功");
                                layer.close(index);
                                $('#aliexpressSearch').trigger("click");
                            }
                        }
                    });
                }
            });
        } else if (layEvent === 'refreshToken') {
            refreshAccessToken(data.acctDetailId);
        }else if(layEvent === 'syncCspStore'){
            commonReturnPromise({
                url: "/lms/smt/store/syncCSP",
                type: "post",
                contentType: "application/json;charset=utf-8",
                params: JSON.stringify([data.id]),
            }).then((res) => {
            layer.msg(res, { icon: 1 });
            });
        }else if(layEvent == 'checkAccessToken'){
          ztt_storeCommonCheckAuthFn(data.id, data.platCode);
        // }else if(layEvent == 'setStoreTags'){
        //     aliexpressAcct_storeTagSet({isBatch: false,idArr: [data.id]})
        }else if(layEvent == 'setAutoDelete'){ //自动下架设置
            smtAcct_setAutoDelete({data,isBatch:false,storeAcctIdList:[data.id]})
        }
    })

    // 获取平台账号基本和辅助信息
    function smtAcct_getSalesPlatAccountBaseAndDetailInfo(salesPlatAccountId) {
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
                $("#aliexpressSalesPlatAccountAddForm input[name='acctBaseId']").val(returnData.acctBaseId);
                $("#aliexpressSalesPlatAccountAddForm input[name='storeAcct']").val(returnData.storeAcct);
                // $("#aliexpressSalesPlatAccountAddForm input[name='imgDomain']").val(returnData.imgDomain);
                $("#aliexpressSalesPlatAccountAddForm input[name='allrootAliasName']").val(returnData.allrootAliasName);
                $("#aliexpressSalesPlatAccountAddForm input[name='taxNumber']").val(returnData.taxNumber);
                $("#aliexpressSalesPlatAccountAddForm input[name='eoriNumber']").val(returnData.eoriNumber);
                $("#aliexpressSalesPlatAccountAddForm select[name='currency']").val(returnData.currency);
                $("#aliexpressSalesPlatAccountAddForm textarea[name='acctBaseRemark']").val(returnData.acctBaseRemark);
                $("#aliexpressSalesPlatAccountAddForm select[name=salespersonId]").val(returnData.salespersonId);
                $("#aliexpressSalesPlatAccountAddForm select[name=customServicerId]").val(returnData.customServicerId);
                $("#aliexpressSalesPlatAccountAddForm select[name=salespersonLeaderId]").val(returnData.sellLeaderId);
                $("#aliexpressSalesPlatAccountAddForm select[name=leaderId]").val(returnData.leaderId);
                form.render('select');


                // detail
                $("#aliexpressSalesPlatAccountAddForm input[name='acctDetailId']").val(returnData.acctDetailId);
                $("#aliexpressSalesPlatAccountAddForm input[name='salesAcctId']").val(returnData.salesAcctId);

                if (returnData.status == false) {
                    $("#aliexpressAcctReuseDiv").removeClass('layui-hide');
                } else {
                    $("#aliexpressAcctDelDiv").removeClass('layui-hide');
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    }

    //停用店铺账号
    function smtAcct_deleteSalesPlatAccount(salesPlatAccountId) {
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
                            // active.reload();
                            $('#aliexpressSearch').trigger('click');
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

    //启用店铺
    function smtAcct_openSalesPlatAccount(salesPlatAccountId) {
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
                            layer.msg(returnData.msg);
                            layer.closeAll();
                            // active.reload();
                            $('#aliexpressSearch').trigger('click');
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

    // 获取速卖通授权code
    form.on('submit(addAliexpressAcctToken)', function (data) {
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/unLogin/getAliexpressAuthorizeCode.html",
            dataType: "json",
            data: data.field,
            success: function (returnData) {
                if (returnData.code == "0000") {
                    //layer.msg("生成token成功");
                    window.open(returnData.data);
                    //$("#aliexpressTokenModal").modal('hide');
                    //queryPage(searchData, salesPlatAccountUrl, salesPlatAccountTmpUrl);
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
        return false;
    });

    //刷新令牌
    /* function refreshAccessToken(apiAssisConfigId) {
         layer.confirm("刷新令牌会改变原有令牌，确定刷新吗？除非时间快过期，尽量不要刷新", function (result) {
             if (result) {
                 $.ajax({
                     type: "POST",
                     url: ctx + "/salesplat/refreshAccessToken.html",
                     data: {"id": apiAssisConfigId},
                     dataType: "json",
                     success: function (returnData) {
                         if (returnData.code == "0000") {
                             layer.msg("操作成功");
                             active.reload();
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
     }*/

    // 自动下架设置
    function smtAcct_setAutoDelete({data,isBatch,storeAcctIdList}){
        const title = isBatch ? '批量设置自动下架': '设置自动下架'
        var index = layer.open({
            type: 1,
            title,
            area: ["500px", "480px"],
            btn: ["保存", "关闭"],
            content: $("#smtAcct_setAutoDelete_layer").html(),
            success: function (layero, index) {
                if(!isBatch){
                    const formDom = $('#smtAcct_setAutoDelete_form')
                    if(data.autoDelete){
                        formDom.find('input[name=autoDelete][value=1]').prop('checked',true)
                    }else if(data.autoDelete===false){
                        formDom.find('input[name=autoDelete][value=0]').prop('checked',true)
                    }
                    formDom.find(`input[name=autoDeleteNum]`).val(data.autoDeleteNum)
                    formDom.find(`input[name=autoDeleteGreatListingTime]`).val(data.autoDeleteGreatListingTime)
                    if(data.autoDeleteSalesType){
                        const autoDeleteSalesTypeObj={
                            1: '30天销量=0',
                            2: '60天销量=0',
                            3: '90天销量=0',
                            4: '180天销量=0'
                        }
                        formDom.find(`select[name=autoDeleteSalesType]`).val(autoDeleteSalesTypeObj[data.autoDeleteSalesType])
                    }
                    formDom.find(`select[name=halfManage]`).val(data.halfManage?.toString())
                }
                form.render()
            },
            yes: function () {
                const formData = serializeObject($("#smtAcct_setAutoDelete_form"))
                if(formData.autoDelete===null || formData.autoDelete===undefined) return layer.msg('请选择是否下架')
                if(formData.autoDelete === '1' &&formData.autoDeleteNum==='') return layer.msg('请输入每日下架数量')
                commonReturnPromise({
                    url: '/lms/salesplat/aliexpress/autoOffListing',
                    type: 'post',
                    contentType: 'application/json;charset=UTF-8',
                    params: JSON.stringify({...formData,storeAcctIdList})
                }).then(res=>{
                    layer.msg(res.msg,{icon:1})
                    layer.closeAll();
                                $('#aliexpressSearch').trigger('click');
                })
            },
        });
    }

     form.on('select(aliexpressAcctBatchOper)', function (data) {
        var optionNum = data.value;
        if (3 == optionNum) {
            var acctIds = smtAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改信息",
                area: ["500px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editAliexpressSalesPersonLayer").html(),
                end: function () {
                    $("#editAliexpressSalesPersonForm select[name=salespersonId]").val("");
                    $("#editAliexpressSalesPersonForm select[name=salespersonLeaderId]").val("");
                },
                success: function (layero, index) {
                    smtAcct_getSalesPersion();
                    form.render("select");
                },
                yes: function () {
                    var salespersonId = $("#editAliexpressSalesPersonForm select[name=salespersonId]").val();
                    var salesperson = $("#editAliexpressSalesPersonForm select[name=salespersonId] option:selected").text();
                    var sellLeaderId = $("#editAliexpressSalesPersonForm select[name=salespersonLeaderId]").val();
                    var sellLeaderName = $("#editAliexpressSalesPersonForm select[name=salespersonLeaderId] option:selected").text();
                    var customServicerId = $("#editAliexpressSalesPersonForm select[name=customServicerId]").val();
                    var customServicer = $("#editAliexpressSalesPersonForm select[name=customServicerId] option:selected").text();
                    var leaderName = $("#editAliexpressSalesPersonForm select[name=leaderId] option:selected").text();
                    var leaderId = $("#editAliexpressSalesPersonForm select[name=leaderId]").val();
                    loading.show();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/editSalesPerson.html",
                        dataType: "json",
                        data: {
                            ids: acctIds,
                            platCode: 'aliexpress',
                            salesperson,
                            salespersonId ,
                            sellLeaderId ,
                            sellLeaderName,
                            customServicer,
                            customServicerId,
                            leaderName,
                            leaderId
                        },
                        traditional: true,
                        success: function (returnData) {
                            loading.hide();
                            if (returnData.code == "0000") {
                                layer.msg("批量销售员成功");
                                layer.closeAll();
                                $('#aliexpressSearch').trigger('click');
                                // active.reload();

                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        } else if(9==optionNum){
            var acctIds = smtAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改图片域名",
                area: ["600px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editAliexpressDomainLayer").html(),
                end: function () {
                    $("#editAliexpressDomainForm select[name=domainId]").val("");
                },
                success: function (layero, index) {
                    smtAcct_getDomain();
                    form.render("select");
                },
                yes: function () {
                    var imgDomain = $("#editAliexpressDomainForm select[name=domainId] option:selected").text();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/batchUpdateImgDomain.html",
                        dataType: "json",
                        data: {idListStr: acctIds, imgDomain: imgDomain},
                        traditional: true,
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.msg("修改图片域名成功");
                                layer.closeAll();
                                // active.reload();
                                $('#aliexpressSearch').trigger('click');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        // }else if (4 == optionNum) {
        //     var acctIds = smtAcct_getStoreAcctIds();
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
        // } else if (5 == optionNum) {
        //     var acctIds = smtAcct_getStoreAcctIds();
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
                var acctIds = smtAcct_getStoreAcctIds();
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
        } else if (7 == optionNum) {//批量停用店铺
            layer.confirm('确定批量停用店铺吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function (index) {
                var acctIds = smtAcct_getStoreAcctIds();
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
        }else if( 8 == optionNum) { // 批量添加店铺标签
            commonTableCksSelected('aliexpressAcctTable').then(function(result) {
                const idArr = result.map(item=>item.id);
                aliexpressAcct_storeTagBatchSet(idArr)
            })
            .catch(function(err) {
                layer.msg(err, { icon: 7 });
            })
        }else if( 10 == optionNum) { // 批量自动下架
            commonTableCksSelected('aliexpressAcctTable').then(function(result) {
                const idArr = result.map(item=>item.id);
                smtAcct_setAutoDelete({data: {}, isBatch: true, storeAcctIdList: idArr})
            })
            .catch(function(err) {
                layer.msg(err, { icon: 7 });
            })
        }
    });
    function smtAcct_getDomain() {
        $("#editAliexpressDomainLayer select[name=domainId]").html('<option value="">选择域名</option>');
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
                            $("#editAliexpressDomainForm select[name=domainId]")
                                .append('<option value="' + domainList[i].id + '">' + domainList[i].domain + '</option>')
                        }
                    }
                }
            }
        });
    }
    function smtAcct_getStoreAcctIds() {
        var acctIds = [];
        var checkStatus = table.checkStatus('aliexpressAcctTable'); //test即为基础参数id对应的值
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

    function batchUpdateOrderDownload(obj) {
        $.ajax({
            type: "POST",
            url: ctx + "/salesplat/batchUpdateOrderStatus.html", //请求接口地址
            dataType: "json",
            data: obj, //需要post的数据
            success: function (res) {
                loading.hide();
                //后台程序返回数据
                if (res.code == "0000") {
                    // active.reload();
                    $('#aliexpressSearch').trigger('click');
                } else {
                    layer.msg(res.msg);
                }
            },
        });
    }

    /**
     * 校验必填数据，为了保存和停用店铺时区分校验
     */
    function checkRequiredData(salespersonId, customServicerId) {
        if (salespersonId == null || salespersonId == '' || salespersonId == undefined) {
            layer.msg("请选择销售员");
            return false;
        }
        if (customServicerId == null || customServicerId == '' || customServicerId == undefined) {
            layer.msg("请选择客服");
            return false;
        }
        return true;
    }

    /**
     * 批量修改店铺标签
     */
    function aliexpressAcct_storeTagBatchSet(idArr){
        let popIndex = layer.open({
            type: 1,
            title: "批量修改店铺标签",
            area: ["500px", "500px"],
            content: $("#aliexpress_acct_set_bacth_storetag_tpl").html(),
            btn: ["保存", "关闭"],
            success: function (layero, index) {
              commonReturnPromise({
                url: "/lms/sysdict/getStoreTagByCode",
                type: "post",
                params: { codes: "aliexpress" },
              }).then((res) => {
                const arr = (res || []).map((item) => ({
                  name: item.name,
                  value: item.name,
                }));
                formSelects.data("aliexpressAccount_storetag_addStoreTagList", "local", {
                  arr,
                });
                formSelects.data("aliexpressAccount_storetag_removeStoreTagList", "local", {
                  arr,
                });
              });
            },
            yes: function (index, layero) {
              const addStoreTagList =
                formSelects.value("aliexpressAccount_storetag_addStoreTagList", "val") ||
                [];
              const removeStoreTagList =
                formSelects.value("aliexpressAccount_storetag_removeStoreTagList", "val") ||
                [];
              if (!addStoreTagList.length && !removeStoreTagList.length) {
                return layer.msg("请选择标签添加或移除！");
              }
              const sameTagArr = addStoreTagList.filter((item) =>
                removeStoreTagList.includes(item)
              );
              if (sameTagArr.length) {
                return layer.msg("同一标签无法同时添加与移除！");
              }
              commonReturnPromise({
                url: "/lms/salesplat/batchUpdateStoreTag",
                type: "post",
                contentType: "application/json",
                params: JSON.stringify({
                  storeAcctIdList: idArr,
                  addStoreTagList,
                  removeStoreTagList,
                }),
              }).then(() => {
                layer.msg('已成功添加/移除标签！', { icon: 1 });
                layer.close(popIndex);
                $("#aliexpressSearch").click()
              });
            },
          });
    }

      // 单个设置店铺标签
      function aliexpressAcct_storeTagSet({isBatch=false,idArr}){
        const title = !isBatch ? '修改店铺标签' : '批量修改店铺标签'
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
                    params: {codes: 'aliexpress'}
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
                    const getTpl = $("#aliexpress_acct_set_storetag_tpl").html()
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
                        layer.msg('操作成功', { icon: 1 })
                        layer.close(index);
                        $("#aliexpressSearch").click()
                    })
                }else{
                    const storeTagListStr = storeTagList.join()
                    commonReturnPromise({
                        url:'/lms/salesplat/saveOrUpdateStoreTag',
                        type: 'post',
                        contentType: 'application/json',
                        params:JSON.stringify({storeAcctId:idArr[0], configId, storeTagListStr})
                    }).then(()=>{
                        layer.msg('操作成功', { icon: 1 })
                        layer.close(index);
                        $("#aliexpressSearch").click()
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

    //监听iframe传参
    window.addEventListener('message', function(event){
      console.log('iframe接收到的数据是', event.data);
      let {syncStatus, time, sevenTime} = event.data;
      if(syncStatus){
        $('#smtSyncListingStatus').val(syncStatus);
        form.render('select');
        $('#aliexpressSearch').trigger('click');
      }
      //都存在表明是七天内过期域名
      if(time && sevenTime){
        //{time: time, sevenDayTime: sevenTime}
        vueIframeJumpAndSearch({time: time, sevenDayTime: sevenTime}, 'aliexpress');
      }
      //仅time存在表示过期域名
      if(time && !sevenTime){
        //{time: time}
        vueIframeJumpAndSearch({time: time}, 'aliexpress');
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
            "M+": datetime.getMonth() + 1,                 //月份
            "d+": datetime.getDate(),                    //日
            "h+": datetime.getHours(),                   //小时
            "m+": datetime.getMinutes(),                 //分
            "s+": datetime.getSeconds(),                 //秒
            "q+": Math.floor((datetime.getMonth() + 3) / 3), //季度
            "S": datetime.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    } else {
        return "";
    }
}

function smtAcct_getSalesPersion() {
    $("#aliexpressSalesPlatAccountAddForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#aliexpressSalesPlatAccountAddForm select[name=customServicerId]").html('<option value="">选择客服</option>');
    $("#editAliexpressSalesPersonForm select[name=salespersonId]").html('<option value="">选择销售员</option>');
    $("#aliexpressSalesPlatAccountAddForm select[name=salespersonLeaderId]").html('<option value=""></option>');
    $("#editAliexpressSalesPersonForm select[name=customServicerId]").html('<option value="">请选择</option>');
    $("#editAliexpressSalesPersonForm select[name=salespersonLeaderId]").html('<option value="">选择销售主管</option>');
    $("#aliexpressSalesPlatAccountAddForm select[name=leaderId]").html('<option value="">请选择组长</option>');
    $("#editAliexpressSalesPersonForm select[name=leaderId]").html('<option value="">请选择组长</option>');

    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "smt专员"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#aliexpressSalesPlatAccountAddForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                        $("#editAliexpressSalesPersonForm select[name=salespersonId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                    }
                }
            }
        }
    });

    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "smt客服专员"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#aliexpressSalesPlatAccountAddForm select[name=customServicerId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                            $("#editAliexpressSalesPersonForm select[name=customServicerId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                    }
                }
            }
        }
    });

    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "smt主管"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#aliexpressSalesPlatAccountAddForm select[name=salespersonLeaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                        $("#editAliexpressSalesPersonForm select[name=salespersonLeaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                    }
                }
            }
        }
    });

    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: {role: "smt组长"},
        dataType: "json",
        async: false,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#aliexpressSalesPlatAccountAddForm select[name=leaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                        $("#editAliexpressSalesPersonForm select[name=leaderId]")
                            .append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                    }
                }
            }
        }
    });
}

function smtAcctCheckNum(dom,setting){
    let curVal = $(dom).val()
    const {percision, min, max} =setting
    if(!!curVal){
        // 转为数字
        const numCurVal = Number(curVal)
        if(!numCurVal && numCurVal !==0){
            curVal = ''
        }else{
            curVal = numCurVal
            curVal = curVal.toFixed(percision || 0)
            if(max || max ===0){
                if(curVal>max){
                    curVal = max
                }
            }
            if(min || min ===0){
                if(curVal<min){
                    curVal = min
                }
            }
        }
        $(dom).val(curVal)
    }
}
