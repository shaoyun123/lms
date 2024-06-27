/**
 * time: 2018/01/02
 */

layui.use(["admin", "form", "table", "layer", "laytpl", 'element', 'formSelects', 'upload'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        upload = layui.upload,
        formSelects = layui.formSelects,
        element = layui.element;
    $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    //
    shopeeAccount_init()
    function shopeeAccount_init(){
        Promise.all([commonReturnPromise({
            url: '/lms/sysdict/getStoreTagByCode',
            type: 'post',
            params: {codes: 'shopee'}
            }),
            commonReturnPromise({
                url: '/lms/salesplat/listAllMerchantName'
            })
        ]).then(res=>{
            formSelects.data('shopeeAccount_search_storeTagList','local',{arr: res[0].map(item=>({...item, value:item.name}))})
            formSelects.data('shopeeAccount_search_GP','local',{arr: res[1].map(item=>({...item, value: item, name: item}))})
        })
    }

    initShopeeWarehouseSelect('shopee_account_shippingWarehouseId')
    //导入授权信息
    upload.render({
        elem: '#shopee_importAuthInfo', //绑定元素
        url: `${ctx}/salesplat/importShopeeAuthInfo`, //上传接口
        accept: 'file', //允许上传的文件类型
        exts: 'xlsx',
        before: function () {
            loading.show()
          },
        done: function(res) {
            loading.hide()
            if(res.code=='0000'){
                layer.msg(res.msg || '操作成功',{icon:1})
            }else{
                if (Array.isArray(res.data)) {
                    const failArr = res.data.filter(item=>item.operationCode===0)
                    shopeeAccount_exportResult(failArr, res.msg || '操作失败')
                }else{
                    layer.msg(res.msg || '操作失败', {icon: 2})
                }
            }
        },
        error: function() {
            loading.hide()
            layer.msg('服务器出现故障!');
        }
    });
    // 导入修改店铺
    upload.render({
        elem: '#shopee_importEditStore', //绑定元素
        url: `${ctx}/salesplat/batchImportUpdateStore.html`, //上传接口
        accept: 'file', //允许上传的文件类型
        exts: 'xlsx',
        before: function () {
            loading.show()
          },
        done: function(res) {
            loading.hide()
            if(res.code=='0000'){
                layer.msg(res.msg || '操作成功',{icon:1})
            }else{
                if (Array.isArray(res.data)) {
                    const failArr = res.data.filter(item=>item.operationCode===0)
                    shopeeAccount_exportResult(failArr, res.msg || '操作失败')
                }else{
                    layer.msg(res.msg || '操作失败', {icon: 2})
                }
            }
        },
        error: function() {
            loading.hide()
            layer.msg('服务器出现故障!');
        }
    })
    // 新版预售逻辑配置导入
    upload.render({
        elem: '#shopee_importNewPresaleConfig', //绑定元素
        url: `/lms/shopee/shop/modifyConfigByExcel`, //上传接口
        accept: 'file', //允许上传的文件类型
        exts: 'xlsx',
        before: function () {
            loading.show()
            },
        done: function(res) {
            loading.hide()
            if(res.code=='0000'){
                if (Array.isArray(res.data)) {
                    const failArr = res.data.filter(item=>!item.success).map(v=>({...v,operationResult:v.msg}))
                    if(failArr.length){
                        shopeeAccount_exportResult(failArr, res.msg || '操作失败')
                    }else{
                        layer.msg(res.msg || '操作成功',{icon:1})
                    }
                }else{
                    layer.msg(res.msg || '操作成功',{icon:1})
                }
            }else{
                layer.msg(res.msg || '操作失败', {icon: 2})
            }
        },
        error: function() {
            loading.hide()
            layer.msg('服务器出现故障!');
        }
    })
    // // 线上预售额度配置导入
    // upload.render({
    //     elem: '#shopee_importOldPresaleConfig', //绑定元素
    //     url: `/lms/shopee/shop/modifyOldConfigByExcel`, //上传接口
    //     accept: 'file', //允许上传的文件类型
    //     exts: 'xlsx',
    //     before: function () {
    //         loading.show()
    //       },
    //     done: function(res) {
    //         loading.hide()
    //         if(res.code=='0000'){
    //             if (Array.isArray(res.data)) {
    //                 const failArr = res.data.filter(item=>!item.success).map(v=>({...v,operationResult:v.msg}))
    //                 if(failArr.length){
    //                     shopeeAccount_exportResult(failArr, res.msg || '操作失败')
    //                 }else{
    //                     layer.msg(res.msg || '操作成功',{icon:1})
    //                 }
    //             }else{
    //                 layer.msg(res.msg || '操作成功',{icon:1})
    //             }
    //         }else{
    //             layer.msg(res.msg || '操作失败', {icon: 2})
    //         }
    //     },
    //     error: function() {
    //         loading.hide()
    //         layer.msg('服务器出现故障!');
    //     }
    // })

    function shopeeAccount_exportResult(failArr, msg){
        failArr.length && layer.open({
            title:'操作失败结果',
            area:['800px','800px'],
            btn:['确认','取消'],
            content:$('#shopee_acct_export_result_tpl').html(),
            success:function(){
                var tableIns = table.render({
                    elem: '#shopee_acct_export_result',
                    data: failArr,
                    cols: [
                        [
                            { field: 'storeAcct', title: '店铺名称' },
                            { field: 'operationResult', title: '报错信息' }
                        ],
                    ],
                    id: 'shopee_acct_export_resultId',
                    page: false,
                    limit: 100000,
                })
            }
        })
        !failArr.length && layer.msg(msg||'操作失败',{icon:2})
    }

    // 仅测试环境使用 渲染 复制亿品token 按钮
    function shopeeAccount_getStoreToken() {
        // 判断是否是测试环境
        const isTest = window.document.title.includes('测试')
        // 模板引擎
        const getTpl = shopee_acct_getStoreToken_tpl.innerHTML,
          view = document.getElementById('shopee_acct_getStoreToken_view')
        laytpl(getTpl).render({isTest}, function (html) {
          view.innerHTML = html
        })
    }
    shopeeAccount_getStoreToken()

    // 复制亿品token
    $('#shopee_acct_getStoreToken_btn').click(function () {
        // 仅供单选
        const { data } = table.checkStatus('shopeeAcctTable')
        if (!data.length) return layer.msg('请选择数据', { icon: 7 })
        if (data.length > 1) return layer.msg('目前仅只支持单条数据', { icon: 7 })
        const id = data.map((item) => Number(item.id)).join(',')
        const storeAcctStr = data.map((item) => item.storeAcct).join(',')
        commonReturnPromise({
          url: ctx + `/shopee/test/getTokenFromEpProdByStoreAcctId/${id}`
        }).then((res) =>
          layer.open({
            title: `${storeAcctStr}的token`,
            content: res
          })
        )
    })

    //定义一个额外的搜索参数，区分tab选项卡
    var searchType = "1";


    //初始化客服搜索项
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: { role: "shopee客服" },
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#shopeeAcctSearchForm select[name=customServicerId]").append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                    }
                    form.render('select');
                }
            }
        }
    });

    //按钮的点击事件
    $("#addShopeeInfo").click(function() {
        var index = layer.open({
            type: 1,
            title: "添加shopee账号",
            area: ["920px", "600px"],
            shadeClose: false,
            content: $("#addShopeeInfoLayer").html(),
            btn: ['保存', '关闭'],
            success: function(layero, index) {
                shopeeAcct_getSalesPersion();
                //初始化发货仓库
                initShopeeWarehouseSelect('addShopeeInfoLayer_shippingWarehouseId',{ showAll: true})
                form.render("select");
                form.render('checkbox');
            },
            yes: function(index, layero) {
                $('#addShopeeAcct').trigger("click");
                return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
            },
            end: function() {
                // $("#shopeeSalesPlatAccountAddForm")[0].reset();
                $("#shopeeSalesPlatAccountAddForm").trigger('reset');
                $("#shopeeSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                $("#shopeeSalesPlatAccountAddForm input[name='acctDetailId']").val("");
            }
        });
    });
    render_hp_orgs_users("#shopeeAcctSearchForm"); //渲染部门销售员店铺三级联动

    function shopeeAccount_tableRender(){
      let formObj = serializeObject($("#shopeeAcctSearchForm"))
      formObj.searchType = searchType
      let grossRateMin = Number(formObj.grossRateMin),grossRateMax = Number(formObj.grossRateMax);
      if(grossRateMin != '' && grossRateMax != ''&& grossRateMax<grossRateMin){
          layer.msg("毛利率右侧值需比左侧值大")
          return false;
      }
      formObj.refreshTokenExpiryTime =(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:'');
      formObj.refreshTokenSevenExpiryTime =(sessionStorage.getItem("lastJumpParam")&&!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:'');
      table.render({
        elem: "#shopeeTable",
        method: "post",
        url: ctx + "/salesplat/salesPlatAccountDtoPage.html?platCode=shopee",
        where: formObj,
        cols: [
            [
                //标题栏
                { type: "checkbox",width:30 },
                {
                    field: "storeAcct",
                    title: "店铺名称",
                    templet: d=>{
                        let tagDoms = ''
                        if(d.storeTagList && d.storeTagList.length){
                            tagDoms = d.storeTagList.map(item=>`<span class="hp-badge layui-bg-blue" style="width:auto;overflow:hidden;padding:0 5px!important;">${item}</span>`).join('')
                        }
                        return `<div>${d.storeAcct}<br>${d.siteId}<br>${tagDoms}</div>`
                    }
                },
                // {
                //     field: "allrootAliasName",
                //     title: "普源别名",
                // },
                { 
                    field: "merchant", 
                    title: "GP<span class='ml5' lay-tips='店铺所属营业执照'><i class='layui-icon'>&#xe60b;</i><span>", 
                    templet: "<div>{{d.merchantName||''}}</br>{{d.merchantId||''}}</div>" 
                }, 
                {
                    field: "shopIsMall",
                    title: "mall店铺",
                    width: 65,
                    templet: '#shopeeAcct_mall_store'
                },
                { field: "shippingWarehouseName", title: "发货仓库" },
                { field: "brand", title: "品牌", },
                {
                    field: "grossRate",
                    title: "毛利率",
                    width: 65,
                    templet: "<div>{{d.grossRate == undefined ? '' : d.grossRate}}</div>",
                },
                {field:'personInfo',title:'人员信息', templet: '<div>销售:{{d.salesperson}}<br>客服:{{d.customServicer}}<br>组长:{{d.leaderName||""}}<br>主管:{{d.sellLeaderName}}</div>'},
                { field: "status", title: "店铺状态", templet: '#shopeeAcctStatusTpl', width: 65 },
                { field: "authTime", title: "授权到期日期", templet: '<div>店铺:{{d.authTime||""}}<br>chat:{{Format(d.chatAuthExpiredTime,"yyyy-MM-dd hh:mm:ss")}}</div>',},
                // { field: "orderDownloadStatus", title: "订单下载", templet: "#orderDownloadStatusTemplet", width: 90 },
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
                    预售额度：{{d.shopeePreOrderItemLimit ? d.shopeePreOrderItemLimit : '-' }}
                    <br>
                    预售已使用：{{d.shopeePreOrderItemNum ? d.shopeePreOrderItemNum : '-' }}
                    <br>
                    预售占比：{{d.shopeePreOrderItemRatio ? d.shopeePreOrderItemRatio : '-' }}
                </div>
            `
                },
                {
                    field: "shopeePreOrderConfigStatus",
                    title: "预售",
                    width: 65,
                    templet: '#shopeeAcct_presale_tpl'
                },
                {
                    field: "autoPublishCateIds",
                    title: "自动删除",
                    width: 65,
                    templet: '#shopee_autoHandle'
                },
                {
                    field: "autoUploadVideo",
                    title: "自动上传视频",
                    width: 65,
                    templet: '#shopee_autoUploadVideo_td'
                },
                {
                    field: "sexyImgFilter",
                    title: "性感图片过滤",
                    width: 65,
                    templet:  '<div><a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="sexyImgFilterSet">设置</a></div>'
                },
                {
                    field: "syncStatus",
                    title: "同步lisiting状态",
                    templet: "#shopeeSyncStatus"
                },
                {
                    field: "syncDesc",
                    title: "同步异常备注",
                    width:'15%'
                },
                {
                    field: "remark",
                    title: "备注"
                },
                //绑定工具条
                { title: '操作', width: 90, align: 'center', toolbar: '#shopeeTableBar' }
            ],
        ],
        done: function(res, curr, count) {
            sessionStorage.clear("lastJumpParam");
            if(res.code == '0000'){
                $("#shopeeAccount_colLen").text(res.extra.mainTab);
                $("#shopee_acct_domain_overdue_number").text(res.extra.sevenTab);
            }else{
                $("#shopeeAccount_colLen").text(0);
                $("#shopee_acct_domain_overdue_number").text(0);
            }

            theadHandle().fixTh({ id: '#shopeeaccountCard' })
        },
        id: 'shopeeAcctTable',
        page: true, //是否显示分页
        limits: [300, 500, 1000],
        limit: 500, //每页默认显示的数量
      });
    }


    element.on('tab(shopee_acct_tab_filter)', function(data) {
        searchType = $(this).attr("lay-id");
        // active.reload();
        $('#shopeeSearch').trigger('click');
    });

    $('#shopeeSearch').click(function() {
        // var type = $(this).data('type');
        // active[type] ? active[type].call(this) : '';
        shopeeAccount_tableRender();
    });

    //导出所有信息
    // $("#shopee_exportAllInfo").click(function () {
    //
    // });

    // 设置预售上限
    $('#shopee_set_preSale_limit').click(function(){
        layer.open({
            type: 1,
            title: "设置预售占比上限",
            area: ['600px', '720px'],
            shadeClose: false,
            content: $("#shopee_set_preSale_limit_layer").html(),
            btn: ['保存',"关闭"],
            success: function(layero, index) {
                commonReturnPromise({
                    url: "/lms/shopee/preOrderPercentageConfig/getConfigs",
                    type: 'post'
                }).then(res=>{
                    const tableData = (res || []).map(v=>({ ...v, preOrderPercentage: v.preOrderPercentage * 100 }))
                    table.render({
                        elem: "#shopee_set_preSale_limit_table",
                        data: tableData,
                        cols: [
                            [
                                { field: "salesSite", title: "站点", width:200},
                                {
                                    field: "preOrderPercentage",
                                    title: "预售占比上限（预售商品数≤该比例）",
                                    templet:'<div class="disflex"><input value="{{d.preOrderPercentage}}" placeholder="请输入正数" onblur="commonBlurNumberSetting(event,{min:0,precision:10})" data-id="{{d.id}}" data-salessite="{{d.salesSite}}" name="preOrderPercentage" class="layui-input w200" style="display:inline-block" /><span class="ml10">%</span></div>'},
                            ],
                        ],
                        id: "shopee_set_preSale_limit_tableId",
                        page: false,
                        limit: 100000,
                    })
                })
            },
            yes: function(index, layero) {
                let params = []
                $(layero).find('input[name=preOrderPercentage]').each(function(){
                    params.push({
                        id: $(this).data('id'),
                        salesSite: $(this).data('salessite'),
                        preOrderPercentage: $(this).val(),
                    })
                })
                if(params.some(v=>!v.preOrderPercentage)){
                    return layer.msg('请将预售占比上限填写完整')
                }
                if(params.some(v=> v.preOrderPercentage==0)){
                    return layer.msg('预售占比上限仅支持正数，请重新填写')
                }
                params.forEach(v=>{
                    v.preOrderPercentage = v.preOrderPercentage / 100
                })
                commonReturnPromise({
                    url: '/lms/shopee/preOrderPercentageConfig/editConfigs',
                    contentType: 'application/json',
                    type: 'post',
                    params: JSON.stringify(params)
                }).then(res=>{
                    layer.msg(res||'操作成功', {icon: 1})
                    layer.close(index)
                })
            },
        })
    })

    //
    $('#shopee_getstoreAddrInfo').click(function(){
        loading.show()
        transBlob({
            url:'/lms/shopee/logistic/downloadLogisticShopAddressInfo',
            fileName: "shopee店铺地址报表"+ Format(new Date().getTime(),'yyyy年MM月dd日') +".xlsx",
        }, 'get').then(function () {
            loading.hide();
            layer.alert("导出成功",{icon:1})
        }).catch(function (err) {
            loading.hide();
            layer.msg(err, {icon: 2});
        });
    })

    // chat 授权
    $('#shopee_getAuthUrl').click(function(){
        var index = layer.open({
            type: 1,
            title: "chat授权",
            area: ['800px', '300px'],
            shadeClose: false,
            content: $("#shopeeAuthLayer").html(),
            btn: ["关闭"],
            success: function(layero, index) {
                commonReturnPromise({
                    url:window.location.origin + '/chat/shopee/auth/getAuthUrl'
                }).then(res => {
                    $('#shopeeAuthForm #authUrl').val(res);
                }).catch(err => {
                    layer.msg(err.message, { icon: 2 });
                })
            }
        });
    })


    // 广告账户 授权
    $('#shopee_getAdsAuthUrl').click(function(){
        var index = layer.open({
            type: 1,
            title: "广告账户授权",
            area: ['800px', '300px'],
            shadeClose: false,
            content: $("#shopeeAuthLayer").html(),
            btn: ["关闭"],
            success: function(layero, index) {
                commonReturnPromise({
                    url:window.location.origin + '/lms/shopee/shopeeAuth/getAdsAuthUrl'
                }).then(res => {
                    $('#shopeeAuthForm #authUrl').val(res);
                }).catch(err => {
                    layer.msg(err.message, { icon: 2 });
                })
            }
        });
    })

    //同步lisiting
    $("#shopee_syncShopeeListing").click(function() {
        var checkStatus = table.checkStatus('shopeeAcctTable'); //获取选择的店铺
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
            var platCode = "shopee";
            var showListingPrecent = platCode + "ShowListingPrecent"; //显示进度条百分比的元素
            var showListingContent = platCode + "ShowListingContent"; //显示进度内容
            var showListingErrorMsg = platCode + "ShowListingErrorMsg"; //显示错误的店铺
            var batchNo = new Date().getTime(); //本次同步任务流水号
            /**提交同步任务**/
            $.ajax({
                    url: ctx + '/shopee/syncItem/batchSyncPlatListing.html',
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
    form.on('submit(addShopeeAcct)', function(data) {
        //设置销售人员名称
        data.field["salesperson"] = $("#shopeeSalesPlatAccountAddForm select[name=salespersonId] option:selected").text();
        data.field["customServicer"] = $("#shopeeSalesPlatAccountAddForm select[name=customServicerId] option:selected").text();
        data.field["sellLeaderId"] = $("#shopeeSalesPlatAccountAddForm select[name=sellLeaderId]").val();
        data.field["sellLeaderName"] = $("#shopeeSalesPlatAccountAddForm select[name=sellLeaderId] option:selected").text();
        // data.field["stopToPublish"] = $("#shopeeSalesPlatAccountAddForm select[name=stopToPublish]").val();
        data.field["leaderId"] = $("#shopeeSalesPlatAccountAddForm select[name=leaderId]").val();
        data.field["leaderName"] = $("#shopeeSalesPlatAccountAddForm select[name=leaderId] option:selected").text();

        if (data.field["customServicerId"] == null || data.field["customServicerId"] == "") {
            data.field["customServicer"] = "";
            data.field["customServicerId"] = "-1";
        }
        if (data.field["leaderId"] == null || data.field["leaderId"] == "") {
            data.field["leaderName"] = "";
            data.field["leaderId"] = "-1";
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
                    layer.msg('操作成功', { icon: 1 });
                    // table.reload('shopeeAcctTable');
                    // 更新仓库列表
                    const selectId = $('#shopeeAcctSearchForm').find('select[name=shippingWarehouseId]').val()
                    initShopeeWarehouseSelect('shopee_account_shippingWarehouseId',{selected: selectId})
                    $("#shopeeSearch").click()
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

    form.on('submit(delShopeeAcct)', function(data) {
        shopeeAcct_deleteSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    form.on('submit(reuseShopeeAcct)', function(data) {
        shopeeAcct_openSalesPlatAccount(data.field['acctBaseId']);
        return false;
    });

    //根据店铺id获取到shopee的促销活动信息
    function getShopeePromotionByAcctIdFn(id) {
        return commonReturnPromise({
            url: '/lms/salesplat/getShopeePromotionByAcctId.html?storeAcctId=' + id
        });
    }

    //根据店铺id获取到shopee的捆绑销售活动信息
    function getShopeeBundleDealByAcctIdFn(id) {
        return commonReturnPromise({
            url: `/lms/salesplat/getShopeeBundleDealByStoreAcctId.html/${id}`
        });
    }


    //根据id获取到shopee的平台物流方式
    function getShopeeLogisticsIdStrById(id) {
        return commonReturnPromise({
            url: `/lms/salesplat/getShopeeLogisticListByStoreAcctId/${id}`,
        });
    }

    function watchIfPromotionIds(layero) {
        var $nextDom = layero.find('.ifPromotionIdsIsTrue');
        form.on('select(ifPromotionIds)', function(obj) {
            if (obj.value == 'true') { //自动设置
                $nextDom.addClass('disNIm');
            } else { //手动设置
                $nextDom.removeClass('disNIm');
            }
            formSelects.value('shopeeAccount_promotionIds', []);
        });
        var $ifPromotionIdsDom = layero.find('[lay-filter=ifPromotionIds]');
        form.on('select(ifPromotionFilter)', function(obj) {
            if (obj.value == 'true') { //设置折扣促销
                $ifPromotionIdsDom.parents('.shopeeStyle').removeClass('disNIm');
            } else { //不设置折扣促销
                $ifPromotionIdsDom.next().find('dd[lay-value="true"]').trigger('click');
                $ifPromotionIdsDom.parents('.shopeeStyle').addClass('disNIm');
            }
            formSelects.value('shopeeAccount_promotionIds', []);
        });
    }

    function watchIfbundleDealIds(layero) {
        var $nextDom = layero.find('.ifBundleDealIdsIsTrue');
        form.on('select(ifBundleDealIds)', function(obj) {
            if (obj.value == 'true') { //自动设置
                $nextDom.addClass('disNIm');
            } else { //手动设置
                $nextDom.removeClass('disNIm');
            }
            formSelects.value('shopeeAccount_bundleDealIds', []);
        });
        var $ifBundleDealIdsDom = layero.find('[lay-filter=ifBundleDealIds]');
        form.on('select(ifBundleDealFilter)', function(obj) {
            if (obj.value == 'true') { //设置捆绑销售促销
                $ifBundleDealIdsDom.parents('.shopeeStyle').removeClass('disNIm');
            } else { //不设置捆绑销售促销
                $ifBundleDealIdsDom.next().find('dd[lay-value="true"]').trigger('click');
                $ifBundleDealIdsDom.parents('.shopeeStyle').addClass('disNIm');
            }
            formSelects.value('shopeeAccount_bundleDealIds', []);
        });
    }

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(shopeeTable)', function(obj) {
        var data = obj.data, //获得当前行数据
            //getTpl = $("#detailM").html(), //获取模板引擎的内容
            layEvent = obj.event; //获得 lay-event 对应的值

        if (layEvent === 'edit') {
            var index = layer.open({
                type: 1,
                title: "设置平台账号信息",
                area: ["920px", "600px"],
                shadeClose: false,
                content: $("#addShopeeInfoLayer").html(),
                btn: ['保存', '关闭'],
                yes: function(index, layero) {
                    var dataObj = {
                        brand: $("#shopeeSalesPlatAccountAddForm input[name='brand']").val(),
                        // imgDomain: $("#shopeeSalesPlatAccountAddForm input[name='imgDomain']").val(),
                        salespersonId: $("#shopeeSalesPlatAccountAddForm select[name='salespersonId']").val(),
                    }
                    var strRegex = "^http://";
                    var re = new RegExp(strRegex);
                    // if (!re.test(dataObj.imgDomain)) {
                    //     layer.msg("图片域名必须以http://开头");
                    //     return;
                    // }
                    var result = checkRequiredData(dataObj);
                    if (result) {
                        $('#addShopeeAcct').trigger("click");
                        return; //这里为毛要加return,我也不知道,反正就突然感觉加上有用
                    }
                },
                success: function(layero, index) {
                    shopeeAcct_getSalesPersion();
                    shopeeAcct_getSalesPlatAccountBaseAndDetailInfo(data.id);
                    form.render('select');
                    form.render('radio');
                    form.render('checkbox');
                },
                end: function() {
                    // $("#shopeeSalesPlatAccountAddForm")[0].reset();
                    $("#shopeeSalesPlatAccountAddForm").trigger('reset');
                    $("#shopeeSalesPlatAccountAddForm input[name='acctBaseId']").val("");
                    $("#shopeeSalesPlatAccountAddForm input[name='acctDetailId']").val("");

                    $("#shopeeAcctReuseDiv").addClass('layui-hide');
                    $("#shopeeAcctDelDiv").addClass('layui-hide');
                }
            });
        }
        if (layEvent === 'auth') {
            var index = layer.open({
                type: 1,
                title: "授权",
                area: ['800px', '300px'],
                shadeClose: false,
                content: $("#shopeeAuthLayer").html(),
                btn: ["关闭"],
                // yes: function(layero) {
                    // loading.show()
                    // $.ajax({
                    //     url: ctx + '/shopee/shopeeAuth/saveAuthInfo.html',
                    //     type: 'post',
                    //     dataType: 'json',
                    //     data: {
                    //         "storeAcctId": data.id,
                    //         "shopId": $('#shopeeAuthForm [name=shopId]').val()
                    //     },
                    //     success: function(response) {
                    //         loading.hide()
                    //         if (response.code == '0000') {
                    //             layer.closeAll();
                    //             layer.msg('授权成功');
                    //             // table.reload('shopeeAcctTable');
                    //             $("#shopeeSearch").click()
                    //         } else {
                    //             layer.msg(response.msg)
                    //         }
                    //     },
                    //     error: function() {
                    //         loading.hide()
                    //         layer.msg('网络繁忙')
                    //     }
                    // })
                // },
                success: function(layero, index) {
                    // var ajax = new Ajax()
                    // loading.show()
                    // ajax.post({
                    //     url: ctx + '/shopee/shopeeAuth/getAuthUrl.html',
                    //     type: 'POST',
                    //     data: {"storeAcctId": data.id},
                    //     success: function (response) {
                    //         loading.hide()
                    //         if (response.code == '0000') {
                    //             // window.open(response.data);
                    //             $('#shopeeAuthForm #authUrl').val(response.data)
                    //         } else {
                    //             layer.msg(response.msg)
                    //         }
                    //     },
                    //     error: function () {
                    //         loading.hide()
                    //         layer.msg('网络繁忙')
                    //     }
                    // })
                    commonReturnPromise({
                        url: ctx + '/shopee/shopeeAuth/getAuthUrl',
                        params: { "storeAcctId": data.id },
                    }).then(res => {
                        $('#shopeeAuthForm #authUrl').val(res);
                    }).catch(err => {
                        layer.msg(err.message, { icon: 2 });
                    })
                }
            });
        }
        //未设置
        if (layEvent == 'notSet') {
            var index = layer.open({
                type: 1,
                title: "自动删除设置",
                area: ['800px','600px'],
                shadeClose: false,
                content: $("#shopee_setedLayer").html(),
                btn: ["保存", "关闭"],
                success: function(layero, index) {
                    var getTpl = shopee_setedContainerTpl.innerHTML,
                        view = document.getElementById('shopee_setedContainer');

                    Promise.all([getShopeePromotionByAcctIdFn(data.id), getShopeeLogisticsIdStrById(data.id),getShopeeBundleDealByAcctIdFn(data.id)])
                        .then(resultArr => {
                            data.promotionData = resultArr[0]
                            data.logisticData = resultArr[1]
                            data.bundleDealData = resultArr[2]
                            // 设置默认值

                            if(data.autoDeleteItemByTort==undefined){
                                data.autoDeleteItemByTort=1
                            }
                            if(data.autoDeleteItemByProhibitSalesType==undefined){
                                data.autoDeleteItemByProhibitSalesType=90
                            }
                            if(data.autoDeleteItemByTortSalesType==undefined){
                                data.autoDeleteItemByTortSalesType=90
                            }
                            if(data.autoDeleteItemByProhibitSalesLte==undefined){
                                data.autoDeleteItemByProhibitSalesLte=0
                            }
                            if(data.autoDeleteItemByTortSalesLte==undefined){
                                data.autoDeleteItemByTortSalesLte=0
                            }
                            if(data.deleteItemByTortIfHistorySalesGtZero==undefined){
                                data.deleteItemByTortIfHistorySalesGtZero=true
                            }
                            if(data.deleteItemByProhibitIfHistorySalesGtZero==undefined){
                                data.deleteItemByProhibitIfHistorySalesGtZero=false
                            }
                            console.log('data :>> ', data);
                            laytpl(getTpl).render(data, function(html) {
                                view.innerHTML = html;
                                form.render();
                                formSelects.render();
                                // initShopeeCateTree().then(function(result) {
                                //     console.log(result);
                                // });
                                // watchIfPromotionIds(layero); //促销设置选中
                                // watchIfbundleDealIds(layero)
                                // watchCateChangeCkbox(layero);
                            });
                        }).catch(function(err) {
                            layer.msg(err, { icon: 2 });
                        })
                },
                yes: function(index, layero) {
                    // var chkedNodeId = shopeeCateTree.getCheckedNodes(true);
                    // //选中节点
                    // var cateIsShow = layero.find("[name=cateChange]:checked").val();
                    // var autoPublishCateIds;
                    // if (cateIsShow == 'all') {
                    //     autoPublishCateIds = 0;
                    // } else {
                    //     autoPublishCateIds = chkedNodeId.map(function(item) {
                    //         return item.id;
                    //     }).join();
                    // }
                    //自动删除
                    var autoDelete = layero.find('[name=autoDelete]:checked').val();
                    var autoDeleteNum = layero.find('[name=autoDeleteNum]').val();
                    var autoDeleteSalesType = layero.find('select[name=autoDeleteSalesType] option:selected').val().trim();
                    var historySalesType = layero.find('select[name=historySalesType] option:selected').val().trim();
                    //自动刊登
                    // var autoPublish = layero.find('[name=autoPublish]:checked').val();
                    // var autoPublishNum = layero.find('[name=autoPublishNum]').val();
                    // //刊登时间
                    // var autoListingTime = layero.find('[name=autoListingTime]').val();
                    // //刊登间隔
                    // var autoListingIntervalTime = layero.find('[name=autoListingIntervalTime]').val();
                    // //折扣促销
                    // var ifPromotion = layero.find('[name=ifPromotion]').val();
                    // //促销设置: 手动/自动
                    // var promotionIds; //促销参数
                    // var ifPromotionIds = layero.find('[name=ifPromotionIds]').val();
                    // var $promotionIds = layero.find('[name=promotionIds]'); //促销活动
                    // //捆绑销售促销
                    // var ifBundleDeal = layero.find('[name=ifBundleDeal]').val();
                    // //捆绑销售设置: 手动/自动
                    // var bundleDealIds; //捆绑销售参数
                    // var ifBundleDealIds = layero.find('[name=ifBundleDealIds]').val();
                    // var $bundleDealIds = layero.find('[name=bundleDealIds]'); //捆绑销售活动
                    // //刊登时间2
                    var autoDeleteGreatListingTime = layero.find('[name=autoDeleteGreatListingTime]:checked').val();
                    if (!autoDeleteGreatListingTime) {
                        return layer.msg('请选择刊登时间');
                    }

                    var autoDeleteViewLt = layero.find('input[name=autoDeleteViewLt]').val()
                    if(autoDeleteViewLt==='0' || Number(autoDeleteViewLt)<0) return layer.msg('请输入大于0的整数的listing浏览量');
                    var autoDeleteLikeLt = layero.find('input[name=autoDeleteLikeLt]').val()
                    if(autoDeleteLikeLt==='0' || Number(autoDeleteLikeLt)<0) return layer.msg('请输入大于0的整数的listing收藏量');
                    //
                    const autoDeleteItemByTort =layero.find('[name=autoDeleteItemByTort]:checked').val()
                    if(autoDeleteItemByTort==undefined) return layer.msg('请选择是否开启侵权删除');
                    const autoDeleteItemByProhibit=layero.find('[name=autoDeleteItemByProhibit]:checked').val()
                    if(autoDeleteItemByProhibit==undefined) return layer.msg('请选择是否开启禁售删除');
                    const autoDeleteItemByTortSalesType=layero.find('[name=autoDeleteItemByTortSalesType]').val()
                    const autoDeleteItemByTortSalesLte=layero.find('[name=autoDeleteItemByTortSalesLte]').val()
                    const deleteItemByTortIfHistorySalesGtZero=layero.find('[name=deleteItemByTortIfHistorySalesGtZero]').val()
                    // 校验侵权相关的
                    if(autoDeleteItemByTort == 1){
                        if(!autoDeleteItemByTortSalesType) return layer.msg('请将侵权删除的销量校验填写完整');
                        if(!autoDeleteItemByTortSalesLte) return layer.msg('请将侵权删除的销量校验填写完整');
                        if(!deleteItemByTortIfHistorySalesGtZero) return layer.msg('请将侵权删除的销量校验填写完整');
                    }
                    const autoDeleteItemByProhibitSalesType=layero.find('[name=autoDeleteItemByProhibitSalesType]').val()
                    const autoDeleteItemByProhibitSalesLte=layero.find('[name=autoDeleteItemByProhibitSalesLte]').val()
                    const deleteItemByProhibitIfHistorySalesGtZero=layero.find('[name=deleteItemByProhibitIfHistorySalesGtZero]').val()
                    // 校验侵权相关的
                    if(autoDeleteItemByProhibit == 1){
                        if(!autoDeleteItemByProhibitSalesType) return layer.msg('请将禁售删除的销量校验填写完整');
                        if(!autoDeleteItemByProhibitSalesLte) return layer.msg('请将禁售删除的销量校验填写完整');
                        if(!deleteItemByProhibitIfHistorySalesGtZero) return layer.msg('请将禁售删除的销量校验填写完整');
                    }
                    // if (ifPromotionIds == true) { //自动刊登
                    //     promotionIds = '';
                    // } else { //手动刊登
                    //     promotionIds = $promotionIds.val();
                    // }
                    // if (ifBundleDealIds == true) { //自动刊登
                    //     bundleDealIds = '';
                    // } else { //手动刊登
                    //     bundleDealIds = $bundleDealIds.val();
                    // }
                    // // 物流方式
                    // var logisticsIdStr = layero.find('[name=logisticsIdStr]').val()
                    //     //判断条件
                    // if (autoDelete == 'true') {
                    //     if (!autoDeleteNum) {
                    //         return layer.msg('请输入自动删除数量!', { icon: 2 });
                    //     }
                    // }
                    // if (autoPublish == 'true') {
                    //     if (!autoPublishNum) {
                    //         return layer.msg('请输入自动刊登数量!', { icon: 2 });
                    //     }
                    //     if (autoListingTime == '') {
                    //         return layer.msg('刊登时间必填', { icon: 2 });
                    //     }
                    //     if (!autoListingIntervalTime) {
                    //         return layer.msg('时间间隔必填', { icon: 2 });
                    //     }
                    //     // if (cateIsShow != 'all') {
                    //     //     if (!autoPublishCateIds) {
                    //     //         return layer.msg('请选择自动刊登的类目!', { icon: 2 });
                    //     //     }
                    //     // }
                    //     var minutesNum = Number(autoPublishNum) * Number(autoListingIntervalTime);
                    //     if (minutesNum > 1320) {
                    //         return layer.msg('刊登数量*间隔时间需要小于22小时', { icon: 2 });
                    //     }
                    // }
                    // if(cateIsShow != 'all'){
                    //     if (autoPublishCateIds && autoPublishCateIds !=0) {
                    //         if (autoPublish == 'false') {
                    //             return layer.msg('请开启自动刊登功能!', {icon: 2});
                    //         }
                    //         if (!autoPublishNum) {
                    //             return layer.msg('请输入自动刊登数量!', {icon: 2});
                    //         }
                    //     }
                    // }
                    // if ($promotionIds.val().split(',').length > 5) {
                    //     return layer.msg('促销活动最多选中5个!', { icon: 7 });
                    // }
                    // if ($bundleDealIds.val().split(',').length > 5) {
                    //     return layer.msg('捆绑销售活动最多选中5个!', { icon: 7 });
                    // }
                    var obj = {
                        platCode: 'shopee',
                        storeAcctIdStr: data.id,
                        // autoPublishCateIds: autoPublishCateIds,
                        autoDelete: autoDelete,
                        autoDeleteNum: Number(autoDeleteNum),
                        autoDeleteSalesType: autoDeleteSalesType,
                        historySalesType: historySalesType,
                        // autoPublish: autoPublish,
                        // autoPublishType: 2,
                        // autoPublishNum: Number(autoPublishNum),
                        // autoListingTime: Number(autoListingTime), //刊登时间
                        // autoListingIntervalTime: Number(autoListingIntervalTime), //刊登间隔
                        // ifPromotion: ifPromotion, //是否促销
                        // promotionIds: promotionIds,
                        // ifBundleDeal: ifBundleDeal, //是否捆绑销售
                        // bundleDealIds: bundleDealIds,
                        // logisticsIdStr: logisticsIdStr,
                        autoDeleteGreatListingTime: autoDeleteGreatListingTime,
                        autoDeleteViewLt,
                        autoDeleteLikeLt,
                        autoDeleteItemByTort,
                        autoDeleteItemByTortSalesType,
                        autoDeleteItemByTortSalesLte,
                        deleteItemByTortIfHistorySalesGtZero,
                        autoDeleteItemByProhibit,
                        autoDeleteItemByProhibitSalesType,
                        autoDeleteItemByProhibitSalesLte,
                        deleteItemByProhibitIfHistorySalesGtZero
                    };
                    shopeeAutoAjax(obj).then(function(result) {
                        layer.close(index);
                        layer.msg(result || '设置自动删除成功!', { icon: 1 });
                        $('#shopeeSearch').trigger('click'); //重新搜索
                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    })
                }
            });
        }
        if (layEvent === 'autoDelSet') { //设置
            var index = layer.open({
                type: 1,
                title: "自动删除设置",
                area: ['800px','600px'],
                shadeClose: false,
                content: $("#shopee_setedLayer").html(),
                btn: ["保存", "关闭"],
                success: function(layero, index) {
                    var getTpl = shopee_setedContainerTpl.innerHTML,
                        view = document.getElementById('shopee_setedContainer');
                    Promise.all([getShopeePromotionByAcctIdFn(data.id), getShopeeLogisticsIdStrById(data.id), getShopeeBundleDealByAcctIdFn(data.id)])
                        .then(resultArr => {
                            data.promotionData = resultArr[0]
                            data.logisticData = resultArr[1]
                            data.bundleDealData = resultArr[2]
                             // 设置默认值
                            if(data.autoDeleteItemByProhibit==undefined){
                                data.autoDeleteItemByProhibit=1
                            }
                            if(data.autoDeleteItemByTort==undefined){
                                data.autoDeleteItemByTort=1
                            }
                            if(data.autoDeleteItemByProhibitSalesType==undefined){
                                data.autoDeleteItemByProhibitSalesType=90
                            }
                            if(data.autoDeleteItemByTortSalesType==undefined){
                                data.autoDeleteItemByTortSalesType=90
                            }
                            if(data.autoDeleteItemByProhibitSalesLte==undefined){
                                data.autoDeleteItemByProhibitSalesLte=0
                            }
                            if(data.autoDeleteItemByTortSalesLte==undefined){
                                data.autoDeleteItemByTortSalesLte=0
                            }
                            if(data.deleteItemByTortIfHistorySalesGtZero==undefined){
                                data.deleteItemByTortIfHistorySalesGtZero=true
                            }
                            if(data.deleteItemByProhibitIfHistorySalesGtZero==undefined){
                                data.deleteItemByProhibitIfHistorySalesGtZero=false
                            }
                            laytpl(getTpl).render(data, function(html) {
                                view.innerHTML = html;
                                form.render();
                                formSelects.render();
                                //回显tree
                                // initShopeeCateTree().then(function(result) {
                                //     var prodCateIds = data.autoPublishCateIds.split(",");
                                //     for (var i = 0; i < prodCateIds.length; i++) {
                                //         var node = shopeeCateTree.getNodeByParam("id", prodCateIds[i]);
                                //         if (node != null) {
                                //             shopeeCateTree.checkNode(node, true, false, true);
                                //         }
                                //     }
                                // }).catch(function(treeError) {
                                //     layer.msg('类目加载错误', { icon: 7 });
                                // });
                                // watchIfPromotionIds(layero); //促销设置选中
                                // watchIfbundleDealIds(layero)
                                // watchCateChangeCkbox(layero);
                            });
                        }).catch(function(err) {
                            layer.msg(err, { icon: 2 });
                        })
                },
                yes: function(index, layero) {
                    // var chkedNodeId = shopeeCateTree.getCheckedNodes(true);
                    // //选中节点
                    // var cateIsShow = layero.find("[name=cateChange]:checked").val();
                    // var autoPublishCateIds;
                    // if (cateIsShow === 'all') {
                    //     autoPublishCateIds = 0;
                    // } else {
                    //     autoPublishCateIds = chkedNodeId.map(function(item) {
                    //         return item.id;
                    //     }).join();
                    // }
                    //自动删除
                    var autoDelete = layero.find('[name=autoDelete]:checked').val();
                    var autoDeleteNum = layero.find('[name=autoDeleteNum]').val();
                    var autoDeleteSalesType = layero.find('select[name=autoDeleteSalesType] option:selected').val().trim();
                    var historySalesType = layero.find('select[name=historySalesType] option:selected').val().trim();
                    //自动刊登
                    // var autoPublish = layero.find('[name=autoPublish]:checked').val();
                    // var autoPublishNum = layero.find('[name=autoPublishNum]').val();
                    //刊登时间
                    // var autoListingTime = layero.find('[name=autoListingTime]').val();
                    //刊登间隔
                    // var autoListingIntervalTime = layero.find('[name=autoListingIntervalTime]').val();
                    // //是否促销
                    // var ifPromotion = layero.find('[name=ifPromotion]').val();
                    // //促销设置: 手动/自动
                    // var promotionIds; //促销参数
                    // var ifPromotionIds = layero.find('[name=ifPromotionIds]').val();
                    // var $promotionIds = layero.find('[name=promotionIds]'); //促销活动
                    // // 是否捆绑销售
                    // var ifBundleDeal = layero.find('[name=ifBundleDeal]').val();
                    // //捆绑销售设置: 手动/自动
                    // var bundleDealIds; //捆绑销售参数
                    // var ifBundleDealIds = layero.find('[name=ifBundleDealIds]').val();
                    // var $bundleDealIds = layero.find('[name=bundleDealIds]'); //捆绑销售活动
                    // //刊登时间2
                    var autoDeleteGreatListingTime = layero.find('[name=autoDeleteGreatListingTime]:checked').val();
                    if (!autoDeleteGreatListingTime) {
                        return layer.msg('请选择刊登时间');
                    }

                    var autoDeleteViewLt = layero.find('input[name=autoDeleteViewLt]').val()
                    if(autoDeleteViewLt==='0' || Number(autoDeleteViewLt)<0) return layer.msg('请输入大于0的整数的listing浏览量');
                    var autoDeleteLikeLt = layero.find('input[name=autoDeleteLikeLt]').val()
                    if(autoDeleteLikeLt==='0' || Number(autoDeleteLikeLt)<0) return layer.msg('请输入大于0的整数的listing收藏量');
                    //
                    const autoDeleteItemByTort =layero.find('[name=autoDeleteItemByTort]:checked').val()
                    if(autoDeleteItemByTort==undefined) return layer.msg('请选择是否开启侵权删除');
                    const autoDeleteItemByTortSalesType=layero.find('[name=autoDeleteItemByTortSalesType]').val()
                    const autoDeleteItemByTortSalesLte=layero.find('[name=autoDeleteItemByTortSalesLte]').val()
                    const deleteItemByTortIfHistorySalesGtZero=layero.find('[name=deleteItemByTortIfHistorySalesGtZero]').val()
                    // 校验侵权相关的
                    if(autoDeleteItemByTort==1){
                        if(!autoDeleteItemByTortSalesType) return layer.msg('请将侵权删除的销量校验填写完整');
                        if(!autoDeleteItemByTortSalesLte) return layer.msg('请将侵权删除的销量校验填写完整');
                        if(!deleteItemByTortIfHistorySalesGtZero) return layer.msg('请将侵权删除的销量校验填写完整');
                    }
                    if(autoDeleteItemByTortSalesLte){
                        if(autoDeleteItemByTortSalesLte<0 ||autoDeleteItemByTortSalesLte>20) return layer.msg('请将侵权删除的销量设置为0到20之间的整数');
                    }
                    const autoDeleteItemByProhibit=layero.find('[name=autoDeleteItemByProhibit]:checked').val()
                    if(autoDeleteItemByProhibit==undefined) return layer.msg('请选择是否开启禁售删除');
                    const autoDeleteItemByProhibitSalesType=layero.find('[name=autoDeleteItemByProhibitSalesType]').val()
                    const autoDeleteItemByProhibitSalesLte=layero.find('[name=autoDeleteItemByProhibitSalesLte]').val()
                    const deleteItemByProhibitIfHistorySalesGtZero=layero.find('[name=deleteItemByProhibitIfHistorySalesGtZero]').val()
                    // 校验侵权相关的
                    if(autoDeleteItemByProhibit==1){
                        if(!autoDeleteItemByProhibitSalesType) return layer.msg('请将禁售删除的销量校验填写完整');
                        if(!autoDeleteItemByProhibitSalesLte) return layer.msg('请将禁售删除的销量校验填写完整');
                        if(!deleteItemByProhibitIfHistorySalesGtZero) return layer.msg('请将禁售删除的销量校验填写完整');
                    }
                    if(autoDeleteItemByProhibitSalesLte){
                        if(autoDeleteItemByProhibitSalesLte<0 ||autoDeleteItemByProhibitSalesLte>20) return layer.msg('请将禁售删除的销量设置为0到20之间的整数');
                    }
                    // if (ifPromotionIds == 'true') { //自动刊登
                    //     promotionIds = '';
                    // } else { //手动刊登
                    //     promotionIds = $promotionIds.val();
                    // }
                    // if (ifBundleDealIds == true) { //自动刊登
                    //     bundleDealIds = '';
                    // } else { //手动刊登
                    //     bundleDealIds = $bundleDealIds.val();
                    // }
                    // // 物流方式
                    // var logisticsIdStr = layero.find('[name=logisticsIdStr]').val()
                    //     //判断条件
                    // if (autoDelete == 'true') {
                    //     if (!autoDeleteNum) {
                    //         return layer.msg('请输入自动删除数量!', { icon: 2 });
                    //     }
                    // }
                    // if (autoPublish == 'true') {
                    //     if (!autoPublishNum) {
                    //         return layer.msg('请输入自动刊登数量!', { icon: 2 });
                    //     }
                    //     if (autoListingTime == '') {
                    //         return layer.msg('刊登时间必填', { icon: 2 });
                    //     }
                    //     if (!autoListingIntervalTime) {
                    //         return layer.msg('时间间隔必填', { icon: 2 });
                    //     }
                    //     if (cateIsShow != 'all') {
                    //         if (!autoPublishCateIds) {
                    //             return layer.msg('请选择自动刊登的类目!', { icon: 2 });
                    //         }
                    //     }
                    //     var minutesNum = Number(autoPublishNum) * Number(autoListingIntervalTime);
                    //     if (minutesNum > 1320) {
                    //         return layer.msg('刊登数量*间隔时间需要小于22小时', { icon: 2 });
                    //     }
                    // }
                    // if(cateIsShow != 'all'){
                    //     if (autoPublishCateIds && autoPublishCateIds !=0) {
                    //         if (autoPublish == 'false') {
                    //             return layer.msg('请开启自动刊登功能!', {icon: 2});
                    //         }
                    //         if (!autoPublishNum) {
                    //             return layer.msg('请输入自动刊登数量!', {icon: 2});
                    //         }
                    //     }
                    // }
                    // if ($promotionIds.val().split(',').length > 5) {
                    //     return layer.msg('促销活动最多选中5个!', { icon: 7 });
                    // }
                    // if ($bundleDealIds.val().split(',').length > 5) {
                    //     return layer.msg('捆绑销售活动最多选中5个!', { icon: 7 });
                    // }
                    var obj = {
                        platCode: 'shopee',
                        storeAcctIdStr: data.id,
                        // autoPublishCateIds: autoPublishCateIds,
                        autoDelete: autoDelete,
                        autoDeleteNum: Number(autoDeleteNum),
                        // autoPublish: autoPublish,
                        // autoPublishType: 2,
                        // autoPublishNum: Number(autoPublishNum),
                        autoDeleteSalesType: autoDeleteSalesType,
                        historySalesType: historySalesType,
                        // autoListingTime: Number(autoListingTime), //刊登时间
                        // autoListingIntervalTime: Number(autoListingIntervalTime), //刊登间隔
                        // ifPromotion: ifPromotion, //是否促销
                        // promotionIds: promotionIds,
                        // ifBundleDeal: ifBundleDeal, //是否捆绑销售
                        // bundleDealIds: bundleDealIds,
                        // logisticsIdStr: logisticsIdStr,
                        autoDeleteGreatListingTime: autoDeleteGreatListingTime,
                        autoDeleteViewLt:autoDeleteViewLt||0,  // 没填写数据传0
                        autoDeleteLikeLt:autoDeleteLikeLt||0, // 没填写数据传0
                        autoDeleteItemByTort,
                        autoDeleteItemByTortSalesType,
                        autoDeleteItemByTortSalesLte,
                        deleteItemByTortIfHistorySalesGtZero,
                        autoDeleteItemByProhibit,
                        autoDeleteItemByProhibitSalesType,
                        autoDeleteItemByProhibitSalesLte,
                        deleteItemByProhibitIfHistorySalesGtZero
                    };
                    shopeeAutoAjax(obj).then(function(result) {
                        layer.close(index);
                        layer.msg(result || '设置自动删除成功!', { icon: 1 });
                        $('#shopeeSearch').trigger('click'); //重新搜索
                    }).catch(function(err) {
                        layer.msg(err, { icon: 2 });
                    })
                }
            });
        }
        if(layEvent === 'setPreSale'){
            shopeeAcct_setPreSale(data)
        }
        if(layEvent === 'autoUploadVideoSet'){
            shopeeAcct_autoUploadVideoSet(data)
        }
        if(layEvent === 'storeTagList'){  // 店铺标签
            shopeeAcct_storeTagSet({isBatch: false,idArr: [data.id]})
        }
        if(layEvent == 'checkAccessToken'){
          ztt_storeCommonCheckAuthFn(data.id, data.platCode);
        }
        if(layEvent == 'sexyImgFilterSet'){
            shopeeAcct_sexyImgFilterSet(data)
        }
        if(layEvent == 'setMallStore'){
            shopeeAccount_setMallStore(data)
        }
        if(layEvent == 'syncShopeeDiscount'){
            commonReturnPromise({
                url: '/lms/shopee/syncItem/getShopeeDiscount.html',
                type: 'post',
                contentType: 'application/json',
                params: JSON.stringify([data.id])
            }).then((res)=>{
                layer.msg(res || '操作成功', {icon: 1})
            })
        }
    });

    // 预售设置
    function shopeeAcct_setPreSale(obj={}){
        let isAdd = true
        let id = ''
        let popIndex = layer.open({
            type: 1,
            title: "预售设置",
            area: ['820px', '400px'],
            content: $("#shopee_acct_set_presale_tpl").html(),
            btn: ["保存", "关闭"],
            success: function(layero, index) {
                // 修改样式
                layero.find('.layui-form-label').css({'width':'110px','padding':"9px 15px 9px 0"})
                layero.find('.layui-input-block').css({'margin-left':'125px'})
                layero.find('.layui-form-item').css({'margin-bottom':'15px'})

                $('#shopee_acct_set_presale_form textarea[name=itemIdsStr]').blur(function(){
                    let curVal = $(this).val().replaceAll('，',',').split(',').map(Number).filter(item=>item)
                    $(this).val([...new Set(curVal)].join(','))
                })

                commonReturnPromise({
                    url: ctx + `/shopee/autoPreOrderConfig/one/${obj.id}`
                }).then(res=>{
                    let formDom = $('#shopee_acct_set_presale_form')
                    if(typeof res ==='object'){
                        isAdd = false
                        id = res.id
                        //赋值
                        formDom.find(`input[name=status][value=${res.status}]`).prop('checked',true)
                        res.itemIdsStr !==undefined && formDom.find('textarea[name=itemIdsStr]').val(res.itemIdsStr)
                        // res.salesType !==undefined && formDom.find('select[name=salesType]').val(res.salesType)
                        // res.salesDay !==undefined && formDom.find('input[name=salesDay]').val(res.salesDay)
                        // res.secondLeftArrivalDay !==undefined&& formDom.find('input[name=secondLeftArrivalDay]').val(res.secondLeftArrivalDay)
                        // res.secondRightArrivalDay !==undefined&& formDom.find('input[name=secondRightArrivalDay]').val(res.secondRightArrivalDay)
                        // res.thirdLeftArrivalDay !==undefined&& formDom.find('input[name=thirdLeftArrivalDay]').val(res.thirdLeftArrivalDay)
                        // res.thirdRightArrivalDay !==undefined&& formDom.find('input[name=thirdRightArrivalDay]').val(res.thirdRightArrivalDay)
                        // res.auditTimeDayLte !==undefined && formDom.find('input[name=auditTimeDayLte]').val(res.auditTimeDayLte)
                    }
                    form.render()
                })

            },
            yes:function(){
                let formObj = serializeObject($('#shopee_acct_set_presale_form'))
                let statusDom = $('#shopee_acct_set_presale_form').find('input[name=status]:checked')
                if(!statusDom.length){
                    return layer.msg('请选择预售状态')
                }
                formObj.status = Number(statusDom.val())
                // formObj.salesType = formObj.salesType==='' ? null : Number(formObj.salesType)
                // formObj.salesDay = formObj.salesDay==='' ? null : Number(formObj.salesDay)
                // formObj.secondLeftArrivalDay = formObj.secondLeftArrivalDay==='' ? null : Number(formObj.secondLeftArrivalDay)
                // formObj.secondRightArrivalDay = formObj.secondRightArrivalDay==='' ? null : Number(formObj.secondRightArrivalDay)
                // formObj.thirdLeftArrivalDay = formObj.thirdLeftArrivalDay==='' ? null : Number(formObj.thirdLeftArrivalDay)
                // formObj.thirdRightArrivalDay = formObj.thirdRightArrivalDay==='' ? null : Number(formObj.thirdRightArrivalDay)
                // formObj.auditTimeDayLte = formObj.auditTimeDayLte==='' ? null : Number(formObj.auditTimeDayLte)
                formObj.storeAcctId = obj.id
                if(!isAdd){
                    formObj.id = id
                }
                if(formObj.status === 1){
                    // if(!formObj.itemIdsStr && formObj.salesDay === null && formObj.salesType === null && formObj.auditTimeDayLte === null){
                    //     return layer.msg('如需开启预售，3个优先级条件必填1项，请重新设置')
                    // }else if(!formObj.salesType){
                    //     if(formObj.salesDay !==null){
                    //         return layer.msg('预售设置中，请选择销量')
                    //     }
                    // }else if(!!formObj.salesType){
                    //     if(formObj.salesDay ===null){
                    //         return layer.msg('预售设置中，请填写销量')
                    //     }
                    // }
                    // todo 调接口
                    shopeeAcct_preSaleAjax(isAdd, formObj,'',popIndex)
                }else if(formObj.status === 0){
                    layer.confirm('店铺预售设置取消后，除固定预售item外，其余已预售商品将在1个工作日内全部取消预售，确定继续取消预售吗？', {icon: 7, title:'提示', btn: ['确定', '关闭']}, function(index){
                        shopeeAcct_preSaleAjax(isAdd, formObj,index,popIndex)
                    });
                }else if(formObj.status === 2){
                    layer.confirm('店铺预售定时任务暂停后，该店铺将不再调整所有商品的预售状态，已预售的继续保持预售，未预售的继续不预售，确定继续暂停预售定时任务吗？', {icon: 7, title:'提示', btn: ['确定', '关闭']}, function(index){
                        shopeeAcct_preSaleAjax(isAdd, formObj,index,popIndex)
                    });
                }
            }
        })
    }

    // 预售设置  接口
    function shopeeAcct_preSaleAjax(isAdd, formObj, curLayer='',popIndex){
        // 新建
        if(isAdd){
            commonReturnPromiseRes({
                url: ctx + '/shopee/autoPreOrderConfig/new',
                type: 'post',
                contentType: 'application/json',
                params: JSON.stringify({...formObj})
            }).then(res=>{
                if(res.msg.includes('item_id')){
                    layer.alert(res.msg, { icon: 2 });
                }else{
                    layer.msg('新建成功', {icon:1})
                }
                curLayer && layer.close(curLayer)
                layer.close(popIndex)
                $("#shopeeSearch").click()
            }).catch(err=>{
                layer.alert(err, { icon: 2 });
            })
        }else{
            // 更新
            commonReturnPromiseRes({
                url: ctx + '/shopee/autoPreOrderConfig/update',
                type: 'put',
                contentType: 'application/json',
                params: JSON.stringify({...formObj})
            }).then(res=>{
                if(res.msg.includes('item_id')){
                    layer.alert(res.msg, { icon: 2 });
                }else{
                    layer.msg('保存成功', {icon:1})
                }
                if(formObj.status===0){
                   commonReturnPromise({
                        url: ctx + `/shopee/onlineProductShopee/cancelPreOrderItemByStoreAcctId/${formObj.storeAcctId}`,
                    }).then(()=>{
                        curLayer && layer.close(curLayer)
                        layer.close(popIndex)
                        $("#shopeeSearch").click()
                    })
                }else{
                    curLayer && layer.close(curLayer)
                    layer.close(popIndex)
                    $("#shopeeSearch").click()
                }
            }).catch(err=>{
                layer.alert(err,{ icon: 2})
            })
        }
    }

    // 自动上传视频设置
    function shopeeAcct_autoUploadVideoSet(obj={}){
        let originalObj = {
            storeAcctId : obj.id
        }
        let popIndex = layer.open({
            type: 1,
            title: "自动上传视频设置",
            area: ['820px', '600px'],
            content: $("#shopee_acct_set_autoUploadVideo_tpl").html(),
            btn: ["保存", "关闭"],
            success: function(layero, index) {
                layero.find('.layui-form-label').css({'width':'140px'})
                layero.find('.layui-input-block').css({'margin-left':'170px'})
                Promise.all([commonReturnPromise({
                    url: `/lms/salesplat/getStoreConfig?storeAcctId=${obj.id}`,
                }),commonReturnPromise({
                    url: '/lms/LazadaVideoMange/getVideoTags'
                })]).then(res=>{
                    if(Object.prototype.toString.call(res[0])==='[object Object]'){
                        originalObj = res[0]
                    }
                    let formDom = $('#shopeeAccount_autoUploadVideo_form')
                    //赋值
                    formDom.find(`input[name=autoUploadVideo][value=${res[0].autoUploadVideo}]`).prop('checked',true)
                    res[0].salesType !==undefined && formDom.find('select[name=salesType]').val(res[0].salesType)
                    res[0].salesNum !==undefined && formDom.find('input[name=salesNum]').val(res[0].salesNum)
                    res[0].listingDayNums !==undefined && formDom.find('input[name=listingDayNums]').val(res[0].listingDayNums)
                    res[0].viewsPlusLikes !==undefined&& formDom.find('input[name=viewsPlusLikes]').val(res[0].viewsPlusLikes)
                    res[0].prodPSkuListStr !==undefined && formDom.find('textarea[name=prodPSkuListStr]').val(res[0].prodPSkuListStr)
                    const arr = res[1].map(item=>({
                        name:item.name,
                        value:item.name,
                        selected:res[0].videoTagList && res[0].videoTagList.split(',').includes(item.name)
                    }))
                    formSelects.data('shopeeAccount_autoUploadVideo_videoTagList', 'local', {arr})
                    form.render()
                })

            },
            yes:function(index,layero){
                let formObj = serializeObject($('#shopeeAccount_autoUploadVideo_form'))
                commonReturnPromise({
                    url:'/lms/salesplat/saveOrUpdateStoreConfig',
                    type: 'post',
                    contentType: 'application/json',
                    params:JSON.stringify({...originalObj, ...formObj})
                }).then(res=>{
                    layer.msg('操作成功')
                    layer.close(index);
                    $("#shopeeSearch").click()
                })
            }
        })
    }

    // 性感图片过滤
    function shopeeAcct_sexyImgFilterSet(obj = {}) {
        let originalObj = {
          storeAcctId: obj.id,
        };
        let popIndex = layer.open({
            type: 1,
            title: "设置过滤性感图片类目",
            area: ["820px", "600px"],
            content: $("#shopee_acct_set_sexyImgFilte_tpl").html(),
            btn: ["保存", "关闭"],
            success: function (layero, index) {
                commonReturnPromise({
                    url: `/lms/salesplat/getStoreConfig?storeAcctId=${obj.id}`,
                }).then((res) => {
                    originalObj = { ...originalObj, ...res };
                    tableRender(res.platCateInfoList || []);
                });

                function tableRender(data) {
                    table.render({
                        elem: "#shopee_acct_set_sexyImgFilter",
                        data: data,
                        cols: [
                            [
                                { type: "checkbox" },
                                { field: "platCateId", title: "类目id", width: 90 },
                                { field: "platCateTree", title: "过滤性感图片类目" },
                                {
                                title: "操作",
                                width: 90,
                                align: "center",
                                toolbar:
                                    '<div><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="remove">移除</a></div>',
                                },
                            ],
                        ],
                        id: "shopee_acct_set_sexyImgFilterId",
                        page: false,
                        limit: 100000,
                    });
                }

                table.on("tool(shopee_acct_set_sexyImgFilter)", function (obj) {
                    if (obj.event == "remove") {
                        obj.tr.remove();
                    }
                });

                // 批量删除
                $("#shopee_acct_set_sexyImgFilter_remove").click(function () {
                    // 选中行
                    let trDomList = [];
                    $("#shopee_acct_set_sexyImgFilter")
                        .next()
                        .find("tbody tr")
                        .each(function () {
                        if ($(this).find('input[name="layTableCheckbox"]:checked').length) {
                            trDomList.push($(this));
                        }
                        });
                    if (!trDomList.length) {
                        return layer.msg("请选择要删除的数据");
                    }
                    trDomList.forEach((trDom) => {
                        trDom.remove();
                    });
                    // 将表头置为未选择状态
                    $("#shopee_acct_set_sexyImgFilter")
                        .next()
                        .find("thead tr")
                        .find("input[name=layTableCheckbox]")
                        .prop("checked", false);
                    form.render("checkbox");
                });

                // 添加类目
                $("#shopee_acct_set_sexyImgFilter_add").click(function () {
                    // 调用类目
                    function addData(obj) {
                        const { id, cateTreeName } = obj;
                        const newObj = {
                        platCateId: id,
                        platCateTree: cateTreeName.split(`${id} `)[1],
                        };
                        // 获取已有数据
                        let platCateInfoList = [];
                        $("#shopee_acct_set_sexyImgFilter")
                        .next()
                        .find("tbody tr")
                        .each(function () {
                            platCateInfoList.push({
                            platCateId: $(this)
                                .find('td[data-field="platCateId"] div')
                                .text(),
                            platCateTree: $(this)
                                .find('td[data-field="platCateTree"] div')
                                .text(),
                            });
                        });
                        platCateInfoList.push(newObj);
                        tableRender(platCateInfoList);
                    }
                    cateLayerOpen(
                        "shopee",
                        "shopee_acct_layer_work_develop_pl",
                        "",
                        "#shopee_acct_itemCat_input",
                        "",
                        "",
                        { needCb: true, cb: addData }
                    );
                });
            },
            yes: function (index, layero) {
                let imageFilterPlatCateIdList = [];
                $("#shopee_acct_set_sexyImgFilter")
                .next()
                .find("tbody tr")
                .each(function () {
                    imageFilterPlatCateIdList.push( $(this).find('td[data-field="platCateId"] div').text());
                });
                commonReturnPromise({
                    url: "/lms/salesplat/saveOrUpdateStoreConfig",
                    type: "post",
                    contentType: "application/json",
                    params: JSON.stringify({
                        ...originalObj,
                        imageFilterPlatCateIdListStr: imageFilterPlatCateIdList.join(","),
                    }),
                }).then((res) => {
                    layer.msg("操作成功");
                    layer.close(index);
                    $("#shopeeSearch").click();
                });
            },
        });
      }

    function shopeeAcct_storeTagBatchSet(idArr) {
        let popIndex = layer.open({
          type: 1,
          title: "批量修改店铺标签",
          area: ["500px", "500px"],
          content: $("#shopee_acct_set_bacth_storetag_tpl").html(),
          btn: ["保存", "关闭"],
          success: function (layero, index) {
            commonReturnPromise({
              url: "/lms/sysdict/getStoreTagByCode",
              type: "post",
              params: { codes: "shopee" },
            }).then((res) => {
              const arr = (res || []).map((item) => ({
                name: item.name,
                value: item.name,
              }));
              formSelects.data("shopeeAccount_storetag_addStoreTagList", "local", {
                arr,
              });
              formSelects.data("shopeeAccount_storetag_removeStoreTagList", "local", {
                arr,
              });
            });
          },
          yes: function (index, layero) {
            const addStoreTagList =
              formSelects.value("shopeeAccount_storetag_addStoreTagList", "val") ||
              [];
            const removeStoreTagList =
              formSelects.value("shopeeAccount_storetag_removeStoreTagList", "val") ||
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
              $("#shopeeSearch").click()
            });
          },
        });
      }


    // 店铺标签设置
    function shopeeAcct_storeTagSet({isBatch=false,idArr}){
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
                    params: {codes: 'shopee'}
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
                    const getTpl = $("#shopee_acct_set_storetag_tpl").html()
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
                        $("#shopeeSearch").click()
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
                        $("#shopeeSearch").click()
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

    // mall店铺
    function shopeeAccount_setMallStore(obj={}){
        let originalObj={}
        let popIndex = layer.open({
            type: 1,
            title: "设置mall店铺设置",
            area: ['820px', '400px'],
            content: $("#shopee_acct_set_mallStore_tpl").html(),
            btn: ["保存", "关闭"],
            success: function(layero, index) {
                $('#shopee_acct_set_mallStore_form').parents('.layui-layer-content').css('overflow','unset')
                commonReturnPromise({
                    url: `/lms/salesplat/getStoreConfig?storeAcctId=${obj.id}`,
                }).then(res=>{
                    originalObj = JSON.parse(JSON.stringify(res))
                    let formDom = $('#shopee_acct_set_mallStore_form')
                    formDom.find(`input[name=shopIsMall][value=${res.shopIsMall||false}]`).prop('checked',true)
                    res.brandId && formDom.find(`input[name=brandId]`).val(res.brandId)
                    res.brandName && formDom.find(`input[name=brandName]`).val(res.brandName)
                    res.platCateIdListStr && formDom.find(`textarea[name=platCateIdListStr]`).val(res.platCateIdListStr)
                    // 状态为取消时，其它三个为disabled
                    if(!res.shopIsMall){
                        isDisabledShopMall(false)
                    }
                    form.on('radio(shopee_acct_set_mallStore_shopIsMall)',function(data){
                        const { value } =data
                        isDisabledShopMall(value==='true' ? true : false)
                        form.render()
                    })
                    form.render()
                })

            },
            yes:function(index){
                let formObj = serializeObject($('#shopee_acct_set_mallStore_form'))
                // mall品牌id与mall品牌名更新为均必填
                formObj.shopIsMall = formObj.shopIsMall  =='true' ? true : false
                formObj.updateItemBrandAndTitle = $('#shopee_acct_set_mallStore_form').find('input[name=updateItemBrandAndTitle]').prop('checked')
                if(formObj.shopIsMall===true){
                    if( !formObj.brandId){
                        return layer.msg('mall品牌ID需必填')
                    }
                    if(!formObj.brandName ){
                        return layer.msg('mall品牌名需必填')
                    }
                }else{
                    // 为取消状态时，不传当前其它三个新值
                    delete formObj.brandId
                    delete formObj.brandName
                    delete formObj.platCateIdListStr
                }

                let params = {...originalObj,...formObj}
                commonReturnPromise({
                    url: "/lms/salesplat/saveOrUpdateStoreConfig",
                    type: "post",
                    contentType: "application/json",
                    params: JSON.stringify({
                        ...originalObj,
                        ...formObj
                    }),
                }).then((res) => {
                    layer.msg("操作成功",{icon:1});
                    layer.close(index);
                    $("#shopeeSearch").click();
                });
            }
        })
    }

    function isDisabledShopMall(value){
        let formDom = $('#shopee_acct_set_mallStore_form')
        if(value){
            formDom.find(`input[name=brandId]`).attr('disabled',false).removeClass('layui-disabled')
            formDom.find(`input[name=brandName]`).attr('disabled',false).removeClass('layui-disabled')
            formDom.find(`textarea[name=platCateIdListStr]`).attr('disabled',false).removeClass('layui-disabled')
        }else{
            formDom.find(`input[name=brandId]`).attr('disabled',true).addClass('layui-disabled')
            formDom.find(`input[name=brandName]`).attr('disabled',true).addClass('layui-disabled')
            formDom.find(`textarea[name=platCateIdListStr]`).attr('disabled',true).addClass('layui-disabled')
        }
    }

    // 获取平台账号基本和辅助信息
    function shopeeAcct_getSalesPlatAccountBaseAndDetailInfo(salesPlatAccountId) {
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
                $("#shopeeSalesPlatAccountAddForm input[name='acctBaseId']").val(returnData.acctBaseId);
                $("#shopeeSalesPlatAccountAddForm input[name='storeAcct']").val(returnData.storeAcct);
                // $("#shopeeSalesPlatAccountAddForm input[name='imgDomain']").val(returnData.imgDomain);
                $("#shopeeSalesPlatAccountAddForm textarea[name='acctBaseRemark']").val(returnData.acctBaseRemark);
                $("#shopeeSalesPlatAccountAddForm select[name=salespersonId]").val(returnData.salespersonId);
                if (returnData.customServicerId != null && returnData.customServicerId > 0) {
                    $("#shopeeSalesPlatAccountAddForm select[name=customServicerId]").val(returnData.customServicerId);
                }
                $("#shopeeSalesPlatAccountAddForm select[name=sellLeaderId]").val(returnData.sellLeaderId);
                $("#shopeeSalesPlatAccountAddForm select[name=leaderId]").val(returnData.leaderId);
                form.render('select');
                //初始化发货仓库
                initShopeeWarehouseSelect('addShopeeInfoLayer_shippingWarehouseId',{showAll: true,selected:returnData.shippingWarehouseId})
                $("#shopeeSalesPlatAccountAddForm input[name='allrootAliasName']").val(returnData.allrootAliasName);
                $("#shopeeSalesPlatAccountAddForm input[name='brand']").val(returnData.brand);
                $("#shopeeSalesPlatAccountAddForm select[name='salesSite']").val(returnData.salesSite);
                // detail
                $("#shopeeSalesPlatAccountAddForm input[name='acctDetailId']").val(returnData.acctDetailId);
                $("#shopeeSalesPlatAccountAddForm input[name='salesAcctId']").val(returnData.salesAcctId);

                // secret
                $("#shopeeSalesPlatAccountAddForm input[name='sellerId']").val(returnData.sellerId);
                $("#shopeeSalesPlatAccountAddForm input[name='siteId']").val(returnData.siteId);
                $("#shopeeSalesPlatAccountAddForm input[name='secretKey']").val(returnData.secretKey);
                // $("#shopeeSalesPlatAccountAddForm select[name='stopToPublish']").val(returnData.stopToPublish ? '1' : '0');

                $("#shopeeSalesPlatAccountAddForm input[name='taxNumber']").val(returnData.taxNumber);
                $("#shopeeSalesPlatAccountAddForm input[name='eoriNumber']").val(returnData.eoriNumber);

                if (returnData.status == false) {
                    $("#shopeeAcctReuseDiv").removeClass('layui-hide');
                } else {
                    $("#shopeeAcctDelDiv").removeClass('layui-hide');
                }
                form.render('select')
            },
            error: function() {
                layer.msg("服务器正忙");
            }
        });
    }

    //停用店铺账号
    function shopeeAcct_deleteSalesPlatAccount(salesPlatAccountId) {
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
                            // table.reload('shopeeAcctTable');
                            $("#shopeeSearch").click()
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
    function shopeeAcct_openSalesPlatAccount(salesPlatAccountId) {
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
                            // table.reload('shopeeAcctTable');
                            $("#shopeeSearch").click()
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

    $('#addShopeeInfoByImportFile').on('change', function() {
        var files = $('#addShopeeInfoByImportFile')[0].files
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
                    success: function(res) {
                        loading.hide()
                        $('#addShopeeInfoByImportFile').val('')
                        if(res.code=='0000'){
                            layer.msg(res.msg || '操作成功',{icon:1})
                        }else{
                            if (Array.isArray(res.data)) {
                                const failArr = res.data.filter(item=>item.operationCode===0)
                                shopeeAccount_exportResult(failArr, res.msg || '操作失败')
                            }else{
                                layer.msg(res.msg || '操作失败', {icon: 2})
                            }
                        }
                    },
                    error: function() {
                        loading.hide()
                        $('#addShopeeInfoByImportFile').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })

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
                    $('#shopeeSearch').trigger('click');
                } else {
                    layer.msg(res.msg);
                }
            }
        });
    }

    form.on('select(shopeeAcct_downloadType)',function(data){
        const { value } = data
        switch(value){
            case 'addStore':
                window.location.href = `${ctx}/static/templet/addShopeeStoreTemplate.xlsx`
                break;
            case 'editStore':
                window.location.href = `${ctx}/static/templet/shopeeBatchImportUpdateTemplate.xlsx`
                break;
            case 'authInfo':
                window.location.href = `${ctx}/static/templet/shopeeStoreAuthInfoTemplate.xlsx`
                break;
            // case 'oldPresaleTpl':
            //     loading.show()
            //     transBlob({
            //         url:'/lms/shopee/shop/downloadTemplate?templateName=线上预售额度配置',
            //     }, 'get').then(function () {
            //         loading.hide();
            //         layer.alert("下载成功",{icon:1})
            //     }).catch(function (err) {
            //         loading.hide();
            //         layer.msg(err, {icon: 2});
            //     });
            //     break;
            case 'newPresaleTpl':
                // 获取选中数据
                checkStatus = table.checkStatus('shopeeAcctTable'); //test即为基础参数id对应的值
                storeAccts = checkStatus.data.map(v=>v.storeAcct).join();
                const formData = new FormData()
                formData.append('storeAccts',storeAccts)
                loading.show()
                transBlob({
                    url:'/lms/shopee/shop/downloadTemplate?templateName=店铺预售规则配置',
                    formData,
                }, 'post').then(function () {
                    loading.hide();
                    layer.alert("下载成功",{icon:1})
                }).catch(function (err) {
                    loading.hide();
                    layer.msg(err, {icon: 2});
                });
                break;
            default:
                break;
        }
    })

    $("#shopeeAccountExportBtn").click(()=>{
        const selectData = $("#shopeeaccountCard select[name=downloadType]").val()
        if(selectData==='') return layer.msg('请选择导入类型',{icon:7})
        selectData == "addStore"?$('#addShopeeInfoByImportFile').click():'';
        selectData == "editStore"?$("#shopee_importEditStore").click():'';
        selectData == "authInfo"?$("#shopee_importAuthInfo").click():'';
        // selectData == "oldPresaleTpl"?$("#shopee_importOldPresaleConfig").click():'';
        selectData == "newPresaleTpl"?$("#shopee_importNewPresaleConfig").click():'';
    })

    form.on('select(shopeeAcctBatchOper)', function(data) {
        var optionNum = data.value;
        if (3 == optionNum) {
            var acctIds = shopeeAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改信息",
                area: ["500px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editShopeeSalesPersonLayer").html(),
                end: function() {
                    $("#editShopeeSalesPersonForm select[name=salespersonId]").val("");
                },
                success: function(layero, index) {
                    shopeeAcct_getSalesPersion();
                    form.render("select");
                },
                yes: function() {
                    var salespersonId = $("#editShopeeSalesPersonForm select[name=salespersonId]").val();
                    var salesperson = $("#editShopeeSalesPersonForm select[name=salespersonId] option:selected").text();
                    var customServicerId = $("#editShopeeSalesPersonForm select[name=customServicerId]").val();
                    var customServicer = $("#editShopeeSalesPersonForm select[name=customServicerId] option:selected").text();
                    var sellLeaderId = $("#editShopeeSalesPersonForm select[name=sellLeaderId]").val();
                    var sellLeaderName = $("#editShopeeSalesPersonForm select[name=sellLeaderId] option:selected").text();
                    var leaderId = $("#editShopeeSalesPersonForm select[name=leaderId]").val();
                    var leaderName = $("#editShopeeSalesPersonForm select[name=leaderId] option:selected").text();
                    $.ajax({
                        type: "post",
                        url: ctx + "/salesplat/editSalesPerson.html",
                        dataType: "json",
                        data: {
                            ids: acctIds,
                            salesperson: salesperson,
                            salespersonId: salespersonId,
                            customServicerId: customServicerId,
                            customServicer: customServicer,
                            sellLeaderId: sellLeaderId,
                            sellLeaderName: sellLeaderName,
                            leaderId,
                            leaderName
                        },
                        traditional: true,
                        success: function(returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg("批量修改成功");
                                table.reload("shopeeAcctTable");
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        } else if (5 == optionNum) {
            var acctIds = shopeeAcct_getStoreAcctIds();
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

        } else if (6 == optionNum) {
            var acctIds = shopeeAcct_getStoreAcctIds();
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

        } else if (7 == optionNum) {
            var acctIds = shopeeAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            var index = layer.open({
                type: 1,
                title: "修改图片域名",
                area: ["600px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#editShopeeDomainLayer").html(),
                end: function() {
                    $("#editShopeeDomainForm select[name=domainId]").val("");
                },
                success: function(layero, index) {
                    shopeeAcct_getDomain();
                    form.render("select");
                },
                yes: function() {
                    var imgDomain = $("#editShopeeDomainForm select[name=domainId] option:selected").text();
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
                                // table.reload('shopeeAcctTable');
                                $("#shopeeSearch").click()
                            } else {
                                layer.msg(returnData.msg);
                            }
                        }
                    });
                },
            });
        } else if (8 == optionNum) {
            var acctIds = shopeeAcct_getStoreAcctIds();
            if (acctIds.length < 1) {
                layer.msg("请至少选择1个店铺");
                return;
            }
            loading.show();
            $.ajax({
                type: "post",
                url: ctx + "/shopee/shopeeIsEnableProduct/batchSyncItemBoost.html",
                dataType: "json",
                data: { acctIds: acctIds },
                traditional: true,
                success: function(returnData) {
                    if (returnData.code == "0000") {
                        loading.hide();
                        layer.msg("同步成功");
                        // table.reload('shopeeAcctTable');
                        $("#shopeeSearch").click()
                    } else {
                        layer.msg(returnData.msg);
                    }
                }
            });
        } else if (9 == optionNum) { //启用店铺
            layer.confirm('确定批量启用店铺吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function(index) {
                var acctIds = shopeeAcct_getStoreAcctIds();
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
        } else if (10 == optionNum) { //批量停用店铺
            layer.confirm('确定批量停用店铺吗？', {
                btn: ['确定', '取消'], //按钮
                shade: false //不显示遮罩
            }, function(index) {
                var acctIds = shopeeAcct_getStoreAcctIds();
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
        } else if (11 == optionNum) { //批量刊登
            commonTableCksSelected('shopeeAcctTable').then(function(result) {
                    // var saleSite = result[0].salesSite;
                    // var allEqual = result.every(function (item) {
                    //     return item.salesSite == saleSite;
                    // });
                    // if (!allEqual) {
                    //     return layer.msg('只有同站点的才可以批量修改!', {icon: 7});
                    // }
                    var idArr = result.map(function(item) {
                        return item.id;
                    });
                    // data.autoPublishCateIds = 0;
                    var index = layer.open({
                        type: 1,
                        title: "自动删除设置",
                        area: ['800px','600px'],
                        shadeClose: false,
                        content: $("#shopee_setedLayer").html(),
                        btn: ["保存", "关闭"],
                        success: function(layero, index) {
                            var getTpl = shopee_setedContainerTpl.innerHTML,
                                view = document.getElementById('shopee_setedContainer');

                            laytpl(getTpl).render({...data,isBatch:true}, function(html) {
                                view.innerHTML = html;
                                $("#shopee_platform_logisticsIdStr").addClass('layui-hide')
                                // layero.find('[name=ifPromotionIds]').prop('disabled', true);
                                // layero.find('[name=ifBundleDealIds]').prop('disabled', true);    //?
                                form.render();
                                // initShopeeCateTree().then(function(result) {
                                //     console.log(result);
                                // });
                                // watchCateChangeCkbox(layero);
                            });
                        },
                        yes: function(index, layero) {
                            // var chkedNodeId = shopeeCateTree.getCheckedNodes(true);
                            // //选中节点
                            // var cateIsShow = layero.find("[name=cateChange]:checked").val();
                            // var autoPublishCateIds;
                            // if (cateIsShow == 'all') {
                            //     autoPublishCateIds = 0;
                            // } else if(cateIsShow == 'appoint') {
                            //     autoPublishCateIds = chkedNodeId.map(function(item) {
                            //         return item.id;
                            //     }).join();
                            // }
                            //自动删除
                            var autoDelete = layero.find('[name=autoDelete]:checked').val();
                            var autoDeleteNum = layero.find('[name=autoDeleteNum]').val();
                            var autoDeleteSalesType = layero.find('select[name=autoDeleteSalesType] option:selected').val().trim();
                            var historySalesType = layero.find('select[name=historySalesType] option:selected').val().trim();
                            // //自动刊登
                            // var autoPublish = layero.find('[name=autoPublish]:checked').val();
                            // var autoPublishNum = layero.find('[name=autoPublishNum]').val();
                            // //刊登时间
                            // var autoListingTime = layero.find('[name=autoListingTime]').val();
                            // //刊登间隔
                            // var autoListingIntervalTime = layero.find('[name=autoListingIntervalTime]').val();
                            // //是否促销
                            // var ifPromotion = layero.find('[name=ifPromotion]').val();
                            // //是否捆绑销售
                            // var ifBundleDeal = layero.find('[name=ifBundleDeal]').val();
                            //刊登时间2
                            var autoDeleteGreatListingTime = layero.find('[name=autoDeleteGreatListingTime]:checked').val();

                            var autoDeleteViewLt = layero.find('input[name=autoDeleteViewLt]').val()
                            if(autoDeleteViewLt==='0' || Number(autoDeleteViewLt)<0) return layer.msg('请输入大于0的整数的listing浏览量');
                            var autoDeleteLikeLt = layero.find('input[name=autoDeleteLikeLt]').val()
                            if(autoDeleteLikeLt==='0' || Number(autoDeleteLikeLt)<0) return layer.msg('请输入大于0的整数的listing收藏量');
                            const autoDeleteItemByTort =layero.find('[name=autoDeleteItemByTort]:checked').val()
                            const autoDeleteItemByProhibit=layero.find('[name=autoDeleteItemByProhibit]:checked').val()
                            const autoDeleteItemByTortSalesType=layero.find('[name=autoDeleteItemByTortSalesType]').val()
                            const autoDeleteItemByTortSalesLte=layero.find('[name=autoDeleteItemByTortSalesLte]').val()
                            const deleteItemByTortIfHistorySalesGtZero=layero.find('[name=deleteItemByTortIfHistorySalesGtZero]').val()
                            // 校验侵权相关的
                            if(autoDeleteItemByTort == 1){
                                if(!autoDeleteItemByTortSalesType) return layer.msg('请将侵权删除的销量校验填写完整');
                                if(!autoDeleteItemByTortSalesLte) return layer.msg('请将侵权删除的销量校验填写完整');
                                if(!deleteItemByTortIfHistorySalesGtZero) return layer.msg('请将侵权删除的销量校验填写完整');
                            }
                            const autoDeleteItemByProhibitSalesType=layero.find('[name=autoDeleteItemByProhibitSalesType]').val()
                            const autoDeleteItemByProhibitSalesLte=layero.find('[name=autoDeleteItemByProhibitSalesLte]').val()
                            const deleteItemByProhibitIfHistorySalesGtZero=layero.find('[name=deleteItemByProhibitIfHistorySalesGtZero]').val()
                            // 校验侵权相关的
                            if(autoDeleteItemByProhibit == 1){
                                if(!autoDeleteItemByProhibitSalesType) return layer.msg('请将禁售删除的销量校验填写完整');
                                if(!autoDeleteItemByProhibitSalesLte) return layer.msg('请将禁售删除的销量校验填写完整');
                                if(!deleteItemByProhibitIfHistorySalesGtZero) return layer.msg('请将禁售删除的销量校验填写完整');
                            }
                            // if (!autoDeleteGreatListingTime) {
                            //     return layer.msg('请选择刊登时间');
                            // }
                            //判断条件
                            // if (autoDelete == 'true') {
                            //     if (!autoDeleteNum) {
                            //         return layer.msg('请输入自动删除数量!', { icon: 2 });
                            //     }
                            // }
                            // if (autoPublish == 'true') {
                            //     if (!autoPublishNum) {
                            //         return layer.msg('请输入自动刊登数量!', { icon: 2 });
                            //     }
                            //     if (autoListingTime == '') {
                            //         return layer.msg('刊登时间必填', { icon: 2 });
                            //     }
                            //     if (!autoListingIntervalTime) {
                            //         return layer.msg('时间间隔必填', { icon: 2 });
                            //     }
                            //     if (cateIsShow != 'all') {
                            //         if (!autoPublishCateIds) {
                            //             return layer.msg('请选择自动刊登的类目!', { icon: 2 });
                            //         }
                            //     }
                            //     var minutesNum = Number(autoPublishNum) * Number(autoListingIntervalTime);
                            //     if (minutesNum > 1320) {
                            //         return layer.msg('刊登数量*间隔时间需要小于22小时', { icon: 2 });
                            //     }
                            // }
                            // if(cateIsShow != 'all'){
                            //     if (autoPublishCateIds && autoPublishCateIds !=0) {
                            //         if (autoPublish == 'false') {
                            //             return layer.msg('请开启自动刊登功能!', {icon: 2});
                            //         }
                            //         if (!autoPublishNum) {
                            //             return layer.msg('请输入自动刊登数量!', {icon: 2});
                            //         }
                            //     }
                            // }
                            var obj = {
                                platCode: 'shopee',
                                storeAcctIdStr: idArr.join(),
                                // autoPublishCateIds: autoPublishCateIds,
                                autoDelete: autoDelete,
                                autoDeleteNum: autoDeleteNum == '' ? '' : Number(autoDeleteNum),
                                autoDeleteSalesType: autoDeleteSalesType,
                                historySalesType: historySalesType,
                                // autoPublish: autoPublish,
                                // autoPublishType: 2,
                                // autoPublishNum: autoPublishNum == '' ? '' : Number(autoPublishNum),
                                // autoListingTime:autoListingTime == '' ? '' : Number(autoListingTime), //刊登时间
                                // autoListingIntervalTime:autoListingIntervalTime == '' ? '' :  Number(autoListingIntervalTime), //刊登间隔
                                // ifPromotion: ifPromotion, //是否促销
                                // ifBundleDeal: ifBundleDeal, //是否捆绑销售
                                autoDeleteGreatListingTime: autoDeleteGreatListingTime,
                                autoDeleteViewLt,
                                autoDeleteLikeLt,
                                autoDeleteItemByTort,
                                autoDeleteItemByTort,
                                autoDeleteItemByTortSalesType,
                                autoDeleteItemByTortSalesLte,
                                deleteItemByTortIfHistorySalesGtZero,
                                autoDeleteItemByProhibit,
                                autoDeleteItemByProhibitSalesType,
                                autoDeleteItemByProhibitSalesLte,
                                deleteItemByProhibitIfHistorySalesGtZero
                            };
                            for(var key in obj){
                                if(obj[key] === undefined || obj[key] === '' ||obj[key] == null)
                                delete obj[key]
                            }
                            shopeeAutoAjax(obj).then(function(result) {
                                layer.close(index);
                                layer.msg(result || '设置自动删除成功!', { icon: 1 });
                                $('#shopeeSearch').trigger('click'); //重新搜索
                            }).catch(function(err) {
                                layer.msg(err, { icon: 2 });
                            })
                        }
                    });
                })
                .catch(function(err) {
                    layer.msg(err, { icon: 7 });
                })
        }else if( 12 == optionNum) { // 批量添加店铺标签
            commonTableCksSelected('shopeeAcctTable').then(function(result) {
                const idArr = result.map(item=>item.id);
                shopeeAcct_storeTagBatchSet(idArr)
            })
            .catch(function(err) {
                layer.msg(err, { icon: 7 });
            })
        }
    });

    function shopeeAcct_getStoreAcctIds() {
        var acctIds = [];
        var checkStatus = table.checkStatus('shopeeAcctTable'); //test即为基础参数id对应的值
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
    //                 $('#shopeeSearch').trigger('click');
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
        if (dataObj.salespersonId == null || dataObj.salespersonId == '' || dataObj.salespersonId == undefined) {
            layer.msg('请选择销售员');
            return false;
        }
        return true;
    }

    //监听iframe传参
    window.addEventListener('message', function(event){
      console.log('iframe接收到的数据是', event.data);
      let {syncStatus,time,sevenTime} = event.data;
      if(syncStatus){
        $('#shopeeAcctSearchForm [name=syncStatus]').val(syncStatus);
        form.render('select');
        $('#shopeeSearch').trigger('click');
      }
       //都存在表明是七天内过期域名
      if(time && sevenTime){
        vueIframeJumpAndSearch({time: time, sevenDayTime: sevenTime}, 'shopee');
      }
      if(time && !sevenTime){
        //{time: time}
        vueIframeJumpAndSearch({time: time}, 'shopee');
      }
    });
});

/***
 * 获取shopee销售员信息
 */
function shopeeAcct_getSalesPersion() {
    $("#shopeeSalesPlatAccountAddForm select[name=salespersonId]").html('<option value="">请选择销售员</option>');
    $("#shopeeSalesPlatAccountAddForm select[name=customServicerId]").html('<option value="">请选择客服</option>');
    $("#shopeeSalesPlatAccountAddForm select[name=leaderId]").html('<option value="">请选择shopee组长</option>');
    $("#editShopeeCustomServicerForm select[name=customServicerId]").html('<option value="">请选择客服</option>');
    $("#editShopeeSalesPersonForm select[name=salespersonId]").html('<option value="">请选择销售员</option>');
    $("#editShopeeSalesPersonForm select[name=leaderId]").html('<option value="">请选择shopee组长</option>');
    $("#editShopeeSalesPersonForm select[name=sellLeaderId]").html('<option value="">请选择销售主管</option>');
    $("#editShopeeSalesPersonForm select[name=customServicerId]").html('<option value="">请选择客服专员</option>');


    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: { role: "shopee专员" },
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#shopeeSalesPlatAccountAddForm select[name=salespersonId]").append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                        $("#editShopeeSalesPersonForm select[name=salespersonId]").append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                    }
                }
            }
        }
    });
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: { role: "shopee客服" },
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        // $("#shopeeSalesPlatAccountAddForm select[name=customServicerId]").append('<option value="'+accts[i].id+'">'+accts[i].userName+'</option>');
                        // $("#editShopeeCustomServicerForm select[name=customServicerId]").append('<option value="'+accts[i].id+'">'+accts[i].userName+'</option>');
                        $('#shopeeSalesPlatAccountAddForm select[name=customServicerId]').append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                        $('#editShopeeSalesPersonForm select[name=customServicerId]').append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                    }
                }
            }
        }
    });
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: { role: "shopee主管" },
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#shopeeSalesPlatAccountAddForm select[name=sellLeaderId]").append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                        $("#editShopeeSalesPersonForm select[name=sellLeaderId]").append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');

                    }
                }
            }
        }
    });
    $.ajax({
        type: "post",
        url: ctx + "/sys/listuserbyrole.html",
        data: { role: "shopee组长" },
        dataType: "json",
        async: false,
        success: function(returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                var accts = returnData.data;
                if (accts.length > 0) {
                    for (var i = 0; i < accts.length; i++) {
                        $("#shopeeSalesPlatAccountAddForm select[name=leaderId]").append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');
                        $("#editShopeeSalesPersonForm select[name=leaderId]").append('<option value="' + accts[i].id + '">' + accts[i].userName + '</option>');

                    }
                }
            }
        }
    });
}

function shopeeAcct_getDomain() {
    $("#editShopeeDomainLayer select[name=domainId]").html('<option value="">选择域名</option>');
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
                        $("#editShopeeDomainForm select[name=domainId]")
                            .append('<option value="' + domainList[i].id + '">' + domainList[i].domain + '</option>')
                    }
                }
            }
        }
    });
}

var shopeeCateData;
var shopeeCateTree;
//设置自动刊登函数
function shopeeAutoAjax(obj) {
    return commonReturnPromise({
        type: 'post',
        url: '/lms/salesplat/setAutoDeleteOrPublish',
        contentType: 'application/json',
        params: JSON.stringify(obj)
    })
}
//初始化shopee商品类目
function initShopeeCateAjax() {
    return commonReturnPromise({
        url: ctx + "/prodcate/listtree.html"
    });
}

function initShopeeCateTree() {
    //左侧类目tree
    return new Promise(function(resolve) {
        initShopeeCateAjax().then(function(result) {
            var setting = {
                check: {
                    enable: true,
                    chkDisabledInherit: true,
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pid",
                    },
                },
                callback: {
                    onCheck: function(event, treeId, treeNode) {
                        //禁用所有子类
                        if (treeNode.isParent) {
                            var childrenNodes = treeNode.children;
                            try {
                                for (var i = 0; i <= childrenNodes.length; i++) {
                                    shopeeCateTree.setChkDisabled(
                                        childrenNodes[i],
                                        treeNode.checked,
                                        false,
                                        true
                                    );
                                }
                            } catch (e) {
                                //TODO handle the exception
                                console.log(e)
                            }
                            var childrenIds = getShopeeChildren([], treeNode);
                            for (var i = 0; i < childrenIds.length; i++) {
                                var node = shopeeCateTree.getNodeByParam("id", childrenIds[i]);
                                shopeeCateTree.checkNode(node, treeNode.checked, false, true);
                            }
                        }
                    }
                }
            };
            setting.check.chkboxType = { Y: "s", N: "s" };
            if (shopeeCateData == undefined) {
                shopeeCateData = result;
                var t = $("#shopeeCateTree");
                t = $.fn.zTree.init(t, setting, shopeeCateData);
                shopeeCateTree = $.fn.zTree.getZTreeObj("shopeeCateTree");
            } else {
                shopeeCateTree.destroy();
                var t = $("#shopeeCateTree");
                t = $.fn.zTree.init(t, setting, shopeeCateData);
                shopeeCateTree = $.fn.zTree.getZTreeObj("shopeeCateTree");
            }
            resolve('tree');
        }).catch(function(err) {
            layer.alert(err, { icon: 2 });
        });
    });
}
//获取ztree所有字节点id
function getShopeeChildren(ids, treeNode) {
    ids.push(treeNode.id);
    if (treeNode.isParent) {
        for (var obj in treeNode.children) {
            getShopeeChildren(ids, treeNode.children[obj]);
        }
    }
    return ids;
}
//监听checkbox选中
function watchCateChangeCkbox(layero) {
    var form = layui.form;
    form.on('radio(cateChangeFilter)', function(obj) {
        if (obj.value == 'appoint') { //指定类目
            layero.find('.shopeeCateTreeIsShow').removeClass('disN');
        } else if(obj.value == 'all') { //全部类目
            layero.find('.shopeeCateTreeIsShow').addClass('disN');
        }
    })
}
// 0到20的整数
function shopeeStoreValidateSales(e){
    const value = parseInt(e.target.value)
    if(!value && value!==0){
        e.target.value = ''
    }else if(value < 0){
        e.target.value = 0
    }else if(value > 20){
        e.target.value = 20
    }else{
        e.target.value = value
    }
}
