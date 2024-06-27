var packInfoTableIns = {};
var FBAdelivery_showPackDesc
var fbaDeliveryCache,currentScrollPosition
var shipmentStatusEnums,FBAdelivery_calThrowWeight
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
            elem: '#FBAdelivery_Form_time',
            type: 'date',
            range: true
        });
    
    //ztt20240521-初始化仓储类型多选
    commonRenderWarehouseTypeRender('FBAdelivery_storageTypeList')

    //物流公司枚举接口+渲染
    FBAdelivery_FBAfirstCompany()
    function FBAdelivery_FBAfirstCompany(){
        commonReturnPromise({
            url: '/lms/company/specialType?specialType=FBA头程'
        }).then(res => {
            commonRenderSelect("FBAdelivery_companyNameList", res, {name: 'cnName', code: 'id'}).then(() => {
                formSelects.render("FBAdelivery_companyNameList");
            });
            formSelects.on(
                "FBAdelivery_companyNameList",
                function (id, vals, val, isAdd, isDisabled) {
                    var idsArr = vals.map(function (item) {
                        return item.value;
                    });
                    FBAdelivery_FBAfirstLogisType(idsArr.join(',')).then(res => {
                        commonRenderSelect("FBAdelivery_logisticsTypeIdList", res, {name: 'name', code: 'id'}).then(() => {
                            formSelects.render("FBAdelivery_logisticsTypeIdList");
                        });
                    });
                },
                true
            );
        });
    }

    //物流方式枚举接口+渲染
    function FBAdelivery_FBAfirstLogisType(logisticsCompanyIdList){
        return commonReturnPromise({
            url: '/lms/type/list/specialType',
            type: 'post',
            params: {
                page: 1,
                limit: 999,
                specialType: 'FBA头程',
                logisticsCompanyIdList: logisticsCompanyIdList
            }
        });
    }

    // 初始化标签选择
    initBizzTag('#FBAdelivery_planLabel','FBA_SHIP_PLAN_LABEL',true, true, null,formSelects,[{name: '无标签',value: '空'}],'标签')

        function initShipmentStatus() {
            if (shipmentStatusEnums) {
                renderShipmentStatus()
            } else {
                oneAjax.post({
                    url: '/amazonFBA/getShipmentStatusEnums',
                    success: function (res) {
                        if (res.code === '0000') {
                            shipmentStatusEnums = res.data
                            renderShipmentStatus()
                        }
                    }
                })
            }
        }
        function renderShipmentStatus() {
            let options = []
            for (let i = 0; i < shipmentStatusEnums.length; ++i) {
                let option = `<option value="`+ shipmentStatusEnums[i] +`">`+ shipmentStatusEnums[i] +`</option>`
                options.push(option)
            }
            $('#FBAdeliveryForm [name=shipmentStatus]').append(options)
            form.render('select','FBAdeliveryForm')
        }
    initShipmentStatus()
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
        render_hp_orgs_users("#FBAdeliveryForm"); //渲染部门销售员店铺三级联动

        //初始化物流方式选项
        initAjax('/amazonFBA/inboundShipment/getFbaLogistics.html', 'POST', null, function(returnData) { //addressType:1 FBA地址
            appendSelect($('#FBAdeliveryForm select[name=logisticsTypeId]'), returnData.data, 'id', 'name');
            form.render('select');
        });

        //页面局部变量声明,防止冲突
        // getFBAAmazonSite();
        var FBAdelivery_global_siteEnum;

        var cartonIdList; //用于创建DHL表单提交记录当前选择的id列表
        var createDHL_deal_freightNum; //用于创建DHL表单提交记录当前选择的运单号
        var createDHL_deal_fnCenterId; //用于创建DHL表单提交记录当前选择的目标地址
        var createDHL_deal_edit_index; //用于创建DHL表单提交页面,用于关闭

        var tabObj = {
            'FBAdelivery_table_deliveryPlan': '100',
            'FBAdelivery_table_FBACreate': '0',
            'FBAdelivery_table_toPack': '1',
            'FBAdelivery_table_toDelivery': '2',
            'FBAdelivery_table_delivered': '3',
            'FBAdelivery_table_error': '4',
            'FBAdelivery_table_apiInfo': '5',
            'FBAdelivery_table_deleteInfo': '-4',
            'FBAdelivery_table_matchInfo': '9'
        }


        var tablecol = {
            'FBAdelivery_table_deliveryPlan': [
                [ //发货需求
                    { checkbox: true, width: 30 },
                    { title: "图片", field: "picUrl", templet: "#FBAdelivery_imageTpl", width: 90 },
                    { title: "店铺-站点", field: "salesSite", templet: '#FBAdelivery_store_site', width: 110 },
                    { title: "商品SKU", field: "prodSSku", templet: '#FBAdelivery_deliveryPlan_ProdSkuTpl', width: 140 },
                    { title: "店铺商品信息", field: "asin", templet: '#FBAdelivery_productInfo', width: 180 },
                    { title: "总重量(kg)", field: "oaWeight", totalRow: true, templet: '#FBAdelivery_plan_weight_tpl', width: 100 },
                    { title: "商品总成本(￥)", field: "oaCost", totalRow: true, templet: '#FBAdelivery_plan_cost_tpl' },
                    { title: "FBA在途数量", field: "fbaTransQuality", sort: true },
                    { title: "FBA库存数量", field: "fbaInventoryQuality", sort: true },
                    { title: "FBA货件中数量", field: "fbaShipmentQuality", sort: true },
                    { title: "海外仓可用库存", field: "availableQuality", totalRow: true, sort: true },
                    { title: "义乌仓可用库存", field: "defaultStoreAvailableStock", sort: true },
                    { title: "义乌仓在途库存", field: "defaultStoreOnwayStock" },
                    { title: '计划发货数量', field: "planQuality", sort: true },
                    { title: '已建货件数量', field: "actQty" },
                    { title: '待采购数量', field: "waitPurNum",templet:function(d){if(d.statisticInfo && d.statisticInfo.waitPurNum){return d.statisticInfo.waitPurNum}else{return ''}} },
                    { title: '待建货件数量', field: "waitCreateNum",templet:function(d){if(d.statisticInfo && d.statisticInfo.waitCreateNum){return d.statisticInfo.waitCreateNum}else{return ''}} },
                    // { title: '最大发货量', field: "platMaxDeliverAmount", templet: '<div>{{d.fbaHisProd.platMaxDeliverAmount || ""}}</div>' },
                    { title: '利润率', field: "profitRate", templet: '<div>{{d.fbaHisProd.profitRate || ""}}</div>' },
                    { title: '退款率', field: "refundRate", templet: '<div>{{d.totalOrder ? (accMul(accDiv(d.refundOrder,d.totalOrder),100).toFixed(2) + "%") : ""}}</div>'},
                    { title: '汇总', field: "sameAsinSalesSiteData", templet: '#FBAdelivery_plan_sameAsinSalesSiteData', width: 100 },
                    { title: '销售备注(点击可编辑)', field: 'salerRemark', edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: '操作', toolbar: "#FBAdelivery_planoption_tpl", width: 100 }
                ]
            ],
            'FBAdelivery_table_FBACreate': [
                [ //FBA创建
                    { checkbox: true, width: 30 },
                    { title: "店铺-站点", field: "salesSite", templet: '#FBAdelivery_store_site' },
                    { title: "货件编码", field: "shipmentId" },
                    { title: "操作时间", field: "createTime", width: 150, templet: '#FBAdelivery_timeAll_tpl' },
                    { title: "商品种类", field: "skuMulNumber", totalRow: true },
                    { title: "商品数量", field: "totalUnits", totalRow: true },
                    { title: "总重量(kg)", field: "totalWeight", totalRow: true, templet: '#FBAdelivery_weight_tpl' },
                    { title: "总成本(￥)", field: "totalCost", templet:'#FBAdelivery_cost_tpl', totalRow: true },
                    { title: "销售计划物流", field: "", templet: '#FBAdelivery_suggest_logistics_type' },
                    { title: "货品属性", field: "", templet: '#FBAdelivery_logisticsAttrList',width: 120 },
                    { title: "目的地", field: "fnCenterId", templet: '#FBAdelivery_fnCenterInfo',sort: true },
                    // { title: '采购状态', field: "purStatus" ,templet:"#FBAdelivery_purStatus"},
                    { title: "API货件状态", field: "shipmentStatus", templet: "#FBAdelivery_warningInfo" },
                    { title: "销售备注(点击可修改)", field: "salerRemark", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: '操作', toolbar: "#FBAdelivery_op_toPur_tpl", width: 100 }
                ]
            ],
            'FBAdelivery_table_toPack': [
                [ //待装箱
                    { checkbox: true, width: 30 },
                    { title: "店铺-站点", field: "salesSite", templet: '#FBAdelivery_store_site' },
                    { title: "货件编码", field: "shipmentId", templet: '#FBAdelivery_shipmentIdTemp' },
                    { title: "批次号", field: "batchNo"},
                    { title: "操作时间", field: "createTime", width: 150, templet: '#FBAdelivery_timeAll_tpl' },
                    { title: "商品", field: 'skuMulNumber', templet: '#FBAdelivery_itemInfo' },
                    { title: "总重量(kg)", field: "totalWeight", totalRow: true, templet: '#FBAdelivery_weight_tpl' },
                    { title: "总成本(￥)", field: "totalCost", templet:'#FBAdelivery_cost_tpl', totalRow: true },
                    { title: "销售计划物流", field: "", templet: '#FBAdelivery_suggest_logistics_type' },
                    { title: "目的地", field: "fnCenterId", templet: '#FBAdelivery_fnCenterInfo',sort: true },
                    { title: '异步操作记录', field: "opAsyncInfo" },
                    { title: "平台跟踪号(点击可修改)", field: "trackingNumber", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: "销售备注(点击可修改)", field: "salerRemark", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: '操作', toolbar: "#FBAdelivery_op_toPack_tpl", width: 100 }
                ]
            ],
            'FBAdelivery_table_toDelivery': [
                [ //待发货
                    { checkbox: true, width: 30 },
                    { title: "店铺-站点", field: "salesSite", templet: '#FBAdelivery_store_site' },
                    { title: "货件编码", field: "shipmentId", templet: '#FBAdelivery_shipmentTemp' },
                    { title: "批次号", field: "batchNo"},
                    { title: "操作时间", field: "createTime", width: 150, templet: '#FBAdelivery_timeAll_tpl' },
                    { title: "箱子数量", field: "totalCarton", style: 'background-color: #0099FF;', event: 'FBA_pack_detail', totalRow: true },
                    { title: "商品", field: 'skuMulNumber', templet: '#FBAdelivery_itemInfo' },
                    { title: "总重量(kg)", field: "totalWeight", totalRow: true, templet: '#FBAdelivery_weight_tpl' },
                    { title: "总成本(￥)", field: "totalCost", templet:'#FBAdelivery_cost_tpl', totalRow: true },
                    { title: "销售计划物流", field: "", templet: '#FBAdelivery_suggest_logistics_type' },
                    { title: "目的地", field: "fnCenterId", templet: '#FBAdelivery_fnCenterInfo',sort: true },
                    { title: "运单列表", field: "showFreightNum",templet: '#FBAdelivery_showFreightNum'},
                    { title: '异步操作记录', templet: '#FBAdelivery_opAsyncInfo' },
                    { title: "平台跟踪号(点击可修改)", field: "trackingNumber", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: "销售备注(点击可修改)", field: "salerRemark", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: '操作', toolbar: "#FBAdelivery_op_toDelivery_tpl", width: 100 }
                ]
            ],
            'FBAdelivery_table_deleteInfo': [
                [ //已删除
                    { checkbox: true, width: 30 },
                    { title: "店铺-站点", field: "salesSite", templet: '#FBAdelivery_store_site' },
                    { title: "货件编码", field: "shipmentId", templet: '#FBAdelivery_shipmentTemp' },
                    { title: "批次号", field: "batchNo"},
                    { title: "操作时间", field: "createTime", width: 150, templet: '#FBAdelivery_timeAll_tpl' },
                    { title: "箱子数量", field: "totalCarton", style: 'background-color: #0099FF;', event: 'FBA_pack_detail', totalRow: true },
                    { title: "商品", field: 'skuMulNumber', templet: '#FBAdelivery_itemInfo' },
                    { title: "总重量(kg)", field: "totalWeight", totalRow: true, templet: '#FBAdelivery_weight_tpl' },
                    { title: "总成本(￥)", field: "totalCost", templet:'#FBAdelivery_cost_tpl', totalRow: true },
                    { title: "销售计划物流", field: "", templet: '#FBAdelivery_suggest_logistics_type' },
                    { title: "目的地", field: "fnCenterId", templet: '#FBAdelivery_fnCenterInfo',sort: true },
                    { title: "运单列表", field: "showFreightNum",templet: '#FBAdelivery_showFreightNum'},
                    { title: '异步操作记录', templet: '#FBAdelivery_opAsyncInfo' },
                    { title: "平台跟踪号(点击可修改)", field: "trackingNumber", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: "销售备注(点击可修改)", field: "salerRemark", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: '操作', toolbar: "#FBAdelivery_op_delete_tpl", width: 100 }
                ]
            ],
            'FBAdelivery_table_delivered': [
                [ //已发货
                    { checkbox: true, width: 30 },
                    { title: "店铺-站点", field: "salesSite", templet: '#FBAdelivery_store_site' },
                    { title: "货件编码", field: "shipmentId", templet: '#FBAdelivery_shipmentTemp' },
                    { title: "操作时间", field: "createTime", width: 150, templet: '#FBAdelivery_timeAll_tpl' },
                    { title: "箱子数量", field: "totalCarton", style: 'background-color: #0099FF;', event: 'FBA_pack_detail', totalRow: true },
                    { title: "商品", field: 'skuMulNumber', templet: '#FBAdelivery_itemInfo' },
                    { title: "总重量(kg)", field: "totalWeight", totalRow: true, templet: '#FBAdelivery_weight_tpl' },
                    { title: "总成本(￥)", field: "totalCost", templet:'#FBAdelivery_cost_tpl', totalRow: true },
                    { title: "销售计划物流", field: "", templet: '#FBAdelivery_suggest_logistics_type' },
                    { title: "目的地", field: "fnCenterId", templet: '#FBAdelivery_fnCenterInfo',sort: true },
                    { title: "运单列表", field: "showFreightNum",templet: '#FBAdelivery_showFreightNum' },
                    { title: "平台跟踪号(点击可修改)", field: "trackingNumber", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: "销售备注(点击可修改)", field: "salerRemark", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: '操作', toolbar: "#FBAdelivery_op_delivered_tpl", width: 100 }
                ]
            ],
            'FBAdelivery_table_error': [
                [ //已完成
                    { title: "店铺-站点", field: "salesSite", templet: '#FBAdelivery_store_site' },
                    { title: "货件编码", field: "shipmentId" },
                    { title: "操作时间", field: "createTime", templet: '#FBAdelivery_timeAll_tpl' },
                    { title: "箱子数量", field: "totalCarton", style: 'background-color: #0099FF;', event: 'FBA_pack_detail', totalRow: true },
                    { title: "商品种类", field: "skuMulNumber", totalRow: true },
                    { title: "商品数量", field: "totalUnits", totalRow: true },
                    { title: "发货数量", field: "shippedNum", totalRow: true }, //todo 无法得知
                    { title: "收货数量", field: "acceptNum", totalRow: true }, //todo 无法得知
                    { title: "总重量(kg)", field: "totalWeight", totalRow: true, templet: '#FBAdelivery_weight_tpl' },
                    { title: "总成本(￥)", field: "totalCost", templet:'#FBAdelivery_cost_tpl', totalRow: true },
                    { title: "目的地", field: "fnCenterId", templet: '#FBAdelivery_fnCenterInfo',sort: true },
                    { title: "运单列表", field: "showFreightNum" },
                    { title: '采购状态', field: "purStatus", templet: "#FBAdelivery_purStatus" },
                    { title: '是否API提交装箱', field: "packagedStatus", templet: "#FBAdelivery_packagedStatus_tpl" },
                    { title: '取箱状态', field: "whBoxPurStatus", templet: "#FBAdelivery_whBoxPurStatus_tpl" },
                    { title: 'API货件状态', field: "shipmentStatus", templet: "#FBAdelivery_warningInfo" },
                    { title: '当前OA处理状态', field: "oaShipStatus", templet: "#FBAdelivery_oa_deal_statusTpl" },
                    { title: "销售备注(点击可修改)", field: "salerRemark", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: '操作', toolbar: "#FBAdelivery_op_err_tpl", width: 100 }
                ]
            ],
            'FBAdelivery_table_apiInfo': [
                [ //已完成
                    { title: "店铺-站点", field: "storeAcct", templet: '#FBAdelivery_store_site' },
                    { title: "货件编码", field: "shipmentId" },
                    { title: "操作时间", field: "createTime", width: 150, templet: '#FBAdelivery_timeAll_tpl' },
                    { title: "箱子数量", field: "totalCarton", totalRow: true },
                    { title: "商品种类", field: "skuMulNumber", totalRow: true },
                    { title: "商品数量", field: "totalUnits", totalRow: true },
                    { title: "发货数量", field: "shippedNum", totalRow: true }, //todo 无法得知
                    { title: "收货数量", field: "acceptNum", totalRow: true }, //todo 无法得知
                    { title: "总重量(kg)", field: "totalWeight", totalRow: true, templet: '#FBAdelivery_weight_tpl' },
                    { title: "总成本(￥)", field: "totalCost", templet:'#FBAdelivery_cost_tpl', totalRow: true },
                    { title: "目的地", field: "fnCenterId", templet: '#FBAdelivery_fnCenterInfo',sort: true },
                    { title: '货件状态', field: "shipmentStatus", templet: "#FBAdelivery_mix_statusTpl" },
                    { title: "销售备注(点击可修改)", field: "salerRemark", edit: 'text', style: 'background-color: #7FFFD4;' },
                    { title: '操作', toolbar: "#FBAdelivery_op_notOp_tpl", width: 100 }
                ]
            ],
            'FBAdelivery_table_matchInfo': [
                [ //已完成
                    { title: "图片", width: 70, templet: '#FBAdelivery_matchInfo_image' },
                    { title: "店铺-站点", field: "storeAcct", width: 120, templet: '#FBAdelivery_store_site' },
                    { title: "货件编码", field: "shipmentId", width: 125, },
                    { title: "商品sku", templet: '#FBAdelivery_matchInfo_prodInfo', width: 150 },
                    { title: "货品", templet: '#FBAdelivery_matchInfo_FbaGoodsInfo', width: 150 },
                    { title: "组合品", templet: '#FBAdelivery_matchInfo_belongsComb', width: 50 },
                    { title: "操作时间", templet: '#FBAdelivery_matchInfo_opTime', width: 200 },
                    { title: "操作人员", templet: '#FBAdelivery_matchInfo_operator', width: 150 },
                    { title: '货件状态', field: "shipmentStatus", templet: "#FBAdelivery_matchInfo_shipStatus" },
                    { title: '操作', toolbar: "#FBAdelivery_matchInfo_bar" }
                ]
            ],
            'FBAdelivery_table_packInfoTable': [
                [ //装箱弹框商品信息表格
                    { title: "图片", field: "picUrl", templet: "#FBAdelivery_imageTpl", width: 90 },
                    { title: "商品信息", field: "storeAcct", templet: '#FBAdelivery_productInfo_pack', width: 180, totalRowText: '总数量' },
                    { title: "待装箱数量", field: "planQuality", width: 80, templet: "#FBAdelivery_toPack_amtTemplet" },
                    { title: "箱子", field: "boxNumber", templet: '#FBAbox_proNum', width: 80 },
                    { title: "总数量", field: "totalAmount", width: 90 },
                ]
            ],
            'FBAdelivery_table_boxInfoTable': [ //只作为基础模板,实际每次使用会把箱子及后面的信息给替换掉
                [ //装箱弹框箱子信息表格
                    { title: "", field: "picUrl", width: 280, templet: '#FBAdelivery_boxSizeTpl' },
                    { title: "箱子规格", field: "storeAcct", width: 70, templet: '#FBAdelivery_boxSizeDescTpl' },
                    { title: "箱子", field: "siteName" },
                    { title: "", field: "", width: 90 },
                ]
            ],
            'FBAdelivery_table_printProductTable': [
                [ //打印货品标签
                    { checkbox: true, width: 30 },
                    { title: "图片", field: "picUrl", templet: '#FBAdelivery_imageTpl' },
                    { title: "商品SKU", field: "prodSSku", width: 180 },
                    { title: "商品信息", field: "fnsku", templet: '#FBAdelivery_productInfo' },
                    { title: "打印内容", field: "mixStyle", templet: '#FBAprint_Label' },
                    { title: "打印数量", field: "printNumber", templet: '#FBAbox_proNum_init' },
                ]
            ],
            'FBAdelivery_table_createGoodsTable': [
                [ //生成货件
                    { title: "图片", field: "picUrl", templet: '#FBAdelivery_imageTpl' },
                    { title: "商品SKU", field: "prodSSku", width: 180, totalRowText: '',templet: '#FBAdelivery_prodSSkuTemp' },
                    { title: "商品信息", field: "storeAcct", templet: '#FBAdelivery_productInfo' },
                    { title: "可用数量", field: "availableQuality", totalRowText: '', width: 100},
                    { title: "剩余总计划数", field: "remainPlanQuality", width: 100,templet: '<div>{{d.planQuality - d.actQty}}</div>'},
                    { title: "本次计划发货数量", field: "planQuality", templet: '#FBAcreate_proNum', totalRowText: ''},
                    { title: "标签准备方", field: "", templet: '<div>卖家</div>' },
                    { title: "操作", toolbar: "#FBAdelivery_creatGoods" },
                ]
            ],
            'FBAdelivery_table_submitGoodsTable': [
                [ //提交货件
                    { checkbox: true, width: 30 },
                    { title: "货件编号", field: "shipmentId",templet: '#FBAdelivery_shipmentIdTemplet' },
                    { title: "商品种类", field: "skuMulNumber" },
                    { title: "商品数量", field: "totalUnits" },
                    { title: "计费重量(kg)", field: "priceWeight" },
                    { title: "预估运费(￥)", field: "headLogisticsPrice" },
                    { title: "标签", field: "labelStr" },
                    { title: "标签准备方", field: "", templet: '<div>卖家</div>' },
                    { title: "配送地址", field: "fnCenterId", templet: '#FBAdelivery_fnCenterInfo' },
                    { title: "操作", toolbar: "#FBAdelivery_submitGoods" },
                ]
            ],
            'FBAdelivery_table_recommPackTable': [
                [ //推荐装货
                    { title: "目的地", field: "fnCenterId", merge: 'fnCenterId' },
                    { title: "合单序号", field: "freightNum", merge: 'freightNum', toolbar: "#FBAdelivery_recommPackTable_op" },
                    { title: "合单称重", field: "totalWeight", merge: 'freightNum' },
                    { title: "货件编码", field: "shipmentId" },
                    { title: "箱号", field: "indexNum", },
                    { title: "称重", field: "cartonWeight" },
                ]
            ],
            'FBAdelivery_table_freightTable': [
                [ //待发货
                    { checkbox: true, width: 30 },
                    { title: "货件编号", field: "shipmentId", width: 200 },
                    { title: "箱号", field: "indexNum", width: 200 },
                    { title: "称重(kg)", field: "cartonWeight", width: 200 },
                    {
                        title: "实际发货物流<div class='layui-btn layui-btn-xs' id='FBAdelivery_setLogisticsTypeForListBtn'>重新物流</div>" +
                            "<div class='layui-btn layui-btn-xs' id='FBAdelivery_ApplyWaybillNumberBtn'>申请运单号</div>",
                        field: "logisticsTypeName",
                        toolbar: "#FBAdelivery_changeLogistic_op"
                    },
                    { title: "运单号(双击编辑)<div><input class='layui-input'style='width: 200px' id='FBAdelivery_setLogisticsNoForListValue'><div id='FBAdelivery_setLogisticsNoForListBtn' class='layui-btn layui-btn-xs'>批量修改</div></div>", field: "freightNum", edit: 'String', style: "background-color: #5FB878; color: #fff;" }, //可编辑,,
                    { title: "转运号(双击编辑)<div><input class='layui-input'style='width: 200px' id='FBAdelivery_setTransferNumForListValue'><div id='FBAdelivery_setTransferNumForListBtn' class='layui-btn layui-btn-xs'>批量修改</div></div>", field: "transferNum", edit: 'String', style: "background-color: #5FB878; color: #fff;" }, //可编辑,,
                ]
            ],
            'FBAdelivery_table_shipForRecommTable': [
                [ //货件
                    { checkbox: true, width: 30 },
                    { title: "店铺-站点", field: "salesSite", templet: '#FBAdelivery_store_site' },
                    { title: "货件编码", field: "shipmentId" },
                    { title: "创建时间", field: "createTime", templet: '#FBAdelivery_createTime' },
                    { title: "修改时间", field: "modifyTime", templet: '#FBAdelivery_modifyTime' },
                    { title: "商品种类", field: "skuMulNumber" },
                    { title: "商品数量", field: "totalUnits" },
                    { title: "标签准备方", field: "", templet: '<div>卖家</div>' },
                    { title: 'API货件状态', field: "shipmentStatus" },
                    { title: '操作', toolbar: "#shipForRecommTable_op", width: 100 }
                ]
            ],

        }

        // 修改销售备注
        table.on('edit(FBAdelivery_table_deliveryPlan)', function(obj) {
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
        })

        table.on('edit(FBAdelivery_table_toPur)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_FBACreate)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_toPack)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_toDelivery)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_delivered)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_error)', function(obj) { FBAdelivery_editSalerRemark(obj) })
        table.on('edit(FBAdelivery_table_apiInfo)', function(obj) {
            obj.data.id = obj.data.oaShipId
            FBAdelivery_editSalerRemark(obj)
        })

        // 发货需求- 状态checkbox 单选
        form.on('checkbox(planStatusBox_FBAdelivery)', function(data) {
            var value = data.value
            var ifChecked = data.elem.checked
                // 单选且必选
            let otherStatusCheck = $('#planStatusBox_FBAdelivery').find('input:checked')
            otherStatusCheck.prop('checked', false)
            data.elem.checked = true
            form.render('checkbox', 'planStatusBoxDiv_FBAdelivery')

            let Adata = serializeObject($('#FBAdeliveryForm'))
            Adata.page = 1
            FBAdelivery_search(Adata)
        });

        // FBA创建货件- 采购状态checkbox 单选
        form.on('checkbox(FBAdelivery_purStatusBox)', function(data) {
            var value = data.value
            var ifChecked = data.elem.checked
                // 单选且必选
            let otherStatusCheck = $('#FBAdelivery_purStatusSearchBox').find('input:checked')
            otherStatusCheck.prop('checked', false)
            data.elem.checked = true
            form.render('checkbox', 'planStatusBoxDiv_FBAdelivery')

            let Adata = serializeObject($('#FBAdeliveryForm'))
            Adata.page = 1
            FBAdelivery_search(Adata)
        });

        // 待装修-配货状态checkbox 单选
        form.on('checkbox(matchStatusCheckBox_FBAdelivery)', function(data) {
            var value = data.value
            var ifChecked = data.elem.checked
                // 将其他选项置未  unchecked
            if (ifChecked) {
                let otherStatusCheck = $('#matchStatusCheckBox_FBAdelivery').find('input:checked')
                otherStatusCheck.prop('checked', false)
                data.elem.checked = true
                form.render('checkbox', 'matchStatusCheckBoxDiv_FBAdelivery')
            }
            let Adata = serializeObject($('#FBAdeliveryForm'))
            Adata.page = 1
            FBAdelivery_search(Adata)
        });

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
                url: ctx + "/amazonFBA/modifySalerRemark.html",
                data: JSON.stringify(Adata),
                contentType: 'application/json',
                success: function(data) {
                    if (data.code === '0000') {
                        layer.msg('修改成功')
                    }
                }
            })
        }

        element.on('tab(FBAdelivery_Tab)', function(data) {
            if(data.index ==0){
              $('#FBAdeliveryForm .storageTypeList').removeClass('disN');
            }else{
              $('#FBAdeliveryForm .storageTypeList').addClass('disN');
            }
            //参数清空
            $('#FBAdeliveryForm select[name=purStatus]').val("");
            $('#FBAdeliveryForm select[name=oaShipStatus]').val("");
            $('#FBAdeliveryForm select[name=checkShipStatus]').val("");
            $('#FBAdeliveryForm input[name=shipmentStatus]').val("");
            $('#FBAdelivery_Tab input[name=delivered][title="全部"]').prop("checked", "true");
            $('#FBAdelivery_Tab input[name=finished][title="全部"]').prop("checked", "true");
            form.render('radio');

            //专门为计划写一个
            var oldStrName = $('#FBAdeliveryForm select[name=skuType]').val();
            $('#FBAdeliveryForm select[name=skuType]').empty();

            var skuTypeTemp = `<option value="sellerSkuStr">店铺SKU</option>
                                                    <option value="asinStr">ASIN</option>
                                                    <option value="fnSkuStr">FNSKU</option>
                                                    <option value="prodSSkuStr">子商品SKU</option>`;
            if (fbaDeliveryCache) {
                skuTypeTemp += `<option value="shipmentIdStr" selected>货件编号</option>`
            } else {
                skuTypeTemp += `<option value="shipmentIdStr">货件编号</option>`
            }
            skuTypeTemp += `<option value="freightNumStr">运单号</option>
                                                    <option value="fnCenterIdStr">目的地</option>`;
            $('#FBAdeliveryForm select[name=skuType]').append(skuTypeTemp);
            if (!fbaDeliveryCache) {
                $('#FBAdeliveryForm select[name=skuType]').val(oldStrName); //还原原来选中的值
            } else {
                var parse = JSON.parse(fbaDeliveryCache);
                $('#FBAdeliveryForm input[name =sku]').val(parse.shipmentIdList);
                //重置
                fbaDeliveryCache = undefined;
            }

            var tablename = $(this).attr('data-index');
            $('#FBAdeliveryForm input[name="tablename"]').val(tablename);

            let Adata = serializeObject($('#FBAdeliveryForm'))
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
                appendSelect($('#FBAdeliveryForm select[name=salesSite]'), canSelSiteList, 'site', 'siteName');
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
                    appendSelectForStoreSite('FBAdeliveryForm', 'FBAdelivery_storeAcct', returnData.data, 'id', 'storeAcct', 'salesSite')
                        // formSelects.render('storeAcct')
                    form.render('select');
                }
            }, 'application/x-www-form-urlencoded');
        }

        //获取发货地址
        function getDeliveryAddress(func) {
            initAjax('/address/queryByAddressNamePost.html', 'POST', JSON.stringify({ addressType: 1 }), function(returnData) { //addressType:1 FBA地址
                appendSelect($('#FBAdelivery_layeracreateForm #deliveryAddress'), returnData.data, 'id', 'addressName')
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

        //删除发货计划
        function deleteDeliveryPlan(id, func) {
            initAjax('/amazonFBA/shipPlan/delete.html', 'POST', JSON.stringify({ id: id }), function(returnData) {
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

        //同步货件任务请求
        function asyncGoodsTask(data, func) {
            initAjax('/amazonFBA/inboundShipment/sync.html', 'POST', JSON.stringify(data), function(returnData) {
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
            var posturl;
            if (tablename === 'FBAdelivery_table_deliveryPlan') {
                posturl = '/amazonFBA/shipPlan/queryPage.html';
            } else {
                posturl = '/amazonFBA/inboundShipment/queryPage.html';
            }
            data.skuSalespersonIdList = data.skuSalespersonIdList ? data.skuSalespersonIdList.split(',') : []
            data.logisticsTypeIdList = data.logisticsTypeIdList ? data.logisticsTypeIdList.split(',') : null
            if (!data.logisticsTypeIdList && data.logisticsCompanyNameList) {
                data.logisticsTypeIdList = []
                let optionList = $('#FBAdelivery_companyNameList option')
                if (optionList && optionList.length) {
                    for (let i = 0; i < optionList.length; ++i) {
                        data.logisticsTypeIdList.push(optionList[i].getAttribute('value'))
                    }
                }
            }
            initAjax(posturl, 'POST', JSON.stringify(data), function(returnData) {
                // $('#FBAdelivery_Tab').find('.layui-this').find('span').text(returnData.count);
                // console.log(returnData)
                FBArenderpage(returnData.count, data.page, data.limit);
                FBAtablerender(returnData.data, tablename, data.limit)
                getEveryLabelCount(data)
                if (tablename === 'FBAdelivery_table_deliveryPlan') {
                    getAllPlanStatusLabelCount(data)
                }
                if (tablename === 'FBAdelivery_table_toPack') {
                    getAllMatchStatusLabelCount(data)
                }
                if (tablename === 'FBAdelivery_table_FBACreate') {
                    getAllPurStatusLableCount(data)
                }
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
                url: ctx + '/amazonFBA/countForEveryLabel.html',
                data: JSON.stringify(data),
                success: function(res) {
                    if (res.code === '0000') {
                        let labelUl = $('#FBAdelivery_label')
                        for (let key in res.data) {
                            let code = key.replace('num', '')
                            $('#FBAdelivery_label').find('[data-code=' + code + '] span').text(res.data[key])
                        }
                    }
                }
            })
        }
        //生成货件请求
        function createGoods(data, func) {
            initAjax('/amazonFBA/shipment/preCreate', 'POST', JSON.stringify(data), function(returnData) {
                if (func) {
                    func(returnData)
                }
            }, null, false)
        }

        //提交货件请求
        function submitGoods(data, func) {
            initAjax('/amazonFBA/inboundShipment/create.html', 'POST', JSON.stringify(data), function(returnData) {
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
        form.on('select(FBAdelivery_orgTree)', function(data) {
            var salePersonId = $('#FBAdelivery_userList').val()
            getFBAListStore({ roleNames: 'amazon专员', orgId: data.value, salePersonId: salePersonId, platCode: 'amazon' })
        });
        //监听销售员下拉选择
        form.on('select(FBAdelivery_userList)', function(data) {
            var orgId = $('#FBAdelivery_orgTree').val()
            getFBAListStore({ roleNames: 'amazon专员', orgId: orgId, salePersonId: data.value, platCode: 'amazon' })
        });

        //监听已完成tab状态单选筛选
        form.on('radio(FBAdelivery_tab_delivered)', function(data) {
                form.render('radio');
                $('#FBAdeliveryForm input[name="shipmentStatus"]').val(data.value)
            currentScrollPosition = $('.layui-show')[0].scrollTop
                refreshTable()
            })
            //监听已完成tab状态单选筛选
        form.on('radio(FBAdelivery_tabfinished)', function(data) {
            form.render('radio');
            $('#FBAdeliveryForm input[name="shipmentStatus"]').val(data.value)
            let Adata = serializeObject($('#FBAdeliveryForm'))
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
            appendSelect($('#FBAdeliveryForm select[name=salesSite]'), canSelSiteList, 'site', 'siteName');
            form.render('select');
        });


        // 表单提交
        form.on('submit(FBAdeliverySearch)', function(data) {
            FBAdelivery_search(data.field)
        });

        function FBAdelivery_search(data) {
            data[data.skuType] = data.sku
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
            if(data.tablename == 'FBAdelivery_table_deliveryPlan'){
              data.storageTypeList = data.storageTypeList ? data.storageTypeList.split(',') : [];
            }else{
              delete data.storageTypeList;
            }
            // 控制按钮的展示贺隐藏
            FbaDelivery_showOrHideBatchBtn(data)
            getTableList(data.tablename, data);
        }

        function FbaDelivery_showOrHideBatchBtn(data) {
            $('.FBAdelivery_batchBtn').hide()
            $('.selectable').hide()
            switch (data.statusNum) {
                case '100':
                    var oldStrName = $('#FBAdeliveryForm select[name=skuType]').val();
                    $('#FBAdeliveryForm select[name=skuType]').empty();
                    $('#FBAdeliveryForm select[name=skuType]').append(`<option value="sellerSkuStr">店铺SKU</option>
                                                    <option value="asinStr">ASIN</option>
                                                    <option value="fnSkuStr">FNSKU</option>
                                                    <option value="prodSSkuStr">子商品SKU</option>`);
                    $('#FBAdeliveryForm select[name=skuType]').val(oldStrName); //还原原来选中的值
                    $('#planStatusBox_FBAdelivery').show()
                    $('.planSearchField').show()
                    $('.shipSearchField').hide()
                    $('#FBAdelivery_markLabel').show()

                    switch (data.planStatus) {
                        case "0":
                            $('#FBAdelivery_batch_auditPlan').show()
                            break
                        case "1":
                            break
                        case "2":
                            $('#FBAdelivery_createGoods').show()
                            $('#FBAdelivery_markOverBatch').show()
                            $('#FBAdelivery_prevPurchase').show()
                            $('#FBAdelivery_prevPurchaseUn').show()
                            break
                    }
                    break;
                case '0':
                    $('#FBAdelivery_purStatusSearchBox').show()
                    $('#FBAdelivery_syncByShipmentIdList').show()
                    switch (data.purStatus) {
                        case '1':
                    }
                    break
                case '1': //待装箱
                    $('#FBAdelivery_syncByShipmentIdList').show()
                    $('#FBAdelivery_asyncGoods').show()
                    $('#FBAdelivery_fixExpirDate').show()
                    $('#FBAdelivery_removExpirDate').show()
                    $('#FBAdelivery_purStatus_div').show()
                    $('#FBAdelivery_oaShipStatus_div').show()
                    $('#FBAdelivery_exportByTemplate').show()
                    $('#FBAdelivery_updateLogisticsTypeBatch').show()
                    $('#matchStatusCheckBox_FBAdelivery').show()
                    $('#FBAdelivery_exportLackInfo').show()
                    $('#FBAdelivery_createBatch').show()
                    $('#FBAdelivery_cancelBatch').show()
                    $('.shipSearchField').show()

                    break;
                case '2': //待发货
                    $('#FBAdelivery_syncByShipmentIdList').show()
                    $('#FBAdelivery_asyncGoods').show()
                    $('#FBAdelivery_batchDeliver').show()
                    $('#FBAdelivery_batchWriteOrder').show()
                    $('#FBAdelivery_recommPack_open').show()
                    $('#FBAdelivery_purStatus_div').show()
                    $('#FBAdelivery_oaShipStatus_div').show()
                    $('#FBAdelivery_exportBoxInfo').show()
                    $('#FBAdelivery_exportByTemplate').show()
                    $('#FBAdelivery_updateLogisticsTypeBatch').show()
                    $('.shipSearchField').show()
                    break;
                case '3': //已发货
                    $('#FBAdelivery_syncByShipmentIdList').show()
                    $('#FBAdelivery_asyncGoods').show()
                    $('#FBAdelivery_purStatus_div').show()
                    $('#FBAdelivery_oaShipStatus_div').show()
                    $('#FBAdelivery_exportBoxInfo').show()
                    $('#FBAdelivery_exportByTemplate').show()
                    $('#FBAdelivery_updateLogisticsTypeBatch').show()
                    $('#FBAdelivery_importTransferNum').show()
                    $('.shipSearchField').show()
                    $('#FBAdelivery_batchWriteOrder').show()
                    break;
                case '4':
                    $('#FBAdelivery_syncByShipmentIdList').show()
                    $('#FBAdelivery_asyncGoods').show()
                    $('#FBAdelivery_purStatus_div').show()
                    $('#FBAdelivery_oaShipStatus_div').show()
                    $('#FBAdelivery_checkShipStatus_div').show()
                    $('#FBAdelivery_exportByTemplate').show()
                    $('#FBAdelivery_updateLogisticsTypeBatch').show()
                    $('.shipSearchField').show()
                    break;
                case '5':
                    $('#FBAdelivery_syncByShipmentIdList').show()
                    $('#FBAdelivery_asyncGoods').show()
                    $('#FBAdelivery_purStatus_div').show()
                    $('#FBAdelivery_oaShipStatus_div').show()
                    $('#FBAdelivery_exportByTemplate').show()
                    $('#FBAdelivery_updateLogisticsTypeBatch').show()
                    $('.shipSearchField').show()
                    break;
                case '9':
                    $('#FBAdelivery_exportSSkuInfo').show()
                    $('.shipSearchField').show()
                    break;
            }
            form.render()
        }

        
        $('#FBAdelivery_markLabel').click(function () {
            let data = table.checkStatus('FBAdelivery_table_deliveryPlan').data
            if (data.length === 0) {
                layer.msg('请选择要设置物流标签的发货需求')
                return
            }
            setLabel(data);
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
                content: $('#FBAdelivery_setPlanLabelPop').html(),
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
                                $('#FBAdelivery_setPlanLabelContains').html(html)
                                form.render('checkbox','FBAdelivery_setPlanLabelForm')
                            }
                        }
                    })
                }
                ,yes : function () {
                    let formData = serializeObject($('#FBAdelivery_setPlanLabelForm'))
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
                elem: 'FBAdelivery_page',
                curr: current,
                limit: limit,
                limits: [100, 200, 500],
                layout: ['prev', 'page','skip', 'next', 'count', 'limit'],
                count: count,
                jump: function(obj, first) {
                    $('#FBAdeliveryForm input[name="limit"]').val(obj.limit); //保障下次的分页请求中带有的值正确
                    $('#FBAdeliveryForm input[name="page"]').val(obj.curr); //保障下次的分页请求中带有的值正确
                    //首次不执行
                    if (!first) {
                        var data = getFormReqObj("FBAdeliveryForm");
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
                        if(data.tablename == 'FBAdelivery_table_deliveryPlan'){
                          data.storageTypeList = data.storageTypeList ? data.storageTypeList.split(',') : [];
                        }else{
                          delete data.storageTypeList;
                        }
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
            FBAdelivery_currentTableName = tablename
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
                    // imageLazyloadAll();
                    if (tablename === 'FBAdelivery_table_deliveryPlan') { //设置总数
                        var planQuality = 0
                        for (var i in res.data) {
                            planQuality += res.data[i].planQuality
                        }
                        $('#LAY-FBAdelivery th[data-field="planQuality"]').append('<div>(' + planQuality + ')<i class="layui-icon layui-icon-about ml10" lay-tips="仅统计当前页"></i></div>')
                    }
                    if (tablename === 'FBAdelivery_table_toPack' || tablename === 'FBAdelivery_table_toDelivery' || tablename === 'FBAdelivery_table_delivered' || tablename === 'FBAdelivery_table_deleteInfo') { //设置总数
                        var allMulNumber= 0
                        var allQuality = 0
                        for (var i in res.data) {
                            allMulNumber += res.data[i].skuMulNumber
                            allQuality += res.data[i].totalUnits
                        }
                        var item_tpl =
                            `<div class="text_l"><span class="secondary fl">种类:</span>${allMulNumber}</div>
                                        <div class="text_l"><span class="secondary fl">数量:</span>${allQuality}</div>`;
                        $("#" + tablename).next().find('.layui-table-total td[data-field="skuMulNumber"] div').html(item_tpl);
                    }
                    //新增汇总
                    if ('FBAdelivery_table_deliveryPlan' != tablename) {
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
                    } else {
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
                        $("#" + tablename).next().find('.layui-table-total td[data-field="oaWeight"] div').html(allWeight);
                        $("#" + tablename).next().find('.layui-table-total td[data-field="oaCost"] div').html(allCost);

                    }
                    if (currentScrollPosition) {
                        $('.layui-show')[0].scrollTo(0,currentScrollPosition)
                        currentScrollPosition = null
                    }
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
            // 批量取消审核
        // $('#FBAdelivery_batch_cancelAuditPlan').click(function() {
        //         var data = table.checkStatus('FBAdelivery_table_deliveryPlan').data
        //         if (data.length === 0) {
        //             layer.msg('请选择要取消审核的发货需求')
        //             return
        //         }
        //         var idList = [];
        //         for (let i = 0; i < data.length; ++i) {
        //             idList.push(data[i].id)
        //         }
        //         FBAdelivery_cancelAuditPlanBatch(idList)
        //     })
            // 批量归档（剩余不发）
        $('#FBAdelivery_markOverBatch').click(function() {
                var data = table.checkStatus('FBAdelivery_table_deliveryPlan').data
                if (data.length === 0) {
                    layer.msg('请选择要剩余不发的发货需求')
                    return
                }
                var idList = [];
                for (let i = 0; i < data.length; ++i) {
                    idList.push(data[i].id)
                }
                FBAdelivery_markOverBatch(idList)
            })
            //提交货件弹框
        function pop_submitGoods(data) {
            layer.open({
                type: 1,
                title: '提交货件',
                btn: ['提交全部货件', '关闭'],
                area: ['65%', '70%'],
                content: $('#pop_FBA_submitGoods').html(),
                success: function(index, layero) {
                    packTable(data, 'FBAdelivery_table_submitGoodsTable')
                    // 标记分仓
                    $('#FBAdelivery_markDivideWarehouse').click(function () {
                        let data = table.checkStatus('FBAdelivery_table_submitGoodsTable').data
                        if (data.length === 0) {
                            layer.msg('请选择要设置物流标签的货件')
                            return
                        }
                        setLabel(data, 'inner');
                    })
                    // 复制选中的fnSku
                    $('#FBAdelivery_copyAllFnSku').click(function(){
                        let data = table.checkStatus('FBAdelivery_table_submitGoodsTable').data
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
                    var shipDtoList = table.cache.FBAdelivery_table_submitGoodsTable.filter(function(item) {
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
                            layer.msg(returnData.msg || '提交货件成功！');
                            layer.closeAll();
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                        })
                    })
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
                            if (one.yiwuAvailable >= one.fbaLackStock) {
                                one.planToTransferAmount =one.fbaLackStock
                                one.planToPurchaseAmount = 0
                            } else {
                                one.planToTransferAmount = 0
                                one.planToPurchaseAmount = one.fbaLackStock > one.yiwuAvailable? (one.fbaLackStock - one.yiwuAvailable) : 0
                            }
                        }

                        table.render({
                            elem: '#lazyStockTable',
                            data: showList,
                            limit: showList.length,
                            cols: [[
                                { checkbox: true, width: 20 },
                                { title: "商品sku", field: "prodSSku" },
                                // { title: pushStore ? "店铺站点" : "", field: "storeAcct", templet: pushStore ? '<div>{{d.storeAcct + "-" + d.salesSite}} </div>' : '', width: pushStore ? 100 : 1 },
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

        //生成货件--------------
        $('#FBAdelivery_createGoods').click(function() {
            var data = table.checkStatus('FBAdelivery_table_deliveryPlan').data
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
                    layer.msg('请选择同一站点同一店铺的发货计划，你可以使用店铺，站点条件进行筛选查询')
                } else {
                    var createGoodsTableIns = {}
                    layer.open({
                        type: 1,
                        title: '生成货件',
                        btn: ['预建货件', '关闭'],
                        area: ['90%', '90%'],
                        content: $('#pop_FBA_createGoods').html(),
                        id: 'pop_FBA_createGoodsLayer',
                        success: function(index, layero) {
                            // 固定表头
                            $('#pop_FBA_createGoodsLayer').scroll(function() {
                                toFixedTabHead(this)
                            })
                            form.render()
                            getDeliveryAddress(function() {
                                    FBAdeliveryselected('deliveryAddress', storeArr[0])
                                })
                                //初始化物流
                            initAjax("/fba/sale/logistics/query.html", "POST", JSON.stringify(data.field), function(returnData) {
                                appendSelectForSaleLogisticType($('#FBAdelivery_layeracreateForm select[name=saleLogisticTypeId]'), returnData.data, 'id', 'name',null,'物流方式');
                                form.render('select');
                            })
                            // initAjax("/amazonFBA/inboundShipment/getFbaLogistics.html", "POST", JSON.stringify(data.field), function(returnData) {
                            //     appendSelect($('#FBAdelivery_layeracreateForm select[name=preLogisticsTypeId]'), returnData.data, 'id', 'name',null,'物流方式');
                            //     form.render('select');
                            // })
                            packTable(data, 'FBAdelivery_table_createGoodsTable', function(callback) {
                                createGoodsTableIns = callback
                            }, true)
                            var layFilterIndex = 'LAY-table-' + createGoodsTableIns.config.index;
                            var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                            calculateQuantityTotal()

                            tableContainer.find('tr').each(function(index, item) {
                                $(item).find('input').blur(function() {
                                    if ($(this).val() === "") {
                                        layer.msg('计划发货数量不能为空');
                                        $(item).find('input').val('1')
                                    }
                                })
                            })
                            initNotNull('#FBAdelivery_layeracreateForm')
                        },
                        yes: function(index, layero) {
                            if (!checkNotNull('#FBAdelivery_layeracreateForm')) {
                                return false
                            }
                            let Adata = serializeObject($('#FBAdelivery_layeracreateForm'))
                            var addressId = $('#deliveryAddress').val();
                            var layFilterIndex = 'LAY-table-' + createGoodsTableIns.config.index;
                            var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]').find('.layui-table-body');
                            var plans = table.cache.FBAdelivery_table_createGoodsTable.filter(function(item) {
                                return !(item && !isNaN(item.length))
                            })
                            console.log(addressId)
                            Adata.salesSite = plans[0].salesSite;
                            Adata.storeAcctId = plans[0].storeAcctId;
                            plans = plans.map(function(item) {
                                var { id,historyId, planQuality, sellerSku, picUrl,availableQuality } = item
                                return { id, historyId,planQuality, sellerSku, picUrl,availableQuality }
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
                layer.msg('请勾选需要生成货件的发货计划')
            }
            return false;
        })

        function calculateQuantityTotal() {
            $("#FBAdelivery_table_createGoodsTable").next().find('tbody').find("td[data-field ^= 'planQuality'] input").change(function() {
                var datafield = $(this).parents('td').attr('data-field');
                if ($(this).val() !== "") {
                    var tr = $(this).parents('tr')
                    columnSum(datafield, '2')
                }
                let index =  parseInt($(this).closest('tr').attr('data-index'))
                var data = table.cache.FBAdelivery_table_createGoodsTable
                data[index].planQuality = this.value
                let statisticInfo = calTotalWeightAndThrowWeight(data)
                $("#FBAdelivery_table_createGoodsTable").next().find('.layui-table-total td[data-field=storeAcct] div').text('总实重: ' + statisticInfo.totalWeight + ';总抛重:' + statisticInfo.totalThrowWeight)
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
            $("#FBAdelivery_table_createGoodsTable").next().find('.layui-table-total td[data-field="' + datafield + '"] div').text(amount)
        }
        // sku length
        function skuCount(datafield) {
            let length = $("#FBAdelivery_table_createGoodsTable").next().find('tbody').children().length - 1
            $("#FBAdelivery_table_createGoodsTable").next().find('.layui-table-total td[data-field="' + datafield + '"] div').text('总SKU计数:' + length)
        }

        //同步货件任务
        $('#FBAdelivery_asyncGoods').click(function() {
            //同步货件任务请求
            var salesSite = $('#FBAdelivery_amazonSite').val();
            var storeAcctId = $('#FBAdelivery_storeAcct').val();
            asyncGoodsTask({ salesSite, storeAcctId }, function(returnData) {
                layer.msg(returnData.msg || '同步成功')
                currentScrollPosition = $('.layui-show')[0].scrollTop
                refreshTable();
            })
        })

        //批量发货
        $('#FBAdelivery_batchDeliver').click(function() {
            var data = table.checkStatus(FBAdelivery_currentTableName).data
            if (!data || !data.length || data.length === 0) {
                layer.msg('请选择要批量发货的货件')
                return
            }
            
            markDeliver(data, false, 'batch');
        })
        // 批量填入运单
        $('#FBAdelivery_batchWriteOrder').click(function() {
            var data = table.checkStatus(FBAdelivery_currentTableName).data
            if (!data || !data.length || data.length === 0) {
                layer.msg('请选择要批量填入运单的货件')
                return
            }
            fullFreightNum(data, 'batch')
        })

        //打开推荐装箱页面
        $('#FBAdelivery_recommPack_open').click(function() {
            //TODO
            var data = table.checkStatus('FBAdelivery_table_toDelivery').data;
            var siteArr = [];
            for (var i in data) {
                if (!(siteArr.indexOf(data[i].salesSite) > -1)) {
                    siteArr.push(data[i].salesSite)
                }
            }
            if (data.length > 0 && siteArr.length == 1) {
                //获取结果
                loading.show();
                var idList = data.map((item) => { //map函数,更快地组织列表
                    return item.id;
                })
                initAjax('/amazonFBA/inboundShipment/recommendPack.html', 'POST', JSON.stringify({ idList: idList }), function(returnData) {
                    layer.open({
                        type: 1,
                        title: '推荐装箱',
                        btn: ['关闭'],
                        area: ['80%', '80%'],
                        content: $('#FBAdelivery_recommPackTpl').html(),
                        success: function(layero, index) {
                            //TODO
                            packTable(returnData.data, 'FBAdelivery_table_recommPackTable')
                        }
                    })
                });
            } else {
                if (siteArr.length > 1) {
                    layer.msg('请选择同一站点的发货计划，你可以使用站点条件进行筛选查询')
                } else {
                    layer.msg("请至少选一条");
                }
            }

        })
        $('#FBAdelivery_exportLackInfo').click(function() {
            var outerIndex = layer.confirm('确认导出FBA缺货信息？', { btn: ['确认', '取消'] }, function() {
                submitForm('', ctx + '/amazonFBA/exportLackInfo.html')
                layer.close(outerIndex);
            })
        })

        $('#FBAdelivery_exportBoxInfo').click(function() {
            var data = table.checkStatus(FBAdelivery_currentTableName).data
            if (!data || !data.length || data.length === 0) {
                layer.msg('请选择要导出货件')
                return
            }
            let idList = []
            for (let i = 0; i < data.length; i++) {
                idList.push(data[i].id)
            }
            var outerIndex = layer.confirm('确认导出这些货件的装箱信息？', { btn: ['确认', '取消'] }, function() {
                let searchParam = { idList: idList }
                let Adada = {}
                Adada.searchParam = JSON.stringify(searchParam)
                layer.alert('请不要关闭和操作网页，后台正在进行导出文件')
                submitForm(Adada, ctx + '/amazonFBA/exportBoxInfo.html')
                layer.close(outerIndex);
            })
        })

        // 生成批次
        $('#FBAdelivery_createBatch').click(function() {
            let data = table.checkStatus(FBAdelivery_currentTableName).data
            if (data.length === 0) {
                layer.msg('请选择要生成批次的货件计划')
                return
            }
            layer.confirm('确定生成批次？', function(index) {
                let idList = [];
                for (let i = 0; i < data.length; ++i) {
                    idList.push(data[i].id)
                }
                let ajax = new Ajax();
                ajax.post({
                    url: '/FbaDistributePlan/generateBatchNoForShip',
                    data: idList,
                    success: function(res) {
                        if (res.code === '0000') {
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            layer.msg('生成批次成功！')
                            refreshTable();
                        }
                    }
                });
                layer.close(index);

            })
        })

        // 取消批次
        $('#FBAdelivery_cancelBatch').click(function() {
            let data = table.checkStatus(FBAdelivery_currentTableName).data
            if (data.length === 0) {
                layer.msg('请选择要取消批次的货件计划')
                return
            }
            layer.confirm('确定取消批次？', function(index) {
                let idList = [];
                for (let i = 0; i < data.length; ++i) {
                    idList.push(data[i].id)
                }
                let ajax = new Ajax();
                ajax.post({
                    url: '/FbaDistributePlan/cancelBatchNoForShip',
                    data: idList,
                    success: function(res) {
                        if (res.code === '0000') {
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            layer.msg('取消批次成功！')
                            refreshTable();
                        }
                    }
                });
                layer.close(index);

            })
        })


        $('#FBAdelivery_exportByTemplate').click(function() {
            var data = table.checkStatus(FBAdelivery_currentTableName).data
            if (!data || !data.length || data.length === 0) {
                layer.msg('请选择要导出货件')
                return
            }
            let idList = []
            for (let i = 0; i < data.length; i++) {
                idList.push(data[i].id)
            }
            let popIndex = layer.open({
                title: '导出模板选择',
                type: 1,
                area: ['70%', '80%'],
                btn: ['导出', '关闭'],
                content: $('#FBAdelivery_exportByTemplatePop').html(),
                id: "FBAdelivery_exportByTemplatePopLayer",
                success: function() {
                    table.render({
                        elem: '#FBAdelivery_exportTemplateTable',
                        method: 'POST',
                        url: ctx + '/winitExportTemplate/queryPage.html',
                        where: { templateType: 2 },
                        cols: [
                            [
                                { type: "checkbox", width: 30 },
                                { title: "模板名称", field: "name", width: 120 },
                                {
                                    title: "导出字段内容",
                                    templet: function(res) {
                                        let sheetList = JSON.parse(res.titleJson)
                                        let html = ''
                                        for (let k = 0; k < sheetList.length; k++) {
                                            let titleList = sheetList[k].titleList
                                            let titleArr = []
                                            for (let i = 0; i < titleList.length; ++i) {
                                                titleArr.push(titleList[i].excelField)
                                            }
                                            html += '<div class="b1">' + titleArr.join(',') + '</div>'
                                        }
                                        return ('<em>' + html + '</em>')
                                    }
                                },
                                { title: "备注", field: "remark", width: 250 },
                            ]
                        ],
                        page: false,
                        limit: 50,
                        id: 'FBAdelivery_exportTemplateTable',
                    })
                },
                yes: function() {
                    let checkStatus = table.checkStatus('FBAdelivery_exportTemplateTable'),
                        data = checkStatus.data;
                    if (data.length === 0) {
                        layer.msg('请选择要导出模板')
                        return
                    }
                    for (let i = 0; i < data.length; ++i) {
                        let Adata = {
                            idList: idList,
                            tempId: parseInt(data[i].id)
                        }
                        submitForm(Adata, ctx + '/amazonFBA/exportByTemplate.html')
                    }
                }
            })

        })

        $('#FBAdelivery_fixExpirDate').click(function() {
            layer.open({
                type: 1,
                title: '补充过期时间',
                btn: ["补充", '关闭'],
                area: ['65%', '60%'],
                content: $('#FBAdelivery_fix_remove_expirDate_tpl').html(),
                success: function(layero, index) {
                    $('#FBAdelivery_fix_remove_expirDate_form input[name=removeOrAdd]').val("add");
                },
                yes: function(layero, index) {
                    $('#FBAdelivery_fix_remove_expirDate_form_submit').click();
                }
            })
        })
        $('#FBAdelivery_removExpirDate').click(function() {
            layer.open({
                type: 1,
                title: '清除过期时间',
                btn: ["清除", '关闭'],
                area: ['65%', '60%'],
                content: $('#FBAdelivery_fix_remove_expirDate_tpl').html(),
                success: function(layero, index) {
                    $('#FBAdelivery_fix_remove_expirDate_form input[name=removeOrAdd]').val("remove");
                },
                yes: function(layero, index) {
                    $('#FBAdelivery_fix_remove_expirDate_form_submit').click();
                }
            })
        })

        // 弹框-----------------


        function printOrPreview(printProductTableIns, onlyPreView) {
            let layFilterIndex = 'LAY-table-' + printProductTableIns.config.index;
            let tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
            let printProductTabledata = table.cache.FBAdelivery_table_printProductTable;
            tableContainer.find('tr').each(function(index, item) {
                if (index > 0) {
                    printProductTabledata[index - 1].mixStyle = $(item).find('td[data-field="mixStyle"]').find('input[name=mixStyle]').val()
                    printProductTabledata[index - 1].prodSSku = $(item).find('td[data-field="mixStyle"]').find('input[name=prodSSku]').val()
                    printProductTabledata[index - 1].printNumber = $(item).find('td[data-field="printNumber"]').find('input').val()
                    printProductTabledata[index - 1].printerName = "5025";
                    printProductTabledata[index - 1].onlyPreView = onlyPreView;
                }
            });
            let printData = [];

            printProductTabledata.map(function(item) {
                console.log(item)
                if (item.LAY_CHECKED) {
                    let one = {
                        fnSku: item.fnSku,
                        mixStyle: item.mixStyle,
                        printNumber: item.printNumber,
                        printerName: item.printerName,
                        onlyPreView: item.onlyPreView,
                        prodSSku: item.prodSSku,
                        title: getTitleAli(item.title)
                    }
                    printData.push(one);
                }
            })
            if (printData.length > 0) {
                fab_shipmentSku_print(printData) //预调用打印方法
            } else {
                layer.msg("请至少勾选一条数据");
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
                        content: $('#pop_FBA_modifyAmount').html(),
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
                if (layEvent === 'FBA_removePro') { //移除货品
                    layer.confirm('确定移除这条商品?', function(index) {
                        deleteDeliveryPlan(data.id, function(returnData) {
                            layer.msg(returnData.msg || '移除商品成功')
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                            layer.close(index);
                        })
                    })
                }
                if (layEvent === 'FBAdelivery_auditPlan') { // 审核
                    FBAdelivery_auditPlanBatch([data.id])
                }
                if (layEvent === 'FBAdelivery_cancelAudit') { // 取消审核
                    FBAdelivery_cancelAuditPlanBatch([data.id])
                }
                if (layEvent === 'FBAdelivery_markOver') { // 剩余不发
                    FBAdelivery_markOverBatch([data.id])
                }
                if (layEvent === 'FBA_productDetail_OA') { //已发货、全部- 货品详情
                    FBAdelivery_showProdDetail(data, false, false)
                }
                if (layEvent === 'FBA_productDetail_online') { //货品详情(在线)
                    FBAdelivery_showProdDetail(data, false, false, true)
                }
                if (layEvent === 'FBA_productDetail_canEdit') { //待采购、待装箱、待发货- 货品详情
                    FBAdelivery_showProdDetail(data, true, false)
                }
                if (layEvent === 'FBA_productDetail_canEdit_onlyOA') { //状态异常- 货品详情
                    FBAdelivery_showProdDetail(data, true, true)
                }
                if (layEvent === 'FBA_pack') { //api装箱，有可能api未装箱，但是OA已装箱
                    packButton(data, false);
                }
                if (layEvent === 'FBA_pack_oa') { //oa状态装箱
                    packButton(data, true);
                }
                if (layEvent === 'FBA_printProduct') { //打印货品标签
                    var printProductTableIns = {};
                    layer.open({
                        type: 1,
                        title: '打印货品标签',
                        btn: ['预览', '打印', '关闭'],
                        area: ['65%', '70%'],
                        content: $('#pop_FBA_printProduct').html(),
                        success: function(layero, index) {
                            printList(data.id, function(returnData) {
                                packTable(returnData.data.detail, 'FBAdelivery_table_printProductTable', function(callback) {
                                    printProductTableIns = callback
                                })
                            })
                        },
                        yes: function(index, layero) {
                            printOrPreview(printProductTableIns, true);
                            return false;
                        },
                        btn2: function(index, layero) {
                            printOrPreview(printProductTableIns, false);
                            return false;
                        }
                    })
                }
                if (layEvent === 'FBA_removegoods') { //移除货件
                    layer.confirm('确定移除该货件?', function(index) {
                        deleteGoods(data.id, function(returnData) {
                            layer.msg(returnData.msg || '移除货件成功');
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable()
                            layer.close(index);
                        })
                    })
                }
                if (layEvent === 'FBAdelivery_realeaseOcc') { //移除货件
                    layer.confirm('确定释放该货件占用,释放后货件进入异常状态,且暂时无法再在OA里处理?', function(index) {
                        initAjax('/amazonFBA/inboundShipment/releaseOcc.html', 'POST', JSON.stringify({ id: data.id }), function(returnData) {
                            layer.msg(returnData.msg || '释放货件成功');
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable()
                            layer.close(index);
                        })
                    })
                }
                if (layEvent === 'FBA_markDeliver') { //API发货
                    markDeliver(data, false);
                }
                if (layEvent === 'FBA_markDeliver_oa') { //OA发货
                    markDeliver(data, true);
                }
                if (layEvent === 'FBA_createTable') { //生成货件表格移除商品
                    obj.del();
                    calculateQuantityTotal()
                    columnSum('planQuality', '2')
                    skuCount('prodSSku');
                    let dataA = table.cache.FBAdelivery_table_createGoodsTable
                    let statisticInfo = calTotalWeightAndThrowWeight(dataA)
                    $("#FBAdelivery_table_createGoodsTable").next().find('.layui-table-total td[data-field=storeAcct] div').text('总实重: ' + statisticInfo.totalWeight + ';总抛重:' + statisticInfo.totalThrowWeight)
                }
                if (layEvent === 'FBA_submitremovegoods') { //提交货件移除商品
                    obj.del();
                }
                if (layEvent === 'FBA_submitproductDetail') { //提交货件商品详情
                    layer.open({
                        type: 1,
                        title: '货品详情',
                        btn: ['关闭'],
                        area: ['65%', '70%'],
                        content: $('#pop_FBA_productDetail').html(),
                        success: function(layero, index) {
                            showProdDetaiLTable(data.detail, true)
                            $('#pop_FBA_productDetail_copyFnSku').click(function (){
                                let dataList = table.cache.FBAdelivery_ProdDetailTable
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
                if (layEvent === 'FBA_printBox') { //打印箱子标签

                    //先请求生成
                    printCartonLabel(data.id, function(res) {
                        window.open(res.msg);
                        // 直接打印箱唛
                        let obj = {};
                        obj.printType = 100;
                        obj.url = res.msg;
                        obj.width = 297;
                        obj.height = 210;
                        obj.amount = data.caseLabelNum;
                        obj.FBACaseLabelPrint = 'FBACaseLabelPrint'
                        commonPrintRequest(obj, true)
                    })

                }
                if (layEvent === 'FBAdelivery_pack_all_notEdit_detail') { //只能查看的装箱详情
                    layer.open({
                        type: 1,
                        title: '装箱详情',
                        btn: ['关闭'],
                        area: ['100%', '100%'],
                        content: $('#pop_FBA_topack').html(),
                        success: function(layero, index) {
                            printList(data.oaShipId, function(returnData) {
                                $('#FBAdelivery_ex_im_div').addClass('disN')
                                $('#FBA_confirmNumber').addClass('disN')
                                $('#FBA_confirmNumber_input').val(returnData.data.cartonNumber);

                                genCartonBox(returnData.data.cartonNumber, returnData.data.detail, returnData.data.detail, returnData.data.cartonInfo); //装箱详情

                                focus_location(table, layero, form);
                            })
                        }
                    })
                }
                if (layEvent === 'FBA_pack_detail') {
                    if (data.shipmentStatus === 'WORKING' && data.oaShipStatus === 2) {
                        packButton(data, false);
                    } else {
                        packButton_unEditAble(data)
                    }
                }
                if (layEvent === 'FBA_fullFreightNum') { //填入运单
                    fullFreightNum(data)
                }
                if (layEvent === 'FBAdelivery_setAllboxSize') { //一键应用
                    var inputList = $(thisTR).find('input');
                    var inputNumTmp = inputList.eq(0).val();
                    for (var i = 1; i < inputList.length; i++) {
                        inputList.eq(i).val(inputNumTmp);
                    }
                }
                if (layEvent === 'FBAdelivery_ShipAudit') { //审核 从FBA后台创建的货件计划
                    let popIndex = layer.open({
                        type: 1,
                        title: '审核由FBA创建的货件计划',
                        btn: ['审核通过', '关闭'],
                        area: ['35%', '60%'],
                        content: $('#FBAdelivery_pur_setLogistics_tpl').html(),
                        success: function(index, layero) {
                            $('#FBAdelivery_pur_setLogistics_tpl_form input[name=id]').val(data.id);
                            //初始化物流
                            initAjax("/amazonFBA/inboundShipment/getFbaLogistics.html", "POST", JSON.stringify(data.field), function(returnData) {
                                appendSelect($('#FBAdelivery_pur_setLogistics_tpl_form select[name=preLogisticsTypeId]'), returnData.data, 'id', 'name',null,'物流方式');
                                form.render('select');
                            })
                            initNotNull('#FBAdelivery_pur_setLogistics_tpl_form')
                        },
                        yes: function(index, layero) {
                            if (!checkNotNull('#FBAdelivery_pur_setLogistics_tpl_form')) {
                                return false
                            }
                            let Adata = serializeObject($('#FBAdelivery_pur_setLogistics_tpl_form'))
                            Adata.id = data.id
                            initAjax("/amazonFBA/inboundShipment/auditFbaCreateShip.html", "POST", JSON.stringify(Adata), function(returnData) {
                                //根据响应回显列表
                                layer.msg("审核成功");
                                currentScrollPosition = $('.layui-show')[0].scrollTop
                                refreshTable();
                                layer.close(popIndex)
                            });
                        }
                    })
                }
                if (layEvent === 'FBAdelivery_setPurToSendWh') { //审核 从FBA后台创建的货件计划
                    let confirmIndex = layer.confirm('确认派单？', { btn: ['确认', '取消'] }, function() {
                        layer.close(confirmIndex)
                        let Adata = { id: data.id }
                        initAjax("/amazonFBA/inboundShipment/setPurToSendWh.html", "POST", JSON.stringify(Adata), function(returnData) {
                            //根据响应回显列表
                            layer.msg("派单成功");
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                        });
                    })
                }

                if (layEvent === 'FBAdelivery_changeLogistic') { //弹窗编辑物流
                    popToChangeLogisticsType(data)
                }
                if (layEvent === 'FBAdelivery_full_address') {
                    layer.open({
                        type: 1,
                        title: '补充地址',
                        btn: ['确认', '关闭'],
                        area: ['65%', '60%'],
                        content: $('#FBAdelivery_full_address_tpl').html(),
                        success: function(index, layero) {
                            form.render();
                            $('#FBAdelivery_full_address_form  input[name=id]').val(data.id);
                            initAjax('/address/queryByAddressNamePost.html', 'POST', JSON.stringify({ addressType: 1 }), function(returnData) { //addressType:1 FBA地址
                                appendSelect($('#FBAdelivery_full_address_form select[name=addressId]'), returnData.data, 'id', 'addressName');
                                form.render();
                                FBAdeliveryselected('deliveryAddress_toFull', data.storeAcct)
                            })
                        },
                        yes: function(index, layero) {
                            //触发表单提交任务
                            $('#FBAdelivery_full_address_form_submit').click();
                            layer.close(index);
                        }
                    });
                }
                if (layEvent === "FBAdelivery_repairInitFbaShip") {
                    initAjax('/amazonFBA/inboundShipment/repairInitFbaShip.html', 'POST', JSON.stringify({ id: data.id, }), function(returnData) { //addressType:1 FBA地址
                        //根据响应回显列表
                        layer.msg(returnData.msg || "主动修复成功");
                        currentScrollPosition = $('.layui-show')[0].scrollTop
                        refreshTable()
                    }, null, true);
                }
                if (layEvent === 'FBAdelivery_createDHL_btn') { //创建DHL
                    //打开表单
                    createDHL_deal_edit_index = layer.open({
                        type: 1,
                        title: '创建DHL',
                        btn: ['创建DHL', '关闭'],
                        area: ['80%', '80%'],
                        content: $('#FBAdelivery_createDHL_tpl').html(),
                        success: function(layero, index) {
                            cartonIdList = [];
                            createDHL_deal_freightNum = null;
                            createDHL_deal_fnCenterId = null;
                            form.render();
                            createDHL_deal_freightNum = data.freightNum;
                            createDHL_deal_fnCenterId = data.fnCenterId;
                            var allTableDate = table.cache.FBAdelivery_table_recommPackTable;
                            for (var j = 0; j < allTableDate.length; j++) {
                                if (createDHL_deal_freightNum == allTableDate[j].freightNum && createDHL_deal_fnCenterId == allTableDate[j].fnCenterId) { //匹配的id列表用于生成DHL订单
                                    cartonIdList.push(allTableDate[j].id);
                                }
                            }

                            //初始化物流方式选项
                            initAjax('/amazonFBA/inboundShipment/getFbaLogistics.html', 'POST', null, function(returnData) { //addressType:1 FBA地址
                                appendSelect($('#FBAdelivery_createDHL_form select[name=logisticsTypeId]'), returnData.data, 'id', 'name');
                                layui.form.render();
                            });


                        },
                        yes: function(index, layero) {
                            $('#FBAdelivery_createDHL_form_submit').click()
                        }
                    })
                }
                // 打印货品标签
                if (layEvent === 'FBAdelivery_op_printFnSku') {
                    layer.open({
                        type: 1,
                        title: '打印货品标签',
                        btn: ['打印', '关闭'],
                        area: ['40%', '30%'],
                        content: $('#FBAdelivery_printFnSkuAmountPop').html(),
                        yes: function() {
                            let printNumber = $('#FBAdelivery_printFnSkuAmount').val();
                            if (!printNumber || !isInteger(printNumber)) {
                                layer.msg('请填写正确的打印数量');
                                return false
                            }
                            let ajax = new Ajax(false);
                            let Adata = { id: data.id };
                            ajax.post({
                                url: ctx + '/amazonFBA/getFnInfoByRelSkuId.html',
                                data: JSON.stringify(Adata),
                                success: function(res) {
                                    if (res.code === '0000') {
                                        let printone = {};
                                        printone.onlyPreView = false;
                                        printone.fnSku = res.data.fnSku;
                                        printone.title = getTitleAli(res.data.title);
                                        printone.printNumber = printNumber;
                                        printone.mixStyle = res.data.mixStyle;
                                        printone.prodSSku = res.data.prodSSku;
                                        printone.printerName = '5025';
                                        fab_shipmentSku_print([printone])
                                    }
                                }
                            })
                        }
                    })
                }
                // 打印sku标签
                if (layEvent === 'FBAdelivery_op_printProdSSku') {
                    layer.open({
                        type: 1,
                        title: '打印SKU标签',
                        btn: ['打印', '关闭'],
                        area: ['40%', '30%'],
                        content: $('#FBAdelivery_printFnSkuAmountPop').html(),
                        success: function(layero, index) {

                        },
                        yes: function() {
                            let printNumber = $('#FBAdelivery_printFnSkuAmount').val();
                            let ajax = new Ajax(false);
                            ajax.post({
                                url: ctx + '/amazonFbaGoodsMatch/getBaseSkuInfoToPrint.html',
                                data: JSON.stringify({ prodSSku: data.prodSSku }),
                                success: function(returnData) {
                                    var item = returnData.data;
                                    var printarr = [];

                                    var obj = {};
                                    obj.printNumber = printNumber; //标签打印次数，弹框可修改
                                    obj.prodUnit = item.unit; //单位
                                    obj.prodName = item.title; //名称
                                    obj.weight = accAdd(item.suttleWeight, (item.packWeight ? item.packWeight : 0)); //毛重
                                    obj.develop = item.parent.bizzOwner; //开发
                                    obj.prodSSku = item.sSku; //子SKU
                                    obj.prodStyle = item.style; //款式
                                    obj.prodPSku = item.parent.pSku; //父sku
                                    obj.inPackType = item.inPackType;
                                    if (item.inPackType == null) {
                                        obj.inPackType = "";
                                    }
                                    printarr.push(obj);
                                    epeanPrint_plugin_fun(10, printarr); //打印sku商品标签,
                                }
                            })
                        }
                    })


                }
                if (layEvent === 'FBAdelivery_op_printOnlyBox') {
                    let ajax = new Ajax(false);
                    let Adata = { id: data.id };
                    ajax.post({
                        url: ctx + '/amazonFBA/getMatchInfoOfComb.html',
                        data: JSON.stringify(Adata),
                        success: function(res) {
                            if (res.code === '0000') {
                                let oneDataItem = res.data;
                                let printDataArray = [{ //打印box
                                    printNumber: 1,
                                    printerName: "10040",
                                    onlyPreView: false,
                                    prodSSku: oneDataItem.prodSSku,
                                    amount: oneDataItem.amount,
                                    boxCode: oneDataItem.boxCode,
                                }];
                                epeanPrint_plugin_fun(12, printDataArray); //打印box,打篮子
                            }
                        }
                    })

                }
                if (layEvent === 'FBAdelivery_op_printPutInLabel') {
                    let ajax = new Ajax(false);
                    let Adata = { id: data.shipRelSkuId };
                    ajax.post({
                        url: ctx + '/amazonFBA/getPutInfoOfComb.html',
                        data: JSON.stringify(Adata),
                        success: function(res) {
                            if (res.code === '0000') {
                                let data = [res.data];
                                let markIdList = [];
                                data.forEach(function(item, index) {
                                    markIdList.push(item.id);
                                });
                                let printData = data.map(function(item) {
                                    return {
                                        fnSku: item.fnSku,
                                        mixStyle: item.mixStyle,
                                        printNumber: item.planQuality,
                                        planQuality: item.planQuality,
                                        printerName: "10040",
                                        onlyPreView: false,
                                        prodSSku: item.prodSSku,
                                        boxCode: item.boxCode,
                                        shipmentId: item.shipmentId,
                                        combStyle: item.combStyle,
                                        shipBoxCode: item.shipBoxCode,
                                        combSkuList: item.combSkuList
                                    }
                                });
                                let canPrint = true; //能打印
                                let errorMsg = "";
                                printData.forEach(function(printItem, index) {
                                    if (canPrint) {
                                        if ($.isEmptyObject(printItem.shipBoxCode)) {
                                            errorMsg += "<div>货件:" + printItem.shipmentId + "，fnSku:" + printItem.fnSku + "没有分配仓库箱子<br/></div>";
                                            canPrint = false;
                                        }
                                    }
                                });
                                if (!canPrint) {
                                    layer.msg(errorMsg, { icon: 2 });
                                } else {
                                    FbaDelivery_printCombBox(printData);
                                    FbaDelivery_printCombDetail(printData)
                                }
                            }
                        }
                    })
                }
                if (layEvent === 'FBAdelivery_op_updateActQuality') {
                    let popIndex = layer.open({
                        type: 1,
                        title: '修改配货数量',
                        btn: ['保存', '关闭'],
                        area: ['40%', '30%'],
                        content: $('#FBAdelivery_modifyMatchNumPop').html(),
                        success: function(layero, index) {
                            // 复现原配货数量
                            $('#FBAdelivery_MatchNum').val(data.actQuality)
                        },
                        yes: function() {
                            let actQuality = $('#FBAdelivery_MatchNum').val();
                            if (!actQuality || !isInteger(actQuality)) {
                                layer.msg('请填写正确的数量');
                                return false
                            }
                            if (actQuality <= 0) {
                                layer.msg('配货数量需大于0');
                                return false
                            }
                            let ajax = new Ajax(false);
                            let Adata = { id: data.id, actQuality: actQuality };
                            ajax.post({
                                url: ctx + '/amazonFBA/modifyMatchNum.html',
                                data: JSON.stringify(Adata),
                                success: function(res) {
                                    if (res.code === '0000') {
                                        layer.msg('修改成功');
                                        layer.close(popIndex);
                                        currentScrollPosition = $('.layui-show')[0].scrollTop
                                        refreshTable()
                                    }
                                }
                            })
                        }
                    })
                }
                if (layEvent === 'FBAdelivery_op_cancelMatch') {
                    let confirmIndex = layer.confirm('确认取消配货吗？', { btn: ['确认', '取消'] }, function() {
                        let Adata = { id: data.id };
                        let ajax = new Ajax(false);
                        ajax.post({
                            url: ctx + '/amazonFBA/cancelMatch.html',
                            data: JSON.stringify(Adata),
                            success: function(res) {
                                if (res.code === '0000') {
                                    layer.msg('取消配货成功');
                                    layer.close(confirmIndex);
                                    currentScrollPosition = $('.layui-show')[0].scrollTop
                                    refreshTable()
                                }
                            }
                        });
                        layer.close(confirmIndex)
                    })
                }

                // 展示 销量表现
                if (layEvent === 'FBAdelivery_showBehavior') {
                    amazon_fba_component_showBehavior(data)
                }
            })
        }

    function fullFreightNum(data, type = '') {
        layer.open({
            type: 1,
            title: '填入运单',
            btn: ['保存', '关闭'],
            area: ['100%', '100%'],
            content: $('#FBA_fullFreightNum_edit_tpl').html(),
            id: 'FBA_fullFreightNum_edit_pop',
            success: function(layero, index) {
                let url = type === 'batch' ? '/amazonFBA/inboundShipment/BatchListAllCarton' : '/amazonFBA/inboundShipment/listAllCarton.html'
                let params = {}
                if (type === 'batch') {
                    let idList = []
                    for (let i = 0; i < data.length; i++) {
                        idList.push(data[i].id)
                    }
                    params = { idList }
                } else {
                    params = { id: data.id }
                }
                //请求运单详情
                initAjax(url, "POST", JSON.stringify(params), function(returnData) {
                    //根据响应回显列表
                    packTable(returnData.data, 'FBAdelivery_table_freightTable');
                });
                //重选物流
                $('#FBA_fullFreightNum_edit_pop').on('click', '#FBAdelivery_setLogisticsTypeForListBtn', function() {
                    popToChangeLogisticsType()
                })
                $('#FBA_fullFreightNum_edit_pop').on('click', '#FBAdelivery_setLogisticsNoForListBtn', function() {
                        let tabInfo = table.cache.FBAdelivery_table_freightTable;
                        let logisticstNo = $('#FBAdelivery_setLogisticsNoForListValue').val()
                        for (var i = 0; i < tabInfo.length; i++) {
                            tabInfo[i].freightNum = logisticstNo;
                        }
                        packTable(tabInfo, 'FBAdelivery_table_freightTable');
                    })
                    //申请运单号
                $('#FBA_fullFreightNum_edit_pop').on('click', '#FBAdelivery_ApplyWaybillNumberBtn', function() {
                    popApplyWaybillNumber();
                })

                $('#FBA_fullFreightNum_edit_pop').on('click', '#FBAdelivery_setTransferNumForListBtn', function() {
                    let tabInfo = table.cache.FBAdelivery_table_freightTable;
                    let transferNum = $('#FBAdelivery_setTransferNumForListValue').val()
                    for (let i = 0; i < tabInfo.length; i++) {
                        tabInfo[i].transferNum = transferNum;
                    }
                    packTable(tabInfo, 'FBAdelivery_table_freightTable');
                })
            },
            yes: function(index, layero) {
                //保存运单信息
                //遍历tr,组织参数列表
                var req = {};
                req.id = data.id;
                req.storeAcctId = data.storeAcctId;
                req.salesSite = data.salesSite;
                let invalidFreightNumArr = []
                req.freightNumInfo = table.cache.FBAdelivery_table_freightTable.map(function(item) {
                    // 检查物流单号是否合规
                    if (item.trackingNoPrefix && item.freightNum && item.freightNum.indexOf(item.trackingNoPrefix) !== 0) {
                        invalidFreightNumArr.push(item.freightNum)
                    }
                    if (type === 'batch') {
                       return { id: item.id, logisticsTypeId: item.logisticsTypeId, freightNum: item.freightNum || "", transferNum: item.transferNum || null, pShipId: item.pShipId, salesSite: item.salesSite }
                    }
                    return { id: item.id, logisticsTypeId: item.logisticsTypeId, freightNum: item.freightNum || "", transferNum: item.transferNum || null };
                })
                
                if (invalidFreightNumArr.length > 0) {
                    layer.msg('存在运单号与对应物流不匹配:' + invalidFreightNumArr.join(','))
                    return false
                }
                if (type === 'batch') {
                    initAjax("/amazonFBA/inboundShipment/batchEditFreightNum", "POST", JSON.stringify(req), function(returnData) {
                        //根据响应回显列表
                        layer.msg(returnData.msg || "修改成功");
                        layer.close(index);
                    });
                } else {
                    //请求运单详情
                    initAjax("/amazonFBA/inboundShipment/editFreightNum.html", "POST", JSON.stringify(req), function(returnData) {
                        //根据响应回显列表
                        layer.msg(returnData.msg || "修改成功");
                        layer.close(index);
                    });
                }
            }
        })
    }
    function getTitleAli(title) {
        let titleArr = title.split(' ');
        if (titleArr.length > 5) {
            return titleArr[0] + ' ' + titleArr[1] + ' ... ' + titleArr[titleArr.length - 2] + " "  + titleArr[titleArr.length - 1]
        } else {
            return title
        }
    }

    function FBAdelivery_markOverBatch(idList) {
            layer.confirm('确定剩余不发？', function(index) {
                let ajax = new Ajax(true);
                ajax.post({
                    url: '/amazonFBA/shipPlan/markOver.html',
                    data: JSON.stringify({ idList: idList }),
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

        function FBAdelivery_cancelAuditPlanBatch(idList) {
            layer.confirm('确定取消审核？', function(index) {
                let ajax = new Ajax();
                ajax.post({
                    url: '/amazonFBA/shipPlan/cancelAudit',
                    data: JSON.stringify({ idList: idList }),
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

        function FBAdelivery_auditPlanBatch(idList) {
            layer.confirm('确定审核通过？', function(index) {
                let ajax = new Ajax();
                ajax.post({
                    url: '/amazonFBA/shipPlan/auditPlan',
                    data: JSON.stringify({ idList: idList }),
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
        /**
         * 展示货品详情
         * @param ifEdit 是否可编辑
         * @param ifOnlyChangeOa 是否仅变更OA 数据
         * @param queryOL 查询在线数据
         * @constructor
         */
        function FBAdelivery_showProdDetail(data, ifEdit, ifOnlyChangeOa, queryOL) {
            let btnArr;
            let fun1;
            if (!ifEdit) {
                btnArr = ['关闭'];
                fun1 = function(popIndex) {
                    layer.close(popIndex)
                }
            } else {
                if (ifOnlyChangeOa) {
                    btnArr = ['更新OA货品', '关闭']
                } else {
                    btnArr = ['更新在线货品', '关闭']
                }
                fun1 = function(popIndex) {
                    let req = {};
                    req.id = data.id;
                    req.detail = [];
                    let tabInfo = table.cache.FBAdelivery_ProdDetailTable.filter(function(item) {
                        return !(item && !isNaN(item.length))
                    });
                    if (!tabInfo || tabInfo.length === 0) {
                        layer.msg('不可删除货件中的所有货品');
                        return
                    }
                    for (let i = 0; i < tabInfo.length; ++i) {
                        let tmp = {};
                        tmp.id = tabInfo[i].id;
                        tmp.planQuality = tabInfo[i].planQuality;
                        tmp.sellerSku = tabInfo[i].sellerSku;
                        if (!tmp.planQuality || !isInteger(tmp.planQuality) || tmp.planQuality <= 0) {
                            layer.msg('请填写正确的计划数量');
                            return false
                        }
                        tmp.planQuality = parseInt(tmp.planQuality);
                        req.detail.push(tmp)
                    }
                    if (!ifOnlyChangeOa) {
                        initAjax('/amazonFBA/inboundShipment/update.html', 'POST', JSON.stringify(req), function(returnData) {
                            layer.msg(returnData.msg || '更新在线商品成功');
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                            layer.close(popIndex);
                        })
                    } else {
                        initAjax('/amazonFBA/inboundShipment/updateOnlyOa.html', 'POST', JSON.stringify(req), function(returnData) {
                            layer.msg(returnData.msg || '更新OA商品成功');
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                            layer.close(popIndex);
                        })
                    }
                }
            }
            let popIndex = layer.open({
                type: 1,
                title: '货品详情',
                btn: btnArr,
                area: ['80%', '80%'],
                content: $('#pop_FBA_productDetail').html(),
                id: 'FBA_productDetailLayer',
                success: function(layero, index) {
                    $('#FBA_productDetailLayer').scroll(function() {
                        toFixedTabHead(this)
                    });
                    if (queryOL) {
                        initAjax('/amazonFBA/inboundShipment/detailOL.html', 'POST', JSON.stringify({ id: data.id }), function(returnData) {
                            showProdDetaiLTable(returnData.data.detail)
                        })
                    } else {
                        initAjax('/amazonFBA/inboundShipment/detail.html', 'POST', JSON.stringify({ id: data.oaShipId || data.id }), function(returnData) {
                            showProdDetaiLTable(returnData.data.detail)
                        })
                    }

                    $('#pop_FBA_productDetail_queryBtn').click(function() {
                        let sellerSku = $('#pop_FBA_productDetail_querySellerSku').val();
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
                    $('#pop_FBA_productDetail_copyFnSku').click(function (){
                        let dataList = table.cache.FBAdelivery_ProdDetailTable
                        let fnSkuList = []
                        for (let i = 0;i < dataList.length; ++i) {
                            fnSkuList.push(dataList[i].fnSku)
                        }
                        copyTxtToClipboard(fnSkuList.join(","));
                    })
                },
                yes: function(index, layero) {
                    fun1(popIndex)
                },
                end: function() {
                    layer.close(popIndex)
                }
            });
            let logTableData;
            $('#Fbadelivery_opLogPage').click(function() {
                if (logTableData) {
                    FBAdelivery_showLogTable(logTableData)
                } else {
                    let ajax = new Ajax(false);
                    ajax.post({
                        url: ctx + '/amazonFBA/inboundShipment/opLogList.html',
                        data: JSON.stringify({ pShipId: data.oaShipId || data.id }),
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
        }
        $('#FBAdelivery_updateLogisticsTypeBatch').click(function () {
            var data = table.checkStatus(FBAdelivery_currentTableName).data
            if (!data || !data.length || data.length === 0) {
                layer.msg('请选择要修改物流方式的货件')
                return
            }
            let idList = []
            for (let i = 0; i < data.length; i++) {
                idList.push(data[i].id)
            }
            let popIndex = layer.open({
                title: '修改物流方式',
                type: 1,
                area: ['30%', '50%'],
                btn: ['保存', '关闭'],
                content: $('#FBAdelivery_batchUpdateLogisticTypePop').html(),
                id: "FBAdelivery_batchUpdateLogisticTypeLayer",
                success: function() {
                    //初始化物流
                    initAjax("/amazonFBA/inboundShipment/getFbaLogistics.html", "POST", JSON.stringify(data.field), function(returnData) {
                        appendSelect($('#FBAdelivery_batchUpdateLogisticTypeForm [name=preLogisticsTypeId]'), returnData.data, 'id', 'name',null,'物流方式');
                        form.render('select');
                    })
                },
                yes: function() {
                    let Adata = {
                        shipIdList: idList,
                        logisticsTypeId: $('#FBAdelivery_batchUpdateLogisticTypeForm [name=preLogisticsTypeId]').val()
                    }
                    if (!Adata.logisticsTypeId) {
                        layer.msg('请选择物流方式')
                        return
                    }
                    oneAjax.post({
                        url: '/amazonFBA/batchUpdateLogisticsType',
                        data: Adata,
                        success: function (res) {
                            if (res.code === '0000') {
                                layer.msg('修改成功')
                                layer.close(popIndex)
                                refreshTable();
                            }
                        }
                    })
                }
            })
        })
        function FBAdelivery_showLogTable(data) {
            table.render({
                elem: '#FBAdelivery_shipLogTable',
                data: data,
                page: false,
                limit: data.length,
                id: "FBAdelivery_shipLogTable",
                cols: [
                    [
                        { title: '时间', templet: '<div>{{format(d.opTime,"yyyy-MM-dd hh:mm:ss")}}</div>', width: 200 },
                        { title: '操作人', field: 'opUserName', width: 150 },
                        { title: '操作类型', field: 'opType', width: 150 },
                        { title: '操作详情', templet: '<div>{{(d.sellerSku? (d.sellerSku + " * " + d.shipRelSkuNum) : "") + (d.remark || "" )}}</div>' }
                    ]
                ]
            })
        }

        function FBAdelivery_showInventoryDetail(tableData) {
            let popIndex = layer.open({
                type: 1,
                title: '新增货品',
                btn: ['新增', '关闭'],
                area: ['65%', '60%'],
                content: $('#pop_FBA_shipRelSkuDetailQuery').html(),
                success: function(index, layero) {
                    table.render({
                        elem: '#FBA_shipRelSkuDetailQueryTable',
                        data: tableData,
                        cols: [
                            [
                                { type: 'checkbox' },
                                { title: "图片", templet: '#FBA_shipRelSkuDetailQueryTable_img', width: 70 },
                                { title: "ASIN", field: "asin" },
                                { title: "FNSKU", field: "fnSku" },
                                { title: "店铺SKU", field: "sellerSku" },
                                { title: "商品SKU", field: "prodSSku" },
                                { title: "商品名称", templet: "<div>{{d.prodSInfo.title}}</div>" },
                                { title: "物流属性", templet: "<div>{{d.prodSInfo.logisAttrList}}</div>" },
                                { title: "开发专员", field: "bizzOwner" },
                                { title: "包装备注", field: "packDesc", templet: '#FBAdelivery_ProdDetailTable_packDesc' },
                            ]
                        ],
                        page: false,
                        limit: 500,
                        id: 'FBA_shipRelSkuDetailQueryTable'
                    })
                },
                yes: function() {
                    // 校验是否选择
                    var data = table.checkStatus('FBA_shipRelSkuDetailQueryTable').data;
                    if (!data || data.length === 0) {
                        layer.msg('请选择要增加的货品');
                        return false;
                    }
                    // 校验是否有重复的sellerSku
                    let tabInfo = table.cache.FBAdelivery_ProdDetailTable;
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
                    table.cache.FBAdelivery_ProdDetailTable = table.cache.FBAdelivery_ProdDetailTable.concat(addArr);
                        // 重新渲染货品列表
                    showProdDetaiLTable(table.cache.FBAdelivery_ProdDetailTable);
                        // 关闭弹窗
                    layer.close(popIndex)
                },
                end: function() {
                    layer.close(popIndex)
                }
            })
        }

        table.on('tool(FBAdelivery_ProdDetailTable)', function(obj) {
                let data = obj.data;
                let layEvent = obj.event;
                let thisTR = obj.tr; //tr的dom元素
                if (layEvent === 'deleteProd') { //修改发货数量
                    obj.del()
                }
            });
            /**
             * 渲染货件商品详情
             * @param tableData 商品数据列表
             * @param nowAllowDel 不允许删除   true则不展示删除按钮
             */
        function showProdDetaiLTable(tableData, notAllowDel) {
            table.render({
                elem: '#FBAdelivery_ProdDetailTable',
                data: tableData,
                cols: [
                    [
                        { title: "图片", templet: '#FBAdelivery_ProdDetailTable_img', width: 70 },
                        { title: "商品信息", field: "asin",templet: '#FBAdelivery_productInfo', width: 170 },
                        { title: "OA商品信息", field: "asin", templet: '#FBAdelivery_productInfo_OA', width: 180 },
                        { title: "商品名称", field: "title",width: 400 },
                        { title: '<div title="发货需求的计划发货数量">总计划发货数量<i class="layui-icon layui-icon-about"></i></div>', field: "totalRequireQty",width: 80 },
                        { title: "本货件数量", field: "originPlanQuality",templet:"#FBAdelivery_Detail_numTemp",width: 100 },
                        { title: "计划数量(点击可编辑)", field: "planQuality", edit: 'text', style: "background-color: #7FFFD4;",width: 80 },
                        { title: "实发数量", field: "actQuality", templet: '<div>{{d.actQuality || ""}}</div>',width: 80 },
                        { title: "FBA收货数量", field: "quantityReceived",width: 80 },
                        { title: '操作', align: 'center', toolbar: notAllowDel || '#FBAdelivery_ProdDetailTableBar', width: 200 }
                    ]
                ],
                page: false,
                limit: 500,
                id: 'FBAdelivery_ProdDetailTable'
            })
        }

        function packButton_unEditAble(data) {
            layer.open({
                type: 1,
                title: '装箱详情',
                btn: ["修改箱子规格", '关闭'],
                area: ['100%', '100%'],
                content: $('#pop_FBA_topack').html(),
                success: function(layero, index) {
                    printList(data.id, function(returnData) {
                        $('#FBAdelivery_ex_im_div').addClass('disN');
                        $('#FBA_confirmNumber').addClass('disN');
                        $('#FBA_confirmNumber_input').val(returnData.data.cartonNumber);

                        genCartonBox(returnData.data.cartonNumber, returnData.data.detail, returnData.data.detail, returnData.data.cartonInfo); //装箱详情

                        focus_location(table, layero, form);
                    })
                },
                yes: function(index, layero) {
                    //箱子的规格信息
                    var boxInfoTable_trList = $("#FBAdelivery_table_boxInfoTable").next().find('tbody');
                    var cartonInfo = {};
                    var weightList = [];
                    var lengthList = [];
                    var widthList = [];
                    var heightList = [];

                    var havaZero = false;
                    boxInfoTable_trList.find('tr').each(function(index, item) {
                        if (index == 0) { //重
                            //td里包含input的
                            $(item).find('td input.FBAdelivery_boxSize_input').each(function(index, tdInputItem) {
                                weightList.push($(tdInputItem).val());
                                if ($(tdInputItem).val() <= 0) {
                                    havaZero = true;
                                }
                            })
                        }
                        if (index == 1) { //长
                            $(item).find('td input.FBAdelivery_boxSize_input').each(function(index, tdInputItem) {
                                lengthList.push($(tdInputItem).val());
                                if ($(tdInputItem).val() <= 0) {
                                    havaZero = true;
                                }
                            })
                        }
                        if (index == 2) { //宽
                            $(item).find('td input.FBAdelivery_boxSize_input').each(function(index, tdInputItem) {
                                widthList.push($(tdInputItem).val());
                                if ($(tdInputItem).val() <= 0) {
                                    havaZero = true;
                                }
                            })
                        }
                        if (index == 3) { //高
                            $(item).find('td input.FBAdelivery_boxSize_input').each(function(index, tdInputItem) {
                                heightList.push($(tdInputItem).val());
                                if ($(tdInputItem).val() <= 0) {
                                    havaZero = true;
                                }
                            })
                        }
                    });
                    if (havaZero) {
                        layer.msg("重长宽高必填,且不能为0", { icon: 2 });
                        return;
                    }
                    cartonInfo.weightList = weightList;
                    cartonInfo.lengthList = lengthList;
                    cartonInfo.widthList = widthList;
                    cartonInfo.heightList = heightList;

                    initAjax('/amazonFBA/inboundShipment/editCarton.html', 'POST', JSON.stringify({ cartonInfo: cartonInfo, id: data.id, cartonNumber: widthList.length }), function(returnData) {
                        layer.msg(returnData.msg || "修改成功");
                    })
                }
            })
        }

        function popToChangeLogisticsType(data) {
            layer.open({
                type: 1,
                title: '修改箱子物流',
                btn: ['确认修改', '关闭'],
                area: ['65%', '60%'],
                content: $('#FBAdelivery_carton_setLogistics_tpl').html(),
                success: function(index, layero) {
                    //初始化物流
                    initAjax("/amazonFBA/inboundShipment/getFbaLogistics.html", "POST", JSON.stringify({}), function(returnData) {
                        appendSelect($('#FBAdelivery_carton_setLogistics_tpl_form select[name=logisticsTypeId]'), returnData.data, 'id', 'name', true);
                        //如果已经取值,则赋值
                        if (data) {
                            $('#FBAdelivery_carton_setLogistics_tpl_form select[name=logisticsTypeId]').val(data.preLogisticsTypeId);
                        }
                        form.render('select');
                    })
                },
                yes: function(index, layero) {
                    setPreLogisticsType(data);
                    layer.close(index);
                }
            })
        }

        //申请运单号
        function popApplyWaybillNumber() {
            var data = table.checkStatus('FBAdelivery_table_freightTable').data;
            if (!data || data.length === 0) {
                layer.msg('请选择要申请运单的箱子');
                return false;
            }
            var acctIds = [];
            for (var index in data) {
                acctIds.push(data[index].id);
            }
            //请求接口
            commonReturnPromise({
                url: '/lms/amazonFBA/auto/getTrackingNo.html',
                params: "ids=" + acctIds
            }).then(function(result) {
                let tabInfo = table.cache.FBAdelivery_table_freightTable;
                for (let i = 0; i < tabInfo.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (data[j].id === tabInfo[i].id) {
                            tabInfo[i].freightNum = result;
                        }
                    }
                }
                packTable(tabInfo, 'FBAdelivery_table_freightTable');
            })
        }



        function setPreLogisticsType(data) {
            let tabInfo = table.cache.FBAdelivery_table_freightTable;
            let logisticsTypeId = $('#FBAdelivery_carton_setLogistics_tpl_form select[name=logisticsTypeId]').val();
            let logisticsTypeName = $('#FBAdelivery_carton_setLogistics_tpl_form select[name=logisticsTypeId]').find("option:selected").text();
            let trackingNoPrefix = $('#FBAdelivery_carton_setLogistics_tpl_form select[name=logisticsTypeId]').find("option:selected").attr('data-trackingNoPrefix');
            if (data) {
                for (var i = 0; i < tabInfo.length; i++) {
                    if (tabInfo[i].id == data.id) {
                        tabInfo[i].logisticsTypeId = logisticsTypeId;
                        tabInfo[i].logisticsTypeName = logisticsTypeName;
                        tabInfo[i].trackingNoPrefix = trackingNoPrefix
                    }
                }
            } else {
                for (let i = 0; i < tabInfo.length; i++) {
                    tabInfo[i].logisticsTypeId = logisticsTypeId;
                    tabInfo[i].logisticsTypeName = logisticsTypeName
                }
            }
            packTable(tabInfo, 'FBAdelivery_table_freightTable');
        }

        function FbaDelivery_printCombDetail(data) {
            let printList = [];
            for (let i = 0; i < data.length; ++i) {
                let printOne = {
                    titleMap: {
                        shipmentId: data[i].shipmentId,
                        boxCode: data[i].boxCode
                    },
                    amount: 1
                };
                let skuList = [];
                let locationList = [];
                let numList = [];
                for (let j = 0; j < data[i].combSkuList.length; j++) {
                    skuList.push(data[i].combSkuList[j].prodSSku);
                    locationList.push(data[i].combSkuList[j].locationCode || '');
                    numList.push(data[i].combSkuList[j].amount)
                }
                printOne.titleMap.skuList = skuList;
                printOne.titleMap.locationList = locationList;
                printOne.titleMap.numList = numList;
                printList.push(printOne)
            }
            let printDto = {
                jspaper: 'fbaCombDetail.jasper',
                printDetailDtoList: printList
            };
            printStandard(printDto)
        }

        function FbaDelivery_printCombBox(data) {
            let printList = [];
            for (let i = 0; i < data.length; ++i) {
                let printOne = {
                    titleMap: {
                        shipmentId: data[i].shipmentId,
                        boxCode: data[i].boxCode,
                        planQuality: data[i].planQuality,
                        shipBoxCode: data[i].shipBoxCode,
                        combStyle: data[i].combStyle,
                    },
                    amount: 1
                };
                printList.push(printOne)
            }
            let printDto = {
                jspaper: 'fbaCombBoxCodeLabel.jasper',
                printDetailDtoList: printList
            };
            printStandard(printDto)
        }

        //补充发货地址
        form.on('submit(FBAdelivery_createDHL_form_submit)', function(data) {
            initAjax('/amazonFBA/inboundShipment/createDHL.html', 'POST', JSON.stringify({ cartonIdList: cartonIdList, dhlParamMap: data.field }), function(returnData) { //addressType:1 FBA地址
                //根据响应回显列表
                layer.alert(returnData.msg || "创建DHL成功");
                layer.close(createDHL_deal_edit_index);
                //成功后,需要重载表格,不让二次生成
                var allTableDate = table.cache.FBAdelivery_table_recommPackTable;
                for (var j = 0; j < allTableDate.length; j++) {
                    if (cartonIdList.indexOf(allTableDate[j].id) >= 0) { //匹配的id列表用于生成DHL订单
                        allTableDate[j].freightNum = returnData.data.dhlFreightNum; //
                        allTableDate[j].haveFreight = true;
                    }
                }
                packTable(allTableDate, 'FBAdelivery_table_recommPackTable')
            });

        });

        // 导出
        $('#FBAdelivery_exportSSkuInfo').click(function() {
            var outerIndex = layer.open({
                title: '导出配货信息',
                type: 1, //不加该属性,就会出现[object Object]
                area: ['1266px', '600px'],
                id: 'FBAdelivery_exportSSkuLayer',
                btn: ['确定', '关闭'],
                content: $('#FBAdelivery_exportSSkuPop').html(),
                success: function() {
                    form.on('checkbox(FBAdelivery_selectAll_exportySSku)', function(data) {
                        var checked = data.elem.checked;
                        $('#FBAdelivery_exportSSkuForm input[type=checkbox]:enabled').prop('checked', checked);
                        form.render('checkbox')
                    });
                    form.render('checkbox')
                },
                yes: function() {
                    let data = serializeObject($('#FBAdelivery_exportSSkuForm'));
                    let searchParam = serializeObject($('#FBAdeliveryForm'));

                    searchParam.skuSalespersonIdList = searchParam.skuSalespersonIdList ? searchParam.skuSalespersonIdList.split(',') : []
                    searchParam.logisticsTypeIdList = searchParam.logisticsTypeIdList ? searchParam.logisticsTypeIdList.split(',') : null
                    if (!searchParam.logisticsTypeIdList && searchParam.logisticsCompanyNameList) {
                        searchParam.logisticsTypeIdList = []
                        let optionList = $('#FBAdelivery_companyNameList option')
                        if (optionList && optionList.length) {
                            for (let i = 0; i < optionList.length; ++i) {
                                searchParam.logisticsTypeIdList.push(optionList[i].getAttribute('value'))
                            }
                        }
                    }

                    searchParam[searchParam.skuType] = searchParam.sku;
                    if (searchParam.time) {
                        searchParam.startTime = searchParam.time.split(' - ')[0] + ' 00:00:00';
                        searchParam.endTime = searchParam.time.split(' - ')[1] + ' 23:59:59';
                    }

                    checkNull(searchParam);
                    data.searchParam = JSON.stringify(searchParam);
                    let confirmindex = layer.confirm('确认导出当前搜索条件下的配货信息?', { btn: ['确认', '取消'] }, function() {
                        submitForm(data, ctx + '/amazonFBA/exportSSkuList.html', "_blank")
                        layer.close(confirmindex)
                    })
                }
            })
        });

        //监听排序
        table.on('sort(FBAdelivery_table_deliveryPlan)', function(obj) {
            let field = obj.field === 'planQuality' ? 'plan_quality' : obj.field
            $('#FBAdeliveryForm input[name="orderBy"]').val(field + ' ' + obj.type);
            currentScrollPosition = $('.layui-show')[0].scrollTop
            refreshTable()
                // }
        });

        //标记发货
        function markDeliver(data, doOA, type = '') {
            layer.open({
                type: 1,
                title: '标记发货',
                btn: ['标记发货', '关闭'],
                area: ['500px', '400px'],
                content: $('#pop_FBA_markDeliery').html(),
                success: function(layero, index) {
                    form.render('radio', 'pop_FBA_markDelieryForm');
                    form.render('select', 'pop_FBA_markDelieryForm');
                    form.on('radio(FBA_markDeliery_shippingMethod)', function(obj) {
                        if (obj.value === 'LTL') {
                            $('#FBAdelivery_proNumberDiv').show()
                        } else {
                            $('#FBAdelivery_proNumberDiv').hide()
                        }
                    })
                },
                yes: function(index, layero) {
                    let dForm = $('#pop_FBA_markDelieryForm');
                    let idList = []
                    if (type === 'batch') {
                        for (let i = 0; i < data.length; i++) {
                            idList.push(data[i].id)
                        }
                    }
                    let Adata = {
                        doOA: doOA,
                        shippingMethod: dForm.find('[name=shippingMethod]:checked').val(),
                        carrierName: dForm.find('[name=carrierName]').val(),
                        proNumber: dForm.find('[name=proNumber]').val()
                    };
                    if (type === 'batch') {
                        Adata.idList = idList
                        initAjax('/amazonFBA/inboundShipment/batchInboundShipmentSetShipped', 'POST', JSON.stringify(Adata), function(returnData) {
                            layer.msg(returnData.msg || '标记发货成功');
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                            layer.close(index)
                        })

                    } else {
                        Adata.id = data.id
                        initAjax('/amazonFBA/inboundShipment/setShipped.html', 'POST', JSON.stringify(Adata), function(returnData) {
                            layer.msg(returnData.msg || '标记发货成功');
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable();
                            layer.close(index)
                        })
                    }
                }
            })
        }
        //装箱。
        function packButton(data, doOA) { //如果是为了给OA状态页签展示
            layer.open({
                type: 1,
                title: '装箱',
                btn: ['提交', '关闭'],
                area: ['100%', '100%'],
                content: $('#pop_FBA_topack').html(),
                success: function(layero, index) {
                    printList(data.id, function(returnData) {
                        if (returnData.data.cartonNumber == 0) { //没有装箱信息
                            $('#FBA_confirmNumber_input').val(1);
                            genCartonBox(1, returnData.data.detail, null, null); //初始化时只有一个箱子
                        } else {
                            $('#FBA_confirmNumber_input').val(returnData.data.cartonNumber);
                            genCartonBox(returnData.data.cartonNumber, returnData.data.detail, returnData.data.detail, returnData.data.cartonInfo); //装箱详情
                        }
                        $('#FBA_confirmNumber').click(function() {
                            var number = Number($(this).siblings('input').val());
                            //箱子展示表格(箱子内容和大小)
                            genCartonBox(number, returnData.data.detail, null, null);
                        });
                        // 新增箱子
                        $('#FBAdelivery_AddBoxBtn').click(function() {
                                let shipInfo = FBAdelivery_getShipBoxInfo(true);
                                let cartonInfo = FBAdelivery_getBoxInfo(true);
                                let cartonNum = $('#FBA_confirmNumber_input').val();
                                if (!cartonNum) {
                                    cartonNum = 0
                                }
                                $('#FBA_confirmNumber_input').val(++cartonNum);
                                genCartonBox(cartonNum, returnData.data.detail, shipInfo, cartonInfo);
                            });
                            //导入
                        upload.render({ //允许上传的文件后缀
                            elem: '#FBAdelivery_excelImport',
                            url: ctx + '/amazonFBA/inboundShipment/uploadPackageTemp.html',
                            accept: 'file', //普通文件
                            exts: 'xls|xlsx', //只允许上传excel文件
                            before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                                layui.admin.load.show();
                            },
                            done: function(res) {
                                layui.admin.load.hide();
                                if (res.code == "0000") {
                                    //回显
                                    $("#FBAdelivery_cartonDiv input[name=boxNum]").val(res.data.cartonNumber);
                                    genCartonBox(res.data.cartonNumber, returnData.data.detail, res.data.shipInfo, res.data.cartonInfo); //来自导入
                                } else {
                                    layer.msg(returnData.msg, { icon: 2 });
                                }

                            }
                        });

                        //下载模板
                        $('#FBAdelivery_excelExport').click(function() {
                            submitForm(null, ctx + '/amazonFBA/inboundShipment/downPackageTemp.html?id=' + data.id);
                        });

                        $("#FBAdelivery_table_packInfoTable").next().find('tbody').find("td[data-field ^= 'boxNumber'] input").blur(function() {
                            var datafield = $(this).parents('td').attr('data-field');
                            if ($(this).val() !== "") {
                                var tr = $(this).parents('tr');
                                tr.find('td[data-field="totalAmount"] div').text(calculateActualTotal(tr));
                                columnsum(datafield, '2');
                                columnsum('totalAmount', '1')
                            } else {
                                $(this).val(0);
                                layer.msg('商品数量不能为空')
                            }
                        });
                        focus_location(table, layero, form);
                    })
                },
                yes: function(index, layero) {
                    var cartonNumber = Number($('input[name="boxNum"]').val()); //箱子数量
                    // 装箱详情
                    let shipInfo = FBAdelivery_getShipBoxInfo();
                    if (!shipInfo) {
                        return
                    }
                    //箱子的规格信息
                    var cartonInfo = FBAdelivery_getBoxInfo();
                    if (!cartonInfo) {
                        return
                    }
                    var { id, shipmentId } = data;
                    var packInfoTabledata = table.cache.FBAdelivery_table_packInfoTable;
                    if (shipInfo.length === packInfoTabledata.length) {
                        $(layero).find('.layui-layer-btn0').attr("disabled", true).css({
                            "pointer-events": "none",
                            "background": "grey",
                            "border-color": "gray"
                        });
                        submitPack({ cartonNumber, shipInfo, cartonInfo, id, shipmentId, doOA },
                            function(returnData) {
                                //提交一次后,按钮失效
                                $(layero).find('.layui-layer-btn0').attr("disabled", false).css({
                                    "pointer-events": "auto",
                                    "background": "#1E9FFF",
                                    "border-color": "#1E9FFF"
                                });
                                layer.msg(returnData.msg || '装箱成功');
                                // 装箱成功后打印箱唛
                                //先请求生成
                                printCartonLabel(data.id, function(res) {
                                    // 直接打印箱唛
                                    let obj = {};
                                    obj.printType = 100;
                                    obj.url = res.msg;
                                    obj.width = 297;
                                    obj.height = 210;
                                    obj.amount = data.caseLabelNum;
                                    obj.FBACaseLabelPrint = 'FBACaseLabelPrint'
                                    commonPrintRequest(obj, true)
                                })
                                layer.close(index);
                                currentScrollPosition = $('.layui-show')[0].scrollTop
                                refreshTable()
                            },
                            function(returnData) {
                                $(layero).find('.layui-layer-btn0').attr("disabled", false).css({
                                    "pointer-events": "auto",
                                    "background": "#1E9FFF",
                                    "border-color": "#1E9FFF"
                                })
                            })
                    }
                }
            })
        }

        // 获取装箱情况
        function FBAdelivery_getShipBoxInfo(notCheck) {
            var shipInfo = [];
            var layFilterIndex = 'LAY-table-' + packInfoTableIns.config.index;
            var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
            var packInfoTabledata = table.cache.FBAdelivery_table_packInfoTable;
            //todo 可以优化,不想弄,以后有机会的吧
            tableContainer.find('tr').each(function(index, item) {
                var totalAmount = Number($(item).find('td[data-field="totalAmount"] div').text() || '0');
                var shipInfoitem = {};
                if (index > 0 && index <= packInfoTabledata.length) {
                    if (!notCheck && totalAmount !== packInfoTabledata[index - 1].planQuality) {
                        layer.msg('请保证总数量与待装箱数量一致');
                        return false;
                    }
                    shipInfoitem = packInfoTabledata[index - 1];
                    shipInfoitem.quantityShippedList = getBoxDetail(item);
                    shipInfo.push(shipInfoitem)
                }
            });
            return shipInfo
        }
        // 获取箱子信息 
        function FBAdelivery_getBoxInfo(notCheck) {
            var boxInfoTable_trList = $("#FBAdelivery_table_boxInfoTable").next().find('tbody');
            var cartonInfo = {};
            var weightList = [];
            var lengthList = [];
            var widthList = [];
            var heightList = [];

            var havaZero = false;
            boxInfoTable_trList.find('tr').each(function(index, item) {
                if (index == 0) { //重
                    //td里包含input的
                    $(item).find('td input.FBAdelivery_boxSize_input').each(function(index, tdInputItem) {
                        weightList.push($(tdInputItem).val());
                        if ($(tdInputItem).val() <= 0) {
                            havaZero = true;
                        }
                    })
                }
                if (index == 1) { //长
                    $(item).find('td input.FBAdelivery_boxSize_input').each(function(index, tdInputItem) {
                        lengthList.push($(tdInputItem).val());
                        if ($(tdInputItem).val() <= 0) {
                            havaZero = true;
                        }
                    })
                }
                if (index == 2) { //宽
                    $(item).find('td input.FBAdelivery_boxSize_input').each(function(index, tdInputItem) {
                        widthList.push($(tdInputItem).val());
                        if ($(tdInputItem).val() <= 0) {
                            havaZero = true;
                        }
                    })
                }
                if (index == 3) { //高
                    $(item).find('td input.FBAdelivery_boxSize_input').each(function(index, tdInputItem) {
                        heightList.push($(tdInputItem).val());
                        if ($(tdInputItem).val() <= 0) {
                            havaZero = true;
                        }
                    })
                }
            });
            if (!notCheck && havaZero) {
                layer.msg("重长宽高必填,且不能为0", { icon: 2 });
                return false;
            }
            cartonInfo.weightList = weightList;
            cartonInfo.lengthList = lengthList;
            cartonInfo.widthList = widthList;
            cartonInfo.heightList = heightList;
            return cartonInfo;
        }

        // 定位
        function focus_location(table, layero, form) {
            $('#FBAdelivery_setscroll').click(function() {
                var locateType = $('#FBAdelivery_setscroll_form select[name=locateType]').val();
                var locateValue = $('#FBAdelivery_setscroll_form input[name=locateValue]').val();
                if (locateValue) {
                    //获取表数据的行号
                    var locateIndex = null;
                    var packInfoTabledata = table.cache.FBAdelivery_table_packInfoTable;
                    packInfoTabledata.forEach(function(item) {
                        if (item[locateType] == locateValue) {
                            locateIndex = item.LAY_TABLE_INDEX;
                        }
                    });

                    var postDom = $('#FBAdelivery_table_packInfoTable').next().find('tbody tr[data-index="' + locateIndex + '"]');
                    $(layero.selector + " .layui-layer-content").scrollTop(
                        $(layero.selector + " .layui-layer-content").scrollTop() +
                        postDom.offset().top -
                        $(layero.selector + " .layui-layer-content").offset().top);
                }
            });
            form.render();
        }

        function printCartonLabel(id, func) {
            initAjax('/amazonFBA/inboundShipment/genPrintCartonLabel.html', 'POST', JSON.stringify({ id: id }), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }

        // 重新计算抛重、抛重实重比
         FBAdelivery_calThrowWeight = function(self) {
            let boxIndex = $(self).attr('data-boxindex')
            let inps = $('[data-boxindex='+ boxIndex + ']')
            // 获取重量inp 和尺寸 inps
            let weightInp,
                sizeInps = []
            for (let i = 0; i < inps.length; ++i) {
                let curInp = inps[i]
                let tr = $(curInp).closest('tr')
                let text = tr.text()
                if (text.lastIndexOf('重量') > 0) {
                    weightInp = curInp
                } else {
                    sizeInps.push(curInp)
                }
            }
            // 计算抛重
            let throwWeight = 1
            // 校验数据
            for (let i = 0; i < sizeInps.length; ++i) {
                let curInp = sizeInps[i]
                if (!isNumber(curInp.value)) {
                    return
                }
                throwWeight *= curInp.value
            }
            throwWeight = (throwWeight / 5000).toFixed(2)
            $('#FBAdelivery_box_throwWeightSpan_' + boxIndex).text(throwWeight)
            // 计算抛重/ 实重
            if (!weightInp|| !isNumber(weightInp.value) || weightInp.value === '0') {
                $('#FBAdelivery_box_weightRateSpan_' + boxIndex).text(0)
                return
            }
            let weightRate = (throwWeight / weightInp.value).toFixed(2)

            $('#FBAdelivery_box_weightRateSpan_' + boxIndex).text(weightRate)
        }

        /**
         * 箱子展示
         * @param obj
         * @param number
         * @param data sku信息(包含sku的(箱子sku数量)列表)
         * @param packInfoTableIns
         * @param shipInfo 初始箱子信息-sku列表,每个sku中包含装箱列表
         * @param cartonInfo 初始箱子信息-箱子长宽重信息
         */
        function genCartonBox(number, data, shipInfo, cartonInfo) { //returnData.data
            if (number > 0) {
                var boxAdd = [];
                var sizeAdd = [];
                //添加对应数量的箱子
                for (var i = 0; i < number; i++) {
                    var boxTitleFix = "";
                    if (cartonInfo) {
                        let throwWeight = (cartonInfo.lengthList[i] * cartonInfo.widthList[i] * cartonInfo.heightList[i]) / 5000
                        boxTitleFix = '<div>抛重/实重比:<span id="FBAdelivery_box_weightRateSpan_'+ i +'">' + (throwWeight / cartonInfo.weightList[i]).toFixed(2) + '</span></div>';
                        boxTitleFix += '<div>抛重: <span id="FBAdelivery_box_throwWeightSpan_'+ i +'">' + throwWeight.toFixed(2) + '</span></div>'
                    } else {
                        boxTitleFix = '<div>抛重/实重比:<span id="FBAdelivery_box_weightRateSpan_'+ i +'">' + 0 + '</span></div>';
                        boxTitleFix += '<div>抛重: <span id="FBAdelivery_box_throwWeightSpan_'+ i +'">' + 0 + '</span></div>'
                    }
                    sizeAdd.push({
                        title: "箱子" + (i + 1),
                        field: "boxNumber" + (i + 1),
                        width: 80,
                        templet: `<div><input type="number" class="layui-input" value="{{d.boxNumber` + (i + 1) + `||0}}" min="0" oninput="this.value = this.value.replace(/[^0-9]/g, '');"></div>`
                    });
                    boxAdd.push({
                        title: "箱子" + (i + 1) + boxTitleFix,
                        field: "boxNumber" + (i + 1),
                        width: 80,
                        templet: `<div><input type="number" onchange="FBAdelivery_calThrowWeight(this)" data-boxindex="`+ i +`" class="layui-input FBAdelivery_boxSize_input" value="{{d.boxNumber` + (i + 1) + `||0}}" min="0"></div>`
                    })
                }
                sizeAdd.push({ title: '···' });
                boxAdd.push({ title: '···' });
                tablecol.FBAdelivery_table_packInfoTable[0].splice(3, tablecol.FBAdelivery_table_packInfoTable[0].length - 4, ...sizeAdd);
                tablecol.FBAdelivery_table_boxInfoTable[0].splice(2, tablecol.FBAdelivery_table_boxInfoTable[0].length - 3, ...boxAdd);

                //重新组织箱子样式信息
                //由于箱子只要三行数据
                var boxSizeData = [];
                var boxSize_weight = {};
                var boxSize_length = {};
                var boxSize_width = {};
                var boxSize_height = {};
                boxSize_weight.customSizeName = "重量";
                boxSize_weight.customSizeDesc = "重量(kg)";
                boxSize_length.customSizeName = "长";
                boxSize_length.customSizeDesc = "长(cm)";
                boxSize_width.customSizeName = "宽";
                boxSize_width.customSizeDesc = "宽(cm)";
                boxSize_height.customSizeName = "高";
                boxSize_height.customSizeDesc = "高(cm)";
                //todo boxsize的回显
                if (shipInfo || cartonInfo) { //箱子的尺寸需要设置
                    // boxSize_height["boxNumber"+1]=12;
                    //重写下方回显
                    // 匹配sku,遍历tr,设置数量,并且发起统计
                    if (shipInfo) {
                        var sellerSku2numList = new Map(); //sku的装箱列表
                        for (var i = 0; i < shipInfo.length; i++) {
                            sellerSku2numList.set(shipInfo[i].sellerSku, shipInfo[i].quantityShippedList);
                        }
                        for (var i = 0; i < data.length; i++) { //填装sku的数量
                            var num2InPackList = sellerSku2numList.get(data[i].sellerSku);
                            if (num2InPackList) {
                                for (j = 0; j < num2InPackList.length; j++) {
                                    data[i]["boxNumber" + (j + 1)] = num2InPackList[j];
                                }
                            }
                        }
                    }
                    //填装箱子的尺寸
                    if (cartonInfo) { //
                        if (cartonInfo.weightList) {
                            var weightListTmp = cartonInfo.weightList;
                            for (var m = 0; m < weightListTmp.length; m++) {
                                boxSize_weight["boxNumber" + (m + 1)] = weightListTmp[m];
                            }
                        }
                        if (cartonInfo.lengthList) {
                            var lengthListTmp = cartonInfo.lengthList;
                            for (var m = 0; m < lengthListTmp.length; m++) {
                                boxSize_length["boxNumber" + (m + 1)] = lengthListTmp[m];
                            }
                        }
                        if (cartonInfo.widthList) {
                            var widthListTmp = cartonInfo.widthList;
                            for (var m = 0; m < widthListTmp.length; m++) {
                                boxSize_width["boxNumber" + (m + 1)] = widthListTmp[m];
                            }
                        }
                        if (cartonInfo.heightList) {
                            var heightListTmp = cartonInfo.heightList;
                            for (var m = 0; m < heightListTmp.length; m++) {
                                boxSize_height["boxNumber" + (m + 1)] = heightListTmp[m];
                            }
                        }
                    }
                }
                packTable(data, 'FBAdelivery_table_packInfoTable', function(callback) {
                    packInfoTableIns = callback;
                    columnsum('planQuality', '1'); //第一列
                    for (var i = 0; i < number; i++) { //刷新了列
                        columnsum('boxNumber' + (i + 1), '2')
                    }
                    //刷新行
                    $("#FBAdelivery_table_packInfoTable").next().find('tbody').find('tr').each(function(index, item) { //最后行
                        $(item).find('td[data-field="totalAmount"] div').text(calculateActualTotal(item))
                    });
                    columnsum('totalAmount', '1') //最后列
                }, true);


                boxSizeData.push(boxSize_weight, boxSize_length, boxSize_width, boxSize_height);
                packTable(boxSizeData, 'FBAdelivery_table_boxInfoTable', function(callback) {}, false);
                //失去焦点,计算行列统计
                $("#FBAdelivery_table_packInfoTable").next().find('tbody').find("td[data-field ^= 'boxNumber'] input").blur(function() {
                    var datafield = $(this).parents('td').attr('data-field');
                    if ($(this).val() !== "") {
                        var tr = $(this).parents('tr');
                        tr.find('td[data-field="totalAmount"] div').text(calculateActualTotal(tr));
                        columnsum(datafield, '2');
                        columnsum('totalAmount', '1')
                    } else {
                        $(this).val(0);
                        layer.msg('商品数量不能为空')
                    }
                })
            } else {
                layer.msg("箱子数量需要大于0")
            }
        }

        function fab_shipmentSku_print(data) { //打印标签//批量
            epeanPrint_plugin_fun(5, data); //打印fn_sku信息（50mm*25mm）
        }

        function getBoxDetail(tr) { //获取每个箱子商品数量详情
            var quantityShippedList = [];
            $(tr).find("td[data-field^='boxNumber']").find('input').each(function(index, item) {
                quantityShippedList.push($(item).val())
            });
            return quantityShippedList
        }

        // 纵向合计
        function columnsum(datafield, type) {
            var amount = 0;
            $('.pack_layer .layui-table-box').find('td[data-field="' + datafield + '"]').each(function(index, item) {
                if (type === '1') {
                    if (datafield === 'planQuality') {
                        amount += Number($(item).find('.planQuality').text())
                    } else {
                        amount += Number($(item).find('div').text())
                    }
                } else {
                    amount += Number($(item).find('div input').val())
                }
            });
            $("#FBAdelivery_table_packInfoTable").next().find('.layui-table-total td[data-field="' + datafield + '"] div').text(amount)
        }

        // 横向合计
        function calculateActualTotal(tr) { //计算装箱实际总数量
            var amount = 0;
            $(tr).find("td[data-field^='boxNumber']").find('input').each(function(index, item) {
                amount += Number($(item).val());
            });
            return amount;
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
            console.log(data)
            return statisticInfo
        }
        function packTable(data, tablename, func, totalRow) {
            if (tablename === 'FBAdelivery_table_createGoodsTable') {
                let planQualitySum = data && data.reduce((sum, item) => sum + item.planQuality, 0);
                let tableItem = tablecol[tablename][0];
                let statisticInfo = calTotalWeightAndThrowWeight(data)
                for (let i = 0; i < tableItem.length; i++) {
                    if (tableItem[i].field === 'prodSSku') {
                        tableItem[i].totalRowText = '总SKU计数: ' + data.length
                    }
                    if (tableItem[i].field === 'storeAcct') {
                        tableItem[i].totalRowText = '总实重: ' + statisticInfo.totalWeight + ';总抛重:' + statisticInfo.totalThrowWeight
                    }
                    if (tableItem[i].field === 'planQuality') {
                        tableItem[i].totalRowText = String(planQualitySum)
                    }
                }
            }
            if (tablename === 'FBAdelivery_table_submitGoodsTable') {
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
                    //zhao

                    tableMerge.render(this); //合并列单元格，根据merge：""相等进行分组合并
                }
            });
            if (func) {
                func(tableIns)
            }
        }

    //填充下拉框
    function appendSelectForSaleLogisticType(dom, data, id, name, trackingNoPrefix,defaultShowText) {
        $(dom).empty();
        var option = '<option value="">'+ (defaultShowText || '站点') + '</option>';
        for (var i in data) {
            data[i].id = data[i].id || data[i][id];
            data[i].name = data[i].saleLogisticsTypeName || data[i][saleLogisticsTypeName];
            option += '<option value="' + data[i].id + '" data-trackingNoPrefix="' + data[i].trackingNoPrefix + '">' + data[i].name + '</option>'
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

        // //填充部门多级下拉框
        // function appendSelectOrg(pre, dom, data, id, name, children) {
        //     $('#' + pre + ' #' + dom + '').empty();
        //     var option = '<option value="">请选择</option>'
        //     getmultiOption(0, option, data, id, name, children)
        //     $('#' + pre + ' #' + dom + '').append(option)
        // }

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
            var find = $('#FBAdelivery_label').find('[data-index=FBAdelivery_table_apiInfo]');
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
                content: [$('#FBAdelivery_updatePackDesc_pop').html(), self], //数组第二项即吸附元素选择器或者DOM
                // id: 'FBAhistory_updatePackDescLayer',
                success: function() {
                    let tabInfo = table.cache.FBAdelivery_ProdDetailTable;
                    wangEditorRender('FBAdelivery_packDescEdit', tabInfo[index].packDesc);
                }
            });
            self.setAttribute('data-tipId', tipsIndex)
        };

        // 根据货件编号同步货件
        $('#FBAdelivery_syncByShipmentIdList').click(function() {
            var data = table.checkStatus(FBAdelivery_currentTableName).data;
            if (!data || !data.length || data.length === 0) {
                layer.msg('请选择要同步的货件');
                return
            }
            let idList = [];
            for (let i = 0; i < data.length; i++) {
                idList.push(data[i].id)
            }
            var outerIndex = layer.confirm('确认同步这些货件信息？', { btn: ['确认', '取消'] }, function() {
                let Adata = { idList: idList };
                let ajax = new Ajax();
                ajax.post({
                    url: ctx + "/amazonFBA/inboundShipment/syncByShipmentId.html",
                    data: JSON.stringify(Adata),
                    success: function(data) {
                        if (data.code === '0000') {
                            layer.msg('同步成功');
                            currentScrollPosition = $('.layui-show')[0].scrollTop
                            refreshTable()
                        }
                    }
                });
                layer.close(outerIndex)
            })
        })
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
// 表格固定的处理
(function() {
    $("#FBAdelivery_importTransferNum").click(function() {
        $("#FBAdelivery_importTransferNumFile").click()
    });

    $('#FBAdelivery_importTransferNumFile').on('change', function() {
        var files = $('#FBAdelivery_importTransferNumFile')[0].files;
            // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name;
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != '.xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件');
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        layer.confirm('确认导入转单号吗', { btn: ['确认', '取消'] },
            function() {
                loading.show();
                $.ajax({
                    url: ctx + '/amazonFBA/importTransferNum.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(res) {
                        $('#FBAdelivery_importTransferNumFile').val('');
                        loading.hide();
                        if (res.code === '0000') {
                            layer.alert('导入成功')
                        } else {
                            layer.alert(res.msg)
                        }
                    },
                    error: function() {
                        loading.hide();
                        $('#FBAdelivery_importTransferNumFile').val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })
})();
