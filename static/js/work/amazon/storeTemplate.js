var amazon_template_create_desc_simditor //富文本的返回值
var createSwatch = '';
var prodId;
const AmazonPublish_skuImgLimit = 9
var searchTag = '';
var editTheme = '';
var eidtFulfillmentCenterId = '';
var editCateList = '';
var amazonType;
var editCategoryId = '';
var editProdCateId = '';
var editSalesType = '';
var needToAlert = 'true';
var isLangEng = true
var isCreate = true
var newTempSkuChooseOptionList = []
var tempSkuInfoCreateFirst = ''
var cateListResultNewTemp = ''
var newTempPreval = ''
var amazonCopyDataInfo = {}
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'laypage', 'laydate', 'upload', 'element','laytpl'], function () {
    var form = layui.form,
        admin = layui.admin,
        element = layui.element,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        laypage = layui.laypage,
        upload = layui.upload,
        $ = layui.jquery,
        table = layui.table;

    form.render()

    //日期范围选择
    laydate.render({
        elem: '#storeTemplate_createTime'
        ,range: true
    });

    // 初始化查询条件的数据
    storeTemplateSearchInitData()

    // render_hp_orgs_users("#storeTemplateForm");
    function storeTemplateSearchInitData(){
        // getDataStoreTemplateListuserbyrole()  创建人
        // getDataStoreTemplateamazonTemplaterole()  初始化开发专员

        // getDataByDepart()
        // getDataStoreTemplateGetlogisAttr（）  初始化开发类型
        // getDataStoreTemplateGetPreProdDevTypeEnum（）  初始化物流属性
        // getDataStoreTemplateGetSiteEnum（）  初始化站点
        Promise.all([getDataByDepart([]), getDataStoreTemplateGetlogisAttr(),getDataStoreTemplateGetPreProdDevTypeEnum(),getDataStoreTemplateGetSiteEnum(), getDataStoreTemplateListDepartbyrole()]).then(function(result){
            //责任人 --start--
            commonRenderSelect("storeTemplateTplCreatorId", result[0].templateCreatorList, {
                name: 'userName',
                code: 'id'
            })
            //责任人 --end--

            //初始化开发专员 --start--
            commonRenderSelect("amazonTemplateBizzOwnerIdList", result[0].bizzOwners, {
                name: 'userName',
                code: 'id'
            })
            //初始化开发专员 --end--

            //初始化责任人 --start--
            commonRenderSelect("storeTemplateResponsor", result[0].responsorList, {
                name: 'userName',
                code: 'id'
            })
            //初始化责任人 --end--

            // 初始化物流属性 --start--
            commonRenderSelect("storeTemplateLogisAttr", result[1], {
                name: 'name',
                code: 'name'
            })
            // 初始化物流属性 --end--

            // 开发类型 --start--
            commonRenderSelect("storeTemplateDevTypeList", result[2], {
                name: 'name',
                code: 'name'
            })
            // 开发类型 --end--

            // 初始化amazon站点 --start--
            commonRenderSelect("storeTemplateSalesSite", result[3], {
                name: 'name',
                code: 'code'
            })

            // 初始化部门
            $('#amazonTemplate_group_sel').append(getAOption('', ''))
            for (var i in result[4].orgTree) {
                setOrgs(result[4].orgTree[i], $('#amazonTemplate_group_sel'), 0)
            }
            // 初始化amazon站点 --end--
            formSelects.render("amazonTemplateBizzOwnerIdList")
            formSelects.render("storeTemplateLogisAttr")
            formSelects.render("storeTemplateDevTypeList")

            formSelects.render("storeTemplateisSaleStr")
            formSelects.value('isSaleStr', ['2'])

            form.render();
        }).catch(function(err){
            layer.msg(err.message,{icon:2})
        })
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

    // 清空
    $("#storeTemplateReset").click(function(){
        $("#storeTemplateForm")[0].reset();
        // 商品状态默认在售
        $("#storeTemplateForm select[name=isSale]").val("1")
        $("#storeTemplateForm input[name=cateId]").val('')
        // 禁售状态默认不禁售
        $("#storeTemplateForm select[name=sellable]").val("true")
        // amazon类目名称和id
        $("#storeTemplateClearAmazonCate").click()
        // 开发专员
        formSelects.value('amazonTemplateBizzOwnerIdList', [])
        // 开发类型
        formSelects.value('devTypeList', [])
        // 物流属性
        formSelects.value('logisAttr', [])
        // 图片状态
        // formSelects.value('imgStatus', [1,2])
        // 侵权状态
        // formSelects.value('tortPlat', [9])
    })

    // 选择OA类目
    $("#storeTemplateForm input[name=cateName]").click(function(){
        chooseCate('storeTemplateAmazonProduct')
    })

    //查询类目
    function chooseCate(id, inputId, divId, cateUrl, cateSearchUrl, func) {
        admin.itemCat_select(id, inputId, divId, cateUrl, cateSearchUrl,
            function (callback, conf) {
                if (func) {
                    func(callback, conf)
                } else {
                    $("#storeTemplateForm input[name=cateName]").val(conf)
                    $("#storeTemplateForm input[name=cateId]").val(callback.cateid)
                }
            })
    }

    // 删除OA类目
    $("#storeTemplateClearCate").click(function(){
        $("#storeTemplateForm input[name=cateName]").val('')
        $("#storeTemplateForm input[name=cateId]").val('')
    })

    // 删除amazon类目
    $("#storeTemplateClearAmazonCate").click(function(){
        $("#storeTemplateAmazonListingdiv3").text("")
        $("#storeTemplate_cateItemId").val("")
    })

    // 搜索
    $("#storeTemplateSearch").click(function(){
        storeTemplate_tableRender();
    })

    form.on('select(orgs_hp_template_pb)', function(data){
        let arr = data.value === '' ? [] : [data.value]
        getDataByDepart(arr).then(function(res) {
            // 开发专员 --start--
            commonRenderSelect("amazonTemplateBizzOwnerIdList", res.bizzOwners, {
                name: 'userName',
                code: 'id'
            })
            // 开发专员 --end--

            // 责任人 --start--
            commonRenderSelect("storeTemplateResponsor", res.responsorList, {
                name: 'userName',
                code: 'id'
            })
            // 责任人 --end--

            // 创建人 --start--
            commonRenderSelect("storeTemplateTplCreatorId", res.templateCreatorList, {
                name: 'userName',
                code: 'id'
            })
            // 创建人 --end--
            formSelects.render("amazonTemplateBizzOwnerIdList")

            form.render();
        })

    });

    // 表格列数据
    let cols = {
        storeTemplateBaseTableCols: [
            //基础模板表头
            [{
                title: '图片',
                templet: '#storeTemplateTableColsImg',
                width: 80
            }, {
                title: 'OA类目',
                field: 'cateTreeName',
            }, {
                field: 'enTitle',
                title: '英文标题',
            }, {
                field: 'cnTitle',
                title: '商品名',
            }, {
                field: 'bizzOwner',
                title: '开发专员',
            }, {
                field: 'pSku',
                title: '父SKU',
            }, {
                width: 500,
                title: "<table border='0' class='layui-table' width='100%'><tr><th width='30%'>子SKU</th><th width='20%'>颜色</th><th width='20%'>尺寸</th><th width='20%'>款式</th><th width='10%'>有无亚马逊模板</th></tr></table>",
                templet: "#storeTemplate_aep_producttpl"
            }, {
                field: 'createTime',
                title: '时间',
                width:200,
                templet: function(d){
                    return `<div style="text-align:left"><span>创建：</span><span>${Format(d.createTime||"",'yyyy-MM-dd hh:mm:ss')}</span></div>
                <div style="text-align:left"><span>审核：</span><span>${Format(d.auditTime||"",'yyyy-MM-dd hh:mm:ss')}</span></div>`
                }
            }, {
                field: 'operation',
                title: '操作',
                templet: '#storeTemplateOption'
            }]
        ],
        storeTemplateAmazonTableCols: [
            //亚马逊模板表头
            [{
                title: '图片',
                templet: '<div><img class="img_show_hide lazy b1" width="61" height="61" data-original="{{ d.pimg }}!size=60x60" data-onerror="layui.admin.img_noFind()"></div>',
                width: 80
            }, {
                field: 'fullCateName',
                title: '亚马逊类目',
                width: 190
            }, {
                field: 'enTitle',
                title: '英文标题',
                width: 180,
            }, {
                field: 'bizzOwner',
                title: '开发专员',
                width: 100
            }, {
                field: 'psku',
                title: '父SKU',
            }, {
                title: "<div style='width:150px;float: left;'>子SKU</div>" +
                "<div style='width:80px;float: left;'>颜色</div> " +
                "<div style='width:80px;float: left;'>尺寸</div> " +
                "<div style='width:80px;float: left;'>在售</div> ",
                width: 420,
                templet: '#storeTemplate_ssku'

            }, {
                field: 'storeNum',
                title: '刊登状态',
                templet: '#storetmplate_aep_storeNumTpl',
                width: 100
            }, {
                field: 'salesSite',
                title: '站点',
            }, {
                field: 'creator',
                title: '创建人',
            }, {
                field: 'createTime',
                title: '时间',
                width: 180,
                templet: function(d){
                    return `<div style="text-align:left"><span>创建：</span><span>${Format(d.createTime||"",'yyyy-MM-dd hh:mm:ss')}</span></div>`
                }
            }, {
                title: '操作',
                templet: '#storeTemplateAmazonOption'
            }]
        ]
    }

    // 监听Tab 基础模板&亚马逊模板
    element.on('tab(storeTemplateTabFilter)', function (data) {
        // 渲染表格
        storeTemplate_tableRender()
        //得到当前Tab的所在下标 0:基础模板, 1:亚马逊模板，控制某些查询条件的显示隐藏
        data.index == 1? $(".storeTemplateSearchDom").show():$(".storeTemplateSearchDom").hide()
        data.index == 1? $(".BasicsTemp").hide():$(".BasicsTemp").show()
    });

    // variation theme下拉框
    form.on('select(variationTheme)', function(data){
        let variationTheme = data.value
        renderVariationThemeTable(variationTheme)
    });

    form.on('select(publishThemeTableOaAttrSelect)', function(data){
        $(".amazon_publish_variant").hide()
        pskuTableData = []
    });

    // 更多选填属性
    $(document).on("click", "#publish_moreAttrBtn", function () {
        $("#publish_moreAttrBtn").next().toggle()
    })

    $(document).on("click","#newTempApplyOtherAttr",function(e) {
        e.preventDefault()
        // 对当前子sku的数据进行保存 应用到所有子sku
        let currentDom = $('#newTempSkuChoose')
        saveCreateAndDetailSkuNewData('newTemp', currentDom, 'apply')
    })

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
    $(document).on("click", "#temp_toogleLangBtn", function () {
        if (isLangType === 'en') return
        isLangEng = !isLangEng
        changeLang()
    })

    function changeLang() {
        $('#createRequireVal').find('.layui-form-item label').each((index, item) => {
            if (isLangEng) {
                $(item).html($(item).attr('data-eng'))    
            } else { 
                $(item).html($(item).attr('data-local'))
            }
        })
        $('#optionCreateValue').find('.layui-form-item label').each((index, item) => {
            if (isLangEng) {
                $(item).html($(item).attr('data-eng'))    
            } else { 
                $(item).html($(item).attr('data-local'))
            }
        })
    }

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

    form.on('select(newCreatefulfillmentCenterId)', function (data) {
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
      if(data.value == 'DEFAULT'){
          $(".quantity").val(300)
      }else{
          $(".quantity").val('')
      }
    });

    // 新建模板类目属性sku切换
    form.on('select(newTempSkuChoose)', function (data) {
        // 切换sku，保存上一个sku的数据，并获取当前sku的数据
        // 当前选择的值
        let currentValue = data.value;
        let currentDom = data.elem;
        saveCreateAndDetailSkuNewData('newTemp', currentDom)
        setNewDetailSkuData(currentDom, currentValue)
        // 更新 newTplPreval 为当前值，以便下次比较
        newTempPreval = currentValue;
    });

    
    form.on('radio(salesType)', function (data) {
        if (data.value == '1') {
            $('#AmazonTemplateCreateForm .variationClassBox').hide()
            $('#publishThemeTable').next().hide()
        } else {
            $('.variationClassBox').show()
            $('#publishThemeTable').next().show()
        }
    });

    // 渲染表格
    function storeTemplate_tableRender() {
        // 获取当前是基础模板0还是亚马逊模板1
        let nowStatus = $("#storeTemplateTabFilter").find(".layui-this").attr("status"),colsData,urlType;
        // 转换列
        nowStatus == "0"?colsData = cols.storeTemplateBaseTableCols:colsData = cols.storeTemplateAmazonTableCols
        // 转换url
        nowStatus == "0"?urlType = '/amazonBasicTemp/queryPage.html':urlType = '/amazonPublishModel/queryAmazonTemplatePage'

        // 获取查询的条件
        let obj = serializeObject($('#storeTemplateForm'));
        if(obj.createTime != ''){
            obj.startTime =obj.createTime.split(' - ')[0] + ' 00:00:00'
            obj.endTime =obj.createTime.split(' - ')[1] + ' 23:59:59'
        }

        obj.amazonTemplateBizzOwnerIdList == ''?obj.bizzOwnerIdList=[]: obj.bizzOwnerIdList = obj.amazonTemplateBizzOwnerIdList.split(",")
        obj.devTypeList == ''?obj.devTypeList=[]: obj.devTypeList = obj.devTypeList.split(",")
        obj.logisAttr == ''?obj.logisAttr=[]: obj.logisAttr = obj.logisAttr.split(",")
        obj.imgStatus == ''?obj.imgStatus=[]: obj.imgStatus = obj.imgStatus.split(",")

        obj.fullCateName = $("#storeTemplateForm pre[name=fullCateName]").text()

        var tableIns = table.render({
            elem: "#storeTemplateAmazonTable",
            method: 'post',
            url: ctx + urlType,
            where: obj,
            contentType: 'application/json',
            cols: colsData,
            id: "storeTemplateAmazonTable",
            page: true,
            limits: [20, 50, 100],
            limit: 100,
            done: function(res, curr, count){
                //得到数据总量
                nowStatus == "0"?$("#storeTemplateBaseTab").text(count):$("#storeTemplateAmazonTab").text(count)
                imageLazyload();
            }
        });
    }

    //类目绑定
    $('#storeTemplate_creatListing').on('click', function () {
        // 站点
        const siteCode = $("#storeTemplateForm select[name=salesSite]").val();

        if(siteCode) {
            layui.admin.itemCat_select('amazon_online_creatListing-publish3',
                'storeTemplate_cateItemId',
                'storeTemplateAmazonListingdiv3',
                "/amazon/getAmazonCateList.html?siteId=" + siteCode,
                "/amazon/searchAmazonCate.html?siteId=" + siteCode
            );
        }else{
            layer.msg("必须先选择站点");
        }
    });

    function localStorageClear(){
        localStorage.removeItem("amazonThemeTableAttrArr") // theme表格值
        localStorage.removeItem("AmazonCateAttrData")  // 类目属性数据
        localStorage.removeItem("AmazonSkuTableData")  // sku信息表的数据
    }

    let amazonThemeTableAttrArr = [],
        AmazonCateAttrData = [],
        AmazonSkuTableData = [];
    // 亚马逊模板数据回显 编辑模板
    function storeTempGetAmazonTemplateData(templateId) {
        getDataStoreTemplateQueryTemplateDetailByProdPId(templateId).then(function (data) {
            // 基础数据
            let amazonTemplateReturnData = {}

            amazonTemplateReturnData.pSku = data.psku || ''
            amazonTemplateReturnData.cateTreeName = data.cateTreeName || ''
            amazonTemplateReturnData.enTitle = data.enTitle || ''
            // amazonTemplateReturnData.prodDesc = data.productDescription || ''

            editTheme = data.variationTheme?.split("#,#")[0] || ''
            eidtFulfillmentCenterId = data.fulfillmentCenterId || 'DEFAULT'
            editCateList = data.requiredCateList.concat(data.optionalCateList) // 用于编辑模板
            pskuTableData = data.amazonPublishModelSDtoList || []
            editCategoryId = data.categoryId || ''
            editProdCateId = data.prodCateId || ''
            editSalesType = data.salesType || '1'

            $("#amazon_template_creatListing_cateItem-hidden2").val(editCategoryId)

            // variation theme 
            getVariationTheme(editTheme, false)

            // 渲染模板
            laytpl($("#storeTemplateContainer1").html()).render(amazonTemplateReturnData, function(html){
              $('#storeTemplateView1').html(html)
            });
            laytpl($("#storeTemplateContainer0").html()).render(amazonTemplateReturnData, function(html){
                $('#storeTemplateView0').html(html)
                $('#storeTemplateView0').find('[name=enTitle]').val(amazonTemplateReturnData.enTitle)
            });
            laytpl($("#storeTemplateContainer2").html()).render(amazonTemplateReturnData, function(html){
              $('#storeTemplateView2').html(html)
            });

             //监听一下标题input的输入
             let textLengthDom= $('#AmazonTemplateCreateForm #amazonPublishNewAmazonTemplate_titleLength');
             $('#AmazonTemplateCreateForm input[name=enTitle]').on('input', function(e){
                 let val = e.target.value;
                 textLengthDom.text(val.length);
                 if(val.length > 150){
                     textLengthDom.addClass('redTitle').removeClass('greenTitle');
                 }else{
                     textLengthDom.addClass('greenTitle').removeClass('redTitle');
                 }
             });  

            $('#titleRemark').html(data.listingTitleLimitRemark || '')

            $("#AmazonTemplateCreateForm .salesSite").val(data.salesSite) // 站点回显
            $(`#AmazonTemplateCreateForm input:radio[value=${data.salesType}]`).attr('checked','true'); // 售卖形式

            $("#AmazonTemplateCreateForm #storeTemplateAmazonListingName").text(data.fullCateName || '') // 类目
            
            // // 获取仓库 theme下拉框等数据 并处理
            // _initSpecificAttrFunc(data)
            // variation theme的下拉值
            AmazonCateAttrData = data
            var themeOptionList = '<option value="">请选择</option>';
            let variationThemeValidValues = (data.variations && data.variations[0]?.validValues) || data.variationThemeValidValues
            variationThemeValidValues?.split("#,#").forEach(function (attrVal) {
                themeOptionList += '<option value="' + attrVal + '">' + attrVal + '</option>';
            });
            $("#AmazonTemplateCreateForm select[name=variationTheme]").html(themeOptionList)
            $("#AmazonTemplateCreateForm select[name=variationTheme]").val(editTheme)

            $("#storeTemplateView2 input[name=keyword]").tagsinput();
            
            amazon_template_create_desc_simditor = autoSimditor('amazonTemplateDesc', data.productDescription || ''); //设置描述内容
            data.tag?.split(",").forEach((item,index)=>{ // 这里使用了tagsinput的样式
                $("#storeTemplateView2 input[name=keyword]").tagsinput('add', item);
            })

            // amazon子类目
            $("#AmazonTemplateCreateForm #storeTemplateLayerAmazonListingName").text(data.fullCateName)
            $("#AmazonTemplateCreateForm #storeTemplate_amazon_online_creatListing_cateItem-hidden2").val(data.categoryId)

            // 获取映射oa属性        
            let variationThemeOaSelected = [],oaAttr = '';
            setTimeout(() => {
                $("#AmazonTemplateCreateForm select[name=publishThemeTableOaAttrSelect]").each(function(){
                    variationThemeOaSelected.push({"oa":$(this).val(),'amz':''})
                })
    
                // console.log('variationThemeOaSelected', variationThemeOaSelected)
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
    
                let arr = []
                variationThemeOaSelected.forEach(item => {
                  let obj = [item.amz] + ':' + item.oa
                  arr.push(obj)
                })
                
                variationThemeOaSelected.forEach(item => {
                    if (item.oa?.length > 8) {
                        data.amazonPublishModelSDtoList?.forEach(function(cItem,index){
                            if("spliceString" in cItem){
                            }else{
                                cItem["spliceString"] = cItem[item.oa?.split("_")[0]] + '_' + cItem[item.oa?.split("_")[1]]
                            }
                        })
                    }
                })
                // 编辑时 不需要UPC/EAN product_id
                // 解析 colorMapValue sizeMapValue
                data.amazonPublishModelSDtoList.forEach(item => {
                  item.isEdit = true;
                //   item.otherImageUrl = item.otherImageList?.join('|')
                  if (item.attrKeyVal) {
                    item.attrKeyVal.split('#,#').forEach(cItem => {
                      let key = cItem.split(':')[0] || ''
                      let val = cItem.split(':')[1] || ''
                      if (key === 'colorMap') {
                        item.colorMapValue = val
                      }
                      if (key === 'sizeMap') {
                        item.sizeMapValue = val
                      }
                      if (key === 'spliceString') {
                        item.spliceString = val
                      }
                    })
                  }
                })
                // 显示变种参数 列表数据
                let returnData = {
                  prodListingSubSkuAmazons: data.amazonPublishModelSDtoList,
                  varietionThemeTable: arr
                }
                laytpl($("#prodListingSubSkuAmazonsCreateTable").html()).render(returnData, function(html){
                    $('#publishInfoCreateTable').html(html)
                    if ($("#publishInfoCreateTable .amazon_publish_variant").length > 0) {
                        $('.multi-box').show()
                    } else {
                        $('.multi-box').hide()
                        $('.allid-cbox').prop('checked', false)
                    }
                });
                $("#publishInfoCreateTable").find(".amazon_publish_variant").each((index,item) => {
                    let url = data.amazonPublishModelSDtoList[index]?.swatchImageUrlList.toString()
                    $(item).find(`input:radio`).attr('name','imgCbox'+index)
                    $(item).find(`input:radio[value='${url}']`).attr('checked','true')
                    $(item).find(`input:radio[value='${url}']`).data('select', true)
                    $(item).find(`input:radio[value='${url}']`).data('select', true)
                })
                form.render();
            },100)

            // 显示 子sku选择列表
            $('#newTempSkuAttr').show()
            // 显示子标题
            $('#newTempSSkuTitle').show()

            commonAddEventTitleToggle($('#newTempSSkuTitle'), 'amazon')

            // 根据生成的子 sku 数据 填充 newTempSkuChoose 下拉框
            newTempSkuChooseOptionList = data.amazonPublishModelSDtoList?.map(item => {
                if (item.prodSSku) {
                    return {
                        value: item.prodSSku,
                        label: item.prodSSku
                    }
                }
            })
            appendSelect($('#newTempSkuChoose'), newTempSkuChooseOptionList, 'value', 'label')
            // 给每一项添加保存数据
            pskuTableData.forEach(item => {
                let saveObj = {
                    subTitle: item.subTitle || '',
                    subBulletPoints: item.subBulletPoints || '',
                    subProductDescription: item.subProductDescription || '',
                    subGenericKeywords: item.subGenericKeywords || '',
                    subAttrKeyVal: item.subAttrKeyVal || ''
                }
                $('#newTempSkuChoose').find(`option[value="${item.prodSSku}"]`).attr('sskudata', JSON.stringify(saveObj))
            })
            // 默认选择第一项
            $('#newTempSkuChoose').val(newTempSkuChooseOptionList[0].value || '')
            // 页面显示第一项的数据
            let currentDom = $('#newTempSkuChoose')
            setNewDetailSkuData(currentDom, newTempSkuChooseOptionList[0].value) 
            newTempPreval = newTempSkuChooseOptionList[0].value || ''
            form.render('select')

        }).catch(function (err) {
            console.log('edit', err)
            layer.msg(err || "error", {icon: 2});
        })
    }

    function setTextLength(el, val, input) {
        if(val.length > 500) {
            val = val.substr(0,500)
            $(`input[name=${input}]`).val(val)
        }           
        $('#' + el).text(val.length);
    }
    //GPT生成20240602
    function amazonTempGenerateFromGPTFn(id, pLayero) {
      pLayero.on('click', '#amazonTempGenerateFromGPT',function(){
        //弹框
        layer.open({
          type: 1,
          title: 'GPT生成',
          btn: ['应用', '关闭'],
          area: ['60%', '80%'],
          id: 'amazonTempGenerateFromGPTLayTplId',
          content: $('#amazonTempGenerateFromGPTLayTpl').html(),
          success: function(layero){
            layui.form.render('checkbox');
            //赋值给关键词和标题输入框的data-prodpsku
            let prodpsku = pLayero.find('[name=pSku]').val();
            layero.find('[name=gpt_keywords]').attr('data-prodpsku', prodpsku);
            layero.find('[name=enTitle]').attr('data-prodpsku', prodpsku);
            //给关键词输入框赋值-根据id请求接口
            amazonTempGenerateFromGPT_keywordFn(layero,id)
            //点击prompt配置按钮出现弹框
            layero.find('#gpt_prompt_config').on('click', function(){
              amazonTempGenerateFromGPT_promptFn();
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
              amazonTempGenerateFromGPT_detailFn(gpt_keywords, salesSite, layero);
            });
            //全选反选事件
            amazonTempGenerateFromGPT_checkAllFn(layero);
            //复制勾选项
            amazonTempGenerateFromGPT_copyFn(layero);
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
                if(name != 'amazonTemplateDesc'){
                  if(name == 'enTitle'){
                    if(gptVal.length > 150){
                      pLayero.find(`[name=${name}]`).val(gptVal.split(0,150));
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
                  amazon_template_create_desc_simditor = autoSimditor('amazonTemplateDesc', gptVal.replace(/\n/g, "<br>"));
                }
              }
            });
            layer.close(index);
          }
        });
      });
    }
    //gpt渲染关键词
    function amazonTempGenerateFromGPT_keywordFn(layero,id){
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
    function amazonTempGenerateFromGPT_promptFn() {
      layer.open({
        type: 1,
        title: 'Prompt配置',
        btn: ['保存', '关闭'],
        area: ['80%', '40%'],
        id: 'amazonTempGenerateFromGPTPromptId',
        content: $('#amazonTempGenerateFromGPTPrompt').html(),
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
    function amazonTempGenerateFromGPT_detailFn(keywords, salesSite, layero){
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
          layero.find('[name=amazonTemplateDesc]').val(gptRes.description || ''); //描述
          layero.find('[name=sellingPoint1_1]').val(gptRes.sellingPoints[0] || ''); //卖点1
          layero.find('[name=sellingPoint1_2]').val(gptRes.sellingPoints[1] || ''); //卖点2
          layero.find('[name=sellingPoint1_3]').val(gptRes.sellingPoints[2] || ''); //卖点3
          layero.find('[name=sellingPoint1_4]').val(gptRes.sellingPoints[3] || ''); //卖点4
          layero.find('[name=sellingPoint1_5]').val(gptRes.sellingPoints[4] || ''); //卖点5
        }
      })
    }
    //gpt反选全选事件
    function amazonTempGenerateFromGPT_checkAllFn(layero){
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
    function amazonTempGenerateFromGPT_copyFn(layero){
      layero.find('.gpt-template-copy').on('click', function(){
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

    // 新建亚马逊模板弹窗
    // id：number [基础模板id]
    // amazonIndex: 0[基础模板]\1[亚马逊模板]
    // templateId 亚马逊模板保存时新加的
    function newAmazonTemplate(id,amazonIndex,fullCateName,templateId,oldFullCateName,categoryId,salesSite,templateId){
        prodId = id;
        let title = amazonIndex == 0?"新建亚马逊模板":"编辑亚马逊模板"
        amazonType = amazonIndex
        let popIndex = layer.open({
            title: title,
            type: 1,
            area: ['100%', '100%'],
            btn: ['保存', '关闭'],
            id: 'storeTemplateModifyAmazonTemplate1',
            content: $('#storeTempAndPublishAmazon').html(),
            end: function () {
                localStorageClear()
            },
            success: function (layero, index) {
                needToAlert = 'true'
                localStorageClear()
                editTheme = ''
                createSwatch = `<div style="width: 100%; display:flex;justify-content: center">
                <input type="radio" class="img-cbox" style="margin-left:-10px" name=":name" lay-skin="primary" value=":value" shortname=":shortName" lay-filter="swatchRadio" select="false"><span>设为swatch图</span></div>`
                $("input[name=storeTemplateBaseId]").val(id)
                // 获取基础数据
                getStoreTemplateData(id)
                //全选和反全选事件
                deletecheckbox_no_all()

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
                commonAmazonCate();

                // 选择amazon类目
                $("#storeTemplateAmazonListingName").change(function(){
                    // 站点
                    let siteCode = $("#AmazonTemplateCreateForm .salesSite").val();
                    // 根据cateId：类目id, siteId：站点 获取分类属性
                    initSpecificAttr($("#amazon_template_creatListing_cateItem-hidden2").val(), siteCode, id);
                    // 根据站点和类目 获取标题和描述 等信息
                    let prodCateId = $('#amazon_template_creatListing_cateItem-hidden2').attr('data-id');
                    getDescAndTitle(prodCateId, siteCode, id)
                });

                // amazonIndex == 0?"新建亚马逊模板":"编辑亚马逊模板"
                if(amazonIndex == 1) {
                  // 回显编辑数据
                  storeTempGetAmazonTemplateData(templateId)
                }
                form.render();

                //GPT生成202406002
                amazonTempGenerateFromGPTFn(id, $('#storeTemplateModifyAmazonTemplate1'));
            },

            yes:function (index,layero) {
              createSaveFn(templateId);
            }
        })
    }

    // 保存
    function createSaveFn(templateId) {
      let productDescription = amazon_template_create_desc_simditor.getValue(),prodListingSubSkuAmazons = [],
      bulletPoints = $("[name=sellingPoint1_1]").val() + '#,#' +
          $("[name=sellingPoint1_2]").val() + '#,#' +
          $("[name=sellingPoint1_3]").val() + '#,#' +
          $("[name=sellingPoint1_4]").val() + '#,#' +
          $("[name=sellingPoint1_5]").val();
        
        // 保存一下当前页面的子sku数据
        let currentDom = $('#newTempSkuChoose')
        saveCreateAndDetailSkuNewData('newTemp', currentDom, 'save')
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
  
          let errMsg = '';
          let ifSellerPointEmpty = false
          let ifDescEmpty = false
          $("#publishInfoCreateTable").find(".amazon_publish_variant").each((index,item) => {
              var attrValDemo = $("#publishInfoCreateTable").find(".amazon_publish_variant")[0] || ''
              var attrVal = $(attrValDemo).find('input[name=attrKeyVal]').val()
              let otherImageUrlArr = []
              $(item).find(".uploadImgUL img").each((index,cItem) => {
                if ($(cItem).attr("shortname")) {
                    otherImageUrlArr.push($(cItem).attr("shortname"))
                }
              })
              // 根据sku匹配到保存的数据
            let storeSSku = $(item).find('[name=storeSSku]').val() || $(item).find('[name=prodListingSubSkuAmazonsStoreSSku]').val()
            let saveDataObj = $('#newTempSkuChoose').find(`option[value="${storeSSku}"]`).attr('sskudata')
             // 描述校验
             let descSub = JSON.parse(saveDataObj).subProductDescription
 
             if (descSub && descSub.length > 2000) {
                layer.msg(storeSSku +'描述过长, 不能超过2000字符');
                ifDescEmpty = true
                return false;
             } 
             if (descSub === '') {
                 layer.msg(storeSSku + '描述不得为空');
                 ifDescEmpty = true
                 return false;
             }
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
           
              let mainImageUrl = $(item).find('[name=mainImg]').attr('shortname')
              let attrKeyValNew = '';
              let swatch = $(item).find(`input[name=imgCbox${index}]:checked`).attr('shortname')
              let obj = {
                  prodTempId: $(item).find('input[name=prodTempId]').val(),
                  mainImageUrl:mainImageUrl,
                  prodSSku: $(item).find('input[name=prodSSku]').val(),
                  swatchImageUrl: swatch,
                  otherImageUrl: otherImageUrlArr.join("|")
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
                  let val = newObjCopy[item]
                  if (item.length > 8) {
                  str = `spliceString:${val}`
                  }
                  str = `${item}:${val}`
                  attrStrArr.push(str)
              })
              obj.attrKeyVal = attrStrArr.join('#,#')
  
              obj = Object.assign(obj, newObj)
              if (saveDataObj) {
                obj = Object.assign(obj, JSON.parse(saveDataObj))
            }
              prodListingSubSkuAmazons.push(obj)
          })
  
          console.log('prodListingSubSkuAmazons', prodListingSubSkuAmazons)
  
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
          let fulfillmentCenterId = $("#createFulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val()
          let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
          $.each($('#newStoreTemplate_editspecificForm .layui-form-item'), function(index, obj) {
              let key = $(obj).find('.labelField').html();
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
          $.each($('#newStoreTemplate_editspecificForm .toggleClass'),function(index,obj) {  
              let key = $(obj).find('.labelField').html();
              let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
            //   if (fulfillmentCenterId === 'DEFAULT') {
                  if (requireVal.indexOf(key) > -1) {
                      key = ''
                  }
            //   }
            requreKeyList.push(key)
              if (key && !value) {
                  flag = true
              }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
          })
          let currentSsku = $('#newTempSkuChoose').val() || ''
          if (flag) {
            layer.msg(currentSsku + "必填的分类属性未填写！")
            return
          }
            // 如果当前页面sku的分类属性都填写完 那么将剩余的子sku和当前页面的进行比对
            // 只要必填的key存在就可以
            let ifAttrKeyValEmpty = false
            requreKeyList = requreKeyList.filter(item => item !== '')
            newTempSkuChooseOptionList?.forEach(item => {
                if (!ifAttrKeyValEmpty) {
                    let saveDataObj = $('#newTempSkuChoose').find(`option[value="${item.value}"]`).attr('sskudata')
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
          if(!$('input[name=salesType]:checked').val()) {
              layer.msg("请选择售卖形式！")
              return
          }
          searchTag = $("#storeTemplateView2 input[name=keyword]").val();
  
          // 标题：itemName、卖点：bulletPoints、描述：productDescription、价格：prodListingSubSkuAmazons
          handleSave(attrKeyVal, bulletPoints, searchTag, variationThemeData, productDescription, prodListingSubSkuAmazons, templateId);
      }

    function handleSave(attrKeyVal, bulletPoints, searchTag, variationThemeData, productDescription, prodListingSubSkuAmazons, templateId) {
        let data ={
            "prodPId": $("input[name=storeTemplateBaseId]").val(),
            "needToAlert": needToAlert,
            "salesSite":  $("#AmazonTemplateCreateForm .salesSite").val(),
            "prodCateId": $("#amazon_template_creatListing_cateItem-hidden2").attr('data-id') || editProdCateId,
            "attrKeyVal": attrKeyVal,
            "bulletPoints": bulletPoints,
            "enTitle": $("#AmazonTemplateCreateForm input[name=enTitle]").val(),
            "tag": searchTag,
            "variationTheme": variationThemeData,
            // "fulfillmentCenterId": $("#createFulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val(),
            "productDescription":productDescription,
            "prodListingSubSkuAmazons": prodListingSubSkuAmazons,
            "salesType": $('input[name=salesType]:checked').val()
        }
        if (amazonType !== '0' ) {
            data.id = templateId
        }

        commonReturnPromise({
            type: 'post',
            url: ctx + `/amazonPublishModel/createOrUpdateAmazonTemplate`,
            contentType: 'application/json',
            params: JSON.stringify(data)
        }).then(() => {
            layer.closeAll()
            layer.msg('保存成功', { icon: 1 })
            // amazonPublish_searchProd()
        }).catch(err => 
            layer.alert(err, {
                btn: ['继续保存', '取消'],
                icon: 2,
                yes: function() {
                    needToAlert = 'false'
                    handleSave(attrKeyVal, bulletPoints, searchTag, variationThemeData, productDescription, prodListingSubSkuAmazons, templateId)
                },
                btn2: function() {
                    console.log('取消')
                }
            })
        )

    }

    function deletecheckbox_no_all() {
      /*获取表头checkbox和美化后的元素*/
      var form = layui.form
      // //父id全选
      let pId_cbox_All = $('.allid-cbox')
  
      /*父id全选和反全选事件*/
      form.on('checkbox(allBox)', function(data){
          let isChecked = data.elem.checked
          if (isChecked) {
              console.log('pId_cbox_All', $('#publishInfoCreateTable').find('tbody input.pid-cbox'))
              $('#publishInfoCreateTable').find('tbody input.pid-cbox').next().addClass('layui-form-checked')
              $('#publishInfoCreateTable').find('tbody input.pid-cbox').prop('checked', true)
          } else {
              $('#publishInfoCreateTable').find('tbody input.pid-cbox').next().removeClass('layui-form-checked')
              $('#publishInfoCreateTable').find('tbody input.pid-cbox').prop('checked', false)
          }
        });
      $('.allid-cbox').on('click',function () {
          /*获取checkbox的状态*/
          var isChecked = pId_cbox_All.prop('checked')
          console.log('isChecked', isChecked)
          if (isChecked) {
              $('#publishInfoCreateTable .pid-cbox').prop('checked', true)
          } else {
              $('#publishInfoCreateTable .pid-cbox').prop('checked', true)
          }
      });
    }
    
    // 获取标题 描述 检索词 标题限制
    function getDescAndTitle(prodCateId, siteCode, id) {
      getItemNameAndProductDesByProdPIdAndSalesSite(prodCateId, siteCode, id).then(res => {
        tempSkuInfoCreateFirst = res
        $('#titleRemark').html(res.listingTitleLimitRemark || '')
        $('#AmazonTemplateCreateForm input[name=enTitle]').val(res.itemName || '')
        $('#amazonPublishNewAmazonTemplate_titleLength').text((res.itemName || '').length)
        if((res.itemName || '').length > 150){
            $('#amazonPublishNewAmazonTemplate_titleLength').addClass('redTitle').removeClass('greenTitle');
        }else{
            $('#amazonPublishNewAmazonTemplate_titleLength').addClass('greenTitle').removeClass('redTitle');
        }
        // amazon_template_create_desc_simditor = autoSimditor('amazonTemplateDesc', res.productDescription || ''); //设置描述头内容
        // // let keyword = res.keyword?.replace(/\,/g,"\n")
        // // $('#AmazonTemplateCreateForm textarea[name=keywordText]').html(keyword)

        //   $("#storeTemplateView2 input[name=keyword]").tagsinput("removeAll");
        //   res.keyword?.split(",").forEach((item,index)=>{
        //     $("#storeTemplateView2 input[name=keyword]").tagsinput('add', item);
        // })
      })
    }

    // 规则表格操作监听
    table.on('tool(storeTemplateAmazonTable)', function (obj) {
        var layEvent = obj.event; //获得 lay-event 对应的值
        var trdata = obj.data; //获得当前行数据
        if (layEvent === 'modify') {
            // 新建亚马逊模板
            isCreate = true
            newAmazonTemplate(trdata.id,0,'','','','','')
            $('#temp_toogleLangBtn').show()
        }else if(layEvent === "amazonModify"){
            // 修改Amazon模板
            isCreate = false
            newAmazonTemplate(trdata.prodPId,1,trdata.fullCateName,trdata.templateId,trdata.fullCateName,trdata.categoryId,trdata.salesSite,trdata.id)
        }else if(layEvent === "amazonDelete"){
            // 删除Amazon模板
            var layerIndex = layer.confirm('您确认要删除该模板吗？', {
                btn: ['确定', '取消'], //按钮
                icon: 7
            }, function () {
                getDataStoreTemplateDeleteAmazonTemplate(trdata.id,trdata.fullCateName,trdata.categoryId,trdata.salesSite,trdata.id).then(function(result){
                    layer.close(layerIndex)
                    storeTemplate_tableRender();
                    layer.msg(result,{icon:1});
                }).catch(function(err){
                    layer.msg(err, {icon:2});
                })
            }, function () {
                layer.msg('已取消');
            });
        }else if(layEvent === "amazonCopy"){ // 复制
            isCreate = false
            let popIndex = layer.open({
                title: '复制',
                type: 1,
                area: ['100%', '100%'],
                btn: ['保存', '关闭'],
                id: 'storeTemplateModifyAmazonTemplate1',
                content: $('#storeTempAndPublishAmazon').html(),
                success: function (layero, index) {
                    amazonType = 3
                  prodId = trdata.prodPId;
                  createSwatch = `<div style="width: 100%; display:flex;justify-content: center">
                    <input type="radio" class="img-cbox" style="margin-left:-10px" name=":name" lay-skin="primary" value=":value" shortname=":shortName" lay-filter="swatchRadio" select="false"><span>设为swatch图</span></div>`
                    Promise.all([getDataStoreTemplateGetSiteEnum(), getDataStoreTemplateAmazonCopyModel(trdata.id)]).then(function(result){
                      // 初始化站点
                      let option = "<option value=''></option>";
                      $(result[0]).each(function() {
                          option += `<option value=${this.code}>${this.name}</option>`
                      });
                      $("#AmazonTemplateCreateForm .salesSite").html(option)
                      $("input[name=storeTemplateBaseId]").val(result[1].prodPId)
                        // 基础数据
                        let amazonCopyData = {}
                        let data = result[1]
                        amazonCopyData.pSku = data.psku || ''
                        amazonCopyData.cateTreeName = data.cateTreeName || ''
                        amazonCopyData.enTitle = data.enTitle || ''
                        amazonCopyData.itemName = data.enTitle || ''
                        amazonCopyData.productDescription = data.productDescription || ''
                        amazonCopyData.keyword = data.keyword || ''
                        amazonCopyData.sellingPointStyle1_1 = data.sellingPointStyle1?.split("#,#")[0] || ''
                        amazonCopyData.sellingPointStyle1_2 = data.sellingPointStyle1?.split("#,#")[1] || ''
                        amazonCopyData.sellingPointStyle1_3 = data.sellingPointStyle1?.split("#,#")[2] || ''
                        amazonCopyData.sellingPointStyle1_4 = data.sellingPointStyle1?.split("#,#")[3] || ''
                        amazonCopyData.sellingPointStyle1_5 = data.sellingPointStyle1?.split("#,#")[4] || ''
                        amazonCopyData.sellingPoint1Length = data.sellingPointStyle1?.split("#,#")[0]?.length || 0
                        amazonCopyData.sellingPoint2Length = data.sellingPointStyle1?.split("#,#")[1]?.length || 0
                        amazonCopyData.sellingPoint3Length = data.sellingPointStyle1?.split("#,#")[2]?.length || 0
                        amazonCopyData.sellingPoint4Length = data.sellingPointStyle1?.split("#,#")[3]?.length || 0
                        amazonCopyData.sellingPoint5Length = data.sellingPointStyle1?.split("#,#")[4]?.length || 0
                        tempSkuInfoCreateFirst = JSON.parse(JSON.stringify(amazonCopyData))

                        // 渲染模板
                        laytpl($("#storeTemplateContainer1").html()).render(amazonCopyData, function(html){
                          $('#storeTemplateView1').html(html)
                        });
                        laytpl($("#storeTemplateContainer0").html()).render(amazonCopyData, function(html){
                            $('#storeTemplateView0').html(html)
                            $('#storeTemplateView0').find('[name=enTitle]').val(amazonCopyData.enTitle)
                            commonAddEventTitleToggle($('#storeTemplateModifyAmazonTemplate1'), 'amazon')
                        });
                        // laytpl($("#storeTemplateContainer2").html()).render(amazonCopyData, function(html){
                        //   $('#storeTemplateView2').html(html)
                        // });
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

                        $(`#AmazonTemplateCreateForm input:radio[value=${data.salesType}]`).attr('checked','true'); // 售卖形式

                        //类目绑定
                        commonAmazonCate();

                        // 选择amazon类目
                        $("#storeTemplateAmazonListingName").change(function(){
                          // 站点
                          let siteCode = $("#AmazonTemplateCreateForm .salesSite").val();
                          // 根据cateId：类目id, siteId：站点 获取分类属性
                          initSpecificAttr($("#amazon_template_creatListing_cateItem-hidden2").val(), siteCode, trdata.id);
                          // 根据站点和类目 获取标题和描述 等信息
                          let prodCateId = $('#amazon_template_creatListing_cateItem-hidden2').attr('data-id');
                          // getDescAndTitle(prodCateId, siteCode, id);
                        });

                        // 售卖形式 是否显示映射表 和 variation theme
                        if (data.salesType == '1') {
                          $('#AmazonTemplateCreateForm .variationClassBox').hide()
                          $('#publishThemeTable').next().hide()
                        }

                        form.render()
                    }).catch(function(err){
                        console.log('err', err);
                        layer.msg(err, {icon:2});
                    })
                },
                yes: function (index, layero) {
                  createSaveFn();
                }
            })
        }
    })

    function commonAmazonCate() {
      //类目绑定
      $('#storeTemplateLayer_creatListing').on('click', function () {
        // 站点
        let siteCode = $("#AmazonTemplateCreateForm .salesSite").val();
        if(siteCode) {
            layui.admin.itemCat_select('amazon_online_creatListing-publish2',
                'amazon_template_creatListing_cateItem-hidden2',
                'storeTemplateAmazonListingName',
                "/amazon/getAmazonCateList.html?siteId=" + siteCode,
                "/amazon/searchAmazonCate.html?siteId=" + siteCode,
                null,
                { isNeedPrediction: true, prodId, salesSite: siteCode }
            );
        }else{
            layer.msg("必须先选择站点");
        }
      });
    }

    // 批量删除
    $(document).on("click", ".storeTemplateDeleteAll", function () {
        let _that = $(this);
        layer.confirm('你确定要删除全部吗？', {
            btn: ['确定', '取消'], //按钮
            icon: 7
        }, function () {
            _that.parent().last().find(".uploadImgUL").empty();
            layer.msg('已删除', {icon: 1});
        }, function () {
            layer.msg('已取消');
        });
    })

    // 监听sku信息表所有的input，更新localstorage的数据
    $(document).on("blur", "input[name='storeTemplateLayerSkuChildDataInput']", function (e) {
        //   更新
        let index = $(this).parents("tr").attr("data-index")  // index
        let name = $(this).parents("td").attr("data-field") // color
        name == "colorMap"?name= "colorMapValue":''
        name == "sizeMap"?name= "sizeMapValue":''
        let value = $(this).val(); // value

        // let AmazonSkuTableData = '';
        // window.localStorage.getItem("AmazonSkuTableData") != '' ? AmazonSkuTableData = JSON.parse(window.localStorage.getItem("AmazonSkuTableData")) : AmazonSkuTableData = ''
        AmazonSkuTableData[index][name] = value
        AmazonSkuTableRenderData(AmazonSkuTableData)
    })

    // 引用基础模板描述
    $(document).on("click","#applyTempDesc",function(){
        let popIndex = layer.open({
            title: '引用基础模板描述',
            type: 1,
            area: ['50%', '60%'],
            btn: ['应用', '关闭'],
            id: 'storeTempApplyDescLayer1',
            content: $('#storeTempApplyDescLayer').html(),
            success: function (layero, index) {
                getAmazonSellingPointsByProdDesc().then(data => {
                    laytpl($("#storeTempApplyDesc").html()).render(data, function(html){
                        $('#storeTempApplyDescContent').html(html)
                       
                    });
                    form.render();
                  }).catch(function(err){
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

    // 生成SKU
    $(document).on("click","#publishCreateHandleSku",function(){
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
      console.log('AmazonCateAttrData', AmazonCateAttrData);
      if (AmazonCateAttrData.length === 0 || !AmazonCateAttrData) {
          layer.msg("请先选择站点和类目！")
          return
      }
      if ($('input[name=salesType]:checked').val() == '2') {
          if(variationTheme == ''&& AmazonCateAttrData?.variations[0]?.required == true){
              layer.alert("variationTheme下拉必填",{icon:7})
              return false;
          }
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
      getDataStoreTemplateGetProdPInfoById(prodId).then(res => {
            // 基础模板回显数据
            let BaseTemplateReturnData = res;
            searchTag = res.keyword || ''

            $("input[name=storeTemplateBaseId]").val(prodId)
            laytpl($("#storeTemplateContainer2").html()).render(BaseTemplateReturnData, function(html){
                $('#storeTemplateView2').html(html)
                $("#storeTemplateView2 input[name=keyword]").tagsinput("removeAll");
                res.keyword?.split(",").forEach((item,index)=>{
                $("#storeTemplateView2 input[name=keyword]").tagsinput('add', item);
                })
            });
          amazon_template_create_desc_simditor = autoSimditor('amazonTemplateDesc', tempSkuInfoCreateFirst.productDescription || ''); //设置描述头内容
          $("#storeTemplateView2 input[name=keyword]").tagsinput("removeAll");
          tempSkuInfoCreateFirst.keyword?.split(",").forEach((item,index)=>{
            $("#storeTemplateView2 input[name=keyword]").tagsinput('add', item);
          })
          getDataStoreTemplateQuerySkuInfoByVariationTheme(oaAttr).then(data => {
              if(data instanceof Array){
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
    
                  let returnData = {
                      prodListingSubSkuAmazons: data,
                      varietionThemeTable: arr
                  }
                  laytpl($("#prodListingSubSkuAmazonsCreateTable").html()).render(returnData, function(html){
                      $('#publishInfoCreateTable').html(html)
                      if ($("#publishInfoCreateTable .amazon_publish_variant").length > 0) {
                          $('.multi-box').show()
                      } else {
                          $('.multi-box').hide()
                          $('.allid-cbox').prop('checked', false)
                      }
                  });
                  if (returnData.prodListingSubSkuAmazons?.length > 0) {
                    // 显示 子sku选择列表
                    $('#newTempSkuAttr').show()
                    // 显示子标题
                    $('#newTempSSkuTitle').show()
                    commonAddEventTitleToggle($('#newTempSSkuTitle'), 'amazon')
                  }
    
                    let result = {}
                    result = JSON.parse(JSON.stringify(AmazonCateAttrData))
                    if (amazonType === 1) {
                        // 编辑模板
                        result.cateList = JSON.parse(JSON.stringify(editCateList)) // 拼接得来editCateList
                    }
    
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
                    // 渲染分类属性
                    laytpl($("#amazonCateSpecificsTempNew").html()).render(result, function (html) {
                        $("#newStoreTemplate_editspecificForm").html(html);
                    })
                    form.render();
                
                    if (isCreate) {
                        $('#temp_toogleLangBtn').show()
                        isLangEng = $("#AmazonTemplateCreateForm .salesSite").val() === 'JP' ? false: true
                    } else {
                        $('#temp_toogleLangBtn').hide()
                    }
    
                    // 默认是 Default
                    $.each($('.toggleClass'),function(index, obj){  //index:索引obj:循环的每个元素
                        var value = $(obj).find('.labelField').html();
                        if (requireVal.includes(value)) {
                            $(obj).hide()
                        }
                    })
                    $.each($('.testClass'),function(index,obj){  //index:索引obj:循环的每个元素
                        var value = $(obj).find('.labelField').html();
                        if (requireVal.includes(value)) {
                            $(obj).show()
                        }
                    })
    
                   // 根据生成的子 sku 数据 填充 newTempSkuChoose 下拉框
                    newTempSkuChooseOptionList = returnData.prodListingSubSkuAmazons?.map(item => {
                        if (item.sSku) {
                            return {
                                value: item.sSku,
                                label: item.sSku
                            }
                        }
                    })
                    appendSelect($('#newTempSkuChoose'), newTempSkuChooseOptionList, 'value', 'label')
                    // 默认选择第一项
                    $('#newTempSkuChoose').val(newTempSkuChooseOptionList[0].value || '')
                    newTempPreval = newTempSkuChooseOptionList[0].value || ''
                    let paramsArr = []
                    $.each($('#newStoreTemplate_editspecificForm .layui-form-item'), function(index, obj) {
                        let key = $(obj).find('.labelField').html();
                        let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
                        if (value) {
                            let contennt = `${key}:${value}`
                            paramsArr.push(contennt)
                        }
                    })
    
                    // 给每一项添加保存数据
                    newTempSkuChooseOptionList.forEach(item => {
                        // 标题 根据子sku列表数据中来
                        pskuTableData?.forEach(cItem => {
                        if (cItem.sSku === item.value) {
                            let saveObj = {
                                subTitle: tempSkuInfoCreateFirst.itemName,
                                subBulletPoints: tempSkuInfoCreateFirst.bulletPoints || '',
                                subProductDescription: tempSkuInfoCreateFirst.productDescription || '',
                                subGenericKeywords: tempSkuInfoCreateFirst.keyword || '',
                                subAttrKeyVal: paramsArr.join('#,#') || ''
                            }
                            $('#newTempSkuChoose').find(`option[value="${item.value}"]`).attr('sskudata', JSON.stringify(saveObj))
                        }
                        })
                    })
                    
                    // 子sku标题 = 父sku标题 拼接 颜色尺寸样式 (size,color,style)  默认第一项数据
                    createFirstTableInfo = data[0] || []
                    if (createFirstTableInfo) {
                        subTitle = tempSkuInfoCreateFirst.itemName
                    }
                    $('#newTempSubTitle').val(subTitle)
                    form.render();
              }else{
                  layer.msg(data, {icon:2});
              }
          }).catch(function(err){
              console.log('生成sku',err)
              layer.msg(err, {icon:2});
          })
      })
    })

    // sku信息表--批量删除
    $(document).on("click","#storeTemplateDetaleSelected",function(){
      var data = $("#publishInfoCreateTable tbody input.pid-cbox:checked");
      if (data.length === 0) {
          layer.msg("请至少选择一条数据")
      } else {
          $(data).parents('.amazon_publish_variant').remove()
          if ($("#publishInfoCreateTable .amazon_publish_variant").length > 0) {
              $('.multi-box').show()
          } else {
              $('.multi-box').hide()
              $('.allid-cbox').prop('checked', false)
          }
        // 更新子sku下拉框数据
        getTempSSkuOptionList('publishInfoCreateTable', newTempSkuChooseOptionList, 'newTempSkuChoose')
      }
    })

    // sku信息表--新增一行数据
    $(document).on("click","#publishCreateIncreaseRow",function(){
      var layer = layui.layer,
          $ = layui.$,
          laytpl = layui.laytpl,
          form = layui.form,
          table = layui.table;
      let baseSkuTableData

      let site = $('#salesSite').val() || $("#AmazonTemplateCreateForm .salesSite").val()
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
          laytpl($("#prodListingSubSkuAmazonsCreateTable").html()).render(returnData, function(html){
              $('#publishInfoCreateTable').html(html)
              if ($("#publishInfoCreateTable .amazon_publish_variant").length > 0) {
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
          addAmazonSkuListing('publishInfoCreateTable')
          if ($("#publishInfoCreateTable .amazon_publish_variant").length > 0) {
              $('.multi-box').show()
          } else {
              $('.multi-box').hide()
              $('.allid-cbox').prop('checked', false)
          }
      }
    })

    
    function addAmazonSkuListing(el){
      let str = $(".amazon_publish_variant").prop('outerHTML');
      $('#'+ el).append(str);
      $('#'+ el).children(":last").find(".pid-cbox").attr("checked",false);
      let index = $('#'+ el).children(":last").index();
      $('#'+ el).children(":last").find(".img-cbox").attr('name', 'imgCbox'+index)

      $('#'+ el).children(":last").find("[name=mainImg]").attr('src',ctx + "/static/img/kong.png");
      $('#'+ el).children(":last").find("[name=mainImg]").attr('shortname', '');
      $('#'+ el).children(":last").find("[name=prodListingSubSkuAmazonsId]").val('');
      $('#'+ el).children(":last").find("[name=externalProductId]").val('');
      $('#'+ el).children(":last").find("[name=standardPrice]").val('');
      $('#'+ el).children(":last").find("[name=prodSSku]").val('');
      $('#'+ el).children(":last").find("[name=prodTempId]").val('');
      $('#'+ el).children(":last").find("[name=quantity]").val(300);
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
      // 模板图片按钮的prodssku为空
      $('#'+ el).children(":last").find(".addImgByTpl").data('prodssku','');

      layui.form.render()
    }

    // 生成sku信息表数据
    // 如果有color_name，必有colormap列
    // amazonAndOaAttr --------- amazonAttr1:oaAttr1||amazonAttr2:oaAttr2
    function AmazonSkuTableRenderData(data,amazonAndOaAttr=''){
        let AmazonSkuTable_Data = deepCopy(data),amazonAttrArr = [];
        if (amazonThemeTableAttrArr != null && amazonThemeTableAttrArr != undefined && amazonThemeTableAttrArr != ''){
            amazonAttrArr = amazonThemeTableAttrArr.map(item => item.amazonAttr)
        }

        let oaAttrArr = []
        $("#storeTemplateThemeTable").next().find("tbody tr").each(function(){
            let attrValue = $(this).find(".layui-this").text();
            attrValue == "请选择"?attrValue = '':'';
            oaAttrArr.push(attrValue)
        });

        let cols = [[
            {
                title: '主图',
                field: 'imgName',
                templet: function(d){
                    let str = '';
                    if(d.imgName != '')
                        str += `<img class="imgCss img_show_hide" src="${d.imgName}!size=100x100" style="width: 100px;height: 100px;"><br>`
                        str +=`<input class="layui-btn layui-btn-xs" readonly value="上传图片" style="position: absolute;margin:20px;" >
                            <input value="上传" style="width:150px;margin:20px;opacity: 0" type="file" class="storeTemplateUploadImgFile" indexFlag="${d.LAY_TABLE_INDEX}">
                            <a class="layui-btn layui-btn-danger layui-btn-xs removeAmazonSkuImage" indexFlag="${d.LAY_TABLE_INDEX}">删除</a>`
                    return str
                }
            }, {
                title: '子SKU',
                field: 'sSku',
                templet: function(d){
                    return `<input class="layui-input" value="${d.sSku||''}" ${d.sSku==""?"":"readonly"} name="storeTemplateLayerSkuChildDataInput">`
                }
            }, {
                title: '操作',
                templet: function(d){
                    return `<a class="layui-btn layui-btn-xs layui-btn-danger AmazonSkuTableRemove" indexFlag=${d.LAY_TABLE_INDEX}>移除</a>`
                }
            }
        ]]

        // 说明是手动生成
        if(amazonAndOaAttr == ""){
            amazonAttrArr.forEach((item,index) =>{
                let field = oaAttrArr[index];
                // 说明有拼接的字段，比如size_style
                if(field.length > 8){
                    AmazonSkuTable_Data.forEach(function(item,index){
                        if("spliceString" in item){
                            // 可以return吗
                        }else{
                            item["spliceString"] = item[field.split("_")[0]] + '_' + item[field.split("_")[1]]
                        }
                    })
                    return cols[0].splice(-1, 0,{"title":item,"field":"spliceString"
                        , "templet": function(d){
                            return `<input class="layui-input" value="${d["spliceString"]||''}" name="storeTemplateLayerSkuChildDataInput">`
                        }
                    })
                }else{
                    return cols[0].splice(-1, 0,{"title":item,"field":field
                        , "templet": function(d){
                            return `<input class="layui-input" value="${d[field]||''}" name="storeTemplateLayerSkuChildDataInput">`
                        }
                    })
                }
            })
        }else if(amazonAndOaAttr == "1"){ // 没有生成sku的情况

        }else{
            // 自动生成sku
            amazonAttrArr = amazonAndOaAttr.split("||")
            amazonAttrArr.forEach((item,index) =>{
                let title = item.split(":")[0],field = item.split(":")[1];

                if(field.length > 8){
                    // 生成sku的时候默认值
                    AmazonSkuTable_Data.forEach(function(item,index){
                        if("spliceString" in item){
                            // 可以return吗
                        }else{
                            item["spliceString"] = item[field.split("_")[0]] + '_' + item[field.split("_")[1]]
                        }
                    })
                    // 其他时候不用管
                    return cols[0].splice(-1, 0,{"title":title,"field":"spliceString"
                        , "templet": function(d){
                            return `<input class="layui-input" value="${d["spliceString"]||''}" name="storeTemplateLayerSkuChildDataInput">`
                        }
                    })
                }else{
                    return cols[0].splice(-1, 0,{"title":title,"field":field
                        , "templet": function(d){
                            return `<input class="layui-input" value="${d[field]||''}" name="storeTemplateLayerSkuChildDataInput">`
                        }
                    })
                }
            })
        }

        if(amazonAttrArr.indexOf("color_name")>-1 || amazonAndOaAttr.indexOf("color_name")>-1){
            let idx = cols[0].findIndex((item) => {
                return item.title === 'color_name'
            })
            cols[0].splice(idx, 0,{"title":"colormap","field":"colorMap"
                , "templet": function(d){
                    let option = `<input type="text" class="layui-input" name="storeTemplateLayerSkuChildDataInput" list="storeTemColorMap${d.LAY_TABLE_INDEX}" value="${d.colorMapValue||''}">
                        <datalist id="storeTemColorMap${d.LAY_TABLE_INDEX}">`
                    // 如果color不在colorMapValue下拉选项里面，默认选中第一个
                    d.colorMap && d.colorMap.forEach(function(item,index){
                        option += `<option value="${item||''}">${item||''}</option>`
                    })
                    option += `</datalist>`
                    return option
                }
            })
        }else{
            AmazonSkuTable_Data.forEach((item, index) => {　　// this.modelvalue 是从接口获取到的数据保存的变量名
                item["colorMapValue"] = '';
            });
        }

        if(amazonAttrArr.indexOf("size_name")>-1 || amazonAndOaAttr.indexOf("size_name")>-1){
            let idx = cols[0].findIndex((item) => {
                return item.title === 'size_name'
            })
            cols[0].splice(idx, 0,{"title":"sizemap","field":"sizeMap"
                , "templet": function(d){
                    let option = `<input type="text" class="layui-input" name="storeTemplateLayerSkuChildDataInput" list="storeTemSizeMap${d.LAY_TABLE_INDEX}" value="${d.sizeMapValue||''}">
                        <datalist id="storeTemSizeMap${d.LAY_TABLE_INDEX}">`
                    // 如果color不在colorMapValue下拉选项里面，默认选中第一个
                    d.sizeMap && d.sizeMap.forEach(function(item,index){
                        option += `<option value="${item||''}">${item||''}</option>`
                    })
                    option += `</datalist>`
                    return option
                }
            })
        }else{
            AmazonSkuTable_Data.forEach((item, index) => {　　// this.modelvalue 是从接口获取到的数据保存的变量名
                item["sizeMapValue"] = '';
            });
        }

        //  colorMap的值存成colorMapValue:选中的值
        // 现在所有都会显示colorMapValue
        if(amazonAndOaAttr==''&&AmazonSkuTable_Data[0].colorMap != undefined&&AmazonSkuTable_Data[0].colorMapValue == undefined){ // 说明是手动生成sku的
            AmazonSkuTable_Data.forEach((item, index) => {　　// this.modelvalue 是从接口获取到的数据保存的变量名
                item["colorMapValue"] = item.colorMap[0];
            });
        }

        //  sizeMap的值存成sizeMapValue:选中的值
        // 现在所有都会显示sizeMapValue
        if(amazonAndOaAttr==''&&AmazonSkuTable_Data[0].sizeMap != undefined&&AmazonSkuTable_Data[0].sizeMapValue == undefined){ // 说明是手动生成sku的
            AmazonSkuTable_Data.forEach((item, index) => {　　// this.modelvalue 是从接口获取到的数据保存的变量名
                item["sizeMapValue"] = item.sizeMap[0];
            });
        }
        AmazonSkuTableData = AmazonSkuTable_Data
        AmazonSkuTableRender(cols,AmazonSkuTable_Data)
    }

    // 更新select数据
    function getSelectColorMap(index,value){
        AmazonSkuTableData[index].colorMapValue = value
        AmazonSkuTableRenderData(AmazonSkuTableData)
    }

    function getSelectSizeMap(index,value){
        AmazonSkuTableData[index].sizeMapValue = value
        AmazonSkuTableRenderData(AmazonSkuTableData)
    }

    // 渲染sku信息表
    function AmazonSkuTableRender(cols,data){
        table.render({
            elem: "#storeTemplateSkuTable",
            id:"storeTemplateSkuTable",
            cols: cols,
            data:data
            ,limit: data.length
        });

        // id=storeTemplateSkuTable
        // sku信息表需要清空
    }

    // 设置图片属性
    $(document).on("change", ".storeTemplateUploadImgFile", function (e) {
        let _this = e.target;
        var files = _this.files;
        if (!files || !files.length) return;
        var file = files[0];
        var formData = new FormData();
        formData.append('file', file);
        formData.append('type', 1);

        $.ajax({
            type: "post",
            url: (imageUpDomain.indexOf('uploadPic') >= 0 ? (ctx + imageUpDomain) : (imageUpDomain + '/image/uploadImage')),
            data: formData,
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
                    // let AmazonSkuTableData = JSON.parse(window.localStorage.getItem("AmazonSkuTableData"))
                    tpl_calculateImageSize([tplIVP + data.data]).then(function({width, height}) {
                        if (width < 1000 ||height < 1000) {
                            layui.layer.msg('尺寸小于1000*1000,不允许上传')
                            return false
                        }else{
                    AmazonSkuTableData[$(_this).attr("indexFlag")].imgName = tplIVP + data.data
                    // 更新sku信息表
                    AmazonSkuTableRenderData(AmazonSkuTableData)
                        }
                    })
                } else {
                    layer.msg(data.msg)
                }
            }
        });
    })

    // 删除单个图片
    $(document).on("click", ".removeAmazonSkuImage", function (e) {
        let _this = this,AmazonSkuTableData = [];
        // AmazonSkuTableData = JSON.parse(window.localStorage.getItem("AmazonSkuTableData"))
        AmazonSkuTableData[$(_this).attr("indexFlag")].imgName = ''
        AmazonSkuTableRenderData(AmazonSkuTableData)
    })


    $(document).on("click", ".AmazonSkuTableRemove", function () {
        let _this = this;
        var layerIndex = layer.confirm('您确认要删除这行数据吗？', {
            btn: ['确定', '取消'], //按钮
            icon: 7
        }, function () {
            let indexFlag = $(_this).attr("indexFlag");
            layer.close(layerIndex)
            // 删除数据
            AmazonSkuTableData.splice(indexFlag, 1)
            AmazonSkuTableRenderData(AmazonSkuTableData)

        }, function () {
            layer.msg('已取消');
        });
    })

    // 站点，类目，分类属性，theme，sku信息表数据都清空
    // 站点 下拉框
    form.on('select(storeTemplateSalesSite)', function(data) {

        $("#storeTemplateLayerAmazonListingName").text("") // 类目名
        $("#storeTemplate_amazon_online_creatListing_cateItem-hidden2").val("") // 类目id

        // 类目属性数据
        $("#newStoreTemplate_editspecificForm .amazonCateSpecifics .layui-card-body").empty();
        AmazonCateAttrData = []
        // localStorage.removeItem("AmazonCateAttrData")

        // theme,直接清空dom，而不是清空值
        $("#storeTemplateModifyAmazonTemplateForm select[name=variationTheme]").html("")

        // 清空sku信息表
        AmazonSkuTableData = []
        // localStorage.removeItem("AmazonSkuTableData")  // sku信息表的数据
        $("#storeTemplateSkuTable").html("")

        form.render()
        isNeedChangeLang(data.value)
    })

    // variation theme下拉框
    form.on('select(variationTheme)', function(data){
        let variationTheme = data.value
        renderVariationThemeTable(variationTheme)

        // sku信息表数据清空并隐藏
        AmazonSkuTableData = []
        AmazonSkuTableRender([],[])
    });

    // 映射oa属性下拉框
    // 这里没有测试，因为没有找多属性的
    form.on('select(storeTemplateThemeTableOaAttrSelect)', function(data){
        // sku信息表数据清空并隐藏
        // localStorage.setItem("AmazonSkuTableData",JSON.stringify([{}]))
        AmazonSkuTableData = []
        AmazonSkuTableRender([],[])
    });


    // 获取基础模板的数据
// "0新建亚马逊模板":"1编辑亚马逊模板"
    function getStoreTemplateData(prodPId){
        var layer = layui.layer,
            $ = layui.$,
            laytpl = layui.laytpl,
            form = layui.form,
            table = layui.table;
        // getDataStoreTemplateGetSiteEnum() 初始化站点
        // getDataStoreTemplateGetProdPInfoById() 基础模板回显数据
        Promise.all([getDataStoreTemplateGetSiteEnum(),getDataStoreTemplateGetProdPInfoById(prodPId)]).then(function(result){
            console.log('success', result)
            // 初始化站点 
            let option = "<option value=''></option>";
            $(result[0]).each(function() {
                option += `<option value=${this.code}>${this.name}</option>`
            });    
            $("#AmazonTemplateCreateForm .salesSite").html(option)     
            // 基础模板回显数据
            let BaseTemplateReturnData = result[1];
            searchTag = result[1].keyword || ''

            $("input[name=storeTemplateBaseId]").val(prodPId)
            laytpl($("#storeTemplateContainer1").html()).render(BaseTemplateReturnData, function(html){
                $('#storeTemplateView1').html(html)
            });
            laytpl($("#storeTemplateContainer0").html()).render(BaseTemplateReturnData, function(html){
                $('#storeTemplateView0').html(html)
                
            });
            // laytpl($("#storeTemplateContainer2").html()).render(BaseTemplateReturnData, function(html){
            //     $('#storeTemplateView2').html(html)
            //     $("#storeTemplateView2 input[name=keyword]").tagsinput("removeAll");
            //     result[1].keyword?.split(",").forEach((item,index)=>{
            //       $("#storeTemplateView2 input[name=keyword]").tagsinput('add', item);
            //     })
            // });

            //监听一下标题input的输入
            let textLengthDom= $('#AmazonTemplateCreateForm #amazonPublishNewAmazonTemplate_titleLength');
            $('#AmazonTemplateCreateForm input[name=enTitle]').on('input', function(e){
                let val = e.target.value;
                textLengthDom.text(val.length);
                if(val.length > 150){
                    textLengthDom.addClass('redTitle').removeClass('greenTitle');
                }else{
                    textLengthDom.addClass('greenTitle').removeClass('redTitle');
                }
            });  
            form.render();
            setTimeout(() => {
                commonAddEventTitleToggle($('#storeTemplateModifyAmazonTemplate1'), 'amazon')
            }, 1000)
        }).catch(function(err){
            console.log(err)
            layer.msg(err.message,{icon:2})
        })
    }
    
    function initSpecificAttrFunc(amazonCateId, siteId, attrKeyVal) {
        if (!amazonCateId) {
            return;
        }
        layui.admin.load.show();
        let fullCateName= $("#storeTemplateModifyAmazonTemplateForm #storeTemplateLayerAmazonListingName").text()
        fullCateName = fullCateName.replaceAll('  >>  ', '/')
        getDataStoreTemplateCopyModelByFindCate(amazonCateId,attrKeyVal,siteId,fullCateName).then(function (result) {
            _initSpecificAttrFunc(result)
            $("#storeTemplate_moreAttrBtn").nextAll().hide()
        }).catch(function (err) {
            layer.msg(err, {icon: 2});
        });
    }
    
    
    function _initSpecificAttrFunc(result, amazonCateId){
        var layer = layui.layer,
            laytpl = layui.laytpl,
            $ = layui.$,
            form = layui.form;
        AmazonCateAttrData = result

        cateListResultNewTemp = JSON.parse(JSON.stringify(result)) // 用于新建模板

        let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
        // 新建时 生成sku后 才显示分类属性
        // if (amazonType === 1) {
        //   // 编辑模板
        //   console.log('editCateList', editCateList)
        //   result.cateList = editCateList
        //   let lazadaPublishFlag = 0, requiredIndex;
        //   result.cateList.forEach((item, index) => {
        //       if (!item.required && !lazadaPublishFlag) {
        //           lazadaPublishFlag = 1
        //           requiredIndex = index
        //       }
        //       if (requiredIndex && index >= requiredIndex) {
        //           item.required = false
        //       }
        //       if (requireVal.indexOf(item.fieldName) > -1) {
        //           item.required = true
        //           item.test = true
        //       }
        //       if(item.tempValue){
        //           item.defaultValue = item.tempValue
        //       }
        //   })
        //   // 渲染分类属性
        //   laytpl($("#amazonCateSpecificsTempNew").html()).render(result, function (html) {
        //       $("#newStoreTemplate_editspecificForm").html(html);
        //   })
        //   form.render();
        // }

    
        if (isCreate) {
            $('#temp_toogleLangBtn').show()
            isLangEng = $("#AmazonTemplateCreateForm .salesSite").val() === 'JP' ? false: true
        } else {
            $('#temp_toogleLangBtn').hide()
        }

        // 默认是 Default
        $.each($('.toggleClass'),function(index, obj){  //index:索引obj:循环的每个元素
            var value = $(obj).find('.labelField').html();
            if (requireVal.includes(value)) {
                $(obj).hide()
            }
        })
        $.each($('.testClass'),function(index,obj){  //index:索引obj:循环的每个元素
            var value = $(obj).find('.labelField').html();
            if (requireVal.includes(value)) {
                $(obj).show()
            }
        })
        
        // variation theme的下拉值
        var themeOptionList = '<option value="">请选择</option>';
        let variationThemeValidValues = (result.variations && result.variations[0]?.validValues) || result.variationThemeValidValues
        variationThemeValidValues?.split("#,#").forEach(function (attrVal) {
            themeOptionList += '<option value="' + attrVal + '">' + attrVal + '</option>';
        });
        $("#AmazonTemplateCreateForm select[name=variationTheme]").html(themeOptionList)
        $("#AmazonTemplateCreateForm select[name=variationTheme]").val(editTheme)


        let tempFileName = $('#storeTemplateAmazonListingName').text()
        let salesSite = $('#AmazonTemplateCreateForm select[name=salesSite]').val()
        tempFileName = tempFileName.replaceAll('  >>  ', '/')
        form.render();
        // default amazon_na ...
        getFulfillmentCenterId({
            categoryId: $("#amazon_template_creatListing_cateItem-hidden2").val() || amazonCateId,
            fullCateName: tempFileName,
            salesSite: salesSite
        }).then(res=>{
            let data = {}
            data.fulfillmentCenterIdData = res
            // 渲染下拉框
            laytpl($("#NewAmazonTemplateContainer").html()).render(data, function(html){
                $('#createFulfillmentCenterIdTemp').html(html)
            });
            $('#AmazonTemplateCreateForm select[name=fulfillmentCenterId]').val(eidtFulfillmentCenterId || "DEFAULT")
            form.render();
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
            _initSpecificAttrFunc(result, amazonCateId)
            $("#publish_create_moreAttrBtn").nextAll().hide()
        }).catch(function (err) {
            console.log('err', err)
            layer.msg(err, {icon: 2});
        });
    } 
    
    function renderVariationThemeTable(variationTheme,variationThemeSelected) {
        var layer = layui.layer,
            $ = layui.$,
            laytpl = layui.laytpl,
            form = layui.form,
            table = layui.table;
        // 选择theme下拉生成theme表格数据
        getVariationTheme(variationTheme)
    }

    function getVariationTheme(variationTheme, flag = true) {
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
        if(amazonAttrLen.length > oaAttrLen.length && oaAttrLen.length != 0){
            if (flag) {
                layer.alert("请更换模板或类目", {icon: 7})
            }
            _amazonThemeTableAttrArr = []
        }
        else if(oaAttrLen.length == 0 ){
            if (flag) {
                layer.alert("OA属性为空，请直接生成sku", {icon: 7})
            }
            _amazonThemeTableAttrArr = []
        }
        else if(amazonAttrLen.length == 0 ){
            if (flag) {
                layer.alert("Amazon属性为空", {icon: 7})
            }
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
                $('.publishThemeTableOaAttrSelect')?.each(function(index, item) {
                    let value = amazonThemeTableAttrArr[0]?.oaAttr[index]
                    $(item).val(value)
                })
                form.render()
            }
        });

        if (amazonType === 1) {
          // 售卖形式 是否显示映射表 和 variation theme
          let salesType = $('input[name=salesType]:checked').val()
          if (salesType == '1') {
            $('#AmazonTemplateCreateForm .variationClassBox').hide()
            $('#publishThemeTable').next().hide()
          }
        }
    }).catch(function(err){
        console.log('err', err)
        layer.msg(err, {icon:2});
    })
    }


    $(document).on("click","#storeTemplate_moreAttrBtn",function(){
         //先清除一次事件
        $('#storeTemplate_moreAttrBtn').off('click');
        $('#storeTemplate_moreAttrBtn').nextAll().toggle()
    })

    form.on('checkbox(amazonCheckbox1Filter)', function(data){
        $('[data-id=storeTemplateRemarkImg]').find(".curIsMustImgNum").text($("input[name='storeTemplateAmazonCheckbox1']:checked").length)
    });

    $(document).off("click",".storeTemplate_addLocalPicture").on("click",".storeTemplate_addLocalPicture",function(){
      //绑定当前类名下的上传元素
      // $(".amazonpublish_uploadPic").click()
      _picThis = $(this)
      let $uploadInput = $('<input type=file class="disN" multiple />');
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

    // 开发专员&责任人
    function getDataStoreTemplateamazonTemplaterole(){
        return commonReturnPromise({
            url: `/lms/amazonPublishModel/amazonTemplate`,
            type: 'get'
        })
    }

    // 创建人
    function getDataStoreTemplateListuserbyrole(){
        // 获取创建人接口
        return commonReturnPromise({
            url: `/lms/amazonPublishModel/getAllCreator`,
            type: 'get'
        })
    }

    // 部门
    function getDataStoreTemplateListDepartbyrole(){
        // 获取创建人接口
        return commonReturnPromise({
            url: `/lms/sys/getPersonAndOrgsByRole.html`,
            type: 'post',
            params: { roleNames: 'amazon专员'}
        })
    }

    // 获取物流属性接口
    function getDataStoreTemplateGetlogisAttr(){
        return commonReturnPromise({
            url: `/lms/enum/getLogisAttrEnum.html`,
            type: 'post',
        })
    }

    // 获取开发类型接口
    function getDataStoreTemplateGetPreProdDevTypeEnum(){
        return commonReturnPromise({
            url: `/lms/enum/getPreProdDevTypeEnum.html`,
            type: 'post',
        })
    }

    // 初始化amazon站点
    function getDataStoreTemplateGetSiteEnum(){
        return commonReturnPromise({
            url: `/lms/enum/getSiteEnum.html?platCode=amazon`,
            type: 'post',
        })
    }

    // 基础模板保存接口
    // obj:object [保存的数据]
    function getDataStoreTemplateCreateTemplate(obj){
        return commonReturnPromise({
            url: `/lms/amazonPublishModel/createTemplate`,
            type: 'post',
            contentType: 'application/json',
            params:JSON.stringify(obj)
        })
    }

    // 亚马逊模板保存接口
    // obj:object [保存的数据]
    function getDataStoreTemplateEditAmazonTemplate(obj){
        return commonReturnPromise({
            url: `/lms/amazonPublishModel/editAmazonTemplate`,
            type: 'post',
            contentType: 'application/json',
            params:JSON.stringify(obj)
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

   // 初始化亚马逊模板的接口
    // prodPId:number [基础模板id]
    function getDataStoreTemplateGetProdPInfoById(prodPId){
        return commonReturnPromise({
            url: `/lms/amazonPublishModel/openCreateAmazonTemplateDia`,
            type: 'get',
            contentType: 'application/json',    
            params: {"prodPId": prodPId}
        })
    }

    // 通过商品描述，解析为亚马逊卖点
    function getAmazonSellingPointsByProdDesc() {
        return commonReturnPromise({
            url: `/lms/prodTpl/getAmazonSellingPointsByProdDesc`,
            type: 'get',
            contentType: 'application/json',
            params:{
                prodPId: $("input[name=storeTemplateBaseId]").val()
            }
        })
    }

    // 获取sku信息表的数据
    function getDataStoreTemplateQuerySkuInfoByVariationTheme(oaAttr){
      let tempFileName = $('#storeTemplateAmazonListingName').text()
      tempFileName = tempFileName.replaceAll('  >>  ', '/')
      return commonReturnPromise({
          url: `/lms/amazonPublishModel/querySkuInfoByVariationTheme`,
          type: 'POST',
          contentType: 'application/json',
          params: JSON.stringify({
              prodPId: $("input[name=storeTemplateBaseId]").val(),
              categoryId: $("#amazon_template_creatListing_cateItem-hidden2").val(),
              salesSite: $('#AmazonTemplateCreateForm select[name=salesSite]').val(),
              oaAttr: oaAttr,
              fulfillmentCenterId: $("#createFulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val(),
              salesType: $('input[name=salesType]:checked').val(),
              fullCateName: tempFileName
          })
      })
    }

    // 删除亚马逊模板的接口
    // prodPId:number [亚马逊模板id]
    function getDataStoreTemplateDeleteAmazonTemplate(prodPId,fullCateName,categoryId,salesSite,templateId){
        return commonReturnPromise({
            url: `/lms/amazonPublishModel/deleteAmazonTemplate`,
            type: 'get',
            params:{
                "templateId": templateId
            }
        })
    }

    // 根据部门获取 归属人和创建人数据
    function getDataByDepart(orgId){
        return commonReturnPromise({
            url: `/lms/amazonPublishModel/getUserInfoByOrgId`,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(orgId)
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

    // 获取类目属性数据
    // amazonCateId:number  [亚马逊类目id]
    // prodPId:number
    // siteId:number  [站点id]
    function getDataStoreTemplateQuerySkuInfoAndCateAttr(amazonCateId,prodPId,siteId){
        let tempFileName = $('#storeTemplateAmazonListingName').text()
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

    // 根据站点类目返回标题描述
    function getItemNameAndProductDesByProdPIdAndSalesSite(prodCateId, siteId, prodPId){
      return commonReturnPromise({
          url: `/lms/amazonPublishModel/getItemNameAndProductDesByProdPIdAndSalesSite`,
          type: 'get',
          params: {
              prodCateId: prodCateId,
              prodPId: prodPId,
              salesSite: siteId
          }
      })
    }

    // 亚马逊模板页签-复制框-选择类目
    function getDataStoreTemplateCopyModelByFindCate(amazonCateId,attrKeyVal,siteId,fullCateName){
        return commonReturnPromise({
            url: `/lms/amazonPublishModel/copyModelByFindCate`,
            type: 'get',
            params: {
                categoryId: amazonCateId,
                attrKeyVal: attrKeyVal,
                salesSite: siteId,
                fullCateName: fullCateName
            }
        })
    }

    // 查看亚马逊模板数据回显
    // prodPId:number
    function getDataStoreTemplateQueryTemplateDetailByProdPId(id){
        return commonReturnPromise({
            url: `/lms/amazonPublishModel/queryTemplateDetailByTemplateId/${id}`,
            type: 'get'
        })
    }

    // 查看亚马逊模板数据回显
    // prodPId:number
    function getDataStoreTemplateAmazonCopyModel(templateId){
        return commonReturnPromise({
            url: ctx + `/amazonPublishModel/amazonCopyModelByTemplateId/${templateId}`,
            type: 'get',
        })
    }
})


function saveCreateAndDetailSkuNewData(action, currentDom, type='') {
    let subProductDescription = '',prodListingSubSkuAmazons = [],
    subBulletPoints = '';

    let subAttrKeyVal = ''
    let paramsArr = []
    let subGenericKeywords = ''
    let subTitle = ''
    // let fulfillmentCenterId = ''
    let attrWrapDom = ''
    let requireVal = ['package_weight_unit_of_measure', 'package_height', 'package_length', 'package_weight', 'package_width', 'package_height_unit_of_measure', 'package_width_unit_of_measure', 'package_length_unit_of_measure']
    if (action === 'newTemp') {
        subProductDescription = amazon_template_create_desc_simditor.getValue()

        console.log("🚀 ~ saveCreateAndDetailSkuNewData ~ subProductDescription:", subProductDescription);

        // fulfillmentCenterId = $("#fulfillmentCenterIdTemp select[name=fulfillmentCenterId]").val()
        subGenericKeywords = $("#storeTemplateView2 input[name=keyword]").val()
        subTitle = $("#newTempSubTitle").val()
        attrWrapDom = 'newStoreTemplate_editspecificForm'
        subBulletPoints = $("[name=sellingPoint1_1]").val() + '#,#' +
        $("[name=sellingPoint1_2]").val() + '#,#' +
        $("[name=sellingPoint1_3]").val() + '#,#' +
        $("[name=sellingPoint1_4]").val() + '#,#' +
        $("[name=sellingPoint1_5]").val();
    }
    
    $.each($('#' + attrWrapDom +' .layui-form-item'), function(index, obj) {
        let key = $(obj).find('.labelField').html();
        let value = $(obj).find('.layui-input-inline select').val() || $(obj).find('.layui-input-inline input').val();
        if (value) {
            let contennt = `${key}:${value}`
            paramsArr.push(contennt)
        }
    })
    subAttrKeyVal = paramsArr.join('#,#')
    
    let saveObj = {
        subTitle,
        subBulletPoints,
        subProductDescription,
        subGenericKeywords,
        subAttrKeyVal
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
        $(currentDom).find(`option[value="${newTempPreval}"]`).attr('sskudata', JSON.stringify(saveObj))
    }   
}

// 获取当前子sku的数据并回显
function setNewDetailSkuData(currentDom, currentValue) {
    let saveData = $(currentDom).find(`option[value="${currentValue}"]`).attr('sskudata')
    if (saveData) {
        saveData = JSON.parse(saveData)
        // 卖点
        $('#storeTemplateView2').find('[name=sellingPoint1_1]').val((saveData.subBulletPoints.split("#,#")[0] || '').replaceAll("\"","&quot;"))
        $('#storeTemplateView2').find('[name=sellingPoint1_2]').val((saveData.subBulletPoints.split("#,#")[1] || '').replaceAll("\"","&quot;"))
        $('#storeTemplateView2').find('[name=sellingPoint1_3]').val((saveData.subBulletPoints.split("#,#")[2] || '').replaceAll("\"","&quot;"))
        $('#storeTemplateView2').find('[name=sellingPoint1_4]').val((saveData.subBulletPoints.split("#,#")[3] || '').replaceAll("\"","&quot;"))
        $('#storeTemplateView2').find('[name=sellingPoint1_5]').val((saveData.subBulletPoints.split("#,#")[4] || '').replaceAll("\"","&quot;"))
        // 标题
        $('#newTempSubTitle').val(saveData.subTitle || '')
        //设置商品描述
        amazon_template_create_desc_simditor = autoSimditor('amazonTemplateDesc', saveData.subProductDescription?.replace(/#,#/g, "<br>")); //设置描述头内容
        // 关键词
        $("#storeTemplateView2 input[name=keyword]").tagsinput('removeAll');
        saveData.subGenericKeywords?.split(",").forEach((item, index) => {
            $("#storeTemplateView2 input[name=keyword]").tagsinput('add', item);
        });

        // 渲染分类属性
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
        let cateListRender = amazonType == 1 ? editCateList : cateListResultNewTemp.cateList
        console.log('111', amazonType, cateListRender)
        // let cateListRender = editCateList
        cateListRender?.forEach(item => {
            if (attrkeyList.includes(item.fieldName) || attrkeyList.includes(item.localLabelName)) {
                item.defaultValue = attrList[item.fieldName] || attrList[item.localLabelName] || ''
                item.tempValue = attrList[item.fieldName] || attrList[item.localLabelName] || ''
            } else {
                item.defaultValue = ''
                item.tempValue = ''
            }
        })
        let cateRenderObj = {
            cateList: cateListRender
        }
        layui.laytpl($("#amazonCateSpecificsTempNew").html()).render(cateRenderObj, function (html) {
            $("#newStoreTemplate_editspecificForm").html(html);
        })
        
        layui.form.render();
    }
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

function tranferToOz() {
    return layer.msg('开发中...')
}

function tranferToG () {
    return layer.msg('开发中...')
}


// sku信息表--自动生成
function storeAmazonPublish_new_autoSetWeightPrice(obj, type) {
  var newStoreSSku = $(obj).parent().prev().val() || $(obj).parent().prev().prev().val()
  if (!$(obj).parent().prev().val()) {
      $(obj).parents('tr').find("[name=spliceString]").show();
      $(obj).parents('tr').find("[name=sizeColor]").show();
      $(obj).parents('tr').find("[name=colorMapValueDiv]").show();
      $(obj).parents('tr').find("[name=sizeMapValueDiv]").show();

      $(obj).parents('tr').find("[name=size]").val('');
      $(obj).parents('tr').find("[name=color]").val('');
    //   $(obj).parents('tr').find("[name=sizeColor]").val('');
      $(obj).parents('tr').find("[name=colorMapValue]").val('');
      $(obj).parents('tr').find("[name=sizeMapValue]").val('');
    //   $(obj).parents('tr').find("[name=spliceString]").val('');

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
  $.ajax({
      type: 'get',
      url: ctx + '/amazonPublishModel/autoSetSkuInfo',
      // dataType: "json",
      contentType: "application/json;charset=utf-8",
      data: {
        newProdSSku: newStoreSSku
      },
      success: function (returnSkuData) {
          if (returnSkuData.code != "0000") {
              layer.alert(returnSkuData.msg, { icon: 2 });
              // 自动补充和该sku的模板图片按钮有联动
              $(obj).parents('table').next().find('.addImgByTpl').data('prodssku',"")
              return;
          }
          $(obj).parents("tr").find('.cskuWeight').html(returnSkuData.data.originWeight)
          $(obj).parents("tr").find('[name=standardPrice]').val(returnSkuData.data.standardPrice)
          $(obj).parents('tr').find('[name=mainImg]').attr('src', returnSkuData.data.mainImageUrl);
          $(obj).parents('tr').find('.img-cbox').attr('value', returnSkuData.data.mainImageUrl);
          $(obj).parents("tr").find('[name=prodTempId]').val(returnSkuData.data.prodTempId)
          $(obj).parents("tr").find('[name=prodSSku]').val(returnSkuData.data.prodSSku)
          // 自动补充和该sku的模板图片按钮有联动
          $(obj).parents('table').next().find('.addImgByTpl').data('prodssku',returnSkuData.data.prodSSku)
      }
  })
  // 更新子sku下拉框数据
  getTempSSkuOptionList('publishInfoCreateTable', newTempSkuChooseOptionList, 'newTempSkuChoose')
  amazonPublish_subsku_regenerate1(obj, type, true);
}

function getTempSSkuOptionList(dom, list, selectDom) {
    list = []
    // 删除子sku下拉列表数据
    $('#' + dom).find('.amazonPublish_detail_table').each((index, item) => {
        let storeSSku = ''
        storeSSku = $(item).find('[name=storeSSku]').val() || $(item).find('[name=prodListingSubSkuAmazonsStoreSSku]').val()

        if (storeSSku) {
            list.push({
                label: storeSSku,
                value: storeSSku
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
            sku: item.value,
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
           if (cItem.sku === item.value) {
            $('#' + selectDom).find(`option[value="${item.value}"]`).attr('sskudata', cItem.sskudata)
           }
        })
    })
    // appendSelect($('#' + selectDom), list, 'value', 'label')
    // 默认选择第一项
    $('#' + selectDom).val(list[0].value || '')
    newTempPreval = list[0].value || ''
    layui.form.render('select')
}


function amazonPublish_subsku_regenerate1(dom, type, flag=false) {
  let typeDom = flag ? $(dom).parents('td').next().find('input[name=externalProductId]') : $(dom).parents('td').find('input[name=externalProductId]')
  commonReturnPromise({
      type: 'post',
      url: ctx + '/amazonListing/reFreshProductId.html',
      params: {
          type: (type == 'undefined' || !type) ? '' : type, 
          salesSite: $('#salesSite').val() || $("#AmazonTemplateCreateForm .salesSite").val()
      }
  }).then(data => {
      typeDom.val(data)
  }).catch(err => layer.alert(err, { icon: 2 }))
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

let _picThis = '',
amazonpublish_imgStr_left = `<li draggable="true" class="imgBox_prodTpl" data-src=":src" style="width: 150px;margin-bottom:40px;border:1px solid #ccc;overflow:hidden">
    <div class="ImgDivOut">`
amazonpublish_imgStr_right = `<div class="ImgDivIn" style="width:150px;height:150px">
    <img style="width:100%;height:100%;object-fit:contain;" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" src=":src" shortname=":shortName" >
    </div>
    <div class="imgDivDown" style="width:150px">
    <a onclick="amazonStore_setMainImg(this);" href="javascript:void(0);"style="float:left;color: #73a1bf;">设为主图</a>
    <a onclick="amazonStore_delImg(this);" href="javascript:void(0);" style="float:right;color: #73a1bf;">移除</a>
    </div>
    </div>
    </li>`;

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
           console.log('urlArr', urlArr.length)
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
      return layer.msg('请填写该行的SKU并点击自动补充',{icon:7})
  }else if(prodSSkus=='undefined'){
      return layer.msg('该条数据没有商品SKU,不支持该功能',{icon:7})
  }
  const params = {
    param: {prodSSkus:[prodSSkus]},
    limit,
    existImgs,
    cb: function (tplUrlList, fullImgList) {
      if (Array.isArray(tplUrlList) && tplUrlList.length) {
      let amazonpublish_imgStr = amazonpublish_imgStr_left + createSwatch + amazonpublish_imgStr_right
      const mainImgDoms = fullImgList
          .map(item => {
              if(isNewTpl) {
                  let index = $(dom).parents('.amazon_publish_variant').index()
                  let str = amazonpublish_imgStr.replaceAll(":src",item.fullImg)
                  str = str.replaceAll(":value",item.fullImg)
                  str = str.replaceAll(":name", 'imgCbox' + index)
                  str = str.replaceAll(":shortName", item.shortName)
                  return str
              } else {
                return amazonPublish_imgData['img']['tpl'].replace(/&{url}/g, item)
              }
              // isNewTpl ?amazonpublish_imgStr.replaceAll(":src",item):amazonPublish_imgData['img']['tpl'].replace(/&{url}/g, item))
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

// 亚马逊新模板--删除图片
function amazonStore_delImg(obj) {
  var imgTotalNum = $(obj).closest('ul').find('li').length;
  imgTotalNum--;
  $(obj).closest('.imgContains').prev().find(".curImgNum").text(imgTotalNum);
  $(obj).closest('li').remove();
}

// 亚马逊新模板--设为主图
function amazonStore_setMainImg(obj) {
  // 主图
  var mainImgUrl = $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr("src");
  var mainImgShortName = $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr("shortname");
  // 要设为主图的辅图
  var extImgUrl = $(obj).closest('li').find('img').attr("src");
  var extImgShortName = $(obj).closest('li').find('img').attr("shortname");
    // 把辅图设置为主图
    $(obj).closest('li').find('img').attr('src', mainImgUrl);
    $(obj).closest('li').find('img').attr('shortname', mainImgShortName);
    $(obj).closest('li').find('input:radio').attr("shortname", mainImgShortName);

    $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr('src', extImgUrl);
    $(obj).closest('.amazon_publish_variant').find('[name=mainImg]').attr('shortname', extImgShortName);
    $(obj).closest('.amazon_publish_variant').find('.imgRadio').attr("shortname", extImgShortName);

}

//移除子sku,仅删除样式
function removeAmazonSkuInfo(obj) {
  // TODO 删除的时候至少要有一个sku
  if ($("#amazonPublish_create_newSubSkuInfo .amazonPublish_detail_table").length == 1) {
      layer.msg("至少保存一条子sku");
      return;
  }
  
  $(obj).closest('tr').parent().parent().parent().remove();
  // 更新子sku下拉框数据
  getTempSSkuOptionList('publishInfoCreateTable', newTempSkuChooseOptionList, 'newTempSkuChoose')
}

// copy to lazadaTemplate.js
// copy start
// 主图模型结构
var amazon_imgData_template = {
    img: {
        head: '',
        tpl: '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle">' +
        '<div class="ImgDivOut">' +
        '<div>' +
        '<input type="hidden" name="mainImg" value="&{url}"/>' +
        '<input type="checkbox" name="storeTemplateAmazonCheckbox2" lay-skin="primary" title="亚马逊图"/>' +
        '</div>' +
        '<div class="ImgDivIn">' +
        '<img src="&{url}!size=150x150" alt="" crossOrigin="anonymous" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>' +
        '</div>' +
        '<div class="imgDivDown h20">' +
        '<a class="fl" onclick="copyUrl(this);" href="javascript:void(0);">复制</a>' +
        '<a class="fr" onclick="delImg(this);" href="javascript:void(0);">移除</a>' +
        '</div>' +
        '</div>' +
        '</li>',
        foot: '',
    }
};

// 辅图模型结构
var imgData_second_template = {
    img: {
        head: '',
        tpl: '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle">' +
        '<div class="ImgDivOut">' +
        '<div>' +
        '<input type="hidden" name="mainImg" value="&{url}"/>' +
        '<input type="checkbox" name="storeTemplateAmazonCheckbox1" lay-skin="primary" lay-filter="amazonCheckbox1Filter" title="必选"/>' +
        '<input type="checkbox" name="storeTemplateAmazonCheckbox2" lay-skin="primary" title="亚马逊图"/>' +
        '</div>' +
        '<div class="ImgDivIn">' +
        '<img src="&{url}!size=150x150" alt="" crossOrigin="anonymous" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>' +
        '</div>' +
        '<div class="imgDivDown h20">' +
        '<a class="fl" onclick="copyUrl(this);" href="javascript:void(0);">复制</a>' +
        '<a class="fr" onclick="delImg(this);" href="javascript:void(0);">移除</a>' +
        '</div>' +
        '</div>' +
        '</li>',
        foot: '',
    }
};

function copyUrl(btn) {
    var li = $(btn).closest('li')
    var img = li.find('img')[0]
    copyUrlOfImg(img)
}

// 本地图片上传
// imgContains  图片容器 jQuery对象
function storeTemplate_uploadLocalImg(imgContains, size) {
    var btn = imgContains.find('.uploadLocalImgBtn') // 触发异步上传的按钮
    var maxImg = parseInt(imgContains.attr('data-maxImg')) // 最大图片数
    var minImg = parseInt(imgContains.attr('data-minImg')) // 最小图片数
    var imgObjType = imgContains.attr('data-imgObjType') // 图片展示的dom数据类型
    if (size !== undefined) {
        size = JSON.parse(size)
    }

    btn.Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 2048, //默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        quality: 0.8,
        type: 1,
        uploader: (imageUpDomain.indexOf('uploadPic') >= 0 ? (ctx + imageUpDomain) : (imageUpDomain + '/image/uploadImage')),
        onSelect: function (files) {
            var imgTotalNum = imgContains.find('.uploadImgUL li').length
            var n = files.length + imgTotalNum;
            if (n > maxImg) {
                layer.msg("最大支持" + maxImg + "张图片，您还能选择" + (maxImg - imgTotalNum) + "张!");
                return false;
            } else {
                return true;
            }
        },
        onUploadStart: function (file) {
        },
        onUploadSuccess: function (file, data, response) {
            data = $.parseJSON(data);
            if (data != null && data.code == '0000') {
                tpl_calculateImageSize([tplIVP + data.data]).then(function({width, height}) {
                    if (width < 1000 ||height < 1000) {
                        layui.layer.msg('尺寸小于1000*1000,不允许上传')
                        return false
                    }else{
                amazon_proTpl_showImg(tplIVP + data.data, imgContains, false,false)
                    }
                })
            } else {
                layer.msg(data.msg); //这里面的内容不知道写啥,同OA系统
            }
        }
    });
}

// 网络图片下载
// imgContains  图片容器jQuery对象
function storeTemplate_uploadNetImg(imgContains) {
    var netUpBtn = imgContains.find('.uploadNetImgBtn') // 网络图片开启按钮
    var maxImg = imgContains.attr('data-maxImg') // 最大图片数
    var minImg = imgContains.attr('data-minImg') // 最小图片数
    var imgObjType = imgContains.attr('data-imgObjType') // 图片展示的dom数据类型
    netUpBtn.click(function () {
        var currentImgs = imgContains.find('.uploadImgUL li') // 原有图片模型
        if (currentImgs.length == maxImg) {
            layer.msg('已达最大上传数量')
            return
        }
        var index = layer.open({
            type: 1,
            title: '主图网络图片',
            area: ['800px', '300px'],
            id: 'mainNetImgSuccess',
            content: '<div class="p20 pl20"><textarea class="layui-textarea" id="netImgUrl" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
            btn: ['确定', '关闭'],
            yes: function () {
                var url = $.trim($("#netImgUrl").val());
                if (url == null || url == "") {
                    layer.msg("图片地址不能为空！", {icon: 5});
                    return false;
                }
                var urlArray = url.split("\n");

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
                var remainNum = maxImg - currentImgs.length;
                if (urlArray.length + currentImgs.length > maxImg) {
                    remainNum = remainNum < 0 ? 0 : remainNum;
                    layer.msg("最大支持" + maxImg + "张图片,您还能上传" + remainNum + "张!");
                }
                remainNum = urlArray.length > remainNum ? remainNum : urlArray.length;
                for (var i = 0; i < remainNum; i++) {
                    amazon_proTpl_showImg(urlArray[i], imgContains, false,false);
                }
                // $("#netImgUrl").val("");
                layer.close(index);
            }
        })
    });
}

/**
 * 复现图片
 * @param imgObjType    图片模型类型   1、主图模型   2、辅图模型   3、子商品图片模型
 * @param imgContains   图片容器dom对象
 * ifChecked  是否勾选  白底图/必选图
 * checked1 必选图
 * checked2 亚马逊图
 */
function amazon_proTpl_showImg(url, imgContains, checked1,checked2, index) {
    var imgObjType = imgContains.attr('data-imgObjType')
    // 将图片展示到容器中
    if (imgContains.selector == "[data-id=storeTemplateMainImg]") {
        var tpl = amazon_imgData_template['img']['tpl']  // 主图
    } else {
        var tpl = imgData_second_template['img']['tpl']  // 辅图
    }
    var div = tpl.replace(/&{url}/g, url);
    imgContains.find('.uploadImgUL').append(div);

    // 设定勾选状态
    if (checked1 && index !== undefined) {
        imgContains.find('[name=storeTemplateAmazonCheckbox1]')[index].checked = true
    }
    // 设定勾选状态
    if (checked2 && index !== undefined) {
        imgContains.find('[name=storeTemplateAmazonCheckbox2]')[index].checked = true
    }

    imgContains.find(".kongImgDivOut").hide();
    // 更新当前上传数量
    imgContains.find(".curImgNum").text(imgContains.find('.uploadImgUL li').length)
    // 更新当前必选图数量
    imgContains.find(".curIsMustImgNum").text($("input[name='storeTemplateAmazonCheckbox1']:checked").length)

    var form = layui.form
    form.render('checkbox')
}

//图片删除
function delImg(obj) {
    var index = layer.confirm('您确认要删除图片？', {
        icon: 3,
        title: '提示',
        success: function (layero, index) {
            this.enterEsc = function (event) {
                if (event.keyCode === 13) {
                    delImgFunc(obj)
                    layer.close(index);
                    return false; //阻止系统默认回车事件
                }
            };
            $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
        },
        end: function () {
            $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
        }
    }, function () {
        delImgFunc(obj, index)
        layer.close(index);
    });
}

function delImgFunc(obj) {
    var imgUL = $(obj).closest('.uploadImgUL')
    var imgContains = $(obj).closest('.imgContains')
    $(obj).closest('li').remove();
    var curImgNum = imgUL.find('li').length
    $("#curImgNum").text(curImgNum);
    if (curImgNum == 0) {
        imgUL.parent().find(".kongImgDivOut").show();
    }
    // 重置图片数量
    imgContains.find(".curImgNum").text(imgUL.find('li').length)
    // 更新当前必选图数量
    imgContains.find(".curIsMustImgNum").text($("input[name='storeTemplateAmazonCheckbox1']:checked").length)
}
// copy end

// copy to lazadaTemplate.js
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

