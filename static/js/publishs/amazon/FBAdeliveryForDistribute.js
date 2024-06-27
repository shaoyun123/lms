var packInfoTableIns = {};
var FBAdelivery_showPackDesc
var fbaDeliveryCache,currentScrollPosition
var shipmentStatusEnums,FBAdelivery_calThrowWeight,batchNoList
var tabCode
var FBAdistribute_currentTableName
layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload', 'tableMerge', 'laydate', 'formSelects'], function() {
        var form = layui.form,
            table = layui.table,
            element = layui.element,
            laypage = layui.laypage,
            laydate = layui.laydate,
            tableMerge = layui.tableMerge,
            formSelects = layui.formSelects,
            upload = layui.upload;
        layer = layui.layer;
        form.render('select');
        form.render('checkbox');
        laydate.render({
            elem: '#FBAdistribute_Form_time',
            type: 'date',
            range: true
        }); 
        // 初始化标签选择
        initBizzTag('#FBAdistribute_planLabel','FBA_SHIP_PLAN_LABEL',true, true, null,formSelects,[{name: '无标签',value: '空'}],'标签')

        //ztt20240521-初始化仓储类型多选
    commonRenderWarehouseTypeRender('FBAdistribute_storageTypeList')

        // 更新批次号
        $(".updateBatchNo").click(function(){
            // 待配货2，待包装3，仓库缺货6
            queryBatchNo($("#FBAdistrubute_label").find(".layui-this").data('code'))
        })

        // 批次号
        function queryBatchNo(matchStatus) {
            oneAjax.post({
                url: '/FbaDistributePlan/queryBacthNo',
                data: {
                    matchStatus
                },
                success: function (res) {
                    if (res.code === '0000') {
                        batchNoList = res.data || []
                        renderBatchNo()
                    }
                }
            })
        };

        function renderBatchNo() {
            $('#FBAdistributeForm [name=batchNo]').html('');
            let options = [`<option value=''></option>`]
            
            for (let i = 0; i < batchNoList.length; ++i) {
                let noBatch = ''
                if (batchNoList[i].batchNo === '' ) {
                    // 无批次
                    noBatch = `<option value='无'>无批次(${batchNoList[i].total})</option>`
                    options.push(noBatch)
                } else {
                    let option = `<option value="`+ batchNoList[i].batchNo +`">`+ batchNoList[i].batchNo + `(${batchNoList[i].total})` +`</option>`
                    options.push(option)
                }
            }
            $('#FBAdistributeForm [name=batchNo]').append(options)
            form.render('select','FBAdistributeForm')
        };
    
        // initShipmentStatus()
        fbaDeliveryCache = window.localStorage["fbaProjectToFbaDelivery"];

        if (fbaDeliveryCache) {
            //取到值之后清空缓存
            delete window.localStorage["fbaProjectToFbaDelivery"];
            var parse = JSON.parse(fbaDeliveryCache);
            //跳转过来的 选项卡  lay-id
            // var currentLayId = parse.currentLayId;
            //关闭跳转之前的选项卡数据
            // element.tabDelete('layadmin-layout-tabs', currentLayId);
        }
        render_hp_orgs_users("#FBAdistributeForm"); //渲染部门销售员店铺三级联动

        //初始化物流方式选项
        initAjax('/amazonFBA/inboundShipment/getFbaLogistics.html', 'POST', null, function(returnData) { //addressType:1 FBA地址
            appendSelect($('#FBAdistributeForm select[name=logisticsTypeId]'), returnData.data, 'id', 'name');
            form.render('select');
        });

        var FBAdelivery_global_siteEnum;

        var tabObj = {
            'FBAdelivery_table_check': '0',
            'FBAdelivery_table_waitSend': '1',
            'FBAdelivery_table_waitSet': '2',
            'FBAdelivery_table_waitCheck': '3',
            // 'FBAdelivery_table_toCreate': '5',
            'FBAdelivery_table_lackup': '6',
            'FBAdelivery_table_finish': '4',
            'FBAdelivery_table_cancel': '9'
        }

        let col0 = [
            [ // 待审核 待派单 已取消
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#FBAdistribute_imageTpl", width: 90 },
                { title: "店铺-站点", field: "salesSite", templet: '#FBAdistribute_store_site', width: 110 },
                { title: "商品SKU", field: "prodSSku", templet: '#FBAdistribute_deliveryPlan_ProdSkuTpl', width: 140 },
                { title: "在售", templet: '#FBAdistribute_isSale_tpl', width: 50 },
                { title: "店铺商品信息", field: "asin", templet: '#FBAdistribute_productInfo', width: 180 },
                { title: "总重量(kg)", field: "oaWeight", totalRow: true, sort: true, templet: '#FBAdistribute_plan_weight_tpl', width: 100 },
                { title: "商品总成本(￥)", field: "oaCost", totalRow: true, templet: '#FBAdistribute_plan_cost_tpl' },
                { title: "FBA在途数量", field: "fbaTransQuality", sort: true },
                { title: "FBA库存数量", field: "fbaInventoryQuality", sort: true },
                { title: "FBA货件中数量", field: "fbaShipmentQuality", sort: true },
                // { title: "海外仓可用库存", field: "availableQuality", totalRow: true, sort: true },
                { title: "义乌仓可用库存", field: "availableQuality", sort: true },
                // { title: "义乌仓在途库存", field: "defaultStoreOnwayStock" ,templet: '<div>{{d.defaultStoreOnwayStock||0}}</div>'},
                { title: '计划发货数量', field: "plan_quality", templet: '<div>{{d.planQuality}}</div>',sort: true },
                { title: '仓库操作', templet: '#FBAdistribute_create_tpl', width: 200 },
                { title: '汇总', field: "sameAsinSalesSiteData", templet: '#FBAdistribute_plan_sameAsinSalesSiteData', width: 100 },
                { title: '销售备注(点击可编辑)', field: 'salerRemark', edit: 'text', style: 'background-color: #7FFFD4;' },
            ]
        ]

        let col1 = [
          [ // 待审核 待派单 已取消
            ...col0[0],
            { title: '操作', toolbar: "#FBAdistribute_planoption_tpl", width: 100 }
          ]
        ]

        let col2 = [
          [
            { checkbox: true, width: 30 },
            { title: "图片", field: "picUrl", templet: "#FBAdistribute_imageTpl", width: 90 },
            { title: "店铺-站点", field: "salesSite", templet: '#FBAdistribute_store_site', width: 110 },
            // { title: "货件编码", templet: '#FBAdistribute_shipmentIdTemp' },
            { title: "商品SKU", field: "prodSSku", templet: '#FBAdistribute_deliveryPlan_ProdSkuTpl', width: 140 },
            { title: "在售", templet: '#FBAdistribute_isSale_tpl', width: 50 },
            { title: "店铺商品信息", field: "asin", templet: '#FBAdistribute_productInfo', width: 200 },
            { title: "总重量(kg)", field: "oaWeight", totalRow: true, sort: true, templet: '#FBAdistribute_plan_weight_tpl', width: 100 },
            { title: "商品总成本(￥)", field: "oaCost", totalRow: true, templet: '#FBAdistribute_plan_cost_tpl' },
            { title: "FBA在途数量", field: "fbaTransQuality", sort: true },
            { title: "FBA库存数量", field: "fbaInventoryQuality", sort: true },
            { title: "FBA货件中数量", field: "fbaShipmentQuality", sort: true },
            { title: '计划发货数量', field: "plan_quality", templet: '<div>{{d.planQuality}}</div>',sort: true },
            // { title: '批次号', field: "batchNo" },
            { title: '仓库操作', templet: '#FBAdistribute_warehouse_tpl', width: 200 },
            { title: '汇总', field: "sameAsinSalesSiteData", templet: '#FBAdistribute_plan_sameAsinSalesSiteData', width: 100 },
            { title: '销售备注(点击可编辑)', field: 'salerRemark', edit: 'text', style: 'background-color: #7FFFD4;' },
          ]
        ]

        let col7 = [
            [
              { checkbox: true, width: 30 },
              { title: "图片", field: "picUrl", templet: "#FBAdistribute_imageTpl", width: 90 },
              { title: "店铺-站点", field: "salesSite", templet: '#FBAdistribute_store_site', width: 110 },
            //   { title: "货件编码", templet: '#FBAdistribute_shipmentIdTemp' },
              { title: "商品SKU", field: "prodSSku", templet: '#FBAdistribute_deliveryPlan_ProdSkuTpl', width: 140 },
              { title: "在售", templet: '#FBAdistribute_isSale_tpl', width: 50 },
              { title: "店铺商品信息", field: "asin", templet: '#FBAdistribute_productInfo', width: 160 },
              { title: "总重量(kg)", field: "oaWeight", totalRow: true, sort: true, templet: '#FBAdistribute_plan_weight_tpl', width: 100 },
              { title: "商品总成本(￥)", field: "oaCost", totalRow: true, templet: '#FBAdistribute_plan_cost_tpl' },
              { title: "FBA在途数量", field: "fbaTransQuality", sort: true },
              { title: "FBA库存数量", field: "fbaInventoryQuality", sort: true },
              { title: "FBA货件中数量", field: "fbaShipmentQuality", sort: true },
              { title: "义乌仓可用库存", field: "availableQuality",templet: '<div>{{d.availableQuality||0}}</div>' },
                { title: '计划发货数量', field: "plan_quality", templet: '<div>{{d.planQuality}}</div>',sort: true },
//   { title: '批次号', field: "batchNo" },
              { title: '仓库操作', templet: '#FBAdistribute_warehouse_tpl', width: 200 },
              { title: '汇总', field: "sameAsinSalesSiteData", templet: '#FBAdistribute_plan_sameAsinSalesSiteData', width: 100 },
              { title: '销售备注(点击可编辑)', field: 'salerRemark', edit: 'text', style: 'background-color: #7FFFD4;' },
            ]
          ]

        let col3 = [
            [
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#FBAdistribute_imageTpl", width: 90 },
                { title: "店铺-站点", field: "salesSite", templet: '#FBAdistribute_store_site', width: 110 },
                // { title: "货件编码", templet: '#FBAdistribute_shipmentIdTemp' },
                { title: "商品SKU", field: "prodSSku", templet: '#FBAdistribute_deliveryPlan_ProdSkuTpl', width: 140 },
                { title: "在售", templet: '#FBAdistribute_isSale_tpl', width: 50 },
                { title: "店铺商品信息", field: "asin", templet: '#FBAdistribute_productInfo', width: 200 },
                { title: "总重量(kg)", field: "oaWeight", totalRow: true, sort: true, templet: '#FBAdistribute_plan_weight_tpl', width: 100 },
                { title: "商品总成本(￥)", field: "oaCost", totalRow: true, templet: '#FBAdistribute_plan_cost_tpl' },
                { title: "FBA在途数量", field: "fbaTransQuality", sort: true },
                { title: "FBA库存数量", field: "fbaInventoryQuality", sort: true },
                { title: "FBA货件中数量", field: "fbaShipmentQuality", sort: true },
                { title: '计划发货数量', field: "plan_quality", templet: '<div>{{d.planQuality}}</div>',sort: true },
                { title: '配货数量', field: "matchQty" },
                { title: '仓库操作', templet: '#FBAdistribute_warehouse_tpl', width: 200 },
                { title: '汇总', field: "sameAsinSalesSiteData", templet: '#FBAdistribute_plan_sameAsinSalesSiteData', width: 100 },
                { title: '销售备注(点击可编辑)', field: 'salerRemark', edit: 'text', style: 'background-color: #7FFFD4;' },
                { title: '操作', toolbar: "#FBAdistribute_planoption_tpl", width: 100 }
            ]
        ]

        let col4 = [
            [ //生成货件
                { title: "图片", field: "picUrl", templet: '#FBAdistribute_imageTpl' },
                { title: "商品SKU", field: "prodSSku", width: 180, totalRowText: '',templet: '#FBAdistribute_prodSSkuTemp' },
                { title: "商品信息", field: "storeAcct", templet: '#FBAdistribute_productInfo' },
                { title: "可用数量", field: "availableQuality", totalRowText: '', width: 100},
                { title: "剩余总计划数", field: "remainPlanQuality", width: 100,templet: '<div>{{d.planQuality - d.actQty}}</div>'},
                { title: "本次计划发货数量", field: "planQuality", totalRowText: '', templet: '#FBAdistribute_proNum'},
                { title: "标签准备方", field: "", templet: '<div>卖家</div>' },
                { title: "操作", toolbar: "#FBAdistribute_creatGoods" },
            ]
        ]

        let col5 = [
            [ //提交货件
                { checkbox: true, width: 30 },
                { title: "货件编号", field: "shipmentId",templet: '#FBAdelivery_distribute_shipmentIdTemplet' },
                { title: "商品种类", field: "skuMulNumber" },
                { title: "商品数量", field: "totalUnits" },
                { title: "计费重量(kg)", field: "priceWeight" },
                { title: "预估运费(￥)", field: "headLogisticsPrice" },
                { title: "标签", field: "labelStr" },
                { title: "标签准备方", field: "", templet: '<div>卖家</div>' },
                { title: "配送地址", field: "fnCenterId", templet: '#FBAdelivery_distribute_fnCenterInfo' },
                { title: "操作", toolbar: "#FBAdelivery_distribute_submitGoods" },
            ]
        ]

        let col6 = [
            [
                { checkbox: true, width: 30 },
                { title: "图片", field: "picUrl", templet: "#FBAdistribute_imageTpl", width: 90 },
                { title: "店铺-站点", field: "salesSite", templet: '#FBAdistribute_store_site', width: 110 },
                // { title: "货件编码", templet: '#FBAdistribute_shipmentIdTemp' },
                { title: "商品SKU", field: "prodSSku", templet: '#FBAdistribute_deliveryPlan_ProdSkuTpl', width: 140 },
                { title: "店铺商品信息", field: "asin", templet: '#FBAdistribute_productInfo', width: 160 },
                { title: "总重量(kg)", field: "oaWeight", totalRow: true, sort: true, templet: '#FBAdistribute_plan_weight_tpl', width: 100 },
                { title: "商品总成本(￥)", field: "oaCost", totalRow: true, templet: '#FBAdistribute_plan_cost_tpl' },
                { title: "FBA在途数量", field: "fbaTransQuality", sort: true },
                { title: "FBA库存数量", field: "fbaInventoryQuality", sort: true },
                { title: "FBA货件中数量", field: "fbaShipmentQuality", sort: true },
                { title: '计划发货数量', field: "plan_quality", templet: '<div>{{d.planQuality}}</div>',sort: true },
                // { title: '批次号', field: "batchNo" },
                { title: '仓库操作', field:'logList', templet: '#FBAdistribute_warehouse_tpl', width: 200 },
                { title: '汇总', field: "sameAsinSalesSiteData", templet: '#FBAdistribute_plan_sameAsinSalesSiteData', width: 100 },
                { title: '销售备注(点击可编辑)', field: 'salerRemark', edit: 'text', style: 'background-color: #7FFFD4;' },
                { title: '操作', toolbar: "#FBAdistribute_planoption_tpl", width: 100 }
              ]
        ]

        let col8 = [
            [ // 已取消
              ...col0[0],
              { title: '取消信息', toolbar: "#FBAdistribute_cancel_tpl", width: 100 }
            ]
          ]


        var tablecol = {
            'FBAdelivery_table_check': col1,
            'FBAdelivery_table_waitSend': col1,
            'FBAdelivery_table_waitSet': col3, // 待配货
            'FBAdelivery_table_waitCheck': col3,  // 待包装
            'FBAdelivery_table_lackup': col7,
            'FBAdelivery_table_finish': col6, // 已包装
            'FBAdelivery_table_cancel': col8,
            'FBAdistribute_table_createGoodsTable': col4,
            'FBAdistribute_table_submitGoodsTable': col5
        }

    //监听排序
    table.on('sort(FBAdelivery_table_check)', function(obj) {
        $('#FBAdistributeForm input[name="orderBy"]').val(obj.field + ' ' + obj.type);
        oaWeightSort(obj.field, obj.type)
        currentScrollPosition = $('.layui-show')[0].scrollTop
        refreshTable()
    });
    table.on('sort(FBAdelivery_table_waitSend)', function(obj) {
        $('#FBAdistributeForm input[name="orderBy"]').val(obj.field + ' ' + obj.type);
        oaWeightSort(obj.field, obj.type)
        currentScrollPosition = $('.layui-show')[0].scrollTop
        refreshTable()
    });
    table.on('sort(FBAdelivery_table_waitSet)', function(obj) {
        $('#FBAdistributeForm input[name="orderBy"]').val(obj.field + ' ' + obj.type);
        oaWeightSort(obj.field, obj.type)
        currentScrollPosition = $('.layui-show')[0].scrollTop
        refreshTable()
    });
    table.on('sort(FBAdelivery_table_waitCheck)', function(obj) {
        $('#FBAdistributeForm input[name="orderBy"]').val(obj.field + ' ' + obj.type);
        oaWeightSort(obj.field, obj.type)
        currentScrollPosition = $('.layui-show')[0].scrollTop
        refreshTable()
    });
    table.on('sort(FBAdelivery_table_lackup)', function(obj) {
        $('#FBAdistributeForm input[name="orderBy"]').val(obj.field + ' ' + obj.type);
        oaWeightSort(obj.field, obj.type)
        currentScrollPosition = $('.layui-show')[0].scrollTop
        refreshTable()
    });
    table.on('sort(FBAdelivery_table_finish)', function(obj) {
        $('#FBAdistributeForm input[name="orderBy"]').val(obj.field + ' ' + obj.type);
        oaWeightSort(obj.field, obj.type)
        currentScrollPosition = $('.layui-show')[0].scrollTop
        refreshTable()
    });
    table.on('sort(FBAdelivery_table_cancel)', function(obj) {
        $('#FBAdistributeForm input[name="orderBy"]').val(obj.field + ' ' + obj.type);
        oaWeightSort(obj.field, obj.type)
        currentScrollPosition = $('.layui-show')[0].scrollTop
        refreshTable()
        // }
    });

    function oaWeightSort(field, type) {
        if(field === 'oaWeight') {
            if (type === 'desc') {
                $('#FBAdistributeForm input[name="orderBy"]').val(2);
            }else if (type === 'asc') {
                $('#FBAdistributeForm input[name="orderBy"]').val(1);
            } else {
                $('#FBAdistributeForm input[name="orderBy"]').val();
            }
        }
    }

        // 修改销售备注

        table.on('edit(FBAdelivery_table_check)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_waitSend)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_waitSet)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_waitCheck)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        // table.on('edit(FBAdelivery_table_toCreate)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_lackup)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_cancel)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_finish)', function(obj) { FBAdelivery_editSalerRemark(obj)})


        function FBAdelivery_editSalerRemark(obj) {
            let value = obj.value //得到修改后的值
                ,
                data = obj.data //得到所在行所有键值
                ,
                field = obj.field; //得到字段
            let ajax = new Ajax()
            let Adata = {
                id: data.id
            }
            Adata[field] = data[field]
            ajax.post({
                url: ctx + "/amazonFBA/shipPlan/updatePlanQuality",
                data: JSON.stringify(Adata),
                contentType: 'application/json',
                success: function(data) {
                    if (data.code === '0000') {
                        layer.msg('修改成功')
                    }
                }
            })
        }

        element.on('tab(FBAdistribute_Tab)', function(data) {
            var tablename = $(this).attr('data-index');
            var matchStatus = $(this).attr('data-code');
            $('#FBAdistributeForm input[name="tablename"]').val(tablename);
            $('#FBAdistributeForm input[name="matchStatus"]').val(matchStatus);

            if(tablename == 'FBAdelivery_table_waitSet'){
              $('#FBAdistributeForm').find('.storageType').removeClass('disN');
            }else{
              $('#FBAdistributeForm').find('.storageType').addClass('disN');
            }

            let Adata = serializeObject($('#FBAdistributeForm'))
            Adata.page = 1
            FBAdelivery_search(Adata)
        });

        //获取站点
        function getInitFBAAmazonSite(isFirst) {
            if (FBAdelivery_global_siteEnum == null || FBAdelivery_global_siteEnum == undefined) {
                //赋值
                initAjaxSync('/enum/getSiteEnum.html?platCode=amazon', 'POST', {}, function(returnData) {
                    var data = returnData.data;

                    var map_FBAdelivery_global_siteEnum = new Map();
                    for (var i in data) {
                        map_FBAdelivery_global_siteEnum.set(data[i].code, data[i].name)
                    }
                    FBAdelivery_global_siteEnum = map_FBAdelivery_global_siteEnum;
                })
            }
            if (isFirst) {
                var canSelSiteList = [];
                FBAdelivery_global_siteEnum.forEach(function(value, key) {
                    var obj = {};
                    obj.site = key;
                    obj.siteName = value;
                    canSelSiteList.push(obj);
                });
                appendSelect($('#FBAdistributeForm select[name=salesSite]'), canSelSiteList, 'site', 'siteName');
                form.render('select');
            }
            return FBAdelivery_global_siteEnum;
        }
        //根据根据角色请求获取店铺列表
        function getFBAListStore(data, func) {
            initAjax('/sys/liststore.html', 'POST', data, function(returnData) {
                if (func) {
                    func(returnData)
                } else {
                    appendSelectForStoreSite('FBAdistributeForm', 'FBAdelivery_storeAcct', returnData.data, 'id', 'storeAcct', 'salesSite')
                        // formSelects.render('storeAcct')
                    form.render('select');
                }
            }, 'application/x-www-form-urlencoded');
        }

        //获取发货地址
        function getDeliveryAddress(func) {
            initAjax('/address/queryByAddressNamePost.html', 'POST', JSON.stringify({ addressType: 1 }), function(returnData) { //addressType:1 FBA地址
                appendSelect($('#FBAdistribute_layeracreateForm #distributeAddress'), returnData.data, 'id', 'addressName')
                form.render()
                if (func) {
                    func()
                }
            })
        }

        //修改发货数量
        function modifyDeliveryAmount(data, func) {
            initAjax('/amazonFBA/shipPlan/updatePlanQuality', 'POST', JSON.stringify(data), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }


        // 移除货件
        function deleteGoods(id, func) {
            initAjax('/amazonFBA/inboundShipment/delete.html', 'POST', JSON.stringify({ id: id }), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }

        //获取打印货品标签内容
        function printList(id, func) {
            initAjax('/amazonFBA/inboundShipment/detail.html', 'POST', JSON.stringify({ id: id }), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }

        //获取表格列表数据
        function getTableList(tablename, data) {
            var posturl = '/FbaDistributePlan/queryPage';
            data.ifCreateShipment = $('#FBAdistribute_ifCreateShipment').prop('checked') ? false : null
            data.skuSalespersonIdList = data.skuSalespersonIdList ? data.skuSalespersonIdList.split(',') : []
            data.shippingTypeList = data.shippingTypeList ? data.shippingTypeList.split(',') : []
            initAjax(posturl, 'POST', JSON.stringify(data), function(returnData) {
                FBArenderpage(returnData.count, data.page, data.limit);
                returnData.data?.forEach(item => {
                    item.matchStatus = data?.matchStatus
                })
                FBAtablerender(returnData.data, tablename, data.limit)
                getEveryLabelCount(data)
            })
        }

        function getAllPurStatusLableCount(data) {
            initAjax('/amazonFBA/countAllPurStatus.html', 'POST', JSON.stringify(data), function(returnData) {
                if (returnData.code === '0000') {
                    let list = returnData.data
                    let planBox = $('#FBAdelivery_purStatusSearchBox')
                    for (let i = 0; i < list.length; ++i) {
                        planBox.find('[name=purStatus][value=' + list[i].pur_status + ']').next('.layui-form-checkbox').find('font').text(list[i].num)
                    }
                }
            })
        }

        function getAllPlanStatusLabelCount(data) {
            initAjax('/amazonFBA/countAllPlanStatus.html', 'POST', JSON.stringify(data), function(returnData) {
                if (returnData.code === '0000') {
                    let list = returnData.data
                    let planBox = $('#planStatusBox_FBAdelivery')
                    for (let i = 0; i < list.length; ++i) {
                        planBox.find('[name=planStatus][value=' + list[i].plan_status + ']').next('.layui-form-checkbox').find('font').text(list[i].num)
                    }
                }
            })
        }

        function getAllMatchStatusLabelCount(data) {
            initAjax('/amazonFBA/countAllMatchStatus.html', 'POST', JSON.stringify(data), function(returnData) {
                if (returnData.code === '0000') {
                    let list = returnData.data
                    let matchStatusBox = $('#matchStatusCheckBox_FBAdelivery')
                    for (let i = 0; i < list.length; ++i) {
                        matchStatusBox.find('[name=matchStatus][value=' + list[i].match_status + ']').next('.layui-form-checkbox').find('font').text(list[i].num)
                    }
                }
            })
        }

        function getEveryLabelCount(data) {
            let ajax = new Ajax(false)
            ajax.post({
                url: ctx + '/FbaDistributePlan/countForAllStatus',
                data: JSON.stringify(data),
                success: function(res) {
                    if (res.code === '0000') {
                        let labelUl = $('#FBAdistrubute_label')
                        $('#FBAdistrubute_label').find('li span').text(0)
                        res.data?.forEach(item => {
                          $('#FBAdistrubute_label').find('[data-code=' + item.matchStatus + '] span').text(item.count || 0)
                        })
                    }
                }
            })
        }
        //生成货件请求
        function createGoods(data, func) {
            initAjax('/FbaDistributePlan/shipment/preCreate', 'POST', JSON.stringify(data), function(returnData) {
                if (func) {
                    func(returnData)
                }
            }, null, false)
        }

        //提交货件请求
        function submitGoods(data, func) {
            initAjax('/FbaDistributePlan/createShipment', 'POST', JSON.stringify(data), function(returnData) {
                if (func) {
                    func(returnData)
                }
            }, null, false)
        }

        //提交装箱
        function submitPack(data, func, func2) {
            initAjax('/amazonFBA/inboundShipment/submitCarton.html', 'POST', JSON.stringify(data), function(returnData) {
                    if (func) {
                        func(returnData)
                    }
                }, 'application/json', true,
                function(returnData) {
                    layer.msg('已提交装箱，约10min...', { icon: 4, time: 3000 })
                },
                function(returnData) {
                    if (func2) {
                        func2(returnData);
                    }
                })
        }
        //监听部门下拉框选择
        form.on('select(FBAdistribute_orgTree)', function(data) {
            var salePersonId = $('#FBAdistribute_userList').val()
            getFBAListStore({ roleNames: 'amazon专员', orgId: data.value, salePersonId: salePersonId, platCode: 'amazon' })
        });
        //监听销售员下拉选择
        form.on('select(FBAdistribute_userList)', function(data) {
            var orgId = $('#FBAdistribute_orgTree').val()
            getFBAListStore({ roleNames: 'amazon专员', orgId: orgId, salePersonId: data.value, platCode: 'amazon' })
        });

        //监听已完成tab状态单选筛选
        form.on('radio(FBAdelivery_tab_delivered)', function(data) {
                form.render('radio');
                $('#FBAdistributeForm input[name="shipmentStatus"]').val(data.value)
            currentScrollPosition = $('.layui-show')[0].scrollTop
                refreshTable()
            })
            //监听已完成tab状态单选筛选
        form.on('radio(FBAdelivery_tabfinished)', function(data) {
            form.render('radio');
            $('#FBAdistributeForm input[name="shipmentStatus"]').val(data.value)
            let Adata = serializeObject($('#FBAdistributeForm'))
            Adata.page = 1
            FBAdelivery_search(Adata)
        })

        //监听店铺下拉选择
        form.on('select(FBAdelivery_selAcct)', function(data) {
            var storeTmp = data.value;
            var sites = data.elem[data.elem.selectedIndex].dataset.sites;
            FBAdelivery_global_siteEnum = getInitFBAAmazonSite();
            var canSelSiteList = [];
            if (storeTmp) { //选择了店铺
                if (!$.isEmptyObject(sites)) {
                    var siteList = sites.split(",");
                    for (var i = 0; i < siteList.length; i++) {
                        var obj = {};
                        obj.site = siteList[i];
                        obj.siteName = FBAdelivery_global_siteEnum.get(siteList[i]);
                        canSelSiteList.push(obj);
                    }
                }
            } else {
                FBAdelivery_global_siteEnum.forEach(function(value, key) {
                    var obj = {};
                    obj.site = key;
                    obj.siteName = value;
                    canSelSiteList.push(obj);
                });
            }
            //美国/英国第一位
            canSelSiteList.sort(function(a, b) {
                if (a.site == 'US' && b.site != 'US') {
                    return -1;
                }
                if (a.site == 'GB' && b.site != 'GB') {
                    return -1;
                }
                return 0;
            });
            appendSelect($('#FBAdistributeForm select[name=salesSite]'), canSelSiteList, 'site', 'siteName');
            form.render('select');
        });


        // 表单提交
        form.on('submit(FBAdeliverySearch)', function(data) {
            FBAdelivery_search(data.field)
        });

        // form.on('checkbox(packStatusBox_FBAdistribute)', function(data) {
        //     var value = data.value
        //     var ifChecked = data.elem.checked
        //     // 单选且必选
        //     let otherStatusCheck = $('#packStatuBox_FBAdistribute').find('input:checked')
        //     otherStatusCheck.prop('checked', false)
        //     data.elem.checked = true
        //     form.render('checkbox', 'packStatuBox_FBAdistribute')

        //     let Adata = serializeObject($('#FBAdistributeForm'))
        //     Adata.page = 1
        //     FBAdelivery_search(Adata)
        // });

        function FBAdelivery_search(data) {

            data[data.skuType] = data.sku
            data.statusNum = tabObj[data.tablename];


            if (data.time) {
                data.startTime = data.time.split(' - ')[0] + ' 00:00:00';
                data.endTime = data.time.split(' - ')[1] + ' 23:59:59';
            }
            if(data.matchStatus ==2){
              data.storageTypeList = data.storageTypeList ? data.storageTypeList.split(',') : [];
            }else{
              delete data.storageTypeList;
            }
            // if (data.statusNum === '4') {
            //     let statusCheck = $('#packStatuBox_FBAdistribute').find('input:checked')
            //     if (statusCheck && statusCheck.length === 1) {
            //         data.ifPack = statusCheck.val()
            //     }
            //     // 请求待包装已包装的数量
            //     getPackStatusCount(data);
            // }
            // 控制按钮的展示贺隐藏
            FbaDelivery_showOrHideBatchBtn(data)
            getTableList(data.tablename, data);
        }

        // function getPackStatusCount(data) {
        //     let params = Object.assign({}, data)
        //     if (params.skuSalespersonIdList?.length === 0 ) {
        //         delete params.skuSalespersonIdList
        //     }
        //     let ajax = new Ajax(false)
        //     ajax.post({
        //         url: ctx + '/FbaDistributePlan/countForPackStatus',
        //         data: JSON.stringify(params),
        //         success: function(res) {
        //             if (res.code === '0000') {
        //                 res.data?.forEach(item => {
        //                     $('#packStatuBox_FBAdistribute').find('[value=' + item.ifPack + ']').next('.layui-form-checkbox').find('font').text(item.count || 0)
        //                 })
        //             }
        //         }
        //     })
        // };

        function FbaDelivery_showOrHideBatchBtn(data) {
            $('.FBAdelivery_batchBtn').hide()
            $('.FBAdistribute_batchBtn').hide()
            $('.selectable').hide()
            // $('#FBAdistributeForm [name=skuType] option[value="shipmentIdStr"]').remove()
            switch (data.statusNum) {
                case '0': //待审核
                    $('#FBAdistribute_check').show() // 审核
                    $('#FBAdistribute_setLable').show() // 设置标签
                    $('#FBAdelivery_markLabel').show()
                    $('#FBAdistribute_cancelAll').show()
                    $('#FBAdistributeForm [name=skuType] option[value="shipmentIdStr"]').remove()
                    if (tabCode !== '' && tabCode === data.statusNum) {
                    } else {
                        data.batchNo = ''
                        $('#FBAdistributeForm [name=batchNo]').val('')
                    }
                    break;
                case '1': // 待派单
                    $('#FBAdistribute_warehouse').show() // 派至仓库
                    $('#FBAdistribute_setLable').show() // 设置标签
                    $('#FBAdistribute_cancelAll').show()
                    $('#FBAdistributeForm [name=skuType] option[value="shipmentIdStr"]').remove()
                    if (tabCode !== '' && tabCode === data.statusNum) {
                    } else {
                        data.batchNo = ''
                        $('#FBAdistributeForm [name=batchNo]').val('')
                    }
                    break
                case '2': //待配货
                    $('#FBAdistribute_generate').show() // 生成货件
                    $('#FBAdistribute_batch').show() // 生成批次
                    $('#FBAdistribute_setLable').show() // 设置标签
                    $('#FBAdistribute_statistics').show() // 待建统计
                    $('.batchNoForm').show()
                    $('.ifCreateShipment').show()
                    if ($('#FBAdistributeForm [name=skuType] option[value="shipmentIdStr"]').length === 0) {
                        $('#FBAdistributeForm [name=skuType]').append('<option value="shipmentIdStr">货件编号</option>')
                    }
                    $('#FBAdistribute_cancelAll').show()
                    if (tabCode !== '' && tabCode === data.statusNum) {
                    } else {
                        queryBatchNo('2')
                        data.batchNo = ''
                        $('#FBAdistributeForm [name=batchNo]').val('')
                    }
                    break;
                case '3': // 待包装 
                    // $('#FBAdistribute_generate').show() // 生成货件
                    $('#FBAdistribute_setLable').show() // 设置标签
                    $('.batchNoForm').show()
                    $('#FBAdistribute_cancelAll').show()
                    if ($('#FBAdistributeForm [name=skuType] option[value="shipmentIdStr"]').length === 0) {
                        $('#FBAdistributeForm [name=skuType]').append('<option value="shipmentIdStr">货件编号</option>')
                    }
                    if (tabCode !== '' && tabCode === data.statusNum) {
                    } else {
                        queryBatchNo('3')
                        data.batchNo = ''
                        $('#FBAdistributeForm [name=batchNo]').val('')
                    }
                    break;
                // case '5': // 待建框
                //     $('#FBAdistribute_generate').show() // 生成货件
                //     $('#FBAdistribute_setLable').show() // 设置标签
                //     $('.batchNoForm').show()
                //     if (tabCode !== '' && tabCode === data.statusNum) {
                //     } else {
                //         queryBatchNo('5')
                //         data.batchNo = ''
                //         $('#FBAdistributeForm [name=batchNo]').val('')
                //     }
                //     break;
                case '6': //仓库缺货
                    $('#FBAdistribute_waitSend').show() // 转待派单
                    $('#FBAdistribute_setLable').show() // 设置标签
                    $('.batchNoForm').show()
                    $('#FBAdistributeForm [name=skuType] option[value="shipmentIdStr"]').remove()
                    if (tabCode !== '' && tabCode === data.statusNum) {
                    } else {
                        queryBatchNo('6')
                        data.batchNo = ''
                        $('#FBAdistributeForm [name=batchNo]').val('')
                    }
                    break;
                case '4': // 已包装
                    $('#FBAdistribute_setLable').show() // 设置标签
                    $('.FBAdistribute_batchBtn').show()
                    $('.batchNoForm').hide()
                    if ($('#FBAdistributeForm [name=skuType] option[value="shipmentIdStr"]').length === 0) {
                        $('#FBAdistributeForm [name=skuType]').append('<option value="shipmentIdStr">货件编号</option>')
                    }
                    if (tabCode !== '' && tabCode === data.statusNum) {
                    } else {
                        data.batchNo = ''
                        $('#FBAdistributeForm [name=batchNo]').val('')
                    }
                    break;
                case '9':
                    $('#FBAdistribute_setLable').show() // 设置标签 
                    $('.batchNoForm').hide()
                    $('#FBAdistributeForm [name=skuType] option[value="shipmentIdStr"]').remove()
                    if (tabCode !== '' && tabCode === data.statusNum) {
                    } else {
                        data.batchNo = ''
                        $('#FBAdistributeForm [name=batchNo]').val('')
                    }
                    break;
            }
            form.render()

            tabCode = data.statusNum
            data.batchNo = $('#FBAdistributeForm [name=batchNo]').val() || ''
        }

        // 审核
        $('#FBAdistribute_check').click(function () {
            let data = table.checkStatus('FBAdelivery_table_check').data
            if (data.length === 0) {
                layer.msg('请选择要审核的发货需求')
                return
            }
            layer.confirm('确定审核通过？', function(index) {
                let idList = [];
                for (let i = 0; i < data.length; ++i) {
                    idList.push(data[i].id)
                }
                let ajax = new Ajax();
                ajax.post({
                    url: '/FbaDistributePlan/audit',
                    data: idList,
                    success: function(res) {
                        if (res.code === '0000') {
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                        }
                    }
                });
                layer.close(index);
            })
        })

        // 设置物流标签
        $('#FBAdistribute_setLable').click(function () {
            let data = table.checkStatus(FBAdistribute_currentTableName).data
            if (data.length === 0) {
                layer.msg('请选择要设置物流标签的发货需求')
                return
            }
            setLabel(data);
        })

        // 转待派单
        $('#FBAdistribute_waitSend').click(function() {
            let data = table.checkStatus(FBAdistribute_currentTableName).data
            if (data.length === 0) {
                layer.msg('请选择要转待派单的发货需求')
                return
            }
            let idList = [];
            for (let i = 0; i < data.length; ++i) {
                idList.push(data[i].id)
            }
            FBAdistribute_toWaitSend(idList);
        })

        // 派至仓库
        $('#FBAdistribute_warehouse').click(function() {
            let data = table.checkStatus(FBAdistribute_currentTableName).data
            if (data.length === 0) {
                layer.msg('请选择要派至仓库的发货需求')
                return
            }
            layer.confirm('确定派至仓库？', function(index) {
                let idList = [];
                for (let i = 0; i < data.length; ++i) {
                    idList.push(data[i].id)
                }
                let ajax = new Ajax();
                ajax.post({
                    url: '/FbaDistributePlan/distribute',
                    data: idList,
                    success: function(res) {
                        if (res.code === '0000') {
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                            layer.open({
                                title: '操作结果',
                                area: ['600px', '400px'],
                                content: res?.data || '操作成功',
                                btn: ['确定'],
                                yes: function(index) {
                                    layer.close(index)
                                }
                            })
                        }
                    },
                    error: function(err) {
                        console.log('err', err);
                    }
                }, 'area');
                layer.close(index);
            })
        })

        // 待建批次统计
        $('#FBAdistribute_statistics').click(function() {
            let layerPopId = layer.open({
                type: 1,
                title: '待建批次统计',
                // btn: ['提交', '关闭'],
                area: ['800px', '90%'],
                content: $('#FBAdistribute_statisticsPop').html(),
                success: function(layero, index) {
                    // 初始化标签
                    let ajax = new Ajax();
                    ajax.post({
                        url: '/FbaDistributePlan/statiscCanGenerateBatchNo',
                        success:function(res){
                            res.data = res.data.sort((a, b) => {
                                return b.totalWeight - a.totalWeight;
                            });
                            if (res.code === '0000') {
                                table.render({
                                    elem: '#FBAdistribute_statisticsTable',
                                    method: 'POST',
                                    data: res.data,
                                    cols: [[
                                        {title: '店铺', field: 'storeAcct'},
                                        {title: '站点', field: 'salesSite'},
                                        {title: '待建需求数量', field: 'total'},
                                        {title: '商品数量', field: 'totalGoodsQty'},
                                        {title: '预估重量(kg)', field: 'totalWeight'},

                                    ]],
                                    sortType: 'total',
                                    page: false,
                                    limit:20,
                                    id: 'FBAdistribute_statisticsTable',
                                    done: function(res, curr, count) {
                                    }
                                })
                            }
                        }
                    })
                }
            })
        })

        // 生成批次
        $('#FBAdistribute_batch').click(function() {
            let data = table.checkStatus(FBAdistribute_currentTableName).data
            if (data.length === 0) {
                layer.msg('请选择要生成批次的发货需求')
                return
            }
            layer.confirm('确定生成批次？', function(index) {
                let idList = [];
                for (let i = 0; i < data.length; ++i) {
                    idList.push(data[i].id)
                }
                let ajax = new Ajax();
                ajax.post({
                    url: '/FbaDistributePlan/generateBatchNo',
                    data: idList,
                    success: function(res) {
                        if (res.code === '0000') {
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            layer.msg('生成批次成功！')
                            batchNoList.push(res?.data || '')
                            renderBatchNo()
                            refreshTable();
                        }
                    }
                });
                layer.close(index);

            })
        })

        // 生成货件
        $('#FBAdistribute_generate').click(function() {
            let data = table.checkStatus(FBAdistribute_currentTableName).data
            if (FBAdistribute_currentTableName !== 'FBAdelivery_table_waitSet') {
                // 批次号有空
                const isEmpty = data.some(item => item.batchNo === '')
                // 批次号相同
                // 获取所有批次号
                let batchNoArr = data.map(item => item.batchNo)
                const isEqualFlag = batchNoArr.every(item => item === batchNoArr[0])
                if (isEmpty || !isEqualFlag) {
                    return layer.msg('请选择同一批次号且批次号不为空的发货需求')
                }
            }

            var storeArr = [];
            var siteArr = [];
            for (var i in data) {
                if (!(storeArr.indexOf(data[i].storeAcct) > -1)) {
                    storeArr.push(data[i].storeAcct)
                }
                if (!(siteArr.indexOf(data[i].salesSite) > -1)) {
                    siteArr.push(data[i].salesSite)
                }
            }
            if (data.length > 0) {
                if (storeArr.length > 1 || siteArr.length > 1) {
                    layer.msg('请选择同一站点同一店铺的发货需求，你可以使用店铺，站点条件进行筛选查询')
                } else {
                    var createGoodsTableIns = {}
                    layer.open({
                        type: 1,
                        title: '生成货件',
                        btn: ['预建货件', '关闭'],
                        area: ['90%', '90%'],
                        content: $('#pop_FBA_distribute_createGoods').html(),
                        id: 'pop_FBA_createGoodsLayer',
                        success: function(index, layero) {
                            // 固定表头
                            $('#pop_FBA_createGoodsLayer').scroll(function() {
                                toFixedTabHead(this)
                            })
                            form.render()
                            getDeliveryAddress(function() {
                                FBAdeliveryselected('distributeAddress', storeArr[0])
                            })
                            //初始化物流
                            initAjax("/fba/sale/logistics/query.html", "POST", JSON.stringify(data.field), function(returnData) {
                                appendSelectForSaleLogisticType($('#FBAdistribute_layeracreateForm [name=saleLogisticTypeId]'), returnData.data, 'id', 'name',null,'物流方式');
                                form.render('select','FBAdistribute_layeracreateForm');
                            })

                            packTable(data, 'FBAdistribute_table_createGoodsTable', function(callback) {
                                createGoodsTableIns = callback
                            }, true)

                            var layFilterIndex = 'LAY-table-' + createGoodsTableIns.config.index;
                            var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                            // calculateQuantityTotal()

                            tableContainer.find('tr').each(function(index, item) {
                                $(item).find('input').blur(function() {
                                    if ($(this).val() === "") {
                                        layer.msg('计划发货数量不能为空');
                                        $(item).find('input').val('1')
                                    }
                                })
                            })
                            initNotNull('#FBAdistribute_layeracreateForm')
                        },
                        yes: function(index, layero) {
                            if (!checkNotNull('#FBAdistribute_layeracreateForm')) {
                                return false
                            }
                            let Adata = serializeObject($('#FBAdistribute_layeracreateForm'))
                            var addressId = $('#distributeAddress').val();
                            var layFilterIndex = 'LAY-table-' + createGoodsTableIns.config.index;
                            var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]').find('.layui-table-body');
                            var plans = table.cache.FBAdistribute_table_createGoodsTable.filter(function(item) {
                                return !(item && !isNaN(item.length))
                            })
                            Adata.salesSite = plans[0].salesSite;
                            Adata.storeAcctId = plans[0].storeAcctId;
                            plans = plans.map(function(item) {
                                var { id, historyId, planQuality, sellerSku, picUrl,availableQuality } = item
                                return { id, historyId, planQuality, sellerSku, picUrl,availableQuality }
                            })
                            tableContainer.find('tr').each(function(index, item) {
                                plans[index].planQuality = $(item).find('input').val() || 1
                            })
                            for (var i in plans) {
                                if (plans[i].planQuality <= 0) {
                                    layer.msg('计划发货数量需要大于0');
                                    return false;
                                }
                                // if (plans[i].planQuality> plans[i].availableQuality) {
                                //     layer.msg('计划发货数量需要小于可用库存');
                                //     return false;
                                // }
                            }
                            Adata.plans = plans
                            createGoods(Adata, function(returnData) { pop_submitGoods(returnData.data) })
                            return false;
                        }
                    })
                }
            } else {
                layer.msg('请勾选需要生成货件的发货需求')
            }
            return false;
        })

        // 批量取消
        $('#FBAdistribute_cancelAll').click(function() {
            let data = table.checkStatus(FBAdistribute_currentTableName).data
            if (data.length === 0) {
                layer.msg('请选择要取消的发货需求')
                return
            }
            let idList = [];
            for (let i = 0; i < data.length; ++i) {
                idList.push(data[i].id)
            }
            deleteDeliveryPlan(idList)
        })
        

        function setLabel(data, type) {
            let idList = [];
            if (type === 'inner') {
                let detail = data[0].detail || []
                for (let i = 0; i < detail?.length; ++i) {
                    idList.push(detail[i].planId)
                }
            } else {
                for (let i = 0; i < data.length; ++i) {
                    idList.push(data[i].id)
                }
            }
            let layerPopId = layer.open({
                type: 1,
                title: '设置物流标签',
                btn: ['提交', '关闭'],
                area: ['400px', '300px'],
                content: $('#FBAdistribute_setPlanLabelPop').html(),
                success: function(layero, index) {
                    // 初始化标签
                    oneAjax.post({
                        url: '/sys/listdict.html',
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        data:{headCode:"FBA_SHIP_PLAN_LABEL"},
                        success:function(res){
                            if (res.code === '0000') {
                                let list = res.data
                                let html = ''
                                for (let i = 0; i < list.length; ++i) {
                                    let one = list[i]
                                    html += `<input type="checkbox" name="label" value="`+ one.name +`" title="`+ one.name +`" lay-skin="primary" >`
                                }
                                $('#FBAdistribute_setPlanLabelContains').html(html)
                                form.render('checkbox','FBAdistribute_setPlanLabelForm')
                            }
                        }
                    })
                }
                ,yes : function () {
                    let formData = serializeObject($('#FBAdistribute_setPlanLabelForm'))
                    let labelList = formData.label ? formData.label.split(',') : []
                    let Adata = {
                        planIdList: idList,
                        labelList: labelList,
                        labelType: 3
                    }
                    oneAjax.post({
                        url: ctx + '/fbaHistoryProduct/updateLabelByPlanIdList',
                        data: Adata,
                        success: function (res) {
                            if (res.code === '0000') {
                                $('#FBAhistory_Search').click()
                                layer.close(layerPopId)
                                refreshTable()
                            }
                        }
                    })
                }
            })
        }


        function calTotalWeightAndThrowWeight(data) {
            let statisticInfo = {}
            let totalWeight = 0
            let totalThrowWeight = 0
            for (let i = 0; i < data.length; ++i) {
                let prodSInfo = data[i].prodSInfo
                if (!prodSInfo) {
                    continue
                }
                totalWeight += accDiv((prodSInfo.suttleWeight + prodSInfo.packWeight), 1000) * data[i].planQuality
                totalThrowWeight += accDiv(prodSInfo.outerBoxHeight * prodSInfo.outerBoxWidth * prodSInfo.outerBoxLength , 6000) * data[i].planQuality
            }
            statisticInfo.totalWeight = totalWeight.toFixed(3)
            statisticInfo.totalThrowWeight = totalThrowWeight.toFixed(3)
            return statisticInfo
        }

        function packTable(data, tablename, func, totalRow) {
            if (tablename === 'FBAdistribute_table_createGoodsTable') {
                let planQualitySum = data && data.reduce((sum, item) => sum + item.planQuality, 0);
                let tableItem = tablecol[tablename][0];
                let statisticInfo = calTotalWeightAndThrowWeight(data)
                for (let i = 0; i < tableItem?.length; i++) {
                    if (tableItem[i].field === 'prodSSku') {
                        tableItem[i].totalRowText = '总SKU计数: ' + data?.length
                    }
                    if (tableItem[i].field === 'storeAcct') {
                        tableItem[i].totalRowText = '总实重: ' + statisticInfo.totalWeight + ';总抛重:' + statisticInfo.totalThrowWeight
                    }
                    if (tableItem[i].field === 'planQuality') {
                        tableItem[i].totalRowText = String(planQualitySum)
                    }
                }
            }
            if (tablename === 'FBAdistribute_table_submitGoodsTable') {
                for (let i = 0; i < data.length; ++i) {
                    let labelSet = {}
                    let oneData = data[i]
                    for (let k = 0; k < oneData.detail.length; ++k) {
                        let oneSkuRel = oneData.detail[k]
                        if (!oneSkuRel.labelList || !oneSkuRel.labelList.length) {
                            oneData.labelStr = ''
                            continue
                        }
                        for (let j = 0; j < oneSkuRel.labelList.length; ++j) {
                            labelSet[oneSkuRel.labelList[j].labelName] = 1
                        }
                    }

                    let labelList = []
                    for (let key in labelSet){
                        labelList.push(key)
                    }
                    oneData.labelStr = labelList.join(",")
                }
            }

            var tableIns = table.render({
                elem: '#' + tablename,
                method: 'POST',
                data: data,
                cols: tablecol[tablename],
                page: false,
                limit: 500,
                id: tablename,
                totalRow: totalRow || false,
                done: function(data) {
                    imageLazyload();
                    // imageLazyloadAll();

                    tableMerge.render(this); //合并列单元格，根据merge：""相等进行分组合并
                }
            });
            if (func) {
                func(tableIns)
            }
        }

        function calculateQuantityTotal() {
            $("#FBAdistribute_table_createGoodsTable").next().find('tbody').find("td[data-field ^= 'planQuality'] input").change(function() {
                var datafield = $(this).parents('td').attr('data-field');
                if ($(this).val() !== "") {
                    var tr = $(this).parents('tr')
                    columnSum(datafield, '2')
                }
                let index =  parseInt($(this).closest('tr').attr('data-index'))
                var data = table.cache.FBAdistribute_table_createGoodsTable
                data[index].planQuality = this.value
                let statisticInfo = calTotalWeightAndThrowWeight(data)
                $("#FBAdistribute_table_createGoodsTable").next().find('.layui-table-total td[data-field=storeAcct] div').text('总实重: ' + statisticInfo.totalWeight + ';总抛重:' + statisticInfo.totalThrowWeight)
            })
        }

        // 纵向合计
        function columnSum(datafield, type) {
            var amount = 0;
            $('.create-picker .layui-table-box').find('td[data-field="' + datafield + '"]').each(function(index, item) {
                if (type === '1') {
                    amount += Number($(item).find('div').text())
                } else {
                    amount += Number($(item).find('div input').val())
                }
            })
            $("#FBAdistribute_table_createGoodsTable").next().find('.layui-table-total td[data-field="' + datafield + '"] div').text(amount)
        }

        //补充发货地址
        form.on('submit(FBAdelivery_full_address_form_submit)', function(data) {
            initAjax('/amazonFBA/inboundShipment/setAdressId.html', 'POST', JSON.stringify(data.field), function(returnData) {
                layer.msg(returnData.msg || "OA系统地址补充成功(30min内有效)")
                currentScrollPosition = $('.layui-show')[0].scrollTop
                refreshTable()
            }, null, true)
        })

        //移除或设置SKU的过期时间
        form.on('submit(FBAdelivery_fix_remove_expirDate_form_submit)', function(data) {
                initAjax('/amazonFBA/inboundShipment/fixOrRemoveExpirDate.html', 'POST', JSON.stringify(data.field), function(returnData) {
                    layer.msg(returnData.msg || "过期时间处理成功")
                    currentScrollPosition = $('.layui-show')[0].scrollTop
                    refreshTable()
                }, null, true)
            })
            //分页
        function FBArenderpage(count, current, limit) {
            laypage.render({
                elem: 'FBAdistribute_page',
                curr: current,
                limit: limit,
                limits: [25, 50, 100, 200, 500, 1000, 2000],
                layout: ['prev', 'page','skip', 'next', 'count', 'limit'],
                count: count,
                jump: function(obj, first) {
                    $('#FBAdistributeForm input[name="limit"]').val(obj.limit); //保障下次的分页请求中带有的值正确
                    $('#FBAdistributeForm input[name="page"]').val(obj.curr); //保障下次的分页请求中带有的值正确
                    //首次不执行
                    if (!first) {
                        var data = getFormReqObj("FBAdistributeForm");
                        data.page = obj.curr;
                        data.limit = obj.limit;
                        data[data.skuType] = data.sku;
                        data.statusNum = tabObj[data.tablename];
                        if (data.time) {
                            data.startTime = data.time.split(' - ')[0] + ' 00:00:00';
                            data.endTime = data.time.split(' - ')[1] + ' 23:59:59';
                        }

                        if (data.statusNum === '100') {
                            let statusCheck = $('#planStatusBox_FBAdelivery').find('input:checked')
                            if (statusCheck && statusCheck.length === 1) {
                                data.planStatus = statusCheck.val()
                            }
                        }
                        if (data.statusNum === '0') {
                            let statusCheck = $('#FBAdelivery_purStatusSearchBox').find('input:checked')
                            if (statusCheck && statusCheck.length === 1) {
                                data.purStatus = statusCheck.val()
                            }
                        }

                        if (data.statusNum === '1') {
                            let statusCheck = $('#matchStatusCheckBox_FBAdelivery').find('input:checked')
                            if (statusCheck && statusCheck.length === 1) {
                                data.matchStatus = statusCheck.val()
                            }
                        }
                        if(data.matchStatus ==2){
                          data.storageTypeList = data.storageTypeList ? data.storageTypeList.split(',') : [];
                        }else{
                          delete data.storageTypeList;
                        }

                        // if (data.statusNum === '4') {
                        //     let statusCheck = $('#packStatuBox_FBAdistribute').find('input:checked')
                        //     if (statusCheck && statusCheck.length === 1) {
                        //         data.ifPack = statusCheck.val()
                        //     }
                        // }
                        getTableList(data.tablename, data);
                    }
                }
            });
        }

        function getFormReqObj(formIdName) { //获取表单参数
            var d = {};
            var t = $('#' + formIdName + ' [name]').serializeArray();
            $.each(t, function() {
                d[this.name] = this.value;
            });
            return d;
        }

        function FBAtablerender(data, tablename, limit) {
            FBAdistribute_currentTableName = tablename
            table.render({
                elem: '#' + tablename,
                method: 'POST',
                data: data,
                cols: tablecol[tablename],
                sortType: 'server',
                page: false,
                id: tablename,
                limit: limit,
                totalRow: true, //开启合计行
                done: function(res, curr, count) {
                    imageLazyload();


                    //设置总数
                    var planQuality = 0
                    for (var i in res.data) {
                        planQuality += res.data[i].planQuality
                    }
                    $('#LAY-FBAdelivery th[data-field="planQuality"]').append('<div>(' + planQuality + ')</div>')
                    //新增汇总
                    var allCartonWeight = 0.0;
                    var allWeight = 0.0;
                    if (data) {
                        for (var i in data) {
                            if (data[i].totalWeight) {
                                allWeight += parseFloat((data[i].totalWeight / 1000).toFixed(2));
                            }
                            if (data[i].totalCartonWeight) {
                                allCartonWeight += parseFloat((data[i].totalCartonWeight).toFixed(2));
                            }
                        }
                    }
                    var weight_tpl =
                        `<div class="text_l"><span>称重:&{totalCartonWeight}</span></div>
                                    <div class="text_l"><span>商品合重:&{allWeight}</span></div>`;

                    $("#" + tablename).next().find('.layui-table-total td[data-field="totalWeight"] div').html(weight_tpl.replace(/&{totalCartonWeight}/g, allCartonWeight.toFixed(2)).replace(/&{allWeight}/g, allWeight.toFixed(2)));
        
                    var allWeight = 0.0;
                    var allCost = 0.0
                    if (data) {
                        for (var i in data) {
                            if (data[i].oaWeight) {
                                allWeight += parseFloat(((data[i].oaWeight * data[i].planQuality)).toFixed(2));
                            }
                            if (data[i].oaCost) {
                                allCost += parseFloat(((data[i].oaCost * data[i].planQuality)).toFixed(2));
                            }
                        }
                        
                    }
                    allWeight = parseFloat(allWeight / 1000).toFixed(2);
                    allCost = allCost.toFixed(2);
                    $("#" + tablename).next().find('.layui-table-total td[data-field="oaWeight"] div').html(allWeight);
                    $("#" + tablename).next().find('.layui-table-total td[data-field="oaCost"] div').html(allCost);

                }
            })
        }

        // 批量审核
        $('#FBAdelivery_batch_auditPlan').click(function() {
                var data = table.checkStatus('FBAdelivery_table_deliveryPlan').data
                if (data.length === 0) {
                    layer.msg('请选择要审核的发货需求')
                    return
                }
                var idList = [];
                for (let i = 0; i < data.length; ++i) {
                    idList.push(data[i].id)
                }
                FBAdelivery_auditPlanBatch(idList)
            })
            //提交货件弹框
        function pop_submitGoods(data) {
            layer.open({
                type: 1,
                title: '提交货件',
                // btn: FBAdistribute_currentTableName === 'FBAdelivery_table_waitSet' ? ['关闭'] : ['提交全部货件', '关闭'],
                btn: ['提交全部货件', '关闭'],
                area: ['65%', '70%'],
                content: $('#pop_FBA_distribute_submitGoods').html(),
                success: function(index, layero) {
                    packTable(data, 'FBAdistribute_table_submitGoodsTable')
                    // 标记分仓
                    $('#FBAdelivery_markDivideWarehouse').click(function () {
                        let data = table.checkStatus('FBAdistribute_table_submitGoodsTable').data
                        if (data.length === 0) {
                            layer.msg('请选择要设置物流标签的货件')
                            return
                        }
                        setLabel(data, 'inner');
                    })
                    // 复制选中的fnSku
                    $('#FBAdistribute_copyAllFnSku').click(function(){
                        let data = table.checkStatus('FBAdistribute_table_submitGoodsTable').data
                        if (data.length === 0) {
                            layer.msg('请选择数据')
                            return
                        }
                        const fnSkuList = []
                        data.forEach(v=>{
                            if(v.detail && v.detail.length){
                                v.detail.forEach(elem=>{
                                    if(elem.fnSku && !fnSkuList.includes(elem.fnSku)){
                                        fnSkuList.push(elem.fnSku)
                                    }
                                })
                            }
                        })
                        copyTxtToClipboard(fnSkuList.join())
                    })
                },
                yes: function(index, layero) {
                    // if (FBAdistribute_currentTableName === 'FBAdelivery_table_waitSet') {
                    //     layer.close(index);
                    // } else {
                        var shipDtoList = table.cache.FBAdistribute_table_submitGoodsTable.filter(function(item) {
                            return !(item && !isNaN(item.length))
                        })
                        // 修改data ifDeleteOnPreCreate 如果被删除那么为true
                        let existIdList = shipDtoList?.map(item => item.shipmentId)
                        data?.forEach(item => {
                            if(existIdList?.includes(item.shipmentId)) {
                                item.ifDeleteOnPreCreate = false
                            } else {
                                item.ifDeleteOnPreCreate = true
                            }
                        })
                        
                            // 校验数量上下限
                        for (let i = 0; i < shipDtoList.length; ++i) {
                            for (let j = 0; j < shipDtoList[i].detail.length; ++j) {
                                if (!isInteger(shipDtoList[i].detail[j].planQuality)) {
                                    layer.msg(shipDtoList[i].shipmentId + '中的商品' + shipDtoList[i].detail[j].sellerSku + '的数量非法')
                                    return false
                                }
                                if (shipDtoList[i].detail[j].planQuality < shipDtoList[i].detail[j].planQualityMin ||
                                    shipDtoList[i].detail[j].planQuality > shipDtoList[i].detail[j].planQualityMax) {
                                    layer.msg(shipDtoList[i].shipmentId + '中的商品' + shipDtoList[i].detail[j].sellerSku + '的数量不在可调整的上下限之内')
                                    return false
                                }
                            }
                        }
                        let confirmIndex = layer.confirm('确认创建当前【' + shipDtoList.length+ '个】货件', function (result) {
                            layer.close(confirmIndex)
                            submitGoods(data, function(returnData) {
                                layer.alert(returnData.data || returnData.msg || '提交货件成功！');
                                setTimeout(() => {
                                    layer.closeAll();
                                    currentScrollPosition = $('.layui-show')[0].scrollTop
                                    refreshTable();
                                }, 1000)
                            })
                        })
                    // }
                }
            })
        }
        // 渲染呆滞库存检查结果 表格
        function renderLazyStockTable(pushStore) {
            let popHeight = $('#pop_FBA_lazyStockCheckLayer')[0].clientHeight
            oneAjax.post({
                url: '/purOrderMain/queryLazyStockResult.html',
                data: {isDistributionStore: pushStore},
                success: function(res) {
                    if (res.code === '0000') {
                        let list = res.data
                        let showList = []
                        for (let i = 0; i < list.length; ++i) {
                            let one = list[i]
                            one.yiwuAvailable = one.whStock.currentStock - one.whStock.reservationStock
                            one.yiwuPreAvailable = one.whStock.currentStock - one.whStock.reservationStock - one.whStock.preReservationStock + one.whStock.onwayStock
                            one.fbaAvailable = one.whStockFba.currentStock - one.whStockFba.reservationStock
                            one.fbaPreAvailable = one.whStockFba.currentStock - one.whStockFba.reservationStock + one.whStockFba.onwayStock
                            one.fbaLackStock = one.fbaPreAvailable >= one.totalPlanAmount ? 0 : (one.totalPlanAmount - one.fbaPreAvailable)
                            if (one.fbaLackStock === 0 ) {
                               continue
                            }
                            showList.push(one)
                            // if (pushStore) { // 铺货店铺 ； 缺货数量<= 义乌仓可用库存时，才调拨. 否则直接全采购
                                if (one.yiwuAvailable >= one.fbaLackStock) {
                                    one.planToTransferAmount =one.fbaLackStock
                                    one.planToPurchaseAmount = 0
                                } else {
                                    one.planToTransferAmount = 0
                                    one.planToPurchaseAmount = one.fbaLackStock > one.yiwuPreAvailable? (one.fbaLackStock - one.yiwuPreAvailable) : 0
                                }
                            // } else {
                            //     one.planToTransferAmount = one.yiwuAvailable > one.fbaLackStock ? one.fbaLackStock : one.yiwuAvailable
                            //     one.planToPurchaseAmount = one.fbaLackStock
                            // }
                        }

                        table.render({
                            elem: '#lazyStockTable',
                            data: showList,
                            limit: showList.length,
                            cols: [[
                                { checkbox: true, width: 20 },
                                { title: "商品sku", field: "prodSSku" },
                                { title: "店铺站点", field: "storeAcct", templet: '<div>{{d.storeAcct + "-" + d.salesSite}}</div>' },
                                {
                                    title: "默认直邮仓库位",
                                    templet: function(res) {
                                        return '<em>' + (res.whStock.stockLocation || '') + '</em> '
                                    },
                                },
                                {
                                    title: "直邮仓库存",
                                    templet: function(res) {
                                        return '<em>' + res.whStock.currentStock + '</em>'
                                    }
                                },
                                {title: "直邮仓可用", field: 'yiwuAvailable',style:"background-color:#fff7e4",sort:true},
                                {title: "直邮仓预计可用(含在途)", field: 'yiwuPreAvailable',sort: true, style:"background-color: #e7f4ff"},
                                {title: "直邮仓未审核采购单商品数量", field: 'yiwuUnAuditAmount',sort: true, filter: true,  style:"background-color: #ffe4e4"},
                                {
                                    title: "直邮7/15/30天销量",
                                    templet: function(res) {
                                        return '<em>' + res.whSalesCount.sevenSalesNum + '/' + res.whSalesCount.fifteenSalesNum + '/'+ res.whSalesCount.thirtySalesNum  + '</em>'
                                    }
                                },
                                {
                                    title: "FBA仓可用",
                                    field: 'fbaAvailable',sort: true, style:"background-color: #fff7e4"
                                },
                                {title: "FBA仓预计可用(含在途)",field: 'fbaPreAvailable', sort: true, style:"background-color: #e7f4ff"},
                                {title: "FBA仓未审核采购单商品数量", field: 'fbaUnAuditAmount',sort: true, filter: true, style:"background-color: #ffe4e4"},
                                { title: "计划发货总数", field: "totalPlanAmount",style:"background-color: #FFB800" },
                                {
                                    title: "需要调拨",
                                    field: "planToTransferAmount",sort: true, filter: true,
                                    edit: 'text',
                                    templet: function(res) {
                                        return '<div><em>' + (res.planToTransferAmount) + '</em> <i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i></div> '
                                    }
                                },
                                {
                                    title: "需要采购",
                                    field: "planToPurchaseAmount",sort: true, filter: true,
                                    edit: 'text',
                                    templet: function(res) {
                                        return '<div><em>' + (res.planToPurchaseAmount) + '</em> <i class="layui-icon layui-icon-edit" style="color: #009688">&#xe642;</i></div> '
                                    }
                                },
                            ]] ,
                            page: false,
                            height: popHeight - 80,
                            id: 'lazyStockTable',
                            done: function() {}
                        })
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })

        }

    // 铺货采购
    $('#FBAdelivery_prevPurchase').click(function() {
        prePurchasePop(true)
    })
    // 非铺货采购
    $('#FBAdelivery_prevPurchaseUn').click(function() {
        prePurchasePop(false)
    })
        function prePurchasePop(pushStore) {
            let title
            if (pushStore) {
                title = '铺货采购'
            } else {
                title = '非铺货采购'
            }
            layer.open({
                type: 1,
                title: title,
                btn: ['关闭'],
                area: ['85%', '90%'],
                content: $('#pop_FBA_lazyStockCheck').html(),
                id : 'pop_FBA_lazyStockCheckLayer',
                success: function(index, layero) {
                    // 获取当前弹窗高度
                    renderLazyStockTable(pushStore)
                    if (pushStore) {
                        // $('#FBAdelivery_PurToYiwu').show()
                    } else {
                        $('#FBAdelivery_PurToFBA').show()
                    }
                    // 生成亚马逊 调拨单
                    $('#generate_amazonOtherStorage').click(function() {
                        var data = table.checkStatus('lazyStockTable').data
                        if (!data.length) {
                            layer.msg('请选择要生成其他出库单的数据')
                            return
                        }
                        var notNumSku = []
                        var overStockSku = []
                        // var overPlanSku = []
                        for (var i = 0; i < data.length; ++i) {
                            let one = data[i]
                            if (!isInteger(one.planToTransferAmount) || one.planToTransferAmount <= 0) {
                                notNumSku.push(one.prodSSku)
                                continue
                            }
                            one.planToTransferAmount = parseInt(one.planToTransferAmount)
                            if (one.planToTransferAmount > (one.yiwuAvailable)) {
                                overStockSku.push(one.prodSSku)
                            }
                        }
                        var msg = '';
                        if (notNumSku.length > 0) {
                            msg += '以下sku生成入库数量非正整数：[' + notNumSku.join(',') + '];'
                        }
                        if (overStockSku.length > 0) {
                            msg += '以下sku生成入库数量大于可用数量：[' + overStockSku.join(',') + '];'
                        }
                        if (msg) {
                            layer.msg(msg)
                            return
                        }
                        initAjax("/tranOrder/createTranOrderStorageForFbaLazyStock.html", "POST", JSON.stringify(data), function(returnData) {
                            renderLazyStockTable(pushStore)
                            layer.alert(returnData.msg);
                        });
                    })

                    // // 采购到义乌仓
                    // $('#FBAdelivery_PurToYiwu').click(function () {
                    //     purchaseBatch(false,pushStore)
                    // })
                    // 采购到FBA仓
                    $('#FBAdelivery_PurToFBA').click(function () {
                        purchaseBatch(true,pushStore)
                    })
                }
            })
        }

    /**
     * 批量采购
     * @param isDefaultFBA 是否采购到FBA仓
     */
    function purchaseBatch(isDefaultFBA,pushStore) {
        let data = table.checkStatus('lazyStockTable').data
        if (!data.length) {
            layer.msg('请选择要生成其他出库单的数据')
            return
        }
        let notNumSku = []
        let unauditPurSku = [] // FBA仓存在未审核采购订单的sku
        for (let i = 0; i < data.length; ++i) {
            let one = data[i]
            if (!isInteger(one.planToPurchaseAmount) || one.planToPurchaseAmount <= 0) {
                notNumSku.push(one.prodSSku);
                continue;
            }
            if (one.fbaUnAuditAmount > 0) {
                unauditPurSku.push(one.prodSSku)
            }
        }
        let msg = '';
        if (notNumSku.length > 0) {
            msg += '以下sku生成入库数量非正整数：[' + notNumSku.join(',') + '];'
        }
        if (msg) {
            layer.msg(msg)
            return
        }
        let Adata = {
            ifFbaDefault: isDefaultFBA,
            dtoList: data
        }
        
        if (unauditPurSku.length > 0) {
            layer.confirm('以下SKU存在未审核采购订单【'+ unauditPurSku.join(',') +'】，是否继续采购?', {icon: 3, title:'提示'}, function(index){
                initAjax("/purOrderMain/createPurOrderForFba", "POST", JSON.stringify(Adata), function(returnData) {
                    renderLazyStockTable(pushStore)
                    layer.alert(returnData.msg);
                });
            })
        } else {
            initAjax("/purOrderMain/createPurOrderForFba", "POST", JSON.stringify(Adata), function(returnData) {
                renderLazyStockTable(pushStore)
                layer.alert(returnData.msg);
            });
        }
    }



        //监听工具栏操作
        for (let i in tablecol) {
            table.on('tool(' + i + ')', function(obj) {
                let data = obj.data;
                let layEvent = obj.event;
                let thisTR = obj.tr; //tr的dom元素
                if (layEvent === 'FBA_modifyAmount') { //修改发货数量
                    layer.open({
                        type: 1,
                        title: '修改发货数量',
                        btn: ['保存', '关闭'],
                        area: ['40%', '30%'],
                        content: $('#pop_FBAdistrubute_modifyAmount').html(),
                        success: function(layero, index) {
                            $(layero).find('input').val(data.planQuality)
                        },
                        yes: function(index, layero) {
                            var amount = $(layero).find('input').val();
                            modifyDeliveryAmount({ id: data.id, planQuality: amount }, function(returnData) {
                                layer.msg(returnData.msg || '成功修改发货数量')
                                currentScrollPosition = $('.layui-show')[0].scrollTop
                                refreshTable();
                                //更新表格对应的行数据
                                // thisTR.find('td[data-field=planQuality]>div').html(`${amount}`);
                                layer.close(index)
                            })
                        }
                    })
                }
                if (layEvent === 'FBAdistribute_auditPlan') { // 审核
                    FBAdelivery_auditPlanBatch([data.id])
                }
                if (layEvent === 'FBAdistribute_removePro') { // 取消
                    deleteDeliveryPlan([data.id])
                }

                if (layEvent === 'FBAdistribute_toCheckStatus') { // 转待审核
                    FBAdistribute_toCheckStatus([data.id])
                }

                if (layEvent === 'FBA_distribute_createTable') { //生成货件表格移除商品
                    obj.del();
                    calculateQuantityTotal()
                    columnSum('planQuality', '2')
                    skuCount('prodSSku');
                    let dataA = table.cache.FBAdistribute_table_createGoodsTable
                    let statisticInfo = calTotalWeightAndThrowWeight(dataA)
                    $("#FBAdistribute_table_createGoodsTable").next().find('.layui-table-total td[data-field=storeAcct] div').text('总实重: ' + statisticInfo.totalWeight + ';总抛重:' + statisticInfo.totalThrowWeight)
                }
                if (layEvent === 'FBA_distribute_submitremovegoods') { //提交货件移除商品
                    obj.del();
                }
                if (layEvent === 'FBA_distribute_submitproductDetail') { //提交货件商品详情
               
                    layer.open({
                        type: 1,
                        title: '货品详情',
                        btn: ['关闭'],
                        area: ['65%', '70%'],
                        content: $('#pop_FBA_distribute_productDetail').html(),
                        id: 'FBA_distribute_productDetailLayer',
                        success: function(layero, index) {
                            showProdDetaiLTable(data.detail, true)
                            let logTableData;
                            $('#Fbadistribute_opLogPage').click(function() {
                                if (logTableData) {
                                    FBAdelivery_showLogTable(logTableData)      
                                } else {
                                    let ajax = new Ajax(false);
                                    ajax.post({
                                        url: ctx + '/amazonFBA/inboundShipment/opLogList.html',
                                        data: JSON.stringify({ pShipId: data.id }),
                                        success: function(res) {
                                            if (res.code === '0000') {
                                                logTableData = res.data;
                                                FBAdelivery_showLogTable(logTableData)
                                            } else {
                                                layer.msg(res.msg)
                                            }
                                        }
                                    })
                                }
                            })

                            $('#pop_FBA_distribute_productDetail_queryBtn').click(function() {
                                let sellerSku = $('#pop_distribute_productDetail_querySellerSku').val();
                                if (!sellerSku.trim()) {
                                    layer.msg('请输入店铺sku');
                                    return
                                }
                                Adata = {
                                    storeAcctId: data.storeAcctId,
                                    salesSite: data.salesSite,
                                    sellerSku: sellerSku
                                };
                                let ajax = new Ajax(false);
                                ajax.post({
                                    url: ctx + '/amazonFBA/getShipSkuDetailBySellerSku.html',
                                    data: JSON.stringify(Adata),
                                    success: function(res) {
                                        FBAdelivery_showInventoryDetail(res.data)
                                    }
                                })
                            })
                            $('#pop_FBA_distribute_productDetail_copyFnSku').click(function (){
                                let dataList = table.cache.FBAdistribute_ProdDetailTable
                                let fnSkuList = []
                                for (let i = 0;i < dataList.length; ++i) {
                                    fnSkuList.push(dataList[i].fnSku)
                                }
                                copyTxtToClipboard(fnSkuList.join(","));
                            })
                        },
                        yes: function(index, layero) {
                            layer.close(index)
                        }
                    })
                }
            })
        }

        function FBAdelivery_showInventoryDetail(tableData) {
            let popIndex = layer.open({
                type: 1,
                title: '新增货品',
                btn: ['新增', '关闭'],
                area: ['65%', '60%'],
                content: $('#pop_FBA_distribute_shipRelSkuDetailQuery').html(),
                success: function(index, layero) {
                    table.render({
                        elem: '#FBA_distribute_shipRelSkuDetailQueryTable',
                        data: tableData,
                        cols: [
                            [
                                { type: 'checkbox' },
                                { title: "图片", templet: '#FBA_distribute_shipRelSkuDetailQueryTable_img', width: 70 },
                                { title: "ASIN", field: "asin" },
                                { title: "FNSKU", field: "fnSku" },
                                { title: "店铺SKU", field: "sellerSku" },
                                { title: "商品SKU", field: "prodSSku" },
                                { title: "商品名称", templet: "<div>{{d.prodSInfo.title}}</div>" },
                                { title: "物流属性", templet: "<div>{{d.prodSInfo.logisAttrList}}</div>" },
                                { title: "开发专员", field: "bizzOwner" },
                                { title: "包装备注", field: "packDesc", templet: '#FBAdistribute_ProdDetailTable_packDesc' },
                            ]
                        ],
                        page: false,
                        limit: 500,
                        id: 'FBA_distribute_shipRelSkuDetailQueryTable'
                    })
                },
                yes: function() {
                    // 校验是否选择
                    var data = table.checkStatus('FBA_distribute_shipRelSkuDetailQueryTable').data;
                    if (!data || data.length === 0) {
                        layer.msg('请选择要增加的货品');
                        return false;
                    }
                    // 校验是否有重复的sellerSku
                    let tabInfo = table.cache.FBAdistribute_ProdDetailTable;
                    let addArr = [];
                    for (let i = 0; i < data.length; ++i) {
                        for (let j = 0; j < tabInfo.length; ++j) {
                            if (data[i].sellerSku === tabInfo[j].sellerSku) {
                                layer.msg('存在重复的店铺sku= ' + data[i].sellerSku);
                                return false
                            }
                        }
                        let one = data[i];
                        one.id = null;
                        one.planQuality = 0;
                        one.picUrl = data[i].image;
                        one.title = data[i].prodSInfo.title;
                        one.logisAttrList = data[i].prodSInfo.logisAttrList;
                        addArr.push(one)
                    }
                    // 加入到货品列表
                    table.cache.FBAdistribute_ProdDetailTable = table.cache.FBAdistribute_ProdDetailTable.concat(addArr);
                        // 重新渲染货品列表
                    showProdDetaiLTable(table.cache.FBAdistribute_ProdDetailTable);
                        // 关闭弹窗
                    layer.close(popIndex)
                },
                end: function() {
                    layer.close(popIndex)
                }
            })
        }

        function FBAdelivery_showLogTable(data) {
            table.render({
                elem: '#FBAdistribute_shipLogTable',
                data: data,
                page: false,
                limit: data.length,
                id: "FBAdistribute_shipLogTable",
                cols: [
                    [
                        { title: '时间', templet: '<div>{{format(d.opTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 200 },
                        { title: '操作人', field: 'opUserName', width: 150 },
                        { title: '操作类型', field: 'opType', width: 150 },
                        { title: '操作详情', templet: '<div>{{d.sellerSku? (d.sellerSku + " * " + d.shipRelSkuNum) : ""}}</div>' }
                    ]
                ]
            })
        }

        /**
         * 渲染货件商品详情
         * @param tableData 商品数据列表
         * @param nowAllowDel 不允许删除   true则不展示删除按钮
         */
        function showProdDetaiLTable(tableData, notAllowDel) {
            table.render({
                elem: '#FBAdistribute_ProdDetailTable',
                data: tableData,
                cols: [
                    [
                        { title: "图片", templet: '#FBAdistribute_ProdDetailTable_img', width: 70 },
                        { title: "商品信息", field: "asin",templet: '#FBAdistribute_productInfo', width: 170 },
                        { title: "OA商品信息", field: "asin", templet: '#FBAdistribute_productInfo_OA', width: 180 },
                        { title: "商品名称", field: "title",width: 400 },
                        { title: '<div title="发货需求的计划发货数量">总计划发货数量<i class="layui-icon layui-icon-about"></i></div>', field: "totalRequireQty",width: 80 },
                        { title: "本货件数量", field: "originPlanQuality",templet:"#FBAdistribute_Detail_numTemp",width: 100 },
                        { title: "计划数量(点击可编辑)", field: "planQuality", edit: 'text', style: "background-color: #7FFFD4;",width: 80 },
                        { title: "实发数量", field: "actQuality", templet: '<div>{{d.actQuality || ""}}</div>',width: 80 },
                        { title: "FBA收货数量", field: "quantityReceived",width: 80 },
                        { title: '操作', align: 'center', toolbar: notAllowDel || '#FBAdistribute_ProdDetailTableBar', width: 200 }
                    ]
                ],
                page: false,
                limit: 500,
                id: 'FBAdistribute_ProdDetailTable'
            })
        }

        function FBAdistribute_toCheckStatus(idList) {
            layer.confirm('确定转至待审核状态？', function(index) {
                let ajax = new Ajax();
                ajax.post({
                    url: '/FbaDistributePlan/cancelAudit',
                    data: idList,
                    success: function(res) {
                        if (res.code === '0000') {
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable()
                        }
                    }
                });
                layer.close(index);
            })
        }

        function FBAdistribute_toWaitSend(idList) {
            layer.confirm('确定转至待派单状态？', function(index) {
                let ajax = new Ajax();
                ajax.post({
                    url: '/FbaDistributePlan/cancelDistribute',
                    data: idList,
                    success: function(res) {
                        if (res.code === '0000') {
                            layer.alert(res.msg)
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable()
                        }
                    }
                });
                layer.close(index);
            })
        }

        // sku length
        function skuCount(datafield) {
            let length = $("#FBAdistribute_table_createGoodsTable").next().find('tbody').children().length - 1
            $("#FBAdistribute_table_createGoodsTable").next().find('.layui-table-total td[data-field="' + datafield + '"] div').text('总SKU计数:' + length)
        }

        function FBAdelivery_auditPlanBatch(idList) {
            layer.confirm('确定审核通过？', function(index) {
                let ajax = new Ajax();
                ajax.post({
                    url: '/FbaDistributePlan/audit',
                    data: idList,
                    success: function(res) {
                        if (res.code === '0000') {
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                        }
                    }
                });
                layer.close(index);
            })
        }

        function deleteDeliveryPlan (idList) {
            layer.confirm('确定取消?', function(index) {
                let ajax = new Ajax();
                ajax.post({
                    url: '/FbaDistributePlan/cancel',
                    data: idList,
                    success: function(res) {
                        if (res.code === '0000') {
                            layer.msg(res.msg || '取消成功')
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                        }
                    }
                });
                layer.close(index);
            })
        }
        //填充下拉框
        function appendSelectForSaleLogisticType(dom, data, id, name, trackingNoPrefix,defaultShowText) {
            $(dom).empty();
            var option = '<option value="">'+ (defaultShowText || '站点') + '</option>';
            for (var i in data) {
                data[i].id = data[i].id || data[i][id];
                data[i].name = data[i].saleLogisticsTypeName || data[i][saleLogisticsTypeName];
                option += '<option value="' + data[i].id + '" data-trackingNoPrefix="' + data[i].trackingNoPrefix + '">' + data[i].saleLogisticsTypeName + '</option>'
            }
            $(dom).append(option);
        }
        //填充下拉框
        function appendSelect(dom, data, id, name, trackingNoPrefix,defaultShowText) {
            $(dom).empty();
            var option = '<option value="">'+ (defaultShowText || '站点') + '</option>';
            for (var i in data) {
                data[i].id = data[i].id || data[i][id];
                data[i].name = data[i].name || data[i][name];
                option += '<option value="' + data[i].id + '" data-trackingNoPrefix="' + data[i].trackingNoPrefix + '">' + data[i].name + '</option>'
            }
            $(dom).append(option);
        }
        //填充下拉框指定组合方式
        function appendSelectByFun(dom, data, idFun, nameFun) {
            $(dom).empty();
            var option = '<option value="">请选择</option>';
            for (var i in data) {
                data[i].id = idFun(data[i]);
                data[i].name = nameFun(data[i]);
                option += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
            }
            $(dom).append(option);
        }

        function getmultiOption(tag, option, data) {
            for (var i in data) {
                var previx = "";
                if (data[i].children && data[i].children.length > 0) {
                    previx += '|--';
                    getmultiOption(tag, option, data[i].children)
                } else {
                    data[i].id = data[i].id || data[i][id];
                    data[i].name = data[i].name || data[i][name];
                    option += '<option value="' + data[i].id + '">' + previx + data[i].name + '</option>'
                }
            }
        }

        function initAjax(url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
            if (!isLoad) {
                loading.show()
            }
            $.ajax({
                type: method,
                url: ctx + url,
                dataType: 'json',
                async: true,
                data: data,
                contentType: contentType || 'application/json',
                beforeSend: function(returnData) {
                    if (func2) {
                        func2(returnData)
                    }
                },
                success: function(returnData) {
                    loading.hide();
                    if (returnData.code == "0000") {
                        func(returnData)
                    } else {
                        layer.alert(returnData.msg, { icon: 2 });
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
                complete: function(returnData) {
                    loading.hide();
                    if (func3) {
                        func3(returnData)
                    }
                }
            })
        }

        function initAjaxSync(url, method, data, func, contentType, isLoad) { //初始化ajax请求
            if (!isLoad) {
                loading.show()
            }
            $.ajax({
                type: method,
                url: ctx + url,
                dataType: 'json',
                async: false,
                data: data,
                contentType: contentType || 'application/json',
                success: function(returnData) {
                    loading.hide();
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
                complete: function(returnData) {
                    loading.hide()
                }
            })
        }

        //填充下拉框,特别为店铺绑定站点使用
        function appendSelectForStoreSite(pre, dom, data, id, name, salesSite) {
            $('#' + pre + ' #' + dom + '').empty();
            var option = '<option value="">请选择</option>';
            for (var i in data) {
                data[i].id = data[i].id || data[i][id];
                data[i].name = data[i].name || data[i][name];
                data[i].salesSite = data[i].salesSite || data[i][salesSite];
                option += '<option data-sites="' + data[i].salesSite + '" value="' + data[i].id + '">' + data[i].name + '</option>'
            }
            $('#' + pre + ' #' + dom + '').append(option)
        }

        if (fbaDeliveryCache) {
            // 找到元素触发点击事件
            var find = $('#FBAdistrubute_label').find('[data-index=FBAdelivery_table_apiInfo]');
            if (find) {
                find.click();
            }
        }

        // 初始化
        //赋值
        getInitFBAAmazonSite(true);

        FBAdelivery_showPackDesc = function(self, index) {
            var oldId = self.getAttribute('data-tipId');
            if (oldId) {
                layer.close(oldId)
            }
            var tipsIndex = layer.open({
                type: 4,
                shade: 0,
                area: ['60%', '500px'],
                tips: [4, 'rgba(5,5,5,0.4)'],
                isOutAnim: false,
                content: [$('#FBAdistribute_updatePackDesc_pop').html(), self], //数组第二项即吸附元素选择器或者DOM
                // id: 'FBAhistory_updatePackDescLayer',
                success: function() {
                    let tabInfo = table.cache.FBAdistribute_ProdDetailTable;
                    wangEditorRender('FBAdistribute_packDescEdit', tabInfo[index].packDesc);
                }
            });
            self.setAttribute('data-tipId', tipsIndex)
        };
    });
    // layui结束

function getmixStyle(color, size, style) {
    var arr = [color, size, style].filter(function(item) {
        return typeof(item) !== 'undefined'
    });
    return arr.join('-')
}

//下拉框赋值选中
function FBAdeliveryselected(select, value) { //select的name值
    var $options = $('#' + select).find('option');
    $options.each(function(index, item) {
        if ($(item).text() === value) {
            $(this).attr('selected', true);
        }
    });
    layui.form.render();
}