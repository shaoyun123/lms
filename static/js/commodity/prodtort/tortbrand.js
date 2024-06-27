
layui.use(['admin', 'form', 'table','laydate'], function() {
    var $ = layui.$,
        element = layui.element,
        admin = layui.admin, 
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate;
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    form.render('select');

   //时间渲染
    laydate.render({
        elem: '#creatorTime_tortbrand',
        range: true
    })
    //搜索条件中的类目选择
    alertCateSelect($('#xtreeSearchBtn_tortbrand'),$('#xtreeSearchHidden_tortbrand'),$('#xtreeSearchDiv_tortbrand'))
    // 搜索条件 平台类目联动选择
    form.on('select(plateCode_searchForm)', function(data){
        var platCode = data.value
        console.log(platCode)
        initSalesSite_tortbrand(platCode,'#tb_SearchForm [name=siteCode]', '#tortBrand_salesSite_searchForm_')
    });
    //展示已知数据
    function query(data) {
        var data ={
            cateIdStr : $("#tb_SearchForm [name='cateIdStr']").val(),
            platCode : $("#tb_SearchForm [name='platCode']").val(),
            siteCode : $("#tb_SearchForm [name='siteCode']").val(),
            brand : $("#tb_SearchForm [name='brand']").val(),
            owner : $("#tb_SearchForm [name='owner']").val(),
            status : $("#tb_SearchForm [name='status']").val() != '' ? $("#tb_SearchForm [name='status']").val() == '1' : null,
            ifComplete : $("#tb_SearchForm [name='ifComplete']").val() != '' ? $("#tb_SearchForm [name='ifComplete']").val() == '1' : null,
            checkTypeSearch : $("#tb_SearchForm [name='checkType']").val(),
            creatorId : $("#tb_SearchForm [name='creatorId']").val() ? parseInt($("#tb_SearchForm [name='creatorId']").val()) : null
        }
        if ($("#tb_SearchForm input[name='createTime']").val()) {
            var timeArr = $("#tb_SearchForm [name='createTime']").val().split(' - ')
            data.beginDate = timeArr[0]
            data.endDate = timeArr[1]
        }
        table.render({
            elem: "#tortBrandTable",
            method:'post',
            url: ctx + "/tort/tortBrandPage.html",
            cols: [[
                { field: "brand", title: "品牌",width: 150},
                { title: "适用平台站点", templet: '#platSiteTemp_tortBrand'},
                { title: "不处理平台站点", templet: '#platSiteTemp_tortBrandUn'},
                { field: "cateNames", title: `适用二级类目<b style="cursor:pointer;color:#428bca;" id="tortbrand_expand">（+展开）</b>`, templet: '#tortbrand_cateNames'},
                { field: "owner", title: "品牌拥有者",width: 150},
                { field: "checkType", title: "检测类型",templet: '#checkType_line_tortBrand',width: 100},
                { field: "creator", title: "创建人",width: 80},
                { field: "createTime", title: "创建时间",templet:'#tb_createTime',width: 140 },
                { field: "remark", title: "备注"},
                {title: '操作', width: 300, align: 'center', toolbar: '#tortBrandBar',width: 170}
            ]],
            page:true,
            where:data,
            id:"tortBrandTable",
            limits:[50,100,1000],
            limit:50,
            done: function() {
                countAllStatus(data);
                tortbrandName.expandDetail();
                tortbrandName.expandDetailAll();
            }
        });
    }
    query({status: true})

    function countAllStatus(data){
        data.status = null
        data.ifComplete = null
        $.ajax({
            type: "POST",
            url: ctx + "/tort/countAllStatus.html",
            data: data,
            dataType: "json",
            success: function (returnData) {
                loading.hide()
                if (returnData.code == '0000') {
                    $('#noCompleteNum_tortbrand').text(returnData.data.noCompleteNum)
                    $('#needCheckNum_tortbrand').text(returnData.data.needCheckNum)
                    $('#hadDelNum_tortbrand').text(returnData.data.hadDelNum)
                } else {
                    layer.msg(returnData.msg)
                }
            },
            error: function () {
                layer.msg("服务器繁忙，请稍后再试")
            }
        })
    }

    $("#tb_SearchBtn").click(function () {
        query()
    });
    $("#tb_ResetBtn").click(function () {
        $("#tb_SearchForm")[0].reset();
        $("#tb_SearchForm [name='status']").val(1)
    });

    $("#tb_addBtn").click(function () {
        var index = layer.open({
            type: 1,
            title: '添加侵权品牌',
            area: ['60%', '700px'],
            btn: ['添加','取消'],
            shadeClose: false,
            content: $('#tb_addBrandLayer').html(),
            success: function () {
                layuiOpenPop = true // 禁用 回车搜索功能
                initNotNull('#addOrEditBrandForm_tortbrand')
                form.render('select','addOrEditBrandForm_tortbrand')
                alertCateSelect($('#addOrEditBrandForm_tortbrand #tortbrand_xtreeBtn'),$('#addOrEditBrandForm_tortbrand [name=cateIds]'),$('#addOrEditBrandForm_tortbrand #xtreeDiv'));
                form.on('select(plateCode_componentForm)', function(data){
                    var platCode = data.value
                    initSalesSite_tortbrand(platCode,'#addOrEditBrandForm_tortbrand [name=siteCode]', '#salesSite_componentForm_')
                });
                form.on('select(plateCode_componentFormUn)', function(data){
                    var platCode = data.value
                    initSalesSite_tortbrand(platCode,'#addOrEditBrandForm_tortbrand [name=siteCodeUn]', '#salesSite_componentForm_')
                });
                initAddPlatSite($('#addPlatSite_tortbrand'),$('#platSiteDiv_tortbrandForm'))
                initAddPlatSite($('#addPlatSite_tortbrandUn'),$('#platSiteDiv_tortbrandFormUn'))
            },
            yes: function (index, layero) {
                if (!checkNotNull('#addOrEditBrandForm_tortbrand')) {
                    return
                }
                var Adata = {
                    brand : $("#addOrEditBrandForm_tortbrand [name=brand]").val().trim(),
                    owner : $("#addOrEditBrandForm_tortbrand [name=owner]").val().trim(),
                    checkType : $("#addOrEditBrandForm_tortbrand [name=checkType]").val(),
                    remark : $("#addOrEditBrandForm_tortbrand [name=remark]").val().trim(),
                    cateIds : $("#addOrEditBrandForm_tortbrand [name=cateIds]").val().trim(),
                    cateNames : $("#addOrEditBrandForm_tortbrand #xtreeDiv").text().trim()
                }
                var platSiteList = []
                var platSiteJson = getPlatSiteData($('#platSiteDiv_tortbrandForm'))
                for (var key in platSiteJson) {
                    platSiteJson[key].requireCheck = true
                    platSiteList.push(platSiteJson[key])
                }
                var platSiteJsonUn = getPlatSiteData($('#platSiteDiv_tortbrandFormUn'))
                for (var key in platSiteJsonUn) {
                    platSiteJsonUn[key].requireCheck = false
                    platSiteList.push(platSiteJsonUn[key])
                }

                Adata.platSiteList = platSiteList
                loading.show();
                $.ajax({
                    type: "POST",
                    url: ctx + "/tort/addBrand.html",
                    data: JSON.stringify(Adata),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (returnData) {
                        loading.hide();
                        if (returnData.code == "0000") {
                            layer.closeAll();
                            $("#tb_SearchBtn").trigger('click');
                            layer.msg('添加成功');
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        loading.hide();
                        layer.msg("服务器正忙");
                    }
                });
            },
            end: function () {
                layuiOpenPop = false // 启用 回车搜索功能
            }
        })
    });

    function initAddPlatSite(eventBtn, platSiteDiv) {
        eventBtn.click(function () {
            let card = eventBtn.closest('.layui-card')
            var platCode = card.find('[name^=platCode]').val()
            var siteCode = card.find('[name^=siteCode]').val()
            var siteName = card.find('[name^=siteCode] option:selected').text()
            if (!platCode) {
                layer.msg('请选择需要添加的适用平台')
                return
            }
            // 获取当前已存在的平台
            var originPlatSiteJson = getPlatSiteData(platSiteDiv)

            // 检查是否已经存在
            var key = platCode + (siteName ? ('_' + siteName) : '')
            if (originPlatSiteJson[key]) {
                layer.msg('该平台站点已经存在')
                return
            }
            // 将当前选择的平台站点加入列表
            addOnePlatSite_tortbrand(platCode,siteCode,siteName,platSiteDiv)
        })
    }

    function getPlatSiteData(platSiteDiv) {
        var originBoxArr = platSiteDiv.find('.platSiteBox')
        var originPlatSiteJson = {}
        for (var i = 0 ; i < originBoxArr.length; ++i) {
            originPlatSiteJson[originBoxArr[i].getAttribute('data-key')] = {
                platCode: originBoxArr[i].getAttribute('data-platCode'),
                siteCode: originBoxArr[i].getAttribute('data-siteCode'),
                siteName: originBoxArr[i].getAttribute('data-siteName')
            }
        }
        return originPlatSiteJson
    }
    function addOnePlatSite_tortbrand(platCode,siteCode,siteName,platSiteDiv) {
        var key = platCode + (siteName ? ('_' + siteName) : '')
        var box = $('<div class="platSiteBox layui-btn layui-btn-normal layui-btn-sm" onclick="removeSelf_brantort(this)" onmouseenter="showRemoveBtn_tortbrand(this)" onmouseleave="showOriginText_tortbrand(this)" data-key="'+ key +'" data-platCode="'+ platCode +'" data-siteCode="'+ (siteCode || '')+ '" data-siteName="'+ ( siteName || '' )+'">'+ key +'</div>')
        platSiteDiv.append(box)
    }

    $('#importFile_tortbrand').on("change",function () {
        var self = this
        var files = $(self)[0].files
        // 如果没有文件则终止
        if (files.length == 0) {
            return
        }
        // 校验文件类型
        var fileName = files[0].name
        var seat = fileName.lastIndexOf(".");
        var extension = fileName.substring(seat).toLowerCase();
        if (extension != '.xlsx' && extension != 'xls') {
            layer.msg('请传入后缀为.xlsx或者.xls 的Excel文件')
            return
        }
        var formData = new FormData();
        formData.append("file", files[0]);
        layer.confirm('确认导入这个文件进行批量操作侵权商品吗', { btn: ['确认', '取消'] },
            function() {
                loading.show()
                $.ajax({
                    url: ctx + '/tort/addOrUpdByExcel.html',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function(data) {
                        loading.hide()
                        $(self).val('')
                        if (data.code == '0000') {
                            layer.msg("上传成功");
                        } else {
                            layer.alert(data.msg)
                        }
                    },
                    error: function() {
                        loading.hide()
                        $(self).val('')
                    }
                });
            },
            function() {
                layer.closeAll()
            }
        )
    })

    // 导出
    $('#exportBtn_tortbrand').click(function() {
        var searchParam = {
            brand : $("#tb_SearchForm [name='brand']").val(),
            owner : $("#tb_SearchForm [name='owner']").val(),
            status : $("#tb_SearchForm [name='status']").val() == '1',
            checkTypeSearch : $("#tb_SearchForm [name='checkType']").val(),
            creatorId : $("#tb_SearchForm [name='creatorId']").val() ? parseInt($("#tb_SearchForm [name='creatorId']").val()) : null,
            cateIdList: $("#tb_SearchForm [name='cateIdStr']").val()?.split(',') || []
        }
        if ($("#tb_SearchForm input[name='createTime']").val()) {
            var timeArr = $("#tb_SearchForm [name='createTime']").val().split(' - ')
            searchParam.beginDate = timeArr[0]
            searchParam.endDate = timeArr[1]
        }
        checkNull(searchParam)
        var data = {}
        data.searchParam = JSON.stringify(searchParam)

        console.log(data, '1111111')

        var Confirmindex = layer.confirm('确认导出当前搜索条件下的侵权品牌？', { btn: ['确认', '取消'] }, function() {
            layer.alert('如果导出数据量大，需要几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件')
            submitForm(data, ctx + '/tort/exportTortBrand.html')
        })
    })

    /**
     * 选择平台后
     * 联动 设置站点可选项
     * @param platCode 选择的平台
     * @param siteCodeSelector 站点select的选择器
     * @param idPrex 站点盒子的id前缀
     */
    function initSalesSite_tortbrand(platCode,siteCodeSelector, idPrex) {
        $(siteCodeSelector).html($(idPrex + platCode).html())
        form.render('select')
    }

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(tortBrandTable)', function (obj) {
        var data = obj.data, //获得当前行数据
        layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
            var id = data.id;
            var index = layer.open({
                type: 1,
                title: '修改侵权品牌',
                area: ['60%', '700px'],
                btn: ['保存','取消'],
                shadeClose: false,
                content: $('#tb_addBrandLayer').html(),
                success: function () {
                    layuiOpenPop = true // 禁用 回车搜索功能
                    initNotNull('#addOrEditBrandForm_tortbrand')
                    // 复现数据
                    $('#addOrEditBrandForm_tortbrand [name=brand]').val(data.brand)
                    $('#addOrEditBrandForm_tortbrand [name=owner]').val(data.owner)
                    $('#addOrEditBrandForm_tortbrand [name=checkType]').val(data.checkType)
                    $('#addOrEditBrandForm_tortbrand [name=remark]').val(data.remark)
                    $('#addOrEditBrandForm_tortbrand [name=cateIds]').val(data.cateIds)
                    $('#addOrEditBrandForm_tortbrand #xtreeDiv').text(data.cateNames)
                    for (var i =0; i < data.platSiteList.length; ++i ) {
                        let one =data.platSiteList[i]
                        if (one.requireCheck) {
                            addOnePlatSite_tortbrand(one.platCode,one.siteCode,one.siteName,$('#platSiteDiv_tortbrandForm'))
                        } else {
                            addOnePlatSite_tortbrand(one.platCode,one.siteCode,one.siteName,$('#platSiteDiv_tortbrandFormUn'))
                        }
                    }

                    $('#addOrEditBrandForm_tortbrand [name=brand]').attr('placeholder', '')
                    form.render('select','addOrEditBrandForm_tortbrand')
                    alertCateSelect($('#addOrEditBrandForm_tortbrand #tortbrand_xtreeBtn'),$('#addOrEditBrandForm_tortbrand [name=cateIds]'),$('#addOrEditBrandForm_tortbrand #xtreeDiv'));
                    form.on('select(plateCode_componentForm)', function(data){
                        var platCode = data.value
                        initSalesSite_tortbrand(platCode,'#addOrEditBrandForm_tortbrand [name=siteCode]', '#salesSite_componentForm_')
                    });
                    form.on('select(plateCode_componentFormUn)', function(data){
                        var platCode = data.value
                        initSalesSite_tortbrand(platCode,'#addOrEditBrandForm_tortbrand [name=siteCodeUn]', '#salesSite_componentForm_')
                    });
                    initAddPlatSite($('#addPlatSite_tortbrand'),$('#platSiteDiv_tortbrandForm'))
                    initAddPlatSite($('#addPlatSite_tortbrandUn'),$('#platSiteDiv_tortbrandFormUn'))

                },
                yes: function (index, layero) {
                    if (!checkNotNull('#addOrEditBrandForm_tortbrand')) {
                        return
                    }
                    var Adata = {
                        id : id,
                        brand : $("#addOrEditBrandForm_tortbrand [name=brand]").val().trim(),
                        owner : $("#addOrEditBrandForm_tortbrand [name=owner]").val().trim(),
                        checkType : $("#addOrEditBrandForm_tortbrand [name=checkType]").val(),
                        remark : $("#addOrEditBrandForm_tortbrand [name=remark]").val().trim(),
                        cateIds : $("#addOrEditBrandForm_tortbrand [name=cateIds]").val().trim(),
                        cateNames : $("#addOrEditBrandForm_tortbrand #xtreeDiv").text().trim()
                    }

                    let platSiteList = []
                    let platSiteJson = getPlatSiteData($('#platSiteDiv_tortbrandForm'))
                    for (let key in platSiteJson) {
                        platSiteJson[key].requireCheck = true
                        platSiteList.push(platSiteJson[key])
                    }
                    let platSiteJsonUn = getPlatSiteData($('#platSiteDiv_tortbrandFormUn'))
                    for (let key in platSiteJsonUn) {
                        platSiteJsonUn[key].requireCheck = false
                        platSiteList.push(platSiteJsonUn[key])
                    }

                    Adata.platSiteList = platSiteList
                    console.log(Adata)
                    loading.show();
                    $.ajax({
                        type: "POST",
                        url: ctx + "/tort/updateBrand.html",
                        data: JSON.stringify(Adata),
                        contentType: 'application/json',
                        dataType: "json",
                        success: function (returnData) {
                            loading.hide();
                            if (returnData.code == "0000") {
                                layer.close(index);
                                $("#tb_SearchBtn").trigger('click');
                                layer.msg('修改成功');
                            } else {
                                layer.msg(returnData.msg);
                            }
                        },
                        error: function () {
                            loading.hide();
                            layer.msg("服务器正忙");
                        }
                    });
                },
                end: function () {
                    layuiOpenPop = false // 启用 回车搜索功能
                }
            })
        } else if (layEvent === 'del' || layEvent === 'reback') {
            var operator = data.status ? '删除' : '恢复'
            layer.confirm('确定'+ operator +'该条数据吗？', {
                btn: ['确定','取消'], //按钮
                shade: false //不显示遮罩
            }, function(index){
                var id = data.id;
                var status = layEvent == 'reback'
                loading.show()
                $.ajax({
                    type: "POST",
                    url: ctx + "/tort/delOrRebackTortBrand.html",
                    data: {"id": id,status : status},
                    dataType: "json",
                    success: function (returnData) {
                        loading.hide()
                        if (returnData.code == "0000") {
                            $("#tb_SearchBtn").trigger('click');
                            if (!status) {
                                layer.msg("删除成功");
                            } else {
                                layer.msg("恢复成功");
                            }
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
            });
        } else if (layEvent == 'showLog') {
            var id = data.id;
            var index = layer.open({
                type: 1,
                title: '操作日志',
                area: ['1000px', '600px'],
                btn: ['关闭'],
                shadeClose: false,
                content: $('#tb_logListLayer').html(),
                success: function () {
                    table.render({
                        elem: "#tortBrand_logTable",
                        method:'post',
                        url: ctx + "/tort/tortBrandLogList.html",
                        cols: [[
                            { field: "creator", title: "操作人",width: 100},
                            { field: "operDesc", title: "操作详情"},
                            { field: "create_time", title: "操作时间",templet : "<div>{{ layui.admin.Format( d.createTime, 'yyyy-MM-dd hh:mm:ss')}}</div>"},
                        ]],
                        page:true,
                        where:{operObjId : id,operModel : 1},
                        id:"tortBrand_logTable",
                        limits:[20,100,100],
                        limit:20
                    });
                }
            })
        }
    });

    $('input[name="brand"]').bind('keydown',function(e){
        if(e.keyCode == 13){
           $('#tb_SearchBtn').click();
           return false;
        }
    })

});
function queryPage2_tortbrand(status,ifComplete) {
    $("#tb_SearchForm [name='status']").val(status)
    $("#tb_SearchForm [name='ifComplete']").val(ifComplete)
    $("#tb_SearchBtn").click()
}

function showRemoveBtn_tortbrand(self) {
    $(self).css('width',self.offsetWidth + 'px')
    $(self).text('删除')
}
function showOriginText_tortbrand(self) {
    $(self).text(self.getAttribute('data-key'))
}
function removeSelf_brantort(self) {
    $(self).remove()
}

var tortbrandName = {
    //展开事件
    expandDetail: function(){
        var tds = $('td[data-field=cateNames]');
        for(var i=0; i<tds.length; i++){
            var $item = $(tds[i]);
            var tdh = $item.find('.tortbrandDetailDiv').height();
            if(tdh > 100) {
                var expandStr = `<div class="tortbrand_expand"><b style="cursor:pointer;color:#428bca;"  class="tortbrandDetail_expand_single">+展开</b></div>`;
                $item.append(expandStr);
            }
        };
        var $body = $('#tortBrandTable').next().find('.layui-table-body.layui-table-main');
        $body.on('click', '.tortbrandDetail_expand_single', function(){
            var $this = $(this);
            var txt = $this.html();
            var $tar = $(this).parents('td').find('.tortbrandDetailDefault');
            if(txt == '+展开'){
                $tar.removeClass('tortbrandDetailHidden').addClass('tortbrandDetailShow');
                $this.html('-收缩');
            }else{
                $tar.addClass('tortbrandDetailHidden').removeClass('tortbrandDetailShow');
                $this.html('+展开');
            }
        });
    },
    expandDetailAll: function(){
        var $thExpand = $('#tortbrand_expand');
        var tds = $('td[data-field=cateNames]'); 
        $thExpand.on('click', function(){
            var txt = $thExpand.html();
            if(txt == '（+展开）'){
                $thExpand.html('（-收缩）');
                for(var i=0; i< tds.length; i++){
                    var $tar = $(tds[i]).find('.tortbrandDetail_expand_single');
                    if($tar.html() == '+展开'){
                        $tar.trigger('click');
                    }
                };
            }else{
                $thExpand.html('（+展开）');
                for(var i=0; i< tds.length; i++){
                    var $tar = $(tds[i]).find('.tortbrandDetail_expand_single');
                    if($tar.html() == '-收缩'){
                        $tar.trigger('click');
                    }
                };
            }
        })
    }
}