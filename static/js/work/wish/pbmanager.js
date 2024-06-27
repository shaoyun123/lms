// console.log("pbmanager.js");
layui.use(['admin', 'form', 'table', 'laydate','formSelects'], function() {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        form = layui.form,
        formSelects = layui.formSelects,
        laytpl = layui.laytpl;
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render('select');
    formSelects.render('pbmanager_logisAttr_sel');
    render_hp_orgs_users("#pb_searchForm");
    // $(function() {
    //     //加载组织部门
    //     $.ajax({
    //         type: "post",
    //         url: ctx + "/sys/listAllOrgTreeSel.html",
    //         dataType: "json",
    //         success: function(returnData) {
    //             if (returnData.code == "0000") {
    //                 $(returnData.data).each(function() {
    //                     $("#pb_searchForm select[name=orgId]").append("<option  value='" + this.id + "'>" + this.name + "</option>");
    //                 });
    //                 $("#pb_searchForm select[name=orgId]").next('div').find('dd:first').trigger('click')
    //                 form.render('select');
    //             } else {
    //                 layer.msg("组织部门加载失败" + returnData.msg);
    //             }
    //         }
    //     });

    // });
    //搜索条件选择部门触发事件
// form.on('select(pb-search-org-id)', function(data){
//      $("#pb_searchForm select[name=sellerId]").html('<option value="">选择销售人</option>');
//      var orgId = data.value;
//      if(!orgId){
//          orgId = $(data.elem).find("option").eq(1).attr("value");
//      }
//      $.ajax({
//          type:"post",
//          url:ctx + "/sys/listuserbyorgcode.html",
//          dataType:"json",
//          data:{orgId:orgId},
//          success:function(returnData){
//              if(returnData.code != "0000"){
//                  layer.alert(returnData.msg);
//              }else{
//                  var accts = returnData.data;
//                  if(accts.length>0){
//                      for(var i=0; i<accts.length; i++){
//                          $("#pb_searchForm select[name=sellerId]")
//                             .append('<option value="'+accts[i].id+'">'+accts[i].userName+'</option>')
//                      }
//                  }
//                  form.render('select');
//              }
//          }
//      });
//  }); 
//  form.on('select(users_hp_devPerson_pb)', function (data) {
//      var salesPersonId=data.value;
//      $.ajax({
//          type: "post",
//          data:{salesPersonId:salesPersonId},
//          url: ctx + "/prodpbwish/liststore.html",
//          dataType: "json",
//          success: function (returnData) {
//              if (returnData.code == "0000") {
//                  var str = "<option value=''></option>";
//                  currentStoreAccts=[]
//                  $.each(returnData.data,function (i,v) {
//                      str += "<option value='" + v.id + "'>" + v.storeAcct + "</option>";
//                      currentStoreAccts.push(v.id);
//                  });
//                  $("#pb_searchForm select[name=storeAcctId]").html(str);
//                  form.render('select');
//              } else {
//                  layer.msg(returnData.msg);
//              }
//          }
//      })
//  });
   $("#pb_searchReset").click(function(){
        $("#pb_searchForm select[name=orgId]").next('div').find('dd:first').trigger('click');
   });
    //获取查询条件
    function getSearchData() {
        var data = {};
        data.roleNames = $("#pb_searchForm select[name=sellerId]").data("rolelist");
        data.storeAcctId = $("#pb_searchForm select[name=storeAcctId]").val();
        data.orgId = $("#pb_searchForm select[name=orgId]").val();
        var sellerId = $("#pb_searchForm select[name=sellerId]").val();
        data.sellerId = sellerId;
        data.minProportion = $("#pb_searchForm input[name=minProportion]").val();
        data.maxProportion = $("#pb_searchForm input[name=maxProportion]").val();
        data.activityStatus = $("#pb_searchForm select[name=activityStatus]").val();
        data.prodAttrList = $("#pb_searchForm select[name=pbmanagerProdAttrList]").val();
        data.logisAttrRelation = $("#pb_searchForm select[name=pbmanagerLogisAttrRelation]").val();
        var logisAttr = [];
        var logisAttrSel = formSelects.value("pbmanager_logisAttr_sel");
        for (var i = 0; i < logisAttrSel.length; i++) {
            logisAttr.push($.trim(logisAttrSel[i].value));
        }
        data.logisAttrStr = logisAttr.join(",");
        data.listingStoreSubId = "";
        data.promotionId = "";
        data.pSkus = "";
        data.title = "";
        var searchType = $("#pb_searchForm select[name=searchType]").val();
        var searchValue = $("#pb_searchForm input[name=searchValue]").val();
        data[searchType] = searchValue;
        data.orderBy = $("#pb_searchForm select[name=orderBy]").val();
        //刊登时间
        var listingTime = $("#pb_searchForm input[name=listingTime]").val();
        if (listingTime) {
            data.startListingTimeStr = listingTime.split(" - ")[0];
            data.endListingTimeStr = listingTime.split(" - ")[1];
        } else {
            data.startListingTimeStr = "";
            data.endListingTimeStr = "";
        }
        return data;
    }
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#pbmanagerTable",
        id: "pb_manageTable",
        method:"post",
        url: ctx + '/prodpbwish/listlisting.html', // 数据接口
        where: getSearchData(),
        page: true,
        limits: [100, 500, 1000], // 每页条数的选择项
        limit: 100, //默认显示20条
        cols: [
            [
                {
                    field: "image",
                    title: "缩略图",
                    templet: "#pb_imageTpl",
                    width: '6%'
                }, {
                    field: "storeAcctName",
                    title: "账号",
                    width: '5%'
                }, {
                    field: "seller",
                    title: "销售",
                    width: '5%'
                }, {
                    field: "listingStoreSubId",
                    title: "产品ID",
                    templet: "#pb_listingStoreSubIdTpl",
                    width: '25%'
                }, {
                    field: "title",
                    title: "产品名称",
                    width: '13%'
                }, {
                    field: "pSkus",
                    title: "SKU",
                    width: '7%'
                }, {
                    field: "cost",
                    title: "费用",
                    width: '5%'
                }, {
                    field: "flow",
                    title: "流量",
                    width: '5%'
                }, {
                    field: "orderNum",
                    title: "订单",
                    width: '4%'
                }, {
                    field: "orderTotalAmt",
                    title: "总额",
                    width: '5%'
                }, {
                    field: "proportion",
                    title: "比例",
                    templet: "#pb_proportionTpl",
                    width: '5%'
                }, {
                    field: "activityStatus",
                    title: "状态",
                    templet: "#pb_activityStatusTpl",
                    width: '5%'
                }, {
                    field: "experience7",
                    title: "操作",
                    toolbar: '#barDemo',
                    width: '9%'
                },
            ],
        ],
        done: function(){
            imageLazyload();
            // //表头固定处理
            // // theadHandle().fixTh({ id:'#pbmanagerCard',h:120 })
        }
    });
    //日期范围
    laydate.render({
        elem: '#pb_listTime',
        range: true
    });
    
    //查询
    $('#pb_searchBtn').click(function() {
        //执行重载
        table.reload('pb_manageTable', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: getSearchData()
        });
    });
    //未采集listing点击事件
    $('#pb_noCollectListing').click(function() {
        layer.open({
            title: '未采集listing',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['40%', '40%'],
            btn: ['关闭'],
            shadeClose: false,
            content: $('#pb_unCollectListingLayer').html(),
            success: function(layero, index) {
                $(layero).find("textarea").val("");
                $.ajax({
                    type: "post",
                    url: ctx + "/prodpbwish/uncollectlisting.html",
                    dataType: "json",
                    success: function(returnData) {
                        if (returnData.code != "0000") {
                            layer.alert(returnData.msg);
                        } else {
                            $(layero).find("textarea").val(returnData.data);
                        }
                    }
                });
            }
        })
    });
    //完成活动点击事件
    $('#pb_completeActive').click(function() {
        layer.open({
            title: '完成活动',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['80%', '60%'],
            shadeClose: false,
            btn: ['完成活动', '关闭'],
            content: $('#pb_completeActiveLayer').html(),
            success: function(layero, index) {
                $(layero).find("textarea").val("");

            },
            yes: function(index, layero) {
                var contentList = $(layero).find("textarea").val();
                if (contentList == "") {
                    return;
                }
                $.ajax({
                    type: "post",
                    url: ctx + "/prodpbwish/completepbwish.html",
                    dataType: "json",
                    data: { contentList: contentList },
                    success: function(returnData) {
                        if (returnData.code != "0000") {
                            layer.alert(returnData.msg);
                        } else {
                            layer.alert(returnData.data);
                            table.reload('pb_manageTable', { where: getSearchData() });
                        }
                    }
                });
            }
        })
    });
    //新增产品
    $('#pb_editProdPbListingWish').click(function() {
        editProdPbListingwish();
    });

    function editProdPbListingwish(id) {
        // var title = "新增PB商品"
        // if (id != undefined && id != "") {
        //     title = "修改PB商品";

        // }
        var title = "PB商品详情";
        layer.open({
            title: title,
            type: 1, //不加该属性,就会出现[object Object]
            area: ['70%', '90%'],
            id:'pbmanagerSuccess',
            btn: ['关闭'],
            content: $('#pb_editProdPbListingWishLayer').html(),
            success: function(layero, index) {
                //竞品刊登时间
                laydate.render({
                    elem: '#pb_cmpeListTime'
                });
                if (id != undefined && id != "") {
                    layui.admin.load.show(); 
                    $.ajax({
                        type: "post",
                        url: ctx + "/prodpbwish/getpblisting.html",
                        dataType: "json",
                        data: { id: id },
                        success: function(returnData) {
                            layui.admin.load.hide(); 
                            if (returnData.code != "0000") {
                                layer.alert(returnData.msg);
                                return;
                            }
                            var data = returnData.data;
                            $("#pb_editProdPbListingWishForm input[name=id]").val(data.id);
                            $("#pb_editProdPbListingWishForm select[name=storeAcctId]").val(data.storeAcctId);
                            $("#pb_editProdPbListingWishForm select[name=sellerId]").val(data.sellerId);
                            $("#pb_editProdPbListingWishForm input[name=listingStoreSubId]").val(data.listingStoreSubId);
                            $("#pb_editProdPbListingWishForm input[name=title]").val(data.title);
                            $("#pb_editProdPbListingWishForm input[name=pSkus]").val(data.pSkus);
                            $("#pb_editProdPbListingWishForm input[name=competitorUrl]").val(data.competitorUrl);
                            $("#pb_editProdPbListingWishForm input[name=skill]").val(data.skill);
                            $("#pb_editProdPbListingWishForm textarea[name=remark]").val(data.remark);
                            //如果人员列表中不含人员，添加option并选中
                            var sellerId = $("#pb_editProdPbListingWishForm select[name=sellerId]").val();
                            if(sellerId=="" || sellerId==undefined){
                                $("#pb_editProdPbListingWishForm select[name=sellerId] option:first")
                                    .after('<option selected value="'+data.sellerId+'">'+data.seller+'</option>')
                            }
                            //如果店铺列表中不含，添加option并选中
                            var storeAcctId = $("#pb_editProdPbListingWishForm select[name=storeAcctId]").val();
                            if(storeAcctId=="" || storeAcctId==undefined){
                                $("#pb_editProdPbListingWishForm select[name=storeAcctId] option:first")
                                    .after('<option selected value="'+data.storeAcctId+'">'+data.storeAcctName+'</option>')
                            }
                            //竞品信息
                            $("#pb_editProdPbListingWishForm input[name=cmpeSellingPrice]").val(data.cmpeSellingPrice);
                            $("#pb_editProdPbListingWishForm input[name=cmpeCumuSales]").val(data.cmpeCumuSales);
                            $("#pb_editProdPbListingWishForm input[name=cmpeCollNums]").val(data.cmpeCollNums);
                            $("#pb_editProdPbListingWishForm input[name=cmpeListingTime]").val(format(data.cmpeListingTime, "yyyy-MM-dd"));
                            form.render();
                        }
                    });
                }
                form.render();
            },
            yes: function(index, layero) {
                layer.close(index);
                // form.on('submit(edit-prod-listing-wish-filter)', function(data) {
                //     //保存到后台
                //     var id = $("#pb_editProdPbListingWishForm input[name=id]").val();
                //     var storeAcctId = $("#pb_editProdPbListingWishForm select[name=storeAcctId]").val();
                //     var storeAcctName = $("#pb_editProdPbListingWishForm select[name=storeAcctId] option:selected").text()
                //     var sellerId = $("#pb_editProdPbListingWishForm select[name=sellerId]").val();
                //     var seller = $("#pb_editProdPbListingWishForm select[name=sellerId] option:selected").text()
                //     var listingStoreSubId = $("#pb_editProdPbListingWishForm input[name=listingStoreSubId]").val();
                //     var title = $("#pb_editProdPbListingWishForm input[name=title]").val();
                //     var pSkus = $("#pb_editProdPbListingWishForm input[name=pSkus]").val();
                //     var competitorUrl = $("#pb_editProdPbListingWishForm input[name=competitorUrl]").val();
                //     var cmpeSellingPrice = $("#pb_editProdPbListingWishForm input[name=cmpeSellingPrice]").val();
                //     var cmpeCumuSales = $("#pb_editProdPbListingWishForm input[name=cmpeCumuSales]").val();
                //     var cmpeCollNums = $("#pb_editProdPbListingWishForm input[name=cmpeCollNums]").val();
                //     var cmpeListingTime = $("#pb_editProdPbListingWishForm input[name=cmpeListingTime]").val();
                //     if(cmpeListingTime){
                //         cmpeListingTime = Date.parse(cmpeListingTime);
                //     }
                //     var skill = $("#pb_editProdPbListingWishForm input[name=skill]").val();
                //     var remark = $("#pb_editProdPbListingWishForm textarea[name=remark]").val();
                //     layui.admin.load.show(); 
                //     $.ajax({
                //         type: "post",
                //         url: ctx + "/prodpbwish/savepblisting.html",
                //         dataType: "json",
                //         data: {
                //             id: id,
                //             storeAcctId: storeAcctId,
                //             storeAcctName: storeAcctName,
                //             sellerId: sellerId,
                //             seller: seller,
                //             listingStoreSubId: listingStoreSubId,
                //             title: title,
                //             pSkus: pSkus,
                //             competitorUrl: competitorUrl,
                //             cmpeSellingPrice: cmpeSellingPrice,
                //             cmpeCumuSales: cmpeCumuSales,
                //             cmpeCollNums: cmpeCollNums,
                //             cmpeListingTime: cmpeListingTime,
                //             skill: skill,
                //             remark: remark,
                //         },
                //         success: function(returnData) {
                //             layui.admin.load.hide(); 
                //             if (returnData.code != "0000") {
                //                 layer.alert(returnData.msg);
                //                 return;
                //             } else {
                //                 layer.msg("保存成功");
                //                 layer.close(index);
                //                 table.reload('pb_manageTable', { where: getSearchData() });
                //             }
                //         }
                //     });
                //     return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                // });
                // $("#pb_editProdPbListingWishForm .submit-btn").trigger("click");
            }
        });
        //选择店铺触发事件
        form.on('select(edit-store-acct-id)', function(data) {
            var storeAcctId = data.value;
            var seller = $(data.elem).find("option:selected").attr("data-seller");
            var sellerId = $(data.elem).find("option:selected").attr("data-sellerid");
            var tpl = '<option value=":value">:text</option>';
            tpl = tpl.replace(":value", sellerId);
            tpl = tpl.replace(":text", seller);
            $("#pb_editProdPbListingWishForm select[name=sellerId]").html(tpl);
            form.render();
            // debugger;
        });
    }
    //表格--详情,修改,新增活动等点击事件
    table.on('tool(table-filter)', function(obj) { //注：tool是工具条事件名，demo是table原始容器的属性 lay-filter="对应的值"
            var layEvent = obj.event; //获得 lay-event 对应的值
            var prodPbListingWish = obj.data;
            if (layEvent == 'pbManagerDetail') { //详情
                var index = layer.open({
                    type: 1,
                    title: '详情',
                    area: ['100%', '60%'],
                    shadeClose: false,
                    btn: ['关闭'],
                    content: $('#pbManagerDetail').html(),
                    success: function(layero, index) {
                        //渲染表格下面的数据
                        var listingContent = {};
                        listingContent.competitorUrl = obj.data.competitorUrl;
                        listingContent.skill = obj.data.skill;
                        listingContent.remark = obj.data.remark;
                        listingContent.orderNum = 0;
                        listingContent.orderTotalAmt = 0;
                        if (obj.data.orderTotalAmt) {
                            listingContent.orderNum = (obj.data.orderNum * 1000 / obj.data.flow).toFixed(2);
                            listingContent.orderTotalAmt = (obj.data.orderTotalAmt * 1000 / obj.data.flow).toFixed(2);
                        }
                        if (!listingContent.competitorUrl) {
                            listingContent.competitorUrl = "";
                        }
                        if (!listingContent.skill) {
                            listingContent.skill = "";
                        }
                        if (!listingContent.remark) {
                            listingContent.remark = "";
                        }
                        laytpl($("#pb_listingContentTpl").html()).render(listingContent, function(html) {
                            $("#pb_listingContent").html(html);
                        });
                        //渲染表格
                        table.render({
                            elem: '#pbManagerDetailTable',
                            where: { prodPbListingWishId: prodPbListingWish.id },
                            url: ctx + '/prodpbwish/listprodpbwish.html', // 数据接口
                            cols: [
                                [ //表头
                                    { type: 'numbers' },
                                    { field: 'promotionId', title: '活动ID', width: 200 },
                                    { field: 'promotionName', title: '活动名称', width: 200 },
                                    { field: 'create', title: '时间', templet: "#pb_promotionTimeTpl", width: 200 },
                                    { field: 'budget', title: '预算' },
                                    { field: 'bid', title: '竞价' },
                                    { field: 'cost', title: '成本' },
                                    { field: 'flow', title: '流量' },
                                    { field: 'orderNum', title: '订单' },
                                    { field: 'orderTotalAmt', title: '金额' },
                                    { field: 'proportion', title: '比例', templet: "#pb_proportionTpl" }/*,
                                    { field: 'wealth2', title: '操作', width: 200, toolbar: '#barDemo1', align: 'center' }*/
                                ]
                            ],
                            done: function(res, curr, count) {
                                var $tr = $(layero).find(".layui-table-body.layui-table-main>table>tbody tr");
                                if ($tr.length > 0) {
                                    for (var i = 0; i < $tr.length; i++) {
                                        var tag = res.data[i].tag;
                                        if (typeof(tag) == "undefined") {
                                            tag = "";
                                        }
                                        $tr.eq(i).after("<tr><td></td><td colspan='12'><span  style='color:#999;'>关键词:</span>" + tag + "</td></tr>");
                                    }
                                }
                            }
                        });
                        table.on('tool(demo1)', function(obj) {
                            var layEvent = obj.event; //获得 lay-event 对应的值
                            if (layEvent == 'pbManagerAlterKeyword') { //修改关键字
                                layer.open({
                                    type: 1,
                                    title: '活动关键词',
                                    area: ['40%', '60%'],
                                    shadeClose: false,
                                    btn: ['确定', '关闭'],
                                    content: $('#pbManagerAlterKeyword').html(),
                                    success: function(layero, index) {
                                        var tag = obj.data.tag;
                                        if (typeof(tag) == "undefined") {
                                            tag = "";
                                        }
                                        $(layero).find("textarea").val(tag);
                                    },
                                    yes: function(index, layero) {
                                        if ($(layero).find("textarea").val() == "") {
                                            layer.msg("关键词不能为空");
                                            return;
                                        }
                                        layui.admin.load.show(); 
                                        $.ajax({
                                            type: "post",
                                            url: ctx + "/prodpbwish/saveprodpbwish.html",
                                            dataType: "json",
                                            data: {
                                                id: obj.data.id,
                                                tag: $(layero).find("textarea").val()
                                            },
                                            success: function(returnData) {
                                                layui.admin.load.hide(); 
                                                if (returnData.code != "0000") {
                                                    layer.alert(returnData.msg);
                                                    return;
                                                }
                                                layer.msg("保存成功");
                                                layer.close(index);
                                                table.reload('pbManagerDetailTable', { where: { prodPbListingWishId: prodPbListingWish.id } });
                                            }
                                        });
                                    }
                                })
                            } else if (layEvent == 'pbManagerAlterAction') { //修改活动
                                editPbWish(prodPbListingWish, obj.data.id);
                            }
                        })
                    }
                });
                //    layer.full(index);
            } else if (layEvent == 'pbManagerAlter') { //修改
                editProdPbListingwish(prodPbListingWish.id);
            } else if (layEvent == 'pbManagerAdd') { //新增活动
                editPbWish(prodPbListingWish);
            }
            //编辑活动
            function editPbWish(prodPbListingWish, id) {
                var pbListingId = prodPbListingWish.id;
                if (pbListingId == undefined || pbListingId == "") {
                    layer.msg("参数错误");
                    return;
                }
                var title = "修改";
                if (id == undefined || id == "") {
                    title = "创建";
                }
                layer.open({
                    type: 1,
                    title: title + "活动",
                    area: ['40%', '60%'],
                    shadeClose: false,
                    btn: [title, '取消'],
                    content: $('#pb_managerAdd').html(),
                    success: function(layero, index) {
                        //渲染日期
                        laydate.render({
                            elem: 'input[name=promotionTime]',
                            range: true
                        });
                        //数据
                        $(layero).find("form")[0].reset()
                        $(layero).find("input[name=pbListingId]").val(pbListingId);
                        if (id != undefined && id != "") {
                            layui.admin.load.show(); 
                            $.ajax({
                                type: "post",
                                url: ctx + "/prodpbwish/getpbwish.html",
                                dataType: "json",
                                data: { id: id },
                                success: function(returnData) {
                                    layui.admin.load.hide(); 
                                    if (returnData.code != "0000") {
                                        layer.alert(returnData.msg);
                                        return;
                                    }
                                    var data = returnData.data;
                                    $(layero).find("input[name=id]").val(data.id);
                                    $(layero).find("input[name=bid]").val(data.bid);
                                    $(layero).find("input[name=budget]").val(data.budget);
                                    $(layero).find("input[name=isAutoRenew]").prop("checked", data.isAutoRenew);
                                    $(layero).find("textarea[name=tag]").val(data.tag);
                                    var startTime = format(data.startTime, "yyyy-MM-dd");
                                    var expectedEndTime = format(data.expectedEndTime, "yyyy-MM-dd");
                                    //日期处理
                                    $(layero).find("input[name=promotionTime]").val(startTime + " - " + expectedEndTime);
                                    //活动id
                                    $(layero).find("input[name=promotionId]").val(data.promotionId);
                                    form.render();
                                }
                            });
                        }
                    },
                    yes: function(index, layero) {
                        var id = $(layero).find("input[name=id]").val();
                        var pbListingId = $(layero).find("input[name=pbListingId]").val();
                        var bid = $(layero).find("input[name=bid]").val();
                        var budget = $(layero).find("input[name=budget]").val();
                        var promotionTime = $(layero).find("input[name=promotionTime]").val();
                        var isAutoRenew = $(layero).find("input[name=isAutoRenew]").prop("checked");
                        var tag = $(layero).find("textarea[name=tag]").val();
                        var startTime = Date.parse(promotionTime.split(" - ")[0]);
                        var expectedEndTime = Date.parse(promotionTime.split(" - ")[1]);
                        var listingStoreSubId = prodPbListingWish.listingStoreSubId;
                        var platAcctId = prodPbListingWish.storeAcctId;
                        var promotionId = $(layero).find("input[name=promotionId]").val();
                        var isSyncWish = $(layero).find("input[name=isSyncWish]").prop("checked");
                        //日期处理
                        layui.admin.load.show(); 
                        $.ajax({
                            type: "post",
                            url: ctx + "/prodpbwish/savepbwish.html",
                            dataType: "json",
                            data: {
                                id: id,
                                pbListingId: pbListingId,
                                bid: bid,
                                budget: budget,
                                startTime: startTime,
                                expectedEndTime: expectedEndTime,
                                isAutoRenew: isAutoRenew,
                                tag: tag,
                                promotionId: promotionId,
                                isSyncWish: isSyncWish
                            },
                            success: function(returnData) {
                                layui.admin.load.hide(); 
                                if (returnData.code != "0000") {
                                    layer.alert(returnData.msg);
                                    return;
                                }
                                layer.msg(title + "成功");
                                layer.close(index);
                                table.reload('pbManagerDetailTable', { where: { prodPbListingWishId: prodPbListingWish.id } });
                            }
                        });
                    }
                })
            }
        })
        //表单验证
    form.verify({
        stringnum: function(value, item) {
            if (!new RegExp("^[a-zA-Z0-9]{24}$").test(value)) {
                return '只能输入24个字母与数字的组合';
            }
        }

    });
    //监听活动是否同步WISH
    form.on('switch(pb_isSyncWishFilter)', function(data){
        if(this.checked){
           $(this).parents(".layui-inline").next(".layui-inline").addClass('layui-hide');
        }else{
            $(this).parents(".layui-inline").next(".layui-inline").removeClass('layui-hide');
        }
    });

    //导出PB活动
    $("#pb_export").click(function(){
        layer.confirm('导出PB活动', {icon:3},function(index){
            var url = ctx + "/prodpbwish/exportpb.html";
            var data = getSearchData();
            submitForm(data,url,"_blank");
            layer.close(index);
        });
    });
});

function format(datetime, fmt) {
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
            "S": datetime.getMilliseconds() //毫秒
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
//销售人员支持搜索不在select的人员(bug：填写人员后选择“选择销售人员”，第一次失败)
$("html").on("blur", "#pb_searchForm .sellect-seller input", function(){
    var seller = $(this).val();
    var sellerId = $("#pb_searchForm select[name='sellerId']").val();
    //延时（在layui重新渲染之后）
    setTimeout(function(){
        //1、输入的值select没有， 2、select没有被改变（选择了不在select内的值，select不会被修改）
        if($("#pb_searchForm select[name='sellerId'] option:contains("+seller+")").length ==0
            && sellerId == $("#pb_searchForm select[name='sellerId']").val()) {
            $("#pb_searchForm .sellect-seller input").val(seller);
            $("#pb_searchForm select[name='sellerId']").val("");
        }
        console.log("select"+$("#pb_searchForm select[name='sellerId']").val());
        console.log("input"+$("#pb_searchForm .sellect-seller input").val());
    }, 300);
})