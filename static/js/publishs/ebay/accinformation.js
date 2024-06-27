layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
    var admin = layui.admin,
    form = layui.form,
    layer = layui.layer,
    table = layui.table,
    formSelects = layui.formSelects,
    element = layui.element,
    laydate = layui.laydate,
    laypage = layui.laypage,
    $ = layui.$;
    initHpSelect('#info_searchForm');
    form.render('select');
    /**
     * 日期渲染
     */
    laydate.render({
        elem: '#ebay_account_entries_date',
        range: true
    });

    $(function(){
        var endTime = new Date(new Date().getTime());
        var startTime = new Date(new Date().getTime() - 30*24*3600*1000);
        var timeStr = Format(startTime,"yyyy-MM-dd")+" - "+Format(endTime,"yyyy-MM-dd");
        $('#ebay_account_entries_date').val(timeStr);
    });

    /**
     * 渲染账户/paypal邮箱
     */
    $.ajax({
        type:'POST',
        url: ctx + '/ebayLog/searchAllUserId.html',
        dataType:'JSON',
        async:true,
        success:function (data) {
            if(data.data.ebayAccountList.length > 0) {
                for (var i = 0; i < data.data.ebayAccountList.length; i++) {
                    $("#user_id").append("<li data-value='" + data.data.ebayAccountList[i].userId + "' hp-select-li>" + data.data.ebayAccountList[i].userId + "</li>")
                }
            }else {
                console.log("获取账号失败")
            }
            if(data.data.sysUserList.length > 0) {
                for (var i = 0; i < data.data.sysUserList.length; i++) {
                    $("#ebay_account_sellLeaders").append("<option value='" + data.data.sysUserList[i].id + "'>" + data.data.sysUserList[i].userName + "</option>")
                }
            }else {
                console.log("获取账号失败")
            }
            form.render('select');
        }
    });
    //联动
    form.on('select(ebay_account_sellLeaders)',function(data){
        console.log(11)
        $.ajax({
            type:"get",
            url:ctx + "/ebayLog/ebayAcountBySellLeaderId.html?sellLeaderId=" + data.value,
            dataType:"json",
            success:function(data){
                if(data.code == "0000"){
                    $("#user_id").children().filter("li").remove();
                    for (var i = 0; i < data.data.length; i++) {
                        $("#user_id").append("<li data-value='" + data.data[i].storeAcct + "' hp-select-li>" + data.data[i].storeAcct + "</li>")
                    }
                }else{
                    console.log("获取账号失败")
                }
                form.render('select');
            }
        });
    });

    var payapl = [];
    $.ajax({
        type:'POST',
        url:ctx + '/ebayLog/searchAllPaypal.html',
        dataType:'JSON',
        async:true,
        success:function (data) {
            paypla();
            if(data.data.length > 0){
                for(var i = 0; i< data.data.length; i++){
                    payapl.push(data.data[i]);
                }
            }else {
                console.log("获取paypal邮箱失败")
            }
        }
    });
    function paypla() {
        if($("select[name=isBind] option:selected").val() == 0) {
            $("div[data-name=ebay_paypal]").append("<li data-value='"+"Active"+"' hp-select-li>" + 'Active' + "</li>");
            $("div[data-name=ebay_paypal]").append("<li data-value='"+"Closed"+"' hp-select-li>" + 'Closed' + "</li>");
            $("div[data-name=ebay_paypal]").append("<li data-value='"+"CustomCode"+"' hp-select-li>" + 'CustomCode' + "</li>");
            $("div[data-name=ebay_paypal]").append("<li data-value='"+"HighRestricted"+"' hp-select-li>" + 'HighRestricted' + "</li>");
            $("div[data-name=ebay_paypal]").append("<li data-value='"+"Invalid"+"' hp-select-li>" + 'Invalid' + "</li>");
            $("div[data-name=ebay_paypal]").append("<li data-value='"+"Locked"+"' hp-select-li>" + 'Locked' + "</li>");
            $("div[data-name=ebay_paypal]").append("<li data-value='"+"LowRestricted"+"' hp-select-li>" + 'LowRestricted' + "</li>");
            $("div[data-name=ebay_paypal]").append("<li data-value='"+"Unknown"+"' hp-select-li>" + 'Unknown' + "</li>");
            $("div[data-name=ebay_paypal]").append("<li data-value='"+"WireOff"+"' hp-select-li>" + 'WireOff' + "</li>")
        }
    }
    form.on('select(ebay_paypal_select)',function () {
        if($("select[name=isBind] option:selected").val() == 1){
            $("input[name='ebay_paypal']").val("");
            $("div[data-name=ebay_paypal]").empty();
            if(payapl.length > 0){
                for(var i = 0;i < payapl.length; i++){
                    $("div[data-name=ebay_paypal]").append("<li data-value='"+payapl[i].paypalEmail1+"' hp-select-li>" + payapl[i].paypalEmail1 + "</li>")
                }
            }else {
                console.log("获取paypal邮箱失败")
            }
        }else {
            $("div[data-name=ebay_paypal]").empty();
            $("input[name='ebay_paypal']").val("");
            paypla();
        }

    });

    var acc_Info_table = table.render({
        method:'POST',
        elem: '#acc_Info',
        url:ctx + '/ebayLog/searchEbayAccountWithoutPage.html' //数据接口
        ,
        title: '账户信息',
        page: false //开启分页
            ,
        toolbar: false //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,
        totalRow: true //开启合计行
            ,
        cols:[[ //表头
            { 
                type: "checkbox",
                width: 30
            },{
                field: 'storeAcct',
                title: '账号',
                templet:'#account_ebay'
            }, {
                field: 'registrationDate',
                title: '注册时间',
                templet:"<div>{{Format(d.registrationDate,'yyyy-MM-dd hh:mm:ss')}}</div>"
            }, {
                field: 'registrationName',
                title: '注册人',
            }, {
                field: 'companyName',
                title: '公司'
            },{
                field:'registAddress',
                title:'注册地址',
                templet:'#registAddress' ,width:'15%'
            },{
                field:'phone',
                title:'电话',
            },{
                field:'email',
                title:'注册邮箱'
            },{
                field:'payperStatus',
                title:'绑定paypal状态',
            },{
                field:'gatherPaypal',
                title:'收款Paypal',
                templet:'#gatherPaypal'
            },{
                field:'opation',
                title:'操作',
                templet:'#sync_butn'
            }
        ]],
        // limits: [20, 50, 100],
        // limit: 20,
        done:function (res,curr,count) {
            $("#ebay_accinformation_num1_span").text("共"+count+"条");
            theadHandle().fixTh({ id:'#ebayaccinformationCard'})
        }
    });
    var store_Information_table = table.render({
        method:'POST',
        elem: '#store_Information',
        url:ctx + '/ebayLog/searchEbayAccountWithoutPage.html' //数据接口
        ,
        title: '店铺信息',
        page: false //开启分页
            ,
        toolbar: false //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
            ,
        totalRow: true //开启合计行
            ,
        cols:[[ //表头
            { 
                type: "checkbox",
                width: 30
            },{
                field: 'storeAcct',
                title: '账号',
                templet:'#account_ebay'
            }, {
                field: 'powerSellerLevel',
                title: '卖家标准',
            }, {
                field: 'sellerAccountStatus',
                title: '店铺状态',
            }, {
                field: 'sellerFeeDiscount',
                title: '费用折扣'
            },{
                field:'positiveFeedbackPercent',
                title:'好评率',
            },{
                field:'feedbackScore',
                title:'信用',
            },{
                field:'newSite',
                title:'主站点'
            },{
                field:'sellerLevel',
                title:'主站点等级',
            },{
                field:'mainStopTime',
                title:'主站点时间段',
                templet:'#mainStopTime'
            },{
                field:'url',
                title:'URL',
                templet:'#ebay_url' ,width:'15%'
            },{
                field:'mainStopChange',
                title:'主站点变更',
                templet:'#mainStopChange'
            },{
                field:'operation',
                title:'操作',
                templet:'#sync_butn'
            }
        ]],limits: [20, 50, 100],
        limit: 20,
        done:function (res,curr,count) {
            $("#ebay_accinformation_num2_span").text("共"+count+"条");
            theadHandle().fixTh({ id:'#ebayaccinformationCard'});
        }
    });

    var acc_Info_table1 = table.render({
        method:'POST',
        elem: '#acct_entries_Information',
        url:ctx + '/ebayLog/searchEbayAccountEntries.html' //数据接口
        ,
        title: '账单信息',
        page: false //开启分页
        ,
        toolbar: false //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        ,
        totalRow: true //开启合计行
        ,
        cols:[[ //表头
            {
                type: "checkbox",
                width: 30
            },{
                field: 'storeAcct',
                title: '账号'
            }, {
                field: 'billingCycleDate',
                title: '出账单周期',sort:true
            }, {
                field: 'creditCardInfo',
                title: '信用卡',
            }, {
                field: 'creditCardExpiration',
                title: '信用卡过期时间',
                templet:"<div>{{Format(d.creditCardExpiration,'yyyy-MM-dd hh:mm:ss')}}</div>",sort:true

            },{
                field:'creditCardModifyDate',
                title:'信用卡更新时间',
                templet:"<div>{{Format(d.creditCardModifyDate,'yyyy-MM-dd hh:mm:ss')}}</div>",sort:true
            },{
                field:'currentBalance',
                title:'当前余额',templet:'#currentBalanceTpl',sort:true
            },{
                field:'invoiceBalance',
                title:'账单金额',templet:'#invoiceBalanceTpl',sort:true
            },{
                field:'invoiceDate',
                title:'账单日',
                templet:"<div>{{Format(d.invoiceDate,'yyyy-MM-dd hh:mm:ss')}}</div>"
            },{
                field:'lastAmountPaid',
                title:'上次实付金额',templet:'#lastAmountPaidTpl'
            },{
                field:'lastPaymentDate',
                title:'上次实付时间',
                templet:"<div>{{Format(d.lastPaymentDate,'yyyy-MM-dd hh:mm:ss')}}</div>",
                sort:true
            },{
                field:'paymentMethod',
                title:'支付方式'
            },{
                field:'opation',
                title:'操作',
                templet:'#sync_butn'
            }
        ]],
        // limits: [20, 50, 100],
        // limit: 20,
        done:function (res,curr,count) {
            $("#ebay_accinformation_num3_span").text("共"+count+"条");
            theadHandle().fixTh({ id:'#ebayaccinformationCard'})
        }
    });


    table.on('tool(acc_Info)',function (data) {
        loading.show();
        $.ajax({
            type:'POST',
            url: ctx + '/ebayLog/ebayAcountSyncOne.html',
            dataType:'JSON',
            async:true,
            data:{'storeAcctId':data.data.storeAcctId},
            success:function (data) {
                layer.msg(data.msg);
                loading.hide()
            }
        });
    });
    table.on('tool(store_Information)',function (data) {
        loading.show();
        $.ajax({
            type:'POST',
            url: ctx + '/ebayLog/ebayAcountSyncOne.html',
            dataType:'JSON',
            async:true,
            data:{'storeAcctId':data.data.storeAcctId},
            success:function (data) {
                layer.msg(data.msg);
                loading.hide()
            }
        });
    });
    table.on('tool(acct_entries_Information)',function (data) {
        loading.show();
        $.ajax({
            type:'POST',
            url: ctx + '/ebayLog/ebayAcountEntriesSyncOne.html',
            dataType:'JSON',
            async:true,
            data:{'storeAcctId':data.data.storeAcctId},
            success:function (data) {
                layer.msg(data.msg);
                loading.hide()
            }
        });
    });
    //悬浮显示全部错误信息
    $("body").on('mouseover', '.account_ebay', function() {
        var content = "<pre>" + $(this).next("pre").text() + "</pre>";
        var color = 'green';
        if(content.indexOf("同步成功")==-1){
            color = 'red';
        }
        layer.tips(content, $(this),{
            tips: [2, color],
            time: 0
        });
    });
    $("body").on('mouseout', '.account_ebay', function() {
        layer.closeAll('tips');
    });

    $("#ebay_account_search").click(function () {
        //封装参数
        var obj = {};
        obj.userId = $("input[name=user_id]").val();
        if($("select[name=isBind] option:selected").val() == 0){
            //绑定paypal状态
            obj.payperStatus = $("input[name='ebay_paypal']").val();
        }else {
            //收款paypal邮箱
            obj.paypalEmail1 = $("input[name='ebay_paypal']").val();
        }
        var type = $("select[name=search_type] option:selected").val();
        if(type == 0){
            //公司
            obj.companyName = $("#ebay_all_search").val();
        }else if(type == 1){
            //注册人
            obj.registrationName = $("#ebay_all_search").val();
        }else if(type == 2){
            //电话
            obj.phone = $("#ebay_all_search").val();
        }else if(type == 3){
            //省份
            obj.stateOrProvince = $("#ebay_all_search").val();
        }
        obj.sellLeaderId = $('#info_searchForm select[name=ebay_account_sellLeader]').val();//销售主管
        obj.powerSellerLevel = $("#powerSellerLevel option:selected").val();//卖家标准
        obj.sellerAccountStatus = $("#sellerAccountStatus option:selected").val();//店铺状态
        obj.feedbackSearchType = $("#feedbackSearchType option:selected").val();//好评率搜索类型
        obj.positiveFeedbackPercent = $("#feedbackSearch").val();//好评率
        obj.discountSearchType = $("#discountSearchType option:selected").val();//折扣搜索类型
        obj.sellerFeeDiscount = $("#discountSearch").val();//折扣
        obj.newSite = $("#newSite").val();
        obj.sellerLevel = $("#sellerLevel option:selected").val();
        obj.scoreSearchType = $("#scoreSearchType option:selected").val();
        obj.feedbackScore = $("#scoreSearch").val();
        obj.dateStr =$("#ebay_account_entries_date").val();
        acc_Info_table.reload({
            where:obj
        });
        store_Information_table.reload({
            where:obj
        });
        acc_Info_table1.reload({
            where:obj
        });
    })

    //导出
    $('#ebayAcct_exportBtn').click(function() {
        var outerIndex = layer.open({
            title: '导出详情',
            type: 1,
            area: ['1000px', '600px'],
            btn: ['确定', '关闭'],
            content: $('#ebayAcct_exportPop').html(),
            success: function() {
                form.on('checkbox(selectAll_acctList)', function(data) {
                    var checked = data.elem.checked
                    $('#exportForm_acctList input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var data = serializeObject($('#exportForm_acctList'));
                //查询条件
                var obj = {};
                obj.userId = $("input[name=user_id]").val();
                if($("select[name=isBind] option:selected").val() == 0){
                    obj.payperStatus = $("input[name='ebay_paypal']").val();
                }else {
                    obj.paypalEmail1 = $("input[name='ebay_paypal']").val();
                }
                var type = $("select[name=search_type] option:selected").val();
                if(type == 0){
                    obj.companyName = $("#ebay_all_search").val();
                }else if(type == 1){
                    obj.registrationName = $("#ebay_all_search").val();
                }else if(type == 2){
                    obj.phone = $("#ebay_all_search").val();
                }else if(type == 3){
                    obj.stateOrProvince = $("#ebay_all_search").val();
                }
                obj.sellLeaderId = $('#info_searchForm select[name=ebay_account_sellLeader]').val();//销售主管
                obj.powerSellerLevel = $("#powerSellerLevel option:selected").val();//卖家标准
                obj.sellerAccountStatus = $("#sellerAccountStatus option:selected").val();//店铺状态
                obj.feedbackSearchType = $("#feedbackSearchType option:selected").val();//好评率搜索类型
                obj.positiveFeedbackPercent = $("#feedbackSearch").val();//好评率
                obj.discountSearchType = $("#discountSearchType option:selected").val();//折扣搜索类型
                obj.sellerFeeDiscount = $("#discountSearch").val();//折扣
                obj.newSite = $("#newSite").val();
                obj.sellerLevel = $("#sellerLevel option:selected").val();
                obj.scoreSearchType = $("#scoreSearchType option:selected").val();
                obj.feedbackScore = $("#scoreSearch").val();
                checkNull(obj)
                data.searchParam = JSON.stringify(obj)
                var Confirmindex = layer.confirm('确认导出当前搜索条件下的数据？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/ebayLog/exportAcctList.html')
                    layer.close(outerIndex);
                })
            }
        })
    })

});