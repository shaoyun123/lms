layui.use(['form', 'table','layer', 'element', 'laypage'], function(){
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        element = layui.element,
        layer = layui.layer;
        
        var AmazonComplaint = {
            initData:{
                siteEnum:null,
                storeEnum:null
            },
            init:function(){
                var _this = this
                render_hp_orgs_users("#AmazonComplaintForm");
                ComplaintgetAmazonSiteEnum(function(returnData){
                    _this.initData.siteEnum = returnData.data
                    appendSelect($('#AmazonComplaintForm').find('select[name="salesSite"]'),returnData.data,'code','name')
                })
                ComplaintgetAmazonstorelistEnum(function(returnData){
                    _this.initData.storeEnum = returnData.data
                })
                _this.submitForm()
                _this.newComplaint()
            },
            submitForm:function(){
                var _this = this
                form.on('submit(AmazonComplaintSearch)',function(obj){
                    var data = obj.field
                    data[data.strType] = data.strValue
                    const {creatorId,storeAcctId,salesSite,prodSSkuStr,asinStr,brandStr,limit,page} = data
                    getAmazonComplaint({creatorId,storeAcctId,salesSite,prodSSkuStr,asinStr,brandStr,limit,page},function(returnData){
                        _this.AmazonComplaintTable(returnData.data)
                        _this.AmazonComplaintPage(data,returnData.count)
                    })
                })
            },
            AmazonComplaintTable:function(data){
                var _this = this
                table.render({
                    elem: '#AmazonComplaint_table',
                    data: data,
                    cols: [
                        [
                            { checkbox: true, width: 30 },
                            { title: "品牌名", field: "brand" },
                            { title: "店铺", field: "storeAcct"},
                            { title: "站点", field: "salesSite"},
                            { title: "子ASIN", field: "asin"},
                            { title: "父ASIN", field: "parentAsin"},
                            { title: "商品子SKU", field: "prodSSku"},
                            { title: "投诉次数", field: "voteTotalTimes"},
                            { title: "备注", field: "remark"},
                            { title: "时间", field: "createTime",templet:'#AmazonComplaint_time',width:200},
                            { title: "创建人", field: "creator"},
                            { title: "操作", toolbar:"#AmazonComplaint_tool",width:120 },
                        ]
                    ],
                    page: false,
                    limit:Number.MAX_VALUE,
                    id: 'AmazonComplaint_table',
                    done: function(res) {
                        _this.listenOntool()
                    }
                })
            },
            AmazonComplaintPage:function(data,count){
                laypage.render({
                    elem: 'AmazonComplaintPage',
                    curr: data.page,
                    limit: data.limit,
                    limits: [100, 200, 500],
                    layout: ['prev', 'page', 'next', 'count','limit'],
                    count: count,
                    jump: function(obj, first) {
                        $('#AmazonComplaintForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                        $('#AmazonComplaintForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                        //首次不执行
                        if (!first) {
                            data.page = obj.curr;
                            data.limit = obj.limit;
                            $('#AmazonComplaintSearch').click()
                        }
        
                    }
                });
            },
            listenOntool:function(){
                var _this = this
                table.on('tool(AmazonComplaint_table)',function(obj){
                    var data = obj.data
                    var event = obj.event
                    if(event=="amazoncomplaint_modify"){
                        _this.modifyComplaintPop(data)
                    }else if(event=="amazoncomplaint_remove"){
                        _this.deleteComplaint(data.id)
                    }else if(event=="amazoncomplaint_offshelf"){
                        _this.offshefComplaint(data.id)
                    }
                })
            },
            newComplaint:function(){
                var _this = this
                $('#LAY-AmazonComplaint').find('#AmazonComplaintNew').click(function(){
                    _this.modifyComplaintPop()
                })
            },
            modifyComplaintPop:function(data){
                var _this = this
                var isEdit = data?true:false
                var title =isEdit?'修改投诉':'新增投诉'
                layer.open({
                    type: 1,
                    title: title,
                    btn: ['提交','关闭'],
                    area:['50%','50%'],
                    content: $('#AmazonComplaint_modify').html(),
                    success: function(layero, index) {
                        appendSelect($('#amazonComplainteditForm').find('select[name="storeAcctId"]'),_this.initData.storeEnum,'id','storeAcct')
                        appendSelect($('#amazonComplainteditForm').find('select[name="salesSite"]'),_this.initData.siteEnum,'code','name')
                        if(isEdit){
                            form.val('amazonComplainteditForm',data)
                        }
                        form.render()
                    },
                    yes: function(index, layero) {
                        form.on('submit(amazonComplainteditSubmit)',function(data){
                            saveAmazonComplaint(data.field,function(returnData){
                                layer.msg(returnData.msg||'保存成功',{icon:1})
                                layer.close(index)
                                $('#AmazonComplaintSearch').click()
                            })
                        })
                        $('#amazonComplainteditSubmit').click()
                    }
                })
            },
            deleteComplaint:function(id){
                layer.confirm('确定移除这条投诉信息?',function(index){
                    delAmazonComplaint(id,function(returnData){
                        layer.msg(returnData.msg||"删除成功")
                        layer.close(index)
                        $('#AmazonComplaintSearch').click()
                    })
                });
            },
            offshefComplaint:function(id){
                layer.confirm('确定下架这条投诉信息?',function(index){
                    offshefAmazonComplaint(id,function(returnData){
                        layer.msg(returnData.msg||"下架成功")
                        layer.close(index)
                        $('#AmazonComplaintSearch').click()
                    })
                });
            }
        }

        AmazonComplaint.init()
        //页面请求
        //获取店铺列表
        function ComplaintgetAmazonstorelistEnum(func){
            initAjax('/sys/liststore.html', 'post', {roleNames:'amazon专员',platCode:'amazon',autoFollowSell:true}, function(returnData) {
                if (func) {
                    func(returnData)
                }
            },'application/x-www-form-urlencoded')
        }   
        // 获取投诉列表数据
        function getAmazonComplaint(data,func){
            initAjax('/amazonFsBrandComplaint/queryPage.html', 'post', JSON.stringify(data), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }
        //保存修改数据
        function saveAmazonComplaint(data,func){
            initAjax('/amazonFsBrandComplaint/saveOrEdit.html', 'post', JSON.stringify(data), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }
        //删除品牌数据
        function delAmazonComplaint(id,func){
            initAjax('/amazonFsBrandComplaint/delete.html', 'post', JSON.stringify({id:id}), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }

        //删除品牌数据
        function offshefAmazonComplaint(id,func){
            initAjax('/amazonFsBrandComplaint/cancleFsAutoList.html', 'post', JSON.stringify({id:id}), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }

        //获取站点枚举数据
        function ComplaintgetAmazonSiteEnum(func){
            initAjax('/enum/getSiteEnum.html?platCode=amazon', 'post',{}, function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }
        // 页面请求

        function appendSelect(aDom, data, code, label, attachment) {
            aDom.empty();
            var option = '<option value="">请选择</option>'
            for (var i in data) {
                if (typeof data[i] !== 'string') {
                        data[i].code = data[i][code] || data[i].code
                    data[i].label = data[i][label] || data[i].label;
                }
                option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
            }
            aDom.append(option)
            form.render()
        }

    function initAjax(url, method, data, func, contentType) { //初始化ajax请求
        loading.show()
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
        })
    }

});