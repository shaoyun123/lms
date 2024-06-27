// ;(function($,layui,window,document,undefined){
/**速卖通刊登的js*/
// 营销图1 market1_images  1:1  白底图  传给平台imageType:2
// 营销图2 market2_images  3:4  场景图  传给平台imageType:1
// tab
var smtPublish_TABVALUE = -2;
// 产品描述的tab
var smtPublish_desc_lastDescTabVal = 1
// 产品描述 添加图片、图文模块 加一次
var smtPublish_desc_addImg_pc_number = 0
// 记录  调价选的哪个分类
var smtPublish_adjustPriceTypeVal = ''
//
var tortBrandTime = null
let smtPublish_skuList = {}
var LogicTypeList = [
    {
      label: '普货',
      value: 'general'
    },
    {
      label: '内电',
      value: 274526
    },
    {
      label: '弱磁',
      value: 274452
    },
    {
      label: '粉末',
      value: 274511
    },
    {
      label: '液体',
      value: 274259
    },
    {
      label: '膏体',
      value: 274363
    }
  ];
let AttrInfos=['imgAttr','attr1','attr2','attr3']
// 汇率
let smtpublish_exchangeRate = null
//  {
//     ONLINE:{
//         code:'ONLINE',name:'速卖通在线商品区域调价'
//     },
//     LISTING:{
//         code:'LISTING',name:'速卖通刊登区域调价'
//     }
// }

// 静态数据
// 五种类型:

// ECONOMYECONOMY("ECONOMYECONOMY", "常见1:俄西经济"),
//     ECONOMYSIMPLE("ECONOMYSIMPLE", "常见2:俄经济西简易"),
//     SIMPLESIMPLE("SIMPLESIMPLE", "常见3:俄西简易"),
//     STANDARDSIMPLE("STANDARDSIMPLE", "常见4:俄标准西简易"),
//     STANDARDSTANDARD("STANDARDSTANDARD", "常见5:全标准");


// 六种国家物流方式:
// GENERALECONOMY("GENERALECONOMY", "普货-经济"),
//     GENERALSIMPLE("GENERALSIMPLE", "普货-简易"),
//     GENERALSTANDARD("GENERALSTANDARD", "普货-标准"),
//     SPECIALECONOMY("SPECIALECONOMY", "特货-经济"),
//     SPECIALSIMPLE("SPECIALSIMPLE", "特货-简易"),
//     SPECIALSTANDARD("SPECIALSTANDARD", "特货-标准");
//tab数据
const TAB_LIST = [
    { value: -2, name: '', label: '', tableId: 'smt_publish_tpl_table', tabIndex: 0, tabId: 'smtPublish_tplNum' },
    { value: 0, name: '', label: '', tableId: 'smt_publish_tolisting_table', tabIndex: 1, tabId: 'smtPublish_toListingNum' },
    { value: 3, name: '', label: '', tableId: 'smt_publish_listing_table', tabIndex: 2, tabId: 'smtPublish_listingNum' },
    { value: 1, name: '', label: '', tableId: 'smt_publish_listingsucc_table', tabIndex: 3, tabId: 'smtPublish_listingSuccNum' },
    { value: 2, name: '', label: '', tableId: 'smt_publish_listingfail_table', tabIndex: 4, tabId: 'smtPublish_listingFailNum' },
]
//调价模板数据
var subPublish_REGION_PRICE_LIST = []
//模板数据
var subPublish_ModalDetail_Data = ''
var usdToCnyRate = ''
var prodPId = ''
var isJoin = ''
var isSupportHalfManage = false
//类目属性
var subPublish_Category_Arr = []
//最小计量单位
const subPublish_PRODUCT_UNIT_LIST = [
    { code: '100000000', name: '袋 (bag/bags)' },
    { code: '100000001', name: '桶 (barrel/barrels)' },
    { code: '100000002', name: '蒲式耳 (bushel/bushels)' },
    { code: '100078580', name: '箱 (carton)' },
    { code: '100078581', name: '厘米 (centimeter)' },
    { code: '100000003', name: '立方米 (cubic meter)' },
    { code: '100000004', name: '打 (dozen)' },
    { code: '100078584', name: '英尺 (feet)' },
    { code: '100000005', name: '加仑 (gallon)' },
    { code: '100000006', name: '克 (gram)' },
    { code: '100078587', name: '英寸 (inch)' },
    { code: '100000007', name: '千克 (kilogram)' },
    { code: '100078589', name: '千升 (kiloliter)' },
    { code: '100000008', name: '千米 (kilometer)' },
    { code: '100078559', name: '升 (liter/liters)' },
    { code: '100000009', name: '英吨 (long ton)' },
    { code: '100000010', name: '米 (meter)' },
    { code: '100000011', name: '公吨 (metric ton)' },
    { code: '100078560', name: '毫克 (milligram)' },
    { code: '100078596', name: '毫升 (milliliter)' },
    { code: '100078597', name: '毫米 (millimeter)' },
    { code: '100000012', name: '盎司 (ounce)' },
    { code: '100000014', name: '包 (pack/packs)' },
    { code: '100000013', name: '双 (pair)' },
    { code: '100000015', name: '件/个 (piece/pieces)' },
    { code: '100000016', name: '磅 (pound)' },
    { code: '100078603', name: '夸脱 (quart)' },
    { code: '100000017', name: '套 (set/sets)' },
    { code: '100000018', name: '美吨 (short ton)' },
    { code: '100078606', name: '平方英尺 (square feet)' },
    { code: '100078607', name: '平方英寸 (square inch)' },
    { code: '100000019', name: '平方米 (square meter)' },
    { code: '100078609', name: '平方码 (square yard)' },
    { code: '100000020', name: '吨 (ton)' },
    { code: '100078558', name: '码 (yard/yards)' },
]

// smtPublish_getlistingDetail(1924841, 2043, 'prodListingId')

layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'element', 'laydate', 'laytpl','layCascader', 'formSelects', 'jquery','upload'], function () {
    var $ = layui.$,
        admin = layui.admin,
        layer = layui.layer,
        $ = layui.$,
        jquery = layui.jquery,
        table = layui.table,
        laydate = layui.laydate,
        element = layui.element,
        layCascader = layui.layCascader,
        formSelects = layui.formSelects,
        laytpl = layui.laytpl,
        upload = layui.upload,
        form = layui.form;

    formSelects.render();
    form.render()
    //
    render_hp_orgs_users("#smt_publish_search_form")

    //
    let smtpublish_newcate,smtpublish_newcate_data;
    commonReturnPromise({
        url: ctx + "/prodCateOa/get/cate/tree",
    }).then((res)=>{
        smtpublish_newcate_data = JSON.parse(res)
    })

    var smtPublishName = {
        init: function (){ //初始化
            Promise.all([
                commonReturnPromise({
                    url: '/lms/prodCommon/getRate',
                    type: 'post',
                    params: {fromCurrency:'USD',toCurrency:'CNY'}
                })
            ]).then(res=>{
                smtpublish_exchangeRate = res[0]
            })
        },
        handleCate: function(){
            setTimeout(() => {
                smtpublish_newcate = layCascader({
                    elem: "#smtpublish_newcate",
                    clearable: true,
                    filterable: true,
                    collapseTags: true,
                    placeholder: '请选择',
                    // options: JSON.parse(res),
                    props: {
                        multiple: true,
                        label: "title",
                        value: "value",
                        children: 'data'
                    }
                });

                smtpublish_newcate.setOptions(smtpublish_newcate_data);
            }, 100);
        },
        initAgain:function(){
            formSelects.data('smt_publish_logisticsSelect', 'local', { arr: logisAttrs })
            $("#smt_publish_search_form select[name=prodAttrList]").html(prodAliexpressTagsHtml);
            commonRenderSelect('smt_publish_devType', devTypeList, { name: "name", code: "code" })
            .then(
                ()=>form.render()
            )
            $.ajax({
                type: "post",
                url: ctx + "/aliexpresslisting/listdevelopuser.html",
                dataType: "json",
                data: { salePersonId: '' },
                success: function (res) {
                    var str = "<option code=''></option>";
                    for (var i = 0; i < res.data.length; i++) {
                        str += "<option value='" + res.data[i].id + "'>" + res.data[i].loginName + "</option>";
                    }
                    $("#smt_publish_search_form select[name=bizzOwnerId]").html(str);
                    form.render("select");
                }
            });
        },
        initRenderTime: function () {    //模板审核时间
            laydate.render({
                elem: '#smtPublish_searchTpl_auditTime',
                type: 'datetime',
                range: true,
            })
        },
        initCreatorsAjax: function () {
            return Promise.all([
                commonReturnPromise({
                    url: ctx + '/sys/listuserbyrole.html',
                    type: 'post',
                    params: { role: 'smt专员' }
                }),
                commonReturnPromise({
                    url: ctx + '/sys/getPersonAndOrgsByRole.html',
                    type: 'post',
                    params: { roleNames: 'smt专员' }
                })
            ])
        },
        lastCateInfo: {
            cateId: null,
            cateName:''
        },
        initCreatorsData: function () {
            var _this = this
            this.initCreatorsAjax()
                .then(data => {
                    data[0].unshift({ id: -1, loginName: 'system' })
                    data[1].userList.unshift({ id: -1, user_name: 'system' })
                    let _data = {
                        tplCreatorList: data[0],
                        publishCreatorList: data[1].userList
                    }
                    sessionStorage.setItem('INIT_SEARCH_LIST', JSON.stringify(_data));
                    _this.renderSpecialSearch(_data)
                }).catch(err => layer.msg(err || err.msg, { icon: 2 }))
        },
        renderSpecialSearch: function (data) {  //模板页面特有：添加模板创建人和刊登状态展示和查询
            const _this = this
            let getTplLinkage = smtPublish_searchTpl_special.innerHTML
            let viewLinkage = document.getElementById('smtPublish_searchTpl_special_linkage')
            laytpl(getTplLinkage).render({ status: smtPublish_TABVALUE, ...data }, function (html) {
                viewLinkage.innerHTML = html
                _this.initAgain()
                $('#smtPublish_selectCateBtn').click(function () {
                    var cateUrl = "/smtPublishModelProduct/getSmtCateListByStoreAcctId";
                    var cateSearchUrl = "/smtPublishModelProduct/getSmtCateListByStoreAcctId";
                    const storeAcctIds= $('#smt_publish_search_form').find('input[name=storeAcctId]').val()
                    if(storeAcctIds){
                        admin.itemCat_select('layer-publishs-smt-publish', 'smtPublish_cateId', 'smtPublish_cateDiv', cateUrl, cateSearchUrl)
                        window.localStorage.setItem('cateStoreAcctIds',storeAcctIds)
                    }else{
                        layer.msg('请先选择店铺')
                    }
                });
                if($("#smt_publish_search_form input[name=cateId]").length){
                    $("#smt_publish_search_form input[name=cateId]").val( _this.lastCateInfo.cateId ||null)
                    $("#smtPublish_cateDiv").text(_this.lastCateInfo.cateName||'')
                }else{
                    $("#smtPublish_cateDiv").text('')  
                }
                if(smtPublish_TABVALUE == -2){
                    smtPublishName.handleCate();
                }
            })
            form.render()
        },
        tabMonitor: function () {
            var _this = this
            //监听tab切换来选中不同的tab页
            element.on('tab(smt_publish_tab)', function () {
                let lastTabVal = smtPublish_TABVALUE
                if (lastTabVal != $(this).attr('data-value')) {
                    // 切换tab，tabbody部分显示隐藏
                    $("#smtPublishCard .layui-show").removeClass("layui-show");
                    $("#smtPublishCard").find(".layui-show" + $(this).attr('data-value')).addClass("layui-show")

                    smtPublish_TABVALUE = $(this).attr('data-value')
                    tabLeftBtnsRender(smtPublish_TABVALUE)
                    if($(this).attr('data-value') == -2 || $(this).attr('data-value') == 0 || $(this).attr('data-value') == 2){
                        $(".smtpublish_preAvailableStockType").show() // 查询条件
                        // $(".smtpublish_table_preAvailableStockType").show() // 表格字段
                    }else{
                        $(".smtpublish_preAvailableStockType").hide()
                        // $(".smtpublish_table_preAvailableStockType").hide()
                        $("#smt_publish_search_form input[name=preAvailableStockMin]").val('')
                        $("#smt_publish_search_form input[name=preAvailableStockMax]").val('')
                    }
                    if (($(this).attr('data-value') != -2 && lastTabVal != -2)) {
                        // 上面条件的相反不太会写，所以这样写了；；后面四个之间切换搜索模板不会切换
                    } else {
                        // 获取缓存中的json数据
                        let creatorList = JSON.parse(sessionStorage.getItem('INIT_SEARCH_LIST'))
                        // 获取cateId
                        if($("#smt_publish_search_form input[name=cateId]").length){
                            _this.lastCateInfo.cateId =$("#smt_publish_search_form input[name=cateId]").val()
                            _this.lastCateInfo.cateName =$("#smtPublish_cateDiv").text()
                        }
                        _this.renderSpecialSearch(creatorList)
                    }
                    if($(this).attr('data-value') == -2){
                        $(".unlistingTempCon").show()
                        $(".salesCountType").show()
                        // 排序默认值
                        _this.lastCateInfo.orderByType = 1
                        $("#smt_publish_search_form [name=orderByType]").val(1)
                        $("#smt_publish_search_form [name=orderByType]").append("<option value=10>全托管30天销量倒序</option>")
                        // 时间枚举默认值
                        $("#smt_publish_search_form [name=auditTimeLabel]").find("[value=listingCreatTime]").remove()
                        $("#smt_publish_search_form [name=auditTimeLabel]").find("[value=baseModelAuditTime]").remove()
                        $("#smt_publish_search_form [name=auditTimeLabel]").append("<option value=baseModelAuditTime>审核时间</option>")
                        $("#smt_publish_search_form [name=auditTimeLabel]").val('baseModelAuditTime')
                        $(".smtpublish_isLongDeliveryCategory").show()
                    } else {
                        $(".unlistingTempCon").hide()
                        $(".salesCountType").hide()
                        $("#smt_publish_search_form [name=unlistingTemp]").val('')
                        _this.lastCateInfo.orderByType = 3
                        $("#smt_publish_search_form [name=orderByType]").val(3)
                        $("#smt_publish_search_form [name=orderByType]").find("[value='10']").remove()
                        $("#smt_publish_search_form [name=auditTimeLabel]").find("[value=baseModelAuditTime]").remove()
                        $("#smt_publish_search_form [name=auditTimeLabel]").find("[value=listingCreatTime]").remove()
                        $("#smt_publish_search_form [name=auditTimeLabel]").append("<option value=listingCreatTime>创建时间</option>")
                        $("#smt_publish_search_form [name=auditTimeLabel]").val('listingCreatTime')
                        $(".smtpublish_isLongDeliveryCategory").hide()
                    }
                    form.render("select","smt_publish_search_form")
                }
                $("#smt_publish_search_submit").click()
            })
        },
        descTabMonitor: function () {
            element.on('tab(smtPulish_desc_tab)', function (data) {
                if ($(this).attr('data-value') != smtPublish_desc_lastDescTabVal) {
                    if ($(this).attr('data-value') == 1) {
                        $('#smtPulish_wirelessToPc').show()
                        $('#smtPublish_desc_pc_info').hide()
                    } else {
                        $('#smtPulish_wirelessToPc').hide()
                        $('#smtPublish_desc_pc_info').show()
                    }
                    smtPublish_desc_lastDescTabVal = $(this).attr('data-value')
                }
            })
        }
    }

    //初始化模板速卖通标签
    var prodAliexpressTags = [];
    var prodAliexpressTagsHtml = [];
    var devTypeList = []
    var logisAttrs = [];  //物流属性
    initLogisAttrSelect()  //初始化物流属性
    initProdTag()  //初始化商品标签
    initDevType() //初始化开发类型
    smtPublishName.init()
    // smtPublishName.handleCate()
    smtPublishName.initRenderTime()  //模板审核时间
    smtPublishName.initCreatorsData()  //初始化模板创建人,刊登创建人
    smtPublishName.tabMonitor()  //监听tab
    smtPublishName.descTabMonitor()  //监听刊登弹窗里的描述tab
    tabLeftBtnsRender(smtPublish_TABVALUE)

    //选择分类弹框
    setTimeout(() => {
        $('#smtPublish_selectCateBtn').click(function () {
            var cateUrl = "/smtPublishModelProduct/getSmtCateListByStoreAcctId";
            var cateSearchUrl = "/smtPublishModelProduct/getSmtCateListByStoreAcctId";
            const storeAcctIds= $('#smt_publish_search_form').find('input[name=storeAcctId]').val()
            if(storeAcctIds){
                admin.itemCat_select('layer-publishs-smt-publish', 'smtPublish_cateId', 'smtPublish_cateDiv', cateUrl, cateSearchUrl)
                window.localStorage.setItem('cateStoreAcctIds',storeAcctIds)
            }else{
                layer.msg('请先选择店铺')
            }
        });
    }, 1000);

    //开发专员与销售员联动
    $("#smt_publish_search_form select[name=salePersonId]").change(function () {
        var salePersonId = $(this).val();
        $.ajax({
            type: "post",
            url: ctx + "/aliexpresslisting/listdevelopuser.html",
            dataType: "json",
            data: { salePersonId: salePersonId },
            success: function (res) {
                var str = "<option code=''></option>";
                for (var i = 0; i < res.data.length; i++) {
                    str += "<option value='" + res.data[i].id + "'>" + res.data[i].loginName + "</option>";
                }
                $("#smt_publish_search_form select[name=bizzOwnerId]").html(str);
                form.render("select");
            }
        });
    });

    // 物流属性
    function initLogisAttrSelect () {
        $.ajax({
            type: "post",
            url: ctx + "/sys/listlogisattr.html",
            dataType: "json",
            success: function (returnData) {
                logisAttrs = returnData.data;
                formSelects.data('smt_publish_logisticsSelect', 'local', { arr: logisAttrs })
                form.render();
            }
        });
    }

    //初始化速卖通标签
    function initProdTag () {
        $.ajax({
            type: "post",
            url: ctx + "/sys/listdict.html",
            dataType: 'json',
            data: { headCode: "prod_tag" },
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var option = "<option></option>";
                    for (var i = 0; i < returnData.data.length; i++) {
                        prodAliexpressTags.push(returnData.data[i].name);
                        option = option + "<option value='" + returnData.data[i].name + "'>"
                            + returnData.data[i].name
                            + "</option>"
                    }
                    prodAliexpressTagsHtml = option
                    $("#smt_publish_search_form select[name=prodAttrList]").html(option);
                    form.render('select');
                } else {
                    layer.msg(returnData.msg, { icon: 5 });
                }
            }
        });
    }

    // 初始化开发类型
    function initDevType () {
        commonReturnPromise({
            url: ctx + '/enum/getPreProdDevTypeEnum.html',
            type: "post",
        }).then(res => {
            devTypeList= res
            commonRenderSelect('smt_publish_devType', res, { name: "name", code: "code" })
        }).then(() => {
            form.render()
        })
    }


    // tab左侧按钮渲染
    function tabLeftBtnsRender (data) {
        var getTpl = smtPublish_tab_leftBtns_Tpl.innerHTML
        var view = document.getElementById('smtPublish_tab_leftBtns')
        laytpl(getTpl).render(data, function (html) {
            view.innerHTML = html;
        });
    }
    //清空
    $("#smt_publish_search_reset").click(function () {
        $("#smt_publish_search_form")[0].reset();
        $("#smtPublish_cateDiv").html('')
        $("#smtPublish_cateId").val('')
        // $('#smt_publish_search_form select[xm-select=smt_publish_isSales] option').attr('selected', false)
        // $('#smt_publish_search_form select[xm-select=smt_publish_imgStatusList] option').attr('selected', false)
        setTimeout(function(){
            formSelects.render()
        },10)
    })

    //搜索
    form.on('submit(smt_publish_search_submitFilter)', function (data) {
        var { field } = data
        field.listingStatus = smtPublish_TABVALUE
        field[field.searchType] = field.searchValue
        // field[field.auditTimeLabel] = field.auditTime
        field.cateId = $("#smt_publish_search_form input[name=cateId]").val()

        field.isExactQuery = $("#smt_publish_search_form input[name=isExactQuery]").prop("checked");
        field.roleNames = 'smt专员'
        if (field.auditTimeLabel == 'baseModelAuditTime') {
            field.baseModelAuditTimeFrom = !!field.auditTime ? field.auditTime.split(' - ')[0] : ''
            field.baseModelAuditTimeTo = !!field.auditTime ? field.auditTime.split(' - ')[1] : ''
        } else if (field.auditTimeLabel == 'baseModelTime') {
            field.baseModelCreateTimeFrom = !!field.auditTime ? field.auditTime.split(' - ')[0] : ''
            field.baseModelCreateTimeTo = !!field.auditTime ? field.auditTime.split(' - ')[1] : ''
        } else if (field.auditTimeLabel == 'smtModelTime') {
            field.smtModelCreateTimeFrom = !!field.auditTime ? field.auditTime.split(' - ')[0] : ''
            field.smtModelCreateTimeTo = !!field.auditTime ? field.auditTime.split(' - ')[1] : ''
        } else if (field.auditTimeLabel == 'listingCreatTime') {
            field.listingCreatTimeFrom = !!field.auditTime ? field.auditTime.split(' - ')[0] : ''
            field.listingCreatTimeTo = !!field.auditTime ? field.auditTime.split(' - ')[1] : ''
        }
        if(smtPublish_TABVALUE == -2){ // 模板页签
            let oaCateIdList = !!field.oaCateIdList?JSON.parse(field.oaCateIdList):[];
            field.oaCateIdListStr = oaCateIdList?.join()
        }else{
            delete field.oaCateIdListStr
        }
        delete field.oaCateIdList
        delete field.searchType
        delete field.searchValue
        delete field.auditTimeLabel
        delete field.auditTime
        var choosedTab = TAB_LIST.find(item => item.value == smtPublish_TABVALUE)
        tableRender(choosedTab.tableId, field)
    })

    // table的id，查询的参数
    function tableRender (id, obj) {
        //速卖通table
        var tplColumns = [
            [ //表头
                {
                    type: 'checkbox'
                }, {
                    field: "imageUrl",
                    title: "缩略图",
                    unresize: true,
                    width: 65,
                    style: "text-align:left;",
                    templet: '#smt_publish_img_tpl'
                }, {
                    field: 'cnTitle',
                    title: '商品',
                    templet: '#smtPublish_cnTitleTpl'
                }, {
                    field: 'pSku',
                    title: '父SKU',
                    templet: function (d) {
                        var spanDom = "";
                        if (d.logisAttrList) {
                            var logisAttrList = d.logisAttrList.split(",");
                            for (var i = 0; i < logisAttrs.length; i++) {
                                if ($.inArray(logisAttrs[i].name, logisAttrList) >= 0) {
                                    spanDom += "<span class='layui-bg-red hp-badge ml5'>" + logisAttrs[i].alias + "</span>";
                                }
                            }
                        }
                        let minListingPrice = d.minListingPrice != undefined ? d.minListingPrice : ''
                        let maxListingPrice = d.maxListingPrice != undefined ? d.maxListingPrice : ''
                        var price = "$" + minListingPrice + " ~ $" + maxListingPrice;
                        return "<div>" + d.pSku + "</div>" + "<div style='color:#999;'>" + d.prodAttrList + "</div>" + "<div title='子SKU刊登价预估'>" + price + "</div><div>" + spanDom + "</div>";
                    },
                    width: 140
                }, {
                    width: 400,
                    title: "<table border='0' class='layui-table' width='100%'><tr><th width='40%'>subSKU</th><th width='10%'>重量(g)</th><th width='10%'>成本</th><th width='30%'>预计可用库存含在途/不含在途</th><th width='10%'>在售</th></tr></table>",
                    templet: "#smtPublish_producttpl"
                },

                {
                    field: 'storeNum',
                    title: '刊登状态',
                    width: 100,
                    templet: '#smtPublish_storeNumTpl'
                }, {
                    field: 'salesNum',
                    width: 100,
                    title: '销量(30天)',
                    templet: '#smtPublish_salesNumTpl'
                }, {
                    field: 'devNote',
                    title: '开发备注',
                    templet: '<div><pre class="smtPublish-devNote">{{d.devNote ||""}}</pre></div>',
                    width: 100
                }, {
                    field: 'saleNote',
                    title: '销售备注',
                    templet: '<div><pre>{{d.saleNote ||""}}</pre><i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;" lay-event="smtPublish_saleNote"></i></div>',
                    width: 90
                }, {
                    field: 'isTort',
                    title: '侵权状态',
                    templet: '#smtPublish_tortTpl',
                    width: 150
                }, {
                    field: 'time',
                    title: '时间',
                    templet: '#smtPublish_timeTpl',
                    width: 150
                }, {
                    title: '操作',
                    width: 140,
                    templet: '#smt_publist_toolbar'
                }
            ]
        ]
        //刊登相关table
        var listingColumns = [[
            { checkbox: true, width: 25, style: "vertical-align" },
            { field: "imageUrl", title: "缩略图", unresize: true, width: 65, style: "text-align:left;vertical-align: top;", templet: '#smt_publish_img_tpl' },
            { field: "title", title: "标题" },
            { field: "titleInfo", title: "商品名", width: 100, templet: "#smt_publish_title_tpl" },
            { field: "bizzOwnerInfo", title: "开发专员", width: 100, templet: "#smt_publish_bizzOwner_tpl" },
            { field: "sku", title: "父SKU", width: 100, templet: "#smt_publish_sku_tpl" },
            { field: "saleNum", title: "销量", width: 100, templet: "#smt_publish_salenum_tpl" },
            {
                field: "sub", unresize: true, width: 635, align: "left",
                title: "<div style='width:140px;float: left;'>模板子SKU</div>" +
                    "<div style='width:145px;float: left;'>店铺子SKU</div>" +
                    "<div style='width:60px;float: left;'>颜色</div>" +
                    "<div style='width:60px;float: left;'>尺寸</div>" +
                    "<div style='width:60px;float: left;'>售价($)</div>" +
                    "<div style='width:60px;float: left;'>售价(￥)</div>" +
                    "<div style='width:50px;float: left;'>在售</div>" +
                    "<div class='smtpublish_table_preAvailableStockType' style='width:50px;float: left;'>预计可用库存含在途/不含在途</div>",
                style: "vertical-align:top",
                templet: "#smt_publish_productInfo_tpl"
            },
            { field: "cateTreeName", title: "类目", width: 200, },
            { field: "listingTime", title: "时间", width: 110, templet: "#smt_publish_listingTime_tpl" },
            { field: "creator", title: "创建人", width: 80 },
            { title: "操作", width: 90, toolbar: "#smt_publist_toolbar" },
        ]]
        // let formHeight = $("#smt_publish_search_form")[0].clientHeight;
        // let clientHeight =
        //     window.innerHeight ||
        //     document.documentElement.clientHeight ||
        //     document.body.clientHeight ||
        //     937;
        // // 获取表格可视高度
        // let tableHeight = clientHeight - formHeight - 170;
        table.render({
            elem: '#' + id,
            method: 'post',
            url: ctx + '/aliexpresslisting/queryList.html',
            where: obj,
            // height: tableHeight,
            cols: smtPublish_TABVALUE == -2 ? tplColumns : listingColumns,
            done: function (res, cur, count) {
                //懒加载
                // imageLazyloadAll()
                imageLazyload()
                // imageLazyload($("#smtPublishCard .layui-table-body:eq(0)"))
                // imageLazyload($("[data-field=imageUrl]").closest(".layui-table-body"))
                if (res.code == "0000") {
                    var choosedTab = TAB_LIST.find(item => item.value == smtPublish_TABVALUE)
                    $('#' + choosedTab.tabId).find('span').html(res.count)
                }
                $('.smtPublish-listfail').on('mouseenter', function () {
                    var contentshow = $(this).next(".smtPublish-listfailreason").text();
                    layer.tips(contentshow, $(this), {
                        tips: [2, 'red'],
                        area: ['40%', 'auto'],
                        time: 0,
                    });
                }).on('mouseleave', function () {
                    layer.closeAll("tips");
                });
                if(obj.listingStatus == -2 || obj.listingStatus == 0 || obj.listingStatus == 2){
                    $(".smtpublish_table_preAvailableStockType").show() // 表格字段
                }else{
                    $(".smtpublish_table_preAvailableStockType").hide()
                }
            },
            page: true,
            id: id,
            limits: [50, 100, 300],
            limit: 50,
        })
    }

    //table操作按钮
    table.on("tool(smt_publish_tpl_table)", function (obj) { tableToolBar(obj) })
    table.on("tool(smt_publish_tolisting_table)", function (obj) { tableToolBar(obj) })
    table.on("tool(smt_publish_listing_table)", function (obj) { tableToolBar(obj) })
    table.on('tool(smt_publish_listingsucc_table)', function (obj) { tableToolBar(obj) })
    table.on('tool(smt_publish_listingfail_table)', function (obj) { tableToolBar(obj) });

    function tableToolBar (obj) {
        //店铺id
        var _storeAcctId = smtPublish_TABVALUE == -2 ? $("#smt_publish_search_form input[name=storeAcctId]").val() : obj.data.storeAcctId

        switch (obj.event) {
            case "viewTpl":
                smtPublish_viewTpl(obj.data.modelPId, obj.data.prodPId, obj.data.cateId, _storeAcctId, 'aliexpressTplId')  // obj.data.modelPId  smt模板id
                break;
            case "goodsDetailbindTpl":   //速卖通模板tab  的编辑详情
                smtPublish_getlistingDetail(obj.data.modelPId, _storeAcctId, 'aliexpressTplId',obj.data)
                break;
            case 'goodsDetail':  //编辑商品详情按钮
                smtPublish_getlistingDetail(obj.data.id, _storeAcctId, 'prodListingId',obj.data)
                break;
            case 'publishListing': //立即刊登  重新刊登
                smtPublish_publish(obj.data.id)
                break;
            case 'deletelisting':
                smtPublish_del(obj.data.id)  //删除
                break;
            case 'publishListingOntime': //定时刊登
                smtPublish_publish_onTime(obj.data.id)
                break;
            case 'publishListingOntimeCancel':  //取消定时刊登
                smtPublish_publish_onTime_cancel(obj.data.id)
                break;
            case 'smtPublish_saleNote': //销售备注
                var _saleNote = obj.data.saleNote ? obj.data.saleNote : "";
                smtPublish_table_saleNote(obj.data.prodPId, _saleNote, obj.tr)
                break;
            case 'smtPublish_openItem':  //竞品数
                smtPublish_table_openItem(obj.data.prodPId)
        };
    }

    //禁售设置
    form.on('checkbox(smtPublish_prohibit)', function (data) {
        var requestData = {
            prodPId: data.value,
            platCode: "aliexpress",
            ifFixedInable: data.elem.checked
        }
        var msg = data.elem.checked ? "禁售成功" : "取消禁售成功"
        layui.admin.load.show();
        $.ajax({
            type: 'post',
            url: ctx + '/prohibit/editOrAddProdProhibitMapping.html',
            data: JSON.stringify(requestData),
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                layui.admin.load.hide();
                if (res.code == '0000') {
                    layer.msg(msg, { icon: 1 });
                } else {
                    layer.msg(res.msg, { icon: 5 });
                    data.elem.checked = !data.elem.checked;
                    form.render("checkbox");

                }
            }
        })
    });

