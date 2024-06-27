<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>邮件配置</title>
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
                .redStar:before{
                    content: "*";
                    color: red;
                    font-size: 20px;
                    position: relative;
                    top: 7px;
                    right: 10px;
                }
            </style>
            <div class="layui-fluid" id="LAY-mailConfigure">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="mailConfigureForm" lay-filter="mailConfigureForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">平台</label>
                                            <div class="layui-input-block">
                                                <select name="platformCode" id="platformCode" lay-filter="platformCode" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select name="storeAcct" id="storeAcctId" lay-filter="storeAcctId" lay-search>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">发件箱</label>
                                            <div class="layui-input-block">
                                                <input type="text" name="sendEmail" class="layui-input">
                                            </div>
                                        </div>

                                        <div class="layui-col-lg3 layui-col-md3">
                                            <div class="layui-input-block fr">
                                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="mailConfigureSearch" lay-filter="mailConfigureSearch" lay-submit>查询</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="fr" style="display:flex;">
                                    <form class="layui-form" style="display:flex;">
                                        <select lay-filter="mailConfigure_export">
                                            <option>下载模板</option>
                                            <option>新增模板</option>
                                            <option>修改模板</option>
                                        </select>
                                        <select lay-filter="mailConfigure_import">
                                            <option>导入模板</option>
                                            <option>导入新增</option>
                                            <option>导入修改</option>
                                        </select>
                                    </form>
                                    <input type="hidden" class="mailConfigure_import_add">
                                    <input type="hidden" class="mailConfigure_import_edit">
                                    <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="newConfigure">新增</button></div>
                                <table class="layui-table" id="mailConfigureTable" lay-filter="mailConfigureTable"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 新增/修改邮件弹框 -->
            <script type="text/html" id="pop_editMailConfigure">
                <form class="layui-form mg_50" id="layermailConfilgureForm" lay-filter="layermailConfilgureForm" autocomplete="off">
                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">平台</label>
                        <div class="layui-input-block">
                            <select name="platformCode" id="layerplatformCode" lay-filter="layerplatformCode" required lay-verify="required"></select>
                        </div>
                    </div>
                    <div class="layui-form-item storeAcctId">
                        <label class="layui-form-label redStar">店铺</label>
                        <div class="layui-input-block">
                            <select name="storeAcctId" id="layerstoreAcctId" lay-search></select>
                        </div>
                    </div>
                    <div class="layui-form-item storeAcctIds">
                        <label class="layui-form-label redStar">店铺</label>
                        <div class="layui-input-block">
                            <select xm-select="mailConfilgure_storeAcctId" xm-select-search
                            xm-select-search-type="dl" xm-select-skin="normal" name="storeAcctIds" id="mailConfilgure_storeAcctId"></select>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">发件箱</label>
                        <div class="layui-input-block dis_flex">
                            <input type="text" class="layui-input" name="sendEmail" required lay-verify="required">
                            <select name="sendEmailSuffix" required lay-verify="required" required lay-verify="required">
                            <option value="@163.com">@163.com</option>
                            <option value="@126.com">@126.com</option>
                            <option value="@qq.com">@qq.com</option>
                            <option value="@sina.com">@sina.com</option>
                            <option value="@yahoo.com">@yahoo.com</option>
                            <option value="@outlook.com">@outlook.com</option>
                            <option value="@epean.com.cn">@epean.com.cn</option>
                            <option value="@162mail.com">@162mail.com</option>
                            <option value="@bodymindsculptor.com">@bodymindsculptor.com</option>
                            <option value="@caladok.com">@caladok.com</option>
                            <option value="@fancyleem.com">@fancyleem.com</option>
                            <option value="@modexhome.com">@modexhome.com</option>
                            <option value="@outlooksmail.com">@outlooksmail.com</option>
                            <option value="@peekademo.com">@peekademo.com</option>
                            <option value="@170mail.com">@170mail.com</option>
                            <option value="@govipmail.com">@govipmail.com</option>
                            <option value="@joymxmail.com">@joymxmail.com</option>
                            <option value="@shmxkj.com.cn">@shmxkj.com.cn</option>
                            <option value="@vipyeahnet.com">@vipyeahnet.com</option>
                            <option value="@yoymail.com">@yoymail.com</option>
                            <option value="@126vipmail.com">@126vipmail.com</option>
                            </select>
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label redStar">密码</label>
                        <div class="layui-input-block">
                            <input type="password" class="layui-input" name="authorizationCode" required lay-verify="required" autocomplete="new-password">
                        </div>
                    </div>

                    <div class="layui-form-item">
                        <label class="layui-form-label">发件邮箱名</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" name="sendName">
                        </div>
                    </div>

                    <!-- 用于触发表单提交验证表单 -->
                    <input type="text" class="hide" lay-submit="" lay-filter="layermailconfiguresubmitform" id="layermailconfiguresubmitform">
                </form>
            </script>
            <!-- 新增促销弹框 -->
            <!-- 测试弹框 -->
            <script type="text/html" id="pop_testMailConfigure">
                <form class="layui-form mg_50" id="layermailConfilgureForm" lay-filter="layermailConfilgureForm">
                    <div class="layui-form-item">
                        <label class="layui-form-label">收件</label>
                        <div class="layui-input-block dis_flex fr">
                            <button type="button" class="layui-btn layui-btn-xs ml" id="receiveTest">测试</button>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">发件</label>
                        <div class="layui-input-block dis_flex">
                            <input type="text" class="layui-input">
                            <button type="button" class="layui-btn layui-btn-xs ml" id="sendTest">测试</button>
                        </div>
                    </div>
                </form>
            </script>
            <!-- 测试弹框 -->
            <!-- 表格渲染模板 -->
            <!-- 操作 -->
            <script type="text/html" id="mailConfigureOptionTemplate">
                <button class="layui-btn layui-btn-xs" lay-event="get_mail_code">获取邮件</button>
                <button class="layui-btn layui-btn-xs" lay-event="mail_test">测试</button>
                <button class="layui-btn layui-btn-xs" lay-event="mail_edit">修改</button>
                <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="mail_delete">删除</button>
            </script>
            <!-- 表格渲染模板 -->
            <script>
                layui.use(['form', 'formSelects', 'table', 'layer', 'element', 'laypage', 'upload'], function() {
                    var form = layui.form,
                        table = layui.table,
                        element = layui.element,
                        laypage = layui.laypage,
                        formSelects = layui.formSelects,
                        upload = layui.upload;
                    layer = layui.layer;
                    var fullplatformData = []
                    fullstoreData = []
                    form.render('select');
                    mailConfigureTableRender({})
                    mailGetStore("", function(data) {
                        fullstoreData = deepClone(data)
                        appendSelect({
                            pre: 'mailConfigureForm',
                            dom: 'storeAcctId',
                            data: data,
                            id: 'storeAcct',
                            name: 'storeAcct'
                        })
                        form.render('select')
                    })

                    mailGetPlatform(function(data) {
                            fullplatformData = deepClone(data)
                            appendSelect({
                                pre: 'mailConfigureForm',
                                dom: 'platformCode',
                                data: data,
                                id: 'code',
                                name: 'code'
                            })
                            form.render('select')
                        })
                        // 获取平台列表
                    function mailGetPlatform(func) {
                        initAjax('/emailConfig/queryPlatCode.html', 'get', {}, function(returnData) {
                            if (func) {
                                func(returnData.data)
                            }
                        })
                    }
                    //获取店铺列表
                    function mailGetStore(platCode, func) {
                        initAjax('/emailConfig/queryStoreAcct.html', 'get', {
                            platCode: platCode || ""
                        }, function(returnData) {
                            if (func) {
                                func(returnData.data)
                            }
                        })
                    }
                    //修改邮箱
                    function mailConfiguremodify(data, func) {
                        // const{authorizationCode,platformCode,sendEmail,sendName,storeAcct,storeAcctId}
                        initAjax('/emailConfig/updateSysEmailConfig.html', 'post', JSON.stringify(data), function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        })
                    }
                    //新增邮箱
                    function mailConfigurenew(data, func) {
                        initAjax('/emailConfig/saveSysEmailConfig.html', 'post', JSON.stringify(data), function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        })
                    }
                    //删除邮箱
                    function mailConfigurendelete(id, func) {
                        initAjax('/emailConfig/deleteSysEmailConfig.html', 'post', {
                            id
                        }, function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        }, 'application/x-www-form-urlencoded')
                    }
                    // 测试发送
                    function testEmailSend(data, func) {
                        initAjax('/emailConfig/testSendEmail.html', 'post',
                            data,
                            function(returnData) {
                                if (func) {
                                    func(returnData)
                                }
                            }, 'application/x-www-form-urlencoded')
                    }
                    // 测试收件
                    function testEmailReceive(data, func) {
                        const {
                            sendEmail,
                            sendEmailSuffix
                        } = data
                        initAjax('/emailConfig/testReceiveEmail.html', 'post', {
                            sendEmail,
                            sendEmailSuffix
                        }, function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        }, 'application/x-www-form-urlencoded')
                    }
                    //获取密码
                    function mailGetAuthcode(id, func) {
                        initAjax('/emailConfig/queryById.html', 'get', {
                            id: id
                        }, function(returnData) {
                            if (func) {
                                func(returnData)
                            }
                        }, 'application/x-www-form-urlencoded')
                    }
                    //渲染邮件配置表格
                    function mailConfigureTableRender(data) {
                        table.render({
                            elem: '#mailConfigureTable',
                            method: 'post',
                            url: ctx + '/emailConfig/querySysEmailConfig.html',
                            where: data,
                            cols: [
                                [ //邮件模板表格
                                    {
                                        title: "平台",
                                        field: "platformCode",
                                    }, {
                                        title: "店铺",
                                        field: "storeAcct",
                                    }, {
                                        title: "发件箱",
                                        field: "sendEmail",
                                        templet: '<div>{{d.sendEmail}}{{d.sendEmailSuffix}}</div>'
                                    },
                                    //  {
                                    //     title: "密码",
                                    //     field: "authorizationCode",
                                    // },
                                    {
                                        title: "发件邮箱名",
                                        field: "sendName",
                                    }, {
                                        title: "操作",
                                        field: "mailConfigureOption",
                                        toolbar: "#mailConfigureOptionTemplate"
                                    }
                                ]
                            ],
                            page: true,
                            limit: 20,
                            id: 'mailConfigureTable',
                            done: function(data) {}
                        })
                    }
                    upload.render({
                        elem: ".mailConfigure_import_add", //绑定元素
                        url: `${ctx}/emailConfig/importInsert`, //上传接口
                        accept: 'file',//允许上传的文件类型
                        exts: 'xlsx|xls',
                        before: function () {
                            loading.show()
                        },
                        done: function(res) {
                            loading.hide()
                            if (res.code == '0000') {
                                let msg = res.msg + "<br>";
                                for(let key in res.data){
                                    msg += key +'：'+ JSON.stringify(res.data[key]) + "<br>";
                                }
                                layer.alert(msg || '上传成功',{ icon: 1 });
                            } else {
                                layer.alert(res.msg || '上传失败',{ icon: 2 });
                            }
                        },
                        error: function() {
                            loading.hide()
                            layer.msg('请求失败!');
                        }
                    });
                    upload.render({
                        elem: ".mailConfigure_import_edit", //绑定元素
                        url: `${ctx}/emailConfig/importUpdate`, //上传接口
                        accept: 'file',//允许上传的文件类型
                        exts: 'xlsx|xls',
                        before: function () {
                            loading.show()
                        },
                        done: function(res) {
                            loading.hide()
                            if (res.code == '0000') {
                                let msg = res.msg + "<br>";
                                for(let key in res.data){
                                    msg += key +'：'+ JSON.stringify(res.data[key]) + "<br>";
                                }
                                layer.alert(msg || '上传成功',{ icon: 1 });
                            } else {
                                layer.alert(res.msg || '上传失败',{ icon: 2 });
                            }
                        },
                        error: function() {
                            loading.hide()
                            layer.msg('请求失败!');
                        }
                    });
                    //表单提交
                    form.on('submit(mailConfigureSearch)', function(data) {
                        mailConfigureTableRender(data.field)
                    });
                    form.on('select(mailConfigure_export)', function(data) {
                        if(data.value == "新增模板"){
                            window.open('/lms/static/templet/importSysSendEmailInsertInfo.xlsx','_blank');
                        }else if(data.value == "修改模板"){
                            window.open('/lms/static/templet/importSysSendEmailUpdateInfo.xlsx','_blank');
                        }
                    })
                    form.on('select(mailConfigure_import)', function(data) {
                        if(data.value == "导入新增"){
                            $(".mailConfigure_import_add").click()
                        }else if(data.value == "导入修改"){
                            $(".mailConfigure_import_edit").click()
                        }
                    })
                    // 监听平台下拉框
                    form.on('select(platformCode)', function(data) {
                        mailGetStore(data.value, function(returnData) {
                            appendSelect({
                                pre: 'mailConfigureForm',
                                dom: 'storeAcctId',
                                data: returnData,
                                id: 'storeAcct',
                                name: 'storeAcct'
                            })
                            form.render('select')
                        })
                    })

                    form.on('select(layerplatformCode)', function(data) {
                        mailGetStore(data.value, function(returnData) {
                            fullstoreData = deepClone(returnData)
                            appendSelect({
                                pre: 'layermailConfilgureForm',
                                dom: 'layerstoreAcctId',
                                data: returnData,
                                id: 'id',
                                name: 'storeAcct'
                            })
                            form.render('select')
                            commonRenderSelect("mailConfilgure_storeAcctId", returnData, {
                                name: 'storeAcct',
                                code: 'id'
                            }).then(() => formSelects.render('mailConfilgure_storeAcctId'))
                        })
                    })

                    //监听表格操作栏
                    table.on('tool(mailConfigureTable)', function(obj) {
                        var data = obj.data
                        if (obj.event === "mail_edit") {
                            mailGetAuthcode(data.id, function(returnData) {
                                mailConfigureeditpop('2', returnData.data)
                            })
                        } else if (obj.event === "mail_delete") {
                            layer.confirm('您确定要删除这条数据吗？', {
                                btn: ['确定', '取消']
                            }, function(index) {
                                mailConfigurendelete(data.id, function(returnData) {
                                    layer.msg(returnData.msg || '删除成功');
                                    $('#mailConfigureSearch').click()
                                    layer.close(index)
                                })
                            })
                        } else if (obj.event === "mail_test") {
                            mailConfigureTest(data)
                        } else if (obj.event === "get_mail_code") {
                            commonReturnPromise({
                                url: `/lms/emailConfig/getVerificationCodeById`,
                                type: 'GET',
                                params: {"id":data.id}
                            }).then(function(result){
                                layer.alert(result);
                            })
                        }
                    })

                    //测试邮件配置
                    function mailConfigureTest(data) {
                        layer.open({
                            type: 1,
                            title: '测试',
                            btn: ['关闭'],
                            area: ['500px', '250px'],
                            content: $('#pop_testMailConfigure').html(),
                            success: function(layero, index) {
                                $('#receiveTest').click(function() {
                                    var obj = {}
                                    obj.sendEmail = data.sendEmail
                                    obj.sendEmailSuffix = data.sendEmailSuffix
                                    testEmailReceive(obj, function(returnData) {
                                        layer.msg(returnData.msg || '收件成功')
                                    })
                                })
                                $('#sendTest').click(function() {
                                    var toEmail = $(layero).find('input').val()
                                    if (toEmail !== "" && validEmail(toEmail)) {
                                        var id = data.id
                                        testEmailSend({
                                            id,
                                            toEmail
                                        }, function(returnData) {
                                            layer.msg(returnData.msg || '收件成功')
                                        })
                                    } else {
                                        layer.msg('请填写正确格式的邮件地址')
                                    }
                                })
                            },
                            yes: function(index, layero) {
                                layer.close(index)
                                return false
                            }
                        })
                    }

                    //新增/修改邮件模板弹框
                    function mailConfigureeditpop(type, data) {
                        var title = {
                            1: '新增发件邮箱',
                            2: '修改发件邮箱'
                        }
                        layer.open({
                            type: 1,
                            title: title[type],
                            btn: ['保存', '关闭'],
                            area: ['50%', '70%'],
                            content: $('#pop_editMailConfigure').html(),
                            success: function(layero, index) {
                                appendSelect({
                                    pre: 'layermailConfilgureForm',
                                    dom: 'layerplatformCode',
                                    data: fullplatformData,
                                    id: 'code',
                                    name: 'code'
                                })
                                form.render()
                                if (type === "2") {
    $(layero).find(".storeAcctIds").hide()
                                    mailGetStore(data.platformCode, function(returnData) {
                                        fullstoreData = deepClone(returnData)
                                        appendSelect({
                                            pre: 'layermailConfilgureForm',
                                            dom: 'layerstoreAcctId',
                                            data: returnData,
                                            id: 'id',
                                            name: 'storeAcct'
                                        })
                                        form.render('select')
                                        form.val("layermailConfilgureForm", data);
                                    })
                                } else if (type === "1") {
    $(layero).find(".storeAcctId").hide()
<%--                                    appendSelect({--%>
<%--                                        pre: 'layermailConfilgureForm',--%>
<%--                                        dom: 'layerstoreAcctId',--%>
<%--                                        data: fullstoreData,--%>
<%--                                        id: 'id',--%>
<%--                                        name: 'storeAcct'--%>
<%--                                    })--%>
                                }
                            },
                            yes: function(index, layero) {
                                setTimeout(function() {
                                    $('#layermailconfiguresubmitform').click()
                                })
                                form.on('submit(layermailconfiguresubmitform)', function(obj) {
                                    obj.field.storeAcct = getMapValueByKey(obj.field.storeAcctId, fullstoreData, 'id', 'storeAcct')
                                    if (type === '2') {
                                        if(obj.field.storeAcctId == ''){
                                            return layer.msg("必填项店铺不能为空", {icon:7})
                                        }
                                        obj.field.id = data.id
                                        mailConfiguremodify(obj.field, function(returnData) {
                                            layer.msg(returnData.msg || '邮箱配置修改成功')
                                            $('#mailConfigureSearch').click()
                                            layer.close(index)
                                        })
                                    } else if (type === '1') {
                                        if(obj.field.storeAcctIds == ''){
                                            return layer.msg("必填项店铺不能为空", {icon:7})
                                        }
                                        let storeAcctIds = formSelects.value('mailConfilgure_storeAcctId','code')
                                        let stores = []
                                        storeAcctIds.forEach(item => {
                                             stores.push({
                                                 "id": item.val,
                                                 "storeAcct": item.name
                                             })
                                        })
                                        mailConfigurenew({...obj.field,stores}, function(returnData) {
                                            let res = returnData.msg;
                                            if(returnData.data && returnData.data.length != 0){
                                                res += '失败店铺如下：' + "<br>" + returnData.data.join(",");
                                            }
                                            layer.alert(res || '邮箱配置新增成功')
                                            $('#mailConfigureSearch').click()
                                            layer.close(index)
                                        })
                                    }
                                    return false;
                                })
                                return false;
                            }
                        })
                    }

                    $('#newConfigure').click(function() {
                            mailConfigureeditpop('1')
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
                            data[i].id = data[i][id] || data[i].id;
                            data[i].name = data[i][name] || data[i].name;
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
                    // 校验邮件格式
                    function validEmail(email) {
                        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return reg.test(email)
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