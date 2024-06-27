layui.use(['form', 'table', 'layer', 'element', 'laypage', 'upload'], function() {
    var form = layui.form,
        table = layui.table,
        element = layui.element,
        laypage = layui.laypage,
        upload = layui.upload;
    layer = layui.layer;

    var app = new Vue({
        el: '#amazonmail',
        data: {
            formData: {
                email: "",
                isSend: ""
            },
            num: { '0': 0, '1': 0, '2': 0, '3': 0 ,'4': 0},
            amazonmailList: [],
            isAll: false,
            curremailcontent: null,
            currmessage: null,
            fileList: [],
            fileObjList: [],
            showtext: true,
            uploadaction: ctx + '/amazonMail/uploadAttachment.html',
            mailTypeEnum: null,
            mailEnum: null,
            replyMailContent: "",
            activeTab: 0,
            preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
            touchend: false, //没有更多数据
            directhit: false,
            clickId: ''
        },
        computed: {},
        watch: {},
        beforecreated() {},
        created() {},
        mounted() {
            var that = this
            element.init();
            form.render();
            render_hp_orgs_users("#amazonMailForm");
            that.getEmailList({ platCode: 'amazon' })
            that.checkAll()
            that.asyncCheckAll()
            that.getMailTemplateType('amazon')
            that.getMailTemplateList()
            form.on('select(amazonmail_storeAcct)', function(obj) {
                var data = serializeObject($('#amazonMailForm'))
                that.getEmailList({ storeAcctId: obj.value, platCode: 'amazon', salePersonId: data.salePersonId, roleName: 'amazon专员' })
            })
            form.on('select(amazonuserList)', function(obj) {
                var data = serializeObject($('#amazonMailForm'))
                that.getEmailList({ storeAcctId: data.storeAcctId, platCode: 'amazon', salePersonId: obj.value, roleName: 'amazon专员' })
            })
            form.on('submit(amazonAsynEmail)', function(obj) {
                that.amazonAsynEmail(obj.field.email)
            })
            form.on('submit(amazonAsynEmail)', function(obj) {
                that.amazonAsynEmail(obj.field.email)
            })
            form.on('submit(amazonMailSearch)', function(obj) {
                var event = event ? event : window.event;
                event.stopPropagation();
                that.formData.email = obj.field.email
                that.formData.isSend = obj.field.isSend
                if(obj.field.emailType == 4){
                    $("[lay-filter=isReciveHide]").show()
                    $("[lay-filter=isRecive]").hide()
                }else{
                    $("[lay-filter=isReciveHide]").hide()
                    $("[lay-filter=isRecive]").show()
                }
                that.getMailList(obj.field, function(returnData) {
                    if(obj.field.emailType == 4){
                        returnData.data = returnData.data.map(item => {
                            item.fromName = 'notification'
                            return item
                        })
                    }
                    returnData.data = returnData.data.map(function(item) {
                        item.timediff = item.isTimeOut ? '超时未回复' : that.resetTime(item)
                        return item
                    })
                    that.num[obj.field.emailType] = returnData.count
                    if ((obj.field.page > 1) && (that.directhit)) {
                        that.amazonmailList = that.unique('id', [...that.amazonmailList, ...returnData.data]);
                        if (returnData.data.length < 10) {
                            that.touchend = true;
                            return false;
                        }
                        that.directhit = false
                        that.preventRepeatReuqest = false;
                    } else {
                        that.amazonmailList = returnData.data
                        that.directhit = false
                    }
                })
            })
            element.on('tab(mailTypeTab)', function(data) {
                $('#amazonMailForm input[name="emailType"]').val(data.index)
                $('#amazonMailForm input[name="page"]').val(1)
                that.activeTab = data.index
                that.touchend = false;
                if(data.index == 4){
                    $('[name="email"]').attr("lay-verify","")
                }else{
                    $('[name="email"]').attr("lay-verify","required")
                }
                $('#amazonMailSearch').click()
            });
            element.on('nav(isRecive)', function(elem) {
                var index = $(elem).attr('data-index')
                switch (index) {
                    case 'isSend':
                        $('#amazonMailForm input[name="isSend"]').val(1)
                        $('#amazonMailForm input[name="folderName"]').val('')
                        $('#amazonMailForm input[name="page"]').val(1)
                        that.touchend = false;
                        $('#amazonMailSearch').click()
                        break;
                    case 'all':
                        $('#amazonMailForm input[name="isSend"]').val(0)
                        $('#amazonMailForm input[name="ourFlag"]').val(2)
                        $('#amazonMailForm input[name="folderName"]').val('')
                        $('#amazonMailForm input[name="page"]').val(1)
                        that.touchend = false;
                        $('#amazonMailSearch').click()
                        break;
                    case 'isRead':
                        $('#amazonMailForm input[name="isSend"]').val(0)
                        $('#amazonMailForm input[name="ourFlag"]').val(0)
                        $('#amazonMailForm input[name="folderName"]').val('')
                        $('#amazonMailForm input[name="page"]').val(1)
                        that.touchend = false;
                        $('#amazonMailSearch').click()
                        break;
                    case 'Junk':
                        $('#amazonMailForm input[name="isSend"]').val(0)
                        $('#amazonMailForm input[name="folderName"]').val('Junk')
                        $('#amazonMailForm input[name="page"]').val(1)
                        that.touchend = false;
                        $('#amazonMailSearch').click()
                        break;
                    case 'Inbox':
                        $('#amazonMailForm input[name="isSend"]').val(0)
                        $('#amazonMailForm input[name="ourFlag"]').val(2)
                        $('#amazonMailForm input[name="folderName"]').val('Inbox')
                        $('#amazonMailForm input[name="page"]').val(1)
                        that.touchend = false;
                        $('#amazonMailSearch').click()
                        break;
                    default:
                        break;
                }
            });

            element.on('nav(isReciveHide)', function(elem) {
                var index = $(elem).attr('data-index')
                switch (index) {
                    case 'all':
                        $('#amazonMailForm input[name="folderName"]').val('')
                        $('#amazonMailForm input[name="ourFlag"]').val(2)
                        $('#amazonMailForm input[name="page"]').val(1)
                        $('#amazonMailSearch').click()
                        break;
                    case 'isRead':
                        $('#amazonMailForm input[name="folderName"]').val('')
                        $('#amazonMailForm input[name="ourFlag"]').val(1)
                        $('#amazonMailForm input[name="page"]').val(1)
                        $('#amazonMailSearch').click()
                        break;
                    case 'noRead':
                        $('#amazonMailForm input[name="folderName"]').val('')
                        $('#amazonMailForm input[name="ourFlag"]').val(0)
                        $('#amazonMailForm input[name="page"]').val(1)
                        $('#amazonMailSearch').click()
                        break;
                    case 'asin异常':
                        $('#amazonMailForm input[name="folderName"]').val('asin异常')
                        $('#amazonMailForm input[name="page"]').val(1)
                        $('#amazonMailForm input[name="ourFlag"]').val(2)
                        $('#amazonMailSearch').click()
                        break;
                    default:
                        break;
                }
            });
            form.on('select(templateType)', function(obj) {
                that.getMailTemplateList(obj.value)
            })
            form.on('select(templateName)', function(obj) {
                that.getMailTemplateContent(obj.value)
            })
            var scroller = document.getElementById('maillist')
            scroller.addEventListener("scroll", that.loaderMore);
        },
        methods: {
            checkEamil(id, type) { //查看邮件
                var that = this
                that.clickId = id
                var index = that.getIndex('id', that.amazonmailList, id)
                that.amazonmailList[index].ourFlag = 1
                that.getEmailDetail(id, type, that.formData.email, that.formData.isSend)
            },

            uploadsuccess(response, file, fileList) {
                var that = this
                    // for (var i in fileList || []) {
                    //     if (fileList[i].response.data) {
                    //         that.fileList.push(fileList[i].response.data.attachment)
                    //     }
                    // }
                that.fileList = (fileList || []).map(function(item) {
                    console.log(item.response.data)
                    if (item.response.data) {
                        return item.response.data.attachment
                    }
                })
            },
            removeFile(file, fileList) {
                var that = this
                var index = that.fileList.indexOf(file.response.data.attachment)
                if (index > -1) {
                    that.fileList.splice(index, 1)
                }
            },

            beforeUpload(file) { // 上传图片前回调
                const isLt2M = file.size / 1024 / 1024 < 10
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 10MB!')
                }
                return isLt2M
            },

            replyMailOption() {
                var that = this;
                var obj = {}
                obj.attachment = JSON.stringify(that.fileList)
                obj.plainContent = that.replyMailContent
                var curremail = that.curremailcontent.filter(function(item) {
                    return item.lastReplayEmail
                })
                obj.email = curremail[0].replayEmail
                obj.emailId = curremail[0].id
                obj.fromName = curremail[0].replayEmailName
                obj.toEmail = curremail[0].fromEmail
                obj.replyMessageId = curremail[0].replyMessageId
                obj.fromEmail = curremail[0].replayEmail
                that.replyMail(obj)
            },
            batchMarkOption(markType) {
                var that = this
                var checkArray = that.amazonmailList.filter(function(item) {
                    return item.ischecked
                })
                var ids = (checkArray.map(function(item) {
                    return item.id
                }) || []).join(',')
                if (ids.length > 0) {
                    that.batchMark({ markType, ids })
                } else {
                    layer.msg('请勾选需要批量操作的邮件')
                }
            },
            downloadAttachment(attachment) {
                var that = this
                that.downLoad(attachment)
            },
            // 接口请求函数-------------------------------------------------------------
            getMailList(data, func) { //获取邮件列表
                var that = this
                var { email, emailSubject, emailType, folderName, fromEmail, fromName, isSend, limit, orderId, ourFlag, page } = data
                that.initAjax('/amazonMail/searchEmail.html',
                    'post', { email, emailSubject, emailType, folderName, fromEmail, fromName, isSend, limit, orderId, ourFlag, page },
                    function(returnData) {
                        if (func) {
                            func(returnData)
                        }
                        setTimeout(function() {
                            form.render()
                        }, 0)
                    }, 'application/x-www-form-urlencoded')
            },
            getEmailList(data) { //获取邮箱列表
                var that = this
                var { platCode, roleName, salePersonId, storeAcctId } = data
                that.initAjax('/amazonMail/getEmailListByStoreId.html',
                    'post', { platCode, roleName, salePersonId, storeAcctId },
                    function(returnData) {
                        that.appendSelect({
                            pre: 'amazonMailForm',
                            dom: 'amazonmail__email',
                            data: returnData.data
                        })
                        form.render()
                    }, 'application/x-www-form-urlencoded')
            },
            amazonAsynEmail(email) { //同步邮件
                var that = this
                that.initAjax('/amazonMail/syncEmail.html', 'get', { email: email },
                    function(returnData) {
                        layer.msg(returnData.msg || '同步成功')
                    }, 'application/x-www-form-urlencoded')
            },
            getEmailDetail(id, emailType, email, isSend) { //获取邮件详情
                var that = this
                that.initAjax('/amazonMail/getEmailById.html',
                    'get', { id, emailType, email, isSend },
                    function(returnData) {
                        that.curremailcontent = returnData.data
                        that.currmessage = JSON.parse(returnData.msg)
                        setTimeout(function() {
                            that.disabledAllLink()
                            form.render()
                        }, 0)
                    }, 'application/x-www-form-urlencoded')
            },
            getMailTemplateType(platformCode) { //获取邮件模板类型
                var that = this
                that.initAjax('/emailTemplate/queryTemplateTypeName.html', 'post', {
                    platformCode: platformCode
                }, function(returnData) {
                    that.mailTypeEnum = returnData.data
                    setTimeout(function() {
                        form.render()
                    }, 0)
                })
            },
            getMailTemplateList(templateTypeName) { //获取邮件模板列表
                var that = this
                that.initAjax('/emailTemplate/queryTemplateName.html', 'get', { templateTypeName: templateTypeName }, function(returnData) {
                    that.mailEnum = returnData.data
                    setTimeout(function() {
                        form.render()
                    }, 0)
                })
            },
            getMailTemplateContent(id) {
                var that = this
                that.initAjax('/amazonMail/getEmailTemplateContentById.html', 'get', { id: id }, function(returnData) {
                    that.replyMailContent = returnData.data.emailContent
                })
            },
            replyMail(data) { //回复邮件
                var that = this
                var { fromEmail, attachment, email, emailId, fromName, plainContent, replyMessageId, toEmail } = data
                that.initAjax('/amazonMail/sendEmail.html',
                    'post', { fromEmail, attachment, email, emailId, fromName, plainContent, replyMessageId, toEmail },
                    function(returnData) {
                        that.$message({
                            message: returnData.data || '回复成功',
                            type: 'success'
                        })
                        var curremail = that.curremailcontent.filter(function(item) {
                            return item.lastReplayEmail
                        })
                        const { id, emailType } = curremail[0]
                        that.getEmailDetail(id, emailType, that.formData.email, that.formData.isSend)
                    }, 'application/x-www-form-urlencoded')
            },

            batchMark(data) { //批量操作
                var that = this
                var { ids, markType } = data
                that.initAjax('/amazonMail/batchUpdateHasReplyPlat.html',
                    'post', { ids, markType },
                    function(returnData) {
                        that.$message({
                            message: returnData.data || '标记成功',
                            type: 'success'
                        })
                    }, 'application/x-www-form-urlencoded')
            },
            downLoad(attachment) {
                var that = this
                    // var $eleForm = $("<form method='get'></form>");
                    // $eleForm.attr("action", );
                    // $(document.body).append($eleForm);
                    //提交表单，实现下载
                    // $eleForm.submit();
                window.open(ctx + '/amazonMail/downAttachment.html?attachment=' + attachment)
            },
            // 接口请求函数-------------------------------------------------------------
            checkAll() { //全选反选
                var _this = this
                form.on('checkbox(checkall)', function(data) {
                    var event = event ? event : window.event;
                    event.stopPropagation();
                    _this.isAll = data.elem.checked
                    if (data.elem.checked) {
                        for (var i in _this.amazonmailList) {
                            _this.amazonmailList[i].ischecked = true
                        }
                    } else {
                        for (var i in _this.amazonmailList) {
                            _this.amazonmailList[i].ischecked = false
                        }
                    }
                    setTimeout(function() {
                        form.render('checkbox')
                    }, 0)
                });

            },
            asyncCheckAll() { //  同步全选反选
                var _this = this
                form.on('checkbox(itemCheckbox)', function(data) {
                    var event = event ? event : window.event;
                    event.stopPropagation();
                    var i = $(data.elem).attr('data-index')
                    _this.amazonmailList[i].ischecked = data.elem.checked
                    if (data.elem.checked) {
                        for (var j in _this.amazonmailList) {
                            if (!_this.amazonmailList[j].ischecked) {
                                _this.isAll = false
                                return false
                            } else {
                                _this.isAll = true
                            }
                        }
                    } else {
                        _this.isAll = false
                    }
                    setTimeout(function() {
                        form.render('checkbox')
                    }, 0)
                });
            },
            unique(id, arr) {
                var idarr = [];
                var finalarr = [];
                for (var i = 0; i < arr.length; i++) {
                    var index = idarr.indexOf(arr[i][id]);
                    if (index == -1) {
                        finalarr.push(arr[i]);
                        idarr.push(arr[i][id]);
                    }
                }
                return finalarr;
            },
            loaderMore() {
                var that = this
                if (this.touchend) {
                    return
                } //防止重复请求 
                if (this.preventRepeatReuqest) {
                    return
                }
                var height = document.getElementById('maillist').offsetHeight
                var scrollTop = document.getElementById('maillist').scrollTop
                var scrollHeight = document.getElementById('maillist').scrollHeight
                    //滚动条到底部的条件
                if ((scrollTop + height >= scrollHeight - 5) && !that.directhit) {
                    var page = Number($('#amazonMailForm input[name="page"]').val())
                    page = page + 1
                    that.directhit = true
                    $('#amazonMailForm input[name="page"]').val(page)
                    $('#amazonMailSearch').click()
                }
            },
            //填充下拉框
            appendSelect(obj) {
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
                    if (typeof data[i] === 'string') {
                        option += '<option value="' + data[i] + '">' + data[i] + '</option>'
                    } else {
                        data[i].id = data[i][id] || data[i].id;
                        data[i].name = data[i][name] || data[i].name;
                        option += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                }
                $('#' + pre + ' #' + dom).append(option)
            },

            disabledAllLink() {
                $('.mailbox').find('a').each(function() {
                    $(this).attr('href', 'javasript:;')
                    $(this).attr('disabled', true)
                })
                $('.mailbox').find('button').each(function() {
                    $(this).attr('disabled', true)
                })
            },

            //计算当前剩余时间
            resetTime(item) {
                var diff = '';
                var oldtime = new Date(item.calculatorSendDate).getTime()
                var time_diff = new Date().getTime() - oldtime; //时间差的毫秒数 

                //计算出小时数 
                var leave1 = time_diff % (24 * 3600 * 1000);
                var hours = Math.floor(leave1 / (3600 * 1000));
                //计算相差分钟数 
                var leave2 = leave1 % (3600 * 1000);
                var minutes = Math.floor(leave2 / (60 * 1000));
                restMinute = 60 - minutes
                resthour = 24 - hours - 1
                diff = resthour + 'h' + restMinute + 'min'
                return item.status ? '已回复' : diff;
            },
            getMapValueByKey(keyvalue, arr, keyname, valuename) {
                for (const i in arr) {
                    if ((arr[i][keyname] || arr[i].code).toString() === keyvalue) {
                        return arr[i][valuename] || arr[i].name
                    }
                }
            },

            deepClone(obj) {
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
            },

            initAjax(url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
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
            },

            getArrayfromObj(obj) { //将键值对应的对象转化为name,value字段的数组对象
                var arr = []
                for (var i in obj) {
                    arr.push({ attributeName: i, attributeValue: obj[i] })
                }
                return arr
            },
            getIndex(id, arr, value) { //获取某个取值属性在对象数组中的下标
                for (var i = 0; i < arr.length; i++) {
                    if (value == arr[i][id]) {
                        return i;
                    }
                }
                return -1;
            },
            getOption(id, data, selected) {
                var html = ""
                for (var i = 0; i < data.length; i++) {
                    if (selected && selected === data[i].code) {
                        html += '<option value="' + data[i].code + '" selected>' + data[i].name + '</option>'
                    } else {
                        html += '<option value="' + data[i].code + '">' + data[i].name + '</option>'
                    }
                }
                $('#' + id).append(html)
                setTimeout(function() {
                    form.render()
                }, 0)
            },
        },
    })

})