// 单个设置暂不刊登
    form.on('switch(smt_publist_toolbar_checkbox)', function(data) {
        let storeAcctIdList = formSelects.value('smtPublish_storeAcct_sel', 'val');
        let { checked } = data.elem
        // layer.confirm(`确认要修改暂不刊登为${data.elem.checked?'”是“':'”否“'}吗？`, { icon:3,closeBtn: 0,btn: ['确认', '取消'] }, function (index) {
            commonReturnPromise({
                url: ctx + '/aliexpresslisting/setUnlistingTemp',
                type: 'post',
                contentType: "application/json",
                params: JSON.stringify({
                    idList: [$(data.elem).data("modelpid")],
                    storeAcctIdList,
                    unlistingTemp: checked
                })
            }).then(res => {
                layer.msg(res, {icon: 1})
            }).catch(() => {
                data.elem.checked = !checked
                form.render();
            })
        // }, function() {
        //     data.elem.checked = !checked
        //     form.render();
        // });
    });

    //table全选
    table.on("checkbox(smt_publish_tolisting_table)", function (obj) { tableCheckbox(obj, "smt_publish_tolisting_table") })
    table.on("checkbox(smt_publish_listing_table)", function (obj) { tableCheckbox(obj, "smt_publish_listing_table") })
    table.on('checkbox(smt_publish_listingsucc_table)', function (obj) { tableCheckbox(obj, "smt_publish_listingsucc_table") })
    table.on('checkbox(smt_publish_listingfail_table)', function (obj) { tableCheckbox(obj, "smt_publish_listingfail_table") });

    function tableCheckbox (obj, tableId) {
        var checkStatus = table.checkStatus(tableId)
        if (checkStatus.data.length) {
            checkStatus.data.forEach(fatherItem => {
                //选中主表的一项，其子表全选
                // fatherItem.subList.forEach(() => {
                //     $('#smtPublish_data_table_son_' + fatherItem.id).find("td:first-child input").prop('checked', true)
                // })
            })
        }
        // //单选点击选择取消
        if (JSON.stringify(obj.data) != '{}') {
            $('#smtPublish_data_table_son_' + obj.data.id).find("td:first-child input[type='checkbox']").prop('checked', obj.checked)
        }
        // // 全选取消
        if (!checkStatus.data.length) {
            $('.smtPublish_table_son').find("td:first-child input[type='checkbox']").prop('checked', false)
        }
        form.render()
    }

    //生产刊登弹窗 SKU信息 table的checkbox全选、全不选
    form.on('checkbox(smtPublish_listingInfo_allCheked)', function (obj) {
        if (obj.elem.checked) {
            $('#smtPublish_listingInfo_sub_tab2').find('input[type=checkbox]').prop('checked', true)
        } else {
            $('#smtPublish_listingInfo_sub_tab2').find('input[type=checkbox]').prop('checked', false)
        }
        form.render('checkbox')
    })

  //半托管信息 table的checkbox全选、全不选
  form.on('checkbox(smtPublish_aeHalfListingInfo_allCheked)', function (obj) {
    if (obj.elem.checked) {
      $('#smtPublish_AESubSkuInfo2').find('input[type=checkbox]').prop('checked', true)
    } else {
      $('#smtPublish_AESubSkuInfo2').find('input[type=checkbox]').prop('checked', false)
    }
    form.render('checkbox')
  })


  //生产刊登弹窗 SKU信息 table的checkbox单选、单不选
  form.on("checkbox(smtPublish_listingInfo_sCheked)", function (obj) {
    if (obj.elem.checked) {
      var rowsLength = $('#smtPublish_listingInfo_sub_tab2').find('input[name=singlechecked]').length
      var checkedLength = $('#smtPublish_listingInfo_sub_tab2').find('input[name=singlechecked]:checked').length
      if (rowsLength === checkedLength) {
        $('#smtPublish_listingInfo_sub_tab2').find('input[name=allchecked]').prop('checked', true)
      }
    } else {
      $('#smtPublish_listingInfo_sub_tab2').find('input[name=allchecked]').prop('checked', false)
    }
    form.render('checkbox')
  })

    // 生产刊登弹窗 发货地&区域定价 选择发货地
    form.on("checkbox(smtPublish_deliveryPlace)", function (obj) {
        var { checked, dataset } = obj.elem
        var choosePriceType = $('#smtPublish_editDetailForm').find('select[name=adjustPriceType] option:selected').val()
        if (checked) {
            //发货地发货地 & 区域定价
            var checkedDom = `<tr data-name="${dataset.name}">
            <td>${dataset.name}</td>
            <td class>
                <select name="${dataset.name}" class="smtPublish_placePrice_table_priceTpl" lay-search>
                    <option value="">请选择调价模板</option>
                        ${subPublish_REGION_PRICE_LIST.filter(item => item.adjustPriceType == choosePriceType).map(item => `<option value=${item.id} >${item.templateName}</option>`).join('')}
                </select>
            </td>
        </tr>`
            $('#smtPublish_placePrice_table').find('tbody').append(checkedDom)
            //删除默认行
            $('#smtPublish_placePrice_table').find(`tr[data-name=NONE]`).remove()
            $('#smtPublish_editDetailForm select[name="' + dataset.name + '"]').val('')

            // sku信息table
            // 如果发货地是none
            let isOriginNone =  $('#smtPublish_SubSkuInfo2').find('tr:first').data('place') ==='NONE' ? true : false
            // 如果发货地是none,直接替换
            if(isOriginNone){
                $('#smtPublish_SubSkuInfo2').find('tr').each(function(){
                    $(this).data('place', dataset.name)
                    $(this).find('#smtPublish_skuInfo_deliveryPlace').text(dataset.name)
                    let storeSkuText = $(this).find('input[name=skuInfo_storeSSku]').val().split('/')[0]+ '/'+smtPublish_randomCode(5) + '/'+dataset.name
                    $(this).find('input[name=skuInfo_storeSSku]').val(storeSkuText)
                })
            }else{
                // 找到最多的行的发货地
                let delivPlaObj = {}
                $('#smtPublish_deliveryPlace').find('input:checked').each(function(){
                    delivPlaObj[$(this).data('name')] = 0
                })
                $('#smtPublish_SubSkuInfo2').find('tr').each(function(){
                    delivPlaObj[$(this).data('place')] += 1
                })
                let num = Object.keys(delivPlaObj).reduce((pre, cur) => {
                    const res = Math.max(pre, delivPlaObj[cur])
                    return res
                  }, 0)
                  let _index = Object.values(delivPlaObj).findIndex(item=>item==num)
                  const curMoreDilve = Object.keys(delivPlaObj)[_index]
                  $('#smtPublish_SubSkuInfo2').find('tr').each(function(){
                    if($(this).data('place')===curMoreDilve){
                        let newTrHtml = $(this).html().replaceAll($(this).data('place'),dataset.name)
                        let prodSSku = $(this).data('prodssku')
                        let prodpid = $(this).data('prodpid')
                        let prodpsku = $(this).data('prodpsku')
                        $(this).after(`<tr data-place=${dataset.name} data-prodssku="${prodSSku}" data-prodpid="${prodpid}" data-isnewtr="false" data-prodpsku="${prodpsku}">${newTrHtml}</tr>`)
                    }
                })
            }
            form.render()
        } else if (!checked) {
            //发货地 & 区域定价
            $('#smtPublish_placePrice_table').find(`tr[data-name=${dataset.name}]`).remove()
            //添加默认行
            if (!$('#smtPublish_placePrice_table').find('tbody tr').length) {
                var defaultPlaceTr = `<tr data-name="NONE">
                <td></td>
                <td class>
                    <select name="NONE" class="smtPublish_placePrice_table_priceTpl" lay-search>
                        <option value="">请选择调价模板</option>
                            ${subPublish_REGION_PRICE_LIST.filter(item => item.adjustPriceType == choosePriceType).map(item => `<option value=${item.id} >${item.templateName}</option>`).join('')}
                    </select>
                </td>
            </tr>`
                $('#smtPublish_placePrice_table').find('tbody').append(defaultPlaceTr)
            }
            // sku信息table
            // 如果没有发货地
            let isNodeliveryPla = !$('#smtPublish_deliveryPlace').find('input:checked').length ? true : false
            // 如果没有发货地是直接替换none
            if(isNodeliveryPla){
                $('#smtPublish_SubSkuInfo2').find('tr').each(function(){
                    $(this).data('place', 'NONE')
                    $(this).find('#smtPublish_skuInfo_deliveryPlace').text('NONE')
                    let storeSkuText = $(this).find('input[name=skuInfo_storeSSku]').val().split('/')[0]
                    $(this).find('input[name=skuInfo_storeSSku]').val(storeSkuText +'/'+smtPublish_randomCode(5))
                })
            }else{
                $('#smtPublish_SubSkuInfo2').find('tr').each(function(){
                    if($(this).data('place')===dataset.name){
                        $(this).remove()
                    }
                })
            }
            form.render()
        }

        // smtPublish_upload_skuImg()
        // smtPublish_remove_skuImg()
        // smtpublish_del_skuTr()
        // smtpublish_changeSkuVal()

        //SKU信息
        //表头的全选去掉
        // $('#smtPublish_listingInfo_sub_tab2').find('input[name=allchecked]').prop('checked', false)
        // var deliveryPlace = subPublish_ModalDetail_Data.deliveryPlace ? subPublish_ModalDetail_Data.deliveryPlace.split(',') : []
        // if (checked) {
        //     deliveryPlace.push(dataset.name)
        //     subPublish_ModalDetail_Data.deliveryPlace = deliveryPlace.filter(item => item != 'NONE').join(',')
        // } else {
        //     deliveryPlace.splice(deliveryPlace.findIndex(e => e == dataset.name), 1)
        //     subPublish_ModalDetail_Data.deliveryPlace = deliveryPlace.join(',')
        // }
        // var paramsId = smtPublish_TABVALUE != -2 ? { prodListingId: subPublish_ModalDetail_Data.id } : { aliexpressTemplateId: subPublish_ModalDetail_Data.aliexpressTemplateId }

        // commonReturnPromise({
        //     url: ctx + '/aliexpress/publish/regensku.html',
        //     params: smtPublish_TABVALUE == -2 ? { ...paramsId, deliveryPlace: subPublish_ModalDetail_Data.deliveryPlace || 'NONE', storeAcctId: $('#smtPublish_editDetailForm input[name=storeAcctId]').val() } : { ...paramsId, deliveryPlace: subPublish_ModalDetail_Data.deliveryPlace || 'NONE' }
        // }).then(data => {
        //     var getTpl = smtPublish_SubSkuInfo2_tpl.innerHTML, view = document.getElementById('smtPublish_SubSkuInfo2');
        //     laytpl(getTpl).render(data, function (html) {
        //         console.log(data)
        //         view.innerHTML = html;
        //     });
        //     // 添加区域调价之直接调价的列
        //     if ($('#smtPublish_editDetailForm').find('select[name=adjustPriceType]').val() == 3) {
        //         $('#smtPublish_listingInfo_sub_tab2>thead>tr>th').each(function (curIndex) {
        //             // 相关列的data-sort大于0，
        //             let sort = $(this).attr('data-sort')
        //             if (Number(sort) > 0) {
        //                 let code = $(this).attr('data-code')
        //                 let countryName = $(this).attr('data-name')
        //                 // 补上原有的列
        //                 let col = `<td class="taCenter smtPublish-skuInfo-row-width" data-sort="${sort}"><input class="layui-input smtPublish_${code}"
        //                 onchange="smtPublish_changeRegionPriceFixPrice(this)" name="smtPublish_${code}"
        //              data-code="${code}" data-sort="${sort}" data-name="${countryName}"/></td>`
        //                 $(`#smtPublish_listingInfo_sub_tab2>tbody>tr :nth-child(${curIndex})`).after(col)
        //                 //  单个批量调价
        //                 let shipTypeDom = $(this).find('select[name=regionPriceFixPriceByShipType]')
        //                 smtPublish_getRegionPriceFixPriceByShipType(shipTypeDom.val(), shipTypeDom)
        //             }
        //         })
        //     }
        //     imageLazyload('#smtPublish_listingInfo_sub_tab2>tbody')
        //     form.render()
        // }).catch(err => layer.msg(err || err.message, { icon: 2 }))

        // 根据这个isSupportHalfManage 来显示参与不参与半托管
        if(isSupportHalfManage){
            $('#isNotOpenJoinAEHalf').hide();
            $('#isOpenJoinAEHalf').show();

            // 只要速卖通刊登里面勾选了发货地 那么半托管就禁用 默认为false 且列表信息隐藏
            let $aeHalfManageInfo = $('#ae_half_manage_info');
            if($('#smtPublish_deliveryPlace').find('input:checked').length){
                // 有发货地 半托管为false 且为禁用 填写半托管信息隐藏
                isJoin = 'false'
                $('#isJoin input:radio').prop('disabled', true)
                $aeHalfManageInfo.addClass('ae_half_manage_table_not_join')
            }else{
                isJoin = 'true'
                $('#isJoin input:radio[disabled]').removeAttr('disabled');
                if(subPublish_ModalDetail_Data.prodListingSubSkuAliexpressSmts.length){
                    renderAeHalfTableBySkuList()
                }
                $aeHalfManageInfo.removeClass('ae_half_manage_table_not_join')
            }
            $(`#isJoin input[name=isJoin][value=${isJoin}]`).prop('checked', true)
            form.render()
        }else{
            $('#isOpenJoinAEHalf').hide();
            $('#isNotOpenJoinAEHalf').show();
            isJoin = 'false'
            const $aeHalfManageInfo = $('#ae_half_manage_info');
            $aeHalfManageInfo.addClass('ae_half_manage_table_not_join')
        }

    })

    function smtPublish_randomCode(length=5){
        const code = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'
        return [...Array(length)].map(() => code[Math.floor(Math.random() * code.length)]).join('');
    }

    //生产刊登弹窗 发货地&区域定价 选择调价方式
    form.on("select(smtPublish_adjustPriceType)", function (obj) {
        if (smtPublish_adjustPriceTypeVal != obj.value) {
            if (obj.value == 3) {
                //直接调价
                smtPublish_CountryPrice()
                // 国家模板
                smtPublish_getTplCtyByStore()
                $('#smtPublish_placePrice_table').parent('div').hide()
                $('#smtPublish_placePrice_country').show()
                $('#smtPublish_placePrice_country_btn').show()
                $('#smtPublish_regionPriceTpl_div').show()
            } else {
                $('#smtPublish_placePrice_country').hide()
                $('#smtPublish_placePrice_table').parent('div').show()
                $('#smtPublish_placePrice_country_btn').hide()
                $('#smtPublish_regionPriceTpl_div').hide()
                // 删除sku信息table 的直接报价相关的列,直接报价的列的cell都有data-code的值不为0，
                $("#smtPublish_listingInfo_sub_tab2>thead>tr>th").filter(function () {
                    var code = $(this).attr('data-sort')
                    return !!code && Number(code) > 0 && Number(code) <999
                }).remove()
                $("#smtPublish_listingInfo_sub_tab2>tbody>tr>td").filter(function () {
                    var code = $(this).attr('data-sort')
                    return !!code && Number(code) > 0 && Number(code) <999
                }).remove()

                var _obj = subPublish_REGION_PRICE_LIST.filter(item => item.adjustPriceType == obj.value)
                var str = '<option value="">请选择调价模板</option>';
                for (var i = 0; i < _obj.length; i++) {
                    str += "<option value='" + _obj[i].id + "'>" + _obj[i].templateName + "</option>";
                }
                $(".smtPublish_placePrice_table_priceTpl").html(str);
                form.render("select");
            }
            smtPublish_adjustPriceTypeVal = obj.value
        }
    })

    // 选择区域调价模板
    form.on('select(smtPublish_regionPriceTpl)', function (obj) {
        let formDom = $('#smtPublish_placePrice_country')
        // 选中模板对应的国家列表
        let { countryList } = subPublish_REGION_PRICE_LIST.filter(item => item.id == obj.value)[0]
        // 通过countryList一次性选中需要选择的国家，都是清空选中国家，重新赋值
        formDom.find('input[name="adjustPriceCountry"]').prop('checked', false)
        // 删除sku信息table 的直接报价国家对应的列,直接报价的列的cell都有data-code的值不为0，
        $("#smtPublish_listingInfo_sub_tab2>thead>tr>th").filter(function () {
            var code = $(this).attr('data-sort')
            return !!code && Number(code) > 0 && Number(code) <999
        }).remove()
        $("#smtPublish_listingInfo_sub_tab2>tbody>tr>td").filter(function () {
            var code = $(this).attr('data-sort')
            return !!code && Number(code) > 0 && Number(code) <999
        }).remove()
        // 选中对应国家checkbox
        countryList.forEach(item => {
            formDom.find(`input[name=adjustPriceCountry][data-code=${item}]`).prop('checked', true)
        })
        // 有序添加列
        formDom.find('input[name=adjustPriceCountry]:checked').each(function () {
            let sortArr = []
            Array.from($("#smtPublish_listingInfo_sub_tab2>thead>tr>th")).forEach(item => {
                sortArr.push($(item).attr('data-sort'))
            })
            let code = $(this).data('code')
            let sort = $(this).data('sort')
            let name = $(this).data('name')
            let { th, col } = smtPublish_skuCountryCol({ sort, code, name })
            let _curIndex = sortArr.findIndex(item => Number(sort) < Number(item))
            if (_curIndex == -1) {
                $("#smtPublish_listingInfo_sub_tab2>thead>tr").append(th)
                $("#smtPublish_listingInfo_sub_tab2>tbody>tr").append(col)
            } else {
                $("#smtPublish_listingInfo_sub_tab2>thead>tr>th").eq(_curIndex).before(th);
                $(`#smtPublish_listingInfo_sub_tab2>tbody>tr td:nth-child(${_curIndex + 1})`).before(col)
            }
        })
        form.render()
    })

    function smtPublish_skuCountryCol (obj) {
        let { sort, code, name } = obj
        let th = `<th data-sort="${sort}" data-code="${code}" data-name="${name}" class="layui-form-item smtPublish-skuInfo-row-width">
                <div class="layui-form-label smtPublish-skuInfo-row-padding">${name}(${code})</div>
                <div class="layui-input-block smtPublish-skuInfo-row-ml"><select name="regionPriceFixPriceByShipType" lay-filter="smtPublish_regionPriceFixPriceByShipType">
                <option value="GENERALECONOMY">普货-经济</option>
                <option value="GENERALSIMPLE">普货-简易</option>
                <option value="GENERALSTANDARD">普货-标准</option>
                <option value="SPECIALECONOMY">特货-经济</option>
                <option value="SPECIALSIMPLE">特货-简易</option>
                <option value="SPECIALSTANDARD">特货-标准</option>
            </select>
                </div>
            </th>`
        let col = `<td class="taCenter smtPublish-skuInfo-row-width" data-sort="${sort}">
                <div class="disFCenter">
                    <div class="w50 unit">$</div>
                    <input class="layui-input smtPublish_${code}" onchange="smtPublish_changeRegionPriceFixPrice(this)"
                    onblur="smtPublish_skuInfo_blur_area_price(this)"
                    name="smtPublish_${code}" data-code="${code}"
                    data-sort="${sort}" data-name="${name}"/>
                </div>
                <div class="disFCenter">
                    <div class="w50 unit">￥</div>
                    <input class="layui-input smtPublish_${code}" onchange="smtPublish_changeRegionPriceFixPrice(this)"
                    onblur="smtPublish_skuInfo_blur_area_priceCny(this)"
                    name="smtPublish_${code}_priceCny" data-code="${code}"
                    data-sort="${sort}" data-name="${name}"/>
                </div>
            </td>`
        return { th, col }
    }

    // 区域定价之直接定价 选择区域
    form.on("checkbox(smtPublish_directCountryPrice)", function (obj) {
        var { checked, dataset } = obj.elem
        let sortArr = []
        Array.from($("#smtPublish_listingInfo_sub_tab2>thead>tr>th")).forEach(item => {
            sortArr.push($(item).attr('data-sort'))
        })
        // 选中添加列，且有序添加
        if (checked) {
            let { th, col } = smtPublish_skuCountryCol(dataset)
            let _curIndex = sortArr.findIndex(item => Number(dataset.sort) < Number(item))
            if (_curIndex == -1) {
                $("#smtPublish_listingInfo_sub_tab2>thead>tr").append(th)
                $("#smtPublish_listingInfo_sub_tab2>tbody>tr").append(col)
            } else {
                $("#smtPublish_listingInfo_sub_tab2>thead>tr>th").eq(_curIndex).before(th);
                $(`#smtPublish_listingInfo_sub_tab2>tbody>tr td:nth-child(${_curIndex + 1})`).before(col)
            }
            //未被选中，删除列
        } else {
            let _curIndex = sortArr.findIndex(item => Number(dataset.sort) == Number(item))
            if (_curIndex != -1) {
                $("#smtPublish_listingInfo_sub_tab2>thead>tr>th").eq(_curIndex).remove();
                $(`#smtPublish_listingInfo_sub_tab2>tbody>tr td:nth-child(${_curIndex + 1})`).remove()
            }
        }
        form.render()
    })

    // sku信息 选择区域调价单列操作 单个国家调价
    form.on('select(smtPublish_regionPriceFixPriceByShipType)', function (obj) {
        smtPublish_getRegionPriceFixPriceByShipType(obj.value, $(obj.elem))
    })

    function smtPublish_getRegionPriceFixPriceByShipType (domVal, dom) {
        var skuList = []
        $('#smtPublish_listingInfo_sub_tab2>tbody>tr').find('.smtPublish_skuInfo_storeSSku').each(function () {
            let trParent = $(this).parents('tr')
            let listingPrice = trParent.find('td input[name=skuInfo_price]').val() //同行的定价
            skuList.push({
                prodSSku: $(this).attr('attr-prodSSku'),
                storeSubSku: $(this).find('input[name=skuInfo_storeSSku]').val(),
                storeAcctId: $('#smtPublish_editDetailForm').find('input[name=storeAcctId]').val(),
                listingPrice: listingPrice == '' ? null : Number(listingPrice)
            })
        })
        // 通过type的值，在线/刊登
        var params = {
            grossProfitRate: $('#smtPublish_editDetailForm input[name=grossProfitRate]').val(),
            discountRate: $("#smtPublish_editDetailForm input[name=discountRate]").val(),
            shipType: domVal,
            countryCode: dom.parents('th').attr('data-code'),
            skuList: skuList,
            type: 'LISTING'
        }
        commonReturnPromise({
            url: ctx + '/aliexpress/publish/regionPriceFixPriceByShipType',
            params: JSON.stringify({ ...params }),
            type: 'post',
            contentType: 'application/json;charset=UTF-8'
        }).then(data => {
            // tbody
            data.forEach(item => {
                $("#smtPublish_listingInfo_sub_tab2>tbody").find('.smtPublish_skuInfo_storeSSku').each(function () {
                    if ($(this).find('input[name=skuInfo_storeSSku]').val() == item.storeSubSku) {
                        $(this).parent('tr').find(`input[name=smtPublish_${item.countryCode}]`).val(item.price)
                        $(this).parent('tr').find(`input[name=smtPublish_${item.countryCode}_priceCny]`).val(item.priceCny)
                        if (!item.normal) {
                            $(this).parent('tr').find(`input[name=smtPublish_${item.countryCode}]`).parents('td').css('background', 'yellow')
                        } else {
                            $(this).parent('tr').find(`input[name=smtPublish_${item.countryCode}]`).parents('td').css('background', 'transparent')
                        }

                    }
                })
            })
        }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
    }

      // 触发长发货期默认值选择
      form.on('select(select_preserveCategory)', function(data){
        smtPublish_updatePreserveCategory(data.value)
    });

    // 批量生成弹窗 监听店铺select选择
    formSelects.on('smtPublish_batchPublish_store', function (id, vals, val, isAdd, isDisabled) {
        let params = vals.map(item => item.value)
        smtPublish_renderBatchPublishTpl(params)
    }, true)

    //分类属性 checkbox触发事件 如果选中other，就显示input框
    form.on('checkbox(smtPublish_checkOtheb_input)', function (data) {
        if ($(data.elem).attr('enname') == "Other") {
            if (data.elem.checked) {
                var inputDomName = $(data.elem).attr('name')
                var parentDom = $(data.elem).parents('.smtPublish_mentalProperty_checkbox ')
                var inputDom = `<input class="layui-input smtPublish-checkbox-other-input mr10" name = "${inputDomName}"
placeholder = "当选择其它选项时，需要填此项" /> `
                parentDom.append(inputDom)

            } else {
                var parentDom = $(data.elem).parents('.smtPublish_mentalProperty_checkbox ')
                var inputDom = parentDom.find('.smtPublish-checkbox-other-input')
                inputDom.length && inputDom.remove()
            }
        }
    })
    //分类属性 下拉框触发事件 如果选中other，就显示input框
    form.on('select(smtPublish_selOtheb_input)', function (data) {
        let hasOther = false
        Array.from($(data.elem).find("option")).forEach((item, index) => {
            if ($(item).attr('enname') == 'Other') {
                hasOther = true
            }
        })
        // 下拉选项含有other
        if (hasOther) {
            // 选中other添加
            if ($(data.elem).find("option:selected").attr('enname') == 'Other') {
                var inputDomName = $(data.elem).attr('name')
                var parentDom = $(data.elem).parents('.smtPublish-select-block')
                var inputDom = `<div class="layui-col-md2 smtPublish-sel-other-input" > <input class="layui-input mr10" name="${inputDomName}"
    placeholder="当选择其它选项时，需要填此项" /></div > `
                parentDom.after(inputDom)
            } else {  //选中其它的就删除
                var parentDom = $(data.elem).parents('.smtPublish-select-block')
                var inputDom = parentDom.next('.smtPublish-sel-other-input')
                inputDom.remove()
            }
        }
        // 产地选择中国大陆 展示省份
        let formItemDom = $(data.othis[0]).parents(".layui-form-item")[0]
        if($(formItemDom).find('select').attr('attrid')=='219'){
          let proviceDom =  $('#smtPublish_editDetailForm select[attrid=266081643]').parents(".layui-form-item")[0]
            if(data.value=='9441741844'){
                $(proviceDom).show()
            }else{
                $(proviceDom).hide()
            }
        }

    });

    // 更多选填属性显示隐藏
    $(document).on("click", "#smtPublish_to_toggle", function () {
        $("#smtPublish_to_toggle").parent().nextAll("div").toggle();
    })

    // 处理layer的分类属性
    function attrFunc (attr) {
        // 设置个标识，第一次遇到非必填项的时候，加上“更多选填属性”字样
        // attr的数据是前面是必填项，后面是非必填项排序的
        let Flag = 0, html = '';
        attr.forEach(function (item, index) {
            let type = item.attributeShowTypeValue, redStar = '', dom = '', otherInput = [];

            let listboxTpl = `<div class="layui-col-lg8" >
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block">
                        <select name=":attrName" class=":class" attrId=":attrId" attr=":attr" lay-filter=":class">:optionList</select>
                        </div></div >:otherInput`
            let checkboxTpl = `<div class="layui-col-lg12" >
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block smtpublish-checkboxGrid">
                        :checkboxList
                        </div></div >:otherInput`
            let inputlTpl = `<div class="layui-col-lg8" >
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block">
                        :inputList
                        </div></div > `
            let intervalTpl = `<div class="layui-col-lg8" >
                        <label class="layui-form-label :redStar">:attrName</label>
                        <div class="layui-input-block dis_flex_start">
                        <input class="layui-input :class1" attrId=":attrId" indexFlag="1" attr=":attr">
                        <input class="layui-input :class2" attrId=":attrId" indexFlag="2" attr=":attr" style="margin-left: 4px;">
                        </div></div>`

            let otherHtml = `<div class="layui-col-lg8 smtTemplateOther" style = "display: none;" >
    <div class="layui-input-block">
        <input class="layui-input" placeholder="当选择其他选项时，需要填此项">
    </div></div > `

            if (item.required == false && Flag == 0) {  // 第一次出现非必填属性，塞个按钮
                Flag = 1;
                dom += `<div class="layui-col-lg8 layui-col-md8 mb10 mt10" > <a id="smtTemplate_to_toggle" style="color: #00BFFF;cursor: pointer">更多选填属性</a></div > `;
            }

            if (type == "list_box") {
                dom += listboxTpl
                var optionList = '<option value="">请选择</option>';
                if (item.categoryAttributeValuesSmts != undefined) {
                    item.categoryAttributeValuesSmts.forEach(function (attrVal) {
                        optionList += `<option value = "${attrVal.categoryAttributeValueId}" ${attrVal.categoryAttributeValueId == '9441741844' ? "selected" : ''} > ${attrVal.valueNameZn} (${attrVal.valueNameEn})</option > `;
                    });
                    otherInput = item.categoryAttributeValuesSmts.filter(item => item.valueNameEn == "Other")
                }
                dom = dom.replace(":optionList", optionList);
            } else if (type == "check_box") {
                dom += checkboxTpl
                let checkboxList = ''
                if (item.categoryAttributeValuesSmts != undefined) {
                    item.categoryAttributeValuesSmts.forEach(function (attrVal) {
                        checkboxList += `<span class="" > <input lay-skin="primary" name="checkBoxAttrName:attrId" type="checkbox" title="${attrVal.valueNameZn}(${attrVal.valueNameEn})" value="${attrVal.categoryAttributeValueId}" attr=":attr" lay-filter="checkBoxAttrName:attrId"></span>`;
                    });
                    otherInput = item.categoryAttributeValuesSmts.filter(item => item.valueNameEn == "Other")
                }
                dom = dom.replace(":checkboxList", checkboxList);
            } else if (type == "input") {
                dom += inputlTpl
                let inputList = ''
                if (item.categoryAttributeValuesSmts !== undefined) {
                    inputList += `<input type = "text" class="layui-input :class" name = ":attrName" list = ":class" attrId = ":attrId" attr = ":attr" > <datalist id=":class"><option value="">请选择</option>`;
                    item.categoryAttributeValuesSmts.forEach(function (attrVal) {
                        inputList += `<option value="${attrVal.categoryAttributeValueId}">${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>`;
                    });
                    inputList += `</datalist>`
                } else {
                    inputList += `<input class="layui-input :class" value = "" attrId = ":attrId" attr = ":attr" > `;
                }
                dom = dom.replace(":inputList", inputList);
            } else if (type == "interval") {
                dom += intervalTpl
            }


            if (item.required) {
                redStar += "redStar"
            }

            dom = dom.replace(":otherInput", otherInput.length == 0 ? '' : otherHtml);
            dom = dom.replace(":redStar", redStar);
            dom = dom.replace(/:attrName/g, `${item.attributeNameZn} (${item.attributeNameEn})`);
            dom = dom.replace(/:class/g, `${item.required}${item.attributeId} `);
            dom = dom.replace(/:attrId/g, item.attributeId);
            dom = dom.replace(/:attr/g, item.attributeNameZn);

            html += dom;
        })
        $("#smtpublishSMTnormalAttrList").html(html)  // 分类属性
        form.render();
    }

    // 处理layer的分类属性和自定义属性
    function aliexpressTemplateAttrsFunc (aliexpressTemplateAttrs) {
        let str = ""
        aliexpressTemplateAttrs.forEach(function (item, index) {
            if (item.attrId == undefined) { // 自定义属性
                let str = `<div class="layui-col-lg8 layui-col-md8 smtAddAttrListContain" > <div class="layui-input-block dis_flex"><input readonly class="layui-input" value="${item.attr || ''}"><input readonly class ="layui-input" value="${item.attrValue || ''}" style="margin-left: 4px;"></div></div>`;
                $("#smtpublishSMTsalePropAttrList").append(str);
            } else {  // 分类属性
                let inputLen = $(`#smtpublishSMTnormalAttrList input[attrid = ${item.attrId}]`)
                let selectLen = $(`#smtpublishSMTnormalAttrList select[attrid = ${item.attrId}]`)
                let checkboxLen = $(`#layernewsmtpublish input[name = checkBoxAttrName${item.attrId}]`)
                if (inputLen.length != 0) {
                    setTimeout(function () {
                        let indexNumber = index;
                        inputLen.each(function () {
                            $(this).val(item.attrValue);
                        })
                    }, 100)
                }
                if (selectLen.length != 0) {
                    if (item.attrValueId == 4) {  // other
                        selectLen.val(item.attrValueId)
                        $(`#smtpublishSMTnormalAttrList select[attrid = ${item.attrId}]`).parents(".layui-col-lg8").next().css("display", "block")
                        $(`#smtpublishSMTnormalAttrList select[attrid = ${item.attrId}]`).parents(".layui-col-lg8").next().find("input").val(item.attrValue)
                    } else {
                        selectLen.val(item.attrValueId)
                    }
                }
                if (checkboxLen.length != 0) {
                    checkboxLen.each(function () {
                        if (item.attrValueId == $(this).val() && item.attrValueId == 4) {  // other
                            $(this).prop("checked", true);
                            $(this).parents(".layui-col-lg12").next().css("display", "block")
                            $(this).parents(".layui-col-lg12").next().find("input").val(item.attrValue)
                        } else if (item.attrValueId == $(this).val()) {
                            $(this).prop("checked", true);
                        }
                    })
                }

                // 区间
                if (index >= 1)
                    if (aliexpressTemplateAttrs[index].attr == aliexpressTemplateAttrs[index - 1].attr) {
                        setTimeout(() => {
                            let newIndex = index - 1;
                            $(`#smtpublishSMTnormalAttrList input[attrid = ${item.attrId}]`).parent().find("input").eq(0).val(aliexpressTemplateAttrs[index - 1].attrValue)
                            $(`#smtpublishSMTnormalAttrList input[attrid = ${item.attrId}]`).parent().find("input").eq(1).val(aliexpressTemplateAttrs[index].attrValue)
                        }, 200)

                    }
            }
        })
        form.render();
    }
    // 处理layer的SKU信息表
    function skuAttrFunc (skuAttrIdsArr, imageAttrId, skuAttr, aliexpressTemplateSkuEditDtos, haveColor, haveSize, haveStyle) {
        skuAttrIdsArr = skuAttrIdsArr.split(",")
        let html = '';
        // 'color', 'size', 'style'固定
        let skuTableType = ['color', 'size', 'style'];
        skuTableType.forEach(function (item, index) {
            let str = `<tr >
                    <td><input disabled type="checkbox" name="skuTableCheckbox" title="应用" value=":index" lay-skin="primary" :checked></td>
                    <td>:skuTableTypeIndex</td>
                    <td><select disabled id="skupublishTableSelect">:option</select></td>
                    <td class="customizedPicText">:radioCheckedText</td>
                  <td class="customizedPicRadio"><input type="radio" name=":skuTableRadio" lay-filter=":skuTableRadio" :radioChecked></td>
                </tr > `, option = '';
            str = str.replace(":index", index).replace(":checked", (skuAttrIdsArr[index] == 0 || skuAttrIdsArr[index] == undefined) ? '' : "checked").replace(":skuTableTypeIndex", item);
            skuAttr.forEach(function (attrVal) {
                option += `<option value = "${attrVal.attributeId}" ${skuAttrIdsArr[index] == attrVal.attributeId ? "selected" : ''}> ${attrVal.attributeNameZn} (${attrVal.attributeNameEn})</option > `;
            });
            str = str.replace(":option", option);
            // 默认根据下拉框数据的第一个option是否设置允许设置图片
            // 1. 选择  映射平台属性名 后，联动 是否可设置图片属性
            if (skuAttrIdsArr[index] == imageAttrId) {
                str = str.replace(":radioCheckedText", "允许设置图片").replace(":radioChecked", "checked").replace(":skuTableRadio", "skuTableRadio");
            } else {
                str = str.replace(":radioCheckedText", skuAttr[0].customizedPic == true ? "允许设置图片" : "不允许设置图片").replace(":radioChecked", skuAttr[0].customizedPic == true ? "" : "disabled").replace(":skuTableRadio", skuAttr[0].customizedPic == true ? "skuTableRadio" : "");
            }
            html += str;
        })
        $("#smtpublishskuParentTable").html(html) // sku 信息表
        form.render();
        smtLayertablePlug(aliexpressTemplateSkuEditDtos, skuAttr)

        haveSize ? '' : $("#smtpublishskuParentTable tr:nth-child(2)").css("background-color", "#ddd");
        haveStyle ? '' : $("#smtpublishskuParentTable tr:nth-child(3)").css("background-color", "#ddd");
        haveColor ? '' : $("#smtpublishskuParentTable tr:nth-child(1)").css("background-color", "#ddd");
    }

    // 生成SKU
    function smtLayerRenderTable () {
        // 获取选中的checkbox和radio行的 “映射平台属性名”列的下拉值，同时获取下拉框的内容，用于展示sku子table的表头
        let checkbox_arr_val = [], checkbox_arr_text = [], checkbox_value;
        $('input[name="skuTableCheckbox"]').each(function () {
            if ($(this).prop('checked')) {
                checkbox_arr_val.push($(this).parents("tr").find("#skupublishTableSelect option:selected").val());
                checkbox_arr_text.push($(this).parents("tr").find("#skupublishTableSelect option:selected").text());
            } else {
                checkbox_arr_val.push(0);
            }
        });

        checkbox_value = checkbox_arr_val.toString();
        let radio_value = $('#smtpublishskuParentTable input[type="radio"]:checked').parents("tr").find("#skupublishTableSelect option:selected").val();
        let radio_text = $('#smtpublishskuParentTable input[type="radio"]:checked').parents("tr").find("#skupublishTableSelect option:selected").text();
        // 选中图片属性的行没有应用，把选中的图片属性去掉
        if ($('#smtpublishskuParentTable input[type="radio"]:checked').parents("tr").find("input[name=skuTableCheckbox]").prop("checked") == false) {
            radio_value = '';
            radio_text = '';
            $('#smtpublishskuParentTable input[type="radio"]:checked').removeAttr('checked');
        }

        // 设置图片属性时， 如果第一列（也就是否应用），如果没有勾选应用，则忽略“设置图片属性”这一行，取消选中的“设置图片属性”
        if (radio_value !== undefined && radio_value != '') {
            if (checkbox_arr_val.indexOf(radio_value) === -1) {
                $('#smtpublishskuParentTable input[type="radio"]:checked').removeAttr('checked');
            }
        }

        let prodPId = $("input[name=prodPId]").val(),  // 基础模板id
            attrIds = checkbox_value, // 应用数，永远是三个值
            imgAttrId = radio_value;  // 设置图片的数据，如果没有选，就是空


        // 根据sku信息表中选中的数据，生成子table的表头
        let html = '<tr>';
        if (imgAttrId != "") {  // 获取设置图片的属性
            checkbox_arr_text.forEach(function (data) {
                if (data == radio_text) {
                    html += '<th>' + data + '</th>';
                }
            });
        }
        html += '<th>SKU（颜色，尺寸，款式）</th>'
        checkbox_arr_text.forEach(function (data) {
            if (data != radio_text) {
                html += '<th>' + data + '</th>';
            }
        });
        html += '<th></th>'
        html += '</tr>'

        $("#smtpublishLayertable_thead").html(html)
    }

    function handle_smtpublish_data (skuAttr, data, returnindex, skuInfosIndex) {
        let radio_value = $('#smtpublishskuParentTable input[type="radio"]:checked').parents("tr").find("#skupublishTableSelect option:selected").val(); // 图片属性id
        let str = `<td > `;
        skuAttr.forEach(function (item, index) {
            if (data.attrId == item.attributeId && radio_value !== item.attributeId) {
                str += `<div class="layui-col-lg8 layui-col-md8" > <div class="layui-input-block smt_publish_form_btns"><select disabled><option value="">请选择</option>`;
                item.categoryAttributeValuesSmts.forEach(function (attrVal) {
                    data.attrValueId == attrVal.categoryAttributeValueId ? str += `<option value=${attrVal.categoryAttributeValueId} selected>${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>` : str += `<option value="${attrVal.categoryAttributeValueId}">${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>`;
                });
                str += `</select><input readonly class="layui-input" name="smtLayerSkuChildDataInput" value="${data.customValue || ''}"></div></div > `;
            }
        })
        str += `</td > `;
        return str;
    }

    // sku信息子table的tbody
    function smtLayertablePlug (smtLayerSkuChildData, skuAttr) {

        smtLayerRenderTable()
        let radio_value = $('#smtpublishskuParentTable input[type="radio"]:checked').parents("tr").find("#skupublishTableSelect option:selected").val(); // 图片属性id
        let radio_text = $('#smtpublishskuParentTable input[type="radio"]:checked').parents("tr").find("#skupublishTableSelect option:selected").text(); // 图片属性text
        // sku信息子table的tbody
        let checkbox_arr_val = [];
        $('input[name="skuTableCheckbox"]:checked').each(function () {
            checkbox_arr_val.push($(this).parents("tr").find("#skupublishTableSelect option:selected").val());
        });
        let str = ''

        smtLayerSkuChildData.forEach(function (item, index) {
            let skuInfos = item.skuInfos
            skuInfos.forEach(function (skuInfosItem, skuInfosIndex) {
                //checkbox_arr_val：选中的attributeId === attrId值，根据这个值，匹配到类型，如果是下拉框，匹配下拉框的数据
                // 首先判断有没设置图片属性，因为图片属性在第一列
                // imgAttrInfo 即是包含图片属性的数据
                if (skuInfosIndex == 0 && item.imgAttrInfo != undefined) {
                    str += `<tr > <td rowspan=${item.skuInfos.length}><img src=${item.skuImage}>`
                    str += `<div class ="smt_publish_form_btns"><select disabled>`;
                    for (let k = 0; k < skuAttr.length; k++) {  // 映射平台属性名下拉框的数据
                        if (radio_value == skuAttr[k].attributeId) {
                            skuAttr[k].categoryAttributeValuesSmts.forEach(function (attrVal) {
                                if (item.imgAttrInfo.attrValueId == attrVal.categoryAttributeValueId)
                                    str += `<option value="${attrVal.categoryAttributeValueId}" selected>${attrVal.valueNameZn}(${attrVal.valueNameEn})</option>`;
                            });
                        }
                    }
                    str += `</select><input readonly class ="layui-input" name="smtLayerSkuChildDataInput" flag="0Input${index}Input${skuInfosIndex}" value="${item.imgAttrInfo.customValue || ''}"></div></td>`
                } else {
                    str += `<tr > `
                }
                // 这一列是固定的
                str += `<td > ${skuInfosItem.sku}</br > ${skuInfosItem.color},${skuInfosItem.size},${skuInfosItem.style}</td > `
                // 由于列的个数和数据是用对象名传值的，如果有一列取attrInfo1的数据，如果有两列是attrInfo1，attrInfo2
                let attrInfoArr = Object.keys(skuInfosItem).filter(item => item.includes("attrInfo"));
                // 过滤出 attrInfo1，attrInfo2，attrInfo3
                attrInfoArr.forEach(item => str += handle_smtpublish_data(skuAttr, skuInfosItem[item], index, skuInfosIndex))
                str += `<td > <a class="layui-btn layui-btn-xs layui-btn-disabled">删除</a></td ></tr > `
            })
        })

        $("#smtpublishLayertable").html(str);
        form.render();
    }

    // 第一个tab，速卖通模板数据
    // id:基础模板
    // smtId:速卖通分类id  !!注意，不是模板id
    // _storeAcctId:店铺id
    function smtPublish_viewTpl (smtId, Id, smtCategoryId, paramName) {
        // smtCategoryId = 200000384;
        loading.show()
        let layerindex = layer.open({
            type: 1,
            title: '模板详情',
            content: $("#smtpublish_newSmtTemp").html(),
            maxmin: true,
            area: ['100%', '100%'],
            btn: ['确定', '取消'],
            id: Date.now(),
            success: function (index, layero) {
                // 模板数据
                commonReturnPromise({
                    url: ctx + '/aliexpress/template/listcateattr.html', // 获取smt分类属性，获取attr和skuAttr
                    params: {
                        smtCategoryId: smtCategoryId
                    }
                }).then(res => {
                    attrFunc(res.attr)
                    form.render();
                    handle_smtPublish_viewTpl(smtId, res.skuAttr)
                }).catch(res => layer.msg(res || res.message, { icon: 2 }))
            }
        })
    }

    // 速卖通模板弹框
    function handle_smtPublish_viewTpl (smtId, skuAttr) {
        // 回显的数据
        commonReturnPromise({
            url: ctx + '/aliexpress/template/gettemplate.html',
            params: { id: smtId, }
        }).then(data => {
            commonRenderSelect('_smtpublish_productUnit', subPublish_PRODUCT_UNIT_LIST, { name: 'name', code: 'code', selected: data.productUnit || '' })
            //7788 【SMT模板/刊登】将已有数据中类目属性为”中国省份“的值设置为”浙江“
            if(data.aliexpressTemplateAttrs && data.aliexpressTemplateAttrs.length != 0){
                data.aliexpressTemplateAttrs.forEach(i => {
                    if(i.attrId == 219){
                        i.provinceAttributeInfo = {
                            attr: "中国省份",
                            attrId: 266081643,
                            attrValue: "Zhejiang",
                            attrValueId: 100015203
                        }
                    }
                })
            }
            //  基本信息顶部第一层的数据
            for (var i in data) {
                if (data[i]) {
                    $('input[name=' + i + ']').val(data[i])
                    // $('textarea[name=' + i + ']').val(data[i].replace(/\|/g, ","))
                    if (i === "keyword" || i === "wishTags") {
                        $('textarea[name=' + i + ']').val(data[i].replace(/\|/g, ","))
                    }
                    if (i === 'packageType' && data[i] == true) {
                        $(`#smtPublishsmfs input[name = packageType]: checkbox`).attr('checked', 'true');
                    }
                }
            }

            // 分类属性和自定义属性数据回显
            aliexpressTemplateAttrsFunc(data.aliexpressTemplateAttrs)

            //  商品图片
            let smtmainImagesHtml = '', descImagesHtml = '';

            if (data.mainTplImages.length !== 0 || data.assistTplImages.length !== 0) {
                let smtmainImages = data.mainTplImages || '';
                let descImages = data.assistTplImages || '';
                smtmainImages.map(item => {
                    let isSelfImgHtml = item.isSelfImg ? `<div class="selfImgIcon">自拍图</div>`:''
                    smtmainImagesHtml += `<div class="disflex smtpublish_imgBorder"><img src = ${item.name} style = "width: 150px;height:150px;" class="img_show_hide" >${isSelfImgHtml}</div> `
                })  // 主图
                descImagesHtml += `<div style = "display: flex;justify-content: flex-start" > `
                descImages.map(item => {
                    let isSelfImgHtml = item.isSelfImg ? `<div class="selfImgIcon">自拍图</div>`:''
                    if (item.isMust)
                        descImagesHtml += `<div style = "border: 1px solid #ccc;margin: 10px;" ><input type="checkbox" name="checkbox1" lay-skin="primary" title="必选图" disabled checked/><br><div class="disflex"><img src=${item.name} style="width: 150px;height:150px;" class="img_show_hide">${isSelfImgHtml}</div></div>`
                    else
                        descImagesHtml += `<div style="border: 1px solid #ccc;margin: 10px;"><input type="checkbox" name="checkbox1" lay-skin="primary" title="必选图" disabled/><br><div class="disflex"><img src=${item.name} style="width: 150px;height:150px;" class="img_show_hide">${isSelfImgHtml}</div></div>`
                })  // 描述图
                descImagesHtml += `</div>`
            }

            // 供
            if (data.isSupplierOrigiImg) {
                $(".smtPublishFontContain").append(`<span class="smtTemplatefont">供</span>`)
            }
            // 自
            if (data.selfImgStatus == 1) {
                $(".smtPublishFontContain").append(`<span class="smtTemplatefont">自</span>`)
            }

            $('[data-id=smtpublish_mainImgContains1]').html(smtmainImagesHtml)
            $('[data-id=smtpublish_remarkImgContains1]').html(descImagesHtml)
            $('[data-id=smtpublish_assistImgContains1]').html(`<img src=${data.market1Images === '' ? '/lms/static/img/kong.png' : data.market1Images} style="width: 150px;height:150px;" class="img_show_hide smtpublish_imgBorder">`)
            $('[data-id=smtpublish_assistImgContains2]').html(`<img src=${data.market2Images === '' ? '/lms/static/img/kong.png' : data.market2Images} style="width: 150px;height:200px;" class="img_show_hide smtpublish_imgBorder">`)

            // sku信息表
            // skuAttrIds:
            // imageAttrId
            // skuAttr
            // aliexpressTemplateSkuEditDtos
            // haveColor
            // haveSize
            // haveStyle
            skuAttrFunc(data.skuAttrIds, data.imageAttrId, skuAttr, data.aliexpressTemplateSkuEditDtos, data.haveColor, data.haveSize, data.haveStyle)
            form.render();
        }).catch(res => layer.msg(res || res.message, { icon: 2 }))
    }

    // 取消视频
    // form.on('checkbox(smtPublish_editDetail_video_cancel)',function(obj){
    //     if($(this).prop('checked')){
    //         $('#smtPublish_editDetail_video_list').find('input[name=checkedVideo]').each(function(){
    //             $(this).prop('checked',false)
    //         })  
    //         form.render()  
    //     }
    // })
    // 选中视频 双击取消
    form.on('radio(smtPublish_editDetail_video_checked)',function(obj){
        const isfirstchecked = $(this).data('isfirstchecked')
        // 其它的radio的isfirstchecked为fasle
        $('#smtPublish_editDetailForm input[name=checkedVideo]').each(function(){
            $(this).data('isfirstchecked', false)
        })
        form.render()
        if(isfirstchecked == true){
            $(this).prop('checked', false) 
            $(this).data('isfirstchecked', false)
        }else{
            $(this).data('isfirstchecked', true)
        }
        form.render()
    })

    // 模板图片
    $("body").on("click","#smtPublish_editDetailForm .tempImgBtn",function () {
        const limit = 1,
            existImgs = 0,
            prodPIdsStr = $("#smtPublish_editDetailForm [name=prodPId]").val();
        let prodPIdList = [];
        prodPIdList.push(prodPIdsStr);
// 营销图1 market1_images  1:1  白底图  传给平台imageType:2
// 营销图2 market2_images  3:4  场景图  传给平台imageType:1
        const imageType = $(this).data("imagetype");
        let param = {
            prodPIds: prodPIdList,
        };
        const params = {
            param,
            limit,
            existImgs,
            cb: function (tplUrlList) {
                if (Array.isArray(tplUrlList) && tplUrlList.length) {
                    // 场景图需要转化为3:4比例
                    if (imageType == 1) {
                        smtPublish_setSceneGraph('',tplUrlList[0])
                    } else {
                        // 白底图，到营销图的1:1白底图里
                        var imgDom = smtPublish_markImgDOM({ src:tplUrlList[0], ssize: true });
                        $("#smtPublish_market1Images").html(imgDom);
                    }
                }
            },
        };
        comPickImageTpl(params,'aliexpress');
    });

    function proportionImage($imgDom, url) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let img = new Image();
        img.src = url;
        img.setAttribute("crossOrigin", "Anonymous");
        // 场景图需要裁剪为3:4比例

        img.onload = function (e) {
            const aspectRatio = 3 / 4;
            const imgWidth = img.width;
            const imgHeight = img.height;
            canvas.width = imgWidth;
            canvas.height = imgHeight;

            const canvasAspectRatio = canvas.width / canvas.height;

            let drawWidth = imgWidth;
            let drawHeight = imgHeight;
            let x = 0;
            let y = 0;

            if (imgWidth / imgHeight > aspectRatio) {
                drawWidth = imgHeight * aspectRatio;
                x = (imgWidth - drawWidth) / 2;
            } else {
                drawHeight = imgWidth / aspectRatio;
                y = (imgHeight - drawHeight) / 2;
            }
            canvas.width = drawWidth;
            canvas.height = drawHeight;
            ctx.drawImage(
                img,
                x,
                y,
                drawWidth,
                drawHeight,
                0,
                0,
                canvas.width,
                canvas.height
            );
            // 将 canvas 转换为新的图片文件
            const newImageURL = canvas.toDataURL("image/jpeg");

            // 将图片base64转换为图片链接
            let reg =
                /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
            if (reg.test(newImageURL)) {
                $.ajax({
                    type: "POST",
                    url: "/lms/preProdDev/getBase64Img.html",
                    data: { AreaImgKey: newImageURL },
                    async: false,
                    success: function (res) {
                        smtPublish_markImgDOM(res)
                    },
                    error: function (err) {
                        console.log("err :>> ", err);
                        // layer.alert(err, {icon: 2})
                    },
                });
            } else {
                smtPublish_markImgDOM(url)
            }
        };
    }

    // // 自动填充白底图
    // $("body").on("click","#smtPublish_editDetailForm .autoFillImgBtn2",function () {
    //     autoFill(2)
    // })
    //
    // // 自动填充场景图
    // $("body").on("click","#smtPublish_editDetailForm .autoFillImgBtn1",function () {
    //     autoFill(1)
    // })
    //
    // function autoFill(type) {
    //     const imageFiledObj = {
    //         1: "sceneImageUrl",
    //         2: "whiteImageUrl",
    //     };
    //     let sSkus = $("#smtPublish_editDetailForm [name=ssku]").val()
    //     commonReturnPromise({
    //         url: "/lms/batchOperation/getMarketImage",
    //         type: "post",
    //         contentType: "application/json",
    //         params: JSON.stringify(sSkus.split(",")),
    //     }).then((res) => {
    //         if(res[imageFiledObj[type]]){
    //             if(type == 1){
    //                 proportionImage($("#smtPublish_market2Images img"), res[imageFiledObj[type]]);
    //             }else{
    //                 // 白底图，到营销图的1:1白底图里
    //                 var imgDom = smtPublish_markImgDOM({ src:res[imageFiledObj[type]], ssize: true });
    //                 $("#smtPublish_market1Images").html(imgDom);
    //             }
    //         }
    //     });
    // }
})

