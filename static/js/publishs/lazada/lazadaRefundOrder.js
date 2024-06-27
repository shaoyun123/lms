layui.use(['admin','form','table','layer','laydate','formSelects'],function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate;

    form.render('select');
    //渲染部门销售员店铺三级联动
    render_hp_orgs_users("#lazadaRefundOrderSearchForm");

    // 清空平台类目
    $('#lazadaRefundOrderResetBtn').click(function(){
        $('#lazadaRefundOrderSearchForm')[0].reset()
    });

    laydate.render({
        elem: '#orderTimeCn'
        ,range: true
        ,value: `${recentMonth().start} - ${recentMonth().end}`,
    });

    // 最近一个月,开始时间是当前时间，往后推一个月
    // function recentMonth(){
    //     var start = new Date();
    //     var year = start.getFullYear();
    //     var month = start.getMonth() + 1;//0-11表示1-12月
    //     var day = start.getDate();
    //     var dateObj = {};
    //     dateObj.start = year + '-' + month + '-' + day; // 开始时间
    //     var startMonthDay = new Date(year, month, 0).getDate();    //当前月的总天数
    //     if(month - 12 >= 0){ //如果是12月，年数往后推一年<br>　　　　
    //         dateObj.end = (year + 1) + '-01-' + day;
    //     }else{
    //         var endMonthDay = new Date(year, (parseInt(month) + 1), 0).getDate();
    //         if(startMonthDay < day){    //1个月后所在月的总天数小于现在的天日期
    //             if(day < endMonthDay){        //当前天日期小于当前月总天数
    //                 dateObj.end = year + '-' + (month + 1) + '-' + (startMonthDay - (endMonthDay - day));
    //             }else{
    //                 dateObj.end = year + '-' + (month + 1) + '-' + startMonthDay;
    //             }
    //         }else{
    //             dateObj.end = year + '-' + (month + 1) + '-' + day;
    //         }
    //     }
    //     return dateObj
    // }
    function recentMonth(){
        var end = new Date();
        var year = end.getFullYear();
        var month = end.getMonth() + 1;//0-11表示1-12月
        var day = end.getDate();
        var dateObj = {};
        dateObj.end = year + '-' + month + '-' + day;
        var endMonthDay = new Date(year, month, 0).getDate();    //当前月的总天数
        if(month - 1 <= 0){ //如果是1月，年数往前推一年<br>　　　　
            dateObj.start = (year - 1) + '-' + 12 + '-' + day;
        }else{
            var startMonthDay = new Date(year, (parseInt(month) - 1), 0).getDate();
            if(startMonthDay < day){    //1个月前所在月的总天数小于现在的天日期
                if(day < endMonthDay){        //当前天日期小于当前月总天数
                    dateObj.start = year + '-' + (month - 1) + '-' + (startMonthDay - (endMonthDay - day));
                }else{
                    dateObj.start = year + '-' + (month - 1) + '-' + startMonthDay;
                }
            }else{
                dateObj.start = year + '-' + (month - 1) + '-' + day;
            }
        }
        return dateObj
    }

    $("#lazadaRefundOrderSearchBtn").click(function(){
        let data = serializeObject($('#lazadaRefundOrderSearchForm')),orderTimeCnLeft,orderTimeCnRight;
        if(data.orderTimeCn){
             orderTimeCnLeft = data.orderTimeCn.split(" - ")[0]
             orderTimeCnRight = data.orderTimeCn.split(" - ")[1]
             data.orderTimeCnLeft = new Date(orderTimeCnLeft).getTime()
             data.orderTimeCnRight =new Date(orderTimeCnRight).getTime()
        }

        data[data.lazadaROSelectSSku] = data.lazadaROSelectValue

        table.render({
            elem: '#lazadaRefundOrderTable',
            method: 'get',
            url: '/lms/lazadaRefundOrder/searchRefundOrder',
            where: data,
            cols: [[ //表头
                { title: "订单北京时间",width:100,field:"orderTimeCn", templet: function(d){ return`${Format(d.orderTimeCn || "", 'yyyy-MM-dd')}`}},
                { title: "店铺单号",width:170,style:"vertical-align: top;",field:"", templet: function(d){ return`
                    <div class="lazadaTextLeft">单号:${d.platOrderId||''}</div>
                    <div class="lazadaTextLeft">子单号:${d.platOrderItemId||''}</div>
                `}},
                // { title: "普源信息",style:"vertical-align: top;",field:"mx", templet: function(d){ return`
                //     <div class="lazadaTextLeft">普源单号：${d.pid||''}</div> 
                //     <div class="lazadaTextLeft">跟踪号：${d.trackNo||''}</div>
                //     <div class="lazadaTextLeft">普源订单状态：${d.pyOrderStatus||''}</div>
                // `}},
                { title: "订单信息",style:"vertical-align: top;",field:"lms", templet: function(d){ return`
                    <div class="lazadaTextLeft">跟踪号：${d.trackNo||''}</div>
                    <div class="lazadaTextLeft">OA订单状态：${d.pyOrderStatus||''}</div>
                `}},
                { title: "店铺",style:"vertical-align: top;",field:"", templet: function(d){ return`
                    <div>${d.storeAcct||''}</div> 
                    <div>${d.salesperson||''}</div>
                `}},
                { title: "收件人",style:"vertical-align: top;",field:"shippingUsername"},
                { title: "订单金额（￥）",style:"vertical-align: top;",field:"platOrderAmtRmb"},
                { title: "Item",width:300,align:"left", templet: function(d){ return`
                    <div class="lazadaTextLeft">${d.title||''}</div> 
                    <div class="lazadaTextLeft">
                        <a class="itemId" target="_blank" href="${d.targetUrl||''}" style="color: #0095FE">${d.itemId||''}</a>
                        <span>${d.isSale == 0?"已下架":""}</span>
                    </div>
                    <div class="lazadaTextLeft" style="color: #999;">
                        ${d.primaryCategoryName||''}
                    </div>
                `}},
                { title: "店铺SKU",width:180,field:"", templet: function(d){ return`
                    <div class="lazadaTextLeft">店铺SKU：${d.storeSSku||''}</div>
                    <div class="lazadaTextLeft">属性：${d.attribute||''}</div>
                `}},
                { title: "商品SKU",style:"vertical-align: top;",field:"", templet: '#lazadaRefundOrderTableSku'},
                { title: "退回状态",style:"vertical-align: top;",field:"returnStatus"},
                { title: "退款发起人",style:"vertical-align: top;",field:"cancelReturnInitiator"},
                { title: "退款原因",style:"vertical-align: top;", templet: function(d){ return`
                    <div>${d.reason||""}</div>
                    <div>${d.reasonDetail||""}</div>
                 `}}
            ]],
            // page: true,
            // limits: [100, 200, 500],
            // limit: 100,
            id: "lazadaRefundOrderTable",
            page: {
                layout: ['prev', 'page', 'next'],
                groups: 5,
                prev: '<上一页',
                next: '下一页>',
                first: false, //显示首页
                last: false, //显示尾页
                limit: 100,
                limits: [100, 200, 500],
            },
            done: function(data){
                if (data.count>1000) {
                    $('#lazadaRefundOrder_tab li>span').text('>1000');
                }else {
                    $('#lazadaRefundOrder_tab li>span').text(data.count);
                }
                // 亿品修改，梦旋暂不修改
                // 3340 lazada-》客服-》退款订单，oa订单迁移
                // if(window.location.host.includes("mx")){
                //     $("#lazadaRefundOrderTable").next().find("[data-field=lms]").hide();
                //     $("#lazadaRefundOrderTable").next().find("[data-field=mx]").show();
                // }else{
                //     $("#lazadaRefundOrderTable").next().find("[data-field=lms]").show();
                //     $("#lazadaRefundOrderTable").next().find("[data-field=mx]").hide();
                // }
            }

        })
    })

    // 导出
    $("#lazadaRefundOrderExport").click(function(){
        var data = serializeObject($('#lazadaRefundOrderSearchForm'))
        if(!data.orderTimeCn){
            layer.alert("订单时间不能为空",{icon:2})
            return false;
        }
        let orderTimeCnLeft = data.orderTimeCn.split(" - ")[0],
            orderTimeCnRight = data.orderTimeCn.split(" - ")[1]

        data.orderTimeCnLeft = new Date(orderTimeCnLeft).getTime()
        data.orderTimeCnRight =new Date(orderTimeCnRight).getTime()
        data[data.lazadaROSelectSSku] = data.lazadaROSelectValue

        let urlArr = [ctx+`/lazadaRefundOrder/exportRufundOrder?deportId=${data.deportId||''}&salespersonId=${data.salespersonId||''}&storeAcctIds=${data.storeAcctIds||''}&platOrderIds=${data.platOrderIds||''}&storeSSkus=${data.storeSSkus||''}&prodSSkus=${data.prodSSkus||''}&shippingUsername=${data.shippingUsername||''}&orderTimeCnRight=${data.orderTimeCnRight||''}&orderTimeCnLeft=${data.orderTimeCnLeft||''}`];
        window.open(urlArr.join(''),'_blank');

        // // 时间必传
        // transBlob({
        //     url: ctx + "/lazadaRefundOrder/exportRufundOrder",
        //     formData: JSON.stringify(data),
        //     fileName: '',
        //     contentType: 'application/json'
        // }).then(function (result) {
        //     loading.hide();
        // }).catch(function (err) {
        //     layer.msg(err, {icon: 2});
        // });
     })
})