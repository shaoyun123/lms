console.log("amazonPublish");
/**layui.use开始 */
var amazonTempFileList;
var amazonPublish_Info_desc_simditor //富文本的返回值
var amazonPublish_amazonTemp_desc_simditor //富文本的返回值
var amazonPublish_create_desc_simditor //富文本的返回值
var storeAcctVal;
var expendAttr;
var themeTableVal;
var prodId;
var storeId;
var createSwatch = '';
var needToAlert = 'true';
var imgDomain = '';
var cateListResult = '';
var cateListCreateCopy = '';
var cateListResultNew = '';
var tabIdStr = '';
var isLangEng = true
var createSkuChooseOptionList = []
var newTplSkuChooseOptionList = []
let createPreval = ''
let newTplPreval = ''
let skuInfoCreateFirst = {}
let createFirstTableInfo = {} // 建模刊登子sku 
let newTplSkuInfoList = []
var createCateAttrVal = [] // 建模刊登默认attrVal
var newTplCateAttrVal = [] // 新模板默认attrVal
var tableRowSsku = ''
const AmazonPublish_skuImgLimit = 9
function getUpdateListingPrice(data) {
    return commonReturnPromise({
        url: `/lms/amazonListing/reCountListingPrice`,
        type: 'POST',
        contentType: 'application/json',
        params: JSON.stringify(data)
    })
}
var isDefault = true
layui.use(['admin', 'form', 'layer', 'formSelects', 'table', 'element', 'laydate', 'laypage', 'laytpl','upload'], function () {
    var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        element = layui.element,
        laydate = layui.laydate,
        upload = layui.upload,
        laypage = layui.laypage,
        laytpl = layui.laytpl,
        $ = layui.$;
    $("#amazonPublish_searchForm select[name=tortBanListing]").val("ANY_PLAT");

    form.render('select')
    form.render('radio')
    form.render('checkbox')
    formSelects.render('selectMan_amazon');
    formSelects.render('selectAttr_amazon');
    formSelects.render('selfImgStatus_amazonpublish');
    formSelects.render("amaPublishisSaleStr")
    formSelects.value('isSaleStr', ['2'])

    // 模板查询赋值
    commonSaveSearchTpl({
        id: "amazonPublish_save",
        formId: "amazonPublish_searchForm",
        pageName: "amazon_publish",
        searchBtnId: "amazonPublish_search",
        cb: param => amazonPublish_formVal(param),
        btnText: '',
        layerTitleText: '',
        saveParam: [{
            name: 'cateTree',
            id: 'LAY-publishs-amazon-publish-div',
            call: 'html'
        }]
    })

    let saveParam = {}
    function amazonPublish_formVal(param) {
        $('#amazonPublish_reset').trigger('click')
        let $formDom = $("#amazonPublish_searchForm")
        saveParam = Object.assign({}, param)
        // 页签
        if (param.listingStatus) {
            $("#amazonPublish_tab")  
            .find(".layui-tab-title li")
            .each(function () {
                let liIndex = $(this).data("value")
                if (liIndex == param.listingStatus) {
                    $(this).addClass("layui-this")
                } else {
                    $(this).removeClass("layui-this")
                }
            })
        }

        // 店铺 赋值
        setTimeout(() => {
            commonReturnPromise({
                url: "/lms/sys/listStoreForRenderHpStoreCommonComponent.html",
                type: "post",
                params: {
                roleNames: `amazon专员`,
                orgId: param.orgId,
                salePersonId: param.sellerId,
                platCode: 'amazon'
                },
            }).then(res => {
                $('#amazonPublish_searchForm').find('select[name="storeAcctId"]').empty()
                for (var i = 0; i < res.length; ++i) {
                    $('#amazonPublish_searchForm').find('select[name="storeAcctId"]').append(
                        getAOption(
                            res[i].id,
                            res[i].storeAcct,
                            res[i].salesSite
                        )
                    )
                }
                form.render();
                //  店铺 站点
                if (param.storeAcctId) {
                    $('#amazonPublish_searchForm').find('select[name="storeAcctId"]').next().find(`dd[lay-value="${param.storeAcctId}"]`).trigger("click")
                    form.render()
                }
                
                if (param.bizzOwnerDepart) {
                    $formDom.find("select[name=bizzOwnerDepart]").next().find(`dd[lay-value="${param.bizzOwnerDepart}"]`).trigger("click")
                    form.render()
                }
                // 给表单赋值
                form.val("amazonPublish_searchForm", param)

                $('#amazonPublish_searchForm').find('[name=storeAcctId]').val(param.storeAcctId)
                $('#amazonPublish_searchForm').find('[name=salesSite]').val(param.salesSite)

                $('#LAY-publishs-amazon-publish-div').html(param.cateTree)
                if (param.salesSite) {
                    amazonPublish_listTempFileName(() => {
                        $('#tempFileNameItem').val(param.tempFileName)
                        form.render()
                    })
                }
                // 多选的 name: xm-select
                let multiSelectObj = {
                    logisAttrContents: "selectAttr_amazon",
                    isSaleStr: 'isSaleStr',
                    selfImgStatus_amazonpublish: 'selfImgStatus_amazonpublish',
                    bizzOwnerIds: 'selectMan_amazon',
                    amazonPublish_createrId: 'amazonPublish_createrId',
                    creatorIds: 'amazonPublish_creater',
                    creatorId: 'amazonPublish_createrId'
                }
                Object.keys(multiSelectObj).forEach(item => {
                    if (param[item]) {
                        formSelects.value(multiSelectObj[item], param[item].split(","), true)
                    } else {
                        formSelects.render(multiSelectObj[item])
                    }
                })
                form.render()
                // 执行搜索
                $("#amazonPublish_tab .layui-tab-title li.layui-this").click()
            })
        }, 0)
        
    }

    // 初始化模板创建人
    commonReturnPromise({
        url: `/lms/sysuser/listUser.html`,
        type: 'GET'
    }).then(function (result) {
        commonRenderSelect("amazonPublish_creater", result.filter(n=>n), {
            name: 'userName',
            code: 'id'
        })
        commonRenderSelect("amazonPublish_createrId", result.filter(n=>n), {
            name: 'userName',
            code: 'id'
        })
        formSelects.render("amazonPublish_createrId")
        formSelects.render("amazonPublish_creater")
    }).catch(err => layer.alert(err, { icon: 2 }))

    // 初始化商品归属人
    $.ajax({
        type: 'post',
        url: ctx + '/sys/getPersonAndOrgsByRole.html',
        dataType: 'json',
        data: { roleNames: '开发专员' },
        success: function(returnData) {
            if (returnData.code == '0000') {
                // 初始化部门
                let orgSelect = $('#selectDepart_amazon')
                orgSelect.append(getAOption('', ''))
                for (var i in returnData.data.orgTree) {
                    setOrgs(returnData.data.orgTree[i], orgSelect, 0)
                }
                commonRenderSelect("selectMan_amazon", returnData.data.userList.filter(n=>n), {
                    name: 'user_name',
                    code: 'id'
                })      
                formSelects.render("selectMan_amazon")
                formSelects.render("selectDepart_amazon")

                var userJSON = dealUser_org(returnData.data.userList)

                layui.form.on('select(selectDepart_amazon)', function(data) {
                    //选择部门下的用户
                    $('#selectMan_amazon').html('')
                    var orgId = data.value
                    if (orgId != '') {
                        // 获取所有子部门
                        var subOrgIds = getSubOrgs(orgSelect, orgId)
                        var userList = userJSON[orgId] || []
                        var subOrgArr
                        for (var i = 0; i < subOrgIds.length; ++i) {
                            subOrgArr = userJSON[subOrgIds[i]]
                            if (subOrgArr) {
                                userList = userList.concat(subOrgArr)
                            }
                        }
                    } else {
                        userList = returnData.data.userList
                    }
                    $('#selectMan_amazon').append(getAOption('', ''))
                    if (userList?.length > 0) {
                        displayMultiSelect_user($('#selectMan_amazon'), userList)
                    } else {
                        formSelects.render('selectMan_amazon', '')
                    }
                    layui.form.render('select')
                })
            } else {
                layer.msg(returnData.msg)
            }
        },
        error: function() {
            layer.msg('发送请求失败')
        }
    })

    /**
     * 渲染用户多选下拉框
     * @param selectDom
     * @param data
     */
    function displayMultiSelect_user(selectDom, data) {
        var multiSelect = selectDom.attr('xm-select')
        var buyerList = []
        selectDom.attr('user_ids', '')
        if (data != null && data.length > 0) {
            var items = []
            $(data).each(function() {
                var a = { name: this.userName || this.user_name, value: this.id }
                items.push(this.id)
                buyerList.push(a)
            })
            selectDom.attr('user_ids', items.join(','))
            layui.use([ 'admin', 'formSelects' ], function() {
                layui.formSelects.data(multiSelect, 'local', { arr: buyerList })
            })
        }
    }

    function getAOption(value, text, sites, remark) {
        return $(
            '<option value="' +
                value +
                '" data-sites="' +
                (sites || '') +
                '" data-remark="' +
                (remark || '') +
                '">' +
                text +
                '</option>'
        )
    }

    // 返回对应组织的人员结构
    function dealUser_org(data) {
        var userJSON = { all: [] }
        for (var i = 0; i < data.length; ++i) {
            if (!userJSON[data[i]['org_id']]) {
                userJSON[data[i]['org_id']] = []
            }
            userJSON[data[i]['org_id']].push({ id: data[i]['id'], userName: data[i]['user_name'] })
            userJSON.all.push({ id: data[i]['id'], userName: data[i]['user_name'] })
        }
        return userJSON
    }

    function setOrgs(orgTree, orgSelect, floor, pOrgIds) {
        var frex = ''
        pOrgIds = pOrgIds || '0'
        for (var k = 0; k < floor; ++k) {
            frex += '|-- '
        }
        orgSelect.append(getAOption(orgTree.id, frex + orgTree.name, null, pOrgIds))
        var childTree = orgTree.childOrgList
        if (childTree) {
            floor++
            var pOrgIdArr = pOrgIds.split(',')
            pOrgIdArr.push(orgTree.id)
            pOrgIds = pOrgIdArr.join(',')
            for (var j = 0; j < childTree.length; ++j) {
                setOrgs(childTree[j], orgSelect, floor, pOrgIds)
            }
        }
    }

    render_hp_orgs_users("#amazonPublish_searchForm");
    laydate.render({
        elem: '#amazonPublishTime', //渲染时间
        range: true
    });
    laydate.render({
        elem: '#amazonPublish_endTime', //渲染时间
    })

    //选择分类弹框
    $('#amazonPublish_item').click(function () {
        admin.itemCat_select('layer-publishs-amazon-publish',
            'LAY-publishs-amazon-publish-hidden',
            'LAY-publishs-amazon-publish-div')
    });

    //绑定店铺更改事件
    form.on('select(amazonPublish_storeAcctId)', function (data) {
        //站点修改
        amazonPublishInitSite();
    });

    function getSubOrgs(orgSelect, pOrgId) {
        var subOrgIdArr = []
        var allOrgOption = orgSelect.find('option')
        var pOrgIdArr
        var pOrgIds
        loop1: for (var i = 0; i < allOrgOption.length; ++i) {
            pOrgIds = allOrgOption[i].getAttribute('data-remark')
            if (pOrgIds) {
                pOrgIdArr = pOrgIds.split(',')
                for (var j = 0; j < pOrgIdArr.length; ++j) {
                    if (pOrgIdArr[j] == pOrgId || [].concat(pOrgId).includes(pOrgIdArr[j])) {
                        subOrgIdArr.push(allOrgOption[i].value)
                    }
                }
            }
        }
        return subOrgIdArr
    }

    function amazonPublish_listTempFileName(callback) {
        var salesSite = $("#amazonPublish_searchForm select[name=salesSite]").val();
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/amazonCateMapping/listTempFileName.html",
            data: { salesSite: salesSite },
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    var resultdata = returnData.data;
                    amazonTempFileList = resultdata;
                    $("#amazonPublish_searchForm select[name=tempFileName]")
                        .empty();
                    $("#amazonPublish_searchForm select[name=tempFileName]")
                        .append(`<option value=""></option>`);
                    for (var i = 0; i < resultdata.length; i++) {
                        $("#amazonPublish_searchForm select[name=tempFileName]")
                            .append(`<option value="` + resultdata[i].name + `">` + resultdata[i].desc + `</option>`);
                    }
                    form.render('select');
                } else {
                    layer.alert(returnData.msg);
                }
                loading.hide();

                callback && callback()
            },
            error: function () {
                loading.hide();
                layer.msg("服务器正忙");
            },
        });
    }

    //绑定店铺更改事件
    form.on('select(amazonPublish_salesSite)', function (data) {
        amazonPublish_listTempFileName();
    });

    form.on('radio(salesType)', function (data) {
        if (data.value == '1') {
            $('#AmazonTemplateForm .variationClassBox').hide()
            $('#publishThemeTable').next().hide()
        } else {
            $('.variationClassBox').show()
            $('#publishThemeTable').next().show()
        }
    });


    //新旧模板
    form.on('select(oldfulfillmentCenterId)', function (data) {
        if(data.value == 'DEFAULT'){
            $(".quantity").val(300)
            $('.requireClass').hide();
            // fba 仓库展示 发货类型
            $('#shippingType_publish').hide()
            $('#grossProfitRateOldTemp').show()
        }else{
            $(".quantity").val('')
            $('.requireClass').show();
            $('#grossProfitRateOldTemp').hide()
            // fba 仓库展示 发货类型
            $('#shippingType_publish').show()
        }
        // 通过仓库是FBA还是直邮，展示不同的列
        const tableDom = $('#listingInfo_sub_tab')
        showDiffColumnByFulfillmentCenterId(data.value != 'DEFAULT',tableDom)
        setPriceOldTemp()
    });

    function showDiffColumnByFulfillmentCenterId(isFBA,tableDom){
         // 通过仓库是FBA还是直邮，展示不同的列
         tableDom.find('.fulfillmentCenterId').each(function(){
            isFBA ? $(this).show() : $(this).hide();
        })
        tableDom.find('.notFulfillmentCenterId').each(function(){
            isFBA ? $(this).hide() : $(this).show();
        })
    }
    
    // variation theme下拉框
    form.on('select(variationTheme)', function(data){
        let variationTheme = data.value
        renderVariationThemeTable(variationTheme)
    });

    form.on('select(publishThemeTableOaAttrSelect)', function(data){
        $(".amazon_publish_variant").hide()
        pskuTableData = []
    });
    
    // 新模板
    form.on('select(newfulfillmentCenterId)', function (data) {
        let plsswList = []
        // 仓库下拉框不选default 则下面子sku表格title加'FBA' 111
        isDefault = data.value === 'DEFAULT'? true : false
        if (!isDefault) {
            // fba 仓库展示 发货类型
            $('#shippingType_publish').show()
        } else {
            $('#shippingType_publish').hide()
        }
        $('.amazon_publish_variant').each(function(index, item) {
            let basicInfoDom = $(item).find('.basicInfo')
            if(isDefault){
                $(basicInfoDom).each(function(cIdx, cItem) {
                    let text = $(cItem).text()
                    if(text.startsWith("FBA")){
                        $(cItem).html(text.substring(3))
                    }
                })  
            }else{
                $(basicInfoDom).each(function(cIdx, cItem) {
                    let text = $(cItem).text()
                    if(!text.startsWith("FBA")){
                        $(cItem).html("FBA" + text)
                    }
                })
            }
        })
        // // 渲染分类属性
        // laytpl($("#amazonCateSpecificsTemp").html()).render(cateListResult, function (html) {
        //     $("#storeTemplate_editspecificForm").html(html);
        // })
        // form.render();

        let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
        $.each($('.toggleClass'),function(index,obj){  //index:索引obj:循环的每个元素
			var value = $(obj).find('.labelField').html();
            if (requireVal.includes(value)) {
                if(data.value == 'DEFAULT'){
                    $(obj).hide()
                } else {
                    $(obj).show()
                }
            }
		})
        $.each($('.testClass'),function(index,obj){  //index:索引obj:循环的每个元素
			var value = $(obj).find('.labelField').html();
            if (requireVal.includes(value)) {
                if(data.value == 'DEFAULT'){
                    $(obj).show()
                } else {
                    $(obj).hide()
                }
            }
		})
        if(data.value === 'DEFAULT'){
            $(".quantity").val(300)
            $('#grossProfitRateNewTemp').show()
            $('#grossProfitRateCreateTemp').show()
        }else{
            $(".quantity").val('')
            $('#grossProfitRateNewTemp').hide()
            $('#grossProfitRateCreateTemp').hide()
        }
        var salesSite = $('#salesSite').val() || $("#AmazonTemplateForm .salesSite").val();
        setPriceNewTemp()

         // 通过仓库是FBA还是直邮，展示不同的列 建模刊登和新模板
         const tableDom = $('#publishInfoTable')
         showDiffColumnByFulfillmentCenterId(data.value != 'DEFAULT',tableDom)

         const tableNewDom = $('#amazonPublishSkuTable')
         showDiffColumnByFulfillmentCenterId(data.value != 'DEFAULT',tableNewDom) 

        // 选择仓库后，展示部分列
        $('#publishInfoTable').find('.fulfillmentCenterId').each(function(){
            data.value == 'DEFAULT' ? $(this).hide(): $(this).show()
        })
        $('#publishInfoTable').find('.notFulfillmentCenterId').each(function(){
            data.value == 'DEFAULT' ? $(this).show() : $(this).hide()
        })

        isLangEng = salesSite === 'JP' ? false: true
        changeLang()

        // // 切换仓库时 更新变种默认的保存数据
        // let paramsArr = []
        // $.each($('#storeTemplate_editspecificForm .layui-form-item'), function(index, obj) {
        //     let key = $(obj).find('.labelField').html();
        //     let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
        //     if (value) {
        //         let contennt = `${key}:${value}`
        //         paramsArr.push(contennt)
        //     }
        // })
        // // 给每一项添加保存数据
        // createSkuChooseOptionList.forEach(item => {
        //     // 标题 根据子sku列表数据中来
        //     pskuTableData?.forEach(cItem => {
        //         if (cItem.storeSSku === item.value) {
        //             let saveObj = $('#createSkuChoose').find(`option[value="${item.value}"]`).attr('sskudata')
        //             saveObj = JSON.parse(saveObj)
        //             saveObj.subAttrKeyVal = paramsArr.join('#,#') || ''
        //             $('#createSkuChoose').find(`option[value="${item.value}"]`).attr('sskudata', JSON.stringify(saveObj))
        //         }
        //     })
        // })
    });

    // 建模刊登类目属性sku切换
    form.on('select(createSkuChoose)', function (data) {
        // 切换sku，保存上一个sku的数据，并获取当前sku的数据
        // 当前选择的值
        let currentValue = data.value;
        let currentDom = data.elem;
        saveCreateAndDetailSkuData('create', currentDom)
        setCreateSkuData(currentDom, currentValue)
        // 更新 createPreval 为当前值，以便下次比较
        createPreval = currentValue;
    });

    // 新模板类目属性sku切换
    form.on('select(newTplSkuChoose)', function (data) {
        // 切换sku，保存上一个sku的数据，并获取当前sku的数据
        // 当前选择的值
        let currentValue = data.value;
        let currentDom = data.elem;
        console.log('change sku')
        saveCreateAndDetailSkuData('newTpl', currentDom)
        setDetailSkuData(currentDom, currentValue)
        // 更新 newTplPreval 为当前值，以便下次比较
        newTplPreval = currentValue;
    });

    $(document).on("click", "#createApplyOtherAttr",function(e) {
        e.preventDefault()
        // 建模刊登 对当前子sku的数据进行保存 应用到所有子sku
        let currentDom = $('#createSkuChoose')
        saveCreateAndDetailSkuData('create', currentDom, 'apply')
    })
    

    $(document).on("click","#newTplApplyOtherAttr",function(e) {
        e.preventDefault()
        // 模板详情 对当前子sku的数据进行保存 应用到所有子sku
        let currentDom = $('#newTplSkuChoose')
        saveCreateAndDetailSkuData('newTpl', currentDom, 'apply')
    })

    /**
     * 初始化站点选项
     */
    function amazonPublishInitSite() {
        var siteIds = $("#amazonPublish_searchForm select[name=storeAcctId] option:selected").data("sites");
        //清空site
        $("#amazonPublish_searchForm select[name=salesSite]").empty();
        if (siteIds || siteIds == 0) {
            siteIds = siteIds.toString();
            siteIds = siteIds.split(",")
            amazonSalesSitesData.forEach(function (value, key) {
                for (var i in siteIds) {
                    if (siteIds[i] == key) {
                        var optionTpl = "<option value=':salesSite'>:siteName</option>";
                        optionTpl = optionTpl.replace(":salesSite", key);
                        optionTpl = optionTpl.replace(":siteName", value);
                        $("#amazonPublish_searchForm select[name=salesSite]").append(optionTpl);
                    }
                }
            })
        }
        form.render('select');
        //触发模板选项的初始化
        amazonPublish_listTempFileName();
    }

    //绑定更改事件
    form.on('select(amazonPublish_showHideVagueFlag)', function (data) {
        if ("pSkus" == data.value
            || "sSkus" == data.value
            || "storePSkuList" == data.value
            || "storeSSkuList" == data.value) {
            $("#amazon_publish #amazon_skuVagueFlag_div").removeClass("disN");
        } else {
            $("#amazon_publish #amazon_skuVagueFlag_div").addClass("disN");
        }
    });

    //清空按钮的点击事件
    $('#amazonPublish_reset').click(function () {
        $('#LAY-publishs-amazon-publish-hidden').val('')
        $('#LAY-publishs-amazon-publish-div').html('')

        $("#amazonPublish_searchForm select[name=salesSite]").empty()
        formSelects.value('selectAttr', [])
        formSelects.value('selectMan', [])
        // form.render();
    });
    // totalNum商品
    // amazonPublishTemp亚马逊模板
    // toListingNum待刊登
    // amazonPublishToFile待生成文件
    // amazon_listingNum刊登中
    // listingSucNum刊登成功
    // listingFailNum刊登失败
    let orderByObj= {
        "totalNum":["基础模板审核时间倒序",
            "基础模板审核时间正序",
            "亚马逊直邮30天销量倒序",
            "公司30天销量倒序",
            "虾皮30天销量倒序",
            "eBay30天销量倒序"],
        "amazonPublishTemp":["亚马逊模板创建时间倒序",
            "亚马逊模板创建时间正序",
            "基础模板审核时间倒序",
            "基础模板审核时间正序",
            "亚马逊直邮30天销量倒序",
            "公司30天销量倒序",
            "虾皮30天销量倒序",
            "eBay30天销量倒序"],
        "toListingNum":[],
        "amazonPublishToFile":[],
        "amazon_listingNum":["定时刊登时间倒序",
            "定时刊登时间正序"],
        "listingSucNum":["实际刊登时间倒序",
            "实际刊登时间正序"],
        "listingFailNum":["实际刊登时间倒序",
            "实际刊登时间正序",
            "亚马逊直邮30天销量倒序",
            "公司30天销量倒序",
            "虾皮30天销量倒序"]
    },timeTypeObj = {
        "totalNum":["基础模板审核时间"],
        "amazonPublishTemp":["亚马逊模板创建时间", "基础模板审核时间"],
        "toListingNum":[],
        "amazonPublishToFile":[],
        "amazon_listingNum":[],
        "listingSucNum":["实际刊登时间"],
        "listingFailNum":["实际刊登时间"]
    },currentTabId = "totalNum";

    var first = true;
    //监听tab切换来选中不同的tab页
    element.on('tab(amazonPublish_tab)', function (data) {
        console.log('tab change')
        let _this = this;
        $('#amazonPublish_div_selPubStyle').addClass('disN');

        var btn1 = $('#amazonPublish_btn_genListing'),//生成店铺商品
            btn2 = $('#amazonPublish_btn_download'),//生成刊登文件
            btn3 = $('#amazonPublish_btn_delListing'),//删除店铺商品
            // btn4 = $('#amazonPublish_btn_pubNow'), //立即刊登
            btn5 = $('#amazonPublish_btn_exportSku'), //导出SKU映射
            // btn6 = $('#amazonPublish_btn_pubOnTime'), //定时刊登
            btn7 = $('#amazonPublish_btn_setShipping') //设置运费
        btn8 = $('#amazonPublish_btn_cancleOnTime'), //取消定时刊登
        btn9 = $('#amazonPublish_btn_rePubNow'), //批量重新刊登
        btn10 = $('#amazonPublish_btn_copyListing'),//复制刊登信息
        btn11 = $('#amazonPublish_btn_exportBaseInfo'),//导出刊登基础信息
        btn12 = $('#amazonPublish_btn_setStoreItems'),// 亚马逊模板生成店铺商品
        btn13 = $('#amazonPublish_btn_resetStoreItems'),// 取消生成文件
        btn14 = $('#amazonPublish_btn_keyword'),// 关键词分词不分词
        btn15 = $('#amazonPublish_btn_listingDataSource');// 新模板刊登
        btn1.addClass('disN');
        btn2.addClass('disN');
        btn3.addClass('disN');
        btn5.addClass('disN');
        btn7.addClass('disN');
        btn8.addClass('disN');
        btn9.addClass('disN');
        btn10.addClass('disN');
        btn11.addClass('disN');
        btn12.addClass('disN');
        btn13.addClass('disN');
        btn14.addClass('disN');
        btn15.addClass("disN");
        let orderBy = $("#amazonPublish_searchForm select[name=orderBy]").val()
        $("#amazonPublish_searchForm input[name=shippingStatus]").val('')
        if(currentTabId != $(_this).attr("id")){
        let html = '',str = '';
        if (orderByObj[$(_this).attr("id")]?.length === 0) {
            $('#orderByEl').hide();
        } else {
            $('#orderByEl').show();
            orderByObj[$(_this).attr("id")].forEach((item,index) => {
                html += `<option value="${index+1}">${item}</option>`
            })
        }
        timeTypeObj[$(_this).attr("id")].forEach((item,index) => {
            if(item.indexOf("创建") > -1){
                str += `<option value="CREATE_TIME">${item}</option>`
            }else if(item.indexOf("审核") > -1){
                str += `<option value="AUDIT_TIME">${item}</option>`
            }else if(item.indexOf("刊登") > -1){
                str += `<option value="PUBLISH_TIME">${item}</option>`
            }
        })

        $("#amazonPublish_searchForm select[name=orderBy]").html(html)
        $("#amazonPublish_searchForm select[name=timeType]").html(str)
            // 刊登成功切换刊登失败or刊登失败切换刊登成功
            if((currentTabId == "listingFailNum"&&$(_this).attr("id") == "listingSucNum")||(currentTabId == "listingSucNum"&&$(_this).attr("id") == "listingFailNum")){
                if(orderBy > 2){
                    $("#amazonPublish_searchForm select[name=orderBy]").val(1)
                }else {
                    $("#amazonPublish_searchForm select[name=orderBy]").val(orderBy)
                }
            }else{
                $("#amazonPublishTime").val("")
            }
        form.render("select")
    }
        currentTabId = $(_this).attr("id")
        // totalNum商品
        // amazonPublishTemp亚马逊模板
        // toListingNum待刊登
        // amazonPublishToFile待生成文件
        // amazon_listingNum刊登中
        // listingSucNum刊登成功
        // listingFailNum刊登失败
        // $(".amazonPublishHide").show()
        // $(".amazonPublishShow").hide()
        
        $("#amazon_time").show()
        switch ($(_this).attr("id")) {
            case "totalNum":
                btn1.removeClass('disN');
                btn5.removeClass('disN');
                btn11.removeClass('disN');
                $(".amazonPublish_searchType1").show()
                $(".amazonPublish_searchType2").hide();
                $("#amazonPublish_searchForm input[name=listingStatus]").val('-2');
                break;
            case "amazonPublishTemp":
                btn12.removeClass('disN');
                $("#amazonPublish_searchForm input[name=listingStatus]").val('4');
                $("#amazonPublish_table").show()
                $(".amazonPublish_searchType1").show()
                $(".amazonPublish_searchType2").hide();
                amazonPublishTableRender()
                break;
            case "toListingNum":
                $('#amazonPublish_div_selPubStyle').removeClass('disN');
                $("#amazon_time").hide()
                btn3.removeClass('disN');
                btn5.removeClass('disN');
                btn10.removeClass('disN');
                btn14.removeClass('disN');
                btn15.removeClass('disN');
                $(".amazonPublish_searchType1").hide()
                $(".amazonPublish_searchType2").show();
                $("#amazonPublish_searchForm input[name=listingStatus]").val('0');
                break;
            case "amazonPublishToFile":
                btn13.removeClass('disN');
                btn15.removeClass('disN');
                $(".amazonPublish_searchType1").hide()
                $(".amazonPublish_searchType2").show();
                $("#amazonPublish_searchForm input[name=listingStatus]").val('6');
                $("#amazon_time").hide()
                break;
            case "amazon_listingNum":
                btn8.removeClass('disN');
                btn5.removeClass('disN');
                btn14.removeClass('disN');
                btn15.removeClass('disN');
                $(".amazonPublish_searchType1").hide()
                $(".amazonPublish_searchType2").show();
                $("#amazonPublish_searchForm input[name=listingStatus]").val('3');
                $("#amazon_time").hide()
                break;
            case "listingSucNum":
                btn10.removeClass('disN');
                btn2.removeClass('disN');
                btn5.removeClass('disN');
                btn14.removeClass('disN');
                btn15.removeClass('disN');
                $(".amazonPublish_searchType1").hide()
                $(".amazonPublish_searchType2").show();
                $("#amazonPublish_searchForm input[name=listingStatus]").val('1')
                break;
            case "listingFailNum":
                btn2.removeClass('disN');
                btn3.removeClass('disN');
                btn5.removeClass('disN');
                btn9.removeClass('disN');
                btn14.removeClass('disN');
                btn15.removeClass('disN');
                $(".amazonPublish_searchType1").hide()
                $(".amazonPublish_searchType2").show();
                $("#amazonPublish_searchForm input[name=listingStatus]").val('2');
                break;
        }
        //每次触发,执行依次查询
        if ($(_this).attr("id") == 'amazonPublishTemp') { // 亚马逊模板
            $(".tempFileNameShow").hide()
            $(".tempFileNameHide").show()
        } else if ($(_this).attr("id") == 'amazonPublishToFile') { // 待生成文件
            $(".tempFileNameShow").hide()
            $(".tempFileNameHide").hide()
            amazonPublish_searchProd();
        } else {
            $(".tempFileNameShow").show()
            $(".tempFileNameHide").hide()
            amazonPublish_searchProd();
        }
        $("#amazonPublish_pagination").show()

        // 保存搜索部分
        $('#amazonPublishTime').val(saveParam.time)
        $('#amazon_publish').find('[name=timeType]').val(saveParam.timeType)
        $('#amazon_publish').find('[name=orderBy]').val(saveParam.orderBy)
        form.render()
    })

    form.on('select(amazonPublish_selPubStyle_filter)', function (data) {
        var selPubStyle = data.value;
        if (1 == selPubStyle) {
            $("#amazonPublish_btn_pubNow").trigger("click");
        }
        if (2 == selPubStyle) {
            $("#amazonPublish_btn_pubOnTime").trigger("click");
        }
        $('#amazonPublish_selPubStyle').val('');
        form.render('select')
    })

    // 亚马逊模板--生成店铺商品,店铺必选
    $("#amazonPublish_btn_setStoreItems").click(function () {
        let checkedDataId = [], tableCheckedData = table.checkStatus('amazonPublishTable').data;
        let checkedData = $("#amazonPublish_table tbody input.sid-cbox:checked");
        //获取选中的数据
        if (checkedData.length == 0) {
            return layer.msg("请至少选择一条数据")
        }
        if ($("#amazonPublish_searchForm select[name=storeAcctId]").val() == '') {
            return layer.msg("请选择店铺")
        }

        for (var i = 0; i < checkedData.length; i++) {
            checkedDataId.push(checkedData[i].value);
        }

        let _newTableCheckedData = [], newArr = [];
        tableCheckedData.forEach(item => {
            // let amazonTemplateSId = item.prodListingSubSkuAmazons.filter(function (n) {
            //     if (checkedDataId.indexOf(n.id.toString()) > -1 && n.isSale == false)
            //         _newTableCheckedData.push(n.id)
            //     return checkedDataId.indexOf(n.id.toString()) != -1 && n.id
            // });
            //
            // let amazonTemplateSIds = amazonTemplateSId.map(item => item.id)
            let amazonTemplateSIds = item.prodListingSubSkuAmazons.map(item => item.id)

            newArr.push({
                "storeAcctId": $("#amazonPublish_searchForm select[name=storeAcctId]").val(),
                "amazonTemplateSIds": amazonTemplateSIds,
                "salesSite": item.salesSite,
                "pSku": item.psku
            })
        });

        // if (_newTableCheckedData.length > 0) {
        //     return layer.alert("选择子SKU中不能存在停售商品", { icon: 2 })
        // }

        getDataAmazonPublishAddStoreProdsByAmazonTemplate(newArr).then(function (result) {
            let msg = ``
            result.forEach(item => msg += item + '<br>')
            layer.alert(msg || "操作成功", { icon: 1 });
            amazonPublish_searchProd()
        }).catch(function (err) {
            layer.alert(err, { icon: 2 });
        })
    })

    $('#amazonPublish_btn_resetStoreItems').click(() => {
        let paramData = [];
        let data = $("#amazonPublish_table tbody input.pid-cbox:checked");
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }
        }
        var listingStatus = $("#amazonPublish_searchForm input[name=listingStatus]").val();
        if (paramData.length > 0) {
            commonReturnPromise({
                url: `/lms/amazonListing/cancelListingFile`,
                type: 'POST',
                contentType: 'application/json',
                params: JSON.stringify(paramData.map(Number))
            }).then(function (result) {
                layer.alert(result, { icon: 1 });
                amazonPublish_searchProd()
            }).catch(err => layer.alert(err, { icon: 2 }))
        }
        else {
            layui.layer.msg("请至少选择1条数据");
        }
    })

    // 生成店铺商品
    // newArr:[{},{}]
    function getDataAmazonPublishAddStoreProdsByAmazonTemplate(newArr) {
        return commonReturnPromise({
            url: `/lms/amazonListing/addStoreProdsByAmazonTemplate`,
            type: 'POST',
            contentType: 'application/json',
            params: JSON.stringify(newArr)
        })
    }

    // 监听表格的checkbox操作
    table.on('checkbox(amazonPublishTable)', function (obj) {
        if (obj.type == 'all') { //如果触发的是全选，则为：all，如果触发的是单选，则为：one
            /*获取表内子id的checkbox和美化后的元素*/
            let sId_cbox_td = $('#amazonPublish_table').find('tbody input.sid-cbox');
            sId_cbox_td.prop('checked', obj.checked)
        } else {
            /*获取表内子id的checkbox和美化后的元素*/
            let subs_cbox = $(`tr[data-index=${obj.data.LAY_TABLE_INDEX}]`).find('input.sid-cbox');
            subs_cbox.prop('checked', obj.checked)
        }
        form.render();
    });

    // 子sku被选中，同时，父sku也选中
    form.on("checkbox(amazonPublishSskuCheckbox)", function (data) {
        // 如果子sku取消，先判断是否所有子sku取消，如果所有取消，则父取消，否则父还选中
        if (!data.elem.checked && $(data.elem).closest("tbody").find(".layui-form-checked").length > 0) {
            return false;
        }
        let pid_cbox = $(data.elem).parents("tr").find("input[name=layTableCheckbox]").eq(0),
            pid_cbox_index = $(data.elem).parents("tr").eq(1).attr("data-index");
        pid_cbox.prop('checked', data.elem.checked)
        // 这里需要注意，只有改变table.cache["amazonPublishTable"][index]["LAY_CHECKED"]的值，table选中的值才会被table.checkStatus('amazonPublishTable')捕捉到
        table.cache["amazonPublishTable"][pid_cbox_index]["LAY_CHECKED"] = 'true'
        form.render()
    })

    form.on('radio(swatchRadio)', function(data) {
         let name = data.elem.name; // imgCbox0
        if (!$(data.elem).data('select')) {
            $(`input[name=${name}]`).attr('select', false)
            $(`input[name=${name}]`).data('select', false)
            $(data.elem).prop('checked', true)
            $(data.elem).attr('select', true)
            $(data.elem).data('select', true)
        } else {
            $(data.elem).prop('checked', false)
            $(data.elem).attr('select', false)
            $(data.elem).data('select', false)
            $(`input[name=${name}]`).attr('select', false)
            $(`input[name=${name}]`).data('select', false)
    }
        // $(data.elem).attr('checked',!$(data.elem).attr('checked'))
        form.render('radio');
    })

    $(document).off("click",".publish_addLocalPicture").on("click",".publish_addLocalPicture",function(){
        //绑定当前类名下的上传元素
        // $(".amazonpublish_uploadPic").click()
        _picThis = $(this)
        //重写上传逻辑
        console.log('重写上传逻辑')
        let $uploadInput = $('<input type=file class="disN" multiple/>');
        $uploadInput.appendTo($(body));
        $uploadInput.trigger('click');
        let $uploadFn = function(){
          $uploadInput.unbind().change(function (e) {
            var files = e.target.files;
            if (!files.length) return;
            if(_picThis.parent().next().find("li").length + files.length > AmazonPublish_skuImgLimit){
                return layer.msg(`辅图最多上传${AmazonPublish_skuImgLimit}张，请删除后重试！`)
            }
            for(let i=0; i<files.length; i++){
                var file = files[i];
                var formData = new FormData();
                formData.append('file', file);
                //把formData传递给后台,执行提交操作
                $.ajax({
                    url: ctx + "/prodTpl/uploadPic.html",
                    data: formData,
                    type: "POST",
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    beforeSend: function () {
                        loading.show();
                    },
                    success: function (res) {
                        loading.hide();
                        $uploadInput.remove();
                        if (res.code == '0000') {
                          let amazonpublish_imgStr = amazonpublish_imgStr_left + createSwatch + amazonpublish_imgStr_right
                          if(_picThis.parent().next().find("li").length<AmazonPublish_skuImgLimit){
                            let index = _picThis.parents('.amazon_publish_variant').index()
                            let lis = amazonpublish_imgStr.replaceAll(":src",res.msg)
                            lis = lis.replaceAll(":value",res.msg)
                            lis = lis.replaceAll(":shortName",res.data)
                            lis = lis.replaceAll(":name", 'imgCbox' + index)
                            _picThis.parent().next().find("ul").append(lis)
                            _picThis.closest('h3').find(".curImgNum").text(_picThis.parent().next().find("li").length);
                            form.render()
                          }else{
                              layer.msg(`辅图已满${AmazonPublish_skuImgLimit}张，请删除后再新增`)
                          }
                        } else {
                            layer.msg(res.msg, { icon: 2 });
                        }
                        //传递完成以后清空input的value
                        e.target.value = '';
                    },
                    error: function (error) {
                        loading.hide();
                        $uploadInput.remove();
                        layer.msg(`${error.statusText}`, { icon: 2 });
                    }
                })
            }
            //传递完成以后清空input的value
            e.target.value = '';
            e.preventDefault();
            e.stopPropagation();
        });
        }
        $uploadFn();
    })
})

    let _picThis = '',
    amazonpublish_imgStr_left = `<li draggable="true" class="imgBox_prodTpl" data-src=":src" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
        <div class="ImgDivOut">`
    amazonpublish_imgStr_right = `<div class="ImgDivIn" style="width:150px;height:150px">
        <img style="width:100%;height:100%;object-fit:contain;" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" src=":src" shortname=":shortName">
        </div>
        <div class="imgDivDown" style="width:150px">
        <a onclick="amazonStore_setMainImg(this);" href="javascript:void(0);"style="float:left;color: #73a1bf;">设为主图</a>
        <a onclick="amazonStore_delImg(this);" href="javascript:void(0);" style="float:right;color: #73a1bf;">移除</a>
        </div>
        </div>
        </li>`;

    // 获取当前子sku的数据并回显 建模刊登
    function setCreateSkuData(currentDom, currentValue) {
        let saveData = $(currentDom).find(`option[value="${currentValue}"]`).attr('sskudata')
         // 标题 根据子sku列表数据中来
         pskuTableData?.forEach(item => {
            if (item.storeSSku === currentValue) {
                $('#createSubTitle').val(skuInfoCreateFirst.itemName)
            }
        })
        if (saveData) {
            saveData = JSON.parse(saveData)
            // 卖点
            $('#AmazonTemplateForm').find('[name=sellingPoint1_1]').val((saveData.subBulletPoints?.split("#,#")[0] || '').replaceAll("\"","&quot;") || '')
            $('#AmazonTemplateForm').find('[name=sellingPoint1_2]').val((saveData.subBulletPoints?.split("#,#")[1] || '').replaceAll("\"","&quot;") || '')
            $('#AmazonTemplateForm').find('[name=sellingPoint1_3]').val((saveData.subBulletPoints?.split("#,#")[2] || '').replaceAll("\"","&quot;") || '')
            $('#AmazonTemplateForm').find('[name=sellingPoint1_4]').val((saveData.subBulletPoints?.split("#,#")[3] || '').replaceAll("\"","&quot;") || '')
            $('#AmazonTemplateForm').find('[name=sellingPoint1_5]').val((saveData.subBulletPoints?.split("#,#")[4] || '').replaceAll("\"","&quot;") || '')
            // 标题
            $('#createSubTitle').val(saveData.subTitle || '')
            $('#createSubTitle').attr('data-prodpsku', saveData.prodPSku)
            //设置商品描述
            amazonPublish_create_desc_simditor = autoSimditor('amazonPublishDesc', saveData.subProductDescription?.replace(/#,#/g, "<br>")); //设置描述头内容
            // 关键词
            $("#AmazonTemplateForm input[name=genericKeywords]").tagsinput('removeAll');
            saveData.subGenericKeywords?.split(",").forEach((item, index) => {
                $("#AmazonTemplateForm input[name=genericKeywords]").tagsinput('add', item);
            });

            // 渲染分类属性
            // if ($('#AmazonTemplateForm').find('[name=fulfillmentCenterId]').val()) {
                let attrArr = saveData.subAttrKeyVal?.split('#,#')
                let attrList = {}
                attrArr && attrArr.forEach(item => {
                    let key = item.split(':')[0]
                    let value = item.split(':')[1]
                    let obj = {
                        [key]: value
                    }
                    attrList = Object.assign(attrList, obj)
                })
                let attrkeyList = Object.keys(attrList)
                cateListResult.cateList?.forEach(item => {
                    if (attrkeyList.includes(item.fieldName) || attrkeyList.includes(item.localLabelName)) {
                        // item.validValues = attrList[item.fieldName] || attrList[item.localLabelName] || ''
                        item.defaultValue = attrList[item.fieldName] || attrList[item.localLabelName] || ''
                        item.tempValue = attrList[item.fieldName] || attrList[item.localLabelName] || ''
                    } else {
                        // item.validValues = ''
                        item.defaultValue = ''
                        item.tempValue = ''
                    }
                })
                layui.laytpl($("#amazonCateSpecificsTemp").html()).render(cateListResult, function (html) {
                    $("#storeTemplate_editspecificForm").html(html);
                })
                layui.form.render();
                commonToggleAttr();
            }
        }
    // 产品详情 旧模板定价
    // type：btnSetPrice  按钮定价
    // type: '' 切换仓库定价
    function setPriceOldTemp(type = '') {
        let plsswList = []
        let plsswBtnSetPriceList = []
        // amazonPublish_SubSkuInfo => 旧模板
        $("#amazonPublish_SubSkuInfo").find(".skuInfo").each((index,item) => {
            let obj = {
                id: $(item).find('[name=id]').text(),
                storeSSku: $(item).find('[name=storeSSku]').text() || $(item).find('input[name=newStoreSSku]').val(),
                prodTempId: $(item).find('[name=prodTempId]').text()
            }
            if (type === 'btnSetPrice' && $(item).find('.pid-cbox').prop('checked')) {
                plsswBtnSetPriceList.push(obj)
            } else {
                plsswList.push(obj)
            }
        })
        if (type == '' && plsswList?.length === 0) {
            layer.msg('当前还没有生成sku！')
            return
        }
        if (type === 'btnSetPrice' && plsswBtnSetPriceList?.length === 0) {
            layer.msg('请勾选sku进行定价！')
            return
        }
        let tempFileName = $('#publishLayerAmazonListingName').text()
        let params = {
            categoryId: $("#amazon_online_creatListing_cateItem-hidden2").val(),
            fullCateName: tempFileName.replaceAll('  >>  ', '/'),
            "id":$("[name=amazonListingId]").val(),
            "fulfillmentCenterId": $('#oldfulfillmentCenterId').val(),
            "salesSite": $("#amazonPublish_editDetailForm input[name=salesSite]").val(),
            "storeAcctId": $("#amazonPublish_editDetailForm input[name=storeAcctId]").val(),
            "plsswList": type === 'btnSetPrice' ? plsswBtnSetPriceList : plsswList
        }
        if (type === 'btnSetPrice') {
            params.grossProfitRate = $('#grossProfitRateOldTemp').find('[name=grossProfitRate]').val()
        }
        getUpdateListingPrice(params).then(res=>{
            res.forEach(item => {
                $(`.changePrice${item.id}`).find('.price').val(item.standardPrice)
            })
        })
    }

    // 新模板 和 建模刊登 定价
    // type：btnSetPrice  按钮定价
    // type: '' 切换仓库定价
    function setPriceNewTemp(type = '') {
        let plsswList = []
        let plsswBtnSetPriceList = []
        // 新模板和建模刊登
        var salesSite = $('#salesSite').val() || $("#AmazonTemplateForm .salesSite").val();
        let tableId = $("#amazonPublishModifyAmazonTemplateView")[0] ? $("#amazonPublishModifyAmazonTemplateView") : $("#publishInfoTable")
        $(tableId).find(".amazon_publish_variant").each((index,item) => {
            let obj = {
                id: $(item).find('input[name=prodListingSubSkuAmazonsId]').val(),
                storeSSku: $(item).find('[name=storeSSku]').val() || $(item).find('[name=storeSSku]').text() || $(item).find('[name=prodListingSubSkuAmazonsStoreSSku]').val(),
                prodTempId: $(item).find('input[name=prodTempId]').val()
            }
            if (type === 'btnSetPrice' && $(item).find('.pid-cbox').prop('checked')) {
                plsswBtnSetPriceList.push(obj)
            } else {
                plsswList.push(obj)
            }
        })
        let tempFileName = $('#publishLayerAmazonListingName').text();
        let params = {
            categoryId: $("#amazonPublishModifyAmazonTemplateView .categoryId").val() || $("#amazon_online_creatListing_cateItem-hidden2").val(),
            fullCateName: $("#amazonPublishModifyAmazonTemplateView .fullCateName").val() || tempFileName.replaceAll('  >>  ', '/'),
            "id":$("[name=amazonNewPublishId]").val() || prodId,
            "fulfillmentCenterId": $('#newfulfillmentCenterId').val() || $('#createfulfillmentCenterId').val(),
            "salesSite": salesSite,
            "storeAcctId": storeId,
            "plsswList": type === 'btnSetPrice' ? plsswBtnSetPriceList : plsswList
        }
        if (type === 'btnSetPrice') {
            params.grossProfitRate = $('#grossProfitRateNewTemp').find('[name=grossProfitRate]').val() || $('#grossProfitRateCreateTemp').find('[name=grossProfitRate]').val() || ''
        }
        if (type === '' && plsswList?.length === 0) {
            // layer.msg('当前还没有生成sku！')
            return
        }
        if (type === 'btnSetPrice' && plsswBtnSetPriceList?.length === 0) {
            layer.msg('请勾选sku进行定价！')
            return
        }
        
        // 建模刊登
        getUpdateListingPrice(params).then(res=>{
            // 建模刊登
            $('#publishInfoTable tbody tr')?.each((index, item) => {
                res?.forEach((cItem, cIndex) => {
                    // 按钮定价
                    if (type === 'btnSetPrice') {
                        let isChecked = $(item).find('input:checked').prop('checked')
                        if (isChecked) {
                            if (index === cIndex) {
                                $(item).find(`.changePrice`).val(cItem.standardPrice)
                                if ($('#createfulfillmentCenterId').val() === 'DEFAULT') {
                                    $(item).find(`.changeWeight`).find('span').text(`${cItem.originWeight}`)
                                    $(item).find(`.changeWeight`).find('input').val(cItem.originWeight)
                                } else {
                                    $(item).find(`.changeWeight`).find('span').text(`${cItem.weight} ${cItem.weightUnit || 'OZ'} (${cItem.originWeight}g)`)
                                    $(item).find(`.changeWeight`).find('input').val(cItem.weight)
                                }
                                $(item).find(`.changeOuterBoxHeight`).text(cItem.outerBoxHeight)
                                $(item).find(`.changePurchaseCostPrice`).text(cItem.purchaseCostPrice)
                            }
                        }
                    } else {
                        // 切换仓库定价 index
                        if (index === cIndex) {
                            $(item).find(`.changePrice`).val(cItem.standardPrice)
                            if ($('#createfulfillmentCenterId').val() === 'DEFAULT') {
                                $(item).find(`.changeWeight`).find('span').text(`${cItem.originWeight}`)
                                $(item).find(`.changeWeight`).find('input').val(cItem.originWeight)
                            } else {
                                $(item).find(`.changeWeight`).find('span').text(`${cItem.weight} ${cItem.weightUnit || 'OZ'} (${cItem.originWeight}g)`)
                                $(item).find(`.changeWeight`).find('input').val(cItem.weight)
                            }
                            $(item).find(`.changeOuterBoxHeight`).text(cItem.outerBoxHeight)
                            $(item).find(`.changePurchaseCostPrice`).text(cItem.purchaseCostPrice)
                        }
                    }
                })
            })

            // 新模板的按钮定价
            $('#amazonPublishSkuTable tbody tr')?.each((index, item) => {
                res?.forEach((cItem, cIndex) => {
                    // 按钮定价
                    if (type === 'btnSetPrice') {
                        let isChecked = $(item).find('input:checked').prop('checked')
                        if (isChecked) {
                            if (index === cIndex) {
                                $(item).find(`.changePrice`).val(cItem.standardPrice)
                                if ($('#newfulfillmentCenterId').val() === 'DEFAULT') {
                                    $(item).find(`.changeWeight`).text(`${cItem.originWeight}`)
                                    $(item).find(`.changeWeight`).find('input').val(cItem.originWeight)
                                } else {
                                    $(item).find(`.changeWeight`).text(`${cItem.weight} ${cItem.weightUnit || 'OZ'} (${cItem.originWeight}g)`)
                                    $(item).find(`.changeWeight`).find('input').val(cItem.weight)
                                }
                                $(item).find(`.changeOuterBoxHeight`).text(cItem.outerBoxHeight)
                                $(item).find(`.changePurchaseCostPrice`).text(cItem.purchaseCostPrice)
                            }
                        }
                    } else {
                        // 切换仓库定价 index
                        if (index === cIndex) {
                            $(item).find(`.changePrice`).val(cItem.standardPrice)
                            if ($('#newfulfillmentCenterId').val() === 'DEFAULT') {
                                $(item).find(`.changeWeight`).find('span').text(`${cItem.originWeight}`)
                                $(item).find(`.changeWeight`).find('input').val(cItem.originWeight)
                            } else {
                                $(item).find(`.changeWeight`).find('span').text(`${cItem.weight} ${cItem.weightUnit || 'OZ'} (${cItem.originWeight}g)`)
                                $(item).find(`.changeWeight`).find('input').val(cItem.weight)
                            }
                            $(item).find(`.changeOuterBoxHeight`).text(cItem.outerBoxHeight)
                            $(item).find(`.changePurchaseCostPrice`).text(cItem.purchaseCostPrice)
                        }
                    }
                })
            })
        })
    }

// 网络图片
function publish_addPicture(dom){
    var index = layui.layer.open({
        type: 1,
        title: '网络图片',
        area: ['800px', '300px'],
        id: 'amazonPublishPic',
        content: '<div class="p20 pl20"><textarea class="layui-textarea" id="" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
        btn: ['确定', '关闭'],
        success: function (layero) {
            layui.form.render();
        },
        yes: function (index, layero) {
            var urls = $(layero).find('textarea').val()
            let amazonpublish_imgStr = amazonpublish_imgStr_left + createSwatch + amazonpublish_imgStr_right
            if(urls&&urls!==""){
                var lis=""
                var urlArr = urls.split('\n')
                let index = dom.parents('.amazon_publish_variant').index()
                for (let i = 0; i < urlArr.length; i++) {
                    getBase64And1000(urlArr[i]).then((base64) =>{
                        let file = dataURLtoBlob(base64, '1.jpg')
                        let formData = new FormData()
                        formData.append("file",file)
                        $.ajax({
                            url: ctx + "/prodTpl/uploadPic.html",
                            data: formData,
                            type: "POST",
                            async: true,
                            cache: false,
                            contentType: false,
                            processData: false,
                            dataType: 'json',
                            beforeSend: function () {
                                loading.show();
                            },
                            success: function (res) {
                                loading.hide();
                                if (res.code == '0000') {
                                    let url = res.msg
                                    
                                    lis = ''
                                    let str = amazonpublish_imgStr.replaceAll(":src", url)
                                    str = str.replaceAll(":value", url)
                                    str = str.replaceAll(":name", 'imgCbox' + index)
                                    str = str.replaceAll(":shortName", res.data || '')
                                    lis += str
    
                                    if(dom.parent().next().find("li").length + urlArr.length <= AmazonPublish_skuImgLimit){
                                        dom.parent().next().find('ul').append(lis)
                                        dom.closest('h3').find(".curImgNum").text(dom.parent().next().find("li").length);
                                        layui.form.render();
                                    }else{
                                        layer.msg(`辅图已满${AmazonPublish_skuImgLimit}张，请删除后再新增`)
                                    }
                                }
                            },
                            error: function (error) {
                                loading.hide();
                                // layer.msg(`${error.statusText}`, { icon: 2 });
                            }
                        })
    
                    })
                }  
                // for(var i in urlArr){
                //     let str = amazonpublish_imgStr.replaceAll(":src",urlArr[i])
                //     str = str.replaceAll(":value",urlArr[i])
                //     str = str.replaceAll(":name", 'imgCbox' + index)
                //     lis += str
                // }
                // if(dom.parent().next().find("li").length + urlArr.length <= AmazonPublish_skuImgLimit){
                //     dom.parent().next().find('ul').append(lis)
                //     dom.closest('h3').find(".curImgNum").text(dom.parent().next().find("li").length);
                //     layui.form.render();
                // }else{
                //     layer.msg(`辅图已满${AmazonPublish_skuImgLimit}张，请删除后再新增`)
                // }
            }
            layui.layer.close(index)
        },
        end:function(){
            layui.layer.close(index);
        }
    })
}

// 不选择swatch图片
function cancelSwatch(dom) {
    let index = dom.parents('.amazon_publish_variant').index()
    $(`input[name=imgCbox${index}]:checked`).attr('select', false)
    $(`input[name=imgCbox${index}]:checked`).data('select', false)
    $(`input[name=imgCbox${index}]:checked`).prop('checked', false)

    layui.form.render('radio')
}

// 模板图片
function amazon_publish_addImgByTpl(dom, isNewTpl = false){
    const limit = AmazonPublish_skuImgLimit
    const existImgs = $(dom).parent().next().find("li").length
    const prodSSkus = $(dom).data('prodssku')
    if(!prodSSkus){
        return layer.msg('请填写该行的店铺SKU并点击自动补充',{icon:7})
    }else if(prodSSkus=='undefined'){
        return layer.msg('该条数据没有商品SKU,不支持该功能',{icon:7})
    }
    const params = {
        param: {prodSSkus:[prodSSkus]},
        limit,
        existImgs,
        cb: function (tplUrlList, fullImgList) {
            if (Array.isArray(tplUrlList) && tplUrlList.length) {
            const mainImgDoms = fullImgList
                .map(item => {
                    let index = $(dom).parents('.amazon_publish_variant').index()
                    let str = ''
                    if (isNewTpl) {
                        str = amazonPublish_imgData['img']['tpl'].replaceAll(/&{url}/g, item.fullImg)
                    } else {
                        str = old_amazonPublish_imgData['img']['tpl'].replaceAll(/&{url}/g, item.fullImg)
                    }
                    str = str.replaceAll(":shortName", item.shortName)
                    str = str.replaceAll(":value", item.fullImg)
                    str = str.replaceAll(":name", 'imgCbox' + index)
                    return str
                })
                .join("")
                if(isNewTpl){
                    $(dom).parent().next().find('ul').append(mainImgDoms)
                    layui.form.render();
                }else{
                    $(dom).parent().next().append(mainImgDoms)
                }
                $(dom).parent().find(".curImgNum").text($(dom).parent().next().find("li").length);
            }
        },
    }
    comPickImageTpl(params,'amazon')
}
/*layui.use结束*/


// 获取当前子sku的数据并回显
function setDetailSkuData(currentDom, currentValue) {
    let saveData = $(currentDom).find(`option[value="${currentValue}"]`).attr('sskudata')
    if (saveData) {
        saveData = JSON.parse(saveData)
        // 卖点
        $('#amazonPublishModifyAmazonTemplateForm').find('[name=sellingPointStyle1_1]').val((saveData.subBulletPoints.split("#,#")[0] || '').replaceAll("\"","&quot;"))
        $('#amazonPublishModifyAmazonTemplateForm').find('[name=sellingPointStyle1_2]').val((saveData.subBulletPoints.split("#,#")[1] || '').replaceAll("\"","&quot;"))
        $('#amazonPublishModifyAmazonTemplateForm').find('[name=sellingPointStyle1_3]').val((saveData.subBulletPoints.split("#,#")[2] || '').replaceAll("\"","&quot;"))
        $('#amazonPublishModifyAmazonTemplateForm').find('[name=sellingPointStyle1_4]').val((saveData.subBulletPoints.split("#,#")[3] || '').replaceAll("\"","&quot;"))
        $('#amazonPublishModifyAmazonTemplateForm').find('[name=sellingPointStyle1_5]').val((saveData.subBulletPoints.split("#,#")[4] || '').replaceAll("\"","&quot;"))
        // 标题
        $('#newTplSSkuTitle').val(saveData.subTitle || '')
        $('#newTplSSkuTitle').attr('data-prodpsku', saveData.prodPSku)
        //设置商品描述
        amazonPublish_amazonTemp_desc_simditor = autoSimditor('amazonPublishProdDesc', saveData.subProductDescription?.replace(/#,#/g, "<br>")); //设置描述头内容
        // 关键词
        $("#amazonPublishModifyAmazonTemplateForm input[name=tag]").tagsinput('removeAll');
        saveData.subGenericKeywords?.split(",").forEach((item, index) => {
            $("#amazonPublishModifyAmazonTemplateForm input[name=tag]").tagsinput('add', item);
        });

        // 渲染分类属性
        // if ($('#amazonPublishModifyAmazonTemplateForm').find('[name=fulfillmentCenterId]').val()) {
            let attrArr = saveData.subAttrKeyVal?.split('#,#')
            let attrList = {}
            attrArr && attrArr.forEach(item => {
                let key = item.split(':')[0]
                let value = item.split(':')[1]
                let obj = {
                    [key]: value
                }
                attrList = Object.assign(attrList, obj)
            })
            let attrkeyList = Object.keys(attrList)
            cateListResultNew.cateList?.forEach(item => {
                if (attrkeyList.includes(item.fieldName) || attrkeyList.includes(item.localLabelName)) {
                    item.defaultValue = attrList[item.fieldName] || attrList[item.localLabelName] || ''
                    item.tempValue = attrList[item.fieldName] || attrList[item.localLabelName] || ''
                } else {
                    item.defaultValue = ''
                    item.tempValue = ''
                }
            })

            layui.laytpl($("#amazonCateSpecificsNewTemp").html()).render(JSON.parse(JSON.stringify(cateListResultNew)), function (html) {
                $("#amazonPublish_editspecificForm").html(html);
            })
            
            layui.form.render();
            commonToggleAttr();
        // }
    } else {
        // 没有保存的数据 那就置空
        // 卖点
        $('#amazonPublishModifyAmazonTemplateForm').find('[name=sellingPointStyle1_1]').val('')
        $('#amazonPublishModifyAmazonTemplateForm').find('[name=sellingPointStyle1_2]').val('')
        $('#amazonPublishModifyAmazonTemplateForm').find('[name=sellingPointStyle1_3]').val('')
        $('#amazonPublishModifyAmazonTemplateForm').find('[name=sellingPointStyle1_4]').val('')
        $('#amazonPublishModifyAmazonTemplateForm').find('[name=sellingPointStyle1_5]').val('')
        // 标题
        $('#newTplSSkuTitle').val('')
        //设置商品描述
        amazonPublish_amazonTemp_desc_simditor = autoSimditor('amazonPublishProdDesc', ''); //设置描述头内容
        // 关键词
        $("#amazonPublishModifyAmazonTemplateForm input[name=tag]").tagsinput('removeAll');

        // 渲染分类属性
        // if ($('#amazonPublishModifyAmazonTemplateForm').find('[name=fulfillmentCenterId]').val()) {
        //     cateListResultNew.cateList?.forEach(item => {
        //         // item.validValues = ''
        //         item.defaultValue = ''
        //         item.tempValue = ''
        //     })
        //     $("#amazonPublish_editspecificForm").html('')
        //     layui.laytpl($("#amazonCateSpecificsNewTemp").html()).render(cateListResultNew, function (html) {
        //         $("#amazonPublish_editspecificForm").html(html);
        //     })
        //     layui.form.render();
        //     commonToggleAttr();
        // }
    }
}

function commonToggleAttr() {
    let fulfillmentCenterId = $('#AmazonTemplateForm').find('[name=fulfillmentCenterId]').val() || $('#amazonPublishModifyAmazonTemplateView').find('[name=fulfillmentCenterId]').val() 

    let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
    $.each($('.toggleClass'),function(index,obj){  //index:索引obj:循环的每个元素
        var value = $(obj).find('.labelField').html();
        if (requireVal.includes(value)) {
            if(fulfillmentCenterId == 'DEFAULT'){
                $(obj).hide()
            } else {
                $(obj).show()
            }
        }
    })
    $.each($('.testClass'),function(index,obj){  //index:索引obj:循环的每个元素
        var value = $(obj).find('.labelField').html();
        if (requireVal.includes(value)) {
            if(fulfillmentCenterId == 'DEFAULT'){
                $(obj).show()
            } else {
                $(obj).hide()
            }
        }
    })
}

// 亚马逊模板弹窗
function amazonPublishTemplateLayer(obj, listingStatus) {
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl,
        form = layui.form;
    storeId = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
    tabIdStr = $("#amazonPublishHeadTab").find(".layui-this").attr("id")
    let popIndex = layer.open({
        title: "亚马逊模板",
        type: 1,
        area: ['100%', '100%'],
        btn: tabIdStr == "toListingNum" || tabIdStr == "listingFailNum" ? ['保存','关闭'] : ['关闭'],
        id: 'amazonPublishModifyAmazonTemplate1',
        content: $('#amazonPublishModifyAmazonTemplate').html(),
        success: function (layero) {
            createSwatch = `<div style="width: 100%; display:flex;justify-content: center">
                <input type="radio" class="img-cbox" style="margin-left:-10px" name=":name" shortname=":shortName" lay-skin="primary" value=":value" lay-filter="swatchRadio" select="false"><span>设为swatch图</span></div>`
            storeTempGetAmazonTemplateData(obj, listingStatus) 
      
            //监听卖点 input输入
            layero.on('input', '[name=sellingPointStyle1_1]', function(e){
                let val = e.target.value;
                setTextLength('AmazonDetail_sellingPoint1Count', val, 'sellingPoint1_1')
            });
            layero.on('input', '[name=sellingPointStyle1_2]', function(e){
                let val = e.target.value;
                setTextLength('AmazonDetail_sellingPoint2Length', val, 'sellingPoint1_2')
            });
            layero.on('input', '[name=sellingPointStyle1_3]', function(e){
                let val = e.target.value;
                setTextLength('AmazonDetail_sellingPoint3Length', val, 'sellingPoint1_3')
            });
            layero.on('input', '[name=sellingPointStyle1_4]', function(e){
                let val = e.target.value;
                setTextLength('AmazonDetail_sellingPoint4Length', val, 'sellingPoint1_4')
            });
            layero.on('input', '[name=sellingPointStyle1_5]', function(e){
                let val = e.target.value;
                setTextLength('AmazonDetail_sellingPoint5Length', val, 'sellingPoint1_5')
            });  
            isLangEng = obj.salesSite === 'JP' ? false: true
            getAllCommisionCateRule(obj.salesSite)
            
        },
        yes: function (index, layero) {
            //全选和反全选事件
            amazonPublishcheckbox_no_all('amazonPublish_table')

            if (tabIdStr !== "toListingNum" && tabIdStr !== "listingFailNum") {
                layer.closeAll();
                return;
            }

            let productDescription = amazonPublish_amazonTemp_desc_simditor.getValue(),prodListingSubSkuAmazons = [],
                bulletPoints = $("[name=sellingPointStyle1_1]").val() + '#,#' +
                    $("[name=sellingPointStyle1_2]").val() + '#,#' +
                    $("[name=sellingPointStyle1_3]").val() + '#,#' +
                    $("[name=sellingPointStyle1_4]").val() + '#,#' +
                    $("[name=sellingPointStyle1_5]").val();
            // 保存一下当前页面的子sku数据
            let currentDom = $('#newTplSkuChoose')
            saveCreateAndDetailSkuData('newTpl', currentDom, 'save')

            let errMsg = '';
            let ifSellerPointEmpty = false
            let ifDescEmpty = false
            $("#amazonPublishModifyAmazonTemplateView").find(".amazon_publish_variant").each((index,item) => {
                let id = $(item).find('[name=prodListingSubSkuAmazonsId]').val() || ''
                if (id) {
                    var attrValDemo = $("#amazonPublishModifyAmazonTemplateView").find(".amazon_publish_variant")[0] || ''
                    var attrVal = $(attrValDemo).find('input[name=attrKeyVal]').val()
                    var priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
                    var price=$(item).find('input[name=standardPrice]').val()
                    if (!priceReg.test(price)) errMsg = "请输入正确的价格:整数或者保留两位小数";
                    //js只能输入正整数（不包括负整数和0）
                    var places =$(item).find('input[name=quantity]').val()
                    if(places && !(/(^[1-9]\d*$)/.test(places))) errMsg = "库存应为正整数";
                    let otherImageUrlArr = []
                    $(item).find(".uploadImgUL img").each((index,cItem) => {
                        if ($(cItem).attr("shortname")) {
                            otherImageUrlArr.push(imgDomain + $(cItem).attr("shortname"))
                        } else {
                            otherImageUrlArr.push($(cItem).attr("src"))
                        }
                    })
                    let mainImageUrl = $(item).find('[name=mainImg]').attr("shortname") ? imgDomain + $(item).find('[name=mainImg]').attr("shortname") : $(item).find('[name=mainImg]').attr("src")
                    let attrKeyValNew = '';
                    // "color:White#,#sizeMap:White1"
                    let swatch = $(item).find(`input[name=imgCbox${index}]:checked`).attr('value')
                    let tempId = $(item).find('input[name=prodTempId]').val()
                    if (tempId == 'undefined' ) {
                        tempId = ''
                    }
                    // 根据sku匹配到保存的数据
                    let storeSSku = $(item).find('[name=storeSSku]').text() || $(item).find('[name=prodListingSubSkuAmazonsStoreSSku]').val()
                    let saveDataObj = $('#newTplSkuChoose').find(`option[value="${id}"]`).attr('sskudata') || ''

                    // 卖点校验
                    let sellerPoint = JSON.parse(saveDataObj).subBulletPoints
                    sellerPoint?.split("#,#").forEach(function (itemPoint) {
                        if (!ifSellerPointEmpty) {
                            if (itemPoint === '' || itemPoint === undefined) {
                                ifSellerPointEmpty = true
                                layer.msg('请填写' + storeSSku + '的卖点')
                                return false
                            }
                        }
                    });
                    if (ifSellerPointEmpty) {
                        return
                    }
                    if (ifDescEmpty) {
                        return
                    }
                    // 描述校验
                    let descSub = JSON.parse(saveDataObj).subProductDescription
                    if (descSub) {
                        if (descSub.length > 2000) {
                            layer.msg(storeSSku +'描述过长,不能超过2000字符');
                            ifDescEmpty = true
                            return;
                        }
                    } else {
                        layer.msg(storeSSku + '描述不得为空');
                        ifDescEmpty = true
                        return;
                    }

                    let obj = {
                        id: $(item).find('input[name=prodListingSubSkuAmazonsId]').val(),
                        externalProductId: $(item).find('input[name=externalProductId]').val(),
                        standardPrice: $(item).find('input[name=standardPrice]').val(),
                        quantity: $(item).find('input[name=quantity]').val(),
                        storeSSku,
                        mainImageUrl:mainImageUrl,
                        otherImageUrl:otherImageUrlArr.join("|"),
                        swatchImageUrl: swatch,
                        prodSSku: $(item).find('input[name=prodSSku]').val(),

                        attrKeyVal: $(item).find('input[name=attrKeyVal]').val(),
                        externalProductIdType: $(item).find('.externalProductIdType').html(),
                        weight: $(item).find('.cskuWeight').html(),
                        prodTempId: tempId
                    }
                    
                    let newObj = {};
                    $(item).find(".tdVal").each((index,cItem)=>{
                        newObj[$(cItem).data('key')] = $(cItem).find("input").val() || $(cItem).find("span").text()
                    })

                    if (!$(item).find('input[name=attrKeyVal]').val()) {
                        let attrArr = attrVal.split('#,#')
                        let result = []
                        attrArr && attrArr.forEach(item => {
                            let key = item.split(':')[0]
                            let value = item.split(':')[1]
                            let obj = {
                                [key]: value
                            }
                            result.push(obj)
                        })
                        let newObjCopy = {...newObj}
                        if (newObjCopy.spliceString) {
                            let color = newObjCopy.spliceString.split('_')[0]
                            let size = newObjCopy.spliceString.split('_')[1]
                            newObjCopy.color = color
                            newObjCopy.size = size
                        }
                        Object.keys(newObjCopy).forEach(item => {
                            result.forEach(cItem => {
                                if (item == Object.keys(cItem)[0] || item == Object.keys(cItem)[0] + 'Value') {
                                    cItem[Object.keys(cItem)[0]] = newObjCopy[item]
                                }
                            })
                        })

                        let arr = []
                        result.forEach(item => {
                            let key = Object.keys(item)[0] || ''
                            let val = item[key]
                            if (key) {
                                let str = `${key}:${val}`
                                arr.push(str)
                            }
                        })
                        attrKeyValNew = arr.join('#,#')
                        obj.attrKeyVal = attrKeyValNew
                    }

                    obj = Object.assign(obj, newObj)
                    if (saveDataObj) {
                        let subAttrKeyVal = saveDataObj ? JSON.parse(saveDataObj).subAttrKeyVal : ''
                        if ($("#amazonPublishModifyAmazonTemplateView select[name=fulfillmentCenterId]").val() == 'DEFAULT') {
                            let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
                            let subAttrList = []
                            subAttrList = subAttrKeyVal?.split('#,#')?.filter(item => {
                                let key = item?.split(':')[0] || ''
                                return !requireVal.includes(key)
                            })
                            subAttrKeyVal = subAttrList?.join('#,#');
                        }
                        let saveCopyData = Object.assign({}, JSON.parse(saveDataObj))
                        saveCopyData.subAttrKeyVal = subAttrKeyVal
                        obj = Object.assign(obj, saveCopyData)
                    }
                    prodListingSubSkuAmazons.push(obj)
                }
            })

            if(errMsg != ''){
                return layer.msg(errMsg);
            }
            if (ifSellerPointEmpty) {
                return false
            }
            if (ifDescEmpty) {
                return false
            }

            let attrKeyVal = ''
            let paramsArr = []
            let keyArr = []
            let fulfillmentCenterId = $("#amazonPublishModifyAmazonTemplateView select[name=fulfillmentCenterId]").val()
            let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
            $.each($('#amazonPublish_editspecificForm .layui-form-item'), function(index, obj) {
                let salesSite = $("#salesSite").val()
                let key = $(obj).find('.labelField').html()
                let requireClass = $(obj).find('.layui-form-label').parent().hasClass('requireEle')
                let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
                if (fulfillmentCenterId === 'DEFAULT' && requireClass) {
                    if (requireVal.includes(key)) {
                        value = ''
                    }
                }
                if (value) {
                    keyArr.push(key)
                    let contennt = `${key}:${value}`
                    paramsArr.push(contennt)
                }
            })
            attrKeyVal = paramsArr.join('#,#')

            let flag = false
            let requreKeyList = []
            $.each($('.toggleClass'),function(index,obj) {  
                let key = $(obj).find('.labelField').html();
                let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
                if (fulfillmentCenterId === 'DEFAULT') {
                    if (requireVal.indexOf(key) > -1) {
                        key = ''
                    }
                }
                requreKeyList.push(key)
                if (key && !value) {
                    flag = true
                } 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            })
            let currentSsku = $('#newTplSkuChoose').val() || ''
            if (flag) {
                layer.msg(currentSsku + "必填的分类属性未填写！")
                return
            }
            // 如果当前页面sku的分类属性都填写完 那么将剩余的子sku和当前页面的进行比对
            // 只要必填的key存在就可以
            let ifAttrKeyValEmpty = false
            requreKeyList = requreKeyList.filter(item => item !== '')
            newTplSkuChooseOptionList?.forEach(item => {
                if (!ifAttrKeyValEmpty) {
                    let saveDataObj = $('#newTplSkuChoose').find(`option[value="${item.value}"]`).attr('sskudata')
                    let subAttrKeyVal = JSON.parse(saveDataObj).subAttrKeyVal
                    let valList = subAttrKeyVal?.split('#,#')?.map(item => item.split(':')[0])
                    subAttrKeyVal?.split('#,#')?.forEach(cItem => {
                        let key = cItem?.split(':')[0] || ''
                        requreKeyList?.forEach(i => {
                                if (!ifAttrKeyValEmpty) {
                                    if (!valList?.includes(i)) {
                                        ifAttrKeyValEmpty = true
                                        layer.msg(item.value + "必填的分类属性未填写！")
                                    }
                                }
                            })
                    })
                }
            })

            if (ifAttrKeyValEmpty) {
                return false
            }

            // 标题：itemName、卖点：bulletPoints、描述：productDescription、价格：prodListingSubSkuAmazons
            let data ={"id":$("#amazonPublishModifyAmazonTemplateView input[name=amazonNewPublishId]").val(),
                "itemName":$("#amazonPublishModifyAmazonTemplateView input[name=itemName]").val(),
                "fulfillmentCenterId":$("#amazonPublishModifyAmazonTemplateView select[name=fulfillmentCenterId]").val(),
                "bulletPoints":bulletPoints,
                'genericKeywords':$("#amazonPublishModifyAmazonTemplateView input[name=tag]").val(),
                "productDescription":productDescription,
                "prodListingSubSkuAmazons":prodListingSubSkuAmazons,
                "attrKeyVal": attrKeyVal,
                "shippingType": $('#shippingType_detail').find('[name=shippingType]').val()
            }
            commonReturnPromise({
                type: 'post',
                url: ctx + `/amazonListing/planPublishSaveDetail`,
                contentType: 'application/json',
                params: JSON.stringify(data)
            }).then(() => {
                layer.closeAll()
                layer.msg('保存成功', { icon: 1 })
                amazonPublish_searchProd()
            }).catch(err => layer.alert(err, { icon: 2 }))
        }
    })
}

function amazonPublish_subsku_regenerate(dom, type, flag=false) {
    let typeDom = flag ? $(dom).parents('td').next().next().find('input[name=externalProductId]') : $(dom).parents('td').find('input[name=externalProductId]')
    commonReturnPromise({
        type: 'post',
        url: ctx + '/amazonListing/reFreshProductId.html',
        params: {
            type: (type == 'undefined' || !type) ? '' : type, 
            salesSite: $('#salesSite').val() || $("#AmazonTemplateForm .salesSite").val()
        }
    }).then(data => {
        typeDom.val(data)
    }).catch(err => layer.alert(err, { icon: 2 }))
}

// 更新利润率
function amazonPublish_updateProfitRate(dom,countryType){
    const formDom = $(dom).parents('form')
    const trDom = $(dom).parents('tr')
    const tableDom =  $(dom).parents('table')
    let country = ''
    if(countryType ==='select'){
        country = formDom.find('select[name=salesSite] option:selected').text()
    }else{
       const countrycode = formDom.find('input[name=salesSite]').val()
       amazonSalesSitesData.forEach(function (value, key) {
         if (key== countrycode) {
            country = value
        }
    })
    }
    const params = {
        fbaPlatCommisionRuleId: tableDom.find('select[name=fbaPlatCommisionRuleId]').val(),
        priceLogisticsAttr: formDom.find('input[name=logisAttrList]').val(),
        fbaProdList: [{
            sSku: trDom.find('input[name=prodSSku]').val(),
            cost: trDom.find('input[name=purchaseCostPrice]').val(),
            weight: trDom.find('input[name=weight]').val(),
            deliverLength: trDom.find('input[name=outerBoxLength]').val(),
            deliverWidth: trDom.find('input[name=outerBoxWidth]').val(),
            deliverHeight: trDom.find('input[name=outerBoxHeight]').val(),
            priceList:[{
                country,
                preListingPrice:  trDom.find('input[name=standardPrice]').val()
            }]
        }],
        listingPage: true
    }
    commonReturnPromise({
        url: '/lms/preProdDev/preCountProfit.html',
        type: 'post',
        contentType: 'application/json',
        params: JSON.stringify(params)
    }).then(res=>{
        const { firstLogisticsFee, fbaCharge, airTransportProfitRate, airDeliveryProfitRate, seaTransportProfitRate } = res.fbaProdList[0].priceList[0]
        const currency = trDom.find('input[name=currency]').val() || ''
        ![undefined, null].includes(fbaCharge) && trDom.find('.fbaCharge').text(fbaCharge + currency)
        ![undefined, null].includes(firstLogisticsFee) && trDom.find('.firstLogisticsFee').text(firstLogisticsFee)
        ![undefined, null].includes(airTransportProfitRate) && trDom.find('.airTransportProfitRate').text(airTransportProfitRate + '%')
        ![undefined, null].includes(airDeliveryProfitRate) && trDom.find('.airDeliveryProfitRate').text(airDeliveryProfitRate + '%')
        ![undefined, null].includes(seaTransportProfitRate) && trDom.find('.seaTransportProfitRate').text(seaTransportProfitRate + '%')
        layer.msg('操作成功',{icon:1})
    })
}

// 转换成inch
function tranferToInch(el) {
    let lengthVal = $(`#${el} input[name=package_length]`).val()
    let heightVal = $(`#${el} input[name=package_height]`).val()
    let widthVal = $(`#${el} input[name=package_width]`).val()
    let length = lengthVal ? (lengthVal * 0.3937).toFixed(2) : lengthVal
    let height = heightVal ? (heightVal * 0.3937).toFixed(2) : heightVal
    let width = widthVal ? (widthVal * 0.3937).toFixed(2) : widthVal
    $(`#${el} input[name=package_length]`).val(length)
    $(`#${el} input[name=package_height]`).val(height)
    $(`#${el} input[name=package_width]`).val(width)
}
// 转换成cm
function tranferToCm(el) {
    let lengthVal = $(`#${el} input[name=package_length]`).val()
    let heightVal = $(`#${el} input[name=package_height]`).val()
    let widthVal = $(`#${el} input[name=package_width]`).val()
    let length = lengthVal ? (lengthVal / 0.3937).toFixed(2) : lengthVal
    let height = heightVal ? (heightVal / 0.3937).toFixed(2) : heightVal
    let width = widthVal ? (widthVal / 0.3937).toFixed(2) : widthVal
    $(`#${el} input[name=package_length]`).val(length)
    $(`#${el} input[name=package_height]`).val(height)
    $(`#${el} input[name=package_width]`).val(width)
}
function tranferToOz(el) {
    let wweightVal = $(`#${el} input[name=package_weight]`).val()
    let weight = wweightVal ? (wweightVal * 0.035274).toFixed(2) : wweightVal
    $(`#${el} input[name=package_weight]`).val(weight)
}

function tranferToG (el) {
    let wweightVal = $(`#${el} input[name=package_weight]`).val()
    let weight = wweightVal ? (wweightVal * 28.3495).toFixed(2) : wweightVal
    $(`#${el} input[name=package_weight]`).val(weight)
}

function amazonPublish_subsku_empty(dom, id) {
    let typeDom = $(dom).parents('td').find('input[name=externalProductId]')
    commonReturnPromise({
        type: 'put',
        url: ctx + `/amazonListing/setUPCNull/${id}`,
    }).then(() => {
        typeDom.val('')
    }).catch(err => layer.alert(err, { icon: 2 }))
}

function amazonPublish_subsku_save(dom, id) {
    var parentTr = $(dom).parents('tr')
    // 正确的价格:整数或者保留两位小数
    var priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
    var price=parentTr.find('input[name=standardPrice]').val()
    if (!priceReg.test(price)) return layer.msg("请输入正确的价格:整数或者保留两位小数")
    //js只能输入正整数（不包括负整数和0）
    var places =parentTr.find('input[name=quantity]').val()
    if(places && !(/(^[1-9]\d*$)/.test(places))) return layer.msg("库存应为正整数");
    let obj = {
        id: id,
        externalProductId: parentTr.find('input[name=externalProductId]').val(),
        standardPrice: parentTr.find('input[name=standardPrice]').val(),
        quantity: parentTr.find('input[name=quantity]').val(),
    }
    let prodListingSubSkuAmazons = [].concat(obj)
    commonReturnPromise({
        type: 'post',
        url: ctx + `/amazonListing/editListingDetailWithTemplate`,
        contentType: 'application/json',
        params: JSON.stringify({ prodListingSubSkuAmazons }),
    }).then(() => {
        layer.msg('保存成功', { icon: 1 })
    }).catch(err => layer.alert(err, { icon: 2 }))
}

// 亚马逊模板数据回显
function storeTempGetAmazonTemplateData(obj, listingStatus) {
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl,
        form = layui.form,
        table = layui.table;
    storeId = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
    getDataAmazonPublishQueryTemplateDetailByProdPId(obj).then(function (data) {
        // 基础数据
        let returnData = {}
        returnData.pSku = obj.pSku
        returnData.cateTreeName = data.cateTreeName
        returnData.titleLimitRemark = data.titleLimitRemark;
        returnData.sellingPointStyle1_1 = (data.bulletPoints.split("#,#")[0] || '').replaceAll("\"","&quot;")
        returnData.sellingPointStyle1_2 = (data.bulletPoints.split("#,#")[1] || '').replaceAll("\"","&quot;")
        returnData.sellingPointStyle1_3 = (data.bulletPoints.split("#,#")[2] || '').replaceAll("\"","&quot;")
        returnData.sellingPointStyle1_4 = (data.bulletPoints.split("#,#")[3] || '').replaceAll("\"","&quot;")
        returnData.sellingPointStyle1_5 = (data.bulletPoints.split("#,#")[4] || '').replaceAll("\"","&quot;")
        returnData.salesSite = data.salesSite
        returnData.fullCateName = data.fullCateName
        returnData.tempFileName = data.tempFileName
        returnData.id = data.id
        returnData.itemName = data.itemName.replaceAll("\"","&quot;")
        returnData.fulfillmentCenterId = data.fulfillmentCenterId
        returnData.tortBrand = data.tortBrand
        returnData.upcExemptionFlag = data.upcExemptionFlag
        returnData.logisAttrList = data.logisAttrList
        // 年利率
        returnData.grossProfitRate = data.grossProfitRate
        // 变种参数
        returnData.prodListingSubSkuAmazons = (data.prodListingSubSkuAmazons || []).map(item=>({...item, listingStatus}))
        imgDomain = data.imgDomain
        // variation theme table
        returnData.varietionThemeTable = data.variationTheme && data.variationTheme.indexOf("#,#") != -1 ? data.variationTheme.split("#,#")[1].split("||") : ''
        themeTableVal = returnData.varietionThemeTable;
        // 分类属性
        let lazadaPublishFlag = 0, requiredIndex;
        let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
        data.cateList.forEach((item, index) => {
            
            if (!item.required && !lazadaPublishFlag) {
                lazadaPublishFlag = 1
                requiredIndex = index
            }
            if (requiredIndex && index >= requiredIndex) {
                item.required = false
            }
            if (requireVal.indexOf(item.fieldName) > -1) {
                item.required = true
                item.test = true
            }
            if(item.tempValue){
                item.defaultValue = item.tempValue
            }
        })
        returnData.cateList = data.cateList
        cateListResultNew = Object.assign({}, data)
        // 渲染模板--start

        getFulfillmentCenterId({
            categoryId:returnData.cateList[0].categoryId,
            fullCateName:returnData.fullCateName,
            salesSite:returnData.salesSite,
            storeAcctId: storeId
        }).then(res=>{
            returnData['getAllCommisionCateRuleData'] = getAllCommisionCateRuleData;
            returnData['fbaPlatCommisionRuleId'] = defaultFbaPlatCommisionRuleId;
            returnData.fulfillmentCenterIdData = res
            returnData.subSkuMaxImgLimit=AmazonPublish_skuImgLimit
            returnData.itemName = returnData.itemName.replaceAll("\"","&quot;")
            // 若详情接口返回仓库只有一个，默认按照返回的仓库显示分类属性
            // 若详情接口返回仓库为两个及以上，默认按照detail接口返回的仓库显示分类属性
            if (returnData.fulfillmentCenterIdData?.length  === 1) {
                returnData.fulfillmentCenterId = returnData.fulfillmentCenterIdData[0]
            }
            
            laytpl($("#amazonPublishModifyAmazonTemplateContainer").html()).render(returnData, function (html) {
                $("#amazonPublishModifyAmazonTemplateView").html(html);
                commonAddEventTitleToggle($('#amazonPublishModifyAmazonTemplate1'), 'amazon')
                form.render("select");

                laytpl($("#amazonCateSpecificsNewTemp").html()).render(returnData, function (html) {
                    $("#amazonPublish_editspecificForm").html(html);
                })
                if (returnData.fulfillmentCenterId === 'DEFAULT') {
                    $('#grossProfitRateNewTemp').show()
                } else {
                    $('#grossProfitRateNewTemp').hide()
                }
                
                let amazonPublishVariationTheme;
                
                data.variationTheme ? (data.variationTheme.indexOf("#,#") != -1 ? amazonPublishVariationTheme = data.variationTheme.split("#,#")[0] : amazonPublishVariationTheme = data.variationTheme) : amazonPublishVariationTheme = '';
                $("input[name=lazadaPublishVariationTheme]").val(amazonPublishVariationTheme)

                //设置商品描述
                amazonPublish_amazonTemp_desc_simditor = autoSimditor('amazonPublishProdDesc', data.productDescription.replace(/#,#/g, "<br>")); //设置描述头内容
                $("#amazonPublishModifyAmazonTemplateForm input[name=tag]").tagsinput();
                data.genericKeywords.split(",").forEach((item, index) => { // 这里使用了tagsinput的样式
                    $("#amazonPublishModifyAmazonTemplateForm input[name=tag]").tagsinput('add', item);
                });

                let spanTextLengthDom= $('#amazonPublishModifyAmazonTemplateView #amazonPublishModifyAmazonTemplate_titleLength');
                //监听一下标题input的输入
                $('#amazonPublishModifyAmazonTemplateView input[name=itemName]').on('input', function(e){
                    let val = e.target.value;
                    spanTextLengthDom.text(val.length);
                    if(val.length > 150){
                      spanTextLengthDom.addClass('redTitle').removeClass('greenTitle');
                    }else{
                      spanTextLengthDom.addClass('greenTitle').removeClass('redTitle');
                    }
                });     
                if (returnData.fulfillmentCenterId && returnData.fulfillmentCenterId !== 'DEFAULT') {
                    // fba仓库
                    $('#shippingType_detail').show()     
                    $('#shippingType_detail').find('[name=shippingType]').val(String(data.shippingType))
                    form.render('select')
                }     
                // 展示子标题和类目属性
                if (data.prodListingSubSkuAmazons?.length > 0) {
                    $('#newTplSSkuTitleBox').show()
                    $('#newTplSkuAttr').show()
                    newTplSkuInfoList = data.prodListingSubSkuAmazons
                    // 根据生成的子 sku 数据 填充 newTplSkuChoose 下拉框
                    newTplSkuChooseOptionList = data.prodListingSubSkuAmazons?.map(item => {
                        if (item.storeSSku) {
                            return {
                                value: item.id,
                                label: item.storeSSku
                            }
                        }
                    })
                    appendSelect($('#newTplSkuChoose'), newTplSkuChooseOptionList, 'value', 'label')
                    // 给每一项添加保存数据
                    newTplSkuInfoList.forEach(item => {
                        let saveObj = {
                            subTitle: item.subTitle || '',
                            subBulletPoints: item.subBulletPoints || '',
                            subProductDescription: item.subProductDescription || '',
                            subGenericKeywords: item.subGenericKeywords || '',
                            subAttrKeyVal: item.subAttrKeyVal || '',
                            prodPId: obj.prodPId,
                            prodPSku: obj.pSku
                        }
                        $('#newTplSkuChoose').find(`option[value="${item.id}"]`).attr('sskudata', JSON.stringify(saveObj))
                    })
                    // 默认选择第一项
                    $('#newTplSkuChoose').val(newTplSkuChooseOptionList[0].value || '')
                    // 页面显示第一项的数据
                    let currentDom = $('#newTplSkuChoose')
                    setDetailSkuData(currentDom, newTplSkuChooseOptionList[0].value) 
                    newTplPreval = newTplSkuChooseOptionList[0].value || ''
                    form.render('select')
                }
                
            });
            laytpl($("#prodListingSubTable").html()).render(returnData, function(html){
                $('#amazonPublishSkuTable').html(html)
                const _fulfillmentCenterId = $("#amazonPublishModifyAmazonTemplateView select[name=fulfillmentCenterId]").val()
                    // upcExemptionFlag为false（店铺无UPC豁免），展示UPC/EAN、product_id列
                if(data.upcExemptionFlag){
                    $('#amazonPublishSkuTable').find('.upcExemptionFlag').each(function(){
                        $(this).hide()
                    })
                }
                if(_fulfillmentCenterId === 'DEFAULT'){
                    $('#amazonPublishSkuTable').find('.fulfillmentCenterId').each(function(){
                        $(this).hide()
                    })
                }else{
                    $('#amazonPublishSkuTable').find('.notFulfillmentCenterId').each(function(){
                        $(this).hide()
                    })
                }
                //全选和反全选事件
                deletecheckbox_no_all('amazonPublishSkuTable')
                form.render('select');
                form.render('checkbox');
            });

            $("#amazonPublishModifyAmazonTemplateForm").find(".amazon_publish_variant").each((index,item) => {
                let url = data.prodListingSubSkuAmazons[index]?.swatchImageUrl
                $(item).find(`input:radio`).attr('name','imgCbox'+index)
                $(item).find(`input:radio[value='${url}']`).prop('checked','checked')
                $(item).find(`input:radio[value='${url}']`).attr('select', true)
                $(item).find(`input:radio[value='${url}']`).data('select', true)
                // form.render('radio');
            })
            form.render('radio');
            
            $('#AmazonDetail_sellingPoint1Count').text(returnData.sellingPointStyle1_1?.length || 0)
            $('#AmazonDetail_sellingPoint2Count').text(returnData.sellingPointStyle1_2?.length || 0)
            $('#AmazonDetail_sellingPoint3Count').text(returnData.sellingPointStyle1_3?.length || 0)
            $('#AmazonDetail_sellingPoint4Count').text(returnData.sellingPointStyle1_4?.length || 0)
            $('#AmazonDetail_sellingPoint5Count').text(returnData.sellingPointStyle1_5?.length || 0)

            $.each($('.toggleClass'),function(index, obj){  //index:索引obj:循环的每个元素
                var value = $(obj).find('.labelField').html();
                if (requireVal.includes(value)) {
                    if(returnData.fulfillmentCenterId == 'DEFAULT'){
                        $(obj).hide()
                    } else {
                        $(obj).show()
                    }
                }
            })
            $.each($('.testClass'),function(index,obj){  //index:索引obj:循环的每个元素
                var value = $(obj).find('.labelField').html();
                if (requireVal.includes(value)) {
                    if(returnData.fulfillmentCenterId == 'DEFAULT'){
                        $(obj).show()
                    } else {
                        $(obj).hide()
                    }
                }
            })
            if (tabIdStr !== "toListingNum" && tabIdStr !== "listingFailNum") {
                let inputList = $('#amazonPublishModifyAmazonTemplateForm').find('input')
                let selectList = $('#amazonPublishModifyAmazonTemplateForm').find('select')
                let simditorList = $('#amazonPublishModifyAmazonTemplateForm').find('.simditor-body')
   
                inputList.each((index, item) => {
                    $(item).attr('disabled', 'disabled')
                })
                selectList.each((index, item) => {
                    $(item).attr('disabled', 'disabled')
                })
                simditorList.each((index, item) => {
                    $(item).attr('contenteditable', 'false')
                })
                // 复选框 和 定价不disabled
                $('#allBoxNewTemp').attr('disabled', false)
                $('#amazonPublishSkuTable').find('.pid-cbox')?.each((index, item) => {
                    $(item).attr('disabled', false)
                })
                $('#grossProfitRateNewTemp').find('[name=grossProfitRate]').attr('disabled', false)

                form.render()
            }
            isNeedChangeLang(returnData.salesSite)
             
            // 仓库下拉框详情初始不选default 则下面子sku表格title加'FBA'
            isDefault = returnData.fulfillmentCenterId === 'DEFAULT'? true : false
            $('.amazon_publish_variant').each(function(index, item) {
                let fulfillmentDom = $(item).find('.basicInfo')
                if(isDefault){
                    $(fulfillmentDom).each(function(cIdx, cItem) {
                        let text = $(cItem).text()
                        if(text.startsWith("FBA")){
                            $(cItem).html(text.substring(3))
                        }
                    })  
                }else{
                    $(fulfillmentDom).each(function(cIdx, cItem) {
                        let text = $(cItem).text()
                        if(!text.startsWith("FBA")){
                            $(cItem).html("FBA" + text)
                        }
                    })
                }
            })

            
        })// 渲染模板--end


        layui.use(['form','upload'],function(){
            var $ = layui.jquery,upload = layui.upload;
            upload.render({
                elem: '.amazonpublish_uploadPic'
                ,url: ctx + "/prodTpl/uploadPic.html" //此处配置你自己的上传接口即可
                ,multiple: false
                ,done: function(res){
                    //上传完毕
                    if(res.code == "0000"){
                        let amazonpublish_imgStr = amazonpublish_imgStr_left + createSwatch + amazonpublish_imgStr_right
                        if(_picThis.parent().next().find("li").length<AmazonPublish_skuImgLimit){
                            let index = _picThis.parents('.amazon_publish_variant').index()
                            let lis = amazonpublish_imgStr.replaceAll(":src",res.msg)
                            lis = lis.replaceAll(":value", res.msg)
                            lis = lis.replaceAll(":name", 'imgCbox' + index)
                            _picThis.parent().next().find("ul").append(lis)
                            _picThis.closest('h3').find(".curImgNum").text(_picThis.parent().next().find("li").length);
                            layui.form.render();
                        }else{
                            layer.msg(`辅图已满${AmazonPublish_skuImgLimit}张，请删除后再新增`)
                        }
                    }else{
                        layer.alert(res.msg,{icon:2})
                    }
                }
            });
        });

    }).catch(err => {
        console.log('err', err)
        layer.alert(err || "error", { icon: 2 })})
}

var isLangType = ''
// 判断站点是否需要切换语言
function isNeedChangeLang(site) {
    commonReturnPromise({
        url: `/lms/amazonListing/getLanguageBySiteId?siteId=${site}`,
        type: 'get',
    }).then(res => {
        isLangType = res
    })
}

// 切换语言 英文和本地语言切换
$(document).on("click", "#publish_toogleLangBtn", function () {
    if (isLangType === 'en') return
    isLangEng = !isLangEng
    changeLang()
    
})

function changeLang() {
    $('.amazonCateSpecifics').find('.layui-form-item label').each((index, item) => {
        if (isLangEng) {
            $(item).html($(item).attr('data-eng'))    
        } else { 
            $(item).html($(item).attr('data-local'))
        }
    })
    $('#optionValue').find('.layui-form-item label').each((index, item) => {
        if (isLangEng) {
            $(item).html($(item).attr('data-eng'))    
        } else { 
            $(item).html($(item).attr('data-local'))
        }
    })
}

// 更多选填属性
$(document).on("click", "#publish_moreAttrBtn", function () {
    $("#publish_moreAttrBtn").parent().next().toggle()
})

// 获取映射oa属性数据接口
// variationTheme:
function getDataAmazonPublishGetAmzAttrByVariationTheme(variationTheme) {
    return commonReturnPromise({
        url: `/lms/amazonPublishModel/getAmzAttrByVariationTheme`,
        type: 'get',
        contentType: 'application/json',
        params: {
            "prodPId": $("input[name=storeTemplateBaseId]").val(),
            "variationTheme": variationTheme
        }
    })
}

// 查看亚马逊模板数据回显
function getDataAmazonPublishQueryTemplateDetailByProdPId(obj) {
    return commonReturnPromise({
        url: `/lms/amazonListing/planPublishDetail`,
        type: 'POST',
        contentType: 'application/json',
        params: JSON.stringify(obj)
    })
}
// type:1:商品模板，2：亚马逊模板
function amazonPublish__layer_amazon(id, type, prodPId, categoryId, salesSite, pSku, listingStatus) {
    storeAcctVal = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
    if (type == 1) {
        var listingStatus = $("#amazonPublish_searchForm input[name=listingStatus]").val();
        amazonPublish_getlistingDetail(id)
    } else {
        amazonPublishTemplateLayer({
            "id": id,
            "prodPId": prodPId,
            "categoryId": categoryId,
            "salesSite": salesSite,
            "pSku": pSku,
        },listingStatus)
    }
}



// 表格列数据
let cols = {
    amazonPublishTempTableCol: [
        //亚马逊模板表头
        [{ type: "checkbox", class: 'pid-cbox', width: 25, style: "vertical-align: top;" }, {
            title: '图片',
            templet: '<div><img class="img_show_hide lazy b1" width="61" height="61" data-original="{{ d.pimg }}!size=60x60" data-onerror="layui.admin.img_noFind()"></div>',
            width: 80
        }, {
            field: 'fullCateName',
            title: '亚马逊类目',
            width: 170
        }, {
            field: 'enTitle',
            title: '英文标题',
            width: 170,
        }, {
            field: 'bizzOwner',
            title: '开发专员',
            width: 100
        }, {
            field: 'psku',
            title: '父SKU',
        }, {
            title: "<div style='width:50px;float: left;'></div><div style='width:150px;float: left;'>子SKU</div>" +
                "<div style='width:80px;float: left;'>颜色</div> " +
                "<div style='width:80px;float: left;'>尺寸</div> " +
                "<div style='width:80px;float: left;'>在售</div> " +
                "<div style='width:80px;float: left;'>可用/在途/未派</div> ",
            width: 530,
            templet: '#amazonPublishSsku'
        }, {
            field: 'salesSite',
            title: '站点',
        }, {
            field: 'creator',
            title: '创建人',
        }, {
            field: '',
            title: '销量',
            templet: function (d) {
                return `<div>亚马逊：${d.amazonSalesNum|| 0}<br>
                          公司：${d.compSalesNum|| 0}<br>
                          虾皮：${d.shopeeSalesNum|| 0}</div>`
            }
        }, {
            field: 'createTime',
            title: '时间',
            width: 200,
            templet: function (d) {
                return `<div style="text-align:left"><span>创建：</span><span>${Format(d.createTime || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>`
            }
        }, {
            title: '操作',
            templet: '#amazonPublishAmazonOption'
        }]
    ],
    amazonPublishToFileTableCol: [
        //待生成文件表头
        [{ type: "checkbox", width: 25, style: "vertical-align: top;" }, {
            title: '图片',
            templet: '<div><img class="img_show_hide lazy b1" width="61" height="61" data-original="{{ d.pImg }}!size=60x60" data-onerror="layui.admin.img_noFind()"></div>',
            width: 80
        }, {
            field: '',
            title: '标题',
        }, {
            field: '',
            title: '父SKU',
        }, {
            field: '',
            title: '店铺父SKU',
        }, {
            title: "<div style='width:150px;float: left;'>子SKU</div>" +
                "<div style='width:80px;float: left;'>颜色</div> " +
                "<div style='width:80px;float: left;'>尺寸</div> " +
                "<div style='width:80px;float: left;'>在售</div> ",
            width: 450,
            templet: '#amazonPublishSsku'
        }, {
            field: '',
            title: '可用/在途/未派',
            templet: ''
        }, {
            field: 'createTime',
            title: '时间',
            width: 200,
            templet: function (d) {
                return `<div><span>创建：</span><span>${Format(d.createTime || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>`
            }
        }, {
            title: '操作',
            templet: '#amazonPublishAmazonOption'
        }]
    ],
    amazonOperatelogCol: [
        [{
            title: '时间',
            templet: function (d) {
                return `<div style="text-align:center"><span>${Format(d.createTime || "", 'yyyy-MM-dd hh:mm:ss')}</span></div>`
            },
            width: 150
        }, {
            field: 'creator',
            title: '操作人',
            width: 120
        }, {
            field: 'operDesc',
            title: '字段',
            width: 200
        }, {
            field: 'origData',
            title: '原值'
        },{
            field: 'newData',
            title: '修改值'
        }]
    ]
}

function amazonPublishTableRender() {
    var table = layui.table,
        $ = layui.$

    $('#amazonPublish_table').html(template('amazonPublish_tpl_tableRender'));
    let data = amazonPublish_getSearchData()
    data.listingStatus = ''

    var tableIns = table.render({
        elem: "#amazonPublishTable",
        method: 'post',
        url: ctx + `/amazonListing/queryPageByAmazonTemplate`,
        where: data,
        contentType: 'application/json',
        cols: cols.amazonPublishTempTableCol,
        id: "amazonPublishTable",
        page: true,
        limits: [20, 50, 100],
        limit: 100,
        done: function (res, curr, count) {
            imageLazyload();
            $('#amazon_publish #amazonPublishTemp').text(`亚马逊模板(${count})`)
            $("#amazonPublish_pagination").hide()
        }
    });
}

function genAmazonListingDetailTpl(laytpl, $, returnData, layero) {
    console.log('returnData', returnData)
    returnData['getAllCommisionCateRuleData'] = getAllCommisionCateRuleData;
    returnData['fbaPlatCommisionRuleId'] = defaultFbaPlatCommisionRuleId;
    laytpl($("#amazonPulish_listDetailTpl").html()).render(returnData, function (html) {
        $(layero).find('.layui-layer-content').html(html);
        $('input[data-role="tagsinput"]').tagsinput();
        var arr = $('#amazonPublish_editDetailForm .amazonSubImg_UL');
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                $(arr[i]).sortable({
                    containment: "parent",
                    cursor: "move",
                });
            }
        }
        
        commonAddEventTitleToggle($('#amazonPublish_editDetailForm'), 'amazon')
        //类目绑定
        $('#amazonPublish_cateItem_btn').on('click', function () {
            var siteCode = $("#amazonPublish_searchForm select[name=salesSite]").val();
            if (siteCode) {
                layui.admin.itemCat_select('layer-publishs-amazon-publish2',
                    'LAY-publishs-amazon-publish-hidden2',
                    'LAY-publishs-amazon-publish-div2',
                    "/amazon/getAmazonCateList.html?siteId=" + siteCode,
                    "/amazon/searchAmazonCate.html?siteId=" + siteCode
                );
            } else {
                layer.msg("必须先选择店铺");
            }
        });
        //本地图片绑定
        $("#amazonPublish_SubSkuInfo .amazonPublish_extPic_edit_local").each(function () {//初始化本地按钮
            amazonPublish_extPic_exchangeLocal($(this), 'isOldDetail');
        });
    });

    //设置刊登描述
    amazonPublish_Info_desc_simditor = autoSimditor('amazonPublish_Info_desc', returnData.prodListingAmazon.productDescription); //设置描述头内容
    //
    $("#amazonPublish_editDetailForm select[name=tempFileName]").empty();
    $("#amazonPublish_editDetailForm select[name=tempFileName]").append(`<option value=""></option>`);
    for (var i = 0; i < amazonTempFileList.length; i++) {
        $("#amazonPublish_editDetailForm select[name=tempFileName]")
            .append(`<option value="` + amazonTempFileList[i].name + `">` + amazonTempFileList[i].desc + `</option>`);
    }
    $("#amazonPublish_editDetailForm select[name=tempFileName]").val(returnData.prodListingAmazon.tempFileName);

    //设置卖点
    var bulletTplaamazon = '<div class="layui-input-block" >\n' +
        '                <input type="text" id="#amazonPublish_bulletPoint_num#" value="" lay-verify="required"\n' +
        '                       class="layui-input">\n' +
        '              </div>'
    $("#bulletPoint_Id").empty();

    var bulletPointNum = 0;
    var bullList = [];
    if (returnData.prodListingAmazon.bulletPoints) {
        bulletPointNum = returnData.prodListingAmazon.bulletPoints.split("#,#").length;
        bullList = returnData.prodListingAmazon.bulletPoints.split("#,#");
    }
    for (var i = 0; i < 5; i++) {
        if ((i + 1) <= bulletPointNum) {
            $("#bulletPoint_Id")
                .append(bulletTplaamazon.replace("#amazonPublish_bulletPoint_num#", "amazonPublish_bulletPoint_" + i));
            $("#amazonPublish_bulletPoint_" + i).val(bullList[i]);
        } else {
            $("#bulletPoint_Id")
                .append(bulletTplaamazon.replace("#amazonPublish_bulletPoint_num#", "amazonPublish_bulletPoint_" + i));
        }
    }


    var attrKeyValInfo = "";
    if (returnData.prodListingAmazon.attrKeyVal) {
        returnData.prodListingAmazon.attrKeyVal.split("#,#").forEach(function (keyVal) {
            if (attrKeyValInfo) {
                attrKeyValInfo += "\n" + keyVal;
            } else {
                attrKeyValInfo = keyVal;
            }
        })
    }

    $("#amazonPublish_editDetailForm select[name=tempFileName]").val(returnData.prodListingAmazon.tempFileName);

    $("#amazonPublish_editDetailForm textarea[name=attrKeyVal]").val(attrKeyValInfo);
    layui.form.render('select');

    var listingStatus = $("#amazonPublish_searchForm input[name=listingStatus]").val();
    if (0 == listingStatus || 2 == listingStatus) {
        $('.addAmazonSubListing').removeClass("disN");
    }
    else {
        $('.addAmazonSubListing').addClass("disN");
    }
    //设置数量
    var skuImgNum = 0;
    $("#amazonPublish_editDetailForm .img_ssku_uri").each(function () {
        if ($(this).text()) {
            skuImgNum++;
        }
    });
    $("#amazonPublish_editDetailForm #sSkuImgNum").text(skuImgNum);
    // 通过是直邮还是FBA,有无UPC展示不同的列
    if(returnData.upcExemptionFlag){
        $('#listingInfo_sub_tab').find('.upcExemptionFlag').each(function(){
            $(this).hide()
        })
    }
    // 
    if(returnData.prodListingAmazon.fulfillmentCenterId ==='DEFAULT' && returnData.fulfillmentCenterIdData[0]==='DEFAULT'){
        $('#listingInfo_sub_tab').find('.fulfillmentCenterId').each(function(){
            $(this).hide()
        })
    }else{
        $('#listingInfo_sub_tab').find('.notFulfillmentCenterId').each(function(){
            $(this).hide()
        })
    }
}

//已生成的详情框
function amazonPublish_getlistingDetail(id) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form,
        _this = this
    storeId = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
    tabIdStr = $("#amazonPublishHeadTab").find(".layui-this").attr("id")
    layer.open({
        type: 1,
        title: '产品详情',
        btn:  tabIdStr == "toListingNum" || tabIdStr == "listingFailNum" ? ['保存', '取消'] : ['取消'],
        area: ['100%', '100%'],
        content: "加载中...",
        end: function (index, layero) {
        },
        yes: function (index, layero) {
            //全选和反全选事件
            amazonPublishcheckbox_no_all('amazonPublish_table')

            if (tabIdStr !== "toListingNum" && tabIdStr !== "listingFailNum") {
                layer.closeAll();
                return;
            }
            amazonPublish_editListingProd(id, false, layero)
            return false;
        },
        success: function (layero, index) {
            createSwatch = ''
            //只有带刊登的详情可以修改
            var listingStatus = $("#amazonPublish_searchForm input[name=listingStatus]").val();
            if ('0' == listingStatus || '2' == listingStatus) {
                $(layero).find(".layui-layer-btn0").show();
            } else {
                $(layero).find(".layui-layer-btn0").hide();
                $(layero).find(".layui-layer-btn1").hide();
            }
            loading.show();
            $.ajax({
                url: ctx + '/amazonListing/getListingInfo.html',
                type: 'post',
                dataType: 'json',
                data: { id: id, listingStatus: listingStatus },
                success: function (returnData) {
                    loading.hide();
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                        return;
                    }
                    let cateList = []
                    let cateListNew = []
                    let attrKeyVal = returnData.data?.prodListingAmazon.attrKeyVal
                    expendAttr = returnData.data?.prodListingAmazon.attrKeyVal
                    imgDomain = returnData.data?.prodListingAmazon.imgDomain
                    let arr = attrKeyVal && attrKeyVal.split('#,#')
                    let fieldNameArr = []
                    let tempValueArr = []                   
                    let fulfillmentCenterId = returnData.data.prodListingAmazon.fulfillmentCenterId
                    getAllCommisionCateRule(returnData.data.prodListingAmazon.salesSite)
                        getRequiredVal({
                            tempFileName:returnData.data.prodListingAmazon.tempFileName,
                            salesSite:returnData.data.prodListingAmazon.salesSite
                        }).then(res => {
                            arr && arr.forEach(item => {
                                let key = item.split(':')[0] // fieldName
                                let val = item.split(':')[1] // tempValue
                                fieldNameArr.push(key)
                                tempValueArr.push(val)
                            })
                            res.forEach(item => {
                                let obj = {
                                    fieldName: '',
                                    tempValue: '',
                                    validValues: ''
                                }
                                obj.fieldName = item.fieldName
                                obj.tempValue = tempValueArr[fieldNameArr.indexOf(item.fieldName)] || ''
                                obj.validValues = item.validValues || ''
                                cateList.push(obj)
                            })                        
                            cateListNew = cateList || []                          
                        })
                        
                    getFulfillmentCenterId({
                        tempFileName:returnData.data.prodListingAmazon.tempFileName,
                        salesSite:returnData.data.prodListingAmazon.salesSite,
                        storeAcctId: storeId
                    }).then(res=>{
                        returnData.data.fulfillmentCenterIdData = res
                        returnData.data.cateListNew = cateListNew
                        returnData.data.subSkuMaxImgLimit=AmazonPublish_skuImgLimit
                        returnData.data.prodListingAmazon.itemName = returnData.data.prodListingAmazon.itemName.replaceAll("\"","&quot;")
                        if (returnData.data.fulfillmentCenterIdData?.length === 1) {
                            fulfillmentCenterId = res[0]
                        }
                        returnData.data.isDefault = fulfillmentCenterId === 'DEFAULT' ? true : false
                        genAmazonListingDetailTpl(laytpl, $, returnData.data, layero);
                        if (fulfillmentCenterId === 'DEFAULT') {
                            $("#requireClass").hide()
                        } else {
                            $('#shippingType_oldDetail').show()
                            $('#shippingType_oldDetail').find('[name=shippingType]').val(returnData.data.prodListingAmazon?.shippingType)
                        }

                        //全选和反全选事件
                        deletecheckbox_no_all('listingInfo_sub_tab')

                        if (tabIdStr !== "toListingNum" && tabIdStr !== "listingFailNum") {
                            let inputList = $('#amazonPublish_editDetailForm').find('input')
                            let selectList = $('#amazonPublish_editDetailForm').find('select')
                            let simditorList = $('#amazonPublish_editDetailForm').find('.simditor-body')
               
                            inputList.each((index, item) => {
                                $(item).attr('disabled', 'disabled')
                            })
                            selectList.each((index, item) => {
                                $(item).attr('disabled', 'disabled')
                            })
                            simditorList.each((index, item) => {
                                $(item).attr('contenteditable', 'false')
                            })

                            // 复选框 和 定价不disabled
                            $('#allBoxOldTemp').attr('disabled', false)
                            $('#listingInfo_sub_tab').find('.pid-cbox')?.each((index, item) => {
                                $(item).attr('disabled', false)
                            })
                            $('#grossProfitRateOldTemp').find('[name=grossProfitRate]').attr('disabled', false)
            
                            form.render()
                        }
                    })
                }
            });
        }
    });
}

    // 保存子sku的数据 切换sku时保存 应用至所有变种时保存 保存接口调用时保存
    // subTitle 子sku标题
    // subBulletPoints 卖点#,#分割
    // subProductDescription 子sku商品描述
    // subGenericKeywords 子sku搜索词 ,分割
    // subAttrKeyVal  子sku类目属性值，#,# 分割
    function saveCreateAndDetailSkuData(action, currentDom, type='') {
        let subProductDescription = '',prodListingSubSkuAmazons = [],
        subBulletPoints = '';
        let saveData = $(currentDom).find(`option[value="${action === 'create' ? createPreval : newTplPreval}"]`).attr('sskudata')
        let subAttrKeyVal = ''
        let paramsArr = []
        let subGenericKeywords = ''
        let subTitle = ''
        let fulfillmentCenterId = ''
        let attrWrapDom = ''
        let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
        if (action === 'create') {
            subProductDescription = amazonPublish_create_desc_simditor.getValue()
            fulfillmentCenterId = $("#fulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val()
            subGenericKeywords = $("input[name=genericKeywords]").val()
            subTitle = $("#createSubTitle").val()
            attrWrapDom = 'storeTemplate_editspecificForm'
            subBulletPoints = $("[name=sellingPoint1_1]").val() + '#,#' +
            $("[name=sellingPoint1_2]").val() + '#,#' +
            $("[name=sellingPoint1_3]").val() + '#,#' +
            $("[name=sellingPoint1_4]").val() + '#,#' +
            $("[name=sellingPoint1_5]").val();
        }
        if (action === 'newTpl') {
            subProductDescription = amazonPublish_amazonTemp_desc_simditor.getValue()
            fulfillmentCenterId = $("#amazonPublishModifyAmazonTemplateView select[name=fulfillmentCenterId]").val()
            subGenericKeywords = $('#amazonPublishModifyAmazonTemplateView').find("input[name=tag]").val()
            subTitle = $("#newTplSSkuTitle").val()
            attrWrapDom = 'amazonPublish_editspecificForm'
            subBulletPoints = $("[name=sellingPointStyle1_1]").val() + '#,#' +
            $("[name=sellingPointStyle1_2]").val() + '#,#' +
            $("[name=sellingPointStyle1_3]").val() + '#,#' +
            $("[name=sellingPointStyle1_4]").val() + '#,#' +
            $("[name=sellingPointStyle1_5]").val();
        }
        $.each($('#' + attrWrapDom +' .layui-form-item'), function(index, obj) {
            let key = $(obj).find('.labelField').html();
            let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
            // if (!$(obj).is(':hidden')) {
                if (value) {
                    let contennt = `${key}:${value}`
                    paramsArr.push(contennt)
                }
            // }
        })
        subAttrKeyVal = paramsArr.join('#,#')
        
        let saveObj = {
            subTitle,
            subBulletPoints,
            subProductDescription,
            subGenericKeywords,
            subAttrKeyVal,
        }
        if (saveData) {
            let saveJson = JSON.parse(saveData)
            saveObj.prodPId = saveJson.prodPId
            saveObj.prodPSku = saveJson.prodPSku
        }
        layui.form.render('select')
        if (type === 'apply') { // 应用到所有变种
            $(currentDom).find('option').each((index, item) => {
                $(item).attr('sskudata', JSON.stringify(saveObj))
            })
            layer.msg('已应用至其他变种!')
        } 
        if (type === 'save') { // 保存当前页面的子sku
            let sku = $(currentDom).val()
            $(currentDom).find(`option[value="${sku}"]`).attr('sskudata', JSON.stringify(saveObj))
        }
        if (type === '') {
            $(currentDom).find(`option[value="${action === 'create' ? createPreval : newTplPreval}"]`).attr('sskudata', JSON.stringify(saveObj))
        }
    }

//移除子sku,仅删除样式
function removeAmazonSku(obj, type) {
    // TODO 删除的时候至少要有一个sku
    if ($("#amazonPublish_newSubSkuInfo .amazonPublish_detail_table").length == 1) {
        layer.msg("至少保存一条子sku");
        return;
    }
    $(obj).closest('tr').parent().parent().parent().remove();
    // 更新子sku下拉框数据
    if (type === 'create') {
        // 删除数据之前可能已经保存自定义编辑的数据 不可以重新render
        getSSkuOptionList('publishInfoTable', createSkuChooseOptionList, 'createSkuChoose')
    }
    if (type === 'newTpl') {
        getSSkuOptionList('amazonPublishModifyAmazonTemplateView', newTplSkuChooseOptionList, 'newTplSkuChoose')
    }
}

function addAmazonSkuListing(el){
    let str = $(".amazon_publish_variant").prop('outerHTML');
    $('#'+ el).append(str);
    $('#'+ el).children(":last").find(".pid-cbox").attr("checked",false);
    let index = $('#'+ el).children(":last").index();
    $('#'+ el).children(":last").find(".img-cbox").attr('name', 'imgCbox' + index);
    $('#'+ el).children(":last").find(".img-cbox").attr('value', '')
    $('#'+ el).children(":last").find(".img-cbox").prop('checked', false)

    $('#'+ el).children(":last").find("[name=mainImg]").attr('src',ctx + "/static/img/kong.png");
    $('#'+ el).children(":last").find("[name=mainImg]").attr('shortname', '');
    $('#'+ el).children(":last").find("[name=prodListingSubSkuAmazonsId]").val('');
    $('#'+ el).children(":last").find("[name=externalProductId]").val('');
    $('#'+ el).children(":last").find("[name=standardPrice]").val('');

    let warehouseId = $("#amazonPublishModifyAmazonTemplateView select[name=fulfillmentCenterId]").val() || $("#AmazonTemplateForm select[name=fulfillmentCenterId]").val()
    if(warehouseId === 'DEFAULT') {
        $('#'+ el).children(":last").find("[name=quantity]").val(300);
    }else {
        $('#'+ el).children(":last").find("[name=quantity]").val('');
    }

    $('#'+ el).children(":last").find(".uploadImgUL").html('');
    $('#'+ el).children(":last").find(".themeValue").html('');
    $('#'+ el).children(":last").find(".themeValue").hide();
    $('#'+ el).children(":last").find(".addBtn").show();
    $('#'+ el).children(":last").find(".cskuWeight").html('');
    $('#'+ el).children(":last").find("[name=storeSSku]").hide();
    $('#'+ el).children(":last").find("[name=storeSSku]").html('');
    $('#'+ el).children(":last").find("[name=storeSSku]").val('');

    $('#'+ el).children(":last").find("[name=prodListingSubSkuAmazonsStoreSSku]").show();

    $('#'+ el).children(":last").find("[name=spliceString]").show();
    $('#'+ el).children(":last").find("[name=sizeColor]").show();

    // $('#'+ el).children(":last").find("[name=colorMapValue]").show();
    $('#'+ el).children(":last").find("[name=colorMapValueDiv]").show();
    // $('#'+ el).children(":last").find("[name=sizeMapValue]").show();
    $('#'+ el).children(":last").find("[name=sizeMapValueDiv]").show();
    $('#'+ el).children(":last").find("[name=saveBtn]").hide();

    $('#'+ el).children(":last").find("[name=size]").val('');
    $('#'+ el).children(":last").find("[name=color]").val('');
    $('#'+ el).children(":last").find("[name=sizeColor]").val('');
    $('#'+ el).children(":last").find("[name=colorMapValue]").val('');
    $('#'+ el).children(":last").find("[name=sizeMapValue]").val('');
    $('#'+ el).children(":last").find("[name=spliceString]").val('');

    $('#'+ el).children(":last").find("[name=attrKeyVal]").val('');

    $('#'+ el).children(":last").find(".curImgNum").html(0);
    
    $('#'+ el).children(":last").find(".purchaseCostPrice").html('');
    $('#'+ el).children(":last").find(".outerBoxSize").html('');
    $('#'+ el).children(":last").find(".fbaCharge").html('');
    $('#'+ el).children(":last").find(".firstLogisticsFee").html('');
    $('#'+ el).children(":last").find(".airTransportProfitRate").html('');
    $('#'+ el).children(":last").find(".airDeliveryProfitRate").html('');
    $('#'+ el).children(":last").find(".seaTransportProfitRate").html('');

    // 模板图片按钮的prodssku为空
    $('#'+ el).children(":last").find(".addImgByTpl").data('prodssku','');
    layui.form.render()
}

// 建模刊登的 新模板详情 自动补充
function amazonPublish_new_autoSetWeightPrice(obj, type, action) {
    var newStoreSSku = $(obj).parent().prev().val() || $(obj).parent().prev().prev().val()
    if (!$(obj).parent().prev().val()) {
        $(obj).parents('tr').find("[name=spliceString]").show();
        $(obj).parents('tr').find("[name=sizeColor]").show();
        $(obj).parents('tr').find("[name=colorMapValueDiv]").show();
        $(obj).parents('tr').find("[name=sizeMapValueDiv]").show();

        $(obj).parents('tr').find("[name=size]").val('');
        $(obj).parents('tr').find("[name=color]").val('');
        // $(obj).parents('tr').find("[name=sizeColor]").val('');
        $(obj).parents('tr').find("[name=colorMapValue]").val('');
        $(obj).parents('tr').find("[name=sizeMapValue]").val('');
        // $(obj).parents('tr').find("[name=spliceString]").val('');

        $(obj).parents('tr').find(".themeValue").html('');
        $(obj).parents('tr').find(".themeValue").hide();
    }
    if (!$(obj).parent().prev().val() && $(obj).parent().prev().is(":visible")) {
        // 添加一行的数据
        newStoreSSku = $(obj).parent().prev().val()
    }
    if (!newStoreSSku) {
        layer.msg("请先填写子sku");
        return;
    }
    var salesSite = $('#salesSite').val() || $("#AmazonTemplateForm .salesSite").val();
    let tempFileName = $('#publishLayerAmazonListingName').text();
    $.ajax({
        type: 'post',
        url: ctx + '/amazonListing/autoSetWeightPrice',
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            categoryId: $("#amazonPublishModifyAmazonTemplateView .categoryId").val() || $("#amazon_online_creatListing_cateItem-hidden2").val(),
            fullCateName: $("#amazonPublishModifyAmazonTemplateView .fullCateName").val() || tempFileName.replaceAll('  >>  ', '/'),
            newStoreSSku: newStoreSSku,
            storeAcctId: storeAcctVal,
            salesSite: salesSite,
            fulfillmentCenterId: $("#amazonPublishModifyAmazonTemplateView select[name=fulfillmentCenterId]").val() || $("#AmazonTemplateForm select[name=fulfillmentCenterId]").val()
        }),
        success: function (returnSkuData) {
            if (returnSkuData.code != "0000") {
                layer.alert(returnSkuData.msg, { icon: 2 });
                // 自动补充和该sku的模板图片按钮有联动
                $(obj).parents('table').next().find('.addImgByTpl').data('prodssku',"")
                return;
            }
            $(obj).parents("tr").find('[name=prodListingSubSkuAmazonsId]').val(returnSkuData.data.psi?.id || '')
            $(obj).parents("tr").find('.cskuWeight').html(returnSkuData.data.originWeight)
            $(obj).parents("tr").find('input[name=weight]').val(returnSkuData.data.originWeight)
            $(obj).parents("tr").find('.purchaseCostPrice').html(returnSkuData.data.purchaseCostPrice)
            $(obj).parents("tr").find('input[name=purchaseCostPrice]').val(returnSkuData.data.purchaseCostPrice)
            const {outerBoxHeight,outerBoxLength,outerBoxWidth} = returnSkuData.data
            const outerBoxSizeHtml = `<div>长：${[null,undefined].includes(outerBoxLength)?'':outerBoxLength}</div><div>宽：${[null,undefined].includes(outerBoxWidth)?'':outerBoxWidth}</div><div>高：${[null,undefined].includes(outerBoxHeight)?'':outerBoxHeight}</div>`
            $(obj).parents('tr').find('.outerBoxSize').html(outerBoxSizeHtml)
            $(obj).parents('tr').find('input[name=outerBoxHeight]').val(outerBoxHeight)
            $(obj).parents('tr').find('input[name=outerBoxLength]').val(outerBoxLength)
            $(obj).parents('tr').find('input[name=outerBoxWidth]').val(outerBoxWidth)
            $(obj).parents("tr").find('[name=standardPrice]').val(returnSkuData.data.standardPrice)
            $(obj).parents("tr").find('[name=externalProductId]').val(returnSkuData.data.externalProductId)
            $(obj).parents("tr").find('.externalProductIdType').text(returnSkuData.data.externalProductIdType)
            $(obj).parents("tr").find('[name=standardPrice]').addClass(`changePrice${returnSkuData.data.prodSSku}`)
            $(obj).parents('tr').find('[name=mainImg]').attr('src', returnSkuData.data.mainImageUrl);
            $(obj).parents('tr').find('[name=mainImg]').attr('shortname', returnSkuData.data.shortImgName);
            $(obj).parents('tr').find('.img-cbox').attr('value', returnSkuData.data.mainImageUrl);
            $(obj).parents("tr").find('[name=prodTempId]').val(returnSkuData.data.prodTempId)
            $(obj).parents("tr").find('[name=prodSSku]').val(returnSkuData.data.prodSSku)
            // 自动补充和该sku的模板图片按钮有联动
            $(obj).parents('table').next().find('.addImgByTpl').data('prodssku',returnSkuData.data.prodSSku)

            // 返回 prodPid 调用amazonListing/openCreateTeplateAndListingDia获取新的标题描述和关键词
            let storeAcctId = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
            let salesSite = $("#amazonPublish_searchForm select[name=salesSite]").val();
            getDataStoreTemplateGetProdPInfoById(returnSkuData.data.prodPId, storeAcctId, salesSite).then(res => {
                // 把数据存入到对应的子sku中 newStoreSSku
                let subBulletPoints = res.bulletPoints || '';
                let saveObj = {
                    subTitle: res.itemName || '',
                    subBulletPoints,
                    subProductDescription: res.productDescription || '',
                    subGenericKeywords: res.keyword || '',
                    // subAttrKeyVal: createCateAttrVal?.join('#,#') || '',
                    prodPId: returnSkuData.data.prodPId || '',
                    prodPSku: res.prodPSku || ''
                }
                if (action === 'create'){
                    saveObj.subAttrKeyVal = createCateAttrVal?.join('#,#') || ''
                    $('#createSkuChoose').find(`option[value="${returnSkuData.data.psi?.id || ''}"]`).attr('sskudata', JSON.stringify(saveObj))
                }
                if (action === 'newTpl') {
                    let cateId = $("#amazonPublishModifyAmazonTemplateView .categoryId").val() || $("#amazon_online_creatListing_cateItem-hidden2").val()
                    newTplCateAttrVal = []
                    getDataStoreTemplateQuerySkuInfoAndCateAttr(cateId,returnSkuData.data.prodPId,salesSite).then(function (result) {
                        result?.cateList.forEach(item => {
                            let value = item.tempValue || item.defaultValue
                            if (value) {
                                let contennt = `${item.fieldName}:${value}`
                                newTplCateAttrVal.push(contennt)
                            }
                        })
                        saveObj.subAttrKeyVal = newTplCateAttrVal?.join('#,#') || ''
                        $('#newTplSkuChoose').find(`option[value="${returnSkuData.data.psi?.id || ''}"]`).attr('sskudata', JSON.stringify(saveObj))
                    })
                    $('#newTplSkuChoose').find(`option[value="${returnSkuData.data.psi?.id || ''}"]`).attr('sskudata', JSON.stringify(saveObj))
                }
            })
            
            // 更新子sku下拉框数据
            if (action === 'create') {
                getSSkuOptionList('publishInfoTable', createSkuChooseOptionList, 'createSkuChoose')
            }
            if (action === 'newTpl') {
                getSSkuOptionList('amazonPublishModifyAmazonTemplateView', newTplSkuChooseOptionList, 'newTplSkuChoose')
            }
        }
    })

    amazonPublish_subsku_regenerate(obj, type, true);
}

function saveSsku(self, type = '') {
    tableRowSsku = $(self).val() || ''
}

function updateSsku(self, type='') {
    let currency = $(self).val() || ''
    if (!currency) {
        return layer.msg('请填写子sku')
    }
    if (type === 'create') {
        createSkuChooseOptionList?.forEach(item => {
            if (item.label === tableRowSsku) {
                item.label = currency
            }
        })
        getSSkuOptionList('publishInfoTable', createSkuChooseOptionList, 'createSkuChoose')
    }
}

// 建模刊登 新模板详情 渲染子sku下拉框
// 建模刊登 dom: publishInfoTable list: createSkuChooseOptionList selectDom: createSkuChoose
function getSSkuOptionList(dom, list, selectDom) {
    list = []
    $('#' + dom).find('tr').each((index, item) => {
        let storeSSku = ''
        let id = ''
        id = $(item).find('[name=prodListingSubSkuAmazonsId]').val() || ''
        if (selectDom == 'newTplSkuChoose') {
            storeSSku = $(item).find('[name=storeSSku]').text() || $(item).find('[name=prodListingSubSkuAmazonsStoreSSku]').val()
        } else {
            storeSSku = $(item).find('[name=storeSSku]').val() || $(item).find('[name=prodListingSubSkuAmazonsStoreSSku]').val()
        }
        if (storeSSku) {
            list.push({
                label: storeSSku,
                value: id
            })
        }
    })
    let map = new Map();
    for (let item of list) {
        if (!map.has(item.value)) {
            map.set(item.value, item);
        };
    };
    list = [...map.values()];
    let option = '<option></option>'
    let saveObjList = []
    list?.forEach(item => {
        let sskudata = $('#' + selectDom).find(`option[value="${item.value}"]`).attr('sskudata') || ''
        let saveObj = {
            sku: item.label,
            sskudata
        }
        saveObjList.push(saveObj)
        sskudata = JSON.stringify(sskudata)
        option = option + `<option value="${item.value}">${item.label}</option>`
    })
    $('#' + selectDom).html('')
    $('#' + selectDom).append(option)

     // 给每一项添加保存数据
     list.forEach(item => {
        // 标题 根据子sku列表数据中来
        saveObjList?.forEach(cItem => {
           if (cItem.sku === item.label) {
            $('#' + selectDom).find(`option[value="${item.value}"]`).attr('sskudata', cItem.sskudata)
           }
        })
    })
    // 默认选择第一项
    $('#' + selectDom).val(list[0].value || '')
    if (selectDom === 'createSkuChoose') {
        createPreval = list[0].value || ''
        createSkuChooseOptionList = [].concat(list);
        setCreateSkuData($("#" + selectDom), list[0].value || '')
    } else {
        newTplPreval = list[0].value || ''
        newTplSkuChooseOptionList = [].concat(list);
        setDetailSkuData($("#" + selectDom), list[0].value || '') 
    }
    
    layui.form.render('select')
}


//抽象出一个公共的checkbox全选和反全选的组件
function amazonPublishcheckbox_no_all(tableId) {
    /*获取表头checkbox和美化后的元素*/
    var $ = layui.$;

    //父id全选
    let pId_cbox_All = $('#' + tableId).find('thead input.pid-all-cbox'),
        pId_layui_All = pId_cbox_All.next()
    // //子id全选

    /*获取表内父id的checkbox和美化后的元素*/
    let pId_cbox_td = $('#' + tableId).find('tbody input.pid-cbox'),
        pId_layui_td = pId_cbox_td.next()
    /*获取表内子id的checkbox和美化后的元素*/
    let sId_cbox_td = $('#' + tableId).find('tbody  input.sid-cbox'),
        sId_layui_td = sId_cbox_td.next()

    /*父id全选和反全选事件*/
    pId_layui_All.click(function () {
        /*获取checkbox的状态*/
        var isChecked = pId_cbox_All.prop('checked')
        if (isChecked) {
            pId_layui_td.addClass('layui-form-checked')
            pId_cbox_td.prop('checked', true)
            sId_layui_td.addClass('layui-form-checked')
            sId_cbox_td.prop('checked', true)
        } else {
            pId_layui_td.removeClass('layui-form-checked')
            pId_cbox_td.prop('checked', false)
            sId_layui_td.removeClass('layui-form-checked')
            sId_cbox_td.prop('checked', false)
        }
    });

    //子sku被选,勾选父sku,如果子sku都未被勾选,取消父sku的勾选
    sId_layui_td.click(function () {
        var pid_cbox = $(this).parents('tr').find('input.pid-cbox');//父sku
        if ($(this).prev().prop('checked')) {
            var pid_layui = pid_cbox.next();
            pid_cbox.prop('checked', true)
            pid_layui.addClass('layui-form-checked')
        }
        else {
            var checkLen = $(this).parents('.skus-tr').find('input.sid-cbox:checked').length;
            if (checkLen < 1) {
                var pid_layui_1 = pid_cbox.next();
                pid_cbox.prop('checked', false)
                pid_layui_1.removeClass('layui-form-checked')
            }
        }

    });

    pId_layui_td.click(function () {
        //全选子sku
        let subs_cbox = $(this).parents('tr').find('input.sid-cbox');
        if ($(this).prev().prop('checked')) {
            var subs_layui = subs_cbox.next();
            subs_cbox.prop('checked', true)
            subs_layui.addClass('layui-form-checked')
        } else {
            var subs_layui_x = subs_cbox.next();
            subs_cbox.prop('checked', false)
            subs_layui_x.removeClass('layui-form-checked')
        }
        /*获取选中的checkbox的长度*/
        var len = $('#' + tableId).find('tbody td:first-child input[type="checkbox"]:checked').length;
        if (pId_cbox_td.length == len) {
            pId_layui_All.addClass('layui-form-checked')
            pId_cbox_All.prop('checked', true)
        } else {
            pId_layui_All.removeClass('layui-form-checked');
            pId_cbox_All.prop('checked', false)
        }
    });
}

function amazonPublish_getSearchData() {
    var data = new Object();
    let tabId = $("#amazonPublishHeadTab").find(".layui-this").attr("id")

    //默认查待生成
    data.listingStatus = $("#amazonPublish_searchForm input[name=listingStatus]").val();
    data.tempFileName = $("#amazonPublish_searchForm select[name=tempFileName]").val();
    data.listingDataSource = $("#amazonPublish_searchForm select[name=listingDataSource]").val();
    data.listingRespCode = $("#amazonPublish_searchForm select[name=listingRespCode]").val();  // 错误类型
    data.listingRespDesc = $("#amazonPublish_searchForm input[name=listingRespDesc]").val();  // 错误信息
    data.orderBy = $("#amazonPublish_searchForm select[name=orderBy]").val();  // 排序
    data.salesSite = $("#amazonPublish_searchForm select[name=salesSite]").val();//销售站点

    data.isSitePublish = $('#isSitePublish_amazonPublsih').val() || ''

    data.shippingStatus = $("#amazonPublish_searchForm input[name=shippingStatus]").val();
    let createdId = "";
    // amazonPublishTemp 亚马逊模板tab
    if(tabId == "amazonPublishTemp"){
        createdId = "amazonPublish_createrId"
        // orderBy = "orderBy_amazon"
    }else{
        createdId = "amazonPublish_creater"
        // orderBy = "orderBy_other"
    }
    data.creatorIds = layui.formSelects.value(createdId).map(item => item.value)
    data.createList = $("#amazonPublish_searchForm input[name=createIdList]").val().split(",");

    // data.orderBy = $("#amazonPublish_searchForm select[name="+ orderBy +"]").val();  // 排序

    data.storeAcctId = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
    data.cateId = $("#amazonPublish_searchForm input[name=cateId]").val();
    data.tag = $("#amazonPublish_searchForm select[name=tag]").val();
    data.devType = $("#amazonPublish_searchForm select[name=devType]").val();
    data.hasWhiteImg = $("#amazonPublish_searchForm select[name=hasWhiteImg]").val();
    //是否有库存
    data.filterZeroStock = $("#amazonPublish_searchForm input[name=filterZeroStock]").prop('checked');

    //物流属性
    data.existLogisAttrs = [];
    data.notExistLogisAttrs = [];
    var logisAttrContents = layui.formSelects.value("selectAttr_amazon");

    for (var i = 0; i < logisAttrContents.length; i++) {
        var logisAttr = logisAttrContents[i].val;

        if (logisAttr.substring(0, 3) == ("no_")) {
            logisAttr = logisAttr.replace("no_", "");
            data.notExistLogisAttrs.push(logisAttr);
        } else {
            data.existLogisAttrs.push(logisAttr);
        }
    }
    //产品归属人
    data.bizzOwnerIds = [];
    var bizzOwnerContents = layui.formSelects.value("selectMan_amazon");
    for (var j = 0; j < bizzOwnerContents.length; j++) {
        data.bizzOwnerIds.push(bizzOwnerContents[j].val);
    }
    //侵权状态
    data.tortBanListing = $("#amazonPublish_searchForm select[name=tortBanListing]").val();
    //日期
    var timeStr = $("#amazonPublish_searchForm input[name=time]").val();
    if (timeStr) {
        data.startTime = Date.parse(timeStr.split(" - ")[0] + " 00:00:00");
        data.endTime = Date.parse(timeStr.split(" - ")[1] + " 23:59:59");
    }
    data.timeType = $("#amazonPublish_searchForm select[name=timeType]").val();
    // data.isSale = $("#amazonPublish_searchForm select[name=isSale]").val();
    data.isSaleStr = layui.formSelects.value('isSaleStr', 'val').join(',').trim()

    data.isCanSale = $("#amazonPublish_searchForm select[name=isCanSale]").val();
    data.isPublish = $("#amazonPublish_searchForm select[name=isPublish]").val();
    data.isGenerate = $("#amazonPublish_searchForm select[name=isGenerate]").val();
    // data.selfImgStatus = $("#amazonPublish_searchForm select[name=selfImgStatus]").val();
    data.selfImgStatus = layui.formSelects.value('selfImgStatus_amazonpublish', 'val').join(',').trim()
    data.keywordType = $("#amazonPublish_searchForm select[name=keywordType]").val();
    data.keyword = $("#amazonPublish_searchForm input[name=keyword]").val();
    data.cnTitle = "";
    data.enTitle = "";
    data.pSkus = [];
    data.sSkus = [];
    data.storePSkuList = [];
    data.storeSSkuList = [];
    data.skuVagueFlag = $("#amazonPublish_searchForm select[name=skuVagueFlag]").val()
    let type = 2;
    if(tabId == "amazonPublishTemp"||tabId == "totalNum"){
        type = 1
    }
    if ("cnTitle" == $("#amazonPublish_searchForm select[name=searchType"+ type +"]").val()) {
        data.cnTitle = ($("#amazonPublish_searchForm input[name=searchText]").val());
    }
    if ("enTitle" == $("#amazonPublish_searchForm select[name=searchType"+ type +"]").val()) {
        data.enTitle = ($("#amazonPublish_searchForm input[name=searchText]").val());
    }
    if ("pSkus" == $("#amazonPublish_searchForm select[name=searchType"+ type +"]").val()) {
        var pSkustmp = $("#amazonPublish_searchForm input[name=searchText]").val()
        if (pSkustmp.length > 0) {
            pSkustmp = pSkustmp.split(",");
            if (pSkustmp.length > 0) {
                for (i = 0; i < pSkustmp.length; i++) {
                    data.pSkus.push(pSkustmp[i]);
                }
            }
        }
    }
    if ("sSkus" == $("#amazonPublish_searchForm select[name=searchType"+ type +"]").val()) {
        var sSkustmp = $("#amazonPublish_searchForm input[name=searchText]").val();
        if (sSkustmp.length > 0) {
            sSkustmp = sSkustmp.split(",");
        }
        if (sSkustmp.length > 0) {
            for (i = 0; i < sSkustmp.length; i++) {
                data.sSkus.push(sSkustmp[i]);
            }
        }
    }
    let searchType = $("#amazonPublish_searchForm select[name=searchType"+ type +"]").val()
    if ("storePSkuList" == searchType||"storeSSkuList" == searchType) {
        var sSkustmp = $("#amazonPublish_searchForm input[name=searchText]").val();
        if (sSkustmp.length > 0) {
            sSkustmp = sSkustmp.split(",");
        }
        if (sSkustmp.length > 0) {
            for (i = 0; i < sSkustmp.length; i++) {
                data[searchType].push(sSkustmp[i]);
            }
        }
    }
    data.costStart = ($("#amazonPublish_searchForm input[name=costStart]").val());
    data.costEnd = ($("#amazonPublish_searchForm input[name=costEnd]").val());
    data.weightStart = ($("#amazonPublish_searchForm input[name=weightStart]").val());
    data.weightEnd = ($("#amazonPublish_searchForm input[name=weightEnd]").val());
    return data;
}


//请求需要包含参数,首次获取默认,使用分页控件修改属性,并使用修改后的属性,在页面中搜索,重置为第一页
var limitAllAppoint = 100;//每页显示数据条数
var currentPageAllAppoint = 1;//当前页数
var dataLength = 0;//数据总条数

// 搜索商品按钮事件
function amazonPublish_searchProd() {
    let storeAcctId = $("#amazonPublish_searchForm select[name=storeAcctId]").val(),
        amazonPublishHeadTab = $("#amazonPublishHeadTab").find(".layui-this").attr("id");
    $("#amazonPublish_table").hide()
    // 待刊登和商品需要店铺必选
    if ((null == storeAcctId || '' == storeAcctId) && (amazonPublishHeadTab == "totalNum" || amazonPublishHeadTab == "toListingNum")) {
        layer.msg("店铺不得为空");
        return;
    }

    $("#amazonPublish_table").show()
    if (amazonPublishHeadTab == "amazonPublishTemp") { // 亚马逊模板页签
        amazonPublishTableRender()
    } else {
        currentPageAllAppoint = 1; //当点击搜索的时候，应该回到第一页
        dataLength = 0;
        amazonPublish_search();
    }
}

// 搜索方法
function amazonPublish_search() {
    var form = layui.form,
        laypage = layui.laypage;
    var data = amazonPublish_getSearchData();

    let tabId = $("#amazonPublishHeadTab").find(".layui-this").attr("id")
    if(tabId != "totalNum" && tabId != "amazonPublishTemp" && (data.creatorIds.length != 0)&&data.listingDataSource == '')
        return layer.msg("请选择刊登数据来源")

    data.page = currentPageAllAppoint;
    data.limit = limitAllAppoint;
    loading.show();
    $.ajax({
        url: ctx + '/amazonListing/queryList.html',
        type: "post",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        traditional: true,//确保数组传参正确
        success: function (returnData) {
            loading.hide();
            if (returnData.code != "0000") {
                $("#amazonPublish_table").hide()
                return layer.alert(returnData.msg, { icon: 2 })
            }
            dataLength = returnData.count;
            var amazonCol = {
                two:`<col width="30px"/><col width="70px"/><col width="200px"/><col width="9%"/><col width="30px"/><col width="110px"/><col width="110px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="7%"/>`,
                three:`<col width="30px"/><col width="70px"/><col width="200px"/><col width="9%"/><col width="30px"/><col width="110px"/><col width="120px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="7%"/><col width="7%"/>`,
                four:`<col width="30px"/><col width="70px"/><col width="200px"/><col width="9%"/><col width="30px"/><col width="110px"/><col width="120px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="7%"/><col width="7%"/>`,
                five:`<col width="30px"/><col width="70px"/><col width="200px"/><col width="9%"/><col width="30px"/><col width="110px"/><col width="120px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="7%"/><col width="7%"/>`,
                six: `<col width="30px"/><col width="70px"/><col width="200px"/><col width="9%"/><col width="30px"/><col width="110px"/><col width="120px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="70px"/><col width="7%"/><col width="7%"/>`,
            rep: function (str) {
                    $('.amazonPublish_table_head').find('.layui-table colgroup').remove()
                    $('.amazonPublish_table_body').find('.layui-table colgroup').remove()
                    $('.amazonPublish_table_head').find('.layui-table').prepend(str)
                    $('.amazonPublish_table_body').find('.layui-table').prepend(str)
                }
            }
            // 处理物流属性
            var logisAliaList, alia
            if (returnData.data) {
                var data = returnData.data;
                for (var i = 0; i < data.length; ++i) {
                    logisAliaList = []
                    if (data[i].logisAttrList != undefined && data[i].logisAttrList != '') {
                        var logisAttrArr = data[i].logisAttrList.split(',')
                        for (var j = 0; j < logisAttrArr.length; ++j) {
                            alia = amazonPublish_getColorOfLogis_productTpl(logisAttrArr[j])
                            if (alia && alia != '普') {
                                logisAliaList.push({
                                    alia: alia,
                                    logisAttr: logisAttrArr[j]
                                })
                            }
                        }
                    }
                    data[i].logisAliaList = logisAliaList
                }
                returnData.data = data;//加了物流属性后替换掉
            }


            html = template('amazonPublish_tpl', returnData);
            $('#amazonPublish_table').html(html);


            //固定表头
            theadHandle().fixTh({ id: '#amazonPublishCard', h: 150, dv1: '.layui-tab-title', dv2: '.amazonPublish_table_head', dv3: '#amazon_btn_show_hide', i: 35 });
            form.render('checkbox');
            imageLazyload();//懒加载
            var listingStatus = $("#amazonPublish_searchForm input[name=listingStatus]").val();
            var shippingStatus = $("#amazonPublish_searchForm input[name=shippingStatus]").val();
            $("#amazon_publish .listingSuccInfo").hide();
            $("#amazon_publish .timeClass").hide();
            $('.amazonPublish-listfail').on('mouseenter', function () {
                var contentshow = $(this).next(".amazonPublish-listfailreason").text();
                layer.tips(contentshow, $(this), {
                    tips: [2, 'red'],
                    area: ['40%', 'auto'],
                    time: 0,
                });
            }).on('mouseleave', function () {
                layer.closeAll("tips");
            });
            $('.amazonPublish-listfail').on('click', function () {
                var contentshow = $(this).next(".amazonPublish-listfailreason").text();
                copyTxtToClipboard(contentshow)
            })
            $('#amazon_publish #totalNum').text("商品");
            $("#amazon_publish #amazonPublishTemp").text("亚马逊模板");
            $("#amazon_publish #toListingNum").text("待刊登");
            $("#amazon_publish #amazonPublishToFile").text("待生成文件");
            $("#amazon_publish #amazon_listingNum").text("刊登中");
            $("#amazon_publish #listingSucNum").text("刊登成功");
            $("#amazon_publish #listingFailNum").text("刊登失败");

            $("#amazon_publish .notlistingInfo").hide();
            //仅刊登失败对应的展示,展示状态和失败原因
            $("#amazon_publish .listTiming").hide();
            if (-2 == listingStatus) {//商品
                $('#amazon_publish #totalNum').text("商品(" + returnData.count + ")");
                $("#amazon_publish .colspan_td").attr("colSpan", 6);
                $("#amazon_publish .failInfo").hide();
                $("#amazon_publish .timeClass").show();
                $("#amazon_publish .listTiming").hide();
                $("#amazon_publish .auditTime").show();
                $("#amazon_publish .storeSubSkuInfo").hide();
                $("#amazon_publish .listingInfo").hide();
                $("#amazon_publish .notlistingInfo").show();
                $("#amazon_publish .detailInfoBtn").hide();
                $("#amazon_publish .createTempAndPublishBtn").show();
                $("#amazon_publish .operateLogBtn").hide();
                $("#amazon_publish .publishBtn").hide();
                $("#amazon_publish .salesNum").show();
                $("#amazon_publish .createTime").show();
                $("#amazon_publish .amazon_creater").hide();
                console.log('商品')
            }
            else if (0 == listingStatus) {
                $('#amazon_publish #toListingNum').text("待刊登(" + returnData.count + ")")
                $("#amazon_publish .colspan_td").attr("colSpan", 8);
                $("#amazon_publish .failInfo").hide();
                $("#amazon_publish .listTiming").hide();
                $("#amazon_publish .auditTime").hide();
                $("#amazon_publish .listFileTiming").hide();
                $("#amazon_publish .storeSubSkuInfo").show();
                $("#amazon_publish .listingInfo").show();
                $("#amazon_publish .detailInfoBtn").show();
                $("#amazon_publish .createTempAndPublishBtn").hide();
                $("#amazon_publish .operateLogBtn").show();
                $("#amazon_publish .publishBtn").hide();
                $("#amazon_publish .salesNum").hide();
                $("#amazon_publish .createTime").hide();
                $("#amazon_publish .amazon_creater").hide();
                amazonCol.rep(amazonCol.two)
                console.log('待刊登')
            }
            else if (1 == listingStatus) {
                $('#amazon_publish #listingSucNum').text("刊登成功(" + returnData.count + ")")
                $("#amazon_publish .colspan_td").attr("colSpan", 8);
                $("#amazon_publish .failInfo").hide();
                $("#amazon_publish .timeClass").show();
                $("#amazon_publish .listingTime").show();
                $("#amazon_publish .listTiming").hide();
                $("#amazon_publish .auditTime").hide();
                $("#amazon_publish .listFileTiming").hide();
                $("#amazon_publish .storeSubSkuInfo").show();
                $("#amazon_publish .listingInfo").show();
                $("#amazon_publish .listingSuccInfo").show();
                $("#amazon_publish .detailInfoBtn").show();
                $("#amazon_publish .createTempAndPublishBtn").hide();
                $("#amazon_publish .operateLogBtn").show();
                $("#amazon_publish .publishBtn").hide();
                $("#amazon_publish .salesNum").hide();
                $("#amazon_publish .createTime").hide();
                $("#amazon_publish .amazon_creater").show();
                amazonCol.rep(amazonCol.four)
                console.log('刊登成功')
            }
            else if (2 == listingStatus) {
                $('#amazon_publish #listingFailNum').text("刊登失败(" + returnData.count + ")")
                $("#amazon_publish .colspan_td").attr("colSpan", 8);
                $("#amazon_publish .failInfo").show();
                $("#amazon_publish .timeClass").show();
                $("#amazon_publish .listingTime").show();
                $("#amazon_publish .listTiming").hide();
                $("#amazon_publish .auditTime").hide();
                $("#amazon_publish .listFileTiming").hide();
                $("#amazon_publish .storeSubSkuInfo").show();
                $("#amazon_publish .listingInfo").show();
                $("#amazon_publish .detailInfoBtn").show();
                $("#amazon_publish .createTempAndPublishBtn").hide();
                $("#amazon_publish .operateLogBtn").show();
                $("#amazon_publish .publishBtn").show();
                $("#amazon_publish .salesNum").hide();
                $("#amazon_publish .createTime").hide();
                $("#amazon_publish .amazon_creater").show();
                amazonCol.rep(amazonCol.five);
                console.log('刊登失败')
            }
            else if (3 == listingStatus) {
                $('#amazon_publish #amazon_listingNum').text("刊登中(" + returnData.count + ")")
                $("#amazon_publish .colspan_td").attr("colSpan", 8);
                $("#amazon_publish .failInfo").hide();
                $("#amazon_publish .timeClass").show();
                $("#amazon_publish .listingTime").show();
                $("#amazon_publish .listTiming").show();
                $("#amazon_publish .auditTime").hide();
                $("#amazon_publish .listFileTiming").hide();
                $("#amazon_publish .storeSubSkuInfo").show();
                $("#amazon_publish .listingInfo").show();
                $("#amazon_publish .detailInfoBtn").show();
                $("#amazon_publish .operateLogBtn").show();
                $("#amazon_publish .createTempAndPublishBtn").hide();
                $("#amazon_publish .publishBtn").hide();
                $("#amazon_publish .salesNum").hide();
                $("#amazon_publish .createTime").hide();
                $("#amazon_publish .amazon_creater").show();
                amazonCol.rep(amazonCol.three)
            }
            else if (6 == listingStatus) {
                $('#amazon_publish #amazonPublishToFile').text("待生成文件(" + returnData.count + ")")
                $("#amazon_publish .timeClass").show();
                $("#amazon_publish .listFileTiming").show();
                $("#amazon_publish .publishBtn").hide();
                $("#amazon_publish .salesNum").hide();
                $("#amazon_publish .createTime").hide();
                $("#amazon_publish .amazon_creater").hide();
                $("#amazon_publish .operateLogBtn").show();
                $("#amazon_publish .createTempAndPublishBtn").hide();
                amazonCol.rep(amazonCol.six)
            }

            //全选和反全选事件
            amazonPublishcheckbox_no_all('amazonPublish_table')
            loading.hide();
            amazonPublish_toPage();
        }
    });
}

function amazonPublish_toPage() {
    laypage = layui.laypage;
    //处理分页
    laypage.render({
        elem: 'amazonPublish_pagination',
        count: dataLength, //数据总数，从服务端得到
        layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
        limits: [30, 50, 100, 300],
        curr: currentPageAllAppoint,
        limit: limitAllAppoint,
        jump: function (obj, first) {
            currentPageAllAppoint = obj.curr;
            limitAllAppoint = obj.limit;
            //首次不执行
            if (!first) {
                amazonPublish_search()
            }
        }
    });
}

function amazonPublish_genToListingProd() {
    var data = $("#amazonPublish_table tbody input.sid-cbox:checked");
    var storeAcctId = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
    var salesSite = $("#amazonPublish_searchForm select[name=salesSite]").val();

    var isSale = layui.formSelects.value('isSaleStr', 'val').join(',').trim()

    var paramData = [];
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            paramData.push(data[i].value);
        }
        $.ajax({
            beforeSend: function () {
                loading.show();
            },
            url: ctx + '/amazonListing/addStoreProds.html',
            type: "post",
            dataType: "json",
            data: {
                "prodTmpIdAttr": paramData,
                "storeAcctId": storeAcctId,
                "salesSite": salesSite,
                "isSale": isSale,
            },
            traditional: true,
            success: function (returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    if (returnData.data.length > 0) {
                        // layer.alert(returnData.data.join("<br>"),{icon:7});
                        layer.open({
                            type: 1,
                            title: '信息',
                            closeBtn: 0, //不显示关闭按钮
                            btn: ['确认'],
                            area: ['500px', '600px'],
                            anim: 2,
                            shadeClose: true, //开启遮罩关闭
                            content: '<div style="padding:20px">' + returnData.data.join("<br>") + '</div>',
                            yes: function (index) {
                                amazonPublish_search();
                                layer.close(index);
                            }
                        });
                    } else {
                        layer.msg('生成待刊登信息成功');
                        amazonPublish_search();
                    }
                }
            }
        });
    }
    else {
        layer.msg("请至少选择1条数据");
    }
}

