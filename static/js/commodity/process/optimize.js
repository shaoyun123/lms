/**
 * time: 2018/02/08
 */
layui.use(["admin", "form", "table", "layer",  "laydate", "element"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.laydate,
        element = layui.element,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    listEnableSysUser();//获取所有在职人员
    getMsgProdOptimizationCount("");//获取统计数据
    initOptimizationPlatList("product_optimize_platList_sel");//初始化需求平台
    initOptimizationOptimReason("product_optimize_optimReason");//优化方向
    var optimReasonObj={};//名称id和名称对象,预先加载
    var currentUserId="";
    var currentHasAllDeal="0";//当前点击的记录的销售处理完毕状态
    var currentProcStatus="";//当前点击的记录的优化处理状态
    var currentCanModitityProcStatus=1;//当前点击记录是否无销售处理
    var currentDevNote="";
    //发起时间渲染
    laydate.render({
        elem: '#product_optimize_timeCycle',
        range: true
    })
    /**
     * 赋值默认审核状态为未审核
     */
    var currentOptimStatus = "1";//初始化处理状态为待处理

    // 获取tab统计数据
    function getMsgProdOptimizationCount(){
        $.ajax({
            url: ctx + "/msgProdOptimization/getMsgProdOptimizationCount.html",
            type: "post",
            dataType: "json",
            data: getOptimizeSerachData(),
            success: function (returnData) {
                if (returnData.code == "0000") {
                    if (returnData.data != null && returnData.data != "") {
                        $("#product_optimize_onDeal").text(returnData.data.dealingSum);
                        $("#product_optimize_dealSuccess").text(returnData.data.successSum);
                        $("#product_optimize_dealFail").text(returnData.data.failSum);
                        $("#product_optimize_dealAll").text(returnData.data.allSum);
                    } else {
                        $("#product_optimize_onDeal").text(0);
                        $("#product_optimize_dealSuccess").text(0);
                        $("#product_optimize_dealFail").text(0);
                        $("#product_optimize_dealAll").text(0);
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
        });
    }

    //表格渲染结果，展示已知数据
    table.render({
        elem: "#product_optimize_dataTable",
        method: "post",
        url: ctx + "/msgProdOptimization/getMsgProdOptimizations.html",
        cols: [
            [
                //标题栏
                {field: "imgUri", title: "图片", templet: "#optimizeImgTpl",width:70},
                {field: "cnTitle", title: "商品",templet: "#product_optimize_product_tpl"},
                {field: "seller", title: "需求方",templet: "#product_optimize_seller_tpl"},
                {field: "optimReason", title: "优化方向",templet: function(d){
                        return getOptimReasonName(d.optimReason);
                    }},
                {field: "refLink", title: "链接" , templet: "#product_optimize_refLink_tpl"},
                {field: "sellerNote", title: "需求备注", align:"left", templet: "#product_optimize_sellerNote_tpl"},
                {field: "devNote", title: "处理备注",templet: "#product_optimize_devNote_tpl"},
                {field:"optimizeDeal",unresize:true,width:470,title:"<div style='width:80px;float: left;'>平台</div> <div style='width:80px;float: left;'>处理状态</div>" +
                    " <div style='width:80px;float: left;'>有无差价</div> <div style='width:100px;float: left;'>优化前15天销量</div>" +
                    " <div style='width:120px;float: left;'>优化后15天销量</div> ",templet:"#product_optimize_optimizeDeal_tpl"},
                {field: "createTime", title: "时间",width:180, templet: "#optimizeTimeTpl"},
                {title: '操作', align:"left",toolbar: '#prodOptimizeTableBar'}      //绑定工具条
            ],
        ],
        done:function(){
            //图片懒加载
            imageLazyload();
            $('.product_optimize_note_tip').on('mouseenter', function(){
                var that = this;
                var tips=$(this).attr("sellerNote");
                if(tips){
                    layer.tips($(this).attr("sellerNote"), that,{tips:[1,'#333'],time: 0}); //在元素的事件回调体中，follow直接赋予this即可
                }
            }).on('mouseleave', function(){
                layer.closeAll("tips");
            });
            $('.product_optimize_nodealperson_tip').on('mouseenter', function(){
                var that = this;
                var tips=$(this).attr("tips");
                if(tips){
                    tips="以下人员未处理：</br><div style='word-wrap:break-word;'>"+tips+"</div>";
                    layer.tips(tips, that,{tips:[1,'#333'],time: 0}); //在元素的事件回调体中，follow直接赋予this即可
                }
            }).on('mouseleave', function(){
                layer.closeAll("tips");
            });
            $("#product_optimize_optimizeDeal_tpl_table .product_optimize_palt_batch_deal").click(function(){//平台全部完成，防止离职人员无法点击
                var platCode=$(this).attr("platCode");
                var rid=$(this).attr("rid");
                var pstatus=$(this).attr("pstatus");//优化处理状态
                var tstatus=$(this).attr("tstatus");//当前平台处理状态
                if(pstatus == 2 && tstatus != "已处理"){//优化成功的
                    var confirmIndex= layer.confirm('确认将该条数据的[<span style="color: blue;">'+platCode+']</span>平台全部处理.(主要用于某些销售无法处理的情况)？', function (result) {
                        if (result) {
                            $.ajax({
                                url: ctx + '/msgProdOptimization/updateMsgProdOptimizationPlatStatus.html',
                                data: {"id": rid,"platCode":platCode},
                                dataType: "json",
                                type: "post",
                                success: function (returnData) {
                                    if (returnData.code == "0000") {
                                        layer.close(confirmIndex);
                                        layer.msg(returnData.msg,{icon:1});
                                    } else {
                                        layer.msg(returnData.msg,{icon:5});
                                    }
                                },
                                error: function () {
                                    layer.msg("服务器正忙");
                                }
                            });
                        }
                    });
                }
            })
        },
        where:getOptimizeSerachData(),
        id: 'product_optimize_dataTable',
        page: true,
        limits: [50, 100],
        limit: 50,
    });
    /**
     * 重新渲染表格
     */
    function reloadTable() {
        getMsgProdOptimizationCount();
        table.reload('product_optimize_dataTable', {
            where: getOptimizeSerachData(),
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    }
    /**
     * 切换审核状态选项卡重新渲染表格
     */
    element.on('tab(product_optimize_tab)', function(data) {
        currentOptimStatus = $(this).attr("optim_status");
        reloadTable(); //当前选择的审核状态
    });

    /**
     * 搜索
     */
    $('#product_optimize_searchBtn').click(function() {
        reloadTable();
    });
    /**
     * 只查责任人为自己的
     */
    $('#product_optimize_my_res_searchBtn').click(function() {
        $("#product_optimize_developer").val(currentUserId);
        $("#product_optimize_seller").val('');
        form.render();
        reloadTable();
    });
    /**
     * 只查需求人为自己的
     */
    $('#product_optimize_my_sell_searchBtn').click(function() {
        $("#product_optimize_seller").val(currentUserId);
        $("#product_optimize_developer").val('');
        form.render();
        reloadTable();
    });
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(product_optimize_dataTable)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'product_optimize_revocation') {//撤销
           var confirmIndex= layer.confirm('确认撤销<span style="color: red;"> '+data.pSku+'</span> 的商品优化需求？', function (result) {
                if (result) {
                    $.ajax({
                        url: ctx + '/msgProdOptimization/delMsgProdOptimization.html',
                        data: {"id": data.id},
                        dataType: "json",
                        type: "post",
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.close(confirmIndex);
                                layer.msg('撤销成功',{icon:1});
                                setTimeout(function(){
                                    reloadTable();
                                },1000);
                            } else {
                                layer.msg(returnData.msg,{icon:5});
                            }
                        },
                        error: function () {
                            layer.msg("服务器正忙");
                        }
                    });
                }
            });
        } else if (layEvent == 'product_optimize_historyRecord') {//显示历史
            var index = layer.open({
                type: 1,
                title: "优化历史",
                area: ["600px", "500px"],
                shadeClose: false,
                content: $("#optimizeHistoryRecordModalLayer").html(),
                btn: ["关闭"],
                yes: function (index, layero) {
                    layer.close(index);
                },
                success: function (layero) {
                    getHistoryMsgProdOptimizations(data.prodPId);
                },
            });
        } else if (layEvent == 'product_optimize_optimizeDeal') {//处理
            var index = layer.open({
                type: 1,
                title: "完成优化",
                area: ["600px", "350px"],
                shadeClose: false,
                content: $("#optimizeDealModalLayer").html(),
                btn: ["完成优化", "关闭"],
                success: function (layero) {
                    $("#optimizeDealForm input[name='id']").val(data.id);
                    var redioChecked=false;
                    if(data.optimStatus!=null){
                        $("#optimizeDealForm input[name='optimStatus']").each(function(){
                               if($(this).val()==data.optimStatus){
                                   $(this).attr("checked","checked");
                                   redioChecked=true;
                               }
                        });
                    }
                    if(!redioChecked){
                        $("#optimizeDealForm input[name='optimStatus']").first().attr("checked","checked");
                    }
                    currentHasAllDeal=data.hasAllDeal;
                    currentProcStatus=data.optimStatus;//优化处理状态
                    currentCanModitityProcStatus=data.canModitityProcStatus;//是否所有销售都未处理
                    currentDevNote=data.devNote;
                    $("#optimizeDealForm_devNote").val(currentDevNote);
                    form.render();
                },
                yes: function (index, layero) {
                    $("#optimizeDealBtn").trigger("click");
                },
                end: function () {
                    $("#optimizeDealForm").trigger('reset');
                    $("#optimizeDealForm input[name='id']").val("");
                },
            });
        }else if(layEvent == 'product_optimize_update_sellerNote'){
            var title=$(this).attr("title");
            var oldData="";
            var  isSeller=false;
            if(title.indexOf("需求")>-1){
                oldData= obj.data.sellerNote ||'';
                isSeller=true;
            }else{
                oldData= obj.data.devNote ||'';
            }
           var index= layer.open({
                type: 1,
                title: title,
                area: ["500px", "300px"],
                btn: ["保存", "取消"],
                content: '<div style="padding:20px"><textarea id="product_optimize_update_note_text" class="layui-textarea">' +oldData+ '</textarea></div>',
                yes: function (index, layero) {
                    var newNote = $("#product_optimize_update_note_text").val();
                    var obj={};
                    obj.id=data.id;
                    if(isSeller){
                       obj.sellerNote=newNote;
                    }else{
                       obj.devNote=newNote;
                    }
                    $.ajax({
                        url: ctx + '/msgProdOptimization/updateMsgProdOptimization.html',
                        data: obj,
                        dataType: "json",
                        type: "post",
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg(title+'成功',{icon:1});
                                setTimeout(function(){
                                    reloadTable();
                                },1000);
                            } else {
                                layer.msg(returnData.msg,{icon:5});
                            }
                        },
                        error: function () {
                            layer.msg("服务器正忙",{icon:5});
                        }
                    });
                }, end: function () {
                    layer.close(index);
                }
            });
        }
    });
    // 获取商品历史优化记录
    function getHistoryMsgProdOptimizations(prodPId) {
        $.ajax({
            url: ctx + '/msgProdOptimization/getHistoryMsgProdOptimizations.html',
            data: {"prodPId": prodPId},
            type: "post",
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    if(returnData.data!=null&&returnData.data.length>0){
                        $(returnData.data).each(function () {
                            $("#optimizeHistoryRecordTimeline").append('<li class="layui-timeline-item">' +
                                '<i class="layui-icon layui-timeline-axis">&#xe63f;</i>' +
                                '<div class="layui-timeline-content layui-text">' +
                                '<h3 class="layui-timeline-title">'+Format(this.createTime,"yyyy-M-d h:m:s")+'</h3>' +
                                '<p>'+this.seller+'<span style="color: #999;">(需求人)</span>'+'：'+this.sellerNote+'</p>'+
                                '<p>'+this.procPerson+'<span style="color: #999;">(责任人)</span>'+'：'+this.devNote+'<span style="color: #737679 !important;">('+Format(this.devProcTime,"yyyy-M-d h:m:s")+ ')</span></p>' +
                                '<i class="layui-icon"></i>' +
                                '</div>' +
                                '</li>');
                        });
                    }else{
                        $("#optimizeHistoryRecordTimeline").html("<p style='text-indent: 2em;'>暂无优化记录</p>");
                    }
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙",{icon:5});
            }
        });
    }

    // 商品优化处理
    form.on("submit(optimizeDealBtn)", function (data) {
        if (currentCanModitityProcStatus != 1){//如果有销售已经处理
            if( currentOptimStatus != data.field.optimStatus ){//有销售处理，不能变更状态
                layer.msg("有平台的销售已经处理，不能变更处理状态！", {icon: 0, time: 5000,btn: ['知道了']})
                return false;
            }
        }
        product_optimize_completeOptimize(data);
        return false;
    });

    /**
     * 完成优化
     */
    function product_optimize_completeOptimize(data){
        if(data.field.devNote==null||$.trim(data.field.devNote)==''){
            layer.msg("处理备注不能为空",{icon:0});
            return false;
        }
        $.ajax({
            url: ctx + "/msgProdOptimization/dealMsgProdOptimization.html",
            dataType: "json",
            type: "post",
            data: data.field,
            success: function (returnData) {
                if (returnData.code == "0000") {
                    layer.closeAll();
                    layer.msg("操作成功",{icon:1});
                    setTimeout(function(){
                        reloadTable();
                    },1000);
                } else {
                    layer.closeAll();
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙",{icon:5});
            },
        });
    }
    /**
     * 显示商品优化方向
     * @param optimReason
     * @returns {*}
     */
    function getOptimReasonName(optimReason){
        if($.isEmptyObject(optimReasonObj)){//判断公司枚举值是否为空,如果没有加载公司id,名称,则执行加载
            new Promise(function(resolve,reject){
                $.ajax({
                    url: ctx + "/sysdict/getSysFlatDictsByHead.html",
                    data:{"dictHead":"PRODUCT_OPTIMIZE_REASON"},
                    type: "post",
                    dataType: "json",
                    success: function (returnData) {
                        if (returnData.code == "0000"&&returnData.data != null) {
                            $(returnData.data).each(function () {
                                optimReasonObj[this.dKey]=this.dValue;
                            });
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器异常",{icon:5});
                    },
                });
            }).then(function(){
                return optimReasonObj[optimReason]?optimReasonObj[optimReason]:optimReason;
            })
        }else{
            return optimReasonObj[optimReason];
        }
    }
    /**
     * 获取搜索条件值
     */
    function getOptimizeSerachData() {
        var obj = new Object();
        var developer =$.trim($("#product_optimize_developer").val())//责任人
        var platList = $.trim($("#product_optimize_platList_sel").val());//平台
        var seller = $.trim($("#product_optimize_seller").val());//销售人
        var optimReason =$.trim($("#product_optimize_optimReason").val());//优化原因
        var parentSku = $.trim($("#product_optimize_parentSku").val());//发起时间
        var cnTitle = $.trim($("#product_optimize_cnTitle").val());//商品中文
        var timeCycle =$.trim($("#product_optimize_timeCycle").val());//发起时间
        var dealPlatCode=$.trim($("#product_optimize_deal_platcode_sel").val());//销售处理平台
        var platSellDealStatus=$.trim($("#product_optimize_deal_status_sel").val());//平台销售处理状态
        var myselfDealStatus= $.trim($("#product_optimize_myself_deal_status_sel").val()); //待我处理状态
        var isSale=$.trim($("#product_optimize_product_status_sel").val());//商品状态
        obj.developer = developer;
        obj.platList = platList;
        obj.seller = seller;
        obj.optimReason = optimReason;
        obj.parentSku=parentSku;
        obj.cnTitle = cnTitle;
        obj.timeCycle = timeCycle;
        obj.optimStatus= $.trim(currentOptimStatus);
        obj.dealPlatCode=dealPlatCode;
        obj.platSellDealStatus=platSellDealStatus;
        obj.myselfDealStatus=myselfDealStatus;
        obj.isSale=isSale;
        return obj;
    }
    /**
     * 获取系统所有在职人员
     */
    function listEnableSysUser() {
        $("#product_optimize_developer").html("<option value=''></option>");
        $("#product_optimize_seller").html("<option value=''></option>");
        $.ajax({
            url: ctx + "/msgProdOptimization/listEnableSysUser.html",
            dataType: "json",
            type: "post",
            success: function (returnData) {
                if (returnData.code == "0000"&&returnData.data != null) {
                    $(returnData.data).each(function () {
                        $("#product_optimize_developer").append("<option value='" + this.id + "'>" + this.user_name + "</option>");
                        $("#product_optimize_seller").append("<option value='" + this.id + "'>" + this.user_name + "</option>");
                    });
                    currentUserId=returnData.msg;
                    form.render();
                } else {
                    layer.msg(returnData.msg,{icon:0});
                }
            },
            error: function () {
                layer.msg("服务器异常",{icon:5});
            },
        });
    }
    //初始化需求平台
    function initOptimizationPlatList(objId){
        var obj=$("#"+objId);
        obj.html("<option value=''></option>");
       // $("#product_optimize_deal_platcode_sel").html("<option value=''>处理平台</option>");
        $.ajax({
            url: ctx + "/sysdict/getSysFlatDictsByHead.html",
            data:{"dictHead":"PRODUCT_SALES_PLAT"},
            dataType: "json",
            type: "post",
            success: function (returnData) {
                if (returnData.code == "0000" && returnData.data != null) {
                    $(returnData.data).each(function () {
                        obj.append("<option value='" + this.dKey + "'>" + this.dValue + "</option>");
                        $("#product_optimize_deal_platcode_sel").append("<option value='" + this.dKey + "'>" + this.dValue + "</option>");
                    });
                    form.render();
                } else {
                    layer.msg(returnData.msg,{icon:0});
                }
            },
            error: function () {
                layer.msg("服务器异常",{icon:5});
            },
        });
    }
    //初始化优化方向
    function initOptimizationOptimReason(objId){
        var obj=$("#"+objId);
        obj.html("<option value=''>请选择</option>");
        $.ajax({
            url: ctx + "/sysdict/getSysFlatDictsByHead.html",
            data:{"dictHead":"PRODUCT_OPTIMIZE_REASON"},
            dataType: "json",
            type: "post",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    if (returnData.data != null){
                        $(returnData.data).each(function () {
                            optimReasonObj[this.dKey]=this.dValue;
                            obj.append("<option value='" + this.dKey + "'>" + this.dValue + "</option>");
                        });
                    }
                    form.render();
                } else {
                    layer.msg(returnData.msg,{icon:5});
                }
            },
            error: function () {
                layer.msg("服务器异常",{icon:5});
            },
        });
    }
});

