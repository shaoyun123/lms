/**亚马逊跟卖池子**/
layui.use(['admin', 'form', 'table', 'layer', 'element','laytpl', 'laypage','laydate','formSelects'], function() {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        element = layui.element,
        laydate = layui.laydate,
        admin = layui.admin,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        layer = layui.layer;

        form.render()

        var followSellPool = {
            initData:{
                batchopt:null,
                storeEnum:null,
                planEnum:null,
                planenableEnum:null,
                siteEnum:null,
                creator:null
            },
            //初始化项目函数
            init:function(){
                var _this = this
                render_hp_orgs_users("#AmazonFollowSellPoolForm");
                followSellPoolGetSite(function(returnData){
                    _this.initData.siteEnum = returnData.data
                    appendSelect($('#AmazonFollowSellPoolForm').find('select[name="salesSite"]'),returnData.data,'code','name')
                })
                followSellAmazonstorelistEnum(function(returnData){
                    _this.initData.storeEnum = returnData.data
                })
                getPlanList({status:""},function(returnData){
                    appendSelect($('#AmazonFollowSellPoolForm').find('select[name="planId"]'),returnData.data,'id','planName')
                    var selData=returnData.data
                    $('#AmazonFollowSellPoolForm').find('select[name="planId"]').empty();
                    var option = '<option value="">请选择</option><option value="-1">无计划</option>'
                    for (var i in selData) {
                        option += '<option value="' + selData[i].id+'">' + selData[i].label  + '</option>'
                    }
                    $('#AmazonFollowSellPoolForm').find('select[name="planId"]').append(option)
                    form.render()
                })
                getPlanList({status:"true"},function(returnData){
                    _this.initData.planenableEnum = returnData.data
                })
                followSellPoolCreator(function(returnData){
                    _this.initData.creator = returnData.data
                    appendSelect($('#followSellPoll_person_search_select'), returnData.data, 'id', 'userName');
                    formSelects.render('followSellPoll_person_search_select');
                })
                batchopt = new dropButton('followSellPoolbatchopt');
                laydate.render({
                    elem: '#AmazonFollowSellPoolForm input[name="time"]', //渲染时间
                    range: true
                })
                _this.searcheTrigger()
                _this.submitData()
                _this.listenOnbatchOption()
                _this.listenOnAllchecked()
                _this.setGlobalProfit()
                form.render()
            },
            //批量操作功能
            listenOnbatchOption:function(){
                var _this = this
                batchopt.choose(function(event){
                    var sIdList = [],pIdList=[]
                    pIdList = (table.checkStatus('followSellPoolTable').data||[]).map(function(item){
                        return item.id
                    })
                    $('.followSellPoolDetailtable').find('td[data-field="scheckRow"]').find('.layui-form-checked').each(function(index,item){
                        sIdList.push($(item).prev().val())
                    })
                    if(event=="matchStore"){
                        if(pIdList.length>0){
                            _this.batchMatchStore(pIdList)
                        }else{
                            layer.msg('请勾选要分配店铺的数据')
                        }
                    }else if(event=="cancelMatchStore"){
                        if(pIdList.length>0){
                            layer.confirm('确定批量取消店铺分配?', {icon: 3, title:'提示'}, function(index){
                                cancelVatchMatchStore({pIdList},function(returnData){
                                    layer.msg(returnData.msg||'取消分配成功')
                                    layer.close(index)
                                    $('#AmazonFollowSellPoolSearch').click()
                                })
                            });
                        }else{
                            layer.msg('请勾选要取消分配店铺的数据')
                        }
                    }else if(event=="FollowSell"){
                        if(sIdList.length>0){
                            layer.confirm('确定批量跟卖?', {icon: 3, title:'提示'}, function(index){
                                batchFollowSell({sIdList},function(returnData){
                                    layer.msg(returnData.msg||'已提交跟卖，正在等待结果',{icon:3})
                                    //_this.queryResult({sIdList:sIdList,ayncOpType:'0'})
                                    layer.close(index)
                                    // $('#AmazonFollowSellPoolSearch').click()

                                })
                            });
                        }else{
                            layer.msg('请勾选要批量跟卖的子数据')
                        }
                    }else if(event=="cancelFollowSell"){
                        if(sIdList.length>0){
                            layer.confirm('确定批量取消跟卖?', {icon: 3, title:'提示'}, function(index){
                                concelBatchFollowSell({sIdList},function(returnData){
                                    layer.msg(returnData.msg||'批量取消跟卖执行中')
                                    layer.close(index)
                                    $('#AmazonFollowSellPoolSearch').click()
                                })
                            });
                        }else{
                            layer.msg('请勾选要批量取消跟卖的子数据')
                        }
                    }else if(event=="updateASIN"){
                        if(sIdList.length>0){
                            layer.confirm('确定批量更新?', {icon: 3, title:'提示'}, function(index){
                                batchUpdate({sIdList},function(returnData){
                                    layer.msg(returnData.msg||'批量更新执行中')
                                    layer.close(index)
                                    $('#AmazonFollowSellPoolSearch').click()
                                })
                            });
                        }else{
                            layer.msg('请勾选要批量更新的子数据')
                        }
                    }else if(event=="0stockfollow"){
                        if(sIdList.length>0){
                            layer.confirm('确定批量0库存跟卖?', {icon: 3, title:'提示'}, function(index){
                                batch0stockFollow({sIdList},function(returnData){
                                    layer.msg(returnData.msg||'批量0库存跟卖执行中')
                                    layer.close(index)
                                    $('#AmazonFollowSellPoolSearch').click()
                                })
                            });
                        }else{
                            layer.msg('请勾选要批量0库存跟卖的子数据')
                        }
                    }else if(event=="setProfit"){
                        if(sIdList.length>0){
                            _this.setGrossProfit('batch',sIdList)
                        }else{
                            layer.msg('请勾选要批量设置毛利的子数据')
                        }
                    }else if(event=="setPlan"){
                        if(pIdList.length>0){
                            _this.setPlan(pIdList)
                        }else{
                            layer.msg('请勾选要批量设置计划的数据')
                        }
                    }else if(event=="cancelPlan"){
                        if(pIdList.length>0){
                            batchScancelPlan({pIdList:pIdList},function(returnData){
                                layer.msg(returnData.msg||'批量取消计划成功')
                                $('#AmazonFollowSellPoolSearch').click()
                            })
                        }else{
                            layer.msg('请勾选要批取消计划的数据')
                        }
                    }else if(event=="batchAudit"){ //批量审核子asin
                        if(sIdList.length>0){
                            followSellPool_batchAudit(sIdList);
                        }else{
                            layer.msg('请勾选要批量审核的子asin数据',{icon:0});
                        }
                    }
                })
            },
            //批量分配店铺
            batchMatchStore:function(data){
                var _this = this
                layer.open({
                    type: 1,
                    title: '批量分配',
                    btn: ['确定分配','关闭'],
                    area:['30%','40%'],
                    content: $('#followSellPoolMatchStorePop').html(),
                    success: function(layero, index) {
                        appendSelect($('#followSellPoolMatchStoreForm').find('select[name="storeAcctId"]'),_this.initData.storeEnum,'id','storeAcct')
                        form.render()
                    },
                    yes: function(index, layero) {
                        form.on('submit(followSellPoolMatchStoreSubmit)',function(obj){
                            var storeAcctId = obj.field.storeAcctId
                            batchMatchStore({pIdList:data,storeAcctId:storeAcctId},function(returnData){
                                layer.msg(returnData.msg||'分配成功')
                                layer.close(index)
                                $('#AmazonFollowSellPoolSearch').click()
                            })
                        })
                        $('#followSellPoolMatchStoreSubmit').click()
                    }
                })
            },
            //监听全选功能
            listenOnAllchecked:function(){
                form.on('checkbox(allSChecked)',function(obj){
                    if(obj.elem.checked){
                        $('.followSellPoolDetailtable').find('input[type="checkbox"]').each(function(index,item){
                            $(item).prop('checked', true);
                        })
                    }else{
                        $('.followSellPoolDetailtable').find('input[type="checkbox"]').each(function(index,item){
                            $(item).prop('checked', false);
                        })
                    }
                    form.render('checkbox');
                })
            },
            //异步选中:选中父,子全被选中
            asynChecked:function(){
                table.on('checkbox(followSellPoolTable)', function(obj){
                    if(obj.type=="all"){
                        if(obj.checked){
                            $('.followSellPoolDetailtable').find('input[type="checkbox"]').each(function(index,item){
                                $(item).prop('checked', true);
                            })
                        }else{
                            $('.followSellPoolDetailtable').find('input[type="checkbox"]').each(function(index,item){
                                $(item).prop('checked', false);
                            })
                        }
                    }else{
                        var index = obj.data.LAY_TABLE_INDEX
                        var tr = $('#followSellPoolTable').next().find(`tr[data-index="${index}"]`)
                        if(obj.checked){
                            tr.find('.followSellPoolDetailtable').find('input[type="checkbox"]').each(function(index,item){
                                $(item).prop('checked', true);
                            })
                        }else{
                            tr.find('.followSellPoolDetailtable').find('input[type="checkbox"]').each(function(index,item){
                                $(item).prop('checked', false);
                            })
                        }
                    }
                    form.render('checkbox');
                  });
            },
            //渲染表格
            followSellTable:function(data){
                var _this = this
                table.render({
                    elem:'#followSellPoolTable',
                    data:data,
                    cols: [
                        [
                            { checkbox: true, width: 30 },
                            { title: "图片",width: 80 ,templet:'#followSellPoolimgtpl',field:"smallImg"},
                            { title: "父ASIN",width: 160, templet:'#followSellPoolparentAsintpl'},
                            { title: "品牌",width: 120,templet: "#followSellPoolBrandtpl"},
                            { title: "排名",width: 120, field: "rateLev",templet:'#followSellPoolRanktpl'},
                            { title: "计划名称", width: 120,field: "planName"},
                            { title: $('#followSellPool_table_detailhd').html(), field:"subList",templet:'#followSellPoolDetail'},
                            { title: '操作', toolbar: "#followSellPooltoolTpl",width:80}
                        ]
                    ],
                    page: false,
                    limit:500,
                    id:'followSellPoolTable',
                    done: function(res) {
                        $('.followSellPoll_voteTotalTimes').on('mouseenter', function(){
                            var that = this;
                            var voteTotalTimes="品牌投诉次数 ： "+$(this).attr("voteTotalTimes");
                            layer.tips(voteTotalTimes, that, {tips: [1, '#333'], time: 0}); //在元素的事件回调体中，follow直接赋予this即可
                        }).on('mouseleave', function(){
                            layer.closeAll("tips");
                        });
                        _this.listenOnTool()
                        _this.stoolListen()
                        _this.getProdDetail()
                        _this.asynChecked()
                        imageLazyload()
                        $('.layui-table-header').removeClass('toFixedContain')
                    }
                })
            },
            //分页
            followSellPoolPage:function(data,count){
                laypage.render({
                    elem: 'followSellPoolPage',
                    curr: data.page,
                    limit: data.limit,
                    limits: [100, 200, 500],
                    layout: ['prev', 'page', 'next', 'count','limit'],
                    count: count,
                    jump: function(obj, first) {
                        $('#AmazonFollowSellPoolForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                        $('#AmazonFollowSellPoolForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                        //首次不执行
                        if (!first) {
                            data.page = obj.curr;
                            data.limit = obj.limit;
                            $('#AmazonFollowSellPoolSearch').click()
                        }

                    }
                });
            },
            //切换tab页签
            searcheTrigger:function(){
                element.on('tab(followSellPoolTab)', function(data) {
                    var status = data.elem.context.dataset.index
                    var $matchStore = $('li[data-event=matchStore]');//分配店铺
                    var $cancelMatchStore = $('li[data-event=cancelMatchStore]');//取消分配店铺
                    var $FollowSell = $('li[data-event=FollowSell]');//跟卖
                    var $cancelFollowSell = $('li[data-event=cancelFollowSell]');//取消跟卖
                    var $updateASIN = $('li[data-event=updateASIN]');//更新
                    var $setProfit =  $('li[data-event=setProfit]');//设置毛利率
                    var $0stockfollow = $('li[data-event=0stockfollow]'); //零库存跟卖
                    var $setPlan =  $('li[data-event=setPlan]');//设置计划
                    var $cancelPlan = $('li[data-event=cancelPlan]');//取消计划
                    var $batchAudit = $('li[data-event=batchAudit]');//批量审核
                    if(status === '0'){ //未分配
                        $matchStore.removeClass('disN');
                        $cancelMatchStore.removeClass('disN');
                        $updateASIN.removeClass('disN');
                        $setProfit.removeClass('disN');
                        $FollowSell.addClass('disN');
                        $cancelFollowSell.addClass('disN');
                        $0stockfollow.addClass('disN');
                        $setPlan.addClass('disN');
                        $cancelPlan.addClass('disN');
                        $batchAudit.addClass('disN');
                    }else if(status==1){
                        $matchStore.removeClass('disN');
                        $cancelMatchStore.removeClass('disN');
                        $updateASIN.removeClass('disN');
                        $setProfit.removeClass('disN');
                        $FollowSell.addClass('disN');
                        $cancelFollowSell.addClass('disN');
                        $0stockfollow.removeClass('disN');
                        $setPlan.addClass('disN');
                        $cancelPlan.addClass('disN');
                        $batchAudit.removeClass('disN');
                    }else if(status ==2){
                        $matchStore.removeClass('disN');
                        $cancelMatchStore.addClass('disN');
                        $updateASIN.removeClass('disN');
                        $setProfit.removeClass('disN');
                        $FollowSell.removeClass('disN');
                        $cancelFollowSell.removeClass('disN');
                        $0stockfollow.addClass('disN');
                        $setPlan.removeClass('disN');
                        $cancelPlan.removeClass('disN');
                        $batchAudit.addClass('disN');
                    }else if(status ==3){
                        $matchStore.removeClass('disN');
                        $cancelMatchStore.addClass('disN');
                        $updateASIN.removeClass('disN');
                        $setProfit.removeClass('disN');
                        $FollowSell.removeClass('disN');
                        $cancelFollowSell.removeClass('disN');
                        $0stockfollow.addClass('disN');
                        $setPlan.removeClass('disN');
                        $cancelPlan.removeClass('disN');
                        $batchAudit.addClass('disN');
                    }else if(status ==4){
                        $matchStore.addClass('disN');
                        $cancelMatchStore.addClass('disN');
                        $updateASIN.removeClass('disN');
                        $setProfit.addClass('disN');
                        $FollowSell.addClass('disN');
                        $cancelFollowSell.addClass('disN');
                        $0stockfollow.addClass('disN');
                        $setPlan.addClass('disN');
                        $cancelPlan.addClass('disN');
                        $batchAudit.addClass('disN');
                    }else if(status ==5){
                        $matchStore.addClass('disN');
                        $cancelMatchStore.addClass('disN');
                        $updateASIN.removeClass('disN');
                        $setProfit.removeClass('disN');
                        $FollowSell.removeClass('disN');
                        $cancelFollowSell.addClass('disN');
                        $0stockfollow.addClass('disN');
                        $setPlan.removeClass('disN');
                        $cancelPlan.removeClass('disN');
                        $batchAudit.removeClass('disN');
                    }else{
                        $matchStore.addClass('disN');
                        $cancelMatchStore.addClass('disN');
                        $updateASIN.removeClass('disN');
                        $setProfit.addClass('disN');
                        $FollowSell.addClass('disN');
                        $cancelFollowSell.addClass('disN');
                        $0stockfollow.addClass('disN');
                        $setPlan.addClass('disN');
                        $cancelPlan.addClass('disN');
                        $batchAudit.addClass('disN');
                    }
                    $('#AmazonFollowSellPoolForm input[name="tableIndex"]').val(status)
                    $('#AmazonFollowSellPoolSearch').click()
                });
            },
            //提交表单数据
            submitData:function(){
                var _this = this
                form.on('submit(AmazonFollowSellPoolSearch)',function(data){
                    var data = data.field//表单数据
                    data=getFollowSellPollSearchData(data);
                    getFollowSellPoolList(data,function(returnData){
                        _this.followSellTable(returnData.data.listInfo);
                        _this.followSellPoolPage(data,returnData.count);
                        $('#followSellPoolTab li').eq(0).find('span').text(returnData.data.countInfo[0]);
                        $('#followSellPoolTab li').eq(1).find('span').text(returnData.data.countInfo[1]);
                        $('#followSellPoolTab li').eq(2).find('span').text(returnData.data.countInfo[2]);
                        $('#followSellPoolTab li').eq(3).find('span').text(returnData.data.countInfo[3]);
                        $('#followSellPoolTab li').eq(4).find('span').text(returnData.data.countInfo[4]);
                        $('#followSellPoolTab li').eq(5).find('span').text(returnData.data.countInfo[5]);
                        $('#followSellPoolTab li').eq(6).find('span').text(returnData.data.countInfo[6]);
                    })
                })
            },
            //监听操作栏
            listenOnTool:function(){
                var _this = this
                table.on('tool(followSellPoolTable)',function(obj){
                    var event = obj.event
                    console.log(event)
                    var data = obj.data
                    if(event=="followSellPoolparentLog"){
                        _this.followLog({salesSite:data.salesSite,parentAsin:data.parentAsin})
                    }
                })
            },
            //设置毛利率弹框
            setGrossProfit:function(type,data){
                console.log(data)
                var _this = this
                layer.open({
                    type: 1,
                    title: '设置毛利率',
                    btn: ['保存','关闭'],
                    area:['30%','40%'],
                    content: $('#followSellPoolsetProfitPop').html(),
                    success: function(layero, index) {
                        if(type=='batch'||type=='global'){
                        getFlobalGrossprofit(function(returnData){
                            var data = returnData.data
                            var subProdMinGross = data.minGross,
                            subProdMaxGross = data.maxGross,
                            subProdStandardGross = data.standardGross
                            form.val('followSellPoolsetProfitForm',{subProdMinGross,subProdMaxGross,subProdStandardGross})
                        })
                        }else if(type=='single'){
                            getSingleGrossprofit(data,function(returnData){
                                var data = returnData.data
                                var subProdMinGross = data.minGross,
                                subProdMaxGross = data.maxGross,
                                subProdStandardGross = data.standardGross
                                form.val('followSellPoolsetProfitForm',{subProdMinGross,subProdMaxGross,subProdStandardGross})
                            })
                        }
                        form.render()
                    },
                    yes: function(index, layero) {
                        if(type=='batch'||type=='single'){
                            form.on('submit(followSellPoolsetProfitSubmit)',function(obj){
                                var submitData = obj.field
                                batchsetProfit({sIdList: data,
                                    subProdMinGross: submitData.subProdMinGross,
                                    subProdMaxGross: submitData.subProdMaxGross,
                                    subProdStandardGross:submitData.subProdStandardGross}
                                ,function(returnData){
                                    layer.msg(returnData.msg||'设置毛利成功')
                                    layer.close(index)
                                    $('#AmazonFollowSellPoolSearch').click()
                                })
                            })
                            $('#followSellPoolsetProfitSubmit').click()
                        }else if(type=='global'){
                            form.on('submit(followSellPoolsetProfitSubmit)',function(obj){
                                var submitData = obj.field
                                setGlobalGrossprofit({
                                    minGross: submitData.subProdMinGross,
                                    maxGross: submitData.subProdMaxGross,
                                    standardGross:submitData.subProdStandardGross}
                                ,function(returnData){
                                    if(returnData.code=='0000'){
                                        layer.msg(returnData.msg,{icon:1})
                                    }else{
                                        layer.msg(returnData.msg,{icon:2})
                                    }

                                    layer.close(index)
                                })
                            })
                            $('#followSellPoolsetProfitSubmit').click()
                        }
                    }
                })
            },
            evaluateGrossProfit:function(data){
                console.log(data)
                var _this = this
                layer.open({
                    type: 1,
                    title: '设置毛利率',
                    btn: ['保存','关闭'],
                    area:['30%','40%'],
                    content: $('#followSellPoolevaluatPop').html(),
                    success: function(layero, index) {
                        $(layero).find('#cartPrice').html(`${data.cartPrice}(${data.currency})`)
                        $(layero).find('input[name="id"]').val(data.id)
                        form.on('submit(followSellPoolevaluat)',function(obj){
                            var submitData = obj.field
                            getSingleGrossprofit(submitData,function(returnData){
                                if(returnData.data){
                                    for(var i in returnData.data){
                                        $(layero).find('#'+i).text(returnData.data[i])
                                    }
                                }
                            })
                        })
                        form.render()
                    },
                    yes: function(index, layero) {
                        form.on('submit(followSellPoolevaluatSubmit)',function(obj){
                            var submitData = obj.field
                            setSingleGrossprofit(submitData
                            ,function(returnData){
                                layer.msg(returnData.msg||'设置毛利成功')
                                layer.close(index)
                                $('#AmazonFollowSellPoolSearch').click()
                            })
                        })
                        $('#followSellPoolevaluatSubmit').click()
                    }
                })
            },
            setGlobalProfit:function(){
                var _this = this
                $('#LAY-AmazonFollowSellPool #setGlobalProfit').click(function(){
                    _this.setGrossProfit('global')
                })
            },
            followLog:function(data){
                var showCols=[[ //取消跟卖计划
                    { title: "开始时间", field: "opResult", templet: "<div>{{Format(d.opTime,'yyyy-MM-dd hh:mm')}}</div>" },
                    { title: "结束时间", field: "taskEndTime", templet: "<div>{{Format(d.taskEndTime,'yyyy-MM-dd hh:mm')}}</div>" },
                    { title:"店铺SKU",field:"sellerSku"},
                    { title:"操作人",field:"opUserName"},
                    { title: "动作", field: "opType"},
                    { title: "结果", field: "opResultDesc" },
                    { title: "计划/页面", field: "opPlanName" },
                    { title: "店铺", field: "storeAcct" },
                    { title: "站点", field: "salesSite" },
                    { title: "价格", field: "price" },
                    { title: "最小价格", field: "minPrice" },
                    { title: "最大价格", field: "maxPrice" },
                ]]
                if(data.parentAsin){
                    showCols=[[ //取消跟卖计划
                        { title: "时间", field: "opResult", templet: "<div>{{Format(d.opTime,'yyyy-MM-dd hh:mm')}}</div>" },
                        { title: "操作人",field:"opUserName"},
                        { title: "计划", field: "opPlanName" },
                        { title: "动作", field: "opType"},
                        { title: "结果", field: "opResultDesc" },
                        { title: "店铺", field: "storeAcct" },
                        { title: "站点", field: "salesSite" },
                    ]]
                }

                const ASIN = data.parentAsin||data.asin
                layer.open({
                    type: 1,
                    title: ASIN + '日志',
                    btn: ['关闭'],
                    area: ['100%', '100%'],
                    content: $('#followSellPoolLogPop').html(),
                    success: function(index, layero) {
                        getFollowLog(data,function(returnData){
                            table.render({
                                elem: '#followSellPoolLogTable',
                                data:returnData.data,
                                cols: showCols,
                                page: false,
                                limit:500,
                                id: 'followSellPoolLogTable',
                                created:function(res){
                                },
                                done: function(res) {
                                }
                            })
                        })
                    }
                })
            },
            stoolListen:function(){
                var _this = this
                $('.followSellPoolDetailtable').find('td[data-field="sTool"]').find('button[data-event="log"]').click(function(){
                    var asin = $(this).attr('data-asin')
                    var salesSite = $(this).attr('data-site')
                    _this.followLog({salesSite:salesSite,asin:asin})
                })
                $('.followSellPoolDetailtable').find('td[data-field="sTool"]').find('button[data-event="set"]').click(function(){
                    var id = $(this).attr('data-id')
                    var cartPrice = $(this).attr('data-cartPrice')
                    var currency = $(this).attr('data-currency')
                    _this.evaluateGrossProfit({id:id,cartPrice:cartPrice,currency:currency})
                })
                $('.followSellPoolDetailtable').find('td[data-field="sTool"]').find('button[data-event="complaint"]').click(function(){
                    var salesSite = $(this).attr('data-salesSite')
                    var brand = $(this).attr('data-brand')
                    var asin = $(this).attr('data-asin')
                    var storeAcctId = $(this).attr('data-storeAcctId')
                    _this.modifyComplaintPop({salesSite,brand,asin,storeAcctId})
                })
            },
            //设置计划
            setPlan:function(data){
                var _this = this
                layer.open({
                    type: 1,
                    title: '设置计划',
                    btn: ['设置','关闭'],
                    area:['30%','40%'],
                    content: $('#followSellPoolsetPlanPop').html(),
                    success: function(layero, index) {
                        appendSelect($('#followSellPoolsetPlanForm').find('select[name="planId"]'),_this.initData.planenableEnum,'id','planName')
                        form.render()
                    },
                    yes: function(index, layero) {
                        form.on('submit(followSellPoolsetPlanSubmit)',function(obj){
                            var planId = obj.field.planId
                            batchSetPlan({pIdList:data,planId:planId},function(returnData){
                                layer.msg(returnData.msg||'设置计划成功')
                                layer.close(index)
                                $('#AmazonFollowSellPoolSearch').click()
                            })
                        })
                        $('#followSellPoolsetPlanSubmit').click()
                    }
                })
            },
            queryResult:function(data){
                if(!timer){
                var timer = setInterval(function(){
                    asynResult(data,function(returnData){
                        clearTimeout(timer)
                        console.log(returnData)
                    })
                },3000)
            }
            },
            getProdDetail:function(){
                $('.followSellPoolDetailtable').find($('td[data-field="prodSSku"]')).click(function(){
                    var id = $(this).find('div').attr('data-id')
                    if (!isNaN(id)) {
                        layui.admin.publicDetail(
                            function() { renderProduct(id) },
                            function(layero){
                                //一键下载图片
                                var downLoadImgBtn = '<button id="downLoadImgBtn" class="layui-btn layui-btn-primary layui-btn-sm"  style="float: left;">图片下载</button>'
                                $(layero).find('.layui-layer-btn a:first').before(downLoadImgBtn);
                                $('#downLoadImgBtn').click(function(){
                                    var pSku = $('.unEditProdTplForm [name=pSku]').val()
                                    console.log(pSku)
                                    $(layero).find('img').each(function(index,item){
                                        downLoadImg(item, pSku)
                                    })
                                })
                            }
                        )
                    }
                })
            },
            modifyComplaintPop:function(data){
                var _this = this
                layer.open({
                    type: 1,
                    title: "新增投诉",
                    btn: ['提交','关闭'],
                    area:['50%','50%'],
                    content: $('#followpooladdComplaint_modify').html(),
                    success: function(layero, index) {
                        appendSelect($('#followpooladdComplaintForm').find('select[name="storeAcctId"]'),_this.initData.storeEnum,'id','storeAcct')
                        appendSelect($('#followpooladdComplaintForm').find('select[name="salesSite"]'),_this.initData.siteEnum,'code','name')
                        form.val('followpooladdComplaintForm',data)
                        form.render()
                    },
                    yes: function(index, layero) {
                        form.on('submit(followpooladdComplaintSubmit)',function(data){
                            saveAmazonComplaint(data.field,function(returnData){
                                layer.msg(returnData.msg||'保存成功',{icon:1})
                                layer.close(index)
                                $('#AmazonComplaintSearch').click()
                            })
                        })
                        $('#followpooladdComplaintSubmit').click()
                    }
                })
            },
        }

        followSellPool.init();

    /**
     * 获取表单搜索参数
     * @param data
     * @returns {*}
     */
    function  getFollowSellPollSearchData(data) {
        data[data.followSellPoll_person_search_type] = data.followSellPoll_person_search_select != "" ? data.followSellPoll_person_search_select.split(',') : [];
        data[data.skuType] = data.skuValue;
        data[data.fsSellFailType] = data.fsSellFailVal;
        data[data.cateType + 'CateRankStart'] = data.CateRankStart;
        data[data.cateType + 'CateRankEnd'] = data.CateRankEnd;
        if (data.time) {
            data.startTime = Date.parse(data.time.split(" - ")[0].replace("-", "/") + " 00:00:00");
            data.endTime = Date.parse(data.time.split(" - ")[1].replace("-", "/") + " 23:59:59");
        }
        return data;
    }

    // 导出跟卖池
    $("#followSellPool_exportBtn").click(function () {
        var selectedData = table.checkStatus('followSellAudit_table').data;
        var idList = [];
        for (var i = 0; i < selectedData.length; ++i) {
            idList.push(selectedData[i].id)
        }
        var data = serializeObject($('#AmazonFollowSellPoolForm'));
        data=getFollowSellPollSearchData(data);
        data.idList = idList.join(',')
        var confirmindex = layer.confirm('确认导出当前搜索条件下的跟卖池数据？', {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/amazonFsParentProduct/exportAmazonFsParentProductAuditInfo.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    });

        //页面请求
    // 站点枚举数据
    function followSellPoolGetSite(func){
        initAjax('/enum/getSiteEnum.html?platCode=amazon', 'post', {}, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //获取跟卖池列表
    function getFollowSellPoolList(data,func){
        initAjax('/amazonFsParentProduct/queryAmazonFsParentProductPage.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //获取店铺列表
    function followSellAmazonstorelistEnum(func){
        initAjax('/sys/liststore.html', 'post', {roleNames:'amazon专员',platCode:'amazon',autoFollowSell:true}, function(returnData) {
            if (func) {
                func(returnData)
            }
        },'application/x-www-form-urlencoded')
    }

    //批量分配店铺
    function batchMatchStore(data,func){
        initAjax('/amazonFsParentProduct/divideStoreInOneStore.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //批量取消分配店铺
    function cancelVatchMatchStore(data,func){
        initAjax('/amazonFsParentProduct/cancleDivideStore.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //批量跟卖
    function batchFollowSell(data,func){
        initAjax('/amazonFsParentProduct/fsStartNow.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //批量取消跟卖
    function concelBatchFollowSell(data,func){
        initAjax('/amazonFsParentProduct/fsStopNow.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }
    //批量更新
    function batchUpdate(data,func){
        initAjax('/amazonFsParentProduct/updateAsinInfo.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //批量更新
    function batch0stockFollow(data,func){
        initAjax('/amazonFsParentProduct/zeroFsStartNow.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }
    //批量设置毛利率
    function batchsetProfit(data,func){
        initAjax('/amazonFsParentProduct/setProdGross.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //获取全局毛利率
    function getFlobalGrossprofit(func){
        initAjax('/amazonFsParentProduct/getGlobalPriceGross.html', 'post', {}, function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //设置全局毛利率
    function setGlobalGrossprofit(data,func){
        initAjax('/amazonFsParentProduct/setGlobalPriceGross.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //设获取日志
    function getFollowLog(data,func){
        initAjax('/amazonFsParentProduct/listLog.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }
    //设置单个毛利率
    function setSingleGrossprofit(data,func){
        initAjax('/amazonFsParentProduct/calculateProdGrossAndSet.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //获取单个毛利率
    function getSingleGrossprofit(data,func){
        initAjax('/amazonFsParentProduct/calculateProdGross.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }
    //获取计划列表
    function getPlanList(data,func){
        initAjax('/amazonFsPlan/listAll.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //批量设置计划
    function batchSetPlan(data,func){
        initAjax('/amazonFsParentProduct/dividePlan.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //批量取消计划
    function batchScancelPlan(data,func){
        initAjax('/amazonFsParentProduct/canclePlan.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }
    /**跟卖池-批量审核子asin**/
    function followSellPool_batchAudit(idList){
            layer.open({
                type: 1,
                title: '审核商品',
                btn: ['保存','关闭'],
                area:['30%','40%'],
                content: $('#followSellPoll_auditProduct').html(),
                success: function(layero, index) {
                    form.render("radio");
                },
                yes: function(index, layero) {
                    form.on('submit(followSellPoll_auditSubmit)',function(obj){
                        var submitdata = obj.field//表单数据
                        var auditData={idList:idList,auditStatus:submitdata.auditStatus,auditRemark:submitdata.auditRemark};
                        initAjax('/amazonFsSubProduct/auditList.html', 'post', JSON.stringify(auditData), function(returnData) {
                            layer.msg(returnData.msg||"已提交审核");
                            $('#AmazonFollowSellPoolSearch').click();//重新检索跟卖池数据
                            layer.close(index);
                        });
                    });
                    $('#followSellPoll_auditSubmit').click();
                }
            });
    }

    //保存修改数据
    function saveAmazonComplaint(data,func){
        initAjax('/amazonFsBrandComplaint/saveOrEdit.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
                }
        })
    }

    //获取跟卖异步结果
    function asynResult(data,func){
        initAjax('/amazonFsParentProduct/dividePlan.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //开发专员枚举数据
    function followSellPoolCreator(func){
        initAjax('/sys/listAllUser.html', 'POST', {}, function(returnData) {
            if(func){
                func(returnData)
            }
    }, 'application/x-www-form-urlencoded');
    }

    //填充下拉框
    function appendSelect(aDom, data, code, label, attachment) {
        aDom.empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                    data[i].code = data[i][code] || data[i].code
                data[i].label = data[i][label] || data[i].label;
            }
            option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        aDom.append(option)
        form.render()
    }

    function initAjax(url, method, data, func, contentType) { //初始化ajax请求
        loading.show()
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
        })
    }

    UnifiedFixedFn('followSellPoolCard');

});