// smtPublish_getlistingDetail(649, 2030, 'prodListingId')
/**
 * 展开收起多个子商品
 */
function smtPublish_changeColspantable (obj) {
    if ($(obj).html().indexOf("展开") > -1) {
        $(obj).prev().find(".smtPublish_table_hide_rows").show()
        $(obj).find('span').html("- 收起")
    } else {
        $(obj).prev().find(".smtPublish_table_hide_rows").hide()
        $(obj).find('span').html("+ 展开")
    }
}

// tab左侧按钮 的删除
function smtPublish_del (id = "") {
    var { tableId } = TAB_LIST.filter(item => item.value == smtPublish_TABVALUE)[0]
    var checkedRows = layui.table.checkStatus(tableId)
    if (!id && !checkedRows.data.length) return layer.msg('至少选择一条数据')
    var ids = !id ? checkedRows.data.map(item => item.id) : [].concat(id)
    layui.admin.load.show();
    $.ajax({
        url: ctx + '/aliexpresslisting/deletelisting.html',
        data: { ids: ids.join(','), listingStatus: smtPublish_TABVALUE },
        dataType: 'json',
        type: 'post',
        success: function (res) {
            layui.admin.load.hide();
            if (res.code == '0000') {
                layui.layer.msg('删除成功', { icon: 1 })
                ids.forEach(item => {
                    $("#"+tableId).next().find(".id" + item).closest("tr").remove();
                })
                layui.table.cache[tableId].forEach((item, index) => {
                    if (ids.indexOf(item.id) > -1) {
                        layui.table.cache[tableId][index] = []
                    }
                })
            } else {
                layui.layer.msg(res.msg, { icon: 2 })
            }
        },
        error: function (err) {
            layui.admin.load.hide()
            layui.layer.msg(err, { icon: 2 });
        }
    })
}

// tab左侧按钮 的立即刊登
function smtPublish_publish (id = "") {
    var { tableId } = TAB_LIST.filter(item => item.value == smtPublish_TABVALUE)[0]
    var checkedRows = layui.table.checkStatus(tableId)
    if (!id && !checkedRows.data.length) return layer.msg('至少选择一条数据')
    var ids = !id ? checkedRows.data.map(item => item.id) : [].concat(id)
    layui.admin.load.show();
    const batchNo = new Date().getTime()
    commonReturnPromise({
        url:'/lms/aliexpresslisting/publishListing.html',
        type:"post",
        contentType: "application/json",
        params: JSON.stringify({ids, isContinueListing:0,batchNo}),
    }).then((res)=>{
        smtPublish_tortBrand(batchNo,function(){
            layui.layer.msg('进入刊登队列', { icon: 1 })
            layer.closeAll()
            ids.forEach(item => {
                $("#"+tableId).next().find(".id" + item).closest("tr").remove();
            })
            layui.table.cache[tableId].forEach((item, index) => {
                if (ids.indexOf(item.id) > -1) {
                    layui.table.cache[tableId][index] = []
                }
            })
        })
    })
}

//  侵权品牌商品刊登
function smtPublish_tortBrand(batchNo,callback,time=0){
    if(tortBrandTime){
        clearTimeout(tortBrandTime)
    }
    loading.show()
    tortBrandTime = setTimeout(function () {
        commonReturnPromise({
            url:'/lms/sys/selectResult.html',
            params:{batchNo},
            type:'post',
        }).then(res=>{
            clearTimeout(tortBrandTime)
            loading.hide()
            if(JSON.stringify(res)!=='{}'){
                const tableArr = []
                Object.keys(res).forEach(item=>{
                    tableArr.push({id:item.replace(/[^\d]/g, ""),sku:res[item].split(':')[0],brandWord:res[item].split(':')[1]})
                })
                layer.open({
                    type: 1,
                    title: '侵权品牌提示',
                    content: $("#smtPublish_infringement_brand").html(),
                    area: ['500px', '500px'],
                    btn: ['继续刊登', '取消'],
                    id: Date.now(),
                    success:function(){
                        layui.table.render({
                            data:tableArr,
                            elem:'#smtPublish_infringement_brand_table',
                            cols:[[
                                { checkbox: true, width: 30 },
                                {field:'sku',title:'商品父SKU'},
                                {field:'brandWord',title:'侵权品牌词'},
                            ]],
                        })
                    },
                    yes:function(){
                        const {data} = layui.table.checkStatus('smtPublish_infringement_brand_table')
                        if(!data.length) return layer.msg('请选择',{icon:7})
                        commonReturnPromise({
                            url:'/lms/aliexpresslisting/publishListing.html',
                            type:"post",
                            contentType: "application/json",
                            params: JSON.stringify({ids:data.map(item=>item.id), isContinueListing:1}),
                        }).then(()=>{
                            callback()
                        })
                    },
                    btn2:function(index){
                        layer.close(index)
                        // layui.$("#smt_publish_search_submit").click()
                    }
                })
            }else{
                layui.layer.msg('进入刊登队列', { icon: 1 })
                layer.closeAll()
                // layui.$("#smt_publish_search_submit").click()
                callback('del')
            }
        })
    }, time);

}

//定时刊登
function smtPublish_publish_onTime (id = "") {
    var { tableId } = TAB_LIST.filter(item => item.value == smtPublish_TABVALUE)[0]
    var checkedRows = layui.table.checkStatus(tableId)
    if (!id && !checkedRows.data.length) return layer.msg('至少选择一条数据')
    var ids = !id ? checkedRows.data.map(item => item.id) : [].concat(id)
    layer.open({
        type: 1,
        title: '定时刊登',
        btn: ['定时刊登'],
        id: Date.now(),
        content: "加载中...",
        success: function (layero, index) {
            $(layero).find('.layui-layer-content').html($("#smtPulish_listTimingTpl").html());

            //时间选择器
            layui.laydate.render({
                elem: '#smtPulish_listTiming'
                , type: 'datetime'
                , format: 'yyyy-MM-dd HH:mm:ss',
            });
        },
        yes: function (index, layero) {
            var listTiming = $(layero).find("input[name=listTiming]").val();
            var listInterval = $(layero).find("input[name=listInterval]").val();
            if (!listTiming) return layer.msg("定时刊登开始时间不能为空");
            if (listInterval === '0') return layer.msg('刊登间隔不为0')
            if (listInterval < 0) return layer.msg('刊登间隔小于0')
            layui.admin.load.show();
            $.ajax({
                url: ctx + '/aliexpresslisting/listtiming.html',
                data: { ids: ids.join(','), listTiming, listInterval },
                dataType: 'json',
                type: 'post',
                success: function (res) {
                    layui.admin.load.hide();
                    if (res.code == '0000') {
                        layui.layer.msg("定时刊登操作成功");
                        layui.layer.close(index);
                        ids.forEach(item => {
                            $("#"+tableId).next().find(".id" + item).closest("tr").remove();
                        })
                        layui.table.cache[tableId].forEach((item, index) => {
                            if (ids.indexOf(item.id) > -1) {
                                layui.table.cache[tableId][index] = []
                            }
                        })
                    } else {
                        layui.layer.msg(res.msg, { icon: 2 })
                    }
                },
                error: function (err) {
                    layui.admin.load.hide()
                    layui.layer.msg(err, { icon: 2 });
                }
            })
        }
    })
}

//取消定时刊登
function smtPublish_publish_onTime_cancel (id = '') {
    var { tableId } = TAB_LIST.filter(item => item.value == smtPublish_TABVALUE)[0]
    var checkedRows = layui.table.checkStatus(tableId)
    if (!id && !checkedRows.data.length) return layer.msg('至少选择一条数据')
    var ids = !id ? checkedRows.data.map(item => item.id) : [].concat(id)
    layui.admin.load.show();
    $.ajax({
        url: ctx + '/aliexpresslisting/cancleListTiming.html',
        data: { ids: ids.join(',') },
        type: 'post',
        dataType: 'json',
        success: function (res) {
            layui.admin.load.hide();
            if (res.code == "0000") {
                layui.layer.msg('操作成功', { icon: 1 })
                ids.forEach(item => {
                    $("#"+tableId).next().find(".id" + item).closest("tr").remove();
                })
                layui.table.cache[tableId].forEach((item, index) => {
                    if (ids.indexOf(item.id) > -1) {
                        layui.table.cache[tableId][index] = []
                    }
                })
            } else {
                layui.layer.msg(res.msg, { icon: 2 })
            }
        },
    })
}

//批量刊登弹窗的立即刊登和保存 接口参数
function smtPublish_batchSaveAndListingParams (checkedRows) {
    let publishStoreIds = layui.formSelects.value('smtPublish_batchPublish_store', 'valStr')
    if (!publishStoreIds) return '请选择刊登店铺'
    const isSelectVideo = $('#smtPublish_batchPublish_isSelectVideo').prop('checked')
    let templateIdList = checkedRows.data.map(item => item.modelPId)
    // let storeAcctProductGroupList = publishStoreIds.includes(',') ? publishStoreIds.split(',').map(item => ({
    //     storeAcctId: item,
    //     groupId: $(`#smtPublish_batchPublish_group_${item}`).val()
    // })) : [].concat({ storeAcctId: publishStoreIds, groupId: $(`#smtPublish_batchPublish_group_${publishStoreIds}`).val() })
    let storeAcctProductGroupList =  publishStoreIds.split(',').map(item => ({
        storeAcctId: item,
        groupId: $(`#smtPublish_batchPublish_group_${item}`).val()
    }))
    let storeEuResponsibleList = publishStoreIds.split(',').map(item => ({
        storeAcctId: item,
        msrEuId: $(`#smtPublish_batchPublish_msrEuId_${item}`).val()
    }))
    let pSkuList = checkedRows.data.map(item => item.pSku)
    let params = {
        pSkuList,
        templateIdList,
        storeAcctProductGroupList,
        storeEuResponsibleList,
        isSelectVideo
    }
    return params
}

// 编辑
function smtPublish_table_saleNote (id = "", saleNote, trDom) {
    layer.open({
        type: 1,
        title: '修改销售备注',
        area: ["500px", "300px"],
        btn: ["保存", "取消"],
        id: Date.now(),
        content: '<div style="padding:20px"><textarea class="layui-textarea">' + saleNote + '</textarea></div>',
        yes: function (index, layero) {
            var saleNoteNew = $(layero).find("textarea").val();
            layui.admin.load.show()
            $.ajax({
                type: "post",
                url: ctx + "/aliexpresslisting/updatesalenote.html",
                data: {
                    prodPId: id,
                    saleNote: saleNoteNew
                },
                dataType: 'json',
                success: function (returnData) {
                    layui.admin.load.hide()
                    if (returnData.code == "0000") {
                        layer.msg("销售备注修改成功", { icon: 1 });
                        trDom.find('td[data-field=saleNote] pre').html(saleNoteNew)
                        layui.$("#smt_publish_search_submit").trigger('click')
                        layer.close(index);
                    } else {
                        layer.msg(returnData.msg, { icon: 2 });
                    }
                },
                error: function (err) {
                    layui.admin.load.hide()
                    layer.msg(err, { icon: 2 });
                }
            });
        }
    });

}

//竞品数
function smtPublish_table_openItem (id = "") {
    $.ajax({
        type: "post",
        url: ctx + "/aliexpresslisting/listitemid.html",
        dataType: 'json',
        data: { prodPId: id },
        success: function (returnData) {
            if (returnData.code == "0000") {
                var itemIds = returnData.data;
                if (itemIds.length == 0) {
                    return;
                }
                layer.confirm('确认打开' + itemIds.length + "个速卖通商品吗？", { icon: 3 }, function (index) {
                    layer.close(index);
                    for (var i = 0; i < itemIds.length; i++) {
                        window.open("http://www.aliexpress.com/item/info/" + itemIds[i] + ".html");
                    }
                });
            } else {
                layer.msg(returnData.msg, { icon: 5 });
            }
        }
    });
}


function openSmtComp (pid) {
    $.ajax({
        type: "post",
        url: ctx + "/prodTpl/listcompUrl.html",
        dataType: "json",
        data: {
            prodPId: pid,
            platCode: "aliexpress"
        },
        success: function (returnData) {
            if (returnData.data.length >= 1) {
                for (var i = 0; i < returnData.data.length; i++) {
                    if (returnData.data[i].indexOf("http") < 0) {
                        window.open("http://" + returnData.data[i]);
                    } else {
                        window.open(returnData.data[i]);
                    }
                }
            }
        }
    });
}

//详情按钮的弹窗  id：传的aliexpressTplId或prodListingId，storeAcctId:店铺id，paramName：参数名称
function smtPublish_getlistingDetail (id, storeAcctId, paramName, trData) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        form = layui.form
    table = layui.table
    $ = layui.$;
    // 获取tableId
    let tableId,field;
    if(trData.listingStatus){
        tableId = TAB_LIST.filter(item => item.value == trData.listingStatus)[0].tableId;
        field = 'id'
    }else{
        tableId = 'smt_publish_tpl_table';
        field = 'modelPId'
    }
    const layerId =  Date.now()
    layer.open({
        type: 1,
        title: "刊登",
        btn: smtPublish_TABVALUE == 1 || smtPublish_TABVALUE == 3 ? '' : ["立即刊登", "保存", "取消"],
        area: ["100%", "100%"],
        id: layerId,
        content: "加载中...",
        end: function () {
            smtPublish_desc_lastDescTabVal = 1
        },
        // 立即刊登
        yes: smtPublish_debounce(function (index, layero) {
            var params = smtPublish_detailModalSave(storeAcctId)
            if (Object.prototype.toString.call(params) === '[object Object]') {
                const batchNo = new Date().getTime()
                params.batchNo = batchNo
                params.isContinueListing = 0
                smtPublish_saveAndListingAjax(params)
                    .then(data => {
                        smtPublish_tortBrand(batchNo,function(onlyDel){
                            if(!onlyDel){
                            layer.closeAll()
                            layer.msg(data, { icon: 1 })
                            smtPublish_desc_lastDescTabVal = 1
                            }
                            // layui.$("#smt_publish_search_submit").trigger('click')
                            $("#"+tableId).next().find(".id" + trData[field]).closest("tr").remove();
                            layui.table.cache[tableId].forEach((item, index) => {
                                if (item[field] == trData[field]) {
                                    layui.table.cache[tableId][index] = []
                                }
                            })
                        },0)
                    }).catch(err => layer.msg(err || err.message, { icon: 2 }))
            } else {
                return layer.msg(params)
            }
        }, 1000, true),
        btn2: smtPublish_debounce(function (index, layero) {
            var params = smtPublish_detailModalSave(storeAcctId)
            if (Object.prototype.toString.call(params) === '[object Object]') {
                commonReturnPromise({
                    url: ctx + '/aliexpress/publish/savepublishinfo.html',
                    type: 'post',
                    contentType: "application/json",
                    params: JSON.stringify(params),
                }).then(() => {
                    layer.close(index)
                    layer.msg('保存成功', { icon: 1 })
                    smtPublish_desc_lastDescTabVal = 1
                    // layui.$("#smt_publish_search_submit").trigger('click')
                    $("#"+tableId).next().find(".id" + trData[field]).closest("tr").remove();
                    layui.table.cache[tableId].forEach((item, index) => {
                        if (item[field] == trData[field]) {
                            layui.table.cache[tableId][index] = []
                        }
                    })
                }).catch(err => layer.msg(err || err.message, { icon: 2 }))
            } else {
                layer.msg(params)
            }
        }, 1000, true),
        success: function (layero) {
            commonReturnPromise({
                url: ctx + '/aliexpress/publish/getpublishinfo.html',
                params: smtPublish_TABVALUE == -2 ? { [paramName]: id, storeAcctId } : { [paramName]: id }
            }).then(res => {
                //7788 【SMT模板/刊登】将已有数据中类目属性为”中国省份“的值设置为”浙江“
                if(res.prodListingAliexpressSmtAttrs && res.prodListingAliexpressSmtAttrs.length != 0){
                    res.prodListingAliexpressSmtAttrs.forEach(i => {
                        if(i.attrId == 219){
                            i.provinceAttributeInfo = {
                                attr: "中国省份",
                                attrId: 266081643,
                                attrValue: "Zhejiang",
                                attrValueId: 100015203
                            }
                        }
                    })
                }
                Promise.all([commonReturnPromise({
                    url: ctx + '/aliexpress/template/listcateattr.html',
                    params: { smtCategoryId: res.smtCategoryId, storeAcctId: storeAcctId, }
                }), commonReturnPromise({
                    url: ctx + '/smtRegionPrice/getTemplateByStore',
                    type: 'post',
                    params: JSON.stringify([storeAcctId]),
                    contentType: 'application/json'
                }),
                //信息模块的获取
                commonReturnPromise({ url: ctx + '/aliexpress/publish/listdetailmodule.html', params: { storeAcctId: storeAcctId, isSync: false } }),
                //运费模板的获取
                commonReturnPromise({ url: ctx + '/aliexpress/publish/listfreighttpl.html', params: { storeAcctId: storeAcctId, isSync: false } }),
                //服务模板的获取
                commonReturnPromise({ url: ctx + '/aliexpress/publish/listpromisetpl.html', params: { storeAcctId: storeAcctId, isSync: false } }),
                //商品分组模板的获取
                commonReturnPromise({ url: ctx + '/aliexpress/publish/listproductgroup.html', params: { storeAcctId: storeAcctId, isSync: false } }),
                //视频的获取
                commonReturnPromise({ url: ctx + '/aliexpressVideo/queryAliexpressVideoInfo', params: JSON.stringify({ [paramName]: id}), type:'post',contentType: 'application/json'}),
                //欧盟责任人的获取
                commonReturnPromise({ url: ctx + `/aliexpress/category/getEuResponsiblePersonsByStoreAcctIdAndCategoryId?storeAcctId=${storeAcctId}&categoryId=${res.smtCategoryId}`, type:'post',contentType: 'application/json'}),
                //资质信息的获取
                commonReturnPromise({ url: ctx + `/aliexpress/category/getQualificationsByStoreAcctIdAndCategoryId?storeAcctId=${storeAcctId}&categoryId=${res.smtCategoryId}`, type:'post',contentType: 'application/json'}),
                ])
                    .then(async result => {
                        subPublish_ModalDetail_Data = res
                        isSupportHalfManage = res.isSupportHalfManage
                        usdToCnyRate = subPublish_ModalDetail_Data.usdToCnyRate
                        prodPId = subPublish_ModalDetail_Data.prodPId
                        subPublish_REGION_PRICE_LIST = result[1]
                        //赋值 发货地table
                        if (res.deliveryPlace) {
                            var _placePriceList = res.deliveryPlace.split(',').map(item => ({
                                priceArr: result[1].map(priceItem => ({
                                    ...priceItem,
                                    placeName: item
                                })),
                                placeName: item
                            }))
                            res.placePriceList = _placePriceList.map(item => {
                                var _priceArr = item.priceArr.map(tplItem => {
                                    var sData = res.configurationData ? Object.entries(JSON.parse(res.configurationData)).filter(arrItem => arrItem[1] == tplItem.id && arrItem[0] == tplItem.placeName) : []
                                    return { ...tplItem, selected: sData.length ? true : false }
                                })
                                return { ...item, priceArr: _priceArr }
                            })
                        } else {
                            res.placePriceList = [{ placeName: "NONE", priceArr: result[1].map(item => ({ ...item, placeName: 'NONE', selected: false })) }]
                        }

                        subPublish_Category_Arr = result[0]
                        // 赋值 发货地checkbox
                        res.shipsFrom = result[0].shipsFrom
                        if (res.extra && res.extra.productDetailModule) {
                            res.productDetailModule = res.extra && res.extra.productDetailModule ? JSON.parse(res.extra.productDetailModule) : ''
                        }
                        //自定义属性的值处理
                        res.customProperty = res.prodListingAliexpressSmtAttrs.filter(item => item && !Object.keys(item).some(keyItem => keyItem.includes('attrId')))
                        if (smtPublish_TABVALUE == -2) {
                            res.storeAcctId = storeAcctId
                            res.pcDesc = res.mobileDesc    //在模板列表，，生成刊登中，，把手机端描述生成pc描述
                        }
                        // 如果调价方式为直接调价
                        if (res.adjustPriceType == 3) {
                            res.aliexpressListingSkuDtos = res.aliexpressListingSkuDtos.map(item => {
                                if (!!item.adjustPriceData) {
                                    return ({ ...item, adjustPriceData: JSON.parse(item.adjustPriceData).sort(smtPublish_skuInfoSort()) })
                                } else {
                                    return item
                                }
                            })
                        }
                        //  相同的图片属性，聚合
                        result[0].skuAttr.forEach(item=>{
                            smtPublish_skuList[item.attributeNameZn] = item.categoryAttributeValuesSmts.map(elem=>({
                                name:elem.valueNameZn,
                                value:elem.categoryAttributeValueId
                            }))
                         })
                        // 视频
                         res.videoList = []
                         if(Array.isArray(result[6]) && result[6][0]){
                             res.videoList = (result[6][0].videos || []).map(item=>{
                                let videoChecked = false
                                if(res.videoFileUrl){
                                    videoChecked = item.location=== res.videoFileUrl
                                }
                                return {...item,checked:videoChecked}
                             })

                         }
                        // //  整合资质信息
                        // const _qualificationsObj = {};
                        // (res.qualifications||[]).forEach(v=>{
                        //     _qualificationsObj[v.qualificationKey] = v.qualificationValue
                        // })
                        // res.qualificationList = (result[8]||[]).map(v=>({
                        //     ...v,
                        //     country:v.country||'未知',
                        //     qualificationName:v.qualificationName||'未知',
                        //     qualificationValue : _qualificationsObj[v.qualificationKey]
                        // }))
                        // smtPublish_genSmtListingDetailTpl(laytpl, $, res, layero);
                        //  整合资质信息
                        if(smtPublish_TABVALUE == -2){ // 速卖通模板页签
                            let qualificationKeys = result[8].map(item => item.qualificationKey),qualificationKeysObj = {};
                            // 速卖通模板页签 ==> 获取公共模板商品资质信息
                            await commonReturnPromise({
                                url: ctx + '/smtQualificationsTemplate/getDefaultQualificationImage',
                                type: 'post',
                                params: JSON.stringify({limit: 999, page: 1, qualificationKeys, templateId:id}),
                                contentType: 'application/json;charset=UTF-8'
                            }).then(resData =>{
                                resData.forEach(item => qualificationKeysObj[item.qualificationKey] = item.qualificationValue)
                                res.qualificationList = (result[8]||[]).map(v=>({
                                    ...v,
                                    country:v.country||'未知',
                                    qualificationName:v.qualificationName||'未知',
                                    qualificationValue : qualificationKeysObj[v.qualificationKey]
                                }))
                                smtPublish_genSmtListingDetailTpl(laytpl, $, res, layero);
                            })
                        }else{
                            // 带刊登/刊登中/刊登成功/刊登失败页签 ==> 直接回显商品资质
                            //  整合资质信息
                            const _qualificationsObj = {};
                            (res.qualifications||[]).forEach(v=>{
                                _qualificationsObj[v.qualificationKey] = v.qualificationValue
                            })
                            res.qualificationList = (result[8]||[]).map(v=>({
                                ...v,
                                country:v.country||'未知',
                                qualificationName:v.qualificationName||'未知',
                                qualificationValue : _qualificationsObj[v.qualificationKey]
                            }))
                            smtPublish_genSmtListingDetailTpl(laytpl, $, res, layero);
                        }
                        // ssku
                        let sskuList = trData.subList?.map(item => item.prodSSku)
                        $("#smtPublish_editDetailForm [name=ssku]").val(sskuList.join(","))
                        //运费模板
                        commonRenderSelect('smtPublish_freightTemplate', result[3], { name: 'templateName', code: 'templateId', selected: res.extra ? res.extra.freightTemplateId : '' })
                            .then(() => {
                                res.extra && res.extra.freightTemplateId=='0' && $('#smtPublish_freightTemplate').val(res.extra.freightTemplateId)
                                layui.form.render('select')
                            })
                        //服务模板
                        commonRenderSelect('smtPublish_promiseTemplate', result[4], { name: 'templateName', code: 'templateId', selected: res.extra ? res.extra.promiseTemplateId : '' })
                            .then(() => {
                                res.extra && res.extra.promiseTemplateId=='0' && $('#smtPublish_promiseTemplate').val(res.extra.promiseTemplateId)
                                layui.form.render('select')
                            })
                        //商品分组模板
                        commonRenderSelect('smtPublish_group', result[5], { name: 'groupName', code: 'groupId', selected: res.extra ? res.extra.groupId : '' })
                            .then(() => {
                                res.extra && res.extra.groupId=='0' && $('#smtPublish_group').val(res.extra.groupId)
                                layui.form.render('select')
                            })
                        // 欧盟责任人
                        commonRenderSelect('smtPublish_msrEuId', result[7], { name: 'msrEuName', code: 'msrEuId',selected: res.msrEuId })
                            .then(() => {
                                res.extra && res.extra.msrEuId=='0' && $('#smtPublish_msrEuId').val(res.extra.msrEuId)
                                layui.form.render('select')
                                // 无数据不展示
                            }).then(()=>{
                                if(!result[7].length){
                                    $('#smtPublish_msrEuId').next().hide()
                                }
                            })
                        // 如果没有属性
                        if (JSON.stringify(result[0]) == "{}") {
                            $("#smtPulish_cag_prop_more_label").remove()
                        } else {
                            //渲染分类属性
                            smtPublish_renderCategory(result[0].brand, res.prodListingAliexpressSmtAttrs)
                            smtPublish_renderCategory(result[0].attr, res.prodListingAliexpressSmtAttrs)
                        }
                        // 产品详情描述
                        var pcDesc = res.pcDesc && !!smtPublish_isJSON(res.pcDesc) ? JSON.parse(res.pcDesc) : {}
                        var _pcDesc = res.pcDesc && !!smtPublish_isJSON(res.pcDesc) ? JSON.parse(res.pcDesc) : {}
                        var moduleId = ''
                        var position = ''
                        if (_pcDesc.moduleList != undefined) {
                            _pcDesc.moduleList.forEach((item, index) => {
                                if (item.type == 'dynamic') {
                                    pcDesc.moduleList.splice(index, 1)
                                    moduleId = item.reference ? item.reference.moduleId : ''
                                    position = index == 0 ? 'top' : 'bottom'
                                    $("#smtPublish_desc_pc_info").find('select[name=position]').val(position)
                                }
                            })
                        }

                        //信息模块
                        commonRenderSelect('smtPublish_moduleId', result[2], { name: 'name', code: 'moduleId', selected: moduleId })
                            .then(() => { layui.form.render() })
                        var mobileDesc = res.mobileDesc && !!smtPublish_isJSON(res.pcDesc) ? JSON.parse(res.mobileDesc) : {}
                        pcDesc['moduleList'] != undefined ? pcDesc['moduleList'].forEach(item => smtPublish_desc_add_mod(item, '#smtPublish_desc_modules_pc')) : ''
                        mobileDesc['moduleList'] != undefined ? mobileDesc['moduleList'].forEach(item => smtPublish_desc_add_mod(item, '#smtPublish_desc_modules_phone')) : ''
                        imageLazyload()

                        // 模块图片
                        smtPublish_tplImg()
                        commonAddEventTitleToggle($('#'+layerId), 'smt');
                        // change 颜色属性下拉
                        const arrColorPro  = ['imgAttr','attr1','attr2','attr3']
                        arrColorPro.forEach((item) => {
                            layui.form.on(`select(smt_publish_${item})`, function(){
                                getAeHalfManageSkuPro()
                            })
                        })
                     
                    })

            }).catch(res => layer.msg(res || res.message, { icon: 2 }))
        },
    })
}