// 数组对象，根据某个属性去重
function unique(arr,field) {
    const res = new Map()
    return arr.filter((item) => !!item[field] && !res.has(item[field]) && res.set(item[field], 1))
}

// 下载刊登文件按钮
function amazonPublish_btn_download() {
    var data = $("#amazonPublish_table tbody input.pid-cbox:checked"),paramData = [];
    // 以lastsubmitid为文件名，批量下载时，根据lastsubmitid字段去重，然后循环下载#2104
    let storeAcctId = ''
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            storeAcctId = $(data[i]).data("storeacctid")
            paramData.push({
                lastSubmitId:$(data[i]).data("lastsubmitid"),
                id:data[i].value
            })
        }
    }
    // 根据lastsubmitid字段去重
    let _data = unique(paramData,"lastSubmitId")
    // 获取去重后的数组循环调用接口
    _data.length >0 && _data.forEach(item => {
        transBlob({
            url: ctx + "/amazonListing/DownloadPublisTemplate",
            formData: JSON.stringify([{
                taskId: item.lastSubmitId,
                storeAcctId: storeAcctId
            }]),
            fileName: item.lastSubmitId +".txt",
            contentType: 'application/json'
        },'','text/plain').then(function (result) {
            loading.hide();
        }).catch(function (err) {
            layer.alert(err, {icon: 2});
        });
    })
}

