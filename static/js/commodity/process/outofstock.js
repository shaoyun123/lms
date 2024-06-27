/**
 * 采购员对应的整合人员映射js
 */
layui.use(['admin', 'layer', 'table',  'form','laytpl','element','laypage','laydate', "formSelects"], function () {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        laydate=layui.laydate,
        formSelects = layui.formSelects,
        form = layui.form;
    formSelects.render('outofstock_findSupplyType_sel');
    form.render('select');
    form.render('radio');
    form.render('checkbox');
    /**
     * 日期渲染
     */
    laydate.render({
        elem: '#outofstock_outofTime_text',
        range: true
    });
    laydate.render({
        elem: '#outofstock_actualArrivalTime_text',
        range: true
    });
    laydate.render({
        elem: '#outofstock_expectedArrivalTime_text',
        range: true
    });

// 初始化设置日期为当前1个月内时间
    var date = new Date()
    var endTime = format(date, 'yyyy-MM-dd')
    date.setDate(date.getDate() - 60);
    var beginTime = format(date, 'yyyy-MM-dd')
    var timeStr = beginTime + ' - ' + endTime
    $('#outofstock_outofTime_text').val(timeStr)

    //远程搜索功能
    var dim = new DimSearch('#outofstock_newSupplyName_text', 'outstock_supplierId');
    dim.init();

    var formDom = $("#outofstock_searchForm")
    if (formDom.length == 0) {
        layer.msg('初始化部门-人员表单失败，未找到表单')
    }
    var buyerUserSelect = formDom.find('.users_buyer_custom');
    var buyerOrgSelect = formDom.find('.orgs_buyer_custom');
    var buyerRoleNames = buyerUserSelect.data('rolelist')
    // 部门-采购专员选择框初始化
    render_developer_orgs_users(buyerUserSelect,buyerOrgSelect,buyerRoleNames);
    var developerUserSelect = formDom.find('.users_hp_custom');
    var developerOrgSelect = formDom.find('.orgs_hp_custom');
    var developerRoleNames = developerUserSelect.data('rolelist');
    // 部门-开发专员选择框初始化
    render_developer_orgs_users(developerUserSelect,developerOrgSelect,developerRoleNames);
    render_hp_orgs_users('#outofstock_searchForm')

    function render_developer_orgs_users(userSelect,orgSelect,roleNames) {
        // 发送请求获取相应人员信息及其对应组织
        $.ajax({
            type: 'post',
            url: ctx + '/sys/getPersonAndOrgsByRole.html',
            dataType: 'json',
            data: {roleNames: roleNames},
            success: function (returnData) {
                userSelect.empty();
                orgSelect.empty();
                if (returnData.code == '0000') {
                    var data
                    data = returnData.data
                    // 初始化部门
                    orgSelect.append(getAOption('', ''));
                    for (var i in data.orgTree) {
                        setOrgs(data.orgTree[i], orgSelect, 0)
                    }

                    // 初始化展示所有人员
                    var userJSON = dealUser_org(data.userList)
                    userSelect.append(getAOption('', ''));
                    for (var i = 0; i < userJSON.all.length; ++i) {
                        userSelect.append(getAOption(userJSON.all[i].id, userJSON.all[i].userName))
                    }
                    // 部门选择联动事件
                    layui.form.on('select(' + orgSelect.attr('lay-filter') + ')', function (data) {
                        //选择部门下的用户
                        userSelect.html('')
                        var orgId = data.value
                        var userList = userJSON[orgId]
                        if (orgId != '') {
                            userSelect.append(getAOption('', ''));
                            if (userList) {
                                for (var i = 0; i < userList.length; ++i) {
                                    userSelect.append(getAOption(userList[i].id, userList[i].userName))
                                }
                            }
                        } else {
                            userSelect.append(getAOption('', ''))
                            for (var i = 0; i < userJSON.all.length; ++i) {
                                userSelect.append(getAOption(userJSON.all[i].id, userJSON.all[i].userName))
                            }
                        }
                        // 执行自定义的部门选择事件
                        orgSelect.change()
                        formSelects.render('users_hp_buyer_newdevelop')
                        layui.form.render('select')
                    })
                    formSelects.render('users_hp_buyer_newdevelop')
                    layui.form.render('select')
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function () {
                layer.msg('发送请求失败')
            }
        })
    }

    // 初始化 开发专员查询项为 当前登录人
    initPersonCondition(['开发专员'],['开发组长', '开发主管'],$('#outofstock_searchForm [name=developerId]'), 'id')
    /**
     * 初始化人员选择框
     */
    outofstock_initIntegratorMappingSelData();
    // outofstock_loadTable();//检索
    var outofstock_mapping_enableUser = {};//在职人员
   /* var outofstock_mapping_purchasingAgentList = {};//采购专员
    var outofstock_mapping_preprodDevList = {};//开发专员*/
    var outofstock_mapping_intergationList = {};//整合人员
    function outofstock_initIntegratorMappingSelData() {
     /*   $("#outofstock_mapping_buyer_sel").html("<option value=''>请选择</option>");*/
        $("#outofstock_mapping_integrator_sel").html("<option value=''>请选择</option>");
     /*   $("#outofstock_mapping_developer_sel").html("<option value=''>请选择</option>");*/
        $.ajax({
            url: ctx + "/msgPreprodBuyer/getSysUserList.html",
            dataType: "json",
            type: "post",
            success: function (returnData) {
                if (returnData.code = '0000') {
                    var obj = returnData.data;
                    outofstock_mapping_enableUser = obj.allUserList;
                   /* outofstock_mapping_purchasingAgentList = obj.purchasingAgentList;
                    outofstock_mapping_preprodDevList = obj.preprodDevList;*/
                    outofstock_mapping_intergationList = obj.intergationList;
                  /*  $(outofstock_mapping_purchasingAgentList).each(function () {
                        $("#outofstock_mapping_buyer_sel").append("<option value='" + this.id + "'>" + this.userName + "</option>");
                    });*/
                    $(outofstock_mapping_intergationList).each(function () {
                        $("#outofstock_mapping_integrator_sel").append("<option value='" + this.id + "'>" + this.userName + "</option>");
                    });
                  /*  $(outofstock_mapping_preprodDevList).each(function () {
                        $("#outofstock_mapping_developer_sel").append("<option value='" + this.id + "'>" + this.userName + "</option>");
                    });*/
                    form.render('select');
                }
            },
            error: function () {
                layer.msg("初始化人员失败，服务器正忙", {icon: 5});
            }
        });
    }

    // 初始化仓库
    initSelectByAjax('/prodWarehouse/searchProdWarehouse',{storeType: 1,status: 1},{name: 'warehouseName',value: 'id'},'#outofstock_searchForm [name=storeId]',form,null,)


    // 模板查询赋值
    commonSaveSearchTpl({
        id: "outofstock_save",
        formId: "outofstock_searchForm",
        pageName: "outofstock",
        searchBtnId: "outof_stock_search_submit",
        cb: param => outofstock_formVal(param),
        btnText: '',
        layerTitleText: ''
    })

    function outofstock_formVal(param) {
        $('#outofstock_reset_btn').trigger('click')
        // 给表单赋值
        form.val("outofstock_searchForm", param)
        form.render()
        let multiSelectObj = {
            buyerId: "users_hp_buyer_newdevelop",
            findSupplyType: 'outofstock_findSupplyType_sel'
          };
          Object.keys(multiSelectObj).forEach((item) => {
            if (param[item]) {
              formSelects.value(
                multiSelectObj[item],
                param[item].split(","),
                true
              );
            } else {
              formSelects.render(multiSelectObj[item]);
            }
          });
        // 执行搜索
        $("#outof_stock_search_submit").click()
    }
    //监听iframe传参
    window.addEventListener('message', function(event){
        let { ifManager, isSale, findSupplyType, expectedArrivalTimeType } = event.data || {}
        if (findSupplyType || expectedArrivalTimeType || isSale) {
            $('#outofstock_isSale_sel').val(isSale)
            layui.formSelects.value('outofstock_findSupplyType_sel', [findSupplyType]); 
            $('#outofstock_expectedArrivalTimeType_sel').val(expectedArrivalTimeType)
            if (ifManager == 'false') {
                var username = localStorage.getItem('lmsAppUserName');
                // 获取采购专员下拉框数据
                let purcahseUser = $('#outofstock_mapping_buyer_sel option')
                purcahseUser?.each(function (index, item) {
                    if ($(item).text() == username) {
                        $(item).prop('selected', true)
                    }
                })
            }
            form.render()
            outofstock_loadTable();
        }
    });
    
    /**
     * 批量操作
     */
    form.on('select(outof_stock_bacth_deal_sel)', function (data) {
        var selected = $.trim(data.value);
        if (selected == null || selected == '') {
            return false;
        }
        var ids = [];
        var skus=[];
        if(selected>0){
            var itemData = table.checkStatus('outof_stock_data_table').data; //获取选择的店铺
            if (itemData == null || itemData.length < 1) {
                layer.msg("请选择记录", {icon: 0});
                return;
            }
            if(selected<4){
                for (var index in itemData) {
                    ids.push(itemData[index].id);
                    const prodSSku=itemData[index].prodSSku;
                    if(!$.isEmptyObject(prodSSku)){
                        skus.push(prodSSku);
                    }
                }
            }else if(selected<9){
                for (var index in itemData) {
                    var prodSSku=itemData[index].prodSSku;
                    if(!$.isEmptyObject(prodSSku)){
                        skus.push(prodSSku);
                    }
                }
                var skuStr=skus.join(",");
                $("#outof_stock_prod_sku_hidden").remove();
                $("#LAY_app").append("<input type='hidden' id='outof_stock_prod_sku_hidden' value='"+skuStr+"'></input>")
            }
        }
        if (selected == 1) {//采购处理
            outof_stock_buyerDeal(ids);
        }else if(selected == 2){//标记到货
            outof_stock_markArrival(ids);
        }else if(selected == 3){//找供应商
            outof_stock_findSupply(ids, skus, true);
        }else if(selected == 4){//wish上下架
            location.hash = '#/route/publishs/wish/onlineproduct';
        }else if(selected == 5){//ebay标零补货
            location.hash = '#/route/publishs/ebay/onlineproduct';
        }else if(selected == 6){//smt标零补货
            location.hash = '#/route/publishs/aliexpress/smt_onlineproduct';
        }else if(selected == 7){//shopee标零补货
            location.hash = '#/route/publishs/Shopee/onlineproduct';
        }else if(selected == 8){//joom上下架
            location.hash = '#/route/publishs/Joom/onlineproduct';
        }
    });
    /**
     * 导出缺货信息
     */
    $('#outofstock_importData_btn').click(function(){
        var data=outofstock_getSerachData();//搜索参数
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的缺货信息？',{btn:['确认','取消']},function (result) {
            if(result){
                layer.close(Confirmindex );
                submitForm(data,ctx + '/outofStock/exportOutofStock.html',"_blank");
            }
        })
    });
    /**
     * 导出smt缺货订单信息
     */
    $('#outofstock_importSmtOufofOrderData_btn').click(function(){
        var data=outofstock_getSerachData();//搜索参数
            // data.expectedArrivalDayStart=7;
            submitForm(data,ctx + '/outofStock/exportPlatOutofStockOrder.html',"_blank");
    });
    // 录入缺货sku点击
    $('#outofstock_inputShortageSku_btn').click(function(){
        var index = layer.open({
            type: 1,
            title: '录入缺货SKU',
            offset: '100px',
            area: ['60%', '40%'],
            content: $('#outofstock_inputShortageSkuLayer').html(),
            btn: ['保存', '关闭'],
            yes: function(index, layero) {
                let prodSSkus=$.trim($("#outof_stock_skus_textarea").val());
                prodSSkus=prodSSkus.replace(/\n/g,",");
                let Adata = {
                    prodSSkus: prodSSkus,
                    storeId: parseInt($('#outofstock_inputShortageSkuForm').find('[name=storeId]').val())
                }
                if (!Adata.storeId) {
                    layer.msg('请选择仓库')
                    return
                }
                if (!Adata.prodSSkus) {
                    layer.msg('请填写sku')
                    return
                }
                loading.show();
                oneAjax.post({
                    url: '/outofStock/addOutofStockP.html',
                    data: JSON.stringify(Adata),
                    success: function (returnData) {
                        loading.hide();
                        if (returnData.code === "0000") {
                            layer.closeAll();
                            var content=returnData.msg;
                            var existsOutofSkus=returnData.data.existsOutofSkus;
                            if (existsOutofSkus != null && existsOutofSkus.length > 0) {
                                content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;忽略已导入缺货sku：" + existsOutofSkus.length + " 条";
                            }
                            var noOutofSkus=returnData.data.noOutofSkus;//sku不存在记录
                            if (noOutofSkus != null && noOutofSkus.length > 0) {
                                content += "</br>&nbsp;&nbsp;&nbsp;&nbsp;sku记录不存在：" + noOutofSkus.length + " 条";
                            }
                            layer.open({
                                title: '录入缺货SKU操作结果',
                                content: content,
                                offset: '100px',
                                area: '500px',
                                yes: function(index, layero){
                                    outofstock_loadTable(); //导入后刷新列表
                                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                                }
                            });
                        } else {
                            layer.msg(returnData.msg,{icon:5});
                        }
                    },
                    error: function () {
                        loading.hide();
                        layer.msg("服务器正忙",{icon:5});
                    }
                });
            },
            success: function(layero, index) {
                $('#outofstock_inputShortageSkuForm').find('[name=storeId]').append($('#outofstock_searchForm').find('[name=storeId]').html())
                form.render('select','outofstock_inputShortageSkuForm')
            }
        })
    });
    //找供应商点击
    $('.findSuppliers').click(function(){

    })
    //采购处理点击
    $('.purchasehandle').click(function(){
        var index = layer.open({
            type: 1,
            title: '采购处理',
            area: ['70%', '50%'],
            content: $('#purchasehandleLayer').html(),
            btn: ['保存', '关闭'],
            yes: function(index, layero) {
                console.log(index)
            },
            success: function(layero, index) {
                form.render('radio')
            }
        })
    })
    //标记到货单击
    $('.markedarrival').click(function(){
        var index = layer.open({
            type: 1,
            title: '标记到货',
            area: ['50%', '30%'],
            content: $('#markedarrivalLayer').html(),
            btn: ['保存', '关闭'],
            yes: function(index, layero) {
                console.log(index)
            },
            success: function(layero, index) {
                form.render('radio')
            }
        })
    })

    // 搜索按钮
    $('#outof_stock_search_submit').click(function(){
        outofstock_loadTable();
    })
    /**
     * 搜索
     */
    function outofstock_loadTable() {
        var searchData = outofstock_getSerachData();
        table.render({
            elem: "#outof_stock_data_table",
            method: 'post',
            url: ctx + "/outofStock/searchOutofStockPInfo.html",
            where: searchData,
            cols: [
                [
                    {checkbox: true, width: 25},
                    {field: "mainImage", unresize: true, width: 65, title: "图片", templet: "#outof_stock_mainImage_tpl"},
                    {field: 'prodSSku', title: "Sku", width: 120, style: "text-align:left;", templet: '#outof_stock_prodSSku_tpl'},
                    {field: 'prodTitle', title: "商品名称", width: 120, style: "text-align:left;", templet: '#outof_stock_prodTitle_tpl'},
                    {field: "buyer", title: "专员", width: 100, templet: '#outof_stock_buyer_tpl'},
                    {field: "buyNum", title: "缺货数量", sort: true, width: 80,},
                    {field: "hisOnwayStock", title: "缺货时在途", sort: true, width: 130,},
                    {field: "onwayStock", title: "当前在途", sort: true, width: 130,},
                    {field: "scanInfo", title: "物流信息", filter: true},
                    {field: "buyerRemark", title: "采购备注", templet: '#outof_stock_buyerRemark_tpl'},
                    {field: "findSupplyType", title: "找供应商", templet: '#outof_stock_findSupplyType_tpl'},
                    {title: "缺货时销量", templet: '#outof_stock_sales_tpl'},
                    {title: "缺货时天数", templet: '#outof_stock_days_tpl'},
                    {field: "outofTime", title: "时间", width: 142, templet: '#outof_stock_outofTime_tpl'},
                    {field: "oldSupply", title: "原供应商", templet: '#outof_stock_oldSupplyName_tpl'},
                    {field: "avgReceiveDay", title: "默认供应商平均到货天数"},
                    {field: "newSupplyName", title: "新供应商", templet: '#outof_stock_newSupplyName_tpl'},
                    {field: "newSupplyRemark", title: "新供应商备注", templet: '#outof_stock_newSupplyRemark_tpl'},
                    {title: '操作', width: 100, align: 'center', templet: '#outof_stock_operate_tpl'}
                ],
            ],
            done: function (res, curr, count) {
                //懒加载
                imageLazyload();
                if (res.code == '0000') {
                    if (res.msg != null) {
                        $("#outof_stock_num_span").html(res.count);//在线
                    }
                }
            },
            page: true,
            id: "outof_stock_data_table",
            limits: [20, 50, 100, 300, 500],
            limit: 100
        });
        //工具条的监听事件,table.on(tool(表格的lay-filter的值))
        table.on('tool(outof_stock_data_table)', function (obj) {
            var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
            var id = data.id;
            var ids=[];
            ids.push(id);
            if (layEvent == "outof_stock_buyer_deal") { //采购处理
                outof_stock_buyerDeal(ids,data);//
            } else if (layEvent == 'outof_stock_mark_arrival') {//标记到货
                outof_stock_markArrival(ids)
            } else if (layEvent == "outof_stock_find_supply") { //找供应商
                const skus = []
                skus.push(data.prodSSku)
                outof_stock_findSupply(ids, skus, false)
            } else if (layEvent == "outof_stock_showlog") { //查看日志
                layer.open({
                    type: 1,
                    title: '查看日志',
                    shadeClose: false,
                    area: ['60%', '60%'],
                    content: $('#outof_stock_showlog_layer').html(),
                    success: function () {
                        outof_stock_showlog(id,data.remark);
                    }
                })
            }
        });

        table.on('sort(outof_stock_data_table)', function(obj) {
            imageLazyload();
        })
    };

    /**
     * 采购处理
     */
    function outof_stock_buyerDeal(ids,oneData){
        if(ids==null||ids.length<1){
            layer.msg('请选择记录',{icon:2});
            return;
        }
        var index = layer.open({
            type: 1,
            title: '采购处理',
            offset: '100px',
            area: ['70%', '50%'],
            content: $('#outof_stock_purchasehandleLayer').html(),
            btn: ['保存', '关闭'],
            yes: function(index, layero) {
                var exceptedArrivalTime=$.trim($("#outof_stock_exceptedArrivalTime_input").val());
                if($.isEmptyObject(exceptedArrivalTime)){
                    layer.msg("预计到货时间不能为空",{icon:0});
                    return ;
                }
                var buyerRemark=$.trim($("#outof_stock_buyerRemark_input").val());
                var dealType=1;//处理类型 预计到货
                var updateJson=[];
                for(var x=0;x<ids.length;x++){
                    var obj={};
                    obj.id=ids[x];
                    obj.expectedArrivalTime=exceptedArrivalTime;
                    obj.remark=buyerRemark;
                    updateJson.push(obj);
                }
                loading.show();
                $.ajax({
                    url: ctx + '/outofStock/dealOutofStockP.html',
                    data:{"dealType":dealType,"updateJson":JSON.stringify(updateJson),"smtDay":"7"},
                    dataType: "json",
                    type: "post",
                    success: function (returnData) {
                        loading.hide();
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg(returnData.msg,{icon:1});
                        } else {
                            layer.msg(returnData.msg,{icon:5});
                        }
                    },
                    error: function () {
                        loading.hide();
                        layer.msg("服务器正忙",{icon:5});
                    }
                });
            },
            success: function(layero, index) {
                laydate.render({
                    elem: '#outof_stock_exceptedArrivalTime_input',
                    range: false
                });
                // debugger
                if(oneData){
                    $("#outof_stock_exceptedArrivalTime_input").val(oneData.expectedArrivalTime ? Format(oneData.expectedArrivalTime, "yyyy-MM-dd") : '');
                    $("#outof_stock_buyerRemark_input").val(oneData.buyerRemark);
                }
            }
        })
    };

    /**
     * 标记到货
     */
    function outof_stock_markArrival(ids){
        if(ids==null||ids.length<1){
            layer.msg('请选择记录',{icon:2});
            return;
        }
        var index = layer.open({
            type: 1,
            title: '标记到货',
            offset: '100px',
            area: ['30%', '20%'],
            content: $('#outof_stock_actualhandleLayer').html(),
            btn: ['保存', '关闭'],
            yes: function(index, layero) {
                var actualArrivalTime=$.trim($("#outof_stock_actualArrivalTime_input").val());
                if($.isEmptyObject(actualArrivalTime)){
                    layer.msg("实际到货时间不能为空",{icon:0});
                    return ;
                }
                var dealType=2;//处理类型 实际到货
                var updateJson=[];
                for(var x=0;x<ids.length;x++){
                    var obj={};
                    obj.id=ids[x];
                    obj.actualArrivalTime=actualArrivalTime;
                    updateJson.push(obj);
                }
                loading.show();
                $.ajax({
                    url: ctx + '/outofStock/dealOutofStockP.html',
                    data:{"dealType":dealType,updateJson:JSON.stringify(updateJson)},
                    dataType: "json",
                    type: "post",
                    success: function (returnData) {
                        loading.hide();
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            layer.msg(returnData.msg,{icon:1});
                        } else {
                            layer.msg(returnData.msg,{icon:5});
                        }
                    },
                    error: function () {
                        loading.hide();
                        layer.msg("服务器正忙",{icon:5});
                    }
                });
            },
            success: function(layero, index) {
                laydate.render({
                    elem: '#outof_stock_actualArrivalTime_input',
                    range: false,
                    value:new Date(),
                });
            }
        })
    };

    /**
     * 找供应商
     * @param ids
     */
    function outof_stock_findSupply(ids, skus, isBatch = false){
        if(ids==null||ids.length<1){
            layer.msg('请选择记录',{icon:2});
            return;
        }
        const skuStr = skus.join()
        var index = layer.open({
            type: 1,
            title: `<span class="outof_stock_findSuppliersLayer_title">找供应商_${skuStr}</span>`,
            offset: '100px',
            area: ['70%', '50%'],
            content: $('#outof_stock_findSuppliersLayer').html(),
            btn: ['保存', '关闭'],
            yes: function(index, layero) {
                $("#outof_stock_supply_submit_btn").click();
            },
            success: function(layero, index) {
                form.render('radio');
                /**初始赋值供应商**/
                if(ids.length==1){
                    loading.show();
                    $.ajax({
                        url: ctx + '/outofStock/getOutofStockPSupply.html',
                        data:{"pid":ids[0]},
                        dataType: "json",
                        type: "post",
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                var rdata=returnData.data;
                                if(rdata!=null){
                                    var ovalue={};
                                    $(rdata).each(function (index,element) {
                                        index=index+1;
                                        ovalue['supply'+index+'Name']=element.supplyName;
                                        ovalue['supply'+index+'Url']=element.supplyUrl;
                                        ovalue['supply'+index+'Remark']=element.remark;
                                    });
                                    form.val("outof_stock_findSuppliers_form_filter", ovalue);
                                }
                                loading.hide();
                            }else {
                                loading.hide();
                                layer.msg(returnData.msg,{icon:5});
                            }
                        },
                        error: function () {
                            loading.hide();
                            layer.msg("服务器正忙",{icon:5});
                        }
                    });
                }
                /**提交找供应商信息**/
                form.on('submit(outof_stock_supply_form)', function(data){
                    var sobj=[];
                    var field=data.field;
                    var findType =field.findType;
                    if(findType==1){//找到供应商
                        if(field==null||field.supply1Name == null || $.trim(field.supply1Name) == ''){
                            layer.msg("找到供应商时，至少填写一个供应商信息！",{icon:0});
                            return false;
                        }
                        for(var num=1;num<6;num++){
                            if(field['supply'+num+'Name'] !=null && $.trim(field['supply'+num+'Name']) != ''){//供应商1
                                var su={};
                                var sname=field['supply'+num+'Name'];
                                var surl=field['supply'+num+'Url'];
                                var sremark=field['supply'+num+'Remark'];
                                if(surl == null || surl == ''){
                                    layer.msg("供应商"+num+"存在时，链接"+num+"必填",{icon:0});
                                    return false;
                                }
                                if(sremark == null||sremark =='' ){
                                    layer.msg("供应商"+num+"存在时，备注"+num+"必填",{icon:0});
                                    return false;
                                }
                                su.supplyName=sname;
                                su.supplyUrl=surl;
                                su.supplyRemark=sremark;
                                sobj.push(su);
                            }
                        }
                    }
                    var updateJson=[];
                    for(var x=0;x<ids.length;x++) {
                        var obj = {};
                        obj.id = ids[x];
                        obj.sobj=sobj;
                        updateJson.push(obj);
                    }
                    loading.show();
                    $.ajax({
                        url: ctx + '/outofStock/findOutofStockSupply.html',
                        data:{"findType":findType,updateJson:JSON.stringify(updateJson)},
                        dataType: "json",
                        type: "post",
                        success: function (returnData) {
                            loading.hide();
                            if (returnData.code == "0000") {
                                layer.closeAll();
                                layer.msg(returnData.msg,{icon:1});
                            } else {
                                layer.msg(returnData.msg,{icon:5});
                            }
                        },
                        error: function () {
                            loading.hide();
                            layer.msg("服务器正忙",{icon:5});
                        }
                    });
                    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                });
                form.on('radio(outof_stock_find_supply_radio)', function(data){
                    if(data.value==2){
                        $("#outof_stock_findSuppliers_div").hide();
                    }else{
                        $("#outof_stock_findSuppliers_div").show();
                    }
                });

                // 停售商品
                $('#outof_stock_findSuppliers_markNotSale_btn').click(function(){
                    layer.confirm('确定要停售该商品吗?', {icon: 3, title: '提示'}, function(confirmIndex){
                        commonReturnPromise({
                            url: '/lms/outofStock/markNotSale',
                            type: 'post',
                            contentType: 'application/json',
                            params: JSON.stringify({idList: ids})
                        }).then(()=>{
                            layer.msg('操作成功', {icon: 1})
                            layer.close(confirmIndex);
                        })
                      });     
                        
                })
                $('.outof_stock_findSuppliersLayer_title').on('mouseenter', function () {
                        layer.tips(skuStr, $(this), { 
                            tips: [1, '#333'],
                            time: 0,
                            area: [skus.length>10 ? '400px': 'auto', 'auto']
                        }) //在元素的事件回调体中，follow直接赋予this即可
                  }).on('mouseleave', function () {
                    layer.closeAll('tips')
                  })
            }
        })
    }
    //监听表格寻找货源点击事件
    $('#outofstockCard').on('click', '.searchSupply', function(){
        let picUrl = $(this).attr('data-image');
        if(!picUrl){
          return layer.msg('无图片不可查找货源', {icon: 7});
        }
        window.open('https://www.1688.com?pordUrl=' + picUrl)
      //   commonSearchGoodsComponents(picUrl);
      });
    /**
     * 显示日志
     */
    function outof_stock_showlog(pid,remark){
        table.render({
            elem: '#outof_stock_showlog_table',
            method: 'post',
            url: ctx + '/outofStock/getOutofStockPLog.html',
            where:{'pid':pid,"remark":remark},
            cols: [[ //标题栏
                {field: 'createTime', title: '时间' ,templet:"#outof_stock_showlog_timeTpl"}
                ,{field: 'operateDesc', title: '事件'}
                ,{field: 'creator', title: '操作人'}
            ]],
        })
    }
    /**
     * 获取搜索参数
     */
    function outofstock_getSerachData() {
        let infoObj = serializeObject($('#outofstock_searchForm'))
        var obj = {};
        obj.buyerIdStr = infoObj.buyerId;
        if ($.trim($("#outofstock_mapping_buyer_organize_sel").val())) {
            if (!obj.buyerIdStr) {
                var buyerIdList = []
                let elem = $('#outofstock_searchForm').find('[name=buyerId]')
                if (elem.hasClass('xm-hide-input')) {
                    elem = elem.closest('.xm-select-parent').prev('select[xm-select]')
                    var options = $(elem).find('option')
                    var value
                    for (var i = 0; i < options.length; ++i) {
                        value = options[i].getAttribute('value')
                        if (value) {
                            buyerIdList.push(value)
                        }
                    }
                    obj.buyerIdStr = buyerIdList.join(',')
                }
            }
        }
        obj.integratorId = $.trim($("#outofstock_mapping_integrator_sel").val());
        obj.developerIdStr = $.trim($("#outofstock_mapping_developer_sel").val());
        if ($.trim($("#outofstock_mapping_developer_organize_sel").val())) {
            if (!obj.developerIdStr) {
                var developerIdList = []
                var options = $('#outofstock_searchForm [name=developerId] option')
                var value
                for (var i = 0; i < options.length; ++i) {
                    value = options[i].getAttribute('value')
                    if (value) {
                        developerIdList.push(value)
                    }
                }
                obj.developerIdStr = developerIdList.join(',')
            }
        }
        var skuType = $.trim($("#outofstock_skutype_sel").val());
        if (!$.isEmptyObject(skuType)) {
            var skus = $.trim($("#outofstock_skus_text").val());
            if (skuType == 1) {
                obj.prodSSkuType = 2;//
                obj.prodSSkus = skus;
            } else if (skuType == 2) {
                obj.prodPSkuType = 2;//
                obj.prodPSkus = skus;
            } else if (skuType == 3) {
                obj.prodSSkuType = 1;//
                obj.prodSSkus = skus;
            } else if (skuType == 4) {
                obj.prodPSkuType = 1;//
                obj.prodPSkus = skus;
            }
        }
        obj.isSale = $.trim($("#outofstock_isSale_sel").val());
        obj.sourceType = $.trim($("#outofstock_sourceType_sel").val());
        obj.outofTimeType = $.trim($("#outofstock_outofTimeType_sel").val());//缺货时间类型 1缺货时间 2到货时间 3采购找不到 4整合找不到 5开发找不到
        var outofTime = $.trim($("#outofstock_outofTime_text").val());//刊登时间
        if (outofTime != null) {
            obj.outofTimeStart = outofTime.substring(0, 10);
            obj.outofTimeEnd = outofTime.substring(13);
        }
        obj.expectedArrivalTimeType = $.trim($("#outofstock_expectedArrivalTimeType_sel").val());//预计到货时间类型
        var expectedArrivalTime = $.trim($("#outofstock_expectedArrivalTime_text").val());//预计到货时间
        if (expectedArrivalTime != null) {
            obj.expectedArrivalTimeStart = expectedArrivalTime.substring(0, 10);
            obj.expectedArrivalTimeEnd = expectedArrivalTime.substring(13);
        }
        var actualArrivalTime = $.trim($("#outofstock_actualArrivalTime_text").val());//预计到货时间
        if (expectedArrivalTime != null) {
            obj.actualArrivalTimeStart = actualArrivalTime.substring(0, 10);
            obj.actualArrivalTimeEnd = actualArrivalTime.substring(13);
        }
        obj.expectedArrivalDayStart = $.trim($("#outofstock_expectedArrivalDayStart_text").val());
        obj.expectedArrivalDayEnd = $.trim($("#outofstock_expectedArrivalDayEnd_text").val());
        obj.findSupplyType = $.trim($("#outofstock_searchForm").find('[name=findSupplyType]').val());
        obj.buyerRemark = $.trim($("#outofstock_buyerRemark_text").val());
        obj.isArrival = $.trim($("#outofstock_isArrival_sel").val());
        obj.orderBy = $.trim($("#outofstock_sortdesc_sel").val());
        obj.lackNum = $.trim($("#outofstock_lackNum_text").val());
        obj.yiwuOnWayStock = $.trim($("#outofstock_yiwuOnWayStock_text").val());
        // obj.newSupplyName = $.trim($("#outofstock_newSupplyName_text").val());
        obj.supplierName = $.trim($("#outofstock_newSupplyName_text").val());
        obj.storeId = $.trim($("#outofstock_storeId").val());
        return obj;
    }
});