// 模板图片
function smtPublish_tplImg(){
    $('.smtPublish-uploadTplImgBtn').click(function(){
        const limit = $(this).data('limit')
        const existImgs = $('#smtPublish_mainImages').find('li').length
        const prodPIdList = Array.from($("#smtPublish_SubSkuInfo2 tr").map((_, item) => $(item).data("prodpid")))
        let param = {
            prodPIds: prodPIdList
        }
        const params = {
            param,
            limit,
            existImgs,
            cb: function (tplUrlList) {
              if (Array.isArray(tplUrlList) && tplUrlList.length) {
                const mainImgDoms = tplUrlList
                  .map(
                    item => `
                    <li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
                                  <div class="ImgDivOut">
                                      <div class="ImgDivIn">
                                          <img src=${item} style="height:150px; width: 150px"  alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"  title="双击即可复制路径"/>
                                      </div>
                                      <div class="imgDivDown">
                                            <div class="disflex" style="justify-content: space-around;">
                                                <a class="fl" onclick="smtPublish_copyImg(this);" href="javascript:void(0);">
                                                    复制
                                                </a>
                                                <a onclick="smtPublish_delImg(this);" href="javascript:void(0);">
                                                    移除
                                                </a>
                                            </div>
                                            <div class="disflex" style="justify-content: space-around;">
                                                <a class="fl" onclick="smtPublish_setWhiteBgMap(this);" href="javascript:void(0);">
                                                    设为白底图
                                                </a>
                                                <a class="fl" onclick="smtPublish_setSceneGraph(this);" href="javascript:void(0);">
                                                    设为场景图
                                                </a>
                                            </div>
                                        </div>
                                  </div>
                              </li>`
                  )
                  .join("")
          
                $("#smtPublish_mainImages").append(mainImgDoms)
              }
            },
          }
          comPickImageTpl(params,'aliexpress')
    })
}

// 描述 模板图片
function smtPublish_desc_tplImg(dom){
    let parentDom = $(dom).parents('.smtPulish-rowFlexClass')
    let imgArr = $(parentDom).find('ul').find('li')
    const limit = 10
    if (imgArr.length == limit) return layer.msg('请删除后添加', { icon: 5 })
    const prodPIdList = Array.from($("#smtPublish_SubSkuInfo2 tr").map((_, item) => $(item).data("prodpid")))
    const param = {
        prodPIds: prodPIdList
    }
    const params = {
        param,
        limit,
        existImgs: imgArr.length,
        cb: function (tplUrlList) {
          if (Array.isArray(tplUrlList) && tplUrlList.length) {
            tplUrlList.forEach(item=>{
                smtPublish_desc_addImg_detail(parentDom, item)
            })
          }
        },
      }
      comPickImageTpl(params,'aliexpress')
    
}

function smtPublish_chooseTplImg(layero, res){
    $('.smtPublish-chooseTplImg').click(function(e){
        const checkboxDOm = $(e.target).parent().find('input[name=tplUrl]')
        if(checkboxDOm.prop('checked')){
            checkboxDOm.prop('checked',false)
        }else{
            checkboxDOm.prop('checked',true)
        }
        smtPublish_tplImg_render(layero, res)
    })
}

function smtPublish_tplImg_render(layero, res){
    layui.form.render()
    let checkboxClass = ''
    if(res.isSupplierOrigiImg){
        checkboxClass = '.layui-card-header .layui-form-checked[lay-skin=primary] i'
    }else{
        checkboxClass = '.layui-card-header .layui-form-checkbox[lay-skin=primary] i'
    }
    $(layero).find(checkboxClass).css({
        'top':'18px',
        'left':'10px'
    })
     $(layero).find('.layui-form-checkbox span').css({
        'fontSize':'12px',
        'padding':'0 2px'
    })
}

// 刊登弹窗  sku信息 adjustPriceData的排序
function smtPublish_skuInfoSort () {
    return function (a, b) {
        return Number(a.sort) - Number(b.sort)
    }
}

// 商品详情弹窗数据的渲染
function smtPublish_genSmtListingDetailTpl (laytpl, $, obj, layero) {
    var placeDom = ''
    if (obj.shipsFrom) {
        //发货地和区域定价
        placeDom = `<div class="smtPulish_listDetailTpl_container">${smtPublish_changeCheckboxToString(obj.shipsFrom[0], obj.deliveryPlace ? obj.deliveryPlace.split(',') : '', 'smtPublish_deliveryPlace')}</div>`
    }
    // 自定义属性
    var customPropertyDoms = ''
    if (Array.isArray(obj.customProperty) && obj.customProperty.length) {
        obj.customProperty.forEach(item => {
            customPropertyDoms += `<div class="layui-row m-top10 detailItem">
            <div class="layui-col-md2"><input class="layui-input" type="text" name="property" value='${item.attr || ""}' placeholder="字数不超过70个"></div>
            <div class="layui-col-md3 ml10"><input class="layui-input" type="text" name="propertyVal" value='${item.attrValue || ""}' placeholder="字数不超过70个"></div>
            <div class="layui-col-md3 ml10"><button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" onclick="smtPublish_delProperOwn(this)">删除</button></div>
        </div>`
        })
    }

    var bulkDiscount = obj.extra && obj.extra.bulkDiscount ? (100 - obj.extra.bulkDiscount) / 10 : '0'

    //  使用的排在前面
    let _smtPublish_skuList = JSON.parse(JSON.stringify(smtPublish_skuList))

    if(obj.aliexpressListingSkuDtos.length){
        AttrInfos.forEach(elem=>{
            let curName = elem + 'Name'
            let curValue = elem + 'Value'
            let curValueId = elem + 'ValueId'
            let keyName = obj.aliexpressListingSkuDtos[0][curName]
            if(keyName){
                let usedObj={}
                let usedArr = []
                obj.aliexpressListingSkuDtos.forEach(item=>{
                    let _curValue = item[curValueId]
                    let _curName = item[curValue]
                    if(!usedObj[_curValue]){
                        usedObj[_curValue] = true
                        usedArr.push({name: _curName, value: _curValue})
                    }
                })
                let unUsedArr = _smtPublish_skuList[keyName].filter(v =>!usedObj[v.value])
                _smtPublish_skuList[keyName] = usedArr.concat(...unUsedArr)
            }
        })
    }


    var form = layui.form
    let skuTheadCols =[]
    if(obj.aliexpressListingSkuDtos.length){
        Object.keys(obj.aliexpressListingSkuDtos[0]).forEach(key=>{
           let curObj = obj.aliexpressListingSkuDtos[0]
           if(key.includes('Name') && !key.includes('OaAttrName') && key!='imgAttrName' && !!curObj[key]){
               let prefixName = key.slice(0,5)
               skuTheadCols.push({
                   key,
                   name: curObj[key],
                   attrId: curObj[`${prefixName}Id`],
                   oaAttrName: curObj[`${prefixName}OaAttrName`]
               })
           }
       })
    }
    laytpl($("#smtPulish_listDetailTpl").html()).render({...obj,skuList:_smtPublish_skuList,attrInfos: AttrInfos,skuTheadCols}, function (html) {
        $(layero).find('.layui-layer-content').html(html);
        $("#smtPublish_deliveryPlace").append(placeDom)
        $("#smtPublish_listDetailTpl_addproper").prepend(customPropertyDoms)
        $('#smtPublish_bulkDiscount').html(bulkDiscount)
        // 发货地&区域定价的table
        imageLazyload('#smtPublish_listingInfo_sub_tab2>tbody');
        //最小计量单位
        commonRenderSelect('smtPublish_productUnit', subPublish_PRODUCT_UNIT_LIST, { name: 'name', code: 'code', selected: obj.extra && obj.extra.productUnit ? obj.extra.productUnit : '100000015' })
        form.render()

        // 设定本地图片上传功能 -- 主图
        smtPublish_uploadLocalImg($('[data-id=mainwwImgContains]'),)
        // 设定网络图片上传功能 -- 主图
        smtPublish_uploadNetImg($('[data-id=mainwwImgContains]'))
        // 设定本地图片上传功能 -- 营销图1：1
        smtPublish_uploadLocalImg($('[data-id=marketfirstImgContains]'), true)
        // 设定网络图片上传功能 -- 营销图1：1
        smtPublish_uploadNetImg($('[data-id=marketfirstImgContains]'), true)
        // 设定本地图片上传功能 -- 营销图3：4
        smtPublish_uploadLocalImg($('[data-id=marketsecondImgContains]'), true, false,)
        // 设定网络图片上传功能 -- 营销图3：4
        smtPublish_uploadNetImg($('[data-id=marketsecondImgContains]'), true, false,)
        if(smtPublish_TABVALUE==-2){
            smtPublish_estimatePrice()
        }
        // 资质信息
        if (obj.qualificationList && obj.qualificationList.length) {
            const qualificationList = _.groupBy(obj.qualificationList, "country");
            laytpl($("#smtPublish_qualificationInfoTpl").html()).render(
              {
                qualificationList,
              },
              function (qualificationHtml) {
                $(layero)
                  .find("#smtPublish_qualificationInfoView")
                  .html(qualificationHtml);
                smtPublish_qualificationInfo_delteImg();
              }
            );
        }
        // 3:4
        if(obj.market2Images){
            smtPublish_setSceneGraph('',obj.market2Images)
        }
    });

    let skuInfoListObj = {
        subHalfManageExtraList: []
    }

    if(isSupportHalfManage){
        $('#isNotOpenJoinAEHalf').hide();
        $('#isOpenJoinAEHalf').show();

        // 是否选中了发货地联动半托管
        if($('#smtPublish_deliveryPlace').find('input:checked').length){
            // 有发货地 半托管为false 且为禁用 填写半托管信息隐藏
            isJoin = 'false'
            $('#isJoin input:radio').prop('disabled', true)
            const $aeHalfManageInfo = $('#ae_half_manage_info');
            $aeHalfManageInfo.addClass('ae_half_manage_table_not_join')
        }else{
            $('#isJoin input:radio[disabled]').removeAttr('disabled');
            // 没有发货地 可参与半托管
            if(subPublish_ModalDetail_Data.subHalfManageExtraList !== undefined && subPublish_ModalDetail_Data.subHalfManageExtraList !== null && subPublish_ModalDetail_Data.subHalfManageExtraList.length !== 0){
                isJoin = 'true'
                subPublish_ModalDetail_Data.subHalfManageExtraList = subPublish_ModalDetail_Data.subHalfManageExtraList.map((item) => ({
                    ...item,
                    packageWeight: Math.round(item.packageWeight),
                    oldSpecialProductTypeList: item?.specialProductTypeList && item.specialProductTypeList.length ? item.specialProductTypeList : ['general'],
                    scItemBarCode: item.scItemBarCode || ''
                }))
                skuInfoListObj.subHalfManageExtraList = subPublish_ModalDetail_Data.subHalfManageExtraList
            }else{
                isJoin = 'false'
                const $aeHalfManageInfo = $('#ae_half_manage_info');
                $aeHalfManageInfo.addClass('ae_half_manage_table_not_join')
            }
        }
        $(`#isJoin input[name=isJoin][value=${isJoin}]`).prop('checked', true)
        form.render()

        aeHalfTableRender(skuInfoListObj, isJoin)
    }else{
        $('#isOpenJoinAEHalf').hide();
        $('#isNotOpenJoinAEHalf').show();
        isJoin = 'false'
        const $aeHalfManageInfo = $('#ae_half_manage_info');
        $aeHalfManageInfo.addClass('ae_half_manage_table_not_join')
    }

    smtPublish_adjustPriceTypeVal = obj.adjustPriceType

    if (obj.adjustPriceType == 3) {
        // 渲染 区域定价 的 调价地
        let _adjustPriceCountry = !!obj.adjustPriceCountry ? obj.adjustPriceCountry : '[]'
        smtPublish_CountryPrice(JSON.parse(_adjustPriceCountry))
        smtPublish_getTplCtyByStore()
    }
    // smtPublish_upload_skuImg()
    // smtPublish_remove_skuImg()
    // smtpublish_del_skuTr()
    // smtpublish_changeSkuVal()
    // sku信息的select
    smt_Publish_skuAttr_Select()
}

// 监听是否参与半托管(显示/不显示填写表格)
layui.form.on('radio(ae_half_isJoin)', function(data) {
  isJoin = data.value
  let $aeHalfManageInfo = $('#ae_half_manage_info');
  // 清除之前的类名
  $aeHalfManageInfo.removeClass('ae_half_manage_table_not_join ae_half_manage_table_join');
  if(data.value === 'false'){
    $aeHalfManageInfo.addClass('ae_half_manage_table_not_join')
  }else{
    // 点击参与
    // 先查看sku列表是否存在 去渲染半托管
    if(subPublish_ModalDetail_Data.prodListingSubSkuAliexpressSmts.length && (!subPublish_ModalDetail_Data.subHalfManageExtraList || !subPublish_ModalDetail_Data.subHalfManageExtraList.length)){
        renderAeHalfTableBySkuList()
    }
    $aeHalfManageInfo.addClass('ae_half_manage_table_join')
  }
});

// 给半托管表格sku属性列赋值
function getAeHalfManageSkuPro () {
  let propertyObj = {}
  let aeHalfStoreSSkuObj = {}
  // sku信息列表
  $('#smtPublish_SubSkuInfo2 tr').each(function(){
    // 属性列四种情况
    const arr  = ['imgAttr','attr1','attr2','attr3']
    let str = ''
    arr.forEach(v=>{
        // attr没有值 才去映射color
        const selectDom = $(this).find(`select[name=${v}]`)
        const color = selectDom.find('option:selected').text()
        const attrName = selectDom.data('attrname')
        const attr = $(this).find(`input[name=${v}Name]`).val()
        const pro = attr || color
        if(selectDom.length){
            str += attrName + '-'+ pro+'</br>'
        }
    })

    const prodSSku = $(this).data('prodssku')
    if(!propertyObj[prodSSku]){
        propertyObj[prodSSku] = str
    }
    // 店铺子SKU 和半托管双向联动
    aeHalfStoreSSkuText = $(this).find('input[name=skuInfo_storeSSku]').val()
    if(!aeHalfStoreSSkuObj[prodSSku]){
        aeHalfStoreSSkuObj[prodSSku] = aeHalfStoreSSkuText
    }
  })

  // 将sku信息的属性映射到半托管表格
  $('#smtPublish_AESubSkuInfo2 tr').each(function(){
    const prodSSku = $(this).data('prodssku')
    if(propertyObj[prodSSku]){
      $(this).find('.aeSkuProperty').html(propertyObj[prodSSku])
    }
    if(aeHalfStoreSSkuObj[prodSSku]){
        $(this).find('.aeStoreSSku').html(aeHalfStoreSSkuObj[prodSSku])
    }
  })
}

// 发货地和半托管联动
function showAeHalfByDeliveryPlace(){
    if($('#smtPublish_deliveryPlace').find('input:checked').length){
        // 有发货地 半托管为false 且为禁用 填写半托管信息隐藏
        isJoin = 'false'
        $('#isJoin input:radio').prop('disabled', true)
        const $aeHalfManageInfo = $('#ae_half_manage_info');
        $aeHalfManageInfo.addClass('ae_half_manage_table_not_join')
    }else{
        $('#isJoin input:radio[disabled]').removeAttr('disabled');
        // 没有发货地 可参与半托管
        if(subPublish_ModalDetail_Data.subHalfManageExtraList !== undefined && subPublish_ModalDetail_Data.subHalfManageExtraList !== null && subPublish_ModalDetail_Data.subHalfManageExtraList.length !== 0){
            isJoin = 'true'
            subPublish_ModalDetail_Data.subHalfManageExtraList = subPublish_ModalDetail_Data.subHalfManageExtraList.map((item) => ({
                ...item,
                packageWeight: Math.round(item.packageWeight),
                oldSpecialProductTypeList: item?.specialProductTypeList && item.specialProductTypeList.length ? item.specialProductTypeList : ['general'],
                scItemBarCode: item.scItemBarCode || ''
            }))
            skuInfoListObj.subHalfManageExtraList = subPublish_ModalDetail_Data.subHalfManageExtraList
        }else{
            isJoin = 'false'
            const $aeHalfManageInfo = $('#ae_half_manage_info');
            $aeHalfManageInfo.addClass('ae_half_manage_table_not_join')
        }
    }
}

// 渲染特殊商品类型
function setTableLogisSelectData(arr = []) {
  if(subPublish_ModalDetail_Data.subHalfManageExtraList && subPublish_ModalDetail_Data.subHalfManageExtraList.length){
    let logisSelectStr = ''
    arr?.forEach(item => {
      logisSelectStr += '<option value="' + item.value + '">' + item.label + '</option>'
    })

    $('.logisAttrList_td').each(function(index, item) {
        // 初次渲染 半托管列表添加互斥
        const selectedOption = subPublish_ModalDetail_Data.subHalfManageExtraList[index].oldSpecialProductTypeList
        const _arr = arr.map((item) =>{
            let selected = ''
            let disabled = ''
            if (selectedOption.some(v=>v==item.value)) {
                selected = 'selected'
            }
            if(selectedOption.includes('general') && item.value!=='general'){
                disabled = 'disabled'
            }else if(!selectedOption.includes('general') && item.value ==='general'){
                disabled = 'disabled'
            }
            return { ...item, name: item.label, selected, disabled };
        })
        layui.formSelects.data(`isDisabledSpecialProType_${index}`, 'local', {arr: _arr})
    })
    // 批量特殊商品类型渲染
    const arr2 = arr.map((item) =>{
        return { ...item, name: item.label, selected: '', disabled: '' };
    })
    layui.formSelects.data(`handleSpecialProductTypeList`, 'local', {arr: arr2})

  }
}

// 批量填写 美元人民币联动
function handleChangeBasePriceUsd (e) {
    if(e.target.value !== ''){
        const cnyVal = (Number(e.target.value) * usdToCnyRate).toFixed(2)
        $('input[name="basePriceCny"]').val(cnyVal);
    }else{
        $('input[name="basePriceCny"]').val('');
    }

}
function handleChangeBasePriceCny (e) {
    if(e.target.value !== ''){
        const usdVal = (Number(e.target.value) / usdToCnyRate).toFixed(2)
        $('input[name="basePriceUsd"]').val(usdVal);
    }else{
        $('input[name="basePriceUsd"]').val('');
    }
}

// 单行美元输入改变
function changeBasePriceUsd (e) {
    if(e.target.value !== ''){
        const cnyVal = (Number(e.target.value) * usdToCnyRate).toFixed(2)
        $(e.target).parent().next().find('input').val(cnyVal)
    }else{
        $(e.target).parent().next().find('input').val('')
    }
}

// 单行人民币输入改变
function changeBasePriceCny (e) {
    if(e.target.value !== ''){
        const usdVal = (Number(e.target.value) / usdToCnyRate).toFixed(2)
        $(e.target).parent().prev().find('input').val(usdVal)
    }else{
        $(e.target).parent().prev().find('input').val('')
    }
}

function changePackageWeight(e){
    // 重量正整数
    if(e.target.value !== ''){
        const weight = parseFloat(e.target.value);
        if (!isNaN(weight) && weight > 0) {
            e.target.value =  Math.round(weight);
          } else {
            e.target.value = ''
            layer.msg('重量必须是正整数！'); 
          }
    }
}

function changePackageInfo(e){
    // 长宽高整数
    if(e.target.value !== ''){
        const decimalIndex = e.target.value.indexOf('.');
        if (decimalIndex !== -1 && e.target.value.length - decimalIndex > 0) {
          const parsedValue = parseFloat(e.target.value);
          const roundedValue = Math.round(parsedValue * 100) / 100;
          e.target.value = roundedValue.toFixed(0);
        }
    }
}

function aeHalfTableRender (skuInfoListObj, isJoin='true'){
  // 渲染半托管信息表格
  layui.laytpl($("#smtPublish_AEHalfSkuInfoTable").html()).render(skuInfoListObj, function (html) {
    $('#smtPublish_listingInfo_sub_sku_table').html(html);
    getAeHalfManageSkuPro()
    layui.form.render()
    showSpecialProductType()
    if(isJoin === 'true'){
        handleSpecialProductTypeListMutualExclusion('handleSpecialProductTypeList')
        if(skuInfoListObj.subHalfManageExtraList.length){
            skuInfoListObj.subHalfManageExtraList.forEach((_, index) => {
                // 普货与其他类型互斥
                handleSpecialProductTypeListMutualExclusion(`isDisabledSpecialProType_${index}`)
            })
        }
    }
  })
}

// 展示特殊商品类型下拉
function showSpecialProductType(){
  // 渲染表格里面每一项的特殊商品类型
  setTableLogisSelectData(LogicTypeList)
}

// 根据sku长度去渲染同样长度半托管
function renderAeHalfTableBySkuList () {
    const prodSSkuList = subPublish_ModalDetail_Data.prodListingSubSkuAliexpressSmts.map((item) => {
      return item.prodSSku
    })
    const smtStoreAcctId = subPublish_ModalDetail_Data.prodListingSubSkuAliexpressSmts[0].storeAcctId

    let params = {
      prodSSkuList,
      smtStoreAcctId,
      prodPId
    }
    commonReturnPromise({
      url: ctx + '/aliexpressHalfManage/publish/getHalfManaeDefaultPulishData',
      params: JSON.stringify({ ...params }),
      type: 'post',
      contentType: 'application/json;charset=UTF-8'
    })
      .then(data => {
        let aehalfTableList = data

        let propertyObj = {}
        let aeHalfStoreSSkuObj = {}

        $('#smtPublish_SubSkuInfo2 tr').each(function(){
            const arr  = ['imgAttr','attr1','attr2','attr3']
            let str = ''
            arr.forEach(v=>{
                // attr没有值 才去映射color
                const selectDom = $(this).find(`select[name=${v}]`)
                const color = selectDom.find('option:selected').text()
                const attrName = selectDom.data('attrname')
                const attr = $(this).find(`input[name=${v}Name]`).val()
                const pro = attr || color
                if(selectDom.length){
                    str += attrName + '-'+ pro+'</br>'
                }
            })
        
            const prodSSku = $(this).data('prodssku')
            if(!propertyObj[prodSSku]){
                propertyObj[prodSSku] = str
            }
            // 店铺子SKU 和半托管双向联动
            aeHalfStoreSSkuText = $(this).find('input[name=skuInfo_storeSSku]').val()
            if(!aeHalfStoreSSkuObj[prodSSku]){
                aeHalfStoreSSkuObj[prodSSku] = aeHalfStoreSSkuText
            }

        })
        aehalfTableList = data.map((item) => ({
          ...item,
          storeSSku: aeHalfStoreSSkuObj[item.prodSSku] || '',
          skuProperty :propertyObj[item.prodSSku] || '',
          originalBox: item.originalBox || true,
          oldSpecialProductTypeList: item.specialProductTypeList.length ? item.specialProductTypeList : ['general'],
          scItemBarCode: item.originalBox || '',
          packageWeight: Math.round(item.packageWeight),
        }))
        subPublish_ModalDetail_Data.subHalfManageExtraList = aehalfTableList

        const skuInfoListObj = {
          subHalfManageExtraList: aehalfTableList
        }

        aeHalfTableRender(skuInfoListObj)
      }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

// 渲染特殊商品类型互斥
function handleSpecialProductTypeListMutualExclusion(name){
    let targetElement= $('[fs_id=' + name + '] .xm-select-title  .xm-input.xm-select')[0];
    let observer = new MutationObserver(function(mutations) {
    //  // 确保在回显的地方删除 也要联动
    //   let hasClassSelected = $('[fs_id=' + name + '] .xm-form-select').hasClass('xm-form-selected');
    //   if(hasClassSelected){
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'title') {
            // title 属性发生变化时的逻辑
            let ddSelecteds = $('[xid=' + name + ']').find('dd.xm-select-this');
            let dds = $('[xid=' + name + ']').find('dd');

            if(ddSelecteds.length == 0){
                for(let i=0; i<dds.length; i++){
                  let item = dds[i];
                   $(item).removeClass('xm-dis-disabled')
                  $(item).find('div').removeClass('xm-dis-disabled ')
                  }
                }
              else if(ddSelecteds.length == 1 && $(ddSelecteds[0]).attr('lay-value') == 'general'){
                // 如果选择了普货
                for(let i=0; i<dds.length; i++){
                  let item = dds[i];
                  let id = $(item).attr('lay-value');
                  if(id !='general'){
                    $(item).addClass('xm-dis-disabled ')
                    $(item).find('div').addClass('xm-dis-disabled ')
                  }
                }
              }else{
                for(let i=0; i<dds.length; i++){
                  let item = dds[i];
                  let id = $(item).attr('lay-value');
                 
                    $(item).removeClass('xm-dis-disabled ')
                    $(item).find('div').removeClass('xm-dis-disabled ')
                  if(id == 'general'){
                   $(item).addClass('xm-dis-disabled ')
                    $(item).find('div').addClass('xm-dis-disabled ')
                  }
                }
              }
            
          }
        });
    //   }
    });
    // 配置 MutationObserver 监听属性的变化
    let config = { attributes: true };
    // 开始观察目标元素
    observer.observe(targetElement, config);
}
// 图片属性下oa值相同表示 属于同个聚合
function smt_Publish_skuAttr_Select(){
    const { form } = layui
    AttrInfos.forEach(item=>{
        form.on(`select(smt_publish_${item})`,function(obj){
            let name = $(obj.elem).data('attrname')
            if(item==='imgAttr'){
                //    获取选中数据重新渲染
                // 当前 oa 值
                const curInputVal = $(obj.elem).parents('.imgAttr').find('input[name=imgAttrName]').val()
                // 同个属性下需要一起更换
                $('#smtPublish_SubSkuInfo2').find('select[name=imgAttr]').each(function(){
                    let inputVal = $(this).parents('.imgAttr').find('input[name=imgAttrName]').val()
                    if(curInputVal == inputVal){
                        $(this).val(obj.value)
                    }
                })
            }
            form.render()
            smtPublish_render_select(name,item)
        })
    })
}

function smtPublish_render_select(keyName,attrName){
    let _smtPublish_skuList = JSON.parse(JSON.stringify(smtPublish_skuList))
    //使用的
    let usedArr = []
    let usedObj = {}

    $('#smtPublish_SubSkuInfo2').find(`select[name=${attrName}]`).each(function(){
        let value = Number($(this).val())
        let name = $(this).find('option:selected').text()
        if(!usedObj[value]){
            usedObj[value] = true
            usedArr.push({ value, name})
        }
    })

    let unUsedArr = _smtPublish_skuList[keyName].filter(elem=>!usedObj[elem.value])

    _smtPublish_skuList[keyName] = usedArr.concat(...unUsedArr)
    // 重新渲染
    $('#smtPublish_SubSkuInfo2').find(`select[name=${attrName}]`).each(function(){
        let curVal = $(this).val()
        let optionStr = _smtPublish_skuList[keyName].map(elem=>{
            let selected = elem.value==curVal ? 'selected' : ''
            let str = `<option value="${elem.value}"  ${selected}>${elem.name}</option>`
            return str
        }).join('')
        $(this).html(optionStr)
    })
    layui.form.render()
}

// //sku图片的属性值
// function smtPublish_blur_skuImgText(dom){
//     let _val = $(dom).val()
//     // 找到同行的图片属性值 如果有相同的，就一起更换
//     // 同个属性下需要一起更换
//     let curImgAttr = $(dom).parents('.imgAttr').find('select[name=imgAttr]').val()
    // $('#smtPublish_SubSkuInfo2').find('select[name=imgAttr]').each(function(){
    //     let curVal = $(this).find('option:selected').val()
    //     if(curImgAttr == curVal){
    //         $(this).parents('.imgAttr').find('input[name=imgCustomValue]').val(_val)
    //     }
    // })
// }
//
// 图片上传
$(document).on("change", "#smtPublish_SubSkuInfo2 .uploadLocalSkuImg", function (e) {
    var files = e.target.files;
    if (!files || !files.length) return;
    var formData = new FormData();
    formData.append('file', files[0]);
    $.ajax({
        type: "post",
        url: ctx + "/publish/smt/uploadPic.html",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        beforeSend: function () {
            loading.show();
        },
        success: function (data) {
            loading.hide();
            if (data.code == '0000') {
                // 添加一条要更新数据
                // 找到同行的图片属性值 如果有相同的，就一起更换
                    // 同个属性下需要一起更换
                    let curInputVal = $(e.target).parents('.imgDiv').find('input[name=imgAttrName]').val()
                    $('#smtPublish_SubSkuInfo2').find('input[name=imgAttrName]').each(function(){
                        let inputVal = $(this).val()
                        if(curInputVal == inputVal){
                            let imgDom = `<img class="img_show_hide smtPublish_imgCss lazy"
                            data-original="${data.msg}"
                            style="display: block;"
                            src="${data.msg}"
                            data-onerror="layui.admin.img_noFind()" />`
                            $(this).parents('.imgDiv').find('.epz-out').html(imgDom)
                        }
                    })
            } else {
                layer.msg(data.msg)
            }
        }
    });
})

// 图片删除
$(document).on("click", "#smtPublish_SubSkuInfo2 .removeSkuImg",function(e){
    let curInputVal = $(e.target).parents('.imgDiv').find('input[name=imgAttrName]').val()
    $('#smtPublish_SubSkuInfo2').find('input[name=imgAttrName]').each(function(){
        let inputVal = $(this).val()
        if(curInputVal == inputVal){
            let imgDom = `<img src="/lms/static/img/kong.png"/>`
            $(this).parents('.imgDiv').find('.epz-out').html(imgDom)
        }
    })
})

// SKU信息 删除行 删除视频
    $(document).on("click", "#smtPublish_SubSkuInfo2 .delAttrTr",function(e){
        layui.layer.confirm('删除后，该商品子SKU将不在此listing中刊登。确定删除该商品子SKU吗？',{icon:7},function(index){
            const tr = $(e.target).parents('tr')
            // 某个商品父SKU下所有子SKU均为删除，则该商品父SKU的视频不再展示
            const curSsku= tr.data('prodpsku')
            const prodssku = tr.data('prodssku')
            tr.remove()
            // sku表格信息改变 半托管联动删除
            $('#smtPublish_AESubSkuInfo2 tr').each(function(){
                const prodSSku = $(this).data('prodssku')
             
                if(prodssku == prodSSku){
                  $(this).remove()
                }
              })
            subPublish_ModalDetail_Data.prodListingSubSkuAliexpressSmts = subPublish_ModalDetail_Data.prodListingSubSkuAliexpressSmts.filter(function(item) {
                return item.prodSSku !== prodssku;
              });
            const sSkuObj = {}
            // 与发货地联动
            const placeObj = {}
            $('#smtPublish_SubSkuInfo2').find('tr').each(function(){
                sSkuObj[$(this).data('prodpsku')] = true
                placeObj[$(this).data('place')] = true
            })
            if(!sSkuObj[curSsku]){
                $('#smtPublish_editDetail_video_list').find('li').each(function(){
                    const _curSsku= $(this).data('prodpsku')
                    if(curSsku ==_curSsku ){
                        $(this).remove()
                    }
                })
            }
            // 表格里存在的发货地表示选中
            $('#smtPublish_deliveryPlace').find('input').each(function(){
                const curPlace = $(this).data('name')
                if(placeObj[curPlace]){
                    $(this).attr('checked',true)
                }else{
                    $(this).attr('checked',false)
                }
            })
            layui.form.render()
            layer.close(index)
        })
    })

// SKU信息 修改行
$(document).on("click", "#smtPublish_SubSkuInfo2 .changeAttrVal",function(td){
    const {layer,laytpl} = layui
    let tableArr = []
    layer.open({
        title: '修改属性映射',
        type: 1,
        id: Date.now(),
        content: $('#smtPublish_skuInfo_change_tpl').html(),
        area: ['600px', ''],
        btn: ['保存', '取消'],
        success: function (layero) {
            // 找到已有平台属性值
            $('#smtPublish_listingInfo_sub_tab2').find('thead tr th').each(function(index){
                if($(this).data('oaname')){
                    tableArr.push({oaname:$(this).data('oaname'), name:$(this).data('name')})
                }
            })
            laytpl($("#smtPublish_skuInfo_change_tpl").html()).render(tableArr, function (html) {
                $(layero).find(".layui-layer-content").html(html)
            })
            let prodssku = $(td.target).parents('tr').data('prodssku')
            $(layero).find(".layui-layer-content").find('.layui-card-header').text(`商品子sku:${prodssku}`)
            // 互换值
            layero.find('.changeAttrVal').click(function(e){
                const prevDom = $(e.target).prev().find('tbody td')
                const nextDom =  $(e.target).next().find('tbody td')
                let temp = nextDom.text()
                nextDom.text(prevDom.text())
                prevDom.text(temp)
                const prevTableDom = $(e.target).prev()
                const nextTableDom =  $(e.target).next()
                let _temp = nextTableDom.data('colname')
                nextTableDom.data('colname',prevTableDom.data('colname'))
                prevTableDom.data('colname',_temp)

            })
        },
        yes: function (index, layero) {
            let trDom = $(td.target).parents('tr')
            let newTableArr = []
            layero.find('table').each(function(){
                newTableArr.push($(this).data('colname'))
            })
            let _newTableArr =newTableArr.map(item=>
                trDom.find(`td input[name=${item}]`).val()
            )
            tableArr.forEach((item,index)=>{
                trDom.find(`td input[name=${item.name}]`).val(_newTableArr[index])
            })
            getAeHalfManageSkuPro()
            layer.close(index)
        },
    })
})
// SKU信息 批量修改行
function smtPublish_batchEditSku(){
    var checkedR = $('#smtPublish_listingInfo_sub_tab2').find('input[name=singlechecked]:checked').parents('tr')
    if (!checkedR.length) {
        return layer.msg('至少选择一条数据')
    } else {
        const {layer,laytpl} = layui
        let tableArr = []
        layer.open({
            title: '批量修改属性映射',
            type: 1,
            id: Date.now(),
            content: $('#smtPublish_skuInfo_change_tpl').html(),
            area: ['600px', ''],
            btn: ['保存', '取消'],
            success: function (layero) {
                // 找到已有平台属性值
                $('#smtPublish_listingInfo_sub_tab2').find('thead tr th').each(function(index){
                    if($(this).data('oaname')){
                        tableArr.push({oaname:$(this).data('oaname'),name:$(this).data('name')})
                    }
                })
                laytpl($("#smtPublish_skuInfo_change_tpl").html()).render(tableArr, function (html) {
                    $(layero).find(".layui-layer-content").html(html)
                })
                // 互换值
                layero.find('.changeAttrVal').click(function(e){
                    const prevDom = $(e.target).prev().find('tbody td')
                    const nextDom =  $(e.target).next().find('tbody td')
                    let temp = nextDom.text()
                    nextDom.text(prevDom.text())
                    prevDom.text(temp)
                    const prevTableDom = $(e.target).prev()
                    const nextTableDom =  $(e.target).next()
                    let _temp = nextTableDom.data('colname')
                    nextTableDom.data('colname',prevTableDom.data('colname'))
                    prevTableDom.data('colname',_temp)

                })
            },
            yes: function (index, layero) {
                let newTableArr = []
                layero.find('table').each(function(){
                    newTableArr.push($(this).data('colname'))
                })
                checkedR.each(function(){
                    let _newTableArr =newTableArr.map(item=>
                        $(this).find(`td input[name=${item}]`).val()
                    )
                    tableArr.forEach((item,index)=>{
                        $(this).find(`td input[name=${item.name}]`).val(_newTableArr[index])
                    })
                })
                getAeHalfManageSkuPro()
                layer.close(index)
            },
        })
    }

}