function amazonPublish_deletelisting(id) {
    var paramData = [];
    if (id) {
        paramData.push(id);
    } else {
        var data = $("#amazonPublish_table tbody input.pid-cbox:checked");
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }
        }
    }
    // var listingStatus = $("#amazonPublish_searchForm input[name=listingStatus]").val();
    if (paramData.length > 0) {
        loading.show();
        $.ajax({
            url: ctx + '/amazonListing/deleteListing',
            type: "post",
            dataType: "json",
            // data: { "idArr": paramData, "listingStatus": listingStatus },
            data: JSON.stringify(paramData),
            contentType: 'application/json',
            traditional: true,
            success: function (returnData) {
                loading.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    layer.msg('删除店铺刊登信息成功');
                    amazonPublish_search();
                }
            },
        });
    }
    else {
        layui.layer.msg("请至少选择1条数据");
    }
}

function deletecheckbox_no_all(domId) {
    var form = layui.form
    // //父id全选
    let pId_cbox_All = $('.allid-cbox')

    /*父id全选和反全选事件*/
    form.on('checkbox(allBox)', function(data){
        console.log(data.elem); //得到checkbox原始DOM对象
        console.log(data.elem.checked); //是否被选中，true或者false
        let isChecked = data.elem.checked
        if (isChecked) {
            $('#' + domId).find('tbody input.pid-cbox').next().addClass('layui-form-checked')
            $('#' + domId).find('tbody input.pid-cbox').prop('checked', true)
        } else {
            $('#' + domId).find('tbody input.pid-cbox').next().removeClass('layui-form-checked')
            $('#' + domId).find('tbody input.pid-cbox').prop('checked', false)
        }
      });
    $('.allid-cbox').on('click',function () {
        /*获取checkbox的状态*/
        var isChecked = pId_cbox_All.prop('checked')
        if (isChecked) {
            $('#  + domId.pid-cbox').prop('checked', true)
        } else {
            $('#  + domId.pid-cbox').prop('checked', true)
        }
    });
}

