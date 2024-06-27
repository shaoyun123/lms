layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate'],function(){
    var admin = layui.admin,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        form = layui.form;

    let firstWayTypeList // 头程渠道列表
        , sheetList // 正在编辑的模板的 sheet列表
        ,exporttemplate_ALLFIELDINFO
    function initFirstWayType () {
        if (firstWayTypeList) {
            return
        }
        let ajax = new Ajax(false)
        ajax.post({
            url: ctx + '/winitDeliverGoodsPlan/getFirstWayCompanyList.html',
            success: function (res) {
                if (res.code === '0000') {
                    firstWayTypeList = res.data
                } else {
                    layer.msg('初始化头程方式失败: ' + res.msg)
                }
            }
        })
    }
    initFirstWayType()
    // 初始化模板字段信息
    function initField() {
        if (exporttemplate_ALLFIELDINFO) {
            return
        }
        let ajax = new Ajax(false)
        ajax.post({
            url: ctx + '/winitExportTemplate/getAllField.html',
            success: function (res) {
                if (res.code === '0000') {
                    exporttemplate_ALLFIELDINFO = res.data
                } else {
                    layer.msg('初始化模板字段失败: ' + res.msg)
                }
            }
        })
    }
    initField()

    // 初始化模板类型
    function initTemplateType() {
        let ajax = new Ajax(false)
        ajax.post({
            url: ctx + '/winitExportTemplate/getAllType.html',
            success: function (res) {
                if (res.code === '0000') {
                    let options = ''
                    for (let i = 0; i < res.data.length; ++i) {
                        options += '<option value="' + res.data[i].code + '">'+ res.data[i].name +'</option>'
                    }
                    $('#exporttemplate_templateType').html(options)
                    form.render('select','exporttemplate_searchForm')
                } else {
                    layer.msg('初始化模板字段失败: ' + res.msg)
                }
            }
        })
    }
    initTemplateType()

    var exporttemplateFun = {
        tableRender: function(obj){
            var _this = this;
            if (!obj){
                obj = {}
            }
            obj.orderBy = 'logistics_type_id asc'
            table.render({
                elem: '#exporttemplate_table',
                method: 'post',
                url: '/lms/winitExportTemplate/queryPage.html',
                where: obj,
                page: false,
                limits: [50, 100, 300],
                limit: 50,
                id: "exporttemplate_tableId",
                cols: [
                    [
                        {type: "checkbox", width: 30 },
                        {title: '模板名称', field:'name',sort:true},
                        {title: '头程方式', field:'logisticsType',sort:true},
                        {title: '导出字段内容', templet: function (res) {
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
                        }},
                        {title: '备注', field: 'remark'},
                        {title: '操作',toolbar: '#exporttemplate_toolBar'}
                    ]
                ],
                done: function(){
                    _this.watchBar();
                }
            });
        },
        watchBar: function(){
            var _this = this;
            table.on('tool(exporttemplate_tableFilter)',function(obj){
                var data = obj.data;
                if(obj.event == 'edit'){ //修改
                    data.title="修改";
                    _this.addOrEditLayer(data);
                }else if(obj.event == 'delete'){ //启用功能
                    layer.confirm('确定删除该导出模板吗？', function(){
                        let ajax = new Ajax(true)
                        ajax.post({
                            url: ctx + '/winitExportTemplate/deleteOne.html',
                            data: JSON.stringify(data),
                            success: function (res) {
                                if (res.code === '0000') {
                                    table.reload('exporttemplate_tableId')
                                }
                            }
                        })
                    });
                }
            });
        },
        btnInit: function(){
            var _this = this;
            $('#exporttemplate_addCaseTypeBtn').on('click', function(){
                _this.addOrEditLayer({});
            })
            $('#exporttemplate_copyAddCaseTypeBtn').click(function () {
                let checkStatus = table.checkStatus('exporttemplate_tableId'),
                    data = checkStatus.data;
                if (data.length === 0) {
                    layer.msg('请选择要复制新增的模板')
                    return
                }
                if (data.length > 1) {
                    layer.msg('请选择一个模板进行复制新增')
                    return
                }
                let template = data[0]
                template.id = null
                _this.addOrEditLayer(template);
            })
        },
        // 新增/编辑弹框
        addOrEditLayer: function(obj){
            var _this = this;
            let title = ''
            if (!obj.id) {
                title = '新增'
            } else {
                title = '修改'
            }
            layer.open({
                type: 1,
                title: title,
                area:['1366px', '90%'],
                btn: ['确认','关闭'],
                id: 'exporttemplate_editOrAddLayerId',
                content: $('#exporttemplate_editOrAddTemplateTpl').html(),
                success: function(layero, index){
                    // 初始化必填项
                    if ($('#exporttemplate_templateType').val() !== '1' ) {
                        $('#exporttemplate_editOrAddTemplateTpl_logisticsTypeId').addClass('disN')
                    }
                    initNotNull('#exporttemplate_editOrAddTemplateForm')

                    // 初始化组件功能
                    _this.initComponent()
                    // 渲染数据
                    sheetList = [{eId: 1}]
                    if (obj.titleJson) {
                        let titleJson = obj.titleJson
                        sheetList = JSON.parse(titleJson)
                        let dataForm = $('#exporttemplate_editOrAddTemplateForm')
                        dataForm.find('[name=name]').val(obj.name)
                        if (obj.id) {
                            dataForm.find('[name=logisticsTypeId]').val(obj.logisticsTypeId)
                        }
                        form.render('select','exporttemplate_editOrAddTemplateForm')
                    }
                    for (let i = 0; i < sheetList.length; i++) {
                        _this.addOneSheet(sheetList[i])
                    }
                },
                yes: function(index, layero){
                    if (!checkNotNull('#exporttemplate_editOrAddTemplateForm')) {
                        return false
                    }
                    let dataForm = $('#exporttemplate_editOrAddTemplateForm')
                    let Adata = serializeObject(dataForm)
                    Adata.id = obj.id
                    Adata.templateType = $('#exporttemplate_templateType').val()
                    Adata.logisticsType = dataForm.find('[name=logisticsTypeId] option:selected').text()
                    if (!sheetList || sheetList.length === 0) {
                        layer.msg('至少要有1个sheet')
                        return
                    }
                    for (let i = 0; i <sheetList.length; ++i) {
                        if (!sheetList[i].titleList || sheetList[i].titleList.length === 0) {
                            layer.msg('每个sheet的字段数必须>0')
                            return
                        }
                        // 排序
                        sheetList[i].titleList = sortArr(1,sheetList[i].titleList,'sort')
                    }
                    Adata.titleJson = JSON.stringify(sheetList)
                    _this.addOrUpdate(Adata)
                }
            })
        },
        addOrUpdate: function(data){
            let ajax = new Ajax(true)
            ajax.post({
                url: ctx + '/winitExportTemplate/addOrUpdate.html',
                data: JSON.stringify(data),
                success: function (res) {
                    if (res.code === '0000') {
                        layer.closeAll()
                        table.reload('exporttemplate_tableId')
                    }
                }
            })
        },
        initComponent: function () {
            let _this = this
            if (!firstWayTypeList) {
                layer.msg('头程方式初始化失败，请刷新页面')
                return
            }
            // 渲染头程方式
            let selElem = $('#exporttemplate_editOrAddTemplateForm').find('[name=logisticsTypeId]')
            let options = ''
            for (let i = 0; i < firstWayTypeList.length; ++i) {
                options += '<option value="' + firstWayTypeList[i].id +'">' + firstWayTypeList[i].name + '</option>'
            }
            selElem.append(options)
            form.render('select', 'exporttemplate_editOrAddTemplateForm')
            // 渲染可选字段
            let type = $('#exporttemplate_templateType').val()
            let filedInfo
            for (let i = 0; i < exporttemplate_ALLFIELDINFO.length; ++i) {
                if (type == exporttemplate_ALLFIELDINFO[i].templateType) {
                    filedInfo = exporttemplate_ALLFIELDINFO[i].pFieldDtoList
                    break
                }
            }
            if (!filedInfo) {
                layer.msg('无对应模板的字段信息')
                return
            }
            let html = ''
            for (let i = 0; i < filedInfo.length;++i) {
                html += `<fieldset class="layui-elem-field layui-field-title site-demo-button">
                    <legend style="font-size:14px">`+ filedInfo[i].parentField +`</legend>
                </fieldset>`
                for (let j = 0; j < filedInfo[i].fieldList.length; ++j) {
                    html += `<div class="fieldBox_standard" title="`+ filedInfo[i].fieldList[j].remark +`"><input type="checkbox" lay-filter="exporttemplate_exportField" value="`+ filedInfo[i].fieldList[j].field +`" title="`+ filedInfo[i].fieldList[j].field +`" lay-skin="primary"></div>`
                }
                html += `<div style="clear:left"></div>`
            }
            $('#exporttemplate_exportForm').append(html)

            form.render('checkbox', 'exporttemplate_exportForm')

            // 绑定刷新按钮事件
            $('#exporttemplate_refreshSheetBtn').click(function () {
                _this.refreshCurSheet()
            })
            // 绑定新增sheet按钮事件
            $('#exporttemplate_addOneSheetBtn').click(function () {
                let oneSheet = {eId: _this.getMaxEId() + 1}
                sheetList.push(oneSheet)
                _this.addOneSheet(oneSheet)
            })
            $('#exporttemplate_editOrAddLayerId').on('click', '.exporttemplate_deleteSheetBtn',function (target) {
                _this.deleteSheet(target.currentTarget)
            })
            $('#exporttemplate_editOrAddLayerId').on('click', '.exporttemplate_editSheetBtn',function (target) {
                let inp = target.currentTarget
                let eId = inp.getAttribute('data-eid')
                _this.changeEdit(eId)
            })
            $('#exporttemplate_editOrAddLayerId').on('input propertychange', '.exporttemplate_sheetNameInp',function (target) {
                let inp = target.currentTarget
                let eid = inp.getAttribute('data-eid')
                for (let i = 0; i < sheetList.length; ++i) {
                    if (sheetList[i].eId == eid) {
                        sheetList[i].sheetName = inp.value
                        break
                    }
                }

            })
            // 监听字段选择
            form.on('checkbox(exporttemplate_exportField)',function (obj) {
                let eId = $('#exporttemplate_exportForm').find('[name=curEId]').val()
                let oaField = obj.value
                let checked = obj.elem.checked
                let titleList
                let sheet
                for (let i = 0; i < sheetList.length; ++i) {
                    if (sheetList[i].eId == eId) {
                        sheet = sheetList[i]
                        if (!sheetList[i].titleList) {
                            sheetList[i].titleList = []
                        }
                        titleList = sheetList[i].titleList
                    }
                }
                if (checked) { // 加字段
                    titleList.push({oaField: oaField, excelField: oaField, sort: 0})
                } else {    // 删字段
                    for (let i = 0; i < titleList.length; ++i) {
                        if (titleList[i].oaField === oaField) {
                            titleList.splice(i, 1)
                        }
                    }
                }
                _this.renderSheetTable(eId,sheet)
            })
        },
        addOneSheet: function (oneSheet) {// 增加一个导出的sheet
            let _this = this
            let eId = oneSheet.eId
            // 新增sheet表格的element
            let sheetBox = $('#exporttemplate_sheetTableBox')
            let sheetElement = '<div class="exporttemplate_sheetTableDiv" id="exporttemplate_sheetTableDiv_' + eId + '">' +
                    '<div class="layui-card"><div class="layui-card-header"><div>' +
                        '<div class="layui-col-lg4 layui-col-md4">' +
                            '<input name="sheetName" data-eid="'+ eId +'" placeholder="sheet名字" class="layui-input exporttemplate_sheetNameInp" value="'+ (oneSheet.sheetName || eId) +'">' +
                        '</div>' +
                        '<div class="layui-col-lg8 layui-col-md8">' +
                            '<div class="fr">' +
                                '<div class="layui-btn layui-btn-sm layui-danger exporttemplate_deleteSheetBtn" data-eid="'+ eId +'">删除sheet' +
                                '</div>' +
                                '<div class="layui-btn layui-btn-sm exporttemplate_editSheetBtn" data-eid="'+ eId +'">编辑sheet' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div></div></div>' +
                    '<div class="layui-card-body>' +
                        '<table class="layui-table" id="exporttemplate_sheetTable_' + eId + '" lay-filter="exporttemplate_sheetTable_' + eId + '"></table>' +
                    '</div>' +
                '</div>'
            sheetBox.append(sheetElement)
            // 渲染导出字段表格
            _this.renderSheetTable(eId, oneSheet)
            // 切换到这个sheet的 编辑模式
            _this.changeEdit(eId)
        }, changeEdit: function (eId) {   // 切换编辑的sheet
            let sheetBox = $('#exporttemplate_sheetTableBox')
            // 其他的sheet 背景变为白色
            sheetBox.find('.exporttemplate_sheetTableDiv').css('background-color','white')
            // 当前编辑的背景变为黄色
            $('#exporttemplate_sheetTableDiv_' + eId).css('background-color','rgb(253, 253, 144)')
            // 根据当前的sheet重新渲染所选择的字段
            let fieldForm = $('#exporttemplate_exportForm')
            fieldForm.find('input:checkbox').prop('checked', false)
            let titleList
            for (let i = 0; i < sheetList.length; ++i) {
                if (eId == sheetList[i].eId) {
                    titleList = sheetList[i].titleList || []
                    break
                }
            }
            for (let i = 0; i < titleList.length; ++i) {
                let oaField = titleList[i].oaField.replace(/\(/ig, "\\(").replace(/\)/ig, "\\)").replace(/\+/ig, "\\+").replace(/\$/ig, "\\$").replace(/\*/ig, "\\*")
                fieldForm.find('[value='+ oaField +']').prop('checked',true)
            }
            form.render('checkbox', 'exporttemplate_exportForm')
            fieldForm.find('[name=curEId]').val(eId)
        }, renderSheetTable: function (eId, sheetData) { // 渲染sheet的表格数据
            console.log(sheetData)
            let titleList = sheetData.titleList || []
            table.render({
                elem: '#exporttemplate_sheetTable_' + eId,
                data: titleList,
                page: false,
                limit: titleList.length,
                id: "exporttemplate_sheetTable_" + eId,
                cols: [
                    [
                        {title: '字段名', field:'oaField'},
                        {title: 'excel列名(点击可修改)', field:'excelField', edit: 'text', style:"background-color: #7FFFD4;"},
                        {title: '排序(点击可修改)', field: 'sort', edit: 'text', style:"background-color: #7FFFD4;", sort: true},
                    ]
                ]
            })
        }, deleteSheet: function (self) {
            let _this = this
            let eId = self.getAttribute('data-eid')
            for (let i = 0; i < sheetList.length; ++i) {
                if (sheetList[i].eId == eId) {
                    sheetList.splice(i, 1);
                }
            }
            $(self).closest('#exporttemplate_sheetTableDiv_' + eId).remove()
            if (sheetList.length > 0) {
                _this.changeEdit(sheetList[0].eId)
            }
        }, getMaxEId: function () {
            let maxEId = 0
            for (let i = 0; i < sheetList.length; ++i) {
                if (maxEId < sheetList[i].eId) {
                    maxEId = sheetList[i].eId
                }
            }
            return maxEId
        }
    };
    //新增按钮
    exporttemplateFun.btnInit();
    // 初始查询
    let searchData = {
        templateType: 1
    }
    exporttemplateFun.tableRender(searchData);

    form.on('select(exporttemplate_templateType)', function (data) {
        let searchData = {
            templateType: data.value
        }
        exporttemplateFun.tableRender(searchData);
    })

})
