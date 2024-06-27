layui.use(['form', 'table','layer', 'laydate', 'laypage'], function() {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        laydate = layui.laydate,
        layer = layui.layer;
        form.render()
        var followSellPlan = {
            init:function(fn){
                var _this = this
                let argus = arguments
                _this.submitForm()
                _this.newFollowSellPlan()
                if(fn){
                    fn.apply(_this,argus)
                }
            },
            submitForm:function(){
                var _this = this
                form.on('submit(followSellPlanSearch)',function(obj){
                    var data = obj.field
                    getfollowSellPlanList(data,function(returnData){
                        _this.followSellPlanTable(returnData.data)
                        _this.followSellPlanPage(data,returnData.count)
                    })
                })
            },
            followSellPlanTable:function(data){
                var _this = this
                table.render({
                    elem: '#followSellPlan_table',
                    data: data,
                    cols: [
                        [
                            { title: "计划名称", field: "planName" },
                            { title: "计划策略", field: "offTime",templet:"#followSellPlan_rule"},
                            { title: "时间", field: "createTime", templet: "#followSellPlan_createTime" },
                            { title: "状态", field: "status",templet:'#followSellPlan_status'},
                            { title: "操作", toolbar:"#followSellPlan_tool",width:100 },
                        ]
                    ],
                    page: false,
                    limit:Number.MAX_VALUE,
                    id: 'followSellPlan_table',
                    created:function(res){
                    },
                    done: function(res) {
                        _this.listenOntool()
                    }
                })
            },
            followSellPlanPage:function(data,count){
                laypage.render({
                    elem: 'followSellPlanPage',
                    curr: data.page,
                    limit: data.limit,
                    limits: [100, 200, 500],
                    layout: ['prev', 'page', 'next', 'count','limit'],
                    count: count,
                    jump: function(obj, first) {
                        $('#followSellPlanForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                        $('#followSellPlanForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                        //首次不执行
                        if (!first) {
                            data.page = obj.curr;
                            data.limit = obj.limit;
                            $('#followSellPlanSearch').click()
                        }
        
                    }
                });
            },
            listenOntool:function(){
                var _this = this
                table.on('tool(followSellPlan_table)',function(obj){
                    var data = obj.data
                    var event = obj.event
                    if(event=="followsellplan_modify"){
                        _this.modifyfolloeSellPlanPop(data)
                    }else if(event=="followsellplan_del"){
                        _this.deletefollowSellPlan(data.id)
                    }else if(event=="followsellplan_off"||event=="followsellplan_on"){
                        var status = !data.status
                        var id = data.id
                        _this.setfollowSellPlanStatus({status,id})
                    }
                })
            },
            newFollowSellPlan:function(){
                var _this = this
                $('#LAY-followSellPlan').find('#followSellPlannew').click(function(){
                    _this.modifyfolloeSellPlanPop()
                })
            },
            modifyfolloeSellPlanPop:function(data){
                var _this = this
                var isEdit = data?true:false
                var title =isEdit?'修改跟卖策略':'新增跟卖策略'
                layer.open({
                    type: 1,
                    title: title,
                    btn: ['提交','关闭'],
                    area:['30%','40%'],
                    content: $('#followSellPlan_modifyPop').html(),
                    success: function(layero, index) {
                        laydate.render({
                            elem:'#onlineTime',
                            type:'time'
                        })
                        laydate.render({
                            elem:'#offlineTime',
                            type:'time'
                        })
                        if(isEdit){
                            form.val('followSellPlaneditForm',data)
                        }
                        form.render()
                    },
                    yes: function(index, layero) {
                        form.on('submit(followSellPlaneditSubmit)',function(data){
                            saveFollowSellPlan(data.field,function(returnData){
                                layer.msg(returnData.msg||'保存成功',{icon:1})
                                layer.close(index)
                                $('#followSellPlanSearch').click()
                            })
                        })
                        $('#followSellPlaneditSubmit').click()
                    }
                })
            },
            deletefollowSellPlan:function(id){
                layer.confirm('确定删除这条跟卖计划信息?',function(index){
                    delFollowSellPlan(id,function(returnData){
                        layer.msg(returnData.msg||"删除成功")
                        layer.close(index)
                        $('#followSellPlanSearch').click()
                    })
                });
            },
            setfollowSellPlanStatus:function(data){
                var tips = data.status?'启用成功':'停用成功'
                setFollowSellPlanStatus(data,function(returnData){
                    layer.msg(returnData.msg||tips,{icon:1})
                    $('#followSellPlanSearch').click()
                })
            }
        }

        followSellPlan.init(function(){
            $('#followSellPlanSearch').click()
        })
        //页面请求
        // 获取跟卖计划列表数据
        function getfollowSellPlanList(data,func){
            initAjax('/amazonFsPlan/queryPage.html', 'post', JSON.stringify(data), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }
        //保存修改数据
        function saveFollowSellPlan(data,func){
            initAjax('/amazonFsPlan/saveOrEdit.html', 'post', JSON.stringify(data), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }
        //删除品牌数据
        function delFollowSellPlan(id,func){
            initAjax('/amazonFsPlan/delete.html', 'post', JSON.stringify({id:id}), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }

        //启用/停用跟卖计划
        function setFollowSellPlanStatus(data,func){
            initAjax('/amazonFsPlan/setStatus.html', 'post', JSON.stringify(data), function(returnData) {
                if (func) {
                    func(returnData)
                }
            })
        }
        // 页面请求

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