function setTextLength(el, val, input) {
    if(val.length > 500) {
        val = val.substr(0,500)
        $(`input[name=${input}]`).val(val)
    }           
    $('#' + el).text(val.length);
}

// 操作日志
function showOperateLog(pSku, listingId) {
    layer.open({
        title: `商品：${pSku} 操作日志`,
        type: 1,
        area: ['1300px', '700px'],
        content: $('#operateLogContainer').html(),
        success: function (layero, index) {
            let table = layui.table;
            let el = layero.find('.layui-layer-title')
            el.css({
                'font-weight': 'bold',
                'text-align': 'center'
            })
            let data = {
                listingId
            }
            table.render({
                elem: "#operateLogTable",
                method: 'get',
                url: ctx + `/amazonListing/showListingEditLog`,
                where: data,
                cols: cols.amazonOperatelogCol,
                id: "operateLogTable",
                page: true,
                limits: [20, 50, 100],
                limit: 20
            });
        }
    })
}
let getAllCommisionCateRuleData = []
function getAllCommisionCateRule(country){
    commonReturnPromise({
        url: '/lms/fbaPricing/getAllCommisionCateRule?siteId=' + country,
        type: 'GET',
    }).then(res => {
        if(res){
            getAllCommisionCateRuleData = res;
            // commonRenderSelect(`amazonPublish_fbaPlatCommisionRuleId`, res, {
            //     name: 'ruleName',
            //     code: 'id'
            // }).then(() => {
            //     layui.form.render('select')
            // })
        }else{
            getAllCommisionCateRuleData = [];
        }
    }).catch(err=>{
        getAllCommisionCateRuleData = [];
    })
}

