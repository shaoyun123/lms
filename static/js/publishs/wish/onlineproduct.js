/**wish在线商品的js*/
var op_arr = [];
var timeUnit;
var wishSkus;
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element', 'laypage', 'laydate', 'echarts'], function() {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        laytpl = layui.laytpl,
        element = layui.element,
        laydate = layui.laydate,
        echarts = layui.echarts,
        form = layui.form;
    form.render('checkbox');
    form.render('select'); //刷新select选择框渲染

    //远程搜索功能
    var dim = new DimSearch('#wish_pl_searchSysUser', 'wish_online_userId', {
        url: '/sys/searchSysUser.html',
        query: 'name',
        label: 'name',
        name: '.wishOnline_dimResultDiv'
    });
    dim.init();
    /**
     * 日期渲染
     */
    laydate.render({
        elem: '#wish_online_listtime',
        range: true
    });
    render_hp_orgs_users("#wish_online_search_form"); //渲染部门销售员店铺三级联动
    /**
     * 初始化商品标签
     */
    wishOnline_initProdTags();
    //日志动态查询
    let dynamicLogQueryObj = {}
    function dynamicLogQuery() {
        return commonReturnPromise({
            url: ctx + '/prodListingOperTypeEnum/wish '
        })
    }
    dynamicLogQuery().then(res => {  //日志状态
        dynamicLogQueryObj = res
    }) 
    function wishOnline_initProdTags() {
        $.ajax({
            type: "post",
            url: ctx + "/product/getProdTags.html",
            dataType: "json",
            success: function(returnData) {
                console.log(returnData.data);
                if (returnData.code == "0000") {
                    //商品标签
                    var productLabelList = returnData.data;
                    var labelStr = "<option value=''>请选择</option>";
                    $(productLabelList).each(function() {
                        labelStr += "<option value='" + this.name + "'>" + this.name + "</option>";
                    });
                    $("#wish_online_productLabel_sel").html(labelStr);
                    form.render();
                } else {
                    layer.msg(returnData.msg);
                }
            }
        });
    }
    //重置的时候处理三级联动
    $('#wish_online_search_reset').on('click', function() {
        $('#wish_online_depart_sel').next().find('dd[lay-value=""]').trigger('click');
    })
    var wishOnline_marksCheckData = [];
    /**
     * 批量操作(上下架，调价等)
     */
    form.on('select(wish_online_isEnableSel)', function(data) {
        var selected = $.trim(data.value);
        if (selected == null || selected == '') {
            return false;
        }
        if (selected == 0) { //批量更新
            var itemData = table.checkStatus('wish_online_data_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", { icon: 0 });
                return;
            }
            var itemIds = [];
            for (var index in itemData) {
                var obj = itemData[index];
                itemIds.push(obj.storeAcctId + "&" + obj.storeProdPId);
            }
            wishOnline_syncBacthItem(itemIds.join(","));
            return;
        }
        if (selected == 4) { //wish修改主辅图
            var itemData = table.checkStatus('wish_online_data_table').data; //获取选择的数据
            if (itemData != null && itemData.length > 0) {
                var itemIds = [];
                for (var index in itemData) {
                    var obj = itemData[index];
                    itemIds.push(obj.id);
                }
                var itemIdStr = itemIds.join(","); //获取id列表
                var ele = $("<input type='hidden' id='wish_edit_mainAssistImg_ids_hidden' value='" + itemIdStr + "'></input >");
                $("body").append(ele);
            }
        }
        if (selected == 9) { //wish修改主辅图
            var itemData = table.checkStatus('wish_online_data_table').data; //获取选择的数据
            if (itemData != null && itemData.length > 0) {
                var itemIds = [];
                for (var index in itemData) {
                    var obj = itemData[index];
                    itemIds.push(obj.id);
                }
                var itemIdStr = itemIds.join(","); //获取id列表
                var ele = $("<input type='hidden' id='wish_edit_variantMainImg_ids_hidden' value='" + itemIdStr + "'></input >");
                $("body").append(ele);
            }
        }

        if (selected == 10) { //wish复制listing
            var itemData = table.checkStatus('wish_online_data_table').data; //获取选择的数据

            if (itemData == null || itemData.length < 1) {
                layer.msg("必须先选中商品", { icon: 0 });
                return;
            }

            if (itemData != null && itemData.length > 0) {
                var itemIds = [];
                for (var index in itemData) {
                    var obj = itemData[index];
                    itemIds.push(obj.id);
                }
                var itemIdStr = itemIds.join(","); //获取id列表
                var ele = $("<input type='hidden' id='wish_copyListing_ids_hidden' value='" + itemIdStr + "'></input >");
                $("body").append(ele);
            }
        }

        if (selected == 12) { //批量更新标签
            var itemData = table.checkStatus('wish_online_data_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", { icon: 0 });
                return;
            }
            var itemIds = [];
            for (var index in itemData) {
                var obj = itemData[index];
                itemIds.push(obj.id);
            }
            wishOnline_batchUpdateWishItemMarks(itemIds.toString());
            return;
        }

        if (selected == 14) { //批量创建PB
            var itemData = table.checkStatus('wish_online_data_table').data; //获取选择的店铺
            if (itemData == null || !itemData.length) return layer.msg("请选择lisiting", { icon: 0 });
            //同一个店铺
            if (itemData.filter(item => item.storeAcctId == itemData[0].storeAcctId).length != itemData.length) return layer.msg("请选择同一个店铺进行操作", { icon: 0 });
            //缓存需要的数据
            let pbParams = itemData.map(pbItem => ({
                    storeAcctId: pbItem.storeAcctId,
                    isAutoRenew: true,
                    promotionId: pbItem.storeProdPId, //产品ID
                    startTime: Date.now() + 1000 * 24 * 60 * 60 * 2 - 54000000, //时间 根据店小秘的
                    expectedEndTime: Date.now() + 1000 * 24 * 60 * 60 * 29 - 54000000, //时间 根据店小秘的
                }))
                //保存到缓存中
            window.localStorage['wishOnlineproductPB'] = JSON.stringify(pbParams);
            //创建PB 跳转页面
            window.location.hash = "/route/publishs/wish/pbactivitymanager"
            return;
        }

        if(selected == 15){
            var itemData = table.checkStatus('wish_online_data_table').data; //获取选择的数据
            let storeProdPId = [],storeAcctId = [];
            itemData.forEach(item=>{
                storeProdPId.push(item.storeProdPId)
                storeAcctId.push(item.storeAcctId)
            })
            localStorage.setItem('storeProdPId',storeProdPId);
            localStorage.setItem('storeAcctId',storeAcctId);
        }

        /**
         * 弹窗
         */
        var sobj = $("#wish_online_isEnableSel").find("[value=" + selected + "]");
        var title = $(sobj).attr("data-title");
        var value = sobj.attr('value');
        if (value === '6') {
            var link = $(sobj).attr("data-link");
            var index = layer.open({
                type: 1,
                id: Date.now(),
                title: title,
                area: ['80%', '90%'],
                success: function() {
                    layui.view(this.id).render(link).done(function() {
                        //渲染完成以后执行的函数
                    })
                },
                end: function() {
                    if (timeUnit != null) {
                        clearInterval(timeUnit); //清除定时查询进度
                    }
                }
            });
        } else {
            var link = $(sobj).attr("data-link");
            var index = layer.open({
                type: 1,
                id: Date.now(),
                title: title,
                area: ['1200px', '90%'],
                success: function() {
                    layui.view(this.id).render(link).done(function() {
                        //渲染完成以后执行的函数
                        if (wishSkus) {
                            $("input[name='sSkuList']").val(wishSkus);
                            // setTimeout(function () {
                            //     $('#adjustPriceSearchBtn').click();
                            // },1000);//延迟1s
                        }
                    })
                }
            });
        }
    });

    /**
     * 在线下线选项卡改变
     */
    var currentIsSale = "1"; //审核状态
    var isDeleted = "0"; //已删除选项卡 0代表未被删除 1已删除
    element.on('tab(wish_online_tab_filter)', function(data) {
        currentIsSale = $(this).attr("is_sale");
        isDeleted = $(this).attr("is_deleted");
        $("#wish_online_search_submit").click();
    });
    /**
     * 标签选择监听
     */
    form.on('checkbox(wishonline_marksCheck)', function(data) {
        var savl = data.value;
        if (savl == "") { //点击了全选
            if (data.elem.checked) { //全部选中
                $("#wish_online_marks_form").children().each(function() {
                    $(this).prop("checked", true);
                })
                $("[name=wishOnPro_accurateCount]").prop("checked", true)
            } else { //反选
                $("#wish_online_marks_form").children().each(function() {
                    $(this).prop("checked", false);
                })
                $("[name=wishOnPro_accurateCount]").prop("checked", false)
            }
        } else {
            if (data.elem.checked) {
                let allCount = 0
                $("[name=wishOnPro_accurateCount]").prop("checked") == true?allCount = 1:'';
                var length = $("#wish_online_marks_form").find(".layui-form-checked").length * 1 + allCount;
                if (length == ($("#wish_online_marks_form").find("input").length)) {
                    $("#wish_online_marks_form").children().first().prop("checked", true);
                }
            } else {
                $("#wish_online_marks_form").children().first().prop("checked", false);
            }
        }
        form.render('checkbox');
    });


    // 搜索
    var active = {
        reload: function() {
            var searchData = wishOnline_getSerachData();
            //执行重载
            table.reload('wish_online_data_table', {
                where: {
                    statsearchData: searchData
                }
            });
        }
    };

    /**
     * 搜索
     */
    $("#wish_online_search_submit").on("click", function() {
        var searchData = wishOnline_getSerachData();
        let wish_online_data_table_Init = table.render({
            elem: "#wish_online_data_table",
            method: 'post',
            url: ctx + "/onlineProductWish/searchWishProductByDto.html",
            where: searchData,
            cols: [
                [
                    { checkbox: true, width: 25 },
                    { field: "mainImage", unresize: true, width: 65, title: "图片", style: "vertical-align: top;", templet: "#wish_online_mainImage_tpl" },
                    { field: 'storeProdPId', title: "标题/产品ID", align: 'left', style: "text-align:left;vertical-align: top;", templet: '#wish_online_storeProdPId_tpl' },
                    { field: "rating", title: "评分", width: 60, templet: '#wish_online_prodRating_tpl' },
                    { field: "wishes", title: "收藏", width: 60 },
                    { field: 'sales', title: "出售", width: 60, align: 'left', templet: '#wish_online_sales_tpl' },
                    { field: "pSku", title: "Parent SKU", width: 130, templet: '#wish_online_storePSku_tpl' },
                    {
                        field: "storeSSku",
                        unresize: true,
                        width: 560,
                        title: "<div style='width:120px;float: left;'>SKU</div> " +
                            "<div style='width:60px;float: left;'>价格($)</div> " +
                            "<div style='width:80px;float: left;'>价格(¥)</div> " +
                            "<div style='width:60px;float: left;'>在线数量</div> " +
                            // "<div style='width:90px;float: left;'>可用/在途/未派</div> " +
                            "<div style='width:90px;float: left;'>预计可用库存含在途/不含在途</div> " +
                            "<div style='width:60px;float: left;'>运费($)</div> " +
                            "<div style='width:80px;float: left;'>运费(¥)</div> ",
                        style: "vertical-align: top;",
                        templet: "#wish_online_storeSSku_tpl",
                    },
                    { field: "listingRemark", width: 200, title: "备注", style: "vertical-align: top;", templet: '#wish_online_listingRemark_tpl' },
                    { field: "listingTime", title: "时间", width: 120, style: "vertical-align: top;", templet: '#wish_online_listingTime_tpl' },
                    { title: '操作', width: 100, align: 'center', templet: '#wish_online_operate_tpl' }
                ],
            ],
            done: function(res, curr, count) {
                theadHandle().fixTh({ id: '#wishonlineCard', h: 200, dv4: '.checkbox-group', i: 85 });
                op_arr = [];
                let newsearchData = deepCopy(searchData)
                if(newsearchData.limitCount == true){
                    newsearchData.limit = wish_online_data_table_Init.config.limit;
                    newsearchData.page = curr;
                    commonReturnPromise({
                        url: '/lms/onlineProductWish/searchWishProductCountByDto.html',
                        type: 'post',
                        params: newsearchData
                    }).then(result => {
                        if (result != null) {
                            let msgArray = result.split("&");
                            $("#wish_online_online_num_span").html(msgArray[0]); //在线
                            $("#wish_online_offline_num_span").html(msgArray[1]); //下线
                        }
                    });
                }else{
                    let msgArray = res.msg.split("&");
                    $("#wish_online_online_num_span").html(msgArray[0]); //在线
                    $("#wish_online_offline_num_span").html(msgArray[1]); //下线
                }
                //懒加载
                imageLazyload();
                if (res.code == '0000') {
                    if (res.data != null) {
                        var getTpl = wish_online_hide_table_tpl.innerHTML,
                            view = document.getElementById('wish_online_hide_table');
                        laytpl(getTpl).render(res.data, function(html) {
                            view.innerHTML = html;
                            imageLazyload();
                        });
                    }
                    $('.wish_online_listingRemark_tip').on('mouseenter', function() {
                        var that = this;
                        var tips = $(this).attr("listingRemark");
                        if (tips) {
                            layer.tips($(this).attr("listingRemark"), that, { tips: [1, '#333'], time: 0 }); //在元素的事件回调体中，follow直接赋予this即可
                        }
                    }).on('mouseleave', function() {
                        layer.closeAll("tips");
                    });
                }
            },
            id: "wish_online_data_table",
            limit: 100,
            limits: [100,300,500,1000],
            page: {
                layout: ['prev', 'page', 'next','count','limit'],
                groups: 5,
                prev: '<上一页',
                next: '下一页>',
                first: false, //显示首页
                last: false, //显示尾页
            },
        });
        //工具条的监听事件,table.on(tool(表格的lay-filter的值))
        table.on('tool(wish_online_data_table)', function(obj) {
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            var itemIds = data.storeAcctId + "&" + data.storeProdPId;
            if (layEvent == "wish_online_syncOneItem") { //更新一条item
                wishOnline_syncBacthItem(itemIds);
            }
            var id = data.id;
            if (layEvent == "wish_online_searchLog") { //查看日志
                layer.open({
                    type: 1,
                    title: '查看日志',
                    shadeClose: false,
                    area: ['60%', '60%'],
                    content: $('#log_table').html(),
                    success: function() {
                        searchLog(id);
                    }
                })
            } else if (layEvent == 'wish_online_update_listingRemark') {
                var title = $(this).attr("title");
                var oldData = obj.data.listingRemark || '';
                var objId = "wish_online_listingRemark_text";
                var index = layer.open({
                    type: 1,
                    title: title,
                    area: ["500px", "300px"],
                    btn: ["保存", "取消"],
                    content: '<div style="padding:20px"><textarea id=' + objId + ' class="layui-textarea">' + oldData + '</textarea></div>',
                    yes: function(index, layero) {
                        var listingRemark = $("#" + objId).val();
                        var tobj = {};
                        tobj.id = data.id;
                        tobj.listingRemark = listingRemark;
                        var updateRemarkJson = [];
                        updateRemarkJson.push(tobj);
                        $.ajax({
                            url: ctx + '/onlineProductWish/updateOneWishItemRemark.html',
                            data: { "updateRemarkJson": JSON.stringify(updateRemarkJson) },
                            dataType: "json",
                            type: "post",
                            success: function(returnData) {
                                if (returnData.code == "0000") {
                                    obj.data.listingRemark = listingRemark;
                                    layer.closeAll();
                                    layer.msg(title + '成功', { icon: 1 });
                                } else {
                                    layer.msg(returnData.msg, { icon: 5 });
                                }
                            },
                            error: function() {
                                layer.msg("服务器正忙", { icon: 5 });
                            }
                        });
                    },
                    end: function() {
                        layer.close(index);
                    }
                });
            } else if (layEvent == "wish_online_markOneItem") { //标记一条在线listing
                wishOnline_updateBatchWishItemMarks(data.id, data.listingMarks);
            } else if (layEvent == "wish_online_listing_sale_data") {
                wishOnline_showListingSaleData(data.storeProdPId); //根据listingid获取销售表现
            } else if (layEvent == "wish_online_listing_rating") {
                wishOnline_showListingRatingData(data.storeProdPId); // 查询产品评分
            } else if (layEvent == 'wish_online_listing_createPB') {
                //创建PB
                //缓存需要的数据
                let pbParams = {};
                pbParams.storeAcctId = data.storeAcctId;
                pbParams.isAutoRenew = true;
                pbParams.promotionId = data.storeProdPId; //产品ID
                //时间 根据店小秘的
                pbParams.startTime = Date.now() + 1000 * 24 * 60 * 60 * 2 - 54000000
                pbParams.expectedEndTime = Date.now() + 1000 * 24 * 60 * 60 * 29 - 54000000
                    //保存到缓存中
                window.localStorage['wishOnlineproductPB'] = JSON.stringify([].concat(pbParams));
                //创建PB 跳转页面
                window.location.hash = "/route/publishs/wish/pbactivitymanager"
            }
        });
    })

    function searchLog(id) {
        table.render({
            elem: '#wish_log_table',
            method: 'post',
            url: ctx + '/onlineProductWish/searchLog.html',
            where: { 'id': id },
            cols: [
                [ //标题栏
                    { field: 'createTime', title: '时间', templet: "<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>" }, { field: 'creator', title: '操作人' }, { field: 'prodSSku', title: '商品子SKU' }, { field: 'storeSSku', title: '店铺子SKU' }, { field: 'operqteTypeStr', title: '事件', templet: function (d) {
                        let operTypeTem = ''
                        for (const key in dynamicLogQueryObj) {
                            if (key == d.operType) {
                                operTypeTem = dynamicLogQueryObj[key]
                            }
                        }
                        return operTypeTem
                        
                    } }, { field: 'origData', title: '原值'}, { field: 'newData', title: '调整值', width: '25%'}, { field: 'operDesc', title: '结果', width: '20%' }, { field: 'operation', title: '操作' }
                ]
            ],
        })
    }
    //监听表格复选框选择
    table.on('checkbox(wish_online_data_table)', function(obj) {
        var checkStatus = table.checkStatus('wish_online_data_table'),
            date = checkStatus.data;
        op_arr = date;
    });
    /**
     * 批量更新
     * @param itemIds
     */
    function wishOnline_syncBacthItem(itemIds) {
        loading.show();
        if (itemIds == null || itemIds == '') {
            layer.msg("请选择lisiting", { icon: 0 });
            return;
        }
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductWish/syncBatchWishItem.html",
            data: { "itemIds": itemIds },
            dataType: "json",
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    layer.msg(returnData.msg, { icon: 1 });
                } else {
                    layer.open({
                        title: '更新lisiting结果',
                        content: returnData.msg,
                        offset: '100px',
                        area: '500px',
                        yes: function(index, layero) {
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                }
            }
        })
    };

    /**
     * 批量删除
     * @param deleteArray
     */
    function wishOnline_batchRemoveProd(deleteArray) {
        if (deleteArray == null || deleteArray.length < 1) {
            layer.msg("请选择要删除的lisiting", { icon: 0 });
            return;
        } else {
            var Confirmindex = layer.confirm("此操作不可撤回，是否确定删除？", function(result) {
                if (result) {
                    layer.close(Confirmindex);
                    loading.show();
                    $.ajax({
                        type: "post",
                        url: ctx + "/wishIsEnableProduct/batchRemoveProd.html",
                        data: { "deleteArray": JSON.stringify(deleteArray) },
                        dataType: "json",
                        success: function(returnData) {
                            loading.hide();
                            if (returnData.code == "0000") {
                                layer.msg(returnData.msg, { icon: 1 });
                            } else {
                                layer.msg(returnData.msg, { icon: 2 });
                            }
                        }
                    })
                }
            })
        }
    }

    function wishOnline_updateBatchWishItemMarks(id, oldMarks) {
        if (oldMarks == null) {
            oldMarks = "";
        } else {
            oldMarks = oldMarks + ",";
        }
        var options = {
            type: 1,
            title: "修改wish在线listing标签",
            btn: ['保存', '关闭'],
            area: ["800px", "500px"],
            content: $('#wishOnline_updateBatchWishItemMarksLayer').html(),
            success: function(layero, index) {
                var str = "";
                $.each(wishOnline_marksCheckData, function(index, element) {
                    var tempstr = element.id + ",";
                    if (oldMarks.indexOf(tempstr) > -1) {
                        str += '<input type="checkbox"  value="' + element.id + '" lay-skin="primary" title="' + element.name + '" lay-filter="wishonline_marksCheck" checked>';
                    } else {
                        str += '<input type="checkbox"  value="' + element.id + '" lay-skin="primary" title="' + element.name + '" lay-filter="wishonline_marksCheck" >';
                    }
                });
                $("#wish_online_update_marks_form").html($(str));
                form.render('checkbox');
            },
            yes: function(index, layero) {
                var marks = []; //审核状态
                $("#wish_online_update_marks_form").find(".layui-form-checked").each(function() {
                    marks.push($(this).prev().val());
                });
                var updateJson = [];
                var obj = {};
                obj.id = id;
                obj.marks = marks.join(",");
                updateJson.push(obj);
                $.ajax({
                    type: "post",
                    url: ctx + "/onlineProductWish/updateBatchWishItemMarks.html",
                    dataType: "json",
                    data: { "updateJson": JSON.stringify(updateJson) },
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg("添加标签成功", { icon: 1 });
                        } else {
                            layer.msg(returnData.msg, { icon: 0 });
                        }
                    },
                    error: function() {
                        layer.msg("添加标签失败", { icon: 5 });
                    }
                })
            }
        }
        var index = admin.popup(options);
    }

    //批量修改标签
    function wishOnline_batchUpdateWishItemMarks(id) {
        var oldMarks = "";
        var options = {
            type: 1,
            title: "批量修改wish在线listing标签",
            btn: ['保存', '关闭'],
            area: ["800px", "500px"],
            content: $('#wishOnline_updateBatchWishItemMarksLayer').html(),
            success: function() {
                var str = "";
                $.each(wishOnline_marksCheckData, function(index, element) {
                    var tempstr = element.id + ",";
                    if (oldMarks.indexOf(tempstr) > -1) {
                        str += '<input type="checkbox"  value="' + element.id + '" lay-skin="primary" title="' + element.name + '" lay-filter="wishonline_marksCheck" checked>';
                    } else {
                        str += '<input type="checkbox"  value="' + element.id + '" lay-skin="primary" title="' + element.name + '" lay-filter="wishonline_marksCheck" >';
                    }
                });
                $("#wish_online_update_marks_form").html($(str));
                form.render('checkbox');
            },
            yes: function(index, layero) {
                var marks = []; //审核状态
                $("#wish_online_update_marks_form").find(".layui-form-checked").each(function() {
                    marks.push($(this).prev().val());
                });
                var updateJson = [];
                var obj = {};
                obj.id = id;
                obj.marks = marks.join(",");
                updateJson.push(obj);
                $.ajax({
                    type: "post",
                    url: ctx + "/onlineProductWish/batchUpdateWishItemMarks.html",
                    dataType: "json",
                    data: { "updateJson": JSON.stringify(updateJson) },
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg("添加标签成功", { icon: 1 });
                            active.reload();
                        } else {
                            layer.msg(returnData.msg, { icon: 0 });
                        }
                    },
                    error: function() {
                        layer.msg("添加标签失败", { icon: 5 });
                    }
                })
            }
        }
        var index = admin.popup(options);
    }


    /**
     * 显示lsiting销售表现图形
     */
    function wishOnline_showListingSaleData(itemId) {
        wishOnline_currentItemSaleData = null;
        admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductWish/getWishListingSaleData.html",
            data: { "itemId": itemId },
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var saleData = returnData.data;
                    wishOnline_currentItemSaleData = saleData; //赋值
                    wishOnline_currentItemSaleData.itemId = itemId;
                    layer.open({
                        title: 'listing销售表现 ',
                        content: $("#wishOnline_listingSaleDataLayer").html(),
                        offset: '100px',
                        area: '80%',
                        success: function() {
                            form.render('select'); //刷新select选择框渲染
                            wishOnline_renderOption(1, wishOnline_currentItemSaleData); //渲染
                            admin.load.hide();
                        },
                        yes: function(index, layero) {
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                        }
                    });
                } else {
                    layer.msg("获取wish在线lisiting表现数据失败", { icon: 2 })
                        // console.log("获取wish在线lisiting表现数据失败");
                }
            }
        })
    };


    /**
     * chenke:产品评分
     */
    function wishOnline_showListingRatingData(storeProdPId) {
        var rateData = { "storeProdPId": storeProdPId };
        layer.open({
            title: 'listing产品评分',
            content: `
            <div>
                <div style="display:flex;justify-content: flex-end;">
                    <div class="layui-form" style="width:200px">
                        <select lay-filter="wish_product_rate_select">
                            <option value="0">全部</option>
                            <option value="1">1Stars</option>
                            <option value="2">2Stars</option>
                            <option value="3">3Stars</option>
                            <option value="4">4Stars</option>
                            <option value="5">5Stars</option>
                        </select>
                    </div>
                </div>
                <table id="listingRatingTable"></table>
            </div>`,
            offset: '100px',
            area: ['1100px', '700px'],
            success: function() {
                form.render();
                rateTableRender();
                form.on('select(wish_product_rate_select)', function(obj) {
                    var val = obj.value;
                    rateTableRender(val);
                })

                function rateTableRender(rating) {
                    if (rating == 0) {
                        rateData.rating = '';
                    } else {
                        rateData.rating = rating;
                    }
                    table.render({
                        elem: '#listingRatingTable',
                        method: 'post',
                        where: rateData,
                        url: ctx + "/wishProductRating/list.html",
                        page: true,
                        limits: [20, 50, 100],
                        limit: 100,
                        cols: [
                            [ //表头
                                { field: 'orderId', title: '订单编号' },
                                { field: 'orderTime', title: '订购日期', templet: '#wish_online_orderTime_tpl' },
                                { field: 'ratingTime', title: '评论时间', templet: '#wish_online_ratingTime_tpl' },
                                { templet: `
                                <div>
                                {{# if(d.rating ==1){  }}
                                    <span class="starCss">&#9733</span>
                                {{# }else if(d.rating ==2){ }}
                                    <span class="starCss">&#9733</span>
                                    <span class="starCss">&#9733</span>
                                {{# }else if(d.rating ==3){ }}
                                    <span class="starCss">&#9733</span>
                                    <span class="starCss">&#9733</span>
                                    <span class="starCss">&#9733</span>
                                {{# }else if(d.rating ==4){ }}
                                    <span class="starCss">&#9733</span>
                                    <span class="starCss">&#9733</span>
                                    <span class="starCss">&#9733</span>
                                    <span class="starCss">&#9733</span>
                                {{# }else if(d.rating ==5){ }}
                                    <span class="starCss">&#9733</span>
                                    <span class="starCss">&#9733</span>
                                    <span class="starCss">&#9733</span>
                                    <span class="starCss">&#9733</span>
                                    <span class="starCss">&#9733</span>
                                {{# } }}
                                </div>
                            `, title: '评分', width: 200 },
                                { field: 'ratingComment', title: '评论' },
                                { field: 'isRefund', title: '是否退款', templet: '#wish_online_isRefund_tpl' },
                            ]
                        ],
                        done: function(res, curr, count) {
                            if (res.code != '0000') {
                                layer.msg(res.msg, { icon: 0 });
                            }
                        }
                    });
                }
            },
        });
    };

    /**
     * 复制lisiting 表现数据
     */
    function wishOnline_renderOption(svale, currentItemSaleData) {
        if ($.isEmptyObject(currentItemSaleData)) {
            return false;
        }
        var itemId = currentItemSaleData.itemId; //物品号
        var wishOnline_saleReportOption = {
            title: {
                text: 'listing表现',
                subtext: itemId
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params, ticket, callback) {
                    var weekTime = params[0].name + "";
                    var str = "";
                    str += weekTime.split("&")[0] + "—" + weekTime.split("&")[1];
                    for (var i = 0, l = params.length; i < l; i++) {
                        str += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
                    }
                    return str;
                }
            },
            legend: {
                data: []
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                axisLabel: {
                    formatter: function(value) {
                        return value.split("&")[2] + "周";
                    }
                },
            }],
            yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}($)'
                    },
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}单'
                    },
                    splitLine: { show: false }
                }
            ],
            series: []
        };
        var legendData = [];
        var series = [];
        var xAxisData = [];
        var y1Data = [];
        var y2Data = [];
        var y3Data = [];
        if (svale == 1) {
            legendData = ['销售额(USD$)', '利润额(USD$)', '订单量'];
            series = [{
                    name: '销售额(USD$)',
                    type: 'bar',
                    data: [],
                },
                {
                    name: '利润额(USD$)',
                    type: 'bar',
                    data: [],
                },
                {
                    name: '订单量',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [],
                }
            ];
            $.each(currentItemSaleData, function(index, element) {
                xAxisData.push(element.weekStart + "&" + element.weekEnd + "&" + element.week);
                y1Data.push(element.saleAmt);
                y2Data.push(element.profitAmt);
                y3Data.push(element.orderNum);
            });
        } else {
            legendData = ['退款金额(USD$)', '罚款金额(USD$)', '罚款订单量'];
            series = [{
                    name: '退款金额(USD$)',
                    type: 'bar',
                    data: [],
                },
                {
                    name: '罚款金额(USD$)',
                    type: 'bar',
                    data: [],
                },
                {
                    name: '罚款订单量',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [],
                }
            ];
            $.each(currentItemSaleData, function(index, element) {
                xAxisData.push(element.weekStart + "&" + element.weekEnd + "&" + element.week);
                y1Data.push(element.refundAmt); //退款金额
                y2Data.push(Number(element.orderFineAmt) + Number(element.infractionAmt)); //罚款金额(订单罚款金额+违规罚款金额)
                y3Data.push(element.orderFineNum); //退款订单数量
            });
        }
        wishOnline_saleReportOption.legend.data = legendData;
        wishOnline_saleReportOption.series = series;
        wishOnline_saleReportOption.xAxis[0].data = xAxisData;
        wishOnline_saleReportOption.series[0].data = y1Data;
        wishOnline_saleReportOption.series[1].data = y2Data;
        wishOnline_saleReportOption.series[2].data = y3Data;
        var myChart = echarts.init(document.getElementById('wish_online_listingmarks_saleData_form'));
        myChart.setOption(wishOnline_saleReportOption);
    }

    /**
     * 分析维度改变 事件
     */
    form.on('select(wish_online_reportTable_sel)', function(data) {
        wishOnline_renderOption(data.value, wishOnline_currentItemSaleData);
    });
    getWishOnlineMarks();
    /**
     * 获取wish在线商品配置的标签属性
     */
    function getWishOnlineMarks() {
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductWish/getWishOnlineMarks.html",
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    var str = '';
                    wishOnline_marksCheckData = returnData.data;
                    $.each(returnData.data, function(index, element) {
                        str += '<input type="checkbox"  value="' + element.id + '" lay-skin="primary" title="' + element.name + '" lay-filter="wishonline_marksCheck" >';
                    });
                    $("#wish_online_marks_form").append($(str));
                    form.render('checkbox');
                } else {
                    //    console.log("获取getWishOnlineMarks标签枚举出错");
                }
            }
        });
        if ($("#outof_stock_prod_sku_hidden").length == 1) {
            $("#wish_online_searchtype_sel").val(4); //商品子sku
            wishSkus = $("#outof_stock_prod_sku_hidden").val();
            // $("#wish_online_searchtype_text").val(skus);
            form.render();
            setTimeout(function() {
                // $("#wish_online_search_submit").trigger('click');//搜索对应的在线商品
                $('#wish_online_isEnableSel').next().find('dd:nth-child(4)').trigger('click'); //触发批量上架父SKU的点击事件
            }, 500); //延迟0.5s
        }
    }
    /**
     * 获取搜索参数
     */
    function wishOnline_getSerachData() {
        var obj = {};
        obj.storeProdPId = "";
        obj.title = "";
        obj.prodPSku = "";
        obj.prodSSku = "";
        obj.storePSku = "";
        obj.storeSSku = "";
        var currentStoreAccts = [];
        var storeAcctId = $.trim($("#wish_online_store_sel").val()); //所选店铺
        if (storeAcctId == null || storeAcctId == '') { //没有选择店铺
            $("#wish_online_store_sel").children().each(function() {
                if ($(this).val() != "") {
                    currentStoreAccts.push($(this).val());
                }
            });
            if (currentStoreAccts.length > 0) {
                obj.storeAcctId = currentStoreAccts.join(",");
            } else {
                obj.storeAcctId = '999999';
            }
        } else {
            obj.storeAcctId = storeAcctId;
        }
        var auditStatus = []; //审核状态
        $("#wish_online_search_form").find(".layui-form-checked").each(function() {
            auditStatus.push($(this).prev().val());
        });
        if (isDeleted == 1) {
            obj.auditStatus = 3 //3代表审核状态为已删除
        } else {
            obj.auditStatus = auditStatus.join(",");
        }
        obj.saleType = $.trim($("#wish_online_saletype_sel").val()); //销售类型
        obj.storeProdPId = $.trim($("#wish_online_itemId").val()); //产品id
        obj.salesStart = $.trim($("#wish_online_salesStart_text").val());
        obj.salesEnd = $.trim($("#wish_online_salesEnd_text").val());
        obj.lastWeekSaleStart = $.trim($("#wish_online_lastWeekOrderNumStart_text").val());
        obj.lastWeekSaleEnd = $.trim($("#wish_online_lastWeekOrderNumEnd_text").val());
        obj.ratingLeft = $.trim($("#wish_online_prodRatingStart_text").val());
        obj.ratingRight = $.trim($("#wish_online_prodRatingEnd_text").val());
        var titleSearchType = $.trim($("#wish_online_title_search_type").val()); //标题检索类型
        obj.prodAttrs = $.trim($("#wish_online_productLabel_sel").val());
        obj.isAutoListing = $.trim($('#wish_online_search_form select[name=isAutoListing]').val());

        obj.titleSearchType = titleSearchType;
        var title = $.trim($("#wish_online_item_title").val()); //产品标题
        if (title != null && title != '') {
            if (titleSearchType == 0) { //标题模糊
                var array = title.split(" ");
                obj.title = "";
                for (var i = 0; i < array.length; i++) {
                    if ($.trim(array[i]) != null && $.trim(array[i]) != '') {
                        obj.title += "+" + $.trim(array[i]);
                        if (i != array.length - 1) {
                            obj.title += " ";
                        }
                    }
                }
            } else if (titleSearchType == 1) { //标题精准
                obj.title = "%" + title + "%";
            }
        }
        var searchType = $("#wish_online_searchtype_sel").val();
        var searchText = $.trim($("#wish_online_searchtype_text").val());
        obj.skuSearchType = $.trim($("#wish_online_skusearchtype_sel").val()); //sku检索类型
        var wish_online_userId = $.trim($("#wish_online_search_form input[name=wish_online_userId]").val());
        if (wish_online_userId != null && wish_online_userId != '') {
            obj.wish_online_userId = wish_online_userId;
        }
        if (searchType == 3) { //商品父SKU
            obj.prodPSku = searchText;
        } else if (searchType == 4) { //商品子SKU
            obj.prodSSku = searchText;
        } else if (searchType == 5) { //店铺父SKU
            obj.storePSku = searchText;
        } else if (searchType == 6) { //店铺子SKU
            obj.storeSSku = searchText;
        }
        obj.orderBy = $.trim($("#wish_online_sortdesc_sel").val()); //排序类型
        obj.isSale = currentIsSale;
        obj.isMultiSkuTemp = $.trim($("#wish_online_producttype_sel").val()); //是否多属性
        var lisitingTime = $.trim($("#wish_online_listtime").val()); //刊登时间
        if (lisitingTime != null) {
            obj.listingStartTimeFrom = lisitingTime.substring(0, 10);
            obj.listingStartTimeEnd = lisitingTime.substring(13);
        }
        var marks = []; //审核状态
        $("#wish_online_marks_form").find(".layui-form-checked").each(function() {
            var markVal = $(this).prev().val();
            if (markVal != null && markVal != '') {
                marks.push(markVal);
            }
        });
        obj.marks = marks.join(",");
        obj.pbStatus = $.trim($("#wish_online_pbStatus_sel").val()); //pb状态
        obj.limitCount = $("[name=wishOnPro_accurateCount]").prop("checked")
        return obj;
    }
});

/**
 * 显示商品详情
 */
function wish_productListShow(obj, storeProdPId) {
    var parent = $("#td_" + storeProdPId).parent().parent().parent();
    var attrId = $(parent).next().attr("id");
    if (attrId != null && attrId.indexOf(storeProdPId) > -1) {
        parent.next().remove();
    } else {
        parent.after($("#detail_" + storeProdPId).clone());
    }
}
/**
 * 展开收起多个子商品
 */
function changeColspantable(obj) {
    $(obj).prev().find(".myj-hide").toggle();
    var str = $(obj).html();
    if (str.indexOf("展开") > -1) {
        $(obj).html("- 收起")
    } else {
        $(obj).html("+ 展开")
    }
}