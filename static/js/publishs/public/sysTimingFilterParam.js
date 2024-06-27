layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element','formSelects'], function () {
    var admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        table = layui.table,
        laydate = layui.laydate,
        formSelects = layui.formSelects,
        form = layui.form;
    console.log(sysTiming_plat_code)
    tableReload(open_jobHandler);
    function tableReload(obj) {
        var cols;
        if(sysTiming_plat_code==='ebay'){
             cols= [[
                { field: "id", title: "id",width:1  },
                { field: "jobHandler", title: "jobHandler"},
                { field: "site", title: "站点"},
                 { field: "storeAcct", title: "店铺"},
                 { field: "storeAcctId", title: "店铺",width:1 },
                 { field: "country", title: "物品所在国"},
                 { field: "shippingService", title: "店铺运输方式"},
                 { field: "listingTimeStart",templet: '<div>{{ Format(d.listingTimeStart,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围开始"},
                 { field: "listingTimeEnd",templet: '<div>{{ Format(d.listingTimeEnd,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围结束"},
                 { field: "prodCreateDays", title: "<=商品创建时间天数"},
                 { field: "dayNums", title: "<=距离刊登时间天数"},
                { field: "prodSSku", title: "商品sku",width:200,templet:function(d){
                    return  showPartProdSSku(d.prodSSku)
                }},
                { field: "prodTag", title: "商品标签"},
                { field: "itemId", title: "Item ID"},
                 { field: "remark", title: "备注"},
                 { title: '操作', align: 'center', toolbar: '#filterBar',width:100}
            ]];
        }else if(sysTiming_plat_code==='wish'){
            cols= [[
                { field: "id", title: "id",width:1 },
                { field: "jobHandler", title: "jobHandler"},
                { field: "storeAcct", title: "店铺"},
                { field: "storeAcctId", title: "店铺",width:1},
                { field: "isPromotion", title: "是否黄钻",templet:'#isPromotionTpl'},
                { field: "isPromoSku", title: "是否促销sku",templet:'#isPromoSkuTpl'},
                { field: "listingTimeStart",templet: '<div>{{ Format(d.listingTimeStart,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围开始"},
                { field: "listingTimeEnd",templet: '<div>{{ Format(d.listingTimeEnd,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围结束"},
                { field: "prodCreateDays", title: "<=商品创建时间天数"},
                { field: "dayNums", title: "<=距离刊登时间天数"},
                { field: "prodSSku", title: "商品sku",width:200,templet:function(d){
                    return  showPartProdSSku(d.prodSSku)
                }},
                { field: "prodTag", title: "商品标签"},
                { field: "itemId", title: "Item ID"},
                { field: "remark", title: "备注"},
                { title: '操作',width:100, align: 'center', toolbar: '#filterBar'}
            ]];
        }else if(sysTiming_plat_code==='joom'){
            cols= [[
                { field: "id", title: "id" ,width:1 },
                { field: "jobHandler", title: "jobHandler"},
                { field: "storeAcct", title: "店铺"},
                { field: "storeAcctId", title: "店铺",width:1 },
                { field: "isPromotion", title: "是否黄钻",templet:'#isPromotionTpl'},
                { field: "listingTimeStart",templet: '<div>{{ Format(d.listingTimeStart,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围开始"},
                { field: "listingTimeEnd",templet: '<div>{{ Format(d.listingTimeEnd,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围结束"},
                { field: "prodCreateDays", title: "<=商品创建时间天数"},
                { field: "dayNums", title: "<=距离刊登时间天数"},
                { field: "prodSSku", title: "商品sku",width:200,templet:function(d){
                    return  showPartProdSSku(d.prodSSku)
                }},
                { field: "prodTag", title: "商品标签"},
                { field: "itemId", title: "Item ID"},
                { field: "remark", title: "备注"},
                { title: '操作', align: 'center', toolbar: '#filterBar',width:100}
            ]];
        }else if(sysTiming_plat_code==='shopee'){
            cols= [[
                { field: "id", title: "id",width:1  },
                { field: "jobHandler", title: "jobHandler"},
                // { field: "storeAcct", title: "店铺"},
                // { field: "storeAcctId", title: "店铺"},
                // { field: "site", title: "站点"},
                // { field: "isDiscount", title: "是否促销",templet:'#isDiscountTpl'},
                // { field: "listingTimeStart",templet: '<div>{{ Format(d.listingTimeStart,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围开始"},
                // { field: "listingTimeEnd",templet: '<div>{{ Format(d.listingTimeEnd,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围结束"},
                // { field: "prodCreateDays", title: "<=商品创建时间天数"},
                // { field: "dayNums", title: "<=距离刊登时间天数"},
                { field: "prodSSku", title: "商品sku",templet:function(d){
                    return  showPartProdSSku(d.prodSSku)
                }},
                { field: "globalItemIds", title: "global_item_id"},
                { field: "prodTag", title: "商品标签"},
                // { field: "itemId", title: "Item ID"},
                { field: "prodCreateDays", title: "<=商品创建时间天数"},
                { field: "remark", title: "备注"},
                { title: '操作', align: 'center', toolbar: '#filterBar',width:100}
            ]];
        }else if(sysTiming_plat_code==='tiktok'){
            cols= [[
                { field: "id", title: "id" ,width:1 },
                { field: "jobHandler", title: "jobHandler"},
                { field: "storeAcct", title: "店铺"},
                { field: "storeAcctId", title: "店铺",width:1 },
                { field: "listingTimeStart",templet: '<div>{{ Format(d.listingTimeStart,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围开始"},
                { field: "listingTimeEnd",templet: '<div>{{ Format(d.listingTimeEnd,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围结束"},
                { field: "prodCreateDays", title: "<=商品创建时间天数"},
                { field: "dayNums", title: "<=距离刊登时间天数"},
                { field: "itemId", title: "product_id"},
                { field: "prodSSku", title: "商品SKU",width:200,templet:function(d){
                    return  showPartProdSSku(d.prodSSku)
                }},
                { field: "prodTag", title: "商品标签"},
                { field: "remark", title: "备注"},
                { field: "modifier", title: "操作人",templet:'<div>{{d.modifier ||d.creator}}</div>'},
                { title: '操作', align: 'center', toolbar: '#filterBar',width:100}
            ]];
        }else if(sysTiming_plat_code==='walmart'){
            cols= [[
                { field: "id", title: "id",width:1  },
                { field: "jobHandler", title: "jobHandler"},
                { field: "storeAcct", title: "店铺"},
                { field: "storeAcctId", title: "店铺"},
                { field: "listingTimeStart",templet: '<div>{{ Format(d.listingTimeStart,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围开始"},
                { field: "listingTimeEnd",templet: '<div>{{ Format(d.listingTimeEnd,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围结束"},
                { field: "prodCreateDays", title: "<=商品创建时间天数"},
                { field: "dayNums", title: "<=距离刊登时间天数"},
                { field: "itemId", title: "UPC"},
                { field: "prodSSku", title: "商品sku",templet:function(d){
                    return  showPartProdSSku(d.prodSSku)
                }},
                { field: "prodTag", title: "商品标签"},
                { field: "remark", title: "备注"},
                { title: '操作', align: 'center', toolbar: '#filterBar',width:100}
            ]];
        }else if(sysTiming_plat_code==='amazon'|| sysTiming_plat_code==='lazada' ||sysTiming_plat_code==='aliexpress'){
            cols= [[
                { field: "id", title: "id",width:1  },
                { field: "jobHandler", title: "jobHandler"},
                { field: "storeAcct", title: "店铺"},
                { field: "storeAcctId", title: "店铺",width:1 },
                { field: "site", title: "站点"},
                { field: "listingTimeStart",templet: '<div>{{ Format(d.listingTimeStart,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围开始"},
                { field: "listingTimeEnd",templet: '<div>{{ Format(d.listingTimeEnd,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围结束"},
                { field: "prodCreateDays", title: "<=商品创建时间天数"},
                { field: "dayNums", title: "<=距离刊登时间天数"},
                { field: "prodSSku", title: "商品sku",width:200,templet:function(d){
                    return  showPartProdSSku(d.prodSSku)
                }},
                { field: "prodTag", title: "商品标签"},
                { field: "itemId", title: "Item ID"},
                { field: "remark", title: "备注"},
                { title: '操作', align: 'center', toolbar: '#filterBar',width:100}
            ]];
        }else{
            cols= [[
                { field: "id", title: "id" ,width:1 },
                { field: "jobHandler", title: "jobHandler"},
                { field: "storeAcct", title: "店铺"},
                { field: "storeAcctId", title: "店铺",width:1 },
                { field: "listingTimeStart",templet: '<div>{{ Format(d.listingTimeStart,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围开始"},
                { field: "listingTimeEnd",templet: '<div>{{ Format(d.listingTimeEnd,"yyyy-MM-dd hh:mm:ss")}}</div>', title: "刊登时间范围结束"},
                { field: "prodCreateDays", title: "<=商品创建时间天数"},
                { field: "dayNums", title: "<=距离刊登时间天数"},
                { field: "prodSSku", title: "商品sku",width:200,templet:function(d){
                    return  showPartProdSSku(d.prodSSku)
                }},
                { field: "prodTag", title: "商品标签"},
                { field: "itemId", title: "Item ID"},
                { field: "remark", title: "备注"},
                { title: '操作', align: 'center', toolbar: '#filterBar',width:100}
            ]];
        }
        shopeetableIns = table.render({
            elem: "#sys_timing_filter_param_table",
            method:'post',
            url: ctx + "/sysTiming/getFilterTimingTaskInfo.html",
            cols: cols,
            where:{jobHandler:obj},
            page:false,
            id:"sys_timing_filter_param_table",
            limits:[10,20,50],
            limit:10,
            done:function(res, curr, count){
                $("[data-field='id']").css('display', 'none');
                $("[data-field='storeAcctId']").css('display', 'none');

            }
        });
    }
    $("#add_timing_filter_task").click(function(){
        var index = layer.open({
            title: '新增不处理参数',
            type: 1,
            btn: ['保存', '关闭'],
            content: $('#plat_addTimingFiltertpl').html(),
            area: ['1000px', '600px'],
            success: function () {
                $('#sys_timing_salesman_sel').attr('data-rolelist',sysTiming_plat_code+'专员');//赋值
                $('#sys_timing_store_sel').attr('data-platcode',sysTiming_plat_code);//赋值

                form.render('select')
                render_hp_orgs_users("#timing_filter_producttpl"); //渲染部门销售员店铺三级联动

                form.render('select')
                listdictProdTagAjax()  //商品标签
                .then(res => {
                    let _res = res.map(item => ({ name: item.name, value: item.name }))
                    formSelects.data('sys_timing_filter_param_prodtag', 'local', { arr: _res })
                })
                //如果是这三个平台 则需要有站点
                if(sysTiming_plat_code==='amazon' || sysTiming_plat_code==='ebay' || sysTiming_plat_code=='lazada'){
                    var returnData = getSiteInfo(sysTiming_plat_code);
                    var sites = returnData.data;
                    if(null !=sites){
                        var str = '';
                        for(var i=0;i<sites.length;i++){
                            str+='<input type="checkbox"  name="siteId"  value="'+sites[i].id+'" lay-skin="primary" title="'+sites[i].name+'" >';
                        }
                        $("#siteId").html(str);
                        form.render('checkbox');
                        document.getElementById("siteIdDiv").style.display='';
                    }
                }
                if(sysTiming_plat_code==='ebay'){
                    document.getElementById("countryDiv").style.display='';
                    document.getElementById("shippingService_Div").style.display='';
                }
                if(sysTiming_plat_code==='wish'){
                    document.getElementById("is_promotionSkuDiv").style.display='';
                    document.getElementById("is_promotionDiv").style.display='';
                }
                if(sysTiming_plat_code==='joom'){
                    document.getElementById("is_promotionDiv").style.display='';
                }
                if(sysTiming_plat_code==='shopee'){
                    // document.getElementById("is_discountDiv").style.display='';
                    document.getElementById("storeAcctIdDiv").style.display='none'
                    document.getElementById("listingTimeDiv").style.display='none'
                    document.getElementById('timing_filter_producttpl_globalItemIds').style.display=''
                    // document.getElementById("prodCreateTimeDiv").style.display='none'
                    document.getElementById("daysNumDiv").style.display='none'
                    document.getElementById("timing_filter_producttpl_itemId").style.display='none'
                }
                if(sysTiming_plat_code==='walmart'){
                    document.getElementById("storeAcctIdDiv").style.display=''
                    $('#timing_filter_producttpl_itemId label').text('UPC')
                    $('#timing_filter_producttpl_itemId input').attr('placeholder','支持填入多个，用英文逗号隔开')
                }

                if(sysTiming_plat_code!=='shopee' || sysTiming_plat_code==='walmart'){
                    laydate.render({
                        elem: '#listingTimeStart'
                        ,type: 'date'
                    });
                    laydate.render({
                        elem: '#listingTimeEnd'
                        ,type: 'date'
                    });
                }
                if(sysTiming_plat_code === 'tiktok'){
                    $('#timing_filter_producttpl_itemId').find('label').text('product_id')
                }

            },
            yes: function () {
               var data =  timing_filter_task_getInfoData();
               if(!data){
                   return;
               }
                $.ajax({
                    beforeSend: function(){
                        loading.show();
                    },
                    url: ctx + '/sysTiming/addFilterTimingInfo.html',
                    type: 'POST',
                    data: data,
                    async: true,
                    dataType: "json",
                    success: function(returnData) {
                        loading.hide()
                        if(returnData.code !='0000'){
                            layer.msg(returnData.msg)
                        }else{
                            layer.msg("保存成功")
                            layer.close(index)
                        }
                        tableReload(open_jobHandler);
                    },
                    error: function() {
                        layer.close(index)
                        loading.hide()
                    }
                });
            }
        })
    })
    // 
    function showPartProdSSku(prodSSku){
        let str = ''
        if(prodSSku){
            let _strList=prodSSku.split(',').slice(0,100)
            str = _strList.join()
        }
        const copyHtml= str ? `<span class="blue" onclick="copyTxtToClipboard('${prodSSku}')">复制</span>`:''
        return `<div>${copyHtml}<div>${str}</div></div>`
    }
    //根据平台获取站点
    function  getSiteInfo(platCode){
        var obj = {};
        $.ajax({
            beforeSend: function(){
                loading.show();
            },
            url: ctx + '/sysTiming/getSiteInfo.html',
            type: 'POST',
            data: {plat_code:platCode},
            async: false,
            dataType: "json",
            success: function(returnData) {
                loading.hide()
                if(returnData.code !='0000'){
                    layer.msg(returnData.msg)
                }else{
                    obj =  returnData;
                }
            },
            error: function() {
                loading.hide()
            }
        });
        return obj;
    }
    /**
     * 获取页面参数
     */
    function timing_filter_task_getInfoData() {
        var plat_code = $.trim(sysTiming_plat_code);
        var siteArr = new Array();
        $("#timing_filter_producttpl :checkbox:checked").each(function () {
            siteArr.push($(this).val());
        });
        var siteId = siteArr.join(',');
        var country = $.trim($("#timing_filter_producttpl input[name='country']").val());
        var is_promotion = $.trim($("#timing_filter_producttpl select[name='is_promotion']").val());
        var is_promotion_sku = $.trim($("#timing_filter_producttpl select[name='is_promotion_sku']").val());
        var isDiscount = $.trim($("#timing_filter_producttpl select[name='is_discount']").val());
        var listingTimeStart = $.trim($("#timing_filter_producttpl input[name='listingTimeStart']").val());
        var listingTimeEnd = $.trim($("#timing_filter_producttpl input[name='listingTimeEnd']").val());
        var prodCreateDays = $.trim($("#timing_filter_producttpl input[name='prodCreateDays']").val());
        var daysNum = $.trim($("#timing_filter_producttpl input[name='daysNum']").val());
        var itemId = $.trim($("#timing_filter_producttpl input[name='itemId']").val()).replace(/\s*/g,"");
        var prodSSku = $.trim($("#timing_filter_producttpl input[name='prodSSku']").val()).replace(/\s*/g,"");
        var prodTag = formSelects.value('sys_timing_filter_param_prodtag', 'valStr')
        var shippingService = $.trim($("#timing_filter_producttpl input[name='shippingService']").val());

        var remark = $.trim($("#timing_filter_producttpl input[name='remark']").val());
        var currentStoreAccts = formSelects.value("sys_timing_store_sel", "val"); //所选店铺
        let globalItemIds = $.trim($("#timing_filter_producttpl input[name='globalItemIds']").val());
        if(plat_code==='shopee' && globalItemIds){
            globalItemIds = globalItemIds.replace(/，/g, ',').replace(/\s+/g, ""); //中文逗号转为英文逗号，空格全部删掉
            globalItemIds = globalItemIds.split(',').filter(item=>!!parseInt(item)&&!!Number(item)).join()
            $.trim($("#timing_filter_producttpl input[name='globalItemIds']").val(globalItemIds));
          }
        var data = new Object();
        data.jobHandler = open_jobHandler;
        data.siteId = siteId;
        data.platCode = plat_code;
        data.country = country;
        data.isPromotion = is_promotion;
        data.isPromoSku = is_promotion_sku;
        data.isDiscount = isDiscount;
        data.listingTimeStart = listingTimeStart;
        data.listingTimeEnd = listingTimeEnd;
        data.prodCreateDays = prodCreateDays;
        data.dayNums = daysNum;
        data.itemId = itemId;
        data.prodSSku = prodSSku;
        data.prodTag = prodTag
        data.remark = remark;
        data.storeAcctId = currentStoreAccts.join(',');
        data.shippingService = shippingService;
        data.globalItemIds = globalItemIds
        if(!siteId && !country && !is_promotion && !is_promotion_sku && !isDiscount
            && !listingTimeStart && !listingTimeEnd && !daysNum &&!itemId && !prodSSku && currentStoreAccts.length==0 && !prodCreateDays && !shippingService && !prodTag && !globalItemIds){
            layer.msg("参数为空")
            return false;
        }
        return data;
    };

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(sys_timing_filter_param_table)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        var id = data.id;
        if (layEvent === 'edit') {
            var index = layer.open({
                type: 1,
                title: '修改定时任务不处理参数配置',
                area: ['1000px', '600px'],
                btn: ['保存','取消'],
                shadeClose: false,
                content: $('#plat_addTimingFiltertpl').html(),
                success: function () {
                    $('#sys_timing_salesman_sel').attr('data-rolelist',data.platCode+'专员');//赋值
                    $('#sys_timing_store_sel').attr('data-platcode',data.platCode);//赋值

                    form.render('select')
                    render_hp_orgs_users("#timing_filter_producttpl",function(){
                        var storeAcctId = data.storeAcctId;
                        if(storeAcctId){
                            formSelects.value('sys_timing_store_sel',storeAcctId.split(','));
                            // formSelects.render();
                        }
                    });
                    $("#timing_filter_producttpl input[name='country']").val(data.country);
                    $("#timing_filter_producttpl input[name='jobHandler']").val(data.jobHandler);
                    if(data.isDiscount !=null && data.isDiscount){
                        $("#timing_filter_producttpl select[name='is_discount']").find("option[value=1]").prop("selected",true);
                    }else if(data.isPromotion!=null && !data.isPromotion){
                        $("#timing_filter_producttpl select[name='is_discount']").find("option[value=0]").prop("selected",true);
                    }
                    if(data.isPromotion!=null && data.isPromotion){
                        $("#timing_filter_producttpl select[name='is_promotion']").find("option[value=1]").prop("selected",true);
                    }else if(data.isPromotion!=null && !data.isPromotion){
                        $("#timing_filter_producttpl select[name='is_promotion']").find("option[value=0]").prop("selected",true);
                    }
                    if(data.isPromoSku!=null && data.isPromoSku){
                        $("#timing_filter_producttpl select[name='is_promotion_sku']").find("option[value=1]").prop("selected",true);
                    }else if(data.isPromoSku!=null && !data.isPromoSku){
                        $("#timing_filter_producttpl select[name='is_promotion_sku']").find("option[value=0]").prop("selected",true);
                    }
                    $("#timing_filter_producttpl input[name='listingTimeEnd']").val(Format(data.listingTimeEnd,"yyyy-MM-dd"));
                    $("#timing_filter_producttpl input[name='listingTimeStart']").val(Format(data.listingTimeStart,"yyyy-MM-dd"));
                    $("#timing_filter_producttpl input[name='daysNum']").val(data.dayNums);
                    $("#timing_filter_producttpl input[name='prodCreateDays']").val(data.prodCreateDays);
                    $("#timing_filter_producttpl input[name='itemId']").val(data.itemId);
                    $("#timing_filter_producttpl input[name='prodSSku']").val(data.prodSSku);
                    $("#timing_filter_producttpl input[name='globalItemIds']").val(data.globalItemIds);
                    listdictProdTagAjax()  //商品标签
                        .then(res => {
                            let _prodTagList = data.prodTag ? data.prodTag.split(',') : []
                            let _res = res.map(item => {
                                return ({ name: item.name, value: item.name, selected: _prodTagList.includes(item.name) ? 'selected' : '' })
                            })
                            formSelects.data('sys_timing_filter_param_prodtag', 'local', { arr: _res })
                        })
                    $("#timing_filter_producttpl input[name='remark']").val(data.remark);
                    //如果是这三个平台 则需要有站点
                    if(data.platCode==='amazon' || data.platCode==='ebay' || data.platCode=='lazada'){
                        var returnData = getSiteInfo(data.platCode);
                        var sites = returnData.data;
                        if(null !=sites){
                            var str = '';
                            var arr = [];
                            if(data.site != '' && data.site != null ){
                                arr = data.site.split(',');
                            }
                            for(var i=0;i<sites.length;i++){
                                if(arr.indexOf(sites[i].name+"")>-1){
                                    str+='<input type="checkbox" checked  name="siteId"  value="'+sites[i].id+'" lay-skin="primary" title="'+sites[i].name+'" >';
                                }else{
                                    str+='<input type="checkbox"  name="siteId"  value="'+sites[i].id+'" lay-skin="primary" title="'+sites[i].name+'" >';
                                }
                            }
                            $("#siteId").html(str);
                            form.render('checkbox');
                            document.getElementById("siteIdDiv").style.display='';
                        }
                    }
                    if(data.platCode==='ebay'){
                        document.getElementById("countryDiv").style.display='';
                        document.getElementById("shippingService_Div").style.display='';
                        $("#timing_filter_producttpl input[name='shippingService']").val(data.shippingService);

                    }
                    if(data.platCode==='wish'){
                        document.getElementById("is_promotionSkuDiv").style.display='';
                        document.getElementById("is_promotionDiv").style.display='';
                    }
                    if(data.platCode==='joom'){
                        document.getElementById("is_promotionDiv").style.display='';
                    }
                    if(data.platCode==='shopee'){
                        // document.getElementById("is_discountDiv").style.display='';
                        document.getElementById("storeAcctIdDiv").style.display='none'
                        document.getElementById("listingTimeDiv").style.display='none'
                        document.getElementById('timing_filter_producttpl_globalItemIds').style.display=''
                        // document.getElementById("prodCreateTimeDiv").style.display='none'
                        document.getElementById("daysNumDiv").style.display='none'
                        document.getElementById("timing_filter_producttpl_itemId").style.display='none'
                    }
                    if(data.platCode==='walmart'){
                        document.getElementById("storeAcctIdDiv").style.display=''
                        $('#timing_filter_producttpl_itemId label').text('UPC')
                        $('#timing_filter_producttpl_itemId input').attr('placeholder','支持填入多个，用英文逗号隔开')
                    }
                    if(data.platCode!=='shopee'){
                        laydate.render({
                            elem: '#listingTimeStart'
                            ,type: 'date'
                        });
                        laydate.render({
                            elem: '#listingTimeEnd'
                            ,type: 'date'
                        });
                    }
                    if(sysTiming_plat_code === 'tiktok'){
                        $('#timing_filter_producttpl_itemId').find('label').text('product_id')
                    }

                    form.render('select')
                },
                yes: function (index, layero) {
                    var obj = timing_filter_task_getInfoData();
                    if(!obj){
                        return ;
                    }
                    obj.id = id;
                    $.ajax({
                        beforeSend: function(){
                            loading.show();
                        },
                        url: ctx + '/sysTiming/addFilterTimingInfo.html',
                        type: 'POST',
                        data: obj,
                        async: true,
                        dataType: "json",
                        success: function(returnData) {
                            loading.hide()
                            if(returnData.code !='0000'){
                                layer.msg(returnData.msg)
                            }else{
                                layer.close(index)
                                tableReload(open_jobHandler);
                            }
                        },
                        error: function() {
                            layer.close(index)
                            loading.hide()
                        }
                    });
                }
            })
        }else if(layEvent === 'delete'){
            layer.confirm('是否删除此条记录？', function (result) {
                if (result) {
                    $.ajax({
                        url: ctx + '/sysTiming/deleteFilterTimingInfo.html',
                        data: {"id": id},
                        dataType: "json",
                        success: function (returnData) {
                            if (returnData.code == "0000") {
                                layer.msg('操作成功');
                            } else {
                                layer.msg(returnData.msg);
                            }
                            tableReload(open_jobHandler);
                        },
                        error: function () {
                            layer.msg("服务器正忙");
                        }
                    });
                }
            });
        }
    });

    function listdictProdTagAjax () {
        return commonReturnPromise({
            url: ctx + '/sys/listdict.html',
            params: { headCode: 'prod_tag' }
        })
    }
});

function sysTimingFilterParamblur(e){
    let val = e.target.value
    val =  val.replace(/，/g, ',').replace(/\s+/g, ""); //中文逗号转为英文逗号，空格全部删掉
    val = val.split(',').filter(item=>!!parseInt(item)&&!!Number(item)).join()
    e.target.value = val
}