// 建模刊登
let defaultFbaPlatCommisionRuleId; // 佣金分类默认值
function createTempAndPublish(id) {
    storeAcctVal = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
    prodId = id;
    let form = layui.form
    let storeAcctId = storeId = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
    let salesSite = $("#amazonPublish_searchForm select[name=salesSite]").val();
    let popIndex = layer.open({
        title: '建模刊登',
        type: 1,
        area: ['100%', '100%'],
        btn: ['保存', '保存并发布', '关闭'],
        id: 'createTempAndPublishAmazonTpl',
        content: $('#createTempAndPublishAmazon').html(),
        end: function () {
        },
        success: function (layero, index) {
            createSwatch = `<div style="width: 100%; display:flex;justify-content: center">
                <input type="radio" class="img-cbox" style="margin-left:-10px" name=":name" shortname=":shortName" lay-skin="primary" value=":value" lay-filter="swatchRadio"><span>设为swatch图</span></div>`
            if ($("#publishInfoTable .amazon_publish_variant").length > 0) {
                $('.multi-box').show()
            } else {
                $('.multi-box').hide()
                $('.allid-cbox').prop('checked', false)
            }
            //全选和反全选事件
            deletecheckbox_no_all('publishInfoTable')
            $("input[name=storeTemplateBaseId]").val(id)
            getStoreTemplateData(id, storeAcctId, salesSite)

            //监听input输入
            layero.on('input', '[name=sellingPoint1_1]', function(e){
                let val = e.target.value;
                setTextLength('AmazonTemplate_sellingPoint1_1Count', val, 'sellingPoint1_1')

            });
            layero.on('input', '[name=sellingPoint1_2]', function(e){
                let val = e.target.value;
                setTextLength('AmazonTemplate_sellingPoint1_2Count', val, 'sellingPoint1_2')
            });
            layero.on('input', '[name=sellingPoint1_3]', function(e){
                let val = e.target.value;
                setTextLength('AmazonTemplate_sellingPoint1_3Count', val, 'sellingPoint1_3')
            });
            layero.on('input', '[name=sellingPoint1_4]', function(e){
                let val = e.target.value;
                setTextLength('AmazonTemplate_sellingPoint1_4Count', val, 'sellingPoint1_4')
            });
            layero.on('input', '[name=sellingPoint1_5]', function(e){
                let val = e.target.value;
                setTextLength('AmazonTemplate_sellingPoint1_5Count', val, 'sellingPoint1_5')
            });  

            //类目绑定  
            $('#storeTemplateLayer_creatListing').on('click', function () {
                let siteCode = $("#AmazonTemplateForm .salesSite").val();
                if(siteCode) {
                    layui.admin.itemCat_select('amazon_online_creatListing-publish2',
                        'amazon_online_creatListing_cateItem-hidden2',
                        'publishLayerAmazonListingName',
                        "/amazon/getAmazonCateList.html?siteId=" + siteCode,
                        "/amazon/searchAmazonCate.html?siteId=" + siteCode,
                        null,
                        { isNeedPrediction: true, prodId, salesSite }
                    );
                }else{
                    layer.msg("必须先选择站点");
                }
            });

            // 选择amazon类目
            $("#publishLayerAmazonListingName").change(function(){
                // 站点
                let siteCode = $("#AmazonTemplateForm .salesSite").val();
                //根据cateId：类目id, siteId：站点 获取分类属性
                initSpecificAttr($("#amazon_online_creatListing_cateItem-hidden2").val(), siteCode, id);
                let tempFileName = $('#publishLayerAmazonListingName').text()
                commonReturnPromiseRes({
                    type: 'GET',
                    url: ctx + `/amazonListing/getDefaultFbaPlatCommisionRuleId`,
                    params: {
                        categoryId: $("#amazon_online_creatListing_cateItem-hidden2").val(),
                        fullCateName: tempFileName.replaceAll('  >>  ', '/'),
                        salesSite: salesSite
                    }
                }).then((res) => {
                    if(res.code == '0000' && res.data){
                        // defaultFbaPlatCommisionRuleId = res.data
                        defaultFbaPlatCommisionRuleId = 100
                    }
                })

            });
            getAllCommisionCateRule(salesSite)
            form.render();
            amazonGenerateFromGPTFn(id, $('#createTempAndPublishAmazonTpl'));
        },
        yes:function (index,layero) {
            createSaveFn(1)

        // layer.close(popIndex);
        },
        btn2: function(index, layero) {
            console.log('保存并发布')
            createSaveFn(2)
            return false;
           
        },
        btn3: function() {
            console.log('close')
        },
    })
}

