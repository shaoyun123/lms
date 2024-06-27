var pskuDetail, pageQuery_prodTpl, tplAuditLog, tpl_listReferPrice;
var pSkuValid = true;

layui.use(['admin', 'form', 'table', 'laydate', 'upload', 'formSelects'], function() {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        upload = layui.upload,
        laypage = layui.laypage,
        formSelects = layui.formSelects,
        form = layui.form;
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    formSelects.render('logisAttrStr');
    formSelects.render('bizzOwnerIdList_producttpl');
    formSelects.render('devTypes_producttpl');
    formSelects.data('tortPlat', 'local', {
        arr: [
            { "name": "wish侵权", "value": 0 },
            { "name": "wish不侵权", "value": 1 },
            { "name": "ebay侵权", "value": 2 },
            { "name": "ebay不侵权", "value": 3 },
            { "name": "smt侵权", "value": 4 },
            { "name": "smt不侵权", "value": 5 },
            { "name": "joom侵权", "value": 6 },
            { "name": "joom不侵权", "value": 7 },
            { "name": "amazon侵权", "value": 8 },
            { "name": "amazon不侵权", "value": 9 },
            { "name": "shopee侵权", "value": 10 },
            { "name": "shopee不侵权", "value": 11 },
            { "name": "lazada侵权", "value": 12 },
            { "name": "lazada不侵权", "value": 13 }
        ]
    })
    // 时间渲染
    laydate.render({
        elem: '#producttplTimeVal',
        range: true
    })
    //初始化表格参数
    var prodTplPage = {}
    prodTplPage.curr = 1
    prodTplPage.limit = 50
    prodTplPage.count = 0;

    // 初始化  选择条件form 种的 自定义选择输入框
    initHpSelect('#tpl_searchForm')

    //计算表格所占高度
    function table_height() {
        var bodyheight = $(window).height();
        // var cardheight1 =  $("#LAY_app_body").find('.layui-card').eq(0).outerHeight();
        var cardheight2 = $("#LAY_app_body").find('.layui-card').eq(1).children('.layui-card-header').outerHeight();
        return bodyheight - cardheight2 - 210;
    }

    // 表格渲染
    pageQuery_prodTpl = function(pageNum, limit) {
        var tplSearchData = serializeObject($('#tpl_searchForm'));
        checkNull(tplSearchData)
        // 检查侵权互斥
        var mutexArr = [
            ['0', '1'],
            ['2', '3'],
            ['4', '5'],
            ['6', '7'],
            ['8', '9'],
            ['10', '11'],
            ['12', '13']
        ]
        if (tplSearchData.tortPlat) {
            var selectList = tplSearchData.tortPlat.split(',')
            if (!checkNotBoth(selectList, mutexArr)) {
                layer.msg('侵权条件，同一平台不可同时选择侵权和不侵权')
                return
            }
        }
        tplSearchData.page = pageNum;
        tplSearchData.limit = limit;
        loading.show();
        $('#tplListTbody').html("");
        $.ajax({
            type: "post",
            url: ctx + '/prodTpl/getProds.html',
            data: tplSearchData,
            success: function(returnData) {
                loading.hide();
                //数据渲染表格
                var returnData = returnData
                    data = returnData.data;
                for (var i in data) {
                    data[i].createTime = data[i].tplCreateTime ? Format(new Date(data[i].tplCreateTime), 'yyyy-MM-dd hh:mm:ss') : Format(new Date(data[i].createTime), 'yyyy-MM-dd hh:mm:ss')
                    if (data[i].auditTime) {
                        data[i].auditTime = Format(new Date(data[i].auditTime), 'yyyy-MM-dd hh:mm:ss')
                    }
                }
                $("#tplNum").html(returnData.count);
                // 处理禁售数据
                var Adata
                for (let k = 0; k < data.length; ++k) {
                    Adata = data[k]
                    if (Adata.prodProhibitMappingList && Adata.prodProhibitMappingList.length > 0) {
                        var prohibitPlatJSON = {}
                        for (let i = 0; i < Adata.prodProhibitMappingList.length; ++i) {
                            if (!prohibitPlatJSON[Adata.prodProhibitMappingList[i].platCode]) {
                                prohibitPlatJSON[Adata.prodProhibitMappingList[i].platCode] = []
                            }
                            prohibitPlatJSON[Adata.prodProhibitMappingList[i].platCode].push(Adata.prodProhibitMappingList[i])
                        }
                        var prohibitPlatArr = []
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
                var logisAliaList, alia, salecountList
                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        logisAliaList = []
                        if (data[i].logisAttrList != undefined && data[i].logisAttrList != '') {
                            var logisAttrArr = data[i].logisAttrList.split(',')
                            for (var j = 0; j < logisAttrArr.length; ++j) {
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

                        salecountList = data[i].prodSaleCountList
                        if (salecountList && salecountList.length > 0) {
                            for (var j = 0; j < salecountList.length; j++) {
                                switch (salecountList[j].countDays) {
                                    case 7:
                                        data[i].sevenSales = salecountList[j].saleNum || 0
                                        break
                                    case 15:
                                        data[i].fifteenSales = salecountList[j].saleNum || 0
                                        break
                                    case 30:
                                        data[i].thirtySales = salecountList[j].saleNum || 0
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

                var tbData = {
                        data: data
                    },
                    html = template('tplListTbody_tpl', tbData);
                $('#tplListTbody').html(html);
                var tplListTrs = $('#tplListTbody>tr');
                for (var x = 0; x < tplListTrs.length; x++) {
                    var $item = $(tplListTrs[x]).find('.prodtpl_developremark>div');
                    if ($item.height() > 235) {
                        var expandStr = `<p class="prodtpl_expand"><b style="cursor:pointer;color:#428bca;"  class="prodtplDetail_expand_single">+展开</b></p>`;
                        $item.parent().append(expandStr);
                    }
                }

                //表头固定处理
                var theadObj = {
                    h: 157,
                    th: $('.producttplTable_head').eq(0),
                    dv1: $('#producttplCard').find('.layui-card-header')
                }
                theadObj.th.css({ 'position': 'fixed', 'top': 90, 'left': 90, 'right': '2%', 'zIndex': 999 })
                $('.layadmin-tabsbody-item.layui-show').scroll(function() {
                    var t = $(this).scrollTop();
                    if (t > theadObj.h) {
                        theadObj.dv1.css({ 'position': 'fixed', 'top': 48, 'left': 80, 'right': '2%', 'background': '#fff', 'zIndex': 999 });
                        theadObj.th.removeClass('disN')
                    } else {
                        theadObj.dv1.css({ 'position': 'static', 'top': 0, 'left': 0, 'right': 0 })
                        theadObj.th.addClass('disN')
                    }
                })
                theadHandle().fixTh({ id: '#producttplCard', dv2: '', h: 157.25, i: 38 })
                imageLazyload();
                // console.log('.producttplTable_head table',$('.producttplTable_head table'))
                $('.producttplTable_head table,.producttplTable_body table').css({ 'width': '100%', 'margin': 0, 'table-layout': 'fixed' });
                checkedOrNot();
                laypage.render({
                    elem: 'tpl_pagination',
                    count: returnData.count,
                    curr: prodTplPage.curr,
                    limit: prodTplPage.limit,
                    limits: [50, 500, 1000],
                    layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                    jump: function(obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        prodTplPage.curr = obj.curr;
                        prodTplPage.limit = obj.limit;
                        //首次不执行
                        if (!first) {
                            pageQuery_prodTpl(obj.curr, obj.limit)
                        }
                        $('#tplListTbody').on('click', '.prodtpl_expand', function() {
                            var $par = $(this).parent();
                            var $txt = $(this).find('.prodtplDetail_expand_single').html();
                            if ($txt == '+展开') {
                                $par.removeClass('developremarkHidden').addClass('developremarkShow');
                                $(this).find('.prodtplDetail_expand_single').html('-收缩');
                            } else {
                                $par.addClass('developremarkHidden').removeClass('developremarkShow');
                                $(this).find('.prodtplDetail_expand_single').html('+展开');
                            }

                        })
                    }
                }); //laypage结束
            },
            error: function() {
                loading.hide();
            }
        }); //ajax结束
    }

    // 搜索按鈕点击
    $("#tpl_searchBtn").click(function() {
        prodTplPage.curr = 1;
        if ($("#product_optimize_parent_sku_hidden").length == 1) {
            $("#product_tpl_searchSKU_input").val($("#product_optimize_parent_sku_hidden").val());
            $("#product_optimize_parent_sku_hidden").remove();
        }
        pageQuery_prodTpl(prodTplPage.curr, prodTplPage.limit);
    });
    //初始化页面时搜索
    // $("#tpl_searchBtn").trigger("click");

    function initSalesSite_prodTpl(platCode) {
        $('#tpl_searchForm #pt_prohibitSalesSiteId').html($('#salesSite_searchForm_' + platCode).html())
        layui.formSelects.render("prohibitSalesSiteId")
    }
    // 禁售站点选择
    form.on('select(prohibitPlat_prodTpl)', function(data) {
        var platCode = data.value
        initSalesSite_prodTpl(platCode)
    });


    // 详情点击事件
    pskuDetail = function(id, auditStatus) { // ifCheck  是否有审核权
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
                    submit_template();
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
                    submit_template(1);
                    return false
                }
                btn2Fun = function() {
                    if (!checkNotNull('#addProdTplForm')) {
                        return false
                    }
                    submit_template();
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
            content: $('#gatherhotTplAddLayer').html(),
            area: ['1265px', '80%'],
            // shade: 0,
            success: function(layero) {
                layuiOpenPop = true
                // 初始化必填项
                initNotNull()
                // 隐藏 颜色、尺寸、原始标题等
                $('.ifDetailHidden').hide()
                //显示新增变种按钮
                $('.addVariantBtn').show()

                // 设定本地图片上传功能 -- 主图
                // uploadLocalImg($('#mainImgContainsId'))
                // 设定网络图片上传功能 -- 主图
                // uploadNetImg($('#mainImgContainsId'))
                // 设定本地图片上传功能 -- 辅图
                // uploadLocalImg($('#assistImgContainsId'))
                // 设定网络图片上传功能 -- 辅图
                // uploadNetImg($('#assistImgContainsId'))
                // 审核组件
                addAuditFrom(layero)
                if ($('#ifCheck_prodtemp').length > 0) {
                    $('#auditBox_prodTpl').show()
                }
                // 复现数据
                getTplDetail(id);
                form.render('checkbox');
                getTplLogs(id);

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
                })

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

    //关联SKU弹框
    $(".tpl_relateSku").click(function() {
        var id = $(this).attr('dataid');
        layer.open({
            type: 1,
            title: '关联SKU',
            area: ["500px", "200px"],
            btn: ["保存", "取消"],
            content: '<div style="padding:20px"><input type="text"  class="layui-input"></div>',
            yes: function(index, layero) {
                var relatedSku = $(layero).find("input").val();
                submitData(id, relatedSku, null);
                pageQuery_prodTpl();
            },
        });
    })

    //弹出分类框
    $("#tplChooseCate1").click(function() {
        admin.itemCat_select('layer-commodity-template-producttpl', 'LAY-commodity-template-producttpl-hidden', 'tplCateInfo')
    });

    //同时绑定多个日期
    lay('.test-item').each(function() {
        laydate.render({
            elem: this,
            trigger: 'click'
        })
    });

    $('#exportListingStatusBtn_prodTemp').click(function() {
        var searchParam = serializeObject($('#tpl_searchForm'));
        checkNull(searchParam)
        // 检查侵权互斥
        var mutexArr = [
            ['0', '1'],
            ['2', '3'],
            ['4', '5'],
            ['6', '7'],
            ['8', '9'],
            ['10', '11'],
            ['12', '13']
        ]
        if (searchParam.tortPlat) {
            var selectList = searchParam.tortPlat.split(',')
            if (!checkNotBoth(selectList, mutexArr)) {
                layer.msg('侵权条件，同一平台不可同时选择侵权和不侵权')
                return
            }
        }
        var data = serializeObject($('#exportTemplateForm_producttpl'))
        checkNull(searchParam)
        data.searchParam = JSON.stringify(searchParam)

        var Confirmindex = layer.confirm('确认导出符合搜索条件的模板刊登统计信息？', { btn: ['确认', '取消'] }, function() {
            layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
            submitForm(data, ctx + '/prodTpl/exportListingStatus.html')
            layer.close(index);
        })

    })

    //表单重置
    $("#tpl_resetBtn").click(function() {
        $("#tpl_searchForm input[name='cateId']").val('');
        $('#tplCateInfo').html("");
    })
    //新增模板点击事件
    $('#producttplAdd').click(function() {
        var index = layer.open({
            title: '新增模板',
            type: 1, //不加该属性,就会出现[object Object]
            btn: ['新建并发布', '新建', '关闭'],
            id: 'producttplAddSuccess',
            content: $('#gatherhotTplAddLayer').html(),
            area: ['1265px', '80%'],
            // shade: 0,
            success: function() {
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
                // uploadLocalImg($('#mainImgContainsId'))
                // 设定网络图片上传功能 -- 主图
                // uploadNetImg($('#mainImgContainsId'))
                // 设定本地图片上传功能 -- 辅图
                // uploadLocalImg($('#assistImgContainsId'))
                // 设定网络图片上传功能 -- 辅图
                // uploadNetImg($('#assistImgContainsId'))

                //初始显示男装
                showSize('Man');
                // 尺寸类型选择切换
                sizeBtnClick();
                // 款式相关事件
                initStyleEvent();
                form.render('checkbox');
                form.render('select')
                $(".isCreateHidden").hide();

                layui.formSelects.data('tpl_select_joomSens', 'local', { arr: joomSensArray });

                //动态监听数量
                autoWatchKeyTag();
            },
            yes: function(index, layero) {
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
            btn2: function() {
                if (!checkNotNull('#addProdTplForm')) {
                    return false
                }
                if (pSkuValid) {
                    submit_template();
                } else {
                    layer.msg("模板父sku不合格,不能提交");
                }
                return false
            },
            btn3: function() {
                selSizeArr = [];
            },
            end: function() {
                newSizeData.length = 0;
                layuiOpenPop = false
            }
        })

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
                var searchParam = serializeObject($('#tpl_searchForm'));
                checkNull(searchParam)
                // 检查侵权互斥
                var mutexArr = [
                    ['0', '1'],
                    ['2', '3'],
                    ['4', '5'],
                    ['6', '7'],
                    ['8', '9'],
                    ['10', '11'],
                    ['12', '13']
                ]
                if (searchParam.tortPlat) {
                    var selectList = searchParam.tortPlat.split(',')
                    if (!checkNotBoth(selectList, mutexArr)) {
                        layer.msg('侵权条件，同一平台不可同时选择侵权和不侵权')
                        return
                    }
                }
                var data = serializeObject($('#exportTemplateForm_producttpl'))
                checkNull(searchParam)
                data.searchParam = JSON.stringify(searchParam)
                var Confirmindex = layer.confirm('确认导出当前搜索条件下的商品信息？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大 ，需要十几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
                    submitForm(data, ctx + '/prodTpl/exportTemplate.html')
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
        var oldVaraints = {}
        var oldVaraintsTrs = $('#goodsList tr[data-id]') // 参数行
        var oldVaraintsImgTrs = $('#goodsList tr[data-imgId]') // 图片行
        var oldVaraintId
        var q
        var img
        var isMust
        var curTR
        var curImgTR
        if (oldVaraintsTrs && oldVaraintsTrs.length > 0) {
            for (var i = 0; i < oldVaraintsTrs.length; ++i) {
                oldVaraintId = oldVaraintsTrs[i].getAttribute('data-id')
                curTR = $(oldVaraintsTrs[i]) // 当前行的dom对象
                oldVaraints[oldVaraintId] = {
                    id: curTR.find('[name=id]').val(),
                    sku: curTR.find('[name=sku]').val(),
                    ifOld: curTR.find('[name=sku]').attr('ifOld'),
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
                }
                // 模板图片
                oldVaraints[oldVaraintId].imgList = []
                curImgTR = $(oldVaraintsImgTrs[i])
                var imgLis = curImgTR.find('.uploadImgUL li')
                if (imgLis && imgLis.length > 0) {
                    for (q = 0; q < imgLis.length; ++q) {
                        isMust = $(imgLis[q]).find('[name=checkbox]:checked').prop('checked')
                        img = {
                            url: $(imgLis[q]).find('img').attr('src'),
                            isMust: isMust ? 1 : 0
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
        console.log(oldVaraints)
        setVaraint(oldVaraints, 2)
        if (multiSizeAndColorStr) {
            multiSizeAndColorStr = '存在颜色和尺寸重复的变体(尺寸-颜色):' + multiSizeAndColorStr + '。已经自动剔除'
            layer.alert(multiSizeAndColorStr)
        }
    }
}); //layui结束
// 主图模型结构
var imgData_template = {
    img: {
        head: '',
        tpl: '<li><div class="ImgDivOut">' +
            '<label"><input type="hidden" name="mainImg" value="&{url}"/><input type="checkbox" name="checkbox1" lay-skin="primary" title="亚马逊图"/><input type="checkbox" name="checkbox2" lay-skin="primary" title="清晰图"/></label>' +
            '<div class="ImgDivIn">' +
            '<img src="&{url}" alt="" class="imgCss img_show_hide" style="width:150px;height:150px;border:1px solid #f2f2f2" />' +
            '</div>' +
            '<div class="imgDivDown h20 taRight">' +
            // '<a onclick="delImg(this);" href="javascript:void(0);">移除</a></div>' +
            '</div></li>',
        foot: '',
    }
};
//辅图模型结构
var imgData2_template = {
    img: {
        head: '',
        tpl: '<li><div class="ImgDivOut">' +
            '<label"><input type="hidden" name="assisImg" value="&{url}"/><input type="checkbox" name="checkbox1" lay-skin="primary" title="必选图"/><input type="checkbox" name="checkbox2" lay-skin="primary" title="清晰图"/></label>' +
            '<div class="ImgDivIn">' +
            '<img src="&{url}" alt="" class="imgCss img_show_hide" style="width:150px;height:150px;border:1px solid #f2f2f2" />' +
            '</div>' +
            '<div class="imgDivDown h20 taRight">' +
            // '<a onclick="delImg(this);" href="javascript:void(0);">移除</a></div>' +
            '</div></li>',
        foot: '',
    }
};
//wish子sku模型结构
var imgDataWish_template = {
    img: {
        head: '',
        tpl: '<li><div class="ImgDivOut">' +
            '<label"><input type="hidden" name="varImg" value="&{url}"><input type="checkbox" name="checkbox1" lay-skin="primary" title="亚马逊图"></label>' +
            '<div class="ImgDivIn">' +
            '<img src="&{url}" alt="" class="imgCss img_show_hide" style="width:150px;height:150px;border:1px solid #f2f2f2" />' +
            '</div>' +
            '<div class="imgDivDown h20 taRight">' +
            // '<a onclick="delImg(this);" href="javascript:void(0);">移除</a></div>' +
            '</div></li>',
        foot: '',
    }
};

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
        fileSizeLimit: 2048, //默认单位是KB
        buttonText: '本地图片',
        breakPoints: false,
        saveInfoLocal: false,
        showUploadedPercent: true,
        showUploadedSize: true,
        removeTimeout: 500,
        uploader: ctx + "/prodTpl/uploadPic.html",
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
        onUploadStart: function(file) {},
        onUploadSuccess: function(file, data, response) {
            data = $.parseJSON(data);
            if (data != null && data.code == '0000') {
                showImg(data.msg, imgContains, false, false)
            } else {
                layer.msg(data.msg); //这里面的内容不知道写啥,同OA系统
            }
        }
    });
}

// 网络图片下载
// imgContains  图片容器jQuery对象
function uploadNetImg(imgContains) {
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
                for (var i = 0; i < remainNum; i++) {
                    $.ajax({
                        type: "post",
                        url: ctx + "/prodTpl/getOnlinePic.html",
                        data: 'urlString=' + urlArray[i],
                        success: function(data) {
                            if (data) {
                                data = $.parseJSON(data);
                                if (data.code == '0000') {
                                    showImg(data.data, imgContains, false, false);
                                    form.render('checkbox')
                                } else if (data.code == '9999') {
                                    layer.msg(data.msg, { icon: 5 });
                                }
                            } else {
                                layer.msg('图片上传失败!', { icon: 2 })
                            }
                        }
                    });
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
 */
function showImg(url, imgContains, checked1, checked2, index) {
    var imgObjType = imgContains.attr('data-imgObjType')
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
    }
    var div = tpl.replace(/&{url}/g, url);
    imgContains.find('.uploadImgUL').append(div);
    // 设定勾选状态
    if (checked1) {
        imgContains.find('[name=checkbox1]')[index].checked = true
    }
    if (checked2) {
        imgContains.find('[name=checkbox2]')[index].checked = true
    }

    imgContains.find(".kongImgDivOut").hide();
    // 更新当前上传数量
    imgContains.find(".curImgNum").text(imgContains.find('.uploadImgUL li').length)

    var form = layui.form
    form.render('checkbox')
}

// 发送ajax新增模板
function submit_template(auditStatus) {
    var receiveDataObj = {}
    receiveDataObj.id = formInput('id')
    receiveDataObj.pSku = formInput('pSku')
    receiveDataObj.cnTitle = formInput('cnTitle')
    receiveDataObj.enTitle = formInput('enTitle')
    receiveDataObj.cateId = formInput('cateId')
    receiveDataObj.keyword = formInput('keyword')
    receiveDataObj.appObject = procMultiInput("appObject", "|")
    receiveDataObj.specNum = procMultiInput("specNum", "|")
    receiveDataObj.fixDesc = formInput('fixDesc')
    receiveDataObj.tradTitle = formInput('tradTitle')
    receiveDataObj.tradDesc = formInput('tradDesc')
    receiveDataObj.prodDesc = formInput('prodDesc')
    receiveDataObj.tag = formInput('tag')
    receiveDataObj.originTitle = formInput('originTitle')
    // receiveDataObj.selfImgStatus = formInput('selfImgStatus')
    receiveDataObj.mainImages = getImage_template('mainImg')
    receiveDataObj.assistImgs = getImage_template('assisImg')
    receiveDataObj.varients = getVariety_template()
    receiveDataObj.isSupplierOrigiImg = $('#addProdTplForm [name=isSupplierOrigiImg]').prop('checked')
    receiveDataObj.originPsku = $('#addProdTplForm [name=pSku]').prop('originPsku')
    receiveDataObj.originId = $('#addProdTplForm [name=pSku]').prop('originId')
    receiveDataObj.joomSensProd = layui.formSelects.value('tpl_select_joomSens', 'val').join(",");
    receiveDataObj.hasWhiteImg = 0

    // 过滤掉每个关键词前后的空格
    var keywordArr = receiveDataObj.keyword.split('\n')
    for (var i = 0; i < keywordArr.length; ++i) {
        keywordArr[i] = keywordArr[i].trim()
    }
    receiveDataObj.keyword = keywordArr.join('\n')

    if (!receiveDataObj.id) {
        layer.msg('请填写一个有效的父SKU')
        return false
    }
    if (auditStatus) {
        receiveDataObj.auditStatus = auditStatus
    }

    if (auditStatus && receiveDataObj.mainImages.length == 0) {
        layer.msg('请至少选择1张图片作为主图')
        return
    }
    if (receiveDataObj.tag.split(',').length < 10 || receiveDataObj.keyword.split('\n').length < 10) {
        layer.msg('关键词和wish tags都要大于10个')
        return
    }
    if (receiveDataObj.prodDesc.split('\n').length < 5) {
        layer.msg('商品描述要不少于5行')
        return
    }
    if (!receiveDataObj.varients) {
        return
    }
    loading.show()
    $.ajax({
        type: "post",
        url: ctx + "/prodTpl/checkShoppeeTort.html",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(receiveDataObj),
        success: function(returnData) {
            loading.hide()
            returnData += ''
            if (returnData == "true") {
                submitTpl(receiveDataObj);
            } else if (returnData == "false") {
                layer.msg("英文标题,关键词,商品描述是必填项", { icon: 5 });
            } else {
                layer.confirm(returnData, {
                    btn: ['确定', '取消'], //按钮
                    shade: false //不显示遮罩
                }, function(index) {
                    submitTpl(receiveDataObj);
                });
            }
        },
        error: function() {
            loading.hide()
            layer.msg("发送请求失败");
        }
    })

}

function submitTpl(receiveDataObj) {
    loading.show()
    $.ajax({
        type: "post",
        url: ctx + "/prodTpl/addProdTpl.html",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(receiveDataObj),
        success: function(returnData) {
            loading.hide()
            if (returnData.code == "0000") {
                layer.closeAll();
                pageQuery_prodTpl()
                layer.msg("保存成功");
                selSizeArr = []
            } else {
                layer.msg(returnData.msg);
            }
        },
        error: function() {
            loading.hide()
            layer.msg("发送请求失败");
        }
    },'area')
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
            img.isClear = $(imgInps[i]).siblings('[name=checkbox2]').prop('checked');
        } else { //辅图
            img.isMust = $(imgInps[i]).siblings('[name=checkbox1]').prop('checked');
            img.isClear = $(imgInps[i]).siblings('[name=checkbox2]').prop('checked');
        }
        imgs.push(img);
    }

    return imgs;
}

//5. 获取变种数据
function getVariety_template() {
    var layer = layui.layer
    var varients = []
    var varient
    var tdArr
    var sSkuJSON = {} // 用于校验是否有重复的sku
    var variantIdJSON = {} // 用于校验是否有重复的variantId
    var variantId
    var varaintTrs = $("#goodsList").find("tr[data-id]")
    if (!varaintTrs || varaintTrs.length == 0) {
        layer.msg('请输入变体数据')
        return false
    }

    var ifColor = false
    var ifSize = false
    var ifStyle = false

    for (var i = 0; i < varaintTrs.length; ++i) {
        tdArr = $(varaintTrs[i]).children();
        varient = {};
        // varient.id = tdArr.eq(0).find('[name=id]').val().trim();//id
        varient.sSku = tdArr.find('[name=sku]').val().trim(); //sku
        varient.size = tdArr.find('[name=size]').val().trim(); //size
        varient.color = tdArr.find('[name=color]').val().trim(); //color
        varient.style = tdArr.find('[name=style]').val().trim(); //style
        varient.weight = tdArr.find('[name=weight]').val().trim(); //重量
        varient.cost = tdArr.find('[name=priced]').val().trim(); //实际成本
        varient.listingWarnPrice = tdArr.find('[name=warningcost]').val().trim(); //刊登警示价
        // 颜色是否合格
        if (tdArr.eq(2).find('[name=color]').attr('ifNotValid')) {
            layer.msg('存在非法颜色')
            return false
        }

        // 校验sku 是否重复
        if (sSkuJSON[varient.sSku]) {
            layer.msg('变体' + varient.sSku + '重复')
            return false
        } else {
            sSkuJSON[varient.sSku] = true
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
                    layer.msg('多变种模板，任一变种有颜色，其他变种也当有颜色')
                    return false
                }
                if ((ifSize && !varient.size) || (!ifSize && varient.size)) {
                    layer.msg('多变种模板，任一变种有尺寸，其他变种也当有尺寸')
                    return false
                }
                if ((ifStyle && !varient.style) || (!ifStyle && varient.style)) {
                    layer.msg('多变种模板，任一变种有款式，其他变种也当有款式')
                    return false
                }
            }

            // 校验变种数多于1个的，是否颜色和尺寸都为空字符串,且 颜色和尺寸组合的id 不能重复
            variantId = escapeJquery(varient.color + '-' + varient.size + "-" + varient.style).replace(/[&\|\\\*^%$#@\s\/]/g, "")
            if (variantIdJSON[variantId]) {
                layer.msg('存在颜色、尺寸、款式都相同的变种')
                return false
            }
            if (!varient.color && !varient.size && !varient.style) {
                layer.msg('多变种模板，不可颜色、尺寸、款式都为空')
                return false
            }
            variantIdJSON[variantId] = 1
        }
        // 检查是否有nas白底图
        varient.amazonImgStatus = parseInt($(varaintTrs[i]).next().find('[amazonImgStatus]').attr('amazonImgStatus'))

        //处理图片
        var varientImgs = getImgData($(varaintTrs[i]).next())
        varient.varientImgs = varientImgs;
        if (!varient.sSku) {
            layer.msg('存在变体缺少sku，请补充sku或者移除该变体')
            return false
        }

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
        varientImg.name = $(this).find("img").attr('src')
        varientImg.isWhite = $(this).find("input[type='checkbox']").prop('checked')
        varientImgs.push(varientImg)
    });
    return varientImgs
}


//1.右侧固定时间树的锚点定位
function tplLocation(obj) {
    var $id = $(obj).data('id');
    document.getElementById($id).scrollIntoView();
};

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
            newSizeData.push(escape(val));
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
            newSizeData.push(escape(val));
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
        $('#sizeAdd').append('<div class="layui-col-xs4 p06"><label><input type="checkbox" name="' + key + '" checked="true" value="' + escape(size) + '">&nbsp' + size + '  </label></div>');
    }
    //添加尺寸点击事件
    $('.new' + key + 'Size').click(function() {
        var size = ($('#new' + key + 'Size').val());
        $('#new' + key + 'Size').val("");
        sizeComparison(escape(size));
        addSizeHtml(size);
        $(this).addClass("layui-btn-disabled");
        if (key != sizeType) {
            sizeRel = sizeType = key;
            newSizeData = [];
            $('#goodsList').html('');
            newSizeData.push(escape(size));
            selSizeArr = [];
        } else {
            newSizeData.push(escape(size));
        }
        selSize(escape(size));
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
            sizeData[key]["data"][i]["code_size"] = escape(sizeData[key]["data"][i]["size"]);
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
            str += '<div class="layui-col-xs4 p06"><label><input type="checkbox" name="Smartphones" value="' + escape(arr[i]) + '">' + arr[i] + '  </label></div>';
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
var goodsColorData = [{
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
                sku: curTR.find('[name=sku]').val(),
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
            }
            // 模板图片
            oldVaraints[oldVaraintId].imgList = []
            curImgTR = $(oldVaraintsImgTrs[i])
            var imgLis = curImgTR.find('.uploadImgUL li')
            if (imgLis && imgLis.length > 0) {
                for (k = 0; k < imgLis.length; ++k) {
                    isMust = $(imgLis[k]).find('[name=checkbox]:checked').prop('checked')
                    img = {
                        url: $(imgLis[k]).find('img').attr('src'),
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
 */
function setVaraint(varaints, operType) {
    // 清空所有变体
    $('#goodsList').html('')
    for (var key in varaints) {
        addNewVaraint(key, varaints[key].id, varaints[key].prodSId, varaints[key].sku, varaints[key].color, varaints[key].size, varaints[key].style, varaints[key].weight, varaints[key].priced, varaints[key].warningcost, varaints[key].imgList, varaints[key].isSale, varaints[key].isOutOfStock, varaints[key].ifOld, operType, varaints[key].selfPhotoStatus, varaints[key].amazonImg, varaints[key].hasSelfPhotoNeed)
    }
    layui.form.render('checkbox')
}

/** 增加一个变体
 * @param ifOld 是否原数据
 */
function addNewVaraint(dataId, id, prodSId, sku, color, size, style, weight, priced, warningcost, imgList, isSale, isOutOfStock, ifOld, operType, selfPhotoStatus, amazonImg, hasSelfPhotoNeed) {
    var ifUpdateSku = false;
    if ($('#ifUpdateSku_prodtemp').length > 0) {
        ifUpdateSku = true
    }
    var auditStatus = $('#auditStatus_addProdTplForm').val()
    var skuinpStr = ''
    if (ifOld == 'true' && auditStatus == '3' && !ifUpdateSku) {
        skuinpStr = '<input type="text" class="layui-input" name="sku" value="' + (sku ? sku : '') + '" ifOld="' + ifOld + '" readonly>'
    } else {
        skuinpStr = '<input type="text" class="layui-input" onfocus="showOrHideSaveBtn(false,`保存`)" onblur="getProdSku_template(this)"  ifOld="' + ifOld + '" name="sku" value="' + (sku ? sku : '') + '" oninput="searchSku_prodTpl(this,`ssku`)">'
    }
    // 是否可以 移除
    var removeStr = ''
    if (ifOld != 'true' || (operType == 2 && auditStatus != 3)) {
        removeStr = removeBtn
    }

    var str = ''
    str += '<tr data-id="' + dataId + '">' +
        '<td width="150">' +
        '<input type="hidden" class="layui-input" name="prodSId" value="' + (prodSId ? prodSId : '') + '" autocomplete="off">' +
        '<input type hidden name="id" value="' + (id ? id : '') + '"/>' +
        '<input type="hidden" name="amazonImg" value="' + (amazonImg || '') + '">' +
        skuinpStr +
        '<ul class="supplierUl" style="width:100%;border:1px solid #f8f8f8;box-sizing:border-box;position:absolute;z-index:99999;background:#fff;max-height:230px;overflow-y:scroll"></ul>' +
        '</td>' +
        '<td><input name="size" onkeyup="limitInputOfSize(this)" class="layui-input" value="' + decodeURI(size) + '"></td>' +
        '<td ><input name="color" class="layui-input" onblur="checkColorIfValid(this)" value="' + color + '"></td>' +
        '<td><input name="style" onkeyup="limitInputOfSize(this)" class="layui-input" value="' + decodeURI(style) + '"></td>' +
        '<td><input lay-verify="required" class="layui-input" type="number" name="weight" value="' + (weight ? weight : '') + '" readonly></td>' +
        '<td title="点击查看刊登预估价"><input lay-verify="required" class="layui-input pointHand" style="color:blueviolet" type="number" onclick="tpl_listReferPrice(null, this)" name="priced" value="' + (priced ? priced : '') + '" readonly></td>' +
        '<td><input lay-verify="required" class="layui-input" type="number" name="warningcost" value="' + (warningcost ? warningcost : '') + '"></td>' +

        '<td><input type="checkbox" title="" lay-skin="primary" disabled name="isSale" ' + (isSale == undefined ? '' : (isSale ? 'checked' : '')) + '></td>' +
        '<td><input type="checkbox" title="" lay-skin="primary" disabled name="isOutOfStock" ' + (isOutOfStock == undefined ? '' : (!isOutOfStock ? 'checked' : '')) + '></td>' +
        '<td><input type="checkbox" title="" lay-skin="primary" disabled name="selfPhotoStatus" ' + (selfPhotoStatus == 4 ? 'checked' : '') + '></td>' +
        '<td><input type="checkbox" title="" lay-skin="primary" disabled name="hasSelfPhotoNeed" ' + (hasSelfPhotoNeed ? 'checked' : '') + '></td>' +
        '<td>' + removeStr + '</td></tr>' +
        '<tr  class="imgContains" data-maxImg="12" data-minImg="0" data-imgObjType="3" data-imgId="' + dataId + '">' +
        '<td colspan="11">' +
        // '<div>' +
        // '<div class="layui-col-xs4">' +
        // '<div class="uploadLocalImgBtn" style="margin-bottom:20px;display:inline-block"></div>' +
        // '<button class="layui-btn layui-btn-sm ml20 uploadNetImgBtn" type="button">网络图片</button>' +
        // '</div>' +
        '<div class="layui-col-xs8 mt05">【<span class="curImgNum">' + (imgList ? imgList.length : 0) + '</span>/12】图片</div>' +
        '<div class="layui-clear"></div>' +
        '</div>' +
        '<div class="mt10" uid="skuAttrImgList">' +
        '<div class="kongImgDivOut" style="display: inline-block;"> <img src=' + ctx + '"/static/img/kong.png" style="width:120px;height:120px;border:1px solid #f2f2f2"/> </div>' +
        '<ul class="layui-clear uploadImgUL subTempUl"></ul>' +
        '<div class="nasImgDiv">' +
        '<div>NAS亚马逊图</div>' +
        '<input type="hidden" amazonImgStatus="' + (amazonImg ? 2 : 0) + '">' +
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
            showOrHideSaveBtn(true, `保存`);
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
                        varaintImgInit(parentTr.next(), imageList)
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
    // uploadLocalImg(imgContains)
    // 设定网络图片上传功能 --
    // uploadNetImg(imgContains)
    // 初始化图片
    if (imgList && imgList.length > 0) {
        for (var i = 0; i < imgList.length; ++i) {
            showImg(imgList[i].url, imgContains, imgList[i].isMust, imgList[i].isClear, i)
        }
    }
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
    }).replace(/\sOr[^a-zA-Z]|\sAnd[^a-zA-Z]|\sOf[^a-zA-Z]|\sAbout[^a-zA-Z]|\sFor[^a-zA-Z]|\sWith[^a-zA-Z]|\sOn[^a-zA-Z]/g, function($1) {
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

//
// function getPskuInfo(value, url, self) {
//     if (self) {
//         $(self).next().hide()
//         // 如果值与原始值相同，则不进行查询
//         var originPsku = $(self).prop('originPsku')
//         var originId = $(self).prop('originId')
//         if (value == originPsku) {
//             $("#addProdTplForm input[name='id']").val(originId)
//             return
//         }
//
//     }
//     // 清空id  及父SKU 信息
//     $("#addProdTplForm input[name='id']").val('')
//     $("#addProdTplForm input[name='bizzOwner']").val('')
//     $("#addProdTplForm input[name='responsor']").val('')
//     $("#addProdTplForm input[name='cateName']").val('')
//
//     var pSku = value
//     if (!pSku.trim()) {
//         return
//     }
//     $.ajax({
//         type: "post",
//         url: ctx + "/" + url + "/getPProd.html",
//         dataType: "json",
//         data: { "pSku": pSku },
//         success: function(returnData) {
//             pSkuValid = true;
//             if (returnData.code == "0000") {
//                 $("#addProdTplForm input[name='bizzOwner']").val(returnData.data.bizzOwner);
//                 $("#addProdTplForm input[name='responsor']").val(returnData.data.responsor);
//                 $("#addProdTplForm input[name='id']").val(returnData.data.id);
//                 $("#tplCate").val(returnData.data.prodCate.cateCnName);
//                 $("#cateId").val(returnData.data.cateId);
//                 $("#addProdTplForm input[name='bizzOwner'],#cateId").attr("disabled", "disabled");
//                 $("#addProdTplForm input[name='responsor']").attr("disabled", "disabled");
//             } else {
//                 pSkuValid = false;
//                 layer.msg(returnData.msg);
//             }
//         },
//         error: function() {
//             layer.msg("发送请求失败");
//         }
//     })
// }

//获取模板详情
function getTplDetail(id) {
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
            if (returnData.code != "0000") {
                layer.msg(returnData.msg, { icon: 5 });
            } else {
                var obj = returnData.data;
                $.each(obj, function(key) {
                    $('#addProdTplForm' + ' [name="' + key + '"]').val(obj[key]);
                })
                $("#addProdTplForm input[name='bizzOwner']").attr("disabled", "disabled");
                $("#addProdTplForm input[name='responsor']").attr("disabled", "disabled");

                //渲染tagsinput
                $('input[name="tag"]').tagsinput();
                // 保存原始 父sku  及其ID
                $('#addProdTplForm [name=pSku]').prop('originPsku', obj.pSku)
                $('#addProdTplForm [name=pSku]').prop('originId', obj.id)
                // 保存其审核状态  需在渲染变体前进行
                $('#auditStatus_addProdTplForm').val(obj.auditStatus)
                $('#addProdTplForm [name=isSupplierOrigiImg]').prop('checked', obj.isSupplierOrigiImg)

                // 自拍图状态
                switch (obj.selfImgStatus) {
                    case 0:
                        $('#addProdTplForm [name=selfImgStatus]').val('无自拍图');
                        break;
                    case 1:
                        $('#addProdTplForm [name=selfImgStatus]').val('有自拍图');
                        break;
                    case 2:
                        $('#addProdTplForm [name=selfImgStatus]').val('部分有自拍图');
                        break;
                }


                $('#addProdTplForm [name=appObject]').val('');
                $('#addProdTplForm [name=specNum]').val('');
                dealMultiInput(obj.appObject, 'appObject');
                dealMultiInput(obj.specNum, 'specNum');

                //回显joom敏感货
                if (obj.joomSensProd != undefined) {
                    var joomSensProps = obj.joomSensProd.split(',');
                    layui.formSelects.value('tpl_select_joomSens', joomSensProps);
                }
                // 复现主图-辅图
                var mainImgArr = []
                var mainImg
                var originMainImg
                for (var i = 0; i < obj.mainImages.length; ++i) {
                    originMainImg = obj.mainImages[i]
                    mainImg = {}
                    mainImg.url = tplIVP + originMainImg.name
                    mainImg.isMust = originMainImg.isWhite ? 1 : 0
                    mainImg.isClear = originMainImg.isClear ? 1 : 0
                    mainImgArr.push(mainImg)
                }
                var assistImgArr = []
                var assistImg
                var originAssistImg
                for (var i = 0; i < obj.assistImgs.length; ++i) {
                    originAssistImg = obj.assistImgs[i]
                    assistImg = {}
                    assistImg.url = tplIVP + originAssistImg.name
                    assistImg.isMust = originAssistImg.isMust ? 1 : 0
                    assistImg.isClear = originAssistImg.isClear ? 1 : 0
                    assistImgArr.push(assistImg)
                }
                varaintImgInit($('#mainImgContainsId'), mainImgArr)
                varaintImgInit($('#assistImgContainsId'), assistImgArr)

                // 处理变体数据
                var varaints = {}
                var varaint
                var variantId
                var originOne
                for (var i = 0; i < obj.varients.length; ++i) {
                    varaint = {}
                    originOne = obj.varients[i]
                    variantId = escapeJquery(originOne.color + '-' + originOne.size + '-' + originOne.style).replace(/[&\|\\\*^%$#@\s\/]/g, "")
                    varaint.id = originOne.id
                    varaint.prodSId = originOne.prodSId
                    varaint.sku = originOne.sSku
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
                    varaint.imgList = []
                    varaint.ifOld = 'true'
                    if (originOne.varientImgs) {
                        for (var j = 0; j < originOne.varientImgs.length; ++j) {
                            varaint.imgList.push({
                                url: tplIVP + originOne.varientImgs[j].name,
                                isMust: originOne.varientImgs[j].isWhite
                            })
                        }
                    }
                    varaints[variantId] = varaint
                }
                //复现变体数据
                setVaraint(varaints, 2)

                // getPskuInfo(returnData.data.pSku, 'product')

                if (obj.auditStatus == 3) {
                    // 如果审核通过，隐藏变体增删按钮
                    $('.toHiddenWhenAllowed').hide()
                    // 判断有无修改sku 权限
                    if ($('#ifUpdateSku_prodtemp').length > 0) {
                        $('#addProdTplForm [name=pSku]').removeAttr('readonly')
                    } else {
                        // 移除父sku 绑定事件
                        $('#addProdTplForm [name=pSku]').removeAttr('onblur')
                    }
                } else {
                    $('#addProdTplForm [name=pSku]').removeAttr('readonly')
                }
            }
            // 增加wish主图需求
            // var wishImgDiv = $(`<div style="float: right">
            //                         <input id="wishImgStatus_prodTpl" type="checkbox" title="wish主图" disabled lay-skin="primary" ` + (obj.wishImgStatus ? `checked` : ``) + `/>
            //                         <div class="layui-btn layui-btn-primary layui-btn-sm" id="needWishImgBtn">需wish改图</div>
            //                         <input style="width: 150px;float: right; margin-left: 10px" class="layui-input" id="wishImgNeedRemark_prodtpl" placeholder="wish需求备注">
            //                     </div>`)
            // $('.auditForm_prodtpl').append(wishImgDiv)

            bindToWishImgBtn(obj.id)

            //获取初始的长度,赋值给详情
            $('#keywordNum').text($('#keyword').val().split('\n').length);
            $('#prodWishTagsNum').text($('input[name="tag"]').val().split(',').length);
            layui.form.render('select')
            layui.form.render('checkbox')
        },
        error: function() {
            loading.hide()
            layer.msg("发送请求失败");
        }
    })
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
//设置模板侵权状况
function sendTort(t, platCode) {
    if (!platCode) {
        layer.msg("参数错误");
        return;
    }
    var id = $(t).attr('dataid');
    var toStatus = $(t).prop('checked')
    if (toStatus == true) {
        var reason = $(t).closest('td').next().find(".tortReasonText").text()
        if (!reason) {
            layer.msg('请先填写侵权原因')
            $(t).prop('checked', false)
            return
        }
    }
    $.ajax({
        type: "post",
        url: ctx + "/prodTpl/setPlatTort.html",
        dataType: "json",
        data: {
            id: id,
            isTort: $(t).prop('checked'),
            platCode: platCode
        },
        success: function(returnData) {
            if (returnData.code == '0000') {
                layer.msg("设置成功");
            } else {
                layer.msg(returnData.msg);
            }
            //$("#tpl_searchBtn").trigger('click');
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
var removeBtn = '<button type="button" class="layui-btn layui-btn-default layui-btn-xs layui-btn-primary toHiddenWhenAllowed" onclick="goodsRemove(this)" >移除</button>';

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
        colorTdArr.push(escape($(colorTd[i]).html()));
    }
    for (var j = 0; j < sizeTd.length; j++) {
        sizeTdArr.push(escape($(sizeTd[j]).html()));
    }
    //新色删除完以后数组及checkbox处理
    if ($.inArray(escape(color), colorTdArr) == '-1') {
        var colorId = escape(color.toLowerCase().replace(/ /g, ""));
        $('#productTpl_Color').find('input[type="checkbox"]').each(function() {
            if ($(this).val() == colorId) {
                this.checked = false;
                arrDel(selColorArr, colorId);
            }
        });
    }
    if ($.inArray(escape(size), sizeTdArr) == '-1') {
        var sizeId = escape(size);
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

function getProhibitReasonCn(data) {
    return
}

function showProhibitList(self, dataList) {
    var layer = layui.layer,
        table = layui.table
    var oldId = self.getAttribute('data-tipId')
    if (oldId) {
        layer.close(oldId)
    }

    var tipsIndex = layer.open({
        type: 4,
        shade: 0,
        area: ['800px', ''],
        tips: [4, 'rgba(5,5,5,0.4)'],
        isOutAnim: false,
        content: [$('#prohibitDetailPop_producttpl').html(), self], //数组第二项即吸附元素选择器或者DOM
        success: function() {
            table.render({
                elem: "#prohibitDetailPop_productTable",
                id: "prohibitDetailPop_productTable",
                data: dataList,
                cols: [
                    [
                        { field: "platCode", title: "平台", width: 100 },
                        { field: "salesSite", title: "站点", width: 100 },
                        { title: "仓库", templet: '<div>{{getStockLocationCn(d.stockLocation)}}</div>', width: 100 },
                        { title: "禁售原因", templet: '<div>{{(d.ifFixedInable ? ("手动禁售;" + d.lisintgInableMsg)  : d.lisintgInableMsg)}}</div>' },
                    ],
                ],
                page: false,
            });
        }
    });
    self.setAttribute('data-tipId', tipsIndex)
}

function showTip(tip, self) {
    var layer = layui.layer
    var index = layer.tips(tip, self, { tips: [1, 'orange'] })
    $(self).attr('data-tipId', index)
}

function removeTipHot(self) {
    var index = $(self).attr('data-tipId')
    if (index) {
        layui.layer.close(index)
    }
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
    if(fieldVal === undefined || fieldVal === null || fieldVal === ''){
        return;
    }
    var fieldValArr = fieldVal.split('|');
    for (var k = 0; k < fieldValArr.length; k++) {
        var inputArr = $('#addProdTplForm [name="' + field + '"]');
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
                pageQuery_prodTpl()
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
                    if (map.skuType == 'sSku') {
                        for (var i = 0; i < map.skuList.length; ++i) {
                            skuList.push(map.skuList[i].prodSubSku)
                        }
                    } else {
                        for (var i = 0; i < map.skuList.length; ++i) {
                            skuList.push(map.skuList[i].prodPSku)
                        }
                    }

                    var skuStr = skuList.join(',')
                    $("#tpl_searchForm [name=searchSKUType]").val(map.skuType)
                    $("#tpl_searchForm [name=searchSKUValue]").val(skuStr)
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
                for (var i in prodLogs) {
                    var tr = '<tr>'
                    prodLogs[i].operDesc = prodLogs[i].operDesc.replace(/\n/g, "<br/>");
                    tr += '<td>' + layui.admin.Format(prodLogs[i].operTime, 'yyyy-MM-dd hh:mm:ss') + '</td><td>' + prodLogs[i].operator + '</td><td>' + prodLogs[i].operDesc + '</td></tr>'
                    $('#tpl_LogTbody').append(tr)
                }
            }
        },
        error: function() {
            layer.msg('发送请求失败')
        }
    })
}

function checkColorIfValid(self) {
    $(self).attr('ifNotValid', '')
    $(self).removeClass('borderRed')
    if (!$(self).val()) {
        return
    }
    var ifValid = judgeTheColor(self)
    if (ifValid == -1) {
        layui.layer.msg('顔色不合格')
        $(self).attr('ifNotValid', '1')
        $(self).addClass('borderRed')
    }
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

function tortBlur(self) {
    $(self).parent().find('input').addClass('disN')
    $(self).parent().find('span').removeClass('disN')
    var originValue = $(self).attr('originValue')
    var value = $(self).val().trim()
    if (value != originValue) {
        // 判断是否已经勾选侵权。如果已经勾选，则变更值不能为空
        var ifTort = $(self).parent().prev().prop("checked")
        console.log(ifTort)
        if (ifTort == true && !value.trim()) {
            $(self).val(originValue)
            layui.layer.msg('请先取消侵权勾选')
            return
        }
        var data = {
            id: $(self).attr('dataid')
        }
        var name = $(self).attr('name')
        data[name] = value
        var layer = layui.layer
        $.ajax({
            type: 'post',
            url: ctx + '/prodTpl/updateTortReason.html',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify(data),
            success: function(returnData) {
                if (returnData.code == '0000') {
                    $(self).next().text(value)
                    layer.msg('修改成功')
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function() {
                layer.msg('发送请求失败')
                $(self).val(originValue)
            }
        })
    }
}

function limitInputOfSize(self) {
    var value = $(self).val()
    value = value.replace(/[^/&apos;/&quot;\a-\z\A-\Z0-9\u4E00-\u9FA5\[\]\{\}\(\)\-\&\'\.\ ]/g, '')
    $(self).val(value)
}

/**
 * 不允许点击保存按钮
 */
function showOrHideSaveBtn(ifShow, str) {
    console.log(1111)
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

function showSaleCountTabHot(self) {
    const counts = self.getElementsByTagName('p')[0].innerText;
    var saleCountList = [];
    if (counts.indexOf('undefined') === -1){
        saleCountList = JSON.parse(counts);
    }
    var layer = layui.layer,
        table = layui.table;
    var oldId = self.getAttribute('data-tipId');
    if (oldId) {
        layer.close(oldId)
    }

    var tipsIndex = layer.open({
        type: 4,
        shade: 0,
        area: ['750px', '250px'],
        tips: [1, 'rgba(5,5,5,0.4)'],
        isOutAnim: false,
        content: [$('#saleCountPop_producttpl').html(), self], //数组第二项即吸附元素选择器或者DOM
        success: function() {
            table.render({
                elem: "#saleCountPop_productTable",
                id: "saleCountPop_productTable",
                data: saleCountList,
                cols: [
                    [
                        { field: "countDays", title: "统计天数", width: 70 },
                        { field: "saleNum", title: "全平台", templet: '<div>{{d.saleNum || 0}}</div>' },
                        { field: "saleNumEbay", title: "ebay", templet: '<div>{{d.saleNumEbay || 0}}</div>' },
                        { field: "saleNumWish", title: "wish", templet: '<div>{{d.saleNumWish || 0}}</div>' },
                        { field: "saleNumAliexpress", title: "aliexpress", templet: '<div>{{d.saleNumAliexpress || 0}}</div>' },
                        { field: "saleNumShopee", title: "shopee", templet: '<div>{{d.saleNumShopee || 0}}</div>' },
                        { field: "saleNumAmazon", title: "amazon", templet: '<div>{{d.saleNumAmazon || 0}}</div>' },
                        { field: "saleNumJoom", title: "joom", templet: '<div>{{d.saleNumJoom || 0}}</div>' },
                        { field: "saleNumOther", title: "其他", templet: '<div>{{d.saleNumOther || 0}}</div>' },
                        { title: "统计时间", templet: '<div>{{format(d.countDate,"yyyy-MM-dd")}}</div>', width: 100 },
                    ],
                ],
                page: false,
            });
        }
    });
    self.setAttribute('data-tipId', tipsIndex)
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