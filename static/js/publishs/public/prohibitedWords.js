layui.use(["form", "layer", "formSelects", "table"], function () {
    let form = layui.form,
        layer = layui.layer,
        formSelects = layui.formSelects,
        table = layui.table,
        $ = layui.$

    publicProhibitWordName = {
        init: function () {
            this.getEbaySiteList()
            this.getPlatCodeAndLogisList()
            this.handlePaltCodeInSearch()
            commonRenderSelect('prohibitWord_form_checked', this.ProhibitWordList.checkedAmazonData)
            formSelects.render('prohibitWord_form_checked');
            this.search()
            this.reset()
            this.export()
            this.import()
            this.download()
            this.add()
            this.delete()
        },
        ProhibitWordList: {
            platCodes: [],
            checkedAmazonData: ['标题', '描述', '变种属性', '卖点'],
            checkedData: ['标题', '描述'],
        },
        // ebay list
        EbaySiteList: [],
        getEbaySiteList: function() {
            this.getSiteAjax('ebay').then((res) => {
                this.EbaySiteList = res
            })
        },
        //#region 查询card
        // 平台 下拉框
        getPlatCodeAndLogisList: function () {
            this.getPlatCodeAndLogisAjax().then((res) => {
                this.ProhibitWordList.platCodes = res.platCodes
                commonRenderSelect('prohibitWord_form_platCode', res.platCodes)
                form.render();
            })
        },
        // 站点下拉框
        getSiteList: function (formDom, platCode = "", selected = "") {
            this.getSiteAjax(platCode).then((res) => {
                if (platCode == 'lazada') {
                    let newRes = deepCopy(res)
                    newRes.push({'name': 'GSP', 'code': 'GSP'})
                    res = newRes
                }
                // if (platCode == 'ebay'){
                //     res = res.map(item => item.code = item.siteName)
                // }
                commonRenderSelect('prohibitWord_form_salesSite', res, {name: 'name', code: 'code'})
                formSelects.render('prohibitWord_form_salesSite');
            })
        },
        // 站点下拉框
        getSiteListLayer: function (formDom, platCode = "", selected = "-1") {
            this.getSiteAjax(platCode).then((res) => {
                if (platCode == 'lazada') {
                    let newRes = deepCopy(res)
                    newRes.push({'name': 'GSP', 'code': 'GSP'})
                    res = newRes
                }
                // if (platCode == 'ebay'){
                //     res = res.map(item => item.code = item.siteName)
                // }
                commonRenderSelect('prohibitWord_layer_salesSite', res, {name: 'name', code: 'code'}).then(function() {
                    formSelects.render('prohibitWord_layer_salesSite');
                    formSelects.value('prohibitWord_layer_salesSite', selected);
                })
            })
        },
        // 联动,平台-->站点
        changePlatCode: function (formDom, platCode = "") {
            this.getSiteList(formDom, platCode)
        },
        // 联动,平台-->站点
        changePlatCodeLayer: function (formDom, platCode = "") {
            this.getSiteListLayer(formDom, platCode)
        },
        // 选取平台后,站点
        handlePaltCodeInSearch: function () {
            const _this = this
            form.on("select(prohibitWord_form_platCode)", function (data) {
                _this.changePlatCode($("#public_prohibitWord_form"), data.value)
            })
        },
        // 选取平台后,站点
        handlePaltCodeInLayer: function () {
            const _this = this
            form.on("select(prohibitWord_layer_platCode)", function (data) {
                _this.changePlatCodeLayer($("#prohibitWord_layer_from"), data.value)
                if(data.value==='amazon'){
                    // 检查模块
                    commonRenderSelect('prohibitWord_layer_checked', _this.ProhibitWordList.checkedAmazonData)
                }else{
                    // 检查模块
                    commonRenderSelect('prohibitWord_layer_checked', _this.ProhibitWordList.checkedData)
                }
                if(data.value === 'tiktok'){
                    $('#prohibitWord_layer_salesSite').parents('.layui-form-item').find('label').html('站点')
                }else{
                    $('#prohibitWord_layer_salesSite').parents('.layui-form-item').find('label').html('<font color="red">*</font>站点')
                }
                formSelects.render('prohibitWord_layer_checked')
            })
        },
        getTableRender: function (data) {
            const _this = this;
            table.render({
                elem: '#prohibitWord_table',
                method: 'POST',
                contentType: 'application/json',
                url: ctx + '/prodProhibitWord/list',
                where: data,
                cols: [[
                    {
                        type: "checkbox"
                    }, {
                        title: "平台",
                        field: "platCode",
                    }, {
                        title: "站点",
                        field: "siteName"
                    }, {
                        title: "检查模块",
                        field: "checkModules",
                    }, {
                        title: "违禁词",
                        field: "keywords",
                    }, {
                        title: "替换词",
                        field: "replacedKeywords",
                    }, {
                        title: "备注",
                        field: "remark",
                    }, {
                        title: "操作",
                        toolbar: "#public_prohibitWord_toolbar"
                    }
                ]],
                page: true,
                limit: 100,
                limits: [100, 200, 500],
                id: 'prohibitWord_table',
                done:function(){
                    _this.tableToor()
                }
            })
        },
        // 搜索
        search: function () {
            const _this = this
            $("#public_prohibitWord_search").click(function () {
                let formData = serializeObject($("#public_prohibitWord_form"))
                _this.getTableRender(formData)
            })
        },
        // 清空
        reset: function () {
            const _this = this
            $("#public_prohibitWord_reset").click(function () {
                $("#public_prohibitWord_form")[0].reset()
                _this.changePlatCode($("#public_prohibitWord_form"))
                formSelects.value("prohibitWord_form_checked","")
                formSelects.render("prohibitWord_form_checked")
            })
        },
        // 导入模板下载
        download: function() {
            $("#public_prohibitWord_download").click(function () {
                submitForm(null, ctx + '/prodProhibitWord/downloadProhibitWordTemplate');
            })
        },
        // 导入
        import: function() {
            var _this = this
            $('#prohibitWord_import_actvt').on("change", function () {
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
                if (extension != '.xlsx') {
                    layer.msg('请传入后缀为.xlsx的Excel文件')
                    return
                }
                var formData = new FormData();
                formData.append("file", files[0]);
                $.ajax({
                    url: ctx + '/prodProhibitWord/addProhibitWordByExcel',
                    type: 'POST',
                    // async : false,
                    data: formData,
                    // 告诉jQuery不要去处理发送的数据
                    processData: false,
                    // 告诉jQuery不要去设置Content-Type请求头
                    contentType: false,
                    success: function (data) {
                        loading.hide()
                        $(self).val('')
                        if (data.code === '0000') {
                            layer.msg(data.msg);
                        } else {
                            // layer.alert(data.msg)
                            layer.open({
                              type: 1,
                              title: '提示',
                              content: `<div style="padding:20px;">${data.msg}</div>`,
                              area: ['500px', '700px']
                            });
                        }
                        let formData1 = serializeObject($("#public_prohibitWord_form"))
                        _this.getTableRender(formData1);
                    },
                    error: function () {
                        loading.hide()
                        $(self).val('')
                    }
                });
            })
        },
        // 导出
        export: function () {
            const _this = this
            $("#public_prohibitWord_export").click(function () {
                let formData = serializeObject($("#public_prohibitWord_form"))
                loading.show();
                transBlob({
                    url: ctx + "/prodProhibitWord/exportQueryData",
                    // fileName: '违禁词维护',
                    contentType: 'application/json',
                    formData: JSON.stringify(formData)
                },"POST").then(function (result) {
                    loading.hide();
                }).catch(function (err) {
                    loading.hide();
                    layer.msg(err, {icon: 2 });
                });
            })
        },
        // 新增
        add: function () {
            const _this = this
            $("#public_prohibitWord_add").click(function () {
                _this.editModal("add")
            })
        },
        // 批量删除
        delete: function () {
            const _this = this
            $("#public_prohibitWord_delete").click(function () {
                let tableData = layui.table.checkStatus("prohibitWord_table").data
                if(tableData.length == 0){
                    return layer.alert("请选择一条数据",{icon:2})
                }
                let idArr = Array.from(tableData,({id})=>id)
                    layer.confirm(
                    "确认删除吗？",
                    {
                        title: "提示",
                        icon: 0,
                    },
                    function () {
                        _this.deleteFormulaConfigAjax(idArr).then((res) => {
                            layer.msg(res, {icon: 1})
                            $("#public_prohibitWord_search").click()
                        })
                    }
                )
            })
        },
        // 编辑&删除
        tableToor: function () {
            const _this = this
            table.on("tool(prohibitWord_table)", function (obj) {
                switch (obj.event) {
                    case "edit":
                        //   打开编辑弹窗
                        _this.editModal("edit",obj.data)
                        break
                    case "delete":
                        layer.confirm(
                            "确认删除吗？",
                            {
                                title: "提示",
                                icon: 0,
                            },
                            function () {
                                _this.deleteFormulaConfigAjax([obj.data.id]).then((res) => {
                                    layer.msg(res, {icon: 1})
                                    $("#public_prohibitWord_search").click()
                                })
                            }
                        )
                        break
                }
            })
        },
        // 新增&编辑
        editModal: function (type,data) {
            const _this = this
            let curIndex = layer.open({
                type: 1,
                title: type == "add" ? "添加" : type == "edit" ? "编辑" : "",
                btn: ["保存", "取消"],
                area: ["700px", "500px"],
                id: Date.now(),
                content: $("#public_prohibitWord_editModal").html(),
                success: function (layero) {
                    // 检查模块
                    if(type==='edit' && data && data.platCode==='amazon'){
                        commonRenderSelect('prohibitWord_layer_checked', _this.ProhibitWordList.checkedAmazonData)
                    }else{
                        commonRenderSelect('prohibitWord_layer_checked', _this.ProhibitWordList.checkedData)
                    }
                    formSelects.render('prohibitWord_layer_checked');
                    // 站点 检查模块
                    _this.handlePaltCodeInLayer()
                    // 平台
                    if(type == "add"){
                        commonRenderSelect('prohibitWord_layer_platCode', _this.ProhibitWordList.platCodes)
                        form.render('select');
                    }else if(type == "edit"){
                        commonRenderSelect('prohibitWord_layer_platCode', [data.platCode], {selected: data.platCode})
                        form.render('select');
                        _this.getSiteListLayer($("#prohibitWord_layer_from"), data.platCode,data.salesSite.split(","))
                        formSelects.value('prohibitWord_layer_checked', data.checkModules.split(","))
                        layero.find("[name=keywords]").val(data.keywords)
                        layero.find("[name=replacedKeywords]").val(data.replacedKeywords)
                        layero.find("[name=remark]").val(data.remark)
                        if(data.platCode === 'tiktok'){
                            $('#prohibitWord_layer_salesSite').parents('.layui-form-item').find('label').html('站点')
                        }else{
                            $('#prohibitWord_layer_salesSite').parents('.layui-form-item').find('label').html('<font color="red">*</font>站点')
                        }
                    }
                }, yes: function (index, layero) {
                    let formData = serializeObject($("#prohibitWord_layer_from"))
                    if (!checkNotNull('#prohibitWord_layer_from')) {
                        return
                    }
                    if($("[xid=prohibitWord_layer_salesSite]").children().length > 4 && formData.salesSite == '' && formData.platCode !== 'tiktok'){
                        return layer.msg("请选择站点")
                    }
                    if(formData.platCode == 'tiktok' && formData.salesSite !=''){
                        return layer.msg("tiktok平台无需选择站点，请清空")
                    }
                    if(type == "add"){
                        _this.addFormulaConfigAjax(formData).then(res=>{
                            if(res.code == "0000"){
                                layer.msg(res.msg,{icon:1})
                                $("#prohibitWord_layer_from").find("[name=keywords]").val("")
                                $("#prohibitWord_layer_from").find("[name=replacedKeywords]").val("")
                                $("#public_prohibitWord_search").click()
                            }
                        }).catch(err=>layer.alert(err,{icon:2}))
                    }else if(type == "edit"){
                        formData.id = data.id
                        _this.editFormulaConfigAjax(formData).then(res=>{
                            if(res.code == "0000"){
                                layer.msg(res.msg,{icon:1})
                                layer.close(curIndex)
                                $("#public_prohibitWord_search").click()
                            }
                        }).catch(err=>layer.alert(err,{icon:2}))
                    }
                }
            })
        },
        // 平台和物流属性
        getPlatCodeAndLogisAjax: function (platCode) {
            return commonReturnPromise({
                url: ctx + "/unauditorder/listenum.html",
            })
        },
        // 站点
        getSiteAjax: function (platCode) {
            return commonReturnPromise({
                url: ctx + "/enum/getSiteEnum.html?platCode=" + platCode,
                type: "POST",
            })
        },
        // 删除
        deleteFormulaConfigAjax: function (idArr) {
            return commonReturnPromise({
                type: 'POST',
                url: ctx + `/prodProhibitWord/deleteByIdList`,
                params: JSON.stringify(idArr),
                contentType:'application/json'
            })
        },
        // 编辑保存
        editFormulaConfigAjax: function (obj) {
            return commonReturnPromiseRes({
                type: 'POST',
                url: ctx + `/prodProhibitWord/editInfo`,
                params: JSON.stringify(obj),
                contentType:'application/json'
            })
        },
        // 新增
        addFormulaConfigAjax: function (obj) {
            return commonReturnPromiseRes({
                type: 'POST',
                url: ctx + `/prodProhibitWord/add`,
                params: JSON.stringify(obj),
                contentType:'application/json'
            })
        }
    }
    publicProhibitWordName.init()
})