// sku信息 添加sku
function smtPublish_addSku(){
    let skus = $('#smtPublish_editDetailForm').find('input[name=skus]').val()
    if(skus===''){
       return layer.msg('请输入数据')
    }
    let usedImageAttrValues = []
    $('#smtPublish_SubSkuInfo2').find('select[name=imgAttr]').each(function(){
        let curVal = $(this).find('option:selected').val()
        if(!usedImageAttrValues.includes(curVal)){
            usedImageAttrValues.push(curVal)
        }
    })
    let params = {
        usedImageAttrValues,
        skus:skus.split(','),
        storeAcctId:Number(subPublish_ModalDetail_Data.storeAcctId)
    }
    if(smtPublish_TABVALUE == -2){
        params.aliexpressTplId=subPublish_ModalDetail_Data.aliexpressTemplateId
    }else{
        params.prodListingId=subPublish_ModalDetail_Data.id
    }
    // 找到发货地有几个
    let delivPlaArr = []
    $('#smtPublish_deliveryPlace').find('input:checked').each(function(){
        delivPlaArr.push($(this).data('name'))
    })
    if(!delivPlaArr.length){
        delivPlaArr.push('NONE')
    }

    // 直接报价选中几个国家
    let priceCountryArr = []
    $('#smtPublish_placePrice_country').find('input:checked').each(function(){
        priceCountryArr.push({
            name:$(this).data('name'),
            sort:$(this).data('sort'),
            code:$(this).data('code'),
        })
    })
    // 直接报价的列
    let priceCountryCols =  priceCountryArr.map(elem=>{
        return `<td class="taCenter smtPublish-skuInfo-row-width" data-sort="${elem.sort}">
        <div class="disFCenter">
            <div class="w50 unit">$</div>
            <input class="layui-input smtPublish_${elem.code}"
            onblur="smtPublish_skuInfo_blur_area_price(this)"
            onchange="smtPublish_changeRegionPriceFixPrice(this)" name="smtPublish_${elem.code}" value="${elem.price===undefined ? '' : elem.price}"
            data-code="${elem.code}" data-sort="${elem.sort}" data-name="{{elem.name}}"
        />
        </div>
        <div class="disFCenter">
            <div class="w50 unit">￥</div>
            <input class="layui-input smtPublish_${elem.code}"
            onblur="smtPublish_skuInfo_blur_area_priceCny(this)"
            onchange="smtPublish_changeRegionPriceFixPrice(this)" name="smtPublish_${elem.code}_priceCny" value="${elem.priceCny===undefined ? '' : elem.priceCny}"
            data-code="${elem.code}" data-sort="${elem.sort}" data-name="{{elem.name}}"
        />
        </div>
    </td>`
    }).join('')
    let repeatSkuArr = []
    commonReturnPromiseRes({
        url: ctx + '/aliexpress/publish/addSkuForPublish',
        type: 'post',
        params: JSON.stringify(params),
        contentType: 'application/json;charset=UTF-8'
    }).then(res=>{
        // 写的很糟糕，可以看看文档重新写
        if(res.data.length){
            // 添加视频
            smtPublish_addVideo(res.data)
            // 重复的sku不添加
            let prodsskuArr = []
            let addExistAttrsObj = {}

            $('#smtPublish_SubSkuInfo2').find('tr').each(function(){
                prodsskuArr.push($(this).data('prodssku'))
                $(this).data('isnewtr','false')
            })
            let _data = res.data.filter(item=>!prodsskuArr.includes(item.prodSSku))
            repeatSkuArr = res.data.filter(item=>prodsskuArr.includes(item.prodSSku)).map(item=>item.prodSSku)
            let existAttrThObj = {}
            let existAttrIdObj = {}
            // 已有的
            $('#smtPublish_listingInfo_sub_tab2').find('thead tr th').each(function(){
                let attrName = $(this).data('attrname')
                let colName = $(this).data('name')
                if(colName && attrName){
                    let prefixName = colName.slice(0,-4)
                    existAttrThObj[colName]=attrName
                    existAttrThObj[`${prefixName}Id`]=$(this).data('attrid')
                    existAttrThObj[`${prefixName}OaAttrName`]=$(this).data('oaname')
                    existAttrThObj[`${prefixName}CustomValue`]=''
                    existAttrThObj[`${prefixName}Value`]= ''
                    existAttrThObj[`${prefixName}ValueId`]= ''
                    existAttrIdObj[$(this).data('attrid')] = `${prefixName}Id`
                }
            })
            let _AttrInfos=AttrInfos.map(elem=>elem+'Name')
            let delItemTag = false
            let delItemArr = []
            _data.forEach((item,index)=>{
                Object.keys(item).forEach(elem=>{
                    if(_AttrInfos.includes(elem)){
                        let _elem = elem.slice(0, -4)
                        // 已有的attr1和后端新增返回和attr2有可能对应的是统一属性
                        if(existAttrIdObj[item[_elem+'Id']]){
                            let prefixName = existAttrIdObj[item[_elem+'Id']].slice(0,-2)
                            delItemTag = true
                            delItemArr.push(_elem)
                            addExistAttrsObj[prefixName+'Id'] = item[_elem+'Id']
                            addExistAttrsObj[prefixName+'Name'] = item[elem]
                            addExistAttrsObj[prefixName+'Value'] = item[_elem+'Value']
                            addExistAttrsObj[prefixName+'ValueId'] = item[_elem+'ValueId']
                            addExistAttrsObj[prefixName+'CustomValue'] = item[_elem+'CustomValue'] || item[_elem.slice(0,3)+'CustomValue']
                            addExistAttrsObj[prefixName+'OaAttrName'] = item[_elem+'OaAttrName'] || item[_elem.slice(0,3)+'OaAttrName']
                        }else{
                            if(Object.values(existAttrIdObj).includes(_elem+'Id')){
                                delItemTag = true
                                delItemArr.push(_elem)
                                ['attr1','attr2','attr3'].some(_elem2=>{
                                    if(!Object.values(existAttrIdObj).includes(_elem2+'Id')){
                                        addExistAttrsObj[_elem2+'CustomValue'] = item[_elem+'CustomValue'] || item[_elem.slice(0,3)+'CustomValue']
                                        addExistAttrsObj[_elem2+'Id'] = item[_elem+'Id']
                                        addExistAttrsObj[elem2 +'Name'] = item[elem]
                                        addExistAttrsObj[_elem2+'OaAttrName'] = item[_elem+'OaAttrName']|| item[_elem.slice(0,3)+'OaAttrName']
                                        addExistAttrsObj[_elem2+'Value'] = item[_elem+'Value'] || ''
                                        addExistAttrsObj[_elem2+'ValueId'] = item[[_elem+'ValueId']] || ''
                                        existAttrIdObj[item[_elem2+'Id']] = `${_elem}Id`
                                    }
                                })
                            }else{
                                addExistAttrsObj[_elem+'CustomValue'] = item[_elem+'CustomValue'] || item[_elem.slice(0,3)+'CustomValue']
                                addExistAttrsObj[_elem+'Id'] = item[_elem+'Id']
                                addExistAttrsObj[elem] = item[elem]
                                addExistAttrsObj[_elem+'OaAttrName'] = item[_elem+'OaAttrName']|| item[_elem.slice(0,3)+'OaAttrName']
                                addExistAttrsObj[_elem+'Value'] = item[_elem+'Value'] || ''
                                addExistAttrsObj[_elem+'ValueId'] = item[[_elem+'ValueId']] || ''
                                existAttrIdObj[item[_elem+'Id']] = `${_elem}Id`
                            }
                        }

                    }
                })
                if(delItemTag){
                    delItemArr.forEach(attrElem=>{
                        if(!Object.values(existAttrThObj).includes(`${attrElem}Id`)){
                            delete item[attrElem+'CustomValue']
                            delete item[attrElem+'Id']
                            delete item[attrElem+'Name']
                            delete item[attrElem+'OaAttrName']
                            delete item[attrElem+'Value']
                            delete item[attrElem+'ValueId']
                        }
                    })
                    delItemArr = []
                }
                _data[index] = {...existAttrThObj,...addExistAttrsObj,...item}
            })
            let _smtPublish_skuList = smtPublish_dealSkuAttrList(_data)
            _data.forEach(item=>{
                subPublish_ModalDetail_Data.prodListingSubSkuAliexpressSmts.push(item)
                let imgHtml = item.skuImage !=null ? `<img class="img_show_hide smtPublish_imgCss lazy" data-original="${item.skuImage}"style="display: block;" src="${item.skuImage}" data-onerror="layui.admin.img_noFind()">` : '<img src="/lms/static/img/kong.png"/>'

                let cols =  delivPlaArr.map(elem=> `<tr data-place=${elem} data-prodssku="${item.prodSSku}" data-prodpId="${item.prodPId}" data-prodpsku="${item.prodPSku}" data-isnewtr="true">
                <td class="taCenter w20" data-sort="0"><input type="checkbox" lay-skin="primary"
                        name='singlechecked' checked
                        lay-filter="smtPublish_listingInfo_sCheked">
                </td>
                ${!item.imgAttrId ? '' :`<td style="width: 140px !important;" data-sort="0">
                <div class="imgDiv sell-hot-icon-box">
                    <div class="epz-out w_100 attrimage">
                        ${imgHtml}
                    </div>
                    <div class="mb5 disflex">
                        <a href="javascript:;" type="button" class="layui-btn layui-btn-xs" style="padding: 0 11px; border-radius:10%;">上传图片</a>
                        <input type="file" class="uploadLocalSkuImg" style="width: 70px;">
                        <a href="javascript:;" type="button" class="layui-btn layui-btn-xs layui-btn-danger ml10 removeSkuImg" style="padding: 0 17px; border-radius:10%">删除</a>
                    </div>
                    <div class="disflex imgAttr">
                        <div>
                            <select name="imgAttr" lay-filter="smt_publish_imgAttr" data-attrname="${item.imgAttrName}"  data-attrid="${item.imgAttrId}" data-imgval="${item.imgAttrValue}" data-oaname="${item.imgAttrOaAttrName}">
                                ${smtPublish_skuAttrOption(item.imgAttrValueId, _smtPublish_skuList[item.imgAttrName])}
                            </select>
                        </div>
                        <div class="taCenter ml10"><input type="text" value="${item.imgAttrCustomValue ===undefined ? '' : item.imgAttrCustomValue}" name="imgAttrName" class="layui-input" onblur="smtPublish_attrInputBlur(event)"></div>
                    </div>
                </div>
            </td>`}
                ${item.attr1Id ? smtPublish_skuAttrTr(item,1,_smtPublish_skuList[item.attr1Name]):''}
                ${item.attr2Id ? smtPublish_skuAttrTr(item,2,_smtPublish_skuList[item.attr2Name]):''}
                ${item.attr3Id ? smtPublish_skuAttrTr(item,3,_smtPublish_skuList[item.attr3Name]):''}
            <td class="taCenter smtPublish_skuInfo_storeSSku" style="width:180px"
                attr-prodSSku="${item.prodSSku}" data-sort="0">
                <input class="layui-input "
                    name="skuInfo_storeSSku"
                    data-last="${elem ==="NONE"?(item.storeSSku||''):item.storeSSku+"/"+elem}"
                    data-origin="${elem ==="NONE"?(item.storeSSku||''):item.storeSSku+"/"+elem}"
                    onblur="smtPublish_skuInfo_storeSSkuBlur(this)"
                    value="${elem ==="NONE"?(item.storeSSku||''):item.storeSSku+"/"+elem}"/></td>
                </td>
            <td class="taCenter skuInfo_weight" data-sort="0">${item.weight || ''}</td>
            <td class="taCenter skuInfo_cost" data-sort="0">${item.cost || ''}</td>
            <td class="taCenter" id="smtPublish_skuInfo_deliveryPlace" data-sort="0">${elem}</td>
            <td class="taCenter smtPublish-skuInfo-row-width" data-sort="0"><input type="number" class="layui-input smtPublish_stock"
                    name="skuInfo_stock"
                    value="${item.stock===undefined ? '' : item.stock}"></td>
            <td class="taCenter" style="min-width: 230px;" data-sort="0">
                <input type="number" class="layui-input smtPublish_price"
                    name="skuInfo_price" onkeypress="commonKeyPressInputFloat(event)"
                    onblur="smtPublish_skuInfo_blur_price(this)"
                    value="${item.price===undefined ? '' : item.price}"
                />
            </td>
            <td class="taCenter" style="min-width: 230px;" data-sort="0">
                <input type="number" class="layui-input smtPublish_priceCny"
                    name="skuInfo_priceCny" onkeypress="commonKeyPressInputFloat(event)"
                    onblur="smtPublish_skuInfo_blur_priceCny(this)"
                    value="${item.priceCny===undefined ? '' : item.priceCny}"
                />
            </td>
            <td class="taCenter smtPublish_estimateProfit" data-sort="0">${item.estimateProfit==undefined? '' : '&yen;'+item.estimateProfit}</td>
            ${priceCountryCols}
            <td class="taCenter w100" data-sort="9999">
                <a href="javascript:;" type="button" data-prodssku="${item.prodSSku}" class="layui-btn layui-btn-xs changeAttrVal" style="border-radius:10%;">修改属性映射</a>
                <a href="javascript:;" type="button" class="layui-btn layui-btn-xs layui-btn-danger mt10 delAttrTr" style="border-radius:10%">删除</a>
            </td>
                </tr>`).join('')
                $('#smtPublish_SubSkuInfo2').append(cols)
            })

            // 判断
           let theadThs = $('#smtPublish_listingInfo_sub_tab2').find('thead tr th').length
           let lastTrTds = $('#smtPublish_SubSkuInfo2').find('tr').last().find('td').length
           if(lastTrTds > theadThs){
                Object.keys(addExistAttrsObj).forEach(key=>{
                    if(key.includes('CustomValue')){
                        addExistAttrsObj[key] = ''
                    }
                    if(key.includes('AttrValueId')){
                        let _key = key.slice(0,7)
                        addExistAttrsObj[_key+'Value'] = ''
                        addExistAttrsObj[_key+'ValueId'] = ''
                    }
                })
                Object.keys(addExistAttrsObj).forEach(key=>{
                    let attrId = addExistAttrsObj[key.slice(0,-4)+'Id']
                    if(existAttrThObj[key]===undefined && attrId && _AttrInfos.includes(key)){
                        let colIndex = 1
                        // 以前的添加列
                        let attrName = addExistAttrsObj[key]
                        let attrOaAttrName = addExistAttrsObj[key.slice(0,-4)+'OaAttrName']
                        let colThStr = `<th data-sort="0" data-attrid="${attrId}" data-attrname="${attrName}" data-oaname="${attrOaAttrName}" data-name="${key}" style="width: 140px !important;">${attrName}</th>`

                        if(key === 'imgAttrName'){
                            let colTdStr = `<td style="width: 140px !important;" data-sort="0">
                            <div class="imgDiv sell-hot-icon-box">
                                <div class="epz-out w_100 attrimage"><img src="/lms/static/img/kong.png"/></div>
                                <div class="mb5 disflex">
                                    <a href="javascript:;" type="button" class="layui-btn layui-btn-xs" style="padding: 0 11px; border-radius:10%;">上传图片</a>
                                    <input type="file" class="uploadLocalSkuImg" style="width: 70px;">
                                    <a href="javascript:;" type="button" class="layui-btn layui-btn-xs layui-btn-danger ml10 removeSkuImg" style="padding: 0 17px; border-radius:10%">删除</a>
                                </div>
                                <div class="disflex imgAttr">
                                    <div>
                                        <select name="imgAttr" lay-filter="smt_publish_imgAttr" data-attrname="${attrName}"  data-attrid="${attrId}" data-imgval="${addExistAttrsObj.imgAttrValue}" data-oaname="${attrOaAttrName}">
                                            ${smtPublish_skuAttrOption(addExistAttrsObj.imgAttrValueId, _smtPublish_skuList[attrName])}
                                        </select>
                                    </div>
                                    <div class="taCenter ml10"><input type="text" value="" name="imgAttrName" class="layui-input"></div>
                                </div>
                            </div>
                        </td>`
                            $(`#smtPublish_listingInfo_sub_tab2>tbody>tr`).each(function(){
                                if($(this).data('isnewtr')=='false'){
                                    $(this).find('td').eq(colIndex).before(colTdStr)
                                }
                            })
                            $('#smtPublish_listingInfo_sub_tab2').find('thead tr th').eq(colIndex).before(colThStr);
                        }else{
                            // 判断添加的位置
                            if(key==='attr1Name'){
                                if(existAttrThObj.imgAttrName){
                                    colIndex = 2
                                }
                            }else if(key==='attr2Name'){
                                let _colIndex = $('#smtPublish_listingInfo_sub_tab2').find('thead tr .attrEndTag').index()
                                if(existAttrThObj.attr3Name){
                                    colIndex = _colIndex - 1
                                }
                                colIndex = _colIndex
                            }else if(key==='attr3Name'){
                                colIndex =  $('#smtPublish_listingInfo_sub_tab2').find('thead tr .attrEndTag').index()
                            }
                            let colThStr = `<th data-sort="0" data-attrid="${attrId}" data-attrname="${attrName}" data-oaname="${attrOaAttrName}" data-name="${key}" style="width: 140px !important;">${attrName}</th>`
                            let attrIndex = Number(key.slice(4,5))
                            let colTdStr = smtPublish_skuAttrTr(addExistAttrsObj ,attrIndex, _smtPublish_skuList[attrName])
                            $(`#smtPublish_listingInfo_sub_tab2>tbody>tr`).each(function(){
                                if($(this).data('isnewtr')=='false'){
                                    $(this).find('td').eq(colIndex).before(colTdStr)
                                }
                            })
                            $('#smtPublish_listingInfo_sub_tab2').find('thead tr th').eq(colIndex).before(colThStr);

                        }
                    }
                })


           }
        }
        renderAeHalfTableBySkuList()
        if(!!res.extra){
            layer.alert(res.extra,{icon:7},function(index){
                layer.close(index);
                if(repeatSkuArr.length){
                    layer.msg(repeatSkuArr.join(',')+'已存在',{icon:7})
                }
            })
        }else if(repeatSkuArr.length){
            layer.msg(repeatSkuArr.join(',')+'已存在',{icon:7})
        }
        layui.form.render()
    }).catch(err=>{
        layer.msg(err,{icon:2})
    })
}

function smtPublish_addVideo(data){
    // 新添加某个商品父SKU到该模板，则该商品父SKU的视频联动展示在商品视频处
    let locationArr = []
    $('#smtPublish_editDetail_video_list').find('li').each(function(){
        const location = $(this).data('location')
        locationArr.push(location)
    })
    // 通过location避免重复上传
    const params = {}
    params.prodPIds =  data.map(item=>item.prodPId)
    // if(smtPublish_TABVALUE == -2){
    //     params.aliexpressTplId=subPublish_ModalDetail_Data.aliexpressTemplateId
    // }else{
        params.prodListingId=subPublish_ModalDetail_Data.id
    // }
    commonReturnPromise({
        url:'/lms/aliexpressVideo/queryAliexpressVideoInfo',
        params: JSON.stringify(params), 
        type:'post',
        contentType: 'application/json'
    }).then(res=>{
        if(typeof res ==='object' && res.length){
            const videos = res[0].videos
            videos.forEach(item=>{
                if(!locationArr.includes(item.location)){
                    let liStr = `<li style="width: 220px;height: 170px;align-items: center;" class="disflex" data-id="${item.id}" data-prodpsku="${item.sku}" data-location="${item.location}">
                    <div class="ml10">
                        <input type="radio" name="checkedVideo" lay-filter="smtPublish_editDetail_video_checked" value="${item.location}" data-sku="${item.sku}" data-id="${ item.id }">
                    </div>
                    <div>
                        <div class="taCenter">${item.sku }</div>
                        <div class="common_play_video" data-video="${item.location}" style="position:absolute;background-color:rgba(0,0,0,0.1);width:150px;height:150px;cursor:pointer;">
                            <i class="layui-icon layui-icon-play" style="font-size:40px;position:relative;left:55px;top:70px;color:#000;"></i>
                        </div>
                        <div style="border:1px solid #e6e6e6;width:150px">
                            <img src="${item.picture }!size=150x150" alt="${item.videoname }" data-video="${item.location}" width='150' height='150' />
                        </div>
                    </div>
                </li>`
                $('#smtPublish_editDetail_video_list').append(liStr)
                layui.form.render()
                }
            })
        }
    })
}

//
// 监听SKU信息表的所有的input，SKU信息表动任何一项数据，都需要重新生成SKU
$(document).on("blur", "#smtPublish_SubSkuInfo2 input[name='imgAttrName']", function () {
    let dataInputValue = $(this).val(),_this = this  // 选中的值
    if(dataInputValue.length > 20){
        $(_this).css('border-color','#FF5722');
        layer.msg('变种属性值不能超过20个字符', {icon: 5});
    }else{
        $(_this).css('border-color','#D2D2D2');
    }
})
// 监听SKU信息表的所有的input，SKU信息表动任何一项数据，都需要重新生成SKU
$(document).on("blur", "#smtPublish_SubSkuInfo2 input[name='attr1Name']", function () {
    let dataInputValue = $(this).val(),_this = this  // 选中的值
    if(dataInputValue.length > 20){
        $(_this).css('border-color','#FF5722');
        layer.msg('变种属性值不能超过20个字符', {icon: 5});
    }else{
        $(_this).css('border-color','#D2D2D2');
    }
})
// 监听SKU信息表的所有的input，SKU信息表动任何一项数据，都需要重新生成SKU
$(document).on("blur", "#smtPublish_SubSkuInfo2 input[name='attr2Name']", function () {
    let dataInputValue = $(this).val(),_this = this  // 选中的值
    if(dataInputValue.length > 20){
        $(_this).css('border-color','#FF5722');
        layer.msg('变种属性值不能超过20个字符', {icon: 5});
    }else{
        $(_this).css('border-color','#D2D2D2');
    }
})
// 监听SKU信息表的所有的input，SKU信息表动任何一项数据，都需要重新生成SKU
$(document).on("blur", "#smtPublish_SubSkuInfo2 input[name='attr3Name']", function () {
    let dataInputValue = $(this).val(),_this = this  // 选中的值
    if(dataInputValue.length > 20){
        $(_this).css('border-color','#FF5722');
        layer.msg('变种属性值不能超过20个字符', {icon: 5});
    }else{
        $(_this).css('border-color','#D2D2D2');
    }
})

function smtPublish_skuAttrTr(obj,num,optionList=[]){
        let name = obj['attr'+ num + 'Name']
        let attrId = obj['attr'+ num + 'Id']
        let oaAttrName = obj['attr'+ num + 'OaAttrName']
        let valueId = obj['attr'+ num + 'ValueId']
        let customValue = obj['attr'+ num + 'CustomValue']
        if(name!==undefined){
        let str = `<td data-sort="0" style="width: 140px !important;">
        <div class="disflex">
            <div>
                <select name="attr${num}" data-attrname="${name}"  data-attrid="${attrId}" data-oaname="${oaAttrName}">
                    ${smtPublish_skuAttrOption(valueId, optionList)}
                </select>
            </div>
            <div class="taCenter ml10">
                <input type="text" value="${customValue===undefined ? '' : customValue}" class="layui-input" onblur="smtPublish_attrInputBlur(event)" name="attr${num}Name">
            </div>
        </div>
    </td>`
    return str
    }else{
        return ''
    }
 }

 function smtPublish_dealSkuAttrList(allData = []){
    let _smtPublish_skuList = JSON.parse(JSON.stringify(smtPublish_skuList))
    if(allData.length){
        AttrInfos.forEach(item=>{
            let curName = item + 'Name'
            let curValue = item + 'Value'
            let curValueId = item + 'ValueId'
            let keyName = allData[0][curName]
            if(keyName){
                let usedArr = []
                let usedObj = {}
                // 已使用的
                $('#smtPublish_SubSkuInfo2').find(`select[name=${item}]`).each(function(){
                    let value = Number($(this).val())
                    let name = $(this).find('option:selected').text()
                    if(!usedObj[value]){
                        usedObj[value] = true
                        usedArr.push({value,name})
                    }
                })
                allData.forEach(elem=>{
                    let value = elem[curValueId]
                    let name = elem[curValue]
                    if(!usedObj[value]){
                        usedObj[value] = true
                        usedArr.push({value, name})
                    }
                })
                let unUsedArr = _smtPublish_skuList[keyName].filter(v =>!usedObj[v.value])
                _smtPublish_skuList[keyName] = usedArr.concat(...unUsedArr)
            }
        })
    }

    return _smtPublish_skuList
 }
function smtPublish_skuAttrOption(valueId,optionList){
   let optionStr = optionList.map(item=>`
        <option value="${item.value}" ${item.value==valueId ? 'selected' : '' }>${item.name}</option>
    `).join('')
    return optionStr
}

// 渲染 区域定价 的 调价地
function smtPublish_CountryPrice (adjustPriceCountry = []) {
    commonReturnPromise({
        url: ctx + '/aliexpress/publish/regionPriceCountry'
    }).then(data => {
        let singleDom = ''
        let sameObj = {}
        adjustPriceCountry.length && adjustPriceCountry.forEach(item => sameObj[item] = true)
        data.forEach((item, index) => {
            singleDom += `<div class="smtPublish_mentalProperty_checkbox disFCenter">
            <input type="checkbox" title="${Object.values(item)[0]}" name="adjustPriceCountry" lay-skin="primary"
            lay-filter="smtPublish_directCountryPrice" ${sameObj[Object.keys(item)[0]] ? 'checked' : ''}
            data-sort="${index + 1}" data-code="${Object.keys(item)[0]}"
            data-name="${Object.values(item)[0]}">
        </div>`
        })
        $('#smtPublish_placePrice_country').find('.smtPulish_listDetailTpl_container').html(singleDom)
        layui.form.render()
    }).catch(err => layer.msg(err, { icon: 2 }))
}

// 渲染区域定价的模板，做国家查询
function smtPublish_getTplCtyByStore () {
    commonRenderSelect('smtPublish_regionPriceTpl', subPublish_REGION_PRICE_LIST, { name: 'templateName', code: 'id' })
        .then(() => { layui.form.render() })
}

//标题随机
function smtPublish_randomTitle () {
    //随机接口
    commonReturnPromise({
        url: ctx + '/aliexpress/template/regentitle.html',
        params: { prodPId: subPublish_ModalDetail_Data.prodPId }
    }).then(data => {
        $("#smtPublish_editDetailForm input[name=title]").val(data)
        $("#smtPublish_editDetailForm input[name=title]").prop('value',data)
        $("#smtPublish_editDetailForm input[name=title]").attr('value',data)
        smtPublish_titleNumNoteJudge(data)
        $('.wordLimitTool').hide()
        commonAddEventTitleToggle($('#smtPublish_editDetailForm'), 'smt')
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))

}
//标题字数提示 最多128
function smtPublish_titleNumNote (dom) {
    smtPublish_titleNumNoteJudge($(dom).val())
}
//判断标题字数
function smtPublish_titleNumNoteJudge (data) {
    // var restNum = 128 - data.length
    // if (restNum < 0) {
    //     $("#smtPublish_editDetailForm input[name=title]").next('div').html(`超出字数：${-restNum}`)
    //     $("#smtPublish_editDetailForm input[name=title]").next('div').css('color', 'red')
    // } else {
    //     $("#smtPublish_editDetailForm input[name=title]").next('div').html(`剩余字数：${restNum}`)
    //     $("#smtPublish_editDetailForm input[name=title]").next('div').css('color', '#666')
    // }
}


// 标题还原
function smtPublish_restore (val) {
    $("#smtPublish_editDetailForm input[name=title]").val(val)
    smtPublish_titleNumNoteJudge(val)
    $('.wordLimitTool').hide()
    commonAddEventTitleToggle($('#smtPublish_editDetailForm'), 'smt')
}
//同步品牌
function smtPublish_sync_brand (isrequired) {
    var _storeAcctId = $("#smt_publish_search_form input[name=storeAcctId]").val()
    var storeAcctId = _storeAcctId && !_storeAcctId.includes(',') ? _storeAcctId : $("#smtPublish_editDetailForm input[name=storeAcctId]").val()
    commonReturnPromise({
        url: ctx + '/aliexpress/template/manualSyncCategoryBrand.html',
        params: { storeAcctId, smtCategoryId: subPublish_ModalDetail_Data.smtCategoryId },
    }).then((data) => {
        if (data.length == 0) {
            layui.layer.msg('该类目下无品牌选项')
        } else {
            var optionDoms = smtPublish_changeOptionToString(data, [])
            $("#smtPublish_editDetailForm select[name=" + isrequired + "2]").html(optionDoms)
            layui.form.render()
        }
    }).catch((err) => layui.layer.msg(err || err.message))
}

//更多选填属性 展示与否
function smtPublish_showMoreProperty () {
    if ($("#smtPulish_cag_prop_more").css('display') == 'none') {
        $("#smtPulish_cag_prop_more").show()
    } else {
        $("#smtPulish_cag_prop_more").hide()
    }
}

//自定义属性：添加自定义属性
function smtPublish_addProper () {
    var propertyOwnDom = '<div class="layui-row m-top10 detailItem"><div class="layui-col-md2"><input class="layui-input" type="text" name="property" placeholder="字数不超过70个"></div><div class="layui-col-md3 ml10"><input class="layui-input" type="text" name="propertyVal" placeholder="字数不超过70个"></div><div class="layui-col-md3 ml10"><button class="layui-btn layui-btn-sm layui-btn-primary" type="reset" onclick="smtPublish_delProperOwn(this)">删除</button></div></div>'
    $('#smtPublish_listDetailTpl_addproper').append(propertyOwnDom)
}

//自定义属性：删除全部
function smtPublish_delProper () {
    $('#smtPublish_listDetailTpl_addproper').empty()
}

//自定义属性：删除单个
function smtPublish_delProperOwn (obj) {
    $(obj).closest(".layui-row").remove()
}

// 删除图片
function smtPublish_delImg (data) {
    layer.confirm('您确认要删除图片？', { icon: 3, title: '提示' }, function (index) {
        var parentDom = $(data).parents('.smtPulish-rowFlexClass')
        $(data).closest('li').remove();
        var imgLength = $(parentDom).find('ul').find('li').length
        $(parentDom).find('.smtPublish-rowFlexClass-imgLength').text(imgLength)
        layer.close(index);
    });
}

// 主图 删除全部图片
function smtPublish_delAllMainImg () {
    layer.confirm('您确认要删除图片？', { icon: 3, title: '提示' }, function (index) {
        $(smtPublish_mainImages).find('li').remove();
        layer.close(index);
    });
}

//图片复制
function smtPublish_copyImg (btn) {
    var li = $(btn).closest('li')
    var img = li.find('img')[0]
    copyUrlOfImg(img)
}

// 白底图抠图
function smtPublish_mattingImg(btn){
    var li = $(btn).closest('li')
    var imgEle = li.find('img')[0]
    commonMattingImg($(imgEle))
}

//锚点
function smtPulish_Location (obj) {
    var $id = $(obj).data('id');
    document.getElementById($id).scrollIntoView();
}

//SKU信息 table 库存表头
function smtPublish_blurAllStock (data) {
    var inputV = $(data).val()
    var checkedR = $('#smtPublish_listingInfo_sub_tab2').find('input[name=singlechecked]:checked').parents('tr')
    if (!inputV) return false
    if (!checkedR.length) {
        return layer.msg('至少选择一条数据')
    } else {
        checkedR.each((_, item) => {
            $(item).find('.smtPublish_stock').val(inputV)
        })
    }
}

// smtpublish_exchangeRate
function smtPublish_estimateAllPrice (data) {
    const tableDom =$('#smtPublish_listingInfo_sub_tab2')
    const price = tableDom.find('input[name=price]').val()
    const operation = tableDom.find('select[name=priceOperation]').val()
    const checkedR = tableDom.find('input[name=singlechecked]:checked').parents('tr')
    if (!price) return false
    if (!checkedR.length) {
        return layer.msg('至少选择一条数据')
    } else if(operation == '=') {
        checkedR.each((_, item) => {
            $(item).find('.smtPublish_price').val(price)
            $(item).find('.smtPublish_priceCny').val((price * smtpublish_exchangeRate).toFixed(2))
        })
    }else if(operation == '+') {
        checkedR.each((_, item) => {
            const curPriceDom =$(item).find('.smtPublish_price')
            const finnalPrice = Number(curPriceDom.val()) + Number(price)
            curPriceDom.val(finnalPrice.toFixed(2))
            $(item).find('.smtPublish_priceCny').val((finnalPrice * smtpublish_exchangeRate).toFixed(2))
        })
    }else if(operation == '-') {
        checkedR.each((_, item) => {
            const curPriceDom =$(item).find('.smtPublish_price')
            const finnalPrice = Number(curPriceDom.val()) - Number(price)
            curPriceDom.val(finnalPrice.toFixed(2))
            $(item).find('.smtPublish_priceCny').val((finnalPrice * smtpublish_exchangeRate).toFixed(2))
        })
    }else if(operation == '*') {
        checkedR.each((_, item) => {
            const curPriceDom =$(item).find('.smtPublish_price')
            const finnalPrice = Number(curPriceDom.val()) * Number(price)
            curPriceDom.val(finnalPrice.toFixed(2))
            $(item).find('.smtPublish_priceCny').val((finnalPrice * smtpublish_exchangeRate).toFixed(2))
        })
    }
}

// 点击应用
layui.form.on('submit(formAeHalfBatchSet)', function(){
    handle_replay()
})


// 半托管批量填写 点击应用
function handle_replay() {
    let prodSSkuList = []
    $('#smtPublish_AESubSkuInfo2 tr').each((_, item)=>{
      const prodssku = $(item).data('prodssku')
      if(!prodSSkuList.includes(prodssku)){
        prodSSkuList.push(prodssku)
      }
    })

    let obj = {
        originalBox: '', // 是否原箱
        packageWeight: '', // 重量
        packageLength: '', // 长
        packageWidth: '', // 宽
        packageHeight: '', // 高
        oldSpecialProductTypeList: [], // 特殊商品类型
        basePriceUsd: null, // 美元价格
        basePriceCny: null, // 人民币
        sellableQuantity: null // JIT库存
      };
  
      Object.keys(obj).forEach((key) => {
          // 给表单中有值的赋值
          if (key === 'oldSpecialProductTypeList') {
            obj[key] = layui.formSelects.value('handleSpecialProductTypeList').map((item) => item.val)
            
          } else {
              obj[key] = $('#handleSet').find(`[name=${key}]`).val()
           
          }
  
      });

      $('#smtPublish_AESubSkuInfo2 tr').each(function() {
        Object.keys(obj).forEach((key) => {
            if(obj[key]){
                if(key === 'oldSpecialProductTypeList' && obj[key].length){
                    // 初次渲染 半托管列表添加互斥
                    let xmSelect = $(this).find('.table_logisInfo').attr('xm-select')
                    const _arr = LogicTypeList.map(item =>{
                        let selected = ''
                        let disabled = ''
                        if (obj[key].some(v=>v==item.value)) {
                            selected = 'selected'
                            }
                            if(obj[key].includes('general') && item.value!=='general'){
                            disabled = 'disabled'
                            }else if(!obj[key].includes('general') && item.value ==='general'){
                            disabled = 'disabled'
                            }
                            return { ...item, name: item.label, selected, disabled };
                    })
                    layui.formSelects.data(xmSelect, 'local', {arr: _arr})
                 
                }else{
                    $(this).find(`[name=${key}]`).val(obj[key])
                }
            }
        })
      })
      layui.form.render()

}

// 定价价格方法
layui.form.on('submit(formAeHalfBatchGross)', function(){
    handle_make_price()
})

