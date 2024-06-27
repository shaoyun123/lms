/**wish在线商品的js*/
var joom_arr = new Array();
var timeUnit;
var joomSkus;
layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element', 'formSelects', 'laydate'], function() {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        laytpl = layui.laytpl,
        element = layui.element,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        form = layui.form;
    form.render('checkbox');
    form.render('select'); //刷新select选择框渲染

    render_hp_orgs_users("#joom_online_search_form"); //渲染部门销售员店铺三级联动
    let dynamicLogQueryObj = {}
    // 初始化
    var joomOnlineName= {
        init:function(){
            this.fetchState() // 状态
            this.fetchReviewDescList() // 诊断原因
            this.renderPublishTime() //刊登时间
            this.dynamicLogQuery().then(res => {  //日志状态
                dynamicLogQueryObj = res
            }) 
            formSelects.render('joom_online_prodIsSaleStatus')
        },
        // 状态
        fetchState:function(){
            this.stateAjax()
            .then(data=>{
                var _data =data.map(item=>({name:item,value:item}))
                formSelects.data('joom_online_state','local',{arr:_data})
            })
            .then(()=>formSelects.render())
            .catch(err=>layer.msg(err,{icon:2}))
        },
        // 诊断原因
        fetchReviewDescList:function(){
            this.reviewDescListAjax()
            .then(data=>{
                var _data =data.map(item=>({name:item.description,value:item.id}))
                formSelects.data('joom_online_reviewDescList','local',{arr:_data})
            })
            .then(()=>form.render())
            .catch(err=>layer.msg(err,{icon:2}))
        },
        renderPublishTime:function(){
            laydate.render({ 
                elem: '#joom_online_publish_time',
                range:true,
              });
        },
        // 状态接口
        stateAjax:function(){
            return commonReturnPromise({
                url:ctx+'/onlineProductJoom/state'
            })
        },
        // 诊断原因接口
        reviewDescListAjax: function(){
            return commonReturnPromise({
                url:ctx+'/joom/review/desc'
            })
        },
        //日志动态查询
        dynamicLogQuery: function () {
            return commonReturnPromise({
                url: ctx + '/prodListingOperTypeEnum/wish '
            })
        }

    }

    joomOnlineName.init()

    //重置的时候处理三级联动
    $('#joom_online_search_reset').on('click', function() {
            $('#joom_online_depart_sel').next().find('dd[lay-value=""]').trigger('click');
        })
        /**
         * 批量操作(上下架，调价等)
         */
    form.on('select(joom_online_isEnableSel)', function(data) {
        var selected = $.trim(data.value);
        if (selected == null || selected == '') {
            return false;
        }
        if (selected == 0) { //批量更新
            var itemData = table.checkStatus('joom_online_data_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", { icon: 0 });
                return;
            }
            var itemIds = [];
            for (var index in itemData) {
                var obj = itemData[index];
                itemIds.push(obj.storeAcctId + "&" + obj.storeProdPId);
            }
            updateBacthJoomItem(itemIds.join(","));
            return false;
        }
        if (selected == 5) { //批量删除
            let itemData = table.checkStatus('joom_online_data_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择lisiting", { icon: 0 });
                return;
            }
            let idsArr = [];
            for (let i = 0; i < itemData.length; i++) {
                let item = itemData[i];
                idsArr.push(item.storeProdPId);
            };
            layer.confirm(`共删除${idsArr.length}个listing`, { icon: 3, title: '提示' }, function(index) {
                commonReturnPromise({
                    type: 'delete',
                    url: '/lms/onlineProductJoom/products',
                    contentType: 'application/json',
                    params: JSON.stringify(idsArr)
                }).then(res => {
                    layer.msg('删除成功', { icon: 1 });
                    layer.close(index);
                    $('#joom_online_search_submit').click();
                }).catch(err => {
                    layer.alert(err, { icon: 2 });
                });
            });

            return false;
        }
        var sobj = $("#joom_online_isEnableSel").find("[value=" + selected + "]");
        var title = $(sobj).attr("data-title");
        var link = $(sobj).attr("data-link");
        var index = layer.open({
            type: 1,
            id: Date.now(),
            title: title,
            area: ['80%', '70%'],
            success: function() {
                layui.view(this.id).render(link).done(function() {
                    //渲染完成以后执行的函数
                    // if(joomSkus){ 
                    //     $("input[name='sSkuList']").val(joomSkus);
                    //     setTimeout(function () {
                    //         $('#adjustPriceSearchBtn').click();
                    //     },1000);//延迟1s
                    // }
                })
            },
            end: function() {
                if (timeUnit != null) {
                    clearInterval(timeUnit); //清除定时查询进度
                }
            }
        })
    });

    /**
     * 在线下线选项卡改变
     */
    var currentIsSale = "1"; //审核状态
    element.on('tab(joom_online_tab_filter)', function(data) {
        currentIsSale = $(this).attr("is_sale");
        $("#joom_online_search_submit").click();
    });

    /**
     * 搜索
     */
    $("#joom_online_search_submit").click(function() {
        table.render({
            elem: "#joom_online_data_table",
            method: 'post',
            url: ctx + "/onlineProductJoom/searchJoomProductByDto.html",
            where: joomOnline_getSerachData(),
            cols: [
                [
                    { checkbox: true, width: 25 },
                    { field: "mainImage", unresize: true, width: 70, title: "图片", style: "vertical-align: top;", templet: "#joom_online_mainImage_tpl" },
                    { field: 'storeProdPId', title: "标题/产品ID", align: 'left', style: "text-align:left;vertical-align: top;", templet: '#joom_online_storeProdPId_tpl', width: 300},
                    { field: "wishs", width: 50, title: "收藏", style: "vertical-align: top;", templet: "#joom_online_collect_tpl" },
                    { field: 'sales', width: 100, title: "销量", align: 'left', style: "vertical-align: top;", templet: "#joom_online_sales_tpl" },
                    { field: 'hasActiveVersion', width: 40, title: "是否活性", align: 'left', style: "vertical-align: top;", templet: '#joom_online_table_hasActiveVersion' },
                    { field: 'state', width: 50, title: "产品状态", align: 'left', style: "vertical-align: top;" },
                    { field: 'reviewDescList', title: "诊断原因", align: 'left', style: "vertical-align: top;" },
                    { field: "pSku", width: 130, title: "Parent SKU", style: "vertical-align: top;", templet: '#joom_online_storePSku_tpl' },
                    {
                        field: "storeSSku",
                        unresize: true,
                        width: 380,
                        title: "<div style='width:110px;float: left;'>SKU</div> " +
                            "<div style='width:60px;float: left;'>价格($)</div>" +
                            " <div style='width:60px;float: left;'>在线数量</div>" +
                            // "<div style='width:60px;float: left;'>可用/在途/未派</div> " +
                            "<div style='width:60px;float: left;'>预计可用库存含在途/不含在途</div> " +
                            " <div style='width:60px;float: left;'>运费($)</div> ",
                        style: "vertical-align: top;",
                        templet: "#joom_online_storeSSku_tpl",
                    },
                    { field: "refundRate", width: 60, title: "退款率", style: "vertical-align: top;" },
                    { field: "listingTime", width: 115, title: "时间", style: "vertical-align: top;", templet: '#joom_online_listingTime_tpl' },
                    { field: "numberRatings", width: 50, title: "评论数", style: "vertical-align: top;" },
                    { field: "averageRating", width: 50, title: "评分", style: "vertical-align: top;" },
                    { field: "numberRefunds", width: 60, title: "退款订单数", style: "vertical-align: top;", },
                    { title: '操作', width: 60, align: 'center', style: "vertical-align: top;", templet: '#joom_online_operate_tpl' }
                ],
            ],
            done: function(res, curr, count) {
                joom_arr = [];
                //懒加载
                imageLazyloadAll();
                theadHandle().fixTh('#joomOnlineProCard', 200);
                if (res.code == '0000') {
                    if (res.data != null) {
                        var getTpl = joom_online_hide_table_tpl.innerHTML,
                            view = document.getElementById('joom_online_hide_table');
                        laytpl(getTpl).render(res.data, function(html) {
                            view.innerHTML = html;
                            imageLazyloadAll();
                        });
                    }
                    if (res.msg != null) {
                        var msgArray = res.msg.split("&");
                        $("#joom_online_online_num_span").html(msgArray[0] >= 10000 ? '>10000' : msgArray[0]); //在线
                        $("#joom_online_offline_num_span").html(msgArray[1] >= 10000 ? '>10000' : msgArray[1]); //下线
                    }
                }
            },
            page: {
                layout: ['prev', 'page', 'next', 'limit'],
                groups: 5,
                prev: '<上一页',
                next: '下一页>',
                first: false, //显示首页
                last: false, //显示尾页
                limit: 300,
                limits: [50,100,300],
            },
            id: "joom_online_data_table",
            limits: [50,100,300],
            limit: 300
        });
        //工具条的监听事件,table.on(tool(表格的lay-filter的值))
        table.on('tool(joom_online_data_table)', function(obj) {
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            var itemIds = data.storeAcctId + "&" + data.storeProdPId;
            if (layEvent == "joom_online_updateOneItem") { //更新一条item
                updateBacthJoomItem(itemIds);
            }
            var id = data.id;
            let storeProdPId = data.storeProdPId
            if (layEvent == 'joom_online_searchLog') {
                console.log(1)
                layer.open({
                    type: 1,
                    title: '查看日志',
                    shadeClose: false,
                    area: ['60%', '60%'],
                    content: $('#log_table_joom').html(),
                    success: function() {
                        searchLog(id,storeProdPId);
                    }
                })

            }
        });
    })

    function searchLog(id,storeProdPId) {
        table.render({
            elem: '#joom_log_table',
            method: 'post',
            url: ctx + '/onlineProductJoom/searchLog.html',
            where: { 'id': id,'storeProdPId':storeProdPId },
            cols: [
                [ //标题栏
                    { field: 'createTime',  title: '时间',templet: "<div>{{layui.util.toDateString(d.createTime,'yyyy-MM-dd HH:mm:ss')}}</div>" },
                    { field: 'creator', title: '操作人' },
                    { field: 'prodSSku', title: '子SKU' },
                    { field: 'storeSSku', title: '店铺子SKU' },
                    { field: 'operType', title: '事件', templet: function (d) {
                        let operTypeTem = ''
                        for (const key in dynamicLogQueryObj) {
                            if (key == d.operType) {
                                operTypeTem = dynamicLogQueryObj[key]
                            }
                        }
                        return operTypeTem
                    } },
                    { field: 'origData', title: '原值', templet:function (d) {
                        let strTem = replacementField(d,'origData') 
                        return strTem 
                    }},
                    { field: 'newData', title: '调整值',
                         width: '25%' ,
                         templet:function (d) {
                        let strTem = replacementField(d,'newData') 
                        return strTem
                    }},
                    { field: 'operDesc', title: '结果', width: '20%' },
                    { field: 'operation', title: '操作' }
                ]
            ],

        })
    }

    function replacementField(d, tips) {
        let str = '<span>:result</span>'
        if (d.operType == 18) {
            let newData = d[tips].split(',') || []
            let resultTem = ''
            for (let index = 0; index < newData.length; index++) {
                if (index == 0) {
                    let strTem = `${newData[index]}(重量)`
                    resultTem += strTem
                }else if (index == 1) {
                    let strTem = `${newData[index]}(运费)`
                    resultTem += strTem
                }else {
                    let strTem = newData[index]
                    resultTem += strTem
                }
            }
            str = str.replace(':result', resultTem)
        }else {
            str = str.replace(':result', d[tips] || '')
        }
        return str
    }

    /**
     * 添加选中数据到arr中
     */
    //监听表格复选框选择
    table.on('checkbox(joom_online_data_table)', function(obj) {
        var checkStatus = table.checkStatus('joom_online_data_table'),
            date = checkStatus.data;
        joom_arr = date;
    });
    /**
     * 批量更新
     * @param itemIds
     */
    function updateBacthJoomItem(itemIds) {
        loading.show();
        if (itemIds == null || itemIds == '') {
            layer.msg("请选择lisiting", { icon: 0 });
            return;
        }
        $.ajax({
            type: "post",
            url: ctx + "/onlineProductJoom/updateBacthItem.html",
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
     * 初始化查询
     */
    joomOnline_changeLocation();

    function joomOnline_changeLocation() {
        if ($("#outof_stock_prod_sku_hidden").length == 1) {
            $("#joom_online_searchtype_sel").val(4); //商品子sku
            joomSkus = $("#outof_stock_prod_sku_hidden").val();
            // $("#joom_online_searchtype_text").val(skus);
            form.render();
            setTimeout(function() {
                // $("#joom_online_search_submit").trigger('click');//搜索对应的在线商品
                $('#joom_online_isEnableSel').next().find('dd:nth-child(3)').trigger('click');
            }, 500); //延迟2s
        }
    }
    /**
     * 获取搜索参数
     */
    function joomOnline_getSerachData() {
        var obj = {};
        obj.storeProdPId = "";
        obj.title = "";
        obj.prodPSku = "";
        obj.prodSSku = "";
        obj.storePSku = "";
        obj.storeSSku = "";
        var currentStoreAccts = [];
        var storeAcctId = $.trim($("#joom_online_store_sel").val()); //所选店铺
        if (storeAcctId == null || storeAcctId == '') { //没有选择店铺
            $("#joom_online_store_sel").children().each(function() {
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
        // var auditStatus = [];
        // $("#joom_online_search_form").find(".layui-form-checked").each(function() {
        //     auditStatus.push($(this).prev().val());
        // });
        // obj.auditStatus = auditStatus.join(",");
        obj.saleType = $.trim($("#joom_online_saletype_sel").val());
        obj.storeProdPId = $.trim($("#joom_online_itemId").val()); //产品ID
        var titleSearchType = $.trim($("#joom_online_title_search_type").val()); //标题检索类型
        obj.titleSearchType = titleSearchType;
        var title = $.trim($("#joom_online_item_title").val()); //产品标题
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
        var searchType = $("#joom_online_searchtype_sel").val();
        var searchText = $.trim($("#joom_online_searchtype_text").val());
        if (searchType == 3) { //商品父SKU
            obj.prodPSku = searchText;
        } else if (searchType == 4) { //商品子SKU
            obj.prodSSku = searchText;
        } else if (searchType == 5) { //店铺父SKU
            obj.storePSku = searchText;
        } else if (searchType == 6) { //店铺子SKU
            obj.storeSSku = searchText;
        }
        obj.orderBy = $.trim($("#joom_online_sortdesc_sel").val()); //排序类型
        obj.isSale = currentIsSale;
        obj.stateList = formSelects.value('joom_online_state', 'valStr');
        let formDoms = $("#joom_online_search_form")
        formDoms.find('select[name=hasActiveVersion]').val() !="" ? obj.hasActiveVersion = formDoms.find('select[name=hasActiveVersion]').val() :''
        obj.salesType= formDoms.find('select[name=salesType]').val() * 1;
        obj.salesStart= formDoms.find('input[name=salesStart]').val()
        obj.salesEnd= formDoms.find('input[name=salesEnd]').val()
        let publishTime = formDoms.find('input[name=publishTime]').val()
        obj.listingStartTimeForm= !!publishTime ? publishTime.split(' - ')[0]:''
        obj.listingStartTimeEnd = !!publishTime ? publishTime.split(' - ')[1] :''
        obj.priceStart= formDoms.find('input[name=priceStart]').val()
        obj.priceEnd= formDoms.find('input[name=priceEnd]').val()
        obj.reviewDetailIdList = formSelects.value('joom_online_reviewDescList', 'valStr');
        obj.isAutoListing = formDoms.find('select[name=isAutoListing]').val()
        obj.prodIsSaleStatus  = formSelects.value('joom_online_prodIsSaleStatus', 'valStr')
        return obj;
    }
});

/**
 * 显示商品详情
 */
function joom_productListShow(obj, storeProdPId) {
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