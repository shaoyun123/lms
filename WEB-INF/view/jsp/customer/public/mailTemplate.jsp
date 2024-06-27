<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>邮件模板</title>
            <style>
                .fr {
                    float: right;
                }
                
                .w_80 {
                    width: 80%!important;
                    display: inline-block;
                }
                
                .mt {
                    margin-top: 10px;
                }
                
                .ml {
                    margin-left: 10px;
                }
                
                .m20 {
                    margin: 20px;
                }
                
                .hidden {
                    display: none;
                }
                
                .dis_flex {
                    display: flex;
                    justify-content: flex-start;
                }
                
                .mg_50 {
                    margin: 20px 50px;
                }
                
                .lh_42 {
                    line-height: 42px;
                }
                
                .w_100 {
                    width: 100px;
                }
                
                .hide {
                    display: none;
                }
                
                .red {
                    color: red;
                }
                
                #LAY-mailTemplate .layui-btn+.layui-btn {
                    margin-left: 0!important;
                }
            </style>
            <div class="layui-fluid" id="LAY-mailTemplate">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="mailTemplateForm" lay-filter="mailTemplateForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">平台</label>
                                            <div class="layui-input-block">
                                                <select name="platformCode" id="platformCode" lay-filter="platformCode" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">模板类型</label>
                                            <div class="layui-input-block">
                                                <select name="templateTypeName" id="templateTypeName" lay-filter="templateTypeName" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">语言</label>
                                            <div class="layui-input-block">
                                                <select name="languageCode" id="languageCode" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">模板名称</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" name="templateName">
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">模板状态</label>
                                            <div class="layui-input-block">
                                                <select name="templateStatus" lay-filter="templateStatus" lay-search>
                                                    <option value="">全部</option>
                                                    <option value="true">启用中</option>
                                                    <option value="false">已禁用</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">创建人</label>
                                            <div class="layui-input-block" lay-search>
                                                <select name="creator" id="creator">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg6 layui-col-md6">
                                            <div class="layui-input-block fr">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-submit lay-filter="mailTemplateSearch" id="mailTemplateSearch">查询</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="btn-group fr">
                                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="mailmaintainTemlatetype">维护模板类型</button>
                                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="newMail" style="margin-top: 0;">新增模板</button>
                                </div>
                                <table class="layui-table" id="mailTemplateTable" lay-filter="mailTemplateTable"></table>
                                <div id="pageSort"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 新增/修改邮件弹框 -->
            <script type="text/html" id="pop_maileditTemlate">
                <form class="layui-form mg_50" id="maileditForm" lay-filter="maileditForm">
                    <div class="layui-col-lg6 layui-col-md6">
                        <label class="layui-form-label">平台</label>
                        <div class="layui-input-block">
                            <select name="platformCode" id="layerplatformCode" lay-filter="layerplatformCode" lay-verify="required"></select>
                        </div>
                    </div>
                    <div class="layui-col-lg6 layui-col-md6">
                        <label class="layui-form-label">模板类型</label>
                        <div class="layui-input-block">
                            <select name="templateTypeName" id="layertemplateTypeName" lay-verify="required"></select>
                        </div>
                    </div>

                    <div class="layui-col-lg6 layui-col-md6">
                        <label class="layui-form-label">模板名称</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="templateName" lay-verify="required">
                        </div>
                    </div>

                    <div class="layui-col-lg6 layui-col-md6">
                        <label class="layui-form-label">是否共享</label>
                        <div class="layui-input-block">
                            <select name="isShare" required lay-verify="required">
                                <option value="">全部</option>
                                <option value="true">共享</option>
                                <option value="false">私有</option>
                            </select>
                        </div>
                    </div>

                    <div class="layui-col-lg6 layui-col-md6">
                        <label class="layui-form-label">语言</label>
                        <div class="layui-input-block">
                            <select name="languageCode" id="layerlanguageCode" required lay-verify="required"></select>
                        </div>
                    </div>

                    <div class="layui-col-lg12 layui-col-md12">
                        <label class="layui-form-label">邮件主题</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="emailSubject">
                        </div>
                    </div>

                    <div class="layui-col-lg12 layui-col-md12">
                        <label class="layui-form-label">邮件正文</label>
                        <div class="layui-input-block">
                            <textarea class="layui-textarea" name="emailContent" cols="30" rows="10" lay-verify="required"></textarea>
                        </div>
                    </div>

                    <!-- 用于触发表单提交验证表单 -->
                    <input type="text" class="hide" lay-submit="" lay-filter="layersubmitmaileditform" id="layersubmitmaileditform">
                </form>
            </script>

            <!-- 维护模板类型 -->
            <script type="text/html" id="pop_mailmaintainTemlate">
                <form class="layui-form mg_50" id="maintaintemplateTypeNameForm">
                    <div class="layui-col-lg4 layui-col-md4">
                        <label class="layui-form-label">平台</label>
                        <div class="layui-input-block">
                            <select name="platformCode" id="maintainplatformCode"></select>
                        </div>
                    </div>
                    <div class="layui-col-lg4 layui-col-md4">
                        <label class="layui-form-label">模板类型</label>
                        <div class="layui-input-block">
                            <input name="templateTypeName" id="maintaintemplateTypeName" class="layui-input" lay-verify="required" />
                        </div>
                    </div>
                    <div class="layui-col-lg4 layui-col-md4">
                        <div class="layui-input-block fr">
                            <button class="layui-btn layui-btn-sm" type="button" id="templetTypeAdd" lay-filter="templetTypeAdd" lay-submit>新增</button>
                        </div>
                    </div>
                    <div class="layui-col-lg12 layui-col-md12">
                        <table class="layui-table" id="maintainTemplateTypeTable" lay-filter="maintainTemplateTypeTable"></table>
                    </div>
                </form>
            </script>

            <!-- 表格渲染模板 -->
            <!-- 维护模板类型操作 -->
            <script type="text/html" id="mailTemplateTypeOption">
                <button class="layui-btn layui-btn-xs layui-btn-danger" type="button" lay-event="mail_templateType">删除</button>
            </script>
            <!-- 维护模板类型操作 -->
            <!-- 操作 -->
            <script type="text/html" id="mailOptionTemplate">
                {{# if(d.templateStatus){ }}
                <button class="layui-btn layui-btn-xs layui-btn-danger " lay-event="mail_modify">禁用</button> {{# }else {}}
                <button class="layui-btn layui-btn-xs" lay-event="mail_modify">启用</button> {{# }}}
                <button class="layui-btn layui-btn-xs " lay-event="mail_edit">修改</button>
                <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="mail_delete">删除</button>
            </script>
            <!-- 模板状态 -->
            <script type="text/html" id="mailStatusTemplate">
                {{# if(d.templateStatus){ }}
                <div>启用中</div>
                {{# }else {}}
                <div class="red">已禁用</div>
                {{# }}}
            </script>
            <!-- 更新时间 -->
            <script type="text/html" id="mailTimeTemplate">
                <div>{{Format(d.modifyTime||"",'yyyy-MM-dd hh:mm:ss')}}</div>
            </script>

            <script type="text/html" id="mailisShareTemplate">
                {{# if(d.isShare){ }}
                <div>是</div>
                {{# }else {}}
                <div class="red">否</div>
                {{# }}}
            </script>
            <!-- 表格渲染模板 -->
            <script>
                layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload'], function() {
                    var form = layui.form,
                        table = layui.table,
                        element = layui.element,
                        laypage = layui.laypage,
                        upload = layui.upload;
                    layer = layui.layer;
                    var fullplatformData = [],
                        fullstoreData = [],
                        fulltemplateTypeName = [],
                        fullanguageCode = []
                    form.render('select');
                    mailTableRender({})

                    mailGetPlatform(function(data) {
                        fullplatformData = deepClone(data)
                        appendSelect({
                            pre: 'mailTemplateForm',
                            dom: 'platformCode',
                            data: data,
                            id: 'code',
                            name: 'code'
                        })
                        form.render('select')
                    })

                    mailGetCreator(function(data) {
                        appendSelect({
                            pre: 'mailTemplateForm',
                            dom: 'creator',
                            data: data,
                            id: 'name',
                            name: 'name'
                        })
                        form.render('select')
                    })
                    mailGetLanuage(function(data) {
                        fullanguageCode = deepClone(data)
                        appendSelect({
                            pre: 'mailTemplateForm',
                            dom: 'languageCode',
                            data: data,
                            id: 'code',
                        })
                        form.render('select')
                    })

                    mailGetTemplateType("", function(data) {
                            fulltemplateTypeName = deepClone(data)
                            appendSelect({
                                pre: 'mailTemplateForm',
                                dom: 'templateTypeName',
                                data: data,
                                id: 'name',
                            })
                            form.render('select')
                        })
                        // 获取平台列表
                    function mailGetPlatform(func) {
                        initAjax('/emailTemplate/queryAllPlatform.html', 'get', {}, function(returnData) {
                            if (func) {
                                func(returnData.data)
                            }
                        })
                    }
                    //获取创建人
                    function mailGetCreator(func) {
                        initAjax('/emailTemplate/queryCreatorByTemplate.html', 'get', {}, function(returnData) {
                            if (func) {
                                func(returnData.data)
                            }
                        })
                    }
                    //获取语言
                    function mailGetLanuage(func) {
                        initAjax('/emailTemplate/queryLanguage.html', 'get', {}, function(returnData) {
                            if (func) {
                                func(returnData.data)
                            }
                        })
                    }
                    //获取邮件类型
                    function mailGetTemplateType(platformCode, func) {
                        initAjax('/emailTemplate/queryTemplateTypeName.html', 'post', {
                            platformCode: platformCode
                        }, function(returnData) {
                            if (func) {
                                func(returnData.data)
                            }
                        }, 'application/x-www-form-urlencoded')
                    }
                    //修改邮件模板
                    function mailModify(data, func) {
                        initAjax('/emailTemplate/updateSysEmailTemplate.html', 'post', JSON.stringify(data), function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        })
                    }

                    //新增邮件模板
                    function mailnew(data, func) {
                        initAjax('/emailTemplate/saveSysEmailTemplate.html', 'post', JSON.stringify(data), function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        })
                    }
                    //删除邮件模板
                    function maildelete(id, func) {
                        initAjax('/emailTemplate/deleteSysEmailTemplate.html', 'post', {
                            id
                        }, function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        }, 'application/x-www-form-urlencoded')
                    }
                    //获取邮件模板类型列表
                    function mailGetTemplateTypeList(func) {
                        initAjax('/emailTemplate/querySysEmailTemplateTypeList.html', 'post', {}, function(returnData) {
                            if (func) {
                                func(returnData.data)
                            }
                        })
                    }
                    //新增邮件模板类型
                    function mailNewTemplatType(data, func) {
                        const {
                            platformCode,
                            templateTypeName
                        } = data
                        initAjax('/emailTemplate/saveSysEmailTemplateType.html', 'post', JSON.stringify({
                            platformCode,
                            templateTypeName
                        }), function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        })
                    }

                    //删除邮件模板类型
                    function mailDeleteTemplatType(id, func) {
                        initAjax('/emailTemplate/deleteSysEmailTemplateType.html', 'post', {
                            id
                        }, function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        }, 'application/x-www-form-urlencoded')
                    }

                    //启用/禁用邮件模板
                    function modifyStatus(data, func) {
                        const {
                            id,
                            templateStatus
                        } = data
                        initAjax('/emailTemplate/updateEmailTemplateStatus.html', 'post', JSON.stringify({
                            id,
                            templateStatus
                        }), function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        })
                    }
                    //渲染邮件模板表格
                    function mailTableRender(data) {
                        table.render({
                            elem: '#mailTemplateTable',
                            method: 'post',
                            url: ctx + '/emailTemplate/querySysEmailTemplateList.html',
                            where: data,
                            cols: [
                                [ //邮件模板表格
                                    {
                                        title: "平台",
                                        field: "platformCode",
                                    }, {
                                        title: "模板类型",
                                        field: "templateTypeName"
                                    }, {
                                        title: "语言",
                                        field: "languageName",
                                        width: 80,
                                    }, {
                                        title: "模板名称",
                                        field: "templateName"
                                    }, {
                                        title: "模板主题",
                                        field: "emailSubject"
                                    }, {
                                        title: "模板内容",
                                        field: "emailContent",
                                        width: 500
                                    }, {
                                        title: "是否共享",
                                        field: "isShare",
                                        width: 80,
                                        templet: "#mailisShareTemplate"
                                    }, {
                                        title: "创建人",
                                        field: "creator",
                                        width: 80,
                                    }, {
                                        title: "更新时间",
                                        field: "modifyTime",
                                        templet: "#mailTimeTemplate"
                                    }, {
                                        title: '模板状态',
                                        field: "templateStatus",
                                        templet: "#mailStatusTemplate",
                                        width: 100,
                                    }, {
                                        title: '操作',
                                        field: "",
                                        width: 50,
                                        toolbar: "#mailOptionTemplate"
                                    }
                                ]
                            ],
                            page: true,
                            limit: 20,
                            limits:[100,300,500],
                            id: 'mailTemplateTable',
                            done: function(data) {}
                        })
                    }

                    table.on('tool(mailTemplateTable)', function(obj) {
                            var data = obj.data
                            if (obj.event === "mail_edit") {
                                maileditpop('2', data)
                            } else if (obj.event === "mail_delete") {
                                layer.confirm('您确定要删除这条数据吗？', {
                                    btn: ['确定', '取消']
                                }, function(index) {
                                    maildelete(data.id, function(returnData) {
                                        layer.msg(returnData.msg || '删除成功');
                                        $('#mailTemplateSearch').click()
                                        layer.close(index)
                                    })
                                })
                            } else if (obj.event === 'mail_modify') {
                                var id = data.id
                                var templateStatus = !data.templateStatus
                                modifyStatus({
                                    id,
                                    templateStatus
                                }, function(returnData) {
                                    var msg = templateStatus ? '启用成功' : '禁用成功'
                                    layer.msg(returnData.msg || msg);
                                    $('#mailTemplateSearch').click()
                                })
                            }
                        })
                        //新增/修改邮件模板弹框
                    function maileditpop(type, data) {
                        var title = {
                            1: '新增邮件模板',
                            2: '修改邮件模板'
                        }
                        layer.open({
                            type: 1,
                            title: title[type],
                            btn: ['保存', '关闭'],
                            area: ['65%', '70%'],
                            content: $('#pop_maileditTemlate').html(),
                            success: function(layero, index) {
                                appendSelect({
                                    pre: 'maileditForm',
                                    dom: 'layerplatformCode',
                                    data: fullplatformData,
                                    id: 'code',
                                    name: 'code'
                                })
                                appendSelect({
                                    pre: 'maileditForm',
                                    dom: 'layerlanguageCode',
                                    data: fullanguageCode,
                                    id: 'code',
                                })
                                form.render();
                                if (type === "2") {
                                    data.isShare = data.isShare.toString()
                                    mailGetTemplateType(data.platformCode, function(returnData) {
                                        appendSelect({
                                            pre: 'maileditForm',
                                            dom: 'layertemplateTypeName',
                                            data: returnData,
                                            id: 'name',
                                        })
                                        form.val("maileditForm", data);
                                        form.render('select')
                                    })
                                } else if (type == "1") {
                                    appendSelect({
                                        pre: 'maileditForm',
                                        dom: 'layertemplateTypeName',
                                        data: fulltemplateTypeName,
                                        id: 'name',
                                    })
                                    form.render('select')
                                }
                            },
                            yes: function(index, layero) {
                                setTimeout(function() {
                                    $('#layersubmitmaileditform').click()
                                }, 0)
                                form.on('submit(layersubmitmaileditform)', function(obj) {
                                    obj.field.languageName = getMapValueByKey(obj.field.languageCode, fullanguageCode, 'code', 'name')
                                    if (type === '2') {
                                        obj.field.id = data.id
                                        mailModify(obj.field, function(returnData) {
                                            layer.msg(returnData.msg || '邮箱模板修改成功')
                                            $('#mailTemplateSearch').click()
                                            layer.close(index)
                                        })
                                    } else if (type === "1") {
                                        mailnew(obj.field, function(returnData) {
                                            layer.msg(returnData.msg || '邮箱模板新增成功')
                                            $('#mailTemplateSearch').click()
                                            layer.close(index)
                                        })
                                    }
                                    return false
                                })
                                return false
                            }
                        })
                    }
                    // 维护模板类型
                    function maintainTemplateType(type, data) {
                        layer.open({
                            type: 1,
                            title: '维护模板类型',
                            btn: ['关闭'],
                            area: ['65%', '70%'],
                            content: $('#pop_mailmaintainTemlate').html(),
                            success: function(layero, index) {
                                appendSelect({
                                    pre: 'maintaintemplateTypeNameForm',
                                    dom: 'maintainplatformCode',
                                    data: fullplatformData,
                                    id: 'code',
                                    name: 'code'
                                })
                                form.render()
                                mailGetTemplateTypeTable()
                                $('#templetTypeAdd').click(function() {
                                    form.on('submit(templetTypeAdd)', function(obj) {
                                        mailNewTemplatType(obj.field, function(returnData) {
                                            mailGetTemplateTypeTable()
                                        })
                                        return false;
                                    })

                                })
                            },
                            yes: function(index, layero) {
                                layer.close(index)
                                return false
                            }
                        })
                    }

                    function mailGetTemplateTypeTable() {
                        mailGetTemplateTypeList(function(returnData) {
                            table.render({
                                elem: '#maintainTemplateTypeTable',
                                method: 'post',
                                url: ctx + '/emailTemplate/querySysEmailTemplateTypeList.html',
                                where: {},
                                cols: [
                                    [ //邮件模板表格
                                        {
                                            title: "平台",
                                            field: "platformCode",
                                        }, {
                                            title: "模板类型",
                                            field: "templateTypeName"
                                        }, {
                                            title: "操作",
                                            field: "",
                                            toolbar: "#mailTemplateTypeOption"
                                        }
                                    ]
                                ],
                                page: false,
                                limit: 500,
                                id: 'maintainTemplateTypeTable',
                                done: function(data) {}
                            })
                        })
                    }

                    table.on('tool(maintainTemplateTypeTable)', function(obj) {
                            if (obj.event === 'mail_templateType') {
                                layer.confirm('您确定要删除这条数据吗？', {
                                    btn: ['确定', '取消']
                                }, function(index) {
                                    mailDeleteTemplatType(obj.data.id, function(returnData) {
                                        mailGetTemplateTypeTable()
                                        layer.msg(returnData.msg || '删除成功')
                                        layer.close(index)
                                    })
                                })
                            }
                        })
                        //表单提交
                    form.on('submit(mailTemplateSearch)', function(data) {
                        mailTableRender(data.field)
                    });

                    form.on('select(platformCode)', function(data) {
                        mailGetTemplateType(data.value, function(returnData) {
                            appendSelect({
                                pre: 'mailTemplateForm',
                                dom: 'templateTypeName',
                                data: returnData,
                                id: 'name',
                            })
                            form.render('select')
                        })
                    })

                    form.on('select(layerplatformCode)', function(data) {
                        mailGetTemplateType(data.value, function(returnData) {
                            appendSelect({
                                pre: 'maileditForm',
                                dom: 'layertemplateTypeName',
                                data: returnData,
                                id: 'name',
                            })
                            form.render('select')
                        })
                        if(data.value == 'ozon'){
                    <%--    initAjax('/emailTemplate/queryLanguageByPlatCode?platCode=ozon', 'get', {--%>
                    <%--    }, function(returnData) {--%>
                    <%--    console.log(returnData)--%>
                    <%--    })--%>
                            appendSelect({
                                pre: 'maileditForm',
                                dom: 'layerlanguageCode',
                                data: [{code: "ru",name: "俄语"}],
                                id: 'code',
                            })
                            $("#layerlanguageCode").val('ru')
                            form.render("maileditForm","select")
                        }else{
                            appendSelect({
                                pre: 'maileditForm',
                                dom: 'layerlanguageCode',
                                data: fullanguageCode,
                                id: 'code',
                            })
                        }
                    })

                    $('#newMail').click(function() {
                        maileditpop('1')
                    })

                    $('#mailmaintainTemlatetype').click(function() {
                            maintainTemplateType()
                        })
                        //填充下拉框
                    function appendSelect(obj) {
                        const {
                            pre,
                            dom,
                            data,
                            id,
                            name
                        } = obj
                        $('#' + pre + ' #' + dom).empty();
                        var option = '<option value="">全部</option>'
                        for (var i in data) {
                            data[i].id = data[i].id || data[i][id];
                            data[i].name = data[i].name || data[i][name];
                            option += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                        }
                        $('#' + pre + ' #' + dom).append(option)
                    }

                    function getMapValueByKey(keyvalue, arr, keyname, valuename) {
                        for (const i in arr) {
                            if ((arr[i][keyname] || arr[i].code).toString() === keyvalue) {
                                return arr[i][valuename] || arr[i].name
                            }
                        }
                    }
                    //初始化ajax请求
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
                                loading.hide()
                                if (returnData.code == "0000") {
                                    func(returnData)
                                } else {
                                    layer.msg(returnData.msg, {
                                        icon: 2
                                    });
                                }
                            },
                            error: function(returnData) {
                                layui.admin.load.hide();
                                if (XMLHttpRequest.status == 200) {
                                    layer.msg("请重新登录", {
                                        icon: 7
                                    });
                                } else {
                                    layer.msg("服务器错误");
                                }
                            },
                            complete: function(returnData) {
                                loading.hide()
                                if (func3) {
                                    func3(returnData)
                                }
                            }
                        })
                    }

                    function deepClone(obj) {
                        let newObj
                        if (Array.isArray(obj)) { // 判断复制的目标是不是数组
                            newObj = []
                        } else if (typeof obj === 'object') {
                            newObj = {}
                        } else {
                            newObj = obj
                        }
                        if (typeof obj === 'object') {
                            for (const item in obj) {
                                if (obj.hasOwnProperty(item)) {
                                    if (obj[item] && typeof obj[item] === 'object') {
                                        newObj[item] = deepClone(obj[item])
                                    } else {
                                        newObj[item] = obj[item]
                                    }
                                }
                            }
                        }
                        return newObj
                    }
                })
            </script>