//20240530-GPT生成
function amazonGenerateFromGPTFn(id, pLayero) {
  pLayero.on('click', '#amazonGenerateFromGPT',function(){
    //弹框
    layer.open({
      type: 1,
      title: 'GPT生成',
      btn: ['应用', '关闭'],
      area: ['60%', '80%'],
      id: 'amazonGenerateFromGPTLayTplId',
      content: $('#amazonGenerateFromGPTLayTpl').html(),
      success: function(layero){
        layui.form.render('checkbox');
        //赋值给关键词和标题输入框的data-prodpsku
        let prodpsku = pLayero.find('[name=pSku]').val();
        layero.find('[name=gpt_keywords]').attr('data-prodpsku', prodpsku);
        layero.find('[name=enTitle]').attr('data-prodpsku', prodpsku);
        //给关键词输入框赋值-根据id请求接口
        amazonGenerateFromGPT_keywordFn(layero,id)
        //点击prompt配置按钮出现弹框
        layero.find('#gpt_prompt_config').on('click', function(){
          amazonGenerateFromGPT_promptFn();
        });
        //点击清空按钮
        layero.find('#gpt_clear').on('click', function(){
          layero.find('[name=gpt_keywords]').val('');
          $(this).parents('.layui-form-item').find('.currentLength').text(0);
        });
        //点击生成按钮执行事件
        layero.find('#gpt_generate').on('click', function(){
          let gpt_keywords = layero.find('[name=gpt_keywords]').val();
          if(!gpt_keywords.length){
            return layer.msg('请输入关键词', {icon:7});
          }
          let salesSite = pLayero.find('[name=salesSite]').val();
          amazonGenerateFromGPT_detailFn(gpt_keywords, salesSite, layero);
        });
        //全选反选事件
        amazonGenerateFromGPT_checkAllFn(layero);
        //复制选中项
        amazonGenerateFromGPT_copyFn(layero);
      },
      yes: function(index, layero){
        //获取到所有的子checkbox
        let checkboxs = layero.find('.gpt_s_ckeckbox');
        //如果单个checkbox选中,就打印选中的name
        checkboxs.each(function(index, item){
          if($(item).prop('checked')){
            //获取到父元素layui-form-item下类名gpt-content的value
            let gpt_contentDom = $(item).parents('.layui-form-item').find('.gpt-content');
            let gptVal = gpt_contentDom.val().trim();
            //赋值给对应的playero下的输入框,获取到name
            let name = $(gpt_contentDom).attr('name');
            if(name != 'amazonPublishDesc'){
              if(name == 'enTitle'){
                if(gptVal.length > 150){
                  pLayero.find(`[name=${name}]`).val(gptVal);
                }else{
                  pLayero.find(`[name=${name}]`).val(gptVal);
                }
                pLayero.find('[name=enTitle]').parent().find('.currentLength').text(gptVal.length || 0);
                if(pLayero.find(`[name=subTitle]`).length>0){
                  if(gptVal.length > 150){
                    pLayero.find(`[name=subTitle]`).val(gptVal.split(0,150));
                  }else{
                    pLayero.find(`[name=subTitle]`).val(gptVal);
                  }
                  pLayero.find('[name=subTitle]').parent().find('.currentLength').text(gptVal.length || 0);
                }
              }else{
                pLayero.find(`[name=${name}]`).val(gptVal);
                pLayero.find(`#AmazonTemplate_${name}Count`).text(gptVal.length);
              }
            }else{
              amazonPublish_create_desc_simditor = autoSimditor('amazonPublishDesc', gptVal.replace(/\n/g, '<br>'));
            }
          }
        });
        layer.close(index);
      }
    });
  });
}
//gpt渲染关键词
function amazonGenerateFromGPT_keywordFn(layero,id){
  commonReturnPromise({
    url: `/lms/prodTpl/getTplCoreKeyWord?prodPId=${id}`
  }).then(keyRes=>{
    if(keyRes && keyRes.length >0){
      let gptKeyword = keyRes.join(',');
      layero.find('[name=gpt_keywords]').val(gptKeyword);
    }else{
      layero.find('[name=gpt_keywords]').val('');
    }
    //渲染大小写和字数限制
    commonAddEventTitleToggle(layero, 'amazon');
  });
}
//gpt_prompt弹框
function amazonGenerateFromGPT_promptFn() {
  layer.open({
    type: 1,
    title: 'Prompt配置',
    btn: ['保存', '关闭'],
    area: ['80%', '40%'],
    id: 'amazonGenerateFromGPTPromptId',
    content: $('#amazonGenerateFromGPTPrompt').html(),
    success: function(layero){
      //请求接口获取prompt信息
      commonReturnPromise({
        url: '/lms/amazonListing/getAmazonListingPrompt'
      }).then(promptRes => {
        //渲染input
        layero.find('[name=amazonDescriptionPrompt]').val(promptRes.amazonDescriptionPrompt);
        layero.find('[name=amazonTitlePrompt]').val(promptRes.amazonTitlePrompt);
        layero.find('[name=amazonSellingPointsPrompt]').val(promptRes.amazonSellingPointsPrompt);
      });
    },
    yes: function(index, layero){
      //调用保存接口
      let amazonDescriptionPrompt = layero.find('[name=amazonDescriptionPrompt]').val(),
          amazonTitlePrompt = layero.find('[name=amazonTitlePrompt]').val(),
          amazonSellingPointsPrompt = layero.find('[name=amazonSellingPointsPrompt]').val();
      commonReturnPromise({
        type: 'post',
        url: '/lms/amazonListing/updateAmazonListingPrompt',
        contentType: 'application/json',
        params: JSON.stringify({
          amazonDescriptionPrompt,
          amazonTitlePrompt,
          amazonSellingPointsPrompt
        })
      }).then(saveRes => {
        layer.msg(saveRes || '操作成功', {icon: 1});
        layer.close(index);
      });
    }
  });
}
//gpt_detail点击生成按钮,渲染详情
function amazonGenerateFromGPT_detailFn(keywords, salesSite, layero){
  commonReturnPromise({
    type: 'post',
    url: '/lms/amazonListing/generateByPrompt',
    contentType: 'application/json',
    params: JSON.stringify({
      "keywords": keywords.split(','),
      "maxWordCount": 150,
      "salesSite": salesSite
    })
  }).then(gptRes => {
    // console.log(gptRes);
    //渲染详情
    if(gptRes && Object.keys(gptRes).length > 0){
      layero.find('[name=enTitle]').val(gptRes.title ||'');//标题
      layero.find('[name=enTitle]').parent().find('.currentLength').text(gptRes.title.length || 0);
      layero.find('[name=amazonPublishDesc]').val(gptRes.description || ''); //描述
      layero.find('[name=sellingPoint1_1]').val(gptRes.sellingPoints[0] || ''); //卖点1
      layero.find('[name=sellingPoint1_2]').val(gptRes.sellingPoints[1] || ''); //卖点2
      layero.find('[name=sellingPoint1_3]').val(gptRes.sellingPoints[2] || ''); //卖点3
      layero.find('[name=sellingPoint1_4]').val(gptRes.sellingPoints[3] || ''); //卖点4
      layero.find('[name=sellingPoint1_5]').val(gptRes.sellingPoints[4] || ''); //卖点5
    }
  })
}

//gpt反选全选事件
function amazonGenerateFromGPT_checkAllFn(layero){
  //监听全选点击
  layui.form.on('checkbox(gpt_p_check_filter)', function(data){
    let isChecked = data.elem.checked;
    let checkboxs = layero.find('.gpt_s_ckeckbox');
    if(isChecked){
      //循环checkboxs,每个都设置成checked状态
      checkboxs.each(function(index, item){
        $(item).prop('checked', true);
      });
    }else{
      checkboxs.each(function(index, item){
        $(item).prop('checked', false);
      });
    }
    layui.form.render('checkbox');
  });
  //监听子项点击-如果子项没有全部选中,父项勾选框取消选中
  layui.form.on('checkbox(gpt_s_check_filter)', function(data){
    let checkboxs = layero.find('.gpt_s_ckeckbox');
    //判断是否每个checkbox都是选中状态
    let allCked = true;
    checkboxs.each(function(index, item){
      if(!$(item).prop('checked')){
        allCked = false;
        //终止循环
        return false;
      }
    });
    if(allCked){
      //如果全部选中,父项勾选框选中
      layero.find('[name=gpt_p_check]').prop('checked', true);
    }else{
      //如果部分或全部不选中,父项勾选框取消选中
      layero.find('[name=gpt_p_check]').prop('checked', false);
    }
    layui.form.render('checkbox');
  });
}

//gpt复制勾选内容
function amazonGenerateFromGPT_copyFn(layero){
  layero.find('.gpt-copy').on('click', function(){
    //获取到所有的子checkbox
    let checkboxs = layero.find('.gpt_s_ckeckbox');
    //如果单个checkbox选中,就打印选中的name
    let hasCked = false; //是否有选中的checkbox
    //拼接选中项
    let contentArr = [];
    checkboxs.each(function(index, item){
      if($(item).prop('checked')){
        hasCked = true; //有选中的checkbox
        let gpt_contentDom = $(item).parents('.layui-form-item').find('.gpt-content');
        let gptVal = gpt_contentDom.val().trim();
        if(gptVal){
          contentArr.push(`${gptVal}`);
        }
      }
    });
    if(!hasCked){
      layer.msg('操作失败，请先选择一条数据！', {icon: 2});
      return;
    }
    // console.log('contentArr', contentArr);
    navigator.clipboard.writeText(contentArr.join('\r\n')).then(function() {
      layer.msg("操作成功，已将勾选数据复制至粘贴板",{icon:1}); // 这里是可选的，仅用于提醒用户
    }).catch(function(error) {
        // 复制失败的处理
        console.error("复制到剪贴板失败:", error);
    });
  });
}