function handle_make_price(){
  const grossRate = $('#gross_input').val()
 
    let prodSSkuList = []
    $('#smtPublish_AESubSkuInfo2 tr').each((_,item)=>{
      const prodssku = $(item).data('prodssku')
      if(!prodSSkuList.includes(prodssku)){
        prodSSkuList.push(prodssku)
      }
    })
    const smtStoreAcctId = subPublish_ModalDetail_Data.prodListingSubSkuAliexpressSmts[0].storeAcctId

    let params = {
      prodSSkuList,
      smtStoreAcctId,
      prodPId,
      grossRate
    }
    commonReturnPromise({
      url: ctx + '/aliexpressHalfManage/publish/getHalfManaeDefaultPulishData',
      params: JSON.stringify({ ...params }),
      type: 'post',
      contentType: 'application/json;charset=UTF-8'
    })
      .then(data => {
          // 给人民币美元赋值
          let obj = {
            basePriceUsd: null, // 美元价格
            basePriceCny: null, // 人民币
          };
      
          $('#smtPublish_AESubSkuInfo2 tr').each(function() {
            const prodSSku = $(this).data('prodssku')
            Object.keys(obj).forEach((key) => {
                const resultIndex = data.findIndex(res=> res.prodSSku === prodSSku)
                if(resultIndex>-1){
                    $(this).find(`[name=${key}]`).val(data[resultIndex][key])
                }   
            })
          })
          layui.form.render()
      }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

  // 验证半托管必填
  const verifyForm = () => {
    const resultKey = [
      'storeSSku',
      'originalBox',
      'packageWeight',
      'packageLength',
      'packageWidth',
      'packageHeight',
      'oldSpecialProductTypeList',
      'basePriceUsd',
      'basePriceCny',
      'sellableQuantity'
    ];

    const isRequiredFieldFilled = (item) => {
      return resultKey.every((key) => {
        if (key === 'originalBox' && item[key] !== '') {
          return true;
        } else if (key === 'oldSpecialProductTypeList') {
          return Array.isArray(item[key]) && item[key].length > 0;
        }
        return item[key];
      });
    };

    return subPublish_ModalDetail_Data.subHalfManageExtraList.every(isRequiredFieldFilled);
  };



// smtpublish_exchangeRate
function smtPublish_estimateAllPriceCny(data){
    const tableDom =$('#smtPublish_listingInfo_sub_tab2')
    const price = tableDom.find('input[name=priceCny]').val()
    const operation = tableDom.find('select[name=priceOperationCny]').val()
    const checkedR = tableDom.find('input[name=singlechecked]:checked').parents('tr')
    if (!price) return false
    if (!checkedR.length) {
        return layer.msg('至少选择一条数据')
    } else if(operation == '=') {
        checkedR.each((_, item) => {
            $(item).find('.smtPublish_priceCny').val(price)
            $(item).find('.smtPublish_price').val((price / smtpublish_exchangeRate).toFixed(2))
        })
    }else if(operation == '+') {
        checkedR.each((_, item) => {
            const curPriceDom =$(item).find('.smtPublish_priceCny')
            const finnalPrice = Number(curPriceDom.val()) + Number(price)
            curPriceDom.val(finnalPrice.toFixed(2))
            $(item).find('.smtPublish_price').val((finnalPrice / smtpublish_exchangeRate).toFixed(2))

        })
    }else if(operation == '-') {
        checkedR.each((_, item) => {
            const curPriceDom =$(item).find('.smtPublish_priceCny')
            const finnalPrice = Number(curPriceDom.val()) - Number(price)
            curPriceDom.val(finnalPrice.toFixed(2))
            $(item).find('.smtPublish_price').val((finnalPrice / smtpublish_exchangeRate).toFixed(2))

        })
    }else if(operation == '*') {
        checkedR.each((_, item) => {
            const curPriceDom =$(item).find('.smtPublish_priceCny')
            const finnalPrice = Number(curPriceDom.val()) * Number(price)
            curPriceDom.val(finnalPrice.toFixed(2))
            $(item).find('.smtPublish_price').val((finnalPrice / smtpublish_exchangeRate).toFixed(2))

        })
    }
}

//SKU信息 table 估算价格
function smtPublish_estimatePrice () {
    var checkedR = $('#smtPublish_listingInfo_sub_tab2').find('input[name=singlechecked]:checked').parents('tr')
    if (checkedR.length + 1 != $('#smtPublish_listingInfo_sub_tab2').find('tr').length) {
        return layer.msg('需要数据全选')
    } else {
        let storeAcctId = $('#smtPublish_editDetailForm input[name=storeAcctId]').val()
        var grossProfitRate = $('#smtPublish_editDetailForm input[name=grossProfitRate]').val()
        var discountRate = $("#smtPublish_editDetailForm input[name=discountRate]").val()
        var shippingType = $('#smtPublish_editDetailForm select[name=shippingType] option:selected').val()
        var sSkus = Array.from(checkedR.map((_, item) => $(item).find('.smtPublish_skuInfo_storeSSku').attr('attr-prodSSku'))).join(',')
        commonReturnPromise({
            url: ctx + '/aliexpress/publish/genprice.html',
            params: { grossProfitRate, discountRate, shippingType, sSkus, storeAcctId }
        }).then(data => {
            checkedR.each((_, item) => {
                data.forEach((dataItem) => {
                    if (dataItem.sSku == $(item).find('.smtPublish_skuInfo_storeSSku').attr('attr-prodSSku')) {
                        $(item).find('input[name=skuInfo_price]').val(dataItem.price)
                        $(item).find('input[name=skuInfo_priceCny]').val(dataItem.priceCny)
                        $(item).find('.smtPublish_estimateProfit').html('&yen;'+dataItem.estimateProfit)
                    }
                })
            })
        }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
    }
}

// SKU信息 table 估算区域定价
function smtPublish_regionPriceFixPrice () {
    var grossProfitRate = $('#smtPublish_editDetailForm input[name=grossProfitRate]').val()
    var discountRate = $("#smtPublish_editDetailForm input[name=discountRate]").val()
    var adjustType = $('#smtPublish_editDetailForm select[name=adjustType] option:selected').val()
    var countryList = []
    var skuList = []
    $('#smtPublish_editDetailForm').find('input[name=adjustPriceCountry]:checked').each(function () {
        countryList.push($(this).attr('data-code'))
    })
    $('#smtPublish_listingInfo_sub_tab2>tbody>tr').find('.smtPublish_skuInfo_storeSSku').each(function () {
        let trParent = $(this).parents('tr')
        let listingPrice = trParent.find('td input[name=skuInfo_price]').val() //同行的定价
        skuList.push({
            prodSSku: $(this).attr('attr-prodSSku'),
            storeSubSku: $(this).find('input[name=skuInfo_storeSSku]').val(),
            storeAcctId: Number($("#smtPublish_editDetailForm input[name=storeAcctId]").val()),
            listingPrice: listingPrice == '' ? null : Number(listingPrice),
            countryList,
        })
    })
    commonReturnPromise({
        url: ctx + '/aliexpress/publish/regionPriceFixPrice',
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        // 通过type的值，在线/刊登
        params: JSON.stringify({ grossProfitRate, discountRate, adjustType, skuList, type: 'LISTING' })
    }).then(data => {
        // 估算区域定价 回显
        $('#smtPublish_editDetailForm select[name=adjustType]').val(data[0].logisticsType)
        // tbody
        data.forEach(item => {
            $("#smtPublish_listingInfo_sub_tab2>tbody").find('.smtPublish_skuInfo_storeSSku').each(function () {
                if ($(this).find('input[name=skuInfo_storeSSku]').val() == item.storeSubSku) {
                    for (let i = 0; i < item.countryList.length; i++) {
                        $(this).parent('tr').find(`input[name=smtPublish_${item.countryList[i].countryCode}]`).val(item.countryList[i].price)
                        $(this).parent('tr').find(`input[name=smtPublish_${item.countryList[i].countryCode}_priceCny]`).val(item.countryList[i].priceCny)
                        // 没有落在范围内的需要input框黄底提醒。
                        if (!item.countryList[i].normal) {
                            $(this).parent('tr').find(`input[name=smtPublish_${item.countryList[i].countryCode}]`).parents('td').css('background', 'yellow')
                        } else {
                            $(this).parent('tr').find(`input[name=smtPublish_${item.countryList[i].countryCode}]`).parents('td').css('background', 'transparent')
                        }
                    }
                }
            })
        })
        // thead
        data[0].countryList.forEach(item => {
            $("#smtPublish_listingInfo_sub_tab2>thead").find(`th[data-code=${item.countryCode}]`).find('select[name=regionPriceFixPriceByShipType]').val(item.countryAdjustType)
        })

        layui.form.render()
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

//
function smtPublish_changeRegionPriceFixPrice (dom) {
    $(dom).parent('td').css('background', 'transparent')
}

//SKU信息 无线端描述生成PC端描述
function smtPublish_wirelessToPc () {
    $('#smtPublish_desc_modules_pc').empty()
    var dom = $('#smtPublish_desc_modules_phone').html()
    $('#smtPublish_desc_modules_pc').append(dom)
}
//信息模块的同步
function smtPublish_syncListdetailmodule () {
    var _storeAcctId = $("#smt_publish_search_form input[name=storeAcctId]").val()
    var storeAcctId = _storeAcctId && !_storeAcctId.includes(',') ? _storeAcctId : $("#smtPublish_editDetailForm input[name=storeAcctId]").val()
    commonReturnPromise({
        url: ctx + '/aliexpress/publish/listdetailmodule.html',
        params: { storeAcctId: storeAcctId, isSync: true }
    }).then(data => {
        commonRenderSelect('smtPublish_moduleId', data, { name: 'name', code: 'moduleId' })
            .then(() => { layui.form.render() })
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}
//运费模板 同步
function smtPublish_freightTpl_sync () {
    var _storeAcctId = $("#smt_publish_search_form input[name=storeAcctId]").val()
    var storeAcctId = _storeAcctId && !_storeAcctId.includes(',') ? _storeAcctId : $("#smtPublish_editDetailForm input[name=storeAcctId]").val()
    commonReturnPromise({
        url: ctx + '/aliexpress/publish/listfreighttpl.html',
        params: { storeAcctId: storeAcctId, isSync: true }
    }).then(data => {
        commonRenderSelect('smtPublish_freightTemplate', data, { name: 'templateName', code: 'templateId' })
            .then(() => { layui.form.render() })
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

//服务模板 同步
function smtPublish_serveTpl_sync () {
    var _storeAcctId = $("#smt_publish_search_form input[name=storeAcctId]").val()
    var storeAcctId = _storeAcctId && !_storeAcctId.includes(',') ? _storeAcctId : $("#smtPublish_editDetailForm input[name=storeAcctId]").val()
    commonReturnPromise({
        url: ctx + '/aliexpress/publish/listpromisetpl.html',
        params: { storeAcctId: storeAcctId, isSync: true }
    }).then(data => {
        commonRenderSelect('smtPublish_promiseTemplate', data, { name: 'templateName', code: 'templateId' })
            .then(() => { layui.form.render() })
    }).catch(err => layui.layer.msg(err))
}

//商品分组同步
function smtPublish_proGroup_sync () {
    var _storeAcctId = $("#smt_publish_search_form input[name=storeAcctId]").val()
    var storeAcctId = _storeAcctId && !_storeAcctId.includes(',') ? _storeAcctId : $("#smtPublish_editDetailForm input[name=storeAcctId]").val()
    commonReturnPromise({
        url: ctx + '/aliexpress/publish/listproductgroup.html',
        params: { storeAcctId: storeAcctId, isSync: true }
    }).then(data => {
        commonRenderSelect('smtPublish_group', data, { name: 'groupName', code: 'groupId' })
            .then(() => { layui.form.render() })
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

// 多店铺刊登的商品分组同步
function smtPublish_batch_proGroup_sync (storeAcctId) {
    commonReturnPromise({
        url: ctx + '/aliexpress/publish/listproductgroup.html',
        params: { storeAcctId: storeAcctId, isSync: true }
    }).then(data => {
        commonRenderSelect(`smtPublish_batchPublish_group_${storeAcctId}`, data, { name: 'groupName', code: 'groupId' })
            .then(() => { layui.form.render() })
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

// 多店铺刊登的欧盟责任人同步
function smtPublish_batch_msrEuId_sync(storeAcctId){
   const categoryIds = $('#smtPublish_batchPublish_msrEuId').data('categoryids')
    commonReturnPromise({
        url: ctx + `/aliexpress/category/syncEuResponsiblesByStoreAcctIdAndCategoryIds?storeAcctId=${storeAcctId}&categoryIds=${categoryIds}`,
        type:'post',
    }).then(() => {
        commonReturnPromise({
            url: ctx + '/aliexpress/category/listEuResponsiblePersonsByStoreAcctIds',
            params: JSON.stringify([storeAcctId]),
            type: 'post',
            contentType: "application/json",
        }).then(res=>{
            commonRenderSelect(`smtPublish_batchPublish_msrEuId_${storeAcctId}`, res||[], { name: 'msrEuName', code: 'msrEuId' })
            .then(() => { layui.form.render() })
        })
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

function smtPublish_desc_add_mod (obj, dom) {
    switch (obj.type) {
        case 'text':
            let title = ''
            let body = ''
            if (obj.texts && obj.texts.length) {
                obj.texts.forEach(item => {
                    item.class == 'title' ? title = item.content : ''
                    item.class == 'body' ? body = item.content : ''
                })
            }
            let textMod = `<div class="smtPulish-rowFlexClass" draggable="true"  data-type='text'>
                     <div class="smtPulish-rowFlexLeft">
                         <div>文本</div>
                         <div><i class="layui-icon red" style="font-size: 24px;" onclick="smtPublish_desc_delModule(this)">&#xe640;</i></div>
                     </div>
                     <div style="width: 70%;">
                         <div>
                             <div class="smtPulish-textFlexCloumn">
                                 <div class="smtPulish-mult-ellipsis-1 titleDom" >
                                     <span>标题：</span>
                                     <span>${title}</span>
                                 </div>
                                 <div class="smtPulish-rowFlexClass_line_content">
                                     <div class="smtPulish-textClass" style="width: 50px; flex: none;">内容：</div>
                                     <div class="smtPulish-textClass contentDom">${body}</div>
                                 </div>
                             </div>
                         </div>
                     </div>
                     <div class="smtPulish-rowFlexRight">
                         <div onclick="smtPublish_desc_editText(this)">编辑文本</div>
                         <div onclick="smtPublish_desc_addTplText(this)">模板描述</div>
                     </div>
                 </div>`
            $(dom).append(textMod)
            break;
        case 'image':
            smtPublish_desc_addImg_pc_number = smtPublish_desc_addImg_pc_number + 1
            let picMod = `<div class="smtPulish-rowFlexClass" draggable="true" data-type='image'>
                    <div class="smtPulish-rowFlexLeft">
                        <div>图片(<span class="fGrey smtPublish-rowFlexClass-imgLength">${obj.images.length || ''}</span>)</div>
                        <div><i class="layui-icon red" style="font-size: 24px;" onclick="smtPublish_desc_delModule(this)">&#xe640;</i></div>
                    </div>
                    <div style="width: 70%;">
                        <ul class="smtPulish-rowflexline uploadImgUL ui-sortable">
                            ${obj.images.map(item => `
                                <li draggable="true"
                                    style="height: 110px;border:1px solid #ccc;"
                                    class="ui-sortable-handle"
                                    data-imgsrc="${item.url}"
                                    data-targetURL="${item.targetUrl || ''}"
                                    data-width="${item.style.width || ''}"
                                    data-height="${item.style.height || ''}"
                                >
                                    <div class="ImgDivOut">
                                        <div class="ImgDivIn">
                                            <img src="${item.url}" style="height:85px;width: auto;min-width:45px"
                                                alt=""
                                                class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"
                                                onclick="smtPublish_targetUrl_jump(this)"
                                                title="双击即可复制路径" />
                                        </div>
                                        <div class="imgDivDown disflex"
                                            style="justify-content: space-around;">
                                            <a class="fl ${!!item.targetUrl ? 'fGreen' : ''}" onclick="smtPublish_targetUrl(this);"
                                                href="javascript:void(0);">
                                                <i class="layui-icon" style="font-size:14px">&#xe64c;</i>
                                            </a>
                                            <a onclick="smtPublish_delImg(this);"
                                                href="javascript:void(0);">移除</a>
                                        </div>
                                    </div>
                                </li>`).join('')
                }
                        </ul>
                    </div>
                    <div class="smtPulish-rowFlexRight">
                        <div id="smtPublish_desc_addImg_pc_${smtPublish_desc_addImg_pc_number}">本地添加</div>
                        <div onclick="smtPublish_desc_addImg_url(this)">URL添加</div>
                        <div onclick="smtPublish_desc_tplImg(this)">模板图片</div>
                    </div>
                </div>`
            $(dom).append(picMod)
            smtPublish_desc_addImg_upload(`smtPublish_desc_addImg_pc_${smtPublish_desc_addImg_pc_number}`)
            break;
        case 'text-image':
            smtPublish_desc_addImg_pc_number = smtPublish_desc_addImg_pc_number + 1
            let _title = ''
            let _body = ''
            if (obj.texts && obj.texts.length) {
                obj.texts.forEach(item => {
                    item.class == 'title' ? _title = item.content : ''
                    item.class == 'body' ? _body = item.content : ''
                })
            }
            let picTextMod = `<div class="smtPulish-rowFlexClass smtPulish-rowFlexClassText" draggable="true"  data-type='text-image'>
                        <div class="smtPulish-rowFlexLeft">
                            <div>图文(<span class="fGrey smtPublish-rowFlexClass-imgLength">${obj.images.length || ''}</span>)</div>
                            <div><i class="layui-icon red" style="font-size: 24px;" onclick="smtPublish_desc_delModule(this)">&#xe640;</i></div>
                        </div>
                        <div style="width: 70%;">
                            <div>
                                <div class="smtPulish-textFlexCloumn">
                                    <div class="smtPulish-mult-ellipsis-1 titleDom">
                                        <span> 标题：</span>
                                        <span>${_title}</span>
                                    </div>
                                    <div class="smtPulish-rowFlexClass_line_content">
                                        <div class="smtPulish-textClass" style="width: 50px; flex: none;">内容：</div>
                                        <div class="smtPulish-textClass contentDom">${_body}</div>
                                    </div>
                                </div>
                                <ul class="smtPulish-rowflexline uploadImgUL ui-sortable">
                                    ${obj.images.map(item => `
                                        <li draggable="true"
                                            style="height: 110px;border:1px solid #ccc;"
                                            class="ui-sortable-handle"
                                            data-imgsrc="${item.url}"
                                            data-targetURL="${item.targetUrl || ''}"
                                            data-width="${item.style.width || ''}"
                                            data-height="${item.style.height || ''}"
                                        >
                                            <div class="ImgDivOut">
                                                <div class="ImgDivIn">
                                                    <img src="${item.url}" style="height:85px;width: auto;min-width:45px"
                                                        alt=""
                                                        class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"
                                                        onclick="smtPublish_targetUrl_jump(this)"
                                                        title="双击即可复制路径" />
                                                </div>
                                                <div class="imgDivDown disflex"
                                                    style="justify-content: space-around;">
                                                    <a class="fl ${!!item.targetUrl ? 'fGreen' : ''}" onclick="smtPublish_targetUrl(this);"
                                                        href="javascript:void(0);">
                                                        <i class="layui-icon" style="font-size:14px">&#xe64c;</i>
                                                    </a>
                                                    <a onclick="smtPublish_delImg(this);"
                                                        href="javascript:void(0);">移除</a>
                                                </div>
                                            </div>
                                        </li>`).join()
                }
                                </ul>
                            </div>
                        </div>
                        <div class="smtPulish-rowFlexRight">
                            <div onclick="smtPublish_desc_editText(this)">编辑文本</div>
                            <div onclick="smtPublish_desc_addTplText(this)" style="margin-bottom: 30px;">模板描述</div>
                            <div id="smtPublish_desc_addImg_pc_${smtPublish_desc_addImg_pc_number}">本地添加</div>
                            <div onclick="smtPublish_desc_addImg_url(this)">URL添加</div>
                            <div onclick="smtPublish_desc_tplImg(this)">模板图片</div>
                        </div>
                    </div>`
            $(dom).append(picTextMod)
            smtPublish_desc_addImg_upload(`smtPublish_desc_addImg_pc_${smtPublish_desc_addImg_pc_number}`)
            break;
        default:
            break;
    }
}
// 预览
function smtPublish_desc_preview () {
    var deviceType = smtPublish_desc_lastDescTabVal
    var moduleDatas = {}
    var moduleList
    if (deviceType == 1) {
        var parentDomPhone = $('#smtPublish_desc_modules_phone').find('.smtPulish-rowFlexClass')
        moduleList = smtPublish_desc_preview_deal(parentDomPhone)
    } else if (deviceType == 2) {
        var parentDomPc = $('#smtPublish_desc_modules_pc').find('.smtPulish-rowFlexClass')
        moduleList = smtPublish_desc_preview_deal(parentDomPc)
    }
    moduleDatas = {
        moduleList: moduleList,
        version: "2.0.0"
    }
    //保存到缓存中
    window.localStorage['priviewSmtData'] = JSON.stringify({ deviceType, moduleDatas });
    // 打开新页面
    window.open(`${ctx}/static/smtPublishPreview.html`)
}
// 预览缓存添加数据  刊登产品详情描述保存数据
function smtPublish_desc_preview_deal (parentDom) {
    let moduleList = []
    Array.from(parentDom).forEach(item => {
        let type = $(item).attr('data-type')
        let texts = []
        let images = []
        switch (type) {
            case 'text':
                var titleHtml = $(item).find('.titleDom').find('span').last().html()
                var contentHtml = $(item).find('.contentDom').html()
                var titleText = {
                    class: "title",
                    content: titleHtml
                }
                texts.push(titleText)
                var contentText = {
                    class: 'body',
                    content: contentHtml
                }
                texts.push(contentText)
                titleHtml == '' && contentHtml == '' ? '' : moduleList.push({ type, texts })
                break;
            case 'image':
                images = Array.from($(item).find('ul').find('li')).map(elem => {
                    let width = $(elem).attr('data-width')
                    let height = $(elem).attr('data-height')
                    if (!!$(elem).attr('data-targetURL')) {
                        return {
                            url: $(elem).attr('data-imgsrc'),
                            targetUrl: $(elem).attr('data-targetURL'),
                            style: {},
                        }
                    } else {
                        return {
                            url: $(elem).attr('data-imgsrc'),
                            style: {},
                        }
                    }

                })
                images.length ? moduleList.push({ type, images }) : ""
                break;
            case 'text-image':
                var titleHtml = $(item).find('.titleDom').find('span').last().html()
                var contentHtml = $(item).find('.contentDom').html()
                var textImgObj = {
                    type
                }
                var titleText = {
                    class: "title",
                    content: titleHtml
                }
                texts.push(titleText)
                var contentText = {
                    class: 'body',
                    content: contentHtml
                }
                texts.push(contentText)
                // 没值不添加
                titleHtml == '' && contentHtml == '' ? '' : textImgObj['texts'] = texts
                images = Array.from($(item).find('ul').find('li')).map(elem => {
                    let width = $(elem).attr('data-width')
                    let height = $(elem).attr('data-height')
                    if (!!$(elem).attr('data-targetURL')) {
                        return {
                            url: $(elem).attr('data-imgsrc'),
                            targetUrl: $(elem).attr('data-targetURL'),
                            style: {}
                        }
                    } else {
                        return {
                            url: $(elem).attr('data-imgsrc'),
                            style: {}
                        }
                    }

                })
                images.length ? textImgObj['images'] = images : ""
                titleHtml == '' && contentHtml == '' && !images.length ? '' : moduleList.push(textImgObj)
                break;
            default:
                break;
        }
    })
    return moduleList
}
// 添加文本模块
function smtPublish_desc_addText () {
    let dom = ''
    smtPublish_desc_lastDescTabVal == 1 ? dom = '#smtPublish_desc_modules_phone' : dom = '#smtPublish_desc_modules_pc'
    smtPublish_desc_add_mod({ type: 'text' }, dom)
}
// 添加图片模块
function smtPublish_desc_addImg () {
    let dom = ''
    smtPublish_desc_lastDescTabVal == 1 ? dom = '#smtPublish_desc_modules_phone' : dom = '#smtPublish_desc_modules_pc'
    smtPublish_desc_add_mod({ type: 'image', images: [] }, dom)
}
// 添加文本图片模块
function smtPublish_desc_addImgText () {
    let dom = ''
    smtPublish_desc_lastDescTabVal == 1 ? dom = '#smtPublish_desc_modules_phone' : dom = '#smtPublish_desc_modules_pc'
    smtPublish_desc_add_mod({ type: 'text-image', images: [] }, dom)
}
// 删除模块
function smtPublish_desc_delModule (dom) {
    let parentDom = $(dom).parents('.smtPulish-rowFlexClass')
    parentDom.remove()

}
// 编辑文本框
function smtPublish_desc_editText (dom) {
    let parentDom = $(dom).parents('.smtPulish-rowFlexClass')
    // 标题文字
    let titleDom = parentDom.find('.titleDom').find('span').last()
    // 内容
    let contentDom = parentDom.find('.contentDom')
    var layer = layui.layer
    layer.open({
        title: '文本编辑框',
        type: 1,
        id: Date.now(),
        content: $('#smtPublish_desc_text_modal').html(),
        area: ['65%', ''],
        btn: ['保存', '关闭'],
        success: function () {
            let formInput = $('#smtPublish_desc_text_form').find('input[name=title]')
            let formTextarea = $('#smtPublish_desc_text_form').find('textarea[name=content]')
            formInput.val(titleDom.html())
            formTextarea.val(`${contentDom.html()}`)
        },
        yes: function (index, layero) {
            let formInput = $('#smtPublish_desc_text_form').find('input[name=title]')
            let formTextarea = $('#smtPublish_desc_text_form').find('textarea[name=content]')
            titleDom.html(formInput.val())
            contentDom.html(formTextarea.val())
            layer.close(index)
        },
    })
}

// 模板描述
function smtPublish_desc_addTplText(dom) {
    let parentDom = $(dom).parents(".smtPulish-rowFlexClass")
    // 内容
    let contentDom = parentDom.find(".contentDom")
    const prodPIds = Array.from($("#smtPublish_SubSkuInfo2 tr").map((_, item) => $(item).data("prodpid"))).join(",")
    layui.layer.open({
      type: 1,
      title: "模板描述",
      btn: ["确认", "取消"],
      area: ["1000px", "800px"],
      id: Date.now(),
      success: function (layero) {
        commonReturnPromise({
          url: ctx + `/prodTpl/getTemplateDesc?prodPIds=${prodPIds}`,
          type: "post",
          contentType: "application/json;charset=UTF-8",
        }).then(res => {
          layui.laytpl($("#smtPublish_tplDesc_tpl").html()).render(res, function (html) {
            $(layero).find(".layui-layer-content").html(html)
          })
          layui.form.render()
        })
      },
      yes: function (index, layero) {
        const curContent = contentDom.text()
        let tplDesc = "\r\n"
        if (curContent.endsWith("\r\n") || curContent.endsWith("\n") || curContent.endsWith("\r")) {
          tplDesc = ""
        }
        $(layero)
          .find("input[name=descTpl]:checked")
          .each(function () {
            if (tplDesc.endsWith("\r\n") || tplDesc.endsWith("\n") || tplDesc.endsWith("\r")) {
              tplDesc += $(this).data("proddesc")
            } else {
              tplDesc += "\r\n" + $(this).data("proddesc")
            }
          })
        contentDom.text(curContent + tplDesc)
        layer.close(index)
      },
    })
  }
  

// 从url添加图片
function smtPublish_desc_addImg_url (dom) {
    let parentDom = $(dom).parents('.smtPulish-rowFlexClass')
    let imgArr = $(parentDom).find('ul').find('li')
    var layer = layui.layer
    if (imgArr.length == 10) return layer.msg('请删除后添加', { icon: 5 })
    var laytpl = layui.laytpl
    layer.open({
        title: '从url添加图片',
        type: 1,
        id: Date.now(),
        offset: '20%',
        area: '65%',
        btn: ['保存', '关闭'],
        content: '<div class="p20 pl20"><textarea class="layui-textarea" id="smtPublish_desc_netImgUrl" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
        success: function (layero) {
            // let arr = new Array(10).slice(imgArr.length)
            // laytpl($("#smtPublish_desc_imgUrl_modal").html()).render(arr, function (html) {
            //     $(layero).find('.layui-layer-content').html(html)
            // })
        },
        yes: function (index, layero) {
            // let imgObj = serializeObject($("#smtPublish_desc_img_form"))
            // let imgAddArr = Object.values(imgObj).filter(item => !!item)
            // if (imgAddArr.length) {
            //     imgAddArr.forEach(item => {
            //         smtPublish_is_img_url(item, true) && smtPublish_desc_addImg_detail(parentDom, item)
            //     })
            // }
            // layer.close(index)
            const url = $.trim($("#smtPublish_desc_netImgUrl").val());
                if (url == null || url == "") {
                    layer.msg("图片地址不能为空！", {icon: 5});
                    return false;
                }
                const urlArray = url.split("\n");

                // 去一下空格
                for (var i in urlArray) {
                    urlArray[i] = $.trim(urlArray[i]);

                    var startHttp = new RegExp(
                        '^((https|http|ftp)+://){1}[^\\s]+$'
                    )
                    if (startHttp.test(urlArray[i]) != true) {
                        layer.alert("网址格式不正确！url必须以http或者https开头", {icon: 7})
                        return false;
                    }
                }
                const maxImg = 10
                let remainNum = maxImg - imgArr.length;
                if (urlArray.length + imgArr.length > maxImg) {
                    layer.msg("最大支持" + maxImg + "张图片");
                }
                remainNum = urlArray.length > remainNum ? remainNum : urlArray.length;
                if (urlArray.length) {
                    urlArray.slice(0,remainNum).forEach(item => {
                    smtPublish_is_img_url(item, true) && smtPublish_desc_addImg_detail(parentDom, item)
                })
            }
                layer.close(index);
        },
    })
}
// 本地添加
function smtPublish_desc_addImg_upload (id) {
    var upload = layui.upload,
        layer = layui.layer
    let dom = '#' + id
    var parentDom = $(`${dom}`).parents('.smtPulish-rowFlexClass')
    upload.render({
        elem: dom, //绑定元素
        url: ctx + "/smtPublishModelProduct/uploadPic.html", //上传接口
        accept: "images",
        multiple: true,
        before: function () {
            loading.show()
        },
        done: function (res) {
            //上传完毕回调
            loading.hide()
            if (parentDom.find('ul').find('li').length >= 10) {
                return layer.msg('请删除后添加', { icon: 5 })
            } else {
                if (!res.msg.includes('http')) return layer.msg(res.msg, { icon: 5 })
                smtPublish_desc_addImg_detail(parentDom, res.msg)
            }
        },
        error: function () {
            //请求异常回调
            loading.hide()
        }
    });
}

// 添加图片具体
function smtPublish_desc_addImg_detail (parentDom, src) {
    let itemDom = `
                    <li draggable="true"
                        style="height: 110px;border:1px solid #ccc;"
                        data-imgsrc="${src}"
                        data-targetURL=""
                        data-width=""
                        data-height=""
                        class="ui-sortable-handle">
                        <div class="ImgDivOut">
                            <div class="ImgDivIn">
                                <img src="${src}" style="height:85px;width: auto;min-width:45px"
                                    alt=""
                                    class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"
                                    onclick="smtPublish_targetUrl_jump(this)"
                                    title="双击即可复制路径" />
                            </div>
                            <div class="imgDivDown disflex"
                                style="justify-content: space-around;">
                                <a class="fl" onclick="smtPublish_targetUrl(this);"
                                    href="javascript:void(0);"><i class="layui-icon" style="font-size:14px">&#xe64c;</i></a>
                                <a onclick="smtPublish_delImg(this);"
                                    href="javascript:void(0);">移除</a>
                            </div>
                        </div>
                    </li>`
    $(parentDom).find('ul').append(itemDom)
    var imgLength = $(parentDom).find('li').length
    $(parentDom).find('.smtPublish-rowFlexClass-imgLength').text(imgLength)
}
// 图片跳转Url
function smtPublish_targetUrl (dom) {
    let parentDom = $(dom).parents('li')
    let targetURL = parentDom.attr('data-targetURL')
    var layer = layui.layer
    layer.open({
        title: '图片跳转URL',
        type: 1,
        id: Date.now(),
        content: $('#smtPublish_desc_targetURL').html(),
        area: ['500px', ''],
        btn: ['保存', '关闭'],
        success: function () {
            $('#smtPublish_desc_targetURL_input').val(targetURL)
        },
        yes: function (index, layero) {
            let _domVal = $('#smtPublish_desc_targetURL_input').val()
            let _targetURL = smtPublish_is_img_url(_domVal, false) ? _domVal : ''
            parentDom.attr('data-targetURL', _targetURL)
            if (_targetURL == '') {
                $(dom).css('color', '#333')
            } else {
                $(dom).css('color', 'green')
            }
            layer.close(index)
        },
    })
}
// 图片跳转url
function smtPublish_targetUrl_jump (dom) {
    var parentDom = $(dom).parents('li')
    var targetURL = parentDom.attr('data-targetURL')
    !!targetURL && window.open(targetURL)
}
// 验证地址是否有效
function smtPublish_desc_isurl (dom) {
    $(dom).val() && !smtPublish_is_img_url($(dom).val(), false) && $(dom).val('您使用的链接不可用')
}
// 验证图片地址是否有效
function smtPublish_desc_isImgurl (dom) {
    $(dom).val() && !smtPublish_is_img_url($(dom).val(), true) && $(dom).val('您使用的链接不可用')
}
function smtPublish_is_img_url (url, isImg = false) {
    var strRegex = /^\b(((https|https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
    if (isImg) {
        var isImgType = /\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(url)
        return strRegex.test(url) && isImgType ? true : false
    } else {
        return strRegex.test(url) ? true : false
    }
}
//打折
function smtPublishBulkDiscount (obj) {
    var discount = (100 - $(obj).val() || '') / 10
    $('#smtPublish_bulkDiscount').html(discount)
}

//复制失败原因
function smtPublish_copyFailReason (obj, event) {
    if (event) {
        event.stopPropagation()
        event.preventDefault()
    }
    var txt = $(obj).next('span').text();
    var oInput = document.createElement('input'); //创建一个input元素
    oInput.value = txt;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    document.body.removeChild(oInput)
    layer.msg('复制成功');
    return false;
}

//辅助函数

//商品详情弹窗的保存数据 storeAcctId：店铺id
function smtPublish_detailModalSave (storeAcctId) {
    //需要保存的值
    var publishListInfo = {
        extra: {},
        prodListingSubSkuAliexpressSmts: [],
        prodListingAliexpressSmtAttrs: [],
        qualifications: []
    };

    var _formData = $('#smtPublish_editDetailForm')

    //带刊登id，店铺id，速卖通模板id
    publishListInfo.id = subPublish_ModalDetail_Data.id
    publishListInfo.storeAcctId = storeAcctId
    publishListInfo.aliexpressTemplateId = subPublish_ModalDetail_Data.aliexpressTemplateId
    publishListInfo.type=true

    // 标题
    publishListInfo.title = _formData.find('input[name=title]').val()
    if (!publishListInfo.title) return '请输入标题'
    if (128 - publishListInfo.title.length < 0) return '标题超出字数'

    // SMT分类
    publishListInfo.smtCategoryId = _formData.find('input[name=smtCategoryName]')[0].dataset.id

    //品牌
    const brandAttr = subPublish_Category_Arr.brand[0]
    let brandName = brandAttr.required.toString() + brandAttr.attributeId.toString()
    if (brandAttr.required && !$(`#smtPublish_editDetailForm select[name=${brandName}] option:selected`).attr("attrValue")) return '请选择品牌'
    publishListInfo.prodListingAliexpressSmtAttrs.push({
        attr: $(`#smtPublish_editDetailForm select[name=${brandName}]`).attr("attr") || 'Brand Name',
        attrId: $(`#smtPublish_editDetailForm select[name=${brandName}]`).attr("attrId") || '2',
        attrValueId: $(`#smtPublish_editDetailForm select[name=${brandName}] option:selected`).val() || '',
        attrValue: $(`#smtPublish_editDetailForm select[name=${brandName}] option:selected`).attr("attrValue") || '',
    })

    //分类属性
    if (Array.isArray(subPublish_Category_Arr.attr)) {
        for (var i = 0; i < subPublish_Category_Arr.attr.length; i++) {
            let domName = `${subPublish_Category_Arr.attr[i].required}${subPublish_Category_Arr.attr[i].attributeId}`
            //下拉框
            if (subPublish_Category_Arr.attr[i].attributeShowTypeValue == 'list_box') {
                var _choosedOption = $('#smtPublish_editDetailForm select[name=' + domName + '] option:selected')
                var _choosedSelected = $('#smtPublish_editDetailForm select[name=' + domName + ']')
                if (!_choosedOption.val() && subPublish_Category_Arr.attr[i].required) return `需必选${_choosedSelected.attr("attr")}`
                if (!!_choosedOption.val() && _choosedOption.attr('enName') == 'Other') {
                    if ($('#smtPublish_editDetailForm input[name=' + domName + ']').val() == '') {
                        $('#smtPublish_editDetailForm input[name=' + domName + ']').addClass('layui-form-danger').focus();
                        setTimeout(function () {
                            $('#smtPublish_editDetailForm input[name=' + domName + ']').removeClass('layui-form-danger')
                        }, 1500);
                        return `其它需要填值`
                    }
                    publishListInfo.prodListingAliexpressSmtAttrs.push({
                        attrId: _choosedSelected.attr("attrId"),
                        attrValueId: _choosedOption.val() || '',
                        attrValue: $('#smtPublish_editDetailForm input[name=' + domName + ']').val(),
                    })
                } else if (!!_choosedOption.val() && _choosedOption.attr('enName') != 'Other') {
                    let curAttr = {
                        attr: _choosedSelected.attr("attr"),
                        attrId: _choosedSelected.attr("attrId"),
                        attrValueId: _choosedOption.val() || '',
                        attrValue: _choosedOption.attr("attrValue") || '',
                    }
                    // 如果是产地（国家或地区）选中中国大陆，存在二级属性
                    if(curAttr.attrValueId == '9441741844'){
                        let provinceText = $(`#smtPublish_editDetailForm select[attrid=266081643] :selected`).text()
                        let provinceName = $(`#smtPublish_editDetailForm select[attrid=266081643]`).attr('name')||''
                        curAttr.provinceAttributeInfo={
                            "attrId": '266081643',
                            "attr": $(`#smtPublish_editDetailForm select[attrid=266081643]`).attr("attr"),
                            "attrValueId":$(`#smtPublish_editDetailForm select[attrid=266081643] :selected`).val(),
                            "attrValue": provinceText == "请选择" ? "" : provinceText
                        }
                        if(provinceName.includes('true') && curAttr.provinceAttributeInfo.attrValueId =='' ){
                            return `需必选${$(`#smtPublish_editDetailForm select[attrid=266081643]`).attr("attr")}`
                        }
                    }
                    publishListInfo.prodListingAliexpressSmtAttrs.push(curAttr)
                }
            }
            //checkbox
            if (subPublish_Category_Arr.attr[i].attributeShowTypeValue == 'check_box') {
                var _choosedCheckbox = $('#smtPublish_editDetailForm input[name=' + domName + ']:checked')
                var _choosedCheckboxLabel = $('#smtPublish_editDetailForm input[name=' + domName + ']').attr("attr")
                if (!_choosedCheckbox.val() && subPublish_Category_Arr.attr[i].required) return `需必选${_choosedCheckboxLabel}`
                let otherPick = Array.from(_choosedCheckbox).filter(item => $(item).attr('enName') == 'Other')
                if (otherPick.length && $(otherPick[0]).nextAll(`input[name=${domName}]`).val() == '') {
                    $(otherPick[0]).nextAll(`input[name=${domName}]`).addClass('layui-form-danger').focus();
                    setTimeout(function () {
                        $(otherPick[0]).nextAll(`input[name=${domName}]`).removeClass('layui-form-danger')
                    }, 1500);
                    return '其它需要填值'
                }
                Array.from(_choosedCheckbox).forEach(item => {
                    if (!!$(item).val() && $(item).attr('enName') == 'Other') {
                        publishListInfo.prodListingAliexpressSmtAttrs.push({
                            attrId: $(item).attr("attrId"),
                            attrValueId: $(item).val() || '',
                            attrValue: $(item).nextAll(`input[name=${domName}]`).val(),
                        })
                    } else if (!!$(item).val() && $(item).attr('enName') != 'Other') {
                        publishListInfo.prodListingAliexpressSmtAttrs.push({
                            attr: $(item).attr("attr"),
                            attrId: $(item).attr("attrId"),
                            attrValueId: $(item).val() || '',
                            attrValue: $(item).attr("attrValue") || '',
                        })
                    }
                })
            }
            //input
            if (subPublish_Category_Arr.attr[i].attributeShowTypeValue == 'input') {
                var _inputDom = $('#smtPublish_editDetailForm input[name=' + domName + ']')
                if (!_inputDom.val() && subPublish_Category_Arr.attr[i].required) return `需必选${_inputDom.attr("attr")}`
                !!_inputDom.val() ? publishListInfo.prodListingAliexpressSmtAttrs.push({
                    attr: _inputDom.attr("attr"),
                    attrId: _inputDom.attr("attrId"),
                    attrValue: _inputDom.val() || '',
                }) : ''
            }
            //输入区间
            if (subPublish_Category_Arr.attr[i].attributeShowTypeValue == 'interval') {
                var _intervalFirst = $('#smtPublish_editDetailForm input[name=' + domName + '0]')
                var _intervalSec = $('#smtPublish_editDetailForm input[name=' + domName + '1]')
                if ((!_intervalFirst.val() || !_intervalSec.val()) && subPublish_Category_Arr.attr[i].required) return `需必选${_intervalFirst.attr('attr')}`
                !!_intervalFirst.val() ? publishListInfo.prodListingAliexpressSmtAttrs.push({
                    attr: _intervalFirst.attr('attr'),
                    attrId: _intervalFirst.attr("attrId"),
                    attrValue: _intervalFirst.val() || '',
                }) : ''
                !!_intervalSec.val() ? publishListInfo.prodListingAliexpressSmtAttrs.push({
                    attr: _intervalSec.attr('attr'),
                    attrId: _intervalSec.attr("attrId"),
                    attrValue: _intervalSec.val() || '',
                }) : ''
            }
        }
    }

    //自定义属性值
    var _customProperty = $("#smtPublish_listDetailTpl_addproper").find('.detailItem').map((_, item) => ({
        attr: $(item).find('input[name=property]').val(),
        attrValue: $(item).find('input[name=propertyVal]').val()
    }))
    //去重 自定义属性值的属性名不能一致
    var _customPropertyList = Array.from(_customProperty)
    var newCustomPropertyList = _customPropertyList.reduce((pre, cur) => {
        if (pre.filter(item => item.attr == cur.attr).length == 0) {
            return pre.concat(cur)
        } else {
            return pre
        }
    }, [])
    if (newCustomPropertyList.length != _customPropertyList.length) return '不支持多个自定义属性名相同'
    const CustomAttrValSeventy = _customPropertyList.filter(item=>item.attrValue && (item.attrValue.length>70))
    if(CustomAttrValSeventy.length) return '自定义属性值长度不超过为70个字符'
    const CustomAttrSeventy = _customPropertyList.filter(item=>item.attr && (item.attr.length>70))
    if(CustomAttrSeventy.length) return '自定义属性名称长度不超过为70个字符'
    _customPropertyList.forEach(item => { (item.attr || item.attrValue) ? publishListInfo.prodListingAliexpressSmtAttrs.push(item) : '' })


    // 商品图片
    var _mainImages = []
    $("#smtPublish_mainImages").find('.ImgDivIn img').map((i, item) => {
        _mainImages.push($(item).prop('src'))
    })
    if (!_mainImages.length) return '需上传主图'
    publishListInfo.mainImages = _mainImages.join(',')
    publishListInfo.market1Images = $("#smtPublish_market1Images").find('.ImgDivIn img').prop('src') || ''
    publishListInfo.market2Images = $("#smtPublish_market2Images").find('.ImgDivIn img').prop('src') || ''

    // 商品视频
    publishListInfo.videoFileUrl = ''
    _formData.find('input[name=checkedVideo]').each(function(){
        if($(this).prop('checked')){
            publishListInfo.videoFileUrl = $(this).val()
        }
    })

    // 营销图
    if(!publishListInfo.market1Images || !publishListInfo.market2Images){
        return '需上传营销图'
    }

    //发货地 区域定价
    var _deliveryPlace = {}
    $("#smtPublish_placePrice_table").find('tbody tr').map((_, item) => {
        _deliveryPlace[$(item).attr('data-name')] = $(item).find('select[name=' + $(item).attr('data-name') + ']').val()
    })
    publishListInfo.deliveryPlace = Object.keys(_deliveryPlace).join(',')

    // 是否设置区域定价
    publishListInfo.adjustPriceStatus = !!_formData.find('input[name=setAreaPrice]').prop('checked') ? 1 : 0

    if (publishListInfo.adjustPriceStatus === 1) {
        // 调价方式
        publishListInfo.adjustPriceType = _formData.find('select[name=adjustPriceType]').val()
        //调价方式为3直接报价所选国家
        if (publishListInfo.adjustPriceType == 3) {
            var adjustPriceCountry = []
            let checkedAdjustPriceCountry = $('#smtPublish_editDetailForm').find('input[name=adjustPriceCountry]:checked')
            if (checkedAdjustPriceCountry.length == 0) return '请选择区域'
            checkedAdjustPriceCountry.each(function () {
                let countryCode = $(this).attr('data-code')
                let obj = {
                    country: countryCode,
                    type: $('#smtPublish_listingInfo_sub_tab2>thead>tr').find(`th[data-code=${countryCode}]`).find('select[name=regionPriceFixPriceByShipType]').val(),
                }
                adjustPriceCountry.push(obj)
            })
            publishListInfo.adjustPriceCountry = adjustPriceCountry.length ? JSON.stringify(adjustPriceCountry.map(item => item.country)) : ''
            publishListInfo.configurationData = ''
        } else {
            if (!_formData.find('select[name=adjustPriceType]').val()) return '请选择调价方式'
            // 百分比调整   金额调整
            var _configurationData = {}
            for (let k in _deliveryPlace) {
                if (_deliveryPlace[k]) {
                    _configurationData[k] = _deliveryPlace[k]
                } else {
                    return '请选择调价模板'
                }
            }
            if (JSON.stringify(_configurationData) != "{}") {
                publishListInfo.configurationData = JSON.stringify(_configurationData)
            } else {
                publishListInfo.configurationData = ''
            }
            publishListInfo.adjustPriceCountry
        }
    } else {
        // 如果选择了调价方式，就需要勾选；或者将调价方式为空
        if (!!_formData.find('select[name=adjustPriceType]').val()) {
            return '如需设置区域定价，请勾选区域调价；如不需，请不要选择定价方式'
        } else {
            publishListInfo.adjustPriceCountry = ''
            publishListInfo.configurationData = ''
        }
    }

    // SKU信息
    let skuInputStr = ''
    var _aliexpressListingSkuDtos = $('#smtPublish_listingInfo_sub_tab2').find('tbody tr').map((_, item) => {
        let basicObj = {
            storeSSku:  $(item).find('input[name=skuInfo_storeSSku]').val(),
            stock: $(item).find('input[name=skuInfo_stock]').val(),
            prodSSku: ($(item).find('.smtPublish_skuInfo_storeSSku').attr('attr-prodSSku')||'').split('*')[0],
            price: Number($(item).find('input[name=skuInfo_price]').val()),
            priceCny: Number($(item).find('input[name=skuInfo_priceCny]').val()),
            deliveryPlace: $(item).find('#smtPublish_skuInfo_deliveryPlace').html(),
            prodPId:$(item).data('prodpid')
        }
        let adjustPriceData
        if (adjustPriceCountry && adjustPriceCountry.length) {
            adjustPriceData = []
            adjustPriceCountry.forEach(elem => {
                let obj = {
                    type: elem.type,
                    code: $(item).find(`input[name=smtPublish_${elem.country}]`).attr('data-code'),
                    sort: $(item).find(`input[name=smtPublish_${elem.country}]`).attr('data-sort'),
                    price: $(item).find(`input[name=smtPublish_${elem.country}]`).val(),
                    priceCny: $(item).find(`input[name=smtPublish_${elem.country}_priceCny]`).val(),
                    name: $(item).find(`input[name=smtPublish_${elem.country}]`).attr('data-name'),
                }
                adjustPriceData.push(obj)
            })

        } else {
            adjustPriceData = ''
        }

        // 变种属性
        let askuImgDom = $(item).find('select[name=imgAttr]')
        let skuAttr = {}
        if(askuImgDom.length){
            skuAttr.imgCustomValue= $(item).find('input[name=imgAttrName]').val()
            skuAttr.imgAttrId= askuImgDom.data('attrid')
            skuAttr.imgAttrName= askuImgDom.data('attrname')
            skuAttr.imgOaAttrName= askuImgDom.data('oaname')
            skuAttr.imgAttrValue = askuImgDom.find('option:selected').text()
            skuAttr.imgAttrValueId= askuImgDom.val()
            if(skuAttr.imgAttrValueId===''){
                skuInputStr = `请选择${askuImgDom.data('attrname')}`
            }
            if($(item).find('input[name=imgAttrName]').val().split('').length>20){
                skuInputStr = '变种属性值不能超过20个字符'
            }
            // if($(item).find('input[name=imgAttrName]').val()===''){
            //     skuInputStr = `请输入${askuImgDom.data('attrname')}的属性值`
            // }
        }
        let attr2Dom =$(item).find('select[name=attr2]')
        if(attr2Dom.length){
            skuAttr.attr2CustomValue = $(item).find('input[name=attr2Name]').val(),
            skuAttr.attr2Id = attr2Dom.data('attrid')
            skuAttr.attr2Name = attr2Dom.data('attrname')
            skuAttr.attr2OaAttrName= attr2Dom.data('oaname')
            skuAttr.attr2Value = attr2Dom.find('option:selected').text()
            skuAttr.attr2ValueId = attr2Dom.val()
            if(skuAttr.attr2ValueId===''){
                skuInputStr = `请选择${attr2Dom.data('attrname')}`
            }
            if($(item).find('input[name=attr2Name]').val().split('').length>20){
                skuInputStr = '变种属性值不能超过20个字符'
            }
            // if($(item).find('input[name=attr2Name]').val()===''){
            //     skuInputStr = `请输入${attr2Dom.data('attrname')}的属性值`
            // }
        }
        let attr1Dom =$(item).find('select[name=attr1]')
        if(attr1Dom.length){
            skuAttr.attr1CustomValue = $(item).find('input[name=attr1Name]').val(),
            skuAttr.attr1Id = attr1Dom.data('attrid')
            skuAttr.attr1Name = attr1Dom.data('attrname')
            skuAttr.attr1OaAttrName= attr1Dom.data('oaname')
            skuAttr.attr1Value = attr1Dom.find('option:selected').text()
            skuAttr.attr1ValueId = attr1Dom.val()
            if(skuAttr.attr1ValueId===''){
                skuInputStr = `请选择${attr1Dom.data('attrname')}`
            }
            if($(item).find('input[name=attr1Name]').val().split('').length>20){
                skuInputStr = '变种属性值不能超过20个字符'
            }
            // if($(item).find('input[name=attr1Name]').val()===''){
            //     skuInputStr = `请输入${attr1Dom.data('attrname')}的属性值`
            // }
        }
        let attr3Dom =$(item).find('select[name=attr3]')
        if(attr3Dom.length){
            skuAttr.attr3CustomValue =  $(item).find('input[name=attr3Name]').val()
            skuAttr.attr3Id = attr3Dom.data('attrid')
            skuAttr.attr3Name= attr3Dom.data('attrname')
            skuAttr.attr3OaAttrName= attr3Dom.data('oaname')
            skuAttr.attr3Value= attr3Dom.find('option:selected').text()
            skuAttr.attr3ValueId= attr3Dom.val()
            if(skuAttr.attr3ValueId===''){
                skuInputStr = `请选择${attr3Dom.data('attrname')}`
            }
            if($(item).find('input[name=attr3Name]').val().split('').length>20){
                skuInputStr = '变种属性值不能超过20个字符'
            }
            // if($(item).find('input[name=attr3Name]').val()===''){
            //     skuInputStr = `请输入${attr3Dom.data('attrname')}的属性值`
            // }
        }
        // 图片
        let skuImage =$(item).find('.attrimage img').prop('src')
        skuImage = skuImage==='/lms/static/img/kong.png' ? '' : skuImage
        return ({ ...basicObj,skuImage, ...skuAttr,adjustPriceData: !!adjustPriceData ? JSON.stringify(adjustPriceData) : adjustPriceData })
    })
    if(skuInputStr!=='') return skuInputStr
    // 校验平台销售属性枚举值重复问题
    const skuAttrValList=Array.from(_aliexpressListingSkuDtos).map(item=>{
        const imgAttrValueIdStr = item.imgAttrValueId ? item.imgAttrValueId.toString() :' '
        const attr1ValueIdStr = item.attr1ValueId ? item.attr1ValueId.toString() :' '
        const attr2ValueIdStr = item.attr2ValueId ? item.attr2ValueId.toString() :' '
        const attr3ValueIdStr = item.attr3ValueId ? item.attr3ValueId.toString() :' '
      return imgAttrValueIdStr + attr1ValueIdStr + attr2ValueIdStr + attr3ValueIdStr
    })
    if(skuAttrValList.length !==[...new Set(skuAttrValList)].length) return '平台销售属性重复，不允许刊登'
    // 校验自定义平台销售属性值重复问题
    const skuCustomStrValList=Array.from(_aliexpressListingSkuDtos).map(item=>{
        let imgCustomValueStr = ' '
        if(item.imgCustomValue || item.imgAttrValueId){
            imgCustomValueStr = item.imgCustomValue || item.imgAttrValueId.toString()
        }
        let attr1CustomValueStr = ' '
        if(item.attr1CustomValue || item.attr1ValueId){
            attr1CustomValueStr = item.attr1CustomValue || item.attr1ValueId.toString()
        }
        let attr2CustomValueStr = ' '
        if(item.attr2CustomValue || item.attr2ValueId){
            attr2CustomValueStr = item.attr2CustomValue || item.attr2ValueId.toString()
        }
        let attr3CustomValueStr = ' '
        if(item.attr3CustomValue || item.attr3ValueId){
            attr3CustomValueStr = item.attr3CustomValue || item.attr3ValueId.toString()
        }
      return imgCustomValueStr + attr1CustomValueStr + attr2CustomValueStr + attr3CustomValueStr
    })
    if(skuCustomStrValList.length !==[...new Set(skuCustomStrValList)].length) return '自定义平台销售属性值重复，不允许刊登'
    
    publishListInfo.aliexpressListingSkuDtos = Array.from(_aliexpressListingSkuDtos).map(item => ({ ...item, deliveryPlace: item.deliveryPlace || 'NONE' }))
    if (publishListInfo.aliexpressListingSkuDtos.filter(item => item.stock === '').length) return '需填写库存'
    if (publishListInfo.aliexpressListingSkuDtos.filter(item => item.price === '').length) return '需填写刊登价'

    // // 校验
    // // 1.图片属性的下拉框的值相同，但图片属性的oa值不同，提示不保存
    // let skuInfoTips = ''
    // let skuImgAttrUni = {}
    // publishListInfo.aliexpressListingSkuDtos.forEach(item=>{
    //     if(skuImgAttrUni[item.imgAttrValueId]===undefined){
    //         skuImgAttrUni[item.imgAttrValueId] = item.imgCustomValue
    //     }else if(skuImgAttrUni[item.imgAttrValueId]!= item.imgCustomValue){
    //         skuInfoTips = `存在图片平台属性值部分相同，但oa值不同,请修改,${item.imgAttrValueId},${item.imgCustomValue}`
    //     }
    // })
    // if(skuInfoTips!=='') return skuInfoTips
    // // 2.图片属性的下拉框的值相同的，，平台属性2的下拉框不应该存在相同的
    // if(publishListInfo.aliexpressListingSkuDtos[0].attr1Id){
    //     let attr1Tips = {}
    //     let attr1TipsStr = ''
    //     publishListInfo.aliexpressListingSkuDtos.forEach(item=>{
    //         if(attr1Tips[item.imgAttrValueId]===undefined){
    //             attr1Tips[item.imgAttrValueId] = [item.attr1ValueId]
    //         }else {
    //             attr1Tips[item.imgAttrValueId].push(item.attr1ValueId)
    //         }
    //     })
    //     Object.values(attr1Tips).forEach(item=>{
    //         if(item.length!==[...new Set(item)].length){
    //             attr1TipsStr = `${publishListInfo.aliexpressListingSkuDtos[0].attr1Name}部分平台属性值重复,请重新选择`
    //         }
    //     })
    //     if(attr1TipsStr!=='') return attr1TipsStr
    // }
    // if(publishListInfo.aliexpressListingSkuDtos[0].attr2Id){
    //     let attr2Tips = {}
    //     let attr2TipsStr = ''
    //     publishListInfo.aliexpressListingSkuDtos.forEach(item=>{
    //         if(attr2Tips[item.imgAttrValueId]===undefined){
    //             attr2Tips[item.imgAttrValueId] = [item.attr2ValueId]
    //         }else {
    //             attr2Tips[item.imgAttrValueId].push(item.attr2ValueId)
    //         }
    //     })
    //     Object.values(attr2Tips).forEach(item=>{
    //         if(item.length!==[...new Set(item)].length){
    //             attr2TipsStr = `${publishListInfo.aliexpressListingSkuDtos[0].attr2Name}部分平台属性值重复,请重新选择`
    //         }
    //     })
    //     if(attr2TipsStr!=='') return attr2TipsStr
    // }
    // if(publishListInfo.aliexpressListingSkuDtos[0].attr3Id){
    //     let attr3Tips = {}
    //     let attr3TipsStr = ''
    //     publishListInfo.aliexpressListingSkuDtos.forEach(item=>{
    //         if(attr3Tips[item.imgAttrValueId]===undefined){
    //             attr3Tips[item.imgAttrValueId] = [item.attr3ValueId]
    //         }else {
    //             attr3Tips[item.imgAttrValueId].push(item.attr3ValueId)
    //         }
    //     })
    //     Object.values(attr3Tips).forEach(item=>{
    //         if(item.length!==[...new Set(item)].length){
    //             attr3TipsStr = `${publishListInfo.aliexpressListingSkuDtos[0].attr3Name}部分平台属性值重复,请重新选择`
    //         }
    //     })
    //     if(attr3TipsStr!=='') return attr3TipsStr
    // }

    //
    publishListInfo.prodListingSubSkuAliexpressSmts = subPublish_ModalDetail_Data.prodListingSubSkuAliexpressSmts

    // 半托管信息(勾选了半托管)
    if(isJoin === 'true' || isJoin === true){
        // 校验所有必填项是否都填写
        const resultKey = [
            'storeSSku',
            'originalBox',
            'packageWeight',
            'packageLength',
            'packageWidth',
            'packageHeight',
            'oldSpecialProductTypeList',
            'basePriceUsd',
            'basePriceCny',
            'sellableQuantity'
          ];
         
          let msg = ''
          publishListInfo.subHalfManageExtraList = []
          $('#smtPublish_AESubSkuInfo2 tr').each(function(index) {
            const _obj ={}
            resultKey.forEach((key) => {
                const dynamicKey = key === 'storeSSku' ? 'aeStoreSSku' : key;
                const res = $(this).find(`[name=${dynamicKey}]`).val()
                if(key === 'oldSpecialProductTypeList'){
                    const val = layui.formSelects.value(`isDisabledSpecialProType_${index}`, 'val');
                    _obj.specialProductTypeList = val[0] == 'general' ? [] : val;
                    if(!val.length){
                        msg = '半托管列表必填项请填写完整！';
                    }
                }else{

                    if(!res){
                        msg = '半托管列表必填项请填写完整！';
                      }
                    _obj[key] = res
                }
                  _obj.halfManangeStoreAcctId = $(this).data('storeaccid')
                  _obj.prodSSku = $(this).data('prodssku')
                  _obj.prodSId = $(this).data('prodsid')
                  // 非必填 货品条码
                  _obj.scItemBarCode = $(this).find('input[name=scItemBarCode]').val()
                })
                publishListInfo.subHalfManageExtraList.push(_obj)
          })
          if(msg){
            return msg
          }
    }

    //产品详情描述
    //  手机端
    var parentDomPhone = $('#smtPublish_desc_modules_phone').find('.smtPulish-rowFlexClass')
    publishListInfo.mobileDesc = JSON.stringify({
        version: "2.0.0",
        moduleList: smtPublish_desc_preview_deal(parentDomPhone)
    })
    //    pc端
    var parentDomPc = $('#smtPublish_desc_modules_pc').find('.smtPulish-rowFlexClass')
    var parentDomPcContent = smtPublish_desc_preview_deal(parentDomPc)
    //信息模块
    var _position = $("#smtPublish_desc_pc_info").find('select[name=position]').val()
    var _moduleId = $("#smtPublish_desc_pc_info").find('select[name=moduleId]').val()
    if (parentDomPcContent.length == 0) return '需填写电脑版的产品详情描述'
    if (!!_moduleId) {
        _position == 'top' && parentDomPcContent.unshift({
            type: 'dynamic',
            reference: {
                type: 'relation',
                moduleId: Number(_moduleId),

            }
        })
        _position == 'bottom' && parentDomPcContent.push({
            type: 'dynamic',
            reference: {
                type: 'relation',
                moduleId: Number(_moduleId),
            }
        })
    }
    publishListInfo.pcDesc = JSON.stringify({
        version: "2.0.0",
        moduleList: parentDomPcContent
    })

    // 欧盟责任人和商品资质
    publishListInfo.msrEuId = $('#smtPublish_editDetailForm_qualificationInfo').find('select[name=msrEuId]').val()
    const qualificationDom= $('#smtPublish_qualificationInfoView')
    let qualificationTips =''
    subPublish_ModalDetail_Data.qualificationList.forEach(v=>{
        let value = ''
        const {qualificationType, qualificationKey} = v
        if(qualificationType ==='image'){
           value = qualificationDom.find(`input[name=${qualificationKey}]`).parent().find('img').attr('src')
           if(value.includes('/static/img/kong.png')){
            value = ''
           }
        }else if(qualificationType === 'text'){
            value = qualificationDom.find(`input[name=${qualificationKey}]`).val()
        }

        if(value){
            publishListInfo.qualifications.push({qualificationValue:value, qualificationType, qualificationKey})
        }else if(!value && v.required){
            const tipsObj={
                image: `请上传${v.country}-${v.qualificationName}-${v.label}的图片`,
                text: `请输入${v.country}-${v.qualificationName}-${v.label}的值`
            }
            qualificationTips = tipsObj[v.type]
        }
    })
    if(qualificationTips) {
        return qualificationTips
    }


    //其他信息
    if (!_formData.find('select[name=productUnit]').val()) return '需要选择计量单位'
    if (_formData.find('input[name=packageType]').prop('checked') && !_formData.find('input[name=lotNum]').val()) return '需要填写销售方式的数量'
    if (_formData.find('input[name=isBulk]').prop('checked') && !_formData.find('input[name=bulkOrder]').val()) return '需要填写起批量'
    if (_formData.find('input[name=isBulk]').prop('checked') && !_formData.find('input[name=bulkDiscount]').val()) return '需要填写减免值'
    if (_formData.find('input[name=isPackSell]').prop('checked') && !_formData.find('input[name=baseUnit]').val()) return '需要填写买家购买多少件以内'
    if (_formData.find('input[name=isPackSell]').prop('checked') && !_formData.find('input[name=addUnit]').val()) return '需要填写买家每多购买多少件'
    if (_formData.find('input[name=isPackSell]').prop('checked') && !_formData.find('input[name=addWeight]').val()) return '需要填写重量增加数'
    if (!_formData.find('input[name=deliveryTime]').val()) return '请填写发货期'
    if (!_formData.find('input[name=grossWeight]').val()) return '请填写包装后重量'
    if (!_formData.find('input[name=packageLength]').val()) return '请填写包装后的尺寸的长度'
    if (!_formData.find('input[name=packageWidth]').val()) return '请填写包装后的尺寸的宽度'
    if (!_formData.find('input[name=packageHeight]').val()) return '请填写包装后的尺寸的高度'
    // if (!_formData.find('input[name=reduceStrategy]').val()) return '请选择库存扣减'
    if (!_formData.find('select[name=freightTemplateId]').val()) return '需要选择运费模板'
    if (!_formData.find('select[name=promiseTemplateId]').val()) return '需要选择服务模板'
    // if (!_formData.find('select[name=groupId]').val()) return '需要选择商品分组'

    publishListInfo.extra = {
        // productDetailModule: JSON.stringify({ moduleId: _moduleId, position: _position }), //信息模块 和呈现位置
        productUnit: _formData.find('select[name=productUnit]').val(),
        lotNum: _formData.find('input[name=lotNum]').val(),
        packageType: _formData.find('input[name=packageType]').prop('checked'),
        isBulk: _formData.find('input[name=isBulk]').prop('checked'),
        bulkOrder: _formData.find('input[name=bulkOrder]').val(),
        bulkDiscount: _formData.find('input[name=bulkDiscount]').val(),
        deliveryTime: _formData.find('input[name=deliveryTime]').val(),
        grossWeight: _formData.find('input[name=grossWeight]').val(),
        isPackSell: _formData.find('input[name=isPackSell]').prop('checked'),
        baseUnit: _formData.find('input[name=baseUnit]').val(),
        addUnit: _formData.find('input[name=addUnit]').val(),
        addWeight: _formData.find('input[name=addWeight]').val(),
        packageLength: _formData.find('input[name=packageLength]').val(),
        packageWidth: _formData.find('input[name=packageWidth]').val(),
        packageHeight: _formData.find('input[name=packageHeight]').val(),
        reduceStrategy: _formData.find('input[name=reduceStrategy]:checked').val(),
        freightTemplateId: _formData.find('select[name=freightTemplateId]').val(),
        promiseTemplateId: _formData.find('select[name=promiseTemplateId]').val(),
        groupId: _formData.find('select[name=groupId]').val(),
    }

    console.log('publishListInfo :>> ', publishListInfo);
    return publishListInfo
}

//单个刊登弹窗的立即刊登
function smtPublish_saveAndListingAjax (params) {
    return commonReturnPromise({
        url: ctx + '/aliexpress/publish/saveAndListing',
        type: 'post',
        contentType: "application/json",
        params: JSON.stringify(params),
    })
}

//批量刊登弹窗的立即刊登和保存  接口
function smtPublish_batchSaveAndListing (url, params, index) {
    let batchNo;
    if(url === 'batchSaveAndListing') {
        batchNo = new Date().getTime()
        params.batchNo = batchNo
        params.isContinueListing = 0
    }
    layui.admin.load.show()
    $.ajax({
        type: "post",
        url: ctx + `/aliexpress/publish/${url}`,
        data: JSON.stringify(params),
        contentType: 'application/json',
        dataType: 'json',
        success: function (returnData) {
            layui.admin.load.hide()
            // 成功删除，失败不删除
            let tableId = 'smt_publish_tpl_table'; // 模板页签的表格
            if (returnData.code == "0000") {
                if(url === 'batchSaveAndListing'){
                    smtPublish_tortBrand(batchNo,function(){
                        layui.layer.msg('操作成功', { icon: 1 })
                        layer.closeAll()
                    },4000)
                }else{
                    layui.layer.msg('操作成功', { icon: 1 })
                    layui.layer.close(index);
                }
                params.templateIdList.forEach(item => {
                    $("#"+tableId).next().find(".id" + item).closest("tr").remove();
                })
                layui.table.cache[tableId].forEach((item, index) => {
                    if (params.templateIdList.indexOf(item.modelPId) > -1) {
                        layui.table.cache[tableId][index] = []
                    }
                })
            } else if (returnData.code == "8888") {
                layui.layer.close(index);
                // modelPId&pSku
                let successRes = returnData.data.map(item => item.key.split(":")[1]);
                let successPSkuList = params.pSkuList.filter(item => !successRes.includes(item))
                successPSkuList.forEach(item => {
                    $("#"+tableId).next().find(".sku" + item).closest("tr").remove();
                })
                layui.table.cache[tableId].forEach((item, index) => {
                    if (successPSkuList.indexOf(item.pSku) > -1) {
                        layui.table.cache[tableId][index] = []
                    }
                })
                layui.layer.open({
                    title: returnData.msg,
                    id: Date.now(),
                    content: '',
                    area: ["500px", "400px"],
                    success: function (failLayero, failIndex) {
                        layui.laytpl($("#smtPublish_batchPublish_fail_reason").html()).render(returnData.data, function (html) {
                            $(failLayero).find('.layui-layer-content').html(html)
                        })
                    },
                    yes: function () {
                        layui.layer.closeAll()
                    }
                })
            } else if(returnData.code == "7777"){
                layui.layer.close(index);
                // continueRepeatGenerate 是否继续重复生成,是:重复生成(正常生成),否:只生成子sku多的模板
                layui.layer.open({
                    title: '重复刊登',
                    id: Date.now(),
                    content: returnData.msg,
                    btn: [ "重复生成", "只生成子SKU多的模板"],
                    area: ["500px", "400px"],
                    yes: function () {
                        layui.layer.closeAll()
                        smtPublish_batchSaveAndListing(url, {...params,continueRepeatGenerate:true}, index)
                    },
                    btn2:function(){
                        layui.layer.closeAll()
                        smtPublish_batchSaveAndListing(url, {...params,continueRepeatGenerate:false}, index)
                    }
                })
            } else {
                layui.layer.msg(returnData.msg, { icon: 2 });
            }
        },
        error: function (err) {
            layui.admin.load.hide()
            layui.layer.msg(err, { icon: 2 });
        }
    });
}

//批量设置暂不刊登
function smtPublish_batchUnlistingTemp () {
    var checkedRows = layui.table.checkStatus('smt_publish_tpl_table')
    if (!checkedRows.data.length) return layer.msg('至少选择一条数据')
    layui.layer.open({
        type: 1,
        title: '批量设置暂不刊登',
        area: ["400px", "520px"],
        btn: ["确定", "取消"],
        id: Date.now(),
        content: $('#smtPublish_batchUnlistingTemp_layout').html(),
        success: function (index, layero) {
            //当前登录人授权的店铺
            commonReturnPromise({
                url: ctx + '/sys/listuserstore.html?platCode=aliexpress',
                type: 'post'
            }).then(res => {
                commonRenderSelect('smtPublish_batchUnlistingTemp_store', res, { name: 'storeAcct', code: 'id' })
            }).then(() => {
                layui.formSelects.render('smtPublish_batchUnlistingTemp_store');
                let storeAcctIdList = layui.formSelects.value('smtPublish_storeAcct_sel', 'val');
                layui.formSelects.value('smtPublish_batchUnlistingTemp_store', storeAcctIdList || []);
                layui.form.render('radio', "smtPublish_batchUnlistingTemp_Form")
            })
        },
        yes: smtPublish_debounce(function (index, layero) {
            let params = serializeObject($('[lay-filter="smtPublish_batchUnlistingTemp_Form"]'))
            let idList = checkedRows.data.map(item => item.modelPId)
            if(!params.bacthStoreAcct){
                return layer.msg("请选择店铺")
            }
            commonReturnPromise({
                url: ctx + '/aliexpresslisting/setUnlistingTemp',
                type: 'post',
                contentType: "application/json",
                params: JSON.stringify({
                    idList,
                    storeAcctIdList: params.bacthStoreAcct.split(","),
                    unlistingTemp: params.unlistingTemp
                })
            }).then(res => {
                layer.msg(res, {icon: 1})
                $("#smt_publish_search_submit").click()
                layer.close(index)
            })
        }, 1000, true)
    })
}

//批量生成 模板列表才可以批量生成
function smtPublish_batchPublish () {
    var checkedRows = layui.table.checkStatus('smt_publish_tpl_table')
    if (!checkedRows.data.length) return layer.msg('至少选择一条数据')
    layui.layer.open({
        type: 1,
        title: '多店铺刊登',
        area: ["900px", "620px"],
        btn: ["立即刊登", "批量生成", "取消"],
        shade: 0,
        id: Date.now(),
        content: $('#smtPublish_batchPublish_layout').html(),
        success: function (index, layero) {
            commonReturnPromise({
                url: ctx + '/sys/listStoreForRenderHpStoreCommonComponent.html',
                type: 'post',
                params: {
                    roleNames: 'smt专员',
                    orgId: '',
                    salePersonId: '',
                    platCode: 'aliexpress',
                }
            }).then(res => {
                commonRenderSelect('smtPublish_batchPublish_store', res, { name: 'storeAcct', code: 'id' })
            }).then(() => {
                layui.formSelects.render('smtPublish_batchPublish_store');
                let storeAcctId = $("#smt_publish_search_form input[name=storeAcctId]").val()
                // 赋值类目
                const cateIds = checkedRows.data.map(v=>v.cateId).join()
                $('#smtPublish_batchPublish_msrEuId').data('categoryids',cateIds)
                if (!!storeAcctId) {
                    layui.formSelects.value('smtPublish_batchPublish_store', storeAcctId.split(','));
                    smtPublish_renderBatchPublishTpl(storeAcctId.split(','))
                }

            }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
        },
        end: function () {
            layui.formSelects.value('smtPublish_batchPublish_store', []);
        },
        yes: smtPublish_debounce(function (index, layero) {
            let params = smtPublish_batchSaveAndListingParams(checkedRows)
            if (Object.prototype.toString.call(params) === '[object Object]') {
                smtPublish_batchSaveAndListing('batchSaveAndListing', params, index)
            } else {
                return layui.layer.msg(params)
            }
        }, 1000, true),
        btn2: smtPublish_debounce(function (index, layero) {
            let params = smtPublish_batchSaveAndListingParams(checkedRows)
            if (Object.prototype.toString.call(params) === '[object Object]') {
                smtPublish_batchSaveAndListing('batchSavePublishInfo.html', params, index)
            } else {
                layui.layer.msg(params)
            }
        }, 1000, true),
    })
} 

// 查询修改人和修改时间
function smtPublish_searchPreserveCategoryInfo() {
    commonReturnPromise({
        url: ctx + '/aliexpress/category/getModifierMetaData',
        type: 'get',
    }).then(res => {
        let modifyTime = Format(res.modifyTime, 'yyyy-MM-dd hh:mm:ss')
        $("#smtPublish_preserveLongtimeCategory_form").find('.modifyTime').text( modifyTime || '') 
        $("#smtPublish_preserveLongtimeCategory_form").find('.modifier').text(res.modifier || '')
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

// 查询维护长发货期类目弹窗默认值
function smtPublish_searchPreserveCategory() {
    commonReturnPromise({
        url: ctx + '/aliexpress/category/getDeliveryDaysConfig',
        type: 'get',
    }).then(res => {
        $("#smtPublish_preserveLongtimeCategory_form").find('select[name=deliveryDays]').val(res && res.cValue || '8')
    }).then(() => {
        layui.form.render('select')
        smtPublish_searchPreserveCategoryInfo()
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}


// 更新类目刊登时发货期默认值
function smtPublish_updatePreserveCategory(val) {
    commonReturnPromise({
        url: ctx + `/aliexpress/category/setDeliveryDays?deliveryDays=${val}`,
        type: 'get',
    }).then((res) => {
        layui.layer.msg(res || '操作成功！')
        smtPublish_searchPreserveCategoryInfo()
    })
    .catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

// 维护长发货期类目弹窗
function smtPublish_publish_preserveCategory() {
    layui.layer.open({
        type: 1,
        title: '维护长发货期类目',
        area: ["580px", "420px"],
        btn: "关闭",
        shade: 0,
        id: Date.now(),
        content: $('#smtPublish_preserveLongtimeCategory_layout').html(),
        success: function (index, layero) {
            layui.form.render('select')
            smtPublish_searchPreserveCategory()
            $(document).on("change", "#smtPublish_uploadImgFile", function (e) {
                let _this = e.target;
                var files = _this.files;
                if (!files || !files.length) return;
                var file = files[0];
                var formData = new FormData();
                formData.append('file', file);
            
                $.ajax({
                    type: "post",
                    url: ctx + "/aliexpress/category/importLongDeliveryPeriodCate",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (data) {
                        loading.hide();
                        if (data.code == '0000') {
                            let tableData = []
                            if(Object.keys(data.data)){
                                tableData = [data.data]
                            }
                            // 更新表格数据
                            smt_publish_selectUploadFile_table(tableData)
                            // 更新修改人修改时间
                            smtPublish_searchPreserveCategoryInfo()
                        } else {
                            layer.msg(data.msg)
                        }
                    }
                });
            })
        }
        
    })
}

// 导出当前类目
function smtPublish_exportPreserveCategory() {
    transBlob({
        url: ctx + "/aliexpress/category/exportAll",
        formData: '',
        fileName: '',
        contentType: 'application/json'
    }).then(function (result) {
        loading.hide();
        layer.alert("导出成功",{icon:1})
    }).catch(function (err) {
        layer.msg(err, {icon: 2});
    });
}

// 渲染上传结果表格
function smt_publish_selectUploadFile_table(data){
    layui.table.render({
        elem: "#smt_publish_selectUploadFile_table",
        id: "smt_publish_selectUploadFile_table",
        data: data,
        limit: 1,
        page:false,
        cols: [
            [
            { field: "fileName", title: "文件名"},
            { field: "fileSize", title: "大小", templet: "<div>{{d.fileSize || ''}}kb</div>"},
            { field: "resultDesc", title: "上传结果"}
            ],
        ],
    });
}

function smtPublish_renderBatchPublishTpl(params){
    Promise.all([
        commonReturnPromise({
            url: ctx + '/aliexpress/publish/getProductGroups.html',
            params: JSON.stringify(params),
            type: 'post',
            contentType: "application/json",
        }),
        commonReturnPromise({
            url: ctx + '/aliexpress/category/listEuResponsiblePersonsByStoreAcctIds',
            params: JSON.stringify(params),
            type: 'post',
            contentType: "application/json",
        })
    ]).then(res=>{
        if (!Array.isArray(res[0])) { res[0] = [] }
        layui.laytpl($("#smtPublish_batchPublish_goodsGroup_Tpl").html()).render(res[0], function (html) {
            $('#smtPublish_batchPublish_goodsGroup').html(html)
        })
        if (!Array.isArray(res[1])) { res[1] = [] }
         // 获取选中数据的storeAcctId，storeAcct
         const checkedStoreList = layui.formSelects.value('smtPublish_batchPublish_store');
         const msrEuIdListObj = {}
         res[1].forEach(v=>{
            msrEuIdListObj[v.storeAcctId] =(msrEuIdListObj[v.storeAcctId] ||[]).concat(v)
         })
         checkedStoreList.forEach(v=>{
          v.msrEuIdList = msrEuIdListObj[v.val]||[]
         })
        layui.laytpl($("#smtPublish_batchPublish_msrEuId_Tpl").html()).render(checkedStoreList, function (html) {
            $('#smtPublish_batchPublish_msrEuId').html(html)
        })
    }).then(() => {
        layui.form.render()
    }).catch(res => layer.msg(res || res.message, { icon: 2 }))
}


//对类目数据处理，必填，不必填，
function smtPublish_renderCategory (data, checkedData) {
    if (Array.isArray(data) && data.length > 0) {
        var _data = data.map(item => {
            var _item = checkedData.filter(checkItem => checkItem.attrId && checkItem.attrId == item.attributeId)
            return { ...item, checkedValue: _item }
        })  //把选中的值塞到对应的
        var requiredDoms = "";
        var notRequiredDoms = "";
        var requiredData = _data.filter(item => item.required)
        var notReqiuredData = _data.filter(item => !item.required)
        for (let i = 0; i < requiredData.length; i++) {
            requiredDoms += smtPublish_renderAttributeList(requiredData[i])
        }
        for (let i = 0; i < notReqiuredData.length; i++) {
            notRequiredDoms += smtPublish_renderAttributeList(notReqiuredData[i])
        }
        $("#smtPulish_cag_prop").append(requiredDoms)  //类目  必填
        if (!notReqiuredData.length && !_data.filter(chooseItem => chooseItem.attributeId == '2').length) {
            $("#smtPulish_cag_prop_more_label").remove()
        }
        $("#smtPulish_cag_prop_more").append(notRequiredDoms)//类目 可以折叠的属性 不必填
        layui.form.render()
    }
}
//生产刊登的类目属性渲染
function smtPublish_renderAttributeList (obj) {
    var propertyDom = ""
    var isrequired = obj.required ? `<font color="red">*</font>` : ""
    // 下拉框
    if (obj.attributeShowTypeValue == 'list_box') {
        var optionItems = smtPublish_changeOptionToString(obj.categoryAttributeValuesSmts, obj.checkedValue)
        // 当选项中有其它选项时,且选中的时候，后面添加input
        let otherInput = obj.checkedValue.length && obj.checkedValue[0].attrValueId == 4
            ? `<div class="layui-col-md2  smtPublish-sel-other-input">
                <input class="layui-input" name="${obj.required}${obj.attributeId}"
                    value="${obj.checkedValue[0].attrValue}"
                    placeholder="当选择其它选项时，需要填此项"
                />
            </div>` : ''
        var _isBrandBtn = obj.attributeNameZn == '品牌' ? `<div class="layui-col-md3">
        <button class="layui-btn layui-btn-sm" style="margin-left: 20px;" type="button" onClick="smtPublish_sync_brand(${obj.required})">同步</button>
    </div>`: ''
        propertyDom = `<div class="layui-form-item">
        <label class="layui-form-label w120">${isrequired}${obj.attributeNameZn}(${obj.attributeNameEn}):</label>
        <div class="layui-input-block">
            <div class="layui-col-md6 smtPublish-select-block">
               <select name='${obj.required}${obj.attributeId}' attr='${obj.attributeNameZn}'attrId='${obj.attributeId}'
                id="" required='${obj.required}' lay-filter="smtPublish_selOtheb_input">${optionItems}</select>
            </div>
            ${otherInput}
            ${_isBrandBtn}
       </div>
    </div>`
    // 产地选择中国大陆 展示省份
    if(obj.checkedValue[0] && obj.checkedValue[0].attrId=='219'){
        // 找出省份下拉枚举值
        let provinceObj = obj.categoryAttributeValuesSmts.filter(item=>item.categoryAttributeValueId=='9441741844')[0].msgCategoryAttributeSmt
        if(provinceObj){
            let provinceOptionList = '<option value="">请选择</option>'
            let checkedProviceAttrValueId = ''
            if(obj.checkedValue[0].provinceAttributeInfo){
                checkedProviceAttrValueId = obj.checkedValue[0].provinceAttributeInfo.attrValueId
            }
            provinceObj.categoryAttributeValuesSmts.forEach(function (seacondAttrVal) {
                provinceOptionList += `<option value="${seacondAttrVal.categoryAttributeValueId}" ${checkedProviceAttrValueId==seacondAttrVal.categoryAttributeValueId ? 'selected':''}>${seacondAttrVal.valueNameZn}(${seacondAttrVal.valueNameEn})</option>`;
            })
            propertyDom += `<div class="layui-form-item ${obj.checkedValue[0].attrValueId=='9441741844'?'':'hidden'}">
                <label class="layui-form-label w120 ${provinceObj.required?'redStar':''}">${provinceObj.attributeNameZn}(${provinceObj.attributeNameEn}):</label>
                <div class="layui-input-block">
                    <div class="layui-col-md6 smtPublish-select-block">
                       <select name='${provinceObj.required}${provinceObj.attributeId}' attr='${provinceObj.attributeNameZn}'attrId='${provinceObj.attributeId}'
                        id="" required='${provinceObj.required}' lay-filter="smtPublish_selOtheb_input">${provinceOptionList}</select>
                    </div>
               </div>
            </div>`
            }
        }
    }
    //品牌
    if (obj.attributeShowTypeValue == 'brand') {
        var optionItems = smtPublish_changeOptionToString(obj.categoryAttributeValuesSmts, obj.checkedValue)
        var isBrandBtn = `<div class="layui-col-md3">
        <button class="layui-btn layui-btn-sm" style="margin-left: 20px;" type="button" onClick="smtPublish_sync_brand(${obj.required})">同步</button>
    </div>`
        propertyDom = `<div class="layui-form-item">
        <label class="layui-form-label w120">${isrequired}${obj.attributeNameZn}(${obj.attributeNameEn}):</label>
        <div class="layui-input-block">
            <div class="layui-col-md6">
               <select name=${obj.required}${obj.attributeId} attr=${obj.attributeNameZn}
                    attrId=${obj.attributeId} id="" required=${obj.required}
               >${optionItems}</select>
            </div>
            ${isBrandBtn}
       </div>
    </div>`
    }
    // 输入框
    if (obj.attributeShowTypeValue == 'input') {
        var dataListItems = smtPublish_changeOptionDatalist(obj) || ''
        propertyDom = `<div class="layui-form-item">
        <label class="layui-form-label w120">${isrequired}${obj.attributeNameZn}(${obj.attributeNameEn}):</label>
        <div class="layui-input-block">
            <div class="layui-col-md6">
               <input class="layui-input" name='${obj.required}${obj.attributeId}' list='${obj.required}${obj.attributeId}' attrId='${obj.attributeId}' required='${obj.required}' attr='${obj.attributeNameZn}'  value='${obj.checkedValue[0] ? obj.checkedValue[0].attrValue : ""}'>
               ${dataListItems}
            </div>
       </div>
    </div>`
    }
    //多选checkbox
    if (obj.attributeShowTypeValue == 'check_box') {
        var checkboxItems = smtPublish_changeCheckboxToString(obj, obj.checkedValue, 'smtPublish_checkOtheb_input')
        propertyDom = `<div class="layui-form-item">
        <label class="layui-form-label w120">${isrequired}${obj.attributeNameZn}(${obj.attributeNameEn}):</label>
        <div class="layui-input-block">
        <div class="smtPulish_listDetailTpl_container" >${checkboxItems}</div>
       </div>
    </div>`
    }
    // 区间，展示俩个输入框
    if (obj.attributeShowTypeValue == 'interval') {
        propertyDom = `<div class="layui-form-item">
        <label class="layui-form-label w120">${isrequired}${obj.attributeNameZn}(${obj.attributeNameEn}):</label>
        <div class="layui-input-block">
            <div class="layui-col-md2 layui-col-lg2">
                <input autocomplete="off" name="${obj.required}${obj.attributeId + '0'}"
                    attrId='${obj.checkedValue[0] ? obj.checkedValue[0].attrId : obj.attributeId}' attr='${obj.checkedValue[0] ? obj.checkedValue[0].attr : obj.attributeNameZn}'
                    required='${obj.required}' class="layui-input" value='${obj.checkedValue[0] ? obj.checkedValue[0].attrValue : ""}'
                >
            </div>
            <div class="layui-col-md2 layui-col-lg2">
                <input autocomplete="off" name='${obj.required}${obj.attributeId + '1'}'
                    attrId='${obj.checkedValue[1] ? obj.checkedValue[1].attrId : obj.attributeId}' attr='${obj.checkedValue[1] ? obj.checkedValue[1].attr : obj.attributeNameZn}'
                    required='${obj.required}' class="layui-input" value='${obj.checkedValue[1] ? obj.checkedValue[1].attrValue : ""}'
                >
            </div>
       </div>
    </div>`
    }

    return propertyDom
}

//下拉框单选 datalist
function smtPublish_changeOptionDatalist (obj) {
    if (obj.categoryAttributeValuesSmts && Array.isArray(obj.categoryAttributeValuesSmts) && obj.categoryAttributeValuesSmts.length) {
        var arr = '<option value="">请选择</option>'
        for (let i = 0; i < obj.categoryAttributeValuesSmts.length; i++) {
            arr += `<option value='${obj.categoryAttributeValuesSmts[i].valueNameZn}(${obj.categoryAttributeValuesSmts[i].valueNameEn})'></option>`
        }
        return `<datalist id="${obj.required}${obj.attributeId}">${arr}</datalist>`
    }
}

//下拉框单选
function smtPublish_changeOptionToString (obj, checkedData) {
    var arr = '<option value="">请选择</option>'
    if (Array.isArray(obj) && obj.length) {
        for (let i = 0; i < obj.length; i++) {
            if (obj.valueNameEn == 'Other') {
                arr += `<option value='${obj[i].categoryAttributeValueId}' attrValue='${obj[i].valueNameZn}'
                            enName='${obj[i].valueNameEn}'
                            ${checkedData.filter(item => item.attrValueId == obj[i].categoryAttributeValueId || !item.attr).length ? 'selected' : ''}
                        >${obj[i].valueNameZn}(${obj[i].valueNameEn})</option>`
            } else {
                arr += `<option value='${obj[i].categoryAttributeValueId}' attrValue='${obj[i].valueNameZn}'
                            enName='${obj[i].valueNameEn}'
                            ${checkedData.filter(item => item.attrValueId == obj[i].categoryAttributeValueId || !item.attr).length ? 'selected' : ''}
                        >${obj[i].valueNameZn}(${obj[i].valueNameEn})</option>`
            }
        }
    }
    return arr
}

//checkbox 单个渲染 obj:要渲染的数据 checkData：选中的数据  filter：给发货地添加lay-filter，方便进行与sku信息表和发红地调价模板进行联动
function smtPublish_changeCheckboxToString (obj, checkedData = [], filter = '') {
    var arr = ''
    var { categoryAttributeValuesSmts } = obj
    if (Array.isArray(categoryAttributeValuesSmts) && categoryAttributeValuesSmts.length) {
        for (let i = 0; i < categoryAttributeValuesSmts.length; i++) {
            let checkedItem = smtPublish_dealCheckboxChecked(checkedData, categoryAttributeValuesSmts[i])
            let otherInput = checkedItem.length && checkedItem[0].attrValueId == 4 ?
                `<input class="layui-input smtPublish-checkbox-other-input mr10" name="${obj.required}${obj.attributeId}"
                    value='${checkedItem[0].attrValue}'
                    placeholder="当选择其它选项时，需要填此项"
                />` : ''
            arr += `<div class="smtPublish_mentalProperty_checkbox disFCenter">
            <input type="checkbox" title='${categoryAttributeValuesSmts[i].valueNameZn}(${categoryAttributeValuesSmts[i].valueNameEn})' lay-filter='${filter}'
            data-name='${categoryAttributeValuesSmts[i].valueNameZn}' name='${obj.required}${obj.attributeId}' lay-skin="primary"
            ${checkedItem.length ? 'checked' : ''}
            value='${categoryAttributeValuesSmts[i].categoryAttributeValueId}' attr='${obj.attributeNameZn}'
             attrId='${obj.attributeId}' attrValue='${categoryAttributeValuesSmts[i].valueNameZn}'
             enName='${categoryAttributeValuesSmts[i].valueNameEn}'
             >
             ${otherInput}
            </div>`
        }
    }
    return arr
}

//checkbox 处理是否选中
function smtPublish_dealCheckboxChecked (arr, obj) {
    var _checkedData = []
    if (Array.isArray(arr) && arr.length) {
        _checkedData = arr.filter(item => (item.attrValueId == obj.categoryAttributeValueId) || (item == obj.valueNameZn))
    }
    return _checkedData
}

//#region sku信息  价格联动
function smtPublish_skuInfo_blur_price(dom){
    const price = $(dom).val()
    const priceCny = (price * smtpublish_exchangeRate).toFixed(2)
    $(dom).parents('tr').find(`input[name='skuInfo_priceCny']`).val(priceCny)
}
function smtPublish_skuInfo_blur_priceCny(dom){
    const priceCny = $(dom).val()
    const price = (priceCny / smtpublish_exchangeRate).toFixed(2)
    $(dom).parents('tr').find(`input[name='skuInfo_price']`).val(price)
}
function smtPublish_skuInfo_blur_area_price(dom){
    const price = $(dom).val()
    const curCountry = $(dom).data('code')
    const priceCny = (price * smtpublish_exchangeRate).toFixed(2)
    $(dom).parents('td').find(`input[name='smtPublish_${curCountry}_priceCny']`).val(priceCny)
}
function smtPublish_skuInfo_blur_area_priceCny(dom){
    const priceCny = $(dom).val()
    const curCountry = $(dom).data('code')
    const price = (priceCny / smtpublish_exchangeRate).toFixed(2)
    $(dom).parents('td').find(`input[name='smtPublish_${curCountry}']`).val(price)
}
 //#endregion  sku信息  价格联动


// 本地图片上传
// imgContains  图片容器 jQuery对象
function smtPublish_uploadLocalImg (imgContains, isProportion = false, ssize = true) {
    var btn = imgContains.find('.uploadLocalImgBtn') // 触发异步上传的按钮
    var maxImg = parseInt(imgContains.attr('data-maxImg')) // 最大图片数
    var minImg = parseInt(imgContains.attr('data-minImg')) // 最小图片数
    var imgObjType = imgContains.attr('data-imgObjType') // 图片展示的dom数据类型

    btn.Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 2048, //默认单位是KB
        buttonText: '本地图片',
        formData: isProportion ? { width: ssize ? '800' : '750', height: ssize ? '800' : '1000' } : {},
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/publish/smt/uploadPic.html",
        onSelect: function (files) {
            var imgTotalNum = imgContains.next().find('li').length
            var n = files.length + imgTotalNum;
            if (n > maxImg) {
                layer.msg("最大支持" + maxImg + "张图片，您还能选择" + (maxImg - imgTotalNum) + "张!");
                return false;
            } else {
                return true;
            }
        },
        onUploadStart: function (file) { },
        onUploadSuccess: function (file, data, response) {
            data = $.parseJSON(data);
            if (data != null && data.code == '0000') {
                smtPublish_appendImgDom(data.msg, imgContains, ssize, maxImg)
            } else {
                layer.msg(data.msg); //这里面的内容不知道写啥,同OA系统
            }
        }
    });
}

// 网络图片下载
// imgContains  图片容器jQuery对象
function smtPublish_uploadNetImg (imgContains, isProportion = false, ssize = true) {
    imgContains.find('.smtPublish_subImg_UL').sortable({
        containment: "parent",
        scroll: true,
        delay: 100,
        start: function () {
            prohibitShowBigImg = true
            $('.showBigImg').remove();
        },
        stop: function () {
            prohibitShowBigImg = false
        }
    });
    var netUpBtn = imgContains.find('.uploadNetImgBtn') // 网络图片开启按钮
    var maxImg = imgContains.attr('data-maxImg') // 最大图片数
    var minImg = imgContains.attr('data-minImg') // 最小图片数
    var imgObjType = imgContains.attr('data-imgObjType') // 图片展示的dom数据类型
    netUpBtn.click(function () {
        var currentImgs = imgContains.find('.smtPublish_subImg_UL li') // 原有图片模型
        if (currentImgs.length == maxImg) {
            layer.msg('已达最大上传数量')
            return
        }
        var index = layer.open({
            type: 1,
            title: '主图网络图片',
            area: ['800px', '300px'],
            id: 'mainNetImgSuccess',
            id: Date.now(),
            content: '<div class="p20 pl20"><textarea class="layui-textarea" id="netImgUrl" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
            btn: ['确定', '关闭'],
            yes: function () {
                var url = $.trim($("#netImgUrl").val());
                if (url == null || url == "") {
                    layer.msg("图片地址不能为空！", { icon: 5 });
                    return false;
                }
                var urlArray = url.split("\n");
                // 去一下空格
                for (var i in urlArray) {
                    urlArray[i] = $.trim(urlArray[i]);//非本地图片做校验,(本地图片后台替换域名)
                    //图片需要校验
                    //需要以http开头
                    var startHttp = new RegExp(
                        '^((https|http|ftp)+://){1}[^\\s]+$'
                    );
                    if (startHttp.test(urlArray[i]) != true) {
                        layer.msg("网址格式不正确！url必须以http或https开头", { icon: 7 });
                        return false;
                    } else {
                    }
                }
                var remainNum = maxImg - currentImgs.length;
                if (urlArray.length + currentImgs.length > maxImg) {
                    remainNum = remainNum < 0 ? 0 : remainNum;
                    layer.msg("最大支持" + maxImg + "张图片,您还能上传" + remainNum + "张!");
                }
                remainNum = urlArray.length > remainNum ? remainNum : urlArray.length;
                for (var i = 0; i < remainNum; i++) {
                    smtPublish_appendImgDom(urlArray[i], imgContains, ssize, maxImg)
                }
                layer.close(index);
            }
        })
    });
}

//商品图片的添加
function smtPublish_appendImgDom (src, selector, ssize = true, maxImg = 2) {
    if (maxImg == 2) {
        var imgDom = smtPublish_markImgDOM({ src, ssize });
        if (selector.next().find('img').length) {
            selector.next().find('img').prop('src', src)
        } else {
            selector.next().append(imgDom)
        }
    } else {
        var mainImgDom = `<li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
        <div class="ImgDivOut">
            <div class="ImgDivIn">
                 <img src=${src} style="height:150px; width: 150px"  alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"  title="双击即可复制路径"/>
            </div>
            <div class="imgDivDown">
                <div class="disflex" style="justify-content: space-around;">
                    <a class="fl" onclick="smtPublish_copyImg(this);" href="javascript:void(0);">
                        复制
                    </a>
                    <a onclick="smtPublish_delImg(this);" href="javascript:void(0);">
                        移除
                    </a>
                </div>
                <div class="disflex" style="justify-content: space-around;">
                    <a class="fl" onclick="smtPublish_setWhiteBgMap(this);" href="javascript:void(0);">
                        设为白底图
                    </a>
                    <a class="fl" onclick="smtPublish_setSceneGraph(this);" href="javascript:void(0);">
                        设为场景图
                    </a>
                </div>
            </div>
        </div>
    </li>`
        selector.next().append(mainImgDom)
    }
    imageLazyload()
}

//构建富文本
var smtPublish_autoSimditor = function (id, data, all = false) {
    var editor = new Simditor({
        textarea: $('#' + id),
        cleanPaste: true, //复制过来的默认清除所有自带样式
        toolbar: all ? true : ['bold', 'italic', 'image'] //只允许显示加粗和斜体和图片
    });
    editor.setValue(data || ''); //设置富文本的值
    return editor
};
// })(jQuery, layui, window, document);

/**
 * 函数防抖---最后一个人说了算
 * 抖动结束以后执行?
 * @param fn --执行的函数
 * @param wait --延迟时间
 * @param isImmediate --是否立即执行
 */
function smtPublish_debounce (fn, wait, isImmediate = false) {
    var timer = null;
    var flag = true;
    return function () {
        var context = this;
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        if (isImmediate) {
            if (flag) {
                fn.apply(context, args)
                flag = false
            }
            timer = setTimeout(function () {
                flag = true
            }, wait)
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args)
            }, wait)
        }
        return false
    }
}

// 判断是否是json数据
function smtPublish_isJSON (jsonStr) {
    if (typeof jsonStr === 'string') {
        try {
            var obj = JSON.parse(jsonStr)
            if (typeof obj == 'object' && obj) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }
    console.log('it is not a string')
}

function smtPublish_changeType (s) {
    let reg = /<\/?.+?\/?>/g;
    console.log(1111, s.replace(reg, '\n'))
    mainContent = s;
    //如果有多个table使用下面注释的正则只会匹配成一个table
    //var tabReg = /<table[^>]*>((?!table).)*<\/table>/gi;
    //匹配单个table
    var tabReg = /<table[^>]*>\s*(<tbody[^>]*>)?(\s*<tr[^>]*>[\s\S]*?<\/tr>\s*)*(<\/tbody>)?\s*<\/table>/gi;
    var tabMatch = tabReg.test(s);

    var tabMatchContentArray = s.match(tabReg);

    if (tabMatch) {

        mainContent = s.replace(tabReg, "#");
    }

    //对img标签进行匹配
    var imgReg = /<img.*?(?:>|\/>)/gi;

    imgMatchContentArray = s.match(imgReg);

    if (imgReg.test(s)) {
        //将img标签替换为*
        mainContent = mainContent.replace(imgReg, "*");
    }
    //处理html标签
    mainContent = mainContent.replace(/&nbsp;/gi, " ");
    var pReg1 = /<p>/gi;
    var pReg2 = /<\/p>/gi;
    mainContent = mainContent.replace(pReg1, "").replace(pReg2, "\n");
    console.log('mainContent :>> ', mainContent);
    //下面的htmlReg1 ，htmlReg2可以匹配任意标签
    //     var htmlReg1 =/<[^>]+>/gi;
    //     var htmlReg2 =/<(.+?)[\s]*\/?[\s]*>/gi;
    //
    //     mainContent = mainContent.replace(htmlReg1,"").replace(htmlReg2,"");
    //mainContent = mainContent.replace(/&/gi,"<p>").replace(/@/gi,"</p>");
}

// sku 特殊字符替换为-
function smtPublish_attrInputBlur(e){
    let str = e.target.value.replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/g,'-')
    e.target.value = str
    getAeHalfManageSkuPro()
}

// 设置白底图
function smtPublish_setWhiteBgMap(btn) {
    const li = $(btn).closest("li");
    let src = "";
    if (li.find("img").attr("src")) {
      src = li.find("img").attr("src");
    }
    // 白底图，到营销图的1:1白底图里
    var imgDom = smtPublish_markImgDOM({ src, ssize: true });
    $("#smtPublish_market1Images").html(imgDom);
  }
  // 设置场景图：需要系统抠图，将左右各裁剪125像素后， 放入3:4场景图
  function smtPublish_setSceneGraph(btn,imgUrl) {
    const li = $(btn).closest("li");
    let url = "";
    if (li.find("img").attr("src")) {
      url = li.find("img").attr("src");
    }
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    let image = new Image();
    if(imgUrl){
        image.src = imgUrl;
    }else{
        image.src = url;
    }
    image.setAttribute("crossOrigin", "Anonymous");
    image.onload = function (e) {
      const realWidth = this.width;
      const realHeight = this.height;
      if(realWidth/realHeight == 3/4){
        return;
      }
      canvas.width = realWidth - 250;
      canvas.height = realHeight;
      // // 在 canvas 上绘制原始图片，并缩放到目标尺寸
      // 将左右各裁剪125像素后， 放入3:4场景图。
  
      ctx.drawImage(
        image,
        125,
        0,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      // 将 canvas 转换为新的图片文件
      const newImageURL = canvas.toDataURL("image/jpeg");
  
      // 将图片base64转换为图片链接
      let reg =
        /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
      if (reg.test(newImageURL)) {
        $.ajax({
          type: "POST",
          url: "/lms/preProdDev/getBase64Img.html",
          data: { AreaImgKey: newImageURL },
          async: false,
          success: function (res) {
            const div = smtPublish_markImgDOM({ src: res, ssize: false });
            $("#smtPublish_market2Images").html(div);
          },
          error: function (err) {
            console.log("err :>> ", err);
          },
        });
      } else {
        const div = smtPublish_markImgDOM({ src: newImageURL, ssize: false });
        $("#smtPublish_market2Images").html(div);
      }
    };
  }
  
  function smtPublish_markImgDOM(obj) {
    const { src, ssize } = obj;
    var imgDom = `<li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
      <div class="ImgDivOut">
          <div class="ImgDivIn">
               <img src=${src} style="height:${
      ssize ? "150px" : "200px"
    };width: 150px"  alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"  title="双击即可复制路径"/>
          </div>
          <div class="imgDivDown disflex" style="justify-content:space-around">
          ${
            ssize
              ? '<div class="smtPublish_subImg_imgTop">1:1</div>'
              : '<div class="smtPublish_subImg_imgTop">3:4</div>'
          }
          ${
            ssize
              ? '<a class="fl" onclick="smtPublish_mattingImg(this);" href="javascript:void(0);">抠图</a>'
              : '<a class="fl" onclick="smtPublish_copyImg(this);" href="javascript:void(0);">复制</a>'
          }
              <a onclick="smtPublish_delImg(this);" href="javascript:void(0);">移除</a>
          </div>
      </div>
  </li>`;
    return imgDom;
  }

// 半托管店铺子sku blur 商品列表
function smtPublish_aeHalfInfo_storeSSkuBlur(event){
    const newStoreSSku = $(event).val();
    const curProdSSku = $(event).parents("tr").data('prodssku')

    $('#smtPublish_SubSkuInfo2 tr').each(function(){
        // 店铺子SKU 和半托管双向联动
        const prodSSku = $(this).data('prodssku')
        if(curProdSSku === prodSSku){
            $(this).find('input[name=skuInfo_storeSSku]').val(newStoreSSku)
        }
      })
}

//   支持修改商品子SKU
function smtPublish_skuInfo_storeSSkuBlur(event) {
    // 通过调取估算价格的接口，来获取价格相关的数据
    var trDomList = $("#smtPublish_listingInfo_sub_tab2 tbody").find("tr");
    const formDom = $("#smtPublish_editDetailForm");
    let storeAcctId = formDom.find('input[name=storeAcctId]').val()
    var grossProfitRate = formDom.find("input[name=grossProfitRate]").val();
    var discountRate = formDom.find("input[name=discountRate]").val();
    var shippingType = formDom
      .find("select[name=shippingType] option:selected")
      .val();
    var sSkus = Array.from(
      trDomList.map((_, item) =>$(item).find('input[name=skuInfo_storeSSku]').val().split("/")[0]
      )
    ).join(",");
    let sSkusObj = {};
    commonReturnPromise({
      url: ctx + "/aliexpress/publish/genprice.html",
      params: { grossProfitRate, discountRate, shippingType, sSkus, storeAcctId },
    })
      .then((data) => {
        data.forEach((dataItem) => {
          sSkusObj[dataItem.sSku] = dataItem;
        });
        const newStoreSSku = $(event).val();
        const originStoreSSku = $(event).data("origin");
        const storeAcctId = Number(subPublish_ModalDetail_Data.storeAcctId);
        commonReturnPromise({
          url: "/lms/aliexpress/publish/getSkuInfo",
          type: "post",
          params: { newStoreSSku, storeAcctId, originStoreSSku },
        })
          .then((res) => {
            // 更新相关数据
            // $(event).data('last', newStoreSSku)
            $(event).attr("value", newStoreSSku);
            $(event).attr("data-last", newStoreSSku);
            const curProdSSku = newStoreSSku.split("/")[0];
            $(event).parent().attr("attr-prodSSku", curProdSSku);
            // $(event).parents('tr').data('prodssku', curProdSSku)
            $(event).parents("tr").attr("data-prodssku", curProdSSku);
            // 更新当前行的重量/成本/刊登价/预估利润
            const trDom = $(event).parents("tr");
            trDom.find(".skuInfo_weight").text(res.weight);
            trDom.find(".skuInfo_cost").text(res.cost);
            const cursSkuPriceInfo = sSkusObj[newStoreSSku.split('/')[0]]
            if(cursSkuPriceInfo){
                trDom.find("input[name=skuInfo_price]").val(cursSkuPriceInfo.price);
                trDom.find("input[name=skuInfo_priceCny]").val(cursSkuPriceInfo.priceCny);
                if (cursSkuPriceInfo.estimateProfit === null || cursSkuPriceInfo.estimateProfit === undefined) {
                  trDom.find(".smtPublish_estimateProfit").text("");
                } else {
                  trDom
                    .find(".smtPublish_estimateProfit")
                    .html("&yen;" + cursSkuPriceInfo.estimateProfit);
                }
            }
            // 将列表店铺子sku变动映射到半托管表格sku编码
            $('#smtPublish_AESubSkuInfo2 tr').each(function(){
                const prodSSku = $(this).data('prodssku')
                if(prodSSku === curProdSSku){
                    $(this).find('.aeStoreSSku').val(newStoreSSku)
                }
            })
          })
          .catch((err) => {
            const lastStoreSku = $(event).data("last");
            $(event).attr("value", lastStoreSku);
            $(event).val(lastStoreSku);
            layer.msg(err, { icon: 2 });
          });
      })
      .catch((err) => {
        const lastStoreSku = $(event).data("last");
        $(event).attr("value", lastStoreSku);
        $(event).val(lastStoreSku);
        layui.layer.msg(err || err.message, { icon: 2 });
      });
  }

//   同步欧盟责任人
function smtPublish_EUResponsiblePerson_sync(dom){
    var _storeAcctId = $("#smt_publish_search_form input[name=storeAcctId]").val()
    var storeAcctId = _storeAcctId && !_storeAcctId.includes(',') ? _storeAcctId : $("#smtPublish_editDetailForm input[name=storeAcctId]").val()
    const categoryId = $(dom).data('smtcategoryid')
    commonReturnPromise({
        url: ctx + `/aliexpress/category/syncOneEuResponsibleByStoreAcctIdAndCategoryId?storeAcctId=${storeAcctId}&categoryId=${categoryId}`,
        type:'post',
    }).then(() => {
        commonReturnPromise({ 
            url: ctx + `/aliexpress/category/getEuResponsiblePersonsByStoreAcctIdAndCategoryId?storeAcctId=${storeAcctId}&categoryId=${categoryId}`, 
            type:'post',
            contentType: 'application/json'
        }).then(res=>{
            if(res.length){
                $('#smtPublish_msrEuId').next().show()
                commonRenderSelect('smtPublish_msrEuId', res||[], { name: 'msrEuName', code: 'msrEuId' })
                    .then(() => { layui.form.render('select') })

            }else{
                $('#smtPublish_msrEuId').next().hide()
                
            }
        })
    }).catch(err => layui.layer.msg(err || err.message, { icon: 2 }))
}

function qualificationUploadImage(e) {
    var files = e.target.files;
    if (!files || !files.length) return;
    var formData = new FormData();
    formData.append("file", files[0]);
    formData.append("remainDay", 999999);
    $.ajax({
      type: "post",
      url: "/lms/prodImageAliyun/uploadFile",
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      dataType: "json",
      beforeSend: function () {
        loading.show();
      },
      success: function (data) {
        loading.hide();
        if (data.code == "0000") {
          const parentDom = $(e.target).parents(".qualificationitem");
          const imgDom = parentDom.find("img")
          imgDom.attr("src", data.msg);
          parentDom.find(".delteImg").show();
        } else {
          layer.msg(data.msg);
        }
      },
    });
}
  
//   删除图片
function smtPublish_qualificationInfo_delteImg() {
    $("#smtPublish_qualificationInfoView")
      .find(".delteImg")
      .click(function () {
        const parentDom = $(this).parents(".qualificationitem");
        const imgDom = parentDom.find("img");
        imgDom.attr("src", "/lms/static/img/kong.png");
        $(this).hide();
      });
}
  
function qualificationInputBlur(e){
    const parentDom = $(e.target).parents(".qualificationitem");
    const value = e.target.value
}
