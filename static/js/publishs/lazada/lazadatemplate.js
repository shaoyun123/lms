// console.log("lazadatemplate");
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'laypage', 'laydate','layCascader'], function() {
    var form = layui.form,
        admin = layui.admin,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        laypage = layui.laypage,
    layCascader = layui.layCascader,
    table = layui.table;

    function saveLazadaTableData(){
        app.newData.tableData = app.getTableEditData(app.newData.tableData, app.newData.tableIns)
        let tableData = deepCopy(app.newData.tableData)
        $("#propertyTable").next().find("[data-field=lazadaTempAddAttr]").each(function(indexP){ //遍历所有input
            $(this).find(".lazadatemplateinputfocus").each(function(indexC,item){
                tableData[indexP-1]["salePropAttrList"][indexC]["attributeName"] = $(item).val();
                tableData[indexP-1]["salePropAttrList"][indexC]["attributeLabel"] = $(item).val()
            })
            $(this).find(".lazadatemplateinputvaluefocus").each(function(indexC,item){
                tableData[indexP-1]["salePropAttrList"][indexC]["attributeValue"] = $(item).val()
            })
        })
        return tableData
    }

    // 新增变种属性
    $(document).off("click", "button[name=lazadaTempAddAttr]").on("click", "button[name=lazadaTempAddAttr]", function (e) {
        // app.newData.tableData = app.getTableEditData(app.newData.tableData, app.newData.tableIns)
        let tableData = saveLazadaTableData()

        for (let i = 0; i < tableData.length; i++) {
            let obj = {
                "attributeLabel": "",
                "attributeName": "",
                "attributeValue":"",
                "tempSku":tableData[i].tempSku,
                "isMandatory": false
            }

            tableData[i]["salePropAttrList"].push(obj)
        }
        app.newData.tableData = tableData
        app.tablerender(tableData, properTablecols, 'propertyTable', function (tableIns) {
            app.newData.tableIns = tableIns
            $("button[name=lazadaTempAddAttr]").show()
        })

    })

    // // 监听sku信息表变种属性列的key值
    // $(document).on("blur", ".lazadatemplateinputfocus", function (e) {
    //     let value = $(e.target).val(),attr = $(e.target).attr("name"); // value
    //
    //     app.newData.tableData = app.getTableEditData(app.newData.tableData, app.newData.tableIns)
    //     let tableData = deepCopy(app.newData.tableData)
    //     let index = $(e.target).parents('tr').index()
    //     tableData[index].salePropAttrList[$(e.target).parents(".layui-form-item").index()]["attributeName"] = value
    //     tableData[index].salePropAttrList[$(e.target).parents(".layui-form-item").index()]["attributeLabel"] = value
    //     app.newData.tableData = tableData
    //     app.tablerender(tableData, properTablecols, 'propertyTable', function(tableIns) {
    //         app.newData.tableIns = tableIns
    //     })
    // })
    //
    // // 监听value
    // $(document).on("blur", ".lazadatemplateinputvaluefocus", function (e) {
    //     let value = $(e.target).val(),attr = $(e.target).attr("name"); // value
    //
    //     app.newData.tableData = app.getTableEditData(app.newData.tableData, app.newData.tableIns)
    //     let tableData = deepCopy(app.newData.tableData)
    //     let index = $(e.target).parents('tr').index(),
    //         cIndex = $(e.target).parents(".layui-form-item").index()
    //     tableData[index].salePropAttrList[cIndex]["attributeValue"] = value
    //     app.newData.tableData = tableData
    //     app.tablerender(tableData, properTablecols, 'propertyTable', function(tableIns) {
    //         app.newData.tableIns = tableIns
    //     })
    // })
    // 表格列数据
    var cols = {
        foundationTempTable: [
            [
                { type: "checkbox" },
                { title: "图片", field: 'pImg', templet: '#lazada_imageTpl' },
                { title: "英文标题", field: 'enTitle', width: 200 },
                { title: "商品名", field: 'cnTitle' },
                { title: "开发专员", field: 'bizzOwner' },
                { title: "父sku", field: 'pSku' },
                {
                    title: "<div style='width:150px;float: left;'>子SKU</div>" +
                        "<div style='width:80px;float: left;'>颜色</div> " +
                        "<div style='width:80px;float: left;'>尺寸</div> " +
                        "<div style='width:80px;float: left;'>在售</div> " +
                        "<div style='width:120px;float: left;'>是否已有lazada模板</div>",
                    style: "vertical-align: top;",
                    unresize: true,
                    width: 550,
                    templet: '#fundation_ssku'
                },
                { title: "时间", field: 'createTime', templet: '#lazada_time', width: 200 },
                { title: "操作", toolbar: '#fundationTempOption' },
            ]
        ],
        lazadaTempTable: [
            [
                { type: "checkbox" },
                { title: "图片", field: 'pImg', templet: '#lazada_imageTpl' },
                { title: "英文标题", field: 'enTitle', width: 200 },
                { title: "商品名", field: 'cnTitle' },
                { title: "开发专员", field: 'bizzOwner' },
                {
                    title: "父sku",
                    field: 'pSku',
                    templet: function(d) {
                        let str = '';
                        d.groupTemplate != 1 ? str = `${d.pSku}` : str = `${d.pSku}<span class="layui-badge layui-bg-green">组</span>`
                        return str
                    }
                },
                {
                    title: "<div style='width:150px;float: left;'>子SKU</div>" +
                        "<div style='width:80px;float: left;'>颜色</div> " +
                        "<div style='width:80px;float: left;'>尺寸</div> " +
                        "<div style='width:80px;float: left;'>在售</div> ",
                    style: "vertical-align: top;",
                    unresize: true,
                    width: 450,
                    templet: '#lazada_ssku'
                },
                { title: "刊登店铺", field: 'storeNum' },
                { title: "站点", field: 'salesSite' },
                { title: "lazada类目", field: 'fullCateName', width: 200 },
                { title: "创建人", field: 'creator' },
                { title: "时间", templet: '#lazadaTem_time', width: 200 },
                { title: "操作", toolbar: '#lazadaTempOption' },
            ]
        ]
    }

    var properTablecols = [
        [
            { title: '子sku', field: 'tempSku', templet: '#lazadalayer_sku' },
            { title: '系统属性', templet: '#lazadalayer_proper' },
            // { title: '变种参数', templet: '#lazadalayer_saleProp' },
            { field:"lazadaTempAddAttr",title: '变种参数 <button type="button" class="layui-btn layui-btn-xs" name="lazadaTempAddAttr" style="float: right;margin: 5px;display: none;">新增变种属性</button>', templet: '#lazadalayer_saleProp' },
            { title: '非变种参数', templet: '#lazadalayer_skuAttr' },
            { title: '操作', toolbar: '#lazadalayerOption' },
        ]
    ]

    var cateTablecols = [
        [ //表头
            { field: 'categoryId', title: 'ID', width: '10%' },
            { field: 'fullCateName', title: '类目', width: '80%' },
            {
                field: 'percentItem',
                title: '操作',
                width: '10%',
                toolbar: '<div><a data-id="{{d.categoryId}}" class="selectCategory" href="javascrpt:;" style="color:blue">选择</a></div>'
            }
        ]
    ]
    var inputDom = {
        //单选可输入
        'multiEnumInput': '<div class="layui-form-item">' +
            '<input hidden name="isKeyPropHiddenInputName" value="isKeyPropHiddenInputValue"/>' +
            '<label class="layui-form-label">:attrLabel</label>' +
            // '<div class="layui-input-inline">' +
            // '<input type="text" class="layui-input" name=":attrName" list=":attrNameList" value=":attrValue">' +
            // '<datalist id=":attrNameList">' +
            // ':optionList' +
            // '</datalist>' +
            // '</div>' +
            '<div class="layui-input-inline dropdown-datalist" style="width:235px;">'
            + '<input autocomplete="off"  type="text" class="layui-input" name=":attrName" value=":attrValue" style="display: inline-block;width:190px;">'
            + '<ul>'
            + ':optionList'
            + '</ul>' +
            '<div class="layui-form-mid layui-word-aux" style="float: right;">:description</div>' +
            '</div>',
        //单选不可输入
        'singleSelect': '<div class="layui-form-item">' +
            '<input hidden name="isKeyPropHiddenInputName" value="isKeyPropHiddenInputValue"/>' +
            '<label class="layui-form-label">:attrLabel</label>' +
            '<div class="layui-input-inline">' +
            '    <select name=":attrName" value=":attrValue">' +
            ':optionList' +
            '    </select>' +
            '</div>' +
            '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
            '</div>',
        // 输入
        'text': '<div class="layui-form-item">' +
            '<input hidden name="isKeyPropHiddenInputName" value="isKeyPropHiddenInputValue"/>' +
            '<label class="layui-form-label">:attrLabel</label>' +
            '<div class="layui-input-inline">' +
            '<input type="text" class="layui-input" name=":attrName" value=":attrValue">' +
            '</div>' +
            '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
            '</div>',
        // 数字+可自定义
        'numeric': '<div class="layui-form-item">' +
            '<input hidden name="isKeyPropHiddenInputName" value="isKeyPropHiddenInputValue"/>' +
            '<label class="layui-form-label">:attrLabel</label>' +
            '<div class="layui-input-inline">' +
            '<input type="number" class="layui-input" name=":attrName" value=":attrValue">' +
            '</div>' +
            '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
            '</div>',
        // 多选
        'multiSelect': '<div class="layui-form-item">' +
            '<input hidden name="isKeyPropHiddenInputName" value="isKeyPropHiddenInputValue"/>' +
            '<label class="layui-form-label">:attrLabel</label>' +
            '<div class="layui-input-block">' +
            '<div class="multiSelectCheckBox" name=":attrName">' +
            ':checkBoxList' +
            '</div>' +
            '<div class="layui-form-mid layui-word-aux" style="float: none; display: inline;">:description</div>' +
            '</div>' +
            '</div>'
    }
    var typeDescription = {
        'multiEnumInput': '单选+可自定义',
        'singleSelect': '单选+不可自定义',
        'text': '自定义',
        'numeric': '数字+可自定义'
    }
    var urls = {
        foundationTempTable: '/lazadaModel/queryBaseInfoList.html',
        lazadaTempTable: '/lazadaModel/queryLazadaModelList.html'
    }

    let app = new Vue({
        el: '#lazadatemplate',
        data: {
            formData: {
                cateName: "",
                cateId: "",
                bizzOwnerIdList: [],
                isSaleList: [2, 1],
                prodAttrList: "",
                searchSKUType: "pSku",
                searchSKUValue: "",
                searchType: "cnTitle",
                searchValue: "",
                logisAttrRelation: "and",
                logisAttr: [],
                timeType: "createTime",
                time: "",
                lazadaCateId: "",
                lazadaCatename: "",
                // prohibitPlat: "",
                // prohibitSalesSiteIdList: [],
                sellable: "true",
                orderByType: "1",
                groupTemplate: '',
                complete: "",
                tplType: "",
                sugCate: "",
                salesSite: "MY",
                tortPlat: "13",
                devTypeList: [],
                startTime: "",
                endTime: "",
                creatorId: "",
                haveLazadaModel: null,
                banCategory: "",
                page: 1,
                limit: 50
            },
            lazadaTempLazadacates: '',
            count: { foundationTempTable: 0, lazadaTempTable: 0 },
            currentIndex: 'foundationTempTable',
            businessOwnerData: null, //开发专员
            siteData: null, //站点
            devTypeData: null, //开发类型
            platForm: null, //禁售平台
            forbiddenSite: null, //禁售站点
            productLabel: null, //商品标签
            logisAttr: null, //物流属性
            creatorData: null, //创建人
            newData: {
                searchData: {
                    prodPId: "",
                    categoryId: "",
                    salesSite: "",
                    //切记此字段在修改操作的时候需要置空。
                    mainProdPId : ""
                },
                tableData: [],
                tableIns: null
            }, //新建模板提交数据
            suggestionCateIdList:[],
            normalAttrList:[]
        },
        computed: {
            foundationTempTableCount() {
                return this.count.foundationTempTable;
            },
            lazadaTempTableCount() {
                return this.count.lazadaTempTable;
            }
        },
        watch: {
            foundationTempTableCount(val, oldVal) {
                if (val != oldVal) {
                    this.renderPageSort('pageSort');
                }
            },
            lazadaTempTableCount(val, oldVal) {
                if (val != oldVal) {
                    this.renderPageSort('pageSort');
                }
            },
            currentIndex() {
                this.renderPageSort('pageSort');
            }
        },
        beforecreated() {},
        created() {
            var _this = this
            this.getBinessOwners('businessOwnerData')
            this.getBinessOwners('creatorData')
            this.getSite('lazada', function(data) {
                _this.siteData = data
                setTimeout(function() {
                    form.render();
                }, 0)
            })
            this.getDevType()
            this.getPlat()
            this.getProductLabel()
        },
        mounted() {
            this.lazadaTempLazadacates = layCascader({
                elem: "#lazadaTemp_lazadaCates",
                clearable: true,
                filterable: true,
                collapseTags: true,
                placeholder: '请先选择站点',
                // options: res,
                props: {
                    multiple: true,
                    label: "enName",
                    value: "categoryId"
                },
            })
            form.render()
            formSelects.render('tortPlatLazada')
            this.getTableData('foundationTempTable')
            this.tableOperate('foundationTempTable')
            this.tableOperate('lazadaTempTable')
            this.listenAll()
            this.renderDate()
            this.getlogisAttr()
            this.chooseLazadaCate()
        },
        methods: {
            searchSubmit(index) { //提交搜索
                var _this = this
                var time = $('#time').val()
                _this.formData.time = time
                _this.formData.startTime = ""
                _this.formData.endTime = ""
                if (time) {
                    _this.formData.startTime = time.split(' - ')[0] + ' 00:00:00'
                    _this.formData.endTime = time.split(' - ')[1] + ' 23:59:59'
                }
                _this.formData.bizzOwnerIdList = formSelects.value('bizzOwnerIdList', 'val')
                _this.formData.isSaleList = formSelects.value('isSaleListLazadaTemp', 'val').map(item => item * 1)
                _this.formData.logisAttr = formSelects.value('logisAttr', 'val')
                _this.formData.devTypeList = formSelects.value('devTypeList', 'val')
                    //_this.formData.prohibitSalesSiteIdList = formSelects.value('prohibitSalesSiteIdList', 'val')
                _this.formData.tortPlat = formSelects.value('tortPlatLazada', 'val').join(',')
                _this.getTableData(index || _this.currentIndex)
            },
            getInputType(inputType) {
                if (inputType === 'multiEnumInput' || inputType === 'enumInput') {
                    return 'multiEnumInput'
                } else if (inputType === 'singleSelect' || inputType === 'multiSelect') {
                    return 'singleSelect'
                } else if (inputType === 'numeric') {
                    return 'numeric'
                } else {
                    return 'text'
                }
            },
            getNewInputType(inputType) {
                if (inputType === 'multiEnumInput' || inputType === 'enumInput') {
                    return 'multiEnumInput'
                } else if (inputType === 'singleSelect') {
                    return 'singleSelect'
                } else if (inputType === 'multiSelect') {
                    return 'multiSelect'
                } else if (inputType === 'numeric') {
                    return 'numeric'
                } else {
                    return 'text'
                }
            },
            listenAll() { //监听所有下拉框
                var _this = this
                for (var i in this.formData) {
                    _this.listenOnSelect(i)
                }
            },
            listenOnSelect(id) { //监听下拉框
                var _this = this
                form.on('select(' + id + ')', function(data) {
                    _this.formData[id] = data.value
                    if(id == 'salesSite'){
                        _this.chooseLazadaCate()
                    }
                });
            },
            getTableData(index) { //获取表格数据
                loading.show()
                var _this = this
                if(index == 'lazadaTempTable'){
                    // 查询条件--模板类型
                    _this.formData.tplType = ''
                    _this.lazadaTempLazadacates.disabled(false)
                    _this.formData.lazadaCateId = JSON.parse($('#lazadaTemp_lazadaCates').val() || '[]').join(",")
                }else{
                    _this.formData.lazadaCateId = ''
                    _this.lazadaTempLazadacates.disabled(true)
                }
                _this.currentIndex = index
                _this.initAjax(urls[index], 'post', JSON.stringify(_this.formData), function(returnData) { //根据请求后的数据渲染表格
                    loading.hide()
                    _this.count[_this.currentIndex] = returnData.count
                    _this.tablerender((returnData.data || []), cols[index], index)
                        // _this.renderPageSort('pageSort')
                })
            },
            getProductLabel() { //获取商品标签列表
                var _this = this
                _this.initAjax('/sys/listdict.html', 'post', { headCode: "prod_tag" }, function(returnData) {
                    _this.productLabel = returnData.data
                    setTimeout(function() {
                        form.render();
                    }, 0)
                }, 'application/x-www-form-urlencoded')
            },
            getBinessOwners(type, func) { //获取开发专员列表
                var _this = this
                var obj = { businessOwnerData: '开发专员', creatorData: 'lazada专员' }
                _this.initAjax('/sys/listuserbyrole.html', 'post', { role: obj[type] }, function(returnData) {
                    _this[type] = returnData.data
                    setTimeout(function() {
                        formSelects.render('bizzOwnerIdList');
                    }, 0)
                }, 'application/x-www-form-urlencoded')
            },
            getPlat() { //获取禁售平台
                var _this = this
                _this.initAjax('/enum/getSalesPlatEnum.html', 'post', {}, function(returnData) {
                    _this.platForm = returnData.data
                    setTimeout(function() {
                        form.render();
                    }, 0)
                })
            },
            getSite(site, func) { //获取站点列表
                var _this = this
                _this.initAjax('/enum/getSiteEnum.html?platCode=' + site, 'post', {}, function(returnData) {
                    setTimeout(function() {
                        formSelects.render('prohibitSalesSiteIdList');
                    }, 0)
                    if (func) {
                        func(returnData.data)
                    }
                })
            },
            getDevType() { //获取开发类型列表
                var _this = this
                _this.initAjax('/enum/getPreProdDevTypeEnum.html', 'post', {}, function(returnData) {
                    _this.devTypeData = returnData.data
                    setTimeout(function() {
                        formSelects.render('devTypeList');
                    }, 0)
                })
            },

            getSkuProperty(sku, func) { //根据sku查询系统属性，用于新增sku
                var _this = this
                _this.initAjax('/lazadaModel/getInfoBySubSku.html', 'post', JSON.stringify({ sku: sku }), function(returnData) {
                    if (func) {
                        func(returnData.data)
                    }
                })
            },

            getLazadaDetail(id, func) { //获取lazada模板详情用于修改使用
                var _this = this
                loading.show()
                _this.initAjax('/lazadaModel/queryForEdit.html', 'post', JSON.stringify({ id: id }), function(returnData) {
                    _this.suggestionCateIdList = returnData.data.suggestionCateIdList;
                    var htmldata = _this.renderProperties(returnData.data)
                    func(htmldata)
                })
            },

            getProperties(data, func) { //根据站点,类目查询系统类目及变种参数集合
                if($("#layernewlazada #site").val() == 'MY') {
                    if (!this.suggestionCateIdList.includes(data.categoryId * 1)) {
                        $("#layernewlazada .warningCateIdTips").html('非推荐类目');
                    } else {
                        $("#layernewlazada .warningCateIdTips").html('');
                    }
                }
                var _this = this
                _this.initAjax('/lazadaModel/queryForCreate.html', 'post', JSON.stringify(data), function(returnData) {
                    let oldSkuInfoList = window.localStorage.getItem('oldSkuInfoList'),jsonSkuInfoList;
                    if(oldSkuInfoList){
                        jsonSkuInfoList = JSON.parse(oldSkuInfoList);
                        let skuList = jsonSkuInfoList.map(item => item.tempSku);
                        let skuInfoList = returnData.data.skuInfoList.filter(item => skuList.includes(item.tempSku))
                        returnData.data.skuInfoList = skuInfoList;
                    }
                    var htmldata = _this.renderProperties(returnData.data)
                    func(htmldata)
                })
            },

            addTemplate(data, func) { //新建模板
                data.suggestionCateIdList = this.suggestionCateIdList;
                var _this = this
                _this.initAjax('/lazadaModel/add.html', 'post', JSON.stringify(data), function(returnData) {
                    func(returnData)
                })
            },

            modifyTemplate(data, func) { //修改模板
                data.suggestionCateIdList = this.suggestionCateIdList;
                var _this = this
                _this.initAjax('/lazadaModel/edit.html', 'post', JSON.stringify(data), function(returnData) {
                    func(returnData)
                })
            },

            deleteTemplate(obj, func) { //删除lazada模板
                var _this = this
                _this.initAjax('/lazadaModel/delete.html', 'post', JSON.stringify(obj), function(returnData) {
                    func(returnData)
                })
            },
            batchDeleteTemplate(idList, func) { //批量删除lazada模板
                var _this = this
                _this.initAjax('/lazadaModel/deleteLazadaModelByIdList', 'DELETE', JSON.stringify(idList), function(returnData) {
                    func(returnData)
                })
            },

            getRecommandCate(data, func) {
                var _this = this
                _this.initAjax('/lazadaModel/qeuryRecommCateList.html', 'post', JSON.stringify(data), function(returnData) {
                    func(returnData)
                })
            },

            getlogisAttr() {
                var _this = this
                _this.initAjax('/enum/getLogisAttrEnum.html', 'post', {}, function(returnData) {
                    _this.logisAttr = returnData.data
                    setTimeout(function() {
                        formSelects.render('logisAttr');
                    }, 0)
                })
            },
            // 新增  allProdPId 字段，代表当前选中的基础父商品集合
            getDetailByid(id, allProdPId, func) { //获取父商品详情
                var _this = this
                _this.initAjax('/lazadaModel/getAllColumnByPId.html', 'post', JSON.stringify({ prodPId: id, allProdPId : allProdPId ,create: true }), function(returnData) {
                    _this.suggestionCateIdList = returnData.data.suggestionCateIdList
                    func(returnData)
                })
            },

            clearCate() {
                var _this = this
                _this.formData.cateId = ""
                _this.formData.cateName = ""
            },
            clearlazadaCate() {
                var _this = this
                _this.formData.lazadaCateId = ""
                _this.formData.lazadaCatename = ""
            },

            reset() {
                var _this = this
                _this.formData = {
                    cateName: "",
                    cateId: "",
                    bizzOwnerIdList: [],
                    isSaleList: [2, 1],
                    prodAttrList: "",
                    searchSKUType: "pSku",
                    searchSKUValue: "",
                    searchType: "cnTitle",
                    searchValue: "",
                    logisAttrRelation: "and",
                    logisAttr: [],
                    timeType: "createTime",
                    time: "",
                    sellable: "true",
                    //prohibitPlat: "",
                    //prohibitSalesSiteIdList: [],
                    orderByType: "1",
                    groupTemplate: '',
                    complete: "",
                    tplType: "",
                    sugCate:'',
                    salesSite: "MY",
                    tortPlat: [],
                    devTypeList: [],
                    startTime: "",
                    endTime: "",
                    banCategory: "",
                    haveLazadaModel: null
                }
                _this.lazadaTempLazadacates.setValue(null)
                _this.$nextTick(()=>{
                     setTimeout(() => {
                        formSelects.value('isSaleListLazadaTemp', ['2','1'])
                    }, 100);
                })
            },

            renderProperties(data) { //根据系统属性数据渲染
                var _this = this
                // normalTranslateAttrList
                _this.normalAttrList = data.normalTranslateAttrList
                var htmlObj = {}
                for (var i in data) {
                    if (i === 'normalTranslateAttrList') {
                        data[i] = data[i].filter(item => item.isKeyProp).concat(data[i].filter(item => !item.isKeyProp))
                        data[i] = data[i].filter(item => item.isMandatory).concat(data[i].filter(item => !item.isMandatory))
                        var html = "",flag = 0;
                        for (var j in data[i]) {
                            var element = data[i][j];
                            var type = _this.getNewInputType(element.inputType);
                            var htmlstr = "";
                            var isKeyProp = element.isKeyProp;
                            if (isKeyProp != undefined && isKeyProp) {
                                htmlstr = "<span style='color: red;position:absolute;left:-5px;'>key</span>";
                                // type = "multiEnumInput";
                            } else {
                                isKeyProp = 0;
                            }

                            if(flag == 0&&!isKeyProp&&!element.isMandatory){
                                flag = 1;
                                htmlstr += '<button type="button" class="layui-btn layui-btn-primary layui-btn-sm lazadaTempToggle" style="margin-left: 400px;">展开所有属性 <i class="layui-icon layui-icon-down layui-font-12"></i></button><div class="lazadaTempToggleBody" style="display: none;">'
                            }
                            htmlstr += inputDom[type] || inputDom.text;
                            //替换 ---> 建议将 replaceValue 前缀改为方法,因为下面也有引用,不写成方法容易修改一处另外取值没有修改bug;
                            //现在先这样,没时间改了,交给涛总改...
                            htmlstr = htmlstr.replace("isKeyPropHiddenInputName", "input_hidden" + element.attributeName);
                            htmlstr = htmlstr.replace("isKeyPropHiddenInputValue", isKeyProp);
                            if (type === "enumInput"  || type === "singleSelect") {
                                var optionList = '<option value="">请选择</option>';
                                data[i][j].attrList.forEach(function(attrVal) {
                                    optionList += `<option value="${attrVal.attrEn}${attrVal.attrZn?'(' + attrVal.attrZn + ')':""}" ${attrVal.attrEn === data[i][j].attributeValue?"selected":''}>${attrVal.attrEn}${attrVal.attrZn?'(' + attrVal.attrZn + ')':""}</option>`;
                                });
                                htmlstr = htmlstr.replace(":optionList", optionList);
                            } else if (type === "multiEnumInput"){
                                var optionList = '';
                                data[i][j].attrList.forEach(function(attrVal) {
                                    optionList += `<li>${attrVal.attrEn}${attrVal.attrZn?'(' + attrVal.attrZn + ')':""}</li>`;
                                });
                                htmlstr = htmlstr.replace(":optionList", optionList);
                            } else if (type === "multiSelect") {
                                var checkboxList = ""
                                data[i][j].attrList.forEach(function(attrVal) {
                                    checkboxList += `<input lay-skin="primary" name=":attrName" type="checkbox" ${(data[i][j].attributeValue || '').indexOf(attrVal.attrEn) > -1?"checked":""}  title="${attrVal.attrEn}${attrVal.attrZn?'(' + attrVal.attrZn + ')':""}" value="${attrVal.attrEn}">`;
                                });
                                htmlstr = htmlstr.replace(":checkBoxList", checkboxList);
                            }
                            var description = data[i][j].isMandatory ? '必填' : '选填'
                            htmlstr = htmlstr.replace(":description", description);
                            htmlstr = htmlstr.replace(/:attrLabel/g, data[i][j].attributeLabel);
                            htmlstr = htmlstr.replace(/:attrName/g, data[i][j].attributeName);
                            if(data[i][j].attributeValue != '' && data[i][j].attrList.length == 0){
                                htmlstr = htmlstr.replace(/:attrValue/g, data[i][j].attributeValue || '')
                            }else{
                                let dataZn = (data[i][j].attributeValue && data[i][j].attrList && data[i][j].attrList.filter(item=>item.attrEn == data[i][j].attributeValue))||[]
                                if(dataZn.length != 0)
                                    htmlstr = htmlstr.replace(/:attrValue/g, `${dataZn.length!=0?dataZn[0].attrEn:""}${dataZn.length!=0 && dataZn[0].attrZn?'(' + dataZn[0].attrZn + ')':""}` || '')
                                else
                                    htmlstr = htmlstr.replace(/:attrValue/g, data[i][j].attributeValue || '')
                            }
                            html += htmlstr
                        }
                        htmlObj.normalAttrList = html + '</div>'
                    } else if (i === "salePropAttrList") {
                        var html = ''
                        for (var j in data[i]) {
                            var type = _this.getInputType(data[i][j].inputType)
                            var description = typeDescription[type]
                            var optionList = '';
                            data[i][j].options.split("#,#").forEach(function(attrVal) {
                                if (attrVal !== "") {
                                    optionList += '<span class="layui-badge-rim" style="margin:2px">' + attrVal + '</span>';
                                }
                            });
                            html += '<div class="layui-form-item">' +
                                `<label class="layui-form-label ${data[i][j].isMandatory?'redStar':''}">${data[i][j].attributeLabel}</label>` +
                                '<div class="layui-input-block">' + optionList + '</div>' +
                                '<div class="layui-form-mid layui-word-aux layui-input-block" style="float: none; display: inline;">' + description + '</div>' +
                                '</div>'
                        }
                        _this.newData.salePropAttrList = data[i]
                        htmlObj.salePropAttrList = html
                    } else if (i === "skuInfoList") {
                        for (var j in data[i]) {
                            data[i][j].skuAttrList = data[i][j].skuAttrList
                        }
                        _this.newData.tableData = data[i]
                        htmlObj.skuInfoList = data[i]
                        _this.tablerender(_this.newData.tableData, properTablecols, 'propertyTable', function(tableIns) {
                            _this.newData.tableIns = tableIns
                        })
                    } else if (i === "status") {
                        if (data['status'] == false) {
                            _this.$nextTick(() => {
                                $('.warningStatusTips').html('<font color="red">禁售类目</font>');
                            });
                        }else{
                            $('.warningStatusTips').html('');
                        }
                    } else {
                        _this.newData.skuAttrList = data.skuInfoList.skuAttrList
                        htmlObj[i] = data[i]
                    }
                }
                return htmlObj
            },
            chooseCate(id, inputId, divId, cateUrl, cateSearchUrl, func) { //查询类目
                var _this = this
                admin.itemCat_select(id, inputId, divId, cateUrl, cateSearchUrl,
                    function(callback, conf) {
                        if (func) {
                            func(callback, conf)
                        } else {
                            _this.formData.cateId = callback.cateid
                            _this.formData.cateName = conf
                        }
                    })
            },
            chooseLazadaCate() {
                var _this = this
                var siteId = _this.formData.salesSite
                // _this.chooseCate('lazadaCate', '', '', '/lazada/getLazadaCateList.html?siteId=' + siteId, '/lazada/searchLazadaCate.html?siteId=' + siteId, function(callback, conf) {
                //     _this.formData.lazadaCateId = callback.cateid
                //     _this.formData.lazadaCatename = conf
                // })
                commonReturnPromise({
                    url: "/lms/lazada/getLazadaCategoryTree?site=" + siteId,
                }).then((res)=>{
                    _this.lazadaTempLazadacates.setOptions(res)
                })
            },
            renderDate() { //渲染日期
                laydate.render({
                    elem: '#time',
                    type: 'date',
                    range: true
                });
            },
            tablerender(data, cols, id, func) { //初始化表格渲染
                var _this = this
                var tableIns = table.render({
                    elem: "#" + id,
                    data: data,
                    id: id,
                    limit: 20000,
                    cols: cols,
                    done: function(res) {
                        imageLazyload();
                        form.render();
                    }
                });
                if (func) {
                    func(tableIns)
                }
            },
            tableOperate(id) { //表格操作
                var _this = this
                table.on('tool(' + id + ')', function(obj) {
                    var data = obj.data;
                    var layEvent = obj.event;
                    var tr = obj.tr;
                    if (layEvent === 'newTemplate') {
                        _this.newTemplate(data, '1')
                    } else if (layEvent === 'moveout') {
                        var index = _this.getIndex('tempSku', _this.newData.tableData, data.tempSku)
                        _this.newData.tableData.splice(index, 1)
                        obj.del();
                    } else if (layEvent === 'modifyLazada') {
                        _this.newTemplate(data, '2')
                    } else if (layEvent === 'deleteLazada') {
                        layer.confirm('确定删除这条模板数据?', function(index) {
                            _this.deleteTemplate({
                                "pInfo":[{
                                    "id":data.id,
                                    "prodPId":data.prodPId,
                                    "categoryId":data.categoryId,
                                    "salesSite":data.salesSite
                                }]
                            }, function(data) {
                                layer.msg(data.msg || '删除成功')
                                _this.searchSubmit('lazadaTempTable')
                            })
                            layer.close(index);
                        });
                    }
                });
            },

            renderPageSort(id) {
                var _this = this
                laypage.render({
                    elem: id //注意，这里的 test1 是 ID，不用加 # 号
                        ,
                    count: _this.count[_this.currentIndex], //数据总数，从服务端得到
                    limit: 50,
                    limits: [50, 100, 200],
                    curr: _this.formData.page,
                    layout: ['prev', 'page', 'next', 'count', 'limit'],
                    jump: function(obj, first) {
                        _this.formData.page = obj.curr
                        _this.formData.limit = obj.limit
                            //首次不执行
                        if (!first) {
                            _this.searchSubmit()
                        }
                    }
                });
            },

            searchCate(siteId, keyword) { //查询lazada推荐类目
                var _this = this
                layer.open({
                    type: 1,
                    title: '搜索lazada分类',
                    content: $("#lazadaCateSearchTpl").html(),
                    area: ['65%', '60%'],
                    success: function(layero, index) {
                        //搜索事件
                        loading.show()
                        var title = keyword.split('|').splice(0, 4).join(',')
                        $(layero).find("input[name='title']").val(title)
                        _this.getRecommandCate({
                            title: title,
                            salesSite: siteId
                        }, function(callbackdata) {
                            loading.hide()
                            _this.tablerender((callbackdata.data || []), cateTablecols, 'lazadaCateSearchTable', function(res) {
                                $(layero).find(".selectCategory").click(function() {
                                    $('#conf').html($(this).parents("tr").find("td[data-field=fullCateName] div").html())
                                        // 新加了批量新建模板，这里取id的修改一下？？？？？暂时还没改，没看懂这个搜索什么意思
                                    _this.newData.searchData.categoryId = $(this).data("id")
                                    _this.newData.searchData.prodPId = $("#searchRecommandCate").data("prodpid")
                                    $('#salePropAttrList').empty()
                                    $('#normalAttrList').empty()
                                    // 根据站点,类目查询系统类目及变种参数集合
                                    _this.getProperties(_this.newData.searchData, function(data) {
                                        $('#normalAttrList').append(data.normalAttrList)
                                        $('#salePropAttrList').append(data.salePropAttrList)
                                        setTimeout(function() {
                                            form.render();
                                            _this.renderDataList();
                                        }, 0)
                                        layer.close(index)
                                    })
                                });
                            })
                        })
                        $(layero).find("button").click(function() {
                            loading.show()
                            var title = $(layero).find("input[name='title']").val();
                            _this.getRecommandCate({
                                title: title,
                                salesSite: siteId
                            }, function(callbackdata) {
                                loading.hide()
                                _this.tablerender((callbackdata.data || []), cateTablecols, 'lazadaCateSearchTable', function(res) {
                                    $(layero).find(".selectCategory").click(function() {
                                        $('#conf').html($(this).parents("tr").find("td[data-field=fullCateName] div").html())
                                            // 新加了批量新建模板，这里取id的修改一下？？？？？暂时还没改，没看懂这个搜索什么意思
                                        _this.newData.searchData.categoryId = $(this).data("id")
                                        _this.newData.searchData.prodPId = $("#searchRecommandCate").data("prodpid")
                                        $('#salePropAttrList').empty()
                                        $('#normalAttrList').empty()
                                        // 根据站点,类目查询系统类目及变种参数集合
                                        _this.getProperties(_this.newData.searchData, function(data) {
                                            $('#normalAttrList').append(data.normalAttrList)
                                            $('#salePropAttrList').append(data.salePropAttrList)
                                            setTimeout(function() {
                                                form.render();
                                                _this.renderDataList();
                                            }, 0)
                                            layer.close(index)
                                        })
                                    });
                                })
                            })
                        });
                    },
                });
            },
            salePropAttrList(){
                this.newData.tableData = this.getTableEditData(this.newData.tableData, this.newData.tableIns)
                return this.newData.tableData[0].salePropAttrList
            },
            renderDataList(){
                const dropdowns = document.querySelectorAll(".dropdown-datalist");
                dropdowns.forEach((dropdown) => {
                    new Dropdown(dropdown);
                });
            },
            //新建模板弹框,
            // type:1新建，2修改
            // typeStatus[新建组合模板1；新建lazada模板0]
            // allProdPId：新建组合模板
            newTemplate(data, type, allProdPId = null, typeStatus = 0) {
                var _this = this
                _this.renderProperties({ normalAttrList: [], salePropAttrList: [], skuAttrList: [], skuInfoList: [], id: "", categoryId: "" })
                layer.open({
                    type: 1,
                    title: type === '1' ? '新建lazada模板' : '修改lazada模板',
                    content: $("#newLazadaTemp").html(),
                    maxmin: true,
                    area: ['100%', '100%'],
                    btn: ['确定', '取消'],
                    success: function(layero, index) {
                        window.localStorage.removeItem('oldSkuInfoList')
                        _this.tableOperate('propertyTable')
                        if (allProdPId == null) {
                            _this.newData.searchData.prodPId = data.id;
                        } else {
                            // 如果不为null代表当前操作来自新建组合模版动作
                            _this.newData.searchData.prodPId = allProdPId;
                        }
                        form.render();
                        for (var i in data) {
                            $('input[name=' + i + ']').val(data[i])
                        }
                        if (type === '1') {
                            // 新建组合模版需要传入主的自动映射商品id, 切记此变量需要在修改的时候值清空
                            // 否则会保留之前的错误id导致后端查询取值异常.
                            _this.newData.searchData.mainProdPId = data.id

                            _this.getDetailByid(data.id, _this.newData.searchData.prodPId, function(returnData) {
                                // 此处修改为 allProdPId --> 需求 : 如果是组合模版,选择推荐类目后也是需要把组合模版的所有父商品
                                //下面的子商品展示出来
                                $("#searchRecommandCate").data("prodpid",_this.newData.searchData.prodPId)
                                if($("#layernewlazada #site").val() == 'MY'){
                                    if(returnData.data.categoryId==undefined||returnData.data.categoryId == ''){
                                        $("#layernewlazada .warningCateIdTips").html('请使用推荐类目');
                                    }else if(!_this.suggestionCateIdList.includes(returnData.data.categoryId*1)){
                                        $("#layernewlazada .warningCateIdTips").html('非推荐类目');
                                    }else{
                                        $("#layernewlazada .warningCateIdTips").html('');
                                    }
                                }
                                for (var i in returnData.data) {
                                    $('textarea[name=' + i + ']').text(returnData.data[i])
                                }
                                data.keyword = returnData.data.keyword
                                // console.log(returnData)
                                // lazadaCategoryId 平台类目id
                                // lazadaCategoryName 类目名称
                                // modelDetailDto  当存在类目映射的时候会返回的字段集
                                if(returnData.data.lazadaCategoryId&&returnData.data.lazadaCategoryName){
                                   $('#conf').html(returnData.data.lazadaCategoryName)
                                    _this.newData.searchData.categoryId = returnData.data.lazadaCategoryId
                                    _this.newData.searchData.salesSite = 'MY'
                                }
                                if(returnData.data.modelDetailDto){
                                    $('#normalAttrList').append(_this.renderProperties(returnData.data.modelDetailDto).normalAttrList)
                                    $('#salePropAttrList').append(_this.renderProperties(returnData.data.modelDetailDto).salePropAttrList)
                                    // _this.getOption('site', _this.siteData, calbackdata.salesSite) //填充站点下拉框
                                    setTimeout(function() {
                                        $("button[name=lazadaTempAddAttr]").show()
                                        form.render();
                                        _this.renderDataList();
                                    }, 0)
                                }
                            });
                            $("#layernewlazada input[name=type]").val(1)
                        }
                        if (type === '2') {
                            // 新建组合模版需要传入主的自动映射商品id, 切记此变量需要在修改的时候值清空，否则会保留之前的错误id导致后端查询取值异常
                            _this.newData.searchData.mainProdPId = "";
                            if(data.salesSite != 'MY'){
                                $('#chooseCate').attr('disabled', 'disabled')
                                $('#searchRecommandCate').attr('disabled', 'disabled')
                            }
                            $("#layernewlazada input[name=type]").val(2)
                            $('#site').attr('disabled', 'disabled')
                            _this.getLazadaDetail(data.id, function(calbackdata) {
                                $("#searchRecommandCate").data("prodpid",calbackdata.prodPId)
                                _this.newData.searchData.categoryId = calbackdata.categoryId
                                _this.newData.searchData.salesSite = calbackdata.salesSite
                                $('#normalAttrList').append(calbackdata.normalAttrList)
                                $('#salePropAttrList').append(calbackdata.salePropAttrList)
                                $('#conf').html(data.fullCateName)
                                _this.getOption('site', _this.siteData, calbackdata.salesSite) //填充站点下拉框
                                if($("#layernewlazada #site").val() == 'MY') {
                                    if (!_this.suggestionCateIdList.includes(calbackdata.categoryId * 1)) {
                                        $("#layernewlazada .warningCateIdTips").html('非推荐类目');
                                    } else {
                                        $("#layernewlazada .warningCateIdTips").html('');
                                    }
                                }else{
                                    $("#layernewlazada .warningCateIdTips").html('');
                                }
                                // 用于搜索相似类目
                                data.keyword = calbackdata.keyword
                                // 选择类目
                                data.prodPId = calbackdata.prodPId
                                data.categoryId = calbackdata.categoryId
                                window.localStorage.setItem('oldSkuInfoList',JSON.stringify(calbackdata.skuInfoList))
                                // data.oldSkuInfoList = calbackdata.skuInfoList
                                setTimeout(function() {
                                    $("button[name=lazadaTempAddAttr]").show()
                                    form.render();
                                    _this.renderDataList();
                                }, 0)
                            })
                        } else {
                            _this.getOption('site', _this.siteData, 'MY') //填充站点下拉框
                        }
                        $("#chooseCate").click(function() {
                            var siteId = $('#site').val()
                            _this.newData.searchData.salesSite = siteId
                            _this.chooseCate('lazadaCate', '', '', '/lazada/getLazadaCateList.html?siteId=' + siteId, '/lazada/searchLazadaCate.html?siteId=' + siteId, function(callback, conf) {
                                $('#conf').html(conf)
                                $('#salePropAttrList').empty()
                                $('#normalAttrList').empty()
                                if (allProdPId == null) {
                                    if(type === '1'){
                                        _this.newData.searchData.prodPId = data.id
                                    }else if(type === '2'){
                                        _this.newData.searchData.prodPId = data.prodPId
                                    }
                                    // _this.newData.searchData.prodPId = data.id
                                } else {
                                    _this.newData.searchData.prodPId = allProdPId
                                }
                                _this.newData.searchData.categoryId = callback.cateid
                                // 根据站点,类目查询系统类目及变种参数集合
                                _this.getProperties(_this.newData.searchData, function(data) {
                                    $('#normalAttrList').append(data.normalAttrList)
                                    $('#salePropAttrList').append(data.salePropAttrList)
                                    setTimeout(function() {
                                        form.render();
                                        _this.renderDataList();
                                    }, 0)
                                })
                            })
                        })
                        $('#searchRecommandCate').click(function() {
                            var siteId = $('#site').val()
                            _this.newData.searchData.salesSite = siteId
                            _this.searchCate(_this.newData.searchData.salesSite, data.keyword)
                        })
                        $('#newLine').click(function() {
                            // _this.newData.tableData = _this.getTableEditData(_this.newData.tableData, _this.newData.tableIns)
                            _this.newData.tableData = saveLazadaTableData()
                            let salePropAttrList = _this.salePropAttrList()
                            _this.newData.tableData.push({ 'tempSku': '', 'color': '', 'size': '', 'salePropAttrList': salePropAttrList, 'skuAttrList': _this.newData.tableData[0].skuAttrList });
                            _this.tablerender(_this.newData.tableData, properTablecols, 'propertyTable', function(tableIns) {
                                _this.newData.tableIns = tableIns
                                $("#layernewlazada input[name=type]").val() == 1?'':$("button[name=lazadaTempAddAttr]").show()
                            })
                            $('input[name="ssku_line"]').blur(function() {
                                _this.newData.tableData = _this.getTableEditData(_this.newData.tableData, _this.newData.tableIns)
                                var sku = $(this).val();
                                var index = $(this).parents('tr').attr('data-index')
                                _this.getSkuProperty(sku, function(data) {
                                    _this.newData.tableData[index] = { 'tempSku': sku, 'color': data.color, 'size': data.size, 'salePropAttrList': salePropAttrList, 'skuAttrList': _this.newData.tableData[0].skuAttrList };
                                    _this.tablerender(_this.newData.tableData, properTablecols, 'propertyTable', function(tableIns) {
                                        _this.newData.tableIns = tableIns
                                        $("#layernewlazada input[name=type]").val() == 1?'':$("button[name=lazadaTempAddAttr]").show()
                                    })
                                })
                            })
                        })
                        // 替换
                        $('.lazadaTempRep').click(function() {
                            let name = $(".replaceNameLazada").val(),newName = $(".replaceNewNameLazada").val();
                            _this.newData.tableData = saveLazadaTableData()
                            _this.newData.tableData.forEach(item=>{
                                item.salePropAttrList.forEach(cItem=>{
                                    if(cItem.attributeLabel.toLowerCase() == name.toLowerCase()){
                                        cItem.attributeLabel = newName;
                                        cItem.attributeName = newName;
                                    }
                                })
                            })
                            _this.tablerender(_this.newData.tableData, properTablecols, 'propertyTable', function(tableIns) {
                                _this.newData.tableIns = tableIns
                                setTimeout(function() {
                                    $("button[name=lazadaTempAddAttr]").show()
                                    form.render();
                                    _this.renderDataList();
                                }, 0)
                            })
                        })
                        form.on('select(site)', function(data) {
                            $('#normalAttrList').empty()
                            $('#salePropAttrList').empty()
                            $('#conf').empty()
                            if(data.value != 'MY'){
                                $("#layernewlazada .warningCateIdTips").html('');
                            }else{
                                $("#layernewlazada .warningCateIdTips").html('请使用推荐类目');
                            }
                            _this.tablerender([], properTablecols, 'propertyTable', function(tableIns) {
                                _this.newData.tableIns = tableIns
                            })
                        })
                        $(layero).on('click','.lazadaTempToggle',function(){
                            $(layero).find(".lazadaTempToggleBody").toggle()
                        })
                    },
                    yes: _this.debounce(function(index, layero) {
                        var submitdata = {}
                        var formdata = serializeObject($('#layernewlazada'));
                        const { pSku, enTitle, cnTitle, site, cateTreeName, fixDesc, prodDesc, ...normalAttrList } = formdata
                        submitdata.categoryId = _this.newData.searchData.categoryId
                        submitdata.salesSite = _this.newData.searchData.salesSite
                        submitdata.normalAttrList = _this.getArrayfromObj(normalAttrList);
                        for(let i=0;i<_this.normalAttrList.length;i++){
                            let _attributeName = normalAttrList[_this.normalAttrList[i].attributeName]
                            if(_this.normalAttrList[i].inputType == 'numeric'&& !(typeof Number(_attributeName) === 'number' && !isNaN(_attributeName))){
                                layer.alert(_this.normalAttrList[i].attributeLabel + '是数字型',{icon:2})
                                return false
                            }
                        }
                        if (submitdata.normalAttrList.length < 1) {
                            layer.msg('请检查关键属性;所有关键属性必填！')
                            return;
                        }
                        submitdata.prodPId = data.id;
                        // submitdata.skuInfoList = _this.getTableEditData(_this.newData.tableData, _this.newData.tableIns)
                        submitdata.skuInfoList = saveLazadaTableData()
                        submitdata.forceSubmit = false;

                        for(let i=0;i<submitdata.skuInfoList.length;i++){
                            for(let j=0;j<submitdata.skuInfoList[i].salePropAttrList.length;j++) {
                                if (submitdata.skuInfoList[i].salePropAttrList[j].isMandatory == true &&  submitdata.skuInfoList[i].salePropAttrList[j].attributeValue == '') {
                                    layer.alert(`变种属性${submitdata.skuInfoList[i].salePropAttrList[j].attributeLabel}为必填项`, {icon: 2})
                                    return false
                                }
                            }
                        }
                        let arr = []
                        // 把变种属性的属性名和属性值重新拼接，拼接格式为[["color:red","size:s"],["color:red","size:l"]]
                        // 然后按照拼接的格式先排序再用逗号拼接，将二维数组转换成组成一维数组["color:red,size:s","color:red,size:l"]
                        submitdata.skuInfoList.forEach(item => {
                            let obj = []
                            item.salePropAttrList.forEach(cItem => {
                                cItem.attributeName.toString().toLowerCase() == ''?"":obj.push(cItem.attributeName.toString().toLowerCase()+":"+cItem.attributeValue.toString().toLowerCase())
                            })
                            arr.push(obj.sort().join(","))
                        })
                        // 判断数组是否有重复项
                        let isRepeat = _this.isRepeat(arr);
                        // 如果有重复项，isRepeat为一个长度为2的数组，数组的两个值为重复项的索引
                        if(isRepeat != false){
                            layer.alert(submitdata.skuInfoList[isRepeat[0]].tempSku + "与" + submitdata.skuInfoList[isRepeat[1]].tempSku + "属性值重复",{icon:2})
                            return false
                        }
                        if (type === "1") {
                            typeStatus ? submitdata.groupTemplate = 1 : submitdata.groupTemplate = 0;
                            _this.addTemplate(submitdata, function(data) {
                                if (data.msg == '同站点及类目已生成') { //
                                    layer.confirm('当前站点此类目已存在,是否强制生成?', function(index) {
                                        submitdata.forceSubmit = true;
                                        _this.addTemplate(submitdata, function(data) {
                                            _this.searchSubmit('foundationTempTable')
                                            layer.msg(data.msg || '创建lazada模板成功！')
                                            layer.close(index);
                                        })
                                    });
                                } else {
                                    _this.searchSubmit('foundationTempTable')
                                    let message = "创建lazada模板成功;</br>";
                                    let errorMes = "";
                                    let flag = false;
                                    for (let key in data.data){
                                        if (data.data[key].length > 0){
                                            errorMes += key + ":"+ data.data[key] + ";</br>";
                                            flag = true;
                                        }
                                    }
                                    if (flag) {
                                        layer.alert("创建lazada模板不分成功</br>" + errorMes,{icon:2})
                                    }else {
                                        layer.msg(message)
                                    }
                                    // layer.msg(data.msg || message)
                                    layer.close(index);
                                }

                            })
                        } else if (type === "2") {
                            // oldCategoryId：原类目Id
                            // isEditCategory：是否修改模板类目
                            submitdata.oldCategoryId = data.categoryId;
                            submitdata.id = data.id;
                            submitdata.prodPId = data.prodPId;
                            submitdata.categoryId = _this.newData.searchData.categoryId;
                            submitdata.oldCategoryId == submitdata.categoryId ? submitdata.isEditCategory = false : submitdata.isEditCategory = true;
                            // submitdata.id = data.id
                            // submitdata.categoryId = _this.newData.searchData.categoryId
                            _this.modifyTemplate(submitdata, function(data) {
                                _this.searchSubmit('lazadaTempTable')
                                layer.msg(data.msg || '修改lazada模板成功！')
                                layer.close(index);
                            })
                        }
                    }, 1000, 2000)

                });

            },
            // 判断数组是否有重复项，如果没有返回false，如果有，返回长度为2的数组，数组为重复项的索引
            isRepeat(arr) {
                var hash = {};
                for(var i in arr) {
                    if(hash[arr[i]]) {
                        return [arr.indexOf(arr[i]),i*1];
                    }
                    hash[arr[i]] = true;
                }
                return false;
            },
            getTableEditData(tabledata, tableIns) { //获取新建模板及修改模板时候可编辑的类目表格数据集合
                var _this = this
                var data = []
                var layFilterIndex = 'LAY-table-' + tableIns.config.index;
                var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
                tableContainer.find('input').each(function(index, item) {
                    var name = $(item).attr('name')
                    if (name) {
                        var index = _this.getIndex('LAY_TABLE_INDEX', tabledata, name.split('&')[1])
                        if (index > -1) {
                            if (name.split('&')[2] === "1") {
                                var salePropAttrListindex = name.split('&')[0]
                                tabledata[index].salePropAttrList[salePropAttrListindex].attributeValue = $(item).val()
                            } else if (name.split('&')[2] === "2") {
                                var skuAttrListindex = name.split('&')[0]
                                if (skuAttrListindex > -1) {
                                    tabledata[index].skuAttrList[skuAttrListindex].attributeValue = $(item).val()
                                }
                            }
                        }
                    } else {
                        var name = $(item).parents('.layui-form-select').siblings('select').attr('name')
                        var index = _this.getIndex('LAY_TABLE_INDEX', tabledata, name.split('&')[1])
                        if (index > -1) {
                            if (name.split('&')[2] === "1") {
                                var salePropAttrListindex = name.split('&')[0]
                                tabledata[index].salePropAttrList[salePropAttrListindex].attributeValue = $(item).val()
                            } else if (name.split('&')[2] === "2") {
                                var skuAttrListindex = name.split('&')[0]
                                if (skuAttrListindex > -1) {
                                    tabledata[index].skuAttrList[skuAttrListindex].attributeValue = $(item).val()
                                }
                            }
                        }
                    }
                });
                return tabledata
            },
            getArrayfromObj(obj) { //将键值对应的对象转化为name,value字段的数组对象
                var arr = [];
                for (var i in obj) {
                    if (i.indexOf("input_hidden") > -1) {
                        continue;
                    }
                    var key = "input_hidden" + i;
                    // 如果为关键属性
                    if (obj[key] && obj[key] == "1") {
                        // 且关键属性值不为 空
                        if (obj[i] == undefined || obj[i].trim() == '') {
                            arr = [];
                            return arr;
                        }
                    }
                    arr.push({ attributeName: i, attributeValue: obj[i]!=''?obj[i].split("(")[0]:obj[i], isKeyProp: obj[key] });
                }
                return arr
            },
            getIndex(id, arr, value) { //获取某个取值属性在对象数组中的下标
                for (var i = 0; i < arr.length; i++) {
                    if (value == arr[i][id]) {
                        return i;
                    }
                }
                return -1;
            },
            initAjax(url, method, data, func, contentType) { //初始化ajax请求
                $.ajax({
                    type: method,
                    url: ctx + url, //'http://192.168.0.164:8090/lms'
                    dataType: 'json',
                    async: true,
                    data: data,
                    contentType: contentType || 'application/json',
                    beforeSend: function() {
                        loading.show();
                    },
                    success: function(returnData) {
                        loading.hide()
                        if (returnData.code == "0000") {
                            func(returnData)
                        } else {
                            layer.msg(returnData.msg, { icon: 2 });
                        }
                    },
                    error: function(returnData) {
                        // layui.admin.load.hide();
                        loading.hide();
                        if (XMLHttpRequest.status == 200) {
                            layer.msg("请重新登录", { icon: 7 });
                        } else {
                            layer.msg("服务器错误");
                        }
                    }
                })
            },
            getOption(id, data, selected) {
                var html = ""
                for (var i = 0; i < data.length; i++) {
                    if (selected && selected === data[i].code) {
                        html += '<option value="' + data[i].code + '" selected>' + data[i].name + '</option>'
                    } else {
                        html += '<option value="' + data[i].code + '">' + data[i].name + '</option>'
                    }
                }
                $('#' + id).append(html)
                setTimeout(function() {
                    form.render()
                }, 0)
            },
            debounce(fn, delay, mustRunDelay) {
                var timer = null;
                var t_start;
                return function() {
                    var context = this;
                    var args = arguments;
                    var t_curr = +new Date();
                    clearTimeout(timer);
                    if (!t_start) {
                        t_start = t_curr;
                        fn.apply(context, args);
                    }
                    if (t_curr - t_start >= mustRunDelay) {
                        fn.apply(context, args);
                        t_start = t_curr
                    }
                }
            },
            // 一键复制父SKU
            lazadaTemplateCopyPskuBtn() {
                loading.show();
                let _this = this;
                var time = $('#time').val()
                _this.formData.time = time
                _this.formData.startTime = ""
                _this.formData.endTime = ""
                if (time) {
                    _this.formData.startTime = time.split(' - ')[0] + ' 00:00:00'
                    _this.formData.endTime = time.split(' - ')[1] + ' 23:59:59'
                }
                _this.formData.bizzOwnerIdList = formSelects.value('bizzOwnerIdList', 'val')
                _this.formData.isSaleList = formSelects.value('isSaleListLazadaTemp', 'val').map(item => item*1)
                _this.formData.logisAttr = formSelects.value('logisAttr', 'val')
                _this.formData.devTypeList = formSelects.value('devTypeList', 'val')
                _this.formData.tortPlat = formSelects.value('tortPlatLazada', 'val').join(',')
                // _this.currentIndex = index
                // _this.lazadaTemplateCopyPskuApi(_this.formData, function(callbackdata) {
                //     loading.show()
                //     layer.confirm(`共查出父SKU ${callbackdata.data.length}条，点击确认复制`,{btn: ['确认'],closeBtn: 0,}, function() {
                //         loading.hide()
                //         copyTxtToClipboard(callbackdata.data.join(','),'textarea')
                //     });
                // })
                $.ajax({
                    type: "POST",
                    url: ctx + "/lazadaModel/queryLazadaModelSkuList.html", //'http://192.168.0.164:8090/lms'
                    dataType: 'json',
                    async: true,
                    data: JSON.stringify(_this.formData),
                    contentType: 'application/json',
                    success: function(returnData) {
                        if (returnData.code == "0000") {
                            layer.confirm(`共查出父SKU ${returnData.data.length}条，点击确认复制`,{btn: ['确认'],closeBtn: 0,}, function() {
                                loading.hide()
                                copyTxtToClipboard(returnData.data.join(','),'textarea')
                            });
                        } else {
                            layer.msg(returnData.msg, { icon: 2 });
                        }
                    },
                    error: function(returnData) {
                        loading.hide();
                        layer.msg("请求错误");
                    }
                })
            },
            // lazadaTemplateCopyPskuApi(formData,func) {
            //     this.initAjax('/lazadaModel/queryLazadaModelSkuList.html', 'post', JSON.stringify(formData), function(returnData) {
            //         func(returnData)
            //     })
            // },
            // 新建组合模板
            lazadaTemplateNewTemplateBtn() {
                let _this = this;
                let itemData = table.checkStatus('foundationTempTable').data; //获取选择的店铺
                let allProdPId = itemData.map(item => item.id).join(",")
                if (itemData.length == 0) {
                    layer.alert("请选择基础模板数据", { icon: 7 })
                    return false;
                }
                let tpl = `<form class="layui-form" style="padding:20px;">`
                tpl += itemData.map(item => `<input type="radio" name="lazadaTemplateNewTemplateRadio" value=${item.pSku} title=${item.pSku}><br>`).join('')
                tpl += `</form>`

                layer.open({
                    type: 1,
                    title: '提示',
                    content: tpl,
                    area: ['300px', '400px'],
                    btn: ["确定", "取消"],
                    success: function(layero, index) {
                        form.render()
                    },
                    yes: function() {
                        let checkedData = $("input[name=lazadaTemplateNewTemplateRadio]:checked").val()
                        if (checkedData == undefined || checkedData == '') {
                            layer.alert("请选择一个父SKU", { icon: 7 })
                        } else {
                            layer.closeAll();
                            let data = itemData.filter(item => checkedData == item.pSku)
                            _this.newTemplate(data[0], '1', allProdPId, 1)
                        }
                    }
                })
            },
            // 批量删除
            deleteLazadaTemplateBtn() {
                let _this = this;
                let itemData = table.checkStatus('lazadaTempTable').data; //获取选择的店铺
                // let allProdPId = itemData.map(item => item.id)
                let obj = {pInfo:[]}
                itemData.forEach(item => {
                    obj.pInfo.push({
                        "id" : item.id,
                        "prodPId":item.prodPId,
                        "categoryId":item.categoryId,
                        "salesSite":item.salesSite
                    })
                })
                if (itemData.length == 0) {
                    layer.alert("请选择需要删除的模板数据", { icon: 7 })
                    return false;
                }
                layer.confirm(`确定删除这${obj.pInfo.length}条模板数据?`, function(index) {
                    // _this.batchDeleteTemplate(allProdPId, function(data) {
                    //     layer.msg(data.msg || '删除成功')
                    //     _this.searchSubmit('lazadaTempTable')
                    // })
                    // layer.close(index);
                    _this.deleteTemplate(obj, function(data) {
                        layer.msg(data.msg || '删除成功')
                        _this.searchSubmit('lazadaTempTable')
                    })
                });
            }

        }
    })
})