function createSaveFn(createTemplateAndListingType) {
    let productDescription = amazonPublish_create_desc_simditor.getValue(),prodListingSubSkuAmazons = [],
    bulletPoints = $("[name=sellingPoint1_1]").val() + '#,#' +
        $("[name=sellingPoint1_2]").val() + '#,#' +
        $("[name=sellingPoint1_3]").val() + '#,#' +
        $("[name=sellingPoint1_4]").val() + '#,#' +
        $("[name=sellingPoint1_5]").val();
    if ($('input[name=salesType]:checked').val() == '1' && $('.amazon_publish_variant').length > 1) {
        layer.msg("单品只能有一条子sku数据")
        return
    }
    
    let amazonAttrArr = [], oaAttrArr = []
    if (amazonThemeTableAttrArr != null && amazonThemeTableAttrArr != undefined && amazonThemeTableAttrArr != '') {
        amazonAttrArr = amazonThemeTableAttrArr.map(item => item.amazonAttr)
            oaAttrArr = amazonThemeTableAttrArr.map(item => item.oaAttr)
        }
        let variationThemeData = $("select[name=variationTheme]").val() + '#,#'
        // 获取映射oa属性
        let variationThemeOaSelected = []
        $("select[name=publishThemeTableOaAttrSelect]").each(function(){
            variationThemeOaSelected.push($(this).val())
        })
        amazonAttrArr.forEach(function (item, index) {
            variationThemeData += item + ":" + variationThemeOaSelected[index] + "||"
        })
        // color#,#----color#,#size:3||----
        variationThemeData.substring(variationThemeData.length - 1,variationThemeData.length) == '#'?variationThemeData = variationThemeData.substring(0, variationThemeData.length - 3):"";
        variationThemeData.substring(variationThemeData.length - 1,variationThemeData.length) == '|'?variationThemeData = variationThemeData.substring(0, variationThemeData.length - 2):"";

        // 保存一下当前页面的子sku数据
        let currentDom = $('#createSkuChoose')
        saveCreateAndDetailSkuData('create', currentDom, 'save')

        let errMsg = '';
        let ifSellerPointEmpty = false
        let ifDescEmpty = false
        $("#publishInfoTable").find(".amazon_publish_variant").each((index,item) => {
            let id = $(item).find('[name=prodListingSubSkuAmazonsId]').val() || ''
            if (id) {
                var attrValDemo = $("#publishInfoTable").find(".amazon_publish_variant")[0] || ''
                var attrVal = $(attrValDemo).find('input[name=attrKeyVal]').val()
                var priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
                var price=$(item).find('input[name=standardPrice]').val()
                if (!priceReg.test(price)) errMsg = "请输入正确的价格:整数或者保留两位小数";
                //js只能输入正整数（不包括负整数和0）
                var places =$(item).find('input[name=quantity]').val()
                if(places && !(/(^[1-9]\d*$)/.test(places))) errMsg = "库存应为正整数";
                let otherImageUrlArr = []
                $(item).find(".uploadImgUL img").each((index,cItem) => {
                    otherImageUrlArr.push($(cItem).attr("shortname").trim())
                })
                let attrKeyValNew = '';
                
                // 根据id匹配到保存的数据
                let storeSSku = $(item).find('[name=storeSSku]').val() || $(item).find('[name=prodListingSubSkuAmazonsStoreSSku]').val()
                
                let saveDataObj = $('#createSkuChoose').find(`option[value="${id}"]`).attr('sskudata') || ''
                // 卖点校验
                let sellerPoint = JSON.parse(saveDataObj).subBulletPoints
                sellerPoint?.split("#,#").forEach(function (itemPoint) {
                    if (!ifSellerPointEmpty) {
                        if (itemPoint === '' || itemPoint === undefined) {
                            ifSellerPointEmpty = true
                            layer.msg('请填写' + storeSSku + '的卖点')
                            return false
                        }
                    }
                });
                if (ifSellerPointEmpty) {
                    return
                }
                if (ifDescEmpty) {
                    return
                }
                // 描述校验
                let descSub = JSON.parse(saveDataObj).subProductDescription
                if (descSub) {
                    if (descSub.length > 2000) {
                        layer.msg(storeSSku +'描述过长,不能超过2000字符');
                        ifDescEmpty = true
                        return;
                    }
                } else {
                    layer.msg(storeSSku + '描述不得为空');
                    ifDescEmpty = true
                    return;
                }
    
                let swatch = $(item).find(`input[name=imgCbox${index}]:checked`).attr('shortname')
                let obj = {
                    id: $(item).find('input[name=prodListingSubSkuAmazonsId]').val(),
                    externalProductId: $(item).find('input[name=externalProductId]').val(),
                    standardPrice: $(item).find('input[name=standardPrice]').val(),
                    quantity: $(item).find('input[name=quantity]').val(),
                    storeSSku,
                    mainImageUrl:$(item).find('[name=mainImg]').attr('shortname'),
                    otherImageUrl: otherImageUrlArr.join("|"),
                    swatchImageUrl: swatch,
                    prodSSku: $(item).find('input[name=prodSSku]').val(),
    
                    // attrKeyVal: $(item).find('input[name=attrKeyVal]').val(),
                    externalProductIdType: $(item).find('.externalProductIdType').html(),
                    weight: $(item).find('.cskuWeight').find('input').val(),
                    prodTempId: $(item).find('input[name=prodTempId]').val(),
                    size: $(item).find('input[name=size]').val(),
                    color: $(item).find('input[name=color]').val(),
                    style: $(item).find('input[name=style]').val()
                }
                 
                let newObj = {};
                $(item).find(".tdVal").each((index,cItem)=>{
                    let key = $(cItem).data('key')
                    newObj[key] = $(cItem).find("input").val() || $(cItem).find("span").text()
                })
                
                let newObjCopy = {}
                $(item).find(".tdVal").each((index,cItem)=>{
                    let key = $(cItem).data('key')
                    if (key.indexOf('Value') > -1) {
                        key = key.replaceAll('Value', '')
                    }
                    newObjCopy[key] = $(cItem).find("input").val() || $(cItem).find("span").text()
                })
    
                let attrStrArr = []
                Object.keys(newObjCopy).forEach(item => {
                    let str
                    let val = newObjCopy[item] || ''
                    if (item.length > 8) {
                    str = `spliceString:${val}`
                    }
                    if (item && val) {
                        str = `${item}:${val}`
                    }
                    attrStrArr.push(str)
                })
                obj.attrKeyVal = attrStrArr.join('#,#')
                obj = Object.assign(obj, newObj)
                if (saveDataObj) {
                    let subAttrKeyVal = saveDataObj ? JSON.parse(saveDataObj).subAttrKeyVal : ''
                    if ($("#fulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val() == 'DEFAULT') {
                        let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
                        let subAttrList = []
                        subAttrList = subAttrKeyVal?.split('#,#')?.filter(item => {
                            let key = item?.split(':')[0] || ''
                            return !requireVal.includes(key)
                        })
                        subAttrKeyVal = subAttrList?.join('#,#');
                    }
                    let saveCopyData = Object.assign({}, JSON.parse(saveDataObj))
                    saveCopyData.subAttrKeyVal = subAttrKeyVal
                    obj = Object.assign(obj, saveCopyData)
                }
                prodListingSubSkuAmazons.push(obj)
            }
        })
        if(errMsg != ''){
            return layer.msg(errMsg);
        }

        if (ifSellerPointEmpty) {
            return false
        }
        if (ifDescEmpty) {
            return false
        }

        let attrKeyVal = ''
        let paramsArr = []
        let keyArr = []
        let fulfillmentCenterId = $("#fulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val()
        let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
        $.each($('#storeTemplate_editspecificForm .layui-form-item'), function(index, obj) {
            let key = $(obj).find('.labelField').html();
            let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
            if (fulfillmentCenterId === 'DEFAULT') {
                if (requireVal.includes(key)) {
                    value = ''
                }
            }
            if (value) {
                keyArr.push(key)
                let contennt = `${key}:${value}`
                paramsArr.push(contennt)
            }
        })
        attrKeyVal = paramsArr.join('#,#')

        let flag = false
        let requreKeyList = []
        $.each($('#storeTemplate_editspecificForm .toggleClass'),function(index,obj) {  
            let key = $(obj).find('.labelField').html();
            let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
            if (fulfillmentCenterId === 'DEFAULT') {
                if (requireVal.indexOf(key) > -1) {
                    key = ''
                }
            }
            requreKeyList.push(key)
            if (key && !value) {
                flag = true
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
        })
        let currentSskuId = $('#createSkuChoose').val() || ''
        let currentSsku = createSkuChooseOptionList?.filter(item => item.value == currentSskuId)[0]?.label
        if (flag) {
            layer.msg(currentSsku + "必填的分类属性未填写！")
            return
        }
        // 如果当前页面sku的分类属性都填写完 那么将剩余的子sku和当前页面的进行比对
        // 只要必填的key存在就可以
        let ifAttrKeyValEmpty = false
        requreKeyList = requreKeyList.filter(item => item !== '')
        createSkuChooseOptionList?.forEach(item => {
            if (!ifAttrKeyValEmpty) {
                let saveDataObj = $('#createSkuChoose').find(`option[value="${item.value}"]`).attr('sskudata') || ''
                let subAttrKeyVal = saveDataObj ? JSON.parse(saveDataObj).subAttrKeyVal : ''

                let valList = subAttrKeyVal?.split('#,#')?.map(item => item.split(':')[0])
                subAttrKeyVal?.split('#,#')?.forEach(cItem => {
                    let key = cItem?.split(':')[0] || ''
                    requreKeyList?.forEach(i => {
                            if (!ifAttrKeyValEmpty) {
                                if (!valList?.includes(i)) {
                                    ifAttrKeyValEmpty = true
                                    layer.msg(item.label + "必填的分类属性未填写！")
                                }
                            }
                        })
                })
                
            }
        })

        if (ifAttrKeyValEmpty) {
            return false
        }

        if(!$('input[name=salesType]:checked').val()) {
            layer.msg("请选择售卖形式！")
            return
        }
        // 标题：itemName、卖点：bulletPoints、描述：productDescription、价格：prodListingSubSkuAmazons
        handleSave(storeAcctVal, needToAlert, createTemplateAndListingType, variationThemeData, bulletPoints, productDescription, attrKeyVal, prodListingSubSkuAmazons)

    }

function handleSave(storeAcctVal, needToAlert, createTemplateAndListingType, variationThemeData, bulletPoints, productDescription, attrKeyVal, prodListingSubSkuAmazons) {
    let salesType = $('input[name=salesType]:checked').val();
    variationThemeData = salesType == '1' ? '' : variationThemeData
    let data ={
        "storeAcctId": storeAcctVal,
        "needToAlert": needToAlert,
        "salesSite":  $("#AmazonTemplateForm .salesSite").val(),
        "prodCateId": $("#amazon_online_creatListing_cateItem-hidden2").attr('data-id'),
        "prodPId": $("input[name=storeTemplateBaseId]").val(),
        "createTemplateAndListingType": createTemplateAndListingType,
        "variationTheme": variationThemeData,
        "bulletPoints":bulletPoints,
        "genericKeywords": $("input[name=genericKeywords]").val(),
        "itemName": $("#AmazonTemplateForm input[name=enTitle]").val(),
        "salesType": $('input[name=salesType]:checked').val(),
        "productDescription":productDescription,
        "attrKeyVal": attrKeyVal,
        "storePSku": $("#storeTemplateModifyAmazonTemplateView1 input[name=storePSku]").val(),
        "prodPSku": $("#storeTemplateModifyAmazonTemplateView1 input[name=pSku]").val(),
        "prodListingSubSkuAmazons": prodListingSubSkuAmazons,
        "fulfillmentCenterId": $("#fulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val(),
        "shippingType": $('#shippingType_publish select[name=shippingType').val()
    }

    commonReturnPromise({
        type: 'post',
        url: ctx + `/amazonListing/createTeplateAndListing`,
        contentType: 'application/json',
        params: JSON.stringify(data)
    }).then(() => {
        layer.closeAll()
        layer.msg('保存成功', { icon: 1 })
        amazonPublish_searchProd()
    }).catch(err => 
        layer.alert(err, {
            btn: ['继续保存', '取消'],
            icon: 2,
            yes: function() {
                needToAlert = 'false'
                handleSave(storeAcctVal, needToAlert, createTemplateAndListingType, variationThemeData, bulletPoints, productDescription, attrKeyVal, prodListingSubSkuAmazons)
            },
            btn2: function() {
                console.log('取消')
            }
        })
    )
}


// 初始化amazon站点
function getDataStoreTemplateGetSiteEnum(){
    return commonReturnPromise({
        url: `/lms/enum/getSiteEnum.html?platCode=amazon`,
        type: 'post',
    })
}
 // 初始化亚马逊模板的接口
// prodPId:number [基础模板id]
function getDataStoreTemplateGetProdPInfoById(prodPId, storeAcctId, salesSite){
    return commonReturnPromise({
        url: `/lms/amazonListing/openCreateTeplateAndListingDia`,
        type: 'post',
        contentType: 'application/json',
        
        params:JSON.stringify({"prodPId":prodPId, storeAcctId: storeAcctId, salesSite: salesSite})
    })
}
// 获取基础模板的数据
function getStoreTemplateData(prodPId, storeAcctId, salesSite){
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl,
        form = layui.form,
        table = layui.table;
    // getDataStoreTemplateGetSiteEnum() 初始化站点
    // getDataStoreTemplateGetProdPInfoById() 基础模板回显数据
    Promise.all([getDataStoreTemplateGetSiteEnum(), getDataStoreTemplateGetProdPInfoById(prodPId, storeAcctId, salesSite)]).then(function(result){
        // 初始化站点 
        let option = "<option value=''></option>";
        $(result[0]).each(function() {
            option += `<option value=${this.code}>${this.name}</option>`
        });
        
        $("#AmazonTemplateForm .salesSite").html(option)
        $("#AmazonTemplateForm .salesSite").val(salesSite)

        // 基础模板回显数据 --start--
        let BaseTemplateReturnData = skuInfoCreateFirst = data = result[1];

        BaseTemplateReturnData.itemName = data.itemName.replaceAll("\"","&quot;")
        $("input[name=storeTemplateBaseId]").val(prodPId)
        $("input[name=upcExemptionFlag]").val(result[1].upcExemptionFlag)
        $("input[name=logisAttrList]").val(result[1].logisAttrList)
        // 商品的建模刊登的listingStatus为-2
        $("input[name=listingStatus]").val(-2)

        laytpl($("#storeTemplateModifyAmazonTemplateContainer1").html()).render(BaseTemplateReturnData, function(html){
            $('#storeTemplateModifyAmazonTemplateView1').html(html)
        });
        laytpl($("#storeTemplateModifyAmazonTemplateContainer0").html()).render(BaseTemplateReturnData, function(html){
            $('#storeTemplateModifyAmazonTemplateView0').html(html)
            commonAddEventTitleToggle($('#AmazonTemplateForm'), 'amazon')
        });
        
        laytpl($("#storeTemplateModifyAmazonTemplateContainer3").html()).render(BaseTemplateReturnData, function(html){
            $('#storeTemplateModifyAmazonTemplateView3').html(html)
            $('#grossProfitRateCreateTemp').hide()
        });
        //监听一下标题input的输入
        let textLengthDom= $('#AmazonTemplateForm #amazonPublishAmazonTemplate_titleLength');
        $('#AmazonTemplateForm input[name=enTitle]').on('input', function(e){
            let val = e.target.value;
            textLengthDom.text(val.length);
            if(val.length > 150){
                textLengthDom.addClass('redTitle').removeClass('greenTitle');
            }else{
                textLengthDom.addClass('greenTitle').removeClass('redTitle');
            }
        });     
        form.render();
    }).catch(function(err){
        console.log(err)
        layer.msg(err.message || err, {icon:2})
    })
}

// 获取类目属性和theme下拉的值
// amazonCateId 类目ID
// prodPId 商品ID
// siteId 站点
// amazonCateAttrS 分类属性的值，编辑模板返回的数据
// variationTheme theme#,#amazonAttr1:oaAttr1||amazonAttr2:oaAttr2，编辑模板返回的数据
// varients  编辑模板返回的数据
function initSpecificAttr(amazonCateId, siteId, prodPId,amazonCateAttrS=[],variationTheme="",varients=[]) {
    if (!amazonCateId) {
        return;
    }
    layui.admin.load.show();
    
    getDataStoreTemplateQuerySkuInfoAndCateAttr(amazonCateId,prodPId,siteId).then(function (result) {
        _initSpecificAttrFunc(result)
        getListingTitleLimitRemark().then(res => {
            $('#titleRemark').html(res || '')
        })
        $("#publish_create_moreAttrBtn").nextAll().hide()
    }).catch(function (err) {
        console.log('err', err)
        layer.msg(err, {icon: 2});
    });
}  

function _initSpecificAttrFunc(result){
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    AmazonCateAttrData = result

    let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
    let lazadaPublishFlag = 0, requiredIndex;
    result.cateList.forEach((item, index) => {
        if (!item.required && !lazadaPublishFlag) {
            lazadaPublishFlag = 1
            requiredIndex = index
        }
        if (requiredIndex && index >= requiredIndex) {
            item.required = false
        }
        if (requireVal.indexOf(item.fieldName) > -1) {
            item.required = true
            item.test = true
        }
        if(item.tempValue){
            item.defaultValue = item.tempValue
        }
    })

    cateListCreateCopy = JSON.parse(JSON.stringify(result));
    cateListResult = JSON.parse(JSON.stringify(result));

    // variation theme的下拉值
    var themeOptionList = '<option value="">请选择</option>';
    result.variations[0]?.validValues?.split("#,#").forEach(function (attrVal) {
        themeOptionList += '<option value="' + attrVal + '">' + attrVal + '</option>';
    });
    $("#AmazonTemplateForm select[name=variationTheme]").html(themeOptionList)


    let tempFileName = $('#publishLayerAmazonListingName').text()
    let salesSite = $('#AmazonTemplateForm select[name=salesSite]').val()
    tempFileName = tempFileName.replaceAll('  >>  ', '/')

    isNeedChangeLang(salesSite)
    // default amazon_na ...
    getFulfillmentCenterId({
        categoryId: $("#amazon_online_creatListing_cateItem-hidden2").val(),
        fullCateName: tempFileName,
        salesSite: salesSite,
        storeAcctId: storeId
    }).then(res=>{
        let data = {}
        data.fulfillmentCenterIdData = res
        // 渲染下拉框
        laytpl($("#AmazonTemplateContainer").html()).render(data, function(html){
            $('#fulfillmentCenterIdTemp').html(html)
        });

        $('#AmazonTemplateForm select[name=fulfillmentCenterId]').val('')
        form.render();
    })
}

// 更多选填属性 建模刊登
$(document).on("click", "#publish_create_moreAttrBtn", function () {
    $("#publish_create_moreAttrBtn").nextAll().toggle()
})

let amazonThemeTableAttrArr = [],
        AmazonCateAttrData = [],
        AmazonSkuTableData = [];

function renderVariationThemeTable(variationTheme,variationThemeSelected) {
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl,
        form = layui.form,
        table = layui.table;
    // 选择theme下拉生成theme表格数据
    getDataStoreTemplateGetAmzAttrByVariationTheme(variationTheme).then(function(result){
        let amazonAttr = result.amazonAttr,
            oaAttr = result.oaAttr,
            amazonAttrLen = [],oaAttrLen = [],_amazonThemeTableAttrArr = [];
        // AMZ属性数>OA属性数，业务切换theme
        // AMZ属性数<OA属性数，合并OA属性size和style，格式为size, style

        // amazonAttr和oaAttr都为空
        (amazonAttr == ''||amazonAttr == undefined)&&(oaAttr == ''||oaAttr == undefined)? layer.msg("AMZ属性和OA属性都为空"):""
        amazonAttr != ''&& amazonAttr != undefined?amazonAttrLen = amazonAttr.split("#,#"):''
        oaAttr != ''&& oaAttr != undefined?oaAttrLen = oaAttr.split("#,#"):''

        // 先清空所有数据
        if (amazonAttrLen.length === 3 && oaAttrLen.length < 3) {
            layer.alert("OA属性不足，请更换主题", {icon: 7})
            _amazonThemeTableAttrArr = []
        }
        else if(amazonAttrLen.length > oaAttrLen.length && oaAttrLen.length != 0){
            layer.alert("请更换模板或类目", {icon: 7})
            _amazonThemeTableAttrArr = []
        }
        else if(oaAttrLen.length == 0 ){
            layer.alert("OA属性为空，请直接生成sku", {icon: 7})
            _amazonThemeTableAttrArr = []
        }
        else if(amazonAttrLen.length == 0 ){
            layer.alert("Amazon属性为空", {icon: 7})
            _amazonThemeTableAttrArr = []
        }else {
            // amazonAttrLen < oaAttrLen ,并且 oaAttrLen != 0, amazonAttrLen != 0
            // theme1，oa2，两个字段拼接起来;
            // theme2，oa3，把size和style进行拼接
            // theme1，oa3，把size和style,color进行拼接
            if(amazonAttrLen.length == oaAttrLen.length){
                amazonAttrLen.forEach(function(attrVal,index) {
                    _amazonThemeTableAttrArr.push({"amazonAttr":attrVal,"oaAttr":oaAttrLen})
                });
            }else if(amazonAttrLen.length == 1 && oaAttrLen.length == 2){
                _amazonThemeTableAttrArr.push({"amazonAttr":amazonAttrLen[0],"oaAttr":[oaAttrLen[0] + '_' + oaAttrLen[1]]})
            }else if(amazonAttrLen.length == 2 && oaAttrLen.length == 3){
                amazonAttrLen.forEach(function(attrVal,index) {
                    _amazonThemeTableAttrArr.push({"amazonAttr":attrVal,"oaAttr":["color","size_style"]})
                });
            }else if(amazonAttrLen.length == 1 && oaAttrLen.length == 3){
                amazonAttrLen.forEach(function(attrVal,index) {
                    _amazonThemeTableAttrArr.push({"amazonAttr":attrVal,"oaAttr":["color_size_style"]})
                });
            }
        }

        if (amazonAttrLen.length == 3) {
            _amazonThemeTableAttrArr?.forEach((item, index) => {
                item.selectIndex = index
            })
        } else {
            _amazonThemeTableAttrArr?.forEach((item) => {
                item.selectIndex = 0
            })
        }
        amazonThemeTableAttrArr = _amazonThemeTableAttrArr
        table.render({
            elem: "#publishThemeTable",
            cols: [[{
                title: 'AMZ属性',
                field: 'amazonAttr',
            }, {
                field: 'oaAttr',
                title: '映射OA属性',
                templet: "#publishThemeTableOaAttr"
            }]],
            data:amazonThemeTableAttrArr
            ,limit: amazonThemeTableAttrArr.length
            ,width:1000,
            done:function(){
                // $("select[name=publishThemeTableOaAttrSelect]").each(function(i){
                //     $(this).val(variationThemeSelected[i])
                // })
                // $(".layui-table-body, .layui-table-box, .layui-table-cell").css('overflow', 'visible');
                form.render()
            }
        });
    }).catch(function(err){
        console.log('err', err)
        layer.msg(err, {icon:2});
    })
}

let pskuTableData = []
// 生成SKU 建模刊登
$(document).on("click","#publisheHandleSku",function(){
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl,
        form = layui.form,
        table = layui.table;
    let variationTheme = $("#AmazonTemplateForm select[name=variationTheme]").val()
    if(!$('input[name=salesType]:checked').val()) {
        layer.msg("请选择售卖形式！")
        return
    }
    if (AmazonCateAttrData.length === 0 || !AmazonCateAttrData) {
        layer.msg("请先选择站点和类目！")
        return
    }
    if ($('input[name=salesType]:checked').val() == '2') {
        if(variationTheme == ''&& AmazonCateAttrData?.variations[0].required == true){
            layer.alert("variationTheme下拉必填",{icon:7})
            return false;
        }
    }
    const fulfillmentCenterId = $("#fulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val()
    if (!fulfillmentCenterId) {
        return layer.msg('请选择仓库')
    }
    // 获取映射oa属性
    let variationThemeOaSelected = [],oaAttr = '';
    $("select[name=publishThemeTableOaAttrSelect]").each(function(){
        variationThemeOaSelected.push({"oa":$(this).val(),'amz':''})
    })

    $("[data-field=amazonAttr]").find("div").each(function(index){
        index != 0 ? variationThemeOaSelected[index-1].amz = $(this).text():''
    })

    if(variationThemeOaSelected.length == 0){
        oaAttr = ""
    }else{
        variationThemeOaSelected.forEach(item => {
            oaAttr += `${item.amz}||${item.oa}&`
        })
        oaAttr = oaAttr.substring(0, oaAttr.length - 1);
    }
    let storeAcctId = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
    let salesSite = $("#amazonPublish_searchForm select[name=salesSite]").val();
    let skuTitle = ''

    laytpl($("#storeTemplateModifyAmazonTemplateContainer2").html()).render(skuInfoCreateFirst, function(html){
        $('#storeTemplateModifyAmazonTemplateView2').html(html)

        $("#AmazonTemplateForm input[name=genericKeywords]").tagsinput();
        skuInfoCreateFirst.genericKeywords?.split(",").forEach((item,index)=>{
            $("#AmazonTemplateForm input[name=genericKeywords]").tagsinput('add', item);
        })
        commonAddEventTitleToggle($('#createSSkuTitle'), 'amazon')
    });
    amazonPublish_create_desc_simditor = autoSimditor('amazonPublishDesc', skuInfoCreateFirst.productDescription); //设置描述头内容
    form.render()
    getDataStoreTemplateQuerySkuInfoByVariationTheme(oaAttr).then(data => {
        if(data instanceof Array){
           const upcExemptionFlag =$("input[name=upcExemptionFlag]").val() === 'true'
           const fulfillmentCenterId = $("#fulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val()
            pskuTableData = data;
            let arr = []
            variationThemeOaSelected.forEach(item => {
              let obj = [item.amz] + ':' + item.oa
              arr.push(obj)
            })

            variationThemeOaSelected.forEach(item => {
                if (item.oa?.length > 8) {
                    data?.forEach(function(cItem,index){
                        if("spliceString" in cItem){
                        }else{
                            cItem["spliceString"] = cItem[item.oa?.split("_")[0]] + '_' + cItem[item.oa?.split("_")[1]]
                        }
                    })
                }
            })
            const listingStatus = $("#AmazonTemplateForm").find('input[name=listingStatus]').val()
            let returnData = {
                prodListingSubSkuAmazons: data.map(item=>({...item, listingStatus})),
                varietionThemeTable: arr
            }
            // 根据是否是FBA刊登来显示不同表头
            returnData.prodListingSubSkuAmazons.forEach((item) => {
                item.isDefault = isDefault
            })
            returnData['getAllCommisionCateRuleData'] = getAllCommisionCateRuleData;
            returnData['fbaPlatCommisionRuleId'] = defaultFbaPlatCommisionRuleId;
            laytpl($("#prodListingSubSkuAmazonsTable").html()).render(returnData, function(html){
                $('#publishInfoTable').html(html)
                if ($("#publishInfoTable .amazon_publish_variant").length > 0) {
                    $('.multi-box').show()
                } else {
                    $('.multi-box').hide()
                    $('.allid-cbox').prop('checked', false)
                }
              
            });
            // 通过是直邮还是FBA,有无UPC展示不同的列
            if(upcExemptionFlag){
                $('#publishInfoTable').find('.upcExemptionFlag').each(function(){
                    $(this).hide()
                })
            }
            if(!fulfillmentCenterId || fulfillmentCenterId === 'DEFAULT'){
                $('#publishInfoTable').find('.fulfillmentCenterId').each(function(){
                    $(this).hide()
                })
            }else{
                $('#publishInfoTable').find('.notFulfillmentCenterId').each(function(){
                    $(this).hide()
                })
            } 
            if (returnData.prodListingSubSkuAmazons?.length > 0) {
                // 显示 子sku选择列表
                $('#createSSkuSelect').show()
                // 显示子标题
                $('#createSSkuTitle').show()
            }
            // 渲染分类属性
            laytpl($("#amazonCateSpecificsTemp").html()).render(cateListCreateCopy, function (html) {
                $("#storeTemplate_editspecificForm").html(html);
            })
            form.render();
            commonToggleAttr()

            // 根据生成的子 sku 数据 填充 createSkuChoose 下拉框
            createSkuChooseOptionList = returnData.prodListingSubSkuAmazons?.map(item => {
                if (item.storeSSku) {
                    return {
                        value: item.id,
                        label: item.storeSSku
                    }
                }
            })
            appendSelect($('#createSkuChoose'), createSkuChooseOptionList, 'value', 'label')
            // 默认选择第一项
            $('#createSkuChoose').val(createSkuChooseOptionList[0].value || '')
            createPreval = createSkuChooseOptionList[0].value || ''
            let paramsArr = []
            createCateAttrVal = []
            $.each($('#storeTemplate_editspecificForm .layui-form-item'), function(index, obj) {
                let key = $(obj).find('.labelField').html();
                let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
                if (value) {
                    let contennt = `${key}:${value}`
                    paramsArr.push(contennt)
                    createCateAttrVal.push(contennt)
                }
            })
            
            // 给每一项添加保存数据
            createSkuChooseOptionList.forEach(item => {
                // 标题 根据子sku列表数据中来
                pskuTableData?.forEach(cItem => {
                   if (cItem.storeSSku === item.label) {
                       let saveObj = {
                           subTitle: skuInfoCreateFirst.itemName,
                           subBulletPoints: skuInfoCreateFirst.bulletPoints || '',
                           subProductDescription: skuInfoCreateFirst.productDescription || '',
                           subGenericKeywords: skuInfoCreateFirst.keyword || '',
                           subAttrKeyVal: paramsArr.join('#,#') || '',
                           prodPId: prodId || '',
                           prodPSku: $("#storeTemplateModifyAmazonTemplateView1 input[name=pSku]").val() || ''
                       }
                       $('#createSkuChoose').find(`option[value="${item.value}"]`).attr('sskudata', JSON.stringify(saveObj))
                   }
                })
            })
            
            // 子sku标题 = 父sku标题  默认第一项数据
            createFirstTableInfo = data[0] || []
            if (createFirstTableInfo) {
                subTitle = skuInfoCreateFirst.itemName
            }
            $('#createSubTitle').val(subTitle)
            form.render();
        }else{
            layer.msg(data, {icon:2});
        }
    }).catch(function(err){
        console.log('生成sku',err)
        layer.msg(err, {icon:2});
    })
})
// sku信息表--批量删除 建模刊登
$(document).on("click","#publishDetaleSelected",function(){
    var data = $("#publishInfoTable tbody input.pid-cbox:checked");
    if (data.length === 0) {
        layer.msg("请至少选择一条数据")
    } else {
        $(data).parents('.amazon_publish_variant').find('tr')?.each(item => {
            let ssku = $(item).closest('tr').find('[name=storeSSku]').val() || $(item).find('[name=prodListingSubSkuAmazonsStoreSSku]').val()
            $('#createSkuChoose').find(`option[value="${ssku}"]`).hide()
            $('#createSSkuSelect').find(`dd[lay-value="${ssku}"]`).hide()
        })
        $(data).parents('.amazon_publish_variant').remove()
        if ($("#publishInfoTable .amazon_publish_variant").length > 0) {
            $('.multi-box').show()
        } else {
            $('.multi-box').hide()
            $('.allid-cbox').prop('checked', false)
        }
        // 更新子sku下拉框数据
        // getSSkuOptionList('publishInfoTable', createSkuChooseOptionList, 'createSkuChoose')
    }
})

// sku信息表--新增一行数据
$(document).on("click","#publishIncreaseRow",function(){
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl,
        form = layui.form,
        table = layui.table;
    let baseSkuTableData

    let site = $('#salesSite').val() || $("#AmazonTemplateForm .salesSite").val()
    if (!site) {
        layer.msg("请先选择站点")
        return
    }
    if (!$('input[name=salesType]:checked').val()) {
        layer.msg("请先选择售卖方式")
        return
    }
    if($('input[name=salesType]:checked').val() == '2' && $('.amazon_publish_variant').length == 0) {
        layer.msg("请先点击生成SKU")
        return
    }
    if ($('input[name=salesType]:checked').val() == '1' && $('.amazon_publish_variant').length == 0) {
        let returnData = {
            prodListingSubSkuAmazons: [{id: '', imgName:'', sSku: ''}],
            varietionThemeTable: []
        }
        // 根据是否是FBA刊登来显示不同表头
          returnData.prodListingSubSkuAmazons.forEach((item) => {
            item.isDefault = isDefault
        })
        returnData['getAllCommisionCateRuleData'] = getAllCommisionCateRuleData;
        returnData['fbaPlatCommisionRuleId'] = defaultFbaPlatCommisionRuleId;
        laytpl($("#prodListingSubSkuAmazonsTable").html()).render(returnData, function(html){
            $('#publishInfoTable').html(html)
            let warehouseId = $("#amazonPublishModifyAmazonTemplateView select[name=fulfillmentCenterId]").val() || $("#AmazonTemplateForm select[name=fulfillmentCenterId]").val()
            if (warehouseId === 'DEFAULT') {
                $('#publishInfoTable input[name=quantity]').val(300)
            }
            if ($("#publishInfoTable .amazon_publish_variant").length > 0) {
                $('.multi-box').show()
            } else {
                $('.multi-box').hide()
                $('.allid-cbox').prop('checked', false)
            }
        });
        form.render();
    }else if($('.amazon_publish_variant').length != 0){
        baseSkuTableData = deepCopy(pskuTableData[0])

        for(let key in baseSkuTableData){
            if(key == "colorMap") continue
            baseSkuTableData[key] = ''
        }
        pskuTableData.push(baseSkuTableData)
        // 添加一行
        addAmazonSkuListing('publishInfoTable')
        if ($("#publishInfoTable .amazon_publish_variant").length > 0) {
            $('.multi-box').show()
        } else {
            $('.multi-box').hide()
            $('.allid-cbox').prop('checked', false)
        }
    }
})

// 引用基础模板描述
$(document).on("click","#amazonApplyTempDesc",function(){
    var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl,
        form = layui.form
    let popIndex = layer.open({
        title: '引用基础模板描述',
        type: 1,
        area: ['50%', '60%'],
        btn: ['应用', '关闭'],
        id: 'amazonTempApplyDescLayer1',
        content: $('#amazonTempApplyDescLayer').html(),
        success: function (layero, index) {
            let current =  $('#createSkuChoose').val()
            let saveData = $('#createSkuChoose').find(`option[value="${current}"]`).attr('sskudata')
            let prodPId = JSON.parse(saveData)?.prodPId
            getAmazonSellingPointsByProdDesc(prodPId).then(data => {
                let newData = [];
                data&&data.forEach(item => {
                    newData.push(item.replace(/\"/g, "'"))
                })
                laytpl($("#amazonTempApplyDesc").html()).render(newData, function(html){
                    $('#amazonTempApplyDescContent').html(html)
                   
                });
                form.render();
              }).catch(function(err){
                console.log('err', err)
                  layer.msg(err, {icon:2});
              })
        },
        yes:function (index,layero) {
            // 勾选不能超过5条
            let checkedContent = []
            $('.descInput').each(function(index, item){
                if($(item).is(':checked')){
                    checkedContent.push(item.value)
                }
            });

            if (checkedContent?.length > 5) {
                return layer.msg('不能勾选超过5条', {icon:2});
            }
            // 应用到卖点
            if (checkedContent?.length > 0) {
                $('input[name=sellingPoint1_1]').val(checkedContent[0] || '')
                $('input[name=sellingPoint1_2]').val(checkedContent[1] || '')
                $('input[name=sellingPoint1_3]').val(checkedContent[2] || '')
                $('input[name=sellingPoint1_4]').val(checkedContent[3] || '')
                $('input[name=sellingPoint1_5]').val(checkedContent[4] || '')
            }
            $('[name=sellingPoint1_1]').trigger('input')
            $('[name=sellingPoint1_2]').trigger('input')
            $('[name=sellingPoint1_3]').trigger('input')
            $('[name=sellingPoint1_4]').trigger('input')
            $('[name=sellingPoint1_5]').trigger('input')
            layer.close(popIndex)
        }
    })
})
// 通过商品描述，解析为亚马逊卖点
function getAmazonSellingPointsByProdDesc(id) {
    return commonReturnPromise({
        url: `/lms/prodTpl/getAmazonSellingPointsByProdDesc`,
        type: 'get',
        contentType: 'application/json',
        params:{
            prodPId: id || $("input[name=storeTemplateBaseId]").val()
        }
    })
}

// 获取sku信息表的数据
function getDataStoreTemplateQuerySkuInfoByVariationTheme(oaAttr){
    let tempFileName = $('#publishLayerAmazonListingName').text()
    tempFileName = tempFileName.replaceAll('  >>  ', '/')
    return commonReturnPromise({
        url: `/lms/amazonPublishModel/querySkuInfoByVariationTheme`,
        type: 'post',
        contentType: 'application/json',
        params: JSON.stringify({
            prodPId: $("input[name=storeTemplateBaseId]").val(),
            categoryId:$("#amazon_online_creatListing_cateItem-hidden2").val(),
            salesSite:$("#AmazonTemplateForm .salesSite").val(),
            oaAttr:oaAttr,
            storeAcctId: $("#amazonPublish_searchForm select[name=storeAcctId]").val(),
            fulfillmentCenterId: $("#fulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val(),
            salesType: $('input[name=salesType]:checked').val(),
            fullCateName: tempFileName
        })
    })
}

// 获取刊登类目对应的标题字数限制
function getListingTitleLimitRemark() {
    let tempFileName = $('#publishLayerAmazonListingName').text()
    tempFileName = tempFileName.replaceAll('  >>  ', '/')
    return commonReturnPromise({
        url: `/lms/amazonListing/getListingTitleLimitRemark`,
        type: 'get',
        params: {
            categoryId: $("#amazon_online_creatListing_cateItem-hidden2").val(),
            fullCateName: tempFileName,
            salesSite: $("#AmazonTemplateForm .salesSite").val()
        }
    })
}

// 获取类目属性数据
// amazonCateId:number  [亚马逊类目id]
// prodPId:number
// siteId:number  [站点id]
function getDataStoreTemplateQuerySkuInfoAndCateAttr(amazonCateId,prodPId,siteId){
    let tempFileName = $('#publishLayerAmazonListingName').text() || $("#amazonPublishModifyAmazonTemplateView .fullCateName").val()
    tempFileName = tempFileName.replaceAll('  >>  ', '/')
    return commonReturnPromise({
        url: `/lms/amazonPublishModel/querySkuInfoAndCateAttr`,
        type: 'post',
        params: {
            categoryId: amazonCateId,
            prodPId: prodPId,
            salesSite: siteId,
            fullCateName: tempFileName
        }
    })
}

// 获取映射oa属性数据接口
// variationTheme:
function getDataStoreTemplateGetAmzAttrByVariationTheme(variationTheme){
    return commonReturnPromise({
        url: `/lms/amazonPublishModel/getAmzAttrByVariationTheme`,
        type: 'get',
        contentType: 'application/json',
        params:{"prodPId": $("input[name=storeTemplateBaseId]").val(),
            "variationTheme":variationTheme}
    })
}

// 查询FulfillmentCenterId可用值
function getFulfillmentCenterId(data) {
    return commonReturnPromise({
        url: `/lms/amazonListing/getFulfillmentCenterId`,
        type: 'GET',
        params: data
    })
}

function getRequiredVal(data) {
    return commonReturnPromise({
        url: `/lms/amazonListing/getRequiredWeightAttrByFulfillmentCenterId`,
        type: 'GET',
        params: data
    })
}


// 立即刊登接口
function amazonPublishListingNow(listingIds, storeAcctId, singleReListingSub, listingStatus, tempFileName) {
    return commonReturnPromise({
        url: `/lms/amazonListing/publishListingNow`,
        type: 'POST',
        contentType: 'application/json',
        params: JSON.stringify({
            salesSite: $("#amazonPublish_searchForm select[name=salesSite]").val(),
            listingIds: listingIds,
            storeAcctId: storeAcctId,
            singleReListingSub: singleReListingSub,
            listingStatus: listingStatus,
            // tempFileName: tempFileName,
        })
    })
}

// 定时刊登接口
function amazonPublishListingTiming(listingIds, listingTime) {
    return commonReturnPromise({
        url: `/lms/amazonListing/publishListingTiming`,
        type: 'POST',
        contentType: 'application/json',
        params: JSON.stringify({
            listingIds: listingIds,
            listingTime: listingTime
        })
    })
}

// 错误类型接口
function amazonPublishGetAmazonListingErrorCodeAndDesc() {
    return commonReturnPromise({
        url: `/lms/amazonListing/getAmazonListingErrorCodeAndDesc`,
        type: 'GET'
    })
}

// 所有创建人
function amazonPublishGetAllCreator() {
    return commonReturnPromise({
        url: `/lms/amazonListing/getAllCreator`,
        type: 'GET'
    })
}

amazonPublishGetAllCreator().then(res=>{
    let str = ''
    res.forEach(item =>{
        str += `<option value="${item.creator}"></option>`
    })
    $("#amazonPublishCreater").html(str)
})

amazonPublishGetAmazonListingErrorCodeAndDesc().then(result=>{
    var errorCode=result;
    var labelStr="<option value=''>请选择</option>";
    $(errorCode).each(function () {
        labelStr+="<option value='"+this.code+"'>"+this.desc+"</option>";
    });
    $("#amazonPublish_searchForm select[name=listingRespCode]").html(labelStr);
})

function amazonListingPublish(listingId, singleReListingSub) {

    var listingStatus = $("#amazonPublish_searchForm input[name=listingStatus]").val();
    var storeAcctId = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
    // var tempFileName = $("#amazonPublish_searchForm select[name=tempFileName]").val();
    // if((listingStatus==0 || listingStatus==2)&&!tempFileName){//待刊登发起刊登,tempFileName必选
    //     layui.layer.msg("为保证刊登效率,发起刊登,必须选定一种刊登模板类型!");
    //     return;
    // }
    var paramData = new Array();
    var data;
    if (listingId) {//
        paramData.push(listingId);
    } else {
        //非单个子商品重新刊登
        if (!singleReListingSub) {
            data = $("#amazonPublish_table tbody input.pid-cbox:checked");
        } else {
            data = $("#amazonPublish_table tbody input.sid-cbox:checked");
        }

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                paramData.push(data[i].value);
            }

        }
    }
    if (paramData.length > 0) {
        // 立即刊登
        amazonPublishListingNow(paramData, storeAcctId, singleReListingSub, listingStatus, null).then(function (result) {
            layer.alert(result, { icon: 1 });
            amazonPublish_search();
        }).catch(function (err) {
            layer.alert(err, { icon: 2 });
        })
    }
    else {
        layui.layer.msg("请至少选择1条数据");
        return;
    }
}

function amazonPublish_relisting() {
    $.ajax({
        beforeSend: function () {
            loading.show();
        },
        url: ctx + '/amazonListing/oneClikRelisting.html',
        type: "post",
        dataType: "json",
        traditional: true,
        success: function (returnData) {
            if (returnData.code != "0000") {
                layer.alert(returnData.msg, { icon: 2 });
            } else {
                layer.msg('重新刊登成功，商品进入刊登流程');
                amazonPublish_search();
            }
        },
        complete: function () {
            loading.hide();
        },
    });
}

function amazonPublish_exportskumapping() {
    var data = amazonPublish_getSearchData();
    if (data.storeAcctId) {
        var Confirmindex = layer.confirm('确认导出当前搜索条件下的sku映射,导出时间较慢,请勿频繁尝试', { btn: ['确认', '取消'] }, function (result) {
            if (result) {
                layer.close(Confirmindex);
                submitForm(data, ctx + '/amazonListing/exportskumapping.html')
            }
        })
    } else {
        layer.msg("店铺不得为空");
    }
}

function amazonPublish_exportBaseInfo() {
    // var idList = $("#amazonPublish_table tbody input.prodTempId-text");
    var idList = $("#amazonPublish_table tbody input.sid-cbox:checked");
    var paramData = [];
    if (idList.length > 0) {
        for (var i = 0; i < idList.length; i++) {
            paramData.push(idList[i].value);
        }
        var obj = {};
        obj.salesSite = $("#amazonPublish_searchForm select[name=salesSite]").val();//销售站点
        obj.storeAcctId = $("#amazonPublish_searchForm select[name=storeAcctId]").val();
        obj.ids = paramData.join(",");
        submitForm(obj, ctx + '/amazonListing/exportskuBaseInfo.html');
    } else {
        layer.msg("至少勾选一条数据");
    }
}

function amazonPublish_delImg(obj) {
    // layer.confirm('您确认要删除图片？', {icon: 3, title: '提示'}, function (index) {
    var imgTotalNum = $(obj).closest('tr').find('li').length;
    imgTotalNum--;
    $(obj).closest('tr').find(".curImgNum").text(imgTotalNum);
    $(obj).closest('li').remove();
    layer.close(index);
    // });
}

function amazonPublish_setMainImg(obj) {
    var mainImgUrl = $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr("src");
    var mainImgShortName = $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr("shortname");
    var extImgUrl = $(obj).closest('li').find('input').val();
    var extImgShortName = $(obj).closest('li').find('input').attr("shortname");

    $(obj).closest('li').find('img').attr('src', mainImgUrl);
    $(obj).closest('li').find('input').attr('value', mainImgUrl);
    $(obj).closest('li').find('img').attr('shortname', mainImgShortName || '');
    $(obj).closest('li').find('input').attr('shortname', mainImgShortName || '');

    // $(obj).closest('.amazon_publish_variant').find('img').attr('src', extImgUrl || '');;
    $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr('src', extImgUrl || '');;
    $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr('shortname', extImgShortName || '');
    // $(obj).closest('.amazon_publish_variant').find('img').attr('shortname', extImgShortName || '');;
}

function amazonPublish_setOldMainImg (obj) {
    var mainImgUrl = $(obj).closest('tr').find('.amazonPublish_mainImg input[name=mainImg]').val();
    var mainImgShortName = $(obj).closest('tr').find('.amazonPublish_mainImg input[name=mainImg]').attr("shortname");
    var extImgUrl = $(obj).closest('li').find('input').val();
    var extImgShortName = $(obj).closest('li').find('input').attr("shortname");

    $(obj).closest('li').find('img').attr('src', mainImgUrl);
    $(obj).closest('li').find('input').attr('value', mainImgUrl);
    $(obj).closest('li').find('img').attr('shortname', mainImgShortName);

    $(obj).closest('tr').find('.amazonPublish_mainImg img').attr('src', extImgUrl);
    $(obj).closest('tr').find('.amazonPublish_mainImg input[name=mainImg]').attr('value', extImgUrl);
    $(obj).closest('tr').find('.amazonPublish_mainImg input[name=mainImg]').attr('shortname', extImgShortName);
    $(obj).closest('tr').find('.amazonPublish_mainImg img').attr('shortname', extImgShortName);
}
// 亚马逊新模板--删除图片
function amazonStore_delImg(obj) {
    var imgTotalNum = $(obj).closest('ul').find('li').length;
    imgTotalNum--;
    $(obj).closest('.imgContains').prev().find(".curImgNum").text(imgTotalNum);
    $(obj).closest('li').remove();
}
// 亚马逊新模板--设为主图
function amazonStore_setMainImg(obj) {
    var mainImgUrl = $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr("src");
    var mainImgShortName = $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr("shortname");
    var extImgUrl = $(obj).closest('li').find('img').attr("src");
    var extImgShortName = $(obj).closest('li').find('img').attr("shortname");

    // if (mainImgUrl) {
        $(obj).closest('li').find('img').attr('src', mainImgUrl || '');
        $(obj).closest('li').find('img').attr('shortname', mainImgShortName || '');
    // }
    // if (extImgUrl) {
        $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr('src', extImgUrl || '');
        $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr('shortname', extImgShortName || '');
    // }
}

function uniqueFunc(arr, uniId){
    const res = new Map();
    return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}

//isPublish 是否立即发布
function amazonPublish_editListingProd(id, isPublish, layero) {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$;
    var detailData = {};
    
    detailData.id = id;
    detailData.publishFlag = isPublish;
    detailData.itemName = $("#amazonPublish_editDetailForm input[name=itemName]").val();
    detailData.storePSku = $("#amazonPublish_editDetailForm input[name=storePSku]").val();

    detailData.recommendedBrowseNode = $("#amazonPublish_editDetailForm input[name=recommendedBrowseNode]").val();
    detailData.feedProductType = $("#amazonPublish_editDetailForm input[name=feedProductType]").val();
    detailData.itemType = $("#amazonPublish_editDetailForm input[name=itemType]").val();
    detailData.colorKeyName = $("#amazonPublish_editDetailForm input[name=colorKeyName]").val();
    detailData.sizeKeyName = $("#amazonPublish_editDetailForm input[name=sizeKeyName]").val();
    detailData.colorSizeKeyName = $("#amazonPublish_editDetailForm input[name=colorSizeKeyName]").val();
    detailData.fulfillmentCenterId = $("#amazonPublish_editDetailForm select[name=fulfillmentCenterId]").val();
    detailData.productDescription = amazonPublish_Info_desc_simditor.getValue(); //获取富文本的值
    detailData.genericKeywords = $("#amazonPublish_editDetailForm input[name=genericKeywords]").val();
    detailData.shippingType = $("#shippingType_oldDetail select[name=shippingType]").val();

    let attrKeyVal = '';
    let paramsArr = [];
    if (detailData.fulfillmentCenterId !== 'DEFAULT') {
        $.each($('#requireClass .layui-form-item'), function(index, obj) {
            let key = $(obj).find('.labelField').html();
            let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
            if (value) {
                let contennt = `${key}:${value}`
                paramsArr.push(contennt)
            }
        })
        attrKeyVal = paramsArr.join('#,#')

        detailData.attrKeyVal = expendAttr ? expendAttr + '#,#' + attrKeyVal : attrKeyVal;

        if (!expendAttr) {
            detailData.attrKeyVal = attrKeyVal;
        } else {
            if (attrKeyVal) {
                let expendArr = expendAttr.split('#,#')
                let attrKeyValArr = attrKeyVal.split('#,#')

                let attrList = []
                let expendList = []

                let attrKeyList = []
                let expendKeyList = []

                attrKeyValArr.forEach(item => {
                    let attrKey = item.split(':')[0]
                    let attrValue = item.split(':')[1]
                    attrKeyList.push(attrKey)
                    let obj = {
                        key: attrKey,
                        value: attrValue
                    }
                    attrList.push(obj)
                })
                expendArr.forEach(item => {
                    let attrKey = item.split(':')[0]
                    let attrValue = item.split(':')[1]
                    expendKeyList.push(attrKey)
                    let obj = {
                        key: attrKey,
                        value: attrValue
                    }
                    expendList.push(obj)
                })
                
                expendList = uniqueFunc(expendList, 'key')

                attrList.forEach(item => {
                    expendList.forEach(cItem => {
                        if (cItem.key === item.key) {
                            cItem.value = item.value
                        }
                    })
                    if (!expendKeyList.includes(item.key)) {
                        expendList.push({ key: item.key, value: item.value})
                    }
                })
                let str = ''
                expendList.forEach(item => {
                    str += item.key+':'+item.value+'#,#'
                })
                detailData.attrKeyVal = str.substr(0, str.length - 3)
            }
            if (!attrKeyVal) {
                detailData.attrKeyVal = expendAttr
            }
        }
    } else {
        detailData.attrKeyVal = expendAttr
    }

    if (detailData.productDescription) {
        if (detailData.productDescription.length > 2000) {
            layer.msg('描述过长,不能超过2000字符');
            return;
        }
    } else {
        layer.msg('描述不得为空');
        return;
    }

    // detailData.tag = $("#amazonPublish_editDetailForm input[name=tag]").val();
    detailData.listingStatus = $("#amazonPublish_searchForm input[name=listingStatus]").val();
    var editBulletPoints = "";
    $("#bulletPoint_Id input").each(function () {
        if (editBulletPoints) {
            editBulletPoints += "#,#" + $(this).val();
        } else {
            editBulletPoints = $(this).val();
        }
    })

    detailData.bulletPoints = editBulletPoints;


    //添加子sku
    detailData.prodListingSubSkuAmazons = amazonPublish_getSkusInfo();
    if (detailData.prodListingSubSkuAmazons.length < 1) {
        layer.msg('请至少保留一条子sku信息');
        return;
    }


    var hasColor = false;
    var hasSize = false;
    //
    var errMsg = "";
    var colorSizeJSON = {}; // 用于校验是否有重复的color_size
    var colorSize;
    $("#amazonPublish_SubSkuInfo").find("tr").each(function () {
        if ($(this).hasClass('amazonPublish_detail_pic_class')) {
            return;
        }

        //校验参数
        tdArr = $(this).children();
        varient = {};
        varient.size = tdArr.find('input[name=size]').val();
        if (varient.size) {
            hasSize = true;
        }

        if (hasSize) {
            if (varient.size) {
            } else {
                errMsg = "多变种模板，任一变种有尺寸，其他变种也当有尺寸";
                return;
            }
        }
        varient.color = tdArr.find('input[name=color]').val();
        if (varient.color) {
            hasColor = true;
        }
        var colorNew;
        if (hasColor) {
            if (varient.color) {
                //20190718取消了颜色校验
                // colorNew = varient.color.toLowerCase();
                // var colorArr = colorNew.split('&');//对每个颜色都要验证
                // var dataColor;
                // for (var i = 0; i < colorArr.length; ++i) {
                //     dataColor = colorArr[i];
                //     if ($.inArray(dataColor, merchantColors.toLowerCase().split(',')) == -1) {//判断是不是在amazon扩展色里面
                //         errMsg = "存在非法颜色" + varient.color;
                //         return;
                //     }
                // }
            } else {
                errMsg = "多变种模板，任一变种有颜色，其他变种也当有颜色";
                return;
            }
        }
        var colorSize = escapeJquery(varient.color + '-' + varient.size).replace(/[&\|\\\*^%$#@\s\/]/g, "")
        if (colorSizeJSON[colorSize]) {
            errMsg = "存在颜色和尺寸都相同的变种";//校验(颜色_尺寸)相同
            return;
        } else {
            colorSizeJSON[colorSize] = 1;
        }
    });
    if (errMsg) {
        layer.msg(errMsg);
        return;
    }
    $.ajax({
        beforeSend: function () {
            loading.show();
        },
        url: ctx + '/amazonListing/editListingDetail.html',
        type: "post",
        data: JSON.stringify(detailData),
        contentType: "application/json;charset=utf-8",
        success: function (returnData) {
            var resp = returnData
            if (resp.code == "0000") {
                layer.closeAll();
                if (isPublish) {
                    layer.msg('修改成功,并进入刊登流程');
                } else {
                    layer.msg('修改成功');
                }
                amazonPublish_search();
            } else {
                layer.alert(resp.msg, { icon: 2 });
            }
        },
        complete: function (returnData) {
            loading.hide();
        }
    });
}

// 2-2.辅图网络图片 老模板刊登详情
function amazonPublish_addExtPic(obj, type) {
    var index = layer.open({
        type: 1,
        title: '辅图网络图片',
        area: ['800px', '300px'],
        content: '<div style="padding: 20px"><textarea class="layui-textarea" id="netImgUrl5" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
        btn: ['确定', '关闭'],
        yes: function (layero) {
            //网络主图处理
            var urls = $.trim($("#netImgUrl5").val());
            if(urls&&urls!==""){
                var lis=""
                var urlArr = urls.split('\n')

            for (let i = 0; i < urlArr.length; i++) {
                getBase64And1000(urlArr[i]).then((base64) =>{
                    let file = dataURLtoBlob(base64, '1.jpg')
                    let formData = new FormData()
                    formData.append("file",file)
                    $.ajax({
                        url: ctx + "/prodTpl/uploadPic.html",
                        data: formData,
                        type: "POST",
                        async: true,
                        cache: false,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        beforeSend: function () {
                            loading.show();
                        },
                        success: function (res) {
                            loading.hide();
                            if (res.code == '0000') {
                                amazonPublish_downImgFromUrl5(obj, urlArr[i], false, res.data, type)
                            }
                        },
                        error: function (error) {
                            loading.hide();
                            // layer.msg(`${error.statusText}`, { icon: 2 });
                        }
                    })

                })
            }  

            layer.close(index);

        }

        }
    })
}

//网络辅图处理
/**
 * isLocal 是否本地
 */
function amazonPublish_downImgFromUrl5(obj, url, isLocal, shortName, type) {
    if (url == null || url == "") {
        layer.msg("图片地址不能为空！", { icon: 5 });
        return false;
    }
    var urlArray = url.split("\n");
    // 去一下空格
    for (var j in urlArray) {
        urlArray[j] = $.trim(urlArray[j]);
        //图片需要校验
        //需要以http开头
        if (!isLocal) {//网络图片url校验
            var startHttp = new RegExp(
                '^((https|http|ftp)+://){1}[^\\s]+$'
            );
            if (startHttp.test(urlArray[j]) != true) {
                layer.msg("网址格式不正确！url必须以http或https开头", { icon: 7 });
                return false;
            } else {
            }
            //端口开头的报错
            var ipPort = new RegExp(
                '^((https|http|ftp)+://){1}/?([0-9]{1,3}.){3}[0-9]{1,3}(:[0-9]{1,4}){1}/?[^\\s]*$'
            );


            if (ipPort.test(urlArray[j]) != true) {
            } else {
                layer.msg("网址格式不正确！amazon不支持url使用ip+端口,必须使用域名", { icon: 7 });
                return false;
            }
        }

    }

    var imgTotalNum2 = $(obj).closest('tr').find(".amazonSubImg_UL li").length;
    //辅图和子图最多AmazonPublish_skuImgLimit张
    var remainNum2 = AmazonPublish_skuImgLimit - imgTotalNum2;
    if ((urlArray.length + imgTotalNum2) > AmazonPublish_skuImgLimit) {
        remainNum2 = remainNum2 < 0 ? 0 : remainNum2;
        // $.fn.message({type: "success", msg: "最大支持" + maxUploadNum2 + "张图片,您还能上传" + remainNum2 + "张!"});
        layer.msg("最大支持共" + AmazonPublish_skuImgLimit + "张辅图,您最多还能上传" + remainNum2 + "张!", { icon: 7 });
        return false;
    }
    remainNum2 = urlArray.length > remainNum2 ? remainNum2 : urlArray.length;
    for (var i = 0; i < remainNum2; i++) {
        amazonPublish_showImg5(urlArray[i], obj, shortName, type);
    }
    return true;
}

function amazonPublish_showImg5(url, obj, shortName, type) {
    var tpl = '';
    if (type === 'isOldDetail') {
        tpl += old_amazonPublish_imgData['img']['tpl'];
    } else {
        tpl += amazonPublish_imgData['img']['tpl'];
    }
    var div = tpl.replace(/&{url}/g, url);
    div = div.replace(/:shortName/g, shortName);
    $(obj).closest('tr').find('.amazonSubImg_UL').append(div);
    var imgTotalNum = $(obj).closest('tr').find(".amazonSubImg_UL li").length;
    $(obj).closest('tr').find(".curImgNum").text(imgTotalNum);
}


var amazonPublish_imgData = {
    img: {
        head: '',
        tpl: '<li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">' +
            '<div class="ImgDivOut">' + 
            '<div style="width: 100%; display:flex;justify-content: center"><input type="radio" class="img-cbox" style="margin-left:-10px" name=":name" shortname=":shortName" lay-skin="primary" value=":value" lay-filter="swatchRadio"><span>设为swatch图</span></div>' +
            '<div class="ImgDivIn" style="width:150px;height:150px">' +
            '<input type="hidden" name="extImg" value="&{url}" shortname=":shortName">' +
            '<img  style="width:100%;height:100%;object-fit:contain;" src="&{url}" shortname=":shortName">' +
            '</div>' +
            '<div class="imgDivDown" style="width:150px">' +
            '<a onclick="amazonPublish_setMainImg(this);" href="javascript:void(0);" style="float:left; color: #73a1bf;">设为主图</a><a onclick="amazonPublish_delImg(this);" href="javascript:void(0);" style="float:right; color: #73a1bf;">移除</a>' +
            '</div></div></div></li>'
    }
}

var old_amazonPublish_imgData = {
    img: {
        head: '',
        tpl: '<li draggable="true" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">' +
            '<div class="ImgDivOut">' + 
            '<div class="ImgDivIn" style="width:150px;height:150px">' +
            '<input type="hidden" name="extImg" value="&{url}" shortname=":shortName">' +
            '<img  style="width:100%;height:100%;object-fit:contain;" src="&{url}" shortname=":shortName">' +
            '</div>' +
            '<div class="imgDivDown" style="width:150px">' +
            '<a onclick="amazonPublish_setOldMainImg(this);" href="javascript:void(0);" style="float:left; color: #73a1bf;">设为主图</a><a onclick="amazonPublish_delImg(this);" href="javascript:void(0);" style="float:right; color: #73a1bf;">移除</a>' +
            '</div></div></div></li>'
    }
}

function amazonPublish_getSkusInfo() {
    var subSkus = [];
    var tdArr;
    var varient;
    $("#amazonPublish_SubSkuInfo").find("tr").each(function () {
        if ($(this).hasClass('amazonPublish_detail_pic_class')) {
            return;
        }

        tdArr = $(this).children();
        varient = {};
        varient.id = tdArr.eq(0).text();
        if (varient.id) {
            varient.storeSSku = tdArr.eq(2).text();

            varient.externalProductId = tdArr.eq(4).find('input').val();
            varient.size = tdArr.find('input[name=size]').val();
            varient.color = tdArr.find('input[name=color]').val();
            varient.standardPrice = tdArr.find('input[name=standardPrice]').val();
            varient.quantity = tdArr.find('.quantity').val();
            varient.prodSSku = tdArr.find('input[name=prodSSku]').val();
        } else {
            varient.storeSSku = tdArr.eq(1).find('input').val();
            varient.weight = tdArr.find('input[name=weight]').val();
            varient.externalProductId = tdArr.eq(3).find('input').val();
            varient.size = tdArr.find('input[name=size]').val();
            varient.color = tdArr.find('input[name=color]').val();
            varient.standardPrice = tdArr.find('input[name=standardPrice]').val();
            varient.quantity = tdArr.find('.quantity').val();
            varient.prodSSku =  tdArr.find('input[name=prodSSku]').val();
        }

        var nextTr = $(this).next("tr");
        if ($(nextTr).hasClass('amazonPublish_detail_pic_class')) {//存储的图片
            varient.mainImageUrl = $(nextTr).find('.amazonPublish_mainImg input[name=mainImg]').attr("shortname") ? imgDomain + $(nextTr).find('.amazonPublish_mainImg input[name=mainImg]').attr("shortname") : $(nextTr).find('.amazonPublish_mainImg input[name=mainImg]').val();
            //辅图
            var otherImageUrl = "";
            $(nextTr).find('.amazonSubImg_UL li').each(function () {
                var extImg = '';
                if ($(this).find('input[name=extImg]').attr('shortname')) {
                    extImg = imgDomain + $(this).find('input[name=extImg]').attr('shortname');
                } else {
                    extImg = $(this).find('input[name=extImg]').val();
                }

                if (extImg) {
                    if (otherImageUrl) {
                        otherImageUrl = otherImageUrl + "|" + extImg
                    } else {
                        otherImageUrl = extImg;
                    }
                }
            });
            varient.otherImageUrl = otherImageUrl;
        }


        subSkus.push(varient);
    });
    return subSkus;
}

//定时刊登商品
function amazonPublish_OnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#amazonPublish_table tbody tr  input.pid-cbox:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    layer.open({
        type: 1,
        title: '定时刊登',
        btn: ['定时刊登'],
        //area: ['100%', '100%'],
        content: "加载中...",
        success: function (layero, index) {
            $(layero).find('.layui-layer-content').html($("#amazonPulish_listTimingTpl").html());
            //时间选择器
            layui.laydate.render({
                elem: '#amazonPulish_listTiming'
                , type: 'datetime'
                , format: 'yyyy-MM-dd HH:mm'
            });
        },
        yes: function (index, layero) {
            var listTiming = $(layero).find("input[name=listTiming]").val();
            if (listTiming) {
            }
            else {
                layer.msg("定时刊登开始时间不能为空");
                return;
            }
            // loading.show();
            // $.ajax({
            //     type: "post",
            //     url: ctx + "/amazonListing/listtiming.html",
            //     dataType: "json",
            //     data: {
            //         ids: ids.join(","),
            //         listTiming: new Date(listTiming).getTime(),
            //     },
            //     success: function (returnData) {
            //         loading.hide();
            //         if (returnData.code != "0000") {
            //             layer.msg(returnData.msg);
            //         } else {
            //             layer.msg("定时刊登成功");
            //             layer.close(index);
            //             amazonPublish_search();
            //         }
            //     }
            // });
            amazonPublishListingTiming(ids, new Date(listTiming).getTime()).then(function (result) {
                layer.alert(result, { icon: 1 });
                layer.close(index);
                amazonPublish_search();
            }).catch(function (err) {
                layer.alert(err, { icon: 2 });
            })
        }
    })
}

//取消定时刊登商品
function amazonPublish__canclePublishOnTiming() {
    var layer = layui.layer,
        $ = layui.$;
    var ids = [];
    //生成多个
    $("#amazonPublish_table tbody tr  input.pid-cbox:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }

    loading.show();
    $.ajax({
        type: "post",
        url: ctx + "/amazonListing/cancleListTiming.html",
        dataType: "json",
        data: {
            ids: ids.join(","),
        },
        success: function (returnData) {
            if (returnData.code != "0000") {
                loading.hide();
                layer.alert(returnData.msg);
            } else {
                layer.msg("取消定时刊登成功");
                amazonPublish_search();
            }
        }
    });
}

function amazonPublish__setShipping() {
    var ids = [];
    //生成多个
    $("#amazonPublish_table tbody tr  input.pid-cbox:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("未选中商品");
        return;
    }
    $.ajax({
        type: "post",
        url: ctx + "/amazonListing/setShipping.html",
        dataType: "json",
        data: {
            ids: ids
        },
        traditional: true,
        success: function (returnData) {
            loading.hide();
            if (returnData.code != "0000") {
                layer.alert(returnData.msg);
            } else {
                layer.msg("成功进入设置运费流程");
            }
        }
    });
}

/**
 * art-template语法扩展
 */
template.defaults.imports.dateFormat = function (datetime, fmt) {
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
};

function changeUpCase(str) {
    // str = str.toLocaleLowerCase();
    var newStr = str.replace(/\s[a-z]/g, function ($1) {
        return $1.toLocaleUpperCase()
    }).replace(/^[a-z]/, function ($1) {
        return $1.toLocaleUpperCase()
    }).replace(/\sOr[^a-zA-Z]|\sAnd[^a-zA-Z]|\sOf[^a-zA-Z]|\sAbout[^a-zA-Z]|\sFor[^a-zA-Z]|\sWith[^a-zA-Z]|\sOn[^a-zA-Z]/g, function ($1) {
        return $1.toLowerCase()
    });
    return newStr;
};

function amazonPublish_upCaseTitle() {
    var oldStr = $("#amazonPublish_editDetailForm input[name=title]").val();
    $("#amazonPublish_editDetailForm input[name=title]").val(changeUpCase(oldStr));
}

//移除子listing,仅删除样式
function removeAmazonSubListing(obj) {

    // TODO 删除的时候至少要有一个sku
    if ($("#amazonPublish_SubSkuInfo .amazonPublish_detail_pic_class").length == 1) {
        layer.msg("至少保存一条子sku");
        return;
    }

    var listingStatus = $("#amazonPublish_searchForm input[name=listingStatus]").val();
    if (listingStatus == 0 || listingStatus == 2) {
        $(obj).closest('tr').next("tr").remove();
        $(obj).closest('tr').remove();
    }
}

function addAmazonSubListing() {
    var region = $("#amazonPublish_editDetailForm input[name=region]").val();
    var currency = $("#amazonPublish_editDetailForm input[name=currency]").val();
    var listingStatus = $("#amazonPublish_editDetailForm input[name=listingStatus]").val();
    const listingStatusObj = {
        0: '待刊登',
        1: '成功',
        2: '失败',
        3: '刊登中',
    }
    var weightUnit = "GR";
    //指定EAN/UPC类型
    var aamzonPublish_productType = 'EAN';
    if (region == "EU") {
        aamzonPublish_productType = "EAN";
        weightUnit = "GR";
    } else if (region == "NA") {
        aamzonPublish_productType = "UPC";
        weightUnit = "OZ";
    } else if (region == "FE") {
        aamzonPublish_productType = "UPC";
        weightUnit = "GR";
    }
    //获取第一个sku的辅图列表
    var assistPicHtml = $("#amazonPublish_SubSkuInfo tr .amazonSubImg_UL").get(0).innerHTML;
    let fullCateId = $('#amazonPublish_editDetailForm select[name=fulfillmentCenterId]').val() || ''
    var quantityNum = '';
    if (fullCateId === 'DEFAULT') {
        quantityNum = 300
    } else {
        quantityNum = ''
    }
    // 老模板的图片 添加一行
    var tr = `<tr class="skuInfo">
                  <td hidden></td>
                    <td><input type="text" name="newStoreSSku" class="layui-input newStoreSSku" value=""><button type="button" class="layui-btn layui-btn-xs"
                              onclick="amazonPublish_autoSetWeightPrice(this)">自动补充</button></td>
                    <td class="upcExemptionFlag">`+ aamzonPublish_productType + `</td>
                    <td class="upcExemptionFlag"><input type='text' readonly class="layui-input amazonProductIdTypeId" value=''>
                        <button type="button"
                              class="layui-btn layui-btn-xs amazonPublish_clickGenUpcEan" 
                              onclick="reFresh_productId_amazonListing(this,'`+ aamzonPublish_productType + `')">重新生成
                        </button>
                       <button type="button"
                              class="layui-btn layui-btn-xs"
                              onclick="clear_productId_amazonListing(this,'')">清空
                        </button>
                    </td>
                  <td><input type='text' class="layui-input" name="size" value=''
                             onkeyup="value=value.replace(/[^/&apos;/&quot;\\a-\\z\\A-\\Z0-9\u4E00-\u9FA5\\[\\]\\{\\}\\(\\)\\-\\&\\'\\.\\ ]/g,'')">
                  </td>
                  <td><input type='text' class="layui-input" name="color" value=''
                             onkeyup="value=value.replace(/[^/&apos;/&quot;\\a-\\z\\A-\\Z0-9\u4E00-\u9FA5\\u0800-\u4e00\\[\\]\\{\\}\\(\\)\\-\\&\\'\\.\\ ]/g,'')">
                  </td>
                  <td class="purchaseCostPrice"></td>
                  <td><input type='text' name='weight'  type='number' class="layui-input amzonPublish_detail_weight" value=''><label>`+ weightUnit + `</label></td>
                  <td class="outerBoxSize">
                    <div>长：</div>
                    <div>宽：</div>
                    <div>高：</div>
                  </td>
                  <td>
                    <div class="layui-input-inline disflex">
                        <input type='number' class="layui-input amzonPublish_detail_cost" value='' name="standardPrice">
                        <label>`+ currency + `</label>
                    </div>
                    <a class="layui-btn layui-btn-xs fulfillmentCenterId" onclick="amazonPublish_updateProfitRate(this,'input')">更新利润率</a>
                </td>
                  <td class="notFulfillmentCenterId"><input type='number' class="layui-input quantity" value='`+ quantityNum +`'></td>
                  <td hidden name='prodSSku'></td>
                  <td hidden name='prodTempId'></td>
                  <td class="fbaCharge fulfillmentCenterId"></td>
                  <td class="firstLogisticsFee fulfillmentCenterId"></td>
                  <td class="fbaProfitRate fulfillmentCenterId">
                    <div>快递利润率：<span class="airTransportProfitRate"></span></div>
                    <div>空派利润率：<span class="airDeliveryProfitRate"></span></div>
                    <div>海运利润率：<span class="seaTransportProfitRate"></span></div>
                  </td>
                  <td>${listingStatusObj[listingStatus]}</td>
                  <td>
                    <button type="button" class="layui-btn layui-btn-sm"
                            onclick="removeAmazonSubListing(this)">移除
                    </button>
                    <input type="hidden" value="" name="prodSSku">
                    <input type="hidden" value="" name="purchaseCostPrice">
                    <input type="hidden" value="" name="outerBoxLength">
                    <input type="hidden" value="" name="outerBoxWidth">
                    <input type="hidden" value="" name="outerBoxHeight">
                    <input type="hidden" value="${currency}" name="currency">
                  </td>
                </tr>
                <tr class="amazonPublish_detail_pic_class">
                  <td colspan="15">
                    <div>
                        <div class="ImgDivIn amazonPublish_mainImg" style="height:300px;width: 280px;float: left">
                          <input type="hidden" name="mainImg" value="" shortname="">
                          <img style="height:150px;max-width: 150px" src="" class='b1'>
                        </div>

                        <div style="overflow: hidden">
                          <div>
                            <button style="float:left" type="button" class="layui-btn layui-btn-sm" onclick="amazonPublish_addExtPic(this, 'isOldDetail')">网络图片</button>
                            <button type="button" class="layui-btn layui-btn-sm ml5 mt05 addImgByTpl"  data-prodssku="" onclick="amazon_publish_addImgByTpl(this)">模板图片</button>
                            <div style="float:left" class="amazonPublish_extPic_edit_local"></div>
                            <div class="p0">
                                <div class="mTop5" style="margin-top: 1px;margin-bottom: 10px;">
                                    <span class="layui-bg-red">说明！</span>
                                    <span class="fColor2">点击图片拖动，即可调整图片顺序！</span>
                                    <span class="fColor2 mLeft10">「子sku辅图最多选用<span class="maxImgNum fRed">`+AmazonPublish_skuImgLimit+`</span>张，已经选用了<span class="curImgNum">
                                        0
                                      </span>张辅图</span>
                                </div>
                              </div>
                          </div>
                          <ul class="amazonSubImg_UL" style="overflow: hidden">`+ assistPicHtml + `
                          </ul>
                        </div>
                    </div>
                  </td>
                </tr>
`;
    $('#amazonPublish_SubSkuInfo').append(tr);
    // // 通过是直邮还是FBA,有无UPC展示不同的列
    const upcExemptionFlag = $('#amazonPublish_editDetailForm').find('input[name=upcExemptionFlag]').val() === 'true'
    if(upcExemptionFlag){
        $('#listingInfo_sub_tab').find('.upcExemptionFlag').each(function(){
            $(this).hide()
        })
    }
    if(fullCateId ==='DEFAULT'){
        $('#listingInfo_sub_tab').find('.fulfillmentCenterId').each(function(){
            $(this).hide()
        })
    }else{
        $('#listingInfo_sub_tab').find('.notFulfillmentCenterId').each(function(){
            $(this).hide()
        })
    }

    //本地图片绑定
    $("#amazonPublish_SubSkuInfo .amazonPublish_extPic_edit_local").each(function () {//初始化本地按钮
        amazonPublish_extPic_exchangeLocal($(this), 'isOldDetail');
    });
    var arr = $('#amazonPublish_editDetailForm .amazonSubImg_UL');//支持 移动图片
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            $(arr[i]).sortable({
                containment: "parent",
                cursor: "move",
            });
        }
    }
}

function amazonPublish_autoSetWeightPrice(obj) {
    var newStoreSSku = $(obj).parent("td").find('.newStoreSSku').val()
    var salesSite = $("#amazonPublish_editDetailForm input[name=salesSite]").val();
    var storeAcctId = $("#amazonPublish_editDetailForm input[name=storeAcctId]").val();
    let tempFileName = $('#publishLayerAmazonListingName').text();
    $.ajax({
        type: 'post',
        url: ctx + '/amazonListing/autoSetWeightPrice',
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            categoryId: $("#amazon_online_creatListing_cateItem-hidden2").val(),
            fullCateName: tempFileName.replaceAll('  >>  ', '/'),
            newStoreSSku: newStoreSSku,
            storeAcctId: storeAcctId,
            salesSite: salesSite,
            fulfillmentCenterId: $("#amazonPublish_editDetailForm select[name=fulfillmentCenterId]").val()
        }),
        success: function (returnSkuData) {
            if (returnSkuData.code != "0000") {
                layer.alert(returnSkuData.msg, { icon: 2 });
                $(obj).parents("tr").find('.amzonPublish_detail_weight').val("")
                $(obj).parents("tr").find('.amzonPublish_detail_cost').val("")
                $(obj).parents("tr").find('.amazonPublish_clickGenUpcEan').click();
                $(obj).parents('tr').next().find('.amazonPublish_mainImg img').attr('src', "");
                $(obj).parents('tr').next().find('.amazonPublish_mainImg input[name=mainImg]').attr('value', "");
                // 自动补充和该sku的模板图片按钮有联动
                $(obj).parents('tr').next().find('.addImgByTpl').data('prodssku',"")
                return;
            }
            $(obj).parents("tr").find('.amzonPublish_detail_weight').val(returnSkuData.data.weight)
            $(obj).parents("tr").find('.amzonPublish_detail_cost').val(returnSkuData.data.standardPrice)
            $(obj).parents("tr").find('[name=prodSSku]').html(returnSkuData.data.prodSSku)
            $(obj).parents("tr").find('[name=prodTempId]').html(returnSkuData.data.prodTempId)
            $(obj).parents("tr").find('.amazonPublish_clickGenUpcEan').click();
            $(obj).parents('tr').next().find('.amazonPublish_mainImg img').attr('src', returnSkuData.data.mainImageUrl);
            $(obj).parents('tr').next().find('.amazonPublish_mainImg input[name=mainImg]').attr('value', returnSkuData.data.mainImageUrl);
            $(obj).parents('tr').find('.purchaseCostPrice').text(returnSkuData.data.purchaseCostPrice)
            $(obj).parents('tr').find('input[name=purchaseCostPrice]').val(returnSkuData.data.purchaseCostPrice)
            const {outerBoxHeight, outerBoxLength, outerBoxWidth, prodSSku } = returnSkuData.data
            const outerBoxSizeHtml = `<div>长：${[null,undefined].includes(outerBoxLength)?'':outerBoxLength}</div><div>宽：${[null,undefined].includes(outerBoxWidth)?'':outerBoxWidth}</div><div>长：${[null,undefined].includes(outerBoxHeight)?'':outerBoxHeight}</div>`
            $(obj).parents('tr').find('.outerBoxSize').html(outerBoxSizeHtml)
            $(obj).parents('tr').find('input[name=outerBoxHeight]').val(outerBoxHeight)
            $(obj).parents('tr').find('input[name=outerBoxLength]').val(outerBoxLength)
            $(obj).parents('tr').find('input[name=outerBoxWidth]').val(outerBoxWidth)
            $(obj).parents('tr').find('input[name=prodSSku]').val(prodSSku)
            // 自动补充和该sku的模板图片按钮有联动
            $(obj).parents('tr').next().find('.addImgByTpl').data('prodssku',returnSkuData.data.prodSSku)

        }
    })
}

function reFresh_productId_amazonListing(obj, type) {
    $.ajax({
        type: 'post',
        url: ctx + '/amazonListing/reFreshProductId.html',
        dataType: 'json',
        data: {
            type: (type == 'undefined' || !type) ? '' : type,
            salesSite: $('#salesSite').val() || $("#AmazonTemplateForm .salesSite").val()
        },
        success: function (returnSkuData) {
            if (returnSkuData.code != "0000") {
                layer.alert(returnSkuData.msg, { icon: 2 });
                return;
            }
            $(obj).closest('td').find('input').val(returnSkuData.msg);
        }
    })
}

function clear_productId_amazonListing(obj, type) {
    $(obj).closest('td').find('input').val("");
}

// 老模板的更新价格
function amazonListingPublish_updatePrice() {
    let plsswList = []
    $("#amazonPublish_SubSkuInfo").find(".skuInfo").each((index,item) => {
        let obj = {
            id: $(item).find('[name=id]').text(),
            storeSSku: $(item).find('[name=storeSSku]').text() || $(item).find('input[name=newStoreSSku]').val(),
            prodTempId: $(item).find('[name=prodTempId]').text()
        }
        plsswList.push(obj)
    })
    if (plsswList?.length === 0) {
        layer.msg('当前还没有生成sku！')
        return
    }
    let tempFileName = $('#publishLayerAmazonListingName').text()
    let obj = {
        categoryId: $("#amazon_online_creatListing_cateItem-hidden2").val(),
        fullCateName: tempFileName.replaceAll('  >>  ', '/'),
        id:$("[name=amazonListingId]").val(),
        fulfillmentCenterId:$("#amazonPublish_editDetailForm select[name=fulfillmentCenterId]").val(),
        salesSite: $("#amazonPublish_editDetailForm input[name=salesSite]").val(),
        storeAcctId: $("#amazonPublish_editDetailForm input[name=storeAcctId]").val(),
        plsswList: plsswList
    }
    getUpdateListingPrice(obj).then(res=>{
        res.forEach(item => {
            $(`.changePrice${item.id}`).find('.price').val(item.standardPrice)
        })
    })
}

function amazonPublish_getColorOfLogis_productTpl(name) {
    var alias = ''
    if (!name) {
        return alias
    }
    for (var i = 0; i < amazonPublish_totalLogis.length; ++i) {
        if (name == amazonPublish_totalLogis[i].name) {
            alias = amazonPublish_totalLogis[i].alias
            alias = alias ? alias : '#999999'
        }
    }
    return alias
}

//主辅图本地上传
function amazonPublish_extPic_exchangeLocal(obj, type) {
    //上传本地图片
    $(obj).Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 2048,	//默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/prodTpl/uploadPic.html",
        onSelect: function (files) {
            return true;
        },
        onUploadStart: function (file) {
        },
        onUploadSuccess: function (file, data, response) {
            
            data = $.parseJSON(data);
            console.log('data', data)
            if (data != null && data.code == '0000') {
                amazonPublish_downImgFromUrl5(obj, data.msg, true, data.data, type);
            } else {
                layer.msg(data.msg);//这里面的内容不知道写啥,同OA系统
            }
        }
    });
}

//已生成的详情框
function amazonPublish__copy_listing() {
    var layer = layui.layer,
        laytpl = layui.laytpl,
        $ = layui.$,
        form = layui.form;
    var ids = [];
    $("#amazonPublish_table tbody input[name=id]:checked").each(function () {
        ids.push($(this).val());
    });
    if (ids.length < 1) {
        layer.msg("必须先选中商品");
        return;
    }

    layer.open({
        type: 1,
        title: '复制模板',
        btn: ['保存', '取消'],
        area: ['100%', '100%'],
        content: "加载中...",
        end: function (index, layero) { },
        yes: function (index, layero) {

            var copyStore = layui.formSelects.value("copyStore_amazonPublish");
            var copyStoreList = []
            for (var j = 0; j < copyStore.length; j++) {
                copyStoreList.push(copyStore[j].val);
            }

            if (copyStoreList.length < 1) {
                layer.msg("至少选一个店铺");
                return;
            }
            var detailData = {};
            detailData.copyListingIds = ids;
            detailData.copy2StoreIds = copyStoreList;
            $.ajax({
                type: 'post',
                url: ctx + '/amazonListing/copyListing.html',
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: JSON.stringify(detailData),
                success: function (returnData) {
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                        return;
                    } else {
                        layer.closeAll();
                        layer.msg("复制成功");
                        amazonPublish_search();
                    }
                }
            })
        },
        success: function (layero, index) {
            var ids = [];
            var pSkus = [];
            var soreSkus = [];
            $("#amazonPublish_table tbody input[name=id]:checked").each(function () {
                ids.push($(this).val());
                pSkus.push($(this).closest('tr').find('.pSku_div').html());
                soreSkus.push($(this).closest('tr').find('.storeSku_div').html());
            });
            if (ids.length < 1) {
                layer.msg("必须先选中商品");
                return false;
            }

            var skuInfoStr = "";
            for (var i = 0; i < ids.length; i++) {
                skuInfoStr += "店铺父SKU:" + soreSkus[i] + "(商品父SKU:" + pSkus[i] + ")<br>";
            }
            var salesSite = $("#amazonPublish_searchForm select[name=salesSite]").val();
            $.ajax({
                type: 'post',
                url: ctx + '/sys/liststore.html',
                dataType: 'json',
                data: {
                    roleNames: "amazon专员",
                    platCode: "amazon"
                },
                async: false,
                traditional: true,
                success: function (returnData) {
                    if (returnData.code != "0000") {
                        layer.alert(returnData.msg, { icon: 2 });
                        return;
                    }
                    laytpl($("#amazonPulish_copyListingTpl").html()).render(returnData.data, function (html) {
                        $(layero).find('.layui-layer-content').html(html);
                        layui.formSelects.render('copyStore_amazonPublish');
                        $("#amazonPublish_skusInfo").append(skuInfoStr);
                    });
                }
            })
        }
    });
}

//愿意怎么弄怎么弄
function amazonPublish_updatePsku(psku) {
    var listingId = $('#amazonPublish_editDetailForm input[name=amazonListingId]').val();
    $.ajax({
        type: 'post',
        url: ctx + '/amazonListing/genStorePSku.html',
        dataType: 'json',
        async: true,
        data: JSON.stringify({ listingId: listingId }),
        contentType: 'application/json',
        success: function (returnData) {
            loading.hide()
            if (returnData.code == "0000") {
                $('#amazonPublish_editDetailForm input[name=storePSku]').val(returnData.data);
            } else {
                layer.alert(returnData.msg, { icon: 2 });
            }
        },
    });
}

// copy storeTemplate.js
// copy start
function transBoolentoStr(Bool) {
    return Bool ? '是' : '否'
}

// 展开所有
function expandAll(_this) {
    var tag = $(_this).attr('data-tag')
    if (tag === '1') {
        $(_this).parents('td').find('.expand').removeClass('hidden')
        $(_this).text('收起')
        $(_this).attr('data-tag', '0')
    } else {
        $(_this).parents('td').find('.expand').addClass('hidden')
        $(_this).text('展开所有')
        $(_this).attr('data-tag', '1')
    }
}
// copy end
