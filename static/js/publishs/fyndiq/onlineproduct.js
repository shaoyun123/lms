var timeUnit;
layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'element', 'laydate', 'laypage'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        table = layui.table,
        $ = layui.$;
    form.render('select');
    let fyndiq_logRendering_online
    fyndiq_logRendering().then(res => {
        fyndiq_logRendering_online = res
    })
    //获取日志渲染信息
    function fyndiq_logRendering(params) {
        return commonReturnPromise({
            url: '/lms/prodListingOperTypeEnum/fyndiq'
        })
    }
    //部门-销售-店铺联动
    render_hp_orgs_users("#fyndiqOnlineproduct_searchForm");
    //表头固定
    UnifiedFixedFn('fyndiq_onlineproductCard');
    //时间渲染
    laydate.render({
        elem: '#fyndiq_onlineproduct_times'
        ,range: true
    });
    //弹出分类框
     //弹出分类框
    $('#fyndiq_online_searchCate_btn').click(function () {
      admin.itemCat_select('fyndiq_online_prod_cate_layer', 'fyndiq_online_cateId_search_inp', 'fyndiq_online__search_cate_div')
    })
    //监听tab点击
    element.on('tab(fyndiq_onlineproduct_tabs)', function (data) {
        if(data.index == 0){ //在线
            $('#fyndiq_onlineproduct_productStatus').val('for sale');
        }
        else if(data.index == 1){ //已下架
            $('#fyndiq_onlineproduct_productStatus').val('paused');
        }
        else if(data.index == 2){ //删除
            $('#fyndiq_onlineproduct_productStatus').val('deleted');
        }
        $('[lay-filter=fyndiq_onlineproduct_submit]').trigger('click');
    })
    //命名空间
    var fyndiq_onlineproductName = {
        // 转为数组
        convertToArray: function (str) {
          let arr = str.split(',') 
          return arr 
        },
        //数据处理
        dataHandle:function(data){
            let _this = this,
              convertArr = ['fyndiqStatusList', 'pCateIdList', 'storeAcctIdList'] //Fyndiq状态  类目  店铺
            if(data.times){
                var timeArr =data.times.split(' - ');
                data.listingTimeStart = timeArr[0] + " 00:00:00";
                data.listingTimeEnd = timeArr[1] + " 23:59:59";
            }else{
                data.listingTimeStart = '';
                data.listingTimeEnd ='';
            }
            if(!data.storeAcctIdList){
                data.storeAcctIdList = $('#fyndiq_online_store_selId').attr('acct_ids');
            }else{
                data.storeAcctIdList = formSelects.value('fyndiq_online_store_sel', 'val').join(',');
            }
            //ztt-20220706改start
            if (data.fyndiq_status) {
                let statusArr = data.fyndiq_status.split('_');
                data[statusArr[0]] = statusArr[1];
            }
            //ztt-20220706改end
            convertArr.forEach(v => {
                if (data[v]) {
                    data[v] = _this.convertToArray(data[v])
                }else {
                    delete data[v]
                }
            })
            //ztt-20220706改start
            delete data.fyndiq_status;
            //ztt-20220706改end
            delete data.times;
            return data;
        },
        //渲染表格
        tableRender: function(data){
            var _this = this;
            table.render({
                elem: '#fyndiq_onlineproduct_table',
                method: 'post',
                url: '/lms/fyndiq/product/query/list.html',
                where:  data,
                contentType: 'application/json',
                // page: true,
                // limits: [50, 100, 1000],
                // limit: 100,
                page: {
                    layout: ['prev', 'page', 'next', 'limit'],
                    groups: 5,
                    prev: '<上一页',
                    next: '下一页>',
                    first: false, //显示首页
                    last: false, //显示尾页
                    limit: 100,
                    limits: [100, 500, 1000],
                },
                id: "fyndiq_onlineproduct_tableId",
                cols: [
                    [
                        {type: 'checkbox', width: 30},
                        {title: '图片', templet: '#fyndiq_onlineproduct_img', field: 'img', width: 66},
                        {title: '标题/产品ID', templet: '#fyndiq_onlineproduct_title', field: 'title', width:400},
                        {title: 'SKU', templet: '#fyndiq_onlineproduct_sku', field: 'sku'},
                        {title: 'Fyndiq状态', field: 'fyndiqStatus', width: 100},
                        {title: '属性', templet: '#fyndiq_onlineproduct_attr', field: 'attr'},
                        {title: '价格(挪威nok)', field: 'noPrice',templet: '<div>{{ d.noPrice || "" }}</div>', width: 80},
                        {title: '价格(丹麦dkk)', field: 'dkPrice',templet: '<div>{{ d.dkPrice || "" }}</div>', width: 80},
                        {title: '价格(瑞典sek)', field: 'price',templet: '<div>{{ d.price || "" }}</div>', width: 80},
                        {title: '价格(芬兰eur)', field: 'fiPrice',templet: '<div>{{ d.fiPrice || "" }}</div>', width: 80},
                        {title: '在线数量', field: 'quantity', width: 80},
                        {field: "detail",title: '可用/在途/未派',templet:"#fyndiq_onlineproduc_detail", width: 105},
                        {title: '7/30/90/180日销量', field: 'salesNum', width: 80},
                        {title: '刊登时间',field: 'times', templet: `<div>{{Format( d.listingTime, 'yyyy-MM-dd hh:mm:ss') }}</div>`},
                        {title: '操作', toolbar: '#fyndiq_onlineproduct_toolBar', width: 80, align: 'center'}
                    ]
                ],
                created: function (res) {
                    if (res.code == '0000' && res.data && Array.isArray(res.data)) {
                      var _data = deepCopy(res.data)
                      let temArr = []
                      _data.forEach((value, index) => {
                         let fatherObj = {} 
                         fatherObj.variants = `变体(${value.subProdCount})`
                         fatherObj.salesNum = `${value.sevenSalesNum}/${value.thirtySalesNum}/${value.ninetySalesNum}/${value.oneHundredAndEightySalesNum}`
                         fatherObj.productId = value.productId
                         fatherObj.parentSku = value.subProds[0].parentSku
                         value.subProds.unshift(fatherObj)
                         value.subProds?.forEach(cItem => {
                            cItem.salesperson =  value.salesperson
                         })
                         temArr.push(...value.subProds)
                        });
                      res.data = temArr
                        // console.log(temArr)
                    }

                },
                done: function(res){
                    //图片懒加载
                    imageLazyload();
                    //数量展示
                    $('#fyndiq_onlineproduct_tabs').find('li>span').html('');
                    if (res.count * 1 > 10000) {
                        $('#fyndiq_onlineproduct_tabs').find('li.layui-this>span').html(`(>10000)`);
                    }else {
                        $('#fyndiq_onlineproduct_tabs').find('li.layui-this>span').html(`(${res.count})`);
                    }
                    //操作栏
                    _this.watchBar();
                }
            });
        },
        //监听操作
        watchBar: function(){
            var _this = this;
            table.on('tool(fyndiq_onlineproduct_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'update'){ //更新
                    var id = data.id;
                    var articleId = data.articleId;
                    var storeAcctId = data.storeAcctId;
                    var articleIdStr = id +'&'+articleId;
                    _this.updateAjax(articleIdStr, storeAcctId).then(function(result){
                        layer.msg('更新该条数据成功!',{icon:1});
                        $('[lay-filter=fyndiq_onlineproduct_submit]').trigger('click');
                    }).catch(function(err){
                        layer.msg(err,{icon:2,offset: '70px'});
                    })
                }else if(obj.event == 'logs'){//日志
                    layer.open({
                        type: 1,
                        title: '日志',
                        area: ['1100px', '700px'],
                        btn: ['关闭'],
                        content: $('#fyndiq_onlineproduct_logs').html(),
                        success: function(){
                            _this.logsTable(data.articleId);
                        }
                    })
                }
            });
        },
        //日志表格
        logsTable: function(articleId){
            table.render({
                elem: '#fyndiq_onlineproduct_logs_table',
                method: 'get',
                url: '/lms/fyndiq/product/query/log.html?articleId='+articleId,
                page: false,
                limit: 500,
                id: "fyndiq_onlineproduct_logs_tableId",
                cols: [
                    [
                        {title: '操作时间',field: 'times', templet: `<div>{{Format( d.createTime, 'yyyy-MM-dd hh:mm:ss') }}</div>`},
                        {title: '操作人', field: 'creator'},
                        {title: '店铺子sku', field: 'storeSSku'},
                        {title: '操作类型', field: 'operType', templet: function (d) {
                            return fyndiq_logRendering_online[d.operType] || ''
                        }},
                        {title: '原值', field: 'origData'},
                        {title: '调整值', field: 'newData'},
                        {title: '结果', field: 'operDesc'}
                    ]
                ]
            });
        },
        //监听批量操作
        watchBatch:function(){
            var _this = this;
            form.on('select(fyndiq_batchHandleFilter)', function(obj){
                var val = obj.value;
                if(val == 'update'){
                    commonTableCksSelected('fyndiq_onlineproduct_tableId').then(function(result){
                        result.forEach((v,i) => {
                            if (v.variants) {
                                result.splice(i,1)
                            }
                        })
                        if (result == null || result.length < 1) {
                            layer.msg("必须选中子商品", { icon: 0 });
                            return;
                        }
                        var strArr = [];
                        var storeAcctId = result[0]['storeAcctId'];
                        for(var i=0;i<result.length;i++){
                            var item = result[i];
                            var articleIdStr = item.id +'&'+item.articleId;
                            strArr.push(articleIdStr);
                        }
                        _this.updateAjax(strArr.join(), storeAcctId).then(function(){
                            layer.msg('批量更新数据成功!',{icon:1});
                            $('[lay-filter=fyndiq_onlineproduct_submit]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon:2,offset: '70px'});
                        })
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    });
                }else if(val == 'delete'){
                    commonTableCksSelected('fyndiq_onlineproduct_tableId').then(function(result){
                        result.forEach((v,i) => {
                            if (v.variants) {
                                result.splice(i,1)
                            }
                        })
                        if (result == null || result.length < 1) {
                            layer.msg("必须选中子商品", { icon: 0 });
                            return;
                        }
                        var strArr = [];
                        var storeAcctId = result[0]['storeAcctId'];
                        for(var i=0;i<result.length;i++){
                            var item = result[i];
                            strArr.push(item.articleId);
                        }
                        layer.confirm('确认要删除选中的商品吗，删除之后将不可恢复', function () {
                            _this.deleteAjax(strArr.join(), storeAcctId).then(function(){
                                layer.msg('批量删除数据成功!',{icon:1});
                                $('[lay-filter=fyndiq_onlineproduct_submit]').trigger('click');
                            }).catch(function(err){
                                layer.msg(err || '删除失败!',{icon:2,offset: '70px'});
                            })
                          });
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                }else if(val == 'stock'){//调整库存
                    commonTableCksSelected('fyndiq_onlineproduct_tableId').then(function(result){
                        result.forEach((v,i) => {
                            if (v.variants) {
                                result.splice(i,1)
                            }
                        })
                        if (result == null || result.length < 1) {
                            layer.msg("必须选中子商品", { icon: 0 });
                            return;
                        }
                        var skuArr = [];
                        var storeAcctId = result[0]['storeAcctId'];
                        for(var i=0;i<result.length;i++){
                            var item = result[i];
                            skuArr.push(item.storeSku);
                        }
                        _this.stockHandle(skuArr.join(','),storeAcctId);
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    });
                }else if(val=='price'){//调整价格
                    commonTableCksSelected('fyndiq_onlineproduct_tableId').then(function(result){
                        result.forEach((v,i) => {
                            if (v.variants) {
                                result.splice(i,1)
                            }
                        })
                        if (result == null || result.length < 1) {
                            layer.msg("必须选中子商品", { icon: 0 });
                            return;
                        }
                        var skuArr = [];
                        var storeAcctId = result[0]['storeAcctId'];
                        for(var i=0;i<result.length;i++){
                            var item = result[i];
                            skuArr.push(item.storeSku);
                        }
                        _this.priceHandle(skuArr.join(','),storeAcctId);
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    });
                } else if(val=='descript'){ // 修改标题和描述
                    var itemData = table.checkStatus('fyndiq_onlineproduct_tableId').data; //获取选择的数据
                    if (itemData == null || itemData.length < 1) {
                        layer.msg("必须先选中商品", { icon: 0 });
                        return;
                    }
                    itemData.forEach((v,i) => {
                        if (v.variants) {
                            itemData.splice(i,1)
                        }
                    })
                    if (itemData == null || itemData.length < 1) {
                        layer.msg("必须选中子商品", { icon: 0 });
                        return;
                    }
                    if (itemData != null && itemData.length > 0) {
                        var storeSku = [],storeAcctId = [];
                        for (var index in itemData) {
                            let obj = itemData[index];
                            storeSku.push(obj.storeSku);
                            storeAcctId.push(obj.storeAcctId)
                        }
                        let storeSkuStr = storeSku.join(","),storeAcctIdStr = storeAcctId.join(",");
                        window.localStorage.setItem("storeSkuStrFyndiq",storeSkuStr)
                        window.localStorage.setItem("storeAcctIdStrFyndiq",storeAcctIdStr)
                    }

                    var sobj = $("select[name=fyndiq_batchHandle]").find("[value=" + val + "]");
                    var title = $(sobj).attr("data-title");
                    var value = sobj.attr('value');
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
                            localStorage.removeItem("storeSkuStrFyndiq")
                            localStorage.removeItem("storeAcctIdStrFyndiq")
                        }
                    });
                } else if (val=='shelvesInBulk') {
                    commonTableCksSelected('fyndiq_onlineproduct_tableId').then(function(result){
                        result.forEach((v,i) => {
                            if (v.variants) {
                                result.splice(i,1)
                            }
                        })
                        if (result == null || result.length < 1) {
                            layer.msg("必须选中子商品", { icon: 0 });
                            return;
                        }
                        var strArr = [];
                        var storeAcctId = result[0]['storeAcctId'];
                        for(var i=0;i<result.length;i++){
                            var item = result[i];
                            strArr.push(item.id);
                        }
                        let layerIndex = layer.open({
                            type: 1,
                            title: '批量上架',
                            btn: ['上架', "取消"],
                            content: "加载中...",
                            id: new Date().getTime(),
                            success: function (layero, index) {
                                $(layero).find('.layui-layer-content').html($("#onlineFyndiq_TimingTpl").html());
                                $(layero).find(".tips").text("只处理选中的站点，不选代表上架listing")
                                layui.form.render("checkbox");
                            },
                            yes: function (index, layero) {
                                let _data = serializeObject($("#onlineFyndiq_TimingTplForm"))

                                _this.shelvesInBatches('for sale', strArr,_data.markets).then(function(res){
                                    layer.msg(res || '批量上架成功!',{icon:1});
                                    layer.close(layerIndex)
                                    $('[lay-filter=fyndiq_onlineproduct_submit]').trigger('click');
                                }).catch(function(err){
                                    layer.msg(err || '操作失败!',{icon:2,offset: '70px'});
                                })
                            }
                        })
                        // layer.confirm('确认要上架选中的商品吗', function () {
                        //     _this.shelvesInBatches('for sale', strArr).then(function(res){
                        //         layer.msg(res || '批量上架成功!',{icon:1});
                        //         $('[lay-filter=fyndiq_onlineproduct_submit]').trigger('click');
                        //     }).catch(function(err){
                        //         layer.msg(err || '操作失败!',{icon:2,offset: '70px'});
                        //     })
                        //   });
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                } else if (val=='bulkOffShelves') {
                    commonTableCksSelected('fyndiq_onlineproduct_tableId').then(function(result){
                        result.forEach((v,i) => {
                            if (v.variants) {
                                result.splice(i,1)
                            }
                        })
                        if (result == null || result.length < 1) {
                            layer.msg("必须选中子商品", { icon: 0 });
                            return;
                        }
                        var strArr = [];
                        var storeAcctId = result[0]['storeAcctId'];
                        for(var i=0;i<result.length;i++){
                            var item = result[i];
                            strArr.push(item.id);
                        }
                        let layerIndex = layer.open({
                            type: 1,
                            title: '批量下架',
                            btn: ['下架', "取消"],
                            content: "加载中...",
                            id: new Date().getTime(),
                            success: function (layero, index) {
                                $(layero).find('.layui-layer-content').html($("#onlineFyndiq_TimingTpl").html());
                                $(layero).find(".tips").text("只处理选中的站点，不选代表下架listing")
                                layui.form.render("checkbox");
                            },
                            yes: function (index, layero) {
                                let _data = serializeObject($("#onlineFyndiq_TimingTplForm"))

                                _this.shelvesInBatches('paused', strArr,_data.markets).then(function(res){
                                    layer.msg(res || '批量下架成功!',{icon:1});
                                    layer.close(layerIndex)
                                    $('[lay-filter=fyndiq_onlineproduct_submit]').trigger('click');
                                }).catch(function(err){
                                    layer.msg(err || '操作失败!',{icon:2,offset: '70px'});
                                })
                            }
                        })
                        // layer.confirm('确认要下架选中的商品吗', function () {
                        //     _this.shelvesInBatches('paused', strArr).then(function(res){
                        //         layer.msg(res || '批量下架成功!',{icon:1});
                        //         $('[lay-filter=fyndiq_onlineproduct_submit]').trigger('click');
                        //     }).catch(function(err){
                        //         layer.msg(err || '操作失败!',{icon:2,offset: '70px'});
                        //     })
                        //   });
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                }else if (val=='bulkInOffShelves') { //ztt-20220706-批量上下架
                    commonTableCksSelected('fyndiq_onlineproduct_tableId').then(function(result){
                        result.forEach((v,i) => {
                            if (v.variants) {
                                result.splice(i,1)
                            }
                        })
                        if (result == null || result.length < 1) {
                            layer.msg("必须选中子商品", { icon: 0 });
                            return;
                        }
                        layer.open({
                            type: 1,
                            title: '批量上下架站点',
                            content: `
                                <div style="padding:20px 0 0 40px">
                                    <div class="layui-form">
                                        <input type="radio" name="site" value="ALL" title="全部站点">
                                        <input type="radio" name="site" value="SE" title="瑞典">
                                        <input type="radio" name="site" value="FI" title="芬兰">
                                    </div>
                                    <div style="margin-top: 20px;font-size: 18px;"><strong>确认要更新选中的商品为所选状态吗？
                                    </strong></div>
                                </div>
                            `,
                            area: ['30%', '25%'],
                            btn: ['确定', '取消'],
                            success: function () {
                                form.render('radio');
                            },
                            yes: function (index, layero) {
                                //组装参数开始
                                let allSite = ['SE', 'FI'];
                                let newFyndiqMarketList = []; //传给后端的新的站点
                                let radioVal = layero.find('input[name=site]:checked').val();
                                if (radioVal == 'ALL') {
                                    newFyndiqMarketList = allSite;
                                } else {
                                    newFyndiqMarketList.push(radioVal);
                                }
                                let strArr = [];
                                for (let i = 0; i < result.length; i++){
                                    let item = result[i];
                                    let curFyndiqMarketList = [];
                                    if (item.price && item.fiPrice) {
                                        curFyndiqMarketList = allSite;
                                    } else if (item.price && !item.fiPrice) {
                                        curFyndiqMarketList = ['SE'];
                                    } else if (!item.price && item.fiPrice) {
                                        curFyndiqMarketList = ['FI'];
                                    } else {
                                        curFyndiqMarketList = [];
                                    }
                                    let obj = {
                                        newFyndiqMarketList,
                                        curFyndiqMarketList,
                                        articleId: item.articleId,
                                        storeSku: item.storeSku,
                                        parentSku: item.parentSku,
                                        storeAcctId: item.storeAcctId,
                                        id: item.id
                                    };
                                    strArr.push(obj);
                                }
                                console.log(strArr);
                                //参数组装完毕
                                //请求后端接口
                                commonReturnPromise({
                                    url: '/lms/fyndiq/product/batch/updateProductEnableSite',
                                    type: 'post',
                                    contentType: 'application/json',
                                    params: JSON.stringify(strArr)
                                }).then(res => {
                                    layer.msg(res || '批量上下架操作成功', { icon: 1 });
                                    layer.close(index);
                                    $('[lay-filter=fyndiq_onlineproduct_submit]').trigger('click');
                                });
                            }
                        });
                    }).catch(function(err){
                        layer.msg(err, {icon:2});
                    })
                }
            });
        },
        //批量调整库存
        stockHandle: function(skuStr, storeAcctId){
            var _this = this;
            layer.open({
                type: 1,
                title: '调整库存',
                btn: ['关闭'],
                area: ['90%', '700px'],
                content: $('#fyndiq_onlineproduct_stock').html(),
                id: 'fyndiq_onlineproduct_stockId',
                success:function(layero,index){
                    form.render();
                    render_hp_orgs_users("#fyndiqOnlineproduct_searchLayerForm");
                    //默认渲染表格
                    _this.layerTableRender({
                        skuStr: skuStr,
                        storeAcctIdStr: storeAcctId,
                        skuSearchType: 2
                    });
                     //表单搜索事件
                    form.on('submit(fyndiq_onlineproduct_layerSubmit)', function(data){
                        var data = data.field; //获取到表单提交对象
                        var obj = _this.layerDataHandle(data, 'fyndiq_online_store_selLayer','fyndiq_online_store_selIdLayer');
                        if(!obj.storeAcctIdStr){
                            return layer.msg('店铺不能为空!',{icon:2});
                        }
                        _this.layerTableRender(obj);
                    });
                    //点击应用按钮
                    _this.clickApplication(layero);
                    //批量调整库存
                    _this.batchEdit();
                }
            })
        },
        //批量调整价格
        priceHandle:function(skuStr, storeAcctId){
            var _this = this;
            layer.open({
                type: 1,
                title: '调整价格',
                btn: ['关闭'],
                area: ['90%', '700px'],
                content: $('#fyndiq_onlineproduct_price').html(),
                id: 'fyndiq_onlineproduct_priceId',
                success:function(layero,index){
                    form.render();
                    render_hp_orgs_users("#fyndiqOnlineproduct_searchPriceLayerForm");

                    commonReturnPromise({
                        type: 'GET',
                        url: ctx + '/fyndiq/product/getAllFyndiqSite'
                    }).then(res => {
                        res.forEach(item => item.value = item.code)
                        formSelects.data(`fyndiqLayerSite`, 'local', { arr: res })
                        formSelects.render("fyndiqLayerSite")
                    })
                    //默认渲染表格
                    _this.layerPriceTableRender({
                        skuStr: skuStr,
                        storeAcctIdStr: storeAcctId,
                        skuSearchType: 2
                    });
                    //表单搜索事件
                    form.on('submit(fyndiq_onlineproduct_layerPriceSubmit)', function(data){
                        var data = data.field; //获取到表单提交对象
                        var obj = _this.layerDataHandle(data, 'fyndiq_online_store_selPriceLayer','fyndiq_online_store_selIdPriceLayer');
                        if(!obj.storeAcctIdStr){
                            return layer.msg('店铺不能为空!',{icon:2});
                        }
                        _this.layerPriceTableRender(obj);
                    });
                    //点击应用按钮
                    _this.clickPriceApp(layero);
                    //批量调整价格
                    _this.batchPriceEdit();
                }
            })
        },
        //调整库存的数据处理
        layerDataHandle: function(data, xmselect, id){
            if(!data.storeAcctIdStr){
                data.storeAcctIdStr = $('#'+id).attr('acct_ids');
            }else{
                data.storeAcctIdStr = formSelects.value(xmselect, 'val').join(',');
            }
            return data;
        },
        //渲染库存弹框表格
        layerTableRender: function(data){
            var _this = this;
            table.render({
                elem: '#fyndiq_onlineproduct_layerTable',
                method: 'post',
                url: '/lms/fyndiq/product/batch/query/stock.html',
                where:  data,
                page: true,
                limits: [50, 100, 300],
                limit: 50,
                id: "fyndiq_onlineproduct_layerTableId",
                cols: [
                    [
                        {type: 'checkbox', width: 30},
                        {title: '物品号', field: 'articleId'},
                        {title: '店铺名称', field: 'storeAcctName'},
                        {title: '商品SKU',field: 'parentSku'},
                        {title: '店铺SKU',field: 'storeSku'},
                        {title: '当前数量',field: 'quantity'},
                        {title: '调整数量', field: 'number',templet: '<div><input type="number" class="layui-input"><input type="hidden" id="{{d.articleId}}"></div>'},
                        {title: '操作结果', field: 'result'}
                    ]
                ],
                done: function(res){
                    $('#fyndiq_onlineproduct_stock_count').html(res.count || 0);
                }
            });
        },
        //渲染价格弹框表格
        layerPriceTableRender: function(data){
            var _this = this;
            table.render({
                elem: '#fyndiq_onlineproduct_layerPriceTable',
                method: 'post',
                url: '/lms/fyndiq/product/batch/query/price.html',
                where:  data,
                page: true,
                limits: [50, 100, 300],
                limit: 50,
                id: "fyndiq_onlineproduct_layerPriceTableId",
                cols: [
                    [
                        {type: 'checkbox', width: 30},
                        {title: '物品号', field: 'articleId'},
                        {title: '店铺名称', field: 'storeAcctName'},
                        {title: '商品SKU',field: 'parentSku'},
                        {title: '店铺SKU',field: 'storeSku'},
                        {title: '当前价格(瑞典sek)',field: 'price'},
                        {title: '调整价格(瑞典sek)', field: 'number',templet: '<div><input type="number" class="layui-input SE_Price" value="{{d.newPrice}}"><input type="hidden" id="{{d.articleId}}"></div>'},
                        {title: '当前价格(芬兰eur)',field: 'fiPrice'},
                        {title: '调整价格(芬兰eur)', field: 'number',templet: '<div><input type="number" class="layui-input FI_Price" value="{{d.fiNewPrice}}"><input type="hidden" id="_{{d.articleId}}"></div>'},
                        {title: '当前价格(挪威nok)',field: 'noPrice'},
                        {title: '调整价格(挪威nok)', field: 'number',templet: '<div><input type="number" class="layui-input NO_Price" value="{{d.noNewPrice}}"><input type="hidden" id="_nok{{d.articleId}}"></div>'},
                        {title: '当前价格(丹麦dkk)',field: 'dkPrice'},
                        {title: '调整价格(丹麦dkk)', field: 'number',templet: '<div><input type="number" class="layui-input DK_Price" value="{{d.dkNewPrice}}"><input type="hidden" id="_dkk{{d.articleId}}"></div>'},
                        {title: '操作结果', field: 'result'}
                    ]
                ],
                done: function(res){
                    $('#fyndiq_onlineproduct_price_count').html(res.count || 0);
                }
            });
        },
        //库存点击应用功能
        clickApplication: function(layero){
            $('#fyndiq_onlineproduct_stock_btn').on('click', function(){
                var $radio = layero.find('input[name=stock]:checked').val();
                //获取到输入的值
                var $inputV = '';
                if($radio == 'now'){
                    $inputV = Number(layero.find('input[name=nowVal]').val());
                }else{
                    $inputV = Number(layero.find('input[name=editVal]').val());
                };
                //获取表格
                var $inputs = layero.find('.layui-table-body.layui-table-main>table input');
                for(var i=0; i<$inputs.length; i++){
                    var item = $inputs[i];
                    var oldV =  Number($(item).parents('td').prev().find('div').text());
                    var $total = $radio == 'now' ? (oldV+$inputV) : $inputV;
                    $(item).val($total);
                }
            })
        },
        //价格批量处理
        clickPriceApp: function(layero){
            $('#fyndiq_onlineproduct_price_btn').on('click', function(){
                var $selVal = layero.find('select[name="priceType"]').val();//批量处理的价格类型
                var $inpVal = Number(layero.find('input[name=priceNumber]').val().trim()); //输入的变化值
                if(!$inpVal){
                    return layer.msg('请输入价格!',{icon:7});
                }
                if(layui.table.checkStatus("fyndiq_onlineproduct_layerPriceTableId").data.length == 0){
                    return layer.msg('请选择要应用的商品!',{icon:7});
                }
                var $inputs;
                let fyndiqLayerSite = formSelects.value("fyndiqLayerSite", 'val');
                if(fyndiqLayerSite.length >= 1){
                    fyndiqLayerSite.forEach(item =>{
                        $inputs = layero.find('.layui-table-body.layui-table-main>table .' + item + '_Price');
                        //获取表格
                        for(var i=0; i<$inputs.length; i++){
                            var item = $inputs[i];
                            if($(item).parents("tr").find(".layui-form-checked").length != 0){
                            var oldVal = Number($(item).parents('td').prev().find('div').text());
                            var newVal = 0;
                            if($selVal == '+'){
                                newVal = commonAdd(oldVal, $inpVal,'+');
                            }else if($selVal == '-'){
                                newVal = commonAdd(oldVal, $inpVal,'-');
                            }else if($selVal == '*'){
                                newVal = commonAdd(oldVal, $inpVal,'*');
                            }else if($selVal == '/'){
                                newVal = commonAdd(oldVal, $inpVal,'/');
                            }
                            $(item).val(newVal);
                            }
                        }
                    })
                }else{
                    $inputs = layero.find('.layui-table-body.layui-table-main>table input[type=number]');
                    //获取表格
                    for(var i=0; i<$inputs.length; i++){
                        var item = $inputs[i];
                        if($(item).parents("tr").find(".layui-form-checked").length != 0){
                        var oldVal = Number($(item).parents('td').prev().find('div').text());
                        var newVal = 0;
                        if($selVal == '+'){
                            newVal = commonAdd(oldVal, $inpVal,'+');
                        }else if($selVal == '-'){
                            newVal = commonAdd(oldVal, $inpVal,'-');
                        }else if($selVal == '*'){
                            newVal = commonAdd(oldVal, $inpVal,'*');
                        }else if($selVal == '/'){
                            newVal = commonAdd(oldVal, $inpVal,'/');
                        }
                        $(item).val(newVal);
                        }
                    }
                }
                
            })
        },
        //价格批量调整
        batchPriceEdit: function(){
            var _this = this;
            $('#fyndiq_onlineproduct_price_batch').on('click', function(){
                var batchNo = Date.now();
                commonTableCksSelected('fyndiq_onlineproduct_layerPriceTableId')
                .then(function(result){
                    var objArr = [];
                    var articleIdArr = [];
                    for(var i=0; i<result.length;i++){
                        var obj = {};
                        var item = result[i];
                        obj.batchNo = batchNo; //时间戳
                        obj.id = item.id; //商品id
                        obj.articleId = item.articleId;
                        obj.storeAcctId = item.storeAcctId;//店铺id
                        obj.storeSku = item.storeSku; //店铺sku
                        obj.price = item.price;
                        if($('#'+item.articleId).prev().val() == ""||$('#'+item.articleId).prev().val() <= 0){
                            return layer.alert("请检查瑞典sek",{icon:2})
                        }
                        obj.newPrice = Number($('#'+item.articleId).prev().val())
                        obj.fiPrice = item.fiPrice;
                        if($('#_'+item.articleId).prev().val() == ""||$('#_'+item.articleId).prev().val() <= 0){
                            return layer.alert("请检查芬兰eur",{icon:2})
                        }
                        obj.fiNewPrice = Number($('#_'+item.articleId).prev().val()); //调整价格
                        obj.noPrice = item.noPrice;
                        if($('#_nok'+item.articleId).prev().val() == ""||$('#_nok'+item.articleId).prev().val() <= 0){
                            return layer.alert("请检查挪威nok",{icon:2})
                        }
                        obj.noNewPrice = Number($('#_nok'+item.articleId).prev().val()); //调整价格
                        obj.dkPrice = item.dkPrice;
                        if($('#_dkk'+item.articleId).prev().val() == ""||$('#_dkk'+item.articleId).prev().val() <= 0){
                            return layer.alert("请检查丹麦dkk",{icon:2})
                        }
                        obj.dkNewPrice = Number($('#_dkk'+item.articleId).prev().val()); //调整价格

                        objArr.push(obj);
                        articleIdArr.push(item.articleId);
                    };
                    let formData = serializeObject($("#fyndiq_onlineproduct_layerPrice_marketsForm"))
                    formData.markets == undefined?formData.markets = '':'';
                    //批量调价
                    _this.batchPriceAjax(objArr,formData.markets).then(function(results){
                        layer.msg('提交队列成功，当前系统正在库存排队处理!', {icon: 1});
                        var myTimer = setInterval(function() {
                            _this.loopAjax(batchNo).then(function(data){
                                for (let key in data){
                                    if(!data[key]){
                                        return false;
                                    }
                                }
                                clearInterval(myTimer);//清除循环
                                var keys = Object.keys(data);
                                for(var k=0; k<keys.length; k++){
                                    var sKey = keys[k];
                                    for(var j=0; j<articleIdArr.length;j++){
                                        var sArticleId = articleIdArr[j];
                                        if(sKey.indexOf(sArticleId)>0){
                                            $('#'+sArticleId).parents('tr').find('td[data-field="result"]>div').html(data[sKey]);
                                        }
                                    }
                                }
                            });
                        }, 1000);
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    });
                })
                .catch(function(err){
                    layer.msg(err,{icon:2});
                });
            });
        },
        //点击批量调价
        batchEdit: function(){
            var _this = this;
            $('#fyndiq_onlineproduct_stock_batch').on('click', function(){
                var batchNo = Date.now();
                commonTableCksSelected('fyndiq_onlineproduct_layerTableId')
                .then(function(result){
                    var objArr = [];
                    var articleIdArr = [];
                    for(var i=0; i<result.length;i++){
                        var obj = {};
                        var item = result[i];
                        obj.batchNo = batchNo; //时间戳
                        obj.id = item.id; //商品id
                        obj.articleId = item.articleId;
                        obj.quantity = item.quantity; //初始数量
                        obj.storeAcctId = item.storeAcctId;//店铺id
                        obj.storeSku = item.storeSku; //店铺sku
                        obj.newStockNumber = Number($('#'+item.articleId).prev().val()); //调整数量
                        objArr.push(obj);
                        articleIdArr.push(item.articleId);
                    };
                    //批量调价
                    _this.batchStockAjax(objArr).then(function(results){
                        layer.msg('提交队列成功，当前系统正在库存排队处理!', {icon: 1});
                        var myTimer = setInterval(function() {
                            _this.loopAjax(batchNo).then(function(data){
                                for (let key in data){
                                    if(!data[key]){
                                        return false;
                                    }
                                }
                                clearInterval(myTimer);//清除循环
                                var keys = Object.keys(data);
                                for(var k=0; k<keys.length; k++){
                                    var sKey = keys[k];
                                    for(var j=0; j<articleIdArr.length;j++){
                                        var sArticleId = articleIdArr[j];
                                        if(sKey.indexOf(sArticleId)>0){
                                            $('#'+sArticleId).parents('tr').find('td[data-field="result"]>div').html(data[sKey]);
                                        }
                                    }
                                }
                            });
                        }, 1000);
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    });
                })
                .catch(function(err){
                    layer.msg(err,{icon:2});
                });
            });
        },
        //ajax请求
        //更新商品信息
        updateAjax: function(articleIdStr, storeAcctId){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                url: '/lms/fyndiq/product/sync/articleId.html',
                params: {
                    articleIdStr: articleIdStr,
                    storeAcctId: storeAcctId
                }
            })
        },
        //日志
        logsAjax: function(articleId){
            return commonReturnPromise({
                url: '/lms/fyndiq/product/query/log.html',
                params: {
                    articleId:articleId
                }
            })
        },
        //批量删除
        deleteAjax: function(articleIdStr,storeAcctId){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/x-www-form-urlencoded',
                url: '/lms/fyndiq/product/batch/delete/articleId.html',
                params: {
                    articleIdStr: articleIdStr,
                    storeAcctId: storeAcctId
                }
            })
        },
        //批量调库存接口
        batchStockAjax: function(obj){
            return commonReturnPromise({
                type: 'post',
                url: '/lms/fyndiq/product/batch/update/stockNumber.html',
                contentType: 'application/json',
                params: JSON.stringify(obj)
            })
        },
        //批量上下架
        shelvesInBatches: function (status, syncSIdList,markets) {
            return commonReturnPromise({
                type: 'post',
                url: '/lms/fyndiq/product/batch/updateProductStatus',
                contentType: 'application/json',
                params: JSON.stringify({
                    productStatus: status,
                    markets:markets,
                    syncSIdList
                })
            })
        },
        //循环价格请求
        batchPriceAjax:function(obj,markets){
            return commonReturnPromise({
                type: 'post',
                url: '/lms/fyndiq/product/batch/update/price.html?markets=' + markets,
                contentType: 'application/json',
                params: JSON.stringify(obj)
            })
        },
        //循环库存请求
        loopAjax:function(batchNo){
            return commonReturnPromise({
                type: 'post',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                url: '/lms/sys/selectResult.html',
                params: {
                    batchNo: batchNo
                },
                isLoading: false
            });
        },
    }
    //表单搜索事件
    form.on('submit(fyndiq_onlineproduct_submit)', function(data){
        var data = data.field; //获取到表单提交对象
        data.saleStatusList = data.saleStatusList ? data.saleStatusList.split(',') : [];
        var obj = fyndiq_onlineproductName.dataHandle(data);
        if(!obj.storeAcctIdList){
            return layer.msg('该部门或销售员未分配店铺!',{icon:2});
        }
        fyndiq_onlineproductName.tableRender(obj);
    });
    //监听批量
    fyndiq_onlineproductName.watchBatch();
});
