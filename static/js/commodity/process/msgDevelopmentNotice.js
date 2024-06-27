var msgType = [];
var msgDevelopmentNotice_reload;
var isfirst = true;
layui.use(['admin', 'form', 'layer','table', 'formSelects', 'element', 'laydate'], function() {
	 var admin = layui.admin,
     form = layui.form,
     layer = layui.layer,
     table = layui.table,
     formSelects = layui.formSelects,
     element = layui.element,
     laydate = layui.laydate,
     $ = layui.$;
     form.render(null, 'component-form-element');
     element.render('breadcrumb', 'breadcrumb');
     form.render('select')
    formSelects.render('msg_typetpl');

    //日期范围
    laydate.render({
        elem: '#msg_time'
        ,type: 'date'
        ,range: true
    });
    $(function(){
        var endTime = new Date(new Date().getTime());
        var startTime = new Date(new Date().getTime() - 30*24*3600*1000);
        var timeStr = Format(startTime,"yyyy-MM-dd")+" - "+Format(endTime,"yyyy-MM-dd");
        $('#msg_time').val(timeStr);
    });

     table.render({
            elem: "#msg_development_table",
            method:'post',
            url: ctx + "/msgDevelopmentNotice/getpageMsgInfo.html",
            cols: [[
                {type: "checkbox", width: 32},
                { field: "id", title: "id" },
                { field: "pImg", templet:'#pImageTpl',title: "图片",width:70},
                { field: "cnTitle", title: "中文名称" ,templet:'#titleTpl'},
                { field: "prodSSku", title: "需求子sku",templet:'#sskuTpl'},
                { field: "tempPSku", title: "关联模板父sku",templet:'#storePskuTpl'},
                { field: "creator", title: "需求人",width:65},
                { field: "demandType", title: "需求类型", templet: '#msgDevelopmentNotice_demandType'},
                { field: "demandDesc", title: "需求备注"},
                { field: "createTime",templet:'<div>{{ Format(d.createTime,"yyyy-MM-dd hh:mm:ss")}}</div>',title: "创建时间" ,width:100},
                { field: "msgTime",templet:'<div>{{ Format(d.msgTime,"yyyy-MM-dd hh:mm:ss")}}</div>',title: "通知时间" ,width:100},
                { field: "处理进度",unresize:true,width:300,templet:'#develop_msg_process_tpl', title: "<div style='width:140px;float: left;'>部门</div> <div style='width:150px;float: left;'>处理状态</div>"},
                { title: '操作', toolbar: '#processMsgBar'}
            ]],
            where:serializeObject($('#msg_development_searchForm')),
            page:true,
            id:"msg_development_table",
            limits:[50,100,200],
            limit:50,
            done:function(res, curr, count){
                let queryType = $('#msg_development_searchForm').find('[name=queryType]').val()
                //展开所有
                $('#msgDevelopmentNotice_expandAll').trigger('click');
                var cont1 = $('.ms-cont1'),
                    cont2 = $('.ms-cont2');
                cont1.click(function(){
                    $(this).hide().next().show();
                });
                cont2.click(function(){
                    $(this).hide().prev().show();
                })
                cont1.each(function(){
                    var that = $(this), txt = that.text();
                    that.text(cutString(txt,30));
                })
                if(queryType ==1){
                    $("#tolnum_span_before").text(count);
                    $('.edit-btn').css('display', '');
                    $('.process-btn').css('display', '');
                    $('.genBatchProcess-btn').css('display', '');
                    $('.cancel-btn').css('display', '');
                    $('.del-btn').css('display', 'none');
                    $('.copymsgNoticePsku').css('display', '');
                }else if(queryType ==0){
                    $("#tolnum_span_toPublish").text(count);
                    $('.edit-btn').css('display', '');
                    $('.process-btn').css('display', 'none');
                    $('.genBatchProcess-btn').css('display', 'none');
                    $('.cancel-btn').css('display', '');
                    $('.del-btn').css('display', '');
                    $('.copymsgNoticePsku').css('display', 'none');
                }else if(queryType ==2){
                    $("#tolnum_span_on").text(count);
                    $('.edit-btn').css('display', 'none');
                    $('.process-btn').css('display', 'none');
                    $('.genBatchProcess-btn').css('display', 'none');
                    $('.cancel-btn').css('display', 'none');
                    $('.del-btn').css('display', 'none');
                    $('.copymsgNoticePsku').css('display', '');
                }else{
                    $("#tolnum_span_after").text(count);

                    $('.edit-btn').css('display', 'none');
                    $('.process-btn').css('display', 'none');
                    $('.genBatchProcess-btn').css('display', 'none');
                    $('.cancel-btn').css('display', 'none');
                    $('.del-btn').css('display', 'none');
                    $('.copymsgNoticePsku').css('display', 'none');
                }
                $("[data-field='id']").css('display', 'none');
                //图片懒加载
                imageLazyload();
                $('.develop_msg_process_nodealperson_tip').on('mouseenter', function(){
                    var that = this;
                    var tips=$(this).attr("tips");
                    if(tips){
                        tips="以下人员未处理：</br><div style='word-wrap:break-word;'>"+tips+"</div>";
                        layer.tips(tips, that,{tips:[1,'#333'],time: 0}); //在元素的事件回调体中，follow直接赋予this即可
                    }
                }).on('mouseleave', function(){
                    layer.closeAll("tips");
                });
                $('.develop_msg_process_dealperson_tip').on('mouseenter', function(){
                    var that = this;
                    var tips=$(this).attr("tips");
                    if(tips){
                        tips="以下人员已处理：</br><div style='word-wrap:break-word;'>"+tips+"</div>";
                        layer.tips(tips, that,{tips:[1,'#333'],time: 0}); //在元素的事件回调体中，follow直接赋予this即可
                    }
                }).on('mouseleave', function(){
                    layer.closeAll("tips");
                });

            }
        });

    // 初始化 组织-人员选择框
    render_hp_orgs_users("#msg_development_searchForm")


    var formDom = $("#msg_development_searchForm")
    var buyerUserSelect = formDom.find('.user_org_costom_all');
    var buyerRoleNames = 'wish专员,ebay专员,joom专员,shopee专员,amazon专员,lazada专员,smt专员,fyndiq专员';
    render_developer_all_orgs_users(buyerUserSelect,buyerRoleNames)

    /**
     * 展示所有平台专员包含的一级部门
     * @param orgSelect
     * @param roleNames
     */
    function render_developer_all_orgs_users(orgSelect,roleNames) {
        $.ajax({
            type: 'post',
            url: ctx + '/sys/getPersonAndOrgsByRole.html',
            dataType: 'json',
            data: {roleNames: roleNames},
            success: function (returnData) {
                console.log(returnData)
                var data
                data = returnData.data
                // 初始化部门
                orgSelect.append(getAOption('', ''));
                for (var i in data.orgTree) {
                    orgTree = data.orgTree[i];
                    orgSelect.append(getAOption(orgTree.id, orgTree.name, null, '0'))
                }
                layui.form.render('select')
            }
        })
    }

    //发布
    $("#publish_msg").click(function(){
        var data = table.checkStatus('msg_development_table').data
        let queryType = $('#msg_development_searchForm').find('[name=queryType]').val()
        if(data.length==0){
            layer.msg("请选中需要发布的开发通知")
            return false;
        }
        if(queryType !='0'){
            layer.msg("请选择未发布的开发通知")
            return false;
        }
        var ids = [];
        for(var i in data){
            ids.push(data[i].id);
        }
      if(ids!=null && ids.length>0){
          var obj = {};
          obj.ids = ids.join(',');
          loading.show();
          $.ajax({
              type:'post',
              url:ctx +'/msgDevelopmentNotice/publishMsg.html',
              data:obj,
              dataType:'json',
              success:function(returnData){
                  layer.msg(returnData.msg)
                  $("#msgSearchBtn").trigger('click');
                  loading.hide();
              }
          })
      }
    })

    $('.msgDevelopmentNotice_labelTab').click(function (e) {
        console.log(e)
        let queryType = e.target.getAttribute('data-type')
        $('#msg_development_searchForm').find('[name=queryType]').val(queryType)
        msgDevelopmentNotice_reload();
    })
    
     //添加活动登记按钮
    $("#add_msg").click(function(){
        var Obj = {};
        dataOrgList = null;
        let queryType = $('#msg_development_searchForm').find('[name=queryType]').val()
        openAddMsg(Obj,true,'2',queryType);
    })

    //搜索
    $("#msgSearchBtn").click(function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    msgDevelopmentNotice_reload = function (){
        table.reload('msg_development_table', {
            where: serializeObject($('#msg_development_searchForm'))
        });
    }
    var active = {
        reload: function () {
            msgDevelopmentNotice_reload();
        }
    };

    var batch_develop_msg_select_person = [];
    var batch_develop_msg_orgXTree;//组织树
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on('tool(msg_development_table)', function (obj) {
        var data = obj.data, //获得当前行数据
            layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'process') {
            layer.confirm('确定处理吗？', {
                btn: ['确定','取消'], //按钮
                shade: false //不显示遮罩
            }, function(index){
                var id = data.id;
                var obj = {};
                obj.id = id;

            });
        } else if (layEvent === 'del') {
            layer.confirm('确定删除该条数据吗？', {
                btn: ['确定','取消'], //按钮
                shade: false //不显示遮罩
            }, function(index){
                var id = data.id;
                var obj = {};
                obj.id = id;
                loading.show()
                $.ajax({
                    type: "POST",
                    url: ctx + "/msgDevelopmentNotice/deleteMsg.html",
                    data: obj,
                    dataType: "json",
                    success: function (returnData) {
                        loading.hide()
                        msgDevelopmentNotice_reload(queryType)
                        if (returnData.code == "0000") {
                            $("#msgSearchBtn").trigger('click');
                            layer.msg("删除成功");
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
            });
        }else if (layEvent === 'cancel') {
            layer.confirm('作废不可还原，确认要作废吗？', {
                btn: ['确定','取消'], //按钮
                shade: false //不显示遮罩
            }, function(index){
                var id = data.id;
                var obj = {};
                obj.id = id;
                loading.show()
                $.ajax({
                    type: "POST",
                    url: ctx + "/msgDevelopmentNotice/obsoleteMsg.html",
                    data: obj,
                    dataType: "json",
                    success: function (returnData) {
                        loading.hide()
                        msgDevelopmentNotice_reload(queryType)
                        if (returnData.code == "0000") {
                            $("#msgSearchBtn").trigger('click');
                            layer.msg("作废成功");
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
            });
        }else if (layEvent === 'genBatchProcess') {//待人处理
            var id = data.id;
            var obj = {};
            obj.id = id;
            obj.prodSku = data.prodPSku;
            loading.show();
            $.ajax({
                type:"post",
                url:ctx + "/msgDevelopmentNotice/getNeedProcessUser.html",
                dataType:"json",
                data:obj,
                success:function(returnData){
                    loading.hide();
                    console.log(returnData)
                    if(returnData.code=='0000'){
                        var index = layer.open({
                            type: 1,
                            title: '选择批量处理销售平台人员',
                            area: ['45%', '45%'],
                            btn: ['保存', '关闭'],
                            content: $('#batch_develop_msg_org_layer').html(),
                            success: function (layero, index) {
                                loading.hide()
                                batch_develop_msg_orgXTree = new layuiXtree({
                                    elem: 'batch_develop_msg_orgXTree', //(必填) 放置xtree的容器id，不要带#号,
                                    form: form, //(必填) layui 的 from,
                                    isopen: false, //加载完毕后的展开状态
                                    ckall: true,   //启用全选功能，默认值：false
                                    data: returnData.data.orgList, //(必填) json数组
                                    color: { //三种图标颜色，独立配色，更改几个都可以
                                        open: "#EE9A00", //节点图标打开的颜色
                                        close: "#EEC591", //节点图标关闭的颜色
                                        end: "#828282", //末级节点图标的颜色
                                    },
                                    click: function (data) { //节点选中状态改变事件监听，全选框有自己的监听事件

                                    }
                                });
                                batch_develop_msg_orgXTree.render();
                                // $("#un_listing_text").text(returnData.data.unlisting_platCode);
                            },
                            yes: function (index1, layero) {
                                var choosePerson =[];
                                var obj = new Object();
                                obj.allneedProcessPerson = [];
                                obj.todoPerson = [];

                                batch_develop_msg_select_person = batch_develop_msg_orgXTree.GetAllChecked();
                                console.log(batch_develop_msg_select_person)
                                if (batch_develop_msg_select_person == null || batch_develop_msg_select_person.length == 0) {//没有选择销售人员
                                    layer.msg("请至少选择一个销售人员", {icon: 0});
                                    return false;
                                } else {
                                    for (var i in batch_develop_msg_select_person) {
                                        var title =batch_develop_msg_select_person[i].title;
                                        var value =batch_develop_msg_select_person[i].value||batch_develop_msg_select_person[i];
                                        if(!choosePerson[title]){//避免重复添加
                                            choosePerson.push(title);
                                        }
                                        if (value.indexOf("user") != -1) {//用户节点
                                            obj.todoPerson.push(value);
                                            var userId = value.split("_")[1];
                                            obj.allneedProcessPerson.push(userId)
                                        }
                                    };

                                    obj.todoPerson=obj.todoPerson.join(",");
                                    obj.allneedProcessPerson = obj.allneedProcessPerson.join(",");
                                    obj.id = id;
                                    loading.show();
                                    $.ajax({
                                        type:"post",
                                        url:ctx + "/msgDevelopmentNotice/batchProcessMsg.html",
                                        data:obj,
                                        dataType:"json",
                                        success:function(returnData){
                                            loading.hide();
                                            $("#msgSearchBtn").trigger('click');
                                            layer.msg(returnData.msg);
                                            if(returnData.code ==''){

                                            }
                                        }
                                    })
                                }
                                layer.close(index);
                            }
                        });
                    }else{
                        layer.msg(returnData.msg)
                    }
                    loading.hide();
                }
            })
        }else if (layEvent === 'edit') {
                var id = data.id;
                console.log(data)
                var obj = {};
                obj.id = id;
             obj.prodSku = data.prodPSku;
                loading.show()
                $.ajax({
                    type: "POST",
                    url: ctx + "/msgDevelopmentNotice/selectOneMsg.html",
                    data: obj,
                    dataType: "json",
                    success: function (returnData) {
                        loading.hide()
                        if (returnData.code === "0000") {
                            dataOrgList = returnData.data.dataOrgList;
                            console.log('dataOrgList'+dataOrgList)
                            let queryType = $('#msg_development_searchForm').find('[name=queryType]').val()
                            openAddMsg(returnData.data.msgData,false,'2',queryType);
                        } else {
                            layer.msg(returnData.msg);
                        }
                    },
                    error: function () {
                        layer.msg("服务器正忙");
                    }
                });
        }
    });

    form.on('select(org_process_status_filter)', function(obj){
        var $val = $('#user_org_costom_all_id').val();
        if(obj.value != ''){
           if($val==''){
               return layer.msg('请先选择要查询的部门');
           }
        }
    })

    // 导出
    $('#msgDevelopmentNotice_export').click(function () {
        var data = {}
        var searchParam = serializeObject($('#msg_development_searchForm'))
        checkNull(searchParam)
        if (!searchParam.msg_time) {
            layer.msg('请选择查询时间。 且时间跨度最大为60天')
            return
        }
        let timeArr = searchParam.msg_time.split(' - ')
        let begin = new Date(timeArr[0])
        let end = new Date(timeArr[1])
        let diffDay = (end.getTime() - begin.getTime())/(1000*3600*24)
        if (diffDay > 60) {
            layer.msg('请选择查询时间。 且时间跨度最大为60天')
            return
        }

        // 获取被选中的sku
        var checkStatus = table.checkStatus('msg_development_table'),
            selectedDtoList = checkStatus.data
        var idList = []
        if (selectedDtoList.length > 0) {
            for (var i = 0; i < selectedDtoList.length; ++i) {
                idList.push(selectedDtoList[i].id)
            }
            searchParam.idList = idList
        }
        let tip = "确认按照查询条件导出开发通知吗?";
        if (idList.length > 0) {
            tip = "确认导出所选的开发通知吗?";
        }
        data.searchParam = JSON.stringify(searchParam)

        var Confirmindex = layer.confirm(tip, { btn: ['确认', '取消'] }, function() {
            submitForm(data, ctx + '/msgDevelopmentNotice/export', '_blank')
            layer.close(Confirmindex)
        })
    })

    // 复制父sku
    $(".copymsgNoticePsku").click(function(){
        var data = layui.table.checkStatus('msg_development_table').data
        if(data.length <= 0){
            layer.msg("请选择需要复制父SKU的数据",{icon:7})
        }else{
            let pskuList = data.map(item => item.prodPSku)
            copyTxtToClipboard(pskuList.join())
        }
    })

});
function cutString(str, len) {
    //length属性读出来的汉字长度为1
    if(str.length*2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = "";
    for(var i = 0;i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if(strlen >= len){
                return s.substring(0,s.length-1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if(strlen >= len){
                return s.substring(0,s.length-2) + "...";
            }
        }
    }
    return s;
}

function msgDevelopmentNotice_copyTxt(obj, event){
    if (event) {
        event.stopPropagation();
    }
    var parentDom = $(obj).parent();
    var txt = parentDom.find('div.ms-cont2').text();
    var oInput = document.createElement('input'); //创建一个input元素
    oInput.value = txt;
    parentDom.append(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.remove();
    layer.msg('复制成功');
    return false;
}


function msgOnline_changeColspantable(obj) {
    $(obj).prev().find(".myj-hide").toggle();
    var str=$(obj).html();
    if(str.indexOf("展开")>-1){
        $(obj).html("- 收起")
    }else{
        $(obj).html("+ 展开")
    }
}

function expandmsgNoticeAll(){
    var allShow = $('.msgDevelopmentNoticeInfoShow')
    for (var i = 0; i < allShow.length; i++) {
        var showi = allShow[i]
        if ($(showi).html().indexOf('展开') > -1) {
            $(showi).trigger('click')
        }
    }
}

function handlemsgNoticeAll(){
    var data = layui.table.checkStatus('msg_development_table').data
    let queryType = $('#msg_development_searchForm').find('[name=queryType]').val()
    if(data.length==0){
        layer.msg("请选中需要批量处理的开发通知")
        return false;
    }
    if(queryType !='1'){
        layer.msg("请选择待处理的开发通知")
        return false;
    }
    var ids = [];
    for(var i in data){
        ids.push(data[i].id);
    }
    if(ids!=null && ids.length>0){
        var obj = {};
        obj.id = ids.join(',');
        loading.show();
        $.ajax({
            type: "POST",
            url: ctx + "/msgDevelopmentNotice/processMsg.html",
            data: obj,
            dataType: "json",
            success: function (returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    layer.confirm(returnData.msg, {icon: 1, title:'提示'}, function(index){
                        $("#msgSearchBtn").trigger('click');
                        layer.close(index);
                    });
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            }
        });
    }
}

function PackUpmsgNoticeAll(){
    var allShow = $('.msgDevelopmentNoticeInfoShow')
    for (var i = 0; i < allShow.length; i++) {
        var showi = allShow[i]
        if ($(showi).html().indexOf('收起') > -1) {
            $(showi).trigger('click')
        }
    }
}

var msgDevelopmentNotice_msgTypeMap
function msgDevelopmentNotice_getNoticeType(typeCode) {
    if (!msgDevelopmentNotice_msgTypeMap) {
        msgDevelopmentNotice_InitMsgTypeMap()
    }
    return msgDevelopmentNotice_msgTypeMap[typeCode]
}
// 初始化需求类型映射
function msgDevelopmentNotice_InitMsgTypeMap() {
    msgDevelopmentNotice_msgTypeMap = {}
    let optionList = $('#msgDevelopmentNotice_msgTypeDiv').find('option')
    for (let i = 0; i < optionList.length;++i) {
        msgDevelopmentNotice_msgTypeMap[optionList[i].value] = optionList[i].innerText
    }
}