var detail_producttpl, pageQuery_prodTpl, tplAuditLog,getSalesByPlayCode,prodtpl_keywordChange;
var pSkuValid = true;
/**是否复制新增**/
var prodTplCopyAdd = false;
var prodTplPage = {}
var tortPlatArr = []
var prodTpl_keywordtype = ['keywordCore','keywordProdAttr','keywordFit','keywordExtra']
var editTortInfoPInfo
layui.use(['admin', 'form', 'table', 'laydate', 'upload', 'formSelects','element','laytpl','echarts'], function() {
    let $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        upload = layui.upload,
        laypage = layui.laypage,
        laytpl = layui.laytpl,
        echarts = layui.echarts,
        formSelects = layui.formSelects,
        form = layui.form;
    form.render();
    formSelects.render('logisAttrStr');
    formSelects.render('bizzOwnerIdList_producttpl');
    formSelects.render('responsorIds_producttpl')
    formSelects.render('devTypes_producttpl');
    formSelects.render('producttpl_imgStatus');
    formSelects.render('producttpl_hasWhiteImg');
    formSelects.render('producttpl_hasSelfImgStr');
    // 初始化 开发专员查询项为 当前登录人
    initPersonCondition(['开发专员'],['开发组长', '开发主管'],$('#tpl_searchForm [name=userId]'), 'id')

    // 渲染侵权平台查询条件
    function initTortPlatSelection() {
        oneAjax.post({
            url: "/prodTpl/getTortPlatEnums",
            success: function (res) {
                tortPlatArr = res.data
                let arr = []
                for (let i = 0; i < tortPlatArr.length; ++i) {
                    let platCode = tortPlatArr[i]
                    arr.push({
                        name: platCode + "侵权",
                        value: platCode + "_true"
                    })
                    arr.push({
                        name: platCode + "不侵权",
                        value: platCode + "_false"
                    })
                }
                formSelects.data('tortPlat', 'local', {arr})
            }
        })
    }
    initTortPlatSelection()
        // 时间渲染
    laydate.render({
            elem: '#producttplTimeVal',
            range: true
        })
    // 初始化  选择条件form 种的 自定义选择输入框
    initHpSelect('#tpl_searchForm')

    // 初始化跳转参数
    initSearchParam('#tpl_searchForm')

    // 初始化 组织-人员选择框
    render_hp_orgs_users('#tpl_searchForm')

    $('#showMoreSearchCondition_producttpl').click(function () {
        var self = this
        if ($(self).hasClass('showExternal')) {
            $(self).closest('.layui-form').find('.externalContain').hide()
            $('#show_icon_producttpl').show()
            $('#hide_icon_producttpl').hide()
            $(self).removeClass('showExternal')
            commonHasValue('tpl_searchForm', 'showMoreSearchCondition_producttpl', 'externalContain')
        } else {
            $(self).closest('.layui-form').find('.externalContain').show()
            $('#show_icon_producttpl').hide()
            $('#hide_icon_producttpl').show()
            $(self).addClass('showExternal')
        }
    })

    form.on('select(skuTypeSelect_producttpl)', function(data){
        let value = data.value
        let form = $('#tpl_searchForm')
        form.find('[name=searchSKUValue]').attr('maxlength','2000')
        if (value === 'pSku2' || value === 'sSku2') {
            form.find('[name=searchSKUValue]').attr('maxlength','40000')
        }
    })

    window.addEventListener('message', function(event){
        let { origin, sku } = event.data || {}
        if (origin == 'plugin') {
            $('#product_tpl_searchSKU_input').val(sku)
            setTimeout(() => {
                $('#tpl_searchBtn').trigger('click')
            }, 100)
        }
    })

    //oa新类目点击展开
    $('#plat_choose_outside').click(function() {
        cateLayerOpen('oa','layer_work_develop_pl','tplOACateInfo_show', '#itemCat_input')
    })
    $('#prod_clearPlat_outside').click(function() {
        $('#plat_chooseid_inp_outside').val('')
        $('#tplOACateInfo_show').text('')
    })

    // 监听input输入
    $('#tpl_searchForm [name=searchSKUValue]').bind('input propertychange', function() {
        var inputLen = $('[name=searchSKUValue]').val()
        if(inputLen.includes(',')){
            $('#tpl_searchForm [name=switchSearchValue]').prop('checked',true)
        }
        // else{
        //     $('#tpl_searchForm [name=switchSearchValue]').removeAttr('checked')
        // }
        form.render('checkbox')
    })

    prodTplPage.curr = 1
    prodTplPage.limit = 50
    prodTplPage.count = 0;
    // 表格渲染
    pageQuery_prodTpl = function(pageNum, limit) {
        let tplSearchData = handleSearchParams(pageNum, limit);
        let type = $('#tpl_searchForm [name=switchSearchValue]').prop('checked')
        if(tplSearchData.searchSKUValue && tplSearchData.searchSKUValue.includes(',') && type == false){
            return layer.msg('多个SKU仅支持精确查询',{icon:7})
        }
        if(tplSearchData.searchSKUValue && tplSearchData.searchSKUValue.split(",").length > 10000){
            return layer.msg('SKU最多支持10000个',{icon:7})
        }
        loading.show();
        $('#tplListTbody').html("");
        console.log(tplSearchData)
        let time1,time2
        $.ajax({
            type: "post",
            url: ctx + '/prodTpl/getProds.html',
            data: tplSearchData,
            success: function(res) {
                tortPlatArr = res.extra
                loading.hide();
                //数据渲染表格
                let returnData = res
                    data = returnData.data||[];
                for (let i in data) {
                    data[i].createTime = data[i].tplCreateTime ? Format(new Date(data[i].tplCreateTime), 'yyyy-MM-dd hh:mm:ss') : Format(new Date(data[i].createTime), 'yyyy-MM-dd hh:mm:ss')
                    if (data[i].auditTime) {
                        data[i].auditTime = Format(new Date(data[i].auditTime), 'yyyy-MM-dd hh:mm:ss')
                    }
                }
                $("#tplNum").html(returnData.count);
                // 处理禁售数据
                let Adata
                for (let k = 0; k < data.length; ++k) {
                    Adata = data[k]
                    if (Adata.prodProhibitMappingList && Adata.prodProhibitMappingList.length > 0) {
                        let prohibitPlatJSON = {}
                        for (let i = 0; i < Adata.prodProhibitMappingList.length; ++i) {
                            if (!prohibitPlatJSON[Adata.prodProhibitMappingList[i].platCode]) {
                                prohibitPlatJSON[Adata.prodProhibitMappingList[i].platCode] = []
                            }
                            prohibitPlatJSON[Adata.prodProhibitMappingList[i].platCode].push(Adata.prodProhibitMappingList[i])
                        }
                        let prohibitPlatArr = []
                        for (let key in prohibitPlatJSON) {
                            prohibitPlatArr.push({
                                platCode: key,
                                detailList: prohibitPlatJSON[key]
                            })
                        }
                        Adata.prohibitPlatArr = prohibitPlatArr
                    }
                }

                // 处理物流属性 销量
                let logisAliaList, alia, salecountList
                if (data) {
                    for (let i = 0; i < data.length; ++i) {
                        logisAliaList = []
                        if (data[i].logisAttrList != undefined && data[i].logisAttrList != '') {
                            let logisAttrArr = data[i].logisAttrList.split(',')
                            for (let j = 0; j < logisAttrArr.length; ++j) {
                                alia = getColorOfLogis_productTpl(logisAttrArr[j])
                                if (alia && alia != '普') {
                                    logisAliaList.push({
                                        alia: alia,
                                        logisAttr: logisAttrArr[j]
                                    })
                                }
                            }
                        }
                        data[i].logisAliaList = logisAliaList

                        salecountList = data[i].prodPlatSalesCountPDtoList
                        if (salecountList && salecountList.length > 0) {
                            for (let j = 0; j < salecountList.length; j++) {
                                switch (salecountList[j].countDay) {
                                    case 7:
                                        data[i].sevenSales = salecountList[j].totalSales || 0
                                        break
                                    case 15:
                                        data[i].fifteenSales = salecountList[j].totalSales || 0
                                        break
                                    case 30:
                                        data[i].thirtySales = salecountList[j].totalSales || 0
                                        break
                                }
                            }
                        } else {
                            data[i].sevenSales = 0
                            data[i].fifteenSales = 0
                            data[i].thirtySales = 0
                        }
                    }
                }
                time1 = new Date();
                let tbData = {
                        data: data
                    },
                    html = template('tplListTbody_tpl', tbData);
                time2 = new Date();
                $('#tplListTbody').html(html);
				form.render()
                let tplListTrs = $('#tplListTbody>tr');
                for (let x = 0; x < tplListTrs.length; x++) {
                    let $item = $(tplListTrs[x]).find('.prodtpl_developremark>div');
                    if ($item.height() > 235) {
                        let expandStr = `<p class="prodtpl_expand"><b style="cursor:pointer;color:#428bca;"  class="prodtplDetail_expand_single">+展开</b></p>`;
                        $item.parent().append(expandStr);
                    }
                }
                $('#tplListTbody').off('click', '.prodtpl_expand', expandFn)
                //全选和反选功能
                commonSelectAllAndInvert({
                    container: $('#producttplTableBodyDiv'),
                    parentClass: 'prodtpl-cateId-all-cbox',
                    sonClass: 'prodtpl-cateId-cbox'
                });

                imageLazyload();
                $('.producttplTable_head table,.producttplTable_body table').css({ 'width': '100%', 'margin': 0, 'table-layout': 'fixed' });
                checkedOrNot();
                laypage.render({
                    elem: 'tpl_pagination',
                    count: returnData.count,
                    curr: prodTplPage.curr,
                    limit: prodTplPage.limit,
                    limits: [50, 100, 200],
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                    jump: function(obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        prodTplPage.curr = obj.curr;
                        prodTplPage.limit = obj.limit;
                        //首次不执行
                        if (!first) {
                            pageQuery_prodTpl(obj.curr, obj.limit)
                        }
                        $('#tplListTbody').on('click', '.prodtpl_expand', expandFn)
                    }
                }); //laypage结束
            },
            error: function() {
                loading.hide();
            }
        }); //ajax结束
    }

    expandFn = function() {
        let $par = $(this).parent();
        let $txt = $(this).find('.prodtplDetail_expand_single').html();
        if ($txt === '+展开') {
            $par.removeClass('developremarkHidden').addClass('developremarkShow');
            $(this).find('.prodtplDetail_expand_single').html('-收缩');
        } else {
            $par.addClass('developremarkHidden').removeClass('developremarkShow');
            $(this).find('.prodtplDetail_expand_single').html('+展开');
        }
    }

    handleSearchParams = function(pageNum, limit) {
        var tplSearchData = prodtpl_getsearchParam()
        if (!tplSearchData) {
            return
        }
        tplSearchData.page = pageNum;
        tplSearchData.limit = limit;
		tplSearchData.complete = $('#Integrity_detection_producttpl').val()
        // sku 精确:true|模糊:false
        let type = $('#tpl_searchForm [name=switchSearchValue]').prop('checked')
        if(tplSearchData.searchSKUValue != '' && type == true){
            tplSearchData.searchSKUType = tplSearchData.searchSKUType + '2'
        }
        return tplSearchData
    }
    // 搜索按鈕点击
    $("#tpl_searchBtn").click(function() {
        pageQuery_prodTpl(prodTplPage.curr, prodTplPage.limit);
    });

    pageSkuCopy_prodTpl = function(pageNum, limit) {
        let tplSearchData = handleSearchParams(pageNum, limit);
        let type = $('#tpl_searchForm [name=switchSearchValue]').prop('checked')
        if(tplSearchData.searchSKUValue && tplSearchData.searchSKUValue.includes(',') && type == false){
            return layer.msg('多个SKU仅支持精确查询',{icon:7})
        }
        if(tplSearchData.searchSKUValue && tplSearchData.searchSKUValue.split(",").length > 10000){
            return layer.msg('SKU最多支持10000个',{icon:7})
        }
        $.ajax({
            type: "post",
            url: ctx + '/prodTpl/copyProdsPsku.html',
            data: tplSearchData,
            success: function(res) {
                let skuList = res.data || []
                $('#skuCopy').attr('value', skuList.join(',')).show()
                $('#skuCopy').select()
                document.execCommand('copy')
                $('#skuCopy').hide()
                layer.msg('复制成功')
            },
            error: function() {
            }
        }); //ajax结束
    }


    // 一键复制按鈕点击
    $("#tpl_copyBtn").click(function() {
        // 默认先复制checkbox选中的，如果没有则复制查询条件的
        var $inputs = $('#tplListTbody').find('input.prodtpl-cateId-cbox');
        var count = 0;
        var pSkuArr = [];
        for (var i = 0; i < $inputs.length; i++){
            var item = $inputs[i];
            if ($(item).is(':checked')) {
                pSkuArr.push($(item).attr('data-psku'));
                count++;
            }
        };
        if (count == 0) {
            pageSkuCopy_prodTpl(prodTplPage.curr, prodTplPage.limit);
        } else {
            $('#skuCopy').attr('value', pSkuArr.join(',')).show()
            $('#skuCopy').select()          
            document.execCommand('copy')
            $('#skuCopy').hide()
            layer.msg('复制成功')
        }
    });

    producttpl_editTortInfo = function(data){
        editTortInfoPInfo = data
        var index = layer.open({
            type: 1,
            title: '侵权信息编辑',
            content: $('#tortInfoEditPop_productTpl').html(),
            area: ['40%', '75%'],
            btn: ['关闭'],
            success: function (layero, index) {
                layui.form.render('select','tortInfoEditPop_productForm')
                hasChangeTortInfo = false
                // 组装数据
                let tortTable = installTortData(data);
                // 渲染侵权信息表格
                renderTortInfoTable(tortTable);

                $('#producttpl_batchUpdate').click(function (){
                    var checkStatus = table.checkStatus('tortInfoTable_productTpl'),
                        data = checkStatus.data
                    if (data.length === 0) {
                        layer.msg('请选择要更新的数据')
                        return
                    }
                    let formData = serializeObject($('#tortInfoEditPop_productForm'))
                    if (formData.ifTort !== '') {
                        formData.ifTort = formData.ifTort === 'true'
                    }
                    console.log(formData)
                    let map = {}
                    for (let i = 0; i < data.length; ++i) {
                        let self = data[i]
                        map[data[i].platCode] = data[i]
                        for (let j in formData) {
                            if (formData[j] !== '') {
                                self[j] = formData[j]
                            }
                        }
                    }
                    let Adata = {
                        id: editTortInfoPInfo.id,
                        prodTortInfoList: data
                    }
                    let succ = sendTort(Adata)
                    if (!succ) {
                        return;
                    }
                    // 更新表格缓存数据
                    let tableData = layui.table.cache["tortInfoTable_productTpl"]

                    for (let i = 0; i < tableData.length; ++i) {
                        let self = tableData[i]
                        let selectData = map[self.platCode]
                        if (!selectData) {
                            continue
                        }
                        for (let j in formData) {
                            if (formData[j] !== '') {
                                self[j] = formData[j]
                            }
                        }
                    }
                    console.log(layui.table.cache["tortInfoTable_productTpl"])
                    renderTortInfoTable(layui.table.cache["tortInfoTable_productTpl"]);
                })

            },
            end: function () {
                if (hasChangeTortInfo) {
                    reRenderPage()
                }
            }
        })
    }

    function renderTortInfoTable(tortTable) {
        table.render({
            elem: "#tortInfoTable_productTpl",
            data: tortTable,
            limit: 1000,
            id: 'tortInfoTable_productTpl',
            cols: [
                [
                    {type: 'checkbox', width: '5%'},
                    {
                        title: "侵权状态",
                        style: 'padding-left:2%',
                        width: '15%',
                        minWidth: 115,
                        templet: function (res) {
                            console.log(res.ifTort)
                            var html = `<div class="layui-form alignLeft" lay-event="edit" ><input name="ifTort" type="checkbox" lay-filter="tortStatusCheckbox" lay-skin="primary" ` + `title="`+ res.platCode +`" `  + (res.ifTort ? 'checked' : '') + `></div>`
                            return '<em>' + html + '</em>'
                        }
                    },
                    { title: "侵权备注(可编辑)", width: '40%', edit:'text',field: 'tortReason', style: 'background-color: #7FFFD4;'},
                    { title: "销售备注(可编辑)", width: '40%', edit:'text',field: 'saleRemark', style: 'background-color: #7FFFD4;'},
                ]
            ],
            done: function () {
                form.render('checkbox','producttpl_tortInfoEditTableForm')
                table.on('tool(tortInfoTable_productTpl)', function(obj) {
                    var layEvent = obj.event; //获得 lay-event 对应的值
                    var data = obj.data; //获得当前行数据
                    if (layEvent === 'edit') {
                        let tr = obj.tr
                        let ifTort = $(tr).find('[name=ifTort]').prop('checked')
                        console.log(ifTort)
                        // 如果是点击了空白处，未变更侵权状态，则为无效点击
                        if (ifTort === data.ifTort) {
                            return
                        }
                        // 更新表格当前行的缓存数据
                        obj.updateLine({ifTort: ifTort})
                        data.ifTort = ifTort
                        let Adata = {
                            id: editTortInfoPInfo.id,
                            prodTortInfoList: [
                                data
                            ]
                        }
                        let succ = sendTort(Adata)
                        if (!succ) {
                            $(tr).find('[name=ifTort]').prop('checked',false)
                            obj.updateLine({ifTort: false})
                            form.render('checkbox','producttpl_tortInfoEditTableForm')
                        }
                    }
                })
                table.on('edit(tortInfoTable_productTpl)', function(obj) {
                    let value = obj.value //得到修改后的值
                        ,
                        data = obj.data //得到所在行所有键值
                        ,
                        field = obj.field; //得到字段
                    console.log(layui.table.cache["tortInfoTable_productTpl"])
                    let Adata = {
                        id: editTortInfoPInfo.id,
                        prodTortInfoList: [
                            data
                        ]
                    }
                    sendTort(Adata)
                })
            }
        })
    }

    function initSalesSite_prodTpl(platCode) {
        // debugger
        let siteDiv = $('#salesSite_searchForm_' + platCode)
        let html
        if (siteDiv.length) {
            html = siteDiv.html()
        } else {
            html = '<option></option>'
        }
        $('#tpl_searchForm #pt_prohibitSalesSiteId').html(html)
        layui.formSelects.render("prohibitSalesSiteId")
    }
    // 禁售站点选择
    form.on('select(prohibitPlat_prodTpl)', function(data) {
        var platCode = data.value
        initSalesSite_prodTpl(platCode)
    });

    // 详情点击事件
    detail_producttpl = function(id, auditStatus) { // ifCheck  是否有审核权
        prodTplCopyAdd=false;
        var btn,
            title = '详情',
            btn1Fun,
            btn2Fun
        var ifUpdate_prodtemp = $('#ifUpdate_prodtemp')
        if (ifUpdate_prodtemp.length > 0) {
            if (auditStatus == 1 || auditStatus == 3) { // 已经通过审核、待审核状态
                btn = ['保存', '关闭']
                btn1Fun = function() {
                    if (!checkNotNull('#addProdTplForm')) {
                        return false
                    }
                    submit_template('',true);
                    return false
                }
                btn2Fun = function() {
                    return true
                }
            } else { // 待发布、审核失败
                btn = ['保存并发布', '保存', '关闭']
                btn1Fun = function() {
                    if (!checkNotNull('#addProdTplForm')) {
                        return false
                    }
                    submit_template(1,true);
                    return false
                }
                btn2Fun = function() {
                    if (!checkNotNull('#addProdTplForm')) {
                        return false
                    }
                    submit_template('',true);
                    return false
                }
            }
        } else {
            btn = ['关闭']
            btn1Fun = function() {
                layer.closeAll()
            }
        }

        var index = layer.open({
            title: title,
            type: 1, //不加该属性,就会出现[object Object]
            btn: btn,
            id: 'producttpl_tplDetail',
            content: $('#producttplAddLayer').html(),
            area: ['1350px', '90%'],
            // shade: 0,
            success: function(layero) {
                //监听模板类型选中
                producttpl_tplTypeFn();
                layuiOpenPop = true
                // 初始化必填项
                initNotNull()
                // 开发详情弹窗
                $('#openDevDetailBtn').click(function () {
                    window.setTimeout(function () {
                        $('#openDevDetailBtn').removeClass('layui-this')
                    },1000)
                    newdevdetail_openDevDetail(null,$('#addProdTplForm').find('[name=devPSku]').val())
                })
                    // 隐藏 颜色、尺寸、原始标题等
                $('.ifDetailHidden').hide()
                    //显示新增变种按钮
                $('.addVariantBtn').show()
                // 引流点击事件
                form.on('checkbox(ifSpreadCheckBox_prodTpl)',function (data) {
                    var checked = data.elem.checked
                    // 如果被选中，则取消其他的选中
                    if (checked) {
                        $('.ifSpreadCheckBox_prodTpl').removeAttr('checked')
                        data.elem.checked = true
                        form.render('checkbox','variantTableForm')
                    }
                })
                // 初始化关键词编辑
                initKeywordEdit(id)
                // 设定本地图片上传功能 -- 主图
                uploadLocalImg($('[data-id=mainImgContains]'))
                    // 设定网络图片上传功能 -- 主图
                uploadNetImg($('[data-id=mainImgContains]'))
                    // 设定本地图片上传功能 -- 辅图
                uploadLocalImg($('[data-id=assistImgContains]'))
                    // 设定网络图片上传功能 -- 辅图
                uploadNetImg($('[data-id=assistImgContains]'))

                    // 审核组件
                addAuditFrom(layero)
                if ($('#ifCheck_prodtemp').length > 0) {
                    $('#auditBox_prodTpl').show()
                }
                // 复现数据
                prodTpl_getTplDetail(id, 'show');
				form.render('select')
                form.render('checkbox');
				//  查询日志事件
                $('#producttpl_queryLogBtn').click(function () {
                    getTplLogs(id);
                })

                // 展开或者收缩 其他自拍图
                $('#producttpl_showMoreOtherImg').click(function () {
                    let show = $(this).attr('data-show')
                    if (show === 'true') {
                        $('#producttpl_otherImgContains').addClass('overContentEllipsis200px')
                        $(this).attr('data-show','false')
                        $(this).html("展开")
                    } else {
                        $('#producttpl_otherImgContains').removeClass('overContentEllipsis200px')
                        $(this).attr('data-show','true')
                        $(this).html("收缩")
                    }
                })

                // 查询禁售详情
                // queryProdProhibitDetail(id)
                layui.formSelects.data('tpl_select_joomSens', 'local', { arr: joomSensArray });

                // 监听滚动
                $('#producttpl_tplDetail').scroll(function() {
                        toFixedTabHead(this)
                    })
                    //一键复制2个textarea框的内容
                $('.copyTwoTextareaVal').on('click', function() {
                    var prodDescVal = $('textarea[name="prodDesc"]').val(),
                        fixDescVal = $('textarea[name="fixDesc"]').val();
                    var creatTextarea = document.createElement("textarea");
                    creatTextarea.value = prodDescVal + '\n' + fixDescVal;
                    document.body.appendChild(creatTextarea);
                    creatTextarea.select();
                    try {
                        var successful = document.execCommand('copy');
                        var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
                        layer.msg(msg);
                    } catch (err) {
                        layer.msg('该浏览器不支持点击复制到剪贴板');
                    }
                    document.body.removeChild(creatTextarea);
                });
                //一键复制弹框表格所有sku
                $('#prodtpl_copy').on('click', function(){
                    var $trs = $(this).parents('thead').next().find('tr');
                    var skuArr = [];
                    for(var i=0; i< $trs.length; i++){
                        var item = $trs[i];
                        if(!$(item).hasClass('imgContains')){
                            var $sku =$(item).find('td input[name=sSku]').val();
                            skuArr.push($sku);
                        }
                    };
                    var $skuTxt = skuArr.join('\n');
                    var oTextarea = document.createElement('textarea');
                    oTextarea.innerHTML = $skuTxt;
                    document.body.appendChild(oTextarea);
                    oTextarea.select();
                    document.execCommand('copy');
                    layer.msg('复制sku成功');
                    document.body.removeChild(oTextarea);
                    return false;
                });

                //显示开发思路按钮
                $('#addProdTplForm .devIdeaWayBtn').show();
                $('#addProdTplForm .devIdeaWayBtn').attr('dataid', id);
                let mp4Name = ''
                // 视频本地上传
                initUploadVedio(upload,'.localUploadNetMp4Btn',imageUpDomain + 'file/uploadFile',templateVedioUploadPath)
            },
            yes: function() {
                return btn1Fun()
            },
            btn2: function(index, layero) {
                return btn2Fun()
            },
            end: function() {
                layuiOpenPop = false
            }
        })
    }

    //#region 复制新增事件start
    detail_producttplCopyAdd = function(id) { // ifCheck  是否有审核权
        prodTplCopyAdd=true;
        var index = layer.open({
            title: '复制新增',
            type: 1, //不加该属性,就会出现[object Object]
            btn: ['存草稿', '新建并发布', '新建', '关闭'],
            id: 'producttpl_tplDetailCopy',
            content: $('#producttplAddLayer').html(),
            area: ['1350px', '80%'],
            // shade: 0,
            success: function(layero) {
                //监听模板类型选中
                producttpl_tplTypeFn();
                layuiOpenPop = true
                // 初始化必填项
                initNotNull()
                // 开发详情弹窗
                $('.isCreateHidden').hide()
                    // 隐藏 颜色、尺寸、原始标题等
                $('.ifDetailHidden').hide()
                    //显示新增变种按钮
                $('.addVariantBtn').show()
                // 引流点击事件
                form.on('checkbox(ifSpreadCheckBox_prodTpl)',function (data) {
                    var checked = data.elem.checked
                    // 如果被选中，则取消其他的选中
                    if (checked) {
                        $('.ifSpreadCheckBox_prodTpl').removeAttr('checked')
                        data.elem.checked = true
                        form.render('checkbox','variantTableForm')
                    }
                })
                // 初始化关键词编辑
                initKeywordEdit()
                // 设定本地图片上传功能 -- 主图
                uploadLocalImg($('[data-id=mainImgContains]'))
                    // 设定网络图片上传功能 -- 主图
                uploadNetImg($('[data-id=mainImgContains]'))
                    // 设定本地图片上传功能 -- 辅图
                uploadLocalImg($('[data-id=assistImgContains]'))
                    // 设定网络图片上传功能 -- 辅图
                uploadNetImg($('[data-id=assistImgContains]'))

                // 复现数据
                prodTpl_getTplDetail(id, 'copy',true);
                form.render('checkbox');

                // joom敏感货选项初始化
                layui.formSelects.data('tpl_select_joomSens', 'local', { arr: joomSensArray });

                // 监听滚动
                $('#producttpl_tplDetail').scroll(function() {
                        toFixedTabHead(this)
                })
                //一键复制2个textarea框的内容
                $('.copyTwoTextareaVal').on('click', function() {
                    var prodDescVal = $('textarea[name="prodDesc"]').val(),
                        fixDescVal = $('textarea[name="fixDesc"]').val();
                    var creatTextarea = document.createElement("textarea");
                    creatTextarea.value = prodDescVal + '\n' + fixDescVal;
                    document.body.appendChild(creatTextarea);
                    creatTextarea.select();
                    try {
                        var successful = document.execCommand('copy');
                        var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
                        layer.msg(msg);
                    } catch (err) {
                        layer.msg('该浏览器不支持点击复制到剪贴板');
                    }
                    document.body.removeChild(creatTextarea);
                });
                //一键复制弹框表格所有sku
                $('#prodtpl_copy').on('click', function(){
                    var $trs = $(this).parents('thead').next().find('tr');
                    var skuArr = [];
                    for(var i=0; i< $trs.length; i++){
                        var item = $trs[i];
                        if(!$(item).hasClass('imgContains')){
                            var $sku =$(item).find('td:first-child>input[name=sSku]').val();
                            skuArr.push($sku);
                        }
                    };
                    var $skuTxt = skuArr.join('\n');
                    var oTextarea = document.createElement('textarea');
                    oTextarea.innerHTML = $skuTxt;
                    document.body.appendChild(oTextarea);
                    oTextarea.select();
                    document.execCommand('copy');
                    layer.msg('复制sku成功');
                    document.body.removeChild(oTextarea);
                    return false;
                });
                // 新增父商品按钮事件
                $('#producttpl_addParentProdBtn').show()
                // 仅保留关键词/仅保留标题、关键词、描述
                $('#producttpl_keyword').show()
                $('#producttpl_title_keyword_desc').show()

                let reback = function (pSku) {
                    let formElem = $('#addProdTplForm')
                    let pSkuElem = formElem.find('[name=pSku]')
                    pSkuElem.val(pSku)
                    pSkuElem.blur()
                }
                $('#producttpl_addParentProdBtn').click(function () {
                    popToAddOrUpdProdPInfo(null,reback)
                })
                $('#producttpl_keyword').click(function () {
                    resetForm_other('keyword')
                })
                $('#producttpl_title_keyword_desc').click(function () {
                    resetForm_other()
                })
                // 视频本地上传
                initUploadVedio(upload,'.localUploadNetMp4Btn',imageUpDomain + 'file/uploadFile',templateVedioUploadPath)
            },
            yes: function(index, layero) {
                // 存草稿
                let data = prodTpl_getSubmitInfo ('noCheck')
                // 获取子模板数据
                data.varients = getVariety_template(false)
                data.bizzOwner = $('#addProdTplForm').find('[name=bizzOwner]').val()
                data.responsor = $('#addProdTplForm').find('[name=responsor]').val()
                data.cateName = $('#addProdTplForm').find('[name=cateName]').val()
                data.newCateName = $('#addProdTplForm').find('[name=newCateName]').val()
                window.localStorage.setItem('producttpl_initData',JSON.stringify(data))
                layer.msg('存草稿成功')
            },
            btn2: function() {
                // 新建并发布
                if (!checkNotNull('#addProdTplForm')) {
                    return false
                }
                if (pSkuValid) {
                    submit_template(1);
                } else {
                    layer.msg("模板父sku不合格,不能提交");
                }
                return false
            },
            btn3: function() {
                // 新建
                if (!checkNotNull('#addProdTplForm')) {
                    return false
                }
                if (pSkuValid) {
                    submit_template('');
                } else {
                    layer.msg("模板父sku不合格,不能提交");
                }
                return false
            },
            btn4: function() {
                selSizeArr = [];
            },
            end: function() {
                newSizeData.length = 0;
                layuiOpenPop = false
            }
        })
    }
    //#endregion 复制新增事件end

    // type=keyword,仅保留关键词，其它的保留标题关键词描述
    function resetForm_other(type){
        // 移除所有主图&移除所有辅图
        $("#producttpl_tplDetailCopy .uploadImgUL").html('');
        // 视频
        $("#producttpl_tplDetailCopy .mp4Contain").html('');
        // Joom敏感货
        layui.formSelects.data('tpl_select_joomSens', 'local', { arr: [] });
        // 产品变种表格
        $("#goodsList").html('')
        let keywordCore = $("#addProdTplForm").find('[name=keywordCore] .keywordInp').val(),
            keywordProdAttr = $("#addProdTplForm").find('[name=keywordProdAttr] .keywordInp').val(),
            keywordFit = $("#addProdTplForm").find('[name=keywordFit] .keywordInp').val(),
            keywordExtra = $("#addProdTplForm").find('[name=keywordExtra] .keywordInp').val(),
            // 自拍图状态
            // selfImgStatus = $("#addProdTplForm [name=selfImgStatus]").val(),
            enTitle = $("#addProdTplForm [name=enTitle]").val(),
            prodDesc = $("#addProdTplForm [name=prodDesc]").val(),
            fixDesc = $("#addProdTplForm [name=fixDesc]").val();
        // 清空form表单
        $("#addProdTplForm")[0].reset()
        if(type != 'keyword'){
            $("#addProdTplForm [name=enTitle]").val(enTitle);
            $("#addProdTplForm [name=prodDesc]").val(prodDesc);
            $("#addProdTplForm [name=fixDesc]").val(fixDesc);
        }
        // $("#addProdTplForm [name=selfImgStatus]").val('无自拍图')
        $("#addProdTplForm").find('[name=keywordCore] .keywordInp').val(keywordCore);
        $("#addProdTplForm").find('[name=keywordProdAttr] .keywordInp').val(keywordProdAttr);
        $("#addProdTplForm").find('[name=keywordFit] .keywordInp').val(keywordFit);
        $("#addProdTplForm").find('[name=keywordExtra] .keywordInp').val(keywordExtra);
    }

    tplAuditLog = function(id) {
        if (typeof(id) == undefined) {
            return
        }
        var index = layer.open({
            type: 1,
            title: '审核日志',
            area: ['800px', '400px'],
            btn: ['关闭'],
            yes: function(index, layero) {
                layer.close(index);
            },
            shadeClose: false,
            content: $('#tpl_auditLogLayer').html(),
            success: function() {
                $.ajax({
                    type: 'post',
                    url: ctx + '/prodTpl/getTplAuditLog.html',
                    data: { 'pid': id },
                    // async: false,
                    dataType: 'json',
                    success: function(returnData) {
                        if (returnData.code != '0000') {
                            layer.msg(returnData.msg, { icon: 5 })
                        } else {
                            var prodLogs = returnData.data
                            for (var i in prodLogs) {
                                var tr = '<tr>'
                                if (typeof(prodLogs[i].operNote) == 'undefined') {
                                    prodLogs[i].operNote = ''
                                }
                                tr += '<td>' + layui.admin.Format(prodLogs[i].operTime, 'yyyy-MM-dd hh:mm:ss') + '</td><td>' + prodLogs[i].operator + '</td><td>' + prodLogs[i].operDesc + '</td><td>' + prodLogs[i].operNote + '</td></tr>'
                                $("#tpl_auditLogTbody").append(tr)
                            }
                        }
                    },
                    error: function() {
                        layer.msg('发送请求失败')
                    }
                })
            },
            end: function() {
                $('#tpl_auditLogTbody').html("");
            }
        })
    }

    // 查询禁售详情
    function queryProdProhibitDetail(id) {
        table.render({
            elem: "#prodprohibitDetail_producttpl",
            method: 'post',
            url: ctx + "/prohibit/getprohibitDetail.html",
            where: { prodPId: id },
            cols: [
                [
                    { type: "checkbox", width: 30 },
                    { field: "platCode", title: "平台", width: 70 },
                    { field: "salesSite", title: "销售站点" },
                    { title: "是否禁售", width: 36, templet: "<div>{{d.isListingAble ? '否' : '是'}}</div>" },
                    { field: "lisintgInableMsg", title: "禁售原因" },
                ],
            ],
            id: "prodprohibitDetailTab",
            page: false,
            height: '350px'
        });
    }

    function addAuditFrom(containsObj) {
        var $html = `<div class="layui-form-item layui-form auditForm_prodtpl" style="position:absolute;bottom:0;left:30px;width: 70%">
                                        <div id="auditBox_prodTpl" class="disN">
                                           <div class="layui-inline" style="float: left;width: 80px">
                                                    <select type="text" class="layui-input" name="auditStatus" placeholder="审核结果" style="height:30px">
                                                    <option value=""></option>
                                                    <option value="3">通过</option>
                                                    <option value="4">失败</option>
                                                    </select>
                                                </div> 
                                                <div class="layui-inline"  style="float: left;">
                                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="auditProdPInfo_prodTpl(this)">审核</button>
                                                </div>
                                                <div class="layui-inline"  style="float: left; width: 35%">
                                                    <input type="text" class="layui-input" placeholder="审核备注" style="height:30px" name="auditDesc">
                                                </div>   
                                        </div>
                                                        
                                        </div>`;

        var $target = containsObj.find('.layui-layer-btn.layui-layer-btn-')
        $target.append($html);
        form.render('select');
    }

    //同时绑定多个日期
    lay('.test-item').each(function() {
        laydate.render({
            elem: this,
            trigger: 'click'
        })
    });

    getSalesByPlayCode = function(platCode) {
        $('#productTplCheckAllSaler').prop('checked',false)
        form.render('checkbox','salesCheckForm_producttpl')
        $('#salesCheckForm_producttpl [name=platCode]').val(platCode)
        var box = $('#saleContent_producttpl [data-platCode='+ platCode +']')
        var ifInit = box.attr('data-init')
        $('#saleContent_producttpl .layui-tab-item').hide()
        box.show()
        // 如果已经初始化人员将不再发送请求
        if (!ifInit) {
            $.ajax({
                type: 'post',
                url: ctx + '/prodTpl/getSalespersonList.html',
                dataType: 'json',
                data: {platCode: platCode},
                success: function(res) {
                    if (res.code == '0000') {
                        var html = ''
                        var list = res.data
                        if (list && list.length > 0) {
                            var group,groupDiv,saleList,i,j,saleperson
                            for (i = 0; i < list.length; ++i) {
                                group = list[i]
                                groupDiv = `<div class="saleGroupBox">`
                                groupDiv += `<div class="saleGroupHeader">
                                                <div style="clear:left"></div>
                                                <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                                    <legend style="font-size:14px"><input name="sellLeaderId" value="` + group.salespersonId + `" type="checkbox" lay-skin="primary" lay-filter="saleGroupHeaderCheckBox" title="` + group.sellLeaderName + `"></legend>
                                                </fieldset>
                                            </div>`
                                groupDiv += `<div class="saleGroupBody">`
                                saleList = group.salespersonList
                                for (j = 0; j < saleList.length; ++j) {
                                    saleperson = saleList[j]
                                    groupDiv += `<div class="fieldBox">
                                                    <input name="salespersonId" value="` + saleperson.salespersonId + `" title="` + saleperson.salesperson + `" type="checkbox" lay-skin="primary">
                                                </div>`
                                }
                                groupDiv += `</div></div>`
                                html += groupDiv
                            }
                            box.html(html)
                            form.render('checkbox','salesCheckForm_producttpl')
                        }
                        box.attr('data-init','true')
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
        }

    }

    $('#exportListingStatusBtn_prodTemp').click(function() {
        layer.open({
            title: '导出刊登统计',
            type: 1, //不加该属性,就会出现[object Object]
            btn: ['确定', '关闭'],
            id: 'producttplAddSuccess',
            content: $('#exportPublishStasticsPop_producttpl').html(),
            area: ['1350px', '80%'],
            // shade: 0,
            success: function() {
                getSalesByPlayCode('ebay')
                form.on('checkbox(productTplCheckAllSaler)',function (data) {
                    let platCode = $('#salesCheckForm_producttpl [name=platCode]').val()
                    $('#salesCheckForm_producttpl').find('[data-platCode='+ platCode +'] input[type=checkbox]').prop('checked',data.elem.checked)
                    form.render('checkbox', 'salesCheckForm_producttpl')
                })
            },
            yes : function () {
                var platCode = $('#salesCheckForm_producttpl [name=platCode]').val()
                var salespersonCheckedList = $('#salesCheckForm_producttpl [data-platCode='+ platCode +'] [name=salespersonId]:checked')
                var salespersonIdList = []
                var salespersonList = []
                for (var i = 0; i < salespersonCheckedList.length; ++i) {
                    salespersonIdList.push(salespersonCheckedList[i].value)
                    salespersonList.push(salespersonCheckedList[i].title)
                }
                var searchParam = prodtpl_getsearchParam()
                if (!searchParam) {
                    return
                }
                data.searchParam = JSON.stringify(searchParam)
                data.platCode = platCode
                data.salespersonIdList = salespersonIdList
                data.salespersonList = salespersonList
                layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                submitForm(data, ctx + '/prodTpl/exportListingStatus.html')
            }
        })
    })

    form.on('checkbox(saleGroupHeaderCheckBox)', function (data) {
        var checked = data.elem.checked
        var children = $(data.elem).closest('.saleGroupBox').find('.saleGroupBody [name=salespersonId]')

        children.prop('checked',checked)
        form.render('checkbox','salesCheckForm_producttpl')
    })

    //表单重置
    $("#tpl_resetBtn").click(function() {
        $("#tpl_searchForm input[name='cateId']").val('');
        $('#tplCateInfo').html("");
		$('#prod_clearPlat_outside').click()
    })
    function producttpl_tplTypeFn(){
        // form.on('select(producttpl_tplTypeFilter)', function(obj){
        //     var val = obj.value;
        //     if(val==0){ //直邮,没有核心关键词和亚马逊五点描述
        //         $('.coreKeyWordItem').addClass('disN');
        //         $('.fivePointDescItem').addClass('disN');
        //     }else{//有核心关键词和亚马逊五点描述
        //         $('.coreKeyWordItem').removeClass('disN');
        //         $('.fivePointDescItem').removeClass('disN');
        //     }
        //     // $('.coreKeyWordItem').find('[name=coreKeyWord]').val('');
        //     // $('.fivePointDescItem').find('[name=fivePointDesc]').val('');
        // })
    }
    var keywordLiTmp = {
        'keywordCore': `<li class="clearLeft mt10" style="min-height: 32px">
                                                <div class="layui-col-md2 layui-col-lg2">
                                                    <div class="layui-badge pointHand layui-bg-green prodtpl_analysisBtn">分析</div>
                                                </div>
                                                <div class="layui-col-md9 layui-col-lg9">
                                                    <input class="layui-input keywordInp" value="$value">
                                                </div>
                                                <div class="layui-col-md1 layui-col-lg1">
                                                    <i class="layui-icon layui-icon-reduce-circle pointHand deleteCurKeyWordBtn" layui-col-md10 layui-col-lg10>&#xe640;</i>
                                                </div>
                                            </li>`,
        'keywordProdAttr': `<li class="clearLeft mt10" style="min-height: 32px">
                                                <div class="layui-col-md2 layui-col-lg2">
                                                    &nbsp;
                                                </div>
                                                <div class="layui-col-md9 layui-col-lg9">
                                                    <input class="layui-input keywordInp" value="$value">
                                                </div>
                                                <div class="layui-col-md1 layui-col-lg1">
                                                    <i class="layui-icon layui-icon-reduce-circle pointHand deleteCurKeyWordBtn" layui-col-md10 layui-col-lg10>&#xe640;</i>
                                                </div>
                                            </li>`,
        'keywordFit': `<li class="clearLeft mt10" style="min-height: 32px">
                                                <div class="layui-col-md2 layui-col-lg2">
                                                    &nbsp;
                                                </div>
                                                <div class="layui-col-md9 layui-col-lg9">
                                                    <input class="layui-input keywordInp" value="$value">
                                                </div>
                                                <div class="layui-col-md1 layui-col-lg1">
                                                    <i class="layui-icon layui-icon-reduce-circle pointHand deleteCurKeyWordBtn" layui-col-md10 layui-col-lg10>&#xe640;</i>
                                                </div>
                                            </li>`,
        'keywordExtra': `<li class="clearLeft mt10" style="min-height: 32px">
                                                <div class="layui-col-md2 layui-col-lg2">
                                                    &nbsp;
                                                </div>
                                                <div class="layui-col-md9 layui-col-lg9">
                                                    <input class="layui-input keywordInp" value="$value">
                                                </div>
                                                <div class="layui-col-md1 layui-col-lg1">
                                                    <i class="layui-icon layui-icon-reduce-circle pointHand deleteCurKeyWordBtn" layui-col-md10 layui-col-lg10>&#xe640;</i>
                                                </div>
                                            </li>`
    }

    // 关键词编辑相关事件 初始化
    function initKeywordEdit(id){
        if (!id) {
            $('#producttpl_keyword_tip').show()
        } else {
            $('#producttpl_keyword_tip').hide()
        }
        // 首字母大写按钮
        $('#prodtpl_keywordFirstLetterUpperBtn').click(function () {
            for (let i = 0; i < prodTpl_keywordtype.length; ++i) {
                let textArea = $('.keywordContain[name='+ prodTpl_keywordtype[i] +'] .keywordInp')
                let finalValue = textArea.val()
                finalValue = changeUpCase(finalValue)
                textArea.val(finalValue)
            }
        })

        // 隐藏旧模板关键词编辑
        $('.oldKeyWordElem').hide()
        $('.newKeyWordElem').show()
        // 初始化编辑器
        $('#producttpl_keyword_btn_contains').tagsinput();
        $('#producttpl_keyword_btn_containsblock .bootstrap-tagsinput').css('border','0')
        $('#producttpl_keyword_btn_containsblock .bootstrap-tagsinput input').attr('readonly','readonly')
        // 旧版转新版
        $('#prodtpl_showNewKeyWordElemBtn').click(function () {
            $('#prodTpl_ifNewKeyword').val('true')
            $('#prodtpl_showNewKeyWordElemBtn').hide()
            $('.oldKeyWordElem').hide()
            $('.newKeyWordElem').show()
        })

        // 3、关键词复制
        $('#prodtpl_copyNewKeyWordBtn').click(function () {
            let ketwordCore = getKeywordFromLi('keywordCore','\n')
            let keywordProdAttr = getKeywordFromLi('keywordProdAttr','\n')
            let keywordFit = getKeywordFromLi('keywordFit','\n')
            let keywordExtra = getKeywordFromLi('keywordExtra','\n')

            let arr = [ketwordCore.keyword,keywordProdAttr.keyword,keywordFit.keyword,keywordExtra.keyword]
            let totalKeyWord = arr.join('\n')
            copyTxtToClipboard(totalKeyWord,'textarea')
        })


        $('#addProdTplForm').on('blur','.keywordInp',function () {
            let allText = this.value
            let arr = allText.split('\n')
            let finalArr = []
            for (let i = 0;i < arr.length; ++i) {
                finalArr.push(arr[i].trim())
            }
            let finalValue = finalArr.join('\n')

            this.value = finalValue
        })


        // 输入后，去除前后空格。并统计数量
        $('#addProdTplForm').on('input propertychange','.keywordInp',function () {
            countKeyWordNum()
        })

        // 7、分析
        $('#addProdTplForm').on('click','.prodtpl_analysisBtn',function () {
            let content = $(this).closest('.keywordContain').find('.keywordInp').val().trim()
            if (!content) {
                layer.msg('请填写后再分析')
                return
            }
            let arr = content.split('\n');
            content = arr[0]
            layer.open({
                title: '分析关键词',
                type: 1, //不加该属性,就会出现[object Object]
                btn: ['关闭'],
                id: 'producttpl_analysisLayer',
                content: $('#producttpl_analysis_pop').html(),
                area: ['1350px', '80%'],
                // shade: 0,
                success: function() {
                    // 添加到关键词
                    $('#producttpl_analysis_addToKeyWordCoreBtn').click(function () {
                        var checkStatus = table.checkStatus('producttpl_analysisTable'),
                            selectedDtoList = checkStatus.data
                        if (!selectedDtoList || !selectedDtoList.length) {
                            layer.msg('请选择关键词')
                            return
                        }
                        let repeatKeyword = []
                        let totalSucc = 0;
                        let succKeyword = []
                        for (let i =0; i< selectedDtoList.length; ++i) {
                            let curKeyword = selectedDtoList[i].keyword
                            let succ = addKeywordLi('keywordCore',curKeyword)
                            if (!succ) {
                                repeatKeyword.push(curKeyword)
                            } else {
                                succKeyword.push(curKeyword)
                                totalSucc++;
                            }
                        }
                        layer.alert('本次总共添加' + selectedDtoList.length + ' 个关键词，成功' + totalSucc + "个;" + (repeatKeyword.length ? ('其中存在重复关键词:' + repeatKeyword.join(',')) : '') )
                    })
                    let popHeight = $('#producttpl_analysisLayer')[0].clientHeight
                    console.log(popHeight)

                    $.ajax({
                        type: "get",
                        url: 'https://adtargeting.io/adtargeting/chrome/google-interests?keyword=' + content,
                        success: function(returnData) {
                            table.render({
                                elem: "#producttpl_analysisTable1",
                                id: "producttpl_analysisTable1",
                                data: returnData.data.pageData,
                                height: popHeight -70,
                                cols: [
                                    [
                                        {type: "checkbox", width: 30},
                                        {field: "interest_name", title: "关键词", width: 350},
                                        {field: "trends1", title: "search Volume", width: 250,templet: '#producttpl_analysisTable_trends1'},
                                        {field: "cpc", title: "CPC"},
                                        {field: "competition", title: "Pd",templet: '<div>{{d.competition * 100}}</div>',}
                                    ],
                                ],
                                page: true,
                                limit: 50,
                                limits: [50,100,500],
                                done: function (res, curr, count) {
                                    res.data.forEach(item => {
                                        //指定图表配置项和数据
                                        let arrKey=[],arrVal=[];
                                        for(let key in item.trends){
                                            arrKey.push(key)
                                            arrVal.push(item.trends[key])
                                        }
                                        var optionchart = {
                                            tooltip: {
                                                trigger: 'axis'
                                            },
                                            xAxis: {
                                                show:false,
                                                data: arrKey
                                            },
                                            yAxis: {
                                                show:false,
                                                type: 'value'
                                            },
                                            series: [
                                                {
                                                    name: 'search Volume',
                                                    type: 'bar',
                                                    data: arrVal
                                                }
                                            ]
                                        };
                                        var chartZhu = echarts.init(document.getElementById('EchartZhu' + item.md5));
                                        chartZhu.setOption(optionchart, true);
                                    })
                                }
                            })
                        }
                    })

                    table.render({
                            elem: "#producttpl_analysisTable",
                            id: "producttpl_analysisTable",
                            method: 'post',
                            url: ctx + '/ProdTemplateKeyWord/queryKeyWorld',
                            where: {keyword : content},
                            contentType: "application/json;charset=UTF-8",
                            height: popHeight -70,
                            cols: [
                                [
                                    {type: "checkbox", width: 30},
                                    {field: "keyword", title: "关键词", width: 250},
                                    {field: "relevancy", title: "相关度",  sort: true},
                                    {field: "trends1", title: "月搜索趋势", width: 250,templet: '#producttpl_analysisTable_trends2'},
                                    {field: "searchRank", title: "ABA排名",  sort: true},
                                    {field: "searches", title: "月搜索量",  sort: true},
                                    {field: "spr", title: "SPR",  sort: true},
                                    {field: "titleDensity", title: "标题密度",  sort: true},
                                    {field: "purchases", title: "购买量",templet: '#producttpl_analysisTable_purchases',  sort: true},
                                    {field: "products", title: "商品数",  sort: true},
                                    {field: "supplyDemandRatio", title: "供需比",  sort: true},
                                    {field: "adProducts", title: "广告竞品数",  sort: true},
                                    {field: "monopolyClickRate", title: "点击集中度",templet: '#producttpl_analysisTable_monopolyClickRate',  sort: true},
                                    {field: "bid", title: "PPC竞价",templet: '#producttpl_analysisTable_bid', width: 150,  sort: true}
                                ],
                            ],
                            page: true,
                            limit: 50,
                            limits: [50,100,500],
                            done: function (res, curr, count) {
                                res.data.forEach(item => {
                                    //指定图表配置项和数据
                                    var optionchart = {
                                        xAxis: {
                                            show:false,
                                            type: 'category',
                                            boundaryGap: false,
                                            data:  item.trends.map(i => i.month)
                                        },
                                        yAxis: {
                                            show:false,
                                            type: 'value'
                                        },
                                        tooltip: {
                                            trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
                                            formatter: function (params) {
                                                var html=params[0].name+"<br>";
                                                for(var i=0;i<params.length;i++){
                                                    if(params[i].seriesName == '月搜索量'){
                                                        // (item.trends[index-1].searchRank-key.searchRank)/key.searchRank).toFixed(2)*100
                                                        let nData = (params[i].dataIndex == 0?'-': (parseFloat(params[i].series.data[params[i].dataIndex-1]-params[i].value)/params[i].series.data[params[i].dataIndex-1]).toFixed(2)*100)
                                                        html+=params[i].seriesName+":"+params[i].value+"<br>";
                                                        html+="环比变化:"+(!isNaN(parseFloat(nData))?nData:'-')+"%<br>";
                                                    }else{
                                                        html+=params[i].seriesName+":"+params[i].value+"<br>";
                                                    }
                                                }
                                                return html;
                                            }
                                        },
                                        series: [
                                            {
                                                type: 'line',
                                                stack: 'Total',
                                                name: '月搜索量',
                                                data: item.trends.map(i => i.search),
                                            },
                                            {
                                                type: 'line',
                                                stack: 'Total',
                                                name: 'ABA排名',
                                                data: item.trends.map(i => i.searchRank),
                                            }
                                        ]
                                    };

                                var chartZhu = echarts.init(document.getElementById('EchartZhu' + item.keyword.replaceAll(' ','')));
                                chartZhu.setOption(optionchart, true);
                            })
                        }
                    })
                }
            })
        })

        // 生成测试标题
        $('#prodtpl_generateTestTitleBtn').click(function () {
            let receiveDataObj = prodTpl_getSubmitInfo()
            if (!receiveDataObj) {
                return
            }
            let data = {
                prodPInfoDto: receiveDataObj,
                platCode: 'aliexpress'
            }
            oneAjax.post({
                url: '/prodTpl/generateTitle',
                data: data,
                success: function (res) {
                    if (res.code === '0000') {
                        $('#producttpl_testTitleSpan').text(res.data)
                    }
                }
            })
        })
    }

    // 计算关键词数量
    function countKeyWordNum() {
        let ketwordCore = getKeywordFromLi('keywordCore')
        let keywordProdAttr = getKeywordFromLi('keywordProdAttr')
        let keywordFit = getKeywordFromLi('keywordFit')
        let keywordExtra = getKeywordFromLi('keywordExtra')

        let totalNum = ketwordCore.num + keywordProdAttr.num +keywordFit.num + keywordExtra.num
        $('#producttpl_keywordsNumSpan').text(totalNum)
    }
    function checkKeyWordRepeat(type,keyword) {
        let keywordObj = getKeywordFromLi(type)
        let keywordArr = keywordObj.keyword.split(",")
        if (keywordArr && keywordArr.length) {
            for (let i =0; i < keywordArr.length; ++i) {
                if (keywordArr[i].trim() === keyword) {
                    return false
                }
            }
        }
        return true
    }

    function addKeywordLi(type,keyword) {
        if (keyword.trim()) {
            return false
        }

        keyword = changeUpCase(keyword.trim())
        // 判断是否有重复的
        if (!checkKeyWordRepeat(type,keyword)) {
            console.log('存在重复关键词:' + keyword )
            return false;
        }

        let textArea = $('.keywordContain[name='+ type +'] .keywordInp')
        textArea.value = textArea.value + '\n' + keyword

        return true;
    }

    //新增模板点击事件
    $('#producttplAdd').click(function() {
        prodTplCopyAdd=false;
        var index = layer.open({
            title: '新增模板',
            type: 1, //不加该属性,就会出现[object Object]
            btn: ['存草稿', '新建并发布', '新建', '关闭'],
            id: 'producttplAddSuccess',
            content: $('#producttplAddLayer').html(),
            area: ['1350px', '90%'],
            // shade: 0,
            success: function() {
                //监听模板类型选中
                producttpl_tplTypeFn();
                layuiOpenPop = true
                    //渲染tagsinput
                $('input[name="tag"]').tagsinput();
                //颜色事件
                var othColor = new ColorSearch('#otherColor');
                othColor.init();
                // 父SKU 可编辑
                $('#addProdTplForm [name=pSku]').removeAttr('readonly')
                    // 初始化必填项
                initNotNull()
                    // 初始化默认无属性模板
                goodsChange()
                    //初始颜色值
                colorRun();
                // 设定本地图片上传功能 -- 主图
                uploadLocalImg($('[data-id=mainImgContains]'))
                    // 设定网络图片上传功能 -- 主图
                uploadNetImg($('[data-id=mainImgContains]'))
                    // 设定本地图片上传功能 -- 辅图
                uploadLocalImg($('[data-id=assistImgContains]'))
                    // 设定网络图片上传功能 -- 辅图
                uploadNetImg($('[data-id=assistImgContains]'))

                //初始显示男装
                showSize('Man');
                // 尺寸类型选择切换
                sizeBtnClick();
                // 款式相关事件
                initStyleEvent();
                form.render('checkbox');
                form.render('select')
                $(".isCreateHidden").hide();

                // 初始化关键词编辑
                initKeywordEdit()
                layui.formSelects.data('tpl_select_joomSens', 'local', { arr: joomSensArray });

                //动态监听数量
                autoWatchKeyTag();

                // 新增父商品按钮事件
                $('#producttpl_addParentProdBtn').show()
                let reback = function (pSku) {
                    let formElem = $('#addProdTplForm')
                    let pSkuElem = formElem.find('[name=pSku]')
                    pSkuElem.val(pSku)
                    pSkuElem.blur()
                }
                $('#producttpl_addParentProdBtn').click(function () {
                    popToAddOrUpdProdPInfo(null,reback)
                })

                //显示亚马逊图
                $('.shopSonSkuAttr_prodSonInput').show()
                $('.shopSonSkuAttr_prodSonInput').css('top', '-20px')

                let mp4Name = ''
                // 视频本地上传
                initUploadVedio(upload,'.localUploadNetMp4Btn',imageUpDomain + 'file/uploadFile',templateVedioUploadPath)

                let producttpl_initData = JSON.parse(window.localStorage.getItem('producttpl_initData'))
                if(producttpl_initData && producttpl_initData.length != 0){
                    let Confirmindex = layer.confirm('存在草稿，是否恢复草稿数据', { btn: ['使用草稿','清除草稿记录','仅关闭'] }, function() {
                        initTplData('draft','',producttpl_initData)
                        // 修改模板父SKU的时候，会调接口
                        // $("#addProdTplForm").find('[name=pSku]').prop('originPsku', '')
                        layer.close(Confirmindex)
                    }, function() {
                        window.localStorage.removeItem('producttpl_initData')
                    })
                }
            },
            yes: function(index, layero) {
                // 存草稿
                let data = prodTpl_getSubmitInfo ('noCheck')
                // 获取子模板数据
                data.varients = getVariety_template(false)
                data.bizzOwner = $('#addProdTplForm').find('[name=bizzOwner]').val()
                data.responsor = $('#addProdTplForm').find('[name=responsor]').val()
                data.cateName = $('#addProdTplForm').find('[name=cateName]').val()
                data.newCateName = $('#addProdTplForm').find('[name=newCateName]').val()
                window.localStorage.setItem('producttpl_initData',JSON.stringify(data))
                layer.msg('存草稿成功')

            },
            btn2: function() {
                if (!checkNotNull('#addProdTplForm')) {
                    return false
                }
                if (pSkuValid) {
                    submit_template(1);
                }
                else {
                    layer.msg("模板父sku不合格,不能提交");
                }
                return false
            },
            btn3: function() {
                if (!checkNotNull('#addProdTplForm')) {
                    return false
                }
                if (pSkuValid) {
                    submit_template('');
                } else {
                    layer.msg("模板父sku不合格,不能提交");
                }
                return false
            },
            btn4: function() {
                selSizeArr = [];
            },
            end: function() {
                originPskuVal = ''
                newSizeData.length = 0;
                layuiOpenPop = false
            }
        })

    });

    //批量修改类目
    $('#prodTpl_batchEditCates').on('click', function () {
        changeOAALL('producttplCard');
    });
    //批量修改类目-具体操作
    function changeOAALL(_this) {
        var $inputs = $('#tplListTbody').find('input.prodtpl-cateId-cbox');
        var count = 0;
        var prodPIds = [];
        
        for (var i = 0; i < $inputs.length; i++){
            var item = $inputs[i];
            if ($(item).is(':checked')) {
                prodPIds.push($(item).val());
                count++;
            }
        };
        if (count == 0) {
            return layer.msg('请选择数据', { icon: 7 });
        }
        // console.log(prodPIds);
        layer.open({
            title: '选择分类',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['80%', '70%'],
            btn: ['保存', '关闭'],
            content: $('#producttpl_changeOACateAll').html(),
            success: function (layero) {
                layuiOpenPop = true
                //!新增类目属性基础
                $('#prodTpl_choose_changeOACateAll').click(function(){
                    cateLayerOpen('oa', 'layer_work_develop_pl', 'prodTpl_changeOACateAll', '#itemCat_input', 'prodTpl_chooseid_inp_changeOACateAll');
                })
                //!清空按钮
                $('#prodTpl_clearPlat').click(function(){
                    $('#prodTpl_changeOACateAll').text('')
                    $('#prodTpl_choose_inp_changeOACateAll').val('')
                    $('#prodTpl_chooseid_inp_changeOACateAll').val('')
                })

            },
            yes: function (index, layero) {
                var cateOaId = $('#prodTpl_chooseid_inp_changeOACateAll').val();
                commonReturnPromise({
                    url: '/lms/prodTpl/batchSaveOrUpdateCateOaRelation',
                    type: 'post',
                    contentType: 'application/json',
                    params: JSON.stringify({
                        prodPIds: prodPIds,
                        cateOaId: cateOaId
                    })
                }).then(res => {
                    layer.msg('修改成功', { icon: 1 });
                    layer.close(index);
                    $('#tpl_searchBtn').trigger('click');
                }).catch(err => {
                    layer.msg(err, { icon: 2 });
                })
            },
            end: function() {
                layuiOpenPop = false
            }
        });
    }
    //批量修改类目属性
    $('#prodTpl_batchEditCatesAttr').on('click', function () {
        var $inputs = $('#tplListTbody').find('input.prodtpl-cateId-cbox');
        var count = 0;
        var cateOaIdArr = [];
        var prodPIdsArr = [];
        for (var i = 0; i < $inputs.length; i++){
            var item = $inputs[i];
            if ($(item).is(':checked')) {
                cateOaIdArr.push($(item).attr('data-cateOaId'));
                prodPIdsArr.push($(item).val());
                count++;
            }
        };
        if (count == 0) {
            return layer.msg('请选择数据', { icon: 7 });
        }
        var elementsAreEqual = cateOaIdArr.every(function (item) {
            return item == cateOaIdArr[0];
        });
        if (!elementsAreEqual) {
            return layer.msg('选中的数据类目ID不一致,请重新选择', { icon: 7 });
        }
        var cateOaId = cateOaIdArr[0];
        if (!cateOaId || !cateOaId.length) {
            return layer.msg('此数据类目没有添加OA属性')
        }
        //请求接口获取到数据
        commonReturnPromise({
            url: `/lms/prodCateOa/listAttrsAndValues/${cateOaId}`
        }).then(res => {
            layer.open({
                type: 1,
                title: '修改部分属性',
                area: ['600px', '600px'],
                btn: ['保存', '关闭'],
                content: $('#prodTpl_batchEditCatesAttr_layer').html(),
                id: 'prodTpl_batchEditCatesAttr_layerId',
                success: function (layero, index) {
                    var getTpl = $('#prodTpl_batchEditCatesAttrContainerTpl').html(),
                        view = document.getElementById('prodTpl_batchEditCatesAttrContainer');
                    var data = res.prodCateOaAttrListValuesVOList || [];
                    laytpl(getTpl).render(data, function (html) {
                        view.innerHTML = html;
                        form.render();
                        //全选和非全选的逻辑
                        commonSelectAllAndInvert({
                            container: layero,
                            parentClass: 'prodTpl-batchEditCatesAttr-all-cbox',
                            sonClass: 'prodTpl-batchEditCatesAttr-cbox'
                        });
                    });
                },
                yes: function (index, layero) {
                    var prodPInfoCateOaAttrList = [];
                    //循环表单选项
                    var childCboxDom = $('.prodTpl-batchEditCatesAttr-cbox');
                    for (var i = 0; i < childCboxDom.length; i++){
                        var item = childCboxDom[i];
                        if ($(item).is(':checked')) {
                            var itemParent = $(item).parents('.layui-form-item');
                            var cateOaAttr = $(itemParent).find('input[name=cateOaAttr]').val();
                            var cateOaAttrId = $(itemParent).find('input[name=cateOaAttrId]').val();
                            var cateOaAttrValue = $(itemParent).find('select').val();
                            var obj = {
                                cateOaAttrId: cateOaAttrId,
                                cateOaAttr: cateOaAttr,
                                cateOaAttrValue: cateOaAttrValue
                            };
                            prodPInfoCateOaAttrList.push(obj);
                        }
                    };
                    console.log(prodPInfoCateOaAttrList);
                    //发送请求
                    commonReturnPromise({
                        url: '/lms/prodTpl/batchSaveOrUpdateCateOaAttrRelation',
                        type: 'post',
                        contentType: 'application/json',
                        params: JSON.stringify({
                            prodPIds: prodPIdsArr,
                            prodPInfoCateOaAttrList: prodPInfoCateOaAttrList
                        })
                    }).then(yesRes => {
                        layer.msg('修改属性成功', { icon: 1 });
                        layer.close(index);
                        $('#tpl_searchBtn').trigger('click');
                    }).catch(yesErr => {
                        layer.msg(yesErr, { icon: 2 });
                    });
                }
            })
        }).catch(err => {
            layer.msg(err, { icon: 2 });
        });
    });

    // 导出
    $('#exportTemplateBtn_producttpl').click(function() {
        var outerIndex = layer.open({
            title: '导出模板',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1450px', '650px'],
            btn: ['确定', '关闭'],
            content: $('#exportTemplatePop_producttpl').html(),
            success: function() {
                form.on('checkbox(selectAll_exportTemplatePop_producttpl)', function(data) {
                    var checked = data.elem.checked
                    $('#exportTemplateForm_producttpl input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                let searchParam = prodtpl_getsearchParam()
                if (!searchParam) {
                    return
                }
                let $inputs = $('#tplListTbody').find('input.prodtpl-cateId-cbox');
                let prodPIdsArr = [];
                for (let i = 0; i < $inputs.length; i++){
                    let item = $inputs[i];
                    if ($(item).is(':checked')) {
                        prodPIdsArr.push($(item).val());
                    }
                }
                let title = ''
                debugger
                if (prodPIdsArr.length > 0) {
                    searchParam.pIdList = prodPIdsArr
                    title = '确认导出所选的' + prodPIdsArr.length + '条模板信息？'
                } else {
                    title = '确认导出当前搜索条件下的模板信息？'
                }

                let data = serializeObject($('#exportTemplateForm_producttpl'))
                data.searchParam = JSON.stringify(searchParam)
                let Confirmindex = layer.confirm(title, { btn: ['确认', '取消'] }, function() {
                    submitForm(data, ctx + '/prodTpl/exportTemplate.html')
                    layer.close(Confirmindex);
                    layer.close(outerIndex);
                })
            }
        })
    })

    // 新增变种点击事件
    $('body').on('click', '.addVariantBtn', function() {
        var index = layer.open({
            type: 1,
            title: '新增变种',
            id: 'addVariantId',
            btn: ['确定', '关闭'],
            area: ['70%', '600px'],
            content: $('#addVariantLayer').html(),
            success: function() {
                variantColorSpace.colorRender();
                variantColorSpace.colorAdd().init();
                variantSizeSpace.size();
                //颜色的添加事件
                var addVariantColor = new ColorSearch('.variantColorVal');
                addVariantColor.init();
                // 款式事件初始化
                variantStyleSpaceInit()
            },
            yes: function() {
                addTrSpace();
                layer.close(index);
            }
        })
    });

    // 新增变种确认
    function addTrSpace() {
        var colorArr = [],
            sizeArr = [],
            styleArr = [];

        function variantArr(className, arrName) {
            var inputs = $('.' + className).find('input[type=checkbox]:checked');
            $.each(inputs, function(i, v) {
                var val = $(v).val();
                arrName.push(val);
            })
        };
        variantArr('variantColorSel', colorArr); //获取到颜色选中项
        variantArr('variantSizeAdd', sizeArr); //获取到尺寸选中项
        variantArr('variantStyleBody', styleArr); //获取到款式选中项
        if (colorArr.length == 0) {
            colorArr.push('')
        }
        if (sizeArr.length == 0) {
            sizeArr.push('')
        }
        if (styleArr.length == 0) {
            styleArr.push('')
        }
        // 获取原有变体列表
        let oldVaraints = {}
        let oldVaraintsTrs = $('#goodsList tr[data-id]') // 参数行
        let oldVaraintsImgTrs = $('#goodsList tr[data-imgId]') // 图片行
        if (oldVaraintsTrs && oldVaraintsTrs.length > 0) {
            for (let i = 0; i < oldVaraintsTrs.length; ++i) {
                let oldVaraintId = oldVaraintsTrs[i].getAttribute('data-id')
                let curTR = $(oldVaraintsTrs[i]) // 当前行的dom对象
                oldVaraints[oldVaraintId] = {
                    id: curTR.find('[name=id]').val(),
                    sSku: curTR.find('[name=sSku]').val(),
                    sort: curTR.find('[name=sort]').val(),
                    ifOld: curTR.find('[name=sSku]').attr('ifOld'),
                    color: curTR.find('[name=color]').val(),
                    size: curTR.find('[name=size]').val(),
                    style: curTR.find('[name=style]').val().trim(),
                    weight: curTR.find('[name=weight]').val(),
                    priced: curTR.find('[name=priced]').val(),
                    warningcost: curTR.find('[name=warningcost]').val(),
                    isSale: curTR.find('[name=isSale]').prop('checked'),
                    isOutOfStock: !(curTR.find('[name=isOutOfStock]').prop('checked')),
                    selfPhotoStatus: curTR.find('[name=selfPhotoStatus]').prop('checked') ? 4 : 0,
                    amazonImg: curTR.find('[name=amazonImg]').val(),
                    hasSelfPhotoNeed: curTR.find('[name=hasSelfPhotoNeed]').prop('checked'),
                    ifSpread: curTR.find('[name=ifSpread]').prop('checked')
                }
                    // 模板图片
                oldVaraints[oldVaraintId].imgList = []
                let curImgTR = $(oldVaraintsImgTrs[i])
                var imgLis = curImgTR.find('.uploadImgUL li')
                if (imgLis && imgLis.length > 0) {
                    for (let q = 0; q < imgLis.length; ++q) {
                        let isMust = $(imgLis[q]).find('[d-name=isWhite]').prop('checked')
                        let isNotSupplier = $(imgLis[q]).find('[d-name=isNotSupplier]').prop('checked')
                        let img = {
                            url: $(imgLis[q]).find('[name=varImg]').val(),
                            isMust: isMust ? 1 : 0,
                            isNotSupplier: isNotSupplier ? 1 : 0
                        }
                        oldVaraints[oldVaraintId].imgList.push(img)
                    }
                }
            }
        }

        // 记录重复的 尺寸和颜色和尺寸变体
        var multiSizeAndColorStr = ''
            // 生成新变种数据
        var i, j, k, newOne, variantId
        for (i = 0; i < colorArr.length; ++i) {
            for (j = 0; j < sizeArr.length; ++j) {
                for (k = 0; k < styleArr.length; ++k) {
                    newOne = {} // 初始化变体
                    variantId = escapeJquery(colorArr[i] + '-' + sizeArr[j] + "-" + styleArr[k]).replace(/[&\|\\\*^%$#@\s\/]/g, "") // 生成变体ID
                    newOne.color = colorArr[i]
                    newOne.size = sizeArr[j]
                    newOne.style = styleArr[k]
                        // 检查新组成的变体 是否已经在原有变体组合中
                    if (!oldVaraints[variantId]) {
                        oldVaraints[variantId] = newOne
                    } else {
                        multiSizeAndColorStr += sizeArr[j] + '-' + colorArr[i] + '-' + styleArr[k] + ';'
                    }
                }
            }
        }
        // 渲染变种
        setVaraint(oldVaraints, 2)
        if (multiSizeAndColorStr) {
            multiSizeAndColorStr = '存在颜色和尺寸重复的变体(尺寸-颜色):' + multiSizeAndColorStr + '。已经自动剔除'
            layer.alert(multiSizeAndColorStr)
        }
    }
    // @param isCopyAdd 是否复制新增
    function showKeyWord(obj,isCopyAdd) {
        // 如果有新版关键词参数，则展示新版关键词编辑页面。否则展示旧版的
        // 如果是新增 则展示新版关键词
        if (obj && obj.assistInfo && obj.assistInfo.keywordCore) {
            $('#prodTpl_ifNewKeyword').val('true')
            $('.newKeyWordElem').show()
            $('.oldKeyWordElem').hide()
            // 渲染新版关键词
            for (let i = 0; i < prodTpl_keywordtype.length; ++i) {
                let keywordType = prodTpl_keywordtype[i]
                let keywordArr = obj.assistInfo[keywordType].split('|')

                let textArea = $('.keywordContain[name='+ keywordType +'] .keywordInp')
                textArea.val(keywordArr.join('\n'))
            }
            countKeyWordNum()
        } else {
            if(isCopyAdd){
                $('#prodTpl_ifNewKeyword').val('true')
                $('.oldKeyWordElem').hide()
                $('.newKeyWordElem').show()
            } else {
                $('#prodTpl_ifNewKeyword').val('false')
                $('.oldKeyWordElem').show()
                $('.newKeyWordElem').hide()
            }
        }
    }

    /**
     *
     * @param templateType 展示数据作用： copy 复制新增。 show复现旧数据   draft 恢复草稿
     * @param isCopyAdd
     * @param obj
     */
    function initTplData(templateType,isCopyAdd,obj){
        $("span[name=brand]").text(obj.amazonTortString);//ztt-新增
        //#endregion 判断是否回显模板类型end
        let formEle = $("#addProdTplForm")
        $.each(obj, function(key) {
            formEle.find('[name="' + key + '"]').val(obj[key]);
        })
        formEle.find('[name=pSku]').attr("value", obj.pSku)
        formEle.find("[name='originTitle_new']").val(obj.originTitle)

        commonAddEventTitleToggle($('#producttpl_tplDetail'), 'prodTpl')
        if (obj.prodPInfoCateOaDTO) {
            formEle.find('[name=newCateName]').val(obj.prodPInfoCateOaDTO.cateTreeName || '')
        }

        formEle.find("input[name='bizzOwner']").attr("disabled", "disabled");
        formEle.find("input[name='responsor']").attr("disabled", "disabled");
        //移除name=id的初始值
        if(templateType === 'copy'){
            formEle.find('[name="id"]').val('');
            formEle.find('[name="pSku"]').val('');
            formEle.find('[name="bizzOwner"]').val('');
            formEle.find('[name="responsor"]').val('');
            formEle.find('[name="devPSku"]').val('');
        } else if (templateType === 'show'){
            // 保存原始 父sku  及其ID
            formEle.find('[name=pSku]').prop('originPsku', obj.pSku)
            formEle.find('[name=pSku]').prop('originId', obj.id)
            formEle.find('[name=devPSku]').prop('originPsku', obj.devPSku)
            formEle.find('[name=devPSku]').prop('originId', obj.devPId)
        }
        // 渲染关键词
        showKeyWord(obj,isCopyAdd)

        //渲染tagsinput
        formEle.find('input[name="tag"]').tagsinput();
        // 保存其审核状态  需在渲染变体前进行
        $('#auditStatus_addProdTplForm').val(obj.auditStatus)
        formEle.find('[name=isSupplierOrigiImg]').prop('checked', obj.isSupplierOrigiImg)


        let assistInfo = obj.assistInfo || {}
        // 新版特殊数量
        formEle.find('[name="specNumNew"]').val(assistInfo.specNumNew);
        formEle.find('[name="fitModel"]').val(assistInfo.fitModel);

        // 判断是否展示新版 关键词

        // 自拍图状态
        let selfImgSelectEle = formEle.find('[name=selfImgStatus]')
        switch (obj.selfImgStatus) {
            case 0:
                selfImgSelectEle.val('无自拍图');
                break;
            case 1:
                selfImgSelectEle.val('有自拍图');
                break;
            case 2:
                selfImgSelectEle.val('部分有自拍图');
                break;
        }


        formEle.find('[name=appObject]').val('');
        formEle.find('[name=specNum]').val('');
        dealMultiInput(obj.appObject, 'appObject');
        dealMultiInput(obj.specNum, 'specNum');

        //回显joom敏感货
        if (obj.joomSensProd != undefined) {
            let joomSensProps = obj.joomSensProd.split(',');
            layui.formSelects.value('tpl_select_joomSens', joomSensProps);
        }
        // 复现主图-辅图
        let mainImgArr = []
        if(obj.mainImages&&obj.mainImages.length != 0){
            let mainImg
            let originMainImg
            for (let i = 0; i < obj.mainImages.length; ++i) {
                originMainImg = obj.mainImages[i]
                mainImg = {}
                mainImg.url = originMainImg.name.includes("http")?originMainImg.name:tplIVP + originMainImg.name
                mainImg.isMust = originMainImg.isWhite ? 1 : 0
                // mainImg.isClear = originMainImg.isClear ? 1 : 0
                mainImg.isNotSupplier = originMainImg.isNotSupplier ? 1 : 0
                mainImg.isSelfImg = originMainImg.isSelfImg ? 1 : 0
                mainImg.isSexy = originMainImg.label == 'sexy' || originMainImg.label == 'porn' ? 1 : 0
                mainImgArr.push(mainImg)
            }
        }
        let assistImgArr = []
        if(obj.assistImgs&&obj.assistImgs.length != 0){
            for (let i = 0; i < obj.assistImgs.length; ++i) {
                let originAssistImg = obj.assistImgs[i]
                let assistImg = {}
                assistImg.url = originAssistImg.name.includes("http")?originAssistImg.name:tplIVP + originAssistImg.name
                assistImg.isMust = originAssistImg.isMust ? 1 : 0
                // assistImg.isClear = originAssistImg.isClear ? 1 : 0
                assistImg.ifSize = originAssistImg.ifSize ? 1 : 0
                assistImg.isNotSupplier = originAssistImg.isNotSupplier ? 1 : 0
                assistImg.isWhite = originAssistImg.isWhite ? 1 : 0
                assistImg.isSelfImg = originAssistImg.isSelfImg ? 1 : 0
                assistImg.isSexy = originAssistImg.label == 'sexy' || originAssistImg.label == 'porn' ? 1 : 0
                assistImgArr.push(assistImg)
            }
        }
        let otherImgArr = []
        if(obj.otherImgs&&obj.otherImgs.length != 0) {
            for (let i = 0; i < obj.otherImgs.length; ++i) {
                let originOtherImg = obj.otherImgs[i]
                let otherImg = {}
                otherImg.url = originOtherImg.name.includes("http")?originOtherImg.name:tplIVP + originOtherImg.name
                otherImg.isMust = originOtherImg.isMust ? 1 : 0
                otherImg.isClear = originOtherImg.isClear ? 1 : 0
                otherImg.isNotSupplier = originOtherImg.isNotSupplier ? 1 : 0
                otherImg.isWhite = originOtherImg.isWhite ? 1 : 0
                otherImg.isSelfImg = originOtherImg.isSelfImg ? 1 : 0
                otherImg.isSexy = originOtherImg.label == 'sexy' || originOtherImg.label == 'porn' ? 1 : 0
                otherImgArr.push(otherImg)
            }
        }
        varaintImgInit($('[data-id=mainImgContains]'), mainImgArr)
        varaintImgInit($('[data-id=assistImgContains]'), assistImgArr)
        varaintImgInit($('[data-id=otherImgContains]'), otherImgArr)
        if (otherImgArr.length <= 6) {
            $('#producttpl_showMoreOtherImg').hide()
        }
        // 处理变体数据
        let varaints = {}
        let varaint
        let variantId
        let originOne
        if(obj.varients && obj.varients.length != 0) {
            for (let i = 0; i < obj.varients.length; ++i) {
                varaint = {}
                originOne = obj.varients[i]
                variantId = 'variantId_' + escapeJquery(originOne.color + '-' + originOne.size + '-' + originOne.style).replace(/[&\|\\\*^%$#@\s\/]/g, "")
                if (templateType !== 'copy') {
                    varaint.id = originOne.id
                    varaint.prodSId = originOne.prodSId
                    varaint.sSku = originOne.sSku
                }
                varaint.color = originOne.color
                varaint.size = originOne.size
                varaint.style = originOne.style
                varaint.weight = originOne.weight
                varaint.priced = originOne.cost
                varaint.warningcost = originOne.listingWarnPrice
                varaint.isSale = originOne.isSale
                varaint.isOutOfStock = originOne.isOutOfStock
                varaint.selfPhotoStatus = originOne.selfPhotoStatus
                varaint.amazonImg = originOne.amazonImg
                varaint.hasSelfPhotoNeed = originOne.hasSelfPhotoNeed
                varaint.ifSpread = originOne.ifSpread
                varaint.ifOld = 'true'
                varaint.imgList = []
                if (originOne.varientImgs) {
                    for (let j = 0; j < originOne.varientImgs.length; ++j) {
                        varaint.imgList.push({
                            url: originOne.varientImgs[j].name.includes("http")?originOne.varientImgs[j].name:tplIVP + originOne.varientImgs[j].name,
                            isMust: originOne.varientImgs[j].isWhite,
                            isSexy: originOne.varientImgs[j].label == 'sexy' || originOne.varientImgs[j].label == 'porn' ? 1 : 0,
                            isNotSupplier: originOne.varientImgs[j].isNotSupplier,
                        })
                    }
                }
                varaints[variantId] = varaint
            }
        }
        // 视频回显
        if(assistInfo.vedioUrl && assistInfo.vedioUrl != ''){
            $('.mp4Contain').html(`<video width="200" height="200" controls style>
                        <source name="mp4Url" src="${assistInfo.vedioUrl}"  type="video/mp4">
                        您的浏览器不支持 HTML5 video 标签。
                    </video>`)
        }
        //复现变体数据
        setVaraint(varaints, 2,'id')

        if (assistInfo.supplierVedio) {
            $('#producttpl_supplierVedioA').removeClass('layui-btn-disabled')
            $('#producttpl_supplierVedioA').attr('href',assistInfo.supplierVedio)
        } else {
            $('#producttpl_supplierVedioA').addClass('layui-btn-disabled')
        }

        // getPskuInfo(returnData.data.pSku, 'product')

        if (obj.auditStatus == 3) {
            // 如果审核通过，隐藏变体增删按钮
            /*复制新增的不论状态允许移除*/
            if(!prodTplCopyAdd){
                $('.toHiddenWhenAllowed').hide();
            }
            // 判断有无修改sku 权限
            if ($('#ifUpdateSku_prodtemp').length > 0 || (isCopyAdd != null && isCopyAdd)) {
                formEle.find('[name=pSku]').removeAttr('readonly')
            } else {
                // 移除父sku 绑定事件
                formEle.find('[name=pSku]').removeAttr('onblur')
            }
        } else {
            formEle.find('[name=pSku]').removeAttr('readonly')
        }

        
    }

	//获取模板详情
/**
 *
 * @param id
 * @param templateType
 * @param isCopyAdd 是否复制新增
 */
function prodTpl_getTplDetail(id, templateType,isCopyAdd) {
    if (typeof(id) == undefined) {
        return;
    }
    loading.show()
    $.ajax({
        type: "post",
        url: ctx + "/prodTpl/getTplDetail.html",
        data: { "id": id },
        //async: false,
        dataType: "json",
        success: function(returnData) {
            loading.hide()
            if (returnData.code !== "0000") {
                layer.msg(returnData.msg, { icon: 5 });
            } else {        
				let obj = returnData.data;
                initTplData(templateType,isCopyAdd,obj)
            }
            // 增加wish主图需求
            var wishImgDiv = $(`<div style="float: right">
                                    <input id="wishImgStatus_prodTpl" type="checkbox" title="wish主图" disabled lay-skin="primary" ` + (obj.wishImgStatus ? `checked` : ``) + `/>
                                    <div class="layui-btn layui-btn-primary layui-btn-sm" id="needWishImgBtn">需wish改图</div>
                                    <input style="width: 150px;float: right; margin-left: 10px" class="layui-input" id="wishImgNeedRemark_prodtpl" placeholder="wish需求备注">
                                </div>`)
            $('.auditForm_prodtpl').append(wishImgDiv)
            bindToWishImgBtn(obj.id)

            //获取初始的长度,赋值给详情
            $('#keywordNum').text($('#keyword').val().split('\n').length);
            $('#prodWishTagsNum').text($('input[name="tag"]').val().split(',').lenselfImgIcongth);
            layui.form.render('select')
            layui.form.render('checkbox')
        },
        error: function() {
            loading.hide()
            layer.msg("发送请求失败");
        }
    })
}
}); //layui结束
// 主图模型结构
var imgData_template = {
    img: {
        head: '',
        tpl: '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle dragsort-handle">' +
            '<div class="ImgDivOut">' +
                '<label">' +
                    '<input type="hidden" name="mainImg" value="&{url}"/><input type="checkbox" name="checkbox1" lay-skin="primary" title="白底图"/>' +
                    '<input type="checkbox" name="checkbox3" lay-skin="primary" title="非供图"/>' +
                '</label>' +
                '<div class="ImgDivIn">' +
                        '<img draggable="false" src="&{url}!size=150x150" alt="" crossOrigin="anonymous" class="fl imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl" title="双击即可复制路径"/>' +
                        '<div class="fl selfImgIcon">自拍图</div>' +
                '</div>' +
                '<div class="imgDivDown h20">' +
                    '<a class="fl" onclick="copyUrl(this);" href="javascript:void(0);">复制</a>' +
                    '<a class="fl" onclick="btnToDownloadImg(this)"  href="javascript:void(0);">下载</a>' +
                    '<a class="fl" onclick="btnTomeituImg(this, `mainImg`)"  href="javascript:void(0);">美图</a>' +
                    '<a class="fr" onclick="delImg(this);" href="javascript:void(0);">移除</a>' +
                '</div>' +
            '</div><div class="showSexy">性感图片</div>' +
        '</li>',
        foot: '',
    }
};
//辅图模型结构
var imgData2_template = {
    img: {
        head: '',
        tpl: '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle dragsort-handle">' +
            '<div class="ImgDivOut">' +
                '<label">' +
                    '<input type="hidden" name="assisImg" value="&{url}"/>' +
                    '<input type="checkbox" name="checkbox1" lay-skin="primary" class="mustCheck" title="必选图"/>' +
                    '<input type="checkbox" name="checkbox3" lay-skin="primary" title="非供图"/>' +
                    '<input type="checkbox" name="checkbox4" lay-skin="primary" title="白底图"/>' +
                    '<input type="checkbox" name="checkbox7" lay-skin="primary" lay-filter="sizeCheck" title="尺寸图"/>' +
                '</label>' +
                '<div class="ImgDivIn">' +
                    '<img draggable="false" src="&{url}!size=150x150" alt="" crossOrigin="anonymous" class="fl imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"  title="双击即可复制路径"/>' +
                    '<div class="fl selfImgIcon">自拍图</div>' +
            '</div>' +
                '<div class="imgDivDown h20">' +
                    '<a class="fl" onclick="copyUrl(this);" href="javascript:void(0);">复制</a>' +
                    '<a class="fl" onclick="btnToDownloadImg(this)"  href="javascript:void(0);">下载</a>' +
                    '<a class="fl" onclick="btnTomeituImg(this, `assisImg`)"  href="javascript:void(0);">美图</a>' +
                    '<a class="fr" onclick="delImg(this);" href="javascript:void(0);">移除</a>' +
                '</div>' +
            '</div><div class="showSexy">性感图片</div>' +
        '</li>',
        foot: '',
    }
};

//其他模型结构
var otherImg_template = {
    img: {
        head: '',
        tpl: '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle dragsort-handle">' +
        '<div class="ImgDivOut">' +
        '<label">' +
        '<input type="hidden" name="otherImg" value="&{url}"/>' +
        '</label>' +
        '<div class="ImgDivIn">' +
        '<img draggable="false" src="&{url}!size=150x150" alt="" crossOrigin="anonymous" class="fl imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"  title="双击即可复制路径"/>' +
        '</div>' +
        '<div class="imgDivDown h20">' +
        '<a class="fl" onclick="copyUrl(this);" href="javascript:void(0);">复制</a>' +
        '<a class="fl" onclick="btnToDownloadImg(this)"  href="javascript:void(0);">下载</a>' +
        '<a class="fl" onclick="btnTomeituImg(this)"  href="javascript:void(0);">美图</a>' +
        '<a class="fr" onclick="delImg(this);" href="javascript:void(0);">移除</a>' +
        '</div>' +
        '</div><div class="showSexy">性感图片</div>' +
        '</li>',
        foot: '',
    }
};

//wish子sku模型结构
var imgDataWish_template = {
    img: {
        head: '',
        tpl: '<li draggable="true" class="imgBox_prodTpl ui-sortable-handle dragsort-handle">' +
            '<div class="ImgDivOut">' +
                '<label">' +
                    '<input type="hidden" name="varImg" value="&{url}">' +
                    '<input type="checkbox" name="checkbox1" d-name="isWhite" lay-skin="primary" class="amazonChekcbox_prod" title="白底图">' +
                    '<input type="checkbox" name="checkbox3" d-name="isNotSupplier" lay-skin="primary" class="notSupplierCheckbox_prod" title="非供图">' +
                '</label>' +
                '<div class="ImgDivIn">' +
                    '<img draggable="false" src="&{url}!size=150x150" alt="" class="imgCss img_show_hide detailImg_prodtpl dbclickCopyUrl"  title="双击即可复制路径"/>' +
                '</div>' +
                '<div class="imgDivDown h20">' +
                    '<a class="fl" onclick="copyUrl(this);" href="javascript:void(0);">复制</a>' +
                    '<a class="fl" onclick="btnToDownloadImg(this)"  href="javascript:void(0);">下载</a>' +
                    '<a class="fl" onclick="btnTomeituImg(this,`varImg`)"  href="javascript:void(0);">美图</a>' +
                    '<a class="fr" onclick="delImg(this);" href="javascript:void(0);">移除</a>' +
                            '</div>' +
            '</div><div class="showSexy">性感图片</div>' +
        '</li>',
        foot: '',
    }
};
function downLoadForZipPackage(self){
    // 获取当前弹窗
    let curLayerPage = $(self).closest('.layui-layer-page')
    let allImgArr = []
    // 获取主图
    let mainImgContains = curLayerPage.find('[data-id=mainImgContains]')
    let mainImgElems = mainImgContains.find('img[src^=http]')
    for (let i = 0; i < mainImgElems.length; ++i) {
        let src = mainImgElems[i].getAttribute('src')
        src = src.indexOf('!size') > 0 ? src.substring(0,src.indexOf('!size')) : src
        allImgArr.push({
            url: src,
            fileName: '主' + (i + 1)
        })
    }
    // 获取辅图
    let assistImgContains = curLayerPage.find('[data-id=assistImgContains]')
    let assistImgElems = assistImgContains.find('img[src^=http]')
    for (let i = 0; i < assistImgElems.length; ++i) {
        let src = assistImgElems[i].getAttribute('src')
        src = src.indexOf('!size') > 0 ? src.substring(0,src.indexOf('!size')) : src
        allImgArr.push({
            url: src,
            fileName: '辅' + (i + 1)
        })
    }
    // 获取变种图
    let varietyContains = curLayerPage.find('#goodsList')
    let subSkuTrs = varietyContains.find('tr[data-id]')
    for (let i = 0; i < subSkuTrs.length; ++i) {
        // 获取其变种图tr
        let imgTr = $(subSkuTrs[i]).next('tr.imgContains')
        let vatiretyImg = imgTr.find('img[src^=http]')
        if (vatiretyImg.length === 0) {
            continue
        }
        let subSku = $(subSkuTrs[i]).find('[name=sSku]').val()
        let multiImg = vatiretyImg.length > 1
        for (let j = 0; j < vatiretyImg.length; ++j) {
            let src = vatiretyImg[j].getAttribute('src')
            src = src.indexOf('!size') > 0 ? src.substring(0,src.indexOf('!size')) : src
            allImgArr.push({
                url: src,
                fileName: subSku + (multiImg ? ("(" + (j + 1) + ")") : "")
            })
        }
    }
    // 获取父sku
    let pSku = curLayerPage.find('[name=pSku]').val()
    packageImages(allImgArr,pSku)
}



// 2022-0304 改用下载为zip文件
function downLoadAllImg(self){
    var imgEleList = $(self).closest('.imgContains').find('.uploadImgUL img')
    var pop = $(self).closest('#producttpl_tplDetail')
    var fileName = pop.find('[name=pSku]').val()
    for (var i = 0 ; i < imgEleList.length; ++i) {
        downLoadImg(imgEleList[i], fileName)
    }
}

// 复制的所有的url，换行拼接
function copyAllUrl(self){
    var imgEleList = $(self).closest('.imgContains').find('.uploadImgUL img')
    const allUrl=[]
    imgEleList.each(function(){
        let _url = $(this).attr('src')
        if (_url.indexOf('!size=') > 0) {
            _url = _url.substring(0, _url.indexOf('!size='))
        }
        if (_url) {
            allUrl.push(_url)
        }
    })
    if(allUrl.length){
        copyTxtToClipboard(allUrl.join('\r\n'),'textarea')
    }else{
        layui.layer.msg('暂无图片')
    }
}

function btnToDownloadImg(btn) {
    var li = $(btn).closest('li')
    var img = li.find('img')[0]
    var pop = $(btn).closest('#producttpl_tplDetail')
    var fileName = pop.find('[name=pSku]').val()
    downLoadImg(img,fileName)
}

function copyUrl(btn) {
    var li = $(btn).closest('li')
    var img = li.find('img')[0]
    copyUrlOfImg(img)
}

// 本地图片上传
// imgContains  图片容器 jQuery对象
function uploadLocalImg(imgContains) {
    var btn = imgContains.find('.uploadLocalImgBtn') // 触发异步上传的按钮
    var maxImg = parseInt(imgContains.attr('data-maxImg')) // 最大图片数
    var minImg = parseInt(imgContains.attr('data-minImg')) // 最小图片数
    var imgObjType = imgContains.attr('data-imgObjType') // 图片展示的dom数据类型

    btn.Huploadify({
        auto: true,
        fileTypeExts: '*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;',
        multi: true,
        fileSizeLimit: 5000, //默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        quality: 0.8,
        validWidthAndHeight: {width: 1000,height: 1000,maxWidthAndHeight:2000,minWidthAndHeight:500},
        type: 2,
        uploader: (imageUpDomain.indexOf('uploadPic') >= 0 ? (ctx + imageUpDomain) : (imageUpDomain + '/image/uploadImage')),
        onSelect: function(files) {
            var imgTotalNum = imgContains.find('.uploadImgUL li').length
            var n = files.length + imgTotalNum;
            if (n > maxImg) {
                layer.msg("最大支持" + maxImg + "张图片，您还能选择" + (maxImg - imgTotalNum) + "张!");
                return false;
            } else {
                return true;
            }
        },
        onUploadStart: function(file) {
        },
        onUploadSuccess: function(file, data, response) {
            data = $.parseJSON(data);
            if (data != null && data.code == '0000') {
                proTpl_showImg(tplIVP + data.data, imgContains, false, false,false)
                layui.form.render('checkbox')
                commonSelectAllAndInvert({
                    container: $('#shopSonSkuAttr_prod'),
                    parentClass: 'selectAllCheckboxes_pdc',
                    sonClass: 'amazonChekcbox_prod'
                });
                commonSelectAllAndInvert({
                    container: $('#shopSonSkuAttr_prod'),
                    parentClass: 'selectAllCheckboxes_notSupplier',
                    sonClass: 'notSupplierCheckbox_prod'
                });
            } else {
                layer.msg(data.msg); //这里面的内容不知道写啥,同OA系统
            }
        }
    });
}

// 网络图片下载
// imgContains  图片容器jQuery对象
function uploadNetImg(imgContains) {
    // 移动`
    // imgContains.find('.uploadImgUL').sortable({
    //     containment: "parent",
    //     scroll: true,
    //     delay: 50,
    //     start: function () {
    //         prohibitShowBigImg = true
    //         $('.showBigImg').remove();
    //     },
    //     stop: function () {
    //         prohibitShowBigImg = false
    //     }
    // });
    var netUpBtn = imgContains.find('.uploadNetImgBtn') // 网络图片开启按钮
    var maxImg = imgContains.attr('data-maxImg') // 最大图片数
    var minImg = imgContains.attr('data-minImg') // 最小图片数
    var imgObjType = imgContains.attr('data-imgObjType') // 图片展示的dom数据类型
    netUpBtn.click(function() {
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
            yes: function() {
                var url = $.trim($("#netImgUrl").val());
                if (url == null || url == "") {
                    layer.msg("图片地址不能为空！", { icon: 5 });
                    return false;
                }
                var urlArray = url.split("\n");
                // 去一下空格
                for (var i in urlArray) {
                    urlArray[i] = $.trim(urlArray[i]);
                }
                var remainNum = maxImg - currentImgs.length;
                if (urlArray.length + currentImgs.length > maxImg) {
                    remainNum = remainNum < 0 ? 0 : remainNum;
                    layer.msg("最大支持" + maxImg + "张图片,您还能上传" + remainNum + "张!");
                }
                remainNum = urlArray.length > remainNum ? remainNum : urlArray.length;
                let minWidthAndHeight = 500,maxWidthAndHeight = 2000;
                for (let i = 0; i < remainNum; i++) {
                    tpl_calculateImageSize(urlArray[i]).then(function({width, height}) {
                        if (width < minWidthAndHeight || width > maxWidthAndHeight || height < minWidthAndHeight || height > maxWidthAndHeight) {
                            layui.layer.msg(urlArray[i] + '尺寸不在500-2000之间,不允许上传')
                            return false
                        }else if(width >= minWidthAndHeight || width <= maxWidthAndHeight || height >= minWidthAndHeight || height <= maxWidthAndHeight){
                            // 调整1000*1000
                            getBase64And1000(urlArray[i])
                                .then(function(base64){

                                    // let file = blobToFile(dataUrl2Blob(base64,null), '1.jpg')
                                    let file = dataURLtoBlob(base64, '1.jpg')
                                    let formData = new FormData()
                                    formData.append("file",file)
                                    formData.append("lastModifiedDate",new Date().getTime())
                                    formData.append("type",2)
                                    formData.append("fileName",'1.jpg')
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
                                            if(data.code == "0000"){
                                                proTpl_showImg(tplIVP + data.data, imgContains, false, false,false);
                                                layui.form.render('checkbox')
                                                commonSelectAllAndInvert({
                                                    container: $('#shopSonSkuAttr_prod'),
                                                    parentClass: 'selectAllCheckboxes_pdc',
                                                    sonClass: 'amazonChekcbox_prod'
                                                });
                                                commonSelectAllAndInvert({
                                                    container: $('#shopSonSkuAttr_prod'),
                                                    parentClass: 'selectAllCheckboxes_notSupplier',
                                                    sonClass: 'notSupplierCheckbox_prod'
                                                });
                                            }else{
                                                layer.alert(data.msg,{icon:2})
                                            }
                                        },error:function(err){
                                            loading.hide();
                                            layer.alert(err.msg,{icon:2})
                                        }
                                    });
                                },function(err){
                                    console.log(err);//打印异常信息
                                });
                        }
                    });

                    // $.ajax({
                    //     type: "post",
                    //     url: ctx + "/prodTpl/getOnlinePic.html",
                    //     data: 'urlString=' + urlArray[i],
                    //     success: function(data) {
                    //         if (data) {
                    //             if (data.code == '0000') {
                    //                 proTpl_showImg(data.data, imgContains, false, false,false);
                    //                 layui.form.render('checkbox')
                    //             } else if (data.code == '9999') {
                    //                 layer.msg(data.msg, { icon: 5 });
                    //             }
                    //         } else {
                    //             layer.msg('图片上传失败!', { icon: 2 })
                    //         }
                    //     }
                    // });
                }
                // $("#netImgUrl").val("");
                layer.close(index);
            }
        })
    });
}

/**
 * 复现图片
 * @param imgObjType    图片模型类型   1、主图模型   2、辅图模型   3、子商品图片模型  4、其他自拍图
 * @param imgContains   图片容器dom对象
 * ifChecked  是否勾选  白底图/必选图
 */
function proTpl_showImg(url, imgContains, checked1, checked2, checked3,checked4, checked5, checked6, checked7, index) {
    var imgObjType = imgContains.attr('data-imgObjType')
    // 目的为采集图片&视频添加的图片数量校验
    if(imgContains.find('.uploadImgUL li').length*1 >= imgContains.attr("data-maxImg")*1){
        // layer.alert(`图片最多${imgContains.attr("data-maxImg")}张,当前${imgContains.find('.uploadImgUL li').length}张`,{icon:2})
        return false
    }
        // 将图片展示到容器中
    var tpl;
    switch (imgObjType) {
        case '1':
            tpl = imgData_template['img']['tpl']
            break
        case '2':
            tpl = imgData2_template['img']['tpl']
            break
        case '3':
            tpl = imgDataWish_template['img']['tpl']
            break
        case '4':
            tpl = otherImg_template['img']['tpl']
            break
    }
    var div = tpl.replace(/&{url}/g, url);
    imgContains.find('.uploadImgUL').append(div);
    // 设定勾选状态
    if (checked1) {
        imgContains.find('[name=checkbox1]')[index].checked = true
    }
    if (checked7) { // 尺寸图
        imgContains.find('[name=checkbox7]')[index].checked = true
        // 尺寸图勾选时 必选图勾选且不能取消
        imgContains.find('[name=checkbox1]')[index].checked = true
        imgContains.find('[name=checkbox1]')[index].disabled = true
    }
    if (checked3) {
        imgContains.find('[name=checkbox3]')[index].checked = true
    }
    if (checked4) {
        imgContains.find('[name=checkbox4]')[index].checked = true
    }
    if (checked5) {
        $(imgContains.find('.selfImgIcon')[index]).show()
    }
    if (checked6) {
        $(imgContains.find('.showSexy')[index]).show()
    }
    imgContains.find(".kongImgDivOut").hide();
    // 更新当前上传数量 
    imgContains.find(".curImgNum").text(imgContains.find('.uploadImgUL li').length)
    layui.form.on('checkbox(sizeCheck)', function(data) {
        let el = data.elem
        if (data.elem.checked) {
            // 选中尺寸图 则必选图必选 且不能更改
            $(el).parents('.ImgDivOut').find('.mustCheck').prop('checked', true)
            $(el).parents('.ImgDivOut').find('.mustCheck').attr('disabled', true)
            
        } else {
            $(el).parents('.ImgDivOut').find('.mustCheck').attr('disabled', false)
        }
        layui.form.render()
    });
}

function prodTpl_getSubmitInfo (isCheck) {
    let formEle = $('#addProdTplForm')
    let receiveDataObj = serializeObject(formEle)
    // console.log(receiveDataObj);

    receiveDataObj.appObject = procMultiInput("appObject", "|")
    receiveDataObj.specNum = procMultiInput("specNum", "|")
    receiveDataObj.mainImages = getImage_template('mainImg')
    receiveDataObj.assistImgs = getImage_template('assisImg')
    receiveDataObj.isSupplierOrigiImg = formEle.find('[name=isSupplierOrigiImg]').prop('checked')
    receiveDataObj.originPsku = formEle.find('[name=pSku]').prop('originPsku')
    receiveDataObj.originId = formEle.find('[name=pSku]').prop('originId')
    receiveDataObj.originDevPsku = formEle.find('[name=devPSku]').prop('originPsku')
    receiveDataObj.originDevPId = formEle.find('[name=devPSku]').prop('originId')
    receiveDataObj.joomSensProd = layui.formSelects.value('tpl_select_joomSens', 'val').join(",");
    receiveDataObj.hasWhiteImg = 0
    receiveDataObj.prodDesc = receiveDataObj.prodDesc.replace(/，/g,',')
                                                    .replace(/：/g, ':')
                                                    .replace(/“/g, '"')
                                                    .replace(/”/g, '"')
                                                    .replace(/‘/g, "'")
                                                    .replace(/’/g, "'")
                                                    .replace(/、/g, ',')
                                                    .replace(/。/g, '.')
                                                    .replace(/（/g, '(')
                                                    .replace(/）/g, ')')
    receiveDataObj.fixDesc = receiveDataObj.fixDesc.replace(/，/g,',')
                                                    .replace(/：/g, ':')
                                                    .replace(/“/g, '"')
                                                    .replace(/”/g, '"')
                                                    .replace(/‘/g, "'")
                                                    .replace(/’/g, "'")
                                                    .replace(/、/g, ',')
                                                    .replace(/。/g, '.')
                                                    .replace(/（/g, '(')
                                                    .replace(/）/g, ')')
    receiveDataObj.assistInfo = {}
    delete receiveDataObj.cate
    let fivePointDescInp = formEle.find('[name=fivePointDesc]')
    let fiveArr = []
    for (let i = 0;i < fivePointDescInp.length; ++i) {
        if (fivePointDescInp[i].value.trim()) {
            fiveArr.push(fivePointDescInp[i].value.trim())
        }
    }
    receiveDataObj.assistInfo.fivePointDesc = fiveArr.join('||')
    receiveDataObj.assistInfo.specNumNew = formEle.find('[name=specNumNew]').val()
    receiveDataObj.assistInfo.fitModel = formEle.find('[name=fitModel]').val()
    receiveDataObj.assistInfo.amazonTitle = receiveDataObj.amazonTitle
    receiveDataObj.assistInfo.coreKeyWord = receiveDataObj.coreKeyWord
    // 判断是否新版关键词
    let ifNewKeyWord = $('#prodTpl_ifNewKeyword').val() === 'true'
    if (ifNewKeyWord) {
        receiveDataObj.originTitle = formEle.find('[name=originTitle_new]').val()
        let totalNum = 0;
        for (let i = 0; i < prodTpl_keywordtype.length; ++i) {
            let keywordtype = prodTpl_keywordtype[i]
            let keywordObj = getKeywordFromLi(keywordtype,'|')
            // type != 'keywordFit'
            if (i != 2 && keywordObj.num === 0 && isCheck != 'noCheck') {
                layer.msg('各类关键词都必须填写至少一个')
                return
            }
            if (keywordtype !== 'keywordFit') {
                totalNum += keywordObj.num
            }
            receiveDataObj.assistInfo[prodTpl_keywordtype[i]] = keywordObj.keyword
        }
        if (totalNum < 10 && isCheck != 'noCheck') {
            layer.msg('核心词+属性词+补充词的数量需≥10')
            return
        }
    } else {
        for (let i = 0; i < prodTpl_keywordtype.length; ++i) {
            receiveDataObj.assistInfo[prodTpl_keywordtype[i]] = ''
        }
        if (receiveDataObj.keyword.split('\n').length < 10 && isCheck != 'noCheck') {
            layer.msg('关键词和wish都要大于10个')
            return false
        }
    }

    // 过滤掉每个关键词前后的空格
    let keywordArr = receiveDataObj.keyword.split('\n')
    for (let i = 0; i < keywordArr.length; ++i) {
        keywordArr[i] = keywordArr[i].trim()
    }
    receiveDataObj.keyword = keywordArr.join('\n')
    let mp4Url = $(".mp4Contain").find('[name=mp4Url]')
    if(mp4Url.length != 0){
        receiveDataObj.assistInfo.vedioUrl = $(".mp4Contain").find('[name=mp4Url]').attr("src")

    }

    return receiveDataObj
}

// 发送ajax新增模板
function submit_template(auditStatus,skipCheckTort) {
    let receiveDataObj = prodTpl_getSubmitInfo()
    receiveDataObj.ifSaveWaterMarkImg = $('#ifSaveWaterMarkImg').prop('checked')
    receiveDataObj.skipCheckTort = skipCheckTort
    if (!receiveDataObj) {
        return
    }
    // 判断是否有重复的图片
    let allImages = $('[data-id=mainImgContains] .uploadImgUL img,[data-id=assistImgContains] .uploadImgUL img')
    if (!checkImgRepeat(allImages)) {
        layer.msg('主图和辅图中存在重复的图片')
        return false
    }
    if (!receiveDataObj.id) {
        layer.msg('请填写一个有效的父SKU')
        return false
    }
    if (auditStatus) {
        receiveDataObj.auditStatus = auditStatus
    }
    if (receiveDataObj.prodDesc.split('\n').length < 5) {
        layer.msg('商品描述要不少于5行')
        return false
    }
    // 拿到 fixDesc  prodDesc 的值
    let prodDescVal = $('textarea[name="prodDesc"]').val()
    let fixDescVal = $('textarea[name="fixDesc"]').val()
    let wordStr = prodDescVal +"\n" + fixDescVal
    if (getWordList(wordStr).length < 30) {
        layer.msg('随机描述和固定描述的所有单词不能少于30个')
        return false
    }
    // 获取子模板数据
    receiveDataObj.varients = getVariety_template(true)
    if (!receiveDataObj.varients) {
        return false
    }
    let sizeImg = receiveDataObj.assistImgs?.filter(item => item.ifSize)
    if (receiveDataObj.assistImgs?.length > 0 && sizeImg?.length > 1) {
        layer.msg('尺寸图最多只允许选择一张')
        return false
    }
    if (auditStatus && receiveDataObj.mainImages.length === 0) {
        layer.msg('请至少选择1张图片作为主图')
        return false
    }

    let isOverLimit = receiveDataObj.varients?.some(item => {
        return item.color.length > 30 || item.size.length > 30 || item.style.length > 30
    })
    if (isOverLimit) {
        return layer.msg('颜色、尺寸、款式限制字符数≤30', {icon:7})
    }

    oneAjax.post({
        url: ctx + "/prodTpl/checkShoppeeTort.html",
        data: receiveDataObj,
        success: function(res) {
            console.log('checkShoppeeTort 请求结束')
            if (res.code === '0000') {
                submitTpl(receiveDataObj);
            } else if (res.code === '5555') {
                layer.confirm(res.msg, {
                    btn: ['确定', '取消'], //按钮
                    shade: false //不显示遮罩
                }, function(index) {
                    submitTpl(receiveDataObj);
                });
            } else {
                layer.msg(res.msg)
            }
        },
        error: function() {
            layer.msg("发送请求失败");
        }
    })
}



function submitTpl(receiveDataObj) {
    oneAjax.post({
        url: ctx + "/prodTpl/addProdTpl.html",
        contentType: "application/json;charset=utf-8",
        data: receiveDataObj,
        success: function(returnData) {
            console.log('addProdTpl请求结束')
            if (returnData.code === "0000") {
                layer.closeAll();
                pageQuery_prodTpl(prodTplPage.curr, prodTplPage.limit)
                layer.msg("保存成功");
                selSizeArr = []
                if (returnData.msg) {
                    layer.alert("保存成功；  \n" + returnData.msg)
                }
            } else {
                layer.msg(returnData.msg);
            }
        },
        error: function() {
            layer.msg("发送请求失败");
        }
    }, 'area')
}

//2.获取表单内容函数start
function formInput(name) {
    return $('#addProdTplForm [name="' + name + '"]').val();
}

//3.适用对象和特殊数量的处理函数start
function procMultiInput(name, separator) {
    //var select = document.getElementById(id);
    var str = [];
    $("#addProdTplForm").find("input[name='" + name + "']").each(function() {
        var inputValue = $(this).val();
        if ($.trim(inputValue) != '') {
            str.push(inputValue);
        }
    });
    var str1 = str.join(separator);
    return str1;
}

//4. 获取图片的函数start
function getImage_template(obj) {
    var imgs = [];
    var imgInps = $('input[name="' + obj + '"]')
    var img
    for (var i = 0; i < imgInps.length; ++i) {
        img = {}
        img.name = $(imgInps[i]).val();
        if (obj == 'mainImg') { //主图
            img.isWhite = $(imgInps[i]).siblings('[name=checkbox1]').prop('checked');
            img.ifSize = $(imgInps[i]).siblings('[name=checkbox7]').prop('checked');
            img.isNotSupplier = $(imgInps[i]).siblings('[name=checkbox3]').prop('checked');
        } else { //辅图
            img.isMust = $(imgInps[i]).siblings('[name=checkbox1]').prop('checked');
            img.ifSize = $(imgInps[i]).siblings('[name=checkbox7]').prop('checked');
            img.isNotSupplier = $(imgInps[i]).siblings('[name=checkbox3]').prop('checked');
            img.isWhite = $(imgInps[i]).siblings('[name=checkbox4]').prop('checked');
        }
        imgs.push(img);
    }

    return imgs;
}

/**
 * 获取变种数据
 * @param ifValid  是否校验
 * @returns {*}
 */
function getVariety_template(ifValid) {
    let layer = layui.layer
    let varients = []
    let varient
    let tdArr
    let sSkuJSON = {} // 用于校验是否有重复的sku
    let variantIdJSON = {} // 用于校验是否有重复的variantId
    let variantId
    let varaintTrs = $("#goodsList").find("tr[data-id]")
    if (!varaintTrs || varaintTrs.length === 0) {
        layer.msg('无子模板数据')
        return false
    }

    let ifColor = false
    let ifSize = false
    let ifStyle = false

    for (let i = 0; i < varaintTrs.length; ++i) {
        tdArr = $(varaintTrs[i]).children();
        varient = {};
        // varient.id = tdArr.eq(0).find('[name=id]').val().trim();//id
        varient.sSku = tdArr.find('[name=sSku]').val().trim(); //sku
        varient.sort = tdArr.find('[name=sort]').val().trim(); //sku
        varient.prodSId = tdArr.find('[name=prodSId]').val().trim(); //sku
        varient.size = tdArr.find('[name=size]').val().trim(); //size
        varient.color = tdArr.find('[name=color]').val().trim(); //color
        varient.style = tdArr.find('[name=style]').val().trim(); //style
        varient.weight = tdArr.find('[name=weight]').val().trim(); //重量
        varient.cost = tdArr.find('[name=priced]').val().trim(); //实际成本
        varient.isSale = tdArr.find('[name=isSale]').prop('checked');
        varient.ifSpread = tdArr.find('[name=ifSpread]').prop('checked');
        varient.listingWarnPrice = tdArr.find('[name=warningcost]').val().trim(); //刊登警示价

        // 校验变种数多于1个的，是否颜色和尺寸都为空字符串,且 颜色和尺寸组合的id 不能重复
        variantId = escapeJquery(varient.color + '-' + varient.size + "-" + varient.style).replace(/[&\|\\\*^%$#@\s\/]/g, "")
        if (ifValid) {
            // 颜色是否合格
            if (tdArr.eq(2).find('[name=color]').attr('ifNotValid')) {
                layer.msg('存在非法颜色',{icon:7})
                return false
            }
            //款式是否符合
            if (tdArr.eq(3).find('[name=style]').attr('ifNotValid')) {
                layer.msg('存在非法款式',{icon:7})
                return false
            }

            if (!varient.sSku) {
                layer.msg('存在变体缺少sku，请补充sku或者移除该变体',{icon:7})
                return false
            }

            // 校验sku 是否重复
            if (sSkuJSON[varient.sSku]) {
                layer.msg('变体' + varient.sSku + '重复',{icon:7})
                return false
            }

            if (varaintTrs.length > 1) {
                // 颜色查/尺寸存在值，则相应的其他sku 颜色/尺寸也要存在值。
                if (i == 0) {
                    if (varient.color) {
                        ifColor = true
                    }
                    if (varient.size) {
                        ifSize = true
                    }
                    if (varient.style) {
                        ifStyle = true
                    }
                } else if (i > 0) {
                    if ((ifColor && !varient.color) || (!ifColor && varient.color)) {
                        layer.msg('多变种模板，任一变种有颜色，其他变种也当有颜色',{icon:7})
                        return false
                    }
                    if ((ifSize && !varient.size) || (!ifSize && varient.size)) {
                        layer.msg('多变种模板，任一变种有尺寸，其他变种也当有尺寸',{icon:7})
                        return false
                    }
                    if ((ifStyle && !varient.style) || (!ifStyle && varient.style)) {
                        layer.msg('多变种模板，任一变种有款式，其他变种也当有款式',{icon:7})
                        return false
                    }
                }


                if (variantIdJSON[variantId]) {
                    layer.msg('存在颜色、尺寸、款式都相同的变种',{icon:7})
                    return false
                }
                if (!varient.color && !varient.size && !varient.style) {
                    layer.msg('多变种模板，不可颜色、尺寸、款式都为空',{icon:7})
                    return false
                }
            }
        }

        sSkuJSON[varient.sSku] = true
        variantIdJSON[variantId] = 1

        // 检查是否有nas白底图
        varient.amazonImgStatus = parseInt($(varaintTrs[i]).next().find('[amazonImgStatus]').val())

        //处理图片
        varient.varientImgs = getImgData($(varaintTrs[i]).next())
        varients.push(varient);
    }
    return varients;
}
// 获取图片数据
// imgContains  图片容器
function getImgData(imgContains) {
    var varientImgs = [];
    var varientImg
    imgContains.find(".uploadImgUL li").each(function() {
        varientImg = {}
        varientImg.name = $(this).find("input[name=varImg]").val()
        varientImg.isWhite = $(this).find("input[name='checkbox1']").prop('checked')
        varientImg.isNotSupplier = $(this).find("input[name='checkbox3']").prop('checked')
        varientImgs.push(varientImg)
    });
    return varientImgs
}


//1.右侧固定时间树的锚点定位
function tplLocation(obj) {
    var $id = $(obj).data('id');
    document.getElementById($id).scrollIntoView();
};


//移除所有图片
function removeAllImg(thisDom, status) {
    layer.confirm(`您确认要删除所有${status}图片？`, {
        icon: 3,
        title: '提示'
    }, function(index) {
        delImgFunc(obj, index)
        let removeDom = Array.from($(thisDom).parents('.imgContains').find('.ImgDivOut').children())
        removeDom.forEach(V => {
            delImgFunc(V)
        })
        layer.close(index);
    },function (index) {
        layer.close(index);
    });
}

//图片删除
function delImg(obj) {
    var index = layer.confirm('您确认要删除图片？', {
        icon: 3,
        title: '提示',
        success: function(layero, index) {
            this.enterEsc = function(event) {
                if (event.keyCode === 13) {
                    delImgFunc(obj)
                    layer.close(index);
                    return false; //阻止系统默认回车事件
                }
            };
            $(document).on('keydown', this.enterEsc); //监听键盘事件，关闭层
        },
        end: function() {
            $(document).off('keydown', this.enterEsc); //解除键盘关闭事件
        }
    }, function() {
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
}

// 视频上传 -- start --
// 删除视频
$(document).on("click",".deleteMp4Btn",function() {
    $(".mp4Contain").html("")
})

// copy lazada 视频库
$(document).on("click", ".copyMp4ToLazadaBtn", function () {
    let index = layer.open({
        type: 1,
        title: '同步公共视频库',
        area: ['260px', '165px'],
        id: 'syncMp4LazadaLayer',
        content: '<div class="p20 pl20"><span>确认同步到Lazada视频库?</span></div>',
        btn: ['确定', '关闭'],
        yes: function () {
            let vedioUrlSrc = $('.mp4Contain').find('[name=mp4Url]');
            let videoUrl = "";
            if (vedioUrlSrc) {
                videoUrl = $('.mp4Contain').find('[name=mp4Url]').attr("src");
            }
            if (videoUrl == undefined || videoUrl == "") {
                layer.msg("没有正确的视频url,无法操作!");
                return
            }
            var addProdTplForm = $("#addProdTplForm");
            var data = {
                sku: addProdTplForm.find('[name=pSku]').val(),
                prodPId: addProdTplForm.find('[name="id"]').val(),
                videoUrl: videoUrl
            }
            getFileByUrl(videoUrl,data.sku+'.mp4','video/mp4').then(async function (res) {
                let flag = await validateVideo([res],[10,60])
                if(flag) {
                    loading.show()
                    $.ajax({
                        url: ctx + "/LazadaVideoUpload/copyFromTemplate",
                        type: 'post',
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function (returnData) {
                            layer.close(index);
                            loading.hide()
                            if (returnData.code == "0000") {
                                layer.msg(returnData.msg);
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function () {
                            loading.hide()
                            layer.msg("发送请求失败");
                        }
                    })
                }
            })
        }
    })
})
// URL上传
$(document).on("click",".uploadNetMp4Btn",function(){
    initUploadVedioByUrl(imageUpDomain + 'file/uploadFile',templateVedioUploadPath)
})
// 本地上传-弹窗success里
// 视频上传 -- end --

var sizeRel = "Man"; // 尺寸分类，默认显示Man分类

//size添加比对
function sizeComparison(price) {
    for (var i = 0; i < newSizeData.length; i++) {
        if (price == newSizeData[i]) {
            return;
        }
    }
};
//添加checkbox的add函数
function addBtn(key) {
    //回车方法
    function inputEnter(e, that) {
        if (e.keyCode == 13) {
            $(that).next().click();
        };
    };
    //自定义btn处理
    $('#newCustomSize').keyup(function(e) {
        var price = $(this).val();
        if (validateCustom(price)) {
            for (var i = 0; i < newSizeData.length; i++) {
                if (price == decodeURI(newSizeData[i])) {
                    $(this).next().addClass("layui-btn-disabled");
                    return;
                }
            }
            $(this).next().removeClass("layui-btn-disabled");
            inputEnter(e, this);
        } else {
            $(this).next().addClass("layui-btn-disabled");
        }
    });
    //重量btn处理
    $('#newWeightSize').keyup(function(e) {
        var price = $(this).val();
        if (validateWeight(price)) {
            for (var i = 0; i < newSizeData.length; i++) {
                if (price == decodeURI(newSizeData[i])) {
                    $(this).next().addClass("layui-btn-disabled");
                    return;
                }
            }
            $(this).next().removeClass("layui-btn-disabled");
            inputEnter(e, this);
        } else {
            $(this).next().addClass("layui-btn-disabled");
        }
    });
    //瓦数btn处理
    $('#newWattageSize').keyup(function(e) {
        var price = $(this).val();
        if (validateWattage(price)) {
            for (var i = 0; i < newSizeData.length; i++) {
                if (price == decodeURI(newSizeData[i])) {
                    $(this).next().addClass("layui-btn-disabled");
                    return;
                }
            }
            $(this).next().removeClass("layui-btn-disabled");
            inputEnter(e, this);
        } else {
            $(this).next().addClass("layui-btn-disabled");
        }
    });
    //长度btn处理
    $('#newLengthSize').keyup(function(e) {
        var price = $(this).val();
        if (validateLength(price)) {
            for (var i = 0; i < newSizeData.length; i++) {
                if (price == decodeURI(newSizeData[i])) {
                    $(this).next().addClass("layui-btn-disabled");
                    return;
                }
            }
            $(this).next().removeClass("layui-btn-disabled");
            inputEnter(e, this);
        } else {
            $(this).next().addClass("layui-btn-disabled");
        }
    });
    //面积或体积btn处理
    $('#newAreaSize').keyup(function(e) {
        var price = $(this).val();
        if (validateArea(price)) {
            for (var i = 0; i < newSizeData.length; i++) {
                if (price == decodeURI(newSizeData[i])) {
                    $(this).next().addClass("layui-btn-disabled");
                    return;
                }
            }
            $(this).next().removeClass("layui-btn-disabled");
            inputEnter(e, this);
        } else {
            $(this).next().addClass("layui-btn-disabled");
        }
    });
    //电压btn处理
    $('#newVoltageSize').keyup(function(e) {
        var price = $(this).val();
        if (validateVoltage(price)) {
            for (var i = 0; i < newSizeData.length; i++) {
                if (price == decodeURI(newSizeData[i])) {
                    $(this).next().addClass("layui-btn-disabled");
                    return;
                }
            }
            $(this).next().removeClass("layui-btn-disabled");
            inputEnter(e, this);
        } else {
            $(this).next().addClass("layui-btn-disabled");
        }
    });
    //容量btn处理
    $('#newVolumeSize').keyup(function(e) {
        var price = $(this).val();
        if (validateVolume(price)) {
            for (var i = 0; i < newSizeData.length; i++) {
                if (price == decodeURI(newSizeData[i])) {
                    $(this).next().addClass("layui-btn-disabled");
                    return;
                }
            }
            $(this).next().removeClass("layui-btn-disabled");
            inputEnter(e, this);

        } else {
            $(this).next().addClass("layui-btn-disabled");
        }
    });
    //鞋子btn处理
    $('#newShoesSize').keyup(function(e) {
        var price = $(this).val();
        $('#size_content').find('input[type=checkbox]').each(function() {
            var val = $(this).val();
            newSizeData.push(decodeURI(val));
        });
        if ($.isNumeric(price)) {
            for (var i = 0; i < newSizeData.length; i++) {
                if (price == decodeURI(newSizeData[i])) {
                    $(this).next().addClass("layui-btn-disabled");
                    return;
                }
            }
            $(this).next().removeClass("layui-btn-disabled");
            inputEnter(e, this);
        } else {
            $(this).next().addClass("layui-btn-disabled");
        }
    });
    //数字btn处理
    $('#newNumbersSize').keyup(function(e) {
        var price = $(this).val();

        $('#size_content').find('input[type=checkbox]').each(function() {
            var val = $(this).val();
            newSizeData.push(decodeURI(val));
        });
        if ($.isNumeric(price)) {
            for (var i = 0; i < newSizeData.length; i++) {
                if (price == decodeURI(newSizeData[i])) {
                    $(this).next().addClass("layui-btn-disabled");
                    return;
                }
            }

            $(this).next().removeClass("layui-btn-disabled");
            inputEnter(e, this);
        } else {
            $(this).next().addClass("layui-btn-disabled");
        }
    });

    function addSizeHtml(size) {
        $('#sizeAdd').append('<div class="layui-col-xs4 p06"><label><input type="checkbox" name="' + key + '" checked="true" value="' + decodeURI(size) + '">&nbsp' + size + '  </label></div>');
    }
    //添加尺寸点击事件
    $('.new' + key + 'Size').click(function() {
        var size = ($('#new' + key + 'Size').val());
        $('#new' + key + 'Size').val("");
        sizeComparison(decodeURI(size));
        addSizeHtml(size);
        $(this).addClass("layui-btn-disabled");
        if (key != sizeType) {
            sizeRel = sizeType = key;
            newSizeData = [];
            $('#goodsList').html('');
            newSizeData.push(decodeURI(size));
            selSizeArr = [];
        } else {
            newSizeData.push(decodeURI(size));
        }
        selSize(decodeURI(size));
        // 变更变体组合
        goodsChange()
    });
}

//尺寸通过模板写入
function showSize(key) {
    if (key !== "Smartphones") {
        var tpl = sizeData[key]["head"];
        $("#size_content").html("");
        for (var i = 0; i < sizeData[key]["data"].length; i++) {
            //sizeData[key]["data"][i]["index"] = i;
            //用数据转换模板把数据结构里的data内容写到相应的tpl显示方法里并累记到tpl时里
            //sizeData[key]["data"][i]["key"] = key;
            sizeData[key]["data"][i]["code_size"] = decodeURI(sizeData[key]["data"][i]["size"]);
            tpl += sizeData[key]["tpl"].format(sizeData[key]["data"][i]);
        }
        tpl += sizeData[key]["foot"];
        $("#size_content").append(tpl);
    } else {
        smartphonesBuild(key);
    }
    addBtn(key);
};

function smartphonesBuild(key) {
    var data = sizeData[key]["data"];
    var newData = smartphonesDataHandle(data);
    var tpl = "";
    tpl += "<div class='layui-col-xs12' style='height:600px;padding: 0 15px;overflow:auto'>";
    tpl += '<div id="sizeAdd" class="phoneFoot col-xs-12">';
    tpl += "</div><div style='clear: both;'></div></div>";
    var outHtml = $(tpl);
    var listOut = '<div class="listOut layui-clear" style="width: 99%;padding:  0 0.5% 0 0.5% "><div style="width:100%;font-size:14px;color:#000;font-weight:700" uid="&{nameEn}">&{name}</div><div uid="exile" style="margin-top: 4px;width: 100%;"></div></div>';
    var listCtnListOut = '<div style="width: 100%; margin-bottom:10px" class="layui-clear"><b style="color:#888">&{name}</b><div style="width: 100%;" class="listCtnList p0"></div></div>';
    $("#size_content").html("");
    $.each(newData, function(a, b) {
        var listOutObj = $(listOut.format(b));
        var listIpt;
        if (a == 'apple') {
            listOutObj.addClass("listOutBac");
        }
        if (b.list) {
            $.each(b.list, function(k, y) {
                listIpt = smartphonesIptHtmlHandle(y.dataVal);
                var listCtnListOutObj = $(listCtnListOut.format(y));
                listCtnListOutObj.find('.listCtnList').append(listIpt);
                listOutObj.find('div[uid="exile"]').append(listCtnListOutObj);
            });
        } else {
            listIpt = smartphonesIptHtmlHandle(b.listVal);
            listOutObj.find('div[uid="exile"]').append(listIpt);
        }
        outHtml.find('.phoneFoot').append(listOutObj);
    });
    $("#size_content").append(outHtml);
};
//手机类型数组生成html
function smartphonesIptHtmlHandle(arr) {
    var str = '';
    if (arr.length > 0) {
        $.each(arr, function(i) {
            str += '<div class="layui-col-xs4 p06"><label><input type="checkbox" name="Smartphones" value="' + decodeURI(arr[i]) + '">' + arr[i] + '  </label></div>';
        });
    }
    return str;
};
//手机类型数据重组，便于生成新页面内容
function smartphonesDataHandle(data) {
    /*2017.1.9 byzym all正则*/
    /*苹果*/
    var ipho = new RegExp('.*?iPhone.*?', 'i');
    /*iphone*/
    var ipad = new RegExp('.*?iPad.*?', 'i');
    /*ipad*/
    var ipod = new RegExp('.*?ipod.*?', 'i');
    /*ipod*/
    var iwat = new RegExp('.*?apple.*?watch.*?', 'i');
    /*apple watch*/
    /*三星*/
    var sgas = new RegExp('.*?samsung.*?galaxy.*s.*?', 'i');
    /*三星 s系列*/
    var sgan = new RegExp('.*?samsung.*?galaxy.*note.*?', 'i');
    /*三星 note系列*/
    var sgat = new RegExp('.*?samsung.*?tab.*?', 'i');
    /*三星 tab系列*/
    var sgaj = new RegExp('.*?samsung.galaxy.([a-jA-J]{1}[0-9]{1,2}).*?', 'i');
    /*三星 a-j系列*/
    var sgao = new RegExp('.*?samsung.*?', 'i');
    /*三星其它*/
    /*htc*/
    var htcon = new RegExp('.*?htc.*?one.*?', 'i');
    /*htc one系列*/
    var htcde = new RegExp('.*?htc.*?desire.*?', 'i');
    /*htc desire系列*/
    var htcoth = new RegExp('.*?htc.*?', 'i');
    /*htc其它*/
    /*华为*/
    var huaac = new RegExp('.*?huawei.*?ascend.*?', 'i');
    /*华为 ascend系列*/
    var huaho = new RegExp('.*?huawei.*?honor.*?', 'i');
    /*华为 honhor系列*/
    var huaot = new RegExp('.*?huawei.*?', 'ig');
    /*华为其它*/
    /*小米*/
    var xiaomi = new RegExp('.*?xiaomi.*?mi.*?', 'i');
    /*小米 mi系列*/
    var xiaormi = new RegExp('.*?xiaomi.*?redmi.*?', 'i');
    /*小米 红米系列*/
    var xiaomno = new RegExp('.*?xiaomi.*?note.*?', 'i');
    /*小米 note*/
    /*sony*/
    var sonyxt = new RegExp('.*?sony.*?xperia.*?', 'i');
    /*sony xpreia系列*/
    var sonyxot = new RegExp('.*?sony.*?', 'i');
    /*sony其它*/
    /*LG*/
    var lggsc = new RegExp('.*?lg.*?stylo.*?', 'i');
    /*LG stylo系列*/
    var lggvc = new RegExp('.*?lg.*?vista.*?', 'i');
    /*LG vista系列*/
    var lggc = new RegExp('.*?lg.g.*?', 'i');
    /*LG G系列*/
    var lggoc = new RegExp('.*?lg.*?', 'i');
    /*LG其它*/
    var lggkc = new RegExp('.*?lg.*?k.*?', 'i');
    /*LG K系列*/
    var lgglc = new RegExp('.*?lg.*?l([0-9]{1}).*?', 'i');
    /*LG stylo系列*/
    var lggxc = new RegExp('.*?lg.x.*?', 'i');
    /*LG stylo系列*/
    /*诺基亚*/
    var nokiac = new RegExp('.*?nokia.*?', 'i');
    /*亚马逊*/
    var amazonc = new RegExp('.*?amazon.*?', 'i');
    /*中兴*/
    var ztec = new RegExp('.*?zte.*?', 'i');
    /*微软*/
    var micc = new RegExp('.*?microsoft.*?', 'i');
    /*摩托罗拉*/
    var motoc = new RegExp('.*?motorola.*?moto.*?', 'i');
    /*Motorola moto系列*/
    var motoot = new RegExp('.*?motorola.*?', 'i');
    /*Motorola 其它*/
    var otherReg = new RegExp('(google|ios|android|kyocera|alcatel|asus|onePlus)', 'i');
    var newObj = {};
    var arr1 = [{
            name: 'apple',
            value: '苹果/Apple',
            list: {
                iph: "iPhone系列",
                ipa: "iPad系列",
                ipo: "iPod系列",
                iwa: "Apple Watch系列"
            }
        },
        {
            name: 'samsung',
            value: '三星',
            list: {
                sgs: "Samsung Galaxy S系列",
                sgn: "Samsung Galaxy Note系列",
                sgt: "Samsung Tab系列",
                sga: "Samsung Galaxy A到J系列",
                sgo: "Samsung其它"
            }
        },
        {
            name: 'htc',
            value: 'HTC',
            list: {
                htco: "HTC One系列",
                htcd: "HTC Desrie系列",
                htcot: "HTC其它"
            }
        },
        {
            name: 'huawei',
            value: '华为',
            list: {
                huaa: "Huawei Ascend系列",
                huah: "Huawei Honor系列",
                huao: "Huawei其它"
            }
        },
        {
            name: 'xiaomi',
            value: '小米',
            list: {
                xiaom: "XiaoMi Mi系列",
                xiaorm: "XiaoMi RedMi系列",
                xiaomn: "XiaoMi Note系列"
            }
        },
        {
            name: 'sony',
            value: '索尼',
            list: {
                sonyxc: "SONY Xperia系列",
                sonyxo: "SONY其它"
            }
        },
        {
            name: 'lg',
            value: 'LG',
            list: {
                lggs: "LG Stylo系列",
                lggv: "LG Vista系列",
                lgg: "LG G系列",
                lggk: "LG K系列",
                lggl: "LG L系列",
                lggx: "LG X系列",
                lggo: "LG其它"
            }
        },
        {
            name: 'nokia',
            value: '诺基亚'
        },
        {
            name: 'amazon',
            value: '亚马逊'
        },
        {
            name: 'zte',
            value: '中兴'
        },
        {
            name: 'mic',
            value: '微软'
        },
        {
            name: 'motorola',
            value: '摩托罗拉',
            list: {
                moto: "Motorola Moto系列",
                motoo: "Motorola其它"
            }
        },
        {
            name: 'other',
            value: '其它'
        }
    ];
    $.each(arr1, function(i) {
        var name = arr1[i].name,
            value = arr1[i].value,
            list = arr1[i].list;
        newObj[name] = {};
        newObj[name].name = value;
        newObj[name].nameEn = name;
        if (list) {
            newObj[name].list = {};
            $.each(list, function(listName, listValue) {
                newObj[name].list[listName] = {};
                newObj[name].list[listName].name = listValue;
                newObj[name].list[listName].dataVal = [];
            })
        } else {
            newObj[name].listVal = [];
        }
    });
    for (var i = 0; i < data.length; i++) {
        var onData = data[i].size;
        if (!otherReg.test(onData)) {
            if (ipho.test(onData)) {
                newObj.apple.list.iph.dataVal.push(onData);
            } else if (ipad.test(onData)) {
                newObj.apple.list.ipa.dataVal.push(onData);
            } else if (ipod.test(onData)) {
                newObj.apple.list.ipo.dataVal.push(onData);
            } else if (iwat.test(onData)) {
                newObj.apple.list.iwa.dataVal.push(onData);
            } else if (amazonc.test(onData)) {
                newObj.amazon.listVal.push(onData);
            } else if (htcon.test(onData)) {
                newObj.htc.list.htco.dataVal.push(onData);
            } else if (htcde.test(onData)) {
                newObj.htc.list.htcd.dataVal.push(onData);
            } else if (htcoth.test(onData)) {
                newObj.htc.list.htcot.dataVal.push(onData);
            } else if (huaac.test(onData)) {
                newObj.huawei.list.huaa.dataVal.push(onData);
            } else if (huaho.test(onData)) {
                newObj.huawei.list.huah.dataVal.push(onData);
            } else if (huaot.test(onData)) {
                newObj.huawei.list.huao.dataVal.push(onData);
            } else if (lggsc.test(onData)) {
                newObj.lg.list.lggs.dataVal.push(onData);
            } else if (lggvc.test(onData)) {
                newObj.lg.list.lggv.dataVal.push(onData);
            } else if (lggc.test(onData)) {
                newObj.lg.list.lgg.dataVal.push(onData);
            } else if (lggkc.test(onData)) {
                newObj.lg.list.lggk.dataVal.push(onData);
            } else if (lgglc.test(onData)) {
                newObj.lg.list.lggl.dataVal.push(onData);
            } else if (lggxc.test(onData)) {
                newObj.lg.list.lggx.dataVal.push(onData);
            } else if (lggoc.test(onData)) {
                newObj.lg.list.lggo.dataVal.push(onData);
            } else if (micc.test(onData)) {
                newObj.mic.listVal.push(onData);
            } else if (motoc.test(onData)) {
                newObj.motorola.list.moto.dataVal.push(onData);
            } else if (motoot.test(onData)) {
                newObj.motorola.list.motoo.dataVal.push(onData);
            } else if (nokiac.test(onData)) {
                newObj.nokia.listVal.push(onData);
            } else if (sonyxt.test(onData)) {
                newObj.sony.list.sonyxc.dataVal.push(onData);
            } else if (sonyxot.test(onData)) {
                newObj.sony.list.sonyxo.dataVal.push(onData);
            } else if (sgaj.test(onData)) {
                newObj.samsung.list.sga.dataVal.push(onData);
            } else if (sgas.test(onData)) {
                newObj.samsung.list.sgs.dataVal.push(onData);
            } else if (sgan.test(onData)) {
                newObj.samsung.list.sgn.dataVal.push(onData);
            } else if (sgat.test(onData)) {
                newObj.samsung.list.sgt.dataVal.push(onData);
            } else if (sgao.test(onData)) {
                newObj.samsung.list.sgo.dataVal.push(onData);
            } else if (xiaormi.test(onData)) {
                newObj.xiaomi.list.xiaorm.dataVal.push(onData);
            } else if (xiaomi.test(onData)) {
                newObj.xiaomi.list.xiaom.dataVal.push(onData);
            } else if (xiaomno.test(onData)) {
                newObj.xiaomi.list.xiaomn.dataVal.push(onData);
            } else if (ztec.test(onData)) {
                newObj.zte.listVal.push(onData);
            }
        } else {
            newObj.other.listVal.push(onData);
        }
    }
    return newObj;
};

// 款式相关事件初始化
function initStyleEvent() {
    // 款式btn处理
    $('#styleInp_producttpl').keyup(function(e) {
        if (e.keyCode == 13) {
            $('#addStyleBtn_producttpl').click()
        }
    });
    $('#addStyleBtn_producttpl').click(function() {
            var style = $('#styleInp_producttpl').val().trim()
            if (!style) {
                return
            }
            var oldStyle = $('#style_content input:checkbox')
            for (var i = 0; i < oldStyle.length; ++i) {
                if (oldStyle[i].value == style) {
                    layui.layer.msg('已有相同的款式')
                    return
                }
            }
            $('#style_content').append(`<div class="fieldBox"><input type="checkbox" name="style" value="` + style + `" title="` + style + `" lay-skin="primary" checked></div>`)
            goodsChange()
        })
        //颜色check点击方法
    $('#producttplAddSuccess').on('click', '#productTpl_Color input[type=checkbox]', function(event) {
        goodsChange()
    });
    //尺寸check点击方法
    $('#producttplAddSuccess').on('click', '#size_content input[type=checkbox]', function(event) {
        goodsChange()
    });
    //款式check点击方法
    $('#producttplAddSuccess').on('click', '#style_content .layui-form-checkbox', function(event) {
        goodsChange()
    });
}

//切换尺寸类型
function sizeBtnClick() {
    $(".sizeBtn").click(function() {
        var key = $(this).attr("rel");
        if (sizeRel != undefined)
            showSize(key);
        if (key == sizeType) {
            for (var j = 0; j < selSizeArr.length; j++) {
                size = selSizeArr[j];
            }
        }
        $(".sizeBtn").each(function() {
            $(this).removeClass('ulBgColor');
        });
        $(this).addClass('ulBgColor');

    });
}

// 初始顔色列表
var goodsColorData = [
    {
        name: "白色",
        rgb: "#ffffff",
        colorId: "white",
        class: "fBlack"
    },
    {
        name: "黑色",
        rgb: "#000000",
        colorId: "black"
    },
    {
        name: "红色",
        rgb: "#FF2600",
        colorId: "red"
    },
    {
        name: "蓝色",
        rgb: "#0433FF",
        colorId: "blue"
    },
    {
        name: "绿色",
        rgb: "#009051",
        colorId: "green"
    },
    {
        name: "灰色",
        rgb: "#797979",
        colorId: "grey"
    },
    {
        name: "棕色",
        rgb: "#941100",
        colorId: "brown"
    },
    {
        name: "黄褐",
        rgb: "#929000",
        colorId: "tan"
    },
    {
        name: "米黄",
        rgb: "#FFFFCC",
        colorId: "beige",
        class: "fBlack"
    },
    {
        name: "粉红",
        rgb: "#FF2F92",
        colorId: "pink"
    },
    {
        name: "橙色",
        rgb: "#FF9300",
        colorId: "orange"
    },
    {
        name: "黄色",
        rgb: "#FFFB00",
        colorId: "yellow",
        class: "fBlack"
    },
    {
        name: "乳白",
        rgb: "#EBEBEB",
        colorId: "ivory",
        class: "fBlack"
    },
    /*{name:"墨绿",rgb:"#005493",colorId:"jasper"},*/
    {
        name: "藏青",
        rgb: "#000080",
        colorId: "navy blue"
    },
    {
        name: "紫色",
        rgb: "#531B93",
        colorId: "purple"
    },
    {
        name: "金色",
        rgb: "#FFD479",
        colorId: "gold"
    },
    {
        name: "多彩",
        rgb: "url(" + ctx + "/static/img/multicolor.jpg) repeat-y",
        colorId: "multicolor"
    }
];

// 初始化颜色选项
function colorRun() {
    for (var i = 0; i < goodsColorData.length; i++) {
        $('#productTpl_Color').append('<div class="inline_block p20"><label><input type="checkbox" value="' + goodsColorData[i]["colorId"] + '"> <span class="productTpl_span fWhite ' + goodsColorData[i]["class"] + '" style="background:' + goodsColorData[i]["rgb"] + '">' + goodsColorData[i]["name"] + '</span></label></div>');
    }
}

// 新增顔色输入框  值改变事件
$(document).on('keyup', '#otherColor', function() {
    // 去除提示信息
    $(this).css('border', '1px solid #CCCCCC');
    $(this).closest('.addColorGroup').find('#errorMsg').remove();
});
//添加颜色判断
var judgeTheColor = function(that) {
    that = $(that)
    var colorNew = $.trim(that.val()), //获取输入的颜色
        pageColor = that.closest('.productInfoModule-content').find('#productTpl_Color').find('label'), //获取渲染到ul中的颜色的label项
        group = that.closest('.addColorGroup'), //获取按钮所在行
        colorRepeats = 0, //是否重复
        arr = [];
    $.each(pageColor, function(i) {
        arr.push($(pageColor[i]).find('input[type="checkbox"]').val());
    });

    var colorStr = colorNew.toLowerCase(); //获取到input的值,转换成小写


    var colorArr = colorStr.split('&')
    var dataColor
    for (var i = 0; i < colorArr.length; ++i) {
        dataColor = colorArr[i]
        if ($.inArray(dataColor, merchantColors.toLowerCase().split(',')) == -1) { //判断是不是在wish扩展色里面
            colorRepeats = -1; //颜色错误
            return colorRepeats
        }
    }
    if ($.inArray(colorStr, arr) != -1) { //在数组arr中查找dataColor元素并返回索引值,如果没有就返回-1
        if (pageColor.find('input[value="' + colorStr + '"]').is(':checked')) {
            colorRepeats = 1;
        } else {
            pageColor.find('input[value="' + colorStr + '"]').click();
        }
    } else {
        colorRepeats = 2
    }
    return colorRepeats;
};
//颜色添加事件
var colorAddBtnPrimary = function(thiss) {
    // 获取要添加的颜色
    var that = $(thiss).closest('.addColorGroup').find('#otherColor'),
        color = $.trim(that.val());
    // 颜色合法性判断
    var type = judgeTheColor(that);
    if (type == 2) {
        addColorByColor(color);
        //清空输入框
        $('#otherColor').val("");
    } else if (type == 1) {
        that.closest('.addColorGroup').append('<div id="errorMsg" style="color:red">颜色重复</div>');
    } else if (type == -1) {
        that.closest('.addColorGroup').append('<div id="errorMsg" style="color:red">颜色无效</div>');
    } else if (type == 0) {
        //清空输入框
        $('#otherColor').val("");
    }
};
// 增加指定颜色的 选项
function addColorByColor(color) {
    // 数据库存入都是小写
    var iptColorId = color.toLowerCase();
    // 模板str
    var colorDiv = '<div class="inline_block p20">' +
        '<label>' +
        '<input type="checkbox" value="' + iptColorId + '" checked>' +
        '<span style="color:#000000;padding:5px 8px">' + color + '</span>' +
        '</label>' +
        '</div>';
    // 将新增颜色模板添加到dom中
    $('#productTpl_Color').append(colorDiv);
    goodsChange()
}

// 变体组合改变
function goodsChange() {
    // 获取被选中的颜色  如果为null，默认添加''
    var colorChekeds = $('#productTpl_Color input:checkbox:checked')
    var colorArr = []
    if (colorChekeds && colorChekeds.length > 0) {
        for (var i = 0; i < colorChekeds.length; ++i) {
            colorArr.push(colorChekeds[i].value)
        }
    } else {
        colorArr.push('')
    }
    colorArr = arrSortMinToMax(colorArr)
    // 获取被选中的尺寸   如果为Null，则默认添加''
    var sizeChekeds = $('#size_content input:checkbox:checked')
    var sizeArr = []
    if (sizeChekeds && sizeChekeds.length > 0) {
        for (var i = 0; i < sizeChekeds.length; ++i) {
            var size = decodeURI(sizeChekeds[i].value);
            sizeArr.push(size);
        }
    } else {
        sizeArr.push('')
    }

    sizeArr = arrSortMinToMax(sizeArr)
    // 获取被选中的款式   如果为Null，则默认添加''
    var styleChekeds = $('#style_content input:checkbox:checked')
    var styleArr = []
    if (styleChekeds && styleChekeds.length > 0) {
        for (var i = 0; i < styleChekeds.length; ++i) {
            var style = decodeURI(styleChekeds[i].value);
            styleArr.push(style);
        }
    } else {
        styleArr.push('')
    }
    styleArr = arrSortMinToMax(styleArr)

    // 获取原有变体列表
    var oldVaraints = {}
    var oldVaraintsTrs = $('#goodsList tr[data-id]') // 参数行
    var oldVaraintsImgTrs = $('#goodsList tr[data-imgId]') // 图片行
    var oldVaraintId
    var k
    var img
    var isMust
    var curTR
    var curImgTR
    if (oldVaraintsTrs && oldVaraintsTrs.length > 0) {
        for (var i = 0; i < oldVaraintsTrs.length; ++i) {
            oldVaraintId = oldVaraintsTrs[i].getAttribute('data-id')
            curTR = $(oldVaraintsTrs[i]) // 当前行的dom对象
            oldVaraints[oldVaraintId] = {
                    prodSId: curTR.find('[name=prodSId]').val(),
                    sSku: curTR.find('[name=sSku]').val(),
                    color: curTR.find('[name=color]').val(),
                    size: curTR.find('[name=size]').val(),
                    style: curTR.find('[name=style]').val(),
                    weight: curTR.find('[name=weight]').val(),
                    priced: curTR.find('[name=priced]').val(),
                    warningcost: curTR.find('[name=warningcost]').val(),
                    isSale: curTR.find('[name=isSale]').prop('checked'),
                    isOutOfStock: !(curTR.find('[name=isOutOfStock]').prop('checked')),
                    selfPhotoStatus: curTR.find('[name=selfPhotoStatus]').val(),
                    amazonImg: curTR.find('[name=amazonImg]').val(),
                    hasSelfPhotoNeed: curTR.find('[name=hasSelfPhotoNeed]').prop('checked'),
                    ifSpread: curTR.find('[name=ifSpread]').prop('checked'),
                }
                // 模板图片
            oldVaraints[oldVaraintId].imgList = []
            curImgTR = $(oldVaraintsImgTrs[i])
            var imgLis = curImgTR.find('.uploadImgUL li')
            if (imgLis && imgLis.length > 0) {
                for (k = 0; k < imgLis.length; ++k) {
                    isMust = $(imgLis[k]).find('[name=checkbox]:checked').prop('checked')
                    img = {
                        url: $(imgLis[k]).find('[name=varImg]').val(),
                        isMust: isMust ? 1 : 0
                    }
                    oldVaraints[oldVaraintId].imgList.push(img)
                }
            }
        }
    }

    // 进行颜色和尺寸和款式 笛卡尔积配对
    var newVaraints = {} // 当前的颜色和尺寸组合  Json对象
    var variantOne
    var variantId // 变体DOM对象的Id   获取时根据选择器[data-id=variantId]
    for (var i = 0; i < colorArr.length; ++i) {
        for (var j = 0; j < sizeArr.length; ++j) {
            for (var k = 0; k < styleArr.length; ++k) {
                variantOne = {} // 初始变体
                variantId = escapeJquery(colorArr[i] + '-' + sizeArr[j] + styleArr[k]).replace(/[&\|\\\*^%$#@\s\/]/g, "")
                if (oldVaraints[variantId]) {
                    variantOne = oldVaraints[variantId]
                } else {
                    variantOne.color = colorArr[i]
                    variantOne.size = decodeURI(sizeArr[j]);
                    variantOne.style = decodeURI(styleArr[k]);
                }
                newVaraints[variantId] = variantOne
            }
        }
    }

    // 重新渲染变体
    setVaraint(newVaraints, 1)
}
/**
 *  渲染变体dom对象
 * @param varaints
 * @param operType  操作类型 1. 新增  2、编辑
 * @param sortField  排序字段， 默认按照prodSId排序
 */
function setVaraint(map, operType,sortField) {
    // 清空所有变体
    $('#goodsList').html('')
    // 先排序
    let varaints = []
    for (let key in map) {
        varaints.push(map[key])
    }
    if (!sortField) {
        sortField = 'sort'
    }
    varaints = sortArr(1,varaints,sortField)

    for (var key in varaints) {
        addNewVaraint(key, varaints[key].id, varaints[key].prodSId, varaints[key].sSku, varaints[key].color, varaints[key].size, varaints[key].style, varaints[key].weight, varaints[key].priced, varaints[key].warningcost, varaints[key].imgList, varaints[key].isSale, varaints[key].isOutOfStock, varaints[key].ifOld, operType, varaints[key].selfPhotoStatus, varaints[key].amazonImg, varaints[key].hasSelfPhotoNeed, varaints[key].ifSpread, varaints[key].sort)
    }
    layui.form.render('checkbox')
}

/** 增加一个变体
 * @param ifOld 是否原数据
 */
function addNewVaraint(dataId, id, prodSId, sku, color, size, style, weight, priced, warningcost, imgList, isSale, isOutOfStock, ifOld, operType, selfPhotoStatus, amazonImg, hasSelfPhotoNeed,ifSpread, sort) {
    var ifUpdateSku = false;
    if ($('#ifUpdateSku_prodtemp').length > 0) {
        ifUpdateSku = true
    }
    /**复制新增时允许编辑sku**/
    if (prodTplCopyAdd) {
        ifUpdateSku = true;
    }
    var auditStatus = $('#auditStatus_addProdTplForm').val()
    var skuinpStr = ''
    if (ifOld == 'true' && auditStatus == '3' && !ifUpdateSku) {
        skuinpStr = '<input type="text" class="layui-input" name="sSku" value="' + (sku ? sku : '') + '" ifOld="' + ifOld + '" readonly>'
    } else {
        skuinpStr = '<input type="text" class="layui-input" onfocus="showOrHideSaveBtn(false,`保存`)" onblur="getProdSku_template(this)"  ifOld="' + ifOld + '" name="sSku" value="' + (sku ? sku : '') + '" oninput="searchSku_prodTpl(this,`ssku`)">'
    }
    // 是否可以 移除
    var removeStr = ''
    if (ifOld != 'true' || (operType == 2 && auditStatus != 3) || prodTplCopyAdd) {
        removeStr = '<button type="button" class="layui-btn layui-btn-default layui-btn-xs layui-btn-primary toHiddenWhenAllowed heeloworld" onclick="goodsRemove(this)" >移除</button>';
    }

    var str = ''
    str += '<tr data-id="' + dataId + '">' +
        '<td><input class="layui-input" name="sort" value="' + (sort ? sort : '') + '" autocomplete="off" onblur="prodTpl_reSort()"></td>' +
        '<td width="150">' +
        '<input type="hidden" class="layui-input" name="prodSId" value="' + (prodSId ? prodSId : '') + '" autocomplete="off">' +
        '<input type hidden name="id" value="' + (id ? id : '') + '"/>' +
        '<input type="hidden" name="amazonImg" value="' + (amazonImg || '') + '">' +
        skuinpStr +
        '<ul class="supplierUl" style="width:100%;border:1px solid #f8f8f8;box-sizing:border-box;position:absolute;z-index:99999;background:#fff;max-height:230px;overflow-y:scroll"></ul>' +
        '</td>' +
        '<td><input name="size" onkeyup="limitInputOfSize(this)" onblur="this.value=this.value.trim()" class="layui-input" value="' + decodeURI(size) + '"></td>' +
        '<td ><input name="color" class="layui-input" onblur="checkColorIfValid(this)" value="' + color + '"></td>' +
        '<td><input name="style" onkeyup="limitInputOfSize(this)" onblur="checkStyleIfValid(this)" class="layui-input" value="' + decodeURI(style) + '"></td>' +
        '<td><input lay-verify="required" class="layui-input" type="number" name="weight" value="' + (weight ? weight : '') + '" readonly></td>' +
        '<td title="点击查看刊登预估价"><input lay-verify="required" class="layui-input pointHand" style="color:blueviolet" type="number" onclick="tpl_listReferPrice(' + id + ')" name="priced" value="' + (priced ? priced : '') + '" readonly></td>' +
        '<td><input lay-verify="required" class="layui-input" type="number" name="warningcost" value="' + (warningcost ? warningcost : '') + '"></td>' +

        '<td><input type="checkbox" title="" lay-skin="primary" disabled name="isSale" ' + (isSale == undefined ? '' : (isSale ? 'checked' : '')) + '></td>' +
        // '<td><input type="checkbox" title="" lay-skin="primary" disabled name="isOutOfStock" ' + (isOutOfStock == undefined ? '' : (!isOutOfStock ? 'checked' : '')) + '></td>' +
        '<td><input type="checkbox" title="" lay-skin="primary" disabled name="selfPhotoStatus" ' + (selfPhotoStatus == 4 ? 'checked' : '') + '></td>' +
        '<td><input type="checkbox" title="" lay-skin="primary" disabled name="hasSelfPhotoNeed" ' + (hasSelfPhotoNeed ? 'checked' : '') + '></td>' +
        '<td><input type="checkbox" title="" lay-skin="primary" class="ifSpreadCheckBox_prodTpl" lay-filter="ifSpreadCheckBox_prodTpl" name="ifSpread" ' + (ifSpread ? 'checked' : '') + '></td>' +
        '<td>' + removeStr + '</td></tr>' +
        '<tr  class="imgContains" data-maxImg="12" data-minImg="0" data-imgObjType="3" data-imgId="' + dataId + '">' +
        '<td colspan="13">' +
        '<div>' +
        '<div class="layui-col-xs4">' +
        '<div class="uploadLocalImgBtn" style="margin-bottom:20px;display:inline-block"></div>' +
        '<button class="layui-btn layui-btn-sm ml20 uploadNetImgBtn" type="button">网络图片</button>' +
        '</div>' +
        '<div class="layui-col-xs8 mt05">【<span class="curImgNum">' + (imgList ? imgList.length : 0) + '</span>/12】图片</div>' +
        '<div class="layui-clear"></div>' +
        '</div>' +
        '<div class="mt10" uid="skuAttrImgList">' +
        '<div class="kongImgDivOut" style="display: inline-block;"> <img src="' + ctx + '/static/img/kong.png" style="width:120px;height:120px;border:1px solid #f2f2f2"/> </div>' +
        '<ul class="layui-clear uploadImgUL subTempUl"></ul>' +
        '<div class="nasImgDiv">' +
        '<div>自拍白底图</div>' +
        '<input type="hidden" amazonImgStatus value="' + (amazonImg ? 2 : 0) + '">' +
        '<div class="nasImgBox">' +
        (amazonImg ? '<img class="nasImg" src="' + (tplIVP + amazonImg) + '"></div>' : '') +
        '</div>' +
        '</div>' +
        '</td>' +
        '</tr>'
    $('#goodsList').append(str);

    // 变种图片初始化
    varaintImgInit($('#goodsList [data-imgId=' + dataId + ']'), imgList);
}

// 获取变种sku信息
function getProdSku_template(obj) {
    window.setTimeout(function() {
        var self = $(obj)
        self.next().hide()
        var value = obj.value.trim()
        if (!value) {
            return
        }
        //判断是否改变了值
        var oldValue = self.attr("value");
        if (oldValue == value) {
            showOrHideSaveBtn(true, `保存`)
            return;
        }
        self.attr("value", value);

        var valueArr = value.split('*')
        var num = 1
        if (valueArr.length > 1) {
            num = valueArr[1]
        }
        var data = {
            sSku: valueArr[0],
            tempSSku: value
        }
        var parentTr = self.closest('tr')
        parentTr.find('[name=prodSId]').val('')
        parentTr.find('[name=weight]').val('')
        parentTr.find('[name=priced]').val('')
        parentTr.find('[name=amazonImg]').val('')
        parentTr.next().find('.kongImgDivOut').show()
        parentTr.next().find('.uploadImgUL').html('')

        // 更新nas图片路径
        var nextImgTr = parentTr.next('tr')
        var nasImgDiv = nextImgTr.find('.nasImgDiv')
        nasImgDiv.find('[amazonImgStatus]').val('0')
        nasImgDiv.find('.nasImg').remove()

        $.ajax({
            type: "post",
            url: ctx + "/product/getSProd.html",
            dataType: "json",
            data: data,
            success: function(response) {
                if (response.code == '0000') {
                    var sprod = response.data
                    if (!sprod) {
                        layer.msg(response.msg)
                        return
                    }
                    var prodSInfo = response.data
                    parentTr.find('[name=prodSId]').val(prodSInfo.id)
                    parentTr.find('[name=weight]').val(accAdd(accMul(ifNull(prodSInfo.suttleWeight, 0), num), ifNull(prodSInfo.packWeight, 0)))
                    parentTr.find('[name=priced]').val(accMul(accAdd(ifNull(prodSInfo.purchaseCostPrice, 0), ifNull(prodSInfo.innerPackCost, 0)), num))
                    parentTr.find('[name=isSale]').prop('checked', prodSInfo.isSale)
                    parentTr.find('[name=isOutOfStock]').prop('checked', !prodSInfo.isOutOfStock)
                    parentTr.find('[name=selfPhotoStatus]').prop('checked', prodSInfo.selfPhotoStatus == 4)
                    parentTr.find('[name=hasSelfPhotoNeed]').prop('checked', prodSInfo.hasSelfPhotoNeed)
                    if (prodSInfo.image) {
                        var imageList = [{ url: tplIVP + prodSInfo.image }]
                        // varaintImgInit(parentTr.next(), imageList)   // 2021-06-07 应产品开发的要求。 不自动带出 子商品信息中的图片
                    }
                    if (prodSInfo.amazonImg) {
                        parentTr.find('[name=amazonImg]').val(prodSInfo.amazonImg)
                        nasImgDiv.find('[amazonImgStatus]').val('2')
                        var img = `<img class="nasImg" src="` + (tplIVP + prodSInfo.amazonImg) + `">`
                        nasImgDiv.find('.nasImgBox').append(img)
                    }
                    layui.form.render('checkbox')
                } else {
                    layer.msg(response.msg)
                }
                showOrHideSaveBtn(true, `保存`)
            }
        })
    }, 500)
}

function getNASImgUrl(tempSku) {
    if (!tempSku) {
        return ''
    }
    var valueArr = tempSku.split('*')
    var num = 1
    if (valueArr.length > 1) {
        num = valueArr[1]
    }
    var sSku = valueArr[0]
        // 判断是否有NAS的亚马逊图
    var imgUrl
    if (!tempSku.indexOf("*") || num == 1) {
        imgUrl = tplIVP + sSku + ".jpg"
    } else {
        imgUrl = tplIVP + tempSku + ".jpg"
    }
    return imgUrl
}


//Wish 变种图片添加图片列表
function varaintImgInit(imgContains, imgList) {
    // 设定本地图片上传功能 --
    uploadLocalImg(imgContains)
        // 设定网络图片上传功能 --
    uploadNetImg(imgContains)
        // 初始化图片
    if (imgList && imgList.length > 0) {
        for (var i = 0; i < imgList.length; ++i) {
            proTpl_showImg(imgList[i].url, imgContains, imgList[i].isMust, imgList[i].isClear,imgList[i].isNotSupplier,imgList[i].isWhite,imgList[i].isSelfImg, imgList[i].isSexy,imgList[i].ifSize, i)
        }
    }
    commonSelectAllAndInvert({
        container: $('#shopSonSkuAttr_prod'),
        parentClass: 'selectAllCheckboxes_pdc',
        sonClass: 'amazonChekcbox_prod'
    });
    commonSelectAllAndInvert({
        container: $('#shopSonSkuAttr_prod'),
        parentClass: 'selectAllCheckboxes_notSupplier',
        sonClass: 'notSupplierCheckbox_prod'
    });
};

//添加尺寸方法
function selSize(size) {
    selSizeArr.push(size);
}

/*生成关键词和测试标题处理start*/

//首字母大写
function changeUpCase(str) {
    // str = str.toLocaleLowerCase();
    var newStr = str.replace(/\s[a-z]/g, function($1) {
        return $1.toLocaleUpperCase()
    }).replace(/^[a-z]/, function($1) {
        return $1.toLocaleUpperCase()
    }).replace(/\sOr[^a-zA-Z]|\sAnd[^a-zA-Z]|\sOf[^a-zA-Z]|\sAbout[^a-zA-Z]|\sFor[^a-zA-Z]|\sWith[^a-zA-Z]|\sOn[^a-zA-Z]|\sIn[^a-zA-Z]|\sA[^a-zA-Z]|\sAn[^a-zA-Z]/g, function($1) {
        return $1.toLowerCase()
    });
    return newStr;
};

//生成关键词
function makeKeyword(status) {
    var object = [];
    var origintitle = changeUpCase($('#origintitle').val());
    var keyword = origintitle.split("\n");
    for (var i in keyword) {
        var word = keyword[i].split(" ");
        for (var j in word) {
            if (word[j] !== '') object.push(changeUpCase(word[j]));
        }
    }
    var keys = {};
    for (var i = object.length; i--;) {
        keys[object[i]] = (keys[object[i]] || 0) + 1;
    }
    arr = [];
    var i = 0;
    for (var j in keys) {
        arr[i] = {};
        arr[i].key = j;
        arr[i].val = keys[j];
        i++;
    }

    arr.sort(function(a, b) {
        return b.val - a.val;
    });

    var keywordArr = [];
    for (var i in arr) {
        keywordArr.push(arr[i]['key']);
    }
    var keywordNum = keywordArr.length;
    $('#keywordNum').html(keywordNum);
    var keywordStr = keywordArr.join('\n');
    $('#keyword').val(keywordStr);
};
$('#keyword').blur(function() {
    $(this).val(changeUpCase($(this).val()));
});
//去处textarea每行的首尾空格
function trimtextareaspace(text) {
    var arr = [];
    var tmp = text.split("\n");
    for (var i in tmp) {
        var str = $.trim(tmp[i]);
        arr.push(str);
    }
    var newText = arr.join('\n');
    return newText;
}

//生成测试标题
//打乱数组
function upsetArr(arr) {
    return arr.sort(function() {
        return Math.random() - 0.5
    });
}

function createTestTitle() {
    var specNum, keyWord, appObjects;
    keyWord = formInput('keyword')
    appObjects = procMultiInput("appObject", "|")
    specNum = procMultiInput("specNum", "|")
    if (keyWord.split('\n').length < 10) {
        layer.msg('关键词要大于10个')
        return
    }
    $.ajax({
        type: "post",
        url: ctx + "/prodTpl/genTestTitle.html",
        dataType: "json",
        data: { "specNum": specNum, "keyWord": keyWord, "appObjects": appObjects },
        success: function(returnData) {
            if (returnData.code == "0000") {
                $("#testTitle").val(returnData.data);
            } else {
                layer.msg(returnData.msg);
            }
        },
        error: function() {
            layer.msg("发送请求失败");
        }
    })
}

// 一键应用到wish tags
function addWishTagsBtn(){
  const formDom = $('#addProdTplForm')
  const allKeywords = formDom.find('textarea[name=keyword]').val().split('\n')
  const keywordDom = formDom.find('input[name=tag]')
  const curKeywords = keywordDom.val().split(',')
  allKeywords.forEach(item=>{
    if(!curKeywords.includes(item)){
        curKeywords.push(item)
        formDom.find('input[name=tag]').tagsinput('add',item)
    }
  })
  keywordDom.val(curKeywords.join())
}

function getInputSku(self) {
    let originPskuVal = $(self).val()
    $(self).attr('inPsku',originPskuVal)
}

function getPskuInfo(value, self) {
    let formElme = $('#addProdTplForm')
    if (self) {
        $(self).next().hide()
        // 如果值与原始值相同，则不进行查询
        let originPskuVal = $(self).attr('inPsku')
        let originPsku = originPskuVal || $(self).prop('originPsku')
        // let originId = $(self).prop('originId') 
        if ($(self).val() === originPsku) {
            // formElme.find('[name=id]').val(originId)
            return
        }
    }
    // 清空id  及父SKU 信息
    formElme.find('[name=id]').val('')
    formElme.find('[name=bizzOwner]').val('')
    formElme.find('[name=responsor]').val('')
    formElme.find('[name=cateName]').val('')
    formElme.find('[name=newCateName]').val('')

    let pSku = $(self).val()
    if (!pSku.trim()) {
        return
    }
    oneAjax.post({
        url: ctx + "/prodTpl/getPProd.html",
        data: { "pSku": pSku },
        success: function(returnData) {
            pSkuValid = true;
            if (returnData.code === "0000") {
                prodTpl_initPSku(returnData.data)
                // 渲染子商品作为子模板
                prodTpl_initSubTemplateBySInfo(returnData.data.id);
            } else {
                pSkuValid = false;
                layer.msg(returnData.msg);
            }
        },
        error: function() {
            layer.msg("发送请求失败");
        }
    })
}

function prodTpl_initSubTemplateBySInfo(prodPId) {
    oneAjax.post({
        url: '/preProdDev/getSInfoListByPId',
        contentType: 'application/x-www-form-urlencoded',
        data: { prodPId: prodPId },
        success: function(res) {
            if (res.code === "0000") {
               let prodSInfoList = res.data;
               if (!prodSInfoList || !prodSInfoList.length) {
                   return
               }
                // 渲染子模板
                let varaints = {}
                let varaint
                let variantId
                let originOne
                for (let i = 0; i < prodSInfoList.length; ++i) {
                    varaint = {}
                    originOne = prodSInfoList[i]
                    variantId = 'variantId_' + originOne.id
                    varaint.prodSId = originOne.id
                    varaint.sSku = originOne.sSku
                    varaint.color = ''
                    varaint.size = ''
                    varaint.style = ''

                    varaint.weight = originOne.suttleWeight + originOne.packWeight
                    varaint.priced = originOne.purchaseCostPrice + originOne.innerPackCost
                    varaint.isSale = originOne.isSale
                    varaint.isOutOfStock = false
                    varaint.selfPhotoStatus = originOne.selfPhotoStatus
                    varaint.amazonImg = originOne.amazonImg
                    varaint.hasSelfPhotoNeed = originOne.hasSelfPhotoNeed
                    varaint.ifSpread = originOne.ifSpread
                    varaint.imgList = []
                    varaint.ifOld = 'false'
                    varaints[variantId] = varaint
                }
                console.log(varaints)
                //复现变体数据
                setVaraint(varaints, 1,'prodSId')
            }
        },
        error: function() {
            layer.msg("发送请求失败");
        }
    })
}

function prodTpl_initPSku(prodPInfo) {
    let formElme = $('#addProdTplForm')
    formElme.find("[name=bizzOwner]").val(prodPInfo.bizzOwner);
    formElme.find("[name=responsor]").val(prodPInfo.responsor);
    formElme.find("[name=id]").val(prodPInfo.id);
    formElme.find("[name=enTitle]").val(prodPInfo.enTitle);//ztt-新增
    if (prodPInfo.prodPInfoCateOaDTO) {
        formElme.find("[name=newCateName]").val(prodPInfo.prodPInfoCateOaDTO.cateTreeName);

    }
    $("#tplCate").val(prodPInfo.prodCate.cateCnName);
    $("#cateId").val(prodPInfo.cateId);
    formElme.find("[name=bizzOwner]").attr("disabled", "disabled");
    formElme.find("[name=responsor]").attr("disabled", "disabled");

    if (prodPInfo.supplierVedio) {
        $('#producttpl_supplierVedioA').removeClass('layui-btn-disabled')
        $('#producttpl_supplierVedioA').attr('href',prodPInfo.supplierVedio)
    } else {
        $('#producttpl_supplierVedioA').addClass('layui-btn-disabled')
    }

}


function bindToWishImgBtn(id) {
    var layer = layui.layer
        // 绑定发送wish主图需求
    $('#needWishImgBtn').on('click', function() {
        var Confirmindex = layer.confirm('确认生成wish主图需求？', { btn: ['确认', '取消'] }, function() {
            var data = {
                wishImgNeedRemark: $('#wishImgNeedRemark_prodtpl').val() || null,
                id: id
            }
            loading.show()
            $.ajax({
                type: 'post',
                url: ctx + '/prodTpl/generateWishImgNeed.html',
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: 'json',
                success: function(res) {
                    loading.hide()
                    if (res.code == '0000') {
                        layer.msg('生成wish需求成功')
                        $('#wishImgStatus_prodTpl').prop('checked', res.data > 0)
                        layui.form.render('checkbox')
                    } else {
                        layer.msg(res.msg)
                    }
                }
            })
            layer.close(Confirmindex);
        })


    })
}

//提交关联sku或开发备注
function submitData(id, relatedSku, devNote) {
    $.ajax({
        type: "post",
        url: ctx + "/prodTpl/addNoteOrRelSku.html",
        dataType: "json",
        data: {
            id: id,
            devNote: devNote,
            relatedSku: relatedSku
        },
        success: function(returnData) {
            layer.close(layer.index);
            layer.msg(returnData.msg);
        },
    });
}



//创建颜色和尺寸数组，创建一个商品列表的对象
var selColorArr = [],
    sizeType = "",
    selSizeArr = [];
//定义一个新增尺寸的数组
var newSizeData = [];
//goodsList里移除Btn样式及点击事件

//goodsList里移除Btn样式及点击事件
function goodsRemove(ipt) {
    var id = $(ipt).closest('tr');
    var picTr = $(id).next('tr');
    $(id).remove();
    $(picTr).remove();
    //得到删除tr的colorId及sizeId
    var color = $(id).find('td[name="color"]').html(),
        size = $(id).find('td[name="size"]').html(),
        colorTd = $('#goodsList').find('td[name="color"]'),
        sizeTd = $('#goodsList').find('td[name="size"]'),
        colorTdArr = [],
        sizeTdArr = [];
    for (var i = 0; i < colorTd.length; i++) {
        colorTdArr.push(decodeURI($(colorTd[i]).html()));
    }
    for (var j = 0; j < sizeTd.length; j++) {
        sizeTdArr.push(decodeURI($(sizeTd[j]).html()));
    }
    //新色删除完以后数组及checkbox处理
    if ($.inArray(decodeURI(color), colorTdArr) == '-1') {
        var colorId = decodeURI(color.toLowerCase().replace(/ /g, ""));
        $('#productTpl_Color').find('input[type="checkbox"]').each(function() {
            if ($(this).val() == colorId) {
                this.checked = false;
                arrDel(selColorArr, colorId);
            }
        });
    }
    if ($.inArray(decodeURI(size), sizeTdArr) == '-1') {
        var sizeId = decodeURI(size);
        $('#sizeAdd').find('input[type="checkbox"]').each(function() {
            if ($(this).val() == sizeId) {
                this.checked = false;
                arrDel(selSizeArr, sizeId);
            }
        });
    }
}

//全选或全不选
function checkedOrNot() {
    var $cbAll = $('#tpl_cbAll'),
        $cb = $('#tplListTbody').find(':checkbox'),
        allLen = $cb.length;
    $cbAll.prop('checked', false);
    $cbAll.click(function() {
        var isChecked = $cbAll.prop('checked'); //先判断当前的复选框 状态
        if (isChecked) {
            $cb.prop('checked', true);
        } else {
            $cb.prop('checked', false);
        }
    });
    $cb.click(function() {
        var checkedLen = $('#tplListTbody').find(':checked').length; //所有被选中的复选框的长度
        if (allLen == checkedLen) {
            $cbAll.prop('checked', true);
        } else {
            $cbAll.prop('checked', false);
        }
    });
}

function setRelSku(t) {
    var id = $(t).attr('dataid');
    var relSku_old = $(t).prev('span').text();
    layer.open({
        type: 1,
        title: '关联SKU',
        area: ["500px", "200px"],
        btn: ["保存", "取消"],
        content: '<div style="padding:20px"><input type="text"  class="layui-input" value="' + relSku_old + '"></div>',
        yes: function(index, layero) {
            var relatedSku = $(layero).find("input").val();
            submitData(id, relatedSku, null);
            $(t).prev('span').text(relatedSku);
            //pageQuery();
        },
    });
}

function getStockLocationCn(stockLocation) {
    switch (stockLocation) {
        case 0:
            return '全部'
        case 1:
            return '国内仓'
        case 2:
            return '海外仓'
    }
}

function showProhibitList(self, dataList) {
    var layer = layui.layer,
        table = layui.table
    var oldId = self.getAttribute('data-tipId')
    if (oldId) {
        layer.close(oldId)
    }
    dataList = dataList || []

    var tipsIndex = layer.open({
        type: 4,
        shade: 0,
        area: '950px',
        tips: [1, 'rgba(5,5,5,0.4)'],
        isOutAnim: false,
        content: [$('#prohibitDetailPop_producttpl').html(), self], //数组第二项即吸附元素选择器或者DOM
        success: function(layero,index) {
            $('.layui-layer-TipsL').css('transform','rotate(-90deg)')
            $('.layui-layer-TipsL').css('display','none')
            $('.layui-layer-setwin').css('display','none')
            table.render({
                elem: "#prohibitDetailPop_productTable",
                id: "prohibitDetailPop_productTable",
                data: dataList,
                limit:20,
                // height: '550px',
                cols: [
                    [
                        {type: 'numbers'},
                        { field: "platCode", title: "平台", width: 100 },
                        { field: "salesSite", title: "站点", width: 100 },
                        { title: "仓库", templet: '<div>{{getStockLocationCn(d.stockLocation)}}</div>', width: 100 },
                        { title: "禁售原因", templet: '<div>{{(d.ifFixedInable ? ((d.fixedInableMsg || `手动禁售`) + d.lisintgInableMsg)  : d.lisintgInableMsg)}}<span style="cursor:pointer;color: blue" onclick="linkToProhibit(this)">{{d.inableConfIds}}</span></div>' },
                    ],
                ],
                page: false,
            });
            var top = layero.offset().top;  // 提示框距离顶部的距离
            var height = $('.layui-layer-tips').height();  // 提示框的高度
            var winHeight = $(window).height();  // 窗口的高度
            var bottomHeight = winHeight - top;  // 当前位置到底部的高度
        
            if (height > bottomHeight) {
                layero.addClass('layui-layer-tips2');  // 切换提示框位置
            } 
        }
    });
    self.setAttribute('data-tipId', tipsIndex)
}

// 跳转到禁售详情
function linkToProhibit(self) {
    let idsStr = $(self).html()
    const ids = idsStr.replace(/\(/g, "").replace(/\)/g, ",").slice(0, -1);
    // sessionStorage.setItem('inableConfIds', ids);
    window.parent.postMessage({name: 'commoditytemplateprohibitconf', 'inableConfIds': ids},'*');
}

function setDevNote(t) {
    var id = $(t).attr('dataid');
    //var devNote_old = $(t).attr('dev-note');
    var devNote_old = $(t).prev('div').find('div').text();
    layer.open({
        type: 1,
        title: '修改开发备注',
        area: ["500px", "300px"],
        btn: ["保存", "取消"],
        content: '<div style="padding:20px"><textarea id="tpl_devNote" class="layui-textarea">' + devNote_old + '</textarea></div>',
        yes: function(index, layero) {
            var devNote = $(layero).find("textarea").val();
            submitData(id, null, devNote);
            $(t).prev('div').find('div').text(devNote);
            if ($(t).prev('div').find('div').height() > 235) {
                var $length = $(t).prev('div').find('.prodtpl_expand').length;
                if ($length > 0) {

                } else {
                    var expandStr = `<p class="prodtpl_expand"><b style="cursor:pointer;color:#428bca;"  class="prodtplDetail_expand_single">+展开</b></p>`;
                    $(t).prev('div').append(expandStr);
                }
            } else {
                $(t).prev('div').find('.prodtpl_expand').remove();
            }
            //pageQuery();
        },
        end: function() {
            $("#tpl_devNote").val("");
        }
    });
}

let prohibitProdPId = ''
let prohibitProdPSku = ''
function setProhibitPlat(self) {
    let prodPId = prohibitProdPId = $(self).attr('dataid');
    prohibitProdPSku = $(self).attr('datapsku');
    let layIndex = layer.open({
        type: 1,
        title: `设置固定父SKU禁售 - ` + prohibitProdPSku,
        area: ["70%", "600px"],
        btn: ["关闭"],
        content: $('#prohibitPlat_layer').html(),
        success: function() {
            queryFixedUnListAbleByProdPId(prodPId)
            getPlatSite();
            layui.form.render()
        },
        yes: function(index, layero) {
            layer.close(layIndex)
        }
    });
}

// 获取平台和站点枚举
let prohibitPlatSite = []
function getPlatSite() {
    $.ajax({
        type: 'post',
        url: ctx + "/prohibit/getAllPlatCodeAndSite",
        type: 'post',
        dataType: "json",
        success: function(returnData) {
            if (returnData.code == "0000") {
                // 填充平台数据
                let data = returnData.data || []
                prohibitPlatSite = data
                appendSelect($('#prohibitPlat_layer_searchForm').find('select[name="platformCode"]'), data, 'name', 'name')
                layui.form.render()
                layui.formSelects.render('prohibitPlat_layer_salesSite');

                // 监听平台选择
                layui.form.on('select(prohibitPlat_layer_platformCode)', function(e) {
                    let val = e.value
                    let site = data?.filter(item => {
                        return item.name === val
                    })
                    let siteList = site[0]?.siteList
                    // 填充站点数据
                    appendSelect($('#prohibitPlat_layer_salesSite'), siteList, 'code', 'name')
                    layui.formSelects.render('prohibitPlat_layer_salesSite');
                })
            } else {
                layer.msg(returnData.msg);
            }
        },
        error: function() {
            layer.msg("发送请求失败");
        }
    })
}

// 查询固定禁售PSKU信息
function queryFixedUnListAbleByProdPId(prodPId) {
    prohibitTableRender(prodPId)
}

function prohibitTableRender(prodPId) {
    layui.table.render({
        elem: "#prohibit_layerTable",
        method: 'post',
        url: ctx + "/prohibit/queryFixedUnListAbleByProdPId",
        where: { prodPId: prodPId },
        contentType: 'application/json',
        cols: [
            [
                { field: "platCode", title: "平台", width: 70 },
                { field: "salesSite", title: "站点" },
                { field: "stockLocation", title: "仓库", templet: '#prohibitTable_stockLocation' },
                { field: "fixedInableMsg", title: "备注" },
                {  title: "操作", templet: '#prohibitTable_delete' }
            ],
        ],
        id: "prodprohibittable",
        page: false,
        height: '350px'
    });
}

function getSiteName(list, plat, code) {
    let site = list?.filter(item => {
        return item.name === plat
    })
    let obj = site[0]?.siteList?.find(item => {
        return item.code === code;
    });
    return obj ? obj['name'] : ''
}
function addProhibitInfo() {
    let platCode = $('#prohibitPlat_layer_searchForm').find('[name=platformCode]').val()
    let salesSite = $('#prohibitPlat_layer_searchForm').find('[name=salesSite]').val()
    let stockLocation = $('#prohibitPlat_layer_searchForm').find('[name=stockLocation]').val()
    let fixedInableMsg = $('#prohibitPlat_layer_searchForm').find('[name=fixedInableMsg]').val()
    if (!platCode || !stockLocation) {
        layer.msg('请选择平台和仓库！')
        return false
    }
    let salesSiteList = salesSite?.split(',') || []
    let addInfoList = []
    salesSiteList?.forEach(item => {
        let params = {
            platCode,
            salesSite: '',
            salesSiteId: '',
            stockLocation,
            prodPId: prohibitProdPId,
            prodPSku: prohibitProdPSku,
            fixedInableMsg
        }
        params.salesSiteId = item
        params.salesSite = getSiteName(prohibitPlatSite, platCode, item)
        addInfoList.push(params)
    })
    $.ajax({
        type: 'post',
        url: ctx + "/prohibit/batchAddFixedUnListAblePsku",
        type: 'post',
        dataType: "json",
        data: JSON.stringify(addInfoList),
        contentType: 'application/json',
        success: function(returnData) {
            loading.hide()
            if (returnData.code == "0000") {
                prohibitTableRender(prohibitProdPId)
                layer.msg('新增成功！')
            } else {
                layer.msg(returnData.msg, { time: 3000 });
                prohibitTableRender(prohibitProdPId)
            }
        },
        error: function() {
            loading.hide()
            layer.msg("发送请求失败");
        }
    })
}

// 删除固定父sku搜索数据
function deleteProhibitInfo(id) {
    layer.confirm('是否确认删除？', function(result) {
        if (result) {
            let idList = [id]
            $.ajax({
                type: 'post',
                url: ctx + "/prohibit/removeFixedUnListAblePsku.html",
                type: 'post',
                dataType: "json",
                data: JSON.stringify({ idList }),
                contentType: 'application/json',
                success: function(returnData) {
                    loading.hide()
                    if (returnData.code == "0000") {
                        prohibitTableRender(prohibitProdPId)
                        layer.msg('删除成功！')
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function() {
                    loading.hide()
                    layer.msg("发送请求失败");
                }
            })
        }
    });
}

// 批量更新 同一父元素下面的   符合所传选择器的 input值
function updateAllByselectorOfOneParent(parentSelector, childSelector) {
    var parent = $(parentSelector)
    var children = parent.find(childSelector)
    if (children && children.length > 0) {
        var firstValue = children[0].value
        for (var i = 0; i < children.length; ++i) {
            children[i].value = firstValue
        }
    }
}

function dealMultiInput(fieldVal, field) {
    var fieldValArr = fieldVal.split('|');
    let formEle = $('#addProdTplForm')
    for (var k = 0; k < fieldValArr.length; k++) {
        var inputArr = formEle.find('[name="' + field + '"]');
        if (k < 3) {
            inputArr[k].value = fieldValArr[k];
        }
    }
};

function auditProdPInfo_prodTpl(obj) {
    var autitForm = $(obj).closest('.auditForm_prodtpl')

    var data = {
        id: $("#addProdTplForm [name='id']").val(),
        auditStatus: autitForm.find('[name=auditStatus]').val(),
        auditDesc: autitForm.find('[name=auditDesc]').val()
    }
    if (!data.auditStatus) {
        layer.msg('请选择审核结果')
        return
    }
    if (typeof(data.id) == undefined || data.auditStatus.trim() == '') {
        layer.msg("参数错误!");
        return;
    }
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + "/prodTpl/auditProdPInfo.html",
        type: 'post',
        dataType: "json",
        data: data,
        success: function(returnData) {
            loading.hide()
            if (returnData.code == "0000") {
                layer.closeAll()
                pageQuery_prodTpl(prodTplPage.curr, prodTplPage.limit)
                layer.msg(returnData.msg);
            } else {
                layer.msg(returnData.msg);
            }
        },
        error: function() {
            loading.hide()
            layer.msg("发送请求失败");
        }
    })
}

function searchSku_prodTpl(t, type) {
    var that = t;
    if (!($(t).val().trim())) {
        return
    }
    $.ajax({
        url: ctx + "/product/skuLikeSearch.html",
        type: "post",
        data: { sku: $(t).val(), "type": type },
        success: function(returnData) {
            var data = returnData.data;
            if (t == document.activeElement) { // 判断鼠标是否仍然聚焦于该input , 若未聚焦，则不再显示模糊搜索列表
                //字符串拼接
                var prodStr = '';
                for (var i = 0; i < data.length; i++) {
                    var prod = data[i];
                    if (type == 'psku') {
                        prodStr += '<li id="' + prod.id + '">' + prod.pSku + '</li>';
                    } else {
                        prodStr += '<li id="' + prod.id + '">' + prod.sSku + '</li>';
                    }
                }
                var ul = $(that).next('ul');
                ul.empty();
                ul.append(prodStr);

                //样式设置
                ul.css('display', 'block');
                var lis = $(that).next('ul').find('li');
                lis.css('height', '25px')
                lis.css('lineheight', '25px')
                lis.mouseover(function() {
                    $(this).css({ backgroundColor: '#f8f8f8', cursor: 'pointer' })
                });
                lis.mouseout(function() {
                    $(this).css({ backgroundColor: '', cursor: '' })
                });
                lis.click(function() {
                        $(that).val($(this).text());
                        ul.css('display', 'none');
                        $(that).next('ul').empty();
                    })
                    //判断input是否为空
                if ($(that).val() == '') {
                    $(that).next('ul').empty();
                };
            }
        }
    })
}

function searchSkuByStoreSku() {
    var storeSku = $('#storeSku_prodTpl').val().trim()
    if (!storeSku) {
        return
    }
    if (storeSku.indexOf('/') > 0) {
        storeSku = storeSku.substring(0, storeSku.indexOf('/'))
    }
    $.ajax({
        url: ctx + "/prodTpl/getSkuByStoreSku.html",
        type: "post",
        dataType: 'json',
        data: { storeSku: storeSku },
        success: function(res) {
            if (res.code == '0000') {
                var map = res.data
                if (map) {
                    var skuList = []
                    var unfoundStoreSku = [] // 未找到映射的店铺sku
                    var foundStoreSkuJson = {}  // 已找到映射的店铺sku 的Map
                    if (map.skuType == 'sSku') {
                        var unfoundStoreSku = []
                        for (var i = 0; i < map.skuList.length; ++i) {
                            skuList.push(map.skuList[i].sSku)
                            foundStoreSkuJson[map.skuList[i].storeSku] = map.skuList[i].sSku
                        }
                    } else {
                        for (var i = 0; i < map.skuList.length; ++i) {
                            skuList.push(map.skuList[i].prod_p_sku)
                            foundStoreSkuJson[map.skuList[i].store_p_sku] = map.skuList[i].prod_p_sku
                        }
                    }
                    var skuStr = skuList.join(',')
                    $("#tpl_searchForm [name=searchSKUType]").val(map.skuType)
                    $("#tpl_searchForm [name=searchSKUValue]").val(skuStr)
                    // 找出未能找到映射的 店铺sku
                    storeSku = storeSku.replace(/，/g,',')
                    var storeSkuArr = storeSku.split(',')
                    for(var i = 0; i < storeSkuArr.length; ++i) {
                        if (storeSkuArr[i] && !foundStoreSkuJson[storeSkuArr[i]]) {
                            unfoundStoreSku.push(storeSkuArr[i])
                        }
                    }
                    if (unfoundStoreSku.length > 0) {
                        layer.alert('以下店铺sku未找到映射:' + unfoundStoreSku.join(','))
                    }
                    layui.form.render('select')
                } else {
                    layui.layer.msg('未找到该店铺sku的映射')
                }
            } else {
                layui.layer.msg(res.msg)
            }
        }
    })
}

// 展示模板日志
function getTplLogs(id) {
    if (typeof(id) == undefined) {
        return
    }
    $.ajax({
        type: 'post',
        url: ctx + '/prodTpl/getTplOperLog.html',
        data: { 'pid': id },
        // async: false,
        dataType: 'json',
        success: function(returnData) {
            if (returnData.code != '0000') {
                layer.msg(returnData.msg, { icon: 5 })
            } else {
                var prodLogs = returnData.data
                let trStr = '';
                for (var i in prodLogs) {
                    var tr = '<tr>'
                    prodLogs[i].operDesc = prodLogs[i].operDesc.replace(/\n/g, "<br/>");
                    tr += '<td>' + layui.admin.Format(prodLogs[i].operTime, 'yyyy-MM-dd hh:mm:ss') + '</td><td>' + prodLogs[i].operator + '</td><td>' + prodLogs[i].operDesc + '</td></tr>'
                    trStr += tr;
                }
                $('#tpl_LogTbody').empty().append(trStr);
            }
        },
        error: function() {
            layer.msg('发送请求失败')
        }
    })
}

function checkColorIfValid (self) {
    $(self).attr('ifNotValid', '')
    $(self).removeClass('borderRed')
    if (!$(self).val()) {
        return
    }
    var ifValid = judgeTheColor(self)
    if (ifValid == -1) {
        layui.layer.msg('顔色不合格',{icon:7})
        $(self).attr('ifNotValid', '1')
        $(self).addClass('borderRed')
    }
    var colorVal = $(self).val().trim();
    if (colorVal.length > 30) {
        layui.layer.msg('顔色限制字符数≤30',{icon:7})
        $(self).attr('ifNotValid', '1')
        $(self).addClass('borderRed')
    }
    var value = $(self).val()
    $(self).val(value.trim());
}

function checkStyleIfValid (self) {
    $(self).attr('ifNotValid', '')
    $(self).removeClass('borderRed')
    if (!$(self).val()) {
        return
    }
    var styleVal = $(self).val().trim();
    if (styleVal.length > 30) {
        layui.layer.msg('款式限制字符数≤30',{icon:7})
        $(self).attr('ifNotValid', '1')
        $(self).addClass('borderRed')
    }
    var value = $(self).val()
    $(self).val(value.trim());
}
//动态监听关键词和wishTags
function autoWatchKeyTag() {
    $(document).on("input propertychange", "#keyword", function() {
        var arr = $(this).val().split('\n');
        var newArr = [];
        $.each(arr, function(i, v) {
            if (v != '') {
                newArr.push(v);
            }
        })
        $('#keywordNum').text(newArr.length);
    });
}

function stopBuble(event) {
    event.cancelBubble = true;
    event.stopPropagation();
}

function editTortReason(self,event) {
        // 记录开始编辑时的原始值，用于后续判断是否发起ajax修改
    $(self).find('input').attr('originValue', $(self).find('input').val())
    $(self).find('input').removeClass('disN')
    $(self).find('span').addClass('disN')
    var t = $(self).find('input').val();
    $(self).find('input').val("").focus().val(t);
}


function limitInputOfSize(self) {
    var value = $(self).val()
    value = value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g, '')
    $(self).val(value);
}

/**
 * 不允许点击保存按钮
 */
function showOrHideSaveBtn(ifShow, str) {
    var allBtn = $('a[class^=layui-layer-btn]')
    if (ifShow) {
        for (var i = 0; i < allBtn.length; ++i) {
            if (allBtn[i].innerText.indexOf(str) >= 0) {
                $(allBtn[i]).show()
            }
        }
    } else {
        for (var i = 0; i < allBtn.length; ++i) {
            if (allBtn[i].innerText.indexOf(str) >= 0) {
                $(allBtn[i]).hide()
            }
        }
    }
}

/**
 * sku查询绑定回车事件
 */
$('#storeSku_prodTpl').on('keypress', function(e) {
    var keycode = e.keyCode
    if (keycode == 13) {
        searchSkuByStoreSku();
        return;
    }
})

var salesThis;
var gloabalSalceCountList
let platCodeSort = ['全平台', 'aliexpress', 'ebay', 'ebay虚拟仓', 'shopee', 'lazada', 'tiktok', 'AE全托管', 'FBA', 'amazon直邮']
let platCodeSortAll = ['全平台','aliexpress', 'ebay', 'ebay虚拟仓', 'shopee', 'lazada', 'tiktok', 'AE全托管', 'FBA', 'amazon直邮',
'wish', 'joom', 'walmart', 'mercado', 'fyndiq', 'daraz', 'coupang', 'miravia', 'temu', 'shein自营']

function showSaleCountTab(self,saleCountList) {
    var layer = layui.layer,
        table = layui.table
    salesThis = self;
    var oldId = salesThis.getAttribute('data-tipId')
    if (oldId) {
        layer.close(oldId)
    }
    saleCountList = saleCountList || []
    gloabalSalceCountList = saleCountList

    renderSalesTable(salesThis, saleCountList, platCodeSort)
}

function expandTable(self) {
    let expandText = $(self).text()
    if (expandText === '>') { // 展开
        setSalesTableCol(gloabalSalceCountList, platCodeSortAll, function(col) {
            var layer = layui.layer,
            table = layui.table
            table.render({
                elem: "#saleCountPop_productTable",
                id: "saleCountPop_productTable",
                data: gloabalSalceCountList,
                cols: [
                    col
                ],
                page: false,
            });
        })
        $('.expandIcon').html('<')
    } else {
        let col = setSalesTableCol(gloabalSalceCountList, platCodeSort, function(col) {
            var layer = layui.layer,
            table = layui.table
            table.render({
                elem: "#saleCountPop_productTable",
                id: "saleCountPop_productTable",
                data: gloabalSalceCountList,
                cols: [
                    col
                ],
                page: false,
            });
        })
        $('.expandIcon').html('>')
    }
}

function setSalesTableCol(saleCountList, platCodeList, callback) {
    let col = [
        { field: "countDay", title: "统计天数", width: 70 },
        { title: "统计时间", templet: '<div>{{format(d.countDate,"yyyy-MM-dd")}}</div>', width: 100 },
    ]
    if (saleCountList.length > 0) {
        for (let i = 0; i < platCodeList.length; ++i) {
            let platCode = platCodeList[i]
            col.push({ field: "saleNum_" + platCode, title: platCode, templet: '<div>{{d.platCodeAndSalesMap["'+ platCode +'"] || 0}}</div>' })
        }
    }
    callback && callback(col)
}

function renderSalesTable(salesThis, saleCountList, platCodeList) {
    setSalesTableCol(saleCountList, platCodeList, function(col) {
        var layer = layui.layer,
        table = layui.table
        var tipsIndex = layer.open({
            type: 4,
            shade: 0,
            area: ['1350px', '250px'],
            tips: [1, 'rgba(5,5,5,0.4)'],
            isOutAnim: false,
            content: [$('#saleCountPop_producttpl').html(), salesThis], //数组第二项即吸附元素选择器或者DOM
            success: function() {
                table.render({
                    elem: "#saleCountPop_productTable",
                    id: "saleCountPop_productTable",
                    data: saleCountList,
                    cols: [
                        col
                    ],
                    page: false,
                });
            }
        });
        salesThis.setAttribute('data-tipId', tipsIndex)
    })
}

function prodTpl_reSort() {
    let varieties = getVariety_template(false)
    for (let i = 0; i < varieties.length; ++i) {
        let varaint = varieties[i]
        varaint.imgList = []
        if (varaint.varientImgs) {
            for (let j = 0; j < varaint.varientImgs.length; ++j) {
                varaint.imgList.push({
                    url: varaint.varientImgs[j].name,
                    isMust: varaint.varientImgs[j].isWhite,
                    isNotSupplier: varaint.varientImgs[j].isNotSupplier,
                })
            }
        }
    }
    console.log(varieties)
    setVaraint(varieties,2)
}

function variantStyleSpaceInit() {
    $('.variantStyleVal').keyup(function(e) {
        if (e.keyCode == 13) {
            $('.variantStyleBtn').click()
        }
    })
    $('.variantStyleBtn').click(function() {
        var style = $('.variantStyleVal').val().trim()
        if (!style) {
            return
        }
        var oldStyle = $('.variantStyleBody input:checkbox')
        for (var i = 0; i < oldStyle.length; ++i) {
            if (oldStyle[i].value == style) {
                layui.layer.msg('已有相同的款式')
                return
            }
        }
        $('.variantStyleBody').append(`<div class="fieldBox"><input type="checkbox" name="style" value="` + style + `" title="` + style + `" lay-skin="primary" checked></div>`)
        layui.form.render('checkbox', 'addVariantStyleBox')
    })
}

//开发备注的复制函数
function prodtpl_copyTxt(obj, event) {
    if (event) {
        event.stopPropagation()
    }
    var txt = $(obj).prev('div').text();
    var oInput = document.createElement('input'); //创建一个input元素
    oInput.value = txt;
    $(obj).parents('.prodtpl_developremark').append(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.style.display = 'none';
    layer.msg('复制成功');
    return false;
}

function getWordList (str) {
    if (str === '' || str === undefined) {
        return []
    }
    let findWord = str.match(/\d+.\d+|\w+/g)
    return findWord ? findWord : []
}

function prodtpl_getsearchParam() {
    var searchParam = serializeObject($('#tpl_searchForm'));
    checkNull(searchParam)

    if (searchParam.tortPlat) {
        let platJSON = {}
        var selectList = searchParam.tortPlat.split(',')
        for (let i = 0;i < selectList.length; ++i) {
            let platCode = selectList[i].split('_')[0]
            if (platJSON[platCode]) {
                layer.msg('侵权条件，同一平台不可同时选择侵权和不侵权')
                return
            } else {
                platJSON[platCode] = 1
            }
        }
    }

    // 查询人员设置
    if (searchParam.organize || searchParam.userId) {
        if (searchParam.userId) { // 如果选了人，则只查询这个人的。
            searchParam[searchParam.userType + 'Str'] = searchParam.userId
        } else { // 如果选了部门没选人，则查询整个部门的
            let userIdList = []
            let options = $('#tpl_searchForm').find('[name=userId] option')
            let value
            for (let i = 0; i < options.length; ++i) {
                value = options[i].getAttribute('value')
                if (value) {
                    userIdList.push(parseInt(value))
                }
            }
            searchParam[searchParam.userType + 'Str'] = userIdList.join(',')
        }
    }
    if (searchParam.prodTagType == 2) {
        searchParam.prodAttrExcludedList = $('#tpl_searchForm').find('[name=prodAttrList]').val()
        delete searchParam.prodAttrList
    } else {
        delete searchParam.prodAttrExcludedList
    }
    return searchParam;
}

var pattern
function getPattern(back) {
    oneAjax.post({
        url: '/prodTpl/getTransferSizePattern'
        ,success: function (res) {
            if (res.code === '0000') {
                pattern = res.data
                if (back) {
                    back()
                }
            }
        }
    })
}
function transferSize(self) {
    let text = self.value
    // let regex = /((\d+\.?\d*) *([xX]|[^\w\s\d.]) *)*(\d+\.?\d* *)(cm|CM|mm|MM)(?! *([\/=(（])(\d+\.?\d* *([xX]|[^\w\s\d.]) *)*(\d+\.?\d* *)*(in|inch|\"|\'))/g;
    // let pattern = "((\\d+\\.?\\d*) *([xX]|[\\^\\w\\s\\d.]) *)*(\\d+\\.?\\d* *)(cm|CM|mm|MM)(?! *([\\/=(（])(\\d+\\.?\\d* *([xX]|[\\^\\w\\s\\d.]) *)*(\\d+\\.?\\d* *)(in|inch|\\\"|\\'))";
    let regex = new RegExp(pattern, "g");
    let matches = text.match(regex);
    console.log(matches);
    if (!matches || matches.length === 0) {
        return
    }

    let numRegex = /\d+\.?\d*/g
    let unitRegex = /(cm|CM|mm|MM)/g
    let finalText = text.replace(regex, function(word) {
            let nums = word.match(numRegex);
            if (!nums || nums.length === 0) {
                return
            }
            let unit = word.match(unitRegex)[0]
            let res = word.replace(/\d+\.?\d*/g,'$hp$') // 将所有数字替换成  $hp$。 方便转换英寸后，替换回原位置
            for (let j = 0; j < nums.length; ++j) {
                let aNum = nums[j]
                let inchSize = transferToInch(aNum,unit)
                res = res.replace('$hp$',inchSize)
            }
            res = res.replace(unit,'in')
        return word + "(" + res +")"
    })

    self.value = finalText
}

function transferToInch(originSize,originUnit) {
    switch (originUnit) {
        case "cm":
        case "CM":
            return accDiv(parseFloat(originSize),2.54).toFixed(2)
        case "mm":
        case "MM":
            return accDiv(parseFloat(originSize),25.4).toFixed(2)
    }
}

function transferSizeOfDesc() {
    let prodDescElem = $('#addProdTplForm [name=prodDesc]')[0]
    let fixDescElem = $('#addProdTplForm [name=fixDesc]')[0]
    if (!pattern) {
        getPattern(function () {
            transferSize(prodDescElem)
            transferSize(fixDescElem)
        })
    } else {
        transferSize(prodDescElem)
        transferSize(fixDescElem)
    }
}

function requireGptSplitKeyWord() {
    let text = $('#addProdTplForm [name=originTitle_new]').val()
    if (!text || !text.trim()) {
        layer.msg('请填写竞品标题')
        return
    }
    oneAjax.post({
        url: '/ChatGPT35/splitKeywords',
        data: text,
        success: function (res) {
            if (res.code === '0000') {
                if (!res.data || !res.data.length) {
                    layer.msg('未返回数据')
                    return
                }
                let keywords1 = res.data[0].message.content.split(','),
                    keywords2 = res.data[1]?res.data[1].message.content.replaceAll(',','\n').replaceAll('，','\n'):'';
                $('#prodtpl_splitKeyWordResult1').val(keywords1.join('\n'))
                $('#prodtpl_splitKeyWordResult2').val(keywords2)
                $('#prodtpl_splitKeyWordResultDiv').show()
                // for (let i = 0; i < keywords.length; ++i) {
                //     $('#producttpl_keyword_btn_contains').tagsinput('add',keywords[i]);
                // }
                // $('#producttpl_keyword_btn_containsblock').show()
            }
        }
    })
}
// 翻译
function translateGptSplitKeyWord() {
    let text = $('#prodtpl_splitKeyWordResult1').val()
    if (!text || !text.trim()) {
        layer.msg('请填写需要翻译的信息')
        return
    }
    oneAjax.post({
        url: '/ChatGPT35/transactionContent',
        data: text,
        success: function (res) {
            if (res.code === '0000') {
                if (!res.data || !res.data.length) {
                    layer.msg('未返回数据')
                    return
                }
                let keywords2 = res.data[0].message.content.replaceAll(',','\n').replaceAll('，','\n');
                $('#prodtpl_splitKeyWordResult2').val(keywords2)
                $('#prodtpl_splitKeyWordResultDiv').show()
            }
        }
    })
}
function getKeywordFromLi(type,split) {
    if (!split) {
        split = ','
    }
    let textArea = $('.keywordContain[name='+ type +'] .keywordInp')
    let words = textArea.val().trim().split('\n')
    if (!words || !words.length) {
        return {keyword: '', num: 0, repeat: ''}
    }
    let arr = []
    let map = {}
    let repeat = []
    for (let i = 0; i < words.length; ++i) {
        let content = words[i].trim()
        if (!content) {
            continue
        }
        if (map[content]) {
            repeat.push(content)
            continue
        }
        map[content] = true
        arr.push(content)
    }
    return {keyword: arr.join(split), num: arr.length, repeat: repeat.join(',')}
}

function installTortData(data) {
    let tortTable = []
    let tortMap = {}
    if (data.prodTortInfoList) {
        for (let i = 0; i < data.prodTortInfoList.length; ++i) {
            tortMap[data.prodTortInfoList[i].platCode] = data.prodTortInfoList[i]
        }
    }
    for (let i = 0; i < tortPlatArr.length; ++i) {
        let platCode = tortPlatArr[i]
        let tortInfo = tortMap[platCode]
        tortTable.push({
            prodPId: data.id
            , platCode: platCode
            , ifTort: tortInfo && tortInfo.ifTort ? tortInfo.ifTort : false
            , tortReason: tortInfo && tortInfo.tortReason ? tortInfo.tortReason : ""
            , saleRemark: tortInfo && tortInfo.saleRemark ? tortInfo.saleRemark : ""
        })
    }
    return tortTable;
}
//设置模板侵权状况
function sendTort(Adata) {
    let list = Adata.prodTortInfoList
    for (let i = 0; i < list.length; ++i) {
        let one = list[i]
        if (one.ifTort && !one.tortReason) {
            layui.layer.msg('设置侵权，请先填写侵权备注')
            return false
        }
    }
    oneAjax.post({
        type: "post",
        url: ctx + "/prodTpl/setPlatTort",
        dataType: "json",
        data: Adata,
        success: function(returnData) {
            if (returnData.code === '0000') {
                hasChangeTortInfo = true
                layer.msg("设置成功");
            } else {
                layer.msg(returnData.msg);
            }
        },
    });
    return true
}